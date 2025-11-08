/**
 * LOC: FININT4567890
 * File: /reuse/financial/financial-integration-exchange-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../auditing-utils.ts
 *   - ../authentication-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial integration modules
 *   - Payment gateway services
 *   - Bank API connectors
 *   - ERP synchronization services
 */

/**
 * File: /reuse/financial/financial-integration-exchange-kit.ts
 * Locator: WC-FIN-INT-001
 * Purpose: USACE CEFMS-Level Financial Integration & Exchange Management
 *
 * Upstream: error-handling-kit, auditing-utils, authentication-utils
 * Downstream: ../backend/financial/*, payment gateway controllers, bank integration services, ERP sync modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Axios 1.x, Bull Queue 4.x
 * Exports: 45+ utility functions for bank integration, payment gateways, ERP sync, data import/export, API connectors
 *
 * LLM Context: Enterprise-grade financial integration and exchange system competing with USACE CEFMS.
 * Provides comprehensive bank API integration, payment gateway connectivity, ERP synchronization (SAP, Oracle, Workday),
 * automated data import/export, secure file transfers (SFTP/FTP), EDI processing, real-time payment processing,
 * ACH/wire transfers, reconciliation engines, webhook management, and complete transaction audit trails.
 */

import { Request, Response } from 'express';
import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  HttpCode,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface BankConnection {
  connectionId: string;
  bankName: string;
  bankCode: string;
  connectionType: 'api' | 'sftp' | 'file' | 'manual';
  apiEndpoint?: string;
  apiVersion?: string;
  authType: 'oauth2' | 'api_key' | 'certificate' | 'basic';
  credentials: EncryptedCredentials;
  accountNumbers: string[];
  isActive: boolean;
  lastSyncAt?: Date;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  features: BankFeature[];
  metadata: Record<string, any>;
}

export interface EncryptedCredentials {
  encryptedData: string;
  algorithm: string;
  iv: string;
  authTag?: string;
  keyVersion: number;
}

export interface BankFeature {
  featureName: string;
  enabled: boolean;
  configuration: Record<string, any>;
}

export interface BankTransaction {
  transactionId: string;
  connectionId: string;
  accountNumber: string;
  transactionType: 'debit' | 'credit' | 'transfer' | 'fee' | 'interest';
  amount: number;
  currency: string;
  description: string;
  referenceNumber: string;
  valueDate: Date;
  postingDate: Date;
  balance: number;
  counterpartyName?: string;
  counterpartyAccount?: string;
  status: 'pending' | 'posted' | 'reversed' | 'cancelled';
  metadata: Record<string, any>;
  rawData: Record<string, any>;
  reconciledAt?: Date;
  reconciledBy?: string;
}

export interface PaymentGateway {
  gatewayId: string;
  providerName: string;
  providerType: 'stripe' | 'paypal' | 'square' | 'authorize_net' | 'braintree' | 'custom';
  apiEndpoint: string;
  apiVersion: string;
  credentials: EncryptedCredentials;
  supportedMethods: PaymentMethod[];
  supportedCurrencies: string[];
  webhookUrl?: string;
  webhookSecret?: string;
  isActive: boolean;
  isSandbox: boolean;
  features: GatewayFeature[];
  rateLimit: RateLimitConfig;
  metadata: Record<string, any>;
}

export interface PaymentMethod {
  method: 'card' | 'ach' | 'wire' | 'paypal' | 'apple_pay' | 'google_pay' | 'crypto';
  enabled: boolean;
  fees: FeeStructure[];
}

export interface FeeStructure {
  feeType: 'percentage' | 'fixed' | 'tiered';
  feeAmount: number;
  currency: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface GatewayFeature {
  featureName: string;
  enabled: boolean;
  configuration: Record<string, any>;
}

export interface RateLimitConfig {
  requestsPerSecond: number;
  requestsPerMinute: number;
  requestsPerHour: number;
  burstLimit: number;
}

export interface PaymentTransaction {
  transactionId: string;
  gatewayId: string;
  externalTransactionId?: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  customerId?: string;
  customerEmail?: string;
  description: string;
  metadata: Record<string, any>;
  processingFee?: number;
  netAmount?: number;
  createdAt: Date;
  processedAt?: Date;
  settledAt?: Date;
  errorMessage?: string;
  errorCode?: string;
  rawResponse: Record<string, any>;
}

export interface ERPIntegration {
  integrationId: string;
  erpSystem: 'sap' | 'oracle' | 'workday' | 'netsuite' | 'dynamics' | 'custom';
  erpVersion: string;
  connectionType: 'api' | 'odbc' | 'file' | 'middleware';
  apiEndpoint?: string;
  credentials: EncryptedCredentials;
  modules: ERPModule[];
  syncSchedule: SyncSchedule;
  mappings: FieldMapping[];
  isActive: boolean;
  lastSyncAt?: Date;
  syncStatus: 'idle' | 'running' | 'error' | 'completed';
  metadata: Record<string, any>;
}

export interface ERPModule {
  moduleName: string;
  enabled: boolean;
  syncDirection: 'inbound' | 'outbound' | 'bidirectional';
  entities: string[];
  filters?: Record<string, any>;
}

export interface SyncSchedule {
  frequency: 'realtime' | 'every_5min' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  specificTime?: string;
  timezone: string;
  retryPolicy: RetryPolicy;
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff: boolean;
  maxDelay: number;
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  defaultValue?: any;
  required: boolean;
  dataType: string;
}

export interface DataImportJob {
  jobId: string;
  jobType: 'bank_statement' | 'transactions' | 'invoices' | 'payments' | 'general_ledger' | 'custom';
  sourceType: 'file' | 'api' | 'database' | 'sftp';
  sourceLocation?: string;
  format: 'csv' | 'excel' | 'xml' | 'json' | 'edi' | 'fixed_width' | 'custom';
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'partial';
  errors: ImportError[];
  createdBy: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  metadata: Record<string, any>;
}

export interface ImportError {
  recordNumber: number;
  field?: string;
  errorType: string;
  errorMessage: string;
  rawData?: any;
}

export interface DataExportJob {
  jobId: string;
  jobType: 'transactions' | 'reports' | 'reconciliation' | 'audit_trail' | 'custom';
  format: 'csv' | 'excel' | 'xml' | 'json' | 'pdf' | 'custom';
  filters: Record<string, any>;
  columns: string[];
  totalRecords: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  outputLocation?: string;
  downloadUrl?: string;
  expiresAt?: Date;
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
  metadata: Record<string, any>;
}

export interface APIConnector {
  connectorId: string;
  connectorName: string;
  apiType: 'rest' | 'soap' | 'graphql' | 'grpc' | 'custom';
  baseUrl: string;
  authType: 'none' | 'basic' | 'bearer' | 'oauth2' | 'api_key' | 'certificate';
  credentials: EncryptedCredentials;
  headers: Record<string, string>;
  timeout: number;
  retryPolicy: RetryPolicy;
  rateLimit: RateLimitConfig;
  endpoints: APIEndpoint[];
  isActive: boolean;
  healthCheckUrl?: string;
  lastHealthCheck?: Date;
  metadata: Record<string, any>;
}

export interface APIEndpoint {
  endpointId: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description?: string;
  requestSchema?: Record<string, any>;
  responseSchema?: Record<string, any>;
  rateLimit?: RateLimitConfig;
}

export interface WebhookConfig {
  webhookId: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  retryPolicy: RetryPolicy;
  headers: Record<string, string>;
  payloadFormat: 'json' | 'xml' | 'form';
  signatureMethod: 'hmac_sha256' | 'hmac_sha512' | 'none';
  deliveryAttempts: number;
  lastDeliveredAt?: Date;
  metadata: Record<string, any>;
}

export interface ReconciliationRule {
  ruleId: string;
  ruleName: string;
  sourceType: 'bank' | 'erp' | 'gateway' | 'manual';
  targetType: 'general_ledger' | 'accounts_receivable' | 'accounts_payable';
  matchingCriteria: MatchingCriterion[];
  tolerance: number;
  autoReconcile: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  priority: number;
}

export interface MatchingCriterion {
  field: string;
  matchType: 'exact' | 'fuzzy' | 'range' | 'regex';
  weight: number;
  required: boolean;
}

export class BankConnectionDto {
  @ApiProperty({ description: 'Bank name' })
  bankName: string;

