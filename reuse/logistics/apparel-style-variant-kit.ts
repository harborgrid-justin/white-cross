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
 * File: /reuse/logistics/apparel-style-variant-kit.ts
 * Locator: WC-LOGISTICS-APL-STY-001
 * Purpose: Comprehensive Apparel Style & Variant Management - Complete lifecycle for apparel product management
 *
 * Upstream: Independent utility module for apparel style and variant operations
 * Downstream: ../backend/logistics/*, Apparel modules, Product catalogs, Inventory systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, crypto
 * Exports: 42 utility functions for style management, color variants, patterns, materials, collections
 *
 * LLM Context: Enterprise-grade apparel style and variant utilities to compete with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive style hierarchy management, color and pattern tracking, material composition,
 * size matrix generation, variant combinations, collection management, season planning, attribute mapping,
 * SKU generation, and real-time inventory allocation across multi-dimensional product matrices.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Style status enumeration
 */
export enum StyleStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SEASONAL = 'SEASONAL',
  DISCONTINUED = 'DISCONTINUED',
  ARCHIVED = 'ARCHIVED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
}

/**
 * Season enumeration
 */
export enum Season {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
  WINTER = 'WINTER',
  PRE_SPRING = 'PRE_SPRING',
  PRE_FALL = 'PRE_FALL',
  RESORT = 'RESORT',
  HOLIDAY = 'HOLIDAY',
}

/**
 * Gender category
 */
export enum Gender {
  MENS = 'MENS',
  WOMENS = 'WOMENS',
  UNISEX = 'UNISEX',
  BOYS = 'BOYS',
  GIRLS = 'GIRLS',
  INFANT = 'INFANT',
}

/**
 * Size system types
 */
export enum SizeSystem {
  US = 'US',
  UK = 'UK',
  EU = 'EU',
  ALPHA = 'ALPHA', // XS, S, M, L, XL
  NUMERIC = 'NUMERIC', // 0, 2, 4, 6, 8
  INCHES = 'INCHES', // Waist/Length
  CM = 'CM', // Centimeters
}

/**
 * Pattern types
 */
