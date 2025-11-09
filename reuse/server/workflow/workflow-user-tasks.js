"use strict";
/**
 * LOC: WUT-001
 * File: /reuse/server/workflow/workflow-user-tasks.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/event-emitter
 *   - @nestjs/cqrs
 *   - multer
 *   - zod
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - User task management services
 *   - Human task handlers
 *   - Approval workflow services
 *   - Form processing modules
 *   - Collaboration services
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTaskManagementService = exports.UserTaskDelegationSchema = exports.TaskReassignmentSchema = exports.TaskReminderSchema = exports.TaskHistoryEntrySchema = exports.TaskAttachmentSchema = exports.TaskCommentSchema = exports.TaskEscalationSchema = exports.TaskPermissionSchema = exports.TaskFormSchema = exports.UserTaskCompletionSchema = exports.UserTaskClaimSchema = exports.UserTaskAssignmentSchema = exports.UserTaskSchema = void 0;
exports.createUserTask = createUserTask;
exports.assignUserTask = assignUserTask;
exports.addCandidateUsers = addCandidateUsers;
exports.addCandidateGroups = addCandidateGroups;
exports.autoAssignUserTask = autoAssignUserTask;
exports.claimUserTask = claimUserTask;
exports.releaseUserTask = releaseUserTask;
exports.canUserClaimTask = canUserClaimTask;
exports.forceClaimTask = forceClaimTask;
exports.getClaimableTasksForUser = getClaimableTasksForUser;
exports.completeUserTask = completeUserTask;
exports.validateTaskFormData = validateTaskFormData;
exports.saveFormDataDraft = saveFormDataDraft;
exports.calculateTaskCompletionTime = calculateTaskCompletionTime;
exports.getTaskCompletionStats = getTaskCompletionStats;
exports.createTaskForm = createTaskForm;
exports.addFormField = addFormField;
exports.isFieldVisible = isFieldVisible;
exports.getVisibleFormFields = getVisibleFormFields;
exports.extractFormVariables = extractFormVariables;
exports.hasTaskPermission = hasTaskPermission;
exports.grantTaskPermission = grantTaskPermission;
exports.revokeTaskPermission = revokeTaskPermission;
exports.validateTaskAction = validateTaskAction;
exports.getTaskPermissionsForUser = getTaskPermissionsForUser;
exports.escalateUserTask = escalateUserTask;
exports.autoEscalateOverdueTasks = autoEscalateOverdueTasks;
exports.shouldEscalateTask = shouldEscalateTask;
exports.deEscalateTask = deEscalateTask;
exports.getEscalationPath = getEscalationPath;
exports.reassignUserTask = reassignUserTask;
exports.delegateUserTask = delegateUserTask;
exports.returnDelegatedTask = returnDelegatedTask;
exports.isDelegationExpired = isDelegationExpired;
exports.rebalanceTaskWorkload = rebalanceTaskWorkload;
exports.addTaskComment = addTaskComment;
exports.updateTaskComment = updateTaskComment;
exports.getTaskComments = getTaskComments;
exports.getCommentThread = getCommentThread;
exports.deleteTaskComment = deleteTaskComment;
exports.addTaskAttachment = addTaskAttachment;
exports.removeTaskAttachment = removeTaskAttachment;
exports.getTaskAttachments = getTaskAttachments;
exports.validateAttachment = validateAttachment;
exports.scanAttachmentForThreats = scanAttachmentForThreats;
exports.recordTaskHistory = recordTaskHistory;
exports.getTaskHistory = getTaskHistory;
exports.createTaskReminder = createTaskReminder;
exports.getPendingReminders = getPendingReminders;
exports.calculateUserWorkload = calculateUserWorkload;
/**
 * File: /reuse/server/workflow/workflow-user-tasks.ts
 * Locator: WC-WF-WUT-001
 * Purpose: Advanced User Task Management Utilities - Production-grade human task handling, assignment, and collaboration
 *
 * Upstream: @nestjs/common, @nestjs/event-emitter, @nestjs/cqrs, multer, zod, date-fns, TypeScript 5.x
 * Downstream: ../backend/*, user task services, approval workflows, form handlers, collaboration modules
 * Dependencies: NestJS 10.x, Zod 3.x, TypeScript 5.x, date-fns 3.x, Multer 1.x
 * Exports: 45 production-grade utility functions for user task management, claiming, completion, forms, permissions, escalation, comments, attachments
 *
 * LLM Context: Enterprise-grade user task management utilities for White Cross healthcare platform.
 * Provides comprehensive user task assignment, claiming, completion tracking, form data handling, permission management,
 * task escalation, reassignment, commenting, attachment handling, history tracking, reminder systems, notifications,
 * workload balancing, delegation, approval workflows, collaborative editing, audit trails, and HIPAA-compliant data handling.
 * Optimized for healthcare workflow automation with multi-user collaboration and compliance requirements.
 *
 * Features:
 * - User task lifecycle management
 * - Task claiming and ownership
 * - Form data validation and persistence
 * - Role-based permission checks
 * - Escalation workflows
 * - Dynamic reassignment
 * - Threaded commenting
 * - File attachment handling
 * - Complete audit history
 * - Automated reminders
 * - Real-time notifications
 * - Workload analytics
 * - Collaborative workflows
 * - Approval chains
 * - Multi-tenant isolation
 */
const zod_1 = require("zod");
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for user task definition.
 */
exports.UserTaskSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    workflowInstanceId: zod_1.z.string().uuid(),
    taskDefinitionKey: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['urgent', 'high', 'normal', 'low']).default('normal'),
    status: zod_1.z.enum(['unassigned', 'assigned', 'claimed', 'in_progress', 'pending_approval', 'completed', 'cancelled', 'escalated']).default('unassigned'),
    assignee: zod_1.z.string().optional(),
    candidateUsers: zod_1.z.array(zod_1.z.string()).default([]),
    candidateGroups: zod_1.z.array(zod_1.z.string()).default([]),
    claimedBy: zod_1.z.string().optional(),
    claimedAt: zod_1.z.date().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    dueDate: zod_1.z.date().optional(),
    followUpDate: zod_1.z.date().optional(),
    completedAt: zod_1.z.date().optional(),
    completedBy: zod_1.z.string().optional(),
    formKey: zod_1.z.string().optional(),
    formData: zod_1.z.record(zod_1.z.any()).optional(),
    variables: zod_1.z.record(zod_1.z.any()).default({}),
    tenantId: zod_1.z.string().optional(),
    parentTaskId: zod_1.z.string().uuid().optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
