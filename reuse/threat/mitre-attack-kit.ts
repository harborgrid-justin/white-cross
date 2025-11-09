/**
 * LOC: MATR1234567
 * File: /reuse/threat/mitre-attack-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence controllers and services
 *   - MITRE ATT&CK integration services
 *   - Attack pattern analysis engines
 */

/**
 * File: /reuse/threat/mitre-attack-kit.ts
 * Locator: WC-UTL-MATR-001
 * Purpose: Comprehensive MITRE ATT&CK Framework Utilities - Tactics, techniques, TTPs, kill chain analysis
 *
 * Upstream: Independent utility module for MITRE ATT&CK framework integration
 * Downstream: ../backend/*, Threat analysis services, detection engines, ATT&CK Navigator integration
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI
 * Exports: 44 utility functions for MITRE ATT&CK mapping, TTP extraction, technique detection, coverage analysis
 *
 * LLM Context: Comprehensive MITRE ATT&CK utilities for implementing production-ready threat analysis and
 * detection capabilities in White Cross system. Provides tactic/technique mapping, TTPs extraction, attack
 * pattern matching, kill chain analysis, ATT&CK Navigator integration, and technique coverage tracking.
 * Essential for building advanced threat detection and response capabilities aligned with industry standards.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ATTACKTactic {
  id: string;
  name: string;
  description: string;
  shortName: string;
  externalId: string; // e.g., TA0001
  url: string;
  platforms: string[];
}

interface ATTACKTechnique {
  id: string;
  techniqueId: string; // e.g., T1059
  name: string;
  description: string;
  tactics: string[]; // Tactic IDs
  platforms: string[];
  dataSourcesRequired: string[];
  detectionDifficulty: 'low' | 'medium' | 'high';
  permissions: string[];
  subtechniques: string[];
  mitigations: string[];
  url: string;
}

interface ATTACKSubtechnique {
  id: string;
  subtechniqueId: string; // e.g., T1059.001
  parentTechnique: string;
  name: string;
  description: string;
  platforms: string[];
  detectionMethods: string[];
}

interface TTPExtraction {
  tactics: string[];
  techniques: string[];
  procedures: string[];
  confidence: number;
  sources: string[];
  timestamp: Date;
}

interface AttackPattern {
  patternId: string;
  name: string;
  description: string;
  techniques: string[];
  indicators: AttackIndicator[];
  killChainPhases: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AttackIndicator {
  type: 'process' | 'file' | 'network' | 'registry' | 'behavior';
  value: string;
  weight: number;
  context: string;
}

interface KillChainPhase {
  phase: string;
  order: number;
  techniques: string[];
  observed: boolean;
  timestamp?: Date;
}

interface DetectionRule {
  id: string;
  name: string;
  techniqueId: string;
  platform: string;
  dataSource: string;
  query: string;
  falsePositiveRate: number;
  severity: string;
  enabled: boolean;
}

interface TechniqueCoverage {
  techniqueId: string;
  techniqueName: string;
  covered: boolean;
  detectionRules: number;
  lastTested?: Date;
  effectiveness: number;
  gaps: string[];
}

interface NavigatorLayer {
  name: string;
  version: string;
  domain: 'enterprise-attack' | 'mobile-attack' | 'ics-attack';
  description: string;
  techniques: NavigatorTechnique[];
  gradient: NavigatorGradient;
  legendItems: NavigatorLegendItem[];
}

interface NavigatorTechnique {
  techniqueID: string;
  score: number;
  color?: string;
  comment?: string;
  enabled: boolean;
  metadata?: Record<string, unknown>;
}

interface NavigatorGradient {
  colors: string[];
  minValue: number;
  maxValue: number;
}

interface NavigatorLegendItem {
  label: string;
  color: string;
}

interface ThreatActorProfile {
  name: string;
  aliases: string[];
  description: string;
  sophistication: 'low' | 'medium' | 'high' | 'advanced';
  tactics: string[];
  techniques: string[];
  targetedSectors: string[];
  attribution: string;
}

// ============================================================================
// TACTIC UTILITIES
// ============================================================================

/**
 * Gets all MITRE ATT&CK tactics in kill chain order.
 *
 * @returns {ATTACKTactic[]} Array of tactics
 *
 * @example
 * ```typescript
 * const tactics = getAllTactics();
 * // Result: [{ id: 'TA0001', name: 'Initial Access', ... }, ...]
 * ```
 */
