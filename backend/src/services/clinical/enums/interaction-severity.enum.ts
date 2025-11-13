/**
 * Drug Interaction Severity Levels
 * Used for categorizing the severity of drug-drug interactions
 */
export enum InteractionSeverity {
  /** Minor interaction with minimal clinical significance */
  MINOR = 'MINOR',

  /** Moderate interaction requiring monitoring */
  MODERATE = 'MODERATE',

  /** Major interaction requiring intervention or alternative therapy */
  MAJOR = 'MAJOR',

  /** Severe interaction with serious adverse effects */
  SEVERE = 'SEVERE',

  /** Contraindicated - drugs should not be used together */
  CONTRAINDICATED = 'CONTRAINDICATED',
}
