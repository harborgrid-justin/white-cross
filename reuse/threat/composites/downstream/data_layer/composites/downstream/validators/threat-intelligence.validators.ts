/**
 * Threat Intelligence Validation Decorators
 *
 * Specialized validation decorators for threat intelligence data types.
 * Validates indicators of compromise (IoCs), MITRE ATT&CK techniques,
 * CVE identifiers, threat severity levels, and other threat-specific data.
 *
 * Decorators:
 * - @IsThreatName() - Threat naming conventions
 * - @IsIoC() - Indicators of Compromise (IP, domain, hash, email)
 * - @IsMitreTechnique() - MITRE ATT&CK technique IDs
 * - @IsThreatSeverity() - Severity levels (LOW, MEDIUM, HIGH, CRITICAL)
 * - @IsThreatType() - Threat types (MALWARE, PHISHING, etc.)
 * - @IsCVE() - CVE identifiers
 * - @IsCWE() - CWE identifiers
 * - @IsIPAddress() - IP validation (v4/v6)
 * - @IsDomain() - Domain name validation
 * - @IsFileHash() - Hash validation (MD5/SHA1/SHA256/SHA512)
 * - @IsThreatConfidence() - Confidence score 0-100
 * - @IsAttackVector() - Attack vector types
 *
 * @module validators/threat-intelligence
 * @version 1.0.0
 */

import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  IsEnum,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

// ============================================================================
// Enums and Constants
// ============================================================================

/**
 * Threat severity levels
 */
export enum ThreatSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Threat types
 */
export enum ThreatType {
  MALWARE = 'MALWARE',
  PHISHING = 'PHISHING',
  RANSOMWARE = 'RANSOMWARE',
  APT = 'APT',
  BOTNET = 'BOTNET',
  TROJAN = 'TROJAN',
  WORM = 'WORM',
  SPYWARE = 'SPYWARE',
  ADWARE = 'ADWARE',
  ROOTKIT = 'ROOTKIT',
  EXPLOIT = 'EXPLOIT',
  BACKDOOR = 'BACKDOOR',
  DDoS = 'DDoS',
  BRUTE_FORCE = 'BRUTE_FORCE',
  SQL_INJECTION = 'SQL_INJECTION',
  XSS = 'XSS',
  ZERO_DAY = 'ZERO_DAY',
  INSIDER_THREAT = 'INSIDER_THREAT',
  DATA_BREACH = 'DATA_BREACH',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Attack vector types (CVSS-aligned)
 */
export enum AttackVector {
  NETWORK = 'NETWORK',
  ADJACENT = 'ADJACENT',
  LOCAL = 'LOCAL',
  PHYSICAL = 'PHYSICAL',
}

/**
 * IoC types
 */
export enum IoCType {
  IP = 'IP',
  DOMAIN = 'DOMAIN',
  URL = 'URL',
  EMAIL = 'EMAIL',
  FILE_HASH = 'FILE_HASH',
  FILE_NAME = 'FILE_NAME',
  REGISTRY_KEY = 'REGISTRY_KEY',
  MUTEX = 'MUTEX',
}

// ============================================================================
// Custom Validators
// ============================================================================

/**
 * Validates threat names (3-200 characters, alphanumeric + common punctuation)
 */
@ValidatorConstraint({ name: 'isThreatName', async: false })
export class IsThreatNameConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    if (value.length < 3 || value.length > 200) return false;

    // Allow alphanumeric, spaces, hyphens, underscores, dots, parentheses
    const threatNamePattern = /^[a-zA-Z0-9\s\-_.()]+$/;
    return threatNamePattern.test(value);
  }

  defaultMessage(): string {
    return 'Threat name must be 3-200 characters and contain only letters, numbers, spaces, hyphens, underscores, dots, and parentheses';
  }
}

/**
 * Validates MITRE ATT&CK technique IDs (T1234 or T1234.001 format)
 */
@ValidatorConstraint({ name: 'isMitreTechnique', async: false })
export class IsMitreTechniqueConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    // Format: T followed by 4 digits, optionally followed by .001-.999
    const mitrePattern = /^T\d{4}(\.\d{3})?$/;
    return mitrePattern.test(value);
  }

  defaultMessage(): string {
    return 'MITRE ATT&CK technique must be in format T1234 or T1234.001';
  }
}

/**
 * Validates CVE identifiers (CVE-YYYY-NNNNN format)
 */
