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
exports.WebhookHandlerService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const base_1 = require("../../common/base");
const webhook_types_1 = require("../types/webhook.types");
let WebhookHandlerService = class WebhookHandlerService extends base_1.BaseService {
    constructor() {
        super("WebhookHandlerService");
    }
    validateSignature(payload, signature, secret) {
        try {
            const computedSignature = (0, crypto_1.createHmac)('sha256', secret)
                .update(payload)
                .digest('hex');
            return signature === computedSignature;
        }
        catch (error) {
            this.logError('Error validating webhook signature', error);
            return false;
        }
    }
    async processWebhookEvent(integrationId, eventType, payload) {
        this.logInfo(`Processing webhook event: ${eventType} for integration ${integrationId}`);
        switch (eventType) {
            case 'student.created':
                if ((0, webhook_types_1.isStudentCreatedPayload)(payload)) {
                    await this.handleStudentCreated(integrationId, payload);
                }
                break;
            case 'student.updated':
                if ((0, webhook_types_1.isStudentUpdatedPayload)(payload)) {
                    await this.handleStudentUpdated(integrationId, payload);
                }
                break;
            case 'health_record.updated':
                if ((0, webhook_types_1.isHealthRecordUpdatedPayload)(payload)) {
                    await this.handleHealthRecordUpdated(integrationId, payload);
                }
                break;
            default:
                this.logWarning(`Unknown webhook event type: ${eventType}`);
        }
    }
    async handleStudentCreated(integrationId, _payload) {
        this.logInfo(`Handling student created event for ${integrationId}`);
    }
    async handleStudentUpdated(integrationId, _payload) {
        this.logInfo(`Handling student updated event for ${integrationId}`);
    }
    async handleHealthRecordUpdated(integrationId, _payload) {
        this.logInfo(`Handling health record updated event for ${integrationId}`);
    }
};
exports.WebhookHandlerService = WebhookHandlerService;
exports.WebhookHandlerService = WebhookHandlerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WebhookHandlerService);
//# sourceMappingURL=webhook-handler.service.js.map