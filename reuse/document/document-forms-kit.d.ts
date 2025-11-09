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
import { Sequelize } from 'sequelize';
/**
 * Form field type enumeration
 */
export type FormFieldType = 'text' | 'textarea' | 'number' | 'email' | 'date' | 'checkbox' | 'radio' | 'dropdown' | 'signature' | 'button';
/**
 * Form field alignment options
 */
export type FieldAlignment = 'left' | 'center' | 'right';
/**
 * Form field configuration
 */
export interface FormFieldConfig {
    name: string;
    type: FormFieldType;
    label?: string;
    value?: any;
    defaultValue?: any;
    placeholder?: string;
    required?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    maxLength?: number;
    minLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[] | {
        label: string;
        value: any;
    }[];
    multiSelect?: boolean;
    rows?: number;
    cols?: number;
    alignment?: FieldAlignment;
    fontSize?: number;
    fontColor?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    tooltip?: string;
    customValidation?: (value: any) => boolean | string;
}
/**
 * Form field position and dimensions
 */
export interface FieldPosition {
    x: number;
    y: number;
    width: number;
    height: number;
    page?: number;
}
/**
 * Complete form field definition
 */
export interface FormField extends FormFieldConfig {
    id: string;
    position: FieldPosition;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Form validation rule
 */
export interface ValidationRule {
    field: string;
    rule: 'required' | 'email' | 'phone' | 'date' | 'number' | 'pattern' | 'custom';
    message: string;
    params?: any;
    validator?: (value: any, formData?: Record<string, any>) => boolean;
}
/**
 * Form validation result
 */
export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string[]>;
    warnings?: Record<string, string[]>;
}
/**
 * Form data extraction result
 */
export interface FormDataExtraction {
    formId?: string;
    fields: Record<string, any>;
    metadata?: {
        extractedAt: Date;
        pageCount: number;
        hasSignatures: boolean;
        isFlattened: boolean;
    };
}
/**
 * Form filling options
 */
export interface FormFillingOptions {
    flatten?: boolean;
    preserveSignatures?: boolean;
    appearance?: {
        font?: string;
        fontSize?: number;
        color?: string;
        alignment?: FieldAlignment;
    };
    validation?: boolean;
}
/**
 * Form calculation rule
 */
export interface CalculationRule {
    targetField: string;
    formula: string;
    dependencies: string[];
    precision?: number;
}
/**
 * Form submission data
 */
export interface FormSubmission {
    formId: string;
    submittedBy?: string;
    data: Record<string, any>;
    attachments?: string[];
    ipAddress?: string;
    userAgent?: string;
    submittedAt: Date;
    validationStatus: 'valid' | 'invalid' | 'pending';
    signature?: string;
}
/**
 * Form template configuration
 */
