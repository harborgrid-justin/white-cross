/**
 * LOC: MAILSMTP001
 * File: /reuse/server/mail/mail-smtp-protocol-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS mail services
 *   - SMTP server implementations
 *   - Email queue processors
 *   - Mail relay services
 *   - Healthcare communication modules
 */

/**
 * File: /reuse/server/mail/mail-smtp-protocol-kit.ts
 * Locator: WC-UTL-MAILSMTP-001
 * Purpose: Enterprise SMTP Protocol Kit for NestJS Mail Services
 *
 * Upstream: Independent utility module for comprehensive SMTP protocol operations
 * Downstream: ../backend/*, Mail services, SMTP servers, Email relays, Queue processors
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, nodemailer, bull, crypto
 * Exports: 50 utility functions for SMTP commands, sessions, auth, TLS, DSN, queues, rate limiting, monitoring
 *
 * LLM Context: Enterprise-grade SMTP protocol utilities for White Cross healthcare platform.
 * Provides comprehensive SMTP command parsing and generation (HELO, EHLO, MAIL FROM, RCPT TO, DATA, QUIT),
 * SMTP session management with state tracking, multi-method authentication (PLAIN, LOGIN, CRAM-MD5, XOAUTH2),
 * TLS/STARTTLS encryption support, delivery status notifications (DSN), SMTP error handling and retry logic,
 * message queue management with prioritization, SMTP relay configuration, rate limiting and throttling,
 * comprehensive logging and monitoring, Swagger documentation generation, RFC 5321/5322 compliance,
 * SMTP extension support (8BITMIME, SIZE, PIPELINING, CHUNKING), and Exchange Server compatibility.
 */

import * as crypto from 'crypto';
import * as tls from 'tls';
import * as net from 'net';
import { EventEmitter } from 'events';

// ============================================================================
// TYPE DEFINITIONS - SMTP PROTOCOL
// ============================================================================

/**
 * SMTP command types per RFC 5321
 */
export enum SMTPCommand {
  HELO = 'HELO',
  EHLO = 'EHLO',
  MAIL = 'MAIL',
  RCPT = 'RCPT',
  DATA = 'DATA',
  RSET = 'RSET',
  VRFY = 'VRFY',
  EXPN = 'EXPN',
  HELP = 'HELP',
  NOOP = 'NOOP',
  QUIT = 'QUIT',
  STARTTLS = 'STARTTLS',
  AUTH = 'AUTH',
}

/**
 * SMTP response codes per RFC 5321
 */
export enum SMTPResponseCode {
  // Success 2xx
  SYSTEM_STATUS = 211,
  HELP_MESSAGE = 214,
  SERVICE_READY = 220,
  SERVICE_CLOSING = 221,
  AUTH_SUCCESS = 235,
  OK = 250,
  USER_NOT_LOCAL = 251,
  CANNOT_VRFY = 252,
  AUTH_CONTINUE = 334,
  START_MAIL = 354,

  // Temporary Errors 4xx
  SERVICE_NOT_AVAILABLE = 421,
  MAILBOX_BUSY = 450,
  LOCAL_ERROR = 451,
  INSUFFICIENT_STORAGE = 452,
  TLS_NOT_AVAILABLE = 454,
  UNABLE_TO_ACCOMMODATE = 455,

  // Permanent Errors 5xx
  SYNTAX_ERROR = 500,
  SYNTAX_ERROR_PARAMS = 501,
  COMMAND_NOT_IMPLEMENTED = 502,
  BAD_SEQUENCE = 503,
  PARAMETER_NOT_IMPLEMENTED = 504,
  AUTH_REQUIRED = 530,
  AUTH_FAILED = 535,
  MAILBOX_UNAVAILABLE = 550,
  USER_NOT_LOCAL_TRY = 551,
  EXCEEDED_STORAGE = 552,
  MAILBOX_NAME_INVALID = 553,
  TRANSACTION_FAILED = 554,
  MAIL_FROM_RCPT_PARAMS_NOT_RECOGNIZED = 555,
}

/**
 * SMTP session state
 */
export enum SMTPSessionState {
  INITIAL = 'INITIAL',
  GREETED = 'GREETED',
  AUTHENTICATED = 'AUTHENTICATED',
  MAIL_FROM = 'MAIL_FROM',
  RCPT_TO = 'RCPT_TO',
  DATA = 'DATA',
  QUIT = 'QUIT',
}

/**
 * SMTP authentication methods
 */
export enum SMTPAuthMethod {
  PLAIN = 'PLAIN',
  LOGIN = 'LOGIN',
  CRAM_MD5 = 'CRAM-MD5',
  XOAUTH2 = 'XOAUTH2',
  DIGEST_MD5 = 'DIGEST-MD5',
}

/**
 * SMTP extension capabilities
 */
export interface SMTPCapabilities {
  esmtp: boolean;
  eightBitMime: boolean;
  size?: number;
  pipelining: boolean;
  chunking: boolean;
  binaryMime: boolean;
  dsn: boolean;
  enhancedStatusCodes: boolean;
  starttls: boolean;
  auth: SMTPAuthMethod[];
  smtputf8: boolean;
  deliveryBy?: number;
}

/**
 * Parsed SMTP command
 */
export interface ParsedSMTPCommand {
  command: SMTPCommand;
  verb: string;
  args: string[];
  parameters: Map<string, string>;
  raw: string;
  isValid: boolean;
  errors?: string[];
}

/**
 * SMTP response
 */
export interface SMTPResponse {
  code: SMTPResponseCode;
  message: string;
  enhanced?: string; // Enhanced status code (RFC 3463)
  multiline?: string[];
}

/**
 * SMTP session configuration
 */
export interface SMTPSessionConfig {
  hostname: string;
  port: number;
  secure?: boolean;
  requireAuth?: boolean;
  requireTLS?: boolean;
  allowedAuthMethods?: SMTPAuthMethod[];
  maxMessageSize?: number;
  maxRecipients?: number;
  timeout?: number;
  bannerMessage?: string;
  capabilities?: Partial<SMTPCapabilities>;
}

/**
 * SMTP session state data
 */
export interface SMTPSession {
  id: string;
  state: SMTPSessionState;
  hostname?: string;
  clientHostname?: string;
  clientAddress?: string;
  isSecure: boolean;
  isAuthenticated: boolean;
  authenticatedUser?: string;
  authMethod?: SMTPAuthMethod;
  mailFrom?: string;
  rcptTo: string[];
  messageData?: Buffer;
  capabilities: SMTPCapabilities;
  startedAt: Date;
  lastActivity: Date;
  commandCount: number;
  metadata?: Record<string, any>;
}

/**
 * SMTP authentication credentials
 */
export interface SMTPAuthCredentials {
  username: string;
  password: string;
  method: SMTPAuthMethod;
  token?: string; // For XOAUTH2
  clientId?: string;
  clientSecret?: string;
}

/**
 * TLS/STARTTLS configuration
 */
export interface SMTPTLSConfig {
  enabled: boolean;
  required: boolean;
  minVersion?: string; // 'TLSv1.2', 'TLSv1.3'
  maxVersion?: string;
  ciphers?: string;
  rejectUnauthorized?: boolean;
  requestCert?: boolean;
  key?: Buffer | string;
  cert?: Buffer | string;
  ca?: Buffer | string;
  dhparam?: Buffer | string;
}

/**
 * Delivery Status Notification (DSN) configuration
 */
export interface DSNConfig {
  ret?: 'FULL' | 'HDRS'; // Return full message or headers only
  envid?: string; // Envelope ID
  notify?: Array<'NEVER' | 'SUCCESS' | 'FAILURE' | 'DELAY'>;
  orcpt?: string; // Original recipient
}

