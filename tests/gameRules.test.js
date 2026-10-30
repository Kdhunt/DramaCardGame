import test from 'node:test';
import assert from 'node:assert/strict';

import {
  EVENTS,
  LOCATIONS,
  CHARACTERS,
  SECRETS,
  ASPIRATIONS,
  ACTIONS,
  COUNTER_CARDS,
  ACTION_CARDS,
  checkMismatch,
  getChainBonus,
  getLocationTypeBonus,
  getSubAction,
  getChainTemplate,
  getStateFromEvent,
  shuffleDeck,
} from '../src/lib/gameData.js';

test('shuffleDeck returns a new array with the same members', () => {
  const sample = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const result = shuffleDeck(sample);

  assert.notStrictEqual(result, sample);
  assert.deepEqual(sample, [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
  assert.equal(result.length, sample.length);
  assert.deepEqual(
    [...result].sort((a, b) => a.id - b.id),
    [...sample].sort((a, b) => a.id - b.id),
  );
});

test('mismatch rule: wild-card locations never mismatch, tag overlap avoids mismatch', () => {
  const doctor = { tags: ['Medical'] };

  assert.equal(checkMismatch(doctor, { tags: ['Wild Card'] }), false);
  assert.equal(checkMismatch(doctor, { tags: ['Medical', 'Family'] }), false);
  assert.equal(checkMismatch(doctor, { tags: ['High Society'] }), true);
});

test('chain bonus escalates and caps according to rules', () => {
  assert.equal(getChainBonus(1), 0);
  assert.equal(getChainBonus(2), 1);
  assert.equal(getChainBonus(3), 2);
  assert.equal(getChainBonus(4), 3);
  assert.equal(getChainBonus(10), 3);
});

test('location type bonus returns +1 only when event/location tags overlap', () => {
  const event = { locationTypeBonuses: ['Romantic', 'Family'] };

  assert.equal(getLocationTypeBonus(event, { tags: ['Law'] }), 0);
  assert.equal(getLocationTypeBonus(event, { tags: ['Family'] }), 1);
  assert.equal(getLocationTypeBonus(null, { tags: ['Family'] }), 0);
});

test('sub-actions are selected by location tag or exact location name', () => {
  const event = {
    subActions: [
      { locationTag: 'Business', desc: 'tag match' },
      { locationTag: 'Courtroom', desc: 'name match' },
    ],
  };

  assert.equal(getSubAction(event, { name: 'X', tags: ['Business'] })?.desc, 'tag match');
  assert.equal(getSubAction(event, { name: 'Courtroom', tags: ['Law'] })?.desc, 'name match');
  assert.equal(getSubAction(event, { name: 'Park', tags: ['Wild Card'] }), null);
});

test('event state mapping follows card category/penalty rules', () => {
  assert.equal(getStateFromEvent({ secretReveal: 'high' }), 'Exposed');
  assert.equal(getStateFromEvent({ type: 'Romance', dpTarget: -1 }), 'Heartbroken');
  assert.equal(getStateFromEvent({ type: 'Gossip', dpTarget: -1 }), 'Humiliated');
  assert.equal(getStateFromEvent({ type: 'Power', dpTarget: -1 }), 'Blackmailed');
  assert.equal(getStateFromEvent({ type: 'Mystery', dpTarget: -1 }), 'Suspected');
  assert.equal(getStateFromEvent({ type: 'Confrontation', dpTarget: -1 }), 'Disgraced');
  assert.equal(getStateFromEvent({ type: 'Comedy', dpTarget: -1 }), null);
});

test('known chain templates are available and unknown names return null', () => {
  assert.equal(getChainTemplate('Love Triangle')?.title, 'Love Triangle');
  assert.equal(getChainTemplate('Hostile Takeover')?.climaxType, 'vote');
  assert.equal(getChainTemplate('Unknown Card'), null);
});

test('core content sets are populated and complete for setup rules', () => {
  assert.ok(CHARACTERS.length >= 30);
  assert.equal(LOCATIONS.length, 25);
  assert.equal(SECRETS.length, 20);
  assert.equal(ASPIRATIONS.length, 15);
});

test('event deck has unique generated ids and includes all drama levels', () => {
  const ids = EVENTS.map((e) => e.id);
  const uniqueIds = new Set(ids);
  const levels = new Set(EVENTS.map((e) => e.level));

  assert.equal(uniqueIds.size, EVENTS.length);
  assert.ok(levels.has('low'));
  assert.ok(levels.has('medium'));
  assert.ok(levels.has('high'));
  assert.ok(levels.has('action'));
});

test('high drama cards all declare a playable DP cost', () => {
  const highCards = EVENTS.filter((e) => e.level === 'high');
  assert.ok(highCards.length > 0);
  for (const card of highCards) {
    assert.equal(typeof card.cost, 'number');
    assert.ok(card.cost >= 0);
  }
});

test('secret reveal event ladder exists at low, medium, and high tiers', () => {
  const secretRevealCards = EVENTS.filter((e) => e.secretReveal);
  const tiers = new Set(secretRevealCards.map((e) => e.secretReveal));

  assert.ok(secretRevealCards.length > 0);
  assert.deepEqual(new Set(['low', 'medium', 'high']), tiers);
});

test('action system includes both reactive counters and proactive actions', () => {
  assert.equal(ACTIONS.length, COUNTER_CARDS.length + ACTION_CARDS.length);
  assert.ok(COUNTER_CARDS.every((c) => c.timing === 'reactive' || c.timing === 'both'));
  assert.ok(ACTION_CARDS.every((a) => a.timing === 'proactive'));

  const counterNames = new Set(COUNTER_CARDS.map((c) => c.name));
  assert.ok(counterNames.has("Oh No You Don't"));
  assert.ok(counterNames.has('Wrong Address'));
});
