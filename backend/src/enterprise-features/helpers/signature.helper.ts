/**
 * Signature Helper
 * Cryptographic signature operations for consent forms
 */

import * as crypto from 'crypto';

export class SignatureHelper {
  /**
   * Create signature hash
   */
  static createSignatureHash(signature: string): string {
    return crypto.createHash('sha256').update(signature).digest('hex');
  }

  /**
   * Create signature data object
   */
  static createSignatureData(
    formId: string,
    signedBy: string,
    signature: string,
    ipAddress?: string,
    userAgent?: string,
  ): {
    formId: string;
    signedBy: string;
    signatureHash: string;
    signedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    verified: boolean;
  } {
    const signatureHash = SignatureHelper.createSignatureHash(signature);

    return {
      formId,
      signedBy,
      signatureHash,
      signedAt: new Date(),
      ipAddress,
      userAgent,
      verified: true,
    };
  }

  /**
   * Verify signature against stored hash
   * In production, this would compare with database record
   */
  static verifySignatureHash(signature: string, storedHash?: string): boolean {
    if (!storedHash) {
      return false;
    }

    const computedHash = SignatureHelper.createSignatureHash(signature);
    return computedHash === storedHash;
  }

  /**
   * Generate unique form ID
   */
  static generateFormId(): string {
    return `CF-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }
}
