import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypeScript } from './helpers/typescript.mjs';

const { hasValidMapCoordinates } = loadTypeScript('lib/map-coordinates.ts');

test('only cases with valid numeric coordinate pairs are shown on the map', () => {
  const cases = [
    { id: 'valid', latitude: -34.6, longitude: -58.4 },
    { id: 'zero', latitude: 0, longitude: 0 },
    { id: 'missing', latitude: null, longitude: null },
    { id: 'partial', latitude: -34.6 },
    { id: 'nan', latitude: NaN, longitude: NaN },
    { id: 'infinite', latitude: Infinity, longitude: 0 },
    { id: 'text', latitude: '', longitude: '' },
    { id: 'out-of-range', latitude: 91, longitude: -58 },
  ];
  assert.deepEqual(cases.filter(hasValidMapCoordinates).map((item) => item.id), ['valid', 'zero']);
});
