/**
 * LOC: ATTR-MDM-001
 * File: /reuse/logistics/attribute-master-data-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Product management services
 *   - Catalog services
 *   - MDM services
 *   - Data quality services
 */
/**
 * Attribute data types
 */
export declare enum AttributeDataType {
    TEXT = "TEXT",
    NUMBER = "NUMBER",
    DECIMAL = "DECIMAL",
    BOOLEAN = "BOOLEAN",
    DATE = "DATE",
    DATETIME = "DATETIME",
    ENUM = "ENUM",
    MULTISELECT = "MULTISELECT",
    JSON = "JSON",
    URL = "URL",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    CURRENCY = "CURRENCY",
    PERCENTAGE = "PERCENTAGE",
    MEASUREMENT = "MEASUREMENT"
}
/**
 * Attribute scope - where attribute is applicable
 */
export declare enum AttributeScope {
    GLOBAL = "GLOBAL",
    CATEGORY = "CATEGORY",
    PRODUCT = "PRODUCT",
    VARIANT = "VARIANT",
    SKU = "SKU"
}
/**
 * Attribute status
 */
export declare enum AttributeStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    DEPRECATED = "DEPRECATED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Validation rule types
 */
export declare enum ValidationRuleType {
    REQUIRED = "REQUIRED",
    MIN_LENGTH = "MIN_LENGTH",
    MAX_LENGTH = "MAX_LENGTH",
    MIN_VALUE = "MIN_VALUE",
    MAX_VALUE = "MAX_VALUE",
    REGEX = "REGEX",
    UNIQUE = "UNIQUE",
    ENUM = "ENUM",
    CUSTOM = "CUSTOM"
}
/**
 * Inheritance strategy
 */
export declare enum InheritanceStrategy {
    NONE = "NONE",
    OVERRIDE = "OVERRIDE",
    MERGE = "MERGE",
    APPEND = "APPEND",
    CASCADE = "CASCADE"
}
/**
 * Validation rule definition
 */
export interface ValidationRule {
    ruleId: string;
    type: ValidationRuleType;
    value?: any;
    message: string;
    severity: 'ERROR' | 'WARNING' | 'INFO';
    customValidator?: (value: any) => boolean;
}
/**
 * Attribute definition
 */
export interface AttributeDefinition {
    attributeId: string;
    code: string;
    name: string;
    description?: string;
    dataType: AttributeDataType;
    scope: AttributeScope;
    status: AttributeStatus;
    isRequired: boolean;
    isSearchable: boolean;
    isFilterable: boolean;
    isSortable: boolean;
    isLocalizable: boolean;
    isSystem: boolean;
    defaultValue?: any;
    unit?: string;
    precision?: number;
    validationRules: ValidationRule[];
    groupId?: string;
    displayOrder: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}
/**
 * Attribute group for organizing related attributes
 */
