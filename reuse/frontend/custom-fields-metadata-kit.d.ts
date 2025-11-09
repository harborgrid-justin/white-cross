/**
 * @fileoverview Custom Fields and Metadata Management Kit
 * @module reuse/frontend/custom-fields-metadata-kit
 *
 * Enterprise-grade React components and utilities for managing custom fields,
 * metadata schemas, and dynamic form fields. Supports field definitions, validation,
 * conditional logic, permissions, versioning, and advanced field types.
 *
 * @example
 * ```tsx
 * import {
 *   useCustomFields,
 *   CustomFieldBuilder,
 *   MetadataPanel,
 *   createFieldDefinition
 * } from '@/reuse/frontend/custom-fields-metadata-kit';
 *
 * function FieldManager() {
 *   const { fields, addField, updateField } = useCustomFields('project');
 *
 *   return (
 *     <CustomFieldBuilder
 *       onFieldCreate={addField}
 *       availableTypes={['text', 'number', 'select', 'date']}
 *     />
 *   );
 * }
 * ```
 *
 * @author HarborGrid
 * @version 1.0.0
 * @license MIT
 */
import { type FormEvent } from 'react';
/**
 * Field data types supported by the custom fields system
 */
export type FieldDataType = 'text' | 'textarea' | 'number' | 'decimal' | 'boolean' | 'date' | 'datetime' | 'time' | 'email' | 'url' | 'phone' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'file' | 'image' | 'relation' | 'user' | 'json' | 'calculated' | 'location';
/**
 * Validation rule types
 */
export type ValidationRuleType = 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom' | 'unique';
/**
 * Single validation rule
 */
export interface ValidationRule {
    type: ValidationRuleType;
    value?: any;
    message: string;
    validator?: (value: any, allValues: Record<string, any>) => boolean | Promise<boolean>;
}
/**
 * Field visibility conditions
 */
export interface VisibilityCondition {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
    value?: any;
    logic?: 'and' | 'or';
}
/**
 * Field permission settings
 */
export interface FieldPermission {
    role: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
}
/**
 * Field option for select/radio/checkbox fields
 */
export interface FieldOption {
    value: string | number;
    label: string;
    color?: string;
    icon?: string;
    disabled?: boolean;
    metadata?: Record<string, any>;
}
/**
 * Calculated field configuration
 */
export interface CalculatedFieldConfig {
    formula: string;
    dependencies: string[];
    formatter?: (value: any) => any;
    recalculateOn?: 'change' | 'save' | 'manual';
}
/**
 * Field definition
 */
export interface FieldDefinition {
    id: string;
    name: string;
    label: string;
    type: FieldDataType;
    description?: string;
    placeholder?: string;
    defaultValue?: any;
    required?: boolean;
    validation?: ValidationRule[];
    options?: FieldOption[];
    group?: string;
    order: number;
    helpText?: string;
    prefix?: string;
    suffix?: string;
    permissions?: FieldPermission[];
    visibilityConditions?: VisibilityCondition[];
    calculated?: CalculatedFieldConfig;
    repeatable?: boolean;
    maxRepeat?: number;
    nested?: FieldDefinition[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    version?: number;
}
/**
 * Field group definition
 */
export interface FieldGroup {
    id: string;
    name: string;
    label: string;
    description?: string;
    collapsed?: boolean;
    order: number;
    icon?: string;
    color?: string;
    visibilityConditions?: VisibilityCondition[];
}
/**
 * Field value with metadata
 */
export interface FieldValue {
    fieldId: string;
    value: any;
    updatedAt: Date;
    updatedBy?: string;
    version?: number;
}
/**
 * Metadata schema
 */
export interface MetadataSchema {
    id: string;
    name: string;
    description?: string;
    entityType: string;
    fields: FieldDefinition[];
    groups?: FieldGroup[];
    version: number;
    status: 'draft' | 'active' | 'archived';
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
}
/**
 * Field template for reusable field configurations
 */
export interface FieldTemplate {
    id: string;
    name: string;
    description?: string;
    category?: string;
    field: Omit<FieldDefinition, 'id' | 'createdAt' | 'updatedAt'>;
    tags?: string[];
    usageCount?: number;
}
/**
 * Metadata history entry
 */
export interface MetadataHistoryEntry {
    id: string;
    entityId: string;
    fieldId: string;
    oldValue: any;
    newValue: any;
    changedAt: Date;
    changedBy?: string;
    changeReason?: string;
}
/**
 * Field validation result
 */
export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string[]>;
    warnings?: Record<string, string[]>;
}
/**
 * Bulk edit operation
 */
