"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsLoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const base_interceptor_1 = require("../../../common/interceptors/base.interceptor");
let WsLoggingInterceptor = class WsLoggingInterceptor extends base_interceptor_1.BaseInterceptor {
    intercept(context, next) {
        const client = context.switchToWs().getClient();
        const data = context.switchToWs().getData();
        const pattern = context.switchToWs().getPattern();
        const user = client.user;
        const userId = user?.userId || 'anonymous';
        const organizationId = user?.organizationId || 'unknown';
        this.logRequest('debug', `[${pattern}] ← Received from socket ${client.id}`, {
            pattern,
            userId,
            organizationId,
            socketId: client.id,
            dataKeys: this.getDataKeys(data),
        });
        const startTime = Date.now();
        return next.handle().pipe((0, operators_1.tap)((response) => {
            const duration = Date.now() - startTime;
            this.logRequest('debug', `[${pattern}] → Response sent to socket ${client.id} (${duration}ms)`, {
                pattern,
                userId,
                organizationId,
                socketId: client.id,
                duration,
                hasResponse: !!response,
            });
        }), (0, operators_1.catchError)((error) => {
            const duration = Date.now() - startTime;
            this.logError(`[${pattern}] ✗ Error in socket ${client.id} (${duration}ms)`, error, {
                pattern,
                userId,
                organizationId,
                socketId: client.id,
                duration,
            });
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
    getDataKeys(data) {
        if (!data || typeof data !== 'object') {
            return [];
        }
        return Object.keys(data);
    }
};
exports.WsLoggingInterceptor = WsLoggingInterceptor;
exports.WsLoggingInterceptor = WsLoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], WsLoggingInterceptor);
//# sourceMappingURL=ws-logging.interceptor.js.map