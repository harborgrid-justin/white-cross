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
exports.IpRestriction = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const ip_restriction_type_enum_1 = require("../../services/security/enums/ip-restriction-type.enum");
let IpRestriction = class IpRestriction extends sequelize_typescript_1.Model {
    type;
    ipAddress;
    ipRange;
    countries;
    reason;
    createdBy;
    expiresAt;
    isActive;
};
exports.IpRestriction = IpRestriction;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], IpRestriction.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['whitelist', 'blacklist', 'geo_restriction']],
        },
    }),
    __metadata("design:type", String)
], IpRestriction.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'ipAddress',
    }),
    __metadata("design:type", String)
], IpRestriction.prototype, "ipAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'ipRange',
    }),
    __metadata("design:type", Object)
], IpRestriction.prototype, "ipRange", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'countries',
    }),
    __metadata("design:type", Array)
], IpRestriction.prototype, "countries", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
        field: 'reason',
    }),
    __metadata("design:type", String)
], IpRestriction.prototype, "reason", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        field: 'createdBy',
    }),
    __metadata("design:type", String)
], IpRestriction.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: 'createdAt',
    }),
    __metadata("design:type", Date)
], IpRestriction.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'expiresAt',
    }),
    __metadata("design:type", Date)
], IpRestriction.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        field: 'isActive',
    }),
    __metadata("design:type", Boolean)
], IpRestriction.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: 'updatedAt',
    }),
    __metadata("design:type", Date)
], IpRestriction.prototype, "updatedAt", void 0);
exports.IpRestriction = IpRestriction = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'ip_restrictions',
        timestamps: true,
        indexes: [{ fields: ['type', 'isActive'] }, { fields: ['ipAddress'] }],
    })
], IpRestriction);
//# sourceMappingURL=ip-restriction.model.js.map