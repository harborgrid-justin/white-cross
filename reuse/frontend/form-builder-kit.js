"use strict";
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
/**
 * File: /reuse/frontend/form-builder-kit.ts
 * Locator: WC-FRM-BUILD-001
 * Purpose: Enterprise Form Builder Kit - Comprehensive dynamic form building and rendering system
 *
 * Upstream: React 18+, TypeScript 5.x, Next.js 16+ (optional)
 * Downstream: ../frontend/*, Form builder UIs, Survey systems, Admin panels
 * Dependencies: React 18+, TypeScript 5.x, zod (optional), react-hook-form (optional)
 * Exports: 45+ components, hooks, and utilities for dynamic form building
 *
 * LLM Context: Enterprise-grade form builder kit for React 18+ applications.
 * Provides comprehensive form building, validation, conditional logic, multi-step wizards,
 * repeater fields, file uploads, rich text editing, and dynamic field rendering.
 * Designed for healthcare, education, and enterprise applications requiring complex,
 * configurable forms with robust validation and state management.
 */
'use client';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFieldDependency = exports.useFormAutoSave = exports.useFieldValidation = exports.FormProgress = exports.FormStepIndicator = exports.FormWizard = exports.FieldGroup = exports.RepeaterField = exports.Rating = exports.RangeInput = exports.ColorPicker = exports.ImageUpload = exports.FileUpload = exports.DatePicker = exports.Switch = exports.Radio = exports.Checkbox = exports.MultiSelect = exports.Select = exports.TextArea = exports.TextInput = exports.FieldWrapper = exports.FieldFactory = exports.DynamicField = exports.FieldList = exports.FormSection = exports.FormPreview = exports.FormRenderer = exports.FormBuilder = exports.FormProvider = exports.importFormConfig = exports.exportFormConfig = exports.calculateFormProgress = exports.deserializeFormData = exports.serializeFormData = exports.getAllFields = exports.useFormState = exports.applyConditionalLogic = exports.evaluateCondition = exports.validateFieldValue = exports.useFormContext = void 0;
const react_1 = require("react");
// ============================================================================
// FORM CONTEXT
// ============================================================================
const FormContext = (0, react_1.createContext)(null);
const useFormContext = () => {
    const context = (0, react_1.useContext)(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
};
exports.useFormContext = useFormContext;
// ============================================================================
// VALIDATION UTILITIES
// ============================================================================
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
const validateFieldValue = async (value, rules, formData) => {
    for (const rule of rules) {
        switch (rule.type) {
            case 'required':
                if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
                    return rule.message;
                }
                break;
            case 'minLength':
                if (typeof value === 'string' && value.length < rule.value) {
                    return rule.message;
                }
                break;
            case 'maxLength':
                if (typeof value === 'string' && value.length > rule.value) {
                    return rule.message;
                }
                break;
            case 'min':
                if (typeof value === 'number' && value < rule.value) {
                    return rule.message;
                }
                break;
            case 'max':
                if (typeof value === 'number' && value > rule.value) {
                    return rule.message;
                }
                break;
            case 'pattern':
                if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
                    return rule.message;
                }
                break;
            case 'email':
                if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return rule.message;
                }
                break;
            case 'url':
                if (typeof value === 'string') {
                    try {
                        new URL(value);
                    }
                    catch {
                        return rule.message;
                    }
                }
                break;
            case 'custom':
                if (rule.validator) {
                    const isValid = await rule.validator(value, formData);
                    if (!isValid) {
                        return rule.message;
                    }
                }
                break;
        }
    }
    return null;
};
exports.validateFieldValue = validateFieldValue;
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
const evaluateCondition = (condition, formData) => {
    const fieldValue = formData[condition.field];
    switch (condition.operator) {
        case 'equals':
            return fieldValue === condition.value;
        case 'notEquals':
            return fieldValue !== condition.value;
        case 'contains':
            return typeof fieldValue === 'string' && fieldValue.includes(condition.value);
        case 'greaterThan':
            return typeof fieldValue === 'number' && fieldValue > condition.value;
        case 'lessThan':
            return typeof fieldValue === 'number' && fieldValue < condition.value;
        case 'isEmpty':
            return !fieldValue || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);
        case 'isNotEmpty':
            return !!fieldValue && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0);
        default:
            return true;
    }
};
exports.evaluateCondition = evaluateCondition;
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
const applyConditionalLogic = (fieldConfig, formData) => {
    let visible = fieldConfig.visible !== false;
    let enabled = !fieldConfig.disabled;
    let required = fieldConfig.required || false;
    if (fieldConfig.conditionalLogic) {
        for (const condition of fieldConfig.conditionalLogic) {
            const conditionMet = (0, exports.evaluateCondition)(condition, formData);
            if (conditionMet) {
                switch (condition.action) {
                    case 'show':
                        visible = true;
                        break;
                    case 'hide':
                        visible = false;
                        break;
                    case 'enable':
                        enabled = true;
                        break;
                    case 'disable':
                        enabled = false;
                        break;
                    case 'require':
                        required = true;
                        break;
                }
            }
        }
    }
    return { visible, enabled, required };
};
exports.applyConditionalLogic = applyConditionalLogic;
// ============================================================================
// FORM STATE MANAGEMENT HOOK
// ============================================================================
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
const useFormState = (formConfig, options = {}) => {
    const [formState, setFormState] = (0, react_1.useState)(() => {
        const initialData = options.initialData || {};
        const allFields = (0, exports.getAllFields)(formConfig);
        // Initialize with default values
        const data = { ...initialData };
        allFields.forEach(field => {
            if (data[field.name] === undefined && field.defaultValue !== undefined) {
                data[field.name] = field.defaultValue;
            }
        });
        return {
            data,
            errors: {},
            touched: new Set(),
            dirty: new Set(),
            isSubmitting: false,
            isValidating: false,
            isValid: true,
            submitCount: 0,
            currentStep: formConfig.steps ? 0 : undefined,
            progress: 0,
        };
    });
    const autoSaveTimeoutRef = (0, react_1.useRef)();
    // Auto-save functionality
    (0, react_1.useEffect)(() => {
        if (formConfig.autoSave && options.onChange) {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
            autoSaveTimeoutRef.current = setTimeout(() => {
                options.onChange?.(formState.data);
            }, formConfig.autoSaveInterval || 2000);
        }
        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [formState.data, formConfig.autoSave, formConfig.autoSaveInterval]);
    const updateField = (0, react_1.useCallback)((fieldName, value) => {
        setFormState(prev => ({
            ...prev,
            data: { ...prev.data, [fieldName]: value },
            dirty: new Set([...prev.dirty, fieldName]),
        }));
    }, []);
    const updateFields = (0, react_1.useCallback)((updates) => {
        setFormState(prev => ({
            ...prev,
            data: { ...prev.data, ...updates },
            dirty: new Set([...prev.dirty, ...Object.keys(updates)]),
        }));
    }, []);
    const setFieldError = (0, react_1.useCallback)((fieldName, error) => {
        setFormState(prev => ({
            ...prev,
            errors: { ...prev.errors, [fieldName]: error },
            isValid: false,
        }));
    }, []);
    const clearFieldError = (0, react_1.useCallback)((fieldName) => {
        setFormState(prev => {
            const newErrors = { ...prev.errors };
            delete newErrors[fieldName];
            return {
                ...prev,
                errors: newErrors,
                isValid: Object.keys(newErrors).length === 0,
            };
        });
    }, []);
    const setFieldTouched = (0, react_1.useCallback)((fieldName, touched = true) => {
        setFormState(prev => {
            const newTouched = new Set(prev.touched);
            if (touched) {
                newTouched.add(fieldName);
            }
            else {
                newTouched.delete(fieldName);
            }
            return { ...prev, touched: newTouched };
        });
    }, []);
    const validateField = (0, react_1.useCallback)(async (fieldName) => {
        const field = getFieldConfig(fieldName);
        if (!field || !field.validation)
            return true;
        const value = formState.data[fieldName];
        const error = await (0, exports.validateFieldValue)(value, field.validation, formState.data);
        if (error) {
            setFieldError(fieldName, error);
            return false;
        }
        else {
            clearFieldError(fieldName);
            return true;
        }
    }, [formState.data]);
    const validateForm = (0, react_1.useCallback)(async () => {
        setFormState(prev => ({ ...prev, isValidating: true }));
        const allFields = (0, exports.getAllFields)(formConfig);
        const errors = {};
        for (const field of allFields) {
            const { visible, required } = (0, exports.applyConditionalLogic)(field, formState.data);
            if (!visible)
                continue;
            const validationRules = field.validation || [];
            if (required && !validationRules.some(rule => rule.type === 'required')) {
                validationRules.unshift({
                    type: 'required',
                    message: `${field.label} is required`,
                });
            }
            if (validationRules.length > 0) {
                const value = formState.data[field.name];
                const error = await (0, exports.validateFieldValue)(value, validationRules, formState.data);
                if (error) {
                    errors[field.name] = error;
                }
            }
        }
        const isValid = Object.keys(errors).length === 0;
        setFormState(prev => ({
            ...prev,
            errors,
            isValid,
            isValidating: false,
        }));
        if (!isValid && options.onValidationError) {
            options.onValidationError(errors);
        }
        return isValid;
    }, [formConfig, formState.data]);
    const submitForm = (0, react_1.useCallback)(async () => {
        setFormState(prev => ({ ...prev, isSubmitting: true, submitCount: prev.submitCount + 1 }));
        const isValid = await validateForm();
        if (isValid && options.onSubmit) {
            try {
                await options.onSubmit(formState.data);
            }
            catch (error) {
                console.error('Form submission error:', error);
            }
        }
        setFormState(prev => ({ ...prev, isSubmitting: false }));
    }, [formState.data, validateForm, options.onSubmit]);
    const resetForm = (0, react_1.useCallback)(() => {
        const allFields = (0, exports.getAllFields)(formConfig);
        const data = {};
        allFields.forEach(field => {
            if (field.defaultValue !== undefined) {
                data[field.name] = field.defaultValue;
            }
        });
        setFormState({
            data: { ...data, ...options.initialData },
            errors: {},
            touched: new Set(),
            dirty: new Set(),
            isSubmitting: false,
            isValidating: false,
            isValid: true,
            submitCount: 0,
            currentStep: formConfig.steps ? 0 : undefined,
            progress: 0,
        });
    }, [formConfig, options.initialData]);
    const resetField = (0, react_1.useCallback)((fieldName) => {
        const field = getFieldConfig(fieldName);
        const defaultValue = field?.defaultValue;
        setFormState(prev => {
            const newData = { ...prev.data };
            if (defaultValue !== undefined) {
                newData[fieldName] = defaultValue;
            }
            else {
                delete newData[fieldName];
            }
            const newTouched = new Set(prev.touched);
            newTouched.delete(fieldName);
            const newDirty = new Set(prev.dirty);
            newDirty.delete(fieldName);
            const newErrors = { ...prev.errors };
            delete newErrors[fieldName];
            return {
                ...prev,
                data: newData,
                touched: newTouched,
                dirty: newDirty,
                errors: newErrors,
            };
        });
    }, []);
    const getFieldValue = (0, react_1.useCallback)((fieldName) => {
        return formState.data[fieldName];
    }, [formState.data]);
    const getFieldConfig = (0, react_1.useCallback)((fieldName) => {
        const allFields = (0, exports.getAllFields)(formConfig);
        return allFields.find(field => field.name === fieldName);
    }, [formConfig]);
    const isFieldVisible = (0, react_1.useCallback)((fieldConfig) => {
        const { visible } = (0, exports.applyConditionalLogic)(fieldConfig, formState.data);
        return visible;
    }, [formState.data]);
    const isFieldEnabled = (0, react_1.useCallback)((fieldConfig) => {
        const { enabled } = (0, exports.applyConditionalLogic)(fieldConfig, formState.data);
        return enabled;
    }, [formState.data]);
    const isFieldRequired = (0, react_1.useCallback)((fieldConfig) => {
        const { required } = (0, exports.applyConditionalLogic)(fieldConfig, formState.data);
        return required;
    }, [formState.data]);
    const goToStep = (0, react_1.useCallback)((step) => {
        if (!formConfig.steps)
            return;
        const maxStep = formConfig.steps.length - 1;
        const targetStep = Math.max(0, Math.min(step, maxStep));
        setFormState(prev => ({
            ...prev,
            currentStep: targetStep,
            progress: ((targetStep + 1) / formConfig.steps.length) * 100,
        }));
    }, [formConfig.steps]);
    const nextStep = (0, react_1.useCallback)(async () => {
        if (!formConfig.steps || formState.currentStep === undefined)
            return false;
        const currentStepConfig = formConfig.steps[formState.currentStep];
        // Validate current step if required
        if (currentStepConfig.validation === 'onNext') {
            const isValid = await validateForm();
            if (!isValid)
                return false;
        }
        if (formState.currentStep < formConfig.steps.length - 1) {
            goToStep(formState.currentStep + 1);
            return true;
        }
        return false;
    }, [formConfig.steps, formState.currentStep, validateForm, goToStep]);
    const previousStep = (0, react_1.useCallback)(() => {
        if (!formConfig.steps || formState.currentStep === undefined)
            return;
        if (formState.currentStep > 0) {
            goToStep(formState.currentStep - 1);
        }
    }, [formConfig.steps, formState.currentStep, goToStep]);
    return {
        formState,
        formConfig,
        updateField,
        updateFields,
        setFieldError,
        clearFieldError,
        setFieldTouched,
        validateField,
        validateForm,
        submitForm,
        resetForm,
        resetField,
        getFieldValue,
        getFieldConfig,
        isFieldVisible,
        isFieldEnabled,
        isFieldRequired,
        goToStep,
        nextStep,
        previousStep,
    };
};
exports.useFormState = useFormState;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
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
const getAllFields = (formConfig) => {
    const fields = [];
    const extractFields = (fieldConfigs) => {
        fieldConfigs.forEach(field => {
            fields.push(field);
            if (field.groupFields) {
                extractFields(field.groupFields);
            }
            if (field.repeaterConfig?.itemTemplate) {
                extractFields(field.repeaterConfig.itemTemplate);
            }
        });
    };
    if (formConfig.fields) {
        extractFields(formConfig.fields);
    }
    if (formConfig.sections) {
        formConfig.sections.forEach(section => {
            extractFields(section.fields);
        });
    }
    if (formConfig.steps) {
        formConfig.steps.forEach(step => {
            if (step.fields) {
                extractFields(step.fields);
            }
            if (step.sections) {
                step.sections.forEach(section => {
                    extractFields(section.fields);
                });
            }
        });
    }
    return fields;
};
exports.getAllFields = getAllFields;
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
const serializeFormData = (formData, prettyPrint = false) => {
    return JSON.stringify(formData, null, prettyPrint ? 2 : 0);
};
exports.serializeFormData = serializeFormData;
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
const deserializeFormData = (jsonString) => {
    if (!jsonString)
        return null;
    try {
        return JSON.parse(jsonString);
    }
    catch (error) {
        console.error('Error deserializing form data:', error);
        return null;
    }
};
exports.deserializeFormData = deserializeFormData;
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
const calculateFormProgress = (formConfig, formData) => {
    const allFields = (0, exports.getAllFields)(formConfig);
    const visibleFields = allFields.filter(field => {
        const { visible } = (0, exports.applyConditionalLogic)(field, formData);
        return visible;
    });
    if (visibleFields.length === 0)
        return 0;
    const completedFields = visibleFields.filter(field => {
        const value = formData[field.name];
        return value !== undefined && value !== null && value !== '';
    });
    return Math.round((completedFields.length / visibleFields.length) * 100);
};
exports.calculateFormProgress = calculateFormProgress;
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
const exportFormConfig = (formConfig) => {
    return JSON.stringify(formConfig, null, 2);
};
exports.exportFormConfig = exportFormConfig;
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
const importFormConfig = (jsonString) => {
    try {
        return JSON.parse(jsonString);
    }
    catch (error) {
        console.error('Error importing form config:', error);
        return null;
    }
};
exports.importFormConfig = importFormConfig;
// ============================================================================
// CORE FORM COMPONENTS
// ============================================================================
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
const FormProvider = ({ children, formConfig, onSubmit, onChange, onValidationError, initialData, validationMode, }) => {
    const formContext = (0, exports.useFormState)(formConfig, {
        onSubmit,
        onChange,
        onValidationError,
        initialData,
        validationMode,
    });
    return value;
    {
        formContext;
    }
     > { children } < /FormContext.Provider>;
};
exports.FormProvider = FormProvider;
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
const FormBuilder = ({ onSave, onChange, initialConfig, className = '' }) => {
    const [config, setConfig] = (0, react_1.useState)(initialConfig || {
        id: `form-${Date.now()}`,
        title: 'Untitled Form',
        fields: [],
    });
    const handleConfigChange = (0, react_1.useCallback)((newConfig) => {
        setConfig(newConfig);
        onChange?.(newConfig);
    }, [onChange]);
    const handleSave = (0, react_1.useCallback)(() => {
        onSave?.(config);
    }, [config, onSave]);
    return className = {} `form-builder ${className}`;
};
exports.FormBuilder = FormBuilder;
 >
    className;
"form-builder-header" >
    Form;
Builder < /h2>
    < button;
onClick = { handleSave } > Save;
Form < /button>
    < /div>
    < div;
className = "form-builder-content" >
    { /* Builder UI would go here - field palette, canvas, properties panel */}
    < div;
className = "field-palette" >
    { /* Field type buttons */}
    < /div>
    < div;
className = "form-canvas" >
    { /* Drag-drop form preview */}
    < /div>
    < div;
className = "properties-panel" >
    { /* Selected field properties */}
    < /div>
    < /div>
    < /div>;
;
;
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
const FormRenderer = ({ formConfig: propFormConfig, className = '', showSubmitButton = true, showResetButton = false, }) => {
    const context = (0, exports.useFormContext)();
    const formConfig = propFormConfig || context.formConfig;
    const { formState, submitForm, resetForm } = context;
    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitForm();
    };
    if (formConfig.steps) {
        return className;
        {
            className;
        }
        />;
    }
    return onSubmit = { handleSubmit };
    className = {} `form-renderer ${className}`;
};
exports.FormRenderer = FormRenderer;
 >
    className;
