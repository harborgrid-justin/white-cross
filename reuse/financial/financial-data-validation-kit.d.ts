/**
 * LOC: FINVAL4567890
 * File: /reuse/financial/financial-data-validation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial services
 *   - Data quality controllers
 *   - Validation middleware
 *   - Business rule engines
 */
/**
 * File: /reuse/financial/financial-data-validation-kit.ts
 * Locator: WC-FIN-FINVAL-001
 * Purpose: USACE CEFMS-Level Financial Data Validation - data validation, business rules,
 *          integrity checks, anomaly detection, reconciliation matching, audit trail validation
 *
 * Upstream: Independent utility module for financial data validation
 * Downstream: ../backend/*, validation services, data quality modules, compliance checkers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 47 utility functions for validation, business rules, integrity checks, anomaly detection
 *
 * LLM Context: Enterprise-grade financial data validation utilities competing with USACE CEFMS.
 * Provides comprehensive data validation, business rule enforcement, referential integrity checks,
 * duplicate detection, anomaly detection, cross-field validation, format validation, range checks,
 * fiscal period validation, account structure validation, transaction balancing, batch controls,
 * data quality scoring, validation rule engines, and automated data cleansing capabilities.
 */
import { Sequelize, Transaction } from 'sequelize';
interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    validatedAt: Date;
    validatedBy?: string;
    metadata?: Record<string, any>;
}
interface ValidationError {
    field: string;
    value: any;
    rule: string;
    message: string;
    severity: 'ERROR' | 'CRITICAL';
    code: string;
}
interface ValidationWarning {
    field: string;
    value: any;
    rule: string;
    message: string;
    code: string;
}
interface BusinessRule {
    ruleId: string;
    ruleName: string;
    ruleType: 'VALIDATION' | 'CALCULATION' | 'CONSTRAINT' | 'AUTHORIZATION';
    enabled: boolean;
    priority: number;
    conditions: RuleCondition[];
    actions: RuleAction[];
    effectiveDate?: Date;
    expirationDate?: Date;
}
interface RuleCondition {
    field: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN' | 'CONTAINS' | 'REGEX';
    value: any;
    logicalOperator?: 'AND' | 'OR';
}
interface RuleAction {
    actionType: 'REJECT' | 'WARN' | 'MODIFY' | 'NOTIFY' | 'LOG';
    parameters: Record<string, any>;
}
interface DataQualityScore {
    overallScore: number;
    completeness: number;
    accuracy: number;
    consistency: number;
    timeliness: number;
    validity: number;
    uniqueness: number;
    scoreDate: Date;
    recommendations: string[];
}
interface IntegrityCheck {
    checkId: string;
    checkType: 'REFERENTIAL' | 'BALANCE' | 'DUPLICATE' | 'ORPHAN' | 'CONSTRAINT';
    entityType: string;
    passed: boolean;
    violations: IntegrityViolation[];
    checkedAt: Date;
}
interface IntegrityViolation {
    violationId: string;
    recordId: string;
    violationType: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    resolution?: string;
}
interface AnomalyDetection {
    anomalyId: string;
    detectionMethod: 'STATISTICAL' | 'RULE_BASED' | 'PATTERN' | 'ML';
    anomalyType: 'OUTLIER' | 'SPIKE' | 'TREND' | 'PATTERN' | 'DUPLICATE';
    field: string;
    expectedValue?: number;
    actualValue: number;
    deviation: number;
    confidence: number;
    timestamp: Date;
}
interface DuplicateCheck {
    isDuplicate: boolean;
    matchScore: number;
    matchFields: string[];
    existingRecordId?: string;
    conflictingValues?: Record<string, {
        existing: any;
        new: any;
    }>;
}
interface FiscalPeriodValidation {
    fiscalYear: number;
    fiscalPeriod: number;
    isOpen: boolean;
    isPermanentlyClosed: boolean;
    closeDate?: Date;
    errors: string[];
}
interface BatchControl {
    batchId: string;
    recordCount: number;
    totalDebit: number;
    totalCredit: number;
    isBalanced: boolean;
    variance: number;
    hashTotal?: string;
    controlTotals: Record<string, number>;
}
/**
 * Sequelize model for Validation Rules with conditions and actions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ValidationRule model
 *
 * @example
 * ```typescript
 * const ValidationRule = createValidationRuleModel(sequelize);
 * const rule = await ValidationRule.create({
 *   ruleId: 'RULE-001',
 *   ruleName: 'Transaction Amount Limit',
 *   ruleType: 'VALIDATION',
 *   enabled: true,
 *   conditions: [{ field: 'amount', operator: 'GREATER_THAN', value: 1000000 }]
 * });
 * ```
 */
export declare const createValidationRuleModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        ruleId: string;
        ruleName: string;
        ruleDescription: string;
        ruleType: string;
        category: string;
        enabled: boolean;
        priority: number;
        conditions: RuleCondition[];
        actions: RuleAction[];
        effectiveDate: Date | null;
        expirationDate: Date | null;
        entityType: string;
        severity: string;
        errorMessage: string;
        warningMessage: string | null;
        executionCount: number;
        violationCount: number;
        lastExecutedAt: Date | null;
        createdBy: string;
        modifiedBy: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Data Quality Metrics tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DataQualityMetric model
 *
 * @example
 * ```typescript
 * const DataQualityMetric = createDataQualityMetricModel(sequelize);
 * const metric = await DataQualityMetric.create({
 *   entityType: 'TRANSACTION',
 *   metricDate: new Date(),
 *   completenessScore: 98.5,
 *   accuracyScore: 96.2,
 *   recordCount: 1000
 * });
 * ```
 */
