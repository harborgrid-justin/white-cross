/**
 * LOC: DOC-OCR-001
 * File: /reuse/document/document-ocr-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - tesseract.js
 *   - sharp
 *   - opencv4nodejs
 *   - jimp
 *   - pdf-parse
 *   - stream
 *
 * DOWNSTREAM (imported by):
 *   - OCR processing services
 *   - Document digitization modules
 *   - Text extraction APIs
 *   - Medical record scanning services
 */
/**
 * File: /reuse/document/document-ocr-kit.ts
 * Locator: WC-UTL-OCR-001
 * Purpose: OCR & Text Recognition Kit - Comprehensive optical character recognition utilities
 *
 * Upstream: @nestjs/common, sequelize, tesseract.js, sharp, opencv4nodejs, jimp, pdf-parse
 * Downstream: OCR services, document digitization, text extraction, medical record scanning
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Tesseract.js 5.x, Sharp 0.33.x
 * Exports: 42 utility functions for text recognition, language detection, image preprocessing, confidence scoring
 *
 * LLM Context: Production-grade OCR utilities for White Cross healthcare platform.
 * Provides text recognition from images/PDFs, multi-language support, image preprocessing (deskewing, noise removal,
 * binarization), confidence scoring, spell checking, handwriting recognition, batch OCR, table recognition,
 * form field extraction, medical document processing, and HIPAA-compliant text extraction. Essential for
 * digitizing medical records, prescriptions, lab results, and other healthcare documents.
 */
import { Sequelize } from 'sequelize';
/**
 * Supported OCR languages
 */
export type OCRLanguage = 'eng' | 'spa' | 'fra' | 'deu' | 'ita' | 'por' | 'rus' | 'jpn' | 'chi_sim' | 'chi_tra' | 'ara' | 'hin' | 'kor';
/**
 * OCR engine type
 */
export type OCREngine = 'tesseract' | 'google-vision' | 'aws-textract' | 'azure-ocr' | 'custom';
/**
 * OCR processing status
 */
export type OCRStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'review';
/**
 * Text orientation
 */
export type TextOrientation = 0 | 90 | 180 | 270;
/**
 * OCR configuration options
 */
export interface OCROptions {
    language?: OCRLanguage | OCRLanguage[];
    engine?: OCREngine;
    pageSegmentationMode?: number;
    ocrEngineMode?: number;
    dpi?: number;
    preprocessImage?: boolean;
    confidenceThreshold?: number;
    whitelist?: string;
    blacklist?: string;
    preserveLayout?: boolean;
    detectOrientation?: boolean;
}
/**
 * Text recognition result
 */
export interface OCRResult {
    text: string;
    confidence: number;
    language?: OCRLanguage;
    words: OCRWord[];
    lines: OCRLine[];
    paragraphs: OCRParagraph[];
    blocks: OCRBlock[];
    metadata?: OCRMetadata;
}
/**
 * OCR word information
 */
export interface OCRWord {
    text: string;
    confidence: number;
    bbox: BoundingBox;
    baseline?: number;
    fontSize?: number;
    fontFamily?: string;
    bold?: boolean;
    italic?: boolean;
}
/**
 * OCR line information
 */
export interface OCRLine {
    text: string;
    confidence: number;
    words: OCRWord[];
    bbox: BoundingBox;
    baseline?: number;
}
/**
 * OCR paragraph information
 */
export interface OCRParagraph {
    text: string;
    confidence: number;
    lines: OCRLine[];
    bbox: BoundingBox;
}
/**
 * OCR block information
 */
