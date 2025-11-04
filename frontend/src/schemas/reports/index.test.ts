/**
 * Reports Schema Index - Import Validation Test
 *
 * This test file validates that all exports from the barrel index work correctly.
 * It verifies schemas, types, and utility functions are properly accessible.
 */

import { describe, it, expect } from '@jest/globals';
import {
  // Test the exact pattern from requirements
  reportConfigSchema,
  reportScheduleSchema,

  // Base schemas
  reportFormatSchema,
  reportTypeSchema,
  reportParameterSchema,
  reportExecutionStatusSchema,
  reportTemplateCategorySchema,

  // Configuration schemas
  reportTemplateSchema,
  batchReportGenerationSchema,

  // Schedule schemas
  scheduleFrequencySchema,
  cronExpressionSchema,
  emailDeliverySchema,
  storageDeliverySchema,
  dateRangeTypeSchema,

  // Execution schemas
  reportExecutionSchema,

  // Filter schemas
  reportHistoryFilterSchema,
  reportDownloadRequestSchema,
  reportShareSchema,

  // Types
  type ReportConfig,
  type ReportSchedule,
  type ReportFormat,
  type ReportType,

  // Utility functions
  validateCronExpression,
  calculateNextRun,
  validateScheduleTiming,
  generateDateRange,
  sanitizeFilename,
  validateEmailRecipients,
} from './index';

describe('Reports Schema Barrel Export', () => {
  describe('Schema Imports', () => {
    it('should export reportConfigSchema', () => {
      expect(reportConfigSchema).toBeDefined();
      expect(typeof reportConfigSchema.parse).toBe('function');
    });

    it('should export reportScheduleSchema (note: not scheduleReportSchema)', () => {
      expect(reportScheduleSchema).toBeDefined();
      expect(typeof reportScheduleSchema.parse).toBe('function');
    });

    it('should export base schemas', () => {
      expect(reportFormatSchema).toBeDefined();
      expect(reportTypeSchema).toBeDefined();
      expect(reportParameterSchema).toBeDefined();
      expect(reportExecutionStatusSchema).toBeDefined();
      expect(reportTemplateCategorySchema).toBeDefined();
    });

    it('should export configuration schemas', () => {
      expect(reportTemplateSchema).toBeDefined();
      expect(batchReportGenerationSchema).toBeDefined();
    });

    it('should export schedule schemas', () => {
      expect(scheduleFrequencySchema).toBeDefined();
      expect(cronExpressionSchema).toBeDefined();
      expect(emailDeliverySchema).toBeDefined();
      expect(storageDeliverySchema).toBeDefined();
      expect(dateRangeTypeSchema).toBeDefined();
    });

    it('should export execution schemas', () => {
      expect(reportExecutionSchema).toBeDefined();
    });

    it('should export filter schemas', () => {
      expect(reportHistoryFilterSchema).toBeDefined();
      expect(reportDownloadRequestSchema).toBeDefined();
      expect(reportShareSchema).toBeDefined();
    });
  });

  describe('Schema Validation', () => {
    it('should validate report formats', () => {
      expect(reportFormatSchema.parse('PDF')).toBe('PDF');
      expect(reportFormatSchema.parse('EXCEL')).toBe('EXCEL');
      expect(reportFormatSchema.parse('CSV')).toBe('CSV');
      expect(() => reportFormatSchema.parse('INVALID')).toThrow();
    });

    it('should validate report types', () => {
      expect(reportTypeSchema.parse('STUDENT_HEALTH_SUMMARY')).toBe('STUDENT_HEALTH_SUMMARY');
      expect(reportTypeSchema.parse('MEDICATION_COMPLIANCE')).toBe('MEDICATION_COMPLIANCE');
      expect(() => reportTypeSchema.parse('INVALID_TYPE')).toThrow();
    });

    it('should validate schedule frequencies', () => {
      expect(scheduleFrequencySchema.parse('DAILY')).toBe('DAILY');
      expect(scheduleFrequencySchema.parse('WEEKLY')).toBe('WEEKLY');
      expect(scheduleFrequencySchema.parse('MONTHLY')).toBe('MONTHLY');
      expect(() => scheduleFrequencySchema.parse('INVALID')).toThrow();
    });
  });

  describe('Utility Functions', () => {
    it('should export validateCronExpression', () => {
      expect(typeof validateCronExpression).toBe('function');
      expect(validateCronExpression('0 9 * * 1')).toBe(true);
      expect(validateCronExpression('invalid')).toBe(false);
    });

    it('should export calculateNextRun', () => {
      expect(typeof calculateNextRun).toBe('function');
    });

    it('should export validateScheduleTiming', () => {
      expect(typeof validateScheduleTiming).toBe('function');
    });

    it('should export generateDateRange', () => {
      expect(typeof generateDateRange).toBe('function');
      const range = generateDateRange('LAST_7_DAYS');
      expect(range).toHaveProperty('startDate');
      expect(range).toHaveProperty('endDate');
    });

    it('should export sanitizeFilename', () => {
      expect(typeof sanitizeFilename).toBe('function');
      expect(sanitizeFilename('test report 2025.pdf')).toBe('test_report_2025.pdf');
    });

    it('should export validateEmailRecipients', () => {
      expect(typeof validateEmailRecipients).toBe('function');
      expect(validateEmailRecipients(['test@example.com'])).toBe(true);
      expect(validateEmailRecipients(['invalid-email'])).toBe(false);
    });
  });

  describe('Type Exports', () => {
    it('should allow using ReportConfig type', () => {
      const config: ReportConfig = {
        reportType: 'STUDENT_HEALTH_SUMMARY',
        title: 'Test Report',
        dateRange: {
          startDate: '2025-01-01',
          endDate: '2025-01-31',
        },
        format: 'PDF',
        sortOrder: 'ASC',
        includeCharts: false,
        includeMetadata: true,
        includeSummary: true,
        includeDetails: true,
        pageSize: 'A4',
        orientation: 'portrait',
        includeFormulas: false,
      };
      expect(config.reportType).toBe('STUDENT_HEALTH_SUMMARY');
    });

    it('should allow using ReportFormat type', () => {
      const format: ReportFormat = 'EXCEL';
      expect(format).toBe('EXCEL');
    });

    it('should allow using ReportType type', () => {
      const type: ReportType = 'MEDICATION_COMPLIANCE';
      expect(type).toBe('MEDICATION_COMPLIANCE');
    });
  });
});