export declare const createDataQualityMetricModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        metricId: string;
        entityType: string;
        entityId: string | null;
        metricDate: Date;
        metricPeriod: string;
        recordCount: number;
        completenessScore: number;
        accuracyScore: number;
        consistencyScore: number;
        timelinessScore: number;
        validityScore: number;
        uniquenessScore: number;
        overallScore: number;
        nullFieldCount: number;
        invalidFieldCount: number;
        duplicateCount: number;
        outlierCount: number;
        issuesDetected: number;
        issuesResolved: number;
        recommendations: string[];
        calculatedBy: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Validation Exceptions tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ValidationException model
 *
 * @example
 * ```typescript
 * const ValidationException = createValidationExceptionModel(sequelize);
 * const exception = await ValidationException.create({
 *   exceptionId: 'EXC-001',
 *   entityType: 'TRANSACTION',
 *   entityId: 'TXN-123',
 *   ruleId: 'RULE-001',
 *   status: 'OPEN'
 * });
 * ```
 */
export declare const createValidationExceptionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        exceptionId: string;
        entityType: string;
        entityId: string;
        ruleId: string;
        ruleName: string;
        field: string;
        invalidValue: any;
        expectedValue: any;
        errorMessage: string;
        severity: string;
        status: string;
        detectedAt: Date;
        detectedBy: string;
        assignedTo: string | null;
        resolvedAt: Date | null;
        resolvedBy: string | null;
        resolution: string | null;
        resolutionAction: string | null;
        comments: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Validates required fields are present and not null/empty.
 *
 * @param {Record<string, any>} data - Data to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRequiredFields(
 *   { name: 'Test', amount: 100 },
 *   ['name', 'amount', 'date']
 * );
 * if (!result.isValid) console.error(result.errors);
 * ```
 */
export declare const validateRequiredFields: (data: Record<string, any>, requiredFields: string[]) => ValidationResult;
/**
 * Validates field data types match expected types.
 *
 * @param {Record<string, any>} data - Data to validate
 * @param {Record<string, string>} fieldTypes - Expected types by field name
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFieldTypes(data, {
 *   amount: 'number',
 *   date: 'date',
 *   description: 'string'
 * });
 * ```
 */
export declare const validateFieldTypes: (data: Record<string, any>, fieldTypes: Record<string, string>) => ValidationResult;
/**
 * Validates numeric fields are within specified ranges.
 *
 * @param {Record<string, number>} data - Numeric data to validate
 * @param {Record<string, {min?: number; max?: number}>} ranges - Range constraints
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateNumericRanges(
 *   { amount: 500 },
 *   { amount: { min: 0, max: 1000000 } }
 * );
 * ```
 */
export declare const validateNumericRanges: (data: Record<string, number>, ranges: Record<string, {
    min?: number;
    max?: number;
}>) => ValidationResult;
/**
 * Validates string lengths are within specified limits.
 *
 * @param {Record<string, string>} data - String data to validate
 * @param {Record<string, {min?: number; max?: number}>} lengths - Length constraints
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateStringLengths(
 *   { description: 'Test' },
 *   { description: { min: 10, max: 500 } }
 * );
 * ```
 */
export declare const validateStringLengths: (data: Record<string, string>, lengths: Record<string, {
    min?: number;
    max?: number;
}>) => ValidationResult;
/**
 * Validates field values match specified patterns/regex.
 *
 * @param {Record<string, string>} data - Data to validate
 * @param {Record<string, RegExp | string>} patterns - Regex patterns by field
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePatterns(
 *   { email: 'user@example.com', phone: '555-1234' },
 *   { email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, phone: /^\d{3}-\d{4}$/ }
 * );
 * ```
 */
export declare const validatePatterns: (data: Record<string, string>, patterns: Record<string, RegExp | string>) => ValidationResult;
/**
 * Validates date fields are valid dates and within allowed range.
 *
 * @param {Record<string, Date | string>} data - Date data to validate
 * @param {Record<string, {min?: Date; max?: Date}>} dateRanges - Date range constraints
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateDates(
 *   { transactionDate: new Date() },
 *   { transactionDate: { min: new Date('2024-01-01'), max: new Date() } }
 * );
 * ```
 */
export declare const validateDates: (data: Record<string, Date | string>, dateRanges: Record<string, {
    min?: Date;
    max?: Date;
}>) => ValidationResult;
/**
 * Validates enum/choice fields contain allowed values.
 *
 * @param {Record<string, any>} data - Data to validate
 * @param {Record<string, any[]>} allowedValues - Allowed values by field
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEnumValues(
 *   { status: 'PENDING' },
 *   { status: ['PENDING', 'APPROVED', 'REJECTED'] }
 * );
 * ```
 */
