"use strict";
/**
 * LOC: WC-ORD-APPWF-001
 * File: /reuse/order/order-approval-workflows-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/passport
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order approval controllers
 *   - Order authorization services
 *   - Workflow management modules
 *   - Approval delegation services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderApprovalType = exports.ApprovalPriority = exports.ApprovalNotificationType = exports.ApprovalAuthority = exports.ApprovalAction = exports.ApprovalStepType = exports.ApprovalWorkflowStatus = void 0;
exports.createApprovalWorkflow = createApprovalWorkflow;
exports.configureApprovalStep = configureApprovalStep;
exports.defineApprovalRoutingRules = defineApprovalRoutingRules;
exports.updateWorkflowConfig = updateWorkflowConfig;
exports.initializeApprovalRoute = initializeApprovalRoute;
exports.routeToNextStep = routeToNextStep;
exports.processParallelApprovals = processParallelApprovals;
exports.evaluateConditionalRouting = evaluateConditionalRouting;
exports.approveOrder = approveOrder;
exports.rejectOrder = rejectOrder;
exports.requestAdditionalInfo = requestAdditionalInfo;
exports.delegateApproval = delegateApproval;
exports.revokeDelegation = revokeDelegation;
exports.configureAutoApprovalRule = configureAutoApprovalRule;
exports.evaluateAutoApproval = evaluateAutoApproval;
exports.applyAutoApproval = applyAutoApproval;
exports.escalateApproval = escalateApproval;
exports.processTimeoutEscalation = processTimeoutEscalation;
exports.configureEscalationRule = configureEscalationRule;
exports.monitorApprovalTimeouts = monitorApprovalTimeouts;
exports.setApprovalTimeout = setApprovalTimeout;
exports.extendApprovalTimeout = extendApprovalTimeout;
exports.validateBudgetApprovalAuthority = validateBudgetApprovalAuthority;
exports.approveBudgetOverride = approveBudgetOverride;
exports.checkBudgetAvailability = checkBudgetAvailability;
exports.requestPriceOverrideApproval = requestPriceOverrideApproval;
exports.approvePriceOverride = approvePriceOverride;
exports.validatePriceOverrideLimits = validatePriceOverrideLimits;
exports.requestCreditLimitOverrideApproval = requestCreditLimitOverrideApproval;
exports.approveCreditLimitOverride = approveCreditLimitOverride;
exports.monitorCreditOverrideExpirations = monitorCreditOverrideExpirations;
exports.sendApprovalNotifications = sendApprovalNotifications;
/**
 * File: /reuse/order/order-approval-workflows-kit.ts
 * Locator: WC-ORD-APPWF-001
 * Purpose: Order Approval Workflows - Multi-level approvals, authorization, and workflow management
 *
 * Upstream: Independent utility module for order approval workflows
 * Downstream: ../backend/order/*, Approval modules, Authorization services, Workflow engines
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/passport, sequelize-typescript
 * Exports: 36 utility functions for approval workflows, authorization, delegation, escalation
 *
 * LLM Context: Enterprise-grade order approval workflow system to compete with Oracle E-Business Suite.
 * Provides comprehensive multi-level approval chains, approval routing, delegation management, auto-approval rules,
 * escalation workflows, timeout management, concurrent/sequential approvals, budget approvals, price override approvals,
 * credit limit override approvals, approval notifications, approval policies, and complete audit trails.
 */
const common_1 = require("@nestjs/common");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Approval workflow status
 */
var ApprovalWorkflowStatus;
(function (ApprovalWorkflowStatus) {
    ApprovalWorkflowStatus["DRAFT"] = "DRAFT";
    ApprovalWorkflowStatus["PENDING"] = "PENDING";
    ApprovalWorkflowStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ApprovalWorkflowStatus["APPROVED"] = "APPROVED";
    ApprovalWorkflowStatus["REJECTED"] = "REJECTED";
    ApprovalWorkflowStatus["CANCELLED"] = "CANCELLED";
    ApprovalWorkflowStatus["EXPIRED"] = "EXPIRED";
    ApprovalWorkflowStatus["ON_HOLD"] = "ON_HOLD";
    ApprovalWorkflowStatus["ESCALATED"] = "ESCALATED";
})(ApprovalWorkflowStatus || (exports.ApprovalWorkflowStatus = ApprovalWorkflowStatus = {}));
/**
 * Approval step types
 */
var ApprovalStepType;
(function (ApprovalStepType) {
    ApprovalStepType["SEQUENTIAL"] = "SEQUENTIAL";
    ApprovalStepType["PARALLEL"] = "PARALLEL";
    ApprovalStepType["CONDITIONAL"] = "CONDITIONAL";
    ApprovalStepType["AUTOMATIC"] = "AUTOMATIC";
    ApprovalStepType["HYBRID"] = "HYBRID";
})(ApprovalStepType || (exports.ApprovalStepType = ApprovalStepType = {}));
/**
 * Approval action types
 */
var ApprovalAction;
(function (ApprovalAction) {
    ApprovalAction["APPROVE"] = "APPROVE";
    ApprovalAction["REJECT"] = "REJECT";
    ApprovalAction["DELEGATE"] = "DELEGATE";
    ApprovalAction["ESCALATE"] = "ESCALATE";
    ApprovalAction["REQUEST_INFO"] = "REQUEST_INFO";
    ApprovalAction["RECALL"] = "RECALL";
    ApprovalAction["SKIP"] = "SKIP";
    ApprovalAction["TIMEOUT"] = "TIMEOUT";
})(ApprovalAction || (exports.ApprovalAction = ApprovalAction = {}));
/**
 * Approval authority levels
 */
var ApprovalAuthority;
(function (ApprovalAuthority) {
    ApprovalAuthority["MANAGER"] = "MANAGER";
    ApprovalAuthority["DIRECTOR"] = "DIRECTOR";
    ApprovalAuthority["VP"] = "VP";
    ApprovalAuthority["CFO"] = "CFO";
    ApprovalAuthority["CEO"] = "CEO";
    ApprovalAuthority["BOARD"] = "BOARD";
    ApprovalAuthority["CUSTOM"] = "CUSTOM";
})(ApprovalAuthority || (exports.ApprovalAuthority = ApprovalAuthority = {}));
/**
 * Approval notification types
 */
var ApprovalNotificationType;
(function (ApprovalNotificationType) {
    ApprovalNotificationType["EMAIL"] = "EMAIL";
    ApprovalNotificationType["SMS"] = "SMS";
    ApprovalNotificationType["PUSH"] = "PUSH";
    ApprovalNotificationType["IN_APP"] = "IN_APP";
    ApprovalNotificationType["SLACK"] = "SLACK";
    ApprovalNotificationType["TEAMS"] = "TEAMS";
})(ApprovalNotificationType || (exports.ApprovalNotificationType = ApprovalNotificationType = {}));
/**
 * Approval priority levels
 */
