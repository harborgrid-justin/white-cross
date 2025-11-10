"use strict";
/**
 * LOC: MAIL-RULES-FILTERS-001
 * File: /reuse/server/mail/mail-rules-filters-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *
 * DOWNSTREAM (imported by):
 *   - Mail rule controllers
 *   - Mail filter services
 *   - Email processing pipelines
 *   - Mail automation services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensitivityLevel = exports.ImportanceLevel = exports.RuleExecutionStatus = exports.ActionType = exports.ConditionOperator = exports.ConditionType = exports.RuleScope = exports.RuleType = void 0;
exports.defineMailRuleModel = defineMailRuleModel;
exports.defineRuleConditionModel = defineRuleConditionModel;
exports.defineRuleActionModel = defineRuleActionModel;
exports.defineRuleExecutionLogModel = defineRuleExecutionLogModel;
exports.createMailRule = createMailRule;
exports.updateMailRule = updateMailRule;
exports.deleteMailRule = deleteMailRule;
exports.getMailRuleById = getMailRuleById;
exports.getUserMailRules = getUserMailRules;
exports.enableMailRule = enableMailRule;
exports.disableMailRule = disableMailRule;
exports.updateRulePriority = updateRulePriority;
exports.evaluateCondition = evaluateCondition;
exports.evaluateFromCondition = evaluateFromCondition;
exports.evaluateRecipientCondition = evaluateRecipientCondition;
exports.evaluateSubjectCondition = evaluateSubjectCondition;
exports.evaluateBodyCondition = evaluateBodyCondition;
exports.evaluateAttachmentCondition = evaluateAttachmentCondition;
exports.evaluateSizeCondition = evaluateSizeCondition;
exports.evaluateDateCondition = evaluateDateCondition;
exports.evaluateImportanceCondition = evaluateImportanceCondition;
exports.evaluateAllConditions = evaluateAllConditions;
exports.executeAction = executeAction;
exports.executeMoveAction = executeMoveAction;
exports.executeCopyAction = executeCopyAction;
exports.executeDeleteAction = executeDeleteAction;
exports.executeForwardAction = executeForwardAction;
exports.executeFlagAction = executeFlagAction;
exports.executeCategorizeAction = executeCategorizeAction;
exports.executeMarkReadAction = executeMarkReadAction;
exports.executeAllActions = executeAllActions;
exports.executeRulesForMessage = executeRulesForMessage;
exports.logRuleExecution = logRuleExecution;
exports.validateMailRule = validateMailRule;
exports.validateCondition = validateCondition;
exports.validateAction = validateAction;
exports.testRuleAgainstMessage = testRuleAgainstMessage;
exports.bulkEnableRules = bulkEnableRules;
exports.bulkDisableRules = bulkDisableRules;
exports.bulkDeleteRules = bulkDeleteRules;
exports.bulkReorderRules = bulkReorderRules;
exports.createRuleService = createRuleService;
exports.getUserRulesService = getUserRulesService;
exports.processMessageRulesService = processMessageRulesService;
exports.getMailRuleResponse = getMailRuleResponse;
exports.getRuleConditionSchema = getRuleConditionSchema;
exports.getRuleActionSchema = getRuleActionSchema;
exports.getCreateRuleOperation = getCreateRuleOperation;
exports.getExecuteRulesOperation = getExecuteRulesOperation;
exports.getTestRuleOperation = getTestRuleOperation;
exports.compareString = compareString;
exports.compareNumber = compareNumber;
exports.generateUUID = generateUUID;
/**
 * File: /reuse/server/mail/mail-rules-filters-kit.ts
 * Locator: WC-MAIL-RULES-FILTERS-001
 * Purpose: Mail Rules and Filters Kit - Exchange Server-style mail rules and inbox filtering
 *
 * Upstream: sequelize v6.x, Node 18+
 * Downstream: ../backend/mail/*, rule controllers, mail services, automation pipelines
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 45 mail rule utilities for rule creation, conditions, actions, execution engine, validation, and bulk operations
 *
 * LLM Context: Enterprise-grade mail rules and filters kit for White Cross healthcare platform.
 * Provides comprehensive Exchange Server-style inbox rules including rule creation and management,
 * condition types (from, to, subject, body, attachment, size, date, importance), action types
 * (move, copy, delete, forward, reply, flag, categorize), rule execution engine with priority ordering,
 * server-side and client-side rules, rule validation and testing, bulk rule operations, and Swagger
 * documentation. HIPAA-compliant with audit trails for automated mail processing.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Mail rule types
 */
var RuleType;
(function (RuleType) {
    RuleType["SERVER_SIDE"] = "server_side";
    RuleType["CLIENT_SIDE"] = "client_side";
    RuleType["BOTH"] = "both";
})(RuleType || (exports.RuleType = RuleType = {}));
/**
 * Rule execution scope
 */
var RuleScope;
(function (RuleScope) {
    RuleScope["ALL_MESSAGES"] = "all_messages";
    RuleScope["INCOMING"] = "incoming";
    RuleScope["OUTGOING"] = "outgoing";
    RuleScope["MANUAL"] = "manual";
})(RuleScope || (exports.RuleScope = RuleScope = {}));
/**
 * Rule condition types
 */
var ConditionType;
(function (ConditionType) {
    ConditionType["FROM"] = "from";
    ConditionType["TO"] = "to";
    ConditionType["CC"] = "cc";
    ConditionType["TO_OR_CC"] = "to_or_cc";
    ConditionType["SUBJECT"] = "subject";
    ConditionType["BODY"] = "body";
    ConditionType["ATTACHMENT"] = "attachment";
    ConditionType["SIZE"] = "size";
    ConditionType["DATE_RECEIVED"] = "date_received";
    ConditionType["IMPORTANCE"] = "importance";
    ConditionType["SENSITIVITY"] = "sensitivity";
    ConditionType["CATEGORY"] = "category";
    ConditionType["FLAG"] = "flag";
    ConditionType["READ_STATUS"] = "read_status";
    ConditionType["HEADER"] = "header";
    ConditionType["SENDER_DOMAIN"] = "sender_domain";
    ConditionType["RECIPIENT_COUNT"] = "recipient_count";
})(ConditionType || (exports.ConditionType = ConditionType = {}));
/**
 * Condition operators
 */
