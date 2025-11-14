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
var AdminWebSocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminWebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const ws_jwt_auth_guard_1 = require("../guards/ws-jwt-auth.guard");
const ws_exception_filter_1 = require("../filters/ws-exception.filter");
const ws_logging_interceptor_1 = require("../interceptors/ws-logging.interceptor");
const websocket_1 = require("..");
let AdminWebSocketGateway = AdminWebSocketGateway_1 = class AdminWebSocketGateway {
    adminMetricsService;
    server;
    logger = new common_1.Logger(AdminWebSocketGateway_1.name);
    connectedClients = new Map();
    availableChannels = new Set([
        'metrics',
        'alerts',
        'activity',
        'system-status',
        'tools-results',
    ]);
    constructor(adminMetricsService) {
        this.adminMetricsService = adminMetricsService;
    }
    afterInit() {
        this.logger.log('Admin WebSocket Gateway initialized');
        this.setupAdminRooms();
    }
    async handleConnection(client) {
        try {
            const user = client.user;
            if (!user) {
                this.logger.warn(`Admin WebSocket connection rejected: No user context`);
                client.disconnect();
                return;
            }
            if (!['admin', 'system_administrator', 'super_admin'].includes(user.role)) {
                this.logger.warn(`Admin WebSocket connection rejected: Insufficient privileges for user ${user.userId}`);
                client.disconnect();
                return;
            }
            const adminClient = {
                socketId: client.id,
                userId: user.userId,
                userName: user.email.split('@')[0] || `User ${user.userId}`,
                role: user.role,
                connectedAt: new Date(),
                subscriptions: new Set(),
            };
            this.connectedClients.set(client.id, adminClient);
            await client.join('admin:metrics');
            await client.join('admin:alerts');
            await client.join('admin:activity');
            await client.join('admin:system-status');
            this.logger.log(`Admin client connected: ${adminClient.userName} (${user.userId}) - Role: ${user.role}`);
            if (this.adminMetricsService) {
                const currentMetrics = await this.adminMetricsService.getCurrentMetrics();
                const activeAlerts = this.adminMetricsService.getActiveAlerts();
                const systemStatus = this.adminMetricsService.getSystemHealthStatus();
                if (currentMetrics) {
                    client.emit('admin:metrics:update', {
                        metrics: currentMetrics,
                        trend: this.calculateTrend(),
                        alerts: activeAlerts,
                    });
                }
                client.emit('admin:system:status', {
                    status: systemStatus,
                    timestamp: new Date().toISOString(),
                });
                await this.adminMetricsService.logAdminActivity({
                    userId: user.userId,
                    userName: adminClient.userName,
                    action: 'admin_dashboard_connected',
                    resource: 'admin_websocket',
                    ipAddress: client.handshake.address,
                    userAgent: client.handshake.headers['user-agent'] || '',
                    severity: 'info',
                    details: {
                        socketId: client.id,
                        namespace: '/admin',
                    },
                });
            }
            this.server.to('admin:activity').emit('admin:client:connected', {
                clientId: client.id,
                userName: adminClient.userName,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            this.logger.error(`Admin connection error for ${client.id}:`, error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const adminClient = this.connectedClients.get(client.id);
        if (adminClient) {
            this.logger.log(`Admin client disconnected: ${adminClient.userName} (${adminClient.userId})`);
            this.server.to('admin:activity').emit('admin:client:disconnected', {
                clientId: client.id,
                userName: adminClient.userName,
                timestamp: new Date().toISOString(),
            });
            if (this.adminMetricsService) {
                this.adminMetricsService.logAdminActivity({
                    userId: adminClient.userId,
                    userName: adminClient.userName,
                    action: 'admin_dashboard_disconnected',
                    resource: 'admin_websocket',
                    ipAddress: client.handshake.address,
                    userAgent: client.handshake.headers['user-agent'] || '',
                    severity: 'info',
                    details: {
                        socketId: client.id,
                        sessionDuration: Date.now() - adminClient.connectedAt.getTime(),
                    },
                });
            }
            this.connectedClients.delete(client.id);
        }
    }
    handlePing(client) {
        client.emit('admin:pong', {
            timestamp: new Date().toISOString(),
            serverTime: Date.now(),
        });
    }
    async handleSubscribe(client, channel) {
        const adminClient = this.connectedClients.get(client.id);
        if (!adminClient)
            return;
        if (!this.availableChannels.has(channel)) {
            this.logger.warn(`Invalid subscription channel: ${channel} requested by ${adminClient.userName}`);
            return;
        }
        adminClient.subscriptions.add(channel);
        await client.join(`admin:${channel}`);
        this.logger.debug(`Admin client ${adminClient.userName} subscribed to ${channel}`);
        await this.sendChannelData(client, channel);
    }
    async handleUnsubscribe(client, channel) {
        const adminClient = this.connectedClients.get(client.id);
        if (!adminClient)
            return;
        adminClient.subscriptions.delete(channel);
        await client.leave(`admin:${channel}`);
        this.logger.debug(`Admin client ${adminClient.userName} unsubscribed from ${channel}`);
    }
    async handleMetricsRequest(client) {
        const currentMetrics = await this.adminMetricsService.getCurrentMetrics();
        const activeAlerts = this.adminMetricsService.getActiveAlerts();
        const metricsHistory = this.adminMetricsService.getMetricsHistory(20);
        if (currentMetrics) {
            client.emit('admin:metrics:update', {
                metrics: currentMetrics,
                trend: this.calculateTrend(),
                alerts: activeAlerts,
            });
            client.emit('admin:metrics:history', {
                history: metricsHistory,
                timestamp: new Date().toISOString(),
            });
        }
    }
    async handleAlertAcknowledge(client, alertId) {
        const adminClient = this.connectedClients.get(client.id);
        if (!adminClient)
            return;
        if (this.adminMetricsService) {
            await this.adminMetricsService.acknowledgeAlert(alertId, adminClient.userId);
            await this.adminMetricsService.logAdminActivity({
                userId: adminClient.userId,
                userName: adminClient.userName,
                action: 'alert_acknowledged',
                resource: `alert:${alertId}`,
                ipAddress: client.handshake.address,
                userAgent: client.handshake.headers['user-agent'] || '',
                severity: 'info',
                details: { alertId },
            });
        }
    }
    async handleToolExecution(client, data) {
        const adminClient = this.connectedClients.get(client.id);
        if (!adminClient)
            return;
        try {
            this.logger.log(`Admin tool execution: ${data.toolId} by ${adminClient.userName}`);
            const result = await this.executeAdminTool(data.toolId);
            client.emit('admin:tools:result', {
                toolId: data.toolId,
                result,
                timestamp: new Date().toISOString(),
            });
            await this.adminMetricsService.logAdminActivity({
                userId: adminClient.userId,
                userName: adminClient.userName,
                action: 'admin_tool_executed',
                resource: `tool:${data.toolId}`,
                ipAddress: client.handshake.address,
                userAgent: client.handshake.headers['user-agent'] || '',
                severity: 'warning',
                details: { toolId: data.toolId, params: data.params },
            });
        }
        catch (error) {
            this.logger.error(`Admin tool execution failed: ${data.toolId}`, error);
            client.emit('admin:tools:result', {
                toolId: data.toolId,
                result: { success: false, error: error.message },
                timestamp: new Date().toISOString(),
            });
        }
    }
    async handleActivityRequest(client, limit = 50) {
        client.emit('admin:activity:list', {
            activities: [],
            limit,
            timestamp: new Date().toISOString(),
        });
    }
    setupAdminRooms() {
        this.logger.debug('Admin rooms setup completed');
    }
    async sendChannelData(client, channel) {
        switch (channel) {
            case 'metrics': {
                if (this.adminMetricsService) {
                    const metrics = await this.adminMetricsService.getCurrentMetrics();
                    if (metrics) {
                        client.emit('admin:metrics:update', {
                            metrics,
                            trend: this.calculateTrend(),
                            alerts: this.adminMetricsService.getActiveAlerts(),
                        });
                    }
                }
                break;
            }
            case 'alerts': {
                if (this.adminMetricsService) {
                    const alerts = this.adminMetricsService.getActiveAlerts();
                    alerts.forEach((alert) => {
                        client.emit('admin:alert:new', alert);
                    });
                }
                break;
            }
            case 'system-status': {
                if (this.adminMetricsService) {
                    const status = this.adminMetricsService.getSystemHealthStatus();
                    client.emit('admin:system:status', {
                        status,
                        timestamp: new Date().toISOString(),
                    });
                }
                break;
            }
        }
    }
    calculateTrend() {
        return {
            value: 0,
            change: 0,
            direction: 'stable',
            cpu: 'stable',
            memory: 'stable',
            disk: 'stable',
        };
    }
    async executeAdminTool(toolId) {
        const tools = {
            'cache-clear': () => Promise.resolve({
                success: true,
                message: 'Cache cleared successfully',
            }),
            'database-backup': () => Promise.resolve({
                success: true,
                message: 'Database backup initiated',
            }),
            'log-cleanup': () => Promise.resolve({
                success: true,
                message: 'Log cleanup completed',
            }),
            'system-restart': () => Promise.resolve({
                success: true,
                message: 'System restart scheduled',
            }),
            'health-check': async () => ({
                success: true,
                message: 'Health check completed',
                results: await this.adminMetricsService.getCurrentMetrics(),
            }),
        };
        const tool = tools[toolId];
        if (!tool) {
            throw new Error(`Unknown admin tool: ${toolId}`);
        }
        return await tool();
    }
    getConnectedAdminCount() {
        return this.connectedClients.size;
    }
    getConnectedAdmins() {
        return Array.from(this.connectedClients.values());
    }
};
exports.AdminWebSocketGateway = AdminWebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AdminWebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('admin:ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminWebSocketGateway.prototype, "handlePing", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('admin:subscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminWebSocketGateway.prototype, "handleSubscribe", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('admin:unsubscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminWebSocketGateway.prototype, "handleUnsubscribe", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('admin:metrics:request'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminWebSocketGateway.prototype, "handleMetricsRequest", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('admin:alerts:acknowledge'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminWebSocketGateway.prototype, "handleAlertAcknowledge", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('admin:tools:execute'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminWebSocketGateway.prototype, "handleToolExecution", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('admin:activity:request'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminWebSocketGateway.prototype, "handleActivityRequest", null);
exports.AdminWebSocketGateway = AdminWebSocketGateway = AdminWebSocketGateway_1 = __decorate([
    (0, common_1.UseFilters)(new ws_exception_filter_1.WsExceptionFilter()),
    (0, common_1.UseInterceptors)(ws_logging_interceptor_1.WsLoggingInterceptor),
    (0, websockets_1.WebSocketGateway)({
        namespace: '/admin',
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST'],
        },
        transports: ['websocket', 'polling'],
        pingTimeout: 30000,
        pingInterval: 10000,
    }),
    __param(0, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [websocket_1.AdminMetricsService])
], AdminWebSocketGateway);
//# sourceMappingURL=admin.gateway.js.map