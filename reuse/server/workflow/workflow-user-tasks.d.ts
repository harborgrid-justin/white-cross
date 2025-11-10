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
import { EventEmitter2 } from '@nestjs/event-emitter';
/**
 * Zod schema for user task definition.
 */
export declare const UserTaskSchema: any;
/**
 * Zod schema for user task assignment.
 */
export declare const UserTaskAssignmentSchema: any;
/**
 * Zod schema for user task claim.
 */
export declare const UserTaskClaimSchema: any;
/**
 * Zod schema for user task completion.
 */
export declare const UserTaskCompletionSchema: any;
/**
 * Zod schema for task form definition.
 */
export declare const TaskFormSchema: any;
/**
 * Zod schema for user task permissions.
 */
export declare const TaskPermissionSchema: any;
/**
 * Zod schema for task escalation.
 */
export declare const TaskEscalationSchema: any;
/**
 * Zod schema for task comment.
 */
export declare const TaskCommentSchema: any;
/**
 * Zod schema for task attachment.
 */
export declare const TaskAttachmentSchema: any;
/**
 * Zod schema for task history entry.
 */
export declare const TaskHistoryEntrySchema: any;
/**
 * Zod schema for task reminder.
 */
export declare const TaskReminderSchema: any;
/**
 * Zod schema for task reassignment.
 */
export declare const TaskReassignmentSchema: any;
/**
 * Zod schema for task delegation.
 */
