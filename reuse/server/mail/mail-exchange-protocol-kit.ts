/**
 * LOC: E1W2S3P4R5
 * File: /reuse/server/mail/mail-exchange-protocol-kit.ts
 *
 * UPSTREAM (imports from):
 *   - xml2js (v0.6.x)
 *   - node-fetch (v3.x)
 *   - @types/node (v20.x)
 *
 * DOWNSTREAM (imported by):
 *   - Mail service implementations
 *   - Exchange integration modules
 *   - Calendar sync services
 *   - Contact management systems
 */

/**
 * File: /reuse/server/mail/mail-exchange-protocol-kit.ts
 * Locator: WC-UTL-MAIL-EWSKIT-001
 * Purpose: Exchange Web Services (EWS) Protocol Kit - Complete EWS integration for Microsoft Exchange
 *
 * Upstream: xml2js v0.6.x, node-fetch v3.x, Node 20+
 * Downstream: Exchange mail services, calendar sync, contact management, Office 365 integrations
 * Dependencies: Node 20+, TypeScript 5.x, xml2js, node-fetch
 * Exports: 50 EWS utilities for SOAP operations, AutoDiscover, calendar, contacts, notifications, and REST API equivalents
 *
 * LLM Context: Production-grade EWS compatibility kit for White Cross healthcare platform.
 * Provides comprehensive Exchange Web Services integration including SOAP message generation,
 * FindItem/GetItem operations, folder management, calendar operations, contact management,
 * AutoDiscover protocol, availability service, OOF settings, mailbox rules, delegation,
 * impersonation, streaming notifications, and modern REST API equivalents for Microsoft 365.
 * HIPAA-compliant with secure authentication and audit capabilities.
 */

import { parseStringPromise, Builder } from 'xml2js';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * EWS API version enumeration
 */
export enum EWSVersion {
  Exchange2007 = 'Exchange2007',
  Exchange2007_SP1 = 'Exchange2007_SP1',
  Exchange2010 = 'Exchange2010',
  Exchange2010_SP1 = 'Exchange2010_SP1',
  Exchange2010_SP2 = 'Exchange2010_SP2',
  Exchange2013 = 'Exchange2013',
  Exchange2013_SP1 = 'Exchange2013_SP1',
  Exchange2015 = 'Exchange2015',
  Exchange2016 = 'Exchange2016',
  Exchange2019 = 'Exchange2019',
  ExchangeOnline = 'ExchangeOnline',
}

/**
 * EWS authentication configuration
 */
export interface EWSAuthConfig {
  username: string;
  password?: string;
  domain?: string;
  accessToken?: string;
  impersonatedUser?: string;
  authType: 'basic' | 'ntlm' | 'oauth2';
}

/**
 * EWS endpoint configuration
 */
export interface EWSEndpoint {
  url: string;
  version: EWSVersion;
  auth: EWSAuthConfig;
  timeout?: number;
  userAgent?: string;
}

/**
 * EWS folder identifier
 */
export interface EWSFolderId {
  id?: string;
  changeKey?: string;
  distinguishedId?: 'inbox' | 'drafts' | 'sentitems' | 'deleteditems' | 'outbox' | 'calendar' | 'contacts' | 'tasks';
}

/**
 * EWS item identifier
 */
export interface EWSItemId {
  id: string;
  changeKey?: string;
}

/**
 * EWS message properties
 */
export interface EWSMessage {
  itemId?: EWSItemId;
  subject?: string;
  body?: {
    bodyType: 'Text' | 'HTML';
    content: string;
  };
  from?: EWSEmailAddress;
  toRecipients?: EWSEmailAddress[];
  ccRecipients?: EWSEmailAddress[];
  bccRecipients?: EWSEmailAddress[];
  isRead?: boolean;
  importance?: 'Low' | 'Normal' | 'High';
  sensitivity?: 'Normal' | 'Personal' | 'Private' | 'Confidential';
  attachments?: EWSAttachment[];
  internetMessageId?: string;
  dateTimeReceived?: string;
  dateTimeSent?: string;
  hasAttachments?: boolean;
  size?: number;
  categories?: string[];
  inReplyTo?: string;
  references?: string;
}

/**
 * EWS email address
 */
export interface EWSEmailAddress {
  name?: string;
  emailAddress: string;
  routingType?: 'SMTP' | 'EX';
  mailboxType?: 'Mailbox' | 'PublicDL' | 'PrivateDL' | 'Contact' | 'PublicFolder';
}

/**
 * EWS attachment
 */
export interface EWSAttachment {
  attachmentId?: {
    id: string;
    rootItemId?: string;
    rootItemChangeKey?: string;
  };
  name: string;
  contentType?: string;
  contentId?: string;
  contentLocation?: string;
  size?: number;
  isInline?: boolean;
  isContactPhoto?: boolean;
  content?: string; // Base64 encoded
  type: 'file' | 'item';
}

/**
 * EWS calendar item
 */
export interface EWSCalendarItem {
  itemId?: EWSItemId;
  subject: string;
  body?: {
    bodyType: 'Text' | 'HTML';
    content: string;
  };
  start: string; // ISO 8601
  end: string; // ISO 8601
  location?: string;
  requiredAttendees?: EWSEmailAddress[];
  optionalAttendees?: EWSEmailAddress[];
  resources?: EWSEmailAddress[];
  isAllDayEvent?: boolean;
  recurrence?: EWSRecurrencePattern;
  reminder?: number; // minutes before
  importance?: 'Low' | 'Normal' | 'High';
  sensitivity?: 'Normal' | 'Personal' | 'Private' | 'Confidential';
  organizerEmail?: string;
  meetingRequestType?: 'FullUpdate' | 'InformationalUpdate' | 'NewMeetingRequest' | 'None' | 'Outdated' | 'SilentUpdate';
  appointmentType?: 'Single' | 'Occurrence' | 'Exception' | 'RecurringMaster';
}

/**
 * EWS recurrence pattern
 */
export interface EWSRecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
  dayOfMonth?: number;
  month?: number;
  firstDayOfWeek?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  endDate?: string;
  numberOfOccurrences?: number;
}

/**
 * EWS contact
 */
export interface EWSContact {
  itemId?: EWSItemId;
  displayName: string;
  givenName?: string;
  surname?: string;
  emailAddresses?: { key: string; value: string }[];
  phoneNumbers?: { key: string; value: string }[];
  physicalAddresses?: {
    [key: string]: {
      street?: string;
      city?: string;
      state?: string;
      countryOrRegion?: string;
      postalCode?: string;
    };
  };
  companyName?: string;
  department?: string;
  jobTitle?: string;
  manager?: string;
  assistantName?: string;
  birthday?: string;
  spouseName?: string;
  profession?: string;
  imAddresses?: { key: string; value: string }[];
  photo?: string; // Base64 encoded
}

/**
 * EWS folder properties
 */
export interface EWSFolder {
  folderId: EWSFolderId;
  displayName: string;
  totalCount?: number;
  childFolderCount?: number;
  unreadCount?: number;
  folderClass?: string;
  parentFolderId?: EWSFolderId;
}

/**
 * EWS search filter
 */
export interface EWSSearchFilter {
  type: 'and' | 'or' | 'not' | 'exists' | 'isEqualTo' | 'isNotEqualTo' | 'isGreaterThan' | 'isGreaterThanOrEqualTo' | 'isLessThan' | 'isLessThanOrEqualTo' | 'contains';
  field?: string;
  value?: any;
  filters?: EWSSearchFilter[];
  containmentMode?: 'FullString' | 'Prefixed' | 'Substring' | 'PrefixOnWords' | 'ExactPhrase';
  containmentComparison?: 'Exact' | 'IgnoreCase' | 'IgnoreNonSpacingCharacters' | 'Loose' | 'IgnoreCaseAndNonSpacingCharacters' | 'LooseAndIgnoreCase' | 'LooseAndIgnoreNonSpace' | 'LooseAndIgnoreCaseAndIgnoreNonSpace';
}

/**
 * EWS AutoDiscover response
 */
export interface AutoDiscoverResponse {
  displayName: string;
  emailAddress: string;
  ewsUrl: string;
  oabUrl?: string;
  umUrl?: string;
  owaUrl?: string;
  serverVersion?: string;
}

/**
 * EWS availability request
 */
export interface AvailabilityRequest {
  mailboxes: string[];
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  mergedFreeBusyInterval?: number;
  requestedView?: 'FreeBusy' | 'FreeBusyMerged' | 'Detailed' | 'DetailedMerged';
}

/**
 * EWS free/busy time slot
 */
export interface FreeBusyTimeSlot {
  status: 'Free' | 'Tentative' | 'Busy' | 'OOF' | 'NoData';
  startTime: string;
  endTime: string;
}

/**
 * EWS availability response
 */
export interface AvailabilityResponse {
  mailbox: string;
  freeBusyView: FreeBusyTimeSlot[];
  workingHours?: {
    timeZone: string;
    workingPeriods: {
      dayOfWeek: string[];
      startTime: string;
      endTime: string;
    }[];
  };
}

/**
 * Out of Office (OOF) settings
 */
export interface OOFSettings {
  state: 'Disabled' | 'Enabled' | 'Scheduled';
  externalAudience?: 'None' | 'Known' | 'All';
  startTime?: string; // ISO 8601
  endTime?: string; // ISO 8601
  internalReply?: {
    message: string;
  };
  externalReply?: {
    message: string;
  };
}

/**
 * EWS inbox rule
 */