export const getAllTactics = (): ATTACKTactic[] => {
  return [
    {
      id: 'TA0043',
      name: 'Reconnaissance',
      description: 'Gather information for planning',
      shortName: 'reconnaissance',
      externalId: 'TA0043',
      url: 'https://attack.mitre.org/tactics/TA0043',
      platforms: ['PRE'],
    },
    {
      id: 'TA0042',
      name: 'Resource Development',
      description: 'Establish resources for operations',
      shortName: 'resource-development',
      externalId: 'TA0042',
      url: 'https://attack.mitre.org/tactics/TA0042',
      platforms: ['PRE'],
    },
    {
      id: 'TA0001',
      name: 'Initial Access',
      description: 'Get into your network',
      shortName: 'initial-access',
      externalId: 'TA0001',
      url: 'https://attack.mitre.org/tactics/TA0001',
      platforms: ['Windows', 'Linux', 'macOS'],
    },
    {
      id: 'TA0002',
      name: 'Execution',
      description: 'Run malicious code',
      shortName: 'execution',
      externalId: 'TA0002',
      url: 'https://attack.mitre.org/tactics/TA0002',
      platforms: ['Windows', 'Linux', 'macOS'],
    },
    {
      id: 'TA0003',
      name: 'Persistence',
      description: 'Maintain foothold',
      shortName: 'persistence',
      externalId: 'TA0003',
      url: 'https://attack.mitre.org/tactics/TA0003',
      platforms: ['Windows', 'Linux', 'macOS'],
    },
    {
      id: 'TA0004',
      name: 'Privilege Escalation',
      description: 'Gain higher-level permissions',
      shortName: 'privilege-escalation',
      externalId: 'TA0004',
      url: 'https://attack.mitre.org/tactics/TA0004',
      platforms: ['Windows', 'Linux', 'macOS'],
    },
    {
      id: 'TA0005',
      name: 'Defense Evasion',
      description: 'Avoid being detected',
      shortName: 'defense-evasion',
      externalId: 'TA0005',
      url: 'https://attack.mitre.org/tactics/TA0005',
      platforms: ['Windows', 'Linux', 'macOS'],
    },
    {
      id: 'TA0006',
      name: 'Credential Access',
      description: 'Steal account names and passwords',
      shortName: 'credential-access',
      externalId: 'TA0006',
      url: 'https://attack.mitre.org/tactics/TA0006',
      platforms: ['Windows', 'Linux', 'macOS'],
    },
    {
      id: 'TA0007',
      name: 'Discovery',
      description: 'Figure out your environment',
      shortName: 'discovery',
      externalId: 'TA0007',
      url: 'https://attack.mitre.org/tactics/TA0007',
      platforms: ['Windows', 'Linux', 'macOS'],
    },
    {
      id: 'TA0008',
      name: 'Lateral Movement',
      description: 'Move through your environment',
      shortName: 'lateral-movement',
      externalId: 'TA0008',
      url: 'https://attack.mitre.org/tactics/TA0008',
      platforms: ['Windows', 'Linux', 'macOS'],
    },
    {
      id: 'TA0009',
      name: 'Collection',
      description: 'Gather data of interest',
      shortName: 'collection',
      externalId: 'TA0009',
      url: 'https://attack.mitre.org/tactics/TA0009',
      platforms: ['Windows', 'Linux', 'macOS'],
    },
    {
      id: 'TA0011',
      name: 'Command and Control',
      description: 'Communicate with compromised systems',
      shortName: 'command-and-control',
      externalId: 'TA0011',
      url: 'https://attack.mitre.org/tactics/TA0011',
      platforms: ['Windows', 'Linux', 'macOS'],
    },
    {
      id: 'TA0010',
      name: 'Exfiltration',
      description: 'Steal data',
      shortName: 'exfiltration',
      externalId: 'TA0010',
      url: 'https://attack.mitre.org/tactics/TA0010',
      platforms: ['Windows', 'Linux', 'macOS'],
    },
    {
      id: 'TA0040',
      name: 'Impact',
      description: 'Manipulate, interrupt, or destroy systems and data',
      shortName: 'impact',
      externalId: 'TA0040',
      url: 'https://attack.mitre.org/tactics/TA0040',
      platforms: ['Windows', 'Linux', 'macOS'],
    },
  ];
};

/**
 * Gets tactic by ID or external ID.
 *
 * @param {string} tacticId - Tactic ID (e.g., 'TA0001')
 * @returns {ATTACKTactic | null} Tactic or null if not found
 *
 * @example
 * ```typescript
 * const tactic = getTacticById('TA0001');
 * // Result: { id: 'TA0001', name: 'Initial Access', ... }
 * ```
 */
export const getTacticById = (tacticId: string): ATTACKTactic | null => {
  const tactics = getAllTactics();
  return tactics.find(t => t.id === tacticId || t.externalId === tacticId) || null;
};

/**
 * Gets tactics by platform.
 *
 * @param {string} platform - Platform name (e.g., 'Windows', 'Linux')
 * @returns {ATTACKTactic[]} Array of tactics for platform
 *
 * @example
 * ```typescript
 * const windowsTactics = getTacticsByPlatform('Windows');
 * ```
 */
export const getTacticsByPlatform = (platform: string): ATTACKTactic[] => {
  const tactics = getAllTactics();
  return tactics.filter(t => t.platforms.includes(platform));
};

/**
 * Maps tactic name to tactic ID.
 *
 * @param {string} tacticName - Tactic name
 * @returns {string | null} Tactic ID or null
 *
 * @example
 * ```typescript
 * const id = mapTacticNameToId('Initial Access');
 * // Result: 'TA0001'
 * ```
 */
export const mapTacticNameToId = (tacticName: string): string | null => {
  const tactics = getAllTactics();
  const tactic = tactics.find(
    t => t.name.toLowerCase() === tacticName.toLowerCase() ||
         t.shortName.toLowerCase() === tacticName.toLowerCase(),
  );
  return tactic ? tactic.id : null;
};

// ============================================================================
// TECHNIQUE UTILITIES
// ============================================================================

/**
 * Creates a technique object with metadata.
 *
 * @param {Partial<ATTACKTechnique>} techniqueData - Technique data
 * @returns {ATTACKTechnique} Complete technique object
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const technique = createTechnique({
 *   techniqueId: 'T1059',
 *   name: 'Command and Scripting Interpreter',
 *   tactics: ['TA0002'],
 *   platforms: ['Windows', 'Linux']
 * });
 * ```
 */
export const createTechnique = (techniqueData: Partial<ATTACKTechnique>): ATTACKTechnique => {
  if (!techniqueData.techniqueId || !techniqueData.name || !techniqueData.tactics) {
    throw new Error('techniqueId, name, and tactics are required');
  }

  return {
    id: techniqueData.id || `tech-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    techniqueId: techniqueData.techniqueId,
    name: techniqueData.name,
    description: techniqueData.description || '',
    tactics: techniqueData.tactics,
    platforms: techniqueData.platforms || [],
    dataSourcesRequired: techniqueData.dataSourcesRequired || [],
    detectionDifficulty: techniqueData.detectionDifficulty || 'medium',
    permissions: techniqueData.permissions || [],
    subtechniques: techniqueData.subtechniques || [],
    mitigations: techniqueData.mitigations || [],
    url: techniqueData.url || `https://attack.mitre.org/techniques/${techniqueData.techniqueId}`,
  };
};

/**
 * Gets techniques by tactic ID.
 *
 * @param {string} tacticId - Tactic ID
 * @param {ATTACKTechnique[]} allTechniques - All available techniques
 * @returns {ATTACKTechnique[]} Techniques for the tactic
 *
 * @example
 * ```typescript
 * const techniques = getTechniquesByTactic('TA0001', allTechniques);
 * ```
 */
export const getTechniquesByTactic = (
  tacticId: string,
  allTechniques: ATTACKTechnique[],
): ATTACKTechnique[] => {
  return allTechniques.filter(t => t.tactics.includes(tacticId));
};

/**
 * Gets techniques by platform.
 *
 * @param {string} platform - Platform name
 * @param {ATTACKTechnique[]} allTechniques - All available techniques
 * @returns {ATTACKTechnique[]} Techniques for the platform
 *
 * @example
 * ```typescript
 * const windowsTechniques = getTechniquesByPlatform('Windows', allTechniques);
 * ```
 */
