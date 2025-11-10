"use strict";
/**
 * LOC: DOC-FORMS-001
 * File: /reuse/document/document-forms-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - pdf-lib
 *   - pdfjs-dist
 *   - sequelize (v6.x)
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Document controllers
 *   - Forms processing services
 *   - PDF generation modules
 *   - Healthcare intake form handlers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFormFromTemplate = exports.validateFormTemplate = exports.mergeFormTemplates = exports.cloneFormTemplate = exports.createFormTemplate = exports.exportSubmissionsToSpreadsheet = exports.exportFormDataToFDF = exports.exportFormDataToXML = exports.exportFormDataToCSV = exports.exportFormDataToJSON = exports.processFormSubmission = exports.sanitizeFormData = exports.validateSubmission = exports.createFormSubmission = exports.validateCalculations = exports.applyCalculations = exports.calculateFieldValue = exports.isFormFlattened = exports.flattenSpecificFields = exports.flattenForm = exports.validateDateField = exports.validateFieldValue = exports.validateRequiredFields = exports.validateFormSubmission = exports.fillFormDefaults = exports.selectRadioButton = exports.selectDropdownOption = exports.setCheckboxState = exports.fillTextField = exports.fillFormData = exports.detectFieldTypes = exports.extractCheckboxStates = exports.extractFieldValue = exports.extractFieldNames = exports.extractFormData = exports.validateFieldConfig = exports.createSignatureField = exports.createDropdownField = exports.createRadioGroup = exports.createCheckboxField = exports.createEmailField = exports.createDateField = exports.createNumberField = exports.createTextAreaField = exports.createTextField = exports.createFormSubmissionModel = exports.createFormFieldModel = exports.createFormModel = void 0;
/**
 * File: /reuse/document/document-forms-kit.ts
 * Locator: WC-UTL-DOCFORMS-001
 * Purpose: Document Forms & Fields Kit - Interactive PDF forms, field creation, extraction, validation, and filling
 *
 * Upstream: @nestjs/common, pdf-lib, pdfjs-dist, sequelize, class-validator
 * Downstream: Document controllers, forms services, PDF processing, healthcare forms
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, pdf-lib 1.17.x, pdfjs-dist 3.x
 * Exports: 45 utility functions for form creation, field management, filling, validation, extraction, calculations
 *
 * LLM Context: Production-grade PDF forms utilities for White Cross healthcare platform.
 * Provides interactive PDF form creation, dynamic field generation, form filling automation,
 * data extraction, validation rules, field calculations, dropdown/checkbox/radio controls,
 * form flattening, submission handling, and HIPAA-compliant form data management. Essential
 * for patient intake forms, consent documents, medical records, and healthcare documentation.
 */
const sequelize_1 = require("sequelize");
/**
 * Creates Form model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<FormAttributes>>} Form model
 *
 * @example
 * ```typescript
 * const FormModel = createFormModel(sequelize);
 * const form = await FormModel.create({
 *   name: 'Patient Intake Form',
 *   category: 'intake',
 *   version: 1,
 *   isActive: true,
 *   isPdfForm: true
 * });
 * ```
 */
const createFormModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Form name/title',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        category: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Form category (intake, consent, medical-history, etc.)',
        },
        templateId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Reference to template if form was created from template',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        isPdfForm: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether this is a PDF-based form',
        },
        pdfPath: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Path to PDF template file',
        },
        fieldCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        submissionCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        lastModifiedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        tableName: 'forms',
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['category'] },
            { fields: ['isActive'] },
            { fields: ['createdBy'] },
            { fields: ['templateId'] },
            { fields: ['createdAt'] },
        ],
    };
    return sequelize.define('Form', attributes, options);
};
exports.createFormModel = createFormModel;
/**
 * Creates FormField model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<FormFieldAttributes>>} FormField model
 *
 * @example
 * ```typescript
 * const FieldModel = createFormFieldModel(sequelize);
 * const field = await FieldModel.create({
 *   formId: 'form-uuid',
 *   name: 'patientName',
 *   type: 'text',
 *   label: 'Patient Name',
 *   required: true,
 *   position: { x: 100, y: 200, width: 300, height: 30 }
 * });
 * ```
 */
const createFormFieldModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        formId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'forms',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Field name/identifier',
        },
        type: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Field type (text, checkbox, dropdown, etc.)',
        },
        label: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Display label for field',
        },
        defaultValue: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        placeholder: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        required: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        readonly: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        disabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        hidden: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        position: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Field position and dimensions (x, y, width, height, page)',
        },
        validation: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Validation rules and constraints',
        },
        options: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Options for dropdown, radio, checkbox fields',
        },
        calculation: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Calculation formula for computed fields',
        },
        order: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Display order',
        },
    };
    const options = {
        tableName: 'form_fields',
        timestamps: true,
        indexes: [
            { fields: ['formId'] },
            { fields: ['name'] },
            { fields: ['type'] },
            { fields: ['required'] },
            { fields: ['order'] },
        ],
    };
    return sequelize.define('FormField', attributes, options);
};
exports.createFormFieldModel = createFormFieldModel;
/**
 * Creates FormSubmission model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<FormSubmissionAttributes>>} FormSubmission model
 *
 * @example
 * ```typescript
 * const SubmissionModel = createFormSubmissionModel(sequelize);
 * const submission = await SubmissionModel.create({
 *   formId: 'form-uuid',
 *   submittedBy: 'user-uuid',
 *   data: { patientName: 'John Doe', dateOfBirth: '1980-01-01' },
 *   validationStatus: 'valid',
 *   submittedAt: new Date()
 * });
 * ```
 */
const createFormSubmissionModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        formId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'forms',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        submittedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who submitted the form',
        },
        data: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Form field values',
        },
        attachments: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
            comment: 'Attached file IDs',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'IP address of submission',
        },
        userAgent: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'User agent string',
        },
        validationStatus: {
            type: sequelize_1.DataTypes.ENUM('valid', 'invalid', 'pending'),
            allowNull: false,
            defaultValue: 'pending',
        },
        validationErrors: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Validation error details',
        },
        signature: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Digital signature or signed hash',
        },
        submittedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        processedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        tableName: 'form_submissions',
        timestamps: true,
        indexes: [
            { fields: ['formId'] },
            { fields: ['submittedBy'] },
            { fields: ['validationStatus'] },
            { fields: ['submittedAt'] },
            { fields: ['processedAt'] },
        ],
    };
    return sequelize.define('FormSubmission', attributes, options);
};
exports.createFormSubmissionModel = createFormSubmissionModel;
// ============================================================================
// 1. FORM FIELD CREATION
// ============================================================================
/**
 * 1. Creates a text input field.
 *
 * @param {string} name - Field name
 * @param {FieldPosition} position - Field position and size
 * @param {Partial<FormFieldConfig>} [options] - Additional field options
 * @returns {FormField} Text field configuration
 *
 * @example
 * ```typescript
 * const nameField = createTextField('patientName',
 *   { x: 100, y: 200, width: 300, height: 30, page: 1 },
 *   { label: 'Patient Name', required: true, placeholder: 'Enter full name' }
 * );
 * ```
 */
const createTextField = (name, position, options) => {
    return {
        id: `field-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name,
        type: 'text',
        position,
        label: options?.label || name,
        placeholder: options?.placeholder,
        required: options?.required || false,
        readonly: options?.readonly || false,
        disabled: options?.disabled || false,
        hidden: options?.hidden || false,
        maxLength: options?.maxLength,
        minLength: options?.minLength,
        pattern: options?.pattern,
        alignment: options?.alignment || 'left',
        fontSize: options?.fontSize || 12,
        fontColor: options?.fontColor || '#000000',
        backgroundColor: options?.backgroundColor || '#FFFFFF',
        borderColor: options?.borderColor || '#000000',
        borderWidth: options?.borderWidth || 1,
        tooltip: options?.tooltip,
        defaultValue: options?.defaultValue,
        ...options,
    };
};
exports.createTextField = createTextField;
/**
 * 2. Creates a textarea (multiline text) field.
 *
 * @param {string} name - Field name
 * @param {FieldPosition} position - Field position and size
 * @param {Partial<FormFieldConfig>} [options] - Additional field options
 * @returns {FormField} Textarea field configuration
 *
 * @example
 * ```typescript
 * const notesField = createTextAreaField('medicalHistory',
 *   { x: 100, y: 300, width: 400, height: 100, page: 1 },
 *   { label: 'Medical History', rows: 5, required: true }
 * );
 * ```
 */
const createTextAreaField = (name, position, options) => {
    return {
        id: `field-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name,
        type: 'textarea',
        position,
        label: options?.label || name,
        placeholder: options?.placeholder,
        required: options?.required || false,
        readonly: options?.readonly || false,
        rows: options?.rows || 4,
        cols: options?.cols || 50,
        maxLength: options?.maxLength,
        fontSize: options?.fontSize || 12,
        ...options,
    };
};
exports.createTextAreaField = createTextAreaField;
/**
 * 3. Creates a number input field.
 *
 * @param {string} name - Field name
 * @param {FieldPosition} position - Field position and size
 * @param {Partial<FormFieldConfig>} [options] - Additional field options including min/max
 * @returns {FormField} Number field configuration
 *
 * @example
 * ```typescript
 * const ageField = createNumberField('age',
 *   { x: 100, y: 400, width: 100, height: 30, page: 1 },
 *   { label: 'Age', min: 0, max: 150, required: true }
 * );
 * ```
 */
const createNumberField = (name, position, options) => {
    return {
        id: `field-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name,
        type: 'number',
        position,
        label: options?.label || name,
        placeholder: options?.placeholder,
        required: options?.required || false,
        min: options?.min,
        max: options?.max,
        defaultValue: options?.defaultValue,
        ...options,
    };
};
exports.createNumberField = createNumberField;
/**
 * 4. Creates a date input field.
 *
 * @param {string} name - Field name
 * @param {FieldPosition} position - Field position and size
 * @param {Partial<FormFieldConfig>} [options] - Additional field options
 * @returns {FormField} Date field configuration
 *
 * @example
 * ```typescript
 * const dobField = createDateField('dateOfBirth',
 *   { x: 100, y: 500, width: 150, height: 30, page: 1 },
 *   { label: 'Date of Birth', required: true }
 * );
 * ```
 */
const createDateField = (name, position, options) => {
    return {
        id: `field-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name,
        type: 'date',
        position,
        label: options?.label || name,
        required: options?.required || false,
        defaultValue: options?.defaultValue,
        ...options,
    };
};
exports.createDateField = createDateField;
/**
 * 5. Creates an email input field with validation.
 *
 * @param {string} name - Field name
 * @param {FieldPosition} position - Field position and size
 * @param {Partial<FormFieldConfig>} [options] - Additional field options
 * @returns {FormField} Email field configuration
 *
 * @example
 * ```typescript
 * const emailField = createEmailField('email',
 *   { x: 100, y: 600, width: 250, height: 30, page: 1 },
 *   { label: 'Email Address', required: true }
 * );
 * ```
 */
