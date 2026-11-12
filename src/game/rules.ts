/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mbrojtja Imunitare - Pure Game Logic & Biological Rules
 * Exact 7 Immune Responses & Neo-Brutalist Biology System
 */

export type PathogenType = 'virus' | 'bacterium' | 'fungus' | 'parasite';

export type EnvironmentId = 'face' | 'bloodstream' | 'trachea' | 'digestive';

export type EntryRoute = 'nose' | 'mouth';

// EXACTLY 7 IMMUNE RESPONSES:
// 1. mucus (Trake)
// 2. cilia (Trake)
// 3. sneeze (Trake)
// 4. cough (Ezofag)
// 5. stomach_acid (Lukth)
// 6. fever (Gjak)
// 7. phagocytosis (Gjak)
export type ImmuneResponseId =
  | 'mucus'
  | 'cilia'
  | 'sneeze'
  | 'cough'
  | 'stomach_acid'
  | 'fever'
  | 'phagocytosis';

export interface PathogenInfo {
  id: PathogenType;
  nameSq: string;
  scientificSq: string;
  descriptionSq: string;
  sizeUm: string;
  color: string;
  baseSpeed: number;
}

export const PATHOGEN_CATALOG: Record<PathogenType, PathogenInfo> = {
  virus: {
    id: 'virus',
    nameSq: 'Virusi',
    scientificSq: 'Adenovirus / Virusi i Gripit',
    descriptionSq: 'Grimcë mikroskopike jo-qelizore me kapsidë proteinike dhe material gjenetik (ARN/ADN).',
    sizeUm: '0.02 - 0.3 µm',
    color: '#ef4444',
    baseSpeed: 1.8,
  },
  bacterium: {
    id: 'bacterium',
    nameSq: 'Bakteri',
    scientificSq: 'Bacil shkopthor me flagjelë',
    descriptionSq: 'Mikroorganizëm njëqelizor prokariot me mur qelizor peptidoglikani. Shumëzohet me ndarje.',
    sizeUm: '0.5 - 5.0 µm',
    color: '#10b981',
    baseSpeed: 1.3,
  },
  fungus: {
    id: 'fungus',
    nameSq: 'Kërpudha',
    scientificSq: 'Spore kërpudhore / Maja (Candida)',
    descriptionSq: 'Mikroorganizëm eukariot me mur qelizor kitine. Shfaqet si spore ose qeliza me sythim.',
    sizeUm: '3.0 - 10.0 µm',
    color: '#f59e0b',
    baseSpeed: 0.9,
  },
  parasite: {
    id: 'parasite',
    nameSq: 'Paraziti',
    scientificSq: 'Amebë / Parazit njëqelizor',
    descriptionSq: 'Organizëm eukariot parazitar më i madh, i pajisur me pseudopode për lëvizje dhe invazion.',
    sizeUm: '10.0 - 50.0 µm',
    color: '#8b5cf6',
    baseSpeed: 1.0,
  },
};

export interface ResponseConfig {
  id: ImmuneResponseId;
  nameSq: string;
  categorySq: string;
  environment: EnvironmentId;
  cooldownSeconds: number;
  shortDescSq: string;
  educationalSq: string;
}

