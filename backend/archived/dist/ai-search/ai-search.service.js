"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiSearchService = exports.VectorSearchException = exports.EmbeddingGenerationException = exports.AISearchException = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
const base_1 = require("../common/base");
class AISearchException extends common_1.HttpException {
    constructor(message, status = common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message, status);
    }
}
exports.AISearchException = AISearchException;
class EmbeddingGenerationException extends AISearchException {
    constructor(message) {
        super(`Embedding generation failed: ${message}`, common_1.HttpStatus.SERVICE_UNAVAILABLE);
    }
}
exports.EmbeddingGenerationException = EmbeddingGenerationException;
class VectorSearchException extends AISearchException {
    constructor(message) {
        super(`Vector search failed: ${message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.VectorSearchException = VectorSearchException;
let AiSearchService = class AiSearchService extends base_1.BaseService {
    configService;
    openai = null;
    embeddingCache = new Map();
    CACHE_MAX_SIZE = 1000;
    EMBEDDING_DIMENSION = 1536;
    searchIndex = new Map();
    constructor(configService) {
        super("AiSearchService");
        this.configService = configService;
        this.initializeOpenAI();
    }
    initializeOpenAI() {
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (!apiKey) {
            this.logWarning('OpenAI API key not configured - using mock embeddings');
            return;
        }
        try {
            this.openai = new openai_1.default({ apiKey });
            this.logInfo('OpenAI client initialized successfully');
        }
        catch (error) {
            this.logError('Failed to initialize OpenAI client', error);
        }
    }
    async generateEmbedding(text) {
        if (!text || text.trim().length === 0) {
            throw new EmbeddingGenerationException('Text cannot be empty');
        }
        const cacheKey = this.hashText(text);
        const cached = this.embeddingCache.get(cacheKey);
        if (cached) {
            this.logDebug(`Cache hit for embedding: ${cacheKey}`);
            return cached;
        }
        try {
            if (!this.openai) {
                return this.generateMockEmbedding(text);
            }
            const model = this.configService.get('OPENAI_EMBEDDING_MODEL', 'text-embedding-3-small');
            const response = await this.openai.embeddings.create({
                model,
                input: text.substring(0, 8000),
            });
            const embedding = response.data[0].embedding;
            this.cacheEmbedding(cacheKey, embedding);
            this.logDebug(`Generated embedding for text (length: ${text.length})`);
            return embedding;
        }
        catch (error) {
            this.logError('OpenAI embedding generation failed', error);
            if (error.code === 'insufficient_quota' || error.status === 429) {
                this.logWarning('OpenAI quota exceeded - using mock embedding');
                return this.generateMockEmbedding(text);
            }
            throw new EmbeddingGenerationException(error.message || 'Unknown error');
        }
    }
    async indexContent(contentType, contentId, content) {
        try {
            const embedding = await this.generateEmbedding(content);
            const indexKey = `${contentType}:${contentId}`;
            this.searchIndex.set(indexKey, {
                embedding,
                metadata: {
                    contentType,
                    contentId,
                    content,
                    indexedAt: new Date(),
                },
            });
            this.logInfo(`Indexed content: ${indexKey}`);
        }
        catch (error) {
            this.logError(`Failed to index content ${contentType}:${contentId}`, error);
            throw new AISearchException(`Indexing failed: ${error.message}`);
        }
    }
    async search(query, filters) {
        const startTime = Date.now();
        try {
            const queryEmbedding = await this.generateEmbedding(query);
            const results = [];
            for (const [key, value] of this.searchIndex.entries()) {
                const [contentType, contentId] = key.split(':');
                if (filters?.dataTypes && !filters.dataTypes.includes(contentType)) {
                    continue;
                }
                const similarity = this.cosineSimilarity(queryEmbedding, value.embedding);
                const threshold = filters?.threshold || 0.7;
                if (similarity < threshold) {
                    continue;
                }
                results.push({
                    id: contentId,
                    type: contentType,
                    title: this.extractTitle(value.metadata.content),
                    content: value.metadata.content,
                    similarity,
                    metadata: value.metadata,
                    relevantFields: this.extractRelevantFields(value.metadata.content, query),
                });
            }
            results.sort((a, b) => b.similarity - a.similarity);
            const limit = filters?.limit || 10;
            const limitedResults = results.slice(0, limit);
            const processingTime = Date.now() - startTime;
            this.logInfo(`Search completed in ${processingTime}ms, found ${limitedResults.length} results`);
            return limitedResults;
        }
        catch (error) {
            this.logError('Search failed', error);
            throw new VectorSearchException(error.message);
        }
    }
    async reindexAll() {
        this.logInfo('Starting full reindex...');
        const indexSize = this.searchIndex.size;
        this.searchIndex.clear();
        this.logInfo(`Reindex complete - cleared ${indexSize} entries`);
    }
    async deleteFromIndex(contentType, contentId) {
        const indexKey = `${contentType}:${contentId}`;
        if (this.searchIndex.has(indexKey)) {
            this.searchIndex.delete(indexKey);
            this.logInfo(`Deleted from index: ${indexKey}`);
        }
        else {
            this.logWarning(`Content not found in index: ${indexKey}`);
        }
    }
    async semanticSearch(params) {
        const results = await this.search(params.query, {
            ...params.filters,
            limit: params.limit,
            threshold: params.threshold,
        });
        const suggestions = await this.getSearchSuggestions(params.query, params.userId);
        return {
            results,
            total: results.length,
            processingTime: 0,
            suggestions,
        };
    }
    async getSearchSuggestions(partial, userId) {
        this.logInfo(`Getting search suggestions for: ${partial}`);
        const suggestions = [];
        const medicalTerms = [
            'allergies',
            'asthma',
            'diabetes',
            'immunization',
            'vaccination',
            'medication',
            'chronic condition',
            'vital signs',
            'health screening',
            'nurse visit',
        ];
        const matching = medicalTerms.filter((term) => term.toLowerCase().includes(partial.toLowerCase()));
        suggestions.push(...matching.slice(0, 5));
        return suggestions;
    }
    async advancedPatientSearch(criteria, userId) {
        this.logInfo('Advanced patient search', { criteria });
        return {
            patients: [],
            total: 0,
            criteria,
            message: 'Advanced search requires database integration',
        };
    }
    async findSimilarCases(params) {
        this.logInfo('Finding similar cases', { params });
        return [];
    }
    async medicationSearch(params) {
        this.logInfo('Medication search', { searchType: params.searchType });
        try {
            switch (params.searchType) {
                case 'interactions':
                    return await this.findMedicationInteractions(params.medications);
                case 'alternatives':
                    return await this.findMedicationAlternatives(params.medications);
                case 'side_effects':
                    return await this.findMedicationSideEffects(params.medications);
                case 'contraindications':
                    return await this.findMedicationContraindications(params.medications, params.patientId);
                default:
                    throw new AISearchException('Invalid medication search type', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            this.logError('Medication search error', error);
            throw new AISearchException(error.message || 'Medication search failed');
        }
    }
    async getSearchAnalytics(period = 'week', limit = 10) {
        this.logInfo(`Getting search analytics for period: ${period}`);
        return {
            topQueries: [],
            trends: [],
            avgResponseTime: 0,
            period,
        };
    }
    async findMedicationInteractions(medications) {
        this.logInfo(`Finding interactions for ${medications.length} medications`);
        return {
            interactions: [],
            riskLevel: 'LOW',
            message: 'Medication interactions require database integration',
        };
    }
    async findMedicationAlternatives(medications) {
        this.logInfo(`Finding alternatives for ${medications.length} medications`);
        return {
            alternatives: [],
            message: 'Medication alternatives require database integration',
        };
    }
    async findMedicationSideEffects(medications) {
        this.logInfo(`Finding side effects for ${medications.length} medications`);
        return {
            sideEffects: [],
            message: 'Medication side effects require database integration',
        };
    }
    async findMedicationContraindications(medications, patientId) {
        this.logInfo(`Finding contraindications for ${medications.length} medications`);
        return {
            contraindications: [],
            patientSpecific: !!patientId,
            message: 'Medication contraindications require database integration',
        };
    }
    calculateInteractionRisk(interactions) {
        if (!interactions || interactions.length === 0)
            return 'LOW';
        if (interactions.some((i) => i.severity === 'MAJOR'))
            return 'HIGH';
        if (interactions.some((i) => i.severity === 'MODERATE'))
            return 'MEDIUM';
        return 'LOW';
    }
    cosineSimilarity(a, b) {
        if (a.length !== b.length) {
            return this.handleError('Operation failed', new Error('Vectors must have the same length'));
        }
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);
        if (normA === 0 || normB === 0) {
            return 0;
        }
        return dotProduct / (normA * normB);
    }
    generateMockEmbedding(text) {
        const hash = this.hashText(text);
        const seed = parseInt(hash.substring(0, 8), 16);
        const embedding = [];
        let currentSeed = seed;
        for (let i = 0; i < this.EMBEDDING_DIMENSION; i++) {
            currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
            embedding.push((currentSeed / 0x7fffffff) * 2 - 1);
        }
        return embedding;
    }
    hashText(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
    cacheEmbedding(key, embedding) {
        if (this.embeddingCache.size >= this.CACHE_MAX_SIZE) {
            const firstKey = this.embeddingCache.keys().next().value;
            this.embeddingCache.delete(firstKey);
        }
        this.embeddingCache.set(key, embedding);
    }
    extractTitle(content) {
        return content.substring(0, 100) + (content.length > 100 ? '...' : '');
    }
    extractRelevantFields(content, query) {
        const queryTerms = query.toLowerCase().split(/\s+/);
        const contentWords = content.toLowerCase().split(/\s+/);
        const relevant = contentWords.filter((word) => queryTerms.some((term) => word.includes(term) || term.includes(word)));
        return [...new Set(relevant)].slice(0, 10);
    }
};
exports.AiSearchService = AiSearchService;
exports.AiSearchService = AiSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiSearchService);
//# sourceMappingURL=ai-search.service.js.map