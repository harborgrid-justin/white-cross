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
 * EWS API version enumeration
 */
export declare enum EWSVersion {
    Exchange2007 = "Exchange2007",
    Exchange2007_SP1 = "Exchange2007_SP1",
    Exchange2010 = "Exchange2010",
    Exchange2010_SP1 = "Exchange2010_SP1",
    Exchange2010_SP2 = "Exchange2010_SP2",
    Exchange2013 = "Exchange2013",
    Exchange2013_SP1 = "Exchange2013_SP1",
    Exchange2015 = "Exchange2015",
    Exchange2016 = "Exchange2016",
    Exchange2019 = "Exchange2019",
    ExchangeOnline = "ExchangeOnline"
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
    content?: string;
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
    start: string;
    end: string;
    location?: string;
    requiredAttendees?: EWSEmailAddress[];
    optionalAttendees?: EWSEmailAddress[];
    resources?: EWSEmailAddress[];
    isAllDayEvent?: boolean;
    recurrence?: EWSRecurrencePattern;
    reminder?: number;
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
    emailAddresses?: {
        key: string;
        value: string;
    }[];
    phoneNumbers?: {
        key: string;
        value: string;
    }[];
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
    imAddresses?: {
        key: string;
        value: string;
    }[];
    photo?: string;
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
    startTime: string;
    endTime: string;
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
    startTime?: string;
    endTime?: string;
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
export declare function createSOAPEnvelope(version: EWSVersion, body: any, header?: any): SOAPEnvelope;
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
export declare function buildSOAPXML(envelope: SOAPEnvelope): string;
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
export declare function parseSOAPResponse(xmlResponse: string): Promise<any>;
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
export declare function createImpersonationHeader(emailAddress: string, connectingAs?: string): any;
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
export declare function createMailboxCultureHeader(culture: string): any;
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
export declare function createTimeZoneHeader(timeZoneId: string): any;
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
export declare function buildFindItemRequest(version: EWSVersion, folderId: EWSFolderId, filter?: EWSSearchFilter, maxResults?: number, offset?: number): string;
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
export declare function buildGetItemRequest(version: EWSVersion, itemIds: EWSItemId[], includeMime?: boolean): string;
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
export declare function buildCreateMessageRequest(version: EWSVersion, message: EWSMessage, saveFolderId?: EWSFolderId, sendImmediately?: boolean): string;
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
export declare function buildUpdateItemRequest(version: EWSVersion, itemId: EWSItemId, updates: Record<string, any>, conflictResolution?: 'NeverOverwrite' | 'AutoResolve' | 'AlwaysOverwrite'): string;
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
export declare function buildDeleteItemRequest(version: EWSVersion, itemIds: EWSItemId[], deleteType?: 'HardDelete' | 'SoftDelete' | 'MoveToDeletedItems'): string;
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
export declare function buildFindFolderRequest(version: EWSVersion, parentFolderId: EWSFolderId, deepTraversal?: boolean): string;
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
export declare function buildGetFolderRequest(version: EWSVersion, folderIds: EWSFolderId[]): string;
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
export declare function buildCreateFolderRequest(version: EWSVersion, folderName: string, parentFolderId: EWSFolderId, folderClass?: string): string;
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
export declare function buildDeleteFolderRequest(version: EWSVersion, folderIds: EWSFolderId[], deleteType?: 'HardDelete' | 'SoftDelete' | 'MoveToDeletedItems'): string;
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
export declare function buildCreateCalendarItemRequest(version: EWSVersion, calendarItem: EWSCalendarItem, sendInvitations?: boolean): string;
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
export declare function buildFindCalendarItemsRequest(version: EWSVersion, startDate: string, endDate: string, maxResults?: number): string;
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
export declare function buildUpdateCalendarItemRequest(version: EWSVersion, itemId: EWSItemId, updates: Partial<EWSCalendarItem>, sendUpdates?: boolean): string;
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
export declare function buildDeleteCalendarItemRequest(version: EWSVersion, itemId: EWSItemId, sendCancellations?: boolean): string;
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
export declare function buildCreateContactRequest(version: EWSVersion, contact: EWSContact): string;
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
export declare function buildFindContactsRequest(version: EWSVersion, searchQuery?: string, maxResults?: number): string;
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
export declare function buildUpdateContactRequest(version: EWSVersion, itemId: EWSItemId, updates: Partial<EWSContact>): string;
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
export declare function buildAutoDiscoverRequest(emailAddress: string): string;
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
export declare function parseAutoDiscoverResponse(xmlResponse: string): Promise<AutoDiscoverResponse>;
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
export declare function getAutoDiscoverUrls(emailAddress: string): string[];
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
export declare function buildGetAvailabilityRequest(version: EWSVersion, request: AvailabilityRequest): string;
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
export declare function parseAvailabilityResponse(xmlResponse: string): Promise<AvailabilityResponse[]>;
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
export declare function buildGetOOFSettingsRequest(version: EWSVersion, emailAddress: string): string;
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
export declare function buildSetOOFSettingsRequest(version: EWSVersion, emailAddress: string, settings: OOFSettings): string;
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
export declare function buildGetInboxRulesRequest(version: EWSVersion, emailAddress: string): string;
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
export declare function buildUpdateInboxRulesRequest(version: EWSVersion, emailAddress: string, rulesToCreate?: InboxRule[], rulesToUpdate?: InboxRule[], ruleIdsToDelete?: string[]): string;
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
export declare function buildAddDelegateRequest(version: EWSVersion, mailboxEmail: string, delegateUser: DelegateUser): string;
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
export declare function buildGetDelegateRequest(version: EWSVersion, mailboxEmail: string): string;
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
export declare function buildRemoveDelegateRequest(version: EWSVersion, mailboxEmail: string, delegateEmail: string): string;
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
export declare function buildSubscribeRequest(version: EWSVersion, folderIds: EWSFolderId[], eventTypes: string[], timeout?: number): string;
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
export declare function buildGetStreamingEventsRequest(version: EWSVersion, subscriptionIds: string[], connectionTimeout?: number): string;
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
export declare function buildUnsubscribeRequest(version: EWSVersion, subscriptionId: string): string;
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
export declare function convertEWSToRestMessage(ewsMessage: EWSMessage): RestApiMessage;
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
export declare function convertRestToEWSMessage(restMessage: RestApiMessage): EWSMessage;
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
export declare function buildEWSHeaders(auth: EWSAuthConfig, soapAction?: string): Record<string, string>;
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
export declare function buildSearchFilter(filter: EWSSearchFilter): any;
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
export declare function buildPropertyUpdates(updates: Record<string, any>): any;
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
export declare function buildRecurrencePattern(recurrence: EWSRecurrencePattern): any;
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
export declare function buildInboxRuleObject(rule: InboxRule): any;
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
export declare function validateEWSEndpoint(endpoint: EWSEndpoint): boolean;
//# sourceMappingURL=mail-exchange-protocol-kit.d.ts.map