var ConditionOperator;
(function (ConditionOperator) {
    ConditionOperator["EQUALS"] = "equals";
    ConditionOperator["NOT_EQUALS"] = "not_equals";
    ConditionOperator["CONTAINS"] = "contains";
    ConditionOperator["NOT_CONTAINS"] = "not_contains";
    ConditionOperator["STARTS_WITH"] = "starts_with";
    ConditionOperator["ENDS_WITH"] = "ends_with";
    ConditionOperator["MATCHES_REGEX"] = "matches_regex";
    ConditionOperator["GREATER_THAN"] = "greater_than";
    ConditionOperator["LESS_THAN"] = "less_than";
    ConditionOperator["BETWEEN"] = "between";
    ConditionOperator["IN_LIST"] = "in_list";
    ConditionOperator["NOT_IN_LIST"] = "not_in_list";
    ConditionOperator["IS_EMPTY"] = "is_empty";
    ConditionOperator["IS_NOT_EMPTY"] = "is_not_empty";
})(ConditionOperator || (exports.ConditionOperator = ConditionOperator = {}));
/**
 * Rule action types
 */
var ActionType;
(function (ActionType) {
    ActionType["MOVE"] = "move";
    ActionType["COPY"] = "copy";
    ActionType["DELETE"] = "delete";
    ActionType["FORWARD"] = "forward";
    ActionType["REDIRECT"] = "redirect";
    ActionType["REPLY"] = "reply";
    ActionType["FLAG"] = "flag";
    ActionType["UNFLAG"] = "unflag";
    ActionType["MARK_READ"] = "mark_read";
    ActionType["MARK_UNREAD"] = "mark_unread";
    ActionType["CATEGORIZE"] = "categorize";
    ActionType["SET_IMPORTANCE"] = "set_importance";
    ActionType["ADD_LABEL"] = "add_label";
    ActionType["REMOVE_LABEL"] = "remove_label";
    ActionType["STOP_PROCESSING"] = "stop_processing";
    ActionType["ARCHIVE"] = "archive";
    ActionType["SPAM"] = "spam";
    ActionType["NOT_SPAM"] = "not_spam";
    ActionType["NOTIFY"] = "notify";
    ActionType["EXECUTE_SCRIPT"] = "execute_script";
})(ActionType || (exports.ActionType = ActionType = {}));
/**
 * Rule execution status
 */
var RuleExecutionStatus;
(function (RuleExecutionStatus) {
    RuleExecutionStatus["SUCCESS"] = "success";
    RuleExecutionStatus["FAILED"] = "failed";
    RuleExecutionStatus["PARTIAL"] = "partial";
    RuleExecutionStatus["SKIPPED"] = "skipped";
})(RuleExecutionStatus || (exports.RuleExecutionStatus = RuleExecutionStatus = {}));
/**
 * Message importance levels
 */
var ImportanceLevel;
(function (ImportanceLevel) {
    ImportanceLevel["LOW"] = "low";
    ImportanceLevel["NORMAL"] = "normal";
    ImportanceLevel["HIGH"] = "high";
})(ImportanceLevel || (exports.ImportanceLevel = ImportanceLevel = {}));
/**
 * Message sensitivity levels
 */
var SensitivityLevel;
(function (SensitivityLevel) {
    SensitivityLevel["NORMAL"] = "normal";
    SensitivityLevel["PERSONAL"] = "personal";
    SensitivityLevel["PRIVATE"] = "private";
    SensitivityLevel["CONFIDENTIAL"] = "confidential";
})(SensitivityLevel || (exports.SensitivityLevel = SensitivityLevel = {}));
/**
 * Defines the MailRule model schema.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<MailRuleModel>} MailRule model
 *
 * @example
 * ```typescript
 * const MailRule = defineMailRuleModel(sequelize);
 * const rule = await MailRule.findByPk(ruleId);
 * ```
 */
function defineMailRuleModel(sequelize) {
    const MailRule = sequelize.define('MailRule', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        ruleType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(RuleType)),
            allowNull: false,
            defaultValue: RuleType.SERVER_SIDE,
        },
        scope: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(RuleScope)),
            allowNull: false,
            defaultValue: RuleScope.INCOMING,
        },
        isEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        conditionLogic: {
            type: sequelize_1.DataTypes.ENUM('AND', 'OR'),
            allowNull: false,
            defaultValue: 'AND',
        },
        isTemplate: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        templateId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        executionCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        lastExecutedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        successCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        failureCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'mail_rules',
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['userId', 'priority'] },
            { fields: ['isEnabled'] },
            { fields: ['scope'] },
            { fields: ['ruleType'] },
            { fields: ['templateId'] },
        ],
    });
    return MailRule;
}
/**
 * Defines the RuleCondition model schema.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<RuleConditionModel>} RuleCondition model
 *
 * @example
 * ```typescript
 * const RuleCondition = defineRuleConditionModel(sequelize);
 * const conditions = await RuleCondition.findAll({ where: { ruleId } });
 * ```
 */
function defineRuleConditionModel(sequelize) {
    const RuleCondition = sequelize.define('RuleCondition', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        ruleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'mail_rules', key: 'id' },
            onDelete: 'CASCADE',
        },
        conditionType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ConditionType)),
            allowNull: false,
        },
        operator: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ConditionOperator)),
            allowNull: false,
        },
        value: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        caseSensitive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        negate: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        order: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'rule_conditions',
        timestamps: true,
        indexes: [
            { fields: ['ruleId'] },
            { fields: ['ruleId', 'order'] },
            { fields: ['conditionType'] },
        ],
    });
    return RuleCondition;
}
/**
 * Defines the RuleAction model schema.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<RuleActionModel>} RuleAction model
 *
 * @example
 * ```typescript
 * const RuleAction = defineRuleActionModel(sequelize);
 * const actions = await RuleAction.findAll({ where: { ruleId } });
 * ```
 */