@ValidatorConstraint({ name: 'isCVE', async: false })
export class IsCVEConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    // Format: CVE-YYYY-NNNNN+ (year 1999-2099, at least 4 digits)
    const cvePattern = /^CVE-(19\d{2}|20\d{2})-\d{4,}$/;
    return cvePattern.test(value);
  }

  defaultMessage(): string {
    return 'CVE identifier must be in format CVE-YYYY-NNNNN (e.g., CVE-2024-12345)';
  }
}

/**
 * Validates CWE identifiers (CWE-NNN format)
 */
@ValidatorConstraint({ name: 'isCWE', async: false })
export class IsCWEConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    // Format: CWE-NNN (1-4 digits)
    const cwePattern = /^CWE-\d{1,4}$/;
    return cwePattern.test(value);
  }

  defaultMessage(): string {
    return 'CWE identifier must be in format CWE-NNN (e.g., CWE-79)';
  }
}

/**
 * Validates IP addresses (IPv4 and IPv6)
 */
@ValidatorConstraint({ name: 'isIPAddress', async: false })
export class IsIPAddressConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    // IPv4 pattern
    const ipv4Pattern =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // IPv6 pattern (simplified)
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    return ipv4Pattern.test(value) || ipv6Pattern.test(value);
  }

  defaultMessage(): string {
    return 'Must be a valid IPv4 or IPv6 address';
  }
}

/**
 * Validates domain names
 */
@ValidatorConstraint({ name: 'isDomain', async: false })
export class IsDomainConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    // Domain pattern (simplified - doesn't validate TLDs)
    const domainPattern =
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

    return domainPattern.test(value);
  }

  defaultMessage(): string {
    return 'Must be a valid domain name (e.g., example.com)';
  }
}

/**
 * Validates file hashes (MD5, SHA1, SHA256, SHA512)
 */
@ValidatorConstraint({ name: 'isFileHash', async: false })
export class IsFileHashConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    const lowerValue = value.toLowerCase();

    // MD5: 32 hex characters
    const md5Pattern = /^[a-f0-9]{32}$/;
    // SHA1: 40 hex characters
    const sha1Pattern = /^[a-f0-9]{40}$/;
    // SHA256: 64 hex characters
    const sha256Pattern = /^[a-f0-9]{64}$/;
    // SHA512: 128 hex characters
    const sha512Pattern = /^[a-f0-9]{128}$/;

    return (
      md5Pattern.test(lowerValue) ||
      sha1Pattern.test(lowerValue) ||
      sha256Pattern.test(lowerValue) ||
      sha512Pattern.test(lowerValue)
    );
  }

  defaultMessage(): string {
    return 'Must be a valid file hash (MD5, SHA1, SHA256, or SHA512)';
  }
}

/**
 * Validates IoC (Indicator of Compromise) values
 */
@ValidatorConstraint({ name: 'isIoC', async: false })
export class IsIoCConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    // Check if it's an IP address
    const ipValidator = new IsIPAddressConstraint();
    if (ipValidator.validate(value)) return true;

    // Check if it's a domain
    const domainValidator = new IsDomainConstraint();
    if (domainValidator.validate(value)) return true;

    // Check if it's a file hash
    const hashValidator = new IsFileHashConstraint();
    if (hashValidator.validate(value)) return true;

    // Check if it's an email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(value)) return true;

    // Check if it's a URL
    try {
      new URL(value);
      return true;
    } catch {
      // Not a valid URL
    }

    return false;
  }

  defaultMessage(): string {
    return 'Must be a valid Indicator of Compromise (IP address, domain, email, hash, or URL)';
  }
}

// ============================================================================
// Decorator Functions
// ============================================================================

/**
 * Validates threat name (3-200 characters)
 *
 * @example
 * ```typescript
 * class ThreatDto {
 *   @IsThreatName()
 *   name: string;
 * }
 * ```
 */
export function IsThreatName(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsThreatNameConstraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'Threat name (3-200 characters)',
      example: 'WannaCry Ransomware',
      minLength: 3,
      maxLength: 200,
      pattern: '^[a-zA-Z0-9\\s\\-_.()]+$',
    }),
  );
}

/**
 * Validates MITRE ATT&CK technique ID
 *
 * @example
 * ```typescript
 * class ThreatDto {
 *   @IsMitreTechnique()
 *   technique: string;
 * }
 * ```
 */
export function IsMitreTechnique(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsMitreTechniqueConstraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'MITRE ATT&CK technique ID',
      example: 'T1059.001',
      pattern: '^T\\d{4}(\\.\\d{3})?$',
    }),
  );
}

