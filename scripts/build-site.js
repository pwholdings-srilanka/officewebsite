const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const DOMAIN = 'https://pwholdings.lk';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dib0fble7/image/upload/b_white,c_pad,w_1200,h_630/v1790048197/New_Logo_Pwholdings_2-removebg-preview_1_sunbja.png';
const LOGO_IMAGE = 'https://res.cloudinary.com/dib0fble7/image/upload/v1790048197/New_Logo_Pwholdings_2-removebg-preview_1_sunbja.png';

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
  const canonicalUrl = `${DOMAIN}/articles/${art.slug}/`;
  const image = art.image || DEFAULT_IMAGE;
  const isoDate = formatDateForIso(art.date);

  let sectionsHtml = '';
  if (Array.isArray(art.sections) && art.sections.length > 0) {
    sectionsHtml = art.sections.map(s => `
      <h2>${escapeXml(s.heading)}</h2>
      <p>${escapeXml(s.content)}</p>
    `).join('\n');
  } else {
    sectionsHtml = `
      <h2>Overview & Architecture Analysis</h2>
      <p>${escapeXml(description)}</p>
      <p>Sri Lankan enterprises operating across diverse industry verticals require localized cloud ERP workflows. When collaborating with PW Holdings, organizations benefit from verified tax accuracy, automated invoice generation, and seamless integration between CRM, finance, and logistics.</p>
    `;
  }

  let faqHtml = '';
  let faqSchemaEntities = [];
  if (Array.isArray(art.faq) && art.faq.length > 0) {
    const items = art.faq.map(f => `
      <div class="callout" style="margin: 16px 0; background: rgba(30, 41, 59, 0.7); border-left: 4px solid #3b82f6; padding: 18px; border-radius: 0 12px 12px 0;">
        <h3 style="font-size: 16.5px; color: #ffffff; margin-bottom: 8px;">Q: ${escapeXml(f.q)}</h3>
        <p style="margin: 0; font-size: 15px; color: #cbd5e1; line-height: 1.6;">A: ${escapeXml(f.a)}</p>
      </div>
    `).join('\n');

    faqHtml = `
      <h2 style="margin-top: 40px;">Direct Answer FAQ (Answer Engine Optimization)</h2>
      ${items}
    `;

    faqSchemaEntities = art.faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }));
  }

  const faqSchemaGraph = faqSchemaEntities.length > 0 ? {
    "@type": "FAQPage",
    "@id": `${canonicalUrl}#faq`,
    "mainEntity": faqSchemaEntities
  } : null;

  const schemaGraph = [
    {
      "@type": "Article",
      "@id": `${canonicalUrl}#article`,
      "headline": title,
      "description": description,
      "image": image,
      "datePublished": isoDate,
      "dateModified": isoDate,
      "author": {
        "@type": "Organization",
        "name": art.author || "PW Holdings Senior ERP Consultants",
        "url": `${DOMAIN}/`
      },
      "publisher": {
        "@type": "Organization",
        "name": "PW Holdings",
        "logo": {
          "@type": "ImageObject",
          "url": LOGO_IMAGE
        }
      },
      "mainEntityOfPage": canonicalUrl
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${DOMAIN}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Articles",
          "item": `${DOMAIN}/articles.html`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": title,
          "item": canonicalUrl
        }
      ]
    }
  ];

  if (faqSchemaGraph) {
    schemaGraph.push(faqSchemaGraph);
  }

  if (Array.isArray(art.imageObjects)) {
    art.imageObjects.forEach(imgObj => {
      schemaGraph.push(imgObj);
    });
  }

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
  <meta name="keywords" content="${escapeXml(art.categoryLabel || 'Zoho Guide')}, Zoho Partner Sri Lanka, Cloud ERP Colombo, Zoho Books, PW Holdings" />
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

  <!-- Structured Data JSON-LD (SEO, GEO & AEO) -->
  <script type="application/ld+json">
  ${JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph })}
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
    .brand img { height: 34px; width: auto; max-width: 140px; object-fit: contain; background: #ffffff; padding: 4px 10px; border-radius: 8px; display: block; }
    .nav-links { display: flex; gap: 24px; align-items: center; }
    .nav-links a { color: var(--text-muted); font-size: 14px; font-weight: 600; text-decoration: none; }
    .nav-links a:hover { color: #fff; }
    .btn-cta { background: var(--primary); color: #fff !important; padding: 8px 18px; border-radius: 50px; font-weight: 700; }

    .article-wrap { max-width: 860px; margin: 40px auto 80px; padding: 0 20px; }
    .breadcrumb { font-size: 13.5px; color: var(--text-muted); margin-bottom: 20px; }
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

    .article-body table { width: 100%; display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; border-collapse: collapse; margin: 24px 0; }
    .article-body table th, .article-body table td { padding: 10px 14px; border: 1px solid var(--border-glass); font-size: 14px; }
    .article-body table th { background: rgba(59, 130, 246, 0.15); color: #fff; }
    .article-body pre { max-width: 100%; overflow-x: auto; background: #0b1329; padding: 16px; border-radius: 10px; margin: 20px 0; }
    .article-body img { max-width: 100%; height: auto; border-radius: 12px; }
    .zoho-comparison-figure { margin: 36px 0; overflow: hidden; border-radius: 14px; border: 1px solid var(--border-glass); background: rgba(14, 23, 46, 0.7); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45); }
    .zoho-comparison-figure img { width: 100%; height: auto; display: block; object-fit: cover; border-radius: 14px 14px 0 0; }
    .zoho-comparison-figure figcaption { padding: 14px 18px; text-align: center; font-size: 13.5px; color: #cbd5e1; background: rgba(11, 19, 41, 0.9); border-top: 1px solid var(--border-glass); line-height: 1.6; }

    .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 6px; }
    .hamburger span { display: block; width: 22px; height: 2.5px; background: #fff; margin: 4px 0; border-radius: 2px; transition: 0.3s; }

    @media (max-width: 768px) {
      .navbar { padding: 12px 16px; }
      .brand img { height: 28px; max-width: 110px; padding: 3px 8px; }
      .brand span { font-size: 16px; }
      .hamburger { display: block; }
      .nav-links {
        display: none; position: absolute; top: 100%; left: 0; right: 0;
        background: rgba(7, 13, 30, 0.98); backdrop-filter: blur(25px);
        flex-direction: column; padding: 20px; gap: 14px;
        border-bottom: 1px solid var(--border-glass);
        box-shadow: 0 15px 30px rgba(0,0,0,0.5);
      }
      .nav-links.open { display: flex; }
      .nav-links a { width: 100%; text-align: left; padding: 10px 14px; font-size: 15px; }
      .btn-cta { width: 100%; text-align: center; justify-content: center; padding: 12px; font-size: 14px; }

      .article-wrap { padding: 0 16px; margin: 20px auto 50px; }
      h1 { font-size: 24px; line-height: 1.3; }
      .lead { font-size: 15px; line-height: 1.6; }
      .byline { flex-direction: column; gap: 8px; font-size: 12px; padding: 12px 14px; }
      .hero-img { max-height: 220px; border-radius: 12px; margin-bottom: 24px; }
      .article-body h2 { font-size: 20px; margin: 28px 0 12px; }
      .article-body h3 { font-size: 17px; margin: 20px 0 10px; }
      .article-body p { font-size: 15px; line-height: 1.7; }
      .callout { padding: 16px; margin: 20px 0; font-size: 14px; }
      .cta-box { padding: 24px 16px; margin: 36px 0; }
      .cta-box h3 { font-size: 20px; }
      .cta-box p { font-size: 14px; }
      .cta-btn-lg { width: 100%; justify-content: center; font-size: 14px; padding: 12px 18px; }
    }

    @media (max-width: 420px) {
      .brand span { font-size: 14px; }
      h1 { font-size: 21px; }
      .lead { font-size: 14px; }
    }

    .footer { background: #040711; padding: 40px 20px 20px; border-top: 1px solid var(--border-glass); text-align: center; font-size: 13.5px; color: var(--text-muted); }
  </style>
</head>
<body>
  <header class="navbar">
    <div class="navbar-inner">
      <a href="../../index.html" class="brand">
        <img src="${LOGO_IMAGE}" alt="PW Holdings Logo" />
        <span>PW Holdings</span>
      </a>
      <nav class="nav-links" id="artNav">
        <a href="../../index.html">Home</a>
        <a href="../../index.html#sec1">About Us</a>
        <a href="../../index.html#zoho-services">Zoho Services</a>
        <a href="../../articles.html">Articles</a>
        <a href="https://web.whatsapp.com/send?phone=94777885883" target="_blank" class="btn-cta">Talk to Consultant</a>
      </nav>
      <button class="hamburger" id="artHam" aria-label="Toggle Navigation Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main class="article-wrap">
    <div class="breadcrumb">
      <a href="../../index.html">Home</a> &gt; <a href="../../articles.html">Articles</a> &gt; <span>${escapeXml(art.categoryLabel)}</span>
    </div>

    <div class="badge">${escapeXml(art.categoryLabel)}</div>
    <h1>${escapeXml(art.title)}</h1>
    <p class="lead">${escapeXml(art.description)}</p>

    <div class="byline">
      <div>✍️ <strong>Author:</strong> ${escapeXml(art.author || 'PW Holdings Senior Consultants')}</div>
      <div>📅 <strong>Published:</strong> ${escapeXml(art.date)}</div>
      <div>⏱️ <strong>Read Time:</strong> ${escapeXml(art.readTime || '7 min read')}</div>
      <div>📍 <strong>Region:</strong> Sri Lanka &bull; IRD Compliant</div>
    </div>

    <img class="hero-img" src="${escapeXml(art.image)}" alt="${escapeXml(art.title)}" />

    <article class="article-body">
      ${(() => {
        if (art.bodyHtml) return art.bodyHtml;
        let html = '';
        if (art.headline) {
          html += `<div class="callout" style="border-left: 4px solid #3b82f6; background: rgba(30, 41, 59, 0.7); padding: 20px 24px; border-radius: 0 12px 12px 0; margin-bottom: 32px;">
            <p style="font-size: 17px; font-weight: 700; color: #93c5fd; margin: 0; line-height: 1.5;">💡 ${escapeXml(art.headline)}</p>
          </div>`;
        }
        if (Array.isArray(art.sections)) {
          html += art.sections.map((sec, idx) => `
            <section class="art-section" style="margin-bottom: 36px;">
              <h2 style="font-family: var(--font-heading); font-size: 24px; color: #ffffff; margin: 32px 0 14px; letter-spacing: -0.01em;">
                ${idx + 1}. ${escapeXml(sec.heading)}
              </h2>
              <div style="font-size: 16.5px; line-height: 1.85; color: #cbd5e1;">
                ${escapeXml(sec.content).split('\n\n').map(p => `<p style="margin-bottom: 16px;">${p.replace(/\n/g, '<br/>')}</p>`).join('')}
              </div>
            </section>
          `).join('\n');
        }
        if (Array.isArray(art.faq) && art.faq.length > 0) {
          html += `
          <section class="art-faq-box" style="margin-top: 44px; padding: 28px; background: rgba(14, 23, 46, 0.9); border: 1.5px solid rgba(59, 130, 246, 0.3); border-radius: 18px;">
            <h2 style="font-size: 22px; color: #93c5fd; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
              <span>💬 Frequently Asked Questions</span>
            </h2>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${art.faq.map((f, fIdx) => `
                <div style="padding: 16px 20px; background: rgba(11, 19, 41, 0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
                  <h3 style="font-size: 16.5px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Q${fIdx+1}: ${escapeXml(f.q)}</h3>
                  <p style="font-size: 15px; color: #94a3b8; line-height: 1.65; margin: 0;">${escapeXml(f.a)}</p>
                </div>
              `).join('\n')}
            </div>
          </section>
          `;
        }
        return html;
      })()}
    </article>

    <div class="cta-box">
      <h3>Ready to Modernize Your Operations with Zoho?</h3>
      <p>Speak directly with Sri Lanka's leading certified Zoho implementation specialists. We handle everything from VAT/SSCL configuration to custom enterpriseDeluge workflows.</p>
      <a href="https://web.whatsapp.com/send?phone=94777885883&text=Hello%20PW%20Holdings!%20I%20read%20your%20article%20'${encodeURIComponent(art.title)}'%20and%20would%20like%20a%20consultation." target="_blank" class="cta-btn-lg">
        💬 WhatsApp Our Lead Consultant (+94 77 788 5883)
      </a>
    </div>
  </main>

  <footer class="footer">
    <p>© ${new Date().getFullYear()} PW Holdings (Pvt) Ltd. Official Zoho Authorized Partner Sri Lanka. All rights reserved.</p>
    <p style="margin-top: 8px;">
      <a href="../../index.html">Home</a> | 
      <a href="../../articles.html">Articles</a> | 
      <a href="../../sitemap.xml">Sitemap</a> | 
      <a href="../../rss.xml">RSS</a> | 
      <a href="../../llms.txt">AI Context (llms.txt)</a>
    </p>
  </footer>

  <script>
    const ham = document.getElementById('artHam');
    const nav = document.getElementById('artNav');
    if (ham && nav) {
      ham.addEventListener('click', () => nav.classList.toggle('open'));
      nav.querySelectorAll('a').forEach(l => {
        l.addEventListener('click', () => nav.classList.remove('open'));
      });
    }
  </script>
</body>
</html>`;
}

function updateArticlesHtml(articles) {
  const articlesHtmlPath = path.join(rootDir, 'articles.html');
  if (!Array.isArray(articles) || articles.length === 0) return;

  const heroArticle = articles[0];
  const heroLink = `articles/${heroArticle.slug}/index.html`;

  // Filter out hero from spotlight arrays if needed
  const erpSpotlights = articles.filter(a => a.category === 'erp' || a.slug.includes('tally') || a.slug.includes('inventory')).slice(0, 2);
  const taxSpotlights = articles.filter(a => a.category === 'tax' || a.category === 'payroll').slice(0, 2);

  // All article cards for the dynamic grid
  const allCardsHtml = articles.map(art => {
    const articleLink = `articles/${art.slug}/index.html`;
    return `        <!-- ARTICLE: ${escapeXml(art.slug)} -->
        <article class="article-card" data-category="${escapeXml(art.category)}" data-title="${escapeXml(art.title.toLowerCase())}">
          <div class="thumb-box">
            <img src="${escapeXml(art.image)}" alt="${escapeXml(art.title)}" loading="lazy" />
            <span class="card-badge">${escapeXml(art.categoryLabel || 'Guide')}</span>
          </div>
          <div class="card-content">
            <div class="card-meta">
              <span>📅 ${escapeXml(art.date)}</span>
              <span>&bull;</span>
              <span>⏱️ ${escapeXml(art.readTime || '6 min read')}</span>
            </div>
            <h3 class="card-title">
              <a href="${articleLink}">${escapeXml(art.title)}</a>
            </h3>
            <p class="card-desc">${escapeXml(art.description)}</p>
            <div class="card-footer-row">
              <span class="card-author">✍️ ${escapeXml(art.author ? art.author.split(' ')[0] + ' ' + art.author.split(' ')[1] : 'PW Holdings')}</span>
              <a href="${articleLink}" class="read-link">Read Full Guide &rarr;</a>
            </div>
          </div>
        </article>`;
  }).join('\n\n');

  // Spotlight Cards: ERP
  const erpSpotlightsHtml = erpSpotlights.map(art => {
    const articleLink = `articles/${art.slug}/index.html`;
    return `        <article class="spotlight-card">
          <div class="spotlight-thumb">
            <img src="${escapeXml(art.image)}" alt="${escapeXml(art.title)}" loading="lazy" />
          </div>
          <div class="spotlight-content">
            <div class="card-meta">
              <span>📅 ${escapeXml(art.date)}</span>
              <span>&bull;</span>
              <span>⏱️ ${escapeXml(art.readTime)}</span>
            </div>
            <h3 class="card-title" style="font-size: 17px; margin-bottom: 8px;">
              <a href="${articleLink}">${escapeXml(art.title)}</a>
            </h3>
            <p class="card-desc" style="font-size: 13.5px; margin-bottom: 14px;">${escapeXml(art.description)}</p>
            <a href="${articleLink}" class="read-link">Explore Architecture Guide &rarr;</a>
          </div>
        </article>`;
  }).join('\n\n');

  // Spotlight Cards: Tax & Payroll
  const taxSpotlightsHtml = taxSpotlights.map(art => {
    const articleLink = `articles/${art.slug}/index.html`;
    return `        <article class="spotlight-card">
          <div class="spotlight-thumb">
            <img src="${escapeXml(art.image)}" alt="${escapeXml(art.title)}" loading="lazy" />
          </div>
          <div class="spotlight-content">
            <div class="card-meta">
              <span>📅 ${escapeXml(art.date)}</span>
              <span>&bull;</span>
              <span>⏱️ ${escapeXml(art.readTime)}</span>
            </div>
            <h3 class="card-title" style="font-size: 17px; margin-bottom: 8px;">
              <a href="${articleLink}">${escapeXml(art.title)}</a>
            </h3>
            <p class="card-desc" style="font-size: 13.5px; margin-bottom: 14px;">${escapeXml(art.description)}</p>
            <a href="${articleLink}" class="read-link">Review IRD Tax Schedule &rarr;</a>
          </div>
        </article>`;
  }).join('\n\n');

  const pageHtml = `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />

  <!-- ===================================================================
       1. BLOG & KNOWLEDGE HUB SEO / AEO / GEO META TAGS
       =================================================================== -->
  <title>Zoho ERP &amp; Business Automation Articles | PW Holdings Sri Lanka</title>
  <meta name="description" content="Explore actionable Zoho ERP guides, Sri Lanka VAT/SSCL tax compliance tutorials, cloud migration benchmarks, and business automation research by PW Holdings." />
  <meta name="keywords" content="Zoho Books Sri Lanka guide, Zoho ERP articles Colombo, Zoho VAT SSCL tutorial, Zoho One vs SAP Sri Lanka, Zoho payroll EPF ETF, PW Holdings Articles" />
  <meta name="author" content="PW Holdings Editorial &amp; Architecture Team" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <link rel="canonical" href="${DOMAIN}/articles.html" />

  <!-- Social Open Graph -->
  <meta property="og:locale" content="en_US" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Zoho ERP &amp; Cloud Accounting Articles | PW Holdings Sri Lanka" />
  <meta property="og:description" content="Stay ahead in business with certified Zoho tutorials, Sri Lankan tax updates, and cloud software implementation guides." />
  <meta property="og:url" content="${DOMAIN}/articles.html" />
  <meta property="og:site_name" content="PW Holdings" />
  <meta property="og:image" content="${DEFAULT_IMAGE}" />

  <!-- Favicon & Fonts -->
  <link rel="icon" type="image/png" href="${LOGO_IMAGE}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

  <!-- ===================================================================
       2. SCHEMA.ORG COLLECTION PAGE & BLOG STRUCTURED DATA
       =================================================================== -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "${DOMAIN}/articles.html#blog",
    "name": "PW Holdings Zoho ERP Knowledge Hub",
    "description": "Expert insights, tutorials, and Sri Lankan business guides on Zoho One, Zoho Books, CRM, and Cloud ERP.",
    "publisher": {
      "@type": "Organization",
      "name": "PW Holdings",
      "url": "${DOMAIN}/",
      "logo": "${LOGO_IMAGE}"
    }
  }
  </script>

  <style>
    :root {
      --bg-dark: #070d1e;
      --bg-surface: #0e172e;
      --bg-card: #0f1933;
      --border-glass: rgba(255, 255, 255, 0.12);
      --border-accent: rgba(99, 102, 241, 0.38);
      --primary: #6366f1;
      --primary-light: #818cf8;
      --accent-teal: #06b6d4;
      --accent-emerald: #10b981;
      --text-white: #ffffff;
      --text-muted: #94a3b8;
      --text-subtle: #64748b;
      --font-heading: 'Plus Jakarta Sans', system-ui, sans-serif;
      --font-body: 'Inter', system-ui, sans-serif;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-body);
      background-color: var(--bg-dark);
      color: var(--text-white);
      line-height: 1.6;
      overflow-x: hidden;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 2; }
    a { text-decoration: none; color: inherit; }

    /* 2. FROSTED GLASS NAVBAR */
    .navbar {
      position: sticky; top: 0; z-index: 1000;
      padding: 16px 20px;
      background: rgba(7, 13, 30, 0.92);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-glass);
    }
    .navbar-inner {
      max-width: 1200px; margin: 0 auto;
      display: flex; align-items: center; justify-content: space-between;
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand img { height: 34px; width: auto; max-width: 140px; object-fit: contain; padding: 4px 10px; background: #fff; border-radius: 8px; display: block; }
    .brand-title { font-family: var(--font-heading); font-weight: 800; font-size: 17px; }
    .nav-links { display: flex; align-items: center; gap: 14px; }
    .nav-links a {
      color: var(--text-muted); font-size: 14px; font-weight: 600;
      padding: 7px 14px; border-radius: 8px; transition: 0.2s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #fff; background: rgba(99, 102, 241, 0.15);
    }
    .btn-nav-cta {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: #fff !important; padding: 9px 22px !important;
      border-radius: 50px !important; font-weight: 700 !important;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(99, 102, 241, 0.45); }

    /* 3. HERO FEATURED BREAKTHROUGH (Split Grid layout like Science News Hub) */
    .hero-featured-section {
      padding: 50px 0 40px;
      background: radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.18), transparent 70%);
      border-bottom: 1px solid var(--border-glass);
    }
    .hero-label-row {
      display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
    }
    .hero-pill-badge {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: #ffffff; font-size: 11.5px; font-weight: 800;
      padding: 5px 14px; border-radius: 50px; text-transform: uppercase;
      letter-spacing: 0.05em; display: inline-flex; align-items: center; gap: 6px;
    }
    .hero-category-label {
      font-size: 12.5px; font-weight: 700; color: var(--accent-teal);
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .hero-card-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 40px;
      align-items: center;
      background: var(--bg-card);
      border: 1.5px solid var(--border-glass);
      border-radius: 28px;
      padding: 40px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s;
    }
    .hero-card-grid:hover { border-color: var(--border-accent); }
    .hero-card-title {
      font-family: var(--font-heading);
      font-size: clamp(26px, 3.8vw, 38px);
      font-weight: 900;
      line-height: 1.25;
      margin-bottom: 18px;
      letter-spacing: -0.02em;
    }
    .hero-card-title a { color: #ffffff; transition: color 0.2s; }
    .hero-card-title a:hover { color: var(--primary-light); }
    .hero-card-desc {
      font-size: 16px; color: var(--text-muted); line-height: 1.65;
      margin-bottom: 24px;
    }
    .hero-card-meta {
      display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px;
      color: var(--text-subtle); margin-bottom: 28px;
    }
    .meta-item { display: inline-flex; align-items: center; gap: 6px; }
    .btn-hero-read {
      display: inline-flex; align-items: center; gap: 10px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      color: #ffffff; font-weight: 700; font-size: 15px;
      padding: 13px 30px; border-radius: 50px;
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
      transition: all 0.25s ease;
    }
    .btn-hero-read:hover {
      transform: translateY(-3px); box-shadow: 0 14px 34px rgba(99, 102, 241, 0.5);
    }
    .hero-card-media {
      position: relative; border-radius: 20px; overflow: hidden;
      aspect-ratio: 16/10; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border-glass);
    }
    .hero-card-media img {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform 0.6s ease;
    }
    .hero-card-grid:hover .hero-card-media img { transform: scale(1.05); }

    /* 4. FILTER & REALTIME SEARCH BAR (Science News Hub style) */
    .filter-section {
      padding: 36px 0 20px;
    }
    .filter-bar-wrap {
      display: flex; justify-content: space-between; align-items: center;
      gap: 20px; flex-wrap: wrap;
    }
    .category-pills { display: flex; gap: 8px; flex-wrap: wrap; }
    .cat-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      color: var(--text-muted); padding: 8px 18px; border-radius: 30px;
      font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s;
    }
    .cat-pill:hover { background: rgba(99, 102, 241, 0.15); color: #fff; }
    .cat-pill.active {
      background: var(--primary); color: #fff; border-color: var(--primary-light);
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
    }
    .search-wrap {
      position: relative; display: flex; align-items: center;
    }
    .search-icon {
      position: absolute; left: 16px; color: var(--text-subtle); pointer-events: none;
    }
    .search-wrap input {
      background: var(--bg-surface);
      border: 1px solid var(--border-glass);
      color: #fff; padding: 11px 20px 11px 44px;
      border-radius: 30px; font-size: 14px; width: 300px;
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    }
    .search-wrap input:focus {
      border-color: var(--primary-light);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }

    /* 5. LATEST ARTICLES GRID (3-column NewsCard style) */
    .section-title-row {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin: 30px 0 24px; padding-bottom: 14px; border-bottom: 1px solid var(--border-glass);
    }
    .section-kicker {
      font-size: 11.5px; font-weight: 800; text-transform: uppercase;
      letter-spacing: 0.08em; color: var(--primary-light); display: block; margin-bottom: 4px;
    }
    .section-heading {
      font-family: var(--font-heading); font-size: 28px; font-weight: 900;
      color: #ffffff; letter-spacing: -0.02em;
    }
    .article-count-badge {
      font-size: 12.5px; color: var(--text-subtle); font-weight: 600;
    }

    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 28px;
      margin-bottom: 60px;
    }
    .article-card {
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: 20px; overflow: hidden;
      display: flex; flex-direction: column;
      transition: all 0.35s ease;
    }
    .article-card:hover {
      transform: translateY(-8px);
      border-color: var(--border-accent);
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4);
    }
    .thumb-box {
      height: 200px; width: 100%; position: relative; overflow: hidden;
    }
    .thumb-box img {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform 0.5s ease;
    }
    .article-card:hover .thumb-box img { transform: scale(1.08); }
    .card-badge {
      position: absolute; top: 14px; left: 14px;
      background: rgba(7, 13, 30, 0.85); backdrop-filter: blur(10px);
      color: #93c5fa; font-size: 11px; font-weight: 700;
      padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);
    }
    .card-content {
      padding: 24px; display: flex; flex-direction: column; flex: 1;
    }
    .card-meta {
      display: flex; gap: 10px; font-size: 12px; color: var(--text-subtle);
      margin-bottom: 12px;
    }
    .card-title {
      font-family: var(--font-heading); font-size: 19px; font-weight: 800;
      line-height: 1.35; margin-bottom: 12px; color: #ffffff;
    }
    .card-title a { color: #ffffff; transition: color 0.2s; }
    .card-title a:hover { color: var(--primary-light); }
    .card-desc {
      font-size: 14px; color: var(--text-muted); line-height: 1.6;
      margin-bottom: 22px; flex: 1;
    }
    .card-footer-row {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .card-author {
      font-size: 12px; color: var(--text-subtle);
    }
    .read-link {
      color: var(--primary-light); font-size: 13.5px; font-weight: 700;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .read-link:hover { color: #ffffff; }

    /* 6. TOPIC SPOTLIGHT SECTIONS (Science News Hub style) */
    .spotlight-section {
      padding: 60px 0;
      border-top: 1px solid var(--border-glass);
      background: rgba(14, 23, 46, 0.45);
    }
    .spotlight-header {
      margin-bottom: 32px;
    }
    .spotlight-badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11.5px; font-weight: 800; text-transform: uppercase;
      letter-spacing: 0.08em; color: var(--accent-teal);
      background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.25);
      padding: 4px 14px; border-radius: 30px; margin-bottom: 10px;
    }
    .spotlight-title {
      font-family: var(--font-heading); font-size: 30px; font-weight: 900;
      color: #ffffff; letter-spacing: -0.02em; margin-bottom: 8px;
    }
    .spotlight-sub {
      font-size: 15.5px; color: var(--text-muted); max-width: 680px;
    }
    .spotlight-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
      gap: 24px;
    }
    .spotlight-card {
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: 20px; overflow: hidden;
      display: grid; grid-template-columns: 200px 1fr;
      transition: transform 0.3s, border-color 0.3s;
    }
    .spotlight-card:hover {
      transform: translateY(-5px);
      border-color: var(--border-accent);
    }
    .spotlight-thumb {
      height: 100%; min-height: 180px; position: relative; overflow: hidden;
    }
    .spotlight-thumb img {
      width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s;
    }
    .spotlight-card:hover .spotlight-thumb img { transform: scale(1.08); }
    .spotlight-content {
      padding: 22px; display: flex; flex-direction: column; justify-content: center;
    }

    /* 7. ARCHITECTURE CONSULTATION / NEWSLETTER CALLOUT */
    .consult-callout-section {
      padding: 70px 0;
    }
    .consult-card {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.12) 100%);
      border: 1.5px solid rgba(99, 102, 241, 0.3);
      border-radius: 28px; padding: 50px 40px; text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
      max-width: 900px; margin: 0 auto;
    }
    .consult-pill {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 11.5px; font-weight: 800; text-transform: uppercase;
      letter-spacing: 0.08em; color: #a5b4fc;
      background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.35);
      padding: 5px 16px; border-radius: 50px; margin-bottom: 18px;
    }
    .consult-title {
      font-family: var(--font-heading); font-size: clamp(24px, 3.5vw, 36px);
      font-weight: 900; color: #fff; margin-bottom: 14px;
    }
    .consult-desc {
      font-size: 16px; color: var(--text-muted); max-width: 650px;
      margin: 0 auto 30px; line-height: 1.65;
    }
    .consult-actions {
      display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;
    }
    .btn-consult-wa {
      background: #25D366; color: #000 !important; font-weight: 800;
      padding: 13px 28px; border-radius: 50px; display: inline-flex;
      align-items: center; gap: 8px; transition: transform 0.2s;
    }
    .btn-consult-wa:hover { transform: scale(1.04); }
    .btn-consult-call {
      background: rgba(255, 255, 255, 0.08); border: 1px solid var(--border-glass);
      color: #fff !important; font-weight: 700; padding: 13px 26px; border-radius: 50px;
    }

    /* 8. FOOTER */
    .footer {
      background: #040711; padding: 60px 0 25px;
      border-top: 1px solid var(--border-glass);
    }
    .footer-grid {
      display: grid; grid-template-columns: 2fr 1fr 1.2fr;
      gap: 40px; margin-bottom: 40px;
    }
    .footer-col h4 {
      font-family: var(--font-heading); font-size: 15px; font-weight: 800;
      color: #fff; margin-bottom: 18px; text-transform: uppercase; letter-spacing: 0.04em;
    }
    .footer-col a {
      display: block; color: var(--text-muted); font-size: 14px;
      margin-bottom: 10px; transition: color 0.2s;
    }
    .footer-col a:hover { color: #fff; }
    .footer-col p { font-size: 14px; color: var(--text-muted); margin-bottom: 8px; }
    .footer-bottom {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 25px; border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 13px; color: var(--text-subtle);
    }

    .hamburger-btn {
      display: none; background: transparent; border: none; cursor: pointer; padding: 6px;
    }
    .hamburger-btn span {
      display: block; width: 24px; height: 2.5px; background: #ffffff;
      margin: 4.5px 0; border-radius: 2px; transition: 0.3s;
    }

    @media (max-width: 900px) {
      .navbar { padding: 14px 18px; }
      .hamburger-btn { display: block; }
      .nav-links {
        display: none; position: absolute; top: 100%; left: 0; right: 0;
        background: rgba(7, 13, 30, 0.98); backdrop-filter: blur(25px);
        flex-direction: column; padding: 22px 20px; gap: 14px;
        border-bottom: 1px solid var(--border-glass);
        box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      }
      .nav-links.open { display: flex; }
      .nav-links a { width: 100%; text-align: left; padding: 10px 14px; font-size: 15px; }
      .btn-nav-cta { width: 100%; text-align: center; justify-content: center; padding: 12px !important; }

      .hero-featured-section { padding: 28px 0 22px; }
      .hero-card-grid { grid-template-columns: 1fr; padding: 22px 18px; gap: 22px; border-radius: 20px; }
      .hero-card-title { font-size: 22px; line-height: 1.3; margin-bottom: 12px; }
      .hero-card-desc { font-size: 14.5px; margin-bottom: 18px; }
      .hero-card-meta { gap: 10px; font-size: 12px; margin-bottom: 20px; }
      .btn-hero-read { width: 100%; justify-content: center; font-size: 14px; padding: 12px 20px; }
      .hero-card-media { max-height: 220px; aspect-ratio: 16/9; }

      .filter-section { padding: 18px 0 14px; }
      .filter-bar-wrap { flex-direction: column; align-items: stretch; gap: 12px; }
      .category-pills {
        overflow-x: auto; flex-wrap: nowrap; -webkit-overflow-scrolling: touch;
        padding-bottom: 8px; gap: 8px; width: 100%; scrollbar-width: none;
      }
      .category-pills::-webkit-scrollbar { display: none; }
      .cat-pill { white-space: nowrap; flex-shrink: 0; padding: 8px 16px; font-size: 13px; }
      .search-wrap { width: 100%; }
      .search-wrap input { width: 100%; padding: 12px 16px 12px 42px; font-size: 16px; } /* 16px prevents iOS Safari auto-zoom */

      .section-title-row { flex-direction: column; align-items: flex-start; gap: 6px; margin: 20px 0 18px; }
      .section-heading { font-size: 21px; }

      .articles-grid { grid-template-columns: 1fr; gap: 20px; margin-bottom: 40px; }
      .thumb-box { height: 180px; }
      .card-content { padding: 18px; }
      .card-title { font-size: 17.5px; line-height: 1.35; }
      .card-desc { font-size: 13.5px; margin-bottom: 16px; }

      .spotlight-section { padding: 36px 0; }
      .spotlight-title { font-size: 22px; }
      .spotlight-sub { font-size: 13.5px; }
      .spotlight-grid { grid-template-columns: 1fr; gap: 16px; }
      .spotlight-card { grid-template-columns: 1fr; }
      .spotlight-thumb { height: 170px; min-height: unset; }
      .spotlight-content { padding: 18px; }

      .consult-callout-section { padding: 40px 0; }
      .consult-card { padding: 30px 16px; border-radius: 20px; }
      .consult-title { font-size: 21px; }
      .consult-desc { font-size: 14px; margin-bottom: 20px; }
      .consult-actions { flex-direction: column; gap: 12px; }
      .btn-consult-wa, .btn-consult-call { width: 100%; justify-content: center; font-size: 14px; padding: 12px 20px; }

      .footer { padding: 40px 0 20px; }
      .footer-grid { grid-template-columns: 1fr; gap: 28px; }
      .footer-bottom { flex-direction: column; gap: 10px; text-align: center; }
    }

    @media (max-width: 480px) {
      .navbar { padding: 12px 14px; }
      .brand img { height: 28px; max-width: 105px; padding: 2px 6px; }
      .brand-title { font-size: 15px; }
      .hero-card-grid { padding: 16px 14px; }
      .hero-card-title { font-size: 20px; }
      .hero-card-desc { font-size: 13.5px; }
      .hero-card-meta { font-size: 11.5px; flex-direction: column; gap: 6px; }
      .card-title { font-size: 16.5px; }
      .consult-card { padding: 24px 14px; }
      .consult-title { font-size: 19px; }
    }
  </style>
</head>
<body>

  <!-- NAVBAR -->
  <header class="navbar">
    <div class="navbar-inner">
      <a href="index.html" class="brand">
        <img src="${LOGO_IMAGE}" alt="PW Holdings Logo" />
        <span class="brand-title">PW Holdings</span>
      </a>

      <nav class="nav-links" id="mainNavLinks">
        <a href="index.html">Home</a>
        <a href="index.html#sec1">About Us</a>
        <a href="index.html#zoho-services">Zoho Solutions</a>
        <a href="articles.html" class="active">Articles</a>
        <a href="https://web.whatsapp.com/send?phone=94777885883" target="_blank">Contact Us</a>
        <a href="https://zohobooks.lk/" target="_blank" class="btn-nav-cta">Book Demo</a>
      </nav>
      <button class="hamburger-btn" id="mobileMenuBtn" aria-label="Toggle navigation menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main>
    <!-- 3. HERO FEATURED STORY (Science News Hub style) -->
    <section class="hero-featured-section">
      <div class="container">
        <div class="hero-label-row">
          <span class="hero-pill-badge">✨ Featured ERP Breakthrough</span>
          <span class="hero-category-label">${escapeXml(heroArticle.categoryLabel || 'Tax &amp; IRD Guide')}</span>
        </div>

        <div class="hero-card-grid">
          <div class="hero-card-text">
            <h1 class="hero-card-title">
              <a href="${heroLink}">${escapeXml(heroArticle.title)}</a>
            </h1>
            <p class="hero-card-desc">${escapeXml(heroArticle.description)}</p>
            
            <div class="hero-card-meta">
              <span class="meta-item">✍️ <strong>By:</strong> ${escapeXml(heroArticle.author || 'PW Holdings Senior Consultants')}</span>
              <span class="meta-item">⏱️ <strong>Read Time:</strong> ${escapeXml(heroArticle.readTime || '7 min read')}</span>
              <span class="meta-item">📅 <strong>Published:</strong> ${escapeXml(heroArticle.date)}</span>
              <span class="meta-item">📍 <strong>Region:</strong> Sri Lanka</span>
            </div>

            <div class="hero-card-cta">
              <a href="${heroLink}" class="btn-hero-read">
                <span>Read Full Research Report &rarr;</span>
              </a>
            </div>
          </div>

          <div class="hero-card-media">
            <a href="${heroLink}">
              <img src="${escapeXml(heroArticle.image)}" alt="${escapeXml(heroArticle.title)}" loading="eager" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. FILTER & REALTIME SEARCH BAR -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-bar-wrap">
          <div class="category-pills" id="categoryFilters">
            <button class="cat-pill active" data-filter="all">All Articles (${articles.length})</button>
            <button class="cat-pill" data-filter="tax">Tax &amp; IRD Guide</button>
            <button class="cat-pill" data-filter="erp">Cloud ERP &amp; Zoho One</button>
            <button class="cat-pill" data-filter="payroll">Payroll &amp; HR</button>
            <button class="cat-pill" data-filter="crm">CRM &amp; WhatsApp</button>
          </div>

          <div class="search-wrap">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="searchInput" placeholder="Search guides &amp; keywords..." aria-label="Search articles" />
          </div>
        </div>
      </div>
    </section>

    <!-- 5. LATEST ARTICLES GRID (Science News Hub style) -->
    <section style="padding: 10px 0 50px;">
      <div class="container">
        <div class="section-title-row">
          <div>
            <span class="section-kicker">Live Knowledge Base</span>
            <h2 class="section-heading">Latest ERP &amp; Automation Articles</h2>
          </div>
          <span class="article-count-badge">Displaying ${articles.length} Verified Guides</span>
        </div>

        <div class="articles-grid" id="articlesContainer">
${allCardsHtml}
        </div>
      </div>
    </section>

    <!-- 6. SPOTLIGHT 1: ENTERPRISE CLOUD ERP & MIGRATIONS -->
    <section class="spotlight-section">
      <div class="container">
        <div class="spotlight-header">
          <div class="spotlight-badge">⚙️ ARCHITECTURE SPOTLIGHT</div>
          <h2 class="spotlight-title">Enterprise Cloud ERP &amp; System Migrations</h2>
          <p class="spotlight-sub">Strategic evaluation, total cost of ownership (TCO) benchmarks, and smooth transitions from on-premise legacy accounting to Zoho One.</p>
        </div>

        <div class="spotlight-grid">
${erpSpotlightsHtml}
        </div>
      </div>
    </section>

    <!-- 7. SPOTLIGHT 2: SRI LANKA IRD TAX & REGULATORY COMPLIANCE -->
    <section class="spotlight-section" style="background: rgba(7, 13, 30, 0.7);">
      <div class="container">
        <div class="spotlight-header">
          <div class="spotlight-badge" style="color: #34d399; background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.25);">🏛️ REGULATORY COMPLIANCE SPOTLIGHT</div>
          <h2 class="spotlight-title">Sri Lanka Tax &amp; Statutory Workforce Compliance</h2>
          <p class="spotlight-sub">Master 18% VAT, 2.5% SSCL, Inland Revenue Department RAMIS reporting, and statutory EPF/ETF payroll automation.</p>
        </div>

        <div class="spotlight-grid">
${taxSpotlightsHtml}
        </div>
      </div>
    </section>

    <!-- 8. ARCHITECTURE CONSULTATION CALLOUT (Science News Hub style) -->
    <section class="consult-callout-section">
      <div class="container">
        <div class="consult-card">
          <div class="consult-pill">🚀 ARCHITECTURE STRATEGY</div>
          <h2 class="consult-title">Need Expert Guidance on Your Zoho Implementation?</h2>
          <p class="consult-desc">Book a free 1-on-1 architecture walkthrough with PW Holdings' certified consultants. Get tailored advice on Inland Revenue Department (IRD) compliance, Deluge custom workflows, and multi-department consolidation.</p>
          <div class="consult-actions">
            <a href="https://web.whatsapp.com/send?phone=94777885883&text=Hello%20PW%20Holdings!%20I%20am%20reading%20your%20Articles%20and%20would%20like%20a%20free%20consultation." target="_blank" class="btn-consult-wa">
              <span>💬 Chat on WhatsApp (+94 77 788 5883)</span>
            </a>
            <a href="tel:+94777885883" class="btn-consult-call">
              <span>📞 Direct Hotline</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- 9. FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="brand" style="margin-bottom: 14px;">
            <img src="${LOGO_IMAGE}" alt="PW Holdings Logo" />
            <span class="brand-title">PW Holdings</span>
          </div>
          <p style="max-width: 460px; line-height: 1.65;">
            Sri Lanka's premier official Zoho Authorized Partner providing enterprise cloud ERP implementation, IRD VAT/SSCL compliance, custom Deluge software, and certified training.
          </p>
        </div>

        <div class="footer-col">
          <h4>Navigation</h4>
          <a href="index.html">Home</a>
          <a href="index.html#sec1">About Us</a>
          <a href="index.html#zoho-services">Zoho Solutions</a>
          <a href="articles.html">Articles Hub</a>
          <a href="sitemap.xml">XML Sitemap</a>
          <a href="llms.txt">AI Context (llms.txt)</a>
        </div>

        <div class="footer-col">
          <h4>Direct Consultation</h4>
          <p><strong>Hotline:</strong> +94 77 788 5883</p>
          <p><strong>Email:</strong> info@pwholdings.lk</p>
          <p><strong>HQ:</strong> Colombo, Sri Lanka</p>
          <p style="margin-top: 14px;">
            <a href="https://web.whatsapp.com/send?phone=94777885883" target="_blank" style="color: #25D366; font-weight: 700;">💬 WhatsApp Specialist &rarr;</a>
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} PW Holdings (Pvt) Ltd. All Rights Reserved. Official Zoho Authorized Partner Sri Lanka.</p>
        <p><a href="rss.xml" style="color: inherit;">RSS Feed</a> &bull; <a href="feed.xml" style="color: inherit;">Atom Feed</a></p>
      </div>
    </div>
  </footer>

  <!-- 10. REAL-TIME FILTER & SEARCH JS -->
  <script>
    const filterButtons = document.querySelectorAll('.cat-pill');
    const cards = document.querySelectorAll('.article-card');
    const searchInput = document.getElementById('searchInput');

    let currentFilter = 'all';
    let currentSearch = '';

    function applyFilters() {
      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const title = card.getAttribute('data-title') || '';
        const desc = card.querySelector('.card-desc') ? card.querySelector('.card-desc').textContent.toLowerCase() : '';

        const matchesCategory = currentFilter === 'all' || category === currentFilter;
        const matchesSearch = !currentSearch || title.includes(currentSearch) || desc.includes(currentSearch);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter') || 'all';
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        applyFilters();
      });
    }

    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('mainNavLinks');
    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });
      navLinks.querySelectorAll('a').forEach(l => {
        l.addEventListener('click', () => navLinks.classList.remove('open'));
      });
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(articlesHtmlPath, pageHtml, 'utf8');
  console.log(`✓ Generated complete Science-News-Hub-style articles.html with featured hero, live filters, and category spotlights!`);
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

