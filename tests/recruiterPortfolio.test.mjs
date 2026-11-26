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
  assert.match(hero, /<FloatingSkills \/>/);
  assert.match(hero, /aspect-square w-\[86%\].*rounded-\[1\.6rem\]/);
  assert.doesNotMatch(hero, /<FloatingSkills mode=/);
  const skills = source('src/components/FloatingSkills.tsx');
  for (const tech of ['ROS 2', 'React Native', 'Arduino', 'SolidWorks', 'STM32', 'C++', 'Raspberry Pi', 'Python', 'OpenCV', 'Docker', 'Linux', 'Git']) {
    assert.ok(skills.includes(`name: '${tech}'`), `missing floating icon ${tech}`);
  }
  assert.match(skills, /absolute inset-0 z-0 overflow-hidden/);
  assert.match(skills, /Positioning is relative to the ENTIRE home section/);
  assert.match(skills, /opacity-\[\.23\]/);
  assert.doesNotMatch(skills, /rounded-xl border border-blue-100 bg-white\/90/);
  const projects = source('src/sections/Projects.tsx');
  assert.match(projects, /const otherProjects = PROJECTS_DATA\.filter/);
  assert.match(projects, /EVIDENCE\.map/);
  assert.match(projects, /otherProjects\.map/);
  assert.match(projects, /project\.tags\.slice\(0, 4\)/);
  assert.match(projects, /project\.image/);
  assert.match(projects, /View Project/);
});

test('V7 mobile-first layout keeps every original element while avoiding tablet nav crowding', () => {
  const hero = source('src/sections/Hero.tsx');
  const navbar = source('src/components/Navbar.tsx');
  const projects = source('src/sections/Projects.tsx');
  const skills = source('src/sections/Skills.tsx');
  const css = source('src/index.css');

  assert.match(css, /max-w-\[1920px\].*px-5 sm:px-8 lg:px-12 xl:px-20/);
  assert.match(hero, /text-\[clamp\(2\.05rem,9\.5vw,2\.8rem\)\]/);
  assert.match(hero, /xl:grid-cols-\[minmax\(0,1\.14fr\)_minmax\(380px,\.86fr\)\]/);
  assert.match(hero, /btn-primary w-full justify-center sm:w-auto/);
  assert.match(hero, /btn-ghost w-full justify-center sm:w-auto/);
  assert.match(navbar, /xl:flex/);
  assert.match(navbar, /xl:hidden/);
  assert.match(navbar, /aria-controls="mobile-navigation"/);
  assert.match(navbar, /max-h-\[calc\(100dvh-4rem\)\]/);
  assert.match(navbar, /event\.key === 'Escape'/);
  assert.match(projects, /md:grid-cols-2 xl:grid-cols-3/);
  assert.match(skills, /xl:flex-row/);
  assert.match(skills, /aria-pressed=\{activeCategory === cat\}/);
});

test('V7 card reveals and navigation respect reduced motion without removing old cards', () => {
  const hero = source('src/sections/Hero.tsx');
  const navbar = source('src/components/Navbar.tsx');
  const projects = source('src/sections/Projects.tsx');
  const additionalCards = projects.split('otherProjects.map')[1];
  assert.match(hero, /useReducedMotion\(\)/);
  assert.match(navbar, /reduceMotion \? 'auto' : 'smooth'/);
  assert.match(projects, /otherProjects\.map\(\(project, index\) => \(/);
  assert.match(additionalCards, /<motion\.article/);
  assert.match(additionalCards, /whileInView=\{reduceMotion \? undefined : \{ opacity: 1, y: 0 \}\}/);
  assert.match(additionalCards, /viewport=\{\{ once: true, amount: \.08 \}\}/);
  assert.match(additionalCards, /focus-within:ring-2/);
  assert.match(source('src/index.css'), /prefers-reduced-motion: reduce/);
});