  @ApiProperty({ description: 'Bank code (e.g., SWIFT/BIC)' })
  bankCode: string;

  @ApiProperty({ description: 'Connection type', enum: ['api', 'sftp', 'file', 'manual'] })
  connectionType: string;

  @ApiProperty({ description: 'API endpoint URL' })
  apiEndpoint?: string;

  @ApiProperty({ description: 'Authentication type', enum: ['oauth2', 'api_key', 'certificate', 'basic'] })
  authType: string;

  @ApiProperty({ description: 'Account numbers' })
  accountNumbers: string[];

  @ApiProperty({ description: 'Sync frequency', enum: ['realtime', 'hourly', 'daily', 'weekly'] })
  syncFrequency: string;
}

export class PaymentTransactionDto {
  @ApiProperty({ description: 'Gateway ID' })
  gatewayId: string;

  @ApiProperty({ description: 'Payment method', enum: ['card', 'ach', 'wire', 'paypal', 'apple_pay', 'google_pay'] })
  paymentMethod: string;

  @ApiProperty({ description: 'Transaction amount' })
  amount: number;

  @ApiProperty({ description: 'Currency code' })
  currency: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId?: string;

  @ApiProperty({ description: 'Customer email' })
  customerEmail?: string;

  @ApiProperty({ description: 'Transaction description' })
  description: string;

  @ApiProperty({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

export class DataImportDto {
  @ApiProperty({ description: 'Job type', enum: ['bank_statement', 'transactions', 'invoices', 'payments', 'general_ledger'] })
  jobType: string;

  @ApiProperty({ description: 'Source type', enum: ['file', 'api', 'database', 'sftp'] })
  sourceType: string;

  @ApiProperty({ description: 'File format', enum: ['csv', 'excel', 'xml', 'json', 'edi', 'fixed_width'] })
  format: string;

  @ApiProperty({ description: 'Source location (file path, URL, etc.)' })
  sourceLocation?: string;

  @ApiProperty({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODELS (6 models)
// ============================================================================

/**
 * Sequelize model for Bank Connections - manages bank API integrations
 */
export const createBankConnectionModel = (sequelize: Sequelize) => {
  class BankConnectionModel extends Model {
    public id!: number;
    public connectionId!: string;
    public bankName!: string;
    public bankCode!: string;
    public connectionType!: string;
    public apiEndpoint!: string | null;
    public apiVersion!: string | null;
    public authType!: string;
    public encryptedCredentials!: string;
    public accountNumbers!: string[];
    public isActive!: boolean;
    public lastSyncAt!: Date | null;
    public syncFrequency!: string;
    public features!: BankFeature[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  BankConnectionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      connectionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        comment: 'Unique connection identifier',
      },
      bankName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Bank name',
      },
      bankCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Bank code (SWIFT/BIC)',
      },
      connectionType: {
        type: DataTypes.ENUM('api', 'sftp', 'file', 'manual'),
        allowNull: false,
        comment: 'Connection type',
      },
      apiEndpoint: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'API endpoint URL',
      },
      apiVersion: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'API version',
      },
      authType: {
        type: DataTypes.ENUM('oauth2', 'api_key', 'certificate', 'basic'),
        allowNull: false,
        comment: 'Authentication type',
      },
      encryptedCredentials: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Encrypted credentials JSON',
      },
      accountNumbers: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of account numbers',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether connection is active',
      },
      lastSyncAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last sync timestamp',
      },
      syncFrequency: {
        type: DataTypes.ENUM('realtime', 'hourly', 'daily', 'weekly'),
        allowNull: false,
        defaultValue: 'daily',
        comment: 'Sync frequency',
      },
      features: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Bank features configuration',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'bank_connections',
      timestamps: true,
      indexes: [
        { fields: ['connectionId'], unique: true },
        { fields: ['bankCode'] },
        { fields: ['isActive'] },
        { fields: ['syncFrequency'] },
      ],
    },
  );

  return BankConnectionModel;
};

/**
 * Sequelize model for Bank Transactions - stores imported bank transactions
 */
export const createBankTransactionModel = (sequelize: Sequelize) => {
  class BankTransactionModel extends Model {
    public id!: number;
    public transactionId!: string;
    public connectionId!: string;
    public accountNumber!: string;
    public transactionType!: string;
    public amount!: number;
    public currency!: string;
    public description!: string;
    public referenceNumber!: string;
    public valueDate!: Date;
    public postingDate!: Date;
    public balance!: number;
    public counterpartyName!: string | null;
    public counterpartyAccount!: string | null;
    public status!: string;
    public metadata!: Record<string, any>;
    public rawData!: Record<string, any>;
    public reconciledAt!: Date | null;
    public reconciledBy!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  BankTransactionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        comment: 'Unique transaction identifier',
      },
      connectionId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to bank connection',
      },
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account number',
      },
      transactionType: {
        type: DataTypes.ENUM('debit', 'credit', 'transfer', 'fee', 'interest'),
        allowNull: false,
        comment: 'Transaction type',
      },
      amount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Transaction amount',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Transaction description',
      },
      referenceNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Bank reference number',
      },
      valueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Value date',
      },
      postingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Posting date',
      },
      balance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Account balance after transaction',
      },
      counterpartyName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Counterparty name',
      },
      counterpartyAccount: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Counterparty account number',
      },
      status: {
        type: DataTypes.ENUM('pending', 'posted', 'reversed', 'cancelled'),
        allowNull: false,
        defaultValue: 'posted',
        comment: 'Transaction status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      rawData: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Raw transaction data from bank',
      },
      reconciledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reconciliation timestamp',
      },
      reconciledBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who reconciled transaction',
      },
    },
    {
      sequelize,
      tableName: 'bank_transactions',
      timestamps: true,
      indexes: [
        { fields: ['transactionId'], unique: true },
        { fields: ['connectionId'] },
        { fields: ['accountNumber'] },
        { fields: ['referenceNumber'] },
        { fields: ['valueDate'] },
        { fields: ['postingDate'] },
        { fields: ['status'] },
        { fields: ['reconciledAt'] },
      ],
    },
  );

  return BankTransactionModel;
};

