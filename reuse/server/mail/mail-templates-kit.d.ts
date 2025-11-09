/**
 * LOC: MAILTMPL1234567
 * File: /reuse/server/mail/mail-templates-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS mail services
 *   - Template controllers
 *   - Mail composition services
 *   - Notification services
 *   - User preference services
 *   - Sequelize models
 */
interface MailTemplate {
    id: string;
    userId?: string;
    organizationId?: string;
    name: string;
    displayName: string;
    description?: string;
    category: TemplateCategory;
    type: 'system' | 'user' | 'organization' | 'shared';
    subject: string;
    bodyHtml?: string;
    bodyText?: string;
    bodyMjml?: string;
    variables: TemplateVariable[];
    placeholders: string[];
    isActive: boolean;
    isDefault: boolean;
    version: number;
    language: string;
    locale: string;
    tags?: string[];
    metadata?: Record<string, any>;
    accessControl?: TemplateAccessControl;
    usageCount: number;
    lastUsedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
interface TemplateVariable {
    name: string;
    displayName: string;
    description?: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
    required: boolean;
    defaultValue?: any;
    validationRules?: ValidationRule[];
    example?: any;
}
interface ValidationRule {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'custom';
    value?: any;
    message?: string;
}
interface TemplateAccessControl {
    visibility: 'private' | 'organization' | 'public';
    allowedRoles?: string[];
    allowedUsers?: string[];
    allowedDepartments?: string[];
    permissions: {
        canView: boolean;
        canEdit: boolean;
        canDelete: boolean;
        canShare: boolean;
        canVersion: boolean;
    };
}
type TemplateCategory = 'welcome' | 'password-reset' | 'notification' | 'alert' | 'reminder' | 'appointment' | 'patient-communication' | 'staff-communication' | 'compliance' | 'marketing' | 'billing' | 'custom' | 'quick-reply';
interface TemplateLocalization {
    id: string;
    templateId: string;
    language: string;
    locale: string;
    subject: string;
    bodyHtml?: string;
    bodyText?: string;
    bodyMjml?: string;
    variables: Record<string, any>;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
interface TemplateRenderContext {
    variables: Record<string, any>;
    helpers?: Record<string, Function>;
    partials?: Record<string, string>;
    locale?: string;
    timezone?: string;
}
interface TemplatePreview {
    subject: string;
    bodyHtml: string;
    bodyText: string;
    renderedAt: Date;
    variables: Record<string, any>;
    metadata?: Record<string, any>;
}
interface TemplateCreateDto {
    userId?: string;
    organizationId?: string;
    name: string;
    displayName: string;
    description?: string;
    category: TemplateCategory;
    type: 'system' | 'user' | 'organization' | 'shared';
    subject: string;
    bodyHtml?: string;
    bodyText?: string;
    bodyMjml?: string;
    variables?: TemplateVariable[];
    language?: string;
    locale?: string;
    tags?: string[];
    accessControl?: TemplateAccessControl;
}
interface TemplateUpdateDto {
    displayName?: string;
    description?: string;
    category?: TemplateCategory;
    subject?: string;
    bodyHtml?: string;
    bodyText?: string;
    bodyMjml?: string;
    variables?: TemplateVariable[];
    tags?: string[];
    isActive?: boolean;
    isDefault?: boolean;
    accessControl?: TemplateAccessControl;
}
interface TemplateSearchQuery {
    userId?: string;
    organizationId?: string;
    category?: TemplateCategory;
    type?: 'system' | 'user' | 'organization' | 'shared';
    searchTerm?: string;
    tags?: string[];
    language?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsedAt';
    sortOrder?: 'asc' | 'desc';
}
interface SystemTemplate {
    category: TemplateCategory;
    name: string;
    subject: string;
    bodyHtml: string;
    bodyText: string;
    variables: TemplateVariable[];
    description: string;
}
/**
 * Sequelize MailTemplate model attributes for mail_templates table.
 *
 * @example
 * ```typescript
 * class MailTemplate extends Model {}
 * MailTemplate.init(getMailTemplateModelAttributes(), {
 *   sequelize,
 *   tableName: 'mail_templates',
 *   timestamps: true
 * });
 * ```
 */
export declare const getMailTemplateModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        comment: string;
    };
    organizationId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        comment: string;
    };
    name: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    displayName: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    category: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    type: {
        type: string;
        values: string[];
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    subject: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    bodyHtml: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    bodyText: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    bodyMjml: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    variables: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    placeholders: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    isActive: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    isDefault: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    version: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    language: {
        type: string;
        defaultValue: string;
        comment: string;
    };
    locale: {
        type: string;
        defaultValue: string;
        comment: string;
    };
    tags: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    metadata: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    accessControl: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    usageCount: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    lastUsedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    createdBy: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    updatedBy: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize TemplateVersion model attributes for template_versions table.
 *
 * @example
 * ```typescript
 * class TemplateVersion extends Model {}
 * TemplateVersion.init(getTemplateVersionModelAttributes(), {
 *   sequelize,
 *   tableName: 'template_versions',
 *   timestamps: true
 * });
 * ```
 */
export declare const getTemplateVersionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    templateId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    version: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    subject: {
        type: string;
        allowNull: boolean;
    };
    bodyHtml: {
        type: string;
        allowNull: boolean;
    };
    bodyText: {
        type: string;
        allowNull: boolean;
    };
    bodyMjml: {
        type: string;
        allowNull: boolean;
    };
    variables: {
        type: string;
        defaultValue: never[];
    };
    changeLog: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    changedBy: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize TemplateLocalization model attributes for template_localizations table.
 *
 * @example
 * ```typescript
 * class TemplateLocalization extends Model {}
 * TemplateLocalization.init(getTemplateLocalizationModelAttributes(), {
 *   sequelize,
 *   tableName: 'template_localizations',
 *   timestamps: true
 * });
 * ```
 */
export declare const getTemplateLocalizationModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    templateId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    language: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    locale: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    subject: {
        type: string;
        allowNull: boolean;
    };
    bodyHtml: {
        type: string;
        allowNull: boolean;
    };
    bodyText: {
        type: string;
        allowNull: boolean;
    };
    bodyMjml: {
        type: string;
        allowNull: boolean;
    };
    variables: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    isDefault: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize QuickReply model attributes for quick_replies table.
 *
 * @example
 * ```typescript
 * class QuickReply extends Model {}
 * QuickReply.init(getQuickReplyModelAttributes(), {
 *   sequelize,
 *   tableName: 'quick_replies',
 *   timestamps: true
 * });
 * ```
 */
export declare const getQuickReplyModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    organizationId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    name: {
        type: string;
        allowNull: boolean;
    };
    shortcut: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    content: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    contentHtml: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    category: {
        type: string;
        allowNull: boolean;
    };
    isActive: {
        type: string;
        defaultValue: boolean;
    };
    usageCount: {
        type: string;
        defaultValue: number;
    };
    lastUsedAt: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize CannedResponse model attributes for canned_responses table.
 *
 * @example
 * ```typescript
 * class CannedResponse extends Model {}
 * CannedResponse.init(getCannedResponseModelAttributes(), {
 *   sequelize,
 *   tableName: 'canned_responses',
 *   timestamps: true
 * });
 * ```
 */
export declare const getCannedResponseModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    organizationId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    name: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    subject: {
        type: string;
        allowNull: boolean;
    };
    body: {
        type: string;
        allowNull: boolean;
    };
    bodyHtml: {
        type: string;
        allowNull: boolean;
    };
    category: {
        type: string;
        allowNull: boolean;
    };
    tags: {
        type: string;
        defaultValue: never[];
    };
    variables: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    isShared: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    usageCount: {
        type: string;
        defaultValue: number;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Creates a new mail template with validation.
 *
 * @param {TemplateCreateDto} data - Template data
 * @returns {Record<string, any>} Sequelize create object
 *
 * @example
 * ```typescript
 * const template = createMailTemplate({
 *   name: 'welcome-patient',
 *   displayName: 'Welcome Patient Email',
 *   category: 'welcome',
 *   type: 'system',
 *   subject: 'Welcome to {{organizationName}}',
 *   bodyHtml: '<h1>Welcome {{patientName}}!</h1>',
 *   variables: [
 *     { name: 'organizationName', type: 'string', required: true },
 *     { name: 'patientName', type: 'string', required: true }
 *   ]
 * });
 * ```
 */
export declare const createMailTemplate: (data: TemplateCreateDto) => Record<string, any>;
/**
 * Retrieves a mail template by ID with access control validation.
 *
 * @param {string} templateId - Template ID
 * @param {string} userId - User ID for access control
 * @returns {Record<string, any>} Sequelize query object
 *
 * @example
 * ```typescript
 * const template = await getMailTemplateById('tmpl-123', 'user-123');
 * if (template) {
 *   console.log('Template:', template.displayName);
 * }
 * ```
 */
export declare const getMailTemplateById: (templateId: string, userId?: string) => Record<string, any>;
/**
 * Updates an existing mail template with versioning.
 *
 * @param {string} templateId - Template ID
 * @param {string} userId - User ID for authorization
 * @param {TemplateUpdateDto} updates - Updates to apply
 * @returns {Record<string, any>} Update query object
 *
 * @example
 * ```typescript
 * const updated = updateMailTemplate('tmpl-123', 'user-123', {
 *   subject: 'Updated subject with {{variable}}',
 *   bodyHtml: '<p>Updated content</p>',
 *   tags: ['updated', 'v2']
 * });
 * ```
 */
export declare const updateMailTemplate: (templateId: string, userId: string, updates: TemplateUpdateDto) => Record<string, any>;
/**
 * Deletes a mail template (soft delete for user templates).
 *
 * @param {string} templateId - Template ID
 * @param {string} userId - User ID for authorization
 * @param {boolean} permanent - Whether to permanently delete
 * @returns {Record<string, any>} Delete query object
 *
 * @example
 * ```typescript
 * await deleteMailTemplate('tmpl-123', 'user-123', false);
 * ```
 */
export declare const deleteMailTemplate: (templateId: string, userId: string, permanent?: boolean) => Record<string, any>;
/**
 * Searches templates with advanced filtering.
 *
 * @param {TemplateSearchQuery} query - Search parameters
 * @returns {Record<string, any>} Sequelize query object
 *
 * @example
 * ```typescript
 * const templates = searchMailTemplates({
 *   userId: 'user-123',
 *   category: 'welcome',
 *   searchTerm: 'patient',
 *   isActive: true,
 *   limit: 20
 * });
 * ```
 */
export declare const searchMailTemplates: (query: TemplateSearchQuery) => Record<string, any>;
/**
 * Renders a template with variable substitution using Handlebars.
 *
 * @param {MailTemplate} template - Template to render
 * @param {TemplateRenderContext} context - Rendering context with variables
 * @returns {TemplatePreview} Rendered template preview
 *
 * @example
 * ```typescript
 * const rendered = renderTemplate(template, {
 *   variables: {
 *     patientName: 'John Doe',
 *     appointmentDate: new Date(),
 *     organizationName: 'White Cross Healthcare'
 *   },
 *   locale: 'en-US',
 *   timezone: 'America/New_York'
 * });
 * console.log('Subject:', rendered.subject);
 * ```
 */
export declare const renderTemplate: (template: MailTemplate, context: TemplateRenderContext) => TemplatePreview;
/**
 * Renders a template with MJML for responsive email design.
 *
 * @param {string} mjml - MJML markup
 * @param {Record<string, any>} variables - Template variables
 * @returns {string} Rendered HTML
 *
 * @example
 * ```typescript
 * const html = renderMjmlTemplate('<mjml>...</mjml>', { name: 'John' });
 * ```
 */
export declare const renderMjmlTemplate: (mjml: string, variables: Record<string, any>) => string;
/**
 * Renders a Handlebars template string with variables.
 *
 * @param {string} template - Template string
 * @param {Record<string, any>} variables - Variables to substitute
 * @param {Record<string, Function>} helpers - Handlebars helpers
 * @returns {string} Rendered string
 *
 * @example
 * ```typescript
 * const output = renderHandlebarsTemplate(
 *   'Hello {{name}}, your appointment is on {{formatDate date}}',
 *   { name: 'John', date: new Date() },
 *   { formatDate: (date) => date.toLocaleDateString() }
 * );
 * ```
 */
export declare const renderHandlebarsTemplate: (template: string, variables: Record<string, any>, helpers?: Record<string, Function>) => string;
/**
 * Extracts placeholder names from template content.
 *
 * @param {string} content - Template content
 * @returns {string[]} Array of placeholder names
 *
 * @example
 * ```typescript
 * const placeholders = extractPlaceholders(
 *   'Hello {{firstName}} {{lastName}}, your {{itemName}} is ready'
 * );
 * // Returns: ['firstName', 'lastName', 'itemName']
 * ```
 */
export declare const extractPlaceholders: (content: string) => string[];
/**
 * Validates template variables against schema.
 *
 * @param {TemplateVariable[]} schema - Variable schema
 * @param {Record<string, any>} variables - Variables to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTemplateVariables(template.variables, {
 *   patientName: 'John Doe',
 *   age: 35
 * });
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateTemplateVariables: (schema: TemplateVariable[], variables: Record<string, any>) => {
    valid: boolean;
    errors: string[];
};
/**
 * Generates a template preview with sample data.
 *
 * @param {MailTemplate} template - Template to preview
 * @returns {TemplatePreview} Preview with sample data
 *
 * @example
 * ```typescript
 * const preview = generateTemplatePreview(template);
 * console.log('Preview subject:', preview.subject);
 * ```
 */
export declare const generateTemplatePreview: (template: MailTemplate) => TemplatePreview;
/**
 * Gets predefined system template by category.
 *
 * @param {TemplateCategory} category - Template category
 * @param {string} language - Language code
 * @returns {SystemTemplate} System template definition
 *
 * @example
 * ```typescript
 * const welcomeTemplate = getSystemTemplate('welcome', 'en');
 * console.log(welcomeTemplate.subject);
 * ```
 */
export declare const getSystemTemplate: (category: TemplateCategory, language?: string) => SystemTemplate;
/**
 * Creates all system templates for an organization.
 *
 * @param {string} organizationId - Organization ID
 * @param {string} language - Language code
 * @returns {MailTemplate[]} Array of system templates
 *
 * @example
 * ```typescript
 * const systemTemplates = createSystemTemplates('org-123', 'en');
 * // Creates welcome, password-reset, notification, etc.
 * ```
 */
export declare const createSystemTemplates: (organizationId: string, language?: string) => MailTemplate[];
/**
 * Creates a new version of a template.
 *
 * @param {string} templateId - Template ID
 * @param {string} userId - User making the change
 * @param {string} changeLog - Description of changes
 * @returns {Record<string, any>} Version create object
 *
 * @example
 * ```typescript
 * await createTemplateVersion('tmpl-123', 'user-123', 'Updated subject line and variables');
 * ```
 */
export declare const createTemplateVersion: (templateId: string, userId: string, changeLog?: string) => Record<string, any>;
/**
 * Gets version history for a template.
 *
 * @param {string} templateId - Template ID
 * @param {number} limit - Maximum versions to return
 * @returns {Record<string, any>} Query object
 *
 * @example
 * ```typescript
 * const versions = await getTemplateVersionHistory('tmpl-123', 10);
 * ```
 */
export declare const getTemplateVersionHistory: (templateId: string, limit?: number) => Record<string, any>;
/**
 * Restores a template to a specific version.
 *
 * @param {string} templateId - Template ID
 * @param {number} version - Version to restore
 * @param {string} userId - User performing restore
 * @returns {Record<string, any>} Update object
 *
 * @example
 * ```typescript
 * await restoreTemplateVersion('tmpl-123', 3, 'user-123');
 * ```
 */
export declare const restoreTemplateVersion: (templateId: string, version: number, userId: string) => Record<string, any>;
/**
 * Compares two template versions.
 *
 * @param {string} templateId - Template ID
 * @param {number} version1 - First version number
 * @param {number} version2 - Second version number
 * @returns {Record<string, any>} Comparison query
 *
 * @example
 * ```typescript
 * const diff = await compareTemplateVersions('tmpl-123', 1, 3);
 * ```
 */
export declare const compareTemplateVersions: (templateId: string, version1: number, version2: number) => Record<string, any>;
/**
 * Creates a localized version of a template.
 *
 * @param {string} templateId - Template ID
 * @param {string} language - Language code
 * @param {string} locale - Locale identifier
 * @param {object} content - Localized content
 * @returns {Record<string, any>} Create object
 *
 * @example
 * ```typescript
 * await createTemplateLocalization('tmpl-123', 'es', 'es-MX', {
 *   subject: 'Bienvenido a {{organizationName}}',
 *   bodyHtml: '<h1>¡Bienvenido!</h1>',
 *   bodyText: '¡Bienvenido!'
 * });
 * ```
 */
export declare const createTemplateLocalization: (templateId: string, language: string, locale: string, content: {
    subject: string;
    bodyHtml?: string;
    bodyText?: string;
    bodyMjml?: string;
}) => Record<string, any>;
/**
 * Gets localized template by language/locale.
 *
 * @param {string} templateId - Template ID
 * @param {string} language - Language code
 * @param {string} locale - Locale identifier
 * @returns {Record<string, any>} Query object
 *
 * @example
 * ```typescript
 * const localized = await getTemplateLocalization('tmpl-123', 'es', 'es-MX');
 * ```
 */
export declare const getTemplateLocalization: (templateId: string, language: string, locale?: string) => Record<string, any>;
/**
 * Lists all localizations for a template.
 *
 * @param {string} templateId - Template ID
 * @returns {Record<string, any>} Query object
 *
 * @example
 * ```typescript
 * const localizations = await listTemplateLocalizations('tmpl-123');
 * ```
 */
export declare const listTemplateLocalizations: (templateId: string) => Record<string, any>;
/**
 * Updates a template localization.
 *
 * @param {string} localizationId - Localization ID
 * @param {object} updates - Updates to apply
 * @returns {Record<string, any>} Update object
 *
 * @example
 * ```typescript
 * await updateTemplateLocalization('loc-123', {
 *   subject: 'Updated subject',
 *   bodyHtml: '<p>Updated content</p>'
 * });
 * ```
 */
export declare const updateTemplateLocalization: (localizationId: string, updates: Partial<TemplateLocalization>) => Record<string, any>;
/**
 * Checks if user has permission to access template.
 *
 * @param {MailTemplate} template - Template to check
 * @param {string} userId - User ID
 * @param {string} permission - Permission to check
 * @returns {boolean} Whether user has permission
 *
 * @example
 * ```typescript
 * if (checkTemplatePermission(template, 'user-123', 'canEdit')) {
 *   // User can edit
 * }
 * ```
 */
export declare const checkTemplatePermission: (template: MailTemplate, userId: string, permission: keyof TemplateAccessControl["permissions"]) => boolean;
/**
 * Updates template access control settings.
 *
 * @param {string} templateId - Template ID
 * @param {string} userId - User ID (owner)
 * @param {TemplateAccessControl} accessControl - New access control
 * @returns {Record<string, any>} Update object
 *
 * @example
 * ```typescript
 * await updateTemplateAccessControl('tmpl-123', 'user-123', {
 *   visibility: 'organization',
 *   allowedRoles: ['doctor', 'nurse'],
 *   permissions: { canView: true, canEdit: false, canDelete: false }
 * });
 * ```
 */
export declare const updateTemplateAccessControl: (templateId: string, userId: string, accessControl: TemplateAccessControl) => Record<string, any>;
/**
 * Shares template with specific users or roles.
 *
 * @param {string} templateId - Template ID
 * @param {string} userId - Owner user ID
 * @param {object} shareWith - Users/roles to share with
 * @returns {Record<string, any>} Update object
 *
 * @example
 * ```typescript
 * await shareTemplate('tmpl-123', 'user-123', {
 *   users: ['user-456', 'user-789'],
 *   roles: ['doctor'],
 *   departments: ['cardiology']
 * });
 * ```
 */
export declare const shareTemplate: (templateId: string, userId: string, shareWith: {
    users?: string[];
    roles?: string[];
    departments?: string[];
}) => Record<string, any>;
/**
 * Creates a quick reply for fast insertion.
 *
 * @param {string} userId - User ID
 * @param {object} data - Quick reply data
 * @returns {Record<string, any>} Create object
 *
 * @example
 * ```typescript
 * await createQuickReply('user-123', {
 *   name: 'Thank you',
 *   shortcut: '/thanks',
 *   content: 'Thank you for your message. I will get back to you soon.',
 *   category: 'common'
 * });
 * ```
 */
export declare const createQuickReply: (userId: string, data: {
    name: string;
    shortcut?: string;
    content: string;
    contentHtml?: string;
    category?: string;
}) => Record<string, any>;
/**
 * Lists quick replies for a user.
 *
 * @param {string} userId - User ID
 * @param {string} category - Optional category filter
 * @returns {Record<string, any>} Query object
 *
 * @example
 * ```typescript
 * const quickReplies = await listQuickReplies('user-123', 'common');
 * ```
 */
export declare const listQuickReplies: (userId: string, category?: string) => Record<string, any>;
/**
 * Uses a quick reply (increments usage counter).
 *
 * @param {string} quickReplyId - Quick reply ID
 * @returns {Record<string, any>} Update object
 *
 * @example
 * ```typescript
 * await useQuickReply('qr-123');
 * ```
 */
export declare const useQuickReply: (quickReplyId: string) => Record<string, any>;
/**
 * Creates a canned response (pre-written email).
 *
 * @param {string} userId - User ID
 * @param {object} data - Canned response data
 * @returns {Record<string, any>} Create object
 *
 * @example
 * ```typescript
 * await createCannedResponse('user-123', {
 *   name: 'Appointment Confirmation',
 *   subject: 'Your appointment is confirmed',
 *   body: 'Your appointment on {{date}} is confirmed.',
 *   variables: [{ name: 'date', type: 'date', required: true }],
 *   isShared: true
 * });
 * ```
 */
export declare const createCannedResponse: (userId: string, data: {
    name: string;
    description?: string;
    subject?: string;
    body: string;
    bodyHtml?: string;
    category?: string;
    tags?: string[];
    variables?: TemplateVariable[];
    isShared?: boolean;
}) => Record<string, any>;
/**
 * Lists canned responses for a user.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Optional filters
 * @returns {Record<string, any>} Query object
 *
 * @example
 * ```typescript
 * const responses = await listCannedResponses('user-123', {
 *   category: 'patient-care',
 *   includeShared: true
 * });
 * ```
 */
export declare const listCannedResponses: (userId: string, filters?: {
    category?: string;
    includeShared?: boolean;
}) => Record<string, any>;
/**
 * Uses a canned response (increments usage counter).
 *
 * @param {string} cannedResponseId - Canned response ID
 * @returns {Record<string, any>} Update object
 *
 * @example
 * ```typescript
 * await useCannedResponse('cr-123');
 * ```
 */
export declare const useCannedResponse: (cannedResponseId: string) => Record<string, any>;
/**
 * Gets templates grouped by category.
 *
 * @param {string} userId - User ID
 * @param {string} organizationId - Organization ID
 * @returns {Record<string, any>} Query object
 *
 * @example
 * ```typescript
 * const byCategory = await getTemplatesByCategory('user-123', 'org-123');
 * ```
 */
export declare const getTemplatesByCategory: (userId?: string, organizationId?: string) => Record<string, any>;
/**
 * Sets a template as default for its category.
 *
 * @param {string} templateId - Template ID
 * @param {string} userId - User ID
 * @returns {Record<string, any>} Update objects
 *
 * @example
 * ```typescript
 * await setTemplateAsDefault('tmpl-123', 'user-123');
 * ```
 */
export declare const setTemplateAsDefault: (templateId: string, userId: string) => Record<string, any>;
/**
 * Gets the default template for a category.
 *
 * @param {TemplateCategory} category - Template category
 * @param {string} userId - User ID
 * @returns {Record<string, any>} Query object
 *
 * @example
 * ```typescript
 * const defaultWelcome = await getDefaultTemplateForCategory('welcome', 'user-123');
 * ```
 */
export declare const getDefaultTemplateForCategory: (category: TemplateCategory, userId?: string) => Record<string, any>;
/**
 * Strips HTML tags from text for plain text version.
 *
 * @param {string} html - HTML content
 * @returns {string} Plain text content
 *
 * @example
 * ```typescript
 * const plain = stripHtmlTags('<p>Hello <strong>world</strong>!</p>');
 * // Returns: "Hello world!"
 * ```
 */
export declare const stripHtmlTags: (html: string) => string;
/**
 * Increments template usage counter.
 *
 * @param {string} templateId - Template ID
 * @returns {Record<string, any>} Update object
 *
 * @example
 * ```typescript
 * await incrementTemplateUsage('tmpl-123');
 * ```
 */
export declare const incrementTemplateUsage: (templateId: string) => Record<string, any>;
/**
 * Swagger schema for MailTemplate.
 */
export declare const getMailTemplateSwaggerSchema: () => {
    name: string;
    type: string;
    description: string;
    example: {
        id: string;
        name: string;
        displayName: string;
        category: string;
        type: string;
        subject: string;
        bodyHtml: string;
        variables: {
            name: string;
            type: string;
            required: boolean;
        }[];
        isActive: boolean;
        version: number;
        language: string;
    };
    properties: {
        id: {
            type: string;
            format: string;
        };
        userId: {
            type: string;
            format: string;
            nullable: boolean;
        };
        organizationId: {
            type: string;
            format: string;
            nullable: boolean;
        };
        name: {
            type: string;
        };
        displayName: {
            type: string;
        };
        description: {
            type: string;
            nullable: boolean;
        };
        category: {
            type: string;
            enum: string[];
        };
        type: {
            type: string;
            enum: string[];
        };
        subject: {
            type: string;
        };
        bodyHtml: {
            type: string;
            nullable: boolean;
        };
        bodyText: {
            type: string;
            nullable: boolean;
        };
        bodyMjml: {
            type: string;
            nullable: boolean;
        };
        variables: {
            type: string;
            items: {
                $ref: string;
            };
        };
        placeholders: {
            type: string;
            items: {
                type: string;
            };
        };
        isActive: {
            type: string;
        };
        isDefault: {
            type: string;
        };
        version: {
            type: string;
        };
        language: {
            type: string;
        };
        locale: {
            type: string;
        };
        tags: {
            type: string;
            items: {
                type: string;
            };
        };
        usageCount: {
            type: string;
        };
        lastUsedAt: {
            type: string;
            format: string;
            nullable: boolean;
        };
        createdAt: {
            type: string;
            format: string;
        };
        updatedAt: {
            type: string;
            format: string;
        };
    };
};
/**
 * Swagger schema for TemplateVariable.
 */
export declare const getTemplateVariableSwaggerSchema: () => {
    name: string;
    type: string;
    description: string;
    example: {
        name: string;
        displayName: string;
        type: string;
        required: boolean;
        defaultValue: string;
    };
    properties: {
        name: {
            type: string;
        };
        displayName: {
            type: string;
        };
        description: {
            type: string;
            nullable: boolean;
        };
        type: {
            type: string;
            enum: string[];
        };
        required: {
            type: string;
        };
        defaultValue: {
            type: string;
            nullable: boolean;
        };
        validationRules: {
            type: string;
            items: {
                $ref: string;
            };
        };
        example: {
            type: string;
            nullable: boolean;
        };
    };
};
/**
 * Swagger schema for TemplateCreateDto.
 */
export declare const getTemplateCreateDtoSwaggerSchema: () => {
    name: string;
    type: string;
    description: string;
    required: string[];
    example: {
        name: string;
        displayName: string;
        category: string;
        type: string;
        subject: string;
        bodyHtml: string;
        variables: {
            name: string;
            type: string;
            required: boolean;
        }[];
    };
    properties: {
        userId: {
            type: string;
            format: string;
        };
        organizationId: {
            type: string;
            format: string;
        };
        name: {
            type: string;
        };
        displayName: {
            type: string;
        };
        description: {
            type: string;
        };
        category: {
            type: string;
        };
        type: {
            type: string;
            enum: string[];
        };
        subject: {
            type: string;
        };
        bodyHtml: {
            type: string;
        };
        bodyText: {
            type: string;
        };
        bodyMjml: {
            type: string;
        };
        variables: {
            type: string;
            items: {
                $ref: string;
            };
        };
        language: {
            type: string;
            default: string;
        };
        locale: {
            type: string;
            default: string;
        };
        tags: {
            type: string;
            items: {
                type: string;
            };
        };
    };
};
/**
 * Swagger schema for TemplateRenderContext.
 */
export declare const getTemplateRenderContextSwaggerSchema: () => {
    name: string;
    type: string;
    description: string;
    required: string[];
    example: {
        variables: {
            patientName: string;
            appointmentDate: string;
            organizationName: string;
        };
        locale: string;
        timezone: string;
    };
    properties: {
        variables: {
            type: string;
            additionalProperties: boolean;
        };
        helpers: {
            type: string;
            additionalProperties: boolean;
        };
        partials: {
            type: string;
            additionalProperties: {
                type: string;
            };
        };
        locale: {
            type: string;
        };
        timezone: {
            type: string;
        };
    };
};
/**
 * Swagger schema for QuickReply.
 */
export declare const getQuickReplySwaggerSchema: () => {
    name: string;
    type: string;
    description: string;
    example: {
        id: string;
        name: string;
        shortcut: string;
        content: string;
        category: string;
        usageCount: number;
    };
    properties: {
        id: {
            type: string;
            format: string;
        };
        userId: {
            type: string;
            format: string;
        };
        name: {
            type: string;
        };
        shortcut: {
            type: string;
            nullable: boolean;
        };
        content: {
            type: string;
        };
        contentHtml: {
            type: string;
            nullable: boolean;
        };
        category: {
            type: string;
            nullable: boolean;
        };
        isActive: {
            type: string;
        };
        usageCount: {
            type: string;
        };
        lastUsedAt: {
            type: string;
            format: string;
            nullable: boolean;
        };
        createdAt: {
            type: string;
            format: string;
        };
        updatedAt: {
            type: string;
            format: string;
        };
    };
};
/**
 * Swagger schema for CannedResponse.
 */
export declare const getCannedResponseSwaggerSchema: () => {
    name: string;
    type: string;
    description: string;
    example: {
        id: string;
        name: string;
        subject: string;
        body: string;
        variables: {
            name: string;
            type: string;
            required: boolean;
        }[];
        isShared: boolean;
        usageCount: number;
    };
    properties: {
        id: {
            type: string;
            format: string;
        };
        userId: {
            type: string;
            format: string;
        };
        organizationId: {
            type: string;
            format: string;
            nullable: boolean;
        };
        name: {
            type: string;
        };
        description: {
            type: string;
            nullable: boolean;
        };
        subject: {
            type: string;
            nullable: boolean;
        };
        body: {
            type: string;
        };
        bodyHtml: {
            type: string;
            nullable: boolean;
        };
        category: {
            type: string;
            nullable: boolean;
        };
        tags: {
            type: string;
            items: {
                type: string;
            };
        };
        variables: {
            type: string;
            items: {
                $ref: string;
            };
        };
        isShared: {
            type: string;
        };
        usageCount: {
            type: string;
        };
        createdAt: {
            type: string;
            format: string;
        };
        updatedAt: {
            type: string;
            format: string;
        };
    };
};
declare const _default: {
    getMailTemplateModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            comment: string;
        };
        organizationId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            comment: string;
        };
        name: {
            type: string;
            allowNull: boolean;
            unique: boolean;
            comment: string;
        };
        displayName: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        category: {
            type: string;
            values: string[];
            allowNull: boolean;
            comment: string;
        };
        type: {
            type: string;
            values: string[];
            allowNull: boolean;
            defaultValue: string;
            comment: string;
        };
        subject: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        bodyHtml: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        bodyText: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        bodyMjml: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        variables: {
            type: string;
            defaultValue: never[];
            comment: string;
        };
        placeholders: {
            type: string;
            defaultValue: never[];
            comment: string;
        };
        isActive: {
            type: string;
            defaultValue: boolean;
            comment: string;
        };
        isDefault: {
            type: string;
            defaultValue: boolean;
            comment: string;
        };
        version: {
            type: string;
            defaultValue: number;
            comment: string;
        };
        language: {
            type: string;
            defaultValue: string;
            comment: string;
        };
        locale: {
            type: string;
            defaultValue: string;
            comment: string;
        };
        tags: {
            type: string;
            defaultValue: never[];
            comment: string;
        };
        metadata: {
            type: string;
            defaultValue: {};
            comment: string;
        };
        accessControl: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        usageCount: {
            type: string;
            defaultValue: number;
            comment: string;
        };
        lastUsedAt: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        createdBy: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        updatedBy: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getTemplateVersionModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        templateId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        version: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        subject: {
            type: string;
            allowNull: boolean;
        };
        bodyHtml: {
            type: string;
            allowNull: boolean;
        };
        bodyText: {
            type: string;
            allowNull: boolean;
        };
        bodyMjml: {
            type: string;
            allowNull: boolean;
        };
        variables: {
            type: string;
            defaultValue: never[];
        };
        changeLog: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        changedBy: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getTemplateLocalizationModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        templateId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        language: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        locale: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        subject: {
            type: string;
            allowNull: boolean;
        };
        bodyHtml: {
            type: string;
            allowNull: boolean;
        };
        bodyText: {
            type: string;
            allowNull: boolean;
        };
        bodyMjml: {
            type: string;
            allowNull: boolean;
        };
        variables: {
            type: string;
            defaultValue: {};
            comment: string;
        };
        isDefault: {
            type: string;
            defaultValue: boolean;
            comment: string;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getQuickReplyModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        organizationId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        name: {
            type: string;
            allowNull: boolean;
        };
        shortcut: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        content: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        contentHtml: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        category: {
            type: string;
            allowNull: boolean;
        };
        isActive: {
            type: string;
            defaultValue: boolean;
        };
        usageCount: {
            type: string;
            defaultValue: number;
        };
        lastUsedAt: {
            type: string;
            allowNull: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getCannedResponseModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        organizationId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        name: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        subject: {
            type: string;
            allowNull: boolean;
        };
        body: {
            type: string;
            allowNull: boolean;
        };
        bodyHtml: {
            type: string;
            allowNull: boolean;
        };
        category: {
            type: string;
            allowNull: boolean;
        };
        tags: {
            type: string;
            defaultValue: never[];
        };
        variables: {
            type: string;
            defaultValue: never[];
            comment: string;
        };
        isShared: {
            type: string;
            defaultValue: boolean;
            comment: string;
        };
        usageCount: {
            type: string;
            defaultValue: number;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    createMailTemplate: (data: TemplateCreateDto) => Record<string, any>;
    getMailTemplateById: (templateId: string, userId?: string) => Record<string, any>;
    updateMailTemplate: (templateId: string, userId: string, updates: TemplateUpdateDto) => Record<string, any>;
    deleteMailTemplate: (templateId: string, userId: string, permanent?: boolean) => Record<string, any>;
    searchMailTemplates: (query: TemplateSearchQuery) => Record<string, any>;
    renderTemplate: (template: MailTemplate, context: TemplateRenderContext) => TemplatePreview;
    renderMjmlTemplate: (mjml: string, variables: Record<string, any>) => string;
    renderHandlebarsTemplate: (template: string, variables: Record<string, any>, helpers?: Record<string, Function>) => string;
    extractPlaceholders: (content: string) => string[];
    validateTemplateVariables: (schema: TemplateVariable[], variables: Record<string, any>) => {
        valid: boolean;
        errors: string[];
    };
    generateTemplatePreview: (template: MailTemplate) => TemplatePreview;
    getSystemTemplate: (category: TemplateCategory, language?: string) => SystemTemplate;
    createSystemTemplates: (organizationId: string, language?: string) => MailTemplate[];
    createTemplateVersion: (templateId: string, userId: string, changeLog?: string) => Record<string, any>;
    getTemplateVersionHistory: (templateId: string, limit?: number) => Record<string, any>;
    restoreTemplateVersion: (templateId: string, version: number, userId: string) => Record<string, any>;
    compareTemplateVersions: (templateId: string, version1: number, version2: number) => Record<string, any>;
    createTemplateLocalization: (templateId: string, language: string, locale: string, content: {
        subject: string;
        bodyHtml?: string;
        bodyText?: string;
        bodyMjml?: string;
    }) => Record<string, any>;
    getTemplateLocalization: (templateId: string, language: string, locale?: string) => Record<string, any>;
    listTemplateLocalizations: (templateId: string) => Record<string, any>;
    updateTemplateLocalization: (localizationId: string, updates: Partial<TemplateLocalization>) => Record<string, any>;
    checkTemplatePermission: (template: MailTemplate, userId: string, permission: keyof TemplateAccessControl["permissions"]) => boolean;
    updateTemplateAccessControl: (templateId: string, userId: string, accessControl: TemplateAccessControl) => Record<string, any>;
    shareTemplate: (templateId: string, userId: string, shareWith: {
        users?: string[];
        roles?: string[];
        departments?: string[];
    }) => Record<string, any>;
    createQuickReply: (userId: string, data: {
        name: string;
        shortcut?: string;
        content: string;
        contentHtml?: string;
        category?: string;
    }) => Record<string, any>;
    listQuickReplies: (userId: string, category?: string) => Record<string, any>;
    useQuickReply: (quickReplyId: string) => Record<string, any>;
    createCannedResponse: (userId: string, data: {
        name: string;
        description?: string;
        subject?: string;
        body: string;
        bodyHtml?: string;
        category?: string;
        tags?: string[];
        variables?: TemplateVariable[];
        isShared?: boolean;
    }) => Record<string, any>;
    listCannedResponses: (userId: string, filters?: {
        category?: string;
        includeShared?: boolean;
    }) => Record<string, any>;
    useCannedResponse: (cannedResponseId: string) => Record<string, any>;
    getTemplatesByCategory: (userId?: string, organizationId?: string) => Record<string, any>;
    setTemplateAsDefault: (templateId: string, userId: string) => Record<string, any>;
    getDefaultTemplateForCategory: (category: TemplateCategory, userId?: string) => Record<string, any>;
    stripHtmlTags: (html: string) => string;
    incrementTemplateUsage: (templateId: string) => Record<string, any>;
    getMailTemplateSwaggerSchema: () => {
        name: string;
        type: string;
        description: string;
        example: {
            id: string;
            name: string;
            displayName: string;
            category: string;
            type: string;
            subject: string;
            bodyHtml: string;
            variables: {
                name: string;
                type: string;
                required: boolean;
            }[];
            isActive: boolean;
            version: number;
            language: string;
        };
        properties: {
            id: {
                type: string;
                format: string;
            };
            userId: {
                type: string;
                format: string;
                nullable: boolean;
            };
            organizationId: {
                type: string;
                format: string;
                nullable: boolean;
            };
            name: {
                type: string;
            };
            displayName: {
                type: string;
            };
            description: {
                type: string;
                nullable: boolean;
            };
            category: {
                type: string;
                enum: string[];
            };
            type: {
                type: string;
                enum: string[];
            };
            subject: {
                type: string;
            };
            bodyHtml: {
                type: string;
                nullable: boolean;
            };
            bodyText: {
                type: string;
                nullable: boolean;
            };
            bodyMjml: {
                type: string;
                nullable: boolean;
            };
            variables: {
                type: string;
                items: {
                    $ref: string;
                };
            };
            placeholders: {
                type: string;
                items: {
                    type: string;
                };
            };
            isActive: {
                type: string;
            };
            isDefault: {
                type: string;
            };
            version: {
                type: string;
            };
            language: {
                type: string;
            };
            locale: {
                type: string;
            };
            tags: {
                type: string;
                items: {
                    type: string;
                };
            };
            usageCount: {
                type: string;
            };
            lastUsedAt: {
                type: string;
                format: string;
                nullable: boolean;
            };
            createdAt: {
                type: string;
                format: string;
            };
            updatedAt: {
                type: string;
                format: string;
            };
        };
    };
    getTemplateVariableSwaggerSchema: () => {
        name: string;
        type: string;
        description: string;
        example: {
            name: string;
            displayName: string;
            type: string;
            required: boolean;
            defaultValue: string;
        };
        properties: {
            name: {
                type: string;
            };
            displayName: {
                type: string;
            };
            description: {
                type: string;
                nullable: boolean;
            };
            type: {
                type: string;
                enum: string[];
            };
            required: {
                type: string;
            };
            defaultValue: {
                type: string;
                nullable: boolean;
            };
            validationRules: {
                type: string;
                items: {
                    $ref: string;
                };
            };
            example: {
                type: string;
                nullable: boolean;
            };
        };
    };
    getTemplateCreateDtoSwaggerSchema: () => {
        name: string;
        type: string;
        description: string;
        required: string[];
        example: {
            name: string;
            displayName: string;
            category: string;
            type: string;
            subject: string;
            bodyHtml: string;
            variables: {
                name: string;
                type: string;
                required: boolean;
            }[];
        };
        properties: {
            userId: {
                type: string;
                format: string;
            };
            organizationId: {
                type: string;
                format: string;
            };
            name: {
                type: string;
            };
            displayName: {
                type: string;
            };
            description: {
                type: string;
            };
            category: {
                type: string;
            };
            type: {
                type: string;
                enum: string[];
            };
            subject: {
                type: string;
            };
            bodyHtml: {
                type: string;
            };
            bodyText: {
                type: string;
            };
            bodyMjml: {
                type: string;
            };
            variables: {
                type: string;
                items: {
                    $ref: string;
                };
            };
            language: {
                type: string;
                default: string;
            };
            locale: {
                type: string;
                default: string;
            };
            tags: {
                type: string;
                items: {
                    type: string;
                };
            };
        };
    };
    getTemplateRenderContextSwaggerSchema: () => {
        name: string;
        type: string;
        description: string;
        required: string[];
        example: {
            variables: {
                patientName: string;
                appointmentDate: string;
                organizationName: string;
            };
            locale: string;
            timezone: string;
        };
        properties: {
            variables: {
                type: string;
                additionalProperties: boolean;
            };
            helpers: {
                type: string;
                additionalProperties: boolean;
            };
            partials: {
                type: string;
                additionalProperties: {
                    type: string;
                };
            };
            locale: {
                type: string;
            };
            timezone: {
                type: string;
            };
        };
    };
    getQuickReplySwaggerSchema: () => {
        name: string;
        type: string;
        description: string;
        example: {
            id: string;
            name: string;
            shortcut: string;
            content: string;
            category: string;
            usageCount: number;
        };
        properties: {
            id: {
                type: string;
                format: string;
            };
            userId: {
                type: string;
                format: string;
            };
            name: {
                type: string;
            };
            shortcut: {
                type: string;
                nullable: boolean;
            };
            content: {
                type: string;
            };
            contentHtml: {
                type: string;
                nullable: boolean;
            };
            category: {
                type: string;
                nullable: boolean;
            };
            isActive: {
                type: string;
            };
            usageCount: {
                type: string;
            };
            lastUsedAt: {
                type: string;
                format: string;
                nullable: boolean;
            };
            createdAt: {
                type: string;
                format: string;
            };
            updatedAt: {
                type: string;
                format: string;
            };
        };
    };
    getCannedResponseSwaggerSchema: () => {
        name: string;
        type: string;
        description: string;
        example: {
            id: string;
            name: string;
            subject: string;
            body: string;
            variables: {
                name: string;
                type: string;
                required: boolean;
            }[];
            isShared: boolean;
            usageCount: number;
        };
        properties: {
            id: {
                type: string;
                format: string;
            };
            userId: {
                type: string;
                format: string;
            };
            organizationId: {
                type: string;
                format: string;
                nullable: boolean;
            };
            name: {
                type: string;
            };
            description: {
                type: string;
                nullable: boolean;
            };
            subject: {
                type: string;
                nullable: boolean;
            };
            body: {
                type: string;
            };
            bodyHtml: {
                type: string;
                nullable: boolean;
            };
            category: {
                type: string;
                nullable: boolean;
            };
            tags: {
                type: string;
                items: {
                    type: string;
                };
            };
            variables: {
                type: string;
                items: {
                    $ref: string;
                };
            };
            isShared: {
                type: string;
            };
            usageCount: {
                type: string;
            };
            createdAt: {
                type: string;
                format: string;
            };
            updatedAt: {
                type: string;
                format: string;
            };
        };
    };
};
export default _default;
//# sourceMappingURL=mail-templates-kit.d.ts.map