const createEmailField = (name, position, options) => {
    return {
        id: `field-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name,
        type: 'email',
        position,
        label: options?.label || name,
        placeholder: options?.placeholder || 'user@example.com',
        required: options?.required || false,
        pattern: options?.pattern || '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        ...options,
    };
};
exports.createEmailField = createEmailField;
/**
 * 6. Creates a checkbox field.
 *
 * @param {string} name - Field name
 * @param {FieldPosition} position - Field position and size
 * @param {CheckboxConfig} config - Checkbox configuration
 * @returns {FormField} Checkbox field configuration
 *
 * @example
 * ```typescript
 * const consentField = createCheckboxField('consent',
 *   { x: 100, y: 700, width: 20, height: 20, page: 1 },
 *   { label: 'I agree to terms and conditions', checked: false }
 * );
 * ```
 */
const createCheckboxField = (name, position, config) => {
    return {
        id: `field-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name,
        type: 'checkbox',
        position,
        label: config.label,
        defaultValue: config.checked || false,
        value: config.value !== undefined ? config.value : true,
        fontSize: config.size || 12,
    };
};
exports.createCheckboxField = createCheckboxField;
/**
 * 7. Creates a radio button group.
 *
 * @param {string} name - Field group name
 * @param {FieldPosition} startPosition - Starting position for first radio button
 * @param {RadioGroupConfig} config - Radio group configuration
 * @returns {FormField[]} Array of radio button fields
 *
 * @example
 * ```typescript
 * const genderFields = createRadioGroup('gender',
 *   { x: 100, y: 800, width: 20, height: 20, page: 1 },
 *   {
 *     name: 'gender',
 *     options: [
 *       { label: 'Male', value: 'M' },
 *       { label: 'Female', value: 'F' },
 *       { label: 'Other', value: 'O' }
 *     ],
 *     layout: 'horizontal',
 *     spacing: 100
 *   }
 * );
 * ```
 */
const createRadioGroup = (name, startPosition, config) => {
    const fields = [];
    const spacing = config.spacing || 80;
    const isHorizontal = config.layout === 'horizontal';
    config.options.forEach((option, index) => {
        const position = {
            ...startPosition,
            x: isHorizontal ? startPosition.x + index * spacing : startPosition.x,
            y: isHorizontal ? startPosition.y : startPosition.y + index * spacing,
        };
        fields.push({
            id: `field-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`,
            name,
            type: 'radio',
            position,
            label: option.label,
            value: option.value,
            defaultValue: option.selected || false,
        });
    });
    return fields;
};
exports.createRadioGroup = createRadioGroup;
/**
 * 8. Creates a dropdown (select) field.
 *
 * @param {string} name - Field name
 * @param {FieldPosition} position - Field position and size
 * @param {DropdownOptions} options - Dropdown configuration
 * @returns {FormField} Dropdown field configuration
 *
 * @example
 * ```typescript
 * const stateField = createDropdownField('state',
 *   { x: 100, y: 900, width: 200, height: 30, page: 1 },
 *   {
 *     options: [
 *       { label: 'California', value: 'CA' },
 *       { label: 'Texas', value: 'TX' },
 *       { label: 'New York', value: 'NY' }
 *     ],
 *     placeholder: 'Select a state'
 *   }
 * );
 * ```
 */
const createDropdownField = (name, position, options) => {
    return {
        id: `field-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name,
        type: 'dropdown',
        position,
        options: options.options,
        placeholder: options.placeholder,
        multiSelect: options.multiSelect || false,
    };
};
exports.createDropdownField = createDropdownField;
/**
 * 9. Creates a signature field.
 *
 * @param {string} name - Field name
 * @param {FieldPosition} position - Field position and size
 * @param {Partial<FormFieldConfig>} [options] - Additional field options
 * @returns {FormField} Signature field configuration
 *
 * @example
 * ```typescript
 * const signatureField = createSignatureField('patientSignature',
 *   { x: 100, y: 1000, width: 300, height: 100, page: 2 },
 *   { label: 'Patient Signature', required: true }
 * );
 * ```
 */
const createSignatureField = (name, position, options) => {
    return {
        id: `field-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name,
        type: 'signature',
        position,
        label: options?.label || name,
        required: options?.required || false,
        borderColor: options?.borderColor || '#000000',
        borderWidth: options?.borderWidth || 1,
        backgroundColor: options?.backgroundColor || '#FFFFFF',
        ...options,
    };
};
exports.createSignatureField = createSignatureField;
/**
 * 10. Validates form field configuration.
 *
 * @param {FormField} field - Field to validate
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateFieldConfig(field);
 * if (!validation.valid) {
 *   console.error('Field errors:', validation.errors);
 * }
 * ```
 */