export const getTechniquesByPlatform = (
  platform: string,
  allTechniques: ATTACKTechnique[],
): ATTACKTechnique[] => {
  return allTechniques.filter(t => t.platforms.includes(platform));
};

/**
 * Gets techniques by detection difficulty.
 *
 * @param {string} difficulty - Detection difficulty level
 * @param {ATTACKTechnique[]} allTechniques - All available techniques
 * @returns {ATTACKTechnique[]} Techniques matching difficulty
 *
 * @example
 * ```typescript
 * const hardToDetect = getTechniquesByDifficulty('high', allTechniques);
 * ```
 */
export const getTechniquesByDifficulty = (
  difficulty: 'low' | 'medium' | 'high',
  allTechniques: ATTACKTechnique[],
): ATTACKTechnique[] => {
  return allTechniques.filter(t => t.detectionDifficulty === difficulty);
};

/**
 * Searches techniques by keyword.
 *
 * @param {string} keyword - Search keyword
 * @param {ATTACKTechnique[]} allTechniques - All available techniques
 * @returns {ATTACKTechnique[]} Matching techniques
 *
 * @example
 * ```typescript
 * const found = searchTechniques('powershell', allTechniques);
 * ```
 */
export const searchTechniques = (
  keyword: string,
  allTechniques: ATTACKTechnique[],
): ATTACKTechnique[] => {
  const lowerKeyword = keyword.toLowerCase();
  return allTechniques.filter(
    t => t.name.toLowerCase().includes(lowerKeyword) ||
         t.description.toLowerCase().includes(lowerKeyword) ||
         t.techniqueId.toLowerCase().includes(lowerKeyword),
  );
};

/**
 * Validates technique ID format.
 *
 * @param {string} techniqueId - Technique ID to validate
 * @returns {boolean} True if valid format
 *
 * @example
 * ```typescript
 * const valid = validateTechniqueId('T1059'); // true
 * const invalid = validateTechniqueId('X9999'); // false
 * ```
 */
export const validateTechniqueId = (techniqueId: string): boolean => {
  // Matches T1234 or T1234.001 (technique or subtechnique)
  const regex = /^T\d{4}(\.\d{3})?$/;
  return regex.test(techniqueId);
};

/**
 * Checks if technique ID is a subtechnique.
 *
 * @param {string} techniqueId - Technique ID
 * @returns {boolean} True if subtechnique
 *
 * @example
 * ```typescript
 * const isSub = isSubtechnique('T1059.001'); // true
 * const isNot = isSubtechnique('T1059'); // false
 * ```
 */
export const isSubtechnique = (techniqueId: string): boolean => {
  return /^T\d{4}\.\d{3}$/.test(techniqueId);
};

/**
 * Extracts parent technique ID from subtechnique.
 *
 * @param {string} subtechniqueId - Subtechnique ID
 * @returns {string | null} Parent technique ID or null
 *
 * @example
 * ```typescript
 * const parent = getParentTechnique('T1059.001');
 * // Result: 'T1059'
 * ```
 */
export const getParentTechnique = (subtechniqueId: string): string | null => {
  if (!isSubtechnique(subtechniqueId)) {
    return null;
  }
  return subtechniqueId.split('.')[0];
};

// ============================================================================
// TTP EXTRACTION UTILITIES
// ============================================================================

/**
 * Extracts TTPs from threat intelligence text.
 *
 * @param {string} text - Threat intelligence text
 * @param {ATTACKTechnique[]} knownTechniques - Known techniques database
 * @returns {TTPExtraction} Extracted TTPs
 *
 * @example
 * ```typescript
 * const ttps = extractTTPsFromText(threatReport, techniques);
 * // Result: { tactics: ['TA0001'], techniques: ['T1059'], procedures: [...], confidence: 0.85 }
 * ```
 */
export const extractTTPsFromText = (
  text: string,
  knownTechniques: ATTACKTechnique[],
): TTPExtraction => {
  const lowerText = text.toLowerCase();
  const foundTechniques: string[] = [];
  const foundTactics = new Set<string>();

  // Search for technique IDs (e.g., T1059)
  const techniqueIdMatches = text.match(/T\d{4}(\.\d{3})?/g) || [];
  techniqueIdMatches.forEach(id => {
    if (validateTechniqueId(id)) {
      foundTechniques.push(id);
    }
  });

  // Search for technique names
  knownTechniques.forEach(technique => {
    if (lowerText.includes(technique.name.toLowerCase())) {
      if (!foundTechniques.includes(technique.techniqueId)) {
        foundTechniques.push(technique.techniqueId);
      }
      technique.tactics.forEach(tacticId => foundTactics.add(tacticId));
    }
  });

  const confidence = calculateExtractionConfidence(foundTechniques.length, text.length);

  return {
    tactics: Array.from(foundTactics),
    techniques: foundTechniques,
    procedures: [], // Extracted separately through more advanced NLP
    confidence,
    sources: ['text-analysis'],
    timestamp: new Date(),
  };
};

/**
 * Calculates confidence score for TTP extraction.
 *
 * @param {number} matchCount - Number of matches found
 * @param {number} textLength - Length of analyzed text
 * @returns {number} Confidence score (0-1)
 *
 * @example
 * ```typescript
 * const confidence = calculateExtractionConfidence(5, 1000);
 * // Result: 0.75
 * ```
 */
export const calculateExtractionConfidence = (
  matchCount: number,
  textLength: number,
): number => {
  if (matchCount === 0) return 0;

  // More matches increase confidence, but normalize by text length
  const density = matchCount / (textLength / 1000);
  const baseConfidence = Math.min(matchCount / 10, 1.0);
  const densityFactor = Math.min(density / 5, 1.0);

  return Math.min((baseConfidence * 0.7) + (densityFactor * 0.3), 1.0);
};

/**
 * Merges multiple TTP extractions into single result.
 *
 * @param {TTPExtraction[]} extractions - Multiple extractions
 * @returns {TTPExtraction} Merged extraction
 *
 * @example
 * ```typescript
 * const merged = mergeTTPExtractions([extraction1, extraction2, extraction3]);
 * ```
 */
