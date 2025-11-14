"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const compliance_controller_1 = require("./compliance.controller");
const compliance_service_1 = require("./compliance.service");
const database_module_1 = require("../database/database.module");
const audit_module_1 = require("../services/audit/audit.module");
const consent_service_1 = require("./services/consent.service");
const compliance_report_service_1 = require("./services/compliance-report.service");
const checklist_service_1 = require("./services/checklist.service");
const policy_service_1 = require("./services/policy.service");
const data_retention_service_1 = require("./services/data-retention.service");
const violation_service_1 = require("./services/violation.service");
const statistics_service_1 = require("./services/statistics.service");
const compliance_report_repository_1 = require("../database/repositories/impl/compliance-report.repository");
const checklist_repository_1 = require("./repositories/checklist.repository");
const policy_repository_1 = require("./repositories/policy.repository");
const data_retention_repository_1 = require("./repositories/data-retention.repository");
const violation_repository_1 = require("./repositories/violation.repository");
const models_1 = require("../database/models");
const models_2 = require("../database/models");
const models_3 = require("../database/models");
const models_4 = require("../database/models");
const models_5 = require("../database/models");
const models_6 = require("../database/models");
const models_7 = require("../database/models");
const models_8 = require("../database/models");
const models_9 = require("../database/models");
const models_10 = require("../database/models");
let ComplianceModule = class ComplianceModule {
};
exports.ComplianceModule = ComplianceModule;
exports.ComplianceModule = ComplianceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            audit_module_1.AuditModule,
            sequelize_1.SequelizeModule.forFeature([
                models_1.AuditLog,
                models_2.ConsentForm,
                models_3.ConsentSignature,
                models_4.ComplianceReport,
                models_5.ComplianceChecklistItem,
                models_6.PolicyDocument,
                models_7.PolicyAcknowledgment,
                models_8.DataRetentionPolicy,
                models_9.ComplianceViolation,
                models_10.RemediationAction,
            ]),
        ],
        controllers: [compliance_controller_1.ComplianceController],
        providers: [
            compliance_service_1.ComplianceService,
            consent_service_1.ConsentService,
            compliance_report_service_1.ComplianceReportService,
            checklist_service_1.ChecklistService,
            policy_service_1.PolicyService,
            data_retention_service_1.DataRetentionService,
            violation_service_1.ViolationService,
            statistics_service_1.StatisticsService,
            {
                provide: 'ComplianceReportRepository',
                useExisting: compliance_report_repository_1.ComplianceReportRepository,
            },
            {
                provide: 'DatabaseComplianceReportRepository',
                useExisting: compliance_report_repository_1.ComplianceReportRepository,
            },
            checklist_repository_1.ChecklistRepository,
            policy_repository_1.PolicyRepository,
            data_retention_repository_1.DataRetentionRepository,
            violation_repository_1.ViolationRepository,
        ],
        exports: [
            compliance_service_1.ComplianceService,
            consent_service_1.ConsentService,
            compliance_report_service_1.ComplianceReportService,
            checklist_service_1.ChecklistService,
            policy_service_1.PolicyService,
            data_retention_service_1.DataRetentionService,
            violation_service_1.ViolationService,
            statistics_service_1.StatisticsService,
        ],
    })
], ComplianceModule);
//# sourceMappingURL=compliance.module.js.map