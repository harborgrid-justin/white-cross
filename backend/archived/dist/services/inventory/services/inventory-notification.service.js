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
exports.InventoryNotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const email_1 = require("../../../infrastructure/email");
const models_1 = require("../../../database/models");
let InventoryNotificationService = class InventoryNotificationService extends base_1.BaseService {
    requestContext;
    configService;
    emailService;
    constructor(requestContext, configService, emailService) {
        super(requestContext);
        this.requestContext = requestContext;
        this.configService = configService;
        this.emailService = emailService;
    }
    async sendAlertNotifications(alerts, reorderSuggestions) {
        const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL');
        const highAlerts = alerts.filter((a) => a.severity === 'HIGH');
        if (criticalAlerts.length > 0) {
            this.logger.warn(`CRITICAL INVENTORY ALERTS: ${criticalAlerts.length} items`, {
                alerts: criticalAlerts.map((a) => `${a.medicationName} - ${a.type}`),
            });
            await this.sendCriticalAlertNotifications(criticalAlerts, reorderSuggestions);
        }
        if (highAlerts.length > 0) {
            this.logger.warn(`HIGH PRIORITY INVENTORY ALERTS: ${highAlerts.length} items`, {
                alerts: highAlerts.map((a) => `${a.medicationName} - ${a.type}`),
            });
            await this.sendHighPriorityAlertNotifications(highAlerts, reorderSuggestions);
        }
        this.logger.log(`Inventory alerts summary: ${alerts.length} total (${criticalAlerts.length} critical, ${highAlerts.length} high)`);
    }
    async sendCriticalAlertNotifications(alerts, reorderSuggestions) {
        try {
            const adminEmails = this.configService
                .get('INVENTORY_ALERT_EMAILS', '')
                .split(',')
                .filter((e) => e.trim());
            const adminPhones = this.configService
                .get('INVENTORY_ALERT_PHONES', '')
                .split(',')
                .filter((p) => p.trim());
            if (adminEmails.length === 0 && adminPhones.length === 0) {
                this.logger.warn('No notification recipients configured for inventory alerts');
                return;
            }
            const htmlMessage = this.buildAlertMessage(alerts, 'CRITICAL', reorderSuggestions);
            const subject = `CRITICAL: ${alerts.length} Medication Inventory Alert(s)`;
            for (const email of adminEmails) {
                try {
                    const delivery = await models_1.MessageDelivery.create({
                        recipientType: models_1.RecipientType.ADMINISTRATOR,
                        recipientId: 'system',
                        channel: models_1.DeliveryChannelType.EMAIL,
                        status: models_1.DeliveryStatus.PENDING,
                        contactInfo: email,
                        messageId: `inventory-alert-${Date.now()}`,
                    });
                    const result = await this.emailService.sendEmail(email, {
                        subject,
                        body: this.convertHtmlToText(htmlMessage),
                        html: htmlMessage,
                    });
                    await delivery.update({
                        status: result.success ? models_1.DeliveryStatus.SENT : models_1.DeliveryStatus.FAILED,
                        sentAt: new Date(),
                        deliveredAt: result.success ? new Date() : undefined,
                        externalId: result.messageId,
                        failureReason: result.error,
                    });
                    this.logger.log(`Critical inventory alert sent to: ${email}`);
                }
                catch (error) {
                    this.logger.error(`Failed to send critical alert email to ${email}`, error);
                }
            }
            for (const phone of adminPhones) {
                this.logger.debug(`Critical inventory alert SMS would be sent to: ${phone} (not implemented)`);
            }
            this.logger.log(`Critical inventory notifications sent to ${adminEmails.length} emails`);
        }
        catch (error) {
            this.logger.error('Failed to send critical inventory alerts', error);
        }
    }
    async sendHighPriorityAlertNotifications(alerts, reorderSuggestions) {
        try {
            const adminEmails = this.configService
                .get('INVENTORY_ALERT_EMAILS', '')
                .split(',')
                .filter((e) => e.trim());
            if (adminEmails.length === 0) {
                this.logger.warn('No email recipients configured for inventory alerts');
                return;
            }
            const htmlMessage = this.buildAlertMessage(alerts, 'HIGH', reorderSuggestions);
            const subject = `HIGH PRIORITY: ${alerts.length} Medication Inventory Alert(s)`;
            for (const email of adminEmails) {
                try {
                    const delivery = await models_1.MessageDelivery.create({
                        recipientType: models_1.RecipientType.ADMINISTRATOR,
                        recipientId: 'system',
                        channel: models_1.DeliveryChannelType.EMAIL,
                        status: models_1.DeliveryStatus.PENDING,
                        contactInfo: email,
                        messageId: `inventory-alert-${Date.now()}`,
                    });
                    const result = await this.emailService.sendEmail(email, {
                        subject,
                        body: this.convertHtmlToText(htmlMessage),
                        html: htmlMessage,
                    });
                    await delivery.update({
                        status: result.success ? models_1.DeliveryStatus.SENT : models_1.DeliveryStatus.FAILED,
                        sentAt: new Date(),
                        deliveredAt: result.success ? new Date() : undefined,
                        externalId: result.messageId,
                        failureReason: result.error,
                    });
                    this.logger.log(`High priority inventory alert sent to: ${email}`);
                }
                catch (error) {
                    this.logger.error(`Failed to send high priority alert email to ${email}`, error);
                }
            }
            this.logger.log(`High priority inventory notifications sent to ${adminEmails.length} emails`);
        }
        catch (error) {
            this.logger.error('Failed to send high priority inventory alerts', error);
        }
    }
    async sendDisposalNotification(disposalRecords) {
        try {
            const adminEmails = this.configService
                .get('INVENTORY_ALERT_EMAILS', '')
                .split(',')
                .filter((e) => e.trim());
            if (adminEmails.length === 0) {
                this.logger.warn('No email recipients configured for disposal notifications');
                return;
            }
            const htmlMessage = this.buildDisposalNotificationMessage(disposalRecords);
            const subject = `Medication Disposal Required: ${disposalRecords.length} Item(s)`;
            for (const email of adminEmails) {
                try {
                    const delivery = await models_1.MessageDelivery.create({
                        recipientType: models_1.RecipientType.ADMINISTRATOR,
                        recipientId: 'system',
                        channel: models_1.DeliveryChannelType.EMAIL,
                        status: models_1.DeliveryStatus.PENDING,
                        contactInfo: email,
                        messageId: `disposal-${Date.now()}`,
                    });
                    const result = await this.emailService.sendEmail(email, {
                        subject,
                        body: this.convertHtmlToText(htmlMessage),
                        html: htmlMessage,
                    });
                    await delivery.update({
                        status: result.success ? models_1.DeliveryStatus.SENT : models_1.DeliveryStatus.FAILED,
                        sentAt: new Date(),
                        deliveredAt: result.success ? new Date() : undefined,
                        externalId: result.messageId,
                        failureReason: result.error,
                    });
                    this.logger.log(`Disposal notification sent to: ${email}`);
                }
                catch (error) {
                    this.logger.error(`Failed to send disposal notification to ${email}`, error);
                }
            }
        }
        catch (error) {
            this.logger.error('Failed to send disposal notifications', error);
        }
    }
    buildAlertMessage(alerts, severity, reorderSuggestions) {
        const groupedByType = alerts.reduce((acc, alert) => {
            if (!acc[alert.type]) {
                acc[alert.type] = [];
            }
            acc[alert.type].push(alert);
            return acc;
        }, {});
        let message = `<html><body>`;
        message += `<h2 style="color: ${severity === 'CRITICAL' ? '#d32f2f' : '#f57c00'};">${severity} Medication Inventory Alert</h2>`;
        message += `<p>The following medications require immediate attention:</p>`;
        for (const [type, typeAlerts] of Object.entries(groupedByType)) {
            message += `<h3>${type.replace(/_/g, ' ')}</h3>`;
            message += `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">`;
            message += `<tr style="background-color: #f0f0f0;">`;
            message += `<th>Medication</th><th>Batch</th><th>Details</th><th>Action Required</th>`;
            message += `</tr>`;
            for (const alert of typeAlerts) {
                message += `<tr>`;
                message += `<td><strong>${alert.medicationName}</strong></td>`;
                message += `<td>${alert.batchNumber}</td>`;
                message += `<td>`;
                switch (alert.type) {
                    case 'EXPIRED':
                        message += `EXPIRED on ${alert.expirationDate?.toLocaleDateString()}<br>`;
                        message += `Quantity: ${alert.quantity} units`;
                        break;
                    case 'NEAR_EXPIRY': {
                        const daysUntilExpiry = alert.expirationDate
                            ? Math.ceil((alert.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                            : 0;
                        message += `Expiring in ${daysUntilExpiry} days (${alert.expirationDate?.toLocaleDateString()})<br>`;
                        message += `Quantity: ${alert.quantity} units`;
                        break;
                    }
                    case 'OUT_OF_STOCK':
                        message += `OUT OF STOCK<br>`;
                        message += `Reorder Level: ${alert.reorderLevel}`;
                        break;
                    case 'LOW_STOCK':
                        message += `LOW STOCK<br>`;
                        message += `Current: ${alert.quantity} units<br>`;
                        message += `Reorder Level: ${alert.reorderLevel}`;
                        break;
                }
                message += `</td>`;
                message += `<td>`;
                switch (alert.type) {
                    case 'EXPIRED':
                        message += `<strong style="color: #d32f2f;">Remove from inventory immediately</strong>`;
                        break;
                    case 'NEAR_EXPIRY':
                        message += `Plan disposal or prioritize usage`;
                        break;
                    case 'OUT_OF_STOCK':
                        message += `<strong style="color: #d32f2f;">Order immediately</strong>`;
                        break;
                    case 'LOW_STOCK':
                        message += `Review and reorder soon`;
                        break;
                }
                message += `</td>`;
                message += `</tr>`;
            }
            message += `</table>`;
        }
        if (reorderSuggestions && reorderSuggestions.length > 0) {
            const relevantSuggestions = reorderSuggestions.filter((s) => s.priority === 'CRITICAL' || s.priority === 'HIGH');
            if (relevantSuggestions.length > 0) {
                message += `<h3>Recommended Reorder Actions</h3>`;
                message += `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">`;
                message += `<tr style="background-color: #f0f0f0;">`;
                message += `<th>Medication</th><th>Current Qty</th><th>Suggested Order</th><th>Priority</th><th>Days Remaining</th>`;
                message += `</tr>`;
                for (const suggestion of relevantSuggestions) {
                    message += `<tr>`;
                    message += `<td>${suggestion.medicationName}</td>`;
                    message += `<td>${suggestion.currentQuantity}</td>`;
                    message += `<td><strong>${suggestion.suggestedOrderQuantity}</strong></td>`;
                    message += `<td style="color: ${suggestion.priority === 'CRITICAL' ? '#d32f2f' : '#f57c00'};">${suggestion.priority}</td>`;
                    message += `<td>${Math.round(suggestion.estimatedDaysRemaining)}</td>`;
                    message += `</tr>`;
                }
                message += `</table>`;
            }
        }
        message += `<p><strong>Total Alerts: ${alerts.length}</strong></p>`;
        message += `<p>Please log in to the White Cross platform to take appropriate action.</p>`;
        message += `<hr>`;
        message += `<p style="font-size: 0.9em; color: #666;">This is an automated message from White Cross Healthcare Platform.</p>`;
        message += `</body></html>`;
        return message;
    }
    buildDisposalNotificationMessage(disposalRecords) {
        let message = `<html><body>`;
        message += `<h2 style="color: #d32f2f;">Medication Disposal Required</h2>`;
        message += `<p>The following expired medications have been marked for disposal:</p>`;
        message += `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">`;
        message += `<tr style="background-color: #f0f0f0;"><th>Medication</th><th>Batch</th><th>Quantity</th><th>Reason</th></tr>`;
        for (const record of disposalRecords) {
            message += `<tr>`;
            message += `<td>${record.medicationName}</td>`;
            message += `<td>${record.batchNumber}</td>`;
            message += `<td>${record.quantity}</td>`;
            message += `<td>${record.reason}</td>`;
            message += `</tr>`;
        }
        message += `</table>`;
        message += `<p><strong>Total Items: ${disposalRecords.length}</strong></p>`;
        message += `<p>Please follow proper disposal procedures as per regulatory requirements.</p>`;
        message += `<p><strong>Note:</strong> Controlled substances require witnessing and DEA-authorized disposal.</p>`;
        message += `<hr>`;
        message += `<p style="font-size: 0.9em; color: #666;">This is an automated message from White Cross Healthcare Platform.</p>`;
        message += `</body></html>`;
        return message;
    }
    convertHtmlToText(html) {
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/\s+/g, ' ')
            .trim();
    }
};
exports.InventoryNotificationService = InventoryNotificationService;
exports.InventoryNotificationService = InventoryNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService,
        config_1.ConfigService,
        email_1.EmailService])
], InventoryNotificationService);
//# sourceMappingURL=inventory-notification.service.js.map