export declare const validateEnumValues: (data: Record<string, any>, allowedValues: Record<string, any[]>) => ValidationResult;
/**
 * Validates decimal precision and scale.
 *
 * @param {Record<string, number>} data - Decimal data to validate
 * @param {Record<string, {precision: number; scale: number}>} formats - Decimal formats
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateDecimalPrecision(
 *   { amount: 12345.67 },
 *   { amount: { precision: 10, scale: 2 } }
 * );
 * ```
 */
export declare const validateDecimalPrecision: (data: Record<string, number>, formats: Record<string, {
    precision: number;
    scale: number;
}>) => ValidationResult;
/**
 * Validates dependent field requirements (if A then B required).
 *
 * @param {Record<string, any>} data - Data to validate
 * @param {Array<{trigger: string; required: string[]}>} dependencies - Field dependencies
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateDependentFields(
 *   { paymentType: 'CHECK', checkNumber: '123' },
 *   [{ trigger: 'paymentType', required: ['checkNumber'] }]
 * );
 * ```
 */
export declare const validateDependentFields: (data: Record<string, any>, dependencies: Array<{
    trigger: string;
    triggerValue?: any;
    required: string[];
}>) => ValidationResult;
/**
 * Validates mutually exclusive fields (only one can be set).
 *
 * @param {Record<string, any>} data - Data to validate
 * @param {string[][]} exclusiveGroups - Groups of mutually exclusive fields
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateMutuallyExclusiveFields(
 *   { checkNumber: '123', wireNumber: 'W456' },
 *   [['checkNumber', 'wireNumber', 'achNumber']]
 * );
 * ```
 */
export declare const validateMutuallyExclusiveFields: (data: Record<string, any>, exclusiveGroups: string[][]) => ValidationResult;
/**
 * Validates field value comparisons (e.g., start < end).
 *
 * @param {Record<string, any>} data - Data to validate
 * @param {Array<{field1: string; operator: string; field2: string}>} comparisons - Comparisons
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFieldComparisons(
 *   { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') },
 *   [{ field1: 'startDate', operator: '<', field2: 'endDate' }]
 * );
 * ```
 */
export declare const validateFieldComparisons: (data: Record<string, any>, comparisons: Array<{
    field1: string;
    operator: string;
    field2: string;
}>) => ValidationResult;
/**
 * Validates sum of fields equals expected total.
 *
 * @param {Record<string, number>} data - Numeric data
 * @param {string[]} sumFields - Fields to sum
 * @param {string} totalField - Expected total field
 * @param {number} [tolerance=0.01] - Allowed variance
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSumEquals(
 *   { debit: 100, credit: 100, total: 200 },
 *   ['debit', 'credit'], 'total'
 * );
 * ```
 */
export declare const validateSumEquals: (data: Record<string, number>, sumFields: string[], totalField: string, tolerance?: number) => ValidationResult;
/**
 * Validates transaction debits equal credits (balanced).
 *
 * @param {Array<{debit?: number; credit?: number}>} entries - Journal entries
 * @param {number} [tolerance=0.01] - Allowed variance
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateBalancedTransaction([
 *   { debit: 100, credit: 0 },
 *   { debit: 0, credit: 100 }
 * ]);
 * ```
 */
export declare const validateBalancedTransaction: (entries: Array<{
    debit?: number;
    credit?: number;
}>, tolerance?: number) => ValidationResult;
/**
 * Validates calculated field matches expected formula.
 *
 * @param {Record<string, number>} data - Data with calculated field
 * @param {string} calculatedField - Field that should be calculated
 * @param {Function} formula - Formula to calculate expected value
 * @param {number} [tolerance=0.01] - Allowed variance
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCalculatedField(
 *   { quantity: 10, unitPrice: 5, total: 50 },
 *   'total',
 *   (data) => data.quantity * data.unitPrice
 * );
 * ```
 */
export declare const validateCalculatedField: (data: Record<string, number>, calculatedField: string, formula: (data: Record<string, number>) => number, tolerance?: number) => ValidationResult;
/**
 * Evaluates business rule conditions against data.
 *
 * @param {BusinessRule} rule - Business rule to evaluate
 * @param {Record<string, any>} data - Data to validate
 * @returns {Promise<boolean>} Whether rule conditions are met
 *
 * @example
 * ```typescript
 * const rule = {
 *   ruleId: 'RULE-001',
 *   conditions: [{ field: 'amount', operator: 'GREATER_THAN', value: 1000 }]
 * };
 * const passes = await evaluateBusinessRule(rule, { amount: 1500 });
 * ```
 */
export declare const evaluateBusinessRule: (rule: BusinessRule, data: Record<string, any>) => Promise<boolean>;
/**
 * Evaluates single rule condition.
 *
 * @param {RuleCondition} condition - Condition to evaluate
 * @param {Record<string, any>} data - Data to check
 * @returns {boolean} Whether condition is met
 *
 * @example
 * ```typescript
 * const conditionMet = evaluateCondition(
 *   { field: 'status', operator: 'EQUALS', value: 'APPROVED' },
 *   { status: 'APPROVED' }
 * );
 * ```
 */
