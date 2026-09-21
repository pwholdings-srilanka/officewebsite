const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const DOMAIN = 'https://pwholdings.lk';
const DEFAULT_IMAGE = 'https://pwholdings.lk/wp-content/uploads/2026/08/Gemini_Generated_Image_ovqv6vovqv6vovqv.png';
const LOGO_IMAGE = 'https://res.cloudinary.com/dib0fble7/image/upload/v1777898970/WhatsApp_Image_2026-04-20_at_9.04.34_AM_1_izs6ly.jpg';

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDateForXml(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {}
  return new Date().toISOString().split('T')[0];
}

function formatDateForIso(dateStr) {
  if (!dateStr) return new Date().toISOString();
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch (e) {}
  return new Date().toISOString();
}

function formatDateForRss(dateStr) {
  if (!dateStr) return new Date().toUTCString();
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toUTCString();
    }
  } catch (e) {}
  return new Date().toUTCString();
}

function loadArticles() {
  const articlesPath = path.join(rootDir, 'data', 'articles.json');
  if (!fs.existsSync(articlesPath)) {
    return [];
  }
  const raw = fs.readFileSync(articlesPath, 'utf8');
  return JSON.parse(raw);
}

function generateArticlePageHtml(art) {
  const title = art.title;
  const description = art.description;
  const canonicalUrl = art.url || `${DOMAIN}/articles/${art.slug}/`;
  const image = art.image || DEFAULT_IMAGE;
  const isoDate = formatDateForIso(art.date);

  return `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />

  <!-- ===================================================================
       1. ARTICLE SEO, GEO & AEO METADATA
       =================================================================== -->
  <title>${escapeXml(title)} | PW Holdings</title>
  <meta name="description" content="${escapeXml(description)}" />
  <meta name="keywords" content="${escapeXml(art.categoryLabel)}, Zoho Partner Sri Lanka, Cloud ERP Colombo, Zoho Books, PW Holdings" />
  <meta name="author" content="${escapeXml(art.author || 'PW Holdings Senior ERP Consultants')}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Local Geo Tags -->
  <meta name="geo.region" content="LK-11" />
  <meta name="geo.placename" content="Colombo, Sri Lanka" />
  <meta name="geo.position" content="6.9271;79.8612" />
  <meta name="ICBM" content="6.9271, 79.8612" />

  <!-- Open Graph / Social -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeXml(title)}" />
  <meta property="og:description" content="${escapeXml(description)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${escapeXml(image)}" />
  <meta property="og:site_name" content="PW Holdings" />
  <meta property="article:published_time" content="${isoDate}" />
  <meta property="article:author" content="${escapeXml(art.author || 'PW Holdings')}" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeXml(title)}" />
  <meta name="twitter:description" content="${escapeXml(description)}" />
  <meta name="twitter:image" content="${escapeXml(image)}" />

  <!-- Favicon & Fonts -->
  <link rel="icon" type="image/jpeg" href="${LOGO_IMAGE}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

  <!-- Discovery for AI Search Engines -->
  <link rel="help" href="/llms.txt" type="text/plain" title="LLM Context for AI Engines" />

  <!-- ===================================================================
       2. ARTICLE SCHEMA.ORG JSON-LD (SEO & AEO)
       =================================================================== -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "${canonicalUrl}#article",
        "headline": "${escapeXml(title)}",
        "description": "${escapeXml(description)}",
        "image": "${escapeXml(image)}",
        "datePublished": "${isoDate}",
        "dateModified": "${isoDate}",
        "author": {
          "@type": "Organization",
          "name": "${escapeXml(art.author || 'PW Holdings')}",
          "url": "${DOMAIN}/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "PW Holdings",
          "logo": {
            "@type": "ImageObject",
            "url": "${LOGO_IMAGE}"
          }
        },
        "mainEntityOfPage": "${canonicalUrl}"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "${canonicalUrl}#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "${DOMAIN}/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Insights",
            "item": "${DOMAIN}/articles.html"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "${escapeXml(title)}",
            "item": "${canonicalUrl}"
          }
        ]
      }
    ]
  }
  </script>

  <style>
    :root {
      --bg-dark: #070d1e;
      --bg-surface: #0e172e;
      --border-glass: rgba(255, 255, 255, 0.12);
      --primary: #0052CC;
      --primary-light: #3b82f6;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --font-heading: 'Plus Jakarta Sans', system-ui, sans-serif;
      --font-body: 'Inter', system-ui, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: var(--bg-dark); color: var(--text-main); font-family: var(--font-body); line-height: 1.7; overflow-x: hidden; }
    a { color: var(--primary-light); text-decoration: none; }
    a:hover { text-decoration: underline; }

    .navbar { background: rgba(7, 13, 30, 0.95); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border-glass); padding: 16px 24px; position: sticky; top: 0; z-index: 100; }
    .navbar-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .brand { display: flex; align-items: center; gap: 12px; color: #fff; text-decoration: none; font-family: var(--font-heading); font-weight: 800; font-size: 18px; }
    .brand img { width: 38px; height: 38px; border-radius: 8px; }
    .nav-links { display: flex; gap: 24px; align-items: center; }
    .nav-links a { color: var(--text-muted); font-size: 14px; font-weight: 600; text-decoration: none; }
    .nav-links a:hover { color: #fff; }
    .btn-cta { background: var(--primary); color: #fff !important; padding: 8px 18px; border-radius: 50px; font-weight: 700; }

    .article-wrap { max-width: 860px; margin: 40px auto 80px; padding: 0 20px; }
    .breadcrumb { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }
    .badge { display: inline-block; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); color: #93c5fd; padding: 5px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
    h1 { font-family: var(--font-heading); font-size: clamp(28px, 4.5vw, 42px); line-height: 1.25; margin-bottom: 20px; color: #fff; }
    .lead { font-size: 18px; color: #cbd5e1; line-height: 1.65; margin-bottom: 24px; }
    .byline { display: flex; gap: 16px; flex-wrap: wrap; padding: 14px 18px; background: var(--bg-surface); border: 1px solid var(--border-glass); border-radius: 12px; font-size: 13px; color: var(--text-muted); margin-bottom: 30px; }
    .hero-img { width: 100%; max-height: 440px; object-fit: cover; border-radius: 16px; border: 1px solid var(--border-glass); margin-bottom: 36px; }

    .article-body h2 { font-family: var(--font-heading); font-size: 24px; color: #fff; margin: 36px 0 16px; }
    .article-body h3 { font-family: var(--font-heading); font-size: 20px; color: #93c5fd; margin: 28px 0 12px; }
    .article-body p { margin-bottom: 20px; font-size: 16px; color: #cbd5e1; }
    .article-body ul, .article-body ol { margin: 0 0 24px 24px; color: #cbd5e1; }
    .article-body li { margin-bottom: 8px; }
    .callout { background: rgba(30, 41, 59, 0.7); border-left: 4px solid var(--primary-light); padding: 20px; border-radius: 0 12px 12px 0; margin: 28px 0; }
    
    .cta-box { background: linear-gradient(135deg, rgba(0, 82, 204, 0.25), rgba(59, 130, 246, 0.15)); border: 1px solid var(--primary-light); border-radius: 16px; padding: 32px; text-align: center; margin: 48px 0; }
    .cta-box h3 { font-size: 24px; color: #fff; margin-bottom: 12px; font-family: var(--font-heading); }
    .cta-box p { color: #cbd5e1; margin-bottom: 24px; max-width: 600px; margin-left: auto; margin-right: auto; }
    .cta-btn-lg { display: inline-flex; align-items: center; gap: 10px; background: #25D366; color: #000; font-weight: 800; font-size: 16px; padding: 14px 28px; border-radius: 50px; text-decoration: none; transition: 0.2s; }
    .cta-btn-lg:hover { transform: scale(1.04); text-decoration: none; }

    .footer { background: #040711; padding: 40px 20px 20px; border-top: 1px solid var(--border-glass); text-align: center; font-size: 13.5px; color: var(--text-muted); }
  </style>
</head>
<body>
  <header class="navbar">
    <div class="navbar-inner">
      <a href="/index.html" class="brand">
        <img src="${LOGO_IMAGE}" alt="PW Holdings Logo" />
        <span>PW Holdings</span>
      </a>
      <nav class="nav-links">
        <a href="/index.html">Home</a>
        <a href="/index.html#services">Zoho Services</a>
        <a href="/articles.html">Insights</a>
        <a href="https://web.whatsapp.com/send?phone=94777885883" target="_blank" class="btn-cta">Talk to Consultant</a>
      </nav>
    </div>
  </header>

  <main class="article-wrap">
    <div class="breadcrumb">
      <a href="/index.html">Home</a> &gt; <a href="/articles.html">Insights</a> &gt; <span>${escapeXml(title)}</span>
    </div>

    <span class="badge">${escapeXml(art.categoryLabel || 'Zoho Guide')}</span>
    <h1>${escapeXml(title)}</h1>
    <p class="lead">${escapeXml(description)}</p>

    <div class="byline">
      <span>✍️ <strong>By:</strong> ${escapeXml(art.author || 'PW Holdings Senior Consultants')}</span>
      <span>📅 <strong>Published:</strong> ${escapeXml(art.date)}</span>
      <span>⏱️ <strong>Read Time:</strong> ${escapeXml(art.readTime || '6 min read')}</span>
      <span>📍 <strong>Region:</strong> Sri Lanka</span>
    </div>

    <img src="${escapeXml(image)}" alt="${escapeXml(title)}" class="hero-img" loading="eager" />

    <div class="article-body">
      <h2>Executive Summary & Strategic Overview</h2>
      <p>
        Sri Lankan enterprises operating across retail, manufacturing, logistics, and professional services are undergoing rapid digital transformation. As the Inland Revenue Department (IRD) expands digital reporting regulations, having an integrated ERP and accounting engine that automates compliance while boosting operational efficiency has become mandatory.
      </p>

      <div class="callout">
        <strong>💡 Expert Insight from PW Holdings:</strong> Deploying an enterprise cloud solution requires more than software licenses—it demands local tax rule localization, custom low-code workflow automation, and certified user training.
      </div>

      <h2>Key Capabilities & Implementation Strategy</h2>
      <p>
        When partnering with PW Holdings (Sri Lanka's official Zoho Authorized Partner), organizations achieve:
      </p>
      <ul>
        <li><strong>Automated Tax Compliance:</strong> Accurate calculation and digital invoice formatting for Sri Lanka VAT (18%) and SSCL (2.5%).</li>
        <li><strong>Unified Data Flow:</strong> Seamless synchronization between CRM pipelines, sales quotes, inventory management, and automated general ledger posting.</li>
        <li><strong>Multi-Currency Handling:</strong> Live foreign exchange gain/loss tracking compliant with Central Bank of Sri Lanka (CBSL) reporting standards.</li>
        <li><strong>Role-Based Access & Governance:</strong> Complete audit trails, approval workflows, and two-factor authenticated access.</li>
      </ul>

      <h2>Direct Answer FAQ (Answer Engine Optimization)</h2>
      <div class="callout">
        <h3>Q: How quickly can an enterprise in Sri Lanka implement this solution?</h3>
        <p>A: A standard implementation led by PW Holdings typically ranges from 2 to 6 weeks, including data migration from legacy accounting systems, workflow testing, staff training, and Go-Live support.</p>
      </div>

      <div class="cta-box">
        <h3>Ready to Transform Your Business with Zoho?</h3>
        <p>Book a free 1-on-1 architecture consultation with PW Holdings' certified Zoho consultants in Colombo.</p>
        <a href="https://web.whatsapp.com/send?phone=94777885883" target="_blank" class="cta-btn-lg">
          💬 Chat on WhatsApp (+94 77 788 5883)
        </a>
      </div>
    </div>
  </main>

  <footer class="footer">
    <p>© ${new Date().getFullYear()} PW Holdings (Pvt) Ltd. Official Zoho Authorized Partner Sri Lanka. All rights reserved.</p>
    <p style="margin-top: 8px;">
      <a href="/index.html">Home</a> | 
      <a href="/articles.html">Insights</a> | 
      <a href="/sitemap.xml">Sitemap</a> | 
      <a href="/rss.xml">RSS</a> | 
      <a href="/llms.txt">AI Context (llms.txt)</a>
    </p>
  </footer>
</body>
</html>`;
}

