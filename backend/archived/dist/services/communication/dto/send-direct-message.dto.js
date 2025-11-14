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
exports.SendDirectMessageDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const base_send_message_dto_1 = require("./base-send-message.dto");
class SendDirectMessageDto extends base_send_message_dto_1.BaseSendMessageDto {
    recipientId;
    static _OPENAPI_METADATA_FACTORY() {
        return { recipientId: { required: true, type: () => String, format: "uuid" } };
    }
}
exports.SendDirectMessageDto = SendDirectMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recipient user ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SendDirectMessageDto.prototype, "recipientId", void 0);
//# sourceMappingURL=send-direct-message.dto.js.map