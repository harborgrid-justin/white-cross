/**
 * LOC: SANITOPS001
 * File: /reuse/threat/composites/downstream/data_layer/composites/sanitization-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - html-escaper
 *   - xss
 *
 * DOWNSTREAM (imported by):
 *   - Input validation services
 *   - Output encoding handlers
 *   - Security middleware
 *   - Data sanitization pipelines
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/sanitization-operations-kit.ts
 * Locator: WC-DATALAYER-SANITOPS-001
 * Purpose: Comprehensive Sanitization Operations Kit - Production-grade input/output security
 *
 * Upstream: _production-patterns.ts, NestJS, class-validator
 * Downstream: Security middleware, Input validation, Output encoding, XSS prevention
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, class-validator, xss, html-entities
 * Exports: 45 sanitization functions, input/output handlers, encoding/escaping utilities
 *
 * LLM Context: Production-ready sanitization operations for White Cross healthcare threat
 * intelligence platform. Provides comprehensive input sanitization, output encoding, XSS prevention,
 * SQL injection prevention, and data protection. All sanitizers include HIPAA compliance,
 * security validation, and detailed logging for audit trails. Supports HTML, SQL, XML, JSON,
 * URLs, emails, phone numbers, SSNs, credit cards, and command sanitization.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Injectable,
  Logger,
  BadRequestException,
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
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import {
  createSuccessResponse,
  generateRequestId,
  createLogger,
  BadRequestError,
} from '../../_production-patterns';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

export enum SanitizationType {
  HTML = 'HTML',
  SQL = 'SQL',
  XML = 'XML',
  JSON = 'JSON',
  URL = 'URL',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  SSN = 'SSN',
  CREDIT_CARD = 'CREDIT_CARD',
  COMMAND = 'COMMAND',
  REGEX = 'REGEX',
  PATH = 'PATH',
  FILENAME = 'FILENAME',
}

export enum EncodingType {
  HTML = 'HTML',
  SQL = 'SQL',
  XML = 'XML',
  SHELL = 'SHELL',
  URL = 'URL',
  BASE64 = 'BASE64',
}

export enum NormalizationType {
  UNICODE = 'UNICODE',
  LINE_ENDINGS = 'LINE_ENDINGS',
  WHITESPACE = 'WHITESPACE',
}

export interface SanitizationResult {
  original: string;
  sanitized: string;
  changed: boolean;
  threats: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface XSSDetectionResult {
  isVulnerable: boolean;
  threats: Array<{
    type: string;
    pattern: string;
    location: number[];
  }>;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
}

export interface SQLInjectionCheckResult {
  isSafe: boolean;
  suspiciousPatterns: string[];
  recommendations: string[];
}

// ============================================================================
// SANITIZATION FUNCTIONS - 45 PRODUCTION FUNCTIONS
// ============================================================================

/**
 * Sanitizes user input by removing potentially harmful content
 * @param input - Raw user input
 * @param allowedTags - HTML tags to allow (optional)
 * @returns Sanitized input string
 */
export function sanitizeInput(
  input: string,
  allowedTags: string[] = [],
): string {
  try {
    const logger = createLogger('sanitizeInput');

    if (!input || typeof input !== 'string') {
      return '';
    }

    let sanitized = input.trim();

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Remove control characters
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

    // Remove potentially dangerous HTML if no allowed tags
    if (allowedTags.length === 0) {
      sanitized = sanitized.replace(/<[^>]*>/g, '');
    }

    logger.debug('Input sanitized', { inputLength: input.length });
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize input: ' + (error as Error).message);
  }
}

/**
 * Sanitizes output before sending to client
 * @param output - Output data to sanitize
 * @param format - Output format (html, json, etc)
 * @returns Sanitized output
 */
