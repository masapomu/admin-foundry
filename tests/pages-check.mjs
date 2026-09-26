import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const artifact = resolve(process.argv[2] || join(root, '.work/pages'));
const failures = [];
const pages = [];
const allFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else allFiles.push(file);
  }
}

function checkLink(source, value) {
  if (!value || /^(?:#|https?:|mailto:|tel:|data:|javascript:)/i.test(value)) return;
  if (value.startsWith('/')) { failures.push(`${source}: root-absolute path ${value}`); return; }
  const pathname = decodeURIComponent(value.split(/[?#]/, 1)[0]);
  if (!pathname) return;
  const target = resolve(dirname(source), pathname);
  if (target !== artifact && !target.startsWith(artifact + sep)) {
    failures.push(`${source}: path escapes artifact ${value}`);
  } else if (!existsSync(target)) {
    failures.push(`${source}: missing ${value}`);
  }
}

if (!existsSync(artifact)) throw new Error(`Pages artifact missing: ${artifact}`);
walk(artifact);
for (const file of allFiles) {
  const extension = extname(file);
  if (extension === '.html') {
    pages.push(file);
    const html = readFileSync(file, 'utf8');
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) checkLink(file, match[1]);
  }
  if (extension === '.css') {
    const css = readFileSync(file, 'utf8');
    for (const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) checkLink(file, match[1]);
  }
}
for (const name of ['README.md', 'README.ja.md']) {
  const file = join(root, name);
  const markdown = readFileSync(file, 'utf8');
  for (const match of markdown.matchAll(/!?(?:\[[^\]]*\])\(([^)]+)\)/g)) {
    const value = match[1];
    if (/^(?:https?:|#)/.test(value)) continue;
    if (!existsSync(resolve(root, value.split('#')[0]))) failures.push(`${name}: missing ${value}`);
  }
}
const expected = ['login', 'login-ja', 'dashboard', 'users', 'system', 'logs', 'forms', 'components', 'patterns', 'i18n', 'charts'];
for (const name of expected) if (!existsSync(join(artifact, 'demo', `${name}.html`))) failures.push(`missing demo/${name}.html`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Pages links OK: ${pages.length} HTML pages, ${allFiles.length} files; README links and eleven reference entry pages present.`);
}
