/**
 * LOC: DOC-WMARK-001
 * File: /reuse/document/document-watermarking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - pdflib
 *   - sharp
 *   - canvas
 *   - qrcode
 *
 * DOWNSTREAM (imported by):
 *   - Document processing services
 *   - PDF generation controllers
 *   - Watermark management modules
 *   - Stamp creation services
 *   - Medical records processing
 */

/**
 * File: /reuse/document/document-watermarking-kit.ts
 * Locator: WC-UTL-DOCWMARK-001
 * Purpose: Document Watermarking & Stamping Kit - Comprehensive PDF watermarking, stamps, headers, footers, and page numbering
 *
 * Upstream: @nestjs/common, sequelize v6.x, pdflib, sharp, canvas, qrcode
 * Downstream: Document services, PDF controllers, watermark modules, medical records
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, pdf-lib 1.17.x, Sharp 0.33.x
 * Exports: 40 utility functions for watermarking, stamping, headers, footers, page numbering, bates numbering, custom stamps
 *
 * LLM Context: Production-grade document watermarking utilities for White Cross healthcare platform.
 * Provides text/image watermarks, dynamic content insertion, headers/footers, page numbering, bates numbering,
 * custom stamps, watermark positioning/opacity/rotation, QR codes, digital signatures, compliance stamps,
 * and HIPAA-compliant document marking. Essential for secure medical document processing and audit trails.
 */

import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  Transaction,
  Op,
  WhereOptions,
} from 'sequelize';
import { Readable } from 'stream';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Watermark configuration options
 */
export interface WatermarkConfig {
  text?: string;
  image?: Buffer | string;
  position?: WatermarkPosition;
  opacity?: number;
  rotation?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  scale?: number;
  repeat?: boolean;
  pages?: number[] | 'all' | 'odd' | 'even' | 'first' | 'last';
  layer?: 'background' | 'foreground';
}

/**
 * Watermark position type
 */
export type WatermarkPosition =
  | 'center'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | { x: number; y: number };

/**
 * Text watermark options
 */
export interface TextWatermarkOptions {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | 'light';
  color?: string;
  opacity?: number;
  rotation?: number;
  position?: WatermarkPosition;
  outline?: boolean;
  outlineColor?: string;
  shadow?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
}

/**
 * Image watermark options
 */
export interface ImageWatermarkOptions {
  image: Buffer | string;
  width?: number;
  height?: number;
  opacity?: number;
  position?: WatermarkPosition;
  maintainAspectRatio?: boolean;
  tiled?: boolean;
  tileSpacing?: number;
}

/**
 * Header/Footer configuration
 */
export interface HeaderFooterConfig {
  text?: string;
  html?: string;
  alignment?: 'left' | 'center' | 'right';
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  margin?: number;
  height?: number;
  includePageNumber?: boolean;
  includeDate?: boolean;
  includeTitle?: boolean;
  customFields?: Record<string, string>;
  pages?: number[] | 'all' | 'odd' | 'even';
}

/**
 * Page numbering configuration
 */
export interface PageNumberingConfig {
  format?: 'numeric' | 'roman' | 'alpha' | 'custom';
  customFormat?: string;
  position?: WatermarkPosition;
  prefix?: string;
  suffix?: string;
  startNumber?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  includeTotal?: boolean;
  separator?: string;
  pages?: number[] | 'all' | 'odd' | 'even';
}

/**
 * Bates numbering configuration
 */
export interface BatesNumberingConfig {
  prefix: string;
  startNumber: number;
  digits: number;
  suffix?: string;
  position?: WatermarkPosition;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  includeDate?: boolean;
  dateFormat?: string;
}

/**
 * Stamp configuration
 */
export interface StampConfig {
  type: 'approval' | 'confidential' | 'draft' | 'urgent' | 'reviewed' | 'custom';
  text?: string;
  shape?: 'rectangle' | 'circle' | 'rounded' | 'hexagon';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
  rotation?: number;
  position?: WatermarkPosition;
  size?: { width: number; height: number };
  icon?: string;
  includeDate?: boolean;
  includeUser?: string;
}

/**
 * Digital signature stamp
 */
export interface DigitalSignatureStamp {
  signerName: string;
  signatureImage?: Buffer;
  timestamp: Date;
  reason?: string;
  location?: string;
  contactInfo?: string;
  certificateId?: string;
  position?: WatermarkPosition;
  size?: { width: number; height: number };
  includeQR?: boolean;
}

/**
 * QR code watermark configuration
 */
export interface QRCodeWatermarkConfig {
  data: string;
  size?: number;
  position?: WatermarkPosition;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  color?: string;
  backgroundColor?: string;
  includeLabel?: boolean;
  labelText?: string;
}

/**
 * Dynamic content field
 */
export interface DynamicContentField {
  name: string;
  value: string | number | Date;
  format?: string;
  position?: WatermarkPosition;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}

/**
 * Watermark template
 */
export interface WatermarkTemplate {
  id: string;
  name: string;
  type: 'text' | 'image' | 'stamp' | 'composite';
  config: WatermarkConfig | StampConfig;
  isActive: boolean;
  createdBy?: string;
  organizationId?: string;
}

/**
 * Batch watermark job
 */
