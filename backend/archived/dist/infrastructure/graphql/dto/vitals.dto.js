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
exports.VitalsDto = void 0;
const openapi = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
let VitalsDto = class VitalsDto {
    id;
    studentId;
    temperature;
    temperatureUnit;
    bloodPressureSystolic;
    bloodPressureDiastolic;
    heartRate;
    respiratoryRate;
    oxygenSaturation;
    weight;
    weightUnit;
    height;
    heightUnit;
    notes;
    recordedById;
    recordedAt;
    createdAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, temperature: { required: false, type: () => Number }, temperatureUnit: { required: false, type: () => String }, bloodPressureSystolic: { required: false, type: () => Number }, bloodPressureDiastolic: { required: false, type: () => Number }, heartRate: { required: false, type: () => Number }, respiratoryRate: { required: false, type: () => Number }, oxygenSaturation: { required: false, type: () => Number }, weight: { required: false, type: () => Number }, weightUnit: { required: false, type: () => String }, height: { required: false, type: () => Number }, heightUnit: { required: false, type: () => String }, notes: { required: false, type: () => String }, recordedById: { required: false, type: () => String }, recordedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date } };
    }
};
exports.VitalsDto = VitalsDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], VitalsDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], VitalsDto.prototype, "studentId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], VitalsDto.prototype, "temperature", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VitalsDto.prototype, "temperatureUnit", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], VitalsDto.prototype, "bloodPressureSystolic", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], VitalsDto.prototype, "bloodPressureDiastolic", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], VitalsDto.prototype, "heartRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], VitalsDto.prototype, "respiratoryRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], VitalsDto.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], VitalsDto.prototype, "weight", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VitalsDto.prototype, "weightUnit", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], VitalsDto.prototype, "height", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VitalsDto.prototype, "heightUnit", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VitalsDto.prototype, "notes", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], VitalsDto.prototype, "recordedById", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], VitalsDto.prototype, "recordedAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], VitalsDto.prototype, "createdAt", void 0);
exports.VitalsDto = VitalsDto = __decorate([
    (0, graphql_1.ObjectType)()
], VitalsDto);
//# sourceMappingURL=vitals.dto.js.map