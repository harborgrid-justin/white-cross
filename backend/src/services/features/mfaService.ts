import { logger } from '../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';

export interface MFASetup {
  userId: string;
  method: 'totp' | 'sms' | 'email';
  secret?: string;
  backupCodes: string[];
  enabled: boolean;
}

export class MFAService {
  static async setupMFA(userId: string, method: 'totp' | 'sms' | 'email'): Promise<MFASetup> {
    try {
      const secret = this.generateSecret();
      const backupCodes = this.generateBackupCodes();

      const setup: MFASetup = {
        userId,
        method,
        secret: method === 'totp' ? secret : undefined,
        backupCodes,
        enabled: false
      };

      logger.info('MFA setup initiated', { userId, method });
      return setup;
    } catch (error) {
      throw handleSequelizeError(error as Error);
    }
  }

  private static generateSecret(): string {
    // Generate cryptographically secure 32-character base32 secret for TOTP
    const crypto = require('crypto');
    const buffer = crypto.randomBytes(20);
    return this.base32Encode(buffer);
  }

  private static base32Encode(buffer: Buffer): string {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i];
      bits += 8;

      while (bits >= 5) {
        output += base32Chars[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      output += base32Chars[(value << (5 - bits)) & 31];
    }

    return output;
  }

  private static generateBackupCodes(): string[] {
    const crypto = require('crypto');
    return Array(10).fill(0).map(() => {
      const bytes = crypto.randomBytes(4);
      return bytes.toString('hex').toUpperCase().match(/.{1,4}/g).join('-');
    });
  }

  static async verifyMFACode(userId: string, code: string, secret: string, method: 'totp' | 'sms' | 'email' = 'totp'): Promise<boolean> {
    try {
      if (method === 'totp') {
        // Verify TOTP code using time-based algorithm
        const isValid = this.verifyTOTP(secret, code);
        logger.info('MFA TOTP code verification', { userId, isValid });
        return isValid;
      } else if (method === 'sms' || method === 'email') {
        // For SMS/Email, code would be stored in cache/database temporarily
        logger.info('MFA code verification for SMS/Email', { userId, method });
        // In production, verify against stored code with expiration
        return code.length === 6 && /^\d+$/.test(code);
      }
      return false;
    } catch (error) {
      logger.error('Error verifying MFA code', { error, userId });
      return false;
    }
  }

  private static verifyTOTP(secret: string, token: string, window: number = 1): boolean {
    const crypto = require('crypto');
    const timeStep = 30; // 30 second time step
    const currentTime = Math.floor(Date.now() / 1000 / timeStep);

    // Check current time window and adjacent windows for clock drift
    for (let i = -window; i <= window; i++) {
      const time = currentTime + i;
      const generatedToken = this.generateTOTP(secret, time);
      if (generatedToken === token) {
        return true;
      }
    }
    return false;
  }

  private static generateTOTP(secret: string, timeCounter: number): string {
    const crypto = require('crypto');
    const decodedSecret = this.base32Decode(secret);
    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeBigInt64BE(BigInt(timeCounter));

    const hmac = crypto.createHmac('sha1', decodedSecret);
    hmac.update(timeBuffer);
    const hash = hmac.digest();

    const offset = hash[hash.length - 1] & 0xf;
    const binary = ((hash[offset] & 0x7f) << 24) |
                   ((hash[offset + 1] & 0xff) << 16) |
                   ((hash[offset + 2] & 0xff) << 8) |
                   (hash[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
  }

  private static base32Decode(encoded: string): Buffer {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    const output: number[] = [];

    for (const char of encoded.toUpperCase()) {
      const index = base32Chars.indexOf(char);
      if (index === -1) continue;

      value = (value << 5) | index;
      bits += 5;

      if (bits >= 8) {
        output.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }

    return Buffer.from(output);
  }

  static async verifyBackupCode(userId: string, code: string, backupCodes: string[]): Promise<boolean> {
    const index = backupCodes.indexOf(code);
    if (index !== -1) {
      logger.info('MFA backup code used', { userId });
      // In production, remove used backup code from database
      return true;
    }
    return false;
  }

  static async disableMFA(userId: string): Promise<boolean> {
    logger.info('MFA disabled', { userId });
    // In production, update user record to disable MFA
    return true;
  }

  static generateQRCodeURL(userId: string, secret: string, issuer: string = 'WhiteCross'): string {
    const label = encodeURIComponent(`${issuer}:${userId}`);
    const params = new URLSearchParams({
      secret,
      issuer,
      algorithm: 'SHA1',
      digits: '6',
      period: '30'
    });
    return `otpauth://totp/${label}?${params.toString()}`;
  }
}