"form-header" >
    { formConfig, : .title && { formConfig, : .title } < /h2> };
{
    formConfig.description && { formConfig, : .description } < /p>;
}
/div>;
{
    formConfig.showProgressBar && progress;
    {
        formState.progress || 0;
    }
    />;
}
className;
"form-body" >
    { formConfig, : .sections ? (formConfig.sections.map(section => key = { section, : .id }, section = { section } /  >
        ))
            :
        ,
        formConfig, : .fields ? fields = { formConfig, : .fields } /  >
            :
        ,
        null:  }
    < /div>
    < div;
className = "form-footer" >
    { showSubmitButton } && type;
"submit";
disabled = { formState, : .isSubmitting };
className = "btn-submit"
    >
        { formState, : .isSubmitting ? 'Submitting...' : (formConfig.submitButtonText || 'Submit') }
    < /button>;
{
    showResetButton && type;
    "button";
    onClick = { resetForm };
    className = "btn-reset"
        >
            { formConfig, : .resetButtonText || 'Reset' }
        < /button>;
}
/div>
    < /form>;
;
;
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
const FormPreview = ({ formConfig, formData, className = '' }) => {
    return className = {} `form-preview ${className}`;
};
exports.FormPreview = FormPreview;
 >
    className;
"form-preview-header" >
    { formConfig, : .title } < /h2>;
{
    formConfig.description && { formConfig, : .description } < /p>;
}
/div>
    < div;