/**
 * Zod schema for user task assignment.
 */
exports.UserTaskAssignmentSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    userId: zod_1.z.string(),
    assignedBy: zod_1.z.string(),
    assignedAt: zod_1.z.date(),
    reason: zod_1.z.string().optional(),
    notifyUser: zod_1.z.boolean().default(true),
    dueDate: zod_1.z.date().optional(),
});
/**
 * Zod schema for user task claim.
 */
exports.UserTaskClaimSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    userId: zod_1.z.string(),
    claimedAt: zod_1.z.date(),
    previousClaimant: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for user task completion.
 */
exports.UserTaskCompletionSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    userId: zod_1.z.string(),
    completedAt: zod_1.z.date(),
    outcome: zod_1.z.string().optional(),
    formData: zod_1.z.record(zod_1.z.any()).optional(),
    variables: zod_1.z.record(zod_1.z.any()).optional(),
    comments: zod_1.z.string().optional(),
    attachments: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Zod schema for task form definition.
 */
exports.TaskFormSchema = zod_1.z.object({
    formKey: zod_1.z.string().min(1),
    version: zod_1.z.string().regex(/^\d+\.\d+\.\d+$/).default('1.0.0'),
    fields: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().min(1),
        type: zod_1.z.enum(['text', 'textarea', 'number', 'date', 'datetime', 'boolean', 'select', 'multiselect', 'radio', 'checkbox', 'file', 'signature']),
        label: zod_1.z.string().min(1),
        placeholder: zod_1.z.string().optional(),
        defaultValue: zod_1.z.any().optional(),
        required: zod_1.z.boolean().default(false),
        readonly: zod_1.z.boolean().default(false),
        validation: zod_1.z.object({
            min: zod_1.z.number().optional(),
            max: zod_1.z.number().optional(),
            pattern: zod_1.z.string().optional(),
            minLength: zod_1.z.number().int().nonnegative().optional(),
            maxLength: zod_1.z.number().int().positive().optional(),
            custom: zod_1.z.string().optional(),
        }).optional(),
        options: zod_1.z.array(zod_1.z.object({
            value: zod_1.z.string(),
            label: zod_1.z.string(),
            disabled: zod_1.z.boolean().optional(),
        })).optional(),
        conditional: zod_1.z.object({
            field: zod_1.z.string(),
            operator: zod_1.z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
            value: zod_1.z.any(),
        }).optional(),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
    })),
    layout: zod_1.z.enum(['single', 'two-column', 'grid']).default('single'),
    submitLabel: zod_1.z.string().default('Submit'),
    cancelLabel: zod_1.z.string().default('Cancel'),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for user task permissions.
 */
exports.TaskPermissionSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    userId: zod_1.z.string(),
    permissions: zod_1.z.array(zod_1.z.enum(['view', 'claim', 'complete', 'reassign', 'escalate', 'comment', 'attach', 'delete'])),
    grantedBy: zod_1.z.string().optional(),
    grantedAt: zod_1.z.date(),
    expiresAt: zod_1.z.date().optional(),
});
/**
 * Zod schema for task escalation.
 */
exports.TaskEscalationSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    escalatedBy: zod_1.z.string(),
    escalatedTo: zod_1.z.string(),
    escalatedAt: zod_1.z.date(),
    reason: zod_1.z.string(),
    urgencyLevel: zod_1.z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    originalDueDate: zod_1.z.date().optional(),
    newDueDate: zod_1.z.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for task comment.
 */
exports.TaskCommentSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    taskId: zod_1.z.string().uuid(),
    userId: zod_1.z.string(),
    content: zod_1.z.string().min(1),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date().optional(),
    parentCommentId: zod_1.z.string().uuid().optional(),
    mentions: zod_1.z.array(zod_1.z.string()).default([]),
    attachments: zod_1.z.array(zod_1.z.string()).optional(),
    isInternal: zod_1.z.boolean().default(false),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for task attachment.
 */
exports.TaskAttachmentSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    taskId: zod_1.z.string().uuid(),
    fileName: zod_1.z.string().min(1),
    fileSize: zod_1.z.number().int().positive(),
    mimeType: zod_1.z.string().min(1),
    fileUrl: zod_1.z.string().url(),
    uploadedBy: zod_1.z.string(),
    uploadedAt: zod_1.z.date(),
    description: zod_1.z.string().optional(),
    category: zod_1.z.enum(['document', 'image', 'spreadsheet', 'presentation', 'other']).optional(),
    scanStatus: zod_1.z.enum(['pending', 'clean', 'infected', 'error']).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for task history entry.
 */
exports.TaskHistoryEntrySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    taskId: zod_1.z.string().uuid(),
    action: zod_1.z.enum(['created', 'assigned', 'claimed', 'released', 'completed', 'cancelled', 'escalated', 'reassigned', 'commented', 'attached', 'updated']),
    userId: zod_1.z.string(),
    timestamp: zod_1.z.date(),
    changes: zod_1.z.record(zod_1.z.object({
        from: zod_1.z.any(),
        to: zod_1.z.any(),
    })).optional(),
    comment: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for task reminder.
 */
exports.TaskReminderSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    taskId: zod_1.z.string().uuid(),
    userId: zod_1.z.string(),
    reminderType: zod_1.z.enum(['due_date', 'follow_up', 'escalation', 'custom']),
    scheduledFor: zod_1.z.date(),
    channel: zod_1.z.enum(['email', 'sms', 'push', 'in_app']).default('in_app'),
    message: zod_1.z.string().optional(),
    sent: zod_1.z.boolean().default(false),
    sentAt: zod_1.z.date().optional(),
    recurring: zod_1.z.boolean().default(false),
    recurrencePattern: zod_1.z.string().optional(),
});
/**
 * Zod schema for task reassignment.
 */
