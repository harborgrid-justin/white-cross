"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExecutionContext = createExecutionContext;
exports.createSystemExecutionContext = createSystemExecutionContext;
exports.validateExecutionContext = validateExecutionContext;
function createExecutionContext(userId, userRole, request, additionalData) {
    return {
        userId,
        userRole,
        ipAddress: request?.ip,
        userAgent: request?.headers?.['user-agent'],
        timestamp: new Date(),
        transactionId: generateTransactionId(),
        correlationId: additionalData?.correlationId,
        metadata: additionalData?.metadata,
    };
}
function createSystemExecutionContext(operation, metadata) {
    return {
        userId: 'system',
        userRole: 'SYSTEM',
        timestamp: new Date(),
        transactionId: generateTransactionId(),
        metadata: {
            ...metadata,
            systemOperation: operation,
        },
    };
}
function generateTransactionId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `txn_${timestamp}_${randomStr}`;
}
function validateExecutionContext(context) {
    if (!context.userId) {
        throw new Error('Execution context must have userId');
    }
    if (!context.userRole) {
        throw new Error('Execution context must have userRole');
    }
    if (!context.timestamp) {
        throw new Error('Execution context must have timestamp');
    }
}
//# sourceMappingURL=execution-context.interface.js.map