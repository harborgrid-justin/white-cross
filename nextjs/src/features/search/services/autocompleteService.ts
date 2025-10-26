/**
 * Autocomplete Service
 *
 * Provides search suggestions and autocomplete functionality
 */

import {
  SearchSuggestion,
  SearchEntityType,
  SearchHistoryEntry,
} from '../types';

export class AutocompleteService {
  private suggestionCache: Map<string, SearchSuggestion[]> = new Map();
  private popularSearches: Map<string, number> = new Map();
  private recentSearches: SearchHistoryEntry[] = [];
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutes

  constructor(private maxSuggestions: number = 10) {}

  /**
   * Get autocomplete suggestions
   */
  async getSuggestions(
    query: string,
    entityType?: SearchEntityType,
    options: {
      includeRecent?: boolean;
      includePopular?: boolean;
      includePredictive?: boolean;
    } = {}
  ): Promise<SearchSuggestion[]> {
    const {
      includeRecent = true,
      includePopular = true,
      includePredictive = true,
    } = options;

    if (query.length === 0) {
      return this.getEmptyQuerySuggestions(includeRecent, includePopular);
    }

    // Check cache
    const cacheKey = `${query}-${entityType || 'all'}`;
    const cached = this.suggestionCache.get(cacheKey);
    if (cached) {
      return cached.slice(0, this.maxSuggestions);
    }

    const suggestions: SearchSuggestion[] = [];

    // Add recent searches
    if (includeRecent) {
      const recentSuggestions = this.getRecentSearchSuggestions(query, entityType);
      suggestions.push(...recentSuggestions);
    }

    // Add popular searches
    if (includePopular) {
      const popularSuggestions = this.getPopularSearchSuggestions(query, entityType);
      suggestions.push(...popularSuggestions);
    }

    // Add predictive suggestions
    if (includePredictive) {
      const predictiveSuggestions = this.getPredictiveSuggestions(query, entityType);
      suggestions.push(...predictiveSuggestions);
    }

    // Deduplicate and sort by score
    const uniqueSuggestions = this.deduplicateAndSort(suggestions);
    const topSuggestions = uniqueSuggestions.slice(0, this.maxSuggestions);

    // Cache results
    this.suggestionCache.set(cacheKey, topSuggestions);
    setTimeout(() => this.suggestionCache.delete(cacheKey), this.cacheTTL);

    return topSuggestions;
  }

