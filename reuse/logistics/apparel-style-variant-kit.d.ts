/**
 * LOC: APL-STY-001
 * File: /reuse/logistics/apparel-style-variant-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Apparel controllers
 *   - Product services
 *   - Inventory management
 *   - E-commerce platforms
 */
/**
 * Style status enumeration
 */
export declare enum StyleStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    SEASONAL = "SEASONAL",
    DISCONTINUED = "DISCONTINUED",
    ARCHIVED = "ARCHIVED",
    PENDING_APPROVAL = "PENDING_APPROVAL"
}
/**
 * Season enumeration
 */
export declare enum Season {
    SPRING = "SPRING",
    SUMMER = "SUMMER",
    FALL = "FALL",
    WINTER = "WINTER",
    PRE_SPRING = "PRE_SPRING",
    PRE_FALL = "PRE_FALL",
    RESORT = "RESORT",
    HOLIDAY = "HOLIDAY"
}
/**
 * Gender category
 */
export declare enum Gender {
    MENS = "MENS",
    WOMENS = "WOMENS",
    UNISEX = "UNISEX",
    BOYS = "BOYS",
    GIRLS = "GIRLS",
    INFANT = "INFANT"
}
/**
 * Size system types
 */
export declare enum SizeSystem {
    US = "US",
    UK = "UK",
    EU = "EU",
    ALPHA = "ALPHA",// XS, S, M, L, XL
    NUMERIC = "NUMERIC",// 0, 2, 4, 6, 8
    INCHES = "INCHES",// Waist/Length
    CM = "CM"
}
/**
 * Pattern types
 */
export declare enum PatternType {
    SOLID = "SOLID",
    STRIPE = "STRIPE",
    PLAID = "PLAID",
    CHECK = "CHECK",
    FLORAL = "FLORAL",
    GEOMETRIC = "GEOMETRIC",
    ANIMAL_PRINT = "ANIMAL_PRINT",
    PAISLEY = "PAISLEY",
    POLKA_DOT = "POLKA_DOT",
    ABSTRACT = "ABSTRACT",
    CAMOUFLAGE = "CAMOUFLAGE",
    TIE_DYE = "TIE_DYE"
}
/**
 * Material composition type
 */
export interface MaterialComposition {
    fiber: string;
    percentage: number;
    origin?: string;
    certification?: string[];
}
/**
 * Color definition
 */
export interface ColorDefinition {
    colorId: string;
    colorCode: string;
    colorName: string;
    hexValue: string;
    pantoneCode?: string;
    colorFamily: string;
    isCore: boolean;
    seasonalAvailability?: Season[];
    metadata?: Record<string, any>;
}
/**
 * Size specification
 */
export interface SizeSpec {
    sizeId: string;
    sizeCode: string;
    sizeName: string;
    sizeSystem: SizeSystem;
    sortOrder: number;
    measurements?: Record<string, number>;
    equivalents?: Partial<Record<SizeSystem, string>>;
}
/**
 * Style hierarchy level
 */
export interface StyleHierarchy {
    level: number;
    code: string;
    name: string;
    parentCode?: string;
    description?: string;
}
/**
 * Apparel style definition
 */
export interface ApparelStyle {
    styleId: string;
    styleNumber: string;
    styleName: string;
    description: string;
    status: StyleStatus;
    hierarchy: StyleHierarchy[];
    category: string;
    subcategory: string;
    gender: Gender;
    season: Season;
    year: number;
    basePrice: number;
    costPrice: number;
    colors: ColorDefinition[];
    sizes: SizeSpec[];
    materials: MaterialComposition[];
    patterns: PatternType[];
    attributes: Record<string, any>;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    metadata?: Record<string, any>;
}
/**
 * Style variant (specific color/size combination)
 */
