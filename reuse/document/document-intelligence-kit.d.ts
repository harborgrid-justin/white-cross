/**
 * LOC: DOC-INTEL-001
 * File: /reuse/document/document-intelligence-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - @tensorflow/tfjs-node
 *   - openai (v4.x)
 *   - @anthropic-ai/sdk
 *   - natural
 *   - compromise
 *
 * DOWNSTREAM (imported by):
 *   - Document processing controllers
 *   - AI analysis services
 *   - Content intelligence modules
 *   - Healthcare NLP services
 */
/**
 * File: /reuse/document/document-intelligence-kit.ts
 * Locator: WC-UTL-DOCINTELL-001
 * Purpose: AI Document Intelligence Kit - Classification, NER, sentiment analysis, topic modeling, similarity, summarization, PII detection
 *
 * Upstream: @nestjs/common, sequelize, @tensorflow/tfjs-node, openai, @anthropic-ai/sdk, natural, compromise
 * Downstream: AI controllers, NLP services, content analysis modules, intelligence handlers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, TensorFlow.js 4.x, OpenAI SDK 4.x, Anthropic SDK 0.20.x
 * Exports: 45 utility functions for AI classification, NER, sentiment, topics, similarity, summarization, PII detection
 *
 * LLM Context: Production-grade AI document intelligence utilities for White Cross healthcare platform.
 * Provides document classification (medical specialties, urgency, document types), named entity recognition
 * (medical entities, PHI, medications, diagnoses), sentiment analysis (patient satisfaction, clinical notes),
 * topic modeling (medical topics, clustering), document similarity (semantic search, duplicate detection),
 * content summarization (clinical summaries, patient-friendly explanations), and PII detection (HIPAA compliance,
 * data redaction). Integrates with OpenAI GPT-4, Anthropic Claude, and TensorFlow for medical NLP tasks.
 */
import { Sequelize } from 'sequelize';
/**
 * AI model providers
 */
export type AIModelProvider = 'openai' | 'anthropic' | 'tensorflow' | 'custom';
/**
 * Document classification categories
 */
export type DocumentCategory = 'clinical-note' | 'lab-report' | 'radiology-report' | 'prescription' | 'discharge-summary' | 'consent-form' | 'insurance-claim' | 'referral' | 'other';
/**
 * Medical specialties for classification
 */
export type MedicalSpecialty = 'cardiology' | 'neurology' | 'oncology' | 'pediatrics' | 'radiology' | 'pathology' | 'surgery' | 'emergency' | 'general';
/**
 * Urgency levels
 */
export type UrgencyLevel = 'critical' | 'urgent' | 'routine' | 'informational';
/**
 * Named entity types
 */
export type EntityType = 'PERSON' | 'ORGANIZATION' | 'LOCATION' | 'DATE' | 'MEDICATION' | 'DIAGNOSIS' | 'PROCEDURE' | 'SYMPTOM' | 'BODY_PART' | 'TEST_RESULT' | 'DOSAGE' | 'ALLERGY';
/**
 * Sentiment polarity
 */
export type SentimentPolarity = 'positive' | 'negative' | 'neutral' | 'mixed';
/**
 * PII types for healthcare
 */
export type PIIType = 'NAME' | 'SSN' | 'MRN' | 'DOB' | 'ADDRESS' | 'PHONE' | 'EMAIL' | 'ACCOUNT_NUMBER' | 'CERTIFICATE_NUMBER' | 'LICENSE_NUMBER' | 'IP_ADDRESS' | 'BIOMETRIC' | 'PHOTO';
/**
 * AI model configuration
 */
export interface AIModelConfig {
    provider: AIModelProvider;
    modelName: string;
    apiKey?: string;
    apiEndpoint?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    timeout?: number;
}
/**
 * Document classification result
 */
export interface ClassificationResult {
    category: DocumentCategory;
    confidence: number;
    specialty?: MedicalSpecialty;
    urgency?: UrgencyLevel;
    subcategories?: Array<{
        label: string;
        confidence: number;
    }>;
    metadata?: Record<string, any>;
    modelUsed: string;
    processingTime: number;
}
/**
 * Multi-label classification result
 */
export interface MultiLabelClassification {
    labels: Array<{
        label: string;
        confidence: number;
        category?: string;
    }>;
    primaryLabel: string;
    modelUsed: string;
}
/**
 * Named entity
 */
export interface NamedEntity {
    text: string;
    type: EntityType;
    startIndex: number;
    endIndex: number;
    confidence: number;
    metadata?: Record<string, any>;
    normalizedValue?: string;
    codingSystem?: string;
    code?: string;
}
/**
 * Entity extraction result
 */
export interface EntityExtractionResult {
    entities: NamedEntity[];
    totalEntities: number;
    entityCounts: Record<EntityType, number>;
    processingTime: number;
    modelUsed: string;
}
/**
 * Medical entity with clinical context
 */
export interface MedicalEntity extends NamedEntity {
    clinicalContext?: string;
    severity?: 'mild' | 'moderate' | 'severe';
    status?: 'active' | 'resolved' | 'historical';
    relationships?: Array<{
        relatedEntityId: string;
        relationType: string;
    }>;
}
/**
 * Sentiment analysis result
 */
export interface SentimentResult {
    polarity: SentimentPolarity;
    score: number;
    confidence: number;
    emotions?: Array<{
        emotion: string;
        intensity: number;
    }>;
    aspects?: Array<{
        aspect: string;
        sentiment: SentimentPolarity;
        score: number;
    }>;
    modelUsed: string;
}
/**
 * Clinical sentiment analysis
 */
export interface ClinicalSentimentResult extends SentimentResult {
    patientSatisfaction?: number;
    urgencyIndicators?: string[];
    concernAreas?: string[];
    positiveIndicators?: string[];
}
/**
 * Topic modeling result
 */