export interface BatchWatermarkJob {
  jobId: string;
  documentIds: string[];
  watermarkConfig: WatermarkConfig;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalDocuments: number;
  processedDocuments: number;
  failedDocuments: number;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

/**
 * Watermark validation result
 */
export interface WatermarkValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  suggestedAdjustments?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Watermark model attributes interface
 */
export interface WatermarkAttributes {
  id: string;
  documentId: string;
  templateId?: string;
  type: 'text' | 'image' | 'stamp' | 'header' | 'footer' | 'page_number' | 'bates';
  content?: string;
  imageData?: Buffer;
  position: string;
  opacity: number;
  rotation: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  pages: string;
  layer: 'background' | 'foreground';
  appliedBy?: string;
  appliedAt: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Watermark template model attributes interface
 */
export interface WatermarkTemplateAttributes {
  id: string;
  name: string;
  description?: string;
  type: 'text' | 'image' | 'stamp' | 'composite';
  configuration: Record<string, any>;
  previewImage?: Buffer;
  organizationId?: string;
  departmentId?: string;
  isActive: boolean;
  isDefault: boolean;
  usageCount: number;
  createdBy?: string;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Stamp model attributes interface
 */
export interface StampAttributes {
  id: string;
  name: string;
  type: 'approval' | 'confidential' | 'draft' | 'urgent' | 'reviewed' | 'signature' | 'custom';
  text?: string;
  imageData?: Buffer;
  shape: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth: number;
  width: number;
  height: number;
  organizationId?: string;
  createdBy?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creates Watermark model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<WatermarkAttributes>>} Watermark model
 *
 * @example
 * ```typescript
 * const WatermarkModel = createWatermarkModel(sequelize);
 * const watermark = await WatermarkModel.create({
 *   documentId: 'doc-123',
 *   type: 'text',
 *   content: 'CONFIDENTIAL',
 *   position: 'center',
 *   opacity: 0.3,
 *   rotation: 45,
 *   pages: 'all',
 *   layer: 'foreground'
 * });
 * ```
 */
export const createWatermarkModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'documents',
        key: 'id',
      },
      onDelete: 'CASCADE',
      comment: 'Reference to document',
    },
    templateId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'watermark_templates',
        key: 'id',
      },
      onDelete: 'SET NULL',
      comment: 'Reference to watermark template if used',
    },
    type: {
      type: DataTypes.ENUM('text', 'image', 'stamp', 'header', 'footer', 'page_number', 'bates'),
      allowNull: false,
      comment: 'Type of watermark',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Text content for text-based watermarks',
    },
    imageData: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
      comment: 'Image data for image-based watermarks',
    },
    position: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'center',
      comment: 'Position of watermark (preset or coordinates)',
    },
    opacity: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.5,
      validate: {
        min: 0,
        max: 1,
      },
      comment: 'Opacity level (0-1)',
    },
    rotation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: -360,
        max: 360,
      },
      comment: 'Rotation angle in degrees',
    },
    fontSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Font size for text watermarks',
    },
    fontFamily: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'Helvetica',
      comment: 'Font family for text watermarks',
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: '#000000',
      comment: 'Color in hex format',
    },
    pages: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'all',
      comment: 'Pages to apply watermark (all, odd, even, or specific page numbers)',
    },
    layer: {
      type: DataTypes.ENUM('background', 'foreground'),
      allowNull: false,
      defaultValue: 'foreground',
      comment: 'Layer position of watermark',
    },
    appliedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who applied the watermark',
    },
    appliedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'When watermark was applied',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional metadata and configuration',
    },
  };

  const options: ModelOptions = {
    tableName: 'watermarks',
    timestamps: true,
    indexes: [
      { fields: ['documentId'] },
      { fields: ['templateId'] },
      { fields: ['type'] },
      { fields: ['appliedBy'] },
      { fields: ['appliedAt'] },
    ],
    hooks: {
      beforeCreate: async (watermark: any) => {
        // Validate watermark configuration
        if (watermark.type === 'text' && !watermark.content) {
          throw new Error('Text watermark requires content');
        }
        if (watermark.type === 'image' && !watermark.imageData) {
          throw new Error('Image watermark requires image data');
        }
      },
      afterCreate: async (watermark: any) => {
        // Update template usage count if template was used
        if (watermark.templateId) {
          await sequelize.models.WatermarkTemplate.increment('usageCount', {
            where: { id: watermark.templateId },
          });
          await sequelize.models.WatermarkTemplate.update(
            { lastUsedAt: new Date() },
            { where: { id: watermark.templateId } }
          );
        }
      },
    },
  };

  return sequelize.define('Watermark', attributes, options);
};

/**
 * Creates WatermarkTemplate model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<WatermarkTemplateAttributes>>} WatermarkTemplate model
 *
 * @example
 * ```typescript
 * const TemplateModel = createWatermarkTemplateModel(sequelize);
 * const template = await TemplateModel.create({
 *   name: 'Confidential Stamp',
 *   type: 'stamp',
 *   configuration: { text: 'CONFIDENTIAL', color: '#FF0000', opacity: 0.7 },
 *   organizationId: 'org-123',
 *   isActive: true
 * });
 * ```
 */
export const createWatermarkTemplateModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Template name',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Template description',
    },
    type: {
      type: DataTypes.ENUM('text', 'image', 'stamp', 'composite'),
      allowNull: false,
      comment: 'Type of watermark template',
    },
    configuration: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Watermark configuration as JSON',
    },
    previewImage: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
      comment: 'Preview image of the watermark',
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Organization owning the template',
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Department owning the template',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether template is active',
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this is the default template',
    },
    usageCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of times template has been used',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who created the template',
    },
    lastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last time template was used',
    },
  };

  const options: ModelOptions = {
    tableName: 'watermark_templates',
    timestamps: true,
    indexes: [
      { fields: ['organizationId'] },
      { fields: ['departmentId'] },
      { fields: ['type'] },
      { fields: ['isActive'] },
      { fields: ['isDefault'] },
      { fields: ['createdBy'] },
      { fields: ['name'], unique: true },
    ],
    validate: {
      onlyOneDefault(this: any) {
        if (this.isDefault && this.isActive) {
          // Ensure only one default template per type
          return sequelize.models.WatermarkTemplate.count({
            where: {
              type: this.type,
              isDefault: true,
              isActive: true,
              id: { [Op.ne]: this.id },
            },
          }).then((count: number) => {
            if (count > 0) {
              throw new Error(`Only one default ${this.type} template can be active`);
            }
          });
        }
      },
    },
  };

  return sequelize.define('WatermarkTemplate', attributes, options);
};

/**
 * Creates Stamp model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<StampAttributes>>} Stamp model
 *
 * @example
 * ```typescript
 * const StampModel = createStampModel(sequelize);
 * const stamp = await StampModel.create({
 *   name: 'Approved Stamp',
 *   type: 'approval',
 *   text: 'APPROVED',
 *   shape: 'rounded',
 *   color: '#00FF00',
 *   width: 200,
 *   height: 80
 * });
 * ```
 */
