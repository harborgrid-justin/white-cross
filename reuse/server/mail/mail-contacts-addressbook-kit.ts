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

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  InitOptions,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  Association,
  HasManyOptions,
  BelongsToOptions,
  BelongsToManyOptions,
  literal,
  fn,
  col,
  QueryTypes,
} from 'sequelize';
import { isEmail, isMobilePhone, isURL, isUUID } from 'validator';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  prefix?: string; // Mr., Mrs., Dr., etc.
  suffix?: string; // Jr., Sr., III, etc.
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
  externalId?: string; // For GAL/LDAP sync
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
  emailAddress?: string; // List email address
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
  fn: string; // Formatted name
  n?: string[]; // Name components: [family, given, additional, prefix, suffix]
  nickname?: string;
  photo?: { uri?: string; data?: string };
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
  tel?: Array<{ type?: string[]; value: string }>;
  email?: Array<{ type?: string[]; value: string }>;
  title?: string;
  role?: string;
  org?: string[];
  url?: string[];
  note?: string;
  categories?: string[];
  uid?: string;
  rev?: string; // Revision timestamp
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
  syncInterval?: number; // minutes
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
  changes?: Record<string, { old: any; new: any }>;
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

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Defines Contact model attributes
 *
 * @returns {ModelAttributes} Contact model attributes
 */
export const getContactModelAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  addressBookId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'mail_address_books',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  middleName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  displayName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  nickname: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  prefix: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  suffix: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  jobTitle: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  emailAddresses: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidEmails(value: any) {
        if (!Array.isArray(value)) {
          throw new Error('emailAddresses must be an array');
        }
        value.forEach((email: any) => {
          if (!email.email || !isEmail(email.email)) {
            throw new Error(`Invalid email address: ${email.email}`);
          }
        });
      },
    },
  },
  phoneNumbers: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  addresses: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  websites: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  photoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  anniversary: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  customFields: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
  isFavorite: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  source: {
    type: DataTypes.ENUM('manual', 'imported', 'gal', 'ldap', 'exchange'),
    allowNull: false,
    defaultValue: 'manual',
  },
  externalId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
  },
  lastSyncedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastUsedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  useCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

/**
 * Defines AddressBook model attributes
 *
 * @returns {ModelAttributes} AddressBook model attributes
 */
export const getAddressBookModelAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: '#3B82F6',
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isShared: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

/**
 * Defines DistributionList model attributes
 *
 * @returns {ModelAttributes} DistributionList model attributes
 */
export const getDistributionListModelAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  addressBookId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'mail_address_books',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  emailAddress: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  members: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  allowExternalMembers: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  moderatorIds: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: true,
    defaultValue: [],
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

/**
 * Defines ContactGroup model attributes
 *
 * @returns {ModelAttributes} ContactGroup model attributes
 */
export const getContactGroupModelAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  addressBookId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'mail_address_books',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  parentGroupId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'mail_contact_groups',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

/**
 * Defines ContactGroupMembership junction table attributes
 *
 * @returns {ModelAttributes} ContactGroupMembership model attributes
 */
export const getContactGroupMembershipAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  contactId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'mail_contacts',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'mail_contact_groups',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  addedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

/**
 * Defines ContactSharing model attributes
 *
 * @returns {ModelAttributes} ContactSharing model attributes
 */
export const getContactSharingAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  contactId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'mail_contacts',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  addressBookId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'mail_address_books',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  sharedByUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  sharedWithUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  sharedWithGroupId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  permission: {
    type: DataTypes.ENUM('view', 'edit', 'full'),
    allowNull: false,
    defaultValue: 'view',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

/**
 * Defines ContactAudit model attributes
 *
 * @returns {ModelAttributes} ContactAudit model attributes
 */
export const getContactAuditAttributes = (): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  contactId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'mail_contacts',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  action: {
    type: DataTypes.ENUM('created', 'updated', 'deleted', 'merged', 'shared', 'unshared', 'exported', 'imported'),
    allowNull: false,
  },
  changes: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

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
export const initContactModel = (sequelize: Sequelize): ModelStatic<any> => {
  class Contact extends Model {}

  Contact.init(getContactModelAttributes(), {
    sequelize,
    tableName: 'mail_contacts',
    paranoid: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['addressBookId'] },
      { fields: ['firstName', 'lastName'] },
      { fields: ['company'] },
      { fields: ['externalId'], unique: true, where: { externalId: { [Op.ne]: null } } },
      { fields: ['isFavorite'] },
      { fields: ['source'] },
      { fields: ['lastUsedAt'] },
      { fields: ['createdAt'] },
      {
        name: 'mail_contacts_email_gin',
        fields: ['emailAddresses'],
        using: 'gin',
      },
      {
        name: 'mail_contacts_tags_gin',
        fields: ['tags'],
        using: 'gin',
      },
      {
        name: 'mail_contacts_fulltext',
        fields: [literal("to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(company, ''))")],
        using: 'gin',
      },
    ],
  });

  return Contact;
};

/**
 * Initializes AddressBook model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized AddressBook model
 */
export const initAddressBookModel = (sequelize: Sequelize): ModelStatic<any> => {
  class AddressBook extends Model {}

  AddressBook.init(getAddressBookModelAttributes(), {
    sequelize,
    tableName: 'mail_address_books',
    paranoid: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['isDefault'] },
      { fields: ['isShared'] },
      { fields: ['sortOrder'] },
    ],
  });

  return AddressBook;
};

/**
 * Initializes DistributionList model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized DistributionList model
 */
export const initDistributionListModel = (sequelize: Sequelize): ModelStatic<any> => {
  class DistributionList extends Model {}

  DistributionList.init(getDistributionListModelAttributes(), {
    sequelize,
    tableName: 'mail_distribution_lists',
    paranoid: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['addressBookId'] },
      { fields: ['emailAddress'], unique: true, where: { emailAddress: { [Op.ne]: null } } },
      { fields: ['isPublic'] },
    ],
  });

  return DistributionList;
};

/**
 * Initializes ContactGroup model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized ContactGroup model
 */
export const initContactGroupModel = (sequelize: Sequelize): ModelStatic<any> => {
  class ContactGroup extends Model {}

  ContactGroup.init(getContactGroupModelAttributes(), {
    sequelize,
    tableName: 'mail_contact_groups',
    paranoid: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['addressBookId'] },
      { fields: ['parentGroupId'] },
      { fields: ['sortOrder'] },
    ],
  });

  return ContactGroup;
};

/**
 * Initializes ContactGroupMembership junction model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized ContactGroupMembership model
 */
export const initContactGroupMembershipModel = (sequelize: Sequelize): ModelStatic<any> => {
  class ContactGroupMembership extends Model {}

  ContactGroupMembership.init(getContactGroupMembershipAttributes(), {
    sequelize,
    tableName: 'mail_contact_group_memberships',
    timestamps: false,
    indexes: [
      { fields: ['contactId'] },
      { fields: ['groupId'] },
      { fields: ['contactId', 'groupId'], unique: true },
    ],
  });

  return ContactGroupMembership;
};

/**
 * Initializes ContactSharing model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized ContactSharing model
 */
export const initContactSharingModel = (sequelize: Sequelize): ModelStatic<any> => {
  class ContactSharing extends Model {}

  ContactSharing.init(getContactSharingAttributes(), {
    sequelize,
    tableName: 'mail_contact_sharing',
    timestamps: false,
    indexes: [
      { fields: ['contactId'] },
      { fields: ['addressBookId'] },
      { fields: ['sharedByUserId'] },
      { fields: ['sharedWithUserId'] },
      { fields: ['expiresAt'] },
    ],
  });

  return ContactSharing;
};

/**
 * Initializes ContactAudit model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized ContactAudit model
 */