export interface OCRBlock {
    text: string;
    confidence: number;
    paragraphs: OCRParagraph[];
    bbox: BoundingBox;
    blockType?: 'text' | 'table' | 'image' | 'ruler' | 'barcode';
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
 * OCR metadata
 */
export interface OCRMetadata {
    pageNumber?: number;
    orientation?: TextOrientation;
    script?: string;
    confidence: number;
    processingTime: number;
    engine: OCREngine;
    imageQuality?: number;
    dpi?: number;
}
/**
 * Image preprocessing options
 */
export interface PreprocessingOptions {
    grayscale?: boolean;
    binarize?: boolean;
    binarizationMethod?: 'otsu' | 'adaptive' | 'sauvola';
    denoise?: boolean;
    denoiseStrength?: number;
    deskew?: boolean;
    autoRotate?: boolean;
    sharpen?: boolean;
    contrast?: number;
    brightness?: number;
    removeBackground?: boolean;
    cropBorders?: boolean;
    scale?: number;
}
/**
 * Language detection result
 */
export interface LanguageDetectionResult {
    language: OCRLanguage;
    confidence: number;
    alternativeLanguages?: Array<{
        language: OCRLanguage;
        confidence: number;
    }>;
    script?: string;
    textDirection?: 'ltr' | 'rtl';
}
/**
 * Confidence scoring result
 */
export interface ConfidenceScore {
    overall: number;
    byWord: Map<string, number>;
    byLine: number[];
    byParagraph: number[];
    lowConfidenceWords: OCRWord[];
    averageWordConfidence: number;
}
/**
 * Spell check result
 */
export interface SpellCheckResult {
    text: string;
    corrections: Array<{
        original: string;
        corrected: string;
        confidence: number;
        position: {
            start: number;
            end: number;
        };
        suggestions?: string[];
    }>;
    correctedText: string;
}
/**
 * Handwriting recognition options
 */
export interface HandwritingOptions {
    language?: OCRLanguage;
    style?: 'print' | 'cursive' | 'mixed';
    minimumConfidence?: number;
}
/**
 * Table recognition result
 */
export interface TableRecognitionResult {
    rows: number;
    columns: number;
    cells: TableCell[][];
    headers?: string[];
    confidence: number;
}
/**
 * Table cell information
 */
export interface TableCell {
    text: string;
    confidence: number;
    rowIndex: number;
    columnIndex: number;
    rowSpan?: number;
    columnSpan?: number;
    bbox: BoundingBox;
}
/**
 * Form field extraction result
 */
export interface FormFieldResult {
    fields: FormField[];
    formType?: string;
    confidence: number;
}
/**
 * Form field information
 */
export interface FormField {
    name: string;
    value: string;
    type: 'text' | 'checkbox' | 'radio' | 'dropdown' | 'date' | 'signature';
    confidence: number;
    bbox: BoundingBox;
    checked?: boolean;
}
/**
 * Batch OCR configuration
 */
export interface BatchOCRConfig {
    files: Array<Buffer | string>;
    options?: OCROptions;
    parallelProcessing?: number;
    onProgress?: (completed: number, total: number) => void;
    onError?: (file: string | number, error: Error) => void;
}
/**
 * Batch OCR result
 */
export interface BatchOCRResult {
    totalFiles: number;
    successful: number;
    failed: number;
    results: Array<{
        file: string | number;
        result: OCRResult | null;
        error?: string;
    }>;
    totalTime: number;
}
/**
 * OCR job model attributes
 */
export interface OCRJobAttributes {
    id: string;
    sourceFile: string;
    sourceType: 'image' | 'pdf' | 'document';
    language?: string;
    engine: OCREngine;
    status: OCRStatus;
    progress: number;
    text?: string;
    confidence?: number;
    error?: string;
    metadata?: Record<string, any>;
    userId?: string;
    startedAt?: Date;
    completedAt?: Date;
    duration?: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * OCR result model attributes
 */
export interface OCRResultAttributes {
    id: string;
    jobId: string;
    pageNumber: number;
    text: string;
    confidence: number;
    language: OCRLanguage;
    wordCount: number;
    characterCount: number;
    blocks: Record<string, any>[];
    boundingBoxes: Record<string, any>[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates OCRJob model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<OCRJobAttributes>>} OCRJob model
 *
 * @example
 * ```typescript
 * const JobModel = createOCRJobModel(sequelize);
 * const job = await JobModel.create({
 *   sourceFile: '/uploads/scan.jpg',
 *   sourceType: 'image',
 *   engine: 'tesseract',
 *   language: 'eng',
 *   status: 'pending',
 *   progress: 0
 * });
 * ```
 */
export declare const createOCRJobModel: (sequelize: Sequelize) => any;
/**
 * Creates OCRResult model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<OCRResultAttributes>>} OCRResult model
 *
 * @example
 * ```typescript
 * const ResultModel = createOCRResultModel(sequelize);
 * const result = await ResultModel.create({
 *   jobId: 'job-uuid',
 *   pageNumber: 1,
 *   text: 'Extracted text content',
 *   confidence: 92.5,
 *   language: 'eng',
 *   wordCount: 150,
 *   characterCount: 750
 * });
 * ```
 */
export declare const createOCRResultModel: (sequelize: Sequelize) => any;
/**
 * 1. Performs OCR on image to extract text.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @param {OCROptions} [options] - OCR configuration options
 * @returns {Promise<OCRResult>} Extracted text with metadata
 *
 * @example
 * ```typescript
 * const result = await recognizeTextFromImage(imageBuffer, {
 *   language: 'eng',
 *   preprocessImage: true,
 *   confidenceThreshold: 60
 * });
 * console.log('Text:', result.text);
 * console.log('Confidence:', result.confidence);
 * ```
 */
export declare const recognizeTextFromImage: (image: Buffer | string, options?: OCROptions) => Promise<OCRResult>;
/**
 * 2. Recognizes text from PDF document.
 *
 * @param {Buffer | string} pdf - PDF buffer or file path
 * @param {OCROptions & { pageRange?: { start: number; end: number } }} [options] - OCR options
 * @returns {Promise<Map<number, OCRResult>>} Map of page numbers to OCR results
 *
 * @example
 * ```typescript
 * const results = await recognizeTextFromPDF(pdfBuffer, {
 *   language: 'eng',
 *   pageRange: { start: 1, end: 10 }
 * });
 * results.forEach((result, pageNum) => {
 *   console.log(`Page ${pageNum}:`, result.text);
 * });
 * ```
 */
export declare const recognizeTextFromPDF: (pdf: Buffer | string, options?: OCROptions & {
    pageRange?: {
        start: number;
        end: number;
    };
}) => Promise<Map<number, OCRResult>>;
/**
 * 3. Extracts text from scanned document with preprocessing.
 *
 * @param {Buffer | string} document - Document buffer or file path
 * @param {PreprocessingOptions & OCROptions} [options] - Combined preprocessing and OCR options
 * @returns {Promise<OCRResult>} Extracted text with preprocessing applied
 *
 * @example
 * ```typescript
 * const result = await extractTextFromScannedDocument(scanBuffer, {
 *   grayscale: true,
 *   denoise: true,
 *   deskew: true,
 *   language: 'eng'
 * });
 * ```
 */
export declare const extractTextFromScannedDocument: (document: Buffer | string, options?: PreprocessingOptions & OCROptions) => Promise<OCRResult>;
/**
 * 4. Recognizes text with multiple language support.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @param {OCRLanguage[]} languages - List of languages to detect
 * @returns {Promise<OCRResult>} Text extracted in multiple languages
 *
 * @example
 * ```typescript
 * const result = await recognizeMultiLanguageText(imageBuffer, [
 *   'eng', 'spa', 'fra'
 * ]);
 * ```
 */
export declare const recognizeMultiLanguageText: (image: Buffer | string, languages: OCRLanguage[]) => Promise<OCRResult>;
/**
 * 5. Detects language of text in image.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @returns {Promise<LanguageDetectionResult>} Detected language with confidence
 *
 * @example
 * ```typescript
 * const detection = await detectLanguage(imageBuffer);
 * console.log('Language:', detection.language);
 * console.log('Confidence:', detection.confidence);
 * ```
 */
export declare const detectLanguage: (image: Buffer | string) => Promise<LanguageDetectionResult>;
/**
 * 6. Detects multiple languages in document.
 *
 * @param {Buffer | string} document - Document buffer or file path
 * @returns {Promise<Map<string, LanguageDetectionResult>>} Language detection per region
 *
 * @example
 * ```typescript
 * const languages = await detectMultipleLanguages(documentBuffer);
 * languages.forEach((result, region) => {
 *   console.log(`Region ${region}: ${result.language}`);
 * });
 * ```
 */
export declare const detectMultipleLanguages: (document: Buffer | string) => Promise<Map<string, LanguageDetectionResult>>;
/**
 * 7. Identifies script type (Latin, Cyrillic, Arabic, etc.).
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @returns {Promise<{ script: string; confidence: number }>} Detected script
 *
 * @example
 * ```typescript
 * const { script, confidence } = await identifyScript(imageBuffer);
 * console.log('Script:', script); // 'Latin', 'Cyrillic', 'Arabic', etc.
 * ```
 */
export declare const identifyScript: (image: Buffer | string) => Promise<{
    script: string;
    confidence: number;
}>;
/**
 * 8. Detects text direction (LTR, RTL, vertical).
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @returns {Promise<{ direction: 'ltr' | 'rtl' | 'vertical'; confidence: number }>} Text direction
 *
 * @example
 * ```typescript
 * const { direction } = await detectTextDirection(imageBuffer);
 * console.log('Direction:', direction);
 * ```
 */
export declare const detectTextDirection: (image: Buffer | string) => Promise<{
    direction: "ltr" | "rtl" | "vertical";
    confidence: number;
}>;
/**
 * 9. Preprocesses image for optimal OCR results.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @param {PreprocessingOptions} options - Preprocessing options
 * @returns {Promise<Buffer>} Preprocessed image buffer
 *
 * @example
 * ```typescript
 * const preprocessed = await preprocessImageForOCR(imageBuffer, {
 *   grayscale: true,
 *   binarize: true,
 *   denoise: true,
 *   deskew: true
 * });
 * ```
 */
export declare const preprocessImageForOCR: (image: Buffer | string, options: PreprocessingOptions) => Promise<Buffer>;
/**
 * 10. Applies image deskewing to correct rotation.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @returns {Promise<{ image: Buffer; angle: number }>} Deskewed image and correction angle
 *
 * @example
 * ```typescript
 * const { image, angle } = await deskewImage(imageBuffer);
 * console.log('Corrected by:', angle, 'degrees');
 * ```
 */
export declare const deskewImage: (image: Buffer | string) => Promise<{
    image: Buffer;
    angle: number;
}>;
/**
 * 11. Removes noise from scanned document.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @param {number} [strength] - Denoising strength (0-100)
 * @returns {Promise<Buffer>} Denoised image buffer
 *
 * @example
 * ```typescript
 * const clean = await removeImageNoise(imageBuffer, 75);
 * ```
 */
export declare const removeImageNoise: (image: Buffer | string, strength?: number) => Promise<Buffer>;
/**
 * 12. Binarizes image for better OCR accuracy.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @param {Object} [options] - Binarization options
 * @returns {Promise<Buffer>} Binarized image buffer
 *
 * @example
 * ```typescript
 * const binary = await binarizeImage(imageBuffer, {
 *   method: 'otsu',
 *   threshold: 128
 * });
 * ```
 */
export declare const binarizeImage: (image: Buffer | string, options?: {
    method?: "otsu" | "adaptive" | "sauvola";
    threshold?: number;
}) => Promise<Buffer>;
/**
 * 13. Enhances image contrast for readability.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @param {number} [factor] - Contrast enhancement factor
 * @returns {Promise<Buffer>} Enhanced image buffer
 *
 * @example
 * ```typescript
 * const enhanced = await enhanceContrast(imageBuffer, 1.5);
 * ```
 */
export declare const enhanceContrast: (image: Buffer | string, factor?: number) => Promise<Buffer>;
/**
 * 14. Removes background from document image.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @returns {Promise<Buffer>} Image with removed background
 *
 * @example
 * ```typescript
 * const clean = await removeBackground(scanBuffer);
 * ```
 */
export declare const removeBackground: (image: Buffer | string) => Promise<Buffer>;
/**
 * 15. Detects and auto-rotates text orientation.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @returns {Promise<{ image: Buffer; rotation: TextOrientation }>} Rotated image and rotation applied
 *
 * @example
 * ```typescript
 * const { image, rotation } = await autoRotateText(imageBuffer);
 * console.log('Rotated by:', rotation, 'degrees');
 * ```
 */
export declare const autoRotateText: (image: Buffer | string) => Promise<{
    image: Buffer;
    rotation: TextOrientation;
}>;
/**
 * 16. Crops borders and whitespace from document.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @param {number} [threshold] - Border detection threshold
 * @returns {Promise<Buffer>} Cropped image buffer
 *
 * @example
 * ```typescript
 * const cropped = await cropDocumentBorders(scanBuffer, 10);
 * ```
 */
export declare const cropDocumentBorders: (image: Buffer | string, threshold?: number) => Promise<Buffer>;
/**
 * 17. Calculates confidence score for OCR result.
 *
 * @param {OCRResult} result - OCR result to score
 * @returns {ConfidenceScore} Detailed confidence scoring
 *
 * @example
 * ```typescript
 * const score = calculateConfidenceScore(ocrResult);
 * console.log('Overall confidence:', score.overall);
 * console.log('Low confidence words:', score.lowConfidenceWords.length);
 * ```
 */
export declare const calculateConfidenceScore: (result: OCRResult) => ConfidenceScore;
/**
 * 18. Identifies low confidence text regions.
 *
 * @param {OCRResult} result - OCR result
 * @param {number} [threshold] - Confidence threshold (0-100)
 * @returns {Array<{ text: string; confidence: number; bbox: BoundingBox }>} Low confidence regions
 *
 * @example
 * ```typescript
 * const lowConfidence = identifyLowConfidenceRegions(result, 70);
 * lowConfidence.forEach(region => {
 *   console.log('Review:', region.text, '(', region.confidence, '%)');
 * });
 * ```
 */
export declare const identifyLowConfidenceRegions: (result: OCRResult, threshold?: number) => Array<{
    text: string;
    confidence: number;
    bbox: BoundingBox;
}>;
/**
 * 19. Validates OCR result quality.
 *
 * @param {OCRResult} result - OCR result
 * @param {Object} [criteria] - Validation criteria
 * @returns {{ valid: boolean; issues: string[]; score: number }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateOCRQuality(result, {
 *   minConfidence: 80,
 *   maxLowConfidenceWords: 10
 * });
 * ```
 */
export declare const validateOCRQuality: (result: OCRResult, criteria?: {
    minConfidence?: number;
    maxLowConfidenceWords?: number;
}) => {
    valid: boolean;
    issues: string[];
    score: number;
};
/**
 * 20. Generates confidence heatmap for document.
 *
 * @param {OCRResult} result - OCR result
 * @param {Buffer | string} originalImage - Original image
 * @returns {Promise<Buffer>} Heatmap image showing confidence levels
 *
 * @example
 * ```typescript
 * const heatmap = await generateConfidenceHeatmap(result, imageBuffer);
 * await fs.writeFile('confidence-heatmap.png', heatmap);
 * ```
 */
export declare const generateConfidenceHeatmap: (result: OCRResult, originalImage: Buffer | string) => Promise<Buffer>;
/**
 * 21. Performs spell checking on OCR result.
 *
 * @param {string} text - Text to spell check
 * @param {OCRLanguage} [language] - Language for spell checking
 * @returns {Promise<SpellCheckResult>} Spell check results with corrections
 *
 * @example
 * ```typescript
 * const checked = await spellCheckOCRResult(ocrResult.text, 'eng');
 * console.log('Corrected:', checked.correctedText);
 * console.log('Corrections:', checked.corrections.length);
 * ```
 */
export declare const spellCheckOCRResult: (text: string, language?: OCRLanguage) => Promise<SpellCheckResult>;
/**
 * 22. Auto-corrects common OCR mistakes.
 *
 * @param {string} text - Text to correct
 * @param {Object} [options] - Correction options
 * @returns {Promise<string>} Corrected text
 *
 * @example
 * ```typescript
 * const corrected = await autoCorrectOCRMistakes(text, {
 *   fixCommonErrors: true,
 *   replaceConfusedCharacters: true
 * });
 * ```
 */
export declare const autoCorrectOCRMistakes: (text: string, options?: {
    fixCommonErrors?: boolean;
    replaceConfusedCharacters?: boolean;
}) => Promise<string>;
/**
 * 23. Validates medical terminology in OCR text.
 *
 * @param {string} text - Medical text to validate
 * @param {string[]} [dictionary] - Medical terms dictionary
 * @returns {Promise<{ valid: boolean; unknownTerms: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMedicalTerms(ocrResult.text);
 * console.log('Unknown terms:', validation.unknownTerms);
 * ```
 */
export declare const validateMedicalTerms: (text: string, dictionary?: string[]) => Promise<{
    valid: boolean;
    unknownTerms: string[];
}>;
/**
 * 24. Suggests corrections for uncertain words.
 *
 * @param {OCRWord[]} words - Words to analyze
 * @param {number} [confidenceThreshold] - Threshold for suggestions
 * @returns {Promise<Map<string, string[]>>} Map of words to suggestions
 *
 * @example
 * ```typescript
 * const suggestions = await suggestCorrections(result.words, 70);
 * suggestions.forEach((alternatives, word) => {
 *   console.log(`${word}: ${alternatives.join(', ')}`);
 * });
 * ```
 */
export declare const suggestCorrections: (words: OCRWord[], confidenceThreshold?: number) => Promise<Map<string, string[]>>;
/**
 * 25. Performs OCR with automatic language detection.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @returns {Promise<OCRResult & { detectedLanguage: OCRLanguage }>} OCR result with detected language
 *
 * @example
 * ```typescript
 * const result = await ocrWithAutoLanguageDetection(imageBuffer);
 * console.log('Detected:', result.detectedLanguage);
 * ```
 */
export declare const ocrWithAutoLanguageDetection: (image: Buffer | string) => Promise<OCRResult & {
    detectedLanguage: OCRLanguage;
}>;
/**
 * 26. Trains custom language model for OCR.
 *
 * @param {Array<{ image: Buffer; text: string }>} trainingData - Training samples
 * @param {OCRLanguage} language - Target language
 * @returns {Promise<string>} Model ID
 *
 * @example
 * ```typescript
 * const modelId = await trainCustomLanguageModel(samples, 'eng');
 * ```
 */
export declare const trainCustomLanguageModel: (trainingData: Array<{
    image: Buffer;
    text: string;
}>, language: OCRLanguage) => Promise<string>;
/**
 * 27. Processes mixed-language documents.
 *
 * @param {Buffer | string} document - Document buffer or file path
 * @param {OCRLanguage[]} languages - Expected languages
 * @returns {Promise<Map<OCRLanguage, string>>} Extracted text per language
 *
 * @example
 * ```typescript
 * const results = await processMixedLanguageDocument(docBuffer, [
 *   'eng', 'spa', 'fra'
 * ]);
 * ```
 */
export declare const processMixedLanguageDocument: (document: Buffer | string, languages: OCRLanguage[]) => Promise<Map<OCRLanguage, string>>;
/**
 * 28. Transliterates text to Latin script.
 *
 * @param {string} text - Text to transliterate
 * @param {OCRLanguage} sourceLanguage - Source language
 * @returns {Promise<string>} Transliterated text
 *
 * @example
 * ```typescript
 * const latinText = await transliterateToLatin(cyrillicText, 'rus');
 * ```
 */
export declare const transliterateToLatin: (text: string, sourceLanguage: OCRLanguage) => Promise<string>;
/**
 * 29. Performs batch OCR on multiple files.
 *
 * @param {BatchOCRConfig} config - Batch processing configuration
 * @returns {Promise<BatchOCRResult>} Batch processing results
 *
 * @example
 * ```typescript
 * const result = await batchOCRProcessing({
 *   files: [img1, img2, img3],
 *   options: { language: 'eng' },
 *   parallelProcessing: 3,
 *   onProgress: (completed, total) => console.log(`${completed}/${total}`)
 * });
 * ```
 */
export declare const batchOCRProcessing: (config: BatchOCRConfig) => Promise<BatchOCRResult>;
/**
 * 30. Processes directory of images with OCR.
 *
 * @param {string} directory - Directory path
 * @param {OCROptions} [options] - OCR options
 * @returns {Promise<BatchOCRResult>} Batch processing results
 *
 * @example
 * ```typescript
 * const result = await ocrDirectory('/scans', { language: 'eng' });
 * ```
 */
export declare const ocrDirectory: (directory: string, options?: OCROptions) => Promise<BatchOCRResult>;
/**
 * 31. Queues OCR job for asynchronous processing.
 *
 * @param {Buffer | string} file - File to process
 * @param {OCROptions} [options] - OCR options
 * @param {string} [priority] - Job priority
 * @returns {Promise<string>} Job ID
 *
 * @example
 * ```typescript
 * const jobId = await queueOCRJob(imageBuffer, { language: 'eng' }, 'high');
 * ```
 */
export declare const queueOCRJob: (file: Buffer | string, options?: OCROptions, priority?: string) => Promise<string>;
/**
 * 32. Monitors OCR queue status.
 *
 * @param {string} jobId - Job ID to monitor
 * @returns {Promise<{ status: OCRStatus; progress: number }>} Job status
 *
 * @example
 * ```typescript
 * const { status, progress } = await monitorOCRJob(jobId);
 * console.log(`Status: ${status}, Progress: ${progress}%`);
 * ```
 */
export declare const monitorOCRJob: (jobId: string) => Promise<{
    status: OCRStatus;
    progress: number;
}>;
/**
 * 33. Recognizes tables in document.
 *
 * @param {Buffer | string} document - Document buffer or file path
 * @param {OCROptions} [options] - OCR options
 * @returns {Promise<TableRecognitionResult[]>} Recognized tables
 *
 * @example
 * ```typescript
 * const tables = await recognizeTables(documentBuffer);
 * tables.forEach((table, index) => {
 *   console.log(`Table ${index}: ${table.rows}x${table.columns}`);
 * });
 * ```
 */
export declare const recognizeTables: (document: Buffer | string, options?: OCROptions) => Promise<TableRecognitionResult[]>;
/**
 * 34. Extracts form fields from document.
 *
 * @param {Buffer | string} form - Form buffer or file path
 * @param {OCROptions} [options] - OCR options
 * @returns {Promise<FormFieldResult>} Extracted form fields
 *
 * @example
 * ```typescript
 * const form = await extractFormFields(formBuffer);
 * form.fields.forEach(field => {
 *   console.log(`${field.name}: ${field.value}`);
 * });
 * ```
 */
export declare const extractFormFields: (form: Buffer | string, options?: OCROptions) => Promise<FormFieldResult>;
/**
 * 35. Recognizes checkboxes and radio buttons.
 *
 * @param {Buffer | string} form - Form buffer or file path
 * @returns {Promise<Array<{ type: 'checkbox' | 'radio'; checked: boolean; bbox: BoundingBox }>>} Checkbox states
 *
 * @example
 * ```typescript
 * const controls = await recognizeCheckboxes(formBuffer);
 * const checked = controls.filter(c => c.checked);
 * ```
 */
export declare const recognizeCheckboxes: (form: Buffer | string) => Promise<Array<{
    type: "checkbox" | "radio";
    checked: boolean;
    bbox: BoundingBox;
}>>;
/**
 * 36. Extracts key-value pairs from document.
 *
 * @param {Buffer | string} document - Document buffer or file path
 * @returns {Promise<Map<string, string>>} Extracted key-value pairs
 *
 * @example
 * ```typescript
 * const data = await extractKeyValuePairs(invoiceBuffer);
 * console.log('Invoice Number:', data.get('invoice_number'));
 * console.log('Total:', data.get('total'));
 * ```
 */
export declare const extractKeyValuePairs: (document: Buffer | string) => Promise<Map<string, string>>;
/**
 * 37. Recognizes handwritten text.
 *
 * @param {Buffer | string} image - Image buffer or file path
 * @param {HandwritingOptions} [options] - Handwriting recognition options
 * @returns {Promise<OCRResult>} Recognized handwritten text
 *
 * @example
 * ```typescript
 * const result = await recognizeHandwriting(scanBuffer, {
 *   language: 'eng',
 *   style: 'cursive',
 *   minimumConfidence: 70
 * });
 * ```
 */
export declare const recognizeHandwriting: (image: Buffer | string, options?: HandwritingOptions) => Promise<OCRResult>;
/**
 * 38. Processes handwritten medical prescriptions.
 *
 * @param {Buffer | string} prescription - Prescription image
 * @returns {Promise<{ medications: string[]; dosages: string[]; instructions: string[] }>} Extracted prescription data
 *
 * @example
 * ```typescript
 * const rx = await processMedicalPrescription(prescriptionScan);
 * console.log('Medications:', rx.medications);
 * ```
 */
export declare const processMedicalPrescription: (prescription: Buffer | string) => Promise<{
    medications: string[];
    dosages: string[];
    instructions: string[];
}>;
/**
 * 39. Recognizes signatures in documents.
 *
 * @param {Buffer | string} document - Document buffer or file path
 * @returns {Promise<Array<{ bbox: BoundingBox; confidence: number }>>} Detected signatures
 *
 * @example
 * ```typescript
 * const signatures = await recognizeSignatures(documentBuffer);
 * console.log('Found', signatures.length, 'signatures');
 * ```
 */
export declare const recognizeSignatures: (document: Buffer | string) => Promise<Array<{
    bbox: BoundingBox;
    confidence: number;
}>>;
/**
 * 40. Validates signature authenticity.
 *
 * @param {Buffer} signature - Signature image
 * @param {Buffer} reference - Reference signature
 * @returns {Promise<{ authentic: boolean; similarity: number }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSignature(sig1, referenceSig);
 * console.log('Authentic:', validation.authentic);
 * console.log('Similarity:', validation.similarity);
 * ```
 */
export declare const validateSignature: (signature: Buffer, reference: Buffer) => Promise<{
    authentic: boolean;
    similarity: number;
}>;
/**
 * 41. Processes medical lab results.
 *
 * @param {Buffer | string} labResult - Lab result document
 * @returns {Promise<Map<string, { value: string; unit?: string; reference?: string }>>} Parsed lab values
 *
 * @example
 * ```typescript
 * const results = await processLabResults(labResultScan);
 * results.forEach((data, test) => {
 *   console.log(`${test}: ${data.value} ${data.unit || ''}`);
 * });
 * ```
 */
export declare const processLabResults: (labResult: Buffer | string) => Promise<Map<string, {
    value: string;
    unit?: string;
    reference?: string;
}>>;
/**
 * 42. Extracts structured medical record data.
 *
 * @param {Buffer | string} medicalRecord - Medical record document
 * @returns {Promise<{ patientInfo: any; vitals: any; diagnoses: string[]; medications: string[] }>} Structured data
 *
 * @example
 * ```typescript
 * const record = await extractMedicalRecordData(recordScan);
 * console.log('Patient:', record.patientInfo.name);
 * console.log('Diagnoses:', record.diagnoses);
 * ```
 */
export declare const extractMedicalRecordData: (medicalRecord: Buffer | string) => Promise<{
    patientInfo: any;
    vitals: any;
    diagnoses: string[];
    medications: string[];
}>;
declare const _default: {
    recognizeTextFromImage: (image: Buffer | string, options?: OCROptions) => Promise<OCRResult>;
    recognizeTextFromPDF: (pdf: Buffer | string, options?: OCROptions & {
        pageRange?: {
            start: number;
            end: number;
        };
    }) => Promise<Map<number, OCRResult>>;
    extractTextFromScannedDocument: (document: Buffer | string, options?: PreprocessingOptions & OCROptions) => Promise<OCRResult>;
    recognizeMultiLanguageText: (image: Buffer | string, languages: OCRLanguage[]) => Promise<OCRResult>;
    detectLanguage: (image: Buffer | string) => Promise<LanguageDetectionResult>;
    detectMultipleLanguages: (document: Buffer | string) => Promise<Map<string, LanguageDetectionResult>>;
    identifyScript: (image: Buffer | string) => Promise<{
        script: string;
        confidence: number;
    }>;
    detectTextDirection: (image: Buffer | string) => Promise<{
        direction: "ltr" | "rtl" | "vertical";
        confidence: number;
    }>;
    preprocessImageForOCR: (image: Buffer | string, options: PreprocessingOptions) => Promise<Buffer>;
    deskewImage: (image: Buffer | string) => Promise<{
        image: Buffer;
        angle: number;
    }>;
    removeImageNoise: (image: Buffer | string, strength?: number) => Promise<Buffer>;
    binarizeImage: (image: Buffer | string, options?: {
        method?: "otsu" | "adaptive" | "sauvola";
        threshold?: number;
    }) => Promise<Buffer>;
    enhanceContrast: (image: Buffer | string, factor?: number) => Promise<Buffer>;
    removeBackground: (image: Buffer | string) => Promise<Buffer>;
    autoRotateText: (image: Buffer | string) => Promise<{
        image: Buffer;
        rotation: TextOrientation;
    }>;
    cropDocumentBorders: (image: Buffer | string, threshold?: number) => Promise<Buffer>;
    calculateConfidenceScore: (result: OCRResult) => ConfidenceScore;
    identifyLowConfidenceRegions: (result: OCRResult, threshold?: number) => Array<{
        text: string;
        confidence: number;
        bbox: BoundingBox;
    }>;
    validateOCRQuality: (result: OCRResult, criteria?: {
        minConfidence?: number;
        maxLowConfidenceWords?: number;
    }) => {
        valid: boolean;
        issues: string[];
        score: number;
    };
    generateConfidenceHeatmap: (result: OCRResult, originalImage: Buffer | string) => Promise<Buffer>;
    spellCheckOCRResult: (text: string, language?: OCRLanguage) => Promise<SpellCheckResult>;
    autoCorrectOCRMistakes: (text: string, options?: {
        fixCommonErrors?: boolean;
        replaceConfusedCharacters?: boolean;
    }) => Promise<string>;
    validateMedicalTerms: (text: string, dictionary?: string[]) => Promise<{
        valid: boolean;
        unknownTerms: string[];
    }>;
    suggestCorrections: (words: OCRWord[], confidenceThreshold?: number) => Promise<Map<string, string[]>>;
    ocrWithAutoLanguageDetection: (image: Buffer | string) => Promise<OCRResult & {
        detectedLanguage: OCRLanguage;
    }>;
    trainCustomLanguageModel: (trainingData: Array<{
        image: Buffer;
        text: string;
    }>, language: OCRLanguage) => Promise<string>;
    processMixedLanguageDocument: (document: Buffer | string, languages: OCRLanguage[]) => Promise<Map<OCRLanguage, string>>;
    transliterateToLatin: (text: string, sourceLanguage: OCRLanguage) => Promise<string>;
    batchOCRProcessing: (config: BatchOCRConfig) => Promise<BatchOCRResult>;
    ocrDirectory: (directory: string, options?: OCROptions) => Promise<BatchOCRResult>;
    queueOCRJob: (file: Buffer | string, options?: OCROptions, priority?: string) => Promise<string>;
    monitorOCRJob: (jobId: string) => Promise<{
        status: OCRStatus;
        progress: number;
    }>;
    recognizeTables: (document: Buffer | string, options?: OCROptions) => Promise<TableRecognitionResult[]>;
    extractFormFields: (form: Buffer | string, options?: OCROptions) => Promise<FormFieldResult>;
    recognizeCheckboxes: (form: Buffer | string) => Promise<Array<{
        type: "checkbox" | "radio";
        checked: boolean;
        bbox: BoundingBox;
    }>>;
    extractKeyValuePairs: (document: Buffer | string) => Promise<Map<string, string>>;
    recognizeHandwriting: (image: Buffer | string, options?: HandwritingOptions) => Promise<OCRResult>;
    processMedicalPrescription: (prescription: Buffer | string) => Promise<{
        medications: string[];
        dosages: string[];
        instructions: string[];
    }>;
    recognizeSignatures: (document: Buffer | string) => Promise<Array<{
        bbox: BoundingBox;
        confidence: number;
    }>>;
    validateSignature: (signature: Buffer, reference: Buffer) => Promise<{
        authentic: boolean;
        similarity: number;
    }>;
    processLabResults: (labResult: Buffer | string) => Promise<Map<string, {
        value: string;
        unit?: string;
        reference?: string;
    }>>;
    extractMedicalRecordData: (medicalRecord: Buffer | string) => Promise<{
        patientInfo: any;
        vitals: any;
        diagnoses: string[];
        medications: string[];
    }>;
    createOCRJobModel: (sequelize: Sequelize) => any;
    createOCRResultModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=document-ocr-kit.d.ts.map