export declare const evaluateCondition: (condition: RuleCondition, data: Record<string, any>) => boolean;
/**
 * Validates data against multiple business rules.
 *
 * @param {Record<string, any>} data - Data to validate
 * @param {BusinessRule[]} rules - Business rules to apply
 * @param {any} ValidationRule - ValidationRule model
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateBusinessRules(transactionData, rules, ValidationRule);
 * ```
 */
export declare const validateBusinessRules: (data: Record<string, any>, rules: BusinessRule[], ValidationRule: any) => Promise<ValidationResult>;
/**
 * Creates custom validation rule dynamically.
 *
 * @param {Partial<BusinessRule>} ruleData - Rule configuration
 * @param {any} ValidationRule - ValidationRule model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<BusinessRule>} Created rule
 *
 * @example
 * ```typescript
 * const rule = await createValidationRule({
 *   ruleName: 'Amount Threshold',
 *   ruleType: 'VALIDATION',
 *   conditions: [{ field: 'amount', operator: 'GREATER_THAN', value: 10000 }],
 *   actions: [{ actionType: 'WARN', parameters: { message: 'High value' } }]
 * }, ValidationRule);
 * ```
 */
export declare const createValidationRule: (ruleData: Partial<BusinessRule>, ValidationRule: any, transaction?: Transaction) => Promise<BusinessRule>;
/**
 * Disables or enables validation rule.
 *
 * @param {string} ruleId - Rule identifier
 * @param {boolean} enabled - Whether to enable rule
 * @param {any} ValidationRule - ValidationRule model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await toggleValidationRule('RULE-001', false, ValidationRule);
 * ```
 */
export declare const toggleValidationRule: (ruleId: string, enabled: boolean, ValidationRule: any, transaction?: Transaction) => Promise<void>;
/**
 * Generates business rule execution report.
 *
 * @param {Date} startDate - Report period start
 * @param {Date} endDate - Report period end
 * @param {any} ValidationRule - ValidationRule model
 * @returns {Promise<object>} Rule execution report
 *
 * @example
 * ```typescript
 * const report = await generateRuleExecutionReport(startDate, endDate, ValidationRule);
 * ```
 */
export declare const generateRuleExecutionReport: (startDate: Date, endDate: Date, ValidationRule: any) => Promise<object>;
/**
 * Validates foreign key references exist in parent table.
 *
 * @param {string} foreignKey - Foreign key value
 * @param {any} ParentModel - Parent table model
 * @param {string} parentKeyField - Parent table key field name
 * @returns {Promise<boolean>} Whether reference exists
 *
 * @example
 * ```typescript
 * const exists = await validateForeignKeyReference(
 *   'ACCT-001', AccountModel, 'accountId'
 * );
 * ```
 */
export declare const validateForeignKeyReference: (foreignKey: string, ParentModel: any, parentKeyField: string) => Promise<boolean>;
/**
 * Checks for orphaned records missing parent references.
 *
 * @param {any} ChildModel - Child table model
 * @param {string} foreignKeyField - Foreign key field in child
 * @param {any} ParentModel - Parent table model
 * @param {string} parentKeyField - Parent key field
 * @returns {Promise<IntegrityCheck>} Integrity check result
 *
 * @example
 * ```typescript
 * const check = await checkOrphanedRecords(
 *   TransactionModel, 'accountId', AccountModel, 'accountId'
 * );
 * ```
 */
export declare const checkOrphanedRecords: (ChildModel: any, foreignKeyField: string, ParentModel: any, parentKeyField: string) => Promise<IntegrityCheck>;
/**
 * Validates circular references in hierarchical data.
 *
 * @param {string} recordId - Record identifier
 * @param {string} parentField - Parent reference field
 * @param {any} Model - Hierarchical model
 * @returns {Promise<boolean>} Whether circular reference exists
 *
 * @example
 * ```typescript
 * const hasCircular = await validateCircularReferences(
 *   'ORG-001', 'parentOrgId', OrganizationModel
 * );
 * ```
 */
export declare const validateCircularReferences: (recordId: string, parentField: string, Model: any) => Promise<boolean>;
/**
 * Validates cascade delete dependencies before deletion.
 *
 * @param {string} parentId - Parent record identifier
 * @param {any} ParentModel - Parent model
 * @param {Array<{model: any; foreignKey: string}>} dependentModels - Dependent models
 * @returns {Promise<object>} Dependency analysis
 *
 * @example
 * ```typescript
 * const deps = await validateCascadeDelete('ACCT-001', AccountModel, [
 *   { model: TransactionModel, foreignKey: 'accountId' }
 * ]);
 * ```
 */
export declare const validateCascadeDelete: (parentId: string, ParentModel: any, dependentModels: Array<{
    model: any;
    foreignKey: string;
}>) => Promise<object>;
/**
 * Performs comprehensive referential integrity check.
 *
 * @param {any} database - Sequelize database instance
 * @param {Array<{child: any; childFK: string; parent: any; parentKey: string}>} relationships
 * @returns {Promise<IntegrityCheck[]>} All integrity check results
 *
 * @example
 * ```typescript
 * const checks = await performIntegrityCheck(db, [
 *   { child: TransactionModel, childFK: 'accountId', parent: AccountModel, parentKey: 'accountId' }
 * ]);
 * ```
 */
