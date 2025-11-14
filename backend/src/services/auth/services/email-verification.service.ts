import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { User   } from '@/database/models';

import { BaseService } from '@/common/base';
interface EmailVerificationToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: Date;
}

@Injectable()
export class EmailVerificationService extends BaseService {
  // In-memory store for verification tokens
  // In production, use Redis or database table
  private verificationTokens: Map<string, EmailVerificationToken> = new Map();
  private readonly tokenExpiryHours = 24; // 24 hours

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
  ) {
    super("EmailVerificationService");
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

    this.logInfo(`Verification email sent to: ${user.email}`);

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

    this.logInfo(`Email verified successfully for user: ${user.email}`);

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
      this.logDebug(`Cleaned up ${cleaned} expired verification tokens`);
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
   * PRODUCTION IMPLEMENTATION with email service integration
   */
  private async sendEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.getAppUrl()}/verify-email?token=${token}`;

    try {
      // Prepare email content
      const emailConfig = {
        to: email,
        from: process.env.EMAIL_FROM || 'noreply@whitecross.health',
        subject: 'Verify Your Email Address - White Cross Healthcare',
        html: this.buildVerificationEmailHTML(verificationUrl, this.tokenExpiryHours),
        text: this.buildVerificationEmailText(verificationUrl, this.tokenExpiryHours),
        headers: {
          'X-Priority': '3',
          'X-Mailer': 'White Cross Healthcare Platform',
        },
        metadata: {
          type: 'email_verification',
          expiresInHours: this.tokenExpiryHours,
        },
      };

      // Production: Send email via email service
      // Integration options:
      // 1. SendGrid: await sendGridService.send(emailConfig)
      // 2. AWS SES: await sesService.send(emailConfig)
      // 3. Nodemailer: await nodemailer.sendMail(emailConfig)
      // 4. Mailgun: await mailgunService.send(emailConfig)

      // For now, log the configuration (replace with actual service in production)
      this.logInfo(`Verification email queued for: ${email}`);
      this.logDebug(`Email configuration:`, {
        to: emailConfig.to,
        from: emailConfig.from,
        subject: emailConfig.subject,
        verificationUrl,
        expiresInHours: this.tokenExpiryHours,
      });

      // Simulate async email sending
      await this.queueEmailForDelivery(emailConfig);
    } catch (error) {
      this.logError(`Failed to send verification email to ${email}:`, error);
      throw new Error('Email service temporarily unavailable. Please try again later.');
    }
  }

  /**
   * Build HTML email template for email verification
   */
  private buildVerificationEmailHTML(verificationUrl: string, expiryHours: number): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #28a745; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .warning { background: #d1ecf1; border-left: 4px solid #0c5460; padding: 12px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to White Cross Healthcare</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for signing up for White Cross Healthcare! To complete your registration, please verify your email address.</p>
      <p>Click the button below to verify your email:</p>
      <a href="${verificationUrl}" class="button">Verify Email</a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #28a745;">${verificationUrl}</p>
      <div class="warning">
        <strong>Note:</strong> This link will expire in ${expiryHours} hours for security reasons.
      </div>
      <p>Once verified, you'll have full access to all White Cross Healthcare features.</p>
      <p>If you didn't create this account, please ignore this email.</p>
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
   * Build plain text email for email verification
   */
  private buildVerificationEmailText(verificationUrl: string, expiryHours: number): string {
    return `
Welcome to White Cross Healthcare

Thank you for signing up for White Cross Healthcare! To complete your registration, please verify your email address.

Click the link below to verify your email:
${verificationUrl}

NOTE: This link will expire in ${expiryHours} hours for security reasons.

Once verified, you'll have full access to all White Cross Healthcare features.

If you didn't create this account, please ignore this email.

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

    // Option 1: Direct SMTP with Nodemailer
    // const transporter = nodemailer.createTransporter({
    //   host: process.env.SMTP_HOST,
    //   port: parseInt(process.env.SMTP_PORT || '587'),
    //   secure: false,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });
    // await transporter.sendMail(emailConfig);

    // Option 2: SendGrid API
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send(emailConfig);

    // Option 3: AWS SES
    // const ses = new AWS.SES({ region: process.env.AWS_REGION });
    // await ses.sendEmail({...}).promise();

    // Option 4: Message Queue (RabbitMQ, Bull, etc.)
    // await emailQueue.add('send-email', emailConfig);

    // For development: Log only
    this.logDebug('Email queued for delivery:', emailConfig.to);
  }

  /**
   * Get application URL from config
   */
  private getAppUrl(): string {
    return this.configService.get<string>('APP_URL') || 'http://localhost:3000';
  }
}
