/**
 * LOC: DOCADVFORMS001
 * File: /reuse/document/composites/document-advanced-forms-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - mathjs
 *   - ajv
 *   - react
 *   - lodash
 *   - ../document-forms-advanced-kit
 *   - ../document-forms-kit
 *   - ../document-validation-kit
 *   - ../document-templates-kit
 *   - ../document-pdf-advanced-kit
 *
 * DOWNSTREAM (imported by):
 *   - Dynamic form builder services
 *   - Healthcare intake systems
 *   - Patient registration modules
 *   - Interactive form engines
 *   - Medical questionnaire handlers
 *   - Clinical data collection dashboards
 */
/**
 * File: /reuse/document/composites/document-advanced-forms-composite.ts
 * Locator: WC-ADVANCED-FORMS-COMPOSITE-001
 * Purpose: Comprehensive Advanced Forms Composite - Production-ready interactive forms, calculations, validation, and dynamic fields
 *
 * Upstream: Composed from document-forms-advanced-kit, document-forms-kit, document-validation-kit, document-templates-kit, document-pdf-advanced-kit
 * Downstream: ../backend/*, Form builder services, Healthcare intake systems, Registration modules, Questionnaire handlers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, mathjs 11.x, ajv 8.x, React 18.x
 * Exports: 48 utility functions for dynamic form builder, field dependencies, calculations, validation, conditional logic, multi-step workflows
 *
 * LLM Context: Enterprise-grade advanced forms composite for White Cross healthcare platform.
 * Provides comprehensive dynamic form capabilities including runtime form builder, complex field dependencies,
 * formula-based calculations (medical scoring, BMI, risk assessment), advanced validation rules with medical data
 * validation (ICD-10, CPT, NPI codes), conditional field visibility, multi-step wizards, form versioning, A/B testing,
 * conversion analytics, React hooks integration, FHIR data binding, clinical decision support, patient risk scoring,
 * and real-time field validation. Exceeds Adobe Forms and JotForm capabilities with healthcare-specific features.
 * Composes functions from forms-advanced, forms, validation, templates, and PDF kits to provide unified form
 * operations for patient intake, medical questionnaires, consent forms, insurance verification, and clinical workflows.
 */
import { Model } from 'sequelize-typescript';
/**
 * Form field types
 */
export declare enum FieldType {
    TEXT = "TEXT",
    TEXTAREA = "TEXTAREA",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    NUMBER = "NUMBER",
    DATE = "DATE",
    TIME = "TIME",
    DATETIME = "DATETIME",
    SELECT = "SELECT",
    MULTISELECT = "MULTISELECT",
    RADIO = "RADIO",
    CHECKBOX = "CHECKBOX",
    CHECKBOXGROUP = "CHECKBOXGROUP",
    FILE = "FILE",
    SIGNATURE = "SIGNATURE",
    RATING = "RATING",
    SLIDER = "SLIDER",
    CURRENCY = "CURRENCY",
    SSN = "SSN",
    ICD10 = "ICD10",
    CPT = "CPT",
    NPI = "NPI",
    CALCULATED = "CALCULATED",
    HIDDEN = "HIDDEN"
}
/**
 * Validation rule types
 */
export declare enum ValidationType {
    REQUIRED = "REQUIRED",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    URL = "URL",
    MIN = "MIN",
    MAX = "MAX",
    MIN_LENGTH = "MIN_LENGTH",
    MAX_LENGTH = "MAX_LENGTH",
    PATTERN = "PATTERN",
    CUSTOM = "CUSTOM",
    DATE_RANGE = "DATE_RANGE",
    AGE_RANGE = "AGE_RANGE",
    MEDICAL_CODE = "MEDICAL_CODE"
}
/**
 * Conditional operator types
 */
export declare enum ConditionalOperator {
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    CONTAINS = "CONTAINS",
    GREATER_THAN = "GREATER_THAN",
    LESS_THAN = "LESS_THAN",
    IS_EMPTY = "IS_EMPTY",
    IS_NOT_EMPTY = "IS_NOT_EMPTY",
    IN = "IN",
    NOT_IN = "NOT_IN"
}
/**
 * Form status
 */
export declare enum FormStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED",
    DEPRECATED = "DEPRECATED"
}
/**
 * Form submission status
 */
