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
/**
 * Size system standards enumeration
 */
export declare enum SizeSystem {
    US = "US",
    UK = "UK",
    EU = "EU",
    ASIA = "ASIA",
    JAPAN = "JAPAN",
    AUSTRALIA = "AUSTRALIA",
    INTERNATIONAL = "INTERNATIONAL",
    NUMERIC = "NUMERIC"
}
/**
 * Apparel category types
 */
export declare enum ApparelCategory {
    WOMENS_TOPS = "WOMENS_TOPS",
    WOMENS_BOTTOMS = "WOMENS_BOTTOMS",
    WOMENS_DRESSES = "WOMENS_DRESSES",
    WOMENS_SHOES = "WOMENS_SHOES",
    MENS_TOPS = "MENS_TOPS",
    MENS_BOTTOMS = "MENS_BOTTOMS",
    MENS_SHOES = "MENS_SHOES",
    MENS_SUITS = "MENS_SUITS",
    CHILDRENS = "CHILDRENS",
    INFANTS = "INFANTS",
    UNISEX = "UNISEX",
    ACCESSORIES = "ACCESSORIES"
}
/**
 * Gender classification for sizing
 */
export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    UNISEX = "UNISEX",
    CHILDREN = "CHILDREN"
}
/**
 * Fit profile types
 */
export declare enum FitProfile {
    SLIM = "SLIM",
    REGULAR = "REGULAR",
    RELAXED = "RELAXED",
    ATHLETIC = "ATHLETIC",
    PLUS = "PLUS",
    PETITE = "PETITE",
    TALL = "TALL",
    BIG = "BIG"
}
/**
 * Measurement units
 */
export declare enum MeasurementUnit {
    INCHES = "INCHES",
    CENTIMETERS = "CENTIMETERS",
    MILLIMETERS = "MILLIMETERS"
}
/**
 * Size range definition
 */
export interface SizeRange {
    rangeId: string;
    name: string;
    minSize: string;
    maxSize: string;
    increment?: number;
    sizeSystem: SizeSystem;
    category: ApparelCategory;
}
/**
 * Size measurement specifications
 */
export interface SizeMeasurement {
    measurementId: string;
    sizeCode: string;
    sizeSystem: SizeSystem;
    category: ApparelCategory;
    measurements: {
        chest?: number;
        waist?: number;
        hips?: number;
        inseam?: number;
        neck?: number;
        sleeve?: number;
        shoulder?: number;
        length?: number;
        footLength?: number;
        footWidth?: number;
    };
    unit: MeasurementUnit;
    tolerance?: number;
}
/**
 * Size conversion mapping
 */
export interface SizeConversion {
    conversionId: string;
    category: ApparelCategory;
    sourceSystem: SizeSystem;
    targetSystem: SizeSystem;
    mappings: Record<string, string>;
    gender?: Gender;
    notes?: string;
}
/**
 * Size matrix configuration
 */