export interface InboxRule {
  ruleId?: string;
  displayName: string;
  priority: number;
  isEnabled: boolean;
  conditions?: {
    fromAddresses?: string[];
    subjectContains?: string[];
    bodyContains?: string[];
    importance?: 'Low' | 'Normal' | 'High';
    sensitivity?: 'Normal' | 'Personal' | 'Private' | 'Confidential';
    hasAttachments?: boolean;
  };
  actions?: {
    moveToFolder?: EWSFolderId;
    delete?: boolean;
    markAsRead?: boolean;
    categorize?: string[];
    forwardTo?: string[];
    stopProcessingRules?: boolean;
  };
  exceptions?: {
    fromAddresses?: string[];
    subjectContains?: string[];
  };
}

/**
 * EWS delegate user
 */
export interface DelegateUser {
  userId: {
    primarySmtpAddress: string;
    displayName?: string;
  };
  permissions: {
    calendarFolderPermissionLevel?: 'None' | 'Reviewer' | 'Author' | 'Editor';
    tasksFolderPermissionLevel?: 'None' | 'Reviewer' | 'Author' | 'Editor';
    inboxFolderPermissionLevel?: 'None' | 'Reviewer' | 'Author' | 'Editor';
    contactsFolderPermissionLevel?: 'None' | 'Reviewer' | 'Author' | 'Editor';
    notesFolderPermissionLevel?: 'None' | 'Reviewer' | 'Author' | 'Editor';
    journalFolderPermissionLevel?: 'None' | 'Reviewer' | 'Author' | 'Editor';
  };
  receivesCopiesOfMeetingMessages: boolean;
  viewPrivateItems: boolean;
}

/**
 * EWS notification subscription
 */
export interface NotificationSubscription {
  subscriptionId: string;
  watermark?: string;
  folderIds: EWSFolderId[];
  eventTypes: ('NewMailEvent' | 'DeletedEvent' | 'ModifiedEvent' | 'MovedEvent' | 'CopiedEvent' | 'CreatedEvent' | 'FreeBusyChangedEvent')[];
  timeout?: number;
}

/**
 * EWS notification event
 */
export interface NotificationEvent {
  type: 'NewMailEvent' | 'DeletedEvent' | 'ModifiedEvent' | 'MovedEvent' | 'CopiedEvent' | 'CreatedEvent' | 'FreeBusyChangedEvent';
  watermark: string;
  timestamp: string;
  itemId?: EWSItemId;
  folderId?: EWSFolderId;
  parentFolderId?: EWSFolderId;
  oldItemId?: EWSItemId;
  oldFolderId?: EWSFolderId;
}

/**
 * SOAP envelope structure
 */
export interface SOAPEnvelope {
  'soap:Envelope': {
    $: {
      'xmlns:soap': string;
      'xmlns:t': string;
      'xmlns:m': string;
    };
    'soap:Header'?: any;
    'soap:Body': any;
  };
}

/**
 * EWS property path
 */
export interface PropertyPath {
  fieldURI?: string;
  extendedFieldURI?: {
    distinguishedPropertySetId?: string;
    propertySetId?: string;
    propertyTag?: string;
    propertyName?: string;
    propertyId?: number;
    propertyType: string;
  };
}

/**
 * REST API mail message (Microsoft Graph compatible)
 */
export interface RestApiMessage {
  id?: string;
  conversationId?: string;
  subject?: string;
  bodyPreview?: string;
  body?: {
    contentType: 'text' | 'html';
    content: string;
  };
  from?: {
    emailAddress: {
      name?: string;
      address: string;
    };
  };
  toRecipients?: Array<{
    emailAddress: {
      name?: string;
      address: string;
    };
  }>;
  ccRecipients?: Array<{
    emailAddress: {
      name?: string;
      address: string;
    };
  }>;
  bccRecipients?: Array<{
    emailAddress: {
      name?: string;
      address: string;
    };
  }>;
  isRead?: boolean;
  isDraft?: boolean;
  importance?: 'low' | 'normal' | 'high';
  inferenceClassification?: 'focused' | 'other';
  receivedDateTime?: string;
  sentDateTime?: string;
  hasAttachments?: boolean;
  internetMessageId?: string;
  categories?: string[];
}

// ============================================================================
// SOAP MESSAGE GENERATION
// ============================================================================

/**
 * Creates a base SOAP envelope for EWS requests.
 * Includes proper namespaces and version headers.
 *
 * @param {EWSVersion} version - Exchange server version
 * @param {any} body - SOAP body content
 * @param {any} header - Optional SOAP header content
 * @returns {SOAPEnvelope} Complete SOAP envelope
 *
 * @example
 * ```typescript
 * const envelope = createSOAPEnvelope(
 *   EWSVersion.Exchange2016,
 *   { 'm:GetFolder': { ... } },
 *   { 't:RequestServerVersion': { $: { Version: 'Exchange2016' } } }
 * );
 * ```
 */
export function createSOAPEnvelope(
  version: EWSVersion,
  body: any,
  header?: any,
): SOAPEnvelope {
  const envelope: SOAPEnvelope = {
    'soap:Envelope': {
      $: {
        'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:t': 'http://schemas.microsoft.com/exchange/services/2006/types',
        'xmlns:m': 'http://schemas.microsoft.com/exchange/services/2006/messages',
      },
      'soap:Body': body,
    },
  };

  if (header) {
    envelope['soap:Envelope']['soap:Header'] = header;
  } else {
    // Add default version header
    envelope['soap:Envelope']['soap:Header'] = {
      't:RequestServerVersion': {
        $: { Version: version },
      },
    };
  }

  return envelope;
}

/**
 * Converts a SOAP envelope object to XML string.
 * Uses xml2js builder with proper formatting.
 *
 * @param {SOAPEnvelope} envelope - SOAP envelope object
 * @returns {string} XML string representation
 *
 * @example
 * ```typescript
 * const xml = buildSOAPXML(envelope);
 * // Returns: <?xml version="1.0"?><soap:Envelope>...</soap:Envelope>
 * ```
 */
export function buildSOAPXML(envelope: SOAPEnvelope): string {
  const builder = new Builder({
    xmldec: { version: '1.0', encoding: 'utf-8' },
    renderOpts: { pretty: false },
  });
  return builder.buildObject(envelope);
}

/**
 * Parses EWS SOAP response XML into JavaScript object.
 * Handles error responses and extracts response messages.
 *
 * @param {string} xmlResponse - SOAP XML response string
 * @returns {Promise<any>} Parsed response object
 *
 * @example
 * ```typescript
 * const response = await parseSOAPResponse(xmlString);
 * const items = response['soap:Body']['m:FindItemResponse']...;
 * ```
 */
export async function parseSOAPResponse(xmlResponse: string): Promise<any> {
  try {
    const result = await parseStringPromise(xmlResponse, {
      explicitArray: false,
      ignoreAttrs: false,
      tagNameProcessors: [],
    });
    return result;
  } catch (error) {
    throw new Error(`Failed to parse SOAP response: ${error}`);
  }
}

/**
 * Creates impersonation header for EWS requests.
 * Allows accessing another user's mailbox with proper permissions.
 *
 * @param {string} emailAddress - Email address to impersonate
 * @param {string} connectingAs - Optional SID or SMTP address
 * @returns {any} Impersonation header object
 *
 * @example
 * ```typescript
 * const header = createImpersonationHeader('user@example.com');
 * // Use in SOAP envelope header
 * ```
 */
export function createImpersonationHeader(
  emailAddress: string,
  connectingAs?: string,
): any {
  return {
    't:ExchangeImpersonation': {
      't:ConnectingSID': {
        't:PrimarySmtpAddress': emailAddress,
      },
    },
  };
}

/**
 * Creates mailbox culture header for localization.
 * Specifies language and culture for mailbox operations.
 *
 * @param {string} culture - Culture code (e.g., 'en-US', 'fr-FR')
 * @returns {any} Mailbox culture header object
 *
 * @example
 * ```typescript
 * const header = createMailboxCultureHeader('en-US');
 * ```
 */
export function createMailboxCultureHeader(culture: string): any {
  return {
    't:MailboxCulture': culture,
  };
}

/**
 * Creates time zone context header for calendar operations.
 * Ensures correct time zone interpretation for appointments.
 *
 * @param {string} timeZoneId - Windows time zone identifier
 * @returns {any} Time zone context header object
 *
 * @example
 * ```typescript
 * const header = createTimeZoneHeader('Pacific Standard Time');
 * ```
 */
export function createTimeZoneHeader(timeZoneId: string): any {
  return {
    't:TimeZoneContext': {
      't:TimeZoneDefinition': {
        $: { Id: timeZoneId },
      },
    },
  };
}

// ============================================================================
// CORE EWS OPERATIONS
// ============================================================================

/**
 * Builds FindItem SOAP request for searching mailbox items.
 * Supports filtering, sorting, and pagination.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSFolderId} folderId - Folder to search in
 * @param {EWSSearchFilter} filter - Optional search filter
 * @param {number} maxResults - Maximum number of results
 * @param {number} offset - Pagination offset
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildFindItemRequest(
 *   EWSVersion.Exchange2016,
 *   { distinguishedId: 'inbox' },
 *   { type: 'isEqualTo', field: 'message:IsRead', value: false },
 *   50,
 *   0
 * );
 * ```
 */