export interface BulkEditOperation {
    fieldId: string;
    operation: 'set' | 'append' | 'clear' | 'find-replace';
    value?: any;
    findValue?: any;
    replaceValue?: any;
    entityIds: string[];
}
/**
 * Import/Export format options
 */
export type ExportFormat = 'json' | 'csv' | 'xlsx' | 'yaml';
/**
 * Field search options
 */
export interface FieldSearchOptions {
    query?: string;
    types?: FieldDataType[];
    groups?: string[];
    tags?: string[];
    hasValue?: boolean;
    sortBy?: 'name' | 'type' | 'created' | 'updated' | 'order';
    sortOrder?: 'asc' | 'desc';
}
/**
 * Hook for managing custom fields for an entity type
 *
 * @param {string} entityType - The type of entity (e.g., 'project', 'contact')
 * @param {Object} options - Configuration options
 * @returns {Object} Custom fields state and methods
 *
 * @example
 * ```tsx
 * function ProjectFields() {
 *   const { fields, loading, addField, updateField, deleteField } =
 *     useCustomFields('project', { autoLoad: true });
 *
 *   if (loading) return <Spinner />;
 *
 *   return (
 *     <div>
 *       {fields.map(field => (
 *         <FieldEditor key={field.id} field={field} onUpdate={updateField} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export declare function useCustomFields(entityType: string, options?: {
    autoLoad?: boolean;
    filter?: FieldSearchOptions;
    onError?: (error: Error) => void;
}): {
    fields: any;
    loading: any;
    error: any;
    loadFields: any;
    addField: any;
    updateField: any;
    deleteField: any;
    reorderFields: any;
};
/**
 * Hook for managing metadata for specific entities
 *
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @returns {Object} Metadata state and methods
 *
 * @example
 * ```tsx
 * function ProjectMetadata({ projectId }: { projectId: string }) {
 *   const { metadata, updateMetadata, loading } = useMetadata('project', projectId);
 *
 *   return (
 *     <MetadataForm
 *       metadata={metadata}
 *       onUpdate={updateMetadata}
 *       loading={loading}
 *     />
 *   );
 * }
 * ```
 */
export declare function useMetadata(entityType: string, entityId: string): {
    metadata: any;
    loading: any;
    error: any;
    loadMetadata: any;
    updateMetadata: any;
    updateFieldValue: any;
    clearMetadata: any;
};
/**
 * Hook for managing field definitions
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Field definitions state and methods
 *
 * @example
 * ```tsx
 * function FieldLibrary() {
 *   const { definitions, createDefinition, searchDefinitions } = useFieldDefinitions();
 *
 *   const results = searchDefinitions({ types: ['text', 'number'], query: 'contact' });
 *
 *   return <FieldList definitions={results} />;
 * }
 * ```
 */
export declare function useFieldDefinitions(options?: {
    entityType?: string;
    includeArchived?: boolean;
}): {
    definitions: any;
    loading: any;
    loadDefinitions: any;
    createDefinition: any;
    searchDefinitions: any;
};
/**
 * Props for CustomFieldBuilder component
 */
export interface CustomFieldBuilderProps {
    onFieldCreate: (field: Omit<FieldDefinition, 'id' | 'createdAt' | 'updatedAt'>) => void | Promise<void>;
    availableTypes?: FieldDataType[];
    defaultValues?: Partial<FieldDefinition>;
    groups?: FieldGroup[];
    className?: string;
    onCancel?: () => void;
}
/**
 * Component for building custom field definitions
 *
 * @param {CustomFieldBuilderProps} props - Component props
 *
 * @example
 * ```tsx
 * <CustomFieldBuilder
 *   onFieldCreate={async (field) => {
 *     await createField(field);
 *   }}
 *   availableTypes={['text', 'number', 'select', 'date']}
 *   groups={fieldGroups}
 * />
 * ```
 */
export declare function CustomFieldBuilder({ onFieldCreate, availableTypes, defaultValues, groups, className, onCancel, }: CustomFieldBuilderProps): {
    handleSubmit: (e: FormEvent) => Promise<void>;
};
/**
 * Props for FieldDefinitionEditor component
 */
export interface FieldDefinitionEditorProps {
    field: FieldDefinition;
    onUpdate: (id: string, updates: Partial<FieldDefinition>) => void | Promise<void>;
    onDelete?: (id: string) => void | Promise<void>;
    className?: string;
}
/**
 * Component for editing existing field definitions
 *
 * @param {FieldDefinitionEditorProps} props - Component props
 *
 * @example
 * ```tsx
 * <FieldDefinitionEditor
 *   field={fieldDefinition}
 *   onUpdate={async (id, updates) => {
 *     await updateField(id, updates);
 *   }}
 *   onDelete={async (id) => {
 *     await deleteField(id);
 *   }}
 * />
 * ```
 */