className = "form-preview-body" >
    { getAllFields(formConfig) { }, : .map(field => {
            const value = formData[field.name];
            if (value === undefined || value === null || value === '')
                return null;
            return key = { field, : .id };
            className = "form-preview-field" >
                { field, : .label } < /label>
                < div;
            className = "field-value" >
                { Array, : .isArray(value) ? value.join(', ') : String(value) }
                < /div>
                < /div>;
        })
    };
/div>
    < /div>;
;
;
/**
 * FormSection component - Renders a collapsible form section.
 *
 * @example
 * ```tsx
 * <FormSection section={sectionConfig} />
 * ```
 */
const FormSection = ({ section, className = '' }) => {
    const [collapsed, setCollapsed] = (0, react_1.useState)(section.defaultCollapsed || false);
    return className = {} `form-section ${className}`;
};
exports.FormSection = FormSection;
 >
    className;
"form-section-header" >
    { section, : .title } < /h3>;
{
    section.collapsible && type;
    "button";
    onClick = {}();
    setCollapsed(!collapsed);
}
aria - expanded;
{
    !collapsed;
}
    >
        { collapsed, 'Expand': 'Collapse' }
    < /button>;
/div>;
{
    section.description && className;
    "form-section-description" > { section, : .description } < /p>;
}
{
    !collapsed && className;
    "form-section-fields" >
        fields;
    {
        section.fields;
    }
    />
        < /div>;
}
/div>;
;
;
/**
 * FieldList component - Renders a list of fields.
 *
 * @example
 * ```tsx
 * <FieldList fields={fieldConfigs} />
 * ```
 */
