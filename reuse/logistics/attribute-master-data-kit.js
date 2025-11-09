"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InheritanceStrategy = exports.ValidationRuleType = exports.AttributeStatus = exports.AttributeScope = exports.AttributeDataType = void 0;
exports.createAttributeDefinition = createAttributeDefinition;
exports.updateAttributeDefinition = updateAttributeDefinition;
exports.addValidationRule = addValidationRule;
exports.removeValidationRule = removeValidationRule;
exports.activateAttribute = activateAttribute;
exports.deprecateAttribute = deprecateAttribute;
exports.cloneAttributeDefinition = cloneAttributeDefinition;
exports.searchAttributes = searchAttributes;
exports.createAttributeGroup = createAttributeGroup;
exports.assignAttributeToGroup = assignAttributeToGroup;
exports.createAttributeSet = createAttributeSet;
exports.addAttributeToSet = addAttributeToSet;
exports.removeAttributeFromSet = removeAttributeFromSet;
exports.getCategoryAttributes = getCategoryAttributes;
exports.reorderAttributes = reorderAttributes;
exports.createAttributeValue = createAttributeValue;
exports.updateAttributeValue = updateAttributeValue;
exports.getEntityValues = getEntityValues;
exports.createLookupOption = createLookupOption;
exports.getAttributeLookupOptions = getAttributeLookupOptions;
exports.validateLookupValue = validateLookupValue;
exports.buildLookupHierarchy = buildLookupHierarchy;
exports.bulkSetAttributeValues = bulkSetAttributeValues;
exports.validateAttributeValue = validateAttributeValue;
exports.executeValidationRule = executeValidationRule;
exports.validateEntityAttributes = validateEntityAttributes;
exports.generateDataQualityReport = generateDataQualityReport;
exports.findDuplicateValues = findDuplicateValues;
exports.suggestValueCorrections = suggestValueCorrections;
exports.calculateAttributeCompleteness = calculateAttributeCompleteness;
exports.validateDataType = validateDataType;
exports.createInheritanceRule = createInheritanceRule;
exports.propagateAttributes = propagateAttributes;
exports.mergeInheritedValues = mergeInheritedValues;
exports.cascadeAttributeUpdate = cascadeAttributeUpdate;
exports.resolveAttributeWithInheritance = resolveAttributeWithInheritance;
exports.findOrphanedValues = findOrphanedValues;
exports.createAttributeVersion = createAttributeVersion;
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
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Attribute data types
 */
var AttributeDataType;
(function (AttributeDataType) {
    AttributeDataType["TEXT"] = "TEXT";
    AttributeDataType["NUMBER"] = "NUMBER";
    AttributeDataType["DECIMAL"] = "DECIMAL";
    AttributeDataType["BOOLEAN"] = "BOOLEAN";
    AttributeDataType["DATE"] = "DATE";
    AttributeDataType["DATETIME"] = "DATETIME";
    AttributeDataType["ENUM"] = "ENUM";
    AttributeDataType["MULTISELECT"] = "MULTISELECT";
    AttributeDataType["JSON"] = "JSON";
    AttributeDataType["URL"] = "URL";
    AttributeDataType["EMAIL"] = "EMAIL";
    AttributeDataType["PHONE"] = "PHONE";
    AttributeDataType["CURRENCY"] = "CURRENCY";
    AttributeDataType["PERCENTAGE"] = "PERCENTAGE";
    AttributeDataType["MEASUREMENT"] = "MEASUREMENT";
})(AttributeDataType || (exports.AttributeDataType = AttributeDataType = {}));
/**
 * Attribute scope - where attribute is applicable
 */
var AttributeScope;
(function (AttributeScope) {
    AttributeScope["GLOBAL"] = "GLOBAL";
    AttributeScope["CATEGORY"] = "CATEGORY";
    AttributeScope["PRODUCT"] = "PRODUCT";
    AttributeScope["VARIANT"] = "VARIANT";
    AttributeScope["SKU"] = "SKU";
})(AttributeScope || (exports.AttributeScope = AttributeScope = {}));
/**
 * Attribute status
 */
