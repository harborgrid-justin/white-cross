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
exports.SecurityMonitoringService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const create_security_incident_dto_1 = require("../dto/create-security-incident.dto");
const base_1 = require("../../../common/base");
var SecurityIncidentStatus;
(function (SecurityIncidentStatus) {
    SecurityIncidentStatus["OPEN"] = "OPEN";
    SecurityIncidentStatus["INVESTIGATING"] = "INVESTIGATING";
    SecurityIncidentStatus["RESOLVED"] = "RESOLVED";
    SecurityIncidentStatus["CLOSED"] = "CLOSED";
})(SecurityIncidentStatus || (SecurityIncidentStatus = {}));
let SecurityMonitoringService = class SecurityMonitoringService extends base_1.BaseService {
    sequelize;
    constructor(sequelize) {
        super("SecurityMonitoringService");
        this.sequelize = sequelize;
    }
    getModel(modelName) {
        return this.sequelize.models[modelName];
    }
    async logLoginAttempt(data) {
        try {
            const LoginAttempt = this.getModel('LoginAttempt');
            const attempt = await LoginAttempt.create({
                email: data.email,
                success: data.success,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                failureReason: data.failureReason,
            });
            this.logInfo(`Logged login attempt for ${data.email}: ${data.success ? 'success' : 'failure'}`);
            return attempt;
        }
        catch (error) {
            this.logError('Error logging login attempt:', error);
            return undefined;
        }
    }
    async getFailedLoginAttempts(email, minutes = 15) {
        try {
            const LoginAttempt = this.getModel('LoginAttempt');
            const since = new Date(Date.now() - minutes * 60 * 1000);
            const attempts = await LoginAttempt.findAll({
                where: {
                    email,
                    success: false,
                    createdAt: {
                        [sequelize_2.Op.gte]: since,
                    },
                },
                order: [['createdAt', 'DESC']],
            });
            this.logInfo(`Retrieved ${attempts.length} failed login attempts for ${email}`);
            return attempts;
        }
        catch (error) {
            this.logError('Error getting failed login attempts:', error);
            throw error;
        }
    }
    async createSecurityIncident(data) {
        try {
            const SecurityIncident = this.getModel('SecurityIncident');
            const incident = await SecurityIncident.create({
                type: data.type,
                severity: data.severity,
                description: data.description,
                affectedResources: data.affectedResources || [],
                detectedBy: data.detectedBy,
                status: SecurityIncidentStatus.OPEN,
            });
            this.logWarning(`Security incident created: ${incident.id} - ${data.type}`);
            return incident;
        }
        catch (error) {
            this.logError('Error creating security incident:', error);
            throw error;
        }
    }
    async updateSecurityIncident(id, data) {
        try {
            const SecurityIncident = this.getModel('SecurityIncident');
            const incident = await this.findEntityOrFail(SecurityIncident, id, 'Security');
            const updateData = {};
            if (data.status) {
                updateData.status = data.status;
            }
            if (data.resolution) {
                updateData.resolution = data.resolution;
            }
            if (data.resolvedBy) {
                updateData.resolvedBy = data.resolvedBy;
            }
            if (data.status === SecurityIncidentStatus.RESOLVED &&
                !incident.resolvedAt) {
                updateData.resolvedAt = new Date();
            }
            await incident.update(updateData);
            this.logInfo(`Updated security incident: ${id}`);
            return incident;
        }
        catch (error) {
            this.logError(`Error updating security incident ${id}:`, error);
            throw error;
        }
    }
    async getSecurityIncidents(page = 1, limit = 20, filters = {}) {
        try {
            const SecurityIncident = this.getModel('SecurityIncident');
            const offset = (page - 1) * limit;
            const whereClause = {};
            if (filters.type) {
                whereClause.type = filters.type;
            }
            if (filters.severity) {
                whereClause.severity = filters.severity;
            }
            if (filters.status) {
                whereClause.status = filters.status;
            }
            const { rows: incidents, count: total } = await SecurityIncident.findAndCountAll({
                where: whereClause,
                offset,
                limit,
                order: [['createdAt', 'DESC']],
            });
            this.logInfo(`Retrieved ${incidents.length} security incidents`);
            return {
                incidents,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.logError('Error getting security incidents:', error);
            throw error;
        }
    }
    async getSecurityStatistics() {
        try {
            const SecurityIncident = this.getModel('SecurityIncident');
            const LoginAttempt = this.getModel('LoginAttempt');
            const Session = this.getModel('Session');
            const IpRestriction = this.getModel('IpRestriction');
            const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const [totalIncidents, openIncidents, criticalIncidents, recentFailedLogins, activeSessions, activeIpRestrictions,] = await Promise.all([
                SecurityIncident.count(),
                SecurityIncident.count({
                    where: { status: SecurityIncidentStatus.OPEN },
                }),
                SecurityIncident.count({
                    where: {
                        severity: create_security_incident_dto_1.IncidentSeverity.CRITICAL,
                        status: {
                            [sequelize_2.Op.ne]: SecurityIncidentStatus.CLOSED,
                        },
                    },
                }),
                LoginAttempt.count({
                    where: {
                        success: false,
                        createdAt: {
                            [sequelize_2.Op.gte]: last24Hours,
                        },
                    },
                }),
                Session.count({
                    where: {
                        expiresAt: {
                            [sequelize_2.Op.gt]: new Date(),
                        },
                    },
                }),
                IpRestriction.count({
                    where: { isActive: true },
                }),
            ]);
            const statistics = {
                incidents: {
                    total: totalIncidents,
                    open: openIncidents,
                    critical: criticalIncidents,
                },
                authentication: {
                    recentFailedLogins,
                    activeSessions,
                },
                ipRestrictions: activeIpRestrictions,
            };
            this.logInfo('Retrieved security statistics');
            return statistics;
        }
        catch (error) {
            this.logError('Error getting security statistics:', error);
            throw error;
        }
    }
};
exports.SecurityMonitoringService = SecurityMonitoringService;
exports.SecurityMonitoringService = SecurityMonitoringService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_2.Sequelize])
], SecurityMonitoringService);
//# sourceMappingURL=security-monitoring.service.js.map