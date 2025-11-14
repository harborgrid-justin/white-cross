"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLModule = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const contact_resolver_1 = require("./resolvers/contact.resolver");
const student_resolver_1 = require("./resolvers/student.resolver");
const health_record_resolver_1 = require("./resolvers/health-record.resolver");
const subscription_resolver_1 = require("./resolvers/subscription.resolver");
const contact_1 = require("../../services/communication/contact");
const student_1 = require("../../services/student");
const medication_1 = require("../../services/medication");
const health_record_1 = require("../../health-record");
const emergency_contact_1 = require("../../services/communication/emergency-contact");
const chronic_condition_1 = require("../../services/chronic-condition");
const incident_report_1 = require("../../incident-report");
const allergy_1 = require("../../health-record/allergy");
const auth_1 = require("../../services/auth");
const graphql_scalars_1 = require("graphql-scalars");
const phi_sanitizer_1 = require("./errors/phi-sanitizer");
const dataloader_factory_1 = require("./dataloaders/dataloader.factory");
const complexity_plugin_1 = require("./plugins/complexity.plugin");
const pubsub_module_1 = require("./pubsub/pubsub.module");
const scalars_1 = require("./scalars");
let GraphQLModule = class GraphQLModule {
};
exports.GraphQLModule = GraphQLModule;
exports.GraphQLModule = GraphQLModule = __decorate([
    (0, common_1.Module)({
        imports: [
            graphql_1.GraphQLModule.forRootAsync({
                driver: apollo_1.ApolloDriver,
                imports: [config_1.ConfigModule],
                useFactory: async (configService, moduleRef) => {
                    const isProduction = configService.get('NODE_ENV') === 'production';
                    const isDocker = configService.get('DOCKER') === 'true';
                    return {
                        autoSchemaFile: isProduction || isDocker ? true : (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                        sortSchema: true,
                        playground: !isProduction,
                        introspection: true,
                        cors: {
                            origin: configService.get('security.cors.origin') || 'http://localhost:5173',
                            credentials: true,
                        },
                        context: ({ req, res }) => {
                            const dataLoaderFactory = moduleRef.get(dataloader_factory_1.DataLoaderFactory, {
                                strict: false,
                            });
                            const loaders = dataLoaderFactory.createLoaders();
                            return {
                                req,
                                res,
                                loaders,
                            };
                        },
                        resolvers: {
                            JSON: graphql_scalars_1.GraphQLJSON,
                        },
                        subscriptions: {
                            'graphql-ws': {
                                path: '/graphql',
                                onConnect: (context) => {
                                    const { connectionParams, extra } = context;
                                    const token = connectionParams?.authorization?.replace('Bearer ', '');
                                    if (!token) {
                                        console.warn('WebSocket connection attempted without token');
                                        throw new Error('Missing authentication token');
                                    }
                                    return { token };
                                },
                                onDisconnect: (context) => {
                                    console.log('Client disconnected from GraphQL subscriptions');
                                },
                            },
                        },
                        formatError: (error) => {
                            const hasPHI = (0, phi_sanitizer_1.containsPHI)(error.message);
                            if (hasPHI) {
                                console.warn('SECURITY ALERT: GraphQL error contained PHI and was sanitized', {
                                    timestamp: new Date().toISOString(),
                                    errorCode: error.extensions?.code,
                                    path: error.path,
                                });
                            }
                            console.error('GraphQL Error:', {
                                message: error.message,
                                code: error.extensions?.code,
                                path: error.path,
                            });
                            const sanitizedError = (0, phi_sanitizer_1.sanitizeGraphQLError)(error);
                            return {
                                message: sanitizedError.message,
                                extensions: {
                                    code: sanitizedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
                                    ...(!isProduction && {
                                        stacktrace: sanitizedError.extensions?.stacktrace,
                                    }),
                                },
                                ...(error.path && { path: error.path }),
                            };
                        },
                        includeDirectives: true,
                        buildSchemaOptions: {
                            dateScalarMode: 'timestamp',
                        },
                    };
                },
                inject: [config_1.ConfigService, core_1.ModuleRef],
            }),
            contact_1.ContactModule,
            student_1.StudentModule,
            medication_1.MedicationModule,
            health_record_1.HealthRecordModule,
            emergency_contact_1.EmergencyContactModule,
            chronic_condition_1.ChronicConditionModule,
            incident_report_1.IncidentReportModule,
            allergy_1.AllergyModule,
            auth_1.AuthModule,
            pubsub_module_1.PubSubModule,
        ],
        providers: [
            contact_resolver_1.ContactResolver,
            student_resolver_1.StudentResolver,
            health_record_resolver_1.HealthRecordResolver,
            subscription_resolver_1.SubscriptionResolver,
            dataloader_factory_1.DataLoaderFactory,
            complexity_plugin_1.ComplexityPlugin,
            scalars_1.DateTimeScalar,
            scalars_1.PhoneNumberScalar,
            scalars_1.EmailAddressScalar,
            scalars_1.UUIDScalar,
            {
                provide: core_1.APP_PIPE,
                useFactory: () => new common_1.ValidationPipe({
                    transform: true,
                    whitelist: true,
                    forbidNonWhitelisted: false,
                    forbidUnknownValues: true,
                    validationError: {
                        target: false,
                        value: false,
                    },
                    exceptionFactory: (errors) => {
                        const sanitizedErrors = errors.map((error) => ({
                            field: error.property,
                            constraints: error.constraints,
                        }));
                        return {
                            statusCode: 400,
                            message: 'Validation failed',
                            errors: sanitizedErrors,
                        };
                    },
                }),
            },
        ],
        exports: [],
    })
], GraphQLModule);
//# sourceMappingURL=graphql.module.js.map