var AttributeStatus;
(function (AttributeStatus) {
    AttributeStatus["DRAFT"] = "DRAFT";
    AttributeStatus["ACTIVE"] = "ACTIVE";
    AttributeStatus["DEPRECATED"] = "DEPRECATED";
    AttributeStatus["ARCHIVED"] = "ARCHIVED";
})(AttributeStatus || (exports.AttributeStatus = AttributeStatus = {}));
/**
 * Validation rule types
 */
var ValidationRuleType;
(function (ValidationRuleType) {
    ValidationRuleType["REQUIRED"] = "REQUIRED";
    ValidationRuleType["MIN_LENGTH"] = "MIN_LENGTH";
    ValidationRuleType["MAX_LENGTH"] = "MAX_LENGTH";
    ValidationRuleType["MIN_VALUE"] = "MIN_VALUE";
    ValidationRuleType["MAX_VALUE"] = "MAX_VALUE";
    ValidationRuleType["REGEX"] = "REGEX";
    ValidationRuleType["UNIQUE"] = "UNIQUE";
    ValidationRuleType["ENUM"] = "ENUM";
    ValidationRuleType["CUSTOM"] = "CUSTOM";
})(ValidationRuleType || (exports.ValidationRuleType = ValidationRuleType = {}));
/**
 * Inheritance strategy
 */
