/**
 * LOC: POP3-PROT-001
 * File: /reuse/server/mail/mail-pop3-protocol-kit.ts
 *
 * UPSTREAM (imports from):
 *   - crypto (node built-in)
 *   - tls (node built-in)
 *   - net (node built-in)
 *
 * DOWNSTREAM (imported by):
 *   - POP3 server implementations
 *   - Mail retrieval services
 *   - Legacy client support modules
 *   - Email sync services
 */
import * as tls from 'tls';
import * as net from 'net';
/**
 * POP3 session state
 */
export declare enum POP3State {
    AUTHORIZATION = "AUTHORIZATION",
    TRANSACTION = "TRANSACTION",
    UPDATE = "UPDATE",
    CLOSED = "CLOSED"
}
/**
 * POP3 command types
 */
export declare enum POP3Command {
    USER = "USER",
    PASS = "PASS",
    STAT = "STAT",
    LIST = "LIST",
    RETR = "RETR",
    DELE = "DELE",
    NOOP = "NOOP",
    RSET = "RSET",
    QUIT = "QUIT",
    TOP = "TOP",
    UIDL = "UIDL",
    APOP = "APOP",
    CAPA = "CAPA",
    STLS = "STLS",
    AUTH = "AUTH"
}
/**
 * POP3 session information
 */
export interface POP3Session {
    sessionId: string;
    state: POP3State;
    username?: string;
    authenticated: boolean;
    mailboxLocked: boolean;
    messages: POP3Message[];
    deletedMessages: Set<number>;
    timestamp: string;
    ipAddress?: string;
    tlsEnabled: boolean;
    authMethod?: 'USER/PASS' | 'APOP' | 'SASL';
    createdAt: Date;
    lastActivity: Date;
}
/**
 * POP3 message representation
 */
export interface POP3Message {
    messageNumber: number;
    messageId: string;
    uidl: string;
    size: number;
    deleted: boolean;
    content?: string;
    headers?: Record<string, string>;
    retrievedAt?: Date;
}
/**
 * Parsed POP3 command
 */
export interface ParsedPOP3Command {
    command: POP3Command;
    args: string[];
    rawCommand: string;
    valid: boolean;
    error?: string;
}
/**
 * POP3 response
 */
export interface POP3Response {
    status: '+OK' | '-ERR';
    message: string;
    data?: string | string[];
    multiline?: boolean;
}
/**
 * POP3 authentication credentials
 */
export interface POP3AuthCredentials {
    username: string;
    password?: string;
    digest?: string;
    timestamp?: string;
}
/**
 * POP3 mailbox statistics
 */
export interface POP3MailboxStats {
    messageCount: number;
    totalSize: number;
    deletedCount: number;
    availableMessages: number;
}
/**
 * POP3 capabilities
 */
export interface POP3Capabilities {
    TOP: boolean;
    UIDL: boolean;
    SASL: string[];
    EXPIRE: number | 'NEVER';
    'LOGIN-DELAY': number;
    'IMPLEMENTATION': string;
    STLS?: boolean;
    USER?: boolean;
}
/**
 * POP3 server configuration
 */
export interface POP3ServerConfig {
    hostname: string;
    port: number;
    tlsPort?: number;
    maxMessageSize: number;
    sessionTimeout: number;
    enableAPOP: boolean;
    enableSTLS: boolean;
    capabilities: POP3Capabilities;
    banner?: string;
}
/**
 * Mailbox lock information
 */
export interface MailboxLock {
    username: string;
    sessionId: string;
    acquiredAt: Date;
    expiresAt: Date;
    ipAddress?: string;
}
/**
 * POP3 message list entry
 */
export interface MessageListEntry {
    messageNumber: number;
    size: number;
    uidl?: string;
}
/**
 * UIDL mapping
 */
export interface UIDLMapping {
    messageNumber: number;
    uidl: string;
    messageId: string;
}
/**
 * TOP command result
 */
