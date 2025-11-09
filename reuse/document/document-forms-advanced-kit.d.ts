/**
 * LOC: DOC-FORMS-ADV-001
 * File: /reuse/document/document-forms-advanced-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - react (v18.x)
 *   - mathjs (v11.x)
 *   - ajv (v8.x)
 *   - lodash
 *
 * DOWNSTREAM (imported by):
 *   - Form builder controllers
 *   - Dynamic form services
 *   - Healthcare intake systems
 *   - Patient registration modules
 *   - Medical questionnaire handlers
 */
/**
 * File: /reuse/document/document-forms-advanced-kit.ts
 * Locator: WC-UTL-DOCFORMS-ADV-001
 * Purpose: Advanced Dynamic Forms Engine - Dynamic form builder, calculations, dependencies, validation exceeding Adobe Forms
 *
 * Upstream: @nestjs/common, sequelize, react, mathjs, ajv, lodash
 * Downstream: Form controllers, intake services, registration modules, questionnaire handlers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, React 18.x, MathJS 11.x, AJV 8.x
 * Exports: 42 utility functions for dynamic forms, field dependencies, calculations, validation, conditional logic, analytics
 *
 * LLM Context: Production-grade dynamic form builder for White Cross healthcare platform.
 * Provides runtime form creation, complex field dependencies, formula-based calculations,
 * advanced validation rules (including medical data validation), conditional field visibility,
 * multi-step workflows, form versioning, A/B testing, conversion analytics, and React hooks.
 * Exceeds Adobe Forms capabilities with healthcare-specific features like FHIR data binding,
 * CPT/ICD-10 code validation, clinical decision support, and patient risk scoring.
 */
import { Sequelize } from 'sequelize';
/**
 * Form field data types
 */
export type FieldType = 'text' | 'textarea' | 'email' | 'phone' | 'number' | 'date' | 'time' | 'datetime' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'checkboxgroup' | 'file' | 'signature' | 'rating' | 'slider' | 'color' | 'currency' | 'ssn' | 'icd10' | 'cpt' | 'npi' | 'calculated' | 'hidden';
/**
 * Validation rule types
 */
export type ValidationType = 'required' | 'email' | 'phone' | 'url' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'date' | 'age' | 'icd10' | 'cpt' | 'npi' | 'ssn' | 'luhn' | 'async';
/**
 * Calculation operator types
 */
export type CalculationOperator = 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'modulo' | 'abs' | 'round' | 'ceil' | 'floor' | 'min' | 'max' | 'avg' | 'sum' | 'count' | 'if' | 'formula';
/**
 * Dependency action types
 */
export type DependencyAction = 'show' | 'hide' | 'enable' | 'disable' | 'setValue' | 'validate' | 'calculate';
/**
 * Comparison operators for conditions
 */
export type ComparisonOperator = 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'in' | 'notIn' | 'isEmpty' | 'isNotEmpty' | 'matches';
/**
 * Form field definition
 */
export interface FormFieldDefinition {
    id: string;
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    defaultValue?: any;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    hidden?: boolean;
    options?: Array<{
        label: string;
        value: any;
        disabled?: boolean;
    }>;
    validation?: ValidationRule[];
    dependencies?: FieldDependency[];
    calculations?: CalculationRule[];
    conditionalVisibility?: ConditionalRule[];
    metadata?: Record<string, any>;
    helpText?: string;
    gridColumn?: string;
    order?: number;
}
/**
 * Validation rule configuration
 */
export interface ValidationRule {
    type: ValidationType;
    value?: any;
    message?: string;
    async?: boolean;
    validator?: (value: any, formData: Record<string, any>) => boolean | Promise<boolean>;
    params?: Record<string, any>;
}
/**
 * Field dependency configuration
 */
export interface FieldDependency {
    sourceField: string;
    action: DependencyAction;
    condition?: ConditionalRule;
    value?: any;
    debounce?: number;
}
/**
 * Calculation rule for computed fields
 */
export interface CalculationRule {
    operator: CalculationOperator;
    fields?: string[];
    formula?: string;
    constant?: number;
    precision?: number;
    defaultValue?: any;
}
/**
 * Conditional visibility/logic rule
 */
export interface ConditionalRule {
    field: string;
    operator: ComparisonOperator;
    value?: any;
    logicOperator?: 'and' | 'or';
    nested?: ConditionalRule[];
}
/**
 * Form definition
 */
