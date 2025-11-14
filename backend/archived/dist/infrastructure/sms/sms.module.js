"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const sms_service_1 = require("./sms.service");
const twilio_provider_1 = require("./providers/twilio.provider");
const phone_validator_service_1 = require("./services/phone-validator.service");
const sms_template_service_1 = require("./services/sms-template.service");
const rate_limiter_service_1 = require("./services/rate-limiter.service");
const cost_tracker_service_1 = require("./services/cost-tracker.service");
const sms_sender_service_1 = require("./services/sms-sender.service");
const sms_queue_processor_1 = require("./processors/sms-queue.processor");
let SmsModule = class SmsModule {
};
exports.SmsModule = SmsModule;
exports.SmsModule = SmsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            bull_1.BullModule.registerQueue({
                name: sms_queue_processor_1.SMS_QUEUE_NAME,
            }),
        ],
        providers: [
            sms_service_1.SmsService,
            twilio_provider_1.TwilioProvider,
            phone_validator_service_1.PhoneValidatorService,
            sms_template_service_1.SmsTemplateService,
            rate_limiter_service_1.RateLimiterService,
            cost_tracker_service_1.CostTrackerService,
            sms_sender_service_1.SmsSenderService,
            sms_queue_processor_1.SmsQueueProcessor,
        ],
        exports: [
            sms_service_1.SmsService,
            phone_validator_service_1.PhoneValidatorService,
            sms_template_service_1.SmsTemplateService,
            rate_limiter_service_1.RateLimiterService,
            cost_tracker_service_1.CostTrackerService,
        ],
    })
], SmsModule);
//# sourceMappingURL=sms.module.js.map