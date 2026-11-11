import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadTypeScript as load } from './helpers/typescript.mjs';

const { localizeRecord, translatedFields } = load('lib/content-translations.ts');
const { localizeCase, localizeMapCase } = load('lib/i18n.ts');
const { filterMapCases } = load('lib/map-search.ts');
const { TranslationNotice } = load('components/editorial-details.tsx');
const english = Object.fromEntries(translatedFields.map((field) => [field, `English ${field}`]));
const item = {
  id: 'brazilian-measure', slug: 'manguezais-para', status: 'published',
  title: 'Manejo adaptativo dos manguezais amazônicos', shortDescription: 'Juventudes restauram manguezais.', fullDescription: 'Descrição completa em português.',
  country: 'Brasil', ecoregion: 'Amazônia', threat: 'Inundação', measureType: 'Área costeira', objectives: 'Proteger comunidades.',
  category: { id: 'coast', slug: 'area-costeira', name: 'Área costeira' }, images: [], latitude: -1, longitude: -48,
  translations: [
    { language: 'en', status: 'in_progress', ...english, title: 'Adaptive management of Amazonian mangroves', country: 'Brazil', threat: 'Flooding', measureType: 'Coastal area', ecoregion: 'Amazonia' },
    { language: 'pt', status: 'in_progress', title: 'Manejo adaptativo dos manguezais amazônicos', shortDescription: 'Juventudes restauram manguezais.', country: 'Brasil', ecoregion: 'Amazônia' },
  ],
};

test('/en/mapa uses imported English values even while their progress is in_progress', () => {
  const localized = localizeMapCase(item, 'en');
  assert.equal(localized.title, 'Adaptive management of Amazonian mangroves');
  assert.equal(localized.shortDescription, english.shortDescription);
  assert.equal(localized.country, 'Brazil');
  assert.equal(localized.category.name, 'Coastal area');
  assert.equal(localized.slug, item.slug);
  assert.equal(localized.id, item.id);
});

test('/en/casos/{slug} localizes every translated text field, preserving shared data', () => {
  const localized = localizeCase(item, 'en');
  for (const field of translatedFields) {
    if (field !== 'risks') assert.equal(localized[field], item.translations[0][field], field);
  }
  assert.deepEqual(localized.images, item.images);
  assert.equal(localized.latitude, item.latitude);
  assert.equal(localized.status, 'published');
});

test('locale selects content independently of country, original language and progress flag', () => {
  assert.equal(localizeCase(item, 'pt').title, item.title);
  assert.equal(localizeCase({ ...item, country: 'Argentina' }, 'en').title, item.translations[0].title);
  assert.equal(localizeCase({ ...item, translations: [{ language: 'es', status: 'in_progress', title: 'Manejo adaptativo de manglares amazónicos' }] }, 'es').title, 'Manejo adaptativo de manglares amazónicos');
});

test('blank translations cannot erase source text, and translated fields cannot change IDs', () => {
  const localized = localizeRecord({ ...item, translations: [{ language: 'en', status: 'pending', title: '', objectives: ' ', id: 'injected', statusOverride: 'draft' }] }, 'en');
  assert.equal(localized.title, item.title);
  assert.equal(localized.objectives, item.objectives);
  assert.equal(localized.id, item.id);
  assert.equal(localized.status, item.status);
});

test('real saved text overrides old placeholder translations for seeded slugs', () => {
  const localized = localizeCase({ ...item, slug: 'gestion-comunitaria-agua-sequia', translations: [] }, 'es');
  assert.equal(localized.title, item.title);
  assert.equal(localized.fullDescription, item.fullDescription);
});

test('country, risk and ecosystem filters keep working with original and localized values', () => {
  const localized = localizeMapCase(item, 'en');
  for (const filters of [{ country: ['Brasil'] }, { country: ['Brazil'] }, { risk: ['Inundação'] }, { territory: ['Amazônia'] }, { measure: ['Área costeira'] }]) {
    assert.equal(filterMapCases([localized], filters, (entry) => entry.threat).length, 1);
  }
});

test('loaded translations do not trigger an incorrect original-content warning', () => {
  assert.equal(renderToStaticMarkup(React.createElement(TranslationNotice, { record: item, locale: 'en' })), '');
});

test('legacy summary/content aliases remain readable without discarding the full description', () => {
  const localized = localizeCase({ ...item, translations: [{ language: 'en', status: 'in_progress', summary: 'Summary', content: 'Full text' }] }, 'en');
  assert.equal(localized.shortDescription, 'Summary');
  assert.equal(localized.fullDescription, 'Full text');
  const partial = localizeCase({ ...item, translations: [{ language: 'en', status: 'in_progress', shortDescription: 'Summary' }] }, 'en');
  assert.equal(partial.fullDescription, item.fullDescription);
});
