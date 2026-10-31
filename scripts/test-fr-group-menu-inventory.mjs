// QA of report invariants only; does not change restaurant data.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const report = JSON.parse(readFileSync(new URL('../qa-reports/fr-group-menu-notes.json', import.meta.url), 'utf8'));
const entries = report.entries;
assert.ok(Array.isArray(entries) && entries.length > 0, 'Inventory must contain entries');
assert.equal(report.total, entries.length, 'Total mismatch');
const allowed = new Set(['protected','exact_candidate','needs_context_review']);
for (const entry of entries) {
  assert.ok(allowed.has(entry.status), 'Unknown classification');
  assert.ok(entry.placeId && entry.path && entry.es, 'Incomplete entry');
  assert.equal(entry.status === 'protected', entry.path.includes('(protected)'), 'Protected title classification mismatch');
  if (entry.status === 'exact_candidate') assert.ok(entry.proposedFr?.trim(), 'Candidate without proposed translation');
  else assert.ok(!Object.hasOwn(entry,'proposedFr'), 'Proposed translation on noncandidate');
}
for (const status of allowed)
  assert.equal(report.summary[status], entries.filter(e => e.status === status).length, 'Incorrect summary count: '+status);
assert.equal(Object.values(report.summary).reduce((a,b)=>a+b,0), entries.length, 'Summary total mismatch');
assert.ok(Array.isArray(report.byPlace), 'Missing per-place totals');
for (const p of report.byPlace) {
  const own = entries.filter(e => e.placeId === p.placeId);
  assert.equal(p.total, own.length, 'Incorrect place total: '+p.placeId);
  assert.equal(p.exactCandidates, own.filter(e=>e.status==='exact_candidate').length, 'Incorrect candidate count: '+p.placeId);
  assert.equal(p.needsContextReview, own.filter(e=>e.status==='needs_context_review').length, 'Incorrect review count: '+p.placeId);
  assert.equal(p.protected, own.filter(e=>e.status==='protected').length, 'Incorrect protected count: '+p.placeId);
}
assert.equal(report.byPlace.reduce((sum,p)=>sum+p.total,0), entries.length, 'Missing entries in per-place summary');
console.log('FR group-menu inventory invariants PASS:', report.total, 'entries;', report.byPlace.length, 'places');