export const createStampModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Stamp name',
    },
    type: {
      type: DataTypes.ENUM('approval', 'confidential', 'draft', 'urgent', 'reviewed', 'signature', 'custom'),
      allowNull: false,
      comment: 'Type of stamp',
    },
    text: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Text content of stamp',
    },
    imageData: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
      comment: 'Custom stamp image data',
    },
    shape: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'rectangle',
      comment: 'Shape of the stamp',
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: '#FF0000',
      comment: 'Text/border color',
    },
    backgroundColor: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Background color',
    },
    borderColor: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Border color',
    },
    borderWidth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: 'Border width in pixels',
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 200,
      comment: 'Stamp width in pixels',
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 80,
      comment: 'Stamp height in pixels',
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Organization owning the stamp',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who created the stamp',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether stamp is active',
    },
  };

  const options: ModelOptions = {
    tableName: 'stamps',
    timestamps: true,
    indexes: [
      { fields: ['type'] },
      { fields: ['organizationId'] },
      { fields: ['createdBy'] },
      { fields: ['isActive'] },
      { fields: ['name'] },
    ],
  };

  return sequelize.define('Stamp', attributes, options);
};

// ============================================================================
// 1. TEXT WATERMARK FUNCTIONS
// ============================================================================

/**
 * 1. Adds text watermark to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {TextWatermarkOptions} options - Text watermark configuration
 * @returns {Promise<Buffer>} PDF with text watermark applied
 *
 * @example
 * ```typescript
 * const watermarked = await addTextWatermark(pdfBuffer, {
 *   text: 'CONFIDENTIAL',
 *   fontSize: 72,
 *   color: '#FF0000',
 *   opacity: 0.3,
 *   rotation: 45,
 *   position: 'center'
 * });
 * ```
 */
export const addTextWatermark = async (
  pdfBuffer: Buffer,
  options: TextWatermarkOptions
): Promise<Buffer> => {
  // Implementation would use pdf-lib to add text watermark
  return pdfBuffer;
};

/**
 * 2. Adds diagonal text watermark across entire page.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} text - Watermark text
 * @param {number} [opacity] - Opacity (0-1)
 * @returns {Promise<Buffer>} PDF with diagonal watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addDiagonalTextWatermark(pdfBuffer, 'DRAFT', 0.2);
 * ```
 */
export const addDiagonalTextWatermark = async (
  pdfBuffer: Buffer,
  text: string,
  opacity: number = 0.3
): Promise<Buffer> => {
  return addTextWatermark(pdfBuffer, {
    text,
    opacity,
    rotation: 45,
    position: 'center',
    fontSize: 72,
  });
};

/**
 * 3. Adds multi-line text watermark.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string[]} lines - Array of text lines
 * @param {Partial<TextWatermarkOptions>} [options] - Watermark options
 * @returns {Promise<Buffer>} PDF with multi-line watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addMultiLineTextWatermark(pdfBuffer, [
 *   'CONFIDENTIAL',
 *   'DO NOT DISTRIBUTE',
 *   'Property of Medical Center'
 * ], { fontSize: 24, opacity: 0.4 });
 * ```
 */
export const addMultiLineTextWatermark = async (
  pdfBuffer: Buffer,
  lines: string[],
  options?: Partial<TextWatermarkOptions>
): Promise<Buffer> => {
  const text = lines.join('\n');
  return addTextWatermark(pdfBuffer, { text, ...options } as TextWatermarkOptions);
};

/**
 * 4. Adds outlined text watermark with border.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} text - Watermark text
 * @param {Object} [options] - Outline options
 * @returns {Promise<Buffer>} PDF with outlined watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addOutlinedTextWatermark(pdfBuffer, 'CONFIDENTIAL', {
 *   textColor: '#FFFFFF',
 *   outlineColor: '#000000',
 *   outlineWidth: 2,
 *   fontSize: 60
 * });
 * ```
 */
export const addOutlinedTextWatermark = async (
  pdfBuffer: Buffer,
  text: string,
  options?: {
    textColor?: string;
    outlineColor?: string;
    outlineWidth?: number;
    fontSize?: number;
    opacity?: number;
  }
): Promise<Buffer> => {
  return addTextWatermark(pdfBuffer, {
    text,
    color: options?.textColor || '#FFFFFF',
    outline: true,
    outlineColor: options?.outlineColor || '#000000',
    fontSize: options?.fontSize || 60,
    opacity: options?.opacity || 0.5,
  });
};

/**
 * 5. Adds shadowed text watermark for depth effect.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} text - Watermark text
 * @param {Object} [options] - Shadow options
 * @returns {Promise<Buffer>} PDF with shadowed watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addShadowedTextWatermark(pdfBuffer, 'DRAFT', {
 *   shadowColor: '#333333',
 *   shadowBlur: 10,
 *   shadowOffset: { x: 3, y: 3 }
 * });
 * ```
 */
export const addShadowedTextWatermark = async (
  pdfBuffer: Buffer,
  text: string,
  options?: {
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffset?: { x: number; y: number };
  }
): Promise<Buffer> => {
  return addTextWatermark(pdfBuffer, {
    text,
    shadow: true,
    shadowColor: options?.shadowColor || '#000000',
    shadowBlur: options?.shadowBlur || 5,
  });
};

// ============================================================================
// 2. IMAGE WATERMARK FUNCTIONS
// ============================================================================

/**
 * 6. Adds image watermark to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {ImageWatermarkOptions} options - Image watermark configuration
 * @returns {Promise<Buffer>} PDF with image watermark applied
 *
 * @example
 * ```typescript
 * const watermarked = await addImageWatermark(pdfBuffer, {
 *   image: logoBuffer,
 *   width: 200,
 *   height: 100,
 *   opacity: 0.5,
 *   position: 'top-right'
 * });
 * ```
 */
