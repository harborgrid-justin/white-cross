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
exports.CreateProtocolDto = exports.ProtocolDecisionPointDto = exports.ProtocolStepDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const protocol_status_enum_1 = require("../../enums/protocol-status.enum");
class ProtocolStepDto {
    order;
    title;
    description;
    required;
    static _OPENAPI_METADATA_FACTORY() {
        return { order: { required: true, type: () => Number }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, required: { required: true, type: () => Boolean } };
    }
}
exports.ProtocolStepDto = ProtocolStepDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Step order', example: 1 }),
    __metadata("design:type", Number)
], ProtocolStepDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Step title', example: 'Initial Assessment' }),
    __metadata("design:type", String)
], ProtocolStepDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Step description',
        example: 'Assess patient vital signs and symptoms',
    }),
    __metadata("design:type", String)
], ProtocolStepDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is this step required?', default: true }),
    __metadata("design:type", Boolean)
], ProtocolStepDto.prototype, "required", void 0);
class ProtocolDecisionPointDto {
    step;
    condition;
    ifTrue;
    ifFalse;
    static _OPENAPI_METADATA_FACTORY() {
        return { step: { required: true, type: () => Number }, condition: { required: true, type: () => String }, ifTrue: { required: true, type: () => String }, ifFalse: { required: true, type: () => String } };
    }
}
exports.ProtocolDecisionPointDto = ProtocolDecisionPointDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Step number where decision occurs', example: 3 }),
    __metadata("design:type", Number)
], ProtocolDecisionPointDto.prototype, "step", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Condition to evaluate',
        example: 'Temperature > 101°F',
    }),
    __metadata("design:type", String)
], ProtocolDecisionPointDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action if condition is true',
        example: 'Proceed to fever protocol',
    }),
    __metadata("design:type", String)
], ProtocolDecisionPointDto.prototype, "ifTrue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action if condition is false',
        example: 'Continue with standard care',
    }),
    __metadata("design:type", String)
], ProtocolDecisionPointDto.prototype, "ifFalse", void 0);
class CreateProtocolDto {
    name;
    code;
    version;
    category;
    description;
    indications;
    contraindications;
    steps;
    decisionPoints;
    requiredEquipment;
    medications;
    status;
    createdBy;
    effectiveDate;
    reviewDate;
    references;
    tags;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, code: { required: true, type: () => String }, version: { required: true, type: () => String }, category: { required: true, type: () => String }, description: { required: true, type: () => String }, indications: { required: true, type: () => [String] }, contraindications: { required: false, type: () => [String] }, steps: { required: true, type: () => [require("./create-protocol.dto").ProtocolStepDto] }, decisionPoints: { required: false, type: () => [require("./create-protocol.dto").ProtocolDecisionPointDto] }, requiredEquipment: { required: false, type: () => [String] }, medications: { required: false, type: () => [String] }, status: { required: false, enum: require("../../enums/protocol-status.enum").ProtocolStatus }, createdBy: { required: true, type: () => String, format: "uuid" }, effectiveDate: { required: false, type: () => Date }, reviewDate: { required: false, type: () => Date }, references: { required: false, type: () => [String] }, tags: { required: false, type: () => [String] } };
    }
}
exports.CreateProtocolDto = CreateProtocolDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Protocol name',
        example: 'Asthma Management Protocol',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique protocol code', example: 'ASTHMA-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Protocol version', example: '1.0' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Protocol category', example: 'Respiratory' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed description of protocol' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clinical indications for using this protocol',
        example: ['Acute asthma exacerbation', 'Wheezing'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateProtocolDto.prototype, "indications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contraindications',
        example: ['Severe respiratory distress'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProtocolDto.prototype, "contraindications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Protocol steps', type: [ProtocolStepDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProtocolStepDto),
    __metadata("design:type", Array)
], CreateProtocolDto.prototype, "steps", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Decision points in protocol',
        type: [ProtocolDecisionPointDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProtocolDecisionPointDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProtocolDto.prototype, "decisionPoints", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Required equipment',
        example: ['Peak flow meter', 'Nebulizer'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProtocolDto.prototype, "requiredEquipment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Medications used in protocol',
        example: ['Albuterol', 'Prednisone'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProtocolDto.prototype, "medications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Initial status',
        enum: protocol_status_enum_1.ProtocolStatus,
        default: protocol_status_enum_1.ProtocolStatus.DRAFT,
    }),
    (0, class_validator_1.IsEnum)(protocol_status_enum_1.ProtocolStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff member creating protocol' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective date for protocol' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateProtocolDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Next review date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateProtocolDto.prototype, "reviewDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'References and citations',
        example: ['NHLBI Guidelines 2020'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProtocolDto.prototype, "references", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tags for categorization',
        example: ['pediatric', 'emergency'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProtocolDto.prototype, "tags", void 0);
//# sourceMappingURL=create-protocol.dto.js.map