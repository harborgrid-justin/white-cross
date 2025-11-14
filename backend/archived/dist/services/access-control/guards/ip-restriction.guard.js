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
exports.IpRestrictionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const access_control_service_1 = require("../access-control.service");
let IpRestrictionGuard = class IpRestrictionGuard {
    reflector;
    accessControlService;
    constructor(reflector, accessControlService) {
        this.reflector = reflector;
        this.accessControlService = accessControlService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const ipAddress = this.extractIpAddress(request);
        if (!ipAddress) {
            return true;
        }
        const restrictionCheck = await this.accessControlService.checkIpRestriction(ipAddress);
        if (restrictionCheck.isRestricted) {
            throw new common_1.ForbiddenException(restrictionCheck.reason || 'Access from this IP address is restricted');
        }
        return true;
    }
    extractIpAddress(request) {
        const forwardedFor = request.headers['x-forwarded-for'];
        if (forwardedFor) {
            const ips = forwardedFor.split(',').map((ip) => ip.trim());
            return ips[0];
        }
        const realIp = request.headers['x-real-ip'];
        if (realIp) {
            return realIp;
        }
        return (request.connection?.remoteAddress || request.socket?.remoteAddress || null);
    }
};
exports.IpRestrictionGuard = IpRestrictionGuard;
exports.IpRestrictionGuard = IpRestrictionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        access_control_service_1.AccessControlService])
], IpRestrictionGuard);
//# sourceMappingURL=ip-restriction.guard.js.map