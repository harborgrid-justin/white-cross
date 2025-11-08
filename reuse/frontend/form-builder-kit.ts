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

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  createContext,
  useContext,
  ReactNode,
  ChangeEvent,
  FormEvent,
  FocusEvent,
} from 'react';

// ============================================================================
// TYPE DEFINITIONS - CORE FORM TYPES
// ============================================================================

export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'image'
  | 'richtext'
  | 'code'
  | 'color'
  | 'range'
  | 'rating'
  | 'signature'
  | 'repeater'
  | 'group'
  | 'custom';

export type ValidationRuleType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'pattern'
  | 'email'
  | 'url'
  | 'custom';

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
  accept?: string; // for file inputs
  multiple?: boolean;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  rows?: number;
  cols?: number;
  maxFileSize?: number; // in bytes
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
  autoSaveInterval?: number; // in milliseconds
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

// ============================================================================
// FORM CONTEXT
// ============================================================================

const FormContext = createContext<FormContextValue | null>(null);

export const useFormContext = (): FormContextValue => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

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
export const validateFieldValue = async (
  value: any,
  rules: ValidationRule[],
  formData: FormData,
): Promise<string | null> => {
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
          } catch {
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
export const evaluateCondition = (
  condition: ConditionalLogic,
  formData: FormData,
): boolean => {
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
export const applyConditionalLogic = (
  fieldConfig: FieldConfig,
  formData: FormData,
): { visible: boolean; enabled: boolean; required: boolean } => {
  let visible = fieldConfig.visible !== false;
  let enabled = !fieldConfig.disabled;
  let required = fieldConfig.required || false;

  if (fieldConfig.conditionalLogic) {
    for (const condition of fieldConfig.conditionalLogic) {
      const conditionMet = evaluateCondition(condition, formData);

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
export const useFormState = (
  formConfig: FormConfig,
  options: {
    onSubmit?: (data: FormData) => Promise<void> | void;
    onChange?: (data: FormData) => void;
    onValidationError?: (errors: FormErrors) => void;
    initialData?: FormData;
    validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  } = {},
): FormContextValue => {
  const [formState, setFormState] = useState<FormState>(() => {
    const initialData = options.initialData || {};
    const allFields = getAllFields(formConfig);

    // Initialize with default values
    const data: FormData = { ...initialData };
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

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-save functionality
  useEffect(() => {
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

  const updateField = useCallback((fieldName: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [fieldName]: value },
      dirty: new Set([...prev.dirty, fieldName]),
    }));
  }, []);

  const updateFields = useCallback((updates: Partial<FormData>) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, ...updates },
      dirty: new Set([...prev.dirty, ...Object.keys(updates)]),
    }));
  }, []);

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setFormState(prev => ({
      ...prev,
      errors: { ...prev.errors, [fieldName]: error },
      isValid: false,
    }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
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

  const setFieldTouched = useCallback((fieldName: string, touched: boolean = true) => {
    setFormState(prev => {
      const newTouched = new Set(prev.touched);
      if (touched) {
        newTouched.add(fieldName);
      } else {
        newTouched.delete(fieldName);
      }
      return { ...prev, touched: newTouched };
    });
  }, []);

  const validateField = useCallback(async (fieldName: string): Promise<boolean> => {
    const field = getFieldConfig(fieldName);
    if (!field || !field.validation) return true;

    const value = formState.data[fieldName];
    const error = await validateFieldValue(value, field.validation, formState.data);

    if (error) {
      setFieldError(fieldName, error);
      return false;
    } else {
      clearFieldError(fieldName);
      return true;
    }
  }, [formState.data]);

  const validateForm = useCallback(async (): Promise<boolean> => {
    setFormState(prev => ({ ...prev, isValidating: true }));

    const allFields = getAllFields(formConfig);
    const errors: FormErrors = {};

    for (const field of allFields) {
      const { visible, required } = applyConditionalLogic(field, formState.data);

      if (!visible) continue;

      const validationRules = field.validation || [];
      if (required && !validationRules.some(rule => rule.type === 'required')) {
        validationRules.unshift({
          type: 'required',
          message: `${field.label} is required`,
        });
      }

      if (validationRules.length > 0) {
        const value = formState.data[field.name];
        const error = await validateFieldValue(value, validationRules, formState.data);
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

  const submitForm = useCallback(async () => {
    setFormState(prev => ({ ...prev, isSubmitting: true, submitCount: prev.submitCount + 1 }));

    const isValid = await validateForm();

    if (isValid && options.onSubmit) {
      try {
        await options.onSubmit(formState.data);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }

    setFormState(prev => ({ ...prev, isSubmitting: false }));
  }, [formState.data, validateForm, options.onSubmit]);

  const resetForm = useCallback(() => {
    const allFields = getAllFields(formConfig);
    const data: FormData = {};

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

  const resetField = useCallback((fieldName: string) => {
    const field = getFieldConfig(fieldName);
    const defaultValue = field?.defaultValue;

    setFormState(prev => {
      const newData = { ...prev.data };
      if (defaultValue !== undefined) {
        newData[fieldName] = defaultValue;
      } else {
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

  const getFieldValue = useCallback((fieldName: string): any => {
    return formState.data[fieldName];
  }, [formState.data]);

  const getFieldConfig = useCallback((fieldName: string): FieldConfig | undefined => {
    const allFields = getAllFields(formConfig);
    return allFields.find(field => field.name === fieldName);
  }, [formConfig]);

  const isFieldVisible = useCallback((fieldConfig: FieldConfig): boolean => {
    const { visible } = applyConditionalLogic(fieldConfig, formState.data);
    return visible;
  }, [formState.data]);

  const isFieldEnabled = useCallback((fieldConfig: FieldConfig): boolean => {
    const { enabled } = applyConditionalLogic(fieldConfig, formState.data);
    return enabled;
  }, [formState.data]);

  const isFieldRequired = useCallback((fieldConfig: FieldConfig): boolean => {
    const { required } = applyConditionalLogic(fieldConfig, formState.data);
    return required;
  }, [formState.data]);

  const goToStep = useCallback((step: number) => {
    if (!formConfig.steps) return;

    const maxStep = formConfig.steps.length - 1;
    const targetStep = Math.max(0, Math.min(step, maxStep));

    setFormState(prev => ({
      ...prev,
      currentStep: targetStep,
      progress: ((targetStep + 1) / formConfig.steps!.length) * 100,
    }));
  }, [formConfig.steps]);

  const nextStep = useCallback(async (): Promise<boolean> => {
    if (!formConfig.steps || formState.currentStep === undefined) return false;

    const currentStepConfig = formConfig.steps[formState.currentStep];

    // Validate current step if required
    if (currentStepConfig.validation === 'onNext') {
      const isValid = await validateForm();
      if (!isValid) return false;
    }

    if (formState.currentStep < formConfig.steps.length - 1) {
      goToStep(formState.currentStep + 1);
      return true;
    }

    return false;
  }, [formConfig.steps, formState.currentStep, validateForm, goToStep]);

  const previousStep = useCallback(() => {
    if (!formConfig.steps || formState.currentStep === undefined) return;

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
export const getAllFields = (formConfig: FormConfig): FieldConfig[] => {
  const fields: FieldConfig[] = [];

  const extractFields = (fieldConfigs: FieldConfig[]) => {
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
export const serializeFormData = (
  formData: FormData,
  prettyPrint: boolean = false,
): string => {
  return JSON.stringify(formData, null, prettyPrint ? 2 : 0);
};

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
export const deserializeFormData = (jsonString: string | null): FormData | null => {
  if (!jsonString) return null;

  try {
    return JSON.parse(jsonString) as FormData;
  } catch (error) {
    console.error('Error deserializing form data:', error);
    return null;
  }
};

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
export const calculateFormProgress = (
  formConfig: FormConfig,
  formData: FormData,
): number => {
  const allFields = getAllFields(formConfig);
  const visibleFields = allFields.filter(field => {
    const { visible } = applyConditionalLogic(field, formData);
    return visible;
  });

  if (visibleFields.length === 0) return 0;

  const completedFields = visibleFields.filter(field => {
    const value = formData[field.name];
    return value !== undefined && value !== null && value !== '';
  });

  return Math.round((completedFields.length / visibleFields.length) * 100);
};

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
export const exportFormConfig = (formConfig: FormConfig): string => {
  return JSON.stringify(formConfig, null, 2);
};

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
export const importFormConfig = (jsonString: string): FormConfig | null => {
  try {
    return JSON.parse(jsonString) as FormConfig;
  } catch (error) {
    console.error('Error importing form config:', error);
    return null;
  }
};

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
export const FormProvider: React.FC<{
  children: ReactNode;
  formConfig: FormConfig;
  onSubmit?: (data: FormData) => Promise<void> | void;
  onChange?: (data: FormData) => void;
  onValidationError?: (errors: FormErrors) => void;
  initialData?: FormData;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
}> = ({
  children,
  formConfig,
  onSubmit,
  onChange,
  onValidationError,
  initialData,
  validationMode,
}) => {
  const formContext = useFormState(formConfig, {
    onSubmit,
    onChange,
    onValidationError,
    initialData,
    validationMode,
  });

  return <FormContext.Provider value={formContext}>{children}</FormContext.Provider>;
};

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
export const FormBuilder: React.FC<{
  onSave?: (config: FormConfig) => void;
  onChange?: (config: FormConfig) => void;
  initialConfig?: FormConfig;
  className?: string;
}> = ({ onSave, onChange, initialConfig, className = '' }) => {
  const [config, setConfig] = useState<FormConfig>(
    initialConfig || {
      id: `form-${Date.now()}`,
      title: 'Untitled Form',
      fields: [],
    }
  );

  const handleConfigChange = useCallback((newConfig: FormConfig) => {
    setConfig(newConfig);
    onChange?.(newConfig);
  }, [onChange]);

  const handleSave = useCallback(() => {
    onSave?.(config);
  }, [config, onSave]);

  return (
    <div className={`form-builder ${className}`}>
      <div className="form-builder-header">
        <h2>Form Builder</h2>
        <button onClick={handleSave}>Save Form</button>
      </div>
      <div className="form-builder-content">
        {/* Builder UI would go here - field palette, canvas, properties panel */}
        <div className="field-palette">
          {/* Field type buttons */}
        </div>
        <div className="form-canvas">
          {/* Drag-drop form preview */}
        </div>
        <div className="properties-panel">
          {/* Selected field properties */}
        </div>
      </div>
    </div>
  );
};

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
export const FormRenderer: React.FC<{
  formConfig?: FormConfig;
  className?: string;
  showSubmitButton?: boolean;
  showResetButton?: boolean;
}> = ({
  formConfig: propFormConfig,
  className = '',
  showSubmitButton = true,
  showResetButton = false,
}) => {
  const context = useFormContext();
  const formConfig = propFormConfig || context.formConfig;
  const { formState, submitForm, resetForm } = context;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  if (formConfig.steps) {
    return <FormWizard className={className} />;
  }

  return (
    <form onSubmit={handleSubmit} className={`form-renderer ${className}`}>
      <div className="form-header">
        {formConfig.title && <h2>{formConfig.title}</h2>}
        {formConfig.description && <p>{formConfig.description}</p>}
      </div>

      {formConfig.showProgressBar && (
        <FormProgress progress={formState.progress || 0} />
      )}

      <div className="form-body">
        {formConfig.sections ? (
          formConfig.sections.map(section => (
            <FormSection key={section.id} section={section} />
          ))
        ) : formConfig.fields ? (
          <FieldList fields={formConfig.fields} />
        ) : null}
      </div>

      <div className="form-footer">
        {showSubmitButton && (
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="btn-submit"
          >
            {formState.isSubmitting ? 'Submitting...' : (formConfig.submitButtonText || 'Submit')}
          </button>
        )}
        {showResetButton && (
          <button
            type="button"
            onClick={resetForm}
            className="btn-reset"
          >
            {formConfig.resetButtonText || 'Reset'}
          </button>
        )}
      </div>
    </form>
  );
};

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
export const FormPreview: React.FC<{
  formConfig: FormConfig;
  formData: FormData;
  className?: string;
}> = ({ formConfig, formData, className = '' }) => {
  return (
    <div className={`form-preview ${className}`}>
      <div className="form-preview-header">
        <h2>{formConfig.title}</h2>
        {formConfig.description && <p>{formConfig.description}</p>}
      </div>
      <div className="form-preview-body">
        {getAllFields(formConfig).map(field => {
          const value = formData[field.name];
          if (value === undefined || value === null || value === '') return null;

          return (
            <div key={field.id} className="form-preview-field">
              <label>{field.label}</label>
              <div className="field-value">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * FormSection component - Renders a collapsible form section.
 *
 * @example
 * ```tsx
 * <FormSection section={sectionConfig} />
 * ```
 */
export const FormSection: React.FC<{
  section: FormSection;
  className?: string;
}> = ({ section, className = '' }) => {
  const [collapsed, setCollapsed] = useState(section.defaultCollapsed || false);

  return (
    <div className={`form-section ${className}`}>
      <div className="form-section-header">
        <h3>{section.title}</h3>
        {section.collapsible && (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-expanded={!collapsed}
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        )}
      </div>
      {section.description && <p className="form-section-description">{section.description}</p>}
      {!collapsed && (
        <div className="form-section-fields">
          <FieldList fields={section.fields} />
        </div>
      )}
    </div>
  );
};

/**
 * FieldList component - Renders a list of fields.
 *
 * @example
 * ```tsx
 * <FieldList fields={fieldConfigs} />
 * ```
 */
export const FieldList: React.FC<{
  fields: FieldConfig[];
  className?: string;
}> = ({ fields, className = '' }) => {
  const { isFieldVisible } = useFormContext();

  return (
    <div className={`field-list ${className}`}>
      {fields.map(field => {
        if (!isFieldVisible(field)) return null;
        return <DynamicField key={field.id} field={field} />;
      })}
    </div>
  );
};

/**
 * DynamicField component - Renders a field based on its type.
 *
 * @example
 * ```tsx
 * <DynamicField field={fieldConfig} />
 * ```
 */
export const DynamicField: React.FC<{
  field: FieldConfig;
  className?: string;
}> = ({ field, className = '' }) => {
  const {
    getFieldValue,
    updateField,
    setFieldTouched,
    validateField,
    isFieldEnabled,
    isFieldRequired,
    formState,
  } = useFormContext();

  const value = getFieldValue(field.name);
  const error = formState.errors[field.name];
  const touched = formState.touched.has(field.name);
  const enabled = isFieldEnabled(field);
  const required = isFieldRequired(field);

  const handleChange = useCallback((newValue: any) => {
    updateField(field.name, newValue);
  }, [field.name, updateField]);

  const handleBlur = useCallback(() => {
    setFieldTouched(field.name, true);
    validateField(field.name);
  }, [field.name, setFieldTouched, validateField]);

  return (
    <FieldFactory
      field={{ ...field, required }}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched ? error : undefined}
      disabled={!enabled}
      className={className}
    />
  );
};

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
export const FieldFactory: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
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
      return <TextInput {...fieldProps} />;
    case 'textarea':
      return <TextArea {...fieldProps} />;
    case 'select':
      return <Select {...fieldProps} />;
    case 'multiselect':
      return <MultiSelect {...fieldProps} />;
    case 'checkbox':
      return <Checkbox {...fieldProps} />;
    case 'radio':
      return <Radio {...fieldProps} />;
    case 'switch':
      return <Switch {...fieldProps} />;
    case 'date':
    case 'time':
    case 'datetime':
      return <DatePicker {...fieldProps} />;
    case 'file':
      return <FileUpload {...fieldProps} />;
    case 'image':
      return <ImageUpload {...fieldProps} />;
    case 'color':
      return <ColorPicker {...fieldProps} />;
    case 'range':
      return <RangeInput {...fieldProps} />;
    case 'rating':
      return <Rating {...fieldProps} />;
    case 'repeater':
      return <RepeaterField {...fieldProps} />;
    case 'group':
      return <FieldGroup {...fieldProps} />;
    default:
      return <TextInput {...fieldProps} />;
  }
};

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
export const FieldWrapper: React.FC<{
  field: FieldConfig;
  error?: string | string[];
  children: ReactNode;
  className?: string;
}> = ({ field, error, children, className = '' }) => {
  return (
    <div className={`field-wrapper ${className} ${field.containerClassName || ''}`}>
      {field.label && (
        <label htmlFor={field.id} className="field-label">
          {field.label}
          {field.required && <span className="required-indicator">*</span>}
          {field.tooltip && <span className="tooltip" title={field.tooltip}>?</span>}
        </label>
      )}

      <div className="field-input-wrapper">
        {field.prefix && <span className="field-prefix">{field.prefix}</span>}
        {children}
        {field.suffix && <span className="field-suffix">{field.suffix}</span>}
      </div>

      {field.helpText && <p className="field-help-text">{field.helpText}</p>}

      {error && (
        <div className="field-error" role="alert">
          {Array.isArray(error) ? error.join(', ') : error}
        </div>
      )}
    </div>
  );
};

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
export const TextInput: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = field.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <FieldWrapper field={field} error={error} className={className}>
      <input
        id={field.id}
        name={field.name}
        type={field.type}
        value={value || ''}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled || field.disabled}
        readOnly={field.readonly}
        placeholder={field.placeholder}
        required={field.required}
        min={field.min}
        max={field.max}
        step={field.step}
        pattern={field.pattern}
        autoComplete={field.autoComplete}
        autoFocus={field.autoFocus}
        className={`text-input ${field.className || ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${field.id}-error` : undefined}
      />
    </FieldWrapper>
  );
};

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
export const TextArea: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <FieldWrapper field={field} error={error} className={className}>
      <textarea
        id={field.id}
        name={field.name}
        value={value || ''}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled || field.disabled}
        readOnly={field.readonly}
        placeholder={field.placeholder}
        required={field.required}
        rows={field.rows || 4}
        cols={field.cols}
        className={`textarea ${field.className || ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${field.id}-error` : undefined}
      />
    </FieldWrapper>
  );
};

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
export const Select: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <FieldWrapper field={field} error={error} className={className}>
      <select
        id={field.id}
        name={field.name}
        value={value || ''}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled || field.disabled}
        required={field.required}
        className={`select ${field.className || ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${field.id}-error` : undefined}
      >
        {field.placeholder && <option value="">{field.placeholder}</option>}
        {field.options?.map((option, index) => (
          <option
            key={index}
            value={String(option.value)}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
};

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
export const MultiSelect: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  const selectedValues = Array.isArray(value) ? value : [];

  const handleChange = (optionValue: string | number | boolean) => {
    const newValue = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newValue);
  };

  return (
    <FieldWrapper field={field} error={error} className={className}>
      <div className={`multiselect ${field.className || ''}`}>
        {field.options?.map((option, index) => (
          <label key={index} className="multiselect-option">
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleChange(option.value)}
              onBlur={onBlur}
              disabled={disabled || field.disabled || option.disabled}
            />
            <span>{option.label}</span>
            {option.description && (
              <small className="option-description">{option.description}</small>
            )}
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
};

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
export const Checkbox: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  if (field.options && field.options.length > 0) {
    // Checkbox group
    const selectedValues = Array.isArray(value) ? value : [];

    const handleChange = (optionValue: string | number | boolean) => {
      const newValue = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValue);
    };

    return (
      <FieldWrapper field={field} error={error} className={className}>
        <div className={`checkbox-group ${field.className || ''}`}>
          {field.options.map((option, index) => (
            <label key={index} className="checkbox-option">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => handleChange(option.value)}
                onBlur={onBlur}
                disabled={disabled || field.disabled || option.disabled}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </FieldWrapper>
    );
  }

  // Single checkbox
  return (
    <FieldWrapper field={field} error={error} className={className}>
      <label className={`checkbox ${field.className || ''}`}>
        <input
          id={field.id}
          name={field.name}
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          disabled={disabled || field.disabled}
          required={field.required}
        />
        <span>{field.label}</span>
      </label>
    </FieldWrapper>
  );
};

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
export const Radio: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  return (
    <FieldWrapper field={field} error={error} className={className}>
      <div className={`radio-group ${field.className || ''}`} role="radiogroup">
        {field.options?.map((option, index) => (
          <label key={index} className="radio-option">
            <input
              type="radio"
              name={field.name}
              value={String(option.value)}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onBlur={onBlur}
              disabled={disabled || field.disabled || option.disabled}
              required={field.required}
            />
            <span>{option.label}</span>
            {option.description && (
              <small className="option-description">{option.description}</small>
            )}
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
};

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
export const Switch: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  return (
    <FieldWrapper field={field} error={error} className={className}>
      <label className={`switch ${field.className || ''}`}>
        <input
          id={field.id}
          name={field.name}
          type="checkbox"
          role="switch"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          disabled={disabled || field.disabled}
          aria-checked={!!value}
        />
        <span className="switch-slider"></span>
        <span className="switch-label">{field.label}</span>
      </label>
    </FieldWrapper>
  );
};

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
export const DatePicker: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  const inputType = field.type === 'datetime' ? 'datetime-local' : field.type;

  return (
    <FieldWrapper field={field} error={error} className={className}>
      <input
        id={field.id}
        name={field.name}
        type={inputType}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled || field.disabled}
        readOnly={field.readonly}
        required={field.required}
        min={field.min}
        max={field.max}
        className={`date-picker ${field.className || ''}`}
        aria-invalid={!!error}
      />
    </FieldWrapper>
  );
};

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
export const FileUpload: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Validate file size
    if (field.maxFileSize) {
      const invalidFiles = fileArray.filter(file => file.size > field.maxFileSize!);
      if (invalidFiles.length > 0) {
        alert(`Some files exceed the maximum size of ${field.maxFileSize} bytes`);
        return;
      }
    }

    // Validate file types
    if (field.allowedFileTypes) {
      const invalidFiles = fileArray.filter(
        file => !field.allowedFileTypes!.some(type => file.type.includes(type))
      );
      if (invalidFiles.length > 0) {
        alert(`Some files are not of allowed types: ${field.allowedFileTypes.join(', ')}`);
        return;
      }
    }

    onChange(field.multiple ? fileArray : fileArray[0]);
  };

  return (
    <FieldWrapper field={field} error={error} className={className}>
      <div className={`file-upload ${field.className || ''}`}>
        <input
          ref={fileInputRef}
          id={field.id}
          name={field.name}
          type="file"
          onChange={handleFileChange}
          onBlur={onBlur}
          disabled={disabled || field.disabled}
          required={field.required}
          multiple={field.multiple}
          accept={field.accept || field.allowedFileTypes?.join(',')}
          className="file-input"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || field.disabled}
          className="file-upload-button"
        >
          Choose File{field.multiple ? 's' : ''}
        </button>
        {value && (
          <div className="file-list">
            {Array.isArray(value) ? (
              value.map((file, index) => (
                <div key={index} className="file-item">
                  {file.name} ({Math.round(file.size / 1024)}KB)
                </div>
              ))
            ) : (
              <div className="file-item">
                {value.name} ({Math.round(value.size / 1024)}KB)
              </div>
            )}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
};

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
export const ImageUpload: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else if (typeof value === 'string') {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  return (
    <FieldWrapper field={field} error={error} className={className}>
      <div className={`image-upload ${field.className || ''}`}>
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled || field.disabled}
              className="remove-button"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="image-upload-placeholder">
            <input
              ref={fileInputRef}
              id={field.id}
              name={field.name}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              onBlur={onBlur}
              disabled={disabled || field.disabled}
              required={field.required}
              className="file-input"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || field.disabled}
              className="upload-button"
            >
              Upload Image
            </button>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
};

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
export const ColorPicker: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  return (
    <FieldWrapper field={field} error={error} className={className}>
      <div className={`color-picker ${field.className || ''}`}>
        <input
          id={field.id}
          name={field.name}
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled || field.disabled}
          required={field.required}
          className="color-input"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled || field.disabled}
          placeholder="#000000"
          pattern="^#[0-9A-Fa-f]{6}$"
          className="color-text-input"
        />
      </div>
    </FieldWrapper>
  );
};

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
export const RangeInput: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  return (
    <FieldWrapper field={field} error={error} className={className}>
      <div className={`range-input ${field.className || ''}`}>
        <input
          id={field.id}
          name={field.name}
          type="range"
          value={value || field.min || 0}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onBlur={onBlur}
          disabled={disabled || field.disabled}
          min={field.min}
          max={field.max}
          step={field.step}
          className="range-slider"
        />
        <output className="range-value">{value || field.min || 0}</output>
      </div>
    </FieldWrapper>
  );
};

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
export const Rating: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  const maxRating = field.max || 5;
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  return (
    <FieldWrapper field={field} error={error} className={className}>
      <div className={`rating ${field.className || ''}`} onBlur={onBlur}>
        {Array.from({ length: maxRating }, (_, index) => {
          const ratingValue = index + 1;
          const isFilled = ratingValue <= (hoveredRating || value || 0);

          return (
            <button
              key={index}
              type="button"
              className={`rating-star ${isFilled ? 'filled' : ''}`}
              onClick={() => onChange(ratingValue)}
              onMouseEnter={() => setHoveredRating(ratingValue)}
              onMouseLeave={() => setHoveredRating(null)}
              disabled={disabled || field.disabled}
              aria-label={`Rate ${ratingValue} out of ${maxRating}`}
            >
              ★
            </button>
          );
        })}
      </div>
    </FieldWrapper>
  );
};

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
export const RepeaterField: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  const items = Array.isArray(value) ? value : [];
  const config = field.repeaterConfig;

  const addItem = () => {
    if (config?.maxItems && items.length >= config.maxItems) return;

    const newItem: FormData = {};
    config?.itemTemplate.forEach(templateField => {
      if (templateField.defaultValue !== undefined) {
        newItem[templateField.name] = templateField.defaultValue;
      }
    });

    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (config?.minItems && items.length <= config.minItems) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, itemData: FormData) => {
    const newItems = [...items];
    newItems[index] = itemData;
    onChange(newItems);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (!config?.allowReorder) return;
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    onChange(newItems);
  };

  return (
    <FieldWrapper field={field} error={error} className={className}>
      <div className={`repeater-field ${field.className || ''}`}>
        {items.map((item, index) => (
          <div key={index} className="repeater-item">
            <div className="repeater-item-header">
              <h4>
                {config?.itemLabel ? config.itemLabel(index) : `Item ${index + 1}`}
              </h4>
              <div className="repeater-item-actions">
                {config?.allowReorder && index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveItem(index, index - 1)}
                    disabled={disabled}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                )}
                {config?.allowReorder && index < items.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveItem(index, index + 1)}
                    disabled={disabled}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={disabled || (config?.minItems && items.length <= config.minItems)}
                  className="remove-item-button"
                >
                  {config?.removeButtonText || 'Remove'}
                </button>
              </div>
            </div>
            <div className="repeater-item-fields">
              {config?.itemTemplate.map(templateField => (
                <FieldFactory
                  key={templateField.id}
                  field={templateField}
                  value={item[templateField.name]}
                  onChange={(newValue) => {
                    const updatedItem = { ...item, [templateField.name]: newValue };
                    updateItem(index, updatedItem);
                  }}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          disabled={disabled || (config?.maxItems && items.length >= config.maxItems)}
          className="add-item-button"
        >
          {config?.addButtonText || 'Add Item'}
        </button>
      </div>
    </FieldWrapper>
  );
};

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
export const FieldGroup: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string | string[];
  disabled?: boolean;
  className?: string;
}> = ({ field, value, onChange, onBlur, error, disabled, className = '' }) => {
  const groupData = value || {};

  const updateGroupField = (fieldName: string, fieldValue: any) => {
    onChange({ ...groupData, [fieldName]: fieldValue });
  };

  return (
    <FieldWrapper field={field} error={error} className={className}>
      <div className={`field-group ${field.className || ''}`}>
        {field.groupFields?.map(groupField => (
          <FieldFactory
            key={groupField.id}
            field={groupField}
            value={groupData[groupField.name]}
            onChange={(newValue) => updateGroupField(groupField.name, newValue)}
            disabled={disabled}
          />
        ))}
      </div>
    </FieldWrapper>
  );
};

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
export const FormWizard: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const {
    formConfig,
    formState,
    submitForm,
    nextStep,
    previousStep,
    goToStep,
  } = useFormContext();

  if (!formConfig.steps) return null;

  const currentStep = formState.currentStep || 0;
  const currentStepConfig = formConfig.steps[currentStep];
  const isLastStep = currentStep === formConfig.steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = async () => {
    if (isLastStep) {
      await submitForm();
    } else {
      await nextStep();
    }
  };

  return (
    <div className={`form-wizard ${className}`}>
      <FormStepIndicator />

      {formConfig.showProgressBar && (
        <FormProgress progress={formState.progress || 0} />
      )}

      <div className="wizard-step-content">
        <div className="wizard-step-header">
          <h2>{currentStepConfig.title}</h2>
          {currentStepConfig.description && (
            <p>{currentStepConfig.description}</p>
          )}
        </div>

        <div className="wizard-step-body">
          {currentStepConfig.sections ? (
            currentStepConfig.sections.map(section => (
              <FormSection key={section.id} section={section} />
            ))
          ) : currentStepConfig.fields ? (
            <FieldList fields={currentStepConfig.fields} />
          ) : null}
        </div>

        <div className="wizard-step-footer">
          {!isFirstStep && (
            <button
              type="button"
              onClick={previousStep}
              className="btn-previous"
              disabled={formState.isSubmitting}
            >
              Previous
            </button>
          )}

          {currentStepConfig.canSkip && !isLastStep && (
            <button
              type="button"
              onClick={() => goToStep(currentStep + 1)}
              className="btn-skip"
            >
              Skip
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="btn-next"
            disabled={formState.isSubmitting}
          >
            {isLastStep
              ? formState.isSubmitting
                ? 'Submitting...'
                : formConfig.submitButtonText || 'Submit'
              : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * FormStepIndicator component - Visual step indicator for wizard.
 *
 * @example
 * ```tsx
 * <FormStepIndicator />
 * ```
 */
export const FormStepIndicator: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const { formConfig, formState, goToStep } = useFormContext();

  if (!formConfig.steps) return null;

  const currentStep = formState.currentStep || 0;

  return (
    <div className={`step-indicator ${className}`}>
      {formConfig.steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = index <= currentStep;

        return (
          <div
            key={step.id}
            className={`step-indicator-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
          >
            <button
              type="button"
              onClick={() => isClickable && goToStep(index)}
              disabled={!isClickable}
              className="step-indicator-button"
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-title">{step.title}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

/**
 * FormProgress component - Progress bar for forms.
 *
 * @example
 * ```tsx
 * <FormProgress progress={75} />
 * ```
 */
export const FormProgress: React.FC<{
  progress: number;
  className?: string;
  showPercentage?: boolean;
}> = ({ progress, className = '', showPercentage = true }) => {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className={`form-progress ${className}`}>
      <div className="progress-bar" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${percentage}%` }}>
          {showPercentage && <span className="progress-text">{Math.round(percentage)}%</span>}
        </div>
      </div>
    </div>
  );
};

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
export const useFieldValidation = (
  fieldName: string,
  delay: number = 300,
) => {
  const { validateField, formState } = useFormContext();
  const [isValidating, setIsValidating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const validate = useCallback(() => {
    setIsValidating(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      await validateField(fieldName);
      setIsValidating(false);
    }, delay);
  }, [fieldName, delay, validateField]);

  useEffect(() => {
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
export const useFormAutoSave = (
  saveFn: (data: FormData) => Promise<void> | void,
  delay: number = 2000,
) => {
  const { formState } = useFormContext();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (formState.dirty.size > 0) {
      timeoutRef.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          await saveFn(formState.data);
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save error:', error);
        } finally {
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
export const useFieldDependency = (
  fieldName: string,
  callback: (value: any, formData: FormData) => void,
) => {
  const { formState } = useFormContext();
  const prevValueRef = useRef<any>();

  useEffect(() => {
    const currentValue = formState.data[fieldName];

    if (prevValueRef.current !== currentValue) {
      callback(currentValue, formState.data);
      prevValueRef.current = currentValue;
    }
  }, [formState.data, fieldName, callback]);
};

// ============================================================================
// EXPORT ALL TYPES AND COMPONENTS
// ============================================================================

export type {
  FieldType,
  ValidationRuleType,
  ValidationRule,
  FieldOption,
  ConditionalLogic,
  FieldConfig,
  RepeaterConfig,
  FormSection,
  FormStep,
  FormConfig,
  FormData,
  FormErrors,
  FormState,
  FormContextValue,
};

// Default export with all utilities
export default {
  // Context
  FormContext,
  useFormContext,
  useFormState,

  // Utilities
  validateFieldValue,
  evaluateCondition,
  applyConditionalLogic,
  getAllFields,
  serializeFormData,
  deserializeFormData,
  calculateFormProgress,
  exportFormConfig,
  importFormConfig,

  // Core Components
  FormProvider,
  FormBuilder,
  FormRenderer,
  FormPreview,
  FormSection,
  FieldList,
  DynamicField,
  FieldFactory,
  FieldWrapper,

  // Field Components
  TextInput,
  TextArea,
  Select,
  MultiSelect,
  Checkbox,
  Radio,
  Switch,
  DatePicker,
  FileUpload,
  ImageUpload,
  ColorPicker,
  RangeInput,
  Rating,
  RepeaterField,
  FieldGroup,

  // Wizard Components
  FormWizard,
  FormStepIndicator,
  FormProgress,

  // Advanced Hooks
  useFieldValidation,
  useFormAutoSave,
  useFieldDependency,
};