export declare enum SubmissionStatus {
    IN_PROGRESS = "IN_PROGRESS",
    SUBMITTED = "SUBMITTED",
    VALIDATED = "VALIDATED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED"
}
/**
 * Field dependency configuration
 */
export interface FieldDependency {
    sourceFieldId: string;
    operator: ConditionalOperator;
    value: any;
    action: 'show' | 'hide' | 'enable' | 'disable' | 'require';
}
/**
 * Field validation rule
 */
export interface ValidationRule {
    type: ValidationType;
    value?: any;
    message: string;
    condition?: FieldDependency;
}
/**
 * Calculation formula
 */
export interface CalculationFormula {
    expression: string;
    variables: Record<string, string>;
    format?: 'number' | 'currency' | 'percentage';
    precision?: number;
}
/**
 * Form field configuration
 */
export interface FormField {
    id: string;
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    defaultValue?: any;
    required: boolean;
    validation: ValidationRule[];
    dependencies: FieldDependency[];
    calculation?: CalculationFormula;
    options?: Array<{
        label: string;
        value: any;
    }>;
    helpText?: string;
    metadata?: Record<string, any>;
}
/**
 * Form section configuration
 */
export interface FormSection {
    id: string;
    title: string;
    description?: string;
    fields: FormField[];
    order: number;
    conditional?: FieldDependency;
}
/**
 * Multi-step form configuration
 */
export interface MultiStepForm {
    id: string;
    name: string;
    description?: string;
    sections: FormSection[];
    progressBar: boolean;
    allowBackNavigation: boolean;
    saveProgress: boolean;
}
/**
 * Form submission data
 */