export declare const UserTaskDelegationSchema: any;
export interface UserTask {
    id: string;
    workflowInstanceId: string;
    taskDefinitionKey: string;
    name: string;
    description?: string;
    priority: 'urgent' | 'high' | 'normal' | 'low';
    status: 'unassigned' | 'assigned' | 'claimed' | 'in_progress' | 'pending_approval' | 'completed' | 'cancelled' | 'escalated';
    assignee?: string;
    candidateUsers: string[];
    candidateGroups: string[];
    claimedBy?: string;
    claimedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    followUpDate?: Date;
    completedAt?: Date;
    completedBy?: string;
    formKey?: string;
    formData?: Record<string, any>;
    variables: Record<string, any>;
    tenantId?: string;
    parentTaskId?: string;
    tags: string[];
}
export interface UserTaskAssignment {
    taskId: string;
    userId: string;
    assignedBy: string;
    assignedAt: Date;
    reason?: string;
    notifyUser: boolean;
    dueDate?: Date;
}
export interface UserTaskClaim {
    taskId: string;
    userId: string;
    claimedAt: Date;
    previousClaimant?: string;
    metadata?: Record<string, any>;
}
export interface UserTaskCompletion {
    taskId: string;
    userId: string;
    completedAt: Date;
    outcome?: string;
    formData?: Record<string, any>;
    variables?: Record<string, any>;
    comments?: string;
    attachments?: string[];
}
export interface TaskForm {
    formKey: string;
    version: string;
    fields: TaskFormField[];
    layout: 'single' | 'two-column' | 'grid';
    submitLabel: string;
    cancelLabel: string;
    metadata?: Record<string, any>;
}
export interface TaskFormField {
    id: string;
    type: 'text' | 'textarea' | 'number' | 'date' | 'datetime' | 'boolean' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'file' | 'signature';
    label: string;
    placeholder?: string;
    defaultValue?: any;
    required: boolean;
    readonly: boolean;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        minLength?: number;
        maxLength?: number;
        custom?: string;
    };
    options?: Array<{
        value: string;
        label: string;
        disabled?: boolean;
    }>;
    conditional?: {
        field: string;
        operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
        value: any;
    };
    metadata?: Record<string, any>;
}
export interface TaskPermission {
    taskId: string;
    userId: string;
    permissions: Array<'view' | 'claim' | 'complete' | 'reassign' | 'escalate' | 'comment' | 'attach' | 'delete'>;
    grantedBy?: string;
    grantedAt: Date;
    expiresAt?: Date;
}
export interface TaskEscalation {
    taskId: string;
    escalatedBy: string;
    escalatedTo: string;
    escalatedAt: Date;
    reason: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    originalDueDate?: Date;
    newDueDate?: Date;
    metadata?: Record<string, any>;
}
export interface TaskComment {
    id: string;
    taskId: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    parentCommentId?: string;
    mentions: string[];
    attachments?: string[];
    isInternal: boolean;
    metadata?: Record<string, any>;
}
export interface TaskAttachment {
    id: string;
    taskId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedAt: Date;
    description?: string;
    category?: 'document' | 'image' | 'spreadsheet' | 'presentation' | 'other';
    scanStatus?: 'pending' | 'clean' | 'infected' | 'error';
    metadata?: Record<string, any>;
}
export interface TaskHistoryEntry {
    id: string;
    taskId: string;
    action: 'created' | 'assigned' | 'claimed' | 'released' | 'completed' | 'cancelled' | 'escalated' | 'reassigned' | 'commented' | 'attached' | 'updated';
    userId: string;
    timestamp: Date;
    changes?: Record<string, {
        from: any;
        to: any;
    }>;
    comment?: string;
    metadata?: Record<string, any>;
}
export interface TaskReminder {
    id: string;
    taskId: string;
    userId: string;
    reminderType: 'due_date' | 'follow_up' | 'escalation' | 'custom';
    scheduledFor: Date;
    channel: 'email' | 'sms' | 'push' | 'in_app';
    message?: string;
    sent: boolean;
    sentAt?: Date;
    recurring: boolean;
    recurrencePattern?: string;
}
export interface TaskReassignment {
    taskId: string;
    fromUser: string;
    toUser: string;
    reassignedBy: string;
    reassignedAt: Date;
    reason: string;
    notifyBoth: boolean;
    transferOwnership: boolean;
}
export interface UserTaskDelegation {
    taskId: string;
    delegatedBy: string;
    delegatedTo: string;
    delegatedAt: Date;
    expiresAt?: Date;
    reason?: string;
    canReassign: boolean;
    returnOnCompletion: boolean;
}
export interface WorkloadMetrics {
    userId: string;
    totalTasks: number;
    claimedTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    overdueTasks: number;
    averageCompletionTimeHours: number;
    tasksByPriority: Record<UserTask['priority'], number>;
}
export interface TaskFilter {
    status?: UserTask['status'][];
    priority?: UserTask['priority'][];
    assignee?: string;
    candidateUser?: string;
    candidateGroup?: string;
    tags?: string[];
    dueAfter?: Date;
    dueBefore?: Date;
    createdAfter?: Date;
    createdBefore?: Date;
    tenantId?: string;
}
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
export declare function createUserTask(config: Partial<UserTask> & Pick<UserTask, 'workflowInstanceId' | 'taskDefinitionKey' | 'name'>): UserTask;
/**
 * 2. Assigns a user task to a specific user.
 *
 * @example
 * const assignment = assignUserTask(task, 'user-123', 'manager-456', 'Best qualified');
 */
export declare function assignUserTask(task: UserTask, userId: string, assignedBy: string, reason?: string, dueDate?: Date): UserTaskAssignment;
/**
 * 3. Adds candidate users to a task.
 *
 * @example
 * addCandidateUsers(task, ['user-123', 'user-456']);
 */
export declare function addCandidateUsers(task: UserTask, userIds: string[]): void;
/**
 * 4. Adds candidate groups to a task.
 *
 * @example
 * addCandidateGroups(task, ['doctors', 'specialists']);
 */
export declare function addCandidateGroups(task: UserTask, groupIds: string[]): void;
/**
 * 5. Auto-assigns task to user with lowest workload.
 *
 * @example
 * const assignedTo = autoAssignUserTask(task, candidateUsers, workloads);
 */
export declare function autoAssignUserTask(task: UserTask, candidateUsers: string[], workloadMetrics: Map<string, WorkloadMetrics>): string;
/**
 * 6. Claims a user task.
 *
 * @example
 * const claim = claimUserTask(task, 'user-123');
 */
