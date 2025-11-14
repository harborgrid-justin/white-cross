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
exports.HighRiskStudentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const health_risk_score_dto_1 = require("./health-risk-score.dto");
class HighRiskStudentDto {
    student;
    assessment;
    static _OPENAPI_METADATA_FACTORY() {
        return { student: { required: true, type: () => Object }, assessment: { required: true, type: () => require("./health-risk-score.dto").HealthRiskScoreDto } };
    }
}
exports.HighRiskStudentDto = HighRiskStudentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student information',
    }),
    __metadata("design:type", Object)
], HighRiskStudentDto.prototype, "student", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Health risk assessment for the student',
        type: health_risk_score_dto_1.HealthRiskScoreDto,
    }),
    __metadata("design:type", health_risk_score_dto_1.HealthRiskScoreDto)
], HighRiskStudentDto.prototype, "assessment", void 0);
//# sourceMappingURL=high-risk-student.dto.js.map