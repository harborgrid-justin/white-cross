/**
 * LOC: LOG-ATTRRULE-001
 * File: /reuse/logistics/attribute-assignment-rules-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Sequelize, Transaction, Op)
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - backend/logistics/*
 *   - backend/controllers/attribute-rules.controller.ts
 *   - backend/services/attribute-assignment.service.ts
 *   - backend/warehouse/*
 */
/**
 * Rule priority levels
 */
export declare enum RulePriority {
    CRITICAL = 1,
    HIGH = 2,
    MEDIUM = 3,
    LOW = 4,
    LOWEST = 5
}
/**
 * Rule status enumeration
 */
export declare enum RuleStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DRAFT = "DRAFT",
    EXPIRED = "EXPIRED",
    SUSPENDED = "SUSPENDED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Condition operator types
 */
export declare enum ConditionOperator {
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    GREATER_THAN = "GREATER_THAN",
    LESS_THAN = "LESS_THAN",
    GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
    LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
    CONTAINS = "CONTAINS",
    NOT_CONTAINS = "NOT_CONTAINS",
    STARTS_WITH = "STARTS_WITH",
    ENDS_WITH = "ENDS_WITH",
    IN = "IN",
    NOT_IN = "NOT_IN",
    BETWEEN = "BETWEEN",
    REGEX = "REGEX",
    IS_NULL = "IS_NULL",
    IS_NOT_NULL = "IS_NOT_NULL"
}
/**
 * Logical operator for combining conditions
 */
export declare enum LogicalOperator {
    AND = "AND",
    OR = "OR",
    NOT = "NOT"
}
/**
 * Assignment action types
 */
export declare enum AssignmentAction {
    SET = "SET",
    APPEND = "APPEND",
    PREPEND = "PREPEND",
    INCREMENT = "INCREMENT",
    DECREMENT = "DECREMENT",
    MULTIPLY = "MULTIPLY",
    DIVIDE = "DIVIDE",
    COPY_FROM = "COPY_FROM",
    CALCULATE = "CALCULATE",
    TRANSFORM = "TRANSFORM"
}
/**
 * Rule condition definition
 */
export interface RuleCondition {
    conditionId: string;
    field: string;
    operator: ConditionOperator;
    value: any;
    valueType: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
    caseSensitive?: boolean;
    metadata?: Record<string, any>;
}
/**
 * Condition group with logical operators
 */
export interface ConditionGroup {
    groupId: string;
    operator: LogicalOperator;
    conditions: (RuleCondition | ConditionGroup)[];
    negate?: boolean;
}
/**
 * Attribute assignment definition
 */
export interface AttributeAssignment {
    assignmentId: string;
    targetAttribute: string;
    action: AssignmentAction;
    value: any;
    sourceAttribute?: string;
    transformFunction?: string;
    calculationExpression?: string;
    metadata?: Record<string, any>;
}
/**
 * Assignment rule definition
 */
