"use strict";
/**
 * LOC: ENV9J0K1F4
 * File: /reuse/environment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Configuration modules
 *   - Application bootstrap
 *   - Environment-specific configs
 *   - Feature flag services
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEnvironment = exports.auditEnvironmentSecurity = exports.generateEnvTemplate = exports.loadEnvironmentFiles = exports.buildEnvSpecificConfig = exports.mergeEnvFiles = exports.writeEnvFile = exports.expandEnvVariables = exports.loadEnvFile = exports.parseEnvFile = exports.createEnvironmentGuard = exports.getEnvironmentValue = exports.isEnvironment = exports.normalizeEnvironmentType = exports.detectEnvironment = exports.EnvironmentType = void 0;
/**
 * File: /reuse/environment-kit.ts
 * Locator: WC-UTL-ENV-001
 * Purpose: Comprehensive NestJS Environment Management Toolkit - Environment utilities and helpers
 *
 * Upstream: Independent utility module for NestJS environment operations
 * Downstream: ../backend/*, Config modules, Bootstrap files, Environment configs
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/config, dotenv, dotenv-expand
 * Exports: 45 utility functions for environment detection, .env parsing, multi-env support, feature flags
 *
 * LLM Context: Enterprise-grade environment utilities for White Cross healthcare platform.
 * Provides environment detection, .env file parsing, environment-specific config building,
 * feature flag management, environment variable validation, multi-environment support,
 * environment override utilities, inheritance patterns, migration helpers, sensitive data masking,
 * and HIPAA-compliant environment management.
 */
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Environment type enumeration
 */
var EnvironmentType;
(function (EnvironmentType) {
    EnvironmentType["Development"] = "development";
    EnvironmentType["Staging"] = "staging";
    EnvironmentType["Production"] = "production";
    EnvironmentType["Test"] = "test";
    EnvironmentType["Local"] = "local";
})(EnvironmentType || (exports.EnvironmentType = EnvironmentType = {}));
// ============================================================================
// 1. ENVIRONMENT DETECTION UTILITIES
// ============================================================================
/**
 * 1. Detects current environment with comprehensive information.
 *
 * @returns {EnvironmentInfo} Detailed environment information
 *
 * @example
 * ```typescript
 * const env = detectEnvironment();
 * if (env.isProduction) {
 *   console.log('Running in production mode');
 * }
 * ```
 */
const detectEnvironment = () => {
    const nodeEnv = (process.env.NODE_ENV || 'development').toLowerCase();
    const envType = (0, exports.normalizeEnvironmentType)(nodeEnv);
    return {
        type: envType,
        name: nodeEnv,
        nodeEnv,
        isProduction: envType === EnvironmentType.Production,
        isDevelopment: envType === EnvironmentType.Development,
        isStaging: envType === EnvironmentType.Staging,
        isTest: envType === EnvironmentType.Test,
        isLocal: envType === EnvironmentType.Local,
        metadata: {
            timestamp: Date.now(),
            platform: process.platform,
            nodeVersion: process.version,
        },
    };
};
exports.detectEnvironment = detectEnvironment;
/**
 * 2. Normalizes environment string to EnvironmentType.
 *
 * @param {string} env - Environment string
 * @returns {EnvironmentType} Normalized environment type
 *
 * @example
 * ```typescript
 * const type = normalizeEnvironmentType('prod'); // EnvironmentType.Production
 * ```
 */
const normalizeEnvironmentType = (env) => {
    const normalized = env.toLowerCase().trim();
    const mapping = {
        production: EnvironmentType.Production,
        prod: EnvironmentType.Production,
        staging: EnvironmentType.Staging,
        stage: EnvironmentType.Staging,
        development: EnvironmentType.Development,
        dev: EnvironmentType.Development,
        test: EnvironmentType.Test,
        testing: EnvironmentType.Test,
        local: EnvironmentType.Local,
    };
    return mapping[normalized] || EnvironmentType.Development;
};
exports.normalizeEnvironmentType = normalizeEnvironmentType;
/**
 * 3. Checks if current environment matches any of the specified types.
 *
 * @param {EnvironmentType[]} types - Environment types to check
 * @returns {boolean} True if current environment matches
 *
 * @example
 * ```typescript
 * if (isEnvironment([EnvironmentType.Development, EnvironmentType.Test])) {
 *   console.log('Debug mode enabled');
 * }
 * ```
 */
const isEnvironment = (types) => {
    const current = (0, exports.detectEnvironment)();
    return types.includes(current.type);
};
exports.isEnvironment = isEnvironment;
/**
 * 4. Gets environment-specific value from mapping.
 *
 * @template T
 * @param {Partial<Record<EnvironmentType, T>>} valueMap - Environment value map
 * @param {T} [defaultValue] - Default value
 * @returns {T} Environment-specific value
 *
 * @example
 * ```typescript
 * const logLevel = getEnvironmentValue({
 *   [EnvironmentType.Production]: 'error',
 *   [EnvironmentType.Development]: 'debug',
 * }, 'info');
 * ```
 */
const getEnvironmentValue = (valueMap, defaultValue) => {
    const env = (0, exports.detectEnvironment)();
    return valueMap[env.type] ?? defaultValue;
};
exports.getEnvironmentValue = getEnvironmentValue;
/**
 * 5. Creates environment guard function.
 *
 * @param {EnvironmentType[]} allowedEnvs - Allowed environments
 * @returns {() => void} Guard function that throws if environment not allowed
 *
 * @example
 * ```typescript
 * const guardProduction = createEnvironmentGuard([EnvironmentType.Production]);
 * guardProduction(); // Throws if not in production
 * ```
 */
const createEnvironmentGuard = (allowedEnvs) => {
    return () => {
        if (!(0, exports.isEnvironment)(allowedEnvs)) {
            throw new Error(`Operation not allowed in ${(0, exports.detectEnvironment)().name} environment`);
        }
    };
};
exports.createEnvironmentGuard = createEnvironmentGuard;
// ============================================================================
// 2. .ENV FILE PARSERS
// ============================================================================
/**
 * 6. Parses .env file content into key-value pairs.
 *
 * @param {string} content - .env file content
 * @param {object} [options] - Parse options
 * @returns {Record<string, string>} Parsed environment variables
 *
 * @example
 * ```typescript
 * const envVars = parseEnvFile(fs.readFileSync('.env', 'utf8'));
 * ```
 */
