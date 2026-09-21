const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const articlesPath = path.join(rootDir, 'data', 'articles.json');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

const args = process.argv.slice(2);
const titleArg = args.find(a => !a.startsWith('--')) || 'New Zoho ERP & Business Guide for Sri Lanka';
const categoryArg = 'erp';
const categoryLabelArg = 'Cloud ERP & Insights';

const slug = slugify(titleArg);
const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

if (articles.some(a => a.slug === slug)) {
  console.log(`Article with slug "${slug}" already exists.`);
  process.exit(0);
}

const newArticle = {
  slug: slug,
  title: titleArg,
  description: `Complete guide and expert recommendations on ${titleArg} for Sri Lankan enterprises by PW Holdings.`,
  category: categoryArg,
  categoryLabel: categoryLabelArg,
  date: dateStr,
  readTime: "6 min read",
  author: "PW Holdings Senior ERP Consultants",
  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
  url: `https://pwholdings.lk/articles/${slug}/`
};

articles.unshift(newArticle);
fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf8');
console.log(`✓ Added new article "${titleArg}" [${slug}] to data/articles.json`);

// Run build-site.js
execSync('node scripts/build-site.js', { cwd: rootDir, stdio: 'inherit' });
console.log(`\n🎉 New article created and site rebuilt! To deploy to your server, simply run:`);
console.log(`   git add . && git commit -m "feat(article): add ${slug}" && git push origin main`);
