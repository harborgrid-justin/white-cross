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
exports.AppModule = exports.GlobalAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const throttler_storage_redis_1 = require("@nest-lab/throttler-storage-redis");
const ioredis_1 = require("ioredis");
const database_module_1 = require("./database/database.module");
const auth_1 = require("./services/auth");
const access_control_1 = require("./services/access-control");
const security_1 = require("./middleware/security");
const health_record_1 = require("./health-record");
const user_1 = require("./services/user");
let GlobalAuthGuard = class GlobalAuthGuard extends auth_1.JwtAuthGuard {
    constructor(reflector, tokenBlacklistService) {
        super(reflector, tokenBlacklistService);
    }
};
exports.GlobalAuthGuard = GlobalAuthGuard;
exports.GlobalAuthGuard = GlobalAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [core_1.Reflector, auth_1.TokenBlacklistService])
], GlobalAuthGuard);
const response_transform_interceptor_1 = require("./common/interceptors/response-transform.interceptor");
const config_2 = require("./config");
const analytics_1 = require("./analytics");
const chronic_condition_1 = require("./services/chronic-condition");
const budget_1 = require("./services/budget");
const administration_1 = require("./services/administration");
const audit_1 = require("./services/audit");
const contact_1 = require("./services/communication/contact");
const compliance_1 = require("./compliance");
const clinical_1 = require("./services/clinical");
const incident_report_1 = require("./incident-report");
const integration_1 = require("./integration");
const integrations_1 = require("./integrations");
const security_2 = require("./services/security");
const report_1 = require("./report");
const mobile_1 = require("./services/mobile");
const pdf_1 = require("./pdf");
const academic_transcript_1 = require("./services/academic-transcript");
const ai_search_1 = require("./ai-search");
const alerts_1 = require("./services/alerts");
const features_1 = require("./features");
const health_domain_1 = require("./health-domain");
const interfaces_module_1 = require("./interfaces/interfaces.module");
const shared_module_1 = require("./common/shared.module");
const dashboard_1 = require("./services/dashboard");
const advanced_features_1 = require("./advanced-features");
const configuration_1 = require("./configuration");
const emergency_broadcast_1 = require("./services/communication/emergency-broadcast");
const grade_transition_1 = require("./grade-transition");
const enterprise_features_1 = require("./enterprise-features");
const health_metrics_1 = require("./health-metrics");
const medication_interaction_1 = require("./medication-interaction");
const health_risk_assessment_1 = require("./health-risk-assessment");
const emergency_contact_1 = require("./services/communication/emergency-contact");
const email_1 = require("./infrastructure/email");
const sms_1 = require("./infrastructure/sms");
const monitoring_1 = require("./infrastructure/monitoring");
const jobs_1 = require("./infrastructure/jobs");
const websocket_1 = require("./infrastructure/websocket");
const graphql_1 = require("./infrastructure/graphql");
const core_2 = require("./middleware/core");
const workers_1 = require("./services/workers");
const medication_1 = require("./services/medication");
const student_1 = require("./services/student");
const appointment_1 = require("./services/appointment");
const discovery_1 = require("./discovery");
const commands_1 = require("./commands");
const core_3 = require("./core");
const sentry_module_1 = require("./infrastructure/monitoring/sentry.module");
const vaccinations_module_1 = require("./services/vaccinations/vaccinations.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            core_3.CoreModule,
            sentry_module_1.SentryModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                expandVariables: true,
                envFilePath: [`.env.local`, `.env`],
                load: [
                    config_2.appConfig,
                    config_2.databaseConfig,
                    config_2.authConfig,
                    config_2.securityConfig,
                    config_2.redisConfig,
                    config_2.awsConfig,
                    config_2.cacheConfig,
                    config_2.queueConfig,
                ],
                validationSchema: config_2.validationSchema,
                validationOptions: {
                    abortEarly: false,
                    allowUnknown: true,
                },
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const redisConfig = configService.get('redis.cache');
                    const throttleConfig = configService.get('app.throttle');
                    const redisClient = new ioredis_1.Redis({
                        host: redisConfig.host,
                        port: redisConfig.port,
                        password: redisConfig.password,
                        username: redisConfig.username,
                        db: 0,
                        keyPrefix: 'throttler:',
                        retryStrategy: (times) => {
                            return Math.min(times * 50, 2000);
                        },
                        maxRetriesPerRequest: 3,
                    });
                    return {
                        throttlers: [
                            {
                                name: 'short',
                                ttl: throttleConfig.short.ttl,
                                limit: throttleConfig.short.limit,
                            },
                            {
                                name: 'medium',
                                ttl: throttleConfig.medium.ttl,
                                limit: throttleConfig.medium.limit,
                            },
                            {
                                name: 'long',
                                ttl: throttleConfig.long.ttl,
                                limit: throttleConfig.long.limit,
                            },
                        ],
                        storage: new throttler_storage_redis_1.ThrottlerStorageRedisService(redisClient),
                    };
                },
            }),
            database_module_1.DatabaseModule,
            auth_1.AuthModule,
            core_2.CoreMiddlewareModule,
            security_2.SecurityModule,
            access_control_1.AccessControlModule,
            monitoring_1.MonitoringModule,
            email_1.EmailModule,
            sms_1.SmsModule,
            jobs_1.JobsModule,
            websocket_1.WebSocketModule,
            graphql_1.GraphQLModule,
            workers_1.WorkersModule,
            user_1.UserModule,
            health_record_1.HealthRecordModule,
            chronic_condition_1.ChronicConditionModule,
            budget_1.BudgetModule,
            administration_1.AdministrationModule,
            configuration_1.ConfigurationModule,
            audit_1.AuditModule,
            contact_1.ContactModule,
            compliance_1.ComplianceModule,
            clinical_1.ClinicalModule,
            incident_report_1.IncidentReportModule,
            integration_1.IntegrationModule,
            integrations_1.IntegrationsModule,
            mobile_1.MobileModule,
            pdf_1.PdfModule,
            academic_transcript_1.AcademicTranscriptModule,
            ai_search_1.AiSearchModule,
            alerts_1.AlertsModule,
            features_1.FeaturesModule,
            health_domain_1.HealthDomainModule,
            interfaces_module_1.InterfacesModule,
            shared_module_1.SharedModule,
            emergency_broadcast_1.EmergencyBroadcastModule,
            health_risk_assessment_1.HealthRiskAssessmentModule,
            grade_transition_1.GradeTransitionModule,
            health_metrics_1.HealthMetricsModule,
            medication_interaction_1.MedicationInteractionModule,
            health_risk_assessment_1.HealthRiskAssessmentModule,
            emergency_contact_1.EmergencyContactModule,
            medication_1.MedicationModule,
            student_1.StudentModule,
            appointment_1.AppointmentModule,
            vaccinations_module_1.VaccinationsModule,
            ...(0, config_2.loadConditionalModules)([
                {
                    module: analytics_1.AnalyticsModule,
                    condition: config_2.FeatureFlags.isAnalyticsEnabled,
                    description: 'Analytics Module',
                },
                {
                    module: report_1.ReportModule,
                    condition: config_2.FeatureFlags.isReportingEnabled,
                    description: 'Report Module',
                },
                {
                    module: dashboard_1.DashboardModule,
                    condition: config_2.FeatureFlags.isDashboardEnabled,
                    description: 'Dashboard Module',
                },
                {
                    module: advanced_features_1.AdvancedFeaturesModule,
                    condition: config_2.FeatureFlags.isAdvancedFeaturesEnabled,
                    description: 'Advanced Features Module',
                },
                {
                    module: enterprise_features_1.EnterpriseFeaturesModule,
                    condition: config_2.FeatureFlags.isEnterpriseEnabled,
                    description: 'Enterprise Features Module',
                },
                {
                    module: discovery_1.DiscoveryExampleModule,
                    condition: config_2.FeatureFlags.isDiscoveryEnabled,
                    description: 'Discovery Module (development only)',
                },
                {
                    module: commands_1.CommandsModule,
                    condition: config_2.FeatureFlags.isCliModeEnabled,
                    description: 'Commands Module (CLI mode)',
                },
            ]),
        ],
        controllers: [],
        providers: [
            config_2.AppConfigService,
            core_1.Reflector,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_transform_interceptor_1.ResponseTransformInterceptor,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: access_control_1.IpRestrictionGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useFactory: (reflector, tokenBlacklistService) => {
                    return new GlobalAuthGuard(reflector, tokenBlacklistService);
                },
                inject: [core_1.Reflector, auth_1.TokenBlacklistService],
            },
            {
                provide: core_1.APP_GUARD,
                useClass: security_1.CsrfGuard,
            },
        ],
        exports: [
            config_2.AppConfigService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map