var ApprovalPriority;
(function (ApprovalPriority) {
    ApprovalPriority["LOW"] = "LOW";
    ApprovalPriority["NORMAL"] = "NORMAL";
    ApprovalPriority["HIGH"] = "HIGH";
    ApprovalPriority["URGENT"] = "URGENT";
    ApprovalPriority["CRITICAL"] = "CRITICAL";
})(ApprovalPriority || (exports.ApprovalPriority = ApprovalPriority = {}));
/**
 * Order approval types
 */
var OrderApprovalType;
(function (OrderApprovalType) {
    OrderApprovalType["STANDARD_ORDER"] = "STANDARD_ORDER";
    OrderApprovalType["BUDGET_APPROVAL"] = "BUDGET_APPROVAL";
    OrderApprovalType["PRICE_OVERRIDE"] = "PRICE_OVERRIDE";
    OrderApprovalType["DISCOUNT_OVERRIDE"] = "DISCOUNT_OVERRIDE";
    OrderApprovalType["CREDIT_LIMIT_OVERRIDE"] = "CREDIT_LIMIT_OVERRIDE";
    OrderApprovalType["TERMS_OVERRIDE"] = "TERMS_OVERRIDE";
    OrderApprovalType["SPECIAL_PRICING"] = "SPECIAL_PRICING";
    OrderApprovalType["RUSH_ORDER"] = "RUSH_ORDER";
    OrderApprovalType["BACKORDER_RELEASE"] = "BACKORDER_RELEASE";
    OrderApprovalType["LARGE_ORDER"] = "LARGE_ORDER";
    OrderApprovalType["HIGH_VALUE"] = "HIGH_VALUE";
    OrderApprovalType["NEW_CUSTOMER"] = "NEW_CUSTOMER";
})(OrderApprovalType || (exports.OrderApprovalType = OrderApprovalType = {}));
// ============================================================================
// APPROVAL WORKFLOW CONFIGURATION FUNCTIONS
// ============================================================================
/**
 * Create approval workflow configuration
 * Sets up multi-level approval workflow with steps and rules
 */
async function createApprovalWorkflow(workflowData, createdBy) {
    try {
        const workflow = {
            workflowId: generateWorkflowId(),
            workflowName: workflowData.workflowName || '',
            orderType: workflowData.orderType || '',
            approvalType: workflowData.approvalType || OrderApprovalType.STANDARD_ORDER,
            description: workflowData.description,
            isActive: workflowData.isActive ?? true,
            effectiveFrom: workflowData.effectiveFrom || new Date(),
            effectiveTo: workflowData.effectiveTo,
            priority: workflowData.priority || ApprovalPriority.NORMAL,
            stepType: workflowData.stepType || ApprovalStepType.SEQUENTIAL,
            steps: workflowData.steps || [],
            autoApprovalRules: workflowData.autoApprovalRules,
            escalationRules: workflowData.escalationRules,
            timeoutConfig: workflowData.timeoutConfig,
            notificationConfig: workflowData.notificationConfig,
            metadata: workflowData.metadata,
            createdBy,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        // Validate workflow configuration
        validateWorkflowConfig(workflow);
        // Audit trail
        await auditApprovalEvent('workflow_created', workflow.workflowId, createdBy, workflow);
        return workflow;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create approval workflow: ${error.message}`);
    }
}
/**
 * Configure approval step with authority levels
 * Defines approval step with approvers, timeouts, and conditions
 */
async function configureApprovalStep(stepData) {
    try {
        const step = {
            stepId: generateStepId(),
            stepNumber: stepData.stepNumber || 1,
            stepName: stepData.stepName || '',
            stepType: stepData.stepType || ApprovalStepType.SEQUENTIAL,
            authority: stepData.authority || ApprovalAuthority.MANAGER,
            approverRoles: stepData.approverRoles || [],
            approverUsers: stepData.approverUsers,
            approverGroups: stepData.approverGroups,
            requiredApprovals: stepData.requiredApprovals || 1,
            allowDelegation: stepData.allowDelegation ?? true,
            allowParallelApproval: stepData.allowParallelApproval ?? false,
            timeoutMinutes: stepData.timeoutMinutes,
            escalateOnTimeout: stepData.escalateOnTimeout ?? true,
            escalationAuthority: stepData.escalationAuthority,
            condition: stepData.condition,
            metadata: stepData.metadata,
        };
        // Validate step configuration
        validateStepConfig(step);
        return step;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to configure approval step: ${error.message}`);
    }
}
/**
 * Define approval routing rules
 * Creates routing rules based on order attributes and conditions
 */
