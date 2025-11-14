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
exports.AccessControlCreateIncidentDto = exports.IncidentSeverity = exports.SecurityIncidentType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var SecurityIncidentType;
(function (SecurityIncidentType) {
    SecurityIncidentType["UNAUTHORIZED_ACCESS"] = "UNAUTHORIZED_ACCESS";
    SecurityIncidentType["BRUTE_FORCE"] = "BRUTE_FORCE";
    SecurityIncidentType["SUSPICIOUS_ACTIVITY"] = "SUSPICIOUS_ACTIVITY";
    SecurityIncidentType["DATA_BREACH"] = "DATA_BREACH";
    SecurityIncidentType["POLICY_VIOLATION"] = "POLICY_VIOLATION";
    SecurityIncidentType["MALWARE"] = "MALWARE";
    SecurityIncidentType["OTHER"] = "OTHER";
})(SecurityIncidentType || (exports.SecurityIncidentType = SecurityIncidentType = {}));
var IncidentSeverity;
(function (IncidentSeverity) {
    IncidentSeverity["LOW"] = "LOW";
    IncidentSeverity["MEDIUM"] = "MEDIUM";
    IncidentSeverity["HIGH"] = "HIGH";
    IncidentSeverity["CRITICAL"] = "CRITICAL";
})(IncidentSeverity || (exports.IncidentSeverity = IncidentSeverity = {}));
class AccessControlCreateIncidentDto {
    type;
    severity;
    description;
    affectedResources;
    detectedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("./create-security-incident.dto").SecurityIncidentType }, severity: { required: true, enum: require("./create-security-incident.dto").IncidentSeverity }, description: { required: true, type: () => String }, affectedResources: { required: false, type: () => [String] }, detectedBy: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.AccessControlCreateIncidentDto = AccessControlCreateIncidentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of security incident',
        enum: SecurityIncidentType,
        example: SecurityIncidentType.UNAUTHORIZED_ACCESS,
    }),
    (0, class_validator_1.IsEnum)(SecurityIncidentType, { message: 'Invalid incident type' }),
    __metadata("design:type", String)
], AccessControlCreateIncidentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Severity of the incident',
        enum: IncidentSeverity,
        example: IncidentSeverity.MEDIUM,
    }),
    (0, class_validator_1.IsEnum)(IncidentSeverity, { message: 'Invalid severity level' }),
    __metadata("design:type", String)
], AccessControlCreateIncidentDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the incident',
        example: 'User attempted to access restricted resource without proper permissions',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AccessControlCreateIncidentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of affected resources',
        example: ['user:123', 'resource:456'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AccessControlCreateIncidentDto.prototype, "affectedResources", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user or system that detected the incident',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], AccessControlCreateIncidentDto.prototype, "detectedBy", void 0);
//# sourceMappingURL=create-security-incident.dto.js.map