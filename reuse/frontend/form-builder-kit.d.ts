/**
 * LOC: FRM1234567
 * File: /reuse/frontend/form-builder-kit.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+ (optional)
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - Form builder applications
 *   - Dynamic form generators
 *   - Survey/questionnaire systems
 *   - Admin panels with configurable forms
 */
import React, { ReactNode } from 'react';
export type FieldType = 'text' | 'textarea' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'switch' | 'date' | 'time' | 'datetime' | 'file' | 'image' | 'richtext' | 'code' | 'color' | 'range' | 'rating' | 'signature' | 'repeater' | 'group' | 'custom';
export type ValidationRuleType = 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'custom';
export interface ValidationRule {
    type: ValidationRuleType;
    value?: any;
    message: string;
    validator?: (value: any, formData: FormData) => boolean | Promise<boolean>;
}
export interface FieldOption {
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
    icon?: ReactNode;
    description?: string;
}
export interface ConditionalLogic {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
    value: any;
    action: 'show' | 'hide' | 'enable' | 'disable' | 'require';
}
export interface FieldConfig {
    id: string;
    name: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    defaultValue?: any;
    value?: any;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    visible?: boolean;
    options?: FieldOption[];
    validation?: ValidationRule[];
    conditionalLogic?: ConditionalLogic[];
    dependencies?: string[];
    metadata?: Record<string, any>;
    className?: string;
    containerClassName?: string;
    helpText?: string;
    tooltip?: string;
    prefix?: ReactNode;
    suffix?: ReactNode;
    minRows?: number;
    maxRows?: number;
    accept?: string;
    multiple?: boolean;
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    rows?: number;
    cols?: number;
    maxFileSize?: number;
    allowedFileTypes?: string[];
    repeaterConfig?: RepeaterConfig;
    groupFields?: FieldConfig[];
}
export interface RepeaterConfig {
    minItems?: number;
    maxItems?: number;
    addButtonText?: string;
    removeButtonText?: string;
    itemTemplate: FieldConfig[];
    itemLabel?: (index: number) => string;
    allowReorder?: boolean;
}
export interface FormSection {
    id: string;
    title: string;
    description?: string;
    fields: FieldConfig[];
    collapsible?: boolean;
    defaultCollapsed?: boolean;
}
export interface FormStep {
    id: string;
    title: string;
    description?: string;
    sections?: FormSection[];
    fields?: FieldConfig[];
    validation?: 'onNext' | 'onSubmit' | 'none';
    canSkip?: boolean;
    order: number;
}
export interface FormConfig {
    id: string;
    title: string;
    description?: string;
    sections?: FormSection[];
    fields?: FieldConfig[];
    steps?: FormStep[];
    submitButtonText?: string;
    cancelButtonText?: string;
    resetButtonText?: string;
    showProgressBar?: boolean;
    allowSaveProgress?: boolean;
    autoSave?: boolean;
    autoSaveInterval?: number;
    validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
    layout?: 'vertical' | 'horizontal' | 'inline';
    metadata?: Record<string, any>;
}
export interface FormData {
    [fieldName: string]: any;
}
export interface FormErrors {
    [fieldName: string]: string | string[];
}
export interface FormState {
    data: FormData;
    errors: FormErrors;
    touched: Set<string>;
    dirty: Set<string>;
    isSubmitting: boolean;
    isValidating: boolean;
    isValid: boolean;
    submitCount: number;
    currentStep?: number;
    progress?: number;
}
export interface FormContextValue {
    formState: FormState;
    formConfig: FormConfig;
    updateField: (fieldName: string, value: any) => void;
    updateFields: (updates: Partial<FormData>) => void;
    setFieldError: (fieldName: string, error: string) => void;
    clearFieldError: (fieldName: string) => void;
    setFieldTouched: (fieldName: string, touched?: boolean) => void;
    validateField: (fieldName: string) => Promise<boolean>;
    validateForm: () => Promise<boolean>;
    submitForm: () => Promise<void>;
    resetForm: () => void;
    resetField: (fieldName: string) => void;
    getFieldValue: (fieldName: string) => any;
    getFieldConfig: (fieldName: string) => FieldConfig | undefined;
    isFieldVisible: (fieldConfig: FieldConfig) => boolean;
    isFieldEnabled: (fieldConfig: FieldConfig) => boolean;
    isFieldRequired: (fieldConfig: FieldConfig) => boolean;
    goToStep: (step: number) => void;
    nextStep: () => Promise<boolean>;
    previousStep: () => void;
}
export declare const useFormContext: () => FormContextValue;
/**
 * Validates a field value against validation rules.
 *
 * @param {any} value - Field value to validate
 * @param {ValidationRule[]} rules - Validation rules to apply
 * @param {FormData} formData - Current form data for custom validators
 * @returns {Promise<string | null>} Error message or null if valid
 *
 * @example
 * ```tsx
 * const error = await validateFieldValue(
 *   'john@example.com',
 *   [
 *     { type: 'required', message: 'Email is required' },
 *     { type: 'email', message: 'Invalid email format' }
 *   ],
 *   formData
 * );
 * ```
 */
