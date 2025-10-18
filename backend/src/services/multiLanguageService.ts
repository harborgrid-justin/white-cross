import { logger } from '../utils/logger';

/**
 * Multi-Language Support Service
 * Provides translation and localization for student profiles
 */

export interface Translation {
  language: string;
  text: string;
}

export interface MultiLanguageProfile {
  studentId: string;
  primaryLanguage: string;
  secondaryLanguages: string[];
  translations: {
    [field: string]: Translation[];
  };
}

const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'zh', 'ar', 'hi', 'pt', 'ru', 'ja', 'ko'
];

export class MultiLanguageService {
  /**
   * Translate text to specified language
   */
  static async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      // In production, integrate with Google Translate API or AWS Translate
      logger.info('Translating text', { targetLanguage, textLength: text.length });
      
      // Placeholder translation
      return `[${targetLanguage.toUpperCase()}] ${text}`;
    } catch (error) {
      logger.error('Translation error', { error });
      throw error;
    }
  }

  /**
   * Create multi-language profile
   */
  static async createMultiLanguageProfile(
    studentId: string,
    primaryLanguage: string,
    fields: { [key: string]: string }
  ): Promise<MultiLanguageProfile> {
    try {
      const translations: { [field: string]: Translation[] } = {};

      for (const [field, value] of Object.entries(fields)) {
        translations[field] = [
          { language: primaryLanguage, text: value }
        ];
      }

      const profile: MultiLanguageProfile = {
        studentId,
        primaryLanguage,
        secondaryLanguages: [],
        translations,
      };

      logger.info('Multi-language profile created', { studentId, primaryLanguage });
      return profile;
    } catch (error) {
      logger.error('Error creating multi-language profile', { error });
      throw error;
    }
  }

  /**
   * Batch translate profile fields
   */
  static async batchTranslateProfile(
    profile: MultiLanguageProfile,
    targetLanguages: string[]
  ): Promise<MultiLanguageProfile> {
    try {
      for (const [field, translations] of Object.entries(profile.translations)) {
        const sourceTranslation = translations.find(t => t.language === profile.primaryLanguage);
        if (!sourceTranslation) continue;

        for (const targetLang of targetLanguages) {
          if (!translations.find(t => t.language === targetLang)) {
            const translatedText = await this.translateText(sourceTranslation.text, targetLang);
            translations.push({ language: targetLang, text: translatedText });
          }
        }
      }

      profile.secondaryLanguages = targetLanguages;
      logger.info('Profile batch translated', { studentId: profile.studentId, languages: targetLanguages });
      return profile;
    } catch (error) {
      logger.error('Error in batch translation', { error });
      throw error;
    }
  }

  static getSupportedLanguages(): string[] {
    return SUPPORTED_LANGUAGES;
  }
}
