"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ConnectionPoolManager_1, PoolMetricsCollector_1, ConnectionLeakDetector_1, ReadReplicaRouter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadReplicaRouter = exports.ConnectionLeakDetector = exports.PoolMetricsCollector = exports.ConnectionPoolManager = exports.PoolState = void 0;
exports.calculateOptimalPoolSize = calculateOptimalPoolSize;
exports.calculatePoolSizeByLoad = calculatePoolSizeByLoad;
exports.adjustPoolSize = adjustPoolSize;
exports.validatePoolConfig = validatePoolConfig;
exports.checkConnectionHealth = checkConnectionHealth;
exports.validateConnection = validateConnection;
exports.monitorConnectionHealth = monitorConnectionHealth;
exports.deepHealthCheck = deepHealthCheck;
exports.createHealthCheckEndpoint = createHealthCheckEndpoint;
exports.createSequelizeWithRetry = createSequelizeWithRetry;
exports.retryDatabaseOperation = retryDatabaseOperation;
exports.withCircuitBreaker = withCircuitBreaker;
exports.withConnectionTimeout = withConnectionTimeout;
exports.analyzePoolPerformance = analyzePoolPerformance;
exports.enableDynamicPoolSizing = enableDynamicPoolSizing;
exports.optimizeForWorkload = optimizeForWorkload;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const events_1 = require("events");
const os = __importStar(require("os"));
var PoolState;
(function (PoolState) {
    PoolState["INITIALIZING"] = "INITIALIZING";
    PoolState["HEALTHY"] = "HEALTHY";
    PoolState["DEGRADED"] = "DEGRADED";
    PoolState["DRAINING"] = "DRAINING";
    PoolState["CLOSED"] = "CLOSED";
    PoolState["ERROR"] = "ERROR";
})(PoolState || (exports.PoolState = PoolState = {}));
function calculateOptimalPoolSize(cpuCores = os.cpus().length, connectionLatency = 50, avgQueryTime = 100, targetUtilization = 0.7) {
    const waitTime = connectionLatency;
    const serviceTime = avgQueryTime;
    const optimalConnections = Math.ceil(cpuCores * (1 + waitTime / serviceTime) * targetUtilization);
    return {
        max: Math.max(optimalConnections, 10),
        min: Math.max(Math.floor(optimalConnections * 0.3), 2),
        idle: 10000,
        acquire: 30000,
        evict: 1000
    };
}
function calculatePoolSizeByLoad(concurrentUsers, requestsPerUser, avgRequestDuration, safetyMargin = 1.2) {
    const totalRequestsPerSecond = concurrentUsers * requestsPerUser;
    const avgDurationSeconds = avgRequestDuration / 1000;
    const requiredConnections = Math.ceil(totalRequestsPerSecond * avgDurationSeconds * safetyMargin);
    return {
        max: Math.max(requiredConnections, 10),
        min: Math.max(Math.floor(requiredConnections * 0.2), 2),
        idle: 10000,
        acquire: 30000,
        evict: 1000
    };
}
function adjustPoolSize(currentConfig, metrics, targetUtilization = 0.7) {
    const currentUtilization = metrics.poolUtilization;
    const adjustedConfig = { ...currentConfig };
    if (currentUtilization > 0.9 && adjustedConfig.max) {
        adjustedConfig.max = Math.min(Math.ceil(adjustedConfig.max * 1.5), 100);
    }
    if (currentUtilization < 0.3 && adjustedConfig.max) {
        adjustedConfig.max = Math.max(Math.floor(adjustedConfig.max * 0.8), 10);
    }
    if (adjustedConfig.max && adjustedConfig.min) {
        adjustedConfig.min = Math.max(Math.floor(adjustedConfig.max * 0.2), 2);
    }
    return adjustedConfig;
}
function validatePoolConfig(config) {
    const errors = [];
    if (config.max && config.min && config.max < config.min) {
        errors.push('max must be greater than or equal to min');
    }
    if (config.max && config.max < 1) {
        errors.push('max must be at least 1');
    }
    if (config.min && config.min < 0) {
        errors.push('min cannot be negative');
    }
    if (config.idle && config.idle < 0) {
        errors.push('idle timeout cannot be negative');
    }
    if (config.acquire && config.acquire < 0) {
        errors.push('acquire timeout cannot be negative');
    }
    if (config.max && config.max > 1000) {
        errors.push('max pool size seems excessive (>1000), consider reviewing');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
let ConnectionPoolManager = ConnectionPoolManager_1 = class ConnectionPoolManager {
    logger = new common_1.Logger(ConnectionPoolManager_1.name);
    eventEmitter = new events_1.EventEmitter();
    pools = new Map();
    metrics = new Map();
    healthStatus = new Map();
    registerPool(name, sequelize) {
        this.pools.set(name, sequelize);
        this.initializeMetrics(name);
        this.setupLifecycleHooks(name, sequelize);
        this.logger.log(`Registered connection pool: ${name}`);
    }
    initializeMetrics(name) {
        this.metrics.set(name, {
            totalConnections: 0,
            activeConnections: 0,
            idleConnections: 0,
            waitingRequests: 0,
            totalCreated: 0,
            totalDestroyed: 0,
            totalAcquired: 0,
            totalReleased: 0,
            totalTimedOut: 0,
            averageWaitTime: 0,
            averageConnectionLife: 0,
            poolUtilization: 0,
            errorRate: 0
        });
    }
    setupLifecycleHooks(name, sequelize) {
        const pool = sequelize.connectionManager.pool;
        if (!pool) {
            this.logger.warn(`No pool found for ${name}`);
            return;
        }
        pool.on('createSuccess', () => {
            this.trackEvent(name, 'create');
        });
        pool.on('destroySuccess', () => {
            this.trackEvent(name, 'destroy');
        });
        pool.on('acquireSuccess', () => {
            this.trackEvent(name, 'acquire');
        });
        pool.on('release', () => {
            this.trackEvent(name, 'release');
        });
        pool.on('acquireTimeout', () => {
            this.trackEvent(name, 'timeout');
        });
    }
    trackEvent(poolName, eventType) {
        const metrics = this.metrics.get(poolName);
        if (!metrics)
            return;
        switch (eventType) {
            case 'create':
                metrics.totalCreated++;
                break;
            case 'destroy':
                metrics.totalDestroyed++;
                break;
            case 'acquire':
                metrics.totalAcquired++;
                break;
            case 'release':
                metrics.totalReleased++;
                break;
            case 'timeout':
                metrics.totalTimedOut++;
                break;
        }
        this.eventEmitter.emit('pool:event', {
            pool: poolName,
            type: eventType,
            timestamp: Date.now()
        });
    }
    async closePool(name, config) {
        const sequelize = this.pools.get(name);
        if (!sequelize) {
            throw new Error(`Pool ${name} not found`);
        }
        const drainConfig = {
            timeout: 30000,
            forceAfterTimeout: true,
            graceful: true,
            ...config
        };
        this.logger.log(`Closing pool ${name}...`);
        try {
            if (drainConfig.graceful) {
                await this.drainPool(sequelize, drainConfig);
            }
            await sequelize.close();
            this.pools.delete(name);
            this.metrics.delete(name);
            this.healthStatus.delete(name);
            this.logger.log(`Pool ${name} closed successfully`);
        }
        catch (error) {
            this.logger.error(`Error closing pool ${name}: ${error.message}`);
            throw error;
        }
    }
    async drainPool(sequelize, config) {
        const pool = sequelize.connectionManager.pool;
        const startTime = Date.now();
        while (Date.now() - startTime < config.timeout) {
            const activeConnections = pool?.used?.length || 0;
            if (activeConnections === 0) {
                this.logger.debug('Pool drained successfully');
                return;
            }
            this.logger.debug(`Waiting for ${activeConnections} connections to close...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        if (config.forceAfterTimeout) {
            this.logger.warn('Drain timeout reached, forcing pool closure');
        }
        else {
            throw new Error('Pool drain timeout exceeded');
        }
    }
    getMetrics(name) {
        const sequelize = this.pools.get(name);
        if (!sequelize)
            return undefined;
        const pool = sequelize.connectionManager.pool;
        const metrics = this.metrics.get(name);
        if (!metrics || !pool)
            return metrics;
        metrics.activeConnections = pool.used?.length || 0;
        metrics.idleConnections = pool.free?.length || 0;
        metrics.waitingRequests = pool.pending?.length || 0;
        metrics.totalConnections = metrics.activeConnections + metrics.idleConnections;
        const maxConnections = pool.options?.max || 1;
        metrics.poolUtilization =
            metrics.totalConnections / maxConnections;
        return metrics;
    }
    async onModuleDestroy() {
        this.logger.log('Closing all connection pools...');
        const closePromises = Array.from(this.pools.keys()).map(name => this.closePool(name, { timeout: 10000, forceAfterTimeout: true, graceful: true }));
        await Promise.allSettled(closePromises);
    }
};
exports.ConnectionPoolManager = ConnectionPoolManager;
exports.ConnectionPoolManager = ConnectionPoolManager = ConnectionPoolManager_1 = __decorate([
    (0, common_1.Injectable)()
], ConnectionPoolManager);
async function checkConnectionHealth(sequelize, timeout = 5000) {
    const startTime = Date.now();
    let isHealthy = false;
    let consecutiveFailures = 0;
    let metadata = {};
    try {
        await Promise.race([
            sequelize.authenticate(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Health check timeout')), timeout))
        ]);
        isHealthy = true;
        metadata.lastSuccessfulCheck = new Date().toISOString();
    }
    catch (error) {
        isHealthy = false;
        consecutiveFailures++;
        metadata.lastError = error.message;
    }
    const responseTime = Date.now() - startTime;
    return {
        isHealthy,
        responseTime,
        lastChecked: Date.now(),
        consecutiveFailures,
        metadata
    };
}
async function validateConnection(connection, sequelize) {
    try {
        if (!connection || connection._closed || connection.destroyed) {
            return false;
        }
        const dialect = sequelize.getDialect();
        const query = dialect === 'postgres' ? 'SELECT 1' :
            dialect === 'mysql' ? 'SELECT 1' :
                'SELECT 1';
        await sequelize.query(query, { raw: true });
        return true;
    }
    catch (error) {
        return false;
    }
}
function monitorConnectionHealth(sequelize, interval = 30000, onHealthChange) {
    let previousHealth = null;
    const logger = new common_1.Logger('ConnectionHealthMonitor');
    const intervalId = setInterval(async () => {
        const health = await checkConnectionHealth(sequelize);
        if (!previousHealth ||
            previousHealth.isHealthy !== health.isHealthy) {
            logger.log(`Connection health changed: ${health.isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
            if (onHealthChange) {
                onHealthChange(health);
            }
        }
        previousHealth = health;
    }, interval);
    return () => {
        clearInterval(intervalId);
        logger.debug('Stopped connection health monitoring');
    };
}
async function deepHealthCheck(sequelize, testQueries) {
    const details = {};
    let authentication = false;
    try {
        await sequelize.authenticate();
        authentication = true;
        details.authentication = 'SUCCESS';
    }
    catch (error) {
        details.authentication = error.message;
    }
    let queryExecution = false;
    try {
        const queries = testQueries || ['SELECT 1 as health_check'];
        for (const query of queries) {
            await sequelize.query(query);
        }
        queryExecution = true;
        details.queryExecution = 'SUCCESS';
    }
    catch (error) {
        details.queryExecution = error.message;
    }
    let poolStatus = false;
    try {
        const pool = sequelize.connectionManager.pool;
        const activeConnections = pool?.used?.length || 0;
        const idleConnections = pool?.free?.length || 0;
        const maxConnections = pool?.options?.max || 0;
        poolStatus = activeConnections + idleConnections > 0;
        details.poolStatus = {
            active: activeConnections,
            idle: idleConnections,
            max: maxConnections,
            utilization: (activeConnections + idleConnections) / maxConnections
        };
    }
    catch (error) {
        details.poolStatus = error.message;
    }
    const overall = authentication && queryExecution && poolStatus;
    return {
        overall,
        authentication,
        queryExecution,
        poolStatus,
        details
    };
}
function createHealthCheckEndpoint(sequelize) {
    return async () => {
        const health = await checkConnectionHealth(sequelize);
        let status = 'healthy';
        if (!health.isHealthy) {
            status = 'unhealthy';
        }
        else if (health.responseTime > 1000) {
            status = 'degraded';
        }
        else if (health.consecutiveFailures > 0) {
            status = 'degraded';
        }
        return {
            status,
            timestamp: new Date().toISOString(),
            responseTime: health.responseTime,
            details: health
        };
    };
}
let PoolMetricsCollector = PoolMetricsCollector_1 = class PoolMetricsCollector {
    logger = new common_1.Logger(PoolMetricsCollector_1.name);
    metricsHistory = new Map();
    maxHistorySize = 1000;
    async collectMetrics(sequelize, poolName) {
        const pool = sequelize.connectionManager.pool;
        const metrics = {
            totalConnections: 0,
            activeConnections: pool?.used?.length || 0,
            idleConnections: pool?.free?.length || 0,
            waitingRequests: pool?.pending?.length || 0,
            totalCreated: 0,
            totalDestroyed: 0,
            totalAcquired: 0,
            totalReleased: 0,
            totalTimedOut: 0,
            averageWaitTime: 0,
            averageConnectionLife: 0,
            poolUtilization: 0,
            errorRate: 0
        };
        metrics.totalConnections =
            metrics.activeConnections + metrics.idleConnections;
        const maxConnections = pool?.options?.max || 1;
        metrics.poolUtilization = metrics.totalConnections / maxConnections;
        this.addToHistory(poolName, metrics);
        return metrics;
    }
    addToHistory(poolName, metrics) {
        let history = this.metricsHistory.get(poolName);
        if (!history) {
            history = [];
            this.metricsHistory.set(poolName, history);
        }
        history.push({ ...metrics });
        if (history.length > this.maxHistorySize) {
            history.shift();
        }
    }
    getAggregatedMetrics(poolName, samples = 100) {
        const history = this.metricsHistory.get(poolName) || [];
        const recentHistory = history.slice(-samples);
        if (recentHistory.length === 0) {
            return {
                avgUtilization: 0,
                maxUtilization: 0,
                avgActiveConnections: 0,
                maxActiveConnections: 0,
                avgWaitingRequests: 0,
                maxWaitingRequests: 0
            };
        }
        const sum = recentHistory.reduce((acc, m) => ({
            utilization: acc.utilization + m.poolUtilization,
            active: acc.active + m.activeConnections,
            waiting: acc.waiting + m.waitingRequests
        }), { utilization: 0, active: 0, waiting: 0 });
        return {
            avgUtilization: sum.utilization / recentHistory.length,
            maxUtilization: Math.max(...recentHistory.map(m => m.poolUtilization)),
            avgActiveConnections: sum.active / recentHistory.length,
            maxActiveConnections: Math.max(...recentHistory.map(m => m.activeConnections)),
            avgWaitingRequests: sum.waiting / recentHistory.length,
            maxWaitingRequests: Math.max(...recentHistory.map(m => m.waitingRequests))
        };
    }
    generateReport(poolName) {
        const current = this.metricsHistory.get(poolName)?.slice(-1)[0];
        const aggregated = this.getAggregatedMetrics(poolName);
        if (!current) {
            return `No metrics available for pool: ${poolName}`;
        }
        return `
Connection Pool Metrics Report: ${poolName}
===========================================

Current Status:
- Active Connections: ${current.activeConnections}
- Idle Connections: ${current.idleConnections}
- Waiting Requests: ${current.waitingRequests}
- Pool Utilization: ${(current.poolUtilization * 100).toFixed(2)}%

Aggregated (Last 100 samples):
- Avg Utilization: ${(aggregated.avgUtilization * 100).toFixed(2)}%
- Max Utilization: ${(aggregated.maxUtilization * 100).toFixed(2)}%
- Avg Active Connections: ${aggregated.avgActiveConnections.toFixed(2)}
- Max Active Connections: ${aggregated.maxActiveConnections}
- Avg Waiting Requests: ${aggregated.avgWaitingRequests.toFixed(2)}
- Max Waiting Requests: ${aggregated.maxWaitingRequests}
`;
    }
    detectAnomalies(poolName, thresholds = {}) {
        const { utilizationThreshold = 0.9, waitingRequestsThreshold = 10, errorRateThreshold = 0.05 } = thresholds;
        const anomalies = [];
        const current = this.metricsHistory.get(poolName)?.slice(-1)[0];
        if (!current) {
            return anomalies;
        }
        if (current.poolUtilization > utilizationThreshold) {
            anomalies.push(`High pool utilization: ${(current.poolUtilization * 100).toFixed(2)}%`);
        }
        if (current.waitingRequests > waitingRequestsThreshold) {
            anomalies.push(`High number of waiting requests: ${current.waitingRequests}`);
        }
        if (current.errorRate > errorRateThreshold) {
            anomalies.push(`High error rate: ${(current.errorRate * 100).toFixed(2)}%`);
        }
        return anomalies;
    }
};
exports.PoolMetricsCollector = PoolMetricsCollector;
exports.PoolMetricsCollector = PoolMetricsCollector = PoolMetricsCollector_1 = __decorate([
    (0, common_1.Injectable)()
], PoolMetricsCollector);
let ConnectionLeakDetector = ConnectionLeakDetector_1 = class ConnectionLeakDetector {
    logger = new common_1.Logger(ConnectionLeakDetector_1.name);
    trackedConnections = new Map();
    leakThreshold;
    constructor(leakThreshold = 30000) {
        this.leakThreshold = leakThreshold;
    }
    trackConnection(connectionId, metadata) {
        const stackTrace = new Error().stack || 'No stack trace available';
        this.trackedConnections.set(connectionId, {
            acquiredAt: Date.now(),
            stackTrace,
            metadata
        });
    }
    releaseConnection(connectionId) {
        this.trackedConnections.delete(connectionId);
    }
    detectLeaks() {
        const now = Date.now();
        const leaks = [];
        for (const [connectionId, info] of this.trackedConnections) {
            const duration = now - info.acquiredAt;
            if (duration > this.leakThreshold) {
                leaks.push({
                    connectionId,
                    acquiredAt: info.acquiredAt,
                    stackTrace: info.stackTrace,
                    duration,
                    query: info.metadata?.query
                });
                this.logger.warn(`Potential connection leak detected: ${connectionId} (held for ${duration}ms)`);
            }
        }
        return leaks;
    }
    getLeakReport() {
        const leaks = this.detectLeaks();
        if (leaks.length === 0) {
            return 'No connection leaks detected';
        }
        let report = `Connection Leak Report\n${'='.repeat(50)}\n\n`;
        for (const leak of leaks) {
            report += `Connection ID: ${leak.connectionId}\n`;
            report += `Duration: ${leak.duration}ms\n`;
            report += `Acquired At: ${new Date(leak.acquiredAt).toISOString()}\n`;
            if (leak.query) {
                report += `Query: ${leak.query}\n`;
            }
            report += `Stack Trace:\n${leak.stackTrace}\n`;
            report += `${'-'.repeat(50)}\n`;
        }
        return report;
    }
    startAutoDetection(interval = 60000) {
        const intervalId = setInterval(() => {
            const leaks = this.detectLeaks();
            if (leaks.length > 0) {
                this.logger.warn(`Detected ${leaks.length} potential connection leaks`);
            }
        }, interval);
        return () => {
            clearInterval(intervalId);
            this.logger.debug('Stopped automatic leak detection');
        };
    }
};
exports.ConnectionLeakDetector = ConnectionLeakDetector;
exports.ConnectionLeakDetector = ConnectionLeakDetector = ConnectionLeakDetector_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Number])
], ConnectionLeakDetector);
async function createSequelizeWithRetry(config, retryConfig) {
    const { maxRetries, initialDelay, maxDelay, backoffMultiplier, connectionTimeout } = retryConfig;
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const sequelize = new sequelize_1.Sequelize({
                ...config,
                pool: {
                    ...config.pool,
                    acquire: connectionTimeout
                }
            });
            await Promise.race([
                sequelize.authenticate(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), connectionTimeout))
            ]);
            const logger = new common_1.Logger('SequelizeConnectionRetry');
            logger.log('Database connection established successfully');
            return sequelize;
        }
        catch (error) {
            lastError = error;
            if (attempt === maxRetries) {
                throw new Error(`Failed to connect after ${maxRetries} retries: ${error.message}`);
            }
            const delay = Math.min(initialDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
            const logger = new common_1.Logger('SequelizeConnectionRetry');
            logger.warn(`Connection attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError || new Error('Connection failed');
}
async function retryDatabaseOperation(operation, retryConfig = {}) {
    const { maxRetries = 3, initialDelay = 1000, maxDelay = 10000, backoffMultiplier = 2 } = retryConfig;
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            const isRetryable = /ECONNREFUSED|ETIMEDOUT|ENOTFOUND|ECONNRESET/.test(error.message);
            if (!isRetryable || attempt === maxRetries) {
                throw error;
            }
            const delay = Math.min(initialDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError || new Error('Operation failed');
}
function withCircuitBreaker(sequelize, failureThreshold = 5, resetTimeout = 60000) {
    let failures = 0;
    let lastFailureTime = 0;
    let circuitOpen = false;
    const originalQuery = sequelize.query.bind(sequelize);
    sequelize.query = async function (...args) {
        if (circuitOpen && Date.now() - lastFailureTime > resetTimeout) {
            circuitOpen = false;
            failures = 0;
        }
        if (circuitOpen) {
            throw new Error('Circuit breaker is open');
        }
        try {
            const result = await originalQuery(...args);
            failures = 0;
            return result;
        }
        catch (error) {
            failures++;
            lastFailureTime = Date.now();
            if (failures >= failureThreshold) {
                circuitOpen = true;
            }
            throw error;
        }
    };
    return sequelize;
}
function withConnectionTimeout(sequelize, timeout = 30000) {
    const originalQuery = sequelize.query.bind(sequelize);
    sequelize.query = async function (...args) {
        return Promise.race([
            originalQuery(...args),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout exceeded')), timeout))
        ]);
    };
    return sequelize;
}
let ReadReplicaRouter = ReadReplicaRouter_1 = class ReadReplicaRouter {
    config;
    logger = new common_1.Logger(ReadReplicaRouter_1.name);
    currentIndex = 0;
    connectionCounts = new Map();
    constructor(config) {
        this.config = config;
        for (const replica of config.read) {
            this.connectionCounts.set(replica, 0);
        }
    }
    getReadReplica(preferredReplica) {
        if (preferredReplica && this.config.read.includes(preferredReplica)) {
            return preferredReplica;
        }
        switch (this.config.loadBalancing) {
            case 'round-robin':
                return this.getRoundRobinReplica();
            case 'least-connections':
                return this.getLeastConnectionsReplica();
            case 'weighted':
                return this.getWeightedReplica();
            default:
                return this.getRoundRobinReplica();
        }
    }
    getWriteInstance() {
        return this.config.write;
    }
    getRoundRobinReplica() {
        const replica = this.config.read[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.config.read.length;
        return replica;
    }
    getLeastConnectionsReplica() {
        let minConnections = Infinity;
        let selectedReplica = this.config.read[0];
        for (const replica of this.config.read) {
            const connections = this.connectionCounts.get(replica) || 0;
            if (connections < minConnections) {
                minConnections = connections;
                selectedReplica = replica;
            }
        }
        return selectedReplica;
    }
    getWeightedReplica() {
        if (!this.config.weights || this.config.weights.size === 0) {
            return this.getRoundRobinReplica();
        }
        const totalWeight = Array.from(this.config.weights.values()).reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        for (const [replica, weight] of this.config.weights) {
            random -= weight;
            if (random <= 0) {
                return replica;
            }
        }
        return this.config.read[0];
    }
    trackAcquisition(replica) {
        const current = this.connectionCounts.get(replica) || 0;
        this.connectionCounts.set(replica, current + 1);
    }
    trackRelease(replica) {
        const current = this.connectionCounts.get(replica) || 0;
        this.connectionCounts.set(replica, Math.max(0, current - 1));
    }
};
exports.ReadReplicaRouter = ReadReplicaRouter;
exports.ReadReplicaRouter = ReadReplicaRouter = ReadReplicaRouter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], ReadReplicaRouter);
async function analyzePoolPerformance(sequelize, metrics) {
    const pool = sequelize.connectionManager.pool;
    const currentConfig = {
        max: pool?.options?.max || 10,
        min: pool?.options?.min || 2,
        idle: pool?.options?.idle || 10000,
        acquire: pool?.options?.acquire || 30000,
        evict: pool?.options?.evict || 1000
    };
    const reasoning = [];
    const expectedImprovements = [];
    const risks = [];
    const recommendedConfig = { ...currentConfig };
    if (metrics.poolUtilization > 0.9) {
        recommendedConfig.max = Math.min((currentConfig.max || 10) * 1.5, 100);
        reasoning.push('High pool utilization detected, increasing max connections');
        expectedImprovements.push('Reduced waiting time for connections');
        risks.push('Increased memory usage');
    }
    else if (metrics.poolUtilization < 0.3) {
        recommendedConfig.max = Math.max((currentConfig.max || 10) * 0.7, 5);
        reasoning.push('Low pool utilization, decreasing max connections');
        expectedImprovements.push('Reduced memory footprint');
        risks.push('Potential connection wait time increase under load');
    }
    if (metrics.waitingRequests > 10) {
        recommendedConfig.max = Math.min((currentConfig.max || 10) * 1.3, 100);
        recommendedConfig.acquire = Math.max((currentConfig.acquire || 30000) * 1.5, 45000);
        reasoning.push('High number of waiting requests, increasing pool size and timeout');
        expectedImprovements.push('Better handling of concurrent requests');
    }
    if (recommendedConfig.max) {
        recommendedConfig.min = Math.max(Math.floor(recommendedConfig.max * 0.2), 2);
    }
    return {
        currentConfig,
        recommendedConfig,
        reasoning,
        expectedImprovements,
        risks
    };
}
function enableDynamicPoolSizing(sequelize, config) {
    const logger = new common_1.Logger('DynamicPoolSizing');
    let lastScaleTime = 0;
    const metricsCollector = new PoolMetricsCollector();
    const intervalId = setInterval(async () => {
        const metrics = await metricsCollector.collectMetrics(sequelize, 'main');
        const now = Date.now();
        if (now - lastScaleTime < config.cooldownPeriod) {
            return;
        }
        const pool = sequelize.connectionManager.pool;
        const currentMax = pool?.options?.max || config.minSize;
        if (metrics.poolUtilization > config.scaleUpThreshold) {
            const newMax = Math.min(Math.ceil(currentMax * 1.5), config.maxSize);
            if (newMax > currentMax) {
                pool.options.max = newMax;
                lastScaleTime = now;
                logger.log(`Scaled up pool: ${currentMax} -> ${newMax}`);
            }
        }
        if (metrics.poolUtilization < config.scaleDownThreshold) {
            const newMax = Math.max(Math.floor(currentMax * 0.8), config.minSize);
            if (newMax < currentMax) {
                pool.options.max = newMax;
                lastScaleTime = now;
                logger.log(`Scaled down pool: ${currentMax} -> ${newMax}`);
            }
        }
    }, config.evaluationInterval);
    return () => {
        clearInterval(intervalId);
        logger.debug('Stopped dynamic pool sizing');
    };
}
function optimizeForWorkload(workloadType, baseConfig) {
    const base = baseConfig || {
        max: 10,
        min: 2,
        idle: 10000,
        acquire: 30000,
        evict: 1000
    };
    switch (workloadType) {
        case 'read-heavy':
            return {
                ...base,
                max: Math.max((base.max || 10) * 1.5, 15),
                min: Math.max((base.min || 2) * 1.5, 3),
                idle: 30000,
                evict: 5000
            };
        case 'write-heavy':
            return {
                ...base,
                max: Math.min((base.max || 10), 20),
                min: Math.max((base.min || 2), 5),
                idle: 5000,
                acquire: 45000,
                evict: 500
            };
        case 'mixed':
            return {
                ...base,
                max: (base.max || 10) * 1.2,
                min: (base.min || 2) * 1.2,
                idle: 15000,
                evict: 2000
            };
        case 'batch':
            return {
                ...base,
                max: Math.max((base.max || 10) * 2, 25),
                min: base.min || 2,
                idle: 60000,
                acquire: 60000,
                evict: 10000
            };
        default:
            return base;
    }
}
//# sourceMappingURL=connection-pooling.service.js.map