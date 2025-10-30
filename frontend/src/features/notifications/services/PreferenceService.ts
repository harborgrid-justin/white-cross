import {
  NotificationPreferences,
  UpdatePreferencesInput,
  UpdatePreferencesSchema,
  createDefaultPreferences,
} from '../types/preferences';

/**
 * PreferenceService
 *
 * Manages user notification preferences
 */
export class PreferenceService {
  private baseUrl: string;
  private cache: Map<string, NotificationPreferences> = new Map();

  constructor(baseUrl: string = '/notifications/preferences') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get preferences for a user
   */
  async getPreferences(userId: string): Promise<NotificationPreferences> {
    // Check cache first
    if (this.cache.has(userId)) {
      return this.cache.get(userId)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}?userId=${userId}`);

      if (response.status === 404) {
        // No preferences found, create defaults
        const defaults = createDefaultPreferences(userId);
        await this.createPreferences(defaults);
        return defaults;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch preferences: ${response.statusText}`);
      }

      const preferences = await response.json();

      // Convert date strings to Date objects
      preferences.createdAt = new Date(preferences.createdAt);
      preferences.updatedAt = new Date(preferences.updatedAt);

      // Cache the preferences
      this.cache.set(userId, preferences);

      return preferences;
    } catch (error) {
      console.error('Failed to fetch preferences, using defaults:', error);
      return createDefaultPreferences(userId);
    }
  }

  /**
   * Create new preferences
   */
  async createPreferences(
    preferences: NotificationPreferences
  ): Promise<NotificationPreferences> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error(`Failed to create preferences: ${response.statusText}`);
    }

    const created = await response.json();

    // Update cache
    this.cache.set(preferences.userId, created);

    return created;
  }

  /**
   * Update preferences
   */
  async updatePreferences(
    userId: string,
    input: UpdatePreferencesInput
  ): Promise<NotificationPreferences> {
    // Validate input
    const validated = UpdatePreferencesSchema.parse(input);

    const response = await fetch(`${this.baseUrl}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    });

    if (!response.ok) {
      throw new Error(`Failed to update preferences: ${response.statusText}`);
    }

    const updated = await response.json();

    // Update cache
    this.cache.set(userId, updated);

    return updated;
  }

  /**
   * Reset preferences to defaults
   */
  async resetToDefaults(userId: string): Promise<NotificationPreferences> {
    const defaults = createDefaultPreferences(userId);
    return this.updatePreferences(userId, defaults);
  }

  /**
   * Clear cache
   */
  clearCache(userId?: string): void {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Test notification delivery (for settings UI)
   */
  async sendTestNotification(
    userId: string,
    channel: string
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, channel }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send test notification: ${response.statusText}`);
    }
  }
}

// Singleton instance
export const preferenceService = new PreferenceService();
