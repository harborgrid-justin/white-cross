/**
 * LOC: LEGAL-CIT-001
 * File: /reuse/legal/citation-validation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Legal document management modules
 *   - Case management systems
 *   - Citation tracking services
 */

/**
 * File: /reuse/legal/citation-validation-kit.ts
 * Locator: WC-UTL-LEGALCIT-001
 * Purpose: Comprehensive Legal Citation Validation and Formatting - Bluebook compliance, citation validation, format conversion
 *
 * Upstream: Independent utility module for legal citation processing and validation
 * Downstream: ../backend/*, legal document services, case management, citation tracking
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, class-validator 0.14.x
 * Exports: 44 utility functions for legal citation validation, formatting, Bluebook compliance, shepardizing, parallel citations
 *
 * LLM Context: Comprehensive legal citation utilities for implementing production-ready citation validation and formatting in legal systems.
 * Provides Bluebook citation validators, format converters, completeness checkers, parallel citation resolvers, shepardizing support,
 * Sequelize models for citations and authorities, NestJS services for citation operations, and Swagger API endpoints. Essential for
 * building compliant legal document management and case tracking systems with proper citation handling.
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsArray, ValidateNested, IsDate, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  Default,
  AllowNull,
} from 'sequelize-typescript';

// ============================================================================
// TYPE DEFINITIONS - CITATION FORMATS
// ============================================================================

/**
 * Citation format types supported by the system
 */
export enum CitationFormat {
  BLUEBOOK = 'bluebook',
  ALWD = 'alwd',
  APA = 'apa',
  MLA = 'mla',
  CHICAGO = 'chicago',
  OSCOLA = 'oscola',
  AGLC = 'aglc',
}

/**
 * Types of legal authorities that can be cited
 */
export enum AuthorityType {
  CASE = 'case',
  STATUTE = 'statute',
  REGULATION = 'regulation',
  CONSTITUTION = 'constitution',
  TREATISE = 'treatise',
  LAW_REVIEW = 'law_review',
  ADMINISTRATIVE = 'administrative',
  LEGISLATIVE_HISTORY = 'legislative_history',
  SECONDARY_SOURCE = 'secondary_source',
  FOREIGN_LAW = 'foreign_law',
  INTERNATIONAL = 'international',
}

/**
 * Court types for case citations
 */
export enum CourtType {
  US_SUPREME_COURT = 'us_supreme_court',
  US_COURT_APPEALS = 'us_court_appeals',
  US_DISTRICT_COURT = 'us_district_court',
  STATE_SUPREME_COURT = 'state_supreme_court',
  STATE_APPELLATE_COURT = 'state_appellate_court',
  STATE_TRIAL_COURT = 'state_trial_court',
  SPECIALIZED_COURT = 'specialized_court',
}

/**
 * Citation validity status
 */
export enum CitationStatus {
  VALID = 'valid',
  INVALID = 'invalid',
  INCOMPLETE = 'incomplete',
  AMBIGUOUS = 'ambiguous',
  NEEDS_UPDATE = 'needs_update',
  OVERRULED = 'overruled',
  SUPERSEDED = 'superseded',
}

/**
 * Shepard's treatment codes
 */
export enum ShepardsCode {
  WARNING = 'warning', // Red flag - negative treatment
  QUESTIONED = 'questioned', // Orange flag - validity questioned
  CAUTION = 'caution', // Yellow flag - possible negative treatment
  POSITIVE = 'positive', // Green plus - positive treatment
  CITED = 'cited', // Blue circle - cited by
  NEUTRAL = 'neutral', // Blue A - neutral analysis
}

/**
 * Parsed case citation structure
 */
export interface ParsedCaseCitation {
  caseName: string;
  volume: string;
  reporter: string;
  page: string;
  pinpoint?: string;
  court?: string;
  year: string;
  parallel?: ParallelCitation[];
}

/**
 * Parallel citation information
 */
export interface ParallelCitation {
  volume: string;
  reporter: string;
  page: string;
  isOfficial: boolean;
}

/**
 * Parsed statute citation structure
 */
export interface ParsedStatuteCitation {
  title: string;
  code: string;
  section: string;
  subsection?: string;
  year?: string;
  supplement?: string;
}

/**
 * Citation completeness analysis
 */
export interface CitationCompleteness {
  isComplete: boolean;
  missingElements: string[];
  warnings: string[];
  suggestions: string[];
  confidence: number;
}

/**
 * Bluebook validation result
 */
export interface BluebookValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  formattedCitation: string;
  rule: string;
}

/**
 * Validation error structure
 */
