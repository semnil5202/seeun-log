/**
 * Supabase에서 prev_slug 매핑을 조회하여 CF Function 코드를 생성한다.
 * Usage: node infra/scripts/generate-redirects.mjs
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

async function query(table, select, filter) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}&${filter}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.error(`Query ${table} failed: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  return res.json();
}

const postsWithPrevSlug = await query('posts', 'slug,prev_slug,category,sub_category', 'prev_slug=not.is.null');
const postsWithPrevCat = await query(
  'posts',
  'slug,category,sub_category,prev_category,prev_sub_category',
  'or=(prev_category.not.is.null,prev_sub_category.not.is.null)',
);
const categories = await query('categories', 'slug,prev_slug', 'prev_slug=not.is.null');

const allCategories = await query('categories', 'slug', '');
const allCurrentCatSlugs = new Set(allCategories.map((c) => c.slug));
const allCurrentPostSlugs = new Set(
  (await query('posts', 'slug', '')).map((p) => p.slug),
);

const postRedirects = {};
for (const p of postsWithPrevSlug) {
  if (allCurrentPostSlugs.has(p.prev_slug)) continue;
  postRedirects[p.prev_slug] = { s: p.slug, c: p.category, sc: p.sub_category };
}

const postCategoryRedirects = {};
for (const p of postsWithPrevCat) {
  const pc = p.prev_category || p.category;
  const psc = p.prev_sub_category || p.sub_category;
  const key = `${pc}/${psc}/${p.slug}`;
  postCategoryRedirects[key] = { c: p.category, sc: p.sub_category };
}

const categoryRedirects = {};
for (const c of categories) {
  if (allCurrentCatSlugs.has(c.prev_slug)) continue;
  categoryRedirects[c.prev_slug] = { s: c.slug };
}

const templatePath = join(__dirname, '..', 'cf-functions', 'viewer-request.js.template');
const outputPath = join(__dirname, '..', 'cf-functions', 'viewer-request.js');
const template = readFileSync(templatePath, 'utf-8');

const output = template
  .replace('__POST_REDIRECTS__', JSON.stringify(postRedirects))
  .replace('__CATEGORY_REDIRECTS__', JSON.stringify(categoryRedirects))
  .replace('__POST_CATEGORY_REDIRECTS__', JSON.stringify(postCategoryRedirects));

const sizeKB = Buffer.byteLength(output, 'utf-8') / 1024;
if (sizeKB > 9.5) {
  console.error(`CF Function size ${sizeKB.toFixed(1)}KB exceeds safe limit (9.5KB)`);
  process.exit(1);
}

writeFileSync(outputPath, output);
console.log(
  `Generated viewer-request.js (${sizeKB.toFixed(1)}KB, ${Object.keys(postRedirects).length} post slug redirects, ${Object.keys(postCategoryRedirects).length} post category redirects, ${Object.keys(categoryRedirects).length} category redirects)`,
);
