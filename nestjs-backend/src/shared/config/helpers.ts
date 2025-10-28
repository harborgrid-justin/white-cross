/**
 * LOC: E945A8D71C
 * WC-GEN-305 | helpers.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-305 | helpers.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: crypto
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, functions | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Configuration management utilities
 * 
 * Provides utilities for safe configuration retrieval, validation,
 * and encryption of sensitive configuration values.
 */

import * as crypto from 'crypto';

export interface ConfigValidationSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: any[];
  properties?: Record<string, ConfigValidationSchema>;
}

export interface ConfigurationError {
  key: string;
  value: any;
  error: string;
  severity: 'error' | 'warning';
}

// Configuration cache
const configCache = new Map<string, { value: any; timestamp: number; ttl: number }>();

// Encryption key for sensitive configuration
const ENCRYPTION_KEY = process.env.CONFIG_ENCRYPTION_KEY || 'default-key-change-in-production';

/**
 * Get configuration value with fallback
 * 
 * @param key - Configuration key (supports dot notation)
 * @param defaultValue - Default value if key is not found
 * @param useCache - Whether to use caching (default: true)
 * @param cacheTTL - Cache TTL in milliseconds (default: 5 minutes)
 * @returns Configuration value or default
 */
export function getConfigWithFallback(
  key: string, 
  defaultValue: any = null,
  useCache: boolean = true,
  cacheTTL: number = 5 * 60 * 1000
): any {
  if (!key || typeof key !== 'string') {
    return defaultValue;
  }

  // Check cache first
  if (useCache && configCache.has(key)) {
    const cached = configCache.get(key)!;
    if (Date.now() - cached.timestamp < cached.ttl) {
      return cached.value;
    }
    configCache.delete(key);
  }

  let value = defaultValue;

  try {
    // Check environment variables first
    const envKey = key.toUpperCase().replace(/\./g, '_');
    if (process.env[envKey] !== undefined) {
      value = parseEnvironmentValue(process.env[envKey]!);
    } else {
      // Check nested configuration objects (if available)
      value = getNestedValue(process.env, key) || defaultValue;
    }

    // Cache the result
    if (useCache) {
      configCache.set(key, {
        value,
        timestamp: Date.now(),
        ttl: cacheTTL
      });
    }

  } catch (error) {
    console.warn(`Error retrieving configuration for key '${key}':`, error);
    value = defaultValue;
  }

  return value;
}

/**
 * Validate configuration value against schema
 * 
 * @param key - Configuration key
 * @param value - Value to validate
 * @param schema - Validation schema
 * @returns boolean indicating if value is valid
 */
export function validateConfigurationValue(key: string, value: any, schema: ConfigValidationSchema): boolean {
  const errors = validateValue(key, value, schema);
  
  if (errors.length > 0) {
    console.warn(`Configuration validation errors for '${key}':`, errors);
    return false;
  }
  
  return true;
}

/**
 * Encrypt sensitive configuration value
 * 
 * @param value - Value to encrypt
 * @param algorithm - Encryption algorithm (default: aes-256-gcm)
 * @returns Encrypted string with format: algorithm:iv:authTag:encrypted
 */
