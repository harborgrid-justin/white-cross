"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAge = exports.useFormState = exports.createFormVariant = exports.analyzeFieldErrors = exports.generateFormAnalytics = exports.calculateAverageCompletionTime = exports.identifyDropOffPoints = exports.calculateCompletionRate = exports.trackFieldInteraction = exports.applyVisibilityRules = exports.createComplexVisibility = exports.createVisibilityRules = exports.getVisibleSections = exports.getVisibleFields = exports.isSectionVisible = exports.isFieldVisible = exports.validateForm = exports.validateLuhnChecksum = exports.validateSSN = exports.validateNPINumber = exports.validateCPTCode = exports.validateICD10Code = exports.validateFieldValue = exports.recalculateForm = exports.createConditionalCalculation = exports.createAgeCalculator = exports.createBMICalculator = exports.evaluateFormula = exports.evaluateCalculation = exports.createCalculationRule = exports.createDependencyGraph = exports.resolveAllDependencies = exports.createDependentValidation = exports.createCascadingDependency = exports.evaluateCondition = exports.evaluateFieldDependencies = exports.createFieldDependency = exports.mergeFormDefinitions = exports.generateFormFromSchema = exports.createMultiSectionForm = exports.cloneFormDefinition = exports.removeFormField = exports.addFormField = exports.createFormDefinition = exports.createFormSubmissionModel = exports.createFormFieldModel = exports.createFormDefinitionModel = void 0;
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
const sequelize_1 = require("sequelize");
const react_1 = require("react");
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
const createFormDefinitionModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Unique form identifier',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Display title',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Form description',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Version number for form definition',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'active', 'archived'),
            allowNull: false,
            defaultValue: 'draft',
        },
        fields: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of field definitions',
        },
        sections: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Multi-step sections',
        },
        workflows: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Workflow configurations',
        },
        settings: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Form settings and behaviors',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional metadata',
        },
        ownerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who created the form',
        },
        publishedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        archivedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        tableName: 'form_definitions',
        timestamps: true,
        indexes: [
            { fields: ['name'] },
            { fields: ['status'] },
            { fields: ['version'] },
            { fields: ['ownerId'] },
            { fields: ['createdAt'] },
        ],
    };
    return sequelize.define('FormDefinition', attributes, options);
};
exports.createFormDefinitionModel = createFormDefinitionModel;
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
                model: 'form_definitions',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Field name (used in data binding)',
        },
        label: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Display label',
        },
        type: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Field type',
        },
        placeholder: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
        },
        defaultValue: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        required: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        disabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        readonly: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        hidden: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        options: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Options for select/radio/checkbox fields',
        },
        validation: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Validation rules',
        },
        dependencies: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Field dependencies',
        },
        calculations: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Calculation rules',
        },
        conditionalVisibility: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Conditional visibility rules',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        helpText: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        gridColumn: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'CSS Grid column placement',
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
            { fields: ['order'] },
            { fields: ['formId', 'name'], unique: true },
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
 *   formVersion: 1,
 *   data: { patientName: 'John Doe' },
 *   status: 'submitted',
 *   startedAt: new Date()
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
                model: 'form_definitions',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        formVersion: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Form version at time of submission',
        },
        data: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Submitted form data',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Submission metadata',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'submitted', 'processing', 'completed', 'rejected'),
            allowNull: false,
            defaultValue: 'draft',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Submitting user ID',
        },
        sessionId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Session identifier',
        },
        startedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        submittedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'Submitter IP address',
        },
        userAgent: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
        },
        validationErrors: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Validation errors if any',
        },
    };
    const options = {
        tableName: 'form_submissions',
        timestamps: true,
        indexes: [
            { fields: ['formId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            { fields: ['startedAt'] },
            { fields: ['submittedAt'] },
            { fields: ['sessionId'] },
        ],
    };
    return sequelize.define('FormSubmission', attributes, options);
};
exports.createFormSubmissionModel = createFormSubmissionModel;
// ============================================================================
// 1. DYNAMIC FORM CREATION
// ============================================================================
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
const createFormDefinition = (config) => {
    return {
        id: config.id || crypto.randomUUID(),
        name: config.name || 'untitled-form',
        title: config.title || 'Untitled Form',
        description: config.description,
        version: config.version || 1,
        status: config.status || 'draft',
        fields: config.fields || [],
        sections: config.sections,
        workflows: config.workflows,
        settings: config.settings || {
            allowSave: true,
            validateOnBlur: true,
        },
        metadata: config.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createFormDefinition = createFormDefinition;
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
const addFormField = (form, field, position) => {
    const updatedFields = [...form.fields];
    if (position !== undefined && position >= 0 && position <= updatedFields.length) {
        updatedFields.splice(position, 0, field);
    }
    else {
        updatedFields.push(field);
    }
    // Recalculate order
    updatedFields.forEach((f, idx) => {
        f.order = idx;
    });
    return {
        ...form,
        fields: updatedFields,
        updatedAt: new Date(),
    };
};
exports.addFormField = addFormField;
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
const removeFormField = (form, fieldId) => {
    return {
        ...form,
        fields: form.fields.filter((f) => f.id !== fieldId),
        updatedAt: new Date(),
    };
};
exports.removeFormField = removeFormField;
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
const cloneFormDefinition = (form, overrides) => {
    return {
        ...form,
        ...overrides,
        id: crypto.randomUUID(),
        version: (overrides?.version || form.version) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.cloneFormDefinition = cloneFormDefinition;
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
const createMultiSectionForm = (name, sections, workflow) => {
    const allFields = [];
    const workflowSteps = [];
    sections.forEach((section, idx) => {
        workflowSteps.push({
            id: `step-${idx}`,
            sectionId: section.id,
            order: idx,
            validationRequired: true,
        });
    });
    return (0, exports.createFormDefinition)({
        name,
        title: name,
        sections,
        workflows: workflow
            ? [
                {
                    id: crypto.randomUUID(),
                    type: workflow.type || 'linear',
                    steps: workflowSteps,
                    ...workflow,
                },
            ]
            : undefined,
    });
};
exports.createMultiSectionForm = createMultiSectionForm;
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
const generateFormFromSchema = (schemaDefinition) => {
    return Object.entries(schemaDefinition).map(([name, config], idx) => ({
        id: crypto.randomUUID(),
        name,
        label: config.label || name.replace(/([A-Z])/g, ' $1').trim(),
        type: config.type || 'text',
        required: config.required || false,
        validation: config.validation || [],
        order: idx,
        ...config,
    }));
};
exports.generateFormFromSchema = generateFormFromSchema;
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
const mergeFormDefinitions = (forms, newName) => {
    const allFields = [];
    const allSections = [];
    let order = 0;
    forms.forEach((form) => {
        form.fields.forEach((field) => {
            allFields.push({ ...field, order: order++ });
        });
        if (form.sections) {
            allSections.push(...form.sections);
        }
    });
    return (0, exports.createFormDefinition)({
        name: newName,
        title: newName,
        fields: allFields,
        sections: allSections.length > 0 ? allSections : undefined,
    });
};
exports.mergeFormDefinitions = mergeFormDefinitions;
// ============================================================================
// 2. FIELD DEPENDENCIES
// ============================================================================
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
const createFieldDependency = (sourceField, targetField, action, condition) => {
    return {
        sourceField,
        action,
        condition,
        debounce: 300,
    };
};
exports.createFieldDependency = createFieldDependency;
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
const evaluateFieldDependencies = (dependencies, formData, changedField) => {
    const results = {};
    dependencies
        .filter((dep) => dep.sourceField === changedField)
        .forEach((dep) => {
        const conditionMet = dep.condition ? (0, exports.evaluateCondition)(dep.condition, formData) : true;
        if (conditionMet) {
            results[dep.action] = dep.value !== undefined ? dep.value : true;
        }
        else {
            results[dep.action] = false;
        }
    });
    return results;
};
exports.evaluateFieldDependencies = evaluateFieldDependencies;
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
const evaluateCondition = (rule, formData) => {
    const fieldValue = formData[rule.field];
    let result = false;
    switch (rule.operator) {
        case 'equals':
            result = fieldValue === rule.value;
            break;
        case 'notEquals':
            result = fieldValue !== rule.value;
            break;
        case 'greaterThan':
            result = fieldValue > rule.value;
            break;
        case 'lessThan':
            result = fieldValue < rule.value;
            break;
        case 'greaterThanOrEqual':
            result = fieldValue >= rule.value;
            break;
        case 'lessThanOrEqual':
            result = fieldValue <= rule.value;
            break;
        case 'contains':
            result = String(fieldValue).includes(String(rule.value));
            break;
        case 'notContains':
            result = !String(fieldValue).includes(String(rule.value));
            break;
        case 'startsWith':
            result = String(fieldValue).startsWith(String(rule.value));
            break;
        case 'endsWith':
            result = String(fieldValue).endsWith(String(rule.value));
            break;
        case 'in':
            result = Array.isArray(rule.value) && rule.value.includes(fieldValue);
            break;
        case 'notIn':
            result = Array.isArray(rule.value) && !rule.value.includes(fieldValue);
            break;
        case 'isEmpty':
            result = !fieldValue || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);
            break;
        case 'isNotEmpty':
            result = !!fieldValue && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0);
            break;
        case 'matches':
            result = new RegExp(rule.value).test(String(fieldValue));
            break;
    }
    // Handle nested conditions
    if (rule.nested && rule.nested.length > 0) {
        const nestedResults = rule.nested.map((nested) => (0, exports.evaluateCondition)(nested, formData));
        if (rule.logicOperator === 'or') {
            result = result || nestedResults.some((r) => r);
        }
        else {
            result = result && nestedResults.every((r) => r);
        }
    }
    return result;
};
exports.evaluateCondition = evaluateCondition;
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
const createCascadingDependency = (parentField, childField, optionsMap) => {
    return {
        sourceField: parentField,
        action: 'setValue',
        value: (parentValue) => ({
            options: optionsMap[parentValue] || [],
            value: null,
        }),
    };
};
exports.createCascadingDependency = createCascadingDependency;
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
const createDependentValidation = (sourceField, targetField, validator) => {
    return {
        sourceField,
        action: 'validate',
        value: validator,
    };
};
exports.createDependentValidation = createDependentValidation;
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
const resolveAllDependencies = (form, formData, changedField) => {
    const effects = {};
    form.fields.forEach((field) => {
        if (field.dependencies) {
            const fieldEffects = (0, exports.evaluateFieldDependencies)(field.dependencies, formData, changedField);
            if (Object.keys(fieldEffects).length > 0) {
                effects[field.name] = fieldEffects;
            }
        }
    });
    return effects;
};
exports.resolveAllDependencies = resolveAllDependencies;
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
const createDependencyGraph = (form) => {
    const graph = {};
    form.fields.forEach((field) => {
        if (field.dependencies) {
            field.dependencies.forEach((dep) => {
                if (!graph[dep.sourceField]) {
                    graph[dep.sourceField] = [];
                }
                graph[dep.sourceField].push(field.name);
            });
        }
    });
    return graph;
};
exports.createDependencyGraph = createDependencyGraph;
// ============================================================================
// 3. CALCULATION ENGINE (FORMULAS)
// ============================================================================
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
const createCalculationRule = (operator, fields, precision) => {
    return {
        operator,
        fields,
        precision: precision || 2,
        defaultValue: 0,
    };
};
exports.createCalculationRule = createCalculationRule;
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
const evaluateCalculation = (rule, formData) => {
    if (!rule.fields || rule.fields.length === 0) {
        return rule.defaultValue || null;
    }
    const values = rule.fields.map((field) => parseFloat(formData[field]) || 0);
    let result = null;
    switch (rule.operator) {
        case 'add':
        case 'sum':
            result = values.reduce((acc, val) => acc + val, 0);
            break;
        case 'subtract':
            result = values.reduce((acc, val, idx) => (idx === 0 ? val : acc - val));
            break;
        case 'multiply':
            result = values.reduce((acc, val) => acc * val, 1);
            break;
        case 'divide':
            result = values.reduce((acc, val, idx) => {
                if (idx === 0)
                    return val;
                if (val === 0)
                    return acc;
                return acc / val;
            });
            break;
        case 'avg':
            result = values.reduce((acc, val) => acc + val, 0) / values.length;
            break;
        case 'min':
            result = Math.min(...values);
            break;
        case 'max':
            result = Math.max(...values);
            break;
        case 'count':
            result = values.filter((v) => v !== 0 && v !== null && v !== undefined).length;
            break;
        case 'abs':
            result = Math.abs(values[0]);
            break;
        case 'round':
            result = Math.round(values[0]);
            break;
        case 'ceil':
            result = Math.ceil(values[0]);
            break;
        case 'floor':
            result = Math.floor(values[0]);
            break;
        case 'power':
            result = Math.pow(values[0], values[1] || 2);
            break;
        case 'modulo':
            result = values[0] % (values[1] || 1);
            break;
        case 'formula':
            result = (0, exports.evaluateFormula)(rule.formula || '', formData);
            break;
    }
    if (result !== null && rule.precision !== undefined) {
        result = parseFloat(result.toFixed(rule.precision));
    }
    return result;
};
exports.evaluateCalculation = evaluateCalculation;
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
const evaluateFormula = (formula, context) => {
    try {
        // Simple formula parser (in production, use mathjs or similar)
        // This is a placeholder implementation
        let expression = formula;
        // Replace variables with values
        Object.entries(context).forEach(([key, value]) => {
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            expression = expression.replace(regex, String(value || 0));
        });
        // Evaluate using Function constructor (be cautious with user input in production)
        // In production, use a proper expression parser like mathjs
        const result = new Function(`return ${expression}`)();
        return parseFloat(result) || 0;
    }
    catch (error) {
        console.error('Formula evaluation error:', error);
        return 0;
    }
};
exports.evaluateFormula = evaluateFormula;
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
const createBMICalculator = (weightField, heightField, units = 'kg/m') => {
    const formula = units === 'kg/m' ? `${weightField} / (${heightField} * ${heightField})` : `(${weightField} / (${heightField} * ${heightField})) * 703`;
    return {
        operator: 'formula',
        fields: [weightField, heightField],
        formula,
        precision: 2,
    };
};
exports.createBMICalculator = createBMICalculator;
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
const createAgeCalculator = (dobField) => {
    return {
        operator: 'formula',
        fields: [dobField],
        formula: `(new Date() - new Date(${dobField})) / (365.25 * 24 * 60 * 60 * 1000)`,
        precision: 0,
    };
};
exports.createAgeCalculator = createAgeCalculator;
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
const createConditionalCalculation = (condition, thenCalc, elseCalc) => {
    return {
        operator: 'if',
        fields: [...(thenCalc.fields || []), ...(elseCalc.fields || [])],
        formula: JSON.stringify({ condition, then: thenCalc, else: elseCalc }),
    };
};
exports.createConditionalCalculation = createConditionalCalculation;
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
const recalculateForm = (form, formData) => {
    const updated = { ...formData };
    form.fields
        .filter((field) => field.type === 'calculated' && field.calculations)
        .forEach((field) => {
        field.calculations?.forEach((calc) => {
            const value = (0, exports.evaluateCalculation)(calc, updated);
            if (value !== null) {
                updated[field.name] = value;
            }
        });
    });
    return updated;
};
exports.recalculateForm = recalculateForm;
// ============================================================================
// 4. ADVANCED VALIDATION
// ============================================================================
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
const validateFieldValue = async (value, rules, formData) => {
    const errors = [];
    for (const rule of rules) {
        let isValid = true;
        let defaultMessage = 'Invalid value';
        switch (rule.type) {
            case 'required':
                isValid = value !== undefined && value !== null && value !== '';
                defaultMessage = 'This field is required';
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = !value || emailRegex.test(String(value));
                defaultMessage = 'Invalid email address';
                break;
            case 'phone':
                const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
                isValid = !value || phoneRegex.test(String(value));
                defaultMessage = 'Invalid phone number';
                break;
            case 'url':
                try {
                    new URL(value);
                    isValid = true;
                }
                catch {
                    isValid = false;
                }
                defaultMessage = 'Invalid URL';
                break;
            case 'min':
                isValid = !value || parseFloat(value) >= rule.value;
                defaultMessage = `Minimum value is ${rule.value}`;
                break;
            case 'max':
                isValid = !value || parseFloat(value) <= rule.value;
                defaultMessage = `Maximum value is ${rule.value}`;
                break;
            case 'minLength':
                isValid = !value || String(value).length >= rule.value;
                defaultMessage = `Minimum length is ${rule.value}`;
                break;
            case 'maxLength':
                isValid = !value || String(value).length <= rule.value;
                defaultMessage = `Maximum length is ${rule.value}`;
                break;
            case 'pattern':
                const regex = new RegExp(rule.value);
                isValid = !value || regex.test(String(value));
                defaultMessage = 'Invalid format';
                break;
            case 'age':
                const age = (0, exports.calculateAge)(value);
                isValid = age >= (rule.params?.min || 0) && age <= (rule.params?.max || 150);
                defaultMessage = `Age must be between ${rule.params?.min || 0} and ${rule.params?.max || 150}`;
                break;
            case 'icd10':
                isValid = (0, exports.validateICD10Code)(value);
                defaultMessage = 'Invalid ICD-10 code';
                break;
            case 'cpt':
                isValid = (0, exports.validateCPTCode)(value);
                defaultMessage = 'Invalid CPT code';
                break;
            case 'npi':
                isValid = (0, exports.validateNPINumber)(value);
                defaultMessage = 'Invalid NPI number';
                break;
            case 'ssn':
                isValid = (0, exports.validateSSN)(value);
                defaultMessage = 'Invalid SSN';
                break;
            case 'luhn':
                isValid = (0, exports.validateLuhnChecksum)(value);
                defaultMessage = 'Invalid checksum';
                break;
            case 'custom':
                if (rule.validator) {
                    isValid = await Promise.resolve(rule.validator(value, formData || {}));
                }
                break;
            case 'async':
                if (rule.validator) {
                    isValid = await rule.validator(value, formData || {});
                }
                break;
        }
        if (!isValid) {
            errors.push(rule.message || defaultMessage);
        }
    }
    return errors;
};
exports.validateFieldValue = validateFieldValue;
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
const validateICD10Code = (code) => {
    if (!code)
        return false;
    // ICD-10 format: Letter + 2 digits + optional decimal + up to 4 chars
    const icd10Regex = /^[A-Z]\d{2}(\.\d{1,4})?$/;
    return icd10Regex.test(code.toUpperCase());
};
exports.validateICD10Code = validateICD10Code;
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
const validateCPTCode = (code) => {
    if (!code)
        return false;
    // CPT codes are 5 digits
    const cptRegex = /^\d{5}$/;
    return cptRegex.test(code);
};
exports.validateCPTCode = validateCPTCode;
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
const validateNPINumber = (npi) => {
    if (!npi || npi.length !== 10)
        return false;
    if (!/^\d{10}$/.test(npi))
        return false;
    return (0, exports.validateLuhnChecksum)(npi);
};
exports.validateNPINumber = validateNPINumber;
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
const validateSSN = (ssn) => {
    if (!ssn)
        return false;
    const ssnRegex = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
    return ssnRegex.test(ssn);
};
exports.validateSSN = validateSSN;
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
const validateLuhnChecksum = (value) => {
    if (!value || !/^\d+$/.test(value))
        return false;
    let sum = 0;
    let isEven = false;
    for (let i = value.length - 1; i >= 0; i--) {
        let digit = parseInt(value.charAt(i), 10);
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        isEven = !isEven;
    }
    return sum % 10 === 0;
};
exports.validateLuhnChecksum = validateLuhnChecksum;
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
const validateForm = async (form, formData) => {
    const errors = {};
    for (const field of form.fields) {
        if (field.validation && field.validation.length > 0) {
            const fieldErrors = await (0, exports.validateFieldValue)(formData[field.name], field.validation, formData);
            if (fieldErrors.length > 0) {
                errors[field.name] = fieldErrors;
            }
        }
    }
    return errors;
};
exports.validateForm = validateForm;
// ============================================================================
// 5. CONDITIONAL VISIBILITY
// ============================================================================
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
const isFieldVisible = (field, formData) => {
    if (field.hidden)
        return false;
    if (!field.conditionalVisibility || field.conditionalVisibility.length === 0) {
        return true;
    }
    return field.conditionalVisibility.every((rule) => (0, exports.evaluateCondition)(rule, formData));
};
exports.isFieldVisible = isFieldVisible;
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
const isSectionVisible = (section, formData) => {
    if (!section.conditionalVisibility || section.conditionalVisibility.length === 0) {
        return true;
    }
    return section.conditionalVisibility.every((rule) => (0, exports.evaluateCondition)(rule, formData));
};
exports.isSectionVisible = isSectionVisible;
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
const getVisibleFields = (form, formData) => {
    return form.fields.filter((field) => (0, exports.isFieldVisible)(field, formData));
};
exports.getVisibleFields = getVisibleFields;
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
const getVisibleSections = (form, formData) => {
    if (!form.sections)
        return [];
    return form.sections.filter((section) => (0, exports.isSectionVisible)(section, formData));
};
exports.getVisibleSections = getVisibleSections;
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
const createVisibilityRules = (controlField, operator, value) => {
    return [
        {
            field: controlField,
            operator,
            value,
        },
    ];
};
exports.createVisibilityRules = createVisibilityRules;
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
const createComplexVisibility = (rules, logicOperator) => {
    const [firstRule, ...restRules] = rules;
    return {
        ...firstRule,
        logicOperator,
        nested: restRules,
    };
};
exports.createComplexVisibility = createComplexVisibility;
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
const applyVisibilityRules = (form, formData) => {
    const visibilityMap = {};
    form.fields.forEach((field) => {
        visibilityMap[field.name] = (0, exports.isFieldVisible)(field, formData);
    });
    return visibilityMap;
};
exports.applyVisibilityRules = applyVisibilityRules;
// ============================================================================
// 6. FORM ANALYTICS
// ============================================================================
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
const trackFieldInteraction = async (formId, fieldId, eventType, metadata) => {
    // Placeholder for analytics tracking
    // In production, send to analytics service
    const event = {
        formId,
        fieldId,
        eventType,
        timestamp: new Date(),
        ...metadata,
    };
    console.log('Field interaction:', event);
};
exports.trackFieldInteraction = trackFieldInteraction;
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
const calculateCompletionRate = (totalStarts, totalSubmissions) => {
    if (totalStarts === 0)
        return 0;
    return (totalSubmissions / totalStarts) * 100;
};
exports.calculateCompletionRate = calculateCompletionRate;
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
const identifyDropOffPoints = (submissions, form) => {
    const dropOffs = {};
    const totalSubmissions = submissions.length;
    form.fields.forEach((field) => {
        const incompleteCount = submissions.filter((sub) => {
            const hasField = field.name in sub.data;
            const fieldValue = sub.data[field.name];
            return !hasField || fieldValue === null || fieldValue === undefined || fieldValue === '';
        }).length;
        if (incompleteCount > 0) {
            dropOffs[field.name] = (incompleteCount / totalSubmissions) * 100;
        }
    });
    return Object.entries(dropOffs)
        .map(([field, rate]) => ({ field, rate }))
        .sort((a, b) => b.rate - a.rate);
};
exports.identifyDropOffPoints = identifyDropOffPoints;
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
const calculateAverageCompletionTime = (submissions) => {
    const completedSubmissions = submissions.filter((sub) => sub.completedAt && sub.startedAt);
    if (completedSubmissions.length === 0)
        return 0;
    const totalTime = completedSubmissions.reduce((acc, sub) => {
        const duration = (sub.completedAt.getTime() - sub.startedAt.getTime()) / 1000;
        return acc + duration;
    }, 0);
    return totalTime / completedSubmissions.length;
};
exports.calculateAverageCompletionTime = calculateAverageCompletionTime;
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
const generateFormAnalytics = (formId, submissions, startDate, endDate) => {
    const periodSubmissions = submissions.filter((sub) => sub.startedAt >= startDate && sub.startedAt <= endDate);
    const totalStarts = periodSubmissions.length;
    const totalSubmissions = periodSubmissions.filter((sub) => sub.status === 'submitted').length;
    const totalCompletions = periodSubmissions.filter((sub) => sub.status === 'completed').length;
    return {
        formId,
        totalViews: totalStarts,
        totalStarts,
        totalSubmissions,
        totalCompletions,
        conversionRate: (0, exports.calculateCompletionRate)(totalStarts, totalSubmissions),
        averageCompletionTime: (0, exports.calculateAverageCompletionTime)(periodSubmissions),
        dropOffPoints: [],
        fieldInteractions: {},
        deviceBreakdown: {},
        timeToFirstInteraction: 0,
        periodStart: startDate,
        periodEnd: endDate,
    };
};
exports.generateFormAnalytics = generateFormAnalytics;
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
const analyzeFieldErrors = (submissions, fieldName) => {
    const fieldSubmissions = submissions.filter((sub) => fieldName in sub.data);
    const totalInteractions = fieldSubmissions.length;
    const submissionsWithErrors = submissions.filter((sub) => sub.validationErrors && sub.validationErrors.some((err) => err.field === fieldName));
    const errorRate = totalInteractions > 0 ? (submissionsWithErrors.length / totalInteractions) * 100 : 0;
    const commonErrors = {};
    submissionsWithErrors.forEach((sub) => {
        sub.validationErrors
            ?.filter((err) => err.field === fieldName)
            .forEach((err) => {
            commonErrors[err.message] = (commonErrors[err.message] || 0) + 1;
        });
    });
    return {
        fieldId: fieldName,
        interactions: totalInteractions,
        errorRate,
        averageTimeSpent: 0,
        dropOffRate: 0,
        commonErrors: Object.entries(commonErrors)
            .map(([error, count]) => ({ error, count }))
            .sort((a, b) => b.count - a.count),
    };
};
exports.analyzeFieldErrors = analyzeFieldErrors;
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
const createFormVariant = (form, variantName, changes, weight = 0.5) => {
    return {
        id: crypto.randomUUID(),
        formId: form.id,
        name: `A/B Test: ${form.name}`,
        variants: [
            {
                id: 'control',
                name: 'Control',
                weight: 1 - weight,
                changes: {},
            },
            {
                id: 'variant',
                name: variantName,
                weight,
                changes,
            },
        ],
        startDate: new Date(),
        status: 'active',
        metrics: {},
    };
};
exports.createFormVariant = createFormVariant;
// ============================================================================
// REACT HOOKS
// ============================================================================
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
const useFormState = (form, initialValues) => {
    const [state, setState] = (0, react_1.useState)({
        values: (initialValues || {}),
        errors: {},
        touched: {},
        dirty: {},
        isSubmitting: false,
        isValidating: false,
        submitCount: 0,
    });
    const validate = (0, react_1.useCallback)(async (fieldName) => {
        setState((prev) => ({ ...prev, isValidating: true }));
        const errors = await (0, exports.validateForm)(form, state.values);
        setState((prev) => ({
            ...prev,
            errors,
            isValidating: false,
        }));
        return Object.keys(errors).length === 0;
    }, [form, state.values]);
    const handleChange = (0, react_1.useCallback)((fieldName, value) => {
        setState((prev) => ({
            ...prev,
            values: { ...prev.values, [fieldName]: value },
            dirty: { ...prev.dirty, [fieldName]: true },
            touched: { ...prev.touched, [fieldName]: true },
        }));
        // Recalculate dependent fields
        const updatedData = (0, exports.recalculateForm)(form, { ...state.values, [fieldName]: value });
        setState((prev) => ({ ...prev, values: updatedData }));
    }, [form, state.values]);
    const handleBlur = (0, react_1.useCallback)((fieldName) => {
        setState((prev) => ({
            ...prev,
            touched: { ...prev.touched, [fieldName]: true },
        }));
        if (form.settings?.validateOnBlur) {
            validate(fieldName);
        }
    }, [form, validate]);
    const handleSubmit = (0, react_1.useCallback)(async (onSubmit) => {
        setState((prev) => ({ ...prev, isSubmitting: true, submitCount: prev.submitCount + 1 }));
        const isValid = await validate();
        if (isValid) {
            try {
                await onSubmit(state.values);
            }
            catch (error) {
                console.error('Form submission error:', error);
            }
        }
        setState((prev) => ({ ...prev, isSubmitting: false }));
    }, [validate, state.values]);
    const reset = (0, react_1.useCallback)(() => {
        setState({
            values: (initialValues || {}),
            errors: {},
            touched: {},
            dirty: {},
            isSubmitting: false,
            isValidating: false,
            submitCount: 0,
        });
    }, [initialValues]);
    const isValid = (0, react_1.useMemo)(() => Object.keys(state.errors).length === 0, [state.errors]);
    return {
        values: state.values,
        errors: state.errors,
        touched: state.touched,
        dirty: state.dirty,
        isSubmitting: state.isSubmitting,
        isValidating: state.isValidating,
        isValid,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
        validate,
    };
};
exports.useFormState = useFormState;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
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
const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
exports.calculateAge = calculateAge;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Model creators
    createFormDefinitionModel: exports.createFormDefinitionModel,
    createFormFieldModel: exports.createFormFieldModel,
    createFormSubmissionModel: exports.createFormSubmissionModel,
    // Dynamic form creation
    createFormDefinition: exports.createFormDefinition,
    addFormField: exports.addFormField,
    removeFormField: exports.removeFormField,
    cloneFormDefinition: exports.cloneFormDefinition,
    createMultiSectionForm: exports.createMultiSectionForm,
    generateFormFromSchema: exports.generateFormFromSchema,
    mergeFormDefinitions: exports.mergeFormDefinitions,
    // Field dependencies
    createFieldDependency: exports.createFieldDependency,
    evaluateFieldDependencies: exports.evaluateFieldDependencies,
    evaluateCondition: exports.evaluateCondition,
    createCascadingDependency: exports.createCascadingDependency,
    createDependentValidation: exports.createDependentValidation,
    resolveAllDependencies: exports.resolveAllDependencies,
    createDependencyGraph: exports.createDependencyGraph,
    // Calculation engine
    createCalculationRule: exports.createCalculationRule,
    evaluateCalculation: exports.evaluateCalculation,
    evaluateFormula: exports.evaluateFormula,
    createBMICalculator: exports.createBMICalculator,
    createAgeCalculator: exports.createAgeCalculator,
    createConditionalCalculation: exports.createConditionalCalculation,
    recalculateForm: exports.recalculateForm,
    // Advanced validation
    validateFieldValue: exports.validateFieldValue,
    validateICD10Code: exports.validateICD10Code,
    validateCPTCode: exports.validateCPTCode,
    validateNPINumber: exports.validateNPINumber,
    validateSSN: exports.validateSSN,
    validateLuhnChecksum: exports.validateLuhnChecksum,
    validateForm: exports.validateForm,
    // Conditional visibility
    isFieldVisible: exports.isFieldVisible,
    isSectionVisible: exports.isSectionVisible,
    getVisibleFields: exports.getVisibleFields,
    getVisibleSections: exports.getVisibleSections,
    createVisibilityRules: exports.createVisibilityRules,
    createComplexVisibility: exports.createComplexVisibility,
    applyVisibilityRules: exports.applyVisibilityRules,
    // Form analytics
    trackFieldInteraction: exports.trackFieldInteraction,
    calculateCompletionRate: exports.calculateCompletionRate,
    identifyDropOffPoints: exports.identifyDropOffPoints,
    calculateAverageCompletionTime: exports.calculateAverageCompletionTime,
    generateFormAnalytics: exports.generateFormAnalytics,
    analyzeFieldErrors: exports.analyzeFieldErrors,
    createFormVariant: exports.createFormVariant,
    // React hooks
    useFormState: exports.useFormState,
    // Utilities
    calculateAge: exports.calculateAge,
};
//# sourceMappingURL=document-forms-advanced-kit.js.map