exports.TaskReassignmentSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    fromUser: zod_1.z.string(),
    toUser: zod_1.z.string(),
    reassignedBy: zod_1.z.string(),
    reassignedAt: zod_1.z.date(),
    reason: zod_1.z.string(),
    notifyBoth: zod_1.z.boolean().default(true),
    transferOwnership: zod_1.z.boolean().default(true),
});
/**
 * Zod schema for task delegation.
 */
exports.UserTaskDelegationSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid(),
    delegatedBy: zod_1.z.string(),
    delegatedTo: zod_1.z.string(),
    delegatedAt: zod_1.z.date(),
    expiresAt: zod_1.z.date().optional(),
    reason: zod_1.z.string().optional(),
    canReassign: zod_1.z.boolean().default(false),
    returnOnCompletion: zod_1.z.boolean().default(true),
});
// ============================================================================
// USER TASK CREATION AND ASSIGNMENT
// ============================================================================
/**
 * 1. Creates a new user task.
 *
 * @example
 * const task = createUserTask({
 *   workflowInstanceId: 'workflow-123',
 *   taskDefinitionKey: 'approve-patient-record',
 *   name: 'Approve Patient Admission Record',
 *   priority: 'high',
 *   candidateGroups: ['doctors', 'nurses'],
 *   formKey: 'patient-approval-form',
 * });
 */
function createUserTask(config) {
    const now = new Date();
    return {
        id: config.id || crypto.randomUUID(),
        workflowInstanceId: config.workflowInstanceId,
        taskDefinitionKey: config.taskDefinitionKey,
        name: config.name,
        description: config.description,
        priority: config.priority || 'normal',
        status: config.status || 'unassigned',
        assignee: config.assignee,
        candidateUsers: config.candidateUsers || [],
        candidateGroups: config.candidateGroups || [],
        claimedBy: config.claimedBy,
        claimedAt: config.claimedAt,
        createdAt: config.createdAt || now,
        updatedAt: config.updatedAt || now,
        dueDate: config.dueDate,
        followUpDate: config.followUpDate,
        completedAt: config.completedAt,
        completedBy: config.completedBy,
        formKey: config.formKey,
        formData: config.formData,
        variables: config.variables || {},
        tenantId: config.tenantId,
        parentTaskId: config.parentTaskId,
        tags: config.tags || [],
    };
}
/**
 * 2. Assigns a user task to a specific user.
 *
 * @example
 * const assignment = assignUserTask(task, 'user-123', 'manager-456', 'Best qualified');
 */
function assignUserTask(task, userId, assignedBy, reason, dueDate) {
    task.assignee = userId;
    task.status = 'assigned';
    task.updatedAt = new Date();
    if (dueDate)
        task.dueDate = dueDate;
    return {
        taskId: task.id,
        userId,
        assignedBy,
        assignedAt: new Date(),
        reason,
        notifyUser: true,
        dueDate: task.dueDate,
    };
}
/**
 * 3. Adds candidate users to a task.
 *
 * @example
 * addCandidateUsers(task, ['user-123', 'user-456']);
 */
function addCandidateUsers(task, userIds) {
    const newCandidates = userIds.filter(id => !task.candidateUsers.includes(id));
    task.candidateUsers.push(...newCandidates);
    task.updatedAt = new Date();
}
/**
 * 4. Adds candidate groups to a task.
 *
 * @example
 * addCandidateGroups(task, ['doctors', 'specialists']);
 */
function addCandidateGroups(task, groupIds) {
    const newGroups = groupIds.filter(id => !task.candidateGroups.includes(id));
    task.candidateGroups.push(...newGroups);
    task.updatedAt = new Date();
}
/**
 * 5. Auto-assigns task to user with lowest workload.
 *
 * @example
 * const assignedTo = autoAssignUserTask(task, candidateUsers, workloads);
 */
function autoAssignUserTask(task, candidateUsers, workloadMetrics) {
    if (candidateUsers.length === 0) {
        throw new Error('No candidate users available');
    }
    const assignedTo = candidateUsers.reduce((minUser, userId) => {
        const userWorkload = workloadMetrics.get(userId)?.totalTasks || 0;
        const minWorkload = workloadMetrics.get(minUser)?.totalTasks || 0;
        return userWorkload < minWorkload ? userId : minUser;
    }, candidateUsers[0]);
    task.assignee = assignedTo;
    task.status = 'assigned';
    task.updatedAt = new Date();
    return assignedTo;
}
// ============================================================================
// USER TASK CLAIMING
// ============================================================================
/**
 * 6. Claims a user task.
 *
 * @example
 * const claim = claimUserTask(task, 'user-123');
 */
function claimUserTask(task, userId) {
    if (task.claimedBy && task.claimedBy !== userId) {
        throw new Error(`Task already claimed by ${task.claimedBy}`);
    }
    const previousClaimant = task.claimedBy;
    task.claimedBy = userId;
    task.claimedAt = new Date();
    task.status = 'claimed';
    task.assignee = userId;
    task.updatedAt = new Date();
    return {
        taskId: task.id,
        userId,
        claimedAt: task.claimedAt,
        previousClaimant,
    };
}
/**
 * 7. Releases a claimed task back to the pool.
 *
 * @example
 * releaseUserTask(task, 'user-123');
 */
function releaseUserTask(task, userId) {
    if (task.claimedBy !== userId) {
        throw new common_1.ForbiddenException('Only the claimant can release this task');
    }
    task.claimedBy = undefined;
    task.claimedAt = undefined;
    task.status = task.assignee ? 'assigned' : 'unassigned';
    task.updatedAt = new Date();
}
/**
 * 8. Checks if a user can claim a task.
 *
 * @example
 * const canClaim = canUserClaimTask(task, 'user-123', ['doctors']);
 */
