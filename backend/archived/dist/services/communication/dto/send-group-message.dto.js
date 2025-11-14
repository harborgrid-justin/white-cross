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
exports.SendGroupMessageDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const base_send_message_dto_1 = require("./base-send-message.dto");
class SendGroupMessageDto extends base_send_message_dto_1.BaseSendMessageDto {
    conversationId;
    mentions;
    static _OPENAPI_METADATA_FACTORY() {
        return { conversationId: { required: true, type: () => String, format: "uuid" }, mentions: { required: false, type: () => [String], format: "uuid" } };
    }
}
exports.SendGroupMessageDto = SendGroupMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conversation ID to send the message to',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SendGroupMessageDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Mention specific users by their IDs',
        type: [String],
        example: ['user-id-1', 'user-id-2'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], SendGroupMessageDto.prototype, "mentions", void 0);
//# sourceMappingURL=send-group-message.dto.js.map