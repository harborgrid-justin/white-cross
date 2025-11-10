/**
 * Validation Utilities - Comprehensive Validation Patterns
 *
 * Re-exports all validators from reference composite libraries and adds
 * threat intelligence-specific validators for IOCs, severity levels, MITRE ATT&CK,
 * CVEs, and other domain-specific validation patterns.
 *
 * @module shared-utilities/validation-utils
 * @version 1.0.0
 * @requires reuse/data/composites/model-validation-composites (1,496 lines - 50+ validators)
 * @requires reuse/data/composites/api-validation-decorators (1,453 lines - decorators)
 */

// ============================================================================
// RE-EXPORT REFERENCE VALIDATORS (50+ validators, 3000+ lines)
// ============================================================================

export * from '../../../../../data/composites/model-validation-composites';
export * from '../../../../../data/composites/api-validation-decorators';

// Import specific validators for threat intelligence extensions
import {
  createRegexValidator,
  createEnumValidator,
  createRangeValidator,
  createLengthValidator,
  createCompoundValidator,
  createAsyncValidator,
  ValidationErrorItem,
} from '../../../../../data/composites/model-validation-composites';

// ============================================================================
// THREAT INTELLIGENCE SPECIFIC VALIDATORS
// ============================================================================

/**
 * Indicator of Compromise (IOC) validators
 */
export const iocValidator = {
  /**
   * Validates email addresses (common in phishing IOCs)
   */
  email: createRegexValidator(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Invalid email address format'
  ),

  /**
   * Validates IPv4 addresses
   */
  ipv4: createRegexValidator(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    'Invalid IPv4 address'
  ),

  /**
   * Validates IPv6 addresses
   */
  ipv6: createRegexValidator(
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
    'Invalid IPv6 address'
  ),

  /**
   * Validates domain names
   */
  domain: createRegexValidator(
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i,
    'Invalid domain name'
  ),

  /**
   * Validates URL patterns
   */
  url: createRegexValidator(
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    'Invalid URL format'
  ),

  /**
   * Validates MD5 hashes
   */
  md5: createRegexValidator(
    /^[a-f0-9]{32}$/i,
    'Invalid MD5 hash (must be 32 hex characters)'
  ),

  /**
   * Validates SHA1 hashes
   */
  sha1: createRegexValidator(
    /^[a-f0-9]{40}$/i,
    'Invalid SHA1 hash (must be 40 hex characters)'
  ),

  /**
   * Validates SHA256 hashes
   */
  sha256: createRegexValidator(
    /^[a-f0-9]{64}$/i,
    'Invalid SHA256 hash (must be 64 hex characters)'
  ),

  /**
   * Validates any hash format (MD5, SHA1, SHA256)
   */
  anyHash: createRegexValidator(
    /^[a-f0-9]{32,64}$/i,
    'Invalid hash (must be 32, 40, or 64 hex characters)'
  ),

  /**
   * Compound IOC validator - validates any common IOC format
   */
  any: createCompoundValidator([
    (value: string) => iocValidator.email(value),
    (value: string) => iocValidator.ipv4(value),
    (value: string) => iocValidator.ipv6(value),
    (value: string) => iocValidator.domain(value),
    (value: string) => iocValidator.url(value),
    (value: string) => iocValidator.anyHash(value),
  ], 'or'),
};

/**
 * Threat severity validators
 */
export const severityValidator = createEnumValidator(
  ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  'Severity must be one of: LOW, MEDIUM, HIGH, CRITICAL'
);

/**
 * Threat type validators
 */
export const threatTypeValidator = createEnumValidator(
  [
    'MALWARE',
    'PHISHING',
    'RANSOMWARE',
    'APT',
    'DDOS',
    'DATA_BREACH',
    'INSIDER_THREAT',
    'SOCIAL_ENGINEERING',
    'ZERO_DAY',
    'VULNERABILITY',
    'BOTNET',
    'CRYPTOJACKING',
    'SUPPLY_CHAIN',
  ],
  'Invalid threat type'
);

/**
 * Threat status validators
 */
export const threatStatusValidator = createEnumValidator(
  ['NEW', 'INVESTIGATING', 'CONFIRMED', 'MITIGATED', 'RESOLVED', 'FALSE_POSITIVE', 'ARCHIVED'],
  'Invalid threat status'
);

/**
 * MITRE ATT&CK technique ID validator
 * Validates format: T1234 or T1234.001
 */
export const mitreValidator = createRegexValidator(
  /^T\d{4}(\.\d{3})?$/,
  'Invalid MITRE ATT&CK technique ID (format: T1234 or T1234.001)'
);

/**
 * CVE ID validator
 * Validates format: CVE-YYYY-NNNNN (e.g., CVE-2024-12345)
 */
export const cveValidator = createRegexValidator(
  /^CVE-\d{4}-\d{4,7}$/,
  'Invalid CVE ID (format: CVE-YYYY-NNNNN)'
);

/**
 * CVSS score validator (0.0 - 10.0)
 */
export const cvssScoreValidator = createRangeValidator(
  0.0,
  10.0,
  'CVSS score must be between 0.0 and 10.0'
);

/**
 * Threat confidence level validator (0-100)
 */
export const confidenceValidator = createRangeValidator(
  0,
  100,
  'Confidence must be between 0 and 100'
);