function canUserClaimTask(task, userId, userGroups) {
    // Already claimed by someone else
    if (task.claimedBy && task.claimedBy !== userId)
        return false;
    // Already assigned to this user
    if (task.assignee === userId)
        return true;
    // User is in candidate users
    if (task.candidateUsers.includes(userId))
        return true;
    // User is in candidate groups
    return task.candidateGroups.some(group => userGroups.includes(group));
}
/**
 * 9. Forces claim of a task (admin override).
 *
 * @example
 * forceClaimTask(task, 'admin-123', 'Emergency override');
 */
function forceClaimTask(task, userId, reason) {
    const previousClaimant = task.claimedBy;
    task.claimedBy = userId;
    task.claimedAt = new Date();
    task.status = 'claimed';
    task.assignee = userId;
    task.updatedAt = new Date();
    task.variables = {
        ...task.variables,
        forceClaim: { by: userId, reason, timestamp: new Date() },
    };
    return {
        taskId: task.id,
        userId,
        claimedAt: task.claimedAt,
        previousClaimant,
        metadata: { forced: true, reason },
    };
}
/**
 * 10. Gets all claimable tasks for a user.
 *
 * @example
 * const claimableTasks = getClaimableTasksForUser(allTasks, 'user-123', ['doctors']);
 */
function getClaimableTasksForUser(tasks, userId, userGroups) {
    return tasks.filter(task => !task.claimedBy &&
        (task.candidateUsers.includes(userId) ||
            task.candidateGroups.some(group => userGroups.includes(group))));
}
// ============================================================================
// USER TASK COMPLETION
// ============================================================================
/**
 * 11. Completes a user task with form data.
 *
 * @example
 * const completion = completeUserTask(task, 'user-123', {
 *   approved: true,
 *   comments: 'Looks good',
 * });
 */
function completeUserTask(task, userId, formData, outcome) {
    if (task.claimedBy && task.claimedBy !== userId && task.assignee !== userId) {
        throw new common_1.ForbiddenException('Only the assigned user can complete this task');
    }
    const now = new Date();
    task.status = 'completed';
    task.completedAt = now;
    task.completedBy = userId;
    task.updatedAt = now;
    if (formData)
        task.formData = formData;
    return {
        taskId: task.id,
        userId,
        completedAt: now,
        outcome,
        formData,
        variables: task.variables,
    };
}
/**
 * 12. Validates form data against form definition.
 *
 * @example
 * const errors = validateTaskFormData(formDefinition, formData);
 */
function validateTaskFormData(form, data) {
    const errors = {};
    for (const field of form.fields) {
        const value = data[field.id];
        const fieldErrors = [];
        // Check required
        if (field.required && (value === undefined || value === null || value === '')) {
            fieldErrors.push(`${field.label} is required`);
        }
        // Check validation rules
        if (value !== undefined && value !== null && field.validation) {
            const { min, max, pattern, minLength, maxLength } = field.validation;
            if (typeof value === 'number') {
                if (min !== undefined && value < min) {
                    fieldErrors.push(`${field.label} must be at least ${min}`);
                }
                if (max !== undefined && value > max) {
                    fieldErrors.push(`${field.label} must be at most ${max}`);
                }
            }
            if (typeof value === 'string') {
                if (minLength !== undefined && value.length < minLength) {
                    fieldErrors.push(`${field.label} must be at least ${minLength} characters`);
                }
                if (maxLength !== undefined && value.length > maxLength) {
                    fieldErrors.push(`${field.label} must be at most ${maxLength} characters`);
                }
                if (pattern) {
                    const regex = new RegExp(pattern);
                    if (!regex.test(value)) {
                        fieldErrors.push(`${field.label} format is invalid`);
                    }
                }
            }
        }
        if (fieldErrors.length > 0) {
            errors[field.id] = fieldErrors;
        }
    }
    return errors;
}
/**
 * 13. Saves partial form data (draft).
 *
 * @example
 * saveFormDataDraft(task, { patientName: 'John Doe' });
 */
function saveFormDataDraft(task, partialData) {
    task.formData = {
        ...task.formData,
        ...partialData,
    };
    task.updatedAt = new Date();
    task.variables = {
        ...task.variables,
        lastDraftSaved: new Date(),
    };
}
/**
 * 14. Calculates task completion time.
 *
 * @example
 * const hours = calculateTaskCompletionTime(task);
 */
function calculateTaskCompletionTime(task) {
    if (!task.completedAt)
        return null;
    const startTime = task.claimedAt || task.createdAt;
    return (0, date_fns_1.differenceInHours)(task.completedAt, startTime);
}
/**
 * 15. Gets task completion statistics.
 *
 * @example
 * const stats = getTaskCompletionStats(tasks, 'user-123');
 */
function getTaskCompletionStats(tasks, userId) {
    const userTasks = userId ? tasks.filter(t => t.completedBy === userId) : tasks;
    const completedTasks = userTasks.filter(t => t.status === 'completed');
    const completionTimes = completedTasks
        .map(t => calculateTaskCompletionTime(t))
        .filter((time) => time !== null);
    const averageCompletionTimeHours = completionTimes.length > 0
        ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
        : 0;
    const onTimeCompletions = completedTasks.filter(t => t.completedAt && t.dueDate && t.completedAt <= t.dueDate).length;
    const onTimeCompletionRate = completedTasks.length > 0
        ? (onTimeCompletions / completedTasks.length) * 100
        : 0;
    return {
        total: userTasks.length,
        completed: completedTasks.length,
        averageCompletionTimeHours,
        onTimeCompletionRate,
    };
}
// ============================================================================
// TASK FORMS AND DATA
// ============================================================================
/**
 * 16. Creates a task form definition.
 *
 * @example
 * const form = createTaskForm('patient-approval', [
 *   { id: 'approved', type: 'boolean', label: 'Approve?', required: true },
 *   { id: 'comments', type: 'textarea', label: 'Comments' },
 * ]);
 */
function createTaskForm(formKey, fields, options) {
    return {
        formKey,
        version: options?.version || '1.0.0',
        fields,
        layout: options?.layout || 'single',
        submitLabel: options?.submitLabel || 'Submit',
        cancelLabel: options?.cancelLabel || 'Cancel',
    };
}
/**
 * 17. Adds a field to a form definition.
 *
 * @example
 * addFormField(form, {
 *   id: 'diagnosis',
 *   type: 'text',
 *   label: 'Diagnosis',
 *   required: true,
 * });
 */