export declare const performIntegrityCheck: (database: any, relationships: Array<{
    child: any;
    childFK: string;
    parent: any;
    parentKey: string;
}>) => Promise<IntegrityCheck[]>;
/**
 * Detects exact duplicate records based on key fields.
 *
 * @param {Record<string, any>} data - Data to check
 * @param {string[]} keyFields - Fields to use for duplicate detection
 * @param {any} Model - Model to search
 * @returns {Promise<DuplicateCheck>} Duplicate check result
 *
 * @example
 * ```typescript
 * const dupCheck = await detectExactDuplicate(
 *   { invoiceNumber: 'INV-001', vendorId: 'V-001' },
 *   ['invoiceNumber', 'vendorId'],
 *   InvoiceModel
 * );
 * ```
 */
export declare const detectExactDuplicate: (data: Record<string, any>, keyFields: string[], Model: any) => Promise<DuplicateCheck>;
/**
 * Detects fuzzy duplicates using similarity scoring.
 *
 * @param {Record<string, any>} data - Data to check
 * @param {string[]} compareFields - Fields to compare
 * @param {any} Model - Model to search
 * @param {number} [threshold=0.85] - Similarity threshold
 * @returns {Promise<DuplicateCheck>} Duplicate check result
 *
 * @example
 * ```typescript
 * const fuzzyCheck = await detectFuzzyDuplicate(
 *   { vendorName: 'ACME Corp', amount: 1000 },
 *   ['vendorName', 'amount'],
 *   VendorModel,
 *   0.90
 * );
 * ```
 */
export declare const detectFuzzyDuplicate: (data: Record<string, any>, compareFields: string[], Model: any, threshold?: number) => Promise<DuplicateCheck>;
/**
 * Calculates similarity score between two records.
 *
 * @param {Record<string, any>} record1 - First record
 * @param {Record<string, any>} record2 - Second record
 * @param {string[]} fields - Fields to compare
 * @returns {number} Similarity score (0-1)
 *
 * @example
 * ```typescript
 * const score = calculateSimilarityScore(record1, record2, ['name', 'amount']);
 * ```
 */
export declare const calculateSimilarityScore: (record1: Record<string, any>, record2: Record<string, any>, fields: string[]) => number;
/**
 * Finds all duplicate groups in a dataset.
 *
 * @param {any} Model - Model to search
 * @param {string[]} groupByFields - Fields to group by
 * @returns {Promise<Array<{key: string; count: number; records: any[]}>>} Duplicate groups
 *
 * @example
 * ```typescript
 * const groups = await findDuplicateGroups(TransactionModel, ['checkNumber', 'amount']);
 * ```
 */
export declare const findDuplicateGroups: (Model: any, groupByFields: string[]) => Promise<Array<{
    key: string;
    count: number;
    records: any[];
}>>;
/**
 * Merges duplicate records into single master record.
 *
 * @param {string[]} duplicateIds - IDs of duplicate records
 * @param {string} masterId - ID of master record to keep
 * @param {any} Model - Model containing records
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<object>} Merge result
 *
 * @example
 * ```typescript
 * const result = await mergeDuplicateRecords(
 *   ['DUP-001', 'DUP-002'], 'MASTER-001', CustomerModel
 * );
 * ```
 */
export declare const mergeDuplicateRecords: (duplicateIds: string[], masterId: string, Model: any, transaction?: Transaction) => Promise<object>;
/**
 * Detects statistical outliers using z-score method.
 *
 * @param {number[]} values - Numeric values
 * @param {number} [threshold=3] - Z-score threshold
 * @returns {Promise<number[]>} Indices of outliers
 *
 * @example
 * ```typescript
 * const outliers = await detectStatisticalOutliers([10, 12, 11, 100, 13, 9], 3);
 * ```
 */
export declare const detectStatisticalOutliers: (values: number[], threshold?: number) => Promise<number[]>;
/**
 * Detects anomalies in time series data.
 *
 * @param {Array<{date: Date; value: number}>} timeSeries - Time series data
 * @param {number} [window=7] - Moving average window
 * @param {number} [deviationThreshold=2] - Standard deviation threshold
 * @returns {Promise<AnomalyDetection[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectTimeSeriesAnomalies(dailyTransactions, 7, 2);
 * ```
 */
export declare const detectTimeSeriesAnomalies: (timeSeries: Array<{
    date: Date;
    value: number;
}>, window?: number, deviationThreshold?: number) => Promise<AnomalyDetection[]>;
/**
 * Detects sudden spikes or drops in values.
 *
 * @param {number[]} values - Sequential values
 * @param {number} [changeThreshold=0.5] - Threshold for % change (0.5 = 50%)
 * @returns {Promise<AnomalyDetection[]>} Detected spikes/drops
 *
 * @example
 * ```typescript
 * const spikes = await detectValueSpikes([100, 105, 500, 110], 0.5);
 * ```
 */