export declare const validateFieldValue: (value: any, rules: ValidationRule[], formData: FormData) => Promise<string | null>;
/**
 * Evaluates conditional logic for a field.
 *
 * @param {ConditionalLogic} condition - Conditional logic configuration
 * @param {FormData} formData - Current form data
 * @returns {boolean} Whether the condition is met
 *
 * @example
 * ```tsx
 * const shouldShow = evaluateCondition(
 *   {
 *     field: 'country',
 *     operator: 'equals',
 *     value: 'USA',
 *     action: 'show'
 *   },
 *   formData
 * );
 * ```
 */
export declare const evaluateCondition: (condition: ConditionalLogic, formData: FormData) => boolean;
/**
 * Applies conditional logic to determine field state.
 *
 * @param {FieldConfig} fieldConfig - Field configuration
 * @param {FormData} formData - Current form data
 * @returns {object} Field state based on conditional logic
 *
 * @example
 * ```tsx
 * const { visible, enabled, required } = applyConditionalLogic(fieldConfig, formData);
 * ```
 */
export declare const applyConditionalLogic: (fieldConfig: FieldConfig, formData: FormData) => {
    visible: boolean;
    enabled: boolean;
    required: boolean;
};
/**
 * Custom hook for managing form state with validation and conditional logic.
 *
 * @param {FormConfig} formConfig - Form configuration
 * @param {object} options - Form options
 * @returns {FormContextValue} Form context value with state and methods
 *
 * @example
 * ```tsx
 * const formContext = useFormState(formConfig, {
 *   onSubmit: async (data) => {
 *     await saveFormData(data);
 *   },
 *   initialData: { firstName: 'John' },
 *   validationMode: 'onBlur'
 * });
 * ```
 */
export declare const useFormState: (formConfig: FormConfig, options?: {
    onSubmit?: (data: FormData) => Promise<void> | void;
    onChange?: (data: FormData) => void;
    onValidationError?: (errors: FormErrors) => void;
    initialData?: FormData;
    validationMode?: "onChange" | "onBlur" | "onSubmit";
}) => FormContextValue;
/**
 * Retrieves all fields from a form configuration, including nested fields.
 *
 * @param {FormConfig} formConfig - Form configuration
 * @returns {FieldConfig[]} Array of all field configurations
 *
 * @example
 * ```tsx
 * const allFields = getAllFields(formConfig);
 * console.log(allFields.map(f => f.name)); // ['firstName', 'lastName', 'email']
 * ```
 */
export declare const getAllFields: (formConfig: FormConfig) => FieldConfig[];
/**
 * Serializes form data to JSON string.
 *
 * @param {FormData} formData - Form data to serialize
 * @param {boolean} prettyPrint - Whether to format with indentation
 * @returns {string} JSON string representation
 *
 * @example
 * ```tsx
 * const json = serializeFormData(formData, true);
 * localStorage.setItem('formDraft', json);
 * ```
 */
export declare const serializeFormData: (formData: FormData, prettyPrint?: boolean) => string;
/**
 * Deserializes JSON string to form data.
 *
 * @param {string} jsonString - JSON string to deserialize
 * @returns {FormData | null} Parsed form data or null if invalid
 *
 * @example
 * ```tsx
 * const savedData = localStorage.getItem('formDraft');
 * const formData = deserializeFormData(savedData);
 * ```
 */
export declare const deserializeFormData: (jsonString: string | null) => FormData | null;
/**
 * Calculates form completion progress.
 *
 * @param {FormConfig} formConfig - Form configuration
 * @param {FormData} formData - Current form data
 * @returns {number} Completion percentage (0-100)
 *
 * @example
 * ```tsx
 * const progress = calculateFormProgress(formConfig, formData);
 * console.log(`Form is ${progress}% complete`);
 * ```
 */
export declare const calculateFormProgress: (formConfig: FormConfig, formData: FormData) => number;
/**
 * Exports form configuration to JSON.
 *
 * @param {FormConfig} formConfig - Form configuration to export
 * @returns {string} JSON string of form configuration
 *
 * @example
 * ```tsx
 * const configJson = exportFormConfig(formConfig);
 * downloadFile('form-config.json', configJson);
 * ```
 */