export declare function FieldDefinitionEditor({ field, onUpdate, onDelete, className, }: FieldDefinitionEditorProps): any;
/**
 * Props for MetadataPanel component
 */
export interface MetadataPanelProps {
    entityType: string;
    entityId: string;
    fields: FieldDefinition[];
    metadata: Record<string, any>;
    onUpdate?: (metadata: Record<string, any>) => void | Promise<void>;
    readOnly?: boolean;
    className?: string;
    groupBy?: 'none' | 'group' | 'type';
}
/**
 * Panel component for displaying and editing metadata
 *
 * @param {MetadataPanelProps} props - Component props
 *
 * @example
 * ```tsx
 * <MetadataPanel
 *   entityType="project"
 *   entityId={projectId}
 *   fields={customFields}
 *   metadata={currentMetadata}
 *   onUpdate={handleMetadataUpdate}
 *   groupBy="group"
 * />
 * ```
 */
export declare function MetadataPanel({ entityType, entityId, fields, metadata, onUpdate, readOnly, className, groupBy, }: MetadataPanelProps): any;
/**
 * Props for MetadataForm component
 */
export interface MetadataFormProps {
    fields: FieldDefinition[];
    initialValues?: Record<string, any>;
    onSubmit: (metadata: Record<string, any>) => void | Promise<void>;
    onCancel?: () => void;
    className?: string;
    submitLabel?: string;
}
/**
 * Form component for editing metadata
 *
 * @param {MetadataFormProps} props - Component props
 *
 * @example
 * ```tsx
 * <MetadataForm
 *   fields={customFields}
 *   initialValues={existingMetadata}
 *   onSubmit={async (data) => {
 *     await saveMetadata(data);
 *   }}
 *   submitLabel="Save Changes"
 * />
 * ```
 */
export declare function MetadataForm({ fields, initialValues, onSubmit, onCancel, className, submitLabel, }: MetadataFormProps): {
    handleSubmit: (e: FormEvent) => Promise<void>;
};
/**
 * Props for MetadataViewer component
 */
export interface MetadataViewerProps {
    fields: FieldDefinition[];
    metadata: Record<string, any>;
    className?: string;
    compact?: boolean;
    showEmpty?: boolean;
}
/**
 * Read-only viewer for metadata
 *
 * @param {MetadataViewerProps} props - Component props
 *
 * @example
 * ```tsx
 * <MetadataViewer
 *   fields={customFields}
 *   metadata={entityMetadata}
 *   compact={true}
 *   showEmpty={false}
 * />
 * ```
 */
export declare function MetadataViewer({ fields, metadata, className, compact, showEmpty, }: MetadataViewerProps): boolean;
/**
 * Creates a new field definition
 *
 * @param {string} entityType - Entity type
 * @param {Object} fieldData - Field definition data
 * @returns {Promise<FieldDefinition>} Created field definition
 *
 * @example
 * ```tsx
 * const newField = await createField('project', {
 *   name: 'priority',
 *   label: 'Priority',
 *   type: 'select',
 *   options: [
 *     { value: 'low', label: 'Low' },
 *     { value: 'medium', label: 'Medium' },
 *     { value: 'high', label: 'High' }
 *   ],
 *   required: true,
 *   order: 10
 * });
 * ```
 */
export declare function createField(entityType: string, fieldData: Omit<FieldDefinition, 'id' | 'createdAt' | 'updatedAt'>): Promise<FieldDefinition>;
/**
 * Updates an existing field definition
 *
 * @param {string} entityType - Entity type
 * @param {string} fieldId - Field ID
 * @param {Object} updates - Field updates
 * @returns {Promise<FieldDefinition>} Updated field definition
 *
 * @example
 * ```tsx
 * const updated = await updateField('project', 'field_123', {
 *   label: 'Project Priority',
 *   required: false
 * });
 * ```
 */
export declare function updateField(entityType: string, fieldId: string, updates: Partial<FieldDefinition>): Promise<FieldDefinition>;
/**
 * Deletes a field definition
 *
 * @param {string} entityType - Entity type
 * @param {string} fieldId - Field ID
 * @returns {Promise<void>}
 *
 * @example
 * ```tsx
 * await deleteField('project', 'field_123');
 * ```
 */