export const initContactAuditModel = (sequelize: Sequelize): ModelStatic<any> => {
  class ContactAudit extends Model {}

  ContactAudit.init(getContactAuditAttributes(), {
    sequelize,
    tableName: 'mail_contact_audit',
    timestamps: false,
    indexes: [
      { fields: ['contactId'] },
      { fields: ['userId'] },
      { fields: ['action'] },
      { fields: ['timestamp'] },
    ],
  });

  return ContactAudit;
};

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
export const setupContactAssociations = (models: {
  Contact: ModelStatic<any>;
  AddressBook: ModelStatic<any>;
  DistributionList: ModelStatic<any>;
  ContactGroup: ModelStatic<any>;
  ContactGroupMembership: ModelStatic<any>;
  ContactSharing: ModelStatic<any>;
  ContactAudit: ModelStatic<any>;
}): void => {
  const { Contact, AddressBook, DistributionList, ContactGroup, ContactGroupMembership, ContactSharing, ContactAudit } = models;

  // Contact <-> AddressBook (Many-to-One)
  Contact.belongsTo(AddressBook, {
    foreignKey: 'addressBookId',
    as: 'addressBook',
  });

  AddressBook.hasMany(Contact, {
    foreignKey: 'addressBookId',
    as: 'contacts',
  });

  // DistributionList <-> AddressBook (Many-to-One)
  DistributionList.belongsTo(AddressBook, {
    foreignKey: 'addressBookId',
    as: 'addressBook',
  });

  AddressBook.hasMany(DistributionList, {
    foreignKey: 'addressBookId',
    as: 'distributionLists',
  });

  // ContactGroup <-> AddressBook (Many-to-One)
  ContactGroup.belongsTo(AddressBook, {
    foreignKey: 'addressBookId',
    as: 'addressBook',
  });

  AddressBook.hasMany(ContactGroup, {
    foreignKey: 'addressBookId',
    as: 'groups',
  });

  // ContactGroup self-referential (parent-child)
  ContactGroup.belongsTo(ContactGroup, {
    foreignKey: 'parentGroupId',
    as: 'parentGroup',
  });

  ContactGroup.hasMany(ContactGroup, {
    foreignKey: 'parentGroupId',
    as: 'childGroups',
  });

  // Contact <-> ContactGroup (Many-to-Many through ContactGroupMembership)
  Contact.belongsToMany(ContactGroup, {
    through: ContactGroupMembership,
    foreignKey: 'contactId',
    otherKey: 'groupId',
    as: 'groups',
  });

  ContactGroup.belongsToMany(Contact, {
    through: ContactGroupMembership,
    foreignKey: 'groupId',
    otherKey: 'contactId',
    as: 'contacts',
  });

  // Contact <-> ContactSharing (One-to-Many)
  Contact.hasMany(ContactSharing, {
    foreignKey: 'contactId',
    as: 'sharingEntries',
  });

  ContactSharing.belongsTo(Contact, {
    foreignKey: 'contactId',
    as: 'contact',
  });

  // AddressBook <-> ContactSharing (One-to-Many)
  AddressBook.hasMany(ContactSharing, {
    foreignKey: 'addressBookId',
    as: 'sharingEntries',
  });

  ContactSharing.belongsTo(AddressBook, {
    foreignKey: 'addressBookId',
    as: 'addressBook',
  });

  // Contact <-> ContactAudit (One-to-Many)
  Contact.hasMany(ContactAudit, {
    foreignKey: 'contactId',
    as: 'auditLog',
  });

  ContactAudit.belongsTo(Contact, {
    foreignKey: 'contactId',
    as: 'contact',
  });
};

// ============================================================================
// CONTACT CRUD OPERATIONS
// ============================================================================

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
export const createContact = async (
  Contact: ModelStatic<any>,
  contactData: ContactInfo,
  transaction?: Transaction,
): Promise<any> => {
  // Auto-generate display name if not provided
  if (!contactData.displayName) {
    contactData.displayName = `${contactData.firstName} ${contactData.lastName}`.trim();
  }

  return await Contact.create(contactData, { transaction });
};

/**
 * Updates an existing contact
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {Partial<ContactInfo>} updates - Contact updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated contact
 */
export const updateContact = async (
  Contact: ModelStatic<any>,
  contactId: string,
  updates: Partial<ContactInfo>,
  transaction?: Transaction,
): Promise<any> => {
  const contact = await Contact.findByPk(contactId, { transaction });
  if (!contact) {
    throw new Error(`Contact not found: ${contactId}`);
  }

  // Auto-update display name if name fields changed
  if (updates.firstName || updates.lastName) {
    const firstName = updates.firstName || contact.firstName;
    const lastName = updates.lastName || contact.lastName;
    updates.displayName = `${firstName} ${lastName}`.trim();
  }

  await contact.update(updates, { transaction });
  return contact;
};

/**
 * Deletes a contact (soft delete)
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if deleted
 */
export const deleteContact = async (
  Contact: ModelStatic<any>,
  contactId: string,
  transaction?: Transaction,
): Promise<boolean> => {
  const contact = await Contact.findByPk(contactId, { transaction });
  if (!contact) {
    return false;
  }

  await contact.destroy({ transaction });
  return true;
};

/**
 * Gets a contact by ID with optional includes
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {Object} options - Query options
 * @returns {Promise<any>} Contact or null
 */
export const getContactById = async (
  Contact: ModelStatic<any>,
  contactId: string,
  options?: {
    includeGroups?: boolean;
    includeAddressBook?: boolean;
    includeSharing?: boolean;
  },
): Promise<any> => {
  const include: any[] = [];

  if (options?.includeGroups) {
    include.push({ association: 'groups', as: 'groups' });
  }

  if (options?.includeAddressBook) {
    include.push({ association: 'addressBook', as: 'addressBook' });
  }

  if (options?.includeSharing) {
    include.push({ association: 'sharingEntries', as: 'sharingEntries' });
  }

  return await Contact.findByPk(contactId, { include });
};

/**
 * Gets all contacts for a user
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<any[]>} Array of contacts
 */
export const getUserContacts = async (
  Contact: ModelStatic<any>,
  userId: string,
  options?: {
    addressBookId?: string;
    limit?: number;
    offset?: number;
  },
): Promise<any[]> => {
  const where: WhereOptions = { userId };

  if (options?.addressBookId) {
    where.addressBookId = options.addressBookId;
  }

  return await Contact.findAll({
    where,
    limit: options?.limit,
    offset: options?.offset,
    order: [['lastName', 'ASC'], ['firstName', 'ASC']],
  });
};

/**
 * Marks contact as recently used
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
export const markContactAsUsed = async (
  Contact: ModelStatic<any>,
  contactId: string,
  transaction?: Transaction,
): Promise<void> => {
  await Contact.update(
    {
      lastUsedAt: new Date(),
      useCount: literal('use_count + 1'),
    },
    {
      where: { id: contactId },
      transaction,
    },
  );
};

/**
 * Toggles contact favorite status
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {boolean} isFavorite - Favorite status
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated contact
 */
export const toggleContactFavorite = async (
  Contact: ModelStatic<any>,
  contactId: string,
  isFavorite: boolean,
  transaction?: Transaction,
): Promise<any> => {
  return await updateContact(Contact, contactId, { isFavorite }, transaction);
};

// ============================================================================
// ADDRESS BOOK MANAGEMENT
// ============================================================================

/**
 * Creates a new address book
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {AddressBookInfo} addressBookData - Address book data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created address book
 */
export const createAddressBook = async (
  AddressBook: ModelStatic<any>,
  addressBookData: AddressBookInfo,
  transaction?: Transaction,
): Promise<any> => {
  return await AddressBook.create(addressBookData, { transaction });
};

/**
 * Updates an address book
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {string} addressBookId - Address book ID
 * @param {Partial<AddressBookInfo>} updates - Address book updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated address book
 */