function updateArticlesHtml(articles) {
  const articlesHtmlPath = path.join(rootDir, 'articles.html');
  if (!fs.existsSync(articlesHtmlPath)) return;

  const cardsHtml = articles.map(art => `
        <!-- ARTICLE: ${escapeXml(art.slug)} -->
        <article class="article-card" data-category="${escapeXml(art.category)}">
          <div class="thumb-box">
            <img src="${escapeXml(art.image)}" alt="${escapeXml(art.title)}" loading="lazy" />
            <span class="card-badge">${escapeXml(art.categoryLabel)}</span>
          </div>
          <div class="card-content">
            <div class="card-meta">
              <span>📅 ${escapeXml(art.date)}</span>
              <span>&bull;</span>
              <span>⏱️ ${escapeXml(art.readTime)}</span>
            </div>
            <h2><a href="${escapeXml(art.url)}" style="color: inherit; text-decoration: none;">${escapeXml(art.title)}</a></h2>
            <p>${escapeXml(art.description)}</p>
            <a href="${escapeXml(art.url)}" class="read-link">Read Full Guide &rarr;</a>
          </div>
        </article>
  `).join('\n');

  let content = fs.readFileSync(articlesHtmlPath, 'utf8');
  const startMarker = '<div class="articles-grid" id="articlesContainer">';
  const endMarker = '</div>\n\n      <!-- BOTTOM CTA BANNER -->';
  const altEndMarker = '<!-- BOTTOM CTA BANNER -->';

  if (content.includes(startMarker) && content.includes(altEndMarker)) {
    const p1 = content.indexOf(startMarker) + startMarker.length;
    const p2 = content.indexOf(altEndMarker);
    const updated = content.substring(0, p1) + '\n' + cardsHtml + '\n      </div>\n\n      ' + content.substring(p2);
    fs.writeFileSync(articlesHtmlPath, updated, 'utf8');
    console.log('✓ Updated articles.html with', articles.length, 'article cards');
  }
}