export declare function deleteField(entityType: string, fieldId: string): Promise<void>;
/**
 * Reorders field definitions
 *
 * @param {string} entityType - Entity type
 * @param {string[]} fieldIds - Ordered array of field IDs
 * @returns {Promise<FieldDefinition[]>} Reordered fields
 *
 * @example
 * ```tsx
 * const reordered = await reorderFields('project', [
 *   'field_3',
 *   'field_1',
 *   'field_2'
 * ]);
 * ```
 */
export declare function reorderFields(entityType: string, fieldIds: string[]): Promise<FieldDefinition[]>;
/**
 * Creates a text field definition
 *
 * @param {Object} options - Field options
 * @returns {Partial<FieldDefinition>} Field definition
 *
 * @example
 * ```tsx
 * const nameField = createTextField({
 *   name: 'customer_name',
 *   label: 'Customer Name',
 *   required: true,
 *   maxLength: 100
 * });
 * ```
 */
export declare function createTextField(options: {
    name: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    defaultValue?: string;
}): Partial<FieldDefinition>;
/**
 * Creates a number field definition
 *
 * @param {Object} options - Field options
 * @returns {Partial<FieldDefinition>} Field definition
 *
 * @example
 * ```tsx
 * const ageField = createNumberField({
 *   name: 'age',
 *   label: 'Age',
 *   min: 0,
 *   max: 120,
 *   required: true
 * });
 * ```
 */
export declare function createNumberField(options: {
    name: string;
    label: string;
    required?: boolean;
    min?: number;
    max?: number;
    defaultValue?: number;
    isDecimal?: boolean;
}): Partial<FieldDefinition>;
/**
 * Creates a select field definition
 *
 * @param {Object} options - Field options
 * @returns {Partial<FieldDefinition>} Field definition
 *
 * @example
 * ```tsx
 * const statusField = createSelectField({
 *   name: 'status',
 *   label: 'Status',
 *   options: [
 *     { value: 'pending', label: 'Pending', color: 'yellow' },
 *     { value: 'active', label: 'Active', color: 'green' },
 *     { value: 'completed', label: 'Completed', color: 'blue' }
 *   ],
 *   required: true
 * });
 * ```
 */
export declare function createSelectField(options: {
    name: string;
    label: string;
    options: FieldOption[];
    required?: boolean;
    defaultValue?: string | number;
    multiSelect?: boolean;
}): Partial<FieldDefinition>;
/**
 * Creates a date field definition
 *
 * @param {Object} options - Field options
 * @returns {Partial<FieldDefinition>} Field definition
 *
 * @example
 * ```tsx
 * const dueDateField = createDateField({
 *   name: 'due_date',
 *   label: 'Due Date',
 *   required: true,
 *   includeTime: false
 * });
 * ```
 */
export declare function createDateField(options: {
    name: string;
    label: string;
    required?: boolean;
    includeTime?: boolean;
    defaultValue?: string;
}): Partial<FieldDefinition>;
/**
 * Creates a file upload field definition
 *
 * @param {Object} options - Field options
 * @returns {Partial<FieldDefinition>} Field definition
 *
 * @example
 * ```tsx
 * const attachmentField = createFileField({
 *   name: 'attachment',
 *   label: 'Attachment',
 *   acceptedTypes: ['image/*', 'application/pdf'],
 *   maxSize: 5242880 // 5MB
 * });
 * ```
 */
export declare function createFileField(options: {
    name: string;
    label: string;
    required?: boolean;
    acceptedTypes?: string[];
    maxSize?: number;
    multiple?: boolean;
}): Partial<FieldDefinition>;
/**
 * Creates a relation field definition
 *
 * @param {Object} options - Field options
 * @returns {Partial<FieldDefinition>} Field definition
 *
 * @example
 * ```tsx
 * const projectField = createRelationField({
 *   name: 'project_id',
 *   label: 'Project',
 *   relatedEntity: 'project',
 *   displayField: 'name',
 *   required: true
 * });
 * ```
 */
export declare function createRelationField(options: {
    name: string;
    label: string;
    relatedEntity: string;
    displayField: string;
    required?: boolean;
    multiple?: boolean;
}): Partial<FieldDefinition>;
/**
 * Validates field values against field definitions
 *
 * @param {FieldDefinition[]} fields - Field definitions
 * @param {Record<string, any>} values - Field values to validate
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```tsx
 * const result = await validateFields(fields, formData);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare function validateFields(fields: FieldDefinition[], values: Record<string, any>): Promise<ValidationResult>;
/**
 * Validates a single field value
 *
 * @param {FieldDefinition} field - Field definition
 * @param {any} value - Value to validate
 * @param {Record<string, any>} allValues - All field values (for custom validators)
 * @returns {Promise<string[]>} Array of error messages
 *
 * @example
 * ```tsx
 * const errors = await validateFieldValue(emailField, 'invalid-email', allValues);
 * if (errors.length > 0) {
 *   setFieldError(errors[0]);
 * }
 * ```
 */