export const IMMUNE_RESPONSES: Record<ImmuneResponseId, ResponseConfig> = {
  mucus: {
    id: 'mucus',
    nameSq: 'Mukusi',
    categorySq: 'Barierë Fiziko-Kimike',
    environment: 'trachea',
    cooldownSeconds: 3,
    shortDescSq: 'Sekretohet nga qelizat kupë për të bllokuar patogjenët.',
    educationalSq: 'Mukusi kap grimcat dhe mikroorganizmat, duke penguar depërtimin e tyre më tej në rrugët e frymëmarrjes.',
  },
  cilia: {
    id: 'cilia',
    nameSq: 'Qerpikët Lëvizës',
    categorySq: 'Mekanizëm Mekanik',
    environment: 'trachea',
    cooldownSeconds: 3,
    shortDescSq: 'Rrahje e sinkronizuar që bart mukusin me patogjenë drejt fytit.',
    educationalSq: 'Qerpikët lëvizës ndihmojnë në transportimin e mukusit dhe patogjenëve drejt fytit, ku ata mund të largohen nga rrugët e frymëmarrjes.',
  },
  sneeze: {
    id: 'sneeze',
    nameSq: 'Teshtima',
    categorySq: 'Refleks Mbrojtës',
    environment: 'trachea',
    cooldownSeconds: 4,
    shortDescSq: 'Shpërthim i befasishëm ajri që nxjerr patogjenët jashtë hundës.',
    educationalSq: 'Teshtima është një refleks mbrojtës që ndihmon në nxjerrjen e grimcave dhe mikroorganizmave nga hunda.',
  },
  cough: {
    id: 'cough',
    nameSq: 'Kollitja',
    categorySq: 'Refleks Mbrojtës i Fytit',
    environment: 'digestive',
    cooldownSeconds: 4,
    shortDescSq: 'Refleks i fuqishëm ajror që nxjerr substancat e huaja para gëlltitjes.',
    educationalSq: 'Kollitja është një refleks mbrojtës që ndihmon në largimin e grimcave dhe substancave të huaja nga rrugët e frymëmarrjes.',
  },
  stomach_acid: {
    id: 'stomach_acid',
    nameSq: 'Acidi i Stomakut',
    categorySq: 'Përmbytje Kimike e Lukthit',
    environment: 'digestive',
    cooldownSeconds: 4,
    shortDescSq: 'Lëngu gastrik acid (pH 1.5-2) shfaqet si përmbytje dhe shpërbën bakteret pas 3 sulmesh.',
    educationalSq: 'Acidi klorhidrik i stomakut krijon një përmbytje shumë acide (pH 1.5-2). Nevojiten 3 sulme të stomakut për të shkatërruar bakterin.',
  },
  fever: {
    id: 'fever',
    nameSq: 'Ethe',
    categorySq: 'Përgjigje Fiziologjike',
    environment: 'bloodstream',
    cooldownSeconds: 6,
    shortDescSq: 'Rritja e temperaturës (39.5°C) ngadalëson shumëzimin e mikrobeve.',
    educationalSq: 'Ethet janë një përgjigje sistemike që ngadalëson shumëzimin e patogjenëve dhe rrit efikasitetin e mekanizmave mbrojtës qelizorë.',
  },
  phagocytosis: {
    id: 'phagocytosis',
    nameSq: 'Fagocitoza',
    categorySq: 'Mbrojtje Qelizore',
    environment: 'bloodstream',
    cooldownSeconds: 2,
    shortDescSq: 'Rruazat e bardha (makrofagët) gëlltisin dhe tresin patogjenët.',
    educationalSq: 'Fagocitoza nga rruazat e bardha të gjakut (makrofagët dhe neutrofilet) është mekanizmi kryesor qelizor i shkatërrimit të trupave të huaj.',
  },
};

export interface GameState {
  environment: EnvironmentId;
  previousEnvironment: EnvironmentId | null;
  phase: 'title' | 'playing' | 'paused' | 'gameover';
  outcome: 'none' | 'victory' | 'defeat';
  selectedPathogenType: PathogenType;
  pathogenCount: number;
  initialDefenseTimer: number; // 20s countdown in trachea/digestive
  bloodstreamTimer: number; // Configurable, default 30s
  bloodstreamSurvivalLimit: number; // 30s
  multiplicationAccumulator: number;
  feverActive: boolean;
  feverTimer: number;
  temperatureCelsius: number;
  mucusActive: boolean;
  mucusTimer: number;
  ciliaActive: boolean;
  ciliaTimer: number;
  stomachAcidActive: boolean;
  stomachAcidTimer: number; // Duration of acid flood (3 to 6s, e.g. 4.5s)
  stomachAcidHits: number; // 3 hits required to kill a bacterium
  cooldowns: Record<ImmuneResponseId, number>;
  educationalMessageSq: string;
  entryRoute: EntryRoute | null;
  score: number;
  eliminatedCount: number;
  consecutiveAttacks: number;
  smartboardMode: boolean; // Smartboard Mode for classroom interactive displays
}

