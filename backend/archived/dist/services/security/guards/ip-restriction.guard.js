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
var IpRestrictionGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpRestrictionGuard = void 0;
const common_1 = require("@nestjs/common");
const ip_restriction_service_1 = require("../services/ip-restriction.service");
let IpRestrictionGuard = IpRestrictionGuard_1 = class IpRestrictionGuard {
    ipRestrictionService;
    logger = new common_1.Logger(IpRestrictionGuard_1.name);
    constructor(ipRestrictionService) {
        this.ipRestrictionService = ipRestrictionService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const ipAddress = this.extractIP(request);
        const userId = request.user?.id;
        try {
            const result = await this.ipRestrictionService.checkIPAccess(ipAddress, userId);
            if (!result.allowed) {
                this.logger.warn('IP access denied', {
                    ipAddress,
                    userId,
                    reason: result.reason,
                });
                throw new common_1.ForbiddenException(result.reason || 'Access denied from this IP address');
            }
            await this.ipRestrictionService.logAccessAttempt(ipAddress, userId || null, true);
            return true;
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            this.logger.error('Error in IP restriction guard', { error, ipAddress });
            return true;
        }
    }
    extractIP(request) {
        const trustedProxies = (process.env.TRUSTED_PROXIES || '127.0.0.1,::1')
            .split(',')
            .map((ip) => ip.trim());
        const connectionIP = request.ip || request.connection?.remoteAddress || '127.0.0.1';
        const isTrustedProxy = this.isIPTrusted(connectionIP, trustedProxies);
        if (isTrustedProxy) {
            const forwarded = request.headers['x-forwarded-for'];
            if (forwarded) {
                const clientIP = forwarded.split(',')[0].trim();
                this.logger.debug(`IP from trusted proxy - X-Forwarded-For: ${clientIP}`);
                return clientIP;
            }
            const realIP = request.headers['x-real-ip'];
            if (realIP) {
                this.logger.debug(`IP from trusted proxy - X-Real-IP: ${realIP}`);
                return realIP;
            }
        }
        else {
            if (request.headers['x-forwarded-for'] || request.headers['x-real-ip']) {
                this.logger.warn(`Ignoring proxy headers from untrusted source: ${connectionIP}`, {
                    xForwardedFor: request.headers['x-forwarded-for'],
                    xRealIP: request.headers['x-real-ip'],
                });
            }
        }
        this.logger.debug(`Using connection IP: ${connectionIP}`);
        return connectionIP;
    }
    isIPTrusted(ip, trustedProxies) {
        for (const trusted of trustedProxies) {
            if (ip === trusted) {
                return true;
            }
            if (trusted.includes('/')) {
                if (this.matchesCIDR(ip, trusted)) {
                    return true;
                }
            }
        }
        return false;
    }
    matchesCIDR(ip, cidr) {
        if (!cidr.includes('/')) {
            return ip === cidr;
        }
        try {
            const [network, bitsStr] = cidr.split('/');
            const bits = parseInt(bitsStr, 10);
            if (bits < 0 || bits > 32) {
                this.logger.warn(`Invalid CIDR bits: ${bits}`);
                return false;
            }
            const ipToInt = (ipAddr) => {
                const parts = ipAddr.split('.');
                if (parts.length !== 4)
                    return 0;
                return parts.reduce((acc, part) => {
                    const num = parseInt(part, 10);
                    if (isNaN(num) || num < 0 || num > 255)
                        return 0;
                    return (acc << 8) + num;
                }, 0);
            };
            const ipInt = ipToInt(ip);
            const networkInt = ipToInt(network);
            const mask = bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0;
            return (ipInt & mask) === (networkInt & mask);
        }
        catch (error) {
            this.logger.error('CIDR matching error:', error);
            return false;
        }
    }
};
exports.IpRestrictionGuard = IpRestrictionGuard;
exports.IpRestrictionGuard = IpRestrictionGuard = IpRestrictionGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ip_restriction_service_1.IpRestrictionService])
], IpRestrictionGuard);
//# sourceMappingURL=ip-restriction.guard.js.map