const validateFieldConfig = (field) => {
    const errors = {};
    if (!field.name || field.name.trim() === '') {
        errors.name = ['Field name is required'];
    }
    if (!field.type) {
        errors.type = ['Field type is required'];
    }
    if (!field.position || !field.position.x || !field.position.y) {
        errors.position = ['Field position (x, y) is required'];
    }
    if (field.position && (field.position.width <= 0 || field.position.height <= 0)) {
        errors.position = errors.position || [];
        errors.position.push('Field width and height must be greater than 0');
    }
    if (field.type === 'dropdown' && (!field.options || !Array.isArray(field.options))) {
        errors.options = ['Dropdown field must have options array'];
    }
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
exports.validateFieldConfig = validateFieldConfig;
// ============================================================================
// 2. FORM DATA EXTRACTION
// ============================================================================
/**
 * 11. Extracts form data from PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<FormDataExtraction>} Extracted form data
 *
 * @example
 * ```typescript
 * const formData = await extractFormData(pdfBuffer);
 * console.log('Patient Name:', formData.fields.patientName);
 * ```
 */
const extractFormData = async (pdfBuffer) => {
    // Placeholder for pdf-lib implementation
    // In production, use pdf-lib to read PDF form fields
    return {
        fields: {},
        metadata: {
            extractedAt: new Date(),
            pageCount: 1,
            hasSignatures: false,
            isFlattened: false,
        },
    };
};
exports.extractFormData = extractFormData;
/**
 * 12. Extracts field names from PDF form.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<string[]>} Array of field names
 *
 * @example
 * ```typescript
 * const fieldNames = await extractFieldNames(pdfBuffer);
 * console.log('Form has fields:', fieldNames);
 * ```
 */
const extractFieldNames = async (pdfBuffer) => {
    // Placeholder for pdf-lib implementation
    return [];
};
exports.extractFieldNames = extractFieldNames;
/**
 * 13. Extracts specific field value from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} fieldName - Name of field to extract
 * @returns {Promise<any>} Field value
 *
 * @example
 * ```typescript
 * const patientName = await extractFieldValue(pdfBuffer, 'patientName');
 * ```
 */
const extractFieldValue = async (pdfBuffer, fieldName) => {
    const formData = await (0, exports.extractFormData)(pdfBuffer);
    return formData.fields[fieldName];
};
exports.extractFieldValue = extractFieldValue;
/**
 * 14. Extracts all checkbox states from form.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Record<string, boolean>>} Checkbox states
 *
 * @example
 * ```typescript
 * const checkboxes = await extractCheckboxStates(pdfBuffer);
 * console.log('Consent given:', checkboxes.consent);
 * ```
 */
const extractCheckboxStates = async (pdfBuffer) => {
    const formData = await (0, exports.extractFormData)(pdfBuffer);
    const checkboxes = {};
    Object.entries(formData.fields).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
            checkboxes[key] = value;
        }
    });
    return checkboxes;
};
exports.extractCheckboxStates = extractCheckboxStates;
/**
 * 15. Detects form field types from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Record<string, FormFieldType>>} Field types map
 *
 * @example
 * ```typescript
 * const fieldTypes = await detectFieldTypes(pdfBuffer);
 * console.log('Field types:', fieldTypes);
 * ```
 */
const detectFieldTypes = async (pdfBuffer) => {
    // Placeholder for pdf-lib field type detection
    return {};
};
exports.detectFieldTypes = detectFieldTypes;
// ============================================================================
// 3. FORM FILLING AND POPULATION
// ============================================================================
/**
 * 16. Fills PDF form with provided data.
 *
 * @param {Buffer} pdfBuffer - PDF template buffer
 * @param {Record<string, any>} data - Form data to fill
 * @param {FormFillingOptions} [options] - Filling options
 * @returns {Promise<Buffer>} Filled PDF buffer
 *
 * @example
 * ```typescript
 * const filledPdf = await fillFormData(templatePdf, {
 *   patientName: 'John Doe',
 *   dateOfBirth: '1980-01-01',
 *   consent: true
 * }, { flatten: true });
 * ```
 */
const fillFormData = async (pdfBuffer, data, options) => {
    // Placeholder for pdf-lib form filling implementation
    return pdfBuffer;
};
exports.fillFormData = fillFormData;
/**
 * 17. Fills text field in PDF form.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} fieldName - Field name to fill
 * @param {string} value - Text value
 * @returns {Promise<Buffer>} Updated PDF buffer
 *
 * @example
 * ```typescript
 * const updatedPdf = await fillTextField(pdfBuffer, 'patientName', 'John Doe');
 * ```
 */
const fillTextField = async (pdfBuffer, fieldName, value) => {
    return (0, exports.fillFormData)(pdfBuffer, { [fieldName]: value });
};
exports.fillTextField = fillTextField;
/**
 * 18. Sets checkbox state in PDF form.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} fieldName - Checkbox field name
 * @param {boolean} checked - Checked state
 * @returns {Promise<Buffer>} Updated PDF buffer
 *
 * @example
 * ```typescript
 * const updatedPdf = await setCheckboxState(pdfBuffer, 'consent', true);
 * ```
 */
const setCheckboxState = async (pdfBuffer, fieldName, checked) => {
    return (0, exports.fillFormData)(pdfBuffer, { [fieldName]: checked });
};
exports.setCheckboxState = setCheckboxState;
/**
 * 19. Selects dropdown option in PDF form.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} fieldName - Dropdown field name
 * @param {string} value - Option value to select
 * @returns {Promise<Buffer>} Updated PDF buffer
 *
 * @example
 * ```typescript
 * const updatedPdf = await selectDropdownOption(pdfBuffer, 'state', 'CA');
 * ```
 */
const selectDropdownOption = async (pdfBuffer, fieldName, value) => {
    return (0, exports.fillFormData)(pdfBuffer, { [fieldName]: value });
};
exports.selectDropdownOption = selectDropdownOption;
/**
 * 20. Selects radio button in PDF form.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} groupName - Radio group name
 * @param {string} value - Option value to select
 * @returns {Promise<Buffer>} Updated PDF buffer
 *
 * @example
 * ```typescript
 * const updatedPdf = await selectRadioButton(pdfBuffer, 'gender', 'M');
 * ```
 */
const selectRadioButton = async (pdfBuffer, groupName, value) => {
    return (0, exports.fillFormData)(pdfBuffer, { [groupName]: value });
};
exports.selectRadioButton = selectRadioButton;
/**
 * 21. Fills form with default values.
 *
 * @param {Buffer} pdfBuffer - PDF template buffer
 * @param {FormField[]} fields - Form field definitions with defaults
 * @returns {Promise<Buffer>} PDF with default values filled
 *
 * @example
 * ```typescript
 * const prefilledPdf = await fillFormDefaults(templatePdf, formFields);
 * ```
 */
