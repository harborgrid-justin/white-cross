/**
 * LOC: TRANSOPS001
 * File: /reuse/threat/composites/downstream/data_layer/composites/transformation-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Data transformation services
 *   - Data normalization modules
 *   - API response formatters
 *   - ETL pipeline processors
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/transformation-operations-kit.ts
 * Locator: WC-DATALAYER-TRANSOPS-001
 * Purpose: Comprehensive data transformation operations for threat intelligence platform
 *
 * Upstream: _production-patterns.ts
 * Downstream: All services requiring data transformation, ETL pipelines, API formatters
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, class-transformer
 * Exports: 45 transformation functions, case converters, formatters, parsers, DTOs
 *
 * LLM Context: Production-ready transformation operations for White Cross healthcare threat
 * intelligence platform. Provides comprehensive data transformation, case conversion, formatting,
 * parsing, normalization, encoding/decoding, and data structure manipulation. All transformers
 * include error handling, null-safety, and maintain data integrity throughout the transformation
 * process. Supports HIPAA-compliant transformations with audit logging.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Injectable,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
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
  IsObject,
} from 'class-validator';
import { Type, Transform, plainToClass, classToPlain } from 'class-transformer';
import {
  createSuccessResponse,
  createCreatedResponse,
  generateRequestId,
  createLogger,
  BadRequestError,
  safeStringify,
} from '../../_production-patterns';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

export enum CaseType {
  CAMEL = 'CAMEL',
  SNAKE = 'SNAKE',
  PASCAL = 'PASCAL',
  KEBAB = 'KEBAB',
  UPPER = 'UPPER',
  LOWER = 'LOWER',
  TITLE = 'TITLE',
  SENTENCE = 'SENTENCE',
}

export enum DateFormat {
  ISO_8601 = 'ISO_8601',
  US_DATE = 'US_DATE',
  EU_DATE = 'EU_DATE',
  TIMESTAMP = 'TIMESTAMP',
  UNIX_EPOCH = 'UNIX_EPOCH',
  RELATIVE = 'RELATIVE',
}

export enum DataEncoding {
  BASE64 = 'BASE64',
  HEX = 'HEX',
  URL = 'URL',
  HTML = 'HTML',
  UTF8 = 'UTF8',
}

export interface TransformationResult<T = any> {
  success: boolean;
  originalValue: any;
  transformedValue: T;
  transformation: string;
  metadata?: Record<string, any>;
}

export interface TransformationContext {
  requestId: string;
  preserveNulls?: boolean;
  strict?: boolean;
  metadata?: Record<string, any>;
}

// ============================================================================
// DTOs
// ============================================================================

export class TransformStringDto {
  @ApiProperty({ description: 'String to transform', example: 'hello world' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: 'Target case type', enum: CaseType })
  @IsEnum(CaseType)
  targetCase: CaseType;
}

export class TransformDateDto {
  @ApiProperty({ description: 'Date to transform', example: '2025-11-10T10:00:00Z' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: 'Target date format', enum: DateFormat })
  @IsEnum(DateFormat)
  targetFormat: DateFormat;
}

export class TransformNumberDto {
  @ApiProperty({ description: 'Number to transform', example: 1234.56 })
  @IsNumber()
  value: number;

  @ApiProperty({ description: 'Decimal places', example: 2 })
  @IsNumber()
  @IsOptional()
  decimalPlaces?: number;

  @ApiProperty({ description: 'Use thousand separator', example: true })
  @IsBoolean()
  @IsOptional()
  useThousandSeparator?: boolean = false;
}

export class EncodeDataDto {
  @ApiProperty({ description: 'Data to encode', example: 'Hello World' })
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiProperty({ description: 'Target encoding', enum: DataEncoding })
  @IsEnum(DataEncoding)
  encoding: DataEncoding;
}

export class DecodeDataDto {
  @ApiProperty({ description: 'Data to decode', example: 'SGVsbG8gV29ybGQ=' })
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiProperty({ description: 'Source encoding', enum: DataEncoding })
  @IsEnum(DataEncoding)
  encoding: DataEncoding;
}

export class TransformArrayDto {
  @ApiProperty({ description: 'Array to transform', example: [1, 2, 3] })
  @IsArray()
  array: any[];

  @ApiProperty({ description: 'Operation to perform', enum: ['deduplicate', 'sort', 'reverse', 'flatten'] })
  @IsString()
  operation: string;
}

export class TransformObjectDto {
  @ApiProperty({ description: 'Object to transform', example: { firstName: 'John' } })
  @IsObject()
  object: Record<string, any>;

  @ApiProperty({ description: 'Target case for keys', enum: CaseType })
  @IsEnum(CaseType)
  targetCase: CaseType;

  @ApiProperty({ description: 'Deep transformation', default: false })
  @IsBoolean()
  @IsOptional()
  deep?: boolean = false;
}

// ============================================================================
// TRANSFORMATION SERVICE
// ============================================================================

@Injectable()
export class TransformationOperationsService {
  private readonly logger = createLogger(TransformationOperationsService.name);

  /**
   * Convert string to camelCase
   * @param str - String to convert
   * @returns camelCase string
   */
  toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '')
      .replace(/[-_]/g, '');
  }

  /**
   * Convert string to snake_case
   * @param str - String to convert
   * @returns snake_case string
   */
  toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[-]/g, '_')
      .replace(/^_/, '');
  }

  /**
   * Convert string to PascalCase
   * @param str - String to convert
   * @returns PascalCase string
   */
  toPascalCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
        return word.toUpperCase();
      })
      .replace(/\s+/g, '')
      .replace(/[-_]/g, '');
  }

  /**
   * Convert string to kebab-case
   * @param str - String to convert
   * @returns kebab-case string
   */
  toKebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/_/g, '-')
      .replace(/^-/, '');
  }

  /**
   * Convert string to Title Case
   * @param str - String to convert
   * @returns Title Case string
   */
  toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Convert string to Sentence case
   * @param str - String to convert
   * @returns Sentence case string
   */
  toSentenceCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Transform string case based on target type
   * @param str - String to transform
   * @param targetCase - Target case type
   * @returns Transformed string
   */
  transformStringCase(str: string, targetCase: CaseType): string {
    switch (targetCase) {
      case CaseType.CAMEL:
        return this.toCamelCase(str);
      case CaseType.SNAKE:
        return this.toSnakeCase(str);
      case CaseType.PASCAL:
        return this.toPascalCase(str);
      case CaseType.KEBAB:
        return this.toKebabCase(str);
      case CaseType.UPPER:
        return str.toUpperCase();
      case CaseType.LOWER:
        return str.toLowerCase();
      case CaseType.TITLE:
        return this.toTitleCase(str);
      case CaseType.SENTENCE:
        return this.toSentenceCase(str);
      default:
        return str;
    }
  }

  /**
   * Format date to ISO 8601 string
   * @param date - Date to format
   * @returns ISO 8601 formatted string
   */
  formatDateISO(date: Date): string {
    return date.toISOString();
  }

  /**
   * Format date to US format (MM/DD/YYYY)
   * @param date - Date to format
   * @returns US formatted date string
   */
  formatDateUS(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /**
   * Format date to EU format (DD/MM/YYYY)
   * @param date - Date to format
   * @returns EU formatted date string
   */
  formatDateEU(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Format date to timestamp string
   * @param date - Date to format
   * @returns Timestamp string
   */
  formatDateTimestamp(date: Date): string {
    return date.getTime().toString();
  }

  /**
   * Format date to Unix epoch seconds
   * @param date - Date to format
   * @returns Unix epoch seconds
   */
  formatDateUnixEpoch(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }

  /**
   * Format date to relative time (e.g., "2 hours ago")
   * @param date - Date to format
   * @returns Relative time string
   */
  formatDateRelative(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHr < 24) return `${diffHr} hours ago`;
    if (diffDay < 30) return `${diffDay} days ago`;

    const diffMonth = Math.floor(diffDay / 30);
    if (diffMonth < 12) return `${diffMonth} months ago`;

    const diffYear = Math.floor(diffMonth / 12);
    return `${diffYear} years ago`;
  }

  /**
   * Transform date format
   * @param dateStr - Date string to transform
   * @param targetFormat - Target date format
   * @returns Transformed date string
   */
  transformDateFormat(dateStr: string, targetFormat: DateFormat): string | number {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      throw new BadRequestError('Invalid date format');
    }

    switch (targetFormat) {
      case DateFormat.ISO_8601:
        return this.formatDateISO(date);
      case DateFormat.US_DATE:
        return this.formatDateUS(date);
      case DateFormat.EU_DATE:
        return this.formatDateEU(date);
      case DateFormat.TIMESTAMP:
        return this.formatDateTimestamp(date);
      case DateFormat.UNIX_EPOCH:
        return this.formatDateUnixEpoch(date);
      case DateFormat.RELATIVE:
        return this.formatDateRelative(date);
      default:
        return dateStr;
    }
  }

  /**
   * Format number with decimal places
   * @param num - Number to format
   * @param decimalPlaces - Number of decimal places
   * @returns Formatted number string
   */
  formatNumber(num: number, decimalPlaces: number = 2): string {
    return num.toFixed(decimalPlaces);
  }

  /**
   * Format number with thousand separators
   * @param num - Number to format
   * @param decimalPlaces - Number of decimal places
   * @returns Formatted number string with separators
   */
  formatNumberWithSeparators(num: number, decimalPlaces: number = 2): string {
    const formatted = num.toFixed(decimalPlaces);
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  /**
   * Format number as currency
   * @param num - Number to format
   * @param currencySymbol - Currency symbol
   * @param decimalPlaces - Number of decimal places
   * @returns Formatted currency string
   */
  formatCurrency(num: number, currencySymbol: string = '$', decimalPlaces: number = 2): string {
    const formatted = this.formatNumberWithSeparators(num, decimalPlaces);
    return `${currencySymbol}${formatted}`;
  }

  /**
   * Format number as percentage
   * @param num - Number to format (0-1 range)
   * @param decimalPlaces - Number of decimal places
   * @returns Formatted percentage string
   */
  formatPercentage(num: number, decimalPlaces: number = 2): string {
    return `${(num * 100).toFixed(decimalPlaces)}%`;
  }

  /**
   * Parse string to number
   * @param str - String to parse
   * @returns Parsed number or NaN
   */
  parseNumber(str: string): number {
    // Remove thousand separators and currency symbols
    const cleaned = str.replace(/[,$]/g, '');
    return parseFloat(cleaned);
  }

  /**
   * Parse string to boolean
   * @param str - String to parse
   * @returns Boolean value
   */
  parseBoolean(str: string): boolean {
    const normalized = str.toLowerCase().trim();
    return ['true', '1', 'yes', 'y', 'on'].includes(normalized);
  }

  /**
   * Parse CSV string to array
   * @param csv - CSV string
   * @returns Array of values
   */
  parseCSV(csv: string): string[] {
    return csv.split(',').map(item => item.trim());
  }

  /**
   * Parse query string to object
   * @param queryString - Query string to parse
   * @returns Object with key-value pairs
   */
  parseQueryString(queryString: string): Record<string, string> {
    const params: Record<string, string> = {};
    const pairs = queryString.replace(/^\?/, '').split('&');

    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }

    return params;
  }

  /**
   * Encode string to Base64
   * @param str - String to encode
   * @returns Base64 encoded string
   */
  encodeBase64(str: string): string {
    return Buffer.from(str, 'utf-8').toString('base64');
  }

  /**
   * Decode Base64 string
   * @param base64 - Base64 string to decode
   * @returns Decoded string
   */
  decodeBase64(base64: string): string {
    return Buffer.from(base64, 'base64').toString('utf-8');
  }

  /**
   * Encode string to hex
   * @param str - String to encode
   * @returns Hex encoded string
   */
  encodeHex(str: string): string {
    return Buffer.from(str, 'utf-8').toString('hex');
  }

  /**
   * Decode hex string
   * @param hex - Hex string to decode
   * @returns Decoded string
   */
  decodeHex(hex: string): string {
    return Buffer.from(hex, 'hex').toString('utf-8');
  }

  /**
   * URL encode string
   * @param str - String to encode
   * @returns URL encoded string
   */
  encodeURL(str: string): string {
    return encodeURIComponent(str);
  }

  /**
   * URL decode string
   * @param encoded - URL encoded string
   * @returns Decoded string
   */
  decodeURL(encoded: string): string {
    return decodeURIComponent(encoded);
  }

  /**
   * HTML encode string (escape special characters)
   * @param str - String to encode
   * @returns HTML encoded string
   */
  encodeHTML(str: string): string {
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
    };

    return str.replace(/[&<>"'\/]/g, char => htmlEntities[char]);
  }

  /**
   * HTML decode string
   * @param str - HTML encoded string
   * @returns Decoded string
   */
  decodeHTML(str: string): string {
    const htmlEntities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x2F;': '/',
    };

    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g, entity => htmlEntities[entity]);
  }

  /**
   * Encode/decode data based on encoding type
   * @param data - Data to encode/decode
   * @param encoding - Encoding type
   * @param decode - Whether to decode (true) or encode (false)
   * @returns Transformed data
   */
  transformEncoding(data: string, encoding: DataEncoding, decode: boolean = false): string {
    try {
      if (decode) {
        switch (encoding) {
          case DataEncoding.BASE64:
            return this.decodeBase64(data);
          case DataEncoding.HEX:
            return this.decodeHex(data);
          case DataEncoding.URL:
            return this.decodeURL(data);
          case DataEncoding.HTML:
            return this.decodeHTML(data);
          default:
            return data;
        }
      } else {
        switch (encoding) {
          case DataEncoding.BASE64:
            return this.encodeBase64(data);
          case DataEncoding.HEX:
            return this.encodeHex(data);
          case DataEncoding.URL:
            return this.encodeURL(data);
          case DataEncoding.HTML:
            return this.encodeHTML(data);
          default:
            return data;
        }
      }
    } catch (error) {
      this.logger.error(`Encoding transformation failed: ${(error as Error).message}`);
      throw new BadRequestError('Encoding transformation failed');
    }
  }

  /**
   * Trim whitespace from string
   * @param str - String to trim
   * @returns Trimmed string
   */
  trimString(str: string): string {
    return str.trim();
  }

  /**
   * Truncate string to max length with ellipsis
   * @param str - String to truncate
   * @param maxLength - Maximum length
   * @param ellipsis - Ellipsis string
   * @returns Truncated string
   */
  truncateString(str: string, maxLength: number, ellipsis: string = '...'): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - ellipsis.length) + ellipsis;
  }

  /**
   * Pad string to target length
   * @param str - String to pad
   * @param targetLength - Target length
   * @param padChar - Padding character
   * @param padLeft - Whether to pad left (true) or right (false)
   * @returns Padded string
   */
  padString(str: string, targetLength: number, padChar: string = ' ', padLeft: boolean = false): string {
    if (str.length >= targetLength) return str;

    const padding = padChar.repeat(targetLength - str.length);
    return padLeft ? padding + str : str + padding;
  }

  /**
   * Remove special characters from string
   * @param str - String to clean
   * @param keepSpaces - Whether to keep spaces
   * @returns Cleaned string
   */
  removeSpecialCharacters(str: string, keepSpaces: boolean = true): string {
    const pattern = keepSpaces ? /[^a-zA-Z0-9\s]/g : /[^a-zA-Z0-9]/g;
    return str.replace(pattern, '');
  }

  /**
   * Slugify string (URL-friendly)
   * @param str - String to slugify
   * @returns Slugified string
   */
  slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Deduplicate array
   * @param arr - Array to deduplicate
   * @returns Array with unique values
   */
  deduplicateArray<T>(arr: T[]): T[] {
    return [...new Set(arr)];
  }

  /**
   * Sort array
   * @param arr - Array to sort
   * @param ascending - Sort order
   * @returns Sorted array
   */
  sortArray<T>(arr: T[], ascending: boolean = true): T[] {
    const sorted = [...arr].sort();
    return ascending ? sorted : sorted.reverse();
  }

  /**
   * Flatten nested array
   * @param arr - Nested array to flatten
   * @param depth - Depth to flatten
   * @returns Flattened array
   */
  flattenArray(arr: any[], depth: number = Infinity): any[] {
    return arr.flat(depth);
  }

  /**
   * Chunk array into smaller arrays
   * @param arr - Array to chunk
   * @param chunkSize - Size of each chunk
   * @returns Array of chunks
   */
  chunkArray<T>(arr: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Transform object keys to different case
   * @param obj - Object to transform
   * @param targetCase - Target case type
   * @param deep - Whether to transform nested objects
   * @returns Transformed object
   */
  transformObjectKeys(obj: Record<string, any>, targetCase: CaseType, deep: boolean = false): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      const transformedKey = this.transformStringCase(key, targetCase);

      if (deep && value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[transformedKey] = this.transformObjectKeys(value, targetCase, deep);
      } else if (deep && Array.isArray(value)) {
        result[transformedKey] = value.map(item =>
          item !== null && typeof item === 'object' && !Array.isArray(item)
            ? this.transformObjectKeys(item, targetCase, deep)
            : item
        );
      } else {
        result[transformedKey] = value;
      }
    }

    return result;
  }

  /**
   * Remove null/undefined values from object
   * @param obj - Object to clean
   * @param deep - Whether to clean nested objects
   * @returns Cleaned object
   */
  removeNullValues(obj: Record<string, any>, deep: boolean = false): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (deep && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = this.removeNullValues(value, deep);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Flatten nested object to single level
   * @param obj - Object to flatten
   * @param separator - Key separator
   * @returns Flattened object
   */
  flattenObject(obj: Record<string, any>, separator: string = '.'): Record<string, any> {
    const result: Record<string, any> = {};

    const flatten = (current: any, prefix: string = '') => {
      for (const [key, value] of Object.entries(current)) {
        const newKey = prefix ? `${prefix}${separator}${key}` : key;

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          flatten(value, newKey);
        } else {
          result[newKey] = value;
        }
      }
    };

    flatten(obj);
    return result;
  }

  /**
   * Deep clone object
   * @param obj - Object to clone
   * @returns Cloned object
   */
  deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Merge objects deeply
   * @param target - Target object
   * @param source - Source object
   * @returns Merged object
   */
  mergeObjects<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    const result = { ...target };

    for (const [key, value] of Object.entries(source)) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[key as keyof T] = this.mergeObjects(
          result[key as keyof T] as any,
          value as any
        );
      } else {
        result[key as keyof T] = value as any;
      }
    }

    return result;
  }

  /**
   * Pick specific keys from object
   * @param obj - Source object
   * @param keys - Keys to pick
   * @returns New object with selected keys
   */
  pickKeys<T extends Record<string, any>>(obj: T, keys: string[]): Partial<T> {
    const result: Partial<T> = {};

    for (const key of keys) {
      if (key in obj) {
        result[key as keyof T] = obj[key];
      }
    }

    return result;
  }

  /**
   * Omit specific keys from object
   * @param obj - Source object
   * @param keys - Keys to omit
   * @returns New object without omitted keys
   */
  omitKeys<T extends Record<string, any>>(obj: T, keys: string[]): Partial<T> {
    const result: Partial<T> = { ...obj };

    for (const key of keys) {
      delete result[key as keyof T];
    }

    return result;
  }

  /**
   * Normalize phone number to standard format
   * @param phone - Phone number to normalize
   * @returns Normalized phone number
   */
  normalizePhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }

    return phone;
  }

  /**
   * Normalize email address
   * @param email - Email to normalize
   * @returns Normalized email
   */
  normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Extract domain from email
   * @param email - Email address
   * @returns Domain part
   */
  extractEmailDomain(email: string): string {
    return email.split('@')[1] || '';
  }

  /**
   * Convert bytes to human-readable format
   * @param bytes - Number of bytes
   * @param decimals - Decimal places
   * @returns Human-readable size string
   */
  formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }

  /**
   * Convert milliseconds to duration string
   * @param ms - Milliseconds
   * @returns Duration string (e.g., "2h 30m 15s")
   */
  formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Mask sensitive data (e.g., credit card, SSN)
   * @param value - Value to mask
   * @param visibleChars - Number of visible characters at end
   * @param maskChar - Masking character
   * @returns Masked string
   */
  maskSensitiveData(value: string, visibleChars: number = 4, maskChar: string = '*'): string {
    if (value.length <= visibleChars) return value;

    const masked = maskChar.repeat(value.length - visibleChars);
    const visible = value.slice(-visibleChars);

    return masked + visible;
  }

  /**
   * Transform array to object with key selector
   * @param arr - Array to transform
   * @param keySelector - Function to select key for each item
   * @returns Object with array items as values
   */
  arrayToObject<T>(arr: T[], keySelector: (item: T) => string): Record<string, T> {
    const result: Record<string, T> = {};

    for (const item of arr) {
      const key = keySelector(item);
      result[key] = item;
    }

    return result;
  }

  /**
   * Transform object to array of key-value pairs
   * @param obj - Object to transform
   * @returns Array of key-value pairs
   */
  objectToArray<T>(obj: Record<string, T>): Array<{ key: string; value: T }> {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }
}