/**
 * TLP (Traffic Light Protocol) validator
 */
export const tlpValidator = createEnumValidator(
  ['WHITE', 'GREEN', 'AMBER', 'RED'],
  'TLP must be one of: WHITE, GREEN, AMBER, RED'
);

/**
 * Kill chain phase validator
 */
export const killChainPhaseValidator = createEnumValidator(
  [
    'RECONNAISSANCE',
    'WEAPONIZATION',
    'DELIVERY',
    'EXPLOITATION',
    'INSTALLATION',
    'COMMAND_AND_CONTROL',
    'ACTIONS_ON_OBJECTIVES',
  ],
  'Invalid kill chain phase'
);

// ============================================================================
// HEALTHCARE SPECIFIC VALIDATORS
// ============================================================================

/**
 * HIPAA PHI field validators
 */
export const phiValidator = {
  /**
   * Social Security Number (XXX-XX-XXXX)
   */
  ssn: createRegexValidator(
    /^\d{3}-\d{2}-\d{4}$/,
    'Invalid SSN format (XXX-XX-XXXX)'
  ),

  /**
   * Medical Record Number (alphanumeric, 6-20 chars)
   */
  mrn: createLengthValidator(6, 20, 'Medical Record Number must be 6-20 characters'),

  /**
   * Phone number (various formats)
   */
  phone: createRegexValidator(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    'Invalid phone number format'
  ),

  /**
   * Date of birth (YYYY-MM-DD)
   */
  dateOfBirth: createRegexValidator(
    /^\d{4}-\d{2}-\d{2}$/,
    'Date of birth must be in YYYY-MM-DD format'
  ),
};

// ============================================================================
// CROSS-FIELD VALIDATION HELPERS
// ============================================================================

/**
 * Cross-field validation rule
 */
export interface CrossFieldValidationRule {
  fields: string[];
  validator: (values: Record<string, any>) => boolean;
  message: string;
}

/**
 * Apply cross-field validations to an instance
 *
 * @param instance - The instance to validate
 * @param rules - Array of cross-field validation rules
 * @returns Array of validation errors (empty if valid)
 */
export function applyCrossFieldValidations(
  instance: any,
  rules: CrossFieldValidationRule[]
): ValidationErrorItem[] {
  const errors: ValidationErrorItem[] = [];

  for (const rule of rules) {
    const values: Record<string, any> = {};
    for (const field of rule.fields) {
      values[field] = instance[field];
    }

    if (!rule.validator(values)) {
      errors.push({
        field: rule.fields.join(', '),
        message: rule.message,
        value: values,
      });
    }
  }

  return errors;
}

/**
 * Common cross-field validation rules for threat intelligence
 */
export const threatCrossFieldRules: CrossFieldValidationRule[] = [
  {
    fields: ['severity', 'executiveNotification'],
    validator: (values) => {
      if (values.severity === 'CRITICAL') {
        return values.executiveNotification === true;
      }
      return true;
    },
    message: 'Executive notification required for CRITICAL threats',
  },
  {
    fields: ['status', 'resolution'],
    validator: (values) => {
      if (values.status === 'RESOLVED' || values.status === 'ARCHIVED') {
        return !!values.resolution;
      }
      return true;
    },
    message: 'Resolution required before marking threat as RESOLVED or ARCHIVED',
  },
  {
    fields: ['cvssScore', 'severity'],
    validator: (values) => {
      if (!values.cvssScore) return true;

      const score = parseFloat(values.cvssScore);
      if (score >= 9.0 && values.severity !== 'CRITICAL') {
        return false;
      }
      if (score >= 7.0 && score < 9.0 && values.severity !== 'HIGH') {
        return false;
      }
      if (score >= 4.0 && score < 7.0 && values.severity !== 'MEDIUM') {
        return false;
      }
      if (score < 4.0 && values.severity !== 'LOW') {
        return false;
      }
      return true;
    },
    message: 'CVSS score does not match severity level',
  },
];

// ============================================================================
// COMPOSITE VALIDATORS
// ============================================================================

/**
 * All threat intelligence validators in one object
 */
export const threatValidators = {
  ioc: iocValidator,
  severity: severityValidator,
  threatType: threatTypeValidator,
  threatStatus: threatStatusValidator,
  mitre: mitreValidator,
  cve: cveValidator,
  cvssScore: cvssScoreValidator,
  confidence: confidenceValidator,
  tlp: tlpValidator,
  killChainPhase: killChainPhaseValidator,
  crossField: threatCrossFieldRules,
};

/**
 * All healthcare validators in one object
 */
export const healthcareValidators = {
  phi: phiValidator,
};

// ============================================================================
// ASYNC VALIDATORS FOR DATABASE CHECKS
// ============================================================================

/**
 * Create a unique threat ID validator (async database check)
 */
export function createUniqueThreatIdValidator(threatRepository: any) {
  return createAsyncValidator(async (value: string) => {
    const existing = await threatRepository.findByPk(value);
    return !existing;
  }, 'Threat ID already exists');
}

/**
 * Create a related threat exists validator (async database check)
 */
export function createRelatedThreatExistsValidator(threatRepository: any) {
  return createAsyncValidator(async (value: string) => {
    const threat = await threatRepository.findByPk(value);
    return !!threat;
  }, 'Referenced threat does not exist');
}
