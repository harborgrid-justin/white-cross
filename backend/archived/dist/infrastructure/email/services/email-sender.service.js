"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSenderService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const email_types_1 = require("../types/email.types");
const email_template_service_1 = require("../email-template.service");
const email_statistics_service_1 = require("./email-statistics.service");
let EmailSenderService = class EmailSenderService extends base_1.BaseService {
    configService;
    templateService;
    statisticsService;
    transporter;
    defaultFrom;
    defaultReplyTo;
    isProduction;
    constructor(logger, configService, templateService, statisticsService) {
        super({
            serviceName: 'EmailSenderService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
        this.templateService = templateService;
        this.statisticsService = statisticsService;
        this.isProduction = this.configService.get('NODE_ENV') === 'production';
        this.defaultFrom = this.configService.get('EMAIL_FROM', 'noreply@whitecross.healthcare');
        this.defaultReplyTo = this.configService.get('EMAIL_REPLY_TO');
        this.transporter = this.createTransporter();
    }
    createTransporter() {
        const transportType = this.configService.get('EMAIL_TRANSPORT', 'smtp');
        if (transportType === 'smtp') {
            return nodemailer.createTransport({
                host: this.configService.get('EMAIL_SMTP_HOST', 'localhost'),
                port: this.configService.get('EMAIL_SMTP_PORT', 587),
                secure: this.configService.get('EMAIL_SMTP_SECURE', false),
                auth: {
                    user: this.configService.get('EMAIL_SMTP_USER', ''),
                    pass: this.configService.get('EMAIL_SMTP_PASS', ''),
                },
                pool: true,
                maxConnections: this.configService.get('EMAIL_SMTP_MAX_CONNECTIONS', 5),
                maxMessages: this.configService.get('EMAIL_SMTP_MAX_MESSAGES', 100),
                rateDelta: this.configService.get('EMAIL_SMTP_RATE_DELTA', 1000),
                rateLimit: this.configService.get('EMAIL_SMTP_RATE_LIMIT', 5),
            });
        }
        if (!this.isProduction) {
            this.logWarning('Using development transport (logging only)');
            return nodemailer.createTransport({
                streamTransport: true,
                newline: 'unix',
            });
        }
        const error = new Error(`Unsupported email transport type: ${transportType}`);
        this.logError(error.message);
        throw error;
    }
    async sendImmediate(emailData) {
        const startTime = Date.now();
        try {
            let htmlContent = emailData.html;
            let textContent = emailData.body;
            if (emailData.template && emailData.templateData) {
                try {
                    const rendered = await this.templateService.render(emailData.template, emailData.templateData);
                    htmlContent = rendered.html;
                    textContent = rendered.text;
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    this.logWarning(`Template rendering failed, using plain content: ${errorMessage}`);
                }
            }
            const mailOptions = {
                from: emailData.from || this.defaultFrom,
                to: emailData.to.join(', '),
                cc: emailData.cc?.join(', '),
                bcc: emailData.bcc?.join(', '),
                replyTo: emailData.replyTo || this.defaultReplyTo,
                subject: emailData.subject,
                text: textContent,
                html: htmlContent,
                priority: this.getNodemailerPriority(emailData.priority),
                headers: emailData.headers,
            };
            if (emailData.attachments && emailData.attachments.length > 0) {
                mailOptions.attachments = emailData.attachments.map((att) => ({
                    filename: att.filename,
                    content: att.content,
                    contentType: att.contentType,
                    contentDisposition: att.disposition,
                    cid: att.cid,
                }));
            }
            if (!this.isProduction) {
                this.logDebug('========== EMAIL ==========');
                this.logDebug(`From: ${String(mailOptions.from)}`);
                this.logDebug(`To: ${String(mailOptions.to)}`);
                if (mailOptions.cc)
                    this.logDebug(`CC: ${String(mailOptions.cc)}`);
                if (mailOptions.bcc)
                    this.logDebug(`BCC: ${String(mailOptions.bcc)}`);
                this.logDebug(`Subject: ${mailOptions.subject}`);
                this.logDebug(`Body:\n${textContent?.substring(0, 500)}...`);
                if (mailOptions.attachments) {
                    this.logDebug(`Attachments: ${mailOptions.attachments.length}`);
                }
                this.logDebug('===========================');
            }
            const info = await this.transporter.sendMail(mailOptions);
            const deliveryTime = Date.now() - startTime;
            this.statisticsService.recordSent(deliveryTime);
            return {
                success: true,
                messageId: info.messageId,
                timestamp: new Date(),
                recipients: emailData.to,
            };
        }
        catch (error) {
            this.statisticsService.recordFailed();
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logError(`Email send failed: ${errorMessage}`, errorStack);
            return {
                success: false,
                error: errorMessage,
                timestamp: new Date(),
                recipients: emailData.to,
            };
        }
    }
    async sendAlertEmail(to, subject, alertData) {
        const emailData = {
            to,
            subject,
            body: this.formatAlertEmailText(alertData),
            template: email_types_1.EmailTemplate.ALERT,
            templateData: alertData,
            priority: email_types_1.EmailPriority.URGENT,
        };
        return this.sendImmediate(emailData);
    }
    async sendGenericEmail(to, subject, body, html) {
        const emailData = {
            to,
            subject,
            body,
            html,
        };
        return this.sendImmediate(emailData);
    }
    async sendTemplatedEmail(emailData) {
        return this.sendImmediate(emailData);
    }
    async testConnection(to) {
        try {
            this.logInfo(`Testing email connection with recipient: ${to}`);
            const result = await this.sendGenericEmail([to], 'White Cross Email Service Test', 'This is a test email from White Cross Healthcare Platform. If you receive this, the email service is working correctly.');
            this.logInfo('Email test successful');
            return result.success;
        }
        catch (error) {
            this.logError('Email test failed:', error);
            return false;
        }
    }
    formatAlertEmailText(data) {
        return `
White Cross Healthcare Alert
=============================

Severity: ${data.severity}
Category: ${data.category}
Alert ID: ${data.alertId}
${data.timestamp ? `Time: ${data.timestamp.toLocaleString()}` : ''}

${data.title}

${data.message}

---
This is an automated message from White Cross Healthcare Platform.
Do not reply to this email.
    `.trim();
    }
    getNodemailerPriority(priority) {
        if (!priority)
            return undefined;
        const priorityMap = {
            [email_types_1.EmailPriority.URGENT]: 'high',
            [email_types_1.EmailPriority.HIGH]: 'high',
            [email_types_1.EmailPriority.NORMAL]: 'normal',
            [email_types_1.EmailPriority.LOW]: 'low',
        };
        return priorityMap[priority];
    }
    async close() {
        this.transporter.close();
        this.logInfo('Email transporter closed');
    }
};
exports.EmailSenderService = EmailSenderService;
exports.EmailSenderService = EmailSenderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService,
        email_template_service_1.EmailTemplateService,
        email_statistics_service_1.EmailStatisticsService])
], EmailSenderService);
//# sourceMappingURL=email-sender.service.js.map