const parseEnvFile = (content, options) => {
    const opts = {
        override: false,
        comments: true,
        multiline: true,
        ...options,
    };
    const result = {};
    const lines = content.split('\n');
    let currentKey = null;
    let currentValue = '';
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        // Skip empty lines and comments
        if (!line || (opts.comments && line.startsWith('#'))) {
            continue;
        }
        // Handle multiline values
        if (opts.multiline && currentKey) {
            if (line.endsWith('"') && !line.endsWith('\\"')) {
                currentValue += '\n' + line.slice(0, -1);
                result[currentKey] = currentValue;
                currentKey = null;
                currentValue = '';
                continue;
            }
            else {
                currentValue += '\n' + line;
                continue;
            }
        }
        const separatorIndex = line.indexOf('=');
        if (separatorIndex === -1)
            continue;
        const key = line.substring(0, separatorIndex).trim();
        let value = line.substring(separatorIndex + 1).trim();
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        else if (opts.multiline && value.startsWith('"') && !value.endsWith('"')) {
            currentKey = key;
            currentValue = value.slice(1);
            continue;
        }
        // Unescape characters
        value = value
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'");
        result[key] = value;
    }
    return result;
};
exports.parseEnvFile = parseEnvFile;
/**
 * 7. Loads .env file from disk.
 *
 * @param {string} filePath - Path to .env file
 * @param {Partial<EnvFileConfig>} [options] - Load options
 * @returns {Record<string, string>} Loaded environment variables
 *
 * @example
 * ```typescript
 * const envVars = loadEnvFile('.env.local', { override: true });
 * ```
 */
const loadEnvFile = (filePath, options) => {
    const opts = {
        path: filePath,
        encoding: 'utf8',
        override: false,
        expand: true,
        validate: false,
        ...options,
    };
    try {
        const content = fs.readFileSync(opts.path, opts.encoding);
        const parsed = (0, exports.parseEnvFile)(content);
        // Expand variable references
        if (opts.expand) {
            return (0, exports.expandEnvVariables)(parsed);
        }
        return parsed;
    }
    catch (error) {
        console.warn(`Failed to load env file: ${opts.path}`);
        return {};
    }
};
exports.loadEnvFile = loadEnvFile;
/**
 * 8. Expands variable references like ${VAR_NAME} in env values.
 *
 * @param {Record<string, string>} env - Environment variables
 * @returns {Record<string, string>} Expanded environment variables
 *
 * @example
 * ```typescript
 * const expanded = expandEnvVariables({
 *   DB_HOST: 'localhost',
 *   DB_URL: 'postgres://${DB_HOST}:5432/mydb'
 * });
 * // Result: { DB_HOST: 'localhost', DB_URL: 'postgres://localhost:5432/mydb' }
 * ```
 */
const expandEnvVariables = (env) => {
    const expanded = { ...env };
    const regex = /\$\{([^}]+)\}/g;
    Object.entries(expanded).forEach(([key, value]) => {
        if (typeof value !== 'string')
            return;
        let expandedValue = value;
        let match;
        while ((match = regex.exec(value)) !== null) {
            const varName = match[1];
            const varValue = expanded[varName] || process.env[varName] || '';
            expandedValue = expandedValue.replace(match[0], varValue);
        }
        expanded[key] = expandedValue;
        regex.lastIndex = 0;
    });
    return expanded;
};
exports.expandEnvVariables = expandEnvVariables;
/**
 * 9. Writes environment variables to .env file.
 *
 * @param {string} filePath - Output file path
 * @param {Record<string, string>} env - Environment variables
 * @param {object} [options] - Write options
 *
 * @example
 * ```typescript
 * writeEnvFile('.env.local', {
 *   DATABASE_URL: 'postgres://localhost/mydb',
 *   PORT: '3000'
 * }, { comments: true });
 * ```
 */