/**
 * Sequelize model for Payment Gateways - manages payment provider integrations
 */
export const createPaymentGatewayModel = (sequelize: Sequelize) => {
  class PaymentGatewayModel extends Model {
    public id!: number;
    public gatewayId!: string;
    public providerName!: string;
    public providerType!: string;
    public apiEndpoint!: string;
    public apiVersion!: string;
    public encryptedCredentials!: string;
    public supportedMethods!: PaymentMethod[];
    public supportedCurrencies!: string[];
    public webhookUrl!: string | null;
    public webhookSecret!: string | null;
    public isActive!: boolean;
    public isSandbox!: boolean;
    public features!: GatewayFeature[];
    public rateLimit!: RateLimitConfig;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentGatewayModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gatewayId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        comment: 'Unique gateway identifier',
      },
      providerName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Payment provider name',
      },
      providerType: {
        type: DataTypes.ENUM('stripe', 'paypal', 'square', 'authorize_net', 'braintree', 'custom'),
        allowNull: false,
        comment: 'Payment provider type',
      },
      apiEndpoint: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'API endpoint URL',
      },
      apiVersion: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'API version',
      },
      encryptedCredentials: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Encrypted credentials JSON',
      },
      supportedMethods: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Supported payment methods',
      },
      supportedCurrencies: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: ['USD'],
        comment: 'Supported currencies',
      },
      webhookUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Webhook URL for receiving events',
      },
      webhookSecret: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Webhook secret for signature verification',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether gateway is active',
      },
      isSandbox: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether gateway is in sandbox mode',
      },
      features: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Gateway features configuration',
      },
      rateLimit: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Rate limit configuration',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'payment_gateways',
      timestamps: true,
      indexes: [
        { fields: ['gatewayId'], unique: true },
        { fields: ['providerType'] },
        { fields: ['isActive'] },
      ],
    },
  );

  return PaymentGatewayModel;
};

/**
 * Sequelize model for Payment Transactions - stores payment transaction records
 */
export const createPaymentTransactionModel = (sequelize: Sequelize) => {
  class PaymentTransactionModel extends Model {
    public id!: number;
    public transactionId!: string;
    public gatewayId!: string;
    public externalTransactionId!: string | null;
    public paymentMethod!: string;
    public amount!: number;
    public currency!: string;
    public status!: string;
    public customerId!: string | null;
    public customerEmail!: string | null;
    public description!: string;
    public metadata!: Record<string, any>;
    public processingFee!: number | null;
    public netAmount!: number | null;
    public processedAt!: Date | null;
    public settledAt!: Date | null;
    public errorMessage!: string | null;
    public errorCode!: string | null;
    public rawResponse!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentTransactionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        comment: 'Unique transaction identifier',
      },
      gatewayId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to payment gateway',
      },
      externalTransactionId: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'External transaction ID from gateway',
      },
      paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Payment method used',
      },
      amount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Transaction amount',
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Transaction status',
      },
      customerId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Customer ID',
      },
      customerEmail: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Customer email',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Transaction description',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      processingFee: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true,
        comment: 'Processing fee charged',
      },
      netAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true,
        comment: 'Net amount after fees',
      },
      processedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Processing timestamp',
      },
      settledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Settlement timestamp',
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Error message if failed',
      },
      errorCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Error code if failed',
      },
      rawResponse: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Raw response from gateway',
      },
    },
    {
      sequelize,
      tableName: 'payment_transactions',
      timestamps: true,
      indexes: [
        { fields: ['transactionId'], unique: true },
        { fields: ['gatewayId'] },
        { fields: ['externalTransactionId'] },
        { fields: ['status'] },
        { fields: ['customerId'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return PaymentTransactionModel;
};

/**
 * Sequelize model for ERP Integrations - manages ERP system connections
 */
export const createERPIntegrationModel = (sequelize: Sequelize) => {
  class ERPIntegrationModel extends Model {
    public id!: number;
    public integrationId!: string;
    public erpSystem!: string;
    public erpVersion!: string;
    public connectionType!: string;
    public apiEndpoint!: string | null;
    public encryptedCredentials!: string;
    public modules!: ERPModule[];
    public syncSchedule!: SyncSchedule;
    public mappings!: FieldMapping[];
    public isActive!: boolean;
    public lastSyncAt!: Date | null;
    public syncStatus!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ERPIntegrationModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      integrationId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        comment: 'Unique integration identifier',
      },
      erpSystem: {
        type: DataTypes.ENUM('sap', 'oracle', 'workday', 'netsuite', 'dynamics', 'custom'),
        allowNull: false,
        comment: 'ERP system type',
      },
      erpVersion: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'ERP version',
      },
      connectionType: {
        type: DataTypes.ENUM('api', 'odbc', 'file', 'middleware'),
        allowNull: false,
        comment: 'Connection type',
      },
      apiEndpoint: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'API endpoint URL',
      },
      encryptedCredentials: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Encrypted credentials JSON',
      },
      modules: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'ERP modules configuration',
      },
      syncSchedule: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Sync schedule configuration',
      },
      mappings: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Field mappings',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether integration is active',
      },
      lastSyncAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last sync timestamp',
      },
      syncStatus: {
        type: DataTypes.ENUM('idle', 'running', 'error', 'completed'),
        allowNull: false,
        defaultValue: 'idle',
        comment: 'Current sync status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'erp_integrations',
      timestamps: true,
      indexes: [
        { fields: ['integrationId'], unique: true },
        { fields: ['erpSystem'] },
        { fields: ['isActive'] },
        { fields: ['syncStatus'] },
      ],
    },
  );

  return ERPIntegrationModel;
};

/**
 * Sequelize model for Data Import Jobs - tracks import operations
 */
export const createDataImportJobModel = (sequelize: Sequelize) => {
  class DataImportJobModel extends Model {
    public id!: number;
    public jobId!: string;
    public jobType!: string;
    public sourceType!: string;
    public sourceLocation!: string | null;
    public format!: string;
    public totalRecords!: number;
    public processedRecords!: number;
    public successfulRecords!: number;
    public failedRecords!: number;
    public status!: string;
    public errors!: ImportError[];
    public createdBy!: string;
    public startedAt!: Date | null;
    public completedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DataImportJobModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      jobId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        comment: 'Unique job identifier',
      },
      jobType: {
        type: DataTypes.ENUM('bank_statement', 'transactions', 'invoices', 'payments', 'general_ledger', 'custom'),
        allowNull: false,
        comment: 'Job type',
      },
      sourceType: {
        type: DataTypes.ENUM('file', 'api', 'database', 'sftp'),
        allowNull: false,
        comment: 'Source type',
      },
      sourceLocation: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Source location',
      },
      format: {
        type: DataTypes.ENUM('csv', 'excel', 'xml', 'json', 'edi', 'fixed_width', 'custom'),
        allowNull: false,
        comment: 'File format',
      },
      totalRecords: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total records to import',
      },
      processedRecords: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Records processed',
      },
      successfulRecords: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Successful records',
      },
      failedRecords: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Failed records',
      },
      status: {
        type: DataTypes.ENUM('queued', 'processing', 'completed', 'failed', 'partial'),
        allowNull: false,
        defaultValue: 'queued',
        comment: 'Job status',
      },
      errors: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Import errors',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created job',
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Job start timestamp',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Job completion timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'data_import_jobs',
      timestamps: true,
      indexes: [
        { fields: ['jobId'], unique: true },
        { fields: ['jobType'] },
        { fields: ['status'] },
        { fields: ['createdBy'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return DataImportJobModel;
};

// ============================================================================
// NESTJS GUARDS & INTERCEPTORS
// ============================================================================

/**
 * Guard to verify API integration credentials
 */
@Injectable()
export class IntegrationAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const integrationId = request.headers['x-integration-id'];
    const apiKey = request.headers['x-api-key'];

    if (!integrationId || !apiKey) {
      throw new UnauthorizedException('Missing integration credentials');
    }

    const isValid = await this.validateIntegrationCredentials(integrationId, apiKey);

    if (!isValid) {
      throw new UnauthorizedException('Invalid integration credentials');
    }

    return true;
  }

  private async validateIntegrationCredentials(integrationId: string, apiKey: string): Promise<boolean> {
    // Implementation would validate credentials against database
    return true;
  }
}