export interface FormTemplate {
    id: string;
    name: string;
    description?: string;
    category?: string;
    fields: FormField[];
    validationRules: ValidationRule[];
    calculations?: CalculationRule[];
    pdfTemplate?: Buffer;
    version: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Dropdown field options
 */
export interface DropdownOptions {
    options: Array<{
        label: string;
        value: any;
        selected?: boolean;
    }>;
    allowCustom?: boolean;
    searchable?: boolean;
    multiSelect?: boolean;
    placeholder?: string;
}
/**
 * Checkbox field configuration
 */
export interface CheckboxConfig {
    label: string;
    checked?: boolean;
    value?: any;
    size?: number;
    style?: 'check' | 'cross' | 'circle' | 'square';
}
/**
 * Radio group configuration
 */
export interface RadioGroupConfig {
    name: string;
    options: Array<{
        label: string;
        value: any;
        selected?: boolean;
    }>;
    layout?: 'horizontal' | 'vertical';
    spacing?: number;
}
/**
 * Form export format
 */
export type FormExportFormat = 'json' | 'xml' | 'csv' | 'pdf' | 'fdf' | 'xfdf';
/**
 * Form export options
 */
export interface FormExportOptions {
    format: FormExportFormat;
    includeMetadata?: boolean;
    includeEmpty?: boolean;
    fieldMapping?: Record<string, string>;
}
/**
 * Form model attributes
 */
export interface FormAttributes {
    id: string;
    name: string;
    description?: string;
    category?: string;
    templateId?: string;
    version: number;
    isActive: boolean;
    isPdfForm: boolean;
    pdfPath?: string;
    fieldCount: number;
    submissionCount: number;
    createdBy?: string;
    lastModifiedBy?: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Form field model attributes
 */
export interface FormFieldAttributes {
    id: string;
    formId: string;
    name: string;
    type: string;
    label?: string;
    defaultValue?: string;
    placeholder?: string;
    required: boolean;
    readonly: boolean;
    disabled: boolean;
    hidden: boolean;
    position: Record<string, any>;
    validation?: Record<string, any>;
    options?: Record<string, any>;
    calculation?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Form submission model attributes
 */
export interface FormSubmissionAttributes {
    id: string;
    formId: string;
    submittedBy?: string;
    data: Record<string, any>;
    attachments?: string[];
    ipAddress?: string;
    userAgent?: string;
    validationStatus: string;
    validationErrors?: Record<string, any>;
    signature?: string;
    submittedAt: Date;
    processedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
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
export declare const createFormModel: (sequelize: Sequelize) => any;
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
export declare const createFormFieldModel: (sequelize: Sequelize) => any;
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
export declare const createFormSubmissionModel: (sequelize: Sequelize) => any;
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
export declare const createTextField: (name: string, position: FieldPosition, options?: Partial<FormFieldConfig>) => FormField;
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
export declare const createTextAreaField: (name: string, position: FieldPosition, options?: Partial<FormFieldConfig>) => FormField;
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
export declare const createNumberField: (name: string, position: FieldPosition, options?: Partial<FormFieldConfig>) => FormField;
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
export declare const createDateField: (name: string, position: FieldPosition, options?: Partial<FormFieldConfig>) => FormField;
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
export declare const createEmailField: (name: string, position: FieldPosition, options?: Partial<FormFieldConfig>) => FormField;
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
export declare const createCheckboxField: (name: string, position: FieldPosition, config: CheckboxConfig) => FormField;
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
export declare const createRadioGroup: (name: string, startPosition: FieldPosition, config: RadioGroupConfig) => FormField[];
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
export declare const createDropdownField: (name: string, position: FieldPosition, options: DropdownOptions) => FormField;
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
export declare const createSignatureField: (name: string, position: FieldPosition, options?: Partial<FormFieldConfig>) => FormField;
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
export declare const validateFieldConfig: (field: FormField) => ValidationResult;
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
export declare const extractFormData: (pdfBuffer: Buffer) => Promise<FormDataExtraction>;
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
export declare const extractFieldNames: (pdfBuffer: Buffer) => Promise<string[]>;
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
export declare const extractFieldValue: (pdfBuffer: Buffer, fieldName: string) => Promise<any>;
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
export declare const extractCheckboxStates: (pdfBuffer: Buffer) => Promise<Record<string, boolean>>;
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
export declare const detectFieldTypes: (pdfBuffer: Buffer) => Promise<Record<string, FormFieldType>>;
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
export declare const fillFormData: (pdfBuffer: Buffer, data: Record<string, any>, options?: FormFillingOptions) => Promise<Buffer>;
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
export declare const fillTextField: (pdfBuffer: Buffer, fieldName: string, value: string) => Promise<Buffer>;
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
export declare const setCheckboxState: (pdfBuffer: Buffer, fieldName: string, checked: boolean) => Promise<Buffer>;
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
export declare const selectDropdownOption: (pdfBuffer: Buffer, fieldName: string, value: string) => Promise<Buffer>;
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
export declare const selectRadioButton: (pdfBuffer: Buffer, groupName: string, value: string) => Promise<Buffer>;
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
export declare const fillFormDefaults: (pdfBuffer: Buffer, fields: FormField[]) => Promise<Buffer>;
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
export declare const validateFormSubmission: (data: Record<string, any>, rules: ValidationRule[]) => ValidationResult;
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
export declare const validateRequiredFields: (data: Record<string, any>, requiredFields: string[]) => ValidationResult;
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
export declare const validateFieldValue: (value: any, field: FormFieldConfig) => ValidationResult;
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
export declare const validateDateField: (dateValue: string, constraints?: {
    minDate?: string;
    maxDate?: string;
}) => ValidationResult;
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
export declare const flattenForm: (pdfBuffer: Buffer) => Promise<Buffer>;
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
export declare const flattenSpecificFields: (pdfBuffer: Buffer, fieldNames: string[]) => Promise<Buffer>;
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
export declare const isFormFlattened: (pdfBuffer: Buffer) => Promise<boolean>;
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
export declare const calculateFieldValue: (formula: string, formData: Record<string, any>) => any;
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
export declare const applyCalculations: (formData: Record<string, any>, rules: CalculationRule[]) => Record<string, any>;
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
export declare const validateCalculations: (rules: CalculationRule[], availableFields: string[]) => ValidationResult;
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
export declare const createFormSubmission: (formId: string, data: Record<string, any>, metadata?: Partial<FormSubmission>) => FormSubmission;
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
export declare const validateSubmission: (submission: FormSubmission, rules: ValidationRule[]) => Promise<ValidationResult>;
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
export declare const sanitizeFormData: (data: Record<string, any>) => Record<string, any>;
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
export declare const processFormSubmission: (submission: FormSubmission, rules: ValidationRule[]) => Promise<{
    success: boolean;
    errors?: Record<string, string[]>;
}>;
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
export declare const exportFormDataToJSON: (data: Record<string, any>, options?: FormExportOptions) => string;
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
export declare const exportFormDataToCSV: (submissions: Record<string, any>[], fieldNames?: string[]) => string;
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
export declare const exportFormDataToXML: (data: Record<string, any>, rootElement?: string) => string;
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
export declare const exportFormDataToFDF: (data: Record<string, any>, pdfFilename?: string) => string;
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
export declare const exportSubmissionsToSpreadsheet: (submissions: FormSubmission[], options?: FormExportOptions) => string;
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
export declare const createFormTemplate: (name: string, fields: FormField[], validationRules: ValidationRule[]) => FormTemplate;
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
export declare const cloneFormTemplate: (template: FormTemplate, modifications?: Partial<FormTemplate>) => FormTemplate;
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
export declare const mergeFormTemplates: (templates: FormTemplate[], newName: string) => FormTemplate;
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
export declare const validateFormTemplate: (template: FormTemplate) => ValidationResult;
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
export declare const generateFormFromTemplate: (template: FormTemplate, initialData?: Record<string, any>) => Promise<{
    fields: FormField[];
    data: Record<string, any>;
}>;
declare const _default: {
    createFormModel: (sequelize: Sequelize) => any;
    createFormFieldModel: (sequelize: Sequelize) => any;
    createFormSubmissionModel: (sequelize: Sequelize) => any;
    createTextField: (name: string, position: FieldPosition, options?: Partial<FormFieldConfig>) => FormField;
    createTextAreaField: (name: string, position: FieldPosition, options?: Partial<FormFieldConfig>) => FormField;
    createNumberField: (name: string, position: FieldPosition, options?: Partial<FormFieldConfig>) => FormField;
    createDateField: (name: string, position: FieldPosition, options?: Partial<FormFieldConfig>) => FormField;
    createEmailField: (name: string, position: FieldPosition, options?: Partial<FormFieldConfig>) => FormField;
    createCheckboxField: (name: string, position: FieldPosition, config: CheckboxConfig) => FormField;
    createRadioGroup: (name: string, startPosition: FieldPosition, config: RadioGroupConfig) => FormField[];
    createDropdownField: (name: string, position: FieldPosition, options: DropdownOptions) => FormField;
    createSignatureField: (name: string, position: FieldPosition, options?: Partial<FormFieldConfig>) => FormField;
    validateFieldConfig: (field: FormField) => ValidationResult;
    extractFormData: (pdfBuffer: Buffer) => Promise<FormDataExtraction>;
    extractFieldNames: (pdfBuffer: Buffer) => Promise<string[]>;
    extractFieldValue: (pdfBuffer: Buffer, fieldName: string) => Promise<any>;
    extractCheckboxStates: (pdfBuffer: Buffer) => Promise<Record<string, boolean>>;
    detectFieldTypes: (pdfBuffer: Buffer) => Promise<Record<string, FormFieldType>>;
    fillFormData: (pdfBuffer: Buffer, data: Record<string, any>, options?: FormFillingOptions) => Promise<Buffer>;
    fillTextField: (pdfBuffer: Buffer, fieldName: string, value: string) => Promise<Buffer>;
    setCheckboxState: (pdfBuffer: Buffer, fieldName: string, checked: boolean) => Promise<Buffer>;
    selectDropdownOption: (pdfBuffer: Buffer, fieldName: string, value: string) => Promise<Buffer>;
    selectRadioButton: (pdfBuffer: Buffer, groupName: string, value: string) => Promise<Buffer>;
    fillFormDefaults: (pdfBuffer: Buffer, fields: FormField[]) => Promise<Buffer>;
    validateFormSubmission: (data: Record<string, any>, rules: ValidationRule[]) => ValidationResult;
    validateRequiredFields: (data: Record<string, any>, requiredFields: string[]) => ValidationResult;
    validateFieldValue: (value: any, field: FormFieldConfig) => ValidationResult;
    validateDateField: (dateValue: string, constraints?: {
        minDate?: string;
        maxDate?: string;
    }) => ValidationResult;
    flattenForm: (pdfBuffer: Buffer) => Promise<Buffer>;
    flattenSpecificFields: (pdfBuffer: Buffer, fieldNames: string[]) => Promise<Buffer>;
    isFormFlattened: (pdfBuffer: Buffer) => Promise<boolean>;
    calculateFieldValue: (formula: string, formData: Record<string, any>) => any;
    applyCalculations: (formData: Record<string, any>, rules: CalculationRule[]) => Record<string, any>;
    validateCalculations: (rules: CalculationRule[], availableFields: string[]) => ValidationResult;
    createFormSubmission: (formId: string, data: Record<string, any>, metadata?: Partial<FormSubmission>) => FormSubmission;
    validateSubmission: (submission: FormSubmission, rules: ValidationRule[]) => Promise<ValidationResult>;
    sanitizeFormData: (data: Record<string, any>) => Record<string, any>;
    processFormSubmission: (submission: FormSubmission, rules: ValidationRule[]) => Promise<{
        success: boolean;
        errors?: Record<string, string[]>;
    }>;
    exportFormDataToJSON: (data: Record<string, any>, options?: FormExportOptions) => string;
    exportFormDataToCSV: (submissions: Record<string, any>[], fieldNames?: string[]) => string;
    exportFormDataToXML: (data: Record<string, any>, rootElement?: string) => string;
    exportFormDataToFDF: (data: Record<string, any>, pdfFilename?: string) => string;
    exportSubmissionsToSpreadsheet: (submissions: FormSubmission[], options?: FormExportOptions) => string;
    createFormTemplate: (name: string, fields: FormField[], validationRules: ValidationRule[]) => FormTemplate;
    cloneFormTemplate: (template: FormTemplate, modifications?: Partial<FormTemplate>) => FormTemplate;
    mergeFormTemplates: (templates: FormTemplate[], newName: string) => FormTemplate;
    validateFormTemplate: (template: FormTemplate) => ValidationResult;
    generateFormFromTemplate: (template: FormTemplate, initialData?: Record<string, any>) => Promise<{
        fields: FormField[];
        data: Record<string, any>;
    }>;
};
export default _default;
//# sourceMappingURL=document-forms-kit.d.ts.map