export interface FormSubmission {
    id: string;
    formId: string;
    userId?: string;
    status: SubmissionStatus;
    data: Record<string, any>;
    validationErrors?: ValidationError[];
    calculatedFields?: Record<string, any>;
    submittedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Validation error
 */
export interface ValidationError {
    fieldId: string;
    fieldName: string;
    rule: ValidationType;
    message: string;
    value?: any;
}
/**
 * Form analytics data
 */
export interface FormAnalytics {
    formId: string;
    totalViews: number;
    totalSubmissions: number;
    completionRate: number;
    averageTime: number;
    abandonmentRate: number;
    fieldAnalytics: Record<string, FieldAnalytics>;
}
/**
 * Field-level analytics
 */
export interface FieldAnalytics {
    fieldId: string;
    totalInteractions: number;
    validationErrors: number;
    averageTimeSpent: number;
    mostCommonErrors: string[];
}
/**
 * Dynamic Form Model
 * Stores form definitions and configurations
 */
export declare class DynamicFormModel extends Model {
    id: string;
    name: string;
    description?: string;
    sections: FormSection[];
    status: FormStatus;
    version: number;
    previousVersionId?: string;
    createdBy: string;
    settings?: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * Form Submission Model
 * Stores form submission data
 */
export declare class FormSubmissionModel extends Model {
    id: string;
    formId: string;
    userId?: string;
    status: SubmissionStatus;
    data: Record<string, any>;
    validationErrors?: ValidationError[];
    calculatedFields?: Record<string, any>;
    submittedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Form Analytics Model
 * Stores form analytics and metrics
 */
export declare class FormAnalyticsModel extends Model {
    id: string;
    formId: string;
    totalViews: number;
    totalSubmissions: number;
    completionRate: number;
    averageTime: number;
    abandonmentRate: number;
    fieldAnalytics: Record<string, FieldAnalytics>;
}
/**
 * Creates dynamic form with fields, validations, and dependencies.
 * Supports complex field relationships and conditional logic.
 *
 * @param {string} name - Form name
 * @param {FormSection[]} sections - Form sections with fields
 * @param {string} createdBy - Creator user ID
 * @returns {Promise<any>} Created form
 *
 * @example
 * REST API: POST /api/v1/forms
 * Request:
 * {
 *   "name": "Patient Intake Form",
 *   "sections": [{
 *     "title": "Personal Information",
 *     "fields": [{
 *       "name": "firstName",
 *       "type": "TEXT",
 *       "required": true,
 *       "validation": [{"type": "REQUIRED", "message": "Required"}]
 *     }]
 *   }],
 *   "createdBy": "user123"
 * }
 * Response: 201 Created
 * {
 *   "id": "form_uuid",
 *   "name": "Patient Intake Form",
 *   "status": "DRAFT",
 *   "version": 1
 * }
 */
export declare const createDynamicForm: (name: string, sections: FormSection[], createdBy: string) => Promise<any>;
/**
 * Adds field to existing form with validation and dependencies.
 *
 * @param {string} formId - Form identifier
 * @param {string} sectionId - Section identifier
 * @param {FormField} field - Field configuration
 * @returns {Promise<any>} Updated form
 */
export declare const addFormField: (formId: string, sectionId: string, field: FormField) => Promise<any>;
/**
 * Configures field dependency with conditional logic.
 *
 * @param {string} fieldId - Target field identifier
 * @param {FieldDependency} dependency - Dependency configuration
 * @returns {Promise<any>} Updated field configuration
 */
export declare const configureFieldDependency: (fieldId: string, dependency: FieldDependency) => Promise<any>;
/**
 * Creates calculated field with formula.
 *
 * @param {string} fieldId - Field identifier
 * @param {CalculationFormula} formula - Calculation formula
 * @returns {Promise<any>} Calculated field configuration
 */
export declare const createCalculatedField: (fieldId: string, formula: CalculationFormula) => Promise<any>;
/**
 * Evaluates calculation formula with current form data.
 *
 * Uses safe mathematical expression evaluation without eval() to prevent
 * code injection vulnerabilities. Supports standard mathematical operations,
 * functions (sin, cos, sqrt, etc.), and nested expressions.
 *
 * @param {CalculationFormula} formula - Calculation formula configuration
 * @param {Record<string, any>} formData - Current form data values
 * @returns {any} Calculated value or null if evaluation fails
 *
 * @throws {Error} If formula contains invalid operations or missing variables
 *
 * @example
 * ```typescript
 * // BMI calculation
 * const bmi = evaluateFormula({
 *   expression: 'weight / ((height / 100) ^ 2)',
 *   variables: { weight: 'weightField', height: 'heightField' },
 *   precision: 1
 * }, { weightField: 70, heightField: 175 });
 * // Returns: 22.9
 *
 * // Medical scoring
 * const score = evaluateFormula({
 *   expression: '(systolic - 120) * 0.5 + (diastolic - 80) * 0.3',
 *   variables: { systolic: 'bpSystolic', diastolic: 'bpDiastolic' },
 *   precision: 0
 * }, { bpSystolic: 130, bpDiastolic: 85 });
 * // Returns: 7
 * ```
 */
export declare const evaluateFormula: (formula: CalculationFormula, formData: Record<string, any>) => any;
/**
 * Validates form field against validation rules.
 *
 * @param {FormField} field - Field configuration
 * @param {any} value - Field value
 * @returns {ValidationError[]} Validation errors
 */
export declare const validateFormField: (field: FormField, value: any) => ValidationError[];
/**
 * Validates entire form submission.
 *
 * @param {MultiStepForm} form - Form configuration
 * @param {Record<string, any>} data - Submission data
 * @returns {ValidationError[]} All validation errors
 */
export declare const validateFormSubmission: (form: MultiStepForm, data: Record<string, any>) => ValidationError[];
/**
 * Evaluates field visibility based on dependencies.
 *
 * @param {FormField} field - Field configuration
 * @param {Record<string, any>} formData - Current form data
 * @returns {boolean} Whether field should be visible
 */
export declare const evaluateFieldVisibility: (field: FormField, formData: Record<string, any>) => boolean;
/**
 * Submits form data with validation.
 *
 * @param {string} formId - Form identifier
 * @param {Record<string, any>} data - Form data
 * @param {string} userId - User identifier
 * @returns {Promise<FormSubmission>} Submission result
 */
export declare const submitForm: (formId: string, data: Record<string, any>, userId?: string) => Promise<FormSubmission>;
/**
 * Saves form progress for later completion.
 *
 * @param {string} formId - Form identifier
 * @param {Record<string, any>} data - Partial form data
 * @param {string} userId - User identifier
 * @returns {Promise<any>} Saved progress
 */
export declare const saveFormProgress: (formId: string, data: Record<string, any>, userId: string) => Promise<any>;
/**
 * Retrieves saved form progress.
 *
 * @param {string} formId - Form identifier
 * @param {string} userId - User identifier
 * @returns {Promise<any>} Saved progress data
 */
export declare const getFormProgress: (formId: string, userId: string) => Promise<any>;
/**
 * Calculates form completion percentage.
 *
 * @param {MultiStepForm} form - Form configuration
 * @param {Record<string, any>} data - Current form data
 * @returns {number} Completion percentage (0-100)
 */
export declare const calculateFormCompletion: (form: MultiStepForm, data: Record<string, any>) => number;
/**
 * Tracks form analytics event.
 *
 * @param {string} formId - Form identifier
 * @param {string} event - Event type
 * @param {Record<string, any>} data - Event data
 * @returns {Promise<void>}
 */
export declare const trackFormEvent: (formId: string, event: string, data?: Record<string, any>) => Promise<void>;
/**
 * Retrieves form analytics data.
 *
 * @param {string} formId - Form identifier
 * @returns {Promise<FormAnalytics>} Analytics data
 */
export declare const getFormAnalytics: (formId: string) => Promise<FormAnalytics>;
/**
 * Creates form version for A/B testing.
 *
 * @param {string} formId - Original form identifier
 * @param {string} variantName - Variant name
 * @param {Partial<MultiStepForm>} changes - Form changes
 * @returns {Promise<any>} Variant form
 */
export declare const createFormVariant: (formId: string, variantName: string, changes: Partial<MultiStepForm>) => Promise<any>;
/**
 * Validates medical code (ICD-10, CPT, NPI).
 *
 * @param {string} code - Medical code
 * @param {FieldType} codeType - Code type
 * @returns {Promise<boolean>} Whether code is valid
 */
export declare const validateMedicalCode: (code: string, codeType: FieldType) => Promise<boolean>;
/**
 * Generates form preview HTML.
 *
 * @param {MultiStepForm} form - Form configuration
 * @returns {Promise<string>} HTML preview
 */
export declare const generateFormPreview: (form: MultiStepForm) => Promise<string>;
/**
 * Exports form data to CSV.
 *
 * @param {string} formId - Form identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Buffer>} CSV buffer
 */
export declare const exportFormData: (formId: string, startDate: Date, endDate: Date) => Promise<Buffer>;
/**
 * Clones form with new version.
 *
 * @param {string} formId - Form identifier
 * @param {string} newName - New form name
 * @returns {Promise<any>} Cloned form
 */
export declare const cloneForm: (formId: string, newName: string) => Promise<any>;
/**
 * Archives form and submissions.
 *
 * @param {string} formId - Form identifier
 * @returns {Promise<void>}
 */
export declare const archiveForm: (formId: string) => Promise<void>;
/**
 * Restores archived form.
 *
 * @param {string} formId - Form identifier
 * @returns {Promise<void>}
 */
export declare const restoreForm: (formId: string) => Promise<void>;
/**
 * Publishes form for public access.
 *
 * @param {string} formId - Form identifier
 * @returns {Promise<any>} Published form with public URL
 */
export declare const publishForm: (formId: string) => Promise<any>;
/**
 * Generates form embed code.
 *
 * @param {string} formId - Form identifier
 * @returns {string} Embed HTML code
 */
export declare const generateFormEmbedCode: (formId: string) => string;
/**
 * Configures form notifications.
 *
 * @param {string} formId - Form identifier
 * @param {Record<string, any>} notificationConfig - Notification settings
 * @returns {Promise<void>}
 */
export declare const configureFormNotifications: (formId: string, notificationConfig: Record<string, any>) => Promise<void>;
/**
 * Sets up form webhooks for integrations.
 *
 * @param {string} formId - Form identifier
 * @param {string} webhookUrl - Webhook URL
 * @param {string[]} events - Events to trigger webhook
 * @returns {Promise<any>} Webhook configuration
 */
export declare const setupFormWebhook: (formId: string, webhookUrl: string, events: string[]) => Promise<any>;
/**
 * Validates form schema against JSON Schema.
 *
 * @param {MultiStepForm} form - Form configuration
 * @returns {boolean} Whether schema is valid
 */
export declare const validateFormSchema: (form: MultiStepForm) => boolean;
/**
 * Generates form from template.
 *
 * @param {string} templateId - Template identifier
 * @param {Record<string, any>} customization - Template customization
 * @returns {Promise<any>} Generated form
 */
export declare const generateFormFromTemplate: (templateId: string, customization: Record<string, any>) => Promise<any>;
/**
 * Calculates medical risk score from form data.
 *
 * @param {Record<string, any>} formData - Patient form data
 * @returns {number} Risk score (0-100)
 */
export declare const calculateMedicalRiskScore: (formData: Record<string, any>) => number;
/**
 * Calculates BMI from height and weight fields.
 *
 * @param {number} weightKg - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @returns {number} BMI value
 */
export declare const calculateBMI: (weightKg: number, heightCm: number) => number;
/**
 * Validates age range for form field.
 *
 * @param {Date} dateOfBirth - Date of birth
 * @param {number} minAge - Minimum age
 * @param {number} maxAge - Maximum age
 * @returns {boolean} Whether age is in range
 */
export declare const validateAgeRange: (dateOfBirth: Date, minAge: number, maxAge: number) => boolean;
/**
 * Applies conditional logic to form section.
 *
 * @param {FormSection} section - Form section
 * @param {Record<string, any>} formData - Current form data
 * @returns {boolean} Whether section should be displayed
 */
export declare const evaluateSectionConditional: (section: FormSection, formData: Record<string, any>) => boolean;
/**
 * Generates field validation summary.
 *
 * @param {FormField[]} fields - Form fields
 * @returns {Record<string, any>} Validation summary
 */
export declare const generateValidationSummary: (fields: FormField[]) => Record<string, any>;
/**
 * Processes multi-step form navigation.
 *
 * @param {MultiStepForm} form - Multi-step form
 * @param {number} currentStep - Current step index
 * @param {string} direction - Navigation direction
 * @returns {number} Next step index
 */
export declare const processFormNavigation: (form: MultiStepForm, currentStep: number, direction: "next" | "prev") => number;
/**
 * Retrieves form submission by ID.
 *
 * @param {string} submissionId - Submission identifier
 * @returns {Promise<FormSubmission>} Form submission
 */
export declare const getFormSubmission: (submissionId: string) => Promise<FormSubmission>;
/**
 * Updates form submission status.
 *
 * @param {string} submissionId - Submission identifier
 * @param {SubmissionStatus} status - New status
 * @returns {Promise<void>}
 */
export declare const updateSubmissionStatus: (submissionId: string, status: SubmissionStatus) => Promise<void>;
/**
 * Searches form submissions by criteria.
 *
 * @param {string} formId - Form identifier
 * @param {Record<string, any>} criteria - Search criteria
 * @returns {Promise<FormSubmission[]>} Matching submissions
 */
export declare const searchFormSubmissions: (formId: string, criteria: Record<string, any>) => Promise<FormSubmission[]>;
/**
 * Generates form completion report.
 *
 * @param {string} formId - Form identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any>} Completion report
 */
export declare const generateCompletionReport: (formId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Optimizes form field order for conversion.
 *
 * @param {FormSection} section - Form section
 * @param {Record<string, FieldAnalytics>} analytics - Field analytics
 * @returns {FormSection} Optimized section
 */
export declare const optimizeFieldOrder: (section: FormSection, analytics: Record<string, FieldAnalytics>) => FormSection;
/**
 * Validates FHIR data binding for healthcare forms.
 *
 * @param {Record<string, any>} formData - Form data
 * @param {string} fhirResource - FHIR resource type
 * @returns {Promise<boolean>} Whether binding is valid
 */
export declare const validateFHIRBinding: (formData: Record<string, any>, fhirResource: string) => Promise<boolean>;
/**
 * Generates accessibility report for form.
 *
 * @param {MultiStepForm} form - Form configuration
 * @returns {Promise<any>} Accessibility report
 */
export declare const generateAccessibilityReport: (form: MultiStepForm) => Promise<any>;
/**
 * Sets up form auto-save functionality.
 *
 * @param {string} formId - Form identifier
 * @param {number} intervalSeconds - Auto-save interval
 * @returns {Promise<any>} Auto-save configuration
 */
export declare const setupFormAutoSave: (formId: string, intervalSeconds: number) => Promise<any>;
/**
 * Validates form field cascade logic.
 *
 * @param {FormField[]} fields - Form fields
 * @returns {boolean} Whether cascade logic is valid
 */
export declare const validateCascadeLogic: (fields: FormField[]) => boolean;
/**
 * Generates form PDF from submission.
 *
 * @param {string} submissionId - Submission identifier
 * @returns {Promise<Buffer>} PDF buffer
 */
export declare const generateFormPDF: (submissionId: string) => Promise<Buffer>;
/**
 * Advanced Forms Service
 * Production-ready NestJS service for dynamic form operations
 */
export declare class AdvancedFormsService {
    /**
     * Creates dynamic form
     */
    create(name: string, sections: FormSection[], createdBy: string): Promise<any>;
    /**
     * Validates form submission
     */
    validateSubmission(form: MultiStepForm, data: Record<string, any>): ValidationError[];
}
declare const _default: {
    DynamicFormModel: typeof DynamicFormModel;
    FormSubmissionModel: typeof FormSubmissionModel;
    FormAnalyticsModel: typeof FormAnalyticsModel;
    createDynamicForm: (name: string, sections: FormSection[], createdBy: string) => Promise<any>;
    addFormField: (formId: string, sectionId: string, field: FormField) => Promise<any>;
    configureFieldDependency: (fieldId: string, dependency: FieldDependency) => Promise<any>;
    createCalculatedField: (fieldId: string, formula: CalculationFormula) => Promise<any>;
    evaluateFormula: (formula: CalculationFormula, formData: Record<string, any>) => any;
    validateFormField: (field: FormField, value: any) => ValidationError[];
    validateFormSubmission: (form: MultiStepForm, data: Record<string, any>) => ValidationError[];
    evaluateFieldVisibility: (field: FormField, formData: Record<string, any>) => boolean;
    submitForm: (formId: string, data: Record<string, any>, userId?: string) => Promise<FormSubmission>;
    saveFormProgress: (formId: string, data: Record<string, any>, userId: string) => Promise<any>;
    getFormProgress: (formId: string, userId: string) => Promise<any>;
    calculateFormCompletion: (form: MultiStepForm, data: Record<string, any>) => number;
    trackFormEvent: (formId: string, event: string, data?: Record<string, any>) => Promise<void>;
    getFormAnalytics: (formId: string) => Promise<FormAnalytics>;
    createFormVariant: (formId: string, variantName: string, changes: Partial<MultiStepForm>) => Promise<any>;
    validateMedicalCode: (code: string, codeType: FieldType) => Promise<boolean>;
    generateFormPreview: (form: MultiStepForm) => Promise<string>;
    exportFormData: (formId: string, startDate: Date, endDate: Date) => Promise<Buffer>;
    cloneForm: (formId: string, newName: string) => Promise<any>;
    archiveForm: (formId: string) => Promise<void>;
    restoreForm: (formId: string) => Promise<void>;
    publishForm: (formId: string) => Promise<any>;
    generateFormEmbedCode: (formId: string) => string;
    configureFormNotifications: (formId: string, notificationConfig: Record<string, any>) => Promise<void>;
    setupFormWebhook: (formId: string, webhookUrl: string, events: string[]) => Promise<any>;
    validateFormSchema: (form: MultiStepForm) => boolean;
    generateFormFromTemplate: (templateId: string, customization: Record<string, any>) => Promise<any>;
    calculateMedicalRiskScore: (formData: Record<string, any>) => number;
    calculateBMI: (weightKg: number, heightCm: number) => number;
    validateAgeRange: (dateOfBirth: Date, minAge: number, maxAge: number) => boolean;
    evaluateSectionConditional: (section: FormSection, formData: Record<string, any>) => boolean;
    generateValidationSummary: (fields: FormField[]) => Record<string, any>;
    processFormNavigation: (form: MultiStepForm, currentStep: number, direction: "next" | "prev") => number;
    getFormSubmission: (submissionId: string) => Promise<FormSubmission>;
    updateSubmissionStatus: (submissionId: string, status: SubmissionStatus) => Promise<void>;
    searchFormSubmissions: (formId: string, criteria: Record<string, any>) => Promise<FormSubmission[]>;
    generateCompletionReport: (formId: string, startDate: Date, endDate: Date) => Promise<any>;
    optimizeFieldOrder: (section: FormSection, analytics: Record<string, FieldAnalytics>) => FormSection;
    validateFHIRBinding: (formData: Record<string, any>, fhirResource: string) => Promise<boolean>;
    generateAccessibilityReport: (form: MultiStepForm) => Promise<any>;
    setupFormAutoSave: (formId: string, intervalSeconds: number) => Promise<any>;
    validateCascadeLogic: (fields: FormField[]) => boolean;
    generateFormPDF: (submissionId: string) => Promise<Buffer>;
    AdvancedFormsService: typeof AdvancedFormsService;
};
export default _default;
//# sourceMappingURL=document-advanced-forms-composite.d.ts.map