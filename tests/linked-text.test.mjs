import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadTypeScript } from './helpers/typescript.mjs';

const { LinkedText } = loadTypeScript('components/cases/linked-text.tsx');
const render = (text) => renderToStaticMarkup(createElement(LinkedText, { text }));

test('links web references, markdown labels, and contact addresses', () => {
  const html = render('Fuente: https://example.org/doc.pdf.\n[Informe](https://example.org/report) www.example.org contacto@example.org');
  assert.ok(html.includes('href="https://example.org/doc.pdf"'));
  assert.ok(html.includes('>Informe</a>'));
  assert.ok(html.includes('href="https://www.example.org"'));
  assert.ok(html.includes('href="mailto:contacto@example.org"'));
  assert.ok(html.includes('</a>.\n'));
});

test('keeps balanced URL parentheses and escapes untrusted text', () => {
  assert.ok(render('(https://example.org/wiki/Adaptation_(climate)).').includes('href="https://example.org/wiki/Adaptation_(climate)"'));
  const html = render('<script>alert(1)</script> [bad](javascript:alert(1))');
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<a '));
});

test('recognizes references written without a protocol', () => {
  const html = render('Ver example.org/informe.pdf y contacto@example.org.');
  assert.ok(html.includes('href="https://example.org/informe.pdf"'));
  assert.ok(html.includes('href="mailto:contacto@example.org"'));
  assert.ok(html.includes('rise-content-link'));
});