async function defineApprovalRoutingRules(orderType, approvalType, conditions) {
    try {
        const steps = [];
        // Route based on approval type
        switch (approvalType) {
            case OrderApprovalType.BUDGET_APPROVAL:
                steps.push(await configureApprovalStep({
                    stepNumber: 1,
                    stepName: 'Department Manager Approval',
                    authority: ApprovalAuthority.MANAGER,
                    approverRoles: ['DEPT_MANAGER'],
                    requiredApprovals: 1,
                    timeoutMinutes: 1440, // 24 hours
                }));
                if (conditions.amount > 50000) {
                    steps.push(await configureApprovalStep({
                        stepNumber: 2,
                        stepName: 'Director Approval',
                        authority: ApprovalAuthority.DIRECTOR,
                        approverRoles: ['DIRECTOR'],
                        requiredApprovals: 1,
                        timeoutMinutes: 2880, // 48 hours
                    }));
                }
                break;
            case OrderApprovalType.PRICE_OVERRIDE:
                const discountPercent = conditions.discountPercent || 0;
                if (discountPercent > 20) {
                    steps.push(await configureApprovalStep({
                        stepNumber: 1,
                        stepName: 'Sales Manager Approval',
                        authority: ApprovalAuthority.MANAGER,
                        approverRoles: ['SALES_MANAGER'],
                        requiredApprovals: 1,
                        timeoutMinutes: 720, // 12 hours
                    }));
                }
                if (discountPercent > 40) {
                    steps.push(await configureApprovalStep({
                        stepNumber: 2,
                        stepName: 'VP Sales Approval',
                        authority: ApprovalAuthority.VP,
                        approverRoles: ['VP_SALES'],
                        requiredApprovals: 1,
                        timeoutMinutes: 1440, // 24 hours
                    }));
                }
                break;
            case OrderApprovalType.CREDIT_LIMIT_OVERRIDE:
                steps.push(await configureApprovalStep({
                    stepNumber: 1,
                    stepName: 'Credit Manager Approval',
                    authority: ApprovalAuthority.MANAGER,
                    approverRoles: ['CREDIT_MANAGER'],
                    requiredApprovals: 1,
                    timeoutMinutes: 480, // 8 hours
                }));
                if (conditions.overrideAmount > 100000) {
                    steps.push(await configureApprovalStep({
                        stepNumber: 2,
                        stepName: 'CFO Approval',
                        authority: ApprovalAuthority.CFO,
                        approverRoles: ['CFO'],
                        requiredApprovals: 1,
                        timeoutMinutes: 1440, // 24 hours
                    }));
                }
                break;
            default:
                steps.push(await configureApprovalStep({
                    stepNumber: 1,
                    stepName: 'Manager Approval',
                    authority: ApprovalAuthority.MANAGER,
                    approverRoles: ['MANAGER'],
                    requiredApprovals: 1,
                    timeoutMinutes: 1440, // 24 hours
                }));
        }
        return await createApprovalWorkflow({
            workflowName: `${approvalType} Workflow`,
            orderType,
            approvalType,
            stepType: ApprovalStepType.SEQUENTIAL,
            steps,
        }, 'system');
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to define routing rules: ${error.message}`);
    }
}
/**
 * Update workflow configuration
 * Modifies existing approval workflow settings
 */
async function updateWorkflowConfig(workflowId, updates, updatedBy) {
    try {
        const workflow = await getWorkflowById(workflowId);
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow ${workflowId} not found`);
        }
        const updatedWorkflow = {
            ...workflow,
            ...updates,
            updatedAt: new Date(),
        };
        validateWorkflowConfig(updatedWorkflow);
        await auditApprovalEvent('workflow_updated', workflowId, updatedBy, {
            before: workflow,
            after: updatedWorkflow,
        });
        return updatedWorkflow;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to update workflow: ${error.message}`);
    }
}
// ============================================================================
// APPROVAL CHAIN & ROUTING FUNCTIONS
// ============================================================================
/**
 * Initialize approval route for order
 * Creates approval route instance and starts workflow
 */
async function initializeApprovalRoute(orderId, orderData, requestedBy) {
    try {
        // Determine workflow based on order attributes
        const workflow = await determineWorkflow(orderData);
        // Check auto-approval rules
        const autoApproved = await checkAutoApprovalRules(orderData, workflow);
        if (autoApproved) {
            return await createAutoApprovedRoute(orderId, orderData, requestedBy, workflow);
        }
        const route = {
            routeId: generateRouteId(),
            workflowId: workflow.workflowId,
            orderId,
            orderNumber: orderData.orderNumber,
            orderType: orderData.orderType,
            approvalType: workflow.approvalType,
            orderAmount: orderData.totalAmount,
            currency: orderData.currency || 'USD',
            customerId: orderData.customerId,
            requestedBy,
            currentStepNumber: 1,
            status: ApprovalWorkflowStatus.PENDING,
            priority: orderData.priority || ApprovalPriority.NORMAL,
            steps: await initializeSteps(workflow.steps, route.routeId),
            startedAt: new Date(),
            expiresAt: calculateExpirationDate(workflow),
            metadata: { orderData },
        };
        // Send notifications to first step approvers
        await sendApprovalNotifications(route, route.steps[0]);
        await auditApprovalEvent('route_initialized', route.routeId, requestedBy, route);
        return route;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to initialize approval route: ${error.message}`);
    }
}
/**
 * Route approval to next step
 * Advances approval workflow to subsequent step
 */
async function routeToNextStep(routeId, performedBy) {
    try {
        const route = await getApprovalRoute(routeId);
        if (!route) {
            throw new common_1.NotFoundException(`Approval route ${routeId} not found`);
        }
        const currentStep = route.steps[route.currentStepNumber - 1];
        if (currentStep.status !== ApprovalWorkflowStatus.APPROVED) {
            throw new common_1.BadRequestException('Current step must be approved before routing to next step');
        }
        // Check if there are more steps
        if (route.currentStepNumber >= route.steps.length) {
            // All steps approved - complete the workflow
            return await completeApprovalWorkflow(routeId, performedBy);
        }
        // Move to next step
        route.currentStepNumber += 1;
        const nextStep = route.steps[route.currentStepNumber - 1];
        nextStep.status = ApprovalWorkflowStatus.IN_PROGRESS;
        nextStep.startedAt = new Date();
        // Calculate timeout
        if (nextStep.stepConfig.timeoutMinutes) {
            nextStep.timeoutAt = new Date(Date.now() + nextStep.stepConfig.timeoutMinutes * 60000);
        }
        // Send notifications
        await sendApprovalNotifications(route, nextStep);
        await auditApprovalEvent('routed_to_next_step', routeId, performedBy, {
            stepNumber: route.currentStepNumber,
        });
        return route;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to route to next step: ${error.message}`);
    }
}
/**
 * Process parallel approval steps
 * Handles concurrent approvals with quorum requirements
 */
async function processParallelApprovals(stepInstanceId, approvalAction) {
    try {
        const stepInstance = await getStepInstance(stepInstanceId);
        if (!stepInstance) {
            throw new common_1.NotFoundException(`Step instance ${stepInstanceId} not found`);
        }
        if (stepInstance.stepConfig.stepType !== ApprovalStepType.PARALLEL) {
            throw new common_1.BadRequestException('Step is not configured for parallel approvals');
        }
        // Record the approval action
        stepInstance.actions.push(approvalAction);
        if (approvalAction.action === ApprovalAction.APPROVE) {
            stepInstance.approvedBy.push(approvalAction.performedBy);
        }
        else if (approvalAction.action === ApprovalAction.REJECT) {
            stepInstance.rejectedBy = approvalAction.performedBy;
            stepInstance.status = ApprovalWorkflowStatus.REJECTED;
            stepInstance.completedAt = new Date();
            return stepInstance;
        }
        // Check if required approvals met
        const requiredApprovals = stepInstance.stepConfig.requiredApprovals;
        const actualApprovals = stepInstance.approvedBy.length;
        if (actualApprovals >= requiredApprovals) {
            stepInstance.status = ApprovalWorkflowStatus.APPROVED;
            stepInstance.completedAt = new Date();
        }
        await auditApprovalEvent('parallel_approval_processed', stepInstance.routeId, approvalAction.performedBy, {
            stepInstanceId,
            actualApprovals,
            requiredApprovals,
        });
        return stepInstance;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process parallel approval: ${error.message}`);
    }
}
/**
 * Evaluate conditional approval routing
 * Routes based on dynamic conditions and business rules
 */
