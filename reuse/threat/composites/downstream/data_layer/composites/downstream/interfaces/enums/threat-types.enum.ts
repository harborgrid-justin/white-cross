/**
 * @fileoverview Threat Type Enumerations
 * @module interfaces/enums/threat-types
 * @description Comprehensive threat type classifications for cybersecurity threat intelligence
 */

/**
 * Primary threat type classifications
 * Covers major categories of cybersecurity threats
 */
export enum ThreatType {
  /** Malicious software including viruses, trojans, and spyware */
  MALWARE = 'MALWARE',

  /** Phishing attacks targeting credentials and sensitive information */
  PHISHING = 'PHISHING',

  /** Ransomware attacks encrypting data for ransom */
  RANSOMWARE = 'RANSOMWARE',

  /** Advanced Persistent Threat - sophisticated long-term attacks */
  APT = 'APT',

  /** Distributed Denial of Service attacks */
  DDOS = 'DDOS',

  /** Social engineering attacks manipulating human behavior */
  SOCIAL_ENGINEERING = 'SOCIAL_ENGINEERING',

  /** Insider threats from authorized users */
  INSIDER_THREAT = 'INSIDER_THREAT',

  /** Zero-day exploits targeting unknown vulnerabilities */
  ZERO_DAY = 'ZERO_DAY',

  /** Man-in-the-Middle attacks intercepting communications */
  MITM = 'MITM',

  /** SQL injection and code injection attacks */
  INJECTION_ATTACK = 'INJECTION_ATTACK',

  /** Cross-Site Scripting (XSS) attacks */
  XSS = 'XSS',

  /** Cross-Site Request Forgery attacks */
  CSRF = 'CSRF',

  /** Data breach or exfiltration */
  DATA_BREACH = 'DATA_BREACH',

  /** Account takeover or credential stuffing */
  ACCOUNT_TAKEOVER = 'ACCOUNT_TAKEOVER',

  /** Supply chain attacks targeting dependencies */
  SUPPLY_CHAIN = 'SUPPLY_CHAIN',

  /** Cryptojacking or unauthorized cryptocurrency mining */
  CRYPTOJACKING = 'CRYPTOJACKING',

  /** Botnet activity */
  BOTNET = 'BOTNET',

  /** Unknown or unclassified threat */
  UNKNOWN = 'UNKNOWN'
}

/**
 * Threat severity levels
 * Based on CVSS scoring and business impact
 */
export enum ThreatSeverity {
  /** Informational - no immediate action required */
  INFO = 'INFO',

  /** Low severity - minimal business impact */
  LOW = 'LOW',

  /** Medium severity - moderate business impact */
  MEDIUM = 'MEDIUM',

  /** High severity - significant business impact */
  HIGH = 'HIGH',

  /** Critical severity - severe business impact, immediate action required */
  CRITICAL = 'CRITICAL'
}

/**
 * Threat status in lifecycle
 */
export enum ThreatStatus {
  /** Newly detected threat */
  NEW = 'NEW',

  /** Threat under investigation */
  INVESTIGATING = 'INVESTIGATING',

  /** Threat confirmed and validated */
  CONFIRMED = 'CONFIRMED',

  /** Mitigation in progress */
  MITIGATING = 'MITIGATING',

  /** Threat contained but not fully resolved */
  CONTAINED = 'CONTAINED',

  /** Threat fully resolved */
  RESOLVED = 'RESOLVED',

  /** False positive - not a real threat */
  FALSE_POSITIVE = 'FALSE_POSITIVE',

  /** Threat monitoring for recurrence */
  MONITORING = 'MONITORING',

  /** Threat archived */
  ARCHIVED = 'ARCHIVED'
}

/**
 * Threat actor types
 */
export enum ThreatActorType {
  /** Nation-state sponsored actors */
  NATION_STATE = 'NATION_STATE',

  /** Organized crime groups */
  ORGANIZED_CRIME = 'ORGANIZED_CRIME',

  /** Hacktivist groups */
  HACKTIVIST = 'HACKTIVIST',

  /** Individual hackers */
  INDIVIDUAL = 'INDIVIDUAL',

  /** Insider threats */
  INSIDER = 'INSIDER',

  /** Unknown attribution */
  UNKNOWN = 'UNKNOWN'
}

/**
 * MITRE ATT&CK Tactic categories
 */
export enum MitreTactic {
  RECONNAISSANCE = 'RECONNAISSANCE',
  RESOURCE_DEVELOPMENT = 'RESOURCE_DEVELOPMENT',
  INITIAL_ACCESS = 'INITIAL_ACCESS',
  EXECUTION = 'EXECUTION',
  PERSISTENCE = 'PERSISTENCE',
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION',
  DEFENSE_EVASION = 'DEFENSE_EVASION',
  CREDENTIAL_ACCESS = 'CREDENTIAL_ACCESS',
  DISCOVERY = 'DISCOVERY',
  LATERAL_MOVEMENT = 'LATERAL_MOVEMENT',
  COLLECTION = 'COLLECTION',
  COMMAND_AND_CONTROL = 'COMMAND_AND_CONTROL',
  EXFILTRATION = 'EXFILTRATION',
  IMPACT = 'IMPACT'
}