function updateLlmsTxt(articles) {
  const llmsPath = path.join(rootDir, 'llms.txt');
  let text = `# PW Holdings (Pvt) Ltd
> Leading Zoho Authorized Partner & Enterprise Cloud ERP Consultancy in Sri Lanka.

## Overview
PW Holdings (https://pwholdings.lk / https://pwh.lk) is Sri Lanka's official Zoho Authorized Partner providing business automation, custom ERP system implementation, Zoho Books accounting setup, digital transformation, and certified training.

## Core Products & Zoho Services
- **Zoho One**: All-in-one operating system with 45+ integrated applications.
- **Zoho Books**: Professional accounting, VAT (18%)/SSCL (2.5%) compliance, and e-invoicing for Sri Lankan businesses.
- **Zoho CRM & Bigin**: Customer relationship management and sales pipeline automation.
- **Zoho Creator**: Custom low-code application development tailored to industry workflows.
- **Zoho Payroll, Expense & Inventory**: Complete end-to-end supply chain and workforce management.
- **Zoho Analytics, Desk, SalesIQ, Sign & Flow**: Business intelligence, customer support, and system integration.

## Certification & Training
- **Zoho Books Accounting Certification**: Official hands-on training available on Udemy with lifetime access and completion certificates (https://www.udemy.com/course/zoho-books-accounting-software/?referralCode=87319BA3C126F71A97A4).

## Published Guides & Insights
`;

  for (const art of articles) {
    text += `- **${art.title}**: ${art.description} (URL: ${art.url})\n`;
  }

  text += `\n## Contact Information
- **Website**: https://pwholdings.lk/ | https://pwh.lk/
- **Phone**: +94 77 788 5883
- **Email**: info@pwholdings.lk
- **Location**: Colombo, Sri Lanka
`;

  fs.writeFileSync(llmsPath, text, 'utf8');
  console.log('✓ Updated llms.txt with latest articles context');
}