async function evaluateConditionalRouting(routeId, orderData) {
    try {
        const route = await getApprovalRoute(routeId);
        const workflow = await getWorkflowById(route.workflowId);
        for (const step of workflow.steps) {
            if (step.stepType === ApprovalStepType.CONDITIONAL && step.condition) {
                const conditionMet = evaluateCondition(step.condition, orderData);
                if (conditionMet) {
                    return step;
                }
            }
        }
        return null;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to evaluate conditional routing: ${error.message}`);
    }
}
// ============================================================================
// APPROVAL ACTION FUNCTIONS
// ============================================================================
/**
 * Approve order at current step
 * Records approval and advances workflow if appropriate
 */
async function approveOrder(routeId, approverId, comments, attachments) {
    try {
        const route = await getApprovalRoute(routeId);
        if (!route) {
            throw new common_1.NotFoundException(`Approval route ${routeId} not found`);
        }
        // Verify approver has authority
        await verifyApproverAuthority(route, approverId);
        const currentStep = route.steps[route.currentStepNumber - 1];
        const action = {
            actionId: generateActionId(),
            routeId,
            stepInstanceId: currentStep.stepInstanceId,
            action: ApprovalAction.APPROVE,
            performedBy: approverId,
            performedAt: new Date(),
            comments,
            attachments,
            metadata: {},
        };
        currentStep.actions.push(action);
        if (currentStep.stepConfig.stepType === ApprovalStepType.PARALLEL) {
            await processParallelApprovals(currentStep.stepInstanceId, action);
        }
        else {
            currentStep.approvedBy.push(approverId);
            currentStep.status = ApprovalWorkflowStatus.APPROVED;
            currentStep.completedAt = new Date();
        }
        // Add to route approved list
        if (!route.approvedBy)
            route.approvedBy = [];
        route.approvedBy.push(approverId);
        await auditApprovalEvent('order_approved', routeId, approverId, { stepNumber: route.currentStepNumber });
        // Notify requestor and next approvers
        await sendApprovalStatusNotification(route, 'approved', approverId);
        // Route to next step if current step is complete
        if (currentStep.status === ApprovalWorkflowStatus.APPROVED) {
            return await routeToNextStep(routeId, approverId);
        }
        return route;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to approve order: ${error.message}`);
    }
}
/**
 * Reject order with reason
 * Terminates approval workflow with rejection
 */
async function rejectOrder(routeId, rejectorId, reason, comments) {
    try {
        const route = await getApprovalRoute(routeId);
        if (!route) {
            throw new common_1.NotFoundException(`Approval route ${routeId} not found`);
        }
        await verifyApproverAuthority(route, rejectorId);
        const currentStep = route.steps[route.currentStepNumber - 1];
        const action = {
            actionId: generateActionId(),
            routeId,
            stepInstanceId: currentStep.stepInstanceId,
            action: ApprovalAction.REJECT,
            performedBy: rejectorId,
            performedAt: new Date(),
            comments: `${reason}${comments ? ': ' + comments : ''}`,
            metadata: {},
        };
        currentStep.actions.push(action);
        currentStep.rejectedBy = rejectorId;
        currentStep.status = ApprovalWorkflowStatus.REJECTED;
        currentStep.completedAt = new Date();
        route.status = ApprovalWorkflowStatus.REJECTED;
        route.rejectedBy = rejectorId;
        route.rejectionReason = reason;
        route.completedAt = new Date();
        await auditApprovalEvent('order_rejected', routeId, rejectorId, { reason, stepNumber: route.currentStepNumber });
        await sendApprovalStatusNotification(route, 'rejected', rejectorId);
        return route;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to reject order: ${error.message}`);
    }
}
/**
 * Request additional information
 * Pauses workflow and requests more details from requestor
 */
async function requestAdditionalInfo(routeId, approverId, requestedInfo, comments) {
    try {
        const route = await getApprovalRoute(routeId);
        if (!route) {
            throw new common_1.NotFoundException(`Approval route ${routeId} not found`);
        }
        await verifyApproverAuthority(route, approverId);
        const currentStep = route.steps[route.currentStepNumber - 1];
        const action = {
            actionId: generateActionId(),
            routeId,
            stepInstanceId: currentStep.stepInstanceId,
            action: ApprovalAction.REQUEST_INFO,
            performedBy: approverId,
            performedAt: new Date(),
            comments,
            metadata: { requestedInfo },
        };
        currentStep.actions.push(action);
        route.status = ApprovalWorkflowStatus.ON_HOLD;
        await auditApprovalEvent('info_requested', routeId, approverId, { requestedInfo });
        await notifyRequestor(route, 'info_requested', { requestedInfo, approverId, comments });
        return route;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to request additional info: ${error.message}`);
    }
}
// ============================================================================
// DELEGATION FUNCTIONS
// ============================================================================
/**
 * Delegate approval to another user
 * Transfers approval authority temporarily
 */
async function delegateApproval(routeId, delegatorId, delegateId, reason, expiresAt) {
    try {
        const route = await getApprovalRoute(routeId);
        if (!route) {
            throw new common_1.NotFoundException(`Approval route ${routeId} not found`);
        }
        const currentStep = route.steps[route.currentStepNumber - 1];
        if (!currentStep.stepConfig.allowDelegation) {
            throw new common_1.ForbiddenException('Delegation not allowed for this approval step');
        }
        await verifyApproverAuthority(route, delegatorId);
        const delegation = {
            delegationId: generateDelegationId(),
            delegatorId,
            delegateId,
            routeId,
            stepInstanceId: currentStep.stepInstanceId,
            delegatedAt: new Date(),
            expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
            reason,
            status: 'active',
            metadata: {},
        };
        if (!currentStep.delegatedTo)
            currentStep.delegatedTo = [];
        currentStep.delegatedTo.push(delegation);
        // Add delegate to assigned list
        currentStep.assignedTo.push(delegateId);
        const action = {
            actionId: generateActionId(),
            routeId,
            stepInstanceId: currentStep.stepInstanceId,
            action: ApprovalAction.DELEGATE,
            performedBy: delegatorId,
            performedAt: new Date(),
            delegatedTo: delegateId,
            delegationReason: reason,
            metadata: { delegationId: delegation.delegationId },
        };
        currentStep.actions.push(action);
        await auditApprovalEvent('approval_delegated', routeId, delegatorId, {
            delegateId,
            reason,
        });
        await notifyDelegate(delegation, route);
        return delegation;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to delegate approval: ${error.message}`);
    }
}
/**
 * Revoke delegation
 * Cancels active delegation and returns authority
 */
async function revokeDelegation(delegationId, revokedBy) {
    try {
        const delegation = await getDelegation(delegationId);
        if (!delegation) {
            throw new common_1.NotFoundException(`Delegation ${delegationId} not found`);
        }
        if (delegation.delegatorId !== revokedBy) {
            throw new common_1.ForbiddenException('Only the delegator can revoke delegation');
        }
        delegation.status = 'revoked';
        delegation.completedAt = new Date();
        await auditApprovalEvent('delegation_revoked', delegation.routeId, revokedBy, {
            delegationId,
        });
        return delegation;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to revoke delegation: ${error.message}`);
    }
}
// ============================================================================
// AUTO-APPROVAL FUNCTIONS
// ============================================================================
/**
 * Configure auto-approval rules
 * Sets up rules for automatic order approval
 */