export declare const exportFormConfig: (formConfig: FormConfig) => string;
/**
 * Imports form configuration from JSON.
 *
 * @param {string} jsonString - JSON string to import
 * @returns {FormConfig | null} Parsed form configuration or null if invalid
 *
 * @example
 * ```tsx
 * const config = importFormConfig(uploadedJsonString);
 * if (config) {
 *   setFormConfig(config);
 * }
 * ```
 */
export declare const importFormConfig: (jsonString: string) => FormConfig | null;
/**
 * FormProvider component - Provides form context to child components.
 *
 * @example
 * ```tsx
 * <FormProvider formConfig={formConfig} onSubmit={handleSubmit}>
 *   <FormRenderer />
 * </FormProvider>
 * ```
 */
export declare const FormProvider: React.FC<{
    children: ReactNode;
    formConfig: FormConfig;
    onSubmit?: (data: FormData) => Promise<void> | void;
    onChange?: (data: FormData) => void;
    onValidationError?: (errors: FormErrors) => void;
    initialData?: FormData;
    validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
}>;
/**
 * FormBuilder component - Visual form builder interface.
 *
 * @example
 * ```tsx
 * <FormBuilder
 *   onSave={(config) => saveFormConfig(config)}
 *   initialConfig={existingConfig}
 * />
 * ```
 */
export declare const FormBuilder: React.FC<{
    onSave?: (config: FormConfig) => void;
    onChange?: (config: FormConfig) => void;
    initialConfig?: FormConfig;
    className?: string;
}>;
/**
 * FormRenderer component - Renders a form from configuration.
 *
 * @example
 * ```tsx
 * <FormRenderer
 *   formConfig={formConfig}
 *   onSubmit={async (data) => {
 *     await api.submitForm(data);
 *   }}
 * />
 * ```
 */
export declare const FormRenderer: React.FC<{
    formConfig?: FormConfig;
    className?: string;
    showSubmitButton?: boolean;
    showResetButton?: boolean;
}>;
/**
 * FormPreview component - Read-only preview of form with data.
 *
 * @example
 * ```tsx
 * <FormPreview
 *   formConfig={formConfig}
 *   formData={submittedData}
 * />
 * ```
 */
export declare const FormPreview: React.FC<{
    formConfig: FormConfig;
    formData: FormData;
    className?: string;
}>;
/**
 * FormSection component - Renders a collapsible form section.
 *
 * @example
 * ```tsx
 * <FormSection section={sectionConfig} />
 * ```
 */
export declare const FormSection: React.FC<{
    section: FormSection;
    className?: string;
}>;
/**
 * FieldList component - Renders a list of fields.
 *
 * @example
 * ```tsx
 * <FieldList fields={fieldConfigs} />
 * ```
 */
export declare const FieldList: React.FC<{
    fields: FieldConfig[];
    className?: string;
}>;
/**
 * DynamicField component - Renders a field based on its type.
 *
 * @example
 * ```tsx
 * <DynamicField field={fieldConfig} />
 * ```
 */
export declare const DynamicField: React.FC<{
    field: FieldConfig;
    className?: string;
}>;
/**
 * FieldFactory component - Factory for creating field components.
 *
 * @example
 * ```tsx
 * <FieldFactory
 *   field={fieldConfig}
 *   value={value}
 *   onChange={(val) => setValue(val)}
 * />
 * ```
 */
export declare const FieldFactory: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * FieldWrapper component - Wraps fields with label, error, and help text.
 *
 * @example
 * ```tsx
 * <FieldWrapper field={field} error={error}>
 *   <input />
 * </FieldWrapper>
 * ```
 */
export declare const FieldWrapper: React.FC<{
    field: FieldConfig;
    error?: string | string[];
    children: ReactNode;
    className?: string;
}>;
/**
 * TextInput component - Standard text input field.
 *
 * @example
 * ```tsx
 * <TextInput
 *   field={field}
 *   value={value}
 *   onChange={(val) => setValue(val)}
 * />
 * ```
 */
export declare const TextInput: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * TextArea component - Multi-line text input.
 *
 * @example
 * ```tsx
 * <TextArea
 *   field={field}
 *   value={value}
 *   onChange={(val) => setValue(val)}
 * />
 * ```
 */
export declare const TextArea: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * Select component - Dropdown selection field.
 *
 * @example
 * ```tsx
 * <Select
 *   field={field}
 *   value={value}
 *   onChange={(val) => setValue(val)}
 * />
 * ```
 */