function main() {
  const articles = loadArticles();
  const today = new Date().toISOString().split('T')[0];

  console.log(`Building PW Holdings site with ${articles.length} articles...`);

  // 1. Generate XML Sitemap
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  sitemap += `  <url>\n    <loc>${DOMAIN}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  sitemap += `  <url>\n    <loc>${DOMAIN}/articles.html</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

  for (const art of articles) {
    const pubDate = formatDateForXml(art.date);
    sitemap += `  <url>\n    <loc>${art.url}</loc>\n    <lastmod>${pubDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }
  sitemap += `</urlset>\n`;
  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemap, 'utf8');
  console.log('✓ Generated sitemap.xml');

  // 2. Generate RSS Feed
  let rss = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">\n`;
  rss += `  <channel>\n`;
  rss += `    <title>PW Holdings - Zoho ERP & Business Insights</title>\n`;
  rss += `    <link>${DOMAIN}/articles.html</link>\n`;
  rss += `    <description>Expert Zoho Guides, Sri Lanka IRD VAT/SSCL Tax Accounting, and Cloud ERP Trends by PW Holdings.</description>\n`;
  rss += `    <language>en-us</language>\n`;
  rss += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
  rss += `    <atom:link href="${DOMAIN}/rss.xml" rel="self" type="application/rss+xml" />\n`;

  for (const art of articles) {
    rss += `    <item>\n`;
    rss += `      <title>${escapeXml(art.title)}</title>\n`;
    rss += `      <link>${art.url}</link>\n`;
    rss += `      <guid isPermaLink="true">${art.url}</guid>\n`;
    rss += `      <pubDate>${formatDateForRss(art.date)}</pubDate>\n`;
    rss += `      <dc:creator>${escapeXml(art.author || 'PW Holdings')}</dc:creator>\n`;
    rss += `      <category>${escapeXml(art.categoryLabel)}</category>\n`;
    rss += `      <description>${escapeXml(art.description)}</description>\n`;
    if (art.image) {
      rss += `      <media:content url="${escapeXml(art.image)}" medium="image" width="1200" height="675" />\n`;
    }
    rss += `    </item>\n`;
  }
  rss += `  </channel>\n`;
  rss += `</rss>\n`;
  fs.writeFileSync(path.join(rootDir, 'rss.xml'), rss, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'feed.xml'), rss, 'utf8');
  console.log('✓ Generated rss.xml and feed.xml');

  // 3. Pre-render individual article HTML files
  for (const art of articles) {
    const artDir = path.join(rootDir, 'articles', art.slug);
    if (!fs.existsSync(artDir)) {
      fs.mkdirSync(artDir, { recursive: true });
    }
    const filePath = path.join(artDir, 'index.html');
    
    // If it's the zoho-books-sri-lanka-vat-sscl-setup-guide and sample file exists, use the rich sample content
    if (art.slug === 'zoho-books-sri-lanka-vat-sscl-setup-guide') {
      const samplePath = path.join(rootDir, 'sample-article-zoho-books-sri-lanka.html');
      if (fs.existsSync(samplePath)) {
        fs.copyFileSync(samplePath, filePath);
        console.log(`✓ Synchronized ${art.slug} from sample article`);
        continue;
      }
    }

    const html = generateArticlePageHtml(art);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ Pre-rendered static article: articles/${art.slug}/index.html`);
  }

  // 4. Update articles.html listing and llms.txt
  updateArticlesHtml(articles);
  updateLlmsTxt(articles);

  console.log('🎉 Site build completed successfully!');
}

main();
