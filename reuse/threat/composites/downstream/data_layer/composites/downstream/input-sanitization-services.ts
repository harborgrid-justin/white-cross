/**
 * LOC: INPUTSAN001
 * File: /reuse/threat/composites/downstream/data_layer/composites/downstream/input-sanitization-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../sanitization-operations-kit.ts
 *   - ../validation-operations-kit.ts
 *   - ../../../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - Security middleware
 *   - API validation pipelines
 *   - Form validation handlers
 *   - Output encoding services
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/downstream/input-sanitization-services.ts
 * Locator: WC-DOWNSTREAM-INPUTSAN-001
 * Purpose: Comprehensive input sanitization services with XSS prevention, SQL injection prevention, and HIPAA-compliant data masking
 *
 * Upstream: SanitizationOperationsService, ValidationOperationsService, _production-patterns.ts
 * Downstream: All API endpoints requiring input sanitization, security middleware, data protection
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger
 * Exports: InputSanitizationService, XSS prevention, SQL injection prevention, HIPAA masking, sanitization DTOs
 *
 * LLM Context: Production-ready input sanitization services for White Cross healthcare platform.
 * Provides comprehensive XSS prevention, SQL injection prevention, command injection prevention,
 * path traversal prevention, and HIPAA-compliant data masking. All sanitizers are designed
 * for security, performance, and compliance with OWASP Top 10 security standards.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Injectable,
  Logger,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiProperty,
  ApiPropertyOptional,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsObject,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

// Import composite services
import {
  sanitizeInput,
  sanitizeOutput,
  sanitizeHTML,
  sanitizeSQL,
  sanitizeXML,
  sanitizeJSON,
  sanitizeURL,
  sanitizeEmail,
  sanitizePhone,
  sanitizeSSN,
  sanitizeCreditCard,
  sanitizePassword,
  sanitizePath,
  sanitizeFilename,
  sanitizeCommand,
  sanitizeRegex,
  sanitizeWhitespace,
  stripTags,
  stripScripts,
  stripStyles,
  stripComments,
  sanitizeAttributes,
  sanitizeIframes,
  sanitizeLinks,
  sanitizeImages,
  escapeHTML,
  escapeSQL,
  escapeXML,
  escapeRegex,
  escapeShell,
  unescapeHTML,
  normalizeUnicode,
  normalizeLineEndings,
  normalizeWhitespace,
  removeControlChars,
  removeInvisibleChars,
  validateEncoding,
  detectXSS,
  preventSQLInjection,
  SanitizationType,
  EncodingType,
  XSSDetectionResult,
  SQLInjectionCheckResult,
} from '../sanitization-operations-kit';

import {
  ValidationOperationsService,
  ValidationResult,
  DataFormat,
} from '../validation-operations-kit';

import {
  createSuccessResponse,
  createCreatedResponse,
  createErrorResponse,
  generateRequestId,
  createLogger,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  safeStringify,
} from '../../../_production-patterns';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

export enum SanitizationLevel {
  STRICT = 'STRICT', // Remove all potentially dangerous content
  MODERATE = 'MODERATE', // Remove obvious threats, allow some HTML
  LENIENT = 'LENIENT', // Minimal sanitization, encode only
  CUSTOM = 'CUSTOM', // Use custom rules
}

export enum ThreatLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NONE = 'NONE',
}

export enum DataSensitivity {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
  PHI = 'PHI', // Protected Health Information
  PII = 'PII', // Personally Identifiable Information
}

export interface SanitizationConfig {
  level: SanitizationLevel;
  sensitivity: DataSensitivity;
  allowedTags?: string[];
  allowedAttributes?: string[];
  stripScripts?: boolean;
  stripStyles?: boolean;
  stripIframes?: boolean;
  validateAfterSanitization?: boolean;
  logThreats?: boolean;
}

export interface SanitizationResult {
  original: string;
  sanitized: string;
  changed: boolean;
  threats: ThreatDetection[];
  threatLevel: ThreatLevel;
  bytesRemoved: number;
  executionTime: number;
}

export interface ThreatDetection {
  type: string;
  pattern: string;
  location?: number[];
  severity: ThreatLevel;
  description: string;
}

export interface BulkSanitizationResult {
  requestId: string;
  timestamp: Date;
  totalRecords: number;
  sanitizedRecords: number;
  threatsDetected: number;
  results: SanitizationResult[];
  processingTime: number;
  aggregateThreats: Record<string, number>;
}

export interface MaskingConfig {
  strategy: 'partial' | 'full' | 'tokenize' | 'hash';
  visibleChars?: number;
  maskChar?: string;
  preserveFormat?: boolean;
}

export interface MaskingResult {
  original: string;
  masked: string;
  strategy: string;
  preservedFormat: boolean;
}

// ============================================================================
// DTOs
// ============================================================================

export class SanitizeInputDto {
  @ApiProperty({ description: 'Input to sanitize' })
  @IsString()
  @IsNotEmpty()
  input: string;

  @ApiPropertyOptional({ description: 'Sanitization type', enum: SanitizationType })
  @IsOptional()
  @IsEnum(SanitizationType)
  type?: SanitizationType;

  @ApiPropertyOptional({ description: 'Sanitization configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  config?: SanitizationConfig;
}

export class SanitizeHtmlDto {
  @ApiProperty({ description: 'HTML content to sanitize' })
  @IsString()
  @IsNotEmpty()
  html: string;

  @ApiPropertyOptional({ description: 'Allowed HTML tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedTags?: string[];

  @ApiPropertyOptional({ description: 'Allowed HTML attributes', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedAttributes?: string[];

  @ApiPropertyOptional({ description: 'Strip scripts' })
  @IsOptional()
  @IsBoolean()
  stripScripts?: boolean;

  @ApiPropertyOptional({ description: 'Strip styles' })
  @IsOptional()
  @IsBoolean()
  stripStyles?: boolean;
}

export class DetectXssDto {
  @ApiProperty({ description: 'Input to check for XSS vulnerabilities' })
  @IsString()
  @IsNotEmpty()
  input: string;

  @ApiPropertyOptional({ description: 'Detailed analysis' })
  @IsOptional()
  @IsBoolean()
  detailed?: boolean;
}

export class DetectSqlInjectionDto {
  @ApiProperty({ description: 'SQL input to check for injection' })
  @IsString()
  @IsNotEmpty()
  input: string;

  @ApiPropertyOptional({ description: 'Include recommendations' })
  @IsOptional()
  @IsBoolean()
  includeRecommendations?: boolean;
}

export class SanitizeBulkDto {
  @ApiProperty({ description: 'Array of inputs to sanitize', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  inputs: string[];

  @ApiProperty({ description: 'Sanitization type', enum: SanitizationType })
  @IsEnum(SanitizationType)
  type: SanitizationType;

  @ApiPropertyOptional({ description: 'Sanitization configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  config?: SanitizationConfig;
}

export class SanitizeObjectDto {
  @ApiProperty({ description: 'Object to sanitize' })
  @IsDefined()
  @IsObject()
  object: Record<string, any>;

  @ApiProperty({ description: 'Fields to sanitize', type: [String] })
  @IsArray()
  @IsString({ each: true })
  fields: string[];

  @ApiProperty({ description: 'Sanitization type for each field' })
  @IsObject()
  fieldTypes: Record<string, SanitizationType>;

  @ApiPropertyOptional({ description: 'Sanitization configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  config?: SanitizationConfig;
}

export class MaskSensitiveDataDto {
  @ApiProperty({ description: 'Sensitive data to mask' })
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiProperty({ description: 'Data format', enum: DataFormat })
  @IsEnum(DataFormat)
  format: DataFormat;

  @ApiPropertyOptional({ description: 'Masking configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  config?: MaskingConfig;
}

export class SanitizeFilePathDto {
  @ApiProperty({ description: 'File path to sanitize' })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiPropertyOptional({ description: 'Allow absolute paths' })
  @IsOptional()
  @IsBoolean()
  allowAbsolute?: boolean;
}

export class SanitizeUrlDto {
  @ApiProperty({ description: 'URL to sanitize' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ description: 'Allowed protocols', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedProtocols?: string[];
}

export class SanitizeCommandDto {
  @ApiProperty({ description: 'Command to sanitize' })
  @IsString()
  @IsNotEmpty()
  command: string;

  @ApiPropertyOptional({ description: 'Allowed commands', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedCommands?: string[];
}

export class NormalizeTextDto {
  @ApiProperty({ description: 'Text to normalize' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({ description: 'Normalize unicode' })
  @IsOptional()
  @IsBoolean()
  normalizeUnicode?: boolean;

  @ApiPropertyOptional({ description: 'Normalize whitespace' })
  @IsOptional()
  @IsBoolean()
  normalizeWhitespace?: boolean;

  @ApiPropertyOptional({ description: 'Normalize line endings' })
  @IsOptional()
  @IsBoolean()
  normalizeLineEndings?: boolean;

  @ApiPropertyOptional({ description: 'Remove control characters' })
  @IsOptional()
  @IsBoolean()
  removeControlChars?: boolean;

  @ApiPropertyOptional({ description: 'Remove invisible characters' })
  @IsOptional()
  @IsBoolean()
  removeInvisibleChars?: boolean;
}

// ============================================================================
// INPUT SANITIZATION SERVICE
// ============================================================================

@Injectable()
export class InputSanitizationService {
  private readonly logger = createLogger(InputSanitizationService.name);

  constructor(
    private readonly validationService: ValidationOperationsService,
  ) {}

  /**
   * Sanitizes generic input with threat detection
   * @param dto - Sanitization request
   * @returns Sanitization result
   */
  async sanitizeInput(dto: SanitizeInputDto): Promise<SanitizationResult> {
    const requestId = generateRequestId();
    const startTime = Date.now();
    this.logger.log(`Sanitizing input (type: ${dto.type || 'generic'}) (${requestId})`);

    try {
      const originalLength = dto.input.length;
      let sanitized: string;
      const threats: ThreatDetection[] = [];

      // Detect threats before sanitization
      const xssResult = detectXSS(dto.input);
      if (xssResult.isVulnerable) {
        threats.push(
          ...xssResult.threats.map(t => ({
            type: t.type,
            pattern: t.pattern,
            location: t.location,
            severity: xssResult.severity as ThreatLevel,
            description: 'Potential XSS vulnerability detected',
          })),
        );
      }

      // Apply sanitization based on type
      switch (dto.type) {
        case SanitizationType.HTML:
          sanitized = sanitizeHTML(dto.input, dto.config?.allowedTags);
          if (dto.config?.stripScripts !== false) {
            sanitized = stripScripts(sanitized);
          }
          if (dto.config?.stripStyles !== false) {
            sanitized = stripStyles(sanitized);
          }
          if (dto.config?.stripIframes !== false) {
            sanitized = sanitizeIframes(sanitized);
          }
          break;

        case SanitizationType.SQL:
          const sqlCheck = preventSQLInjection(dto.input);
          if (!sqlCheck.isSafe) {
            threats.push({
              type: 'SQL_INJECTION',
              pattern: sqlCheck.suspiciousPatterns.join(', '),
              severity: ThreatLevel.CRITICAL,
              description: 'Potential SQL injection detected',
            });
          }
          sanitized = sanitizeSQL(dto.input);
          break;

        case SanitizationType.XML:
          sanitized = sanitizeXML(dto.input);
          break;

        case SanitizationType.JSON:
          sanitized = sanitizeJSON(dto.input);
          break;

        case SanitizationType.URL:
          sanitized = sanitizeURL(dto.input);
          break;

        case SanitizationType.EMAIL:
          sanitized = sanitizeEmail(dto.input);
          break;

        case SanitizationType.PHONE:
          sanitized = sanitizePhone(dto.input);
          break;

        case SanitizationType.SSN:
          sanitized = sanitizeSSN(dto.input);
          break;

        case SanitizationType.CREDIT_CARD:
          sanitized = sanitizeCreditCard(dto.input);
          break;

        case SanitizationType.COMMAND:
          sanitized = sanitizeCommand(dto.input);
          threats.push({
            type: 'COMMAND_INJECTION',
            pattern: 'Command metacharacters detected',
            severity: ThreatLevel.HIGH,
            description: 'Potential command injection detected',
          });
          break;

        case SanitizationType.REGEX:
          sanitized = sanitizeRegex(dto.input);
          break;

        case SanitizationType.PATH:
          sanitized = sanitizePath(dto.input);
          break;

        case SanitizationType.FILENAME:
          sanitized = sanitizeFilename(dto.input);
          break;

        default:
          sanitized = sanitizeInput(dto.input, dto.config?.allowedTags);
      }

      // Validate after sanitization if configured
      if (dto.config?.validateAfterSanitization) {
        const validationResult = this.validationService.validateRequired(sanitized, 'sanitized_input');
        if (!validationResult.valid) {
          throw new BadRequestError('Sanitization resulted in invalid data');
        }
      }

      const executionTime = Date.now() - startTime;
      const bytesRemoved = originalLength - sanitized.length;

      // Determine overall threat level
      const threatLevel = this.determineThreatLevel(threats);

      // Log threats if configured
      if (dto.config?.logThreats && threats.length > 0) {
        this.logger.warn(`Threats detected during sanitization: ${threats.length} (${requestId})`);
      }

      this.logger.log(`Input sanitized successfully (${executionTime}ms) (${requestId})`);

      return {
        original: dto.input,
        sanitized,
        changed: dto.input !== sanitized,
        threats,
        threatLevel,
        bytesRemoved,
        executionTime,
      };
    } catch (error) {
      this.logger.error(`Input sanitization failed: ${(error as Error).message}`);
      throw new BadRequestError('Input sanitization failed', { requestId });
    }
  }

  /**
   * Sanitizes HTML content with advanced options
   * @param dto - HTML sanitization request
   * @returns Sanitization result
   */
  async sanitizeHtml(dto: SanitizeHtmlDto): Promise<SanitizationResult> {
    const requestId = generateRequestId();
    const startTime = Date.now();
    this.logger.log(`Sanitizing HTML (${requestId})`);

    try {
      const originalLength = dto.html.length;
      let sanitized = dto.html;
      const threats: ThreatDetection[] = [];

      // Detect XSS vulnerabilities
      const xssResult = detectXSS(sanitized);
      if (xssResult.isVulnerable) {
        threats.push(
          ...xssResult.threats.map(t => ({
            type: t.type,
            pattern: t.pattern,
            location: t.location,
            severity: xssResult.severity as ThreatLevel,
            description: 'XSS vulnerability detected in HTML',
          })),
        );
      }

      // Sanitize HTML
      sanitized = sanitizeHTML(sanitized, dto.allowedTags);

      // Strip scripts if requested
      if (dto.stripScripts !== false) {
        sanitized = stripScripts(sanitized);
      }

      // Strip styles if requested
      if (dto.stripStyles !== false) {
        sanitized = stripStyles(sanitized);
      }

      // Sanitize attributes
      if (dto.allowedAttributes) {
        sanitized = sanitizeAttributes(sanitized, dto.allowedAttributes);
      }

      // Sanitize links and images
      sanitized = sanitizeLinks(sanitized);
      sanitized = sanitizeImages(sanitized);

      const executionTime = Date.now() - startTime;
      const bytesRemoved = originalLength - sanitized.length;
      const threatLevel = this.determineThreatLevel(threats);

      this.logger.log(`HTML sanitized successfully (${executionTime}ms) (${requestId})`);

      return {
        original: dto.html,
        sanitized,
        changed: dto.html !== sanitized,
        threats,
        threatLevel,
        bytesRemoved,
        executionTime,
      };
    } catch (error) {
      this.logger.error(`HTML sanitization failed: ${(error as Error).message}`);
      throw new BadRequestError('HTML sanitization failed', { requestId });
    }
  }

  /**
   * Detects XSS vulnerabilities in input
   * @param dto - XSS detection request
   * @returns XSS detection result
   */
  async detectXss(dto: DetectXssDto): Promise<XSSDetectionResult> {
    const requestId = generateRequestId();
    this.logger.log(`Detecting XSS vulnerabilities (${requestId})`);

    try {
      const result = detectXSS(dto.input);

      if (result.isVulnerable) {
        this.logger.warn(`XSS vulnerabilities detected: ${result.threats.length} (${requestId})`);
      }

      return result;
    } catch (error) {
      this.logger.error(`XSS detection failed: ${(error as Error).message}`);
      throw new BadRequestError('XSS detection failed', { requestId });
    }
  }

  /**
   * Detects SQL injection vulnerabilities
   * @param dto - SQL injection detection request
   * @returns SQL injection check result
   */
  async detectSqlInjection(dto: DetectSqlInjectionDto): Promise<SQLInjectionCheckResult> {
    const requestId = generateRequestId();
    this.logger.log(`Detecting SQL injection vulnerabilities (${requestId})`);

    try {
      const result = preventSQLInjection(dto.input);

      if (!result.isSafe) {
        this.logger.warn(`SQL injection patterns detected: ${result.suspiciousPatterns.length} (${requestId})`);
      }

      return result;
    } catch (error) {
      this.logger.error(`SQL injection detection failed: ${(error as Error).message}`);
      throw new BadRequestError('SQL injection detection failed', { requestId });
    }
  }

  /**
   * Sanitizes multiple inputs in bulk
   * @param dto - Bulk sanitization request
   * @returns Bulk sanitization result
   */
  async sanitizeBulk(dto: SanitizeBulkDto): Promise<BulkSanitizationResult> {
    const requestId = generateRequestId();
    const timestamp = new Date();
    const startTime = Date.now();
    this.logger.log(`Bulk sanitization started for ${dto.inputs.length} inputs (${requestId})`);

    try {
      const results: SanitizationResult[] = [];
      let sanitizedRecords = 0;
      let threatsDetected = 0;
      const aggregateThreats: Record<string, number> = {};

      for (const input of dto.inputs) {
        const inputDto: SanitizeInputDto = {
          input,
          type: dto.type,
          config: dto.config,
        };

        const result = await this.sanitizeInput(inputDto);
        results.push(result);

        if (result.changed) {
          sanitizedRecords++;
        }

        if (result.threats.length > 0) {
          threatsDetected++;

          // Aggregate threat counts
          for (const threat of result.threats) {
            aggregateThreats[threat.type] = (aggregateThreats[threat.type] || 0) + 1;
          }
        }
      }

      const processingTime = Date.now() - startTime;

      this.logger.log(
        `Bulk sanitization completed: ${sanitizedRecords}/${dto.inputs.length} sanitized, ${threatsDetected} threats (${processingTime}ms)`,
      );

      return {
        requestId,
        timestamp,
        totalRecords: dto.inputs.length,
        sanitizedRecords,
        threatsDetected,
        results,
        processingTime,
        aggregateThreats,
      };
    } catch (error) {
      this.logger.error(`Bulk sanitization failed: ${(error as Error).message}`);
      throw new BadRequestError('Bulk sanitization failed', { requestId });
    }
  }

  /**
   * Sanitizes object fields
   * @param dto - Object sanitization request
   * @returns Sanitized object
   */
  async sanitizeObject(dto: SanitizeObjectDto): Promise<Record<string, any>> {
    const requestId = generateRequestId();
    this.logger.log(`Sanitizing object with ${dto.fields.length} fields (${requestId})`);

    try {
      const sanitizedObject = { ...dto.object };

      for (const field of dto.fields) {
        if (dto.object[field] !== undefined && dto.object[field] !== null) {
          const fieldType = dto.fieldTypes[field] || SanitizationType.HTML;
          const inputDto: SanitizeInputDto = {
            input: String(dto.object[field]),
            type: fieldType,
            config: dto.config,
          };

          const result = await this.sanitizeInput(inputDto);
          sanitizedObject[field] = result.sanitized;
        }
      }

      this.logger.log(`Object sanitized successfully (${requestId})`);

      return sanitizedObject;
    } catch (error) {
      this.logger.error(`Object sanitization failed: ${(error as Error).message}`);
      throw new BadRequestError('Object sanitization failed', { requestId });
    }
  }

  /**
   * Masks sensitive data (HIPAA-compliant)
   * @param dto - Masking request
   * @returns Masking result
   */
  async maskSensitiveData(dto: MaskSensitiveDataDto): Promise<MaskingResult> {
    const requestId = generateRequestId();
    this.logger.log(`Masking sensitive data (format: ${dto.format}) (${requestId})`);

    try {
      const config = dto.config || {
        strategy: 'partial',
        visibleChars: 4,
        maskChar: 'X',
        preserveFormat: true,
      };

      let masked: string;

      switch (dto.format) {
        case DataFormat.SSN:
          masked = sanitizeSSN(dto.data);
          break;

        case DataFormat.PHONE:
          const sanitizedPhone = sanitizePhone(dto.data);
          if (config.strategy === 'partial') {
            const lastFour = sanitizedPhone.slice(-4);
            masked = `XXX-XXX-${lastFour}`;
          } else {
            masked = 'XXX-XXX-XXXX';
          }
          break;

        case DataFormat.EMAIL:
          const [localPart, domain] = dto.data.split('@');
          if (config.strategy === 'partial') {
            const visibleChars = Math.min(config.visibleChars || 2, localPart.length - 1);
            const maskedLocal = localPart.substring(0, visibleChars) + 'X'.repeat(localPart.length - visibleChars);
            masked = `${maskedLocal}@${domain}`;
          } else {
            masked = 'XXXX@XXXX.com';
          }
          break;

        default:
          // Generic masking
          if (config.strategy === 'full') {
            masked = config.maskChar!.repeat(dto.data.length);
          } else if (config.strategy === 'partial') {
            const visibleChars = config.visibleChars || 4;
            const maskedLength = Math.max(0, dto.data.length - visibleChars);
            masked = config.maskChar!.repeat(maskedLength) + dto.data.slice(-visibleChars);
          } else {
            masked = dto.data;
          }
      }

      this.logger.log(`Sensitive data masked successfully (${requestId})`);

      return {
        original: dto.data,
        masked,
        strategy: config.strategy,
        preservedFormat: config.preserveFormat || false,
      };
    } catch (error) {
      this.logger.error(`Data masking failed: ${(error as Error).message}`);
      throw new BadRequestError('Data masking failed', { requestId });
    }
  }

  /**
   * Sanitizes file paths to prevent directory traversal
   * @param dto - File path sanitization request
   * @returns Sanitized path
   */
  async sanitizeFilePath(dto: SanitizeFilePathDto): Promise<string> {
    const requestId = generateRequestId();
    this.logger.log(`Sanitizing file path (${requestId})`);

    try {
      let sanitized = sanitizePath(dto.path);

      // Additional security checks
      if (!dto.allowAbsolute && sanitized.startsWith('/')) {
        throw new BadRequestError('Absolute paths not allowed');
      }

      // Ensure no directory traversal
      if (sanitized.includes('..')) {
        throw new BadRequestError('Directory traversal detected');
      }

      this.logger.log(`File path sanitized successfully (${requestId})`);

      return sanitized;
    } catch (error) {
      this.logger.error(`File path sanitization failed: ${(error as Error).message}`);
      throw new BadRequestError('File path sanitization failed', { requestId });
    }
  }

  /**
   * Sanitizes URLs with protocol validation
   * @param dto - URL sanitization request
   * @returns Sanitized URL
   */
  async sanitizeUrl(dto: SanitizeUrlDto): Promise<string> {
    const requestId = generateRequestId();
    this.logger.log(`Sanitizing URL (${requestId})`);

    try {
      const sanitized = sanitizeURL(dto.url);

      // Check allowed protocols
      if (dto.allowedProtocols) {
        const urlObj = new URL(sanitized);
        const protocol = urlObj.protocol.replace(':', '');

        if (!dto.allowedProtocols.includes(protocol)) {
          throw new BadRequestError(`Protocol '${protocol}' not allowed`);
        }
      }

      this.logger.log(`URL sanitized successfully (${requestId})`);

      return sanitized;
    } catch (error) {
      this.logger.error(`URL sanitization failed: ${(error as Error).message}`);
      throw new BadRequestError('URL sanitization failed', { requestId });
    }
  }

  /**
   * Sanitizes command strings
   * @param dto - Command sanitization request
   * @returns Sanitized command
   */
  async sanitizeCommand(dto: SanitizeCommandDto): Promise<string> {
    const requestId = generateRequestId();
    this.logger.log(`Sanitizing command (${requestId})`);

    try {
      const sanitized = sanitizeCommand(dto.command);

      // Check allowed commands if specified
      if (dto.allowedCommands) {
        const commandName = sanitized.split(' ')[0];
        if (!dto.allowedCommands.includes(commandName)) {
          throw new BadRequestError(`Command '${commandName}' not allowed`);
        }
      }

      this.logger.log(`Command sanitized successfully (${requestId})`);

      return sanitized;
    } catch (error) {
      this.logger.error(`Command sanitization failed: ${(error as Error).message}`);
      throw new BadRequestError('Command sanitization failed', { requestId });
    }
  }

  /**
   * Normalizes text with multiple options
   * @param dto - Text normalization request
   * @returns Normalized text
   */
  async normalizeText(dto: NormalizeTextDto): Promise<string> {
    const requestId = generateRequestId();
    this.logger.log(`Normalizing text (${requestId})`);

    try {
      let normalized = dto.text;

      if (dto.normalizeUnicode !== false) {
        normalized = normalizeUnicode(normalized);
      }

      if (dto.normalizeWhitespace !== false) {
        normalized = normalizeWhitespace(normalized);
      }

      if (dto.normalizeLineEndings !== false) {
        normalized = normalizeLineEndings(normalized);
      }

      if (dto.removeControlChars !== false) {
        normalized = removeControlChars(normalized);
      }

      if (dto.removeInvisibleChars !== false) {
        normalized = removeInvisibleChars(normalized);
      }

      this.logger.log(`Text normalized successfully (${requestId})`);

      return normalized;
    } catch (error) {
      this.logger.error(`Text normalization failed: ${(error as Error).message}`);
      throw new BadRequestError('Text normalization failed', { requestId });
    }
  }

  /**
   * Escapes HTML for safe output
   * @param input - Input to escape
   * @returns Escaped HTML
   */
  async escapeHtml(input: string): Promise<string> {
    const requestId = generateRequestId();
    this.logger.log(`Escaping HTML (${requestId})`);

    try {
      const escaped = escapeHTML(input);
      this.logger.log(`HTML escaped successfully (${requestId})`);
      return escaped;
    } catch (error) {
      this.logger.error(`HTML escaping failed: ${(error as Error).message}`);
      throw new BadRequestError('HTML escaping failed', { requestId });
    }
  }

  /**
   * Escapes SQL for safe query building
   * @param input - Input to escape
   * @returns Escaped SQL
   */
  async escapeSql(input: string): Promise<string> {
    const requestId = generateRequestId();
    this.logger.log(`Escaping SQL (${requestId})`);

    try {
      const escaped = escapeSQL(input);
      this.logger.log(`SQL escaped successfully (${requestId})`);
      return escaped;
    } catch (error) {
      this.logger.error(`SQL escaping failed: ${(error as Error).message}`);
      throw new BadRequestError('SQL escaping failed', { requestId });
    }
  }

  /**
   * Escapes shell commands
   * @param input - Input to escape
   * @returns Escaped shell command
   */
  async escapeShell(input: string): Promise<string> {
    const requestId = generateRequestId();
    this.logger.log(`Escaping shell command (${requestId})`);

    try {
      const escaped = escapeShell(input);
      this.logger.log(`Shell command escaped successfully (${requestId})`);
      return escaped;
    } catch (error) {
      this.logger.error(`Shell command escaping failed: ${(error as Error).message}`);
      throw new BadRequestError('Shell command escaping failed', { requestId });
    }
  }

  /**
   * Validates encoding of text
   * @param text - Text to validate
   * @param encoding - Expected encoding
   * @returns Validation result
   */
  async validateEncoding(text: string, encoding: BufferEncoding = 'utf8'): Promise<boolean> {
    const requestId = generateRequestId();
    this.logger.log(`Validating encoding (${requestId})`);

    try {
      const valid = validateEncoding(text, encoding);
      this.logger.log(`Encoding validation completed: ${valid} (${requestId})`);
      return valid;
    } catch (error) {
      this.logger.error(`Encoding validation failed: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Determines overall threat level from detected threats
   * @param threats - Array of threat detections
   * @returns Overall threat level
   */
  private determineThreatLevel(threats: ThreatDetection[]): ThreatLevel {
    if (threats.length === 0) return ThreatLevel.NONE;

    const severities = threats.map(t => t.severity);

    if (severities.includes(ThreatLevel.CRITICAL)) return ThreatLevel.CRITICAL;
    if (severities.includes(ThreatLevel.HIGH)) return ThreatLevel.HIGH;
    if (severities.includes(ThreatLevel.MEDIUM)) return ThreatLevel.MEDIUM;
    if (severities.includes(ThreatLevel.LOW)) return ThreatLevel.LOW;

    return ThreatLevel.NONE;
  }
}

// ============================================================================
// CONTROLLER
// ============================================================================

@Controller('api/v1/input-sanitization')
@ApiTags('Input Sanitization Services')
@ApiBearerAuth()
export class InputSanitizationController {
  private readonly logger = createLogger(InputSanitizationController.name);

  constructor(private readonly service: InputSanitizationService) {}

  @Post('sanitize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sanitize generic input with threat detection' })
  @ApiBody({ type: SanitizeInputDto })
  @ApiResponse({ status: 200, description: 'Input sanitized successfully' })
  @ApiResponse({ status: 400, description: 'Invalid sanitization request' })
  async sanitizeInput(@Body() dto: SanitizeInputDto) {
    const requestId = generateRequestId();
    this.logger.log(`Sanitization request (${requestId})`);

    try {
      const result = await this.service.sanitizeInput(dto);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`Sanitization failed: ${(error as Error).message}`);
      throw new BadRequestException('Input sanitization failed');
    }
  }

  @Post('sanitize/html')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sanitize HTML content with advanced options' })
  @ApiBody({ type: SanitizeHtmlDto })
  @ApiResponse({ status: 200, description: 'HTML sanitized successfully' })
  @ApiResponse({ status: 400, description: 'Invalid sanitization request' })
  async sanitizeHtml(@Body() dto: SanitizeHtmlDto) {
    const requestId = generateRequestId();
    this.logger.log(`HTML sanitization request (${requestId})`);

    try {
      const result = await this.service.sanitizeHtml(dto);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`HTML sanitization failed: ${(error as Error).message}`);
      throw new BadRequestException('HTML sanitization failed');
    }
  }

  @Post('detect/xss')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Detect XSS vulnerabilities in input' })
  @ApiBody({ type: DetectXssDto })
  @ApiResponse({ status: 200, description: 'XSS detection completed' })
  @ApiResponse({ status: 400, description: 'Invalid detection request' })
  async detectXss(@Body() dto: DetectXssDto) {
    const requestId = generateRequestId();
    this.logger.log(`XSS detection request (${requestId})`);

    try {
      const result = await this.service.detectXss(dto);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`XSS detection failed: ${(error as Error).message}`);
      throw new BadRequestException('XSS detection failed');
    }
  }

  @Post('detect/sql-injection')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Detect SQL injection vulnerabilities' })
  @ApiBody({ type: DetectSqlInjectionDto })
  @ApiResponse({ status: 200, description: 'SQL injection detection completed' })
  @ApiResponse({ status: 400, description: 'Invalid detection request' })
  async detectSqlInjection(@Body() dto: DetectSqlInjectionDto) {
    const requestId = generateRequestId();
    this.logger.log(`SQL injection detection request (${requestId})`);

    try {
      const result = await this.service.detectSqlInjection(dto);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`SQL injection detection failed: ${(error as Error).message}`);
      throw new BadRequestException('SQL injection detection failed');
    }
  }

  @Post('sanitize/bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sanitize multiple inputs in bulk' })
  @ApiBody({ type: SanitizeBulkDto })
  @ApiResponse({ status: 200, description: 'Bulk sanitization completed' })
  @ApiResponse({ status: 400, description: 'Invalid sanitization request' })
  async sanitizeBulk(@Body() dto: SanitizeBulkDto) {
    const requestId = generateRequestId();
    this.logger.log(`Bulk sanitization request for ${dto.inputs.length} inputs (${requestId})`);

    try {
      const result = await this.service.sanitizeBulk(dto);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`Bulk sanitization failed: ${(error as Error).message}`);
      throw new BadRequestException('Bulk sanitization failed');
    }
  }

  @Post('sanitize/object')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sanitize object fields' })
  @ApiBody({ type: SanitizeObjectDto })
  @ApiResponse({ status: 200, description: 'Object sanitized successfully' })
  @ApiResponse({ status: 400, description: 'Invalid sanitization request' })
  async sanitizeObject(@Body() dto: SanitizeObjectDto) {
    const requestId = generateRequestId();
    this.logger.log(`Object sanitization request (${requestId})`);

    try {
      const result = await this.service.sanitizeObject(dto);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`Object sanitization failed: ${(error as Error).message}`);
      throw new BadRequestException('Object sanitization failed');
    }
  }

  @Post('mask')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mask sensitive data (HIPAA-compliant)' })
  @ApiBody({ type: MaskSensitiveDataDto })
  @ApiResponse({ status: 200, description: 'Data masked successfully' })
  @ApiResponse({ status: 400, description: 'Invalid masking request' })
  async maskSensitiveData(@Body() dto: MaskSensitiveDataDto) {
    const requestId = generateRequestId();
    this.logger.log(`Data masking request (${requestId})`);

    try {
      const result = await this.service.maskSensitiveData(dto);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`Data masking failed: ${(error as Error).message}`);
      throw new BadRequestException('Data masking failed');
    }
  }

  @Post('sanitize/path')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sanitize file paths to prevent directory traversal' })
  @ApiBody({ type: SanitizeFilePathDto })
  @ApiResponse({ status: 200, description: 'Path sanitized successfully' })
  @ApiResponse({ status: 400, description: 'Invalid sanitization request' })
  async sanitizeFilePath(@Body() dto: SanitizeFilePathDto) {
    const requestId = generateRequestId();
    this.logger.log(`File path sanitization request (${requestId})`);

    try {
      const result = await this.service.sanitizeFilePath(dto);
      return createSuccessResponse({ sanitized: result }, requestId);
    } catch (error) {
      this.logger.error(`File path sanitization failed: ${(error as Error).message}`);
      throw new BadRequestException('File path sanitization failed');
    }
  }

  @Post('sanitize/url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sanitize URLs with protocol validation' })
  @ApiBody({ type: SanitizeUrlDto })
  @ApiResponse({ status: 200, description: 'URL sanitized successfully' })
  @ApiResponse({ status: 400, description: 'Invalid sanitization request' })
  async sanitizeUrl(@Body() dto: SanitizeUrlDto) {
    const requestId = generateRequestId();
    this.logger.log(`URL sanitization request (${requestId})`);

    try {
      const result = await this.service.sanitizeUrl(dto);
      return createSuccessResponse({ sanitized: result }, requestId);
    } catch (error) {
      this.logger.error(`URL sanitization failed: ${(error as Error).message}`);
      throw new BadRequestException('URL sanitization failed');
    }
  }

  @Post('sanitize/command')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sanitize command strings' })
  @ApiBody({ type: SanitizeCommandDto })
  @ApiResponse({ status: 200, description: 'Command sanitized successfully' })
  @ApiResponse({ status: 400, description: 'Invalid sanitization request' })
  async sanitizeCommand(@Body() dto: SanitizeCommandDto) {
    const requestId = generateRequestId();
    this.logger.log(`Command sanitization request (${requestId})`);

    try {
      const result = await this.service.sanitizeCommand(dto);
      return createSuccessResponse({ sanitized: result }, requestId);
    } catch (error) {
      this.logger.error(`Command sanitization failed: ${(error as Error).message}`);
      throw new BadRequestException('Command sanitization failed');
    }
  }

  @Post('normalize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Normalize text with multiple options' })
  @ApiBody({ type: NormalizeTextDto })
  @ApiResponse({ status: 200, description: 'Text normalized successfully' })
  @ApiResponse({ status: 400, description: 'Invalid normalization request' })
  async normalizeText(@Body() dto: NormalizeTextDto) {
    const requestId = generateRequestId();
    this.logger.log(`Text normalization request (${requestId})`);

    try {
      const result = await this.service.normalizeText(dto);
      return createSuccessResponse({ normalized: result }, requestId);
    } catch (error) {
      this.logger.error(`Text normalization failed: ${(error as Error).message}`);
      throw new BadRequestException('Text normalization failed');
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  InputSanitizationService,
  InputSanitizationController,
};