export declare const detectValueSpikes: (values: number[], changeThreshold?: number) => Promise<AnomalyDetection[]>;
/**
 * Detects unusual patterns in categorical data.
 *
 * @param {Array<{category: string; count: number}>} distribution - Category distribution
 * @param {number} [threshold=0.05] - Minimum expected frequency (5%)
 * @returns {Promise<AnomalyDetection[]>} Unusual categories
 *
 * @example
 * ```typescript
 * const unusual = await detectPatternAnomalies([
 *   { category: 'NORMAL', count: 1000 },
 *   { category: 'RARE', count: 1 }
 * ]);
 * ```
 */
export declare const detectPatternAnomalies: (distribution: Array<{
    category: string;
    count: number;
}>, threshold?: number) => Promise<AnomalyDetection[]>;
/**
 * Generates anomaly detection report.
 *
 * @param {AnomalyDetection[]} anomalies - Detected anomalies
 * @returns {Promise<object>} Anomaly report
 *
 * @example
 * ```typescript
 * const report = await generateAnomalyReport(detectedAnomalies);
 * ```
 */
export declare const generateAnomalyReport: (anomalies: AnomalyDetection[]) => Promise<object>;
/**
 * Calculates data completeness score.
 *
 * @param {Record<string, any>} data - Data to score
 * @param {string[]} requiredFields - Required fields
 * @returns {Promise<number>} Completeness score (0-100)
 *
 * @example
 * ```typescript
 * const score = await calculateCompletenessScore(
 *   { name: 'Test', email: null, phone: '555-1234' },
 *   ['name', 'email', 'phone']
 * );
 * ```
 */
export declare const calculateCompletenessScore: (data: Record<string, any>, requiredFields: string[]) => Promise<number>;
/**
 * Calculates data accuracy score based on validation rules.
 *
 * @param {Record<string, any>} data - Data to score
 * @param {ValidationResult} validationResult - Validation result
 * @returns {Promise<number>} Accuracy score (0-100)
 *
 * @example
 * ```typescript
 * const score = await calculateAccuracyScore(data, validationResult);
 * ```
 */
export declare const calculateAccuracyScore: (data: Record<string, any>, validationResult: ValidationResult) => Promise<number>;
/**
 * Calculates data consistency score across related records.
 *
 * @param {any[]} records - Related records to check
 * @param {string[]} consistencyFields - Fields that should be consistent
 * @returns {Promise<number>} Consistency score (0-100)
 *
 * @example
 * ```typescript
 * const score = await calculateConsistencyScore(transactions, ['accountId', 'currency']);
 * ```
 */
export declare const calculateConsistencyScore: (records: any[], consistencyFields: string[]) => Promise<number>;
/**
 * Calculates data timeliness score based on age.
 *
 * @param {Date} recordDate - Record creation/modification date
 * @param {number} maxAgeDays - Maximum acceptable age in days
 * @returns {Promise<number>} Timeliness score (0-100)
 *
 * @example
 * ```typescript
 * const score = await calculateTimelinessScore(new Date('2024-01-01'), 30);
 * ```
 */
export declare const calculateTimelinessScore: (recordDate: Date, maxAgeDays: number) => Promise<number>;
/**
 * Calculates comprehensive data quality score.
 *
 * @param {Record<string, any>} data - Data to score
 * @param {object} options - Scoring options
 * @param {any} DataQualityMetric - DataQualityMetric model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<DataQualityScore>} Complete quality score
 *
 * @example
 * ```typescript
 * const score = await calculateDataQualityScore(data, {
 *   requiredFields: ['name', 'email'],
 *   validationResult,
 *   recordDate: new Date(),
 *   maxAgeDays: 30
 * }, DataQualityMetric);
 * ```
 */
export declare const calculateDataQualityScore: (data: Record<string, any>, options: {
    requiredFields?: string[];
    validationResult?: ValidationResult;
    recordDate?: Date;
    maxAgeDays?: number;
}, DataQualityMetric: any, transaction?: Transaction) => Promise<DataQualityScore>;
/**
 * Validates batch control totals match detail records.
 *
 * @param {BatchControl} batchControl - Batch control header
 * @param {Array<{debit?: number; credit?: number}>} details - Batch detail records
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateBatchControls({
 *   batchId: 'BATCH-001',
 *   recordCount: 10,
 *   totalDebit: 10000,
 *   totalCredit: 10000
 * }, detailRecords);
 * ```
 */
export declare const validateBatchControls: (batchControl: BatchControl, details: Array<{
    debit?: number;
    credit?: number;
}>) => Promise<ValidationResult>;
/**
 * Validates batch is balanced (debits = credits).
 *
 * @param {Array<{debit?: number; credit?: number}>} details - Batch records
 * @param {number} [tolerance=0.01] - Allowed variance
 * @returns {Promise<boolean>} Whether batch is balanced
 *
 * @example
 * ```typescript
 * const balanced = await validateBatchBalance(batchRecords);
 * ```
 */
export declare const validateBatchBalance: (details: Array<{
    debit?: number;
    credit?: number;
}>, tolerance?: number) => Promise<boolean>;
/**
 * Calculates hash total for batch verification.
 *
 * @param {any[]} records - Records to hash
 * @param {string} hashField - Field to sum for hash
 * @returns {Promise<string>} Hash total
 *
 * @example
 * ```typescript
 * const hash = await calculateBatchHash(records, 'accountNumber');
 * ```
 */