const FieldList = ({ fields, className = '' }) => {
    const { isFieldVisible } = (0, exports.useFormContext)();
    return className = {} `field-list ${className}`;
};
exports.FieldList = FieldList;
 >
    { fields, : .map(field => {
            if (!isFieldVisible(field))
                return null;
            return key;
            {
                field.id;
            }
            field = { field } /  > ;
        }) }
    < /div>;
;
;
/**
 * DynamicField component - Renders a field based on its type.
 *
 * @example
 * ```tsx
 * <DynamicField field={fieldConfig} />
 * ```
 */
const DynamicField = ({ field, className = '' }) => {
    const { getFieldValue, updateField, setFieldTouched, validateField, isFieldEnabled, isFieldRequired, formState, } = (0, exports.useFormContext)();
    const value = getFieldValue(field.name);
    const error = formState.errors[field.name];
    const touched = formState.touched.has(field.name);
    const enabled = isFieldEnabled(field);
    const required = isFieldRequired(field);
    const handleChange = (0, react_1.useCallback)((newValue) => {
        updateField(field.name, newValue);
    }, [field.name, updateField]);
    const handleBlur = (0, react_1.useCallback)(() => {
        setFieldTouched(field.name, true);
        validateField(field.name);
    }, [field.name, setFieldTouched, validateField]);
    return field = {};
    {
        field, required;
    }
};
exports.DynamicField = DynamicField;
value = { value };
onChange = { handleChange };
onBlur = { handleBlur };
error = { touched, error: undefined };
disabled = {};
enabled;
className = { className }
    /  >
;
;
;
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
const FieldFactory = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    const fieldProps = {
        field,
        value,
        onChange,
        onBlur,
        error,
        disabled,
        className,
    };
    switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'tel':
        case 'url':
        case 'number':
            return { ...fieldProps } /  > ;
        case 'textarea':
            return { ...fieldProps } /  > ;
        case 'select':
            return { ...fieldProps } /  > ;
        case 'multiselect':
            return { ...fieldProps } /  > ;
        case 'checkbox':
            return { ...fieldProps } /  > ;
        case 'radio':
            return { ...fieldProps } /  > ;
        case 'switch':
            return { ...fieldProps } /  > ;
        case 'date':
        case 'time':
        case 'datetime':
            return { ...fieldProps } /  > ;
        case 'file':
            return { ...fieldProps } /  > ;
        case 'image':
            return { ...fieldProps } /  > ;
        case 'color':
            return { ...fieldProps } /  > ;
        case 'range':
            return { ...fieldProps } /  > ;
        case 'rating':
            return { ...fieldProps } /  > ;
        case 'repeater':
            return { ...fieldProps } /  > ;
        case 'group':
            return { ...fieldProps } /  > ;
        default:
            return { ...fieldProps } /  > ;
    }
};
exports.FieldFactory = FieldFactory;
// ============================================================================
// FIELD COMPONENTS
// ============================================================================
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
const FieldWrapper = ({ field, error, children, className = '' }) => {
    return className = {} `field-wrapper ${className} ${field.containerClassName || ''}`;
};
exports.FieldWrapper = FieldWrapper;
 >
    { field, : .label && htmlFor };
{
    field.id;
}
className = "field-label" >
    { field, : .label };
{
    field.required && className;
    "required-indicator" >  * /span>;
}
{
    field.tooltip && className;
    "tooltip";
    title = { field, : .tooltip } >  ? /span> : ;
}
/label>;
className;
"field-input-wrapper" >
    { field, : .prefix && className, "field-prefix":  > { field, : .prefix } < /span> };
{
    children;
}
{
    field.suffix && className;
    "field-suffix" > { field, : .suffix } < /span>;
}
/div>;
{
    field.helpText && className;
    "field-help-text" > { field, : .helpText } < /p>;
}
{
    error && className;
    "field-error";
    role = "alert" >
        { Array, : .isArray(error) ? error.join(', ') : error }
        < /div>;
}
/div>;
;
;
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
const TextInput = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    const handleChange = (e) => {
        const newValue = field.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        onChange(newValue);
    };
    return field = { field };
    error = { error };
    className = { className } >
        id;
    {
        field.id;
    }
    name = { field, : .name };
    type = { field, : .type };
    value = { value } || '';
};
exports.TextInput = TextInput;
onChange = { handleChange };
onBlur = { onBlur };
disabled = { disabled } || field.disabled;
readOnly = { field, : .readonly };
placeholder = { field, : .placeholder };
required = { field, : .required };
min = { field, : .min };
max = { field, : .max };
step = { field, : .step };
pattern = { field, : .pattern };
autoComplete = { field, : .autoComplete };
autoFocus = { field, : .autoFocus };
className = {} `text-input ${field.className || ''}`;
aria - invalid;
{
    !!error;
}
aria - describedby;
{
    error ? `${field.id}-error` : undefined;
}
/>
    < /FieldWrapper>;
