"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIELD_PRESETS = void 0;
exports.useCustomFields = useCustomFields;
exports.useMetadata = useMetadata;
exports.useFieldDefinitions = useFieldDefinitions;
exports.CustomFieldBuilder = CustomFieldBuilder;
exports.FieldDefinitionEditor = FieldDefinitionEditor;
exports.MetadataPanel = MetadataPanel;
exports.MetadataForm = MetadataForm;
exports.MetadataViewer = MetadataViewer;
exports.createField = createField;
exports.updateField = updateField;
exports.deleteField = deleteField;
exports.reorderFields = reorderFields;
exports.createTextField = createTextField;
exports.createNumberField = createNumberField;
exports.createSelectField = createSelectField;
exports.createDateField = createDateField;
exports.createFileField = createFileField;
exports.createRelationField = createRelationField;
exports.validateFields = validateFields;
exports.validateFieldValue = validateFieldValue;
exports.evaluateVisibilityConditions = evaluateVisibilityConditions;
exports.getDependentFields = getDependentFields;
exports.getFieldDependencies = getFieldDependencies;
exports.createRepeatableField = createRepeatableField;
exports.createNestedFields = createNestedFields;
exports.createFieldTemplate = createFieldTemplate;
exports.getFieldTemplates = getFieldTemplates;
exports.applyFieldTemplate = applyFieldTemplate;
exports.createMetadataSchema = createMetadataSchema;
exports.getMetadataSchema = getMetadataSchema;
exports.updateMetadataSchema = updateMetadataSchema;
exports.validateAgainstSchema = validateAgainstSchema;
exports.exportMetadata = exportMetadata;
exports.importMetadata = importMetadata;
exports.bulkEditMetadata = bulkEditMetadata;
exports.checkFieldPermission = checkFieldPermission;
exports.filterFieldsByPermission = filterFieldsByPermission;
exports.setFieldPermissions = setFieldPermissions;
exports.searchFields = searchFields;
exports.queryMetadata = queryMetadata;
exports.getMetadataHistory = getMetadataHistory;
exports.revertMetadata = revertMetadata;
exports.compareMetadataVersions = compareMetadataVersions;
exports.createCalculatedField = createCalculatedField;
exports.evaluateCalculatedField = evaluateCalculatedField;
exports.autoPopulateField = autoPopulateField;
exports.createFieldDefinition = createFieldDefinition;
exports.cloneField = cloneField;
exports.getFieldValueOrDefault = getFieldValueOrDefault;
exports.sanitizeFieldValues = sanitizeFieldValues;
exports.isFieldDefinition = isFieldDefinition;
exports.isMetadataSchema = isMetadataSchema;
const react_1 = require("react");
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
function useCustomFields(entityType, options = {}) {
    const [fields, setFields] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const loadFields = (0, react_1.useCallback)(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/custom-fields/${entityType}`);
            if (!response.ok)
                throw new Error('Failed to load fields');
            const data = await response.json();
            setFields(data.fields || []);
        }
        catch (err) {
            const error = err;
            setError(error);
            options.onError?.(error);
        }
        finally {
            setLoading(false);
        }
    }, [entityType, options]);
    (0, react_1.useEffect)(() => {
        if (options.autoLoad !== false) {
            loadFields();
        }
    }, [loadFields, options.autoLoad]);
    const addField = (0, react_1.useCallback)(async (field) => {
        try {
            const response = await fetch(`/api/custom-fields/${entityType}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(field),
            });
            if (!response.ok)
                throw new Error('Failed to add field');
            const newField = await response.json();
            setFields(prev => [...prev, newField]);
            return newField;
        }
        catch (err) {
            options.onError?.(err);
            throw err;
        }
    }, [entityType, options]);
    const updateField = (0, react_1.useCallback)(async (id, updates) => {
        try {
            const response = await fetch(`/api/custom-fields/${entityType}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok)
                throw new Error('Failed to update field');
            const updated = await response.json();
            setFields(prev => prev.map(f => f.id === id ? updated : f));
            return updated;
        }
        catch (err) {
            options.onError?.(err);
            throw err;
        }
    }, [entityType, options]);
    const deleteField = (0, react_1.useCallback)(async (id) => {
        try {
            const response = await fetch(`/api/custom-fields/${entityType}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok)
                throw new Error('Failed to delete field');
            setFields(prev => prev.filter(f => f.id !== id));
        }
        catch (err) {
            options.onError?.(err);
            throw err;
        }
    }, [entityType, options]);
    const reorderFields = (0, react_1.useCallback)(async (fieldIds) => {
        try {
            const response = await fetch(`/api/custom-fields/${entityType}/reorder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fieldIds }),
            });
            if (!response.ok)
                throw new Error('Failed to reorder fields');
            const reordered = await response.json();
            setFields(reordered.fields);
        }
        catch (err) {
            options.onError?.(err);
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
function useMetadata(entityType, entityId) {
    const [metadata, setMetadata] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const loadMetadata = (0, react_1.useCallback)(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/metadata/${entityType}/${entityId}`);
            if (!response.ok)
                throw new Error('Failed to load metadata');
            const data = await response.json();
            setMetadata(data.metadata || {});
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [entityType, entityId]);
    (0, react_1.useEffect)(() => {
        loadMetadata();
    }, [loadMetadata]);
    const updateMetadata = (0, react_1.useCallback)(async (updates, options) => {
        try {
            const newMetadata = options?.merge ? { ...metadata, ...updates } : updates;
            const response = await fetch(`/api/metadata/${entityType}/${entityId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ metadata: newMetadata }),
            });
            if (!response.ok)
                throw new Error('Failed to update metadata');
            const data = await response.json();
            setMetadata(data.metadata);
            return data.metadata;
        }
        catch (err) {
            setError(err);
            throw err;
        }
    }, [entityType, entityId, metadata]);
    const updateFieldValue = (0, react_1.useCallback)(async (fieldId, value) => {
        return updateMetadata({ [fieldId]: value }, { merge: true });
    }, [updateMetadata]);
    const clearMetadata = (0, react_1.useCallback)(async () => {
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
function useFieldDefinitions(options = {}) {
    const [definitions, setDefinitions] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const loadDefinitions = (0, react_1.useCallback)(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (options.entityType)
                params.set('entityType', options.entityType);
            if (options.includeArchived)
                params.set('includeArchived', 'true');
            const response = await fetch(`/api/field-definitions?${params}`);
            if (!response.ok)
                throw new Error('Failed to load definitions');
            const data = await response.json();
            setDefinitions(data.definitions || []);
        }
        catch (err) {
            console.error('Failed to load field definitions:', err);
        }
        finally {
            setLoading(false);
        }
    }, [options.entityType, options.includeArchived]);
    (0, react_1.useEffect)(() => {
        loadDefinitions();
    }, [loadDefinitions]);
    const createDefinition = (0, react_1.useCallback)(async (definition) => {
        const response = await fetch('/api/field-definitions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(definition),
        });
        if (!response.ok)
            throw new Error('Failed to create definition');
        const newDef = await response.json();
        setDefinitions(prev => [...prev, newDef]);
        return newDef;
    }, []);
    const searchDefinitions = (0, react_1.useCallback)((searchOptions) => {
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
function CustomFieldBuilder({ onFieldCreate, availableTypes = ['text', 'textarea', 'number', 'select', 'date', 'boolean'], defaultValues, groups, className, onCancel, }) {
    const [fieldData, setFieldData] = (0, react_1.useState)({
        type: 'text',
        required: false,
        order: 0,
        ...defaultValues,
    });
    const [options, setOptions] = (0, react_1.useState)([]);
    const [validationRules, setValidationRules] = (0, react_1.useState)([]);
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const field = {
                ...fieldData,
                name: fieldData.name,
                label: fieldData.label,
                type: fieldData.type,
                order: fieldData.order ?? 0,
                options: ['select', 'multiselect', 'radio', 'checkbox'].includes(fieldData.type) ? options : undefined,
                validation: validationRules.length > 0 ? validationRules : undefined,
            };
            await onFieldCreate(field);
            // Reset form
            setFieldData({ type: 'text', required: false, order: 0 });
            setOptions([]);
            setValidationRules([]);
        }
        catch (err) {
            console.error('Failed to create field:', err);
        }
        finally {
            setSubmitting(false);
        }
    };
    const addOption = () => {
        setOptions([...options, { value: '', label: '' }]);
    };
    const updateOption = (index, updates) => {
        setOptions(options.map((opt, i) => i === index ? { ...opt, ...updates } : opt));
    };
    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    };
    return onSubmit = { handleSubmit };
    className = { className } >
        className;
    "space-y-4" >
        className;
    "block text-sm font-medium mb-1" > Field;
    Name < /label>
        < input;
    type = "text";
    required;
    value = { fieldData, : .name || '' };
    onChange = {}(e);
    setFieldData({ ...fieldData, name: e.target.value });
}
className = "w-full px-3 py-2 border rounded";
placeholder = "field_name"
    /  >
    /div>
    < div >
    className;
"block text-sm font-medium mb-1" > Field;
Label < /label>
    < input;
type = "text";
required;
value = { fieldData, : .label || '' };
onChange = {}(e);
setFieldData({ ...fieldData, label: e.target.value });
className = "w-full px-3 py-2 border rounded";
placeholder = "Field Label"
    /  >
    /div>
    < div >
    className;
"block text-sm font-medium mb-1" > Field;
Type < /label>
    < select;
value = { fieldData, : .type };
onChange = {}(e);
setFieldData({ ...fieldData, type: e.target.value });
className = "w-full px-3 py-2 border rounded"
    >
        { availableTypes, : .map(type => key = { type }, value = { type } >
                { type, : .charAt(0).toUpperCase() + type.slice(1) }
                < /option>) }
    < /select>
    < /div>;
{
    groups && groups.length > 0 && className;
    "block text-sm font-medium mb-1" > Group < /label>
        < select;
    value = { fieldData, : .group || '' };
    onChange = {}(e);
    setFieldData({ ...fieldData, group: e.target.value });
}
className = "w-full px-3 py-2 border rounded"
    >
        value;
"" > No;
Group < /option>;
{
    groups.map(group => key = { group, : .id }, value = { group, : .id } >
        { group, : .label }
        < /option>);
}
/select>
    < /div>;
className;
"block text-sm font-medium mb-1" > Description < /label>
    < textarea;
value = { fieldData, : .description || '' };
onChange = {}(e);
setFieldData({ ...fieldData, description: e.target.value });
className = "w-full px-3 py-2 border rounded";
rows = { 2:  }
    /  >
    /div>
    < div;
className = "flex items-center gap-2" >
    type;
"checkbox";
id = "required";
checked = { fieldData, : .required || false };
onChange = {}(e);
setFieldData({ ...fieldData, required: e.target.checked });
/>
    < label;
htmlFor = "required";
className = "text-sm font-medium" >
    Required;
Field
    < /label>
    < /div>;
{
    ['select', 'multiselect', 'radio', 'checkbox'].includes(fieldData.type) && className;
    "block text-sm font-medium mb-2" > Options < /label>
        < div;
    className = "space-y-2" >
        { options, : .map((option, index) => key = { index }, className = "flex gap-2" >
                type, "text", value = { option, : .value }, onChange = {}(e), updateOption(index, { value: e.target.value })) };
    placeholder = "Value";
    className = "flex-1 px-3 py-2 border rounded"
        /  >
        type;
    "text";
    value = { option, : .label };
    onChange = {}(e);
    updateOption(index, { label: e.target.value });
}
placeholder = "Label";
className = "flex-1 px-3 py-2 border rounded"
    /  >
    type;
"button";
onClick = {}();
removeOption(index);
className = "px-3 py-2 text-red-600 hover:bg-red-50 rounded"
    >
        Remove
    < /button>
    < /div>;
type;
"button";
onClick = { addOption };
className = "px-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
    >
        Add;
Option
    < /button>
    < /div>
    < /div>;
className;
"flex gap-2 pt-4 border-t" >
    type;
"submit";
disabled = { submitting };
className = "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
        { submitting, 'Creating...': 'Create Field' }
    < /button>;
{
    onCancel && type;
    "button";
    onClick = { onCancel };
    className = "px-4 py-2 border rounded hover:bg-gray-50"
        >
            Cancel
        < /button>;
}
/div>
    < /div>
    < /form>;
;
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
function FieldDefinitionEditor({ field, onUpdate, onDelete, className, }) {
    const [editing, setEditing] = (0, react_1.useState)(false);
    const [localField, setLocalField] = (0, react_1.useState)(field);
    const handleSave = async () => {
        await onUpdate(field.id, localField);
        setEditing(false);
    };
    const handleCancel = () => {
        setLocalField(field);
        setEditing(false);
    };
    if (!editing) {
        return className = {} `p-4 border rounded ${className}`;
    }
     >
        className;
    "flex justify-between items-start" >
        className;
    "font-medium" > { field, : .label } < /h4>
        < p;
    className = "text-sm text-gray-600" > { field, : .name }({ field, : .type }) < /p>;
    {
        field.description && className;
        "text-sm text-gray-500 mt-1" > { field, : .description } < /p>;
    }
    /div>
        < div;
    className = "flex gap-2" >
        onClick;
    {
        () => setEditing(true);
    }
    className = "px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
        >
            Edit
        < /button>;
    {
        onDelete && onClick;
        {
            () => onDelete(field.id);
        }
        className = "px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
            >
                Delete
            < /button>;
    }
    /div>
        < /div>
        < /div>;
    ;
}
return className = {} `p-4 border rounded ${className}`;
 >
    className;
"space-y-3" >
    className;
"block text-sm font-medium mb-1" > Label < /label>
    < input;
type = "text";
value = { localField, : .label };
onChange = {}(e);
setLocalField({ ...localField, label: e.target.value });
className = "w-full px-3 py-2 border rounded"
    /  >
    /div>
    < div >
    className;
"block text-sm font-medium mb-1" > Description < /label>
    < textarea;
value = { localField, : .description || '' };
onChange = {}(e);
setLocalField({ ...localField, description: e.target.value });
className = "w-full px-3 py-2 border rounded";
rows = { 2:  }
    /  >
    /div>
    < div;
className = "flex items-center gap-2" >
    type;
"checkbox";
id = {} `required-${field.id}`;
checked = { localField, : .required || false };
onChange = {}(e);
setLocalField({ ...localField, required: e.target.checked });
/>
    < label;
htmlFor = {} `required-${field.id}`;
className = "text-sm" >
    Required
    < /label>
    < /div>
    < div;
className = "flex gap-2 pt-2 border-t" >
    onClick;
{
    handleSave;
}
className = "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
        Save
    < /button>
    < button;
onClick = { handleCancel };
className = "px-4 py-2 border rounded hover:bg-gray-50"
    >
        Cancel
    < /button>
    < /div>
    < /div>
    < /div>;
;
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
function MetadataPanel({ entityType, entityId, fields, metadata, onUpdate, readOnly = false, className, groupBy = 'none', }) {
    const [localMetadata, setLocalMetadata] = (0, react_1.useState)(metadata);
    const [editing, setEditing] = (0, react_1.useState)(false);
    const handleFieldChange = (fieldId, value) => {
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
    const groupedFields = (0, react_1.useMemo)(() => {
        if (groupBy === 'none') {
            return { 'All Fields': fields };
        }
        else if (groupBy === 'type') {
            return fields.reduce((acc, field) => {
                const key = field.type;
                if (!acc[key])
                    acc[key] = [];
                acc[key].push(field);
                return acc;
            }, {});
        }
        else {
            return fields.reduce((acc, field) => {
                const key = field.group || 'Ungrouped';
                if (!acc[key])
                    acc[key] = [];
                acc[key].push(field);
                return acc;
            }, {});
        }
    }, [fields, groupBy]);
    return className = {} `bg-white rounded-lg shadow ${className}`;
}
 >
    className;
"p-4 border-b flex justify-between items-center" >
    className;
"text-lg font-semibold" > Metadata < /h3>;
{
    !readOnly && className;
    "flex gap-2" >
        {} >
        onClick;
    {
        handleSave;
    }
    className = "px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Save
        < /button>
        < button;
    onClick = { handleCancel };
    className = "px-3 py-1 border rounded hover:bg-gray-50"
        >
            Cancel
        < /button>
        < />;
    onClick = {}();
    setEditing(true);
}
className = "px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
    >
        Edit
    < /button>;
/div>;
/div>
    < div;
className = "p-4 space-y-6" >
    { Object, : .entries(groupedFields).map(([groupName, groupFields]) => key = { groupName } >
            { groupBy } !== 'none' && className, "font-medium text-gray-700 mb-3" > { groupName } < /h4>) }
    < div;
className = "space-y-4" >
    { groupFields, : .map(field => key = { field, : .id } >
            className, "block text-sm font-medium mb-1" >
            { field, : .label }, { field, : .required && className, "text-red-500 ml-1":  >  * /span> }
            < /label>, { field, : .description && className, "text-sm text-gray-500 mb-1":  > { field, : .description } < /p> }) };
{
    editing ? field = { field }
        :
    ;
    value = { localMetadata, [field.id]:  };
    onChange = {}(value);
    handleFieldChange(field.id, value);
}
/>;
field = { field };
value = { metadata, [field.id]:  } /  >
;
/div>;
/div>
    < /div>;
/div>
    < /div>;
;
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
function MetadataForm({ fields, initialValues = {}, onSubmit, onCancel, className, submitLabel = 'Submit', }) {
    const [values, setValues] = (0, react_1.useState)(initialValues);
    const [errors, setErrors] = (0, react_1.useState)({});
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const handleFieldChange = (fieldId, value) => {
        setValues({ ...values, [fieldId]: value });
        // Clear error when field changes
        if (errors[fieldId]) {
            setErrors({ ...errors, [fieldId]: '' });
        }
    };
    const validate = () => {
        const newErrors = {};
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        setSubmitting(true);
        try {
            await onSubmit(values);
        }
        catch (err) {
            console.error('Form submission error:', err);
        }
        finally {
            setSubmitting(false);
        }
    };
    return onSubmit = { handleSubmit };
    className = { className } >
        className;
    "space-y-4" >
        { fields, : .map(field => key = { field, : .id } >
                className, "block text-sm font-medium mb-1" >
                { field, : .label }, { field, : .required && className, "text-red-500 ml-1":  >  * /span> }
                < /label>, { field, : .helpText && className, "text-sm text-gray-500 mb-1":  > { field, : .helpText } < /p> }) }
        < FieldInput;
    field = { field };
    value = { values, [field.id]:  };
    onChange = {}(value);
    handleFieldChange(field.id, value);
}
error = { errors, [field.id]:  }
    /  >
    { errors, [field.id]:  && className, "text-sm text-red-600 mt-1":  > { errors, [field.id]:  } < /p> }
    < /div>;
/div>
    < div;
className = "flex gap-2 mt-6 pt-4 border-t" >
    type;
"submit";
disabled = { submitting };
className = "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
        { submitting, 'Submitting...': submitLabel }
    < /button>;
{
    onCancel && type;
    "button";
    onClick = { onCancel };
    className = "px-4 py-2 border rounded hover:bg-gray-50"
        >
            Cancel
        < /button>;
}
/div>
    < /form>;
;
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
function MetadataViewer({ fields, metadata, className, compact = false, showEmpty = true, }) {
    const visibleFields = showEmpty
        ? fields
        : fields.filter(f => metadata[f.id] !== undefined && metadata[f.id] !== null && metadata[f.id] !== '');
    return className = { className } >
        {}
        < /div>;
    className = "space-y-4" >
        { visibleFields, : .map(field => key = { field, : .id } >
                className, "block text-sm font-medium text-gray-700 mb-1" >
                { field, : .label }
                < /label>
                < div, className = "text-sm" >
                field, { field }, value = { metadata, [field.id]:  } /  >
                /div>
                < /div>) }
        < /div>;
}
/div>;
;
/* ============================================================================
 * FIELD INPUT/DISPLAY HELPERS
 * ========================================================================== */
/**
 * Field input component for different field types
 */
function FieldInput({ field, value, onChange, error, }) {
    const inputClass = `w-full px-3 py-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`;
    switch (field.type) {
        case 'text':
        case 'email':
        case 'url':
        case 'phone':
            return type = { field, : .type };
            value = { value } || '';
    }
    onChange = {}(e);
    onChange(e.target.value);
}
placeholder = { field, : .placeholder };
className = { inputClass }
    /  >
;
;
'textarea';
return value = { value } || '';
onChange = {}(e);
onChange(e.target.value);
placeholder = { field, : .placeholder };
className = { inputClass };
rows = { 4:  }
    /  >
;
;
'number';
'decimal';
return type = "number";
step = { field, : .type === 'decimal' ? '0.01' : '1' };
value = { value } || '';
onChange = {}(e);
onChange(e.target.value ? Number(e.target.value) : null);
placeholder = { field, : .placeholder };
className = { inputClass }
    /  >
;
;
'boolean';
return className = "flex items-center gap-2" >
    type;
"checkbox";
checked = { value } || false;
onChange = {}(e);
onChange(e.target.checked);
className = "rounded"
    /  >
    className;
"text-sm" > { field, : .placeholder || 'Yes' } < /span>
    < /label>;
;
'date';
return type = "date";
value = { value } || '';
onChange = {}(e);
onChange(e.target.value);
className = { inputClass }
    /  >
;
;
'datetime';
return type = "datetime-local";
value = { value } || '';
onChange = {}(e);
onChange(e.target.value);
className = { inputClass }
    /  >
;
;
'time';
return type = "time";
value = { value } || '';
onChange = {}(e);
onChange(e.target.value);
className = { inputClass }
    /  >
;
;
'select';
return value = { value } || '';
onChange = {}(e);
onChange(e.target.value);
className = { inputClass }
    >
        value;
"" > Select;
/option>;
{
    field.options?.map(opt => key = { opt, : .value }, value = { opt, : .value }, disabled = { opt, : .disabled } >
        { opt, : .label }
        < /option>);
}
/select>;
;
'multiselect';
return multiple;
value = { value } || [];
onChange = {}(e);
onChange(Array.from(e.target.selectedOptions, opt => opt.value));
className = { inputClass }
    >
        { field, : .options?.map(opt => key = { opt, : .value }, value = { opt, : .value }, disabled = { opt, : .disabled } >
                { opt, : .label }
                < /option>) }
    < /select>;
;
'radio';
return className = "space-y-2" >
    { field, : .options?.map(opt => key = { opt, : .value }, className = "flex items-center gap-2" >
            type, "radio", name = { field, : .id }, value = { opt, : .value }, checked = { value } === opt.value) };
onChange = {}(e);
onChange(e.target.value);
disabled = { opt, : .disabled }
    /  >
    className;
"text-sm" > { opt, : .label } < /span>
    < /label>;
/div>;
;
'checkbox';
return className = "space-y-2" >
    { field, : .options?.map(opt => key = { opt, : .value }, className = "flex items-center gap-2" >
            type, "checkbox", value = { opt, : .value }, checked = {}(value || []).includes(opt.value)) };
onChange = {}(e);
{
    const current = value || [];
    const newValue = e.target.checked
        ? [...current, opt.value]
        : current.filter((v) => v !== opt.value);
    onChange(newValue);
}
disabled = { opt, : .disabled }
    /  >
    className;
"text-sm" > { opt, : .label } < /span>
    < /label>;
/div>;
;
return type = "text";
value = { value } || '';
onChange = {}(e);
onChange(e.target.value);
placeholder = { field, : .placeholder };
className = { inputClass }
    /  >
;
;
/**
 * Field display component for read-only values
 */
function FieldDisplay({ field, value }) {
    if (value === undefined || value === null || value === '') {
        return className;
        "text-gray-400 italic" > Not;
        set < /span>;
    }
    switch (field.type) {
        case 'boolean':
            return { value, 'Yes': 'No' } < /span>;
        case 'date':
            return { new: Date(value).toLocaleDateString() } < /span>;
        case 'datetime':
            return { new: Date(value).toLocaleString() } < /span>;
        case 'select':
        case 'radio':
            const option = field.options?.find(opt => opt.value === value);
            return { option, label } || value;
    }
    /span>;
    'multiselect';
    'checkbox';
    const labels = value?.map(v => {
        const opt = field.options?.find(o => o.value === v);
        return opt?.label || v;
    });
    return { labels, join() { } } || value;
}
/span>;
'url';
return href = { value };
target = "_blank";
rel = "noopener noreferrer";
className = "text-blue-600 hover:underline" >
    { value }
    < /a>;
;
'email';
return href = {} `mailto:${value}`;
className = "text-blue-600 hover:underline" >
    { value }
    < /a>;
;
return {} < /span>;
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
async function createField(entityType, fieldData) {
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
async function updateField(entityType, fieldId, updates) {
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
async function deleteField(entityType, fieldId) {
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
async function reorderFields(entityType, fieldIds) {
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
function createTextField(options) {
    const validation = [];
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
function createNumberField(options) {
    const validation = [];
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
function createSelectField(options) {
    const validation = [];
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
function createDateField(options) {
    const validation = [];
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
function createFileField(options) {
    const validation = [];
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
function createRelationField(options) {
    const validation = [];
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
async function validateFields(fields, values) {
    const errors = {};
    for (const field of fields) {
        const value = values[field.id];
        const fieldErrors = [];
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
                            }
                            catch {
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
async function validateFieldValue(field, value, allValues = {}) {
    const errors = [];
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
function evaluateVisibilityConditions(conditions, values) {
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
function evaluateSingleCondition(condition, values) {
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
function getDependentFields(fieldId, allFields) {
    return allFields.filter(field => {
        if (!field.visibilityConditions)
            return false;
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
function getFieldDependencies(field) {
    const dependencies = [];
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
function createRepeatableField(options) {
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
function createNestedFields(options) {
    return {
        name: options.name,
        label: options.label,
        type: 'json',
        description: options.description,
        nested: options.fields,
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
async function createFieldTemplate(template) {
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
async function getFieldTemplates(options) {
    const params = new URLSearchParams();
    if (options?.category)
        params.set('category', options.category);
    if (options?.tags)
        params.set('tags', options.tags.join(','));
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
async function applyFieldTemplate(templateId, overrides) {
    const response = await fetch(`/api/field-templates/${templateId}`);
    if (!response.ok) {
        throw new Error('Failed to load template');
    }
    const template = await response.json();
    return {
        ...template.field,
        ...overrides,
    };
}
/**
 * Common field presets
 */
exports.FIELD_PRESETS = {
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
async function createMetadataSchema(schema) {
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
async function getMetadataSchema(schemaId) {
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
async function updateMetadataSchema(schemaId, updates) {
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
async function validateAgainstSchema(schema, data) {
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
async function exportMetadata(entityType, entityIds, format = 'json') {
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
async function importMetadata(entityType, file, options = {}) {
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
async function bulkEditMetadata(operation) {
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
function checkFieldPermission(field, userRole, action) {
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
function filterFieldsByPermission(fields, userRole, action = 'view') {
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
async function setFieldPermissions(entityType, fieldId, permissions) {
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
function searchFields(fields, options) {
    let results = [...fields];
    // Filter by query
    if (options.query) {
        const query = options.query.toLowerCase();
        results = results.filter(field => field.name.toLowerCase().includes(query) ||
            field.label.toLowerCase().includes(query) ||
            field.description?.toLowerCase().includes(query));
    }
    // Filter by types
    if (options.types && options.types.length > 0) {
        results = results.filter(field => options.types.includes(field.type));
    }
    // Filter by groups
    if (options.groups && options.groups.length > 0) {
        results = results.filter(field => field.group && options.groups.includes(field.group));
    }
    // Sort results
    if (options.sortBy) {
        results.sort((a, b) => {
            let aVal;
            let bVal;
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
            if (aVal < bVal)
                return options.sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal)
                return options.sortOrder === 'asc' ? 1 : -1;
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
async function queryMetadata(query) {
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
async function getMetadataHistory(entityType, entityId, options) {
    const params = new URLSearchParams();
    if (options?.fieldId)
        params.set('fieldId', options.fieldId);
    if (options?.startDate)
        params.set('startDate', options.startDate.toISOString());
    if (options?.endDate)
        params.set('endDate', options.endDate.toISOString());
    if (options?.limit)
        params.set('limit', options.limit.toString());
    const response = await fetch(`/api/metadata/${entityType}/${entityId}/history?${params}`);
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
async function revertMetadata(entityType, entityId, historyId) {
    const response = await fetch(`/api/metadata/${entityType}/${entityId}/revert/${historyId}`, {
        method: 'POST',
    });
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
function compareMetadataVersions(oldMetadata, newMetadata) {
    const added = [];
    const modified = [];
    const removed = [];
    // Find added and modified
    for (const [key, newValue] of Object.entries(newMetadata)) {
        if (!(key in oldMetadata)) {
            added.push(key);
        }
        else if (JSON.stringify(oldMetadata[key]) !== JSON.stringify(newValue)) {
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
function createCalculatedField(options) {
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
function evaluateCalculatedField(config, values) {
    try {
        // Create a safe evaluation context with only the dependent values
        const context = {};
        config.dependencies.forEach(dep => {
            context[dep] = values[dep];
        });
        // Simple formula evaluation (in production, use a safe expression evaluator)
        const result = evaluateFormula(config.formula, context);
        // Apply formatter if provided
        return config.formatter ? config.formatter(result) : result;
    }
    catch (err) {
        console.error('Failed to evaluate calculated field:', err);
        return null;
    }
}
/**
 * Simple formula evaluator (in production, use a proper expression parser)
 */
function evaluateFormula(formula, context) {
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
    }
    catch {
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
function autoPopulateField(options) {
    switch (options.type) {
        case 'current-date':
            const date = new Date();
            if (options.format === 'iso') {
                return date.toISOString();
            }
            else if (options.format === 'date') {
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
function createFieldDefinition(config) {
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
function cloneField(field, overrides) {
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
function getFieldValueOrDefault(field, metadata) {
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
function sanitizeFieldValues(fields, values) {
    const sanitized = {};
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
function isFieldDefinition(obj) {
    return (obj &&
        typeof obj === 'object' &&
        'id' in obj &&
        'name' in obj &&
        'label' in obj &&
        'type' in obj);
}
/**
 * Type guard for metadata schema
 */
function isMetadataSchema(obj) {
    return (obj &&
        typeof obj === 'object' &&
        'id' in obj &&
        'name' in obj &&
        'entityType' in obj &&
        'fields' in obj &&
        Array.isArray(obj.fields));
}
//# sourceMappingURL=custom-fields-metadata-kit.js.map