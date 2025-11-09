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
 * File: /reuse/logistics/attribute-master-data-kit.ts
 * Locator: WC-LOGISTICS-ATTR-MDM-001
 * Purpose: Comprehensive Product Attribute Master Data Management - Complete attribute lifecycle for enterprise MDM
 *
 * Upstream: Independent utility module for attribute master data operations
 * Downstream: ../backend/logistics/*, Product modules, Catalog services, MDM services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 38 utility functions for attribute definitions, groups, values, validation, inheritance
 *
 * LLM Context: Enterprise-grade product attribute master data utilities to compete with Oracle JD Edwards.
 * Provides comprehensive attribute definition management, attribute groups and categories, value lookups,
 * data quality rules, validation, inheritance and propagation, multi-language support, versioning,
 * and complete audit trails for enterprise master data management.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Attribute data types
 */
export enum AttributeDataType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DECIMAL = 'DECIMAL',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  ENUM = 'ENUM',
  MULTISELECT = 'MULTISELECT',
  JSON = 'JSON',
  URL = 'URL',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  CURRENCY = 'CURRENCY',
  PERCENTAGE = 'PERCENTAGE',
  MEASUREMENT = 'MEASUREMENT',
}

/**
 * Attribute scope - where attribute is applicable
 */
export enum AttributeScope {
  GLOBAL = 'GLOBAL',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
  VARIANT = 'VARIANT',
  SKU = 'SKU',
}

/**
 * Attribute status
 */
export enum AttributeStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Validation rule types
 */
export enum ValidationRuleType {
  REQUIRED = 'REQUIRED',
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_LENGTH = 'MAX_LENGTH',
  MIN_VALUE = 'MIN_VALUE',
  MAX_VALUE = 'MAX_VALUE',
  REGEX = 'REGEX',
  UNIQUE = 'UNIQUE',
  ENUM = 'ENUM',
  CUSTOM = 'CUSTOM',
}

/**
 * Inheritance strategy
 */