export function buildFindItemRequest(
  version: EWSVersion,
  folderId: EWSFolderId,
  filter?: EWSSearchFilter,
  maxResults: number = 100,
  offset: number = 0,
): string {
  const findItemBody: any = {
    'm:FindItem': {
      $: {
        Traversal: 'Shallow',
      },
      'm:ItemShape': {
        't:BaseShape': 'Default',
        't:IncludeMimeContent': 'false',
      },
      'm:IndexedPageItemView': {
        $: {
          MaxEntriesReturned: maxResults.toString(),
          Offset: offset.toString(),
          BasePoint: 'Beginning',
        },
      },
      'm:ParentFolderIds': {
        't:DistinguishedFolderId': folderId.distinguishedId
          ? { $: { Id: folderId.distinguishedId } }
          : undefined,
        't:FolderId': folderId.id
          ? { $: { Id: folderId.id, ChangeKey: folderId.changeKey } }
          : undefined,
      },
    },
  };

  if (filter) {
    findItemBody['m:FindItem']['m:Restriction'] = buildSearchFilter(filter);
  }

  const envelope = createSOAPEnvelope(version, findItemBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds GetItem SOAP request for retrieving full item details.
 * Includes MIME content, attachments, and all properties.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSItemId[]} itemIds - Array of item IDs to retrieve
 * @param {boolean} includeMime - Include MIME content
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildGetItemRequest(
 *   EWSVersion.Exchange2016,
 *   [{ id: 'AAMkAD...', changeKey: 'CQAAAB...' }],
 *   true
 * );
 * ```
 */
export function buildGetItemRequest(
  version: EWSVersion,
  itemIds: EWSItemId[],
  includeMime: boolean = false,
): string {
  const getItemBody = {
    'm:GetItem': {
      'm:ItemShape': {
        't:BaseShape': 'AllProperties',
        't:IncludeMimeContent': includeMime.toString(),
        't:BodyType': 'HTML',
      },
      'm:ItemIds': {
        't:ItemId': itemIds.map((id) => ({
          $: { Id: id.id, ChangeKey: id.changeKey },
        })),
      },
    },
  };

  const envelope = createSOAPEnvelope(version, getItemBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds CreateItem SOAP request for creating new messages.
 * Supports drafts, send immediately, or save to folder.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSMessage} message - Message to create
 * @param {EWSFolderId} saveFolderId - Folder to save in
 * @param {boolean} sendImmediately - Send message immediately
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildCreateMessageRequest(
 *   EWSVersion.Exchange2016,
 *   { subject: 'Test', body: { bodyType: 'HTML', content: 'Hello' }, toRecipients: [{ emailAddress: 'user@example.com' }] },
 *   { distinguishedId: 'drafts' },
 *   false
 * );
 * ```
 */
export function buildCreateMessageRequest(
  version: EWSVersion,
  message: EWSMessage,
  saveFolderId?: EWSFolderId,
  sendImmediately: boolean = false,
): string {
  const messageDisposition = sendImmediately
    ? 'SendAndSaveCopy'
    : saveFolderId
    ? 'SaveOnly'
    : 'SendOnly';

  const createItemBody: any = {
    'm:CreateItem': {
      $: {
        MessageDisposition: messageDisposition,
      },
      'm:Items': {
        't:Message': {
          't:Subject': message.subject,
          't:Body': message.body
            ? {
                $: { BodyType: message.body.bodyType },
                _: message.body.content,
              }
            : undefined,
          't:ToRecipients': message.toRecipients
            ? {
                't:Mailbox': message.toRecipients.map((r) => ({
                  't:EmailAddress': r.emailAddress,
                  't:Name': r.name,
                })),
              }
            : undefined,
          't:CcRecipients': message.ccRecipients
            ? {
                't:Mailbox': message.ccRecipients.map((r) => ({
                  't:EmailAddress': r.emailAddress,
                  't:Name': r.name,
                })),
              }
            : undefined,
          't:BccRecipients': message.bccRecipients
            ? {
                't:Mailbox': message.bccRecipients.map((r) => ({
                  't:EmailAddress': r.emailAddress,
                  't:Name': r.name,
                })),
              }
            : undefined,
          't:IsRead': message.isRead,
          't:Importance': message.importance,
          't:Sensitivity': message.sensitivity,
        },
      },
    },
  };

  if (saveFolderId && messageDisposition !== 'SendOnly') {
    createItemBody['m:CreateItem']['m:SavedItemFolderId'] = {
      't:DistinguishedFolderId': saveFolderId.distinguishedId
        ? { $: { Id: saveFolderId.distinguishedId } }
        : undefined,
      't:FolderId': saveFolderId.id
        ? { $: { Id: saveFolderId.id, ChangeKey: saveFolderId.changeKey } }
        : undefined,
    };
  }

  const envelope = createSOAPEnvelope(version, createItemBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds UpdateItem SOAP request for modifying item properties.
 * Supports partial updates with change tracking.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSItemId} itemId - Item to update
 * @param {any} updates - Property updates
 * @param {string} conflictResolution - Conflict resolution strategy
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildUpdateItemRequest(
 *   EWSVersion.Exchange2016,
 *   { id: 'AAMkAD...', changeKey: 'CQAAAB...' },
 *   { 'message:IsRead': true },
 *   'AlwaysOverwrite'
 * );
 * ```
 */
export function buildUpdateItemRequest(
  version: EWSVersion,
  itemId: EWSItemId,
  updates: Record<string, any>,
  conflictResolution: 'NeverOverwrite' | 'AutoResolve' | 'AlwaysOverwrite' = 'AutoResolve',
): string {
  const updateItemBody = {
    'm:UpdateItem': {
      $: {
        ConflictResolution: conflictResolution,
        MessageDisposition: 'SaveOnly',
      },
      'm:ItemChanges': {
        't:ItemChange': {
          't:ItemId': {
            $: { Id: itemId.id, ChangeKey: itemId.changeKey },
          },
          't:Updates': buildPropertyUpdates(updates),
        },
      },
    },
  };

  const envelope = createSOAPEnvelope(version, updateItemBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds DeleteItem SOAP request for deleting items.
 * Supports soft delete, hard delete, and move to deleted items.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSItemId[]} itemIds - Items to delete
 * @param {string} deleteType - Deletion type
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildDeleteItemRequest(
 *   EWSVersion.Exchange2016,
 *   [{ id: 'AAMkAD...', changeKey: 'CQAAAB...' }],
 *   'MoveToDeletedItems'
 * );
 * ```
 */
export function buildDeleteItemRequest(
  version: EWSVersion,
  itemIds: EWSItemId[],
  deleteType: 'HardDelete' | 'SoftDelete' | 'MoveToDeletedItems' = 'MoveToDeletedItems',
): string {
  const deleteItemBody = {
    'm:DeleteItem': {
      $: {
        DeleteType: deleteType,
      },
      'm:ItemIds': {
        't:ItemId': itemIds.map((id) => ({
          $: { Id: id.id, ChangeKey: id.changeKey },
        })),
      },
    },
  };

  const envelope = createSOAPEnvelope(version, deleteItemBody);
  return buildSOAPXML(envelope);
}

// ============================================================================
// FOLDER OPERATIONS
// ============================================================================

/**
 * Builds FindFolder SOAP request for discovering mailbox folders.
 * Returns folder hierarchy with metadata.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSFolderId} parentFolderId - Parent folder to search in
 * @param {boolean} deepTraversal - Search all subfolders
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildFindFolderRequest(
 *   EWSVersion.Exchange2016,
 *   { distinguishedId: 'msgfolderroot' },
 *   true
 * );
 * ```
 */
export function buildFindFolderRequest(
  version: EWSVersion,
  parentFolderId: EWSFolderId,
  deepTraversal: boolean = false,
): string {
  const findFolderBody = {
    'm:FindFolder': {
      $: {
        Traversal: deepTraversal ? 'Deep' : 'Shallow',
      },
      'm:FolderShape': {
        't:BaseShape': 'AllProperties',
      },
      'm:ParentFolderIds': {
        't:DistinguishedFolderId': parentFolderId.distinguishedId
          ? { $: { Id: parentFolderId.distinguishedId } }
          : undefined,
        't:FolderId': parentFolderId.id
          ? { $: { Id: parentFolderId.id, ChangeKey: parentFolderId.changeKey } }
          : undefined,
      },
    },
  };

  const envelope = createSOAPEnvelope(version, findFolderBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds GetFolder SOAP request for retrieving folder details.
 * Returns complete folder properties and permissions.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSFolderId[]} folderIds - Folders to retrieve
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildGetFolderRequest(
 *   EWSVersion.Exchange2016,
 *   [{ distinguishedId: 'inbox' }]
 * );
 * ```
 */
export function buildGetFolderRequest(
  version: EWSVersion,
  folderIds: EWSFolderId[],
): string {
  const getFolderBody = {
    'm:GetFolder': {
      'm:FolderShape': {
        't:BaseShape': 'AllProperties',
      },
      'm:FolderIds': {
        't:DistinguishedFolderId': folderIds
          .filter((f) => f.distinguishedId)
          .map((f) => ({ $: { Id: f.distinguishedId } })),
        't:FolderId': folderIds
          .filter((f) => f.id)
          .map((f) => ({ $: { Id: f.id, ChangeKey: f.changeKey } })),
      },
    },
  };

  const envelope = createSOAPEnvelope(version, getFolderBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds CreateFolder SOAP request for creating new folders.
 * Creates folders in specified parent folder.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {string} folderName - Name of new folder
 * @param {EWSFolderId} parentFolderId - Parent folder
 * @param {string} folderClass - Folder class (IPF.Note, IPF.Appointment, etc.)
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildCreateFolderRequest(
 *   EWSVersion.Exchange2016,
 *   'Archive',
 *   { distinguishedId: 'inbox' },
 *   'IPF.Note'
 * );
 * ```
 */
export function buildCreateFolderRequest(
  version: EWSVersion,
  folderName: string,
  parentFolderId: EWSFolderId,
  folderClass: string = 'IPF.Note',
): string {
  const createFolderBody = {
    'm:CreateFolder': {
      'm:ParentFolderId': {
        't:DistinguishedFolderId': parentFolderId.distinguishedId
          ? { $: { Id: parentFolderId.distinguishedId } }
          : undefined,
        't:FolderId': parentFolderId.id
          ? { $: { Id: parentFolderId.id, ChangeKey: parentFolderId.changeKey } }
          : undefined,
      },
      'm:Folders': {
        't:Folder': {
          't:DisplayName': folderName,
          't:FolderClass': folderClass,
        },
      },
    },
  };

  const envelope = createSOAPEnvelope(version, createFolderBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds DeleteFolder SOAP request for removing folders.
 * Supports hard delete or move to deleted items.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSFolderId[]} folderIds - Folders to delete
 * @param {string} deleteType - Deletion type
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildDeleteFolderRequest(
 *   EWSVersion.Exchange2016,
 *   [{ id: 'AAMkAD...', changeKey: 'AQAAAB...' }],
 *   'HardDelete'
 * );
 * ```
 */
export function buildDeleteFolderRequest(
  version: EWSVersion,
  folderIds: EWSFolderId[],
  deleteType: 'HardDelete' | 'SoftDelete' | 'MoveToDeletedItems' = 'MoveToDeletedItems',
): string {
  const deleteFolderBody = {
    'm:DeleteFolder': {
      $: {
        DeleteType: deleteType,
      },
      'm:FolderIds': {
        't:FolderId': folderIds.map((f) => ({
          $: { Id: f.id, ChangeKey: f.changeKey },
        })),
      },
    },
  };

  const envelope = createSOAPEnvelope(version, deleteFolderBody);
  return buildSOAPXML(envelope);
}

// ============================================================================
// CALENDAR OPERATIONS
// ============================================================================

/**
 * Builds CreateCalendarItem SOAP request for creating appointments.
 * Supports single and recurring appointments with attendees.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSCalendarItem} calendarItem - Calendar item to create
 * @param {boolean} sendInvitations - Send meeting invitations
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildCreateCalendarItemRequest(
 *   EWSVersion.Exchange2016,
 *   { subject: 'Team Meeting', start: '2025-11-10T14:00:00Z', end: '2025-11-10T15:00:00Z', requiredAttendees: [{ emailAddress: 'user@example.com' }] },
 *   true
 * );
 * ```
 */
export function buildCreateCalendarItemRequest(
  version: EWSVersion,
  calendarItem: EWSCalendarItem,
  sendInvitations: boolean = false,
): string {
  const sendMeetingInvitations = sendInvitations
    ? 'SendToAllAndSaveCopy'
    : 'SendToNone';

  const calendarItemObj: any = {
    't:Subject': calendarItem.subject,
    't:Body': calendarItem.body
      ? {
          $: { BodyType: calendarItem.body.bodyType },
          _: calendarItem.body.content,
        }
      : undefined,
    't:Start': calendarItem.start,
    't:End': calendarItem.end,
    't:Location': calendarItem.location,
    't:IsAllDayEvent': calendarItem.isAllDayEvent,
    't:ReminderMinutesBeforeStart': calendarItem.reminder,
    't:Importance': calendarItem.importance,
    't:Sensitivity': calendarItem.sensitivity,
  };

  if (calendarItem.requiredAttendees) {
    calendarItemObj['t:RequiredAttendees'] = {
      't:Attendee': calendarItem.requiredAttendees.map((a) => ({
        't:Mailbox': {
          't:EmailAddress': a.emailAddress,
          't:Name': a.name,
        },
      })),
    };
  }

  if (calendarItem.optionalAttendees) {
    calendarItemObj['t:OptionalAttendees'] = {
      't:Attendee': calendarItem.optionalAttendees.map((a) => ({
        't:Mailbox': {
          't:EmailAddress': a.emailAddress,
          't:Name': a.name,
        },
      })),
    };
  }

  if (calendarItem.recurrence) {
    calendarItemObj['t:Recurrence'] = buildRecurrencePattern(
      calendarItem.recurrence,
    );
  }

  const createItemBody = {
    'm:CreateItem': {
      $: {
        SendMeetingInvitations: sendMeetingInvitations,
      },
      'm:SavedItemFolderId': {
        't:DistinguishedFolderId': {
          $: { Id: 'calendar' },
        },
      },
      'm:Items': {
        't:CalendarItem': calendarItemObj,
      },
    },
  };

  const envelope = createSOAPEnvelope(version, createItemBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds FindCalendarItem SOAP request for searching calendar.
 * Supports date range filtering and recurrence expansion.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {string} startDate - Start date (ISO 8601)
 * @param {string} endDate - End date (ISO 8601)
 * @param {number} maxResults - Maximum results
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildFindCalendarItemsRequest(
 *   EWSVersion.Exchange2016,
 *   '2025-11-01T00:00:00Z',
 *   '2025-11-30T23:59:59Z',
 *   100
 * );
 * ```
 */
export function buildFindCalendarItemsRequest(
  version: EWSVersion,
  startDate: string,
  endDate: string,
  maxResults: number = 100,
): string {
  const findItemBody = {
    'm:FindItem': {
      $: {
        Traversal: 'Shallow',
      },
      'm:ItemShape': {
        't:BaseShape': 'AllProperties',
      },
      'm:CalendarView': {
        $: {
          MaxEntriesReturned: maxResults.toString(),
          StartDate: startDate,
          EndDate: endDate,
        },
      },
      'm:ParentFolderIds': {
        't:DistinguishedFolderId': {
          $: { Id: 'calendar' },
        },
      },
    },
  };

  const envelope = createSOAPEnvelope(version, findItemBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds UpdateCalendarItem SOAP request for modifying appointments.
 * Handles recurring appointments and sends updates to attendees.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSItemId} itemId - Calendar item to update
 * @param {Partial<EWSCalendarItem>} updates - Property updates
 * @param {boolean} sendUpdates - Send updates to attendees
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildUpdateCalendarItemRequest(
 *   EWSVersion.Exchange2016,
 *   { id: 'AAMkAD...', changeKey: 'CQAAAB...' },
 *   { location: 'Conference Room B' },
 *   true
 * );
 * ```
 */
export function buildUpdateCalendarItemRequest(
  version: EWSVersion,
  itemId: EWSItemId,
  updates: Partial<EWSCalendarItem>,
  sendUpdates: boolean = false,
): string {
  const sendMeetingInvitationsOrCancellations = sendUpdates
    ? 'SendToAllAndSaveCopy'
    : 'SendToNone';

  const propertyUpdates: any = {};
  if (updates.subject) propertyUpdates['calendar:Subject'] = updates.subject;
  if (updates.location) propertyUpdates['calendar:Location'] = updates.location;
  if (updates.start) propertyUpdates['calendar:Start'] = updates.start;
  if (updates.end) propertyUpdates['calendar:End'] = updates.end;

  const updateItemBody = {
    'm:UpdateItem': {
      $: {
        ConflictResolution: 'AlwaysOverwrite',
        SendMeetingInvitationsOrCancellations:
          sendMeetingInvitationsOrCancellations,
      },
      'm:ItemChanges': {
        't:ItemChange': {
          't:ItemId': {
            $: { Id: itemId.id, ChangeKey: itemId.changeKey },
          },
          't:Updates': buildPropertyUpdates(propertyUpdates),
        },
      },
    },
  };

  const envelope = createSOAPEnvelope(version, updateItemBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds DeleteCalendarItem SOAP request for canceling appointments.
 * Sends cancellation notices to attendees.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSItemId} itemId - Calendar item to delete
 * @param {boolean} sendCancellations - Send cancellation notices
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildDeleteCalendarItemRequest(
 *   EWSVersion.Exchange2016,
 *   { id: 'AAMkAD...', changeKey: 'CQAAAB...' },
 *   true
 * );
 * ```
 */
export function buildDeleteCalendarItemRequest(
  version: EWSVersion,
  itemId: EWSItemId,
  sendCancellations: boolean = false,
): string {
  const sendMeetingCancellations = sendCancellations
    ? 'SendToAllAndSaveCopy'
    : 'SendToNone';

  const deleteItemBody = {
    'm:DeleteItem': {
      $: {
        DeleteType: 'MoveToDeletedItems',
        SendMeetingCancellations: sendMeetingCancellations,
      },
      'm:ItemIds': {
        't:ItemId': {
          $: { Id: itemId.id, ChangeKey: itemId.changeKey },
        },
      },
    },
  };

  const envelope = createSOAPEnvelope(version, deleteItemBody);
  return buildSOAPXML(envelope);
}

// ============================================================================
// CONTACT OPERATIONS
// ============================================================================

/**
 * Builds CreateContact SOAP request for creating contact items.
 * Supports all contact fields including photos.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSContact} contact - Contact to create
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildCreateContactRequest(
 *   EWSVersion.Exchange2016,
 *   { displayName: 'John Doe', emailAddresses: [{ key: 'EmailAddress1', value: 'john@example.com' }] }
 * );
 * ```
 */
export function buildCreateContactRequest(
  version: EWSVersion,
  contact: EWSContact,
): string {
  const contactObj: any = {
    't:DisplayName': contact.displayName,
    't:GivenName': contact.givenName,
    't:Surname': contact.surname,
    't:CompanyName': contact.companyName,
    't:Department': contact.department,
    't:JobTitle': contact.jobTitle,
  };

  if (contact.emailAddresses) {
    contactObj['t:EmailAddresses'] = {
      't:Entry': contact.emailAddresses.map((e) => ({
        $: { Key: e.key },
        _: e.value,
      })),
    };
  }

  if (contact.phoneNumbers) {
    contactObj['t:PhoneNumbers'] = {
      't:Entry': contact.phoneNumbers.map((p) => ({
        $: { Key: p.key },
        _: p.value,
      })),
    };
  }

  if (contact.physicalAddresses) {
    contactObj['t:PhysicalAddresses'] = {
      't:Entry': Object.entries(contact.physicalAddresses).map(([key, addr]) => ({
        $: { Key: key },
        't:Street': addr.street,
        't:City': addr.city,
        't:State': addr.state,
        't:CountryOrRegion': addr.countryOrRegion,
        't:PostalCode': addr.postalCode,
      })),
    };
  }

  const createItemBody = {
    'm:CreateItem': {
      'm:SavedItemFolderId': {
        't:DistinguishedFolderId': {
          $: { Id: 'contacts' },
        },
      },
      'm:Items': {
        't:Contact': contactObj,
      },
    },
  };

  const envelope = createSOAPEnvelope(version, createItemBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds FindContact SOAP request for searching contacts.
 * Supports name and email filtering.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {string} searchQuery - Search query string
 * @param {number} maxResults - Maximum results
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildFindContactsRequest(
 *   EWSVersion.Exchange2016,
 *   'john',
 *   50
 * );
 * ```
 */
export function buildFindContactsRequest(
  version: EWSVersion,
  searchQuery?: string,
  maxResults: number = 100,
): string {
  const findItemBody: any = {
    'm:FindItem': {
      $: {
        Traversal: 'Shallow',
      },
      'm:ItemShape': {
        't:BaseShape': 'AllProperties',
      },
      'm:IndexedPageItemView': {
        $: {
          MaxEntriesReturned: maxResults.toString(),
          Offset: '0',
          BasePoint: 'Beginning',
        },
      },
      'm:ParentFolderIds': {
        't:DistinguishedFolderId': {
          $: { Id: 'contacts' },
        },
      },
    },
  };

  if (searchQuery) {
    findItemBody['m:FindItem']['m:Restriction'] = {
      't:Or': {
        't:Contains': [
          {
            $: {
              ContainmentMode: 'Substring',
              ContainmentComparison: 'IgnoreCase',
            },
            't:FieldURI': { $: { FieldURI: 'contacts:DisplayName' } },
            't:Constant': { $: { Value: searchQuery } },
          },
          {
            $: {
              ContainmentMode: 'Substring',
              ContainmentComparison: 'IgnoreCase',
            },
            't:FieldURI': { $: { FieldURI: 'contacts:EmailAddress1' } },
            't:Constant': { $: { Value: searchQuery } },
          },
        ],
      },
    };
  }

  const envelope = createSOAPEnvelope(version, findItemBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds UpdateContact SOAP request for modifying contacts.
 * Supports partial updates of contact fields.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSItemId} itemId - Contact item to update
 * @param {Partial<EWSContact>} updates - Property updates
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildUpdateContactRequest(
 *   EWSVersion.Exchange2016,
 *   { id: 'AAMkAD...', changeKey: 'CQAAAB...' },
 *   { jobTitle: 'Senior Manager' }
 * );
 * ```
 */
export function buildUpdateContactRequest(
  version: EWSVersion,
  itemId: EWSItemId,
  updates: Partial<EWSContact>,
): string {
  const propertyUpdates: any = {};
  if (updates.displayName) propertyUpdates['contacts:DisplayName'] = updates.displayName;
  if (updates.givenName) propertyUpdates['contacts:GivenName'] = updates.givenName;
  if (updates.surname) propertyUpdates['contacts:Surname'] = updates.surname;
  if (updates.jobTitle) propertyUpdates['contacts:JobTitle'] = updates.jobTitle;
  if (updates.companyName) propertyUpdates['contacts:CompanyName'] = updates.companyName;

  const updateItemBody = {
    'm:UpdateItem': {
      $: {
        ConflictResolution: 'AutoResolve',
      },
      'm:ItemChanges': {
        't:ItemChange': {
          't:ItemId': {
            $: { Id: itemId.id, ChangeKey: itemId.changeKey },
          },
          't:Updates': buildPropertyUpdates(propertyUpdates),
        },
      },
    },
  };

  const envelope = createSOAPEnvelope(version, updateItemBody);
  return buildSOAPXML(envelope);
}

// ============================================================================
// AUTODISCOVER PROTOCOL
// ============================================================================

/**
 * Builds AutoDiscover SOAP request for discovering Exchange settings.
 * Returns EWS URL and other service endpoints.
 *
 * @param {string} emailAddress - User's email address
 * @returns {string} AutoDiscover XML request
 *
 * @example
 * ```typescript
 * const request = buildAutoDiscoverRequest('user@example.com');
 * // POST to https://autodiscover.example.com/autodiscover/autodiscover.svc
 * ```
 */
export function buildAutoDiscoverRequest(emailAddress: string): string {
  const autoDiscoverBody = {
    'soap:Envelope': {
      $: {
        'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:a': 'http://schemas.microsoft.com/exchange/2010/Autodiscover',
        'xmlns:wsa': 'http://www.w3.org/2005/08/addressing',
      },
      'soap:Header': {
        'a:RequestedServerVersion': 'Exchange2016',
        'wsa:Action': 'http://schemas.microsoft.com/exchange/2010/Autodiscover/Autodiscover/GetUserSettings',
        'wsa:To': 'https://autodiscover-s.outlook.com/autodiscover/autodiscover.svc',
      },
      'soap:Body': {
        'a:GetUserSettingsRequestMessage': {
          'a:Request': {
            'a:Users': {
              'a:User': {
                'a:Mailbox': emailAddress,
              },
            },
            'a:RequestedSettings': {
              'a:Setting': [
                'InternalEwsUrl',
                'ExternalEwsUrl',
                'UserDisplayName',
                'UserDN',
                'UserDeploymentId',
                'InternalMailboxServer',
                'MailboxDN',
                'PublicFolderServer',
                'ActiveDirectoryServer',
                'CasVersion',
                'EwsSupportedSchemas',
              ],
            },
          },
        },
      },
    },
  };

  const builder = new Builder({
    xmldec: { version: '1.0', encoding: 'utf-8' },
    renderOpts: { pretty: false },
  });
  return builder.buildObject(autoDiscoverBody);
}

/**
 * Parses AutoDiscover SOAP response.
 * Extracts service URLs and user settings.
 *
 * @param {string} xmlResponse - AutoDiscover XML response
 * @returns {Promise<AutoDiscoverResponse>} Parsed AutoDiscover data
 *
 * @example
 * ```typescript
 * const settings = await parseAutoDiscoverResponse(responseXml);
 * console.log(settings.ewsUrl); // https://outlook.office365.com/EWS/Exchange.asmx
 * ```
 */
export async function parseAutoDiscoverResponse(
  xmlResponse: string,
): Promise<AutoDiscoverResponse> {
  const parsed = await parseSOAPResponse(xmlResponse);
  const response =
    parsed['soap:Envelope']['soap:Body']['GetUserSettingsResponseMessage'][
      'Response'
    ]['UserResponses']['UserResponse'];

  const settings: any = {};
  const userSettings = response['UserSettings']['UserSetting'];

  if (Array.isArray(userSettings)) {
    userSettings.forEach((setting: any) => {
      settings[setting.Name] = setting.Value;
    });
  } else {
    settings[userSettings.Name] = userSettings.Value;
  }

  return {
    displayName: settings.UserDisplayName || '',
    emailAddress: response['ErrorMessage'] || '',
    ewsUrl: settings.ExternalEwsUrl || settings.InternalEwsUrl || '',
    oabUrl: settings.ExternalOABUrl || settings.InternalOABUrl,
    umUrl: settings.ExternalUMUrl || settings.InternalUMUrl,
    owaUrl: settings.ExternalWebClientUrls || settings.InternalWebClientUrls,
    serverVersion: settings.CasVersion,
  };
}

/**
 * Constructs AutoDiscover URL from email domain.
 * Tries multiple AutoDiscover endpoint formats.
 *
 * @param {string} emailAddress - User's email address
 * @returns {string[]} Array of AutoDiscover URLs to try
 *
 * @example
 * ```typescript
 * const urls = getAutoDiscoverUrls('user@example.com');
 * // ['https://autodiscover.example.com/autodiscover/autodiscover.svc', ...]
 * ```
 */
export function getAutoDiscoverUrls(emailAddress: string): string[] {
  const domain = emailAddress.split('@')[1];
  return [
    `https://autodiscover.${domain}/autodiscover/autodiscover.svc`,
    `https://${domain}/autodiscover/autodiscover.svc`,
    `https://autodiscover-s.outlook.com/autodiscover/autodiscover.svc`,
    `https://outlook.office365.com/autodiscover/autodiscover.svc`,
  ];
}

// ============================================================================
// AVAILABILITY SERVICE
// ============================================================================

/**
 * Builds GetUserAvailability SOAP request for free/busy lookup.
 * Returns availability information for specified time range.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {AvailabilityRequest} request - Availability request parameters
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildGetAvailabilityRequest(
 *   EWSVersion.Exchange2016,
 *   { mailboxes: ['user1@example.com', 'user2@example.com'], startTime: '2025-11-10T00:00:00Z', endTime: '2025-11-10T23:59:59Z', requestedView: 'FreeBusy' }
 * );
 * ```
 */
export function buildGetAvailabilityRequest(
  version: EWSVersion,
  request: AvailabilityRequest,
): string {
  const availabilityBody = {
    'm:GetUserAvailabilityRequest': {
      't:TimeZone': {
        't:Bias': '0',
        't:StandardTime': {
          't:Bias': '0',
          't:Time': '00:00:00',
          't:DayOrder': '0',
          't:Month': '0',
          't:DayOfWeek': 'Sunday',
        },
      },
      't:MailboxDataArray': {
        't:MailboxData': request.mailboxes.map((email) => ({
          't:Email': {
            't:Address': email,
          },
          't:AttendeeType': 'Required',
          't:ExcludeConflicts': 'false',
        })),
      },
      't:FreeBusyViewOptions': {
        't:TimeWindow': {
          't:StartTime': request.startTime,
          't:EndTime': request.endTime,
        },
        't:MergedFreeBusyIntervalInMinutes':
          request.mergedFreeBusyInterval || 30,
        't:RequestedView': request.requestedView || 'FreeBusy',
      },
    },
  };

  const envelope = createSOAPEnvelope(version, availabilityBody);
  return buildSOAPXML(envelope);
}

/**
 * Parses GetUserAvailability SOAP response.
 * Extracts free/busy time slots for each mailbox.
 *
 * @param {string} xmlResponse - Availability SOAP response
 * @returns {Promise<AvailabilityResponse[]>} Parsed availability data
 *
 * @example
 * ```typescript
 * const availability = await parseAvailabilityResponse(responseXml);
 * availability.forEach(userAvail => {
 *   console.log(userAvail.mailbox, userAvail.freeBusyView);
 * });
 * ```
 */
export async function parseAvailabilityResponse(
  xmlResponse: string,
): Promise<AvailabilityResponse[]> {
  const parsed = await parseSOAPResponse(xmlResponse);
  const freeBusyResponseArray =
    parsed['soap:Envelope']['soap:Body']['GetUserAvailabilityResponse'][
      'FreeBusyResponseArray'
    ]['FreeBusyResponse'];

  const responses: AvailabilityResponse[] = [];
  const responseArray = Array.isArray(freeBusyResponseArray)
    ? freeBusyResponseArray
    : [freeBusyResponseArray];

  for (const response of responseArray) {
    if (response.ResponseMessage.ResponseClass === 'Success') {
      const freeBusyView = response.FreeBusyView;
      const calendarEventArray = freeBusyView.CalendarEventArray?.CalendarEvent || [];
      const events = Array.isArray(calendarEventArray) ? calendarEventArray : [calendarEventArray];

      responses.push({
        mailbox: '', // Extract from request context
        freeBusyView: events.map((event: any) => ({
          status: event.BusyType,
          startTime: event.StartTime,
          endTime: event.EndTime,
        })),
      });
    }
  }

  return responses;
}

// ============================================================================
// OUT OF OFFICE (OOF) SETTINGS
// ============================================================================

/**
 * Builds GetUserOofSettings SOAP request.
 * Retrieves current Out of Office configuration.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {string} emailAddress - User's email address
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildGetOOFSettingsRequest(
 *   EWSVersion.Exchange2016,
 *   'user@example.com'
 * );
 * ```
 */
export function buildGetOOFSettingsRequest(
  version: EWSVersion,
  emailAddress: string,
): string {
  const oofBody = {
    'm:GetUserOofSettingsRequest': {
      't:Mailbox': {
        't:Address': emailAddress,
      },
    },
  };

  const envelope = createSOAPEnvelope(version, oofBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds SetUserOofSettings SOAP request.
 * Configures Out of Office auto-reply settings.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {string} emailAddress - User's email address
 * @param {OOFSettings} settings - OOF configuration
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildSetOOFSettingsRequest(
 *   EWSVersion.Exchange2016,
 *   'user@example.com',
 *   { state: 'Enabled', internalReply: { message: 'Out of office' }, externalReply: { message: 'Out of office' } }
 * );
 * ```
 */
export function buildSetOOFSettingsRequest(
  version: EWSVersion,
  emailAddress: string,
  settings: OOFSettings,
): string {
  const userOofSettings: any = {
    't:OofState': settings.state,
    't:ExternalAudience': settings.externalAudience || 'All',
  };

  if (settings.state === 'Scheduled') {
    userOofSettings['t:Duration'] = {
      't:StartTime': settings.startTime,
      't:EndTime': settings.endTime,
    };
  }

  if (settings.internalReply) {
    userOofSettings['t:InternalReply'] = {
      't:Message': settings.internalReply.message,
    };
  }

  if (settings.externalReply) {
    userOofSettings['t:ExternalReply'] = {
      't:Message': settings.externalReply.message,
    };
  }

  const oofBody = {
    'm:SetUserOofSettingsRequest': {
      't:Mailbox': {
        't:Address': emailAddress,
      },
      't:UserOofSettings': userOofSettings,
    },
  };

  const envelope = createSOAPEnvelope(version, oofBody);
  return buildSOAPXML(envelope);
}

// ============================================================================
// MAILBOX RULES
// ============================================================================

/**
 * Builds GetInboxRules SOAP request.
 * Retrieves all inbox rules for the mailbox.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {string} emailAddress - User's email address
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildGetInboxRulesRequest(
 *   EWSVersion.Exchange2016,
 *   'user@example.com'
 * );
 * ```
 */
export function buildGetInboxRulesRequest(
  version: EWSVersion,
  emailAddress: string,
): string {
  const rulesBody = {
    'm:GetInboxRules': {
      'm:MailboxSmtpAddress': emailAddress,
    },
  };

  const envelope = createSOAPEnvelope(version, rulesBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds UpdateInboxRules SOAP request.
 * Creates, updates, or deletes inbox rules.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {string} emailAddress - User's email address
 * @param {InboxRule[]} rulesToCreate - Rules to create
 * @param {InboxRule[]} rulesToUpdate - Rules to update
 * @param {string[]} ruleIdsToDelete - Rule IDs to delete
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildUpdateInboxRulesRequest(
 *   EWSVersion.Exchange2016,
 *   'user@example.com',
 *   [{ displayName: 'Move to Archive', priority: 1, isEnabled: true, conditions: { fromAddresses: ['boss@example.com'] }, actions: { moveToFolder: { id: 'AAMkAD...' } } }],
 *   [],
 *   []
 * );
 * ```
 */
export function buildUpdateInboxRulesRequest(
  version: EWSVersion,
  emailAddress: string,
  rulesToCreate: InboxRule[] = [],
  rulesToUpdate: InboxRule[] = [],
  ruleIdsToDelete: string[] = [],
): string {
  const operations: any = {};

  if (rulesToCreate.length > 0) {
    operations['t:CreateRuleOperation'] = rulesToCreate.map((rule) => ({
      't:Rule': buildInboxRuleObject(rule),
    }));
  }

  if (rulesToUpdate.length > 0) {
    operations['t:SetRuleOperation'] = rulesToUpdate.map((rule) => ({
      't:Rule': buildInboxRuleObject(rule),
    }));
  }

  if (ruleIdsToDelete.length > 0) {
    operations['t:DeleteRuleOperation'] = ruleIdsToDelete.map((ruleId) => ({
      't:RuleId': ruleId,
    }));
  }

  const rulesBody = {
    'm:UpdateInboxRules': {
      'm:MailboxSmtpAddress': emailAddress,
      'm:RemoveOutlookRuleBlob': 'false',
      'm:Operations': operations,
    },
  };

  const envelope = createSOAPEnvelope(version, rulesBody);
  return buildSOAPXML(envelope);
}

// ============================================================================
// DELEGATION MANAGEMENT
// ============================================================================

/**
 * Builds AddDelegate SOAP request.
 * Grants delegate permissions to another user.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {string} mailboxEmail - Mailbox owner's email
 * @param {DelegateUser} delegateUser - Delegate user configuration
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildAddDelegateRequest(
 *   EWSVersion.Exchange2016,
 *   'owner@example.com',
 *   { userId: { primarySmtpAddress: 'delegate@example.com' }, permissions: { calendarFolderPermissionLevel: 'Editor' }, receivesCopiesOfMeetingMessages: true, viewPrivateItems: false }
 * );
 * ```
 */
export function buildAddDelegateRequest(
  version: EWSVersion,
  mailboxEmail: string,
  delegateUser: DelegateUser,
): string {
  const delegateBody = {
    'm:AddDelegate': {
      'm:Mailbox': {
        't:EmailAddress': mailboxEmail,
      },
      'm:DelegateUsers': {
        't:DelegateUser': {
          't:UserId': {
            't:PrimarySmtpAddress': delegateUser.userId.primarySmtpAddress,
          },
          't:DelegatePermissions': {
            't:CalendarFolderPermissionLevel':
              delegateUser.permissions.calendarFolderPermissionLevel || 'None',
            't:TasksFolderPermissionLevel':
              delegateUser.permissions.tasksFolderPermissionLevel || 'None',
            't:InboxFolderPermissionLevel':
              delegateUser.permissions.inboxFolderPermissionLevel || 'None',
            't:ContactsFolderPermissionLevel':
              delegateUser.permissions.contactsFolderPermissionLevel || 'None',
            't:NotesFolderPermissionLevel':
              delegateUser.permissions.notesFolderPermissionLevel || 'None',
            't:JournalFolderPermissionLevel':
              delegateUser.permissions.journalFolderPermissionLevel || 'None',
          },
          't:ReceiveCopiesOfMeetingMessages':
            delegateUser.receivesCopiesOfMeetingMessages.toString(),
          't:ViewPrivateItems': delegateUser.viewPrivateItems.toString(),
        },
      },
      'm:DeliverMeetingRequests': 'DelegatesAndMe',
    },
  };

  const envelope = createSOAPEnvelope(version, delegateBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds GetDelegate SOAP request.
 * Retrieves current delegate permissions.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {string} mailboxEmail - Mailbox owner's email
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildGetDelegateRequest(
 *   EWSVersion.Exchange2016,
 *   'owner@example.com'
 * );
 * ```
 */
export function buildGetDelegateRequest(
  version: EWSVersion,
  mailboxEmail: string,
): string {
  const delegateBody = {
    'm:GetDelegate': {
      'm:Mailbox': {
        't:EmailAddress': mailboxEmail,
      },
      'm:IncludePermissions': 'true',
    },
  };

  const envelope = createSOAPEnvelope(version, delegateBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds RemoveDelegate SOAP request.
 * Removes delegate permissions from a user.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {string} mailboxEmail - Mailbox owner's email
 * @param {string} delegateEmail - Delegate user's email to remove
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildRemoveDelegateRequest(
 *   EWSVersion.Exchange2016,
 *   'owner@example.com',
 *   'delegate@example.com'
 * );
 * ```
 */
export function buildRemoveDelegateRequest(
  version: EWSVersion,
  mailboxEmail: string,
  delegateEmail: string,
): string {
  const delegateBody = {
    'm:RemoveDelegate': {
      'm:Mailbox': {
        't:EmailAddress': mailboxEmail,
      },
      'm:UserIds': {
        't:UserId': {
          't:PrimarySmtpAddress': delegateEmail,
        },
      },
    },
  };

  const envelope = createSOAPEnvelope(version, delegateBody);
  return buildSOAPXML(envelope);
}

// ============================================================================
// STREAMING NOTIFICATIONS
// ============================================================================

/**
 * Builds Subscribe SOAP request for streaming notifications.
 * Creates a subscription for real-time event notifications.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {EWSFolderId[]} folderIds - Folders to monitor
 * @param {string[]} eventTypes - Event types to receive
 * @param {number} timeout - Subscription timeout in minutes
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildSubscribeRequest(
 *   EWSVersion.Exchange2016,
 *   [{ distinguishedId: 'inbox' }],
 *   ['NewMailEvent', 'ModifiedEvent'],
 *   30
 * );
 * ```
 */
export function buildSubscribeRequest(
  version: EWSVersion,
  folderIds: EWSFolderId[],
  eventTypes: string[],
  timeout: number = 30,
): string {
  const subscribeBody = {
    'm:Subscribe': {
      'm:StreamingSubscriptionRequest': {
        't:FolderIds': {
          't:DistinguishedFolderId': folderIds
            .filter((f) => f.distinguishedId)
            .map((f) => ({ $: { Id: f.distinguishedId } })),
          't:FolderId': folderIds
            .filter((f) => f.id)
            .map((f) => ({ $: { Id: f.id, ChangeKey: f.changeKey } })),
        },
        't:EventTypes': {
          't:EventType': eventTypes,
        },
      },
    },
  };

  const envelope = createSOAPEnvelope(version, subscribeBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds GetStreamingEvents SOAP request.
 * Retrieves events from an active streaming subscription.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {string[]} subscriptionIds - Subscription IDs to monitor
 * @param {number} connectionTimeout - Connection timeout in minutes
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildGetStreamingEventsRequest(
 *   EWSVersion.Exchange2016,
 *   ['JgBjbzE5LmV...'],
 *   30
 * );
 * ```
 */
export function buildGetStreamingEventsRequest(
  version: EWSVersion,
  subscriptionIds: string[],
  connectionTimeout: number = 30,
): string {
  const eventsBody = {
    'm:GetStreamingEvents': {
      'm:SubscriptionIds': {
        't:SubscriptionId': subscriptionIds,
      },
      'm:ConnectionTimeout': connectionTimeout.toString(),
    },
  };

  const envelope = createSOAPEnvelope(version, eventsBody);
  return buildSOAPXML(envelope);
}

/**
 * Builds Unsubscribe SOAP request.
 * Cancels an active notification subscription.
 *
 * @param {EWSVersion} version - Exchange version
 * @param {string} subscriptionId - Subscription ID to cancel
 * @returns {string} SOAP XML request
 *
 * @example
 * ```typescript
 * const request = buildUnsubscribeRequest(
 *   EWSVersion.Exchange2016,
 *   'JgBjbzE5LmV...'
 * );
 * ```
 */
export function buildUnsubscribeRequest(
  version: EWSVersion,
  subscriptionId: string,
): string {
  const unsubscribeBody = {
    'm:Unsubscribe': {
      'm:SubscriptionId': subscriptionId,
    },
  };

  const envelope = createSOAPEnvelope(version, unsubscribeBody);
  return buildSOAPXML(envelope);
}

// ============================================================================
// REST API EQUIVALENTS (Microsoft Graph Compatible)
// ============================================================================

/**
 * Converts EWS message to Microsoft Graph REST API format.
 * Enables compatibility with modern Microsoft 365 APIs.
 *
 * @param {EWSMessage} ewsMessage - EWS message object
 * @returns {RestApiMessage} Graph-compatible message
 *
 * @example
 * ```typescript
 * const graphMessage = convertEWSToRestMessage(ewsMessage);
 * // Use with Microsoft Graph API
 * ```
 */
export function convertEWSToRestMessage(ewsMessage: EWSMessage): RestApiMessage {
  return {
    id: ewsMessage.itemId?.id,
    subject: ewsMessage.subject,
    body: ewsMessage.body
      ? {
          contentType: ewsMessage.body.bodyType.toLowerCase() as 'text' | 'html',
          content: ewsMessage.body.content,
        }
      : undefined,
    from: ewsMessage.from
      ? {
          emailAddress: {
            name: ewsMessage.from.name,
            address: ewsMessage.from.emailAddress,
          },
        }
      : undefined,
    toRecipients: ewsMessage.toRecipients?.map((r) => ({
      emailAddress: {
        name: r.name,
        address: r.emailAddress,
      },
    })),
    ccRecipients: ewsMessage.ccRecipients?.map((r) => ({
      emailAddress: {
        name: r.name,
        address: r.emailAddress,
      },
    })),
    bccRecipients: ewsMessage.bccRecipients?.map((r) => ({
      emailAddress: {
        name: r.name,
        address: r.emailAddress,
      },
    })),
    isRead: ewsMessage.isRead,
    importance: ewsMessage.importance?.toLowerCase() as 'low' | 'normal' | 'high',
    receivedDateTime: ewsMessage.dateTimeReceived,
    sentDateTime: ewsMessage.dateTimeSent,
    hasAttachments: ewsMessage.hasAttachments,
    internetMessageId: ewsMessage.internetMessageId,
    categories: ewsMessage.categories,
  };
}

/**
 * Converts Microsoft Graph REST message to EWS format.
 * Enables backward compatibility with EWS operations.
 *
 * @param {RestApiMessage} restMessage - Graph API message
 * @returns {EWSMessage} EWS-compatible message
 *
 * @example
 * ```typescript
 * const ewsMessage = convertRestToEWSMessage(graphMessage);
 * // Use with EWS SOAP operations
 * ```
 */
export function convertRestToEWSMessage(restMessage: RestApiMessage): EWSMessage {
  return {
    itemId: restMessage.id ? { id: restMessage.id } : undefined,
    subject: restMessage.subject,
    body: restMessage.body
      ? {
          bodyType: restMessage.body.contentType === 'html' ? 'HTML' : 'Text',
          content: restMessage.body.content,
        }
      : undefined,
    from: restMessage.from
      ? {
          name: restMessage.from.emailAddress.name,
          emailAddress: restMessage.from.emailAddress.address,
        }
      : undefined,
    toRecipients: restMessage.toRecipients?.map((r) => ({
      name: r.emailAddress.name,
      emailAddress: r.emailAddress.address,
    })),
    ccRecipients: restMessage.ccRecipients?.map((r) => ({
      name: r.emailAddress.name,
      emailAddress: r.emailAddress.address,
    })),
    bccRecipients: restMessage.bccRecipients?.map((r) => ({
      name: r.emailAddress.name,
      emailAddress: r.emailAddress.address,
    })),
    isRead: restMessage.isRead,
    importance: restMessage.importance
      ? (restMessage.importance.charAt(0).toUpperCase() +
          restMessage.importance.slice(1)) as 'Low' | 'Normal' | 'High'
      : undefined,
    dateTimeReceived: restMessage.receivedDateTime,
    dateTimeSent: restMessage.sentDateTime,
    hasAttachments: restMessage.hasAttachments,
    internetMessageId: restMessage.internetMessageId,
    categories: restMessage.categories,
  };
}

/**
 * Builds HTTP headers for EWS SOAP requests.
 * Includes authentication and content type headers.
 *
 * @param {EWSAuthConfig} auth - Authentication configuration
 * @param {string} soapAction - SOAP action header value
 * @returns {Record<string, string>} HTTP headers
 *
 * @example
 * ```typescript
 * const headers = buildEWSHeaders(
 *   { username: 'user@example.com', password: 'pass', authType: 'basic' },
 *   'http://schemas.microsoft.com/exchange/services/2006/messages/GetItem'
 * );
 * ```
 */
export function buildEWSHeaders(
  auth: EWSAuthConfig,
  soapAction?: string,
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'text/xml; charset=utf-8',
    'User-Agent': 'WhiteCross-EWS-Client/1.0',
  };

  if (soapAction) {
    headers['SOAPAction'] = soapAction;
  }

  if (auth.authType === 'basic' && auth.username && auth.password) {
    const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString(
      'base64',
    );
    headers['Authorization'] = `Basic ${credentials}`;
  } else if (auth.authType === 'oauth2' && auth.accessToken) {
    headers['Authorization'] = `Bearer ${auth.accessToken}`;
  }

  return headers;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Builds search filter XML structure for EWS queries.
 * Supports complex nested filters with AND/OR/NOT logic.
 *
 * @param {EWSSearchFilter} filter - Search filter configuration
 * @returns {any} Filter XML object
 *
 * @example
 * ```typescript
 * const filter = buildSearchFilter({
 *   type: 'and',
 *   filters: [
 *     { type: 'isEqualTo', field: 'message:IsRead', value: false },
 *     { type: 'contains', field: 'message:Subject', value: 'urgent' }
 *   ]
 * });
 * ```
 */
export function buildSearchFilter(filter: EWSSearchFilter): any {
  if (filter.type === 'and' || filter.type === 'or') {
    return {
      [`t:${filter.type === 'and' ? 'And' : 'Or'}`]: filter.filters?.map(
        buildSearchFilter,
      ),
    };
  }

  if (filter.type === 'not') {
    return {
      't:Not': buildSearchFilter(filter.filters![0]),
    };
  }

  if (filter.type === 'exists') {
    return {
      't:Exists': {
        't:FieldURI': { $: { FieldURI: filter.field } },
      },
    };
  }

  if (filter.type === 'contains') {
    return {
      't:Contains': {
        $: {
          ContainmentMode: filter.containmentMode || 'Substring',
          ContainmentComparison: filter.containmentComparison || 'IgnoreCase',
        },
        't:FieldURI': { $: { FieldURI: filter.field } },
        't:Constant': { $: { Value: filter.value } },
      },
    };
  }

  // Comparison filters
  const comparisonMap: Record<string, string> = {
    isEqualTo: 'IsEqualTo',
    isNotEqualTo: 'IsNotEqualTo',
    isGreaterThan: 'IsGreaterThan',
    isGreaterThanOrEqualTo: 'IsGreaterThanOrEqualTo',
    isLessThan: 'IsLessThan',
    isLessThanOrEqualTo: 'IsLessThanOrEqualTo',
  };

  const comparisonType = comparisonMap[filter.type];
  if (comparisonType) {
    return {
      [`t:${comparisonType}`]: {
        't:FieldURI': { $: { FieldURI: filter.field } },
        't:FieldURIOrConstant': {
          't:Constant': { $: { Value: filter.value } },
        },
      },
    };
  }

  return {};
}

/**
 * Builds property update XML structure for UpdateItem operations.
 * Converts property name-value pairs to EWS update format.
 *
 * @param {Record<string, any>} updates - Property updates
 * @returns {any} Updates XML object
 *
 * @example
 * ```typescript
 * const updates = buildPropertyUpdates({
 *   'message:IsRead': true,
 *   'message:Importance': 'High'
 * });
 * ```
 */
export function buildPropertyUpdates(updates: Record<string, any>): any {
  const updateElements: any[] = [];

  for (const [field, value] of Object.entries(updates)) {
    updateElements.push({
      't:SetItemField': {
        't:FieldURI': { $: { FieldURI: field } },
        't:Message': {
          [`t:${field.split(':')[1]}`]: value,
        },
      },
    });
  }

  return updateElements;
}

/**
 * Builds recurrence pattern XML structure for calendar items.
 * Supports daily, weekly, monthly, and yearly recurrence.
 *
 * @param {EWSRecurrencePattern} recurrence - Recurrence pattern
 * @returns {any} Recurrence XML object
 *
 * @example
 * ```typescript
 * const recurrence = buildRecurrencePattern({
 *   type: 'weekly',
 *   interval: 1,
 *   daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
 *   endDate: '2025-12-31T00:00:00Z'
 * });
 * ```
 */
export function buildRecurrencePattern(recurrence: EWSRecurrencePattern): any {
  const recurrenceObj: any = {};

  // Pattern
  if (recurrence.type === 'daily') {
    recurrenceObj['t:DailyRecurrence'] = {
      't:Interval': recurrence.interval,
    };
  } else if (recurrence.type === 'weekly') {
    recurrenceObj['t:WeeklyRecurrence'] = {
      't:Interval': recurrence.interval,
      't:DaysOfWeek': recurrence.daysOfWeek?.join(' '),
      't:FirstDayOfWeek': recurrence.firstDayOfWeek || 'Monday',
    };
  } else if (recurrence.type === 'monthly') {
    recurrenceObj['t:AbsoluteMonthlyRecurrence'] = {
      't:Interval': recurrence.interval,
      't:DayOfMonth': recurrence.dayOfMonth,
    };
  } else if (recurrence.type === 'yearly') {
    recurrenceObj['t:AbsoluteYearlyRecurrence'] = {
      't:DayOfMonth': recurrence.dayOfMonth,
      't:Month': recurrence.month,
    };
  }

  // Range
  if (recurrence.endDate) {
    recurrenceObj['t:EndDateRecurrence'] = {
      't:EndDate': recurrence.endDate,
    };
  } else if (recurrence.numberOfOccurrences) {
    recurrenceObj['t:NumberedRecurrence'] = {
      't:NumberOfOccurrences': recurrence.numberOfOccurrences,
    };
  } else {
    recurrenceObj['t:NoEndRecurrence'] = {};
  }

  return recurrenceObj;
}

/**
 * Builds inbox rule XML object for rule operations.
 * Converts InboxRule to EWS XML structure.
 *
 * @param {InboxRule} rule - Inbox rule configuration
 * @returns {any} Rule XML object
 *
 * @example
 * ```typescript
 * const ruleObj = buildInboxRuleObject({
 *   displayName: 'Move newsletters',
 *   priority: 1,
 *   isEnabled: true,
 *   conditions: { subjectContains: ['newsletter'] },
 *   actions: { moveToFolder: { id: 'AAMkAD...' } }
 * });
 * ```
 */
export function buildInboxRuleObject(rule: InboxRule): any {
  const ruleObj: any = {
    't:DisplayName': rule.displayName,
    't:Priority': rule.priority,
    't:IsEnabled': rule.isEnabled.toString(),
  };

  if (rule.ruleId) {
    ruleObj['t:RuleId'] = rule.ruleId;
  }

  if (rule.conditions) {
    const conditions: any = {};
    if (rule.conditions.fromAddresses) {
      conditions['t:FromAddresses'] = {
        't:Address': rule.conditions.fromAddresses.map((addr) => ({
          't:EmailAddress': addr,
        })),
      };
    }
    if (rule.conditions.subjectContains) {
      conditions['t:ContainsSubjectStrings'] = {
        't:String': rule.conditions.subjectContains,
      };
    }
    if (rule.conditions.bodyContains) {
      conditions['t:ContainsBodyStrings'] = {
        't:String': rule.conditions.bodyContains,
      };
    }
    if (rule.conditions.importance) {
      conditions['t:Importance'] = rule.conditions.importance;
    }
    if (rule.conditions.hasAttachments !== undefined) {
      conditions['t:HasAttachments'] = rule.conditions.hasAttachments.toString();
    }
    ruleObj['t:Conditions'] = conditions;
  }

  if (rule.actions) {
    const actions: any = {};
    if (rule.actions.moveToFolder) {
      actions['t:MoveToFolder'] = {
        't:FolderId': {
          $: {
            Id: rule.actions.moveToFolder.id,
            ChangeKey: rule.actions.moveToFolder.changeKey,
          },
        },
      };
    }
    if (rule.actions.delete) {
      actions['t:Delete'] = rule.actions.delete.toString();
    }
    if (rule.actions.markAsRead) {
      actions['t:MarkAsRead'] = rule.actions.markAsRead.toString();
    }
    if (rule.actions.categorize) {
      actions['t:AssignCategories'] = {
        't:String': rule.actions.categorize,
      };
    }
    if (rule.actions.forwardTo) {
      actions['t:ForwardToRecipients'] = {
        't:Address': rule.actions.forwardTo.map((addr) => ({
          't:EmailAddress': addr,
        })),
      };
    }
    if (rule.actions.stopProcessingRules) {
      actions['t:StopProcessingRules'] = rule.actions.stopProcessingRules.toString();
    }
    ruleObj['t:Actions'] = actions;
  }

  return ruleObj;
}

/**
 * Validates EWS endpoint configuration.
 * Checks for required fields and valid URLs.
 *
 * @param {EWSEndpoint} endpoint - EWS endpoint configuration
 * @returns {boolean} True if valid
 * @throws {Error} If configuration is invalid
 *
 * @example
 * ```typescript
 * validateEWSEndpoint({
 *   url: 'https://outlook.office365.com/EWS/Exchange.asmx',
 *   version: EWSVersion.ExchangeOnline,
 *   auth: { username: 'user@example.com', password: 'pass', authType: 'basic' }
 * });
 * ```
 */
export function validateEWSEndpoint(endpoint: EWSEndpoint): boolean {
  if (!endpoint.url || !endpoint.url.startsWith('http')) {
    throw new Error('Invalid EWS endpoint URL');
  }

  if (!endpoint.version) {
    throw new Error('EWS version is required');
  }

  if (!endpoint.auth || !endpoint.auth.username) {
    throw new Error('Authentication configuration is required');
  }

  if (
    endpoint.auth.authType === 'basic' &&
    !endpoint.auth.password
  ) {
    throw new Error('Password is required for basic authentication');
  }

  if (
    endpoint.auth.authType === 'oauth2' &&
    !endpoint.auth.accessToken
  ) {
    throw new Error('Access token is required for OAuth2 authentication');
  }

  return true;
}