export const updateAddressBook = async (
  AddressBook: ModelStatic<any>,
  addressBookId: string,
  updates: Partial<AddressBookInfo>,
  transaction?: Transaction,
): Promise<any> => {
  const addressBook = await AddressBook.findByPk(addressBookId, { transaction });
  if (!addressBook) {
    throw new Error(`Address book not found: ${addressBookId}`);
  }

  await addressBook.update(updates, { transaction });
  return addressBook;
};

/**
 * Deletes an address book
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {string} addressBookId - Address book ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if deleted
 */
export const deleteAddressBook = async (
  AddressBook: ModelStatic<any>,
  addressBookId: string,
  transaction?: Transaction,
): Promise<boolean> => {
  const addressBook = await AddressBook.findByPk(addressBookId, { transaction });
  if (!addressBook) {
    return false;
  }

  await addressBook.destroy({ transaction });
  return true;
};

/**
 * Gets all address books for a user
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {string} userId - User ID
 * @returns {Promise<any[]>} Array of address books
 */
export const getUserAddressBooks = async (
  AddressBook: ModelStatic<any>,
  userId: string,
): Promise<any[]> => {
  return await AddressBook.findAll({
    where: { userId },
    order: [['sortOrder', 'ASC'], ['name', 'ASC']],
  });
};

/**
 * Gets or creates default address book for user
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {string} userId - User ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Default address book
 */
export const getOrCreateDefaultAddressBook = async (
  AddressBook: ModelStatic<any>,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  let addressBook = await AddressBook.findOne({
    where: { userId, isDefault: true },
    transaction,
  });

  if (!addressBook) {
    addressBook = await AddressBook.create(
      {
        userId,
        name: 'My Contacts',
        isDefault: true,
        color: '#3B82F6',
      },
      { transaction },
    );
  }

  return addressBook;
};

/**
 * Gets address book with contact count
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} addressBookId - Address book ID
 * @returns {Promise<any>} Address book with contact count
 */
export const getAddressBookWithStats = async (
  AddressBook: ModelStatic<any>,
  Contact: ModelStatic<any>,
  addressBookId: string,
): Promise<any> => {
  const addressBook = await AddressBook.findByPk(addressBookId, {
    include: [
      {
        model: Contact,
        as: 'contacts',
        attributes: [],
      },
    ],
    attributes: {
      include: [
        [fn('COUNT', col('contacts.id')), 'contactCount'],
      ],
    },
    group: ['AddressBook.id'],
    subQuery: false,
  });

  return addressBook;
};

// ============================================================================
// DISTRIBUTION LIST MANAGEMENT
// ============================================================================

/**
 * Creates a distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {DistributionListInfo} listData - Distribution list data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created distribution list
 */
export const createDistributionList = async (
  DistributionList: ModelStatic<any>,
  listData: DistributionListInfo,
  transaction?: Transaction,
): Promise<any> => {
  return await DistributionList.create(listData, { transaction });
};

/**
 * Updates a distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} listId - Distribution list ID
 * @param {Partial<DistributionListInfo>} updates - Distribution list updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated distribution list
 */
export const updateDistributionList = async (
  DistributionList: ModelStatic<any>,
  listId: string,
  updates: Partial<DistributionListInfo>,
  transaction?: Transaction,
): Promise<any> => {
  const list = await DistributionList.findByPk(listId, { transaction });
  if (!list) {
    throw new Error(`Distribution list not found: ${listId}`);
  }

  await list.update(updates, { transaction });
  return list;
};

/**
 * Deletes a distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} listId - Distribution list ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if deleted
 */
export const deleteDistributionList = async (
  DistributionList: ModelStatic<any>,
  listId: string,
  transaction?: Transaction,
): Promise<boolean> => {
  const list = await DistributionList.findByPk(listId, { transaction });
  if (!list) {
    return false;
  }

  await list.destroy({ transaction });
  return true;
};

/**
 * Adds members to distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} listId - Distribution list ID
 * @param {DistributionListMember[]} members - Members to add
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated distribution list
 */
export const addDistributionListMembers = async (
  DistributionList: ModelStatic<any>,
  listId: string,
  members: DistributionListMember[],
  transaction?: Transaction,
): Promise<any> => {
  const list = await DistributionList.findByPk(listId, { transaction });
  if (!list) {
    throw new Error(`Distribution list not found: ${listId}`);
  }

  const existingMembers = list.members || [];
  const updatedMembers = [...existingMembers, ...members];

  await list.update({ members: updatedMembers }, { transaction });
  return list;
};

/**
 * Removes members from distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} listId - Distribution list ID
 * @param {string[]} memberIds - Member IDs or emails to remove
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated distribution list
 */
export const removeDistributionListMembers = async (
  DistributionList: ModelStatic<any>,
  listId: string,
  memberIds: string[],
  transaction?: Transaction,
): Promise<any> => {
  const list = await DistributionList.findByPk(listId, { transaction });
  if (!list) {
    throw new Error(`Distribution list not found: ${listId}`);
  }

  const updatedMembers = (list.members || []).filter(
    (member: DistributionListMember) =>
      !memberIds.includes(member.contactId || '') && !memberIds.includes(member.email || ''),
  );

  await list.update({ members: updatedMembers }, { transaction });
  return list;
};

/**
 * Gets all email addresses from distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} listId - Distribution list ID
 * @returns {Promise<string[]>} Array of email addresses
 */
export const getDistributionListEmails = async (
  DistributionList: ModelStatic<any>,
  Contact: ModelStatic<any>,
  listId: string,
): Promise<string[]> => {
  const list = await DistributionList.findByPk(listId);
  if (!list) {
    return [];
  }

  const emails: string[] = [];

  for (const member of list.members || []) {
    if (member.type === 'external' && member.email) {
      emails.push(member.email);
    } else if (member.type === 'contact' && member.contactId) {
      const contact = await Contact.findByPk(member.contactId);
      if (contact && contact.emailAddresses && contact.emailAddresses.length > 0) {
        const primaryEmail = contact.emailAddresses.find((e: EmailAddress) => e.isPrimary);
        emails.push(primaryEmail?.email || contact.emailAddresses[0].email);
      }
    }
  }

  return emails;
};

// ============================================================================
// CONTACT GROUP MANAGEMENT
// ============================================================================

/**
 * Creates a contact group
 *
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {ContactGroupInfo} groupData - Contact group data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created contact group
 */
export const createContactGroup = async (
  ContactGroup: ModelStatic<any>,
  groupData: ContactGroupInfo,
  transaction?: Transaction,
): Promise<any> => {
  return await ContactGroup.create(groupData, { transaction });
};

/**
 * Updates a contact group
 *
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {string} groupId - Contact group ID
 * @param {Partial<ContactGroupInfo>} updates - Contact group updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated contact group
 */
export const updateContactGroup = async (
  ContactGroup: ModelStatic<any>,
  groupId: string,
  updates: Partial<ContactGroupInfo>,
  transaction?: Transaction,
): Promise<any> => {
  const group = await ContactGroup.findByPk(groupId, { transaction });
  if (!group) {
    throw new Error(`Contact group not found: ${groupId}`);
  }

  await group.update(updates, { transaction });
  return group;
};

/**
 * Deletes a contact group
 *
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {string} groupId - Contact group ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if deleted
 */
export const deleteContactGroup = async (
  ContactGroup: ModelStatic<any>,
  groupId: string,
  transaction?: Transaction,
): Promise<boolean> => {
  const group = await ContactGroup.findByPk(groupId, { transaction });
  if (!group) {
    return false;
  }

  await group.destroy({ transaction });
  return true;
};