export enum PatternType {
  SOLID = 'SOLID',
  STRIPE = 'STRIPE',
  PLAID = 'PLAID',
  CHECK = 'CHECK',
  FLORAL = 'FLORAL',
  GEOMETRIC = 'GEOMETRIC',
  ANIMAL_PRINT = 'ANIMAL_PRINT',
  PAISLEY = 'PAISLEY',
  POLKA_DOT = 'POLKA_DOT',
  ABSTRACT = 'ABSTRACT',
  CAMOUFLAGE = 'CAMOUFLAGE',
  TIE_DYE = 'TIE_DYE',
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

// ============================================================================
// SECTION 1: STYLE DEFINITION & HIERARCHY (Functions 1-8)
// ============================================================================

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
export function createApparelStyle(styleData: Partial<ApparelStyle>): ApparelStyle {
  const styleId = generateStyleId();
  const styleNumber = generateStyleNumber(styleData.category, styleData.gender, styleData.season);

  return {
    styleId,
    styleNumber,
    styleName: styleData.styleName || '',
    description: styleData.description || '',
    status: styleData.status || StyleStatus.DRAFT,
    hierarchy: styleData.hierarchy || [],
    category: styleData.category || '',
    subcategory: styleData.subcategory || '',
    gender: styleData.gender || Gender.UNISEX,
    season: styleData.season || Season.SPRING,
    year: styleData.year || new Date().getFullYear(),
    basePrice: styleData.basePrice || 0,
    costPrice: styleData.costPrice || 0,
    colors: styleData.colors || [],
    sizes: styleData.sizes || [],
    materials: styleData.materials || [],
    patterns: styleData.patterns || [PatternType.SOLID],
    attributes: styleData.attributes || {},
    tags: styleData.tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: styleData.createdBy || 'SYSTEM',
    metadata: styleData.metadata,
  };
}

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
export function generateStyleHierarchy(
  division: string,
  department: string,
  category: string,
  subcategory: string
): StyleHierarchy[] {
  return [
    {
      level: 1,
      code: division.toUpperCase(),
      name: toTitleCase(division),
      description: `${toTitleCase(division)} Division`,
    },
    {
      level: 2,
      code: department.toUpperCase(),
      name: toTitleCase(department),
      parentCode: division.toUpperCase(),
      description: `${toTitleCase(department)} Department`,
    },
    {
      level: 3,
      code: category.toUpperCase(),
      name: toTitleCase(category),
      parentCode: department.toUpperCase(),
      description: `${toTitleCase(category)} Category`,
    },
    {
      level: 4,
      code: subcategory.toUpperCase(),
      name: toTitleCase(subcategory),
      parentCode: category.toUpperCase(),
      description: `${toTitleCase(subcategory)} Subcategory`,
    },
  ];
}

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
export function updateStyleStatus(
  style: ApparelStyle,
  newStatus: StyleStatus,
  updatedBy: string
): ApparelStyle {
  // Validate status transition
  const validTransitions: Record<StyleStatus, StyleStatus[]> = {
    [StyleStatus.DRAFT]: [StyleStatus.PENDING_APPROVAL, StyleStatus.ACTIVE],
    [StyleStatus.PENDING_APPROVAL]: [StyleStatus.ACTIVE, StyleStatus.DRAFT],
    [StyleStatus.ACTIVE]: [StyleStatus.SEASONAL, StyleStatus.DISCONTINUED],
    [StyleStatus.SEASONAL]: [StyleStatus.ACTIVE, StyleStatus.DISCONTINUED],
    [StyleStatus.DISCONTINUED]: [StyleStatus.ARCHIVED],
    [StyleStatus.ARCHIVED]: [],
  };

  if (!validTransitions[style.status].includes(newStatus)) {
    throw new Error(
      `Invalid status transition from ${style.status} to ${newStatus}`
    );
  }

  return {
    ...style,
    status: newStatus,
    updatedAt: new Date(),
    metadata: {
      ...style.metadata,
      lastStatusChange: {
        from: style.status,
        to: newStatus,
        timestamp: new Date(),
        updatedBy,
      },
    },
  };
}

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
export function addColorsToStyle(
  style: ApparelStyle,
  colors: ColorDefinition[]
): ApparelStyle {
  const existingColorIds = new Set(style.colors.map(c => c.colorId));
  const newColors = colors.filter(c => !existingColorIds.has(c.colorId));

  return {
    ...style,
    colors: [...style.colors, ...newColors],
    updatedAt: new Date(),
  };
}

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
export function addSizesToStyle(
  style: ApparelStyle,
  sizes: SizeSpec[]
): ApparelStyle {
  const existingSizeIds = new Set(style.sizes.map(s => s.sizeId));
  const newSizes = sizes.filter(s => !existingSizeIds.has(s.sizeId));

  return {
    ...style,
    sizes: [...style.sizes, ...newSizes].sort((a, b) => a.sortOrder - b.sortOrder),
    updatedAt: new Date(),
  };
}

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
export function cloneStyleForNewSeason(
  originalStyle: ApparelStyle,
  newSeason: Season,
  newYear: number
): ApparelStyle {
  const newStyleId = generateStyleId();
  const newStyleNumber = generateStyleNumber(
    originalStyle.category,
    originalStyle.gender,
    newSeason,
    newYear
  );

  return {
    ...originalStyle,
    styleId: newStyleId,
    styleNumber: newStyleNumber,
    season: newSeason,
    year: newYear,
    status: StyleStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      ...originalStyle.metadata,
      clonedFrom: originalStyle.styleId,
      clonedAt: new Date(),
    },
  };
}

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
export function validateStyleDefinition(style: ApparelStyle): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!style.styleName) errors.push('Style name is required');
  if (!style.styleNumber) errors.push('Style number is required');
  if (!style.category) errors.push('Category is required');
  if (!style.basePrice || style.basePrice <= 0) errors.push('Valid base price is required');

  // Business logic validations
  if (style.colors.length === 0) warnings.push('No colors defined');
  if (style.sizes.length === 0) warnings.push('No sizes defined');
  if (style.materials.length === 0) warnings.push('No materials defined');

  // Price validation
  if (style.basePrice <= style.costPrice) {
    warnings.push('Base price should be greater than cost price for profitability');
  }

  // Material composition validation
  const totalComposition = style.materials.reduce((sum, m) => sum + m.percentage, 0);
  if (style.materials.length > 0 && Math.abs(totalComposition - 100) > 0.01) {
    errors.push('Material composition must total 100%');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

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
export function searchStyles(
  styles: ApparelStyle[],
  criteria: {
    gender?: Gender;
    season?: Season;
    year?: number;
    category?: string;
    status?: StyleStatus;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
  }
): ApparelStyle[] {
  return styles.filter(style => {
    if (criteria.gender && style.gender !== criteria.gender) return false;
    if (criteria.season && style.season !== criteria.season) return false;
    if (criteria.year && style.year !== criteria.year) return false;
    if (criteria.category && style.category !== criteria.category) return false;
    if (criteria.status && style.status !== criteria.status) return false;
    if (criteria.minPrice && style.basePrice < criteria.minPrice) return false;
    if (criteria.maxPrice && style.basePrice > criteria.maxPrice) return false;
    if (criteria.tags && !criteria.tags.some(tag => style.tags.includes(tag))) return false;

    return true;
  });
}

// ============================================================================
// SECTION 2: COLOR & PATTERN MANAGEMENT (Functions 9-17)
// ============================================================================

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
export function createColorDefinition(
  colorData: Partial<ColorDefinition>
): ColorDefinition {
  const colorId = `CLR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  return {
    colorId,
    colorCode: colorData.colorCode || '',
    colorName: colorData.colorName || '',
    hexValue: colorData.hexValue || '#000000',
    pantoneCode: colorData.pantoneCode,
    colorFamily: colorData.colorFamily || determineColorFamily(colorData.hexValue || '#000000'),
    isCore: colorData.isCore || false,
    seasonalAvailability: colorData.seasonalAvailability,
    metadata: colorData.metadata,
  };
}

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
export function createColorPalette(
  paletteData: Partial<ColorPalette>
): ColorPalette {
  const paletteId = `PLT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  return {
    paletteId,
    paletteName: paletteData.paletteName || '',
    season: paletteData.season || Season.SPRING,
    year: paletteData.year || new Date().getFullYear(),
    colors: paletteData.colors || [],
    theme: paletteData.theme,
    isPrimary: paletteData.isPrimary || false,
  };
}

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
export function determineColorFamily(hexValue: string): string {
  const rgb = hexToRgb(hexValue);
  if (!rgb) return 'Unknown';

  const { r, g, b } = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  // Grayscale detection
  if (diff < 20) {
    if (max < 50) return 'Black';
    if (max > 200) return 'White';
    return 'Gray';
  }

  // Hue-based color family
  if (r === max) {
    if (g > b) return 'Orange';
    return 'Red';
  } else if (g === max) {
    if (b > r) return 'Green';
    return 'Yellow';
  } else {
    if (r > g) return 'Purple';
    return 'Blue';
  }
}

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
export function findComplementaryColors(
  baseColor: ColorDefinition,
  availableColors: ColorDefinition[]
): ColorDefinition[] {
  const baseRgb = hexToRgb(baseColor.hexValue);
  if (!baseRgb) return [];

  const complementaryColors: ColorDefinition[] = [];

  for (const color of availableColors) {
    if (color.colorId === baseColor.colorId) continue;

    const colorRgb = hexToRgb(color.hexValue);
    if (!colorRgb) continue;

    // Calculate color difference
    const hueDiff = calculateHueDifference(baseRgb, colorRgb);

    // Complementary colors are roughly 180 degrees apart
    if (hueDiff > 150 && hueDiff < 210) {
      complementaryColors.push(color);
    }
  }

  return complementaryColors;
}

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
export function addPatternToStyle(
  style: ApparelStyle,
  patterns: PatternType[]
): ApparelStyle {
  const existingPatterns = new Set(style.patterns);
  const newPatterns = patterns.filter(p => !existingPatterns.has(p));

  return {
    ...style,
    patterns: [...style.patterns, ...newPatterns],
    updatedAt: new Date(),
  };
}

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
export function generateColorCode(colorName: string): string {
  const words = colorName
    .toUpperCase()
    .replace(/[^A-Z\s]/g, '')
    .split(/\s+/);

  if (words.length === 1) {
    return words[0].substring(0, 3);
  }

  // Take first letter of each word, up to 3 letters
  return words
    .map(word => word[0])
    .join('')
    .substring(0, 3);
}

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
export function validateColorPalette(palette: ColorPalette): {
  valid: boolean;
  errors: string[];
  suggestions: string[];
} {
  const errors: string[] = [];
  const suggestions: string[] = [];

  if (palette.colors.length === 0) {
    errors.push('Palette must contain at least one color');
  }

  if (palette.colors.length < 3) {
    suggestions.push('Consider adding more colors for variety (minimum 3 recommended)');
  }

  if (palette.colors.length > 20) {
    suggestions.push('Large palettes may be difficult to manage (maximum 20 recommended)');
  }

  // Check for duplicate colors
  const uniqueHex = new Set(palette.colors.map(c => c.hexValue.toLowerCase()));
  if (uniqueHex.size < palette.colors.length) {
    errors.push('Palette contains duplicate colors');
  }

  // Check for core colors if primary palette
  if (palette.isPrimary) {
    const coreColors = palette.colors.filter(c => c.isCore);
    if (coreColors.length === 0) {
      suggestions.push('Primary palettes should include core colors');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    suggestions,
  };
}

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
export function groupColorsByFamily(
  colors: ColorDefinition[]
): Record<string, ColorDefinition[]> {
  const grouped: Record<string, ColorDefinition[]> = {};

  for (const color of colors) {
    const family = color.colorFamily;
    if (!grouped[family]) {
      grouped[family] = [];
    }
    grouped[family].push(color);
  }

  return grouped;
}

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
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// ============================================================================
// SECTION 3: MATERIAL & FABRIC TRACKING (Functions 18-25)
// ============================================================================

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
export function createMaterialSpec(
  materialData: Partial<MaterialSpec>
): MaterialSpec {
  const materialId = `MAT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const materialCode = generateMaterialCode(materialData.materialName || '');

  return {
    materialId,
    materialCode,
    materialName: materialData.materialName || '',
    composition: materialData.composition || [],
    weight: materialData.weight,
    weightUnit: materialData.weightUnit,
    careInstructions: materialData.careInstructions || [],
    certifications: materialData.certifications,
    supplier: materialData.supplier,
    cost: materialData.cost,
    leadTime: materialData.leadTime,
  };
}

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
export function validateMaterialComposition(
  composition: MaterialComposition[]
): {
  valid: boolean;
  total: number;
  error?: string;
} {
  const total = composition.reduce((sum, comp) => sum + comp.percentage, 0);
  const valid = Math.abs(total - 100) < 0.01;

  return {
    valid,
    total: Math.round(total * 100) / 100,
    error: valid ? undefined : `Material composition totals ${total}%, must equal 100%`,
  };
}

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
export function addMaterialsToStyle(
  style: ApparelStyle,
  materials: MaterialComposition[]
): ApparelStyle {
  // Validate composition
  const validation = validateMaterialComposition(materials);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return {
    ...style,
    materials,
    updatedAt: new Date(),
  };
}

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
export function generateCareInstructions(
  composition: MaterialComposition[]
): string[] {
  const instructions = new Set<string>();

  for (const comp of composition) {
    const fiber = comp.fiber.toLowerCase();

    if (fiber.includes('wool') || fiber.includes('cashmere')) {
      instructions.add('Dry clean only');
      instructions.add('Do not bleach');
      instructions.add('Lay flat to dry');
    } else if (fiber.includes('silk')) {
      instructions.add('Hand wash cold');
      instructions.add('Do not wring');
      instructions.add('Iron on low heat');
    } else if (fiber.includes('cotton')) {
      instructions.add('Machine wash cold');
      instructions.add('Tumble dry low');
      instructions.add('Iron if needed');
    } else if (fiber.includes('polyester') || fiber.includes('nylon')) {
      instructions.add('Machine wash warm');
      instructions.add('Do not bleach');
      instructions.add('Tumble dry low');
    } else if (fiber.includes('linen')) {
      instructions.add('Machine wash cold');
      instructions.add('Line dry');
      instructions.add('Iron while damp');
    }
  }

  return Array.from(instructions);
}

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
export function calculateFabricCost(
  material: MaterialSpec,
  yardagePerGarment: number
): number {
  if (!material.cost) return 0;
  return material.cost * yardagePerGarment;
}

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
export function findSustainableMaterialAlternatives(
  currentMaterial: MaterialSpec,
  availableMaterials: MaterialSpec[]
): MaterialSpec[] {
  const sustainableCertifications = [
    'GOTS',
    'OEKO-TEX',
    'Organic',
    'Recycled',
    'BCI',
    'FSC',
  ];

  return availableMaterials.filter(material => {
    // Must have certifications
    if (!material.certifications || material.certifications.length === 0) {
      return false;
    }

    // Check for sustainable certifications
    const hasSustainableCert = material.certifications.some(cert =>
      sustainableCertifications.some(sus => cert.includes(sus))
    );

    return hasSustainableCert;
  });
}

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
export function generateMaterialCode(materialName: string): string {
  const words = materialName
    .toUpperCase()
    .replace(/[^A-Z\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0 && !['THE', 'AND', 'OR'].includes(word));

  if (words.length === 0) return 'MAT';

  if (words.length === 1) {
    return words[0].substring(0, 3);
  }

  return words
    .map(word => word[0])
    .join('')
    .substring(0, 3);
}

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
export function compareMaterialSustainability(
  material1: MaterialSpec,
  material2: MaterialSpec
): number {
  const score1 = calculateSustainabilityScore(material1);
  const score2 = calculateSustainabilityScore(material2);

  if (score1 > score2) return 1;
  if (score1 < score2) return -1;
  return 0;
}

// ============================================================================
// SECTION 4: VARIANT GENERATION & COMBINATIONS (Functions 26-34)
// ============================================================================

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
export function generateStyleVariants(
  style: ApparelStyle,
  config: VariantGenerationConfig
): StyleVariant[] {
  const variants: StyleVariant[] = [];

  for (const color of style.colors) {
    for (const size of style.sizes) {
      const variantId = `VAR-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
      const sku = config.generateSKU
        ? generateSKU(style.styleNumber, color.colorCode, size.sizeCode)
        : '';
      const upc = config.generateUPC ? generateUPC() : undefined;

      // Calculate price with modifiers
      let price = style.basePrice;
      if (config.priceModifiers?.colorSurcharge?.[color.colorId]) {
        price += config.priceModifiers.colorSurcharge[color.colorId];
      }
      if (config.priceModifiers?.sizeSurcharge?.[size.sizeId]) {
        price += config.priceModifiers.sizeSurcharge[size.sizeId];
      }

      const variant: StyleVariant = {
        variantId,
        sku,
        styleId: style.styleId,
        styleNumber: style.styleNumber,
        colorId: color.colorId,
        colorCode: color.colorCode,
        colorName: color.colorName,
        sizeId: size.sizeId,
        sizeCode: size.sizeCode,
        sizeName: size.sizeName,
        upc,
        price,
        cost: style.costPrice,
        images: [],
        inventoryTracking: true,
        reorderPoint: config.stockDefaults?.reorderPoint,
        reorderQuantity: config.stockDefaults?.reorderQuantity,
        isActive: style.status === StyleStatus.ACTIVE,
      };

      variants.push(variant);
    }
  }

  return variants;
}

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
export function generateSKU(
  styleNumber: string,
  colorCode: string,
  sizeCode: string,
  config?: SKUConfig
): string {
  const defaultConfig: SKUConfig = {
    includeStyle: true,
    includeColor: true,
    includeSize: true,
    separator: '-',
    checkDigit: false,
  };

  const finalConfig = { ...defaultConfig, ...config };
  const parts: string[] = [];

  if (finalConfig.prefix) parts.push(finalConfig.prefix);
  if (finalConfig.includeStyle) parts.push(styleNumber);
  if (finalConfig.includeColor) parts.push(colorCode);
  if (finalConfig.includeSize) parts.push(sizeCode);
  if (finalConfig.suffix) parts.push(finalConfig.suffix);

  let sku = parts.join(finalConfig.separator);

  if (finalConfig.checkDigit) {
    sku += calculateCheckDigit(sku);
  }

  return sku;
}

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
export function parseSKU(
  sku: string,
  config?: SKUConfig
): {
  styleNumber?: string;
  colorCode?: string;
  sizeCode?: string;
} {
  const defaultConfig: SKUConfig = {
    includeStyle: true,
    includeColor: true,
    includeSize: true,
    separator: '-',
  };

  const finalConfig = { ...defaultConfig, ...config };
  const parts = sku.split(finalConfig.separator);

  let index = 0;
  const result: any = {};

  if (finalConfig.prefix) index++;
  if (finalConfig.includeStyle && parts[index]) {
    result.styleNumber = parts[index++];
  }
  if (finalConfig.includeColor && parts[index]) {
    result.colorCode = parts[index++];
  }
  if (finalConfig.includeSize && parts[index]) {
    result.sizeCode = parts[index++];
  }

  return result;
}

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
export function generateUPC(): string {
  // Generate 11 random digits
  const digits = Array.from({ length: 11 }, () =>
    Math.floor(Math.random() * 10)
  );

  // Calculate check digit
  let oddSum = 0;
  let evenSum = 0;

  for (let i = 0; i < 11; i++) {
    if (i % 2 === 0) {
      oddSum += digits[i];
    } else {
      evenSum += digits[i];
    }
  }

  const total = oddSum * 3 + evenSum;
  const checkDigit = (10 - (total % 10)) % 10;

  return digits.join('') + checkDigit;
}

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
export function validateUPC(upc: string): boolean {
  if (upc.length !== 12 || !/^\d+$/.test(upc)) {
    return false;
  }

  const digits = upc.split('').map(Number);
  let oddSum = 0;
  let evenSum = 0;

  for (let i = 0; i < 11; i++) {
    if (i % 2 === 0) {
      oddSum += digits[i];
    } else {
      evenSum += digits[i];
    }
  }

  const total = oddSum * 3 + evenSum;
  const checkDigit = (10 - (total % 10)) % 10;

  return checkDigit === digits[11];
}

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
export function filterVariants(
  variants: StyleVariant[],
  criteria: {
    colorCode?: string;
    sizeCode?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
    inStock?: boolean;
  }
): StyleVariant[] {
  return variants.filter(variant => {
    if (criteria.colorCode && variant.colorCode !== criteria.colorCode) return false;
    if (criteria.sizeCode && variant.sizeCode !== criteria.sizeCode) return false;
    if (criteria.minPrice && variant.price < criteria.minPrice) return false;
    if (criteria.maxPrice && variant.price > criteria.maxPrice) return false;
    if (criteria.isActive !== undefined && variant.isActive !== criteria.isActive) return false;
    if (criteria.inStock && (!variant.stockLevel || variant.stockLevel <= 0)) return false;

    return true;
  });
}

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
export function updateVariantPrice(
  variant: StyleVariant,
  newPrice: number,
  compareAtPrice?: number
): StyleVariant {
  return {
    ...variant,
    price: newPrice,
    compareAtPrice,
    metadata: {
      ...variant.metadata,
      priceHistory: [
        ...(variant.metadata?.priceHistory || []),
        {
          previousPrice: variant.price,
          newPrice,
          changedAt: new Date(),
        },
      ],
    },
  };
}

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
export function calculateVariantMargin(variant: StyleVariant): {
  grossMargin: number;
  marginPercentage: number;
  markup: number;
} {
  const grossMargin = variant.price - variant.cost;
  const marginPercentage = (grossMargin / variant.price) * 100;
  const markup = (grossMargin / variant.cost) * 100;

  return {
    grossMargin: Math.round(grossMargin * 100) / 100,
    marginPercentage: Math.round(marginPercentage * 100) / 100,
    markup: Math.round(markup * 100) / 100,
  };
}

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
export function generateSizeRun(
  matrix: SizeMatrix,
  totalQuantity: number
): Record<string, number> {
  const sizeRun: Record<string, number> = {};

  if (!matrix.ratios) {
    // Equal distribution
    const quantityPerSize = Math.floor(totalQuantity / matrix.sizes.length);
    for (const size of matrix.sizes) {
      sizeRun[size.sizeCode] = quantityPerSize;
    }
  } else {
    // Ratio-based distribution
    const totalRatio = Object.values(matrix.ratios).reduce((sum, r) => sum + r, 0);
    for (const size of matrix.sizes) {
      const ratio = matrix.ratios[size.sizeCode] || 0;
      sizeRun[size.sizeCode] = Math.floor((ratio / totalRatio) * totalQuantity);
    }
  }

  return sizeRun;
}