;
;
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
const TextArea = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };
    return field = { field };
    error = { error };
    className = { className } >
        id;
    {
        field.id;
    }
    name = { field, : .name };
    value = { value } || '';
};
exports.TextArea = TextArea;
onChange = { handleChange };
onBlur = { onBlur };
disabled = { disabled } || field.disabled;
readOnly = { field, : .readonly };
placeholder = { field, : .placeholder };
required = { field, : .required };
rows = { field, : .rows || 4 };
cols = { field, : .cols };
className = {} `textarea ${field.className || ''}`;
aria - invalid;
{
    !!error;
}
aria - describedby;
{
    error ? `${field.id}-error` : undefined;
}
/>
    < /FieldWrapper>;
;
;
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
const Select = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };
    return field = { field };
    error = { error };
    className = { className } >
        id;
    {
        field.id;
    }
    name = { field, : .name };
    value = { value } || '';
};
exports.Select = Select;
onChange = { handleChange };
onBlur = { onBlur };
disabled = { disabled } || field.disabled;
required = { field, : .required };
className = {} `select ${field.className || ''}`;
aria - invalid;
{
    !!error;
}
aria - describedby;
{
    error ? `${field.id}-error` : undefined;
}
    >
        { field, : .placeholder && value, "":  > { field, : .placeholder } < /option> };
{
    field.options?.map((option, index) => key = { index }, value = { String(option) { }, : .value });
}
disabled = { option, : .disabled }
    >
        { option, : .label }
    < /option>;
/select>
    < /FieldWrapper>;
;
;
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
const MultiSelect = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    const selectedValues = Array.isArray(value) ? value : [];
    const handleChange = (optionValue) => {
        const newValue = selectedValues.includes(optionValue)
            ? selectedValues.filter(v => v !== optionValue)
            : [...selectedValues, optionValue];
        onChange(newValue);
    };
    return field = { field };
    error = { error };
    className = { className } >
        className;
    {
        `multiselect ${field.className || ''}`;
    }
     >
        { field, : .options?.map((option, index) => key = { index }, className = "multiselect-option" >
                type, "checkbox", checked = { selectedValues, : .includes(option.value) }, onChange = {}()) };
};
exports.MultiSelect = MultiSelect;
handleChange(option.value);
onBlur = { onBlur };
disabled = { disabled } || field.disabled || option.disabled;
/>
    < span > { option, : .label } < /span>;
{
    option.description && className;
    "option-description" > { option, : .description } < /small>;
}
/label>;
/div>
    < /FieldWrapper>;
;
;
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
const Checkbox = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    if (field.options && field.options.length > 0) {
        // Checkbox group
        const selectedValues = Array.isArray(value) ? value : [];
        const handleChange = (optionValue) => {
            const newValue = selectedValues.includes(optionValue)
                ? selectedValues.filter(v => v !== optionValue)
                : [...selectedValues, optionValue];
            onChange(newValue);
        };
        return field = { field };
        error = { error };
        className = { className } >
            className;
        {
            `checkbox-group ${field.className || ''}`;
        }
         >
            { field, : .options.map((option, index) => key = { index }, className = "checkbox-option" >
                    type, "checkbox", checked = { selectedValues, : .includes(option.value) }, onChange = {}()) };
    }
};
exports.Checkbox = Checkbox;
handleChange(option.value);
onBlur = { onBlur };
disabled = { disabled } || field.disabled || option.disabled;
/>
    < span > { option, : .label } < /span>
    < /label>;
/div>
    < /FieldWrapper>;
;
// Single checkbox
return field = { field };
error = { error };
className = { className } >
    className;
{
    `checkbox ${field.className || ''}`;
}
 >
    id;
{
    field.id;
}
name = { field, : .name };
type = "checkbox";
checked = {};
value;
onChange = {}(e);
onChange(e.target.checked);
onBlur = { onBlur };
disabled = { disabled } || field.disabled;
required = { field, : .required }
    /  >
    { field, : .label } < /span>
    < /label>
    < /FieldWrapper>;
;
;
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
const Radio = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    return field = { field };
    error = { error };
    className = { className } >
        className;
    {
        `radio-group ${field.className || ''}`;
    }
    role = "radiogroup" >
        { field, : .options?.map((option, index) => key = { index }, className = "radio-option" >
                type, "radio", name = { field, : .name }, value = { String(option) { }, : .value }) };
    checked = { value } === option.value;
};
exports.Radio = Radio;
onChange = {}();
onChange(option.value);
onBlur = { onBlur };
disabled = { disabled } || field.disabled || option.disabled;
required = { field, : .required }
    /  >
    { option, : .label } < /span>;
{
    option.description && className;
    "option-description" > { option, : .description } < /small>;
}
/label>;
/div>
    < /FieldWrapper>;