export interface TopCommandResult {
    headers: string;
    bodyLines: string[];
    totalLines: number;
}
/**
 * Parses raw POP3 command string into structured command object.
 *
 * @param {string} rawCommand - Raw command string from client
 * @returns {ParsedPOP3Command} Parsed command structure
 *
 * @example
 * ```typescript
 * const cmd = parsePOP3Command('USER alice@example.com');
 * // { command: POP3Command.USER, args: ['alice@example.com'], valid: true }
 * ```
 */
export declare const parsePOP3Command: (rawCommand: string) => ParsedPOP3Command;
/**
 * Validates USER command and extracts username.
 *
 * @param {string[]} args - Command arguments
 * @returns {{ valid: boolean; username?: string; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = parseUserCommand(['alice@example.com']);
 * // { valid: true, username: 'alice@example.com' }
 * ```
 */
export declare const parseUserCommand: (args: string[]) => {
    valid: boolean;
    username?: string;
    error?: string;
};
/**
 * Validates PASS command and extracts password.
 *
 * @param {string[]} args - Command arguments
 * @returns {{ valid: boolean; password?: string; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = parsePassCommand(['secretpassword']);
 * // { valid: true, password: 'secretpassword' }
 * ```
 */
export declare const parsePassCommand: (args: string[]) => {
    valid: boolean;
    password?: string;
    error?: string;
};
/**
 * Parses LIST command for message listing.
 *
 * @param {string[]} args - Command arguments
 * @returns {{ valid: boolean; messageNumber?: number; error?: string }} Parsed result
 *
 * @example
 * ```typescript
 * const result = parseListCommand(['3']);
 * // { valid: true, messageNumber: 3 }
 * ```
 */
export declare const parseListCommand: (args: string[]) => {
    valid: boolean;
    messageNumber?: number;
    error?: string;
};
/**
 * Parses RETR command for message retrieval.
 *
 * @param {string[]} args - Command arguments
 * @returns {{ valid: boolean; messageNumber?: number; error?: string }} Parsed result
 *
 * @example
 * ```typescript
 * const result = parseRetrCommand(['5']);
 * // { valid: true, messageNumber: 5 }
 * ```
 */
export declare const parseRetrCommand: (args: string[]) => {
    valid: boolean;
    messageNumber?: number;
    error?: string;
};
/**
 * Parses DELE command for message deletion.
 *
 * @param {string[]} args - Command arguments
 * @returns {{ valid: boolean; messageNumber?: number; error?: string }} Parsed result
 *
 * @example
 * ```typescript
 * const result = parseDeleCommand(['2']);
 * // { valid: true, messageNumber: 2 }
 * ```
 */
export declare const parseDeleCommand: (args: string[]) => {
    valid: boolean;
    messageNumber?: number;
    error?: string;
};
/**
 * Parses TOP command for header and partial body retrieval.
 *
 * @param {string[]} args - Command arguments [messageNumber, lineCount]
 * @returns {{ valid: boolean; messageNumber?: number; lineCount?: number; error?: string }} Parsed result
 *
 * @example
 * ```typescript
 * const result = parseTopCommand(['1', '10']);
 * // { valid: true, messageNumber: 1, lineCount: 10 }
 * ```
 */
export declare const parseTopCommand: (args: string[]) => {
    valid: boolean;
    messageNumber?: number;
    lineCount?: number;
    error?: string;
};
/**
 * Parses UIDL command for unique ID listing.
 *
 * @param {string[]} args - Command arguments
 * @returns {{ valid: boolean; messageNumber?: number; error?: string }} Parsed result
 *
 * @example
 * ```typescript
 * const result = parseUidlCommand(['3']);
 * // { valid: true, messageNumber: 3 }
 * ```
 */