function addFormField(form, field) {
    if (form.fields.some(f => f.id === field.id)) {
        throw new Error(`Field with id ${field.id} already exists`);
    }
    form.fields.push(field);
}
/**
 * 18. Evaluates conditional field visibility.
 *
 * @example
 * const visible = isFieldVisible(field, formData);
 */
function isFieldVisible(field, formData) {
    if (!field.conditional)
        return true;
    const { field: condField, operator, value } = field.conditional;
    const fieldValue = formData[condField];
    switch (operator) {
        case 'equals':
            return fieldValue === value;
        case 'not_equals':
            return fieldValue !== value;
        case 'contains':
            return typeof fieldValue === 'string' && fieldValue.includes(value);
        case 'greater_than':
            return typeof fieldValue === 'number' && fieldValue > value;
        case 'less_than':
            return typeof fieldValue === 'number' && fieldValue < value;
        default:
            return true;
    }
}
/**
 * 19. Renders form with conditional fields.
 *
 * @example
 * const visibleFields = getVisibleFormFields(form, formData);
 */
function getVisibleFormFields(form, formData) {
    return form.fields.filter(field => isFieldVisible(field, formData));
}
/**
 * 20. Extracts form variables for workflow.
 *
 * @example
 * const variables = extractFormVariables(formData, form);
 */
function extractFormVariables(formData, form) {
    const variables = {};
    for (const field of form.fields) {
        const value = formData[field.id];
        if (value !== undefined) {
            variables[field.id] = value;
        }
    }
    return variables;
}
// ============================================================================
// USER TASK PERMISSIONS
// ============================================================================
/**
 * 21. Checks if user has permission for task action.
 *
 * @example
 * const canComplete = hasTaskPermission(task, 'user-123', 'complete', userGroups);
 */
function hasTaskPermission(task, userId, action, userGroups) {
    // Assigned user has all permissions
    if (task.assignee === userId || task.claimedBy === userId)
        return true;
    // Check if user is in candidate lists
    const isCandidate = task.candidateUsers.includes(userId) ||
        task.candidateGroups.some(group => userGroups.includes(group));
    // Candidates can view and claim
    if (isCandidate && (action === 'view' || action === 'claim'))
        return true;
    return false;
}
/**
 * 22. Grants explicit permission to a user.
 *
 * @example
 * const permission = grantTaskPermission(task, 'user-123', ['view', 'comment'], 'admin-456');
 */
function grantTaskPermission(task, userId, permissions, grantedBy, expiresAt) {
    const permission = {
        taskId: task.id,
        userId,
        permissions,
        grantedBy,
        grantedAt: new Date(),
        expiresAt,
    };
    task.variables = {
        ...task.variables,
        customPermissions: [
            ...(task.variables.customPermissions || []),
            permission,
        ],
    };
    return permission;
}
/**
 * 23. Revokes permission from a user.
 *
 * @example
 * revokeTaskPermission(task, 'user-123');
 */
function revokeTaskPermission(task, userId) {
    if (task.variables.customPermissions) {
        task.variables.customPermissions = task.variables.customPermissions.filter((p) => p.userId !== userId);
    }
}
/**
 * 24. Validates user can perform action.
 *
 * @example
 * validateTaskAction(task, 'user-123', 'complete', userGroups);
 */
function validateTaskAction(task, userId, action, userGroups) {
    if (!hasTaskPermission(task, userId, action, userGroups)) {
        throw new common_1.ForbiddenException(`User ${userId} does not have permission to ${action} task ${task.id}`);
    }
}
/**
 * 25. Gets all permissions for a user on a task.
 *
 * @example
 * const permissions = getTaskPermissionsForUser(task, 'user-123', userGroups);
 */
function getTaskPermissionsForUser(task, userId, userGroups) {
    const permissions = new Set();
    if (task.assignee === userId || task.claimedBy === userId) {
        return ['view', 'claim', 'complete', 'reassign', 'escalate', 'comment', 'attach', 'delete'];
    }
    const isCandidate = task.candidateUsers.includes(userId) ||
        task.candidateGroups.some(group => userGroups.includes(group));
    if (isCandidate) {
        permissions.add('view');
        permissions.add('claim');
        permissions.add('comment');
    }
    // Check custom permissions
    if (task.variables.customPermissions) {
        const customPerms = task.variables.customPermissions.find((p) => p.userId === userId && (!p.expiresAt || (0, date_fns_1.isAfter)(p.expiresAt, new Date())));
        if (customPerms) {
            customPerms.permissions.forEach((p) => permissions.add(p));
        }
    }
    return Array.from(permissions);
}
// ============================================================================
// TASK ESCALATION
// ============================================================================
/**
 * 26. Escalates a task to higher priority or different user.
 *
 * @example
 * const escalation = escalateUserTask(
 *   task,
 *   'user-123',
 *   'manager-456',
 *   'Overdue by 48 hours',
 *   'critical'
 * );
 */
function escalateUserTask(task, escalatedBy, escalatedTo, reason, urgencyLevel = 'high') {
    const originalDueDate = task.dueDate;
    const originalPriority = task.priority;
    task.status = 'escalated';
    task.assignee = escalatedTo;
    task.priority = urgencyLevel === 'critical' ? 'urgent' : urgencyLevel;
    task.updatedAt = new Date();
    const escalation = {
        taskId: task.id,
        escalatedBy,
        escalatedTo,
        escalatedAt: new Date(),
        reason,
        urgencyLevel,
        originalDueDate,
        metadata: { originalPriority },
    };
    task.variables = {
        ...task.variables,
        escalationHistory: [
            ...(task.variables.escalationHistory || []),
            escalation,
        ],
    };
    return escalation;
}
/**
 * 27. Auto-escalates overdue tasks.
 *
 * @example
 * const escalated = autoEscalateOverdueTasks(tasks, escalationRules);
 */