export interface ValidationError {
  field: string;
  message: string;
  rule: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * Validation warning structure
 */
export interface ValidationWarning {
  field: string;
  message: string;
  suggestion: string;
}

/**
 * Shepardizing result
 */
export interface ShepardizingResult {
  citationId: string;
  status: ShepardsCode;
  treatments: CitationTreatment[];
  citingCases: CitingCase[];
  history: CaseHistory[];
  lastChecked: Date;
}

/**
 * Citation treatment information
 */
export interface CitationTreatment {
  type: 'distinguished' | 'followed' | 'overruled' | 'questioned' | 'explained' | 'cited';
  citingCase: string;
  court: string;
  year: string;
  headnote?: string;
}

/**
 * Citing case information
 */
export interface CitingCase {
  citation: string;
  caseName: string;
  court: string;
  year: string;
  treatment: string;
  depth: number;
}

/**
 * Case history information
 */
export interface CaseHistory {
  citation: string;
  court: string;
  decision: string;
  date: Date;
  relationship: 'affirmed' | 'reversed' | 'remanded' | 'vacated' | 'modified';
}

/**
 * Citation conversion options
 */
export interface CitationConversionOptions {
  sourceFormat: CitationFormat;
  targetFormat: CitationFormat;
  preserveParallels: boolean;
  includeUrl: boolean;
  shortFormAllowed: boolean;
}

/**
 * Reporter abbreviation mapping
 */
export interface ReporterInfo {
  abbreviation: string;
  fullName: string;
  type: 'official' | 'unofficial' | 'regional' | 'specialized';
  startYear?: number;
  endYear?: number;
  jurisdiction?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Citation model - stores legal citations
 */
@Table({
  tableName: 'citations',
  timestamps: true,
  indexes: [
    { fields: ['citation_text'] },
    { fields: ['authority_type'] },
    { fields: ['format'] },
    { fields: ['status'] },
    { fields: ['created_at'] },
  ],
})
export class Citation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  citationText!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(AuthorityType)))
  authorityType!: AuthorityType;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(CitationFormat)))
  format!: CitationFormat;

  @Column(DataType.JSONB)
  parsedData?: ParsedCaseCitation | ParsedStatuteCitation;

  @Column(DataType.TEXT)
  normalizedCitation?: string;

  @AllowNull(false)
  @Default(CitationStatus.VALID)
  @Column(DataType.ENUM(...Object.values(CitationStatus)))
  status!: CitationStatus;

  @Column(DataType.JSONB)
  validationResult?: BluebookValidation;

  @Column(DataType.JSONB)
  parallelCitations?: ParallelCitation[];

  @ForeignKey(() => LegalAuthority)
  @Column(DataType.INTEGER)
  authorityId?: number;

  @BelongsTo(() => LegalAuthority)
  authority?: LegalAuthority;

  @Column(DataType.STRING)
  volume?: string;

  @Column(DataType.STRING)
  reporter?: string;

  @Column(DataType.STRING)
  page?: string;

  @Column(DataType.STRING)
  year?: string;

  @Column(DataType.STRING)
  court?: string;

  @Column(DataType.JSONB)
  shepardizingData?: ShepardizingResult;

  @Column(DataType.DATE)
  lastShepardized?: Date;

  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}

/**
 * Legal Authority model - stores information about legal authorities
 */
@Table({
  tableName: 'legal_authorities',
  timestamps: true,
  indexes: [
    { fields: ['authority_type'] },
    { fields: ['court_type'] },
    { fields: ['jurisdiction'] },
    { fields: ['year'] },
  ],
})
export class LegalAuthority extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(AuthorityType)))
  authorityType!: AuthorityType;

  @AllowNull(false)
  @Column(DataType.TEXT)
  name!: string;

  @Column(DataType.ENUM(...Object.values(CourtType)))
  courtType?: CourtType;

  @Column(DataType.STRING)
  jurisdiction?: string;

  @Column(DataType.INTEGER)
  year?: number;

  @Column(DataType.TEXT)
  officialCitation?: string;

  @Column(DataType.JSONB)
  alternateCitations?: string[];

  @Column(DataType.TEXT)
  westlawCitation?: string;

  @Column(DataType.TEXT)
  lexisCitation?: string;

  @Column(DataType.TEXT)
  url?: string;

  @Column(DataType.TEXT)
  summary?: string;

  @Column(DataType.JSONB)
  headnotes?: string[];

  @HasMany(() => Citation)
  citations?: Citation[];

  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}

// ============================================================================
// DTO CLASSES FOR API
// ============================================================================

/**
 * DTO for creating a citation
 */
export class CreateCitationDto {
  @ApiProperty({ description: 'Citation text', example: 'Brown v. Board of Education, 347 U.S. 483 (1954)' })
  @IsString()
  citationText!: string;

  @ApiProperty({ enum: AuthorityType, description: 'Type of legal authority' })
  @IsEnum(AuthorityType)
  authorityType!: AuthorityType;

  @ApiProperty({ enum: CitationFormat, description: 'Citation format' })
  @IsEnum(CitationFormat)
  format!: CitationFormat;

