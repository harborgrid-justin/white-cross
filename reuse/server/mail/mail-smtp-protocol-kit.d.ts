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
import * as tls from 'tls';
import * as net from 'net';
/**
 * SMTP command types per RFC 5321
 */
export declare enum SMTPCommand {
    HELO = "HELO",
    EHLO = "EHLO",
    MAIL = "MAIL",
    RCPT = "RCPT",
    DATA = "DATA",
    RSET = "RSET",
    VRFY = "VRFY",
    EXPN = "EXPN",
    HELP = "HELP",
    NOOP = "NOOP",
    QUIT = "QUIT",
    STARTTLS = "STARTTLS",
    AUTH = "AUTH"
}
/**
 * SMTP response codes per RFC 5321
 */
export declare enum SMTPResponseCode {
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
    SERVICE_NOT_AVAILABLE = 421,
    MAILBOX_BUSY = 450,
    LOCAL_ERROR = 451,
    INSUFFICIENT_STORAGE = 452,
    TLS_NOT_AVAILABLE = 454,
    UNABLE_TO_ACCOMMODATE = 455,
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
    MAIL_FROM_RCPT_PARAMS_NOT_RECOGNIZED = 555
}
/**
 * SMTP session state
 */
export declare enum SMTPSessionState {
    INITIAL = "INITIAL",
    GREETED = "GREETED",
    AUTHENTICATED = "AUTHENTICATED",
    MAIL_FROM = "MAIL_FROM",
    RCPT_TO = "RCPT_TO",
    DATA = "DATA",
    QUIT = "QUIT"
}
/**
 * SMTP authentication methods
 */
export declare enum SMTPAuthMethod {
    PLAIN = "PLAIN",
    LOGIN = "LOGIN",
    CRAM_MD5 = "CRAM-MD5",
    XOAUTH2 = "XOAUTH2",
    DIGEST_MD5 = "DIGEST-MD5"
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
    enhanced?: string;
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
    token?: string;
    clientId?: string;
    clientSecret?: string;
}
/**
 * TLS/STARTTLS configuration
 */
export interface SMTPTLSConfig {
    enabled: boolean;
    required: boolean;
    minVersion?: string;
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
    ret?: 'FULL' | 'HDRS';
    envid?: string;
    notify?: Array<'NEVER' | 'SUCCESS' | 'FAILURE' | 'DELAY'>;
    orcpt?: string;
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
        status: string;
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
    initialDelay: number;
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
    windowSize?: number;
}
/**
 * Rate limit status
 */
export interface SMTPRateLimitStatus {
    identifier: string;
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
    period: {
        start: Date;
        end: Date;
    };
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
    responses: Record<number, {
        description: string;
        schema?: any;
    }>;
}
/**
 * Parses an SMTP command line into structured format
 * @param commandLine - Raw SMTP command line
 * @returns Parsed command structure
 * @example
 * const parsed = parseSMTPCommand('MAIL FROM:<sender@example.com> SIZE=1024');
 * console.log(parsed.command); // SMTPCommand.MAIL
 * console.log(parsed.parameters.get('SIZE')); // '1024'
 */
export declare function parseSMTPCommand(commandLine: string): ParsedSMTPCommand;
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
export declare function generateSMTPCommand(command: SMTPCommand, args?: string[], parameters?: Record<string, string>): string;
/**
 * Validates MAIL FROM command syntax
 * @param commandLine - MAIL FROM command line
 * @returns Validation result with extracted email and parameters
 * @example
 * const result = validateMailFromCommand('MAIL FROM:<sender@example.com> SIZE=1024');
 * console.log(result.email); // 'sender@example.com'
 */
export declare function validateMailFromCommand(commandLine: string): {
    isValid: boolean;
    email?: string;
    parameters?: Map<string, string>;
    errors?: string[];
};
/**
 * Validates RCPT TO command syntax
 * @param commandLine - RCPT TO command line
 * @returns Validation result with extracted email and DSN parameters
 * @example
 * const result = validateRcptToCommand('RCPT TO:<recipient@example.com> NOTIFY=SUCCESS,FAILURE');
 */
export declare function validateRcptToCommand(commandLine: string): {
    isValid: boolean;
    email?: string;
    dsn?: Partial<DSNConfig>;
    errors?: string[];
};
/**
 * Parses EHLO response to extract server capabilities
 * @param responseLines - Array of EHLO response lines
 * @returns Parsed server capabilities
 * @example
 * const caps = parseEhloResponse(['250-smtp.example.com', '250-SIZE 52428800', '250 AUTH PLAIN LOGIN']);
 */
