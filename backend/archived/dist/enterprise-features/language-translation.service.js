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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageTranslationService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const base_1 = require("../common/base");
let LanguageTranslationService = class LanguageTranslationService extends base_1.BaseService {
    eventEmitter;
    constructor(eventEmitter) {
        super('LanguageTranslationService');
        this.eventEmitter = eventEmitter;
    }
    async translateMessage(text, targetLanguage) {
        try {
            if (!text || typeof text !== 'string') {
                throw new Error('Invalid text provided for translation');
            }
            if (!targetLanguage || typeof targetLanguage !== 'string') {
                throw new Error('Invalid target language provided');
            }
            const sourceLanguage = this.detectLanguage(text);
            const translatedText = await this.performTranslation(text, sourceLanguage, targetLanguage);
            const result = {
                originalText: text,
                translatedText,
                sourceLanguage,
                targetLanguage,
                confidence: 0.95,
                translatedAt: new Date(),
            };
            this.eventEmitter.emit('translation.performed', {
                result,
                timestamp: new Date(),
                service: 'LanguageTranslationService',
            });
            this.logInfo('Message translated successfully', {
                targetLanguage,
                textLength: text.length,
                sourceLanguage,
            });
            return translatedText;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logError('Translation error', {
                error: errorMessage,
                targetLanguage,
                textLength: text?.length,
            });
            throw error;
        }
    }
    detectLanguage(text) {
        try {
            if (!text || typeof text !== 'string') {
                throw new Error('Invalid text provided for language detection');
            }
            const detectedLanguage = this.performLanguageDetection(text);
            this.logInfo('Language detected', {
                detectedLanguage,
                textLength: text.length,
            });
            return detectedLanguage;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logError('Language detection error', {
                error: errorMessage,
                textLength: text?.length,
            });
            throw error;
        }
    }
    async translateBulkMessages(messages, targetLanguage) {
        try {
            if (!Array.isArray(messages)) {
                throw new Error('Messages must be provided as an array');
            }
            if (!targetLanguage || typeof targetLanguage !== 'string') {
                throw new Error('Invalid target language provided');
            }
            const validMessages = messages.filter((msg) => msg && typeof msg === 'string');
            if (validMessages.length === 0) {
                this.logWarning('No valid messages provided for bulk translation');
                return [];
            }
            const batchSize = 10;
            const translatedMessages = [];
            for (let i = 0; i < validMessages.length; i += batchSize) {
                const batch = validMessages.slice(i, i + batchSize);
                const batchTranslations = await Promise.all(batch.map((message) => this.translateMessage(message, targetLanguage)));
                translatedMessages.push(...batchTranslations);
            }
            this.eventEmitter.emit('translation.bulk_completed', {
                messageCount: validMessages.length,
                targetLanguage,
                timestamp: new Date(),
                service: 'LanguageTranslationService',
            });
            this.logInfo('Bulk messages translated successfully', {
                messageCount: validMessages.length,
                targetLanguage,
                batchCount: Math.ceil(validMessages.length / batchSize),
            });
            return translatedMessages;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logError('Bulk translation error', {
                error: errorMessage,
                targetLanguage,
                messageCount: messages?.length,
            });
            throw error;
        }
    }
    async performTranslation(text, sourceLanguage, targetLanguage) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return `[${targetLanguage.toUpperCase()}] ${text}`;
    }
    performLanguageDetection(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('hola') || lowerText.includes('gracias')) {
            return 'es';
        }
        if (lowerText.includes('bonjour') || lowerText.includes('merci')) {
            return 'fr';
        }
        if (lowerText.includes('hallo') || lowerText.includes('danke')) {
            return 'de';
        }
        return 'en';
    }
    getSupportedLanguages() {
        return [
            'en',
            'es',
            'fr',
            'de',
            'it',
            'pt',
            'zh',
            'ja',
            'ko',
            'ar',
            'hi',
            'ru',
        ];
    }
    isLanguageSupported(languageCode) {
        return this.getSupportedLanguages().includes(languageCode.toLowerCase());
    }
};
exports.LanguageTranslationService = LanguageTranslationService;
exports.LanguageTranslationService = LanguageTranslationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], LanguageTranslationService);
//# sourceMappingURL=language-translation.service.js.map