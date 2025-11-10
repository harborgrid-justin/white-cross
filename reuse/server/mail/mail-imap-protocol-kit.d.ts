/**
 * LOC: MAILIMAP1234567
 * File: /reuse/server/mail/mail-imap-protocol-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Email sync services
 *   - Mail client implementations
 *   - Exchange integration modules
 *   - IMAP gateway services
 *   - Message queue processors
 */
import { EventEmitter } from 'events';
/**
 * @swagger
 * components:
 *   schemas:
 *     IMAPConnectionConfig:
 *       type: object
 *       required:
 *         - host
 *         - port
 *         - user
 *       properties:
 *         host:
 *           type: string
 *           description: IMAP server hostname
 *           example: imap.gmail.com
 *         port:
 *           type: integer
 *           description: IMAP server port
 *           example: 993
 *         secure:
 *           type: boolean
 *           description: Use TLS/SSL
 *           default: true
 *         user:
 *           type: string
 *           description: Username/email
 *         password:
 *           type: string
 *           description: Password (for PLAIN/LOGIN auth)
 *         authMethod:
 *           type: string
 *           enum: [PLAIN, LOGIN, CRAM-MD5, XOAUTH2]
 *           default: PLAIN
 *         oauth2Token:
 *           type: string
 *           description: OAuth2 access token (for XOAUTH2)
 *         connectionTimeout:
 *           type: integer
 *           default: 30000
 *         keepalive:
 *           type: boolean
 *           default: true
 */