const writeEnvFile = (filePath, env, options) => {
    const opts = {
        comments: {},
        sort: true,
        ...options,
    };
    let content = '# Environment Variables\n';
    content += `# Generated: ${new Date().toISOString()}\n\n`;
    const entries = Object.entries(env);
    if (opts.sort) {
        entries.sort(([a], [b]) => a.localeCompare(b));
    }
    entries.forEach(([key, value]) => {
        if (opts.comments[key]) {
            content += `# ${opts.comments[key]}\n`;
        }
        // Quote values with spaces or special characters
        const needsQuotes = /[\s#"'$]/.test(value);
        const quotedValue = needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value;
        content += `${key}=${quotedValue}\n\n`;
    });
    fs.writeFileSync(filePath, content, 'utf8');
};
exports.writeEnvFile = writeEnvFile;
/**
 * 10. Merges multiple .env files with priority.
 *
 * @param {string[]} filePaths - Array of .env file paths (lowest to highest priority)
 * @param {Partial<EnvFileConfig>} [options] - Load options
 * @returns {Record<string, string>} Merged environment variables
 *
 * @example
 * ```typescript
 * const env = mergeEnvFiles(['.env', '.env.local', '.env.development.local']);
 * ```
 */
const mergeEnvFiles = (filePaths, options) => {
    let merged = {};
    filePaths.forEach(filePath => {
        const loaded = (0, exports.loadEnvFile)(filePath, options);
        merged = { ...merged, ...loaded };
    });
    return merged;
};
exports.mergeEnvFiles = mergeEnvFiles;
// ============================================================================
// 3. ENVIRONMENT-SPECIFIC CONFIG BUILDERS
// ============================================================================
/**
 * 11. Creates environment-specific configuration object.
 *
 * @param {EnvironmentType} env - Environment type
 * @param {Record<string, any>} baseConfig - Base configuration
 * @param {Partial<Record<EnvironmentType, Record<string, any>>>} overrides - Environment overrides
 * @returns {Record<string, any>} Environment-specific configuration
 *
 * @example
 * ```typescript
 * const config = buildEnvSpecificConfig(
 *   EnvironmentType.Production,
 *   { port: 3000 },
 *   { [EnvironmentType.Production]: { port: 80 } }
 * );
 * ```
 */
const buildEnvSpecificConfig = (env, baseConfig, overrides) => {
    const envOverride = overrides[env] || {};
    return deepMerge(baseConfig, envOverride);
};
exports.buildEnvSpecificConfig = buildEnvSpecificConfig;
/**
 * 12. Loads environment-specific .env files automatically.
 *
 * @param {string} [env] - Environment name (defaults to NODE_ENV)
 * @param {string} [basePath] - Base directory path
 * @returns {Record<string, string>} Loaded environment variables
 *
 * @example
 * ```typescript
 * const env = loadEnvironmentFiles('production', './config');
 * // Loads: .env, .env.production, .env.production.local
 * ```
 */
const loadEnvironmentFiles = (env, basePath = process.cwd()) => {
    const environment = env || process.env.NODE_ENV || 'development';
    const filePaths = [
        path.join(basePath, '.env'),
        path.join(basePath, `.env.${environment}`),
        path.join(basePath, '.env.local'),
        path.join(basePath, `.env.${environment}.local`),
    ];
    return (0, exports.mergeEnvFiles)(filePaths);
};
exports.loadEnvironmentFiles = loadEnvironmentFiles;
    * ;
;
    * `` `
 */
export const createEnvCascade = (
  cascade: EnvironmentType[],
  configs: Record<EnvironmentType, Record<string, any>>
): Record<string, any> => {
  let result: Record<string, any> = {};

  cascade.forEach(env => {
    if (configs[env]) {
      result = deepMerge(result, configs[env]);
    }
  });

  return result;
};

/**
 * 14. Builds multi-tier environment configuration.
 *
 * @param {object} tiers - Configuration tiers
 * @returns {Record<string, any>} Final configuration
 *
 * @example
 * ` ``;
typescript
    * ;
const config = buildMultiTierConfig({
    : .env.PORT
});
    * ;
;
    * `` `
 */
export const buildMultiTierConfig = (tiers: {
  defaults?: Record<string, any>;
  environment?: Record<string, any>;
  runtime?: Record<string, any>;
  override?: Record<string, any>;
}): Record<string, any> => {
  return deepMerge(
    tiers.defaults || {},
    deepMerge(
      tiers.environment || {},
      deepMerge(
        tiers.runtime || {},
        tiers.override || {}
      )
    )
  );
};

/**
 * 15. Creates environment profile configuration.
 *
 * @param {string} profileName - Profile name
 * @param {Record<string, Record<string, any>>} profiles - Available profiles
 * @returns {Record<string, any>} Profile configuration
 *
 * @example
 * ` ``;
typescript
    * ;
const config = loadEnvironmentProfile('aws-production', {});
    * `` `
 */
export const loadEnvironmentProfile = (
  profileName: string,
  profiles: Record<string, Record<string, any>>
): Record<string, any> => {
  return profiles[profileName] || {};
};

// ============================================================================
// 4. FEATURE FLAG MANAGEMENT
// ============================================================================

/**
 * 16. Creates a feature flag with configuration.
 *
 * @param {string} name - Feature flag name
 * @param {boolean} enabled - Default enabled state
 * @param {Partial<FeatureFlag>} [options] - Additional options
 * @returns {FeatureFlag} Feature flag configuration
 *
 * @example
 * ` ``;
typescript
    * ;
const flag = createFeatureFlag('new-ui', true, {});
    * `` `
 */
export const createFeatureFlag = (
  name: string,
  enabled: boolean,
  options?: Partial<FeatureFlag>
): FeatureFlag => {
  return {
    name,
    enabled,
    environments: options?.environments,
    percentage: options?.percentage,
    users: options?.users,
    metadata: options?.metadata,
    startDate: options?.startDate,
    endDate: options?.endDate,
  };
};

/**
 * 17. Evaluates feature flag for current environment and user.
 *
 * @param {FeatureFlag} flag - Feature flag
 * @param {object} [context] - Evaluation context
 * @returns {boolean} True if feature is enabled
 *
 * @example
 * ` ``;
typescript
    * ;
const enabled = evaluateFeatureFlag(flag, {});
    * `` `
 */
export const evaluateFeatureFlag = (
  flag: FeatureFlag,
  context?: {
    userId?: string;
    environment?: EnvironmentType;
    timestamp?: Date;
  }
): boolean => {
  if (!flag.enabled) return false;

  const ctx = {
    environment: context?.environment || detectEnvironment().type,
    userId: context?.userId,
    timestamp: context?.timestamp || new Date(),
  };

  // Check environment restrictions
  if (flag.environments && !flag.environments.includes(ctx.environment)) {
    return false;
  }

  // Check date range
  if (flag.startDate && ctx.timestamp < flag.startDate) {
    return false;
  }
  if (flag.endDate && ctx.timestamp > flag.endDate) {
    return false;
  }

  // Check user whitelist
  if (flag.users && ctx.userId && !flag.users.includes(ctx.userId)) {
    return false;
  }

  // Check percentage rollout
  if (flag.percentage !== undefined && flag.percentage < 100) {
    const hash = ctx.userId
      ? hashString(`;
$;
{
    flag.name;
}
$;
{
    ctx.userId;
}
`)
      : Math.random();
    const normalizedHash = typeof hash === 'number' ? hash : parseInt(hash.slice(0, 8), 16) / 0xffffffff;
    return (normalizedHash * 100) < flag.percentage;
  }

  return true;
};

/**
 * 18. Creates feature flag manager.
 *
 * @param {FeatureFlag[]} flags - Array of feature flags
 * @returns {object} Feature flag manager
 *
 * @example
 * ` ``;
typescript
    * ;
const manager = createFeatureFlagManager([flag1, flag2]);
    * ;
if (manager.isEnabled('new-ui')) {
        *
    // Use new UI
        * ;
}
    * `` `
 */
export const createFeatureFlagManager = (flags: FeatureFlag[]) => {
  const flagMap = new Map(flags.map(flag => [flag.name, flag]));

  return {
    isEnabled: (name: string, context?: any): boolean => {
      const flag = flagMap.get(name);
      return flag ? evaluateFeatureFlag(flag, context) : false;
    },

    getFlag: (name: string): FeatureFlag | undefined => {
      return flagMap.get(name);
    },

    addFlag: (flag: FeatureFlag): void => {
      flagMap.set(flag.name, flag);
    },

    removeFlag: (name: string): boolean => {
      return flagMap.delete(name);
    },

    getAllFlags: (): FeatureFlag[] => {
      return Array.from(flagMap.values());
    },

    getEnabledFlags: (context?: any): string[] => {
      return Array.from(flagMap.values())
        .filter(flag => evaluateFeatureFlag(flag, context))
        .map(flag => flag.name);
    },
  };
};

/**
 * 19. Loads feature flags from environment variables.
 *
 * @param {string} [prefix] - Environment variable prefix
 * @returns {FeatureFlag[]} Loaded feature flags
 *
 * @example
 * ` ``;
typescript
    *
// FEATURE_NEW_UI=true FEATURE_BETA_API=false
    * ;
const flags = loadFeatureFlagsFromEnv('FEATURE_');
    * `` `
 */
export const loadFeatureFlagsFromEnv = (prefix: string = 'FEATURE_'): FeatureFlag[] => {
  const flags: FeatureFlag[] = [];

  Object.entries(process.env).forEach(([key, value]) => {
    if (key.startsWith(prefix)) {
      const name = key.substring(prefix.length).toLowerCase().replace(/_/g, '-');
      const enabled = value === 'true' || value === '1';

      flags.push(createFeatureFlag(name, enabled));
    }
  });

  return flags;
};

/**
 * 20. Creates environment-based feature flag config.
 *
 * @param {Record<string, Partial<Record<EnvironmentType, boolean>>>} flagConfig - Flag configuration
 * @returns {FeatureFlag[]} Feature flags
 *
 * @example
 * ` ``;
typescript
    * ;
const flags = createEnvBasedFlags({}
    * );
;
    * `` `
 */
export const createEnvBasedFlags = (
  flagConfig: Record<string, Partial<Record<EnvironmentType, boolean>>>
): FeatureFlag[] => {
  const currentEnv = detectEnvironment().type;

  return Object.entries(flagConfig).map(([name, envConfig]) => {
    const enabled = envConfig[currentEnv] ?? false;
    return createFeatureFlag(name, enabled, { environments: [currentEnv] });
  });
};

// ============================================================================
// 5. ENVIRONMENT VARIABLE VALIDATORS
// ============================================================================

/**
 * 21. Validates environment variables against definitions.
 *
 * @param {Record<string, string>} env - Environment variables
 * @param {EnvVarDefinition[]} definitions - Variable definitions
 * @returns {EnvValidationResult} Validation result
 *
 * @example
 * ` ``;
typescript
    * ;
const result = validateEnvironmentVariables(process.env, [
        * { key: 'PORT', type: 'number', required: true },
        * { key: 'DATABASE_URL', type: 'string', required: true }
        * 
]);
    * `` `
 */
export const validateEnvironmentVariables = (
  env: Record<string, string>,
  definitions: EnvVarDefinition[]
): EnvValidationResult => {
  const errors: Array<{ key: string; message: string }> = [];
  const warnings: Array<{ key: string; message: string }> = [];

  definitions.forEach(def => {
    const value = env[def.key];

    // Required check
    if (def.required && !value) {
      errors.push({
        key: def.key,
        message: `;
Required;
environment;
variable;
$;
{
    def.key;
}
is;
not;
set `,
      });
      return;
    }

    if (!value) {
      if (def.default !== undefined) {
        warnings.push({
          key: def.key,
          message: `;
Using;
value;
for ($; { def, : .key } `,
        });
      }
      return;
    }

    // Type validation
    if (!validateEnvVarType(value, def.type)) {
      errors.push({
        key: def.key,
        message: `; $) {
    def.key;
}
must;
be;
of;
def.type;
`,
      });
    }

    // Pattern validation
    if (def.pattern && !def.pattern.test(value)) {
      errors.push({
        key: def.key,
        message: `;
$;
{
    def.key;
}
does;
not;
match;
required;
pattern `,
      });
    }

    // Custom validation
    if (def.validator && !def.validator(value)) {
      errors.push({
        key: def.key,
        message: `;
$;
{
    def.key;
}
failed;
custom;
validation `,
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * 22. Validates environment variable type.
 *
 * @param {string} value - Value to validate
 * @param {'string' | 'number' | 'boolean' | 'json' | 'array'} type - Expected type
 * @returns {boolean} True if valid
 *
 * @example
 * ` ``;
typescript
    * ;
const isValid = validateEnvVarType('3000', 'number'); // true
    * `` `
 */
export const validateEnvVarType = (
  value: string,
  type: 'string' | 'number' | 'boolean' | 'json' | 'array'
): boolean => {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return !isNaN(Number(value));
    case 'boolean':
      return ['true', 'false', '0', '1', 'yes', 'no'].includes(value.toLowerCase());
    case 'json':
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    case 'array':
      return value.includes(',') || value.startsWith('[');
    default:
      return false;
  }
};

/**
 * 23. Creates environment variable schema validator.
 *
 * @param {EnvVarDefinition[]} schema - Variable schema
 * @returns {(env: Record<string, string>) => EnvValidationResult} Validator function
 *
 * @example
 * ` ``;
typescript
    * ;
const validate = createEnvValidator([
        * { key: 'PORT', type: 'number', required: true }
        * 
]);
    * ;
const result = validate(process.env);
    * `` `
 */
export const createEnvValidator = (
  schema: EnvVarDefinition[]
): ((env: Record<string, string>) => EnvValidationResult) => {
  return (env: Record<string, string>) => {
    return validateEnvironmentVariables(env, schema);
  };
};

/**
 * 24. Validates required environment variables are present.
 *
 * @param {string[]} requiredVars - Required variable names
 * @param {Record<string, string>} [env] - Environment object (defaults to process.env)
 * @throws {Error} If required variables are missing
 *
 * @example
 * ` ``;
typescript
    * requireEnvironmentVariables(['DATABASE_URL', 'JWT_SECRET']);
    * `` `
 */
export const requireEnvironmentVariables = (
  requiredVars: string[],
  env: Record<string, string> = process.env as Record<string, string>
): void => {
  const missing = requiredVars.filter(key => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `;
Missing;
required;
environment;
variables: $;
{
    missing.join(', ');
}
`
    );
  }
};

/**
 * 25. Creates environment variable constraint validator.
 *
 * @param {Record<string, any>} constraints - Validation constraints
 * @returns {EnvValidationResult} Validation result
 *
 * @example
 * ` ``;
typescript
    * ;
const result = validateEnvConstraints({});
    * `` `
 */
export const validateEnvConstraints = (
  constraints: Record<string, any>
): EnvValidationResult => {
  const errors: Array<{ key: string; message: string }> = [];
  const warnings: Array<{ key: string; message: string }> = [];

  Object.entries(constraints).forEach(([key, constraint]) => {
    const value = process.env[key];
    if (!value) return;

    const numValue = Number(value);

    if (constraint.min !== undefined && numValue < constraint.min) {
      errors.push({
        key,
        message: `;
$;
{
    key;
}
must;
be;
at;
least;
$;
{
    constraint.min;
}
`,
      });
    }

    if (constraint.max !== undefined && numValue > constraint.max) {
      errors.push({
        key,
        message: `;
$;
{
    key;
}
must;
be;
at;
most;
$;
{
    constraint.max;
}
`,
      });
    }

    if (constraint.enum && !constraint.enum.includes(value)) {
      errors.push({
        key,
        message: `;
$;
{
    key;
}
must;
be;
one;
of: $;
{
    constraint.enum.join(', ');
}
`,
      });
    }
  });

  return { valid: errors.length === 0, errors, warnings };
};

// ============================================================================
// 6. MULTI-ENVIRONMENT HELPERS
// ============================================================================

/**
 * 26. Generates environment-specific file paths.
 *
 * @param {string} baseFileName - Base file name
 * @param {EnvironmentType} env - Environment type
 * @param {string[]} [variants] - Path variants to generate
 * @returns {string[]} Array of file paths
 *
 * @example
 * ` ``;
typescript
    * ;
const paths = generateEnvFilePaths('.env', EnvironmentType.Production);
    *
// ['.env', '.env.production', '.env.production.local']
    * `` `
 */
export const generateEnvFilePaths = (
  baseFileName: string,
  env: EnvironmentType,
  variants: string[] = ['', `.$;
{
    env;
}
`, '.local', `.$;
{
    env;
}
local `]
): string[] => {
  return variants.map(variant => `;
$;
{
    baseFileName;
}
$;
{
    variant;
}
`);
};

/**
 * 27. Creates environment switcher utility.
 *
 * @param {Record<EnvironmentType, () => void>} handlers - Environment handlers
 * @returns {() => void} Switcher function
 *
 * @example
 * ` ``;
typescript
    * ;
const switcher = createEnvironmentSwitcher({}('Production mode'), 
    * [EnvironmentType.Development], () => console.log('Development mode')
    * );
;
    * switcher();
    * `` `
 */
export const createEnvironmentSwitcher = (
  handlers: Partial<Record<EnvironmentType, () => void>>
): (() => void) => {
  return () => {
    const env = detectEnvironment().type;
    const handler = handlers[env];

    if (handler) {
      handler();
    }
  };
};

/**
 * 28. Validates environment consistency across instances.
 *
 * @param {Record<string, string>[]} envs - Array of environment objects
 * @param {string[]} criticalKeys - Critical keys that must match
 * @returns {{ consistent: boolean; differences: string[] }} Consistency result
 *
 * @example
 * ` ``;
typescript
    * ;
const result = validateEnvConsistency(
    * [env1, env2, env3], 
    * ['DATABASE_URL', 'JWT_SECRET']
    * );
    * `` `
 */
export const validateEnvConsistency = (
  envs: Record<string, string>[],
  criticalKeys: string[]
): { consistent: boolean; differences: string[] } => {
  const differences: string[] = [];

  if (envs.length < 2) {
    return { consistent: true, differences };
  }

  const reference = envs[0];

  criticalKeys.forEach(key => {
    const referenceValue = reference[key];

    for (let i = 1; i < envs.length; i++) {
      if (envs[i][key] !== referenceValue) {
        differences.push(`;
Key;
$;
{
    key;
}
differs in environment;
$;
{
    i;
}
`);
      }
    }
  });

  return {
    consistent: differences.length === 0,
    differences,
  };
};

/**
 * 29. Creates environment group configuration.
 *
 * @param {Record<string, EnvironmentType[]>} groups - Environment groups
 * @returns {(group: string) => boolean} Group membership checker
 *
 * @example
 * ` ``;
typescript
    * ;
const isInGroup = createEnvironmentGroup({});
    * ;
if (isInGroup('nonprod')) { /* ... */ }
    * `` `
 */
export const createEnvironmentGroup = (
  groups: Record<string, EnvironmentType[]>
): ((group: string) => boolean) => {
  return (group: string): boolean => {
    const currentEnv = detectEnvironment().type;
    const groupEnvs = groups[group];
    return groupEnvs ? groupEnvs.includes(currentEnv) : false;
  };
};

/**
 * 30. Loads environment-specific modules dynamically.
 *
 * @param {string} modulePath - Base module path
 * @param {EnvironmentType} [env] - Environment type
 * @returns {any} Loaded module
 *
 * @example
 * ` ``;
typescript
    * ;
const config = loadEnvironmentModule('./config', EnvironmentType.Production);
    *
// Attempts to load: ./config.production.js, then ./config.js
    * `` `
 */
export const loadEnvironmentModule = (
  modulePath: string,
  env?: EnvironmentType
): any => {
  const environment = env || detectEnvironment().type;
  const envPath = `;
$;
{
    modulePath;
}
$;
{
    environment;
}
`;

  try {
    return require(envPath);
  } catch {
    try {
      return require(modulePath);
    } catch {
      console.warn(`;
Failed;
to;
load;
module: $;
{
    modulePath;
}
`);
      return null;
    }
  }
};

// ============================================================================
// 7. ENVIRONMENT OVERRIDE UTILITIES
// ============================================================================

/**
 * 31. Applies environment overrides with priority.
 *
 * @param {Record<string, string>} base - Base environment
 * @param {EnvOverrideConfig[]} overrides - Override configurations
 * @returns {Record<string, string>} Final environment
 *
 * @example
 * ` ``;
typescript
    * ;
const env = applyEnvironmentOverrides(baseEnv, [
        * { source: 'file', priority: 1, values: fileEnv },
        * { source: 'cli', priority: 2, values: cliEnv }
        * 
]);
    * `` `
 */
export const applyEnvironmentOverrides = (
  base: Record<string, string>,
  overrides: EnvOverrideConfig[]
): Record<string, string> => {
  const sorted = [...overrides].sort((a, b) => a.priority - b.priority);

  return sorted.reduce(
    (result, override) => ({ ...result, ...override.values }),
    { ...base }
  );
};

/**
 * 32. Creates environment override from CLI arguments.
 *
 * @param {string[]} args - CLI arguments
 * @param {string} [prefix] - Argument prefix
 * @returns {Record<string, string>} Parsed overrides
 *
 * @example
 * ` ``;
typescript
    *
// node app.js --env.PORT=8080 --env.DEBUG=true
    * ;
const overrides = parseCliEnvironmentOverrides(process.argv, '--env.');
    * `` `
 */
export const parseCliEnvironmentOverrides = (
  args: string[],
  prefix: string = '--env.'
): Record<string, string> => {
  const overrides: Record<string, string> = {};

  args.forEach(arg => {
    if (arg.startsWith(prefix)) {
      const [key, value] = arg.substring(prefix.length).split('=');
      if (key && value) {
        overrides[key] = value;
      }
    }
  });

  return overrides;
};

/**
 * 33. Creates environment variable proxy for runtime changes.
 *
 * @param {Record<string, string>} base - Base environment
 * @returns {Record<string, string>} Proxied environment
 *
 * @example
 * ` ``;
typescript
    * ;
const env = createEnvironmentProxy(process.env);
    * env.PORT;
'8080'; // Runtime override
    * `` `
 */
export const createEnvironmentProxy = (
  base: Record<string, string>
): Record<string, string> => {
  const overrides: Record<string, string> = {};

  return new Proxy(base, {
    get(target, prop: string) {
      return overrides[prop] ?? target[prop];
    },
    set(target, prop: string, value: string) {
      overrides[prop] = value;
      return true;
    },
  });
};

/**
 * 34. Freezes environment to prevent modifications.
 *
 * @param {Record<string, string>} env - Environment to freeze
 * @returns {Readonly<Record<string, string>>} Frozen environment
 *
 * @example
 * ` ``;
typescript
    * ;
const frozenEnv = freezeEnvironment(process.env);
    *
// Prevents accidental modifications
    * `` `
 */
export const freezeEnvironment = (
  env: Record<string, string>
): Readonly<Record<string, string>> => {
  return Object.freeze({ ...env });
};

/**
 * 35. Creates environment snapshot for rollback.
 *
 * @param {Record<string, string>} env - Environment to snapshot
 * @returns {{ snapshot: Record<string, string>; restore: () => void }} Snapshot
 *
 * @example
 * ` ``;
typescript
    * ;
const { snapshot, restore } = snapshotEnvironment(process.env);
    *
// Make changes...
    * restore(); // Rollback to snapshot
    * `` `
 */
export const snapshotEnvironment = (
  env: Record<string, string>
): { snapshot: Record<string, string>; restore: () => void } => {
  const snapshot = { ...env };

  return {
    snapshot,
    restore: () => {
      Object.keys(env).forEach(key => {
        if (snapshot[key] !== undefined) {
          env[key] = snapshot[key];
        } else {
          delete env[key];
        }
      });
    },
  };
};

// ============================================================================
// 8. ENVIRONMENT COMPARISON & MIGRATION
// ============================================================================

/**
 * 36. Compares two environment configurations.
 *
 * @param {Record<string, string>} env1 - First environment
 * @param {Record<string, string>} env2 - Second environment
 * @param {string} [name1] - First environment name
 * @param {string} [name2] - Second environment name
 * @returns {EnvComparisonResult} Comparison result
 *
 * @example
 * ` ``;
typescript
    * ;
const diff = compareEnvironments(devEnv, prodEnv, 'dev', 'prod');
    * `` `
 */
export const compareEnvironments = (
  env1: Record<string, string>,
  env2: Record<string, string>,
  name1: string = 'env1',
  name2: string = 'env2'
): EnvComparisonResult => {
  const keys1 = new Set(Object.keys(env1));
  const keys2 = new Set(Object.keys(env2));

  const onlyInEnv1 = Array.from(keys1).filter(k => !keys2.has(k));
  const onlyInEnv2 = Array.from(keys2).filter(k => !keys1.has(k));
  const different: Array<{ key: string; value1: string; value2: string }> = [];

  Array.from(keys1).forEach(key => {
    if (keys2.has(key) && env1[key] !== env2[key]) {
      different.push({
        key,
        value1: env1[key],
        value2: env2[key],
      });
    }
  });

  return {
    environment1: name1,
    environment2: name2,
    identical: onlyInEnv1.length === 0 && onlyInEnv2.length === 0 && different.length === 0,
    onlyInEnv1,
    onlyInEnv2,
    different,
  };
};

/**
 * 37. Creates environment migration plan.
 *
 * @param {Record<string, string>} source - Source environment
 * @param {Record<string, string>} target - Target environment
 * @returns {MigrationPlan} Migration plan
 *
 * @example
 * ` ``;
typescript
    * ;
const plan = createMigrationPlan(devEnv, prodEnv);
    * `` `
 */
export const createMigrationPlan = (
  source: Record<string, string>,
  target: Record<string, string>
): MigrationPlan => {
  const comparison = compareEnvironments(source, target, 'source', 'target');
  const changes: MigrationPlan['changes'] = [];
  const warnings: string[] = [];

  // Add new variables
  comparison.onlyInEnv2.forEach(key => {
    changes.push({
      key,
      action: 'add',
      newValue: target[key],
    });
  });

  // Remove old variables
  comparison.onlyInEnv1.forEach(key => {
    changes.push({
      key,
      action: 'remove',
      oldValue: source[key],
    });
    warnings.push(`;
Variable;
$;
{
    key;
}
will;
be;
removed `);
  });

  // Update changed variables
  comparison.different.forEach(({ key, value1, value2 }) => {
    changes.push({
      key,
      action: 'update',
      oldValue: value1,
      newValue: value2,
    });
  });

  return {
    from: 'source',
    to: 'target',
    changes,
    warnings,
  };
};

/**
 * 38. Executes environment migration plan.
 *
 * @param {Record<string, string>} env - Environment to migrate
 * @param {MigrationPlan} plan - Migration plan
 * @returns {Record<string, string>} Migrated environment
 *
 * @example
 * ` ``;
typescript
    * ;
const migrated = executeMigration(currentEnv, migrationPlan);
    * `` `
 */
export const executeMigration = (
  env: Record<string, string>,
  plan: MigrationPlan
): Record<string, string> => {
  const result = { ...env };

  plan.changes.forEach(change => {
    switch (change.action) {
      case 'add':
        result[change.key] = change.newValue!;
        break;
      case 'remove':
        delete result[change.key];
        break;
      case 'update':
        result[change.key] = change.newValue!;
        break;
    }
  });

  return result;
};

/**
 * 39. Generates environment migration script.
 *
 * @param {MigrationPlan} plan - Migration plan
 * @param {'bash' | 'powershell'} [format] - Script format
 * @returns {string} Migration script
 *
 * @example
 * ` ``;
typescript
    * ;
const script = generateMigrationScript(plan, 'bash');
    * fs.writeFileSync('migrate.sh', script);
    * `` `
 */
export const generateMigrationScript = (
  plan: MigrationPlan,
  format: 'bash' | 'powershell' = 'bash'
): string => {
  let script = '';

  if (format === 'bash') {
    script += '#!/bin/bash\n\n';
    script += '# Environment Migration Script\n';
    script += `;
#;
From: $;
{
    plan.from;
}
to;
$;
{
    plan.to;
}
n;
n `;

    plan.changes.forEach(change => {
      switch (change.action) {
        case 'add':
        case 'update':
          script += `;
$;
{
    change.key;
}
"${change.newValue}";
n `;
          break;
        case 'remove':
          script += `;
unset;
$;
{
    change.key;
}
n `;
          break;
      }
    });
  } else {
    script += '# Environment Migration Script\n';
    script += `;
#;
From: $;
{
    plan.from;
}
to;
$;
{
    plan.to;
}
n;
n `;

    plan.changes.forEach(change => {
      switch (change.action) {
        case 'add':
        case 'update':
          script += `;
$env: $;
{
    change.key;
}
"${change.newValue}";
n `;
          break;
        case 'remove':
          script += `;
Remove - Item;
Env: ;
$;
{
    change.key;
}
n `;
          break;
      }
    });
  }

  return script;
};

/**
 * 40. Validates migration safety.
 *
 * @param {MigrationPlan} plan - Migration plan
 * @param {string[]} criticalVars - Critical variables
 * @returns {{ safe: boolean; risks: string[] }} Safety check result
 *
 * @example
 * ` ``;
typescript
    * ;
const safety = validateMigrationSafety(plan, ['DATABASE_URL', 'JWT_SECRET']);
    * `` `
 */
export const validateMigrationSafety = (
  plan: MigrationPlan,
  criticalVars: string[]
): { safe: boolean; risks: string[] } => {
  const risks: string[] = [];

  plan.changes.forEach(change => {
    if (criticalVars.includes(change.key)) {
      if (change.action === 'remove') {
        risks.push(`;
Critical;
variable;
$;
{
    change.key;
}
will;
be;
removed `);
      } else if (change.action === 'update') {
        risks.push(`;
Critical;
variable;
$;
{
    change.key;
}
will;
be;
changed `);
      }
    }
  });

  return {
    safe: risks.length === 0,
    risks,
  };
};

// ============================================================================
// 9. SENSITIVE DATA MASKING & DOCUMENTATION
// ============================================================================

/**
 * 41. Masks sensitive environment variables.
 *
 * @param {Record<string, string>} env - Environment variables
 * @param {string[]} [sensitiveKeys] - Sensitive key patterns
 * @returns {Record<string, string>} Masked environment
 *
 * @example
 * ` ``;
typescript
    * ;
const masked = maskSensitiveEnv(process.env, ['PASSWORD', 'SECRET', 'TOKEN']);
    * `` `
 */
export const maskSensitiveEnv = (
  env: Record<string, string>,
  sensitiveKeys: string[] = ['PASSWORD', 'SECRET', 'TOKEN', 'KEY', 'CREDENTIAL']
): Record<string, string> => {
  const masked: Record<string, string> = {};

  Object.entries(env).forEach(([key, value]) => {
    const isSensitive = sensitiveKeys.some(pattern =>
      key.toUpperCase().includes(pattern)
    );

    masked[key] = isSensitive ? '***REDACTED***' : value;
  });

  return masked;
};

/**
 * 42. Generates environment documentation.
 *
 * @param {EnvVarDefinition[]} definitions - Variable definitions
 * @param {Record<string, string>} [examples] - Example values
 * @returns {string} Markdown documentation
 *
 * @example
 * ` ``;
typescript
    * ;
const docs = generateEnvironmentDocs(envDefinitions, examples);
    * fs.writeFileSync('ENV.md', docs);
    * `` `
 */
export const generateEnvironmentDocs = (
  definitions: EnvVarDefinition[],
  examples?: Record<string, string>
): string => {
  let doc = '# Environment Variables Documentation\n\n';
  doc += '| Variable | Type | Required | Default | Description |\n';
  doc += '|----------|------|----------|---------|-------------|\n';

  definitions.forEach(def => {
    const required = def.required ? 'Yes' : 'No';
    const defaultValue = def.default !== undefined ? `;
`${def.default}\``;
'-';
const description = def.description || '-';
doc += `| ${def.key} | ${def.type} | ${required} | ${defaultValue} | ${description} |\n`;
;
if (examples) {
    doc += '\n## Examples\n\n';
    doc += '```bash\n';
    Object.entries(examples).forEach(([key, value]) => {
        doc += `${key}=${value}\n`;
    });
    doc += '```\n';
}
return doc;
;
/**
 * 43. Creates .env.example template file.
 *
 * @param {EnvVarDefinition[]} definitions - Variable definitions
 * @returns {string} .env.example content
 *
 * @example
 * ```typescript
 * const template = generateEnvTemplate(definitions);
 * fs.writeFileSync('.env.example', template);
 * ```
 */
const generateEnvTemplate = (definitions) => {
    let content = '# Environment Variables Template\n';
    content += '# Copy this file to .env and fill in your values\n\n';
    definitions.forEach(def => {
        if (def.description) {
            content += `# ${def.description}\n`;
        }
        content += `# Type: ${def.type}`;
        if (def.required) {
            content += ' (required)';
        }
        content += '\n';
        if (def.default !== undefined) {
            content += `${def.key}=${def.default}\n\n`;
        }
        else {
            content += `${def.key}=\n\n`;
        }
    });
    return content;
};
exports.generateEnvTemplate = generateEnvTemplate;
/**
 * 44. Audits environment for security issues.
 *
 * @param {Record<string, string>} env - Environment to audit
 * @returns {{ issues: string[]; warnings: string[] }} Audit result
 *
 * @example
 * ```typescript
 * const audit = auditEnvironmentSecurity(process.env);
 * ```
 */
const auditEnvironmentSecurity = (env) => {
    const issues = [];
    const warnings = [];
    Object.entries(env).forEach(([key, value]) => {
        // Check for hardcoded credentials in certain environments
        if ((0, exports.detectEnvironment)().isProduction) {
            if (key.includes('PASSWORD') && value === 'password') {
                issues.push(`Weak password detected in ${key}`);
            }
            if (key.includes('SECRET') && value.length < 32) {
                warnings.push(`Secret ${key} may be too short`);
            }
        }
        // Check for exposed secrets
        if (key.includes('SECRET') || key.includes('KEY')) {
            if (!value || value === 'changeme' || value === 'default') {
                issues.push(`Default or empty secret in ${key}`);
            }
        }
    });
    return { issues, warnings };
};
exports.auditEnvironmentSecurity = auditEnvironmentSecurity;
/**
 * 45. Creates environment testing utility.
 *
 * @param {Record<string, string>} env - Environment to test
 * @param {Array<{ name: string; test: (env: any) => boolean }>} tests - Test suite
 * @returns {{ passed: number; failed: number; results: any[] }} Test results
 *
 * @example
 * ```typescript
 * const results = testEnvironment(process.env, [
 *   { name: 'Has database URL', test: (e) => !!e.DATABASE_URL },
 *   { name: 'Valid port', test: (e) => Number(e.PORT) >= 1024 }
 * ]);
 * ```
 */
const testEnvironment = (env, tests) => {
    const results = tests.map(({ name, test }) => {
        const passed = test(env);
        return { name, passed };
    });
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    return { passed, failed, results };
};
exports.testEnvironment = testEnvironment;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Deep merges two objects.
 */
const deepMerge = (target, source) => {
    const result = { ...target };
    Object.entries(source).forEach(([key, value]) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = deepMerge(result[key] || {}, value);
        }
        else {
            result[key] = value;
        }
    });
    return result;
};
/**
 * Hashes a string for consistent randomization using SHA-256.
 */
