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
exports.DelegationService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
let DelegationService = class DelegationService extends base_1.BaseService {
    delegations = new Map();
    constructor() {
        super("DelegationService");
        this.logInfo('Permission Delegation Service initialized');
        this.startCleanupInterval();
    }
    async createDelegation(fromUserId, toUserId, permissions, expiresAt, reason) {
        if (fromUserId === toUserId) {
            throw new common_1.BadRequestException('Cannot delegate permissions to yourself');
        }
        if (permissions.length === 0) {
            throw new common_1.BadRequestException('Must specify at least one permission to delegate');
        }
        if (new Date(expiresAt) <= new Date()) {
            throw new common_1.BadRequestException('Expiration date must be in the future');
        }
        const id = `delegation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const delegation = {
            id,
            fromUserId,
            toUserId,
            permissions,
            reason,
            expiresAt: new Date(expiresAt),
            isActive: true,
            createdAt: new Date(),
        };
        this.delegations.set(id, delegation);
        this.logInfo(`Created delegation: ${fromUserId} -> ${toUserId} (${permissions.length} permissions)`);
        return delegation;
    }
    async revokeDelegation(delegationId, revokedBy, reason) {
        const delegation = this.delegations.get(delegationId);
        if (!delegation) {
            throw new common_1.NotFoundException('Delegation not found');
        }
        if (!delegation.isActive) {
            throw new common_1.BadRequestException('Delegation is already revoked');
        }
        delegation.isActive = false;
        delegation.revokedAt = new Date();
        delegation.revokedBy = revokedBy;
        if (reason) {
            delegation.reason = `${delegation.reason || ''} | Revoked: ${reason}`;
        }
        this.delegations.set(delegationId, delegation);
        this.logInfo(`Revoked delegation: ${delegationId} by ${revokedBy}`);
        return delegation;
    }
    async getUserDelegations(userId, type = 'all') {
        const allDelegations = Array.from(this.delegations.values());
        let filtered = allDelegations;
        if (type === 'received') {
            filtered = allDelegations.filter((d) => d.toUserId === userId);
        }
        else if (type === 'given') {
            filtered = allDelegations.filter((d) => d.fromUserId === userId);
        }
        else {
            filtered = allDelegations.filter((d) => d.toUserId === userId || d.fromUserId === userId);
        }
        return filtered.filter((d) => d.isActive && new Date(d.expiresAt) > new Date());
    }
    async checkDelegation(userId, permissionId) {
        const userDelegations = await this.getUserDelegations(userId, 'received');
        for (const delegation of userDelegations) {
            if (delegation.permissions.includes(permissionId)) {
                const isExpired = new Date(delegation.expiresAt) <= new Date();
                return {
                    hasDelegation: !isExpired,
                    delegation,
                    isExpired,
                };
            }
        }
        return {
            hasDelegation: false,
        };
    }
    async getDelegation(delegationId) {
        const delegation = this.delegations.get(delegationId);
        if (!delegation) {
            throw new common_1.NotFoundException('Delegation not found');
        }
        return delegation;
    }
    async getAllDelegations() {
        return Array.from(this.delegations.values()).filter((d) => d.isActive && new Date(d.expiresAt) > new Date());
    }
    cleanupExpired() {
        const now = new Date();
        let cleaned = 0;
        for (const [id, delegation] of this.delegations.entries()) {
            if (delegation.isActive && new Date(delegation.expiresAt) <= now) {
                delegation.isActive = false;
                this.delegations.set(id, delegation);
                cleaned++;
            }
        }
        if (cleaned > 0) {
            this.logInfo(`Cleaned up ${cleaned} expired delegations`);
        }
    }
    startCleanupInterval() {
        setInterval(() => {
            this.cleanupExpired();
        }, 5 * 60 * 1000);
    }
};
exports.DelegationService = DelegationService;
exports.DelegationService = DelegationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DelegationService);
//# sourceMappingURL=delegation.service.js.map