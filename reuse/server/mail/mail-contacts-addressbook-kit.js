"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.unshareContact = exports.shareContact = exports.exportContactsToVCard = exports.importContactsFromVCard = exports.parseVCard = exports.contactToVCard = exports.getFavoriteContacts = exports.getRecentlyUsedContacts = exports.getContactSuggestions = exports.searchContacts = exports.getContactGroupMembers = exports.removeContactsFromGroup = exports.addContactsToGroup = exports.deleteContactGroup = exports.updateContactGroup = exports.createContactGroup = exports.getDistributionListEmails = exports.removeDistributionListMembers = exports.addDistributionListMembers = exports.deleteDistributionList = exports.updateDistributionList = exports.createDistributionList = exports.getAddressBookWithStats = exports.getOrCreateDefaultAddressBook = exports.getUserAddressBooks = exports.deleteAddressBook = exports.updateAddressBook = exports.createAddressBook = exports.toggleContactFavorite = exports.markContactAsUsed = exports.getUserContacts = exports.getContactById = exports.deleteContact = exports.updateContact = exports.createContact = exports.setupContactAssociations = exports.initContactAuditModel = exports.initContactSharingModel = exports.initContactGroupMembershipModel = exports.initContactGroupModel = exports.initDistributionListModel = exports.initAddressBookModel = exports.initContactModel = exports.getContactAuditAttributes = exports.getContactSharingAttributes = exports.getContactGroupMembershipAttributes = exports.getContactGroupModelAttributes = exports.getDistributionListModelAttributes = exports.getAddressBookModelAttributes = exports.getContactModelAttributes = void 0;
exports.getContactSwaggerPaths = exports.getDistributionListSwaggerSchema = exports.getAddressBookSwaggerSchema = exports.getContactSwaggerSchema = exports.getContactStatistics = exports.getContactAuditHistory = exports.recordContactAudit = exports.searchGAL = exports.syncContactsFromGAL = exports.findDuplicateContacts = exports.mergeContacts = exports.hasContactPermission = exports.getSharedContacts = void 0;
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
const sequelize_1 = require("sequelize");
const validator_1 = require("validator");
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Defines Contact model attributes
 *
 * @returns {ModelAttributes} Contact model attributes
 */
const getContactModelAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    addressBookId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'mail_address_books',
            key: 'id',
        },
        onDelete: 'SET NULL',
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    middleName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    displayName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    nickname: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    prefix: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    suffix: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    company: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    department: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    jobTitle: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    emailAddresses: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        validate: {
            isValidEmails(value) {
                if (!Array.isArray(value)) {
                    throw new Error('emailAddresses must be an array');
                }
                value.forEach((email) => {
                    if (!email.email || !(0, validator_1.isEmail)(email.email)) {
                        throw new Error(`Invalid email address: ${email.email}`);
                    }
                });
            },
        },
    },
    phoneNumbers: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
    },
    addresses: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
    },
    websites: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
    photoUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    birthday: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    anniversary: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    customFields: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
    },
    tags: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
    },
    isFavorite: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    source: {
        type: sequelize_1.DataTypes.ENUM('manual', 'imported', 'gal', 'ldap', 'exchange'),
        allowNull: false,
        defaultValue: 'manual',
    },
    externalId: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        unique: true,
    },
    lastSyncedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    lastUsedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    useCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
});
exports.getContactModelAttributes = getContactModelAttributes;
/**
 * Defines AddressBook model attributes
 *
 * @returns {ModelAttributes} AddressBook model attributes
 */
const getAddressBookModelAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    color: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        defaultValue: '#3B82F6',
    },
    isDefault: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isShared: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    icon: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    sortOrder: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
});
exports.getAddressBookModelAttributes = getAddressBookModelAttributes;
/**
 * Defines DistributionList model attributes
 *
 * @returns {ModelAttributes} DistributionList model attributes
 */
const getDistributionListModelAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    addressBookId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'mail_address_books',
            key: 'id',
        },
        onDelete: 'SET NULL',
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    emailAddress: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    members: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
    },
    isPublic: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    allowExternalMembers: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    moderatorIds: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
        allowNull: true,
        defaultValue: [],
    },
    tags: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
});
exports.getDistributionListModelAttributes = getDistributionListModelAttributes;
/**
 * Defines ContactGroup model attributes
 *
 * @returns {ModelAttributes} ContactGroup model attributes
 */
const getContactGroupModelAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    addressBookId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'mail_address_books',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    color: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    icon: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    parentGroupId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'mail_contact_groups',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    sortOrder: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
});
exports.getContactGroupModelAttributes = getContactGroupModelAttributes;
/**
 * Defines ContactGroupMembership junction table attributes
 *
 * @returns {ModelAttributes} ContactGroupMembership model attributes
 */
const getContactGroupMembershipAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    contactId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'mail_contacts',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    groupId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'mail_contact_groups',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    addedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.getContactGroupMembershipAttributes = getContactGroupMembershipAttributes;
/**
 * Defines ContactSharing model attributes
 *
 * @returns {ModelAttributes} ContactSharing model attributes
 */
const getContactSharingAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    contactId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'mail_contacts',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    addressBookId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'mail_address_books',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    sharedByUserId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    sharedWithUserId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    sharedWithGroupId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    permission: {
        type: sequelize_1.DataTypes.ENUM('view', 'edit', 'full'),
        allowNull: false,
        defaultValue: 'view',
    },
    expiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
});
exports.getContactSharingAttributes = getContactSharingAttributes;
/**
 * Defines ContactAudit model attributes
 *
 * @returns {ModelAttributes} ContactAudit model attributes
 */
const getContactAuditAttributes = () => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    contactId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'mail_contacts',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    action: {
        type: sequelize_1.DataTypes.ENUM('created', 'updated', 'deleted', 'merged', 'shared', 'unshared', 'exported', 'imported'),
        allowNull: false,
    },
    changes: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    ipAddress: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: true,
    },
    userAgent: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    timestamp: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.getContactAuditAttributes = getContactAuditAttributes;
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
const initContactModel = (sequelize) => {
    class Contact extends sequelize_1.Model {
    }
    Contact.init((0, exports.getContactModelAttributes)(), {
        sequelize,
        tableName: 'mail_contacts',
        paranoid: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['addressBookId'] },
            { fields: ['firstName', 'lastName'] },
            { fields: ['company'] },
            { fields: ['externalId'], unique: true, where: { externalId: { [sequelize_1.Op.ne]: null } } },
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
                fields: [(0, sequelize_1.literal)("to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(company, ''))")],
                using: 'gin',
            },
        ],
    });
    return Contact;
};
exports.initContactModel = initContactModel;
/**
 * Initializes AddressBook model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized AddressBook model
 */