;
;
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
const Switch = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    return field = { field };
    error = { error };
    className = { className } >
        className;
    {
        `switch ${field.className || ''}`;
    }
     >
        id;
    {
        field.id;
    }
    name = { field, : .name };
    type = "checkbox";
    role = "switch";
    checked = {};
    value;
};
exports.Switch = Switch;
onChange = {}(e);
onChange(e.target.checked);
onBlur = { onBlur };
disabled = { disabled } || field.disabled;
aria - checked;
{
    !!value;
}
/>
    < span;
className = "switch-slider" > /span>
    < span;
className = "switch-label" > { field, : .label } < /span>
    < /label>
    < /FieldWrapper>;
;
;
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
const DatePicker = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    const inputType = field.type === 'datetime' ? 'datetime-local' : field.type;
    return field = { field };
    error = { error };
    className = { className } >
        id;
    {
        field.id;
    }
    name = { field, : .name };
    type = { inputType };
    value = { value } || '';
};
exports.DatePicker = DatePicker;
onChange = {}(e);
onChange(e.target.value);
onBlur = { onBlur };
disabled = { disabled } || field.disabled;
readOnly = { field, : .readonly };
required = { field, : .required };
min = { field, : .min };
max = { field, : .max };
className = {} `date-picker ${field.className || ''}`;
aria - invalid;
{
    !!error;
}
/>
    < /FieldWrapper>;
;
;
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
const FileUpload = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    const fileInputRef = (0, react_1.useRef)(null);
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (!files)
            return;
        const fileArray = Array.from(files);
        // Validate file size
        if (field.maxFileSize) {
            const invalidFiles = fileArray.filter(file => file.size > field.maxFileSize);
            if (invalidFiles.length > 0) {
                alert(`Some files exceed the maximum size of ${field.maxFileSize} bytes`);
                return;
            }
        }
        // Validate file types
        if (field.allowedFileTypes) {
            const invalidFiles = fileArray.filter(file => !field.allowedFileTypes.some(type => file.type.includes(type)));
            if (invalidFiles.length > 0) {
                alert(`Some files are not of allowed types: ${field.allowedFileTypes.join(', ')}`);
                return;
            }
        }
        onChange(field.multiple ? fileArray : fileArray[0]);
    };
    return field = { field };
    error = { error };
    className = { className } >
        className;
    {
        `file-upload ${field.className || ''}`;
    }
     >
        ref;
    {
        fileInputRef;
    }
    id = { field, : .id };
    name = { field, : .name };
    type = "file";
    onChange = { handleFileChange };
    onBlur = { onBlur };
    disabled = { disabled } || field.disabled;
};
exports.FileUpload = FileUpload;
required = { field, : .required };
multiple = { field, : .multiple };
accept = { field, : .accept || field.allowedFileTypes?.join(',') };
className = "file-input"
    /  >
    type;
"button";
onClick = {}();
fileInputRef.current?.click();
disabled = { disabled } || field.disabled;
className = "file-upload-button"
    >
        Choose;
File;
{
    field.multiple ? 's' : '';
}
/button>;
{
    value && className;
    "file-list" >
        { Array, : .isArray(value) ? (value.map((file, index) => key = { index }, className = "file-item" >
                { file, : .name }({ Math, : .round(file.size / 1024) }, KB)
                < /div>))
                :
        }(className, "file-item" >
            { value, : .name }({ Math, : .round(value.size / 1024) }, KB)
            < /div>);
}
/div>;
/div>
    < /FieldWrapper>;
;
;
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
const ImageUpload = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    const [preview, setPreview] = (0, react_1.useState)(null);
    const fileInputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (value && value instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(value);
        }
        else if (typeof value === 'string') {
            setPreview(value);
        }
        else {
            setPreview(null);
        }
    }, [value]);
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            // Validate file size
            if (field.maxFileSize && file.size > field.maxFileSize) {
                alert(`Image exceeds maximum size of ${field.maxFileSize} bytes`);
                return;
            }
            onChange(file);
        }
    };
    const handleRemove = () => {
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    return field = { field };
    error = { error };
    className = { className } >
        className;
    {
        `image-upload ${field.className || ''}`;
    }
     >
        {};
    className = "remove-button"
        >
            Remove
        < /button>
        < /div>;
};
exports.ImageUpload = ImageUpload;
className = "image-upload-placeholder" >
    ref;
{
    fileInputRef;
}
id = { field, : .id };
name = { field, : .name };
type = "file";
accept = "image/*";
onChange = { handleFileChange };
onBlur = { onBlur };
disabled = { disabled } || field.disabled;
required = { field, : .required };
className = "file-input"
    /  >
    type;
"button";
onClick = {}();
fileInputRef.current?.click();
disabled = { disabled } || field.disabled;
className = "upload-button"
    >
        Upload;
Image
    < /button>
    < /div>;
/div>
    < /FieldWrapper>;
;
;
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
const ColorPicker = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    return field = { field };
    error = { error };
    className = { className } >
        className;
    {
        `color-picker ${field.className || ''}`;
    }
     >
        id;
    {
        field.id;
    }
    name = { field, : .name };
    type = "color";
    value = { value } || '#000000';
};
exports.ColorPicker = ColorPicker;
onChange = {}(e);
onChange(e.target.value);
onBlur = { onBlur };
disabled = { disabled } || field.disabled;
required = { field, : .required };
className = "color-input"
    /  >
    type;
"text";
value = { value } || '';
onChange = {}(e);
onChange(e.target.value);
onBlur = { onBlur };
disabled = { disabled } || field.disabled;
placeholder = "#000000";
pattern = "^#[0-9A-Fa-f]{6}$";
className = "color-text-input"
    /  >
    /div>
    < /FieldWrapper>;
;
;
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
const RangeInput = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    return field = { field };
    error = { error };
    className = { className } >
        className;
    {
        `range-input ${field.className || ''}`;
    }
     >
        id;
    {
        field.id;
    }
    name = { field, : .name };
    type = "range";
    value = { value } || field.min || 0;
};
exports.RangeInput = RangeInput;
onChange = {}(e);
onChange(parseFloat(e.target.value));
onBlur = { onBlur };
disabled = { disabled } || field.disabled;
min = { field, : .min };
max = { field, : .max };
step = { field, : .step };
className = "range-slider"
    /  >
    className;