export const mergeTTPExtractions = (extractions: TTPExtraction[]): TTPExtraction => {
  const allTactics = new Set<string>();
  const allTechniques = new Set<string>();
  const allProcedures = new Set<string>();
  const allSources = new Set<string>();

  extractions.forEach(extraction => {
    extraction.tactics.forEach(t => allTactics.add(t));
    extraction.techniques.forEach(t => allTechniques.add(t));
    extraction.procedures.forEach(p => allProcedures.add(p));
    extraction.sources.forEach(s => allSources.add(s));
  });

  const avgConfidence = extractions.reduce((sum, e) => sum + e.confidence, 0) / extractions.length;

  return {
    tactics: Array.from(allTactics),
    techniques: Array.from(allTechniques),
    procedures: Array.from(allProcedures),
    confidence: avgConfidence,
    sources: Array.from(allSources),
    timestamp: new Date(),
  };
};

// ============================================================================
// ATTACK PATTERN MATCHING UTILITIES
// ============================================================================

/**
 * Creates an attack pattern from techniques and indicators.
 *
 * @param {Partial<AttackPattern>} patternData - Attack pattern data
 * @returns {AttackPattern} Created attack pattern
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const pattern = createAttackPattern({
 *   name: 'Ransomware Deployment',
 *   techniques: ['T1486', 'T1490'],
 *   indicators: [...]
 * });
 * ```
 */