export interface TopicModelingResult {
    topics: Array<{
        id: string;
        label: string;
        keywords: string[];
        coherenceScore: number;
        documentCount?: number;
    }>;
    documentTopics: Array<{
        topicId: string;
        weight: number;
    }>;
    dominantTopic: string;
    modelUsed: string;
}
/**
 * Topic extraction configuration
 */
export interface TopicExtractionConfig {
    numberOfTopics: number;
    method: 'lda' | 'nmf' | 'bert-topic' | 'gpt';
    minDocuments?: number;
    maxKeywords?: number;
    coherenceThreshold?: number;
}
/**
 * Document similarity result
 */
export interface SimilarityResult {
    documentId: string;
    similarityScore: number;
    matchedSections?: Array<{
        section: string;
        score: number;
    }>;
    sharedEntities?: string[];
    sharedTopics?: string[];
}
/**
 * Semantic search result
 */
export interface SemanticSearchResult {
    results: Array<{
        documentId: string;
        score: number;
        excerpt: string;
        highlights?: string[];
        metadata?: Record<string, any>;
    }>;
    totalResults: number;
    query: string;
    processingTime: number;
}
/**
 * Document embedding
 */
export interface DocumentEmbedding {
    documentId: string;
    embedding: number[];
    embeddingModel: string;
    dimensions: number;
    createdAt: Date;
}
/**
 * Summarization configuration
 */
export interface SummarizationConfig {
    maxLength?: number;
    minLength?: number;
    style: 'clinical' | 'patient-friendly' | 'executive' | 'technical';
    includeKeyPoints?: boolean;
    extractiveRatio?: number;
    abstraction?: 'extractive' | 'abstractive' | 'hybrid';
}
/**
 * Summary result
 */
export interface SummaryResult {
    summary: string;
    keyPoints?: string[];
    extractedSentences?: string[];
    compressionRatio: number;
    originalLength: number;
    summaryLength: number;
    modelUsed: string;
    processingTime: number;
}
/**
 * Clinical summary
 */
export interface ClinicalSummary extends SummaryResult {
    chiefComplaint?: string;
    diagnoses?: string[];
    medications?: string[];
    procedures?: string[];
    recommendations?: string[];
    followUp?: string;
}
/**
 * PII detection result
 */
export interface PIIDetectionResult {
    hasPII: boolean;
    piiInstances: Array<{
        type: PIIType;
        value: string;
        startIndex: number;
        endIndex: number;
        confidence: number;
        redactedValue?: string;
    }>;
    totalInstances: number;
    piiCounts: Record<PIIType, number>;
    riskLevel: 'high' | 'medium' | 'low';
    hipaaCompliant: boolean;
}
/**
 * Redaction options
 */
export interface RedactionOptions {
    method: 'mask' | 'remove' | 'hash' | 'tokenize';
    preserveFormat?: boolean;
    replacementChar?: string;
    keepFirstN?: number;
    keepLastN?: number;
}
/**
 * Document intelligence analytics
 */
export interface IntelligenceAnalytics {
    documentId: string;
    classification: ClassificationResult;
    entities: EntityExtractionResult;
    sentiment?: SentimentResult;
    topics?: TopicModelingResult;
    piiDetection: PIIDetectionResult;
    summary?: SummaryResult;
    processingTime: number;
    timestamp: Date;
}
/**
 * Document classification model attributes
 */