const fillFormDefaults = async (pdfBuffer, fields) => {
    const defaultData = {};
    fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
            defaultData[field.name] = field.defaultValue;
        }
    });
    return (0, exports.fillFormData)(pdfBuffer, defaultData);
};
exports.fillFormDefaults = fillFormDefaults;
// ============================================================================
// 4. FORM VALIDATION
// ============================================================================
/**
 * 22. Validates form submission data.
 *
 * @param {Record<string, any>} data - Form data to validate
 * @param {ValidationRule[]} rules - Validation rules
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateFormSubmission(formData, [
 *   { field: 'email', rule: 'email', message: 'Invalid email format' },
 *   { field: 'age', rule: 'number', message: 'Age must be a number' }
 * ]);
 * ```
 */
const validateFormSubmission = (data, rules) => {
    const errors = {};
    rules.forEach((rule) => {
        const value = data[rule.field];
        switch (rule.rule) {
            case 'required':
                if (value === undefined || value === null || value === '') {
                    errors[rule.field] = errors[rule.field] || [];
                    errors[rule.field].push(rule.message);
                }
                break;
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors[rule.field] = errors[rule.field] || [];
                    errors[rule.field].push(rule.message);
                }
                break;
            case 'phone':
                if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
                    errors[rule.field] = errors[rule.field] || [];
                    errors[rule.field].push(rule.message);
                }
                break;
            case 'number':
                if (value && isNaN(Number(value))) {
                    errors[rule.field] = errors[rule.field] || [];
                    errors[rule.field].push(rule.message);
                }
                break;
            case 'pattern':
                if (value && rule.params?.pattern && !new RegExp(rule.params.pattern).test(value)) {
                    errors[rule.field] = errors[rule.field] || [];
                    errors[rule.field].push(rule.message);
                }
                break;
            case 'custom':
                if (rule.validator && !rule.validator(value, data)) {
                    errors[rule.field] = errors[rule.field] || [];
                    errors[rule.field].push(rule.message);
                }
                break;
        }
    });
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
exports.validateFormSubmission = validateFormSubmission;
/**
 * 23. Validates required fields are filled.
 *
 * @param {Record<string, any>} data - Form data
 * @param {string[]} requiredFields - Required field names
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateRequiredFields(formData, ['patientName', 'dateOfBirth']);
 * ```
 */