export interface SizeMatrix {
    matrixId: string;
    name: string;
    description?: string;
    category: ApparelCategory;
    gender: Gender;
    sizeSystem: SizeSystem;
    sizes: SizeDefinition[];
    conversions: SizeConversion[];
    measurements: SizeMeasurement[];
    fitProfiles: FitProfile[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Individual size definition
 */
export interface SizeDefinition {
    sizeId: string;
    code: string;
    label: string;
    displayOrder: number;
    numericEquivalent?: number;
    abbreviation?: string;
    metadata?: Record<string, any>;
}
/**
 * Body measurements for size recommendations
 */
export interface BodyMeasurements {
    customerId?: string;
    gender: Gender;
    chest?: number;
    waist?: number;
    hips?: number;
    inseam?: number;
    neck?: number;
    sleeve?: number;
    shoulder?: number;
    height?: number;
    weight?: number;
    footLength?: number;
    footWidth?: number;
    unit: MeasurementUnit;
    measuredAt?: Date;
}
/**
 * Size recommendation result
 */
export interface SizeRecommendation {
    recommendationId: string;
    category: ApparelCategory;
    recommendedSize: string;
    sizeSystem: SizeSystem;
    confidence: number;
    alternativeSizes: string[];
    fitProfile: FitProfile;
    measurements: SizeMeasurement;
    notes?: string[];
}
/**
 * Size chart data structure
 */
export interface SizeChart {
    chartId: string;
    brand?: string;
    category: ApparelCategory;
    gender: Gender;
    sizeSystem: SizeSystem;
    headers: string[];
    rows: SizeChartRow[];
    notes?: string[];
    effectiveDate?: Date;
}
/**
 * Size chart row
 */
export interface SizeChartRow {
    sizeCode: string;
    sizeLabel: string;
    measurements: Record<string, number | string>;
}
/**
 * Size validation result
 */
export interface SizeValidationResult {
    valid: boolean;
    sizeCode: string;
    errors: string[];
    warnings: string[];
    suggestions: string[];
}
/**
 * Size grading rule
 */
export interface SizeGradingRule {
    ruleId: string;
    category: ApparelCategory;
    baseSize: string;
    measurementPoint: string;
    gradeIncrement: number;
    unit: MeasurementUnit;
    direction: 'UP' | 'DOWN';
}
/**
 * Size scale configuration
 */
export interface SizeScale {
    scaleId: string;
    name: string;
    category: ApparelCategory;
    sizeSystem: SizeSystem;
    sizes: string[];
    gradingRules: SizeGradingRule[];
}
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
export declare function createSizeMatrix(config: Partial<SizeMatrix>): SizeMatrix;
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
export declare function addSizeToMatrix(matrix: SizeMatrix, size: Partial<SizeDefinition>): SizeMatrix;
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
export declare function addMeasurementToMatrix(matrix: SizeMatrix, measurement: Partial<SizeMeasurement>): SizeMatrix;
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
export declare function createStandardWomensTopsMatrix(): SizeMatrix;
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
export declare function createStandardMensShirtsMatrix(): SizeMatrix;
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
export declare function createNumericSizeMatrix(minSize: number, maxSize: number, increment: number, category: ApparelCategory): SizeMatrix;
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
export declare function cloneSizeMatrix(matrix: SizeMatrix, overrides?: Partial<SizeMatrix>): SizeMatrix;
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
export declare function mergeSizeMatrices(matrices: SizeMatrix[], name: string): SizeMatrix;
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
export declare function setSizeMatrixActive(matrix: SizeMatrix, active: boolean): SizeMatrix;
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
export declare function convertSize(sizeCode: string, fromSystem: SizeSystem, toSystem: SizeSystem, category: ApparelCategory, gender: Gender): string;
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
export declare function createSizeConversion(category: ApparelCategory, sourceSystem: SizeSystem, targetSystem: SizeSystem, mappings: Record<string, string>, gender?: Gender): SizeConversion;
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
export declare function addConversionToMatrix(matrix: SizeMatrix, conversion: SizeConversion): SizeMatrix;
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
export declare function batchConvertSizes(sizes: string[], fromSystem: SizeSystem, toSystem: SizeSystem, category: ApparelCategory, gender: Gender): Record<string, string>;
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
export declare function getAllSizeEquivalents(sizeCode: string, sourceSystem: SizeSystem, category: ApparelCategory, gender: Gender): Record<SizeSystem, string>;
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
export declare function convertShoeSize(size: number, fromSystem: SizeSystem, toSystem: SizeSystem, gender: Gender): number;
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
export declare function createBidirectionalConversion(category: ApparelCategory, system1: SizeSystem, system2: SizeSystem, mappings: Record<string, string>, gender?: Gender): SizeConversion[];
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
export declare function validateSizeConversion(conversion: SizeConversion, requiredSizes: string[]): {
    complete: boolean;
    missingSizes: string[];
    extraSizes: string[];
};
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
export declare function generateConversionChart(category: ApparelCategory, gender: Gender, systems: SizeSystem[]): SizeChart;
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
export declare function validateSizeCode(sizeCode: string, matrix: SizeMatrix): SizeValidationResult;
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
export declare function validateSizeMeasurement(measurement: SizeMeasurement): SizeValidationResult;
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
export declare function validateSizeMatrix(matrix: SizeMatrix): {
    valid: boolean;
    issues: string[];
    warnings: string[];
};
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
export declare function isSizeInRange(sizeCode: string, range: SizeRange): boolean;
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
export declare function validateSizeProgression(matrix: SizeMatrix): {
    consistent: boolean;
    issues: string[];
    gradingPattern?: string;
};
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
export declare function validateAgainstIndustryStandards(sizeCode: string, measurement: SizeMeasurement, category: ApparelCategory): {
    compliant: boolean;
    deviations: string[];
    standards: string;
};
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
export declare function checkSizeOverlap(matrix1: SizeMatrix, matrix2: SizeMatrix): {
    hasOverlap: boolean;
    overlappingSizes: string[];
    uniqueToMatrix1: string[];
    uniqueToMatrix2: string[];
};
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
export declare function validateSizeAcrossFitProfiles(matrix: SizeMatrix, sizeCode: string): {
    consistent: boolean;
    fitProfiles: FitProfile[];
    variations: string[];
};
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
export declare function generateSizeValidationReport(matrix: SizeMatrix): {
    validationScore: number;
    totalChecks: number;
    passedChecks: number;
    errors: string[];
    warnings: string[];
    recommendations: string[];
};
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
export declare function convertMeasurementUnit(value: number, fromUnit: MeasurementUnit, toUnit: MeasurementUnit): number;
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
export declare function createMeasurementFromBody(body: BodyMeasurements, sizeCode: string, system: SizeSystem, category: ApparelCategory): SizeMeasurement;
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
export declare function calculateMeasurementTolerances(measurement: SizeMeasurement, tolerancePercentage: number): Record<string, {
    min: number;
    max: number;
    nominal: number;
}>;
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
export declare function generateMeasurementGuide(measurement: SizeMeasurement, displayUnit: MeasurementUnit): string;
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
export declare function compareMeasurements(size1: SizeMeasurement, size2: SizeMeasurement): Record<string, number>;
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
export declare function calculateGradingIncrements(measurements: SizeMeasurement[]): SizeGradingRule[];
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
export declare function validateMeasurementRange(value: number, measurementType: string, gender: Gender, unit: MeasurementUnit): {
    valid: boolean;
    inRange: boolean;
    min: number;
    max: number;
    message?: string;
};
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
export declare function generateSizeGradingScale(baseSize: SizeMeasurement, rules: SizeGradingRule[], sizeCount: number): SizeMeasurement[];
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
export declare function createMeasurementChart(measurements: SizeMeasurement[], displayUnit: MeasurementUnit): SizeChart;
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
export declare function recommendSize(body: BodyMeasurements, matrix: SizeMatrix): SizeRecommendation;
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
export declare function calculateFitScore(body: BodyMeasurements, size: SizeMeasurement): number;
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
export declare function recommendFitProfile(body: BodyMeasurements, category: ApparelCategory): FitProfile[];
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
export declare function compareAcrossMatrices(body: BodyMeasurements, matrices: SizeMatrix[]): SizeRecommendation[];
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
export declare function generateFitAnalysis(body: BodyMeasurements, matrix: SizeMatrix): {
    recommendation: SizeRecommendation;
    fitProfiles: FitProfile[];
    measurementComparison: Record<string, {
        body: number;
        size: number;
        difference: number;
    }>;
    report: string;
};
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
export declare function predictSizeAcrossBrands(knownSize: string, sourceBrand: string, targetBrand: string, category: ApparelCategory): {
    predictedSize: string;
    confidence: number;
    notes: string[];
};
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
export declare function analyzeSizeConsistency(orderHistory: Array<{
    size: string;
    category: ApparelCategory;
    fitRating: number;
}>): {
    mostCommonSize: string;
    sizeFrequency: Record<string, number>;
    averageFitRating: number;
    consistencyScore: number;
};
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
export declare function generatePersonalizedRecommendation(body: BodyMeasurements, matrix: SizeMatrix, preferences: {
    preferredFit?: FitProfile;
    preferLooseFit?: boolean;
    preferTightFit?: boolean;
    lengthPreference?: 'short' | 'regular' | 'long';
}): SizeRecommendation;
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
export declare function createVirtualFittingSession(body: BodyMeasurements, matrices: SizeMatrix[], categories: ApparelCategory[]): {
    sessionId: string;
    bodyMeasurements: BodyMeasurements;
    recommendations: Record<ApparelCategory, SizeRecommendation>;
    fitProfiles: FitProfile[];
    sessionDate: Date;
};
declare const _default: {
    createSizeMatrix: typeof createSizeMatrix;
    addSizeToMatrix: typeof addSizeToMatrix;
    addMeasurementToMatrix: typeof addMeasurementToMatrix;
    createStandardWomensTopsMatrix: typeof createStandardWomensTopsMatrix;
    createStandardMensShirtsMatrix: typeof createStandardMensShirtsMatrix;
    createNumericSizeMatrix: typeof createNumericSizeMatrix;
    cloneSizeMatrix: typeof cloneSizeMatrix;
    mergeSizeMatrices: typeof mergeSizeMatrices;
    setSizeMatrixActive: typeof setSizeMatrixActive;
    convertSize: typeof convertSize;
    createSizeConversion: typeof createSizeConversion;
    addConversionToMatrix: typeof addConversionToMatrix;
    batchConvertSizes: typeof batchConvertSizes;
    getAllSizeEquivalents: typeof getAllSizeEquivalents;
    convertShoeSize: typeof convertShoeSize;
    createBidirectionalConversion: typeof createBidirectionalConversion;
    validateSizeConversion: typeof validateSizeConversion;
    generateConversionChart: typeof generateConversionChart;
    validateSizeCode: typeof validateSizeCode;
    validateSizeMeasurement: typeof validateSizeMeasurement;
    validateSizeMatrix: typeof validateSizeMatrix;
    isSizeInRange: typeof isSizeInRange;
    validateSizeProgression: typeof validateSizeProgression;
    validateAgainstIndustryStandards: typeof validateAgainstIndustryStandards;
    checkSizeOverlap: typeof checkSizeOverlap;
    validateSizeAcrossFitProfiles: typeof validateSizeAcrossFitProfiles;
    generateSizeValidationReport: typeof generateSizeValidationReport;
    convertMeasurementUnit: typeof convertMeasurementUnit;
    createMeasurementFromBody: typeof createMeasurementFromBody;
    calculateMeasurementTolerances: typeof calculateMeasurementTolerances;
    generateMeasurementGuide: typeof generateMeasurementGuide;
    compareMeasurements: typeof compareMeasurements;
    calculateGradingIncrements: typeof calculateGradingIncrements;
    validateMeasurementRange: typeof validateMeasurementRange;
    generateSizeGradingScale: typeof generateSizeGradingScale;
    createMeasurementChart: typeof createMeasurementChart;
    recommendSize: typeof recommendSize;
    calculateFitScore: typeof calculateFitScore;
    recommendFitProfile: typeof recommendFitProfile;
    compareAcrossMatrices: typeof compareAcrossMatrices;
    generateFitAnalysis: typeof generateFitAnalysis;
    predictSizeAcrossBrands: typeof predictSizeAcrossBrands;
    analyzeSizeConsistency: typeof analyzeSizeConsistency;
    generatePersonalizedRecommendation: typeof generatePersonalizedRecommendation;
    createVirtualFittingSession: typeof createVirtualFittingSession;
};
export default _default;
//# sourceMappingURL=apparel-size-matrix-kit.d.ts.map