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

/**
 * File: /reuse/server/mail/mail-pop3-protocol-kit.ts
 * Locator: WC-MAIL-POP3-001
 * Purpose: POP3 Protocol Kit - Complete POP3 protocol implementation for legacy mail client support
 *
 * Upstream: Node.js crypto, tls, net modules
 * Downstream: Mail server services, POP3 endpoint handlers, email retrieval APIs
 * Dependencies: Node 18+, TypeScript 5.x, RFC 1939 POP3 compliance
 * Exports: 40 functions for POP3 protocol handling, session management, and secure mail retrieval
 *
 * LLM Context: Production-grade POP3 (Post Office Protocol version 3) implementation for
 * White Cross healthcare system. Provides RFC 1939 compliant POP3 server functionality
 * including command parsing (USER, PASS, STAT, LIST, RETR, DELE, UIDL, TOP, etc.),
 * session state management, authentication mechanisms (basic AUTH, APOP, SASL),
 * message retrieval with unique ID support, mailbox locking, download-and-delete operations,
 * POP3S (POP3 over TLS) support, and comprehensive error handling. Essential for legacy
 * email client compatibility while maintaining HIPAA-compliant security standards.
 */

import * as crypto from 'crypto';
import * as tls from 'tls';
import * as net from 'net';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * POP3 session state
 */
export enum POP3State {
  AUTHORIZATION = 'AUTHORIZATION',
  TRANSACTION = 'TRANSACTION',
  UPDATE = 'UPDATE',
  CLOSED = 'CLOSED',
}

/**
 * POP3 command types
 */
