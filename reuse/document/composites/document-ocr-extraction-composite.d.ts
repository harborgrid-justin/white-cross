/**
 * LOC: DOCOCREXT001
 * File: /reuse/document/composites/document-ocr-extraction-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - tesseract.js (OCR engine)
 *   - sharp (image processing)
 *   - pdf-parse (PDF text extraction)
 *   - natural (NLP processing)
 *   - ../document-storage-kit
 *   - ../document-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - OCR processing services
 *   - Document digitization modules
 *   - Data extraction pipelines
 *   - Medical record parsing services
 *   - Invoice processing systems
 *   - Healthcare document intelligence dashboards
 */
/**
 * File: /reuse/document/composites/document-ocr-extraction-composite.ts
 * Locator: WC-OCR-EXTRACTION-COMPOSITE-001
 * Purpose: Comprehensive OCR & Text Extraction Composite - Production-ready optical character recognition, data extraction, and AI intelligence
 *
 * Upstream: Independent utility module for OCR and text extraction operations
 * Downstream: ../backend/*, OCR services, Extraction pipelines, NLP processors, Document intelligence, Medical record parsers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, tesseract.js 4.x, sharp 0.32+, natural 6.x
 * Exports: 45 utility functions for OCR, text extraction, image preprocessing, data parsing, NLP analysis, entity extraction
 *
 * LLM Context: Enterprise-grade OCR and extraction composite for White Cross healthcare platform.
 * Provides comprehensive document intelligence capabilities including multi-language OCR with Tesseract,
 * advanced image preprocessing (deskew, denoise, binarization, contrast enhancement), intelligent text
 * extraction from PDFs and images, structured data parsing from invoices/receipts/medical records,
 * handwriting detection and transcription, barcode/QR code recognition, NLP-powered entity extraction
 * (dates, amounts, names, addresses), document classification, keyword extraction, sentiment analysis,
 * spell checking, accuracy improvement, batch processing, and full-text search indexing. Exceeds Adobe
 * Acrobat and ABBYY FineReader capabilities with healthcare-specific parsing for medical records,
 * prescriptions, lab reports, and insurance claims. Supports HIPAA-compliant data extraction with
 * audit logging and quality validation. Essential for digital document transformation, automated data
 * entry, medical record digitization, and intelligent document processing workflows.
 */
import { Model } from 'sequelize-typescript';
/**
 * OCR engine types
 */
export declare enum OCREngine {
    TESSERACT = "TESSERACT",
    GOOGLE_VISION = "GOOGLE_VISION",
    AWS_TEXTRACT = "AWS_TEXTRACT",
    AZURE_VISION = "AZURE_VISION",
    ABBYY = "ABBYY"
}
/**
 * Document data types for extraction
 */
export declare enum DocumentDataType {
    TEXT = "TEXT",
    TABLE = "TABLE",
    FORM = "FORM",
    IMAGE = "IMAGE",
    MIXED = "MIXED"
}
/**
 * Supported languages for OCR
 */
export declare enum OCRLanguage {
    ENGLISH = "eng",
    SPANISH = "spa",
    FRENCH = "fra",
    GERMAN = "deu",
    CHINESE_SIMPLIFIED = "chi_sim",
    CHINESE_TRADITIONAL = "chi_tra",
    JAPANESE = "jpn",
    KOREAN = "kor",
    ARABIC = "ara",
    RUSSIAN = "rus",
    PORTUGUESE = "por",
    ITALIAN = "ita"
}
/**
 * Image preprocessing operations
 */
export declare enum PreprocessingOperation {
    DESKEW = "DESKEW",
    DENOISE = "DENOISE",
    BINARIZE = "BINARIZE",
    ENHANCE_CONTRAST = "ENHANCE_CONTRAST",
    NORMALIZE = "NORMALIZE",
    SHARPEN = "SHARPEN",
    RESIZE = "RESIZE"
}
/**
 * Document classification types
 */
export declare enum DocumentClassification {
    INVOICE = "INVOICE",
    RECEIPT = "RECEIPT",
    MEDICAL_RECORD = "MEDICAL_RECORD",
    PRESCRIPTION = "PRESCRIPTION",
    LAB_REPORT = "LAB_REPORT",
    INSURANCE_CLAIM = "INSURANCE_CLAIM",
    CONTRACT = "CONTRACT",
    LETTER = "LETTER",
    FORM = "FORM",
    UNKNOWN = "UNKNOWN"
}
/**
 * Entity types for extraction
 */
export declare enum EntityType {
    PERSON = "PERSON",
    ORGANIZATION = "ORGANIZATION",
    LOCATION = "LOCATION",
    DATE = "DATE",
    TIME = "TIME",
    MONEY = "MONEY",
    PERCENTAGE = "PERCENTAGE",
    PHONE_NUMBER = "PHONE_NUMBER",
    EMAIL = "EMAIL",
    ADDRESS = "ADDRESS",
    MEDICAL_CODE = "MEDICAL_CODE",
    MEDICATION = "MEDICATION"
}
/**
 * OCR result structure
 */
