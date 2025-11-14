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
exports.WaitlistPriorityDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const add_waitlist_dto_1 = require("./add-waitlist.dto");
class WaitlistPriorityDto {
    priority;
    reason;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { priority: { required: true, enum: require("./add-waitlist.dto").WaitlistPriority }, reason: { required: true, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.WaitlistPriorityDto = WaitlistPriorityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New priority level for the waitlist entry',
        enum: add_waitlist_dto_1.WaitlistPriority,
        example: add_waitlist_dto_1.WaitlistPriority.HIGH,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(add_waitlist_dto_1.WaitlistPriority),
    __metadata("design:type", String)
], WaitlistPriorityDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for priority change',
        example: 'Medical emergency requiring immediate attention',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WaitlistPriorityDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the priority update',
        example: 'Sibling of current patient needs urgent care',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WaitlistPriorityDto.prototype, "notes", void 0);
//# sourceMappingURL=waitlist-priority.dto.js.map