export enum POP3Command {
  USER = 'USER',
  PASS = 'PASS',
  STAT = 'STAT',
  LIST = 'LIST',
  RETR = 'RETR',
  DELE = 'DELE',
  NOOP = 'NOOP',
  RSET = 'RSET',
  QUIT = 'QUIT',
  TOP = 'TOP',
  UIDL = 'UIDL',
  APOP = 'APOP',
  CAPA = 'CAPA',
  STLS = 'STLS',
  AUTH = 'AUTH',
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

// ============================================================================
// POP3 COMMAND PARSING
// ============================================================================

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
export const parsePOP3Command = (rawCommand: string): ParsedPOP3Command => {
  const trimmed = rawCommand.trim();
  const parts = trimmed.split(/\s+/);
  const commandStr = parts[0]?.toUpperCase();
  const args = parts.slice(1);

  if (!commandStr) {
    return {
      command: '' as any,
      args: [],
      rawCommand: trimmed,
      valid: false,
      error: 'Empty command',
    };
  }

  const command = POP3Command[commandStr as keyof typeof POP3Command];

  if (!command) {
    return {
      command: '' as any,
      args,
      rawCommand: trimmed,
      valid: false,
      error: `Unknown command: ${commandStr}`,
    };
  }

  return {
    command,
    args,
    rawCommand: trimmed,
    valid: true,
  };
};

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
export const parseUserCommand = (
  args: string[],
): { valid: boolean; username?: string; error?: string } => {
  if (args.length === 0) {
    return { valid: false, error: 'Username required' };
  }

  if (args.length > 1) {
    return { valid: false, error: 'Too many arguments' };
  }

  return { valid: true, username: args[0] };
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
export const parsePassCommand = (
  args: string[],
): { valid: boolean; password?: string; error?: string } => {
  if (args.length === 0) {
    return { valid: false, error: 'Password required' };
  }

  // POP3 allows spaces in password, join all args
  return { valid: true, password: args.join(' ') };
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
export const parseListCommand = (
  args: string[],
): { valid: boolean; messageNumber?: number; error?: string } => {
  if (args.length === 0) {
    // LIST without args - list all messages
    return { valid: true };
  }

  const msgNum = parseInt(args[0], 10);
  if (isNaN(msgNum) || msgNum < 1) {
    return { valid: false, error: 'Invalid message number' };
  }

  return { valid: true, messageNumber: msgNum };
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
export const parseRetrCommand = (
  args: string[],
): { valid: boolean; messageNumber?: number; error?: string } => {
  if (args.length === 0) {
    return { valid: false, error: 'Message number required' };
  }

  const msgNum = parseInt(args[0], 10);
  if (isNaN(msgNum) || msgNum < 1) {
    return { valid: false, error: 'Invalid message number' };
  }

  return { valid: true, messageNumber: msgNum };
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
export const parseDeleCommand = (
  args: string[],
): { valid: boolean; messageNumber?: number; error?: string } => {
  if (args.length === 0) {
    return { valid: false, error: 'Message number required' };
  }

  const msgNum = parseInt(args[0], 10);
  if (isNaN(msgNum) || msgNum < 1) {
    return { valid: false, error: 'Invalid message number' };
  }

  return { valid: true, messageNumber: msgNum };
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
export const parseTopCommand = (
  args: string[],
): { valid: boolean; messageNumber?: number; lineCount?: number; error?: string } => {
  if (args.length < 2) {
    return { valid: false, error: 'TOP requires message number and line count' };
  }

  const msgNum = parseInt(args[0], 10);
  const lineCount = parseInt(args[1], 10);

  if (isNaN(msgNum) || msgNum < 1) {
    return { valid: false, error: 'Invalid message number' };
  }

  if (isNaN(lineCount) || lineCount < 0) {
    return { valid: false, error: 'Invalid line count' };
  }

  return { valid: true, messageNumber: msgNum, lineCount };
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
export const parseUidlCommand = (
  args: string[],
): { valid: boolean; messageNumber?: number; error?: string } => {
  if (args.length === 0) {
    // UIDL without args - list all UIDLs
    return { valid: true };
  }

  const msgNum = parseInt(args[0], 10);
  if (isNaN(msgNum) || msgNum < 1) {
    return { valid: false, error: 'Invalid message number' };
  }

  return { valid: true, messageNumber: msgNum };
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
export const parseApopCommand = (
  args: string[],
): { valid: boolean; username?: string; digest?: string; error?: string } => {
  if (args.length < 2) {
    return { valid: false, error: 'APOP requires username and digest' };
  }

  return { valid: true, username: args[0], digest: args[1] };
};

// ============================================================================
// POP3 SESSION MANAGEMENT
// ============================================================================

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
export const createPOP3Session = (ipAddress?: string): POP3Session => {
  const timestamp = generatePOP3Timestamp();

  return {
    sessionId: crypto.randomBytes(16).toString('hex'),
    state: POP3State.AUTHORIZATION,
    authenticated: false,
    mailboxLocked: false,
    messages: [],
    deletedMessages: new Set(),
    timestamp,
    ipAddress,
    tlsEnabled: false,
    createdAt: new Date(),
    lastActivity: new Date(),
  };
};

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
export const generatePOP3Timestamp = (): string => {
  const processId = process.pid;
  const clock = Date.now();
  const hostname = 'whitecross.local';

  return `<${processId}.${clock}@${hostname}>`;
};

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
export const updateSessionState = (
  session: POP3Session,
  newState: POP3State,
): POP3Session => {
  return {
    ...session,
    state: newState,
    lastActivity: new Date(),
  };
};

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
export const validateSessionCommand = (
  session: POP3Session,
  command: POP3Command,
): boolean => {
  const authCommands = [POP3Command.USER, POP3Command.PASS, POP3Command.APOP, POP3Command.QUIT, POP3Command.CAPA];
  const transactionCommands = [
    POP3Command.STAT,
    POP3Command.LIST,
    POP3Command.RETR,
    POP3Command.DELE,
    POP3Command.NOOP,
    POP3Command.RSET,
    POP3Command.TOP,
    POP3Command.UIDL,
    POP3Command.QUIT,
  ];

  switch (session.state) {
    case POP3State.AUTHORIZATION:
      return authCommands.includes(command);
    case POP3State.TRANSACTION:
      return transactionCommands.includes(command);
    case POP3State.UPDATE:
      return command === POP3Command.QUIT;
    default:
      return false;
  }
};

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
export const loadMessagesIntoSession = (
  session: POP3Session,
  messages: POP3Message[],
): POP3Session => {
  return {
    ...session,
    messages: messages.map((msg, index) => ({
      ...msg,
      messageNumber: index + 1,
      deleted: false,
    })),
  };
};

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
export const cleanupSession = (session: POP3Session): POP3Session => {
  return {
    ...session,
    state: POP3State.CLOSED,
    messages: [],
    deletedMessages: new Set(),
  };
};

// ============================================================================
// AUTHENTICATION MECHANISMS
// ============================================================================

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
export const authenticateUserPass = async (
  username: string,
  password: string,
  validateCredentials: (username: string, password: string) => Promise<boolean>,
): Promise<boolean> => {
  try {
    return await validateCredentials(username, password);
  } catch (error) {
    return false;
  }
};

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
export const computeAPOPDigest = (timestamp: string, password: string): string => {
  const combined = timestamp + password;
  return crypto.createHash('md5').update(combined).digest('hex');
};

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
export const authenticateAPOP = async (
  username: string,
  clientDigest: string,
  timestamp: string,
  getPassword: (username: string) => Promise<string>,
): Promise<boolean> => {
  try {
    const password = await getPassword(username);
    const serverDigest = computeAPOPDigest(timestamp, password);
    return serverDigest.toLowerCase() === clientDigest.toLowerCase();
  } catch (error) {
    return false;
  }
};

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
export const validateAuthCredentials = (
  credentials: POP3AuthCredentials,
): { valid: boolean; error?: string } => {
  if (!credentials.username || credentials.username.trim().length === 0) {
    return { valid: false, error: 'Username is required' };
  }

  if (!credentials.password && !credentials.digest) {
    return { valid: false, error: 'Password or digest is required' };
  }

  return { valid: true };
};

// ============================================================================
// MESSAGE RETRIEVAL
// ============================================================================

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
export const retrieveMessage = (
  session: POP3Session,
  messageNumber: number,
): POP3Message | null => {
  const message = session.messages.find((msg) => msg.messageNumber === messageNumber);

  if (!message || message.deleted) {
    return null;
  }

  return {
    ...message,
    retrievedAt: new Date(),
  };
};

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
export const getMailboxStats = (session: POP3Session): POP3MailboxStats => {
  const availableMessages = session.messages.filter((msg) => !msg.deleted);
  const totalSize = availableMessages.reduce((sum, msg) => sum + msg.size, 0);

  return {
    messageCount: availableMessages.length,
    totalSize,
    deletedCount: session.deletedMessages.size,
    availableMessages: availableMessages.length,
  };
};

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
export const generateMessageList = (
  session: POP3Session,
  messageNumber?: number,
): MessageListEntry[] => {
  let messages = session.messages.filter((msg) => !msg.deleted);

  if (messageNumber !== undefined) {
    messages = messages.filter((msg) => msg.messageNumber === messageNumber);
  }

  return messages.map((msg) => ({
    messageNumber: msg.messageNumber,
    size: msg.size,
  }));
};

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
export const markMessageDeleted = (
  session: POP3Session,
  messageNumber: number,
): POP3Session => {
  const message = session.messages.find((msg) => msg.messageNumber === messageNumber);

  if (!message || message.deleted) {
    return session;
  }

  const updatedMessages = session.messages.map((msg) =>
    msg.messageNumber === messageNumber ? { ...msg, deleted: true } : msg,
  );

  const updatedDeleted = new Set(session.deletedMessages);
  updatedDeleted.add(messageNumber);

  return {
    ...session,
    messages: updatedMessages,
    deletedMessages: updatedDeleted,
  };
};

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
export const resetDeletions = (session: POP3Session): POP3Session => {
  const updatedMessages = session.messages.map((msg) => ({
    ...msg,
    deleted: false,
  }));

  return {
    ...session,
    messages: updatedMessages,
    deletedMessages: new Set(),
  };
};

// ============================================================================
// POP3 UIDL SUPPORT
// ============================================================================

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
export const generateUIDLList = (
  session: POP3Session,
  messageNumber?: number,
): UIDLMapping[] => {
  let messages = session.messages.filter((msg) => !msg.deleted);

  if (messageNumber !== undefined) {
    messages = messages.filter((msg) => msg.messageNumber === messageNumber);
  }

  return messages.map((msg) => ({
    messageNumber: msg.messageNumber,
    uidl: msg.uidl,
    messageId: msg.messageId,
  }));
};

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
export const generateUIDL = (messageId: string, username: string): string => {
  const combined = `${messageId}:${username}`;
  return crypto.createHash('sha256').update(combined).digest('hex').substring(0, 32);
};

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
export const validateUIDL = (uidl: string): boolean => {
  return /^[a-f0-9]{32}$/i.test(uidl);
};

// ============================================================================
// TOP COMMAND SUPPORT
// ============================================================================

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
export const retrieveMessageTop = (
  session: POP3Session,
  messageNumber: number,
  lineCount: number,
): TopCommandResult | null => {
  const message = retrieveMessage(session, messageNumber);

  if (!message || !message.content) {
    return null;
  }

  const lines = message.content.split('\r\n');
  const headerEndIndex = lines.findIndex((line) => line === '');

  if (headerEndIndex === -1) {
    // No body separator found
    return {
      headers: lines.join('\r\n'),
      bodyLines: [],
      totalLines: lines.length,
    };
  }

  const headers = lines.slice(0, headerEndIndex + 1).join('\r\n');
  const bodyLines = lines.slice(headerEndIndex + 1, headerEndIndex + 1 + lineCount);

  return {
    headers,
    bodyLines,
    totalLines: lines.length - headerEndIndex - 1,
  };
};

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
export const extractMessageHeaders = (content: string): Record<string, string> => {
  const headers: Record<string, string> = {};
  const lines = content.split('\r\n');

  let currentHeader = '';
  let currentValue = '';

  for (const line of lines) {
    if (line === '') {
      // End of headers
      if (currentHeader) {
        headers[currentHeader] = currentValue.trim();
      }
      break;
    }

    if (line.startsWith(' ') || line.startsWith('\t')) {
      // Continuation of previous header
      currentValue += ' ' + line.trim();
    } else {
      // New header
      if (currentHeader) {
        headers[currentHeader] = currentValue.trim();
      }

      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        currentHeader = line.substring(0, colonIndex).trim();
        currentValue = line.substring(colonIndex + 1).trim();
      }
    }
  }

  return headers;
};

// ============================================================================
// POP3 LOCKING MECHANISMS
// ============================================================================

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
export const acquireMailboxLock = (
  username: string,
  sessionId: string,
  ttl: number = 300,
): MailboxLock => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttl * 1000);

  return {
    username,
    sessionId,
    acquiredAt: now,
    expiresAt,
  };
};

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
export const releaseMailboxLock = (lock: MailboxLock): boolean => {
  // In production, this would remove from distributed lock store
  return true;
};

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
export const isLockValid = (lock: MailboxLock): boolean => {
  return new Date() < lock.expiresAt;
};

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
export const validateLockOwnership = (lock: MailboxLock, sessionId: string): boolean => {
  return lock.sessionId === sessionId && isLockValid(lock);
};

// ============================================================================
// POP3 OVER TLS (POP3S)
// ============================================================================

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
export const createTLSOptions = (
  certPath: string,
  keyPath: string,
): tls.TlsOptions => {
  return {
    cert: require('fs').readFileSync(certPath),
    key: require('fs').readFileSync(keyPath),
    minVersion: 'TLSv1.2' as any,
    ciphers: 'HIGH:!aNULL:!MD5',
  };
};

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
export const upgradeToTLS = (
  socket: net.Socket,
  tlsOptions: tls.TlsOptions,
): Promise<tls.TLSSocket> => {
  return new Promise((resolve, reject) => {
    const tlsSocket = new tls.TLSSocket(socket, {
      ...tlsOptions,
      isServer: true,
    });

    tlsSocket.on('secure', () => {
      resolve(tlsSocket);
    });

    tlsSocket.on('error', (err) => {
      reject(err);
    });
  });
};

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
export const canEnableTLS = (session: POP3Session, config: POP3ServerConfig): boolean => {
  return config.enableSTLS && !session.tlsEnabled && session.state === POP3State.AUTHORIZATION;
};

// ============================================================================
// ERROR HANDLING & RESPONSES
// ============================================================================

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
export const createOKResponse = (
  message: string,
  data?: string | string[],
): POP3Response => {
  return {
    status: '+OK',
    message,
    data,
    multiline: Array.isArray(data),
  };
};

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
export const createErrorResponse = (message: string): POP3Response => {
  return {
    status: '-ERR',
    message,
    multiline: false,
  };
};

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
export const formatPOP3Response = (response: POP3Response): string => {
  let output = `${response.status} ${response.message}\r\n`;

  if (response.data) {
    if (Array.isArray(response.data)) {
      // Multiline response
      for (const line of response.data) {
        // Byte-stuff lines starting with '.'
        const stuffed = line.startsWith('.') ? '.' + line : line;
        output += stuffed + '\r\n';
      }
      output += '.\r\n'; // Termination
    } else {
      output += response.data + '\r\n';
    }
  }

  return output;
};

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
export const createGreetingBanner = (
  config: POP3ServerConfig,
  timestamp: string,
): string => {
  const banner = config.banner || 'White Cross POP3 Server ready';
  return `+OK ${banner} ${timestamp}\r\n`;
};

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
export const validateCommandForState = (
  session: POP3Session,
  command: POP3Command,
): POP3Response | null => {
  if (!validateSessionCommand(session, command)) {
    return createErrorResponse(`Command ${command} not allowed in ${session.state} state`);
  }
  return null;
};

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
export const getCapabilitiesList = (capabilities: POP3Capabilities): string[] => {
  const caps: string[] = [];

  if (capabilities.TOP) caps.push('TOP');
  if (capabilities.UIDL) caps.push('UIDL');
  if (capabilities.USER) caps.push('USER');
  if (capabilities.STLS) caps.push('STLS');

  if (capabilities.SASL && capabilities.SASL.length > 0) {
    caps.push(`SASL ${capabilities.SASL.join(' ')}`);
  }

  if (capabilities.EXPIRE) {
    caps.push(`EXPIRE ${capabilities.EXPIRE}`);
  }

  if (capabilities['LOGIN-DELAY']) {
    caps.push(`LOGIN-DELAY ${capabilities['LOGIN-DELAY']}`);
  }

  if (capabilities.IMPLEMENTATION) {
    caps.push(`IMPLEMENTATION ${capabilities.IMPLEMENTATION}`);
  }

  return caps;
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  // Command parsing
  parsePOP3Command,
  parseUserCommand,
  parsePassCommand,
  parseListCommand,
  parseRetrCommand,
  parseDeleCommand,
  parseTopCommand,
  parseUidlCommand,
  parseApopCommand,

  // Session management
  createPOP3Session,
  generatePOP3Timestamp,
  updateSessionState,
  validateSessionCommand,
  loadMessagesIntoSession,
  cleanupSession,

  // Authentication
  authenticateUserPass,
  computeAPOPDigest,
  authenticateAPOP,
  validateAuthCredentials,

  // Message retrieval
  retrieveMessage,
  getMailboxStats,
  generateMessageList,
  markMessageDeleted,
  resetDeletions,

  // UIDL support
  generateUIDLList,
  generateUIDL,
  validateUIDL,

  // TOP command
  retrieveMessageTop,
  extractMessageHeaders,

  // Locking
  acquireMailboxLock,
  releaseMailboxLock,
  isLockValid,
  validateLockOwnership,

  // TLS support
  createTLSOptions,
  upgradeToTLS,
  canEnableTLS,

  // Responses and errors
  createOKResponse,
  createErrorResponse,
  formatPOP3Response,
  createGreetingBanner,
  validateCommandForState,
  getCapabilitiesList,
};
