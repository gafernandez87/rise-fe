import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Exercise TypeScript helpers and React components without running a build.
const root = fileURLToPath(new URL('../..', import.meta.url));
const nativeRequire = createRequire(import.meta.url);
const cache = new Map();
export function loadTypeScript(file) {
  file = path.resolve(root, file);
  if (cache.has(file)) return cache.get(file).exports;
  const mod = new Module(file);
  cache.set(file, mod);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(root);
  mod.require = (id) => {
    if (!id.startsWith('@/')) return nativeRequire(id);
    const source = id.slice(2);
    return loadTypeScript(fs.existsSync(path.join(root, `${source}.ts`)) ? `${source}.ts` : `${source}.tsx`);
  };
  mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, file);
  return mod.exports;
}