/**
 * Validates threat severity level
 *
 * @example
 * ```typescript
 * class ThreatDto {
 *   @IsThreatSeverity()
 *   severity: ThreatSeverity;
 * }
 * ```
 */
export function IsThreatSeverity(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    IsEnum(ThreatSeverity, {
      message: 'Threat severity must be LOW, MEDIUM, HIGH, or CRITICAL',
      ...validationOptions,
    }),
    ApiProperty({
      enum: ThreatSeverity,
      description: 'Threat severity level',
      example: ThreatSeverity.HIGH,
    }),
  );
}

/**
 * Validates threat type
 *
 * @example
 * ```typescript
 * class ThreatDto {
 *   @IsThreatType()
 *   type: ThreatType;
 * }
 * ```
 */
export function IsThreatType(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    IsEnum(ThreatType, {
      message: `Threat type must be one of: ${Object.values(ThreatType).join(', ')}`,
      ...validationOptions,
    }),
    ApiProperty({
      enum: ThreatType,
      description: 'Threat category/type',
      example: ThreatType.RANSOMWARE,
    }),
  );
}

/**
 * Validates CVE identifier
 *
 * @example
 * ```typescript
 * class VulnerabilityDto {
 *   @IsCVE()
 *   cveId: string;
 * }
 * ```
 */
export function IsCVE(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsCVEConstraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'CVE identifier',
      example: 'CVE-2024-12345',
      pattern: '^CVE-(19\\d{2}|20\\d{2})-\\d{4,}$',
    }),
  );
}

/**
 * Validates CWE identifier
 *
 * @example
 * ```typescript
 * class VulnerabilityDto {
 *   @IsCWE()
 *   cweId: string;
 * }
 * ```
 */
export function IsCWE(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsCWEConstraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'CWE identifier',
      example: 'CWE-79',
      pattern: '^CWE-\\d{1,4}$',
    }),
  );
}

/**
 * Validates IP address (IPv4 or IPv6)
 *
 * @example
 * ```typescript
 * class IoCDto {
 *   @IsIPAddress()
 *   ipAddress: string;
 * }
 * ```
 */
export function IsIPAddressField(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsIPAddressConstraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'IP address (IPv4 or IPv6)',
      example: '192.168.1.1',
      format: 'ip',
    }),
  );
}

/**
 * Validates domain name
 *
 * @example
 * ```typescript
 * class IoCDto {
 *   @IsDomainField()
 *   domain: string;
 * }
 * ```
 */
export function IsDomainField(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsDomainConstraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'Domain name',
      example: 'malicious-site.com',
      format: 'hostname',
    }),
  );
}

/**
 * Validates file hash (MD5, SHA1, SHA256, SHA512)
 *
 * @example
 * ```typescript
 * class IoCDto {
 *   @IsFileHash()
 *   hash: string;
 * }
 * ```
 */
export function IsFileHash(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsFileHashConstraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'File hash (MD5, SHA1, SHA256, or SHA512)',
      example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    }),
  );
}

/**
 * Validates Indicator of Compromise (IoC)
 *
 * @example
 * ```typescript
 * class IoCDto {
 *   @IsIoC()
 *   value: string;
 * }
 * ```
 */
export function IsIoC(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsIoCConstraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'Indicator of Compromise (IP, domain, email, hash, or URL)',
      example: '192.168.1.1',
    }),
  );
}

/**
 * Validates threat confidence score (0-100)
 *
 * @example
 * ```typescript
 * class ThreatDto {
 *   @IsThreatConfidence()
 *   confidence: number;
 * }
 * ```
 */
export function IsThreatConfidence(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    IsInt({ message: 'Confidence must be an integer', ...validationOptions }),
    Min(0, { message: 'Confidence must be at least 0' }),
    Max(100, { message: 'Confidence must be at most 100' }),
    ApiProperty({
      type: Number,
      description: 'Threat confidence score (0-100)',
      example: 85,
      minimum: 0,
      maximum: 100,
    }),
  );
}

/**
 * Validates attack vector type
 *
 * @example
 * ```typescript
 * class ThreatDto {
 *   @IsAttackVector()
 *   attackVector: AttackVector;
 * }
 * ```
 */
export function IsAttackVector(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    IsEnum(AttackVector, {
      message: 'Attack vector must be NETWORK, ADJACENT, LOCAL, or PHYSICAL',
      ...validationOptions,
    }),
    ApiProperty({
      enum: AttackVector,
      description: 'Attack vector type (CVSS-aligned)',
      example: AttackVector.NETWORK,
    }),
  );
}
