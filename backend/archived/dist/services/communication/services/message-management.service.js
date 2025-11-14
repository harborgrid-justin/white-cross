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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageManagementService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../database/models");
const encryption_service_1 = require("../../../infrastructure/encryption/encryption.service");
const base_1 = require("../../../common/base");
let MessageManagementService = class MessageManagementService extends base_1.BaseService {
    messageModel;
    encryptionService;
    constructor(messageModel, encryptionService) {
        super("MessageManagementService");
        this.messageModel = messageModel;
        this.encryptionService = encryptionService;
    }
    async editMessage(messageId, dto, userId) {
        this.logInfo(`Editing message ${messageId} by user ${userId}`);
        const message = await this.messageModel.findByPk(messageId);
        if (!message) {
            throw new common_1.BadRequestException('Message not found');
        }
        if (message.senderId !== userId) {
            throw new common_1.BadRequestException('You can only edit your own messages');
        }
        let encryptedContent;
        if (message.encryptedContent) {
            const encryptionResult = await this.encryptionService.encrypt(dto.content);
            if (encryptionResult.success) {
                encryptedContent = encryptionResult.data;
            }
            else {
                throw new common_1.BadRequestException(`Encryption failed: ${encryptionResult.message}`);
            }
        }
        await message.update({
            content: dto.content,
            encryptedContent,
            attachments: dto.attachments !== undefined ? dto.attachments : message.attachments,
            isEdited: true,
            editedAt: new Date(),
            metadata: {
                ...message.metadata,
                ...dto.metadata,
                editHistory: [
                    {
                        editedAt: new Date(),
                        previousContent: message.content,
                    },
                ],
            },
        });
        return { message };
    }
    async deleteMessage(messageId, userId) {
        this.logInfo(`Deleting message ${messageId} by user ${userId}`);
        const message = await this.messageModel.findByPk(messageId);
        if (!message) {
            throw new common_1.BadRequestException('Message not found');
        }
        if (message.senderId !== userId) {
            throw new common_1.BadRequestException('You can only delete your own messages');
        }
        await message.destroy();
    }
};
exports.MessageManagementService = MessageManagementService;
exports.MessageManagementService = MessageManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Message)),
    __metadata("design:paramtypes", [Object, encryption_service_1.EncryptionService])
], MessageManagementService);
//# sourceMappingURL=message-management.service.js.map