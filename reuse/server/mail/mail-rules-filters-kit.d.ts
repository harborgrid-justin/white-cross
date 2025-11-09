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
import { Model, ModelStatic, Sequelize, Transaction, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
/**
 * Mail rule types
 */
export declare enum RuleType {
    SERVER_SIDE = "server_side",
    CLIENT_SIDE = "client_side",
    BOTH = "both"
}
/**
 * Rule execution scope
 */
export declare enum RuleScope {
    ALL_MESSAGES = "all_messages",
    INCOMING = "incoming",
    OUTGOING = "outgoing",
    MANUAL = "manual"
}
/**
 * Rule condition types
 */
export declare enum ConditionType {
    FROM = "from",
    TO = "to",
    CC = "cc",
    TO_OR_CC = "to_or_cc",
    SUBJECT = "subject",
    BODY = "body",
    ATTACHMENT = "attachment",
    SIZE = "size",
    DATE_RECEIVED = "date_received",
    IMPORTANCE = "importance",
    SENSITIVITY = "sensitivity",
    CATEGORY = "category",
    FLAG = "flag",
    READ_STATUS = "read_status",
    HEADER = "header",
    SENDER_DOMAIN = "sender_domain",
    RECIPIENT_COUNT = "recipient_count"
}
/**
 * Condition operators
 */
export declare enum ConditionOperator {
    EQUALS = "equals",
    NOT_EQUALS = "not_equals",
    CONTAINS = "contains",
    NOT_CONTAINS = "not_contains",
    STARTS_WITH = "starts_with",
    ENDS_WITH = "ends_with",
    MATCHES_REGEX = "matches_regex",
    GREATER_THAN = "greater_than",
    LESS_THAN = "less_than",
    BETWEEN = "between",
    IN_LIST = "in_list",
    NOT_IN_LIST = "not_in_list",
    IS_EMPTY = "is_empty",
    IS_NOT_EMPTY = "is_not_empty"
}
/**
 * Rule action types
 */
export declare enum ActionType {
    MOVE = "move",
    COPY = "copy",
    DELETE = "delete",
    FORWARD = "forward",
    REDIRECT = "redirect",
    REPLY = "reply",
    FLAG = "flag",
    UNFLAG = "unflag",
    MARK_READ = "mark_read",
    MARK_UNREAD = "mark_unread",
    CATEGORIZE = "categorize",
    SET_IMPORTANCE = "set_importance",
    ADD_LABEL = "add_label",
    REMOVE_LABEL = "remove_label",
    STOP_PROCESSING = "stop_processing",
    ARCHIVE = "archive",
    SPAM = "spam",
    NOT_SPAM = "not_spam",
    NOTIFY = "notify",
    EXECUTE_SCRIPT = "execute_script"
}
/**
 * Rule execution status
 */
export declare enum RuleExecutionStatus {
    SUCCESS = "success",
    FAILED = "failed",
    PARTIAL = "partial",
    SKIPPED = "skipped"
}
/**
 * Message importance levels
 */
export declare enum ImportanceLevel {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high"
}
/**
 * Message sensitivity levels
 */
export declare enum SensitivityLevel {
    NORMAL = "normal",
    PERSONAL = "personal",
    PRIVATE = "private",
    CONFIDENTIAL = "confidential"
}
/**
 * Rule condition interface
 */
export interface RuleCondition {
    id: string;
    ruleId: string;
    conditionType: ConditionType;
    operator: ConditionOperator;
    value: string | number | string[];
    caseSensitive: boolean;
    negate: boolean;
    order: number;
    metadata: Record<string, any>;
}
/**
 * Rule action interface
 */
export interface RuleAction {
    id: string;
    ruleId: string;
    actionType: ActionType;
    parameters: Record<string, any>;
    order: number;
    stopProcessing: boolean;
    metadata: Record<string, any>;
}
/**
 * Mail rule interface
 */
export interface MailRule {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    ruleType: RuleType;
    scope: RuleScope;
    isEnabled: boolean;
    priority: number;
    conditions: RuleCondition[];
    conditionLogic: 'AND' | 'OR';
    actions: RuleAction[];
    isTemplate: boolean;
    templateId: string | null;
    executionCount: number;
    lastExecutedAt: Date | null;
    successCount: number;
    failureCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
/**
 * Rule execution result
 */
export interface RuleExecutionResult {
    ruleId: string;
    ruleName: string;
    status: RuleExecutionStatus;
    conditionsMatched: boolean;
    actionsExecuted: number;
    actionsFailed: number;
    executionTimeMs: number;
    error: string | null;
    metadata: Record<string, any>;
}
/**
 * Message context for rule evaluation
 */
export interface MessageContext {
    messageId: string;
    from: string;
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string;
    bodyPlain: string;
    headers: Record<string, string | string[]>;
    attachments: AttachmentInfo[];
    sizeBytes: number;
    dateReceived: Date;
    importance: ImportanceLevel;
    sensitivity: SensitivityLevel;
    categories: string[];
    flags: string[];
    isRead: boolean;
    folderId: string;
    labels: string[];
}
/**
 * Attachment information for rule evaluation
 */
export interface AttachmentInfo {
    filename: string;
    contentType: string;
    sizeBytes: number;
    extension: string;
}
/**
 * Rule validation result
 */
export interface RuleValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
}
/**
 * Bulk rule operation result
 */
export interface BulkRuleOperationResult {
    totalRules: number;
    successCount: number;
    failureCount: number;
    errors: Array<{
        ruleId: string;
        error: string;
    }>;
}
/**
 * Rule test result
 */
export interface RuleTestResult {
    messageId: string;
    wouldMatch: boolean;
    matchedConditions: string[];
    unmatchedConditions: string[];
    actionsToExecute: string[];
    simulationResult: Record<string, any>;
}
/**
 * MailRule Sequelize model interface
 */
export interface MailRuleModel extends Model<InferAttributes<MailRuleModel>, InferCreationAttributes<MailRuleModel>> {
    id: CreationOptional<string>;
    userId: string;
    name: string;
    description: string | null;
    ruleType: RuleType;
    scope: RuleScope;
    isEnabled: boolean;
    priority: number;
    conditionLogic: 'AND' | 'OR';
    isTemplate: boolean;
    templateId: string | null;
    executionCount: number;
    lastExecutedAt: Date | null;
    successCount: number;
    failureCount: number;
    metadata: Record<string, any>;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
    deletedAt: Date | null;
}
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
export declare function defineMailRuleModel(sequelize: Sequelize): ModelStatic<MailRuleModel>;
/**
 * RuleCondition Sequelize model interface
 */
export interface RuleConditionModel extends Model<InferAttributes<RuleConditionModel>, InferCreationAttributes<RuleConditionModel>> {
    id: CreationOptional<string>;
    ruleId: string;
    conditionType: ConditionType;
    operator: ConditionOperator;
    value: string | number | string[];
    caseSensitive: boolean;
    negate: boolean;
    order: number;
    metadata: Record<string, any>;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
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
export declare function defineRuleConditionModel(sequelize: Sequelize): ModelStatic<RuleConditionModel>;
/**
 * RuleAction Sequelize model interface
 */
export interface RuleActionModel extends Model<InferAttributes<RuleActionModel>, InferCreationAttributes<RuleActionModel>> {
    id: CreationOptional<string>;
    ruleId: string;
    actionType: ActionType;
    parameters: Record<string, any>;
    order: number;
    stopProcessing: boolean;
    metadata: Record<string, any>;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
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
export declare function defineRuleActionModel(sequelize: Sequelize): ModelStatic<RuleActionModel>;
/**
 * RuleExecutionLog Sequelize model interface
 */
export interface RuleExecutionLogModel extends Model<InferAttributes<RuleExecutionLogModel>, InferCreationAttributes<RuleExecutionLogModel>> {
    id: CreationOptional<string>;
    ruleId: string;
    messageId: string;
    status: RuleExecutionStatus;
    conditionsMatched: boolean;
    actionsExecuted: number;
    actionsFailed: number;
    executionTimeMs: number;
    error: string | null;
    metadata: Record<string, any>;
    createdAt: CreationOptional<Date>;
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
export declare function defineRuleExecutionLogModel(sequelize: Sequelize): ModelStatic<RuleExecutionLogModel>;
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
export declare function createMailRule(ruleData: Partial<MailRule>, transaction?: Transaction): Promise<MailRule>;
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
export declare function updateMailRule(ruleId: string, updates: Partial<MailRule>, transaction?: Transaction): Promise<MailRule>;
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
export declare function deleteMailRule(ruleId: string, hardDelete?: boolean, transaction?: Transaction): Promise<void>;
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
export declare function getMailRuleById(ruleId: string, includeConditionsAndActions?: boolean): Promise<MailRule>;
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
export declare function getUserMailRules(userId: string, enabledOnly?: boolean): Promise<MailRule[]>;
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
export declare function enableMailRule(ruleId: string, transaction?: Transaction): Promise<void>;
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
export declare function disableMailRule(ruleId: string, transaction?: Transaction): Promise<void>;
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
export declare function updateRulePriority(ruleId: string, newPriority: number, transaction?: Transaction): Promise<void>;
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
export declare function evaluateCondition(condition: RuleCondition, message: MessageContext): Promise<boolean>;
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
export declare function evaluateFromCondition(condition: RuleCondition, message: MessageContext): Promise<boolean>;
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
export declare function evaluateRecipientCondition(condition: RuleCondition, message: MessageContext): Promise<boolean>;
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
export declare function evaluateSubjectCondition(condition: RuleCondition, message: MessageContext): Promise<boolean>;
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
export declare function evaluateBodyCondition(condition: RuleCondition, message: MessageContext): Promise<boolean>;
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
export declare function evaluateAttachmentCondition(condition: RuleCondition, message: MessageContext): Promise<boolean>;
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
export declare function evaluateSizeCondition(condition: RuleCondition, message: MessageContext): Promise<boolean>;
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
export declare function evaluateDateCondition(condition: RuleCondition, message: MessageContext): Promise<boolean>;
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
export declare function evaluateImportanceCondition(condition: RuleCondition, message: MessageContext): Promise<boolean>;
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
export declare function evaluateAllConditions(rule: MailRule, message: MessageContext): Promise<boolean>;
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
export declare function executeAction(action: RuleAction, message: MessageContext, transaction?: Transaction): Promise<void>;
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
export declare function executeMoveAction(action: RuleAction, message: MessageContext, transaction?: Transaction): Promise<void>;
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
export declare function executeCopyAction(action: RuleAction, message: MessageContext, transaction?: Transaction): Promise<void>;
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
export declare function executeDeleteAction(action: RuleAction, message: MessageContext, transaction?: Transaction): Promise<void>;
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
export declare function executeForwardAction(action: RuleAction, message: MessageContext, transaction?: Transaction): Promise<void>;
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
export declare function executeFlagAction(action: RuleAction, message: MessageContext, transaction?: Transaction): Promise<void>;
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
export declare function executeCategorizeAction(action: RuleAction, message: MessageContext, transaction?: Transaction): Promise<void>;
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
export declare function executeMarkReadAction(action: RuleAction, message: MessageContext, transaction?: Transaction): Promise<void>;
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
export declare function executeAllActions(rule: MailRule, message: MessageContext, transaction?: Transaction): Promise<{
    executed: number;
    failed: number;
}>;
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
export declare function executeRulesForMessage(userId: string, message: MessageContext, scope: RuleScope, transaction?: Transaction): Promise<RuleExecutionResult[]>;
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
export declare function logRuleExecution(result: RuleExecutionResult, messageId: string, transaction?: Transaction): Promise<void>;
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
export declare function validateMailRule(rule: Partial<MailRule>): Promise<RuleValidationResult>;
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
export declare function validateCondition(condition: Partial<RuleCondition>): RuleValidationResult;
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
export declare function validateAction(action: Partial<RuleAction>): RuleValidationResult;
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
export declare function testRuleAgainstMessage(rule: MailRule, message: MessageContext): Promise<RuleTestResult>;
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
export declare function bulkEnableRules(ruleIds: string[], transaction?: Transaction): Promise<BulkRuleOperationResult>;
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
export declare function bulkDisableRules(ruleIds: string[], transaction?: Transaction): Promise<BulkRuleOperationResult>;
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
export declare function bulkDeleteRules(ruleIds: string[], hardDelete?: boolean, transaction?: Transaction): Promise<BulkRuleOperationResult>;
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
export declare function bulkReorderRules(ruleOrders: Array<{
    ruleId: string;
    priority: number;
}>, transaction?: Transaction): Promise<BulkRuleOperationResult>;
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
export declare function createRuleService(userId: string, ruleData: Partial<MailRule>): Promise<MailRule>;
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
export declare function getUserRulesService(userId: string): Promise<MailRule[]>;
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
export declare function processMessageRulesService(userId: string, message: MessageContext): Promise<RuleExecutionResult[]>;
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
export declare function getMailRuleResponse(): object;
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
export declare function getRuleConditionSchema(): object;
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
export declare function getRuleActionSchema(): object;
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
export declare function getCreateRuleOperation(): object;
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
export declare function getExecuteRulesOperation(): object;
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
export declare function getTestRuleOperation(): object;
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
export declare function compareString(value: string, compareValue: string, operator: ConditionOperator, caseSensitive: boolean): boolean;
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
export declare function compareNumber(value: number, compareValue: number, operator: ConditionOperator): boolean;
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
export declare function generateUUID(): string;
//# sourceMappingURL=mail-rules-filters-kit.d.ts.map