export declare function parseEhloResponse(responseLines: string[]): SMTPCapabilities;
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
export declare function formatSMTPResponse(code: SMTPResponseCode, message: string, enhanced?: string): SMTPResponse;
/**
 * Converts SMTP response to protocol string
 * @param response - SMTP response object
 * @param multiline - Whether to format as multiline response
 * @returns SMTP protocol response string
 * @example
 * const str = smtpResponseToString({ code: 250, message: 'OK', enhanced: '2.1.0' });
 * // Returns: '250 2.1.0 OK'
 */
export declare function smtpResponseToString(response: SMTPResponse, multiline?: boolean): string;
/**
 * Creates a greeting response (220 Service ready)
 * @param hostname - Server hostname
 * @param message - Optional custom greeting message
 * @returns SMTP greeting response
 * @example
 * const greeting = createGreetingResponse('mail.example.com', 'White Cross Mail Server');
 */
export declare function createGreetingResponse(hostname: string, message?: string): SMTPResponse;
/**
 * Creates an EHLO response with server capabilities
 * @param hostname - Server hostname
 * @param capabilities - Server capabilities
 * @returns Multiline SMTP EHLO response
 * @example
 * const ehlo = createEhloResponse('mail.example.com', { esmtp: true, auth: ['PLAIN'] });
 */
export declare function createEhloResponse(hostname: string, capabilities: SMTPCapabilities): SMTPResponse;
/**
 * Creates an error response with enhanced status code
 * @param code - SMTP error code
 * @param message - Error message
 * @param enhanced - Enhanced status code
 * @returns SMTP error response
 * @example
 * const error = createErrorResponse(550, 'Mailbox not found', '5.1.1');
 */
export declare function createErrorResponse(code: SMTPResponseCode, message: string, enhanced?: string): SMTPResponse;
/**
 * Creates a new SMTP session
 * @param config - Session configuration
 * @param clientAddress - Client IP address
 * @returns Initialized SMTP session
 * @example
 * const session = createSMTPSession(config, '192.168.1.100');
 */
export declare function createSMTPSession(config: SMTPSessionConfig, clientAddress?: string): SMTPSession;
/**
 * Updates SMTP session state
 * @param session - Current session
 * @param newState - New session state
 * @returns Updated session
 * @example
 * const updated = updateSessionState(session, SMTPSessionState.AUTHENTICATED);
 */
export declare function updateSessionState(session: SMTPSession, newState: SMTPSessionState): SMTPSession;
/**
 * Validates session state transition
 * @param currentState - Current session state
 * @param command - Command being executed
 * @returns True if transition is valid
 * @example
 * const isValid = validateSessionTransition(SMTPSessionState.GREETED, SMTPCommand.MAIL);
 */
export declare function validateSessionTransition(currentState: SMTPSessionState, command: SMTPCommand): boolean;
/**
 * Resets SMTP session to initial state
 * @param session - Session to reset
 * @returns Reset session
 * @example
 * const reset = resetSession(session);
 */
export declare function resetSession(session: SMTPSession): SMTPSession;
/**
 * Checks if session has timed out
 * @param session - Session to check
 * @param timeoutMs - Timeout in milliseconds
 * @returns True if session has timed out
 * @example
 * const timedOut = isSessionTimedOut(session, 300000); // 5 minutes
 */
export declare function isSessionTimedOut(session: SMTPSession, timeoutMs: number): boolean;
/**
 * Encodes credentials for PLAIN authentication
 * @param username - Username
 * @param password - Password
 * @returns Base64-encoded PLAIN auth string
 * @example
 * const encoded = encodePlainAuth('user', 'pass');
 */
export declare function encodePlainAuth(username: string, password: string): string;
/**
 * Decodes PLAIN authentication credentials
 * @param encodedAuth - Base64-encoded auth string
 * @returns Decoded username and password
 * @example
 * const { username, password } = decodePlainAuth(encodedString);
 */
export declare function decodePlainAuth(encodedAuth: string): {
    username: string;
    password: string;
};
/**
 * Encodes credentials for LOGIN authentication
 * @param credential - Username or password
 * @returns Base64-encoded credential
 * @example
 * const encoded = encodeLoginAuth('username');
 */
export declare function encodeLoginAuth(credential: string): string;
/**
 * Decodes LOGIN authentication credential
 * @param encodedCredential - Base64-encoded credential
 * @returns Decoded credential
 * @example
 * const username = decodeLoginAuth(encodedUsername);
 */
export declare function decodeLoginAuth(encodedCredential: string): string;
/**
 * Generates CRAM-MD5 challenge
 * @param hostname - Server hostname
 * @returns CRAM-MD5 challenge string
 * @example
 * const challenge = generateCramMd5Challenge('mail.example.com');
 */
