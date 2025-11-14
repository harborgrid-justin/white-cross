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
exports.PasswordResetService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const models_1 = require("../../../database/models");
const base_1 = require("../../../common/base");
let PasswordResetService = class PasswordResetService extends base_1.BaseService {
    userModel;
    configService;
    resetTokens = new Map();
    tokenExpiryMinutes = 60;
    constructor(userModel, configService) {
        super("PasswordResetService");
        this.userModel = userModel;
        this.configService = configService;
        setInterval(() => this.cleanupExpiredTokens(), 15 * 60 * 1000);
    }
    async initiatePasswordReset(email) {
        const user = await this.userModel.findOne({ where: { email } });
        if (!user) {
            this.logWarning(`Password reset requested for non-existent email: ${email}`);
            return {
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent.',
            };
        }
        const token = this.generateResetToken();
        const expiresAt = new Date(Date.now() + this.tokenExpiryMinutes * 60 * 1000);
        this.resetTokens.set(token, {
            token,
            userId: user.id,
            expiresAt,
        });
        await this.sendPasswordResetEmail(user.email, token);
        this.logInfo(`Password reset initiated for user: ${user.email}`);
        return {
            success: true,
            message: 'If an account exists with this email, a password reset link has been sent.',
        };
    }
    async verifyResetToken(token) {
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
    async resetPassword(token, newPassword) {
        const verification = await this.verifyResetToken(token);
        if (!verification.valid) {
            throw new common_1.BadRequestException(verification.message);
        }
        const resetToken = this.resetTokens.get(token);
        const user = await this.userModel.findByPk(resetToken.userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (!this.validatePasswordStrength(newPassword)) {
            throw new common_1.BadRequestException('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
        }
        user.password = newPassword;
        user.mustChangePassword = false;
        await user.save();
        this.resetTokens.delete(token);
        this.logInfo(`Password reset completed for user: ${user.email}`);
        return {
            success: true,
            message: 'Password has been reset successfully. You can now login with your new password.',
        };
    }
    cleanupExpiredTokens() {
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
    generateResetToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    async sendPasswordResetEmail(email, token) {
        const resetUrl = `${this.getAppUrl()}/reset-password?token=${token}`;
        try {
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
            await this.queueEmailForDelivery(emailConfig);
        }
        catch (error) {
            this.logError(`Failed to send password reset email to ${email}:`, error);
            throw new Error('Email service temporarily unavailable. Please try again later.');
        }
    }
    buildResetEmailHTML(resetUrl, expiryMinutes) {
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
    buildResetEmailText(resetUrl, expiryMinutes) {
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
    async queueEmailForDelivery(emailConfig) {
        this.logDebug('Email queued for delivery:', emailConfig.to);
    }
    getAppUrl() {
        return this.configService.get('APP_URL') || 'http://localhost:3000';
    }
    validatePasswordStrength(password) {
        if (password.length < 8) {
            return false;
        }
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[@$!%*?&]/.test(password);
        return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    }
};
exports.PasswordResetService = PasswordResetService;
exports.PasswordResetService = PasswordResetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.User)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], PasswordResetService);
//# sourceMappingURL=password-reset.service.js.map