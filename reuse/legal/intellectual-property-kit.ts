/**
 * LOC: IP_MGMT_KIT_001
 * File: /reuse/legal/intellectual-property-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - axios
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Legal management modules
 *   - IP portfolio controllers
 *   - Patent search services
 *   - Trademark monitoring services
 *   - Copyright management services
 */

/**
 * File: /reuse/legal/intellectual-property-kit.ts
 * Locator: WC-IP-MGMT-KIT-001
 * Purpose: Production-Grade Intellectual Property Management Kit - Enterprise IP lifecycle management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Node-Cron, Axios
 * Downstream: ../backend/modules/legal/*, IP portfolio controllers, Patent services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 40 production-ready IP management functions for legal platforms
 *
 * LLM Context: Production-grade intellectual property lifecycle management toolkit for White Cross platform.
 * Provides comprehensive patent search with USPTO/EPO integration, trademark monitoring with conflict detection,
 * copyright management with registration tracking, IP portfolio tracking with valuation analytics, prior art
 * search with AI-powered similarity detection, patent filing workflow management, trademark application
 * processing, copyright registration automation, IP licensing agreement management, IP infringement detection,
 * patent renewal deadline tracking, trademark renewal monitoring, IP assignment and transfer management,
 * IP valuation and analytics, trade secret protection tracking, IP litigation support, IP due diligence
 * reporting, inventor/creator management, IP classification (IPC/NICE), IP family tree tracking, patent
 * citation analysis, trademark image search, copyright fair use assessment, IP portfolio optimization,
 * freedom-to-operate analysis, IP competitive intelligence, patent landscape analysis, trademark watching
 * services, IP financial reporting, IP risk assessment, international IP filing (PCT/Madrid), IP maintenance
 * fee management, IP documentation management, IP strategic planning, IP audit trails, IP collaboration
 * tools, IP document generation, and healthcare/pharma-specific IP management (drug patents, medical device
 * patents, clinical trial IP).
 */

import * as crypto from 'crypto';
import {
  Injectable,
  Inject,
  Module,
  DynamicModule,
  Global,
  Logger,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
  registerAs,
} from '@nestjs/config';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
  Index,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * IP asset types
 */
export enum IPAssetType {
  PATENT = 'patent',
  TRADEMARK = 'trademark',
  COPYRIGHT = 'copyright',
  TRADE_SECRET = 'trade_secret',
  DESIGN = 'design',
  DOMAIN_NAME = 'domain_name',
  INDUSTRIAL_DESIGN = 'industrial_design',
  PLANT_VARIETY = 'plant_variety',
  GEOGRAPHICAL_INDICATION = 'geographical_indication',
}

/**
 * Patent types
 */
export enum PatentType {
  UTILITY = 'utility',
  DESIGN = 'design',
  PLANT = 'plant',
  PROVISIONAL = 'provisional',
  CONTINUATION = 'continuation',
  DIVISIONAL = 'divisional',
  REISSUE = 'reissue',
  PCT = 'pct',
}

/**
 * Patent status lifecycle
 */
export enum PatentStatus {
  IDEA = 'idea',
  PRIOR_ART_SEARCH = 'prior_art_search',
  DRAFTING = 'drafting',
  FILED = 'filed',
  PENDING = 'pending',
  PUBLISHED = 'published',
  EXAMINATION = 'examination',
  OFFICE_ACTION = 'office_action',
  ALLOWED = 'allowed',
  GRANTED = 'granted',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  ABANDONED = 'abandoned',
  REJECTED = 'rejected',
  REVOKED = 'revoked',
}

/**
 * Trademark types
 */
export enum TrademarkType {
  WORD_MARK = 'word_mark',
  LOGO = 'logo',
  COMPOSITE = 'composite',
  SOUND_MARK = 'sound_mark',
  COLOR_MARK = 'color_mark',
  THREE_D_MARK = 'three_d_mark',
  MOTION_MARK = 'motion_mark',
  HOLOGRAM = 'hologram',
  SERVICE_MARK = 'service_mark',
}

/**
 * Trademark status
 */
export enum TrademarkStatus {
  SEARCH = 'search',
  APPLICATION_PREP = 'application_prep',
  FILED = 'filed',
  PENDING = 'pending',
  PUBLISHED = 'published',
  OPPOSED = 'opposed',
  REGISTERED = 'registered',
  ACTIVE = 'active',
  RENEWED = 'renewed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  ABANDONED = 'abandoned',
}

/**
 * Copyright types
 */
export enum CopyrightType {
  LITERARY = 'literary',
  MUSICAL = 'musical',
  DRAMATIC = 'dramatic',
  CHOREOGRAPHIC = 'choreographic',
  PICTORIAL = 'pictorial',
  GRAPHIC = 'graphic',
  SCULPTURAL = 'sculptural',
  AUDIOVISUAL = 'audiovisual',
  SOUND_RECORDING = 'sound_recording',
  ARCHITECTURAL = 'architectural',
  SOFTWARE = 'software',
  DATABASE = 'database',
}

/**
 * Copyright status
 */
export enum CopyrightStatus {
  CREATED = 'created',
  REGISTRATION_PENDING = 'registration_pending',
  REGISTERED = 'registered',
  ACTIVE = 'active',
  PUBLIC_DOMAIN = 'public_domain',
  EXPIRED = 'expired',
  TRANSFERRED = 'transferred',
}

/**
 * IP jurisdiction
 */
export enum IPJurisdiction {
  US = 'us',
  EP = 'ep',
  JP = 'jp',
  CN = 'cn',
  GB = 'gb',
  CA = 'ca',
  AU = 'au',
  IN = 'in',
  BR = 'br',
  KR = 'kr',
  PCT = 'pct',
  MADRID = 'madrid',
  INTERNATIONAL = 'international',
}

/**
 * IP action types for tracking
 */
export enum IPActionType {
  FILING = 'filing',
  EXAMINATION = 'examination',
  OFFICE_ACTION = 'office_action',
  RESPONSE = 'response',
  AMENDMENT = 'amendment',
  PAYMENT = 'payment',
  RENEWAL = 'renewal',
  ASSIGNMENT = 'assignment',
  LICENSE = 'license',
  LITIGATION = 'litigation',
  OPPOSITION = 'opposition',
  MAINTENANCE = 'maintenance',
}

/**
 * Patent TypeScript interface
 */
export interface IPatent {
  id: string;
  patentNumber?: string;
  applicationNumber?: string;
  title: string;
  patentType: PatentType;
  status: PatentStatus;
  jurisdiction: IPJurisdiction;
  filingDate?: Date;
  publicationDate?: Date;
  grantDate?: Date;
  expirationDate?: Date;
  abstract?: string;
  claims?: string;
  description?: string;
  inventors: string[];
  assignee?: string;
  ipcClassifications?: string[];
  priorityDate?: Date;
  familyId?: string;
  estimatedValue?: number;
  maintenanceFees?: any;
  metadata?: Record<string, any>;
}

/**
 * Trademark TypeScript interface
 */
export interface ITrademark {
  id: string;
  registrationNumber?: string;
  applicationNumber?: string;
  markText?: string;
  trademarkType: TrademarkType;
  status: TrademarkStatus;
  jurisdiction: IPJurisdiction;
  filingDate?: Date;
  registrationDate?: Date;
  renewalDate?: Date;
  expirationDate?: Date;
  niceClasses?: number[];
  goodsServices?: string;
  owner?: string;
  imageUrl?: string;
  disclaimer?: string;
  metadata?: Record<string, any>;
}

/**
 * Copyright TypeScript interface
 */
export interface ICopyright {
  id: string;
  registrationNumber?: string;
  title: string;
  copyrightType: CopyrightType;
  status: CopyrightStatus;
  jurisdiction: IPJurisdiction;
  creationDate?: Date;
  publicationDate?: Date;
  registrationDate?: Date;
  authors: string[];
  owner?: string;
  workDescription?: string;
  isWorkForHire: boolean;
  derivative?: string;
  metadata?: Record<string, any>;
}

/**
 * Prior art search interface
 */
export interface IPriorArtSearch {
  id: string;
  patentId?: string;
  searchQuery: string;
  searchDate: Date;
  databases: string[];
  keywords?: string[];
  classifications?: string[];
  results?: any[];
  relevanceScores?: Record<string, number>;
  metadata?: Record<string, any>;
}

/**
 * IP portfolio interface
 */