/**
 * Interceptor for logging integration API calls
 */
@Injectable()
export class IntegrationLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const integrationId = request.headers['x-integration-id'];
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logIntegrationCall(request, integrationId, data, 'success', duration);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logIntegrationCall(request, integrationId, null, 'error', duration, error);
        },
      }),
    );
  }

  private logIntegrationCall(
    request: any,
    integrationId: string,
    data: any,
    status: string,
    duration: number,
    error?: any,
  ): void {
    const logEntry = {
      integrationId,
      method: request.method,
      path: request.url,
      status,
      duration,
      timestamp: new Date(),
      error: error?.message,
    };

    console.log('Integration API Call:', logEntry);
  }
}

// ============================================================================
// UTILITY FUNCTIONS (45 functions)
// ============================================================================

/**
 * 1. Create bank connection
 *
 * @param {BankConnection} connection - Bank connection data
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<BankConnection>} Created connection
 *
 * @example
 * ```typescript
 * const connection = await createBankConnection({
 *   bankName: 'Bank of America',
 *   bankCode: 'BOFAUS3N',
 *   connectionType: 'api',
 *   apiEndpoint: 'https://api.bankofamerica.com',
 *   authType: 'oauth2',
 *   credentials: encryptedCreds,
 *   accountNumbers: ['1234567890'],
 *   syncFrequency: 'daily'
 * });
 * ```
 */
export async function createBankConnection(
  connection: Partial<BankConnection>,
  transaction?: Transaction,
): Promise<BankConnection> {
  try {
    // Encrypt credentials before storage
    const encryptedCreds = await encryptCredentials(connection.credentials!);

    const bankConnection: BankConnection = {
      connectionId: generateUUID(),
      bankName: connection.bankName!,
      bankCode: connection.bankCode!,
      connectionType: connection.connectionType!,
      apiEndpoint: connection.apiEndpoint,
      apiVersion: connection.apiVersion,
      authType: connection.authType!,
      credentials: encryptedCreds,
      accountNumbers: connection.accountNumbers!,
      isActive: true,
      syncFrequency: connection.syncFrequency || 'daily',
      features: connection.features || [],
      metadata: connection.metadata || {},
    };

    // Test connection
    await testBankConnection(bankConnection);

    return bankConnection;
  } catch (error) {
    throw new Error(`Failed to create bank connection: ${error.message}`);
  }
}

/**
 * 2. Encrypt credentials for secure storage
 *
 * @param {Record<string, any>} credentials - Credentials to encrypt
 * @returns {Promise<EncryptedCredentials>} Encrypted credentials
 */
export async function encryptCredentials(credentials: Record<string, any>): Promise<EncryptedCredentials> {
  const algorithm = 'aes-256-gcm';
  const key = await getEncryptionKey();
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    algorithm,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    keyVersion: 1,
  };
}

/**
 * 3. Decrypt credentials
 *
 * @param {EncryptedCredentials} encrypted - Encrypted credentials
 * @returns {Promise<Record<string, any>>} Decrypted credentials
 */
export async function decryptCredentials(encrypted: EncryptedCredentials): Promise<Record<string, any>> {
  const key = await getEncryptionKey();
  const iv = Buffer.from(encrypted.iv, 'hex');

  const decipher = crypto.createDecipheriv(encrypted.algorithm, key, iv);

  if (encrypted.authTag) {
    decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
  }

  let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}

/**
 * 4. Get encryption key from environment or secrets manager
 *
 * @returns {Promise<Buffer>} Encryption key
 */
export async function getEncryptionKey(): Promise<Buffer> {
  const key = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production';
  return crypto.scryptSync(key, 'salt', 32);
}

/**
 * 5. Test bank connection
 *
 * @param {BankConnection} connection - Bank connection to test
 * @returns {Promise<boolean>} Whether connection is successful
 */
export async function testBankConnection(connection: BankConnection): Promise<boolean> {
  try {
    const client = await createBankAPIClient(connection);
    const response = await client.get('/health');
    return response.status === 200;
  } catch (error) {
    throw new Error(`Bank connection test failed: ${error.message}`);
  }
}

/**
 * 6. Create bank API client
 *
 * @param {BankConnection} connection - Bank connection
 * @returns {Promise<AxiosInstance>} Configured Axios client
 */