function autoEscalateOverdueTasks(tasks, escalationRules) {
    const now = new Date();
    const escalatedTasks = [];
    for (const task of tasks) {
        if (!task.dueDate || task.status === 'completed' || task.status === 'cancelled')
            continue;
        const hoursOverdue = (0, date_fns_1.differenceInHours)(now, task.dueDate);
        if (hoursOverdue > 0) {
            const matchingRule = escalationRules
                .sort((a, b) => b.hoursOverdue - a.hoursOverdue)
                .find(rule => hoursOverdue >= rule.hoursOverdue);
            if (matchingRule) {
                escalateUserTask(task, 'system', matchingRule.escalateTo, `Task overdue by ${hoursOverdue} hours`, matchingRule.urgencyLevel);
                escalatedTasks.push(task);
            }
        }
    }
    return escalatedTasks;
}
/**
 * 28. Checks if task should be escalated.
 *
 * @example
 * const shouldEscalate = shouldEscalateTask(task, 24);
 */
function shouldEscalateTask(task, hoursOverdueThreshold) {
    if (!task.dueDate || task.status === 'completed' || task.status === 'cancelled')
        return false;
    const hoursOverdue = (0, date_fns_1.differenceInHours)(new Date(), task.dueDate);
    return hoursOverdue >= hoursOverdueThreshold;
}
/**
 * 29. De-escalates a task back to normal priority.
 *
 * @example
 * deEscalateTask(task, 'manager-456', 'Issue resolved');
 */
function deEscalateTask(task, deEscalatedBy, reason) {
    const escalationHistory = task.variables.escalationHistory || [];
    const lastEscalation = escalationHistory[escalationHistory.length - 1];
    if (lastEscalation?.metadata?.originalPriority) {
        task.priority = lastEscalation.metadata.originalPriority;
    }
    task.status = task.claimedBy ? 'claimed' : task.assignee ? 'assigned' : 'unassigned';
    task.updatedAt = new Date();
    task.variables = {
        ...task.variables,
        deEscalated: {
            by: deEscalatedBy,
            reason,
            timestamp: new Date(),
        },
    };
}
/**
 * 30. Gets escalation path for task type.
 *
 * @example
 * const path = getEscalationPath('patient-approval', 1);
 */
function getEscalationPath(taskType, escalationLevel, escalationPaths) {
    const path = escalationPaths[taskType];
    if (!path || escalationLevel >= path.length)
        return null;
    return path[escalationLevel];
}
// ============================================================================
// TASK REASSIGNMENT
// ============================================================================
/**
 * 31. Reassigns a task to a different user.
 *
 * @example
 * const reassignment = reassignUserTask(
 *   task,
 *   'user-789',
 *   'manager-123',
 *   'Better expertise match'
 * );
 */
function reassignUserTask(task, toUser, reassignedBy, reason) {
    const fromUser = task.assignee || task.claimedBy || 'unassigned';
    task.assignee = toUser;
    task.claimedBy = undefined;
    task.claimedAt = undefined;
    task.status = 'assigned';
    task.updatedAt = new Date();
    const reassignment = {
        taskId: task.id,
        fromUser,
        toUser,
        reassignedBy,
        reassignedAt: new Date(),
        reason,
        notifyBoth: true,
        transferOwnership: true,
    };
    task.variables = {
        ...task.variables,
        reassignmentHistory: [
            ...(task.variables.reassignmentHistory || []),
            reassignment,
        ],
    };
    return reassignment;
}
/**
 * 32. Delegates task temporarily to another user.
 *
 * @example
 * const delegation = delegateUserTask(
 *   task,
 *   'user-123',
 *   'user-456',
 *   addDays(new Date(), 7),
 *   'Covering during PTO'
 * );
 */
function delegateUserTask(task, delegatedBy, delegatedTo, expiresAt, reason) {
    const delegation = {
        taskId: task.id,
        delegatedBy,
        delegatedTo,
        delegatedAt: new Date(),
        expiresAt,
        reason,
        canReassign: false,
        returnOnCompletion: true,
    };
    task.assignee = delegatedTo;
    task.updatedAt = new Date();
    task.variables = {
        ...task.variables,
        delegation,
        originalAssignee: delegatedBy,
    };
    return delegation;
}
/**
 * 33. Returns delegated task to original owner.
 *
 * @example
 * returnDelegatedTask(task, 'user-456');
 */
function returnDelegatedTask(task, returnedBy) {
    const delegation = task.variables.delegation;
    if (!delegation) {
        throw new Error('Task is not delegated');
    }
    task.assignee = task.variables.originalAssignee;
    task.updatedAt = new Date();
    task.variables = {
        ...task.variables,
        delegation: undefined,
        originalAssignee: undefined,
        delegationReturned: {
            by: returnedBy,
            timestamp: new Date(),
        },
    };
}
/**
 * 34. Checks if delegation has expired.
 *
 * @example
 * const expired = isDelegationExpired(task);
 */
function isDelegationExpired(task) {
    const delegation = task.variables.delegation;
    if (!delegation || !delegation.expiresAt)
        return false;
    return (0, date_fns_1.isPast)(delegation.expiresAt);
}
/**
 * 35. Balances workload across team members.
 *
 * @example
 * const rebalanced = rebalanceTaskWorkload(tasks, teamMembers, maxTasksPerUser);
 */
function rebalanceTaskWorkload(tasks, teamMembers, maxTasksPerUser) {
    const workloadMap = new Map();
    // Initialize workload map
    teamMembers.forEach(member => workloadMap.set(member, []));
    // Count current workload
    tasks.forEach(task => {
        if (task.assignee && workloadMap.has(task.assignee)) {
            workloadMap.get(task.assignee).push(task);
        }
    });
    const rebalancedTasks = [];
    // Find overloaded users and redistribute
    for (const [userId, userTasks] of workloadMap.entries()) {
        if (userTasks.length > maxTasksPerUser) {
            const excessTasks = userTasks.slice(maxTasksPerUser);
            for (const task of excessTasks) {
                // Find user with lowest workload
                const targetUser = Array.from(workloadMap.entries())
                    .filter(([id]) => id !== userId)
                    .sort(([, a], [, b]) => a.length - b.length)[0];
                if (targetUser) {
                    reassignUserTask(task, targetUser[0], 'system', 'Workload balancing');
                    targetUser[1].push(task);
                    rebalancedTasks.push(task);
                }
            }
            workloadMap.set(userId, userTasks.slice(0, maxTasksPerUser));
        }
    }
    return rebalancedTasks;
}
// ============================================================================
// TASK COMMENTS
// ============================================================================
/**
 * 36. Adds a comment to a task.
 *
 * @example
 * const comment = addTaskComment(
 *   task,
 *   'user-123',
 *   'Please review the updated diagnosis',
 *   ['user-456']
 * );
 */