export declare const parseUidlCommand: (args: string[]) => {
    valid: boolean;
    messageNumber?: number;
    error?: string;
};
/**
 * Parses APOP command for digest authentication.
 *
 * @param {string[]} args - Command arguments [username, digest]
 * @returns {{ valid: boolean; username?: string; digest?: string; error?: string }} Parsed result
 *
 * @example
 * ```typescript
 * const result = parseApopCommand(['alice', 'c4c9334bac560ecc979e58001b3e22fb']);
 * // { valid: true, username: 'alice', digest: 'c4c9334bac560ecc979e58001b3e22fb' }
 * ```
 */
export declare const parseApopCommand: (args: string[]) => {
    valid: boolean;
    username?: string;
    digest?: string;
    error?: string;
};
/**
 * Creates a new POP3 session with default state.
 *
 * @param {string} ipAddress - Client IP address
 * @returns {POP3Session} New session object
 *
 * @example
 * ```typescript
 * const session = createPOP3Session('192.168.1.100');
 * console.log(session.state); // POP3State.AUTHORIZATION
 * ```
 */
export declare const createPOP3Session: (ipAddress?: string) => POP3Session;
/**
 * Generates RFC-compliant POP3 timestamp for APOP.
 *
 * @returns {string} Timestamp in format <process-id.clock@hostname>
 *
 * @example
 * ```typescript
 * const timestamp = generatePOP3Timestamp();
 * // '<1234.5678@mail.example.com>'
 * ```
 */
export declare const generatePOP3Timestamp: () => string;
/**
 * Updates session state and activity timestamp.
 *
 * @param {POP3Session} session - Session to update
 * @param {POP3State} newState - New state
 * @returns {POP3Session} Updated session
 *
 * @example
 * ```typescript
 * session = updateSessionState(session, POP3State.TRANSACTION);
 * ```
 */
export declare const updateSessionState: (session: POP3Session, newState: POP3State) => POP3Session;
/**
 * Validates session state allows specific command.
 *
 * @param {POP3Session} session - Current session
 * @param {POP3Command} command - Command to validate
 * @returns {boolean} True if command allowed in current state
 *
 * @example
 * ```typescript
 * const canRetr = validateSessionCommand(session, POP3Command.RETR);
 * // Returns true only in TRANSACTION state
 * ```
 */
export declare const validateSessionCommand: (session: POP3Session, command: POP3Command) => boolean;
/**
 * Loads messages into session from mailbox.
 *
 * @param {POP3Session} session - Session to load messages into
 * @param {POP3Message[]} messages - Messages from mailbox
 * @returns {POP3Session} Session with loaded messages
 *
 * @example
 * ```typescript
 * session = loadMessagesIntoSession(session, mailboxMessages);
 * console.log(session.messages.length); // Number of messages
 * ```
 */
export declare const loadMessagesIntoSession: (session: POP3Session, messages: POP3Message[]) => POP3Session;
/**
 * Cleans up session and releases resources.
 *
 * @param {POP3Session} session - Session to cleanup
 * @returns {POP3Session} Cleaned session
 *
 * @example
 * ```typescript
 * session = cleanupSession(session);
 * console.log(session.state); // POP3State.CLOSED
 * ```
 */
export declare const cleanupSession: (session: POP3Session) => POP3Session;
/**
 * Authenticates user with USER/PASS mechanism.
 *
 * @param {string} username - Username
 * @param {string} password - Password
 * @param {Function} validateCredentials - Async validation function
 * @returns {Promise<boolean>} True if authenticated
 *
 * @example
 * ```typescript
 * const authenticated = await authenticateUserPass(
 *   'alice@example.com',
 *   'password123',
 *   async (user, pass) => checkDatabase(user, pass)
 * );
 * ```
 */
export declare const authenticateUserPass: (username: string, password: string, validateCredentials: (username: string, password: string) => Promise<boolean>) => Promise<boolean>;
/**
 * Computes APOP digest for authentication.
 *
 * @param {string} timestamp - Server timestamp
 * @param {string} password - User password
 * @returns {string} MD5 digest
 *
 * @example
 * ```typescript
 * const digest = computeAPOPDigest('<123.456@mail>', 'password');
 * // 'c4c9334bac560ecc979e58001b3e22fb'
 * ```
 */
