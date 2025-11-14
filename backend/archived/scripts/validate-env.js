#!/usr/bin/env node
/**
 * Environment Variable Validation Script
 *
 * SECURITY CRITICAL: Validates required environment variables before deployment
 *
 * Usage:
 *   node scripts/validate-env.js
 *   npm run validate:env
 *
 * Features:
 * - Validates all required environment variables are set
 * - Checks secret strength (minimum length, complexity)
 * - Detects weak or development-only secrets in production
 * - Validates configuration values (port ranges, boolean flags, etc.)
 * - Provides actionable error messages for missing/weak configurations
 *
 * Exit Codes:
 * - 0: All validations passed
 * - 1: Critical validation failures (deployment should be blocked)
 * - 2: Warnings (deployment allowed but not recommended)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const errors = [];
const warnings = [];
const passed = [];

// Load environment variables
require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

console.log(`${colors.cyan}${colors.bold}Environment Variable Validation${colors.reset}`);
console.log(`${colors.cyan}Environment: ${NODE_ENV}${colors.reset}\n`);

/**
 * Validation helper functions
 */

function checkRequired(varName, description) {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    errors.push(`${varName} is required but not set. ${description}`);
    return false;
  }
  passed.push(`${varName} is set`);
  return true;
}

function checkMinLength(varName, minLength, description) {
  const value = process.env[varName];
  if (!value) return false;

  if (value.length < minLength) {
    errors.push(
      `${varName} is too short (${value.length} chars). ` +
      `Minimum ${minLength} characters required. ${description}`
    );
    return false;
  }
  passed.push(`${varName} meets minimum length requirement (${minLength} chars)`);
  return true;
}

function checkSecretStrength(varName, minEntropy = 128) {
  const value = process.env[varName];
  if (!value) return false;

  // Calculate entropy (bits)
  const entropy = value.length * Math.log2(256); // Assuming 8-bit characters

  if (entropy < minEntropy) {
    warnings.push(
      `${varName} has low entropy (${entropy.toFixed(0)} bits). ` +
      `Recommended: ${minEntropy}+ bits for production.`
    );
    return false;
  }

  // Check for common weak patterns
  const weakPatterns = [
    'secret',
    'password',
    'admin',
    '123456',
    'qwerty',
    'development',
    'test',
    'changeme',
    'placeholder',
    'your-',
    'minimum-32-chars',
  ];

  const lowerValue = value.toLowerCase();
  const foundWeakPattern = weakPatterns.find(pattern => lowerValue.includes(pattern));

  if (foundWeakPattern) {
    if (isProduction) {
      errors.push(
        `${varName} contains weak pattern "${foundWeakPattern}". ` +
        `This is NOT allowed in production. Generate a strong random secret.`
      );
      return false;
    } else {
      warnings.push(
        `${varName} contains weak pattern "${foundWeakPattern}". ` +
        `OK for development, but must be changed for production.`
      );
    }
  }

  passed.push(`${varName} has sufficient entropy (${entropy.toFixed(0)} bits)`);
  return true;
}

function checkNumericRange(varName, min, max, description) {
  const value = process.env[varName];
  if (!value) return false;

  const num = parseInt(value, 10);

  if (isNaN(num)) {
    errors.push(`${varName} must be a number. ${description}`);
    return false;
  }

  if (num < min || num > max) {
    errors.push(
      `${varName} is ${num}, which is outside the valid range [${min}, ${max}]. ${description}`
    );
    return false;
  }

  passed.push(`${varName} is within valid range (${min}-${max})`);
  return true;
}

function checkBoolean(varName, description) {
  const value = process.env[varName];
  if (!value) return true; // Optional boolean

  const validValues = ['true', 'false', '1', '0', 'yes', 'no'];
  if (!validValues.includes(value.toLowerCase())) {
    errors.push(
      `${varName} must be a boolean value (true/false). ${description}`
    );
    return false;
  }

  passed.push(`${varName} is a valid boolean`);
  return true;
}

function checkDatabaseSSL(varName) {
  const value = process.env[varName];
  if (!value) return;

  if (isProduction && value.toLowerCase() !== 'true') {
    errors.push(
      `${varName} must be 'true' in production. ` +
      `Database connections MUST use SSL/TLS in production environments.`
    );
  } else {
    passed.push(`${varName} is properly configured for ${NODE_ENV}`);
  }
}

/**
 * Validation Rules
 */

console.log(`${colors.bold}1. Application Configuration${colors.reset}`);
checkRequired('NODE_ENV', 'Must be set to development, staging, or production');
checkNumericRange('PORT', 1024, 65535, 'Application port must be between 1024-65535');

console.log(`\n${colors.bold}2. Database Configuration${colors.reset}`);
checkRequired('DB_HOST', 'Database host is required');
checkRequired('DB_PORT', 'Database port is required');
checkNumericRange('DB_PORT', 1, 65535, 'Database port must be between 1-65535');
checkRequired('DB_USERNAME', 'Database username is required');
checkRequired('DB_PASSWORD', 'Database password is required');
checkMinLength('DB_PASSWORD', 12, 'Use a strong database password (12+ characters)');
checkRequired('DB_NAME', 'Database name is required');
checkDatabaseSSL('DB_SSL');

console.log(`\n${colors.bold}3. JWT & Authentication Secrets${colors.reset}`);
checkRequired('JWT_SECRET', 'JWT secret is required for token signing');
checkMinLength('JWT_SECRET', 32, 'JWT secret must be at least 32 characters');
checkSecretStrength('JWT_SECRET', 256);