// ============================================================================
// SECTION 5: COLLECTION MANAGEMENT (Functions 35-42)
// ============================================================================

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
export function createCollection(
  collectionData: Partial<ApparelCollection>
): ApparelCollection {
  const collectionId = `COL-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  const collectionCode = generateCollectionCode(
    collectionData.collectionName || '',
    collectionData.season,
    collectionData.year
  );

  return {
    collectionId,
    collectionCode,
    collectionName: collectionData.collectionName || '',
    description: collectionData.description || '',
    season: collectionData.season || Season.SPRING,
    year: collectionData.year || new Date().getFullYear(),
    launchDate: collectionData.launchDate || new Date(),
    endDate: collectionData.endDate,
    styles: collectionData.styles || [],
    theme: collectionData.theme,
    targetMarket: collectionData.targetMarket,
    priceRange: collectionData.priceRange || { min: 0, max: 0 },
    status: collectionData.status || StyleStatus.DRAFT,
    createdAt: new Date(),
    metadata: collectionData.metadata,
  };
}

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
export function addStylesToCollection(
  collection: ApparelCollection,
  styleIds: string[]
): ApparelCollection {
  const existingStyles = new Set(collection.styles);
  const newStyles = styleIds.filter(id => !existingStyles.has(id));

  return {
    ...collection,
    styles: [...collection.styles, ...newStyles],
  };
}

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
export function removeStylesFromCollection(
  collection: ApparelCollection,
  styleIds: string[]
): ApparelCollection {
  const removeSet = new Set(styleIds);

  return {
    ...collection,
    styles: collection.styles.filter(id => !removeSet.has(id)),
  };
}

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
export function calculateCollectionStats(
  collection: ApparelCollection,
  styles: ApparelStyle[]
): {
  totalStyles: number;
  totalVariants: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
  colorCount: number;
  sizeCount: number;
  genderBreakdown: Record<Gender, number>;
  categoryBreakdown: Record<string, number>;
} {
  const collectionStyles = styles.filter(s => collection.styles.includes(s.styleId));

  const totalVariants = collectionStyles.reduce(
    (sum, s) => sum + s.colors.length * s.sizes.length,
    0
  );

  const prices = collectionStyles.map(s => s.basePrice);
  const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length || 0;

  const allColors = new Set(
    collectionStyles.flatMap(s => s.colors.map(c => c.colorId))
  );
  const allSizes = new Set(collectionStyles.flatMap(s => s.sizes.map(sz => sz.sizeId)));

  const genderBreakdown: Record<Gender, number> = {} as any;
  const categoryBreakdown: Record<string, number> = {};

  for (const style of collectionStyles) {
    genderBreakdown[style.gender] = (genderBreakdown[style.gender] || 0) + 1;
    categoryBreakdown[style.category] = (categoryBreakdown[style.category] || 0) + 1;
  }

  return {
    totalStyles: collectionStyles.length,
    totalVariants,
    averagePrice: Math.round(averagePrice * 100) / 100,
    priceRange: {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 0),
    },
    colorCount: allColors.size,
    sizeCount: allSizes.size,
    genderBreakdown,
    categoryBreakdown,
  };
}

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
export function generateCollectionCode(
  collectionName: string,
  season?: Season,
  year?: number
): string {
  const nameCode = collectionName
    .toUpperCase()
    .replace(/[^A-Z\s]/g, '')
    .split(/\s+/)
    .map(word => word.substring(0, 2))
    .join('')
    .substring(0, 5);

  const seasonCode = season ? season.substring(0, 2) : 'XX';
  const yearCode = year ? year.toString().substring(2) : 'XX';

  return `${nameCode}-${seasonCode}${yearCode}`;
}

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
export function validateCollectionForLaunch(
  collection: ApparelCollection,
  styles: ApparelStyle[]
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (collection.styles.length === 0) {
    errors.push('Collection must contain at least one style');
  }

  const collectionStyles = styles.filter(s => collection.styles.includes(s.styleId));

  // Check if all styles are active
  const inactiveStyles = collectionStyles.filter(s => s.status !== StyleStatus.ACTIVE);
  if (inactiveStyles.length > 0) {
    warnings.push(`${inactiveStyles.length} styles are not active`);
  }

  // Check if styles have variants
  for (const style of collectionStyles) {
    if (style.colors.length === 0 || style.sizes.length === 0) {
      errors.push(`Style ${style.styleNumber} has no variants`);
    }
  }

  // Check launch date
  if (collection.launchDate < new Date()) {
    warnings.push('Launch date is in the past');
  }

  // Check price range
  if (collection.priceRange.min === 0 && collection.priceRange.max === 0) {
    warnings.push('Price range is not set');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

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
export function exportCollectionToCatalog(
  collection: ApparelCollection,
  styles: ApparelStyle[],
  variants: StyleVariant[]
): {
  collection: ApparelCollection;
  styles: Array<{
    style: ApparelStyle;
    variants: StyleVariant[];
    variantCount: number;
  }>;
  summary: {
    totalStyles: number;
    totalVariants: number;
    priceRange: { min: number; max: number };
  };
} {
  const collectionStyles = styles.filter(s => collection.styles.includes(s.styleId));
  const styleData = collectionStyles.map(style => {
    const styleVariants = variants.filter(v => v.styleId === style.styleId);
    return {
      style,
      variants: styleVariants,
      variantCount: styleVariants.length,
    };
  });

  const allVariants = styleData.flatMap(sd => sd.variants);
  const prices = allVariants.map(v => v.price);

  return {
    collection,
    styles: styleData,
    summary: {
      totalStyles: collectionStyles.length,
      totalVariants: allVariants.length,
      priceRange: {
        min: Math.min(...prices, 0),
        max: Math.max(...prices, 0),
      },
    },
  };
}

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
export function generateCollectionLookbook(
  collection: ApparelCollection,
  styles: ApparelStyle[]
): {
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
} {
  const collectionStyles = styles.filter(s => collection.styles.includes(s.styleId));

  // Group by category
  const stylesByCategory: Record<string, ApparelStyle[]> = {};
  for (const style of collectionStyles) {
    if (!stylesByCategory[style.category]) {
      stylesByCategory[style.category] = [];
    }
    stylesByCategory[style.category].push(style);
  }

  // Collect all colors and group by family
  const allColors = collectionStyles.flatMap(s => s.colors);
  const colorsByFamily = groupColorsByFamily(allColors);
  const colorPalette = Object.entries(colorsByFamily).map(([family, colors]) => ({
    family,
    colors,
  }));

  // Calculate price points
  const prices = collectionStyles.map(s => s.basePrice).sort((a, b) => a - b);
  const entry = prices[0] || 0;
  const mid = prices[Math.floor(prices.length / 2)] || 0;
  const premium = prices[prices.length - 1] || 0;

  return {
    collectionInfo: {
      name: collection.collectionName,
      season: collection.season,
      year: collection.year,
      theme: collection.theme,
      description: collection.description,
    },
    stylesByCategory,
    colorPalette,
    pricePoints: {
      entry,
      mid,
      premium,
    },
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Generates unique style ID.
 */
function generateStyleId(): string {
  return `STY-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

/**
 * Helper: Generates style number with semantic meaning.
 */
function generateStyleNumber(
  category?: string,
  gender?: Gender,
  season?: Season,
  year?: number
): string {
  const catCode = category?.substring(0, 2).toUpperCase() || 'XX';
  const genderCode = gender?.substring(0, 1) || 'U';
  const seasonCode = season?.substring(0, 2) || 'XX';
  const yearCode = year?.toString().substring(2) || new Date().getFullYear().toString().substring(2);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  return `${catCode}${genderCode}${seasonCode}${yearCode}${random}`;
}

/**
 * Helper: Converts string to title case.
 */
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

/**
 * Helper: Calculates hue difference between two colors.
 */
function calculateHueDifference(
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number }
): number {
  // Simplified hue calculation
  const hue1 = Math.atan2(Math.sqrt(3) * (rgb1.g - rgb1.b), 2 * rgb1.r - rgb1.g - rgb1.b);
  const hue2 = Math.atan2(Math.sqrt(3) * (rgb2.g - rgb2.b), 2 * rgb2.r - rgb2.g - rgb2.b);

  let diff = Math.abs((hue1 - hue2) * (180 / Math.PI));
  if (diff > 180) diff = 360 - diff;

  return diff;
}

