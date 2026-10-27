import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypeScript as load } from './helpers/typescript.mjs';
const { readMapInitialFilters, mapFiltersQuery, mapFilterPath } = load('lib/map-filters.ts');
const { filterMapCases } = load('lib/map-search.ts');
const cases = [
  { id: 'ar-water', title: 'Gestión comunitaria', country: 'Argentina', threat: 'Sequía', youthRole: 'Organización juvenil', shortDescription: 'Restauración de cuencas', category: { name: 'Agua' } },
  { id: 'cl-water', title: 'Reserva comunitaria', country: 'Chile', threat: 'Sequía', shortDescription: 'Agua para comunidades', category: { name: 'Agua' } },
  { id: 'cl-flood', title: 'Parque', country: 'Chile', threat: 'Inundación', shortDescription: 'Infraestructura verde', category: { name: 'Ciudades' } },
];
const ids = (filters) => filterMapCases(cases, filters, (item) => item.threat).map((item) => item.id);

test('two countries are OR, with a risk intersected using AND', () => {
  assert.deepEqual(ids({ country: ['Argentina', 'Chile'], risk: ['Sequía'] }), ['ar-water', 'cl-water']);
  assert.deepEqual(ids({ country: ['Argentina'], risk: ['Inundación'] }), []);
});
test('search tolerates accents and casing, including youth participation', () => {
  assert.deepEqual(ids({ query: 'INUNDACION' }), ['cl-flood']);
  assert.deepEqual(ids({ query: 'organizacion juvenil' }), ['ar-water']);
});
test('every filter and multiword query survives a shared URL roundtrip', () => {
  const original = { country: ['Argentina', 'Chile'], risk: ['Sequía'], measure: ['Agua'], territory: ['Zona norte'], actor: ['Juventudes'], query: 'gestión del agua' };
  const params = new URLSearchParams(mapFiltersQuery(original));
  assert.deepEqual(readMapInitialFilters(Object.fromEntries([...params.keys()].map((key) => [key, params.getAll(key)]))), original);
});
test('old Spanish aliases still work, duplicates and blank options are cleaned', () => {
  assert.deepEqual(readMapInitialFilters({ pais: [' Chile ', 'Chile', ''], riesgo: 'Sequía', categoria: 'Agua' }), { country: ['Chile'], risk: ['Sequía'], measure: ['Agua'], query: undefined });
});
test('country links retain locale and are correctly encoded', () => {
  assert.equal(mapFilterPath('pt', 'country', 'Brasil'), '/pt/mapa?country=Brasil');
  assert.equal(mapFilterPath('es', 'risk', 'Sequía'), '/mapa?risk=Sequ%C3%ADa');
});
test('clearing restores all cases; trailing space can be typed in the search input', () => {
  assert.deepEqual(ids({}), ['ar-water', 'cl-water', 'cl-flood']);
  assert.equal(readMapInitialFilters({ q: 'gestión ' }).query, 'gestión ');
});

// Regression coverage for broader search and zero-result suggestions.
{
const search = load('lib/map-search.ts');
const cases = [
  { id: 'a', title: 'Prevención de inundación', country: 'Argentina', threat: 'Inundación', measureType: 'Alerta', category: { name: 'Alerta' }, searchText: 'Organización Río · restauración de humedales' },
  { id: 'b', title: 'Agua comunitaria', country: 'Chile', threat: 'Sequía', measureType: 'Captación', category: { name: 'Agua' } },
  { id: 'c', title: 'Alerta vecinal', country: 'Chile', threat: 'Inundación', category: { name: 'Alerta' } },
];
const risk = item => item.threat;
const ids = filters => search.filterMapCases(cases, filters, risk).map(item => item.id);
test('case and accent variants return identical results', () => {
  assert.deepEqual(ids({ query: 'inundacion' }), ['a', 'c']);
  assert.deepEqual(ids({ query: 'INUNDACIÓN' }), ids({ query: 'inundacion' }));
});
test('searches documented organization and solution text', () => {
  assert.deepEqual(ids({ query: 'organizacion rio' }), ['a']);
  assert.deepEqual(ids({ query: 'restauracion' }), ['a']);
});
test('combines countries with OR and filter groups with AND', () => {
  assert.deepEqual(ids({ country: ['Argentina', 'Chile'], risk: ['Sequía'] }), ['b']);
});
test('suggests only removals that restore results, preserving other filters', () => {
  const filters = { country: ['Argentina'], risk: ['Sequía'] };
  const suggestions = search.getFilterSuggestions(cases, filters, risk);
  assert.equal(suggestions.length, 2);
  for (const suggestion of suggestions) {
    assert.equal(suggestion.count, ids(suggestion.filters).length);
    assert.ok(suggestion.count > 0);
    assert.deepEqual(suggestion.filters[suggestion.key === 'country' ? 'risk' : 'country'], suggestion.key === 'country' ? ['Sequía'] : ['Argentina']);
  }
  assert.deepEqual(filters, { country: ['Argentina'], risk: ['Sequía'] });
});
test('removing one choice retains other choices in the same filter', () => {
  const suggestions = search.getFilterSuggestions(cases, { country: ['Argentina', 'Chile'], query: 'imposible' }, risk);
  assert.equal(suggestions.length, 1);
  assert.equal(suggestions[0].key, 'query');
  assert.deepEqual(suggestions[0].filters.country, ['Argentina', 'Chile']);
});
test('does not invent suggestions when the catalogue is empty', () => {
  assert.deepEqual(search.getFilterSuggestions([], { query: 'agua' }, risk), []);
});

}