/**
 * Adds contacts to a group
 *
 * @param {ModelStatic<any>} ContactGroupMembership - ContactGroupMembership model
 * @param {string} groupId - Contact group ID
 * @param {string[]} contactIds - Contact IDs to add
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
export const addContactsToGroup = async (
  ContactGroupMembership: ModelStatic<any>,
  groupId: string,
  contactIds: string[],
  transaction?: Transaction,
): Promise<void> => {
  const memberships = contactIds.map((contactId) => ({
    contactId,
    groupId,
  }));

  await ContactGroupMembership.bulkCreate(memberships, {
    transaction,
    ignoreDuplicates: true,
  });
};

/**
 * Removes contacts from a group
 *
 * @param {ModelStatic<any>} ContactGroupMembership - ContactGroupMembership model
 * @param {string} groupId - Contact group ID
 * @param {string[]} contactIds - Contact IDs to remove
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of removed memberships
 */
export const removeContactsFromGroup = async (
  ContactGroupMembership: ModelStatic<any>,
  groupId: string,
  contactIds: string[],
  transaction?: Transaction,
): Promise<number> => {
  return await ContactGroupMembership.destroy({
    where: {
      groupId,
      contactId: { [Op.in]: contactIds },
    },
    transaction,
  });
};

/**
 * Gets all contacts in a group
 *
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {string} groupId - Contact group ID
 * @returns {Promise<any[]>} Array of contacts
 */
export const getContactGroupMembers = async (
  ContactGroup: ModelStatic<any>,
  groupId: string,
): Promise<any[]> => {
  const group = await ContactGroup.findByPk(groupId, {
    include: [{ association: 'contacts', as: 'contacts' }],
  });

  return group?.contacts || [];
};