/**
 * Helper: Calculates sustainability score for material.
 */
function calculateSustainabilityScore(material: MaterialSpec): number {
  let score = 0;

  // Certification score
  if (material.certifications) {
    score += material.certifications.length * 10;
  }

  // Organic/recycled content
  for (const comp of material.composition) {
    if (comp.certification?.some(c => c.includes('Organic') || c.includes('Recycled'))) {
      score += comp.percentage * 0.5;
    }
  }

  // Natural fibers bonus
  const naturalFibers = ['cotton', 'linen', 'wool', 'silk', 'hemp'];
  for (const comp of material.composition) {
    if (naturalFibers.some(f => comp.fiber.toLowerCase().includes(f))) {
      score += comp.percentage * 0.2;
    }
  }

  return score;
}

/**
 * Helper: Calculates check digit for SKU.
 */
function calculateCheckDigit(value: string): string {
  const digits = value.replace(/\D/g, '');
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i], 10);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit.toString();
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Style Definition & Hierarchy
  createApparelStyle,
  generateStyleHierarchy,
  updateStyleStatus,
  addColorsToStyle,
  addSizesToStyle,
  cloneStyleForNewSeason,
  validateStyleDefinition,
  searchStyles,

  // Color & Pattern Management
  createColorDefinition,
  createColorPalette,
  determineColorFamily,
  findComplementaryColors,
  addPatternToStyle,
  generateColorCode,
  validateColorPalette,
  groupColorsByFamily,
  hexToRgb,

  // Material & Fabric Tracking
  createMaterialSpec,
  validateMaterialComposition,
  addMaterialsToStyle,
  generateCareInstructions,
  calculateFabricCost,
  findSustainableMaterialAlternatives,
  generateMaterialCode,
  compareMaterialSustainability,

  // Variant Generation & Combinations
  generateStyleVariants,
  generateSKU,
  parseSKU,
  generateUPC,
  validateUPC,
  filterVariants,
  updateVariantPrice,
  calculateVariantMargin,
  generateSizeRun,

  // Collection Management
  createCollection,
  addStylesToCollection,
  removeStylesFromCollection,
  calculateCollectionStats,
  generateCollectionCode,
  validateCollectionForLaunch,
  exportCollectionToCatalog,
  generateCollectionLookbook,
};
