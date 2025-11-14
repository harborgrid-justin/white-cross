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
exports.AllergyDto = void 0;
const openapi = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
let AllergyDto = class AllergyDto {
    id;
    allergen;
    severity;
    reaction;
    treatment;
    identifiedDate;
    identifiedBy;
    notes;
    isActive;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, allergen: { required: true, type: () => String }, severity: { required: true, type: () => String }, reaction: { required: false, type: () => String }, treatment: { required: false, type: () => String }, identifiedDate: { required: false, type: () => Date }, identifiedBy: { required: false, type: () => String }, notes: { required: false, type: () => String }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.AllergyDto = AllergyDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { description: 'Unique identifier for the allergy' }),
    __metadata("design:type", String)
], AllergyDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Name of the allergen' }),
    __metadata("design:type", String)
], AllergyDto.prototype, "allergen", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Severity level of the allergy' }),
    __metadata("design:type", String)
], AllergyDto.prototype, "severity", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Description of the allergic reaction' }),
    __metadata("design:type", String)
], AllergyDto.prototype, "reaction", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Treatment or medication for the allergy' }),
    __metadata("design:type", String)
], AllergyDto.prototype, "treatment", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Date when the allergy was first identified' }),
    __metadata("design:type", Date)
], AllergyDto.prototype, "identifiedDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Healthcare provider who identified the allergy' }),
    __metadata("design:type", String)
], AllergyDto.prototype, "identifiedBy", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Special notes or instructions' }),
    __metadata("design:type", String)
], AllergyDto.prototype, "notes", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Whether this allergy is currently active' }),
    __metadata("design:type", Boolean)
], AllergyDto.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Date when the record was created' }),
    __metadata("design:type", Date)
], AllergyDto.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Date when the record was last updated' }),
    __metadata("design:type", Date)
], AllergyDto.prototype, "updatedAt", void 0);
exports.AllergyDto = AllergyDto = __decorate([
    (0, graphql_1.ObjectType)('Allergy')
], AllergyDto);
//# sourceMappingURL=allergy.dto.js.map