export declare const computeAPOPDigest: (timestamp: string, password: string) => string;
/**
 * Authenticates user with APOP mechanism.
 *
 * @param {string} username - Username
 * @param {string} clientDigest - Client-provided digest
 * @param {string} timestamp - Server timestamp
 * @param {Function} getPassword - Function to retrieve user password
 * @returns {Promise<boolean>} True if authenticated
 *
 * @example
 * ```typescript
 * const authenticated = await authenticateAPOP(
 *   'alice',
 *   'c4c9334bac560ecc979e58001b3e22fb',
 *   '<123.456@mail>',
 *   async (user) => getUserPassword(user)
 * );
 * ```
 */
export declare const authenticateAPOP: (username: string, clientDigest: string, timestamp: string, getPassword: (username: string) => Promise<string>) => Promise<boolean>;
/**
 * Validates authentication credentials format.
 *
 * @param {POP3AuthCredentials} credentials - Credentials to validate
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateAuthCredentials({ username: 'alice', password: 'pass' });
 * // { valid: true }
 * ```
 */
export declare const validateAuthCredentials: (credentials: POP3AuthCredentials) => {
    valid: boolean;
    error?: string;
};
/**
 * Retrieves message by number from session.
 *
 * @param {POP3Session} session - Current session
 * @param {number} messageNumber - Message number (1-based)
 * @returns {POP3Message | null} Message or null if not found
 *
 * @example
 * ```typescript
 * const message = retrieveMessage(session, 3);
 * if (message && !message.deleted) {
 *   console.log(message.content);
 * }
 * ```
 */
export declare const retrieveMessage: (session: POP3Session, messageNumber: number) => POP3Message | null;
/**
 * Gets mailbox statistics (message count and total size).
 *
 * @param {POP3Session} session - Current session
 * @returns {POP3MailboxStats} Mailbox statistics
 *
 * @example
 * ```typescript
 * const stats = getMailboxStats(session);
 * console.log(`${stats.messageCount} messages (${stats.totalSize} octets)`);
 * ```
 */
export declare const getMailboxStats: (session: POP3Session) => POP3MailboxStats;
/**
 * Generates message list for LIST command.
 *
 * @param {POP3Session} session - Current session
 * @param {number} [messageNumber] - Specific message or undefined for all
 * @returns {MessageListEntry[]} List of message entries
 *
 * @example
 * ```typescript
 * const list = generateMessageList(session);
 * // [{ messageNumber: 1, size: 1024 }, { messageNumber: 2, size: 2048 }]
 * ```
 */
export declare const generateMessageList: (session: POP3Session, messageNumber?: number) => MessageListEntry[];
/**
 * Marks message as deleted in session.
 *
 * @param {POP3Session} session - Current session
 * @param {number} messageNumber - Message number to delete
 * @returns {POP3Session} Updated session
 *
 * @example
 * ```typescript
 * session = markMessageDeleted(session, 5);
 * ```
 */
export declare const markMessageDeleted: (session: POP3Session, messageNumber: number) => POP3Session;
/**
 * Resets all deletion marks in session.
 *
 * @param {POP3Session} session - Current session
 * @returns {POP3Session} Session with deletions reset
 *
 * @example
 * ```typescript
 * session = resetDeletions(session);
 * // All DELE marks are cleared
 * ```
 */
export declare const resetDeletions: (session: POP3Session) => POP3Session;
/**
 * Generates UIDL (Unique ID Listing) for messages.
 *
 * @param {POP3Session} session - Current session
 * @param {number} [messageNumber] - Specific message or undefined for all
 * @returns {UIDLMapping[]} UIDL mappings
 *
 * @example
 * ```typescript
 * const uidls = generateUIDLList(session);
 * // [{ messageNumber: 1, uidl: 'abc123...', messageId: 'msg-1' }]
 * ```
 */
