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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const speakeasy = __importStar(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const crypto = __importStar(require("crypto"));
const models_1 = require("../../../database/models");
const base_1 = require("../../../common/base");
let MfaService = class MfaService extends base_1.BaseService {
    userModel;
    configService;
    appName = 'White Cross Healthcare';
    constructor(userModel, configService) {
        super("MfaService");
        this.userModel = userModel;
        this.configService = configService;
    }
    async setupMfa(userId) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.mfaEnabled) {
            throw new common_1.BadRequestException('MFA is already enabled for this user');
        }
        const secret = speakeasy.generateSecret({
            name: `${this.appName} (${user.email})`,
            issuer: this.appName,
            length: 32,
        });
        const qrCodeDataUrl = await qrcode_1.default.toDataURL(secret.otpauth_url);
        const backupCodes = this.generateBackupCodes(10);
        const hashedBackupCodes = await Promise.all(backupCodes.map((code) => this.hashBackupCode(code)));
        user.mfaSecret = secret.base32;
        user.mfaBackupCodes = JSON.stringify(hashedBackupCodes);
        await user.save();
        this.logInfo(`MFA setup initiated for user: ${user.email}`);
        const manualEntryKey = secret.base32.match(/.{1,4}/g)?.join(' ') || secret.base32;
        return {
            secret: secret.base32,
            qrCode: qrCodeDataUrl,
            backupCodes,
            manualEntryKey,
        };
    }
    async enableMfa(userId, code, secret) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.mfaEnabled) {
            throw new common_1.BadRequestException('MFA is already enabled');
        }
        if (user.mfaSecret !== secret) {
            throw new common_1.BadRequestException('Invalid MFA setup session');
        }
        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token: code,
            window: 2,
        });
        if (!verified) {
            throw new common_1.UnauthorizedException('Invalid verification code');
        }
        user.mfaEnabled = true;
        user.mfaEnabledAt = new Date();
        await user.save();
        this.logInfo(`MFA enabled successfully for user: ${user.email}`);
        return {
            success: true,
            message: 'Multi-factor authentication has been enabled successfully',
        };
    }
    async verifyMfa(userId, code, isBackupCode = false) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.mfaEnabled || !user.mfaSecret) {
            throw new common_1.BadRequestException('MFA is not enabled for this user');
        }
        if (isBackupCode) {
            return this.verifyBackupCode(user, code);
        }
        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token: code,
            window: 2,
        });
        if (!verified) {
            this.logWarning(`Failed MFA verification attempt for user: ${user.email}`);
            throw new common_1.UnauthorizedException('Invalid verification code');
        }
        this.logInfo(`Successful MFA verification for user: ${user.email}`);
        return true;
    }
    async disableMfa(userId, password, code) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.mfaEnabled) {
            throw new common_1.BadRequestException('MFA is not enabled for this user');
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        if (code) {
            await this.verifyMfa(userId, code);
        }
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
    async getMfaStatus(userId) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        let backupCodesRemaining = 0;
        if (user.mfaBackupCodes) {
            try {
                const codes = JSON.parse(user.mfaBackupCodes);
                backupCodesRemaining = Array.isArray(codes) ? codes.length : 0;
            }
            catch (error) {
                this.logError(`Failed to parse backup codes for user ${user.email}:`, error);
            }
        }
        return {
            enabled: user.mfaEnabled || false,
            hasBackupCodes: backupCodesRemaining > 0,
            backupCodesRemaining,
            enabledAt: user.mfaEnabledAt || undefined,
        };
    }
    async regenerateBackupCodes(userId, password, code) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.mfaEnabled) {
            throw new common_1.BadRequestException('MFA is not enabled for this user');
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        await this.verifyMfa(userId, code);
        const backupCodes = this.generateBackupCodes(10);
        const hashedBackupCodes = await Promise.all(backupCodes.map((code) => this.hashBackupCode(code)));
        user.mfaBackupCodes = JSON.stringify(hashedBackupCodes);
        await user.save();
        this.logInfo(`Backup codes regenerated for user: ${user.email}`);
        return { backupCodes };
    }
    async verifyBackupCode(user, code) {
        if (!user.mfaBackupCodes) {
            throw new common_1.UnauthorizedException('No backup codes available');
        }
        let backupCodes;
        try {
            backupCodes = JSON.parse(user.mfaBackupCodes);
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid backup codes data');
        }
        const hashedCode = await this.hashBackupCode(code);
        const codeIndex = backupCodes.findIndex((bc) => bc === hashedCode);
        if (codeIndex === -1) {
            this.logWarning(`Failed backup code verification for user: ${user.email}`);
            throw new common_1.UnauthorizedException('Invalid backup code');
        }
        backupCodes.splice(codeIndex, 1);
        user.mfaBackupCodes = JSON.stringify(backupCodes);
        await user.save();
        this.logInfo(`Backup code used successfully for user: ${user.email}. Remaining: ${backupCodes.length}`);
        return true;
    }
    generateBackupCodes(count) {
        const codes = [];
        for (let i = 0; i < count; i++) {
            const code = crypto.randomInt(10000000, 99999999).toString();
            codes.push(code);
        }
        return codes;
    }
    async hashBackupCode(code) {
        return crypto.createHash('sha256').update(code).digest('hex');
    }
};
exports.MfaService = MfaService;
exports.MfaService = MfaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.User)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], MfaService);
//# sourceMappingURL=mfa.service.js.map