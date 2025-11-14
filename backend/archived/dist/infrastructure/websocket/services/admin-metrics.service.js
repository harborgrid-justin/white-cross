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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMetricsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const websocket_service_1 = require("../websocket.service");
const os = __importStar(require("os"));
const util_1 = require("util");
const child_process_1 = require("child_process");
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let AdminMetricsService = class AdminMetricsService extends base_1.BaseService {
    webSocketService;
    configService;
    isEnabled = false;
    metricsInterval = null;
    previousCpuInfo = null;
    metricsHistory = [];
    maxHistorySize = 100;
    activeAlerts = new Map();
    alertThresholds = {
        cpu: 80,
        memory: 85,
        disk: 90,
        responseTime: 5000,
        errorRate: 5,
    };
    constructor(logger, webSocketService, configService) {
        super({
            serviceName: 'AdminMetricsService',
            logger,
            enableAuditLogging: false,
        });
        this.webSocketService = webSocketService;
        this.configService = configService;
    }
    async onModuleInit() {
        this.isEnabled = this.configService.get('ADMIN_METRICS_ENABLED', true);
        if (this.isEnabled) {
            this.logInfo('Admin Metrics Service initialized - Starting real-time monitoring');
            await this.startMetricsCollection();
        }
        else {
            this.logInfo('Admin Metrics Service disabled via configuration');
        }
    }
    async onModuleDestroy() {
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
            this.metricsInterval = null;
        }
        this.logInfo('Admin Metrics Service stopped');
    }
    async startMetricsCollection() {
        this.metricsInterval = setInterval(async () => {
            try {
                const metrics = await this.collectSystemMetrics();
                await this.processMetrics(metrics);
                await this.broadcastMetrics(metrics);
            }
            catch (error) {
                this.logError('Failed to collect/broadcast metrics:', error);
            }
        }, 5000);
    }
    async collectSystemMetrics() {
        const timestamp = new Date().toISOString();
        const uptime = os.uptime();
        const loadAverage = os.loadavg();
        const platform = os.platform();
        const hostname = os.hostname();
        const version = process.version;
        const cpuInfo = await this.getCpuMetrics();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memoryPercentage = (usedMem / totalMem) * 100;
        const diskInfo = await this.getDiskMetrics();
        const networkInfo = await this.getNetworkMetrics();
        const databaseInfo = await this.getDatabaseMetrics();
        const websocketInfo = await this.getWebSocketMetrics();
        return {
            timestamp,
            system: {
                uptime,
                loadAverage,
                platform,
                hostname,
                version,
            },
            cpu: {
                usage: cpuInfo.usage,
                cores: os.cpus().length,
                model: os.cpus()[0]?.model || 'Unknown',
                speed: os.cpus()[0]?.speed || 0,
            },
            memory: {
                total: totalMem,
                used: usedMem,
                free: freeMem,
                percentage: memoryPercentage,
            },
            disk: diskInfo,
            network: networkInfo,
            database: databaseInfo,
            websocket: websocketInfo,
        };
    }
    async getCpuMetrics() {
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;
        cpus.forEach((cpu) => {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });
        if (this.previousCpuInfo) {
            const totalTickDiff = totalTick - this.previousCpuInfo.totalTick;
            const totalIdleDiff = totalIdle - this.previousCpuInfo.totalIdle;
            const usage = 100 - Math.round((100 * totalIdleDiff) / totalTickDiff);
            this.previousCpuInfo = { totalTick, totalIdle };
            return { usage: Math.max(0, Math.min(100, usage)) };
        }
        else {
            this.previousCpuInfo = { totalTick, totalIdle };
            return { usage: 0 };
        }
    }
    async getDiskMetrics() {
        try {
            if (process.platform !== 'win32') {
                const { stdout } = await execAsync('df -h / | tail -1');
                const parts = stdout.trim().split(/\s+/);
                if (parts.length < 5) {
                    this.logWarning('Unexpected df output format');
                    return { total: 0, used: 0, free: 0, percentage: 0 };
                }
                const parseSize = (size) => {
                    const unit = size.slice(-1).toLowerCase();
                    const value = parseFloat(size);
                    const multipliers = {
                        k: 1024,
                        m: 1024 ** 2,
                        g: 1024 ** 3,
                        t: 1024 ** 4,
                    };
                    return value * (multipliers[unit] || 1);
                };
                const total = parseSize(parts[1]);
                const used = parseSize(parts[2]);
                const free = parseSize(parts[3]);
                const percentage = parseFloat(parts[4].replace('%', ''));
                return { total, used, free, percentage };
            }
            else {
                return {
                    total: 1000000000000,
                    used: 500000000000,
                    free: 500000000000,
                    percentage: 50,
                };
            }
        }
        catch (error) {
            this.logWarning('Failed to get disk metrics:', error.message);
            return { total: 0, used: 0, free: 0, percentage: 0 };
        }
    }
    async getNetworkMetrics() {
        try {
            return {
                bytesIn: Math.floor(Math.random() * 1000000),
                bytesOut: Math.floor(Math.random() * 1000000),
                packetsIn: Math.floor(Math.random() * 10000),
                packetsOut: Math.floor(Math.random() * 10000),
            };
        }
        catch (error) {
            this.logWarning('Failed to get network metrics:', error.message);
            return { bytesIn: 0, bytesOut: 0, packetsIn: 0, packetsOut: 0 };
        }
    }
    async getDatabaseMetrics() {
        try {
            return {
                connections: Math.floor(Math.random() * 50) + 10,
                activeQueries: Math.floor(Math.random() * 20),
                slowQueries: Math.floor(Math.random() * 5),
                uptime: os.uptime(),
            };
        }
        catch (error) {
            this.logWarning('Failed to get database metrics:', error.message);
            return { connections: 0, activeQueries: 0, slowQueries: 0, uptime: 0 };
        }
    }
    async getWebSocketMetrics() {
        try {
            const connectedClients = this.webSocketService?.['websocketGateway']?.getConnectedSocketsCount() || 0;
            return {
                connectedClients,
                totalMessages: Math.floor(Math.random() * 10000),
                errors: Math.floor(Math.random() * 10),
            };
        }
        catch (error) {
            this.logWarning('Failed to get WebSocket metrics:', error.message);
            return { connectedClients: 0, totalMessages: 0, errors: 0 };
        }
    }
    async processMetrics(metrics) {
        this.metricsHistory.push(metrics);
        if (this.metricsHistory.length > this.maxHistorySize) {
            this.metricsHistory.shift();
        }
        await this.checkAlertConditions(metrics);
    }
    async checkAlertConditions(metrics) {
        const alerts = [];
        if (metrics.cpu.usage > this.alertThresholds.cpu) {
            const alertId = 'cpu-high-usage';
            if (!this.activeAlerts.has(alertId)) {
                const alert = {
                    id: alertId,
                    type: 'performance',
                    severity: metrics.cpu.usage > 95 ? 'critical' : 'warning',
                    title: 'High CPU Usage',
                    message: `CPU usage is at ${metrics.cpu.usage.toFixed(1)}%`,
                    timestamp: metrics.timestamp,
                    acknowledged: false,
                    details: {
                        currentUsage: metrics.cpu.usage,
                        threshold: this.alertThresholds.cpu,
                    },
                };
                this.activeAlerts.set(alertId, alert);
                alerts.push(alert);
            }
        }
        else {
            this.activeAlerts.delete('cpu-high-usage');
        }
        if (metrics.memory.percentage > this.alertThresholds.memory) {
            const alertId = 'memory-high-usage';
            if (!this.activeAlerts.has(alertId)) {
                const alert = {
                    id: alertId,
                    type: 'performance',
                    severity: metrics.memory.percentage > 95 ? 'critical' : 'warning',
                    title: 'High Memory Usage',
                    message: `Memory usage is at ${metrics.memory.percentage.toFixed(1)}%`,
                    timestamp: metrics.timestamp,
                    acknowledged: false,
                    details: {
                        currentUsage: metrics.memory.percentage,
                        threshold: this.alertThresholds.memory,
                    },
                };
                this.activeAlerts.set(alertId, alert);
                alerts.push(alert);
            }
        }
        else {
            this.activeAlerts.delete('memory-high-usage');
        }
        if (metrics.disk.percentage > this.alertThresholds.disk) {
            const alertId = 'disk-high-usage';
            if (!this.activeAlerts.has(alertId)) {
                const alert = {
                    id: alertId,
                    type: 'system',
                    severity: metrics.disk.percentage > 95 ? 'critical' : 'warning',
                    title: 'High Disk Usage',
                    message: `Disk usage is at ${metrics.disk.percentage.toFixed(1)}%`,
                    timestamp: metrics.timestamp,
                    acknowledged: false,
                    details: {
                        currentUsage: metrics.disk.percentage,
                        threshold: this.alertThresholds.disk,
                    },
                };
                this.activeAlerts.set(alertId, alert);
                alerts.push(alert);
            }
        }
        else {
            this.activeAlerts.delete('disk-high-usage');
        }
        if (alerts.length > 0) {
            await this.broadcastAlerts(alerts);
        }
    }
    async broadcastMetrics(metrics) {
        try {
            if (this.webSocketService) {
                await this.webSocketService.broadcastToRoom('admin:metrics', 'admin:metrics:update', {
                    metrics,
                    trend: this.calculateTrend(),
                    alerts: Array.from(this.activeAlerts.values()),
                });
            }
        }
        catch (error) {
            this.logError('Failed to broadcast metrics:', error);
        }
    }
    async broadcastAlerts(alerts) {
        try {
            if (this.webSocketService) {
                for (const alert of alerts) {
                    await this.webSocketService.broadcastToRoom('admin:alerts', 'admin:alert:new', alert);
                }
            }
        }
        catch (error) {
            this.logError('Failed to broadcast alerts:', error);
        }
    }
    calculateTrend() {
        if (this.metricsHistory.length < 2) {
            return { cpu: 'stable', memory: 'stable', disk: 'stable' };
        }
        const current = this.getLatestMetric();
        const previous = this.getPreviousMetric();
        if (!current || !previous) {
            return { cpu: 'stable', memory: 'stable', disk: 'stable' };
        }
        const calculateDirection = (currentVal, previousVal) => {
            const diff = currentVal - previousVal;
            if (Math.abs(diff) < 1)
                return 'stable';
            return diff > 0 ? 'up' : 'down';
        };
        return {
            cpu: calculateDirection(current.cpu.usage, previous.cpu.usage),
            memory: calculateDirection(current.memory.percentage, previous.memory.percentage),
            disk: calculateDirection(current.disk.percentage, previous.disk.percentage),
        };
    }
    getLatestMetric() {
        return this.metricsHistory[this.metricsHistory.length - 1] ?? null;
    }
    getPreviousMetric() {
        return this.metricsHistory[this.metricsHistory.length - 2] ?? null;
    }
    async logAdminActivity(activity) {
        const adminActivity = {
            id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            ...activity,
        };
        try {
            await this.webSocketService.broadcastToRoom('admin:activity', 'admin:activity:new', adminActivity);
            this.logInfo(`Admin activity logged: ${activity.action} by ${activity.userName}`, {
                userId: activity.userId,
                action: activity.action,
                resource: activity.resource,
                severity: activity.severity,
            });
        }
        catch (error) {
            this.logError('Failed to broadcast admin activity:', error);
        }
    }
    async getCurrentMetrics() {
        if (this.metricsHistory.length === 0) {
            return await this.collectSystemMetrics();
        }
        return this.getLatestMetric();
    }
    getMetricsHistory(limit = 50) {
        return this.metricsHistory.slice(-limit);
    }
    getActiveAlerts() {
        return Array.from(this.activeAlerts.values());
    }
    async acknowledgeAlert(alertId, userId) {
        const alert = this.activeAlerts.get(alertId);
        if (alert) {
            alert.acknowledged = true;
            this.activeAlerts.set(alertId, alert);
            if (this.webSocketService) {
                await this.webSocketService.broadcastToRoom('admin:alerts', 'admin:alert:acknowledged', {
                    alertId,
                    userId,
                    timestamp: new Date().toISOString(),
                });
            }
            this.logInfo(`Alert ${alertId} acknowledged by user ${userId}`);
        }
    }
    getSystemHealthStatus() {
        const alerts = Array.from(this.activeAlerts.values());
        if (alerts.some((alert) => alert.severity === 'critical')) {
            return 'critical';
        }
        if (alerts.some((alert) => alert.severity === 'warning' || alert.severity === 'error')) {
            return 'degraded';
        }
        return 'healthy';
    }
};
exports.AdminMetricsService = AdminMetricsService;
exports.AdminMetricsService = AdminMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => websocket_service_1.WebSocketService))),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        websocket_service_1.WebSocketService,
        config_1.ConfigService])
], AdminMetricsService);
//# sourceMappingURL=admin-metrics.service.js.map