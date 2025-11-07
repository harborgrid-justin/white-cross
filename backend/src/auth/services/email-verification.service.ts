import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { User } from '../../database/models/user.model';

interface EmailVerificationToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: Date;
}

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);
  // In-memory store for verification tokens
  // In production, use Redis or database table
  private verificationTokens: Map<string, EmailVerificationToken> = new Map();
  private readonly tokenExpiryHours = 24; // 24 hours

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
  ) {
    // Clean up expired tokens every hour
    setInterval(() => this.cleanupExpiredTokens(), 60 * 60 * 1000);
  }

  /**
   * Send verification email to user
   */
  async sendVerificationEmail(
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      return {
        success: true,
        message: 'Email is already verified',
      };
    }

    // Generate verification token
    const token = this.generateVerificationToken();
    const expiresAt = new Date(
      Date.now() + this.tokenExpiryHours * 60 * 60 * 1000,
    );

    // Store token
    this.verificationTokens.set(token, {
      token,
      userId: user.id,
      email: user.email,
      expiresAt,
    });

    // Send verification email
    await this.sendEmail(user.email, token);

    this.logger.log(`Verification email sent to: ${user.email}`);

    return {
      success: true,
      message: 'Verification email has been sent. Please check your inbox.',
    };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      // Don't reveal that user doesn't exist
      return {
        success: true,
        message:
          'If an account exists with this email, a verification link has been sent.',
      };
    }

    if (user.isEmailVerified) {
      return {
        success: true,
        message: 'Email is already verified',
      };
    }

    // Remove any existing tokens for this user
    for (const [token, data] of this.verificationTokens.entries()) {
      if (data.userId === user.id) {
        this.verificationTokens.delete(token);
      }
    }

    // Send new verification email
    return this.sendVerificationEmail(user.id);
  }

  /**
   * Verify email with token
   */
  async verifyEmail(
    token: string,
  ): Promise<{ success: boolean; message: string; email?: string }> {
    const verificationData = this.verificationTokens.get(token);

    if (!verificationData) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (new Date() > verificationData.expiresAt) {
      this.verificationTokens.delete(token);
      throw new BadRequestException(
        'Verification token has expired. Please request a new one.',
      );
    }

    const user = await this.userModel.findByPk(verificationData.userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      return {
        success: true,
        message: 'Email is already verified',
        email: user.email,
      };
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();

    // Remove used token
    this.verificationTokens.delete(token);

    this.logger.log(`Email verified successfully for user: ${user.email}`);

    return {
      success: true,
      message: 'Email verified successfully. You can now access all features.',
      email: user.email,
    };
  }

  /**
   * Check if email is verified
   */
  async isEmailVerified(userId: string): Promise<boolean> {
    const user = await this.userModel.findByPk(userId);
    return user?.isEmailVerified || false;
  }

  /**
   * Clean up expired tokens
   */
  private cleanupExpiredTokens(): void {
    const now = new Date();
    let cleaned = 0;

    for (const [token, data] of this.verificationTokens.entries()) {
      if (now > data.expiresAt) {
        this.verificationTokens.delete(token);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.debug(`Cleaned up ${cleaned} expired verification tokens`);
    }
  }

  /**
   * Generate secure random token
   */
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Send verification email
   * In production, integrate with email service
   */
  private async sendEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.getAppUrl()}/verify-email?token=${token}`;

    // TODO: In production, send actual email
    this.logger.log(`Verification email would be sent to: ${email}`);
    this.logger.log(`Verification URL: ${verificationUrl}`);
    this.logger.log(`Token expires in ${this.tokenExpiryHours} hours`);

    // Mock email sending
    // await emailService.send({
    //   to: email,
    //   subject: 'Verify Your Email Address',
    //   template: 'email-verification',
    //   data: { verificationUrl, expiryHours: this.tokenExpiryHours }
    // });
  }

  /**
   * Get application URL from config
   */
  private getAppUrl(): string {
    return this.configService.get<string>('APP_URL') || 'http://localhost:3000';
  }
}