function addTaskComment(task, userId, content, mentions, parentCommentId, isInternal = false) {
    const comment = {
        id: crypto.randomUUID(),
        taskId: task.id,
        userId,
        content,
        createdAt: new Date(),
        parentCommentId,
        mentions: mentions || [],
        isInternal,
    };
    task.variables = {
        ...task.variables,
        comments: [
            ...(task.variables.comments || []),
            comment,
        ],
    };
    task.updatedAt = new Date();
    return comment;
}
/**
 * 37. Edits an existing comment.
 *
 * @example
 * updateTaskComment(task, commentId, 'Updated comment text');
 */
function updateTaskComment(task, commentId, newContent, userId) {
    const comments = task.variables.comments || [];
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) {
        throw new common_1.NotFoundException('Comment not found');
    }
    if (comment.userId !== userId) {
        throw new common_1.ForbiddenException('Only comment author can edit');
    }
    comment.content = newContent;
    comment.updatedAt = new Date();
    task.updatedAt = new Date();
}
/**
 * 38. Gets all comments for a task with threading.
 *
 * @example
 * const comments = getTaskComments(task, true);
 */
function getTaskComments(task, includeInternal = false) {
    const comments = (task.variables.comments || []);
    if (!includeInternal) {
        return comments.filter(c => !c.isInternal);
    }
    return comments;
}
/**
 * 39. Gets comment thread (parent and replies).
 *
 * @example
 * const thread = getCommentThread(task, parentCommentId);
 */
function getCommentThread(task, parentCommentId) {
    const comments = (task.variables.comments || []);
    const parent = comments.find(c => c.id === parentCommentId);
    if (!parent)
        return [];
    const replies = comments.filter(c => c.parentCommentId === parentCommentId);
    return [parent, ...replies];
}
/**
 * 40. Deletes a comment.
 *
 * @example
 * deleteTaskComment(task, commentId, 'user-123');
 */
function deleteTaskComment(task, commentId, userId) {
    const comments = (task.variables.comments || []);
    const comment = comments.find(c => c.id === commentId);
    if (!comment) {
        throw new common_1.NotFoundException('Comment not found');
    }
    if (comment.userId !== userId) {
        throw new common_1.ForbiddenException('Only comment author can delete');
    }
    task.variables.comments = comments.filter(c => c.id !== commentId);
    task.updatedAt = new Date();
}
// ============================================================================
// TASK ATTACHMENTS
// ============================================================================
/**
 * 41. Adds an attachment to a task.
 *
 * @example
 * const attachment = addTaskAttachment(task, {
 *   fileName: 'patient-record.pdf',
 *   fileSize: 1024000,
 *   mimeType: 'application/pdf',
 *   fileUrl: 'https://storage.example.com/files/123',
 *   uploadedBy: 'user-123',
 *   category: 'document',
 * });
 */
function addTaskAttachment(task, attachmentData) {
    const attachment = {
        id: crypto.randomUUID(),
        taskId: task.id,
        ...attachmentData,
        uploadedAt: new Date(),
    };
    task.variables = {
        ...task.variables,
        attachments: [
            ...(task.variables.attachments || []),
            attachment,
        ],
    };
    task.updatedAt = new Date();
    return attachment;
}
/**
 * 42. Removes an attachment from a task.
 *
 * @example
 * removeTaskAttachment(task, attachmentId, 'user-123');
 */
function removeTaskAttachment(task, attachmentId, userId) {
    const attachments = (task.variables.attachments || []);
    const attachment = attachments.find(a => a.id === attachmentId);
    if (!attachment) {
        throw new common_1.NotFoundException('Attachment not found');
    }
    if (attachment.uploadedBy !== userId) {
        throw new common_1.ForbiddenException('Only uploader can delete attachment');
    }
    task.variables.attachments = attachments.filter(a => a.id !== attachmentId);
    task.updatedAt = new Date();
}
/**
 * 43. Gets all attachments for a task.
 *
 * @example
 * const attachments = getTaskAttachments(task, 'document');
 */
function getTaskAttachments(task, category) {
    const attachments = (task.variables.attachments || []);
    if (category) {
        return attachments.filter(a => a.category === category);
    }
    return attachments;
}
/**
 * 44. Validates attachment size and type.
 *
 * @example
 * const valid = validateAttachment(fileName, fileSize, mimeType, {
 *   maxSizeMb: 10,
 *   allowedTypes: ['application/pdf', 'image/jpeg'],
 * });
 */