var InheritanceStrategy;
(function (InheritanceStrategy) {
    InheritanceStrategy["NONE"] = "NONE";
    InheritanceStrategy["OVERRIDE"] = "OVERRIDE";
    InheritanceStrategy["MERGE"] = "MERGE";
    InheritanceStrategy["APPEND"] = "APPEND";
    InheritanceStrategy["CASCADE"] = "CASCADE";
})(InheritanceStrategy || (exports.InheritanceStrategy = InheritanceStrategy = {}));
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
function createAttributeDefinition(definition) {
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
function updateAttributeDefinition(attribute, updates, userId) {
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
function addValidationRule(attribute, rule) {
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
function removeValidationRule(attribute, ruleId) {
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
function activateAttribute(attribute, userId) {
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
function deprecateAttribute(attribute, userId, reason) {
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
function cloneAttributeDefinition(attribute, newCode, userId) {
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
function searchAttributes(attributes, criteria) {
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
function createAttributeGroup(group) {
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
function assignAttributeToGroup(attribute, groupId) {
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
function createAttributeSet(set) {
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
function addAttributeToSet(set, attributeId) {
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
function removeAttributeFromSet(set, attributeId) {
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
function getCategoryAttributes(sets, attributes, categoryId) {
    const categorySets = sets.filter(set => set.categoryIds.includes(categoryId));
    const attributeIds = new Set();
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
function reorderAttributes(attributes, orderedIds) {
    return attributes.map(attr => {
        const newOrder = orderedIds.indexOf(attr.attributeId);
        if (newOrder === -1)
            return attr;
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
function createAttributeValue(value) {
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
function updateAttributeValue(value, newValue, source) {
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
function getEntityValues(values, entityId, entityType, locale) {
    return values.filter(val => val.entityId === entityId &&
        val.entityType === entityType &&
        (!locale || val.locale === locale || !val.locale));
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
function createLookupOption(option) {
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
function getAttributeLookupOptions(options, attributeId, activeOnly = true) {
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
function validateLookupValue(value, options) {
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
function buildLookupHierarchy(options) {
    const optionMap = new Map();
    const roots = [];
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
        }
        else {
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
function bulkSetAttributeValues(entityId, entityType, values, source) {
    const attributeValues = [];
    for (const [attributeId, value] of Object.entries(values)) {
        attributeValues.push(createAttributeValue({
            attributeId,
            entityId,
            entityType,
            value,
            source: source || 'bulk-import',
        }));
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
function validateAttributeValue(value, attribute) {
    const errors = [];
    const warnings = [];
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
            }
            else if (rule.severity === 'WARNING') {
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
function executeValidationRule(value, rule) {
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
function validateEntityAttributes(values, attributes) {
    const errors = [];
    const warnings = [];
    const valueMap = new Map();
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
function generateDataQualityReport(entityId, entityType, values, requiredAttributes) {
    const issues = [];
    const valueMap = new Map();
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
function findDuplicateValues(values, attributeId) {
    const valueMap = new Map();
    // Group entities by value
    for (const val of values) {
        if (val.attributeId === attributeId) {
            const key = JSON.stringify(val.value);
            if (!valueMap.has(key)) {
                valueMap.set(key, []);
            }
            valueMap.get(key).push(val.entityId);
        }
    }
    // Return groups with duplicates
    const duplicates = [];
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
function suggestValueCorrections(value, attribute, options) {
    const suggestions = [];
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
function calculateAttributeCompleteness(values, attributes) {
    if (attributes.length === 0)
        return 100;
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
function validateDataType(value, dataType) {
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
            }
            catch {
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
function createInheritanceRule(rule) {
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
function propagateAttributes(parentValues, childEntityId, childEntityType, rules) {
    const propagatedValues = [];
    for (const parentValue of parentValues) {
        const applicableRules = rules
            .filter(rule => rule.isActive &&
            rule.attributeId === parentValue.attributeId &&
            rule.targetEntityType === childEntityType)
            .sort((a, b) => b.priority - a.priority);
        if (applicableRules.length > 0) {
            const rule = applicableRules[0];
            if (rule.strategy !== InheritanceStrategy.NONE) {
                propagatedValues.push(createAttributeValue({
                    attributeId: parentValue.attributeId,
                    entityId: childEntityId,
                    entityType: childEntityType,
                    value: parentValue.value,
                    source: 'inherited',
                    metadata: {
                        inheritedFrom: parentValue.entityId,
                        inheritanceStrategy: rule.strategy,
                    },
                }));
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
function mergeInheritedValues(inheritedValues, localValues, strategy) {
    const localMap = new Map();
    for (const value of localValues) {
        localMap.set(value.attributeId, value);
    }
    const mergedValues = [];
    for (const inherited of inheritedValues) {
        const local = localMap.get(inherited.attributeId);
        if (!local) {
            // No local value, use inherited
            mergedValues.push(inherited);
        }
        else {
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
                    }
                    else {
                        mergedValues.push(local);
                    }
                    break;
                case InheritanceStrategy.APPEND:
                    if (Array.isArray(local.value)) {
                        mergedValues.push({
                            ...local,
                            value: [...local.value, inherited.value],
                        });
                    }
                    else {
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
function cascadeAttributeUpdate(parentEntityId, attributeId, newValue, childEntityIds) {
    const updatedValues = [];
    for (const childId of childEntityIds) {
        updatedValues.push(createAttributeValue({
            attributeId,
            entityId: childId,
            entityType: 'CHILD', // Would be determined dynamically
            value: newValue,
            source: 'cascade',
            metadata: {
                cascadedFrom: parentEntityId,
                cascadedAt: new Date(),
            },
        }));
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
function resolveAttributeWithInheritance(entityId, attributeId, allValues, parentChain) {
    // Check local value first
    const localValue = allValues.find(v => v.entityId === entityId && v.attributeId === attributeId);
    if (localValue && localValue.value !== null && localValue.value !== undefined) {
        return localValue.value;
    }
    // Walk up parent chain
    for (const parentId of parentChain) {
        const parentValue = allValues.find(v => v.entityId === parentId && v.attributeId === attributeId);
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
function findOrphanedValues(values, attributes) {
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
function createAttributeVersion(oldAttribute, newAttribute, userId, reason) {
    const changes = {};
    // Detect changes
    for (const key of Object.keys(newAttribute)) {
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
function generateAttributeId() {
    return `ATTR-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates unique group ID.
 */
function generateGroupId() {
    return `GRP-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates unique set ID.
 */
function generateSetId() {
    return `SET-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates unique value ID.
 */
function generateValueId() {
    return `VAL-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates unique option ID.
 */
function generateOptionId() {
    return `OPT-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates unique rule ID.
 */
function generateRuleId() {
    return `RULE-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates unique report ID.
 */
function generateReportId() {
    return `RPT-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates unique issue ID.
 */
function generateIssueId() {
    return `ISSUE-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates unique version ID.
 */
function generateVersionId() {
    return `VER-${crypto.randomUUID()}`;
}
/**
 * Helper: Calculates Levenshtein distance between strings.
 */
function levenshteinDistance(str1, str2) {
    const matrix = [];
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
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
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
exports.default = {
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
//# sourceMappingURL=attribute-master-data-kit.js.map