"range-value" > { value } || field.min || 0;
/output>
    < /div>
    < /FieldWrapper>;
;
;
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
const Rating = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    const maxRating = field.max || 5;
    const [hoveredRating, setHoveredRating] = (0, react_1.useState)(null);
    return field = { field };
    error = { error };
    className = { className } >
        className;
    {
        `rating ${field.className || ''}`;
    }
    onBlur = { onBlur } >
        { Array, : .from({ length: maxRating }, (_, index) => {
                const ratingValue = index + 1;
                const isFilled = ratingValue <= (hoveredRating || value || 0);
                return key = { index };
                type = "button";
                className = {} `rating-star ${isFilled ? 'filled' : ''}`;
            }, onClick = {}()) };
};
exports.Rating = Rating;
onChange(ratingValue);
onMouseEnter = {}();
setHoveredRating(ratingValue);
onMouseLeave = {}();
setHoveredRating(null);
disabled = { disabled } || field.disabled;
aria - label;
{
    `Rate ${ratingValue} out of ${maxRating}`;
}
    >
;
/button>;
;
/div>
    < /FieldWrapper>;
;
;
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
const RepeaterField = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    const items = Array.isArray(value) ? value : [];
    const config = field.repeaterConfig;
    const addItem = () => {
        if (config?.maxItems && items.length >= config.maxItems)
            return;
        const newItem = {};
        config?.itemTemplate.forEach(templateField => {
            if (templateField.defaultValue !== undefined) {
                newItem[templateField.name] = templateField.defaultValue;
            }
        });
        onChange([...items, newItem]);
    };
    const removeItem = (index) => {
        if (config?.minItems && items.length <= config.minItems)
            return;
        onChange(items.filter((_, i) => i !== index));
    };
    const updateItem = (index, itemData) => {
        const newItems = [...items];
        newItems[index] = itemData;
        onChange(newItems);
    };
    const moveItem = (fromIndex, toIndex) => {
        if (!config?.allowReorder)
            return;
        const newItems = [...items];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        onChange(newItems);
    };
    return field = { field };
    error = { error };
    className = { className } >
        className;
    {
        `repeater-field ${field.className || ''}`;
    }
     >
        { items, : .map((item, index) => key = { index }, className = "repeater-item" >
                className, "repeater-item-header" >
                { config, itemLabel, config, : .itemLabel(index) } `Item ${index + 1}`) }
        < /h4>
        < div;
    className = "repeater-item-actions" >
        { config, allowReorder } && index > 0 && type;
    "button";
    onClick = {}();
};
exports.RepeaterField = RepeaterField;
moveItem(index, index - 1);
disabled = { disabled };
aria - label;
"Move up"
    >
;
/button>;
{
    config?.allowReorder && index < items.length - 1 && type;
    "button";
    onClick = {}();
    moveItem(index, index + 1);
}
disabled = { disabled };
aria - label;
"Move down"
    >
;
/button>;
type;
"button";
onClick = {}();
removeItem(index);
disabled = { disabled } || (config?.minItems && items.length <= config.minItems);
className = "remove-item-button"
    >
        { config, removeButtonText } || 'Remove';
/button>
    < /div>
    < /div>
    < div;
className = "repeater-item-fields" >
    { config, itemTemplate, : .map(templateField => key = { templateField, : .id }, field = { templateField }, value = { item, [templateField.name]:  }, onChange = {}(newValue), {
            const: updatedItem = { ...item, [templateField.name]: newValue }
        }) };
disabled = { disabled }
    /  >
;
/div>
    < /div>;
type;
"button";
onClick = { addItem };
disabled = { disabled } || (config?.maxItems && items.length >= config.maxItems);
className = "add-item-button"
    >
        { config, addButtonText } || 'Add Item';
/button>
    < /div>
    < /FieldWrapper>;
;
;
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
const FieldGroup = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
    const groupData = value || {};
    const updateGroupField = (fieldName, fieldValue) => {
        onChange({ ...groupData, [fieldName]: fieldValue });
    };
    return field = { field };
    error = { error };
    className = { className } >
        className;
    {
        `field-group ${field.className || ''}`;
    }
     >
        { field, : .groupFields?.map(groupField => key = { groupField, : .id }, field = { groupField }, value = { groupData, [groupField.name]:  }, onChange = {}(newValue)) };
};
exports.FieldGroup = FieldGroup;
updateGroupField(groupField.name, newValue);
disabled = { disabled }
    /  >
;
/div>
    < /FieldWrapper>;
;
;
// ============================================================================
// FORM WIZARD COMPONENTS
// ============================================================================
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
const FormWizard = ({ className = '' }) => {
    const { formConfig, formState, submitForm, nextStep, previousStep, goToStep, } = (0, exports.useFormContext)();
    if (!formConfig.steps)
        return null;
    const currentStep = formState.currentStep || 0;
    const currentStepConfig = formConfig.steps[currentStep];
    const isLastStep = currentStep === formConfig.steps.length - 1;
    const isFirstStep = currentStep === 0;
    const handleNext = async () => {
        if (isLastStep) {
            await submitForm();
        }
        else {
            await nextStep();
        }
    };
    return className = {} `form-wizard ${className}`;
};
exports.FormWizard = FormWizard;
 >
    />;
{
    formConfig.showProgressBar && progress;
    {
        formState.progress || 0;
    }
    />;
}
className;
"wizard-step-content" >
    className;
"wizard-step-header" >
    { currentStepConfig, : .title } < /h2>;
{
    currentStepConfig.description && ({ currentStepConfig, : .description } < /p>);
}
/div>
    < div;
className = "wizard-step-body" >
    { currentStepConfig, : .sections ? (currentStepConfig.sections.map(section => key = { section, : .id }, section = { section } /  >
        ))
            :
        ,
        currentStepConfig, : .fields ? fields = { currentStepConfig, : .fields } /  >
            :
        ,
        null:  }
    < /div>
    < div;
className = "wizard-step-footer" >
    {};
isFirstStep && type;
"button";
onClick = { previousStep };
className = "btn-previous";
disabled = { formState, : .isSubmitting }
    >
        Previous
    < /button>;
{
    currentStepConfig.canSkip && !isLastStep && type;
    "button";
    onClick = {}();
    goToStep(currentStep + 1);
}
className = "btn-skip"
    >
        Skip
    < /button>;
