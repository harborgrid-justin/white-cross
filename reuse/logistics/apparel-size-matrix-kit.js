"use strict";
/**
 * LOC: LOG-SIZE-001
 * File: /reuse/logistics/apparel-size-matrix-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Inventory management controllers
 *   - Product catalog services
 *   - E-commerce sizing modules
 *   - Warehouse management systems
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
exports.MeasurementUnit = exports.FitProfile = exports.Gender = exports.ApparelCategory = exports.SizeSystem = void 0;
exports.createSizeMatrix = createSizeMatrix;
exports.addSizeToMatrix = addSizeToMatrix;
exports.addMeasurementToMatrix = addMeasurementToMatrix;
exports.createStandardWomensTopsMatrix = createStandardWomensTopsMatrix;
exports.createStandardMensShirtsMatrix = createStandardMensShirtsMatrix;
exports.createNumericSizeMatrix = createNumericSizeMatrix;
exports.cloneSizeMatrix = cloneSizeMatrix;
exports.mergeSizeMatrices = mergeSizeMatrices;
exports.setSizeMatrixActive = setSizeMatrixActive;
exports.convertSize = convertSize;
exports.createSizeConversion = createSizeConversion;
exports.addConversionToMatrix = addConversionToMatrix;
exports.batchConvertSizes = batchConvertSizes;
exports.getAllSizeEquivalents = getAllSizeEquivalents;
exports.convertShoeSize = convertShoeSize;
exports.createBidirectionalConversion = createBidirectionalConversion;
exports.validateSizeConversion = validateSizeConversion;
exports.generateConversionChart = generateConversionChart;
exports.validateSizeCode = validateSizeCode;
exports.validateSizeMeasurement = validateSizeMeasurement;
exports.validateSizeMatrix = validateSizeMatrix;
exports.isSizeInRange = isSizeInRange;
exports.validateSizeProgression = validateSizeProgression;
exports.validateAgainstIndustryStandards = validateAgainstIndustryStandards;
exports.checkSizeOverlap = checkSizeOverlap;
exports.validateSizeAcrossFitProfiles = validateSizeAcrossFitProfiles;
exports.generateSizeValidationReport = generateSizeValidationReport;
exports.convertMeasurementUnit = convertMeasurementUnit;
exports.createMeasurementFromBody = createMeasurementFromBody;
exports.calculateMeasurementTolerances = calculateMeasurementTolerances;
exports.generateMeasurementGuide = generateMeasurementGuide;
exports.compareMeasurements = compareMeasurements;
exports.calculateGradingIncrements = calculateGradingIncrements;
exports.validateMeasurementRange = validateMeasurementRange;
exports.generateSizeGradingScale = generateSizeGradingScale;
exports.createMeasurementChart = createMeasurementChart;
exports.recommendSize = recommendSize;
exports.calculateFitScore = calculateFitScore;
exports.recommendFitProfile = recommendFitProfile;
exports.compareAcrossMatrices = compareAcrossMatrices;
exports.generateFitAnalysis = generateFitAnalysis;
exports.predictSizeAcrossBrands = predictSizeAcrossBrands;
exports.analyzeSizeConsistency = analyzeSizeConsistency;
exports.generatePersonalizedRecommendation = generatePersonalizedRecommendation;
exports.createVirtualFittingSession = createVirtualFittingSession;
/**
 * File: /reuse/logistics/apparel-size-matrix-kit.ts
 * Locator: WC-LOGISTICS-SIZE-MATRIX-001
 * Purpose: Comprehensive Apparel Size Matrix Management - Global sizing standards and conversions
 *
 * Upstream: Independent utility module for apparel size management
 * Downstream: ../backend/logistics/*, ../backend/retail/*, Product catalog, Inventory systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 45 utility functions for size matrices, conversions, validations, measurements, fit analysis
 *
 * LLM Context: Enterprise-grade apparel size matrix utilities to compete with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive size system management across global standards (US, UK, EU, Asian sizing),
 * size conversions, measurement standards, fit profiles, size validation, matrix configuration,
 * multi-region support, body measurement tracking, and intelligent size recommendations.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Size system standards enumeration
 */
var SizeSystem;
(function (SizeSystem) {
    SizeSystem["US"] = "US";
    SizeSystem["UK"] = "UK";
    SizeSystem["EU"] = "EU";
    SizeSystem["ASIA"] = "ASIA";
    SizeSystem["JAPAN"] = "JAPAN";
    SizeSystem["AUSTRALIA"] = "AUSTRALIA";
    SizeSystem["INTERNATIONAL"] = "INTERNATIONAL";
    SizeSystem["NUMERIC"] = "NUMERIC";
})(SizeSystem || (exports.SizeSystem = SizeSystem = {}));
/**
 * Apparel category types
 */
var ApparelCategory;
(function (ApparelCategory) {
    ApparelCategory["WOMENS_TOPS"] = "WOMENS_TOPS";
    ApparelCategory["WOMENS_BOTTOMS"] = "WOMENS_BOTTOMS";
    ApparelCategory["WOMENS_DRESSES"] = "WOMENS_DRESSES";
    ApparelCategory["WOMENS_SHOES"] = "WOMENS_SHOES";
    ApparelCategory["MENS_TOPS"] = "MENS_TOPS";
    ApparelCategory["MENS_BOTTOMS"] = "MENS_BOTTOMS";
    ApparelCategory["MENS_SHOES"] = "MENS_SHOES";
    ApparelCategory["MENS_SUITS"] = "MENS_SUITS";
    ApparelCategory["CHILDRENS"] = "CHILDRENS";
    ApparelCategory["INFANTS"] = "INFANTS";
    ApparelCategory["UNISEX"] = "UNISEX";
    ApparelCategory["ACCESSORIES"] = "ACCESSORIES";
})(ApparelCategory || (exports.ApparelCategory = ApparelCategory = {}));
/**
 * Gender classification for sizing
 */
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["UNISEX"] = "UNISEX";
    Gender["CHILDREN"] = "CHILDREN";
})(Gender || (exports.Gender = Gender = {}));
/**
 * Fit profile types
 */
var FitProfile;
(function (FitProfile) {
    FitProfile["SLIM"] = "SLIM";
    FitProfile["REGULAR"] = "REGULAR";
    FitProfile["RELAXED"] = "RELAXED";
    FitProfile["ATHLETIC"] = "ATHLETIC";
    FitProfile["PLUS"] = "PLUS";
    FitProfile["PETITE"] = "PETITE";
    FitProfile["TALL"] = "TALL";
    FitProfile["BIG"] = "BIG";
})(FitProfile || (exports.FitProfile = FitProfile = {}));
/**
 * Measurement units
 */
var MeasurementUnit;
(function (MeasurementUnit) {
    MeasurementUnit["INCHES"] = "INCHES";
    MeasurementUnit["CENTIMETERS"] = "CENTIMETERS";
    MeasurementUnit["MILLIMETERS"] = "MILLIMETERS";
})(MeasurementUnit || (exports.MeasurementUnit = MeasurementUnit = {}));
// ============================================================================
// SECTION 1: SIZE MATRIX CREATION & CONFIGURATION (Functions 1-9)
// ============================================================================
/**
 * 1. Creates a new size matrix for apparel category.
 *
 * @param {Partial<SizeMatrix>} config - Matrix configuration
 * @returns {SizeMatrix} New size matrix
 *
 * @example
 * ```typescript
 * const matrix = createSizeMatrix({
 *   name: 'Women\'s Tops US Sizing',
 *   category: ApparelCategory.WOMENS_TOPS,
 *   gender: Gender.FEMALE,
 *   sizeSystem: SizeSystem.US,
 *   fitProfiles: [FitProfile.SLIM, FitProfile.REGULAR]
 * });
 * ```
 */
