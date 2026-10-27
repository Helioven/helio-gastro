#!/usr/bin/env node
'use strict';
// Helio Gastro — static, read-only data QA. Node 18+, no dependencies.
// Run: node scripts/audit-data.mjs
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = resolve(process.cwd(), process.argv[2] || 'data/places.json');
const issues = [];
const add = (severity, path, message) => issues.push({ severity, path, message });
let places;
try {
  places = JSON.parse(readFileSync(file, 'utf8'));
} catch (err) {
  console.error('FAIL: unable to read valid JSON:', err.message);
  process.exit(2);
}
if (!Array.isArray(places)) {
  console.error('FAIL: catalog must be an array.');
  process.exit(2);
}
const seen = new Map();
const today = new Date().toISOString().slice(0, 10);
const validDate = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0,10) === s;
const checkPrices = (prices, path) => {
  if (prices == null) return;
  if (!Array.isArray(prices)) { add('error', path, 'dishPrices must be an array'); return; }
  for (const [i, price] of prices.entries()) {
    const at = `${path}[${i}]`;
    if (!price || typeof price !== 'object' || Array.isArray(price)) { add('error',at,'invalid price record'); continue; }
    if (!price.dish || typeof price.dish !== 'string') add('error',at,'missing dish name');
    if (typeof price.eur !== 'number' || !Number.isFinite(price.eur) || price.eur < 0) add('error',at,'invalid EUR amount');
    if (price.portion != null && typeof price.portion !== 'string') add('error',at,'portion is not text');
  }
};
for (const [index, place] of places.entries()) {
  const path = `places[${index}]`;
  if (!place || typeof place !== 'object' || Array.isArray(place)) { add('error',path,'invalid establishment'); continue; }
  const id = place.id;
  if (typeof id !== 'string' || !id.trim()) add('error',path,'missing ID');
  else if (seen.has(id)) add('error',path,`duplicate ID (first at ${seen.get(id)})`);
  else seen.set(id,path);
  if (typeof place.name !== 'string' || !place.name.trim()) add('error',path,'missing name');
  if (place.checkedAt && !validDate(place.checkedAt)) add('error',path,'invalid checkedAt date');
  else if (place.checkedAt && place.checkedAt > today) add('warning',path,'checkedAt is in the future');
  if (place.mealCostEur != null && (typeof place.mealCostEur !== 'number' || !Number.isFinite(place.mealCostEur) || place.mealCostEur < 0))
    add('error',path,'invalid mealCostEur');
  if (place.sources != null) {
    if (!Array.isArray(place.sources)) add('error',path,'sources must be an array');
    else for (const [i, source] of place.sources.entries()) {
      if (!source || typeof source !== 'object') { add('error',`${path}.sources[${i}]`,'invalid source'); continue; }
      if (typeof source.url !== 'string' || !/^https:\/\//i.test(source.url)) add('warning',`${path}.sources[${i}]`,'missing HTTPS source URL');
    }
  }
  checkPrices(place.dishPrices,`${path}.dishPrices`);
  if (place.menus != null) {
    if (!Array.isArray(place.menus)) add('error',path,'menus must be an array');
    else for (const [i,menu] of place.menus.entries()) {
      if (!menu || typeof menu !== 'object') { add('error',`${path}.menus[${i}]`,'invalid menu'); continue; }
      checkPrices(menu.dishPrices,`${path}.menus[${i}].dishPrices`);
      if (menu.menuSections != null && !Array.isArray(menu.menuSections)) add('error',`${path}.menus[${i}]`,'menuSections must be an array');
    }
  }
}
const totals = { establishments: places.length, errors: issues.filter(x=>x.severity==='error').length, warnings: issues.filter(x=>x.severity==='warning').length };
console.log(JSON.stringify({ totals, issues },null,2));
if (totals.establishments !== 44) console.error(`NOTICE: expected 44 establishments based on README; got ${totals.establishments}.`);
process.exitCode = totals.errors ? 1 : 0;