export declare function validateFieldValue(field: FieldDefinition, value: any, allValues?: Record<string, any>): Promise<string[]>;
/**
 * Evaluates visibility conditions for a field
 *
 * @param {VisibilityCondition[]} conditions - Visibility conditions
 * @param {Record<string, any>} values - Current field values
 * @returns {boolean} Whether field should be visible
 *
 * @example
 * ```tsx
 * const isVisible = evaluateVisibilityConditions(field.visibilityConditions, formData);
 * if (!isVisible) return null;
 * ```
 */
export declare function evaluateVisibilityConditions(conditions: VisibilityCondition[] | undefined, values: Record<string, any>): boolean;
/**
 * Gets dependent fields for a given field
 *
 * @param {string} fieldId - Field ID
 * @param {FieldDefinition[]} allFields - All field definitions
 * @returns {FieldDefinition[]} Dependent fields
 *
 * @example
 * ```tsx
 * const dependents = getDependentFields('country', fields);
 * // Returns fields like 'state', 'city' that depend on 'country'
 * ```
 */
export declare function getDependentFields(fieldId: string, allFields: FieldDefinition[]): FieldDefinition[];
/**
 * Gets all fields that a field depends on
 *
 * @param {FieldDefinition} field - Field definition
 * @returns {string[]} Array of field IDs this field depends on
 *
 * @example
 * ```tsx
 * const dependencies = getFieldDependencies(stateField);
 * // Returns ['country'] if state depends on country
 * ```
 */
export declare function getFieldDependencies(field: FieldDefinition): string[];
/**
 * Creates a repeatable field group
 *
 * @param {Object} options - Repeatable field options
 * @returns {Partial<FieldDefinition>} Repeatable field definition
 *
 * @example
 * ```tsx
 * const phoneNumbers = createRepeatableField({
 *   name: 'phone_numbers',
 *   label: 'Phone Numbers',
 *   childField: createTextField({
 *     name: 'phone',
 *     label: 'Phone Number',
 *     required: true
 *   }),
 *   maxRepeat: 5
 * });
 * ```
 */
export declare function createRepeatableField(options: {
    name: string;
    label: string;
    childField: Partial<FieldDefinition>;
    maxRepeat?: number;
    minRepeat?: number;
}): Partial<FieldDefinition>;
/**
 * Creates a nested field group
 *
 * @param {Object} options - Nested field options
 * @returns {Partial<FieldDefinition>} Nested field definition
 *
 * @example
 * ```tsx
 * const addressField = createNestedFields({
 *   name: 'address',
 *   label: 'Address',
 *   fields: [
 *     createTextField({ name: 'street', label: 'Street' }),
 *     createTextField({ name: 'city', label: 'City' }),
 *     createTextField({ name: 'state', label: 'State' }),
 *     createTextField({ name: 'zip', label: 'ZIP Code' })
 *   ]
 * });
 * ```
 */
export declare function createNestedFields(options: {
    name: string;
    label: string;
    fields: Partial<FieldDefinition>[];
    description?: string;
}): Partial<FieldDefinition>;
/**
 * Creates a field template for reuse
 *
 * @param {Object} template - Template data
 * @returns {Promise<FieldTemplate>} Created template
 *
 * @example
 * ```tsx
 * const template = await createFieldTemplate({
 *   name: 'Email Address',
 *   category: 'Contact',
 *   field: createTextField({
 *     name: 'email',
 *     label: 'Email Address',
 *     required: true,
 *     pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
 *   }),
 *   tags: ['contact', 'communication']
 * });
 * ```
 */
export declare function createFieldTemplate(template: Omit<FieldTemplate, 'id' | 'usageCount'>): Promise<FieldTemplate>;
/**
 * Gets available field templates
 *
 * @param {Object} options - Filter options
 * @returns {Promise<FieldTemplate[]>} Field templates
 *
 * @example
 * ```tsx
 * const templates = await getFieldTemplates({ category: 'Contact' });
 * ```
 */
export declare function getFieldTemplates(options?: {
    category?: string;
    tags?: string[];
}): Promise<FieldTemplate[]>;
/**
 * Applies a template to create a new field
 *
 * @param {string} templateId - Template ID
 * @param {Object} overrides - Field property overrides
 * @returns {Partial<FieldDefinition>} Field definition from template
 *
 * @example
 * ```tsx
 * const field = await applyFieldTemplate('template_123', {
 *   name: 'customer_email',
 *   label: 'Customer Email'
 * });
 * ```
 */
