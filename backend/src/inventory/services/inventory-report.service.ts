/**
 * Inventory Report Service
 *
 * Handles inventory report generation and distribution
 * Extracted from inventory-maintenance.processor.ts for better modularity
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from "../../common/base";
import { EmailService } from '@/infrastructure/email';
import { InventoryAlertService, InventoryStatus, InventoryAlert } from './inventory-alert.service';
import { InventoryReorderService } from './inventory-reorder.service';
import { ReorderSuggestion } from './inventory-notification.service';

export interface InventoryReport {
  generatedAt: Date;
  summary: InventoryStatus;
  alerts: InventoryAlert[];
  reorderSuggestions: ReorderSuggestion[];
  expiringItems: Array<{
    medicationName: string;
    batchNumber: string;
    quantity: number;
    expirationDate: Date;
    daysUntilExpiry: number;
  }>;
}

@Injectable()
export class InventoryReportService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly alertService: InventoryAlertService,
    private readonly reorderService: InventoryReorderService,
  ) {
    super(requestContext);
  }

  /**
   * Generate and send inventory report
   */
  async generateAndSendInventoryReport(organizationId?: string): Promise<void> {
    try {
      this.logger.log('Generating inventory report');

      const report = await this.generateInventoryReport(organizationId);

      // Generate CSV format
      const csvData = this.generateInventoryReportCSV(report);

      // Send report via email
      const adminEmails = this.configService
        .get<string>('INVENTORY_REPORT_EMAILS', '')
        .split(',')
        .filter((e) => e.trim());

      if (adminEmails.length === 0) {
        this.logger.warn('No email recipients configured for inventory reports');
        return;
      }

      const subject = `Daily Inventory Report - ${new Date().toLocaleDateString()}`;
      const htmlMessage = this.buildInventoryReportEmail(report);

      for (const email of adminEmails) {
        try {
          await this.emailService.sendEmail(email, {
            subject,
            body: this.convertHtmlToText(htmlMessage),
            html: htmlMessage,
          });

          this.logger.log(`Inventory report sent to: ${email}`);
        } catch (error) {
          this.logger.error(`Failed to send inventory report to ${email}`, error);
        }
      }
    } catch (error) {
      this.logger.error('Failed to generate and send inventory report', error);
    }
  }

  /**
   * Generate comprehensive inventory report
   */
  async generateInventoryReport(organizationId?: string): Promise<InventoryReport> {
    const summary = await this.alertService.getInventoryStatus();
    const alerts = await this.alertService.identifyCriticalAlerts(organizationId);
    const reorderSuggestions = await this.reorderService.generateReorderSuggestions(organizationId);
    const expiringItems = await this.alertService.getExpiringItems(organizationId);

    return {
      generatedAt: new Date(),
      summary,
      alerts,
      reorderSuggestions,
      expiringItems,
    };
  }

  /**
   * Generate CSV format inventory report
   */
  private generateInventoryReportCSV(report: InventoryReport): string {
    let csv = 'Inventory Report\n';
    csv += `Generated: ${report.generatedAt.toISOString()}\n\n`;

    csv += 'Summary\n';
    csv += 'Total Items,Expired,Near Expiry,Low Stock,OK\n';
    csv += `${report.summary.total_items},${report.summary.expired_items},${report.summary.near_expiry_items},${report.summary.low_stock_items},${report.summary.ok_items}\n\n`;

    if (report.alerts.length > 0) {
      csv += 'Alerts\n';
      csv += 'Type,Medication,Batch,Quantity,Severity\n';
      report.alerts.forEach((alert) => {
        csv += `${alert.type},${alert.medicationName},${alert.batchNumber},${alert.quantity},${alert.severity}\n`;
      });
      csv += '\n';
    }

    if (report.reorderSuggestions.length > 0) {
      csv += 'Reorder Suggestions\n';
      csv += 'Medication,Current Qty,Suggested Order,Priority,Days Remaining\n';
      report.reorderSuggestions.forEach((suggestion) => {
        csv += `${suggestion.medicationName},${suggestion.currentQuantity},${suggestion.suggestedOrderQuantity},${suggestion.priority},${Math.round(suggestion.estimatedDaysRemaining)}\n`;
      });
      csv += '\n';
    }

    return csv;
  }

  /**
   * Build HTML email for inventory report
   */
  private buildInventoryReportEmail(report: InventoryReport): string {
    let html = `<html><body>`;
    html += `<h2>Daily Inventory Report</h2>`;
    html += `<p>Generated: ${report.generatedAt.toLocaleString()}</p>`;

    // Summary section
    html += `<h3>Summary</h3>`;
    html += `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">`;
    html += `<tr style="background-color: #f0f0f0;">`;
    html += `<th>Total Items</th><th>Expired</th><th>Near Expiry</th><th>Low Stock</th><th>OK</th>`;
    html += `</tr>`;
    html += `<tr>`;
    html += `<td>${report.summary.total_items}</td>`;
    html += `<td style="color: ${report.summary.expired_items > 0 ? '#d32f2f' : 'inherit'};">${report.summary.expired_items}</td>`;
    html += `<td style="color: ${report.summary.near_expiry_items > 0 ? '#f57c00' : 'inherit'};">${report.summary.near_expiry_items}</td>`;
    html += `<td style="color: ${report.summary.low_stock_items > 0 ? '#f57c00' : 'inherit'};">${report.summary.low_stock_items}</td>`;
    html += `<td style="color: #2e7d32;">${report.summary.ok_items}</td>`;
    html += `</tr>`;
    html += `</table>`;

    // Alerts section
    if (report.alerts.length > 0) {
      html += `<h3>Critical Alerts (${report.alerts.length})</h3>`;
      html += `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">`;
      html += `<tr style="background-color: #f0f0f0;">`;
      html += `<th>Type</th><th>Medication</th><th>Batch</th><th>Quantity</th><th>Severity</th>`;
      html += `</tr>`;

      report.alerts.slice(0, 20).forEach((alert) => {
        html += `<tr>`;
        html += `<td>${alert.type.replace(/_/g, ' ')}</td>`;
        html += `<td>${alert.medicationName}</td>`;
        html += `<td>${alert.batchNumber}</td>`;
        html += `<td>${alert.quantity}</td>`;
        html += `<td style="color: ${alert.severity === 'CRITICAL' ? '#d32f2f' : '#f57c00'};">${alert.severity}</td>`;
        html += `</tr>`;
      });

      if (report.alerts.length > 20) {
        html += `<tr><td colspan="5"><em>... and ${report.alerts.length - 20} more</em></td></tr>`;
      }

      html += `</table>`;
    }

    // Reorder suggestions
    if (report.reorderSuggestions.length > 0) {
      const highPriority = report.reorderSuggestions.filter(
        (s) => s.priority === 'CRITICAL' || s.priority === 'HIGH',
      );

      if (highPriority.length > 0) {
        html += `<h3>High Priority Reorder Suggestions (${highPriority.length})</h3>`;
        html += `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">`;
        html += `<tr style="background-color: #f0f0f0;">`;
        html += `<th>Medication</th><th>Current</th><th>Suggested Order</th><th>Priority</th><th>Days Remaining</th>`;
        html += `</tr>`;

        highPriority.slice(0, 15).forEach((suggestion) => {
          html += `<tr>`;
          html += `<td>${suggestion.medicationName}</td>`;
          html += `<td>${suggestion.currentQuantity}</td>`;
          html += `<td><strong>${suggestion.suggestedOrderQuantity}</strong></td>`;
          html += `<td style="color: ${suggestion.priority === 'CRITICAL' ? '#d32f2f' : '#f57c00'};">${suggestion.priority}</td>`;
          html += `<td>${Math.round(suggestion.estimatedDaysRemaining)}</td>`;
          html += `</tr>`;
        });

        html += `</table>`;
      }
    }

    html += `<hr>`;
    html += `<p style="font-size: 0.9em; color: #666;">This is an automated daily report from White Cross Healthcare Platform.</p>`;
    html += `</body></html>`;

    return html;
  }

  /**
   * Convert HTML to plain text (simple implementation)
   */
  private convertHtmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }
}