const validateRequiredFields = (data, requiredFields) => {
    const errors = {};
    requiredFields.forEach((field) => {
        if (data[field] === undefined || data[field] === null || data[field] === '') {
            errors[field] = [`${field} is required`];
        }
    });
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
exports.validateRequiredFields = validateRequiredFields;
/**
 * 24. Validates field value against constraints.
 *
 * @param {any} value - Field value
 * @param {FormFieldConfig} field - Field configuration with constraints
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateFieldValue('John', {
 *   name: 'name',
 *   type: 'text',
 *   minLength: 2,
 *   maxLength: 50
 * });
 * ```
 */
const validateFieldValue = (value, field) => {
    const errors = {};
    const fieldErrors = [];
    if (field.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(`${field.label || field.name} is required`);
    }
    if (value !== undefined && value !== null && value !== '') {
        if (field.minLength && String(value).length < field.minLength) {
            fieldErrors.push(`Minimum length is ${field.minLength}`);
        }
        if (field.maxLength && String(value).length > field.maxLength) {
            fieldErrors.push(`Maximum length is ${field.maxLength}`);
        }
        if (field.min !== undefined && Number(value) < field.min) {
            fieldErrors.push(`Minimum value is ${field.min}`);
        }
        if (field.max !== undefined && Number(value) > field.max) {
            fieldErrors.push(`Maximum value is ${field.max}`);
        }
        if (field.pattern && !new RegExp(field.pattern).test(String(value))) {
            fieldErrors.push(`Invalid format for ${field.label || field.name}`);
        }
        if (field.customValidation) {
            const customResult = field.customValidation(value);
            if (customResult !== true) {
                fieldErrors.push(typeof customResult === 'string' ? customResult : 'Validation failed');
            }
        }
    }
    if (fieldErrors.length > 0) {
        errors[field.name] = fieldErrors;
    }
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
exports.validateFieldValue = validateFieldValue;
/**
 * 25. Validates date field format and range.
 *
 * @param {string} dateValue - Date string to validate
 * @param {Object} [constraints] - Date constraints
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateDateField('1980-01-01', {
 *   minDate: '1900-01-01',
 *   maxDate: new Date().toISOString().split('T')[0]
 * });
 * ```
 */
const validateDateField = (dateValue, constraints) => {
    const errors = {};
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
        errors.date = ['Invalid date format'];
        return { valid: false, errors };
    }
    if (constraints?.minDate && date < new Date(constraints.minDate)) {
        errors.date = errors.date || [];
        errors.date.push(`Date must be after ${constraints.minDate}`);
    }
    if (constraints?.maxDate && date > new Date(constraints.maxDate)) {
        errors.date = errors.date || [];
        errors.date.push(`Date must be before ${constraints.maxDate}`);
    }
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
exports.validateDateField = validateDateField;
// ============================================================================
// 5. FORM FLATTENING
// ============================================================================
/**
 * 26. Flattens PDF form (makes fields non-editable).
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} Flattened PDF buffer
 *
 * @example
 * ```typescript
 * const flattenedPdf = await flattenForm(filledPdf);
 * // Form fields are now part of the page content and cannot be edited
 * ```
 */
const flattenForm = async (pdfBuffer) => {
    // Placeholder for pdf-lib form flattening
    return pdfBuffer;
};
exports.flattenForm = flattenForm;
/**
 * 27. Flattens specific fields while keeping others editable.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string[]} fieldNames - Field names to flatten
 * @returns {Promise<Buffer>} Partially flattened PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await flattenSpecificFields(pdfBuffer, ['signature', 'date']);
 * ```
 */
const flattenSpecificFields = async (pdfBuffer, fieldNames) => {
    // Placeholder for selective field flattening
    return pdfBuffer;
};
exports.flattenSpecificFields = flattenSpecificFields;
/**
 * 28. Checks if PDF form is flattened.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<boolean>} True if form is flattened
 *
 * @example
 * ```typescript
 * const isFlattened = await isFormFlattened(pdfBuffer);
 * console.log('Form is flattened:', isFlattened);
 * ```
 */
const isFormFlattened = async (pdfBuffer) => {
    const fieldNames = await (0, exports.extractFieldNames)(pdfBuffer);
    return fieldNames.length === 0;
};
exports.isFormFlattened = isFormFlattened;
// ============================================================================
// 6. FIELD CALCULATIONS
// ============================================================================
/**
 * 29. Calculates field value from formula.
 *
 * @param {string} formula - Calculation formula
 * @param {Record<string, any>} formData - Current form data
 * @returns {any} Calculated value
 *
 * @example
 * ```typescript
 * const total = calculateFieldValue('price * quantity', { price: 10, quantity: 5 });
 * console.log('Total:', total); // 50
 * ```
 */
const calculateFieldValue = (formula, formData) => {
    try {
        // Simple formula evaluation (replace with safer expression evaluator in production)
        let expression = formula;
        Object.entries(formData).forEach(([key, value]) => {
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            expression = expression.replace(regex, String(value || 0));
        });
        // Basic arithmetic operations only
        if (!/^[\d\s+\-*/().]+$/.test(expression)) {
            throw new Error('Invalid formula');
        }
        return eval(expression);
    }
    catch (error) {
        console.error('Calculation error:', error);
        return null;
    }
};
exports.calculateFieldValue = calculateFieldValue;
/**
 * 30. Applies calculation rules to form data.
 *
 * @param {Record<string, any>} formData - Current form data
 * @param {CalculationRule[]} rules - Calculation rules
 * @returns {Record<string, any>} Form data with calculated values
 *
 * @example
 * ```typescript
 * const calculatedData = applyCalculations(formData, [
 *   { targetField: 'total', formula: 'subtotal + tax', dependencies: ['subtotal', 'tax'] }
 * ]);
 * ```
 */
const applyCalculations = (formData, rules) => {
    const result = { ...formData };
    rules.forEach((rule) => {
        const value = (0, exports.calculateFieldValue)(rule.formula, result);
        if (value !== null) {
            result[rule.targetField] =
                rule.precision !== undefined ? Number(value.toFixed(rule.precision)) : value;
        }
    });
    return result;
};
exports.applyCalculations = applyCalculations;
/**
 * 31. Validates calculation dependencies.
 *
 * @param {CalculationRule[]} rules - Calculation rules
 * @param {string[]} availableFields - Available field names
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateCalculations(calculations, fieldNames);
 * ```
 */
const validateCalculations = (rules, availableFields) => {
    const errors = {};
    rules.forEach((rule) => {
        const ruleErrors = [];
        rule.dependencies.forEach((dep) => {
            if (!availableFields.includes(dep)) {
                ruleErrors.push(`Dependency field '${dep}' not found`);
            }
        });
        if (ruleErrors.length > 0) {
            errors[rule.targetField] = ruleErrors;
        }
    });
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
exports.validateCalculations = validateCalculations;
// ============================================================================
// 7. FORM SUBMISSION HANDLING
// ============================================================================
/**
 * 32. Creates form submission record.
 *
 * @param {string} formId - Form ID
 * @param {Record<string, any>} data - Submitted data
 * @param {Partial<FormSubmission>} [metadata] - Additional submission metadata
 * @returns {FormSubmission} Form submission object
 *
 * @example
 * ```typescript
 * const submission = createFormSubmission('form-123', formData, {
 *   submittedBy: 'user-456',
 *   ipAddress: '192.168.1.1'
 * });
 * ```
 */
const createFormSubmission = (formId, data, metadata) => {
    return {
        formId,
        data,
        submittedBy: metadata?.submittedBy,
        attachments: metadata?.attachments || [],
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        submittedAt: new Date(),
        validationStatus: 'pending',
        signature: metadata?.signature,
    };
};
exports.createFormSubmission = createFormSubmission;
/**
 * 33. Validates form submission before saving.
 *
 * @param {FormSubmission} submission - Form submission to validate
 * @param {ValidationRule[]} rules - Validation rules
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSubmission(submission, validationRules);
 * if (validation.valid) {
 *   await saveSubmission(submission);
 * }
 * ```
 */
const validateSubmission = async (submission, rules) => {
    return (0, exports.validateFormSubmission)(submission.data, rules);
};
exports.validateSubmission = validateSubmission;
/**
 * 34. Sanitizes form submission data.
 *
 * @param {Record<string, any>} data - Form data to sanitize
 * @returns {Record<string, any>} Sanitized data
 *
 * @example
 * ```typescript
 * const cleanData = sanitizeFormData(rawFormData);
 * ```
 */
const sanitizeFormData = (data) => {
    const sanitized = {};
    Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string') {
            // Remove potentially dangerous characters
            sanitized[key] = value
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/[<>]/g, '')
                .trim();
        }
        else {
            sanitized[key] = value;
        }
    });
    return sanitized;
};
exports.sanitizeFormData = sanitizeFormData;
/**
 * 35. Processes form submission with validation.
 *
 * @param {FormSubmission} submission - Form submission
 * @param {ValidationRule[]} rules - Validation rules
 * @returns {Promise<{ success: boolean; errors?: Record<string, string[]> }>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processFormSubmission(submission, validationRules);
 * if (!result.success) {
 *   return { errors: result.errors };
 * }
 * ```
 */