export declare function claimUserTask(task: UserTask, userId: string): UserTaskClaim;
/**
 * 7. Releases a claimed task back to the pool.
 *
 * @example
 * releaseUserTask(task, 'user-123');
 */
export declare function releaseUserTask(task: UserTask, userId: string): void;
/**
 * 8. Checks if a user can claim a task.
 *
 * @example
 * const canClaim = canUserClaimTask(task, 'user-123', ['doctors']);
 */
export declare function canUserClaimTask(task: UserTask, userId: string, userGroups: string[]): boolean;
/**
 * 9. Forces claim of a task (admin override).
 *
 * @example
 * forceClaimTask(task, 'admin-123', 'Emergency override');
 */
export declare function forceClaimTask(task: UserTask, userId: string, reason: string): UserTaskClaim;
/**
 * 10. Gets all claimable tasks for a user.
 *
 * @example
 * const claimableTasks = getClaimableTasksForUser(allTasks, 'user-123', ['doctors']);
 */
export declare function getClaimableTasksForUser(tasks: UserTask[], userId: string, userGroups: string[]): UserTask[];
/**
 * 11. Completes a user task with form data.
 *
 * @example
 * const completion = completeUserTask(task, 'user-123', {
 *   approved: true,
 *   comments: 'Looks good',
 * });
 */
export declare function completeUserTask(task: UserTask, userId: string, formData?: Record<string, any>, outcome?: string): UserTaskCompletion;
/**
 * 12. Validates form data against form definition.
 *
 * @example
 * const errors = validateTaskFormData(formDefinition, formData);
 */
export declare function validateTaskFormData(form: TaskForm, data: Record<string, any>): Record<string, string[]>;
/**
 * 13. Saves partial form data (draft).
 *
 * @example
 * saveFormDataDraft(task, { patientName: 'John Doe' });
 */
export declare function saveFormDataDraft(task: UserTask, partialData: Record<string, any>): void;
/**
 * 14. Calculates task completion time.
 *
 * @example
 * const hours = calculateTaskCompletionTime(task);
 */
export declare function calculateTaskCompletionTime(task: UserTask): number | null;
/**
 * 15. Gets task completion statistics.
 *
 * @example
 * const stats = getTaskCompletionStats(tasks, 'user-123');
 */
export declare function getTaskCompletionStats(tasks: UserTask[], userId?: string): {
    total: number;
    completed: number;
    averageCompletionTimeHours: number;
    onTimeCompletionRate: number;
};
/**
 * 16. Creates a task form definition.
 *
 * @example
 * const form = createTaskForm('patient-approval', [
 *   { id: 'approved', type: 'boolean', label: 'Approve?', required: true },
 *   { id: 'comments', type: 'textarea', label: 'Comments' },
 * ]);
 */
export declare function createTaskForm(formKey: string, fields: TaskFormField[], options?: {
    version?: string;
    layout?: TaskForm['layout'];
    submitLabel?: string;
    cancelLabel?: string;
}): TaskForm;
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
export declare function addFormField(form: TaskForm, field: TaskFormField): void;
/**
 * 18. Evaluates conditional field visibility.
 *
 * @example
 * const visible = isFieldVisible(field, formData);
 */
export declare function isFieldVisible(field: TaskFormField, formData: Record<string, any>): boolean;
/**
 * 19. Renders form with conditional fields.
 *
 * @example
 * const visibleFields = getVisibleFormFields(form, formData);
 */
export declare function getVisibleFormFields(form: TaskForm, formData: Record<string, any>): TaskFormField[];
/**
 * 20. Extracts form variables for workflow.
 *
 * @example
 * const variables = extractFormVariables(formData, form);
 */
export declare function extractFormVariables(formData: Record<string, any>, form: TaskForm): Record<string, any>;
/**
 * 21. Checks if user has permission for task action.
 *
 * @example
 * const canComplete = hasTaskPermission(task, 'user-123', 'complete', userGroups);
 */
export declare function hasTaskPermission(task: UserTask, userId: string, action: TaskPermission['permissions'][number], userGroups: string[]): boolean;
/**
 * 22. Grants explicit permission to a user.
 *
 * @example
 * const permission = grantTaskPermission(task, 'user-123', ['view', 'comment'], 'admin-456');
 */
