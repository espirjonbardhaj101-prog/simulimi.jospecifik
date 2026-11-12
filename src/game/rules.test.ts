/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Unit tests for game rules and biology logic using node:test
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialGameState,
  routeFromFace,
  calculateMultiplicationInterval,
  tickGameState,
  triggerImmuneResponse,
  PATHOGEN_CATALOG,
  IMMUNE_RESPONSES,
} from './rules';

test('Initial game state starts in face environment on title phase', () => {
  const state = createInitialGameState();
  assert.equal(state.environment, 'face');
  assert.equal(state.phase, 'title');
  assert.equal(state.initialDefenseTimer, 20);
  assert.equal(state.temperatureCelsius, 37.0);
  assert.equal(state.bloodstreamTimer, 30);
});

test('Exact 7 immune responses exist in IMMUNE_RESPONSES catalog', () => {
  const keys = Object.keys(IMMUNE_RESPONSES);
  assert.equal(keys.length, 7);
  assert.ok(IMMUNE_RESPONSES['mucus']);
  assert.ok(IMMUNE_RESPONSES['cilia']);
  assert.ok(IMMUNE_RESPONSES['sneeze']);
  assert.ok(IMMUNE_RESPONSES['cough']);
  assert.ok(IMMUNE_RESPONSES['stomach_acid']);
  assert.ok(IMMUNE_RESPONSES['fever']);
  assert.ok(IMMUNE_RESPONSES['phagocytosis']);
});

test('Pathogen catalog contains all 4 required pathogens including Paraziti', () => {
  const types = ['virus', 'bacterium', 'fungus', 'parasite'] as const;
  for (const t of types) {
    assert.ok(PATHOGEN_CATALOG[t]);
    assert.ok(PATHOGEN_CATALOG[t].nameSq.length > 0);
    assert.ok(PATHOGEN_CATALOG[t].scientificSq.length > 0);
  }
  assert.equal(PATHOGEN_CATALOG.parasite.nameSq, 'Paraziti');
});

test('Nose entry transitions to Trachea and mouth entry to Digestive', () => {
  const state = createInitialGameState();
  const noseState = routeFromFace(state, 'nose');
  assert.equal(noseState.environment, 'trachea');
  assert.equal(noseState.entryRoute, 'nose');

  const mouthState = routeFromFace(state, 'mouth');
  assert.equal(mouthState.environment, 'digestive');
  assert.equal(mouthState.entryRoute, 'mouth');
  assert.equal(mouthState.stomachAcidActive, false);
});

test('If pathogen survives initial defense for 20 seconds, transitions to bloodstream', () => {
  let state = createInitialGameState();
  state = routeFromFace(state, 'nose');
  state.phase = 'playing';
  state.pathogenCount = 2;

  const res19 = tickGameState(state, 19);
  assert.equal(res19.state.environment, 'trachea');

  const res21 = tickGameState(res19.state, 2);
  assert.equal(res21.state.environment, 'bloodstream');
  assert.equal(res21.environmentChanged, true);
});

test('Stomach acid requires 3 attacks to eliminate a bacterium', () => {
  let state = createInitialGameState();
  state = routeFromFace(state, 'mouth');
  state.phase = 'playing';
  state.selectedPathogenType = 'bacterium';
  state.pathogenCount = 1;

  // Attack 1: Stomach acid floods, timer set to 4.5s
  const a1 = triggerImmuneResponse(state, 'stomach_acid');
  assert.equal(a1.success, true);
  assert.equal(a1.state.stomachAcidActive, true);
  assert.equal(a1.state.stomachAcidHits, 1);
  assert.equal(a1.state.pathogenCount, 1); // Not killed on hit 1

  // Tick past cooldown and flood duration
  let s = a1.state;
  s.cooldowns.stomach_acid = 0;

  // Attack 2
  const a2 = triggerImmuneResponse(s, 'stomach_acid');
  assert.equal(a2.success, true);
  assert.equal(a2.state.stomachAcidHits, 2);

  // Tick past cooldown
  s = a2.state;
  s.cooldowns.stomach_acid = 0;

  // Attack 3: kills bacterium!
  const a3 = triggerImmuneResponse(s, 'stomach_acid');
  assert.equal(a3.success, true);
  assert.equal(a3.state.pathogenCount, 0);
  assert.equal(a3.state.phase, 'gameover');
  assert.equal(a3.state.outcome, 'victory');
});

test('Rule 4: 3 consecutive immune attacks in any environment eliminates all pathogens and triggers victory', () => {
  let state = createInitialGameState();
  state = routeFromFace(state, 'nose');
  state.phase = 'playing';
  state.pathogenCount = 8;

  const r1 = triggerImmuneResponse(state, 'mucus');
  assert.equal(r1.success, true);
  assert.equal(r1.state.consecutiveAttacks, 1);

  const r2 = triggerImmuneResponse(r1.state, 'cilia');
  assert.equal(r2.success, true);
  assert.equal(r2.state.consecutiveAttacks, 2);

  const r3 = triggerImmuneResponse(r2.state, 'sneeze');
  assert.equal(r3.success, true);
  assert.equal(r3.state.consecutiveAttacks, 3);
  assert.equal(r3.state.pathogenCount, 0);
  assert.equal(r3.state.phase, 'gameover');
  assert.equal(r3.state.outcome, 'victory');
});

test('Smartboard mode can be toggled and defaults to false', () => {
  const initial = createInitialGameState();
  assert.equal(initial.smartboardMode, false);

  const enabled = createInitialGameState({ smartboardMode: true });
  assert.equal(enabled.smartboardMode, true);
});

