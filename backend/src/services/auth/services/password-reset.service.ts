import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { User   } from '@/database/models';

import { BaseService } from '@/common/base';
interface PasswordResetToken {
  token: string;
  userId: string;
  expiresAt: Date;
}

@Injectable()
export class PasswordResetService extends BaseService {
  // In-memory store for password reset tokens
  // In production, use Redis or database table
  private resetTokens: Map<string, PasswordResetToken> = new Map();
  private readonly tokenExpiryMinutes = 60; // 1 hour

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
  ) {
    super("PasswordResetService");
    // Clean up expired tokens every 15 minutes
    setInterval(() => this.cleanupExpiredTokens(), 15 * 60 * 1000);
  }

  /**
   * Initiate password reset - generates token and sends email
   */
  async initiatePasswordReset(
    email: string,
  ): Promise<{ message: string; success: boolean }> {
    const user = await this.userModel.findOne({ where: { email } });

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      this.logWarning(
        `Password reset requested for non-existent email: ${email}`,
      );
      return {
        success: true,
        message:
          'If an account exists with this email, a password reset link has been sent.',
      };
    }

    // Generate secure random token
    const token = this.generateResetToken();
    const expiresAt = new Date(
      Date.now() + this.tokenExpiryMinutes * 60 * 1000,
    );

    // Store token
    this.resetTokens.set(token, {
      token,
      userId: user.id,
      expiresAt,
    });

    // Send email with reset link
    await this.sendPasswordResetEmail(user.email, token);

    this.logInfo(`Password reset initiated for user: ${user.email}`);

    return {
      success: true,
      message:
        'If an account exists with this email, a password reset link has been sent.',
    };
  }

  /**
   * Verify reset token validity
   */
  async verifyResetToken(
    token: string,
  ): Promise<{ valid: boolean; message: string }> {
    const resetToken = this.resetTokens.get(token);

    if (!resetToken) {
      return {
        valid: false,
        message: 'Invalid or expired reset token',
      };
    }

    if (new Date() > resetToken.expiresAt) {
      this.resetTokens.delete(token);
      return {
        valid: false,
        message: 'Reset token has expired',
      };
    }

    return {
      valid: true,
      message: 'Token is valid',
    };
  }

  /**
   * Reset password using token
   */
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    // Verify token
    const verification = await this.verifyResetToken(token);
    if (!verification.valid) {
      throw new BadRequestException(verification.message);
    }

    const resetToken = this.resetTokens.get(token)!;
    const user = await this.userModel.findByPk(resetToken.userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Validate password strength
    if (!this.validatePasswordStrength(newPassword)) {
      throw new BadRequestException(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
      );
    }

    // Update password
    user.password = newPassword;
    user.mustChangePassword = false; // Reset the flag if it was set
    await user.save();

    // Remove used token
    this.resetTokens.delete(token);

    this.logInfo(`Password reset completed for user: ${user.email}`);

    return {
      success: true,
      message:
        'Password has been reset successfully. You can now login with your new password.',
    };
  }

  /**
   * Clean up expired tokens
   */
  private cleanupExpiredTokens(): void {
    const now = new Date();
    let cleaned = 0;

    for (const [token, data] of this.resetTokens.entries()) {
      if (now > data.expiresAt) {
        this.resetTokens.delete(token);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logDebug(`Cleaned up ${cleaned} expired password reset tokens`);
    }
  }

  /**
   * Generate secure random token
   */
  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Send password reset email
   * In production, integrate with email service (SendGrid, AWS SES, etc.)
   */
  private async sendPasswordResetEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const resetUrl = `${this.getAppUrl()}/reset-password?token=${token}`;

    // TODO: In production, send actual email
    this.logInfo(`Password reset email would be sent to: ${email}`);
    this.logInfo(`Reset URL: ${resetUrl}`);
    this.logInfo(`Token expires in ${this.tokenExpiryMinutes} minutes`);

    // Mock email sending
    // await emailService.send({
    //   to: email,
    //   subject: 'Password Reset Request',
    //   template: 'password-reset',
    //   data: { resetUrl, expiryMinutes: this.tokenExpiryMinutes }
    // });
  }

  /**
   * Get application URL from config
   */
  private getAppUrl(): string {
    return this.configService.get<string>('APP_URL') || 'http://localhost:3000';
  }

  /**
   * Validate password strength
   */
  private validatePasswordStrength(password: string): boolean {
    if (password.length < 8) {
      return false;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  }
}
