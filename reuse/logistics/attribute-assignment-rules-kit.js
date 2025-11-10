"use strict";
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
exports.AssignmentAction = exports.LogicalOperator = exports.ConditionOperator = exports.RuleStatus = exports.RulePriority = void 0;
exports.createAssignmentRule = createAssignmentRule;
exports.updateAssignmentRule = updateAssignmentRule;
exports.deleteAssignmentRule = deleteAssignmentRule;
exports.cloneAssignmentRule = cloneAssignmentRule;
exports.getRulesByFilter = getRulesByFilter;
exports.setRulePriority = setRulePriority;
exports.validateRuleDefinition = validateRuleDefinition;
exports.evaluateCondition = evaluateCondition;
exports.evaluateConditionGroup = evaluateConditionGroup;
exports.evaluateComplexConditions = evaluateComplexConditions;
exports.checkTimeBasedConditions = checkTimeBasedConditions;
exports.checkLocationBasedConditions = checkLocationBasedConditions;
exports.checkCategoryBasedConditions = checkCategoryBasedConditions;
exports.validateConditionStructure = validateConditionStructure;
exports.assignAttributesByCategory = assignAttributesByCategory;
exports.inheritParentCategoryAttributes = inheritParentCategoryAttributes;
exports.overrideCategoryDefaults = overrideCategoryDefaults;
exports.resolveCategoryAttributeConflicts = resolveCategoryAttributeConflicts;
exports.createCategoryAttributeTemplate = createCategoryAttributeTemplate;
exports.validateCategoryAttributes = validateCategoryAttributes;
exports.mergeCategoryAndEntityAttributes = mergeCategoryAndEntityAttributes;
exports.executeDynamicAssignments = executeDynamicAssignments;
exports.applyCalculationAssignment = applyCalculationAssignment;
exports.transformAttributeValue = transformAttributeValue;
exports.copyAttributeValue = copyAttributeValue;
exports.conditionalAssignment = conditionalAssignment;
exports.executeAssignmentPipeline = executeAssignmentPipeline;
exports.validateDynamicAssignment = validateDynamicAssignment;
exports.evaluateRule = evaluateRule;
exports.testRuleWithCases = testRuleWithCases;
exports.validateRuleWithSampleData = validateRuleWithSampleData;
exports.detectCircularDependencies = detectCircularDependencies;
exports.simulateRuleExecution = simulateRuleExecution;
exports.generateRuleTestData = generateRuleTestData;
exports.profileRulePerformance = profileRulePerformance;
exports.exportRuleExecutionResults = exportRuleExecutionResults;
/**
 * File: /reuse/logistics/attribute-assignment-rules-kit.ts
 * Locator: WC-LOG-ATTR-RULES-001
 * Purpose: JD Edwards-level Dynamic Attribute Assignment Rules Engine - comprehensive rule management and execution
 *
 * Upstream: Independent utility module for attribute assignment rules
 * Downstream: ../backend/logistics/*, Warehouse modules, Inventory services, Product management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 36 production-ready functions for rule definition, evaluation, assignment, testing
 *
 * LLM Context: Enterprise-grade attribute assignment rules engine competing with JD Edwards EnterpriseOne.
 * Provides comprehensive rules management including rule definition, condition evaluation, category-based
 * assignment, dynamic attribute assignment, priority-based execution, rule testing, validation,
 * and audit trails. Supports complex conditional logic, multi-criteria evaluation, hierarchical rules,
 * time-based rules, location-based rules, and performance optimization.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Rule priority levels
 */
var RulePriority;
(function (RulePriority) {
    RulePriority[RulePriority["CRITICAL"] = 1] = "CRITICAL";
    RulePriority[RulePriority["HIGH"] = 2] = "HIGH";
    RulePriority[RulePriority["MEDIUM"] = 3] = "MEDIUM";
    RulePriority[RulePriority["LOW"] = 4] = "LOW";
    RulePriority[RulePriority["LOWEST"] = 5] = "LOWEST";
})(RulePriority || (exports.RulePriority = RulePriority = {}));
/**
 * Rule status enumeration
 */
var RuleStatus;
(function (RuleStatus) {
    RuleStatus["ACTIVE"] = "ACTIVE";
    RuleStatus["INACTIVE"] = "INACTIVE";
    RuleStatus["DRAFT"] = "DRAFT";
    RuleStatus["EXPIRED"] = "EXPIRED";
    RuleStatus["SUSPENDED"] = "SUSPENDED";
    RuleStatus["ARCHIVED"] = "ARCHIVED";
})(RuleStatus || (exports.RuleStatus = RuleStatus = {}));
/**
 * Condition operator types
 */
var ConditionOperator;
(function (ConditionOperator) {
    ConditionOperator["EQUALS"] = "EQUALS";
    ConditionOperator["NOT_EQUALS"] = "NOT_EQUALS";
    ConditionOperator["GREATER_THAN"] = "GREATER_THAN";
    ConditionOperator["LESS_THAN"] = "LESS_THAN";
    ConditionOperator["GREATER_THAN_OR_EQUAL"] = "GREATER_THAN_OR_EQUAL";
    ConditionOperator["LESS_THAN_OR_EQUAL"] = "LESS_THAN_OR_EQUAL";
    ConditionOperator["CONTAINS"] = "CONTAINS";
    ConditionOperator["NOT_CONTAINS"] = "NOT_CONTAINS";
    ConditionOperator["STARTS_WITH"] = "STARTS_WITH";
    ConditionOperator["ENDS_WITH"] = "ENDS_WITH";
    ConditionOperator["IN"] = "IN";
    ConditionOperator["NOT_IN"] = "NOT_IN";
    ConditionOperator["BETWEEN"] = "BETWEEN";
    ConditionOperator["REGEX"] = "REGEX";
    ConditionOperator["IS_NULL"] = "IS_NULL";
    ConditionOperator["IS_NOT_NULL"] = "IS_NOT_NULL";
})(ConditionOperator || (exports.ConditionOperator = ConditionOperator = {}));
/**
 * Logical operator for combining conditions
 */
