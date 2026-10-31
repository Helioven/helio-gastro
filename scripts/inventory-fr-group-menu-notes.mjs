// Read-only inventory of group/set-menu notes for French QA.
// Run: node scripts/inventory-fr-group-menu-notes.mjs
// Exact-match candidates are NOT proof of browser coverage: DOM scope and dynamic
// renderers require separate visual QA. Protected titles must never be translated.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const catalog = JSON.parse(readFileSync(new URL('../data/places.json', import.meta.url), 'utf8'));
const places = Array.isArray(catalog) ? catalog : Array.isArray(catalog.places) ? catalog.places : [];
if (!places.length) throw new Error('No places found in data/places.json');
const source = readFileSync(new URL('../i18n.js', import.meta.url), 'utf8');
function extractLiteralMap(name) {
  // Read literal map entries from the existing experimental FR implementation;
  // never execute i18n.js or mutate the catalogue.
  const match = source.match(new RegExp('const ' + name + '=new Map\\((\\[[\\s\\S]*?\\])\\);'));
  if (!match) throw new Error('FR map not found: ' + name);
  const pairs = runInNewContext(match[1], Object.create(null), { timeout: 1000 });
  if (!Array.isArray(pairs) || !pairs.every(p => Array.isArray(p) && p.length === 2 && p.every(s => typeof s === 'string')))
    throw new Error('FR map has unexpected entries: ' + name);
  return new Map(pairs);
}
const exactGroup = extractLiteralMap('frenchGroupLabels');
const exactNotices = extractLiteralMap('frenchDetailNotices');
const norm = value => String(value ?? '').trim().replace(/\\s+/g, ' ');
const entries = [];
function add(place, path, es, en = '') {
  if (typeof es !== 'string' || !es.trim()) return;
  const protectedField = path.includes('(protected)');
  const spanish = es.trim(), english = typeof en === 'string' ? en.trim() : '';
  const candidate = [spanish, english].find(text => exactGroup.has(norm(text)) || exactNotices.has(norm(text)));
  const status = protectedField ? 'protected' : candidate ? 'exact_candidate' : 'needs_context_review';
  entries.push({
    placeId: place.id, placeName: place.name, path, es: spanish, en: english,
    status, ...(candidate ? { proposedFr: exactGroup.get(norm(candidate)) ?? exactNotices.get(norm(candidate)) } : {})
  });
}
for (const place of places) {
  add(place, 'menuPriceNotice', place.menuPriceNotice, place.menuPriceNoticeEn);
  if (Array.isArray(place.groupMenus)) place.groupMenus.forEach((menu, i) => {
    add(place, `groupMenus[${i}].includes`, menu.includes, menu.includesEn);
    add(place, `groupMenus[${i}].name (protected)`, menu.name);
  });
  if (Array.isArray(place.officialSetMenus)) place.officialSetMenus.forEach((menu, i) => {
    add(place, `officialSetMenus[${i}].noteEs`, menu.noteEs, menu.noteEn);
    add(place, `officialSetMenus[${i}].name (protected)`, menu.name, menu.nameEn);
  });
  if (Array.isArray(place.menuNotes)) place.menuNotes.forEach((note, i) => add(place, `menuNotes[${i}]`, note));
  if (Array.isArray(place.menus)) place.menus.forEach((menu, i) => {
    if (!menu?.menuCourses) return;
    add(place, `menus[${i}].service (protected)`, menu.service);
    add(place, `menus[${i}].beveragesIncluded`, menu.beveragesIncluded);
  });
}
const summary = { protected: 0, exact_candidate: 0, needs_context_review: 0 };
for (const entry of entries) summary[entry.status]++;
const byPlace = Object.values(Object.groupBy(entries, e => e.placeId)).map(group => ({
  placeId: group[0].placeId, placeName: group[0].placeName,
  total: group.length, exactCandidates: group.filter(e => e.status === 'exact_candidate').length,
  needsContextReview: group.filter(e => e.status === 'needs_context_review').length,
  protected: group.filter(e => e.status === 'protected').length
}));
console.log(JSON.stringify({
  source: 'data/places.json', frenchSource: 'i18n.js', total: entries.length,
  warning: 'Exact candidates are literal matches, not verified browser translations. Dynamic rules, context and DOM scope may change coverage; unresolved entries require manual/browser review.',
  summary, byPlace, entries
}, null, 2));