  /**
   * Get suggestions when query is empty
   */
  private getEmptyQuerySuggestions(
    includeRecent: boolean,
    includePopular: boolean
  ): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];

    if (includeRecent && this.recentSearches.length > 0) {
      suggestions.push(
        ...this.recentSearches.slice(0, 5).map(entry => ({
          text: entry.query,
          score: 1.0,
          entityType: entry.entityType,
          metadata: {
            type: 'recent',
            timestamp: entry.timestamp,
          },
        }))
      );
    }

    if (includePopular) {
      const topPopular = Array.from(this.popularSearches.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([text, count]) => ({
          text,
          score: 0.8,
          metadata: {
            type: 'popular',
            count,
          },
        }));
      suggestions.push(...topPopular);
    }

    return suggestions.slice(0, this.maxSuggestions);
  }

  /**
   * Get recent search suggestions matching query
   */
  private getRecentSearchSuggestions(
    query: string,
    entityType?: SearchEntityType
  ): SearchSuggestion[] {
    const lowerQuery = query.toLowerCase();

    return this.recentSearches
      .filter(entry => {
        const matchesQuery = entry.query.toLowerCase().includes(lowerQuery);
        const matchesEntity = !entityType || entry.entityType === entityType;
        return matchesQuery && matchesEntity;
      })
      .slice(0, 3)
      .map(entry => ({
        text: entry.query,
        score: 0.9,
        entityType: entry.entityType,
        metadata: {
          type: 'recent',
          timestamp: entry.timestamp,
        },
      }));
  }

  /**
   * Get popular search suggestions matching query
   */
  private getPopularSearchSuggestions(
    query: string,
    entityType?: SearchEntityType
  ): SearchSuggestion[] {
    const lowerQuery = query.toLowerCase();

    return Array.from(this.popularSearches.entries())
      .filter(([text]) => text.toLowerCase().includes(lowerQuery))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([text, count]) => ({
        text,
        score: 0.7,
        entityType,
        metadata: {
          type: 'popular',
          count,
        },
      }));
  }

  /**
   * Get predictive suggestions based on query
   */
  private getPredictiveSuggestions(
    query: string,
    entityType?: SearchEntityType
  ): SearchSuggestion[] {
    // Simple word completion
    const words = query.split(' ');
    const lastWord = words[words.length - 1].toLowerCase();

    const predictions: SearchSuggestion[] = [];

    // Common medical terms for healthcare context
    const commonTerms = this.getCommonTermsForEntity(entityType);

    commonTerms.forEach(term => {
      if (term.toLowerCase().startsWith(lastWord) && term.toLowerCase() !== lastWord) {
        const completedQuery = [...words.slice(0, -1), term].join(' ');
        predictions.push({
          text: completedQuery,
          score: 0.6,
          entityType,
          metadata: {
            type: 'predictive',
          },
        });
      }
    });

    return predictions.slice(0, 3);
  }

  /**
   * Get common terms for entity type
   */
  private getCommonTermsForEntity(entityType?: SearchEntityType): string[] {
    const commonTerms: Record<SearchEntityType, string[]> = {
      [SearchEntityType.STUDENT]: [
        'active', 'inactive', 'grade', 'allergies', 'medications', 'emergency',
        'contact', 'immunization', 'physical', 'exam', 'enrollment',
      ],
      [SearchEntityType.MEDICATION]: [
        'prescription', 'dosage', 'frequency', 'expiration', 'refill',
        'controlled', 'authorization', 'administration', 'active', 'discontinued',
      ],
      [SearchEntityType.HEALTH_RECORD]: [
        'diagnosis', 'treatment', 'visit', 'examination', 'vitals',
        'symptoms', 'notes', 'follow-up', 'referral', 'screening',
      ],
      [SearchEntityType.DOCUMENT]: [
        'consent', 'form', 'report', 'record', 'signed', 'pending',
        'uploaded', 'attachment', 'medical', 'administrative',
      ],
      [SearchEntityType.APPOINTMENT]: [
        'scheduled', 'completed', 'cancelled', 'checkup', 'follow-up',
        'screening', 'today', 'upcoming', 'past', 'missed',
      ],
      [SearchEntityType.INCIDENT]: [
        'injury', 'illness', 'emergency', 'reported', 'investigated',
        'resolved', 'closed', 'severity', 'witness', 'action',
      ],
      [SearchEntityType.EMERGENCY_CONTACT]: [
        'parent', 'guardian', 'primary', 'secondary', 'phone',
        'relationship', 'authorized', 'pickup', 'emergency',
      ],
      [SearchEntityType.INVENTORY_ITEM]: [
        'supplies', 'medication', 'equipment', 'stock', 'reorder',
        'expired', 'low', 'quantity', 'vendor', 'purchase',
      ],
      [SearchEntityType.USER]: [
        'nurse', 'admin', 'staff', 'active', 'role', 'permissions',
      ],
      [SearchEntityType.ALL]: [],
    };

    if (entityType && commonTerms[entityType]) {
      return commonTerms[entityType];
    }

    // Return all terms if no entity type specified
    return Object.values(commonTerms).flat();
  }

  /**
   * Deduplicate and sort suggestions
   */
  private deduplicateAndSort(suggestions: SearchSuggestion[]): SearchSuggestion[] {
    const seen = new Set<string>();
    const unique: SearchSuggestion[] = [];

    suggestions.forEach(suggestion => {
      const key = suggestion.text.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(suggestion);
      }
    });

    return unique.sort((a, b) => b.score - a.score);
  }

  /**
   * Add to search history
   */
  addToHistory(entry: SearchHistoryEntry): void {
    // Remove duplicates
    this.recentSearches = this.recentSearches.filter(e => e.query !== entry.query);

    // Add to beginning
    this.recentSearches.unshift(entry);

    // Limit size
    if (this.recentSearches.length > 50) {
      this.recentSearches = this.recentSearches.slice(0, 50);
    }

    // Update popular searches
    const currentCount = this.popularSearches.get(entry.query) || 0;
    this.popularSearches.set(entry.query, currentCount + 1);
  }

  /**
   * Clear search history
   */
  clearHistory(): void {
    this.recentSearches = [];
  }

  /**
   * Clear suggestion cache
   */
  clearCache(): void {
    this.suggestionCache.clear();
  }

  /**
   * Get search history
   */
  getHistory(limit?: number): SearchHistoryEntry[] {
    return limit ? this.recentSearches.slice(0, limit) : this.recentSearches;
  }

  /**
   * Load history from storage
   */
  loadHistory(entries: SearchHistoryEntry[]): void {
    this.recentSearches = entries;

    // Rebuild popular searches
    this.popularSearches.clear();
    entries.forEach(entry => {
      const count = this.popularSearches.get(entry.query) || 0;
      this.popularSearches.set(entry.query, count + 1);
    });
  }
}

// ==================== Phonetic Search ====================

/**
 * Soundex algorithm for phonetic search
 */
export class PhoneticSearch {
  /**
   * Convert word to Soundex code
   */
  static soundex(word: string): string {
    if (!word) return '';

    word = word.toUpperCase();
    const firstLetter = word[0];

    // Replace letters with digits
    let code = word
      .slice(1)
      .replace(/[BFPV]/g, '1')
      .replace(/[CGJKQSXZ]/g, '2')
      .replace(/[DT]/g, '3')
      .replace(/[L]/g, '4')
      .replace(/[MN]/g, '5')
      .replace(/[R]/g, '6')
      .replace(/[AEIOUHWY]/g, '0');

    // Remove duplicates
    code = code.replace(/(.)\1+/g, '$1');

    // Remove zeros
    code = code.replace(/0/g, '');

    // Pad or trim to 3 digits
    code = (code + '000').slice(0, 3);

    return firstLetter + code;
  }

  /**
   * Check if two words are phonetically similar
   */
  static areSimilar(word1: string, word2: string): boolean {
    return this.soundex(word1) === this.soundex(word2);
  }

  /**
   * Find phonetically similar words from a list
   */
  static findSimilar(word: string, wordList: string[]): string[] {
    const targetCode = this.soundex(word);
    return wordList.filter(w => this.soundex(w) === targetCode);
  }
}
