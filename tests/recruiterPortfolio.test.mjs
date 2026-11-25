import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const root = new URL('../', import.meta.url).pathname;
const source = (path) => readFileSync(join(root, path), 'utf8');

test('one-click resume is a real public PDF, not a placeholder link', () => {
  const pdfPath = join(root, 'public/Yakhrevan_S_Resume.pdf');
  const pdf = readFileSync(pdfPath);
  assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
  assert.ok(statSync(pdfPath).size > 20_000);
  assert.match(source('src/sections/Hero.tsx'), /Yakhrevan_S_Resume\.pdf/);
  assert.match(source('src/sections/Hero.tsx'), /download="Yakhrevan_S_Resume\.pdf"/);
});

test('spotlight presents PickBot, Navigation and Control with source and clear ownership', () => {
  const projects = source('src/sections/Projects.tsx');
  for (const name of ['pickbot', 'navigation-lab', 'robot-control-center']) {
    assert.ok(projects.includes(`id: '${name}'`), `missing featured project ${name}`);
  }
  assert.match(projects, /My contribution/);
  assert.match(projects, /AI-assisted/);
  assert.match(projects, /Live demo \+ case study/);
  assert.match(projects, /Review source/);
  assert.match(projects, /Hardware pending|hardware validation/i);
});

test('front page has a useful route to projects, verified contact and relevant metadata', () => {
  const hero = source('src/sections/Hero.tsx');
  assert.match(hero, /href="#projects"/);
  assert.match(hero, /mailto:\$\{P\.socials\.email\}/);
  assert.match(hero, /profile\.webp/);
  const html = source('index.html');
  assert.match(html, /rel="canonical" href="https:\/\/yakhrevan\.github\.io\/Yakhrevan-Portfolio\/"/);
});

test('initial render skips decorative splash and defers WebGL below the fold', () => {
  const app = source('src/App.tsx');
  assert.doesNotMatch(app, /<Splash/);
  assert.match(app, /lazy\(\(\) => import\('\.\/sections\/RobotLab'\)/);
  assert.match(app, /<DeferredSection/);
  assert.match(app, /showCompanion/);
  assert.match(source('src/components/DeferredSection.tsx'), /IntersectionObserver/);
});