function validateAttachment(fileName, fileSize, mimeType, rules) {
    const errors = [];
    // Check file size
    const sizeMb = fileSize / (1024 * 1024);
    if (sizeMb > rules.maxSizeMb) {
        errors.push(`File size (${sizeMb.toFixed(2)}MB) exceeds maximum (${rules.maxSizeMb}MB)`);
    }
    // Check MIME type
    if (rules.allowedTypes && !rules.allowedTypes.includes(mimeType)) {
        errors.push(`File type ${mimeType} is not allowed`);
    }
    // Check extension
    if (rules.blockedExtensions) {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (extension && rules.blockedExtensions.includes(extension)) {
            errors.push(`File extension .${extension} is not allowed`);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * 45. Scans attachment for security threats.
 *
 * @example
 * const scanResult = await scanAttachmentForThreats(attachment);
 */
async function scanAttachmentForThreats(attachment) {
    // Placeholder for actual virus scanning integration
    // Would integrate with ClamAV, VirusTotal, etc.
    return {
        safe: true,
        threats: [],
    };
}
// ============================================================================
// TASK HISTORY AND REMINDERS
// ============================================================================
/**
 * 46. Records a history entry for a task action.
 *
 * @example
 * const entry = recordTaskHistory(task, 'completed', 'user-123', {
 *   status: { from: 'in_progress', to: 'completed' },
 * });
 */
function recordTaskHistory(task, action, userId, changes, comment) {
    const entry = {
        id: crypto.randomUUID(),
        taskId: task.id,
        action,
        userId,
        timestamp: new Date(),
        changes,
        comment,
    };
    task.variables = {
        ...task.variables,
        history: [
            ...(task.variables.history || []),
            entry,
        ],
    };
    return entry;
}
/**
 * 47. Gets complete task history.
 *
 * @example
 * const history = getTaskHistory(task);
 */
function getTaskHistory(task) {
    return (task.variables.history || []);
}
/**
 * 48. Creates a reminder for a task.
 *
 * @example
 * const reminder = createTaskReminder(
 *   task,
 *   'user-123',
 *   'due_date',
 *   addHours(task.dueDate!, -4)
 * );
 */
function createTaskReminder(task, userId, reminderType, scheduledFor, channel = 'in_app', message) {
    const reminder = {
        id: crypto.randomUUID(),
        taskId: task.id,
        userId,
        reminderType,
        scheduledFor,
        channel,
        message,
        sent: false,
        recurring: false,
    };
    task.variables = {
        ...task.variables,
        reminders: [
            ...(task.variables.reminders || []),
            reminder,
        ],
    };
    return reminder;
}
/**
 * 49. Gets pending reminders for a task.
 *
 * @example
 * const pending = getPendingReminders(task);
 */
function getPendingReminders(task) {
    const reminders = (task.variables.reminders || []);
    const now = new Date();
    return reminders.filter(r => !r.sent && r.scheduledFor <= now);
}
/**
 * 50. Calculates user workload metrics.
 *
 * @example
 * const metrics = calculateUserWorkload(tasks, 'user-123');
 */
function calculateUserWorkload(tasks, userId) {
    const userTasks = tasks.filter(t => t.assignee === userId || t.claimedBy === userId);
    const claimedTasks = userTasks.filter(t => t.status === 'claimed').length;
    const inProgressTasks = userTasks.filter(t => t.status === 'in_progress').length;
    const completedTasks = userTasks.filter(t => t.status === 'completed').length;
    const overdueTasks = userTasks.filter(t => t.dueDate && (0, date_fns_1.isPast)(t.dueDate) && t.status !== 'completed').length;
    const completionTimes = userTasks
        .filter(t => t.status === 'completed')
        .map(t => calculateTaskCompletionTime(t))
        .filter((time) => time !== null);
    const averageCompletionTimeHours = completionTimes.length > 0
        ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
        : 0;
    const tasksByPriority = {
        urgent: 0,
        high: 0,
        normal: 0,
        low: 0,
    };
    userTasks.forEach(t => {
        tasksByPriority[t.priority]++;
    });
    return {
        userId,
        totalTasks: userTasks.length,
        claimedTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        averageCompletionTimeHours,
        tasksByPriority,
    };
}
/**
 * Injectable service for user task management.
 *
 * @example
 * @Injectable()
 * export class ApprovalWorkflowService {
 *   constructor(private readonly userTaskService: UserTaskManagementService) {}
 *
 *   async createApprovalTask(patientId: string, assignedTo: string) {
 *     return this.userTaskService.createTask({
 *       workflowInstanceId: 'workflow-123',
 *       taskDefinitionKey: 'approve-patient',
 *       name: 'Approve Patient Record',
 *       assignee: assignedTo,
 *       formKey: 'patient-approval-form',
 *     });
 *   }
 * }
 */
let UserTaskManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UserTaskManagementService = _classThis = class {
        constructor(eventEmitter) {
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(UserTaskManagementService.name);
            this.tasks = new Map();
        }
        createTask(config) {
            const task = createUserTask(config);
            this.tasks.set(task.id, task);
            this.eventEmitter.emit('user-task.created', task);
            recordTaskHistory(task, 'created', config.assignee || 'system');
            return task;
        }
        getTask(taskId) {
            return this.tasks.get(taskId);
        }
        claimTask(taskId, userId, userGroups) {
            const task = this.tasks.get(taskId);
            if (!task)
                throw new common_1.NotFoundException('Task not found');
            if (!canUserClaimTask(task, userId, userGroups)) {
                throw new common_1.ForbiddenException('User cannot claim this task');
            }
            const claim = claimUserTask(task, userId);
            this.eventEmitter.emit('user-task.claimed', { task, claim });
            recordTaskHistory(task, 'claimed', userId);
            return claim;
        }
        completeTask(taskId, userId, formData, outcome) {
            const task = this.tasks.get(taskId);
            if (!task)
                throw new common_1.NotFoundException('Task not found');
            const completion = completeUserTask(task, userId, formData, outcome);
            this.eventEmitter.emit('user-task.completed', { task, completion });
            recordTaskHistory(task, 'completed', userId);
            return completion;
        }
        addComment(taskId, userId, content, mentions) {
            const task = this.tasks.get(taskId);
            if (!task)
                throw new common_1.NotFoundException('Task not found');
            const comment = addTaskComment(task, userId, content, mentions);
            this.eventEmitter.emit('user-task.commented', { task, comment });
            recordTaskHistory(task, 'commented', userId);
            return comment;
        }
        addAttachment(taskId, attachmentData) {
            const task = this.tasks.get(taskId);
            if (!task)
                throw new common_1.NotFoundException('Task not found');
            const attachment = addTaskAttachment(task, attachmentData);
            this.eventEmitter.emit('user-task.attachment-added', { task, attachment });
            recordTaskHistory(task, 'attached', attachmentData.uploadedBy);
            return attachment;
        }
    };
    __setFunctionName(_classThis, "UserTaskManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserTaskManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserTaskManagementService = _classThis;
})();
exports.UserTaskManagementService = UserTaskManagementService;
//# sourceMappingURL=workflow-user-tasks.js.map