function defineRuleActionModel(sequelize) {
    const RuleAction = sequelize.define('RuleAction', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        ruleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'mail_rules', key: 'id' },
            onDelete: 'CASCADE',
        },
        actionType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ActionType)),
            allowNull: false,
        },
        parameters: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        order: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        stopProcessing: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'rule_actions',
        timestamps: true,
        indexes: [
            { fields: ['ruleId'] },
            { fields: ['ruleId', 'order'] },
            { fields: ['actionType'] },
        ],
    });
    return RuleAction;
}
/**
 * Defines the RuleExecutionLog model schema.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<RuleExecutionLogModel>} RuleExecutionLog model
 *
 * @example
 * ```typescript
 * const RuleExecutionLog = defineRuleExecutionLogModel(sequelize);
 * const logs = await RuleExecutionLog.findAll({ where: { ruleId } });
 * ```
 */
function defineRuleExecutionLogModel(sequelize) {
    const RuleExecutionLog = sequelize.define('RuleExecutionLog', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        ruleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'mail_rules', key: 'id' },
        },
        messageId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(RuleExecutionStatus)),
            allowNull: false,
        },
        conditionsMatched: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
        actionsExecuted: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        actionsFailed: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        executionTimeMs: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        error: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'rule_execution_logs',
        timestamps: false,
        indexes: [
            { fields: ['ruleId'] },
            { fields: ['messageId'] },
            { fields: ['status'] },
            { fields: ['createdAt'] },
        ],
    });
    return RuleExecutionLog;
}
// ============================================================================
// RULE CREATION AND MANAGEMENT
// ============================================================================
/**
 * Creates a new mail rule.
 *
 * @param {Partial<MailRule>} ruleData - Rule data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MailRule>} Created rule
 *
 * @example
 * ```typescript
 * const rule = await createMailRule({
 *   userId: 'user-123',
 *   name: 'Move newsletters',
 *   conditions: [{ conditionType: ConditionType.SUBJECT, operator: ConditionOperator.CONTAINS, value: 'newsletter' }],
 *   actions: [{ actionType: ActionType.MOVE, parameters: { folderId: 'newsletters-folder' } }]
 * });
 * ```
 */
async function createMailRule(ruleData, transaction) {
    // Implementation would create rule with conditions and actions
    const rule = {
        id: generateUUID(),
        userId: ruleData.userId,
        name: ruleData.name,
        description: ruleData.description || null,
        ruleType: ruleData.ruleType || RuleType.SERVER_SIDE,
        scope: ruleData.scope || RuleScope.INCOMING,
        isEnabled: ruleData.isEnabled !== undefined ? ruleData.isEnabled : true,
        priority: ruleData.priority || 0,
        conditions: ruleData.conditions || [],
        conditionLogic: ruleData.conditionLogic || 'AND',
        actions: ruleData.actions || [],
        isTemplate: ruleData.isTemplate || false,
        templateId: ruleData.templateId || null,
        executionCount: 0,
        lastExecutedAt: null,
        successCount: 0,
        failureCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };
    return rule;
}
/**
 * Updates an existing mail rule.
 *
 * @param {string} ruleId - Rule ID
 * @param {Partial<MailRule>} updates - Rule updates
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MailRule>} Updated rule
 *
 * @example
 * ```typescript
 * const updated = await updateMailRule(ruleId, {
 *   name: 'Updated rule name',
 *   isEnabled: false
 * });
 * ```
 */
async function updateMailRule(ruleId, updates, transaction) {
    // Implementation would update rule
    const rule = await getMailRuleById(ruleId);
    return { ...rule, ...updates, updatedAt: new Date() };
}
/**
 * Deletes a mail rule.
 *
 * @param {string} ruleId - Rule ID
 * @param {boolean} [hardDelete=false] - Whether to hard delete
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteMailRule(ruleId);
 * ```
 */
async function deleteMailRule(ruleId, hardDelete = false, transaction) {
    // Implementation would delete rule (soft or hard)
}
/**
 * Gets a mail rule by ID.
 *
 * @param {string} ruleId - Rule ID
 * @param {boolean} [includeConditionsAndActions=true] - Whether to include conditions and actions
 * @returns {Promise<MailRule>} Mail rule
 *
 * @example
 * ```typescript
 * const rule = await getMailRuleById(ruleId);
 * ```
 */
async function getMailRuleById(ruleId, includeConditionsAndActions = true) {
    // Implementation would fetch rule
    return {};
}
/**
 * Gets all mail rules for a user.
 *
 * @param {string} userId - User ID
 * @param {boolean} [enabledOnly=false] - Whether to return only enabled rules
 * @returns {Promise<MailRule[]>} Array of mail rules
 *
 * @example
 * ```typescript
 * const rules = await getUserMailRules(userId, true);
 * ```
 */
async function getUserMailRules(userId, enabledOnly = false) {
    // Implementation would fetch user rules ordered by priority
    return [];
}
/**
 * Enables a mail rule.
 *
 * @param {string} ruleId - Rule ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enableMailRule(ruleId);
 * ```
 */
async function enableMailRule(ruleId, transaction) {
    // Implementation would enable rule
}
/**
 * Disables a mail rule.
 *
 * @param {string} ruleId - Rule ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await disableMailRule(ruleId);
 * ```
 */
async function disableMailRule(ruleId, transaction) {
    // Implementation would disable rule
}
/**
 * Updates rule priority/order.
 *
 * @param {string} ruleId - Rule ID
 * @param {number} newPriority - New priority value
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateRulePriority(ruleId, 10);
 * ```
 */
