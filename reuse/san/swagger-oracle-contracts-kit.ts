/**
 * LOC: SWOC1234567
 * File: /reuse/san/swagger-oracle-contracts-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Contract testing frameworks
 *   - API versioning services
 *   - Consumer-driven contract tools
 *   - API governance platforms
 */

/**
 * File: /reuse/san/swagger-oracle-contracts-kit.ts
 * Locator: WC-UTL-SWOC-001
 * Purpose: Enterprise API Contract Management Utilities - Contract definitions, versioning, validation, evolution, testing
 *
 * Upstream: Independent utility module for API contract governance and management
 * Downstream: ../backend/*, Contract testing frameworks, API gateways, Consumer-driven contract tools
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Swagger/OpenAPI 3.x, Pact
 * Exports: 41 utility functions for contract definitions, versioning, validation, schema evolution, breaking change detection
 *
 * LLM Context: Comprehensive API contract management utilities for implementing consumer-driven contracts and API governance
 * in White Cross healthcare system. Provides contract definitions, version compatibility checking, schema evolution tracking,
 * breaking change detection, contract testing utilities, and registry management. Essential for maintaining API contracts
 * across distributed healthcare services with HIPAA compliance and regulatory requirements.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ApiContract {
  contractId: string;
  provider: ContractParty;
  consumer: ContractParty;
  version: string;
  specification: ContractSpecification;
  interactions: ContractInteraction[];
  metadata: ContractMetadata;
  status: 'draft' | 'published' | 'deprecated' | 'retired';
  createdAt: Date;
  updatedAt: Date;
}

interface ContractParty {
  name: string;
  version: string;
  team: string;
  contact: string;
}

interface ContractSpecification {
  format: 'openapi' | 'pact' | 'graphql' | 'grpc';
  version: string;
  schema: Record<string, any>;
  examples: ContractExample[];
}

interface ContractInteraction {
  description: string;
  request: InteractionRequest;
  response: InteractionResponse;
  providerState?: string;
}

interface InteractionRequest {
  method: string;
  path: string;
  headers?: Record<string, string>;
  query?: Record<string, any>;
  body?: any;
}

interface InteractionResponse {
  status: number;
  headers?: Record<string, string>;
  body?: any;
  schema?: Record<string, any>;
}

interface ContractMetadata {
  description: string;
  tags: string[];
  hipaaCompliant: boolean;
  phiHandling: boolean;
  retentionPolicy?: string;
  auditRequired: boolean;
}

interface ContractExample {
  name: string;
  description: string;
  request: any;
  response: any;
  scenario?: string;
}

interface ContractVersion {
  version: string;
  changes: ContractChange[];
  breakingChanges: BreakingChange[];
  compatibility: CompatibilityInfo;
  publishedAt: Date;
  publishedBy: string;
}

interface ContractChange {
  type: 'addition' | 'modification' | 'removal' | 'deprecation';
  target: 'endpoint' | 'schema' | 'parameter' | 'response' | 'header';
  path: string;
  description: string;
  breaking: boolean;
}

interface BreakingChange {
  change: ContractChange;
  impact: 'high' | 'medium' | 'low';
  mitigation?: string;
  affectedConsumers: string[];
}

interface CompatibilityInfo {
  backward: boolean;
  forward: boolean;
  minimumConsumerVersion?: string;
  minimumProviderVersion?: string;
  compatibleVersions: string[];
}

interface ValidationRule {
  name: string;
  type: 'schema' | 'business' | 'security' | 'compliance';
  severity: 'error' | 'warning' | 'info';
  validator: (data: any, context?: any) => ValidationResult;
  description: string;
  hipaaRelated?: boolean;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

interface SchemaEvolution {
  fromVersion: string;
  toVersion: string;
  migrations: SchemaMigration[];
  rollback: RollbackStrategy;
  tested: boolean;
}

interface SchemaMigration {
  type: 'add_field' | 'remove_field' | 'rename_field' | 'change_type' | 'add_validation';
  field: string;
  before?: any;
  after?: any;
  transformer?: (data: any) => any;
}

interface RollbackStrategy {
  possible: boolean;
  steps: string[];
  dataLoss: boolean;
}

interface ContractTest {
  testId: string;
  contractId: string;
  type: 'provider' | 'consumer';
  interactions: ContractInteraction[];
  setup?: TestSetup;
  assertions: TestAssertion[];
  status: 'pending' | 'running' | 'passed' | 'failed';
}

interface TestSetup {
  providerState: string;
  data?: Record<string, any>;
  dependencies?: string[];
}

interface TestAssertion {
  type: 'status' | 'header' | 'body' | 'schema';
  field?: string;
  expected: any;
  matcher: 'equals' | 'contains' | 'matches' | 'type';
}

interface ContractRegistry {
  contracts: Map<string, ApiContract>;
  versions: Map<string, ContractVersion[]>;
  index: ContractIndex;
}

interface ContractIndex {
  byProvider: Map<string, string[]>;
  byConsumer: Map<string, string[]>;
  byTag: Map<string, string[]>;
  byStatus: Map<string, string[]>;
}

// ============================================================================
// API CONTRACT DEFINITIONS
// ============================================================================

/**
 * Creates a comprehensive API contract between provider and consumer.
 *
 * @param {ContractParty} provider - Provider party
 * @param {ContractParty} consumer - Consumer party
 * @param {ContractSpecification} specification - Contract specification
 * @param {ContractInteraction[]} interactions - Contract interactions
 * @returns {ApiContract} Complete API contract
 *
 * @example
 * ```typescript
 * const contract = createApiContract(
 *   { name: 'patient-service', version: 'v2.0.0', team: 'healthcare', contact: 'team@example.com' },
 *   { name: 'appointment-service', version: 'v1.5.0', team: 'scheduling', contact: 'team@example.com' },
 *   { format: 'openapi', version: '3.0.0', schema: openApiSchema, examples: [] },
 *   interactions
 * );
 * ```
 */
