"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const logger_service_1 = require("../common/logging/logger.service");
const services_1 = require("./services");
const uow_1 = require("./uow");
const models_1 = require("./models");
const impl_1 = require("./repositories/impl");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            sequelize_1.SequelizeModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const databaseUrl = configService.get('DATABASE_URL');
                    const isProduction = configService.get('NODE_ENV') === 'production';
                    const isDevelopment = configService.get('NODE_ENV') === 'development';
                    if (databaseUrl) {
                        return {
                            dialect: 'postgres',
                            uri: databaseUrl,
                            autoLoadModels: true,
                            synchronize: configService.get('database.synchronize', false),
                            logging: isProduction
                                ? (sql, timing) => {
                                    const logger = new logger_service_1.LoggerService();
                                    logger.log(`${sql.substring(0, 200)}${sql.length > 200 ? '...' : ''}`, {
                                        context: 'DatabaseModule',
                                    });
                                    if (timing && timing > 1000) {
                                        console.warn(`SLOW QUERY (${timing}ms): ${sql.substring(0, 200)}...`);
                                    }
                                }
                                : isDevelopment
                                    ? (sql) => {
                                        const logger = new logger_service_1.LoggerService();
                                        logger.debug(`${sql}`, { context: 'DatabaseModule' });
                                    }
                                    : false,
                            benchmark: true,
                            define: {
                                timestamps: true,
                                underscored: false,
                                freezeTableName: true,
                            },
                            pool: {
                                max: configService.get('DB_POOL_MAX', isProduction ? 20 : 10),
                                min: configService.get('DB_POOL_MIN', isProduction ? 5 : 2),
                                acquire: configService.get('DB_ACQUIRE_TIMEOUT', 60000),
                                idle: configService.get('DB_IDLE_TIMEOUT', 10000),
                                evict: 1000,
                                handleDisconnects: true,
                                validate: (connection) => {
                                    return (connection &&
                                        typeof connection === 'object' &&
                                        '_closed' in connection &&
                                        !connection._closed);
                                },
                            },
                            retry: {
                                match: [
                                    /ETIMEDOUT/,
                                    /EHOSTUNREACH/,
                                    /ECONNRESET/,
                                    /ECONNREFUSED/,
                                    /EHOSTDOWN/,
                                    /ENETDOWN/,
                                    /ENETUNREACH/,
                                    /EAI_AGAIN/,
                                    /connection is insecure/,
                                    /SSL connection has been closed unexpectedly/,
                                ],
                                max: 5,
                            },
                            dialectOptions: {
                                ...(databaseUrl.includes('sslmode=require')
                                    ? {
                                        ssl: {
                                            require: true,
                                            rejectUnauthorized: isProduction,
                                        },
                                    }
                                    : {}),
                                application_name: 'white-cross-app',
                                statement_timeout: 60000,
                                idle_in_transaction_session_timeout: 30000,
                            },
                        };
                    }
                    else {
                        const sslEnabled = configService.get('database.ssl', false) ||
                            configService.get('DB_SSL', false);
                        return {
                            dialect: 'postgres',
                            host: configService.get('database.host', 'localhost'),
                            port: configService.get('database.port', 5432),
                            username: configService.get('database.username', 'postgres'),
                            password: configService.get('database.password'),
                            database: configService.get('database.database', 'whitecross'),
                            autoLoadModels: true,
                            logging: isProduction
                                ? (sql, timing) => {
                                    const logger = new logger_service_1.LoggerService();
                                    logger.log(`${sql.substring(0, 200)}${sql.length > 200 ? '...' : ''}`, {
                                        context: 'DatabaseModule',
                                    });
                                    if (timing && timing > 1000) {
                                        console.warn(`SLOW QUERY (${timing}ms): ${sql.substring(0, 200)}...`);
                                    }
                                }
                                : isDevelopment
                                    ? (sql) => {
                                        const logger = new logger_service_1.LoggerService();
                                        logger.debug(`${sql}`, { context: 'DatabaseModule' });
                                    }
                                    : false,
                            benchmark: true,
                            define: {
                                timestamps: true,
                                underscored: false,
                                freezeTableName: true,
                            },
                            pool: {
                                max: configService.get('DB_POOL_MAX', isProduction ? 20 : 10),
                                min: configService.get('DB_POOL_MIN', isProduction ? 5 : 2),
                                acquire: configService.get('DB_ACQUIRE_TIMEOUT', 60000),
                                idle: configService.get('DB_IDLE_TIMEOUT', 10000),
                                evict: 1000,
                                handleDisconnects: true,
                                validate: (connection) => {
                                    return connection && !connection._closed;
                                },
                            },
                            retry: {
                                match: [
                                    /ETIMEDOUT/,
                                    /EHOSTUNREACH/,
                                    /ECONNRESET/,
                                    /ECONNREFUSED/,
                                    /EHOSTDOWN/,
                                    /ENETDOWN/,
                                    /ENETUNREACH/,
                                    /EAI_AGAIN/,
                                    /connection is insecure/,
                                    /SSL connection has been closed unexpectedly/,
                                ],
                                max: 5,
                            },
                            dialectOptions: {
                                ...(sslEnabled
                                    ? {
                                        ssl: {
                                            require: true,
                                            rejectUnauthorized: isProduction,
                                        },
                                    }
                                    : {}),
                                application_name: 'white-cross-app',
                                statement_timeout: 60000,
                                idle_in_transaction_session_timeout: 30000,
                            },
                        };
                    }
                },
                inject: [config_1.ConfigService],
            }),
            sequelize_1.SequelizeModule.forFeature([
                models_1.AuditLog,
                models_1.Student,
                models_1.User,
                models_1.ApiKey,
                models_1.Contact,
                models_1.District,
                models_1.School,
                models_1.EmergencyContact,
                models_1.AcademicTranscript,
                models_1.Appointment,
                models_1.AppointmentReminder,
                models_1.AppointmentWaitlist,
                models_1.GrowthTracking,
                models_1.HealthRecord,
                models_1.HealthScreening,
                models_1.Immunization,
                models_1.LabResults,
                models_1.MedicalHistory,
                models_1.MentalHealthRecord,
                models_1.TreatmentPlan,
                models_1.VitalSigns,
                models_1.Prescription,
                models_1.ClinicVisit,
                models_1.ClinicalNote,
                models_1.ClinicalProtocol,
                models_1.FollowUpAction,
                models_1.FollowUpAppointment,
                models_1.Allergy,
                models_1.ChronicCondition,
                models_1.StudentMedication,
                models_1.IncidentReport,
                models_1.MedicationLog,
                models_1.WitnessStatement,
                models_1.Medication,
                models_1.Vaccination,
                models_1.DrugCatalog,
                models_1.DrugInteraction,
                models_1.StudentDrugAllergy,
                models_1.AnalyticsReport,
                models_1.HealthMetricSnapshot,
                models_1.InventoryItem,
                models_1.InventoryTransaction,
                models_1.IpRestriction,
                models_1.MaintenanceLog,
                models_1.PurchaseOrder,
                models_1.PurchaseOrderItem,
                models_1.Vendor,
                models_1.EmergencyBroadcast,
                models_1.Message,
                models_1.MessageDelivery,
                models_1.MessageTemplate,
                models_1.PushNotification,
                models_1.DeviceToken,
                models_1.Supplier,
                models_1.SyncState,
                models_1.SystemConfig,
                models_1.LoginAttempt,
                models_1.Session,
                models_1.SecurityIncident,
                models_1.ThreatDetection,
                models_1.Webhook,
                models_1.License,
                models_1.ConfigurationHistory,
                models_1.BackupLog,
                models_1.PerformanceMetric,
                models_1.Document,
                models_1.DocumentSignature,
                models_1.DocumentAuditTrail,
                models_1.ConsentForm,
                models_1.ConsentSignature,
                models_1.ComplianceReport,
                models_1.ComplianceChecklistItem,
                models_1.ComplianceViolation,
                models_1.PolicyDocument,
                models_1.PolicyAcknowledgment,
                models_1.DataRetentionPolicy,
                models_1.PhiDisclosure,
                models_1.PhiDisclosureAudit,
                models_1.RemediationAction,
                models_1.Alert,
                models_1.AlertRule,
                models_1.AlertPreferences,
                models_1.DeliveryLog,
                models_1.IntegrationConfig,
                models_1.IntegrationLog,
                models_1.SyncSession,
                models_1.SyncConflict,
                models_1.SyncQueueItem,
                models_1.SISSyncConflict,
                models_1.BudgetCategory,
                models_1.BudgetTransaction,
                models_1.ReportTemplate,
                models_1.ReportExecution,
                models_1.ReportSchedule,
                models_1.TrainingModule,
            ]),
        ],
        providers: [
            {
                provide: 'ICacheManager',
                useClass: services_1.CacheService,
            },
            {
                provide: 'IAuditLogger',
                useClass: services_1.AuditService,
            },
            {
                provide: 'IUnitOfWork',
                useClass: uow_1.SequelizeUnitOfWorkService,
            },
            services_1.AuditService,
            services_1.AuditHelperService,
            services_1.AuditLoggingService,
            services_1.AuditQueryService,
            services_1.AuditStatisticsService,
            services_1.AuditComplianceService,
            services_1.AuditExportService,
            services_1.AuditRetentionService,
            services_1.ModelAuditHelper,
            services_1.ConnectionMonitorService,
            services_1.QueryLoggerService,
            services_1.QueryCacheService,
            services_1.CacheMonitoringService,
            services_1.MaterializedViewService,
            impl_1.StudentRepository,
            impl_1.AcademicTranscriptRepository,
            impl_1.ConsentFormRepository,
            impl_1.ConsentSignatureRepository,
            impl_1.ComplianceChecklistItemRepository,
            impl_1.ComplianceReportRepository,
            impl_1.PolicyDocumentRepository,
            impl_1.DataRetentionPolicyRepository,
            impl_1.ComplianceViolationRepository,
            impl_1.EmergencyBroadcastRepository,
            impl_1.AppointmentRepository,
            impl_1.HealthRecordRepository,
            impl_1.MedicationLogRepository,
            impl_1.IncidentReportRepository,
            impl_1.AllergyRepository,
            impl_1.ChronicConditionRepository,
            impl_1.AppointmentReminderRepository,
            impl_1.AppointmentWaitlistRepository,
        ],
        exports: [
            sequelize_1.SequelizeModule,
            'ICacheManager',
            'IAuditLogger',
            'IUnitOfWork',
            services_1.AuditService,
            services_1.AuditHelperService,
            services_1.AuditLoggingService,
            services_1.AuditQueryService,
            services_1.AuditStatisticsService,
            services_1.AuditComplianceService,
            services_1.AuditExportService,
            services_1.AuditRetentionService,
            services_1.ModelAuditHelper,
            services_1.ConnectionMonitorService,
            services_1.QueryLoggerService,
            services_1.QueryCacheService,
            services_1.CacheMonitoringService,
            services_1.MaterializedViewService,
            impl_1.StudentRepository,
            impl_1.AcademicTranscriptRepository,
            impl_1.ConsentFormRepository,
            impl_1.ConsentSignatureRepository,
            impl_1.ComplianceChecklistItemRepository,
            impl_1.ComplianceReportRepository,
            impl_1.PolicyDocumentRepository,
            impl_1.DataRetentionPolicyRepository,
            impl_1.ComplianceViolationRepository,
            impl_1.EmergencyBroadcastRepository,
            impl_1.AppointmentRepository,
            impl_1.AppointmentReminderRepository,
            impl_1.AppointmentWaitlistRepository,
            impl_1.HealthRecordRepository,
            impl_1.MedicationLogRepository,
            impl_1.IncidentReportRepository,
            impl_1.AllergyRepository,
            impl_1.ChronicConditionRepository,
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map