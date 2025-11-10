/**
 * LOC: DOC-OCR-001
 * File: /reuse/document/document-advanced-ocr-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - tesseract.js
 *   - @google-cloud/vision
 *   - @aws-sdk/client-textract
 *   - sharp
 *   - sequelize (v6.x)
 *   - pdf-parse
 *
 * DOWNSTREAM (imported by):
 *   - Document OCR controllers
 *   - Medical records scanning services
 *   - Patient form digitization modules
 *   - Healthcare document processing pipelines
 */
/**
 * File: /reuse/document/document-advanced-ocr-kit.ts
 * Locator: WC-UTL-DOCR-001
 * Purpose: AI-Powered OCR & Document Intelligence Kit - Advanced OCR exceeding Adobe Acrobat with multi-engine support, table extraction, handwriting recognition, layout analysis
 *
 * Upstream: @nestjs/common, tesseract.js, @google-cloud/vision, @aws-sdk/client-textract, sharp, sequelize, pdf-parse
 * Downstream: OCR controllers, document scanning services, medical records digitization, form processing modules
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Tesseract.js 4.x, Google Cloud Vision v3, AWS Textract SDK v3
 * Exports: 38 utility functions for OCR engines, table extraction, handwriting recognition, layout analysis, confidence scoring, batch processing
 *
 * LLM Context: Production-grade AI-powered OCR utilities for White Cross healthcare platform.
 * Provides multi-engine OCR integration (Tesseract, Google Vision, AWS Textract), intelligent document
 * layout analysis, advanced table detection and extraction, handwriting recognition for medical notes,
 * confidence scoring and validation, batch processing for high-volume scanning, support for scanned PDFs,
 * images, and medical documents. Exceeds Adobe Acrobat capabilities with AI-powered text extraction,
 * structure recognition, and specialized medical document handling. Essential for digitizing patient forms,
 * medical records, consent documents, prescriptions, and healthcare administrative paperwork.
 */
import { Sequelize } from 'sequelize';
/**
 * OCR engine types
 */
export type OcrEngine = 'tesseract' | 'google-vision' | 'aws-textract' | 'azure-ocr' | 'paddle-ocr';
/**
 * Document types for OCR processing
 */
export type DocumentType = 'medical-form' | 'consent-form' | 'prescription' | 'lab-report' | 'insurance-claim' | 'patient-record' | 'general-document' | 'invoice' | 'receipt';
/**
 * Image preprocessing operations
 */
export type PreprocessingOperation = 'denoise' | 'deskew' | 'binarize' | 'contrast-enhance' | 'sharpen' | 'remove-background' | 'rotate' | 'crop';
/**
 * Table extraction method
 */
export type TableExtractionMethod = 'lattice' | 'stream' | 'ai-detection' | 'border-detection';
/**
 * Handwriting recognition model
 */
export type HandwritingModel = 'google-handwriting' | 'aws-handwriting' | 'microsoft-ink' | 'custom-model';
/**
 * OCR configuration for document processing
 */
export interface OcrConfig {
    engine: OcrEngine;
    language?: string | string[];
    pageSegMode?: number;
    ocrEngineMode?: number;
    whitelist?: string;
    blacklist?: string;
    preprocessing?: PreprocessingOperation[];
    dpi?: number;
    timeout?: number;
    apiKey?: string;
    apiEndpoint?: string;
    confidenceThreshold?: number;
}
/**
 * OCR result for a document
 */
export interface OcrResult {
    text: string;
    confidence: number;
    language: string;
    engine: OcrEngine;
    processingTime: number;
    pages?: PageOcrResult[];
    metadata?: {
        documentType?: DocumentType;
        pageCount?: number;
        resolution?: {
            width: number;
            height: number;
        };
        fileSize?: number;
    };
}
/**
 * OCR result for a single page
 */
export interface PageOcrResult {
    pageNumber: number;
    text: string;
    confidence: number;
    words: WordBoundingBox[];
    lines: LineResult[];
    blocks: BlockResult[];
    layout?: LayoutAnalysis;
}
/**
 * Word with bounding box
 */
export interface WordBoundingBox {
    text: string;
    confidence: number;
    boundingBox: BoundingBox;
    language?: string;
}
/**
 * Line result with text and position
 */
export interface LineResult {
    text: string;
    confidence: number;
    boundingBox: BoundingBox;
    words: WordBoundingBox[];
}
/**
 * Block result representing text regions
 */
export interface BlockResult {
    type: 'text' | 'table' | 'image' | 'heading' | 'footer' | 'header';
    text?: string;
    confidence: number;
    boundingBox: BoundingBox;
    lines?: LineResult[];
}
/**
 * Bounding box coordinates
 */
export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * Extracted table structure
 */
export interface ExtractedTable {
    pageNumber: number;
    boundingBox: BoundingBox;
    rows: TableRow[];
    columns: number;
    confidence: number;
    headers?: string[];
    extractionMethod: TableExtractionMethod;
    metadata?: {
        hasHeaders?: boolean;
        isMergedCells?: boolean;
        orientation?: 'portrait' | 'landscape';
    };
}
/**
 * Table row with cells
 */