export const createApiContract = (
  provider: ContractParty,
  consumer: ContractParty,
  specification: ContractSpecification,
  interactions: ContractInteraction[],
): ApiContract => {
  const contractId = `${provider.name}-${consumer.name}-${Date.now()}`;

  return {
    contractId,
    provider,
    consumer,
    version: '1.0.0',
    specification,
    interactions,
    metadata: {
      description: `Contract between ${provider.name} and ${consumer.name}`,
      tags: ['api-contract'],
      hipaaCompliant: false,
      phiHandling: false,
      auditRequired: false,
    },
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Converts OpenAPI specification to contract format.
 *
 * @param {Record<string, any>} openApiSpec - OpenAPI specification
 * @param {string} providerName - Provider service name
 * @param {string} consumerName - Consumer service name
 * @returns {ApiContract} API contract
 *
 * @example
 * ```typescript
 * const contract = convertOpenAPIToContract(
 *   openApiSpec,
 *   'patient-service',
 *   'appointment-service'
 * );
 * ```
 */
export const convertOpenAPIToContract = (
  openApiSpec: Record<string, any>,
  providerName: string,
  consumerName: string,
): ApiContract => {
  const specification: ContractSpecification = {
    format: 'openapi',
    version: openApiSpec.openapi || openApiSpec.swagger || '3.0.0',
    schema: openApiSpec,
    examples: [],
  };

  const interactions: ContractInteraction[] = [];
  const paths = openApiSpec.paths || {};

  Object.entries(paths).forEach(([path, pathItem]: [string, any]) => {
    Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
        const responses = operation.responses || {};
        const successResponse = responses['200'] || responses['201'] || {};

        interactions.push({
          description: operation.summary || operation.description || `${method.toUpperCase()} ${path}`,
          request: {
            method: method.toUpperCase(),
            path,
          },
          response: {
            status: 200,
            body: successResponse.content?.['application/json']?.example,
            schema: successResponse.content?.['application/json']?.schema,
          },
        });
      }
    });
  });

  return createApiContract(
    { name: providerName, version: openApiSpec.info?.version || '1.0.0', team: '', contact: '' },
    { name: consumerName, version: '1.0.0', team: '', contact: '' },
    specification,
    interactions,
  );
};

/**
 * Creates Pact-compatible consumer contract.
 *
 * @param {string} consumer - Consumer name
 * @param {string} provider - Provider name
 * @param {ContractInteraction[]} interactions - Contract interactions
 * @returns {Record<string, any>} Pact contract format
 *
 * @example
 * ```typescript
 * const pactContract = createPactContract(
 *   'appointment-service',
 *   'patient-service',
 *   interactions
 * );
 * // Compatible with Pact Broker
 * ```
 */
export const createPactContract = (
  consumer: string,
  provider: string,
  interactions: ContractInteraction[],
): Record<string, any> => {
  return {
    consumer: { name: consumer },
    provider: { name: provider },
    interactions: interactions.map((interaction) => ({
      description: interaction.description,
      providerState: interaction.providerState,
      request: {
        method: interaction.request.method,
        path: interaction.request.path,
        headers: interaction.request.headers,
        query: interaction.request.query,
        body: interaction.request.body,
      },
      response: {
        status: interaction.response.status,
        headers: interaction.response.headers,
        body: interaction.response.body,
      },
    })),
    metadata: {
      pactSpecification: {
        version: '2.0.0',
      },
    },
  };
};

/**
 * Serializes contract to JSON format for storage.
 *
 * @param {ApiContract} contract - API contract
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = serializeContract(contract);
 * // Store in contract registry or version control
 * ```
 */
export const serializeContract = (contract: ApiContract): string => {
  return JSON.stringify(contract, null, 2);
};

/**
 * Deserializes contract from JSON format.
 *
 * @param {string} json - Contract JSON string
 * @returns {ApiContract} API contract
 *
 * @example
 * ```typescript
 * const contract = deserializeContract(contractJson);
 * // Load from contract registry
 * ```
 */
export const deserializeContract = (json: string): ApiContract => {
  const parsed = JSON.parse(json);
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt),
    updatedAt: new Date(parsed.updatedAt),
  };
};

/**
 * Validates contract structure and completeness.
 *
 * @param {ApiContract} contract - API contract
 * @param {boolean} [requireHIPAACompliance] - Require HIPAA compliance metadata
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateContractStructure(contract, true);
 * if (!validation.valid) {
 *   console.error('Contract validation errors:', validation.errors);
 * }
 * ```
 */