export declare function grantTaskPermission(task: UserTask, userId: string, permissions: TaskPermission['permissions'], grantedBy: string, expiresAt?: Date): TaskPermission;
/**
 * 23. Revokes permission from a user.
 *
 * @example
 * revokeTaskPermission(task, 'user-123');
 */
export declare function revokeTaskPermission(task: UserTask, userId: string): void;
/**
 * 24. Validates user can perform action.
 *
 * @example
 * validateTaskAction(task, 'user-123', 'complete', userGroups);
 */
export declare function validateTaskAction(task: UserTask, userId: string, action: TaskPermission['permissions'][number], userGroups: string[]): void;
/**
 * 25. Gets all permissions for a user on a task.
 *
 * @example
 * const permissions = getTaskPermissionsForUser(task, 'user-123', userGroups);
 */
export declare function getTaskPermissionsForUser(task: UserTask, userId: string, userGroups: string[]): TaskPermission['permissions'];
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
export declare function escalateUserTask(task: UserTask, escalatedBy: string, escalatedTo: string, reason: string, urgencyLevel?: TaskEscalation['urgencyLevel']): TaskEscalation;
/**
 * 27. Auto-escalates overdue tasks.
 *
 * @example
 * const escalated = autoEscalateOverdueTasks(tasks, escalationRules);
 */
export declare function autoEscalateOverdueTasks(tasks: UserTask[], escalationRules: {
    hoursOverdue: number;
    escalateTo: string;
    urgencyLevel: TaskEscalation['urgencyLevel'];
}[]): UserTask[];
/**
 * 28. Checks if task should be escalated.
 *
 * @example
 * const shouldEscalate = shouldEscalateTask(task, 24);
 */
export declare function shouldEscalateTask(task: UserTask, hoursOverdueThreshold: number): boolean;
/**
 * 29. De-escalates a task back to normal priority.
 *
 * @example
 * deEscalateTask(task, 'manager-456', 'Issue resolved');
 */
export declare function deEscalateTask(task: UserTask, deEscalatedBy: string, reason: string): void;
/**
 * 30. Gets escalation path for task type.
 *
 * @example
 * const path = getEscalationPath('patient-approval', 1);
 */
export declare function getEscalationPath(taskType: string, escalationLevel: number, escalationPaths: Record<string, string[]>): string | null;
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
export declare function reassignUserTask(task: UserTask, toUser: string, reassignedBy: string, reason: string): TaskReassignment;
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
export declare function delegateUserTask(task: UserTask, delegatedBy: string, delegatedTo: string, expiresAt?: Date, reason?: string): UserTaskDelegation;
/**
 * 33. Returns delegated task to original owner.
 *
 * @example
 * returnDelegatedTask(task, 'user-456');
 */
export declare function returnDelegatedTask(task: UserTask, returnedBy: string): void;
/**
 * 34. Checks if delegation has expired.
 *
 * @example
 * const expired = isDelegationExpired(task);
 */
export declare function isDelegationExpired(task: UserTask): boolean;
/**
 * 35. Balances workload across team members.
 *
 * @example
 * const rebalanced = rebalanceTaskWorkload(tasks, teamMembers, maxTasksPerUser);
 */
export declare function rebalanceTaskWorkload(tasks: UserTask[], teamMembers: string[], maxTasksPerUser: number): UserTask[];
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
export declare function addTaskComment(task: UserTask, userId: string, content: string, mentions?: string[], parentCommentId?: string, isInternal?: boolean): TaskComment;
/**
 * 37. Edits an existing comment.
 *
 * @example
 * updateTaskComment(task, commentId, 'Updated comment text');
 */
export declare function updateTaskComment(task: UserTask, commentId: string, newContent: string, userId: string): void;
/**
 * 38. Gets all comments for a task with threading.
 *
 * @example
 * const comments = getTaskComments(task, true);
 */
