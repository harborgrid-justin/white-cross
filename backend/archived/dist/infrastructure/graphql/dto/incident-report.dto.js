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
exports.IncidentReportDto = void 0;
const openapi = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
let IncidentReportDto = class IncidentReportDto {
    id;
    incidentType;
    incidentDateTime;
    location;
    description;
    severity;
    actionsTaken;
    reportedBy;
    followUpRequired;
    followUpDate;
    status;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, incidentType: { required: true, type: () => String }, incidentDateTime: { required: true, type: () => Date }, location: { required: true, type: () => String }, description: { required: true, type: () => String }, severity: { required: false, type: () => String }, actionsTaken: { required: false, type: () => String }, reportedBy: { required: false, type: () => String }, followUpRequired: { required: false, type: () => Boolean }, followUpDate: { required: false, type: () => Date }, status: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.IncidentReportDto = IncidentReportDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { description: 'Unique identifier for the incident report' }),
    __metadata("design:type", String)
], IncidentReportDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Type of incident' }),
    __metadata("design:type", String)
], IncidentReportDto.prototype, "incidentType", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Date and time when the incident occurred' }),
    __metadata("design:type", Date)
], IncidentReportDto.prototype, "incidentDateTime", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Location where the incident occurred' }),
    __metadata("design:type", String)
], IncidentReportDto.prototype, "location", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Detailed description of the incident' }),
    __metadata("design:type", String)
], IncidentReportDto.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Severity level of the incident' }),
    __metadata("design:type", String)
], IncidentReportDto.prototype, "severity", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Actions taken in response to the incident' }),
    __metadata("design:type", String)
], IncidentReportDto.prototype, "actionsTaken", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Staff member who reported the incident' }),
    __metadata("design:type", String)
], IncidentReportDto.prototype, "reportedBy", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Follow-up actions required' }),
    __metadata("design:type", Boolean)
], IncidentReportDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Date when follow-up was completed' }),
    __metadata("design:type", Date)
], IncidentReportDto.prototype, "followUpDate", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Current status of the incident' }),
    __metadata("design:type", String)
], IncidentReportDto.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Date when the report was created' }),
    __metadata("design:type", Date)
], IncidentReportDto.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Date when the report was last updated' }),
    __metadata("design:type", Date)
], IncidentReportDto.prototype, "updatedAt", void 0);
exports.IncidentReportDto = IncidentReportDto = __decorate([
    (0, graphql_1.ObjectType)('IncidentReport')
], IncidentReportDto);
//# sourceMappingURL=incident-report.dto.js.map