async function updateRulePriority(ruleId, newPriority, transaction) {
    // Implementation would update priority and reorder other rules
}
// ============================================================================
// CONDITION EVALUATION
// ============================================================================
/**
 * Evaluates a single condition against a message.
 *
 * @param {RuleCondition} condition - Rule condition
 * @param {MessageContext} message - Message context
 * @returns {Promise<boolean>} Whether condition matches
 *
 * @example
 * ```typescript
 * const matches = await evaluateCondition(condition, messageContext);
 * ```
 */
async function evaluateCondition(condition, message) {
    let result = false;
    switch (condition.conditionType) {
        case ConditionType.FROM:
            result = await evaluateFromCondition(condition, message);
            break;
        case ConditionType.TO:
        case ConditionType.CC:
        case ConditionType.TO_OR_CC:
            result = await evaluateRecipientCondition(condition, message);
            break;
        case ConditionType.SUBJECT:
            result = await evaluateSubjectCondition(condition, message);
            break;
        case ConditionType.BODY:
            result = await evaluateBodyCondition(condition, message);
            break;
        case ConditionType.ATTACHMENT:
            result = await evaluateAttachmentCondition(condition, message);
            break;
        case ConditionType.SIZE:
            result = await evaluateSizeCondition(condition, message);
            break;
        case ConditionType.DATE_RECEIVED:
            result = await evaluateDateCondition(condition, message);
            break;
        case ConditionType.IMPORTANCE:
            result = await evaluateImportanceCondition(condition, message);
            break;
        default:
            result = false;
    }
    return condition.negate ? !result : result;
}
/**
 * Evaluates FROM condition.
 *
 * @param {RuleCondition} condition - Rule condition
 * @param {MessageContext} message - Message context
 * @returns {Promise<boolean>} Whether condition matches
 *
 * @example
 * ```typescript
 * const matches = await evaluateFromCondition(condition, messageContext);
 * ```
 */
async function evaluateFromCondition(condition, message) {
    return compareString(message.from, condition.value, condition.operator, condition.caseSensitive);
}
/**
 * Evaluates recipient conditions (TO, CC, TO_OR_CC).
 *
 * @param {RuleCondition} condition - Rule condition
 * @param {MessageContext} message - Message context
 * @returns {Promise<boolean>} Whether condition matches
 *
 * @example
 * ```typescript
 * const matches = await evaluateRecipientCondition(condition, messageContext);
 * ```
 */
async function evaluateRecipientCondition(condition, message) {
    let recipients = [];
    if (condition.conditionType === ConditionType.TO) {
        recipients = message.to;
    }
    else if (condition.conditionType === ConditionType.CC) {
        recipients = message.cc;
    }
    else {
        recipients = [...message.to, ...message.cc];
    }
    return recipients.some(recipient => compareString(recipient, condition.value, condition.operator, condition.caseSensitive));
}
/**
 * Evaluates SUBJECT condition.
 *
 * @param {RuleCondition} condition - Rule condition
 * @param {MessageContext} message - Message context
 * @returns {Promise<boolean>} Whether condition matches
 *
 * @example
 * ```typescript
 * const matches = await evaluateSubjectCondition(condition, messageContext);
 * ```
 */
async function evaluateSubjectCondition(condition, message) {
    return compareString(message.subject, condition.value, condition.operator, condition.caseSensitive);
}
/**
 * Evaluates BODY condition.
 *
 * @param {RuleCondition} condition - Rule condition
 * @param {MessageContext} message - Message context
 * @returns {Promise<boolean>} Whether condition matches
 *
 * @example
 * ```typescript
 * const matches = await evaluateBodyCondition(condition, messageContext);
 * ```
 */
async function evaluateBodyCondition(condition, message) {
    const body = message.bodyPlain || message.body;
    return compareString(body, condition.value, condition.operator, condition.caseSensitive);
}
/**
 * Evaluates ATTACHMENT condition.
 *
 * @param {RuleCondition} condition - Rule condition
 * @param {MessageContext} message - Message context
 * @returns {Promise<boolean>} Whether condition matches
 *
 * @example
 * ```typescript
 * const matches = await evaluateAttachmentCondition(condition, messageContext);
 * ```
 */
async function evaluateAttachmentCondition(condition, message) {
    if (condition.operator === ConditionOperator.IS_EMPTY) {
        return message.attachments.length === 0;
    }
    if (condition.operator === ConditionOperator.IS_NOT_EMPTY) {
        return message.attachments.length > 0;
    }
    return message.attachments.some(attachment => compareString(attachment.filename, condition.value, condition.operator, condition.caseSensitive));
}
/**
 * Evaluates SIZE condition.
 *
 * @param {RuleCondition} condition - Rule condition
 * @param {MessageContext} message - Message context
 * @returns {Promise<boolean>} Whether condition matches
 *
 * @example
 * ```typescript
 * const matches = await evaluateSizeCondition(condition, messageContext);
 * ```
 */
async function evaluateSizeCondition(condition, message) {
    return compareNumber(message.sizeBytes, condition.value, condition.operator);
}
/**
 * Evaluates DATE_RECEIVED condition.
 *
 * @param {RuleCondition} condition - Rule condition
 * @param {MessageContext} message - Message context
 * @returns {Promise<boolean>} Whether condition matches
 *
 * @example
 * ```typescript
 * const matches = await evaluateDateCondition(condition, messageContext);
 * ```
 */
async function evaluateDateCondition(condition, message) {
    const messageTime = message.dateReceived.getTime();
    const compareTime = new Date(condition.value).getTime();
    return compareNumber(messageTime, compareTime, condition.operator);
}
/**
 * Evaluates IMPORTANCE condition.
 *
 * @param {RuleCondition} condition - Rule condition
 * @param {MessageContext} message - Message context
 * @returns {Promise<boolean>} Whether condition matches
 *
 * @example
 * ```typescript
 * const matches = await evaluateImportanceCondition(condition, messageContext);
 * ```
 */