## Published Articles & Guides
`;

  for (const art of articles) {
    const canonical = `${DOMAIN}/articles/${art.slug}/`;
    text += `- **${art.title}**: ${art.description} (URL: ${canonical})\n`;
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

async function main() {
  const articles = loadArticles();
  const today = new Date().toISOString().split('T')[0];

  console.log(`Building PW Holdings site with ${articles.length} distinct articles...`);

  // 1. Generate XML Sitemap
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  sitemap += `  <url>\n    <loc>${DOMAIN}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  sitemap += `  <url>\n    <loc>${DOMAIN}/articles.html</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

  for (const art of articles) {
    const pubDate = formatDateForXml(art.date);
    const canonical = `${DOMAIN}/articles/${art.slug}/`;
    sitemap += `  <url>\n    <loc>${canonical}</loc>\n    <lastmod>${pubDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
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
    const canonical = `${DOMAIN}/articles/${art.slug}/`;
    rss += `    <item>\n`;
    rss += `      <title>${escapeXml(art.title)}</title>\n`;
    rss += `      <link>${canonical}</link>\n`;
    rss += `      <guid isPermaLink="true">${canonical}</guid>\n`;
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

  // 3. Pre-render individual article HTML files for EVERY article
  for (const art of articles) {
    const artDir = path.join(rootDir, 'articles', art.slug);
    if (!fs.existsSync(artDir)) {
      fs.mkdirSync(artDir, { recursive: true });
    }
    const indexPath = path.join(artDir, 'index.html');
    const flatPath = path.join(rootDir, 'articles', `${art.slug}.html`);

    const html = generateArticlePageHtml(art);
    fs.writeFileSync(indexPath, html, 'utf8');
    fs.writeFileSync(flatPath, html, 'utf8');
    console.log(`✓ Pre-rendered unique article: articles/${art.slug}/index.html`);
  }

  // 4. Update articles.html listing and llms.txt
  updateArticlesHtml(articles);
  updateLlmsTxt(articles);

  console.log('🎉 Site build completed successfully with separate, individual article pages!');

  // 5. Automated Fast Indexing (if --index flag is passed)
  if (process.argv.includes('--index')) {
    const { submitIndexNow, submitGoogleIndexing, pingSitemaps } = require('./fast-index');
    const urls = [
      `${DOMAIN}/`,
      `${DOMAIN}/articles.html`,
      ...articles.map(a => `${DOMAIN}/articles/${a.slug}/`)
    ];
    await submitIndexNow(urls);
    await submitGoogleIndexing(urls);
    await pingSitemaps();
  }
}

main();
