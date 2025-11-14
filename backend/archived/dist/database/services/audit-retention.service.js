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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditRetentionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const audit_log_model_1 = require("../models/audit-log.model");
const base_1 = require("../../common/base");
let AuditRetentionService = class AuditRetentionService extends base_1.BaseService {
    auditLogModel;
    constructor(auditLogModel) {
        super("AuditRetentionService");
        this.auditLogModel = auditLogModel;
    }
    async executeRetentionPolicy(dryRun = true) {
        try {
            const now = new Date();
            const details = {};
            const hipaaRetentionDate = new Date(now);
            hipaaRetentionDate.setFullYear(hipaaRetentionDate.getFullYear() - 7);
            const hipaaExpired = await this.auditLogModel.findAll({
                where: {
                    complianceType: audit_log_model_1.ComplianceType.HIPAA,
                    createdAt: { [sequelize_2.Op.lt]: hipaaRetentionDate },
                },
            });
            details['HIPAA_expired'] = hipaaExpired.length;
            const ferpaRetentionDate = new Date(now);
            ferpaRetentionDate.setFullYear(ferpaRetentionDate.getFullYear() - 5);
            const ferpaExpired = await this.auditLogModel.findAll({
                where: {
                    complianceType: audit_log_model_1.ComplianceType.FERPA,
                    createdAt: { [sequelize_2.Op.lt]: ferpaRetentionDate },
                },
            });
            details['FERPA_expired'] = ferpaExpired.length;
            const generalRetentionDate = new Date(now);
            generalRetentionDate.setFullYear(generalRetentionDate.getFullYear() - 3);
            const generalExpired = await this.auditLogModel.findAll({
                where: {
                    complianceType: audit_log_model_1.ComplianceType.GENERAL,
                    createdAt: { [sequelize_2.Op.lt]: generalRetentionDate },
                },
            });
            details['GENERAL_expired'] = generalExpired.length;
            const totalToDelete = hipaaExpired.length + ferpaExpired.length + generalExpired.length;
            const totalLogs = await this.auditLogModel.count();
            const retained = totalLogs - totalToDelete;
            if (!dryRun && totalToDelete > 0) {
                await this.auditLogModel.destroy({
                    where: {
                        [sequelize_2.Op.or]: [
                            {
                                complianceType: audit_log_model_1.ComplianceType.HIPAA,
                                createdAt: { [sequelize_2.Op.lt]: hipaaRetentionDate },
                            },
                            {
                                complianceType: audit_log_model_1.ComplianceType.FERPA,
                                createdAt: { [sequelize_2.Op.lt]: ferpaRetentionDate },
                            },
                            {
                                complianceType: audit_log_model_1.ComplianceType.GENERAL,
                                createdAt: { [sequelize_2.Op.lt]: generalRetentionDate },
                            },
                        ],
                    },
                });
                this.logInfo(`Retention policy executed: deleted ${totalToDelete} logs, retained ${retained} logs`);
            }
            else {
                this.logInfo(`Retention policy dry run: would delete ${totalToDelete} logs, retain ${retained} logs`);
            }
            return {
                deleted: totalToDelete,
                retained,
                details,
            };
        }
        catch (error) {
            this.logError(`Failed to execute retention policy: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.AuditRetentionService = AuditRetentionService;
exports.AuditRetentionService = AuditRetentionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(audit_log_model_1.AuditLog)),
    __metadata("design:paramtypes", [Object])
], AuditRetentionService);
//# sourceMappingURL=audit-retention.service.js.map