export const createAttackPattern = (patternData: Partial<AttackPattern>): AttackPattern => {
  if (!patternData.name || !patternData.techniques) {
    throw new Error('name and techniques are required');
  }

  return {
    patternId: patternData.patternId || `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: patternData.name,
    description: patternData.description || '',
    techniques: patternData.techniques,
    indicators: patternData.indicators || [],
    killChainPhases: patternData.killChainPhases || [],
    severity: patternData.severity || 'medium',
  };
};

/**
 * Matches observed behaviors to attack patterns.
 *
 * @param {AttackIndicator[]} observedIndicators - Observed indicators
 * @param {AttackPattern[]} knownPatterns - Known attack patterns
 * @returns {Array<{ pattern: AttackPattern; matchScore: number }>} Matched patterns with scores
 *
 * @example
 * ```typescript
 * const matches = matchAttackPattern(indicators, patterns);
 * // Result: [{ pattern: {...}, matchScore: 0.85 }, ...]
 * ```
 */
export const matchAttackPattern = (
  observedIndicators: AttackIndicator[],
  knownPatterns: AttackPattern[],
): Array<{ pattern: AttackPattern; matchScore: number }> => {
  return knownPatterns.map(pattern => {
    const matchScore = calculatePatternMatchScore(observedIndicators, pattern);
    return { pattern, matchScore };
  }).filter(match => match.matchScore > 0.3)
    .sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Calculates match score between indicators and pattern.
 *
 * @param {AttackIndicator[]} observedIndicators - Observed indicators
 * @param {AttackPattern} pattern - Attack pattern
 * @returns {number} Match score (0-1)
 *
 * @example
 * ```typescript
 * const score = calculatePatternMatchScore(indicators, pattern);
 * // Result: 0.75
 * ```
 */
export const calculatePatternMatchScore = (
  observedIndicators: AttackIndicator[],
  pattern: AttackPattern,
): number => {
  if (pattern.indicators.length === 0) return 0;

  let totalWeight = 0;
  let matchedWeight = 0;

  pattern.indicators.forEach(patternIndicator => {
    totalWeight += patternIndicator.weight;

    const matched = observedIndicators.some(
      obs => obs.type === patternIndicator.type && obs.value === patternIndicator.value,
    );

    if (matched) {
      matchedWeight += patternIndicator.weight;
    }
  });

  return totalWeight > 0 ? matchedWeight / totalWeight : 0;
};

// ============================================================================
// KILL CHAIN ANALYSIS UTILITIES
// ============================================================================

/**
 * Maps techniques to kill chain phases.
 *
 * @param {string[]} techniqueIds - Technique IDs
 * @param {ATTACKTechnique[]} allTechniques - All techniques
 * @returns {KillChainPhase[]} Kill chain phases
 *
 * @example
 * ```typescript
 * const phases = mapToKillChain(['T1059', 'T1003'], techniques);
 * ```
 */
export const mapToKillChain = (
  techniqueIds: string[],
  allTechniques: ATTACKTechnique[],
): KillChainPhase[] => {
  const tactics = getAllTactics();
  const phaseMap = new Map<string, KillChainPhase>();

  techniqueIds.forEach(techId => {
    const technique = allTechniques.find(t => t.techniqueId === techId);
    if (!technique) return;

    technique.tactics.forEach(tacticId => {
      const tactic = tactics.find(t => t.id === tacticId);
      if (!tactic) return;

      if (!phaseMap.has(tacticId)) {
        phaseMap.set(tacticId, {
          phase: tactic.name,
          order: tactics.findIndex(t => t.id === tacticId),
          techniques: [],
          observed: true,
          timestamp: new Date(),
        });
      }

      const phase = phaseMap.get(tacticId)!;
      if (!phase.techniques.includes(techId)) {
        phase.techniques.push(techId);
      }
    });
  });

  return Array.from(phaseMap.values()).sort((a, b) => a.order - b.order);
};

/**
 * Analyzes kill chain completeness.
 *
 * @param {KillChainPhase[]} observedPhases - Observed kill chain phases
 * @returns {object} Kill chain analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeKillChainCompleteness(phases);
 * // Result: { completeness: 0.7, missingPhases: [...], criticalGaps: [...] }
 * ```
 */
export const analyzeKillChainCompleteness = (
  observedPhases: KillChainPhase[],
): { completeness: number; missingPhases: string[]; criticalGaps: boolean } => {
  const allTactics = getAllTactics();
  const observedTactics = new Set(observedPhases.map(p => p.phase));

  const missingPhases = allTactics
    .filter(t => !observedTactics.has(t.name))
    .map(t => t.name);

  const completeness = observedPhases.length / allTactics.length;

  // Critical gaps: missing Initial Access, Execution, or C2
  const criticalPhases = ['Initial Access', 'Execution', 'Command and Control'];
  const criticalGaps = criticalPhases.some(phase => missingPhases.includes(phase));

  return { completeness, missingPhases, criticalGaps };
};

/**
 * Predicts next likely kill chain phase.
 *
 * @param {KillChainPhase[]} observedPhases - Observed phases
 * @returns {string | null} Next likely phase name
 *
 * @example
 * ```typescript
 * const next = predictNextKillChainPhase(currentPhases);
 * // Result: 'Lateral Movement'
 * ```
 */
export const predictNextKillChainPhase = (observedPhases: KillChainPhase[]): string | null => {
  const allTactics = getAllTactics();
  const maxOrder = Math.max(...observedPhases.map(p => p.order), -1);

  const nextTactic = allTactics.find(t => {
    const tacticOrder = allTactics.findIndex(tac => tac.id === t.id);
    return tacticOrder > maxOrder;
  });

  return nextTactic ? nextTactic.name : null;
};

// ============================================================================
// DETECTION COVERAGE UTILITIES
// ============================================================================

/**
 * Creates a detection rule for a technique.
 *
 * @param {Partial<DetectionRule>} ruleData - Detection rule data
 * @returns {DetectionRule} Created detection rule
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const rule = createDetectionRule({
 *   name: 'PowerShell Execution',
 *   techniqueId: 'T1059.001',
 *   platform: 'Windows',
 *   dataSource: 'Process',
 *   query: 'ProcessName = "powershell.exe"'
 * });
 * ```
 */
export const createDetectionRule = (ruleData: Partial<DetectionRule>): DetectionRule => {
  if (!ruleData.name || !ruleData.techniqueId || !ruleData.query) {
    throw new Error('name, techniqueId, and query are required');
  }

  return {
    id: ruleData.id || `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: ruleData.name,
    techniqueId: ruleData.techniqueId,
    platform: ruleData.platform || 'Windows',
    dataSource: ruleData.dataSource || 'Unknown',
    query: ruleData.query,
    falsePositiveRate: ruleData.falsePositiveRate || 0.1,
    severity: ruleData.severity || 'medium',
    enabled: ruleData.enabled !== undefined ? ruleData.enabled : true,
  };
};

/**
 * Calculates technique coverage across all detection rules.
 *
 * @param {ATTACKTechnique[]} techniques - All techniques
 * @param {DetectionRule[]} rules - All detection rules
 * @returns {TechniqueCoverage[]} Coverage for each technique
 *
 * @example
 * ```typescript
 * const coverage = calculateTechniqueCoverage(techniques, detectionRules);
 * ```
 */
export const calculateTechniqueCoverage = (
  techniques: ATTACKTechnique[],
  rules: DetectionRule[],
): TechniqueCoverage[] => {
  return techniques.map(technique => {
    const techniqueRules = rules.filter(r => r.techniqueId === technique.techniqueId && r.enabled);
    const covered = techniqueRules.length > 0;

    return {
      techniqueId: technique.techniqueId,
      techniqueName: technique.name,
      covered,
      detectionRules: techniqueRules.length,
      effectiveness: calculateCoverageEffectiveness(techniqueRules),
      gaps: covered ? [] : ['No detection rules'],
    };
  });
};

/**
 * Calculates effectiveness of detection coverage.
 *
 * @param {DetectionRule[]} rules - Detection rules
 * @returns {number} Effectiveness score (0-100)
 *
 * @example
 * ```typescript
 * const effectiveness = calculateCoverageEffectiveness(rules);
 * // Result: 85
 * ```
 */
export const calculateCoverageEffectiveness = (rules: DetectionRule[]): number => {
  if (rules.length === 0) return 0;

  const avgFalsePositiveRate = rules.reduce((sum, r) => sum + r.falsePositiveRate, 0) / rules.length;
  const ruleScore = Math.min(rules.length * 20, 100);
  const accuracyScore = (1 - avgFalsePositiveRate) * 100;

  return (ruleScore * 0.6) + (accuracyScore * 0.4);
};

/**
 * Identifies coverage gaps for techniques.
 *
 * @param {TechniqueCoverage[]} coverage - Technique coverage
 * @param {number} [minEffectiveness=50] - Minimum effectiveness threshold
 * @returns {TechniqueCoverage[]} Techniques with gaps
 *
 * @example
 * ```typescript
 * const gaps = identifyCoverageGaps(coverage, 70);
 * ```
 */
export const identifyCoverageGaps = (
  coverage: TechniqueCoverage[],
  minEffectiveness: number = 50,
): TechniqueCoverage[] => {
  return coverage.filter(c => !c.covered || c.effectiveness < minEffectiveness);
};

// ============================================================================
// ATT&CK NAVIGATOR UTILITIES
// ============================================================================

/**
 * Creates ATT&CK Navigator layer.
 *
 * @param {Partial<NavigatorLayer>} layerData - Layer data
 * @returns {NavigatorLayer} Navigator layer
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const layer = createNavigatorLayer({
 *   name: 'Detection Coverage',
 *   description: 'Current detection coverage',
 *   techniques: [...]
 * });
 * ```
 */
export const createNavigatorLayer = (layerData: Partial<NavigatorLayer>): NavigatorLayer => {
  if (!layerData.name || !layerData.techniques) {
    throw new Error('name and techniques are required');
  }

  return {
    name: layerData.name,
    version: layerData.version || '4.5',
    domain: layerData.domain || 'enterprise-attack',
    description: layerData.description || '',
    techniques: layerData.techniques,
    gradient: layerData.gradient || {
      colors: ['#ff6666', '#ffe766', '#8ec843'],
      minValue: 0,
      maxValue: 100,
    },
    legendItems: layerData.legendItems || [],
  };
};

/**
 * Adds technique to Navigator layer.
 *
 * @param {NavigatorLayer} layer - Navigator layer
 * @param {NavigatorTechnique} technique - Technique to add
 * @returns {NavigatorLayer} Updated layer
 *
 * @example
 * ```typescript
 * const updated = addTechniqueToLayer(layer, {
 *   techniqueID: 'T1059',
 *   score: 85,
 *   enabled: true
 * });
 * ```
 */
export const addTechniqueToLayer = (
  layer: NavigatorLayer,
  technique: NavigatorTechnique,
): NavigatorLayer => {
  const exists = layer.techniques.some(t => t.techniqueID === technique.techniqueID);

  if (exists) {
    return {
      ...layer,
      techniques: layer.techniques.map(t =>
        t.techniqueID === technique.techniqueID ? technique : t,
      ),
    };
  }

  return {
    ...layer,
    techniques: [...layer.techniques, technique],
  };
};

/**
 * Generates Navigator layer from coverage data.
 *
 * @param {TechniqueCoverage[]} coverage - Technique coverage
 * @param {string} layerName - Layer name
 * @returns {NavigatorLayer} Navigator layer
 *
 * @example
 * ```typescript
 * const layer = generateLayerFromCoverage(coverage, 'Detection Coverage');
 * ```
 */
export const generateLayerFromCoverage = (
  coverage: TechniqueCoverage[],
  layerName: string,
): NavigatorLayer => {
  const techniques: NavigatorTechnique[] = coverage.map(c => ({
    techniqueID: c.techniqueId,
    score: c.effectiveness,
    color: c.covered ? undefined : '#ff0000',
    comment: `${c.detectionRules} detection rules`,
    enabled: true,
    metadata: {
      covered: c.covered,
      rules: c.detectionRules,
    },
  }));

  return createNavigatorLayer({
    name: layerName,
    description: `Detection coverage for ${coverage.length} techniques`,
    techniques,
  });
};

/**
 * Exports Navigator layer to JSON.
 *
 * @param {NavigatorLayer} layer - Navigator layer
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = exportNavigatorLayer(layer);
 * ```
 */
export const exportNavigatorLayer = (layer: NavigatorLayer): string => {
  return JSON.stringify(layer, null, 2);
};

// ============================================================================
// THREAT ACTOR PROFILING UTILITIES
// ============================================================================

/**
 * Creates a threat actor profile.
 *
 * @param {Partial<ThreatActorProfile>} profileData - Profile data
 * @returns {ThreatActorProfile} Threat actor profile
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const profile = createThreatActorProfile({
 *   name: 'APT29',
 *   aliases: ['Cozy Bear', 'The Dukes'],
 *   tactics: ['TA0001', 'TA0002'],
 *   techniques: ['T1566', 'T1059']
 * });
 * ```
 */
export const createThreatActorProfile = (
  profileData: Partial<ThreatActorProfile>,
): ThreatActorProfile => {
  if (!profileData.name) {
    throw new Error('name is required');
  }

  return {
    name: profileData.name,
    aliases: profileData.aliases || [],
    description: profileData.description || '',
    sophistication: profileData.sophistication || 'medium',
    tactics: profileData.tactics || [],
    techniques: profileData.techniques || [],
    targetedSectors: profileData.targetedSectors || [],
    attribution: profileData.attribution || 'Unknown',
  };
};

/**
 * Compares threat actor TTPs with observed activity.
 *
 * @param {ThreatActorProfile} profile - Threat actor profile
 * @param {TTPExtraction} observed - Observed TTPs
 * @returns {number} Similarity score (0-1)
 *
 * @example
 * ```typescript
 * const similarity = compareThreatActorTTPs(apt29Profile, observedTTPs);
 * // Result: 0.75
 * ```
 */
export const compareThreatActorTTPs = (
  profile: ThreatActorProfile,
  observed: TTPExtraction,
): number => {
  const tacticMatches = profile.tactics.filter(t => observed.tactics.includes(t)).length;
  const techniqueMatches = profile.techniques.filter(t => observed.techniques.includes(t)).length;

  const tacticScore = profile.tactics.length > 0 ? tacticMatches / profile.tactics.length : 0;
  const techniqueScore = profile.techniques.length > 0 ? techniqueMatches / profile.techniques.length : 0;

  return (tacticScore * 0.3) + (techniqueScore * 0.7);
};

/**
 * Suggests likely threat actors based on TTPs.
 *
 * @param {TTPExtraction} observed - Observed TTPs
 * @param {ThreatActorProfile[]} knownActors - Known threat actors
 * @param {number} [threshold=0.5] - Minimum similarity threshold
 * @returns {Array<{ actor: ThreatActorProfile; similarity: number }>} Matched actors
 *
 * @example
 * ```typescript
 * const suspects = suggestThreatActors(observedTTPs, allActors, 0.6);
 * ```
 */
export const suggestThreatActors = (
  observed: TTPExtraction,
  knownActors: ThreatActorProfile[],
  threshold: number = 0.5,
): Array<{ actor: ThreatActorProfile; similarity: number }> => {
  return knownActors
    .map(actor => ({
      actor,
      similarity: compareThreatActorTTPs(actor, observed),
    }))
    .filter(match => match.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
};

// ============================================================================
// MITIGATION UTILITIES
// ============================================================================

/**
 * Gets recommended mitigations for a technique.
 *
 * @param {string} techniqueId - Technique ID
 * @returns {string[]} Recommended mitigation IDs
 *
 * @example
 * ```typescript
 * const mitigations = getMitigationsForTechnique('T1059');
 * // Result: ['M1038', 'M1049', 'M1026']
 * ```
 */
export const getMitigationsForTechnique = (techniqueId: string): string[] => {
  // Simplified mapping - in production, use MITRE ATT&CK STIX data
  const mitigationMap: Record<string, string[]> = {
    'T1059': ['M1038', 'M1049', 'M1026'], // Command and Scripting Interpreter
    'T1003': ['M1027', 'M1028', 'M1017'], // OS Credential Dumping
    'T1566': ['M1049', 'M1031', 'M1054'], // Phishing
    'T1486': ['M1053', 'M1040'], // Data Encrypted for Impact
  };

  return mitigationMap[techniqueId] || [];
};

/**
 * Prioritizes techniques by risk score.
 *
 * @param {ATTACKTechnique[]} techniques - Techniques to prioritize
 * @param {object} context - Prioritization context
 * @returns {Array<{ technique: ATTACKTechnique; riskScore: number }>} Prioritized techniques
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeTechniquesByRisk(techniques, { platform: 'Windows', criticality: 'high' });
 * ```
 */
export const prioritizeTechniquesByRisk = (
  techniques: ATTACKTechnique[],
  context: { platform?: string; criticality?: string },
): Array<{ technique: ATTACKTechnique; riskScore: number }> => {
  return techniques.map(technique => {
    let riskScore = 50; // Base score

    // Detection difficulty increases risk
    if (technique.detectionDifficulty === 'high') riskScore += 30;
    else if (technique.detectionDifficulty === 'medium') riskScore += 15;

    // Platform match increases risk
    if (context.platform && technique.platforms.includes(context.platform)) {
      riskScore += 10;
    }

    // Required permissions affect risk
    if (technique.permissions.includes('Administrator') || technique.permissions.includes('root')) {
      riskScore += 20;
    }

    return { technique, riskScore: Math.min(riskScore, 100) };
  }).sort((a, b) => b.riskScore - a.riskScore);
};

// ============================================================================
// DATA SOURCE UTILITIES
// ============================================================================

/**
 * Gets required data sources for technique detection.
 *
 * @param {ATTACKTechnique} technique - Technique
 * @returns {string[]} Required data sources
 *
 * @example
 * ```typescript
 * const dataSources = getRequiredDataSources(technique);
 * // Result: ['Process', 'Command', 'Script']
 * ```
 */
export const getRequiredDataSources = (technique: ATTACKTechnique): string[] => {
  return technique.dataSourcesRequired;
};

/**
 * Checks if data source coverage is sufficient for technique detection.
 *
 * @param {ATTACKTechnique} technique - Technique
 * @param {string[]} availableDataSources - Available data sources
 * @returns {boolean} True if coverage is sufficient
 *
 * @example
 * ```typescript
 * const sufficient = checkDataSourceCoverage(technique, ['Process', 'File', 'Network']);
 * ```
 */
export const checkDataSourceCoverage = (
  technique: ATTACKTechnique,
  availableDataSources: string[],
): boolean => {
  const required = technique.dataSourcesRequired;
  if (required.length === 0) return true;

  const coveredSources = required.filter(source => availableDataSources.includes(source));
  return coveredSources.length >= Math.ceil(required.length * 0.7); // 70% coverage threshold
};

/**
 * Identifies missing data sources for comprehensive coverage.
 *
 * @param {ATTACKTechnique[]} techniques - Techniques to cover
 * @param {string[]} availableDataSources - Available data sources
 * @returns {string[]} Missing data sources
 *
 * @example
 * ```typescript
 * const missing = identifyMissingDataSources(techniques, ['Process', 'File']);
 * // Result: ['Network', 'Registry', 'Command']
 * ```
 */
export const identifyMissingDataSources = (
  techniques: ATTACKTechnique[],
  availableDataSources: string[],
): string[] => {
  const allRequired = new Set<string>();

  techniques.forEach(technique => {
    technique.dataSourcesRequired.forEach(source => allRequired.add(source));
  });

  return Array.from(allRequired).filter(source => !availableDataSources.includes(source));
};

// ============================================================================
// CAMPAIGN ANALYSIS UTILITIES
// ============================================================================

/**
 * Analyzes campaign tactics and techniques.
 *
 * @param {TTPExtraction[]} campaignActivity - Campaign activity TTPs
 * @returns {object} Campaign analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeCampaignTactics(activity);
 * // Result: { primaryTactics: [...], techniques: [...], sophistication: 'high', timeline: {...} }
 * ```
 */
export const analyzeCampaignTactics = (
  campaignActivity: TTPExtraction[],
): object => {
  const allTactics = new Set<string>();
  const allTechniques = new Set<string>();

  campaignActivity.forEach(activity => {
    activity.tactics.forEach(t => allTactics.add(t));
    activity.techniques.forEach(t => allTechniques.add(t));
  });

  const avgConfidence = campaignActivity.reduce((sum, a) => sum + a.confidence, 0) / campaignActivity.length;

  return {
    primaryTactics: Array.from(allTactics),
    techniques: Array.from(allTechniques),
    sophistication: avgConfidence > 0.8 ? 'high' : avgConfidence > 0.5 ? 'medium' : 'low',
    timeline: {
      firstSeen: new Date(Math.min(...campaignActivity.map(a => a.timestamp.getTime()))),
      lastSeen: new Date(Math.max(...campaignActivity.map(a => a.timestamp.getTime()))),
    },
    uniqueSources: new Set(campaignActivity.flatMap(a => a.sources)).size,
  };
};

/**
 * Compares two campaigns by TTPs similarity.
 *
 * @param {TTPExtraction} campaign1 - First campaign
 * @param {TTPExtraction} campaign2 - Second campaign
 * @returns {number} Similarity score (0-1)
 *
 * @example
 * ```typescript
 * const similarity = compareCampaigns(campaign1, campaign2);
 * // Result: 0.65
 * ```
 */
export const compareCampaigns = (
  campaign1: TTPExtraction,
  campaign2: TTPExtraction,
): number => {
  const tactics1 = new Set(campaign1.tactics);
  const tactics2 = new Set(campaign2.tactics);
  const tacticIntersection = new Set([...tactics1].filter(t => tactics2.has(t)));
  const tacticUnion = new Set([...tactics1, ...tactics2]);

  const techniques1 = new Set(campaign1.techniques);
  const techniques2 = new Set(campaign2.techniques);
  const techniqueIntersection = new Set([...techniques1].filter(t => techniques2.has(t)));
  const techniqueUnion = new Set([...techniques1, ...techniques2]);

  const tacticSimilarity = tacticUnion.size > 0 ? tacticIntersection.size / tacticUnion.size : 0;
  const techniqueSimilarity = techniqueUnion.size > 0 ? techniqueIntersection.size / techniqueUnion.size : 0;

  return (tacticSimilarity * 0.3) + (techniqueSimilarity * 0.7);
};

// ============================================================================
// MAPPING AND ENRICHMENT UTILITIES
// ============================================================================

/**
 * Enriches technique with additional context.
 *
 * @param {ATTACKTechnique} technique - Base technique
 * @param {object} enrichmentData - Additional data
 * @returns {ATTACKTechnique} Enriched technique
 *
 * @example
 * ```typescript
 * const enriched = enrichTechniqueWithContext(technique, {
 *   observedInWild: true,
 *   prevalence: 'high',
 *   recentCampaigns: ['campaign-1', 'campaign-2']
 * });
 * ```
 */
export const enrichTechniqueWithContext = (
  technique: ATTACKTechnique,
  enrichmentData: Record<string, unknown>,
): ATTACKTechnique => {
  return {
    ...technique,
    ...enrichmentData,
  } as ATTACKTechnique;
};

/**
 * Maps CVE to MITRE ATT&CK techniques.
 *
 * @param {string} cveId - CVE identifier
 * @returns {string[]} Related technique IDs
 *
 * @example
 * ```typescript
 * const techniques = mapCVEToTechniques('CVE-2021-44228');
 * // Result: ['T1190', 'T1059']
 * ```
 */
export const mapCVEToTechniques = (cveId: string): string[] => {
  // Simplified mapping - in production, use CVE-ATT&CK mapping database
  const cveMap: Record<string, string[]> = {
    'CVE-2021-44228': ['T1190', 'T1059'], // Log4Shell
    'CVE-2017-11882': ['T1566', 'T1203'], // Office RCE
    'CVE-2020-0796': ['T1210'], // SMBGhost
  };

  return cveMap[cveId] || [];
};

/**
 * Generates technique heatmap data for visualization.
 *
 * @param {TechniqueCoverage[]} coverage - Technique coverage
 * @param {ATTACKTechnique[]} allTechniques - All techniques
 * @returns {object} Heatmap data
 *
 * @example
 * ```typescript
 * const heatmap = generateTechniqueHeatmap(coverage, techniques);
 * ```
 */
export const generateTechniqueHeatmap = (
  coverage: TechniqueCoverage[],
  allTechniques: ATTACKTechnique[],
): object => {
  const tactics = getAllTactics();

  const heatmapData = tactics.map(tactic => {
    const tacticTechniques = getTechniquesByTactic(tactic.id, allTechniques);
    const coveredTechniques = tacticTechniques.filter(t => {
      const cov = coverage.find(c => c.techniqueId === t.techniqueId);
      return cov && cov.covered;
    });

    return {
      tactic: tactic.name,
      tacticId: tactic.id,
      total: tacticTechniques.length,
      covered: coveredTechniques.length,
      coveragePercentage: tacticTechniques.length > 0
        ? (coveredTechniques.length / tacticTechniques.length) * 100
        : 0,
    };
  });

  return {
    heatmap: heatmapData,
    overallCoverage: heatmapData.reduce((sum, t) => sum + t.coveragePercentage, 0) / heatmapData.length,
  };
};

// ============================================================================
// API DESIGN UTILITIES
// ============================================================================

/**
 * Generates OpenAPI specification for MITRE ATT&CK endpoints.
 *
 * @param {string} baseUrl - Base URL for API
 * @returns {object} OpenAPI specification
 *
 * @example
 * ```typescript
 * const spec = generateMITREOpenAPISpec('/api/v1/attack');
 * ```
 */
export const generateMITREOpenAPISpec = (baseUrl: string): object => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'MITRE ATT&CK Integration API',
      version: '1.0.0',
      description: 'API for MITRE ATT&CK framework integration and analysis',
    },
    servers: [{ url: baseUrl }],
    paths: {
      '/tactics': {
        get: {
          summary: 'Get all tactics',
          tags: ['ATT&CK'],
          responses: {
            '200': {
              description: 'List of tactics',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ATTACKTactic' },
                  },
                },
              },
            },
          },
        },
      },
      '/techniques': {
        get: {
          summary: 'Get techniques',
          tags: ['ATT&CK'],
          parameters: [
            {
              name: 'tacticId',
              in: 'query',
              schema: { type: 'string' },
            },
            {
              name: 'platform',
              in: 'query',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': { description: 'List of techniques' },
          },
        },
      },
      '/extract-ttps': {
        post: {
          summary: 'Extract TTPs from text',
          tags: ['Analysis'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    text: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Extracted TTPs' },
          },
        },
      },
      '/coverage': {
        get: {
          summary: 'Get detection coverage',
          tags: ['Coverage'],
          responses: {
            '200': { description: 'Technique coverage' },
          },
        },
      },
    },
    components: {
      schemas: {
        ATTACKTactic: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
    },
  };
};

/**
 * Creates NestJS service for ATT&CK operations.
 *
 * @returns {string} NestJS service class definition
 *
 * @example
 * ```typescript
 * const service = createMITREService();
 * ```
 */
export const createMITREService = (): string => {
  return `
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ATTACKTechnique } from './models/attack-technique.model';

@Injectable()
export class MitreAttackService {
  constructor(
    @InjectModel(ATTACKTechnique)
    private techniqueModel: typeof ATTACKTechnique,
  ) {}

  async getAllTactics() {
    return getAllTactics();
  }

  async getTechniquesByTactic(tacticId: string) {
    return this.techniqueModel.findAll({
      where: { tactics: { [Op.contains]: [tacticId] } },
    });
  }

  async extractTTPs(text: string) {
    const techniques = await this.techniqueModel.findAll();
    return extractTTPsFromText(text, techniques);
  }

  async calculateCoverage() {
    const techniques = await this.techniqueModel.findAll();
    const rules = await this.getDetectionRules();
    return calculateTechniqueCoverage(techniques, rules);
  }
}
  `.trim();
};

/**
 * Generates Sequelize model for ATT&CK techniques.
 *
 * @returns {string} Sequelize model definition
 *
 * @example
 * ```typescript
 * const model = generateATTACKTechniqueModel();
 * ```
 */
export const generateATTACKTechniqueModel = (): string => {
  return `
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'attack_techniques', timestamps: true })
export class ATTACKTechnique extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  techniqueId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  tactics: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  platforms: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  dataSourcesRequired: string[];

  @Column({ type: DataType.ENUM('low', 'medium', 'high'), defaultValue: 'medium' })
  detectionDifficulty: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  subtechniques: string[];

  @Column({ type: DataType.STRING })
  url: string;
}
  `.trim();
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Tactics
  getAllTactics,
  getTacticById,
  getTacticsByPlatform,
  mapTacticNameToId,

  // Techniques
  createTechnique,
  getTechniquesByTactic,
  getTechniquesByPlatform,
  getTechniquesByDifficulty,
  searchTechniques,
  validateTechniqueId,
  isSubtechnique,
  getParentTechnique,

  // TTP Extraction
  extractTTPsFromText,
  calculateExtractionConfidence,
  mergeTTPExtractions,

  // Attack Patterns
  createAttackPattern,
  matchAttackPattern,
  calculatePatternMatchScore,

  // Kill Chain
  mapToKillChain,
  analyzeKillChainCompleteness,
  predictNextKillChainPhase,

  // Detection Coverage
  createDetectionRule,
  calculateTechniqueCoverage,
  calculateCoverageEffectiveness,
  identifyCoverageGaps,

  // ATT&CK Navigator
  createNavigatorLayer,
  addTechniqueToLayer,
  generateLayerFromCoverage,
  exportNavigatorLayer,

  // Threat Actor Profiling
  createThreatActorProfile,
  compareThreatActorTTPs,
  suggestThreatActors,

  // API Design
  generateMITREOpenAPISpec,
  createMITREService,
  generateATTACKTechniqueModel,

  // Mitigations
  getMitigationsForTechnique,
  prioritizeTechniquesByRisk,

  // Data Sources
  getRequiredDataSources,
  checkDataSourceCoverage,
  identifyMissingDataSources,

  // Campaign Analysis
  analyzeCampaignTactics,
  compareCampaigns,

  // Mapping and Enrichment
  enrichTechniqueWithContext,
  mapCVEToTechniques,
  generateTechniqueHeatmap,
};
