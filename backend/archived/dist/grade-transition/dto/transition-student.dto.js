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
exports.TransitionStudentDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TransitionStudentDto {
    newGrade;
    transitionedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { newGrade: { required: true, type: () => String }, transitionedBy: { required: true, type: () => String } };
    }
}
exports.TransitionStudentDto = TransitionStudentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New grade level for the student',
        example: '9',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TransitionStudentDto.prototype, "newGrade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who is performing the transition',
        example: 'user-123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TransitionStudentDto.prototype, "transitionedBy", void 0);
//# sourceMappingURL=transition-student.dto.js.map