checkRequired('JWT_REFRESH_SECRET', 'JWT refresh secret is required');
checkMinLength('JWT_REFRESH_SECRET', 32, 'JWT refresh secret must be at least 32 characters');
checkSecretStrength('JWT_REFRESH_SECRET', 256);

// Check that JWT secrets are different
if (process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET) {
  errors.push(
    'JWT_SECRET and JWT_REFRESH_SECRET must be different. ' +
    'Using the same secret reduces security.'
  );
}

console.log(`\n${colors.bold}4. Security Configuration${colors.reset}`);
checkRequired('CSRF_SECRET', 'CSRF secret is required for CSRF protection');
checkMinLength('CSRF_SECRET', 32, 'CSRF secret must be at least 32 characters');
checkSecretStrength('CSRF_SECRET', 256);

checkRequired('CONFIG_ENCRYPTION_KEY', 'Encryption key is required for config encryption');
checkMinLength('CONFIG_ENCRYPTION_KEY', 32, 'Encryption key must be at least 32 characters');
checkSecretStrength('CONFIG_ENCRYPTION_KEY', 256);

checkNumericRange('BCRYPT_SALT_ROUNDS', 10, 14, 'bcrypt rounds: 10=fast, 12=balanced, 14=secure');

console.log(`\n${colors.bold}5. Redis Configuration${colors.reset}`);
if (process.env.REDIS_HOST) {
  checkRequired('REDIS_PORT', 'Redis port is required when REDIS_HOST is set');
  checkRequired('REDIS_PASSWORD', 'Redis password is required for security');
  checkMinLength('REDIS_PASSWORD', 16, 'Use a strong Redis password (16+ characters)');
}

console.log(`\n${colors.bold}6. AWS Configuration (if used)${colors.reset}`);
if (process.env.AWS_ACCESS_KEY_ID) {
  checkRequired('AWS_SECRET_ACCESS_KEY', 'AWS secret key is required when using AWS');
  checkMinLength('AWS_SECRET_ACCESS_KEY', 32, 'AWS secret must be at least 32 characters');
  checkSecretStrength('AWS_SECRET_ACCESS_KEY', 256);
}

console.log(`\n${colors.bold}7. CORS & Networking${colors.reset}`);
if (isProduction) {
  checkRequired('CORS_ORIGIN', 'CORS origin must be explicitly set in production');
  if (process.env.CORS_ORIGIN === '*') {
    errors.push(
      'CORS_ORIGIN cannot be "*" in production. ' +
      'Specify exact origins for security (e.g., https://app.example.com)'
    );
  }
}

console.log(`\n${colors.bold}8. Feature Flags & Optional Configuration${colors.reset}`);
checkBoolean('DB_SYNC', 'DB_SYNC should be true/false');
checkBoolean('DB_LOGGING', 'DB_LOGGING should be true/false');
checkBoolean('KEY_ROTATION_ENABLED', 'KEY_ROTATION_ENABLED should be true/false');

/**
 * Display Results
 */

console.log(`\n${colors.bold}═══════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bold}Validation Results${colors.reset}`);
console.log(`${colors.bold}═══════════════════════════════════════════════════${colors.reset}\n`);

if (passed.length > 0) {
  console.log(`${colors.green}${colors.bold}✓ Passed (${passed.length})${colors.reset}`);
  passed.slice(0, 5).forEach(msg => console.log(`  ${colors.green}✓${colors.reset} ${msg}`));
  if (passed.length > 5) {
    console.log(`  ${colors.green}... and ${passed.length - 5} more${colors.reset}`);
  }
  console.log('');
}

if (warnings.length > 0) {
  console.log(`${colors.yellow}${colors.bold}⚠ Warnings (${warnings.length})${colors.reset}`);
  warnings.forEach(msg => console.log(`  ${colors.yellow}⚠${colors.reset} ${msg}`));
  console.log('');
}

if (errors.length > 0) {
  console.log(`${colors.red}${colors.bold}✗ Errors (${errors.length})${colors.reset}`);
  errors.forEach(msg => console.log(`  ${colors.red}✗${colors.reset} ${msg}`));
  console.log('');
}

console.log(`${colors.bold}═══════════════════════════════════════════════════${colors.reset}\n`);

/**
 * Generate Strong Secrets Helper
 */

if (errors.length > 0 || warnings.length > 0) {
  console.log(`${colors.cyan}${colors.bold}How to Generate Strong Secrets:${colors.reset}\n`);
  console.log(`  ${colors.cyan}# Generate 256-bit (32-byte) random secret${colors.reset}`);
  console.log(`  openssl rand -base64 32\n`);
  console.log(`  ${colors.cyan}# Or using Node.js${colors.reset}`);
  console.log(`  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"\n`);
  console.log(`  ${colors.cyan}# Or using this script${colors.reset}`);
  console.log(`  node scripts/generate-secrets.js\n`);
}

/**
 * Exit with appropriate code
 */

if (errors.length > 0) {
  console.log(`${colors.red}${colors.bold}Validation FAILED with ${errors.length} error(s)${colors.reset}`);
  console.log(`${colors.red}Deployment should be BLOCKED until errors are fixed.${colors.reset}\n`);
  process.exit(1);
} else if (warnings.length > 0) {
  console.log(`${colors.yellow}${colors.bold}Validation passed with ${warnings.length} warning(s)${colors.reset}`);
  console.log(`${colors.yellow}Deployment allowed but not recommended for production.${colors.reset}\n`);
  process.exit(2);
} else {
  console.log(`${colors.green}${colors.bold}✓ All validations passed!${colors.reset}`);
  console.log(`${colors.green}Environment is properly configured.${colors.reset}\n`);
  process.exit(0);
}