export interface AttributeGroup {
    groupId: string;
    code: string;
    name: string;
    description?: string;
    parentGroupId?: string;
    categoryIds?: string[];
    displayOrder: number;
    isCollapsible: boolean;
    isExpanded: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Attribute value - actual value assigned to an entity
 */
export interface AttributeValue {
    valueId: string;
    attributeId: string;
    entityId: string;
    entityType: string;
    value: any;
    locale?: string;
    validFrom?: Date;
    validTo?: Date;
    confidence?: number;
    source?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Attribute lookup option (for enum/multiselect)
 */
export interface AttributeLookupOption {
    optionId: string;
    attributeId: string;
    value: string;
    label: string;
    displayOrder: number;
    isActive: boolean;
    parentOptionId?: string;
    metadata?: Record<string, any>;
}
/**
 * Attribute set - collection of attributes for a category
 */
export interface AttributeSet {
    setId: string;
    code: string;
    name: string;
    description?: string;
    attributeIds: string[];
    categoryIds: string[];
    isDefault: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Attribute inheritance rule
 */
export interface InheritanceRule {
    ruleId: string;
    attributeId: string;
    sourceEntityType: string;
    targetEntityType: string;
    strategy: InheritanceStrategy;
    condition?: string;
    priority: number;
    isActive: boolean;
    metadata?: Record<string, any>;
}
/**
 * Data quality report
 */
export interface DataQualityReport {
    reportId: string;
    entityId: string;
    entityType: string;
    completeness: number;
    accuracy: number;
    consistency: number;
    validity: number;
    overallScore: number;
    issues: QualityIssue[];
    generatedAt: Date;
}
/**
 * Data quality issue
 */
export interface QualityIssue {
    issueId: string;
    attributeId: string;
    type: 'MISSING' | 'INVALID' | 'INCONSISTENT' | 'DUPLICATE' | 'OUTDATED';
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    message: string;
    suggestion?: string;
    metadata?: Record<string, any>;
}
/**
 * Attribute search criteria
 */
export interface AttributeSearchCriteria {
    code?: string;
    name?: string;
    dataType?: AttributeDataType[];
    scope?: AttributeScope[];
    status?: AttributeStatus[];
    groupId?: string;
    isRequired?: boolean;
    isSearchable?: boolean;
    isFilterable?: boolean;
    tags?: string[];
}
/**
 * Attribute version for change tracking
 */
export interface AttributeVersion {
    versionId: string;
    attributeId: string;
    version: number;
    changes: Record<string, any>;
    changedBy: string;
    changeReason?: string;
    createdAt: Date;
}
/**
 * 1. Creates a new attribute definition.
 *
 * @param {Partial<AttributeDefinition>} definition - Attribute definition data
 * @returns {AttributeDefinition} Created attribute definition
 *
 * @example
 * ```typescript
 * const attribute = createAttributeDefinition({
 *   code: 'PRODUCT_COLOR',
 *   name: 'Product Color',
 *   dataType: AttributeDataType.ENUM,
 *   scope: AttributeScope.PRODUCT,
 *   isRequired: true,
 *   isSearchable: true,
 *   isFilterable: true
 * });
 * ```
 */
export declare function createAttributeDefinition(definition: Partial<AttributeDefinition>): AttributeDefinition;
/**
 * 2. Updates an existing attribute definition.
 *
 * @param {AttributeDefinition} attribute - Attribute to update
 * @param {Partial<AttributeDefinition>} updates - Updates to apply
 * @param {string} userId - User making the update
 * @returns {AttributeDefinition} Updated attribute
 *
 * @example
 * ```typescript
 * const updated = updateAttributeDefinition(attribute, {
 *   name: 'Product Color (Updated)',
 *   isRequired: false
 * }, 'user-123');
 * ```
 */
export declare function updateAttributeDefinition(attribute: AttributeDefinition, updates: Partial<AttributeDefinition>, userId: string): AttributeDefinition;
/**
 * 3. Adds a validation rule to an attribute.
 *
 * @param {AttributeDefinition} attribute - Attribute to update
 * @param {ValidationRule} rule - Validation rule to add
 * @returns {AttributeDefinition} Updated attribute
 *
 * @example
 * ```typescript
 * const updated = addValidationRule(attribute, {
 *   ruleId: 'rule-1',
 *   type: ValidationRuleType.MIN_LENGTH,
 *   value: 3,
 *   message: 'Minimum 3 characters required',
 *   severity: 'ERROR'
 * });
 * ```
 */
export declare function addValidationRule(attribute: AttributeDefinition, rule: ValidationRule): AttributeDefinition;
/**
 * 4. Removes a validation rule from an attribute.
 *
 * @param {AttributeDefinition} attribute - Attribute to update
 * @param {string} ruleId - Rule ID to remove
 * @returns {AttributeDefinition} Updated attribute
 *
 * @example
 * ```typescript
 * const updated = removeValidationRule(attribute, 'rule-1');
 * ```
 */
export declare function removeValidationRule(attribute: AttributeDefinition, ruleId: string): AttributeDefinition;
/**
 * 5. Activates an attribute definition.
 *
 * @param {AttributeDefinition} attribute - Attribute to activate
 * @param {string} userId - User activating the attribute
 * @returns {AttributeDefinition} Activated attribute
 *
 * @example
 * ```typescript
 * const activated = activateAttribute(attribute, 'user-123');
 * ```
 */
export declare function activateAttribute(attribute: AttributeDefinition, userId: string): AttributeDefinition;
/**
 * 6. Deprecates an attribute definition.
 *
 * @param {AttributeDefinition} attribute - Attribute to deprecate
 * @param {string} userId - User deprecating the attribute
 * @param {string} reason - Deprecation reason
 * @returns {AttributeDefinition} Deprecated attribute
 *
 * @example
 * ```typescript
 * const deprecated = deprecateAttribute(attribute, 'user-123', 'Replaced by new attribute');
 * ```
 */
export declare function deprecateAttribute(attribute: AttributeDefinition, userId: string, reason?: string): AttributeDefinition;
/**
 * 7. Clones an attribute definition.
 *
 * @param {AttributeDefinition} attribute - Attribute to clone
 * @param {string} newCode - New attribute code
 * @param {string} userId - User creating the clone
 * @returns {AttributeDefinition} Cloned attribute
 *
 * @example
 * ```typescript
 * const clone = cloneAttributeDefinition(attribute, 'PRODUCT_COLOR_V2', 'user-123');
 * ```
 */
export declare function cloneAttributeDefinition(attribute: AttributeDefinition, newCode: string, userId: string): AttributeDefinition;
/**
 * 8. Searches attributes by criteria.
 *
 * @param {AttributeDefinition[]} attributes - All attributes
 * @param {AttributeSearchCriteria} criteria - Search criteria
 * @returns {AttributeDefinition[]} Matching attributes
 *
 * @example
 * ```typescript
 * const results = searchAttributes(allAttributes, {
 *   dataType: [AttributeDataType.ENUM],
 *   scope: [AttributeScope.PRODUCT],
 *   status: [AttributeStatus.ACTIVE]
 * });
 * ```
 */
export declare function searchAttributes(attributes: AttributeDefinition[], criteria: AttributeSearchCriteria): AttributeDefinition[];
/**
 * 9. Creates an attribute group.
 *
 * @param {Partial<AttributeGroup>} group - Group data
 * @returns {AttributeGroup} Created group
 *
 * @example
 * ```typescript
 * const group = createAttributeGroup({
 *   code: 'PHYSICAL_ATTRS',
 *   name: 'Physical Attributes',
 *   description: 'Physical product characteristics'
 * });
 * ```
 */
export declare function createAttributeGroup(group: Partial<AttributeGroup>): AttributeGroup;
/**
 * 10. Adds an attribute to a group.
 *
 * @param {AttributeDefinition} attribute - Attribute to update
 * @param {string} groupId - Group ID
 * @returns {AttributeDefinition} Updated attribute
 *
 * @example
 * ```typescript
 * const updated = assignAttributeToGroup(attribute, 'group-123');
 * ```
 */
export declare function assignAttributeToGroup(attribute: AttributeDefinition, groupId: string): AttributeDefinition;
/**
 * 11. Creates an attribute set for a category.
 *
 * @param {Partial<AttributeSet>} set - Attribute set data
 * @returns {AttributeSet} Created attribute set
 *
 * @example
 * ```typescript
 * const set = createAttributeSet({
 *   code: 'CLOTHING_ATTRS',
 *   name: 'Clothing Attributes',
 *   attributeIds: ['attr-1', 'attr-2', 'attr-3'],
 *   categoryIds: ['cat-1', 'cat-2']
 * });
 * ```
 */
export declare function createAttributeSet(set: Partial<AttributeSet>): AttributeSet;
/**
 * 12. Adds an attribute to an attribute set.
 *
 * @param {AttributeSet} set - Attribute set
 * @param {string} attributeId - Attribute ID to add
 * @returns {AttributeSet} Updated set
 *
 * @example
 * ```typescript
 * const updated = addAttributeToSet(set, 'attr-4');
 * ```
 */
export declare function addAttributeToSet(set: AttributeSet, attributeId: string): AttributeSet;
/**
 * 13. Removes an attribute from an attribute set.
 *
 * @param {AttributeSet} set - Attribute set
 * @param {string} attributeId - Attribute ID to remove
 * @returns {AttributeSet} Updated set
 *
 * @example
 * ```typescript
 * const updated = removeAttributeFromSet(set, 'attr-4');
 * ```
 */
export declare function removeAttributeFromSet(set: AttributeSet, attributeId: string): AttributeSet;
/**
 * 14. Gets all attributes for a category.
 *
 * @param {AttributeSet[]} sets - All attribute sets
 * @param {AttributeDefinition[]} attributes - All attributes
 * @param {string} categoryId - Category ID
 * @returns {AttributeDefinition[]} Category attributes
 *
 * @example
 * ```typescript
 * const categoryAttrs = getCategoryAttributes(allSets, allAttributes, 'cat-1');
 * ```
 */
export declare function getCategoryAttributes(sets: AttributeSet[], attributes: AttributeDefinition[], categoryId: string): AttributeDefinition[];
/**
 * 15. Reorders attributes in a group.
 *
 * @param {AttributeDefinition[]} attributes - Attributes to reorder
 * @param {string[]} orderedIds - Ordered attribute IDs
 * @returns {AttributeDefinition[]} Reordered attributes
 *
 * @example
 * ```typescript
 * const reordered = reorderAttributes(groupAttrs, ['attr-3', 'attr-1', 'attr-2']);
 * ```
 */
export declare function reorderAttributes(attributes: AttributeDefinition[], orderedIds: string[]): AttributeDefinition[];
/**
 * 16. Creates an attribute value.
 *
 * @param {Partial<AttributeValue>} value - Value data
 * @returns {AttributeValue} Created value
 *
 * @example
 * ```typescript
 * const value = createAttributeValue({
 *   attributeId: 'attr-1',
 *   entityId: 'product-123',
 *   entityType: 'PRODUCT',
 *   value: 'Blue',
 *   locale: 'en-US'
 * });
 * ```
 */
export declare function createAttributeValue(value: Partial<AttributeValue>): AttributeValue;
/**
 * 17. Updates an attribute value.
 *
 * @param {AttributeValue} value - Value to update
 * @param {any} newValue - New value
 * @param {string} source - Value source
 * @returns {AttributeValue} Updated value
 *
 * @example
 * ```typescript
 * const updated = updateAttributeValue(value, 'Red', 'user-edit');
 * ```
 */
export declare function updateAttributeValue(value: AttributeValue, newValue: any, source?: string): AttributeValue;
/**
 * 18. Gets all values for an entity.
 *
 * @param {AttributeValue[]} values - All values
 * @param {string} entityId - Entity ID
 * @param {string} entityType - Entity type
 * @param {string} locale - Optional locale filter
 * @returns {AttributeValue[]} Entity values
 *
 * @example
 * ```typescript
 * const productValues = getEntityValues(allValues, 'product-123', 'PRODUCT', 'en-US');
 * ```
 */
export declare function getEntityValues(values: AttributeValue[], entityId: string, entityType: string, locale?: string): AttributeValue[];
/**
 * 19. Creates a lookup option for an attribute.
 *
 * @param {Partial<AttributeLookupOption>} option - Lookup option data
 * @returns {AttributeLookupOption} Created option
 *
 * @example
 * ```typescript
 * const option = createLookupOption({
 *   attributeId: 'attr-1',
 *   value: 'blue',
 *   label: 'Blue',
 *   displayOrder: 1
 * });
 * ```
 */
export declare function createLookupOption(option: Partial<AttributeLookupOption>): AttributeLookupOption;
/**
 * 20. Gets all lookup options for an attribute.
 *
 * @param {AttributeLookupOption[]} options - All options
 * @param {string} attributeId - Attribute ID
 * @param {boolean} activeOnly - Filter active only
 * @returns {AttributeLookupOption[]} Attribute options
 *
 * @example
 * ```typescript
 * const colorOptions = getAttributeLookupOptions(allOptions, 'attr-color', true);
 * ```
 */
export declare function getAttributeLookupOptions(options: AttributeLookupOption[], attributeId: string, activeOnly?: boolean): AttributeLookupOption[];
/**
 * 21. Validates a value against lookup options.
 *
 * @param {any} value - Value to validate
 * @param {AttributeLookupOption[]} options - Valid options
 * @returns {boolean} Is valid
 *
 * @example
 * ```typescript
 * const isValid = validateLookupValue('blue', colorOptions);
 * ```
 */
export declare function validateLookupValue(value: any, options: AttributeLookupOption[]): boolean;
/**
 * 22. Creates hierarchical lookup options.
 *
 * @param {AttributeLookupOption[]} options - Flat options list
 * @returns {any[]} Hierarchical structure
 *
 * @example
 * ```typescript
 * const tree = buildLookupHierarchy(flatOptions);
 * ```
 */
export declare function buildLookupHierarchy(options: AttributeLookupOption[]): Array<AttributeLookupOption & {
    children?: AttributeLookupOption[];
}>;
/**
 * 23. Bulk updates attribute values for an entity.
 *
 * @param {string} entityId - Entity ID
 * @param {string} entityType - Entity type
 * @param {Record<string, any>} values - Attribute values map
 * @param {string} source - Value source
 * @returns {AttributeValue[]} Created values
 *
 * @example
 * ```typescript
 * const values = bulkSetAttributeValues('product-123', 'PRODUCT', {
 *   'attr-color': 'Blue',
 *   'attr-size': 'Large',
 *   'attr-weight': 2.5
 * }, 'import');
 * ```
 */
export declare function bulkSetAttributeValues(entityId: string, entityType: string, values: Record<string, any>, source?: string): AttributeValue[];
/**
 * 24. Validates a value against an attribute definition.
 *
 * @param {any} value - Value to validate
 * @param {AttributeDefinition} attribute - Attribute definition
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateAttributeValue('abc', attribute);
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export declare function validateAttributeValue(value: any, attribute: AttributeDefinition): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 25. Executes a single validation rule.
 *
 * @param {any} value - Value to validate
 * @param {ValidationRule} rule - Validation rule
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = executeValidationRule('abc', minLengthRule);
 * ```
 */
export declare function executeValidationRule(value: any, rule: ValidationRule): {
    isValid: boolean;
    message?: string;
};
/**
 * 26. Validates all attribute values for an entity.
 *
 * @param {AttributeValue[]} values - Entity attribute values
 * @param {AttributeDefinition[]} attributes - Attribute definitions
 * @returns {object} Validation summary
 *
 * @example
 * ```typescript
 * const result = validateEntityAttributes(productValues, attributeDefinitions);
 * ```
 */
export declare function validateEntityAttributes(values: AttributeValue[], attributes: AttributeDefinition[]): {
    isValid: boolean;
    totalAttributes: number;
    validatedAttributes: number;
    errors: Array<{
        attributeId: string;
        errors: string[];
    }>;
    warnings: Array<{
        attributeId: string;
        warnings: string[];
    }>;
};
/**
 * 27. Generates a data quality report for an entity.
 *
 * @param {string} entityId - Entity ID
 * @param {string} entityType - Entity type
 * @param {AttributeValue[]} values - Entity values
 * @param {AttributeDefinition[]} requiredAttributes - Required attributes
 * @returns {DataQualityReport} Quality report
 *
 * @example
 * ```typescript
 * const report = generateDataQualityReport('product-123', 'PRODUCT', values, requiredAttrs);
 * ```
 */
export declare function generateDataQualityReport(entityId: string, entityType: string, values: AttributeValue[], requiredAttributes: AttributeDefinition[]): DataQualityReport;
/**
 * 28. Identifies duplicate attribute values.
 *
 * @param {AttributeValue[]} values - All values
 * @param {string} attributeId - Attribute ID
 * @returns {string[][]} Groups of duplicate entity IDs
 *
 * @example
 * ```typescript
 * const duplicates = findDuplicateValues(allValues, 'attr-sku');
 * ```
 */
export declare function findDuplicateValues(values: AttributeValue[], attributeId: string): string[][];
/**
 * 29. Suggests corrections for invalid values.
 *
 * @param {any} value - Invalid value
 * @param {AttributeDefinition} attribute - Attribute definition
 * @param {AttributeLookupOption[]} options - Available options
 * @returns {any[]} Suggested corrections
 *
 * @example
 * ```typescript
 * const suggestions = suggestValueCorrections('blu', colorAttribute, colorOptions);
 * // Returns: ['blue', 'black']
 * ```
 */
export declare function suggestValueCorrections(value: any, attribute: AttributeDefinition, options?: AttributeLookupOption[]): any[];
/**
 * 30. Calculates attribute completeness percentage.
 *
 * @param {AttributeValue[]} values - Entity values
 * @param {AttributeDefinition[]} attributes - All attributes
 * @returns {number} Completeness percentage (0-100)
 *
 * @example
 * ```typescript
 * const completeness = calculateAttributeCompleteness(productValues, allAttributes);
 * ```
 */
export declare function calculateAttributeCompleteness(values: AttributeValue[], attributes: AttributeDefinition[]): number;
/**
 * 31. Validates attribute value against data type.
 *
 * @param {any} value - Value to validate
 * @param {AttributeDataType} dataType - Expected data type
 * @returns {boolean} Is valid type
 *
 * @example
 * ```typescript
 * const isValid = validateDataType('123', AttributeDataType.NUMBER);
 * ```
 */
export declare function validateDataType(value: any, dataType: AttributeDataType): boolean;
/**
 * 32. Creates an inheritance rule.
 *
 * @param {Partial<InheritanceRule>} rule - Rule data
 * @returns {InheritanceRule} Created rule
 *
 * @example
 * ```typescript
 * const rule = createInheritanceRule({
 *   attributeId: 'attr-brand',
 *   sourceEntityType: 'CATEGORY',
 *   targetEntityType: 'PRODUCT',
 *   strategy: InheritanceStrategy.OVERRIDE,
 *   priority: 1
 * });
 * ```
 */
export declare function createInheritanceRule(rule: Partial<InheritanceRule>): InheritanceRule;
/**
 * 33. Propagates attribute values from parent to child entities.
 *
 * @param {AttributeValue[]} parentValues - Parent entity values
 * @param {string} childEntityId - Child entity ID
 * @param {string} childEntityType - Child entity type
 * @param {InheritanceRule[]} rules - Inheritance rules
 * @returns {AttributeValue[]} Propagated values
 *
 * @example
 * ```typescript
 * const childValues = propagateAttributes(categoryValues, 'product-123', 'PRODUCT', rules);
 * ```
 */
export declare function propagateAttributes(parentValues: AttributeValue[], childEntityId: string, childEntityType: string, rules: InheritanceRule[]): AttributeValue[];
/**
 * 34. Merges inherited values with local values.
 *
 * @param {AttributeValue[]} inheritedValues - Inherited values
 * @param {AttributeValue[]} localValues - Local values
 * @param {InheritanceStrategy} strategy - Merge strategy
 * @returns {AttributeValue[]} Merged values
 *
 * @example
 * ```typescript
 * const merged = mergeInheritedValues(inherited, local, InheritanceStrategy.MERGE);
 * ```
 */
export declare function mergeInheritedValues(inheritedValues: AttributeValue[], localValues: AttributeValue[], strategy: InheritanceStrategy): AttributeValue[];
/**
 * 35. Cascades attribute value updates to child entities.
 *
 * @param {string} parentEntityId - Parent entity ID
 * @param {string} attributeId - Attribute to cascade
 * @param {any} newValue - New value
 * @param {string[]} childEntityIds - Child entity IDs
 * @returns {AttributeValue[]} Updated child values
 *
 * @example
 * ```typescript
 * const updated = cascadeAttributeUpdate('category-1', 'attr-brand', 'Nike', ['prod-1', 'prod-2']);
 * ```
 */
export declare function cascadeAttributeUpdate(parentEntityId: string, attributeId: string, newValue: any, childEntityIds: string[]): AttributeValue[];
/**
 * 36. Resolves attribute value with inheritance chain.
 *
 * @param {string} entityId - Entity ID
 * @param {string} attributeId - Attribute ID
 * @param {AttributeValue[]} allValues - All attribute values
 * @param {string[]} parentChain - Parent entity IDs (ordered)
 * @returns {any} Resolved value
 *
 * @example
 * ```typescript
 * const value = resolveAttributeWithInheritance('product-123', 'attr-brand', allValues, ['cat-1', 'cat-2']);
 * ```
 */
export declare function resolveAttributeWithInheritance(entityId: string, attributeId: string, allValues: AttributeValue[], parentChain: string[]): any;
/**
 * 37. Identifies orphaned attribute values.
 *
 * @param {AttributeValue[]} values - All values
 * @param {AttributeDefinition[]} attributes - Valid attributes
 * @returns {AttributeValue[]} Orphaned values
 *
 * @example
 * ```typescript
 * const orphaned = findOrphanedValues(allValues, currentAttributes);
 * ```
 */
export declare function findOrphanedValues(values: AttributeValue[], attributes: AttributeDefinition[]): AttributeValue[];
/**
 * 38. Creates attribute version for change tracking.
 *
 * @param {AttributeDefinition} oldAttribute - Previous attribute state
 * @param {AttributeDefinition} newAttribute - New attribute state
 * @param {string} userId - User making change
 * @param {string} reason - Change reason
 * @returns {AttributeVersion} Version record
 *
 * @example
 * ```typescript
 * const version = createAttributeVersion(oldAttr, newAttr, 'user-123', 'Updated validation rules');
 * ```
 */
export declare function createAttributeVersion(oldAttribute: AttributeDefinition, newAttribute: AttributeDefinition, userId: string, reason?: string): AttributeVersion;
/**
 * Sequelize Model: Attribute Definition
 *
 * ```typescript
 * import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
 *
 * @Table({ tableName: 'attribute_definitions', timestamps: true })
 * export class AttributeDefinitionModel extends Model {
 *   @Column({ type: DataType.UUID, primaryKey: true })
 *   attributeId: string;
 *
 *   @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
 *   code: string;
 *
 *   @Column({ type: DataType.STRING(255), allowNull: false })
 *   name: string;
 *
 *   @Column({ type: DataType.TEXT })
 *   description: string;
 *
 *   @Column({ type: DataType.ENUM(...Object.values(AttributeDataType)), allowNull: false })
 *   dataType: AttributeDataType;
 *
 *   @Column({ type: DataType.ENUM(...Object.values(AttributeScope)), allowNull: false })
 *   scope: AttributeScope;
 *
 *   @Column({ type: DataType.ENUM(...Object.values(AttributeStatus)), allowNull: false })
 *   status: AttributeStatus;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: false })
 *   isRequired: boolean;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: true })
 *   isSearchable: boolean;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: true })
 *   isFilterable: boolean;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: false })
 *   isSortable: boolean;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: false })
 *   isLocalizable: boolean;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: false })
 *   isSystem: boolean;
 *
 *   @Column({ type: DataType.JSONB })
 *   defaultValue: any;
 *
 *   @Column({ type: DataType.STRING(50) })
 *   unit: string;
 *
 *   @Column({ type: DataType.INTEGER })
 *   precision: number;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: [] })
 *   validationRules: ValidationRule[];
 *
 *   @Column({ type: DataType.UUID })
 *   groupId: string;
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 0 })
 *   displayOrder: number;
 *
 *   @Column({ type: DataType.JSONB })
 *   metadata: Record<string, any>;
 *
 *   @Column({ type: DataType.STRING(100) })
 *   createdBy: string;
 *
 *   @Column({ type: DataType.STRING(100) })
 *   updatedBy: string;
 *
 *   @HasMany(() => AttributeValueModel)
 *   values: AttributeValueModel[];
 * }
 * ```
 */
/**
 * Sequelize Model: Attribute Value
 *
 * ```typescript
 * @Table({ tableName: 'attribute_values', timestamps: true })
 * export class AttributeValueModel extends Model {
 *   @Column({ type: DataType.UUID, primaryKey: true })
 *   valueId: string;
 *
 *   @Column({ type: DataType.UUID, allowNull: false })
 *   attributeId: string;
 *
 *   @Column({ type: DataType.STRING(100), allowNull: false })
 *   entityId: string;
 *
 *   @Column({ type: DataType.STRING(50), allowNull: false })
 *   entityType: string;
 *
 *   @Column({ type: DataType.JSONB, allowNull: false })
 *   value: any;
 *
 *   @Column({ type: DataType.STRING(10) })
 *   locale: string;
 *
 *   @Column({ type: DataType.DATE })
 *   validFrom: Date;
 *
 *   @Column({ type: DataType.DATE })
 *   validTo: Date;
 *
 *   @Column({ type: DataType.DECIMAL(3, 2), defaultValue: 1.0 })
 *   confidence: number;
 *
 *   @Column({ type: DataType.STRING(100) })
 *   source: string;
 *
 *   @Column({ type: DataType.JSONB })
 *   metadata: Record<string, any>;
 *
 *   // Composite index for fast lookups
 *   // CREATE INDEX idx_attr_values_entity ON attribute_values(entity_id, entity_type, attribute_id);
 * }
 * ```
 */
/**
 * NestJS Service: Attribute Master Data Service
 *
 * ```typescript
 * import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
 * import { InjectModel } from '@nestjs/sequelize';
 * import { AttributeDefinitionModel, AttributeValueModel } from './models';
 * import * as AttributeKit from './attribute-master-data-kit';
 *
 * @Injectable()
 * export class AttributeMasterDataService {
 *   constructor(
 *     @InjectModel(AttributeDefinitionModel)
 *     private attributeDefModel: typeof AttributeDefinitionModel,
 *     @InjectModel(AttributeValueModel)
 *     private attributeValueModel: typeof AttributeValueModel,
 *   ) {}
 *
 *   async createAttribute(dto: CreateAttributeDto): Promise<AttributeDefinitionModel> {
 *     const attribute = AttributeKit.createAttributeDefinition(dto);
 *     return this.attributeDefModel.create(attribute);
 *   }
 *
 *   async updateAttribute(id: string, dto: UpdateAttributeDto, userId: string): Promise<AttributeDefinitionModel> {
 *     const existing = await this.attributeDefModel.findByPk(id);
 *     if (!existing) throw new NotFoundException('Attribute not found');
 *
 *     const updated = AttributeKit.updateAttributeDefinition(existing.toJSON(), dto, userId);
 *     await existing.update(updated);
 *     return existing;
 *   }
 *
 *   async validateAttributeValue(attributeId: string, value: any): Promise<ValidationResult> {
 *     const attribute = await this.attributeDefModel.findByPk(attributeId);
 *     if (!attribute) throw new NotFoundException('Attribute not found');
 *
 *     return AttributeKit.validateAttributeValue(value, attribute.toJSON());
 *   }
 *
 *   async setEntityAttributeValue(
 *     entityId: string,
 *     entityType: string,
 *     attributeId: string,
 *     value: any,
 *   ): Promise<AttributeValueModel> {
 *     const attribute = await this.attributeDefModel.findByPk(attributeId);
 *     if (!attribute) throw new NotFoundException('Attribute not found');
 *
 *     const validation = AttributeKit.validateAttributeValue(value, attribute.toJSON());
 *     if (!validation.isValid) {
 *       throw new BadRequestException({ errors: validation.errors });
 *     }
 *
 *     const attrValue = AttributeKit.createAttributeValue({
 *       attributeId,
 *       entityId,
 *       entityType,
 *       value,
 *     });
 *
 *     return this.attributeValueModel.create(attrValue);
 *   }
 *
 *   async generateQualityReport(entityId: string, entityType: string): Promise<DataQualityReport> {
 *     const values = await this.attributeValueModel.findAll({
 *       where: { entityId, entityType },
 *     });
 *
 *     const attributes = await this.attributeDefModel.findAll({
 *       where: { scope: entityType, isRequired: true },
 *     });
 *
 *     return AttributeKit.generateDataQualityReport(
 *       entityId,
 *       entityType,
 *       values.map(v => v.toJSON()),
 *       attributes.map(a => a.toJSON()),
 *     );
 *   }
 * }
 * ```
 */
/**
 * Swagger API Documentation Examples
 *
 * ```typescript
 * import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
 *
 * @ApiTags('Attribute Master Data')
 * @Controller('api/attributes')
 * export class AttributeController {
 *
 *   @Post()
 *   @ApiOperation({ summary: 'Create new attribute definition' })
 *   @ApiResponse({ status: 201, description: 'Attribute created successfully' })
 *   @ApiResponse({ status: 400, description: 'Invalid attribute definition' })
 *   async createAttribute(@Body() dto: CreateAttributeDto) {
 *     return this.attributeService.createAttribute(dto);
 *   }
 *
 *   @Put(':id/activate')
 *   @ApiOperation({ summary: 'Activate attribute definition' })
 *   @ApiResponse({ status: 200, description: 'Attribute activated' })
 *   async activateAttribute(@Param('id') id: string, @CurrentUser() user: User) {
 *     return this.attributeService.activateAttribute(id, user.id);
 *   }
 *
 *   @Post(':id/validate')
 *   @ApiOperation({ summary: 'Validate attribute value' })
 *   @ApiResponse({ status: 200, description: 'Validation result' })
 *   async validateValue(@Param('id') id: string, @Body() dto: { value: any }) {
 *     return this.attributeService.validateAttributeValue(id, dto.value);
 *   }
 *
 *   @Get('quality-report/:entityId')
 *   @ApiOperation({ summary: 'Generate data quality report' })
 *   @ApiResponse({ status: 200, description: 'Quality report generated' })
 *   async getQualityReport(
 *     @Param('entityId') entityId: string,
 *     @Query('entityType') entityType: string,
 *   ) {
 *     return this.attributeService.generateQualityReport(entityId, entityType);
 *   }
 * }
 * ```
 */
declare const _default: {
    createAttributeDefinition: typeof createAttributeDefinition;
    updateAttributeDefinition: typeof updateAttributeDefinition;
    addValidationRule: typeof addValidationRule;
    removeValidationRule: typeof removeValidationRule;
    activateAttribute: typeof activateAttribute;
    deprecateAttribute: typeof deprecateAttribute;
    cloneAttributeDefinition: typeof cloneAttributeDefinition;
    searchAttributes: typeof searchAttributes;
    createAttributeGroup: typeof createAttributeGroup;
    assignAttributeToGroup: typeof assignAttributeToGroup;
    createAttributeSet: typeof createAttributeSet;
    addAttributeToSet: typeof addAttributeToSet;
    removeAttributeFromSet: typeof removeAttributeFromSet;
    getCategoryAttributes: typeof getCategoryAttributes;
    reorderAttributes: typeof reorderAttributes;
    createAttributeValue: typeof createAttributeValue;
    updateAttributeValue: typeof updateAttributeValue;
    getEntityValues: typeof getEntityValues;
    createLookupOption: typeof createLookupOption;
    getAttributeLookupOptions: typeof getAttributeLookupOptions;
    validateLookupValue: typeof validateLookupValue;
    buildLookupHierarchy: typeof buildLookupHierarchy;
    bulkSetAttributeValues: typeof bulkSetAttributeValues;
    validateAttributeValue: typeof validateAttributeValue;
    executeValidationRule: typeof executeValidationRule;
    validateEntityAttributes: typeof validateEntityAttributes;
    generateDataQualityReport: typeof generateDataQualityReport;
    findDuplicateValues: typeof findDuplicateValues;
    suggestValueCorrections: typeof suggestValueCorrections;
    calculateAttributeCompleteness: typeof calculateAttributeCompleteness;
    validateDataType: typeof validateDataType;
    createInheritanceRule: typeof createInheritanceRule;
    propagateAttributes: typeof propagateAttributes;
    mergeInheritedValues: typeof mergeInheritedValues;
    cascadeAttributeUpdate: typeof cascadeAttributeUpdate;
    resolveAttributeWithInheritance: typeof resolveAttributeWithInheritance;
    findOrphanedValues: typeof findOrphanedValues;
    createAttributeVersion: typeof createAttributeVersion;
};
export default _default;
//# sourceMappingURL=attribute-master-data-kit.d.ts.map