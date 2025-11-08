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

'use client';

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
  type FormEvent,
  type ChangeEvent
} from 'react';

/* ============================================================================
 * TYPE DEFINITIONS
 * ========================================================================== */

/**
 * Field data types supported by the custom fields system
 */
export type FieldDataType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'decimal'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'email'
  | 'url'
  | 'phone'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'image'
  | 'relation'
  | 'user'
  | 'json'
  | 'calculated'
  | 'location';

/**
 * Validation rule types
 */
export type ValidationRuleType =
  | 'required'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'email'
  | 'url'
  | 'custom'
  | 'unique';

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

/* ============================================================================
 * CUSTOM HOOKS
 * ========================================================================== */

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
export function useCustomFields(
  entityType: string,
  options: {
    autoLoad?: boolean;
    filter?: FieldSearchOptions;
    onError?: (error: Error) => void;
  } = {}
) {
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadFields = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/custom-fields/${entityType}`);
      if (!response.ok) throw new Error('Failed to load fields');
      const data = await response.json();
      setFields(data.fields || []);
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [entityType, options]);

  useEffect(() => {
    if (options.autoLoad !== false) {
      loadFields();
    }
  }, [loadFields, options.autoLoad]);

  const addField = useCallback(async (field: Omit<FieldDefinition, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`/api/custom-fields/${entityType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field),
      });
      if (!response.ok) throw new Error('Failed to add field');
      const newField = await response.json();
      setFields(prev => [...prev, newField]);
      return newField;
    } catch (err) {
      options.onError?.(err as Error);
      throw err;
    }
  }, [entityType, options]);

  const updateField = useCallback(async (id: string, updates: Partial<FieldDefinition>) => {
    try {
      const response = await fetch(`/api/custom-fields/${entityType}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update field');
      const updated = await response.json();
      setFields(prev => prev.map(f => f.id === id ? updated : f));
      return updated;
    } catch (err) {
      options.onError?.(err as Error);
      throw err;
    }
  }, [entityType, options]);

  const deleteField = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/custom-fields/${entityType}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete field');
      setFields(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      options.onError?.(err as Error);
      throw err;
    }
  }, [entityType, options]);

  const reorderFields = useCallback(async (fieldIds: string[]) => {
    try {
      const response = await fetch(`/api/custom-fields/${entityType}/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldIds }),
      });
      if (!response.ok) throw new Error('Failed to reorder fields');
      const reordered = await response.json();
      setFields(reordered.fields);
    } catch (err) {
      options.onError?.(err as Error);
      throw err;
    }
  }, [entityType, options]);

  return {
    fields,
    loading,
    error,
    loadFields,
    addField,
    updateField,
    deleteField,
    reorderFields,
  };
}

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
export function useMetadata(entityType: string, entityId: string) {
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMetadata = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/metadata/${entityType}/${entityId}`);
      if (!response.ok) throw new Error('Failed to load metadata');
      const data = await response.json();
      setMetadata(data.metadata || {});
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  const updateMetadata = useCallback(async (
    updates: Record<string, any>,
    options?: { merge?: boolean }
  ) => {
    try {
      const newMetadata = options?.merge ? { ...metadata, ...updates } : updates;
      const response = await fetch(`/api/metadata/${entityType}/${entityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata: newMetadata }),
      });
      if (!response.ok) throw new Error('Failed to update metadata');
      const data = await response.json();
      setMetadata(data.metadata);
      return data.metadata;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [entityType, entityId, metadata]);

  const updateFieldValue = useCallback(async (fieldId: string, value: any) => {
    return updateMetadata({ [fieldId]: value }, { merge: true });
  }, [updateMetadata]);

  const clearMetadata = useCallback(async () => {
    return updateMetadata({}, { merge: false });
  }, [updateMetadata]);

  return {
    metadata,
    loading,
    error,
    loadMetadata,
    updateMetadata,
    updateFieldValue,
    clearMetadata,
  };
}

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
export function useFieldDefinitions(options: {
  entityType?: string;
  includeArchived?: boolean;
} = {}) {
  const [definitions, setDefinitions] = useState<FieldDefinition[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDefinitions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (options.entityType) params.set('entityType', options.entityType);
      if (options.includeArchived) params.set('includeArchived', 'true');

      const response = await fetch(`/api/field-definitions?${params}`);
      if (!response.ok) throw new Error('Failed to load definitions');
      const data = await response.json();
      setDefinitions(data.definitions || []);
    } catch (err) {
      console.error('Failed to load field definitions:', err);
    } finally {
      setLoading(false);
    }
  }, [options.entityType, options.includeArchived]);

  useEffect(() => {
    loadDefinitions();
  }, [loadDefinitions]);

  const createDefinition = useCallback(async (
    definition: Omit<FieldDefinition, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const response = await fetch('/api/field-definitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(definition),
    });
    if (!response.ok) throw new Error('Failed to create definition');
    const newDef = await response.json();
    setDefinitions(prev => [...prev, newDef]);
    return newDef;
  }, []);

  const searchDefinitions = useCallback((searchOptions: FieldSearchOptions) => {
    return definitions.filter(def => {
      if (searchOptions.query && !def.name.toLowerCase().includes(searchOptions.query.toLowerCase()) &&
          !def.label.toLowerCase().includes(searchOptions.query.toLowerCase())) {
        return false;
      }
      if (searchOptions.types && !searchOptions.types.includes(def.type)) {
        return false;
      }
      if (searchOptions.groups && def.group && !searchOptions.groups.includes(def.group)) {
        return false;
      }
      return true;
    });
  }, [definitions]);

  return {
    definitions,
    loading,
    loadDefinitions,
    createDefinition,
    searchDefinitions,
  };
}