async function configureAutoApprovalRule(ruleData, createdBy) {
    try {
        const rule = {
            ruleId: generateRuleId(),
            ruleName: ruleData.ruleName || '',
            description: ruleData.description,
            isActive: ruleData.isActive ?? true,
            priority: ruleData.priority || 1,
            conditions: ruleData.conditions || [],
            applicableOrderTypes: ruleData.applicableOrderTypes || [],
            applicableCustomerGroups: ruleData.applicableCustomerGroups,
            maxOrderAmount: ruleData.maxOrderAmount,
            requireAllConditions: ruleData.requireAllConditions ?? true,
            bypassAuthority: ruleData.bypassAuthority,
            effectiveFrom: ruleData.effectiveFrom || new Date(),
            effectiveTo: ruleData.effectiveTo,
            createdBy,
            metadata: ruleData.metadata,
        };
        await auditApprovalEvent('auto_approval_rule_created', rule.ruleId, createdBy, rule);
        return rule;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to configure auto-approval rule: ${error.message}`);
    }
}
/**
 * Evaluate auto-approval eligibility
 * Checks if order meets auto-approval criteria
 */
async function evaluateAutoApproval(orderData, autoApprovalRules) {
    try {
        const activeRules = autoApprovalRules
            .filter(rule => rule.isActive)
            .filter(rule => {
            const now = new Date();
            return now >= rule.effectiveFrom && (!rule.effectiveTo || now <= rule.effectiveTo);
        })
            .sort((a, b) => a.priority - b.priority);
        for (const rule of activeRules) {
            // Check order type
            if (rule.applicableOrderTypes.length > 0 && !rule.applicableOrderTypes.includes(orderData.orderType)) {
                continue;
            }
            // Check customer group
            if (rule.applicableCustomerGroups && !rule.applicableCustomerGroups.includes(orderData.customerGroup)) {
                continue;
            }
            // Check max amount
            if (rule.maxOrderAmount && orderData.totalAmount > rule.maxOrderAmount) {
                continue;
            }
            // Evaluate conditions
            const conditionsMet = evaluateAutoApprovalConditions(orderData, rule.conditions, rule.requireAllConditions);
            if (conditionsMet) {
                return { eligible: true, matchedRule: rule };
            }
        }
        return { eligible: false };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to evaluate auto-approval: ${error.message}`);
    }
}
/**
 * Apply auto-approval to order
 * Automatically approves order bypassing manual workflow
 */
async function applyAutoApproval(orderId, orderData, matchedRule) {
    try {
        const route = {
            routeId: generateRouteId(),
            workflowId: 'AUTO_APPROVAL',
            orderId,
            orderNumber: orderData.orderNumber,
            orderType: orderData.orderType,
            approvalType: OrderApprovalType.STANDARD_ORDER,
            orderAmount: orderData.totalAmount,
            currency: orderData.currency || 'USD',
            customerId: orderData.customerId,
            requestedBy: orderData.requestedBy,
            currentStepNumber: 1,
            status: ApprovalWorkflowStatus.APPROVED,
            priority: ApprovalPriority.NORMAL,
            steps: [],
            startedAt: new Date(),
            completedAt: new Date(),
            approvedBy: ['AUTO_APPROVAL_SYSTEM'],
            metadata: {
                autoApproved: true,
                ruleId: matchedRule.ruleId,
                ruleName: matchedRule.ruleName,
            },
        };
        await auditApprovalEvent('auto_approved', route.routeId, 'system', {
            ruleId: matchedRule.ruleId,
            orderId,
        });
        return route;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to apply auto-approval: ${error.message}`);
    }
}
// ============================================================================
// ESCALATION FUNCTIONS
// ============================================================================
/**
 * Escalate approval to higher authority
 * Moves approval to escalation authority level
 */
async function escalateApproval(routeId, escalationReason, escalatedBy) {
    try {
        const route = await getApprovalRoute(routeId);
        if (!route) {
            throw new common_1.NotFoundException(`Approval route ${routeId} not found`);
        }
        const currentStep = route.steps[route.currentStepNumber - 1];
        const escalationAuthority = currentStep.stepConfig.escalationAuthority || ApprovalAuthority.DIRECTOR;
        // Create escalation step
        const escalationStep = {
            stepInstanceId: generateStepInstanceId(),
            routeId,
            stepConfig: {
                ...currentStep.stepConfig,
                stepNumber: currentStep.stepConfig.stepNumber + 0.5,
                stepName: `Escalated: ${currentStep.stepConfig.stepName}`,
                authority: escalationAuthority,
                approverRoles: [escalationAuthority],
            },
            status: ApprovalWorkflowStatus.IN_PROGRESS,
            assignedTo: await getApproversByAuthority(escalationAuthority),
            approvedBy: [],
            startedAt: new Date(),
            actions: [],
            metadata: { escalatedFrom: currentStep.stepInstanceId, escalationReason },
        };
        // Insert escalation step
        route.steps.splice(route.currentStepNumber, 0, escalationStep);
        const action = {
            actionId: generateActionId(),
            routeId,
            stepInstanceId: currentStep.stepInstanceId,
            action: ApprovalAction.ESCALATE,
            performedBy: escalatedBy,
            performedAt: new Date(),
            escalatedTo: escalationAuthority,
            escalationReason,
            metadata: {},
        };
        currentStep.actions.push(action);
        currentStep.escalatedAt = new Date();
        currentStep.escalatedTo = escalationAuthority;
        route.status = ApprovalWorkflowStatus.ESCALATED;
        await auditApprovalEvent('approval_escalated', routeId, escalatedBy, {
            escalationAuthority,
            escalationReason,
        });
        await sendEscalationNotifications(route, escalationStep, escalationReason);
        return route;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to escalate approval: ${error.message}`);
    }
}
/**
 * Process timeout escalation
 * Automatically escalates when approval times out
 */
async function processTimeoutEscalation(routeId) {
    try {
        const route = await getApprovalRoute(routeId);
        if (!route) {
            throw new common_1.NotFoundException(`Approval route ${routeId} not found`);
        }
        const currentStep = route.steps[route.currentStepNumber - 1];
        if (!currentStep.timeoutAt || currentStep.timeoutAt > new Date()) {
            throw new common_1.BadRequestException('Step has not timed out');
        }
        const action = {
            actionId: generateActionId(),
            routeId,
            stepInstanceId: currentStep.stepInstanceId,
            action: ApprovalAction.TIMEOUT,
            performedBy: 'system',
            performedAt: new Date(),
            comments: 'Automatic escalation due to timeout',
            metadata: {},
        };
        currentStep.actions.push(action);
        if (currentStep.stepConfig.escalateOnTimeout) {
            return await escalateApproval(routeId, 'Approval timeout', 'system');
        }
        else {
            // Reject on timeout
            return await rejectOrder(routeId, 'system', 'Approval timeout - no response received');
        }
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process timeout escalation: ${error.message}`);
    }
}
/**
 * Configure escalation rules
 * Sets up automatic escalation triggers and paths
 */
async function configureEscalationRule(ruleData) {
    try {
        const rule = {
            ruleId: generateRuleId(),
            ruleName: ruleData.ruleName || '',
            triggerType: ruleData.triggerType || 'timeout',
            triggerCondition: ruleData.triggerCondition,
            timeoutMinutes: ruleData.timeoutMinutes,
            escalateToAuthority: ruleData.escalateToAuthority || ApprovalAuthority.DIRECTOR,
            escalateToUsers: ruleData.escalateToUsers,
            escalateToRoles: ruleData.escalateToRoles,
            notifyOriginalApprovers: ruleData.notifyOriginalApprovers ?? true,
            notifyRequestor: ruleData.notifyRequestor ?? true,
            maxEscalations: ruleData.maxEscalations || 3,
            isActive: ruleData.isActive ?? true,
            metadata: ruleData.metadata,
        };
        return rule;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to configure escalation rule: ${error.message}`);
    }
}
// ============================================================================
// APPROVAL TIMEOUT FUNCTIONS
// ============================================================================
/**
 * Monitor approval timeouts
 * Checks for expired approvals and triggers actions
 */