export interface FormDefinition {
    id: string;
    name: string;
    title: string;
    description?: string;
    version: number;
    status: 'draft' | 'active' | 'archived';
    fields: FormFieldDefinition[];
    sections?: FormSection[];
    workflows?: FormWorkflow[];
    settings?: FormSettings;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Form section for multi-step forms
 */
export interface FormSection {
    id: string;
    title: string;
    description?: string;
    fields: string[];
    order: number;
    conditionalVisibility?: ConditionalRule[];
}
/**
 * Form workflow configuration
 */
export interface FormWorkflow {
    id: string;
    type: 'linear' | 'branching' | 'adaptive';
    steps: WorkflowStep[];
    completionCriteria?: ConditionalRule[];
}
/**
 * Workflow step
 */
export interface WorkflowStep {
    id: string;
    sectionId: string;
    order: number;
    nextStep?: string | ((formData: Record<string, any>) => string);
    validationRequired?: boolean;
}
/**
 * Form settings
 */
export interface FormSettings {
    allowSave?: boolean;
    allowDraft?: boolean;
    autoSave?: boolean;
    autoSaveInterval?: number;
    showProgress?: boolean;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    submitOnEnter?: boolean;
    confirmBeforeSubmit?: boolean;
    maxFileSize?: number;
    allowedFileTypes?: string[];
    captcha?: boolean;
    reCaptchaSiteKey?: string;
}
/**
 * Form submission data
 */
export interface FormSubmission {
    id: string;
    formId: string;
    formVersion: number;
    data: Record<string, any>;
    metadata?: Record<string, any>;
    status: 'draft' | 'submitted' | 'processing' | 'completed' | 'rejected';
    userId?: string;
    sessionId?: string;
    startedAt: Date;
    submittedAt?: Date;
    completedAt?: Date;
    ipAddress?: string;
    userAgent?: string;
    validationErrors?: ValidationError[];
}
/**
 * Validation error
 */
export interface ValidationError {
    field: string;
    type: string;
    message: string;
    value?: any;
}
/**
 * Form analytics data
 */
export interface FormAnalytics {
    formId: string;
    totalViews: number;
    totalStarts: number;
    totalSubmissions: number;
    totalCompletions: number;
    conversionRate: number;
    averageCompletionTime: number;
    dropOffPoints: Array<{
        field: string;
        rate: number;
    }>;
    fieldInteractions: Record<string, FieldAnalytics>;
    deviceBreakdown: Record<string, number>;
    timeToFirstInteraction: number;
    periodStart: Date;
    periodEnd: Date;
}
/**
 * Field-level analytics
 */
export interface FieldAnalytics {
    fieldId: string;
    interactions: number;
    errorRate: number;
    averageTimeSpent: number;
    dropOffRate: number;
    commonErrors: Array<{
        error: string;
        count: number;
    }>;
    valueDistribution?: Record<string, number>;
}
/**
 * Form state for React hooks
 */
export interface FormState {
    values: Record<string, any>;
    errors: Record<string, string[]>;
    touched: Record<string, boolean>;
    dirty: Record<string, boolean>;
    isSubmitting: boolean;
    isValidating: boolean;
    submitCount: number;
}
/**
 * Formula evaluation context
 */
export interface FormulaContext {
    fields: Record<string, any>;
    functions: Record<string, Function>;
    constants: Record<string, number>;
}
/**
 * A/B test configuration
 */
export interface FormABTest {
    id: string;
    formId: string;
    name: string;
    variants: Array<{
        id: string;
        name: string;
        weight: number;
        changes: Partial<FormDefinition>;
    }>;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'paused' | 'completed';
    metrics: Record<string, any>;
}
/**
 * FormDefinition model attributes
 */
export interface FormDefinitionAttributes {
    id: string;
    name: string;
    title: string;
    description?: string;
    version: number;
    status: string;
    fields: any;
    sections?: any;
    workflows?: any;
    settings?: any;
    metadata?: any;
    ownerId?: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    archivedAt?: Date;
}
/**
 * FormField model attributes
 */
export interface FormFieldAttributes {
    id: string;
    formId: string;
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    defaultValue?: any;
    required: boolean;
    disabled: boolean;
    readonly: boolean;
    hidden: boolean;
    options?: any;
    validation?: any;
    dependencies?: any;
    calculations?: any;
    conditionalVisibility?: any;
    metadata?: any;
    helpText?: string;
    gridColumn?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * FormSubmission model attributes
 */
export interface FormSubmissionAttributes {
    id: string;
    formId: string;
    formVersion: number;
    data: any;
    metadata?: any;
    status: string;
    userId?: string;
    sessionId?: string;
    startedAt: Date;
    submittedAt?: Date;
    completedAt?: Date;
    ipAddress?: string;
    userAgent?: string;
    validationErrors?: any;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates FormDefinition model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<FormDefinitionAttributes>>} FormDefinition model
 *
 * @example
 * ```typescript
 * const FormDefModel = createFormDefinitionModel(sequelize);
 * const form = await FormDefModel.create({
 *   name: 'patient-intake',
 *   title: 'Patient Intake Form',
 *   version: 1,
 *   status: 'active',
 *   fields: [...]
 * });
 * ```
 */
export declare const createFormDefinitionModel: (sequelize: Sequelize) => any;
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
 *   label: 'Patient Name',
 *   type: 'text',
 *   required: true,
 *   order: 1
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
 *   formVersion: 1,
 *   data: { patientName: 'John Doe' },
 *   status: 'submitted',
 *   startedAt: new Date()
 * });
 * ```
 */
export declare const createFormSubmissionModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates a dynamic form definition programmatically.
 *
 * @template T - Form data type
 * @param {Partial<FormDefinition>} config - Form configuration
 * @returns {FormDefinition} Complete form definition
 *
 * @example
 * ```typescript
 * const form = createFormDefinition({
 *   name: 'patient-intake',
 *   title: 'Patient Intake Form',
 *   fields: [
 *     { id: '1', name: 'firstName', label: 'First Name', type: 'text', required: true },
 *     { id: '2', name: 'dob', label: 'Date of Birth', type: 'date', required: true }
 *   ]
 * });
 * ```
 */
export declare const createFormDefinition: <T = any>(config: Partial<FormDefinition>) => FormDefinition;
/**
 * 2. Adds a field to an existing form definition.
 *
 * @param {FormDefinition} form - Form definition
 * @param {FormFieldDefinition} field - Field to add
 * @param {number} [position] - Insert position (default: end)
 * @returns {FormDefinition} Updated form definition
 *
 * @example
 * ```typescript
 * const updatedForm = addFormField(form, {
 *   id: '3',
 *   name: 'email',
 *   label: 'Email Address',
 *   type: 'email',
 *   required: true,
 *   validation: [{ type: 'email', message: 'Invalid email' }]
 * }, 1);
 * ```
 */
export declare const addFormField: (form: FormDefinition, field: FormFieldDefinition, position?: number) => FormDefinition;
/**
 * 3. Removes a field from a form definition.
 *
 * @param {FormDefinition} form - Form definition
 * @param {string} fieldId - Field ID to remove
 * @returns {FormDefinition} Updated form definition
 *
 * @example
 * ```typescript
 * const updatedForm = removeFormField(form, 'field-id-123');
 * ```
 */
export declare const removeFormField: (form: FormDefinition, fieldId: string) => FormDefinition;
/**
 * 4. Clones a form definition with a new version.
 *
 * @param {FormDefinition} form - Form to clone
 * @param {Partial<FormDefinition>} overrides - Properties to override
 * @returns {FormDefinition} Cloned form definition
 *
 * @example
 * ```typescript
 * const clonedForm = cloneFormDefinition(originalForm, {
 *   name: 'patient-intake-v2',
 *   version: 2
 * });
 * ```
 */
export declare const cloneFormDefinition: (form: FormDefinition, overrides?: Partial<FormDefinition>) => FormDefinition;
/**
 * 5. Creates a multi-section form with workflow.
 *
 * @param {string} name - Form name
 * @param {FormSection[]} sections - Form sections
 * @param {Partial<FormWorkflow>} [workflow] - Workflow configuration
 * @returns {FormDefinition} Multi-section form
 *
 * @example
 * ```typescript
 * const multiStepForm = createMultiSectionForm('patient-registration', [
 *   { id: 's1', title: 'Personal Info', fields: ['firstName', 'lastName'], order: 1 },
 *   { id: 's2', title: 'Medical History', fields: ['allergies', 'medications'], order: 2 }
 * ], {
 *   type: 'linear',
 *   steps: [{ id: 'step1', sectionId: 's1', order: 1 }]
 * });
 * ```
 */
export declare const createMultiSectionForm: (name: string, sections: FormSection[], workflow?: Partial<FormWorkflow>) => FormDefinition;
/**
 * 6. Generates form schema from TypeScript interface.
 *
 * @template T - Interface type
 * @param {Record<string, any>} schemaDefinition - Schema definition
 * @returns {FormFieldDefinition[]} Generated field definitions
 *
 * @example
 * ```typescript
 * interface PatientData {
 *   firstName: string;
 *   age: number;
 *   hasInsurance: boolean;
 * }
 *
 * const fields = generateFormFromSchema<PatientData>({
 *   firstName: { type: 'text', required: true },
 *   age: { type: 'number', min: 0, max: 120 },
 *   hasInsurance: { type: 'checkbox' }
 * });
 * ```
 */
export declare const generateFormFromSchema: <T extends Record<string, any>>(schemaDefinition: Record<keyof T, any>) => FormFieldDefinition[];
/**
 * 7. Merges multiple form definitions into one.
 *
 * @param {FormDefinition[]} forms - Forms to merge
 * @param {string} newName - Name for merged form
 * @returns {FormDefinition} Merged form definition
 *
 * @example
 * ```typescript
 * const mergedForm = mergeFormDefinitions([personalInfoForm, medicalHistoryForm], 'complete-intake');
 * ```
 */
export declare const mergeFormDefinitions: (forms: FormDefinition[], newName: string) => FormDefinition;
/**
 * 8. Creates a field dependency rule.
 *
 * @param {string} sourceField - Source field name
 * @param {string} targetField - Target field name
 * @param {DependencyAction} action - Action to perform
 * @param {ConditionalRule} [condition] - Condition to evaluate
 * @returns {FieldDependency} Dependency configuration
 *
 * @example
 * ```typescript
 * const dependency = createFieldDependency('hasInsurance', 'insuranceProvider', 'show', {
 *   field: 'hasInsurance',
 *   operator: 'equals',
 *   value: true
 * });
 * ```
 */
export declare const createFieldDependency: (sourceField: string, targetField: string, action: DependencyAction, condition?: ConditionalRule) => FieldDependency;
/**
 * 9. Evaluates field dependencies based on form data.
 *
 * @param {FieldDependency[]} dependencies - Dependencies to evaluate
 * @param {Record<string, any>} formData - Current form data
 * @param {string} changedField - Field that changed
 * @returns {Record<string, any>} Dependency results
 *
 * @example
 * ```typescript
 * const results = evaluateFieldDependencies(field.dependencies, formData, 'hasInsurance');
 * // Returns: { show: true, value: null }
 * ```
 */
export declare const evaluateFieldDependencies: (dependencies: FieldDependency[], formData: Record<string, any>, changedField: string) => Record<string, any>;
/**
 * 10. Evaluates a conditional rule.
 *
 * @param {ConditionalRule} rule - Conditional rule
 * @param {Record<string, any>} formData - Form data
 * @returns {boolean} True if condition is met
 *
 * @example
 * ```typescript
 * const isMet = evaluateCondition({
 *   field: 'age',
 *   operator: 'greaterThan',
 *   value: 18
 * }, { age: 25 });
 * // Returns: true
 * ```
 */
export declare const evaluateCondition: (rule: ConditionalRule, formData: Record<string, any>) => boolean;
/**
 * 11. Creates cascading dropdown dependencies.
 *
 * @param {string} parentField - Parent field name
 * @param {string} childField - Child field name
 * @param {Record<string, any[]>} optionsMap - Map of parent values to child options
 * @returns {FieldDependency} Cascading dependency
 *
 * @example
 * ```typescript
 * const cascade = createCascadingDependency('state', 'city', {
 *   'CA': [{ label: 'Los Angeles', value: 'la' }, { label: 'San Francisco', value: 'sf' }],
 *   'NY': [{ label: 'New York', value: 'nyc' }, { label: 'Buffalo', value: 'buf' }]
 * });
 * ```
 */
export declare const createCascadingDependency: (parentField: string, childField: string, optionsMap: Record<string, any[]>) => FieldDependency;
/**
 * 12. Creates dependent field validation.
 *
 * @param {string} sourceField - Source field name
 * @param {string} targetField - Target field to validate
 * @param {(sourceValue: any, targetValue: any) => boolean} validator - Validation function
 * @returns {FieldDependency} Validation dependency
 *
 * @example
 * ```typescript
 * const dep = createDependentValidation('startDate', 'endDate',
 *   (start, end) => new Date(end) > new Date(start)
 * );
 * ```
 */
export declare const createDependentValidation: (sourceField: string, targetField: string, validator: (sourceValue: any, targetValue: any) => boolean) => FieldDependency;
/**
 * 13. Resolves all dependencies for a form.
 *
 * @param {FormDefinition} form - Form definition
 * @param {Record<string, any>} formData - Current form data
 * @param {string} changedField - Field that changed
 * @returns {Record<string, any>} All dependency effects
 *
 * @example
 * ```typescript
 * const effects = resolveAllDependencies(form, formData, 'hasInsurance');
 * // Returns: { insuranceProvider: { show: true }, insuranceId: { show: true } }
 * ```
 */
export declare const resolveAllDependencies: (form: FormDefinition, formData: Record<string, any>, changedField: string) => Record<string, any>;
/**
 * 14. Creates a dependency graph for the form.
 *
 * @param {FormDefinition} form - Form definition
 * @returns {Record<string, string[]>} Dependency graph (field -> dependent fields)
 *
 * @example
 * ```typescript
 * const graph = createDependencyGraph(form);
 * // Returns: { hasInsurance: ['insuranceProvider', 'insuranceId'], age: ['isMinor'] }
 * ```
 */
export declare const createDependencyGraph: (form: FormDefinition) => Record<string, string[]>;
/**
 * 15. Creates a calculation rule for a field.
 *
 * @param {CalculationOperator} operator - Calculation operator
 * @param {string[]} fields - Fields to use in calculation
 * @param {number} [precision] - Decimal precision
 * @returns {CalculationRule} Calculation rule
 *
 * @example
 * ```typescript
 * const bmiCalc = createCalculationRule('formula', ['weight', 'height'], 2);
 * bmiCalc.formula = 'weight / (height * height)';
 * ```
 */
export declare const createCalculationRule: (operator: CalculationOperator, fields: string[], precision?: number) => CalculationRule;
/**
 * 16. Evaluates a calculation rule.
 *
 * @param {CalculationRule} rule - Calculation rule
 * @param {Record<string, any>} formData - Form data
 * @returns {number | null} Calculated value
 *
 * @example
 * ```typescript
 * const result = evaluateCalculation({
 *   operator: 'add',
 *   fields: ['price', 'tax']
 * }, { price: 100, tax: 10 });
 * // Returns: 110
 * ```
 */
export declare const evaluateCalculation: (rule: CalculationRule, formData: Record<string, any>) => number | null;
/**
 * 17. Evaluates a mathematical formula.
 *
 * @param {string} formula - Formula string (e.g., "a + b * 2")
 * @param {Record<string, any>} context - Variable context
 * @returns {number} Calculated result
 *
 * @example
 * ```typescript
 * const result = evaluateFormula('bmi = weight / (height * height)', {
 *   weight: 70,
 *   height: 1.75
 * });
 * // Returns: 22.86
 * ```
 */
export declare const evaluateFormula: (formula: string, context: Record<string, any>) => number;
/**
 * 18. Creates a BMI (Body Mass Index) calculator.
 *
 * @param {string} weightField - Weight field name
 * @param {string} heightField - Height field name
 * @param {'kg/m' | 'lb/in'} [units] - Unit system
 * @returns {CalculationRule} BMI calculation rule
 *
 * @example
 * ```typescript
 * const bmiRule = createBMICalculator('weight', 'height', 'kg/m');
 * const bmi = evaluateCalculation(bmiRule, { weight: 70, height: 1.75 });
 * // Returns: 22.86
 * ```
 */
export declare const createBMICalculator: (weightField: string, heightField: string, units?: "kg/m" | "lb/in") => CalculationRule;
/**
 * 19. Creates age calculator from date of birth.
 *
 * @param {string} dobField - Date of birth field name
 * @returns {CalculationRule} Age calculation rule
 *
 * @example
 * ```typescript
 * const ageRule = createAgeCalculator('dateOfBirth');
 * ```
 */
export declare const createAgeCalculator: (dobField: string) => CalculationRule;
/**
 * 20. Creates conditional calculation (IF-THEN).
 *
 * @param {ConditionalRule} condition - Condition to evaluate
 * @param {CalculationRule} thenCalc - Calculation if true
 * @param {CalculationRule} elseCalc - Calculation if false
 * @returns {CalculationRule} Conditional calculation
 *
 * @example
 * ```typescript
 * const discountCalc = createConditionalCalculation(
 *   { field: 'memberStatus', operator: 'equals', value: 'premium' },
 *   { operator: 'multiply', fields: ['price'], constant: 0.8 },
 *   { operator: 'multiply', fields: ['price'], constant: 1.0 }
 * );
 * ```
 */
export declare const createConditionalCalculation: (condition: ConditionalRule, thenCalc: CalculationRule, elseCalc: CalculationRule) => CalculationRule;
/**
 * 21. Recalculates all calculated fields in form.
 *
 * @param {FormDefinition} form - Form definition
 * @param {Record<string, any>} formData - Current form data
 * @returns {Record<string, any>} Updated form data with calculated values
 *
 * @example
 * ```typescript
 * const updatedData = recalculateForm(form, formData);
 * ```
 */
export declare const recalculateForm: (form: FormDefinition, formData: Record<string, any>) => Record<string, any>;
/**
 * 22. Validates a single field value.
 *
 * @param {any} value - Field value
 * @param {ValidationRule[]} rules - Validation rules
 * @param {Record<string, any>} [formData] - Full form data for context
 * @returns {Promise<string[]>} Array of error messages (empty if valid)
 *
 * @example
 * ```typescript
 * const errors = await validateFieldValue('test@example', [
 *   { type: 'required', message: 'Email is required' },
 *   { type: 'email', message: 'Invalid email format' }
 * ]);
 * // Returns: ['Invalid email format']
 * ```
 */
export declare const validateFieldValue: (value: any, rules: ValidationRule[], formData?: Record<string, any>) => Promise<string[]>;
/**
 * 23. Validates ICD-10 diagnosis code.
 *
 * @param {string} code - ICD-10 code
 * @returns {boolean} True if valid format
 *
 * @example
 * ```typescript
 * const valid = validateICD10Code('E11.9'); // Type 2 diabetes
 * // Returns: true
 * ```
 */
export declare const validateICD10Code: (code: string) => boolean;
/**
 * 24. Validates CPT procedure code.
 *
 * @param {string} code - CPT code
 * @returns {boolean} True if valid format
 *
 * @example
 * ```typescript
 * const valid = validateCPTCode('99213'); // Office visit
 * // Returns: true
 * ```
 */
export declare const validateCPTCode: (code: string) => boolean;
/**
 * 25. Validates NPI (National Provider Identifier) number.
 *
 * @param {string} npi - NPI number
 * @returns {boolean} True if valid (includes Luhn check)
 *
 * @example
 * ```typescript
 * const valid = validateNPINumber('1234567893');
 * // Returns: true
 * ```
 */
export declare const validateNPINumber: (npi: string) => boolean;
/**
 * 26. Validates SSN (Social Security Number).
 *
 * @param {string} ssn - SSN
 * @returns {boolean} True if valid format
 *
 * @example
 * ```typescript
 * const valid = validateSSN('123-45-6789');
 * // Returns: true
 * ```
 */
export declare const validateSSN: (ssn: string) => boolean;
/**
 * 27. Validates using Luhn checksum algorithm.
 *
 * @param {string} value - Numeric string
 * @returns {boolean} True if checksum is valid
 *
 * @example
 * ```typescript
 * const valid = validateLuhnChecksum('1234567893'); // Valid NPI
 * // Returns: true
 * ```
 */
export declare const validateLuhnChecksum: (value: string) => boolean;
/**
 * 28. Validates entire form.
 *
 * @param {FormDefinition} form - Form definition
 * @param {Record<string, any>} formData - Form data to validate
 * @returns {Promise<Record<string, string[]>>} Validation errors by field
 *
 * @example
 * ```typescript
 * const errors = await validateForm(form, formData);
 * if (Object.keys(errors).length === 0) {
 *   // Form is valid
 * }
 * ```
 */
export declare const validateForm: (form: FormDefinition, formData: Record<string, any>) => Promise<Record<string, string[]>>;
/**
 * 29. Determines if field should be visible.
 *
 * @param {FormFieldDefinition} field - Field definition
 * @param {Record<string, any>} formData - Current form data
 * @returns {boolean} True if field should be visible
 *
 * @example
 * ```typescript
 * const visible = isFieldVisible(field, formData);
 * ```
 */
export declare const isFieldVisible: (field: FormFieldDefinition, formData: Record<string, any>) => boolean;
/**
 * 30. Determines if section should be visible.
 *
 * @param {FormSection} section - Section definition
 * @param {Record<string, any>} formData - Current form data
 * @returns {boolean} True if section should be visible
 *
 * @example
 * ```typescript
 * const visible = isSectionVisible(section, formData);
 * ```
 */
export declare const isSectionVisible: (section: FormSection, formData: Record<string, any>) => boolean;
/**
 * 31. Gets all visible fields for current form state.
 *
 * @param {FormDefinition} form - Form definition
 * @param {Record<string, any>} formData - Current form data
 * @returns {FormFieldDefinition[]} Array of visible fields
 *
 * @example
 * ```typescript
 * const visibleFields = getVisibleFields(form, formData);
 * ```
 */
export declare const getVisibleFields: (form: FormDefinition, formData: Record<string, any>) => FormFieldDefinition[];
/**
 * 32. Gets all visible sections for current form state.
 *
 * @param {FormDefinition} form - Form definition
 * @param {Record<string, any>} formData - Current form data
 * @returns {FormSection[]} Array of visible sections
 *
 * @example
 * ```typescript
 * const visibleSections = getVisibleSections(form, formData);
 * ```
 */
export declare const getVisibleSections: (form: FormDefinition, formData: Record<string, any>) => FormSection[];
/**
 * 33. Creates visibility rules based on field value.
 *
 * @param {string} controlField - Field that controls visibility
 * @param {ComparisonOperator} operator - Comparison operator
 * @param {any} value - Value to compare
 * @returns {ConditionalRule[]} Visibility rules
 *
 * @example
 * ```typescript
 * const rules = createVisibilityRules('hasInsurance', 'equals', true);
 * ```
 */
export declare const createVisibilityRules: (controlField: string, operator: ComparisonOperator, value: any) => ConditionalRule[];
/**
 * 34. Creates complex multi-field visibility logic.
 *
 * @param {ConditionalRule[]} rules - Individual rules
 * @param {'and' | 'or'} logicOperator - How to combine rules
 * @returns {ConditionalRule} Combined visibility rule
 *
 * @example
 * ```typescript
 * const complexRule = createComplexVisibility([
 *   { field: 'age', operator: 'greaterThan', value: 18 },
 *   { field: 'country', operator: 'equals', value: 'US' }
 * ], 'and');
 * ```
 */
export declare const createComplexVisibility: (rules: ConditionalRule[], logicOperator: "and" | "or") => ConditionalRule;
/**
 * 35. Applies visibility changes to form fields.
 *
 * @param {FormDefinition} form - Form definition
 * @param {Record<string, any>} formData - Current form data
 * @returns {Record<string, boolean>} Field visibility map
 *
 * @example
 * ```typescript
 * const visibilityMap = applyVisibilityRules(form, formData);
 * // Returns: { insuranceProvider: true, insuranceId: true, ... }
 * ```
 */
export declare const applyVisibilityRules: (form: FormDefinition, formData: Record<string, any>) => Record<string, boolean>;
/**
 * 36. Tracks form field interaction.
 *
 * @param {string} formId - Form ID
 * @param {string} fieldId - Field ID
 * @param {string} eventType - Event type (focus, blur, change, error)
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackFieldInteraction('form-123', 'email', 'focus');
 * ```
 */