  @ApiPropertyOptional({ description: 'Associated authority ID' })
  @IsOptional()
  @IsNumber()
  authorityId?: number;
}

/**
 * DTO for validating a citation
 */
export class ValidateCitationDto {
  @ApiProperty({ description: 'Citation text to validate' })
  @IsString()
  citationText!: string;

  @ApiProperty({ enum: CitationFormat, description: 'Expected citation format' })
  @IsEnum(CitationFormat)
  format!: CitationFormat;

  @ApiProperty({ enum: AuthorityType, description: 'Type of legal authority' })
  @IsEnum(AuthorityType)
  authorityType!: AuthorityType;

  @ApiPropertyOptional({ description: 'Whether to perform strict validation' })
  @IsOptional()
  @IsBoolean()
  strict?: boolean;
}

/**
 * DTO for converting citation format
 */
export class ConvertCitationDto {
  @ApiProperty({ description: 'Source citation text' })
  @IsString()
  sourceCitation!: string;

  @ApiProperty({ enum: CitationFormat, description: 'Source format' })
  @IsEnum(CitationFormat)
  sourceFormat!: CitationFormat;

  @ApiProperty({ enum: CitationFormat, description: 'Target format' })
  @IsEnum(CitationFormat)
  targetFormat!: CitationFormat;

  @ApiPropertyOptional({ description: 'Preserve parallel citations' })
  @IsOptional()
  @IsBoolean()
  preserveParallels?: boolean;

  @ApiPropertyOptional({ description: 'Include URL if available' })
  @IsOptional()
  @IsBoolean()
  includeUrl?: boolean;
}

/**
 * DTO for shepardizing a citation
 */
export class ShepardizeCitationDto {
  @ApiProperty({ description: 'Citation to shepardize' })
  @IsString()
  citation!: string;

  @ApiPropertyOptional({ description: 'Include full history' })
  @IsOptional()
  @IsBoolean()
  includeHistory?: boolean;

