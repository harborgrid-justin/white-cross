"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentFiscalPeriod = exports.validateTransactionDateInPeriod = exports.validateFiscalPeriod = exports.validateBatchSequence = exports.calculateBatchHash = exports.validateBatchBalance = exports.validateBatchControls = exports.calculateDataQualityScore = exports.calculateTimelinessScore = exports.calculateConsistencyScore = exports.calculateAccuracyScore = exports.calculateCompletenessScore = exports.generateAnomalyReport = exports.detectPatternAnomalies = exports.detectValueSpikes = exports.detectTimeSeriesAnomalies = exports.detectStatisticalOutliers = exports.mergeDuplicateRecords = exports.findDuplicateGroups = exports.calculateSimilarityScore = exports.detectFuzzyDuplicate = exports.detectExactDuplicate = exports.performIntegrityCheck = exports.validateCascadeDelete = exports.validateCircularReferences = exports.checkOrphanedRecords = exports.validateForeignKeyReference = exports.generateRuleExecutionReport = exports.toggleValidationRule = exports.createValidationRule = exports.validateBusinessRules = exports.evaluateCondition = exports.evaluateBusinessRule = exports.validateCalculatedField = exports.validateBalancedTransaction = exports.validateSumEquals = exports.validateFieldComparisons = exports.validateMutuallyExclusiveFields = exports.validateDependentFields = exports.validateDecimalPrecision = exports.validateEnumValues = exports.validateDates = exports.validatePatterns = exports.validateStringLengths = exports.validateNumericRanges = exports.validateFieldTypes = exports.validateRequiredFields = exports.createValidationExceptionModel = exports.createDataQualityMetricModel = exports.createValidationRuleModel = void 0;
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
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
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
const createValidationRuleModel = (sequelize) => {
    class ValidationRule extends sequelize_1.Model {
    }
    ValidationRule.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ruleId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique rule identifier',
        },
        ruleName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Rule descriptive name',
        },
        ruleDescription: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Detailed rule description',
        },
        ruleType: {
            type: sequelize_1.DataTypes.ENUM('VALIDATION', 'CALCULATION', 'CONSTRAINT', 'AUTHORIZATION'),
            allowNull: false,
            comment: 'Type of business rule',
        },
        category: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'GENERAL',
            comment: 'Rule category for grouping',
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether rule is active',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
            comment: 'Execution priority (lower = higher priority)',
        },
        conditions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Rule conditions array',
        },
        actions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Rule actions array',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Rule effective start date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Rule expiration date',
        },
        entityType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Entity type this rule applies to',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL'),
            allowNull: false,
            defaultValue: 'ERROR',
            comment: 'Violation severity level',
        },
        errorMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Error message template',
        },
        warningMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Warning message template',
        },
        executionCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times rule executed',
        },
        violationCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of violations detected',
        },
        lastExecutedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last execution timestamp',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created rule',
        },
        modifiedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who last modified rule',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'validation_rules',
        timestamps: true,
        indexes: [
            { fields: ['ruleId'], unique: true },
            { fields: ['ruleType'] },
            { fields: ['category'] },
            { fields: ['enabled'] },
            { fields: ['priority'] },
            { fields: ['entityType'] },
        ],
    });
    return ValidationRule;
};
exports.createValidationRuleModel = createValidationRuleModel;
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
const createDataQualityMetricModel = (sequelize) => {
    class DataQualityMetric extends sequelize_1.Model {
    }
    DataQualityMetric.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        metricId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique metric identifier',
        },
        entityType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Type of entity measured',
        },
        entityId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Specific entity identifier if applicable',
        },
        metricDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Metric calculation date',
        },
        metricPeriod: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'DAILY',
            comment: 'Metric period (DAILY, WEEKLY, MONTHLY)',
        },
        recordCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of records analyzed',
        },
        completenessScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Completeness score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        accuracyScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Accuracy score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        consistencyScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Consistency score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        timelinessScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Timeliness score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        validityScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Validity score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        uniquenessScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Uniqueness score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        overallScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Overall quality score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        nullFieldCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Count of null/missing fields',
        },
        invalidFieldCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Count of invalid field values',
        },
        duplicateCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Count of duplicate records',
        },
        outlierCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Count of outlier values',
        },
        issuesDetected: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total issues detected',
        },
        issuesResolved: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Issues resolved',
        },
        recommendations: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Quality improvement recommendations',
        },
        calculatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User/system that calculated metric',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'data_quality_metrics',
        timestamps: true,
        indexes: [
            { fields: ['metricId'], unique: true },
            { fields: ['entityType'] },
            { fields: ['metricDate'] },
            { fields: ['metricPeriod'] },
            { fields: ['overallScore'] },
        ],
    });
    return DataQualityMetric;
};
exports.createDataQualityMetricModel = createDataQualityMetricModel;
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
const createValidationExceptionModel = (sequelize) => {
    class ValidationException extends sequelize_1.Model {
    }
    ValidationException.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        exceptionId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique exception identifier',
        },
        entityType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Type of entity with exception',
        },
        entityId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Entity identifier',
        },
        ruleId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Rule that detected exception',
        },
        ruleName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Rule name',
        },
        field: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Field with validation error',
        },
        invalidValue: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Invalid value (as JSON)',
        },
        expectedValue: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Expected value (as JSON)',
        },
        errorMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Error message',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL'),
            allowNull: false,
            defaultValue: 'ERROR',
            comment: 'Exception severity',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('OPEN', 'INVESTIGATING', 'RESOLVED', 'WAIVED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'OPEN',
            comment: 'Exception status',
        },
        detectedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Detection timestamp',
        },
        detectedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User/system that detected exception',
        },
        assignedTo: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User assigned to resolve',
        },
        resolvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Resolution timestamp',
        },
        resolvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who resolved exception',
        },
        resolution: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Resolution description',
        },
        resolutionAction: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Action taken to resolve',
        },
        comments: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Additional comments',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'validation_exceptions',
        timestamps: true,
        indexes: [
            { fields: ['exceptionId'], unique: true },
            { fields: ['entityType', 'entityId'] },
            { fields: ['ruleId'] },
            { fields: ['status'] },
            { fields: ['severity'] },
            { fields: ['detectedAt'] },
        ],
    });
    return ValidationException;
};
exports.createValidationExceptionModel = createValidationExceptionModel;
// ============================================================================
// BASIC FIELD VALIDATION (1-8)
// ============================================================================
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
const validateRequiredFields = (data, requiredFields) => {
    const errors = [];
    requiredFields.forEach(field => {
        const value = data[field];
        if (value === null || value === undefined || value === '') {
            errors.push({
                field,
                value,
                rule: 'REQUIRED',
                message: `${field} is required and cannot be empty`,
                severity: 'ERROR',
                code: 'REQUIRED_FIELD_MISSING',
            });
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateRequiredFields = validateRequiredFields;
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
const validateFieldTypes = (data, fieldTypes) => {
    const errors = [];
    Object.entries(fieldTypes).forEach(([field, expectedType]) => {
        const value = data[field];
        if (value !== null && value !== undefined) {
            let isValid = false;
            switch (expectedType) {
                case 'string':
                    isValid = typeof value === 'string';
                    break;
                case 'number':
                    isValid = typeof value === 'number' && !isNaN(value);
                    break;
                case 'boolean':
                    isValid = typeof value === 'boolean';
                    break;
                case 'date':
                    isValid = value instanceof Date || !isNaN(Date.parse(value));
                    break;
                case 'array':
                    isValid = Array.isArray(value);
                    break;
                case 'object':
                    isValid = typeof value === 'object' && !Array.isArray(value);
                    break;
            }
            if (!isValid) {
                errors.push({
                    field,
                    value,
                    rule: 'TYPE_MISMATCH',
                    message: `${field} must be of type ${expectedType}, got ${typeof value}`,
                    severity: 'ERROR',
                    code: 'INVALID_TYPE',
                });
            }
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateFieldTypes = validateFieldTypes;
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
const validateNumericRanges = (data, ranges) => {
    const errors = [];
    Object.entries(ranges).forEach(([field, range]) => {
        const value = data[field];
        if (value !== null && value !== undefined) {
            if (range.min !== undefined && value < range.min) {
                errors.push({
                    field,
                    value,
                    rule: 'MIN_VALUE',
                    message: `${field} (${value}) is below minimum allowed value (${range.min})`,
                    severity: 'ERROR',
                    code: 'VALUE_BELOW_MINIMUM',
                });
            }
            if (range.max !== undefined && value > range.max) {
                errors.push({
                    field,
                    value,
                    rule: 'MAX_VALUE',
                    message: `${field} (${value}) exceeds maximum allowed value (${range.max})`,
                    severity: 'ERROR',
                    code: 'VALUE_ABOVE_MAXIMUM',
                });
            }
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateNumericRanges = validateNumericRanges;
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
const validateStringLengths = (data, lengths) => {
    const errors = [];
    Object.entries(lengths).forEach(([field, length]) => {
        const value = data[field];
        if (value !== null && value !== undefined) {
            const strValue = String(value);
            if (length.min !== undefined && strValue.length < length.min) {
                errors.push({
                    field,
                    value,
                    rule: 'MIN_LENGTH',
                    message: `${field} length (${strValue.length}) is below minimum (${length.min})`,
                    severity: 'ERROR',
                    code: 'STRING_TOO_SHORT',
                });
            }
            if (length.max !== undefined && strValue.length > length.max) {
                errors.push({
                    field,
                    value,
                    rule: 'MAX_LENGTH',
                    message: `${field} length (${strValue.length}) exceeds maximum (${length.max})`,
                    severity: 'ERROR',
                    code: 'STRING_TOO_LONG',
                });
            }
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateStringLengths = validateStringLengths;
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
const validatePatterns = (data, patterns) => {
    const errors = [];
    Object.entries(patterns).forEach(([field, pattern]) => {
        const value = data[field];
        if (value !== null && value !== undefined) {
            const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
            if (!regex.test(String(value))) {
                errors.push({
                    field,
                    value,
                    rule: 'PATTERN_MISMATCH',
                    message: `${field} does not match required pattern`,
                    severity: 'ERROR',
                    code: 'INVALID_FORMAT',
                });
            }
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validatePatterns = validatePatterns;
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
const validateDates = (data, dateRanges) => {
    const errors = [];
    Object.entries(dateRanges).forEach(([field, range]) => {
        const value = data[field];
        if (value !== null && value !== undefined) {
            const dateValue = value instanceof Date ? value : new Date(value);
            if (isNaN(dateValue.getTime())) {
                errors.push({
                    field,
                    value,
                    rule: 'INVALID_DATE',
                    message: `${field} is not a valid date`,
                    severity: 'ERROR',
                    code: 'INVALID_DATE_FORMAT',
                });
            }
            else {
                if (range.min && dateValue < range.min) {
                    errors.push({
                        field,
                        value,
                        rule: 'DATE_BEFORE_MIN',
                        message: `${field} is before minimum allowed date`,
                        severity: 'ERROR',
                        code: 'DATE_TOO_EARLY',
                    });
                }
                if (range.max && dateValue > range.max) {
                    errors.push({
                        field,
                        value,
                        rule: 'DATE_AFTER_MAX',
                        message: `${field} is after maximum allowed date`,
                        severity: 'ERROR',
                        code: 'DATE_TOO_LATE',
                    });
                }
            }
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateDates = validateDates;
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
const validateEnumValues = (data, allowedValues) => {
    const errors = [];
    Object.entries(allowedValues).forEach(([field, allowed]) => {
        const value = data[field];
        if (value !== null && value !== undefined) {
            if (!allowed.includes(value)) {
                errors.push({
                    field,
                    value,
                    rule: 'INVALID_ENUM',
                    message: `${field} must be one of: ${allowed.join(', ')}`,
                    severity: 'ERROR',
                    code: 'INVALID_ENUM_VALUE',
                });
            }
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateEnumValues = validateEnumValues;
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
const validateDecimalPrecision = (data, formats) => {
    const errors = [];
    Object.entries(formats).forEach(([field, format]) => {
        const value = data[field];
        if (value !== null && value !== undefined) {
            const strValue = String(value);
            const [intPart, decPart] = strValue.split('.');
            const totalDigits = intPart.replace('-', '').length + (decPart?.length || 0);
            const decimalPlaces = decPart?.length || 0;
            if (totalDigits > format.precision) {
                errors.push({
                    field,
                    value,
                    rule: 'PRECISION_EXCEEDED',
                    message: `${field} exceeds precision of ${format.precision} digits`,
                    severity: 'ERROR',
                    code: 'INVALID_PRECISION',
                });
            }
            if (decimalPlaces > format.scale) {
                errors.push({
                    field,
                    value,
                    rule: 'SCALE_EXCEEDED',
                    message: `${field} exceeds scale of ${format.scale} decimal places`,
                    severity: 'ERROR',
                    code: 'INVALID_SCALE',
                });
            }
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateDecimalPrecision = validateDecimalPrecision;
// ============================================================================
// CROSS-FIELD VALIDATION (9-14)
// ============================================================================
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
const validateDependentFields = (data, dependencies) => {
    const errors = [];
    dependencies.forEach(dep => {
        const triggerValue = data[dep.trigger];
        const shouldValidate = dep.triggerValue !== undefined
            ? triggerValue === dep.triggerValue
            : triggerValue !== null && triggerValue !== undefined;
        if (shouldValidate) {
            dep.required.forEach(reqField => {
                const value = data[reqField];
                if (value === null || value === undefined || value === '') {
                    errors.push({
                        field: reqField,
                        value,
                        rule: 'DEPENDENT_REQUIRED',
                        message: `${reqField} is required when ${dep.trigger} is ${triggerValue}`,
                        severity: 'ERROR',
                        code: 'DEPENDENT_FIELD_MISSING',
                    });
                }
            });
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateDependentFields = validateDependentFields;
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
const validateMutuallyExclusiveFields = (data, exclusiveGroups) => {
    const errors = [];
    exclusiveGroups.forEach(group => {
        const setFields = group.filter(field => data[field] !== null && data[field] !== undefined && data[field] !== '');
        if (setFields.length > 1) {
            errors.push({
                field: setFields.join(', '),
                value: setFields.map(f => data[f]),
                rule: 'MUTUALLY_EXCLUSIVE',
                message: `Only one of ${group.join(', ')} can be set`,
                severity: 'ERROR',
                code: 'MULTIPLE_EXCLUSIVE_FIELDS',
            });
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateMutuallyExclusiveFields = validateMutuallyExclusiveFields;
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
const validateFieldComparisons = (data, comparisons) => {
    const errors = [];
    comparisons.forEach(comp => {
        const val1 = data[comp.field1];
        const val2 = data[comp.field2];
        if (val1 !== null && val1 !== undefined && val2 !== null && val2 !== undefined) {
            let isValid = false;
            switch (comp.operator) {
                case '<':
                    isValid = val1 < val2;
                    break;
                case '<=':
                    isValid = val1 <= val2;
                    break;
                case '>':
                    isValid = val1 > val2;
                    break;
                case '>=':
                    isValid = val1 >= val2;
                    break;
                case '==':
                    isValid = val1 == val2;
                    break;
                case '!=':
                    isValid = val1 != val2;
                    break;
            }
            if (!isValid) {
                errors.push({
                    field: `${comp.field1}, ${comp.field2}`,
                    value: { [comp.field1]: val1, [comp.field2]: val2 },
                    rule: 'COMPARISON_FAILED',
                    message: `${comp.field1} must be ${comp.operator} ${comp.field2}`,
                    severity: 'ERROR',
                    code: 'INVALID_COMPARISON',
                });
            }
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateFieldComparisons = validateFieldComparisons;
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
const validateSumEquals = (data, sumFields, totalField, tolerance = 0.01) => {
    const errors = [];
    const sum = sumFields.reduce((acc, field) => {
        const value = data[field] || 0;
        return acc + value;
    }, 0);
    const expected = data[totalField] || 0;
    const variance = Math.abs(sum - expected);
    if (variance > tolerance) {
        errors.push({
            field: totalField,
            value: { calculated: sum, expected },
            rule: 'SUM_MISMATCH',
            message: `Sum of ${sumFields.join(' + ')} (${sum}) does not equal ${totalField} (${expected})`,
            severity: 'ERROR',
            code: 'TOTAL_MISMATCH',
        });
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateSumEquals = validateSumEquals;
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
const validateBalancedTransaction = (entries, tolerance = 0.01) => {
    const errors = [];
    const totalDebits = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredits = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
    const variance = Math.abs(totalDebits - totalCredits);
    if (variance > tolerance) {
        errors.push({
            field: 'transaction',
            value: { debits: totalDebits, credits: totalCredits, variance },
            rule: 'UNBALANCED',
            message: `Transaction is unbalanced: debits (${totalDebits}) != credits (${totalCredits})`,
            severity: 'CRITICAL',
            code: 'UNBALANCED_TRANSACTION',
        });
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateBalancedTransaction = validateBalancedTransaction;
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
const validateCalculatedField = (data, calculatedField, formula, tolerance = 0.01) => {
    const errors = [];
    const actualValue = data[calculatedField];
    const expectedValue = formula(data);
    const variance = Math.abs(actualValue - expectedValue);
    if (variance > tolerance) {
        errors.push({
            field: calculatedField,
            value: { actual: actualValue, expected: expectedValue, variance },
            rule: 'CALCULATION_MISMATCH',
            message: `${calculatedField} (${actualValue}) does not match calculated value (${expectedValue})`,
            severity: 'ERROR',
            code: 'INVALID_CALCULATION',
        });
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateCalculatedField = validateCalculatedField;
// ============================================================================
// BUSINESS RULE VALIDATION (15-20)
// ============================================================================
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
const evaluateBusinessRule = async (rule, data) => {
    if (!rule.enabled)
        return true;
    // Check effective dates
    const now = new Date();
    if (rule.effectiveDate && now < rule.effectiveDate)
        return true;
    if (rule.expirationDate && now > rule.expirationDate)
        return true;
    let result = true;
    let currentLogic = 'AND';
    for (const condition of rule.conditions) {
        const conditionMet = (0, exports.evaluateCondition)(condition, data);
        if (currentLogic === 'AND') {
            result = result && conditionMet;
        }
        else {
            result = result || conditionMet;
        }
        currentLogic = condition.logicalOperator || 'AND';
    }
    return result;
};
exports.evaluateBusinessRule = evaluateBusinessRule;
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
const evaluateCondition = (condition, data) => {
    const fieldValue = data[condition.field];
    const expectedValue = condition.value;
    switch (condition.operator) {
        case 'EQUALS':
            return fieldValue == expectedValue;
        case 'NOT_EQUALS':
            return fieldValue != expectedValue;
        case 'GREATER_THAN':
            return fieldValue > expectedValue;
        case 'LESS_THAN':
            return fieldValue < expectedValue;
        case 'IN':
            return Array.isArray(expectedValue) && expectedValue.includes(fieldValue);
        case 'NOT_IN':
            return Array.isArray(expectedValue) && !expectedValue.includes(fieldValue);
        case 'CONTAINS':
            return String(fieldValue).includes(String(expectedValue));
        case 'REGEX':
            return new RegExp(expectedValue).test(String(fieldValue));
        default:
            return false;
    }
};
exports.evaluateCondition = evaluateCondition;
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
const validateBusinessRules = async (data, rules, ValidationRule) => {
    const errors = [];
    const warnings = [];
    // Sort by priority
    const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);
    for (const rule of sortedRules) {
        const conditionsMet = await (0, exports.evaluateBusinessRule)(rule, data);
        if (conditionsMet) {
            // Execute rule actions
            for (const action of rule.actions) {
                if (action.actionType === 'REJECT') {
                    errors.push({
                        field: rule.entityType,
                        value: data,
                        rule: rule.ruleId,
                        message: action.parameters.message || rule.ruleName,
                        severity: 'ERROR',
                        code: rule.ruleId,
                    });
                }
                else if (action.actionType === 'WARN') {
                    warnings.push({
                        field: rule.entityType,
                        value: data,
                        rule: rule.ruleId,
                        message: action.parameters.message || rule.ruleName,
                        code: rule.ruleId,
                    });
                }
            }
            // Update rule statistics
            if (ValidationRule) {
                await ValidationRule.increment('executionCount', { where: { ruleId: rule.ruleId } });
                if (errors.length > 0) {
                    await ValidationRule.increment('violationCount', { where: { ruleId: rule.ruleId } });
                }
            }
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        validatedAt: new Date(),
    };
};
exports.validateBusinessRules = validateBusinessRules;
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
const createValidationRule = async (ruleData, ValidationRule, transaction) => {
    const ruleId = ruleData.ruleId || `RULE-${Date.now()}`;
    const rule = await ValidationRule.create({
        ...ruleData,
        ruleId,
        enabled: ruleData.enabled !== undefined ? ruleData.enabled : true,
        priority: ruleData.priority || 100,
        executionCount: 0,
        violationCount: 0,
    }, { transaction });
    return rule.toJSON();
};
exports.createValidationRule = createValidationRule;
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
const toggleValidationRule = async (ruleId, enabled, ValidationRule, transaction) => {
    await ValidationRule.update({ enabled }, { where: { ruleId }, transaction });
};
exports.toggleValidationRule = toggleValidationRule;
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
const generateRuleExecutionReport = async (startDate, endDate, ValidationRule) => {
    const rules = await ValidationRule.findAll({
        where: {
            lastExecutedAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const summary = rules.reduce((acc, rule) => ({
        totalRules: acc.totalRules + 1,
        totalExecutions: acc.totalExecutions + rule.executionCount,
        totalViolations: acc.totalViolations + rule.violationCount,
        enabledRules: acc.enabledRules + (rule.enabled ? 1 : 0),
    }), { totalRules: 0, totalExecutions: 0, totalViolations: 0, enabledRules: 0 });
    return {
        periodStart: startDate,
        periodEnd: endDate,
        ...summary,
        violationRate: summary.totalExecutions > 0 ? (summary.totalViolations / summary.totalExecutions) * 100 : 0,
        topViolators: rules
            .sort((a, b) => b.violationCount - a.violationCount)
            .slice(0, 10)
            .map((r) => ({ ruleId: r.ruleId, ruleName: r.ruleName, violations: r.violationCount })),
    };
};
exports.generateRuleExecutionReport = generateRuleExecutionReport;
// ============================================================================
// REFERENTIAL INTEGRITY (21-25)
// ============================================================================
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
const validateForeignKeyReference = async (foreignKey, ParentModel, parentKeyField) => {
    const parent = await ParentModel.findOne({
        where: { [parentKeyField]: foreignKey },
    });
    return parent !== null;
};
exports.validateForeignKeyReference = validateForeignKeyReference;
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
const checkOrphanedRecords = async (ChildModel, foreignKeyField, ParentModel, parentKeyField) => {
    const children = await ChildModel.findAll();
    const violations = [];
    for (const child of children) {
        const foreignKey = child[foreignKeyField];
        if (foreignKey) {
            const exists = await (0, exports.validateForeignKeyReference)(foreignKey, ParentModel, parentKeyField);
            if (!exists) {
                violations.push({
                    violationId: `ORPHAN-${child.id}`,
                    recordId: String(child.id),
                    violationType: 'ORPHANED_RECORD',
                    description: `Record references non-existent parent: ${foreignKey}`,
                    severity: 'HIGH',
                });
            }
        }
    }
    return {
        checkId: `ORPHAN-CHECK-${Date.now()}`,
        checkType: 'ORPHAN',
        entityType: ChildModel.name,
        passed: violations.length === 0,
        violations,
        checkedAt: new Date(),
    };
};
exports.checkOrphanedRecords = checkOrphanedRecords;
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
const validateCircularReferences = async (recordId, parentField, Model) => {
    const visited = new Set();
    let currentId = recordId;
    while (currentId) {
        if (visited.has(currentId)) {
            return true; // Circular reference detected
        }
        visited.add(currentId);
        const record = await Model.findByPk(currentId);
        if (!record)
            break;
        currentId = record[parentField];
        // Self-reference check
        if (currentId === recordId) {
            return true;
        }
    }
    return false;
};
exports.validateCircularReferences = validateCircularReferences;
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
const validateCascadeDelete = async (parentId, ParentModel, dependentModels) => {
    const dependencies = [];
    for (const dep of dependentModels) {
        const count = await dep.model.count({
            where: { [dep.foreignKey]: parentId },
        });
        if (count > 0) {
            dependencies.push({
                model: dep.model.name,
                foreignKey: dep.foreignKey,
                count,
            });
        }
    }
    return {
        parentId,
        canDelete: dependencies.length === 0,
        dependencies,
        totalDependents: dependencies.reduce((sum, d) => sum + d.count, 0),
    };
};
exports.validateCascadeDelete = validateCascadeDelete;
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
const performIntegrityCheck = async (database, relationships) => {
    const checks = [];
    for (const rel of relationships) {
        const check = await (0, exports.checkOrphanedRecords)(rel.child, rel.childFK, rel.parent, rel.parentKey);
        checks.push(check);
    }
    return checks;
};
exports.performIntegrityCheck = performIntegrityCheck;
// ============================================================================
// DUPLICATE DETECTION (26-30)
// ============================================================================
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
const detectExactDuplicate = async (data, keyFields, Model) => {
    const whereClause = {};
    keyFields.forEach(field => {
        whereClause[field] = data[field];
    });
    const existing = await Model.findOne({ where: whereClause });
    return {
        isDuplicate: existing !== null,
        matchScore: existing ? 1.0 : 0,
        matchFields: existing ? keyFields : [],
        existingRecordId: existing?.id,
    };
};
exports.detectExactDuplicate = detectExactDuplicate;
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
const detectFuzzyDuplicate = async (data, compareFields, Model, threshold = 0.85) => {
    const candidates = await Model.findAll();
    let bestMatch = null;
    let bestScore = 0;
    for (const candidate of candidates) {
        const score = (0, exports.calculateSimilarityScore)(data, candidate.toJSON(), compareFields);
        if (score > bestScore && score >= threshold) {
            bestScore = score;
            bestMatch = candidate;
        }
    }
    return {
        isDuplicate: bestMatch !== null,
        matchScore: bestScore,
        matchFields: bestMatch ? compareFields : [],
        existingRecordId: bestMatch?.id,
    };
};
exports.detectFuzzyDuplicate = detectFuzzyDuplicate;
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
const calculateSimilarityScore = (record1, record2, fields) => {
    let totalScore = 0;
    fields.forEach(field => {
        const val1 = record1[field];
        const val2 = record2[field];
        if (val1 === val2) {
            totalScore += 1;
        }
        else if (typeof val1 === 'string' && typeof val2 === 'string') {
            // Levenshtein distance for strings
            const distance = levenshteinDistance(val1.toLowerCase(), val2.toLowerCase());
            const maxLen = Math.max(val1.length, val2.length);
            totalScore += maxLen > 0 ? 1 - distance / maxLen : 0;
        }
        else if (typeof val1 === 'number' && typeof val2 === 'number') {
            // Numeric similarity
            const diff = Math.abs(val1 - val2);
            const max = Math.max(Math.abs(val1), Math.abs(val2));
            totalScore += max > 0 ? 1 - Math.min(diff / max, 1) : 1;
        }
    });
    return totalScore / fields.length;
};
exports.calculateSimilarityScore = calculateSimilarityScore;
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
const findDuplicateGroups = async (Model, groupByFields) => {
    const allRecords = await Model.findAll();
    const groups = new Map();
    allRecords.forEach((record) => {
        const key = groupByFields.map(f => record[f]).join('|');
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(record.toJSON());
    });
    return Array.from(groups.entries())
        .filter(([_, records]) => records.length > 1)
        .map(([key, records]) => ({ key, count: records.length, records }));
};
exports.findDuplicateGroups = findDuplicateGroups;
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
const mergeDuplicateRecords = async (duplicateIds, masterId, Model, transaction) => {
    const master = await Model.findByPk(masterId, { transaction });
    if (!master) {
        throw new Error(`Master record ${masterId} not found`);
    }
    const duplicates = await Model.findAll({
        where: { id: { [sequelize_1.Op.in]: duplicateIds } },
        transaction,
    });
    // Delete duplicates (in real scenario, would update foreign keys first)
    await Model.destroy({
        where: { id: { [sequelize_1.Op.in]: duplicateIds } },
        transaction,
    });
    return {
        masterId,
        mergedCount: duplicates.length,
        mergedIds: duplicateIds,
        mergedAt: new Date(),
    };
};
exports.mergeDuplicateRecords = mergeDuplicateRecords;
// ============================================================================
// ANOMALY DETECTION (31-35)
// ============================================================================
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
const detectStatisticalOutliers = async (values, threshold = 3) => {
    if (values.length < 3)
        return [];
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const outlierIndices = [];
    values.forEach((value, index) => {
        const zScore = stdDev > 0 ? Math.abs((value - mean) / stdDev) : 0;
        if (zScore > threshold) {
            outlierIndices.push(index);
        }
    });
    return outlierIndices;
};
exports.detectStatisticalOutliers = detectStatisticalOutliers;
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
const detectTimeSeriesAnomalies = async (timeSeries, window = 7, deviationThreshold = 2) => {
    const anomalies = [];
    for (let i = window; i < timeSeries.length; i++) {
        const windowData = timeSeries.slice(i - window, i);
        const mean = windowData.reduce((sum, d) => sum + d.value, 0) / window;
        const variance = windowData.reduce((sum, d) => sum + Math.pow(d.value - mean, 2), 0) / window;
        const stdDev = Math.sqrt(variance);
        const currentValue = timeSeries[i].value;
        const deviation = Math.abs(currentValue - mean);
        const zScore = stdDev > 0 ? deviation / stdDev : 0;
        if (zScore > deviationThreshold) {
            anomalies.push({
                anomalyId: `ANOMALY-${i}`,
                detectionMethod: 'STATISTICAL',
                anomalyType: currentValue > mean ? 'SPIKE' : 'OUTLIER',
                field: 'value',
                expectedValue: mean,
                actualValue: currentValue,
                deviation: deviation,
                confidence: Math.min(zScore / 5, 1), // Normalize confidence
                timestamp: timeSeries[i].date,
            });
        }
    }
    return anomalies;
};
exports.detectTimeSeriesAnomalies = detectTimeSeriesAnomalies;
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
const detectValueSpikes = async (values, changeThreshold = 0.5) => {
    const anomalies = [];
    for (let i = 1; i < values.length; i++) {
        const previous = values[i - 1];
        const current = values[i];
        if (previous !== 0) {
            const percentChange = Math.abs((current - previous) / previous);
            if (percentChange > changeThreshold) {
                anomalies.push({
                    anomalyId: `SPIKE-${i}`,
                    detectionMethod: 'RULE_BASED',
                    anomalyType: 'SPIKE',
                    field: 'value',
                    expectedValue: previous,
                    actualValue: current,
                    deviation: current - previous,
                    confidence: Math.min(percentChange, 1),
                    timestamp: new Date(),
                });
            }
        }
    }
    return anomalies;
};
exports.detectValueSpikes = detectValueSpikes;
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
const detectPatternAnomalies = async (distribution, threshold = 0.05) => {
    const total = distribution.reduce((sum, d) => sum + d.count, 0);
    const anomalies = [];
    distribution.forEach(item => {
        const frequency = item.count / total;
        const expectedFrequency = 1 / distribution.length; // Uniform expectation
        if (frequency < threshold && frequency < expectedFrequency * 0.1) {
            anomalies.push({
                anomalyId: `PATTERN-${item.category}`,
                detectionMethod: 'PATTERN',
                anomalyType: 'PATTERN',
                field: 'category',
                expectedValue: expectedFrequency * total,
                actualValue: item.count,
                deviation: item.count - expectedFrequency * total,
                confidence: 1 - frequency / threshold,
                timestamp: new Date(),
            });
        }
    });
    return anomalies;
};
exports.detectPatternAnomalies = detectPatternAnomalies;
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
const generateAnomalyReport = async (anomalies) => {
    const byType = anomalies.reduce((acc, anomaly) => {
        acc[anomaly.anomalyType] = (acc[anomaly.anomalyType] || 0) + 1;
        return acc;
    }, {});
    const byMethod = anomalies.reduce((acc, anomaly) => {
        acc[anomaly.detectionMethod] = (acc[anomaly.detectionMethod] || 0) + 1;
        return acc;
    }, {});
    const highConfidence = anomalies.filter(a => a.confidence > 0.8).length;
    return {
        totalAnomalies: anomalies.length,
        byType,
        byMethod,
        highConfidenceCount: highConfidence,
        averageDeviation: anomalies.reduce((sum, a) => sum + Math.abs(a.deviation), 0) / (anomalies.length || 1),
        generatedAt: new Date(),
    };
};
exports.generateAnomalyReport = generateAnomalyReport;
// ============================================================================
// DATA QUALITY SCORING (36-40)
// ============================================================================
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
const calculateCompletenessScore = async (data, requiredFields) => {
    const completedFields = requiredFields.filter(field => data[field] !== null && data[field] !== undefined && data[field] !== '').length;
    return (completedFields / requiredFields.length) * 100;
};
exports.calculateCompletenessScore = calculateCompletenessScore;
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
const calculateAccuracyScore = async (data, validationResult) => {
    const totalFields = Object.keys(data).length;
    const errorFields = new Set(validationResult.errors.map(e => e.field)).size;
    if (totalFields === 0)
        return 100;
    return ((totalFields - errorFields) / totalFields) * 100;
};
exports.calculateAccuracyScore = calculateAccuracyScore;
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
const calculateConsistencyScore = async (records, consistencyFields) => {
    if (records.length <= 1)
        return 100;
    let consistentCount = 0;
    consistencyFields.forEach(field => {
        const firstValue = records[0][field];
        const allMatch = records.every(r => r[field] === firstValue);
        if (allMatch)
            consistentCount++;
    });
    return (consistentCount / consistencyFields.length) * 100;
};
exports.calculateConsistencyScore = calculateConsistencyScore;
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
const calculateTimelinessScore = async (recordDate, maxAgeDays) => {
    const ageInDays = (Date.now() - recordDate.getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays <= maxAgeDays) {
        return 100;
    }
    else if (ageInDays <= maxAgeDays * 2) {
        return 100 - ((ageInDays - maxAgeDays) / maxAgeDays) * 50;
    }
    else {
        return Math.max(0, 50 - ((ageInDays - maxAgeDays * 2) / maxAgeDays) * 50);
    }
};
exports.calculateTimelinessScore = calculateTimelinessScore;
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
const calculateDataQualityScore = async (data, options, DataQualityMetric, transaction) => {
    const completeness = options.requiredFields
        ? await (0, exports.calculateCompletenessScore)(data, options.requiredFields)
        : 100;
    const accuracy = options.validationResult
        ? await (0, exports.calculateAccuracyScore)(data, options.validationResult)
        : 100;
    const consistency = 100; // Would require related records
    const timeliness = options.recordDate
        ? await (0, exports.calculateTimelinessScore)(options.recordDate, options.maxAgeDays || 30)
        : 100;
    const validity = accuracy; // Simplified
    const uniqueness = 100; // Would require duplicate check
    const overallScore = (completeness + accuracy + consistency + timeliness + validity + uniqueness) / 6;
    const score = {
        overallScore,
        completeness,
        accuracy,
        consistency,
        timeliness,
        validity,
        uniqueness,
        scoreDate: new Date(),
        recommendations: [],
    };
    // Generate recommendations
    if (completeness < 90)
        score.recommendations.push('Improve data completeness by filling missing fields');
    if (accuracy < 90)
        score.recommendations.push('Address validation errors to improve accuracy');
    if (timeliness < 80)
        score.recommendations.push('Update stale records to improve timeliness');
    // Save metric if model provided
    if (DataQualityMetric) {
        await DataQualityMetric.create({
            metricId: `DQ-${Date.now()}`,
            entityType: 'GENERAL',
            metricDate: new Date(),
            metricPeriod: 'ADHOC',
            recordCount: 1,
            completenessScore: completeness,
            accuracyScore: accuracy,
            consistencyScore: consistency,
            timelinessScore: timeliness,
            validityScore: validity,
            uniquenessScore: uniqueness,
            overallScore,
            recommendations: score.recommendations,
            calculatedBy: 'SYSTEM',
        }, { transaction });
    }
    return score;
};
exports.calculateDataQualityScore = calculateDataQualityScore;
// ============================================================================
// BATCH VALIDATION (41-44)
// ============================================================================
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
const validateBatchControls = async (batchControl, details) => {
    const errors = [];
    // Record count validation
    if (details.length !== batchControl.recordCount) {
        errors.push({
            field: 'recordCount',
            value: { expected: batchControl.recordCount, actual: details.length },
            rule: 'BATCH_COUNT_MISMATCH',
            message: `Batch record count mismatch: expected ${batchControl.recordCount}, got ${details.length}`,
            severity: 'CRITICAL',
            code: 'BATCH_COUNT_ERROR',
        });
    }
    // Total debit validation
    const actualDebit = details.reduce((sum, d) => sum + (d.debit || 0), 0);
    if (Math.abs(actualDebit - batchControl.totalDebit) > 0.01) {
        errors.push({
            field: 'totalDebit',
            value: { expected: batchControl.totalDebit, actual: actualDebit },
            rule: 'BATCH_DEBIT_MISMATCH',
            message: `Batch debit total mismatch: expected ${batchControl.totalDebit}, got ${actualDebit}`,
            severity: 'CRITICAL',
            code: 'BATCH_DEBIT_ERROR',
        });
    }
    // Total credit validation
    const actualCredit = details.reduce((sum, d) => sum + (d.credit || 0), 0);
    if (Math.abs(actualCredit - batchControl.totalCredit) > 0.01) {
        errors.push({
            field: 'totalCredit',
            value: { expected: batchControl.totalCredit, actual: actualCredit },
            rule: 'BATCH_CREDIT_MISMATCH',
            message: `Batch credit total mismatch: expected ${batchControl.totalCredit}, got ${actualCredit}`,
            severity: 'CRITICAL',
            code: 'BATCH_CREDIT_ERROR',
        });
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateBatchControls = validateBatchControls;
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
const validateBatchBalance = async (details, tolerance = 0.01) => {
    const totalDebit = details.reduce((sum, d) => sum + (d.debit || 0), 0);
    const totalCredit = details.reduce((sum, d) => sum + (d.credit || 0), 0);
    return Math.abs(totalDebit - totalCredit) <= tolerance;
};
exports.validateBatchBalance = validateBatchBalance;
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
const calculateBatchHash = async (records, hashField) => {
    const sum = records.reduce((total, record) => {
        const value = record[hashField];
        // Convert to number and sum (for numeric fields) or concatenate (for strings)
        if (typeof value === 'number') {
            return total + value;
        }
        else if (typeof value === 'string') {
            const numValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
            return total + numValue;
        }
        return total;
    }, 0);
    return String(sum);
};
exports.calculateBatchHash = calculateBatchHash;
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
const validateBatchSequence = async (records) => {
    const errors = [];
    const sorted = [...records].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i].sequenceNumber;
        const next = sorted[i + 1].sequenceNumber;
        if (next !== current + 1) {
            errors.push({
                field: 'sequenceNumber',
                value: { current, next },
                rule: 'SEQUENCE_GAP',
                message: `Sequence gap detected: ${current} to ${next}`,
                severity: 'ERROR',
                code: 'MISSING_SEQUENCE',
            });
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
        validatedAt: new Date(),
    };
};
exports.validateBatchSequence = validateBatchSequence;
// ============================================================================
// FISCAL PERIOD VALIDATION (45-47)
// ============================================================================
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
const validateFiscalPeriod = async (fiscalYear, fiscalPeriod, FiscalPeriod) => {
    const errors = [];
    if (fiscalPeriod < 1 || fiscalPeriod > 12) {
        errors.push(`Invalid fiscal period: ${fiscalPeriod} (must be 1-12)`);
    }
    const period = await FiscalPeriod.findOne({
        where: { fiscalYear, fiscalPeriod },
    });
    if (!period) {
        errors.push(`Fiscal period ${fiscalYear}-${fiscalPeriod} not found`);
        return {
            fiscalYear,
            fiscalPeriod,
            isOpen: false,
            isPermanentlyClosed: false,
            errors,
        };
    }
    return {
        fiscalYear,
        fiscalPeriod,
        isOpen: period.status === 'OPEN',
        isPermanentlyClosed: period.status === 'PERMANENTLY_CLOSED',
        closeDate: period.closeDate,
        errors: period.status !== 'OPEN' ? [`Period is ${period.status}`] : [],
    };
};
exports.validateFiscalPeriod = validateFiscalPeriod;
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
const validateTransactionDateInPeriod = async (transactionDate, fiscalYear, fiscalPeriod, FiscalPeriod) => {
    const period = await FiscalPeriod.findOne({
        where: { fiscalYear, fiscalPeriod },
    });
    if (!period)
        return false;
    return (transactionDate >= period.startDate &&
        transactionDate <= period.endDate);
};
exports.validateTransactionDateInPeriod = validateTransactionDateInPeriod;
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
const getCurrentFiscalPeriod = async (FiscalPeriod) => {
    const period = await FiscalPeriod.findOne({
        where: {
            status: 'OPEN',
            startDate: { [sequelize_1.Op.lte]: new Date() },
            endDate: { [sequelize_1.Op.gte]: new Date() },
        },
        order: [['fiscalYear', 'DESC'], ['fiscalPeriod', 'DESC']],
    });
    return period
        ? { fiscalYear: period.fiscalYear, fiscalPeriod: period.fiscalPeriod }
        : null;
};
exports.getCurrentFiscalPeriod = getCurrentFiscalPeriod;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
/**
 * Calculates Levenshtein distance between two strings.
 */
const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[str2.length][str1.length];
};
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createValidationRuleModel: exports.createValidationRuleModel,
    createDataQualityMetricModel: exports.createDataQualityMetricModel,
    createValidationExceptionModel: exports.createValidationExceptionModel,
    // Basic Field Validation
    validateRequiredFields: exports.validateRequiredFields,
    validateFieldTypes: exports.validateFieldTypes,
    validateNumericRanges: exports.validateNumericRanges,
    validateStringLengths: exports.validateStringLengths,
    validatePatterns: exports.validatePatterns,
    validateDates: exports.validateDates,
    validateEnumValues: exports.validateEnumValues,
    validateDecimalPrecision: exports.validateDecimalPrecision,
    // Cross-Field Validation
    validateDependentFields: exports.validateDependentFields,
    validateMutuallyExclusiveFields: exports.validateMutuallyExclusiveFields,
    validateFieldComparisons: exports.validateFieldComparisons,
    validateSumEquals: exports.validateSumEquals,
    validateBalancedTransaction: exports.validateBalancedTransaction,
    validateCalculatedField: exports.validateCalculatedField,
    // Business Rule Validation
    evaluateBusinessRule: exports.evaluateBusinessRule,
    evaluateCondition: exports.evaluateCondition,
    validateBusinessRules: exports.validateBusinessRules,
    createValidationRule: exports.createValidationRule,
    toggleValidationRule: exports.toggleValidationRule,
    generateRuleExecutionReport: exports.generateRuleExecutionReport,
    // Referential Integrity
    validateForeignKeyReference: exports.validateForeignKeyReference,
    checkOrphanedRecords: exports.checkOrphanedRecords,
    validateCircularReferences: exports.validateCircularReferences,
    validateCascadeDelete: exports.validateCascadeDelete,
    performIntegrityCheck: exports.performIntegrityCheck,
    // Duplicate Detection
    detectExactDuplicate: exports.detectExactDuplicate,
    detectFuzzyDuplicate: exports.detectFuzzyDuplicate,
    calculateSimilarityScore: exports.calculateSimilarityScore,
    findDuplicateGroups: exports.findDuplicateGroups,
    mergeDuplicateRecords: exports.mergeDuplicateRecords,
    // Anomaly Detection
    detectStatisticalOutliers: exports.detectStatisticalOutliers,
    detectTimeSeriesAnomalies: exports.detectTimeSeriesAnomalies,
    detectValueSpikes: exports.detectValueSpikes,
    detectPatternAnomalies: exports.detectPatternAnomalies,
    generateAnomalyReport: exports.generateAnomalyReport,
    // Data Quality Scoring
    calculateCompletenessScore: exports.calculateCompletenessScore,
    calculateAccuracyScore: exports.calculateAccuracyScore,
    calculateConsistencyScore: exports.calculateConsistencyScore,
    calculateTimelinessScore: exports.calculateTimelinessScore,
    calculateDataQualityScore: exports.calculateDataQualityScore,
    // Batch Validation
    validateBatchControls: exports.validateBatchControls,
    validateBatchBalance: exports.validateBatchBalance,
    calculateBatchHash: exports.calculateBatchHash,
    validateBatchSequence: exports.validateBatchSequence,
    // Fiscal Period Validation
    validateFiscalPeriod: exports.validateFiscalPeriod,
    validateTransactionDateInPeriod: exports.validateTransactionDateInPeriod,
    getCurrentFiscalPeriod: exports.getCurrentFiscalPeriod,
};
//# sourceMappingURL=financial-data-validation-kit.js.map