export interface StyleVariant {
    variantId: string;
    sku: string;
    styleId: string;
    styleNumber: string;
    colorId: string;
    colorCode: string;
    colorName: string;
    sizeId: string;
    sizeCode: string;
    sizeName: string;
    upc?: string;
    ean?: string;
    price: number;
    compareAtPrice?: number;
    cost: number;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: string;
    };
    images: string[];
    inventoryTracking: boolean;
    stockLevel?: number;
    reorderPoint?: number;
    reorderQuantity?: number;
    isActive: boolean;
    metadata?: Record<string, any>;
}
/**
 * Collection definition
 */
export interface ApparelCollection {
    collectionId: string;
    collectionCode: string;
    collectionName: string;
    description: string;
    season: Season;
    year: number;
    launchDate: Date;
    endDate?: Date;
    styles: string[];
    theme?: string;
    targetMarket?: string[];
    priceRange: {
        min: number;
        max: number;
    };
    status: StyleStatus;
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Variant generation configuration
 */
export interface VariantGenerationConfig {
    styleId: string;
    generateSKU: boolean;
    generateUPC: boolean;
    priceModifiers?: {
        colorSurcharge?: Record<string, number>;
        sizeSurcharge?: Record<string, number>;
    };
    stockDefaults?: {
        reorderPoint: number;
        reorderQuantity: number;
    };
    imageTemplates?: Record<string, string>;
}
/**
 * SKU generation configuration
 */
export interface SKUConfig {
    prefix?: string;
    includeStyle: boolean;
    includeColor: boolean;
    includeSize: boolean;
    separator: string;
    suffix?: string;
    checkDigit?: boolean;
}
/**
 * Size matrix (for size run planning)
 */
export interface SizeMatrix {
    matrixId: string;
    name: string;
    gender: Gender;
    category: string;
    sizes: SizeSpec[];
    ratios?: Record<string, number>;
    description?: string;
}
/**
 * Color palette
 */
export interface ColorPalette {
    paletteId: string;
    paletteName: string;
    season: Season;
    year: number;
    colors: ColorDefinition[];
    theme?: string;
    isPrimary: boolean;
}
/**
 * Material specification
 */
export interface MaterialSpec {
    materialId: string;
    materialCode: string;
    materialName: string;
    composition: MaterialComposition[];
    weight?: number;
    weightUnit?: string;
    careInstructions: string[];
    certifications?: string[];
    supplier?: string;
    cost?: number;
    leadTime?: number;
}
/**
 * Attribute mapping
 */
export interface AttributeMapping {
    attributeKey: string;
    attributeValue: string;
    displayName: string;
    sortOrder?: number;
    isFilterable: boolean;
    isSearchable: boolean;
}
/**
 * 1. Creates a new apparel style with complete hierarchy.
 *
 * @param {Partial<ApparelStyle>} styleData - Style definition data
 * @returns {ApparelStyle} New apparel style
 *
 * @example
 * ```typescript
 * const style = createApparelStyle({
 *   styleName: 'Classic Polo Shirt',
 *   category: 'Tops',
 *   subcategory: 'Polo Shirts',
 *   gender: Gender.MENS,
 *   season: Season.SPRING,
 *   year: 2024,
 *   basePrice: 49.99,
 *   costPrice: 22.50
 * });
 * ```
 */
export declare function createApparelStyle(styleData: Partial<ApparelStyle>): ApparelStyle;
/**
 * 2. Generates style hierarchy from category structure.
 *
 * @param {string} division - Division code (e.g., 'MENS', 'WOMENS')
 * @param {string} department - Department code (e.g., 'APPAREL')
 * @param {string} category - Category code (e.g., 'TOPS')
 * @param {string} subcategory - Subcategory code (e.g., 'POLO')
 * @returns {StyleHierarchy[]} Style hierarchy array
 *
 * @example
 * ```typescript
 * const hierarchy = generateStyleHierarchy('MENS', 'APPAREL', 'TOPS', 'POLO');
 * // Returns: [
 * //   { level: 1, code: 'MENS', name: 'Mens', parentCode: undefined },
 * //   { level: 2, code: 'APPAREL', name: 'Apparel', parentCode: 'MENS' },
 * //   { level: 3, code: 'TOPS', name: 'Tops', parentCode: 'APPAREL' },
 * //   { level: 4, code: 'POLO', name: 'Polo Shirts', parentCode: 'TOPS' }
 * // ]
 * ```
 */
export declare function generateStyleHierarchy(division: string, department: string, category: string, subcategory: string): StyleHierarchy[];
/**
 * 3. Updates style status with validation.
 *
 * @param {ApparelStyle} style - Style to update
 * @param {StyleStatus} newStatus - New status
 * @param {string} updatedBy - User ID
 * @returns {ApparelStyle} Updated style
 *
 * @example
 * ```typescript
 * const updated = updateStyleStatus(style, StyleStatus.ACTIVE, 'USER-123');
 * ```
 */
export declare function updateStyleStatus(style: ApparelStyle, newStatus: StyleStatus, updatedBy: string): ApparelStyle;
/**
 * 4. Adds colors to style definition.
 *
 * @param {ApparelStyle} style - Style to update
 * @param {ColorDefinition[]} colors - Colors to add
 * @returns {ApparelStyle} Updated style
 *
 * @example
 * ```typescript
 * const updated = addColorsToStyle(style, [
 *   {
 *     colorId: 'CLR-001',
 *     colorCode: 'NVY',
 *     colorName: 'Navy Blue',
 *     hexValue: '#000080',
 *     pantoneCode: '19-4052',
 *     colorFamily: 'Blue',
 *     isCore: true
 *   }
 * ]);
 * ```
 */
export declare function addColorsToStyle(style: ApparelStyle, colors: ColorDefinition[]): ApparelStyle;
/**
 * 5. Adds sizes to style definition.
 *
 * @param {ApparelStyle} style - Style to update
 * @param {SizeSpec[]} sizes - Sizes to add
 * @returns {ApparelStyle} Updated style
 *
 * @example
 * ```typescript
 * const updated = addSizesToStyle(style, [
 *   {
 *     sizeId: 'SZ-S',
 *     sizeCode: 'S',
 *     sizeName: 'Small',
 *     sizeSystem: SizeSystem.ALPHA,
 *     sortOrder: 2
 *   }
 * ]);
 * ```
 */
export declare function addSizesToStyle(style: ApparelStyle, sizes: SizeSpec[]): ApparelStyle;
/**
 * 6. Clones style with new season/year.
 *
 * @param {ApparelStyle} originalStyle - Original style to clone
 * @param {Season} newSeason - New season
 * @param {number} newYear - New year
 * @returns {ApparelStyle} Cloned style
 *
 * @example
 * ```typescript
 * const fallStyle = cloneStyleForNewSeason(springStyle, Season.FALL, 2024);
 * ```
 */
export declare function cloneStyleForNewSeason(originalStyle: ApparelStyle, newSeason: Season, newYear: number): ApparelStyle;
/**
 * 7. Validates style definition completeness.
 *
 * @param {ApparelStyle} style - Style to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateStyleDefinition(style);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare function validateStyleDefinition(style: ApparelStyle): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 8. Searches styles by criteria.
 *
 * @param {ApparelStyle[]} styles - All styles
 * @param {object} criteria - Search criteria
 * @returns {ApparelStyle[]} Matching styles
 *
 * @example
 * ```typescript
 * const results = searchStyles(allStyles, {
 *   gender: Gender.MENS,
 *   season: Season.SPRING,
 *   status: StyleStatus.ACTIVE,
 *   minPrice: 30,
 *   maxPrice: 100
 * });
 * ```
 */
export declare function searchStyles(styles: ApparelStyle[], criteria: {
    gender?: Gender;
    season?: Season;
    year?: number;
    category?: string;
    status?: StyleStatus;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
}): ApparelStyle[];
/**
 * 9. Creates a color definition with standards.
 *
 * @param {Partial<ColorDefinition>} colorData - Color data
 * @returns {ColorDefinition} Complete color definition
 *
 * @example
 * ```typescript
 * const color = createColorDefinition({
 *   colorCode: 'NVY',
 *   colorName: 'Navy Blue',
 *   hexValue: '#000080',
 *   pantoneCode: '19-4052',
 *   colorFamily: 'Blue',
 *   isCore: true
 * });
 * ```
 */
export declare function createColorDefinition(colorData: Partial<ColorDefinition>): ColorDefinition;
/**
 * 10. Creates a color palette for a season.
 *
 * @param {Partial<ColorPalette>} paletteData - Palette data
 * @returns {ColorPalette} Complete color palette
 *
 * @example
 * ```typescript
 * const palette = createColorPalette({
 *   paletteName: 'Spring 2024 Core',
 *   season: Season.SPRING,
 *   year: 2024,
 *   colors: [navyColor, whiteColor, khakiColor],
 *   isPrimary: true
 * });
 * ```
 */
export declare function createColorPalette(paletteData: Partial<ColorPalette>): ColorPalette;
/**
 * 11. Determines color family from hex value.
 *
 * @param {string} hexValue - Hex color value
 * @returns {string} Color family name
 *
 * @example
 * ```typescript
 * const family = determineColorFamily('#FF0000');
 * // Returns: 'Red'
 * ```
 */
export declare function determineColorFamily(hexValue: string): string;
/**
 * 12. Finds complementary colors.
 *
 * @param {ColorDefinition} baseColor - Base color
 * @param {ColorDefinition[]} availableColors - Available color pool
 * @returns {ColorDefinition[]} Complementary colors
 *
 * @example
 * ```typescript
 * const complements = findComplementaryColors(navyBlue, allColors);
 * ```
 */
export declare function findComplementaryColors(baseColor: ColorDefinition, availableColors: ColorDefinition[]): ColorDefinition[];
/**
 * 13. Applies pattern to style.
 *
 * @param {ApparelStyle} style - Style to update
 * @param {PatternType[]} patterns - Patterns to add
 * @returns {ApparelStyle} Updated style
 *
 * @example
 * ```typescript
 * const updated = addPatternToStyle(style, [PatternType.STRIPE, PatternType.CHECK]);
 * ```
 */
export declare function addPatternToStyle(style: ApparelStyle, patterns: PatternType[]): ApparelStyle;
/**
 * 14. Generates color code from color name.
 *
 * @param {string} colorName - Color name
 * @returns {string} 3-letter color code
 *
 * @example
 * ```typescript
 * const code = generateColorCode('Navy Blue');
 * // Returns: 'NVY'
 * ```
 */
export declare function generateColorCode(colorName: string): string;
/**
 * 15. Validates color palette for season.
 *
 * @param {ColorPalette} palette - Color palette to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateColorPalette(springPalette);
 * ```
 */
export declare function validateColorPalette(palette: ColorPalette): {
    valid: boolean;
    errors: string[];
    suggestions: string[];
};
/**
 * 16. Groups colors by color family.
 *
 * @param {ColorDefinition[]} colors - Colors to group
 * @returns {Record<string, ColorDefinition[]>} Colors grouped by family
 *
 * @example
 * ```typescript
 * const grouped = groupColorsByFamily(allColors);
 * // Returns: { Blue: [...], Red: [...], Green: [...] }
 * ```
 */
export declare function groupColorsByFamily(colors: ColorDefinition[]): Record<string, ColorDefinition[]>;
/**
 * 17. Converts hex color to RGB.
 *
 * @param {string} hex - Hex color value
 * @returns {object | null} RGB values or null if invalid
 *
 * @example
 * ```typescript
 * const rgb = hexToRgb('#FF5733');
 * // Returns: { r: 255, g: 87, b: 51 }
 * ```
 */
export declare function hexToRgb(hex: string): {
    r: number;
    g: number;
    b: number;
} | null;
/**
 * 18. Creates material specification.
 *
 * @param {Partial<MaterialSpec>} materialData - Material data
 * @returns {MaterialSpec} Complete material specification
 *
 * @example
 * ```typescript
 * const material = createMaterialSpec({
 *   materialName: '100% Cotton Jersey',
 *   composition: [{ fiber: 'Cotton', percentage: 100 }],
 *   weight: 180,
 *   weightUnit: 'GSM',
 *   careInstructions: ['Machine wash cold', 'Tumble dry low']
 * });
 * ```
 */
export declare function createMaterialSpec(materialData: Partial<MaterialSpec>): MaterialSpec;
/**
 * 19. Validates material composition totals 100%.
 *
 * @param {MaterialComposition[]} composition - Material composition
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateMaterialComposition([
 *   { fiber: 'Cotton', percentage: 60 },
 *   { fiber: 'Polyester', percentage: 40 }
 * ]);
 * ```
 */
export declare function validateMaterialComposition(composition: MaterialComposition[]): {
    valid: boolean;
    total: number;
    error?: string;
};
/**
 * 20. Adds materials to style.
 *
 * @param {ApparelStyle} style - Style to update
 * @param {MaterialComposition[]} materials - Materials to add
 * @returns {ApparelStyle} Updated style
 *
 * @example
 * ```typescript
 * const updated = addMaterialsToStyle(style, [
 *   { fiber: 'Cotton', percentage: 95 },
 *   { fiber: 'Elastane', percentage: 5 }
 * ]);
 * ```
 */
export declare function addMaterialsToStyle(style: ApparelStyle, materials: MaterialComposition[]): ApparelStyle;
/**
 * 21. Generates care instructions from materials.
 *
 * @param {MaterialComposition[]} composition - Material composition
 * @returns {string[]} Care instructions
 *
 * @example
 * ```typescript
 * const care = generateCareInstructions([
 *   { fiber: 'Wool', percentage: 100 }
 * ]);
 * // Returns: ['Dry clean only', 'Do not bleach', 'Lay flat to dry']
 * ```
 */
export declare function generateCareInstructions(composition: MaterialComposition[]): string[];
/**
 * 22. Calculates fabric cost per garment.
 *
 * @param {MaterialSpec} material - Material specification
 * @param {number} yardagePerGarment - Yards of fabric needed
 * @returns {number} Cost per garment
 *
 * @example
 * ```typescript
 * const cost = calculateFabricCost(material, 2.5);
 * // Returns: 11.25 (if material cost is $4.50 per yard)
 * ```
 */
export declare function calculateFabricCost(material: MaterialSpec, yardagePerGarment: number): number;
/**
 * 23. Finds sustainable material alternatives.
 *
 * @param {MaterialSpec} currentMaterial - Current material
 * @param {MaterialSpec[]} availableMaterials - Available materials
 * @returns {MaterialSpec[]} Sustainable alternatives
 *
 * @example
 * ```typescript
 * const alternatives = findSustainableMaterialAlternatives(
 *   currentMaterial,
 *   allMaterials
 * );
 * ```
 */
export declare function findSustainableMaterialAlternatives(currentMaterial: MaterialSpec, availableMaterials: MaterialSpec[]): MaterialSpec[];
/**
 * 24. Generates material code from name.
 *
 * @param {string} materialName - Material name
 * @returns {string} Material code
 *
 * @example
 * ```typescript
 * const code = generateMaterialCode('100% Organic Cotton Jersey');
 * // Returns: 'OCJ'
 * ```
 */
export declare function generateMaterialCode(materialName: string): string;
/**
 * 25. Compares materials by sustainability score.
 *
 * @param {MaterialSpec} material1 - First material
 * @param {MaterialSpec} material2 - Second material
 * @returns {number} Comparison score (-1, 0, 1)
 *
 * @example
 * ```typescript
 * const comparison = compareMaterialSustainability(organicCotton, polyester);
 * // Returns: 1 (organic cotton is more sustainable)
 * ```
 */
export declare function compareMaterialSustainability(material1: MaterialSpec, material2: MaterialSpec): number;
/**
 * 26. Generates all variants for a style (color x size matrix).
 *
 * @param {ApparelStyle} style - Style definition
 * @param {VariantGenerationConfig} config - Generation configuration
 * @returns {StyleVariant[]} Generated variants
 *
 * @example
 * ```typescript
 * const variants = generateStyleVariants(style, {
 *   styleId: style.styleId,
 *   generateSKU: true,
 *   generateUPC: true
 * });
 * ```
 */
export declare function generateStyleVariants(style: ApparelStyle, config: VariantGenerationConfig): StyleVariant[];
/**
 * 27. Generates SKU from style, color, and size.
 *
 * @param {string} styleNumber - Style number
 * @param {string} colorCode - Color code
 * @param {string} sizeCode - Size code
 * @param {SKUConfig} config - SKU configuration
 * @returns {string} Generated SKU
 *
 * @example
 * ```typescript
 * const sku = generateSKU('PS1000', 'NVY', 'M');
 * // Returns: 'PS1000-NVY-M'
 * ```
 */
export declare function generateSKU(styleNumber: string, colorCode: string, sizeCode: string, config?: SKUConfig): string;
/**
 * 28. Parses SKU into components.
 *
 * @param {string} sku - SKU to parse
 * @param {SKUConfig} config - SKU configuration
 * @returns {object} Parsed SKU components
 *
 * @example
 * ```typescript
 * const parsed = parseSKU('PS1000-NVY-M');
 * // Returns: { styleNumber: 'PS1000', colorCode: 'NVY', sizeCode: 'M' }
 * ```
 */
export declare function parseSKU(sku: string, config?: SKUConfig): {
    styleNumber?: string;
    colorCode?: string;
    sizeCode?: string;
};
/**
 * 29. Generates UPC barcode.
 *
 * @returns {string} 12-digit UPC
 *
 * @example
 * ```typescript
 * const upc = generateUPC();
 * // Returns: '012345678905'
 * ```
 */
export declare function generateUPC(): string;
/**
 * 30. Validates UPC check digit.
 *
 * @param {string} upc - UPC to validate
 * @returns {boolean} Valid UPC
 *
 * @example
 * ```typescript
 * const isValid = validateUPC('012345678905');
 * ```
 */
export declare function validateUPC(upc: string): boolean;
/**
 * 31. Filters variants by criteria.
 *
 * @param {StyleVariant[]} variants - All variants
 * @param {object} criteria - Filter criteria
 * @returns {StyleVariant[]} Filtered variants
 *
 * @example
 * ```typescript
 * const filtered = filterVariants(allVariants, {
 *   colorCode: 'NVY',
 *   minPrice: 30,
 *   maxPrice: 60,
 *   isActive: true
 * });
 * ```
 */
export declare function filterVariants(variants: StyleVariant[], criteria: {
    colorCode?: string;
    sizeCode?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
    inStock?: boolean;
}): StyleVariant[];
/**
 * 32. Updates variant pricing.
 *
 * @param {StyleVariant} variant - Variant to update
 * @param {number} newPrice - New price
 * @param {number} compareAtPrice - Compare at price (MSRP)
 * @returns {StyleVariant} Updated variant
 *
 * @example
 * ```typescript
 * const updated = updateVariantPrice(variant, 44.99, 59.99);
 * ```
 */
export declare function updateVariantPrice(variant: StyleVariant, newPrice: number, compareAtPrice?: number): StyleVariant;
/**
 * 33. Calculates variant margin.
 *
 * @param {StyleVariant} variant - Variant
 * @returns {object} Margin analysis
 *
 * @example
 * ```typescript
 * const margin = calculateVariantMargin(variant);
 * // Returns: { grossMargin: 25.50, marginPercentage: 51 }
 * ```
 */
export declare function calculateVariantMargin(variant: StyleVariant): {
    grossMargin: number;
    marginPercentage: number;
    markup: number;
};
/**
 * 34. Generates size run from size matrix.
 *
 * @param {SizeMatrix} matrix - Size matrix
 * @param {number} totalQuantity - Total quantity to distribute
 * @returns {Record<string, number>} Size run quantities
 *
 * @example
 * ```typescript
 * const run = generateSizeRun(sizeMatrix, 120);
 * // Returns: { XS: 12, S: 24, M: 36, L: 30, XL: 18 }
 * ```
 */
export declare function generateSizeRun(matrix: SizeMatrix, totalQuantity: number): Record<string, number>;
/**
 * 35. Creates a new apparel collection.
 *
 * @param {Partial<ApparelCollection>} collectionData - Collection data
 * @returns {ApparelCollection} New collection
 *
 * @example
 * ```typescript
 * const collection = createCollection({
 *   collectionName: 'Spring Essentials 2024',
 *   season: Season.SPRING,
 *   year: 2024,
 *   launchDate: new Date('2024-02-01'),
 *   styles: ['STY-001', 'STY-002', 'STY-003']
 * });
 * ```
 */
export declare function createCollection(collectionData: Partial<ApparelCollection>): ApparelCollection;
/**
 * 36. Adds styles to collection.
 *
 * @param {ApparelCollection} collection - Collection to update
 * @param {string[]} styleIds - Style IDs to add
 * @returns {ApparelCollection} Updated collection
 *
 * @example
 * ```typescript
 * const updated = addStylesToCollection(collection, ['STY-004', 'STY-005']);
 * ```
 */
export declare function addStylesToCollection(collection: ApparelCollection, styleIds: string[]): ApparelCollection;
/**
 * 37. Removes styles from collection.
 *
 * @param {ApparelCollection} collection - Collection to update
 * @param {string[]} styleIds - Style IDs to remove
 * @returns {ApparelCollection} Updated collection
 *
 * @example
 * ```typescript
 * const updated = removeStylesFromCollection(collection, ['STY-001']);
 * ```
 */
export declare function removeStylesFromCollection(collection: ApparelCollection, styleIds: string[]): ApparelCollection;
/**
 * 38. Calculates collection statistics.
 *
 * @param {ApparelCollection} collection - Collection
 * @param {ApparelStyle[]} styles - All styles in collection
 * @returns {object} Collection statistics
 *
 * @example
 * ```typescript
 * const stats = calculateCollectionStats(collection, collectionStyles);
 * ```
 */
export declare function calculateCollectionStats(collection: ApparelCollection, styles: ApparelStyle[]): {
    totalStyles: number;
    totalVariants: number;
    averagePrice: number;
    priceRange: {
        min: number;
        max: number;
    };
    colorCount: number;
    sizeCount: number;
    genderBreakdown: Record<Gender, number>;
    categoryBreakdown: Record<string, number>;
};
/**
 * 39. Generates collection code.
 *
 * @param {string} collectionName - Collection name
 * @param {Season} season - Season
 * @param {number} year - Year
 * @returns {string} Collection code
 *
 * @example
 * ```typescript
 * const code = generateCollectionCode('Spring Essentials', Season.SPRING, 2024);
 * // Returns: 'SPESS-SP24'
 * ```
 */
export declare function generateCollectionCode(collectionName: string, season?: Season, year?: number): string;
/**
 * 40. Validates collection for launch.
 *
 * @param {ApparelCollection} collection - Collection to validate
 * @param {ApparelStyle[]} styles - All styles
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCollectionForLaunch(collection, allStyles);
 * ```
 */
export declare function validateCollectionForLaunch(collection: ApparelCollection, styles: ApparelStyle[]): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 41. Exports collection to catalog format.
 *
 * @param {ApparelCollection} collection - Collection
 * @param {ApparelStyle[]} styles - Collection styles
 * @param {StyleVariant[]} variants - All variants
 * @returns {object} Catalog export
 *
 * @example
 * ```typescript
 * const catalog = exportCollectionToCatalog(collection, styles, variants);
 * ```
 */
export declare function exportCollectionToCatalog(collection: ApparelCollection, styles: ApparelStyle[], variants: StyleVariant[]): {
    collection: ApparelCollection;
    styles: Array<{
        style: ApparelStyle;
        variants: StyleVariant[];
        variantCount: number;
    }>;
    summary: {
        totalStyles: number;
        totalVariants: number;
        priceRange: {
            min: number;
            max: number;
        };
    };
};
/**
 * 42. Generates collection lookbook data.
 *
 * @param {ApparelCollection} collection - Collection
 * @param {ApparelStyle[]} styles - Collection styles
 * @returns {object} Lookbook data
 *
 * @example
 * ```typescript
 * const lookbook = generateCollectionLookbook(collection, styles);
 * ```
 */
export declare function generateCollectionLookbook(collection: ApparelCollection, styles: ApparelStyle[]): {
    collectionInfo: {
        name: string;
        season: string;
        year: number;
        theme?: string;
        description: string;
    };
    stylesByCategory: Record<string, ApparelStyle[]>;
    colorPalette: {
        family: string;
        colors: ColorDefinition[];
    }[];
    pricePoints: {
        entry: number;
        mid: number;
        premium: number;
    };
};
declare const _default: {
    createApparelStyle: typeof createApparelStyle;
    generateStyleHierarchy: typeof generateStyleHierarchy;
    updateStyleStatus: typeof updateStyleStatus;
    addColorsToStyle: typeof addColorsToStyle;
    addSizesToStyle: typeof addSizesToStyle;
    cloneStyleForNewSeason: typeof cloneStyleForNewSeason;
    validateStyleDefinition: typeof validateStyleDefinition;
    searchStyles: typeof searchStyles;
    createColorDefinition: typeof createColorDefinition;
    createColorPalette: typeof createColorPalette;
    determineColorFamily: typeof determineColorFamily;
    findComplementaryColors: typeof findComplementaryColors;
    addPatternToStyle: typeof addPatternToStyle;
    generateColorCode: typeof generateColorCode;
    validateColorPalette: typeof validateColorPalette;
    groupColorsByFamily: typeof groupColorsByFamily;
    hexToRgb: typeof hexToRgb;
    createMaterialSpec: typeof createMaterialSpec;
    validateMaterialComposition: typeof validateMaterialComposition;
    addMaterialsToStyle: typeof addMaterialsToStyle;
    generateCareInstructions: typeof generateCareInstructions;
    calculateFabricCost: typeof calculateFabricCost;
    findSustainableMaterialAlternatives: typeof findSustainableMaterialAlternatives;
    generateMaterialCode: typeof generateMaterialCode;
    compareMaterialSustainability: typeof compareMaterialSustainability;
    generateStyleVariants: typeof generateStyleVariants;
    generateSKU: typeof generateSKU;
    parseSKU: typeof parseSKU;
    generateUPC: typeof generateUPC;
    validateUPC: typeof validateUPC;
    filterVariants: typeof filterVariants;
    updateVariantPrice: typeof updateVariantPrice;
    calculateVariantMargin: typeof calculateVariantMargin;
    generateSizeRun: typeof generateSizeRun;
    createCollection: typeof createCollection;
    addStylesToCollection: typeof addStylesToCollection;
    removeStylesFromCollection: typeof removeStylesFromCollection;
    calculateCollectionStats: typeof calculateCollectionStats;
    generateCollectionCode: typeof generateCollectionCode;
    validateCollectionForLaunch: typeof validateCollectionForLaunch;
    exportCollectionToCatalog: typeof exportCollectionToCatalog;
    generateCollectionLookbook: typeof generateCollectionLookbook;
};
export default _default;
//# sourceMappingURL=apparel-style-variant-kit.d.ts.map