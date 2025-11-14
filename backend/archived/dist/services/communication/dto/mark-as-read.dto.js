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
exports.MarkConversationAsReadDto = exports.MarkAsReadDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class MarkAsReadDto {
    messageIds;
    static _OPENAPI_METADATA_FACTORY() {
        return { messageIds: { required: true, type: () => [String], format: "uuid", minItems: 1 } };
    }
}
exports.MarkAsReadDto = MarkAsReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message IDs to mark as read',
        type: [String],
        minItems: 1,
        example: [
            '123e4567-e89b-12d3-a456-426614174000',
            '789e0123-e89b-12d3-a456-426614174000',
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], MarkAsReadDto.prototype, "messageIds", void 0);
class MarkConversationAsReadDto {
    conversationId;
    upToTimestamp;
    static _OPENAPI_METADATA_FACTORY() {
        return { conversationId: { required: true, type: () => String, format: "uuid" }, upToTimestamp: { required: false, type: () => String } };
    }
}
exports.MarkConversationAsReadDto = MarkConversationAsReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conversation ID to mark all messages as read',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MarkConversationAsReadDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional timestamp to mark messages read up to this point',
        example: '2025-10-29T12:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MarkConversationAsReadDto.prototype, "upToTimestamp", void 0);
//# sourceMappingURL=mark-as-read.dto.js.map