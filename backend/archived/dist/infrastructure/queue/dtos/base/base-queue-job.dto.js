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
exports.BaseQueueJobDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BaseQueueJobDto {
    createdAt;
    initiatedBy;
    jobId;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { createdAt: { required: true, type: () => Date, description: "Job creation timestamp" }, initiatedBy: { required: false, type: () => String, description: "User who initiated the job" }, jobId: { required: false, type: () => String, description: "Job identifier" }, metadata: { required: false, type: () => Object, description: "Additional metadata" } };
    }
}
exports.BaseQueueJobDto = BaseQueueJobDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], BaseQueueJobDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseQueueJobDto.prototype, "initiatedBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseQueueJobDto.prototype, "jobId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BaseQueueJobDto.prototype, "metadata", void 0);
//# sourceMappingURL=base-queue-job.dto.js.map