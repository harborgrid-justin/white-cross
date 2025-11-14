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
exports.CreateWitnessStatementDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const witness_type_enum_1 = require("../enums/witness-type.enum");
class CreateWitnessStatementDto {
    witnessName;
    witnessType;
    witnessContact;
    statement;
    static _OPENAPI_METADATA_FACTORY() {
        return { witnessName: { required: true, type: () => String, minLength: 2 }, witnessType: { required: true, enum: require("../enums/witness-type.enum").WitnessType }, witnessContact: { required: false, type: () => String }, statement: { required: true, type: () => String, minLength: 20 } };
    }
}
exports.CreateWitnessStatementDto = CreateWitnessStatementDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Witness name (minimum 2 characters)',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Witness name must be at least 2 characters' }),
    __metadata("design:type", String)
], CreateWitnessStatementDto.prototype, "witnessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Witness type',
        enum: witness_type_enum_1.WitnessType,
        example: witness_type_enum_1.WitnessType.STAFF,
    }),
    (0, class_validator_1.IsEnum)(witness_type_enum_1.WitnessType),
    __metadata("design:type", String)
], CreateWitnessStatementDto.prototype, "witnessType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Witness contact information',
        example: 'john.doe@school.edu',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWitnessStatementDto.prototype, "witnessContact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Witness statement (minimum 20 characters)',
        example: 'I saw the student fall from the playground equipment at approximately 10:30 AM',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20, {
        message: 'Witness statement must be at least 20 characters for proper documentation',
    }),
    __metadata("design:type", String)
], CreateWitnessStatementDto.prototype, "statement", void 0);
//# sourceMappingURL=create-witness-statement.dto.js.map