// ============================================================================
// CONTACT SEARCH AND FILTERING
// ============================================================================

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
export const searchContacts = async (
  Contact: ModelStatic<any>,
  userId: string,
  options: ContactSearchOptions,
): Promise<any[]> => {
  const where: WhereOptions = { userId };
  const having: WhereOptions = {};

  // Text search
  if (options.query) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${options.query}%` } },
      { lastName: { [Op.iLike]: `%${options.query}%` } },
      { displayName: { [Op.iLike]: `%${options.query}%` } },
      { company: { [Op.iLike]: `%${options.query}%` } },
      { department: { [Op.iLike]: `%${options.query}%` } },
      literal(`email_addresses::text ILIKE '%${options.query}%'`),
    ];
  }

  // Address book filter
  if (options.addressBookIds && options.addressBookIds.length > 0) {
    where.addressBookId = { [Op.in]: options.addressBookIds };
  }

  // Tags filter
  if (options.tags && options.tags.length > 0) {
    where.tags = { [Op.overlap]: options.tags };
  }

  // Favorite filter
  if (options.isFavorite !== undefined) {
    where.isFavorite = options.isFavorite;
  }

  // Source filter
  if (options.source) {
    where.source = options.source;
  }

  // Email/Phone filters
  if (options.hasEmail) {
    having[literal("jsonb_array_length(email_addresses)")] = { [Op.gt]: 0 };
  }

  if (options.hasPhone) {
    having[literal("jsonb_array_length(phone_numbers)")] = { [Op.gt]: 0 };
  }

  // Company filter
  if (options.companyFilter) {
    where.company = { [Op.iLike]: `%${options.companyFilter}%` };
  }

  // Department filter
  if (options.departmentFilter) {
    where.department = { [Op.iLike]: `%${options.departmentFilter}%` };
  }

  // Exclude IDs
  if (options.excludeIds && options.excludeIds.length > 0) {
    where.id = { [Op.notIn]: options.excludeIds };
  }

  // Sort options
  const orderMap: Record<string, any> = {
    name: [['lastName', 'ASC'], ['firstName', 'ASC']],
    company: [['company', 'ASC'], ['lastName', 'ASC']],
    recentlyUsed: [['lastUsedAt', 'DESC']],
    createdAt: [['createdAt', options.sortOrder || 'DESC']],
    updatedAt: [['updatedAt', options.sortOrder || 'DESC']],
  };

  const order = orderMap[options.sortBy || 'name'] || orderMap.name;

  return await Contact.findAll({
    where,
    having: Object.keys(having).length > 0 ? having : undefined,
    order,
    limit: options.limit || 50,
    offset: options.offset || 0,
  });
};

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
export const getContactSuggestions = async (
  Contact: ModelStatic<any>,
  userId: string,
  query: string,
  limit: number = 10,
): Promise<ContactSuggestion[]> => {
  if (query.length < 2) {
    return [];
  }

  const contacts = await Contact.findAll({
    where: {
      userId,
      [Op.or]: [
        { firstName: { [Op.iLike]: `${query}%` } },
        { lastName: { [Op.iLike]: `${query}%` } },
        { displayName: { [Op.iLike]: `${query}%` } },
        literal(`email_addresses::text ILIKE '%${query}%'`),
      ],
    },
    order: [
      ['isFavorite', 'DESC'],
      ['lastUsedAt', 'DESC'],
      ['lastName', 'ASC'],
    ],
    limit,
  });

  return contacts.map((contact: any) => {
    const primaryEmail = contact.emailAddresses?.find((e: EmailAddress) => e.isPrimary);
    const email = primaryEmail?.email || contact.emailAddresses?.[0]?.email || '';

    return {
      id: contact.id,
      displayName: contact.displayName || `${contact.firstName} ${contact.lastName}`,
      email,
      photoUrl: contact.photoUrl,
      company: contact.company,
      jobTitle: contact.jobTitle,
      source: contact.source,
      matchScore: contact.isFavorite ? 100 : 50,
      recentlyUsed: contact.lastUsedAt !== null,
    };
  });
};

/**
 * Gets recently used contacts
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @param {number} limit - Max results (default 10)
 * @returns {Promise<any[]>} Array of recently used contacts
 */
export const getRecentlyUsedContacts = async (
  Contact: ModelStatic<any>,
  userId: string,
  limit: number = 10,
): Promise<any[]> => {
  return await Contact.findAll({
    where: {
      userId,
      lastUsedAt: { [Op.ne]: null },
    },
    order: [['lastUsedAt', 'DESC']],
    limit,
  });
};

/**
 * Gets favorite contacts
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @returns {Promise<any[]>} Array of favorite contacts
 */
export const getFavoriteContacts = async (
  Contact: ModelStatic<any>,
  userId: string,
): Promise<any[]> => {
  return await Contact.findAll({
    where: {
      userId,
      isFavorite: true,
    },
    order: [['lastName', 'ASC'], ['firstName', 'ASC']],
  });
};

// ============================================================================
// VCARD IMPORT/EXPORT
// ============================================================================

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
export const contactToVCard = (contact: any): string => {
  const lines: string[] = [];

  lines.push('BEGIN:VCARD');
  lines.push('VERSION:4.0');

  // Formatted name
  lines.push(`FN:${contact.displayName || `${contact.firstName} ${contact.lastName}`}`);

  // Structured name (family;given;additional;prefix;suffix)
  const n = [
    contact.lastName || '',
    contact.firstName || '',
    contact.middleName || '',
    contact.prefix || '',
    contact.suffix || '',
  ].join(';');
  lines.push(`N:${n}`);

  // Nickname
  if (contact.nickname) {
    lines.push(`NICKNAME:${contact.nickname}`);
  }

  // Organization
  if (contact.company) {
    lines.push(`ORG:${contact.company}${contact.department ? `;${contact.department}` : ''}`);
  }

  // Title
  if (contact.jobTitle) {
    lines.push(`TITLE:${contact.jobTitle}`);
  }

  // Photo
  if (contact.photoUrl) {
    lines.push(`PHOTO;MEDIATYPE=image/jpeg:${contact.photoUrl}`);
  }

  // Email addresses
  if (contact.emailAddresses && Array.isArray(contact.emailAddresses)) {
    contact.emailAddresses.forEach((email: EmailAddress) => {
      const types = [email.type.toUpperCase()];
      if (email.isPrimary) types.push('PREF');
      lines.push(`EMAIL;TYPE=${types.join(',')};VALUE=text:${email.email}`);
    });
  }

  // Phone numbers
  if (contact.phoneNumbers && Array.isArray(contact.phoneNumbers)) {
    contact.phoneNumbers.forEach((phone: PhoneNumber) => {
      const types = [phone.type.toUpperCase()];
      if (phone.isPrimary) types.push('PREF');
      const value = phone.extension ? `${phone.number};ext=${phone.extension}` : phone.number;
      lines.push(`TEL;TYPE=${types.join(',')};VALUE=text:${value}`);
    });
  }

  // Addresses
  if (contact.addresses && Array.isArray(contact.addresses)) {
    contact.addresses.forEach((addr: PostalAddress) => {
      const types = [addr.type.toUpperCase()];
      if (addr.isPrimary) types.push('PREF');
      const adr = [
        '', // PO Box
        addr.street2 || '',
        addr.street || '',
        addr.city || '',
        addr.state || '',
        addr.postalCode || '',
        addr.country || '',
      ].join(';');
      lines.push(`ADR;TYPE=${types.join(',')}:${adr}`);
    });
  }

  // Websites
  if (contact.websites && Array.isArray(contact.websites)) {
    contact.websites.forEach((url: string) => {
      lines.push(`URL:${url}`);
    });
  }

  // Birthday
  if (contact.birthday) {
    const bday = new Date(contact.birthday).toISOString().split('T')[0].replace(/-/g, '');
    lines.push(`BDAY:${bday}`);
  }

  // Anniversary
  if (contact.anniversary) {
    const anniversary = new Date(contact.anniversary).toISOString().split('T')[0].replace(/-/g, '');
    lines.push(`ANNIVERSARY:${anniversary}`);
  }

  // Notes
  if (contact.notes) {
    lines.push(`NOTE:${contact.notes.replace(/\n/g, '\\n')}`);
  }

  // Categories (tags)
  if (contact.tags && contact.tags.length > 0) {
    lines.push(`CATEGORIES:${contact.tags.join(',')}`);
  }

  // UID
  lines.push(`UID:${contact.id}`);

  // Revision
  lines.push(`REV:${new Date(contact.updatedAt).toISOString()}`);

  lines.push('END:VCARD');

  return lines.join('\r\n');
};

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
export const parseVCard = (vcardString: string): Partial<ContactInfo> => {
  const lines = vcardString.split(/\r?\n/).filter((line) => line.trim());
  const contactData: Partial<ContactInfo> = {
    emailAddresses: [],
    phoneNumbers: [],
    addresses: [],
    websites: [],
    tags: [],
  };

  lines.forEach((line) => {
    const [key, ...valueParts] = line.split(':');
    const value = valueParts.join(':');
    const [field, ...params] = key.split(';');

    switch (field) {
      case 'FN':
        contactData.displayName = value;
        break;

      case 'N':
        const [lastName, firstName, middleName, prefix, suffix] = value.split(';');
        contactData.lastName = lastName;
        contactData.firstName = firstName;
        contactData.middleName = middleName || undefined;
        contactData.prefix = prefix || undefined;
        contactData.suffix = suffix || undefined;
        break;

      case 'NICKNAME':
        contactData.nickname = value;
        break;

      case 'ORG':
        const [company, department] = value.split(';');
        contactData.company = company;
        contactData.department = department;
        break;

      case 'TITLE':
        contactData.jobTitle = value;
        break;

      case 'PHOTO':
        contactData.photoUrl = value;
        break;

      case 'EMAIL':
        const emailType = params.find((p) => p.startsWith('TYPE='))?.split('=')[1]?.toLowerCase() || 'other';
        contactData.emailAddresses!.push({
          email: value,
          type: emailType.includes('work') ? 'work' : emailType.includes('personal') ? 'personal' : 'other',
          isPrimary: params.some((p) => p.includes('PREF')),
        });
        break;

      case 'TEL':
        const phoneType = params.find((p) => p.startsWith('TYPE='))?.split('=')[1]?.toLowerCase() || 'other';
        const [phoneNumber, ext] = value.split(';ext=');
        contactData.phoneNumbers!.push({
          number: phoneNumber,
          type: phoneType.includes('mobile') ? 'mobile' : phoneType.includes('work') ? 'work' : phoneType.includes('home') ? 'home' : 'other',
          isPrimary: params.some((p) => p.includes('PREF')),
          extension: ext,
        });
        break;

      case 'ADR':
        const adrType = params.find((p) => p.startsWith('TYPE='))?.split('=')[1]?.toLowerCase() || 'other';
        const [, street2, street, city, state, postalCode, country] = value.split(';');
        contactData.addresses!.push({
          street,
          street2,
          city,
          state,
          postalCode,
          country,
          type: adrType.includes('work') ? 'work' : adrType.includes('home') ? 'home' : 'other',
          isPrimary: params.some((p) => p.includes('PREF')),
        });
        break;

      case 'URL':
        contactData.websites!.push(value);
        break;

      case 'BDAY':
        contactData.birthday = new Date(value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
        break;

      case 'ANNIVERSARY':
        contactData.anniversary = new Date(value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
        break;

      case 'NOTE':
        contactData.notes = value.replace(/\\n/g, '\n');
        break;

      case 'CATEGORIES':
        contactData.tags = value.split(',').map((tag) => tag.trim());
        break;

      case 'UID':
        contactData.externalId = value;
        break;
    }
  });

  return contactData;
};

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
export const importContactsFromVCard = async (
  Contact: ModelStatic<any>,
  userId: string,
  vcardContent: string,
  options: ContactImportOptions = {},
  transaction?: Transaction,
): Promise<{ imported: number; skipped: number; updated: number }> => {
  const vcards = vcardContent.split('END:VCARD').filter((v) => v.trim());
  let imported = 0;
  let skipped = 0;
  let updated = 0;

  for (const vcardString of vcards) {
    if (!vcardString.includes('BEGIN:VCARD')) continue;

    const contactData = parseVCard(vcardString + '\nEND:VCARD');
    contactData.userId = userId;
    contactData.source = options.source || 'imported';

    if (options.addressBookId) {
      contactData.addressBookId = options.addressBookId;
    }

    if (options.tags && options.tags.length > 0) {
      contactData.tags = [...(contactData.tags || []), ...options.tags];
    }

    // Check for existing contact based on merge strategy
    let existingContact = null;
    if (options.matchBy === 'email' && contactData.emailAddresses && contactData.emailAddresses.length > 0) {
      const email = contactData.emailAddresses[0].email;
      existingContact = await Contact.findOne({
        where: {
          userId,
          [Op.or]: [literal(`email_addresses::text ILIKE '%${email}%'`)],
        },
        transaction,
      });
    } else if (options.matchBy === 'externalId' && contactData.externalId) {
      existingContact = await Contact.findOne({
        where: { userId, externalId: contactData.externalId },
        transaction,
      });
    }

    if (existingContact) {
      if (options.mergeStrategy === 'skip') {
        skipped++;
      } else if (options.mergeStrategy === 'update') {
        await existingContact.update(contactData, { transaction });
        updated++;
      } else {
        // duplicate
        await Contact.create(contactData, { transaction });
        imported++;
      }
    } else {
      await Contact.create(contactData, { transaction });
      imported++;
    }
  }

  return { imported, skipped, updated };
};

/**
 * Exports contacts to vCard format
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string[]} contactIds - Contact IDs to export
 * @returns {Promise<string>} vCard content
 */
export const exportContactsToVCard = async (
  Contact: ModelStatic<any>,
  contactIds: string[],
): Promise<string> => {
  const contacts = await Contact.findAll({
    where: { id: { [Op.in]: contactIds } },
  });

  return contacts.map((contact: any) => contactToVCard(contact)).join('\r\n\r\n');
};

// ============================================================================
// CONTACT SHARING AND PERMISSIONS
// ============================================================================

/**
 * Shares a contact with another user
 *
 * @param {ModelStatic<any>} ContactSharing - ContactSharing model
 * @param {ContactSharingInfo} sharingData - Sharing data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created sharing entry
 */
export const shareContact = async (
  ContactSharing: ModelStatic<any>,
  sharingData: ContactSharingInfo,
  transaction?: Transaction,
): Promise<any> => {
  return await ContactSharing.create(sharingData, { transaction });
};

/**
 * Removes contact sharing
 *
 * @param {ModelStatic<any>} ContactSharing - ContactSharing model
 * @param {string} sharingId - Sharing entry ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if removed
 */
export const unshareContact = async (
  ContactSharing: ModelStatic<any>,
  sharingId: string,
  transaction?: Transaction,
): Promise<boolean> => {
  const result = await ContactSharing.destroy({
    where: { id: sharingId },
    transaction,
  });

  return result > 0;
};

/**
 * Gets all shared contacts for a user
 *
 * @param {ModelStatic<any>} ContactSharing - ContactSharing model
 * @param {string} userId - User ID
 * @returns {Promise<any[]>} Array of shared contacts
 */
export const getSharedContacts = async (
  ContactSharing: ModelStatic<any>,
  userId: string,
): Promise<any[]> => {
  return await ContactSharing.findAll({
    where: {
      sharedWithUserId: userId,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } },
      ],
    },
    include: [{ association: 'contact', as: 'contact' }],
  });
};

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
export const hasContactPermission = async (
  Contact: ModelStatic<any>,
  ContactSharing: ModelStatic<any>,
  contactId: string,
  userId: string,
  requiredPermission: 'view' | 'edit' | 'full' = 'view',
): Promise<boolean> => {
  // Check if user owns the contact
  const contact = await Contact.findByPk(contactId);
  if (contact?.userId === userId) {
    return true;
  }

  // Check if contact is shared with user
  const sharing = await ContactSharing.findOne({
    where: {
      contactId,
      sharedWithUserId: userId,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } },
      ],
    },
  });

  if (!sharing) {
    return false;
  }

  // Check permission level
  const permissionLevels = { view: 1, edit: 2, full: 3 };
  const userLevel = permissionLevels[sharing.permission];
  const requiredLevel = permissionLevels[requiredPermission];

  return userLevel >= requiredLevel;
};

// ============================================================================
// CONTACT MERGING AND DEDUPLICATION
// ============================================================================

/**
 * Merges multiple contacts into one
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {ContactMergeConfig} config - Merge configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Merged contact
 */
export const mergeContacts = async (
  Contact: ModelStatic<any>,
  config: ContactMergeConfig,
  transaction?: Transaction,
): Promise<any> => {
  const primaryContact = await Contact.findByPk(config.primaryContactId, { transaction });
  if (!primaryContact) {
    throw new Error(`Primary contact not found: ${config.primaryContactId}`);
  }

  const mergeContacts = await Contact.findAll({
    where: { id: { [Op.in]: config.mergeContactIds } },
    transaction,
  });

  const mergedData: any = { ...primaryContact.toJSON() };

  // Merge email addresses
  const allEmails = new Set<string>();
  primaryContact.emailAddresses.forEach((e: EmailAddress) => allEmails.add(e.email));

  if (config.keepBothEmails) {
    mergeContacts.forEach((contact: any) => {
      contact.emailAddresses.forEach((e: EmailAddress) => {
        if (!allEmails.has(e.email)) {
          mergedData.emailAddresses.push(e);
          allEmails.add(e.email);
        }
      });
    });
  }

  // Merge phone numbers
  const allPhones = new Set<string>();
  primaryContact.phoneNumbers.forEach((p: PhoneNumber) => allPhones.add(p.number));

  if (config.keepBothPhones) {
    mergeContacts.forEach((contact: any) => {
      contact.phoneNumbers.forEach((p: PhoneNumber) => {
        if (!allPhones.has(p.number)) {
          mergedData.phoneNumbers.push(p);
          allPhones.add(p.number);
        }
      });
    });
  }

  // Merge addresses
  if (config.keepBothAddresses) {
    mergeContacts.forEach((contact: any) => {
      mergedData.addresses.push(...contact.addresses);
    });
  }

  // Merge tags
  const allTags = new Set([...(primaryContact.tags || [])]);
  mergeContacts.forEach((contact: any) => {
    (contact.tags || []).forEach((tag: string) => allTags.add(tag));
  });
  mergedData.tags = Array.from(allTags);

  // Update primary contact
  await primaryContact.update(mergedData, { transaction });

  // Delete merged contacts
  await Contact.destroy({
    where: { id: { [Op.in]: config.mergeContactIds } },
    transaction,
  });

  return primaryContact;
};

/**
 * Finds duplicate contacts
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @returns {Promise<any[][]>} Array of duplicate contact groups
 */
export const findDuplicateContacts = async (
  Contact: ModelStatic<any>,
  userId: string,
): Promise<any[][]> => {
  // Find duplicates by email
  const emailDuplicates = await Contact.sequelize!.query(
    `
    SELECT c1.id, c2.id as duplicate_id
    FROM mail_contacts c1
    INNER JOIN mail_contacts c2 ON c1.email_addresses && c2.email_addresses
    WHERE c1.user_id = :userId
      AND c2.user_id = :userId
      AND c1.id < c2.id
      AND c1.deleted_at IS NULL
      AND c2.deleted_at IS NULL
  `,
    {
      replacements: { userId },
      type: QueryTypes.SELECT,
    },
  );

  // Find duplicates by name
  const nameDuplicates = await Contact.sequelize!.query(
    `
    SELECT c1.id, c2.id as duplicate_id
    FROM mail_contacts c1
    INNER JOIN mail_contacts c2
      ON LOWER(c1.first_name) = LOWER(c2.first_name)
      AND LOWER(c1.last_name) = LOWER(c2.last_name)
    WHERE c1.user_id = :userId
      AND c2.user_id = :userId
      AND c1.id < c2.id
      AND c1.deleted_at IS NULL
      AND c2.deleted_at IS NULL
  `,
    {
      replacements: { userId },
      type: QueryTypes.SELECT,
    },
  );

  // Group duplicates
  const duplicateGroups = new Map<string, Set<string>>();

  [...emailDuplicates, ...nameDuplicates].forEach((dup: any) => {
    const key = dup.id;
    if (!duplicateGroups.has(key)) {
      duplicateGroups.set(key, new Set([key]));
    }
    duplicateGroups.get(key)!.add(dup.duplicate_id);
  });

  // Convert to array of arrays
  const result: any[][] = [];
  const processed = new Set<string>();

  for (const [id, duplicates] of duplicateGroups) {
    if (processed.has(id)) continue;

    const group = Array.from(duplicates);
    result.push(
      await Contact.findAll({
        where: { id: { [Op.in]: group } },
      }),
    );

    group.forEach((gid) => processed.add(gid));
  }

  return result;
};

// ============================================================================
// GLOBAL ADDRESS LIST (GAL) INTEGRATION
// ============================================================================

/**
 * Syncs contacts from GAL/LDAP source
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @param {GALEntry[]} galEntries - GAL entries to sync
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ created: number; updated: number; deleted: number }>} Sync results
 */
export const syncContactsFromGAL = async (
  Contact: ModelStatic<any>,
  userId: string,
  galEntries: GALEntry[],
  transaction?: Transaction,
): Promise<{ created: number; updated: number; deleted: number }> => {
  let created = 0;
  let updated = 0;
  let deleted = 0;

  const externalIds = galEntries.map((entry) => entry.externalId);

  // Find existing GAL contacts
  const existingContacts = await Contact.findAll({
    where: {
      userId,
      source: { [Op.in]: ['gal', 'ldap', 'exchange'] },
    },
    transaction,
  });

  // Update or create contacts
  for (const entry of galEntries) {
    const contactData: Partial<ContactInfo> = {
      userId,
      firstName: entry.firstName || '',
      lastName: entry.lastName || '',
      displayName: entry.displayName,
      company: entry.company,
      department: entry.department,
      jobTitle: entry.jobTitle,
      emailAddresses: [{ email: entry.emailAddress, type: 'work', isPrimary: true }],
      phoneNumbers: entry.phoneNumber ? [{ number: entry.phoneNumber, type: 'work', isPrimary: true }] : [],
      photoUrl: entry.photoUrl,
      source: 'gal',
      externalId: entry.externalId,
      lastSyncedAt: new Date(),
    };

    const existing = existingContacts.find((c: any) => c.externalId === entry.externalId);

    if (existing) {
      await existing.update(contactData, { transaction });
      updated++;
    } else {
      await Contact.create(contactData, { transaction });
      created++;
    }
  }

  // Delete contacts no longer in GAL
  const toDelete = existingContacts.filter((c: any) => !externalIds.includes(c.externalId));
  for (const contact of toDelete) {
    await contact.destroy({ transaction });
    deleted++;
  }

  return { created, updated, deleted };
};

/**
 * Searches Global Address List
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} query - Search query
 * @param {number} limit - Max results
 * @returns {Promise<GALEntry[]>} GAL search results
 */
export const searchGAL = async (
  Contact: ModelStatic<any>,
  query: string,
  limit: number = 20,
): Promise<GALEntry[]> => {
  const contacts = await Contact.findAll({
    where: {
      source: { [Op.in]: ['gal', 'ldap', 'exchange'] },
      [Op.or]: [
        { firstName: { [Op.iLike]: `%${query}%` } },
        { lastName: { [Op.iLike]: `%${query}%` } },
        { displayName: { [Op.iLike]: `%${query}%` } },
        { company: { [Op.iLike]: `%${query}%` } },
        { department: { [Op.iLike]: `%${query}%` } },
        literal(`email_addresses::text ILIKE '%${query}%'`),
      ],
    },
    order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    limit,
  });

  return contacts.map((contact: any) => ({
    id: contact.id,
    displayName: contact.displayName,
    emailAddress: contact.emailAddresses[0]?.email || '',
    firstName: contact.firstName,
    lastName: contact.lastName,
    department: contact.department,
    jobTitle: contact.jobTitle,
    company: contact.company,
    phoneNumber: contact.phoneNumbers[0]?.number,
    photoUrl: contact.photoUrl,
    externalId: contact.externalId,
  }));
};

// ============================================================================
// CONTACT AUDIT AND HISTORY
// ============================================================================

/**
 * Records contact audit event
 *
 * @param {ModelStatic<any>} ContactAudit - ContactAudit model
 * @param {ContactAuditEvent} auditData - Audit event data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created audit entry
 */
export const recordContactAudit = async (
  ContactAudit: ModelStatic<any>,
  auditData: ContactAuditEvent,
  transaction?: Transaction,
): Promise<any> => {
  return await ContactAudit.create(auditData, { transaction });
};

/**
 * Gets contact audit history
 *
 * @param {ModelStatic<any>} ContactAudit - ContactAudit model
 * @param {string} contactId - Contact ID
 * @param {number} limit - Max entries (default 50)
 * @returns {Promise<any[]>} Audit history
 */
export const getContactAuditHistory = async (
  ContactAudit: ModelStatic<any>,
  contactId: string,
  limit: number = 50,
): Promise<any[]> => {
  return await ContactAudit.findAll({
    where: { contactId },
    order: [['timestamp', 'DESC']],
    limit,
  });
};

// ============================================================================
// CONTACT STATISTICS
// ============================================================================

/**
 * Gets contact statistics for user
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} userId - User ID
 * @returns {Promise<ContactStatistics>} Contact statistics
 */
export const getContactStatistics = async (
  Contact: ModelStatic<any>,
  ContactGroup: ModelStatic<any>,
  DistributionList: ModelStatic<any>,
  userId: string,
): Promise<ContactStatistics> => {
  const totalContacts = await Contact.count({ where: { userId } });
  const favoriteCount = await Contact.count({ where: { userId, isFavorite: true } });

  const withEmailCount = await Contact.count({
    where: {
      userId,
      [Op.and]: [literal("jsonb_array_length(email_addresses) > 0")],
    },
  });

  const withPhoneCount = await Contact.count({
    where: {
      userId,
      [Op.and]: [literal("jsonb_array_length(phone_numbers) > 0")],
    },
  });

  const groupCount = await ContactGroup.count({ where: { userId } });
  const distributionListCount = await DistributionList.count({ where: { userId } });

  const recentlyAddedCount = await Contact.count({
    where: {
      userId,
      createdAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  });

  // Count by source
  const sourceStats = await Contact.findAll({
    where: { userId },
    attributes: ['source', [fn('COUNT', col('id')), 'count']],
    group: ['source'],
    raw: true,
  });

  const contactsBySource: Record<string, number> = {};
  sourceStats.forEach((stat: any) => {
    contactsBySource[stat.source] = parseInt(stat.count, 10);
  });

  // Count by address book
  const addressBookStats = await Contact.findAll({
    where: { userId },
    attributes: ['addressBookId', [fn('COUNT', col('id')), 'count']],
    group: ['addressBookId'],
    raw: true,
  });

  const contactsByAddressBook: Record<string, number> = {};
  addressBookStats.forEach((stat: any) => {
    contactsByAddressBook[stat.addressBookId || 'none'] = parseInt(stat.count, 10);
  });

  return {
    totalContacts,
    contactsBySource,
    contactsByAddressBook,
    favoriteCount,
    withEmailCount,
    withPhoneCount,
    groupCount,
    distributionListCount,
    recentlyAddedCount,
  };
};

// ============================================================================
// SWAGGER/OPENAPI DOCUMENTATION HELPERS
// ============================================================================

/**
 * Generates Swagger schema for Contact model
 *
 * @returns {Object} Swagger schema object
 */
export const getContactSwaggerSchema = (): any => ({
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    userId: { type: 'string', format: 'uuid' },
    addressBookId: { type: 'string', format: 'uuid', nullable: true },
    firstName: { type: 'string', example: 'John' },
    lastName: { type: 'string', example: 'Doe' },
    middleName: { type: 'string', nullable: true },
    displayName: { type: 'string', example: 'John Doe' },
    nickname: { type: 'string', nullable: true },
    prefix: { type: 'string', example: 'Dr.', nullable: true },
    suffix: { type: 'string', example: 'Jr.', nullable: true },
    company: { type: 'string', example: 'Acme Corp', nullable: true },
    department: { type: 'string', example: 'Engineering', nullable: true },
    jobTitle: { type: 'string', example: 'Software Engineer', nullable: true },
    emailAddresses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          type: { type: 'string', enum: ['personal', 'work', 'other'] },
          isPrimary: { type: 'boolean' },
          label: { type: 'string', nullable: true },
        },
      },
    },
    phoneNumbers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          number: { type: 'string', example: '+1234567890' },
          type: { type: 'string', enum: ['mobile', 'home', 'work', 'fax', 'pager', 'other'] },
          isPrimary: { type: 'boolean' },
          label: { type: 'string', nullable: true },
          extension: { type: 'string', nullable: true },
        },
      },
    },
    addresses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          street: { type: 'string', nullable: true },
          street2: { type: 'string', nullable: true },
          city: { type: 'string', nullable: true },
          state: { type: 'string', nullable: true },
          postalCode: { type: 'string', nullable: true },
          country: { type: 'string', nullable: true },
          type: { type: 'string', enum: ['home', 'work', 'other'] },
          isPrimary: { type: 'boolean' },
          label: { type: 'string', nullable: true },
        },
      },
    },
    websites: { type: 'array', items: { type: 'string', format: 'uri' } },
    photoUrl: { type: 'string', format: 'uri', nullable: true },
    notes: { type: 'string', nullable: true },
    birthday: { type: 'string', format: 'date', nullable: true },
    anniversary: { type: 'string', format: 'date', nullable: true },
    customFields: { type: 'object', additionalProperties: true },
    tags: { type: 'array', items: { type: 'string' } },
    isFavorite: { type: 'boolean', default: false },
    source: { type: 'string', enum: ['manual', 'imported', 'gal', 'ldap', 'exchange'] },
    externalId: { type: 'string', nullable: true },
    lastSyncedAt: { type: 'string', format: 'date-time', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
});

/**
 * Generates Swagger schema for AddressBook model
 *
 * @returns {Object} Swagger schema object
 */
export const getAddressBookSwaggerSchema = (): any => ({
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    userId: { type: 'string', format: 'uuid' },
    name: { type: 'string', example: 'My Contacts' },
    description: { type: 'string', nullable: true },
    color: { type: 'string', example: '#3B82F6' },
    isDefault: { type: 'boolean', default: false },
    isShared: { type: 'boolean', default: false },
    icon: { type: 'string', nullable: true },
    sortOrder: { type: 'integer', default: 0 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
});

/**
 * Generates Swagger schema for DistributionList model
 *
 * @returns {Object} Swagger schema object
 */
export const getDistributionListSwaggerSchema = (): any => ({
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    userId: { type: 'string', format: 'uuid' },
    addressBookId: { type: 'string', format: 'uuid', nullable: true },
    name: { type: 'string', example: 'Project Team' },
    description: { type: 'string', nullable: true },
    emailAddress: { type: 'string', format: 'email', nullable: true },
    members: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          contactId: { type: 'string', format: 'uuid', nullable: true },
          email: { type: 'string', format: 'email', nullable: true },
          displayName: { type: 'string', nullable: true },
          type: { type: 'string', enum: ['contact', 'external', 'group'] },
          isActive: { type: 'boolean', default: true },
        },
      },
    },
    isPublic: { type: 'boolean', default: false },
    allowExternalMembers: { type: 'boolean', default: false },
    moderatorIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
    tags: { type: 'array', items: { type: 'string' } },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
});

/**
 * Generates complete Swagger/OpenAPI paths for contact endpoints
 *
 * @returns {Object} Swagger paths object
 */
export const getContactSwaggerPaths = (): any => ({
  '/contacts': {
    get: {
      tags: ['Contacts'],
      summary: 'Get all contacts',
      parameters: [
        { name: 'addressBookId', in: 'query', schema: { type: 'string', format: 'uuid' } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
        { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
      ],
      responses: {
        200: {
          description: 'List of contacts',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Contact' },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Contacts'],
      summary: 'Create a new contact',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Contact' },
          },
        },
      },
      responses: {
        201: {
          description: 'Contact created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Contact' },
            },
          },
        },
      },
    },
  },
  '/contacts/{id}': {
    get: {
      tags: ['Contacts'],
      summary: 'Get contact by ID',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
      responses: {
        200: {
          description: 'Contact details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Contact' },
            },
          },
        },
        404: { description: 'Contact not found' },
      },
    },
    put: {
      tags: ['Contacts'],
      summary: 'Update contact',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Contact' },
          },
        },
      },
      responses: {
        200: {
          description: 'Contact updated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Contact' },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Contacts'],
      summary: 'Delete contact',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
      responses: {
        204: { description: 'Contact deleted' },
        404: { description: 'Contact not found' },
      },
    },
  },
  '/contacts/search': {
    post: {
      tags: ['Contacts'],
      summary: 'Search contacts',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                addressBookIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
                tags: { type: 'array', items: { type: 'string' } },
                isFavorite: { type: 'boolean' },
                limit: { type: 'integer', default: 50 },
                offset: { type: 'integer', default: 0 },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Search results',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Contact' },
              },
            },
          },
        },
      },
    },
  },
  '/contacts/suggestions': {
    get: {
      tags: ['Contacts'],
      summary: 'Get contact auto-complete suggestions',
      parameters: [
        { name: 'query', in: 'query', required: true, schema: { type: 'string', minLength: 2 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
      ],
      responses: {
        200: {
          description: 'Contact suggestions',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    displayName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    photoUrl: { type: 'string', format: 'uri' },
                    company: { type: 'string' },
                    matchScore: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/address-books': {
    get: {
      tags: ['Address Books'],
      summary: 'Get all address books',
      responses: {
        200: {
          description: 'List of address books',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/AddressBook' },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Address Books'],
      summary: 'Create address book',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AddressBook' },
          },
        },
      },
      responses: {
        201: {
          description: 'Address book created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddressBook' },
            },
          },
        },
      },
    },
  },
  '/distribution-lists': {
    get: {
      tags: ['Distribution Lists'],
      summary: 'Get all distribution lists',
      responses: {
        200: {
          description: 'List of distribution lists',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/DistributionList' },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Distribution Lists'],
      summary: 'Create distribution list',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/DistributionList' },
          },
        },
      },
      responses: {
        201: {
          description: 'Distribution list created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DistributionList' },
            },
          },
        },
      },
    },
  },
  '/gal/search': {
    get: {
      tags: ['Global Address List'],
      summary: 'Search Global Address List',
      parameters: [
        { name: 'query', in: 'query', required: true, schema: { type: 'string' } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
      ],
      responses: {
        200: {
          description: 'GAL search results',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    displayName: { type: 'string' },
                    emailAddress: { type: 'string', format: 'email' },
                    department: { type: 'string' },
                    jobTitle: { type: 'string' },
                    company: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Model definitions
  getContactModelAttributes,
  getAddressBookModelAttributes,
  getDistributionListModelAttributes,
  getContactGroupModelAttributes,
  getContactGroupMembershipAttributes,
  getContactSharingAttributes,
  getContactAuditAttributes,

  // Model initialization
  initContactModel,
  initAddressBookModel,
  initDistributionListModel,
  initContactGroupModel,
  initContactGroupMembershipModel,
  initContactSharingModel,
  initContactAuditModel,
  setupContactAssociations,

  // Contact CRUD
  createContact,
  updateContact,
  deleteContact,
  getContactById,
  getUserContacts,
  markContactAsUsed,
  toggleContactFavorite,

  // Address book management
  createAddressBook,
  updateAddressBook,
  deleteAddressBook,
  getUserAddressBooks,
  getOrCreateDefaultAddressBook,
  getAddressBookWithStats,

  // Distribution list management
  createDistributionList,
  updateDistributionList,
  deleteDistributionList,
  addDistributionListMembers,
  removeDistributionListMembers,
  getDistributionListEmails,

  // Contact group management
  createContactGroup,
  updateContactGroup,
  deleteContactGroup,
  addContactsToGroup,
  removeContactsFromGroup,
  getContactGroupMembers,

  // Contact search and filtering
  searchContacts,
  getContactSuggestions,
  getRecentlyUsedContacts,
  getFavoriteContacts,

  // vCard import/export
  contactToVCard,
  parseVCard,
  importContactsFromVCard,
  exportContactsToVCard,

  // Contact sharing
  shareContact,
  unshareContact,
  getSharedContacts,
  hasContactPermission,

  // Contact merging
  mergeContacts,
  findDuplicateContacts,

  // GAL integration
  syncContactsFromGAL,
  searchGAL,

  // Audit and history
  recordContactAudit,
  getContactAuditHistory,

  // Statistics
  getContactStatistics,

  // Swagger documentation
  getContactSwaggerSchema,
  getAddressBookSwaggerSchema,
  getDistributionListSwaggerSchema,
  getContactSwaggerPaths,
};