function createSizeMatrix(config) {
    const matrixId = generateMatrixId();
    return {
        matrixId,
        name: config.name || `Size Matrix ${matrixId}`,
        description: config.description,
        category: config.category || ApparelCategory.UNISEX,
        gender: config.gender || Gender.UNISEX,
        sizeSystem: config.sizeSystem || SizeSystem.US,
        sizes: config.sizes || [],
        conversions: config.conversions || [],
        measurements: config.measurements || [],
        fitProfiles: config.fitProfiles || [FitProfile.REGULAR],
        active: config.active !== undefined ? config.active : true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * 2. Adds size definition to matrix.
 *
 * @param {SizeMatrix} matrix - Size matrix
 * @param {Partial<SizeDefinition>} size - Size definition
 * @returns {SizeMatrix} Updated matrix
 *
 * @example
 * ```typescript
 * const updated = addSizeToMatrix(matrix, {
 *   code: 'M',
 *   label: 'Medium',
 *   displayOrder: 2,
 *   numericEquivalent: 8,
 *   abbreviation: 'MD'
 * });
 * ```
 */
function addSizeToMatrix(matrix, size) {
    const sizeId = crypto.randomUUID();
    const displayOrder = size.displayOrder ?? matrix.sizes.length;
    const newSize = {
        sizeId,
        code: size.code || '',
        label: size.label || size.code || '',
        displayOrder,
        numericEquivalent: size.numericEquivalent,
        abbreviation: size.abbreviation,
        metadata: size.metadata,
    };
    return {
        ...matrix,
        sizes: [...matrix.sizes, newSize].sort((a, b) => a.displayOrder - b.displayOrder),
        updatedAt: new Date(),
    };
}
/**
 * 3. Adds measurement specification to size matrix.
 *
 * @param {SizeMatrix} matrix - Size matrix
 * @param {Partial<SizeMeasurement>} measurement - Measurement specification
 * @returns {SizeMatrix} Updated matrix
 *
 * @example
 * ```typescript
 * const updated = addMeasurementToMatrix(matrix, {
 *   sizeCode: 'M',
 *   measurements: {
 *     chest: 38,
 *     waist: 32,
 *     sleeve: 33
 *   },
 *   unit: MeasurementUnit.INCHES,
 *   tolerance: 0.5
 * });
 * ```
 */
function addMeasurementToMatrix(matrix, measurement) {
    const measurementId = crypto.randomUUID();
    const newMeasurement = {
        measurementId,
        sizeCode: measurement.sizeCode || '',
        sizeSystem: measurement.sizeSystem || matrix.sizeSystem,
        category: measurement.category || matrix.category,
        measurements: measurement.measurements || {},
        unit: measurement.unit || MeasurementUnit.INCHES,
        tolerance: measurement.tolerance,
    };
    return {
        ...matrix,
        measurements: [...matrix.measurements, newMeasurement],
        updatedAt: new Date(),
    };
}
/**
 * 4. Creates standard US women's tops size matrix.
 *
 * @returns {SizeMatrix} Pre-configured matrix
 *
 * @example
 * ```typescript
 * const matrix = createStandardWomensTopsMatrix();
 * // Contains XS, S, M, L, XL, XXL with measurements
 * ```
 */
function createStandardWomensTopsMatrix() {
    const matrix = createSizeMatrix({
        name: 'Standard Women\'s Tops (US)',
        category: ApparelCategory.WOMENS_TOPS,
        gender: Gender.FEMALE,
        sizeSystem: SizeSystem.US,
        fitProfiles: [FitProfile.REGULAR],
    });
    const sizes = [
        { code: 'XS', label: 'Extra Small', numericEquivalent: 0, displayOrder: 0 },
        { code: 'S', label: 'Small', numericEquivalent: 2, displayOrder: 1 },
        { code: 'M', label: 'Medium', numericEquivalent: 6, displayOrder: 2 },
        { code: 'L', label: 'Large', numericEquivalent: 10, displayOrder: 3 },
        { code: 'XL', label: 'Extra Large', numericEquivalent: 14, displayOrder: 4 },
        { code: 'XXL', label: '2X Large', numericEquivalent: 18, displayOrder: 5 },
    ];
    let result = matrix;
    for (const size of sizes) {
        result = addSizeToMatrix(result, size);
    }
    return result;
}
/**
 * 5. Creates standard US men's shirts size matrix.
 *
 * @returns {SizeMatrix} Pre-configured matrix
 *
 * @example
 * ```typescript
 * const matrix = createStandardMensShirtsMatrix();
 * // Contains S, M, L, XL, XXL, XXXL with neck/sleeve measurements
 * ```
 */
function createStandardMensShirtsMatrix() {
    const matrix = createSizeMatrix({
        name: 'Standard Men\'s Shirts (US)',
        category: ApparelCategory.MENS_TOPS,
        gender: Gender.MALE,
        sizeSystem: SizeSystem.US,
        fitProfiles: [FitProfile.REGULAR, FitProfile.SLIM, FitProfile.ATHLETIC],
    });
    const sizes = [
        { code: 'S', label: 'Small', numericEquivalent: 14.5, displayOrder: 0 },
        { code: 'M', label: 'Medium', numericEquivalent: 15.5, displayOrder: 1 },
        { code: 'L', label: 'Large', numericEquivalent: 16.5, displayOrder: 2 },
        { code: 'XL', label: 'Extra Large', numericEquivalent: 17.5, displayOrder: 3 },
        { code: 'XXL', label: '2X Large', numericEquivalent: 18.5, displayOrder: 4 },
        { code: 'XXXL', label: '3X Large', numericEquivalent: 19.5, displayOrder: 5 },
    ];
    let result = matrix;
    for (const size of sizes) {
        result = addSizeToMatrix(result, size);
    }
    return result;
}
/**
 * 6. Creates numeric size matrix (e.g., 2, 4, 6, 8).
 *
 * @param {number} minSize - Minimum size
 * @param {number} maxSize - Maximum size
 * @param {number} increment - Size increment
 * @param {ApparelCategory} category - Apparel category
 * @returns {SizeMatrix} Numeric size matrix
 *
 * @example
 * ```typescript
 * const matrix = createNumericSizeMatrix(2, 18, 2, ApparelCategory.WOMENS_BOTTOMS);
 * // Creates sizes: 2, 4, 6, 8, 10, 12, 14, 16, 18
 * ```
 */
function createNumericSizeMatrix(minSize, maxSize, increment, category) {
    const matrix = createSizeMatrix({
        name: `Numeric Sizing ${minSize}-${maxSize}`,
        category,
        sizeSystem: SizeSystem.NUMERIC,
        gender: Gender.UNISEX,
    });
    let result = matrix;
    let displayOrder = 0;
    for (let size = minSize; size <= maxSize; size += increment) {
        result = addSizeToMatrix(result, {
            code: size.toString(),
            label: size.toString(),
            numericEquivalent: size,
            displayOrder: displayOrder++,
        });
    }
    return result;
}
/**
 * 7. Clones size matrix with new configuration.
 *
 * @param {SizeMatrix} matrix - Matrix to clone
 * @param {Partial<SizeMatrix>} overrides - Configuration overrides
 * @returns {SizeMatrix} Cloned matrix
 *
 * @example
 * ```typescript
 * const cloned = cloneSizeMatrix(originalMatrix, {
 *   name: 'Modified Matrix',
 *   sizeSystem: SizeSystem.EU
 * });
 * ```
 */
function cloneSizeMatrix(matrix, overrides) {
    return {
        ...JSON.parse(JSON.stringify(matrix)),
        matrixId: generateMatrixId(),
        ...overrides,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * 8. Merges multiple size matrices into one.
 *
 * @param {SizeMatrix[]} matrices - Matrices to merge
 * @param {string} name - Name for merged matrix
 * @returns {SizeMatrix} Merged matrix
 *
 * @example
 * ```typescript
 * const merged = mergeSizeMatrices([matrix1, matrix2], 'Combined Sizing');
 * ```
 */
function mergeSizeMatrices(matrices, name) {
    if (matrices.length === 0) {
        throw new Error('Cannot merge empty matrix array');
    }
    const base = matrices[0];
    const merged = createSizeMatrix({
        name,
        category: base.category,
        gender: base.gender,
        sizeSystem: base.sizeSystem,
    });
    const allSizes = [];
    const allMeasurements = [];
    const allConversions = [];
    const allFitProfiles = new Set();
    for (const matrix of matrices) {
        allSizes.push(...matrix.sizes);
        allMeasurements.push(...matrix.measurements);
        allConversions.push(...matrix.conversions);
        matrix.fitProfiles.forEach(fp => allFitProfiles.add(fp));
    }
    return {
        ...merged,
        sizes: deduplicateSizes(allSizes),
        measurements: allMeasurements,
        conversions: deduplicateConversions(allConversions),
        fitProfiles: Array.from(allFitProfiles),
    };
}
/**
 * 9. Activates or deactivates size matrix.
 *
 * @param {SizeMatrix} matrix - Size matrix
 * @param {boolean} active - Active status
 * @returns {SizeMatrix} Updated matrix
 *
 * @example
 * ```typescript
 * const deactivated = setSizeMatrixActive(matrix, false);
 * ```
 */
function setSizeMatrixActive(matrix, active) {
    return {
        ...matrix,
        active,
        updatedAt: new Date(),
    };
}
// ============================================================================
// SECTION 2: SIZE CONVERSION & MAPPING (Functions 10-18)
// ============================================================================
/**
 * 10. Converts size from one system to another.
 *
 * @param {string} sizeCode - Source size code
 * @param {SizeSystem} fromSystem - Source size system
 * @param {SizeSystem} toSystem - Target size system
 * @param {ApparelCategory} category - Apparel category
 * @param {Gender} gender - Gender classification
 * @returns {string} Converted size code
 *
 * @example
 * ```typescript
 * const euSize = convertSize('M', SizeSystem.US, SizeSystem.EU,
 *   ApparelCategory.WOMENS_TOPS, Gender.FEMALE);
 * // Returns: '40'
 * ```
 */
function convertSize(sizeCode, fromSystem, toSystem, category, gender) {
    if (fromSystem === toSystem) {
        return sizeCode;
    }
    const conversionMap = getSizeConversionMap(category, gender);
    const key = `${fromSystem}_${toSystem}`;
    if (conversionMap[key] && conversionMap[key][sizeCode]) {
        return conversionMap[key][sizeCode];
    }
    throw new Error(`No conversion available for ${sizeCode} from ${fromSystem} to ${toSystem}`);
}
/**
 * 11. Creates size conversion mapping.
 *
 * @param {ApparelCategory} category - Apparel category
 * @param {SizeSystem} sourceSystem - Source size system
 * @param {SizeSystem} targetSystem - Target size system
 * @param {Record<string, string>} mappings - Size mappings
 * @param {Gender} gender - Gender classification
 * @returns {SizeConversion} Size conversion object
 *
 * @example
 * ```typescript
 * const conversion = createSizeConversion(
 *   ApparelCategory.MENS_TOPS,
 *   SizeSystem.US,
 *   SizeSystem.EU,
 *   { 'S': '44', 'M': '48', 'L': '52', 'XL': '56' },
 *   Gender.MALE
 * );
 * ```
 */
function createSizeConversion(category, sourceSystem, targetSystem, mappings, gender) {
    return {
        conversionId: crypto.randomUUID(),
        category,
        sourceSystem,
        targetSystem,
        mappings,
        gender,
    };
}
/**
 * 12. Adds conversion mapping to size matrix.
 *
 * @param {SizeMatrix} matrix - Size matrix
 * @param {SizeConversion} conversion - Conversion mapping
 * @returns {SizeMatrix} Updated matrix
 *
 * @example
 * ```typescript
 * const updated = addConversionToMatrix(matrix, usToEuConversion);
 * ```
 */
function addConversionToMatrix(matrix, conversion) {
    return {
        ...matrix,
        conversions: [...matrix.conversions, conversion],
        updatedAt: new Date(),
    };
}
/**
 * 13. Converts multiple sizes in batch.
 *
 * @param {string[]} sizes - Array of size codes
 * @param {SizeSystem} fromSystem - Source size system
 * @param {SizeSystem} toSystem - Target size system
 * @param {ApparelCategory} category - Apparel category
 * @param {Gender} gender - Gender classification
 * @returns {Record<string, string>} Size conversion results
 *
 * @example
 * ```typescript
 * const converted = batchConvertSizes(
 *   ['S', 'M', 'L', 'XL'],
 *   SizeSystem.US,
 *   SizeSystem.EU,
 *   ApparelCategory.WOMENS_TOPS,
 *   Gender.FEMALE
 * );
 * // Returns: { 'S': '36', 'M': '40', 'L': '44', 'XL': '48' }
 * ```
 */
function batchConvertSizes(sizes, fromSystem, toSystem, category, gender) {
    const results = {};
    for (const size of sizes) {
        try {
            results[size] = convertSize(size, fromSystem, toSystem, category, gender);
        }
        catch (error) {
            results[size] = size; // Fallback to original if conversion fails
        }
    }
    return results;
}
/**
 * 14. Gets all equivalent sizes across systems.
 *
 * @param {string} sizeCode - Size code
 * @param {SizeSystem} sourceSystem - Source size system
 * @param {ApparelCategory} category - Apparel category
 * @param {Gender} gender - Gender classification
 * @returns {Record<SizeSystem, string>} Equivalent sizes
 *
 * @example
 * ```typescript
 * const equivalents = getAllSizeEquivalents('M', SizeSystem.US,
 *   ApparelCategory.WOMENS_TOPS, Gender.FEMALE);
 * // Returns: { US: 'M', UK: '12', EU: '40', ASIA: 'L' }
 * ```
 */
function getAllSizeEquivalents(sizeCode, sourceSystem, category, gender) {
    const equivalents = {
        [sourceSystem]: sizeCode,
    };
    const targetSystems = [
        SizeSystem.US,
        SizeSystem.UK,
        SizeSystem.EU,
        SizeSystem.ASIA,
    ].filter(sys => sys !== sourceSystem);
    for (const targetSystem of targetSystems) {
        try {
            equivalents[targetSystem] = convertSize(sizeCode, sourceSystem, targetSystem, category, gender);
        }
        catch (error) {
            // Skip if conversion not available
        }
    }
    return equivalents;
}
/**
 * 15. Converts shoe size between systems.
 *
 * @param {number} size - Shoe size
 * @param {SizeSystem} fromSystem - Source size system
 * @param {SizeSystem} toSystem - Target size system
 * @param {Gender} gender - Gender classification
 * @returns {number} Converted shoe size
 *
 * @example
 * ```typescript
 * const euSize = convertShoeSize(9, SizeSystem.US, SizeSystem.EU, Gender.FEMALE);
 * // Returns: 40
 * ```
 */
function convertShoeSize(size, fromSystem, toSystem, gender) {
    const shoeSizeConversions = getShoeSizeConversions(gender);
    const key = `${fromSystem}_to_${toSystem}`;
    if (shoeSizeConversions[key]) {
        return shoeSizeConversions[key](size);
    }
    throw new Error(`Shoe size conversion from ${fromSystem} to ${toSystem} not supported`);
}
/**
 * 16. Creates bidirectional size conversion.
 *
 * @param {ApparelCategory} category - Apparel category
 * @param {SizeSystem} system1 - First size system
 * @param {SizeSystem} system2 - Second size system
 * @param {Record<string, string>} mappings - Size mappings (system1 -> system2)
 * @param {Gender} gender - Gender classification
 * @returns {SizeConversion[]} Bidirectional conversions
 *
 * @example
 * ```typescript
 * const conversions = createBidirectionalConversion(
 *   ApparelCategory.MENS_TOPS,
 *   SizeSystem.US,
 *   SizeSystem.UK,
 *   { 'S': 'S', 'M': 'M', 'L': 'L' },
 *   Gender.MALE
 * );
 * ```
 */
function createBidirectionalConversion(category, system1, system2, mappings, gender) {
    const reverseMappings = {};
    for (const [key, value] of Object.entries(mappings)) {
        reverseMappings[value] = key;
    }
    return [
        createSizeConversion(category, system1, system2, mappings, gender),
        createSizeConversion(category, system2, system1, reverseMappings, gender),
    ];
}
/**
 * 17. Validates size conversion mapping completeness.
 *
 * @param {SizeConversion} conversion - Conversion to validate
 * @param {string[]} requiredSizes - Required size codes
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSizeConversion(conversion, ['XS', 'S', 'M', 'L', 'XL']);
 * if (!result.complete) {
 *   console.log('Missing sizes:', result.missingSizes);
 * }
 * ```
 */
function validateSizeConversion(conversion, requiredSizes) {
    const conversionKeys = Object.keys(conversion.mappings);
    const missingSizes = requiredSizes.filter(size => !conversionKeys.includes(size));
    const extraSizes = conversionKeys.filter(size => !requiredSizes.includes(size));
    return {
        complete: missingSizes.length === 0,
        missingSizes,
        extraSizes,
    };
}
/**
 * 18. Generates size conversion chart.
 *
 * @param {ApparelCategory} category - Apparel category
 * @param {Gender} gender - Gender classification
 * @param {SizeSystem[]} systems - Size systems to include
 * @returns {SizeChart} Size conversion chart
 *
 * @example
 * ```typescript
 * const chart = generateConversionChart(
 *   ApparelCategory.WOMENS_TOPS,
 *   Gender.FEMALE,
 *   [SizeSystem.US, SizeSystem.UK, SizeSystem.EU]
 * );
 * ```
 */
function generateConversionChart(category, gender, systems) {
    const chartId = crypto.randomUUID();
    const headers = ['Size', ...systems.map(s => s.toString())];
    const rows = [];
    const baseSystem = systems[0];
    const baseSizes = getStandardSizesForCategory(category, baseSystem, gender);
    for (const baseSize of baseSizes) {
        const measurements = {
            Size: baseSize,
            [baseSystem]: baseSize,
        };
        for (const targetSystem of systems.slice(1)) {
            try {
                measurements[targetSystem] = convertSize(baseSize, baseSystem, targetSystem, category, gender);
            }
            catch (error) {
                measurements[targetSystem] = 'N/A';
            }
        }
        rows.push({
            sizeCode: baseSize,
            sizeLabel: baseSize,
            measurements,
        });
    }
    return {
        chartId,
        category,
        gender,
        sizeSystem: baseSystem,
        headers,
        rows,
    };
}
// ============================================================================
// SECTION 3: SIZE VALIDATION & VERIFICATION (Functions 19-27)
// ============================================================================
/**
 * 19. Validates size code format and existence.
 *
 * @param {string} sizeCode - Size code to validate
 * @param {SizeMatrix} matrix - Size matrix
 * @returns {SizeValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSizeCode('M', matrix);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
function validateSizeCode(sizeCode, matrix) {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    if (!sizeCode || sizeCode.trim() === '') {
        errors.push('Size code cannot be empty');
    }
    const sizeExists = matrix.sizes.some(s => s.code === sizeCode);
    if (!sizeExists) {
        errors.push(`Size code '${sizeCode}' not found in matrix`);
        // Suggest similar sizes
        const similarSizes = matrix.sizes
            .filter(s => s.code.toLowerCase().includes(sizeCode.toLowerCase()))
            .map(s => s.code);
        if (similarSizes.length > 0) {
            suggestions.push(`Did you mean: ${similarSizes.join(', ')}?`);
        }
    }
    return {
        valid: errors.length === 0,
        sizeCode,
        errors,
        warnings,
        suggestions,
    };
}
/**
 * 20. Validates size measurements consistency.
 *
 * @param {SizeMeasurement} measurement - Measurement to validate
 * @returns {SizeValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSizeMeasurement(measurement);
 * ```
 */
function validateSizeMeasurement(measurement) {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    if (Object.keys(measurement.measurements).length === 0) {
        errors.push('At least one measurement must be provided');
    }
    // Validate measurement values are positive
    for (const [key, value] of Object.entries(measurement.measurements)) {
        if (value !== undefined && value <= 0) {
            errors.push(`Measurement ${key} must be positive`);
        }
    }
    // Validate logical relationships
    if (measurement.measurements.waist && measurement.measurements.hips) {
        if (measurement.measurements.waist > measurement.measurements.hips) {
            warnings.push('Waist measurement exceeds hip measurement - unusual but valid');
        }
    }
    if (measurement.measurements.chest && measurement.measurements.waist) {
        const diff = measurement.measurements.chest - measurement.measurements.waist;
        if (diff < 0) {
            warnings.push('Chest measurement less than waist - unusual pattern');
        }
    }
    return {
        valid: errors.length === 0,
        sizeCode: measurement.sizeCode,
        errors,
        warnings,
        suggestions,
    };
}
/**
 * 21. Validates size matrix completeness.
 *
 * @param {SizeMatrix} matrix - Size matrix to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSizeMatrix(matrix);
 * if (!result.valid) {
 *   console.log('Issues:', result.issues);
 * }
 * ```
 */
function validateSizeMatrix(matrix) {
    const issues = [];
    const warnings = [];
    if (matrix.sizes.length === 0) {
        issues.push('Size matrix must contain at least one size');
    }
    if (!matrix.name || matrix.name.trim() === '') {
        issues.push('Size matrix must have a name');
    }
    // Check for duplicate size codes
    const sizeCodes = matrix.sizes.map(s => s.code);
    const duplicates = sizeCodes.filter((code, index) => sizeCodes.indexOf(code) !== index);
    if (duplicates.length > 0) {
        issues.push(`Duplicate size codes found: ${duplicates.join(', ')}`);
    }
    // Check display order consistency
    const orders = matrix.sizes.map(s => s.displayOrder);
    const uniqueOrders = new Set(orders);
    if (uniqueOrders.size !== orders.length) {
        warnings.push('Duplicate display orders detected');
    }
    // Check if measurements exist for all sizes
    const sizesWithMeasurements = new Set(matrix.measurements.map(m => m.sizeCode));
    const sizesWithoutMeasurements = matrix.sizes
        .filter(s => !sizesWithMeasurements.has(s.code))
        .map(s => s.code);
    if (sizesWithoutMeasurements.length > 0) {
        warnings.push(`Sizes without measurements: ${sizesWithoutMeasurements.join(', ')}`);
    }
    return {
        valid: issues.length === 0,
        issues,
        warnings,
    };
}
/**
 * 22. Checks if size falls within valid range.
 *
 * @param {string} sizeCode - Size code
 * @param {SizeRange} range - Size range
 * @returns {boolean} Whether size is in range
 *
 * @example
 * ```typescript
 * const inRange = isSizeInRange('M', sizeRange);
 * ```
 */
function isSizeInRange(sizeCode, range) {
    // For numeric sizes
    const numeric = parseFloat(sizeCode);
    if (!isNaN(numeric)) {
        const min = parseFloat(range.minSize);
        const max = parseFloat(range.maxSize);
        return numeric >= min && numeric <= max;
    }
    // For letter sizes, use display order or predefined ordering
    const standardOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const codeIndex = standardOrder.indexOf(sizeCode);
    const minIndex = standardOrder.indexOf(range.minSize);
    const maxIndex = standardOrder.indexOf(range.maxSize);
    if (codeIndex !== -1 && minIndex !== -1 && maxIndex !== -1) {
        return codeIndex >= minIndex && codeIndex <= maxIndex;
    }
    return false;
}
/**
 * 23. Validates size progression (grading).
 *
 * @param {SizeMatrix} matrix - Size matrix
 * @returns {object} Grading validation result
 *
 * @example
 * ```typescript
 * const result = validateSizeProgression(matrix);
 * if (!result.consistent) {
 *   console.log('Grading issues:', result.issues);
 * }
 * ```
 */
function validateSizeProgression(matrix) {
    const issues = [];
    if (matrix.measurements.length < 2) {
        issues.push('Need at least 2 size measurements to validate progression');
        return { consistent: false, issues };
    }
    // Sort measurements by size
    const sortedMeasurements = [...matrix.measurements].sort((a, b) => {
        const sizeA = matrix.sizes.find(s => s.code === a.sizeCode);
        const sizeB = matrix.sizes.find(s => s.code === b.sizeCode);
        return (sizeA?.displayOrder || 0) - (sizeB?.displayOrder || 0);
    });
    // Check consistency of grading increments
    const measurementTypes = ['chest', 'waist', 'hips', 'inseam'];
    for (const type of measurementTypes) {
        const values = [];
        for (const measurement of sortedMeasurements) {
            const value = measurement.measurements[type];
            if (value !== undefined) {
                values.push(value);
            }
        }
        if (values.length > 2) {
            const increments = [];
            for (let i = 1; i < values.length; i++) {
                increments.push(values[i] - values[i - 1]);
            }
            // Check if increments are consistent (within tolerance)
            const avgIncrement = increments.reduce((a, b) => a + b, 0) / increments.length;
            const inconsistent = increments.some(inc => Math.abs(inc - avgIncrement) > 1);
            if (inconsistent) {
                issues.push(`Inconsistent grading for ${type}: increments vary significantly`);
            }
        }
    }
    return {
        consistent: issues.length === 0,
        issues,
        gradingPattern: issues.length === 0 ? 'CONSISTENT' : 'INCONSISTENT',
    };
}
/**
 * 24. Validates size against industry standards.
 *
 * @param {string} sizeCode - Size code
 * @param {SizeMeasurement} measurement - Size measurement
 * @param {ApparelCategory} category - Apparel category
 * @returns {object} Standards validation result
 *
 * @example
 * ```typescript
 * const result = validateAgainstIndustryStandards('M', measurement,
 *   ApparelCategory.MENS_TOPS);
 * ```
 */
function validateAgainstIndustryStandards(sizeCode, measurement, category) {
    const deviations = [];
    const standards = getIndustryStandards(category);
    // This would contain actual industry standard validations
    // For now, basic range checks
    if (measurement.measurements.chest) {
        if (measurement.measurements.chest < 20 || measurement.measurements.chest > 70) {
            deviations.push('Chest measurement outside typical range');
        }
    }
    if (measurement.measurements.waist) {
        if (measurement.measurements.waist < 20 || measurement.measurements.waist > 60) {
            deviations.push('Waist measurement outside typical range');
        }
    }
    return {
        compliant: deviations.length === 0,
        deviations,
        standards: `Industry Standard: ${category}`,
    };
}
/**
 * 25. Checks for size overlap between matrices.
 *
 * @param {SizeMatrix} matrix1 - First matrix
 * @param {SizeMatrix} matrix2 - Second matrix
 * @returns {object} Overlap analysis
 *
 * @example
 * ```typescript
 * const overlap = checkSizeOverlap(regularMatrix, plusMatrix);
 * if (overlap.hasOverlap) {
 *   console.log('Overlapping sizes:', overlap.overlappingSizes);
 * }
 * ```
 */
function checkSizeOverlap(matrix1, matrix2) {
    const sizes1 = new Set(matrix1.sizes.map(s => s.code));
    const sizes2 = new Set(matrix2.sizes.map(s => s.code));
    const overlappingSizes = Array.from(sizes1).filter(s => sizes2.has(s));
    const uniqueToMatrix1 = Array.from(sizes1).filter(s => !sizes2.has(s));
    const uniqueToMatrix2 = Array.from(sizes2).filter(s => !sizes1.has(s));
    return {
        hasOverlap: overlappingSizes.length > 0,
        overlappingSizes,
        uniqueToMatrix1,
        uniqueToMatrix2,
    };
}
/**
 * 26. Validates size consistency across fit profiles.
 *
 * @param {SizeMatrix} matrix - Size matrix
 * @param {string} sizeCode - Size code
 * @returns {object} Consistency result
 *
 * @example
 * ```typescript
 * const result = validateSizeAcrossFitProfiles(matrix, 'M');
 * ```
 */
function validateSizeAcrossFitProfiles(matrix, sizeCode) {
    const variations = [];
    // This would contain actual fit profile comparison logic
    // For now, basic validation
    if (matrix.fitProfiles.length > 1) {
        variations.push(`Size ${sizeCode} available in ${matrix.fitProfiles.length} fit profiles`);
    }
    return {
        consistent: true,
        fitProfiles: matrix.fitProfiles,
        variations,
    };
}
/**
 * 27. Generates size validation report.
 *
 * @param {SizeMatrix} matrix - Size matrix
 * @returns {object} Comprehensive validation report
 *
 * @example
 * ```typescript
 * const report = generateSizeValidationReport(matrix);
 * console.log('Validation Score:', report.validationScore);
 * ```
 */
function generateSizeValidationReport(matrix) {
    const errors = [];
    const warnings = [];
    const recommendations = [];
    let passedChecks = 0;
    let totalChecks = 0;
    // Matrix completeness
    totalChecks++;
    const matrixValidation = validateSizeMatrix(matrix);
    if (matrixValidation.valid) {
        passedChecks++;
    }
    else {
        errors.push(...matrixValidation.issues);
    }
    warnings.push(...matrixValidation.warnings);
    // Size progression
    totalChecks++;
    const progressionValidation = validateSizeProgression(matrix);
    if (progressionValidation.consistent) {
        passedChecks++;
    }
    else {
        warnings.push(...progressionValidation.issues);
    }
    // Individual size validations
    for (const size of matrix.sizes) {
        totalChecks++;
        const sizeValidation = validateSizeCode(size.code, matrix);
        if (sizeValidation.valid) {
            passedChecks++;
        }
        else {
            errors.push(...sizeValidation.errors);
        }
    }
    // Measurement validations
    for (const measurement of matrix.measurements) {
        totalChecks++;
        const measurementValidation = validateSizeMeasurement(measurement);
        if (measurementValidation.valid) {
            passedChecks++;
        }
        else {
            warnings.push(...measurementValidation.warnings);
        }
    }
    // Generate recommendations
    if (matrix.conversions.length === 0) {
        recommendations.push('Add size conversion mappings for international support');
    }
    if (matrix.measurements.length < matrix.sizes.length) {
        recommendations.push('Add measurements for all sizes');
    }
    if (matrix.fitProfiles.length === 1) {
        recommendations.push('Consider adding multiple fit profiles');
    }
    const validationScore = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;
    return {
        validationScore: Math.round(validationScore),
        totalChecks,
        passedChecks,
        errors,
        warnings,
        recommendations,
    };
}
// ============================================================================
// SECTION 4: MEASUREMENT STANDARDS (Functions 28-36)
// ============================================================================
/**
 * 28. Converts measurements between units.
 *
 * @param {number} value - Measurement value
 * @param {MeasurementUnit} fromUnit - Source unit
 * @param {MeasurementUnit} toUnit - Target unit
 * @returns {number} Converted value
 *
 * @example
 * ```typescript
 * const cm = convertMeasurementUnit(38, MeasurementUnit.INCHES, MeasurementUnit.CENTIMETERS);
 * // Returns: 96.52
 * ```
 */
function convertMeasurementUnit(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) {
        return value;
    }
    // Convert to base unit (centimeters)
    let cm = value;
    if (fromUnit === MeasurementUnit.INCHES) {
        cm = value * 2.54;
    }
    else if (fromUnit === MeasurementUnit.MILLIMETERS) {
        cm = value / 10;
    }
    // Convert from base unit to target
    if (toUnit === MeasurementUnit.INCHES) {
        return Number((cm / 2.54).toFixed(2));
    }
    else if (toUnit === MeasurementUnit.MILLIMETERS) {
        return Number((cm * 10).toFixed(2));
    }
    return Number(cm.toFixed(2));
}
/**
 * 29. Creates measurement specification from body measurements.
 *
 * @param {BodyMeasurements} body - Body measurements
 * @param {string} sizeCode - Size code
 * @param {SizeSystem} system - Size system
 * @param {ApparelCategory} category - Apparel category
 * @returns {SizeMeasurement} Size measurement specification
 *
 * @example
 * ```typescript
 * const sizeMeasurement = createMeasurementFromBody(bodyMeasurements, 'M',
 *   SizeSystem.US, ApparelCategory.MENS_TOPS);
 * ```
 */
function createMeasurementFromBody(body, sizeCode, system, category) {
    return {
        measurementId: crypto.randomUUID(),
        sizeCode,
        sizeSystem: system,
        category,
        measurements: {
            chest: body.chest,
            waist: body.waist,
            hips: body.hips,
            inseam: body.inseam,
            neck: body.neck,
            sleeve: body.sleeve,
            shoulder: body.shoulder,
        },
        unit: body.unit,
    };
}
/**
 * 30. Calculates standard measurement tolerances.
 *
 * @param {SizeMeasurement} measurement - Size measurement
 * @param {number} tolerancePercentage - Tolerance as percentage (e.g., 2 for ±2%)
 * @returns {object} Measurement ranges with tolerances
 *
 * @example
 * ```typescript
 * const ranges = calculateMeasurementTolerances(measurement, 2);
 * // Returns min/max ranges for each measurement
 * ```
 */
function calculateMeasurementTolerances(measurement, tolerancePercentage) {
    const ranges = {};
    for (const [key, value] of Object.entries(measurement.measurements)) {
        if (value !== undefined) {
            const tolerance = value * (tolerancePercentage / 100);
            ranges[key] = {
                min: Number((value - tolerance).toFixed(2)),
                max: Number((value + tolerance).toFixed(2)),
                nominal: value,
            };
        }
    }
    return ranges;
}
/**
 * 31. Generates measurement guide for size.
 *
 * @param {SizeMeasurement} measurement - Size measurement
 * @param {MeasurementUnit} displayUnit - Unit for display
 * @returns {string} Formatted measurement guide
 *
 * @example
 * ```typescript
 * const guide = generateMeasurementGuide(measurement, MeasurementUnit.INCHES);
 * console.log(guide);
 * ```
 */
function generateMeasurementGuide(measurement, displayUnit) {
    let guide = `Size ${measurement.sizeCode} Measurements\n`;
    guide += '='.repeat(40) + '\n\n';
    const measurementLabels = {
        chest: 'Chest/Bust',
        waist: 'Waist',
        hips: 'Hips',
        inseam: 'Inseam',
        neck: 'Neck',
        sleeve: 'Sleeve Length',
        shoulder: 'Shoulder Width',
        length: 'Length',
        footLength: 'Foot Length',
        footWidth: 'Foot Width',
    };
    for (const [key, value] of Object.entries(measurement.measurements)) {
        if (value !== undefined) {
            const converted = convertMeasurementUnit(value, measurement.unit, displayUnit);
            const unitLabel = displayUnit === MeasurementUnit.INCHES ? '"' : 'cm';
            const label = measurementLabels[key] || key;
            guide += `${label}: ${converted}${unitLabel}\n`;
        }
    }
    if (measurement.tolerance) {
        guide += `\nTolerance: ±${measurement.tolerance}${displayUnit === MeasurementUnit.INCHES ? '"' : 'cm'}\n`;
    }
    return guide;
}
/**
 * 32. Compares measurements between two sizes.
 *
 * @param {SizeMeasurement} size1 - First size measurement
 * @param {SizeMeasurement} size2 - Second size measurement
 * @returns {object} Measurement differences
 *
 * @example
 * ```typescript
 * const diff = compareMeasurements(sizeM, sizeL);
 * console.log('Chest difference:', diff.chest);
 * ```
 */
function compareMeasurements(size1, size2) {
    const differences = {};
    // Ensure same unit for comparison
    const unit = size1.unit;
    for (const key of Object.keys(size1.measurements)) {
        const val1 = size1.measurements[key];
        const val2 = size2.measurements[key];
        if (val1 !== undefined && val2 !== undefined) {
            let val2Converted = val2;
            if (size2.unit !== unit) {
                val2Converted = convertMeasurementUnit(val2, size2.unit, unit);
            }
            differences[key] = Number((val2Converted - val1).toFixed(2));
        }
    }
    return differences;
}
/**
 * 33. Calculates grading increments between sizes.
 *
 * @param {SizeMeasurement[]} measurements - Array of size measurements
 * @returns {SizeGradingRule[]} Grading rules
 *
 * @example
 * ```typescript
 * const rules = calculateGradingIncrements([sizeS, sizeM, sizeL]);
 * ```
 */
function calculateGradingIncrements(measurements) {
    if (measurements.length < 2) {
        return [];
    }
    const rules = [];
    const category = measurements[0].category;
    const measurementPoints = ['chest', 'waist', 'hips', 'inseam', 'sleeve'];
    for (const point of measurementPoints) {
        const values = [];
        for (const measurement of measurements) {
            const value = measurement.measurements[point];
            if (value !== undefined) {
                values.push(value);
            }
        }
        if (values.length >= 2) {
            const increments = [];
            for (let i = 1; i < values.length; i++) {
                increments.push(values[i] - values[i - 1]);
            }
            const avgIncrement = increments.reduce((a, b) => a + b, 0) / increments.length;
            rules.push({
                ruleId: crypto.randomUUID(),
                category,
                baseSize: measurements[0].sizeCode,
                measurementPoint: point,
                gradeIncrement: Number(avgIncrement.toFixed(2)),
                unit: measurements[0].unit,
                direction: 'UP',
            });
        }
    }
    return rules;
}
/**
 * 34. Validates measurement against standard ranges.
 *
 * @param {number} value - Measurement value
 * @param {string} measurementType - Type of measurement
 * @param {Gender} gender - Gender classification
 * @param {MeasurementUnit} unit - Measurement unit
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateMeasurementRange(38, 'chest', Gender.MALE,
 *   MeasurementUnit.INCHES);
 * ```
 */
function validateMeasurementRange(value, measurementType, gender, unit) {
    const ranges = getStandardMeasurementRanges(gender, unit);
    const range = ranges[measurementType];
    if (!range) {
        return {
            valid: true,
            inRange: true,
            min: 0,
            max: Infinity,
            message: 'No standard range defined',
        };
    }
    const inRange = value >= range.min && value <= range.max;
    return {
        valid: true,
        inRange,
        min: range.min,
        max: range.max,
        message: inRange
            ? 'Measurement within standard range'
            : `Measurement outside standard range (${range.min}-${range.max})`,
    };
}
/**
 * 35. Generates size grading scale.
 *
 * @param {SizeMeasurement} baseSize - Base size measurement
 * @param {SizeGradingRule[]} rules - Grading rules
 * @param {number} sizeCount - Number of sizes to generate
 * @returns {SizeMeasurement[]} Generated size measurements
 *
 * @example
 * ```typescript
 * const scale = generateSizeGradingScale(baseSizeM, gradingRules, 5);
 * // Generates measurements for 5 sizes based on grading rules
 * ```
 */
function generateSizeGradingScale(baseSize, rules, sizeCount) {
    const measurements = [baseSize];
    const sizeCodes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const baseIndex = sizeCodes.indexOf(baseSize.sizeCode);
    for (let i = 1; i < sizeCount; i++) {
        const newMeasurements = { ...baseSize.measurements };
        for (const rule of rules) {
            const currentValue = baseSize.measurements[rule.measurementPoint];
            if (currentValue !== undefined) {
                newMeasurements[rule.measurementPoint] =
                    Number((currentValue + rule.gradeIncrement * i).toFixed(2));
            }
        }
        const newSizeCode = sizeCodes[baseIndex + i] || `SIZE_${i}`;
        measurements.push({
            measurementId: crypto.randomUUID(),
            sizeCode: newSizeCode,
            sizeSystem: baseSize.sizeSystem,
            category: baseSize.category,
            measurements: newMeasurements,
            unit: baseSize.unit,
            tolerance: baseSize.tolerance,
        });
    }
    return measurements;
}
/**
 * 36. Creates measurement chart for display.
 *
 * @param {SizeMeasurement[]} measurements - Array of size measurements
 * @param {MeasurementUnit} displayUnit - Unit for display
 * @returns {SizeChart} Measurement chart
 *
 * @example
 * ```typescript
 * const chart = createMeasurementChart(measurements, MeasurementUnit.INCHES);
 * ```
 */
function createMeasurementChart(measurements, displayUnit) {
    if (measurements.length === 0) {
        throw new Error('Cannot create chart from empty measurements');
    }
    const firstMeasurement = measurements[0];
    const measurementKeys = Object.keys(firstMeasurement.measurements);
    const headers = ['Size', ...measurementKeys.map(k => formatMeasurementLabel(k))];
    const rows = measurements.map(measurement => {
        const rowData = {
            Size: measurement.sizeCode,
        };
        for (const key of measurementKeys) {
            const value = measurement.measurements[key];
            if (value !== undefined) {
                const converted = convertMeasurementUnit(value, measurement.unit, displayUnit);
                rowData[formatMeasurementLabel(key)] = `${converted}`;
            }
            else {
                rowData[formatMeasurementLabel(key)] = '-';
            }
        }
        return {
            sizeCode: measurement.sizeCode,
            sizeLabel: measurement.sizeCode,
            measurements: rowData,
        };
    });
    return {
        chartId: crypto.randomUUID(),
        category: firstMeasurement.category,
        gender: Gender.UNISEX,
        sizeSystem: firstMeasurement.sizeSystem,
        headers,
        rows,
        notes: [`All measurements in ${displayUnit}`],
    };
}
// ============================================================================
// SECTION 5: FIT ANALYSIS & RECOMMENDATIONS (Functions 37-45)
// ============================================================================
/**
 * 37. Recommends size based on body measurements.
 *
 * @param {BodyMeasurements} body - Body measurements
 * @param {SizeMatrix} matrix - Size matrix
 * @returns {SizeRecommendation} Size recommendation
 *
 * @example
 * ```typescript
 * const recommendation = recommendSize(bodyMeasurements, sizeMatrix);
 * console.log('Recommended size:', recommendation.recommendedSize);
 * console.log('Confidence:', recommendation.confidence);
 * ```
 */
function recommendSize(body, matrix) {
    if (matrix.measurements.length === 0) {
        throw new Error('Size matrix must contain measurements for recommendations');
    }
    let bestMatch = null;
    let bestScore = -Infinity;
    const scores = [];
    for (const sizeMeasurement of matrix.measurements) {
        const score = calculateFitScore(body, sizeMeasurement);
        scores.push({ size: sizeMeasurement, score });
        if (score > bestScore) {
            bestScore = score;
            bestMatch = sizeMeasurement;
        }
    }
    if (!bestMatch) {
        throw new Error('Could not determine size recommendation');
    }
    // Sort by score and get alternatives
    scores.sort((a, b) => b.score - a.score);
    const alternativeSizes = scores
        .slice(1, 4)
        .map(s => s.size.sizeCode)
        .filter(code => code !== bestMatch.sizeCode);
    const confidence = Math.min(100, Math.max(0, bestScore));
    return {
        recommendationId: crypto.randomUUID(),
        category: matrix.category,
        recommendedSize: bestMatch.sizeCode,
        sizeSystem: matrix.sizeSystem,
        confidence,
        alternativeSizes,
        fitProfile: FitProfile.REGULAR,
        measurements: bestMatch,
        notes: generateFitNotes(body, bestMatch, confidence),
    };
}
/**
 * 38. Calculates fit score between body and size measurements.
 *
 * @param {BodyMeasurements} body - Body measurements
 * @param {SizeMeasurement} size - Size measurement
 * @returns {number} Fit score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateFitScore(bodyMeasurements, sizeMeasurement);
 * ```
 */
function calculateFitScore(body, size) {
    let totalScore = 0;
    let measurementCount = 0;
    // Convert body measurements to size measurement unit if needed
    const bodyInSizeUnit = convertBodyMeasurementsUnit(body, size.unit);
    const measurementWeights = {
        chest: 1.0,
        waist: 1.0,
        hips: 0.8,
        inseam: 0.6,
        neck: 0.4,
        sleeve: 0.5,
        shoulder: 0.7,
    };
    for (const [key, weight] of Object.entries(measurementWeights)) {
        const bodyValue = bodyInSizeUnit[key];
        const sizeValue = size.measurements[key];
        if (bodyValue !== undefined && sizeValue !== undefined) {
            // Calculate how close the measurements are
            const difference = Math.abs(bodyValue - sizeValue);
            const tolerance = size.tolerance || sizeValue * 0.05; // 5% default tolerance
            const deviation = difference / tolerance;
            // Score decreases as deviation increases
            const score = Math.max(0, 100 - deviation * 20) * weight;
            totalScore += score;
            measurementCount += weight;
        }
    }
    return measurementCount > 0 ? totalScore / measurementCount : 0;
}
/**
 * 39. Recommends fit profile based on body proportions.
 *
 * @param {BodyMeasurements} body - Body measurements
 * @param {ApparelCategory} category - Apparel category
 * @returns {FitProfile[]} Recommended fit profiles
 *
 * @example
 * ```typescript
 * const profiles = recommendFitProfile(bodyMeasurements, ApparelCategory.MENS_TOPS);
 * console.log('Recommended fits:', profiles);
 * ```
 */
function recommendFitProfile(body, category) {
    const recommendations = [];
    if (!body.chest || !body.waist) {
        return [FitProfile.REGULAR];
    }
    const dropRatio = (body.chest - body.waist) / body.chest;
    // Athletic build (larger drop from chest to waist)
    if (dropRatio > 0.25) {
        recommendations.push(FitProfile.ATHLETIC);
        recommendations.push(FitProfile.SLIM);
    }
    // Proportional build
    else if (dropRatio >= 0.15 && dropRatio <= 0.25) {
        recommendations.push(FitProfile.REGULAR);
        recommendations.push(FitProfile.SLIM);
    }
    // Relaxed build
    else {
        recommendations.push(FitProfile.RELAXED);
        recommendations.push(FitProfile.REGULAR);
    }
    // Consider height for tall/petite
    if (body.height) {
        if (body.gender === Gender.MALE && body.height > 73) {
            recommendations.push(FitProfile.TALL);
        }
        else if (body.gender === Gender.FEMALE && body.height > 68) {
            recommendations.push(FitProfile.TALL);
        }
        else if (body.gender === Gender.FEMALE && body.height < 63) {
            recommendations.push(FitProfile.PETITE);
        }
    }
    return recommendations.slice(0, 3); // Return top 3
}
/**
 * 40. Compares fit across multiple size matrices.
 *
 * @param {BodyMeasurements} body - Body measurements
 * @param {SizeMatrix[]} matrices - Array of size matrices
 * @returns {SizeRecommendation[]} Recommendations for each matrix
 *
 * @example
 * ```typescript
 * const recommendations = compareAcrossMatrices(bodyMeasurements,
 *   [regularMatrix, slimMatrix, relaxedMatrix]);
 * ```
 */
function compareAcrossMatrices(body, matrices) {
    const recommendations = [];
    for (const matrix of matrices) {
        try {
            const recommendation = recommendSize(body, matrix);
            recommendations.push(recommendation);
        }
        catch (error) {
            // Skip matrices that cannot provide recommendations
        }
    }
    // Sort by confidence
    recommendations.sort((a, b) => b.confidence - a.confidence);
    return recommendations;
}
/**
 * 41. Generates fit analysis report.
 *
 * @param {BodyMeasurements} body - Body measurements
 * @param {SizeMatrix} matrix - Size matrix
 * @returns {object} Detailed fit analysis
 *
 * @example
 * ```typescript
 * const analysis = generateFitAnalysis(bodyMeasurements, matrix);
 * console.log(analysis.report);
 * ```
 */
function generateFitAnalysis(body, matrix) {
    const recommendation = recommendSize(body, matrix);
    const fitProfiles = recommendFitProfile(body, matrix.category);
    const sizeMeasurement = matrix.measurements.find(m => m.sizeCode === recommendation.recommendedSize);
    const measurementComparison = {};
    if (sizeMeasurement) {
        const bodyConverted = convertBodyMeasurementsUnit(body, sizeMeasurement.unit);
        for (const key of Object.keys(sizeMeasurement.measurements)) {
            const bodyValue = bodyConverted[key];
            const sizeValue = sizeMeasurement.measurements[key];
            if (bodyValue !== undefined && sizeValue !== undefined) {
                measurementComparison[key] = {
                    body: bodyValue,
                    size: sizeValue,
                    difference: Number((sizeValue - bodyValue).toFixed(2)),
                };
            }
        }
    }
    let report = `Fit Analysis Report\n`;
    report += '='.repeat(50) + '\n\n';
    report += `Recommended Size: ${recommendation.recommendedSize}\n`;
    report += `Confidence: ${recommendation.confidence}%\n`;
    report += `Fit Profiles: ${fitProfiles.join(', ')}\n\n`;
    report += `Measurement Comparison:\n`;
    for (const [key, values] of Object.entries(measurementComparison)) {
        report += `  ${key}: Body ${values.body} vs Size ${values.size} (${values.difference > 0 ? '+' : ''}${values.difference})\n`;
    }
    return {
        recommendation,
        fitProfiles,
        measurementComparison,
        report,
    };
}
/**
 * 42. Predicts size across different brands.
 *
 * @param {string} knownSize - Known size in one brand
 * @param {string} sourceBrand - Source brand
 * @param {string} targetBrand - Target brand
 * @param {ApparelCategory} category - Apparel category
 * @returns {object} Size prediction
 *
 * @example
 * ```typescript
 * const prediction = predictSizeAcrossBrands('M', 'Brand A', 'Brand B',
 *   ApparelCategory.MENS_TOPS);
 * ```
 */
function predictSizeAcrossBrands(knownSize, sourceBrand, targetBrand, category) {
    // This would integrate with brand-specific sizing databases
    // For now, returning basic prediction logic
    const notes = [];
    // Check if brands are known to size differently
    const brandSizingOffset = getBrandSizingOffset(sourceBrand, targetBrand, category);
    let predictedSize = knownSize;
    let confidence = 70; // Base confidence
    if (brandSizingOffset !== 0) {
        const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        const currentIndex = sizeOrder.indexOf(knownSize);
        if (currentIndex !== -1) {
            const newIndex = Math.max(0, Math.min(sizeOrder.length - 1, currentIndex + brandSizingOffset));
            predictedSize = sizeOrder[newIndex];
            confidence = 85;
            if (brandSizingOffset > 0) {
                notes.push(`${targetBrand} tends to run smaller than ${sourceBrand}`);
            }
            else {
                notes.push(`${targetBrand} tends to run larger than ${sourceBrand}`);
            }
        }
    }
    else {
        notes.push('Brands appear to size similarly');
    }
    return {
        predictedSize,
        confidence,
        notes,
    };
}
/**
 * 43. Analyzes size consistency for customer order history.
 *
 * @param {Array<{size: string, category: ApparelCategory, fitRating: number}>} orderHistory - Order history
 * @returns {object} Size consistency analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeSizeConsistency(customerOrderHistory);
 * console.log('Most common size:', analysis.mostCommonSize);
 * ```
 */
function analyzeSizeConsistency(orderHistory) {
    const sizeFrequency = {};
    let totalFitRating = 0;
    for (const order of orderHistory) {
        sizeFrequency[order.size] = (sizeFrequency[order.size] || 0) + 1;
        totalFitRating += order.fitRating;
    }
    const mostCommonSize = Object.entries(sizeFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const averageFitRating = orderHistory.length > 0 ? totalFitRating / orderHistory.length : 0;
    // Calculate consistency (how often they order the same size)
    const uniqueSizes = Object.keys(sizeFrequency).length;
    const consistencyScore = orderHistory.length > 0
        ? ((orderHistory.length - uniqueSizes + 1) / orderHistory.length) * 100
        : 0;
    return {
        mostCommonSize,
        sizeFrequency,
        averageFitRating: Number(averageFitRating.toFixed(2)),
        consistencyScore: Number(consistencyScore.toFixed(2)),
    };
}
/**
 * 44. Generates personalized size recommendation with preferences.
 *
 * @param {BodyMeasurements} body - Body measurements
 * @param {SizeMatrix} matrix - Size matrix
 * @param {object} preferences - Customer preferences
 * @returns {SizeRecommendation} Personalized recommendation
 *
 * @example
 * ```typescript
 * const recommendation = generatePersonalizedRecommendation(
 *   bodyMeasurements,
 *   matrix,
 *   { preferredFit: FitProfile.SLIM, preferLooseFit: false }
 * );
 * ```
 */
function generatePersonalizedRecommendation(body, matrix, preferences) {
    let recommendation = recommendSize(body, matrix);
    // Adjust based on preferences
    if (preferences.preferLooseFit) {
        recommendation = adjustSizeRecommendation(recommendation, matrix, 1);
        recommendation.notes?.push('Adjusted for loose fit preference');
    }
    if (preferences.preferTightFit) {
        recommendation = adjustSizeRecommendation(recommendation, matrix, -1);
        recommendation.notes?.push('Adjusted for tight fit preference');
    }
    if (preferences.preferredFit) {
        recommendation.fitProfile = preferences.preferredFit;
    }
    return recommendation;
}
/**
 * 45. Creates virtual fitting room session.
 *
 * @param {BodyMeasurements} body - Body measurements
 * @param {SizeMatrix[]} matrices - Available size matrices
 * @param {ApparelCategory[]} categories - Categories to try
 * @returns {object} Virtual fitting session
 *
 * @example
 * ```typescript
 * const session = createVirtualFittingSession(
 *   bodyMeasurements,
 *   [topsMatrix, bottomsMatrix, dressesMatrix],
 *   [ApparelCategory.WOMENS_TOPS, ApparelCategory.WOMENS_BOTTOMS]
 * );
 * ```
 */
function createVirtualFittingSession(body, matrices, categories) {
    const sessionId = `VF-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    const recommendations = {};
    for (const category of categories) {
        const categoryMatrices = matrices.filter(m => m.category === category && m.active);
        if (categoryMatrices.length > 0) {
            const categoryRecommendations = compareAcrossMatrices(body, categoryMatrices);
            if (categoryRecommendations.length > 0) {
                recommendations[category] = categoryRecommendations[0];
            }
        }
    }
    const fitProfiles = recommendFitProfile(body, categories[0] || ApparelCategory.UNISEX);
    return {
        sessionId,
        bodyMeasurements: body,
        recommendations: recommendations,
        fitProfiles,
        sessionDate: new Date(),
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates unique matrix ID.
 */
function generateMatrixId() {
    return `MAT-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}
/**
 * Helper: Deduplicates size definitions.
 */
function deduplicateSizes(sizes) {
    const seen = new Set();
    return sizes.filter(size => {
        if (seen.has(size.code)) {
            return false;
        }
        seen.add(size.code);
        return true;
    });
}
/**
 * Helper: Deduplicates conversions.
 */
function deduplicateConversions(conversions) {
    const seen = new Set();
    return conversions.filter(conv => {
        const key = `${conv.sourceSystem}-${conv.targetSystem}-${conv.category}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}
/**
 * Helper: Gets size conversion map.
 */
function getSizeConversionMap(category, gender) {
    // Simplified conversion maps - would be more comprehensive in production
    const womensTopConversions = {
        'US_EU': { 'XS': '32', 'S': '36', 'M': '40', 'L': '44', 'XL': '48', 'XXL': '52' },
        'EU_US': { '32': 'XS', '36': 'S', '40': 'M', '44': 'L', '48': 'XL', '52': 'XXL' },
        'US_UK': { 'XS': '4', 'S': '8', 'M': '12', 'L': '16', 'XL': '20', 'XXL': '24' },
        'UK_US': { '4': 'XS', '8': 'S', '12': 'M', '16': 'L', '20': 'XL', '24': 'XXL' },
    };
    const mensTopConversions = {
        'US_EU': { 'S': '44', 'M': '48', 'L': '52', 'XL': '56', 'XXL': '60' },
        'EU_US': { '44': 'S', '48': 'M', '52': 'L', '56': 'XL', '60': 'XXL' },
        'US_UK': { 'S': 'S', 'M': 'M', 'L': 'L', 'XL': 'XL', 'XXL': 'XXL' },
    };
    if (category.includes('WOMENS')) {
        return womensTopConversions;
    }
    else if (category.includes('MENS')) {
        return mensTopConversions;
    }
    return {};
}
/**
 * Helper: Gets shoe size conversions.
 */
function getShoeSizeConversions(gender) {
    return {
        'US_to_EU': (size) => gender === Gender.MALE ? size + 33 : size + 30.5,
        'EU_to_US': (size) => gender === Gender.MALE ? size - 33 : size - 30.5,
        'US_to_UK': (size) => gender === Gender.MALE ? size - 0.5 : size - 2,
        'UK_to_US': (size) => gender === Gender.MALE ? size + 0.5 : size + 2,
    };
}
/**
 * Helper: Gets standard sizes for category.
 */
function getStandardSizesForCategory(category, system, gender) {
    if (system === SizeSystem.NUMERIC) {
        return ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18'];
    }
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
}
/**
 * Helper: Gets industry standards for category.
 */
function getIndustryStandards(category) {
    return `ASTM D5585 - ${category}`;
}
/**
 * Helper: Formats measurement label.
 */
function formatMeasurementLabel(key) {
    const labels = {
        chest: 'Chest',
        waist: 'Waist',
        hips: 'Hips',
        inseam: 'Inseam',
        neck: 'Neck',
        sleeve: 'Sleeve',
        shoulder: 'Shoulder',
        length: 'Length',
        footLength: 'Foot Length',
        footWidth: 'Foot Width',
    };
    return labels[key] || key;
}
/**
 * Helper: Converts body measurements unit.
 */
function convertBodyMeasurementsUnit(body, targetUnit) {
    if (body.unit === targetUnit) {
        return body;
    }
    const converted = { ...body };
    const measurementFields = [
        'chest', 'waist', 'hips', 'inseam', 'neck', 'sleeve', 'shoulder', 'height', 'footLength', 'footWidth'
    ];
    for (const field of measurementFields) {
        const value = body[field];
        if (typeof value === 'number') {
            converted[field] = convertMeasurementUnit(value, body.unit, targetUnit);
        }
    }
    converted.unit = targetUnit;
    return converted;
}
/**
 * Helper: Generates fit notes.
 */
function generateFitNotes(body, size, confidence) {
    const notes = [];
    if (confidence >= 90) {
        notes.push('Excellent fit expected');
    }
    else if (confidence >= 75) {
        notes.push('Good fit expected');
    }
    else if (confidence >= 60) {
        notes.push('Acceptable fit, consider trying adjacent sizes');
    }
    else {
        notes.push('Fit may vary, recommend trying on');
    }
    return notes;
}
/**
 * Helper: Gets standard measurement ranges.
 */
function getStandardMeasurementRanges(gender, unit) {
    // Simplified ranges - would be more comprehensive in production
    if (unit === MeasurementUnit.INCHES) {
        if (gender === Gender.MALE) {
            return {
                chest: { min: 30, max: 60 },
                waist: { min: 26, max: 50 },
                hips: { min: 30, max: 55 },
                inseam: { min: 28, max: 38 },
            };
        }
        else {
            return {
                chest: { min: 28, max: 50 },
                waist: { min: 22, max: 45 },
                hips: { min: 30, max: 55 },
                inseam: { min: 26, max: 36 },
            };
        }
    }
    // Centimeters
    return {
        chest: { min: 70, max: 150 },
        waist: { min: 55, max: 130 },
        hips: { min: 75, max: 140 },
    };
}
/**
 * Helper: Gets brand sizing offset.
 */
function getBrandSizingOffset(sourceBrand, targetBrand, category) {
    // Simplified - would integrate with brand sizing database
    return 0;
}
/**
 * Helper: Adjusts size recommendation.
 */
function adjustSizeRecommendation(recommendation, matrix, adjustment) {
    const sizes = matrix.sizes.map(s => s.code);
    const currentIndex = sizes.indexOf(recommendation.recommendedSize);
    if (currentIndex === -1) {
        return recommendation;
    }
    const newIndex = Math.max(0, Math.min(sizes.length - 1, currentIndex + adjustment));
    const newSize = sizes[newIndex];
    const newMeasurement = matrix.measurements.find(m => m.sizeCode === newSize);
    return {
        ...recommendation,
        recommendedSize: newSize,
        measurements: newMeasurement || recommendation.measurements,
        confidence: Math.max(0, recommendation.confidence - Math.abs(adjustment) * 10),
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Section 1: Size Matrix Creation & Configuration
    createSizeMatrix,
    addSizeToMatrix,
    addMeasurementToMatrix,
    createStandardWomensTopsMatrix,
    createStandardMensShirtsMatrix,
    createNumericSizeMatrix,
    cloneSizeMatrix,
    mergeSizeMatrices,
    setSizeMatrixActive,
    // Section 2: Size Conversion & Mapping
    convertSize,
    createSizeConversion,
    addConversionToMatrix,
    batchConvertSizes,
    getAllSizeEquivalents,
    convertShoeSize,
    createBidirectionalConversion,
    validateSizeConversion,
    generateConversionChart,
    // Section 3: Size Validation & Verification
    validateSizeCode,
    validateSizeMeasurement,
    validateSizeMatrix,
    isSizeInRange,
    validateSizeProgression,
    validateAgainstIndustryStandards,
    checkSizeOverlap,
    validateSizeAcrossFitProfiles,
    generateSizeValidationReport,
    // Section 4: Measurement Standards
    convertMeasurementUnit,
    createMeasurementFromBody,
    calculateMeasurementTolerances,
    generateMeasurementGuide,
    compareMeasurements,
    calculateGradingIncrements,
    validateMeasurementRange,
    generateSizeGradingScale,
    createMeasurementChart,
    // Section 5: Fit Analysis & Recommendations
    recommendSize,
    calculateFitScore,
    recommendFitProfile,
    compareAcrossMatrices,
    generateFitAnalysis,
    predictSizeAcrossBrands,
    analyzeSizeConsistency,
    generatePersonalizedRecommendation,
    createVirtualFittingSession,
};
//# sourceMappingURL=apparel-size-matrix-kit.js.map