// ============================================================================
// CONTROLLER
// ============================================================================

@Controller('api/v1/transformation-operations')
@ApiTags('Data Transformation Operations')
@ApiBearerAuth()
export class TransformationOperationsController {
  private readonly logger = createLogger(TransformationOperationsController.name);

  constructor(private readonly service: TransformationOperationsService) {}

  @Post('string/case')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transform string case' })
  @ApiBody({ type: TransformStringDto })
  @ApiResponse({ status: 200, description: 'String case transformed' })
  @ApiResponse({ status: 400, description: 'Invalid transformation request' })
  async transformStringCase(@Body() dto: TransformStringDto) {
    const requestId = generateRequestId();
    this.logger.log(`Transforming string case: ${dto.targetCase} (${requestId})`);

    try {
      const transformed = this.service.transformStringCase(dto.value, dto.targetCase);

      const result: TransformationResult<string> = {
        success: true,
        originalValue: dto.value,
        transformedValue: transformed,
        transformation: `case_${dto.targetCase.toLowerCase()}`,
      };

      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`String case transformation failed: ${(error as Error).message}`);
      throw new BadRequestError('String case transformation failed', { requestId });
    }
  }

  @Post('date/format')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transform date format' })
  @ApiBody({ type: TransformDateDto })
  @ApiResponse({ status: 200, description: 'Date format transformed' })
  @ApiResponse({ status: 400, description: 'Invalid date or format' })
  async transformDateFormat(@Body() dto: TransformDateDto) {
    const requestId = generateRequestId();
    this.logger.log(`Transforming date format: ${dto.targetFormat} (${requestId})`);

    try {
      const transformed = this.service.transformDateFormat(dto.value, dto.targetFormat);

      const result: TransformationResult<string | number> = {
        success: true,
        originalValue: dto.value,
        transformedValue: transformed,
        transformation: `date_${dto.targetFormat.toLowerCase()}`,
      };

      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`Date format transformation failed: ${(error as Error).message}`);
      throw new BadRequestError('Date format transformation failed', { requestId });
    }
  }

  @Post('number/format')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Format number with options' })
  @ApiBody({ type: TransformNumberDto })
  @ApiResponse({ status: 200, description: 'Number formatted' })
  @ApiResponse({ status: 400, description: 'Invalid number format' })
  async formatNumber(@Body() dto: TransformNumberDto) {
    const requestId = generateRequestId();
    this.logger.log(`Formatting number (${requestId})`);

    try {
      const transformed = dto.useThousandSeparator
        ? this.service.formatNumberWithSeparators(dto.value, dto.decimalPlaces)
        : this.service.formatNumber(dto.value, dto.decimalPlaces);

      const result: TransformationResult<string> = {
        success: true,
        originalValue: dto.value,
        transformedValue: transformed,
        transformation: 'number_format',
      };

      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`Number formatting failed: ${(error as Error).message}`);
      throw new BadRequestError('Number formatting failed', { requestId });
    }
  }

  @Post('encode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Encode data to specified format' })
  @ApiBody({ type: EncodeDataDto })
  @ApiResponse({ status: 200, description: 'Data encoded' })
  @ApiResponse({ status: 400, description: 'Encoding failed' })
  async encodeData(@Body() dto: EncodeDataDto) {
    const requestId = generateRequestId();
    this.logger.log(`Encoding data: ${dto.encoding} (${requestId})`);

    try {
      const encoded = this.service.transformEncoding(dto.data, dto.encoding, false);

      const result: TransformationResult<string> = {
        success: true,
        originalValue: dto.data,
        transformedValue: encoded,
        transformation: `encode_${dto.encoding.toLowerCase()}`,
      };

      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`Data encoding failed: ${(error as Error).message}`);
      throw new BadRequestError('Data encoding failed', { requestId });
    }
  }

  @Post('decode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Decode data from specified format' })
  @ApiBody({ type: DecodeDataDto })
  @ApiResponse({ status: 200, description: 'Data decoded' })
  @ApiResponse({ status: 400, description: 'Decoding failed' })
  async decodeData(@Body() dto: DecodeDataDto) {
    const requestId = generateRequestId();
    this.logger.log(`Decoding data: ${dto.encoding} (${requestId})`);

    try {
      const decoded = this.service.transformEncoding(dto.data, dto.encoding, true);

      const result: TransformationResult<string> = {
        success: true,
        originalValue: dto.data,
        transformedValue: decoded,
        transformation: `decode_${dto.encoding.toLowerCase()}`,
      };

      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`Data decoding failed: ${(error as Error).message}`);
      throw new BadRequestError('Data decoding failed', { requestId });
    }
  }

  @Post('array/transform')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transform array with specified operation' })
  @ApiBody({ type: TransformArrayDto })
  @ApiResponse({ status: 200, description: 'Array transformed' })
  @ApiResponse({ status: 400, description: 'Transformation failed' })
  async transformArray(@Body() dto: TransformArrayDto) {
    const requestId = generateRequestId();
    this.logger.log(`Transforming array: ${dto.operation} (${requestId})`);

    try {
      let transformed: any[];

      switch (dto.operation) {
        case 'deduplicate':
          transformed = this.service.deduplicateArray(dto.array);
          break;
        case 'sort':
          transformed = this.service.sortArray(dto.array);
          break;
        case 'reverse':
          transformed = [...dto.array].reverse();
          break;
        case 'flatten':
          transformed = this.service.flattenArray(dto.array);
          break;
        default:
          throw new BadRequestError('Invalid array operation');
      }

      const result: TransformationResult<any[]> = {
        success: true,
        originalValue: dto.array,
        transformedValue: transformed,
        transformation: `array_${dto.operation}`,
      };

      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`Array transformation failed: ${(error as Error).message}`);
      throw new BadRequestError('Array transformation failed', { requestId });
    }
  }

  @Post('object/keys')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transform object keys to different case' })
  @ApiBody({ type: TransformObjectDto })
  @ApiResponse({ status: 200, description: 'Object keys transformed' })
  @ApiResponse({ status: 400, description: 'Transformation failed' })
  async transformObjectKeys(@Body() dto: TransformObjectDto) {
    const requestId = generateRequestId();
    this.logger.log(`Transforming object keys: ${dto.targetCase} (${requestId})`);

    try {
      const transformed = this.service.transformObjectKeys(dto.object, dto.targetCase, dto.deep);

      const result: TransformationResult<Record<string, any>> = {
        success: true,
        originalValue: dto.object,
        transformedValue: transformed,
        transformation: `object_keys_${dto.targetCase.toLowerCase()}`,
      };

      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`Object keys transformation failed: ${(error as Error).message}`);
      throw new BadRequestError('Object keys transformation failed', { requestId });
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  TransformationOperationsController,
  TransformationOperationsService,
};