type;
"button";
onClick = { handleNext };
className = "btn-next";
disabled = { formState, : .isSubmitting }
    >
        { isLastStep, formState, : .isSubmitting
                ? 'Submitting...'
                : formConfig.submitButtonText || 'Submit',
            'Next':  }
    < /button>
    < /div>
    < /div>
    < /div>;
;
;
/**
 * FormStepIndicator component - Visual step indicator for wizard.
 *
 * @example
 * ```tsx
 * <FormStepIndicator />
 * ```
 */
const FormStepIndicator = ({ className = '' }) => {
    const { formConfig, formState, goToStep } = (0, exports.useFormContext)();
    if (!formConfig.steps)
        return null;
    const currentStep = formState.currentStep || 0;
    return className = {} `step-indicator ${className}`;
};
exports.FormStepIndicator = FormStepIndicator;
 >
    { formConfig, : .steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isClickable = index <= currentStep;
            return key = { step, : .id };
            className = {} `step-indicator-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
        }, 
            >
                type, "button", onClick = {}(), isClickable && goToStep(index)) };
disabled = {};
isClickable;
className = "step-indicator-button"
    >
        className;
"step-number" > { index } + 1;
/span>
    < span;
className = "step-title" > { step, : .title } < /span>
    < /button>
    < /div>;
;
/div>;
;
;
/**
 * FormProgress component - Progress bar for forms.
 *
 * @example
 * ```tsx
 * <FormProgress progress={75} />
 * ```
 */
const FormProgress = ({ progress, className = '', showPercentage = true }) => {
    const percentage = Math.min(100, Math.max(0, progress));
    return className = {} `form-progress ${className}`;
};
exports.FormProgress = FormProgress;
 >
    className;
"progress-bar";
role = "progressbar";
aria - valuenow;
{
    percentage;
}
aria - valuemin;
{
    0;
}
aria - valuemax;
{
    100;
}
 >
    className;
"progress-fill";
style = {};
{
    width: `${percentage}%`;
}
 >
    { showPercentage } && className;
"progress-text" > { Math, : .round(percentage) } % /span>;
/div>
    < /div>
    < /div>;
;
;
// ============================================================================
// ADVANCED VALIDATION HOOKS
// ============================================================================
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
const useFieldValidation = (fieldName, delay = 300) => {
    const { validateField, formState } = (0, exports.useFormContext)();
    const [isValidating, setIsValidating] = (0, react_1.useState)(false);
    const timeoutRef = (0, react_1.useRef)();
    const validate = (0, react_1.useCallback)(() => {
        setIsValidating(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(async () => {
            await validateField(fieldName);
            setIsValidating(false);
        }, delay);
    }, [fieldName, delay, validateField]);
    (0, react_1.useEffect)(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return {
        validate,
        isValidating,
        error: formState.errors[fieldName],
    };
};
exports.useFieldValidation = useFieldValidation;
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
const useFormAutoSave = (saveFn, delay = 2000) => {
    const { formState } = (0, exports.useFormContext)();
    const timeoutRef = (0, react_1.useRef)();
    const [isSaving, setIsSaving] = (0, react_1.useState)(false);
    const [lastSaved, setLastSaved] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (formState.dirty.size > 0) {
            timeoutRef.current = setTimeout(async () => {
                setIsSaving(true);
                try {
                    await saveFn(formState.data);
                    setLastSaved(new Date());
                }
                catch (error) {
                    console.error('Auto-save error:', error);
                }
                finally {
                    setIsSaving(false);
                }
            }, delay);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [formState.data, formState.dirty.size, delay, saveFn]);
    return { isSaving, lastSaved };
};
exports.useFormAutoSave = useFormAutoSave;
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
const useFieldDependency = (fieldName, callback) => {
    const { formState } = (0, exports.useFormContext)();
    const prevValueRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        const currentValue = formState.data[fieldName];
        if (prevValueRef.current !== currentValue) {
            callback(currentValue, formState.data);
            prevValueRef.current = currentValue;
        }
    }, [formState.data, fieldName, callback]);
};
exports.useFieldDependency = useFieldDependency;
// Default export with all utilities
exports.default = {
    // Context
    FormContext,
    useFormContext: exports.useFormContext,
    useFormState: exports.useFormState,
    // Utilities
    validateFieldValue: exports.validateFieldValue,
    evaluateCondition: exports.evaluateCondition,
    applyConditionalLogic: exports.applyConditionalLogic,
    getAllFields: exports.getAllFields,
    serializeFormData: exports.serializeFormData,
    deserializeFormData: exports.deserializeFormData,
    calculateFormProgress: exports.calculateFormProgress,
    exportFormConfig: exports.exportFormConfig,
    importFormConfig: exports.importFormConfig,
    // Core Components
    FormProvider: exports.FormProvider,
    FormBuilder: exports.FormBuilder,
    FormRenderer: exports.FormRenderer,
    FormPreview: exports.FormPreview,
    FormSection: exports.FormSection,
    FieldList: exports.FieldList,
    DynamicField: exports.DynamicField,
    FieldFactory: exports.FieldFactory,
    FieldWrapper: exports.FieldWrapper,
    // Field Components
    TextInput: exports.TextInput,
    TextArea: exports.TextArea,
    Select: exports.Select,
    MultiSelect: exports.MultiSelect,
    Checkbox: exports.Checkbox,
    Radio: exports.Radio,
    Switch: exports.Switch,
    DatePicker: exports.DatePicker,
    FileUpload: exports.FileUpload,
    ImageUpload: exports.ImageUpload,
    ColorPicker: exports.ColorPicker,
    RangeInput: exports.RangeInput,
    Rating: exports.Rating,
    RepeaterField: exports.RepeaterField,
    FieldGroup: exports.FieldGroup,
    // Wizard Components
    FormWizard: exports.FormWizard,
    FormStepIndicator: exports.FormStepIndicator,
    FormProgress: exports.FormProgress,
    // Advanced Hooks
    useFieldValidation: exports.useFieldValidation,
    useFormAutoSave: exports.useFormAutoSave,
    useFieldDependency: exports.useFieldDependency,
};
//# sourceMappingURL=form-builder-kit.js.map