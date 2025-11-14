"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const models_1 = require("../../../database/models");
const base_1 = require("../../../common/base");
let EmailVerificationService = class EmailVerificationService extends base_1.BaseService {
    userModel;
    configService;
    verificationTokens = new Map();
    tokenExpiryHours = 24;
    constructor(userModel, configService) {
        super("EmailVerificationService");
        this.userModel = userModel;
        this.configService = configService;
        setInterval(() => this.cleanupExpiredTokens(), 60 * 60 * 1000);
    }
    async sendVerificationEmail(userId) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.isEmailVerified) {
            return {
                success: true,
                message: 'Email is already verified',
            };
        }
        const token = this.generateVerificationToken();
        const expiresAt = new Date(Date.now() + this.tokenExpiryHours * 60 * 60 * 1000);
        this.verificationTokens.set(token, {
            token,
            userId: user.id,
            email: user.email,
            expiresAt,
        });
        await this.sendEmail(user.email, token);
        this.logInfo(`Verification email sent to: ${user.email}`);
        return {
            success: true,
            message: 'Verification email has been sent. Please check your inbox.',
        };
    }
    async resendVerificationEmail(email) {
        const user = await this.userModel.findOne({ where: { email } });
        if (!user) {
            return {
                success: true,
                message: 'If an account exists with this email, a verification link has been sent.',
            };
        }
        if (user.isEmailVerified) {
            return {
                success: true,
                message: 'Email is already verified',
            };
        }
        for (const [token, data] of this.verificationTokens.entries()) {
            if (data.userId === user.id) {
                this.verificationTokens.delete(token);
            }
        }
        return this.sendVerificationEmail(user.id);
    }
    async verifyEmail(token) {
        const verificationData = this.verificationTokens.get(token);
        if (!verificationData) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
        if (new Date() > verificationData.expiresAt) {
            this.verificationTokens.delete(token);
            throw new common_1.BadRequestException('Verification token has expired. Please request a new one.');
        }
        const user = await this.userModel.findByPk(verificationData.userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.isEmailVerified) {
            return {
                success: true,
                message: 'Email is already verified',
                email: user.email,
            };
        }
        user.isEmailVerified = true;
        user.emailVerifiedAt = new Date();
        await user.save();
        this.verificationTokens.delete(token);
        this.logInfo(`Email verified successfully for user: ${user.email}`);
        return {
            success: true,
            message: 'Email verified successfully. You can now access all features.',
            email: user.email,
        };
    }
    async isEmailVerified(userId) {
        const user = await this.userModel.findByPk(userId);
        return user?.isEmailVerified || false;
    }
    cleanupExpiredTokens() {
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
    generateVerificationToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    async sendEmail(email, token) {
        const verificationUrl = `${this.getAppUrl()}/verify-email?token=${token}`;
        try {
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
            this.logInfo(`Verification email queued for: ${email}`);
            this.logDebug(`Email configuration:`, {
                to: emailConfig.to,
                from: emailConfig.from,
                subject: emailConfig.subject,
                verificationUrl,
                expiresInHours: this.tokenExpiryHours,
            });
            await this.queueEmailForDelivery(emailConfig);
        }
        catch (error) {
            this.logError(`Failed to send verification email to ${email}:`, error);
            throw new Error('Email service temporarily unavailable. Please try again later.');
        }
    }
    buildVerificationEmailHTML(verificationUrl, expiryHours) {
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
    buildVerificationEmailText(verificationUrl, expiryHours) {
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
    async queueEmailForDelivery(emailConfig) {
        this.logDebug('Email queued for delivery:', emailConfig.to);
    }
    getAppUrl() {
        return this.configService.get('APP_URL') || 'http://localhost:3000';
    }
};
exports.EmailVerificationService = EmailVerificationService;
exports.EmailVerificationService = EmailVerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.User)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], EmailVerificationService);
//# sourceMappingURL=email-verification.service.js.map