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
exports.SecurityIncident = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const incident_severity_enum_1 = require("../../services/security/enums/incident-severity.enum");
const incident_status_enum_1 = require("../../services/security/enums/incident-status.enum");
const incident_type_enum_1 = require("../../services/security/enums/incident-type.enum");
let SecurityIncident = class SecurityIncident extends sequelize_typescript_1.Model {
    type;
    severity;
    status;
    title;
    description;
    userId;
    ipAddress;
    userAgent;
    resourceAccessed;
    detectionMethod;
    indicators;
    impact;
    assignedTo;
    resolvedAt;
    resolution;
    preventiveMeasures;
    metadata;
};
exports.SecurityIncident = SecurityIncident;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], SecurityIncident.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        validate: {
            isIn: [
                [
                    'unauthorized_access',
                    'brute_force_attack',
                    'suspicious_activity',
                    'data_breach_attempt',
                    'privilege_escalation',
                    'sql_injection_attempt',
                    'xss_attempt',
                    'account_takeover',
                    'malware_detected',
                    'ddos_attempt',
                    'policy_violation',
                    'other',
                ],
            ],
        },
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['low', 'medium', 'high', 'critical']],
        },
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "severity", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('detected'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['detected', 'investigating', 'contained', 'resolved', 'false_positive']],
        },
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'userId',
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'ipAddress',
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "ipAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        field: 'userAgent',
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "userAgent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'resourceAccessed',
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "resourceAccessed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: 'detectedAt',
    }),
    __metadata("design:type", Date)
], SecurityIncident.prototype, "detectedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        field: 'detectionMethod',
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "detectionMethod", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
        field: 'indicators',
    }),
    __metadata("design:type", Array)
], SecurityIncident.prototype, "indicators", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        field: 'impact',
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "impact", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'assignedTo',
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "assignedTo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'resolvedAt',
    }),
    __metadata("design:type", Date)
], SecurityIncident.prototype, "resolvedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        field: 'resolution',
    }),
    __metadata("design:type", String)
], SecurityIncident.prototype, "resolution", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'preventiveMeasures',
    }),
    __metadata("design:type", Array)
], SecurityIncident.prototype, "preventiveMeasures", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'metadata',
    }),
    __metadata("design:type", Object)
], SecurityIncident.prototype, "metadata", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: 'updatedAt',
    }),
    __metadata("design:type", Date)
], SecurityIncident.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: 'createdAt',
    }),
    __metadata("design:type", Date)
], SecurityIncident.prototype, "createdAt", void 0);
exports.SecurityIncident = SecurityIncident = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'security_incidents',
        timestamps: true,
        indexes: [
            { fields: ['type', 'severity', 'status'] },
            { fields: ['userId'] },
            { fields: ['ipAddress'] },
            { fields: ['detectedAt'] },
        ],
    })
], SecurityIncident);
//# sourceMappingURL=security-incident.model.js.map