export declare const trackFieldInteraction: (formId: string, fieldId: string, eventType: string, metadata?: Record<string, any>) => Promise<void>;
/**
 * 37. Calculates form completion rate.
 *
 * @param {number} totalStarts - Total form starts
 * @param {number} totalSubmissions - Total submissions
 * @returns {number} Completion rate percentage
 *
 * @example
 * ```typescript
 * const rate = calculateCompletionRate(1000, 750);
 * // Returns: 75
 * ```
 */
export declare const calculateCompletionRate: (totalStarts: number, totalSubmissions: number) => number;
/**
 * 38. Identifies form drop-off points.
 *
 * @param {FormSubmission[]} submissions - Form submissions (including drafts)
 * @param {FormDefinition} form - Form definition
 * @returns {Array<{ field: string; rate: number }>} Drop-off rates by field
 *
 * @example
 * ```typescript
 * const dropOffs = identifyDropOffPoints(submissions, form);
 * // Returns: [{ field: 'ssn', rate: 35 }, { field: 'income', rate: 22 }]
 * ```
 */
export declare const identifyDropOffPoints: (submissions: FormSubmission[], form: FormDefinition) => Array<{
    field: string;
    rate: number;
}>;
/**
 * 39. Calculates average form completion time.
 *
 * @param {FormSubmission[]} submissions - Completed submissions
 * @returns {number} Average time in seconds
 *
 * @example
 * ```typescript
 * const avgTime = calculateAverageCompletionTime(submissions);
 * // Returns: 245 (4 minutes 5 seconds)
 * ```
 */
