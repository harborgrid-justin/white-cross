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
exports.EmergencyContactDto = void 0;
const openapi = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
let EmergencyContactDto = class EmergencyContactDto {
    id;
    firstName;
    lastName;
    phone;
    email;
    relationshipType;
    priority;
    isActive;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, phone: { required: true, type: () => String }, email: { required: false, type: () => String }, relationshipType: { required: true, type: () => String }, priority: { required: true, type: () => Number }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.EmergencyContactDto = EmergencyContactDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { description: 'Unique identifier for the emergency contact' }),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'First name of the emergency contact' }),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "firstName", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Last name of the emergency contact' }),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "lastName", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Phone number of the emergency contact' }),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'Email address of the emergency contact' }),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Relationship to the student' }),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "relationshipType", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Priority level (1=primary, 2=secondary, etc.)' }),
    __metadata("design:type", Number)
], EmergencyContactDto.prototype, "priority", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Whether this contact is currently active' }),
    __metadata("design:type", Boolean)
], EmergencyContactDto.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Date when the contact was created' }),
    __metadata("design:type", Date)
], EmergencyContactDto.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'Date when the contact was last updated' }),
    __metadata("design:type", Date)
], EmergencyContactDto.prototype, "updatedAt", void 0);
exports.EmergencyContactDto = EmergencyContactDto = __decorate([
    (0, graphql_1.ObjectType)('EmergencyContact')
], EmergencyContactDto);
//# sourceMappingURL=emergency-contact.dto.js.map