export declare const Select: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * MultiSelect component - Multiple selection field.
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   field={field}
 *   value={selectedValues}
 *   onChange={(vals) => setSelectedValues(vals)}
 * />
 * ```
 */
export declare const MultiSelect: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * Checkbox component - Single checkbox or checkbox group.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   field={field}
 *   value={checked}
 *   onChange={(val) => setChecked(val)}
 * />
 * ```
 */
export declare const Checkbox: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * Radio component - Radio button group.
 *
 * @example
 * ```tsx
 * <Radio
 *   field={field}
 *   value={selectedValue}
 *   onChange={(val) => setSelectedValue(val)}
 * />
 * ```
 */
export declare const Radio: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * Switch component - Toggle switch field.
 *
 * @example
 * ```tsx
 * <Switch
 *   field={field}
 *   value={enabled}
 *   onChange={(val) => setEnabled(val)}
 * />
 * ```
 */
export declare const Switch: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * DatePicker component - Date, time, or datetime picker.
 *
 * @example
 * ```tsx
 * <DatePicker
 *   field={field}
 *   value={date}
 *   onChange={(val) => setDate(val)}
 * />
 * ```
 */
export declare const DatePicker: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * FileUpload component - File upload field with validation.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   field={field}
 *   value={files}
 *   onChange={(files) => setFiles(files)}
 * />
 * ```
 */
export declare const FileUpload: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * ImageUpload component - Image upload with preview.
 *
 * @example
 * ```tsx
 * <ImageUpload
 *   field={field}
 *   value={image}
 *   onChange={(img) => setImage(img)}
 * />
 * ```
 */
export declare const ImageUpload: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * ColorPicker component - Color selection field.
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   field={field}
 *   value={color}
 *   onChange={(c) => setColor(c)}
 * />
 * ```
 */
export declare const ColorPicker: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * RangeInput component - Range slider input.
 *
 * @example
 * ```tsx
 * <RangeInput
 *   field={field}
 *   value={value}
 *   onChange={(val) => setValue(val)}
 * />
 * ```
 */
export declare const RangeInput: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * Rating component - Star rating or numeric rating field.
 *
 * @example
 * ```tsx
 * <Rating
 *   field={field}
 *   value={rating}
 *   onChange={(val) => setRating(val)}
 * />
 * ```
 */
export declare const Rating: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * RepeaterField component - Dynamic array of repeated fields.
 *
 * @example
 * ```tsx
 * <RepeaterField
 *   field={field}
 *   value={items}
 *   onChange={(items) => setItems(items)}
 * />
 * ```
 */
export declare const RepeaterField: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * FieldGroup component - Groups related fields together.
 *
 * @example
 * ```tsx
 * <FieldGroup
 *   field={groupField}
 *   value={groupData}
 *   onChange={(data) => setGroupData(data)}
 * />
 * ```
 */
export declare const FieldGroup: React.FC<{
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string | string[];
    disabled?: boolean;
    className?: string;
}>;
/**
 * FormWizard component - Multi-step form wizard.
 *
 * @example
 * ```tsx
 * <FormWizard
 *   onComplete={(data) => handleSubmit(data)}
 * />
 * ```
 */
export declare const FormWizard: React.FC<{
    className?: string;
}>;
/**
 * FormStepIndicator component - Visual step indicator for wizard.
 *
 * @example
 * ```tsx
 * <FormStepIndicator />
 * ```
 */
export declare const FormStepIndicator: React.FC<{
    className?: string;
}>;
/**
 * FormProgress component - Progress bar for forms.
 *
 * @example
 * ```tsx
 * <FormProgress progress={75} />
 * ```
 */
export declare const FormProgress: React.FC<{
    progress: number;
    className?: string;
    showPercentage?: boolean;
}>;
/**
 * Custom hook for field validation with debouncing.
 *
 * @param {string} fieldName - Field name to validate
 * @param {number} delay - Debounce delay in milliseconds
 *
 * @example
 * ```tsx
 * const { validate, isValidating, error } = useFieldValidation('email', 300);
 * ```
 */
export declare const useFieldValidation: (fieldName: string, delay?: number) => {
    validate: any;
    isValidating: any;
    error: string | string[];
};
/**
 * Custom hook for form auto-save functionality.
 *
 * @param {Function} saveFn - Function to call for saving
 * @param {number} delay - Auto-save delay in milliseconds
 *
 * @example
 * ```tsx
 * useFormAutoSave(async (data) => {
 *   await api.saveDraft(data);
 * }, 2000);
 * ```
 */