export enum InheritanceStrategy {
  NONE = 'NONE',
  OVERRIDE = 'OVERRIDE',
  MERGE = 'MERGE',
  APPEND = 'APPEND',
  CASCADE = 'CASCADE',
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

// ============================================================================
// SECTION 1: ATTRIBUTE DEFINITION (Functions 1-8)
// ============================================================================

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
export function createAttributeDefinition(
  definition: Partial<AttributeDefinition>
): AttributeDefinition {
  const attributeId = generateAttributeId();

  return {
    attributeId,
    code: definition.code || '',
    name: definition.name || '',
    description: definition.description,
    dataType: definition.dataType || AttributeDataType.TEXT,
    scope: definition.scope || AttributeScope.PRODUCT,
    status: definition.status || AttributeStatus.DRAFT,
    isRequired: definition.isRequired ?? false,
    isSearchable: definition.isSearchable ?? true,
    isFilterable: definition.isFilterable ?? true,
    isSortable: definition.isSortable ?? false,
    isLocalizable: definition.isLocalizable ?? false,
    isSystem: definition.isSystem ?? false,
    defaultValue: definition.defaultValue,
    unit: definition.unit,
    precision: definition.precision,
    validationRules: definition.validationRules || [],
    groupId: definition.groupId,
    displayOrder: definition.displayOrder ?? 0,
    metadata: definition.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: definition.createdBy || 'system',
    updatedBy: definition.updatedBy || 'system',
  };
}

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
export function updateAttributeDefinition(
  attribute: AttributeDefinition,
  updates: Partial<AttributeDefinition>,
  userId: string
): AttributeDefinition {
  return {
    ...attribute,
    ...updates,
    attributeId: attribute.attributeId, // Preserve ID
    updatedAt: new Date(),
    updatedBy: userId,
  };
}

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
export function addValidationRule(
  attribute: AttributeDefinition,
  rule: ValidationRule
): AttributeDefinition {
  return {
    ...attribute,
    validationRules: [...attribute.validationRules, rule],
    updatedAt: new Date(),
  };
}

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
export function removeValidationRule(
  attribute: AttributeDefinition,
  ruleId: string
): AttributeDefinition {
  return {
    ...attribute,
    validationRules: attribute.validationRules.filter(rule => rule.ruleId !== ruleId),
    updatedAt: new Date(),
  };
}

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
export function activateAttribute(
  attribute: AttributeDefinition,
  userId: string
): AttributeDefinition {
  return {
    ...attribute,
    status: AttributeStatus.ACTIVE,
    updatedAt: new Date(),
    updatedBy: userId,
  };
}

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
export function deprecateAttribute(
  attribute: AttributeDefinition,
  userId: string,
  reason?: string
): AttributeDefinition {
  return {
    ...attribute,
    status: AttributeStatus.DEPRECATED,
    updatedAt: new Date(),
    updatedBy: userId,
    metadata: {
      ...attribute.metadata,
      deprecationReason: reason,
      deprecatedAt: new Date(),
    },
  };
}

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
export function cloneAttributeDefinition(
  attribute: AttributeDefinition,
  newCode: string,
  userId: string
): AttributeDefinition {
  return {
    ...attribute,
    attributeId: generateAttributeId(),
    code: newCode,
    status: AttributeStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
    updatedBy: userId,
    metadata: {
      ...attribute.metadata,
      clonedFrom: attribute.attributeId,
    },
  };
}

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
export function searchAttributes(
  attributes: AttributeDefinition[],
  criteria: AttributeSearchCriteria
): AttributeDefinition[] {
  return attributes.filter(attr => {
    if (criteria.code && !attr.code.toLowerCase().includes(criteria.code.toLowerCase())) {
      return false;
    }
    if (criteria.name && !attr.name.toLowerCase().includes(criteria.name.toLowerCase())) {
      return false;
    }
    if (criteria.dataType && !criteria.dataType.includes(attr.dataType)) {
      return false;
    }
    if (criteria.scope && !criteria.scope.includes(attr.scope)) {
      return false;
    }
    if (criteria.status && !criteria.status.includes(attr.status)) {
      return false;
    }
    if (criteria.groupId && attr.groupId !== criteria.groupId) {
      return false;
    }
    if (criteria.isRequired !== undefined && attr.isRequired !== criteria.isRequired) {
      return false;
    }
    if (criteria.isSearchable !== undefined && attr.isSearchable !== criteria.isSearchable) {
      return false;
    }
    if (criteria.isFilterable !== undefined && attr.isFilterable !== criteria.isFilterable) {
      return false;
    }

    return true;
  });
}

// ============================================================================
// SECTION 2: ATTRIBUTE GROUPS & CATEGORIES (Functions 9-15)
// ============================================================================

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
export function createAttributeGroup(group: Partial<AttributeGroup>): AttributeGroup {
  return {
    groupId: generateGroupId(),
    code: group.code || '',
    name: group.name || '',
    description: group.description,
    parentGroupId: group.parentGroupId,
    categoryIds: group.categoryIds || [],
    displayOrder: group.displayOrder ?? 0,
    isCollapsible: group.isCollapsible ?? true,
    isExpanded: group.isExpanded ?? true,
    metadata: group.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

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
export function assignAttributeToGroup(
  attribute: AttributeDefinition,
  groupId: string
): AttributeDefinition {
  return {
    ...attribute,
    groupId,
    updatedAt: new Date(),
  };
}

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
export function createAttributeSet(set: Partial<AttributeSet>): AttributeSet {
  return {
    setId: generateSetId(),
    code: set.code || '',
    name: set.name || '',
    description: set.description,
    attributeIds: set.attributeIds || [],
    categoryIds: set.categoryIds || [],
    isDefault: set.isDefault ?? false,
    metadata: set.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

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
export function addAttributeToSet(set: AttributeSet, attributeId: string): AttributeSet {
  if (set.attributeIds.includes(attributeId)) {
    return set;
  }

  return {
    ...set,
    attributeIds: [...set.attributeIds, attributeId],
    updatedAt: new Date(),
  };
}

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
export function removeAttributeFromSet(set: AttributeSet, attributeId: string): AttributeSet {
  return {
    ...set,
    attributeIds: set.attributeIds.filter(id => id !== attributeId),
    updatedAt: new Date(),
  };
}

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
export function getCategoryAttributes(
  sets: AttributeSet[],
  attributes: AttributeDefinition[],
  categoryId: string
): AttributeDefinition[] {
  const categorySets = sets.filter(set => set.categoryIds.includes(categoryId));
  const attributeIds = new Set<string>();

  for (const set of categorySets) {
    for (const attrId of set.attributeIds) {
      attributeIds.add(attrId);
    }
  }

  return attributes.filter(attr => attributeIds.has(attr.attributeId));
}

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
export function reorderAttributes(
  attributes: AttributeDefinition[],
  orderedIds: string[]
): AttributeDefinition[] {
  return attributes.map(attr => {
    const newOrder = orderedIds.indexOf(attr.attributeId);
    if (newOrder === -1) return attr;

    return {
      ...attr,
      displayOrder: newOrder,
      updatedAt: new Date(),
    };
  });
}

// ============================================================================
// SECTION 3: VALUE MANAGEMENT & LOOKUPS (Functions 16-23)
// ============================================================================

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
export function createAttributeValue(value: Partial<AttributeValue>): AttributeValue {
  return {
    valueId: generateValueId(),
    attributeId: value.attributeId || '',
    entityId: value.entityId || '',
    entityType: value.entityType || '',
    value: value.value,
    locale: value.locale,
    validFrom: value.validFrom,
    validTo: value.validTo,
    confidence: value.confidence ?? 1.0,
    source: value.source || 'manual',
    metadata: value.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

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
export function updateAttributeValue(
  value: AttributeValue,
  newValue: any,
  source?: string
): AttributeValue {
  return {
    ...value,
    value: newValue,
    source: source || value.source,
    updatedAt: new Date(),
  };
}

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
export function getEntityValues(
  values: AttributeValue[],
  entityId: string,
  entityType: string,
  locale?: string
): AttributeValue[] {
  return values.filter(
    val =>
      val.entityId === entityId &&
      val.entityType === entityType &&
      (!locale || val.locale === locale || !val.locale)
  );
}

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
export function createLookupOption(
  option: Partial<AttributeLookupOption>
): AttributeLookupOption {
  return {
    optionId: generateOptionId(),
    attributeId: option.attributeId || '',
    value: option.value || '',
    label: option.label || '',
    displayOrder: option.displayOrder ?? 0,
    isActive: option.isActive ?? true,
    parentOptionId: option.parentOptionId,
    metadata: option.metadata,
  };
}

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
export function getAttributeLookupOptions(
  options: AttributeLookupOption[],
  attributeId: string,
  activeOnly: boolean = true
): AttributeLookupOption[] {
  return options
    .filter(opt => opt.attributeId === attributeId && (!activeOnly || opt.isActive))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

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
export function validateLookupValue(value: any, options: AttributeLookupOption[]): boolean {
  const validValues = options.filter(opt => opt.isActive).map(opt => opt.value);
  return validValues.includes(value);
}

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
export function buildLookupHierarchy(
  options: AttributeLookupOption[]
): Array<AttributeLookupOption & { children?: AttributeLookupOption[] }> {
  const optionMap = new Map<string, any>();
  const roots: any[] = [];

  // Create map of all options
  for (const option of options) {
    optionMap.set(option.optionId, { ...option, children: [] });
  }

  // Build hierarchy
  for (const option of options) {
    const node = optionMap.get(option.optionId);
    if (option.parentOptionId) {
      const parent = optionMap.get(option.parentOptionId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}

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
export function bulkSetAttributeValues(
  entityId: string,
  entityType: string,
  values: Record<string, any>,
  source?: string
): AttributeValue[] {
  const attributeValues: AttributeValue[] = [];

  for (const [attributeId, value] of Object.entries(values)) {
    attributeValues.push(
      createAttributeValue({
        attributeId,
        entityId,
        entityType,
        value,
        source: source || 'bulk-import',
      })
    );
  }

  return attributeValues;
}

// ============================================================================
// SECTION 4: VALIDATION & QUALITY RULES (Functions 24-31)
// ============================================================================

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
export function validateAttributeValue(
  value: any,
  attribute: AttributeDefinition
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required validation
  if (attribute.isRequired && (value === null || value === undefined || value === '')) {
    errors.push(`${attribute.name} is required`);
    return { isValid: false, errors, warnings };
  }

  // Skip other validations if value is empty and not required
  if (value === null || value === undefined || value === '') {
    return { isValid: true, errors, warnings };
  }

  // Run all validation rules
  for (const rule of attribute.validationRules) {
    const ruleResult = executeValidationRule(value, rule);
    if (!ruleResult.isValid) {
      if (rule.severity === 'ERROR') {
        errors.push(rule.message);
      } else if (rule.severity === 'WARNING') {
        warnings.push(rule.message);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

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
export function executeValidationRule(
  value: any,
  rule: ValidationRule
): {
  isValid: boolean;
  message?: string;
} {
  switch (rule.type) {
    case ValidationRuleType.MIN_LENGTH:
      if (typeof value === 'string' && value.length < rule.value) {
        return { isValid: false, message: rule.message };
      }
      break;

    case ValidationRuleType.MAX_LENGTH:
      if (typeof value === 'string' && value.length > rule.value) {
        return { isValid: false, message: rule.message };
      }
      break;

    case ValidationRuleType.MIN_VALUE:
      if (typeof value === 'number' && value < rule.value) {
        return { isValid: false, message: rule.message };
      }
      break;

    case ValidationRuleType.MAX_VALUE:
      if (typeof value === 'number' && value > rule.value) {
        return { isValid: false, message: rule.message };
      }
      break;

    case ValidationRuleType.REGEX:
      if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
        return { isValid: false, message: rule.message };
      }
      break;

    case ValidationRuleType.ENUM:
      if (!Array.isArray(rule.value) || !rule.value.includes(value)) {
        return { isValid: false, message: rule.message };
      }
      break;

    case ValidationRuleType.CUSTOM:
      if (rule.customValidator && !rule.customValidator(value)) {
        return { isValid: false, message: rule.message };
      }
      break;
  }

  return { isValid: true };
}

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
export function validateEntityAttributes(
  values: AttributeValue[],
  attributes: AttributeDefinition[]
): {
  isValid: boolean;
  totalAttributes: number;
  validatedAttributes: number;
  errors: Array<{ attributeId: string; errors: string[] }>;
  warnings: Array<{ attributeId: string; warnings: string[] }>;
} {
  const errors: Array<{ attributeId: string; errors: string[] }> = [];
  const warnings: Array<{ attributeId: string; warnings: string[] }> = [];
  const valueMap = new Map<string, any>();

  // Build value map
  for (const value of values) {
    valueMap.set(value.attributeId, value.value);
  }

  // Validate each attribute
  for (const attribute of attributes) {
    const value = valueMap.get(attribute.attributeId);
    const result = validateAttributeValue(value, attribute);

    if (result.errors.length > 0) {
      errors.push({ attributeId: attribute.attributeId, errors: result.errors });
    }

    if (result.warnings.length > 0) {
      warnings.push({ attributeId: attribute.attributeId, warnings: result.warnings });
    }
  }

  return {
    isValid: errors.length === 0,
    totalAttributes: attributes.length,
    validatedAttributes: values.length,
    errors,
    warnings,
  };
}

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
export function generateDataQualityReport(
  entityId: string,
  entityType: string,
  values: AttributeValue[],
  requiredAttributes: AttributeDefinition[]
): DataQualityReport {
  const issues: QualityIssue[] = [];
  const valueMap = new Map<string, AttributeValue>();

  for (const value of values) {
    valueMap.set(value.attributeId, value);
  }

  // Check completeness
  let missingCount = 0;
  for (const attr of requiredAttributes) {
    const value = valueMap.get(attr.attributeId);
    if (!value || value.value === null || value.value === undefined || value.value === '') {
      missingCount++;
      issues.push({
        issueId: generateIssueId(),
        attributeId: attr.attributeId,
        type: 'MISSING',
        severity: attr.isRequired ? 'CRITICAL' : 'HIGH',
        message: `Missing value for ${attr.name}`,
        suggestion: `Please provide a value for ${attr.name}`,
      });
    }
  }

  const completeness = ((requiredAttributes.length - missingCount) / requiredAttributes.length) * 100;

  // Check validity
  let invalidCount = 0;
  for (const attr of requiredAttributes) {
    const value = valueMap.get(attr.attributeId);
    if (value) {
      const validationResult = validateAttributeValue(value.value, attr);
      if (!validationResult.isValid) {
        invalidCount++;
        issues.push({
          issueId: generateIssueId(),
          attributeId: attr.attributeId,
          type: 'INVALID',
          severity: 'HIGH',
          message: validationResult.errors.join(', '),
          suggestion: `Correct the value for ${attr.name}`,
        });
      }
    }
  }

  const validity = ((values.length - invalidCount) / Math.max(values.length, 1)) * 100;

  // Calculate scores
  const accuracy = 100; // Would need reference data to calculate
  const consistency = 100; // Would need cross-entity validation
  const overallScore = (completeness + validity + accuracy + consistency) / 4;

  return {
    reportId: generateReportId(),
    entityId,
    entityType,
    completeness,
    accuracy,
    consistency,
    validity,
    overallScore,
    issues,
    generatedAt: new Date(),
  };
}

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
export function findDuplicateValues(
  values: AttributeValue[],
  attributeId: string
): string[][] {
  const valueMap = new Map<string, string[]>();

  // Group entities by value
  for (const val of values) {
    if (val.attributeId === attributeId) {
      const key = JSON.stringify(val.value);
      if (!valueMap.has(key)) {
        valueMap.set(key, []);
      }
      valueMap.get(key)!.push(val.entityId);
    }
  }

  // Return groups with duplicates
  const duplicates: string[][] = [];
  for (const [, entityIds] of valueMap) {
    if (entityIds.length > 1) {
      duplicates.push(entityIds);
    }
  }

  return duplicates;
}

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
export function suggestValueCorrections(
  value: any,
  attribute: AttributeDefinition,
  options?: AttributeLookupOption[]
): any[] {
  const suggestions: any[] = [];

  if (attribute.dataType === AttributeDataType.ENUM && options) {
    // Find similar options using Levenshtein distance
    const valueStr = String(value).toLowerCase();
    const candidates = options
      .filter(opt => opt.isActive)
      .map(opt => ({
        value: opt.value,
        distance: levenshteinDistance(valueStr, opt.value.toLowerCase()),
      }))
      .filter(c => c.distance <= 3)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map(c => c.value);

    suggestions.push(...candidates);
  }

  return suggestions;
}

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
export function calculateAttributeCompleteness(
  values: AttributeValue[],
  attributes: AttributeDefinition[]
): number {
  if (attributes.length === 0) return 100;

  const valueMap = new Set(values.map(v => v.attributeId));
  const populatedCount = attributes.filter(attr => valueMap.has(attr.attributeId)).length;

  return (populatedCount / attributes.length) * 100;
}

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
export function validateDataType(value: any, dataType: AttributeDataType): boolean {
  switch (dataType) {
    case AttributeDataType.TEXT:
      return typeof value === 'string';
    case AttributeDataType.NUMBER:
      return typeof value === 'number' && Number.isInteger(value);
    case AttributeDataType.DECIMAL:
      return typeof value === 'number';
    case AttributeDataType.BOOLEAN:
      return typeof value === 'boolean';
    case AttributeDataType.DATE:
    case AttributeDataType.DATETIME:
      return value instanceof Date || !isNaN(Date.parse(value));
    case AttributeDataType.JSON:
      return typeof value === 'object';
    case AttributeDataType.URL:
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    case AttributeDataType.EMAIL:
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case AttributeDataType.PHONE:
      return /^\+?[\d\s\-()]+$/.test(value);
    default:
      return true;
  }
}

// ============================================================================
// SECTION 5: INHERITANCE & PROPAGATION (Functions 32-38)
// ============================================================================

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
export function createInheritanceRule(rule: Partial<InheritanceRule>): InheritanceRule {
  return {
    ruleId: generateRuleId(),
    attributeId: rule.attributeId || '',
    sourceEntityType: rule.sourceEntityType || '',
    targetEntityType: rule.targetEntityType || '',
    strategy: rule.strategy || InheritanceStrategy.OVERRIDE,
    condition: rule.condition,
    priority: rule.priority ?? 0,
    isActive: rule.isActive ?? true,
    metadata: rule.metadata,
  };
}

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
export function propagateAttributes(
  parentValues: AttributeValue[],
  childEntityId: string,
  childEntityType: string,
  rules: InheritanceRule[]
): AttributeValue[] {
  const propagatedValues: AttributeValue[] = [];

  for (const parentValue of parentValues) {
    const applicableRules = rules
      .filter(
        rule =>
          rule.isActive &&
          rule.attributeId === parentValue.attributeId &&
          rule.targetEntityType === childEntityType
      )
      .sort((a, b) => b.priority - a.priority);

    if (applicableRules.length > 0) {
      const rule = applicableRules[0];

      if (rule.strategy !== InheritanceStrategy.NONE) {
        propagatedValues.push(
          createAttributeValue({
            attributeId: parentValue.attributeId,
            entityId: childEntityId,
            entityType: childEntityType,
            value: parentValue.value,
            source: 'inherited',
            metadata: {
              inheritedFrom: parentValue.entityId,
              inheritanceStrategy: rule.strategy,
            },
          })
        );
      }
    }
  }

  return propagatedValues;
}

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
export function mergeInheritedValues(
  inheritedValues: AttributeValue[],
  localValues: AttributeValue[],
  strategy: InheritanceStrategy
): AttributeValue[] {
  const localMap = new Map<string, AttributeValue>();
  for (const value of localValues) {
    localMap.set(value.attributeId, value);
  }

  const mergedValues: AttributeValue[] = [];

  for (const inherited of inheritedValues) {
    const local = localMap.get(inherited.attributeId);

    if (!local) {
      // No local value, use inherited
      mergedValues.push(inherited);
    } else {
      // Local value exists, apply strategy
      switch (strategy) {
        case InheritanceStrategy.OVERRIDE:
          mergedValues.push(local); // Local overrides inherited
          break;

        case InheritanceStrategy.MERGE:
          // Merge logic (combine values if applicable)
          if (Array.isArray(inherited.value) && Array.isArray(local.value)) {
            mergedValues.push({
              ...local,
              value: [...new Set([...inherited.value, ...local.value])],
            });
          } else {
            mergedValues.push(local);
          }
          break;

        case InheritanceStrategy.APPEND:
          if (Array.isArray(local.value)) {
            mergedValues.push({
              ...local,
              value: [...local.value, inherited.value],
            });
          } else {
            mergedValues.push(local);
          }
          break;

        default:
          mergedValues.push(local);
      }

      localMap.delete(inherited.attributeId);
    }
  }

  // Add remaining local values
  for (const local of localMap.values()) {
    mergedValues.push(local);
  }

  return mergedValues;
}

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
export function cascadeAttributeUpdate(
  parentEntityId: string,
  attributeId: string,
  newValue: any,
  childEntityIds: string[]
): AttributeValue[] {
  const updatedValues: AttributeValue[] = [];

  for (const childId of childEntityIds) {
    updatedValues.push(
      createAttributeValue({
        attributeId,
        entityId: childId,
        entityType: 'CHILD', // Would be determined dynamically
        value: newValue,
        source: 'cascade',
        metadata: {
          cascadedFrom: parentEntityId,
          cascadedAt: new Date(),
        },
      })
    );
  }

  return updatedValues;
}

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
export function resolveAttributeWithInheritance(
  entityId: string,
  attributeId: string,
  allValues: AttributeValue[],
  parentChain: string[]
): any {
  // Check local value first
  const localValue = allValues.find(
    v => v.entityId === entityId && v.attributeId === attributeId
  );

  if (localValue && localValue.value !== null && localValue.value !== undefined) {
    return localValue.value;
  }

  // Walk up parent chain
  for (const parentId of parentChain) {
    const parentValue = allValues.find(
      v => v.entityId === parentId && v.attributeId === attributeId
    );

    if (parentValue && parentValue.value !== null && parentValue.value !== undefined) {
      return parentValue.value;
    }
  }

  return null;
}

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
export function findOrphanedValues(
  values: AttributeValue[],
  attributes: AttributeDefinition[]
): AttributeValue[] {
  const validAttributeIds = new Set(attributes.map(attr => attr.attributeId));

  return values.filter(val => !validAttributeIds.has(val.attributeId));
}

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
export function createAttributeVersion(
  oldAttribute: AttributeDefinition,
  newAttribute: AttributeDefinition,
  userId: string,
  reason?: string
): AttributeVersion {
  const changes: Record<string, any> = {};

  // Detect changes
  for (const key of Object.keys(newAttribute) as Array<keyof AttributeDefinition>) {
    if (JSON.stringify(oldAttribute[key]) !== JSON.stringify(newAttribute[key])) {
      changes[key] = {
        from: oldAttribute[key],
        to: newAttribute[key],
      };
    }
  }

  return {
    versionId: generateVersionId(),
    attributeId: newAttribute.attributeId,
    version: (oldAttribute.metadata?.version || 0) + 1,
    changes,
    changedBy: userId,
    changeReason: reason,
    createdAt: new Date(),
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Generates unique attribute ID.
 */
function generateAttributeId(): string {
  return `ATTR-${crypto.randomUUID()}`;
}

/**
 * Helper: Generates unique group ID.
 */
function generateGroupId(): string {
  return `GRP-${crypto.randomUUID()}`;
}

/**
 * Helper: Generates unique set ID.
 */
function generateSetId(): string {
  return `SET-${crypto.randomUUID()}`;
}

/**
 * Helper: Generates unique value ID.
 */
function generateValueId(): string {
  return `VAL-${crypto.randomUUID()}`;
}

/**
 * Helper: Generates unique option ID.
 */
function generateOptionId(): string {
  return `OPT-${crypto.randomUUID()}`;
}

/**
 * Helper: Generates unique rule ID.
 */
function generateRuleId(): string {
  return `RULE-${crypto.randomUUID()}`;
}

/**
 * Helper: Generates unique report ID.
 */
function generateReportId(): string {
  return `RPT-${crypto.randomUUID()}`;
}

/**
 * Helper: Generates unique issue ID.
 */
function generateIssueId(): string {
  return `ISSUE-${crypto.randomUUID()}`;
}

/**
 * Helper: Generates unique version ID.
 */
function generateVersionId(): string {
  return `VER-${crypto.randomUUID()}`;
}

/**
 * Helper: Calculates Levenshtein distance between strings.
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// ============================================================================
// DATABASE SCHEMA - SEQUELIZE MODELS
// ============================================================================

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

// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================

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

// ============================================================================
// SWAGGER DOCUMENTATION
// ============================================================================

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

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Attribute Definition
  createAttributeDefinition,
  updateAttributeDefinition,
  addValidationRule,
  removeValidationRule,
  activateAttribute,
  deprecateAttribute,
  cloneAttributeDefinition,
  searchAttributes,

  // Attribute Groups & Categories
  createAttributeGroup,
  assignAttributeToGroup,
  createAttributeSet,
  addAttributeToSet,
  removeAttributeFromSet,
  getCategoryAttributes,
  reorderAttributes,

  // Value Management & Lookups
  createAttributeValue,
  updateAttributeValue,
  getEntityValues,
  createLookupOption,
  getAttributeLookupOptions,
  validateLookupValue,
  buildLookupHierarchy,
  bulkSetAttributeValues,

  // Validation & Quality Rules
  validateAttributeValue,
  executeValidationRule,
  validateEntityAttributes,
  generateDataQualityReport,
  findDuplicateValues,
  suggestValueCorrections,
  calculateAttributeCompleteness,
  validateDataType,

  // Inheritance & Propagation
  createInheritanceRule,
  propagateAttributes,
  mergeInheritedValues,
  cascadeAttributeUpdate,
  resolveAttributeWithInheritance,
  findOrphanedValues,
  createAttributeVersion,
};