export function encryptSensitiveConfig(value: string, algorithm: string = 'aes-256-gcm'): string {
  if (!value || typeof value !== 'string') {
    throw new Error('Value must be a non-empty string');
  }

  try {
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // For GCM mode, get the auth tag
    const authTag = algorithm.includes('gcm') ? (cipher as any).getAuthTag() : null;
    
    // Format: algorithm:iv:authTag:encrypted
    const parts = [
      algorithm,
      iv.toString('hex'),
      authTag ? authTag.toString('hex') : '',
      encrypted
    ].join(':');
    
    return parts;
  } catch (error) {
    throw new Error(`Failed to encrypt configuration value: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Decrypt sensitive configuration value
 * 
 * @param encryptedValue - Encrypted string from encryptSensitiveConfig
 * @returns Decrypted string
 */
export function decryptSensitiveConfig(encryptedValue: string): string {
  if (!encryptedValue || typeof encryptedValue !== 'string') {
    throw new Error('Encrypted value must be a non-empty string');
  }

  try {
    const parts = encryptedValue.split(':');
    if (parts.length < 3) {
      throw new Error('Invalid encrypted value format');
    }

    const [algorithm, ivHex, authTagHex, encrypted] = parts;
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const iv = Buffer.from(ivHex, 'hex');
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    
    // Set auth tag for GCM mode
    if (algorithm.includes('gcm') && authTagHex) {
      const authTag = Buffer.from(authTagHex, 'hex');
      (decipher as any).setAuthTag(authTag);
    }
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error(`Failed to decrypt configuration value: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get all configuration with validation
 * 
 * @param schema - Configuration schema for validation
 * @returns Object with configuration values and validation errors
 */
export function getAllConfigWithValidation(schema: Record<string, ConfigValidationSchema>): {
  config: Record<string, any>;
  errors: ConfigurationError[];
} {
  const config: Record<string, any> = {};
  const errors: ConfigurationError[] = [];

  for (const [key, keySchema] of Object.entries(schema)) {
    const value = getConfigWithFallback(key);
    config[key] = value;

    // Validate the value
    const validationErrors = validateValue(key, value, keySchema);
    errors.push(...validationErrors);
  }

  return { config, errors };
}

/**
 * Clear configuration cache
 * 
 * @param key - Specific key to clear (optional, clears all if not provided)
 */
export function clearConfigCache(key?: string): void {
  if (key) {
    configCache.delete(key);
  } else {
    configCache.clear();
  }
}

/**
 * Get configuration statistics
 * 
 * @returns Object with cache statistics
 */
export function getConfigStats(): {
  cacheSize: number;
  cachedKeys: string[];
  memoryUsage: number;
} {
  const cachedKeys = Array.from(configCache.keys());
  const memoryUsage = JSON.stringify(Array.from(configCache.entries())).length;

  return {
    cacheSize: configCache.size,
    cachedKeys,
    memoryUsage
  };
}

// Helper functions

/**
 * Parse environment variable value with type inference
 */
function parseEnvironmentValue(value: string): any {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (value === 'undefined') return undefined;
  
  // Try to parse as number
  if (/^-?\d+$/.test(value)) {
    return parseInt(value, 10);
  }
  
  if (/^-?\d*\.\d+$/.test(value)) {
    return parseFloat(value);
  }
  
  // Try to parse as JSON
  if ((value.startsWith('{') && value.endsWith('}')) || 
      (value.startsWith('[') && value.endsWith(']'))) {
    try {
      return JSON.parse(value);
    } catch {
      // Fall through to return as string
    }
  }
  
  return value;
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Validate a value against a schema
 */
function validateValue(key: string, value: any, schema: ConfigValidationSchema): ConfigurationError[] {
  const errors: ConfigurationError[] = [];

  // Check if required
  if (schema.required && (value === null || value === undefined)) {
    errors.push({
      key,
      value,
      error: 'Required configuration value is missing',
      severity: 'error'
    });
    return errors;
  }

  // Skip validation if value is null/undefined and not required
  if (value === null || value === undefined) {
    return errors;
  }

  // Type validation
  const actualType = Array.isArray(value) ? 'array' : typeof value;
  if (actualType !== schema.type) {
    errors.push({
      key,
      value,
      error: `Expected type '${schema.type}' but got '${actualType}'`,
      severity: 'error'
    });
    return errors;
  }

  // String validations
  if (schema.type === 'string' && typeof value === 'string') {
    if (schema.minLength && value.length < schema.minLength) {
      errors.push({
        key,
        value,
        error: `String length ${value.length} is less than minimum ${schema.minLength}`,
        severity: 'error'
      });
    }

    if (schema.maxLength && value.length > schema.maxLength) {
      errors.push({
        key,
        value,
        error: `String length ${value.length} exceeds maximum ${schema.maxLength}`,
        severity: 'error'
      });
    }

    if (schema.pattern && !schema.pattern.test(value)) {
      errors.push({
        key,
        value,
        error: `String does not match required pattern`,
        severity: 'error'
      });
    }
  }

  // Number validations
  if (schema.type === 'number' && typeof value === 'number') {
    if (schema.min !== undefined && value < schema.min) {
      errors.push({
        key,
        value,
        error: `Number ${value} is less than minimum ${schema.min}`,
        severity: 'error'
      });
    }

    if (schema.max !== undefined && value > schema.max) {
      errors.push({
        key,
        value,
        error: `Number ${value} exceeds maximum ${schema.max}`,
        severity: 'error'
      });
    }
  }

  // Enum validation
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push({
      key,
      value,
      error: `Value '${value}' is not in allowed enum values: ${schema.enum.join(', ')}`,
      severity: 'error'
    });
  }

  // Object validation
  if (schema.type === 'object' && schema.properties && typeof value === 'object') {
    for (const [propKey, propSchema] of Object.entries(schema.properties)) {
      const propValue = value[propKey];
      const propErrors = validateValue(`${key}.${propKey}`, propValue, propSchema);
      errors.push(...propErrors);
    }
  }

  return errors;
}