export interface TableRow {
    rowIndex: number;
    cells: TableCell[];
    isHeader?: boolean;
}
/**
 * Table cell data
 */
export interface TableCell {
    columnIndex: number;
    text: string;
    confidence: number;
    boundingBox: BoundingBox;
    rowSpan?: number;
    colSpan?: number;
}
/**
 * Handwriting recognition result
 */
export interface HandwritingResult {
    text: string;
    confidence: number;
    model: HandwritingModel;
    strokes?: HandwritingStroke[];
    alternatives?: Array<{
        text: string;
        confidence: number;
    }>;
    language?: string;
    processingTime: number;
}
/**
 * Handwriting stroke data
 */
export interface HandwritingStroke {
    points: Array<{
        x: number;
        y: number;
    }>;
    timestamp?: number;
}
/**
 * Document layout analysis result
 */
export interface LayoutAnalysis {
    readingOrder: number[];
    columns: number;
    textRegions: Array<{
        type: 'heading' | 'paragraph' | 'list' | 'caption';
        boundingBox: BoundingBox;
        confidence: number;
    }>;
    orientation: 'portrait' | 'landscape';
    marginSizes?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
}
/**
 * Confidence score breakdown
 */
export interface ConfidenceScore {
    overall: number;
    wordLevel: number;
    lineLevel: number;
    pageLevel: number;
    characterAccuracy?: number;
    flags?: string[];
}
/**
 * Batch OCR job configuration
 */
export interface BatchOcrJob {
    jobId: string;
    documents: Array<{
        documentId: string;
        fileBuffer?: Buffer;
        filePath?: string;
        fileUrl?: string;
    }>;
    config: OcrConfig;
    priority?: 'low' | 'normal' | 'high';
    notificationEmail?: string;
    webhookUrl?: string;
}
/**
 * Batch OCR job status
 */
export interface BatchOcrJobStatus {
    jobId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    totalDocuments: number;
    processedDocuments: number;
    failedDocuments: number;
    startedAt: Date;
    completedAt?: Date;
    results?: Array<{
        documentId: string;
        success: boolean;
        result?: OcrResult;
        error?: string;
    }>;
}
/**
 * Image preprocessing configuration
 */
export interface PreprocessingConfig {
    operations: PreprocessingOperation[];
    denoiseFactor?: number;
    deskewThreshold?: number;
    binarizeThreshold?: number;
    contrastFactor?: number;
    sharpenAmount?: number;
    rotationAngle?: number;
    cropRegion?: BoundingBox;
}
/**
 * Multi-language OCR result
 */
export interface MultiLanguageOcrResult {
    detectedLanguages: Array<{
        language: string;
        confidence: number;
        region?: BoundingBox;
    }>;
    textByLanguage: Map<string, string>;
    overallText: string;
    confidence: number;
}
/**
 * Form field detection result
 */
export interface FormFieldDetection {
    fields: Array<{
        label: string;
        value: string;
        type: 'text' | 'checkbox' | 'radio' | 'signature' | 'date' | 'number';
        boundingBox: BoundingBox;
        confidence: number;
        checked?: boolean;
    }>;
    formType?: string;
    confidence: number;
}
/**
 * OCR result model attributes
 */