export function createInitialGameState(config?: {
  bloodstreamSurvivalLimit?: number;
  smartboardMode?: boolean;
}): GameState {
  return {
    environment: 'face',
    previousEnvironment: null,
    phase: 'title',
    outcome: 'none',
    selectedPathogenType: 'bacterium',
    pathogenCount: 1,
    initialDefenseTimer: 20,
    bloodstreamTimer: config?.bloodstreamSurvivalLimit ?? 30,
    bloodstreamSurvivalLimit: config?.bloodstreamSurvivalLimit ?? 30,
    multiplicationAccumulator: 0,
    feverActive: false,
    feverTimer: 0,
    temperatureCelsius: 37.0,
    mucusActive: false,
    mucusTimer: 0,
    ciliaActive: false,
    ciliaTimer: 0,
    stomachAcidActive: false,
    stomachAcidTimer: 0,
    stomachAcidHits: 0,
    cooldowns: {
      mucus: 0,
      cilia: 0,
      sneeze: 0,
      cough: 0,
      stomach_acid: 0,
      fever: 0,
      phagocytosis: 0,
    },
    educationalMessageSq:
      'Mirë se vini në "Mbrojtja Imunitare". Zgjidhni një patogjen dhe rrugën e hyrjes: Hunda (Rrugët e Frymëmarrjes) ose Goja (Sistemi Tretës).',
    entryRoute: null,
    score: 0,
    eliminatedCount: 0,
    consecutiveAttacks: 0,
    smartboardMode: config?.smartboardMode ?? false,
  };
}

export function toggleSmartboardMode(state: GameState): GameState {
  return {
    ...state,
    smartboardMode: !state.smartboardMode,
  };
}

export function routeFromFace(
  state: GameState,
  route: EntryRoute
): GameState {
  if (state.environment !== 'face') return state;
  const targetEnv: EnvironmentId = route === 'nose' ? 'trachea' : 'digestive';
  const initialMessage =
    route === 'nose'
      ? 'Patogjeni ka hyrë përmes hundës në trake! Aktivizoni mukusin, qerpikët lëvizës ose teshtimën para se të kalojnë 20 sekonda.'
      : 'Patogjeni ndodhet në ezofag! Klikoni "Acidi i Stomakut" për të shkaktuar përmbytje acidi në stomak (duhen 3 sulme për të vrarë bakterin).';

  return {
    ...state,
    environment: targetEnv,
    previousEnvironment: 'face',
    entryRoute: route,
    initialDefenseTimer: 20,
    stomachAcidActive: false,
    stomachAcidTimer: 0,
    stomachAcidHits: 0,
    consecutiveAttacks: 0,
    educationalMessageSq: initialMessage,
  };
}

export function calculateMultiplicationInterval(feverActive: boolean): number {
  return feverActive ? 6.0 : 2.0;
}