export declare const useFormAutoSave: (saveFn: (data: FormData) => Promise<void> | void, delay?: number) => {
    isSaving: any;
    lastSaved: any;
};
/**
 * Custom hook for form field dependencies.
 *
 * @param {string} fieldName - Field name to watch
 * @param {Function} callback - Callback when field changes
 *
 * @example
 * ```tsx
 * useFieldDependency('country', (value) => {
 *   if (value === 'USA') {
 *     updateFields({ stateRequired: true });
 *   }
 * });
 * ```
 */
export declare const useFieldDependency: (fieldName: string, callback: (value: any, formData: FormData) => void) => void;
export type { FieldType, ValidationRuleType, ValidationRule, FieldOption, ConditionalLogic, FieldConfig, RepeaterConfig, FormSection, FormStep, FormConfig, FormData, FormErrors, FormState, FormContextValue, };
declare const _default: {
    FormContext: any;
    useFormContext: () => FormContextValue;
    useFormState: (formConfig: FormConfig, options?: {
        onSubmit?: (data: FormData) => Promise<void> | void;
        onChange?: (data: FormData) => void;
        onValidationError?: (errors: FormErrors) => void;
        initialData?: FormData;
        validationMode?: "onChange" | "onBlur" | "onSubmit";
    }) => FormContextValue;
    validateFieldValue: (value: any, rules: ValidationRule[], formData: FormData) => Promise<string | null>;
    evaluateCondition: (condition: ConditionalLogic, formData: FormData) => boolean;
    applyConditionalLogic: (fieldConfig: FieldConfig, formData: FormData) => {
        visible: boolean;
        enabled: boolean;
        required: boolean;
    };
    getAllFields: (formConfig: FormConfig) => FieldConfig[];
    serializeFormData: (formData: FormData, prettyPrint?: boolean) => string;
    deserializeFormData: (jsonString: string | null) => FormData | null;
    calculateFormProgress: (formConfig: FormConfig, formData: FormData) => number;
    exportFormConfig: (formConfig: FormConfig) => string;
    importFormConfig: (jsonString: string) => FormConfig | null;
    FormProvider: React.FC<{
        children: ReactNode;
        formConfig: FormConfig;
        onSubmit?: (data: FormData) => Promise<void> | void;
        onChange?: (data: FormData) => void;
        onValidationError?: (errors: FormErrors) => void;
        initialData?: FormData;
        validationMode?: "onChange" | "onBlur" | "onSubmit";
    }>;
    FormBuilder: React.FC<{
        onSave?: (config: FormConfig) => void;
        onChange?: (config: FormConfig) => void;
        initialConfig?: FormConfig;
        className?: string;
    }>;
    FormRenderer: React.FC<{
        formConfig?: FormConfig;
        className?: string;
        showSubmitButton?: boolean;
        showResetButton?: boolean;
    }>;
    FormPreview: React.FC<{
        formConfig: FormConfig;
        formData: FormData;
        className?: string;
    }>;
    FormSection: React.FC<{
        section: FormSection;
        className?: string;
    }>;
    FieldList: React.FC<{
        fields: FieldConfig[];
        className?: string;
    }>;
    DynamicField: React.FC<{
        field: FieldConfig;
        className?: string;
    }>;
    FieldFactory: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    FieldWrapper: React.FC<{
        field: FieldConfig;
        error?: string | string[];
        children: ReactNode;
        className?: string;
    }>;
    TextInput: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    TextArea: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    Select: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    MultiSelect: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    Checkbox: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    Radio: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    Switch: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    DatePicker: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    FileUpload: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    ImageUpload: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    ColorPicker: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    RangeInput: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    Rating: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    RepeaterField: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    FieldGroup: React.FC<{
        field: FieldConfig;
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        error?: string | string[];
        disabled?: boolean;
        className?: string;
    }>;
    FormWizard: React.FC<{
        className?: string;
    }>;
    FormStepIndicator: React.FC<{
        className?: string;
    }>;
    FormProgress: React.FC<{
        progress: number;
        className?: string;
        showPercentage?: boolean;
    }>;
    useFieldValidation: (fieldName: string, delay?: number) => {
        validate: any;
        isValidating: any;
        error: string | string[];
    };
    useFormAutoSave: (saveFn: (data: FormData) => Promise<void> | void, delay?: number) => {
        isSaving: any;
        lastSaved: any;
    };
    useFieldDependency: (fieldName: string, callback: (value: any, formData: FormData) => void) => void;
};
export default _default;
//# sourceMappingURL=form-builder-kit.d.ts.map