export declare function getTaskComments(task: UserTask, includeInternal?: boolean): TaskComment[];
/**
 * 39. Gets comment thread (parent and replies).
 *
 * @example
 * const thread = getCommentThread(task, parentCommentId);
 */
export declare function getCommentThread(task: UserTask, parentCommentId: string): TaskComment[];
/**
 * 40. Deletes a comment.
 *
 * @example
 * deleteTaskComment(task, commentId, 'user-123');
 */
export declare function deleteTaskComment(task: UserTask, commentId: string, userId: string): void;
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
export declare function addTaskAttachment(task: UserTask, attachmentData: Omit<TaskAttachment, 'id' | 'taskId' | 'uploadedAt'>): TaskAttachment;
/**
 * 42. Removes an attachment from a task.
 *
 * @example
 * removeTaskAttachment(task, attachmentId, 'user-123');
 */
export declare function removeTaskAttachment(task: UserTask, attachmentId: string, userId: string): void;
/**
 * 43. Gets all attachments for a task.
 *
 * @example
 * const attachments = getTaskAttachments(task, 'document');
 */
export declare function getTaskAttachments(task: UserTask, category?: TaskAttachment['category']): TaskAttachment[];
/**
 * 44. Validates attachment size and type.
 *
 * @example
 * const valid = validateAttachment(fileName, fileSize, mimeType, {
 *   maxSizeMb: 10,
 *   allowedTypes: ['application/pdf', 'image/jpeg'],
 * });
 */
export declare function validateAttachment(fileName: string, fileSize: number, mimeType: string, rules: {
    maxSizeMb: number;
    allowedTypes?: string[];
    blockedExtensions?: string[];
}): {
    valid: boolean;
    errors: string[];
};
/**
 * 45. Scans attachment for security threats.
 *
 * @example
 * const scanResult = await scanAttachmentForThreats(attachment);
 */
export declare function scanAttachmentForThreats(attachment: TaskAttachment): Promise<{
    safe: boolean;
    threats: string[];
}>;
/**
 * 46. Records a history entry for a task action.
 *
 * @example
 * const entry = recordTaskHistory(task, 'completed', 'user-123', {
 *   status: { from: 'in_progress', to: 'completed' },
 * });
 */
export declare function recordTaskHistory(task: UserTask, action: TaskHistoryEntry['action'], userId: string, changes?: Record<string, {
    from: any;
    to: any;
}>, comment?: string): TaskHistoryEntry;
/**
 * 47. Gets complete task history.
 *
 * @example
 * const history = getTaskHistory(task);
 */
export declare function getTaskHistory(task: UserTask): TaskHistoryEntry[];
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
export declare function createTaskReminder(task: UserTask, userId: string, reminderType: TaskReminder['reminderType'], scheduledFor: Date, channel?: TaskReminder['channel'], message?: string): TaskReminder;
/**
 * 49. Gets pending reminders for a task.
 *
 * @example
 * const pending = getPendingReminders(task);
 */
export declare function getPendingReminders(task: UserTask): TaskReminder[];
/**
 * 50. Calculates user workload metrics.
 *
 * @example
 * const metrics = calculateUserWorkload(tasks, 'user-123');
 */
export declare function calculateUserWorkload(tasks: UserTask[], userId: string): WorkloadMetrics;
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
export declare class UserTaskManagementService {
    private readonly eventEmitter;
    private readonly logger;
    private readonly tasks;
    constructor(eventEmitter: EventEmitter2);
    createTask(config: Parameters<typeof createUserTask>[0]): UserTask;
    getTask(taskId: string): UserTask | undefined;
    claimTask(taskId: string, userId: string, userGroups: string[]): UserTaskClaim;
    completeTask(taskId: string, userId: string, formData?: Record<string, any>, outcome?: string): UserTaskCompletion;
    addComment(taskId: string, userId: string, content: string, mentions?: string[]): TaskComment;
    addAttachment(taskId: string, attachmentData: Parameters<typeof addTaskAttachment>[1]): TaskAttachment;
}
//# sourceMappingURL=workflow-user-tasks.d.ts.map