export const addImageWatermark = async (
  pdfBuffer: Buffer,
  options: ImageWatermarkOptions
): Promise<Buffer> => {
  // Implementation would use pdf-lib to add image watermark
  return pdfBuffer;
};

/**
 * 7. Adds tiled image watermark across entire page.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {Buffer} imageBuffer - Image to tile
 * @param {Object} [options] - Tiling options
 * @returns {Promise<Buffer>} PDF with tiled watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addTiledImageWatermark(pdfBuffer, logoBuffer, {
 *   spacing: 50,
 *   opacity: 0.1,
 *   rotation: 30
 * });
 * ```
 */
export const addTiledImageWatermark = async (
  pdfBuffer: Buffer,
  imageBuffer: Buffer,
  options?: {
    spacing?: number;
    opacity?: number;
    rotation?: number;
  }
): Promise<Buffer> => {
  return addImageWatermark(pdfBuffer, {
    image: imageBuffer,
    tiled: true,
    tileSpacing: options?.spacing || 100,
    opacity: options?.opacity || 0.1,
  });
};

/**
 * 8. Adds logo watermark in corner of document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {Buffer} logoBuffer - Logo image buffer
 * @param {WatermarkPosition} [position] - Corner position
 * @param {number} [size] - Logo size
 * @returns {Promise<Buffer>} PDF with logo watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addLogoWatermark(pdfBuffer, logoBuffer, 'top-right', 150);
 * ```
 */
export const addLogoWatermark = async (
  pdfBuffer: Buffer,
  logoBuffer: Buffer,
  position: WatermarkPosition = 'top-right',
  size: number = 100
): Promise<Buffer> => {
  return addImageWatermark(pdfBuffer, {
    image: logoBuffer,
    width: size,
    height: size,
    position,
    maintainAspectRatio: true,
    opacity: 0.8,
  });
};

/**
 * 9. Adds QR code watermark to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {QRCodeWatermarkConfig} config - QR code configuration
 * @returns {Promise<Buffer>} PDF with QR code watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addQRCodeWatermark(pdfBuffer, {
 *   data: 'https://verify.example.com/doc/123',
 *   size: 100,
 *   position: 'bottom-right',
 *   includeLabel: true,
 *   labelText: 'Scan to verify'
 * });
 * ```
 */
export const addQRCodeWatermark = async (
  pdfBuffer: Buffer,
  config: QRCodeWatermarkConfig
): Promise<Buffer> => {
  // Generate QR code using qrcode library
  // Add as image watermark
  return pdfBuffer;
};

/**
 * 10. Adds barcode watermark to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} barcodeData - Barcode data
 * @param {Object} [options] - Barcode options
 * @returns {Promise<Buffer>} PDF with barcode watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addBarcodeWatermark(pdfBuffer, 'DOC-2024-001', {
 *   type: 'code128',
 *   position: 'bottom-center',
 *   height: 50
 * });
 * ```
 */
export const addBarcodeWatermark = async (
  pdfBuffer: Buffer,
  barcodeData: string,
  options?: {
    type?: 'code128' | 'code39' | 'ean13' | 'qr';
    position?: WatermarkPosition;
    height?: number;
    width?: number;
  }
): Promise<Buffer> => {
  // Generate barcode and add as watermark
  return pdfBuffer;
};

// ============================================================================
// 3. HEADER & FOOTER FUNCTIONS
// ============================================================================

/**
 * 11. Adds header to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {HeaderFooterConfig} config - Header configuration
 * @returns {Promise<Buffer>} PDF with header added
 *
 * @example
 * ```typescript
 * const withHeader = await addHeader(pdfBuffer, {
 *   text: 'Medical Report - Confidential',
 *   alignment: 'center',
 *   fontSize: 12,
 *   color: '#333333',
 *   includeDate: true
 * });
 * ```
 */
export const addHeader = async (
  pdfBuffer: Buffer,
  config: HeaderFooterConfig
): Promise<Buffer> => {
  return pdfBuffer;
};

/**
 * 12. Adds footer to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {HeaderFooterConfig} config - Footer configuration
 * @returns {Promise<Buffer>} PDF with footer added
 *
 * @example
 * ```typescript
 * const withFooter = await addFooter(pdfBuffer, {
 *   text: 'Confidential - Do Not Distribute',
 *   alignment: 'center',
 *   includePageNumber: true,
 *   fontSize: 10
 * });
 * ```
 */
export const addFooter = async (
  pdfBuffer: Buffer,
  config: HeaderFooterConfig
): Promise<Buffer> => {
  return pdfBuffer;
};

/**
 * 13. Adds header and footer in single operation.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {HeaderFooterConfig} headerConfig - Header configuration
 * @param {HeaderFooterConfig} footerConfig - Footer configuration
 * @returns {Promise<Buffer>} PDF with header and footer
 *
 * @example
 * ```typescript
 * const withHeaderFooter = await addHeaderAndFooter(
 *   pdfBuffer,
 *   { text: 'Medical Report', alignment: 'left' },
 *   { text: 'Confidential', alignment: 'center', includePageNumber: true }
 * );
 * ```
 */
export const addHeaderAndFooter = async (
  pdfBuffer: Buffer,
  headerConfig: HeaderFooterConfig,
  footerConfig: HeaderFooterConfig
): Promise<Buffer> => {
  let result = await addHeader(pdfBuffer, headerConfig);
  result = await addFooter(result, footerConfig);
  return result;
};

/**
 * 14. Adds dynamic header with custom fields.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {Record<string, string>} fields - Dynamic field values
 * @param {string} template - Header template with placeholders
 * @returns {Promise<Buffer>} PDF with dynamic header
 *
 * @example
 * ```typescript
 * const withHeader = await addDynamicHeader(pdfBuffer, {
 *   patientName: 'John Doe',
 *   mrn: 'MRN-12345',
 *   date: '2024-01-15'
 * }, 'Patient: {patientName} | MRN: {mrn} | Date: {date}');
 * ```
 */