export declare function generateCramMd5Challenge(hostname: string): string;
/**
 * Verifies CRAM-MD5 response
 * @param challenge - Original challenge (base64)
 * @param response - Client response (base64)
 * @param password - User's password
 * @returns Verification result with username
 * @example
 * const result = verifyCramMd5Response(challenge, response, 'userPassword');
 */
export declare function verifyCramMd5Response(challenge: string, response: string, password: string): {
    isValid: boolean;
    username?: string;
};
/**
 * Generates XOAUTH2 authentication string
 * @param username - User email
 * @param accessToken - OAuth2 access token
 * @returns Base64-encoded XOAUTH2 string
 * @example
 * const auth = generateXOAuth2String('user@example.com', 'access_token_here');
 */
export declare function generateXOAuth2String(username: string, accessToken: string): string;
/**
 * Validates authentication credentials
 * @param credentials - Authentication credentials
 * @param validateFn - Async function to validate username/password
 * @returns Validation result
 * @example
 * const isValid = await validateAuthCredentials(creds, async (u, p) => checkDB(u, p));
 */
export declare function validateAuthCredentials(credentials: SMTPAuthCredentials, validateFn: (username: string, password: string) => Promise<boolean>): Promise<boolean>;
/**
 * Creates TLS server options from configuration
 * @param config - TLS configuration
 * @returns TLS server options
 * @example
 * const tlsOptions = createTLSServerOptions(tlsConfig);
 */
export declare function createTLSServerOptions(config: SMTPTLSConfig): tls.TlsOptions;
/**
 * Upgrades socket to TLS connection
 * @param socket - Plain socket to upgrade
 * @param tlsOptions - TLS options
 * @returns Promise resolving to TLS socket
 * @example
 * const tlsSocket = await upgradeToTLS(socket, tlsOptions);
 */
export declare function upgradeToTLS(socket: net.Socket, tlsOptions: tls.TlsOptions): Promise<tls.TLSSocket>;
/**
 * Validates TLS certificate
 * @param cert - TLS certificate
 * @param hostname - Expected hostname
 * @returns Validation result
 * @example
 * const isValid = validateTLSCertificate(cert, 'mail.example.com');
 */
export declare function validateTLSCertificate(cert: tls.PeerCertificate, hostname: string): {
    isValid: boolean;
    errors?: string[];
};
/**
 * Creates a DSN success report
 * @param messageId - Original message ID
 * @param recipient - Recipient email
 * @param reportingMTA - Reporting MTA hostname
 * @returns DSN success report
 * @example
 * const dsn = createDSNSuccessReport('msg-123', 'user@example.com', 'mail.example.com');
 */
export declare function createDSNSuccessReport(messageId: string, recipient: string, reportingMTA: string): DSNReport;
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
export declare function createDSNFailureReport(messageId: string, recipient: string, reportingMTA: string, diagnosticCode: string): DSNReport;
/**
 * Formats DSN report as RFC 3464 message
 * @param dsn - DSN report
 * @param originalMessage - Original message (optional)
 * @returns Formatted DSN message
 * @example
 * const dsnMessage = formatDSNMessage(dsnReport, originalMessageBuffer);
 */
export declare function formatDSNMessage(dsn: DSNReport, originalMessage?: Buffer): string;
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
export declare function createSMTPError(message: string, code: SMTPResponseCode, enhanced?: string, command?: string): SMTPError;
/**
 * Determines if an SMTP error is retryable
 * @param error - SMTP error
 * @param policy - Retry policy
 * @returns True if error should be retried
 * @example
 * const shouldRetry = isRetryableError(error, retryPolicy);
 */
export declare function isRetryableError(error: SMTPError, policy: SMTPRetryPolicy): boolean;
/**
 * Calculates next retry delay using exponential backoff
 * @param attempt - Current attempt number (0-based)
 * @param policy - Retry policy
 * @returns Delay in milliseconds
 * @example
 * const delay = calculateRetryDelay(2, retryPolicy);
 */
export declare function calculateRetryDelay(attempt: number, policy: SMTPRetryPolicy): number;
/**
 * Executes SMTP operation with retry logic
 * @param operation - Async operation to execute
 * @param policy - Retry policy
 * @returns Operation result
 * @example
 * const result = await executeWithRetry(async () => sendEmail(msg), retryPolicy);
 */
