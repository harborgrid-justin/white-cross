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
exports.IntegrationTestResultDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class IntegrationTestResultDto {
    success;
    message;
    responseTime;
    details;
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Boolean }, message: { required: true, type: () => String }, responseTime: { required: false, type: () => Number }, details: { required: false, type: () => Object } };
    }
}
exports.IntegrationTestResultDto = IntegrationTestResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the test was successful' }),
    __metadata("design:type", Boolean)
], IntegrationTestResultDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Test result message' }),
    __metadata("design:type", String)
], IntegrationTestResultDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Response time in milliseconds' }),
    __metadata("design:type", Number)
], IntegrationTestResultDto.prototype, "responseTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional test details' }),
    __metadata("design:type", Object)
], IntegrationTestResultDto.prototype, "details", void 0);
//# sourceMappingURL=integration-test-result.dto.js.map