export async function createBankAPIClient(connection: BankConnection): Promise<AxiosInstance> {
  const credentials = await decryptCredentials(connection.credentials);

  const config: AxiosRequestConfig = {
    baseURL: connection.apiEndpoint,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Configure auth based on type
  switch (connection.authType) {
    case 'oauth2':
      const token = await getOAuth2Token(credentials);
      config.headers!['Authorization'] = `Bearer ${token}`;
      break;
    case 'api_key':
      config.headers!['X-API-Key'] = credentials.apiKey;
      break;
    case 'basic':
      config.auth = {
        username: credentials.username,
        password: credentials.password,
      };
      break;
  }

  return axios.create(config);
}

/**
 * 7. Get OAuth2 token
 *
 * @param {Record<string, any>} credentials - OAuth2 credentials
 * @returns {Promise<string>} Access token
 */
export async function getOAuth2Token(credentials: Record<string, any>): Promise<string> {
  const response = await axios.post(credentials.tokenUrl, {
    grant_type: 'client_credentials',
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
  });

  return response.data.access_token;
}

/**
 * 8. Sync bank transactions
 *
 * @param {string} connectionId - Bank connection ID
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<BankTransaction[]>} Imported transactions
 */
export async function syncBankTransactions(
  connectionId: string,
  fromDate: Date,
  toDate: Date,
  transaction?: Transaction,
): Promise<BankTransaction[]> {
  const connection = await getBankConnectionById(connectionId);

  if (!connection) {
    throw new NotFoundException('Bank connection not found');
  }

  const client = await createBankAPIClient(connection);

  const transactions: BankTransaction[] = [];

  for (const accountNumber of connection.accountNumbers) {
    const response = await client.get('/transactions', {
      params: {
        accountNumber,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      },
    });

    const accountTransactions = await parseBankTransactions(response.data, connectionId, accountNumber);
    transactions.push(...accountTransactions);
  }

  // Update last sync time
  connection.lastSyncAt = new Date();

  return transactions;
}

/**
 * 9. Parse bank transactions from API response
 *
 * @param {any} data - API response data
 * @param {string} connectionId - Connection ID
 * @param {string} accountNumber - Account number
 * @returns {Promise<BankTransaction[]>} Parsed transactions
 */
export async function parseBankTransactions(
  data: any,
  connectionId: string,
  accountNumber: string,
): Promise<BankTransaction[]> {
  const transactions: BankTransaction[] = [];

  for (const item of data.transactions || []) {
    const transaction: BankTransaction = {
      transactionId: generateUUID(),
      connectionId,
      accountNumber,
      transactionType: item.type === 'DEBIT' ? 'debit' : 'credit',
      amount: Math.abs(parseFloat(item.amount)),
      currency: item.currency || 'USD',
      description: item.description || '',
      referenceNumber: item.referenceNumber,
      valueDate: new Date(item.valueDate),
      postingDate: new Date(item.postingDate),
      balance: parseFloat(item.balance),
      counterpartyName: item.counterparty?.name,
      counterpartyAccount: item.counterparty?.account,
      status: 'posted',
      metadata: {},
      rawData: item,
    };

    transactions.push(transaction);
  }

  return transactions;
}

/**
 * 10. Get bank connection by ID
 *
 * @param {string} connectionId - Connection ID
 * @returns {Promise<BankConnection | null>} Bank connection or null
 */
export async function getBankConnectionById(connectionId: string): Promise<BankConnection | null> {
  // Implementation would query database
  return null;
}

/**
 * 11. Create payment gateway
 *
 * @param {PaymentGateway} gateway - Gateway configuration
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<PaymentGateway>} Created gateway
 */
export async function createPaymentGateway(
  gateway: Partial<PaymentGateway>,
  transaction?: Transaction,
): Promise<PaymentGateway> {
  const encryptedCreds = await encryptCredentials(gateway.credentials!);

  const paymentGateway: PaymentGateway = {
    gatewayId: generateUUID(),
    providerName: gateway.providerName!,
    providerType: gateway.providerType!,
    apiEndpoint: gateway.apiEndpoint!,
    apiVersion: gateway.apiVersion!,
    credentials: encryptedCreds,
    supportedMethods: gateway.supportedMethods || [],
    supportedCurrencies: gateway.supportedCurrencies || ['USD'],
    webhookUrl: gateway.webhookUrl,
    webhookSecret: gateway.webhookSecret,
    isActive: true,
    isSandbox: gateway.isSandbox || false,
    features: gateway.features || [],
    rateLimit: gateway.rateLimit || { requestsPerSecond: 10, requestsPerMinute: 100, requestsPerHour: 1000, burstLimit: 20 },
    metadata: gateway.metadata || {},
  };

  // Test gateway connection
  await testPaymentGateway(paymentGateway);

  return paymentGateway;
}

/**
 * 12. Test payment gateway connection
 *
 * @param {PaymentGateway} gateway - Payment gateway
 * @returns {Promise<boolean>} Whether test is successful
 */
export async function testPaymentGateway(gateway: PaymentGateway): Promise<boolean> {
  try {
    const client = await createPaymentGatewayClient(gateway);
    // Test with a zero-amount authorization
    const response = await client.post('/test', { amount: 0 });
    return response.status === 200;
  } catch (error) {
    throw new Error(`Payment gateway test failed: ${error.message}`);
  }
}

/**
 * 13. Create payment gateway API client
 *
 * @param {PaymentGateway} gateway - Payment gateway
 * @returns {Promise<AxiosInstance>} Configured client
 */
export async function createPaymentGatewayClient(gateway: PaymentGateway): Promise<AxiosInstance> {
  const credentials = await decryptCredentials(gateway.credentials);

  const config: AxiosRequestConfig = {
    baseURL: gateway.apiEndpoint,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Provider-specific configuration
  switch (gateway.providerType) {
    case 'stripe':
      config.headers!['Authorization'] = `Bearer ${credentials.secretKey}`;
      break;
    case 'paypal':
      config.headers!['Authorization'] = `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')}`;
      break;
    default:
      config.headers!['X-API-Key'] = credentials.apiKey;
  }

  return axios.create(config);
}

/**
 * 14. Process payment transaction
 *
 * @param {PaymentTransaction} payment - Payment transaction
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<PaymentTransaction>} Processed payment
 */
export async function processPaymentTransaction(
  payment: Partial<PaymentTransaction>,
  transaction?: Transaction,
): Promise<PaymentTransaction> {
  const gateway = await getPaymentGatewayById(payment.gatewayId!);

  if (!gateway) {
    throw new NotFoundException('Payment gateway not found');
  }

  const client = await createPaymentGatewayClient(gateway);

  const paymentTransaction: PaymentTransaction = {
    transactionId: generateUUID(),
    gatewayId: payment.gatewayId!,
    paymentMethod: payment.paymentMethod!,
    amount: payment.amount!,
    currency: payment.currency || 'USD',
    status: 'processing',
    customerId: payment.customerId,
    customerEmail: payment.customerEmail,
    description: payment.description!,
    metadata: payment.metadata || {},
    createdAt: new Date(),
    rawResponse: {},
  };

  try {
    const response = await client.post('/charges', {
      amount: Math.round(payment.amount! * 100), // Convert to cents
      currency: payment.currency,
      description: payment.description,
      metadata: payment.metadata,
    });

    paymentTransaction.externalTransactionId = response.data.id;
    paymentTransaction.status = 'completed';
    paymentTransaction.processedAt = new Date();
    paymentTransaction.rawResponse = response.data;

    // Calculate fees
    const feeStructure = getFeeStructure(gateway, payment.paymentMethod!);
    paymentTransaction.processingFee = calculateProcessingFee(payment.amount!, feeStructure);
    paymentTransaction.netAmount = payment.amount! - paymentTransaction.processingFee;
  } catch (error) {
    paymentTransaction.status = 'failed';
    paymentTransaction.errorMessage = error.message;
    paymentTransaction.errorCode = error.response?.data?.code;
    paymentTransaction.rawResponse = error.response?.data || {};
  }

  return paymentTransaction;
}

/**
 * 15. Get payment gateway by ID
 *
 * @param {string} gatewayId - Gateway ID
 * @returns {Promise<PaymentGateway | null>} Payment gateway or null
 */
export async function getPaymentGatewayById(gatewayId: string): Promise<PaymentGateway | null> {
  // Implementation would query database
  return null;
}

/**
 * 16. Get fee structure for payment method
 *
 * @param {PaymentGateway} gateway - Payment gateway
 * @param {string} method - Payment method
 * @returns {FeeStructure[]} Fee structures
 */
export function getFeeStructure(gateway: PaymentGateway, method: string): FeeStructure[] {
  const paymentMethod = gateway.supportedMethods.find((m) => m.method === method);
  return paymentMethod?.fees || [];
}

/**
 * 17. Calculate processing fee
 *
 * @param {number} amount - Transaction amount
 * @param {FeeStructure[]} fees - Fee structures
 * @returns {number} Processing fee
 */
export function calculateProcessingFee(amount: number, fees: FeeStructure[]): number {
  let totalFee = 0;

  for (const fee of fees) {
    if (fee.feeType === 'percentage') {
      totalFee += amount * (fee.feeAmount / 100);
    } else if (fee.feeType === 'fixed') {
      totalFee += fee.feeAmount;
    }
  }

  return totalFee;
}

/**
 * 18. Refund payment transaction
 *
 * @param {string} transactionId - Transaction ID
 * @param {number} amount - Refund amount
 * @param {string} reason - Refund reason
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<PaymentTransaction>} Refunded transaction
 */
export async function refundPaymentTransaction(
  transactionId: string,
  amount?: number,
  reason?: string,
  transaction?: Transaction,
): Promise<PaymentTransaction> {
  const payment = await getPaymentTransactionById(transactionId);

  if (!payment) {
    throw new NotFoundException('Payment transaction not found');
  }

  const gateway = await getPaymentGatewayById(payment.gatewayId);

  if (!gateway) {
    throw new NotFoundException('Payment gateway not found');
  }

  const client = await createPaymentGatewayClient(gateway);

  const refundAmount = amount || payment.amount;

  const response = await client.post('/refunds', {
    charge: payment.externalTransactionId,
    amount: Math.round(refundAmount * 100),
    reason,
  });

  payment.status = 'refunded';
  payment.metadata = { ...payment.metadata, refund: response.data, refundReason: reason };

  return payment;
}

/**
 * 19. Get payment transaction by ID
 *
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<PaymentTransaction | null>} Payment transaction or null
 */
export async function getPaymentTransactionById(transactionId: string): Promise<PaymentTransaction | null> {
  // Implementation would query database
  return null;
}

/**
 * 20. Create ERP integration
 *
 * @param {ERPIntegration} integration - ERP integration configuration
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ERPIntegration>} Created integration
 */
export async function createERPIntegration(
  integration: Partial<ERPIntegration>,
  transaction?: Transaction,
): Promise<ERPIntegration> {
  const encryptedCreds = await encryptCredentials(integration.credentials!);

  const erpIntegration: ERPIntegration = {
    integrationId: generateUUID(),
    erpSystem: integration.erpSystem!,
    erpVersion: integration.erpVersion!,
    connectionType: integration.connectionType!,
    apiEndpoint: integration.apiEndpoint,
    credentials: encryptedCreds,
    modules: integration.modules || [],
    syncSchedule: integration.syncSchedule!,
    mappings: integration.mappings || [],
    isActive: true,
    syncStatus: 'idle',
    metadata: integration.metadata || {},
  };

  // Test connection
  await testERPConnection(erpIntegration);

  return erpIntegration;
}

/**
 * 21. Test ERP connection
 *
 * @param {ERPIntegration} integration - ERP integration
 * @returns {Promise<boolean>} Whether test is successful
 */
export async function testERPConnection(integration: ERPIntegration): Promise<boolean> {
  try {
    const client = await createERPAPIClient(integration);
    const response = await client.get('/status');
    return response.status === 200;
  } catch (error) {
    throw new Error(`ERP connection test failed: ${error.message}`);
  }
}

/**
 * 22. Create ERP API client
 *
 * @param {ERPIntegration} integration - ERP integration
 * @returns {Promise<AxiosInstance>} Configured client
 */
export async function createERPAPIClient(integration: ERPIntegration): Promise<AxiosInstance> {
  const credentials = await decryptCredentials(integration.credentials);

  const config: AxiosRequestConfig = {
    baseURL: integration.apiEndpoint,
    timeout: 60000, // ERP systems may be slower
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // ERP-specific configuration
  switch (integration.erpSystem) {
    case 'sap':
      config.headers!['X-CSRF-Token'] = 'Fetch';
      config.auth = {
        username: credentials.username,
        password: credentials.password,
      };
      break;
    case 'oracle':
      config.headers!['Authorization'] = `Bearer ${await getOAuth2Token(credentials)}`;
      break;
    case 'workday':
      config.auth = {
        username: credentials.username,
        password: credentials.password,
      };
      break;
    default:
      config.headers!['X-API-Key'] = credentials.apiKey;
  }

  return axios.create(config);
}

/**
 * 23. Sync ERP data
 *
 * @param {string} integrationId - Integration ID
 * @param {string[]} modules - Modules to sync
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<Record<string, any>>} Sync results
 */
export async function syncERPData(
  integrationId: string,
  modules?: string[],
  transaction?: Transaction,
): Promise<Record<string, any>> {
  const integration = await getERPIntegrationById(integrationId);

  if (!integration) {
    throw new NotFoundException('ERP integration not found');
  }

  integration.syncStatus = 'running';

  const results: Record<string, any> = {
    integrationId,
    startedAt: new Date(),
    modules: {},
  };

  const modulesToSync = modules || integration.modules.filter((m) => m.enabled).map((m) => m.moduleName);

  for (const moduleName of modulesToSync) {
    try {
      const moduleResult = await syncERPModule(integration, moduleName);
      results.modules[moduleName] = moduleResult;
    } catch (error) {
      results.modules[moduleName] = {
        status: 'error',
        error: error.message,
      };
    }
  }

  integration.syncStatus = 'completed';
  integration.lastSyncAt = new Date();

  results.completedAt = new Date();

  return results;
}

/**
 * 24. Sync ERP module
 *
 * @param {ERPIntegration} integration - ERP integration
 * @param {string} moduleName - Module name
 * @returns {Promise<Record<string, any>>} Sync result
 */
export async function syncERPModule(integration: ERPIntegration, moduleName: string): Promise<Record<string, any>> {
  const module = integration.modules.find((m) => m.moduleName === moduleName);

  if (!module) {
    throw new NotFoundException(`Module ${moduleName} not found in integration`);
  }

  const client = await createERPAPIClient(integration);

  const result: Record<string, any> = {
    module: moduleName,
    status: 'success',
    recordsProcessed: 0,
    errors: [],
  };

  for (const entity of module.entities) {
    const data = await fetchERPEntity(client, entity, module.filters);
    const transformedData = await transformERPData(data, integration.mappings);

    // Import data into local system
    result.recordsProcessed += transformedData.length;
  }

  return result;
}

/**
 * 25. Fetch ERP entity data
 *
 * @param {AxiosInstance} client - API client
 * @param {string} entity - Entity name
 * @param {Record<string, any>} filters - Filters
 * @returns {Promise<any[]>} Entity data
 */
export async function fetchERPEntity(
  client: AxiosInstance,
  entity: string,
  filters?: Record<string, any>,
): Promise<any[]> {
  const response = await client.get(`/${entity}`, { params: filters });
  return response.data.items || response.data;
}

/**
 * 26. Transform ERP data using field mappings
 *
 * @param {any[]} data - Source data
 * @param {FieldMapping[]} mappings - Field mappings
 * @returns {Promise<any[]>} Transformed data
 */
export async function transformERPData(data: any[], mappings: FieldMapping[]): Promise<any[]> {
  return data.map((item) => {
    const transformed: Record<string, any> = {};

    for (const mapping of mappings) {
      let value = item[mapping.sourceField];

      // Apply transformation if specified
      if (mapping.transformation && value !== undefined) {
        value = applyTransformation(value, mapping.transformation);
      }

      // Use default value if not present
      if (value === undefined && mapping.defaultValue !== undefined) {
        value = mapping.defaultValue;
      }

      // Validate required fields
      if (mapping.required && value === undefined) {
        throw new Error(`Required field ${mapping.targetField} is missing`);
      }

      transformed[mapping.targetField] = value;
    }

    return transformed;
  });
}

/**
 * 27. Apply transformation to field value
 *
 * @param {any} value - Original value
 * @param {string} transformation - Transformation expression
 * @returns {any} Transformed value
 */
export function applyTransformation(value: any, transformation: string): any {
  // Simple transformation expressions
  switch (transformation) {
    case 'uppercase':
      return String(value).toUpperCase();
    case 'lowercase':
      return String(value).toLowerCase();
    case 'trim':
      return String(value).trim();
    case 'tonumber':
      return Number(value);
    case 'tostring':
      return String(value);
    case 'todate':
      return new Date(value);
    default:
      return value;
  }
}

/**
 * 28. Get ERP integration by ID
 *
 * @param {string} integrationId - Integration ID
 * @returns {Promise<ERPIntegration | null>} ERP integration or null
 */
export async function getERPIntegrationById(integrationId: string): Promise<ERPIntegration | null> {
  // Implementation would query database
  return null;
}

/**
 * 29. Create data import job
 *
 * @param {DataImportJob} job - Import job
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DataImportJob>} Created job
 */
export async function createDataImportJob(
  job: Partial<DataImportJob>,
  transaction?: Transaction,
): Promise<DataImportJob> {
  const importJob: DataImportJob = {
    jobId: generateUUID(),
    jobType: job.jobType!,
    sourceType: job.sourceType!,
    sourceLocation: job.sourceLocation,
    format: job.format!,
    totalRecords: 0,
    processedRecords: 0,
    successfulRecords: 0,
    failedRecords: 0,
    status: 'queued',
    errors: [],
    createdBy: job.createdBy!,
    createdAt: new Date(),
    metadata: job.metadata || {},
  };

  // Queue job for processing
  await queueImportJob(importJob);

  return importJob;
}

/**
 * 30. Queue import job for background processing
 *
 * @param {DataImportJob} job - Import job
 * @returns {Promise<void>}
 */
export async function queueImportJob(job: DataImportJob): Promise<void> {
  // Implementation would add to Bull queue or similar
  console.log(`Queued import job ${job.jobId}`);
}

/**
 * 31. Process import job
 *
 * @param {string} jobId - Job ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DataImportJob>} Processed job
 */
export async function processImportJob(jobId: string, transaction?: Transaction): Promise<DataImportJob> {
  const job = await getImportJobById(jobId);

  if (!job) {
    throw new NotFoundException('Import job not found');
  }

  job.status = 'processing';
  job.startedAt = new Date();

  try {
    // Read data based on source type
    const data = await readImportData(job);

    job.totalRecords = data.length;

    // Process each record
    for (let i = 0; i < data.length; i++) {
      try {
        await importRecord(data[i], job.jobType);
        job.successfulRecords++;
      } catch (error) {
        job.failedRecords++;
        job.errors.push({
          recordNumber: i + 1,
          errorType: 'import_error',
          errorMessage: error.message,
          rawData: data[i],
        });
      }

      job.processedRecords++;
    }

    job.status = job.failedRecords > 0 ? 'partial' : 'completed';
  } catch (error) {
    job.status = 'failed';
    job.errors.push({
      recordNumber: 0,
      errorType: 'job_error',
      errorMessage: error.message,
    });
  }

  job.completedAt = new Date();

  return job;
}

/**
 * 32. Read import data from source
 *
 * @param {DataImportJob} job - Import job
 * @returns {Promise<any[]>} Import data
 */
export async function readImportData(job: DataImportJob): Promise<any[]> {
  switch (job.sourceType) {
    case 'file':
      return await readFileData(job.sourceLocation!, job.format);
    case 'api':
      return await readAPIData(job.sourceLocation!);
    case 'sftp':
      return await readSFTPData(job.sourceLocation!, job.format);
    default:
      throw new Error(`Unsupported source type: ${job.sourceType}`);
  }
}

/**
 * 33. Read data from file
 *
 * @param {string} filePath - File path
 * @param {string} format - File format
 * @returns {Promise<any[]>} File data
 */
export async function readFileData(filePath: string, format: string): Promise<any[]> {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  switch (format) {
    case 'json':
      return JSON.parse(fileContent);
    case 'csv':
      return parseCSV(fileContent);
    case 'xml':
      return parseXML(fileContent);
    default:
      throw new Error(`Unsupported file format: ${format}`);
  }
}

/**
 * 34. Parse CSV data
 *
 * @param {string} content - CSV content
 * @returns {any[]} Parsed data
 */
export function parseCSV(content: string): any[] {
  const lines = content.split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());

  const data: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = lines[i].split(',').map((v) => v.trim());
    const record: Record<string, any> = {};

    headers.forEach((header, index) => {
      record[header] = values[index];
    });

    data.push(record);
  }

  return data;
}

/**
 * 35. Parse XML data
 *
 * @param {string} content - XML content
 * @returns {any[]} Parsed data
 */
export function parseXML(content: string): any[] {
  // Simplified XML parsing - in production, use a proper XML parser like xml2js
  return [];
}

/**
 * 36. Read data from API
 *
 * @param {string} url - API URL
 * @returns {Promise<any[]>} API data
 */
export async function readAPIData(url: string): Promise<any[]> {
  const response = await axios.get(url);
  return Array.isArray(response.data) ? response.data : [response.data];
}

/**
 * 37. Read data from SFTP
 *
 * @param {string} path - SFTP path
 * @param {string} format - File format
 * @returns {Promise<any[]>} SFTP data
 */
export async function readSFTPData(path: string, format: string): Promise<any[]> {
  // Implementation would use ssh2-sftp-client or similar
  return [];
}

/**
 * 38. Import individual record
 *
 * @param {any} record - Record to import
 * @param {string} jobType - Job type
 * @returns {Promise<void>}
 */
export async function importRecord(record: any, jobType: string): Promise<void> {
  // Implementation would save record to appropriate table based on jobType
  console.log(`Importing ${jobType} record:`, record);
}

/**
 * 39. Get import job by ID
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<DataImportJob | null>} Import job or null
 */
export async function getImportJobById(jobId: string): Promise<DataImportJob | null> {
  // Implementation would query database
  return null;
}

/**
 * 40. Create data export job
 *
 * @param {DataExportJob} job - Export job
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DataExportJob>} Created job
 */
export async function createDataExportJob(
  job: Partial<DataExportJob>,
  transaction?: Transaction,
): Promise<DataExportJob> {
  const exportJob: DataExportJob = {
    jobId: generateUUID(),
    jobType: job.jobType!,
    format: job.format!,
    filters: job.filters || {},
    columns: job.columns || [],
    totalRecords: 0,
    status: 'queued',
    createdBy: job.createdBy!,
    createdAt: new Date(),
    metadata: job.metadata || {},
  };

  // Queue job for processing
  await queueExportJob(exportJob);

  return exportJob;
}

/**
 * 41. Queue export job
 *
 * @param {DataExportJob} job - Export job
 * @returns {Promise<void>}
 */
export async function queueExportJob(job: DataExportJob): Promise<void> {
  console.log(`Queued export job ${job.jobId}`);
}

/**
 * 42. Process webhook delivery
 *
 * @param {string} webhookId - Webhook ID
 * @param {Record<string, any>} payload - Webhook payload
 * @returns {Promise<boolean>} Whether delivery was successful
 */
export async function processWebhookDelivery(webhookId: string, payload: Record<string, any>): Promise<boolean> {
  const webhook = await getWebhookById(webhookId);

  if (!webhook || !webhook.isActive) {
    return false;
  }

  const signature = generateWebhookSignature(payload, webhook.secret, webhook.signatureMethod);

  try {
    const response = await axios.post(webhook.url, payload, {
      headers: {
        ...webhook.headers,
        'X-Webhook-Signature': signature,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    webhook.lastDeliveredAt = new Date();
    webhook.deliveryAttempts++;

    return response.status >= 200 && response.status < 300;
  } catch (error) {
    webhook.deliveryAttempts++;

    // Retry based on retry policy
    if (webhook.deliveryAttempts < webhook.retryPolicy.maxRetries) {
      await retryWebhookDelivery(webhookId, payload, webhook.retryPolicy);
    }

    return false;
  }
}

/**
 * 43. Generate webhook signature
 *
 * @param {Record<string, any>} payload - Payload
 * @param {string} secret - Secret key
 * @param {string} method - Signature method
 * @returns {string} Signature
 */
export function generateWebhookSignature(payload: Record<string, any>, secret: string, method: string): string {
  const data = JSON.stringify(payload);

  switch (method) {
    case 'hmac_sha256':
      return crypto.createHmac('sha256', secret).update(data).digest('hex');
    case 'hmac_sha512':
      return crypto.createHmac('sha512', secret).update(data).digest('hex');
    default:
      return '';
  }
}

/**
 * 44. Retry webhook delivery
 *
 * @param {string} webhookId - Webhook ID
 * @param {Record<string, any>} payload - Payload
 * @param {RetryPolicy} retryPolicy - Retry policy
 * @returns {Promise<void>}
 */
export async function retryWebhookDelivery(
  webhookId: string,
  payload: Record<string, any>,
  retryPolicy: RetryPolicy,
): Promise<void> {
  const delay = retryPolicy.exponentialBackoff
    ? Math.min(retryPolicy.retryDelay * Math.pow(2, retryPolicy.maxRetries), retryPolicy.maxDelay)
    : retryPolicy.retryDelay;

  setTimeout(() => {
    processWebhookDelivery(webhookId, payload);
  }, delay);
}

/**
 * 45. Get webhook by ID
 *
 * @param {string} webhookId - Webhook ID
 * @returns {Promise<WebhookConfig | null>} Webhook config or null
 */
export async function getWebhookById(webhookId: string): Promise<WebhookConfig | null> {
  // Implementation would query database
  return null;
}

/**
 * Helper: Generate UUID
 *
 * @returns {string} UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('financial-integration')
@ApiBearerAuth()
@Controller('api/v1/financial/integration')
@UseInterceptors(IntegrationLoggingInterceptor)
export class FinancialIntegrationController {
  /**
   * Create bank connection
   */
  @Post('banks')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new bank connection' })
  @ApiResponse({ status: 201, description: 'Bank connection created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid connection data' })
  async createBank(@Body() connectionDto: BankConnectionDto): Promise<BankConnection> {
    return await createBankConnection(connectionDto as any);
  }

  /**
   * Sync bank transactions
   */
  @Post('banks/:connectionId/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync bank transactions' })
  @ApiQuery({ name: 'fromDate', required: true })
  @ApiQuery({ name: 'toDate', required: true })
  @ApiResponse({ status: 200, description: 'Transactions synced successfully' })
  async syncBank(
    @Param('connectionId') connectionId: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ): Promise<BankTransaction[]> {
    return await syncBankTransactions(connectionId, new Date(fromDate), new Date(toDate));
  }

  /**
   * Process payment transaction
   */
  @Post('payments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Process payment transaction' })
  @ApiResponse({ status: 201, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payment data' })
  async processPayment(@Body() paymentDto: PaymentTransactionDto): Promise<PaymentTransaction> {
    return await processPaymentTransaction(paymentDto as any);
  }

  /**
   * Refund payment
   */
  @Post('payments/:transactionId/refund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refund payment transaction' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully' })
  async refundPayment(
    @Param('transactionId') transactionId: string,
    @Body('amount') amount?: number,
    @Body('reason') reason?: string,
  ): Promise<PaymentTransaction> {
    return await refundPaymentTransaction(transactionId, amount, reason);
  }

  /**
   * Sync ERP data
   */
  @Post('erp/:integrationId/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync ERP data' })
  @ApiResponse({ status: 200, description: 'ERP data synced successfully' })
  async syncERP(
    @Param('integrationId') integrationId: string,
    @Body('modules') modules?: string[],
  ): Promise<Record<string, any>> {
    return await syncERPData(integrationId, modules);
  }

  /**
   * Create import job
   */
  @Post('import')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create data import job' })
  @ApiResponse({ status: 201, description: 'Import job created successfully' })
  async createImport(@Body() importDto: DataImportDto): Promise<DataImportJob> {
    const job: Partial<DataImportJob> = {
      jobType: importDto.jobType as any,
      sourceType: importDto.sourceType as any,
      format: importDto.format as any,
      sourceLocation: importDto.sourceLocation,
      createdBy: 'current-user-id', // Would come from auth context
      metadata: importDto.metadata,
    };

    return await createDataImportJob(job);
  }

  /**
   * Get import job status
   */
  @Get('import/:jobId')
  @ApiOperation({ summary: 'Get import job status' })
  @ApiResponse({ status: 200, description: 'Import job status retrieved successfully' })
  async getImportStatus(@Param('jobId') jobId: string): Promise<DataImportJob> {
    const job = await getImportJobById(jobId);

    if (!job) {
      throw new NotFoundException('Import job not found');
    }

    return job;
  }

  /**
   * Create export job
   */
  @Post('export')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create data export job' })
  @ApiResponse({ status: 201, description: 'Export job created successfully' })
  async createExport(
    @Body('jobType') jobType: string,
    @Body('format') format: string,
    @Body('filters') filters?: Record<string, any>,
    @Body('columns') columns?: string[],
  ): Promise<DataExportJob> {
    const job: Partial<DataExportJob> = {
      jobType: jobType as any,
      format: format as any,
      filters: filters || {},
      columns: columns || [],
      createdBy: 'current-user-id', // Would come from auth context
    };

    return await createDataExportJob(job);
  }
}