export declare function executeWithRetry<T>(operation: () => Promise<T>, policy: SMTPRetryPolicy): Promise<T>;
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
export declare function createQueueItem(from: string, to: string[], message: Buffer, priority?: number): SMTPQueueItem;
/**
 * Updates queue item after failed delivery attempt
 * @param item - Queue item
 * @param error - Delivery error
 * @param retryPolicy - Retry policy
 * @returns Updated queue item
 * @example
 * const updated = updateQueueItemAfterFailure(item, error, policy);
 */
export declare function updateQueueItemAfterFailure(item: SMTPQueueItem, error: string, retryPolicy: SMTPRetryPolicy): SMTPQueueItem;
/**
 * Gets queue items ready for processing
 * @param queue - Array of queue items
 * @param maxItems - Maximum items to return
 * @returns Items ready for processing
 * @example
 * const ready = getReadyQueueItems(queue, 10);
 */
export declare function getReadyQueueItems(queue: SMTPQueueItem[], maxItems?: number): SMTPQueueItem[];
/**
 * Creates SMTP relay connection
 * @param config - Relay configuration
 * @returns Promise resolving to socket
 * @example
 * const socket = await createRelayConnection(relayConfig);
 */
export declare function createRelayConnection(config: SMTPRelayConfig): Promise<net.Socket>;
/**
 * Sends HELO/EHLO to relay server
 * @param socket - Connected socket
 * @param hostname - Local hostname
 * @returns Server capabilities
 * @example
 * const caps = await relayHandshake(socket, 'client.example.com');
 */
export declare function relayHandshake(socket: net.Socket, hostname: string): Promise<SMTPCapabilities>;
/**
 * Authenticates with relay server
 * @param socket - Connected socket
 * @param credentials - Authentication credentials
 * @returns Authentication result
 * @example
 * const success = await relayAuthenticate(socket, credentials);
 */
export declare function relayAuthenticate(socket: net.Socket, credentials: SMTPAuthCredentials): Promise<boolean>;
/**
 * Creates rate limit tracker
 * @param config - Rate limit configuration
 * @returns Rate limit status
 * @example
 * const limiter = createRateLimiter(rateLimitConfig);
 */
export declare function createRateLimiter(config: SMTPRateLimitConfig): SMTPRateLimitStatus;
/**
 * Checks if action is rate limited
 * @param status - Current rate limit status
 * @param config - Rate limit configuration
 * @param action - Action to check ('connection' | 'message' | 'recipient')
 * @returns True if rate limited
 * @example
 * const limited = isRateLimited(status, config, 'message');
 */
export declare function isRateLimited(status: SMTPRateLimitStatus, config: SMTPRateLimitConfig, action: 'connection' | 'message' | 'recipient'): boolean;
/**
 * Updates rate limit status after action
 * @param status - Current status
 * @param action - Action performed
 * @returns Updated status
 * @example
 * const updated = updateRateLimitStatus(status, 'message');
 */
export declare function updateRateLimitStatus(status: SMTPRateLimitStatus, action: 'connection' | 'message' | 'recipient'): SMTPRateLimitStatus;
/**
 * Resets rate limit counters for time window
 * @param status - Current status
 * @param window - Window to reset ('hour' | 'day' | 'connection')
 * @returns Updated status
 * @example
 * const reset = resetRateLimitWindow(status, 'hour');
 */
export declare function resetRateLimitWindow(status: SMTPRateLimitStatus, window: 'hour' | 'day' | 'connection'): SMTPRateLimitStatus;
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
export declare function createLogEntry(sessionId: string, level: 'debug' | 'info' | 'warn' | 'error', event: string, metadata?: Partial<SMTPLogEntry>): SMTPLogEntry;
/**
 * Formats log entry for output
 * @param entry - Log entry
 * @param format - Output format ('json' | 'text')
 * @returns Formatted log string
 * @example
 * const formatted = formatLogEntry(logEntry, 'json');
 */
export declare function formatLogEntry(entry: SMTPLogEntry, format?: 'json' | 'text'): string;
/**
 * Creates SMTP metrics tracker
 * @param period - Metrics period
 * @returns Empty metrics object
 * @example
 * const metrics = createMetricsTracker({ start: new Date(), end: new Date() });
 */
export declare function createMetricsTracker(period: {
    start: Date;
    end: Date;
}): SMTPMetrics;
/**
 * Updates metrics with new data point
 * @param metrics - Current metrics
 * @param event - Event type
 * @param data - Event data
 * @returns Updated metrics
 * @example
 * const updated = updateMetrics(metrics, 'message_accepted', { size: 1024 });
 */
export declare function updateMetrics(metrics: SMTPMetrics, event: string, data?: Record<string, any>): SMTPMetrics;
/**
 * Generates metrics summary report
 * @param metrics - Metrics to summarize
 * @returns Human-readable summary
 * @example
 * const summary = generateMetricsSummary(metrics);
 */