export function tickGameState(
  state: GameState,
  dt: number
): {
  state: GameState;
  spawnNewPathogen: boolean;
  environmentChanged: boolean;
} {
  if (state.phase !== 'playing') {
    return { state, spawnNewPathogen: false, environmentChanged: false };
  }

  let next = { ...state };
  let spawnNewPathogen = false;
  let environmentChanged = false;

  // Decrease cooldowns
  const nextCooldowns = { ...next.cooldowns };
  (Object.keys(nextCooldowns) as ImmuneResponseId[]).forEach((key) => {
    if (nextCooldowns[key] > 0) {
      nextCooldowns[key] = Math.max(0, nextCooldowns[key] - dt);
    }
  });
  next.cooldowns = nextCooldowns;

  // Timers for active temporary responses
  if (next.feverActive) {
    next.feverTimer = Math.max(0, next.feverTimer - dt);
    if (next.feverTimer <= 0) {
      next.feverActive = false;
      next.temperatureCelsius = 37.0;
    } else {
      next.temperatureCelsius = 39.5;
    }
  }

  if (next.mucusActive) {
    next.mucusTimer = Math.max(0, next.mucusTimer - dt);
    if (next.mucusTimer <= 0) {
      next.mucusActive = false;
    }
  }

  if (next.ciliaActive) {
    next.ciliaTimer = Math.max(0, next.ciliaTimer - dt);
    if (next.ciliaTimer <= 0) {
      next.ciliaActive = false;
    }
  }

  // Stomach acid flood timer: recedes after 3-6s (4.5s)
  if (next.stomachAcidActive) {
    next.stomachAcidTimer = Math.max(0, next.stomachAcidTimer - dt);
    if (next.stomachAcidTimer <= 0) {
      next.stomachAcidActive = false;
    }
  }

  // Environment-specific progression:
  if (next.environment === 'trachea' || next.environment === 'digestive') {
    next.initialDefenseTimer = Math.max(0, next.initialDefenseTimer - dt);

    // If 20 seconds elapse and pathogens are still alive, infection breaches into the bloodstream
    if (next.initialDefenseTimer <= 0 && next.pathogenCount > 0) {
      next.previousEnvironment = next.environment;
      next.environment = 'bloodstream';
      next.pathogenCount = Math.max(2, next.pathogenCount);
      next.educationalMessageSq =
        'Kujdes! Patogjenët mbijetuan barrierat e para për 20 sekonda dhe depërtuan në qarkullimin e gjakut! Përdorni ethet dhe fagocitozën!';
      environmentChanged = true;
    }
  } else if (next.environment === 'bloodstream') {
    // Bloodstream countdown
    next.bloodstreamTimer = Math.max(0, next.bloodstreamTimer - dt);

    // Multiplication: add one pathogen every 2s (or 6s if fever is active)
    const interval = calculateMultiplicationInterval(next.feverActive);
    next.multiplicationAccumulator += dt;
    if (next.multiplicationAccumulator >= interval && next.pathogenCount > 0) {
      next.multiplicationAccumulator = 0;
      next.pathogenCount += 1;
      spawnNewPathogen = true;
    }

    // Check defeat conditions:
    if (next.bloodstreamTimer <= 0 || next.pathogenCount >= 15) {
      next.phase = 'gameover';
      next.outcome = 'defeat';
      next.educationalMessageSq =
        'Infeksioni u përhap në të gjithë organizmin! Sistemi imunitar u mbingarkua nga shumëzimi i pakontrolluar i mikrobeve.';
      return { state: next, spawnNewPathogen, environmentChanged };
    }
  }

  // Victory check: if all pathogens eliminated in active environment
  if (
    (next.environment === 'trachea' ||
      next.environment === 'digestive' ||
      next.environment === 'bloodstream') &&
    next.pathogenCount === 0 &&
    next.eliminatedCount > 0
  ) {
    next.phase = 'gameover';
    next.outcome = 'victory';
    next.educationalMessageSq =
      'Fitore e mbrojtjes imunitare! Të gjithë patogjenët u eliminuan me sukses nga barrierat dhe mekanizmat e lindur.';
  }

  return { state: next, spawnNewPathogen, environmentChanged };
}