async function evaluateImportanceCondition(condition, message) {
    return compareString(message.importance, condition.value, condition.operator, false);
}
/**
 * Evaluates all conditions for a rule.
 *
 * @param {MailRule} rule - Mail rule
 * @param {MessageContext} message - Message context
 * @returns {Promise<boolean>} Whether all conditions match
 *
 * @example
 * ```typescript
 * const allMatch = await evaluateAllConditions(rule, messageContext);
 * ```
 */
async function evaluateAllConditions(rule, message) {
    if (!rule.conditions || rule.conditions.length === 0) {
        return true;
    }
    const results = await Promise.all(rule.conditions.map(condition => evaluateCondition(condition, message)));
    if (rule.conditionLogic === 'AND') {
        return results.every(r => r);
    }
    else {
        return results.some(r => r);
    }
}
// ============================================================================
// ACTION EXECUTION
// ============================================================================
/**
 * Executes a single rule action.
 *
 * @param {RuleAction} action - Rule action
 * @param {MessageContext} message - Message context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeAction(action, messageContext);
 * ```
 */
async function executeAction(action, message, transaction) {
    switch (action.actionType) {
        case ActionType.MOVE:
            await executeMoveAction(action, message, transaction);
            break;
        case ActionType.COPY:
            await executeCopyAction(action, message, transaction);
            break;
        case ActionType.DELETE:
            await executeDeleteAction(action, message, transaction);
            break;
        case ActionType.FORWARD:
            await executeForwardAction(action, message, transaction);
            break;
        case ActionType.FLAG:
            await executeFlagAction(action, message, transaction);
            break;
        case ActionType.CATEGORIZE:
            await executeCategorizeAction(action, message, transaction);
            break;
        case ActionType.MARK_READ:
            await executeMarkReadAction(action, message, transaction);
            break;
        default:
            // Other action types
            break;
    }
}
/**
 * Executes MOVE action.
 *
 * @param {RuleAction} action - Rule action
 * @param {MessageContext} message - Message context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeMoveAction(action, messageContext);
 * ```
 */
async function executeMoveAction(action, message, transaction) {
    // Implementation would move message to target folder
    const targetFolderId = action.parameters.folderId;
    // Move message logic here
}
/**
 * Executes COPY action.
 *
 * @param {RuleAction} action - Rule action
 * @param {MessageContext} message - Message context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeCopyAction(action, messageContext);
 * ```
 */
async function executeCopyAction(action, message, transaction) {
    // Implementation would copy message to target folder
    const targetFolderId = action.parameters.folderId;
    // Copy message logic here
}
/**
 * Executes DELETE action.
 *
 * @param {RuleAction} action - Rule action
 * @param {MessageContext} message - Message context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeDeleteAction(action, messageContext);
 * ```
 */
async function executeDeleteAction(action, message, transaction) {
    // Implementation would delete or move to trash
    const permanent = action.parameters.permanent || false;
    // Delete message logic here
}
/**
 * Executes FORWARD action.
 *
 * @param {RuleAction} action - Rule action
 * @param {MessageContext} message - Message context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeForwardAction(action, messageContext);
 * ```
 */
async function executeForwardAction(action, message, transaction) {
    // Implementation would forward message
    const recipients = action.parameters.recipients;
    // Forward message logic here
}
/**
 * Executes FLAG action.
 *
 * @param {RuleAction} action - Rule action
 * @param {MessageContext} message - Message context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeFlagAction(action, messageContext);
 * ```
 */
async function executeFlagAction(action, message, transaction) {
    // Implementation would add flag to message
    const flagName = action.parameters.flag;
    // Add flag logic here
}
/**
 * Executes CATEGORIZE action.
 *
 * @param {RuleAction} action - Rule action
 * @param {MessageContext} message - Message context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeCategorizeAction(action, messageContext);
 * ```
 */
async function executeCategorizeAction(action, message, transaction) {
    // Implementation would add category to message
    const category = action.parameters.category;
    // Add category logic here
}
/**
 * Executes MARK_READ action.
 *
 * @param {RuleAction} action - Rule action
 * @param {MessageContext} message - Message context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeMarkReadAction(action, messageContext);
 * ```
 */
async function executeMarkReadAction(action, message, transaction) {
    // Implementation would mark message as read
    // Mark read logic here
}
/**
 * Executes all actions for a rule.
 *
 * @param {MailRule} rule - Mail rule
 * @param {MessageContext} message - Message context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ executed: number; failed: number }>} Execution results
 *
 * @example
 * ```typescript
 * const result = await executeAllActions(rule, messageContext);
 * ```
 */
async function executeAllActions(rule, message, transaction) {
    let executed = 0;
    let failed = 0;
    for (const action of rule.actions.sort((a, b) => a.order - b.order)) {
        try {
            await executeAction(action, message, transaction);
            executed++;
            if (action.stopProcessing) {
                break;
            }
        }
        catch (error) {
            failed++;
        }
    }
    return { executed, failed };
}
// ============================================================================
// RULE EXECUTION ENGINE
// ============================================================================
/**
 * Executes all applicable rules for a message.
 *
 * @param {string} userId - User ID
 * @param {MessageContext} message - Message context
 * @param {RuleScope} scope - Rule scope
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RuleExecutionResult[]>} Execution results
 *
 * @example
 * ```typescript
 * const results = await executeRulesForMessage(userId, messageContext, RuleScope.INCOMING);
 * ```
 */