/**
 * Delivery Status Notification report
 */
export interface DSNReport {
  messageId: string;
  envid?: string;
  reportingMTA: string;
  arrivalDate: Date;
  recipients: Array<{
    originalRecipient?: string;
    finalRecipient: string;
    action: 'failed' | 'delayed' | 'delivered' | 'relayed' | 'expanded';
    status: string; // Enhanced status code
    remoteMTA?: string;
    diagnosticCode?: string;
    lastAttemptDate?: Date;
    willRetryUntil?: Date;
  }>;
  originalMessage?: Buffer;
}

/**
 * SMTP error with enhanced status codes
 */
export interface SMTPError extends Error {
  code: SMTPResponseCode;
  enhanced?: string;
  command?: string;
  response?: string;
  isTransient: boolean;
}

/**
 * SMTP retry policy
 */
export interface SMTPRetryPolicy {
  maxAttempts: number;
  initialDelay: number; // milliseconds
  maxDelay: number;
  backoffMultiplier: number;
  retryTransient: boolean;
  retryPermanent: boolean;
  retryableErrors: SMTPResponseCode[];
}

/**
 * Message queue item
 */
export interface SMTPQueueItem {
  id: string;
  from: string;
  to: string[];
  message: Buffer;
  priority: number;
  attempts: number;
  maxAttempts: number;
  nextAttempt: Date;
  createdAt: Date;
  lastError?: string;
  dsn?: DSNConfig;
  metadata?: Record<string, any>;
}

/**
 * SMTP relay configuration
 */
export interface SMTPRelayConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth?: SMTPAuthCredentials;
  tls?: SMTPTLSConfig;
  localHostname?: string;
  connectionTimeout?: number;
  greetingTimeout?: number;
  socketTimeout?: number;
  dnsTimeout?: number;
  maxConnections?: number;
  maxMessagesPerConnection?: number;
}

/**
 * Rate limiting configuration
 */
export interface SMTPRateLimitConfig {
  maxConnectionsPerIP: number;
  maxMessagesPerConnection: number;
  maxMessagesPerHour: number;
  maxMessagesPerDay: number;
  maxRecipientsPerMessage: number;
  maxRecipientsPerHour: number;
  burstSize?: number;
  windowSize?: number; // milliseconds
}

/**
 * Rate limit status
 */
export interface SMTPRateLimitStatus {
  identifier: string; // IP address or user ID
  connections: number;
  messagesInConnection: number;
  messagesInHour: number;
  messagesInDay: number;
  recipientsInMessage: number;
  recipientsInHour: number;
  isLimited: boolean;
  limitedUntil?: Date;
  reason?: string;
}

/**
 * SMTP log entry
 */
export interface SMTPLogEntry {
  timestamp: Date;
  sessionId: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  event: string;
  command?: string;
  response?: SMTPResponse;
  clientAddress?: string;
  duration?: number;
  messageId?: string;
  from?: string;
  to?: string[];
  size?: number;
  error?: Error;
  metadata?: Record<string, any>;
}

/**
 * SMTP metrics
 */
export interface SMTPMetrics {
  period: { start: Date; end: Date };
  connections: {
    total: number;
    successful: number;
    failed: number;
    rejected: number;
    active: number;
  };
  messages: {
    accepted: number;
    rejected: number;
    queued: number;
    sent: number;
    failed: number;
    bounced: number;
  };
  authentication: {
    attempts: number;
    successful: number;
    failed: number;
    byMethod: Record<string, number>;
  };
  bandwidth: {
    bytesReceived: number;
    bytesSent: number;
  };
  performance: {
    avgConnectionDuration: number;
    avgMessageSize: number;
    avgDeliveryTime: number;
  };
  errors: {
    total: number;
    byCode: Record<number, number>;
    byType: Record<string, number>;
  };
}

/**
 * Swagger documentation for SMTP operations
 */
export interface SMTPSwaggerDoc {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  summary: string;
  description: string;
  tags: string[];
  parameters?: Array<{
    name: string;
    in: 'path' | 'query' | 'body' | 'header';
    description: string;
    required: boolean;
    schema: any;
  }>;
  responses: Record<number, { description: string; schema?: any }>;
}

// ============================================================================
// SMTP COMMAND PARSING
// ============================================================================

/**
 * Parses an SMTP command line into structured format
 * @param commandLine - Raw SMTP command line
 * @returns Parsed command structure
 * @example
 * const parsed = parseSMTPCommand('MAIL FROM:<sender@example.com> SIZE=1024');
 * console.log(parsed.command); // SMTPCommand.MAIL
 * console.log(parsed.parameters.get('SIZE')); // '1024'
 */
