import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import * as speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import * as crypto from 'crypto';
import { User   } from "../../database/models";
import { MfaSetupResponseDto, MfaStatusDto } from '../dto/mfa.dto';

import { BaseService } from '@/common/base';
@Injectable()
export class MfaService extends BaseService {
  private readonly appName = 'White Cross Healthcare';

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Initialize MFA setup for a user
   * Generates a new TOTP secret and QR code
   */
  async setupMfa(userId: string): Promise<MfaSetupResponseDto> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.mfaEnabled) {
      throw new BadRequestException('MFA is already enabled for this user');
    }

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `${this.appName} (${user.email})`,
      issuer: this.appName,
      length: 32,
    });

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Generate backup codes
    const backupCodes = this.generateBackupCodes(10);
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => this.hashBackupCode(code)),
    );

    // Store the secret and backup codes (not enabled yet)
    user.mfaSecret = secret.base32;
    user.mfaBackupCodes = JSON.stringify(hashedBackupCodes);
    await user.save();

    this.logInfo(`MFA setup initiated for user: ${user.email}`);

    // Format manual entry key with spaces for readability
    const manualEntryKey =
      secret.base32.match(/.{1,4}/g)?.join(' ') || secret.base32;

    return {
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      backupCodes,
      manualEntryKey,
    };
  }

  /**
   * Verify TOTP code and enable MFA
   */
  async enableMfa(
    userId: string,
    code: string,
    secret: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.mfaEnabled) {
      throw new BadRequestException('MFA is already enabled');
    }

    // Verify the secret matches what we stored during setup
    if (user.mfaSecret !== secret) {
      throw new BadRequestException('Invalid MFA setup session');
    }

    // Verify the TOTP code
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code,
      window: 2, // Allow 2 steps before/after for clock skew
    });

    if (!verified) {
      throw new UnauthorizedException('Invalid verification code');
    }

    // Enable MFA
    user.mfaEnabled = true;
    user.mfaEnabledAt = new Date();
    await user.save();

    this.logInfo(`MFA enabled successfully for user: ${user.email}`);

    return {
      success: true,
      message: 'Multi-factor authentication has been enabled successfully',
    };
  }

  /**
   * Verify TOTP code or backup code
   */
  async verifyMfa(
    userId: string,
    code: string,
    isBackupCode: boolean = false,
  ): Promise<boolean> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.mfaEnabled || !user.mfaSecret) {
      throw new BadRequestException('MFA is not enabled for this user');
    }

    if (isBackupCode) {
      return this.verifyBackupCode(user, code);
    }

    // Verify TOTP code
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!verified) {
      this.logWarning(
        `Failed MFA verification attempt for user: ${user.email}`,
      );
      throw new UnauthorizedException('Invalid verification code');
    }

    this.logInfo(`Successful MFA verification for user: ${user.email}`);
    return true;
  }

  /**
   * Disable MFA for a user
   */
  async disableMfa(
    userId: string,
    password: string,
    code?: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.mfaEnabled) {
      throw new BadRequestException('MFA is not enabled for this user');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // If code provided, verify it
    if (code) {
      await this.verifyMfa(userId, code);
    }

    // Disable MFA
    user.mfaEnabled = false;
    user.mfaSecret = null;
    user.mfaBackupCodes = null;
    user.mfaEnabledAt = null;
    await user.save();

    this.logInfo(`MFA disabled for user: ${user.email}`);

    return {
      success: true,
      message: 'Multi-factor authentication has been disabled',
    };
  }

  /**
   * Get MFA status for a user
   */
  async getMfaStatus(userId: string): Promise<MfaStatusDto> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    let backupCodesRemaining = 0;
    if (user.mfaBackupCodes) {
      try {
        const codes = JSON.parse(user.mfaBackupCodes);
        backupCodesRemaining = Array.isArray(codes) ? codes.length : 0;
      } catch (error) {
        this.logError(
          `Failed to parse backup codes for user ${user.email}:`,
          error,
        );
      }
    }

    return {
      enabled: user.mfaEnabled || false,
      hasBackupCodes: backupCodesRemaining > 0,
      backupCodesRemaining,
      enabledAt: user.mfaEnabledAt || undefined,
    };
  }

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(
    userId: string,
    password: string,
    code: string,
  ): Promise<{ backupCodes: string[] }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.mfaEnabled) {
      throw new BadRequestException('MFA is not enabled for this user');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Verify TOTP code
    await this.verifyMfa(userId, code);

    // Generate new backup codes
    const backupCodes = this.generateBackupCodes(10);
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => this.hashBackupCode(code)),
    );

    // Store new backup codes
    user.mfaBackupCodes = JSON.stringify(hashedBackupCodes);
    await user.save();

    this.logInfo(`Backup codes regenerated for user: ${user.email}`);

    return { backupCodes };
  }

  /**
   * Verify backup code and remove it after use
   */
  private async verifyBackupCode(user: User, code: string): Promise<boolean> {
    if (!user.mfaBackupCodes) {
      throw new UnauthorizedException('No backup codes available');
    }

    let backupCodes: string[];
    try {
      backupCodes = JSON.parse(user.mfaBackupCodes);
    } catch (error) {
      throw new BadRequestException('Invalid backup codes data');
    }

    // Hash the provided code
    const hashedCode = await this.hashBackupCode(code);

    // Find and remove the matching code
    const codeIndex = backupCodes.findIndex((bc) => bc === hashedCode);

    if (codeIndex === -1) {
      this.logWarning(
        `Failed backup code verification for user: ${user.email}`,
      );
      throw new UnauthorizedException('Invalid backup code');
    }

    // Remove the used backup code
    backupCodes.splice(codeIndex, 1);
    user.mfaBackupCodes = JSON.stringify(backupCodes);
    await user.save();

    this.logInfo(
      `Backup code used successfully for user: ${user.email}. Remaining: ${backupCodes.length}`,
    );

    return true;
  }

  /**
   * Generate random backup codes
   */
  private generateBackupCodes(count: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-digit numeric code
      const code = crypto.randomInt(10000000, 99999999).toString();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Hash backup code using SHA-256
   */
  private async hashBackupCode(code: string): Promise<string> {
    return crypto.createHash('sha256').update(code).digest('hex');
  }
}