async function executeRulesForMessage(userId, message, scope, transaction) {
    const rules = await getUserMailRules(userId, true);
    const applicableRules = rules.filter(r => r.scope === scope || r.scope === RuleScope.ALL_MESSAGES);
    const results = [];
    for (const rule of applicableRules.sort((a, b) => b.priority - a.priority)) {
        const startTime = Date.now();
        try {
            const conditionsMatched = await evaluateAllConditions(rule, message);
            if (conditionsMatched) {
                const { executed, failed } = await executeAllActions(rule, message, transaction);
                const result = {
                    ruleId: rule.id,
                    ruleName: rule.name,
                    status: failed > 0 ? RuleExecutionStatus.PARTIAL : RuleExecutionStatus.SUCCESS,
                    conditionsMatched: true,
                    actionsExecuted: executed,
                    actionsFailed: failed,
                    executionTimeMs: Date.now() - startTime,
                    error: null,
                    metadata: {},
                };
                results.push(result);
                await logRuleExecution(result, message.messageId, transaction);
                // Check if rule has stop processing action
                const hasStopProcessing = rule.actions.some(a => a.stopProcessing);
                if (hasStopProcessing) {
                    break;
                }
            }
            else {
                results.push({
                    ruleId: rule.id,
                    ruleName: rule.name,
                    status: RuleExecutionStatus.SKIPPED,
                    conditionsMatched: false,
                    actionsExecuted: 0,
                    actionsFailed: 0,
                    executionTimeMs: Date.now() - startTime,
                    error: null,
                    metadata: {},
                });
            }
        }
        catch (error) {
            results.push({
                ruleId: rule.id,
                ruleName: rule.name,
                status: RuleExecutionStatus.FAILED,
                conditionsMatched: false,
                actionsExecuted: 0,
                actionsFailed: 0,
                executionTimeMs: Date.now() - startTime,
                error: error instanceof Error ? error.message : 'Unknown error',
                metadata: {},
            });
        }
    }
    return results;
}
/**
 * Logs rule execution result.
 *
 * @param {RuleExecutionResult} result - Execution result
 * @param {string} messageId - Message ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logRuleExecution(executionResult, messageId);
 * ```
 */
async function logRuleExecution(result, messageId, transaction) {
    // Implementation would log execution to database
}
// ============================================================================
// RULE VALIDATION
// ============================================================================
/**
 * Validates a mail rule configuration.
 *
 * @param {Partial<MailRule>} rule - Rule to validate
 * @returns {Promise<RuleValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMailRule(ruleData);
 * if (!validation.isValid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
async function validateMailRule(rule) {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    // Validate required fields
    if (!rule.name || rule.name.trim() === '') {
        errors.push('Rule name is required');
    }
    if (!rule.conditions || rule.conditions.length === 0) {
        warnings.push('Rule has no conditions - it will match all messages');
    }
    if (!rule.actions || rule.actions.length === 0) {
        errors.push('Rule must have at least one action');
    }
    // Validate conditions
    if (rule.conditions) {
        for (const condition of rule.conditions) {
            const conditionValidation = validateCondition(condition);
            errors.push(...conditionValidation.errors);
            warnings.push(...conditionValidation.warnings);
        }
    }
    // Validate actions
    if (rule.actions) {
        for (const action of rule.actions) {
            const actionValidation = validateAction(action);
            errors.push(...actionValidation.errors);
            warnings.push(...actionValidation.warnings);
        }
    }
    // Provide suggestions
    if (rule.priority === 0) {
        suggestions.push('Consider setting a priority to control rule execution order');
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions,
    };
}
/**
 * Validates a rule condition.
 *
 * @param {Partial<RuleCondition>} condition - Condition to validate
 * @returns {RuleValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateCondition(conditionData);
 * ```
 */