const initAddressBookModel = (sequelize) => {
    class AddressBook extends sequelize_1.Model {
    }
    AddressBook.init((0, exports.getAddressBookModelAttributes)(), {
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
exports.initAddressBookModel = initAddressBookModel;
/**
 * Initializes DistributionList model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized DistributionList model
 */
const initDistributionListModel = (sequelize) => {
    class DistributionList extends sequelize_1.Model {
    }
    DistributionList.init((0, exports.getDistributionListModelAttributes)(), {
        sequelize,
        tableName: 'mail_distribution_lists',
        paranoid: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['addressBookId'] },
            { fields: ['emailAddress'], unique: true, where: { emailAddress: { [sequelize_1.Op.ne]: null } } },
            { fields: ['isPublic'] },
        ],
    });
    return DistributionList;
};
exports.initDistributionListModel = initDistributionListModel;
/**
 * Initializes ContactGroup model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized ContactGroup model
 */
const initContactGroupModel = (sequelize) => {
    class ContactGroup extends sequelize_1.Model {
    }
    ContactGroup.init((0, exports.getContactGroupModelAttributes)(), {
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
exports.initContactGroupModel = initContactGroupModel;
/**
 * Initializes ContactGroupMembership junction model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized ContactGroupMembership model
 */
const initContactGroupMembershipModel = (sequelize) => {
    class ContactGroupMembership extends sequelize_1.Model {
    }
    ContactGroupMembership.init((0, exports.getContactGroupMembershipAttributes)(), {
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
exports.initContactGroupMembershipModel = initContactGroupMembershipModel;
/**
 * Initializes ContactSharing model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized ContactSharing model
 */
const initContactSharingModel = (sequelize) => {
    class ContactSharing extends sequelize_1.Model {
    }
    ContactSharing.init((0, exports.getContactSharingAttributes)(), {
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
exports.initContactSharingModel = initContactSharingModel;
/**
 * Initializes ContactAudit model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Initialized ContactAudit model
 */
const initContactAuditModel = (sequelize) => {
    class ContactAudit extends sequelize_1.Model {
    }
    ContactAudit.init((0, exports.getContactAuditAttributes)(), {
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
exports.initContactAuditModel = initContactAuditModel;
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
const setupContactAssociations = (models) => {
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
exports.setupContactAssociations = setupContactAssociations;
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
const createContact = async (Contact, contactData, transaction) => {
    // Auto-generate display name if not provided
    if (!contactData.displayName) {
        contactData.displayName = `${contactData.firstName} ${contactData.lastName}`.trim();
    }
    return await Contact.create(contactData, { transaction });
};
exports.createContact = createContact;
/**
 * Updates an existing contact
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {Partial<ContactInfo>} updates - Contact updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated contact
 */
const updateContact = async (Contact, contactId, updates, transaction) => {
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
exports.updateContact = updateContact;
/**
 * Deletes a contact (soft delete)
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if deleted
 */
const deleteContact = async (Contact, contactId, transaction) => {
    const contact = await Contact.findByPk(contactId, { transaction });
    if (!contact) {
        return false;
    }
    await contact.destroy({ transaction });
    return true;
};
exports.deleteContact = deleteContact;
/**
 * Gets a contact by ID with optional includes
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {Object} options - Query options
 * @returns {Promise<any>} Contact or null
 */
const getContactById = async (Contact, contactId, options) => {
    const include = [];
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
exports.getContactById = getContactById;
/**
 * Gets all contacts for a user
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<any[]>} Array of contacts
 */
const getUserContacts = async (Contact, userId, options) => {
    const where = { userId };
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
exports.getUserContacts = getUserContacts;
/**
 * Marks contact as recently used
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
const markContactAsUsed = async (Contact, contactId, transaction) => {
    await Contact.update({
        lastUsedAt: new Date(),
        useCount: (0, sequelize_1.literal)('use_count + 1'),
    }, {
        where: { id: contactId },
        transaction,
    });
};
exports.markContactAsUsed = markContactAsUsed;
/**
 * Toggles contact favorite status
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} contactId - Contact ID
 * @param {boolean} isFavorite - Favorite status
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated contact
 */
const toggleContactFavorite = async (Contact, contactId, isFavorite, transaction) => {
    return await (0, exports.updateContact)(Contact, contactId, { isFavorite }, transaction);
};
exports.toggleContactFavorite = toggleContactFavorite;
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
const createAddressBook = async (AddressBook, addressBookData, transaction) => {
    return await AddressBook.create(addressBookData, { transaction });
};
exports.createAddressBook = createAddressBook;
/**
 * Updates an address book
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {string} addressBookId - Address book ID
 * @param {Partial<AddressBookInfo>} updates - Address book updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated address book
 */
const updateAddressBook = async (AddressBook, addressBookId, updates, transaction) => {
    const addressBook = await AddressBook.findByPk(addressBookId, { transaction });
    if (!addressBook) {
        throw new Error(`Address book not found: ${addressBookId}`);
    }
    await addressBook.update(updates, { transaction });
    return addressBook;
};
exports.updateAddressBook = updateAddressBook;
/**
 * Deletes an address book
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {string} addressBookId - Address book ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if deleted
 */
const deleteAddressBook = async (AddressBook, addressBookId, transaction) => {
    const addressBook = await AddressBook.findByPk(addressBookId, { transaction });
    if (!addressBook) {
        return false;
    }
    await addressBook.destroy({ transaction });
    return true;
};
exports.deleteAddressBook = deleteAddressBook;
/**
 * Gets all address books for a user
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {string} userId - User ID
 * @returns {Promise<any[]>} Array of address books
 */
const getUserAddressBooks = async (AddressBook, userId) => {
    return await AddressBook.findAll({
        where: { userId },
        order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    });
};
exports.getUserAddressBooks = getUserAddressBooks;
/**
 * Gets or creates default address book for user
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {string} userId - User ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Default address book
 */
const getOrCreateDefaultAddressBook = async (AddressBook, userId, transaction) => {
    let addressBook = await AddressBook.findOne({
        where: { userId, isDefault: true },
        transaction,
    });
    if (!addressBook) {
        addressBook = await AddressBook.create({
            userId,
            name: 'My Contacts',
            isDefault: true,
            color: '#3B82F6',
        }, { transaction });
    }
    return addressBook;
};
exports.getOrCreateDefaultAddressBook = getOrCreateDefaultAddressBook;
/**
 * Gets address book with contact count
 *
 * @param {ModelStatic<any>} AddressBook - AddressBook model
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} addressBookId - Address book ID
 * @returns {Promise<any>} Address book with contact count
 */
const getAddressBookWithStats = async (AddressBook, Contact, addressBookId) => {
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
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('contacts.id')), 'contactCount'],
            ],
        },
        group: ['AddressBook.id'],
        subQuery: false,
    });
    return addressBook;
};
exports.getAddressBookWithStats = getAddressBookWithStats;
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
const createDistributionList = async (DistributionList, listData, transaction) => {
    return await DistributionList.create(listData, { transaction });
};
exports.createDistributionList = createDistributionList;
/**
 * Updates a distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} listId - Distribution list ID
 * @param {Partial<DistributionListInfo>} updates - Distribution list updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated distribution list
 */
const updateDistributionList = async (DistributionList, listId, updates, transaction) => {
    const list = await DistributionList.findByPk(listId, { transaction });
    if (!list) {
        throw new Error(`Distribution list not found: ${listId}`);
    }
    await list.update(updates, { transaction });
    return list;
};
exports.updateDistributionList = updateDistributionList;
/**
 * Deletes a distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} listId - Distribution list ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if deleted
 */
const deleteDistributionList = async (DistributionList, listId, transaction) => {
    const list = await DistributionList.findByPk(listId, { transaction });
    if (!list) {
        return false;
    }
    await list.destroy({ transaction });
    return true;
};
exports.deleteDistributionList = deleteDistributionList;
/**
 * Adds members to distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} listId - Distribution list ID
 * @param {DistributionListMember[]} members - Members to add
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated distribution list
 */
const addDistributionListMembers = async (DistributionList, listId, members, transaction) => {
    const list = await DistributionList.findByPk(listId, { transaction });
    if (!list) {
        throw new Error(`Distribution list not found: ${listId}`);
    }
    const existingMembers = list.members || [];
    const updatedMembers = [...existingMembers, ...members];
    await list.update({ members: updatedMembers }, { transaction });
    return list;
};
exports.addDistributionListMembers = addDistributionListMembers;
/**
 * Removes members from distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {string} listId - Distribution list ID
 * @param {string[]} memberIds - Member IDs or emails to remove
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated distribution list
 */
const removeDistributionListMembers = async (DistributionList, listId, memberIds, transaction) => {
    const list = await DistributionList.findByPk(listId, { transaction });
    if (!list) {
        throw new Error(`Distribution list not found: ${listId}`);
    }
    const updatedMembers = (list.members || []).filter((member) => !memberIds.includes(member.contactId || '') && !memberIds.includes(member.email || ''));
    await list.update({ members: updatedMembers }, { transaction });
    return list;
};
exports.removeDistributionListMembers = removeDistributionListMembers;
/**
 * Gets all email addresses from distribution list
 *
 * @param {ModelStatic<any>} DistributionList - DistributionList model
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} listId - Distribution list ID
 * @returns {Promise<string[]>} Array of email addresses
 */
const getDistributionListEmails = async (DistributionList, Contact, listId) => {
    const list = await DistributionList.findByPk(listId);
    if (!list) {
        return [];
    }
    const emails = [];
    for (const member of list.members || []) {
        if (member.type === 'external' && member.email) {
            emails.push(member.email);
        }
        else if (member.type === 'contact' && member.contactId) {
            const contact = await Contact.findByPk(member.contactId);
            if (contact && contact.emailAddresses && contact.emailAddresses.length > 0) {
                const primaryEmail = contact.emailAddresses.find((e) => e.isPrimary);
                emails.push(primaryEmail?.email || contact.emailAddresses[0].email);
            }
        }
    }
    return emails;
};
exports.getDistributionListEmails = getDistributionListEmails;
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
const createContactGroup = async (ContactGroup, groupData, transaction) => {
    return await ContactGroup.create(groupData, { transaction });
};
exports.createContactGroup = createContactGroup;
/**
 * Updates a contact group
 *
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {string} groupId - Contact group ID
 * @param {Partial<ContactGroupInfo>} updates - Contact group updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated contact group
 */
const updateContactGroup = async (ContactGroup, groupId, updates, transaction) => {
    const group = await ContactGroup.findByPk(groupId, { transaction });
    if (!group) {
        throw new Error(`Contact group not found: ${groupId}`);
    }
    await group.update(updates, { transaction });
    return group;
};
exports.updateContactGroup = updateContactGroup;
/**
 * Deletes a contact group
 *
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {string} groupId - Contact group ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if deleted
 */
const deleteContactGroup = async (ContactGroup, groupId, transaction) => {
    const group = await ContactGroup.findByPk(groupId, { transaction });
    if (!group) {
        return false;
    }
    await group.destroy({ transaction });
    return true;
};
exports.deleteContactGroup = deleteContactGroup;
/**
 * Adds contacts to a group
 *
 * @param {ModelStatic<any>} ContactGroupMembership - ContactGroupMembership model
 * @param {string} groupId - Contact group ID
 * @param {string[]} contactIds - Contact IDs to add
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
const addContactsToGroup = async (ContactGroupMembership, groupId, contactIds, transaction) => {
    const memberships = contactIds.map((contactId) => ({
        contactId,
        groupId,
    }));
    await ContactGroupMembership.bulkCreate(memberships, {
        transaction,
        ignoreDuplicates: true,
    });
};
exports.addContactsToGroup = addContactsToGroup;
/**
 * Removes contacts from a group
 *
 * @param {ModelStatic<any>} ContactGroupMembership - ContactGroupMembership model
 * @param {string} groupId - Contact group ID
 * @param {string[]} contactIds - Contact IDs to remove
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of removed memberships
 */
const removeContactsFromGroup = async (ContactGroupMembership, groupId, contactIds, transaction) => {
    return await ContactGroupMembership.destroy({
        where: {
            groupId,
            contactId: { [sequelize_1.Op.in]: contactIds },
        },
        transaction,
    });
};
exports.removeContactsFromGroup = removeContactsFromGroup;
/**
 * Gets all contacts in a group
 *
 * @param {ModelStatic<any>} ContactGroup - ContactGroup model
 * @param {string} groupId - Contact group ID
 * @returns {Promise<any[]>} Array of contacts
 */
const getContactGroupMembers = async (ContactGroup, groupId) => {
    const group = await ContactGroup.findByPk(groupId, {
        include: [{ association: 'contacts', as: 'contacts' }],
    });
    return group?.contacts || [];
};
exports.getContactGroupMembers = getContactGroupMembers;
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
const searchContacts = async (Contact, userId, options) => {
    const where = { userId };
    const having = {};
    // Text search
    if (options.query) {
        where[sequelize_1.Op.or] = [
            { firstName: { [sequelize_1.Op.iLike]: `%${options.query}%` } },
            { lastName: { [sequelize_1.Op.iLike]: `%${options.query}%` } },
            { displayName: { [sequelize_1.Op.iLike]: `%${options.query}%` } },
            { company: { [sequelize_1.Op.iLike]: `%${options.query}%` } },
            { department: { [sequelize_1.Op.iLike]: `%${options.query}%` } },
            (0, sequelize_1.literal)(`email_addresses::text ILIKE '%${options.query}%'`),
        ];
    }
    // Address book filter
    if (options.addressBookIds && options.addressBookIds.length > 0) {
        where.addressBookId = { [sequelize_1.Op.in]: options.addressBookIds };
    }
    // Tags filter
    if (options.tags && options.tags.length > 0) {
        where.tags = { [sequelize_1.Op.overlap]: options.tags };
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
        having[(0, sequelize_1.literal)("jsonb_array_length(email_addresses)")] = { [sequelize_1.Op.gt]: 0 };
    }
    if (options.hasPhone) {
        having[(0, sequelize_1.literal)("jsonb_array_length(phone_numbers)")] = { [sequelize_1.Op.gt]: 0 };
    }
    // Company filter
    if (options.companyFilter) {
        where.company = { [sequelize_1.Op.iLike]: `%${options.companyFilter}%` };
    }
    // Department filter
    if (options.departmentFilter) {
        where.department = { [sequelize_1.Op.iLike]: `%${options.departmentFilter}%` };
    }
    // Exclude IDs
    if (options.excludeIds && options.excludeIds.length > 0) {
        where.id = { [sequelize_1.Op.notIn]: options.excludeIds };
    }
    // Sort options
    const orderMap = {
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
exports.searchContacts = searchContacts;
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
const getContactSuggestions = async (Contact, userId, query, limit = 10) => {
    if (query.length < 2) {
        return [];
    }
    const contacts = await Contact.findAll({
        where: {
            userId,
            [sequelize_1.Op.or]: [
                { firstName: { [sequelize_1.Op.iLike]: `${query}%` } },
                { lastName: { [sequelize_1.Op.iLike]: `${query}%` } },
                { displayName: { [sequelize_1.Op.iLike]: `${query}%` } },
                (0, sequelize_1.literal)(`email_addresses::text ILIKE '%${query}%'`),
            ],
        },
        order: [
            ['isFavorite', 'DESC'],
            ['lastUsedAt', 'DESC'],
            ['lastName', 'ASC'],
        ],
        limit,
    });
    return contacts.map((contact) => {
        const primaryEmail = contact.emailAddresses?.find((e) => e.isPrimary);
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
exports.getContactSuggestions = getContactSuggestions;
/**
 * Gets recently used contacts
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @param {number} limit - Max results (default 10)
 * @returns {Promise<any[]>} Array of recently used contacts
 */
const getRecentlyUsedContacts = async (Contact, userId, limit = 10) => {
    return await Contact.findAll({
        where: {
            userId,
            lastUsedAt: { [sequelize_1.Op.ne]: null },
        },
        order: [['lastUsedAt', 'DESC']],
        limit,
    });
};
exports.getRecentlyUsedContacts = getRecentlyUsedContacts;
/**
 * Gets favorite contacts
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @returns {Promise<any[]>} Array of favorite contacts
 */
const getFavoriteContacts = async (Contact, userId) => {
    return await Contact.findAll({
        where: {
            userId,
            isFavorite: true,
        },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    });
};
exports.getFavoriteContacts = getFavoriteContacts;
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
const contactToVCard = (contact) => {
    const lines = [];
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
        contact.emailAddresses.forEach((email) => {
            const types = [email.type.toUpperCase()];
            if (email.isPrimary)
                types.push('PREF');
            lines.push(`EMAIL;TYPE=${types.join(',')};VALUE=text:${email.email}`);
        });
    }
    // Phone numbers
    if (contact.phoneNumbers && Array.isArray(contact.phoneNumbers)) {
        contact.phoneNumbers.forEach((phone) => {
            const types = [phone.type.toUpperCase()];
            if (phone.isPrimary)
                types.push('PREF');
            const value = phone.extension ? `${phone.number};ext=${phone.extension}` : phone.number;
            lines.push(`TEL;TYPE=${types.join(',')};VALUE=text:${value}`);
        });
    }
    // Addresses
    if (contact.addresses && Array.isArray(contact.addresses)) {
        contact.addresses.forEach((addr) => {
            const types = [addr.type.toUpperCase()];
            if (addr.isPrimary)
                types.push('PREF');
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
        contact.websites.forEach((url) => {
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
exports.contactToVCard = contactToVCard;
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
const parseVCard = (vcardString) => {
    const lines = vcardString.split(/\r?\n/).filter((line) => line.trim());
    const contactData = {
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
                contactData.emailAddresses.push({
                    email: value,
                    type: emailType.includes('work') ? 'work' : emailType.includes('personal') ? 'personal' : 'other',
                    isPrimary: params.some((p) => p.includes('PREF')),
                });
                break;
            case 'TEL':
                const phoneType = params.find((p) => p.startsWith('TYPE='))?.split('=')[1]?.toLowerCase() || 'other';
                const [phoneNumber, ext] = value.split(';ext=');
                contactData.phoneNumbers.push({
                    number: phoneNumber,
                    type: phoneType.includes('mobile') ? 'mobile' : phoneType.includes('work') ? 'work' : phoneType.includes('home') ? 'home' : 'other',
                    isPrimary: params.some((p) => p.includes('PREF')),
                    extension: ext,
                });
                break;
            case 'ADR':
                const adrType = params.find((p) => p.startsWith('TYPE='))?.split('=')[1]?.toLowerCase() || 'other';
                const [, street2, street, city, state, postalCode, country] = value.split(';');
                contactData.addresses.push({
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
                contactData.websites.push(value);
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
exports.parseVCard = parseVCard;
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
const importContactsFromVCard = async (Contact, userId, vcardContent, options = {}, transaction) => {
    const vcards = vcardContent.split('END:VCARD').filter((v) => v.trim());
    let imported = 0;
    let skipped = 0;
    let updated = 0;
    for (const vcardString of vcards) {
        if (!vcardString.includes('BEGIN:VCARD'))
            continue;
        const contactData = (0, exports.parseVCard)(vcardString + '\nEND:VCARD');
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
                    [sequelize_1.Op.or]: [(0, sequelize_1.literal)(`email_addresses::text ILIKE '%${email}%'`)],
                },
                transaction,
            });
        }
        else if (options.matchBy === 'externalId' && contactData.externalId) {
            existingContact = await Contact.findOne({
                where: { userId, externalId: contactData.externalId },
                transaction,
            });
        }
        if (existingContact) {
            if (options.mergeStrategy === 'skip') {
                skipped++;
            }
            else if (options.mergeStrategy === 'update') {
                await existingContact.update(contactData, { transaction });
                updated++;
            }
            else {
                // duplicate
                await Contact.create(contactData, { transaction });
                imported++;
            }
        }
        else {
            await Contact.create(contactData, { transaction });
            imported++;
        }
    }
    return { imported, skipped, updated };
};
exports.importContactsFromVCard = importContactsFromVCard;
/**
 * Exports contacts to vCard format
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string[]} contactIds - Contact IDs to export
 * @returns {Promise<string>} vCard content
 */
const exportContactsToVCard = async (Contact, contactIds) => {
    const contacts = await Contact.findAll({
        where: { id: { [sequelize_1.Op.in]: contactIds } },
    });
    return contacts.map((contact) => (0, exports.contactToVCard)(contact)).join('\r\n\r\n');
};
exports.exportContactsToVCard = exportContactsToVCard;
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
const shareContact = async (ContactSharing, sharingData, transaction) => {
    return await ContactSharing.create(sharingData, { transaction });
};
exports.shareContact = shareContact;
/**
 * Removes contact sharing
 *
 * @param {ModelStatic<any>} ContactSharing - ContactSharing model
 * @param {string} sharingId - Sharing entry ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if removed
 */
const unshareContact = async (ContactSharing, sharingId, transaction) => {
    const result = await ContactSharing.destroy({
        where: { id: sharingId },
        transaction,
    });
    return result > 0;
};
exports.unshareContact = unshareContact;
/**
 * Gets all shared contacts for a user
 *
 * @param {ModelStatic<any>} ContactSharing - ContactSharing model
 * @param {string} userId - User ID
 * @returns {Promise<any[]>} Array of shared contacts
 */
const getSharedContacts = async (ContactSharing, userId) => {
    return await ContactSharing.findAll({
        where: {
            sharedWithUserId: userId,
            [sequelize_1.Op.or]: [
                { expiresAt: null },
                { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
            ],
        },
        include: [{ association: 'contact', as: 'contact' }],
    });
};
exports.getSharedContacts = getSharedContacts;
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
const hasContactPermission = async (Contact, ContactSharing, contactId, userId, requiredPermission = 'view') => {
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
            [sequelize_1.Op.or]: [
                { expiresAt: null },
                { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
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
exports.hasContactPermission = hasContactPermission;
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
const mergeContacts = async (Contact, config, transaction) => {
    const primaryContact = await Contact.findByPk(config.primaryContactId, { transaction });
    if (!primaryContact) {
        throw new Error(`Primary contact not found: ${config.primaryContactId}`);
    }
    const mergeContacts = await Contact.findAll({
        where: { id: { [sequelize_1.Op.in]: config.mergeContactIds } },
        transaction,
    });
    const mergedData = { ...primaryContact.toJSON() };
    // Merge email addresses
    const allEmails = new Set();
    primaryContact.emailAddresses.forEach((e) => allEmails.add(e.email));
    if (config.keepBothEmails) {
        mergeContacts.forEach((contact) => {
            contact.emailAddresses.forEach((e) => {
                if (!allEmails.has(e.email)) {
                    mergedData.emailAddresses.push(e);
                    allEmails.add(e.email);
                }
            });
        });
    }
    // Merge phone numbers
    const allPhones = new Set();
    primaryContact.phoneNumbers.forEach((p) => allPhones.add(p.number));
    if (config.keepBothPhones) {
        mergeContacts.forEach((contact) => {
            contact.phoneNumbers.forEach((p) => {
                if (!allPhones.has(p.number)) {
                    mergedData.phoneNumbers.push(p);
                    allPhones.add(p.number);
                }
            });
        });
    }
    // Merge addresses
    if (config.keepBothAddresses) {
        mergeContacts.forEach((contact) => {
            mergedData.addresses.push(...contact.addresses);
        });
    }
    // Merge tags
    const allTags = new Set([...(primaryContact.tags || [])]);
    mergeContacts.forEach((contact) => {
        (contact.tags || []).forEach((tag) => allTags.add(tag));
    });
    mergedData.tags = Array.from(allTags);
    // Update primary contact
    await primaryContact.update(mergedData, { transaction });
    // Delete merged contacts
    await Contact.destroy({
        where: { id: { [sequelize_1.Op.in]: config.mergeContactIds } },
        transaction,
    });
    return primaryContact;
};
exports.mergeContacts = mergeContacts;
/**
 * Finds duplicate contacts
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} userId - User ID
 * @returns {Promise<any[][]>} Array of duplicate contact groups
 */
const findDuplicateContacts = async (Contact, userId) => {
    // Find duplicates by email
    const emailDuplicates = await Contact.sequelize.query(`
    SELECT c1.id, c2.id as duplicate_id
    FROM mail_contacts c1
    INNER JOIN mail_contacts c2 ON c1.email_addresses && c2.email_addresses
    WHERE c1.user_id = :userId
      AND c2.user_id = :userId
      AND c1.id < c2.id
      AND c1.deleted_at IS NULL
      AND c2.deleted_at IS NULL
  `, {
        replacements: { userId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Find duplicates by name
    const nameDuplicates = await Contact.sequelize.query(`
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
  `, {
        replacements: { userId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Group duplicates
    const duplicateGroups = new Map();
    [...emailDuplicates, ...nameDuplicates].forEach((dup) => {
        const key = dup.id;
        if (!duplicateGroups.has(key)) {
            duplicateGroups.set(key, new Set([key]));
        }
        duplicateGroups.get(key).add(dup.duplicate_id);
    });
    // Convert to array of arrays
    const result = [];
    const processed = new Set();
    for (const [id, duplicates] of duplicateGroups) {
        if (processed.has(id))
            continue;
        const group = Array.from(duplicates);
        result.push(await Contact.findAll({
            where: { id: { [sequelize_1.Op.in]: group } },
        }));
        group.forEach((gid) => processed.add(gid));
    }
    return result;
};
exports.findDuplicateContacts = findDuplicateContacts;
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
const syncContactsFromGAL = async (Contact, userId, galEntries, transaction) => {
    let created = 0;
    let updated = 0;
    let deleted = 0;
    const externalIds = galEntries.map((entry) => entry.externalId);
    // Find existing GAL contacts
    const existingContacts = await Contact.findAll({
        where: {
            userId,
            source: { [sequelize_1.Op.in]: ['gal', 'ldap', 'exchange'] },
        },
        transaction,
    });
    // Update or create contacts
    for (const entry of galEntries) {
        const contactData = {
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
        const existing = existingContacts.find((c) => c.externalId === entry.externalId);
        if (existing) {
            await existing.update(contactData, { transaction });
            updated++;
        }
        else {
            await Contact.create(contactData, { transaction });
            created++;
        }
    }
    // Delete contacts no longer in GAL
    const toDelete = existingContacts.filter((c) => !externalIds.includes(c.externalId));
    for (const contact of toDelete) {
        await contact.destroy({ transaction });
        deleted++;
    }
    return { created, updated, deleted };
};
exports.syncContactsFromGAL = syncContactsFromGAL;
/**
 * Searches Global Address List
 *
 * @param {ModelStatic<any>} Contact - Contact model
 * @param {string} query - Search query
 * @param {number} limit - Max results
 * @returns {Promise<GALEntry[]>} GAL search results
 */
const searchGAL = async (Contact, query, limit = 20) => {
    const contacts = await Contact.findAll({
        where: {
            source: { [sequelize_1.Op.in]: ['gal', 'ldap', 'exchange'] },
            [sequelize_1.Op.or]: [
                { firstName: { [sequelize_1.Op.iLike]: `%${query}%` } },
                { lastName: { [sequelize_1.Op.iLike]: `%${query}%` } },
                { displayName: { [sequelize_1.Op.iLike]: `%${query}%` } },
                { company: { [sequelize_1.Op.iLike]: `%${query}%` } },
                { department: { [sequelize_1.Op.iLike]: `%${query}%` } },
                (0, sequelize_1.literal)(`email_addresses::text ILIKE '%${query}%'`),
            ],
        },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']],
        limit,
    });
    return contacts.map((contact) => ({
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
exports.searchGAL = searchGAL;
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
const recordContactAudit = async (ContactAudit, auditData, transaction) => {
    return await ContactAudit.create(auditData, { transaction });
};
exports.recordContactAudit = recordContactAudit;
/**
 * Gets contact audit history
 *
 * @param {ModelStatic<any>} ContactAudit - ContactAudit model
 * @param {string} contactId - Contact ID
 * @param {number} limit - Max entries (default 50)
 * @returns {Promise<any[]>} Audit history
 */
const getContactAuditHistory = async (ContactAudit, contactId, limit = 50) => {
    return await ContactAudit.findAll({
        where: { contactId },
        order: [['timestamp', 'DESC']],
        limit,
    });
};
exports.getContactAuditHistory = getContactAuditHistory;
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
const getContactStatistics = async (Contact, ContactGroup, DistributionList, userId) => {
    const totalContacts = await Contact.count({ where: { userId } });
    const favoriteCount = await Contact.count({ where: { userId, isFavorite: true } });
    const withEmailCount = await Contact.count({
        where: {
            userId,
            [sequelize_1.Op.and]: [(0, sequelize_1.literal)("jsonb_array_length(email_addresses) > 0")],
        },
    });
    const withPhoneCount = await Contact.count({
        where: {
            userId,
            [sequelize_1.Op.and]: [(0, sequelize_1.literal)("jsonb_array_length(phone_numbers) > 0")],
        },
    });
    const groupCount = await ContactGroup.count({ where: { userId } });
    const distributionListCount = await DistributionList.count({ where: { userId } });
    const recentlyAddedCount = await Contact.count({
        where: {
            userId,
            createdAt: { [sequelize_1.Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
    });
    // Count by source
    const sourceStats = await Contact.findAll({
        where: { userId },
        attributes: ['source', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
        group: ['source'],
        raw: true,
    });
    const contactsBySource = {};
    sourceStats.forEach((stat) => {
        contactsBySource[stat.source] = parseInt(stat.count, 10);
    });
    // Count by address book
    const addressBookStats = await Contact.findAll({
        where: { userId },
        attributes: ['addressBookId', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
        group: ['addressBookId'],
        raw: true,
    });
    const contactsByAddressBook = {};
    addressBookStats.forEach((stat) => {
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
exports.getContactStatistics = getContactStatistics;
// ============================================================================
// SWAGGER/OPENAPI DOCUMENTATION HELPERS
// ============================================================================
/**
 * Generates Swagger schema for Contact model
 *
 * @returns {Object} Swagger schema object
 */
const getContactSwaggerSchema = () => ({
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
exports.getContactSwaggerSchema = getContactSwaggerSchema;
/**
 * Generates Swagger schema for AddressBook model
 *
 * @returns {Object} Swagger schema object
 */
const getAddressBookSwaggerSchema = () => ({
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
exports.getAddressBookSwaggerSchema = getAddressBookSwaggerSchema;
/**
 * Generates Swagger schema for DistributionList model
 *
 * @returns {Object} Swagger schema object
 */
const getDistributionListSwaggerSchema = () => ({
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
exports.getDistributionListSwaggerSchema = getDistributionListSwaggerSchema;
/**
 * Generates complete Swagger/OpenAPI paths for contact endpoints
 *
 * @returns {Object} Swagger paths object
 */
const getContactSwaggerPaths = () => ({
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
exports.getContactSwaggerPaths = getContactSwaggerPaths;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Model definitions
    getContactModelAttributes: exports.getContactModelAttributes,
    getAddressBookModelAttributes: exports.getAddressBookModelAttributes,
    getDistributionListModelAttributes: exports.getDistributionListModelAttributes,
    getContactGroupModelAttributes: exports.getContactGroupModelAttributes,
    getContactGroupMembershipAttributes: exports.getContactGroupMembershipAttributes,
    getContactSharingAttributes: exports.getContactSharingAttributes,
    getContactAuditAttributes: exports.getContactAuditAttributes,
    // Model initialization
    initContactModel: exports.initContactModel,
    initAddressBookModel: exports.initAddressBookModel,
    initDistributionListModel: exports.initDistributionListModel,
    initContactGroupModel: exports.initContactGroupModel,
    initContactGroupMembershipModel: exports.initContactGroupMembershipModel,
    initContactSharingModel: exports.initContactSharingModel,
    initContactAuditModel: exports.initContactAuditModel,
    setupContactAssociations: exports.setupContactAssociations,
    // Contact CRUD
    createContact: exports.createContact,
    updateContact: exports.updateContact,
    deleteContact: exports.deleteContact,
    getContactById: exports.getContactById,
    getUserContacts: exports.getUserContacts,
    markContactAsUsed: exports.markContactAsUsed,
    toggleContactFavorite: exports.toggleContactFavorite,
    // Address book management
    createAddressBook: exports.createAddressBook,
    updateAddressBook: exports.updateAddressBook,
    deleteAddressBook: exports.deleteAddressBook,
    getUserAddressBooks: exports.getUserAddressBooks,
    getOrCreateDefaultAddressBook: exports.getOrCreateDefaultAddressBook,
    getAddressBookWithStats: exports.getAddressBookWithStats,
    // Distribution list management
    createDistributionList: exports.createDistributionList,
    updateDistributionList: exports.updateDistributionList,
    deleteDistributionList: exports.deleteDistributionList,
    addDistributionListMembers: exports.addDistributionListMembers,
    removeDistributionListMembers: exports.removeDistributionListMembers,
    getDistributionListEmails: exports.getDistributionListEmails,
    // Contact group management
    createContactGroup: exports.createContactGroup,
    updateContactGroup: exports.updateContactGroup,
    deleteContactGroup: exports.deleteContactGroup,
    addContactsToGroup: exports.addContactsToGroup,
    removeContactsFromGroup: exports.removeContactsFromGroup,
    getContactGroupMembers: exports.getContactGroupMembers,
    // Contact search and filtering
    searchContacts: exports.searchContacts,
    getContactSuggestions: exports.getContactSuggestions,
    getRecentlyUsedContacts: exports.getRecentlyUsedContacts,
    getFavoriteContacts: exports.getFavoriteContacts,
    // vCard import/export
    contactToVCard: exports.contactToVCard,
    parseVCard: exports.parseVCard,
    importContactsFromVCard: exports.importContactsFromVCard,
    exportContactsToVCard: exports.exportContactsToVCard,
    // Contact sharing
    shareContact: exports.shareContact,
    unshareContact: exports.unshareContact,
    getSharedContacts: exports.getSharedContacts,
    hasContactPermission: exports.hasContactPermission,
    // Contact merging
    mergeContacts: exports.mergeContacts,
    findDuplicateContacts: exports.findDuplicateContacts,
    // GAL integration
    syncContactsFromGAL: exports.syncContactsFromGAL,
    searchGAL: exports.searchGAL,
    // Audit and history
    recordContactAudit: exports.recordContactAudit,
    getContactAuditHistory: exports.getContactAuditHistory,
    // Statistics
    getContactStatistics: exports.getContactStatistics,
    // Swagger documentation
    getContactSwaggerSchema: exports.getContactSwaggerSchema,
    getAddressBookSwaggerSchema: exports.getAddressBookSwaggerSchema,
    getDistributionListSwaggerSchema: exports.getDistributionListSwaggerSchema,
    getContactSwaggerPaths: exports.getContactSwaggerPaths,
};
//# sourceMappingURL=mail-contacts-addressbook-kit.js.map