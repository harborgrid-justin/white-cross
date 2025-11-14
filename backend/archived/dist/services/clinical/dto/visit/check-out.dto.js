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
exports.CheckOutDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const visit_disposition_enum_1 = require("../../enums/visit-disposition.enum");
class CheckOutDto {
    treatment;
    disposition;
    classesMissed;
    minutesMissed;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { treatment: { required: false, type: () => String }, disposition: { required: true, enum: require("../../enums/visit-disposition.enum").VisitDisposition }, classesMissed: { required: false, type: () => [String] }, minutesMissed: { required: false, type: () => Number, minimum: 0 }, notes: { required: false, type: () => String } };
    }
}
exports.CheckOutDto = CheckOutDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Treatment provided during visit',
        example: 'Administered acetaminophen 500mg, rest for 30 minutes',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckOutDto.prototype, "treatment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Visit disposition/outcome',
        enum: visit_disposition_enum_1.VisitDisposition,
        example: visit_disposition_enum_1.VisitDisposition.RETURN_TO_CLASS,
    }),
    (0, class_validator_1.IsEnum)(visit_disposition_enum_1.VisitDisposition),
    __metadata("design:type", String)
], CheckOutDto.prototype, "disposition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Classes missed during visit',
        example: ['Math 101', 'English 201'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CheckOutDto.prototype, "classesMissed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minutes of class time missed',
        example: 45,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CheckOutDto.prototype, "minutesMissed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about check-out',
        example: 'Symptoms improved, parent notified',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckOutDto.prototype, "notes", void 0);
//# sourceMappingURL=check-out.dto.js.map