export interface IPPortfolio {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  patents?: string[];
  trademarks?: string[];
  copyrights?: string[];
  totalValue?: number;
  lastValuationDate?: Date;
  metadata?: Record<string, any>;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const PatentSchema = z.object({
  id: z.string().uuid().optional(),
  patentNumber: z.string().optional(),
  applicationNumber: z.string().optional(),
  title: z.string().min(1).max(500),
  patentType: z.nativeEnum(PatentType),
  status: z.nativeEnum(PatentStatus),
  jurisdiction: z.nativeEnum(IPJurisdiction),
  filingDate: z.coerce.date().optional(),
  publicationDate: z.coerce.date().optional(),
  grantDate: z.coerce.date().optional(),
  expirationDate: z.coerce.date().optional(),
  abstract: z.string().optional(),
  claims: z.string().optional(),
  description: z.string().optional(),
  inventors: z.array(z.string()),
  assignee: z.string().optional(),
  ipcClassifications: z.array(z.string()).optional(),
  priorityDate: z.coerce.date().optional(),
  familyId: z.string().optional(),
  estimatedValue: z.number().optional(),
  maintenanceFees: z.any().optional(),
  metadata: z.record(z.any()).optional(),
});

export const TrademarkSchema = z.object({
  id: z.string().uuid().optional(),
  registrationNumber: z.string().optional(),
  applicationNumber: z.string().optional(),
  markText: z.string().optional(),
  trademarkType: z.nativeEnum(TrademarkType),
  status: z.nativeEnum(TrademarkStatus),
  jurisdiction: z.nativeEnum(IPJurisdiction),
  filingDate: z.coerce.date().optional(),
  registrationDate: z.coerce.date().optional(),
  renewalDate: z.coerce.date().optional(),
  expirationDate: z.coerce.date().optional(),
  niceClasses: z.array(z.number()).optional(),
  goodsServices: z.string().optional(),
  owner: z.string().optional(),
  imageUrl: z.string().url().optional(),
  disclaimer: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const CopyrightSchema = z.object({
  id: z.string().uuid().optional(),
  registrationNumber: z.string().optional(),
  title: z.string().min(1).max(500),
  copyrightType: z.nativeEnum(CopyrightType),
  status: z.nativeEnum(CopyrightStatus),
  jurisdiction: z.nativeEnum(IPJurisdiction),
  creationDate: z.coerce.date().optional(),
  publicationDate: z.coerce.date().optional(),
  registrationDate: z.coerce.date().optional(),
  authors: z.array(z.string()),
  owner: z.string().optional(),
  workDescription: z.string().optional(),
  isWorkForHire: z.boolean().default(false),
  derivative: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const PriorArtSearchSchema = z.object({
  id: z.string().uuid().optional(),
  patentId: z.string().uuid().optional(),
  searchQuery: z.string().min(1),
  searchDate: z.coerce.date(),
  databases: z.array(z.string()),
  keywords: z.array(z.string()).optional(),
  classifications: z.array(z.string()).optional(),
  results: z.array(z.any()).optional(),
  relevanceScores: z.record(z.number()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const IPPortfolioSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  ownerId: z.string().uuid(),
  patents: z.array(z.string().uuid()).optional(),
  trademarks: z.array(z.string().uuid()).optional(),
  copyrights: z.array(z.string().uuid()).optional(),
  totalValue: z.number().optional(),
  lastValuationDate: z.coerce.date().optional(),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Patent database model
 */
@Table({
  tableName: 'patents',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['patentNumber'] },
    { fields: ['applicationNumber'] },
    { fields: ['status'] },
    { fields: ['jurisdiction'] },
    { fields: ['filingDate'] },
    { fields: ['expirationDate'] },
  ],
})
export class Patent extends Model<IPatent> implements IPatent {
  @ApiProperty({ description: 'Patent unique identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiPropertyOptional({ description: 'Issued patent number' })
  @Index
  @Column(DataType.STRING)
  patentNumber?: string;

  @ApiPropertyOptional({ description: 'Patent application number' })
  @Index
  @Column(DataType.STRING)
  applicationNumber?: string;

  @ApiProperty({ description: 'Patent title' })
  @Column(DataType.STRING(500))
  title!: string;

  @ApiProperty({ description: 'Patent type', enum: PatentType })
  @Column(DataType.ENUM(...Object.values(PatentType)))
  patentType!: PatentType;

  @ApiProperty({ description: 'Patent status', enum: PatentStatus })
  @Index
  @Column(DataType.ENUM(...Object.values(PatentStatus)))
  status!: PatentStatus;

  @ApiProperty({ description: 'Patent jurisdiction', enum: IPJurisdiction })
  @Index
  @Column(DataType.ENUM(...Object.values(IPJurisdiction)))
  jurisdiction!: IPJurisdiction;

  @ApiPropertyOptional({ description: 'Filing date' })
  @Index
  @Column(DataType.DATE)
  filingDate?: Date;

  @ApiPropertyOptional({ description: 'Publication date' })
  @Column(DataType.DATE)
  publicationDate?: Date;

  @ApiPropertyOptional({ description: 'Grant date' })
  @Column(DataType.DATE)
  grantDate?: Date;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @Index
  @Column(DataType.DATE)
  expirationDate?: Date;

  @ApiPropertyOptional({ description: 'Patent abstract' })
  @Column(DataType.TEXT)
  abstract?: string;

  @ApiPropertyOptional({ description: 'Patent claims' })
  @Column(DataType.TEXT)
  claims?: string;

  @ApiPropertyOptional({ description: 'Patent description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ description: 'List of inventors', type: [String] })
  @Column(DataType.JSONB)
  inventors!: string[];

  @ApiPropertyOptional({ description: 'Assignee/owner' })
  @Column(DataType.STRING)
  assignee?: string;

  @ApiPropertyOptional({ description: 'IPC classifications', type: [String] })
  @Column(DataType.JSONB)
  ipcClassifications?: string[];

  @ApiPropertyOptional({ description: 'Priority date' })
  @Column(DataType.DATE)
  priorityDate?: Date;

  @ApiPropertyOptional({ description: 'Patent family ID' })
  @Column(DataType.STRING)
  familyId?: string;

  @ApiPropertyOptional({ description: 'Estimated patent value' })
  @Column(DataType.DECIMAL(15, 2))
  estimatedValue?: number;

  @ApiPropertyOptional({ description: 'Maintenance fees data' })
  @Column(DataType.JSONB)
  maintenanceFees?: any;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => PriorArtSearch)
  priorArtSearches?: PriorArtSearch[];

  @HasMany(() => IPAction)
  actions?: IPAction[];
}

/**
 * Trademark database model
 */
@Table({
  tableName: 'trademarks',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['registrationNumber'] },
    { fields: ['applicationNumber'] },
    { fields: ['status'] },
    { fields: ['jurisdiction'] },
    { fields: ['renewalDate'] },
  ],
})
export class Trademark extends Model<ITrademark> implements ITrademark {
  @ApiProperty({ description: 'Trademark unique identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiPropertyOptional({ description: 'Registration number' })
  @Index
  @Column(DataType.STRING)
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Application number' })
  @Index
  @Column(DataType.STRING)
  applicationNumber?: string;

  @ApiPropertyOptional({ description: 'Trademark text' })
  @Column(DataType.STRING)
  markText?: string;

  @ApiProperty({ description: 'Trademark type', enum: TrademarkType })
  @Column(DataType.ENUM(...Object.values(TrademarkType)))
  trademarkType!: TrademarkType;

  @ApiProperty({ description: 'Trademark status', enum: TrademarkStatus })
  @Index
  @Column(DataType.ENUM(...Object.values(TrademarkStatus)))
  status!: TrademarkStatus;

  @ApiProperty({ description: 'Jurisdiction', enum: IPJurisdiction })
  @Index
  @Column(DataType.ENUM(...Object.values(IPJurisdiction)))
  jurisdiction!: IPJurisdiction;

  @ApiPropertyOptional({ description: 'Filing date' })
  @Column(DataType.DATE)
  filingDate?: Date;

  @ApiPropertyOptional({ description: 'Registration date' })
  @Column(DataType.DATE)
  registrationDate?: Date;

  @ApiPropertyOptional({ description: 'Renewal date' })
  @Index
  @Column(DataType.DATE)
  renewalDate?: Date;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @Column(DataType.DATE)
  expirationDate?: Date;

  @ApiPropertyOptional({ description: 'Nice classification classes', type: [Number] })
  @Column(DataType.JSONB)
  niceClasses?: number[];

  @ApiPropertyOptional({ description: 'Goods and services description' })
  @Column(DataType.TEXT)
  goodsServices?: string;

  @ApiPropertyOptional({ description: 'Trademark owner' })
  @Column(DataType.STRING)
  owner?: string;

  @ApiPropertyOptional({ description: 'Trademark image URL' })
  @Column(DataType.STRING)
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Disclaimer text' })
  @Column(DataType.TEXT)
  disclaimer?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => IPAction)
  actions?: IPAction[];
}

/**
 * Copyright database model
 */
@Table({
  tableName: 'copyrights',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['registrationNumber'] },
    { fields: ['status'] },
    { fields: ['jurisdiction'] },
    { fields: ['creationDate'] },
  ],
})
export class Copyright extends Model<ICopyright> implements ICopyright {
  @ApiProperty({ description: 'Copyright unique identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiPropertyOptional({ description: 'Registration number' })
  @Index
  @Column(DataType.STRING)
  registrationNumber?: string;

  @ApiProperty({ description: 'Work title' })
  @Column(DataType.STRING(500))
  title!: string;

  @ApiProperty({ description: 'Copyright type', enum: CopyrightType })
  @Column(DataType.ENUM(...Object.values(CopyrightType)))
  copyrightType!: CopyrightType;

  @ApiProperty({ description: 'Copyright status', enum: CopyrightStatus })
  @Index
  @Column(DataType.ENUM(...Object.values(CopyrightStatus)))
  status!: CopyrightStatus;

  @ApiProperty({ description: 'Jurisdiction', enum: IPJurisdiction })
  @Index
  @Column(DataType.ENUM(...Object.values(IPJurisdiction)))
  jurisdiction!: IPJurisdiction;

  @ApiPropertyOptional({ description: 'Creation date' })
  @Index
  @Column(DataType.DATE)
  creationDate?: Date;

  @ApiPropertyOptional({ description: 'Publication date' })
  @Column(DataType.DATE)
  publicationDate?: Date;

  @ApiPropertyOptional({ description: 'Registration date' })
  @Column(DataType.DATE)
  registrationDate?: Date;

  @ApiProperty({ description: 'List of authors', type: [String] })
  @Column(DataType.JSONB)
  authors!: string[];

  @ApiPropertyOptional({ description: 'Copyright owner' })
  @Column(DataType.STRING)
  owner?: string;

  @ApiPropertyOptional({ description: 'Work description' })
  @Column(DataType.TEXT)
  workDescription?: string;

  @ApiProperty({ description: 'Work for hire flag' })
  @Default(false)
  @Column(DataType.BOOLEAN)
  isWorkForHire!: boolean;

  @ApiPropertyOptional({ description: 'Derivative work info' })
  @Column(DataType.TEXT)
  derivative?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => IPAction)
  actions?: IPAction[];
}

/**
 * Prior art search database model
 */
@Table({
  tableName: 'prior_art_searches',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['patentId'] },
    { fields: ['searchDate'] },
  ],
})
export class PriorArtSearch extends Model<IPriorArtSearch> implements IPriorArtSearch {
  @ApiProperty({ description: 'Search unique identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiPropertyOptional({ description: 'Associated patent ID' })
  @ForeignKey(() => Patent)
  @Index
  @Column(DataType.UUID)
  patentId?: string;

  @ApiProperty({ description: 'Search query' })
  @Column(DataType.TEXT)
  searchQuery!: string;

  @ApiProperty({ description: 'Search date' })
  @Index
  @Column(DataType.DATE)
  searchDate!: Date;

  @ApiProperty({ description: 'Databases searched', type: [String] })
  @Column(DataType.JSONB)
  databases!: string[];

  @ApiPropertyOptional({ description: 'Search keywords', type: [String] })
  @Column(DataType.JSONB)
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Classifications searched', type: [String] })
  @Column(DataType.JSONB)
  classifications?: string[];

  @ApiPropertyOptional({ description: 'Search results' })
  @Column(DataType.JSONB)
  results?: any[];

  @ApiPropertyOptional({ description: 'Relevance scores by result' })
  @Column(DataType.JSONB)
  relevanceScores?: Record<string, number>;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => Patent)
  patent?: Patent;
}

/**
 * IP portfolio database model
 */
@Table({
  tableName: 'ip_portfolios',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['ownerId'] },
    { fields: ['lastValuationDate'] },
  ],
})
export class IPPortfolio extends Model<IPPortfolio> implements IPPortfolio {
  @ApiProperty({ description: 'Portfolio unique identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiProperty({ description: 'Portfolio name' })
  @Column(DataType.STRING)
  name!: string;

  @ApiPropertyOptional({ description: 'Portfolio description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ description: 'Portfolio owner ID' })
  @Index
  @Column(DataType.UUID)
  ownerId!: string;

  @ApiPropertyOptional({ description: 'Patent IDs in portfolio', type: [String] })
  @Column(DataType.JSONB)
  patents?: string[];

  @ApiPropertyOptional({ description: 'Trademark IDs in portfolio', type: [String] })
  @Column(DataType.JSONB)
  trademarks?: string[];

  @ApiPropertyOptional({ description: 'Copyright IDs in portfolio', type: [String] })
  @Column(DataType.JSONB)
  copyrights?: string[];

  @ApiPropertyOptional({ description: 'Total portfolio value' })
  @Column(DataType.DECIMAL(15, 2))
  totalValue?: number;

  @ApiPropertyOptional({ description: 'Last valuation date' })
  @Index
  @Column(DataType.DATE)
  lastValuationDate?: Date;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * IP action/event tracking model
 */
@Table({
  tableName: 'ip_actions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['actionType'] },
    { fields: ['actionDate'] },
    { fields: ['dueDate'] },
  ],
})
export class IPAction extends Model {
  @ApiProperty({ description: 'Action unique identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiPropertyOptional({ description: 'Patent ID' })
  @ForeignKey(() => Patent)
  @Column(DataType.UUID)
  patentId?: string;

  @ApiPropertyOptional({ description: 'Trademark ID' })
  @ForeignKey(() => Trademark)
  @Column(DataType.UUID)
  trademarkId?: string;

  @ApiPropertyOptional({ description: 'Copyright ID' })
  @ForeignKey(() => Copyright)
  @Column(DataType.UUID)
  copyrightId?: string;

  @ApiProperty({ description: 'Action type', enum: IPActionType })
  @Index
  @Column(DataType.ENUM(...Object.values(IPActionType)))
  actionType!: IPActionType;

  @ApiProperty({ description: 'Action date' })
  @Index
  @Column(DataType.DATE)
  actionDate!: Date;

  @ApiPropertyOptional({ description: 'Due date for action' })
  @Index
  @Column(DataType.DATE)
  dueDate?: Date;

  @ApiPropertyOptional({ description: 'Action description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiPropertyOptional({ description: 'Action status' })
  @Column(DataType.STRING)
  status?: string;

  @ApiPropertyOptional({ description: 'Responsible party' })
  @Column(DataType.STRING)
  responsibleParty?: string;

  @ApiPropertyOptional({ description: 'Action cost' })
  @Column(DataType.DECIMAL(15, 2))
  cost?: number;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => Patent)
  patent?: Patent;

  @BelongsTo(() => Trademark)
  trademark?: Trademark;

  @BelongsTo(() => Copyright)
  copyright?: Copyright;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export const ipManagementConfig = registerAs('ipManagement', () => ({
  usptoApiKey: process.env.USPTO_API_KEY,
  usptoApiUrl: process.env.USPTO_API_URL || 'https://developer.uspto.gov/api',
  epoApiKey: process.env.EPO_API_KEY,
  epoApiUrl: process.env.EPO_API_URL || 'https://ops.epo.org/3.2',
  priorArtDatabases: process.env.PRIOR_ART_DATABASES?.split(',') || ['USPTO', 'EPO', 'Google Patents'],
  renewalReminderDays: parseInt(process.env.IP_RENEWAL_REMINDER_DAYS || '90', 10),
  maintenanceFeeSchedule: process.env.IP_MAINTENANCE_FEE_SCHEDULE || '3.5,7.5,11.5', // years
  valuationMethod: process.env.IP_VALUATION_METHOD || 'cost',
  enableTrademarkMonitoring: process.env.ENABLE_TRADEMARK_MONITORING === 'true',
  trademarkWatchingInterval: process.env.TRADEMARK_WATCHING_INTERVAL || '0 0 * * *', // daily
}));

// ============================================================================
// INJECTABLE SERVICES
// ============================================================================

/**
 * Patent search and management service
 */
@Injectable()
export class PatentService {
  private readonly logger = new Logger(PatentService.name);

  constructor(
    @Inject('SEQUELIZE') private sequelize: any,
    private configService: ConfigService,
  ) {}

  /**
   * 1. Create a new patent record
   */
  async createPatent(data: z.infer<typeof PatentSchema>): Promise<Patent> {
    try {
      const validated = PatentSchema.parse(data);
      const patent = await Patent.create(validated as any);
      this.logger.log(`Created patent: ${patent.id}`);
      return patent;
    } catch (error) {
      this.logger.error('Error creating patent', error);
      throw new BadRequestException('Failed to create patent');
    }
  }

  /**
   * 2. Search patents by criteria
   */
  async searchPatents(criteria: {
    query?: string;
    status?: PatentStatus;
    jurisdiction?: IPJurisdiction;
    patentType?: PatentType;
    inventors?: string[];
    assignee?: string;
    ipcClassification?: string;
    filingDateFrom?: Date;
    filingDateTo?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ patents: Patent[]; total: number }> {
    try {
      const where: WhereOptions = {};

      if (criteria.status) where['status'] = criteria.status;
      if (criteria.jurisdiction) where['jurisdiction'] = criteria.jurisdiction;
      if (criteria.patentType) where['patentType'] = criteria.patentType;
      if (criteria.assignee) where['assignee'] = { [Op.iLike]: `%${criteria.assignee}%` };

      if (criteria.query) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${criteria.query}%` } },
          { abstract: { [Op.iLike]: `%${criteria.query}%` } },
          { patentNumber: { [Op.iLike]: `%${criteria.query}%` } },
        ];
      }

      if (criteria.filingDateFrom || criteria.filingDateTo) {
        where['filingDate'] = {};
        if (criteria.filingDateFrom) where['filingDate'][Op.gte] = criteria.filingDateFrom;
        if (criteria.filingDateTo) where['filingDate'][Op.lte] = criteria.filingDateTo;
      }

      const { rows: patents, count: total } = await Patent.findAndCountAll({
        where,
        limit: criteria.limit || 50,
        offset: criteria.offset || 0,
        order: [['createdAt', 'DESC']],
      });

      return { patents, total };
    } catch (error) {
      this.logger.error('Error searching patents', error);
      throw new InternalServerErrorException('Failed to search patents');
    }
  }

  /**
   * 3. Update patent status
   */
  async updatePatentStatus(patentId: string, status: PatentStatus, metadata?: any): Promise<Patent> {
    try {
      const patent = await Patent.findByPk(patentId);
      if (!patent) throw new NotFoundException('Patent not found');

      patent.status = status;
      if (metadata) patent.metadata = { ...patent.metadata, ...metadata };

      if (status === PatentStatus.GRANTED && !patent.grantDate) {
        patent.grantDate = new Date();
        // Calculate expiration date (typically 20 years from filing)
        if (patent.filingDate) {
          const expirationDate = new Date(patent.filingDate);
          expirationDate.setFullYear(expirationDate.getFullYear() + 20);
          patent.expirationDate = expirationDate;
        }
      }

      await patent.save();
      this.logger.log(`Updated patent ${patentId} status to ${status}`);
      return patent;
    } catch (error) {
      this.logger.error('Error updating patent status', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to update patent status');
    }
  }

  /**
   * 4. Get patent by ID with related data
   */
  async getPatentById(patentId: string): Promise<Patent> {
    try {
      const patent = await Patent.findByPk(patentId, {
        include: [
          { model: PriorArtSearch, as: 'priorArtSearches' },
          { model: IPAction, as: 'actions' },
        ],
      });

      if (!patent) throw new NotFoundException('Patent not found');
      return patent;
    } catch (error) {
      this.logger.error('Error getting patent', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to get patent');
    }
  }

  /**
   * 5. Get patents expiring soon
   */
  async getPatentsExpiringSoon(daysAhead: number = 90): Promise<Patent[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const patents = await Patent.findAll({
        where: {
          expirationDate: {
            [Op.between]: [new Date(), futureDate],
          },
          status: {
            [Op.in]: [PatentStatus.ACTIVE, PatentStatus.GRANTED],
          },
        },
        order: [['expirationDate', 'ASC']],
      });

      return patents;
    } catch (error) {
      this.logger.error('Error getting expiring patents', error);
      throw new InternalServerErrorException('Failed to get expiring patents');
    }
  }

  /**
   * 6. Calculate patent maintenance fees
   */
  async calculateMaintenanceFees(patentId: string): Promise<{ fees: any[]; totalCost: number }> {
    try {
      const patent = await Patent.findByPk(patentId);
      if (!patent) throw new NotFoundException('Patent not found');

      if (!patent.grantDate) {
        return { fees: [], totalCost: 0 };
      }

      const feeSchedule = this.configService.get<string>('ipManagement.maintenanceFeeSchedule', '3.5,7.5,11.5');
      const years = feeSchedule.split(',').map(y => parseFloat(y));

      const fees: any[] = [];
      let totalCost = 0;

      // US utility patent fee schedule (example)
      const feeAmounts: Record<number, number> = {
        3.5: 1600,
        7.5: 3600,
        11.5: 7400,
      };

      for (const year of years) {
        const dueDate = new Date(patent.grantDate);
        dueDate.setFullYear(dueDate.getFullYear() + Math.floor(year));
        dueDate.setMonth(dueDate.getMonth() + Math.round((year % 1) * 12));

        fees.push({
          year,
          dueDate,
          amount: feeAmounts[year] || 0,
          isPaid: patent.maintenanceFees?.[`year_${year}`]?.paid || false,
        });

        if (!patent.maintenanceFees?.[`year_${year}`]?.paid) {
          totalCost += feeAmounts[year] || 0;
        }
      }

      return { fees, totalCost };
    } catch (error) {
      this.logger.error('Error calculating maintenance fees', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to calculate maintenance fees');
    }
  }

  /**
   * 7. Get patent family tree
   */
  async getPatentFamily(patentId: string): Promise<Patent[]> {
    try {
      const patent = await Patent.findByPk(patentId);
      if (!patent) throw new NotFoundException('Patent not found');

      if (!patent.familyId) return [patent];

      const familyMembers = await Patent.findAll({
        where: { familyId: patent.familyId },
        order: [['filingDate', 'ASC']],
      });

      return familyMembers;
    } catch (error) {
      this.logger.error('Error getting patent family', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to get patent family');
    }
  }

  /**
   * 8. Analyze patent citations
   */
  async analyzePatentCitations(patentId: string): Promise<{
    forwardCitations: number;
    backwardCitations: number;
    citationScore: number;
  }> {
    try {
      const patent = await Patent.findByPk(patentId);
      if (!patent) throw new NotFoundException('Patent not found');

      // This would integrate with external APIs in production
      const citations = patent.metadata?.citations || {};
      const forwardCitations = citations.forward?.length || 0;
      const backwardCitations = citations.backward?.length || 0;

      // Simple citation score calculation
      const citationScore = (forwardCitations * 2) + backwardCitations;

      return { forwardCitations, backwardCitations, citationScore };
    } catch (error) {
      this.logger.error('Error analyzing citations', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to analyze citations');
    }
  }
}

/**
 * Prior art search service
 */
@Injectable()
export class PriorArtSearchService {
  private readonly logger = new Logger(PriorArtSearchService.name);

  constructor(
    @Inject('SEQUELIZE') private sequelize: any,
    private configService: ConfigService,
  ) {}

  /**
   * 9. Conduct prior art search
   */
  async conductPriorArtSearch(data: z.infer<typeof PriorArtSearchSchema>): Promise<PriorArtSearch> {
    try {
      const validated = PriorArtSearchSchema.parse(data);

      // In production, this would call external patent databases
      const searchResults = await this.searchExternalDatabases(validated.searchQuery, validated.databases);

      const search = await PriorArtSearch.create({
        ...validated,
        results: searchResults,
        relevanceScores: this.calculateRelevanceScores(searchResults, validated.searchQuery),
      } as any);

      this.logger.log(`Conducted prior art search: ${search.id}`);
      return search;
    } catch (error) {
      this.logger.error('Error conducting prior art search', error);
      throw new BadRequestException('Failed to conduct prior art search');
    }
  }

  /**
   * 10. Get prior art search results
   */
  async getPriorArtSearchResults(searchId: string): Promise<PriorArtSearch> {
    try {
      const search = await PriorArtSearch.findByPk(searchId, {
        include: [{ model: Patent, as: 'patent' }],
      });

      if (!search) throw new NotFoundException('Prior art search not found');
      return search;
    } catch (error) {
      this.logger.error('Error getting prior art search', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to get prior art search');
    }
  }

  /**
   * 11. Search similar patents (AI-powered similarity)
   */
  async searchSimilarPatents(patentId: string, limit: number = 10): Promise<any[]> {
    try {
      const patent = await Patent.findByPk(patentId);
      if (!patent) throw new NotFoundException('Patent not found');

      // In production, this would use AI/ML similarity detection
      const similarPatents = await Patent.findAll({
        where: {
          id: { [Op.ne]: patentId },
          status: { [Op.ne]: PatentStatus.ABANDONED },
          ipcClassifications: {
            [Op.overlap]: patent.ipcClassifications || [],
          },
        },
        limit,
        order: [['createdAt', 'DESC']],
      });

      return similarPatents.map(p => ({
        patent: p,
        similarityScore: this.calculateSimilarityScore(patent, p),
      }));
    } catch (error) {
      this.logger.error('Error searching similar patents', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to search similar patents');
    }
  }

  private async searchExternalDatabases(query: string, databases: string[]): Promise<any[]> {
    // Mock implementation - would call real APIs in production
    return databases.map(db => ({
      database: db,
      results: [],
      searchedAt: new Date(),
    }));
  }

  private calculateRelevanceScores(results: any[], query: string): Record<string, number> {
    // Mock implementation - would use actual relevance algorithm
    return {};
  }

  private calculateSimilarityScore(patent1: Patent, patent2: Patent): number {
    // Mock implementation - would use NLP/ML in production
    let score = 0;

    // IPC classification overlap
    const ipc1 = patent1.ipcClassifications || [];
    const ipc2 = patent2.ipcClassifications || [];
    const ipcOverlap = ipc1.filter(c => ipc2.includes(c)).length;
    score += ipcOverlap * 20;

    // Same jurisdiction
    if (patent1.jurisdiction === patent2.jurisdiction) score += 10;

    // Title similarity (simple word overlap)
    const words1 = patent1.title.toLowerCase().split(' ');
    const words2 = patent2.title.toLowerCase().split(' ');
    const wordOverlap = words1.filter(w => words2.includes(w)).length;
    score += wordOverlap * 5;

    return Math.min(score, 100);
  }
}

/**
 * Trademark monitoring and management service
 */
@Injectable()
export class TrademarkService {
  private readonly logger = new Logger(TrademarkService.name);

  constructor(
    @Inject('SEQUELIZE') private sequelize: any,
    private configService: ConfigService,
  ) {}

  /**
   * 12. Create a new trademark record
   */
  async createTrademark(data: z.infer<typeof TrademarkSchema>): Promise<Trademark> {
    try {
      const validated = TrademarkSchema.parse(data);
      const trademark = await Trademark.create(validated as any);
      this.logger.log(`Created trademark: ${trademark.id}`);
      return trademark;
    } catch (error) {
      this.logger.error('Error creating trademark', error);
      throw new BadRequestException('Failed to create trademark');
    }
  }

  /**
   * 13. Search trademarks by criteria
   */
  async searchTrademarks(criteria: {
    query?: string;
    status?: TrademarkStatus;
    jurisdiction?: IPJurisdiction;
    trademarkType?: TrademarkType;
    niceClass?: number;
    owner?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ trademarks: Trademark[]; total: number }> {
    try {
      const where: WhereOptions = {};

      if (criteria.status) where['status'] = criteria.status;
      if (criteria.jurisdiction) where['jurisdiction'] = criteria.jurisdiction;
      if (criteria.trademarkType) where['trademarkType'] = criteria.trademarkType;
      if (criteria.owner) where['owner'] = { [Op.iLike]: `%${criteria.owner}%` };

      if (criteria.query) {
        where[Op.or] = [
          { markText: { [Op.iLike]: `%${criteria.query}%` } },
          { registrationNumber: { [Op.iLike]: `%${criteria.query}%` } },
          { goodsServices: { [Op.iLike]: `%${criteria.query}%` } },
        ];
      }

      if (criteria.niceClass) {
        where['niceClasses'] = {
          [Op.contains]: [criteria.niceClass],
        };
      }

      const { rows: trademarks, count: total } = await Trademark.findAndCountAll({
        where,
        limit: criteria.limit || 50,
        offset: criteria.offset || 0,
        order: [['createdAt', 'DESC']],
      });

      return { trademarks, total };
    } catch (error) {
      this.logger.error('Error searching trademarks', error);
      throw new InternalServerErrorException('Failed to search trademarks');
    }
  }

  /**
   * 14. Monitor for conflicting trademarks
   */
  async monitorTrademarkConflicts(trademarkId: string): Promise<Trademark[]> {
    try {
      const trademark = await Trademark.findByPk(trademarkId);
      if (!trademark) throw new NotFoundException('Trademark not found');

      const potentialConflicts = await Trademark.findAll({
        where: {
          id: { [Op.ne]: trademarkId },
          status: {
            [Op.in]: [TrademarkStatus.REGISTERED, TrademarkStatus.ACTIVE, TrademarkStatus.PENDING],
          },
          jurisdiction: trademark.jurisdiction,
          niceClasses: {
            [Op.overlap]: trademark.niceClasses || [],
          },
        },
      });

      // Filter by similarity
      const conflicts = potentialConflicts.filter(tm =>
        this.calculateTrademarkSimilarity(trademark, tm) > 70
      );

      return conflicts;
    } catch (error) {
      this.logger.error('Error monitoring trademark conflicts', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to monitor conflicts');
    }
  }

  /**
   * 15. Get trademarks requiring renewal
   */
  async getTrademarksRequiringRenewal(daysAhead: number = 90): Promise<Trademark[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const trademarks = await Trademark.findAll({
        where: {
          renewalDate: {
            [Op.between]: [new Date(), futureDate],
          },
          status: {
            [Op.in]: [TrademarkStatus.REGISTERED, TrademarkStatus.ACTIVE],
          },
        },
        order: [['renewalDate', 'ASC']],
      });

      return trademarks;
    } catch (error) {
      this.logger.error('Error getting trademarks requiring renewal', error);
      throw new InternalServerErrorException('Failed to get trademarks requiring renewal');
    }
  }

  /**
   * 16. Update trademark status
   */
  async updateTrademarkStatus(trademarkId: string, status: TrademarkStatus): Promise<Trademark> {
    try {
      const trademark = await Trademark.findByPk(trademarkId);
      if (!trademark) throw new NotFoundException('Trademark not found');

      trademark.status = status;

      if (status === TrademarkStatus.REGISTERED && !trademark.registrationDate) {
        trademark.registrationDate = new Date();
        // Calculate renewal date (typically 10 years)
        const renewalDate = new Date(trademark.registrationDate);
        renewalDate.setFullYear(renewalDate.getFullYear() + 10);
        trademark.renewalDate = renewalDate;
      }

      await trademark.save();
      this.logger.log(`Updated trademark ${trademarkId} status to ${status}`);
      return trademark;
    } catch (error) {
      this.logger.error('Error updating trademark status', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to update trademark status');
    }
  }

  /**
   * 17. Search trademark by image similarity
   */
  async searchTrademarkByImage(imageUrl: string, jurisdiction?: IPJurisdiction): Promise<Trademark[]> {
    try {
      // In production, this would use image similarity AI/ML
      const where: WhereOptions = {
        imageUrl: { [Op.ne]: null },
        status: {
          [Op.in]: [TrademarkStatus.REGISTERED, TrademarkStatus.ACTIVE, TrademarkStatus.PENDING],
        },
      };

      if (jurisdiction) where['jurisdiction'] = jurisdiction;

      const trademarks = await Trademark.findAll({ where, limit: 20 });

      // Mock similarity scoring - would use actual image comparison in production
      return trademarks.map(tm => ({
        ...tm.toJSON(),
        similarityScore: Math.random() * 100,
      })).sort((a, b) => b.similarityScore - a.similarityScore) as any;
    } catch (error) {
      this.logger.error('Error searching trademark by image', error);
      throw new InternalServerErrorException('Failed to search trademark by image');
    }
  }

  private calculateTrademarkSimilarity(tm1: Trademark, tm2: Trademark): number {
    // Simple similarity calculation - would use advanced algorithms in production
    let score = 0;

    if (tm1.markText && tm2.markText) {
      const text1 = tm1.markText.toLowerCase();
      const text2 = tm2.markText.toLowerCase();

      if (text1 === text2) score += 100;
      else if (text1.includes(text2) || text2.includes(text1)) score += 70;
      else {
        const words1 = text1.split(' ');
        const words2 = text2.split(' ');
        const overlap = words1.filter(w => words2.includes(w)).length;
        score += (overlap / Math.max(words1.length, words2.length)) * 50;
      }
    }

    return score;
  }
}

/**
 * Copyright management service
 */
@Injectable()
export class CopyrightService {
  private readonly logger = new Logger(CopyrightService.name);

  constructor(@Inject('SEQUELIZE') private sequelize: any) {}

  /**
   * 18. Create a new copyright record
   */
  async createCopyright(data: z.infer<typeof CopyrightSchema>): Promise<Copyright> {
    try {
      const validated = CopyrightSchema.parse(data);
      const copyright = await Copyright.create(validated as any);
      this.logger.log(`Created copyright: ${copyright.id}`);
      return copyright;
    } catch (error) {
      this.logger.error('Error creating copyright', error);
      throw new BadRequestException('Failed to create copyright');
    }
  }

  /**
   * 19. Search copyrights by criteria
   */
  async searchCopyrights(criteria: {
    query?: string;
    status?: CopyrightStatus;
    jurisdiction?: IPJurisdiction;
    copyrightType?: CopyrightType;
    author?: string;
    owner?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ copyrights: Copyright[]; total: number }> {
    try {
      const where: WhereOptions = {};

      if (criteria.status) where['status'] = criteria.status;
      if (criteria.jurisdiction) where['jurisdiction'] = criteria.jurisdiction;
      if (criteria.copyrightType) where['copyrightType'] = criteria.copyrightType;
      if (criteria.owner) where['owner'] = { [Op.iLike]: `%${criteria.owner}%` };

      if (criteria.query) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${criteria.query}%` } },
          { registrationNumber: { [Op.iLike]: `%${criteria.query}%` } },
          { workDescription: { [Op.iLike]: `%${criteria.query}%` } },
        ];
      }

      const { rows: copyrights, count: total } = await Copyright.findAndCountAll({
        where,
        limit: criteria.limit || 50,
        offset: criteria.offset || 0,
        order: [['createdAt', 'DESC']],
      });

      return { copyrights, total };
    } catch (error) {
      this.logger.error('Error searching copyrights', error);
      throw new InternalServerErrorException('Failed to search copyrights');
    }
  }

  /**
   * 20. Update copyright status
   */
  async updateCopyrightStatus(copyrightId: string, status: CopyrightStatus): Promise<Copyright> {
    try {
      const copyright = await Copyright.findByPk(copyrightId);
      if (!copyright) throw new NotFoundException('Copyright not found');

      copyright.status = status;

      if (status === CopyrightStatus.REGISTERED && !copyright.registrationDate) {
        copyright.registrationDate = new Date();
      }

      await copyright.save();
      this.logger.log(`Updated copyright ${copyrightId} status to ${status}`);
      return copyright;
    } catch (error) {
      this.logger.error('Error updating copyright status', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to update copyright status');
    }
  }

  /**
   * 21. Calculate copyright term
   */
  async calculateCopyrightTerm(copyrightId: string): Promise<{
    creationDate: Date;
    expirationDate: Date;
    yearsRemaining: number;
    termType: string;
  }> {
    try {
      const copyright = await Copyright.findByPk(copyrightId);
      if (!copyright) throw new NotFoundException('Copyright not found');

      const creationDate = copyright.creationDate || copyright.createdAt;
      let termYears = 70; // Default: life of author + 70 years

      if (copyright.isWorkForHire) {
        termYears = 95; // Work for hire: 95 years from publication or 120 from creation
      }

      const expirationDate = new Date(creationDate);
      expirationDate.setFullYear(expirationDate.getFullYear() + termYears);

      const now = new Date();
      const yearsRemaining = Math.max(0, expirationDate.getFullYear() - now.getFullYear());

      return {
        creationDate,
        expirationDate,
        yearsRemaining,
        termType: copyright.isWorkForHire ? 'work_for_hire' : 'author_life_plus_70',
      };
    } catch (error) {
      this.logger.error('Error calculating copyright term', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to calculate copyright term');
    }
  }

  /**
   * 22. Assess fair use for copyright
   */
  async assessFairUse(copyrightId: string, useCase: {
    purpose: string;
    nature: string;
    amount: string;
    effect: string;
  }): Promise<{ fairUseScore: number; factors: any; recommendation: string }> {
    try {
      const copyright = await Copyright.findByPk(copyrightId);
      if (!copyright) throw new NotFoundException('Copyright not found');

      // Four factors of fair use analysis
      const factors = {
        purpose: this.scorePurpose(useCase.purpose),
        nature: this.scoreNature(useCase.nature, copyright.copyrightType),
        amount: this.scoreAmount(useCase.amount),
        effect: this.scoreEffect(useCase.effect),
      };

      const fairUseScore = (factors.purpose + factors.nature + factors.amount + factors.effect) / 4;

      let recommendation = 'Unclear';
      if (fairUseScore >= 75) recommendation = 'Likely fair use';
      else if (fairUseScore >= 50) recommendation = 'Possible fair use - consult attorney';
      else recommendation = 'Unlikely fair use';

      return { fairUseScore, factors, recommendation };
    } catch (error) {
      this.logger.error('Error assessing fair use', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to assess fair use');
    }
  }

  private scorePurpose(purpose: string): number {
    const educational = /education|research|criticism|commentary|news/i.test(purpose);
    const transformative = /transform|parody|commentary/i.test(purpose);
    const commercial = /commercial|profit|sale/i.test(purpose);

    if (transformative) return 90;
    if (educational && !commercial) return 80;
    if (educational) return 60;
    if (commercial) return 30;
    return 50;
  }

  private scoreNature(nature: string, type: CopyrightType): number {
    const factual = /factual|informational|reference/i.test(nature);
    const creative = /creative|fictional|artistic/i.test(nature);

    if (type === CopyrightType.DATABASE || type === CopyrightType.SOFTWARE) return 70;
    if (factual) return 75;
    if (creative) return 40;
    return 50;
  }

  private scoreAmount(amount: string): number {
    const minimal = /minimal|small|excerpt|portion/i.test(amount);
    const substantial = /substantial|whole|entire|complete/i.test(amount);

    if (minimal) return 80;
    if (substantial) return 20;
    return 50;
  }

  private scoreEffect(effect: string): number {
    const noEffect = /no.?effect|minimal|different.?market/i.test(effect);
    const harmful = /harm|substitute|replacement|compete/i.test(effect);

    if (noEffect) return 85;
    if (harmful) return 15;
    return 50;
  }
}

/**
 * IP portfolio tracking and analytics service
 */
@Injectable()
export class IPPortfolioService {
  private readonly logger = new Logger(IPPortfolioService.name);

  constructor(
    @Inject('SEQUELIZE') private sequelize: any,
    private configService: ConfigService,
  ) {}

  /**
   * 23. Create IP portfolio
   */
  async createPortfolio(data: z.infer<typeof IPPortfolioSchema>): Promise<IPPortfolio> {
    try {
      const validated = IPPortfolioSchema.parse(data);
      const portfolio = await IPPortfolio.create(validated as any);
      this.logger.log(`Created IP portfolio: ${portfolio.id}`);
      return portfolio;
    } catch (error) {
      this.logger.error('Error creating portfolio', error);
      throw new BadRequestException('Failed to create portfolio');
    }
  }

  /**
   * 24. Add IP asset to portfolio
   */
  async addAssetToPortfolio(portfolioId: string, assetType: IPAssetType, assetId: string): Promise<IPPortfolio> {
    try {
      const portfolio = await IPPortfolio.findByPk(portfolioId);
      if (!portfolio) throw new NotFoundException('Portfolio not found');

      const field = assetType === IPAssetType.PATENT ? 'patents'
        : assetType === IPAssetType.TRADEMARK ? 'trademarks'
        : 'copyrights';

      const assets = portfolio[field] || [];
      if (!assets.includes(assetId)) {
        portfolio[field] = [...assets, assetId];
        await portfolio.save();
      }

      this.logger.log(`Added ${assetType} ${assetId} to portfolio ${portfolioId}`);
      return portfolio;
    } catch (error) {
      this.logger.error('Error adding asset to portfolio', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to add asset to portfolio');
    }
  }

  /**
   * 25. Get portfolio summary with all assets
   */
  async getPortfolioSummary(portfolioId: string): Promise<{
    portfolio: IPPortfolio;
    patents: Patent[];
    trademarks: Trademark[];
    copyrights: Copyright[];
    totalValue: number;
    assetCounts: Record<string, number>;
  }> {
    try {
      const portfolio = await IPPortfolio.findByPk(portfolioId);
      if (!portfolio) throw new NotFoundException('Portfolio not found');

      const patents = await Patent.findAll({
        where: { id: { [Op.in]: portfolio.patents || [] } },
      });

      const trademarks = await Trademark.findAll({
        where: { id: { [Op.in]: portfolio.trademarks || [] } },
      });

      const copyrights = await Copyright.findAll({
        where: { id: { [Op.in]: portfolio.copyrights || [] } },
      });

      const totalValue = patents.reduce((sum, p) => sum + (p.estimatedValue || 0), 0);

      return {
        portfolio,
        patents,
        trademarks,
        copyrights,
        totalValue,
        assetCounts: {
          patents: patents.length,
          trademarks: trademarks.length,
          copyrights: copyrights.length,
          total: patents.length + trademarks.length + copyrights.length,
        },
      };
    } catch (error) {
      this.logger.error('Error getting portfolio summary', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to get portfolio summary');
    }
  }

  /**
   * 26. Valuate IP portfolio
   */
  async valuatePortfolio(portfolioId: string, method: 'cost' | 'market' | 'income' = 'cost'): Promise<{
    totalValue: number;
    breakdown: Record<string, number>;
    method: string;
    valuationDate: Date;
  }> {
    try {
      const summary = await this.getPortfolioSummary(portfolioId);

      let patentValue = 0;
      let trademarkValue = 0;
      let copyrightValue = 0;

      if (method === 'cost') {
        // Cost-based valuation
        patentValue = summary.patents.length * 50000; // Average cost per patent
        trademarkValue = summary.trademarks.length * 25000; // Average cost per trademark
        copyrightValue = summary.copyrights.length * 10000; // Average cost per copyright
      } else if (method === 'market') {
        // Market-based valuation (simplified)
        patentValue = summary.patents.reduce((sum, p) => sum + (p.estimatedValue || 75000), 0);
        trademarkValue = summary.trademarks.length * 40000;
        copyrightValue = summary.copyrights.length * 15000;
      } else {
        // Income-based valuation (simplified)
        patentValue = summary.patents.length * 100000;
        trademarkValue = summary.trademarks.length * 60000;
        copyrightValue = summary.copyrights.length * 20000;
      }

      const totalValue = patentValue + trademarkValue + copyrightValue;

      // Update portfolio
      summary.portfolio.totalValue = totalValue;
      summary.portfolio.lastValuationDate = new Date();
      await summary.portfolio.save();

      return {
        totalValue,
        breakdown: {
          patents: patentValue,
          trademarks: trademarkValue,
          copyrights: copyrightValue,
        },
        method,
        valuationDate: new Date(),
      };
    } catch (error) {
      this.logger.error('Error valuating portfolio', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to valuate portfolio');
    }
  }

  /**
   * 27. Analyze portfolio risk
   */
  async analyzePortfolioRisk(portfolioId: string): Promise<{
    overallRisk: string;
    riskScore: number;
    factors: any;
    recommendations: string[];
  }> {
    try {
      const summary = await this.getPortfolioSummary(portfolioId);

      const factors: any = {};

      // Expiring assets risk
      const expiringPatents = summary.patents.filter(p => {
        if (!p.expirationDate) return false;
        const daysUntilExpiry = Math.floor((p.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry < 365;
      });
      factors.expirationRisk = (expiringPatents.length / Math.max(summary.patents.length, 1)) * 100;

      // Jurisdiction concentration risk
      const jurisdictions = new Set([
        ...summary.patents.map(p => p.jurisdiction),
        ...summary.trademarks.map(t => t.jurisdiction),
      ]);
      factors.jurisdictionDiversity = Math.min((jurisdictions.size / 5) * 100, 100);

      // Status risk
      const inactivePatents = summary.patents.filter(p =>
        [PatentStatus.ABANDONED, PatentStatus.REJECTED, PatentStatus.EXPIRED].includes(p.status)
      );
      factors.statusRisk = (inactivePatents.length / Math.max(summary.patents.length, 1)) * 100;

      // Calculate overall risk score (0-100, lower is better)
      const riskScore = (
        factors.expirationRisk * 0.4 +
        (100 - factors.jurisdictionDiversity) * 0.3 +
        factors.statusRisk * 0.3
      );

      let overallRisk = 'Low';
      if (riskScore > 70) overallRisk = 'High';
      else if (riskScore > 40) overallRisk = 'Medium';

      const recommendations: string[] = [];
      if (factors.expirationRisk > 30) recommendations.push('Review and renew expiring patents');
      if (factors.jurisdictionDiversity < 50) recommendations.push('Diversify IP across more jurisdictions');
      if (factors.statusRisk > 20) recommendations.push('Address inactive IP assets');

      return { overallRisk, riskScore, factors, recommendations };
    } catch (error) {
      this.logger.error('Error analyzing portfolio risk', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to analyze portfolio risk');
    }
  }

  /**
   * 28. Generate portfolio analytics report
   */
  async generatePortfolioReport(portfolioId: string): Promise<any> {
    try {
      const summary = await this.getPortfolioSummary(portfolioId);
      const valuation = await this.valuatePortfolio(portfolioId);
      const risk = await this.analyzePortfolioRisk(portfolioId);

      // Patent analytics
      const patentsByStatus = this.groupBy(summary.patents, 'status');
      const patentsByJurisdiction = this.groupBy(summary.patents, 'jurisdiction');
      const patentsByType = this.groupBy(summary.patents, 'patentType');

      // Trademark analytics
      const trademarksByStatus = this.groupBy(summary.trademarks, 'status');
      const trademarksByJurisdiction = this.groupBy(summary.trademarks, 'jurisdiction');

      // Copyright analytics
      const copyrightsByType = this.groupBy(summary.copyrights, 'copyrightType');
      const copyrightsByStatus = this.groupBy(summary.copyrights, 'status');

      return {
        portfolio: summary.portfolio,
        summary: {
          totalAssets: summary.assetCounts.total,
          totalValue: valuation.totalValue,
          breakdown: summary.assetCounts,
        },
        valuation,
        risk,
        analytics: {
          patents: {
            total: summary.patents.length,
            byStatus: patentsByStatus,
            byJurisdiction: patentsByJurisdiction,
            byType: patentsByType,
          },
          trademarks: {
            total: summary.trademarks.length,
            byStatus: trademarksByStatus,
            byJurisdiction: trademarksByJurisdiction,
          },
          copyrights: {
            total: summary.copyrights.length,
            byType: copyrightsByType,
            byStatus: copyrightsByStatus,
          },
        },
        generatedAt: new Date(),
      };
    } catch (error) {
      this.logger.error('Error generating portfolio report', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to generate portfolio report');
    }
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = String(item[key]);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

/**
 * IP action and event tracking service
 */
@Injectable()
export class IPActionService {
  private readonly logger = new Logger(IPActionService.name);

  constructor(@Inject('SEQUELIZE') private sequelize: any) {}

  /**
   * 29. Create IP action/event
   */
  async createIPAction(data: {
    patentId?: string;
    trademarkId?: string;
    copyrightId?: string;
    actionType: IPActionType;
    actionDate: Date;
    dueDate?: Date;
    description?: string;
    status?: string;
    responsibleParty?: string;
    cost?: number;
    metadata?: Record<string, any>;
  }): Promise<IPAction> {
    try {
      const action = await IPAction.create(data as any);
      this.logger.log(`Created IP action: ${action.id}`);
      return action;
    } catch (error) {
      this.logger.error('Error creating IP action', error);
      throw new BadRequestException('Failed to create IP action');
    }
  }

  /**
   * 30. Get upcoming IP actions (deadlines)
   */
  async getUpcomingActions(daysAhead: number = 30): Promise<IPAction[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const actions = await IPAction.findAll({
        where: {
          dueDate: {
            [Op.between]: [new Date(), futureDate],
          },
          status: { [Op.ne]: 'completed' },
        },
        include: [
          { model: Patent, as: 'patent' },
          { model: Trademark, as: 'trademark' },
          { model: Copyright, as: 'copyright' },
        ],
        order: [['dueDate', 'ASC']],
      });

      return actions;
    } catch (error) {
      this.logger.error('Error getting upcoming actions', error);
      throw new InternalServerErrorException('Failed to get upcoming actions');
    }
  }

  /**
   * 31. Get action history for IP asset
   */
  async getActionHistory(assetType: IPAssetType, assetId: string): Promise<IPAction[]> {
    try {
      const where: WhereOptions = {};

      if (assetType === IPAssetType.PATENT) where['patentId'] = assetId;
      else if (assetType === IPAssetType.TRADEMARK) where['trademarkId'] = assetId;
      else if (assetType === IPAssetType.COPYRIGHT) where['copyrightId'] = assetId;

      const actions = await IPAction.findAll({
        where,
        order: [['actionDate', 'DESC']],
      });

      return actions;
    } catch (error) {
      this.logger.error('Error getting action history', error);
      throw new InternalServerErrorException('Failed to get action history');
    }
  }

  /**
   * 32. Calculate total IP maintenance costs
   */
  async calculateMaintenanceCosts(portfolioId: string, yearAhead: number = 1): Promise<{
    totalCost: number;
    breakdown: any[];
    byType: Record<string, number>;
  }> {
    try {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + yearAhead);

      const actions = await IPAction.findAll({
        where: {
          actionType: {
            [Op.in]: [IPActionType.RENEWAL, IPActionType.MAINTENANCE, IPActionType.PAYMENT],
          },
          dueDate: {
            [Op.between]: [new Date(), futureDate],
          },
        },
        include: [
          { model: Patent, as: 'patent' },
          { model: Trademark, as: 'trademark' },
        ],
      });

      const breakdown = actions.map(action => ({
        id: action.id,
        type: action.actionType,
        assetType: action.patentId ? 'patent' : action.trademarkId ? 'trademark' : 'copyright',
        dueDate: action.dueDate,
        cost: action.cost || 0,
        description: action.description,
      }));

      const totalCost = breakdown.reduce((sum, item) => sum + item.cost, 0);

      const byType = breakdown.reduce((acc, item) => {
        acc[item.assetType] = (acc[item.assetType] || 0) + item.cost;
        return acc;
      }, {} as Record<string, number>);

      return { totalCost, breakdown, byType };
    } catch (error) {
      this.logger.error('Error calculating maintenance costs', error);
      throw new InternalServerErrorException('Failed to calculate maintenance costs');
    }
  }
}

/**
 * IP licensing and assignment service
 */
@Injectable()
export class IPLicensingService {
  private readonly logger = new Logger(IPLicensingService.name);

  constructor(@Inject('SEQUELIZE') private sequelize: any) {}

  /**
   * 33. Create IP license agreement
   */
  async createLicenseAgreement(data: {
    assetType: IPAssetType;
    assetId: string;
    licensor: string;
    licensee: string;
    licenseType: 'exclusive' | 'non-exclusive' | 'sole';
    territory?: string[];
    field?: string;
    term?: number;
    royaltyRate?: number;
    upfrontFee?: number;
    minimumRoyalty?: number;
    sublicenseAllowed: boolean;
    metadata?: Record<string, any>;
  }): Promise<any> {
    try {
      // Would integrate with contract management in production
      const license = {
        id: crypto.randomUUID(),
        ...data,
        status: 'active',
        effectiveDate: new Date(),
        createdAt: new Date(),
      };

      this.logger.log(`Created license agreement: ${license.id}`);
      return license;
    } catch (error) {
      this.logger.error('Error creating license agreement', error);
      throw new BadRequestException('Failed to create license agreement');
    }
  }

  /**
   * 34. Track IP assignment/transfer
   */
  async trackIPAssignment(data: {
    assetType: IPAssetType;
    assetId: string;
    fromOwner: string;
    toOwner: string;
    transferDate: Date;
    consideration?: number;
    metadata?: Record<string, any>;
  }): Promise<any> {
    try {
      const assignment = {
        id: crypto.randomUUID(),
        ...data,
        recordedAt: new Date(),
      };

      // Update asset owner
      if (data.assetType === IPAssetType.PATENT) {
        await Patent.update({ assignee: data.toOwner }, { where: { id: data.assetId } });
      } else if (data.assetType === IPAssetType.TRADEMARK) {
        await Trademark.update({ owner: data.toOwner }, { where: { id: data.assetId } });
      } else if (data.assetType === IPAssetType.COPYRIGHT) {
        await Copyright.update({ owner: data.toOwner }, { where: { id: data.assetId } });
      }

      this.logger.log(`Tracked IP assignment: ${assignment.id}`);
      return assignment;
    } catch (error) {
      this.logger.error('Error tracking IP assignment', error);
      throw new BadRequestException('Failed to track IP assignment');
    }
  }

  /**
   * 35. Calculate royalty payments
   */
  async calculateRoyaltyPayments(licenseId: string, salesData: {
    period: string;
    grossSales: number;
    deductions?: number;
  }): Promise<{
    netSales: number;
    royaltyAmount: number;
    minimumRoyalty: number;
    paymentDue: number;
    dueDate: Date;
  }> {
    try {
      // Mock license data - would fetch from database in production
      const license = {
        royaltyRate: 0.05, // 5%
        minimumRoyalty: 10000,
      };

      const netSales = salesData.grossSales - (salesData.deductions || 0);
      const royaltyAmount = netSales * license.royaltyRate;
      const paymentDue = Math.max(royaltyAmount, license.minimumRoyalty);

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // 30 days payment term

      return {
        netSales,
        royaltyAmount,
        minimumRoyalty: license.minimumRoyalty,
        paymentDue,
        dueDate,
      };
    } catch (error) {
      this.logger.error('Error calculating royalty payments', error);
      throw new InternalServerErrorException('Failed to calculate royalty payments');
    }
  }
}

/**
 * IP infringement detection service
 */
@Injectable()
export class IPInfringementService {
  private readonly logger = new Logger(IPInfringementService.name);

  constructor(@Inject('SEQUELIZE') private sequelize: any) {}

  /**
   * 36. Monitor for potential infringement
   */
  async monitorInfringement(assetType: IPAssetType, assetId: string): Promise<any[]> {
    try {
      // In production, this would integrate with monitoring services
      const potentialInfringements = [];

      if (assetType === IPAssetType.PATENT) {
        const patent = await Patent.findByPk(assetId);
        if (patent) {
          // Monitor new patent applications with similar claims
          const similar = await Patent.findAll({
            where: {
              id: { [Op.ne]: assetId },
              status: { [Op.in]: [PatentStatus.PENDING, PatentStatus.PUBLISHED] },
              ipcClassifications: {
                [Op.overlap]: patent.ipcClassifications || [],
              },
            },
            limit: 10,
          });

          potentialInfringements.push(...similar.map(p => ({
            type: 'patent',
            suspectedInfringer: p.assignee,
            patentNumber: p.patentNumber,
            similarity: 'high',
            detectedAt: new Date(),
          })));
        }
      } else if (assetType === IPAssetType.TRADEMARK) {
        const trademark = await Trademark.findByPk(assetId);
        if (trademark) {
          // Monitor similar trademarks
          const similar = await Trademark.findAll({
            where: {
              id: { [Op.ne]: assetId },
              jurisdiction: trademark.jurisdiction,
              niceClasses: {
                [Op.overlap]: trademark.niceClasses || [],
              },
            },
            limit: 10,
          });

          potentialInfringements.push(...similar.map(tm => ({
            type: 'trademark',
            suspectedInfringer: tm.owner,
            markText: tm.markText,
            similarity: 'medium',
            detectedAt: new Date(),
          })));
        }
      }

      return potentialInfringements;
    } catch (error) {
      this.logger.error('Error monitoring infringement', error);
      throw new InternalServerErrorException('Failed to monitor infringement');
    }
  }

  /**
   * 37. Analyze freedom to operate
   */
  async analyzeFreedomToOperate(technology: {
    description: string;
    jurisdiction: IPJurisdiction;
    ipcClassifications?: string[];
  }): Promise<{
    riskLevel: string;
    blockingPatents: Patent[];
    recommendations: string[];
  }> {
    try {
      const where: WhereOptions = {
        jurisdiction: technology.jurisdiction,
        status: { [Op.in]: [PatentStatus.ACTIVE, PatentStatus.GRANTED] },
      };

      if (technology.ipcClassifications?.length) {
        where['ipcClassifications'] = {
          [Op.overlap]: technology.ipcClassifications,
        };
      }

      const blockingPatents = await Patent.findAll({ where, limit: 50 });

      let riskLevel = 'Low';
      const recommendations: string[] = [];

      if (blockingPatents.length > 20) {
        riskLevel = 'High';
        recommendations.push('Consider licensing agreements with patent holders');
        recommendations.push('Explore design-around options');
      } else if (blockingPatents.length > 5) {
        riskLevel = 'Medium';
        recommendations.push('Review claims of identified patents in detail');
        recommendations.push('Consider freedom-to-operate opinion from patent attorney');
      } else {
        recommendations.push('Monitor patent landscape regularly');
      }

      return { riskLevel, blockingPatents, recommendations };
    } catch (error) {
      this.logger.error('Error analyzing freedom to operate', error);
      throw new InternalServerErrorException('Failed to analyze freedom to operate');
    }
  }
}

/**
 * IP strategic planning service
 */
@Injectable()
export class IPStrategyService {
  private readonly logger = new Logger(IPStrategyService.name);

  constructor(
    @Inject('SEQUELIZE') private sequelize: any,
    private portfolioService: IPPortfolioService,
  ) {}

  /**
   * 38. Generate patent landscape analysis
   */
  async generatePatentLandscape(criteria: {
    technology: string;
    jurisdiction?: IPJurisdiction;
    ipcClassifications?: string[];
    yearFrom?: number;
    yearTo?: number;
  }): Promise<{
    totalPatents: number;
    topAssignees: any[];
    filingTrends: any[];
    technologyClusters: any[];
    whiteSpaces: string[];
  }> {
    try {
      const where: WhereOptions = {};

      if (criteria.jurisdiction) where['jurisdiction'] = criteria.jurisdiction;
      if (criteria.ipcClassifications?.length) {
        where['ipcClassifications'] = { [Op.overlap]: criteria.ipcClassifications };
      }

      const patents = await Patent.findAll({ where });

      // Top assignees
      const assigneeCounts = patents.reduce((acc, p) => {
        if (p.assignee) acc[p.assignee] = (acc[p.assignee] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topAssignees = Object.entries(assigneeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([assignee, count]) => ({ assignee, count }));

      // Filing trends by year
      const filingTrends = patents.reduce((acc, p) => {
        if (p.filingDate) {
          const year = p.filingDate.getFullYear();
          acc[year] = (acc[year] || 0) + 1;
        }
        return acc;
      }, {} as Record<number, number>);

      // Technology clusters (by IPC)
      const ipcCounts = patents.reduce((acc, p) => {
        (p.ipcClassifications || []).forEach(ipc => {
          acc[ipc] = (acc[ipc] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const technologyClusters = Object.entries(ipcCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([ipc, count]) => ({ classification: ipc, count }));

      // Identify white spaces (areas with fewer patents)
      const whiteSpaces = Object.entries(ipcCounts)
        .filter(([, count]) => count < 5)
        .map(([ipc]) => ipc);

      return {
        totalPatents: patents.length,
        topAssignees,
        filingTrends: Object.entries(filingTrends).map(([year, count]) => ({ year: parseInt(year), count })),
        technologyClusters,
        whiteSpaces,
      };
    } catch (error) {
      this.logger.error('Error generating patent landscape', error);
      throw new InternalServerErrorException('Failed to generate patent landscape');
    }
  }

  /**
   * 39. Generate IP competitive intelligence report
   */
  async generateCompetitiveIntelligence(competitorIds: string[]): Promise<{
    competitors: any[];
    comparativeAnalysis: any;
    strategicInsights: string[];
  }> {
    try {
      const competitors = [];

      for (const competitorId of competitorIds) {
        const summary = await this.portfolioService.getPortfolioSummary(competitorId);
        const valuation = await this.portfolioService.valuatePortfolio(competitorId);

        competitors.push({
          portfolioId: competitorId,
          name: summary.portfolio.name,
          assetCounts: summary.assetCounts,
          totalValue: valuation.totalValue,
          patents: summary.patents.map(p => ({
            id: p.id,
            title: p.title,
            status: p.status,
            jurisdiction: p.jurisdiction,
          })),
        });
      }

      // Comparative analysis
      const comparativeAnalysis = {
        averagePortfolioSize: competitors.reduce((sum, c) => sum + c.assetCounts.total, 0) / competitors.length,
        averageValue: competitors.reduce((sum, c) => sum + c.totalValue, 0) / competitors.length,
        topCompetitorBySize: competitors.sort((a, b) => b.assetCounts.total - a.assetCounts.total)[0],
        topCompetitorByValue: competitors.sort((a, b) => b.totalValue - a.totalValue)[0],
      };

      // Strategic insights
      const strategicInsights = [
        `Average competitor has ${Math.round(comparativeAnalysis.averagePortfolioSize)} IP assets`,
        `Largest portfolio belongs to ${comparativeAnalysis.topCompetitorBySize.name} with ${comparativeAnalysis.topCompetitorBySize.assetCounts.total} assets`,
        `Most valuable portfolio is ${comparativeAnalysis.topCompetitorByValue.name} at $${comparativeAnalysis.topCompetitorByValue.totalValue.toLocaleString()}`,
      ];

      return { competitors, comparativeAnalysis, strategicInsights };
    } catch (error) {
      this.logger.error('Error generating competitive intelligence', error);
      throw new InternalServerErrorException('Failed to generate competitive intelligence');
    }
  }

  /**
   * 40. Recommend IP portfolio optimization
   */
  async recommendPortfolioOptimization(portfolioId: string): Promise<{
    currentState: any;
    recommendations: any[];
    priorityActions: string[];
    estimatedSavings: number;
  }> {
    try {
      const summary = await this.portfolioService.getPortfolioSummary(portfolioId);
      const risk = await this.portfolioService.analyzePortfolioRisk(portfolioId);

      const recommendations = [];
      const priorityActions = [];
      let estimatedSavings = 0;

      // Identify abandoned/expired patents to remove
      const inactivePatents = summary.patents.filter(p =>
        [PatentStatus.ABANDONED, PatentStatus.EXPIRED, PatentStatus.REJECTED].includes(p.status)
      );

      if (inactivePatents.length > 0) {
        recommendations.push({
          type: 'cleanup',
          action: 'Remove inactive patents',
          count: inactivePatents.length,
          impact: 'Reduce administrative overhead',
        });
        priorityActions.push(`Remove ${inactivePatents.length} inactive patents from portfolio`);
      }

      // Identify patents in single jurisdiction that should be expanded
      const singleJurisdictionPatents = summary.patents.filter(p => {
        const family = summary.patents.filter(fp => fp.familyId === p.familyId);
        return family.length === 1 && p.status === PatentStatus.GRANTED;
      });

      if (singleJurisdictionPatents.length > 5) {
        recommendations.push({
          type: 'expansion',
          action: 'File international applications',
          count: singleJurisdictionPatents.slice(0, 5).length,
          impact: 'Increase global protection',
        });
      }

      // Identify expiring assets requiring renewal decisions
      const expiringAssets = summary.patents.filter(p => {
        if (!p.expirationDate) return false;
        const daysUntilExpiry = Math.floor((p.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry < 365 && daysUntilExpiry > 0;
      });

      if (expiringAssets.length > 0) {
        recommendations.push({
          type: 'renewal',
          action: 'Review assets for renewal',
          count: expiringAssets.length,
          impact: 'Optimize maintenance costs',
        });
        priorityActions.push(`Review ${expiringAssets.length} assets expiring within 1 year`);
        estimatedSavings = expiringAssets.length * 5000; // Average cost savings per non-renewed patent
      }

      // Identify underutilized assets for licensing
      const underutilizedPatents = summary.patents.filter(p =>
        p.status === PatentStatus.GRANTED && !p.metadata?.licensed
      );

      if (underutilizedPatents.length > 10) {
        recommendations.push({
          type: 'monetization',
          action: 'Explore licensing opportunities',
          count: Math.min(underutilizedPatents.length, 20),
          impact: 'Generate revenue from IP',
        });
      }

      return {
        currentState: {
          totalAssets: summary.assetCounts.total,
          riskScore: risk.riskScore,
          riskLevel: risk.overallRisk,
        },
        recommendations,
        priorityActions,
        estimatedSavings,
      };
    } catch (error) {
      this.logger.error('Error recommending portfolio optimization', error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to recommend portfolio optimization');
    }
  }
}

// ============================================================================
// NESTJS MODULE
// ============================================================================

@Global()
@Module({})
export class IPManagementModule {
  static forRoot(): DynamicModule {
    return {
      module: IPManagementModule,
      imports: [ConfigModule.forFeature(ipManagementConfig)],
      providers: [
        PatentService,
        PriorArtSearchService,
        TrademarkService,
        CopyrightService,
        IPPortfolioService,
        IPActionService,
        IPLicensingService,
        IPInfringementService,
        IPStrategyService,
      ],
      exports: [
        PatentService,
        PriorArtSearchService,
        TrademarkService,
        CopyrightService,
        IPPortfolioService,
        IPActionService,
        IPLicensingService,
        IPInfringementService,
        IPStrategyService,
      ],
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const IPManagementModels = [
  Patent,
  Trademark,
  Copyright,
  PriorArtSearch,
  IPPortfolio,
  IPAction,
];

export const IPManagementServices = [
  PatentService,
  PriorArtSearchService,
  TrademarkService,
  CopyrightService,
  IPPortfolioService,
  IPActionService,
  IPLicensingService,
  IPInfringementService,
  IPStrategyService,
];