interface IMAPConnectionConfig {
    host: string;
    port: number;
    secure?: boolean;
    user: string;
    password?: string;
    authMethod?: 'PLAIN' | 'LOGIN' | 'CRAM-MD5' | 'XOAUTH2';
    oauth2Token?: string;
    connectionTimeout?: number;
    socketTimeout?: number;
    keepalive?: boolean;
    keepaliveInterval?: number;
    tls?: {
        rejectUnauthorized?: boolean;
        minVersion?: string;
    };
    debug?: boolean;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     IMAPSession:
 *       type: object
 *       properties:
 *         sessionId:
 *           type: string
 *           format: uuid
 *         user:
 *           type: string
 *         state:
 *           type: string
 *           enum: [NOT_AUTHENTICATED, AUTHENTICATED, SELECTED, LOGOUT]
 *         selectedMailbox:
 *           type: string
 *         capabilities:
 *           type: array
 *           items:
 *             type: string
 *         tagCounter:
 *           type: integer
 */
interface IMAPSession {
    sessionId: string;
    user: string;
    state: 'NOT_AUTHENTICATED' | 'AUTHENTICATED' | 'SELECTED' | 'LOGOUT';
    selectedMailbox?: string;
    capabilities: string[];
    tagCounter: number;
    createdAt: Date;
    lastActivityAt: Date;
    uidValidity?: number;
    uidNext?: number;
    exists?: number;
    recent?: number;
    unseen?: number;
    permanentFlags?: string[];
    flags?: string[];
    readOnly?: boolean;
    highestModSeq?: bigint;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     IMAPCommand:
 *       type: object
 *       required:
 *         - tag
 *         - command
 *       properties:
 *         tag:
 *           type: string
 *           example: A001
 *         command:
 *           type: string
 *           enum: [CAPABILITY, NOOP, LOGOUT, STARTTLS, AUTHENTICATE, LOGIN, SELECT, EXAMINE, CREATE, DELETE, RENAME, SUBSCRIBE, UNSUBSCRIBE, LIST, LSUB, STATUS, APPEND, CHECK, CLOSE, EXPUNGE, SEARCH, FETCH, STORE, COPY, UID, IDLE, ENABLE]
 *         args:
 *           type: array
 *           items:
 *             type: string
 */
interface IMAPCommand {
    tag: string;
    command: string;
    args: string[];
    literalData?: Buffer;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     IMAPResponse:
 *       type: object
 *       properties:
 *         tag:
 *           type: string
 *         status:
 *           type: string
 *           enum: [OK, NO, BAD, PREAUTH, BYE]
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             type: object
 */
interface IMAPResponse {
    tag: string;
    status: 'OK' | 'NO' | 'BAD' | 'PREAUTH' | 'BYE';
    code?: string;
    message?: string;
    data?: any[];
}
/**
 * @swagger
 * components:
 *   schemas:
 *     IMAPMailbox:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         delimiter:
 *           type: string
 *         flags:
 *           type: array
 *           items:
 *             type: string
 *         exists:
 *           type: integer
 *         recent:
 *           type: integer
 *         unseen:
 *           type: integer
 *         uidValidity:
 *           type: integer
 *         uidNext:
 *           type: integer
 *         highestModSeq:
 *           type: string
 */
interface IMAPMailbox {
    name: string;
    path: string;
    delimiter: string;
    flags: string[];
    exists: number;
    recent: number;
    unseen: number;
    uidValidity: number;
    uidNext: number;
    permanentFlags?: string[];
    readOnly?: boolean;
    highestModSeq?: bigint;
    attributes?: string[];
}
/**
 * @swagger
 * components:
 *   schemas:
 *     IMAPMessage:
 *       type: object
 *       properties:
 *         uid:
 *           type: integer
 *         seq:
 *           type: integer
 *         flags:
 *           type: array
 *           items:
 *             type: string
 *         modSeq:
 *           type: string
 *         size:
 *           type: integer
 *         internalDate:
 *           type: string
 *           format: date-time
 *         envelope:
 *           type: object
 *         bodyStructure:
 *           type: object
 */
interface IMAPMessage {
    uid: number;
    seq: number;
    flags: string[];
    modSeq?: bigint;
    size: number;
    internalDate: Date;
    envelope?: IMAPEnvelope;
    bodyStructure?: IMAPBodyStructure;
    headers?: Record<string, string | string[]>;
    body?: string | Buffer;
    bodyParts?: IMAPBodyPart[];
}
/**
 * @swagger
 * components:
 *   schemas:
 *     IMAPEnvelope:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *         subject:
 *           type: string
 *         from:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IMAPAddress'
 *         sender:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IMAPAddress'
 *         replyTo:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IMAPAddress'
 */
interface IMAPEnvelope {
    date: string;
    subject: string;
    from: IMAPAddress[];
    sender: IMAPAddress[];
    replyTo: IMAPAddress[];
    to: IMAPAddress[];
    cc: IMAPAddress[];
    bcc: IMAPAddress[];
    inReplyTo?: string;
    messageId: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     IMAPAddress:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         mailbox:
 *           type: string
 *         host:
 *           type: string
 */
interface IMAPAddress {
    name: string;
    mailbox: string;
    host: string;
}
interface IMAPBodyStructure {
    type: string;
    subtype: string;
    params?: Record<string, string>;
    id?: string;
    description?: string;
    encoding?: string;
    size: number;
    lines?: number;
    md5?: string;
    disposition?: {
        type: string;
        params?: Record<string, string>;
    };
    language?: string | string[];
    location?: string;
    parts?: IMAPBodyStructure[];
    envelope?: IMAPEnvelope;
}
interface IMAPBodyPart {
    partId: string;
    type: string;
    subtype: string;
    encoding?: string;
    size: number;
    disposition?: string;
    filename?: string;
    content?: Buffer;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     IMAPSearchCriteria:
 *       type: object
 *       properties:
 *         all:
 *           type: boolean
 *         answered:
 *           type: boolean
 *         bcc:
 *           type: string
 *         before:
 *           type: string
 *           format: date
 *         body:
 *           type: string
 *         cc:
 *           type: string
 *         deleted:
 *           type: boolean
 *         draft:
 *           type: boolean
 *         flagged:
 *           type: boolean
 */
interface IMAPSearchCriteria {
    all?: boolean;
    answered?: boolean;
    bcc?: string;
    before?: Date;
    body?: string;
    cc?: string;
    deleted?: boolean;
    draft?: boolean;
    flagged?: boolean;
    from?: string;
    header?: {
        name: string;
        value: string;
    };
    keyword?: string;
    larger?: number;
    new?: boolean;
    not?: IMAPSearchCriteria;
    old?: boolean;
    on?: Date;
    or?: [IMAPSearchCriteria, IMAPSearchCriteria];
    recent?: boolean;
    seen?: boolean;
    sentBefore?: Date;
    sentOn?: Date;
    sentSince?: Date;
    since?: Date;
    smaller?: number;
    subject?: string;
    text?: string;
    to?: string;
    uid?: string | number[];
    unanswered?: boolean;
    undeleted?: boolean;
    undraft?: boolean;
    unflagged?: boolean;
    unkeyword?: string;
    unseen?: boolean;
    modseq?: bigint;
}
interface IMAPFetchOptions {
    flags?: boolean;
    internalDate?: boolean;
    size?: boolean;
    envelope?: boolean;
    bodyStructure?: boolean;
    body?: boolean | string[];
    bodyPeek?: boolean | string[];
    headers?: boolean | string[];
    headerFields?: string[];
    headerFieldsNot?: string[];
    uid?: boolean;
    modseq?: boolean;
}
interface IMAPStoreOptions {
    flags: string[];
    operation: 'SET' | 'ADD' | 'REMOVE';
    silent?: boolean;
    unchangedSince?: bigint;
}
interface IMAPIdleSession {
    sessionId: string;
    mailbox: string;
    active: boolean;
    startedAt: Date;
    lastUpdate?: Date;
    eventEmitter: EventEmitter;
}
interface IMAPSyncState {
    mailbox: string;
    uidValidity: number;
    uidNext: number;
    highestModSeq?: bigint;
    syncedUids: number[];
    deletedUids: number[];
    lastSyncAt: Date;
}
interface IMAPQuota {
    root: string;
    resources: {
        name: string;
        usage: number;
        limit: number;
    }[];
}
interface IMAPNamespace {
    personal: IMAPNamespaceItem[];
    other: IMAPNamespaceItem[];
    shared: IMAPNamespaceItem[];
}
interface IMAPNamespaceItem {
    prefix: string;
    delimiter: string;
}
interface IMAPExtension {
    name: string;
    enabled: boolean;
    parameters?: Record<string, any>;
}
/**
 * Creates an IMAP connection
 * @param config - IMAP connection configuration
 * @returns Connection object
 * @example
 * const connection = await createIMAPConnection({
 *   host: 'imap.gmail.com',
 *   port: 993,
 *   secure: true,
 *   user: 'user@gmail.com',
 *   password: 'app-password'
 * });
 */
export declare function createIMAPConnection(config: IMAPConnectionConfig): Promise<{
    sessionId: string;
    capabilities: string[];
}>;
/**
 * Initializes an IMAP session
 * @param sessionId - Session identifier
 * @param user - Username
 * @param capabilities - Server capabilities
 * @returns IMAP session object
 * @example
 * const session = initializeIMAPSession('session-123', 'user@example.com', ['IMAP4rev1', 'IDLE']);
 */
export declare function initializeIMAPSession(sessionId: string, user: string, capabilities: string[]): IMAPSession;
/**
 * Generates next IMAP command tag
 * @param session - IMAP session
 * @returns Command tag (e.g., A001)
 * @example
 * const tag = generateIMAPTag(session); // 'A001'
 */
export declare function generateIMAPTag(session: IMAPSession): string;
/**
 * Updates session last activity timestamp
 * @param session - IMAP session
 * @example
 * updateSessionActivity(session);
 */
export declare function updateSessionActivity(session: IMAPSession): void;
/**
 * Validates IMAP session state
 * @param session - IMAP session
 * @param requiredState - Required session state
 * @returns True if session is in required state
 * @example
 * const isValid = validateSessionState(session, 'SELECTED');
 */
export declare function validateSessionState(session: IMAPSession, requiredState: IMAPSession['state']): boolean;
/**
 * Closes IMAP session
 * @param session - IMAP session
 * @example
 * await closeIMAPSession(session);
 */
export declare function closeIMAPSession(session: IMAPSession): Promise<void>;
/**
 * Authenticates using PLAIN mechanism
 * @param user - Username
 * @param password - Password
 * @returns Authentication string
 * @example
 * const authString = authPlain('user@example.com', 'password');
 */
export declare function authPlain(user: string, password: string): string;
/**
 * Authenticates using LOGIN mechanism
 * @param user - Username
 * @param password - Password
 * @returns Authentication object
 * @example
 * const auth = authLogin('user@example.com', 'password');
 */
export declare function authLogin(user: string, password: string): {
    user: string;
    password: string;
};
/**
 * Authenticates using CRAM-MD5 mechanism
 * @param user - Username
 * @param password - Password
 * @param challenge - Server challenge
 * @returns Authentication response
 * @example
 * const response = authCramMD5('user', 'pass', '<server-challenge>');
 */
export declare function authCramMD5(user: string, password: string, challenge: string): string;
/**
 * Authenticates using XOAUTH2 mechanism
 * @param user - Username
 * @param accessToken - OAuth2 access token
 * @returns Authentication string
 * @example
 * const authString = authXOAuth2('user@gmail.com', 'ya29.a0...');
 */
export declare function authXOAuth2(user: string, accessToken: string): string;
/**
 * Validates OAuth2 token expiration
 * @param token - OAuth2 token
 * @param expiresAt - Token expiration timestamp
 * @returns True if token is valid
 * @example
 * const isValid = validateOAuth2Token(token, Date.now() + 3600000);
 */
export declare function validateOAuth2Token(token: string, expiresAt: number): boolean;
/**
 * Parses IMAP command from string
 * @param commandString - Raw IMAP command
 * @returns Parsed command object
 * @example
 * const cmd = parseIMAPCommand('A001 SELECT INBOX');
 * // { tag: 'A001', command: 'SELECT', args: ['INBOX'] }
 */
export declare function parseIMAPCommand(commandString: string): IMAPCommand;
/**
 * Builds IMAP command string
 * @param command - IMAP command object
 * @returns Command string
 * @example
 * const cmdString = buildIMAPCommand({ tag: 'A001', command: 'SELECT', args: ['INBOX'] });
 * // 'A001 SELECT INBOX'
 */
export declare function buildIMAPCommand(command: IMAPCommand): string;
/**
 * Validates IMAP command syntax
 * @param command - IMAP command
 * @returns True if command is valid
 * @example
 * const isValid = validateIMAPCommand({ tag: 'A001', command: 'SELECT', args: ['INBOX'] });
 */
export declare function validateIMAPCommand(command: IMAPCommand): boolean;
/**
 * Parses IMAP response
 * @param responseString - Raw IMAP response
 * @returns Parsed response object
 * @example
 * const response = parseIMAPResponse('A001 OK SELECT completed');
 */
export declare function parseIMAPResponse(responseString: string): IMAPResponse;
/**
 * Selects mailbox (READ-WRITE)
 * @param session - IMAP session
 * @param mailboxName - Mailbox name
 * @returns Mailbox information
 * @example
 * const mailbox = await selectMailbox(session, 'INBOX');
 */
export declare function selectMailbox(session: IMAPSession, mailboxName: string): Promise<IMAPMailbox>;
/**
 * Examines mailbox (READ-ONLY)
 * @param session - IMAP session
 * @param mailboxName - Mailbox name
 * @returns Mailbox information
 * @example
 * const mailbox = await examineMailbox(session, 'INBOX');
 */
export declare function examineMailbox(session: IMAPSession, mailboxName: string): Promise<IMAPMailbox>;
/**
 * Creates new mailbox
 * @param mailboxName - Mailbox name
 * @returns Success status
 * @example
 * await createMailbox('Archive/2024');
 */
export declare function createMailbox(mailboxName: string): Promise<boolean>;
/**
 * Deletes mailbox
 * @param mailboxName - Mailbox name
 * @returns Success status
 * @example
 * await deleteMailbox('OldArchive');
 */
export declare function deleteMailbox(mailboxName: string): Promise<boolean>;
/**
 * Renames mailbox
 * @param oldName - Current mailbox name
 * @param newName - New mailbox name
 * @returns Success status
 * @example
 * await renameMailbox('Archive', 'Old Archive');
 */
export declare function renameMailbox(oldName: string, newName: string): Promise<boolean>;
/**
 * Lists all mailboxes
 * @param reference - Reference name
 * @param pattern - Mailbox pattern (supports wildcards)
 * @returns Array of mailboxes
 * @example
 * const mailboxes = await listMailboxes('', '*');
 */
export declare function listMailboxes(reference: string, pattern: string): Promise<IMAPMailbox[]>;
/**
 * Subscribes to mailbox
 * @param mailboxName - Mailbox name
 * @returns Success status
 * @example
 * await subscribeMailbox('Important');
 */
export declare function subscribeMailbox(mailboxName: string): Promise<boolean>;
/**
 * Unsubscribes from mailbox
 * @param mailboxName - Mailbox name
 * @returns Success status
 * @example
 * await unsubscribeMailbox('Spam');
 */
export declare function unsubscribeMailbox(mailboxName: string): Promise<boolean>;
/**
 * Gets mailbox status
 * @param mailboxName - Mailbox name
 * @param items - Status items to retrieve
 * @returns Mailbox status
 * @example
 * const status = await getMailboxStatus('INBOX', ['MESSAGES', 'UNSEEN']);
 */
export declare function getMailboxStatus(mailboxName: string, items: string[]): Promise<Partial<IMAPMailbox>>;
/**
 * Fetches messages by sequence numbers
 * @param sequenceSet - Sequence numbers (e.g., '1:10' or '1,5,10')
 * @param options - Fetch options
 * @returns Array of messages
 * @example
 * const messages = await fetchMessages('1:10', { flags: true, envelope: true });
 */
export declare function fetchMessages(sequenceSet: string, options: IMAPFetchOptions): Promise<IMAPMessage[]>;
/**
 * Fetches messages by UIDs
 * @param uidSet - UID set (e.g., '1:100' or '1,5,10')
 * @param options - Fetch options
 * @returns Array of messages
 * @example
 * const messages = await fetchMessagesByUID('1:100', { flags: true, body: true });
 */
export declare function fetchMessagesByUID(uidSet: string, options: IMAPFetchOptions): Promise<IMAPMessage[]>;
/**
 * Fetches message headers only
 * @param uid - Message UID
 * @param headerFields - Specific header fields to fetch
 * @returns Message headers
 * @example
 * const headers = await fetchMessageHeaders(123, ['From', 'Subject', 'Date']);
 */
export declare function fetchMessageHeaders(uid: number, headerFields?: string[]): Promise<Record<string, string | string[]>>;
/**
 * Fetches message body structure
 * @param uid - Message UID
 * @returns Body structure
 * @example
 * const structure = await fetchBodyStructure(123);
 */
export declare function fetchBodyStructure(uid: number): Promise<IMAPBodyStructure>;
/**
 * Fetches specific body part
 * @param uid - Message UID
 * @param partId - Body part ID (e.g., '1', '1.2')
 * @returns Body part content
 * @example
 * const part = await fetchBodyPart(123, '1.2');
 */
export declare function fetchBodyPart(uid: number, partId: string): Promise<Buffer>;
/**
 * Fetches partial message data
 * @param uid - Message UID
 * @param partId - Body part ID
 * @param start - Start byte
 * @param length - Number of bytes
 * @returns Partial content
 * @example
 * const partial = await fetchPartialMessage(123, '1', 0, 1024);
 */
export declare function fetchPartialMessage(uid: number, partId: string, start: number, length: number): Promise<Buffer>;
/**
 * Sets message flags (replaces existing)
 * @param uidSet - UID set
 * @param flags - Flags to set
 * @returns Success status
 * @example
 * await setMessageFlags('1:10', ['\\Seen', '\\Flagged']);
 */
export declare function setMessageFlags(uidSet: string, flags: string[]): Promise<boolean>;
/**
 * Adds message flags (keeps existing)
 * @param uidSet - UID set
 * @param flags - Flags to add
 * @returns Success status
 * @example
 * await addMessageFlags('1:10', ['\\Flagged']);
 */
export declare function addMessageFlags(uidSet: string, flags: string[]): Promise<boolean>;
/**
 * Removes message flags
 * @param uidSet - UID set
 * @param flags - Flags to remove
 * @returns Success status
 * @example
 * await removeMessageFlags('1:10', ['\\Seen']);
 */
export declare function removeMessageFlags(uidSet: string, flags: string[]): Promise<boolean>;
/**
 * Stores message flags with UNCHANGEDSINCE
 * @param uidSet - UID set
 * @param options - Store options
 * @returns Updated messages
 * @example
 * await storeMessageFlags('1:10', { flags: ['\\Seen'], operation: 'ADD', unchangedSince: 12345n });
 */
export declare function storeMessageFlags(uidSet: string, options: IMAPStoreOptions): Promise<IMAPMessage[]>;
/**
 * Builds IMAP search query string
 * @param criteria - Search criteria
 * @returns Search query string
 * @example
 * const query = buildSearchQuery({ from: 'user@example.com', unseen: true });
 * // 'FROM "user@example.com" UNSEEN'
 */
export declare function buildSearchQuery(criteria: IMAPSearchCriteria): string;
/**
 * Searches messages by criteria
 * @param criteria - Search criteria
 * @returns Array of matching UIDs
 * @example
 * const uids = await searchMessages({ from: 'user@example.com', unseen: true });
 */
export declare function searchMessages(criteria: IMAPSearchCriteria): Promise<number[]>;
/**
 * Formats date for IMAP commands
 * @param date - Date object
 * @returns IMAP date string (DD-Mon-YYYY)
 * @example
 * const imapDate = formatIMAPDate(new Date()); // '01-Jan-2024'
 */
export declare function formatIMAPDate(date: Date): string;
/**
 * Starts IDLE session for push notifications
 * @param session - IMAP session
 * @param mailbox - Mailbox to monitor
 * @returns IDLE session object
 * @example
 * const idleSession = await startIDLE(session, 'INBOX');
 */
export declare function startIDLE(session: IMAPSession, mailbox: string): Promise<IMAPIdleSession>;
/**
 * Stops IDLE session
 * @param idleSession - IDLE session
 * @example
 * await stopIDLE(idleSession);
 */
export declare function stopIDLE(idleSession: IMAPIdleSession): Promise<void>;
/**
 * Handles IDLE notifications
 * @param idleSession - IDLE session
 * @param callback - Callback for notifications
 * @example
 * handleIDLENotifications(idleSession, (type, data) => {
 *   console.log('New notification:', type, data);
 * });
 */
export declare function handleIDLENotifications(idleSession: IMAPIdleSession, callback: (type: string, data: any) => void): void;
/**
 * Initializes sync state for mailbox
 * @param mailbox - Mailbox information
 * @returns Sync state object
 * @example
 * const syncState = initializeSyncState(mailbox);
 */
export declare function initializeSyncState(mailbox: IMAPMailbox): IMAPSyncState;
/**
 * Detects mailbox changes (new, modified, deleted messages)
 * @param currentState - Current sync state
 * @param mailbox - Current mailbox state
 * @returns Changes object
 * @example
 * const changes = detectMailboxChanges(syncState, currentMailbox);
 */
export declare function detectMailboxChanges(currentState: IMAPSyncState, mailbox: IMAPMailbox): {
    uidValidityChanged: boolean;
    newMessages: number[];
    modifiedMessages: number[];
    deletedMessages: number[];
};
/**
 * Syncs mailbox using QRESYNC extension
 * @param session - IMAP session
 * @param syncState - Current sync state
 * @returns Sync changes
 * @example
 * const changes = await syncMailboxQRESYNC(session, syncState);
 */
export declare function syncMailboxQRESYNC(session: IMAPSession, syncState: IMAPSyncState): Promise<{
    vanished: number[];
    changed: IMAPMessage[];
}>;
/**
 * Syncs mailbox using CONDSTORE extension
 * @param session - IMAP session
 * @param syncState - Current sync state
 * @returns Modified messages
 * @example
 * const modified = await syncMailboxCONDSTORE(session, syncState);
 */
export declare function syncMailboxCONDSTORE(session: IMAPSession, syncState: IMAPSyncState): Promise<IMAPMessage[]>;
/**
 * Updates sync state after sync
 * @param syncState - Sync state to update
 * @param mailbox - Current mailbox state
 * @param syncedUids - Newly synced UIDs
 * @example
 * updateSyncState(syncState, mailbox, [101, 102, 103]);
 */
export declare function updateSyncState(syncState: IMAPSyncState, mailbox: IMAPMailbox, syncedUids: number[]): void;
/**
 * Enables IMAP extensions
 * @param session - IMAP session
 * @param extensions - Extension names
 * @returns Enabled extensions
 * @example
 * const enabled = await enableExtensions(session, ['CONDSTORE', 'QRESYNC']);
 */
export declare function enableExtensions(session: IMAPSession, extensions: string[]): Promise<IMAPExtension[]>;
/**
 * Checks if extension is supported
 * @param session - IMAP session
 * @param extension - Extension name
 * @returns True if supported
 * @example
 * const hasIdle = checkExtensionSupport(session, 'IDLE');
 */
export declare function checkExtensionSupport(session: IMAPSession, extension: string): boolean;
/**
 * Gets server namespace information
 * @returns Namespace information
 * @example
 * const namespaces = await getNamespaces();
 */
export declare function getNamespaces(): Promise<IMAPNamespace>;
/**
 * Gets quota information
 * @param quotaRoot - Quota root
 * @returns Quota information
 * @example
 * const quota = await getQuota('INBOX');
 */
export declare function getQuota(quotaRoot: string): Promise<IMAPQuota>;
/**
 * Copies messages to another mailbox
 * @param uidSet - UID set
 * @param destMailbox - Destination mailbox
 * @returns Success status
 * @example
 * await copyMessages('1:10', 'Archive');
 */
export declare function copyMessages(uidSet: string, destMailbox: string): Promise<boolean>;
/**
 * Moves messages to another mailbox (MOVE extension)
 * @param uidSet - UID set
 * @param destMailbox - Destination mailbox
 * @returns Success status
 * @example
 * await moveMessages('1:10', 'Archive');
 */
export declare function moveMessages(uidSet: string, destMailbox: string): Promise<boolean>;
/**
 * Appends message to mailbox
 * @param mailbox - Mailbox name
 * @param message - Message content
 * @param flags - Message flags
 * @param internalDate - Internal date
 * @returns Appended UID
 * @example
 * const uid = await appendMessage('Sent', messageBuffer, ['\\Seen'], new Date());
 */
export declare function appendMessage(mailbox: string, message: string | Buffer, flags?: string[], internalDate?: Date): Promise<number>;
/**
 * Expunges deleted messages
 * @returns Expunged sequence numbers
 * @example
 * const expunged = await expungeMessages();
 */
export declare function expungeMessages(): Promise<number[]>;
/**
 * Checks mailbox (requests checkpoint)
 * @example
 * await checkMailbox();
 */
export declare function checkMailbox(): Promise<void>;
/**
 * Unselects mailbox (UNSELECT extension)
 * @param session - IMAP session
 * @example
 * await unselectMailbox(session);
 */
export declare function unselectMailbox(session: IMAPSession): Promise<void>;
/**
 * Caches message metadata
 * @param message - IMAP message
 * @param cacheKey - Cache key
 * @returns Cache success
 * @example
 * await cacheMessageMetadata(message, 'imap:msg:123');
 */
export declare function cacheMessageMetadata(message: IMAPMessage, cacheKey: string): Promise<boolean>;
/**
 * Gets cached message metadata
 * @param cacheKey - Cache key
 * @returns Cached message or null
 * @example
 * const cached = await getCachedMessage('imap:msg:123');
 */
export declare function getCachedMessage(cacheKey: string): Promise<IMAPMessage | null>;
/**
 * Invalidates message cache
 * @param cacheKey - Cache key pattern
 * @returns Number of invalidated entries
 * @example
 * await invalidateMessageCache('imap:msg:*');
 */
export declare function invalidateMessageCache(cacheKey: string): Promise<number>;
/**
 * Sequelize model definition for IMAP sessions
 * @param sequelize - Sequelize instance
 * @param DataTypes - Sequelize data types
 * @returns IMAPSession model
 * @example
 * const IMAPSessionModel = defineIMAPSessionModel(sequelize, DataTypes);
 */
export declare function defineIMAPSessionModel(sequelize: any, DataTypes: any): any;
/**
 * Sequelize model definition for IMAP mailboxes
 * @param sequelize - Sequelize instance
 * @param DataTypes - Sequelize data types
 * @returns IMAPMailbox model
 * @example
 * const IMAPMailboxModel = defineIMAPMailboxModel(sequelize, DataTypes);
 */
export declare function defineIMAPMailboxModel(sequelize: any, DataTypes: any): any;
/**
 * Sequelize model definition for IMAP messages
 * @param sequelize - Sequelize instance
 * @param DataTypes - Sequelize data types
 * @returns IMAPMessage model
 * @example
 * const IMAPMessageModel = defineIMAPMessageModel(sequelize, DataTypes);
 */
export declare function defineIMAPMessageModel(sequelize: any, DataTypes: any): any;
/**
 * Sequelize model definition for IMAP sync state
 * @param sequelize - Sequelize instance
 * @param DataTypes - Sequelize data types
 * @returns IMAPSyncState model
 * @example
 * const IMAPSyncStateModel = defineIMAPSyncStateModel(sequelize, DataTypes);
 */
export declare function defineIMAPSyncStateModel(sequelize: any, DataTypes: any): any;
declare const _default: {
    createIMAPConnection: typeof createIMAPConnection;
    initializeIMAPSession: typeof initializeIMAPSession;
    generateIMAPTag: typeof generateIMAPTag;
    updateSessionActivity: typeof updateSessionActivity;
    validateSessionState: typeof validateSessionState;
    closeIMAPSession: typeof closeIMAPSession;
    authPlain: typeof authPlain;
    authLogin: typeof authLogin;
    authCramMD5: typeof authCramMD5;
    authXOAuth2: typeof authXOAuth2;
    validateOAuth2Token: typeof validateOAuth2Token;
    parseIMAPCommand: typeof parseIMAPCommand;
    buildIMAPCommand: typeof buildIMAPCommand;
    validateIMAPCommand: typeof validateIMAPCommand;
    parseIMAPResponse: typeof parseIMAPResponse;
    selectMailbox: typeof selectMailbox;
    examineMailbox: typeof examineMailbox;
    createMailbox: typeof createMailbox;
    deleteMailbox: typeof deleteMailbox;
    renameMailbox: typeof renameMailbox;
    listMailboxes: typeof listMailboxes;
    subscribeMailbox: typeof subscribeMailbox;
    unsubscribeMailbox: typeof unsubscribeMailbox;
    getMailboxStatus: typeof getMailboxStatus;
    fetchMessages: typeof fetchMessages;
    fetchMessagesByUID: typeof fetchMessagesByUID;
    fetchMessageHeaders: typeof fetchMessageHeaders;
    fetchBodyStructure: typeof fetchBodyStructure;
    fetchBodyPart: typeof fetchBodyPart;
    fetchPartialMessage: typeof fetchPartialMessage;
    setMessageFlags: typeof setMessageFlags;
    addMessageFlags: typeof addMessageFlags;
    removeMessageFlags: typeof removeMessageFlags;
    storeMessageFlags: typeof storeMessageFlags;
    buildSearchQuery: typeof buildSearchQuery;
    searchMessages: typeof searchMessages;
    formatIMAPDate: typeof formatIMAPDate;
    startIDLE: typeof startIDLE;
    stopIDLE: typeof stopIDLE;
    handleIDLENotifications: typeof handleIDLENotifications;
    initializeSyncState: typeof initializeSyncState;
    detectMailboxChanges: typeof detectMailboxChanges;
    syncMailboxQRESYNC: typeof syncMailboxQRESYNC;
    syncMailboxCONDSTORE: typeof syncMailboxCONDSTORE;
    updateSyncState: typeof updateSyncState;
    enableExtensions: typeof enableExtensions;
    checkExtensionSupport: typeof checkExtensionSupport;
    getNamespaces: typeof getNamespaces;
    getQuota: typeof getQuota;
    copyMessages: typeof copyMessages;
    moveMessages: typeof moveMessages;
    appendMessage: typeof appendMessage;
    expungeMessages: typeof expungeMessages;
    checkMailbox: typeof checkMailbox;
    unselectMailbox: typeof unselectMailbox;
    cacheMessageMetadata: typeof cacheMessageMetadata;
    getCachedMessage: typeof getCachedMessage;
    invalidateMessageCache: typeof invalidateMessageCache;
    defineIMAPSessionModel: typeof defineIMAPSessionModel;
    defineIMAPMailboxModel: typeof defineIMAPMailboxModel;
    defineIMAPMessageModel: typeof defineIMAPMessageModel;
    defineIMAPSyncStateModel: typeof defineIMAPSyncStateModel;
};
export default _default;
//# sourceMappingURL=mail-imap-protocol-kit.d.ts.map