var LogicalOperator;
(function (LogicalOperator) {
    LogicalOperator["AND"] = "AND";
    LogicalOperator["OR"] = "OR";
    LogicalOperator["NOT"] = "NOT";
})(LogicalOperator || (exports.LogicalOperator = LogicalOperator = {}));
/**
 * Assignment action types
 */
var AssignmentAction;
(function (AssignmentAction) {
    AssignmentAction["SET"] = "SET";
    AssignmentAction["APPEND"] = "APPEND";
    AssignmentAction["PREPEND"] = "PREPEND";
    AssignmentAction["INCREMENT"] = "INCREMENT";
    AssignmentAction["DECREMENT"] = "DECREMENT";
    AssignmentAction["MULTIPLY"] = "MULTIPLY";
    AssignmentAction["DIVIDE"] = "DIVIDE";
    AssignmentAction["COPY_FROM"] = "COPY_FROM";
    AssignmentAction["CALCULATE"] = "CALCULATE";
    AssignmentAction["TRANSFORM"] = "TRANSFORM";
})(AssignmentAction || (exports.AssignmentAction = AssignmentAction = {}));
// ============================================================================
// SECTION 1: RULE DEFINITION & MANAGEMENT (1-7)
// ============================================================================
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
function createAssignmentRule(ruleData) {
    const now = new Date();
    const rule = {
        ruleId: ruleData.ruleId || generateRuleId(),
        ruleName: ruleData.ruleName || 'Unnamed Rule',
        description: ruleData.description || '',
        priority: ruleData.priority || RulePriority.MEDIUM,
        status: ruleData.status || RuleStatus.DRAFT,
        category: ruleData.category,
        conditions: ruleData.conditions || {
            groupId: 'default',
            operator: LogicalOperator.AND,
            conditions: [],
        },
        assignments: ruleData.assignments || [],
        effectiveDate: ruleData.effectiveDate,
        expirationDate: ruleData.expirationDate,
        applicableCategories: ruleData.applicableCategories,
        applicableLocations: ruleData.applicableLocations,
        applicableProductTypes: ruleData.applicableProductTypes,
        executionOrder: ruleData.executionOrder,
        createdBy: ruleData.createdBy || 'system',
        createdAt: ruleData.createdAt || now,
        updatedAt: now,
        metadata: ruleData.metadata || {},
    };
    return rule;
}
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
function updateAssignmentRule(ruleId, updates, existingRules) {
    const ruleIndex = existingRules.findIndex(r => r.ruleId === ruleId);
    if (ruleIndex === -1) {
        throw new Error(`Rule with ID ${ruleId} not found`);
    }
    const existingRule = existingRules[ruleIndex];
    const updatedRule = {
        ...existingRule,
        ...updates,
        ruleId: existingRule.ruleId, // Prevent ID changes
        createdBy: existingRule.createdBy, // Preserve creator
        createdAt: existingRule.createdAt, // Preserve creation date
        updatedAt: new Date(),
    };
    existingRules[ruleIndex] = updatedRule;
    return updatedRule;
}
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
function deleteAssignmentRule(ruleId, archive, existingRules) {
    const ruleIndex = existingRules.findIndex(r => r.ruleId === ruleId);
    if (ruleIndex === -1) {
        return false;
    }
    if (archive) {
        existingRules[ruleIndex].status = RuleStatus.ARCHIVED;
        existingRules[ruleIndex].updatedAt = new Date();
    }
    else {
        existingRules.splice(ruleIndex, 1);
    }
    return true;
}
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
function cloneAssignmentRule(sourceRuleId, modifications, existingRules) {
    const sourceRule = existingRules.find(r => r.ruleId === sourceRuleId);
    if (!sourceRule) {
        throw new Error(`Source rule ${sourceRuleId} not found`);
    }
    const clonedRule = createAssignmentRule({
        ...sourceRule,
        ...modifications,
        ruleId: generateRuleId(),
        ruleName: modifications.ruleName || `${sourceRule.ruleName} (Copy)`,
        status: RuleStatus.DRAFT,
    });
    return clonedRule;
}
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
function getRulesByFilter(rules, filters) {
    const now = new Date();
    return rules.filter(rule => {
        if (filters.status && rule.status !== filters.status) {
            return false;
        }
        if (filters.priority && rule.priority !== filters.priority) {
            return false;
        }
        if (filters.category && rule.category !== filters.category) {
            return false;
        }
        if (filters.effectiveNow) {
            if (rule.effectiveDate && rule.effectiveDate > now) {
                return false;
            }
            if (rule.expirationDate && rule.expirationDate < now) {
                return false;
            }
        }
        if (filters.location && rule.applicableLocations) {
            if (!rule.applicableLocations.includes(filters.location)) {
                return false;
            }
        }
        return true;
    });
}
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
function setRulePriority(rules) {
    return rules.sort((a, b) => {
        // First sort by priority
        if (a.priority !== b.priority) {
            return a.priority - b.priority;
        }
        // Then by execution order if specified
        if (a.executionOrder !== undefined && b.executionOrder !== undefined) {
            return a.executionOrder - b.executionOrder;
        }
        // Finally by creation date (older rules first)
        return a.createdAt.getTime() - b.createdAt.getTime();
    });
}
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
function validateRuleDefinition(rule) {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    // Validate rule name
    if (!rule.ruleName || rule.ruleName.trim().length === 0) {
        errors.push({
            field: 'ruleName',
            message: 'Rule name is required',
            severity: 'error',
        });
    }
    // Validate conditions
    if (!rule.conditions || rule.conditions.conditions.length === 0) {
        warnings.push('Rule has no conditions and will match all entities');
    }
    // Validate assignments
    if (!rule.assignments || rule.assignments.length === 0) {
        errors.push({
            field: 'assignments',
            message: 'Rule must have at least one assignment',
            severity: 'error',
        });
    }
    // Validate date ranges
    if (rule.effectiveDate && rule.expirationDate) {
        if (rule.effectiveDate >= rule.expirationDate) {
            errors.push({
                field: 'effectiveDate',
                message: 'Effective date must be before expiration date',
                severity: 'error',
            });
        }
    }
    // Check for circular dependencies
    const circularDeps = detectCircularDependencies(rule);
    if (circularDeps.length > 0) {
        errors.push({
            field: 'assignments',
            message: `Circular dependencies detected: ${circularDeps.join(', ')}`,
            severity: 'error',
        });
    }
    // Suggestions
    if (!rule.description) {
        suggestions.push('Consider adding a description for better maintainability');
    }
    if (rule.priority === RulePriority.CRITICAL && rule.status === RuleStatus.DRAFT) {
        warnings.push('Critical priority rule is in DRAFT status');
    }
    return {
        valid: errors.filter(e => e.severity === 'error').length === 0,
        errors,
        warnings,
        suggestions,
    };
}
// ============================================================================
// SECTION 2: CONDITION EVALUATION (8-14)
// ============================================================================
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
function evaluateCondition(condition, entity) {
    const fieldValue = getNestedValue(entity, condition.field);
    switch (condition.operator) {
        case ConditionOperator.EQUALS:
            return compareValues(fieldValue, condition.value, condition.caseSensitive) === 0;
        case ConditionOperator.NOT_EQUALS:
            return compareValues(fieldValue, condition.value, condition.caseSensitive) !== 0;
        case ConditionOperator.GREATER_THAN:
            return compareValues(fieldValue, condition.value) > 0;
        case ConditionOperator.LESS_THAN:
            return compareValues(fieldValue, condition.value) < 0;
        case ConditionOperator.GREATER_THAN_OR_EQUAL:
            return compareValues(fieldValue, condition.value) >= 0;
        case ConditionOperator.LESS_THAN_OR_EQUAL:
            return compareValues(fieldValue, condition.value) <= 0;
        case ConditionOperator.CONTAINS:
            return String(fieldValue).includes(String(condition.value));
        case ConditionOperator.NOT_CONTAINS:
            return !String(fieldValue).includes(String(condition.value));
        case ConditionOperator.STARTS_WITH:
            return String(fieldValue).startsWith(String(condition.value));
        case ConditionOperator.ENDS_WITH:
            return String(fieldValue).endsWith(String(condition.value));
        case ConditionOperator.IN:
            return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        case ConditionOperator.NOT_IN:
            return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
        case ConditionOperator.BETWEEN:
            if (Array.isArray(condition.value) && condition.value.length === 2) {
                return fieldValue >= condition.value[0] && fieldValue <= condition.value[1];
            }
            return false;
        case ConditionOperator.REGEX:
            const regex = new RegExp(condition.value);
            return regex.test(String(fieldValue));
        case ConditionOperator.IS_NULL:
            return fieldValue === null || fieldValue === undefined;
        case ConditionOperator.IS_NOT_NULL:
            return fieldValue !== null && fieldValue !== undefined;
        default:
            return false;
    }
}
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
function evaluateConditionGroup(group, entity) {
    let result;
    if (group.operator === LogicalOperator.AND) {
        result = group.conditions.every(cond => {
            if ('groupId' in cond) {
                return evaluateConditionGroup(cond, entity);
            }
            return evaluateCondition(cond, entity);
        });
    }
    else if (group.operator === LogicalOperator.OR) {
        result = group.conditions.some(cond => {
            if ('groupId' in cond) {
                return evaluateConditionGroup(cond, entity);
            }
            return evaluateCondition(cond, entity);
        });
    }
    else if (group.operator === LogicalOperator.NOT) {
        result = !group.conditions.every(cond => {
            if ('groupId' in cond) {
                return evaluateConditionGroup(cond, entity);
            }
            return evaluateCondition(cond, entity);
        });
    }
    else {
        result = false;
    }
    return group.negate ? !result : result;
}
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
function evaluateComplexConditions(rootGroup, context) {
    const evaluationPath = [];
    let totalConditions = 0;
    let passedConditions = 0;
    function evaluateRecursive(group, path) {
        evaluationPath.push(path);
        const results = group.conditions.map((cond, index) => {
            const condPath = `${path}.${index}`;
            if ('groupId' in cond) {
                return evaluateRecursive(cond, condPath);
            }
            totalConditions++;
            const result = evaluateCondition(cond, context.entity);
            if (result)
                passedConditions++;
            evaluationPath.push(`${condPath}: ${result}`);
            return result;
        });
        let groupResult;
        if (group.operator === LogicalOperator.AND) {
            groupResult = results.every(r => r);
        }
        else if (group.operator === LogicalOperator.OR) {
            groupResult = results.some(r => r);
        }
        else {
            groupResult = !results.every(r => r);
        }
        return group.negate ? !groupResult : groupResult;
    }
    const matched = evaluateRecursive(rootGroup, 'root');
    return {
        matched,
        totalConditions,
        passedConditions,
        evaluationPath,
    };
}
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
function checkTimeBasedConditions(rule, evaluationTime) {
    if (rule.effectiveDate && evaluationTime < rule.effectiveDate) {
        return false;
    }
    if (rule.expirationDate && evaluationTime > rule.expirationDate) {
        return false;
    }
    return true;
}
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
function checkLocationBasedConditions(rule, location) {
    if (!rule.applicableLocations || rule.applicableLocations.length === 0) {
        return true; // No location restriction
    }
    return rule.applicableLocations.includes(location);
}
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
function checkCategoryBasedConditions(rule, category) {
    if (!rule.applicableCategories || rule.applicableCategories.length === 0) {
        return true; // No category restriction
    }
    return rule.applicableCategories.includes(category);
}
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
function validateConditionStructure(conditions) {
    const errors = [];
    const warnings = [];
    function validateRecursive(group, path) {
        if (!group.conditions || group.conditions.length === 0) {
            warnings.push(`Condition group at ${path} is empty`);
            return;
        }
        group.conditions.forEach((cond, index) => {
            const condPath = `${path}[${index}]`;
            if ('groupId' in cond) {
                validateRecursive(cond, condPath);
            }
            else {
                const condition = cond;
                if (!condition.field) {
                    errors.push({
                        field: condPath,
                        message: 'Condition field is required',
                        severity: 'error',
                    });
                }
                if (!condition.operator) {
                    errors.push({
                        field: condPath,
                        message: 'Condition operator is required',
                        severity: 'error',
                    });
                }
                if (condition.value === undefined &&
                    condition.operator !== ConditionOperator.IS_NULL &&
                    condition.operator !== ConditionOperator.IS_NOT_NULL) {
                    errors.push({
                        field: condPath,
                        message: 'Condition value is required for this operator',
                        severity: 'error',
                    });
                }
            }
        });
    }
    validateRecursive(conditions, 'root');
    return {
        valid: errors.filter(e => e.severity === 'error').length === 0,
        errors,
        warnings,
    };
}
// ============================================================================
// SECTION 3: CATEGORY-BASED ASSIGNMENT (15-21)
// ============================================================================
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
function assignAttributesByCategory(categoryPath, categoryConfigs, entity) {
    const pathParts = categoryPath.split('/');
    const result = { ...entity };
    // Build category hierarchy from root to leaf
    for (let i = 1; i <= pathParts.length; i++) {
        const currentPath = pathParts.slice(0, i).join('/');
        const config = categoryConfigs.find(c => c.categoryPath === currentPath);
        if (config) {
            // Apply default attributes
            if (config.defaultAttributes) {
                Object.entries(config.defaultAttributes).forEach(([key, value]) => {
                    if (config.inheritFromParent || result[key] === undefined) {
                        result[key] = value;
                    }
                });
            }
            // Apply override rules
            if (config.overrideRules && config.overrideRules.length > 0) {
                const sortedRules = setRulePriority(config.overrideRules);
                for (const rule of sortedRules) {
                    if (rule.status === RuleStatus.ACTIVE) {
                        const matched = evaluateConditionGroup(rule.conditions, result);
                        if (matched) {
                            applyAssignments(result, rule.assignments);
                        }
                    }
                }
            }
        }
    }
    return result;
}
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
function inheritParentCategoryAttributes(categoryPath, categoryConfigs) {
    const pathParts = categoryPath.split('/');
    const inheritedAttributes = {};
    // Traverse from root to current category
    for (let i = 1; i <= pathParts.length; i++) {
        const currentPath = pathParts.slice(0, i).join('/');
        const config = categoryConfigs.find(c => c.categoryPath === currentPath);
        if (config && config.inheritFromParent && config.defaultAttributes) {
            Object.entries(config.defaultAttributes).forEach(([key, value]) => {
                if (inheritedAttributes[key] === undefined) {
                    inheritedAttributes[key] = value;
                }
            });
        }
    }
    return inheritedAttributes;
}
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
function overrideCategoryDefaults(entity, overrideRules) {
    const result = { ...entity };
    const activeRules = overrideRules.filter(r => r.status === RuleStatus.ACTIVE);
    const sortedRules = setRulePriority(activeRules);
    for (const rule of sortedRules) {
        const matched = evaluateConditionGroup(rule.conditions, result);
        if (matched) {
            applyAssignments(result, rule.assignments);
        }
    }
    return result;
}
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
function resolveCategoryAttributeConflicts(attributeSets, strategy = 'most-specific-wins') {
    if (strategy === 'most-specific-wins') {
        // Last (most specific) wins
        return attributeSets.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    }
    else if (strategy === 'least-specific-wins') {
        // First (least specific) wins, only fill in gaps
        return attributeSets.reverse().reduce((acc, curr) => {
            Object.entries(curr).forEach(([key, value]) => {
                if (acc[key] === undefined) {
                    acc[key] = value;
                }
            });
            return acc;
        }, {});
    }
    else {
        // Merge all, arrays are concatenated
        return attributeSets.reduce((acc, curr) => {
            Object.entries(curr).forEach(([key, value]) => {
                if (acc[key] === undefined) {
                    acc[key] = value;
                }
                else if (Array.isArray(acc[key]) && Array.isArray(value)) {
                    acc[key] = [...acc[key], ...value];
                }
                else {
                    acc[key] = value;
                }
            });
            return acc;
        }, {});
    }
}
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
function createCategoryAttributeTemplate(categoryId, defaultAttributes, rules = []) {
    return {
        categoryId,
        categoryName: categoryId,
        categoryPath: categoryId,
        defaultAttributes,
        inheritFromParent: true,
        overrideRules: rules,
        priority: RulePriority.MEDIUM,
    };
}
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
function validateCategoryAttributes(categoryPath, attributes, categoryConfigs) {
    const errors = [];
    const warnings = [];
    const config = categoryConfigs.find(c => c.categoryPath === categoryPath);
    if (!config) {
        warnings.push(`No configuration found for category: ${categoryPath}`);
        return { valid: true, errors, warnings };
    }
    // Check for required attributes
    if (config.defaultAttributes) {
        Object.keys(config.defaultAttributes).forEach(key => {
            if (attributes[key] === undefined) {
                warnings.push(`Missing expected attribute: ${key}`);
            }
        });
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
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
function mergeCategoryAndEntityAttributes(categoryAttributes, entityAttributes, entityOverrides = true) {
    if (entityOverrides) {
        return { ...categoryAttributes, ...entityAttributes };
    }
    else {
        const merged = { ...entityAttributes };
        Object.entries(categoryAttributes).forEach(([key, value]) => {
            if (merged[key] === undefined) {
                merged[key] = value;
            }
        });
        return merged;
    }
}
// ============================================================================
// SECTION 4: DYNAMIC ASSIGNMENT (22-28)
// ============================================================================
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
function executeDynamicAssignments(entity, assignments) {
    const result = { ...entity };
    for (const assignment of assignments) {
        applyAssignment(result, assignment);
    }
    return result;
}
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
function applyCalculationAssignment(entity, expression, variables = {}) {
    try {
        // Create a safe evaluation context
        const context = { ...entity, ...variables };
        // Simple expression evaluator (for production, use a proper expression parser)
        const result = evaluateExpression(expression, context);
        return result;
    }
    catch (error) {
        console.error('Calculation error:', error);
        return null;
    }
}
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
function transformAttributeValue(value, transformFunction, options = {}) {
    switch (transformFunction.toLowerCase()) {
        case 'uppercase':
            return String(value).toUpperCase();
        case 'lowercase':
            return String(value).toLowerCase();
        case 'capitalize':
            return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase();
        case 'trim':
            return String(value).trim();
        case 'round':
            const decimals = options.decimals || 0;
            return Number(value).toFixed(decimals);
        case 'abs':
            return Math.abs(Number(value));
        case 'floor':
            return Math.floor(Number(value));
        case 'ceil':
            return Math.ceil(Number(value));
        case 'format_date':
            if (value instanceof Date) {
                return value.toISOString().split('T')[0];
            }
            return value;
        case 'format_currency':
            return `$${Number(value).toFixed(2)}`;
        case 'prefix':
            return `${options.prefix || ''}${value}`;
        case 'suffix':
            return `${value}${options.suffix || ''}`;
        case 'replace':
            return String(value).replace(new RegExp(options.pattern || '', 'g'), options.replacement || '');
        default:
            return value;
    }
}
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
function copyAttributeValue(entity, sourceAttribute, targetAttribute) {
    const result = { ...entity };
    const sourceValue = getNestedValue(entity, sourceAttribute);
    setNestedValue(result, targetAttribute, sourceValue);
    return result;
}
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
function conditionalAssignment(entity, condition, thenValue, elseValue) {
    const conditionMet = evaluateCondition(condition, entity);
    return conditionMet ? thenValue : elseValue;
}
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
function executeAssignmentPipeline(entity, pipeline) {
    let result = { ...entity };
    for (const assignment of pipeline) {
        result = { ...result };
        applyAssignment(result, assignment);
    }
    return result;
}
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
function validateDynamicAssignment(assignment) {
    const errors = [];
    const warnings = [];
    if (!assignment.targetAttribute) {
        errors.push({
            field: 'targetAttribute',
            message: 'Target attribute is required',
            severity: 'error',
        });
    }
    if (!assignment.action) {
        errors.push({
            field: 'action',
            message: 'Assignment action is required',
            severity: 'error',
        });
    }
    // Validate based on action type
    switch (assignment.action) {
        case AssignmentAction.CALCULATE:
            if (!assignment.calculationExpression) {
                errors.push({
                    field: 'calculationExpression',
                    message: 'Calculation expression is required for CALCULATE action',
                    severity: 'error',
                });
            }
            break;
        case AssignmentAction.TRANSFORM:
            if (!assignment.transformFunction) {
                errors.push({
                    field: 'transformFunction',
                    message: 'Transform function is required for TRANSFORM action',
                    severity: 'error',
                });
            }
            break;
        case AssignmentAction.COPY_FROM:
            if (!assignment.sourceAttribute) {
                errors.push({
                    field: 'sourceAttribute',
                    message: 'Source attribute is required for COPY_FROM action',
                    severity: 'error',
                });
            }
            break;
        case AssignmentAction.SET:
        case AssignmentAction.APPEND:
        case AssignmentAction.PREPEND:
            if (assignment.value === undefined) {
                errors.push({
                    field: 'value',
                    message: 'Value is required for this action',
                    severity: 'error',
                });
            }
            break;
    }
    return {
        valid: errors.filter(e => e.severity === 'error').length === 0,
        errors,
        warnings,
    };
}
// ============================================================================
// SECTION 5: RULE TESTING & VALIDATION (29-36)
// ============================================================================
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
function evaluateRule(rule, context) {
    const startTime = Date.now();
    const changes = [];
    const errors = [];
    const warnings = [];
    try {
        // Check time-based conditions
        if (!checkTimeBasedConditions(rule, context.timestamp)) {
            return {
                ruleId: rule.ruleId,
                matched: false,
                conditionsEvaluated: 0,
                conditionsPassed: 0,
                executionTime: Date.now() - startTime,
                assignmentsApplied: 0,
                changes: [],
                warnings: ['Rule is not effective at this time'],
            };
        }
        // Check location-based conditions
        if (context.location && !checkLocationBasedConditions(rule, context.location)) {
            return {
                ruleId: rule.ruleId,
                matched: false,
                conditionsEvaluated: 0,
                conditionsPassed: 0,
                executionTime: Date.now() - startTime,
                assignmentsApplied: 0,
                changes: [],
                warnings: ['Rule does not apply to this location'],
            };
        }
        // Evaluate conditions
        const conditionResult = evaluateComplexConditions(rule.conditions, context);
        if (!conditionResult.matched) {
            return {
                ruleId: rule.ruleId,
                matched: false,
                conditionsEvaluated: conditionResult.totalConditions,
                conditionsPassed: conditionResult.passedConditions,
                executionTime: Date.now() - startTime,
                assignmentsApplied: 0,
                changes: [],
            };
        }
        // Apply assignments
        const entityCopy = { ...context.entity };
        for (const assignment of rule.assignments) {
            const oldValue = getNestedValue(entityCopy, assignment.targetAttribute);
            applyAssignment(entityCopy, assignment);
            const newValue = getNestedValue(entityCopy, assignment.targetAttribute);
            if (oldValue !== newValue) {
                changes.push({
                    attribute: assignment.targetAttribute,
                    oldValue,
                    newValue,
                    action: assignment.action,
                });
            }
        }
        return {
            ruleId: rule.ruleId,
            matched: true,
            conditionsEvaluated: conditionResult.totalConditions,
            conditionsPassed: conditionResult.passedConditions,
            executionTime: Date.now() - startTime,
            assignmentsApplied: changes.length,
            changes,
            errors: errors.length > 0 ? errors : undefined,
            warnings: warnings.length > 0 ? warnings : undefined,
        };
    }
    catch (error) {
        errors.push(String(error));
        return {
            ruleId: rule.ruleId,
            matched: false,
            conditionsEvaluated: 0,
            conditionsPassed: 0,
            executionTime: Date.now() - startTime,
            assignmentsApplied: 0,
            changes: [],
            errors,
        };
    }
}
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
function testRuleWithCases(rule, testCases) {
    const results = [];
    for (const testCase of testCases) {
        const context = {
            entity: testCase.inputEntity,
            entityType: 'TEST',
            timestamp: new Date(),
            ...testCase.executionContext,
        };
        const result = evaluateRule(rule, context);
        const expectedMatch = testCase.expectedMatches.includes(rule.ruleId);
        const actualMatch = result.matched;
        let passed = expectedMatch === actualMatch;
        let message;
        if (passed && expectedMatch) {
            // Check if expected changes match
            for (const [key, expectedValue] of Object.entries(testCase.expectedChanges)) {
                const change = result.changes.find(c => c.attribute === key);
                if (!change || change.newValue !== expectedValue) {
                    passed = false;
                    message = `Expected ${key} to be ${expectedValue}, but got ${change?.newValue}`;
                    break;
                }
            }
        }
        results.push({
            testId: testCase.testId,
            passed,
            expected: {
                matched: expectedMatch,
                changes: testCase.expectedChanges,
            },
            actual: {
                matched: actualMatch,
                changes: result.changes,
            },
            message,
        });
    }
    return {
        totalTests: testCases.length,
        passedTests: results.filter(r => r.passed).length,
        failedTests: results.filter(r => !r.passed).length,
        results,
    };
}
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
function validateRuleWithSampleData(rule, sampleData) {
    const errors = [];
    const warnings = [];
    let matchCount = 0;
    let errorCount = 0;
    for (const entity of sampleData) {
        const context = {
            entity,
            entityType: 'VALIDATION',
            timestamp: new Date(),
        };
        const result = evaluateRule(rule, context);
        if (result.matched) {
            matchCount++;
        }
        if (result.errors && result.errors.length > 0) {
            errorCount++;
            errors.push({
                field: 'execution',
                message: `Errors during evaluation: ${result.errors.join(', ')}`,
                severity: 'error',
            });
        }
    }
    if (matchCount === 0) {
        warnings.push('Rule did not match any sample data');
    }
    if (matchCount === sampleData.length) {
        warnings.push('Rule matched all sample data - verify conditions are not too broad');
    }
    return {
        valid: errorCount === 0,
        errors,
        warnings,
        suggestions: [
            `Rule matched ${matchCount} out of ${sampleData.length} sample entities`,
        ],
    };
}
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
function detectCircularDependencies(rule) {
    const dependencies = new Map();
    const circular = [];
    // Build dependency graph
    for (const assignment of rule.assignments) {
        const target = assignment.targetAttribute;
        if (!dependencies.has(target)) {
            dependencies.set(target, new Set());
        }
        if (assignment.sourceAttribute) {
            dependencies.get(target).add(assignment.sourceAttribute);
        }
        if (assignment.calculationExpression) {
            // Extract field references from expression
            const fieldRefs = extractFieldReferences(assignment.calculationExpression);
            fieldRefs.forEach(field => dependencies.get(target).add(field));
        }
    }
    // Detect cycles using DFS
    function hasCycle(node, visited, stack) {
        visited.add(node);
        stack.add(node);
        const deps = dependencies.get(node);
        if (deps) {
            for (const dep of deps) {
                if (!visited.has(dep)) {
                    if (hasCycle(dep, visited, stack)) {
                        circular.push(`${dep} -> ${node}`);
                        return true;
                    }
                }
                else if (stack.has(dep)) {
                    circular.push(`${dep} -> ${node}`);
                    return true;
                }
            }
        }
        stack.delete(node);
        return false;
    }
    const visited = new Set();
    for (const node of dependencies.keys()) {
        if (!visited.has(node)) {
            hasCycle(node, visited, new Set());
        }
    }
    return circular;
}
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
function simulateRuleExecution(rules, context) {
    const startTime = Date.now();
    const results = [];
    const errors = [];
    const warnings = [];
    const activeRules = rules.filter(r => r.status === RuleStatus.ACTIVE);
    const sortedRules = setRulePriority(activeRules);
    let entityCopy = { ...context.entity };
    for (const rule of sortedRules) {
        const ruleContext = {
            ...context,
            entity: entityCopy,
        };
        const result = evaluateRule(rule, ruleContext);
        results.push(result);
        if (result.matched && result.changes.length > 0) {
            // Apply changes to working copy for subsequent rules
            for (const change of result.changes) {
                setNestedValue(entityCopy, change.attribute, change.newValue);
            }
        }
        if (result.errors) {
            errors.push(...result.errors);
        }
        if (result.warnings) {
            warnings.push(...result.warnings);
        }
    }
    const totalChanges = results.reduce((sum, r) => sum + r.changes.length, 0);
    return {
        success: errors.length === 0,
        rulesEvaluated: sortedRules.length,
        rulesMatched: results.filter(r => r.matched).length,
        totalChanges,
        executionTime: Date.now() - startTime,
        results,
        finalEntity: entityCopy,
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
    };
}
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
function generateRuleTestData(rule, count = 5) {
    const testCases = [];
    // Extract fields from conditions
    const fields = extractFieldsFromConditions(rule.conditions);
    for (let i = 0; i < count; i++) {
        const shouldMatch = i < count / 2; // Half should match, half shouldn't
        const inputEntity = {};
        for (const field of fields) {
            inputEntity[field] = generateTestValue(field, shouldMatch);
        }
        const expectedChanges = {};
        if (shouldMatch) {
            for (const assignment of rule.assignments) {
                if (assignment.action === AssignmentAction.SET) {
                    expectedChanges[assignment.targetAttribute] = assignment.value;
                }
            }
        }
        testCases.push({
            testId: `test-${i + 1}`,
            testName: `Generated test case ${i + 1} (${shouldMatch ? 'match' : 'no match'})`,
            description: `Auto-generated test case`,
            inputEntity,
            expectedMatches: shouldMatch ? [rule.ruleId] : [],
            expectedChanges,
        });
    }
    return testCases;
}
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
function profileRulePerformance(rules, sampleData) {
    const metrics = [];
    for (const rule of rules) {
        const executionTimes = [];
        let successCount = 0;
        let failureCount = 0;
        for (const entity of sampleData) {
            const context = {
                entity,
                entityType: 'PROFILE',
                timestamp: new Date(),
            };
            const result = evaluateRule(rule, context);
            executionTimes.push(result.executionTime);
            if (result.errors && result.errors.length > 0) {
                failureCount++;
            }
            else {
                successCount++;
            }
        }
        const totalExecutions = executionTimes.length;
        const avgExecutionTime = executionTimes.reduce((a, b) => a + b, 0) / totalExecutions;
        const maxExecutionTime = Math.max(...executionTimes);
        const minExecutionTime = Math.min(...executionTimes);
        const successRate = (successCount / totalExecutions) * 100;
        metrics.push({
            ruleId: rule.ruleId,
            avgExecutionTime,
            maxExecutionTime,
            minExecutionTime,
            totalExecutions,
            successRate,
            lastExecuted: new Date(),
            failureCount,
        });
    }
    return metrics.sort((a, b) => b.avgExecutionTime - a.avgExecutionTime);
}
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
function exportRuleExecutionResults(result, format = 'json') {
    if (format === 'json') {
        return JSON.stringify(result, null, 2);
    }
    if (format === 'csv') {
        const headers = [
            'Rule ID',
            'Matched',
            'Conditions Evaluated',
            'Conditions Passed',
            'Execution Time (ms)',
            'Changes Applied',
            'Errors',
        ];
        const rows = result.results.map(r => [
            r.ruleId,
            r.matched,
            r.conditionsEvaluated,
            r.conditionsPassed,
            r.executionTime,
            r.assignmentsApplied,
            r.errors?.join('; ') || '',
        ]);
        return [
            headers.join(','),
            ...rows.map(row => row.join(',')),
        ].join('\n');
    }
    if (format === 'html') {
        const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Rule Execution Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
    tr:nth-child(even) { background-color: #f2f2f2; }
    .success { color: green; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>Rule Execution Report</h1>
  <p><strong>Total Rules Evaluated:</strong> ${result.rulesEvaluated}</p>
  <p><strong>Rules Matched:</strong> ${result.rulesMatched}</p>
  <p><strong>Total Changes:</strong> ${result.totalChanges}</p>
  <p><strong>Execution Time:</strong> ${result.executionTime}ms</p>

  <h2>Detailed Results</h2>
  <table>
    <thead>
      <tr>
        <th>Rule ID</th>
        <th>Matched</th>
        <th>Conditions</th>
        <th>Time (ms)</th>
        <th>Changes</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${result.results.map(r => `
      <tr>
        <td>${r.ruleId}</td>
        <td class="${r.matched ? 'success' : ''}">${r.matched ? 'Yes' : 'No'}</td>
        <td>${r.conditionsPassed}/${r.conditionsEvaluated}</td>
        <td>${r.executionTime}</td>
        <td>${r.assignmentsApplied}</td>
        <td class="${r.errors ? 'error' : 'success'}">
          ${r.errors ? r.errors.join('<br>') : 'Success'}
        </td>
      </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
    `.trim();
        return html;
    }
    return '';
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates unique rule ID.
 */
function generateRuleId() {
    return `RULE-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
}
/**
 * Helper: Gets nested value from object using dot notation.
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}
/**
 * Helper: Sets nested value in object using dot notation.
 */
function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
        if (!(key in current)) {
            current[key] = {};
        }
        return current[key];
    }, obj);
    target[lastKey] = value;
}
/**
 * Helper: Compares two values for condition evaluation.
 */
function compareValues(a, b, caseSensitive = true) {
    if (typeof a === 'string' && typeof b === 'string') {
        const strA = caseSensitive ? a : a.toLowerCase();
        const strB = caseSensitive ? b : b.toLowerCase();
        return strA.localeCompare(strB);
    }
    if (a > b)
        return 1;
    if (a < b)
        return -1;
    return 0;
}
/**
 * Helper: Applies a single assignment to entity.
 */
function applyAssignment(entity, assignment) {
    const currentValue = getNestedValue(entity, assignment.targetAttribute);
    switch (assignment.action) {
        case AssignmentAction.SET:
            setNestedValue(entity, assignment.targetAttribute, assignment.value);
            break;
        case AssignmentAction.APPEND:
            if (Array.isArray(currentValue)) {
                setNestedValue(entity, assignment.targetAttribute, [...currentValue, assignment.value]);
            }
            else {
                setNestedValue(entity, assignment.targetAttribute, String(currentValue) + String(assignment.value));
            }
            break;
        case AssignmentAction.PREPEND:
            if (Array.isArray(currentValue)) {
                setNestedValue(entity, assignment.targetAttribute, [assignment.value, ...currentValue]);
            }
            else {
                setNestedValue(entity, assignment.targetAttribute, String(assignment.value) + String(currentValue));
            }
            break;
        case AssignmentAction.INCREMENT:
            setNestedValue(entity, assignment.targetAttribute, Number(currentValue) + Number(assignment.value || 1));
            break;
        case AssignmentAction.DECREMENT:
            setNestedValue(entity, assignment.targetAttribute, Number(currentValue) - Number(assignment.value || 1));
            break;
        case AssignmentAction.MULTIPLY:
            setNestedValue(entity, assignment.targetAttribute, Number(currentValue) * Number(assignment.value));
            break;
        case AssignmentAction.DIVIDE:
            setNestedValue(entity, assignment.targetAttribute, Number(currentValue) / Number(assignment.value));
            break;
        case AssignmentAction.COPY_FROM:
            if (assignment.sourceAttribute) {
                const sourceValue = getNestedValue(entity, assignment.sourceAttribute);
                setNestedValue(entity, assignment.targetAttribute, sourceValue);
            }
            break;
        case AssignmentAction.CALCULATE:
            if (assignment.calculationExpression) {
                const calculatedValue = applyCalculationAssignment(entity, assignment.calculationExpression);
                setNestedValue(entity, assignment.targetAttribute, calculatedValue);
            }
            break;
        case AssignmentAction.TRANSFORM:
            if (assignment.transformFunction) {
                const transformedValue = transformAttributeValue(currentValue, assignment.transformFunction, assignment.metadata || {});
                setNestedValue(entity, assignment.targetAttribute, transformedValue);
            }
            break;
    }
}
/**
 * Helper: Applies multiple assignments to entity.
 */
function applyAssignments(entity, assignments) {
    for (const assignment of assignments) {
        applyAssignment(entity, assignment);
    }
}
/**
 * Helper: Evaluates mathematical/logical expressions safely.
 */
function evaluateExpression(expression, context) {
    // Simple expression evaluator - replace with proper parser for production
    // This is a basic implementation for demonstration
    try {
        // Replace variables in expression with their values
        let processedExpr = expression;
        for (const [key, value] of Object.entries(context)) {
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            processedExpr = processedExpr.replace(regex, JSON.stringify(value));
        }
        // Basic math operators only (safe subset)
        if (!/^[\d\s+\-*/.()]+$/.test(processedExpr)) {
            throw new Error('Invalid expression: only math operators allowed');
        }
        // eslint-disable-next-line no-eval
        return eval(processedExpr);
    }
    catch (error) {
        console.error('Expression evaluation error:', error);
        return null;
    }
}
/**
 * Helper: Extracts field references from calculation expression.
 */
function extractFieldReferences(expression) {
    const fieldPattern = /\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g;
    const matches = expression.match(fieldPattern) || [];
    // Filter out reserved words and operators
    const reserved = ['true', 'false', 'null', 'undefined', 'Math', 'Date'];
    return matches.filter(m => !reserved.includes(m));
}
/**
 * Helper: Extracts all fields referenced in condition group.
 */
function extractFieldsFromConditions(group) {
    const fields = new Set();
    function extractRecursive(g) {
        for (const cond of g.conditions) {
            if ('groupId' in cond) {
                extractRecursive(cond);
            }
            else {
                const condition = cond;
                fields.add(condition.field);
            }
        }
    }
    extractRecursive(group);
    return Array.from(fields);
}
/**
 * Helper: Generates test value for a field.
 */
function generateTestValue(field, shouldMatchRule) {
    // Simple test data generator
    const fieldLower = field.toLowerCase();
    if (fieldLower.includes('price') || fieldLower.includes('cost')) {
        return shouldMatchRule ? 1500 : 50;
    }
    if (fieldLower.includes('quantity') || fieldLower.includes('count')) {
        return shouldMatchRule ? 100 : 5;
    }
    if (fieldLower.includes('category')) {
        return shouldMatchRule ? 'PREMIUM' : 'STANDARD';
    }
    if (fieldLower.includes('status')) {
        return shouldMatchRule ? 'ACTIVE' : 'INACTIVE';
    }
    if (fieldLower.includes('date')) {
        return new Date();
    }
    return shouldMatchRule ? 'test-value-match' : 'test-value-no-match';
}
// ============================================================================
// REST API ENDPOINT DESIGNS & SWAGGER SPECS
// ============================================================================
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
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // Section 1: Rule Definition & Management
    createAssignmentRule,
    updateAssignmentRule,
    deleteAssignmentRule,
    cloneAssignmentRule,
    getRulesByFilter,
    setRulePriority,
    validateRuleDefinition,
    // Section 2: Condition Evaluation
    evaluateCondition,
    evaluateConditionGroup,
    evaluateComplexConditions,
    checkTimeBasedConditions,
    checkLocationBasedConditions,
    checkCategoryBasedConditions,
    validateConditionStructure,
    // Section 3: Category-Based Assignment
    assignAttributesByCategory,
    inheritParentCategoryAttributes,
    overrideCategoryDefaults,
    resolveCategoryAttributeConflicts,
    createCategoryAttributeTemplate,
    validateCategoryAttributes,
    mergeCategoryAndEntityAttributes,
    // Section 4: Dynamic Assignment
    executeDynamicAssignments,
    applyCalculationAssignment,
    transformAttributeValue,
    copyAttributeValue,
    conditionalAssignment,
    executeAssignmentPipeline,
    validateDynamicAssignment,
    // Section 5: Rule Testing & Validation
    evaluateRule,
    testRuleWithCases,
    validateRuleWithSampleData,
    detectCircularDependencies,
    simulateRuleExecution,
    generateRuleTestData,
    profileRulePerformance,
    exportRuleExecutionResults,
    // Enums
    RulePriority,
    RuleStatus,
    ConditionOperator,
    LogicalOperator,
    AssignmentAction,
};
//# sourceMappingURL=attribute-assignment-rules-kit.js.map