export interface DocumentClassificationAttributes {
    id: string;
    documentId: string;
    category: string;
    confidence: number;
    specialty?: string;
    urgency?: string;
    subcategories?: Record<string, any>[];
    modelProvider: string;
    modelName: string;
    modelVersion?: string;
    processingTime: number;
    metadata?: Record<string, any>;
    classifiedAt: Date;
    classifiedBy?: string;
    isVerified: boolean;
    verifiedBy?: string;
    verifiedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Extracted entity model attributes
 */
export interface ExtractedEntityAttributes {
    id: string;
    documentId: string;
    text: string;
    entityType: string;
    startIndex: number;
    endIndex: number;
    confidence: number;
    normalizedValue?: string;
    codingSystem?: string;
    code?: string;
    clinicalContext?: string;
    severity?: string;
    status?: string;
    relationships?: Record<string, any>[];
    modelProvider: string;
    modelName: string;
    extractedAt: Date;
    extractedBy?: string;
    isVerified: boolean;
    verifiedBy?: string;
    verifiedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Sentiment analysis model attributes
 */
export interface SentimentAnalysisAttributes {
    id: string;
    documentId: string;
    polarity: string;
    score: number;
    confidence: number;
    emotions?: Record<string, any>[];
    aspects?: Record<string, any>[];
    patientSatisfaction?: number;
    urgencyIndicators?: string[];
    concernAreas?: string[];
    positiveIndicators?: string[];
    modelProvider: string;
    modelName: string;
    processingTime: number;
    analyzedAt: Date;
    analyzedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates DocumentClassification model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentClassificationAttributes>>} DocumentClassification model
 *
 * @example
 * ```typescript
 * const ClassificationModel = createDocumentClassificationModel(sequelize);
 * const classification = await ClassificationModel.create({
 *   documentId: 'doc-uuid',
 *   category: 'clinical-note',
 *   confidence: 0.95,
 *   specialty: 'cardiology',
 *   urgency: 'urgent',
 *   modelProvider: 'openai',
 *   modelName: 'gpt-4',
 *   processingTime: 1250,
 *   classifiedAt: new Date()
 * });
 * ```
 */
export declare const createDocumentClassificationModel: (sequelize: Sequelize) => any;
/**
 * Creates ExtractedEntity model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ExtractedEntityAttributes>>} ExtractedEntity model
 *
 * @example
 * ```typescript
 * const EntityModel = createExtractedEntityModel(sequelize);
 * const entity = await EntityModel.create({
 *   documentId: 'doc-uuid',
 *   text: 'Lisinopril 10mg',
 *   entityType: 'MEDICATION',
 *   startIndex: 120,
 *   endIndex: 135,
 *   confidence: 0.98,
 *   codingSystem: 'RxNorm',
 *   code: '314076',
 *   modelProvider: 'openai',
 *   modelName: 'gpt-4',
 *   extractedAt: new Date()
 * });
 * ```
 */
export declare const createExtractedEntityModel: (sequelize: Sequelize) => any;
/**
 * Creates SentimentAnalysis model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<SentimentAnalysisAttributes>>} SentimentAnalysis model
 *
 * @example
 * ```typescript
 * const SentimentModel = createSentimentAnalysisModel(sequelize);
 * const sentiment = await SentimentModel.create({
 *   documentId: 'doc-uuid',
 *   polarity: 'positive',
 *   score: 0.85,
 *   confidence: 0.92,
 *   patientSatisfaction: 0.88,
 *   modelProvider: 'anthropic',
 *   modelName: 'claude-3-opus',
 *   processingTime: 890,
 *   analyzedAt: new Date()
 * });
 * ```
 */
export declare const createSentimentAnalysisModel: (sequelize: Sequelize) => any;
/**
 * 1. Classifies document using AI model.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<ClassificationResult>} Classification result
 *
 * @example
 * ```typescript
 * const result = await classifyDocument(text, {
 *   provider: 'openai',
 *   modelName: 'gpt-4',
 *   apiKey: process.env.OPENAI_API_KEY,
 *   temperature: 0.2
 * });
 * console.log('Category:', result.category, 'Confidence:', result.confidence);
 * ```
 */
export declare const classifyDocument: (documentText: string, config: AIModelConfig) => Promise<ClassificationResult>;
/**
 * 2. Performs multi-label classification on document.
 *
 * @param {string} documentText - Document text content
 * @param {string[]} possibleLabels - List of possible labels
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<MultiLabelClassification>} Multi-label classification
 *
 * @example
 * ```typescript
 * const labels = await multiLabelClassification(text, [
 *   'cardiology', 'diabetes', 'hypertension', 'medication-review'
 * ], aiConfig);
 * ```
 */
export declare const multiLabelClassification: (documentText: string, possibleLabels: string[], config: AIModelConfig) => Promise<MultiLabelClassification>;
/**
 * 3. Classifies medical specialty from document.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<{ specialty: MedicalSpecialty; confidence: number }>} Specialty classification
 *
 * @example
 * ```typescript
 * const { specialty, confidence } = await classifyMedicalSpecialty(clinicalNote, aiConfig);
 * console.log(`Specialty: ${specialty} (${(confidence * 100).toFixed(1)}%)`);
 * ```
 */
export declare const classifyMedicalSpecialty: (documentText: string, config: AIModelConfig) => Promise<{
    specialty: MedicalSpecialty;
    confidence: number;
}>;
/**
 * 4. Determines document urgency level.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<{ urgency: UrgencyLevel; confidence: number; indicators: string[] }>} Urgency assessment
 *
 * @example
 * ```typescript
 * const urgency = await assessDocumentUrgency(text, aiConfig);
 * if (urgency.urgency === 'critical') {
 *   console.log('Urgent indicators:', urgency.indicators);
 * }
 * ```
 */
export declare const assessDocumentUrgency: (documentText: string, config: AIModelConfig) => Promise<{
    urgency: UrgencyLevel;
    confidence: number;
    indicators: string[];
}>;
/**
 * 5. Classifies document with hierarchical categories.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<{ primary: string; secondary: string; tertiary?: string; confidence: number }>} Hierarchical classification
 *
 * @example
 * ```typescript
 * const hierarchy = await hierarchicalClassification(text, aiConfig);
 * console.log(`${hierarchy.primary} > ${hierarchy.secondary} > ${hierarchy.tertiary}`);
 * ```
 */
export declare const hierarchicalClassification: (documentText: string, config: AIModelConfig) => Promise<{
    primary: string;
    secondary: string;
    tertiary?: string;
    confidence: number;
}>;
/**
 * 6. Batch classifies multiple documents.
 *
 * @param {Array<{ id: string; text: string }>} documents - Documents to classify
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<Map<string, ClassificationResult>>} Classification results by document ID
 *
 * @example
 * ```typescript
 * const results = await batchClassifyDocuments([
 *   { id: 'doc1', text: '...' },
 *   { id: 'doc2', text: '...' }
 * ], aiConfig);
 * ```
 */
export declare const batchClassifyDocuments: (documents: Array<{
    id: string;
    text: string;
}>, config: AIModelConfig) => Promise<Map<string, ClassificationResult>>;
/**
 * 7. Trains custom classification model.
 *
 * @param {Array<{ text: string; label: string }>} trainingData - Training examples
 * @param {string} modelName - Name for custom model
 * @returns {Promise<{ modelId: string; accuracy: number; trained: Date }>} Training result
 *
 * @example
 * ```typescript
 * const model = await trainCustomClassifier(trainingExamples, 'specialty-classifier-v1');
 * console.log('Model accuracy:', model.accuracy);
 * ```
 */
export declare const trainCustomClassifier: (trainingData: Array<{
    text: string;
    label: string;
}>, modelName: string) => Promise<{
    modelId: string;
    accuracy: number;
    trained: Date;
}>;
/**
 * 8. Extracts named entities from document.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<EntityExtractionResult>} Extracted entities
 *
 * @example
 * ```typescript
 * const entities = await extractNamedEntities(text, aiConfig);
 * console.log(`Found ${entities.totalEntities} entities`);
 * entities.entities.forEach(e => console.log(`${e.type}: ${e.text}`));
 * ```
 */
export declare const extractNamedEntities: (documentText: string, config: AIModelConfig) => Promise<EntityExtractionResult>;
/**
 * 9. Extracts medical entities with clinical context.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<MedicalEntity[]>} Medical entities with context
 *
 * @example
 * ```typescript
 * const medicalEntities = await extractMedicalEntities(clinicalNote, aiConfig);
 * medicalEntities.forEach(e => {
 *   console.log(`${e.type}: ${e.text} [${e.status}]`);
 * });
 * ```
 */
export declare const extractMedicalEntities: (documentText: string, config: AIModelConfig) => Promise<MedicalEntity[]>;
/**
 * 10. Extracts medications with dosage information.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<Array<{ medication: string; dosage?: string; frequency?: string; route?: string; code?: string }>>} Medications
 *
 * @example
 * ```typescript
 * const medications = await extractMedications(text, aiConfig);
 * medications.forEach(med => {
 *   console.log(`${med.medication} ${med.dosage} ${med.frequency}`);
 * });
 * ```
 */
export declare const extractMedications: (documentText: string, config: AIModelConfig) => Promise<Array<{
    medication: string;
    dosage?: string;
    frequency?: string;
    route?: string;
    code?: string;
}>>;
/**
 * 11. Extracts diagnoses with ICD-10 codes.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<Array<{ diagnosis: string; icd10Code?: string; status?: string }>>} Diagnoses
 *
 * @example
 * ```typescript
 * const diagnoses = await extractDiagnoses(text, aiConfig);
 * diagnoses.forEach(dx => console.log(`${dx.diagnosis} (${dx.icd10Code})`));
 * ```
 */
export declare const extractDiagnoses: (documentText: string, config: AIModelConfig) => Promise<Array<{
    diagnosis: string;
    icd10Code?: string;
    status?: string;
}>>;
/**
 * 12. Normalizes medical entities to standard codes.
 *
 * @param {NamedEntity[]} entities - Extracted entities
 * @param {string} [codingSystem] - Target coding system (ICD-10, SNOMED, RxNorm)
 * @returns {Promise<NamedEntity[]>} Entities with normalized codes
 *
 * @example
 * ```typescript
 * const normalizedEntities = await normalizeMedicalEntities(entities, 'SNOMED');
 * ```
 */
export declare const normalizeMedicalEntities: (entities: NamedEntity[], codingSystem?: string) => Promise<NamedEntity[]>;
/**
 * 13. Extracts entity relationships from text.
 *
 * @param {string} documentText - Document text content
 * @param {NamedEntity[]} entities - Previously extracted entities
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<Array<{ entity1: string; entity2: string; relationship: string; confidence: number }>>} Entity relationships
 *
 * @example
 * ```typescript
 * const relationships = await extractEntityRelationships(text, entities, aiConfig);
 * relationships.forEach(rel => {
 *   console.log(`${rel.entity1} ${rel.relationship} ${rel.entity2}`);
 * });
 * ```
 */
export declare const extractEntityRelationships: (documentText: string, entities: NamedEntity[], config: AIModelConfig) => Promise<Array<{
    entity1: string;
    entity2: string;
    relationship: string;
    confidence: number;
}>>;
/**
 * 14. Batch extracts entities from multiple documents.
 *
 * @param {Array<{ id: string; text: string }>} documents - Documents to process
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<Map<string, EntityExtractionResult>>} Extraction results by document ID
 *
 * @example
 * ```typescript
 * const results = await batchExtractEntities(documents, aiConfig);
 * results.forEach((result, docId) => {
 *   console.log(`Document ${docId}: ${result.totalEntities} entities`);
 * });
 * ```
 */
export declare const batchExtractEntities: (documents: Array<{
    id: string;
    text: string;
}>, config: AIModelConfig) => Promise<Map<string, EntityExtractionResult>>;
/**
 * 15. Analyzes sentiment of document.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<SentimentResult>} Sentiment analysis result
 *
 * @example
 * ```typescript
 * const sentiment = await analyzeSentiment(patientFeedback, aiConfig);
 * console.log(`Sentiment: ${sentiment.polarity} (${sentiment.score.toFixed(2)})`);
 * ```
 */
export declare const analyzeSentiment: (documentText: string, config: AIModelConfig) => Promise<SentimentResult>;
/**
 * 16. Analyzes clinical sentiment and patient satisfaction.
 *
 * @param {string} documentText - Clinical or feedback text
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<ClinicalSentimentResult>} Clinical sentiment analysis
 *
 * @example
 * ```typescript
 * const clinical = await analyzeClinicalSentiment(patientNote, aiConfig);
 * console.log('Patient satisfaction:', clinical.patientSatisfaction);
 * ```
 */
export declare const analyzeClinicalSentiment: (documentText: string, config: AIModelConfig) => Promise<ClinicalSentimentResult>;
/**
 * 17. Performs aspect-based sentiment analysis.
 *
 * @param {string} documentText - Document text content
 * @param {string[]} aspects - Aspects to analyze
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<Array<{ aspect: string; sentiment: SentimentPolarity; score: number; mentions: number }>>} Aspect sentiments
 *
 * @example
 * ```typescript
 * const aspectSentiments = await aspectBasedSentiment(feedback, [
 *   'doctor communication', 'facility cleanliness', 'wait time'
 * ], aiConfig);
 * ```
 */
export declare const aspectBasedSentiment: (documentText: string, aspects: string[], config: AIModelConfig) => Promise<Array<{
    aspect: string;
    sentiment: SentimentPolarity;
    score: number;
    mentions: number;
}>>;
/**
 * 18. Detects emotions in text.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<Array<{ emotion: string; intensity: number; confidence: number }>>} Detected emotions
 *
 * @example
 * ```typescript
 * const emotions = await detectEmotions(text, aiConfig);
 * emotions.forEach(e => console.log(`${e.emotion}: ${(e.intensity * 100).toFixed(0)}%`));
 * ```
 */
export declare const detectEmotions: (documentText: string, config: AIModelConfig) => Promise<Array<{
    emotion: string;
    intensity: number;
    confidence: number;
}>>;
/**
 * 19. Analyzes sentiment trends over time.
 *
 * @param {Array<{ date: Date; text: string }>} documents - Documents with timestamps
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<Array<{ date: Date; sentiment: number; polarity: SentimentPolarity }>>} Sentiment trend
 *
 * @example
 * ```typescript
 * const trend = await sentimentTrendAnalysis(timedDocuments, aiConfig);
 * trend.forEach(point => console.log(`${point.date}: ${point.sentiment}`));
 * ```
 */
export declare const sentimentTrendAnalysis: (documents: Array<{
    date: Date;
    text: string;
}>, config: AIModelConfig) => Promise<Array<{
    date: Date;
    sentiment: number;
    polarity: SentimentPolarity;
}>>;
/**
 * 20. Compares sentiment across multiple documents.
 *
 * @param {Array<{ id: string; text: string; category?: string }>} documents - Documents to compare
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<{ overall: SentimentResult; byCategory?: Map<string, SentimentResult> }>} Comparative sentiment
 *
 * @example
 * ```typescript
 * const comparison = await compareSentiments(documents, aiConfig);
 * console.log('Overall sentiment:', comparison.overall.polarity);
 * ```
 */
export declare const compareSentiments: (documents: Array<{
    id: string;
    text: string;
    category?: string;
}>, config: AIModelConfig) => Promise<{
    overall: SentimentResult;
    byCategory?: Map<string, SentimentResult>;
}>;
/**
 * 21. Generates sentiment summary report.
 *
 * @param {SentimentResult[]} sentiments - Sentiment analysis results
 * @returns {string} Formatted sentiment report (JSON)
 *
 * @example
 * ```typescript
 * const report = generateSentimentReport(sentimentResults);
 * console.log(report);
 * ```
 */
export declare const generateSentimentReport: (sentiments: SentimentResult[]) => string;
/**
 * 22. Extracts topics from document corpus.
 *
 * @param {string[]} documents - Collection of documents
 * @param {TopicExtractionConfig} config - Topic extraction configuration
 * @param {AIModelConfig} aiConfig - AI model configuration
 * @returns {Promise<TopicModelingResult>} Topic modeling result
 *
 * @example
 * ```typescript
 * const topics = await extractTopics(documents, {
 *   numberOfTopics: 5,
 *   method: 'gpt',
 *   maxKeywords: 10
 * }, aiConfig);
 * ```
 */
export declare const extractTopics: (documents: string[], config: TopicExtractionConfig, aiConfig: AIModelConfig) => Promise<TopicModelingResult>;
/**
 * 23. Identifies main topics in a single document.
 *
 * @param {string} documentText - Document text content
 * @param {number} [numTopics] - Number of topics to extract
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<Array<{ topic: string; keywords: string[]; relevance: number }>>} Document topics
 *
 * @example
 * ```typescript
 * const docTopics = await identifyDocumentTopics(text, 3, aiConfig);
 * docTopics.forEach(t => console.log(`${t.topic}: ${t.keywords.join(', ')}`));
 * ```
 */
export declare const identifyDocumentTopics: (documentText: string, numTopics: number | undefined, config: AIModelConfig) => Promise<Array<{
    topic: string;
    keywords: string[];
    relevance: number;
}>>;
/**
 * 24. Performs hierarchical topic clustering.
 *
 * @param {string[]} documents - Collection of documents
 * @param {number} levels - Number of hierarchy levels
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<{ hierarchy: any; topics: TopicModelingResult }>} Hierarchical topics
 *
 * @example
 * ```typescript
 * const hierarchy = await hierarchicalTopicClustering(documents, 3, aiConfig);
 * ```
 */
export declare const hierarchicalTopicClustering: (documents: string[], levels: number, config: AIModelConfig) => Promise<{
    hierarchy: any;
    topics: TopicModelingResult;
}>;
/**
 * 25. Tracks topic evolution over time.
 *
 * @param {Array<{ date: Date; text: string }>} documents - Documents with timestamps
 * @param {TopicExtractionConfig} config - Topic extraction configuration
 * @param {AIModelConfig} aiConfig - AI model configuration
 * @returns {Promise<Array<{ date: Date; topics: TopicModelingResult }>>} Topic evolution
 *
 * @example
 * ```typescript
 * const evolution = await trackTopicEvolution(timedDocuments, topicConfig, aiConfig);
 * ```
 */
export declare const trackTopicEvolution: (documents: Array<{
    date: Date;
    text: string;
}>, config: TopicExtractionConfig, aiConfig: AIModelConfig) => Promise<Array<{
    date: Date;
    topics: TopicModelingResult;
}>>;
/**
 * 26. Generates topic visualization data.
 *
 * @param {TopicModelingResult} topics - Topic modeling result
 * @returns {Record<string, any>} Visualization data for charts
 *
 * @example
 * ```typescript
 * const vizData = generateTopicVisualization(topicResult);
 * // Use vizData with D3.js or Chart.js
 * ```
 */
export declare const generateTopicVisualization: (topics: TopicModelingResult) => Record<string, any>;
/**
 * 27. Compares topics across document collections.
 *
 * @param {Map<string, string[]>} collections - Named document collections
 * @param {TopicExtractionConfig} config - Topic extraction configuration
 * @param {AIModelConfig} aiConfig - AI model configuration
 * @returns {Promise<Map<string, TopicModelingResult>>} Topics by collection
 *
 * @example
 * ```typescript
 * const comparison = await compareTopicsAcrossCollections(
 *   new Map([
 *     ['Q1-2024', q1Documents],
 *     ['Q2-2024', q2Documents]
 *   ]),
 *   topicConfig,
 *   aiConfig
 * );
 * ```
 */
export declare const compareTopicsAcrossCollections: (collections: Map<string, string[]>, config: TopicExtractionConfig, aiConfig: AIModelConfig) => Promise<Map<string, TopicModelingResult>>;
/**
 * 28. Calculates similarity between two documents.
 *
 * @param {string} document1 - First document text
 * @param {string} document2 - Second document text
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<SimilarityResult>} Similarity result
 *
 * @example
 * ```typescript
 * const similarity = await calculateDocumentSimilarity(doc1, doc2, aiConfig);
 * console.log(`Similarity: ${(similarity.similarityScore * 100).toFixed(1)}%`);
 * ```
 */
export declare const calculateDocumentSimilarity: (document1: string, document2: string, config: AIModelConfig) => Promise<SimilarityResult>;
/**
 * 29. Generates document embedding vector.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<DocumentEmbedding>} Document embedding
 *
 * @example
 * ```typescript
 * const embedding = await generateDocumentEmbedding(text, aiConfig);
 * // Store embedding for similarity search
 * ```
 */
export declare const generateDocumentEmbedding: (documentText: string, config: AIModelConfig) => Promise<DocumentEmbedding>;
/**
 * 30. Performs semantic search across documents.
 *
 * @param {string} query - Search query
 * @param {DocumentEmbedding[]} documentEmbeddings - Document embeddings to search
 * @param {number} [topK] - Number of results to return
 * @returns {Promise<SemanticSearchResult>} Search results
 *
 * @example
 * ```typescript
 * const results = await semanticSearch('chest pain treatment', embeddings, 10);
 * results.results.forEach(r => console.log(`${r.documentId}: ${r.score}`));
 * ```
 */
export declare const semanticSearch: (query: string, documentEmbeddings: DocumentEmbedding[], topK?: number) => Promise<SemanticSearchResult>;
/**
 * 31. Finds duplicate or near-duplicate documents.
 *
 * @param {Array<{ id: string; text: string }>} documents - Documents to check
 * @param {number} [threshold] - Similarity threshold (0-1)
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<Array<{ doc1: string; doc2: string; similarity: number }>>} Duplicate pairs
 *
 * @example
 * ```typescript
 * const duplicates = await findDuplicateDocuments(documents, 0.9, aiConfig);
 * duplicates.forEach(d => console.log(`${d.doc1} ~ ${d.doc2}: ${d.similarity}`));
 * ```
 */
export declare const findDuplicateDocuments: (documents: Array<{
    id: string;
    text: string;
}>, threshold: number | undefined, config: AIModelConfig) => Promise<Array<{
    doc1: string;
    doc2: string;
    similarity: number;
}>>;
/**
 * 32. Clusters similar documents.
 *
 * @param {Array<{ id: string; text: string }>} documents - Documents to cluster
 * @param {number} numClusters - Number of clusters
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<Map<number, string[]>>} Document IDs by cluster
 *
 * @example
 * ```typescript
 * const clusters = await clusterSimilarDocuments(documents, 5, aiConfig);
 * clusters.forEach((docIds, clusterId) => {
 *   console.log(`Cluster ${clusterId}: ${docIds.length} documents`);
 * });
 * ```
 */
export declare const clusterSimilarDocuments: (documents: Array<{
    id: string;
    text: string;
}>, numClusters: number, config: AIModelConfig) => Promise<Map<number, string[]>>;
/**
 * 33. Finds most similar documents to a given document.
 *
 * @param {string} documentId - Reference document ID
 * @param {string} documentText - Reference document text
 * @param {Array<{ id: string; text: string }>} candidates - Candidate documents
 * @param {number} [topK] - Number of similar documents to return
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<SimilarityResult[]>} Most similar documents
 *
 * @example
 * ```typescript
 * const similar = await findSimilarDocuments('doc-123', text, allDocuments, 5, aiConfig);
 * ```
 */
export declare const findSimilarDocuments: (documentId: string, documentText: string, candidates: Array<{
    id: string;
    text: string;
}>, topK: number | undefined, config: AIModelConfig) => Promise<SimilarityResult[]>;
/**
 * 34. Generates summary of document.
 *
 * @param {string} documentText - Document text content
 * @param {SummarizationConfig} config - Summarization configuration
 * @param {AIModelConfig} aiConfig - AI model configuration
 * @returns {Promise<SummaryResult>} Summary result
 *
 * @example
 * ```typescript
 * const summary = await summarizeDocument(longDocument, {
 *   maxLength: 200,
 *   style: 'clinical',
 *   abstraction: 'abstractive'
 * }, aiConfig);
 * console.log(summary.summary);
 * ```
 */
export declare const summarizeDocument: (documentText: string, config: SummarizationConfig, aiConfig: AIModelConfig) => Promise<SummaryResult>;
/**
 * 35. Generates clinical summary from medical document.
 *
 * @param {string} clinicalText - Clinical document text
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<ClinicalSummary>} Clinical summary
 *
 * @example
 * ```typescript
 * const clinicalSummary = await generateClinicalSummary(clinicalNote, aiConfig);
 * console.log('Chief Complaint:', clinicalSummary.chiefComplaint);
 * console.log('Diagnoses:', clinicalSummary.diagnoses);
 * ```
 */
export declare const generateClinicalSummary: (clinicalText: string, config: AIModelConfig) => Promise<ClinicalSummary>;
/**
 * 36. Creates patient-friendly summary.
 *
 * @param {string} medicalText - Medical document text
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<SummaryResult>} Patient-friendly summary
 *
 * @example
 * ```typescript
 * const patientSummary = await createPatientFriendlySummary(clinicalNote, aiConfig);
 * // Summary in plain language for patient understanding
 * ```
 */
export declare const createPatientFriendlySummary: (medicalText: string, config: AIModelConfig) => Promise<SummaryResult>;
/**
 * 37. Extracts key points from document.
 *
 * @param {string} documentText - Document text content
 * @param {number} [numPoints] - Number of key points to extract
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<string[]>} Key points
 *
 * @example
 * ```typescript
 * const keyPoints = await extractKeyPoints(document, 5, aiConfig);
 * keyPoints.forEach((point, i) => console.log(`${i + 1}. ${point}`));
 * ```
 */
export declare const extractKeyPoints: (documentText: string, numPoints: number | undefined, config: AIModelConfig) => Promise<string[]>;
/**
 * 38. Generates executive summary for reports.
 *
 * @param {string} reportText - Full report text
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<{ summary: string; highlights: string[]; recommendations: string[] }>} Executive summary
 *
 * @example
 * ```typescript
 * const execSummary = await generateExecutiveSummary(annualReport, aiConfig);
 * console.log(execSummary.summary);
 * ```
 */
export declare const generateExecutiveSummary: (reportText: string, config: AIModelConfig) => Promise<{
    summary: string;
    highlights: string[];
    recommendations: string[];
}>;
/**
 * 39. Summarizes multiple documents into single summary.
 *
 * @param {string[]} documents - Multiple documents to summarize
 * @param {SummarizationConfig} config - Summarization configuration
 * @param {AIModelConfig} aiConfig - AI model configuration
 * @returns {Promise<SummaryResult>} Multi-document summary
 *
 * @example
 * ```typescript
 * const multiSummary = await summarizeMultipleDocuments(
 *   [doc1, doc2, doc3],
 *   { style: 'clinical', maxLength: 300 },
 *   aiConfig
 * );
 * ```
 */
export declare const summarizeMultipleDocuments: (documents: string[], config: SummarizationConfig, aiConfig: AIModelConfig) => Promise<SummaryResult>;
/**
 * 40. Detects PII in document.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<PIIDetectionResult>} PII detection result
 *
 * @example
 * ```typescript
 * const pii = await detectPII(document, aiConfig);
 * console.log(`Found ${pii.totalInstances} PII instances`);
 * console.log('HIPAA Compliant:', pii.hipaaCompliant);
 * ```
 */
export declare const detectPII: (documentText: string, config: AIModelConfig) => Promise<PIIDetectionResult>;
/**
 * 41. Redacts PII from document.
 *
 * @param {string} documentText - Document text content
 * @param {PIIDetectionResult} piiResult - PII detection result
 * @param {RedactionOptions} [options] - Redaction options
 * @returns {Promise<string>} Redacted document text
 *
 * @example
 * ```typescript
 * const redacted = await redactPII(document, piiDetection, {
 *   method: 'mask',
 *   preserveFormat: true
 * });
 * ```
 */
export declare const redactPII: (documentText: string, piiResult: PIIDetectionResult, options?: RedactionOptions) => Promise<string>;
/**
 * 42. Detects PHI (Protected Health Information) specifically.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<PIIDetectionResult>} PHI detection result
 *
 * @example
 * ```typescript
 * const phi = await detectPHI(medicalRecord, aiConfig);
 * if (phi.hasPII) {
 *   console.log('Document contains PHI - handle with HIPAA compliance');
 * }
 * ```
 */
export declare const detectPHI: (documentText: string, config: AIModelConfig) => Promise<PIIDetectionResult>;
/**
 * 43. Validates document for HIPAA compliance.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<{ compliant: boolean; issues: string[]; piiFound: PIIDetectionResult }>} Compliance validation
 *
 * @example
 * ```typescript
 * const validation = await validateHIPAACompliance(document, aiConfig);
 * if (!validation.compliant) {
 *   console.log('HIPAA issues:', validation.issues);
 * }
 * ```
 */
export declare const validateHIPAACompliance: (documentText: string, config: AIModelConfig) => Promise<{
    compliant: boolean;
    issues: string[];
    piiFound: PIIDetectionResult;
}>;
/**
 * 44. Creates anonymized version of document.
 *
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<{ anonymizedText: string; replacementMap: Map<string, string> }>} Anonymized document
 *
 * @example
 * ```typescript
 * const { anonymizedText, replacementMap } = await anonymizeDocument(document, aiConfig);
 * // Use anonymizedText for research, retain replacementMap for de-identification
 * ```
 */
export declare const anonymizeDocument: (documentText: string, config: AIModelConfig) => Promise<{
    anonymizedText: string;
    replacementMap: Map<string, string>;
}>;
/**
 * 45. Generates comprehensive document intelligence report.
 *
 * @param {string} documentId - Document identifier
 * @param {string} documentText - Document text content
 * @param {AIModelConfig} config - AI model configuration
 * @returns {Promise<IntelligenceAnalytics>} Complete intelligence analysis
 *
 * @example
 * ```typescript
 * const intelligence = await generateIntelligenceReport('doc-123', text, aiConfig);
 * console.log('Classification:', intelligence.classification.category);
 * console.log('Entities:', intelligence.entities.totalEntities);
 * console.log('Sentiment:', intelligence.sentiment?.polarity);
 * console.log('PII Risk:', intelligence.piiDetection.riskLevel);
 * ```
 */
export declare const generateIntelligenceReport: (documentId: string, documentText: string, config: AIModelConfig) => Promise<IntelligenceAnalytics>;
declare const _default: {
    createDocumentClassificationModel: (sequelize: Sequelize) => any;
    createExtractedEntityModel: (sequelize: Sequelize) => any;
    createSentimentAnalysisModel: (sequelize: Sequelize) => any;
    classifyDocument: (documentText: string, config: AIModelConfig) => Promise<ClassificationResult>;
    multiLabelClassification: (documentText: string, possibleLabels: string[], config: AIModelConfig) => Promise<MultiLabelClassification>;
    classifyMedicalSpecialty: (documentText: string, config: AIModelConfig) => Promise<{
        specialty: MedicalSpecialty;
        confidence: number;
    }>;
    assessDocumentUrgency: (documentText: string, config: AIModelConfig) => Promise<{
        urgency: UrgencyLevel;
        confidence: number;
        indicators: string[];
    }>;
    hierarchicalClassification: (documentText: string, config: AIModelConfig) => Promise<{
        primary: string;
        secondary: string;
        tertiary?: string;
        confidence: number;
    }>;
    batchClassifyDocuments: (documents: Array<{
        id: string;
        text: string;
    }>, config: AIModelConfig) => Promise<Map<string, ClassificationResult>>;
    trainCustomClassifier: (trainingData: Array<{
        text: string;
        label: string;
    }>, modelName: string) => Promise<{
        modelId: string;
        accuracy: number;
        trained: Date;
    }>;
    extractNamedEntities: (documentText: string, config: AIModelConfig) => Promise<EntityExtractionResult>;
    extractMedicalEntities: (documentText: string, config: AIModelConfig) => Promise<MedicalEntity[]>;
    extractMedications: (documentText: string, config: AIModelConfig) => Promise<Array<{
        medication: string;
        dosage?: string;
        frequency?: string;
        route?: string;
        code?: string;
    }>>;
    extractDiagnoses: (documentText: string, config: AIModelConfig) => Promise<Array<{
        diagnosis: string;
        icd10Code?: string;
        status?: string;
    }>>;
    normalizeMedicalEntities: (entities: NamedEntity[], codingSystem?: string) => Promise<NamedEntity[]>;
    extractEntityRelationships: (documentText: string, entities: NamedEntity[], config: AIModelConfig) => Promise<Array<{
        entity1: string;
        entity2: string;
        relationship: string;
        confidence: number;
    }>>;
    batchExtractEntities: (documents: Array<{
        id: string;
        text: string;
    }>, config: AIModelConfig) => Promise<Map<string, EntityExtractionResult>>;
    analyzeSentiment: (documentText: string, config: AIModelConfig) => Promise<SentimentResult>;
    analyzeClinicalSentiment: (documentText: string, config: AIModelConfig) => Promise<ClinicalSentimentResult>;
    aspectBasedSentiment: (documentText: string, aspects: string[], config: AIModelConfig) => Promise<Array<{
        aspect: string;
        sentiment: SentimentPolarity;
        score: number;
        mentions: number;
    }>>;
    detectEmotions: (documentText: string, config: AIModelConfig) => Promise<Array<{
        emotion: string;
        intensity: number;
        confidence: number;
    }>>;
    sentimentTrendAnalysis: (documents: Array<{
        date: Date;
        text: string;
    }>, config: AIModelConfig) => Promise<Array<{
        date: Date;
        sentiment: number;
        polarity: SentimentPolarity;
    }>>;
    compareSentiments: (documents: Array<{
        id: string;
        text: string;
        category?: string;
    }>, config: AIModelConfig) => Promise<{
        overall: SentimentResult;
        byCategory?: Map<string, SentimentResult>;
    }>;
    generateSentimentReport: (sentiments: SentimentResult[]) => string;
    extractTopics: (documents: string[], config: TopicExtractionConfig, aiConfig: AIModelConfig) => Promise<TopicModelingResult>;
    identifyDocumentTopics: (documentText: string, numTopics: number | undefined, config: AIModelConfig) => Promise<Array<{
        topic: string;
        keywords: string[];
        relevance: number;
    }>>;
    hierarchicalTopicClustering: (documents: string[], levels: number, config: AIModelConfig) => Promise<{
        hierarchy: any;
        topics: TopicModelingResult;
    }>;
    trackTopicEvolution: (documents: Array<{
        date: Date;
        text: string;
    }>, config: TopicExtractionConfig, aiConfig: AIModelConfig) => Promise<Array<{
        date: Date;
        topics: TopicModelingResult;
    }>>;
    generateTopicVisualization: (topics: TopicModelingResult) => Record<string, any>;
    compareTopicsAcrossCollections: (collections: Map<string, string[]>, config: TopicExtractionConfig, aiConfig: AIModelConfig) => Promise<Map<string, TopicModelingResult>>;
    calculateDocumentSimilarity: (document1: string, document2: string, config: AIModelConfig) => Promise<SimilarityResult>;
    generateDocumentEmbedding: (documentText: string, config: AIModelConfig) => Promise<DocumentEmbedding>;
    semanticSearch: (query: string, documentEmbeddings: DocumentEmbedding[], topK?: number) => Promise<SemanticSearchResult>;
    findDuplicateDocuments: (documents: Array<{
        id: string;
        text: string;
    }>, threshold: number | undefined, config: AIModelConfig) => Promise<Array<{
        doc1: string;
        doc2: string;
        similarity: number;
    }>>;
    clusterSimilarDocuments: (documents: Array<{
        id: string;
        text: string;
    }>, numClusters: number, config: AIModelConfig) => Promise<Map<number, string[]>>;
    findSimilarDocuments: (documentId: string, documentText: string, candidates: Array<{
        id: string;
        text: string;
    }>, topK: number | undefined, config: AIModelConfig) => Promise<SimilarityResult[]>;
    summarizeDocument: (documentText: string, config: SummarizationConfig, aiConfig: AIModelConfig) => Promise<SummaryResult>;
    generateClinicalSummary: (clinicalText: string, config: AIModelConfig) => Promise<ClinicalSummary>;
    createPatientFriendlySummary: (medicalText: string, config: AIModelConfig) => Promise<SummaryResult>;
    extractKeyPoints: (documentText: string, numPoints: number | undefined, config: AIModelConfig) => Promise<string[]>;
    generateExecutiveSummary: (reportText: string, config: AIModelConfig) => Promise<{
        summary: string;
        highlights: string[];
        recommendations: string[];
    }>;
    summarizeMultipleDocuments: (documents: string[], config: SummarizationConfig, aiConfig: AIModelConfig) => Promise<SummaryResult>;
    detectPII: (documentText: string, config: AIModelConfig) => Promise<PIIDetectionResult>;
    redactPII: (documentText: string, piiResult: PIIDetectionResult, options?: RedactionOptions) => Promise<string>;
    detectPHI: (documentText: string, config: AIModelConfig) => Promise<PIIDetectionResult>;
    validateHIPAACompliance: (documentText: string, config: AIModelConfig) => Promise<{
        compliant: boolean;
        issues: string[];
        piiFound: PIIDetectionResult;
    }>;
    anonymizeDocument: (documentText: string, config: AIModelConfig) => Promise<{
        anonymizedText: string;
        replacementMap: Map<string, string>;
    }>;
    generateIntelligenceReport: (documentId: string, documentText: string, config: AIModelConfig) => Promise<IntelligenceAnalytics>;
};
export default _default;
//# sourceMappingURL=document-intelligence-kit.d.ts.map