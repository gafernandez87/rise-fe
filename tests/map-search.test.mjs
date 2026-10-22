import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Load the project's TypeScript helpers without a build or an extra dependency.
const root = fileURLToPath(new URL('..', import.meta.url));
const nativeRequire = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  file = path.resolve(root, file);
  if (cache.has(file)) return cache.get(file).exports;
  const mod = new Module(file);
  cache.set(file, mod);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(root);
  mod.require = (id) => id.startsWith('@/') ? load(`${id.slice(2)}.ts`) : nativeRequire(id);
  mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, file);
  return mod.exports;
}
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
