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
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const change_password_dto_1 = require("./dto/change-password.dto");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const email_verification_dto_1 = require("./dto/email-verification.dto");
const password_reset_dto_1 = require("./dto/password-reset.dto");
const login_dto_1 = require("./dto/login.dto");
const mfa_dto_1 = require("./dto/mfa.dto");
const oauth_dto_1 = require("./dto/oauth.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const register_dto_1 = require("./dto/register.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const auth_token_decorator_1 = require("./decorators/auth-token.decorator");
const current_user_decorator_1 = require("./decorators/current-user.decorator");
const public_decorator_1 = require("./decorators/public.decorator");
const email_verification_service_1 = require("./services/email-verification.service");
const mfa_service_1 = require("./services/mfa.service");
const oauth_service_1 = require("./services/oauth.service");
const password_reset_service_1 = require("./services/password-reset.service");
const token_blacklist_service_1 = require("./services/token-blacklist.service");
const base_1 = require("../../common/base");
let AuthController = class AuthController extends base_1.BaseController {
    authService;
    tokenBlacklistService;
    mfaService;
    oauthService;
    passwordResetService;
    emailVerificationService;
    constructor(authService, tokenBlacklistService, mfaService, oauthService, passwordResetService, emailVerificationService) {
        super();
        this.authService = authService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.mfaService = mfaService;
        this.oauthService = oauthService;
        this.passwordResetService = passwordResetService;
        this.emailVerificationService = emailVerificationService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async refresh(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }
    async getProfile(user) {
        return {
            success: true,
            data: user,
        };
    }
    async changePassword(userId, changePasswordDto) {
        const result = await this.authService.changePassword(userId, changePasswordDto);
        return { success: true, ...result };
    }
    async logout(token) {
        if (token) {
            await this.tokenBlacklistService.blacklistToken(token);
        }
        return {
            success: true,
            message: 'Logged out successfully. Tokens have been invalidated.',
        };
    }
    async refreshTokenAlias(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }
    async loginWithGoogle(dto) {
        const profile = await this.oauthService.verifyGoogleToken(dto.idToken || dto.accessToken);
        return this.oauthService.handleOAuthLogin(profile);
    }
    async loginWithMicrosoft(dto) {
        const profile = await this.oauthService.verifyMicrosoftToken(dto.idToken || dto.accessToken);
        return this.oauthService.handleOAuthLogin(profile);
    }
    async setupMfa(userId) {
        return this.mfaService.setupMfa(userId);
    }
    async verifyMfa(userId, dto) {
        const verified = await this.mfaService.verifyMfa(userId, dto.code, dto.isBackupCode);
        return {
            success: true,
            verified,
            message: 'MFA verification successful',
        };
    }
    async disableMfa(userId, dto) {
        return this.mfaService.disableMfa(userId, dto.password, dto.code);
    }
    async getMfaStatus(userId) {
        return this.mfaService.getMfaStatus(userId);
    }
    async enableMfa(userId, dto) {
        return this.mfaService.enableMfa(userId, dto.code, dto.secret);
    }
    async regenerateBackupCodes(userId, dto) {
        return this.mfaService.regenerateBackupCodes(userId, dto.password, dto.code);
    }
    async forgotPassword(dto) {
        return this.passwordResetService.initiatePasswordReset(dto.email);
    }
    async resetPassword(dto) {
        return this.passwordResetService.resetPassword(dto.token, dto.password);
    }
    async verifyResetToken(token) {
        return this.passwordResetService.verifyResetToken(token);
    }
    async verifyEmail(dto) {
        return this.emailVerificationService.verifyEmail(dto.token);
    }
    async resendVerification(dto) {
        return this.emailVerificationService.resendVerificationEmail(dto.email);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, throttler_1.Throttle)({ short: { limit: 3, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Register a new user',
        description: 'Create a new user account with email, password, and user details. Rate limited to 3 attempts per minute to prevent abuse.',
    }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User registered successfully',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid input data or weak password',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - User with this email already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many requests - Rate limit exceeded (3 attempts per minute)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("./dto/auth-response.dto").AuthResponseDto }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'User login',
        description: 'Authenticate user with email and password, returns access and refresh tokens. Rate limited to 5 attempts per minute to prevent brute force attacks.',
    }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid credentials or account locked',
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many requests - Rate limit exceeded (5 attempts per minute)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/auth-response.dto").AuthResponseDto }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh access token',
        description: 'Generate a new access token using a valid refresh token',
    }),
    (0, swagger_1.ApiBody)({ type: refresh_token_dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or expired refresh token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/auth-response.dto").AuthResponseDto }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current user profile',
        description: "Retrieve the authenticated user's profile information",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('me/password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user password',
        description: "Update the authenticated user's password",
    }),
    (0, swagger_1.ApiBody)({ type: change_password_dto_1.AuthChangePasswordDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Weak password or validation error',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Current password is incorrect or authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_password_dto_1.AuthChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'User logout',
        description: 'Logout the authenticated user and invalidate tokens',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Logout successful',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, auth_token_decorator_1.AuthToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh-token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh access token (alias)',
        description: 'Alias for /auth/refresh endpoint for frontend compatibility',
    }),
    (0, swagger_1.ApiBody)({ type: refresh_token_dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid or expired refresh token',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/auth-response.dto").AuthResponseDto }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokenAlias", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('oauth/google'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Google OAuth login',
        description: "Authenticate user with Google OAuth token. Creates new user if doesn't exist.",
    }),
    (0, swagger_1.ApiBody)({ type: oauth_dto_1.OAuthLoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Google OAuth authentication successful',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid Google OAuth token',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/auth-response.dto").AuthResponseDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_dto_1.OAuthLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithGoogle", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('oauth/microsoft'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Microsoft OAuth login',
        description: "Authenticate user with Microsoft OAuth token. Creates new user if doesn't exist.",
    }),
    (0, swagger_1.ApiBody)({ type: oauth_dto_1.OAuthLoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Microsoft OAuth authentication successful',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid Microsoft OAuth token',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/auth-response.dto").AuthResponseDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_dto_1.OAuthLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithMicrosoft", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('mfa/setup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Setup MFA',
        description: 'Initialize MFA setup for the authenticated user. Returns QR code and backup codes.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'MFA setup initiated successfully',
        type: mfa_dto_1.MfaSetupResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'MFA is already enabled',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Authentication required',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/mfa.dto").MfaSetupResponseDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setupMfa", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('mfa/verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify MFA code',
        description: 'Verify TOTP code or backup code for MFA authentication',
    }),
    (0, swagger_1.ApiBody)({ type: mfa_dto_1.MfaVerifyDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'MFA code verified successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid verification code',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mfa_dto_1.MfaVerifyDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyMfa", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('mfa/disable'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Disable MFA',
        description: 'Disable MFA for the authenticated user',
    }),
    (0, swagger_1.ApiBody)({ type: mfa_dto_1.MfaDisableDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'MFA disabled successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid password or verification code',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mfa_dto_1.MfaDisableDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disableMfa", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('mfa/status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get MFA status',
        description: 'Check if MFA is enabled for the authenticated user',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'MFA status retrieved successfully',
        type: mfa_dto_1.MfaStatusDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/mfa.dto").MfaStatusDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMfaStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('mfa/enable'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Enable MFA',
        description: 'Enable MFA by verifying TOTP code from setup',
    }),
    (0, swagger_1.ApiBody)({ type: mfa_dto_1.MfaEnableDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'MFA enabled successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid verification code',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mfa_dto_1.MfaEnableDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableMfa", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('mfa/regenerate-backup-codes'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Regenerate MFA backup codes',
        description: 'Generate new set of backup codes for MFA recovery',
    }),
    (0, swagger_1.ApiBody)({ type: mfa_dto_1.MfaRegenerateBackupCodesDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Backup codes regenerated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid password or verification code',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mfa_dto_1.MfaRegenerateBackupCodesDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "regenerateBackupCodes", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ short: { limit: 3, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Request password reset',
        description: 'Send password reset email with token',
    }),
    (0, swagger_1.ApiBody)({ type: password_reset_dto_1.ForgotPasswordDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset email sent (if account exists)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many requests',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_reset_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset password with token',
        description: 'Reset user password using the token from email',
    }),
    (0, swagger_1.ApiBody)({ type: password_reset_dto_1.ResetPasswordDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset successfully',
        type: password_reset_dto_1.ResetPasswordResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid or expired token',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/password-reset.dto").ResetPasswordResponseDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_reset_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('verify-reset-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify password reset token',
        description: 'Check if a password reset token is valid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token validation result',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyResetToken", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify email address',
        description: 'Verify user email with token from verification email',
    }),
    (0, swagger_1.ApiBody)({ type: email_verification_dto_1.VerifyEmailDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Email verified successfully',
        type: email_verification_dto_1.EmailVerificationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid or expired token',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/email-verification.dto").EmailVerificationResponseDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_verification_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('resend-verification'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ short: { limit: 3, ttl: 300000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Resend verification email',
        description: 'Resend email verification link',
    }),
    (0, swagger_1.ApiBody)({ type: email_verification_dto_1.ResendVerificationDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Verification email sent (if account exists)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many requests',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_verification_dto_1.ResendVerificationDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerification", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        token_blacklist_service_1.TokenBlacklistService,
        mfa_service_1.MfaService,
        oauth_service_1.OAuthService,
        password_reset_service_1.PasswordResetService,
        email_verification_service_1.EmailVerificationService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map