export declare function applyFieldTemplate(templateId: string, overrides?: Partial<FieldDefinition>): Promise<Partial<FieldDefinition>>;
/**
 * Common field presets
 */
export declare const FIELD_PRESETS: {
    /**
     * Standard contact fields
     */
    contact: {
        firstName: Partial<FieldDefinition>;
        lastName: Partial<FieldDefinition>;
        email: Partial<FieldDefinition>;
        phone: Partial<FieldDefinition>;
    };
    /**
     * Address fields
     */
    address: Partial<FieldDefinition>;
    /**
     * Common status field
     */
    status: Partial<FieldDefinition>;
    /**
     * Priority field
     */
    priority: Partial<FieldDefinition>;
};
/**
 * Creates a metadata schema
 *
 * @param {Object} schema - Schema data
 * @returns {Promise<MetadataSchema>} Created schema
 *
 * @example
 * ```tsx
 * const schema = await createMetadataSchema({
 *   name: 'Project Metadata',
 *   entityType: 'project',
 *   fields: [
 *     createTextField({ name: 'project_code', label: 'Project Code' }),
 *     createSelectField({ name: 'department', label: 'Department', options: [...] }),
 *     createDateField({ name: 'start_date', label: 'Start Date' })
 *   ],
 *   status: 'active'
 * });
 * ```
 */
