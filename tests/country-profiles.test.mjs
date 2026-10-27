import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadTypeScript as load } from './helpers/typescript.mjs';

const { countryProfileSections, countryProfileSectionValue, countryProfileSectionsPayload } = load('lib/country-profiles.ts');
const { CountryProfileSections } = load('components/countries/country-profile-sections.tsx');
const { getDictionary } = load('lib/i18n.ts');
const legacy = {
  id: 'chile', name: 'Chile', slug: 'chile', status: 'draft',
  summary: 'Resumen anterior', mainRisk: 'Sequía', risks: ['Sequía', 'Incendios'],
  territory: 'Zona centro-norte', sector: 'Agua y agricultura', measuresCount: 4,
  exposureAndVulnerabilities: 'Exposición anterior', riskAnalysis: 'Análisis anterior',
  storyTitle: 'Historia anterior',
};

test('existing profiles keep all content in the same sections', () => {
  assert.equal(countryProfileSectionValue(legacy, 'exposure'), legacy.exposureAndVulnerabilities);
  assert.equal(countryProfileSectionValue(legacy, 'vulnerability'), legacy.riskAnalysis);
  assert.equal(countryProfileSectionValue(legacy, 'criticalSectors'), legacy.sector);
  assert.equal(countryProfileSectionValue(legacy, 'prioritizedZones'), legacy.territory);
  assert.equal(countryProfileSectionValue(legacy, 'climateThreats'), 'Sequía, Incendios');
  assert.equal(countryProfileSectionValue(legacy, 'featuredStory'), legacy.storyTitle);
});

test('each section survives form submission and renders under its own heading in all locales', () => {
  const form = new FormData();
  for (const { field, formName } of countryProfileSections) form.set(formName, `Texto ${field}\n\nSegundo párrafo`);
  const profile = { ...legacy, ...countryProfileSectionsPayload(form) };
  for (const locale of ['es', 'en', 'pt']) {
    const html = renderToStaticMarkup(createElement(CountryProfileSections, { profile, locale }));
    const articles = [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map((match) => match[1]);
    assert.equal(articles.length, 10);
    for (const [index, { field }] of countryProfileSections.entries()) {
      assert.ok(articles[index].includes(getDictionary(locale).profiles.sections[field]));
      assert.ok(articles[index].includes(`Texto ${field}\n\nSegundo párrafo`));
      assert.ok(articles[index].includes('whitespace-pre-line'));
    }
  }
});

test('clearing a section does not bring back legacy content after saving', () => {
  for (const { field, formName } of countryProfileSections) {
    const form = new FormData();
    form.set(formName, '  ');
    const updated = { ...legacy, ...countryProfileSectionsPayload(form) };
    assert.equal(updated[field], '');
    assert.equal(countryProfileSectionValue(updated, field), '');
  }
});

test('partial forms preserve omitted sections and cannot write arbitrary fields', () => {
  const form = new FormData();
  form.set('profileInstitutionalFramework', ' Ley nacional\r\n\r\nOrganismos responsables ');
  form.set('status', 'published');
  assert.deepEqual(countryProfileSectionsPayload(form), {
    institutionalFramework: 'Ley nacional\r\n\r\nOrganismos responsables',
  });
  assert.equal(countryProfileSectionValue({ ...legacy, ...countryProfileSectionsPayload(form) }, 'exposure'), legacy.exposureAndVulnerabilities);
});

test('profile text is escaped when displayed', () => {
  const html = renderToStaticMarkup(createElement(CountryProfileSections, {
    profile: { ...legacy, institutionalFramework: '<script>alert(1)</script>' }, locale: 'es',
  }));
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(!html.includes('<script>'));
});