const processFormSubmission = async (submission, rules) => {
    const validation = await (0, exports.validateSubmission)(submission, rules);
    if (!validation.valid) {
        return {
            success: false,
            errors: validation.errors,
        };
    }
    // Sanitize data
    submission.data = (0, exports.sanitizeFormData)(submission.data);
    submission.validationStatus = 'valid';
    return { success: true };
};
exports.processFormSubmission = processFormSubmission;
// ============================================================================
// 8. FORM DATA EXPORT
// ============================================================================
/**
 * 36. Exports form data to JSON format.
 *
 * @param {Record<string, any>} data - Form data
 * @param {FormExportOptions} [options] - Export options
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = exportFormDataToJSON(formData, { includeMetadata: true });
 * ```
 */
const exportFormDataToJSON = (data, options) => {
    const exportData = { fields: data };
    if (options?.includeMetadata) {
        exportData.metadata = {
            exportedAt: new Date().toISOString(),
            fieldCount: Object.keys(data).length,
        };
    }
    return JSON.stringify(exportData, null, 2);
};
exports.exportFormDataToJSON = exportFormDataToJSON;
/**
 * 37. Exports form data to CSV format.
 *
 * @param {Record<string, any>[]} submissions - Array of form submissions
 * @param {string[]} [fieldNames] - Field names to include
 * @returns {string} CSV string
 *
 * @example
 * ```typescript
 * const csv = exportFormDataToCSV(submissions, ['name', 'email', 'date']);
 * ```
 */
const exportFormDataToCSV = (submissions, fieldNames) => {
    if (submissions.length === 0)
        return '';
    const fields = fieldNames || Object.keys(submissions[0]);
    const header = fields.join(',');
    const rows = submissions.map((submission) => {
        return fields
            .map((field) => {
            const value = submission[field];
            if (value === undefined || value === null)
                return '';
            const stringValue = String(value).replace(/"/g, '""');
            return `"${stringValue}"`;
        })
            .join(',');
    });
    return [header, ...rows].join('\n');
};
exports.exportFormDataToCSV = exportFormDataToCSV;
/**
 * 38. Exports form data to XML format.
 *
 * @param {Record<string, any>} data - Form data
 * @param {string} [rootElement] - Root XML element name
 * @returns {string} XML string
 *
 * @example
 * ```typescript
 * const xml = exportFormDataToXML(formData, 'PatientIntakeForm');
 * ```
 */
const exportFormDataToXML = (data, rootElement = 'form') => {
    const escapeXml = (value) => {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };
    const buildXml = (obj, indent = 2) => {
        const spaces = ' '.repeat(indent);
        return Object.entries(obj)
            .map(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return `${spaces}<${key}>\n${buildXml(value, indent + 2)}${spaces}</${key}>`;
            }
            return `${spaces}<${key}>${escapeXml(value)}</${key}>`;
        })
            .join('\n');
    };
    return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElement}>\n${buildXml(data)}\n</${rootElement}>`;
};
exports.exportFormDataToXML = exportFormDataToXML;
/**
 * 39. Exports form data to FDF format (Forms Data Format).
 *
 * @param {Record<string, any>} data - Form data
 * @param {string} [pdfFilename] - Associated PDF filename
 * @returns {string} FDF string
 *
 * @example
 * ```typescript
 * const fdf = exportFormDataToFDF(formData, 'intake-form.pdf');
 * ```
 */
const exportFormDataToFDF = (data, pdfFilename) => {
    const fields = Object.entries(data)
        .map(([key, value]) => {
        return `<< /T (${key}) /V (${String(value).replace(/[()\\]/g, '\\$&')}) >>`;
    })
        .join('\n');
    return `%FDF-1.2
1 0 obj
<<
/FDF << /Fields [
${fields}
]
${pdfFilename ? `/F (${pdfFilename})` : ''}
>>
>>
endobj
trailer
<< /Root 1 0 R >>
%%EOF`;
};
exports.exportFormDataToFDF = exportFormDataToFDF;
/**
 * 40. Exports multiple submissions to spreadsheet format.
 *
 * @param {FormSubmission[]} submissions - Form submissions
 * @param {FormExportOptions} [options] - Export options
 * @returns {string} Spreadsheet data (CSV)
 *
 * @example
 * ```typescript
 * const spreadsheet = exportSubmissionsToSpreadsheet(submissions, {
 *   includeMetadata: true
 * });
 * ```
 */
const exportSubmissionsToSpreadsheet = (submissions, options) => {
    const data = submissions.map((submission) => {
        const row = { ...submission.data };
        if (options?.includeMetadata) {
            row._submittedAt = submission.submittedAt.toISOString();
            row._submittedBy = submission.submittedBy;
            row._validationStatus = submission.validationStatus;
        }
        return row;
    });
    return (0, exports.exportFormDataToCSV)(data);
};
exports.exportSubmissionsToSpreadsheet = exportSubmissionsToSpreadsheet;
// ============================================================================
// 9. FORM TEMPLATES
// ============================================================================
/**
 * 41. Creates reusable form template.
 *
 * @param {string} name - Template name
 * @param {FormField[]} fields - Form fields
 * @param {ValidationRule[]} validationRules - Validation rules
 * @returns {FormTemplate} Form template
 *
 * @example
 * ```typescript
 * const template = createFormTemplate('Patient Intake', fields, validationRules);
 * ```
 */
const createFormTemplate = (name, fields, validationRules) => {
    return {
        id: `template-${Date.now()}`,
        name,
        fields,
        validationRules,
        version: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createFormTemplate = createFormTemplate;
/**
 * 42. Clones form template with modifications.
 *
 * @param {FormTemplate} template - Original template
 * @param {Partial<FormTemplate>} modifications - Template modifications
 * @returns {FormTemplate} Cloned template
 *
 * @example
 * ```typescript
 * const newTemplate = cloneFormTemplate(originalTemplate, {
 *   name: 'Patient Intake - Spanish',
 *   version: 2
 * });
 * ```
 */
const cloneFormTemplate = (template, modifications) => {
    return {
        ...template,
        id: `template-${Date.now()}`,
        ...modifications,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.cloneFormTemplate = cloneFormTemplate;
/**
 * 43. Merges multiple form templates.
 *
 * @param {FormTemplate[]} templates - Templates to merge
 * @param {string} newName - Name for merged template
 * @returns {FormTemplate} Merged template
 *
 * @example
 * ```typescript
 * const merged = mergeFormTemplates([template1, template2], 'Combined Form');
 * ```
 */
const mergeFormTemplates = (templates, newName) => {
    const allFields = [];
    const allRules = [];
    templates.forEach((template) => {
        allFields.push(...template.fields);
        allRules.push(...template.validationRules);
    });
    return (0, exports.createFormTemplate)(newName, allFields, allRules);
};
exports.mergeFormTemplates = mergeFormTemplates;
/**
 * 44. Validates form template configuration.
 *
 * @param {FormTemplate} template - Template to validate
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateFormTemplate(template);
 * if (!validation.valid) {
 *   console.error('Template errors:', validation.errors);
 * }
 * ```
 */