export declare function generateMetricsSummary(metrics: SMTPMetrics): string;
/**
 * Generates Swagger documentation for SMTP send endpoint
 * @returns Swagger documentation object
 * @example
 * const swaggerDoc = generateSMTPSendSwagger();
 */
export declare function generateSMTPSendSwagger(): SMTPSwaggerDoc;
/**
 * Generates Swagger documentation for SMTP queue endpoint
 * @returns Swagger documentation object
 * @example
 * const swaggerDoc = generateSMTPQueueSwagger();
 */
export declare function generateSMTPQueueSwagger(): SMTPSwaggerDoc;
/**
 * Generates Swagger documentation for SMTP metrics endpoint
 * @returns Swagger documentation object
 * @example
 * const swaggerDoc = generateSMTPMetricsSwagger();
 */
export declare function generateSMTPMetricsSwagger(): SMTPSwaggerDoc;
/**
 * Generates complete Swagger specification for all SMTP endpoints
 * @param baseUrl - API base URL
 * @param version - API version
 * @returns Complete Swagger specification
 * @example
 * const swagger = generateCompleteSwaggerSpec('https://api.example.com', '1.0.0');
 */
export declare function generateCompleteSwaggerSpec(baseUrl: string, version: string): any;
declare const _default: {
    parseSMTPCommand: typeof parseSMTPCommand;
    generateSMTPCommand: typeof generateSMTPCommand;
    validateMailFromCommand: typeof validateMailFromCommand;
    validateRcptToCommand: typeof validateRcptToCommand;
    parseEhloResponse: typeof parseEhloResponse;
    formatSMTPResponse: typeof formatSMTPResponse;
    smtpResponseToString: typeof smtpResponseToString;
    createGreetingResponse: typeof createGreetingResponse;
    createEhloResponse: typeof createEhloResponse;
    createErrorResponse: typeof createErrorResponse;
    createSMTPSession: typeof createSMTPSession;
    updateSessionState: typeof updateSessionState;
    validateSessionTransition: typeof validateSessionTransition;
    resetSession: typeof resetSession;
    isSessionTimedOut: typeof isSessionTimedOut;
    encodePlainAuth: typeof encodePlainAuth;
    decodePlainAuth: typeof decodePlainAuth;
    encodeLoginAuth: typeof encodeLoginAuth;
    decodeLoginAuth: typeof decodeLoginAuth;
    generateCramMd5Challenge: typeof generateCramMd5Challenge;
    verifyCramMd5Response: typeof verifyCramMd5Response;
    generateXOAuth2String: typeof generateXOAuth2String;
    validateAuthCredentials: typeof validateAuthCredentials;
    createTLSServerOptions: typeof createTLSServerOptions;
    upgradeToTLS: typeof upgradeToTLS;
    validateTLSCertificate: typeof validateTLSCertificate;
    createDSNSuccessReport: typeof createDSNSuccessReport;
    createDSNFailureReport: typeof createDSNFailureReport;
    formatDSNMessage: typeof formatDSNMessage;
    createSMTPError: typeof createSMTPError;
    isRetryableError: typeof isRetryableError;
    calculateRetryDelay: typeof calculateRetryDelay;
    executeWithRetry: typeof executeWithRetry;
    createQueueItem: typeof createQueueItem;
    updateQueueItemAfterFailure: typeof updateQueueItemAfterFailure;
    getReadyQueueItems: typeof getReadyQueueItems;
    createRelayConnection: typeof createRelayConnection;
    relayHandshake: typeof relayHandshake;
    relayAuthenticate: typeof relayAuthenticate;
    createRateLimiter: typeof createRateLimiter;
    isRateLimited: typeof isRateLimited;
    updateRateLimitStatus: typeof updateRateLimitStatus;
    resetRateLimitWindow: typeof resetRateLimitWindow;
    createLogEntry: typeof createLogEntry;
    formatLogEntry: typeof formatLogEntry;
    createMetricsTracker: typeof createMetricsTracker;
    updateMetrics: typeof updateMetrics;
    generateMetricsSummary: typeof generateMetricsSummary;
    generateSMTPSendSwagger: typeof generateSMTPSendSwagger;
    generateSMTPQueueSwagger: typeof generateSMTPQueueSwagger;
    generateSMTPMetricsSwagger: typeof generateSMTPMetricsSwagger;
    generateCompleteSwaggerSpec: typeof generateCompleteSwaggerSpec;
};
export default _default;
//# sourceMappingURL=mail-smtp-protocol-kit.d.ts.map