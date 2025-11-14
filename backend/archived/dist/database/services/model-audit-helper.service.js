"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelAuditHelper = void 0;
exports.logModelPHIAccess = logModelPHIAccess;
exports.logModelPHIFieldChanges = logModelPHIFieldChanges;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("./audit.service");
let modelAuditHelperInstance = null;
let ModelAuditHelper = class ModelAuditHelper {
    auditService;
    constructor(auditService) {
        this.auditService = auditService;
        modelAuditHelperInstance = this;
    }
    static getInstance() {
        return modelAuditHelperInstance;
    }
    async logPHIAccessFromHook(entityType, entityId, action, changedFields, transaction) {
        if (action === 'UPDATE' && (!changedFields || changedFields.length === 0)) {
            return;
        }
        await this.auditService.logPHIAccess({
            entityType,
            entityId,
            action,
            changedFields,
        }, transaction);
    }
    async logPHIFieldChanges(entityType, entityId, allChangedFields, phiFields, transaction) {
        const changedPHIFields = allChangedFields.filter((field) => phiFields.some((phiField) => field.toLowerCase() === phiField.toLowerCase()));
        if (changedPHIFields.length > 0) {
            await this.auditService.logPHIAccess({
                entityType,
                entityId,
                action: 'UPDATE',
                changedFields: changedPHIFields,
            }, transaction);
        }
    }
};
exports.ModelAuditHelper = ModelAuditHelper;
exports.ModelAuditHelper = ModelAuditHelper = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], ModelAuditHelper);
async function logModelPHIAccess(entityType, entityId, action, changedFields, transaction) {
    const helper = ModelAuditHelper.getInstance();
    if (helper) {
        await helper.logPHIAccessFromHook(entityType, entityId, action, changedFields, transaction);
    }
    else {
        console.log(`[AUDIT] ${entityType} ${entityId} ${action} ${changedFields ? `- Fields: ${changedFields.join(', ')}` : ''} at ${new Date().toISOString()}`);
    }
}
async function logModelPHIFieldChanges(entityType, entityId, allChangedFields, phiFields, transaction) {
    const helper = ModelAuditHelper.getInstance();
    if (helper) {
        await helper.logPHIFieldChanges(entityType, entityId, allChangedFields, phiFields, transaction);
    }
    else {
        const changedPHIFields = allChangedFields.filter((field) => phiFields.some((phiField) => field.toLowerCase() === phiField.toLowerCase()));
        if (changedPHIFields.length > 0) {
            console.log(`[AUDIT] PHI modified for ${entityType} ${entityId} at ${new Date().toISOString()}`);
            console.log(`[AUDIT] Changed PHI fields: ${changedPHIFields.join(', ')}`);
        }
    }
}
//# sourceMappingURL=model-audit-helper.service.js.map