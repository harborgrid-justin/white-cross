"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../database/models");
const jwt_1 = require("@nestjs/jwt");
const base_1 = require("../../../common/base");
let OAuthService = class OAuthService extends base_1.BaseService {
    userModel;
    jwtService;
    configService;
    accessTokenExpiry = '15m';
    refreshTokenExpiry = '7d';
    constructor(userModel, jwtService, configService) {
        super("OAuthService");
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async handleOAuthLogin(profile) {
        let user = await this.userModel.findOne({
            where: { email: profile.email },
        });
        if (!user) {
            user = await this.createUserFromOAuthProfile(profile);
            this.logInfo(`New user created via ${profile.provider} OAuth: ${profile.email}`);
        }
        else {
            await user.resetFailedLoginAttempts();
            this.logInfo(`Existing user logged in via ${profile.provider} OAuth: ${profile.email}`);
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        if (user.isAccountLocked()) {
            throw new common_1.UnauthorizedException('Account is temporarily locked. Please try again later.');
        }
        const tokens = await this.generateTokens(user);
        return {
            ...tokens,
            user: user.toSafeObject(),
            tokenType: 'Bearer',
            expiresIn: 900,
        };
    }
    async verifyGoogleToken(idToken) {
        try {
            const payload = this.decodeJwt(idToken);
            if (!payload) {
                throw new common_1.UnauthorizedException('Invalid Google token');
            }
            return {
                id: payload.sub || payload.id,
                email: payload.email,
                firstName: payload.given_name,
                lastName: payload.family_name,
                displayName: payload.name,
                picture: payload.picture,
                provider: 'google',
            };
        }
        catch (error) {
            this.logError(`Google token verification failed: ${error.message}`);
            throw new common_1.UnauthorizedException('Invalid Google authentication');
        }
    }
    async verifyMicrosoftToken(idToken) {
        try {
            const payload = this.decodeJwt(idToken);
            if (!payload) {
                throw new common_1.UnauthorizedException('Invalid Microsoft token');
            }
            return {
                id: payload.oid || payload.sub || payload.id,
                email: payload.email || payload.preferred_username,
                firstName: payload.given_name,
                lastName: payload.family_name,
                displayName: payload.name,
                picture: payload.picture,
                provider: 'microsoft',
            };
        }
        catch (error) {
            this.logError(`Microsoft token verification failed: ${error.message}`);
            throw new common_1.UnauthorizedException('Invalid Microsoft authentication');
        }
    }
    async createUserFromOAuthProfile(profile) {
        const randomPassword = this.generateRandomPassword();
        const user = await this.userModel.create({
            email: profile.email,
            password: randomPassword,
            firstName: profile.firstName || profile.displayName?.split(' ')[0] || 'User',
            lastName: profile.lastName ||
                profile.displayName?.split(' ').slice(1).join(' ') ||
                '',
            role: models_1.UserRole.ADMIN,
            isEmailVerified: true,
            oauthProvider: profile.provider,
            oauthProviderId: profile.id,
            profilePictureUrl: profile.picture,
        });
        return user;
    }
    async generateTokens(user) {
        const jwtSecret = this.configService.get('JWT_SECRET');
        const refreshSecret = this.configService.get('JWT_REFRESH_SECRET') || jwtSecret;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET not configured');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            type: 'access',
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: jwtSecret,
            expiresIn: this.accessTokenExpiry,
        });
        const refreshPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            type: 'refresh',
        };
        const refreshToken = this.jwtService.sign(refreshPayload, {
            secret: refreshSecret,
            expiresIn: this.refreshTokenExpiry,
        });
        return { accessToken, refreshToken };
    }
    decodeJwt(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }
            const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
            return JSON.parse(payload);
        }
        catch (error) {
            return null;
        }
    }
    generateRandomPassword() {
        const crypto = require('crypto');
        const length = 32;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
        let password = '';
        password += 'A';
        password += 'a';
        password += '1';
        password += '@';
        for (let i = 4; i < length; i++) {
            password += charset[crypto.randomInt(0, charset.length)];
        }
        return password
            .split('')
            .sort(() => Math.random() - 0.5)
            .join('');
    }
};
exports.OAuthService = OAuthService;
exports.OAuthService = OAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.User)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService,
        config_1.ConfigService])
], OAuthService);
//# sourceMappingURL=oauth.service.js.map