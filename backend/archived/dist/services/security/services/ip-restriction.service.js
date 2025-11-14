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
exports.IpRestrictionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../database/models");
const ip_restriction_type_enum_1 = require("../enums/ip-restriction-type.enum");
const base_1 = require("../../../common/base");
let IpRestrictionService = class IpRestrictionService extends base_1.BaseService {
    ipRestrictionModel;
    constructor(ipRestrictionModel) {
        super('IpRestrictionService');
        this.ipRestrictionModel = ipRestrictionModel;
    }
    async checkIPAccess(ipAddress, userId) {
        try {
            const isBlacklisted = await this.isIPBlacklisted(ipAddress);
            if (isBlacklisted.blocked) {
                this.logWarning('IP address blocked (blacklisted)', {
                    ipAddress,
                    reason: isBlacklisted.reason,
                });
                return {
                    allowed: false,
                    reason: `IP address is blacklisted: ${isBlacklisted.reason}`,
                    matchedRule: isBlacklisted.rule,
                };
            }
            const whitelistEnforced = await this.isWhitelistEnforced();
            if (whitelistEnforced) {
                const isWhitelisted = await this.isIPWhitelisted(ipAddress);
                if (!isWhitelisted.allowed) {
                    this.logWarning('IP address blocked (not whitelisted)', {
                        ipAddress,
                    });
                    return {
                        allowed: false,
                        reason: 'IP address is not on the whitelist',
                    };
                }
            }
            const geoCheck = await this.checkGeoRestrictions(ipAddress);
            if (!geoCheck.allowed) {
                this.logWarning('IP address blocked (geo-restriction)', {
                    ipAddress,
                    location: geoCheck.location,
                });
                return geoCheck;
            }
            if (userId) {
                const userCheck = await this.checkUserIPRestrictions(userId, ipAddress);
                if (!userCheck.allowed) {
                    this.logWarning('IP address blocked (user restriction)', {
                        ipAddress,
                        userId,
                    });
                    return userCheck;
                }
            }
            this.logInfo('IP address access granted', { ipAddress, userId });
            return {
                allowed: true,
                location: geoCheck.location,
            };
        }
        catch (error) {
            this.logError('Error checking IP access', { error, ipAddress });
            return {
                allowed: true,
                reason: 'Error during IP check, access granted by default',
            };
        }
    }
    async isIPBlacklisted(ipAddress) {
        try {
            const blacklistRules = await this.ipRestrictionModel.findAll({
                where: {
                    type: ip_restriction_type_enum_1.IpRestrictionType.BLACKLIST,
                    isActive: true,
                },
            });
            for (const rule of blacklistRules) {
                if (this.matchesRestriction(ipAddress, rule)) {
                    return {
                        blocked: true,
                        reason: rule.reason,
                        rule: this.entityToRule(rule),
                    };
                }
            }
            return { blocked: false };
        }
        catch (error) {
            this.logError('Error checking IP blacklist', { error, ipAddress });
            return { blocked: false };
        }
    }
    async isIPWhitelisted(ipAddress) {
        try {
            const whitelistRules = await this.ipRestrictionModel.findAll({
                where: {
                    type: ip_restriction_type_enum_1.IpRestrictionType.WHITELIST,
                    isActive: true,
                },
            });
            for (const rule of whitelistRules) {
                if (this.matchesRestriction(ipAddress, rule)) {
                    return { allowed: true };
                }
            }
            return { allowed: false };
        }
        catch (error) {
            this.logError('Error checking IP whitelist', { error, ipAddress });
            return { allowed: true };
        }
    }
    async isWhitelistEnforced() {
        try {
            return false;
        }
        catch (error) {
            this.logError('Error checking whitelist enforcement', { error });
            return false;
        }
    }
    async checkGeoRestrictions(ipAddress) {
        try {
            const location = await this.getIPGeolocation(ipAddress);
            const geoRestrictions = await this.ipRestrictionModel.findAll({
                where: {
                    type: ip_restriction_type_enum_1.IpRestrictionType.GEO_RESTRICTION,
                    isActive: true,
                },
            });
            if (location) {
                for (const rule of geoRestrictions) {
                    if (rule.countries?.includes(location.country)) {
                        return {
                            allowed: false,
                            reason: `Access from ${location.country} is restricted`,
                            location,
                        };
                    }
                }
            }
            return {
                allowed: true,
                location,
            };
        }
        catch (error) {
            this.logError('Error checking geo restrictions', {
                error,
                ipAddress,
            });
            return { allowed: true };
        }
    }
    async getIPGeolocation(ipAddress) {
        try {
            if (this.isPrivateIP(ipAddress)) {
                return { country: 'US', city: 'Local', region: 'Local' };
            }
            return { country: 'US', city: 'Unknown', region: 'Unknown' };
        }
        catch (error) {
            this.logError('Error getting IP geolocation', { error, ipAddress });
            return null;
        }
    }
    async checkUserIPRestrictions(userId, ipAddress) {
        try {
            return { allowed: true };
        }
        catch (error) {
            this.logError('Error checking user IP restrictions', {
                error,
                userId,
                ipAddress,
            });
            return { allowed: true };
        }
    }
    matchesRestriction(ipAddress, rule) {
        if (rule.ipAddress) {
            return this.matchesIPPattern(ipAddress, rule.ipAddress);
        }
        if (rule.ipRange) {
            return this.matchesIPRange(ipAddress, rule.ipRange.start, rule.ipRange.end);
        }
        return false;
    }
    matchesIPPattern(ipAddress, pattern) {
        try {
            if (pattern.includes('/')) {
                return this.matchesCIDR(ipAddress, pattern);
            }
            else if (pattern === ipAddress) {
                return true;
            }
            return false;
        }
        catch (error) {
            this.logError('Error matching IP pattern', {
                error,
                ipAddress,
                pattern,
            });
            return false;
        }
    }
    matchesCIDR(ipAddress, cidr) {
        try {
            const [subnet, maskBits] = cidr.split('/');
            if (!maskBits || !subnet)
                return false;
            const mask = ~((1 << (32 - parseInt(maskBits, 10))) - 1);
            const ipNum = this.ipToNumber(ipAddress);
            const subnetNum = this.ipToNumber(subnet);
            return (ipNum & mask) === (subnetNum & mask);
        }
        catch (error) {
            this.logError('Error matching CIDR', { error, ipAddress, cidr });
            return false;
        }
    }
    matchesIPRange(ipAddress, startIP, endIP) {
        try {
            const ipNum = this.ipToNumber(ipAddress);
            const startNum = this.ipToNumber(startIP);
            const endNum = this.ipToNumber(endIP);
            return ipNum >= startNum && ipNum <= endNum;
        }
        catch (error) {
            this.logError('Error matching IP range', { error, ipAddress });
            return false;
        }
    }
    ipToNumber(ip) {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
    }
    isPrivateIP(ipAddress) {
        const privateRanges = [
            '127.0.0.0/8',
            '10.0.0.0/8',
            '172.16.0.0/12',
            '192.168.0.0/16',
        ];
        return privateRanges.some((range) => this.matchesIPPattern(ipAddress, range));
    }
    async addToBlacklist(dto) {
        try {
            const restriction = await this.ipRestrictionModel.create({
                ...dto,
                type: ip_restriction_type_enum_1.IpRestrictionType.BLACKLIST,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
            });
            this.logInfo('IP added to blacklist', {
                ipAddress: dto.ipAddress,
                reason: dto.reason,
            });
            return restriction;
        }
        catch (error) {
            this.logError('Error adding IP to blacklist', { error, dto });
            throw error;
        }
    }
    async addToWhitelist(dto) {
        try {
            const restriction = await this.ipRestrictionModel.create({
                ...dto,
                type: ip_restriction_type_enum_1.IpRestrictionType.WHITELIST,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
            });
            this.logInfo('IP added to whitelist', {
                ipAddress: dto.ipAddress,
                reason: dto.reason,
            });
            return restriction;
        }
        catch (error) {
            this.logError('Error adding IP to whitelist', { error, dto });
            throw error;
        }
    }
    async removeRestriction(ruleId) {
        try {
            await this.ipRestrictionModel.update({ isActive: false }, { where: { id: ruleId } });
            this.logInfo('IP restriction removed', { ruleId });
            return true;
        }
        catch (error) {
            this.logError('Error removing IP restriction', { error, ruleId });
            return false;
        }
    }
    async getAllRestrictions(type) {
        try {
            const where = { isActive: true };
            if (type) {
                where.type = type;
            }
            return await this.ipRestrictionModel.findAll({ where });
        }
        catch (error) {
            this.logError('Error fetching IP restrictions', { error });
            return [];
        }
    }
    async updateRestriction(id, dto) {
        const restriction = await this.ipRestrictionModel.findByPk(id);
        if (!restriction) {
            throw new Error('IP restriction not found');
        }
        Object.assign(restriction, dto);
        return await restriction.save();
    }
    entityToRule(entity) {
        return {
            id: entity.id,
            type: entity.type,
            ipAddress: entity.ipAddress,
            ipRange: entity.ipRange,
            countries: entity.countries,
            reason: entity.reason,
            createdBy: entity.createdBy,
            createdAt: entity.createdAt,
            expiresAt: entity.expiresAt,
            isActive: entity.isActive,
        };
    }
    async logAccessAttempt(ipAddress, userId, allowed, reason) {
        try {
            const logEntry = {
                ipAddress,
                userId,
                allowed,
                reason,
                timestamp: new Date(),
            };
            this.logInfo('IP access attempt logged', logEntry);
        }
        catch (error) {
            this.logError('Error logging IP access attempt', { error });
        }
    }
};
exports.IpRestrictionService = IpRestrictionService;
exports.IpRestrictionService = IpRestrictionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.IpRestriction)),
    __metadata("design:paramtypes", [Object])
], IpRestrictionService);
//# sourceMappingURL=ip-restriction.service.js.map