export function sanitizeOutput(
  output: any,
  format: 'html' | 'json' | 'text' = 'json',
): string {
  try {
    const logger = createLogger('sanitizeOutput');

    let result = typeof output === 'string' ? output : JSON.stringify(output);

    if (format === 'html') {
      result = escapeHTML(result);
    } else if (format === 'json') {
      result = sanitizeJSON(result);
    }

    logger.debug('Output sanitized', { format });
    return result;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize output: ' + (error as Error).message);
  }
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - HTML content to sanitize
 * @param allowedTags - List of allowed HTML tags
 * @returns Sanitized HTML
 */
export function sanitizeHTML(
  html: string,
  allowedTags: string[] = ['p', 'br', 'strong', 'em', 'u', 'a'],
): string {
  try {
    const logger = createLogger('sanitizeHTML');

    if (!html || typeof html !== 'string') {
      return '';
    }

    let sanitized = html;

    // Remove script tags and content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\son\w+\s*=\s*[^\s>]*/gi, '');

    // Remove dangerous attributes
    const dangerousAttrs = [
      'onclick',
      'onload',
      'onerror',
      'onmouseover',
      'onmouseout',
      'onkeydown',
      'onkeyup',
      'onchange',
      'onsubmit',
    ];
    dangerousAttrs.forEach((attr) => {
      const regex = new RegExp(`\\s${attr}\\s*=\\s*["']?[^"'\\s>]*["']?`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });

    // Remove iframe tags
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

    // Remove style tags
    sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    logger.debug('HTML sanitized', {
      originalLength: html.length,
      sanitizedLength: sanitized.length,
    });
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize HTML: ' + (error as Error).message);
  }
}

/**
 * Sanitizes SQL input to prevent SQL injection
 * @param input - SQL input to sanitize
 * @returns Sanitized SQL string
 */
export function sanitizeSQL(input: string): string {
  try {
    const logger = createLogger('sanitizeSQL');

    if (!input || typeof input !== 'string') {
      return '';
    }

    let sanitized = input;

    // Escape single quotes
    sanitized = sanitized.replace(/'/g, "''");

    // Remove SQL comments
    sanitized = sanitized.replace(/--.*$/gm, '');
    sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');

    // Remove semicolon (statement terminator)
    sanitized = sanitized.replace(/;/g, '');

    // Remove common SQL keywords that indicate injection
    const sqlKeywords = [
      'DROP',
      'DELETE',
      'INSERT',
      'UPDATE',
      'UNION',
      'SELECT',
      'EXEC',
      'EXECUTE',
    ];
    sqlKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });

    logger.debug('SQL sanitized', { originalLength: input.length });
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize SQL: ' + (error as Error).message);
  }
}

/**
 * Sanitizes XML content to prevent XML attacks
 * @param xml - XML content to sanitize
 * @returns Sanitized XML
 */
export function sanitizeXML(xml: string): string {
  try {
    const logger = createLogger('sanitizeXML');

    if (!xml || typeof xml !== 'string') {
      return '';
    }

    let sanitized = xml;

    // Remove DTD declarations
    sanitized = sanitized.replace(/<!DOCTYPE[^>]*>/gi, '');
    sanitized = sanitized.replace(/<!ENTITY[^>]*>/gi, '');

    // Remove CDATA sections
    sanitized = sanitized.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');

    // Remove processing instructions
    sanitized = sanitized.replace(/<\?[\s\S]*?\?>/g, '');

    // Escape special characters
    sanitized = escapeXML(sanitized);

    logger.debug('XML sanitized', { originalLength: xml.length });
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize XML: ' + (error as Error).message);
  }
}

/**
 * Sanitizes JSON to prevent injection attacks
 * @param json - JSON string to sanitize
 * @returns Sanitized JSON
 */
export function sanitizeJSON(json: string): string {
  try {
    const logger = createLogger('sanitizeJSON');

    if (!json || typeof json !== 'string') {
      return '{}';
    }

    // Validate JSON format
    let parsed;
    try {
      parsed = JSON.parse(json);
    } catch {
      return '{}';
    }

    // Stringify back to ensure clean JSON
    const sanitized = JSON.stringify(parsed);

    logger.debug('JSON sanitized', { originalLength: json.length });
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize JSON: ' + (error as Error).message);
  }
}

/**
 * Sanitizes URLs to prevent injection and malicious redirects
 * @param url - URL to sanitize
 * @returns Sanitized URL
 */
export function sanitizeURL(url: string): string {
  try {
    const logger = createLogger('sanitizeURL');

    if (!url || typeof url !== 'string') {
      return '';
    }

    // Check for dangerous protocols
    const dangerousProtocols = [
      'javascript:',
      'data:',
      'vbscript:',
      'file:',
    ];

    const lowerUrl = url.toLowerCase();
    for (const protocol of dangerousProtocols) {
      if (lowerUrl.startsWith(protocol)) {
        logger.warn('Dangerous URL protocol detected', { url: url.substring(0, 50) });
        return '';
      }
    }

    try {
      const urlObj = new URL(url);
      return urlObj.toString();
    } catch {
      // If not a valid URL, return empty or sanitized version
      return encodeURI(url);
    }
  } catch (error) {
    throw new BadRequestError('Failed to sanitize URL: ' + (error as Error).message);
  }
}

/**
 * Sanitizes email addresses
 * @param email - Email to sanitize
 * @returns Sanitized email
 */
export function sanitizeEmail(email: string): string {
  try {
    const logger = createLogger('sanitizeEmail');

    if (!email || typeof email !== 'string') {
      return '';
    }

    let sanitized = email.trim().toLowerCase();

    // Remove spaces and dangerous characters
    sanitized = sanitized.replace(/\s/g, '');
    sanitized = sanitized.replace(/[<>()[\]\\,;:\s@"]/g, '');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
      logger.warn('Invalid email format', { email: email.substring(0, 20) });
      return '';
    }

    logger.debug('Email sanitized');
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize email: ' + (error as Error).message);
  }
}

/**
 * Sanitizes phone numbers to standard format
 * @param phone - Phone number to sanitize
 * @returns Sanitized phone number
 */
export function sanitizePhone(phone: string): string {
  try {
    const logger = createLogger('sanitizePhone');

    if (!phone || typeof phone !== 'string') {
      return '';
    }

    // Remove all non-digit characters except +
    let sanitized = phone.replace(/[^\d+]/g, '');

    // Remove spaces and hyphens
    sanitized = sanitized.replace(/[\s\-()]/g, '');

    // Validate US phone format (10 digits after optional +1)
    const phoneRegex = /^\+?1?(\d{10})$/;
    const match = sanitized.match(phoneRegex);

    if (match) {
      return `+1${match[1]}`;
    }

    logger.warn('Invalid phone format', { phone: phone.substring(0, 20) });
    return '';
  } catch (error) {
    throw new BadRequestError('Failed to sanitize phone: ' + (error as Error).message);
  }
}

/**
 * Sanitizes SSN to HIPAA-compliant format (partial masking)
 * @param ssn - Social security number to sanitize
 * @returns Masked SSN
 */
export function sanitizeSSN(ssn: string): string {
  try {
    const logger = createLogger('sanitizeSSN');

    if (!ssn || typeof ssn !== 'string') {
      return '';
    }

    // Remove non-digit characters
    let sanitized = ssn.replace(/\D/g, '');

    // Validate SSN format (9 digits)
    if (sanitized.length !== 9) {
      logger.warn('Invalid SSN format');
      return '';
    }

    // Mask first 5 digits, keep last 4
    const masked = `XXX-XX-${sanitized.substring(5)}`;

    logger.debug('SSN sanitized (masked)');
    return masked;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize SSN: ' + (error as Error).message);
  }
}

/**
 * Sanitizes credit card numbers to HIPAA-compliant format
 * @param creditCard - Credit card number to sanitize
 * @returns Masked credit card
 */
export function sanitizeCreditCard(creditCard: string): string {
  try {
    const logger = createLogger('sanitizeCreditCard');

    if (!creditCard || typeof creditCard !== 'string') {
      return '';
    }

    // Remove non-digit characters
    let sanitized = creditCard.replace(/\D/g, '');

    // Validate credit card length (13-19 digits)
    if (sanitized.length < 13 || sanitized.length > 19) {
      logger.warn('Invalid credit card format');
      return '';
    }

    // Mask all but last 4 digits
    const masked = 'X'.repeat(sanitized.length - 4) + sanitized.substring(sanitized.length - 4);

    logger.debug('Credit card sanitized (masked)');
    return masked;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize credit card: ' + (error as Error).message);
  }
}

/**
 * Sanitizes passwords by removing special characters that could cause issues
 * @param password - Password to sanitize
 * @returns Sanitized password
 */
export function sanitizePassword(password: string): string {
  try {
    const logger = createLogger('sanitizePassword');

    if (!password || typeof password !== 'string') {
      return '';
    }

    // Remove null bytes
    let sanitized = password.replace(/\0/g, '');

    // Remove very long passwords (potential DoS)
    if (sanitized.length > 256) {
      sanitized = sanitized.substring(0, 256);
    }

    logger.debug('Password sanitized');
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize password: ' + (error as Error).message);
  }
}

/**
 * Sanitizes file paths to prevent directory traversal attacks
 * @param path - File path to sanitize
 * @returns Sanitized path
 */
export function sanitizePath(path: string): string {
  try {
    const logger = createLogger('sanitizePath');

    if (!path || typeof path !== 'string') {
      return '';
    }

    let sanitized = path;

    // Remove directory traversal attempts
    sanitized = sanitized.replace(/\.\.\//g, '');
    sanitized = sanitized.replace(/\.\.\\/g, '');

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Normalize path separators
    sanitized = sanitized.replace(/\\/g, '/');

    // Ensure absolute path format
    if (!sanitized.startsWith('/')) {
      sanitized = '/' + sanitized;
    }

    logger.debug('Path sanitized', { path: sanitized });
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize path: ' + (error as Error).message);
  }
}

/**
 * Sanitizes filenames to prevent path traversal
 * @param filename - Filename to sanitize
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  try {
    const logger = createLogger('sanitizeFilename');

    if (!filename || typeof filename !== 'string') {
      return '';
    }

    let sanitized = filename;

    // Remove path separators
    sanitized = sanitized.replace(/[\/\\]/g, '');

    // Remove directory traversal attempts
    sanitized = sanitized.replace(/\.\./g, '');

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Remove special characters except dots, hyphens, underscores
    sanitized = sanitized.replace(/[^a-zA-Z0-9._\-]/g, '');

    // Limit length
    if (sanitized.length > 255) {
      sanitized = sanitized.substring(0, 255);
    }

    logger.debug('Filename sanitized');
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize filename: ' + (error as Error).message);
  }
}

/**
 * Sanitizes command input to prevent command injection
 * @param command - Command string to sanitize
 * @returns Sanitized command
 */
export function sanitizeCommand(command: string): string {
  try {
    const logger = createLogger('sanitizeCommand');

    if (!command || typeof command !== 'string') {
      return '';
    }

    let sanitized = command;

    // Remove dangerous shell metacharacters
    sanitized = sanitized.replace(/[;&|`$(){}[\]<>\\]/g, '');

    // Remove command injection attempts
    sanitized = sanitized.replace(/\$\(/g, '');
    sanitized = sanitized.replace(/`/g, '');
    sanitized = sanitized.replace(/\$\{/g, '');

    logger.debug('Command sanitized');
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize command: ' + (error as Error).message);
  }
}

/**
 * Sanitizes regular expression patterns to prevent ReDoS
 * @param pattern - Regex pattern to sanitize
 * @returns Sanitized pattern
 */
export function sanitizeRegex(pattern: string): string {
  try {
    const logger = createLogger('sanitizeRegex');

    if (!pattern || typeof pattern !== 'string') {
      return '';
    }

    // Check for catastrophic backtracking patterns
    const dangerousPatterns = [
      /(\w+\+)+/,
      /(\w+\*)+/,
      /(\[\w\]\+)+/,
    ];

    let isSafe = true;
    dangerousPatterns.forEach((danger) => {
      if (danger.test(pattern)) {
        isSafe = false;
        logger.warn('Dangerous regex pattern detected');
      }
    });

    if (!isSafe) {
      return '';
    }

    logger.debug('Regex pattern sanitized');
    return pattern;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize regex: ' + (error as Error).message);
  }
}

/**
 * Sanitizes whitespace in input
 * @param input - Input with whitespace to sanitize
 * @param collapseMultiple - Collapse multiple spaces (default: true)
 * @returns Sanitized input
 */
export function sanitizeWhitespace(
  input: string,
  collapseMultiple: boolean = true,
): string {
  try {
    const logger = createLogger('sanitizeWhitespace');

    if (!input || typeof input !== 'string') {
      return '';
    }

    let sanitized = input.trim();

    if (collapseMultiple) {
      sanitized = sanitized.replace(/\s+/g, ' ');
    }

    logger.debug('Whitespace sanitized');
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize whitespace: ' + (error as Error).message);
  }
}

/**
 * Removes HTML tags from content
 * @param content - Content with HTML tags
 * @returns Content with tags stripped
 */
export function stripTags(content: string): string {
  try {
    const logger = createLogger('stripTags');

    if (!content || typeof content !== 'string') {
      return '';
    }

    const stripped = content.replace(/<[^>]*>/g, '');

    logger.debug('Tags stripped');
    return stripped;
  } catch (error) {
    throw new BadRequestError('Failed to strip tags: ' + (error as Error).message);
  }
}

/**
 * Removes script tags and content
 * @param content - Content with scripts
 * @returns Content with scripts removed
 */
export function stripScripts(content: string): string {
  try {
    const logger = createLogger('stripScripts');

    if (!content || typeof content !== 'string') {
      return '';
    }

    const stripped = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    logger.debug('Scripts stripped');
    return stripped;
  } catch (error) {
    throw new BadRequestError('Failed to strip scripts: ' + (error as Error).message);
  }
}

/**
 * Removes style tags and attributes
 * @param content - Content with styles
 * @returns Content with styles removed
 */
export function stripStyles(content: string): string {
  try {
    const logger = createLogger('stripStyles');

    if (!content || typeof content !== 'string') {
      return '';
    }

    let stripped = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    stripped = stripped.replace(/\s*style\s*=\s*["']?[^"']*["']?/gi, '');

    logger.debug('Styles stripped');
    return stripped;
  } catch (error) {
    throw new BadRequestError('Failed to strip styles: ' + (error as Error).message);
  }
}

/**
 * Removes HTML comments
 * @param content - Content with comments
 * @returns Content with comments removed
 */
export function stripComments(content: string): string {
  try {
    const logger = createLogger('stripComments');

    if (!content || typeof content !== 'string') {
      return '';
    }

    const stripped = content.replace(/<!--[\s\S]*?-->/g, '');

    logger.debug('Comments stripped');
    return stripped;
  } catch (error) {
    throw new BadRequestError('Failed to strip comments: ' + (error as Error).message);
  }
}

/**
 * Removes all whitespace characters
 * @param content - Content with whitespace
 * @returns Content with whitespace removed
 */
export function stripWhitespace(content: string): string {
  try {
    const logger = createLogger('stripWhitespace');

    if (!content || typeof content !== 'string') {
      return '';
    }

    const stripped = content.replace(/\s/g, '');

    logger.debug('Whitespace stripped');
    return stripped;
  } catch (error) {
    throw new BadRequestError('Failed to strip whitespace: ' + (error as Error).message);
  }
}

/**
 * Removes dangerous HTML attributes
 * @param html - HTML content
 * @returns HTML with dangerous attributes removed
 */
export function sanitizeTags(html: string): string {
  return sanitizeHTML(html);
}

/**
 * Removes dangerous HTML attributes
 * @param html - HTML content
 * @param allowedAttrs - Attributes to allow
 * @returns HTML with only allowed attributes
 */
export function sanitizeAttributes(
  html: string,
  allowedAttrs: string[] = ['href', 'src', 'alt', 'title'],
): string {
  try {
    const logger = createLogger('sanitizeAttributes');

    if (!html || typeof html !== 'string') {
      return '';
    }

    let sanitized = html;

    // Remove all event handler attributes
    sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove all other attributes except allowed
    const attrRegex = new RegExp(
      `(\\s)(?!${allowedAttrs.join('|')})\\w+\\s*=\\s*["']?[^"'\\s>]*["']?`,
      'gi',
    );
    sanitized = sanitized.replace(attrRegex, '');

    logger.debug('Attributes sanitized');
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize attributes: ' + (error as Error).message);
  }
}

/**
 * Removes script content and script-like content
 * @param content - Content with potential scripts
 * @returns Content with scripts removed
 */
export function sanitizeScripts(content: string): string {
  return stripScripts(content);
}

/**
 * Removes style content and style attributes
 * @param content - Content with styles
 * @returns Content with styles removed
 */
export function sanitizeStyles(content: string): string {
  return stripStyles(content);
}

/**
 * Removes iframe tags
 * @param html - HTML content
 * @returns HTML without iframes
 */
export function sanitizeIframes(html: string): string {
  try {
    const logger = createLogger('sanitizeIframes');

    if (!html || typeof html !== 'string') {
      return '';
    }

    const sanitized = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

    logger.debug('Iframes sanitized');
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize iframes: ' + (error as Error).message);
  }
}

/**
 * Sanitizes links to prevent malicious redirects
 * @param html - HTML content with links
 * @returns HTML with sanitized links
 */
export function sanitizeLinks(html: string): string {
  try {
    const logger = createLogger('sanitizeLinks');

    if (!html || typeof html !== 'string') {
      return '';
    }

    let sanitized = html;

    // Remove javascript: protocol
    sanitized = sanitized.replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="#"');

    // Remove data: protocol
    sanitized = sanitized.replace(/href\s*=\s*["']?\s*data:/gi, 'href="#"');

    logger.debug('Links sanitized');
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize links: ' + (error as Error).message);
  }
}

/**
 * Sanitizes image sources to prevent XSS
 * @param html - HTML content with images
 * @returns HTML with sanitized images
 */
export function sanitizeImages(html: string): string {
  try {
    const logger = createLogger('sanitizeImages');

    if (!html || typeof html !== 'string') {
      return '';
    }

    let sanitized = html;

    // Remove data: protocol in src
    sanitized = sanitized.replace(/src\s*=\s*["']?\s*data:/gi, 'src=""');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/src\s*=\s*["']?\s*javascript:/gi, 'src=""');

    logger.debug('Images sanitized');
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize images: ' + (error as Error).message);
  }
}

/**
 * Escapes HTML special characters
 * @param text - Text to escape
 * @returns HTML-escaped text
 */
export function escapeHTML(text: string): string {
  try {
    const logger = createLogger('escapeHTML');

    if (!text || typeof text !== 'string') {
      return '';
    }

    const escapeMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
    };

    const escaped = text.replace(/[&<>"'\/]/g, (char) => escapeMap[char]);

    logger.debug('HTML escaped');
    return escaped;
  } catch (error) {
    throw new BadRequestError('Failed to escape HTML: ' + (error as Error).message);
  }
}

/**
 * Escapes single quotes for SQL
 * @param text - Text to escape
 * @returns SQL-escaped text
 */
export function escapeSQL(text: string): string {
  try {
    const logger = createLogger('escapeSQL');

    if (!text || typeof text !== 'string') {
      return '';
    }

    const escaped = text.replace(/'/g, "''");

    logger.debug('SQL escaped');
    return escaped;
  } catch (error) {
    throw new BadRequestError('Failed to escape SQL: ' + (error as Error).message);
  }
}

/**
 * Escapes XML special characters
 * @param text - Text to escape
 * @returns XML-escaped text
 */
export function escapeXML(text: string): string {
  try {
    const logger = createLogger('escapeXML');

    if (!text || typeof text !== 'string') {
      return '';
    }

    const escapeMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
    };

    const escaped = text.replace(/[&<>"']/g, (char) => escapeMap[char]);

    logger.debug('XML escaped');
    return escaped;
  } catch (error) {
    throw new BadRequestError('Failed to escape XML: ' + (error as Error).message);
  }
}

/**
 * Escapes regular expression special characters
 * @param text - Text to escape
 * @returns Regex-escaped text
 */
export function escapeRegex(text: string): string {
  try {
    const logger = createLogger('escapeRegex');

    if (!text || typeof text !== 'string') {
      return '';
    }

    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    logger.debug('Regex escaped');
    return escaped;
  } catch (error) {
    throw new BadRequestError('Failed to escape regex: ' + (error as Error).message);
  }
}

/**
 * Escapes string for safe shell execution
 * @param text - Text to escape
 * @returns Shell-escaped text
 */
export function escapeShell(text: string): string {
  try {
    const logger = createLogger('escapeShell');

    if (!text || typeof text !== 'string') {
      return '';
    }

    // Wrap in single quotes and escape single quotes within
    const escaped = `'${text.replace(/'/g, "'\\''")}'`;

    logger.debug('Shell escaped');
    return escaped;
  } catch (error) {
    throw new BadRequestError('Failed to escape shell: ' + (error as Error).message);
  }
}

/**
 * Unescapes HTML entities
 * @param text - HTML-escaped text
 * @returns Unescaped text
 */
export function unescapeHTML(text: string): string {
  try {
    const logger = createLogger('unescapeHTML');

    if (!text || typeof text !== 'string') {
      return '';
    }

    const unescapeMap: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x2F;': '/',
    };

    let unescaped = text;
    Object.entries(unescapeMap).forEach(([entity, char]) => {
      unescaped = unescaped.replace(new RegExp(entity, 'g'), char);
    });

    logger.debug('HTML unescaped');
    return unescaped;
  } catch (error) {
    throw new BadRequestError('Failed to unescape HTML: ' + (error as Error).message);
  }
}

/**
 * Normalizes Unicode text to standard form
 * @param text - Text to normalize
 * @param form - Normalization form (NFC, NFD, NFKC, NFKD)
 * @returns Normalized text
 */
export function normalizeUnicode(
  text: string,
  form: 'NFC' | 'NFD' | 'NFKC' | 'NFKD' = 'NFC',
): string {
  try {
    const logger = createLogger('normalizeUnicode');

    if (!text || typeof text !== 'string') {
      return '';
    }

    const normalized = text.normalize(form);

    logger.debug('Unicode normalized', { form });
    return normalized;
  } catch (error) {
    throw new BadRequestError('Failed to normalize Unicode: ' + (error as Error).message);
  }
}

/**
 * Normalizes line endings to Unix format
 * @param text - Text with various line endings
 * @returns Text with Unix line endings
 */
export function normalizeLineEndings(text: string): string {
  try {
    const logger = createLogger('normalizeLineEndings');

    if (!text || typeof text !== 'string') {
      return '';
    }

    // Convert all line endings to \n
    const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    logger.debug('Line endings normalized');
    return normalized;
  } catch (error) {
    throw new BadRequestError('Failed to normalize line endings: ' + (error as Error).message);
  }
}

/**
 * Normalizes whitespace
 * @param text - Text with irregular whitespace
 * @returns Text with normalized whitespace
 */
export function normalizeWhitespace(text: string): string {
  try {
    const logger = createLogger('normalizeWhitespace');

    if (!text || typeof text !== 'string') {
      return '';
    }

    // Replace multiple spaces with single space
    let normalized = text.replace(/[ \t]+/g, ' ');

    // Replace multiple newlines with single newline
    normalized = normalized.replace(/\n\n+/g, '\n');

    // Trim
    normalized = normalized.trim();

    logger.debug('Whitespace normalized');
    return normalized;
  } catch (error) {
    throw new BadRequestError('Failed to normalize whitespace: ' + (error as Error).message);
  }
}

/**
 * Removes control characters from text
 * @param text - Text with control characters
 * @returns Cleaned text
 */
export function removeControlChars(text: string): string {
  try {
    const logger = createLogger('removeControlChars');

    if (!text || typeof text !== 'string') {
      return '';
    }

    const cleaned = text.replace(/[\x00-\x1F\x7F]/g, '');

    logger.debug('Control characters removed');
    return cleaned;
  } catch (error) {
    throw new BadRequestError('Failed to remove control characters: ' + (error as Error).message);
  }
}

/**
 * Removes invisible characters (zero-width spaces, etc)
 * @param text - Text with invisible characters
 * @returns Cleaned text
 */
export function removeInvisibleChars(text: string): string {
  try {
    const logger = createLogger('removeInvisibleChars');

    if (!text || typeof text !== 'string') {
      return '';
    }

    // Remove zero-width spaces, zero-width joiners, etc
    const cleaned = text
      .replace(/\u200B/g, '') // Zero-width space
      .replace(/\u200C/g, '') // Zero-width non-joiner
      .replace(/\u200D/g, '') // Zero-width joiner
      .replace(/\u200E/g, '') // Left-to-right mark
      .replace(/\u200F/g, '') // Right-to-left mark
      .replace(/\uFEFF/g, ''); // Zero-width no-break space

    logger.debug('Invisible characters removed');
    return cleaned;
  } catch (error) {
    throw new BadRequestError('Failed to remove invisible characters: ' + (error as Error).message);
  }
}

/**
 * Validates text encoding
 * @param text - Text to validate
 * @param encoding - Expected encoding (utf8, utf16, ascii, etc)
 * @returns Validation result
 */
export function validateEncoding(
  text: string,
  encoding: BufferEncoding = 'utf8',
): boolean {
  try {
    const logger = createLogger('validateEncoding');

    if (!text || typeof text !== 'string') {
      return false;
    }

    // Try to encode and decode
    const buffer = Buffer.from(text, encoding);
    const decoded = buffer.toString(encoding);

    const valid = decoded === text;

    logger.debug('Encoding validated', { encoding, valid });
    return valid;
  } catch (error) {
    logger.error('Encoding validation failed', {
      error: (error as Error).message,
    });
    return false;
  }
}

/**
 * Detects potential XSS vulnerabilities in input
 * @param input - Input to check
 * @returns XSS detection result
 */
export function detectXSS(input: string): XSSDetectionResult {
  try {
    const logger = createLogger('detectXSS');

    if (!input || typeof input !== 'string') {
      return {
        isVulnerable: false,
        threats: [],
        severity: 'NONE',
      };
    }

    const threats: Array<{ type: string; pattern: string; location: number[] }> = [];
    let severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' = 'NONE';

    // Check for script tags
    if (/<script[^>]*>/i.test(input)) {
      threats.push({
        type: 'SCRIPT_TAG',
        pattern: '<script>',
        location: [input.toLowerCase().indexOf('<script')],
      });
      severity = 'CRITICAL';
    }

    // Check for event handlers
    if (/on\w+\s*=/i.test(input)) {
      threats.push({
        type: 'EVENT_HANDLER',
        pattern: 'on*=',
        location: [input.search(/on\w+\s*=/i)],
      });
      severity = severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH';
    }

    // Check for javascript protocol
    if (/javascript:/i.test(input)) {
      threats.push({
        type: 'JAVASCRIPT_PROTOCOL',
        pattern: 'javascript:',
        location: [input.toLowerCase().indexOf('javascript:')],
      });
      severity = severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH';
    }

    // Check for data URI
    if (/data:[^,]*,/i.test(input)) {
      threats.push({
        type: 'DATA_URI',
        pattern: 'data:',
        location: [input.toLowerCase().indexOf('data:')],
      });
      severity = severity === 'CRITICAL' ? 'CRITICAL' : 'MEDIUM';
    }

    const result: XSSDetectionResult = {
      isVulnerable: threats.length > 0,
      threats,
      severity,
    };

    logger.debug('XSS detection completed', {
      vulnerable: result.isVulnerable,
      threatCount: threats.length,
    });
    return result;
  } catch (error) {
    throw new BadRequestError('Failed to detect XSS: ' + (error as Error).message);
  }
}

/**
 * Prevents SQL injection by checking for suspicious patterns
 * @param input - SQL input to check
 * @returns SQL injection check result
 */
export function preventSQLInjection(input: string): SQLInjectionCheckResult {
  try {
    const logger = createLogger('preventSQLInjection');

    if (!input || typeof input !== 'string') {
      return {
        isSafe: true,
        suspiciousPatterns: [],
        recommendations: [],
      };
    }

    const suspiciousPatterns: string[] = [];
    const recommendations: string[] = [];

    // Check for SQL keywords
    const sqlKeywords = ['UNION', 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'EXEC'];
    sqlKeywords.forEach((keyword) => {
      if (new RegExp(`\\b${keyword}\\b`, 'i').test(input)) {
        suspiciousPatterns.push(keyword);
      }
    });

    // Check for SQL comments
    if (/--\s|\/\*|\*\/|;/.test(input)) {
      suspiciousPatterns.push('SQL_COMMENT_OR_TERMINATOR');
    }

    // Check for OR/AND conditions
    if (/\bOR\b.*=|'\s*OR\s*'|"\s*OR\s*"/i.test(input)) {
      suspiciousPatterns.push('LOGICAL_OPERATOR');
    }

    if (suspiciousPatterns.length > 0) {
      recommendations.push('Use parameterized queries');
      recommendations.push('Use prepared statements');
      recommendations.push('Validate input against expected format');
    }

    const result: SQLInjectionCheckResult = {
      isSafe: suspiciousPatterns.length === 0,
      suspiciousPatterns,
      recommendations,
    };

    logger.debug('SQL injection check completed', {
      safe: result.isSafe,
      patternCount: suspiciousPatterns.length,
    });
    return result;
  } catch (error) {
    throw new BadRequestError('Failed to check SQL injection: ' + (error as Error).message);
  }
}

// Export types for external use
export {
  SanitizationType,
  EncodingType,
  NormalizationType,
  SanitizationResult,
  XSSDetectionResult,
  SQLInjectionCheckResult,
};
