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
exports.ChronicConditionDto = void 0;
const openapi = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
let ChronicConditionDto = class ChronicConditionDto {
    id;
    diagnosisName;
    description;
    status;
    diagnosisDate;
    diagnosedBy;
    careInstructions;
    isActive;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, diagnosisName: { required: true, type: () => String }, description: { required: false, type: () => String }, status: { required: true, type: () => String }, diagnosisDate: { required: false, type: () => Date }, diagnosedBy: { required: false, type: () => String }, careInstructions: { required: false, type: () => String }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.ChronicConditionDto = ChronicConditionDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { description: 'Unique identifier for the chronic condition' }),
    __metadata("design:type", String)
], ChronicConditionDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Name of the diagnosis' }),
    __metadata("design:type", String)
], ChronicConditionDto.prototype, "diagnosisName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Detailed description of the condition' }),
    __metadata("design:type", String)
], ChronicConditionDto.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Current status of the condition' }),
    __metadata("design:type", String)
], ChronicConditionDto.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Date when the condition was diagnosed' }),
    __metadata("design:type", Date)
], ChronicConditionDto.prototype, "diagnosisDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Healthcare provider who diagnosed the condition' }),
    __metadata("design:type", String)
], ChronicConditionDto.prototype, "diagnosedBy", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Special care instructions' }),
    __metadata("design:type", String)
], ChronicConditionDto.prototype, "careInstructions", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Whether this condition is currently active' }),
    __metadata("design:type", Boolean)
], ChronicConditionDto.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Date when the record was created' }),
    __metadata("design:type", Date)
], ChronicConditionDto.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Date when the record was last updated' }),
    __metadata("design:type", Date)
], ChronicConditionDto.prototype, "updatedAt", void 0);
exports.ChronicConditionDto = ChronicConditionDto = __decorate([
    (0, graphql_1.ObjectType)('ChronicCondition')
], ChronicConditionDto);
//# sourceMappingURL=chronic-condition.dto.js.map