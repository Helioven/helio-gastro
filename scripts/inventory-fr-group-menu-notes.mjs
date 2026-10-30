// Read-only inventory of group/set-menu notes for French QA.
// Run: node scripts/inventory-fr-group-menu-notes.mjs
import { readFileSync } from 'node:fs';

const catalog = JSON.parse(readFileSync(new URL('../data/places.json', import.meta.url), 'utf8'));
const places = Array.isArray(catalog) ? catalog : Array.isArray(catalog.places) ? catalog.places : [];
if (!places.length) throw new Error('No places found in data/places.json');
const entries = [];
function add(place, path, es, en = '') {
  if (typeof es !== 'string' || !es.trim()) return;
  entries.push({ placeId: place.id, placeName: place.name, path, es: es.trim(), en: typeof en === 'string' ? en.trim() : '' });
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
console.log(JSON.stringify({ source: 'data/places.json', total: entries.length, entries }, null, 2));
