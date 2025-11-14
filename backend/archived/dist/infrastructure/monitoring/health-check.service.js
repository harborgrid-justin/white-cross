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
exports.HealthCheckService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("@nestjs/config");
const health_check_interface_1 = require("./interfaces/health-check.interface");
let HealthCheckService = class HealthCheckService extends base_1.BaseService {
    sequelize;
    configService;
    cacheService;
    websocketService;
    queueManagerService;
    circuitBreakerService;
    failedJobsThreshold = 100;
    constructor(sequelize, configService) {
        super("HealthCheckService");
        this.sequelize = sequelize;
        this.configService = configService;
        this.failedJobsThreshold = this.configService.get('ALERT_FAILED_JOBS_THRESHOLD', 100);
    }
    setCacheService(cacheService) {
        this.cacheService = cacheService;
        this.logInfo('Cache service registered for health monitoring');
    }
    setWebSocketService(websocketService) {
        this.websocketService = websocketService;
        this.logInfo('WebSocket service registered for health monitoring');
    }
    setQueueManagerService(queueManagerService) {
        this.queueManagerService = queueManagerService;
        this.logInfo('Queue manager service registered for health monitoring');
    }
    setCircuitBreakerService(circuitBreakerService) {
        this.circuitBreakerService = circuitBreakerService;
        this.logInfo('Circuit breaker service registered for health monitoring');
    }
    async checkDatabaseHealth() {
        try {
            try {
                await this.sequelize.authenticate();
            }
            catch (authError) {
                return {
                    status: health_check_interface_1.HealthStatus.UNHEALTHY,
                    message: 'Database connection is not initialized',
                };
            }
            const startTime = Date.now();
            await this.sequelize.query('SELECT 1 as health_check');
            const responseTime = Date.now() - startTime;
            const pool = this.sequelize.connectionManager.pool;
            const poolSize = pool?.size || pool?.max || 10;
            const idleConnections = pool?.available || pool?.idle || 0;
            const activeConnections = pool?.using || poolSize - idleConnections;
            const poolUsage = poolSize > 0 ? (activeConnections / poolSize) * 100 : 0;
            const status = poolUsage > 90 ? health_check_interface_1.HealthStatus.DEGRADED : health_check_interface_1.HealthStatus.HEALTHY;
            return {
                status,
                message: status === health_check_interface_1.HealthStatus.HEALTHY
                    ? 'Database connection is healthy'
                    : 'Database connection pool near capacity',
                details: {
                    connected: true,
                    responseTime: `${responseTime}ms`,
                    database: this.sequelize.config.database,
                    poolSize,
                    activeConnections,
                    idleConnections,
                    poolUsage: `${poolUsage.toFixed(2)}%`,
                },
            };
        }
        catch (error) {
            this.logError('Database health check failed', error);
            return {
                status: health_check_interface_1.HealthStatus.UNHEALTHY,
                message: 'Database connection failed',
                details: {
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
            };
        }
    }
    async checkRedisHealth() {
        try {
            const redisUrl = this.configService.get('REDIS_URL');
            const redisHost = this.configService.get('REDIS_HOST');
            const redisPort = this.configService.get('REDIS_PORT');
            if (!redisUrl && !redisHost) {
                return {
                    status: health_check_interface_1.HealthStatus.DEGRADED,
                    message: 'Redis is not configured',
                    details: {
                        configured: false,
                    },
                };
            }
            if (this.cacheService && this.cacheService.getStats) {
                try {
                    const stats = await this.cacheService.getStats();
                    const hitRate = stats.hitRate || 0;
                    return {
                        status: health_check_interface_1.HealthStatus.HEALTHY,
                        message: 'Redis cache is operational',
                        details: {
                            configured: true,
                            connected: true,
                            hitRate: `${hitRate.toFixed(2)}%`,
                            size: stats.size,
                            maxSize: stats.maxSize,
                            hits: stats.hits,
                            misses: stats.misses,
                            evictions: stats.evictions,
                            memoryUsage: `${(stats.memoryUsage / 1024 / 1024).toFixed(2)} MB`,
                        },
                    };
                }
                catch (error) {
                    return {
                        status: health_check_interface_1.HealthStatus.DEGRADED,
                        message: 'Redis cache service error',
                        details: {
                            configured: true,
                            connected: false,
                            error: error instanceof Error ? error.message : 'Unknown error',
                        },
                    };
                }
            }
            return {
                status: health_check_interface_1.HealthStatus.DEGRADED,
                message: 'Redis configured but cache service not available',
                details: {
                    configured: true,
                    host: redisHost || 'from REDIS_URL',
                    port: redisPort,
                    serviceAvailable: false,
                },
            };
        }
        catch (error) {
            this.logError('Redis health check failed', error);
            return {
                status: health_check_interface_1.HealthStatus.UNHEALTHY,
                message: 'Redis health check failed',
                details: {
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
            };
        }
    }
    async checkWebSocketHealth() {
        try {
            if (!this.websocketService) {
                return {
                    status: health_check_interface_1.HealthStatus.DEGRADED,
                    message: 'WebSocket service not registered',
                    details: {
                        serviceAvailable: false,
                    },
                };
            }
            const isInitialized = this.websocketService.isInitialized();
            const connectedClients = this.websocketService.getConnectedSocketsCount();
            if (!isInitialized) {
                return {
                    status: health_check_interface_1.HealthStatus.DEGRADED,
                    message: 'WebSocket server not initialized',
                    details: {
                        initialized: false,
                        connectedClients: 0,
                    },
                };
            }
            return {
                status: health_check_interface_1.HealthStatus.HEALTHY,
                message: 'WebSocket server is operational',
                details: {
                    initialized: true,
                    connectedClients,
                    serverActive: true,
                },
            };
        }
        catch (error) {
            this.logError('WebSocket health check failed', error);
            return {
                status: health_check_interface_1.HealthStatus.DEGRADED,
                message: 'WebSocket server not fully operational',
                details: {
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
            };
        }
    }
    async checkJobQueueHealth() {
        try {
            if (!this.queueManagerService) {
                return {
                    status: health_check_interface_1.HealthStatus.DEGRADED,
                    message: 'Job queue service not registered',
                    details: {
                        serviceAvailable: false,
                    },
                };
            }
            const allStats = await this.queueManagerService.getAllQueueStats();
            const queueCount = Object.keys(allStats).length;
            if (queueCount === 0) {
                return {
                    status: health_check_interface_1.HealthStatus.DEGRADED,
                    message: 'No job queues initialized',
                    details: {
                        queueCount: 0,
                    },
                };
            }
            let totalWaiting = 0;
            let totalActive = 0;
            let totalCompleted = 0;
            let totalFailed = 0;
            let totalDelayed = 0;
            Object.values(allStats).forEach((stats) => {
                totalWaiting += stats.waiting || 0;
                totalActive += stats.active || 0;
                totalCompleted += stats.completed || 0;
                totalFailed += stats.failed || 0;
                totalDelayed += stats.delayed || 0;
            });
            const status = totalFailed > this.failedJobsThreshold
                ? health_check_interface_1.HealthStatus.DEGRADED
                : health_check_interface_1.HealthStatus.HEALTHY;
            return {
                status,
                message: status === health_check_interface_1.HealthStatus.HEALTHY
                    ? 'Job queues are operational'
                    : `High number of failed jobs: ${totalFailed}`,
                details: {
                    queueCount,
                    waiting: totalWaiting,
                    active: totalActive,
                    completed: totalCompleted,
                    failed: totalFailed,
                    delayed: totalDelayed,
                    queues: allStats,
                },
            };
        }
        catch (error) {
            this.logError('Job queue health check failed', error);
            return {
                status: health_check_interface_1.HealthStatus.DEGRADED,
                message: 'Job queue health check failed',
                details: {
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
            };
        }
    }
    async checkExternalAPIHealth() {
        try {
            if (!this.circuitBreakerService) {
                return {
                    status: health_check_interface_1.HealthStatus.HEALTHY,
                    message: 'External API monitoring not configured',
                    details: {
                        circuitBreakerAvailable: false,
                    },
                };
            }
            const services = ['sis-integration', 'external-api'];
            const circuitStatuses = {};
            let hasOpenCircuit = false;
            let hasHalfOpenCircuit = false;
            for (const service of services) {
                const status = this.circuitBreakerService.getStatus(service);
                if (status) {
                    circuitStatuses[service] = status;
                    if (status.state === 'OPEN')
                        hasOpenCircuit = true;
                    if (status.state === 'HALF_OPEN')
                        hasHalfOpenCircuit = true;
                }
            }
            let status = health_check_interface_1.HealthStatus.HEALTHY;
            let message = 'External APIs are operational';
            if (hasOpenCircuit) {
                status = health_check_interface_1.HealthStatus.UNHEALTHY;
                message =
                    'One or more external APIs are unavailable (circuit breaker OPEN)';
            }
            else if (hasHalfOpenCircuit) {
                status = health_check_interface_1.HealthStatus.DEGRADED;
                message = 'External APIs recovering (circuit breaker HALF_OPEN)';
            }
            return {
                status,
                message,
                details: {
                    circuitBreakerAvailable: true,
                    circuits: circuitStatuses,
                },
            };
        }
        catch (error) {
            this.logError('External API health check failed', error);
            return {
                status: health_check_interface_1.HealthStatus.DEGRADED,
                message: 'External API health check failed',
                details: {
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
            };
        }
    }
    async performHealthCheck() {
        const [database, redis, websocket, jobQueue, externalAPIs] = await Promise.all([
            this.checkDatabaseHealth(),
            this.checkRedisHealth(),
            this.checkWebSocketHealth(),
            this.checkJobQueueHealth(),
            this.checkExternalAPIHealth(),
        ]);
        const components = { database, redis, websocket, jobQueue, externalAPIs };
        const statuses = Object.values(components).map((c) => c.status);
        let overallStatus;
        if (statuses.includes(health_check_interface_1.HealthStatus.UNHEALTHY)) {
            overallStatus = health_check_interface_1.HealthStatus.UNHEALTHY;
        }
        else if (statuses.includes(health_check_interface_1.HealthStatus.DEGRADED)) {
            overallStatus = health_check_interface_1.HealthStatus.DEGRADED;
        }
        else {
            overallStatus = health_check_interface_1.HealthStatus.HEALTHY;
        }
        return {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: this.configService.get('NODE_ENV', 'development'),
            version: this.configService.get('npm_package_version', '1.0.0'),
            components,
        };
    }
    async checkReadiness() {
        const [dbHealth, redisHealth] = await Promise.all([
            this.checkDatabaseHealth(),
            this.checkRedisHealth(),
        ]);
        const isReady = dbHealth.status === health_check_interface_1.HealthStatus.HEALTHY;
        return {
            ready: isReady,
            timestamp: new Date().toISOString(),
            checks: {
                database: dbHealth.status,
                redis: redisHealth.status,
            },
        };
    }
    checkLiveness() {
        return {
            alive: true,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
};
exports.HealthCheckService = HealthCheckService;
exports.HealthCheckService = HealthCheckService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize,
        config_1.ConfigService])
], HealthCheckService);
//# sourceMappingURL=health-check.service.js.map