export declare const calculateBatchHash: (records: any[], hashField: string) => Promise<string>;
/**
 * Validates batch sequence numbers are consecutive.
 *
 * @param {Array<{sequenceNumber: number}>} records - Records with sequence numbers
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateBatchSequence(batchRecords);
 * ```
 */
export declare const validateBatchSequence: (records: Array<{
    sequenceNumber: number;
}>) => Promise<ValidationResult>;
/**
 * Validates fiscal period is open for transactions.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period (1-12)
 * @param {any} FiscalPeriod - FiscalPeriod model
 * @returns {Promise<FiscalPeriodValidation>} Period validation result
 *
 * @example
 * ```typescript
 * const validation = await validateFiscalPeriod(2024, 3, FiscalPeriodModel);
 * if (!validation.isOpen) throw new Error('Period closed');
 * ```
 */
export declare const validateFiscalPeriod: (fiscalYear: number, fiscalPeriod: number, FiscalPeriod: any) => Promise<FiscalPeriodValidation>;
/**
 * Validates transaction date falls within fiscal period.
 *
 * @param {Date} transactionDate - Transaction date
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {any} FiscalPeriod - FiscalPeriod model
 * @returns {Promise<boolean>} Whether date is valid for period
 *
 * @example
 * ```typescript
 * const valid = await validateTransactionDateInPeriod(
 *   new Date('2024-03-15'), 2024, 3, FiscalPeriodModel
 * );
 * ```
 */
export declare const validateTransactionDateInPeriod: (transactionDate: Date, fiscalYear: number, fiscalPeriod: number, FiscalPeriod: any) => Promise<boolean>;
/**
 * Gets current open fiscal period.
 *
 * @param {any} FiscalPeriod - FiscalPeriod model
 * @returns {Promise<{fiscalYear: number; fiscalPeriod: number} | null>} Current period
 *
 * @example
 * ```typescript
 * const current = await getCurrentFiscalPeriod(FiscalPeriodModel);
 * console.log(`Current period: ${current.fiscalYear}-${current.fiscalPeriod}`);
 * ```
 */
