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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsThrottleGuard = exports.Throttle = exports.THROTTLE_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const websockets_1 = require("@nestjs/websockets");
const websocket_1 = require("..");
exports.THROTTLE_KEY = 'websocket_throttle';
const Throttle = (limit, ttl) => (0, common_1.SetMetadata)(exports.THROTTLE_KEY, { limit, ttl });
exports.Throttle = Throttle;
let WsThrottleGuard = class WsThrottleGuard {
    rateLimiter;
    reflector;
    constructor(rateLimiter, reflector) {
        this.rateLimiter = rateLimiter;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const throttleConfig = this.reflector.get(exports.THROTTLE_KEY, context.getHandler());
        if (!throttleConfig) {
            return true;
        }
        const client = context.switchToWs().getClient();
        const user = client.user;
        if (!user) {
            throw new websockets_1.WsException('Authentication required');
        }
        const pattern = context.switchToWs().getPattern();
        const allowed = await this.rateLimiter.checkLimit(user.userId, pattern);
        if (!allowed) {
            throw new websockets_1.WsException({
                type: 'RATE_LIMIT_EXCEEDED',
                message: `Rate limit exceeded for ${pattern}. Please slow down.`,
            });
        }
        return true;
    }
};
exports.WsThrottleGuard = WsThrottleGuard;
exports.WsThrottleGuard = WsThrottleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [websocket_1.RateLimiterService,
        core_1.Reflector])
], WsThrottleGuard);
//# sourceMappingURL=ws-throttle.guard.js.map