export declare function createMetadataSchema(schema: Omit<MetadataSchema, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<MetadataSchema>;
/**
 * Gets a metadata schema
 *
 * @param {string} schemaId - Schema ID
 * @returns {Promise<MetadataSchema>} Schema
 *
 * @example
 * ```tsx
 * const schema = await getMetadataSchema('schema_123');
 * ```
 */
export declare function getMetadataSchema(schemaId: string): Promise<MetadataSchema>;
/**
 * Updates a metadata schema (creates new version)
 *
 * @param {string} schemaId - Schema ID
 * @param {Object} updates - Schema updates
 * @returns {Promise<MetadataSchema>} Updated schema
 *
 * @example
 * ```tsx
 * const updated = await updateMetadataSchema('schema_123', {
 *   fields: [...updatedFields],
 *   status: 'active'
 * });
 * ```
 */
export declare function updateMetadataSchema(schemaId: string, updates: Partial<MetadataSchema>): Promise<MetadataSchema>;
/**
 * Validates data against a metadata schema
 *
 * @param {MetadataSchema} schema - Metadata schema
 * @param {Record<string, any>} data - Data to validate
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```tsx
 * const result = await validateAgainstSchema(projectSchema, projectData);
 * if (!result.valid) {
 *   console.error('Schema validation failed:', result.errors);
 * }
 * ```
 */
export declare function validateAgainstSchema(schema: MetadataSchema, data: Record<string, any>): Promise<ValidationResult>;
/**
 * Exports metadata to specified format
 *
 * @param {string} entityType - Entity type
 * @param {string[]} entityIds - Entity IDs to export
 * @param {ExportFormat} format - Export format
 * @returns {Promise<Blob>} Export file
 *
 * @example
 * ```tsx
 * const exportFile = await exportMetadata('project', ['proj_1', 'proj_2'], 'xlsx');
 * const url = URL.createObjectURL(exportFile);
 * window.open(url);
 * ```
 */
export declare function exportMetadata(entityType: string, entityIds: string[], format?: ExportFormat): Promise<Blob>;
/**
 * Imports metadata from file
 *
 * @param {string} entityType - Entity type
 * @param {File} file - Import file
 * @param {Object} options - Import options
 * @returns {Promise<Object>} Import result
 *
 * @example
 * ```tsx
 * const result = await importMetadata('project', file, {
 *   updateExisting: true,
 *   skipErrors: false
 * });
 * console.log(`Imported ${result.successCount} records`);
 * ```
 */
export declare function importMetadata(entityType: string, file: File, options?: {
    updateExisting?: boolean;
    skipErrors?: boolean;
    validateOnly?: boolean;
}): Promise<{
    successCount: number;
    errorCount: number;
    errors: Array<{
        row: number;
        message: string;
    }>;
}>;
/**
 * Performs bulk edit operation on metadata
 *
 * @param {BulkEditOperation} operation - Bulk edit operation
 * @returns {Promise<Object>} Operation result
 *
 * @example
 * ```tsx
 * const result = await bulkEditMetadata({
 *   fieldId: 'status',
 *   operation: 'set',
 *   value: 'active',
 *   entityIds: ['proj_1', 'proj_2', 'proj_3']
 * });
 * console.log(`Updated ${result.updatedCount} records`);
 * ```
 */
export declare function bulkEditMetadata(operation: BulkEditOperation): Promise<{
    updatedCount: number;
    errors: Array<{
        entityId: string;
        message: string;
    }>;
}>;
/**
 * Checks if user has permission to access a field
 *
 * @param {FieldDefinition} field - Field definition
 * @param {string} userRole - User role
 * @param {'view' | 'edit' | 'delete'} action - Action to check
 * @returns {boolean} Whether user has permission
 *
 * @example
 * ```tsx
 * const canEdit = checkFieldPermission(field, currentUserRole, 'edit');
 * if (!canEdit) {
 *   return <FieldDisplay field={field} value={value} />;
 * }
 * ```
 */
export declare function checkFieldPermission(field: FieldDefinition, userRole: string, action: 'view' | 'edit' | 'delete'): boolean;
/**
 * Filters fields based on user permissions
 *
 * @param {FieldDefinition[]} fields - All fields
 * @param {string} userRole - User role
 * @param {'view' | 'edit'} action - Action filter
 * @returns {FieldDefinition[]} Filtered fields
 *
 * @example
 * ```tsx
 * const viewableFields = filterFieldsByPermission(allFields, currentUserRole, 'view');
 * ```
 */
export declare function filterFieldsByPermission(fields: FieldDefinition[], userRole: string, action?: 'view' | 'edit'): FieldDefinition[];
/**
 * Sets field permissions
 *
 * @param {string} entityType - Entity type
 * @param {string} fieldId - Field ID
 * @param {FieldPermission[]} permissions - Permissions to set
 * @returns {Promise<FieldDefinition>} Updated field
 *
 * @example
 * ```tsx
 * await setFieldPermissions('project', 'field_123', [
 *   { role: 'admin', canView: true, canEdit: true, canDelete: true },
 *   { role: 'user', canView: true, canEdit: false, canDelete: false }
 * ]);
 * ```
 */
export declare function setFieldPermissions(entityType: string, fieldId: string, permissions: FieldPermission[]): Promise<FieldDefinition>;
/**
 * Searches fields by criteria
 *
 * @param {FieldDefinition[]} fields - Fields to search
 * @param {FieldSearchOptions} options - Search options
 * @returns {FieldDefinition[]} Matching fields
 *
 * @example
 * ```tsx
 * const results = searchFields(allFields, {
 *   query: 'email',
 *   types: ['text', 'email'],
 *   sortBy: 'name',
 *   sortOrder: 'asc'
 * });
 * ```
 */
export declare function searchFields(fields: FieldDefinition[], options: FieldSearchOptions): FieldDefinition[];
/**
 * Queries metadata across entities
 *
 * @param {Object} query - Query parameters
 * @returns {Promise<Array>} Query results
 *
 * @example
 * ```tsx
 * const results = await queryMetadata({
 *   entityType: 'project',
 *   filters: [
 *     { field: 'status', operator: 'equals', value: 'active' },
 *     { field: 'priority', operator: 'equals', value: 'high' }
 *   ],
 *   limit: 50
 * });
 * ```
 */
export declare function queryMetadata(query: {
    entityType: string;
    filters: Array<{
        field: string;
        operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'in';
        value: any;
    }>;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}): Promise<Array<{
    entityId: string;
    metadata: Record<string, any>;
}>>;
/**
 * Gets metadata history for an entity
 *
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {Object} options - Query options
 * @returns {Promise<MetadataHistoryEntry[]>} History entries
 *
 * @example
 * ```tsx
 * const history = await getMetadataHistory('project', 'proj_123', {
 *   fieldId: 'status',
 *   limit: 20
 * });
 * ```
 */
export declare function getMetadataHistory(entityType: string, entityId: string, options?: {
    fieldId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
}): Promise<MetadataHistoryEntry[]>;
/**
 * Reverts metadata to a previous version
 *
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {string} historyId - History entry ID to revert to
 * @returns {Promise<Record<string, any>>} Reverted metadata
 *
 * @example
 * ```tsx
 * await revertMetadata('project', 'proj_123', 'history_456');
 * ```
 */
export declare function revertMetadata(entityType: string, entityId: string, historyId: string): Promise<Record<string, any>>;
/**
 * Compares two metadata versions
 *
 * @param {Record<string, any>} oldMetadata - Old metadata
 * @param {Record<string, any>} newMetadata - New metadata
 * @returns {Object} Comparison result
 *
 * @example
 * ```tsx
 * const diff = compareMetadataVersions(previousData, currentData);
 * console.log('Added:', diff.added);
 * console.log('Modified:', diff.modified);
 * console.log('Removed:', diff.removed);
 * ```
 */
export declare function compareMetadataVersions(oldMetadata: Record<string, any>, newMetadata: Record<string, any>): {
    added: string[];
    modified: Array<{
        field: string;
        oldValue: any;
        newValue: any;
    }>;
    removed: string[];
};
/**
 * Creates a calculated field definition
 *
 * @param {Object} options - Calculated field options
 * @returns {Partial<FieldDefinition>} Calculated field definition
 *
 * @example
 * ```tsx
 * const totalField = createCalculatedField({
 *   name: 'total',
 *   label: 'Total',
 *   formula: 'quantity * price',
 *   dependencies: ['quantity', 'price'],
 *   formatter: (value) => `$${value.toFixed(2)}`
 * });
 * ```
 */
export declare function createCalculatedField(options: {
    name: string;
    label: string;
    formula: string;
    dependencies: string[];
    formatter?: (value: any) => any;
    recalculateOn?: 'change' | 'save' | 'manual';
}): Partial<FieldDefinition>;
/**
 * Evaluates a calculated field
 *
 * @param {CalculatedFieldConfig} config - Calculated field configuration
 * @param {Record<string, any>} values - All field values
 * @returns {any} Calculated value
 *
 * @example
 * ```tsx
 * const total = evaluateCalculatedField(
 *   totalField.calculated,
 *   { quantity: 10, price: 25.50 }
 * );
 * // Returns: 255
 * ```
 */
export declare function evaluateCalculatedField(config: CalculatedFieldConfig, values: Record<string, any>): any;
/**
 * Auto-populates field based on rules
 *
 * @param {Object} options - Auto-populate options
 * @returns {any} Auto-populated value
 *
 * @example
 * ```tsx
 * const code = autoPopulateField({
 *   type: 'sequence',
 *   prefix: 'PROJ',
 *   startFrom: 1000,
 *   padding: 5
 * });
 * // Returns: 'PROJ-01000'
 * ```
 */
export declare function autoPopulateField(options: {
    type: 'sequence' | 'current-date' | 'current-user' | 'derived';
    prefix?: string;
    suffix?: string;
    startFrom?: number;
    padding?: number;
    format?: string;
    sourceField?: string;
    transform?: (value: any) => any;
}): any;
/**
 * Generates a field definition from a simple config
 *
 * @param {Object} config - Simplified field configuration
 * @returns {Partial<FieldDefinition>} Field definition
 *
 * @example
 * ```tsx
 * const field = createFieldDefinition({
 *   name: 'email',
 *   label: 'Email Address',
 *   type: 'email',
 *   required: true
 * });
 * ```
 */
export declare function createFieldDefinition(config: Partial<FieldDefinition>): Partial<FieldDefinition>;
/**
 * Clones a field definition
 *
 * @param {FieldDefinition} field - Field to clone
 * @param {Object} overrides - Property overrides
 * @returns {Partial<FieldDefinition>} Cloned field
 *
 * @example
 * ```tsx
 * const cloned = cloneField(originalField, {
 *   name: 'new_field_name',
 *   label: 'New Field Label'
 * });
 * ```
 */
export declare function cloneField(field: FieldDefinition, overrides?: Partial<FieldDefinition>): Partial<FieldDefinition>;
/**
 * Gets field value with fallback to default
 *
 * @param {FieldDefinition} field - Field definition
 * @param {Record<string, any>} metadata - Metadata values
 * @returns {any} Field value or default
 *
 * @example
 * ```tsx
 * const status = getFieldValueOrDefault(statusField, projectMetadata);
 * ```
 */
export declare function getFieldValueOrDefault(field: FieldDefinition, metadata: Record<string, any>): any;
/**
 * Sanitizes field values for storage
 *
 * @param {FieldDefinition[]} fields - Field definitions
 * @param {Record<string, any>} values - Raw values
 * @returns {Record<string, any>} Sanitized values
 *
 * @example
 * ```tsx
 * const sanitized = sanitizeFieldValues(fields, formData);
 * await saveMetadata(sanitized);
 * ```
 */
export declare function sanitizeFieldValues(fields: FieldDefinition[], values: Record<string, any>): Record<string, any>;
/**
 * Type guard for field definition
 */
export declare function isFieldDefinition(obj: any): obj is FieldDefinition;
/**
 * Type guard for metadata schema
 */
export declare function isMetadataSchema(obj: any): obj is MetadataSchema;
//# sourceMappingURL=custom-fields-metadata-kit.d.ts.map