export function triggerImmuneResponse(
  state: GameState,
  responseId: ImmuneResponseId
): { state: GameState; success: boolean; killedCount: number } {
  if (state.phase !== 'playing') {
    return { state, success: false, killedCount: 0 };
  }

  const config = IMMUNE_RESPONSES[responseId];
  if (!config || config.environment !== state.environment) {
    return { state, success: false, killedCount: 0 };
  }

  if (state.cooldowns[responseId] > 0) {
    return { state, success: false, killedCount: 0 };
  }

  let next = { ...state };
  next.cooldowns = {
    ...next.cooldowns,
    [responseId]: config.cooldownSeconds,
  };
  next.educationalMessageSq = config.educationalSq;
  next.consecutiveAttacks = (next.consecutiveAttacks || 0) + 1;

  let killed = 0;

  switch (responseId) {
    case 'mucus':
      next.mucusActive = true;
      next.mucusTimer = 5.0; // mucus stays sticky for 5s
      break;

    case 'cilia':
      next.ciliaActive = true;
      next.ciliaTimer = 4.0;
      // If mucus was already trapping them, cilia sweeps out pathogens
      if (next.mucusActive && next.pathogenCount > 0) {
        killed = Math.min(next.pathogenCount, 2);
        next.pathogenCount -= killed;
        next.eliminatedCount += killed;
        next.score += killed * 100;
      }
      break;

    case 'sneeze':
      // Sneezing forcefully expels up to 3 pathogens from the respiratory tract
      killed = Math.min(next.pathogenCount, 3);
      next.pathogenCount -= killed;
      next.eliminatedCount += killed;
      next.score += killed * 150;
      break;

    case 'cough':
      // Coughing expels pathogens from the pharynx/throat
      killed = Math.min(next.pathogenCount, 2);
      next.pathogenCount -= killed;
      next.eliminatedCount += killed;
      next.score += killed * 150;
      break;

    case 'stomach_acid': {
      // Trigger acid flood (lasts 4.5 seconds between 3-6s)
      next.stomachAcidActive = true;
      next.stomachAcidTimer = 4.5;
      next.stomachAcidHits = (next.stomachAcidHits || 0) + 1;

      // REQUIREMENT 2: 3 stomach attacks to kill a bacterium
      if (next.selectedPathogenType === 'bacterium') {
        if (next.stomachAcidHits >= 3 && next.pathogenCount > 0) {
          killed = 1;
          next.pathogenCount -= killed;
          next.eliminatedCount += killed;
          next.score += 200;
          next.stomachAcidHits = 0;
          next.educationalMessageSq =
            'Sulmi i 3-të i acidit të stomakut arriti të shkatërrojë plotësisht murin qelizor të bakterit!';
        } else {
          next.educationalMessageSq = `Përmbytje e acidit të stomakut! (Sulmi ${next.stomachAcidHits}/3 mbi bakterin - duhen 3 sulme stomaku për ta vrarë). Lëngu largohet pas disa sekondash.`;
        }
      } else {
        // Other pathogens (virus, fungus, parasite) take 1 or 2 hits
        if (next.stomachAcidHits >= 2 && next.pathogenCount > 0) {
          killed = 1;
          next.pathogenCount -= killed;
          next.eliminatedCount += killed;
          next.score += 150;
          next.stomachAcidHits = 0;
        }
      }
      break;
    }

    case 'fever':
      next.feverActive = true;
      next.feverTimer = 8.0;
      next.temperatureCelsius = 39.5;
      next.score += 50;
      break;

    case 'phagocytosis':
      // Macrophages engulf 1 pathogen per activation
      if (next.pathogenCount > 0) {
        killed = 1;
        next.pathogenCount -= killed;
        next.eliminatedCount += killed;
        next.score += 120;
      }
      break;
  }

  // RULE 4: If attacked 3 times in a row by an immune response, all pathogens are eliminated and player wins!
  if (next.consecutiveAttacks >= 3) {
    const remaining = next.pathogenCount;
    killed += remaining;
    next.eliminatedCount += remaining;
    next.pathogenCount = 0;
    next.phase = 'gameover';
    next.outcome = 'victory';
    next.educationalMessageSq =
      'Fitore e plotë mbrojtëse! Pas 3 sulmesh të njëpasnjëshme të suksesshme nga përgjigjet imunitare, të gjithë patogjenët u asgjësuan!';
  } else if (next.pathogenCount === 0 && next.eliminatedCount > 0) {
    // Standard victory if all eliminated
    next.phase = 'gameover';
    next.outcome = 'victory';
    next.educationalMessageSq =
      'Fitore e mbrojtjes imunitare! Të gjithë patogjenët u asgjësuan me sukses.';
  }

  return { state: next, success: true, killedCount: killed };
}
