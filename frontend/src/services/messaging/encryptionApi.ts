/**
 * Encryption API Service
 *
 * API client for end-to-end encryption key exchange
 */

import { ApiClient } from '../core/ApiClient';
import { apiClient } from '../core';
import type { EncryptionKeyDto } from './types';

export class EncryptionApi {
  private client: ApiClient;
  private baseEndpoint = '/api/v1/messaging/encryption';

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Get public key for conversation
   */
  async getPublicKey(conversationId: string): Promise<EncryptionKeyDto> {
    const response = await this.client.get<{ success: boolean; data: EncryptionKeyDto }>(
      `${this.baseEndpoint}/keys/${conversationId}`
    );
    return response.data.data;
  }

  /**
   * Upload public key for conversation
   */
  async uploadPublicKey(key: EncryptionKeyDto): Promise<void> {
    await this.client.post(`${this.baseEndpoint}/keys`, key);
  }

  /**
   * Rotate encryption keys for conversation
   */
  async rotateKeys(conversationId: string): Promise<EncryptionKeyDto> {
    const response = await this.client.post<{ success: boolean; data: EncryptionKeyDto }>(
      `${this.baseEndpoint}/keys/${conversationId}/rotate`,
      {}
    );
    return response.data.data;
  }

  /**
   * Get encryption status for conversation
   */
  async getEncryptionStatus(conversationId: string): Promise<{
    enabled: boolean;
    algorithm: string;
    keyId: string;
  }> {
    const response = await this.client.get<{
      success: boolean;
      data: { enabled: boolean; algorithm: string; keyId: string };
    }>(`${this.baseEndpoint}/status/${conversationId}`);
    return response.data.data;
  }

  /**
   * Enable encryption for conversation
   */
  async enableEncryption(conversationId: string): Promise<void> {
    await this.client.post(`${this.baseEndpoint}/enable/${conversationId}`, {});
  }

  /**
   * Disable encryption for conversation
   */
  async disableEncryption(conversationId: string): Promise<void> {
    await this.client.post(`${this.baseEndpoint}/disable/${conversationId}`, {});
  }
}

// Export singleton instance
export const encryptionApi = new EncryptionApi(apiClient);