/* ============================================================================
 * FIELD BUILDER COMPONENTS
 * ========================================================================== */

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
export function CustomFieldBuilder({
  onFieldCreate,
  availableTypes = ['text', 'textarea', 'number', 'select', 'date', 'boolean'],
  defaultValues,
  groups,
  className,
  onCancel,
}: CustomFieldBuilderProps) {
  const [fieldData, setFieldData] = useState<Partial<FieldDefinition>>({
    type: 'text',
    required: false,
    order: 0,
    ...defaultValues,
  });
  const [options, setOptions] = useState<FieldOption[]>([]);
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const field = {
        ...fieldData,
        name: fieldData.name!,
        label: fieldData.label!,
        type: fieldData.type!,
        order: fieldData.order ?? 0,
        options: ['select', 'multiselect', 'radio', 'checkbox'].includes(fieldData.type!) ? options : undefined,
        validation: validationRules.length > 0 ? validationRules : undefined,
      } as Omit<FieldDefinition, 'id' | 'createdAt' | 'updatedAt'>;

      await onFieldCreate(field);

      // Reset form
      setFieldData({ type: 'text', required: false, order: 0 });
      setOptions([]);
      setValidationRules([]);
    } catch (err) {
      console.error('Failed to create field:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const addOption = () => {
    setOptions([...options, { value: '', label: '' }]);
  };

  const updateOption = (index: number, updates: Partial<FieldOption>) => {
    setOptions(options.map((opt, i) => i === index ? { ...opt, ...updates } : opt));
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Field Name</label>
          <input
            type="text"
            required
            value={fieldData.name || ''}
            onChange={(e) => setFieldData({ ...fieldData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            placeholder="field_name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Field Label</label>
          <input
            type="text"
            required
            value={fieldData.label || ''}
            onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Field Label"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Field Type</label>
          <select
            value={fieldData.type}
            onChange={(e) => setFieldData({ ...fieldData, type: e.target.value as FieldDataType })}
            className="w-full px-3 py-2 border rounded"
          >
            {availableTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {groups && groups.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1">Group</label>
            <select
              value={fieldData.group || ''}
              onChange={(e) => setFieldData({ ...fieldData, group: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">No Group</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={fieldData.description || ''}
            onChange={(e) => setFieldData({ ...fieldData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            rows={2}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="required"
            checked={fieldData.required || false}
            onChange={(e) => setFieldData({ ...fieldData, required: e.target.checked })}
          />
          <label htmlFor="required" className="text-sm font-medium">
            Required Field
          </label>
        </div>

        {['select', 'multiselect', 'radio', 'checkbox'].includes(fieldData.type!) && (
          <div>
            <label className="block text-sm font-medium mb-2">Options</label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => updateOption(index, { value: e.target.value })}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => updateOption(index, { label: e.target.value })}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                Add Option
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Field'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

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
export function FieldDefinitionEditor({
  field,
  onUpdate,
  onDelete,
  className,
}: FieldDefinitionEditorProps) {
  const [editing, setEditing] = useState(false);
  const [localField, setLocalField] = useState(field);

  const handleSave = async () => {
    await onUpdate(field.id, localField);
    setEditing(false);
  };

  const handleCancel = () => {
    setLocalField(field);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className={`p-4 border rounded ${className}`}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{field.label}</h4>
            <p className="text-sm text-gray-600">{field.name} ({field.type})</p>
            {field.description && (
              <p className="text-sm text-gray-500 mt-1">{field.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
            >
              Edit
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(field.id)}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border rounded ${className}`}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Label</label>
          <input
            type="text"
            value={localField.label}
            onChange={(e) => setLocalField({ ...localField, label: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={localField.description || ''}
            onChange={(e) => setLocalField({ ...localField, description: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            rows={2}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`required-${field.id}`}
            checked={localField.required || false}
            onChange={(e) => setLocalField({ ...localField, required: e.target.checked })}
          />
          <label htmlFor={`required-${field.id}`} className="text-sm">
            Required
          </label>
        </div>
        <div className="flex gap-2 pt-2 border-t">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * METADATA DISPLAY COMPONENTS
 * ========================================================================== */

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
export function MetadataPanel({
  entityType,
  entityId,
  fields,
  metadata,
  onUpdate,
  readOnly = false,
  className,
  groupBy = 'none',
}: MetadataPanelProps) {
  const [localMetadata, setLocalMetadata] = useState(metadata);
  const [editing, setEditing] = useState(false);

  const handleFieldChange = (fieldId: string, value: any) => {
    setLocalMetadata({ ...localMetadata, [fieldId]: value });
  };

  const handleSave = async () => {
    if (onUpdate) {
      await onUpdate(localMetadata);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setLocalMetadata(metadata);
    setEditing(false);
  };

  const groupedFields = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Fields': fields };
    } else if (groupBy === 'type') {
      return fields.reduce((acc, field) => {
        const key = field.type;
        if (!acc[key]) acc[key] = [];
        acc[key].push(field);
        return acc;
      }, {} as Record<string, FieldDefinition[]>);
    } else {
      return fields.reduce((acc, field) => {
        const key = field.group || 'Ungrouped';
        if (!acc[key]) acc[key] = [];
        acc[key].push(field);
        return acc;
      }, {} as Record<string, FieldDefinition[]>);
    }
  }, [fields, groupBy]);

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Metadata</h3>
        {!readOnly && (
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {Object.entries(groupedFields).map(([groupName, groupFields]) => (
          <div key={groupName}>
            {groupBy !== 'none' && (
              <h4 className="font-medium text-gray-700 mb-3">{groupName}</h4>
            )}
            <div className="space-y-4">
              {groupFields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.description && (
                    <p className="text-sm text-gray-500 mb-1">{field.description}</p>
                  )}
                  {editing ? (
                    <FieldInput
                      field={field}
                      value={localMetadata[field.id]}
                      onChange={(value) => handleFieldChange(field.id, value)}
                    />
                  ) : (
                    <FieldDisplay field={field} value={metadata[field.id]} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
export function MetadataForm({
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
  className,
  submitLabel = 'Submit',
}: MetadataFormProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = (fieldId: string, value: any) => {
    setValues({ ...values, [fieldId]: value });
    // Clear error when field changes
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const value = values[field.id];

      // Required validation
      if (field.required && (value === undefined || value === null || value === '')) {
        newErrors[field.id] = `${field.label} is required`;
      }

      // Custom validation rules
      if (field.validation && value !== undefined && value !== null && value !== '') {
        field.validation.forEach(rule => {
          if (rule.type === 'minLength' && typeof value === 'string' && value.length < rule.value) {
            newErrors[field.id] = rule.message;
          }
          if (rule.type === 'maxLength' && typeof value === 'string' && value.length > rule.value) {
            newErrors[field.id] = rule.message;
          }
          if (rule.type === 'min' && typeof value === 'number' && value < rule.value) {
            newErrors[field.id] = rule.message;
          }
          if (rule.type === 'max' && typeof value === 'number' && value > rule.value) {
            newErrors[field.id] = rule.message;
          }
          if (rule.type === 'pattern' && typeof value === 'string' && !new RegExp(rule.value).test(value)) {
            newErrors[field.id] = rule.message;
          }
        });
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        {fields.map(field => (
          <div key={field.id}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.helpText && (
              <p className="text-sm text-gray-500 mb-1">{field.helpText}</p>
            )}
            <FieldInput
              field={field}
              value={values[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={errors[field.id]}
            />
            {errors[field.id] && (
              <p className="text-sm text-red-600 mt-1">{errors[field.id]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-6 pt-4 border-t">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

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
export function MetadataViewer({
  fields,
  metadata,
  className,
  compact = false,
  showEmpty = true,
}: MetadataViewerProps) {
  const visibleFields = showEmpty
    ? fields
    : fields.filter(f => metadata[f.id] !== undefined && metadata[f.id] !== null && metadata[f.id] !== '');

  return (
    <div className={className}>
      {compact ? (
        <div className="space-y-2">
          {visibleFields.map(field => (
            <div key={field.id} className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-600 min-w-[120px]">
                {field.label}:
              </span>
              <span className="text-sm">
                <FieldDisplay field={field} value={metadata[field.id]} />
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleFields.map(field => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <div className="text-sm">
                <FieldDisplay field={field} value={metadata[field.id]} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * FIELD INPUT/DISPLAY HELPERS
 * ========================================================================== */

/**
 * Field input component for different field types
 */
function FieldInput({
  field,
  value,
  onChange,
  error,
}: {
  field: FieldDefinition;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}) {
  const inputClass = `w-full px-3 py-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`;

  switch (field.type) {
    case 'text':
    case 'email':
    case 'url':
    case 'phone':
      return (
        <input
          type={field.type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      );

    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
          rows={4}
        />
      );

    case 'number':
    case 'decimal':
      return (
        <input
          type="number"
          step={field.type === 'decimal' ? '0.01' : '1'}
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      );

    case 'boolean':
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">{field.placeholder || 'Yes'}</span>
        </label>
      );

    case 'date':
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      );

    case 'datetime':
      return (
        <input
          type="datetime-local"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      );

    case 'time':
      return (
        <input
          type="time"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      );

    case 'select':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Select...</option>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case 'multiselect':
      return (
        <select
          multiple
          value={value || []}
          onChange={(e) => onChange(Array.from(e.target.selectedOptions, opt => opt.value))}
          className={inputClass}
        >
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          {field.options?.map(opt => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(e.target.value)}
                disabled={opt.disabled}
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map(opt => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={opt.value}
                checked={(value || []).includes(opt.value)}
                onChange={(e) => {
                  const current = value || [];
                  const newValue = e.target.checked
                    ? [...current, opt.value]
                    : current.filter((v: any) => v !== opt.value);
                  onChange(newValue);
                }}
                disabled={opt.disabled}
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      );

    default:
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      );
  }
}

/**
 * Field display component for read-only values
 */
function FieldDisplay({ field, value }: { field: FieldDefinition; value: any }) {
  if (value === undefined || value === null || value === '') {
    return <span className="text-gray-400 italic">Not set</span>;
  }

  switch (field.type) {
    case 'boolean':
      return <span>{value ? 'Yes' : 'No'}</span>;

    case 'date':
      return <span>{new Date(value).toLocaleDateString()}</span>;

    case 'datetime':
      return <span>{new Date(value).toLocaleString()}</span>;

    case 'select':
    case 'radio':
      const option = field.options?.find(opt => opt.value === value);
      return <span>{option?.label || value}</span>;

    case 'multiselect':
    case 'checkbox':
      const labels = (value as any[])?.map(v => {
        const opt = field.options?.find(o => o.value === v);
        return opt?.label || v;
      });
      return <span>{labels?.join(', ') || value}</span>;

    case 'url':
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {value}
        </a>
      );

    case 'email':
      return (
        <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      );

    default:
      return <span>{String(value)}</span>;
  }
}

/* ============================================================================
 * FIELD CRUD OPERATIONS
 * ========================================================================== */

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
export async function createField(
  entityType: string,
  fieldData: Omit<FieldDefinition, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FieldDefinition> {
  const response = await fetch(`/api/custom-fields/${entityType}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fieldData),
  });

  if (!response.ok) {
    throw new Error('Failed to create field');
  }

  return response.json();
}

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
export async function updateField(
  entityType: string,
  fieldId: string,
  updates: Partial<FieldDefinition>
): Promise<FieldDefinition> {
  const response = await fetch(`/api/custom-fields/${entityType}/${fieldId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update field');
  }

  return response.json();
}

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
export async function deleteField(
  entityType: string,
  fieldId: string
): Promise<void> {
  const response = await fetch(`/api/custom-fields/${entityType}/${fieldId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete field');
  }
}

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
export async function reorderFields(
  entityType: string,
  fieldIds: string[]
): Promise<FieldDefinition[]> {
  const response = await fetch(`/api/custom-fields/${entityType}/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fieldIds }),
  });

  if (!response.ok) {
    throw new Error('Failed to reorder fields');
  }

  const data = await response.json();
  return data.fields;
}

/* ============================================================================
 * FIELD TYPE HELPERS
 * ========================================================================== */

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
export function createTextField(options: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  defaultValue?: string;
}): Partial<FieldDefinition> {
  const validation: ValidationRule[] = [];

  if (options.required) {
    validation.push({ type: 'required', message: `${options.label} is required` });
  }
  if (options.minLength) {
    validation.push({
      type: 'minLength',
      value: options.minLength,
      message: `${options.label} must be at least ${options.minLength} characters`,
    });
  }
  if (options.maxLength) {
    validation.push({
      type: 'maxLength',
      value: options.maxLength,
      message: `${options.label} must be no more than ${options.maxLength} characters`,
    });
  }
  if (options.pattern) {
    validation.push({
      type: 'pattern',
      value: options.pattern,
      message: `${options.label} format is invalid`,
    });
  }

  return {
    name: options.name,
    label: options.label,
    type: 'text',
    placeholder: options.placeholder,
    required: options.required,
    defaultValue: options.defaultValue,
    validation: validation.length > 0 ? validation : undefined,
    order: 0,
  };
}

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
export function createNumberField(options: {
  name: string;
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
  defaultValue?: number;
  isDecimal?: boolean;
}): Partial<FieldDefinition> {
  const validation: ValidationRule[] = [];

  if (options.required) {
    validation.push({ type: 'required', message: `${options.label} is required` });
  }
  if (options.min !== undefined) {
    validation.push({
      type: 'min',
      value: options.min,
      message: `${options.label} must be at least ${options.min}`,
    });
  }
  if (options.max !== undefined) {
    validation.push({
      type: 'max',
      value: options.max,
      message: `${options.label} must be no more than ${options.max}`,
    });
  }

  return {
    name: options.name,
    label: options.label,
    type: options.isDecimal ? 'decimal' : 'number',
    required: options.required,
    defaultValue: options.defaultValue,
    validation: validation.length > 0 ? validation : undefined,
    order: 0,
  };
}

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
export function createSelectField(options: {
  name: string;
  label: string;
  options: FieldOption[];
  required?: boolean;
  defaultValue?: string | number;
  multiSelect?: boolean;
}): Partial<FieldDefinition> {
  const validation: ValidationRule[] = [];

  if (options.required) {
    validation.push({ type: 'required', message: `${options.label} is required` });
  }

  return {
    name: options.name,
    label: options.label,
    type: options.multiSelect ? 'multiselect' : 'select',
    options: options.options,
    required: options.required,
    defaultValue: options.defaultValue,
    validation: validation.length > 0 ? validation : undefined,
    order: 0,
  };
}

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
export function createDateField(options: {
  name: string;
  label: string;
  required?: boolean;
  includeTime?: boolean;
  defaultValue?: string;
}): Partial<FieldDefinition> {
  const validation: ValidationRule[] = [];

  if (options.required) {
    validation.push({ type: 'required', message: `${options.label} is required` });
  }

  return {
    name: options.name,
    label: options.label,
    type: options.includeTime ? 'datetime' : 'date',
    required: options.required,
    defaultValue: options.defaultValue,
    validation: validation.length > 0 ? validation : undefined,
    order: 0,
  };
}

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
export function createFileField(options: {
  name: string;
  label: string;
  required?: boolean;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
}): Partial<FieldDefinition> {
  const validation: ValidationRule[] = [];

  if (options.required) {
    validation.push({ type: 'required', message: `${options.label} is required` });
  }

  return {
    name: options.name,
    label: options.label,
    type: 'file',
    required: options.required,
    validation: validation.length > 0 ? validation : undefined,
    metadata: {
      acceptedTypes: options.acceptedTypes,
      maxSize: options.maxSize,
      multiple: options.multiple,
    },
    order: 0,
  };
}

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
export function createRelationField(options: {
  name: string;
  label: string;
  relatedEntity: string;
  displayField: string;
  required?: boolean;
  multiple?: boolean;
}): Partial<FieldDefinition> {
  const validation: ValidationRule[] = [];

  if (options.required) {
    validation.push({ type: 'required', message: `${options.label} is required` });
  }

  return {
    name: options.name,
    label: options.label,
    type: 'relation',
    required: options.required,
    validation: validation.length > 0 ? validation : undefined,
    metadata: {
      relatedEntity: options.relatedEntity,
      displayField: options.displayField,
      multiple: options.multiple,
    },
    order: 0,
  };
}

/* ============================================================================
 * FIELD VALIDATION
 * ========================================================================== */

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
export async function validateFields(
  fields: FieldDefinition[],
  values: Record<string, any>
): Promise<ValidationResult> {
  const errors: Record<string, string[]> = {};

  for (const field of fields) {
    const value = values[field.id];
    const fieldErrors: string[] = [];

    // Required validation
    if (field.required && (value === undefined || value === null || value === '')) {
      fieldErrors.push(`${field.label} is required`);
    }

    // Skip other validations if empty and not required
    if (!field.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Custom validation rules
    if (field.validation) {
      for (const rule of field.validation) {
        let isValid = true;

        switch (rule.type) {
          case 'minLength':
            if (typeof value === 'string' && value.length < rule.value) {
              isValid = false;
            }
            break;

          case 'maxLength':
            if (typeof value === 'string' && value.length > rule.value) {
              isValid = false;
            }
            break;

          case 'min':
            if (typeof value === 'number' && value < rule.value) {
              isValid = false;
            }
            break;

          case 'max':
            if (typeof value === 'number' && value > rule.value) {
              isValid = false;
            }
            break;

          case 'pattern':
            if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
              isValid = false;
            }
            break;

          case 'email':
            if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              isValid = false;
            }
            break;

          case 'url':
            if (typeof value === 'string') {
              try {
                new URL(value);
              } catch {
                isValid = false;
              }
            }
            break;

          case 'custom':
            if (rule.validator) {
              isValid = await rule.validator(value, values);
            }
            break;
        }

        if (!isValid) {
          fieldErrors.push(rule.message);
        }
      }
    }

    if (fieldErrors.length > 0) {
      errors[field.id] = fieldErrors;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

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
export async function validateFieldValue(
  field: FieldDefinition,
  value: any,
  allValues: Record<string, any> = {}
): Promise<string[]> {
  const errors: string[] = [];

  if (field.required && (value === undefined || value === null || value === '')) {
    errors.push(`${field.label} is required`);
    return errors;
  }

  if (!field.required && (value === undefined || value === null || value === '')) {
    return errors;
  }

  if (field.validation) {
    for (const rule of field.validation) {
      let isValid = true;

      switch (rule.type) {
        case 'minLength':
          if (typeof value === 'string' && value.length < rule.value) {
            isValid = false;
          }
          break;

        case 'maxLength':
          if (typeof value === 'string' && value.length > rule.value) {
            isValid = false;
          }
          break;

        case 'min':
          if (typeof value === 'number' && value < rule.value) {
            isValid = false;
          }
          break;

        case 'max':
          if (typeof value === 'number' && value > rule.value) {
            isValid = false;
          }
          break;

        case 'pattern':
          if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
            isValid = false;
          }
          break;

        case 'custom':
          if (rule.validator) {
            isValid = await rule.validator(value, allValues);
          }
          break;
      }

      if (!isValid) {
        errors.push(rule.message);
      }
    }
  }

  return errors;
}

/* ============================================================================
 * FIELD CONDITIONALS & DEPENDENCIES
 * ========================================================================== */

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
export function evaluateVisibilityConditions(
  conditions: VisibilityCondition[] | undefined,
  values: Record<string, any>
): boolean {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  // Group conditions by logic operator
  const andConditions = conditions.filter(c => !c.logic || c.logic === 'and');
  const orConditions = conditions.filter(c => c.logic === 'or');

  // Evaluate AND conditions (all must be true)
  const andResult = andConditions.every(condition => evaluateSingleCondition(condition, values));

  // Evaluate OR conditions (at least one must be true)
  const orResult = orConditions.length === 0 ||
    orConditions.some(condition => evaluateSingleCondition(condition, values));

  return andResult && orResult;
}

/**
 * Evaluates a single visibility condition
 */
function evaluateSingleCondition(
  condition: VisibilityCondition,
  values: Record<string, any>
): boolean {
  const fieldValue = values[condition.field];

  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;

    case 'notEquals':
      return fieldValue !== condition.value;

    case 'contains':
      if (typeof fieldValue === 'string') {
        return fieldValue.includes(condition.value);
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(condition.value);
      }
      return false;

    case 'greaterThan':
      return fieldValue > condition.value;

    case 'lessThan':
      return fieldValue < condition.value;

    case 'isEmpty':
      return fieldValue === undefined || fieldValue === null || fieldValue === '' ||
        (Array.isArray(fieldValue) && fieldValue.length === 0);

    case 'isNotEmpty':
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== '' &&
        (!Array.isArray(fieldValue) || fieldValue.length > 0);

    default:
      return true;
  }
}

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
export function getDependentFields(
  fieldId: string,
  allFields: FieldDefinition[]
): FieldDefinition[] {
  return allFields.filter(field => {
    if (!field.visibilityConditions) return false;
    return field.visibilityConditions.some(condition => condition.field === fieldId);
  });
}

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
export function getFieldDependencies(field: FieldDefinition): string[] {
  const dependencies: string[] = [];

  if (field.visibilityConditions) {
    field.visibilityConditions.forEach(condition => {
      if (!dependencies.includes(condition.field)) {
        dependencies.push(condition.field);
      }
    });
  }

  if (field.calculated?.dependencies) {
    field.calculated.dependencies.forEach(dep => {
      if (!dependencies.includes(dep)) {
        dependencies.push(dep);
      }
    });
  }

  return dependencies;
}

/* ============================================================================
 * REPEATABLE & NESTED FIELDS
 * ========================================================================== */

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
export function createRepeatableField(options: {
  name: string;
  label: string;
  childField: Partial<FieldDefinition>;
  maxRepeat?: number;
  minRepeat?: number;
}): Partial<FieldDefinition> {
  return {
    name: options.name,
    label: options.label,
    type: 'json',
    repeatable: true,
    maxRepeat: options.maxRepeat,
    metadata: {
      childField: options.childField,
      minRepeat: options.minRepeat,
    },
    order: 0,
  };
}

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
export function createNestedFields(options: {
  name: string;
  label: string;
  fields: Partial<FieldDefinition>[];
  description?: string;
}): Partial<FieldDefinition> {
  return {
    name: options.name,
    label: options.label,
    type: 'json',
    description: options.description,
    nested: options.fields as FieldDefinition[],
    order: 0,
  };
}

/* ============================================================================
 * FIELD TEMPLATES & PRESETS
 * ========================================================================== */

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
export async function createFieldTemplate(
  template: Omit<FieldTemplate, 'id' | 'usageCount'>
): Promise<FieldTemplate> {
  const response = await fetch('/api/field-templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template),
  });

  if (!response.ok) {
    throw new Error('Failed to create template');
  }

  return response.json();
}

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
export async function getFieldTemplates(options?: {
  category?: string;
  tags?: string[];
}): Promise<FieldTemplate[]> {
  const params = new URLSearchParams();
  if (options?.category) params.set('category', options.category);
  if (options?.tags) params.set('tags', options.tags.join(','));

  const response = await fetch(`/api/field-templates?${params}`);
  if (!response.ok) {
    throw new Error('Failed to load templates');
  }

  const data = await response.json();
  return data.templates || [];
}

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
export async function applyFieldTemplate(
  templateId: string,
  overrides?: Partial<FieldDefinition>
): Promise<Partial<FieldDefinition>> {
  const response = await fetch(`/api/field-templates/${templateId}`);
  if (!response.ok) {
    throw new Error('Failed to load template');
  }

  const template: FieldTemplate = await response.json();

  return {
    ...template.field,
    ...overrides,
  };
}

/**
 * Common field presets
 */
export const FIELD_PRESETS = {
  /**
   * Standard contact fields
   */
  contact: {
    firstName: createTextField({
      name: 'first_name',
      label: 'First Name',
      required: true,
      maxLength: 50,
    }),
    lastName: createTextField({
      name: 'last_name',
      label: 'Last Name',
      required: true,
      maxLength: 50,
    }),
    email: createTextField({
      name: 'email',
      label: 'Email Address',
      required: true,
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    }),
    phone: createTextField({
      name: 'phone',
      label: 'Phone Number',
      pattern: '^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$',
    }),
  },

  /**
   * Address fields
   */
  address: createNestedFields({
    name: 'address',
    label: 'Address',
    fields: [
      createTextField({ name: 'street1', label: 'Street Address 1', required: true }),
      createTextField({ name: 'street2', label: 'Street Address 2' }),
      createTextField({ name: 'city', label: 'City', required: true }),
      createTextField({ name: 'state', label: 'State/Province', required: true }),
      createTextField({ name: 'postal_code', label: 'Postal Code', required: true }),
      createTextField({ name: 'country', label: 'Country', required: true }),
    ],
  }),

  /**
   * Common status field
   */
  status: createSelectField({
    name: 'status',
    label: 'Status',
    options: [
      { value: 'draft', label: 'Draft', color: 'gray' },
      { value: 'pending', label: 'Pending', color: 'yellow' },
      { value: 'active', label: 'Active', color: 'green' },
      { value: 'completed', label: 'Completed', color: 'blue' },
      { value: 'cancelled', label: 'Cancelled', color: 'red' },
    ],
    required: true,
  }),

  /**
   * Priority field
   */
  priority: createSelectField({
    name: 'priority',
    label: 'Priority',
    options: [
      { value: 'low', label: 'Low', color: 'gray' },
      { value: 'medium', label: 'Medium', color: 'yellow' },
      { value: 'high', label: 'High', color: 'orange' },
      { value: 'urgent', label: 'Urgent', color: 'red' },
    ],
  }),
};

/* ============================================================================
 * METADATA SCHEMA MANAGEMENT
 * ========================================================================== */

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
export async function createMetadataSchema(
  schema: Omit<MetadataSchema, 'id' | 'version' | 'createdAt' | 'updatedAt'>
): Promise<MetadataSchema> {
  const response = await fetch('/api/metadata-schemas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schema),
  });

  if (!response.ok) {
    throw new Error('Failed to create schema');
  }

  return response.json();
}

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
export async function getMetadataSchema(schemaId: string): Promise<MetadataSchema> {
  const response = await fetch(`/api/metadata-schemas/${schemaId}`);
  if (!response.ok) {
    throw new Error('Failed to load schema');
  }

  return response.json();
}

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
export async function updateMetadataSchema(
  schemaId: string,
  updates: Partial<MetadataSchema>
): Promise<MetadataSchema> {
  const response = await fetch(`/api/metadata-schemas/${schemaId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update schema');
  }

  return response.json();
}

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
export async function validateAgainstSchema(
  schema: MetadataSchema,
  data: Record<string, any>
): Promise<ValidationResult> {
  return validateFields(schema.fields, data);
}

/* ============================================================================
 * IMPORT/EXPORT
 * ========================================================================== */

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
export async function exportMetadata(
  entityType: string,
  entityIds: string[],
  format: ExportFormat = 'json'
): Promise<Blob> {
  const response = await fetch('/api/metadata/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      entityType,
      entityIds,
      format,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to export metadata');
  }

  return response.blob();
}

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
export async function importMetadata(
  entityType: string,
  file: File,
  options: {
    updateExisting?: boolean;
    skipErrors?: boolean;
    validateOnly?: boolean;
  } = {}
): Promise<{
  successCount: number;
  errorCount: number;
  errors: Array<{ row: number; message: string }>;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', entityType);
  formData.append('options', JSON.stringify(options));

  const response = await fetch('/api/metadata/import', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to import metadata');
  }

  return response.json();
}

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
export async function bulkEditMetadata(
  operation: BulkEditOperation
): Promise<{
  updatedCount: number;
  errors: Array<{ entityId: string; message: string }>;
}> {
  const response = await fetch('/api/metadata/bulk-edit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(operation),
  });

  if (!response.ok) {
    throw new Error('Failed to perform bulk edit');
  }

  return response.json();
}

/* ============================================================================
 * PERMISSIONS & ACCESS CONTROL
 * ========================================================================== */

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
export function checkFieldPermission(
  field: FieldDefinition,
  userRole: string,
  action: 'view' | 'edit' | 'delete'
): boolean {
  if (!field.permissions || field.permissions.length === 0) {
    return true; // No restrictions
  }

  const permission = field.permissions.find(p => p.role === userRole);
  if (!permission) {
    return false; // No permission defined for this role
  }

  switch (action) {
    case 'view':
      return permission.canView;
    case 'edit':
      return permission.canEdit;
    case 'delete':
      return permission.canDelete;
    default:
      return false;
  }
}

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
export function filterFieldsByPermission(
  fields: FieldDefinition[],
  userRole: string,
  action: 'view' | 'edit' = 'view'
): FieldDefinition[] {
  return fields.filter(field => checkFieldPermission(field, userRole, action));
}

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
export async function setFieldPermissions(
  entityType: string,
  fieldId: string,
  permissions: FieldPermission[]
): Promise<FieldDefinition> {
  return updateField(entityType, fieldId, { permissions });
}

/* ============================================================================
 * SEARCH & FILTERING
 * ========================================================================== */

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
export function searchFields(
  fields: FieldDefinition[],
  options: FieldSearchOptions
): FieldDefinition[] {
  let results = [...fields];

  // Filter by query
  if (options.query) {
    const query = options.query.toLowerCase();
    results = results.filter(
      field =>
        field.name.toLowerCase().includes(query) ||
        field.label.toLowerCase().includes(query) ||
        field.description?.toLowerCase().includes(query)
    );
  }

  // Filter by types
  if (options.types && options.types.length > 0) {
    results = results.filter(field => options.types!.includes(field.type));
  }

  // Filter by groups
  if (options.groups && options.groups.length > 0) {
    results = results.filter(field => field.group && options.groups!.includes(field.group));
  }

  // Sort results
  if (options.sortBy) {
    results.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (options.sortBy) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'type':
          aVal = a.type;
          bVal = b.type;
          break;
        case 'created':
          aVal = a.createdAt;
          bVal = b.createdAt;
          break;
        case 'updated':
          aVal = a.updatedAt;
          bVal = b.updatedAt;
          break;
        case 'order':
          aVal = a.order;
          bVal = b.order;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return options.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return options.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return results;
}

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
export async function queryMetadata(query: {
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
}): Promise<Array<{ entityId: string; metadata: Record<string, any> }>> {
  const response = await fetch('/api/metadata/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    throw new Error('Failed to query metadata');
  }

  const data = await response.json();
  return data.results || [];
}

/* ============================================================================
 * VERSIONING & HISTORY
 * ========================================================================== */

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
export async function getMetadataHistory(
  entityType: string,
  entityId: string,
  options?: {
    fieldId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }
): Promise<MetadataHistoryEntry[]> {
  const params = new URLSearchParams();
  if (options?.fieldId) params.set('fieldId', options.fieldId);
  if (options?.startDate) params.set('startDate', options.startDate.toISOString());
  if (options?.endDate) params.set('endDate', options.endDate.toISOString());
  if (options?.limit) params.set('limit', options.limit.toString());

  const response = await fetch(
    `/api/metadata/${entityType}/${entityId}/history?${params}`
  );

  if (!response.ok) {
    throw new Error('Failed to load history');
  }

  const data = await response.json();
  return data.history || [];
}

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
export async function revertMetadata(
  entityType: string,
  entityId: string,
  historyId: string
): Promise<Record<string, any>> {
  const response = await fetch(
    `/api/metadata/${entityType}/${entityId}/revert/${historyId}`,
    {
      method: 'POST',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to revert metadata');
  }

  const data = await response.json();
  return data.metadata;
}

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
export function compareMetadataVersions(
  oldMetadata: Record<string, any>,
  newMetadata: Record<string, any>
): {
  added: string[];
  modified: Array<{ field: string; oldValue: any; newValue: any }>;
  removed: string[];
} {
  const added: string[] = [];
  const modified: Array<{ field: string; oldValue: any; newValue: any }> = [];
  const removed: string[] = [];

  // Find added and modified
  for (const [key, newValue] of Object.entries(newMetadata)) {
    if (!(key in oldMetadata)) {
      added.push(key);
    } else if (JSON.stringify(oldMetadata[key]) !== JSON.stringify(newValue)) {
      modified.push({ field: key, oldValue: oldMetadata[key], newValue });
    }
  }

  // Find removed
  for (const key of Object.keys(oldMetadata)) {
    if (!(key in newMetadata)) {
      removed.push(key);
    }
  }

  return { added, modified, removed };
}

/* ============================================================================
 * CALCULATED FIELDS
 * ========================================================================== */

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
export function createCalculatedField(options: {
  name: string;
  label: string;
  formula: string;
  dependencies: string[];
  formatter?: (value: any) => any;
  recalculateOn?: 'change' | 'save' | 'manual';
}): Partial<FieldDefinition> {
  return {
    name: options.name,
    label: options.label,
    type: 'calculated',
    calculated: {
      formula: options.formula,
      dependencies: options.dependencies,
      formatter: options.formatter,
      recalculateOn: options.recalculateOn || 'change',
    },
    order: 0,
  };
}

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
export function evaluateCalculatedField(
  config: CalculatedFieldConfig,
  values: Record<string, any>
): any {
  try {
    // Create a safe evaluation context with only the dependent values
    const context: Record<string, any> = {};
    config.dependencies.forEach(dep => {
      context[dep] = values[dep];
    });

    // Simple formula evaluation (in production, use a safe expression evaluator)
    const result = evaluateFormula(config.formula, context);

    // Apply formatter if provided
    return config.formatter ? config.formatter(result) : result;
  } catch (err) {
    console.error('Failed to evaluate calculated field:', err);
    return null;
  }
}

/**
 * Simple formula evaluator (in production, use a proper expression parser)
 */
function evaluateFormula(formula: string, context: Record<string, any>): any {
  // This is a simplified implementation
  // In production, use a library like math.js or a safe expression evaluator

  let expression = formula;

  // Replace field names with their values
  for (const [key, value] of Object.entries(context)) {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    expression = expression.replace(regex, String(value ?? 0));
  }

  // Evaluate the expression (CAUTION: eval is dangerous, use safe evaluator in production)
  try {
    // eslint-disable-next-line no-eval
    return eval(expression);
  } catch {
    return null;
  }
}

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
export function autoPopulateField(options: {
  type: 'sequence' | 'current-date' | 'current-user' | 'derived';
  prefix?: string;
  suffix?: string;
  startFrom?: number;
  padding?: number;
  format?: string;
  sourceField?: string;
  transform?: (value: any) => any;
}): any {
  switch (options.type) {
    case 'current-date':
      const date = new Date();
      if (options.format === 'iso') {
        return date.toISOString();
      } else if (options.format === 'date') {
        return date.toISOString().split('T')[0];
      }
      return date;

    case 'sequence':
      // In production, this would fetch the next sequence number from the server
      const num = (options.startFrom || 1).toString();
      const padded = options.padding ? num.padStart(options.padding, '0') : num;
      return `${options.prefix || ''}${padded}${options.suffix || ''}`;

    case 'derived':
      // Would derive from another field
      return null;

    default:
      return null;
  }
}

/* ============================================================================
 * UTILITY FUNCTIONS
 * ========================================================================== */

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
export function createFieldDefinition(
  config: Partial<FieldDefinition>
): Partial<FieldDefinition> {
  return {
    order: 0,
    ...config,
  };
}

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
export function cloneField(
  field: FieldDefinition,
  overrides?: Partial<FieldDefinition>
): Partial<FieldDefinition> {
  const { id, createdAt, updatedAt, ...fieldData } = field;
  return {
    ...fieldData,
    ...overrides,
  };
}

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
export function getFieldValueOrDefault(
  field: FieldDefinition,
  metadata: Record<string, any>
): any {
  const value = metadata[field.id];
  if (value !== undefined && value !== null) {
    return value;
  }
  return field.defaultValue;
}

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
export function sanitizeFieldValues(
  fields: FieldDefinition[],
  values: Record<string, any>
): Record<string, any> {
  const sanitized: Record<string, any> = {};

  fields.forEach(field => {
    const value = values[field.id];

    if (value === undefined || value === null || value === '') {
      // Skip empty values unless field has a default
      if (field.defaultValue !== undefined) {
        sanitized[field.id] = field.defaultValue;
      }
      return;
    }

    // Type-specific sanitization
    switch (field.type) {
      case 'number':
      case 'decimal':
        sanitized[field.id] = Number(value);
        break;

      case 'boolean':
        sanitized[field.id] = Boolean(value);
        break;

      case 'text':
      case 'textarea':
      case 'email':
      case 'url':
      case 'phone':
        sanitized[field.id] = String(value).trim();
        break;

      case 'multiselect':
      case 'checkbox':
        sanitized[field.id] = Array.isArray(value) ? value : [value];
        break;

      default:
        sanitized[field.id] = value;
    }
  });

  return sanitized;
}

/**
 * Type guard for field definition
 */
export function isFieldDefinition(obj: any): obj is FieldDefinition {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'name' in obj &&
    'label' in obj &&
    'type' in obj
  );
}

/**
 * Type guard for metadata schema
 */
export function isMetadataSchema(obj: any): obj is MetadataSchema {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'name' in obj &&
    'entityType' in obj &&
    'fields' in obj &&
    Array.isArray(obj.fields)
  );
}
