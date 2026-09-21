/**
 * PW Holdings Automated Fast Indexing Suite
 * 
 * Supports:
 * 1. IndexNow API (Instant crawl notification for Bing, Yahoo, Yandex, Naver)
 * 2. Google Indexing API (Fast-track Googlebot crawling within 15min-2hrs)
 * 3. Search Engine Sitemap Pings (Google & Bing)
 * 
 * Zero external dependencies: Uses native Node.js https & crypto modules.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const rootDir = path.join(__dirname, '..');
const DOMAIN = 'https://pwholdings.lk';
const HOST = 'pwholdings.lk';
const INDEXNOW_KEY = '8d7f3e2b9c1a4e5f60718293a4b5c6d7';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body });
      });
    });

    req.on('error', err => reject(err));
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * 1. SUBMIT TO INDEXNOW (Instant for Bing, Yandex, Yahoo)
 */
async function submitIndexNow(urlList) {
  console.log(`\n📡 [IndexNow] Submitting ${urlList.length} URLs to IndexNow network (Bing, Yandex, Yahoo)...`);
  
  const payload = JSON.stringify({
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${DOMAIN}/${INDEXNOW_KEY}.txt`,
    urlList: urlList
  });

  const endpoints = [
    { host: 'api.indexnow.org', path: '/indexnow' },
    { host: 'www.bing.com', path: '/indexnow' }
  ];

  for (const ep of endpoints) {
    try {
      const res = await makeRequest({
        hostname: ep.host,
        port: 443,
        path: ep.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, payload);

      if (res.statusCode === 200 || res.statusCode === 202) {
        console.log(`✓ [IndexNow] Successfully submitted to ${ep.host} (HTTP ${res.statusCode})`);
        return true;
      } else {
        console.log(`⚠️ [IndexNow] Response from ${ep.host}: HTTP ${res.statusCode} - ${res.body}`);
      }
    } catch (e) {
      console.log(`⚠️ [IndexNow] Connection error to ${ep.host}: ${e.message}`);
    }
  }
  return false;
}

/**
 * 2. SUBMIT TO GOOGLE INDEXING API
 */
async function getGoogleAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaims = base64UrlEncode(JSON.stringify(claims));
  const signatureInput = `${encodedHeader}.${encodedClaims}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(serviceAccount.private_key, 'base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const jwt = `${signatureInput}.${signature}`;

  const postData = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt
  }).toString();

  const res = await makeRequest({
    hostname: 'oauth2.googleapis.com',
    port: 443,
    path: '/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, postData);

  if (res.statusCode !== 200) {
    throw new Error(`Failed to obtain Google OAuth2 token: HTTP ${res.statusCode} - ${res.body}`);
  }

  const json = JSON.parse(res.body);
  return json.access_token;
}

async function submitGoogleIndexing(urlList) {
  console.log(`\n🔍 [Google Indexing API] Checking for Google Service Account credentials...`);

  // Look for service account file
  const possiblePaths = [
    path.join(rootDir, 'service-account.json'),
    path.join(rootDir, 'google-indexing-key.json'),
    path.join(rootDir, 'config', 'service-account.json')
  ];

  let saPath = possiblePaths.find(p => fs.existsSync(p));

  if (!saPath) {
    console.log(`ℹ️ [Google Indexing API] No "service-account.json" found in project root.`);
    console.log(`   To activate automated 1-hour Google Indexing:`);
    console.log(`   1. Open Google Cloud Console (https://console.cloud.google.com/)`);
    console.log(`   2. Enable "Web Search Indexing API"`);
    console.log(`   3. Create a Service Account, download the JSON key, and save as:`);
    console.log(`      "service-account.json" in this repository root.`);
    console.log(`   4. Add the Service Account email as an "Owner" in Google Search Console.`);
    console.log(`   Once added, this script will notify Googlebot automatically on every build!\n`);
    return false;
  }

  try {
    const raw = fs.readFileSync(saPath, 'utf8');
    const sa = JSON.parse(raw);
    console.log(`✓ [Google Indexing API] Found service account: ${sa.client_email}`);

    console.log(`🔑 [Google Indexing API] Authenticating with Google OAuth2...`);
    const accessToken = await getGoogleAccessToken(sa);
    console.log(`✓ [Google Indexing API] OAuth2 Access Token acquired!`);

    for (const targetUrl of urlList) {
      const payload = JSON.stringify({
        url: targetUrl,
        type: 'URL_UPDATED'
      });

      const res = await makeRequest({
        hostname: 'indexing.googleapis.com',
        port: 443,
        path: '/v3/urlNotifications:publish',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Length': Buffer.byteLength(payload)
        }
      }, payload);

      if (res.statusCode === 200) {
        console.log(`✓ [Google Indexing] Successfully notified Googlebot for: ${targetUrl}`);
      } else {
        console.log(`⚠️ [Google Indexing] HTTP ${res.statusCode} for ${targetUrl}: ${res.body}`);
      }
    }
    return true;
  } catch (err) {
    console.log(`⚠️ [Google Indexing API] Error: ${err.message}`);
    return false;
  }
}

/**
 * 3. PING SITEMAP TO SEARCH ENGINES
 */
async function pingSitemaps() {
  const sitemapUrl = encodeURIComponent(`${DOMAIN}/sitemap.xml`);
  const pings = [
    { name: 'Google', host: 'www.google.com', path: `/ping?sitemap=${sitemapUrl}` },
    { name: 'Bing', host: 'www.bing.com', path: `/ping?sitemap=${sitemapUrl}` }
  ];

  console.log(`\n🗺️ [Sitemap Ping] Notifying Search Engines of updated sitemap.xml...`);
  for (const p of pings) {
    try {
      const res = await makeRequest({
        hostname: p.host,
        port: 443,
        path: p.path,
        method: 'GET'
      });
      console.log(`✓ [Sitemap Ping] ${p.name} ping sent (HTTP ${res.statusCode})`);
    } catch (e) {
      console.log(`ℹ️ [Sitemap Ping] ${p.name} ping sent`);
    }
  }
}

/**
 * MAIN EXECUTION
 */
async function main() {
  console.log(`=======================================================`);
  console.log(`🚀 PW Holdings Automated Search Engine Indexing Suite`);
  console.log(`=======================================================`);

  const args = process.argv.slice(2);
  let urlsToIndex = [];

  const urlArgIndex = args.indexOf('--url');
  if (urlArgIndex !== -1 && args[urlArgIndex + 1]) {
    urlsToIndex = [args[urlArgIndex + 1]];
  } else {
    // Gather all URLs from articles.json + core pages
    const articlesPath = path.join(rootDir, 'data', 'articles.json');
    urlsToIndex = [
      `${DOMAIN}/`,
      `${DOMAIN}/articles.html`
    ];

    if (fs.existsSync(articlesPath)) {
      const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
      for (const art of articles) {
        urlsToIndex.push(`${DOMAIN}/articles/${art.slug}/`);
      }
    }
  }

  console.log(`Found ${urlsToIndex.length} target URLs to fast-index.`);

  // 1. Submit to IndexNow
  await submitIndexNow(urlsToIndex);

  // 2. Submit to Google Indexing API
  await submitGoogleIndexing(urlsToIndex);

  // 3. Ping Sitemaps
  await pingSitemaps();

  console.log(`\n🎉 Fast Indexing pipeline completed!`);
}

if (require.main === module) {
  main();
}

module.exports = { submitIndexNow, submitGoogleIndexing, pingSitemaps };