export declare const calculateAverageCompletionTime: (submissions: FormSubmission[]) => number;
/**
 * 40. Generates form analytics report.
 *
 * @param {string} formId - Form ID
 * @param {FormSubmission[]} submissions - All submissions
 * @param {Date} startDate - Report period start
 * @param {Date} endDate - Report period end
 * @returns {FormAnalytics} Analytics report
 *
 * @example
 * ```typescript
 * const analytics = generateFormAnalytics('form-123', submissions, startDate, endDate);
 * console.log(`Conversion rate: ${analytics.conversionRate}%`);
 * ```
 */
export declare const generateFormAnalytics: (formId: string, submissions: FormSubmission[], startDate: Date, endDate: Date) => FormAnalytics;
/**
 * 41. Analyzes field error rates.
 *
 * @param {FormSubmission[]} submissions - Form submissions
 * @param {string} fieldName - Field name to analyze
 * @returns {FieldAnalytics} Field analytics
 *
 * @example
 * ```typescript
 * const emailAnalytics = analyzeFieldErrors(submissions, 'email');
 * console.log(`Error rate: ${emailAnalytics.errorRate}%`);
 * ```
 */
export declare const analyzeFieldErrors: (submissions: FormSubmission[], fieldName: string) => FieldAnalytics;
/**
 * 42. Creates A/B test variant for form.
 *
 * @param {FormDefinition} form - Base form definition
 * @param {string} variantName - Variant name
 * @param {Partial<FormDefinition>} changes - Changes for variant
 * @param {number} weight - Traffic weight (0-1)
 * @returns {FormABTest} A/B test configuration
 *
 * @example
 * ```typescript
 * const abTest = createFormVariant(form, 'Variant B', {
 *   fields: form.fields.map(f => f.name === 'phone' ? { ...f, required: false } : f)
 * }, 0.5);
 * ```
 */