export declare const generateUIDLList: (session: POP3Session, messageNumber?: number) => UIDLMapping[];
/**
 * Generates unique UIDL identifier for a message.
 *
 * @param {string} messageId - Message ID
 * @param {string} username - Username
 * @returns {string} UIDL string
 *
 * @example
 * ```typescript
 * const uidl = generateUIDL('msg-12345', 'alice@example.com');
 * // 'a1b2c3d4e5f6...'
 * ```
 */
export declare const generateUIDL: (messageId: string, username: string) => string;
/**
 * Validates UIDL format.
 *
 * @param {string} uidl - UIDL to validate
 * @returns {boolean} True if valid format
 *
 * @example
 * ```typescript
 * const valid = validateUIDL('a1b2c3d4e5f6789012345678901234');
 * // true
 * ```
 */
export declare const validateUIDL: (uidl: string) => boolean;
/**
 * Retrieves message headers and n lines of body (TOP command).
 *
 * @param {POP3Session} session - Current session
 * @param {number} messageNumber - Message number
 * @param {number} lineCount - Number of body lines to retrieve
 * @returns {TopCommandResult | null} Headers and partial body
 *
 * @example
 * ```typescript
 * const top = retrieveMessageTop(session, 1, 10);
 * // Returns headers + first 10 lines of body
 * ```
 */
export declare const retrieveMessageTop: (session: POP3Session, messageNumber: number, lineCount: number) => TopCommandResult | null;
/**
 * Extracts headers from message content.
 *
 * @param {string} content - Message content
 * @returns {Record<string, string>} Parsed headers
 *
 * @example
 * ```typescript
 * const headers = extractMessageHeaders(messageContent);
 * console.log(headers['Subject']); // 'Important Message'
 * ```
 */
export declare const extractMessageHeaders: (content: string) => Record<string, string>;
/**
 * Acquires exclusive lock on mailbox for session.
 *
 * @param {string} username - Username/mailbox
 * @param {string} sessionId - Session ID
 * @param {number} ttl - Lock TTL in seconds
 * @returns {MailboxLock} Lock information
 *
 * @example
 * ```typescript
 * const lock = acquireMailboxLock('alice@example.com', session.sessionId, 300);
 * console.log(`Lock expires at ${lock.expiresAt}`);
 * ```
 */
export declare const acquireMailboxLock: (username: string, sessionId: string, ttl?: number) => MailboxLock;
/**
 * Releases mailbox lock.
 *
 * @param {MailboxLock} lock - Lock to release
 * @returns {boolean} True if released successfully
 *
 * @example
 * ```typescript
 * const released = releaseMailboxLock(lock);
 * ```
 */
export declare const releaseMailboxLock: (lock: MailboxLock) => boolean;
/**
 * Checks if mailbox lock is still valid.
 *
 * @param {MailboxLock} lock - Lock to check
 * @returns {boolean} True if lock is valid
 *
 * @example
 * ```typescript
 * if (!isLockValid(lock)) {
 *   lock = acquireMailboxLock(username, sessionId);
 * }
 * ```
 */
export declare const isLockValid: (lock: MailboxLock) => boolean;
/**
 * Validates mailbox is locked by specific session.
 *
 * @param {MailboxLock} lock - Current lock
 * @param {string} sessionId - Session ID to check
 * @returns {boolean} True if locked by session
 *
 * @example
 * ```typescript
 * if (!validateLockOwnership(lock, session.sessionId)) {
 *   return createErrorResponse('Mailbox locked by another session');
 * }
 * ```
 */
export declare const validateLockOwnership: (lock: MailboxLock, sessionId: string) => boolean;
/**
 * Creates TLS options for POP3S.
 *
 * @param {string} certPath - Path to certificate
 * @param {string} keyPath - Path to private key
 * @returns {tls.TlsOptions} TLS configuration
 *
 * @example
 * ```typescript
 * const tlsOptions = createTLSOptions('/path/to/cert.pem', '/path/to/key.pem');
 * const server = tls.createServer(tlsOptions, handleConnection);
 * ```
 */
