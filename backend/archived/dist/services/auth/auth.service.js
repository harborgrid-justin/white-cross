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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const database_1 = require("../../database");
const base_1 = require("../../common/base");
const token_blacklist_service_1 = require("./services/token-blacklist.service");
let AuthService = class AuthService extends base_1.BaseService {
    userModel;
    jwtService;
    configService;
    tokenBlacklistService;
    saltRounds;
    accessTokenExpiry = '15m';
    refreshTokenExpiry = '7d';
    constructor(userModel, jwtService, configService, tokenBlacklistService) {
        super('AuthService');
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.configService = configService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.saltRounds = parseInt(this.configService.get('BCRYPT_SALT_ROUNDS', '12'), 10);
        if (this.saltRounds < 10 || this.saltRounds > 14) {
            throw new Error('SECURITY WARNING: bcrypt salt rounds must be between 10 and 14. ' +
                `Current value: ${this.saltRounds}. Recommended for healthcare: 12.`);
        }
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, role } = registerDto;
        const existingUser = await this.userModel.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        if (!this.validateEmail(email)) {
            throw new common_1.BadRequestException('Invalid email format');
        }
        if (!this.validatePasswordStrength(password)) {
            throw new common_1.BadRequestException('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
        }
        try {
            const user = await this.userModel.create({
                email,
                password,
                firstName,
                lastName,
                role: role || database_1.UserRole.ADMIN,
                emailVerified: true,
                isEmailVerified: true,
                emailVerifiedAt: new Date(),
                isActive: true,
            });
            this.logInfo(`User registered successfully: ${email}`);
            const tokens = await this.generateTokens(user);
            return {
                ...tokens,
                user: user.toSafeObject(),
                tokenType: 'Bearer',
                expiresIn: 900,
            };
        }
        catch (error) {
            this.logError(`Failed to register user: ${error.message}`, error instanceof Error ? error.stack : undefined);
            throw new common_1.BadRequestException('Failed to register user');
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.isAccountLocked()) {
            throw new common_1.UnauthorizedException('Account is temporarily locked due to multiple failed login attempts. Please try again later.');
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            await user.incrementFailedLoginAttempts();
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        await user.resetFailedLoginAttempts();
        this.logInfo(`User logged in successfully: ${email}`);
        const tokens = await this.generateTokens(user);
        return {
            ...tokens,
            user: user.toSafeObject(),
            tokenType: 'Bearer',
            expiresIn: 900,
        };
    }
    async verifyUser(userId) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async verifyToken(token) {
        try {
            const jwtSecret = this.configService.get('JWT_SECRET');
            if (!jwtSecret) {
                throw new Error('JWT_SECRET not configured');
            }
            const payload = this.jwtService.verify(token, {
                secret: jwtSecret,
            });
            if (payload.type !== 'access') {
                throw new common_1.UnauthorizedException('Invalid token type');
            }
            const user = await this.verifyUser(payload.sub);
            if (!user.isActive) {
                throw new common_1.UnauthorizedException('User account is inactive');
            }
            return user.toSafeObject();
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async refreshToken(refreshToken) {
        try {
            const refreshSecret = this.configService.get('JWT_REFRESH_SECRET') ||
                this.configService.get('JWT_SECRET');
            if (!refreshSecret) {
                throw new Error('JWT secrets not configured');
            }
            const payload = this.jwtService.verify(refreshToken, {
                secret: refreshSecret,
            });
            if (payload.type !== 'refresh') {
                throw new common_1.UnauthorizedException('Invalid token type');
            }
            const user = await this.verifyUser(payload.sub);
            if (!user.isActive) {
                throw new common_1.UnauthorizedException('User account is inactive');
            }
            const tokens = await this.generateTokens(user);
            return {
                ...tokens,
                user: user.toSafeObject(),
                tokenType: 'Bearer',
                expiresIn: 900,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        if (!this.validatePasswordStrength(newPassword)) {
            throw new common_1.BadRequestException('New password must be at least 8 characters and include uppercase, lowercase, number, and special character');
        }
        user.password = newPassword;
        await user.save();
        await this.tokenBlacklistService.blacklistAllUserTokens(userId);
        this.logInfo(`Password changed successfully for user: ${user.email} - All tokens invalidated`);
        return {
            message: 'Password changed successfully. All existing sessions have been terminated. Please login again.',
        };
    }
    async resetPassword(userId, newPassword, adminUserId) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (!this.validatePasswordStrength(newPassword)) {
            throw new common_1.BadRequestException('New password must be at least 8 characters and include uppercase, lowercase, number, and special character');
        }
        user.password = newPassword;
        user.mustChangePassword = true;
        await user.save();
        this.logInfo(`Password reset for user: ${user.email} by admin: ${adminUserId || 'system'}`);
        return { message: 'Password reset successfully' };
    }
    async getOrCreateTestUser(role = database_1.UserRole.NURSE) {
        const testEmail = `test-${role.toLowerCase()}@whitecross.test`;
        let user = await this.userModel.findOne({ where: { email: testEmail } });
        if (!user) {
            user = await this.userModel.create({
                email: testEmail,
                password: 'test123',
                firstName: 'Test',
                lastName: role.charAt(0) + role.slice(1).toLowerCase(),
                role,
            });
            this.logInfo(`Test user created: ${testEmail}`);
        }
        return user;
    }
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
            issuer: 'white-cross-healthcare',
            audience: 'white-cross-api',
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
            issuer: 'white-cross-healthcare',
            audience: 'white-cross-api',
        });
        return { accessToken, refreshToken };
    }
    async hashPassword(password) {
        return bcrypt.hash(password, this.saltRounds);
    }
    async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.User)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService,
        config_1.ConfigService,
        token_blacklist_service_1.TokenBlacklistService])
], AuthService);
//# sourceMappingURL=auth.service.js.map