export declare const createFormVariant: (form: FormDefinition, variantName: string, changes: Partial<FormDefinition>, weight?: number) => FormABTest;
/**
 * React hook for form state management with validation.
 *
 * @template T - Form data type
 * @param {FormDefinition} form - Form definition
 * @param {Partial<T>} [initialValues] - Initial form values
 * @returns {Object} Form state and handlers
 *
 * @example
 * ```typescript
 * const { values, errors, handleChange, handleSubmit, isValid } = useFormState(form, {
 *   firstName: 'John'
 * });
 * ```
 */
export declare const useFormState: <T extends Record<string, any>>(form: FormDefinition, initialValues?: Partial<T>) => {
    values: any;
    errors: any;
    touched: any;
    dirty: any;
    isSubmitting: any;
    isValidating: any;
    isValid: any;
    handleChange: any;
    handleBlur: any;
    handleSubmit: any;
    reset: any;
    validate: any;
};
/**
 * Calculates age from date of birth.
 *
 * @param {string | Date} dob - Date of birth
 * @returns {number} Age in years
 *
 * @example
 * ```typescript
 * const age = calculateAge('1990-05-15');
 * // Returns: 34 (as of 2024)
 * ```
 */
export declare const calculateAge: (dob: string | Date) => number;
declare const _default: {
    createFormDefinitionModel: (sequelize: Sequelize) => any;
    createFormFieldModel: (sequelize: Sequelize) => any;
    createFormSubmissionModel: (sequelize: Sequelize) => any;
    createFormDefinition: <T = any>(config: Partial<FormDefinition>) => FormDefinition;
    addFormField: (form: FormDefinition, field: FormFieldDefinition, position?: number) => FormDefinition;
    removeFormField: (form: FormDefinition, fieldId: string) => FormDefinition;
    cloneFormDefinition: (form: FormDefinition, overrides?: Partial<FormDefinition>) => FormDefinition;
    createMultiSectionForm: (name: string, sections: FormSection[], workflow?: Partial<FormWorkflow>) => FormDefinition;
    generateFormFromSchema: <T extends Record<string, any>>(schemaDefinition: Record<keyof T, any>) => FormFieldDefinition[];
    mergeFormDefinitions: (forms: FormDefinition[], newName: string) => FormDefinition;
    createFieldDependency: (sourceField: string, targetField: string, action: DependencyAction, condition?: ConditionalRule) => FieldDependency;
    evaluateFieldDependencies: (dependencies: FieldDependency[], formData: Record<string, any>, changedField: string) => Record<string, any>;
    evaluateCondition: (rule: ConditionalRule, formData: Record<string, any>) => boolean;
    createCascadingDependency: (parentField: string, childField: string, optionsMap: Record<string, any[]>) => FieldDependency;
    createDependentValidation: (sourceField: string, targetField: string, validator: (sourceValue: any, targetValue: any) => boolean) => FieldDependency;
    resolveAllDependencies: (form: FormDefinition, formData: Record<string, any>, changedField: string) => Record<string, any>;
    createDependencyGraph: (form: FormDefinition) => Record<string, string[]>;
    createCalculationRule: (operator: CalculationOperator, fields: string[], precision?: number) => CalculationRule;
    evaluateCalculation: (rule: CalculationRule, formData: Record<string, any>) => number | null;
    evaluateFormula: (formula: string, context: Record<string, any>) => number;
    createBMICalculator: (weightField: string, heightField: string, units?: "kg/m" | "lb/in") => CalculationRule;
    createAgeCalculator: (dobField: string) => CalculationRule;
    createConditionalCalculation: (condition: ConditionalRule, thenCalc: CalculationRule, elseCalc: CalculationRule) => CalculationRule;
    recalculateForm: (form: FormDefinition, formData: Record<string, any>) => Record<string, any>;
    validateFieldValue: (value: any, rules: ValidationRule[], formData?: Record<string, any>) => Promise<string[]>;
    validateICD10Code: (code: string) => boolean;
    validateCPTCode: (code: string) => boolean;
    validateNPINumber: (npi: string) => boolean;
    validateSSN: (ssn: string) => boolean;
    validateLuhnChecksum: (value: string) => boolean;
    validateForm: (form: FormDefinition, formData: Record<string, any>) => Promise<Record<string, string[]>>;
    isFieldVisible: (field: FormFieldDefinition, formData: Record<string, any>) => boolean;
    isSectionVisible: (section: FormSection, formData: Record<string, any>) => boolean;
    getVisibleFields: (form: FormDefinition, formData: Record<string, any>) => FormFieldDefinition[];
    getVisibleSections: (form: FormDefinition, formData: Record<string, any>) => FormSection[];
    createVisibilityRules: (controlField: string, operator: ComparisonOperator, value: any) => ConditionalRule[];
    createComplexVisibility: (rules: ConditionalRule[], logicOperator: "and" | "or") => ConditionalRule;
    applyVisibilityRules: (form: FormDefinition, formData: Record<string, any>) => Record<string, boolean>;
    trackFieldInteraction: (formId: string, fieldId: string, eventType: string, metadata?: Record<string, any>) => Promise<void>;
    calculateCompletionRate: (totalStarts: number, totalSubmissions: number) => number;
    identifyDropOffPoints: (submissions: FormSubmission[], form: FormDefinition) => Array<{
        field: string;
        rate: number;
    }>;
    calculateAverageCompletionTime: (submissions: FormSubmission[]) => number;
    generateFormAnalytics: (formId: string, submissions: FormSubmission[], startDate: Date, endDate: Date) => FormAnalytics;
    analyzeFieldErrors: (submissions: FormSubmission[], fieldName: string) => FieldAnalytics;
    createFormVariant: (form: FormDefinition, variantName: string, changes: Partial<FormDefinition>, weight?: number) => FormABTest;
    useFormState: <T extends Record<string, any>>(form: FormDefinition, initialValues?: Partial<T>) => {
        values: any;
        errors: any;
        touched: any;
        dirty: any;
        isSubmitting: any;
        isValidating: any;
        isValid: any;
        handleChange: any;
        handleBlur: any;
        handleSubmit: any;
        reset: any;
        validate: any;
    };
    calculateAge: (dob: string | Date) => number;
};
export default _default;
//# sourceMappingURL=document-forms-advanced-kit.d.ts.map