export interface AssignmentRule {
    ruleId: string;
    ruleName: string;
    description: string;
    priority: RulePriority;
    status: RuleStatus;
    category?: string;
    conditions: ConditionGroup;
    assignments: AttributeAssignment[];
    effectiveDate?: Date;
    expirationDate?: Date;
    applicableCategories?: string[];
    applicableLocations?: string[];
    applicableProductTypes?: string[];
    executionOrder?: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Rule evaluation context
 */
export interface EvaluationContext {
    entity: Record<string, any>;
    entityType: string;
    userId?: string;
    timestamp: Date;
    location?: string;
    additionalData?: Record<string, any>;
}
/**
 * Rule evaluation result
 */
export interface EvaluationResult {
    ruleId: string;
    matched: boolean;
    conditionsEvaluated: number;
    conditionsPassed: number;
    executionTime: number;
    assignmentsApplied: number;
    changes: Array<{
        attribute: string;
        oldValue: any;
        newValue: any;
        action: AssignmentAction;
    }>;
    errors?: string[];
    warnings?: string[];
    metadata?: Record<string, any>;
}
/**
 * Rule execution result
 */
export interface RuleExecutionResult {
    success: boolean;
    rulesEvaluated: number;
    rulesMatched: number;
    totalChanges: number;
    executionTime: number;
    results: EvaluationResult[];
    finalEntity: Record<string, any>;
    errors?: string[];
    warnings?: string[];
}
/**
 * Category-based assignment configuration
 */
export interface CategoryAssignmentConfig {
    categoryId: string;
    categoryName: string;
    categoryPath: string;
    defaultAttributes: Record<string, any>;
    inheritFromParent: boolean;
    overrideRules: AssignmentRule[];
    priority: number;
}
/**
 * Dynamic assignment template
 */
export interface DynamicAssignmentTemplate {
    templateId: string;
    templateName: string;
    description: string;
    applicableTypes: string[];
    variableFields: string[];
    templateExpression: string;
    validationRules?: RuleCondition[];
    metadata?: Record<string, any>;
}
/**
 * Rule validation result
 */
export interface RuleValidationResult {
    valid: boolean;
    errors: Array<{
        field: string;
        message: string;
        severity: 'error' | 'warning' | 'info';
    }>;
    warnings: string[];
    suggestions?: string[];
}
/**
 * Rule test case
 */
export interface RuleTestCase {
    testId: string;
    testName: string;
    description: string;
    inputEntity: Record<string, any>;
    expectedMatches: string[];
    expectedChanges: Record<string, any>;
    executionContext?: Partial<EvaluationContext>;
}
/**
 * Rule performance metrics
 */
export interface RulePerformanceMetrics {
    ruleId: string;
    avgExecutionTime: number;
    maxExecutionTime: number;
    minExecutionTime: number;
    totalExecutions: number;
    successRate: number;
    lastExecuted: Date;
    failureCount: number;
}
/**
 * 1. Creates a new assignment rule with comprehensive configuration.
 *
 * @param {Partial<AssignmentRule>} ruleData - Rule configuration data
 * @returns {AssignmentRule} Created rule
 *
 * @example
 * ```typescript
 * const rule = createAssignmentRule({
 *   ruleName: 'High-Value Items Auto-Classification',
 *   description: 'Automatically assign premium category to high-value items',
 *   priority: RulePriority.HIGH,
 *   status: RuleStatus.ACTIVE,
 *   conditions: {
 *     groupId: 'g1',
 *     operator: LogicalOperator.AND,
 *     conditions: [
 *       {
 *         conditionId: 'c1',
 *         field: 'price',
 *         operator: ConditionOperator.GREATER_THAN,
 *         value: 1000,
 *         valueType: 'number'
 *       }
 *     ]
 *   },
 *   assignments: [
 *     {
 *       assignmentId: 'a1',
 *       targetAttribute: 'category',
 *       action: AssignmentAction.SET,
 *       value: 'PREMIUM'
 *     }
 *   ],
 *   createdBy: 'system'
 * });
 * ```
 */
export declare function createAssignmentRule(ruleData: Partial<AssignmentRule>): AssignmentRule;
/**
 * 2. Updates an existing assignment rule with validation.
 *
 * @param {string} ruleId - Rule ID to update
 * @param {Partial<AssignmentRule>} updates - Fields to update
 * @param {AssignmentRule[]} existingRules - Array of existing rules
 * @returns {AssignmentRule} Updated rule
 *
 * @example
 * ```typescript
 * const updated = updateAssignmentRule('RULE-001', {
 *   status: RuleStatus.ACTIVE,
 *   priority: RulePriority.CRITICAL
 * }, allRules);
 * ```
 */
export declare function updateAssignmentRule(ruleId: string, updates: Partial<AssignmentRule>, existingRules: AssignmentRule[]): AssignmentRule;
/**
 * 3. Deletes or archives an assignment rule.
 *
 * @param {string} ruleId - Rule ID to delete
 * @param {boolean} archive - Archive instead of delete
 * @param {AssignmentRule[]} existingRules - Array of existing rules
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * const deleted = deleteAssignmentRule('RULE-001', true, allRules);
 * ```
 */
export declare function deleteAssignmentRule(ruleId: string, archive: boolean, existingRules: AssignmentRule[]): boolean;
/**
 * 4. Clones an existing rule with modifications.
 *
 * @param {string} sourceRuleId - Source rule ID
 * @param {Partial<AssignmentRule>} modifications - Modifications for new rule
 * @param {AssignmentRule[]} existingRules - Array of existing rules
 * @returns {AssignmentRule} Cloned rule
 *
 * @example
 * ```typescript
 * const cloned = cloneAssignmentRule('RULE-001', {
 *   ruleName: 'Cloned Rule - Modified',
 *   status: RuleStatus.DRAFT
 * }, allRules);
 * ```
 */
export declare function cloneAssignmentRule(sourceRuleId: string, modifications: Partial<AssignmentRule>, existingRules: AssignmentRule[]): AssignmentRule;
/**
 * 5. Retrieves rules by category, status, or priority with filtering.
 *
 * @param {AssignmentRule[]} rules - All rules
 * @param {Object} filters - Filter criteria
 * @returns {AssignmentRule[]} Filtered rules
 *
 * @example
 * ```typescript
 * const activeRules = getRulesByFilter(allRules, {
 *   status: RuleStatus.ACTIVE,
 *   priority: RulePriority.HIGH,
 *   category: 'INVENTORY'
 * });
 * ```
 */
export declare function getRulesByFilter(rules: AssignmentRule[], filters: {
    status?: RuleStatus;
    priority?: RulePriority;
    category?: string;
    effectiveNow?: boolean;
    location?: string;
}): AssignmentRule[];
/**
 * 6. Sets rule priority and execution order for conflict resolution.
 *
 * @param {AssignmentRule[]} rules - Rules to prioritize
 * @returns {AssignmentRule[]} Sorted rules by priority
 *
 * @example
 * ```typescript
 * const prioritized = setRulePriority(allRules);
 * // Rules are now sorted by priority and execution order
 * ```
 */
export declare function setRulePriority(rules: AssignmentRule[]): AssignmentRule[];
/**
 * 7. Validates rule definition for correctness and completeness.
 *
 * @param {AssignmentRule} rule - Rule to validate
 * @returns {RuleValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateRuleDefinition(rule);
 * if (!validation.valid) {
 *   console.error('Rule validation failed:', validation.errors);
 * }
 * ```
 */
export declare function validateRuleDefinition(rule: AssignmentRule): RuleValidationResult;
/**
 * 8. Evaluates a single condition against entity data.
 *
 * @param {RuleCondition} condition - Condition to evaluate
 * @param {Record<string, any>} entity - Entity data
 * @returns {boolean} Evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateCondition({
 *   conditionId: 'c1',
 *   field: 'price',
 *   operator: ConditionOperator.GREATER_THAN,
 *   value: 100,
 *   valueType: 'number'
 * }, { price: 150 });
 * // Returns: true
 * ```
 */
export declare function evaluateCondition(condition: RuleCondition, entity: Record<string, any>): boolean;
/**
 * 9. Evaluates condition groups with AND/OR/NOT logic.
 *
 * @param {ConditionGroup} group - Condition group
 * @param {Record<string, any>} entity - Entity data
 * @returns {boolean} Evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateConditionGroup({
 *   groupId: 'g1',
 *   operator: LogicalOperator.AND,
 *   conditions: [condition1, condition2]
 * }, entity);
 * ```
 */
export declare function evaluateConditionGroup(group: ConditionGroup, entity: Record<string, any>): boolean;
/**
 * 10. Evaluates complex nested condition hierarchies.
 *
 * @param {ConditionGroup} rootGroup - Root condition group
 * @param {EvaluationContext} context - Evaluation context
 * @returns {Object} Detailed evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateComplexConditions(conditionGroup, {
 *   entity: productData,
 *   entityType: 'PRODUCT',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare function evaluateComplexConditions(rootGroup: ConditionGroup, context: EvaluationContext): {
    matched: boolean;
    totalConditions: number;
    passedConditions: number;
    evaluationPath: string[];
};
/**
 * 11. Checks time-based conditions (effective dates, time ranges).
 *
 * @param {AssignmentRule} rule - Rule with time constraints
 * @param {Date} evaluationTime - Time to evaluate against
 * @returns {boolean} Whether rule is effective at the given time
 *
 * @example
 * ```typescript
 * const isEffective = checkTimeBasedConditions(rule, new Date());
 * ```
 */
export declare function checkTimeBasedConditions(rule: AssignmentRule, evaluationTime: Date): boolean;
/**
 * 12. Evaluates location-based conditions.
 *
 * @param {AssignmentRule} rule - Rule with location constraints
 * @param {string} location - Current location
 * @returns {boolean} Whether rule applies to location
 *
 * @example
 * ```typescript
 * const applies = checkLocationBasedConditions(rule, 'WAREHOUSE-01');
 * ```
 */
export declare function checkLocationBasedConditions(rule: AssignmentRule, location: string): boolean;
/**
 * 13. Evaluates category-based conditions.
 *
 * @param {AssignmentRule} rule - Rule with category constraints
 * @param {string} category - Entity category
 * @returns {boolean} Whether rule applies to category
 *
 * @example
 * ```typescript
 * const applies = checkCategoryBasedConditions(rule, 'ELECTRONICS');
 * ```
 */
export declare function checkCategoryBasedConditions(rule: AssignmentRule, category: string): boolean;
/**
 * 14. Validates condition syntax and structure.
 *
 * @param {ConditionGroup} conditions - Conditions to validate
 * @returns {RuleValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateConditionStructure(rule.conditions);
 * ```
 */
export declare function validateConditionStructure(conditions: ConditionGroup): RuleValidationResult;
/**
 * 15. Assigns attributes based on product/item category hierarchy.
 *
 * @param {string} categoryPath - Hierarchical category path
 * @param {CategoryAssignmentConfig[]} categoryConfigs - Category configurations
 * @param {Record<string, any>} entity - Entity to assign attributes to
 * @returns {Record<string, any>} Entity with assigned attributes
 *
 * @example
 * ```typescript
 * const updated = assignAttributesByCategory(
 *   'Electronics/Computers/Laptops',
 *   categoryConfigs,
 *   productData
 * );
 * ```
 */
export declare function assignAttributesByCategory(categoryPath: string, categoryConfigs: CategoryAssignmentConfig[], entity: Record<string, any>): Record<string, any>;
/**
 * 16. Inherits attributes from parent categories.
 *
 * @param {string} categoryPath - Category path
 * @param {CategoryAssignmentConfig[]} categoryConfigs - Category configurations
 * @returns {Record<string, any>} Inherited attributes
 *
 * @example
 * ```typescript
 * const inherited = inheritParentCategoryAttributes(
 *   'Electronics/Computers/Laptops',
 *   categoryConfigs
 * );
 * ```
 */
export declare function inheritParentCategoryAttributes(categoryPath: string, categoryConfigs: CategoryAssignmentConfig[]): Record<string, any>;
/**
 * 17. Overrides category defaults with specific rules.
 *
 * @param {Record<string, any>} entity - Entity with category defaults
 * @param {AssignmentRule[]} overrideRules - Override rules
 * @returns {Record<string, any>} Entity with overrides applied
 *
 * @example
 * ```typescript
 * const overridden = overrideCategoryDefaults(entity, categoryOverrides);
 * ```
 */
export declare function overrideCategoryDefaults(entity: Record<string, any>, overrideRules: AssignmentRule[]): Record<string, any>;
/**
 * 18. Resolves attribute conflicts across category levels.
 *
 * @param {Record<string, any>[]} attributeSets - Array of attribute sets from different levels
 * @param {string} strategy - Conflict resolution strategy
 * @returns {Record<string, any>} Resolved attributes
 *
 * @example
 * ```typescript
 * const resolved = resolveCategoryAttributeConflicts(
 *   [rootAttrs, categoryAttrs, subcategoryAttrs],
 *   'most-specific-wins'
 * );
 * ```
 */
export declare function resolveCategoryAttributeConflicts(attributeSets: Record<string, any>[], strategy?: 'most-specific-wins' | 'least-specific-wins' | 'merge-all'): Record<string, any>;
/**
 * 19. Creates category-specific attribute templates.
 *
 * @param {string} categoryId - Category ID
 * @param {Record<string, any>} defaultAttributes - Default attributes
 * @param {AssignmentRule[]} rules - Category-specific rules
 * @returns {CategoryAssignmentConfig} Category configuration
 *
 * @example
 * ```typescript
 * const template = createCategoryAttributeTemplate(
 *   'ELECTRONICS',
 *   { warranty: '1-year', returnable: true },
 *   electronicsRules
 * );
 * ```
 */
export declare function createCategoryAttributeTemplate(categoryId: string, defaultAttributes: Record<string, any>, rules?: AssignmentRule[]): CategoryAssignmentConfig;
/**
 * 20. Validates category attribute assignments.
 *
 * @param {string} categoryPath - Category path
 * @param {Record<string, any>} attributes - Attributes to validate
 * @param {CategoryAssignmentConfig[]} categoryConfigs - Category configurations
 * @returns {RuleValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateCategoryAttributes(
 *   'Electronics/Computers',
 *   productAttributes,
 *   categoryConfigs
 * );
 * ```
 */
export declare function validateCategoryAttributes(categoryPath: string, attributes: Record<string, any>, categoryConfigs: CategoryAssignmentConfig[]): RuleValidationResult;
/**
 * 21. Merges category attributes with entity-specific overrides.
 *
 * @param {Record<string, any>} categoryAttributes - Category default attributes
 * @param {Record<string, any>} entityAttributes - Entity-specific attributes
 * @param {boolean} entityOverrides - Whether entity attributes override category
 * @returns {Record<string, any>} Merged attributes
 *
 * @example
 * ```typescript
 * const merged = mergeCategoryAndEntityAttributes(
 *   categoryDefaults,
 *   productSpecificAttrs,
 *   true
 * );
 * ```
 */
export declare function mergeCategoryAndEntityAttributes(categoryAttributes: Record<string, any>, entityAttributes: Record<string, any>, entityOverrides?: boolean): Record<string, any>;
/**
 * 22. Executes dynamic attribute assignments based on runtime data.
 *
 * @param {Record<string, any>} entity - Entity to modify
 * @param {AttributeAssignment[]} assignments - Assignments to apply
 * @returns {Record<string, any>} Modified entity
 *
 * @example
 * ```typescript
 * const updated = executeDynamicAssignments(product, [
 *   {
 *     assignmentId: 'a1',
 *     targetAttribute: 'totalValue',
 *     action: AssignmentAction.CALCULATE,
 *     calculationExpression: 'quantity * unitPrice'
 *   }
 * ]);
 * ```
 */
export declare function executeDynamicAssignments(entity: Record<string, any>, assignments: AttributeAssignment[]): Record<string, any>;
/**
 * 23. Applies calculation-based assignments (formulas, expressions).
 *
 * @param {Record<string, any>} entity - Entity data
 * @param {string} expression - Calculation expression
 * @param {Record<string, any>} variables - Additional variables
 * @returns {any} Calculated value
 *
 * @example
 * ```typescript
 * const value = applyCalculationAssignment(
 *   { quantity: 10, price: 50 },
 *   'quantity * price * (1 + taxRate)',
 *   { taxRate: 0.08 }
 * );
 * // Returns: 540
 * ```
 */
export declare function applyCalculationAssignment(entity: Record<string, any>, expression: string, variables?: Record<string, any>): any;
/**
 * 24. Transforms attribute values using functions (uppercase, lowercase, format).
 *
 * @param {any} value - Value to transform
 * @param {string} transformFunction - Transformation function name
 * @param {Record<string, any>} options - Transformation options
 * @returns {any} Transformed value
 *
 * @example
 * ```typescript
 * const transformed = transformAttributeValue('hello world', 'uppercase');
 * // Returns: 'HELLO WORLD'
 * ```
 */
export declare function transformAttributeValue(value: any, transformFunction: string, options?: Record<string, any>): any;
/**
 * 25. Copies values from source attributes to target attributes.
 *
 * @param {Record<string, any>} entity - Entity data
 * @param {string} sourceAttribute - Source attribute path
 * @param {string} targetAttribute - Target attribute path
 * @returns {Record<string, any>} Updated entity
 *
 * @example
 * ```typescript
 * const updated = copyAttributeValue(
 *   { shipping: { address: '123 Main St' } },
 *   'shipping.address',
 *   'billing.address'
 * );
 * ```
 */
export declare function copyAttributeValue(entity: Record<string, any>, sourceAttribute: string, targetAttribute: string): Record<string, any>;
/**
 * 26. Performs conditional assignments (if-then-else logic).
 *
 * @param {Record<string, any>} entity - Entity data
 * @param {RuleCondition} condition - Condition to check
 * @param {any} thenValue - Value if condition is true
 * @param {any} elseValue - Value if condition is false
 * @returns {any} Result value
 *
 * @example
 * ```typescript
 * const value = conditionalAssignment(
 *   { quantity: 100 },
 *   { field: 'quantity', operator: ConditionOperator.GREATER_THAN, value: 50 },
 *   'BULK',
 *   'STANDARD'
 * );
 * // Returns: 'BULK'
 * ```
 */
export declare function conditionalAssignment(entity: Record<string, any>, condition: RuleCondition, thenValue: any, elseValue: any): any;
/**
 * 27. Implements multi-step assignment pipelines.
 *
 * @param {Record<string, any>} entity - Entity data
 * @param {AttributeAssignment[]} pipeline - Ordered assignments
 * @returns {Record<string, any>} Entity after pipeline execution
 *
 * @example
 * ```typescript
 * const result = executeAssignmentPipeline(product, [
 *   { targetAttribute: 'name', action: AssignmentAction.TRANSFORM, transformFunction: 'uppercase' },
 *   { targetAttribute: 'price', action: AssignmentAction.MULTIPLY, value: 1.1 },
 *   { targetAttribute: 'category', action: AssignmentAction.SET, value: 'PREMIUM' }
 * ]);
 * ```
 */
export declare function executeAssignmentPipeline(entity: Record<string, any>, pipeline: AttributeAssignment[]): Record<string, any>;
/**
 * 28. Validates dynamic assignment expressions before execution.
 *
 * @param {AttributeAssignment} assignment - Assignment to validate
 * @returns {RuleValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateDynamicAssignment({
 *   assignmentId: 'a1',
 *   targetAttribute: 'total',
 *   action: AssignmentAction.CALCULATE,
 *   calculationExpression: 'quantity * price'
 * });
 * ```
 */
export declare function validateDynamicAssignment(assignment: AttributeAssignment): RuleValidationResult;
/**
 * 29. Executes complete rule evaluation against an entity.
 *
 * @param {AssignmentRule} rule - Rule to evaluate
 * @param {EvaluationContext} context - Evaluation context
 * @returns {EvaluationResult} Evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateRule(rule, {
 *   entity: productData,
 *   entityType: 'PRODUCT',
 *   timestamp: new Date(),
 *   location: 'WAREHOUSE-01'
 * });
 * ```
 */
export declare function evaluateRule(rule: AssignmentRule, context: EvaluationContext): EvaluationResult;
/**
 * 30. Runs rule against test cases and compares results.
 *
 * @param {AssignmentRule} rule - Rule to test
 * @param {RuleTestCase[]} testCases - Test cases
 * @returns {Object} Test results
 *
 * @example
 * ```typescript
 * const testResults = testRuleWithCases(rule, [
 *   {
 *     testId: 'test1',
 *     testName: 'High value product',
 *     inputEntity: { price: 1500 },
 *     expectedMatches: ['RULE-001'],
 *     expectedChanges: { category: 'PREMIUM' }
 *   }
 * ]);
 * ```
 */
export declare function testRuleWithCases(rule: AssignmentRule, testCases: RuleTestCase[]): {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    results: Array<{
        testId: string;
        passed: boolean;
        expected: any;
        actual: any;
        message?: string;
    }>;
};
/**
 * 31. Validates rule against sample data for correctness.
 *
 * @param {AssignmentRule} rule - Rule to validate
 * @param {Record<string, any>[]} sampleData - Sample entities
 * @returns {RuleValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateRuleWithSampleData(rule, sampleProducts);
 * ```
 */
export declare function validateRuleWithSampleData(rule: AssignmentRule, sampleData: Record<string, any>[]): RuleValidationResult;
/**
 * 32. Detects circular dependencies in rule assignments.
 *
 * @param {AssignmentRule} rule - Rule to check
 * @returns {string[]} Array of circular dependencies
 *
 * @example
 * ```typescript
 * const circular = detectCircularDependencies(rule);
 * if (circular.length > 0) {
 *   console.error('Circular dependencies:', circular);
 * }
 * ```
 */
export declare function detectCircularDependencies(rule: AssignmentRule): string[];
/**
 * 33. Simulates rule execution with dry-run mode (no changes applied).
 *
 * @param {AssignmentRule[]} rules - Rules to simulate
 * @param {EvaluationContext} context - Evaluation context
 * @returns {RuleExecutionResult} Simulation result
 *
 * @example
 * ```typescript
 * const simulation = simulateRuleExecution(allRules, {
 *   entity: productData,
 *   entityType: 'PRODUCT',
 *   timestamp: new Date()
 * });
 * console.log('Would apply', simulation.totalChanges, 'changes');
 * ```
 */
export declare function simulateRuleExecution(rules: AssignmentRule[], context: EvaluationContext): RuleExecutionResult;
/**
 * 34. Generates test data for rule validation.
 *
 * @param {AssignmentRule} rule - Rule to generate test data for
 * @param {number} count - Number of test cases to generate
 * @returns {RuleTestCase[]} Generated test cases
 *
 * @example
 * ```typescript
 * const testCases = generateRuleTestData(rule, 10);
 * const results = testRuleWithCases(rule, testCases);
 * ```
 */
export declare function generateRuleTestData(rule: AssignmentRule, count?: number): RuleTestCase[];
/**
 * 35. Profiles rule performance and identifies bottlenecks.
 *
 * @param {AssignmentRule[]} rules - Rules to profile
 * @param {Record<string, any>[]} sampleData - Sample data for profiling
 * @returns {RulePerformanceMetrics[]} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = profileRulePerformance(allRules, sampleProducts);
 * const slowRules = metrics.filter(m => m.avgExecutionTime > 100);
 * ```
 */
export declare function profileRulePerformance(rules: AssignmentRule[], sampleData: Record<string, any>[]): RulePerformanceMetrics[];
/**
 * 36. Exports rule execution results for audit and reporting.
 *
 * @param {RuleExecutionResult} result - Execution result
 * @param {string} format - Export format (json, csv, html)
 * @returns {string} Formatted export data
 *
 * @example
 * ```typescript
 * const csvReport = exportRuleExecutionResults(executionResult, 'csv');
 * fs.writeFileSync('rule-execution-report.csv', csvReport);
 * ```
 */
export declare function exportRuleExecutionResults(result: RuleExecutionResult, format?: 'json' | 'csv' | 'html'): string;
/**
 * REST API Endpoints for Attribute Assignment Rules
 *
 * Base URL: /api/v1/logistics/attribute-rules
 *
 * Endpoints:
 *
 * 1. POST /api/v1/logistics/attribute-rules
 *    Create a new assignment rule
 *
 * 2. GET /api/v1/logistics/attribute-rules
 *    List all rules with filtering
 *
 * 3. GET /api/v1/logistics/attribute-rules/:ruleId
 *    Get specific rule details
 *
 * 4. PUT /api/v1/logistics/attribute-rules/:ruleId
 *    Update an existing rule
 *
 * 5. DELETE /api/v1/logistics/attribute-rules/:ruleId
 *    Delete or archive a rule
 *
 * 6. POST /api/v1/logistics/attribute-rules/:ruleId/clone
 *    Clone an existing rule
 *
 * 7. POST /api/v1/logistics/attribute-rules/evaluate
 *    Evaluate rules against an entity
 *
 * 8. POST /api/v1/logistics/attribute-rules/simulate
 *    Simulate rule execution (dry-run)
 *
 * 9. POST /api/v1/logistics/attribute-rules/:ruleId/test
 *    Test rule with test cases
 *
 * 10. GET /api/v1/logistics/attribute-rules/:ruleId/performance
 *     Get rule performance metrics
 */
/**
 * Swagger/OpenAPI Documentation for NestJS
 *
 * Example NestJS Controller Implementation:
 *
 * ```typescript
 * import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
 * import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
 * import * as AttributeRulesKit from '@/reuse/logistics/attribute-assignment-rules-kit';
 *
 * @ApiTags('Attribute Assignment Rules')
 * @Controller('api/v1/logistics/attribute-rules')
 * export class AttributeRulesController {
 *
 *   @Post()
 *   @ApiOperation({ summary: 'Create new assignment rule' })
 *   @ApiResponse({ status: 201, description: 'Rule created successfully' })
 *   @ApiResponse({ status: 400, description: 'Invalid rule definition' })
 *   async createRule(@Body() ruleData: Partial<AttributeRulesKit.AssignmentRule>) {
 *     const rule = AttributeRulesKit.createAssignmentRule(ruleData);
 *     const validation = AttributeRulesKit.validateRuleDefinition(rule);
 *
 *     if (!validation.valid) {
 *       throw new BadRequestException(validation.errors);
 *     }
 *
 *     // Save to database
 *     return { success: true, rule };
 *   }
 *
 *   @Get()
 *   @ApiOperation({ summary: 'List all rules with filtering' })
 *   @ApiQuery({ name: 'status', required: false, enum: AttributeRulesKit.RuleStatus })
 *   @ApiQuery({ name: 'priority', required: false, enum: AttributeRulesKit.RulePriority })
 *   @ApiQuery({ name: 'category', required: false, type: String })
 *   @ApiResponse({ status: 200, description: 'Rules retrieved successfully' })
 *   async listRules(
 *     @Query('status') status?: AttributeRulesKit.RuleStatus,
 *     @Query('priority') priority?: AttributeRulesKit.RulePriority,
 *     @Query('category') category?: string
 *   ) {
 *     // Fetch from database
 *     const allRules = await this.ruleRepository.findAll();
 *
 *     const filtered = AttributeRulesKit.getRulesByFilter(allRules, {
 *       status,
 *       priority,
 *       category,
 *       effectiveNow: true
 *     });
 *
 *     return { success: true, rules: filtered, count: filtered.length };
 *   }
 *
 *   @Get(':ruleId')
 *   @ApiOperation({ summary: 'Get specific rule details' })
 *   @ApiResponse({ status: 200, description: 'Rule found' })
 *   @ApiResponse({ status: 404, description: 'Rule not found' })
 *   async getRule(@Param('ruleId') ruleId: string) {
 *     // Fetch from database
 *     const rule = await this.ruleRepository.findById(ruleId);
 *
 *     if (!rule) {
 *       throw new NotFoundException(`Rule ${ruleId} not found`);
 *     }
 *
 *     return { success: true, rule };
 *   }
 *
 *   @Put(':ruleId')
 *   @ApiOperation({ summary: 'Update existing rule' })
 *   @ApiResponse({ status: 200, description: 'Rule updated successfully' })
 *   @ApiResponse({ status: 404, description: 'Rule not found' })
 *   async updateRule(
 *     @Param('ruleId') ruleId: string,
 *     @Body() updates: Partial<AttributeRulesKit.AssignmentRule>
 *   ) {
 *     const allRules = await this.ruleRepository.findAll();
 *     const updated = AttributeRulesKit.updateAssignmentRule(ruleId, updates, allRules);
 *
 *     // Save to database
 *     return { success: true, rule: updated };
 *   }
 *
 *   @Delete(':ruleId')
 *   @ApiOperation({ summary: 'Delete or archive rule' })
 *   @ApiQuery({ name: 'archive', required: false, type: Boolean })
 *   @ApiResponse({ status: 200, description: 'Rule deleted successfully' })
 *   async deleteRule(
 *     @Param('ruleId') ruleId: string,
 *     @Query('archive') archive: boolean = true
 *   ) {
 *     const allRules = await this.ruleRepository.findAll();
 *     const success = AttributeRulesKit.deleteAssignmentRule(ruleId, archive, allRules);
 *
 *     return { success };
 *   }
 *
 *   @Post(':ruleId/clone')
 *   @ApiOperation({ summary: 'Clone existing rule' })
 *   @ApiResponse({ status: 201, description: 'Rule cloned successfully' })
 *   async cloneRule(
 *     @Param('ruleId') ruleId: string,
 *     @Body() modifications: Partial<AttributeRulesKit.AssignmentRule>
 *   ) {
 *     const allRules = await this.ruleRepository.findAll();
 *     const cloned = AttributeRulesKit.cloneAssignmentRule(ruleId, modifications, allRules);
 *
 *     // Save to database
 *     return { success: true, rule: cloned };
 *   }
 *
 *   @Post('evaluate')
 *   @ApiOperation({ summary: 'Evaluate rules against entity' })
 *   @ApiResponse({ status: 200, description: 'Evaluation completed' })
 *   async evaluateRules(@Body() request: {
 *     entity: Record<string, any>;
 *     entityType: string;
 *     location?: string;
 *   }) {
 *     const allRules = await this.ruleRepository.findAll();
 *     const activeRules = AttributeRulesKit.getRulesByFilter(allRules, {
 *       status: AttributeRulesKit.RuleStatus.ACTIVE,
 *       effectiveNow: true
 *     });
 *
 *     const context: AttributeRulesKit.EvaluationContext = {
 *       entity: request.entity,
 *       entityType: request.entityType,
 *       timestamp: new Date(),
 *       location: request.location
 *     };
 *
 *     const result = AttributeRulesKit.simulateRuleExecution(activeRules, context);
 *
 *     return {
 *       success: true,
 *       ...result
 *     };
 *   }
 *
 *   @Post('simulate')
 *   @ApiOperation({ summary: 'Simulate rule execution (dry-run)' })
 *   @ApiResponse({ status: 200, description: 'Simulation completed' })
 *   async simulateRules(@Body() request: {
 *     ruleIds?: string[];
 *     entity: Record<string, any>;
 *     entityType: string;
 *   }) {
 *     let rules = await this.ruleRepository.findAll();
 *
 *     if (request.ruleIds) {
 *       rules = rules.filter(r => request.ruleIds!.includes(r.ruleId));
 *     }
 *
 *     const context: AttributeRulesKit.EvaluationContext = {
 *       entity: request.entity,
 *       entityType: request.entityType,
 *       timestamp: new Date()
 *     };
 *
 *     const result = AttributeRulesKit.simulateRuleExecution(rules, context);
 *
 *     return {
 *       success: true,
 *       message: 'Dry-run completed - no changes applied',
 *       ...result
 *     };
 *   }
 *
 *   @Post(':ruleId/test')
 *   @ApiOperation({ summary: 'Test rule with test cases' })
 *   @ApiResponse({ status: 200, description: 'Test completed' })
 *   async testRule(
 *     @Param('ruleId') ruleId: string,
 *     @Body() request: { testCases: AttributeRulesKit.RuleTestCase[] }
 *   ) {
 *     const rule = await this.ruleRepository.findById(ruleId);
 *
 *     if (!rule) {
 *       throw new NotFoundException(`Rule ${ruleId} not found`);
 *     }
 *
 *     const results = AttributeRulesKit.testRuleWithCases(rule, request.testCases);
 *
 *     return {
 *       success: true,
 *       ...results
 *     };
 *   }
 *
 *   @Get(':ruleId/performance')
 *   @ApiOperation({ summary: 'Get rule performance metrics' })
 *   @ApiResponse({ status: 200, description: 'Metrics retrieved' })
 *   async getRulePerformance(@Param('ruleId') ruleId: string) {
 *     const rule = await this.ruleRepository.findById(ruleId);
 *     const sampleData = await this.entityRepository.getSample(100);
 *
 *     const metrics = AttributeRulesKit.profileRulePerformance([rule], sampleData);
 *
 *     return {
 *       success: true,
 *       metrics: metrics[0]
 *     };
 *   }
 * }
 * ```
 */
/**
 * Example OpenAPI/Swagger Specification (YAML):
 *
 * ```yaml
 * openapi: 3.0.0
 * info:
 *   title: Attribute Assignment Rules API
 *   version: 1.0.0
 *   description: Enterprise-grade attribute assignment rules engine
 *
 * paths:
 *   /api/v1/logistics/attribute-rules:
 *     post:
 *       summary: Create new assignment rule
 *       tags:
 *         - Attribute Rules
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignmentRule'
 *       responses:
 *         '201':
 *           description: Rule created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   rule:
 *                     $ref: '#/components/schemas/AssignmentRule'
 *
 *     get:
 *       summary: List all rules
 *       tags:
 *         - Attribute Rules
 *       parameters:
 *         - name: status
 *           in: query
 *           schema:
 *             $ref: '#/components/schemas/RuleStatus'
 *         - name: priority
 *           in: query
 *           schema:
 *             $ref: '#/components/schemas/RulePriority'
 *       responses:
 *         '200':
 *           description: Rules retrieved successfully
 *
 * components:
 *   schemas:
 *     RuleStatus:
 *       type: string
 *       enum:
 *         - ACTIVE
 *         - INACTIVE
 *         - DRAFT
 *         - EXPIRED
 *         - SUSPENDED
 *         - ARCHIVED
 *
 *     RulePriority:
 *       type: integer
 *       enum: [1, 2, 3, 4, 5]
 *       description: 1=CRITICAL, 2=HIGH, 3=MEDIUM, 4=LOW, 5=LOWEST
 *
 *     AssignmentRule:
 *       type: object
 *       required:
 *         - ruleName
 *         - conditions
 *         - assignments
 *       properties:
 *         ruleId:
 *           type: string
 *         ruleName:
 *           type: string
 *         description:
 *           type: string
 *         priority:
 *           $ref: '#/components/schemas/RulePriority'
 *         status:
 *           $ref: '#/components/schemas/RuleStatus'
 * ```
 */
declare const _default: {
    createAssignmentRule: typeof createAssignmentRule;
    updateAssignmentRule: typeof updateAssignmentRule;
    deleteAssignmentRule: typeof deleteAssignmentRule;
    cloneAssignmentRule: typeof cloneAssignmentRule;
    getRulesByFilter: typeof getRulesByFilter;
    setRulePriority: typeof setRulePriority;
    validateRuleDefinition: typeof validateRuleDefinition;
    evaluateCondition: typeof evaluateCondition;
    evaluateConditionGroup: typeof evaluateConditionGroup;
    evaluateComplexConditions: typeof evaluateComplexConditions;
    checkTimeBasedConditions: typeof checkTimeBasedConditions;
    checkLocationBasedConditions: typeof checkLocationBasedConditions;
    checkCategoryBasedConditions: typeof checkCategoryBasedConditions;
    validateConditionStructure: typeof validateConditionStructure;
    assignAttributesByCategory: typeof assignAttributesByCategory;
    inheritParentCategoryAttributes: typeof inheritParentCategoryAttributes;
    overrideCategoryDefaults: typeof overrideCategoryDefaults;
    resolveCategoryAttributeConflicts: typeof resolveCategoryAttributeConflicts;
    createCategoryAttributeTemplate: typeof createCategoryAttributeTemplate;
    validateCategoryAttributes: typeof validateCategoryAttributes;
    mergeCategoryAndEntityAttributes: typeof mergeCategoryAndEntityAttributes;
    executeDynamicAssignments: typeof executeDynamicAssignments;
    applyCalculationAssignment: typeof applyCalculationAssignment;
    transformAttributeValue: typeof transformAttributeValue;
    copyAttributeValue: typeof copyAttributeValue;
    conditionalAssignment: typeof conditionalAssignment;
    executeAssignmentPipeline: typeof executeAssignmentPipeline;
    validateDynamicAssignment: typeof validateDynamicAssignment;
    evaluateRule: typeof evaluateRule;
    testRuleWithCases: typeof testRuleWithCases;
    validateRuleWithSampleData: typeof validateRuleWithSampleData;
    detectCircularDependencies: typeof detectCircularDependencies;
    simulateRuleExecution: typeof simulateRuleExecution;
    generateRuleTestData: typeof generateRuleTestData;
    profileRulePerformance: typeof profileRulePerformance;
    exportRuleExecutionResults: typeof exportRuleExecutionResults;
    RulePriority: typeof RulePriority;
    RuleStatus: typeof RuleStatus;
    ConditionOperator: typeof ConditionOperator;
    LogicalOperator: typeof LogicalOperator;
    AssignmentAction: typeof AssignmentAction;
};
export default _default;
//# sourceMappingURL=attribute-assignment-rules-kit.d.ts.map