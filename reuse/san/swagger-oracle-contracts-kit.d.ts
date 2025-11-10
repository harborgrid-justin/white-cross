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
export declare const createApiContract: (provider: ContractParty, consumer: ContractParty, specification: ContractSpecification, interactions: ContractInteraction[]) => ApiContract;
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
export declare const convertOpenAPIToContract: (openApiSpec: Record<string, any>, providerName: string, consumerName: string) => ApiContract;
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
export declare const createPactContract: (consumer: string, provider: string, interactions: ContractInteraction[]) => Record<string, any>;
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
export declare const serializeContract: (contract: ApiContract) => string;
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
export declare const deserializeContract: (json: string) => ApiContract;
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
export declare const validateContractStructure: (contract: ApiContract, requireHIPAACompliance?: boolean) => {
    valid: boolean;
    errors: string[];
};
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
export declare const createContractVersion: (contract: ApiContract, newVersion: string, changes: ContractChange[], publishedBy: string) => ContractVersion;
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
export declare const compareContractVersions: (version1: ApiContract, version2: ApiContract) => {
    compatible: boolean;
    breakingChanges: string[];
    warnings: string[];
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
export declare const checkBackwardCompatibility: (newContract: ApiContract, oldContract: ApiContract) => {
    backward: boolean;
    issues: string[];
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
export declare const generateCompatibilityMatrix: (versions: ContractVersion[]) => Record<string, Record<string, boolean>>;
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
export declare const suggestContractVersion: (currentVersion: string, changes: ContractChange[]) => {
    suggested: string;
    reason: string;
};
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
export declare const createSchemaValidationRule: (name: string, schema: Record<string, any>, severity: "error" | "warning" | "info") => ValidationRule;
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
export declare const createHIPAAValidationRule: (name: string, phiFields: string[]) => ValidationRule;
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
export declare const validateContract: (data: any, rules: ValidationRule[], context?: any) => ValidationResult;
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
export declare const createCustomValidationRule: (name: string, predicate: (data: any) => boolean, errorMessage: string) => ValidationRule;
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
export declare const generateValidationReport: (result: ValidationResult) => string;
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
export declare const createSchemaEvolution: (fromVersion: string, toVersion: string, migrations: SchemaMigration[]) => SchemaEvolution;
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
export declare const applySchemaMigration: (data: any, migration: SchemaMigration) => any;
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
export declare const validateSchemaEvolution: (evolution: SchemaEvolution) => {
    safe: boolean;
    risks: string[];
    recommendations: string[];
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
export declare const generateEvolutionDocumentation: (evolution: SchemaEvolution) => string;
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
export declare const detectBreakingChanges: (oldContract: ApiContract, newContract: ApiContract) => BreakingChange[];
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
export declare const categorizeContractChanges: (changes: ContractChange[]) => Record<string, ContractChange[]>;
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
export declare const generateBreakingChangeReport: (changes: BreakingChange[]) => string;
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
export declare const analyzeChangeImpact: (change: BreakingChange, consumers: string[]) => {
    affected: string[];
    safe: string[];
    unknown: string[];
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
export declare const suggestBreakingChangeMitigation: (change: BreakingChange) => string[];
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
export declare const createProviderContractTest: (contractId: string, interactions: ContractInteraction[]) => ContractTest;
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
export declare const createConsumerContractTest: (contractId: string, interactions: ContractInteraction[]) => ContractTest;
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
export declare const generateTestAssertions: (interaction: ContractInteraction) => TestAssertion[];
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
export declare const executeContractTest: (test: ContractTest, executor: (interaction: ContractInteraction) => Promise<any>) => Promise<{
    passed: boolean;
    results: any[];
}>;
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
export declare const generatePactTestSpec: (contract: ApiContract) => string;
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
export declare const registerConsumerContract: (contract: ApiContract, registry: ContractRegistry) => {
    success: boolean;
    message: string;
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
export declare const verifyProviderContracts: (providerName: string, registry: ContractRegistry, executor: (interaction: ContractInteraction) => Promise<any>) => Promise<{
    verified: boolean;
    failures: string[];
}>;
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
export declare const aggregateConsumerContracts: (providerName: string, contracts: ApiContract[]) => ApiContract;
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
export declare const detectContractConflicts: (contracts: ApiContract[]) => {
    conflicts: string[];
    resolutions: string[];
};
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
export declare const createContractRegistry: () => ContractRegistry;
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
export declare const queryContractRegistry: (registry: ContractRegistry, filters: Record<string, any>) => ApiContract[];
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
export declare const publishContractToRegistry: (contract: ApiContract, registry: ContractRegistry) => {
    success: boolean;
    version: string;
    message: string;
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
export declare const getContractVersionHistory: (contractId: string, registry: ContractRegistry) => ContractVersion[];
declare const _default: {
    createApiContract: (provider: ContractParty, consumer: ContractParty, specification: ContractSpecification, interactions: ContractInteraction[]) => ApiContract;
    convertOpenAPIToContract: (openApiSpec: Record<string, any>, providerName: string, consumerName: string) => ApiContract;
    createPactContract: (consumer: string, provider: string, interactions: ContractInteraction[]) => Record<string, any>;
    serializeContract: (contract: ApiContract) => string;
    deserializeContract: (json: string) => ApiContract;
    validateContractStructure: (contract: ApiContract, requireHIPAACompliance?: boolean) => {
        valid: boolean;
        errors: string[];
    };
    createContractVersion: (contract: ApiContract, newVersion: string, changes: ContractChange[], publishedBy: string) => ContractVersion;
    compareContractVersions: (version1: ApiContract, version2: ApiContract) => {
        compatible: boolean;
        breakingChanges: string[];
        warnings: string[];
    };
    checkBackwardCompatibility: (newContract: ApiContract, oldContract: ApiContract) => {
        backward: boolean;
        issues: string[];
    };
    generateCompatibilityMatrix: (versions: ContractVersion[]) => Record<string, Record<string, boolean>>;
    suggestContractVersion: (currentVersion: string, changes: ContractChange[]) => {
        suggested: string;
        reason: string;
    };
    createSchemaValidationRule: (name: string, schema: Record<string, any>, severity: "error" | "warning" | "info") => ValidationRule;
    createHIPAAValidationRule: (name: string, phiFields: string[]) => ValidationRule;
    validateContract: (data: any, rules: ValidationRule[], context?: any) => ValidationResult;
    createCustomValidationRule: (name: string, predicate: (data: any) => boolean, errorMessage: string) => ValidationRule;
    generateValidationReport: (result: ValidationResult) => string;
    createSchemaEvolution: (fromVersion: string, toVersion: string, migrations: SchemaMigration[]) => SchemaEvolution;
    applySchemaMigration: (data: any, migration: SchemaMigration) => any;
    validateSchemaEvolution: (evolution: SchemaEvolution) => {
        safe: boolean;
        risks: string[];
        recommendations: string[];
    };
    generateEvolutionDocumentation: (evolution: SchemaEvolution) => string;
    detectBreakingChanges: (oldContract: ApiContract, newContract: ApiContract) => BreakingChange[];
    categorizeContractChanges: (changes: ContractChange[]) => Record<string, ContractChange[]>;
    generateBreakingChangeReport: (changes: BreakingChange[]) => string;
    analyzeChangeImpact: (change: BreakingChange, consumers: string[]) => {
        affected: string[];
        safe: string[];
        unknown: string[];
    };
    suggestBreakingChangeMitigation: (change: BreakingChange) => string[];
    createProviderContractTest: (contractId: string, interactions: ContractInteraction[]) => ContractTest;
    createConsumerContractTest: (contractId: string, interactions: ContractInteraction[]) => ContractTest;
    generateTestAssertions: (interaction: ContractInteraction) => TestAssertion[];
    executeContractTest: (test: ContractTest, executor: (interaction: ContractInteraction) => Promise<any>) => Promise<{
        passed: boolean;
        results: any[];
    }>;
    generatePactTestSpec: (contract: ApiContract) => string;
    registerConsumerContract: (contract: ApiContract, registry: ContractRegistry) => {
        success: boolean;
        message: string;
    };
    verifyProviderContracts: (providerName: string, registry: ContractRegistry, executor: (interaction: ContractInteraction) => Promise<any>) => Promise<{
        verified: boolean;
        failures: string[];
    }>;
    aggregateConsumerContracts: (providerName: string, contracts: ApiContract[]) => ApiContract;
    detectContractConflicts: (contracts: ApiContract[]) => {
        conflicts: string[];
        resolutions: string[];
    };
    createContractRegistry: () => ContractRegistry;
    queryContractRegistry: (registry: ContractRegistry, filters: Record<string, any>) => ApiContract[];
    publishContractToRegistry: (contract: ApiContract, registry: ContractRegistry) => {
        success: boolean;
        version: string;
        message: string;
    };
    getContractVersionHistory: (contractId: string, registry: ContractRegistry) => ContractVersion[];
};
export default _default;
//# sourceMappingURL=swagger-oracle-contracts-kit.d.ts.map