export declare const getCurrentFiscalPeriod: (FiscalPeriod: any) => Promise<{
    fiscalYear: number;
    fiscalPeriod: number;
} | null>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createValidationRuleModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            ruleId: string;
            ruleName: string;
            ruleDescription: string;
            ruleType: string;
            category: string;
            enabled: boolean;
            priority: number;
            conditions: RuleCondition[];
            actions: RuleAction[];
            effectiveDate: Date | null;
            expirationDate: Date | null;
            entityType: string;
            severity: string;
            errorMessage: string;
            warningMessage: string | null;
            executionCount: number;
            violationCount: number;
            lastExecutedAt: Date | null;
            createdBy: string;
            modifiedBy: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createDataQualityMetricModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            metricId: string;
            entityType: string;
            entityId: string | null;
            metricDate: Date;
            metricPeriod: string;
            recordCount: number;
            completenessScore: number;
            accuracyScore: number;
            consistencyScore: number;
            timelinessScore: number;
            validityScore: number;
            uniquenessScore: number;
            overallScore: number;
            nullFieldCount: number;
            invalidFieldCount: number;
            duplicateCount: number;
            outlierCount: number;
            issuesDetected: number;
            issuesResolved: number;
            recommendations: string[];
            calculatedBy: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createValidationExceptionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            exceptionId: string;
            entityType: string;
            entityId: string;
            ruleId: string;
            ruleName: string;
            field: string;
            invalidValue: any;
            expectedValue: any;
            errorMessage: string;
            severity: string;
            status: string;
            detectedAt: Date;
            detectedBy: string;
            assignedTo: string | null;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            resolution: string | null;
            resolutionAction: string | null;
            comments: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    validateRequiredFields: (data: Record<string, any>, requiredFields: string[]) => ValidationResult;
    validateFieldTypes: (data: Record<string, any>, fieldTypes: Record<string, string>) => ValidationResult;
    validateNumericRanges: (data: Record<string, number>, ranges: Record<string, {
        min?: number;
        max?: number;
    }>) => ValidationResult;
    validateStringLengths: (data: Record<string, string>, lengths: Record<string, {
        min?: number;
        max?: number;
    }>) => ValidationResult;
    validatePatterns: (data: Record<string, string>, patterns: Record<string, RegExp | string>) => ValidationResult;
    validateDates: (data: Record<string, Date | string>, dateRanges: Record<string, {
        min?: Date;
        max?: Date;
    }>) => ValidationResult;
    validateEnumValues: (data: Record<string, any>, allowedValues: Record<string, any[]>) => ValidationResult;
    validateDecimalPrecision: (data: Record<string, number>, formats: Record<string, {
        precision: number;
        scale: number;
    }>) => ValidationResult;
    validateDependentFields: (data: Record<string, any>, dependencies: Array<{
        trigger: string;
        triggerValue?: any;
        required: string[];
    }>) => ValidationResult;
    validateMutuallyExclusiveFields: (data: Record<string, any>, exclusiveGroups: string[][]) => ValidationResult;
    validateFieldComparisons: (data: Record<string, any>, comparisons: Array<{
        field1: string;
        operator: string;
        field2: string;
    }>) => ValidationResult;
    validateSumEquals: (data: Record<string, number>, sumFields: string[], totalField: string, tolerance?: number) => ValidationResult;
    validateBalancedTransaction: (entries: Array<{
        debit?: number;
        credit?: number;
    }>, tolerance?: number) => ValidationResult;
    validateCalculatedField: (data: Record<string, number>, calculatedField: string, formula: (data: Record<string, number>) => number, tolerance?: number) => ValidationResult;
    evaluateBusinessRule: (rule: BusinessRule, data: Record<string, any>) => Promise<boolean>;
    evaluateCondition: (condition: RuleCondition, data: Record<string, any>) => boolean;
    validateBusinessRules: (data: Record<string, any>, rules: BusinessRule[], ValidationRule: any) => Promise<ValidationResult>;
    createValidationRule: (ruleData: Partial<BusinessRule>, ValidationRule: any, transaction?: Transaction) => Promise<BusinessRule>;
    toggleValidationRule: (ruleId: string, enabled: boolean, ValidationRule: any, transaction?: Transaction) => Promise<void>;
    generateRuleExecutionReport: (startDate: Date, endDate: Date, ValidationRule: any) => Promise<object>;
    validateForeignKeyReference: (foreignKey: string, ParentModel: any, parentKeyField: string) => Promise<boolean>;
    checkOrphanedRecords: (ChildModel: any, foreignKeyField: string, ParentModel: any, parentKeyField: string) => Promise<IntegrityCheck>;
    validateCircularReferences: (recordId: string, parentField: string, Model: any) => Promise<boolean>;
    validateCascadeDelete: (parentId: string, ParentModel: any, dependentModels: Array<{
        model: any;
        foreignKey: string;
    }>) => Promise<object>;
    performIntegrityCheck: (database: any, relationships: Array<{
        child: any;
        childFK: string;
        parent: any;
        parentKey: string;
    }>) => Promise<IntegrityCheck[]>;
    detectExactDuplicate: (data: Record<string, any>, keyFields: string[], Model: any) => Promise<DuplicateCheck>;
    detectFuzzyDuplicate: (data: Record<string, any>, compareFields: string[], Model: any, threshold?: number) => Promise<DuplicateCheck>;
    calculateSimilarityScore: (record1: Record<string, any>, record2: Record<string, any>, fields: string[]) => number;
    findDuplicateGroups: (Model: any, groupByFields: string[]) => Promise<Array<{
        key: string;
        count: number;
        records: any[];
    }>>;
    mergeDuplicateRecords: (duplicateIds: string[], masterId: string, Model: any, transaction?: Transaction) => Promise<object>;
    detectStatisticalOutliers: (values: number[], threshold?: number) => Promise<number[]>;
    detectTimeSeriesAnomalies: (timeSeries: Array<{
        date: Date;
        value: number;
    }>, window?: number, deviationThreshold?: number) => Promise<AnomalyDetection[]>;
    detectValueSpikes: (values: number[], changeThreshold?: number) => Promise<AnomalyDetection[]>;
    detectPatternAnomalies: (distribution: Array<{
        category: string;
        count: number;
    }>, threshold?: number) => Promise<AnomalyDetection[]>;
    generateAnomalyReport: (anomalies: AnomalyDetection[]) => Promise<object>;
    calculateCompletenessScore: (data: Record<string, any>, requiredFields: string[]) => Promise<number>;
    calculateAccuracyScore: (data: Record<string, any>, validationResult: ValidationResult) => Promise<number>;
    calculateConsistencyScore: (records: any[], consistencyFields: string[]) => Promise<number>;
    calculateTimelinessScore: (recordDate: Date, maxAgeDays: number) => Promise<number>;
    calculateDataQualityScore: (data: Record<string, any>, options: {
        requiredFields?: string[];
        validationResult?: ValidationResult;
        recordDate?: Date;
        maxAgeDays?: number;
    }, DataQualityMetric: any, transaction?: Transaction) => Promise<DataQualityScore>;
    validateBatchControls: (batchControl: BatchControl, details: Array<{
        debit?: number;
        credit?: number;
    }>) => Promise<ValidationResult>;
    validateBatchBalance: (details: Array<{
        debit?: number;
        credit?: number;
    }>, tolerance?: number) => Promise<boolean>;
    calculateBatchHash: (records: any[], hashField: string) => Promise<string>;
    validateBatchSequence: (records: Array<{
        sequenceNumber: number;
    }>) => Promise<ValidationResult>;
    validateFiscalPeriod: (fiscalYear: number, fiscalPeriod: number, FiscalPeriod: any) => Promise<FiscalPeriodValidation>;
    validateTransactionDateInPeriod: (transactionDate: Date, fiscalYear: number, fiscalPeriod: number, FiscalPeriod: any) => Promise<boolean>;
    getCurrentFiscalPeriod: (FiscalPeriod: any) => Promise<{
        fiscalYear: number;
        fiscalPeriod: number;
    } | null>;
};
export default _default;
//# sourceMappingURL=financial-data-validation-kit.d.ts.map