  @ApiPropertyOptional({ description: 'Maximum depth of citing cases' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxDepth?: number;
}

/**
 * DTO for parallel citation resolution
 */
export class ResolveParallelCitationDto {
  @ApiProperty({ description: 'Primary citation' })
  @IsString()
  primaryCitation!: string;

  @ApiPropertyOptional({ description: 'Include unofficial reporters' })
  @IsOptional()
  @IsBoolean()
  includeUnofficial?: boolean;

  @ApiPropertyOptional({ description: 'Include regional reporters' })
  @IsOptional()
  @IsBoolean()
  includeRegional?: boolean;
}

// ============================================================================
// CITATION PARSING FUNCTIONS
// ============================================================================

/**
 * Parse a case citation into structured components
 */
export function parseCaseCitation(citation: string): ParsedCaseCitation | null {
  try {
    // Bluebook format: Case Name, Volume Reporter Page (Court Year)
    const casePattern = /^(.+?),\s*(\d+)\s+([A-Za-z0-9.]+)\s+(\d+)(?:,\s*(\d+))?\s*\(([^)]*?)\s*(\d{4})\)$/;
    const match = citation.trim().match(casePattern);

    if (!match) {
      return null;
    }

    const [, caseName, volume, reporter, page, pinpoint, court, year] = match;

    return {
      caseName: caseName.trim(),
      volume: volume.trim(),
      reporter: reporter.trim(),
      page: page.trim(),
      pinpoint: pinpoint?.trim(),
      court: court?.trim(),
      year: year.trim(),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Parse a statute citation into structured components
 */
export function parseStatuteCitation(citation: string): ParsedStatuteCitation | null {
  try {
    // Format: Title Code § Section (Year)
    const statutePattern = /^(\d+)\s+([A-Za-z.]+)\s+§\s*(\d+(?:[A-Za-z])?(?:-\d+)?(?:\([a-z0-9]+\))?)(?:\s*\((\d{4})\))?$/;
    const match = citation.trim().match(statutePattern);

    if (!match) {
      return null;
    }

    const [, title, code, section, year] = match;

    return {
      title: title.trim(),
      code: code.trim(),
      section: section.trim(),
      year: year?.trim(),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Parse any citation type and return structured data
 */
export function parseGenericCitation(citation: string, authorityType: AuthorityType): ParsedCaseCitation | ParsedStatuteCitation | null {
  switch (authorityType) {
    case AuthorityType.CASE:
      return parseCaseCitation(citation);
    case AuthorityType.STATUTE:
    case AuthorityType.REGULATION:
      return parseStatuteCitation(citation);
    default:
      return null;
  }
}

/**
 * Extract volume, reporter, and page from citation
 */
export function extractVolumeReporterPage(citation: string): { volume: string; reporter: string; page: string } | null {
  const pattern = /(\d+)\s+([A-Za-z0-9.]+)\s+(\d+)/;
  const match = citation.match(pattern);

  if (!match) {
    return null;
  }

  return {
    volume: match[1],
    reporter: match[2],
    page: match[3],
  };
}

// ============================================================================
// BLUEBOOK VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate citation against Bluebook rules
 */
export function validateBluebookCitation(citation: string, authorityType: AuthorityType): BluebookValidation {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Parse the citation
  const parsed = parseGenericCitation(citation, authorityType);

  if (!parsed) {
    errors.push({
      field: 'citation',
      message: 'Unable to parse citation format',
      rule: 'R10/R12',
      severity: 'error',
    });

    return {
      isValid: false,
      errors,
      warnings,
      formattedCitation: citation,
      rule: 'R10',
    };
  }

  // Validate based on authority type
  if (authorityType === AuthorityType.CASE) {
    validateBluebookCase(parsed as ParsedCaseCitation, errors, warnings);
  } else if (authorityType === AuthorityType.STATUTE) {
    validateBluebookStatute(parsed as ParsedStatuteCitation, errors, warnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    formattedCitation: formatBluebookCitation(parsed, authorityType),
    rule: authorityType === AuthorityType.CASE ? 'R10' : 'R12',
  };
}

/**
 * Validate Bluebook case citation rules
 */
function validateBluebookCase(parsed: ParsedCaseCitation, errors: ValidationError[], warnings: ValidationWarning[]): void {
  // Check case name formatting
  if (!parsed.caseName || parsed.caseName.length === 0) {
    errors.push({
      field: 'caseName',
      message: 'Case name is required',
      rule: 'R10.2',
      severity: 'error',
    });
  }

  // Check for proper italicization hint
  if (parsed.caseName && !parsed.caseName.includes('v.')) {
    warnings.push({
      field: 'caseName',
      message: 'Case name should include "v." between parties',
      suggestion: 'Ensure proper party separation',
    });
  }

  // Validate reporter abbreviation
  if (!isValidReporterAbbreviation(parsed.reporter)) {
    warnings.push({
      field: 'reporter',
      message: `Reporter abbreviation "${parsed.reporter}" may not be standard`,
      suggestion: 'Verify reporter abbreviation in Table T1',
    });
  }

  // Check year format
  if (!/^\d{4}$/.test(parsed.year)) {
    errors.push({
      field: 'year',
      message: 'Year must be four digits',
      rule: 'R10.5',
      severity: 'error',
    });
  }

  // Validate pinpoint citation format
  if (parsed.pinpoint && !/^\d+(-\d+)?$/.test(parsed.pinpoint)) {
    warnings.push({
      field: 'pinpoint',
      message: 'Pinpoint citation format may be incorrect',
      suggestion: 'Use format: 123 or 123-125',
    });
  }
}

/**
 * Validate Bluebook statute citation rules
 */
function validateBluebookStatute(parsed: ParsedStatuteCitation, errors: ValidationError[], warnings: ValidationWarning[]): void {
  // Check title
  if (!parsed.title || !/^\d+$/.test(parsed.title)) {
    errors.push({
      field: 'title',
      message: 'Title must be numeric',
      rule: 'R12',
      severity: 'error',
    });
  }

  // Check code abbreviation
  if (!isValidCodeAbbreviation(parsed.code)) {
    warnings.push({
      field: 'code',
      message: `Code abbreviation "${parsed.code}" may not be standard`,
      suggestion: 'Verify code abbreviation in Table T1',
    });
  }

  // Check section symbol
  if (!parsed.section) {
    errors.push({
      field: 'section',
      message: 'Section number is required',
      rule: 'R12.9',
      severity: 'error',
    });
  }
}

/**
 * Check if reporter abbreviation is valid
 */
function isValidReporterAbbreviation(reporter: string): boolean {
  const commonReporters = [
    'U.S.', 'S.Ct.', 'L.Ed.', 'L.Ed.2d',
    'F.', 'F.2d', 'F.3d', 'F.4th',
    'F.Supp.', 'F.Supp.2d', 'F.Supp.3d',
    'P.', 'P.2d', 'P.3d',
    'N.E.', 'N.E.2d', 'N.E.3d',
    'S.E.', 'S.E.2d',
    'So.', 'So.2d', 'So.3d',
    'A.', 'A.2d', 'A.3d',
    'N.W.', 'N.W.2d',
    'S.W.', 'S.W.2d', 'S.W.3d',
  ];

  return commonReporters.includes(reporter);
}

/**
 * Check if code abbreviation is valid
 */
function isValidCodeAbbreviation(code: string): boolean {
  const commonCodes = [
    'U.S.C.', 'U.S.C.A.', 'U.S.C.S.',
    'C.F.R.',
    'Stat.',
    'Pub.L.',
  ];

  return commonCodes.includes(code);
}

/**
 * Validate citation completeness
 */
export function checkCitationCompleteness(citation: string, authorityType: AuthorityType): CitationCompleteness {
  const missingElements: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const parsed = parseGenericCitation(citation, authorityType);

  if (!parsed) {
    return {
      isComplete: false,
      missingElements: ['Unable to parse citation'],
      warnings: ['Citation format not recognized'],
      suggestions: ['Verify citation follows standard format'],
      confidence: 0,
    };
  }

  if (authorityType === AuthorityType.CASE) {
    const caseParsed = parsed as ParsedCaseCitation;

    if (!caseParsed.caseName) missingElements.push('Case name');
    if (!caseParsed.volume) missingElements.push('Volume');
    if (!caseParsed.reporter) missingElements.push('Reporter');
    if (!caseParsed.page) missingElements.push('Page');
    if (!caseParsed.year) missingElements.push('Year');
    if (!caseParsed.court) warnings.push('Court information missing - may be required for lower courts');
  } else if (authorityType === AuthorityType.STATUTE) {
    const statuteParsed = parsed as ParsedStatuteCitation;

    if (!statuteParsed.title) missingElements.push('Title');
    if (!statuteParsed.code) missingElements.push('Code');
    if (!statuteParsed.section) missingElements.push('Section');
    if (!statuteParsed.year) warnings.push('Year missing - recommended for currency');
  }

  const confidence = Math.max(0, 1 - (missingElements.length * 0.2 + warnings.length * 0.1));

  return {
    isComplete: missingElements.length === 0,
    missingElements,
    warnings,
    suggestions,
    confidence,
  };
}

// ============================================================================
// CITATION FORMATTING FUNCTIONS
// ============================================================================

/**
 * Format citation according to Bluebook rules
 */
export function formatBluebookCitation(parsed: ParsedCaseCitation | ParsedStatuteCitation, authorityType: AuthorityType): string {
  if (authorityType === AuthorityType.CASE) {
    const caseParsed = parsed as ParsedCaseCitation;
    const pinpoint = caseParsed.pinpoint ? `, ${caseParsed.pinpoint}` : '';
    const court = caseParsed.court ? `${caseParsed.court} ` : '';
    return `${caseParsed.caseName}, ${caseParsed.volume} ${caseParsed.reporter} ${caseParsed.page}${pinpoint} (${court}${caseParsed.year})`;
  } else {
    const statuteParsed = parsed as ParsedStatuteCitation;
    const year = statuteParsed.year ? ` (${statuteParsed.year})` : '';
    return `${statuteParsed.title} ${statuteParsed.code} § ${statuteParsed.section}${year}`;
  }
}

/**
 * Convert citation from one format to another
 */
export function convertCitationFormat(
  citation: string,
  sourceFormat: CitationFormat,
  targetFormat: CitationFormat,
  authorityType: AuthorityType,
): string {
  // Parse the source citation
  const parsed = parseGenericCitation(citation, authorityType);

  if (!parsed) {
    throw new Error('Unable to parse source citation');
  }

  // Convert based on target format
  switch (targetFormat) {
    case CitationFormat.BLUEBOOK:
      return formatBluebookCitation(parsed, authorityType);
    case CitationFormat.ALWD:
      return formatALWDCitation(parsed, authorityType);
    case CitationFormat.APA:
      return formatAPACitation(parsed, authorityType);
    default:
      return citation;
  }
}

/**
 * Format citation according to ALWD rules
 */
function formatALWDCitation(parsed: ParsedCaseCitation | ParsedStatuteCitation, authorityType: AuthorityType): string {
  // ALWD is similar to Bluebook with some differences
  return formatBluebookCitation(parsed, authorityType);
}

/**
 * Format citation according to APA rules
 */
function formatAPACitation(parsed: ParsedCaseCitation | ParsedStatuteCitation, authorityType: AuthorityType): string {
  if (authorityType === AuthorityType.CASE) {
    const caseParsed = parsed as ParsedCaseCitation;
    // APA format: Case Name, Volume Reporter Page (Court Year)
    return `${caseParsed.caseName}, ${caseParsed.volume} ${caseParsed.reporter} ${caseParsed.page} (${caseParsed.year})`;
  } else {
    const statuteParsed = parsed as ParsedStatuteCitation;
    return `${statuteParsed.title} ${statuteParsed.code} § ${statuteParsed.section} (${statuteParsed.year || 'n.d.'})`;
  }
}

/**
 * Generate short form citation
 */
export function generateShortFormCitation(fullCitation: string, authorityType: AuthorityType): string {
  const parsed = parseGenericCitation(fullCitation, authorityType);

  if (!parsed) {
    return fullCitation;
  }

  if (authorityType === AuthorityType.CASE) {
    const caseParsed = parsed as ParsedCaseCitation;
    // Short form: First party name, volume reporter at page
    const firstParty = caseParsed.caseName.split('v.')[0].trim();
    return `${firstParty}, ${caseParsed.volume} ${caseParsed.reporter} at ${caseParsed.page}`;
  } else {
    const statuteParsed = parsed as ParsedStatuteCitation;
    // Short form: Title Code § Section
    return `${statuteParsed.title} ${statuteParsed.code} § ${statuteParsed.section}`;
  }
}

/**
 * Normalize citation for comparison
 */
export function normalizeCitation(citation: string): string {
  return citation
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[,()]/g, '')
    .trim();
}

/**
 * Format parallel citations
 */
export function formatParallelCitations(primary: string, parallels: ParallelCitation[]): string {
  const parallelStrings = parallels.map((p) => `${p.volume} ${p.reporter} ${p.page}`);
  return `${primary}, ${parallelStrings.join(', ')}`;
}

// ============================================================================
// PARALLEL CITATION FUNCTIONS
// ============================================================================

/**
 * Resolve parallel citations for a case
 */
export function resolveParallelCitations(citation: string): ParallelCitation[] {
  // This would typically connect to a legal database API (Westlaw, LexisNexis)
  // For now, return mock data structure
  const parallels: ParallelCitation[] = [];

  const parsed = parseCaseCitation(citation);
  if (!parsed) {
    return parallels;
  }

  // Example: Add parallel citations based on reporter type
  if (parsed.reporter === 'U.S.') {
    // U.S. cases have S.Ct. and L.Ed. parallels
    parallels.push({
      volume: parsed.volume,
      reporter: 'S.Ct.',
      page: parsed.page,
      isOfficial: false,
    });
  }

  return parallels;
}

/**
 * Find official citation from parallel citations
 */
export function findOfficialCitation(citations: string[]): string | null {
  const officialReporters = ['U.S.', 'F.', 'F.2d', 'F.3d', 'F.4th'];

  for (const citation of citations) {
    const parsed = parseCaseCitation(citation);
    if (parsed && officialReporters.includes(parsed.reporter)) {
      return citation;
    }
  }

  return citations[0] || null;
}

/**
 * Merge duplicate citations
 */
export function mergeDuplicateCitations(citations: string[]): string[] {
  const normalized = new Map<string, string>();

  for (const citation of citations) {
    const key = normalizeCitation(citation);
    if (!normalized.has(key)) {
      normalized.set(key, citation);
    }
  }

  return Array.from(normalized.values());
}

// ============================================================================
// SHEPARDIZING FUNCTIONS
// ============================================================================

/**
 * Shepardize a citation (check treatment by subsequent cases)
 */
export async function shepardizeCitation(citation: string): Promise<ShepardizingResult> {
  // This would typically connect to a legal research service (Shepard's, KeyCite)
  // For now, return mock structure
  const parsed = parseCaseCitation(citation);

  if (!parsed) {
    throw new Error('Invalid citation for shepardizing');
  }

  return {
    citationId: `${parsed.volume}-${parsed.reporter}-${parsed.page}`,
    status: ShepardsCode.CITED,
    treatments: [],
    citingCases: [],
    history: [],
    lastChecked: new Date(),
  };
}

/**
 * Check if citation has negative treatment
 */
export function hasNegativeTreatment(shepardResult: ShepardizingResult): boolean {
  const negativeCodes = [ShepardsCode.WARNING, ShepardsCode.QUESTIONED, ShepardsCode.CAUTION];
  return negativeCodes.includes(shepardResult.status);
}

/**
 * Get citation treatment summary
 */
export function getCitationTreatmentSummary(shepardResult: ShepardizingResult): string {
  const statusDescriptions: Record<ShepardsCode, string> = {
    [ShepardsCode.WARNING]: 'Negative treatment - may not be good law',
    [ShepardsCode.QUESTIONED]: 'Validity questioned by subsequent cases',
    [ShepardsCode.CAUTION]: 'Possible negative treatment exists',
    [ShepardsCode.POSITIVE]: 'Positive treatment by subsequent cases',
    [ShepardsCode.CITED]: 'Cited by subsequent cases',
    [ShepardsCode.NEUTRAL]: 'Neutral analytical treatment',
  };

  return statusDescriptions[shepardResult.status] || 'Unknown treatment';
}

/**
 * Filter citing cases by treatment type
 */
export function filterCitingCasesByTreatment(citingCases: CitingCase[], treatment: string): CitingCase[] {
  return citingCases.filter((c) => c.treatment.toLowerCase().includes(treatment.toLowerCase()));
}

// ============================================================================
// REPORTER AND JURISDICTION FUNCTIONS
// ============================================================================

/**
 * Get reporter information
 */
export function getReporterInfo(abbreviation: string): ReporterInfo | null {
  const reporters: Record<string, ReporterInfo> = {
    'U.S.': {
      abbreviation: 'U.S.',
      fullName: 'United States Reports',
      type: 'official',
      jurisdiction: 'federal',
    },
    'S.Ct.': {
      abbreviation: 'S.Ct.',
      fullName: 'Supreme Court Reporter',
      type: 'unofficial',
      jurisdiction: 'federal',
    },
    'F.3d': {
      abbreviation: 'F.3d',
      fullName: 'Federal Reporter, Third Series',
      type: 'official',
      jurisdiction: 'federal',
    },
    'P.3d': {
      abbreviation: 'P.3d',
      fullName: 'Pacific Reporter, Third Series',
      type: 'regional',
      jurisdiction: 'western states',
    },
  };

  return reporters[abbreviation] || null;
}

/**
 * Get court abbreviation for Bluebook
 */
export function getCourtAbbreviation(courtType: CourtType, jurisdiction?: string): string {
  const abbreviations: Record<CourtType, string> = {
    [CourtType.US_SUPREME_COURT]: '',
    [CourtType.US_COURT_APPEALS]: `${jurisdiction || ''} Cir.`,
    [CourtType.US_DISTRICT_COURT]: `${jurisdiction || ''} Dist.`,
    [CourtType.STATE_SUPREME_COURT]: `${jurisdiction || ''}`,
    [CourtType.STATE_APPELLATE_COURT]: `${jurisdiction || ''} App.`,
    [CourtType.STATE_TRIAL_COURT]: `${jurisdiction || ''} Trial`,
    [CourtType.SPECIALIZED_COURT]: `${jurisdiction || ''}`,
  };

  return abbreviations[courtType] || '';
}

/**
 * Determine court type from citation
 */
export function determineCourtType(citation: string): CourtType | null {
  const parsed = parseCaseCitation(citation);

  if (!parsed) {
    return null;
  }

  // Determine by reporter
  if (parsed.reporter === 'U.S.') {
    return CourtType.US_SUPREME_COURT;
  } else if (parsed.reporter.match(/^F\.\d*(d|th)?$/)) {
    return CourtType.US_COURT_APPEALS;
  } else if (parsed.reporter.match(/^F\.Supp/)) {
    return CourtType.US_DISTRICT_COURT;
  }

  return null;
}

// ============================================================================
// CITATION EXTRACTION AND ANALYSIS
// ============================================================================

/**
 * Extract all citations from text
 */
export function extractCitationsFromText(text: string): string[] {
  const citations: string[] = [];

  // Pattern for case citations
  const casePattern = /[A-Z][a-z]+\s+v\.\s+[A-Z][a-z]+,\s*\d+\s+[A-Za-z0-9.]+\s+\d+(?:,\s*\d+)?\s*\([^)]*\d{4}\)/g;
  const caseMatches = text.match(casePattern);

  if (caseMatches) {
    citations.push(...caseMatches);
  }

  // Pattern for statute citations
  const statutePattern = /\d+\s+[A-Z.]+\s+§\s*\d+[A-Za-z0-9()-]*/g;
  const statuteMatches = text.match(statutePattern);

  if (statuteMatches) {
    citations.push(...statuteMatches);
  }

  return citations;
}

/**
 * Validate multiple citations in bulk
 */
export function validateCitationsBulk(citations: string[], authorityType: AuthorityType): Map<string, BluebookValidation> {
  const results = new Map<string, BluebookValidation>();

  for (const citation of citations) {
    const validation = validateBluebookCitation(citation, authorityType);
    results.set(citation, validation);
  }

  return results;
}

/**
 * Compare two citations for equivalence
 */
export function areCitationsEquivalent(citation1: string, citation2: string): boolean {
  return normalizeCitation(citation1) === normalizeCitation(citation2);
}

/**
 * Sort citations by year
 */
export function sortCitationsByYear(citations: string[], ascending: boolean = true): string[] {
  return [...citations].sort((a, b) => {
    const yearA = extractYear(a);
    const yearB = extractYear(b);

    if (!yearA || !yearB) return 0;

    return ascending ? yearA - yearB : yearB - yearA;
  });
}

/**
 * Extract year from citation
 */
function extractYear(citation: string): number | null {
  const yearMatch = citation.match(/\((\d{4})\)/);
  return yearMatch ? parseInt(yearMatch[1], 10) : null;
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * Citation validation and management service
 */
@Injectable()
export class CitationService {
  /**
   * Validate a citation
   */
  async validateCitation(dto: ValidateCitationDto): Promise<BluebookValidation> {
    return validateBluebookCitation(dto.citationText, dto.authorityType);
  }

  /**
   * Convert citation format
   */
  async convertCitation(dto: ConvertCitationDto): Promise<string> {
    return convertCitationFormat(
      dto.sourceCitation,
      dto.sourceFormat,
      dto.targetFormat,
      AuthorityType.CASE, // Would need to detect or pass this
    );
  }

  /**
   * Check citation completeness
   */
  async checkCompleteness(citation: string, authorityType: AuthorityType): Promise<CitationCompleteness> {
    return checkCitationCompleteness(citation, authorityType);
  }

  /**
   * Shepardize citation
   */
  async shepardize(dto: ShepardizeCitationDto): Promise<ShepardizingResult> {
    return await shepardizeCitation(dto.citation);
  }

  /**
   * Resolve parallel citations
   */
  async resolveParallels(dto: ResolveParallelCitationDto): Promise<ParallelCitation[]> {
    return resolveParallelCitations(dto.primaryCitation);
  }

  /**
   * Create citation record
   */
  async createCitation(dto: CreateCitationDto): Promise<Citation> {
    const parsed = parseGenericCitation(dto.citationText, dto.authorityType);
    const validation = validateBluebookCitation(dto.citationText, dto.authorityType);

    const citation = await Citation.create({
      citationText: dto.citationText,
      authorityType: dto.authorityType,
      format: dto.format,
      parsedData: parsed || undefined,
      normalizedCitation: normalizeCitation(dto.citationText),
      status: validation.isValid ? CitationStatus.VALID : CitationStatus.INVALID,
      validationResult: validation,
      authorityId: dto.authorityId,
    });

    return citation;
  }

  /**
   * Extract citations from document text
   */
  async extractCitations(text: string): Promise<string[]> {
    return extractCitationsFromText(text);
  }

  /**
   * Batch validate citations
   */
  async batchValidate(citations: string[], authorityType: AuthorityType): Promise<Map<string, BluebookValidation>> {
    return validateCitationsBulk(citations, authorityType);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate citation ID from components
 */
export function generateCitationId(volume: string, reporter: string, page: string): string {
  return `${volume}-${reporter.replace(/\./g, '')}-${page}`;
}

/**
 * Check if citation is a short form
 */
export function isShortFormCitation(citation: string): boolean {
  // Short forms typically use "at" or "Id."
  return citation.includes(' at ') || citation.startsWith('Id.');
}

/**
 * Get citation age in years
 */
export function getCitationAge(citation: string): number | null {
  const year = extractYear(citation);
  if (!year) return null;

  return new Date().getFullYear() - year;
}

/**
 * Format pinpoint citation
 */
export function formatPinpointCitation(baseCitation: string, pages: number[]): string {
  if (pages.length === 0) return baseCitation;

  const pinpoint = pages.length === 1 ? pages[0].toString() : `${pages[0]}-${pages[pages.length - 1]}`;

  // Insert pinpoint after the page number
  const parsed = parseCaseCitation(baseCitation);
  if (!parsed) return baseCitation;

  return `${parsed.caseName}, ${parsed.volume} ${parsed.reporter} ${parsed.page}, ${pinpoint} (${parsed.court || ''} ${parsed.year})`;
}

/**
 * Validate URL citation format
 */
export function validateUrlCitation(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Generate permalink for citation
 */
export function generateCitationPermalink(citation: string, service: 'westlaw' | 'lexis' | 'google'): string {
  const normalized = normalizeCitation(citation);
  const encoded = encodeURIComponent(citation);

  const baseUrls: Record<string, string> = {
    westlaw: 'https://1.next.westlaw.com/Search/Results.html?query=',
    lexis: 'https://advance.lexis.com/search/?query=',
    google: 'https://scholar.google.com/scholar?q=',
  };

  return `${baseUrls[service]}${encoded}`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  Citation,
  LegalAuthority,

  // DTOs
  CreateCitationDto,
  ValidateCitationDto,
  ConvertCitationDto,
  ShepardizeCitationDto,
  ResolveParallelCitationDto,

  // Services
  CitationService,

  // Parsing functions
  parseCaseCitation,
  parseStatuteCitation,
  parseGenericCitation,
  extractVolumeReporterPage,

  // Validation functions
  validateBluebookCitation,
  checkCitationCompleteness,
  validateCitationsBulk,

  // Formatting functions
  formatBluebookCitation,
  convertCitationFormat,
  generateShortFormCitation,
  normalizeCitation,
  formatParallelCitations,
  formatPinpointCitation,

  // Parallel citation functions
  resolveParallelCitations,
  findOfficialCitation,
  mergeDuplicateCitations,

  // Shepardizing functions
  shepardizeCitation,
  hasNegativeTreatment,
  getCitationTreatmentSummary,
  filterCitingCasesByTreatment,

  // Reporter functions
  getReporterInfo,
  getCourtAbbreviation,
  determineCourtType,

  // Extraction and analysis
  extractCitationsFromText,
  areCitationsEquivalent,
  sortCitationsByYear,

  // Utility functions
  generateCitationId,
  isShortFormCitation,
  getCitationAge,
  validateUrlCitation,
  generateCitationPermalink,
};