export declare const createTLSOptions: (certPath: string, keyPath: string) => tls.TlsOptions;
/**
 * Upgrades connection to TLS (STLS command).
 *
 * @param {net.Socket} socket - Plain socket
 * @param {tls.TlsOptions} tlsOptions - TLS options
 * @returns {Promise<tls.TLSSocket>} Upgraded TLS socket
 *
 * @example
 * ```typescript
 * const tlsSocket = await upgradeToTLS(socket, tlsOptions);
 * session.tlsEnabled = true;
 * ```
 */
export declare const upgradeToTLS: (socket: net.Socket, tlsOptions: tls.TlsOptions) => Promise<tls.TLSSocket>;
/**
 * Validates TLS is available for session.
 *
 * @param {POP3Session} session - Current session
 * @param {POP3ServerConfig} config - Server configuration
 * @returns {boolean} True if TLS can be enabled
 *
 * @example
 * ```typescript
 * if (canEnableTLS(session, serverConfig)) {
 *   await upgradeToTLS(socket, tlsOptions);
 * }
 * ```
 */
export declare const canEnableTLS: (session: POP3Session, config: POP3ServerConfig) => boolean;
/**
 * Creates successful POP3 response (+OK).
 *
 * @param {string} message - Response message
 * @param {string | string[]} [data] - Optional response data
 * @returns {POP3Response} Response object
 *
 * @example
 * ```typescript
 * const response = createOKResponse('2 messages (320 octets)');
 * // '+OK 2 messages (320 octets)\r\n'
 * ```
 */
export declare const createOKResponse: (message: string, data?: string | string[]) => POP3Response;
/**
 * Creates error POP3 response (-ERR).
 *
 * @param {string} message - Error message
 * @returns {POP3Response} Error response
 *
 * @example
 * ```typescript
 * const response = createErrorResponse('No such message');
 * // '-ERR No such message\r\n'
 * ```
 */
export declare const createErrorResponse: (message: string) => POP3Response;
/**
 * Formats POP3 response as protocol string.
 *
 * @param {POP3Response} response - Response object
 * @returns {string} Formatted response string
 *
 * @example
 * ```typescript
 * const formatted = formatPOP3Response(response);
 * socket.write(formatted);
 * ```
 */
export declare const formatPOP3Response: (response: POP3Response) => string;
/**
 * Creates greeting banner for new connection.
 *
 * @param {POP3ServerConfig} config - Server configuration
 * @param {string} timestamp - Session timestamp
 * @returns {string} Greeting banner
 *
 * @example
 * ```typescript
 * const banner = createGreetingBanner(config, session.timestamp);
 * // '+OK White Cross POP3 Server ready <123.456@mail>\r\n'
 * ```
 */
export declare const createGreetingBanner: (config: POP3ServerConfig, timestamp: string) => string;
/**
 * Validates command is allowed in current state and returns error if not.
 *
 * @param {POP3Session} session - Current session
 * @param {POP3Command} command - Command to validate
 * @returns {POP3Response | null} Error response or null if valid
 *
 * @example
 * ```typescript
 * const error = validateCommandForState(session, command);
 * if (error) {
 *   return error;
 * }
 * ```
 */
export declare const validateCommandForState: (session: POP3Session, command: POP3Command) => POP3Response | null;
/**
 * Gets POP3 server capabilities list.
 *
 * @param {POP3Capabilities} capabilities - Server capabilities
 * @returns {string[]} Capabilities list
 *
 * @example
 * ```typescript
 * const caps = getCapabilitiesList(serverConfig.capabilities);
 * // ['TOP', 'UIDL', 'SASL PLAIN', 'IMPLEMENTATION White Cross']
 * ```
 */
