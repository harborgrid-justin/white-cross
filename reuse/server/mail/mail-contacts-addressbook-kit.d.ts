/**
 * LOC: MAILCONTACTS001
 * File: /reuse/server/mail/mail-contacts-addressbook-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - validator (v13.x)
 *   - vcard-parser (v1.0.x)
 *
 * DOWNSTREAM (imported by):
 *   - Mail server contact services
 *   - Address book management modules
 *   - Distribution list handlers
 *   - Global Address List (GAL) services
 *   - Contact synchronization services
 */
/**
 * File: /reuse/server/mail/mail-contacts-addressbook-kit.ts
 * Locator: WC-UTL-MAILCONTACTS-001
 * Purpose: Enterprise Mail Contacts & Address Book Kit - Exchange Server Compatible
 *
 * Upstream: sequelize v6.x, validator, vcard-parser
 * Downstream: ../backend/*, Mail services, Contact services, Address book services, GAL integration
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize v6.x, PostgreSQL 14+
 * Exports: 50 utility functions for contacts, address books, distribution lists, GAL, vCard import/export
 *
 * LLM Context: Production-grade mail contacts and address book management for White Cross healthcare platform.
 * Provides comprehensive contact management (CRUD, search, filtering), address book organization with sharing
 * and permissions, distribution list creation and management, contact groups and categories, vCard import/export
 * (RFC 6350 compliant), Global Address List (GAL) integration compatible with Exchange Server, contact
 * auto-complete and suggestions, contact photo management, custom fields and metadata, contact merging and
 * deduplication, contact history and audit trails, LDAP/Active Directory synchronization hooks, contact
 * sharing with granular permissions, favorite contacts, recently used contacts, contact tagging, and
 * HIPAA-compliant contact data protection.
 */
import { ModelStatic, Sequelize, ModelAttributes, Transaction } from 'sequelize';
/**
 * Contact information structure
 */