async function monitorApprovalTimeouts() {
    try {
        const activeRoutes = await getActiveApprovalRoutes();
        const processedRoutes = [];
        const escalatedRoutes = [];
        for (const route of activeRoutes) {
            const currentStep = route.steps[route.currentStepNumber - 1];
            if (currentStep.timeoutAt && currentStep.timeoutAt <= new Date()) {
                if (currentStep.stepConfig.escalateOnTimeout) {
                    await processTimeoutEscalation(route.routeId);
                    escalatedRoutes.push(route.routeId);
                }
                else {
                    await rejectOrder(route.routeId, 'system', 'Approval timeout');
                }
                processedRoutes.push(route.routeId);
            }
            else if (currentStep.timeoutAt) {
                // Send reminder if approaching timeout
                const minutesUntilTimeout = Math.floor((currentStep.timeoutAt.getTime() - Date.now()) / 60000);
                if (minutesUntilTimeout === 60 || minutesUntilTimeout === 30) {
                    await sendTimeoutReminderNotification(route, currentStep, minutesUntilTimeout);
                }
            }
        }
        return { processedRoutes, escalatedRoutes };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to monitor approval timeouts: ${error.message}`);
    }
}
/**
 * Set approval step timeout
 * Configures timeout duration for approval step
 */
async function setApprovalTimeout(stepInstanceId, timeoutMinutes) {
    try {
        const stepInstance = await getStepInstance(stepInstanceId);
        if (!stepInstance) {
            throw new common_1.NotFoundException(`Step instance ${stepInstanceId} not found`);
        }
        stepInstance.timeoutAt = new Date(Date.now() + timeoutMinutes * 60000);
        stepInstance.stepConfig.timeoutMinutes = timeoutMinutes;
        return stepInstance;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to set approval timeout: ${error.message}`);
    }
}
/**
 * Extend approval timeout
 * Adds additional time to existing timeout
 */
async function extendApprovalTimeout(stepInstanceId, additionalMinutes, requestedBy) {
    try {
        const stepInstance = await getStepInstance(stepInstanceId);
        if (!stepInstance) {
            throw new common_1.NotFoundException(`Step instance ${stepInstanceId} not found`);
        }
        if (!stepInstance.timeoutAt) {
            throw new common_1.BadRequestException('No timeout configured for this step');
        }
        stepInstance.timeoutAt = new Date(stepInstance.timeoutAt.getTime() + additionalMinutes * 60000);
        await auditApprovalEvent('timeout_extended', stepInstance.routeId, requestedBy, {
            stepInstanceId,
            additionalMinutes,
            newTimeout: stepInstance.timeoutAt,
        });
        return stepInstance;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to extend approval timeout: ${error.message}`);
    }
}
// ============================================================================
// BUDGET APPROVAL FUNCTIONS
// ============================================================================
/**
 * Validate budget approval authority
 * Checks if approver has budget authority for amount
 */
async function validateBudgetApprovalAuthority(approverId, budgetAmount, departmentId) {
    try {
        const authorityLimits = await getApprovalAuthorityLimits(approverId);
        for (const limit of authorityLimits) {
            if (limit.isActive &&
                limit.orderTypes.includes(OrderApprovalType.BUDGET_APPROVAL) &&
                budgetAmount <= limit.maxOrderAmount) {
                // Check usage limits
                if (limit.periodType !== 'transaction') {
                    if (limit.currentUsage + budgetAmount > limit.maxOrderAmount) {
                        continue;
                    }
                }
                return { authorized: true, authorityLimit: limit };
            }
        }
        return { authorized: false };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to validate budget approval authority: ${error.message}`);
    }
}
/**
 * Approve budget override
 * Authorizes exceeding budget limits
 */
async function approveBudgetOverride(budgetId, orderId, overrideAmount, approverId, reason) {
    try {
        const budgetConfig = await getBudgetConfig(budgetId);
        if (!budgetConfig) {
            throw new common_1.NotFoundException(`Budget ${budgetId} not found`);
        }
        if (!budgetConfig.allowOverBudget) {
            throw new common_1.ForbiddenException('Budget overrides not allowed for this budget');
        }
        // Verify approver has override authority
        const { authorized } = await validateBudgetApprovalAuthority(approverId, overrideAmount, budgetConfig.departmentId);
        if (!authorized) {
            throw new common_1.ForbiddenException('Insufficient authority to approve budget override');
        }
        // Update budget
        budgetConfig.remainingBudget -= overrideAmount;
        await auditApprovalEvent('budget_override_approved', orderId, approverId, {
            budgetId,
            overrideAmount,
            reason,
        });
        return budgetConfig;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to approve budget override: ${error.message}`);
    }
}
/**
 * Check budget availability for approval
 * Validates sufficient budget before approval
 */
async function checkBudgetAvailability(budgetId, requestedAmount) {
    try {
        const budgetConfig = await getBudgetConfig(budgetId);
        if (!budgetConfig) {
            throw new common_1.NotFoundException(`Budget ${budgetId} not found`);
        }
        const available = budgetConfig.remainingBudget >= requestedAmount;
        const requiresOverride = !available && budgetConfig.allowOverBudget;
        return {
            available,
            remainingBudget: budgetConfig.remainingBudget,
            requiresOverride,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to check budget availability: ${error.message}`);
    }
}
// ============================================================================
// PRICE OVERRIDE APPROVAL FUNCTIONS
// ============================================================================
/**
 * Request price override approval
 * Initiates approval for price discount/override
 */
async function requestPriceOverrideApproval(overrideData, requestedBy) {
    try {
        const discountPercent = ((overrideData.standardPrice - overrideData.overridePrice) / overrideData.standardPrice) * 100;
        // Determine required authority based on discount
        let requiredAuthority;
        if (discountPercent <= 20) {
            requiredAuthority = ApprovalAuthority.MANAGER;
        }
        else if (discountPercent <= 40) {
            requiredAuthority = ApprovalAuthority.DIRECTOR;
        }
        else if (discountPercent <= 60) {
            requiredAuthority = ApprovalAuthority.VP;
        }
        else {
            requiredAuthority = ApprovalAuthority.CFO;
        }
        const override = {
            overrideId: generateOverrideId(),
            orderId: overrideData.orderId || '',
            orderLineId: overrideData.orderLineId || '',
            productId: overrideData.productId || '',
            standardPrice: overrideData.standardPrice || 0,
            overridePrice: overrideData.overridePrice || 0,
            discountPercent,
            reason: overrideData.reason || '',
            requestedBy,
            approvalRequired: discountPercent > 10,
            approvalAuthority: requiredAuthority,
            status: ApprovalWorkflowStatus.PENDING,
            metadata: overrideData.metadata,
        };
        await auditApprovalEvent('price_override_requested', override.orderId, requestedBy, override);
        return override;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to request price override approval: ${error.message}`);
    }
}
/**
 * Approve price override
 * Authorizes special pricing or discount
 */
async function approvePriceOverride(overrideId, approverId, comments) {
    try {
        const override = await getPriceOverride(overrideId);
        if (!override) {
            throw new common_1.NotFoundException(`Price override ${overrideId} not found`);
        }
        // Verify approver has authority
        const approverAuthority = await getApproverAuthority(approverId);
        if (getAuthorityLevel(approverAuthority) < getAuthorityLevel(override.approvalAuthority)) {
            throw new common_1.ForbiddenException('Insufficient authority to approve price override');
        }
        override.approvedBy = approverId;
        override.approvedAt = new Date();
        override.status = ApprovalWorkflowStatus.APPROVED;
        await auditApprovalEvent('price_override_approved', override.orderId, approverId, {
            overrideId,
            comments,
        });
        return override;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to approve price override: ${error.message}`);
    }
}
/**
 * Validate price override limits
 * Checks if override is within approver's authority
 */
