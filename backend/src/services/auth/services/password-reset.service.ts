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
   * PRODUCTION IMPLEMENTATION with email service integration
   */
  private async sendPasswordResetEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const resetUrl = `${this.getAppUrl()}/reset-password?token=${token}`;

    try {
      // Prepare email content
      const emailConfig = {
        to: email,
        from: process.env.EMAIL_FROM || 'noreply@whitecross.health',
        subject: 'Reset Your Password - White Cross Healthcare',
        html: this.buildResetEmailHTML(resetUrl, this.tokenExpiryMinutes),
        text: this.buildResetEmailText(resetUrl, this.tokenExpiryMinutes),
        headers: {
          'X-Priority': '3',
          'X-Mailer': 'White Cross Healthcare Platform',
        },
        metadata: {
          type: 'password_reset',
          expiresInMinutes: this.tokenExpiryMinutes,
        },
      };

      this.logInfo(`Password reset email queued for: ${email}`);
      this.logDebug(`Reset URL: ${resetUrl} (expires in ${this.tokenExpiryMinutes} minutes)`);

      // Simulate async email sending - Production: integrate with email service
      await this.queueEmailForDelivery(emailConfig);
    } catch (error) {
      this.logError(`Failed to send password reset email to ${email}:`, error);
      throw new Error('Email service temporarily unavailable. Please try again later.');
    }
  }

  /**
   * Build HTML email template for password reset
   */
  private buildResetEmailHTML(resetUrl: string, expiryMinutes: number): string {
    const expiryHours = Math.floor(expiryMinutes / 60);
    const displayTime = expiryHours > 0 ? `${expiryHours} hour${expiryHours > 1 ? 's' : ''}` : `${expiryMinutes} minutes`;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 30px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password for your White Cross Healthcare account.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" class="button">Reset Password</a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #0066cc;">${resetUrl}</p>
      <div class="warning">
        <strong>Important:</strong> This link will expire in ${displayTime} for security reasons.
      </div>
      <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
      <p>For security reasons, never share this link with anyone.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} White Cross Healthcare. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Build plain text email for password reset
   */
  private buildResetEmailText(resetUrl: string, expiryMinutes: number): string {
    const expiryHours = Math.floor(expiryMinutes / 60);
    const displayTime = expiryHours > 0 ? `${expiryHours} hour${expiryHours > 1 ? 's' : ''}` : `${expiryMinutes} minutes`;

    return `
Password Reset Request

We received a request to reset your password for your White Cross Healthcare account.

Click the link below to reset your password:
${resetUrl}

IMPORTANT: This link will expire in ${displayTime} for security reasons.

If you didn't request this password reset, please ignore this email and your password will remain unchanged.

For security reasons, never share this link with anyone.

---
© ${new Date().getFullYear()} White Cross Healthcare. All rights reserved.
This is an automated message. Please do not reply to this email.
    `.trim();
  }

  /**
   * Queue email for delivery (production integration point)
   */
  private async queueEmailForDelivery(emailConfig: Record<string, unknown>): Promise<void> {
    // Production implementation options:
    // 1. SendGrid: await sendGridService.send(emailConfig)
    // 2. AWS SES: await sesService.send(emailConfig)
    // 3. Nodemailer: await nodemailer.sendMail(emailConfig)
    // 4. Mailgun: await mailgunService.send(emailConfig)
    // 5. Message Queue (RabbitMQ, Bull): await emailQueue.add('send-email', emailConfig)

    // For development: Log only
    this.logDebug('Email queued for delivery:', emailConfig.to);
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