export declare const getCapabilitiesList: (capabilities: POP3Capabilities) => string[];
declare const _default: {
    parsePOP3Command: (rawCommand: string) => ParsedPOP3Command;
    parseUserCommand: (args: string[]) => {
        valid: boolean;
        username?: string;
        error?: string;
    };
    parsePassCommand: (args: string[]) => {
        valid: boolean;
        password?: string;
        error?: string;
    };
    parseListCommand: (args: string[]) => {
        valid: boolean;
        messageNumber?: number;
        error?: string;
    };
    parseRetrCommand: (args: string[]) => {
        valid: boolean;
        messageNumber?: number;
        error?: string;
    };
    parseDeleCommand: (args: string[]) => {
        valid: boolean;
        messageNumber?: number;
        error?: string;
    };
    parseTopCommand: (args: string[]) => {
        valid: boolean;
        messageNumber?: number;
        lineCount?: number;
        error?: string;
    };
    parseUidlCommand: (args: string[]) => {
        valid: boolean;
        messageNumber?: number;
        error?: string;
    };
    parseApopCommand: (args: string[]) => {
        valid: boolean;
        username?: string;
        digest?: string;
        error?: string;
    };
    createPOP3Session: (ipAddress?: string) => POP3Session;
    generatePOP3Timestamp: () => string;
    updateSessionState: (session: POP3Session, newState: POP3State) => POP3Session;
    validateSessionCommand: (session: POP3Session, command: POP3Command) => boolean;
    loadMessagesIntoSession: (session: POP3Session, messages: POP3Message[]) => POP3Session;
    cleanupSession: (session: POP3Session) => POP3Session;
    authenticateUserPass: (username: string, password: string, validateCredentials: (username: string, password: string) => Promise<boolean>) => Promise<boolean>;
    computeAPOPDigest: (timestamp: string, password: string) => string;
    authenticateAPOP: (username: string, clientDigest: string, timestamp: string, getPassword: (username: string) => Promise<string>) => Promise<boolean>;
    validateAuthCredentials: (credentials: POP3AuthCredentials) => {
        valid: boolean;
        error?: string;
    };
    retrieveMessage: (session: POP3Session, messageNumber: number) => POP3Message | null;
    getMailboxStats: (session: POP3Session) => POP3MailboxStats;
    generateMessageList: (session: POP3Session, messageNumber?: number) => MessageListEntry[];
    markMessageDeleted: (session: POP3Session, messageNumber: number) => POP3Session;
    resetDeletions: (session: POP3Session) => POP3Session;
    generateUIDLList: (session: POP3Session, messageNumber?: number) => UIDLMapping[];
    generateUIDL: (messageId: string, username: string) => string;
    validateUIDL: (uidl: string) => boolean;
    retrieveMessageTop: (session: POP3Session, messageNumber: number, lineCount: number) => TopCommandResult | null;
    extractMessageHeaders: (content: string) => Record<string, string>;
    acquireMailboxLock: (username: string, sessionId: string, ttl?: number) => MailboxLock;
    releaseMailboxLock: (lock: MailboxLock) => boolean;
    isLockValid: (lock: MailboxLock) => boolean;
    validateLockOwnership: (lock: MailboxLock, sessionId: string) => boolean;
    createTLSOptions: (certPath: string, keyPath: string) => tls.TlsOptions;
    upgradeToTLS: (socket: net.Socket, tlsOptions: tls.TlsOptions) => Promise<tls.TLSSocket>;
    canEnableTLS: (session: POP3Session, config: POP3ServerConfig) => boolean;
    createOKResponse: (message: string, data?: string | string[]) => POP3Response;
    createErrorResponse: (message: string) => POP3Response;
    formatPOP3Response: (response: POP3Response) => string;
    createGreetingBanner: (config: POP3ServerConfig, timestamp: string) => string;
    validateCommandForState: (session: POP3Session, command: POP3Command) => POP3Response | null;
    getCapabilitiesList: (capabilities: POP3Capabilities) => string[];
};
export default _default;
//# sourceMappingURL=mail-pop3-protocol-kit.d.ts.map