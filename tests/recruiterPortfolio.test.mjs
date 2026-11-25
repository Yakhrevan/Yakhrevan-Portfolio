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

test('welcome animation is skippable, while below-fold WebGL stays deferred', () => {
  const app = source('src/App.tsx');
  assert.match(app, /<Splash onDone=\{dismissIntro\}/);
  assert.match(app, /prefers-reduced-motion: reduce/);
  assert.match(app, /projectFromUrl\(\) === null/);
  assert.match(app, /lazy\(\(\) => import\('\.\/sections\/RobotLab'\)/);
  assert.match(app, /<DeferredSection/);
  assert.match(app, /showCompanion/);
  assert.match(source('src/components/Splash.tsx'), /Skip intro/);
  assert.match(source('src/components/Splash.tsx'), /window\.setTimeout\(onDone, 2900\)/);
  assert.match(source('src/components/DeferredSection.tsx'), /IntersectionObserver/);
});

test('original hero elements and full-sized project cards return without hiding featured evidence', () => {
  const hero = source('src/sections/Hero.tsx');
  assert.match(hero, /A small engineer, bigger tomorrow/);
  assert.match(hero, /hero-robot-reading\.png/);
  assert.match(hero, /Think\./);
  assert.match(hero, /Build\./);
  assert.match(hero, /Repeat\./);
  assert.match(hero, /<FloatingSkills mode="desktop"/);
  assert.match(hero, /<FloatingSkills mode="mobile"/);
  const skills = source('src/components/FloatingSkills.tsx');
  for (const tech of ['ROS 2', 'React Native', 'Arduino', 'SolidWorks', 'STM32', 'C++', 'Raspberry Pi', 'Python', 'OpenCV', 'Docker', 'Linux', 'Git']) {
    assert.ok(skills.includes(`name: '${tech}'`), `missing floating icon ${tech}`);
  }
  const projects = source('src/sections/Projects.tsx');
  assert.match(projects, /const otherProjects = PROJECTS_DATA\.filter/);
  assert.match(projects, /EVIDENCE\.map/);
  assert.match(projects, /otherProjects\.map/);
  assert.match(projects, /project\.tags\.slice\(0, 4\)/);
  assert.match(projects, /project\.image/);
  assert.match(projects, /View Project/);
});