export interface ContactInfo {
    id?: string;
    userId: string;
    addressBookId?: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    displayName?: string;
    nickname?: string;
    prefix?: string;
    suffix?: string;
    company?: string;
    department?: string;
    jobTitle?: string;
    emailAddresses: EmailAddress[];
    phoneNumbers: PhoneNumber[];
    addresses: PostalAddress[];
    websites?: string[];
    photoUrl?: string;
    notes?: string;
    birthday?: Date;
    anniversary?: Date;
    customFields?: Record<string, any>;
    tags?: string[];
    isFavorite?: boolean;
    source?: 'manual' | 'imported' | 'gal' | 'ldap' | 'exchange';
    externalId?: string;
    lastSyncedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Email address structure
 */
export interface EmailAddress {
    email: string;
    type: 'personal' | 'work' | 'other';
    isPrimary?: boolean;
    label?: string;
}
/**
 * Phone number structure
 */
export interface PhoneNumber {
    number: string;
    type: 'mobile' | 'home' | 'work' | 'fax' | 'pager' | 'other';
    isPrimary?: boolean;
    label?: string;
    extension?: string;
}
/**
 * Postal address structure
 */
export interface PostalAddress {
    street?: string;
    street2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    type: 'home' | 'work' | 'other';
    isPrimary?: boolean;
    label?: string;
}
/**
 * Address book configuration
 */
export interface AddressBookInfo {
    id?: string;
    userId: string;
    name: string;
    description?: string;
    color?: string;
    isDefault?: boolean;
    isShared?: boolean;
    shareType?: 'readonly' | 'readwrite' | 'owner';
    icon?: string;
    sortOrder?: number;
    contactCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Distribution list configuration
 */
export interface DistributionListInfo {
    id?: string;
    userId: string;
    addressBookId?: string;
    name: string;
    description?: string;
    emailAddress?: string;
    members: DistributionListMember[];
    isPublic?: boolean;
    allowExternalMembers?: boolean;
    moderatorIds?: string[];
    tags?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Distribution list member
 */
export interface DistributionListMember {
    contactId?: string;
    email?: string;
    displayName?: string;
    type: 'contact' | 'external' | 'group';
    isActive?: boolean;
}
/**
 * Contact group configuration
 */
export interface ContactGroupInfo {
    id?: string;
    userId: string;
    addressBookId?: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    parentGroupId?: string;
    sortOrder?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Contact sharing configuration
 */
export interface ContactSharingInfo {
    id?: string;
    contactId?: string;
    addressBookId?: string;
    sharedByUserId: string;
    sharedWithUserId?: string;
    sharedWithGroupId?: string;
    permission: 'view' | 'edit' | 'full';
    expiresAt?: Date;
    createdAt?: Date;
}
/**
 * vCard 4.0 compatible structure
 */
export interface VCardData {
    version: '4.0' | '3.0';
    fn: string;
    n?: string[];
    nickname?: string;
    photo?: {
        uri?: string;
        data?: string;
    };
    bday?: string;
    anniversary?: string;
    gender?: string;
    adr?: Array<{
        type?: string[];
        street?: string;
        locality?: string;
        region?: string;
        postalCode?: string;
        country?: string;
    }>;
    tel?: Array<{
        type?: string[];
        value: string;
    }>;
    email?: Array<{
        type?: string[];
        value: string;
    }>;
    title?: string;
    role?: string;
    org?: string[];
    url?: string[];
    note?: string;
    categories?: string[];
    uid?: string;
    rev?: string;
}
/**
 * Contact search options
 */
export interface ContactSearchOptions {
    query?: string;
    addressBookIds?: string[];
    tags?: string[];
    isFavorite?: boolean;
    source?: string;
    hasEmail?: boolean;
    hasPhone?: boolean;
    companyFilter?: string;
    departmentFilter?: string;
    groupIds?: string[];
    excludeIds?: string[];
    limit?: number;
    offset?: number;
    sortBy?: 'name' | 'company' | 'recentlyUsed' | 'createdAt' | 'updatedAt';
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * Auto-complete suggestion
 */
export interface ContactSuggestion {
    id: string;
    displayName: string;
    email: string;
    photoUrl?: string;
    company?: string;
    jobTitle?: string;
    source: string;
    matchScore: number;
    recentlyUsed?: boolean;
}
/**
 * GAL (Global Address List) configuration
 */
export interface GALConfig {
    enabled: boolean;
    ldapUrl?: string;
    baseDN?: string;
    bindDN?: string;
    bindPassword?: string;
    searchFilter?: string;
    attributes?: string[];
    syncInterval?: number;
    autoCreateContacts?: boolean;
}
/**
 * GAL entry structure
 */
export interface GALEntry {
    id: string;
    displayName: string;
    emailAddress: string;
    firstName?: string;
    lastName?: string;
    department?: string;
    jobTitle?: string;
    company?: string;
    office?: string;
    phoneNumber?: string;
    photoUrl?: string;
    distinguishedName?: string;
    externalId: string;
}
/**
 * Contact merge configuration
 */
export interface ContactMergeConfig {
    primaryContactId: string;
    mergeContactIds: string[];
    fieldPriority?: Record<string, 'primary' | 'merge' | 'newest'>;
    keepBothEmails?: boolean;
    keepBothPhones?: boolean;
    keepBothAddresses?: boolean;
}
/**
 * Contact audit event
 */
export interface ContactAuditEvent {
    id?: string;
    contactId: string;
    userId: string;
    action: 'created' | 'updated' | 'deleted' | 'merged' | 'shared' | 'unshared' | 'exported' | 'imported';
    changes?: Record<string, {
        old: any;
        new: any;
    }>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    timestamp?: Date;
}
/**
 * Contact import/export options
 */
export interface ContactImportOptions {
    addressBookId?: string;
    mergeStrategy?: 'skip' | 'update' | 'duplicate';
    matchBy?: 'email' | 'name' | 'externalId';
    tags?: string[];
    source?: string;
}
/**
 * Contact statistics
 */
export interface ContactStatistics {
    totalContacts: number;
    contactsBySource: Record<string, number>;
    contactsByAddressBook: Record<string, number>;
    favoriteCount: number;
    withEmailCount: number;
    withPhoneCount: number;
    groupCount: number;
    distributionListCount: number;
    recentlyAddedCount: number;
    lastImportDate?: Date;
    lastExportDate?: Date;
}
/**
 * Defines Contact model attributes
 *
 * @returns {ModelAttributes} Contact model attributes
 */
export declare const getContactModelAttributes: () => ModelAttributes;
/**
 * Defines AddressBook model attributes
 *
 * @returns {ModelAttributes} AddressBook model attributes
 */
export declare const getAddressBookModelAttributes: () => ModelAttributes;
/**
 * Defines DistributionList model attributes
 *
 * @returns {ModelAttributes} DistributionList model attributes
 */
export declare const getDistributionListModelAttributes: () => ModelAttributes;
/**
 * Defines ContactGroup model attributes
 *
 * @returns {ModelAttributes} ContactGroup model attributes
 */
export declare const getContactGroupModelAttributes: () => ModelAttributes;
/**
 * Defines ContactGroupMembership junction table attributes
 *
 * @returns {ModelAttributes} ContactGroupMembership model attributes
 */
export declare const getContactGroupMembershipAttributes: () => ModelAttributes;
/**
 * Defines ContactSharing model attributes
 *
 * @returns {ModelAttributes} ContactSharing model attributes
 */
export declare const getContactSharingAttributes: () => ModelAttributes;
/**
 * Defines ContactAudit model attributes
 *
 * @returns {ModelAttributes} ContactAudit model attributes
 */
export declare const getContactAuditAttributes: () => ModelAttributes;
/**
 * Initializes Contact model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized Contact model
 *
 * @example
 * ```typescript
 * const Contact = initContactModel(sequelize);
 * const contact = await Contact.create({ firstName: 'John', lastName: 'Doe', ... });
 * ```
 */
export declare const initContactModel: (sequelize: Sequelize) => ModelStatic<any>;
/**
 * Initializes AddressBook model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized AddressBook model
 */
export declare const initAddressBookModel: (sequelize: Sequelize) => ModelStatic<any>;
/**
 * Initializes DistributionList model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized DistributionList model
 */
export declare const initDistributionListModel: (sequelize: Sequelize) => ModelStatic<any>;
/**
 * Initializes ContactGroup model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized ContactGroup model
 */
export declare const initContactGroupModel: (sequelize: Sequelize) => ModelStatic<any>;
/**
 * Initializes ContactGroupMembership junction model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized ContactGroupMembership model
 */
export declare const initContactGroupMembershipModel: (sequelize: Sequelize) => ModelStatic<any>;
/**
 * Initializes ContactSharing model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized ContactSharing model
 */
export declare const initContactSharingModel: (sequelize: Sequelize) => ModelStatic<any>;
/**
 * Initializes ContactAudit model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized ContactAudit model
 */
export declare const initContactAuditModel: (sequelize: Sequelize) => ModelStatic<any>;
/**
 * Sets up all associations between contact-related models
 *
 * @param {Object} models - Object containing all initialized models
 * @returns {void}
 *
 * @example
 * ```typescript
 * const models = {
 *   Contact: initContactModel(sequelize),
 *   AddressBook: initAddressBookModel(sequelize),
 *   DistributionList: initDistributionListModel(sequelize),
 *   ContactGroup: initContactGroupModel(sequelize),
 *   ContactGroupMembership: initContactGroupMembershipModel(sequelize),
 *   ContactSharing: initContactSharingModel(sequelize),
 *   ContactAudit: initContactAuditModel(sequelize)
 * };
 * setupContactAssociations(models);
 * ```
 */
export declare const setupContactAssociations: (models: {
    Contact: ModelStatic<any>;
    AddressBook: ModelStatic<any>;
    DistributionList: ModelStatic<any>;
    ContactGroup: ModelStatic<any>;
    ContactGroupMembership: ModelStatic<any>;
    ContactSharing: ModelStatic<any>;
    ContactAudit: ModelStatic<any>;
}) => void;
/**
 * Creates a new contact
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {ContactInfo} contactData - Contact data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created contact
 *
 * @example
 * ```typescript
 * const contact = await createContact(Contact, {
 *   userId: 'user-123',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   emailAddresses: [{ email: 'john@example.com', type: 'work', isPrimary: true }],
 *   phoneNumbers: [{ number: '+1234567890', type: 'mobile', isPrimary: true }]
 * });
 * ```
 */
export declare const createContact: (Contact: ModelStatic<any>, contactData: ContactInfo, transaction?: Transaction) => Promise<any>;
/**
 * Updates an existing contact
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {Partial<ContactInfo>} updates - Contact updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated contact
 */
export declare const updateContact: (Contact: ModelStatic<any>, contactId: string, updates: Partial<ContactInfo>, transaction?: Transaction) => Promise<any>;
/**
 * Deletes a contact (soft delete)
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if deleted
 */
export declare const deleteContact: (Contact: ModelStatic<any>, contactId: string, transaction?: Transaction) => Promise<boolean>;
/**
 * Gets a contact by ID with optional includes
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {Object} options - Query options
 * @returns {Promise<any>} Contact or null
 */
export declare const getContactById: (Contact: ModelStatic<any>, contactId: string, options?: {
    includeGroups?: boolean;
    includeAddressBook?: boolean;
    includeSharing?: boolean;
}) => Promise<any>;
/**
 * Gets all contacts for a user
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<any[]>} Array of contacts
 */
export declare const getUserContacts: (Contact: ModelStatic<any>, userId: string, options?: {
    addressBookId?: string;
    limit?: number;
    offset?: number;
}) => Promise<any[]>;
/**
 * Marks contact as recently used
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
export declare const markContactAsUsed: (Contact: ModelStatic<any>, contactId: string, transaction?: Transaction) => Promise<void>;
/**
 * Toggles contact favorite status
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {boolean} isFavorite - Favorite status
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated contact
 */
export declare const toggleContactFavorite: (Contact: ModelStatic<any>, contactId: string, isFavorite: boolean, transaction?: Transaction) => Promise<any>;
/**
 * Creates a new address book
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {AddressBookInfo} addressBookData - Address book data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created address book
 */
export declare const createAddressBook: (AddressBook: ModelStatic<any>, addressBookData: AddressBookInfo, transaction?: Transaction) => Promise<any>;
/**
 * Updates an address book
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {string} addressBookId - Address book ID
 * @param {Partial<AddressBookInfo>} updates - Address book updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated address book
 */
export declare const updateAddressBook: (AddressBook: ModelStatic<any>, addressBookId: string, updates: Partial<AddressBookInfo>, transaction?: Transaction) => Promise<any>;
/**
 * Deletes an address book
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {string} addressBookId - Address book ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if deleted
 */
export declare const deleteAddressBook: (AddressBook: ModelStatic<any>, addressBookId: string, transaction?: Transaction) => Promise<boolean>;
/**
 * Gets all address books for a user
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {string} userId - User ID
 * @returns {Promise<any[]>} Array of address books
 */
export declare const getUserAddressBooks: (AddressBook: ModelStatic<any>, userId: string) => Promise<any[]>;
/**
 * Gets or creates default address book for user
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {string} userId - User ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Default address book
 */
export declare const getOrCreateDefaultAddressBook: (AddressBook: ModelStatic<any>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Gets address book with contact count
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} addressBookId - Address book ID
 * @returns {Promise<any>} Address book with contact count
 */
export declare const getAddressBookWithStats: (AddressBook: ModelStatic<any>, Contact: ModelStatic<any>, addressBookId: string) => Promise<any>;
/**
 * Creates a distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {DistributionListInfo} listData - Distribution list data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created distribution list
 */
export declare const createDistributionList: (DistributionList: ModelStatic<any>, listData: DistributionListInfo, transaction?: Transaction) => Promise<any>;
/**
 * Updates a distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} listId - Distribution list ID
 * @param {Partial<DistributionListInfo>} updates - Distribution list updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated distribution list
 */
export declare const updateDistributionList: (DistributionList: ModelStatic<any>, listId: string, updates: Partial<DistributionListInfo>, transaction?: Transaction) => Promise<any>;
/**
 * Deletes a distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} listId - Distribution list ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if deleted
 */
export declare const deleteDistributionList: (DistributionList: ModelStatic<any>, listId: string, transaction?: Transaction) => Promise<boolean>;
/**
 * Adds members to distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} listId - Distribution list ID
 * @param {DistributionListMember[]} members - Members to add
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated distribution list
 */
export declare const addDistributionListMembers: (DistributionList: ModelStatic<any>, listId: string, members: DistributionListMember[], transaction?: Transaction) => Promise<any>;
/**
 * Removes members from distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} listId - Distribution list ID
 * @param {string[]} memberIds - Member IDs or emails to remove
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated distribution list
 */
export declare const removeDistributionListMembers: (DistributionList: ModelStatic<any>, listId: string, memberIds: string[], transaction?: Transaction) => Promise<any>;
/**
 * Gets all email addresses from distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} listId - Distribution list ID
 * @returns {Promise<string[]>} Array of email addresses
 */
export declare const getDistributionListEmails: (DistributionList: ModelStatic<any>, Contact: ModelStatic<any>, listId: string) => Promise<string[]>;
/**
 * Creates a contact group
 *
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {ContactGroupInfo} groupData - Contact group data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created contact group
 */
export declare const createContactGroup: (ContactGroup: ModelStatic<any>, groupData: ContactGroupInfo, transaction?: Transaction) => Promise<any>;
/**
 * Updates a contact group
 *
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {string} groupId - Contact group ID
 * @param {Partial<ContactGroupInfo>} updates - Contact group updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated contact group
 */
export declare const updateContactGroup: (ContactGroup: ModelStatic<any>, groupId: string, updates: Partial<ContactGroupInfo>, transaction?: Transaction) => Promise<any>;
/**
 * Deletes a contact group
 *
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {string} groupId - Contact group ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if deleted
 */
export declare const deleteContactGroup: (ContactGroup: ModelStatic<any>, groupId: string, transaction?: Transaction) => Promise<boolean>;
/**
 * Adds contacts to a group
 *
 * @param {ModelStatic<any>} ContactGroupMembership - ContactGroupMembership model
 * @param {string} groupId - Contact group ID
 * @param {string[]} contactIds - Contact IDs to add
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
export declare const addContactsToGroup: (ContactGroupMembership: ModelStatic<any>, groupId: string, contactIds: string[], transaction?: Transaction) => Promise<void>;
/**
 * Removes contacts from a group
 *
 * @param {ModelStatic<any>} ContactGroupMembership - ContactGroupMembership model
 * @param {string} groupId - Contact group ID
 * @param {string[]} contactIds - Contact IDs to remove
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of removed memberships
 */
export declare const removeContactsFromGroup: (ContactGroupMembership: ModelStatic<any>, groupId: string, contactIds: string[], transaction?: Transaction) => Promise<number>;
/**
 * Gets all contacts in a group
 *
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {string} groupId - Contact group ID
 * @returns {Promise<any[]>} Array of contacts
 */
export declare const getContactGroupMembers: (ContactGroup: ModelStatic<any>, groupId: string) => Promise<any[]>;
/**
 * Searches contacts with advanced filtering
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @param {ContactSearchOptions} options - Search options
 * @returns {Promise<any[]>} Array of matching contacts
 *
 * @example
 * ```typescript
 * const results = await searchContacts(Contact, 'user-123', {
 *   query: 'john',
 *   tags: ['important'],
 *   isFavorite: true,
 *   limit: 20
 * });
 * ```
 */
export declare const searchContacts: (Contact: ModelStatic<any>, userId: string, options: ContactSearchOptions) => Promise<any[]>;
/**
 * Gets contact suggestions for auto-complete
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @param {string} query - Search query (min 2 chars)
 * @param {number} limit - Max results (default 10)
 * @returns {Promise<ContactSuggestion[]>} Array of suggestions
 *
 * @example
 * ```typescript
 * const suggestions = await getContactSuggestions(Contact, 'user-123', 'joh', 10);
 * ```
 */
export declare const getContactSuggestions: (Contact: ModelStatic<any>, userId: string, query: string, limit?: number) => Promise<ContactSuggestion[]>;
/**
 * Gets recently used contacts
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @param {number} limit - Max results (default 10)
 * @returns {Promise<any[]>} Array of recently used contacts
 */
export declare const getRecentlyUsedContacts: (Contact: ModelStatic<any>, userId: string, limit?: number) => Promise<any[]>;
/**
 * Gets favorite contacts
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @returns {Promise<any[]>} Array of favorite contacts
 */
export declare const getFavoriteContacts: (Contact: ModelStatic<any>, userId: string) => Promise<any[]>;
/**
 * Converts contact to vCard 4.0 format
 *
 * @param {any} contact - Contact object
 * @returns {string} vCard string
 *
 * @example
 * ```typescript
 * const contact = await Contact.findByPk(contactId);
 * const vcardString = contactToVCard(contact);
 * ```
 */
export declare const contactToVCard: (contact: any) => string;
/**
 * Parses vCard string to contact data
 *
 * @param {string} vcardString - vCard string
 * @returns {Partial<ContactInfo>} Contact data object
 *
 * @example
 * ```typescript
 * const contactData = parseVCard(vcardString);
 * const contact = await createContact(Contact, contactData);
 * ```
 */
export declare const parseVCard: (vcardString: string) => Partial<ContactInfo>;
/**
 * Imports contacts from vCard file
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @param {string} vcardContent - vCard file content
 * @param {ContactImportOptions} options - Import options
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ imported: number; skipped: number; updated: number }>} Import results
 */
export declare const importContactsFromVCard: (Contact: ModelStatic<any>, userId: string, vcardContent: string, options?: ContactImportOptions, transaction?: Transaction) => Promise<{
    imported: number;
    skipped: number;
    updated: number;
}>;
/**
 * Exports contacts to vCard format
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string[]} contactIds - Contact IDs to export
 * @returns {Promise<string>} vCard content
 */
export declare const exportContactsToVCard: (Contact: ModelStatic<any>, contactIds: string[]) => Promise<string>;
/**
 * Shares a contact with another user
 *
 * @param {ModelStatic<any>} ContactSharing - ContactSharing model
 * @param {ContactSharingInfo} sharingData - Sharing data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created sharing entry
 */
export declare const shareContact: (ContactSharing: ModelStatic<any>, sharingData: ContactSharingInfo, transaction?: Transaction) => Promise<any>;
/**
 * Removes contact sharing
 *
 * @param {ModelStatic<any>} ContactSharing - ContactSharing model
 * @param {string} sharingId - Sharing entry ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if removed
 */
export declare const unshareContact: (ContactSharing: ModelStatic<any>, sharingId: string, transaction?: Transaction) => Promise<boolean>;
/**
 * Gets all shared contacts for a user
 *
 * @param {ModelStatic<any>} ContactSharing - ContactSharing model
 * @param {string} userId - User ID
 * @returns {Promise<any[]>} Array of shared contacts
 */
export declare const getSharedContacts: (ContactSharing: ModelStatic<any>, userId: string) => Promise<any[]>;
/**
 * Checks if user has permission to access contact
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {ModelStatic<any>} ContactSharing - ContactSharing model
 * @param {string} contactId - Contact ID
 * @param {string} userId - User ID
 * @param {string} requiredPermission - Required permission level
 * @returns {Promise<boolean>} True if user has permission
 */
export declare const hasContactPermission: (Contact: ModelStatic<any>, ContactSharing: ModelStatic<any>, contactId: string, userId: string, requiredPermission?: "view" | "edit" | "full") => Promise<boolean>;
/**
 * Merges multiple contacts into one
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {ContactMergeConfig} config - Merge configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Merged contact
 */
export declare const mergeContacts: (Contact: ModelStatic<any>, config: ContactMergeConfig, transaction?: Transaction) => Promise<any>;
/**
 * Finds duplicate contacts
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @returns {Promise<any[][]>} Array of duplicate contact groups
 */
export declare const findDuplicateContacts: (Contact: ModelStatic<any>, userId: string) => Promise<any[][]>;
/**
 * Syncs contacts from GAL/LDAP source
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @param {GALEntry[]} galEntries - GAL entries to sync
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ created: number; updated: number; deleted: number }>} Sync results
 */
export declare const syncContactsFromGAL: (Contact: ModelStatic<any>, userId: string, galEntries: GALEntry[], transaction?: Transaction) => Promise<{
    created: number;
    updated: number;
    deleted: number;
}>;
/**
 * Searches Global Address List
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} query - Search query
 * @param {number} limit - Max results
 * @returns {Promise<GALEntry[]>} GAL search results
 */
export declare const searchGAL: (Contact: ModelStatic<any>, query: string, limit?: number) => Promise<GALEntry[]>;
/**
 * Records contact audit event
 *
 * @param {ModelStatic<any>} ContactAudit - ContactAudit model
 * @param {ContactAuditEvent} auditData - Audit event data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created audit entry
 */
export declare const recordContactAudit: (ContactAudit: ModelStatic<any>, auditData: ContactAuditEvent, transaction?: Transaction) => Promise<any>;
/**
 * Gets contact audit history
 *
 * @param {ModelStatic<any>} ContactAudit - ContactAudit model
 * @param {string} contactId - Contact ID
 * @param {number} limit - Max entries (default 50)
 * @returns {Promise<any[]>} Audit history
 */
export declare const getContactAuditHistory: (ContactAudit: ModelStatic<any>, contactId: string, limit?: number) => Promise<any[]>;
/**
 * Gets contact statistics for user
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} userId - User ID
 * @returns {Promise<ContactStatistics>} Contact statistics
 */
export declare const getContactStatistics: (Contact: ModelStatic<any>, ContactGroup: ModelStatic<any>, DistributionList: ModelStatic<any>, userId: string) => Promise<ContactStatistics>;
/**
 * Generates Swagger schema for Contact model
 *
 * @returns {Object} Swagger schema object
 */
export declare const getContactSwaggerSchema: () => any;
/**
 * Generates Swagger schema for AddressBook model
 *
 * @returns {Object} Swagger schema object
 */
export declare const getAddressBookSwaggerSchema: () => any;
/**
 * Generates Swagger schema for DistributionList model
 *
 * @returns {Object} Swagger schema object
 */
export declare const getDistributionListSwaggerSchema: () => any;
/**
 * Generates complete Swagger/OpenAPI paths for contact endpoints
 *
 * @returns {Object} Swagger paths object
 */
export declare const getContactSwaggerPaths: () => any;
declare const _default: {
    getContactModelAttributes: () => ModelAttributes;
    getAddressBookModelAttributes: () => ModelAttributes;
    getDistributionListModelAttributes: () => ModelAttributes;
    getContactGroupModelAttributes: () => ModelAttributes;
    getContactGroupMembershipAttributes: () => ModelAttributes;
    getContactSharingAttributes: () => ModelAttributes;
    getContactAuditAttributes: () => ModelAttributes;
    initContactModel: (sequelize: Sequelize) => ModelStatic<any>;
    initAddressBookModel: (sequelize: Sequelize) => ModelStatic<any>;
    initDistributionListModel: (sequelize: Sequelize) => ModelStatic<any>;
    initContactGroupModel: (sequelize: Sequelize) => ModelStatic<any>;
    initContactGroupMembershipModel: (sequelize: Sequelize) => ModelStatic<any>;
    initContactSharingModel: (sequelize: Sequelize) => ModelStatic<any>;
    initContactAuditModel: (sequelize: Sequelize) => ModelStatic<any>;
    setupContactAssociations: (models: {
        Contact: ModelStatic<any>;
        AddressBook: ModelStatic<any>;
        DistributionList: ModelStatic<any>;
        ContactGroup: ModelStatic<any>;
        ContactGroupMembership: ModelStatic<any>;
        ContactSharing: ModelStatic<any>;
        ContactAudit: ModelStatic<any>;
    }) => void;
    createContact: (Contact: ModelStatic<any>, contactData: ContactInfo, transaction?: Transaction) => Promise<any>;
    updateContact: (Contact: ModelStatic<any>, contactId: string, updates: Partial<ContactInfo>, transaction?: Transaction) => Promise<any>;
    deleteContact: (Contact: ModelStatic<any>, contactId: string, transaction?: Transaction) => Promise<boolean>;
    getContactById: (Contact: ModelStatic<any>, contactId: string, options?: {
        includeGroups?: boolean;
        includeAddressBook?: boolean;
        includeSharing?: boolean;
    }) => Promise<any>;
    getUserContacts: (Contact: ModelStatic<any>, userId: string, options?: {
        addressBookId?: string;
        limit?: number;
        offset?: number;
    }) => Promise<any[]>;
    markContactAsUsed: (Contact: ModelStatic<any>, contactId: string, transaction?: Transaction) => Promise<void>;
    toggleContactFavorite: (Contact: ModelStatic<any>, contactId: string, isFavorite: boolean, transaction?: Transaction) => Promise<any>;
    createAddressBook: (AddressBook: ModelStatic<any>, addressBookData: AddressBookInfo, transaction?: Transaction) => Promise<any>;
    updateAddressBook: (AddressBook: ModelStatic<any>, addressBookId: string, updates: Partial<AddressBookInfo>, transaction?: Transaction) => Promise<any>;
    deleteAddressBook: (AddressBook: ModelStatic<any>, addressBookId: string, transaction?: Transaction) => Promise<boolean>;
    getUserAddressBooks: (AddressBook: ModelStatic<any>, userId: string) => Promise<any[]>;
    getOrCreateDefaultAddressBook: (AddressBook: ModelStatic<any>, userId: string, transaction?: Transaction) => Promise<any>;
    getAddressBookWithStats: (AddressBook: ModelStatic<any>, Contact: ModelStatic<any>, addressBookId: string) => Promise<any>;
    createDistributionList: (DistributionList: ModelStatic<any>, listData: DistributionListInfo, transaction?: Transaction) => Promise<any>;
    updateDistributionList: (DistributionList: ModelStatic<any>, listId: string, updates: Partial<DistributionListInfo>, transaction?: Transaction) => Promise<any>;
    deleteDistributionList: (DistributionList: ModelStatic<any>, listId: string, transaction?: Transaction) => Promise<boolean>;
    addDistributionListMembers: (DistributionList: ModelStatic<any>, listId: string, members: DistributionListMember[], transaction?: Transaction) => Promise<any>;
    removeDistributionListMembers: (DistributionList: ModelStatic<any>, listId: string, memberIds: string[], transaction?: Transaction) => Promise<any>;
    getDistributionListEmails: (DistributionList: ModelStatic<any>, Contact: ModelStatic<any>, listId: string) => Promise<string[]>;
    createContactGroup: (ContactGroup: ModelStatic<any>, groupData: ContactGroupInfo, transaction?: Transaction) => Promise<any>;
    updateContactGroup: (ContactGroup: ModelStatic<any>, groupId: string, updates: Partial<ContactGroupInfo>, transaction?: Transaction) => Promise<any>;
    deleteContactGroup: (ContactGroup: ModelStatic<any>, groupId: string, transaction?: Transaction) => Promise<boolean>;
    addContactsToGroup: (ContactGroupMembership: ModelStatic<any>, groupId: string, contactIds: string[], transaction?: Transaction) => Promise<void>;
    removeContactsFromGroup: (ContactGroupMembership: ModelStatic<any>, groupId: string, contactIds: string[], transaction?: Transaction) => Promise<number>;
    getContactGroupMembers: (ContactGroup: ModelStatic<any>, groupId: string) => Promise<any[]>;
    searchContacts: (Contact: ModelStatic<any>, userId: string, options: ContactSearchOptions) => Promise<any[]>;
    getContactSuggestions: (Contact: ModelStatic<any>, userId: string, query: string, limit?: number) => Promise<ContactSuggestion[]>;
    getRecentlyUsedContacts: (Contact: ModelStatic<any>, userId: string, limit?: number) => Promise<any[]>;
    getFavoriteContacts: (Contact: ModelStatic<any>, userId: string) => Promise<any[]>;
    contactToVCard: (contact: any) => string;
    parseVCard: (vcardString: string) => Partial<ContactInfo>;
    importContactsFromVCard: (Contact: ModelStatic<any>, userId: string, vcardContent: string, options?: ContactImportOptions, transaction?: Transaction) => Promise<{
        imported: number;
        skipped: number;
        updated: number;
    }>;
    exportContactsToVCard: (Contact: ModelStatic<any>, contactIds: string[]) => Promise<string>;
    shareContact: (ContactSharing: ModelStatic<any>, sharingData: ContactSharingInfo, transaction?: Transaction) => Promise<any>;
    unshareContact: (ContactSharing: ModelStatic<any>, sharingId: string, transaction?: Transaction) => Promise<boolean>;
    getSharedContacts: (ContactSharing: ModelStatic<any>, userId: string) => Promise<any[]>;
    hasContactPermission: (Contact: ModelStatic<any>, ContactSharing: ModelStatic<any>, contactId: string, userId: string, requiredPermission?: "view" | "edit" | "full") => Promise<boolean>;
    mergeContacts: (Contact: ModelStatic<any>, config: ContactMergeConfig, transaction?: Transaction) => Promise<any>;
    findDuplicateContacts: (Contact: ModelStatic<any>, userId: string) => Promise<any[][]>;
    syncContactsFromGAL: (Contact: ModelStatic<any>, userId: string, galEntries: GALEntry[], transaction?: Transaction) => Promise<{
        created: number;
        updated: number;
        deleted: number;
    }>;
    searchGAL: (Contact: ModelStatic<any>, query: string, limit?: number) => Promise<GALEntry[]>;
    recordContactAudit: (ContactAudit: ModelStatic<any>, auditData: ContactAuditEvent, transaction?: Transaction) => Promise<any>;
    getContactAuditHistory: (ContactAudit: ModelStatic<any>, contactId: string, limit?: number) => Promise<any[]>;
    getContactStatistics: (Contact: ModelStatic<any>, ContactGroup: ModelStatic<any>, DistributionList: ModelStatic<any>, userId: string) => Promise<ContactStatistics>;
    getContactSwaggerSchema: () => any;
    getAddressBookSwaggerSchema: () => any;
    getDistributionListSwaggerSchema: () => any;
    getContactSwaggerPaths: () => any;
};
export default _default;
//# sourceMappingURL=mail-contacts-addressbook-kit.d.ts.map