const hashString = (str) => {
    return crypto.createHash('sha256').update(str).digest('hex');
};
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Environment Detection (1-5)
    detectEnvironment: exports.detectEnvironment,
    normalizeEnvironmentType: exports.normalizeEnvironmentType,
    isEnvironment: exports.isEnvironment,
    getEnvironmentValue: exports.getEnvironmentValue,
    createEnvironmentGuard: exports.createEnvironmentGuard,
    // .env File Parsers (6-10)
    parseEnvFile: exports.parseEnvFile,
    loadEnvFile: exports.loadEnvFile,
    expandEnvVariables: exports.expandEnvVariables,
    writeEnvFile: exports.writeEnvFile,
    mergeEnvFiles: exports.mergeEnvFiles,
    // Environment-Specific Config Builders (11-15)
    buildEnvSpecificConfig: exports.buildEnvSpecificConfig,
    loadEnvironmentFiles: exports.loadEnvironmentFiles,
    createEnvCascade,
    buildMultiTierConfig,
    loadEnvironmentProfile,
    // Feature Flag Management (16-20)
    createFeatureFlag,
    evaluateFeatureFlag,
    createFeatureFlagManager,
    loadFeatureFlagsFromEnv,
    createEnvBasedFlags,
    // Environment Variable Validators (21-25)
    validateEnvironmentVariables,
    validateEnvVarType,
    createEnvValidator,
    requireEnvironmentVariables,
    validateEnvConstraints,
    // Multi-Environment Helpers (26-30)
    generateEnvFilePaths,
    createEnvironmentSwitcher,
    validateEnvConsistency,
    createEnvironmentGroup,
    loadEnvironmentModule,
    // Environment Override Utilities (31-35)
    applyEnvironmentOverrides,
    parseCliEnvironmentOverrides,
    createEnvironmentProxy,
    freezeEnvironment,
    snapshotEnvironment,
    // Environment Comparison & Migration (36-40)
    compareEnvironments,
    createMigrationPlan,
    executeMigration,
    generateMigrationScript,
    validateMigrationSafety,
    // Sensitive Data Masking & Documentation (41-45)
    maskSensitiveEnv,
    generateEnvironmentDocs,
    generateEnvTemplate: exports.generateEnvTemplate,
    auditEnvironmentSecurity: exports.auditEnvironmentSecurity,
    testEnvironment: exports.testEnvironment,
};
//# sourceMappingURL=environment-kit.js.map