async function validatePriceOverrideLimits(approverId, discountPercent, orderAmount) {
    try {
        const approverAuthority = await getApproverAuthority(approverId);
        const authorityLimits = await getApprovalAuthorityLimits(approverId);
        for (const limit of authorityLimits) {
            if (limit.isActive &&
                limit.orderTypes.includes(OrderApprovalType.PRICE_OVERRIDE) &&
                orderAmount <= limit.maxOrderAmount) {
                // Check discount percent limits based on authority
                const maxDiscount = getMaxDiscountForAuthority(approverAuthority);
                if (discountPercent <= maxDiscount) {
                    return true;
                }
            }
        }
        return false;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to validate price override limits: ${error.message}`);
    }
}
// ============================================================================
// CREDIT LIMIT OVERRIDE APPROVAL FUNCTIONS
// ============================================================================
/**
 * Request credit limit override approval
 * Initiates approval for exceeding customer credit
 */
async function requestCreditLimitOverrideApproval(overrideData, requestedBy) {
    try {
        const overrideAmount = overrideData.requestedCreditLimit - overrideData.currentCreditLimit;
        // Determine required authority
        let requiredAuthority;
        if (overrideAmount <= 50000) {
            requiredAuthority = ApprovalAuthority.MANAGER;
        }
        else if (overrideAmount <= 100000) {
            requiredAuthority = ApprovalAuthority.DIRECTOR;
        }
        else {
            requiredAuthority = ApprovalAuthority.CFO;
        }
        const override = {
            overrideId: generateOverrideId(),
            customerId: overrideData.customerId || '',
            orderId: overrideData.orderId || '',
            currentCreditLimit: overrideData.currentCreditLimit || 0,
            currentBalance: overrideData.currentBalance || 0,
            requestedCreditLimit: overrideData.requestedCreditLimit || 0,
            overrideAmount,
            reason: overrideData.reason || '',
            requestedBy,
            approvalAuthority: requiredAuthority,
            expiresAt: overrideData.expiresAt,
            status: ApprovalWorkflowStatus.PENDING,
            metadata: overrideData.metadata,
        };
        await auditApprovalEvent('credit_override_requested', override.orderId, requestedBy, override);
        return override;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to request credit limit override: ${error.message}`);
    }
}
/**
 * Approve credit limit override
 * Authorizes temporary or permanent credit increase
 */
async function approveCreditLimitOverride(overrideId, approverId, expiresAt, comments) {
    try {
        const override = await getCreditLimitOverride(overrideId);
        if (!override) {
            throw new common_1.NotFoundException(`Credit limit override ${overrideId} not found`);
        }
        // Verify approver has authority
        const approverAuthority = await getApproverAuthority(approverId);
        if (getAuthorityLevel(approverAuthority) < getAuthorityLevel(override.approvalAuthority)) {
            throw new common_1.ForbiddenException('Insufficient authority to approve credit limit override');
        }
        override.approvedBy = approverId;
        override.approvedAt = new Date();
        override.expiresAt = expiresAt;
        override.status = ApprovalWorkflowStatus.APPROVED;
        await auditApprovalEvent('credit_override_approved', override.orderId, approverId, {
            overrideId,
            comments,
            expiresAt,
        });
        return override;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to approve credit limit override: ${error.message}`);
    }
}
/**
 * Monitor credit override expirations
 * Checks for expired credit overrides and reverts limits
 */
async function monitorCreditOverrideExpirations() {
    try {
        const activeOverrides = await getActiveCreditOverrides();
        const expiredOverrides = [];
        for (const override of activeOverrides) {
            if (override.expiresAt && override.expiresAt <= new Date()) {
                override.status = ApprovalWorkflowStatus.EXPIRED;
                expiredOverrides.push(override.overrideId);
                await auditApprovalEvent('credit_override_expired', override.orderId, 'system', {
                    overrideId: override.overrideId,
                });
            }
        }
        return expiredOverrides;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to monitor credit override expirations: ${error.message}`);
    }
}
// ============================================================================
// NOTIFICATION FUNCTIONS
// ============================================================================
/**
 * Send approval notifications
 * Notifies assigned approvers of pending approval
 */
