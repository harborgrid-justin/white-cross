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
exports.HealthRecordFilterInputDto = exports.HealthRecordUpdateInputDto = exports.HealthRecordInputDto = exports.HealthRecordListResponseDto = exports.HealthRecordDto = void 0;
const openapi = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
const graphql_scalars_1 = require("graphql-scalars");
const pagination_dto_1 = require("./pagination.dto");
const base_health_record_fields_dto_1 = require("./base/base-health-record-fields.dto");
const class_validator_1 = require("class-validator");
let HealthRecordDto = class HealthRecordDto {
    id;
    studentId;
    recordType;
    title;
    description;
    recordDate;
    provider;
    providerNpi;
    facility;
    facilityNpi;
    diagnosis;
    diagnosisCode;
    treatment;
    followUpRequired;
    followUpDate;
    followUpCompleted;
    attachments;
    metadata;
    isConfidential;
    notes;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, recordType: { required: true, type: () => String }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, recordDate: { required: true, type: () => Date }, provider: { required: false, type: () => String }, providerNpi: { required: false, type: () => String }, facility: { required: false, type: () => String }, facilityNpi: { required: false, type: () => String }, diagnosis: { required: false, type: () => String }, diagnosisCode: { required: false, type: () => String }, treatment: { required: false, type: () => String }, followUpRequired: { required: true, type: () => Boolean }, followUpDate: { required: false, type: () => Date }, followUpCompleted: { required: true, type: () => Boolean }, attachments: { required: true, type: () => [String] }, metadata: { required: false, type: () => Object }, isConfidential: { required: true, type: () => Boolean }, notes: { required: false, type: () => String }, createdBy: { required: false, type: () => String }, updatedBy: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.HealthRecordDto = HealthRecordDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "studentId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "recordType", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], HealthRecordDto.prototype, "recordDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "provider", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "providerNpi", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "facility", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "facilityNpi", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "diagnosis", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "diagnosisCode", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "treatment", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], HealthRecordDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], HealthRecordDto.prototype, "followUpDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], HealthRecordDto.prototype, "followUpCompleted", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], HealthRecordDto.prototype, "attachments", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_scalars_1.GraphQLJSON, { nullable: true }),
    __metadata("design:type", Object)
], HealthRecordDto.prototype, "metadata", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], HealthRecordDto.prototype, "isConfidential", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "notes", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "createdBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], HealthRecordDto.prototype, "updatedBy", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], HealthRecordDto.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], HealthRecordDto.prototype, "updatedAt", void 0);
exports.HealthRecordDto = HealthRecordDto = __decorate([
    (0, graphql_1.ObjectType)()
], HealthRecordDto);
let HealthRecordListResponseDto = class HealthRecordListResponseDto {
    healthRecords;
    pagination;
    static _OPENAPI_METADATA_FACTORY() {
        return { healthRecords: { required: true, type: () => [require("./health-record.dto").HealthRecordDto] }, pagination: { required: true, type: () => require("./pagination.dto").PaginationDto } };
    }
};
exports.HealthRecordListResponseDto = HealthRecordListResponseDto;
__decorate([
    (0, graphql_1.Field)(() => [HealthRecordDto]),
    __metadata("design:type", Array)
], HealthRecordListResponseDto.prototype, "healthRecords", void 0);
__decorate([
    (0, graphql_1.Field)(() => pagination_dto_1.PaginationDto),
    __metadata("design:type", pagination_dto_1.PaginationDto)
], HealthRecordListResponseDto.prototype, "pagination", void 0);
exports.HealthRecordListResponseDto = HealthRecordListResponseDto = __decorate([
    (0, graphql_1.ObjectType)()
], HealthRecordListResponseDto);
let HealthRecordInputDto = class HealthRecordInputDto extends base_health_record_fields_dto_1.BaseHealthRecordFieldsDto {
    studentId;
    recordType;
    title;
    description;
    recordDate;
    attachments;
    metadata;
    isConfidential;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, recordType: { required: true, type: () => String, minLength: 1, maxLength: 100 }, title: { required: true, type: () => String, minLength: 1, maxLength: 200 }, description: { required: true, type: () => String, minLength: 1, maxLength: 2000 }, recordDate: { required: true, type: () => Date }, attachments: { required: false, type: () => [String] }, metadata: { required: false, type: () => Object }, isConfidential: { required: false, type: () => Boolean }, notes: { required: false, type: () => String, maxLength: 5000 } };
    }
};
exports.HealthRecordInputDto = HealthRecordInputDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, class_validator_1.IsUUID)(4, { message: 'Student ID must be a valid UUID' }),
    __metadata("design:type", String)
], HealthRecordInputDto.prototype, "studentId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Record type must not be empty' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Record type must not exceed 100 characters' }),
    __metadata("design:type", String)
], HealthRecordInputDto.prototype, "recordType", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Title must not be empty' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Title must not exceed 200 characters' }),
    __metadata("design:type", String)
], HealthRecordInputDto.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Description must not be empty' }),
    (0, class_validator_1.MaxLength)(2000, { message: 'Description must not exceed 2000 characters' }),
    __metadata("design:type", String)
], HealthRecordInputDto.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid date format for record date' }),
    __metadata("design:type", Date)
], HealthRecordInputDto.prototype, "recordDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true, defaultValue: [] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], HealthRecordInputDto.prototype, "attachments", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_scalars_1.GraphQLJSON, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], HealthRecordInputDto.prototype, "metadata", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthRecordInputDto.prototype, "isConfidential", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000, { message: 'Notes must not exceed 5000 characters' }),
    __metadata("design:type", String)
], HealthRecordInputDto.prototype, "notes", void 0);
exports.HealthRecordInputDto = HealthRecordInputDto = __decorate([
    (0, graphql_1.InputType)()
], HealthRecordInputDto);
let HealthRecordUpdateInputDto = class HealthRecordUpdateInputDto extends base_health_record_fields_dto_1.BaseHealthRecordFieldsDto {
    recordType;
    title;
    description;
    recordDate;
    followUpCompleted;
    attachments;
    metadata;
    isConfidential;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { recordType: { required: false, type: () => String, minLength: 1, maxLength: 100 }, title: { required: false, type: () => String, minLength: 1, maxLength: 200 }, description: { required: false, type: () => String, minLength: 1, maxLength: 2000 }, recordDate: { required: false, type: () => Date }, followUpCompleted: { required: false, type: () => Boolean }, attachments: { required: false, type: () => [String] }, metadata: { required: false, type: () => Object }, isConfidential: { required: false, type: () => Boolean }, notes: { required: false, type: () => String, maxLength: 5000 } };
    }
};
exports.HealthRecordUpdateInputDto = HealthRecordUpdateInputDto;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Record type must not be empty' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Record type must not exceed 100 characters' }),
    __metadata("design:type", String)
], HealthRecordUpdateInputDto.prototype, "recordType", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Title must not be empty' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Title must not exceed 200 characters' }),
    __metadata("design:type", String)
], HealthRecordUpdateInputDto.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Description must not be empty' }),
    (0, class_validator_1.MaxLength)(2000, { message: 'Description must not exceed 2000 characters' }),
    __metadata("design:type", String)
], HealthRecordUpdateInputDto.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid date format for record date' }),
    __metadata("design:type", Date)
], HealthRecordUpdateInputDto.prototype, "recordDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthRecordUpdateInputDto.prototype, "followUpCompleted", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], HealthRecordUpdateInputDto.prototype, "attachments", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_scalars_1.GraphQLJSON, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], HealthRecordUpdateInputDto.prototype, "metadata", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthRecordUpdateInputDto.prototype, "isConfidential", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000, { message: 'Notes must not exceed 5000 characters' }),
    __metadata("design:type", String)
], HealthRecordUpdateInputDto.prototype, "notes", void 0);
exports.HealthRecordUpdateInputDto = HealthRecordUpdateInputDto = __decorate([
    (0, graphql_1.InputType)()
], HealthRecordUpdateInputDto);
let HealthRecordFilterInputDto = class HealthRecordFilterInputDto {
    studentId;
    recordType;
    isConfidential;
    followUpRequired;
    followUpCompleted;
    fromDate;
    toDate;
    search;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false, type: () => String }, recordType: { required: false, type: () => String }, isConfidential: { required: false, type: () => Boolean }, followUpRequired: { required: false, type: () => Boolean }, followUpCompleted: { required: false, type: () => Boolean }, fromDate: { required: false, type: () => Date }, toDate: { required: false, type: () => Date }, search: { required: false, type: () => String } };
    }
};
exports.HealthRecordFilterInputDto = HealthRecordFilterInputDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthRecordFilterInputDto.prototype, "studentId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthRecordFilterInputDto.prototype, "recordType", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthRecordFilterInputDto.prototype, "isConfidential", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthRecordFilterInputDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthRecordFilterInputDto.prototype, "followUpCompleted", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid date format for from date' }),
    __metadata("design:type", Date)
], HealthRecordFilterInputDto.prototype, "fromDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid date format for to date' }),
    __metadata("design:type", Date)
], HealthRecordFilterInputDto.prototype, "toDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthRecordFilterInputDto.prototype, "search", void 0);
exports.HealthRecordFilterInputDto = HealthRecordFilterInputDto = __decorate([
    (0, graphql_1.InputType)()
], HealthRecordFilterInputDto);
//# sourceMappingURL=health-record.dto.js.map