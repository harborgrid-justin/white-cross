"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const websocket_1 = require("./infrastructure/websocket");
const config_1 = require("./config");
const logger_service_1 = require("./common/logging/logger.service");
const sentry_service_1 = require("./infrastructure/monitoring/sentry.service");
const filters_1 = require("./common/exceptions/filters");
const swagger_config_1 = require("./common/config/swagger.config");
const bootstrapLogger = new logger_service_1.LoggerService();
bootstrapLogger.setContext('Bootstrap');
function setupGlobalErrorHandlers(app, configService) {
    const logger = new logger_service_1.LoggerService();
    logger.setContext('GlobalErrorHandler');
    let sentryService = null;
    try {
        sentryService = app.get(sentry_service_1.SentryService);
    }
    catch (error) {
        logger.warn('Sentry service not available for global error handlers');
    }
    process.on('unhandledRejection', (reason, promise) => {
        logger.logWithMetadata('error', 'Unhandled Promise Rejection', {
            reason: reason?.message || String(reason),
            stack: reason?.stack,
            promise: String(promise),
            category: 'SYSTEM',
            severity: 'CRITICAL',
        });
        if (sentryService) {
            sentryService.captureException(reason instanceof Error ? reason : new Error(String(reason)), {
                tags: { errorType: 'unhandledRejection' },
                level: 'fatal',
            });
        }
        if (configService.isProduction) {
            logger.error('Initiating graceful shutdown due to unhandled rejection');
            gracefulShutdown(app, 1);
        }
    });
    process.on('uncaughtException', (error) => {
        logger.logWithMetadata('error', 'Uncaught Exception', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            category: 'SYSTEM',
            severity: 'CRITICAL',
        });
        if (sentryService) {
            sentryService.captureException(error, {
                tags: { errorType: 'uncaughtException' },
                level: 'fatal',
            });
        }
        logger.error('Initiating immediate shutdown due to uncaught exception');
        gracefulShutdown(app, 1);
    });
    process.on('SIGTERM', () => {
        logger.warn('SIGTERM signal received: closing HTTP server');
        gracefulShutdown(app, 0);
    });
    process.on('SIGINT', () => {
        logger.warn('SIGINT signal received: closing HTTP server');
        gracefulShutdown(app, 0);
    });
}
async function gracefulShutdown(app, exitCode) {
    const logger = new logger_service_1.LoggerService();
    logger.setContext('Shutdown');
    try {
        logger.log('Starting graceful shutdown...');
        const shutdownTimeout = 10000;
        const shutdownTimer = setTimeout(() => {
            logger.error('Graceful shutdown timeout exceeded, forcing exit');
            process.exit(1);
        }, shutdownTimeout);
        await app.close();
        clearTimeout(shutdownTimer);
        logger.log('Application closed successfully');
        process.exit(exitCode);
    }
    catch (error) {
        logger.error('Error during graceful shutdown', error instanceof Error ? error : String(error));
        process.exit(1);
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const configService = app.get(config_1.AppConfigService);
    app.use((0, compression_1.default)({
        threshold: 1024,
        level: 6,
        filter: (req, res) => {
            if (req.headers['cache-control']?.includes('no-transform')) {
                return false;
            }
            return compression_1.default.filter(req, res);
        },
    }));
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: [
                    "'self'",
                    'https://cdnjs.cloudflare.com',
                ],
                scriptSrc: [
                    "'self'",
                    'https://cdnjs.cloudflare.com',
                ],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'"],
                fontSrc: ["'self'", 'data:', 'https://cdnjs.cloudflare.com'],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        frameguard: {
            action: 'deny',
        },
        noSniff: true,
        xssFilter: true,
        referrerPolicy: {
            policy: 'strict-origin-when-cross-origin',
        },
        dnsPrefetchControl: {
            allow: false,
        },
        ieNoOpen: true,
        permittedCrossDomainPolicies: {
            permittedPolicies: 'none',
        },
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const sentryService = app.get(sentry_service_1.SentryService);
    app.useGlobalFilters(new filters_1.HipaaExceptionFilter(sentryService));
    bootstrapLogger.log('HIPAA Exception Filter enabled - PHI sanitization active');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
        prefix: 'v',
    });
    app.setGlobalPrefix('api', {
        exclude: [
            'health',
            'health/ready',
            'health/live',
        ],
    });
    const allowedOrigins = configService.corsOrigins;
    if (!allowedOrigins || allowedOrigins.length === 0) {
        throw new Error('CRITICAL SECURITY ERROR: CORS_ORIGIN is not configured. ' +
            'Application cannot start without proper CORS configuration. ' +
            'Please set CORS_ORIGIN in your .env file (e.g., http://localhost:3000 for development).');
    }
    if (configService.isProduction && allowedOrigins.includes('*')) {
        throw new Error('CRITICAL SECURITY ERROR: Wildcard CORS origin (*) is not allowed in production. ' +
            'Please specify exact allowed origins in CORS_ORIGIN.');
    }
    app.enableCors({
        origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'X-CSRF-Token',
        ],
        exposedHeaders: [
            'X-Total-Count',
            'X-Page-Count',
            'X-RateLimit-Limit',
            'X-RateLimit-Remaining',
            'X-RateLimit-Reset',
            'Retry-After',
        ],
        maxAge: 3600,
    });
    const useRedisAdapter = configService.isWebSocketEnabled;
    if (useRedisAdapter) {
        try {
            const redisIoAdapter = new websocket_1.RedisIoAdapter(app);
            await redisIoAdapter.connectToRedis();
            app.useWebSocketAdapter(redisIoAdapter);
            bootstrapLogger.log('Redis adapter enabled for WebSocket horizontal scaling');
        }
        catch (error) {
            bootstrapLogger.error('Failed to initialize Redis adapter', error instanceof Error ? error : String(error));
            if (configService.isProduction) {
                throw new Error('CRITICAL ERROR: Redis adapter failed to initialize in production. ' +
                    'WebSockets cannot scale horizontally without Redis. ' +
                    'Please ensure Redis is running and accessible.');
            }
            else {
                bootstrapLogger.warn('WARNING: Falling back to default Socket.IO adapter in development. ' +
                    'WebSockets will NOT work across multiple server instances.');
            }
        }
    }
    else {
        bootstrapLogger.warn('Redis adapter disabled. ' +
            'WebSockets will NOT work across multiple server instances.');
    }
    const isProduction = configService.get('NODE_ENV') === 'production';
    const swaggerEnabledInProduction = configService.get('SWAGGER_ENABLED_IN_PRODUCTION', 'false') === 'true';
    const enableSwagger = !isProduction || swaggerEnabledInProduction;
    if (enableSwagger) {
        bootstrapLogger.log('🔍 Enabling Swagger API Documentation...');
        const config = (0, swagger_config_1.createSwaggerConfig)();
        const document = swagger_1.SwaggerModule.createDocument(app, config, {
            operationIdFactory: (_controllerKey, methodKey) => methodKey,
            deepScanRoutes: true,
            extraModels: swagger_config_1.ERROR_RESPONSE_DTOS,
        });
        (0, swagger_config_1.addGlobalSchemas)(document);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                displayRequestDuration: true,
                docExpansion: 'none',
                filter: true,
                showRequestHeaders: true,
                tryItOutEnabled: true,
            },
            customSiteTitle: configService.get('SWAGGER_UI_TITLE') || 'White Cross Health API Documentation',
            customfavIcon: '/favicon.ico',
            customJs: [
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
            ],
            customCssUrl: [
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
            ],
        });
        app.getHttpAdapter().get('/api/docs-json', (_req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.json(document);
        });
        bootstrapLogger.log(`✅ Swagger UI available at: ${configService.get('NODE_ENV') === 'development' ? 'http://localhost:' + configService.get('PORT') : ''}/api/docs`);
    }
    else {
        bootstrapLogger.warn('⚠️  Swagger API Documentation DISABLED in production for security');
        bootstrapLogger.warn('    Set SWAGGER_ENABLED_IN_PRODUCTION=true to enable (not recommended)');
    }
    configService.validateCriticalConfig();
    const port = configService.port;
    if (isNaN(port) || port < 1024 || port > 65535) {
        throw new Error(`CONFIGURATION ERROR: Invalid PORT value "${port}". ` +
            `Port must be a number between 1024 and 65535.`);
    }
    setupGlobalErrorHandlers(app, configService);
    await app.listen(port);
    bootstrapLogger.log('='.repeat(80));
    bootstrapLogger.log('White Cross NestJS Backend Started');
    bootstrapLogger.log('='.repeat(80));
    bootstrapLogger.logWithMetadata('info', 'Server Configuration', {
        environment: configService.environment,
        port,
        serverUrl: `http://localhost:${port}`,
        apiDocsUrl: `http://localhost:${port}/api/docs`,
        healthCheckUrl: `http://localhost:${port}/api/health`,
        nodeVersion: process.version,
        processId: process.pid,
    });
    bootstrapLogger.log('='.repeat(80));
}
bootstrap().catch((error) => {
    bootstrapLogger.logWithMetadata('error', 'Fatal error during bootstrap', {
        message: error.message,
        stack: error.stack,
        category: 'SYSTEM',
        severity: 'CRITICAL',
    });
    process.exit(1);
});
//# sourceMappingURL=main.js.map