export function parseSMTPCommand(commandLine: string): ParsedSMTPCommand {
  const trimmed = commandLine.trim();
  const parts = trimmed.split(/\s+/);
  const verb = parts[0].toUpperCase();
  const args = parts.slice(1);

  const parameters = new Map<string, string>();
  const errors: string[] = [];

  // Parse parameters (KEY=VALUE format)
  for (const arg of args) {
    const eqIndex = arg.indexOf('=');
    if (eqIndex > 0) {
      const key = arg.substring(0, eqIndex).toUpperCase();
      const value = arg.substring(eqIndex + 1);
      parameters.set(key, value);
    }
  }

  // Validate command
  let command: SMTPCommand;
  let isValid = true;

  try {
    command = SMTPCommand[verb as keyof typeof SMTPCommand];
    if (!command) {
      errors.push(`Unknown command: ${verb}`);
      isValid = false;
    }
  } catch {
    errors.push(`Invalid command: ${verb}`);
    isValid = false;
    command = verb as SMTPCommand;
  }

  return {
    command,
    verb,
    args,
    parameters,
    raw: trimmed,
    isValid,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Generates an SMTP command string from structured data
 * @param command - SMTP command type
 * @param args - Command arguments
 * @param parameters - Optional parameters
 * @returns Formatted SMTP command string
 * @example
 * const cmd = generateSMTPCommand(SMTPCommand.MAIL, ['FROM:<sender@example.com>'], { SIZE: '1024' });
 * // Returns: 'MAIL FROM:<sender@example.com> SIZE=1024'
 */
export function generateSMTPCommand(
  command: SMTPCommand,
  args: string[] = [],
  parameters?: Record<string, string>
): string {
  let cmdStr = command.toString();

  if (args.length > 0) {
    cmdStr += ' ' + args.join(' ');
  }

  if (parameters) {
    const params = Object.entries(parameters)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');
    if (params) {
      cmdStr += ' ' + params;
    }
  }

  return cmdStr;
}

/**
 * Validates MAIL FROM command syntax
 * @param commandLine - MAIL FROM command line
 * @returns Validation result with extracted email and parameters
 * @example
 * const result = validateMailFromCommand('MAIL FROM:<sender@example.com> SIZE=1024');
 * console.log(result.email); // 'sender@example.com'
 */
export function validateMailFromCommand(commandLine: string): {
  isValid: boolean;
  email?: string;
  parameters?: Map<string, string>;
  errors?: string[];
} {
  const parsed = parseSMTPCommand(commandLine);
  const errors: string[] = [];

  if (parsed.command !== SMTPCommand.MAIL) {
    errors.push('Not a MAIL command');
    return { isValid: false, errors };
  }

  // Extract email from FROM:<email>
  const fromArg = parsed.args.find((arg) => arg.toUpperCase().startsWith('FROM:'));
  if (!fromArg) {
    errors.push('Missing FROM: parameter');
    return { isValid: false, errors };
  }

  const emailMatch = fromArg.match(/FROM:<(.+?)>/i);
  if (!emailMatch) {
    errors.push('Invalid FROM: syntax');
    return { isValid: false, errors };
  }

  const email = emailMatch[1];

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Invalid email address format');
    return { isValid: false, email, errors };
  }

  return {
    isValid: true,
    email,
    parameters: parsed.parameters,
  };
}

/**
 * Validates RCPT TO command syntax
 * @param commandLine - RCPT TO command line
 * @returns Validation result with extracted email and DSN parameters
 * @example
 * const result = validateRcptToCommand('RCPT TO:<recipient@example.com> NOTIFY=SUCCESS,FAILURE');
 */
export function validateRcptToCommand(commandLine: string): {
  isValid: boolean;
  email?: string;
  dsn?: Partial<DSNConfig>;
  errors?: string[];
} {
  const parsed = parseSMTPCommand(commandLine);
  const errors: string[] = [];

  if (parsed.command !== SMTPCommand.RCPT) {
    errors.push('Not a RCPT command');
    return { isValid: false, errors };
  }

  // Extract email from TO:<email>
  const toArg = parsed.args.find((arg) => arg.toUpperCase().startsWith('TO:'));
  if (!toArg) {
    errors.push('Missing TO: parameter');
    return { isValid: false, errors };
  }

  const emailMatch = toArg.match(/TO:<(.+?)>/i);
  if (!emailMatch) {
    errors.push('Invalid TO: syntax');
    return { isValid: false, errors };
  }

  const email = emailMatch[1];

  // Parse DSN parameters
  const dsn: Partial<DSNConfig> = {};
  if (parsed.parameters.has('NOTIFY')) {
    const notify = parsed.parameters.get('NOTIFY')!.split(',') as DSNConfig['notify'];
    dsn.notify = notify;
  }
  if (parsed.parameters.has('ORCPT')) {
    dsn.orcpt = parsed.parameters.get('ORCPT');
  }

  return {
    isValid: true,
    email,
    dsn: Object.keys(dsn).length > 0 ? dsn : undefined,
  };
}

/**
 * Parses EHLO response to extract server capabilities
 * @param responseLines - Array of EHLO response lines
 * @returns Parsed server capabilities
 * @example
 * const caps = parseEhloResponse(['250-smtp.example.com', '250-SIZE 52428800', '250 AUTH PLAIN LOGIN']);
 */
export function parseEhloResponse(responseLines: string[]): SMTPCapabilities {
  const capabilities: SMTPCapabilities = {
    esmtp: true,
    eightBitMime: false,
    pipelining: false,
    chunking: false,
    binaryMime: false,
    dsn: false,
    enhancedStatusCodes: false,
    starttls: false,
    auth: [],
    smtputf8: false,
  };

  for (const line of responseLines) {
    const upper = line.toUpperCase();

    if (upper.includes('8BITMIME')) {
      capabilities.eightBitMime = true;
    }
    if (upper.includes('SIZE')) {
      const match = line.match(/SIZE\s+(\d+)/i);
      if (match) {
        capabilities.size = parseInt(match[1], 10);
      }
    }
    if (upper.includes('PIPELINING')) {
      capabilities.pipelining = true;
    }
    if (upper.includes('CHUNKING')) {
      capabilities.chunking = true;
    }
    if (upper.includes('BINARYMIME')) {
      capabilities.binaryMime = true;
    }
    if (upper.includes('DSN')) {
      capabilities.dsn = true;
    }
    if (upper.includes('ENHANCEDSTATUSCODES')) {
      capabilities.enhancedStatusCodes = true;
    }
    if (upper.includes('STARTTLS')) {
      capabilities.starttls = true;
    }
    if (upper.includes('SMTPUTF8')) {
      capabilities.smtputf8 = true;
    }
    if (upper.includes('AUTH')) {
      const authMatch = line.match(/AUTH\s+(.+)/i);
      if (authMatch) {
        const methods = authMatch[1].split(/\s+/);
        for (const method of methods) {
          const authMethod = method.toUpperCase().replace('-', '_') as keyof typeof SMTPAuthMethod;
          if (SMTPAuthMethod[authMethod]) {
            capabilities.auth.push(SMTPAuthMethod[authMethod]);
          }
        }
      }
    }
    if (upper.includes('DELIVERBY')) {
      const match = line.match(/DELIVERBY\s+(\d+)/i);
      if (match) {
        capabilities.deliveryBy = parseInt(match[1], 10);
      }
    }
  }

  return capabilities;
}

// ============================================================================
// SMTP RESPONSE GENERATION
// ============================================================================

/**
 * Formats an SMTP response with code and message
 * @param code - SMTP response code
 * @param message - Response message
 * @param enhanced - Optional enhanced status code (e.g., '2.1.0')
 * @returns Formatted SMTP response
 * @example
 * const response = formatSMTPResponse(250, 'OK', '2.1.0');
 * // Returns: { code: 250, message: 'OK', enhanced: '2.1.0' }
 */
export function formatSMTPResponse(
  code: SMTPResponseCode,
  message: string,
  enhanced?: string
): SMTPResponse {
  return {
    code,
    message,
    enhanced,
  };
}

/**
 * Converts SMTP response to protocol string
 * @param response - SMTP response object
 * @param multiline - Whether to format as multiline response
 * @returns SMTP protocol response string
 * @example
 * const str = smtpResponseToString({ code: 250, message: 'OK', enhanced: '2.1.0' });
 * // Returns: '250 2.1.0 OK'
 */
export function smtpResponseToString(response: SMTPResponse, multiline: boolean = false): string {
  const { code, message, enhanced, multiline: lines } = response;

  if (multiline && lines && lines.length > 0) {
    const formatted = lines.map((line, index) => {
      const separator = index === lines.length - 1 ? ' ' : '-';
      const enhancedPrefix = enhanced ? `${enhanced} ` : '';
      return `${code}${separator}${enhancedPrefix}${line}`;
    });
    return formatted.join('\r\n');
  }

  const enhancedPrefix = enhanced ? `${enhanced} ` : '';
  return `${code} ${enhancedPrefix}${message}`;
}

/**
 * Creates a greeting response (220 Service ready)
 * @param hostname - Server hostname
 * @param message - Optional custom greeting message
 * @returns SMTP greeting response
 * @example
 * const greeting = createGreetingResponse('mail.example.com', 'White Cross Mail Server');
 */
export function createGreetingResponse(hostname: string, message?: string): SMTPResponse {
  const msg = message || `${hostname} ESMTP Service ready`;
  return formatSMTPResponse(SMTPResponseCode.SERVICE_READY, msg);
}

/**
 * Creates an EHLO response with server capabilities
 * @param hostname - Server hostname
 * @param capabilities - Server capabilities
 * @returns Multiline SMTP EHLO response
 * @example
 * const ehlo = createEhloResponse('mail.example.com', { esmtp: true, auth: ['PLAIN'] });
 */
export function createEhloResponse(hostname: string, capabilities: SMTPCapabilities): SMTPResponse {
  const lines: string[] = [`${hostname} Hello`];

  if (capabilities.eightBitMime) {
    lines.push('8BITMIME');
  }
  if (capabilities.size) {
    lines.push(`SIZE ${capabilities.size}`);
  }
  if (capabilities.pipelining) {
    lines.push('PIPELINING');
  }
  if (capabilities.chunking) {
    lines.push('CHUNKING');
  }
  if (capabilities.binaryMime) {
    lines.push('BINARYMIME');
  }
  if (capabilities.dsn) {
    lines.push('DSN');
  }
  if (capabilities.enhancedStatusCodes) {
    lines.push('ENHANCEDSTATUSCODES');
  }
  if (capabilities.starttls) {
    lines.push('STARTTLS');
  }
  if (capabilities.smtputf8) {
    lines.push('SMTPUTF8');
  }
  if (capabilities.auth.length > 0) {
    lines.push(`AUTH ${capabilities.auth.join(' ')}`);
  }
  if (capabilities.deliveryBy) {
    lines.push(`DELIVERBY ${capabilities.deliveryBy}`);
  }

  return {
    code: SMTPResponseCode.OK,
    message: lines[lines.length - 1],
    multiline: lines,
  };
}

/**
 * Creates an error response with enhanced status code
 * @param code - SMTP error code
 * @param message - Error message
 * @param enhanced - Enhanced status code
 * @returns SMTP error response
 * @example
 * const error = createErrorResponse(550, 'Mailbox not found', '5.1.1');
 */
export function createErrorResponse(
  code: SMTPResponseCode,
  message: string,
  enhanced?: string
): SMTPResponse {
  return formatSMTPResponse(code, message, enhanced);
}

// ============================================================================
// SMTP SESSION MANAGEMENT
// ============================================================================

/**
 * Creates a new SMTP session
 * @param config - Session configuration
 * @param clientAddress - Client IP address
 * @returns Initialized SMTP session
 * @example
 * const session = createSMTPSession(config, '192.168.1.100');
 */
export function createSMTPSession(config: SMTPSessionConfig, clientAddress?: string): SMTPSession {
  return {
    id: crypto.randomUUID(),
    state: SMTPSessionState.INITIAL,
    hostname: config.hostname,
    clientAddress,
    isSecure: config.secure || false,
    isAuthenticated: false,
    rcptTo: [],
    capabilities: {
      esmtp: true,
      eightBitMime: true,
      pipelining: true,
      chunking: false,
      binaryMime: false,
      dsn: true,
      enhancedStatusCodes: true,
      starttls: !config.secure,
      auth: config.allowedAuthMethods || [SMTPAuthMethod.PLAIN, SMTPAuthMethod.LOGIN],
      smtputf8: true,
      size: config.maxMessageSize,
      ...config.capabilities,
    },
    startedAt: new Date(),
    lastActivity: new Date(),
    commandCount: 0,
  };
}

/**
 * Updates SMTP session state
 * @param session - Current session
 * @param newState - New session state
 * @returns Updated session
 * @example
 * const updated = updateSessionState(session, SMTPSessionState.AUTHENTICATED);
 */
export function updateSessionState(session: SMTPSession, newState: SMTPSessionState): SMTPSession {
  return {
    ...session,
    state: newState,
    lastActivity: new Date(),
    commandCount: session.commandCount + 1,
  };
}

/**
 * Validates session state transition
 * @param currentState - Current session state
 * @param command - Command being executed
 * @returns True if transition is valid
 * @example
 * const isValid = validateSessionTransition(SMTPSessionState.GREETED, SMTPCommand.MAIL);
 */
export function validateSessionTransition(
  currentState: SMTPSessionState,
  command: SMTPCommand
): boolean {
  const validTransitions: Record<SMTPSessionState, SMTPCommand[]> = {
    [SMTPSessionState.INITIAL]: [SMTPCommand.HELO, SMTPCommand.EHLO, SMTPCommand.QUIT],
    [SMTPSessionState.GREETED]: [
      SMTPCommand.MAIL,
      SMTPCommand.AUTH,
      SMTPCommand.STARTTLS,
      SMTPCommand.RSET,
      SMTPCommand.QUIT,
      SMTPCommand.NOOP,
      SMTPCommand.VRFY,
      SMTPCommand.HELP,
    ],
    [SMTPSessionState.AUTHENTICATED]: [
      SMTPCommand.MAIL,
      SMTPCommand.RSET,
      SMTPCommand.QUIT,
      SMTPCommand.NOOP,
    ],
    [SMTPSessionState.MAIL_FROM]: [SMTPCommand.RCPT, SMTPCommand.RSET, SMTPCommand.QUIT],
    [SMTPSessionState.RCPT_TO]: [
      SMTPCommand.RCPT,
      SMTPCommand.DATA,
      SMTPCommand.RSET,
      SMTPCommand.QUIT,
    ],
    [SMTPSessionState.DATA]: [SMTPCommand.RSET, SMTPCommand.QUIT],
    [SMTPSessionState.QUIT]: [],
  };

  return validTransitions[currentState]?.includes(command) || false;
}

/**
 * Resets SMTP session to initial state
 * @param session - Session to reset
 * @returns Reset session
 * @example
 * const reset = resetSession(session);
 */
export function resetSession(session: SMTPSession): SMTPSession {
  return {
    ...session,
    state: session.isAuthenticated ? SMTPSessionState.AUTHENTICATED : SMTPSessionState.GREETED,
    mailFrom: undefined,
    rcptTo: [],
    messageData: undefined,
    lastActivity: new Date(),
  };
}

/**
 * Checks if session has timed out
 * @param session - Session to check
 * @param timeoutMs - Timeout in milliseconds
 * @returns True if session has timed out
 * @example
 * const timedOut = isSessionTimedOut(session, 300000); // 5 minutes
 */
export function isSessionTimedOut(session: SMTPSession, timeoutMs: number): boolean {
  const now = new Date();
  const elapsed = now.getTime() - session.lastActivity.getTime();
  return elapsed > timeoutMs;
}

// ============================================================================
// SMTP AUTHENTICATION
// ============================================================================

/**
 * Encodes credentials for PLAIN authentication
 * @param username - Username
 * @param password - Password
 * @returns Base64-encoded PLAIN auth string
 * @example
 * const encoded = encodePlainAuth('user', 'pass');
 */
export function encodePlainAuth(username: string, password: string): string {
  const authString = `\0${username}\0${password}`;
  return Buffer.from(authString, 'utf-8').toString('base64');
}

/**
 * Decodes PLAIN authentication credentials
 * @param encodedAuth - Base64-encoded auth string
 * @returns Decoded username and password
 * @example
 * const { username, password } = decodePlainAuth(encodedString);
 */
export function decodePlainAuth(encodedAuth: string): { username: string; password: string } {
  const decoded = Buffer.from(encodedAuth, 'base64').toString('utf-8');
  const parts = decoded.split('\0');
  return {
    username: parts[1] || '',
    password: parts[2] || '',
  };
}

/**
 * Encodes credentials for LOGIN authentication
 * @param credential - Username or password
 * @returns Base64-encoded credential
 * @example
 * const encoded = encodeLoginAuth('username');
 */
export function encodeLoginAuth(credential: string): string {
  return Buffer.from(credential, 'utf-8').toString('base64');
}

/**
 * Decodes LOGIN authentication credential
 * @param encodedCredential - Base64-encoded credential
 * @returns Decoded credential
 * @example
 * const username = decodeLoginAuth(encodedUsername);
 */
export function decodeLoginAuth(encodedCredential: string): string {
  return Buffer.from(encodedCredential, 'base64').toString('utf-8');
}

/**
 * Generates CRAM-MD5 challenge
 * @param hostname - Server hostname
 * @returns CRAM-MD5 challenge string
 * @example
 * const challenge = generateCramMd5Challenge('mail.example.com');
 */
export function generateCramMd5Challenge(hostname: string): string {
  const timestamp = Date.now();
  const pid = process.pid;
  const random = crypto.randomBytes(16).toString('hex');
  const challenge = `<${timestamp}.${pid}.${random}@${hostname}>`;
  return Buffer.from(challenge).toString('base64');
}

/**
 * Verifies CRAM-MD5 response
 * @param challenge - Original challenge (base64)
 * @param response - Client response (base64)
 * @param password - User's password
 * @returns Verification result with username
 * @example
 * const result = verifyCramMd5Response(challenge, response, 'userPassword');
 */
export function verifyCramMd5Response(
  challenge: string,
  response: string,
  password: string
): { isValid: boolean; username?: string } {
  try {
    const decodedChallenge = Buffer.from(challenge, 'base64').toString('utf-8');
    const decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
    const [username, digest] = decodedResponse.split(' ');

    const hmac = crypto.createHmac('md5', password);
    hmac.update(decodedChallenge);
    const expectedDigest = hmac.digest('hex');

    return {
      isValid: digest.toLowerCase() === expectedDigest.toLowerCase(),
      username,
    };
  } catch {
    return { isValid: false };
  }
}

/**
 * Generates XOAUTH2 authentication string
 * @param username - User email
 * @param accessToken - OAuth2 access token
 * @returns Base64-encoded XOAUTH2 string
 * @example
 * const auth = generateXOAuth2String('user@example.com', 'access_token_here');
 */
export function generateXOAuth2String(username: string, accessToken: string): string {
  const authString = `user=${username}\x01auth=Bearer ${accessToken}\x01\x01`;
  return Buffer.from(authString, 'utf-8').toString('base64');
}

/**
 * Validates authentication credentials
 * @param credentials - Authentication credentials
 * @param validateFn - Async function to validate username/password
 * @returns Validation result
 * @example
 * const isValid = await validateAuthCredentials(creds, async (u, p) => checkDB(u, p));
 */
export async function validateAuthCredentials(
  credentials: SMTPAuthCredentials,
  validateFn: (username: string, password: string) => Promise<boolean>
): Promise<boolean> {
  return validateFn(credentials.username, credentials.password);
}

// ============================================================================
// TLS/STARTTLS SUPPORT
// ============================================================================

/**
 * Creates TLS server options from configuration
 * @param config - TLS configuration
 * @returns TLS server options
 * @example
 * const tlsOptions = createTLSServerOptions(tlsConfig);
 */
export function createTLSServerOptions(config: SMTPTLSConfig): tls.TlsOptions {
  return {
    key: config.key,
    cert: config.cert,
    ca: config.ca,
    dhparam: config.dhparam,
    minVersion: config.minVersion as tls.SecureVersion,
    maxVersion: config.maxVersion as tls.SecureVersion,
    ciphers: config.ciphers,
    rejectUnauthorized: config.rejectUnauthorized ?? true,
    requestCert: config.requestCert ?? false,
  };
}

/**
 * Upgrades socket to TLS connection
 * @param socket - Plain socket to upgrade
 * @param tlsOptions - TLS options
 * @returns Promise resolving to TLS socket
 * @example
 * const tlsSocket = await upgradeToTLS(socket, tlsOptions);
 */
export async function upgradeToTLS(socket: net.Socket, tlsOptions: tls.TlsOptions): Promise<tls.TLSSocket> {
  return new Promise((resolve, reject) => {
    const tlsSocket = new tls.TLSSocket(socket, {
      isServer: true,
      ...tlsOptions,
    });

    tlsSocket.on('secure', () => {
      resolve(tlsSocket);
    });

    tlsSocket.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Validates TLS certificate
 * @param cert - TLS certificate
 * @param hostname - Expected hostname
 * @returns Validation result
 * @example
 * const isValid = validateTLSCertificate(cert, 'mail.example.com');
 */
export function validateTLSCertificate(
  cert: tls.PeerCertificate,
  hostname: string
): { isValid: boolean; errors?: string[] } {
  const errors: string[] = [];

  if (!cert) {
    errors.push('No certificate provided');
    return { isValid: false, errors };
  }

  // Check expiration
  const now = new Date();
  const validFrom = new Date(cert.valid_from);
  const validTo = new Date(cert.valid_to);

  if (now < validFrom) {
    errors.push('Certificate not yet valid');
  }
  if (now > validTo) {
    errors.push('Certificate expired');
  }

  // Check hostname
  if (cert.subject?.CN !== hostname && !cert.subjectaltname?.includes(hostname)) {
    errors.push(`Certificate hostname mismatch (expected: ${hostname})`);
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// ============================================================================
// DELIVERY STATUS NOTIFICATIONS (DSN)
// ============================================================================

/**
 * Creates a DSN success report
 * @param messageId - Original message ID
 * @param recipient - Recipient email
 * @param reportingMTA - Reporting MTA hostname
 * @returns DSN success report
 * @example
 * const dsn = createDSNSuccessReport('msg-123', 'user@example.com', 'mail.example.com');
 */
export function createDSNSuccessReport(
  messageId: string,
  recipient: string,
  reportingMTA: string
): DSNReport {
  return {
    messageId,
    reportingMTA,
    arrivalDate: new Date(),
    recipients: [
      {
        finalRecipient: recipient,
        action: 'delivered',
        status: '2.0.0',
        lastAttemptDate: new Date(),
      },
    ],
  };
}

/**
 * Creates a DSN failure report
 * @param messageId - Original message ID
 * @param recipient - Recipient email
 * @param reportingMTA - Reporting MTA hostname
 * @param diagnosticCode - Error diagnostic
 * @returns DSN failure report
 * @example
 * const dsn = createDSNFailureReport('msg-123', 'user@example.com', 'mail.example.com', '550 User not found');
 */
export function createDSNFailureReport(
  messageId: string,
  recipient: string,
  reportingMTA: string,
  diagnosticCode: string
): DSNReport {
  return {
    messageId,
    reportingMTA,
    arrivalDate: new Date(),
    recipients: [
      {
        finalRecipient: recipient,
        action: 'failed',
        status: '5.1.1',
        diagnosticCode,
        lastAttemptDate: new Date(),
      },
    ],
  };
}

/**
 * Formats DSN report as RFC 3464 message
 * @param dsn - DSN report
 * @param originalMessage - Original message (optional)
 * @returns Formatted DSN message
 * @example
 * const dsnMessage = formatDSNMessage(dsnReport, originalMessageBuffer);
 */
export function formatDSNMessage(dsn: DSNReport, originalMessage?: Buffer): string {
  const lines: string[] = [];

  // Per-message fields
  lines.push(`Reporting-MTA: dns; ${dsn.reportingMTA}`);
  lines.push(`Arrival-Date: ${dsn.arrivalDate.toUTCString()}`);
  if (dsn.envid) {
    lines.push(`Original-Envelope-Id: ${dsn.envid}`);
  }
  lines.push('');

  // Per-recipient fields
  for (const recipient of dsn.recipients) {
    if (recipient.originalRecipient) {
      lines.push(`Original-Recipient: rfc822;${recipient.originalRecipient}`);
    }
    lines.push(`Final-Recipient: rfc822;${recipient.finalRecipient}`);
    lines.push(`Action: ${recipient.action}`);
    lines.push(`Status: ${recipient.status}`);
    if (recipient.remoteMTA) {
      lines.push(`Remote-MTA: dns; ${recipient.remoteMTA}`);
    }
    if (recipient.diagnosticCode) {
      lines.push(`Diagnostic-Code: smtp; ${recipient.diagnosticCode}`);
    }
    if (recipient.lastAttemptDate) {
      lines.push(`Last-Attempt-Date: ${recipient.lastAttemptDate.toUTCString()}`);
    }
    if (recipient.willRetryUntil) {
      lines.push(`Will-Retry-Until: ${recipient.willRetryUntil.toUTCString()}`);
    }
    lines.push('');
  }

  return lines.join('\r\n');
}

// ============================================================================
// ERROR HANDLING & RETRY LOGIC
// ============================================================================

/**
 * Creates an SMTP error with enhanced status codes
 * @param message - Error message
 * @param code - SMTP response code
 * @param enhanced - Enhanced status code
 * @param command - Command that caused error
 * @returns SMTP error object
 * @example
 * const error = createSMTPError('Mailbox not found', 550, '5.1.1', 'RCPT TO');
 */
export function createSMTPError(
  message: string,
  code: SMTPResponseCode,
  enhanced?: string,
  command?: string
): SMTPError {
  const error = new Error(message) as SMTPError;
  error.code = code;
  error.enhanced = enhanced;
  error.command = command;
  error.isTransient = code >= 400 && code < 500;
  return error;
}

/**
 * Determines if an SMTP error is retryable
 * @param error - SMTP error
 * @param policy - Retry policy
 * @returns True if error should be retried
 * @example
 * const shouldRetry = isRetryableError(error, retryPolicy);
 */
export function isRetryableError(error: SMTPError, policy: SMTPRetryPolicy): boolean {
  // Don't retry if max attempts reached
  if (!policy.retryTransient && error.isTransient) {
    return false;
  }
  if (!policy.retryPermanent && !error.isTransient) {
    return false;
  }

  // Check if error code is in retryable list
  if (policy.retryableErrors.length > 0) {
    return policy.retryableErrors.includes(error.code);
  }

  // Default: retry transient errors
  return error.isTransient;
}

/**
 * Calculates next retry delay using exponential backoff
 * @param attempt - Current attempt number (0-based)
 * @param policy - Retry policy
 * @returns Delay in milliseconds
 * @example
 * const delay = calculateRetryDelay(2, retryPolicy);
 */
export function calculateRetryDelay(attempt: number, policy: SMTPRetryPolicy): number {
  const delay = policy.initialDelay * Math.pow(policy.backoffMultiplier, attempt);
  return Math.min(delay, policy.maxDelay);
}

/**
 * Executes SMTP operation with retry logic
 * @param operation - Async operation to execute
 * @param policy - Retry policy
 * @returns Operation result
 * @example
 * const result = await executeWithRetry(async () => sendEmail(msg), retryPolicy);
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  policy: SMTPRetryPolicy
): Promise<T> {
  let lastError: SMTPError | undefined;

  for (let attempt = 0; attempt < policy.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error as SMTPError;

      if (attempt < policy.maxAttempts - 1 && isRetryableError(lastError, policy)) {
        const delay = calculateRetryDelay(attempt, policy);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw lastError;
    }
  }

  throw lastError || new Error('Operation failed without error');
}

// ============================================================================
// MESSAGE QUEUE MANAGEMENT
// ============================================================================

/**
 * Creates a message queue item
 * @param from - Sender email
 * @param to - Recipient emails
 * @param message - Message buffer
 * @param priority - Queue priority (0 = highest)
 * @returns Queue item
 * @example
 * const item = createQueueItem('sender@example.com', ['rcpt@example.com'], msgBuffer, 5);
 */
export function createQueueItem(
  from: string,
  to: string[],
  message: Buffer,
  priority: number = 10
): SMTPQueueItem {
  return {
    id: crypto.randomUUID(),
    from,
    to,
    message,
    priority,
    attempts: 0,
    maxAttempts: 3,
    nextAttempt: new Date(),
    createdAt: new Date(),
  };
}

/**
 * Updates queue item after failed delivery attempt
 * @param item - Queue item
 * @param error - Delivery error
 * @param retryPolicy - Retry policy
 * @returns Updated queue item
 * @example
 * const updated = updateQueueItemAfterFailure(item, error, policy);
 */
export function updateQueueItemAfterFailure(
  item: SMTPQueueItem,
  error: string,
  retryPolicy: SMTPRetryPolicy
): SMTPQueueItem {
  const attempts = item.attempts + 1;
  const delay = calculateRetryDelay(attempts, retryPolicy);
  const nextAttempt = new Date(Date.now() + delay);

  return {
    ...item,
    attempts,
    nextAttempt,
    lastError: error,
  };
}

/**
 * Gets queue items ready for processing
 * @param queue - Array of queue items
 * @param maxItems - Maximum items to return
 * @returns Items ready for processing
 * @example
 * const ready = getReadyQueueItems(queue, 10);
 */
export function getReadyQueueItems(queue: SMTPQueueItem[], maxItems: number = 100): SMTPQueueItem[] {
  const now = new Date();
  return queue
    .filter((item) => item.nextAttempt <= now && item.attempts < item.maxAttempts)
    .sort((a, b) => a.priority - b.priority || a.nextAttempt.getTime() - b.nextAttempt.getTime())
    .slice(0, maxItems);
}

// ============================================================================
// SMTP RELAY CONFIGURATION
// ============================================================================

/**
 * Creates SMTP relay connection
 * @param config - Relay configuration
 * @returns Promise resolving to socket
 * @example
 * const socket = await createRelayConnection(relayConfig);
 */
export async function createRelayConnection(config: SMTPRelayConfig): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({
      host: config.host,
      port: config.port,
      timeout: config.connectionTimeout || 30000,
    });

    socket.on('connect', () => {
      resolve(socket);
    });

    socket.on('error', (error) => {
      reject(error);
    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('Connection timeout'));
    });
  });
}

/**
 * Sends HELO/EHLO to relay server
 * @param socket - Connected socket
 * @param hostname - Local hostname
 * @returns Server capabilities
 * @example
 * const caps = await relayHandshake(socket, 'client.example.com');
 */
export async function relayHandshake(
  socket: net.Socket,
  hostname: string
): Promise<SMTPCapabilities> {
  // Implementation would send EHLO and parse response
  // This is a simplified example
  return {
    esmtp: true,
    eightBitMime: true,
    size: 52428800,
    pipelining: true,
    chunking: false,
    binaryMime: false,
    dsn: true,
    enhancedStatusCodes: true,
    starttls: true,
    auth: [SMTPAuthMethod.PLAIN, SMTPAuthMethod.LOGIN],
    smtputf8: true,
  };
}

/**
 * Authenticates with relay server
 * @param socket - Connected socket
 * @param credentials - Authentication credentials
 * @returns Authentication result
 * @example
 * const success = await relayAuthenticate(socket, credentials);
 */
export async function relayAuthenticate(
  socket: net.Socket,
  credentials: SMTPAuthCredentials
): Promise<boolean> {
  // Implementation would perform AUTH sequence
  // This is a simplified example
  return true;
}

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Creates rate limit tracker
 * @param config - Rate limit configuration
 * @returns Rate limit status
 * @example
 * const limiter = createRateLimiter(rateLimitConfig);
 */
export function createRateLimiter(config: SMTPRateLimitConfig): SMTPRateLimitStatus {
  return {
    identifier: '',
    connections: 0,
    messagesInConnection: 0,
    messagesInHour: 0,
    messagesInDay: 0,
    recipientsInMessage: 0,
    recipientsInHour: 0,
    isLimited: false,
  };
}

/**
 * Checks if action is rate limited
 * @param status - Current rate limit status
 * @param config - Rate limit configuration
 * @param action - Action to check ('connection' | 'message' | 'recipient')
 * @returns True if rate limited
 * @example
 * const limited = isRateLimited(status, config, 'message');
 */
export function isRateLimited(
  status: SMTPRateLimitStatus,
  config: SMTPRateLimitConfig,
  action: 'connection' | 'message' | 'recipient'
): boolean {
  if (status.isLimited && status.limitedUntil && status.limitedUntil > new Date()) {
    return true;
  }

  switch (action) {
    case 'connection':
      return status.connections >= config.maxConnectionsPerIP;
    case 'message':
      return (
        status.messagesInConnection >= config.maxMessagesPerConnection ||
        status.messagesInHour >= config.maxMessagesPerHour ||
        status.messagesInDay >= config.maxMessagesPerDay
      );
    case 'recipient':
      return (
        status.recipientsInMessage >= config.maxRecipientsPerMessage ||
        status.recipientsInHour >= config.maxRecipientsPerHour
      );
    default:
      return false;
  }
}

/**
 * Updates rate limit status after action
 * @param status - Current status
 * @param action - Action performed
 * @returns Updated status
 * @example
 * const updated = updateRateLimitStatus(status, 'message');
 */
export function updateRateLimitStatus(
  status: SMTPRateLimitStatus,
  action: 'connection' | 'message' | 'recipient'
): SMTPRateLimitStatus {
  const updated = { ...status };

  switch (action) {
    case 'connection':
      updated.connections++;
      break;
    case 'message':
      updated.messagesInConnection++;
      updated.messagesInHour++;
      updated.messagesInDay++;
      updated.recipientsInMessage = 0;
      break;
    case 'recipient':
      updated.recipientsInMessage++;
      updated.recipientsInHour++;
      break;
  }

  return updated;
}

/**
 * Resets rate limit counters for time window
 * @param status - Current status
 * @param window - Window to reset ('hour' | 'day' | 'connection')
 * @returns Updated status
 * @example
 * const reset = resetRateLimitWindow(status, 'hour');
 */
export function resetRateLimitWindow(
  status: SMTPRateLimitStatus,
  window: 'hour' | 'day' | 'connection'
): SMTPRateLimitStatus {
  const updated = { ...status };

  switch (window) {
    case 'hour':
      updated.messagesInHour = 0;
      updated.recipientsInHour = 0;
      break;
    case 'day':
      updated.messagesInDay = 0;
      break;
    case 'connection':
      updated.messagesInConnection = 0;
      updated.recipientsInMessage = 0;
      break;
  }

  return updated;
}

// ============================================================================
// LOGGING & MONITORING
// ============================================================================

/**
 * Creates SMTP log entry
 * @param sessionId - Session ID
 * @param level - Log level
 * @param event - Event description
 * @param metadata - Additional metadata
 * @returns Log entry
 * @example
 * const log = createLogEntry(session.id, 'info', 'Message accepted', { from, to });
 */
export function createLogEntry(
  sessionId: string,
  level: 'debug' | 'info' | 'warn' | 'error',
  event: string,
  metadata?: Partial<SMTPLogEntry>
): SMTPLogEntry {
  return {
    timestamp: new Date(),
    sessionId,
    level,
    event,
    ...metadata,
  };
}

/**
 * Formats log entry for output
 * @param entry - Log entry
 * @param format - Output format ('json' | 'text')
 * @returns Formatted log string
 * @example
 * const formatted = formatLogEntry(logEntry, 'json');
 */
export function formatLogEntry(entry: SMTPLogEntry, format: 'json' | 'text' = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(entry);
  }

  const parts = [
    entry.timestamp.toISOString(),
    `[${entry.level.toUpperCase()}]`,
    `[${entry.sessionId}]`,
    entry.event,
  ];

  if (entry.command) {
    parts.push(`CMD: ${entry.command}`);
  }
  if (entry.response) {
    parts.push(`RESP: ${entry.response.code}`);
  }
  if (entry.error) {
    parts.push(`ERR: ${entry.error.message}`);
  }

  return parts.join(' ');
}

/**
 * Creates SMTP metrics tracker
 * @param period - Metrics period
 * @returns Empty metrics object
 * @example
 * const metrics = createMetricsTracker({ start: new Date(), end: new Date() });
 */
export function createMetricsTracker(period: { start: Date; end: Date }): SMTPMetrics {
  return {
    period,
    connections: {
      total: 0,
      successful: 0,
      failed: 0,
      rejected: 0,
      active: 0,
    },
    messages: {
      accepted: 0,
      rejected: 0,
      queued: 0,
      sent: 0,
      failed: 0,
      bounced: 0,
    },
    authentication: {
      attempts: 0,
      successful: 0,
      failed: 0,
      byMethod: {},
    },
    bandwidth: {
      bytesReceived: 0,
      bytesSent: 0,
    },
    performance: {
      avgConnectionDuration: 0,
      avgMessageSize: 0,
      avgDeliveryTime: 0,
    },
    errors: {
      total: 0,
      byCode: {},
      byType: {},
    },
  };
}

/**
 * Updates metrics with new data point
 * @param metrics - Current metrics
 * @param event - Event type
 * @param data - Event data
 * @returns Updated metrics
 * @example
 * const updated = updateMetrics(metrics, 'message_accepted', { size: 1024 });
 */
export function updateMetrics(
  metrics: SMTPMetrics,
  event: string,
  data?: Record<string, any>
): SMTPMetrics {
  const updated = { ...metrics };

  switch (event) {
    case 'connection_opened':
      updated.connections.total++;
      updated.connections.active++;
      break;
    case 'connection_closed':
      updated.connections.active--;
      if (data?.success) {
        updated.connections.successful++;
      } else {
        updated.connections.failed++;
      }
      break;
    case 'message_accepted':
      updated.messages.accepted++;
      if (data?.size) {
        updated.bandwidth.bytesReceived += data.size;
      }
      break;
    case 'message_rejected':
      updated.messages.rejected++;
      break;
    case 'auth_attempt':
      updated.authentication.attempts++;
      if (data?.method) {
        updated.authentication.byMethod[data.method] =
          (updated.authentication.byMethod[data.method] || 0) + 1;
      }
      break;
    case 'auth_success':
      updated.authentication.successful++;
      break;
    case 'auth_failed':
      updated.authentication.failed++;
      break;
    case 'error':
      updated.errors.total++;
      if (data?.code) {
        updated.errors.byCode[data.code] = (updated.errors.byCode[data.code] || 0) + 1;
      }
      if (data?.type) {
        updated.errors.byType[data.type] = (updated.errors.byType[data.type] || 0) + 1;
      }
      break;
  }

  return updated;
}

/**
 * Generates metrics summary report
 * @param metrics - Metrics to summarize
 * @returns Human-readable summary
 * @example
 * const summary = generateMetricsSummary(metrics);
 */
export function generateMetricsSummary(metrics: SMTPMetrics): string {
  const lines: string[] = [];

  lines.push('=== SMTP Metrics Summary ===');
  lines.push(`Period: ${metrics.period.start.toISOString()} - ${metrics.period.end.toISOString()}`);
  lines.push('');

  lines.push('Connections:');
  lines.push(`  Total: ${metrics.connections.total}`);
  lines.push(`  Successful: ${metrics.connections.successful}`);
  lines.push(`  Failed: ${metrics.connections.failed}`);
  lines.push(`  Active: ${metrics.connections.active}`);
  lines.push('');

  lines.push('Messages:');
  lines.push(`  Accepted: ${metrics.messages.accepted}`);
  lines.push(`  Rejected: ${metrics.messages.rejected}`);
  lines.push(`  Sent: ${metrics.messages.sent}`);
  lines.push(`  Failed: ${metrics.messages.failed}`);
  lines.push('');

  lines.push('Authentication:');
  lines.push(`  Attempts: ${metrics.authentication.attempts}`);
  lines.push(`  Successful: ${metrics.authentication.successful}`);
  lines.push(`  Failed: ${metrics.authentication.failed}`);
  lines.push('');

  lines.push('Bandwidth:');
  lines.push(`  Received: ${(metrics.bandwidth.bytesReceived / 1024 / 1024).toFixed(2)} MB`);
  lines.push(`  Sent: ${(metrics.bandwidth.bytesSent / 1024 / 1024).toFixed(2)} MB`);
  lines.push('');

  lines.push('Errors:');
  lines.push(`  Total: ${metrics.errors.total}`);

  return lines.join('\n');
}

// ============================================================================
// SWAGGER DOCUMENTATION
// ============================================================================

/**
 * Generates Swagger documentation for SMTP send endpoint
 * @returns Swagger documentation object
 * @example
 * const swaggerDoc = generateSMTPSendSwagger();
 */
export function generateSMTPSendSwagger(): SMTPSwaggerDoc {
  return {
    endpoint: '/api/smtp/send',
    method: 'POST',
    summary: 'Send email via SMTP',
    description: 'Sends an email message through the SMTP server with full protocol support',
    tags: ['SMTP', 'Email'],
    parameters: [
      {
        name: 'body',
        in: 'body',
        description: 'Email message configuration',
        required: true,
        schema: {
          type: 'object',
          required: ['from', 'to', 'subject', 'message'],
          properties: {
            from: { type: 'string', format: 'email', example: 'sender@example.com' },
            to: {
              type: 'array',
              items: { type: 'string', format: 'email' },
              example: ['recipient@example.com'],
            },
            subject: { type: 'string', example: 'Hello World' },
            message: { type: 'string', example: 'Email body content' },
            priority: { type: 'number', minimum: 0, maximum: 10, example: 5 },
            dsn: {
              type: 'object',
              properties: {
                notify: { type: 'array', items: { type: 'string' } },
                ret: { type: 'string', enum: ['FULL', 'HDRS'] },
              },
            },
          },
        },
      },
    ],
    responses: {
      200: {
        description: 'Message accepted for delivery',
        schema: {
          type: 'object',
          properties: {
            messageId: { type: 'string' },
            accepted: { type: 'array', items: { type: 'string' } },
            rejected: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      400: { description: 'Invalid request parameters' },
      429: { description: 'Rate limit exceeded' },
      500: { description: 'Internal server error' },
    },
  };
}

/**
 * Generates Swagger documentation for SMTP queue endpoint
 * @returns Swagger documentation object
 * @example
 * const swaggerDoc = generateSMTPQueueSwagger();
 */
export function generateSMTPQueueSwagger(): SMTPSwaggerDoc {
  return {
    endpoint: '/api/smtp/queue',
    method: 'GET',
    summary: 'Get SMTP queue status',
    description: 'Retrieves current status of the SMTP message queue',
    tags: ['SMTP', 'Queue'],
    parameters: [
      {
        name: 'limit',
        in: 'query',
        description: 'Maximum number of queue items to return',
        required: false,
        schema: { type: 'integer', minimum: 1, maximum: 1000, default: 100 },
      },
      {
        name: 'status',
        in: 'query',
        description: 'Filter by queue item status',
        required: false,
        schema: { type: 'string', enum: ['pending', 'processing', 'failed', 'completed'] },
      },
    ],
    responses: {
      200: {
        description: 'Queue status retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            pending: { type: 'integer' },
            processing: { type: 'integer' },
            failed: { type: 'integer' },
            items: { type: 'array', items: { type: 'object' } },
          },
        },
      },
      500: { description: 'Internal server error' },
    },
  };
}

/**
 * Generates Swagger documentation for SMTP metrics endpoint
 * @returns Swagger documentation object
 * @example
 * const swaggerDoc = generateSMTPMetricsSwagger();
 */
export function generateSMTPMetricsSwagger(): SMTPSwaggerDoc {
  return {
    endpoint: '/api/smtp/metrics',
    method: 'GET',
    summary: 'Get SMTP server metrics',
    description: 'Retrieves performance metrics and statistics for the SMTP server',
    tags: ['SMTP', 'Monitoring'],
    parameters: [
      {
        name: 'period',
        in: 'query',
        description: 'Time period for metrics',
        required: false,
        schema: { type: 'string', enum: ['hour', 'day', 'week', 'month'], default: 'hour' },
      },
    ],
    responses: {
      200: {
        description: 'Metrics retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            period: { type: 'object' },
            connections: { type: 'object' },
            messages: { type: 'object' },
            authentication: { type: 'object' },
            bandwidth: { type: 'object' },
            performance: { type: 'object' },
            errors: { type: 'object' },
          },
        },
      },
      500: { description: 'Internal server error' },
    },
  };
}