export interface OCRResult {
    text: string;
    confidence: number;
    language: OCRLanguage;
    boundingBox?: BoundingBox;
    words?: WordRecognition[];
    lines?: LineRecognition[];
    paragraphs?: ParagraphRecognition[];
    metadata?: Record<string, any>;
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
 * Word recognition result
 */
export interface WordRecognition {
    text: string;
    confidence: number;
    boundingBox: BoundingBox;
}
/**
 * Line recognition result
 */
export interface LineRecognition {
    text: string;
    confidence: number;
    words: WordRecognition[];
    boundingBox: BoundingBox;
}
/**
 * Paragraph recognition result
 */
export interface ParagraphRecognition {
    text: string;
    confidence: number;
    lines: LineRecognition[];
    boundingBox: BoundingBox;
}
/**
 * Extracted data structure
 */
export interface ExtractedData {
    type: DocumentDataType;
    fields: Record<string, any>;
    tables: TableData[];
    forms: FormData[];
    confidence: number;
    metadata?: Record<string, any>;
}
/**
 * Table data structure
 */
export interface TableData {
    headers: string[];
    rows: string[][];
    boundingBox?: BoundingBox;
    confidence: number;
}
/**
 * Form data structure
 */
export interface FormData {
    fields: FormField[];
    confidence: number;
}
/**
 * Form field
 */
export interface FormField {
    label: string;
    value: string;
    type: string;
    confidence: number;
    boundingBox?: BoundingBox;
}
/**
 * OCR configuration
 */
export interface OCRConfig {
    engine: OCREngine;
    language: OCRLanguage[];
    preprocessingSteps: PreprocessingOperation[];
    confidenceThreshold: number;
    pageSegmentationMode?: number;
    ocrEngineMode?: number;
    whitelist?: string;
    blacklist?: string;
}
/**
 * Image preprocessing result
 */
export interface PreprocessingResult {
    processedImage: Buffer;
    operations: PreprocessingOperation[];
    improvements: {
        operation: PreprocessingOperation;
        metric: string;
        before: number;
        after: number;
    }[];
}
/**
 * Document parsing result
 */
export interface DocumentParseResult {
    documentType: DocumentClassification;
    extractedData: ExtractedData;
    confidence: number;
    processingTime: number;
    metadata?: Record<string, any>;
}
/**
 * Handwriting detection result
 */
export interface HandwritingDetectionResult {
    isHandwritten: boolean;
    confidence: number;
    regions: HandwritingRegion[];
}
/**
 * Handwriting region
 */
export interface HandwritingRegion {
    boundingBox: BoundingBox;
    confidence: number;
    text?: string;
}
/**
 * Quality validation result
 */
export interface QualityValidationResult {
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    overallConfidence: number;
    issues: QualityIssue[];
    recommendations: string[];
}
/**
 * Quality issue
 */
export interface QualityIssue {
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    affectedRegion?: BoundingBox;
}
/**
 * Entity extraction result
 */
export interface EntityExtractionResult {
    entities: ExtractedEntity[];
    relationships: EntityRelationship[];
}
/**
 * Extracted entity
 */
export interface ExtractedEntity {
    type: EntityType;
    value: string;
    confidence: number;
    position: {
        start: number;
        end: number;
    };
    metadata?: Record<string, any>;
}
/**
 * Entity relationship
 */
export interface EntityRelationship {
    source: string;
    target: string;
    type: string;
    confidence: number;
}
/**
 * Sentiment analysis result
 */
export interface SentimentAnalysisResult {
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
    aspects?: AspectSentiment[];
}
/**
 * Aspect sentiment
 */
export interface AspectSentiment {
    aspect: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
}
/**
 * Extraction metrics
 */
export interface ExtractionMetrics {
    totalDocuments: number;
    successfulExtractions: number;
    failedExtractions: number;
    averageConfidence: number;
    averageProcessingTime: number;
    accuracyRate: number;
    byDocumentType: Record<DocumentClassification, number>;
    byLanguage: Record<OCRLanguage, number>;
}
/**
 * OCR Result Model
 * Stores optical character recognition results and extracted text
 */
export declare class OCRResultModel extends Model {
    id: string;
    documentId: string;
    extractedText: string;
    confidence: number;
    language: OCRLanguage;
    engine: OCREngine;
    wordData?: WordRecognition[];
    lineData?: LineRecognition[];
    paragraphData?: ParagraphRecognition[];
    boundingBox?: BoundingBox;
    processingStatus: string;
    processingTime?: number;
    errorMessage?: string;
    metadata?: Record<string, any>;
}
/**
 * Extraction Job Model
 * Stores data extraction job configurations and results
 */
export declare class ExtractionJobModel extends Model {
    id: string;
    documentId: string;
    documentType: DocumentClassification;
    status: string;
    extractedData?: ExtractedData;
    confidence?: number;
    priority: number;
    ocrConfig?: OCRConfig;
    startedAt?: Date;
    completedAt?: Date;
    processingTime?: number;
    errorMessage?: string;
    metadata?: Record<string, any>;
}
/**
 * Document Intelligence Model
 * Stores AI-powered document analysis and entity extraction results
 */
export declare class DocumentIntelligenceModel extends Model {
    id: string;
    documentId: string;
    classification: DocumentClassification;
    classificationConfidence?: number;
    entities?: ExtractedEntity[];
    keywords?: string[];
    summary?: string;
    sentiment?: SentimentAnalysisResult;
    analysisType: string;
    metadata?: Record<string, any>;
}
/**
 * 1. Performs optical character recognition on image buffer.
 * Uses Tesseract.js for high-accuracy text recognition with configurable language support.
 *
 * @param {Buffer} imageBuffer - Image buffer containing document
 * @param {Partial<OCRConfig>} [config] - OCR configuration options
 * @returns {Promise<OCRResult>} OCR result with extracted text and confidence
 * @throws {Error} If image buffer is invalid or OCR engine fails
 *
 * @example
 * ```typescript
 * const result = await performOCR(imageBuffer, {
 *   engine: OCREngine.TESSERACT,
 *   language: [OCRLanguage.ENGLISH],
 *   confidenceThreshold: 60
 * });
 * console.log('Extracted text:', result.text);
 * console.log('Confidence:', result.confidence);
 * ```
 */
export declare const performOCR: (imageBuffer: Buffer, config?: Partial<OCRConfig>) => Promise<OCRResult>;
/**
 * 2. Extracts text content from PDF or document buffer.
 * Supports multi-page PDFs with layout preservation and formatting detection.
 *
 * @param {Buffer} documentBuffer - Document buffer (PDF, DOCX, etc.)
 * @param {Object} [options] - Extraction options
 * @returns {Promise<string>} Extracted text content
 * @throws {Error} If document format is unsupported or extraction fails
 *
 * @example
 * ```typescript
 * const text = await extractText(pdfBuffer, {
 *   preserveFormatting: true,
 *   removeHeaders: false
 * });
 * console.log('Extracted text:', text);
 * ```
 */
export declare const extractText: (documentBuffer: Buffer, options?: {
    preserveFormatting?: boolean;
    removeHeaders?: boolean;
}) => Promise<string>;
/**
 * 3. Recognizes language from text content using statistical analysis.
 * Supports detection of 100+ languages with confidence scoring.
 *
 * @param {string} text - Text content to analyze
 * @returns {Promise<{language: OCRLanguage; confidence: number}>} Detected language and confidence
 * @throws {Error} If text is empty or language detection fails
 *
 * @example
 * ```typescript
 * const result = await recognizeLanguage('Hello, this is a sample text.');
 * console.log('Detected language:', result.language); // OCRLanguage.ENGLISH
 * console.log('Confidence:', result.confidence); // 0.95
 * ```
 */
export declare const recognizeLanguage: (text: string) => Promise<{
    language: OCRLanguage;
    confidence: number;
}>;
/**
 * 4. Extracts table data from document with structure preservation.
 * Detects table boundaries, headers, and cell content automatically.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<TableData[]>} Array of extracted tables
 * @throws {Error} If document buffer is invalid or table detection fails
 *
 * @example
 * ```typescript
 * const tables = await extractTables(pdfBuffer);
 * tables.forEach((table, index) => {
 *   console.log(`Table ${index + 1}:`, table.headers);
 *   console.log('Rows:', table.rows);
 * });
 * ```
 */
export declare const extractTables: (documentBuffer: Buffer) => Promise<TableData[]>;
/**
 * 5. Extracts form fields and values from structured documents.
 * Identifies form labels, checkboxes, radio buttons, and text fields.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<FormData>} Extracted form data with field mappings
 * @throws {Error} If document buffer is invalid or form extraction fails
 *
 * @example
 * ```typescript
 * const formData = await extractForms(pdfBuffer);
 * formData.fields.forEach(field => {
 *   console.log(`${field.label}: ${field.value}`);
 * });
 * ```
 */
export declare const extractForms: (documentBuffer: Buffer) => Promise<FormData>;
/**
 * 6. Preprocesses image for optimal OCR accuracy.
 * Applies multiple enhancement techniques including deskewing, denoising, and contrast adjustment.
 *
 * @param {Buffer} imageBuffer - Input image buffer
 * @param {PreprocessingOperation[]} [operations] - Preprocessing operations to apply
 * @returns {Promise<PreprocessingResult>} Preprocessed image with improvement metrics
 * @throws {Error} If image buffer is invalid or preprocessing fails
 *
 * @example
 * ```typescript
 * const result = await preprocessImage(imageBuffer, [
 *   PreprocessingOperation.DESKEW,
 *   PreprocessingOperation.DENOISE,
 *   PreprocessingOperation.ENHANCE_CONTRAST
 * ]);
 * console.log('Processed image size:', result.processedImage.length);
 * console.log('Improvements:', result.improvements);
 * ```
 */
export declare const preprocessImage: (imageBuffer: Buffer, operations?: PreprocessingOperation[]) => Promise<PreprocessingResult>;
/**
 * 7. Deskews image to correct rotation and alignment.
 * Automatically detects skew angle and applies rotation correction.
 *
 * @param {Buffer} imageBuffer - Input image buffer
 * @returns {Promise<{image: Buffer; angle: number}>} Deskewed image and detected angle
 * @throws {Error} If deskewing fails
 *
 * @example
 * ```typescript
 * const result = await deskewImage(imageBuffer);
 * console.log('Detected skew angle:', result.angle);
 * ```
 */
export declare const deskewImage: (imageBuffer: Buffer) => Promise<{
    image: Buffer;
    angle: number;
}>;
/**
 * 8. Removes noise from image to improve OCR accuracy.
 * Applies median filtering and morphological operations.
 *
 * @param {Buffer} imageBuffer - Input image buffer
 * @param {number} [strength] - Noise removal strength (1-10)
 * @returns {Promise<Buffer>} Denoised image buffer
 * @throws {Error} If noise removal fails
 *
 * @example
 * ```typescript
 * const cleanImage = await removeNoise(imageBuffer, 5);
 * ```
 */
export declare const removeNoise: (imageBuffer: Buffer, strength?: number) => Promise<Buffer>;
/**
 * 9. Binarizes image to black and white for improved OCR.
 * Uses adaptive thresholding for optimal results.
 *
 * @param {Buffer} imageBuffer - Input image buffer
 * @param {number} [threshold] - Binarization threshold (0-255)
 * @returns {Promise<Buffer>} Binarized image buffer
 * @throws {Error} If binarization fails
 *
 * @example
 * ```typescript
 * const binaryImage = await binarizeImage(imageBuffer, 128);
 * ```
 */
export declare const binarizeImage: (imageBuffer: Buffer, threshold?: number) => Promise<Buffer>;
/**
 * 10. Enhances image contrast for better text visibility.
 * Applies histogram equalization and adaptive contrast enhancement.
 *
 * @param {Buffer} imageBuffer - Input image buffer
 * @param {number} [factor] - Contrast enhancement factor (1.0-3.0)
 * @returns {Promise<Buffer>} Contrast-enhanced image buffer
 * @throws {Error} If contrast enhancement fails
 *
 * @example
 * ```typescript
 * const enhancedImage = await enhanceContrast(imageBuffer, 1.5);
 * ```
 */
export declare const enhanceContrast: (imageBuffer: Buffer, factor?: number) => Promise<Buffer>;
/**
 * 11. Detects orientation of text in image.
 * Returns rotation angle needed to correct orientation.
 *
 * @param {Buffer} imageBuffer - Input image buffer
 * @returns {Promise<number>} Detected rotation angle in degrees (0, 90, 180, 270)
 * @throws {Error} If orientation detection fails
 *
 * @example
 * ```typescript
 * const angle = await detectOrientation(imageBuffer);
 * console.log('Image should be rotated by:', angle, 'degrees');
 * ```
 */
export declare const detectOrientation: (imageBuffer: Buffer) => Promise<number>;
/**
 * 12. Rotates image by specified angle.
 * Supports arbitrary rotation angles with quality preservation.
 *
 * @param {Buffer} imageBuffer - Input image buffer
 * @param {number} angle - Rotation angle in degrees
 * @returns {Promise<Buffer>} Rotated image buffer
 * @throws {Error} If rotation fails
 *
 * @example
 * ```typescript
 * const rotatedImage = await rotateImage(imageBuffer, 90);
 * ```
 */
export declare const rotateImage: (imageBuffer: Buffer, angle: number) => Promise<Buffer>;
/**
 * 13. Crops image to content boundaries, removing margins.
 * Automatically detects content area and removes empty space.
 *
 * @param {Buffer} imageBuffer - Input image buffer
 * @param {number} [padding] - Padding to keep around content in pixels
 * @returns {Promise<Buffer>} Cropped image buffer
 * @throws {Error} If cropping fails
 *
 * @example
 * ```typescript
 * const croppedImage = await cropToContent(imageBuffer, 10);
 * ```
 */
export declare const cropToContent: (imageBuffer: Buffer, padding?: number) => Promise<Buffer>;
/**
 * 14. Performs batch OCR on multiple images.
 * Processes images in parallel with configurable concurrency.
 *
 * @param {Buffer[]} imageBuffers - Array of image buffers
 * @param {Partial<OCRConfig>} [config] - OCR configuration
 * @param {number} [concurrency] - Number of parallel processes
 * @returns {Promise<OCRResult[]>} Array of OCR results
 * @throws {Error} If batch processing fails
 *
 * @example
 * ```typescript
 * const results = await batchOCR([image1, image2, image3], {
 *   language: [OCRLanguage.ENGLISH],
 *   confidenceThreshold: 70
 * }, 3);
 * console.log(`Processed ${results.length} images`);
 * ```
 */
export declare const batchOCR: (imageBuffers: Buffer[], config?: Partial<OCRConfig>, concurrency?: number) => Promise<OCRResult[]>;
/**
 * 15. Performs OCR with multiple language detection.
 * Automatically detects and processes text in multiple languages.
 *
 * @param {Buffer} imageBuffer - Image buffer
 * @param {OCRLanguage[]} languages - Supported languages to detect
 * @returns {Promise<OCRResult>} OCR result with detected languages
 * @throws {Error} If multi-language OCR fails
 *
 * @example
 * ```typescript
 * const result = await multiLanguageOCR(imageBuffer, [
 *   OCRLanguage.ENGLISH,
 *   OCRLanguage.SPANISH,
 *   OCRLanguage.FRENCH
 * ]);
 * console.log('Detected language:', result.language);
 * ```
 */
export declare const multiLanguageOCR: (imageBuffer: Buffer, languages: OCRLanguage[]) => Promise<OCRResult>;
/**
 * 16. Extracts structured data from document based on type.
 * Intelligently parses document-specific fields and values.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {DocumentClassification} documentType - Document type
 * @returns {Promise<ExtractedData>} Structured extracted data
 * @throws {Error} If extraction fails
 *
 * @example
 * ```typescript
 * const data = await extractStructuredData(pdfBuffer, DocumentClassification.INVOICE);
 * console.log('Invoice number:', data.fields.invoiceNumber);
 * console.log('Total amount:', data.fields.totalAmount);
 * ```
 */
export declare const extractStructuredData: (documentBuffer: Buffer, documentType: DocumentClassification) => Promise<ExtractedData>;
/**
 * 17. Parses invoice document and extracts financial data.
 * Extracts vendor info, line items, amounts, taxes, and totals.
 *
 * @param {Buffer} documentBuffer - Invoice document buffer
 * @returns {Promise<{vendor: string; invoiceNumber: string; date: string; lineItems: any[]; total: number}>} Parsed invoice data
 * @throws {Error} If invoice parsing fails
 *
 * @example
 * ```typescript
 * const invoice = await parseInvoice(pdfBuffer);
 * console.log('Vendor:', invoice.vendor);
 * console.log('Total:', invoice.total);
 * ```
 */
export declare const parseInvoice: (documentBuffer: Buffer) => Promise<{
    vendor: string;
    invoiceNumber: string;
    date: string;
    lineItems: any[];
    total: number;
}>;
/**
 * 18. Parses receipt and extracts purchase details.
 * Extracts merchant info, items, prices, and payment information.
 *
 * @param {Buffer} documentBuffer - Receipt document buffer
 * @returns {Promise<{merchant: string; date: string; items: any[]; total: number}>} Parsed receipt data
 * @throws {Error} If receipt parsing fails
 *
 * @example
 * ```typescript
 * const receipt = await parseReceipt(imageBuffer);
 * console.log('Merchant:', receipt.merchant);
 * console.log('Items:', receipt.items);
 * ```
 */
export declare const parseReceipt: (documentBuffer: Buffer) => Promise<{
    merchant: string;
    date: string;
    items: any[];
    total: number;
}>;
/**
 * 19. Parses medical record and extracts patient data.
 * Extracts patient demographics, diagnoses, medications, and clinical notes.
 *
 * @param {Buffer} documentBuffer - Medical record buffer
 * @returns {Promise<{patientId: string; name: string; diagnoses: string[]; medications: string[]}>} Parsed medical data
 * @throws {Error} If medical record parsing fails
 *
 * @example
 * ```typescript
 * const record = await parseMedicalRecord(pdfBuffer);
 * console.log('Patient:', record.name);
 * console.log('Diagnoses:', record.diagnoses);
 * ```
 */
export declare const parseMedicalRecord: (documentBuffer: Buffer) => Promise<{
    patientId: string;
    name: string;
    diagnoses: string[];
    medications: string[];
}>;
/**
 * 20. Extracts signature regions from document.
 * Detects and isolates signature areas for verification.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<Array<{boundingBox: BoundingBox; confidence: number}>>} Detected signatures
 * @throws {Error} If signature extraction fails
 *
 * @example
 * ```typescript
 * const signatures = await extractSignatures(pdfBuffer);
 * console.log(`Found ${signatures.length} signatures`);
 * ```
 */
export declare const extractSignatures: (documentBuffer: Buffer) => Promise<Array<{
    boundingBox: BoundingBox;
    confidence: number;
}>>;
/**
 * 21. Detects handwritten text regions in document.
 * Distinguishes between printed and handwritten text.
 *
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<HandwritingDetectionResult>} Handwriting detection result
 * @throws {Error} If handwriting detection fails
 *
 * @example
 * ```typescript
 * const result = await detectHandwriting(imageBuffer);
 * if (result.isHandwritten) {
 *   console.log('Document contains handwriting');
 *   console.log('Regions:', result.regions);
 * }
 * ```
 */
export declare const detectHandwriting: (imageBuffer: Buffer) => Promise<HandwritingDetectionResult>;
/**
 * 22. Transcribes handwritten text to digital format.
 * Uses specialized handwriting recognition models.
 *
 * @param {Buffer} imageBuffer - Image buffer containing handwriting
 * @returns {Promise<string>} Transcribed text
 * @throws {Error} If transcription fails
 *
 * @example
 * ```typescript
 * const text = await transcribeHandwriting(imageBuffer);
 * console.log('Transcribed text:', text);
 * ```
 */
export declare const transcribeHandwriting: (imageBuffer: Buffer) => Promise<string>;
/**
 * 23. Validates OCR quality and provides improvement recommendations.
 * Analyzes confidence scores, error patterns, and image quality.
 *
 * @param {OCRResult} result - OCR result to validate
 * @returns {Promise<QualityValidationResult>} Quality validation result
 * @throws {Error} If quality validation fails
 *
 * @example
 * ```typescript
 * const validation = await validateOCRQuality(ocrResult);
 * if (validation.quality === 'poor') {
 *   console.log('Issues found:', validation.issues);
 *   console.log('Recommendations:', validation.recommendations);
 * }
 * ```
 */
export declare const validateOCRQuality: (result: OCRResult) => Promise<QualityValidationResult>;
/**
 * 24. Improves OCR accuracy through post-processing.
 * Applies dictionary correction, context analysis, and pattern matching.
 *
 * @param {string} text - OCR-extracted text
 * @param {Object} [options] - Improvement options
 * @returns {Promise<string>} Improved text
 * @throws {Error} If accuracy improvement fails
 *
 * @example
 * ```typescript
 * const improved = await improveAccuracy(rawOCRText, {
 *   useDictionary: true,
 *   correctCommonErrors: true
 * });
 * ```
 */
export declare const improveAccuracy: (text: string, options?: {
    useDictionary?: boolean;
    correctCommonErrors?: boolean;
}) => Promise<string>;
/**
 * 25. Performs spell checking on extracted text.
 * Identifies and suggests corrections for misspelled words.
 *
 * @param {string} text - Text to spell check
 * @returns {Promise<{correctedText: string; corrections: Array<{word: string; suggestions: string[]}>}>} Spell check result
 * @throws {Error} If spell checking fails
 *
 * @example
 * ```typescript
 * const result = await spellCheck(extractedText);
 * console.log('Corrected text:', result.correctedText);
 * console.log('Corrections made:', result.corrections);
 * ```
 */
export declare const spellCheck: (text: string) => Promise<{
    correctedText: string;
    corrections: Array<{
        word: string;
        suggestions: string[];
    }>;
}>;
/**
 * 26. Corrects common OCR errors based on patterns.
 * Applies heuristic-based error correction.
 *
 * @param {string} text - Text with potential errors
 * @returns {Promise<string>} Corrected text
 * @throws {Error} If error correction fails
 *
 * @example
 * ```typescript
 * const corrected = await correctErrors(ocrText);
 * ```
 */
export declare const correctErrors: (text: string) => Promise<string>;
/**
 * 27. Extracts keywords from text using NLP.
 * Identifies important terms and phrases.
 *
 * @param {string} text - Text to analyze
 * @param {number} [maxKeywords] - Maximum number of keywords
 * @returns {Promise<string[]>} Array of extracted keywords
 * @throws {Error} If keyword extraction fails
 *
 * @example
 * ```typescript
 * const keywords = await extractKeywords(documentText, 10);
 * console.log('Top keywords:', keywords);
 * ```
 */
export declare const extractKeywords: (text: string, maxKeywords?: number) => Promise<string[]>;
/**
 * 28. Classifies document based on content.
 * Uses ML model to categorize document type.
 *
 * @param {string} text - Document text content
 * @returns {Promise<{classification: DocumentClassification; confidence: number}>} Classification result
 * @throws {Error} If classification fails
 *
 * @example
 * ```typescript
 * const result = await classifyDocument(documentText);
 * console.log('Document type:', result.classification);
 * console.log('Confidence:', result.confidence);
 * ```
 */
export declare const classifyDocument: (text: string) => Promise<{
    classification: DocumentClassification;
    confidence: number;
}>;
/**
 * 29. Extracts named entities from text.
 * Identifies persons, organizations, locations, dates, amounts, etc.
 *
 * @param {string} text - Text to analyze
 * @returns {Promise<EntityExtractionResult>} Extracted entities and relationships
 * @throws {Error} If entity extraction fails
 *
 * @example
 * ```typescript
 * const result = await extractEntities(documentText);
 * result.entities.forEach(entity => {
 *   console.log(`${entity.type}: ${entity.value} (${entity.confidence})`);
 * });
 * ```
 */
export declare const extractEntities: (text: string) => Promise<EntityExtractionResult>;
/**
 * 30. Analyzes sentiment of text content.
 * Determines positive, negative, or neutral sentiment.
 *
 * @param {string} text - Text to analyze
 * @returns {Promise<SentimentAnalysisResult>} Sentiment analysis result
 * @throws {Error} If sentiment analysis fails
 *
 * @example
 * ```typescript
 * const sentiment = await analyzeSentiment(patientFeedback);
 * console.log('Sentiment:', sentiment.sentiment);
 * console.log('Score:', sentiment.score);
 * ```
 */
export declare const analyzeSentiment: (text: string) => Promise<SentimentAnalysisResult>;
/**
 * 31. Generates summary of text content.
 * Creates concise summary using extractive or abstractive methods.
 *
 * @param {string} text - Text to summarize
 * @param {number} [maxLength] - Maximum summary length in characters
 * @returns {Promise<string>} Generated summary
 * @throws {Error} If summarization fails
 *
 * @example
 * ```typescript
 * const summary = await summarizeText(longDocument, 200);
 * console.log('Summary:', summary);
 * ```
 */
export declare const summarizeText: (text: string, maxLength?: number) => Promise<string>;
/**
 * 32. Translates text to target language.
 * Uses translation API or model for language conversion.
 *
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<{translatedText: string; sourceLanguage: string}>} Translation result
 * @throws {Error} If translation fails
 *
 * @example
 * ```typescript
 * const result = await translateText('Hello, how are you?', 'es');
 * console.log('Translated:', result.translatedText);
 * ```
 */
export declare const translateText: (text: string, targetLanguage: string) => Promise<{
    translatedText: string;
    sourceLanguage: string;
}>;
/**
 * 33. Extracts dates from text.
 * Identifies various date formats and converts to standard format.
 *
 * @param {string} text - Text containing dates
 * @returns {Promise<Array<{date: string; format: string; position: number}>>} Extracted dates
 * @throws {Error} If date extraction fails
 *
 * @example
 * ```typescript
 * const dates = await extractDates(documentText);
 * dates.forEach(d => console.log(`Found date: ${d.date}`));
 * ```
 */
export declare const extractDates: (text: string) => Promise<Array<{
    date: string;
    format: string;
    position: number;
}>>;
/**
 * 34. Extracts monetary amounts from text.
 * Identifies currency symbols and numeric amounts.
 *
 * @param {string} text - Text containing amounts
 * @returns {Promise<Array<{amount: number; currency: string; position: number}>>} Extracted amounts
 * @throws {Error} If amount extraction fails
 *
 * @example
 * ```typescript
 * const amounts = await extractAmounts(invoiceText);
 * amounts.forEach(a => console.log(`${a.currency}${a.amount}`));
 * ```
 */
export declare const extractAmounts: (text: string) => Promise<Array<{
    amount: number;
    currency: string;
    position: number;
}>>;
/**
 * 35. Extracts names from text.
 * Identifies person names using NER or pattern matching.
 *
 * @param {string} text - Text containing names
 * @returns {Promise<Array<{name: string; type: 'person' | 'organization'; confidence: number}>>} Extracted names
 * @throws {Error} If name extraction fails
 *
 * @example
 * ```typescript
 * const names = await extractNames(documentText);
 * names.forEach(n => console.log(`${n.name} (${n.type})`));
 * ```
 */
export declare const extractNames: (text: string) => Promise<Array<{
    name: string;
    type: "person" | "organization";
    confidence: number;
}>>;
/**
 * 36. Extracts addresses from text.
 * Identifies street addresses, cities, states, and zip codes.
 *
 * @param {string} text - Text containing addresses
 * @returns {Promise<Array<{address: string; type: string; confidence: number}>>} Extracted addresses
 * @throws {Error} If address extraction fails
 *
 * @example
 * ```typescript
 * const addresses = await extractAddresses(documentText);
 * addresses.forEach(a => console.log(a.address));
 * ```
 */
export declare const extractAddresses: (text: string) => Promise<Array<{
    address: string;
    type: string;
    confidence: number;
}>>;
/**
 * 37. Extracts phone numbers from text.
 * Identifies various phone number formats.
 *
 * @param {string} text - Text containing phone numbers
 * @returns {Promise<string[]>} Extracted phone numbers
 * @throws {Error} If phone number extraction fails
 *
 * @example
 * ```typescript
 * const phones = await extractPhoneNumbers(documentText);
 * phones.forEach(p => console.log(p));
 * ```
 */
export declare const extractPhoneNumbers: (text: string) => Promise<string[]>;
/**
 * 38. Extracts email addresses from text.
 * Identifies valid email address formats.
 *
 * @param {string} text - Text containing email addresses
 * @returns {Promise<string[]>} Extracted email addresses
 * @throws {Error} If email extraction fails
 *
 * @example
 * ```typescript
 * const emails = await extractEmails(documentText);
 * emails.forEach(e => console.log(e));
 * ```
 */
export declare const extractEmails: (text: string) => Promise<string[]>;
/**
 * 39. Recognizes and decodes barcodes from image.
 * Supports various barcode formats (UPC, EAN, Code128, etc.).
 *
 * @param {Buffer} imageBuffer - Image buffer containing barcode
 * @returns {Promise<{code: string; format: string; confidence: number}>} Decoded barcode data
 * @throws {Error} If barcode recognition fails
 *
 * @example
 * ```typescript
 * const barcode = await recognizeBarcode(imageBuffer);
 * console.log('Barcode:', barcode.code);
 * console.log('Format:', barcode.format);
 * ```
 */
export declare const recognizeBarcode: (imageBuffer: Buffer) => Promise<{
    code: string;
    format: string;
    confidence: number;
}>;
/**
 * 40. Recognizes and decodes QR codes from image.
 * Extracts data encoded in QR code format.
 *
 * @param {Buffer} imageBuffer - Image buffer containing QR code
 * @returns {Promise<{data: string; version: number; errorCorrectionLevel: string}>} Decoded QR code data
 * @throws {Error} If QR code recognition fails
 *
 * @example
 * ```typescript
 * const qrCode = await recognizeQRCode(imageBuffer);
 * console.log('QR Code data:', qrCode.data);
 * ```
 */
export declare const recognizeQRCode: (imageBuffer: Buffer) => Promise<{
    data: string;
    version: number;
    errorCorrectionLevel: string;
}>;
/**
 * 41. Detects document type from content.
 * Analyzes structure and content to identify document category.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<DocumentClassification>} Detected document type
 * @throws {Error} If document type detection fails
 *
 * @example
 * ```typescript
 * const docType = await detectDocumentType(pdfBuffer);
 * console.log('Document type:', docType);
 * ```
 */
export declare const detectDocumentType: (documentBuffer: Buffer) => Promise<DocumentClassification>;
/**
 * 42. Extracts comprehensive metadata from document.
 * Combines multiple extraction methods for complete metadata.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<Record<string, any>>} Extracted metadata
 * @throws {Error} If metadata extraction fails
 *
 * @example
 * ```typescript
 * const metadata = await extractMetadata(pdfBuffer);
 * console.log('Title:', metadata.title);
 * console.log('Author:', metadata.author);
 * ```
 */
export declare const extractMetadata: (documentBuffer: Buffer) => Promise<Record<string, any>>;
/**
 * 43. Generates search index from extracted text.
 * Creates searchable index with term frequency and positions.
 *
 * @param {string} text - Text to index
 * @param {string} documentId - Document identifier
 * @returns {Promise<{index: Record<string, any>; termCount: number}>} Generated search index
 * @throws {Error} If index generation fails
 *
 * @example
 * ```typescript
 * const searchIndex = await generateSearchIndex(extractedText, 'doc-123');
 * console.log('Indexed terms:', searchIndex.termCount);
 * ```
 */
export declare const generateSearchIndex: (text: string, documentId: string) => Promise<{
    index: Record<string, any>;
    termCount: number;
}>;
/**
 * 44. Enables full-text search on extracted content.
 * Sets up full-text search capabilities with ranking.
 *
 * @param {string} text - Text to make searchable
 * @param {string} documentId - Document identifier
 * @returns {Promise<{searchable: boolean; indexedTerms: number}>} Search enablement result
 * @throws {Error} If full-text search enablement fails
 *
 * @example
 * ```typescript
 * const result = await enableFullTextSearch(extractedText, 'doc-123');
 * console.log('Searchable:', result.searchable);
 * console.log('Indexed terms:', result.indexedTerms);
 * ```
 */
export declare const enableFullTextSearch: (text: string, documentId: string) => Promise<{
    searchable: boolean;
    indexedTerms: number;
}>;
/**
 * 45. Tracks extraction metrics and accuracy.
 * Monitors extraction performance and quality over time.
 *
 * @param {OCRResult[]} results - Array of OCR results to analyze
 * @returns {Promise<ExtractionMetrics>} Extraction metrics
 * @throws {Error} If metrics tracking fails
 *
 * @example
 * ```typescript
 * const metrics = await trackExtractionMetrics(ocrResults);
 * console.log('Accuracy rate:', metrics.accuracyRate);
 * console.log('Average confidence:', metrics.averageConfidence);
 * ```
 */
export declare const trackExtractionMetrics: (results: OCRResult[]) => Promise<ExtractionMetrics>;
/**
 * Document OCR Extraction Service
 * Production-ready NestJS service for OCR and extraction operations
 *
 * @example
 * ```typescript
 * @Controller('ocr')
 * export class OCRController {
 *   constructor(private readonly ocrService: DocumentOCRExtractionService) {}
 *
 *   @Post('extract')
 *   async extract(@Body() dto: OCRRequestDto) {
 *     return await this.ocrService.extractAll(dto.documentBuffer);
 *   }
 * }
 * ```
 */
export declare class DocumentOCRExtractionService {
    /**
     * Performs comprehensive extraction on document
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @returns {Promise<{ocr: OCRResult; extractedData: ExtractedData}>} Complete extraction result
     */
    extractAll(documentBuffer: Buffer): Promise<{
        ocr: OCRResult;
        extractedData: ExtractedData;
    }>;
    /**
     * Processes document with full intelligence pipeline
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @returns {Promise<DocumentParseResult>} Complete parsing result
     */
    processDocument(documentBuffer: Buffer): Promise<DocumentParseResult>;
}
declare const _default: {
    OCRResultModel: typeof OCRResultModel;
    ExtractionJobModel: typeof ExtractionJobModel;
    DocumentIntelligenceModel: typeof DocumentIntelligenceModel;
    performOCR: (imageBuffer: Buffer, config?: Partial<OCRConfig>) => Promise<OCRResult>;
    extractText: (documentBuffer: Buffer, options?: {
        preserveFormatting?: boolean;
        removeHeaders?: boolean;
    }) => Promise<string>;
    recognizeLanguage: (text: string) => Promise<{
        language: OCRLanguage;
        confidence: number;
    }>;
    extractTables: (documentBuffer: Buffer) => Promise<TableData[]>;
    extractForms: (documentBuffer: Buffer) => Promise<FormData>;
    preprocessImage: (imageBuffer: Buffer, operations?: PreprocessingOperation[]) => Promise<PreprocessingResult>;
    deskewImage: (imageBuffer: Buffer) => Promise<{
        image: Buffer;
        angle: number;
    }>;
    removeNoise: (imageBuffer: Buffer, strength?: number) => Promise<Buffer>;
    binarizeImage: (imageBuffer: Buffer, threshold?: number) => Promise<Buffer>;
    enhanceContrast: (imageBuffer: Buffer, factor?: number) => Promise<Buffer>;
    detectOrientation: (imageBuffer: Buffer) => Promise<number>;
    rotateImage: (imageBuffer: Buffer, angle: number) => Promise<Buffer>;
    cropToContent: (imageBuffer: Buffer, padding?: number) => Promise<Buffer>;
    batchOCR: (imageBuffers: Buffer[], config?: Partial<OCRConfig>, concurrency?: number) => Promise<OCRResult[]>;
    multiLanguageOCR: (imageBuffer: Buffer, languages: OCRLanguage[]) => Promise<OCRResult>;
    extractStructuredData: (documentBuffer: Buffer, documentType: DocumentClassification) => Promise<ExtractedData>;
    parseInvoice: (documentBuffer: Buffer) => Promise<{
        vendor: string;
        invoiceNumber: string;
        date: string;
        lineItems: any[];
        total: number;
    }>;
    parseReceipt: (documentBuffer: Buffer) => Promise<{
        merchant: string;
        date: string;
        items: any[];
        total: number;
    }>;
    parseMedicalRecord: (documentBuffer: Buffer) => Promise<{
        patientId: string;
        name: string;
        diagnoses: string[];
        medications: string[];
    }>;
    extractSignatures: (documentBuffer: Buffer) => Promise<Array<{
        boundingBox: BoundingBox;
        confidence: number;
    }>>;
    detectHandwriting: (imageBuffer: Buffer) => Promise<HandwritingDetectionResult>;
    transcribeHandwriting: (imageBuffer: Buffer) => Promise<string>;
    validateOCRQuality: (result: OCRResult) => Promise<QualityValidationResult>;
    improveAccuracy: (text: string, options?: {
        useDictionary?: boolean;
        correctCommonErrors?: boolean;
    }) => Promise<string>;
    spellCheck: (text: string) => Promise<{
        correctedText: string;
        corrections: Array<{
            word: string;
            suggestions: string[];
        }>;
    }>;
    correctErrors: (text: string) => Promise<string>;
    extractKeywords: (text: string, maxKeywords?: number) => Promise<string[]>;
    classifyDocument: (text: string) => Promise<{
        classification: DocumentClassification;
        confidence: number;
    }>;
    extractEntities: (text: string) => Promise<EntityExtractionResult>;
    analyzeSentiment: (text: string) => Promise<SentimentAnalysisResult>;
    summarizeText: (text: string, maxLength?: number) => Promise<string>;
    translateText: (text: string, targetLanguage: string) => Promise<{
        translatedText: string;
        sourceLanguage: string;
    }>;
    extractDates: (text: string) => Promise<Array<{
        date: string;
        format: string;
        position: number;
    }>>;
    extractAmounts: (text: string) => Promise<Array<{
        amount: number;
        currency: string;
        position: number;
    }>>;
    extractNames: (text: string) => Promise<Array<{
        name: string;
        type: "person" | "organization";
        confidence: number;
    }>>;
    extractAddresses: (text: string) => Promise<Array<{
        address: string;
        type: string;
        confidence: number;
    }>>;
    extractPhoneNumbers: (text: string) => Promise<string[]>;
    extractEmails: (text: string) => Promise<string[]>;
    recognizeBarcode: (imageBuffer: Buffer) => Promise<{
        code: string;
        format: string;
        confidence: number;
    }>;
    recognizeQRCode: (imageBuffer: Buffer) => Promise<{
        data: string;
        version: number;
        errorCorrectionLevel: string;
    }>;
    detectDocumentType: (documentBuffer: Buffer) => Promise<DocumentClassification>;
    extractMetadata: (documentBuffer: Buffer) => Promise<Record<string, any>>;
    generateSearchIndex: (text: string, documentId: string) => Promise<{
        index: Record<string, any>;
        termCount: number;
    }>;
    enableFullTextSearch: (text: string, documentId: string) => Promise<{
        searchable: boolean;
        indexedTerms: number;
    }>;
    trackExtractionMetrics: (results: OCRResult[]) => Promise<ExtractionMetrics>;
    DocumentOCRExtractionService: typeof DocumentOCRExtractionService;
};
export default _default;
//# sourceMappingURL=document-ocr-extraction-composite.d.ts.map