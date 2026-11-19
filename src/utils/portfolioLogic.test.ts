import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePaperFeed,
  computeActiveSectionId,
  computeTearedProgressPercent,
  editNoteValue,
  formatMachineCounter,
  validateContactNote,
} from './portfolioLogic';

test('editNoteValue inserts characters at caret and respects maxLength', () => {
  const inserted = editNoteValue('Hello ', 6, 6, 'Keshav!', 20);
  assert.equal(inserted.value, 'Hello Keshav!');
  assert.equal(inserted.caret, 13);

  const capped = editNoteValue('Hello', 5, 5, 'World', 7);
  assert.equal(capped.value, 'HelloWo');
  assert.equal(capped.caret, 7);
});

test('editNoteValue handles Backspace on collapsed caret and selection ranges', () => {
  const single = editNoteValue('Hello!', 6, 6, 'Backspace', 400);
  assert.equal(single.value, 'Hello');
  assert.equal(single.caret, 5);

  const range = editNoteValue('Hello world', 5, 11, 'Backspace', 400);
  assert.equal(range.value, 'Hello');
  assert.equal(range.caret, 5);

  const empty = editNoteValue('', 0, 0, 'Backspace', 400);
  assert.equal(empty.value, '');
  assert.equal(empty.caret, 0);
});

test('calculatePaperFeed advances in 24px increments past base height', () => {
  assert.equal(calculatePaperFeed(85), 0);
  assert.equal(calculatePaperFeed(60), 0);
  assert.equal(calculatePaperFeed(86), 24);
  assert.equal(calculatePaperFeed(109), 24);
  assert.equal(calculatePaperFeed(110), 48);
});

test('formatMachineCounter zero-pads up to 3 digits', () => {
  assert.equal(formatMachineCounter(0), '000');
  assert.equal(formatMachineCounter(9), '009');
  assert.equal(formatMachineCounter(42), '042');
  assert.equal(formatMachineCounter(400), '400');
});

test('computeTearedProgressPercent eases smoothly from 0 to 100', () => {
  assert.equal(computeTearedProgressPercent(0, 2450), 0);
  const mid = computeTearedProgressPercent(1225, 2450);
  assert.ok(mid > 50 && mid < 95);
  assert.equal(computeTearedProgressPercent(2450, 2450), 100);
  assert.equal(computeTearedProgressPercent(4000, 2450), 100);
});

test('computeActiveSectionId selects last section whose top passes 40% viewport height', () => {
  const sections = [
    { id: 'home', top: -1800 },
    { id: 'about', top: -600 },
    { id: 'skills', top: 300 },
    { id: 'work', top: 1200 },
    { id: 'contact', top: 2400 },
  ];
  assert.equal(computeActiveSectionId(sections, 900), 'skills');
  assert.equal(computeActiveSectionId(sections, 500), 'about');
});

test('validateContactNote validates required fields and email format', () => {
  assert.equal(validateContactNote({ name: '', email: 'a@b.com', message: 'hi' }).valid, false);
  assert.equal(validateContactNote({ name: 'Ada', email: 'not-an-email', message: 'hi' }).valid, false);
  assert.equal(validateContactNote({ name: 'Ada', email: 'ada@lovelace.dev', message: '   ' }).valid, false);
  const ok = validateContactNote({
    name: '  Ada Lovelace  ',
    email: ' ada@lovelace.dev ',
    message: '  Let us build something! ',
  });
  assert.equal(ok.valid, true);
  assert.deepEqual(ok.cleaned, {
    name: 'Ada Lovelace',
    email: 'ada@lovelace.dev',
    message: 'Let us build something!',
  });
});