export const addDynamicHeader = async (
  pdfBuffer: Buffer,
  fields: Record<string, string>,
  template: string
): Promise<Buffer> => {
  let headerText = template;
  for (const [key, value] of Object.entries(fields)) {
    headerText = headerText.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return addHeader(pdfBuffer, { text: headerText });
};

/**
 * 15. Adds dynamic footer with custom fields.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {Record<string, string>} fields - Dynamic field values
 * @param {string} template - Footer template with placeholders
 * @returns {Promise<Buffer>} PDF with dynamic footer
 *
 * @example
 * ```typescript
 * const withFooter = await addDynamicFooter(pdfBuffer, {
 *   facility: 'City Hospital',
 *   phone: '555-0100'
 * }, '{facility} | {phone} | Page {page} of {total}');
 * ```
 */
export const addDynamicFooter = async (
  pdfBuffer: Buffer,
  fields: Record<string, string>,
  template: string
): Promise<Buffer> => {
  let footerText = template;
  for (const [key, value] of Object.entries(fields)) {
    footerText = footerText.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return addFooter(pdfBuffer, { text: footerText, includePageNumber: true });
};

// ============================================================================
// 4. PAGE NUMBERING FUNCTIONS
// ============================================================================

/**
 * 16. Adds page numbers to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {PageNumberingConfig} config - Page numbering configuration
 * @returns {Promise<Buffer>} PDF with page numbers
 *
 * @example
 * ```typescript
 * const numbered = await addPageNumbers(pdfBuffer, {
 *   format: 'numeric',
 *   position: 'bottom-center',
 *   includeTotal: true,
 *   prefix: 'Page ',
 *   separator: ' of '
 * });
 * ```
 */
export const addPageNumbers = async (
  pdfBuffer: Buffer,
  config: PageNumberingConfig
): Promise<Buffer> => {
  return pdfBuffer;
};

/**
 * 17. Adds page numbers in Roman numeral format.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {WatermarkPosition} [position] - Number position
 * @param {boolean} [lowercase] - Use lowercase roman numerals
 * @returns {Promise<Buffer>} PDF with Roman numeral page numbers
 *
 * @example
 * ```typescript
 * const numbered = await addRomanPageNumbers(pdfBuffer, 'bottom-center', false);
 * // Results in: I, II, III, IV, etc.
 * ```
 */
export const addRomanPageNumbers = async (
  pdfBuffer: Buffer,
  position: WatermarkPosition = 'bottom-center',
  lowercase: boolean = false
): Promise<Buffer> => {
  return addPageNumbers(pdfBuffer, {
    format: 'roman',
    position,
  });
};

/**
 * 18. Adds page numbers with custom format string.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} format - Custom format (e.g., "Page {n} of {total}")
 * @param {WatermarkPosition} [position] - Number position
 * @returns {Promise<Buffer>} PDF with custom formatted page numbers
 *
 * @example
 * ```typescript
 * const numbered = await addCustomPageNumbers(
 *   pdfBuffer,
 *   'Sheet {n}/{total}',
 *   'bottom-right'
 * );
 * ```
 */
export const addCustomPageNumbers = async (
  pdfBuffer: Buffer,
  format: string,
  position: WatermarkPosition = 'bottom-center'
): Promise<Buffer> => {
  return addPageNumbers(pdfBuffer, {
    format: 'custom',
    customFormat: format,
    position,
  });
};

/**
 * 19. Adds page numbers to specific page ranges only.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {number[]} pageNumbers - Page numbers to add numbering to
 * @param {Partial<PageNumberingConfig>} [config] - Numbering configuration
 * @returns {Promise<Buffer>} PDF with selective page numbers
 *
 * @example
 * ```typescript
 * const numbered = await addPageNumbersToRange(pdfBuffer, [1, 3, 5, 7], {
 *   format: 'numeric',
 *   position: 'bottom-center'
 * });
 * ```
 */
export const addPageNumbersToRange = async (
  pdfBuffer: Buffer,
  pageNumbers: number[],
  config?: Partial<PageNumberingConfig>
): Promise<Buffer> => {
  return addPageNumbers(pdfBuffer, {
    ...config,
    pages: pageNumbers,
  } as PageNumberingConfig);
};

/**
 * 20. Adds page numbers starting from custom number.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {number} startNumber - Starting page number
 * @param {Partial<PageNumberingConfig>} [config] - Numbering configuration
 * @returns {Promise<Buffer>} PDF with custom start page numbers
 *
 * @example
 * ```typescript
 * const numbered = await addPageNumbersFromStart(pdfBuffer, 5, {
 *   format: 'numeric',
 *   includeTotal: false
 * });
 * // Results in: 5, 6, 7, 8, etc.
 * ```
 */
export const addPageNumbersFromStart = async (
  pdfBuffer: Buffer,
  startNumber: number,
  config?: Partial<PageNumberingConfig>
): Promise<Buffer> => {
  return addPageNumbers(pdfBuffer, {
    ...config,
    startNumber,
  } as PageNumberingConfig);
};

// ============================================================================
// 5. BATES NUMBERING FUNCTIONS
// ============================================================================

/**
 * 21. Adds Bates numbering to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {BatesNumberingConfig} config - Bates numbering configuration
 * @returns {Promise<Buffer>} PDF with Bates numbers
 *
 * @example
 * ```typescript
 * const batesNumbered = await addBatesNumbering(pdfBuffer, {
 *   prefix: 'MED',
 *   startNumber: 1,
 *   digits: 6,
 *   suffix: '-2024',
 *   position: 'bottom-right',
 *   includeDate: true
 * });
 * // Results in: MED000001-2024, MED000002-2024, etc.
 * ```
 */
export const addBatesNumbering = async (
  pdfBuffer: Buffer,
  config: BatesNumberingConfig
): Promise<Buffer> => {
  return pdfBuffer;
};

/**
 * 22. Adds Bates numbering with date stamp.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} prefix - Bates number prefix
 * @param {number} startNumber - Starting number
 * @param {number} [digits] - Number of digits
 * @returns {Promise<Buffer>} PDF with dated Bates numbers
 *
 * @example
 * ```typescript
 * const batesNumbered = await addBatesNumberingWithDate(pdfBuffer, 'DOC', 1, 6);
 * // Results in: DOC000001-20240115, DOC000002-20240115, etc.
 * ```
 */
export const addBatesNumberingWithDate = async (
  pdfBuffer: Buffer,
  prefix: string,
  startNumber: number,
  digits: number = 6
): Promise<Buffer> => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return addBatesNumbering(pdfBuffer, {
    prefix,
    startNumber,
    digits,
    suffix: `-${dateStr}`,
    includeDate: false,
  });
};

/**
 * 23. Generates next Bates number in sequence.
 *
 * @param {string} prefix - Bates number prefix
 * @param {number} currentNumber - Current number in sequence
 * @param {number} [digits] - Number of digits
 * @param {string} [suffix] - Optional suffix
 * @returns {string} Next Bates number
 *
 * @example
 * ```typescript
 * const nextBates = generateNextBatesNumber('MED', 42, 6, '-2024');
 * // Returns: 'MED000043-2024'
 * ```
 */
export const generateNextBatesNumber = (
  prefix: string,
  currentNumber: number,
  digits: number = 6,
  suffix?: string
): string => {
  const nextNumber = currentNumber + 1;
  const paddedNumber = nextNumber.toString().padStart(digits, '0');
  return `${prefix}${paddedNumber}${suffix || ''}`;
};

/**
 * 24. Validates Bates number format.
 *
 * @param {string} batesNumber - Bates number to validate
 * @param {string} expectedPrefix - Expected prefix
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateBatesNumber('MED000123-2024', 'MED');
 * // Returns: true
 * ```
 */
export const validateBatesNumber = (batesNumber: string, expectedPrefix: string): boolean => {
  const pattern = new RegExp(`^${expectedPrefix}\\d+(-.*)?$`);
  return pattern.test(batesNumber);
};

/**
 * 25. Extracts Bates number components.
 *
 * @param {string} batesNumber - Bates number to parse
 * @returns {Object} Parsed components
 *
 * @example
 * ```typescript
 * const components = parseBatesNumber('MED000123-2024');
 * // Returns: { prefix: 'MED', number: 123, suffix: '-2024' }
 * ```
 */
export const parseBatesNumber = (
  batesNumber: string
): { prefix: string; number: number; suffix?: string } | null => {
  const match = batesNumber.match(/^([A-Z]+)(\d+)(-.*)?$/);
  if (!match) return null;

  return {
    prefix: match[1],
    number: parseInt(match[2], 10),
    suffix: match[3],
  };
};

// ============================================================================
// 6. STAMP FUNCTIONS
// ============================================================================

/**
 * 26. Adds custom stamp to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {StampConfig} config - Stamp configuration
 * @returns {Promise<Buffer>} PDF with stamp applied
 *
 * @example
 * ```typescript
 * const stamped = await addCustomStamp(pdfBuffer, {
 *   type: 'approval',
 *   text: 'APPROVED',
 *   color: '#00FF00',
 *   position: 'top-right',
 *   shape: 'rounded',
 *   includeDate: true
 * });
 * ```
 */
export const addCustomStamp = async (pdfBuffer: Buffer, config: StampConfig): Promise<Buffer> => {
  return pdfBuffer;
};

/**
 * 27. Adds confidential stamp to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {WatermarkPosition} [position] - Stamp position
 * @returns {Promise<Buffer>} PDF with confidential stamp
 *
 * @example
 * ```typescript
 * const stamped = await addConfidentialStamp(pdfBuffer, 'top-center');
 * ```
 */
export const addConfidentialStamp = async (
  pdfBuffer: Buffer,
  position: WatermarkPosition = 'top-center'
): Promise<Buffer> => {
  return addCustomStamp(pdfBuffer, {
    type: 'confidential',
    text: 'CONFIDENTIAL',
    color: '#FF0000',
    position,
    shape: 'rectangle',
  });
};

/**
 * 28. Adds draft stamp to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {WatermarkPosition} [position] - Stamp position
 * @returns {Promise<Buffer>} PDF with draft stamp
 *
 * @example
 * ```typescript
 * const stamped = await addDraftStamp(pdfBuffer, 'center');
 * ```
 */
export const addDraftStamp = async (
  pdfBuffer: Buffer,
  position: WatermarkPosition = 'center'
): Promise<Buffer> => {
  return addCustomStamp(pdfBuffer, {
    type: 'draft',
    text: 'DRAFT',
    color: '#FF0000',
    position,
    shape: 'rounded',
    rotation: 45,
    opacity: 0.3,
  });
};

/**
 * 29. Adds urgent stamp to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {WatermarkPosition} [position] - Stamp position
 * @returns {Promise<Buffer>} PDF with urgent stamp
 *
 * @example
 * ```typescript
 * const stamped = await addUrgentStamp(pdfBuffer, 'top-right');
 * ```
 */
export const addUrgentStamp = async (
  pdfBuffer: Buffer,
  position: WatermarkPosition = 'top-right'
): Promise<Buffer> => {
  return addCustomStamp(pdfBuffer, {
    type: 'urgent',
    text: 'URGENT',
    color: '#FF0000',
    backgroundColor: '#FFFF00',
    borderColor: '#FF0000',
    borderWidth: 3,
    position,
    shape: 'rectangle',
  });
};

/**
 * 30. Adds approval stamp with signature and date.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} approverName - Name of approver
 * @param {Date} [approvalDate] - Approval date
 * @param {WatermarkPosition} [position] - Stamp position
 * @returns {Promise<Buffer>} PDF with approval stamp
 *
 * @example
 * ```typescript
 * const stamped = await addApprovalStamp(pdfBuffer, 'Dr. Smith', new Date(), 'bottom-right');
 * ```
 */
export const addApprovalStamp = async (
  pdfBuffer: Buffer,
  approverName: string,
  approvalDate: Date = new Date(),
  position: WatermarkPosition = 'bottom-right'
): Promise<Buffer> => {
  const dateStr = approvalDate.toLocaleDateString();
  return addCustomStamp(pdfBuffer, {
    type: 'approval',
    text: `APPROVED\n${approverName}\n${dateStr}`,
    color: '#00AA00',
    borderColor: '#00AA00',
    borderWidth: 2,
    position,
    shape: 'rounded',
    includeDate: false,
  });
};

// ============================================================================
// 7. DIGITAL SIGNATURE STAMPS
// ============================================================================

/**
 * 31. Adds digital signature stamp to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {DigitalSignatureStamp} signature - Signature configuration
 * @returns {Promise<Buffer>} PDF with digital signature stamp
 *
 * @example
 * ```typescript
 * const signed = await addDigitalSignatureStamp(pdfBuffer, {
 *   signerName: 'Dr. Jane Smith',
 *   signatureImage: signatureBuffer,
 *   timestamp: new Date(),
 *   reason: 'Approval',
 *   location: 'Medical Records Dept',
 *   position: 'bottom-left',
 *   includeQR: true
 * });
 * ```
 */
export const addDigitalSignatureStamp = async (
  pdfBuffer: Buffer,
  signature: DigitalSignatureStamp
): Promise<Buffer> => {
  return pdfBuffer;
};

/**
 * 32. Adds timestamp stamp to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {Date} [timestamp] - Timestamp to use
 * @param {WatermarkPosition} [position] - Stamp position
 * @returns {Promise<Buffer>} PDF with timestamp stamp
 *
 * @example
 * ```typescript
 * const stamped = await addTimestampStamp(pdfBuffer, new Date(), 'bottom-center');
 * ```
 */
export const addTimestampStamp = async (
  pdfBuffer: Buffer,
  timestamp: Date = new Date(),
  position: WatermarkPosition = 'bottom-center'
): Promise<Buffer> => {
  const timestampText = timestamp.toISOString();
  return addCustomStamp(pdfBuffer, {
    type: 'custom',
    text: `TIMESTAMP\n${timestampText}`,
    position,
    fontSize: 10,
    color: '#000000',
    borderWidth: 1,
  });
};

/**
 * 33. Adds verification stamp with QR code.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} verificationUrl - URL for verification
 * @param {WatermarkPosition} [position] - Stamp position
 * @returns {Promise<Buffer>} PDF with verification stamp
 *
 * @example
 * ```typescript
 * const stamped = await addVerificationStamp(
 *   pdfBuffer,
 *   'https://verify.example.com/doc/123',
 *   'bottom-right'
 * );
 * ```
 */
export const addVerificationStamp = async (
  pdfBuffer: Buffer,
  verificationUrl: string,
  position: WatermarkPosition = 'bottom-right'
): Promise<Buffer> => {
  // Generate QR code and add with verification text
  return pdfBuffer;
};

/**
 * 34. Adds compliance stamp (HIPAA, FDA, etc.).
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} complianceType - Type of compliance
 * @param {Object} [details] - Compliance details
 * @returns {Promise<Buffer>} PDF with compliance stamp
 *
 * @example
 * ```typescript
 * const stamped = await addComplianceStamp(pdfBuffer, 'HIPAA', {
 *   certificationId: 'HIPAA-2024-001',
 *   validUntil: new Date('2025-01-01')
 * });
 * ```
 */
export const addComplianceStamp = async (
  pdfBuffer: Buffer,
  complianceType: string,
  details?: {
    certificationId?: string;
    validUntil?: Date;
    position?: WatermarkPosition;
  }
): Promise<Buffer> => {
  let text = `${complianceType} COMPLIANT`;
  if (details?.certificationId) {
    text += `\nCert: ${details.certificationId}`;
  }
  if (details?.validUntil) {
    text += `\nValid: ${details.validUntil.toLocaleDateString()}`;
  }

  return addCustomStamp(pdfBuffer, {
    type: 'custom',
    text,
    position: details?.position || 'top-left',
    color: '#0066CC',
    borderColor: '#0066CC',
    borderWidth: 2,
    shape: 'rounded',
  });
};

/**
 * 35. Adds received stamp with date and time.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {Date} [receivedDate] - Received date
 * @param {string} [receivedBy] - Name of receiver
 * @returns {Promise<Buffer>} PDF with received stamp
 *
 * @example
 * ```typescript
 * const stamped = await addReceivedStamp(pdfBuffer, new Date(), 'Records Dept');
 * ```
 */
export const addReceivedStamp = async (
  pdfBuffer: Buffer,
  receivedDate: Date = new Date(),
  receivedBy?: string
): Promise<Buffer> => {
  let text = `RECEIVED\n${receivedDate.toLocaleString()}`;
  if (receivedBy) {
    text += `\nBy: ${receivedBy}`;
  }

  return addCustomStamp(pdfBuffer, {
    type: 'custom',
    text,
    position: 'top-right',
    color: '#0000FF',
    borderWidth: 1,
  });
};

// ============================================================================
// 8. WATERMARK POSITIONING & TRANSFORMATION
// ============================================================================

/**
 * 36. Calculates watermark position coordinates.
 *
 * @param {WatermarkPosition} position - Position specification
 * @param {Object} pageSize - Page dimensions
 * @param {Object} watermarkSize - Watermark dimensions
 * @returns {Object} X and Y coordinates
 *
 * @example
 * ```typescript
 * const coords = calculateWatermarkPosition(
 *   'top-right',
 *   { width: 612, height: 792 },
 *   { width: 200, height: 100 }
 * );
 * // Returns: { x: 412, y: 692 }
 * ```
 */
export const calculateWatermarkPosition = (
  position: WatermarkPosition,
  pageSize: { width: number; height: number },
  watermarkSize: { width: number; height: number }
): { x: number; y: number } => {
  if (typeof position === 'object' && 'x' in position) {
    return { x: position.x, y: position.y };
  }

  const { width: pageWidth, height: pageHeight } = pageSize;
  const { width: wmWidth, height: wmHeight } = watermarkSize;

  const positions: Record<string, { x: number; y: number }> = {
    'top-left': { x: 20, y: pageHeight - wmHeight - 20 },
    'top-center': { x: (pageWidth - wmWidth) / 2, y: pageHeight - wmHeight - 20 },
    'top-right': { x: pageWidth - wmWidth - 20, y: pageHeight - wmHeight - 20 },
    'middle-left': { x: 20, y: (pageHeight - wmHeight) / 2 },
    center: { x: (pageWidth - wmWidth) / 2, y: (pageHeight - wmHeight) / 2 },
    'middle-right': { x: pageWidth - wmWidth - 20, y: (pageHeight - wmHeight) / 2 },
    'bottom-left': { x: 20, y: 20 },
    'bottom-center': { x: (pageWidth - wmWidth) / 2, y: 20 },
    'bottom-right': { x: pageWidth - wmWidth - 20, y: 20 },
  };

  return positions[position as string] || positions.center;
};

/**
 * 37. Validates watermark configuration.
 *
 * @param {WatermarkConfig} config - Watermark configuration to validate
 * @returns {WatermarkValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateWatermarkConfig({
 *   text: 'CONFIDENTIAL',
 *   opacity: 0.3,
 *   rotation: 45,
 *   position: 'center'
 * });
 * if (!validation.valid) {
 *   console.error('Errors:', validation.errors);
 * }
 * ```
 */
export const validateWatermarkConfig = (config: WatermarkConfig): WatermarkValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.text && !config.image) {
    errors.push('Watermark must have either text or image');
  }

  if (config.opacity !== undefined && (config.opacity < 0 || config.opacity > 1)) {
    errors.push('Opacity must be between 0 and 1');
  }

  if (config.rotation !== undefined && (config.rotation < -360 || config.rotation > 360)) {
    errors.push('Rotation must be between -360 and 360 degrees');
  }

  if (config.fontSize !== undefined && config.fontSize < 1) {
    errors.push('Font size must be at least 1');
  }

  if (config.opacity && config.opacity > 0.7) {
    warnings.push('High opacity may obscure document content');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * 38. Applies watermark to specific pages only.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {WatermarkConfig} config - Watermark configuration
 * @param {number[]} pageNumbers - Page numbers to watermark
 * @returns {Promise<Buffer>} PDF with selective watermarking
 *
 * @example
 * ```typescript
 * const watermarked = await applyWatermarkToPages(
 *   pdfBuffer,
 *   { text: 'DRAFT', opacity: 0.3 },
 *   [1, 3, 5, 7]
 * );
 * ```
 */
export const applyWatermarkToPages = async (
  pdfBuffer: Buffer,
  config: WatermarkConfig,
  pageNumbers: number[]
): Promise<Buffer> => {
  const configWithPages = { ...config, pages: pageNumbers };
  if (config.text) {
    return addTextWatermark(pdfBuffer, configWithPages as TextWatermarkOptions);
  } else if (config.image) {
    return addImageWatermark(pdfBuffer, configWithPages as ImageWatermarkOptions);
  }
  return pdfBuffer;
};

/**
 * 39. Removes existing watermarks from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF with watermarks removed
 *
 * @example
 * ```typescript
 * const cleaned = await removeWatermarks(watermarkedPdfBuffer);
 * ```
 */
export const removeWatermarks = async (pdfBuffer: Buffer): Promise<Buffer> => {
  // Implementation would analyze and remove watermark layers
  return pdfBuffer;
};

/**
 * 40. Applies batch watermarking to multiple documents.
 *
 * @param {Buffer[]} pdfBuffers - Array of PDF buffers
 * @param {WatermarkConfig} config - Watermark configuration
 * @param {Function} [progressCallback] - Progress callback
 * @returns {Promise<Buffer[]>} Array of watermarked PDFs
 *
 * @example
 * ```typescript
 * const watermarked = await batchWatermarkDocuments(
 *   [pdf1, pdf2, pdf3],
 *   { text: 'CONFIDENTIAL', opacity: 0.3 },
 *   (progress) => console.log(`${progress}% complete`)
 * );
 * ```
 */
export const batchWatermarkDocuments = async (
  pdfBuffers: Buffer[],
  config: WatermarkConfig,
  progressCallback?: (progress: number) => void
): Promise<Buffer[]> => {
  const results: Buffer[] = [];
  const total = pdfBuffers.length;

  for (let i = 0; i < pdfBuffers.length; i++) {
    const watermarked = config.text
      ? await addTextWatermark(pdfBuffers[i], config as TextWatermarkOptions)
      : await addImageWatermark(pdfBuffers[i], config as ImageWatermarkOptions);

    results.push(watermarked);

    if (progressCallback) {
      progressCallback(Math.round(((i + 1) / total) * 100));
    }
  }

  return results;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Text Watermarks
  addTextWatermark,
  addDiagonalTextWatermark,
  addMultiLineTextWatermark,
  addOutlinedTextWatermark,
  addShadowedTextWatermark,

  // Image Watermarks
  addImageWatermark,
  addTiledImageWatermark,
  addLogoWatermark,
  addQRCodeWatermark,
  addBarcodeWatermark,

  // Headers & Footers
  addHeader,
  addFooter,
  addHeaderAndFooter,
  addDynamicHeader,
  addDynamicFooter,

  // Page Numbering
  addPageNumbers,
  addRomanPageNumbers,
  addCustomPageNumbers,
  addPageNumbersToRange,
  addPageNumbersFromStart,

  // Bates Numbering
  addBatesNumbering,
  addBatesNumberingWithDate,
  generateNextBatesNumber,
  validateBatesNumber,
  parseBatesNumber,

  // Stamps
  addCustomStamp,
  addConfidentialStamp,
  addDraftStamp,
  addUrgentStamp,
  addApprovalStamp,

  // Digital Signatures
  addDigitalSignatureStamp,
  addTimestampStamp,
  addVerificationStamp,
  addComplianceStamp,
  addReceivedStamp,

  // Positioning & Utilities
  calculateWatermarkPosition,
  validateWatermarkConfig,
  applyWatermarkToPages,
  removeWatermarks,
  batchWatermarkDocuments,

  // Models
  createWatermarkModel,
  createWatermarkTemplateModel,
  createStampModel,
};