function validateCondition(condition) {
    const errors = [];
    const warnings = [];
    if (!condition.conditionType) {
        errors.push('Condition type is required');
    }
    if (!condition.operator) {
        errors.push('Condition operator is required');
    }
    if (condition.value === undefined || condition.value === null) {
        if (condition.operator !== ConditionOperator.IS_EMPTY && condition.operator !== ConditionOperator.IS_NOT_EMPTY) {
            errors.push('Condition value is required');
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions: [],
    };
}
/**
 * Validates a rule action.
 *
 * @param {Partial<RuleAction>} action - Action to validate
 * @returns {RuleValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAction(actionData);
 * ```
 */
function validateAction(action) {
    const errors = [];
    const warnings = [];
    if (!action.actionType) {
        errors.push('Action type is required');
    }
    // Validate action-specific parameters
    if (action.actionType === ActionType.MOVE || action.actionType === ActionType.COPY) {
        if (!action.parameters?.folderId) {
            errors.push(`${action.actionType} action requires folderId parameter`);
        }
    }
    if (action.actionType === ActionType.FORWARD || action.actionType === ActionType.REDIRECT) {
        if (!action.parameters?.recipients || action.parameters.recipients.length === 0) {
            errors.push(`${action.actionType} action requires recipients parameter`);
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions: [],
    };
}
/**
 * Tests a rule against a message without executing actions.
 *
 * @param {MailRule} rule - Rule to test
 * @param {MessageContext} message - Message to test against
 * @returns {Promise<RuleTestResult>} Test result
 *
 * @example
 * ```typescript
 * const testResult = await testRuleAgainstMessage(rule, messageContext);
 * console.log('Would match:', testResult.wouldMatch);
 * ```
 */
async function testRuleAgainstMessage(rule, message) {
    const matchedConditions = [];
    const unmatchedConditions = [];
    for (const condition of rule.conditions) {
        const matches = await evaluateCondition(condition, message);
        if (matches) {
            matchedConditions.push(`${condition.conditionType} ${condition.operator} ${condition.value}`);
        }
        else {
            unmatchedConditions.push(`${condition.conditionType} ${condition.operator} ${condition.value}`);
        }
    }
    const wouldMatch = await evaluateAllConditions(rule, message);
    const actionsToExecute = wouldMatch ? rule.actions.map(a => a.actionType) : [];
    return {
        messageId: message.messageId,
        wouldMatch,
        matchedConditions,
        unmatchedConditions,
        actionsToExecute,
        simulationResult: {
            folderId: message.folderId,
            isRead: message.isRead,
            flags: message.flags,
            categories: message.categories,
        },
    };
}
// ============================================================================
// BULK OPERATIONS
// ============================================================================
/**
 * Enables multiple rules in bulk.
 *
 * @param {string[]} ruleIds - Rule IDs to enable
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BulkRuleOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await bulkEnableRules([ruleId1, ruleId2, ruleId3]);
 * ```
 */
async function bulkEnableRules(ruleIds, transaction) {
    const errors = [];
    let successCount = 0;
    for (const ruleId of ruleIds) {
        try {
            await enableMailRule(ruleId, transaction);
            successCount++;
        }
        catch (error) {
            errors.push({
                ruleId,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    return {
        totalRules: ruleIds.length,
        successCount,
        failureCount: errors.length,
        errors,
    };
}
/**
 * Disables multiple rules in bulk.
 *
 * @param {string[]} ruleIds - Rule IDs to disable
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BulkRuleOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await bulkDisableRules([ruleId1, ruleId2, ruleId3]);
 * ```
 */
async function bulkDisableRules(ruleIds, transaction) {
    const errors = [];
    let successCount = 0;
    for (const ruleId of ruleIds) {
        try {
            await disableMailRule(ruleId, transaction);
            successCount++;
        }
        catch (error) {
            errors.push({
                ruleId,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    return {
        totalRules: ruleIds.length,
        successCount,
        failureCount: errors.length,
        errors,
    };
}
/**
 * Deletes multiple rules in bulk.
 *
 * @param {string[]} ruleIds - Rule IDs to delete
 * @param {boolean} [hardDelete=false] - Whether to hard delete
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BulkRuleOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await bulkDeleteRules([ruleId1, ruleId2, ruleId3]);
 * ```
 */
async function bulkDeleteRules(ruleIds, hardDelete = false, transaction) {
    const errors = [];
    let successCount = 0;
    for (const ruleId of ruleIds) {
        try {
            await deleteMailRule(ruleId, hardDelete, transaction);
            successCount++;
        }
        catch (error) {
            errors.push({
                ruleId,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    return {
        totalRules: ruleIds.length,
        successCount,
        failureCount: errors.length,
        errors,
    };
}
/**
 * Reorders multiple rules by updating their priorities.
 *
 * @param {Array<{ ruleId: string; priority: number }>} ruleOrders - Rule order mappings
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BulkRuleOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await bulkReorderRules([
 *   { ruleId: rule1, priority: 1 },
 *   { ruleId: rule2, priority: 2 }
 * ]);
 * ```
 */
async function bulkReorderRules(ruleOrders, transaction) {
    const errors = [];
    let successCount = 0;
    for (const { ruleId, priority } of ruleOrders) {
        try {
            await updateRulePriority(ruleId, priority, transaction);
            successCount++;
        }
        catch (error) {
            errors.push({
                ruleId,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    return {
        totalRules: ruleOrders.length,
        successCount,
        failureCount: errors.length,
        errors,
    };
}
// ============================================================================
// NESTJS SERVICE METHODS
// ============================================================================
/**
 * NestJS service method to create a mail rule.
 *
 * @param {string} userId - User ID
 * @param {Partial<MailRule>} ruleData - Rule data
 * @returns {Promise<MailRule>} Created rule
 *
 * @example
 * ```typescript
 * @Injectable()
 * class MailRulesService {
 *   async createRule(userId: string, dto: CreateRuleDto) {
 *     return await createRuleService(userId, dto);
 *   }
 * }
 * ```
 */
async function createRuleService(userId, ruleData) {
    const validation = await validateMailRule(ruleData);
    if (!validation.isValid) {
        throw new Error(`Invalid rule: ${validation.errors.join(', ')}`);
    }
    return await createMailRule({ ...ruleData, userId });
}
/**
 * NestJS service method to get user's mail rules.
 *
 * @param {string} userId - User ID
 * @returns {Promise<MailRule[]>} User's rules
 *
 * @example
 * ```typescript
 * @Injectable()
 * class MailRulesService {
 *   async getUserRules(userId: string) {
 *     return await getUserRulesService(userId);
 *   }
 * }
 * ```
 */
async function getUserRulesService(userId) {
    return await getUserMailRules(userId, false);
}
/**
 * NestJS service method to execute rules for a new message.
 *
 * @param {string} userId - User ID
 * @param {MessageContext} message - Message context
 * @returns {Promise<RuleExecutionResult[]>} Execution results
 *
 * @example
 * ```typescript
 * @Injectable()
 * class MailRulesService {
 *   async processIncomingMessage(userId: string, message: MessageContext) {
 *     return await processMessageRulesService(userId, message);
 *   }
 * }
 * ```
 */
async function processMessageRulesService(userId, message) {
    return await executeRulesForMessage(userId, message, RuleScope.INCOMING);
}
// ============================================================================
// SWAGGER DOCUMENTATION
// ============================================================================
/**
 * Generates Swagger ApiResponse documentation for MailRule.
 *
 * @returns {object} ApiResponse configuration
 *
 * @example
 * ```typescript
 * @ApiResponse(getMailRuleResponse())
 * async getRule(@Param('id') id: string) {
 *   return await this.rulesService.getRule(id);
 * }
 * ```
 */
function getMailRuleResponse() {
    return {
        status: 200,
        description: 'Mail rule retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                userId: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                description: { type: 'string', nullable: true },
                ruleType: { type: 'string', enum: Object.values(RuleType) },
                scope: { type: 'string', enum: Object.values(RuleScope) },
                isEnabled: { type: 'boolean' },
                priority: { type: 'number' },
                conditionLogic: { type: 'string', enum: ['AND', 'OR'] },
                conditions: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/RuleCondition' },
                },
                actions: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/RuleAction' },
                },
                executionCount: { type: 'number' },
                lastExecutedAt: { type: 'string', format: 'date-time', nullable: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    };
}
/**
 * Generates Swagger ApiResponse documentation for RuleCondition schema.
 *
 * @returns {object} ApiResponse configuration
 *
 * @example
 * ```typescript
 * @ApiExtraModels(RuleCondition)
 * class CreateRuleDto {
 *   conditions: RuleCondition[];
 * }
 * ```
 */
function getRuleConditionSchema() {
    return {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            conditionType: { type: 'string', enum: Object.values(ConditionType) },
            operator: { type: 'string', enum: Object.values(ConditionOperator) },
            value: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'array', items: { type: 'string' } }] },
            caseSensitive: { type: 'boolean', default: false },
            negate: { type: 'boolean', default: false },
            order: { type: 'number', default: 0 },
        },
    };
}
/**
 * Generates Swagger ApiResponse documentation for RuleAction schema.
 *
 * @returns {object} ApiResponse configuration
 *
 * @example
 * ```typescript
 * @ApiExtraModels(RuleAction)
 * class CreateRuleDto {
 *   actions: RuleAction[];
 * }
 * ```
 */
function getRuleActionSchema() {
    return {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            actionType: { type: 'string', enum: Object.values(ActionType) },
            parameters: { type: 'object', additionalProperties: true },
            order: { type: 'number', default: 0 },
            stopProcessing: { type: 'boolean', default: false },
        },
    };
}
/**
 * Generates Swagger ApiOperation documentation for create rule endpoint.
 *
 * @returns {object} ApiOperation configuration
 *
 * @example
 * ```typescript
 * @ApiOperation(getCreateRuleOperation())
 * async createRule(@Body() dto: CreateRuleDto) {
 *   return await this.rulesService.createRule(dto);
 * }
 * ```
 */
function getCreateRuleOperation() {
    return {
        summary: 'Create a new mail rule',
        description: 'Creates a new mail rule with conditions and actions. Rules are executed in priority order ' +
            'when processing incoming or outgoing messages. Supports server-side and client-side rules.',
        operationId: 'createMailRule',
        tags: ['Mail Rules'],
    };
}
/**
 * Generates Swagger ApiOperation documentation for execute rules endpoint.
 *
 * @returns {object} ApiOperation configuration
 *
 * @example
 * ```typescript
 * @ApiOperation(getExecuteRulesOperation())
 * async executeRules(@Body() dto: ExecuteRulesDto) {
 *   return await this.rulesService.executeRules(dto);
 * }
 * ```
 */
function getExecuteRulesOperation() {
    return {
        summary: 'Execute rules against a message',
        description: 'Executes all applicable mail rules against a message. Rules are evaluated based on their ' +
            'conditions and priority. Actions are executed for matching rules. Returns execution results.',
        operationId: 'executeMailRules',
        tags: ['Mail Rules', 'Execution'],
    };
}
/**
 * Generates Swagger ApiOperation documentation for test rule endpoint.
 *
 * @returns {object} ApiOperation configuration
 *
 * @example
 * ```typescript
 * @ApiOperation(getTestRuleOperation())
 * async testRule(@Body() dto: TestRuleDto) {
 *   return await this.rulesService.testRule(dto);
 * }
 * ```
 */
function getTestRuleOperation() {
    return {
        summary: 'Test a rule against a message',
        description: 'Tests a mail rule against a message without executing actions. Returns which conditions ' +
            'match and what actions would be executed. Useful for rule validation and debugging.',
        operationId: 'testMailRule',
        tags: ['Mail Rules', 'Testing'],
    };
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Compares two strings based on operator.
 *
 * @param {string} value - Value to compare
 * @param {string} compareValue - Value to compare against
 * @param {ConditionOperator} operator - Comparison operator
 * @param {boolean} caseSensitive - Whether comparison is case sensitive
 * @returns {boolean} Comparison result
 *
 * @example
 * ```typescript
 * const matches = compareString('test@example.com', 'example.com', ConditionOperator.CONTAINS, false);
 * ```
 */
function compareString(value, compareValue, operator, caseSensitive) {
    const val = caseSensitive ? value : value.toLowerCase();
    const cmp = caseSensitive ? compareValue : compareValue.toLowerCase();
    switch (operator) {
        case ConditionOperator.EQUALS:
            return val === cmp;
        case ConditionOperator.NOT_EQUALS:
            return val !== cmp;
        case ConditionOperator.CONTAINS:
            return val.includes(cmp);
        case ConditionOperator.NOT_CONTAINS:
            return !val.includes(cmp);
        case ConditionOperator.STARTS_WITH:
            return val.startsWith(cmp);
        case ConditionOperator.ENDS_WITH:
            return val.endsWith(cmp);
        case ConditionOperator.MATCHES_REGEX:
            return new RegExp(cmp, caseSensitive ? '' : 'i').test(val);
        case ConditionOperator.IS_EMPTY:
            return val === '';
        case ConditionOperator.IS_NOT_EMPTY:
            return val !== '';
        default:
            return false;
    }
}
/**
 * Compares two numbers based on operator.
 *
 * @param {number} value - Value to compare
 * @param {number} compareValue - Value to compare against
 * @param {ConditionOperator} operator - Comparison operator
 * @returns {boolean} Comparison result
 *
 * @example
 * ```typescript
 * const matches = compareNumber(1024000, 1000000, ConditionOperator.GREATER_THAN);
 * ```
 */
function compareNumber(value, compareValue, operator) {
    switch (operator) {
        case ConditionOperator.EQUALS:
            return value === compareValue;
        case ConditionOperator.NOT_EQUALS:
            return value !== compareValue;
        case ConditionOperator.GREATER_THAN:
            return value > compareValue;
        case ConditionOperator.LESS_THAN:
            return value < compareValue;
        default:
            return false;
    }
}
/**
 * Generates a UUID v4.
 *
 * @returns {string} UUID v4
 *
 * @example
 * ```typescript
 * const ruleId = generateUUID();
 * ```
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
//# sourceMappingURL=mail-rules-filters-kit.js.map