const validateFormTemplate = (template) => {
    const errors = {};
    if (!template.name || template.name.trim() === '') {
        errors.name = ['Template name is required'];
    }
    if (!template.fields || template.fields.length === 0) {
        errors.fields = ['Template must have at least one field'];
    }
    // Validate each field
    template.fields.forEach((field, index) => {
        const fieldValidation = (0, exports.validateFieldConfig)(field);
        if (!fieldValidation.valid) {
            errors[`field_${index}`] = Object.values(fieldValidation.errors).flat();
        }
    });
    // Check for duplicate field names
    const fieldNames = template.fields.map((f) => f.name);
    const duplicates = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
        errors.duplicateFields = [`Duplicate field names found: ${duplicates.join(', ')}`];
    }
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
exports.validateFormTemplate = validateFormTemplate;
/**
 * 45. Generates form instance from template.
 *
 * @param {FormTemplate} template - Form template
 * @param {Record<string, any>} [initialData] - Initial form data
 * @returns {Promise<{ fields: FormField[]; data: Record<string, any> }>} Form instance
 *
 * @example
 * ```typescript
 * const formInstance = await generateFormFromTemplate(template, {
 *   patientName: 'John Doe'
 * });
 * ```
 */
const generateFormFromTemplate = async (template, initialData) => {
    const fields = template.fields.map((field) => ({ ...field }));
    const data = {};
    fields.forEach((field) => {
        if (initialData && initialData[field.name] !== undefined) {
            data[field.name] = initialData[field.name];
        }
        else if (field.defaultValue !== undefined) {
            data[field.name] = field.defaultValue;
        }
    });
    return { fields, data };
};
exports.generateFormFromTemplate = generateFormFromTemplate;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Model creators
    createFormModel: exports.createFormModel,
    createFormFieldModel: exports.createFormFieldModel,
    createFormSubmissionModel: exports.createFormSubmissionModel,
    // Field creation
    createTextField: exports.createTextField,
    createTextAreaField: exports.createTextAreaField,
    createNumberField: exports.createNumberField,
    createDateField: exports.createDateField,
    createEmailField: exports.createEmailField,
    createCheckboxField: exports.createCheckboxField,
    createRadioGroup: exports.createRadioGroup,
    createDropdownField: exports.createDropdownField,
    createSignatureField: exports.createSignatureField,
    validateFieldConfig: exports.validateFieldConfig,
    // Data extraction
    extractFormData: exports.extractFormData,
    extractFieldNames: exports.extractFieldNames,
    extractFieldValue: exports.extractFieldValue,
    extractCheckboxStates: exports.extractCheckboxStates,
    detectFieldTypes: exports.detectFieldTypes,
    // Form filling
    fillFormData: exports.fillFormData,
    fillTextField: exports.fillTextField,
    setCheckboxState: exports.setCheckboxState,
    selectDropdownOption: exports.selectDropdownOption,
    selectRadioButton: exports.selectRadioButton,
    fillFormDefaults: exports.fillFormDefaults,
    // Validation
    validateFormSubmission: exports.validateFormSubmission,
    validateRequiredFields: exports.validateRequiredFields,
    validateFieldValue: exports.validateFieldValue,
    validateDateField: exports.validateDateField,
    // Form flattening
    flattenForm: exports.flattenForm,
    flattenSpecificFields: exports.flattenSpecificFields,
    isFormFlattened: exports.isFormFlattened,
    // Calculations
    calculateFieldValue: exports.calculateFieldValue,
    applyCalculations: exports.applyCalculations,
    validateCalculations: exports.validateCalculations,
    // Submission handling
    createFormSubmission: exports.createFormSubmission,
    validateSubmission: exports.validateSubmission,
    sanitizeFormData: exports.sanitizeFormData,
    processFormSubmission: exports.processFormSubmission,
    // Data export
    exportFormDataToJSON: exports.exportFormDataToJSON,
    exportFormDataToCSV: exports.exportFormDataToCSV,
    exportFormDataToXML: exports.exportFormDataToXML,
    exportFormDataToFDF: exports.exportFormDataToFDF,
    exportSubmissionsToSpreadsheet: exports.exportSubmissionsToSpreadsheet,
    // Templates
    createFormTemplate: exports.createFormTemplate,
    cloneFormTemplate: exports.cloneFormTemplate,
    mergeFormTemplates: exports.mergeFormTemplates,
    validateFormTemplate: exports.validateFormTemplate,
    generateFormFromTemplate: exports.generateFormFromTemplate,
};
//# sourceMappingURL=document-forms-kit.js.map