export const validateContractStructure = (
  contract: ApiContract,
  requireHIPAACompliance: boolean = false,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!contract.contractId) errors.push('Contract ID is required');
  if (!contract.provider.name) errors.push('Provider name is required');
  if (!contract.consumer.name) errors.push('Consumer name is required');
  if (!contract.version) errors.push('Contract version is required');
  if (!contract.specification) errors.push('Contract specification is required');
  if (contract.interactions.length === 0) errors.push('At least one interaction required');

  if (requireHIPAACompliance) {
    if (!contract.metadata.hipaaCompliant) {
      errors.push('HIPAA compliance flag must be set for healthcare contracts');
    }
    if (contract.metadata.phiHandling && !contract.metadata.auditRequired) {
      errors.push('PHI handling requires audit trail');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// CONTRACT VERSIONING AND COMPATIBILITY
// ============================================================================

/**
 * Creates new contract version with change tracking.
 *
 * @param {ApiContract} contract - Base contract
 * @param {string} newVersion - New version number
 * @param {ContractChange[]} changes - List of changes
 * @param {string} publishedBy - Publisher identifier
 * @returns {ContractVersion} Contract version
 *
 * @example
 * ```typescript
 * const version = createContractVersion(
 *   contract,
 *   'v2.0.0',
 *   [{ type: 'addition', target: 'endpoint', path: '/patients', description: 'New endpoint', breaking: false }],
 *   'platform-team'
 * );
 * ```
 */
export const createContractVersion = (
  contract: ApiContract,
  newVersion: string,
  changes: ContractChange[],
  publishedBy: string,
): ContractVersion => {
  const breakingChanges: BreakingChange[] = changes
    .filter((change) => change.breaking)
    .map((change) => ({
      change,
      impact: determineChangeImpact(change),
      affectedConsumers: [contract.consumer.name],
    }));

  return {
    version: newVersion,
    changes,
    breakingChanges,
    compatibility: {
      backward: breakingChanges.length === 0,
      forward: false,
      compatibleVersions: [],
    },
    publishedAt: new Date(),
    publishedBy,
  };
};

/**
 * Determines change impact level for contract changes.
 *
 * @param {ContractChange} change - Contract change
 * @returns {'high' | 'medium' | 'low'} Impact level
 */
const determineChangeImpact = (change: ContractChange): 'high' | 'medium' | 'low' => {
  if (change.type === 'removal') return 'high';
  if (change.type === 'modification' && change.target === 'schema') return 'high';
  if (change.type === 'modification' && change.target === 'endpoint') return 'medium';
  return 'low';
};

/**
 * Compares two contract versions for compatibility.
 *
 * @param {ApiContract} version1 - First contract version
 * @param {ApiContract} version2 - Second contract version
 * @returns {{ compatible: boolean; breakingChanges: string[]; warnings: string[] }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareContractVersions(contractV1, contractV2);
 * if (!comparison.compatible) {
 *   console.error('Breaking changes detected:', comparison.breakingChanges);
 * }
 * ```
 */
export const compareContractVersions = (
  version1: ApiContract,
  version2: ApiContract,
): { compatible: boolean; breakingChanges: string[]; warnings: string[] } => {
  const breakingChanges: string[] = [];
  const warnings: string[] = [];

  // Compare interactions
  const v1Paths = new Set(version1.interactions.map((i) => `${i.request.method} ${i.request.path}`));
  const v2Paths = new Set(version2.interactions.map((i) => `${i.request.method} ${i.request.path}`));

  v1Paths.forEach((path) => {
    if (!v2Paths.has(path)) {
      breakingChanges.push(`Endpoint removed: ${path}`);
    }
  });

  v2Paths.forEach((path) => {
    if (!v1Paths.has(path)) {
      warnings.push(`New endpoint added: ${path}`);
    }
  });

  return {
    compatible: breakingChanges.length === 0,
    breakingChanges,
    warnings,
  };
};

/**
 * Checks backward compatibility between contract versions.
 *
 * @param {ApiContract} newContract - New contract version
 * @param {ApiContract} oldContract - Old contract version
 * @returns {{ backward: boolean; issues: string[] }} Compatibility result
 *
 * @example
 * ```typescript
 * const compat = checkBackwardCompatibility(newContract, oldContract);
 * if (!compat.backward) {
 *   console.warn('Backward compatibility issues:', compat.issues);
 * }
 * ```
 */
export const checkBackwardCompatibility = (
  newContract: ApiContract,
  oldContract: ApiContract,
): { backward: boolean; issues: string[] } => {
  const issues: string[] = [];

  // Check that all old interactions still exist
  oldContract.interactions.forEach((oldInteraction) => {
    const exists = newContract.interactions.some(
      (newInteraction) =>
        newInteraction.request.method === oldInteraction.request.method &&
        newInteraction.request.path === oldInteraction.request.path,
    );

    if (!exists) {
      issues.push(
        `Missing interaction: ${oldInteraction.request.method} ${oldInteraction.request.path}`,
      );
    }
  });

  return {
    backward: issues.length === 0,
    issues,
  };
};

/**
 * Generates version compatibility matrix for contracts.
 *
 * @param {ContractVersion[]} versions - Array of contract versions
 * @returns {Record<string, Record<string, boolean>>} Compatibility matrix
 *
 * @example
 * ```typescript
 * const matrix = generateCompatibilityMatrix(versions);
 * const isCompatible = matrix['v2.0.0']['v1.5.0'];
 * ```
 */
export const generateCompatibilityMatrix = (
  versions: ContractVersion[],
): Record<string, Record<string, boolean>> => {
  const matrix: Record<string, Record<string, boolean>> = {};

  versions.forEach((v1) => {
    matrix[v1.version] = {};
    versions.forEach((v2) => {
      matrix[v1.version][v2.version] = v1.compatibility.compatibleVersions.includes(v2.version);
    });
  });

  return matrix;
};

/**
 * Suggests version number for contract changes.
 *
 * @param {string} currentVersion - Current version
 * @param {ContractChange[]} changes - Proposed changes
 * @returns {{ suggested: string; reason: string }} Version suggestion
 *
 * @example
 * ```typescript
 * const suggestion = suggestContractVersion('v1.5.0', changes);
 * // Result: { suggested: 'v2.0.0', reason: 'Breaking changes detected' }
 * ```
 */
export const suggestContractVersion = (
  currentVersion: string,
  changes: ContractChange[],
): { suggested: string; reason: string } => {
  const hasBreaking = changes.some((c) => c.breaking);
  const hasMajor = changes.some((c) => c.type === 'addition' && c.target === 'endpoint');
  const hasMinor = changes.some((c) => c.type === 'addition');

  const versionMatch = currentVersion.match(/v?(\d+)\.(\d+)\.(\d+)/);
  if (!versionMatch) {
    return { suggested: 'v1.0.0', reason: 'Invalid version format' };
  }

  let [, major, minor, patch] = versionMatch.map(Number);

  if (hasBreaking) {
    major += 1;
    minor = 0;
    patch = 0;
    return { suggested: `v${major}.${minor}.${patch}`, reason: 'Breaking changes detected' };
  }

  if (hasMajor) {
    minor += 1;
    patch = 0;
    return { suggested: `v${major}.${minor}.${patch}`, reason: 'New features added' };
  }

  if (hasMinor) {
    patch += 1;
    return { suggested: `v${major}.${minor}.${patch}`, reason: 'Minor updates' };
  }

  return { suggested: currentVersion, reason: 'No changes detected' };
};

// ============================================================================
// CONTRACT VALIDATION RULES
// ============================================================================

/**
 * Creates schema validation rule for contract.
 *
 * @param {string} name - Rule name
 * @param {Record<string, any>} schema - JSON schema
 * @param {'error' | 'warning' | 'info'} severity - Validation severity
 * @returns {ValidationRule} Validation rule
 *
 * @example
 * ```typescript
 * const rule = createSchemaValidationRule(
 *   'patient-data-schema',
 *   patientSchema,
 *   'error'
 * );
 * ```
 */
export const createSchemaValidationRule = (
  name: string,
  schema: Record<string, any>,
  severity: 'error' | 'warning' | 'info',
): ValidationRule => {
  return {
    name,
    type: 'schema',
    severity,
    validator: (data: any): ValidationResult => {
      const errors: ValidationError[] = [];
      const warnings: ValidationWarning[] = [];

      // Basic schema validation (simplified - use ajv in production)
      if (schema.required) {
        schema.required.forEach((field: string) => {
          if (!(field in data)) {
            errors.push({
              field,
              message: `Required field '${field}' is missing`,
              code: 'REQUIRED_FIELD_MISSING',
            });
          }
        });
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    },
    description: `Validates data against ${name} schema`,
  };
};

/**
 * Creates HIPAA compliance validation rule.
 *
 * @param {string} name - Rule name
 * @param {string[]} phiFields - PHI field names
 * @returns {ValidationRule} HIPAA validation rule
 *
 * @example
 * ```typescript
 * const hipaaRule = createHIPAAValidationRule(
 *   'patient-phi-validation',
 *   ['ssn', 'medicalRecordNumber', 'patientName']
 * );
 * ```
 */
export const createHIPAAValidationRule = (
  name: string,
  phiFields: string[],
): ValidationRule => {
  return {
    name,
    type: 'compliance',
    severity: 'error',
    validator: (data: any, context?: any): ValidationResult => {
      const errors: ValidationError[] = [];
      const warnings: ValidationWarning[] = [];

      phiFields.forEach((field) => {
        if (field in data) {
          if (!context?.encrypted) {
            errors.push({
              field,
              message: `PHI field '${field}' must be encrypted`,
              code: 'PHI_NOT_ENCRYPTED',
              value: '[REDACTED]',
            });
          }
          if (!context?.auditLogged) {
            warnings.push({
              field,
              message: `PHI access to '${field}' should be audit logged`,
              suggestion: 'Enable audit logging for PHI access',
            });
          }
        }
      });

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    },
    description: `Validates HIPAA compliance for PHI fields: ${phiFields.join(', ')}`,
    hipaaRelated: true,
  };
};

/**
 * Validates contract data against multiple rules.
 *
 * @param {any} data - Data to validate
 * @param {ValidationRule[]} rules - Validation rules
 * @param {any} [context] - Validation context
 * @returns {ValidationResult} Aggregated validation result
 *
 * @example
 * ```typescript
 * const result = validateContract(patientData, [schemaRule, hipaaRule], { encrypted: true });
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export const validateContract = (
  data: any,
  rules: ValidationRule[],
  context?: any,
): ValidationResult => {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  rules.forEach((rule) => {
    const result = rule.validator(data, context);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
};

/**
 * Creates custom validation rule with predicate function.
 *
 * @param {string} name - Rule name
 * @param {(data: any) => boolean} predicate - Validation predicate
 * @param {string} errorMessage - Error message
 * @returns {ValidationRule} Custom validation rule
 *
 * @example
 * ```typescript
 * const ageRule = createCustomValidationRule(
 *   'age-check',
 *   (data) => data.age >= 0 && data.age <= 150,
 *   'Age must be between 0 and 150'
 * );
 * ```
 */
export const createCustomValidationRule = (
  name: string,
  predicate: (data: any) => boolean,
  errorMessage: string,
): ValidationRule => {
  return {
    name,
    type: 'business',
    severity: 'error',
    validator: (data: any): ValidationResult => {
      const valid = predicate(data);
      return {
        valid,
        errors: valid
          ? []
          : [{ field: 'custom', message: errorMessage, code: 'CUSTOM_VALIDATION_FAILED' }],
        warnings: [],
      };
    },
    description: `Custom validation: ${name}`,
  };
};

/**
 * Generates validation report from validation results.
 *
 * @param {ValidationResult} result - Validation result
 * @returns {string} Markdown validation report
 *
 * @example
 * ```typescript
 * const report = generateValidationReport(validationResult);
 * // Human-readable validation report
 * ```
 */
export const generateValidationReport = (result: ValidationResult): string => {
  let report = `# Validation Report\n\n`;
  report += `**Status:** ${result.valid ? '✅ PASSED' : '❌ FAILED'}\n\n`;

  if (result.errors.length > 0) {
    report += `## Errors (${result.errors.length})\n\n`;
    result.errors.forEach((error) => {
      report += `- **${error.field}**: ${error.message} (${error.code})\n`;
    });
    report += `\n`;
  }

  if (result.warnings.length > 0) {
    report += `## Warnings (${result.warnings.length})\n\n`;
    result.warnings.forEach((warning) => {
      report += `- **${warning.field}**: ${warning.message}\n`;
      if (warning.suggestion) {
        report += `  - *Suggestion:* ${warning.suggestion}\n`;
      }
    });
  }

  return report;
};

// ============================================================================
// SCHEMA EVOLUTION MANAGEMENT
// ============================================================================

/**
 * Creates schema migration for contract evolution.
 *
 * @param {string} fromVersion - Source version
 * @param {string} toVersion - Target version
 * @param {SchemaMigration[]} migrations - Migration steps
 * @returns {SchemaEvolution} Schema evolution plan
 *
 * @example
 * ```typescript
 * const evolution = createSchemaEvolution('v1.0.0', 'v2.0.0', [
 *   { type: 'add_field', field: 'email', after: { type: 'string', required: false } },
 *   { type: 'rename_field', field: 'name', before: 'name', after: 'fullName' }
 * ]);
 * ```
 */
export const createSchemaEvolution = (
  fromVersion: string,
  toVersion: string,
  migrations: SchemaMigration[],
): SchemaEvolution => {
  const hasRemoval = migrations.some((m) => m.type === 'remove_field');
  const hasTypeChange = migrations.some((m) => m.type === 'change_type');

  return {
    fromVersion,
    toVersion,
    migrations,
    rollback: {
      possible: !hasRemoval && !hasTypeChange,
      steps: migrations.reverse().map((m) => `Reverse ${m.type} on ${m.field}`),
      dataLoss: hasRemoval,
    },
    tested: false,
  };
};

/**
 * Applies schema migration to data object.
 *
 * @param {any} data - Data object
 * @param {SchemaMigration} migration - Schema migration
 * @returns {any} Migrated data
 *
 * @example
 * ```typescript
 * const migrated = applySchemaMigration(
 *   { name: 'John Doe' },
 *   { type: 'rename_field', field: 'name', after: 'fullName' }
 * );
 * // Result: { fullName: 'John Doe' }
 * ```
 */
export const applySchemaMigration = (data: any, migration: SchemaMigration): any => {
  const result = { ...data };

  switch (migration.type) {
    case 'add_field':
      result[migration.field] = migration.after;
      break;
    case 'remove_field':
      delete result[migration.field];
      break;
    case 'rename_field':
      if (migration.before && result[migration.before]) {
        result[migration.field] = result[migration.before];
        delete result[migration.before];
      }
      break;
    case 'change_type':
      if (migration.transformer) {
        result[migration.field] = migration.transformer(result[migration.field]);
      }
      break;
  }

  return result;
};

/**
 * Validates schema evolution for safety.
 *
 * @param {SchemaEvolution} evolution - Schema evolution plan
 * @returns {{ safe: boolean; risks: string[]; recommendations: string[] }} Safety assessment
 *
 * @example
 * ```typescript
 * const assessment = validateSchemaEvolution(evolution);
 * if (!assessment.safe) {
 *   console.error('Migration risks:', assessment.risks);
 * }
 * ```
 */
export const validateSchemaEvolution = (
  evolution: SchemaEvolution,
): { safe: boolean; risks: string[]; recommendations: string[] } => {
  const risks: string[] = [];
  const recommendations: string[] = [];

  evolution.migrations.forEach((migration) => {
    if (migration.type === 'remove_field') {
      risks.push(`Removing field '${migration.field}' may break consumers`);
      recommendations.push(`Deprecate field '${migration.field}' before removal`);
    }
    if (migration.type === 'change_type') {
      risks.push(`Type change on '${migration.field}' may cause parsing errors`);
      recommendations.push(`Provide migration transformer for '${migration.field}'`);
    }
  });

  if (!evolution.tested) {
    risks.push('Schema evolution has not been tested');
    recommendations.push('Test migration on sample data before deployment');
  }

  return {
    safe: risks.length === 0,
    risks,
    recommendations,
  };
};

/**
 * Generates schema evolution documentation.
 *
 * @param {SchemaEvolution} evolution - Schema evolution plan
 * @returns {string} Markdown documentation
 *
 * @example
 * ```typescript
 * const docs = generateEvolutionDocumentation(evolution);
 * // Human-readable migration guide
 * ```
 */
export const generateEvolutionDocumentation = (evolution: SchemaEvolution): string => {
  let docs = `# Schema Evolution: ${evolution.fromVersion} → ${evolution.toVersion}\n\n`;

  docs += `## Migrations\n\n`;
  evolution.migrations.forEach((migration, index) => {
    docs += `${index + 1}. **${migration.type}** on field \`${migration.field}\`\n`;
    if (migration.before) docs += `   - Before: ${JSON.stringify(migration.before)}\n`;
    if (migration.after) docs += `   - After: ${JSON.stringify(migration.after)}\n`;
  });

  docs += `\n## Rollback\n\n`;
  docs += `- **Possible:** ${evolution.rollback.possible ? '✅ Yes' : '❌ No'}\n`;
  docs += `- **Data Loss:** ${evolution.rollback.dataLoss ? '⚠️ Yes' : '✅ No'}\n`;

  if (evolution.rollback.steps.length > 0) {
    docs += `\n### Rollback Steps\n\n`;
    evolution.rollback.steps.forEach((step, index) => {
      docs += `${index + 1}. ${step}\n`;
    });
  }

  return docs;
};

// ============================================================================
// BREAKING CHANGE DETECTION
// ============================================================================

/**
 * Detects breaking changes between contract versions.
 *
 * @param {ApiContract} oldContract - Old contract version
 * @param {ApiContract} newContract - New contract version
 * @returns {BreakingChange[]} Detected breaking changes
 *
 * @example
 * ```typescript
 * const changes = detectBreakingChanges(oldContract, newContract);
 * if (changes.length > 0) {
 *   console.error('Breaking changes detected:', changes);
 * }
 * ```
 */
export const detectBreakingChanges = (
  oldContract: ApiContract,
  newContract: ApiContract,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  // Check for removed interactions
  oldContract.interactions.forEach((oldInt) => {
    const exists = newContract.interactions.some(
      (newInt) =>
        newInt.request.method === oldInt.request.method &&
        newInt.request.path === oldInt.request.path,
    );

    if (!exists) {
      breakingChanges.push({
        change: {
          type: 'removal',
          target: 'endpoint',
          path: `${oldInt.request.method} ${oldInt.request.path}`,
          description: 'Endpoint removed',
          breaking: true,
        },
        impact: 'high',
        mitigation: 'Provide migration path or maintain endpoint with deprecation',
        affectedConsumers: [oldContract.consumer.name],
      });
    }
  });

  return breakingChanges;
};

/**
 * Categorizes contract changes by type and severity.
 *
 * @param {ContractChange[]} changes - Contract changes
 * @returns {Record<string, ContractChange[]>} Categorized changes
 *
 * @example
 * ```typescript
 * const categorized = categorizeContractChanges(changes);
 * console.log('Breaking changes:', categorized.breaking);
 * console.log('Non-breaking changes:', categorized.nonBreaking);
 * ```
 */
export const categorizeContractChanges = (
  changes: ContractChange[],
): Record<string, ContractChange[]> => {
  return {
    breaking: changes.filter((c) => c.breaking),
    nonBreaking: changes.filter((c) => !c.breaking),
    additions: changes.filter((c) => c.type === 'addition'),
    modifications: changes.filter((c) => c.type === 'modification'),
    removals: changes.filter((c) => c.type === 'removal'),
    deprecations: changes.filter((c) => c.type === 'deprecation'),
  };
};

/**
 * Generates breaking change report with impact analysis.
 *
 * @param {BreakingChange[]} changes - Breaking changes
 * @returns {string} Markdown report
 *
 * @example
 * ```typescript
 * const report = generateBreakingChangeReport(breakingChanges);
 * // Detailed report for stakeholders
 * ```
 */
export const generateBreakingChangeReport = (changes: BreakingChange[]): string => {
  let report = `# Breaking Changes Report\n\n`;
  report += `**Total Breaking Changes:** ${changes.length}\n\n`;

  const byImpact = {
    high: changes.filter((c) => c.impact === 'high'),
    medium: changes.filter((c) => c.impact === 'medium'),
    low: changes.filter((c) => c.impact === 'low'),
  };

  ['high', 'medium', 'low'].forEach((impact) => {
    const impactChanges = byImpact[impact as keyof typeof byImpact];
    if (impactChanges.length > 0) {
      report += `## ${impact.toUpperCase()} Impact Changes (${impactChanges.length})\n\n`;
      impactChanges.forEach((change, index) => {
        report += `### ${index + 1}. ${change.change.description}\n\n`;
        report += `- **Type:** ${change.change.type}\n`;
        report += `- **Target:** ${change.change.target}\n`;
        report += `- **Path:** \`${change.change.path}\`\n`;
        report += `- **Affected Consumers:** ${change.affectedConsumers.join(', ')}\n`;
        if (change.mitigation) {
          report += `- **Mitigation:** ${change.mitigation}\n`;
        }
        report += `\n`;
      });
    }
  });

  return report;
};

/**
 * Analyzes change impact on consumers.
 *
 * @param {BreakingChange} change - Breaking change
 * @param {string[]} consumers - Consumer services
 * @returns {{ affected: string[]; safe: string[]; unknown: string[] }} Impact analysis
 *
 * @example
 * ```typescript
 * const impact = analyzeChangeImpact(change, allConsumers);
 * console.log('Affected services:', impact.affected);
 * ```
 */
export const analyzeChangeImpact = (
  change: BreakingChange,
  consumers: string[],
): { affected: string[]; safe: string[]; unknown: string[] } => {
  return {
    affected: change.affectedConsumers,
    safe: consumers.filter((c) => !change.affectedConsumers.includes(c)),
    unknown: [],
  };
};

/**
 * Suggests mitigation strategies for breaking changes.
 *
 * @param {BreakingChange} change - Breaking change
 * @returns {string[]} Mitigation suggestions
 *
 * @example
 * ```typescript
 * const strategies = suggestBreakingChangeMitigation(change);
 * strategies.forEach(strategy => console.log(strategy));
 * ```
 */
export const suggestBreakingChangeMitigation = (change: BreakingChange): string[] => {
  const suggestions: string[] = [];

  if (change.change.type === 'removal') {
    suggestions.push('Implement deprecation period before removal');
    suggestions.push('Provide migration guide for affected consumers');
    suggestions.push('Consider maintaining endpoint with warning header');
  }

  if (change.change.type === 'modification') {
    suggestions.push('Version the API endpoint (e.g., /v2/resource)');
    suggestions.push('Support both old and new formats temporarily');
    suggestions.push('Provide backward compatibility layer');
  }

  if (change.impact === 'high') {
    suggestions.push('Coordinate deployment with all affected teams');
    suggestions.push('Implement feature flag for gradual rollout');
    suggestions.push('Prepare rollback plan');
  }

  return suggestions;
};

// ============================================================================
// CONTRACT TESTING UTILITIES
// ============================================================================

/**
 * Creates contract test for provider verification.
 *
 * @param {string} contractId - Contract identifier
 * @param {ContractInteraction[]} interactions - Contract interactions
 * @returns {ContractTest} Provider contract test
 *
 * @example
 * ```typescript
 * const test = createProviderContractTest(contractId, interactions);
 * // Execute against provider implementation
 * ```
 */
export const createProviderContractTest = (
  contractId: string,
  interactions: ContractInteraction[],
): ContractTest => {
  return {
    testId: `provider-test-${contractId}-${Date.now()}`,
    contractId,
    type: 'provider',
    interactions,
    assertions: interactions.map((interaction) => ({
      type: 'status',
      expected: interaction.response.status,
      matcher: 'equals',
    })),
    status: 'pending',
  };
};

/**
 * Creates contract test for consumer verification.
 *
 * @param {string} contractId - Contract identifier
 * @param {ContractInteraction[]} interactions - Contract interactions
 * @returns {ContractTest} Consumer contract test
 *
 * @example
 * ```typescript
 * const test = createConsumerContractTest(contractId, interactions);
 * // Execute against consumer implementation
 * ```
 */
export const createConsumerContractTest = (
  contractId: string,
  interactions: ContractInteraction[],
): ContractTest => {
  return {
    testId: `consumer-test-${contractId}-${Date.now()}`,
    contractId,
    type: 'consumer',
    interactions,
    assertions: interactions.map((interaction) => ({
      type: 'body',
      expected: interaction.response.body,
      matcher: 'contains',
    })),
    status: 'pending',
  };
};

/**
 * Generates test assertions from contract interactions.
 *
 * @param {ContractInteraction} interaction - Contract interaction
 * @returns {TestAssertion[]} Test assertions
 *
 * @example
 * ```typescript
 * const assertions = generateTestAssertions(interaction);
 * // Use in test framework (Jest, Mocha, etc.)
 * ```
 */
export const generateTestAssertions = (interaction: ContractInteraction): TestAssertion[] => {
  const assertions: TestAssertion[] = [];

  // Status assertion
  assertions.push({
    type: 'status',
    expected: interaction.response.status,
    matcher: 'equals',
  });

  // Header assertions
  if (interaction.response.headers) {
    Object.entries(interaction.response.headers).forEach(([header, value]) => {
      assertions.push({
        type: 'header',
        field: header,
        expected: value,
        matcher: 'equals',
      });
    });
  }

  // Schema assertion
  if (interaction.response.schema) {
    assertions.push({
      type: 'schema',
      expected: interaction.response.schema,
      matcher: 'type',
    });
  }

  return assertions;
};

/**
 * Executes contract test and returns results.
 *
 * @param {ContractTest} test - Contract test
 * @param {(interaction: ContractInteraction) => Promise<any>} executor - Test executor
 * @returns {Promise<{ passed: boolean; results: any[] }>} Test results
 *
 * @example
 * ```typescript
 * const results = await executeContractTest(test, async (interaction) => {
 *   return await fetch(interaction.request.path, { method: interaction.request.method });
 * });
 * ```
 */
export const executeContractTest = async (
  test: ContractTest,
  executor: (interaction: ContractInteraction) => Promise<any>,
): Promise<{ passed: boolean; results: any[] }> => {
  const results: any[] = [];

  for (const interaction of test.interactions) {
    try {
      const response = await executor(interaction);
      const passed = test.assertions.every((assertion) => {
        if (assertion.type === 'status') {
          return response.status === assertion.expected;
        }
        return true;
      });

      results.push({
        interaction: `${interaction.request.method} ${interaction.request.path}`,
        passed,
        response,
      });
    } catch (error) {
      results.push({
        interaction: `${interaction.request.method} ${interaction.request.path}`,
        passed: false,
        error,
      });
    }
  }

  return {
    passed: results.every((r) => r.passed),
    results,
  };
};

/**
 * Generates Pact test specification from contract.
 *
 * @param {ApiContract} contract - API contract
 * @returns {string} Pact test code
 *
 * @example
 * ```typescript
 * const pactTest = generatePactTestSpec(contract);
 * // Generate Pact test file for CI/CD
 * ```
 */
export const generatePactTestSpec = (contract: ApiContract): string => {
  let spec = `// Pact test for ${contract.contractId}\n`;
  spec += `import { Pact } from '@pact-foundation/pact';\n\n`;
  spec += `const provider = new Pact({\n`;
  spec += `  consumer: '${contract.consumer.name}',\n`;
  spec += `  provider: '${contract.provider.name}',\n`;
  spec += `});\n\n`;

  contract.interactions.forEach((interaction, index) => {
    spec += `describe('${interaction.description}', () => {\n`;
    spec += `  it('should return expected response', async () => {\n`;
    spec += `    await provider.addInteraction({\n`;
    spec += `      state: '${interaction.providerState || 'default state'}',\n`;
    spec += `      uponReceiving: '${interaction.description}',\n`;
    spec += `      withRequest: {\n`;
    spec += `        method: '${interaction.request.method}',\n`;
    spec += `        path: '${interaction.request.path}',\n`;
    spec += `      },\n`;
    spec += `      willRespondWith: {\n`;
    spec += `        status: ${interaction.response.status},\n`;
    spec += `      },\n`;
    spec += `    });\n`;
    spec += `  });\n`;
    spec += `});\n\n`;
  });

  return spec;
};

// ============================================================================
// CONSUMER-DRIVEN CONTRACTS
// ============================================================================

/**
 * Registers consumer contract in registry.
 *
 * @param {ApiContract} contract - Consumer contract
 * @param {ContractRegistry} registry - Contract registry
 * @returns {{ success: boolean; message: string }} Registration result
 *
 * @example
 * ```typescript
 * const result = registerConsumerContract(contract, registry);
 * console.log('Registration:', result.message);
 * ```
 */
export const registerConsumerContract = (
  contract: ApiContract,
  registry: ContractRegistry,
): { success: boolean; message: string } => {
  if (registry.contracts.has(contract.contractId)) {
    return {
      success: false,
      message: `Contract ${contract.contractId} already registered`,
    };
  }

  registry.contracts.set(contract.contractId, contract);

  // Update index
  const consumerContracts = registry.index.byConsumer.get(contract.consumer.name) || [];
  consumerContracts.push(contract.contractId);
  registry.index.byConsumer.set(contract.consumer.name, consumerContracts);

  return {
    success: true,
    message: `Contract ${contract.contractId} registered successfully`,
  };
};

/**
 * Verifies provider against all consumer contracts.
 *
 * @param {string} providerName - Provider service name
 * @param {ContractRegistry} registry - Contract registry
 * @param {(interaction: ContractInteraction) => Promise<any>} executor - Test executor
 * @returns {Promise<{ verified: boolean; failures: string[] }>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyProviderContracts('patient-service', registry, testExecutor);
 * if (!verification.verified) {
 *   console.error('Contract violations:', verification.failures);
 * }
 * ```
 */
export const verifyProviderContracts = async (
  providerName: string,
  registry: ContractRegistry,
  executor: (interaction: ContractInteraction) => Promise<any>,
): Promise<{ verified: boolean; failures: string[] }> => {
  const failures: string[] = [];
  const providerContracts = registry.index.byProvider.get(providerName) || [];

  for (const contractId of providerContracts) {
    const contract = registry.contracts.get(contractId);
    if (!contract) continue;

    const test = createProviderContractTest(contractId, contract.interactions);
    const results = await executeContractTest(test, executor);

    if (!results.passed) {
      failures.push(`Contract ${contractId} verification failed`);
    }
  }

  return {
    verified: failures.length === 0,
    failures,
  };
};

/**
 * Aggregates contracts from multiple consumers for same provider.
 *
 * @param {string} providerName - Provider service name
 * @param {ApiContract[]} contracts - Consumer contracts
 * @returns {ApiContract} Aggregated contract
 *
 * @example
 * ```typescript
 * const aggregated = aggregateConsumerContracts('patient-service', [contract1, contract2]);
 * // Combined contract with all consumer expectations
 * ```
 */
export const aggregateConsumerContracts = (
  providerName: string,
  contracts: ApiContract[],
): ApiContract => {
  const allInteractions: ContractInteraction[] = [];
  const allTags = new Set<string>();

  contracts.forEach((contract) => {
    allInteractions.push(...contract.interactions);
    contract.metadata.tags.forEach((tag) => allTags.add(tag));
  });

  return {
    contractId: `aggregated-${providerName}-${Date.now()}`,
    provider: { name: providerName, version: '1.0.0', team: '', contact: '' },
    consumer: { name: 'multiple-consumers', version: '1.0.0', team: '', contact: '' },
    version: '1.0.0',
    specification: { format: 'openapi', version: '3.0.0', schema: {}, examples: [] },
    interactions: allInteractions,
    metadata: {
      description: 'Aggregated consumer contracts',
      tags: Array.from(allTags),
      hipaaCompliant: contracts.some((c) => c.metadata.hipaaCompliant),
      phiHandling: contracts.some((c) => c.metadata.phiHandling),
      auditRequired: contracts.some((c) => c.metadata.auditRequired),
    },
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Detects contract conflicts between multiple consumers.
 *
 * @param {ApiContract[]} contracts - Consumer contracts
 * @returns {{ conflicts: string[]; resolutions: string[] }} Conflict analysis
 *
 * @example
 * ```typescript
 * const analysis = detectContractConflicts([contract1, contract2, contract3]);
 * if (analysis.conflicts.length > 0) {
 *   console.warn('Contract conflicts:', analysis.conflicts);
 * }
 * ```
 */
export const detectContractConflicts = (
  contracts: ApiContract[],
): { conflicts: string[]; resolutions: string[] } => {
  const conflicts: string[] = [];
  const resolutions: string[] = [];

  const interactionMap = new Map<string, ContractInteraction[]>();

  contracts.forEach((contract) => {
    contract.interactions.forEach((interaction) => {
      const key = `${interaction.request.method} ${interaction.request.path}`;
      const existing = interactionMap.get(key) || [];
      existing.push(interaction);
      interactionMap.set(key, existing);
    });
  });

  interactionMap.forEach((interactions, endpoint) => {
    if (interactions.length > 1) {
      const statuses = new Set(interactions.map((i) => i.response.status));
      if (statuses.size > 1) {
        conflicts.push(`Conflicting response status codes for ${endpoint}`);
        resolutions.push(`Standardize response status for ${endpoint} across consumers`);
      }
    }
  });

  return { conflicts, resolutions };
};

// ============================================================================
// CONTRACT REGISTRY MANAGEMENT
// ============================================================================

/**
 * Creates new contract registry instance.
 *
 * @returns {ContractRegistry} Empty contract registry
 *
 * @example
 * ```typescript
 * const registry = createContractRegistry();
 * // Central contract storage
 * ```
 */
export const createContractRegistry = (): ContractRegistry => {
  return {
    contracts: new Map(),
    versions: new Map(),
    index: {
      byProvider: new Map(),
      byConsumer: new Map(),
      byTag: new Map(),
      byStatus: new Map(),
    },
  };
};

/**
 * Queries contract registry with filters.
 *
 * @param {ContractRegistry} registry - Contract registry
 * @param {Record<string, any>} filters - Query filters
 * @returns {ApiContract[]} Matching contracts
 *
 * @example
 * ```typescript
 * const contracts = queryContractRegistry(registry, {
 *   provider: 'patient-service',
 *   status: 'published',
 *   tags: ['hipaa']
 * });
 * ```
 */
export const queryContractRegistry = (
  registry: ContractRegistry,
  filters: Record<string, any>,
): ApiContract[] => {
  let results: ApiContract[] = Array.from(registry.contracts.values());

  if (filters.provider) {
    const providerContracts = registry.index.byProvider.get(filters.provider) || [];
    results = results.filter((c) => providerContracts.includes(c.contractId));
  }

  if (filters.consumer) {
    const consumerContracts = registry.index.byConsumer.get(filters.consumer) || [];
    results = results.filter((c) => consumerContracts.includes(c.contractId));
  }

  if (filters.status) {
    results = results.filter((c) => c.status === filters.status);
  }

  if (filters.tags && Array.isArray(filters.tags)) {
    results = results.filter((c) =>
      filters.tags.every((tag: string) => c.metadata.tags.includes(tag)),
    );
  }

  return results;
};

/**
 * Publishes contract to registry with version tracking.
 *
 * @param {ApiContract} contract - Contract to publish
 * @param {ContractRegistry} registry - Contract registry
 * @returns {{ success: boolean; version: string; message: string }} Publication result
 *
 * @example
 * ```typescript
 * const result = publishContractToRegistry(contract, registry);
 * console.log('Published:', result.version);
 * ```
 */
export const publishContractToRegistry = (
  contract: ApiContract,
  registry: ContractRegistry,
): { success: boolean; version: string; message: string } => {
  contract.status = 'published';
  contract.updatedAt = new Date();

  registry.contracts.set(contract.contractId, contract);

  const versions = registry.versions.get(contract.contractId) || [];
  versions.push({
    version: contract.version,
    changes: [],
    breakingChanges: [],
    compatibility: { backward: true, forward: false, compatibleVersions: [] },
    publishedAt: new Date(),
    publishedBy: contract.provider.team,
  });
  registry.versions.set(contract.contractId, versions);

  return {
    success: true,
    version: contract.version,
    message: `Contract ${contract.contractId} published successfully`,
  };
};

/**
 * Retrieves version history for contract.
 *
 * @param {string} contractId - Contract identifier
 * @param {ContractRegistry} registry - Contract registry
 * @returns {ContractVersion[]} Version history
 *
 * @example
 * ```typescript
 * const history = getContractVersionHistory(contractId, registry);
 * history.forEach(version => console.log(version.version, version.publishedAt));
 * ```
 */
export const getContractVersionHistory = (
  contractId: string,
  registry: ContractRegistry,
): ContractVersion[] => {
  return registry.versions.get(contractId) || [];
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // API Contract Definitions
  createApiContract,
  convertOpenAPIToContract,
  createPactContract,
  serializeContract,
  deserializeContract,
  validateContractStructure,

  // Contract Versioning and Compatibility
  createContractVersion,
  compareContractVersions,
  checkBackwardCompatibility,
  generateCompatibilityMatrix,
  suggestContractVersion,

  // Contract Validation Rules
  createSchemaValidationRule,
  createHIPAAValidationRule,
  validateContract,
  createCustomValidationRule,
  generateValidationReport,

  // Schema Evolution Management
  createSchemaEvolution,
  applySchemaMigration,
  validateSchemaEvolution,
  generateEvolutionDocumentation,

  // Breaking Change Detection
  detectBreakingChanges,
  categorizeContractChanges,
  generateBreakingChangeReport,
  analyzeChangeImpact,
  suggestBreakingChangeMitigation,

  // Contract Testing Utilities
  createProviderContractTest,
  createConsumerContractTest,
  generateTestAssertions,
  executeContractTest,
  generatePactTestSpec,

  // Consumer-Driven Contracts
  registerConsumerContract,
  verifyProviderContracts,
  aggregateConsumerContracts,
  detectContractConflicts,

  // Contract Registry Management
  createContractRegistry,
  queryContractRegistry,
  publishContractToRegistry,
  getContractVersionHistory,
};