export interface OcrResultAttributes {
    id: string;
    documentId: string;
    documentType?: string;
    engine: string;
    language: string;
    fullText: string;
    confidence: number;
    pageCount: number;
    processingTime: number;
    ocrData: Record<string, any>;
    metadata?: Record<string, any>;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    errorMessage?: string;
    processedBy?: string;
    processedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Extracted table model attributes
 */
export interface ExtractedTableAttributes {
    id: string;
    ocrResultId: string;
    documentId: string;
    pageNumber: number;
    tableIndex: number;
    rowCount: number;
    columnCount: number;
    hasHeaders: boolean;
    extractionMethod: string;
    tableData: Record<string, any>;
    jsonData?: string;
    csvData?: string;
    confidence: number;
    boundingBox?: Record<string, any>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Handwriting recognition model attributes
 */
export interface HandwritingRecognitionAttributes {
    id: string;
    ocrResultId?: string;
    documentId: string;
    pageNumber: number;
    recognizedText: string;
    model: string;
    confidence: number;
    language?: string;
    strokeData?: Record<string, any>;
    alternatives?: string[];
    processingTime: number;
    boundingBox?: Record<string, any>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates OcrResult model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<OcrResultAttributes>>} OcrResult model
 *
 * @example
 * ```typescript
 * const OcrModel = createOcrResultModel(sequelize);
 * const result = await OcrModel.create({
 *   documentId: 'doc-uuid',
 *   engine: 'google-vision',
 *   language: 'en',
 *   fullText: 'Extracted text...',
 *   confidence: 0.95,
 *   pageCount: 5,
 *   processingTime: 3500
 * });
 * ```
 */
export declare const createOcrResultModel: (sequelize: Sequelize) => any;
/**
 * Creates ExtractedTable model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ExtractedTableAttributes>>} ExtractedTable model
 *
 * @example
 * ```typescript
 * const TableModel = createExtractedTableModel(sequelize);
 * const table = await TableModel.create({
 *   ocrResultId: 'ocr-uuid',
 *   documentId: 'doc-uuid',
 *   pageNumber: 2,
 *   tableIndex: 0,
 *   rowCount: 10,
 *   columnCount: 5,
 *   hasHeaders: true,
 *   extractionMethod: 'ai-detection',
 *   tableData: { rows: [...] },
 *   confidence: 0.92
 * });
 * ```
 */
export declare const createExtractedTableModel: (sequelize: Sequelize) => any;
/**
 * Creates HandwritingRecognition model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<HandwritingRecognitionAttributes>>} HandwritingRecognition model
 *
 * @example
 * ```typescript
 * const HandwritingModel = createHandwritingRecognitionModel(sequelize);
 * const recognition = await HandwritingModel.create({
 *   documentId: 'doc-uuid',
 *   pageNumber: 1,
 *   recognizedText: 'Patient notes...',
 *   model: 'google-handwriting',
 *   confidence: 0.88,
 *   processingTime: 2100
 * });
 * ```
 */
export declare const createHandwritingRecognitionModel: (sequelize: Sequelize) => any;
/**
 * 1. Performs OCR using Tesseract engine.
 *
 * @param {Buffer} imageBuffer - Image to process
 * @param {OcrConfig} [config] - OCR configuration
 * @returns {Promise<OcrResult>} OCR result with text and confidence
 *
 * @example
 * ```typescript
 * const result = await performTesseractOcr(imageBuffer, {
 *   engine: 'tesseract',
 *   language: 'eng',
 *   pageSegMode: 1,
 *   preprocessing: ['denoise', 'deskew']
 * });
 * console.log('Extracted text:', result.text);
 * console.log('Confidence:', result.confidence);
 * ```
 */
export declare const performTesseractOcr: (imageBuffer: Buffer, config?: OcrConfig) => Promise<OcrResult>;
/**
 * 2. Performs OCR using Google Cloud Vision API.
 *
 * @param {Buffer} imageBuffer - Image to process
 * @param {OcrConfig} config - OCR configuration with API credentials
 * @returns {Promise<OcrResult>} OCR result with enhanced features
 *
 * @example
 * ```typescript
 * const result = await performGoogleVisionOcr(imageBuffer, {
 *   engine: 'google-vision',
 *   apiKey: process.env.GOOGLE_CLOUD_API_KEY,
 *   language: ['en', 'es'],
 *   confidenceThreshold: 0.85
 * });
 * console.log('Pages processed:', result.pages?.length);
 * ```
 */
export declare const performGoogleVisionOcr: (imageBuffer: Buffer, config: OcrConfig) => Promise<OcrResult>;
/**
 * 3. Performs OCR using AWS Textract.
 *
 * @param {Buffer} documentBuffer - Document to process (PDF or image)
 * @param {OcrConfig} config - OCR configuration with AWS credentials
 * @returns {Promise<OcrResult>} OCR result with forms and tables
 *
 * @example
 * ```typescript
 * const result = await performAwsTextractOcr(pdfBuffer, {
 *   engine: 'aws-textract',
 *   apiKey: process.env.AWS_ACCESS_KEY_ID,
 *   apiEndpoint: 'us-east-1'
 * });
 * console.log('Document type:', result.metadata?.documentType);
 * ```
 */
export declare const performAwsTextractOcr: (documentBuffer: Buffer, config: OcrConfig) => Promise<OcrResult>;
/**
 * 4. Performs multi-engine OCR with consensus voting.
 *
 * @param {Buffer} imageBuffer - Image to process
 * @param {OcrEngine[]} engines - List of engines to use
 * @param {OcrConfig[]} configs - Configuration for each engine
 * @returns {Promise<OcrResult>} Combined OCR result with highest confidence
 *
 * @example
 * ```typescript
 * const result = await performMultiEngineOcr(
 *   imageBuffer,
 *   ['tesseract', 'google-vision', 'aws-textract'],
 *   [tesseractConfig, googleConfig, textractConfig]
 * );
 * console.log('Consensus confidence:', result.confidence);
 * ```
 */
export declare const performMultiEngineOcr: (imageBuffer: Buffer, engines: OcrEngine[], configs: OcrConfig[]) => Promise<OcrResult>;
/**
 * 5. Preprocesses image for improved OCR accuracy.
 *
 * @param {Buffer} imageBuffer - Image to preprocess
 * @param {PreprocessingConfig} config - Preprocessing operations
 * @returns {Promise<Buffer>} Preprocessed image buffer
 *
 * @example
 * ```typescript
 * const preprocessed = await preprocessImageForOcr(imageBuffer, {
 *   operations: ['denoise', 'deskew', 'binarize', 'contrast-enhance'],
 *   denoiseFactor: 2,
 *   binarizeThreshold: 128
 * });
 * const result = await performTesseractOcr(preprocessed);
 * ```
 */
export declare const preprocessImageForOcr: (imageBuffer: Buffer, config: PreprocessingConfig) => Promise<Buffer>;
/**
 * 6. Detects and extracts text from specific regions.
 *
 * @param {Buffer} imageBuffer - Image to process
 * @param {BoundingBox[]} regions - Regions to extract text from
 * @param {OcrConfig} config - OCR configuration
 * @returns {Promise<Array<{ region: BoundingBox; text: string; confidence: number }>>} Text from each region
 *
 * @example
 * ```typescript
 * const regions = [
 *   { x: 100, y: 100, width: 300, height: 50 }, // Patient name field
 *   { x: 100, y: 200, width: 300, height: 50 }  // Date field
 * ];
 * const results = await extractTextFromRegions(imageBuffer, regions, ocrConfig);
 * ```
 */
export declare const extractTextFromRegions: (imageBuffer: Buffer, regions: BoundingBox[], config: OcrConfig) => Promise<Array<{
    region: BoundingBox;
    text: string;
    confidence: number;
}>>;
/**
 * 7. Performs OCR on PDF document with multiple pages.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {OcrConfig} config - OCR configuration
 * @returns {Promise<OcrResult>} OCR result with per-page data
 *
 * @example
 * ```typescript
 * const result = await performPdfOcr(pdfBuffer, {
 *   engine: 'google-vision',
 *   language: 'en',
 *   dpi: 300
 * });
 * console.log(`Processed ${result.pages?.length} pages`);
 * ```
 */
export declare const performPdfOcr: (pdfBuffer: Buffer, config: OcrConfig) => Promise<OcrResult>;
/**
 * 8. Detects tables in document image.
 *
 * @param {Buffer} imageBuffer - Document image
 * @param {TableExtractionMethod} [method] - Detection method
 * @returns {Promise<BoundingBox[]>} Bounding boxes of detected tables
 *
 * @example
 * ```typescript
 * const tables = await detectTablesInDocument(imageBuffer, 'ai-detection');
 * console.log(`Found ${tables.length} tables`);
 * ```
 */
export declare const detectTablesInDocument: (imageBuffer: Buffer, method?: TableExtractionMethod) => Promise<BoundingBox[]>;
/**
 * 9. Extracts table data with structure preservation.
 *
 * @param {Buffer} imageBuffer - Image containing table
 * @param {BoundingBox} tableBoundingBox - Table location
 * @param {TableExtractionMethod} method - Extraction method
 * @returns {Promise<ExtractedTable>} Structured table data
 *
 * @example
 * ```typescript
 * const table = await extractTableData(imageBuffer, tableBox, 'lattice');
 * console.log(`Table has ${table.rows.length} rows and ${table.columns} columns`);
 * ```
 */
export declare const extractTableData: (imageBuffer: Buffer, tableBoundingBox: BoundingBox, method: TableExtractionMethod) => Promise<ExtractedTable>;
/**
 * 10. Converts extracted table to CSV format.
 *
 * @param {ExtractedTable} table - Extracted table structure
 * @param {boolean} [includeHeaders] - Whether to include header row
 * @returns {string} CSV representation of table
 *
 * @example
 * ```typescript
 * const csvData = convertTableToCsv(extractedTable, true);
 * await fs.writeFile('table.csv', csvData);
 * ```
 */
export declare const convertTableToCsv: (table: ExtractedTable, includeHeaders?: boolean) => string;
/**
 * 11. Converts extracted table to JSON format.
 *
 * @param {ExtractedTable} table - Extracted table structure
 * @param {boolean} [useHeaders] - Whether to use headers as keys
 * @returns {string} JSON representation of table
 *
 * @example
 * ```typescript
 * const jsonData = convertTableToJson(extractedTable, true);
 * const tableArray = JSON.parse(jsonData);
 * ```
 */
export declare const convertTableToJson: (table: ExtractedTable, useHeaders?: boolean) => string;
/**
 * 12. Detects merged cells in table.
 *
 * @param {ExtractedTable} table - Extracted table
 * @returns {Array<{ row: number; col: number; rowSpan: number; colSpan: number }>} Merged cell information
 *
 * @example
 * ```typescript
 * const mergedCells = detectMergedCells(extractedTable);
 * console.log('Merged cells:', mergedCells);
 * ```
 */
export declare const detectMergedCells: (table: ExtractedTable) => Array<{
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;
}>;
/**
 * 13. Validates table extraction quality.
 *
 * @param {ExtractedTable} table - Extracted table
 * @returns {{ valid: boolean; issues: string[]; quality: number }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTableExtraction(extractedTable);
 * if (!validation.valid) {
 *   console.warn('Table extraction issues:', validation.issues);
 * }
 * ```
 */
export declare const validateTableExtraction: (table: ExtractedTable) => {
    valid: boolean;
    issues: string[];
    quality: number;
};
/**
 * 14. Extracts tables from multi-page PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document
 * @param {TableExtractionMethod} method - Extraction method
 * @returns {Promise<ExtractedTable[]>} All tables from document
 *
 * @example
 * ```typescript
 * const tables = await extractTablesFromPdf(pdfBuffer, 'ai-detection');
 * console.log(`Extracted ${tables.length} tables from PDF`);
 * ```
 */
export declare const extractTablesFromPdf: (pdfBuffer: Buffer, method: TableExtractionMethod) => Promise<ExtractedTable[]>;
/**
 * 15. Recognizes handwritten text in image.
 *
 * @param {Buffer} imageBuffer - Image with handwriting
 * @param {HandwritingModel} model - Recognition model
 * @param {string} [language] - Language code
 * @returns {Promise<HandwritingResult>} Recognition result
 *
 * @example
 * ```typescript
 * const result = await recognizeHandwriting(imageBuffer, 'google-handwriting', 'en');
 * console.log('Recognized text:', result.text);
 * console.log('Confidence:', result.confidence);
 * ```
 */
export declare const recognizeHandwriting: (imageBuffer: Buffer, model: HandwritingModel, language?: string) => Promise<HandwritingResult>;
/**
 * 16. Detects handwritten regions in document.
 *
 * @param {Buffer} imageBuffer - Document image
 * @returns {Promise<BoundingBox[]>} Bounding boxes of handwritten regions
 *
 * @example
 * ```typescript
 * const handwritingRegions = await detectHandwritingRegions(imageBuffer);
 * for (const region of handwritingRegions) {
 *   const text = await recognizeHandwriting(imageBuffer, 'google-handwriting');
 * }
 * ```
 */
export declare const detectHandwritingRegions: (imageBuffer: Buffer) => Promise<BoundingBox[]>;
/**
 * 17. Recognizes cursive handwriting.
 *
 * @param {Buffer} imageBuffer - Image with cursive text
 * @param {HandwritingModel} model - Recognition model
 * @returns {Promise<HandwritingResult>} Recognition result
 *
 * @example
 * ```typescript
 * const result = await recognizeCursiveHandwriting(signatureBuffer, 'google-handwriting');
 * console.log('Cursive text:', result.text);
 * ```
 */
export declare const recognizeCursiveHandwriting: (imageBuffer: Buffer, model: HandwritingModel) => Promise<HandwritingResult>;
/**
 * 18. Recognizes medical notation and abbreviations.
 *
 * @param {Buffer} imageBuffer - Medical document with handwriting
 * @param {HandwritingModel} model - Recognition model
 * @returns {Promise<HandwritingResult>} Recognition with medical context
 *
 * @example
 * ```typescript
 * const result = await recognizeMedicalHandwriting(prescriptionBuffer, 'google-handwriting');
 * // Recognizes medical abbreviations like "bid", "prn", "mg", etc.
 * ```
 */
export declare const recognizeMedicalHandwriting: (imageBuffer: Buffer, model: HandwritingModel) => Promise<HandwritingResult>;
/**
 * 19. Compares handwriting samples for verification.
 *
 * @param {Buffer} sample1 - First handwriting sample
 * @param {Buffer} sample2 - Second handwriting sample
 * @returns {Promise<{ match: boolean; similarity: number }>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareHandwritingSamples(signature1, signature2);
 * if (comparison.similarity > 0.85) {
 *   console.log('Signatures match');
 * }
 * ```
 */
export declare const compareHandwritingSamples: (sample1: Buffer, sample2: Buffer) => Promise<{
    match: boolean;
    similarity: number;
}>;
/**
 * 20. Extracts signature from document.
 *
 * @param {Buffer} imageBuffer - Document with signature
 * @returns {Promise<{ signatureBuffer: Buffer; boundingBox: BoundingBox; confidence: number }>} Signature data
 *
 * @example
 * ```typescript
 * const signature = await extractSignature(consentFormBuffer);
 * await saveSignatureImage(signature.signatureBuffer);
 * ```
 */
export declare const extractSignature: (imageBuffer: Buffer) => Promise<{
    signatureBuffer: Buffer;
    boundingBox: BoundingBox;
    confidence: number;
}>;
/**
 * 21. Analyzes document layout and structure.
 *
 * @param {Buffer} imageBuffer - Document image
 * @returns {Promise<LayoutAnalysis>} Layout analysis result
 *
 * @example
 * ```typescript
 * const layout = await analyzeDocumentLayout(imageBuffer);
 * console.log('Columns:', layout.columns);
 * console.log('Orientation:', layout.orientation);
 * ```
 */
export declare const analyzeDocumentLayout: (imageBuffer: Buffer) => Promise<LayoutAnalysis>;
/**
 * 22. Detects document orientation and rotates if needed.
 *
 * @param {Buffer} imageBuffer - Document image
 * @returns {Promise<{ rotatedBuffer: Buffer; angle: number }>} Corrected image
 *
 * @example
 * ```typescript
 * const { rotatedBuffer, angle } = await detectAndCorrectOrientation(imageBuffer);
 * console.log(`Rotated ${angle} degrees`);
 * ```
 */
export declare const detectAndCorrectOrientation: (imageBuffer: Buffer) => Promise<{
    rotatedBuffer: Buffer;
    angle: number;
}>;
/**
 * 23. Segments document into logical sections.
 *
 * @param {Buffer} imageBuffer - Document image
 * @param {OcrResult} ocrResult - OCR result with bounding boxes
 * @returns {Promise<Array<{ type: string; boundingBox: BoundingBox; text: string }>>} Document sections
 *
 * @example
 * ```typescript
 * const sections = await segmentDocument(imageBuffer, ocrResult);
 * for (const section of sections) {
 *   console.log(`${section.type}: ${section.text.substring(0, 50)}...`);
 * }
 * ```
 */
export declare const segmentDocument: (imageBuffer: Buffer, ocrResult: OcrResult) => Promise<Array<{
    type: string;
    boundingBox: BoundingBox;
    text: string;
}>>;
/**
 * 24. Detects and extracts headers and footers.
 *
 * @param {Buffer} imageBuffer - Document image
 * @returns {Promise<{ headers: string[]; footers: string[] }>} Headers and footers
 *
 * @example
 * ```typescript
 * const { headers, footers } = await detectHeadersFooters(imageBuffer);
 * console.log('Page header:', headers[0]);
 * ```
 */
export declare const detectHeadersFooters: (imageBuffer: Buffer) => Promise<{
    headers: string[];
    footers: string[];
}>;
/**
 * 25. Identifies form fields and checkboxes.
 *
 * @param {Buffer} imageBuffer - Form image
 * @returns {Promise<FormFieldDetection>} Detected form fields
 *
 * @example
 * ```typescript
 * const formData = await identifyFormFields(imageBuffer);
 * for (const field of formData.fields) {
 *   console.log(`${field.label}: ${field.value}`);
 * }
 * ```
 */
export declare const identifyFormFields: (imageBuffer: Buffer) => Promise<FormFieldDetection>;
/**
 * 26. Reconstructs reading order for complex layouts.
 *
 * @param {PageOcrResult} pageResult - Page OCR result
 * @returns {string} Text in correct reading order
 *
 * @example
 * ```typescript
 * const orderedText = reconstructReadingOrder(pageOcrResult);
 * // Text follows natural reading flow despite complex layout
 * ```
 */
export declare const reconstructReadingOrder: (pageResult: PageOcrResult) => string;
/**
 * 27. Calculates detailed confidence scores.
 *
 * @param {OcrResult} ocrResult - OCR result to analyze
 * @returns {ConfidenceScore} Detailed confidence breakdown
 *
 * @example
 * ```typescript
 * const confidence = calculateConfidenceScore(ocrResult);
 * console.log('Overall:', confidence.overall);
 * console.log('Word-level:', confidence.wordLevel);
 * ```
 */
export declare const calculateConfidenceScore: (ocrResult: OcrResult) => ConfidenceScore;
/**
 * 28. Validates OCR result quality.
 *
 * @param {OcrResult} ocrResult - OCR result to validate
 * @param {number} [minConfidence] - Minimum acceptable confidence
 * @returns {{ valid: boolean; issues: string[]; quality: 'high' | 'medium' | 'low' }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateOcrQuality(ocrResult, 0.8);
 * if (!validation.valid) {
 *   console.warn('OCR quality issues:', validation.issues);
 * }
 * ```
 */
export declare const validateOcrQuality: (ocrResult: OcrResult, minConfidence?: number) => {
    valid: boolean;
    issues: string[];
    quality: "high" | "medium" | "low";
};
/**
 * 29. Detects potential OCR errors using heuristics.
 *
 * @param {string} text - OCR extracted text
 * @returns {Array<{ type: string; position: number; suggestion?: string }>} Detected errors
 *
 * @example
 * ```typescript
 * const errors = detectOcrErrors(ocrResult.text);
 * for (const error of errors) {
 *   console.log(`Error at position ${error.position}: ${error.type}`);
 * }
 * ```
 */
export declare const detectOcrErrors: (text: string) => Array<{
    type: string;
    position: number;
    suggestion?: string;
}>;
/**
 * 30. Applies spell checking to OCR results.
 *
 * @param {string} text - OCR extracted text
 * @param {string} [dictionary] - Dictionary name (medical, general)
 * @returns {Promise<{ correctedText: string; corrections: Array<{ original: string; corrected: string; confidence: number }> }>} Spell-checked text
 *
 * @example
 * ```typescript
 * const { correctedText, corrections } = await applySpellCheck(ocrResult.text, 'medical');
 * console.log('Applied', corrections.length, 'corrections');
 * ```
 */
export declare const applySpellCheck: (text: string, dictionary?: string) => Promise<{
    correctedText: string;
    corrections: Array<{
        original: string;
        corrected: string;
        confidence: number;
    }>;
}>;
/**
 * 31. Benchmarks OCR engine performance.
 *
 * @param {OcrEngine[]} engines - Engines to benchmark
 * @param {Buffer[]} testImages - Test images
 * @param {OcrConfig[]} configs - Configurations for each engine
 * @returns {Promise<Array<{ engine: OcrEngine; avgConfidence: number; avgTime: number; accuracy?: number }>>} Benchmark results
 *
 * @example
 * ```typescript
 * const results = await benchmarkOcrEngines(
 *   ['tesseract', 'google-vision'],
 *   testImages,
 *   [tesseractConfig, googleConfig]
 * );
 * console.log('Best engine:', results[0].engine);
 * ```
 */
export declare const benchmarkOcrEngines: (engines: OcrEngine[], testImages: Buffer[], configs: OcrConfig[]) => Promise<Array<{
    engine: OcrEngine;
    avgConfidence: number;
    avgTime: number;
    accuracy?: number;
}>>;
/**
 * 32. Creates batch OCR job.
 *
 * @param {BatchOcrJob} jobConfig - Batch job configuration
 * @returns {Promise<string>} Job ID
 *
 * @example
 * ```typescript
 * const jobId = await createBatchOcrJob({
 *   jobId: crypto.randomUUID(),
 *   documents: [
 *     { documentId: 'doc1', fileBuffer: buffer1 },
 *     { documentId: 'doc2', fileBuffer: buffer2 }
 *   ],
 *   config: ocrConfig,
 *   priority: 'high'
 * });
 * ```
 */
export declare const createBatchOcrJob: (jobConfig: BatchOcrJob) => Promise<string>;
/**
 * 33. Processes batch OCR job.
 *
 * @param {string} jobId - Job identifier
 * @returns {Promise<BatchOcrJobStatus>} Job processing status
 *
 * @example
 * ```typescript
 * const status = await processBatchOcrJob(jobId);
 * console.log(`Processed ${status.processedDocuments}/${status.totalDocuments} documents`);
 * ```
 */
export declare const processBatchOcrJob: (jobId: string) => Promise<BatchOcrJobStatus>;
/**
 * 34. Gets batch OCR job status.
 *
 * @param {string} jobId - Job identifier
 * @returns {Promise<BatchOcrJobStatus>} Current job status
 *
 * @example
 * ```typescript
 * const status = await getBatchOcrJobStatus(jobId);
 * if (status.status === 'completed') {
 *   console.log('Job finished:', status.results);
 * }
 * ```
 */
export declare const getBatchOcrJobStatus: (jobId: string) => Promise<BatchOcrJobStatus>;
/**
 * 35. Cancels batch OCR job.
 *
 * @param {string} jobId - Job identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelBatchOcrJob(jobId);
 * console.log('Job cancelled');
 * ```
 */
export declare const cancelBatchOcrJob: (jobId: string) => Promise<void>;
/**
 * 36. Processes documents in parallel batches.
 *
 * @param {Buffer[]} documents - Documents to process
 * @param {OcrConfig} config - OCR configuration
 * @param {number} [batchSize] - Number of documents per batch
 * @returns {Promise<OcrResult[]>} OCR results for all documents
 *
 * @example
 * ```typescript
 * const results = await processDocumentsInBatches(documentBuffers, ocrConfig, 5);
 * console.log(`Processed ${results.length} documents`);
 * ```
 */
export declare const processDocumentsInBatches: (documents: Buffer[], config: OcrConfig, batchSize?: number) => Promise<OcrResult[]>;
/**
 * 37. Monitors OCR processing queue.
 *
 * @returns {Promise<{ pending: number; processing: number; completed: number; failed: number }>} Queue statistics
 *
 * @example
 * ```typescript
 * const stats = await monitorOcrQueue();
 * console.log(`Queue: ${stats.pending} pending, ${stats.processing} processing`);
 * ```
 */
export declare const monitorOcrQueue: () => Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
}>;
/**
 * 38. Optimizes image batch for OCR processing.
 *
 * @param {Buffer[]} images - Images to optimize
 * @param {PreprocessingConfig} config - Preprocessing configuration
 * @returns {Promise<Buffer[]>} Optimized images ready for OCR
 *
 * @example
 * ```typescript
 * const optimized = await optimizeImageBatch(imageBuffers, {
 *   operations: ['denoise', 'deskew', 'contrast-enhance'],
 *   denoiseFactor: 2
 * });
 * const results = await processDocumentsInBatches(optimized, ocrConfig);
 * ```
 */
export declare const optimizeImageBatch: (images: Buffer[], config: PreprocessingConfig) => Promise<Buffer[]>;
declare const _default: {
    createOcrResultModel: (sequelize: Sequelize) => any;
    createExtractedTableModel: (sequelize: Sequelize) => any;
    createHandwritingRecognitionModel: (sequelize: Sequelize) => any;
    performTesseractOcr: (imageBuffer: Buffer, config?: OcrConfig) => Promise<OcrResult>;
    performGoogleVisionOcr: (imageBuffer: Buffer, config: OcrConfig) => Promise<OcrResult>;
    performAwsTextractOcr: (documentBuffer: Buffer, config: OcrConfig) => Promise<OcrResult>;
    performMultiEngineOcr: (imageBuffer: Buffer, engines: OcrEngine[], configs: OcrConfig[]) => Promise<OcrResult>;
    preprocessImageForOcr: (imageBuffer: Buffer, config: PreprocessingConfig) => Promise<Buffer>;
    extractTextFromRegions: (imageBuffer: Buffer, regions: BoundingBox[], config: OcrConfig) => Promise<Array<{
        region: BoundingBox;
        text: string;
        confidence: number;
    }>>;
    performPdfOcr: (pdfBuffer: Buffer, config: OcrConfig) => Promise<OcrResult>;
    detectTablesInDocument: (imageBuffer: Buffer, method?: TableExtractionMethod) => Promise<BoundingBox[]>;
    extractTableData: (imageBuffer: Buffer, tableBoundingBox: BoundingBox, method: TableExtractionMethod) => Promise<ExtractedTable>;
    convertTableToCsv: (table: ExtractedTable, includeHeaders?: boolean) => string;
    convertTableToJson: (table: ExtractedTable, useHeaders?: boolean) => string;
    detectMergedCells: (table: ExtractedTable) => Array<{
        row: number;
        col: number;
        rowSpan: number;
        colSpan: number;
    }>;
    validateTableExtraction: (table: ExtractedTable) => {
        valid: boolean;
        issues: string[];
        quality: number;
    };
    extractTablesFromPdf: (pdfBuffer: Buffer, method: TableExtractionMethod) => Promise<ExtractedTable[]>;
    recognizeHandwriting: (imageBuffer: Buffer, model: HandwritingModel, language?: string) => Promise<HandwritingResult>;
    detectHandwritingRegions: (imageBuffer: Buffer) => Promise<BoundingBox[]>;
    recognizeCursiveHandwriting: (imageBuffer: Buffer, model: HandwritingModel) => Promise<HandwritingResult>;
    recognizeMedicalHandwriting: (imageBuffer: Buffer, model: HandwritingModel) => Promise<HandwritingResult>;
    compareHandwritingSamples: (sample1: Buffer, sample2: Buffer) => Promise<{
        match: boolean;
        similarity: number;
    }>;
    extractSignature: (imageBuffer: Buffer) => Promise<{
        signatureBuffer: Buffer;
        boundingBox: BoundingBox;
        confidence: number;
    }>;
    analyzeDocumentLayout: (imageBuffer: Buffer) => Promise<LayoutAnalysis>;
    detectAndCorrectOrientation: (imageBuffer: Buffer) => Promise<{
        rotatedBuffer: Buffer;
        angle: number;
    }>;
    segmentDocument: (imageBuffer: Buffer, ocrResult: OcrResult) => Promise<Array<{
        type: string;
        boundingBox: BoundingBox;
        text: string;
    }>>;
    detectHeadersFooters: (imageBuffer: Buffer) => Promise<{
        headers: string[];
        footers: string[];
    }>;
    identifyFormFields: (imageBuffer: Buffer) => Promise<FormFieldDetection>;
    reconstructReadingOrder: (pageResult: PageOcrResult) => string;
    calculateConfidenceScore: (ocrResult: OcrResult) => ConfidenceScore;
    validateOcrQuality: (ocrResult: OcrResult, minConfidence?: number) => {
        valid: boolean;
        issues: string[];
        quality: "high" | "medium" | "low";
    };
    detectOcrErrors: (text: string) => Array<{
        type: string;
        position: number;
        suggestion?: string;
    }>;
    applySpellCheck: (text: string, dictionary?: string) => Promise<{
        correctedText: string;
        corrections: Array<{
            original: string;
            corrected: string;
            confidence: number;
        }>;
    }>;
    benchmarkOcrEngines: (engines: OcrEngine[], testImages: Buffer[], configs: OcrConfig[]) => Promise<Array<{
        engine: OcrEngine;
        avgConfidence: number;
        avgTime: number;
        accuracy?: number;
    }>>;
    createBatchOcrJob: (jobConfig: BatchOcrJob) => Promise<string>;
    processBatchOcrJob: (jobId: string) => Promise<BatchOcrJobStatus>;
    getBatchOcrJobStatus: (jobId: string) => Promise<BatchOcrJobStatus>;
    cancelBatchOcrJob: (jobId: string) => Promise<void>;
    processDocumentsInBatches: (documents: Buffer[], config: OcrConfig, batchSize?: number) => Promise<OcrResult[]>;
    monitorOcrQueue: () => Promise<{
        pending: number;
        processing: number;
        completed: number;
        failed: number;
    }>;
    optimizeImageBatch: (images: Buffer[], config: PreprocessingConfig) => Promise<Buffer[]>;
};
export default _default;
//# sourceMappingURL=document-advanced-ocr-kit.d.ts.map