async function sendApprovalNotifications(route, step) {
    try {
        const workflow = await getWorkflowById(route.workflowId);
        const notificationConfig = workflow.notificationConfig;
        if (!notificationConfig || !notificationConfig.enabled) {
            return;
        }
        const approvers = step.assignedTo;
        const message = {
            subject: `Approval Required: Order ${route.orderNumber}`,
            body: `You have been assigned to approve order ${route.orderNumber} for ${route.orderAmount} ${route.currency}.`,
            priority: route.priority,
            routeId: route.routeId,
            orderId: route.orderId,
        };
        for (const approverId of approvers) {
            for (const channel of notificationConfig.channels) {
                await sendNotification(approverId, channel, message);
            }
        }
    }
    catch (error) {
        common_1.Logger.error(`Failed to send approval notifications: ${error.message}`);
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function generateWorkflowId() {
    return `WF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateStepId() {
    return `STEP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateRouteId() {
    return `ROUTE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateActionId() {
    return `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateDelegationId() {
    return `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateRuleId() {
    return `RULE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateStepInstanceId() {
    return `STPI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function generateOverrideId() {
    return `OVR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function validateWorkflowConfig(workflow) {
    if (!workflow.workflowName || workflow.workflowName.trim() === '') {
        throw new common_1.BadRequestException('Workflow name is required');
    }
    if (!workflow.orderType || workflow.orderType.trim() === '') {
        throw new common_1.BadRequestException('Order type is required');
    }
    if (!workflow.steps || workflow.steps.length === 0) {
        throw new common_1.BadRequestException('At least one approval step is required');
    }
}
function validateStepConfig(step) {
    if (!step.stepName || step.stepName.trim() === '') {
        throw new common_1.BadRequestException('Step name is required');
    }
    if (!step.approverRoles || step.approverRoles.length === 0) {
        throw new common_1.BadRequestException('At least one approver role is required');
    }
    if (step.requiredApprovals < 1) {
        throw new common_1.BadRequestException('Required approvals must be at least 1');
    }
}
function evaluateCondition(condition, data) {
    // Simple condition evaluation - can be enhanced with a proper expression parser
    try {
        const conditionObj = JSON.parse(condition);
        for (const [key, value] of Object.entries(conditionObj)) {
            if (data[key] !== value) {
                return false;
            }
        }
        return true;
    }
    catch {
        return false;
    }
}
function evaluateAutoApprovalConditions(orderData, conditions, requireAll) {
    if (requireAll) {
        return conditions.every(condition => evaluateSingleCondition(orderData, condition));
    }
    else {
        return conditions.some(condition => evaluateSingleCondition(orderData, condition));
    }
}
function evaluateSingleCondition(data, condition) {
    const fieldValue = data[condition.field];
    switch (condition.operator) {
        case 'eq':
            return fieldValue === condition.value;
        case 'ne':
            return fieldValue !== condition.value;
        case 'gt':
            return fieldValue > condition.value;
        case 'gte':
            return fieldValue >= condition.value;
        case 'lt':
            return fieldValue < condition.value;
        case 'lte':
            return fieldValue <= condition.value;
        case 'in':
            return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        case 'nin':
            return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
        case 'contains':
            return typeof fieldValue === 'string' && fieldValue.includes(condition.value);
        default:
            return false;
    }
}
function getAuthorityLevel(authority) {
    const levels = {
        [ApprovalAuthority.MANAGER]: 1,
        [ApprovalAuthority.DIRECTOR]: 2,
        [ApprovalAuthority.VP]: 3,
        [ApprovalAuthority.CFO]: 4,
        [ApprovalAuthority.CEO]: 5,
        [ApprovalAuthority.BOARD]: 6,
        [ApprovalAuthority.CUSTOM]: 0,
    };
    return levels[authority] || 0;
}
function getMaxDiscountForAuthority(authority) {
    const discounts = {
        [ApprovalAuthority.MANAGER]: 20,
        [ApprovalAuthority.DIRECTOR]: 40,
        [ApprovalAuthority.VP]: 60,
        [ApprovalAuthority.CFO]: 80,
        [ApprovalAuthority.CEO]: 100,
        [ApprovalAuthority.BOARD]: 100,
        [ApprovalAuthority.CUSTOM]: 0,
    };
    return discounts[authority] || 0;
}
function calculateExpirationDate(workflow) {
    if (!workflow.timeoutConfig || !workflow.timeoutConfig.enabled) {
        return undefined;
    }
    const totalTimeout = workflow.steps.reduce((sum, step) => sum + (step.timeoutMinutes || workflow.timeoutConfig?.defaultTimeoutMinutes || 0), 0);
    return new Date(Date.now() + totalTimeout * 60000);
}
async function initializeSteps(stepConfigs, routeId) {
    return stepConfigs.map(config => ({
        stepInstanceId: generateStepInstanceId(),
        routeId,
        stepConfig: config,
        status: config.stepNumber === 1 ? ApprovalWorkflowStatus.IN_PROGRESS : ApprovalWorkflowStatus.PENDING,
        assignedTo: [], // Would be populated from config
        approvedBy: [],
        actions: [],
        startedAt: config.stepNumber === 1 ? new Date() : undefined,
        timeoutAt: config.stepNumber === 1 && config.timeoutMinutes ? new Date(Date.now() + config.timeoutMinutes * 60000) : undefined,
    }));
}
async function determineWorkflow(orderData) {
    // Stub - would query workflow configuration based on order attributes
    return {};
}
async function checkAutoApprovalRules(orderData, workflow) {
    if (!workflow.autoApprovalRules || workflow.autoApprovalRules.length === 0) {
        return false;
    }
    const result = await evaluateAutoApproval(orderData, workflow.autoApprovalRules);
    return result.eligible;
}
async function createAutoApprovedRoute(orderId, orderData, requestedBy, workflow) {
    const result = await evaluateAutoApproval(orderData, workflow.autoApprovalRules || []);
    return await applyAutoApproval(orderId, orderData, result.matchedRule);
}
async function completeApprovalWorkflow(routeId, completedBy) {
    const route = await getApprovalRoute(routeId);
    route.status = ApprovalWorkflowStatus.APPROVED;
    route.completedAt = new Date();
    await auditApprovalEvent('workflow_completed', routeId, completedBy, route);
    return route;
}
async function verifyApproverAuthority(route, approverId) {
    const currentStep = route.steps[route.currentStepNumber - 1];
    if (!currentStep.assignedTo.includes(approverId)) {
        const delegations = currentStep.delegatedTo?.filter(d => d.delegateId === approverId && d.status === 'active');
        if (!delegations || delegations.length === 0) {
            throw new common_1.ForbiddenException('User not authorized to approve this step');
        }
    }
}
async function auditApprovalEvent(eventType, routeId, performedBy, eventData) {
    // Stub - would log to audit trail
    common_1.Logger.log(`Audit: ${eventType} - Route: ${routeId} - By: ${performedBy}`);
}
async function sendApprovalStatusNotification(route, status, performedBy) {
    // Stub - would send notifications
}
async function notifyRequestor(route, eventType, data) {
    // Stub - would notify requestor
}
async function notifyDelegate(delegation, route) {
    // Stub - would notify delegate
}
async function sendEscalationNotifications(route, step, reason) {
    // Stub - would send escalation notifications
}
async function sendTimeoutReminderNotification(route, step, minutesRemaining) {
    // Stub - would send reminder
}
async function sendNotification(userId, channel, message) {
    // Stub - would send notification via specified channel
}
async function getWorkflowById(workflowId) {
    // Stub - would fetch from database
    return {};
}
async function getApprovalRoute(routeId) {
    // Stub - would fetch from database
    return {};
}
async function getStepInstance(stepInstanceId) {
    // Stub - would fetch from database
    return {};
}
async function getDelegation(delegationId) {
    // Stub - would fetch from database
    return {};
}
async function getActiveApprovalRoutes() {
    // Stub - would fetch active routes from database
    return [];
}
async function getApproversByAuthority(authority) {
    // Stub - would fetch approvers by authority
    return [];
}
async function getApprovalAuthorityLimits(userId) {
    // Stub - would fetch authority limits
    return [];
}
async function getBudgetConfig(budgetId) {
    // Stub - would fetch budget config
    return {};
}
async function getPriceOverride(overrideId) {
    // Stub - would fetch price override
    return {};
}
async function getCreditLimitOverride(overrideId) {
    // Stub - would fetch credit override
    return {};
}
async function getActiveCreditOverrides() {
    // Stub - would fetch active overrides
    return [];
}
async function getApproverAuthority(approverId) {
    // Stub - would fetch approver's authority level
    return ApprovalAuthority.MANAGER;
}
//# sourceMappingURL=order-approval-workflows-kit.js.map