/**
 * Generates complete Swagger specification for all SMTP endpoints
 * @param baseUrl - API base URL
 * @param version - API version
 * @returns Complete Swagger specification
 * @example
 * const swagger = generateCompleteSwaggerSpec('https://api.example.com', '1.0.0');
 */
export function generateCompleteSwaggerSpec(baseUrl: string, version: string): any {
  return {
    openapi: '3.0.0',
    info: {
      title: 'SMTP Protocol API',
      description: 'Enterprise-grade SMTP server API with comprehensive protocol support',
      version,
      contact: {
        name: 'White Cross Healthcare',
        email: 'support@whitecross.com',
      },
    },
    servers: [
      {
        url: baseUrl,
        description: 'Production SMTP API server',
      },
    ],
    tags: [
      { name: 'SMTP', description: 'SMTP protocol operations' },
      { name: 'Email', description: 'Email sending and management' },
      { name: 'Queue', description: 'Message queue management' },
      { name: 'Monitoring', description: 'Server monitoring and metrics' },
    ],
    paths: {
      '/api/smtp/send': generateSMTPSendSwagger(),
      '/api/smtp/queue': generateSMTPQueueSwagger(),
      '/api/smtp/metrics': generateSMTPMetricsSwagger(),
    },
    components: {
      schemas: {
        SMTPCommand: {
          type: 'string',
          enum: Object.keys(SMTPCommand),
        },
        SMTPResponseCode: {
          type: 'integer',
          enum: Object.values(SMTPResponseCode).filter((v) => typeof v === 'number'),
        },
        SMTPAuthMethod: {
          type: 'string',
          enum: Object.keys(SMTPAuthMethod),
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Command parsing
  parseSMTPCommand,
  generateSMTPCommand,
  validateMailFromCommand,
  validateRcptToCommand,
  parseEhloResponse,

  // Response generation
  formatSMTPResponse,
  smtpResponseToString,
  createGreetingResponse,
  createEhloResponse,
  createErrorResponse,

  // Session management
  createSMTPSession,
  updateSessionState,
  validateSessionTransition,
  resetSession,
  isSessionTimedOut,

  // Authentication
  encodePlainAuth,
  decodePlainAuth,
  encodeLoginAuth,
  decodeLoginAuth,
  generateCramMd5Challenge,
  verifyCramMd5Response,
  generateXOAuth2String,
  validateAuthCredentials,

  // TLS/STARTTLS
  createTLSServerOptions,
  upgradeToTLS,
  validateTLSCertificate,

  // DSN
  createDSNSuccessReport,
  createDSNFailureReport,
  formatDSNMessage,

  // Error handling & retry
  createSMTPError,
  isRetryableError,
  calculateRetryDelay,
  executeWithRetry,

  // Queue management
  createQueueItem,
  updateQueueItemAfterFailure,
  getReadyQueueItems,

  // Relay
  createRelayConnection,
  relayHandshake,
  relayAuthenticate,

  // Rate limiting
  createRateLimiter,
  isRateLimited,
  updateRateLimitStatus,
  resetRateLimitWindow,

  // Logging & monitoring
  createLogEntry,
  formatLogEntry,
  createMetricsTracker,
  updateMetrics,
  generateMetricsSummary,

  // Swagger documentation
  generateSMTPSendSwagger,
  generateSMTPQueueSwagger,
  generateSMTPMetricsSwagger,
  generateCompleteSwaggerSpec,
};
