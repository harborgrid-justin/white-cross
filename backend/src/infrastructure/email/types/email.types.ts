/**
 * @fileoverview Email Types
 * @module infrastructure/email/types
 * @description Type definitions for email functionality
 */

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  disposition?: 'attachment' | 'inline';
  cid?: string;
}

export interface EmailValidationResult {
  valid: boolean;
  email: string;
  reason?: string;
}

export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: Date;
  recipients: string[];
}

export interface EmailStatistics {
  totalSent: number;
  totalFailed: number;
  totalQueued: number;
  averageDeliveryTime: number;
  successRate: number;
  period: {
    start: Date;
    end: Date;
  };
}

export enum EmailPriority {
  URGENT = 'urgent',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
}

export enum EmailTemplate {
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password-reset',
  ALERT = 'alert',
  NOTIFICATION = 'notification',
  REPORT = 'report',
}

export interface AlertEmailData {
  title: string;
  message: string;
  severity: string;
  category: string;
  alertId: string;
  timestamp?: Date;
}

export interface AlertData {
  severity: string;
  category: string;
  alertId: string;
  timestamp?: Date;
  title: string;
  message: string;
}

export interface GenericEmailData {
  subject: string;
  body: string;
  html?: string;
}

export interface SendEmailDto {
  to: string[];
  cc?: string[];
  bcc?: string[];
  from?: string;
  replyTo?: string;
  subject: string;
  body?: string;
  html?: string;
  template?: EmailTemplate;
  templateData?: Record<string, any>;
  attachments?: EmailAttachment[];
  priority?: EmailPriority;
  headers?: Record<string, string>;
  tags?: string[];
  queue?: boolean;
  delay?: number;
}
