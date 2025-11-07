import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  AuthChangePasswordDto,
  RefreshTokenDto,
  AuthResponseDto,
  MfaSetupResponseDto,
  MfaVerifyDto,
  MfaEnableDto,
  MfaDisableDto,
  MfaStatusDto,
  MfaRegenerateBackupCodesDto,
  OAuthLoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  ResendVerificationDto,
  EmailVerificationResponseDto,
  ResetPasswordResponseDto,
} from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public, CurrentUser, AuthToken } from './decorators';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { MfaService } from './services/mfa.service';
import { OAuthService } from './services/oauth.service';
import { PasswordResetService } from './services/password-reset.service';
import { EmailVerificationService } from './services/email-verification.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly mfaService: MfaService,
    private readonly oauthService: OAuthService,
    private readonly passwordResetService: PasswordResetService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ short: { limit: 3, ttl: 60000 } }) // 3 registration attempts per minute
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Create a new user account with email, password, and user details. Rate limited to 3 attempts per minute to prevent abuse.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data or weak password',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User with this email already exists',
  })
  @ApiResponse({
    status: 429,
    description:
      'Too many requests - Rate limit exceeded (3 attempts per minute)',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async register(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    registerDto: RegisterDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 login attempts per minute
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate user with email and password, returns access and refresh tokens. Rate limited to 5 attempts per minute to prevent brute force attacks.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials or account locked',
  })
  @ApiResponse({
    status: 429,
    description:
      'Too many requests - Rate limit exceeded (5 attempts per minute)',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async login(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate a new access token using a valid refresh token',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired refresh token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async refresh(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: "Retrieve the authenticated user's profile information",
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getProfile(
    @CurrentUser() user: Express.User,
  ): Promise<{ success: boolean; data: Express.User }> {
    return {
      success: true,
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change user password',
    description: "Change the authenticated user's password",
  })
  @ApiBody({ type: AuthChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Weak password or validation error',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Current password is incorrect or authentication required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    changePasswordDto: AuthChangePasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    const result = await this.authService.changePassword(
      userId,
      changePasswordDto,
    );
    return { success: true, ...result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'User logout',
    description: 'Logout the authenticated user and invalidate tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async logout(
    @AuthToken() token: string | null,
  ): Promise<{ success: boolean; message: string }> {
    if (token) {
      await this.tokenBlacklistService.blacklistToken(token);
    }
    return {
      success: true,
      message: 'Logged out successfully. Tokens have been invalidated.',
    };
  }

  // ============================================================================
  // Token Refresh Alias (GAP-AUTH-005)
  // ============================================================================

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token (alias)',
    description: 'Alias for /auth/refresh endpoint for frontend compatibility',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  async refreshTokenAlias(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  // ============================================================================
  // OAuth2 Endpoints (GAP-AUTH-001)
  // ============================================================================

  @Public()
  @Post('oauth/google')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Google OAuth login',
    description:
      "Authenticate user with Google OAuth token. Creates new user if doesn't exist.",
  })
  @ApiBody({ type: OAuthLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Google OAuth authentication successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Google OAuth token',
  })
  async loginWithGoogle(
    @Body(ValidationPipe) dto: OAuthLoginDto,
  ): Promise<AuthResponseDto> {
    const profile = await this.oauthService.verifyGoogleToken(
      dto.idToken || dto.accessToken,
    );
    return this.oauthService.handleOAuthLogin(profile);
  }

  @Public()
  @Post('oauth/microsoft')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Microsoft OAuth login',
    description:
      "Authenticate user with Microsoft OAuth token. Creates new user if doesn't exist.",
  })
  @ApiBody({ type: OAuthLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Microsoft OAuth authentication successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Microsoft OAuth token',
  })
  async loginWithMicrosoft(
    @Body(ValidationPipe) dto: OAuthLoginDto,
  ): Promise<AuthResponseDto> {
    const profile = await this.oauthService.verifyMicrosoftToken(
      dto.idToken || dto.accessToken,
    );
    return this.oauthService.handleOAuthLogin(profile);
  }

  // ============================================================================
  // Multi-Factor Authentication Endpoints (GAP-AUTH-002)
  // ============================================================================

  @UseGuards(JwtAuthGuard)
  @Post('mfa/setup')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Setup MFA',
    description:
      'Initialize MFA setup for the authenticated user. Returns QR code and backup codes.',
  })
  @ApiResponse({
    status: 200,
    description: 'MFA setup initiated successfully',
    type: MfaSetupResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'MFA is already enabled',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  async setupMfa(
    @CurrentUser('id') userId: string,
  ): Promise<MfaSetupResponseDto> {
    return this.mfaService.setupMfa(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verify MFA code',
    description: 'Verify TOTP code or backup code for MFA authentication',
  })
  @ApiBody({ type: MfaVerifyDto })
  @ApiResponse({
    status: 200,
    description: 'MFA code verified successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid verification code',
  })
  async verifyMfa(
    @CurrentUser('id') userId: string,
    @Body(ValidationPipe) dto: MfaVerifyDto,
  ): Promise<{ success: boolean; verified: boolean; message: string }> {
    const verified = await this.mfaService.verifyMfa(
      userId,
      dto.code,
      dto.isBackupCode,
    );
    return {
      success: true,
      verified,
      message: 'MFA verification successful',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/disable')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Disable MFA',
    description: 'Disable MFA for the authenticated user',
  })
  @ApiBody({ type: MfaDisableDto })
  @ApiResponse({
    status: 200,
    description: 'MFA disabled successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid password or verification code',
  })
  async disableMfa(
    @CurrentUser('id') userId: string,
    @Body(ValidationPipe) dto: MfaDisableDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.mfaService.disableMfa(userId, dto.password, dto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mfa/status')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get MFA status',
    description: 'Check if MFA is enabled for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'MFA status retrieved successfully',
    type: MfaStatusDto,
  })
  async getMfaStatus(@CurrentUser('id') userId: string): Promise<MfaStatusDto> {
    return this.mfaService.getMfaStatus(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/enable')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Enable MFA',
    description: 'Enable MFA by verifying TOTP code from setup',
  })
  @ApiBody({ type: MfaEnableDto })
  @ApiResponse({
    status: 200,
    description: 'MFA enabled successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid verification code',
  })
  async enableMfa(
    @CurrentUser('id') userId: string,
    @Body(ValidationPipe) dto: MfaEnableDto,
  ) {
    return this.mfaService.enableMfa(userId, dto.code, dto.secret);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/regenerate-backup-codes')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Regenerate MFA backup codes',
    description: 'Generate new set of backup codes for MFA recovery',
  })
  @ApiBody({ type: MfaRegenerateBackupCodesDto })
  @ApiResponse({
    status: 200,
    description: 'Backup codes regenerated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid password or verification code',
  })
  async regenerateBackupCodes(
    @CurrentUser('id') userId: string,
    @Body(ValidationPipe) dto: MfaRegenerateBackupCodesDto,
  ) {
    return this.mfaService.regenerateBackupCodes(
      userId,
      dto.password,
      dto.code,
    );
  }

  // ============================================================================
  // Password Reset Endpoints (GAP-AUTH-003)
  // ============================================================================

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send password reset email with token',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent (if account exists)',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests',
  })
  async forgotPassword(
    @Body(ValidationPipe) dto: ForgotPasswordDto,
  ): Promise<{ message: string; success: boolean }> {
    return this.passwordResetService.initiatePasswordReset(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password with token',
    description: 'Reset user password using the token from email',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: ResetPasswordResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
  })
  async resetPassword(
    @Body(ValidationPipe) dto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.passwordResetService.resetPassword(dto.token, dto.password);
  }

  @Public()
  @Get('verify-reset-token')
  @ApiOperation({
    summary: 'Verify password reset token',
    description: 'Check if a password reset token is valid',
  })
  @ApiResponse({
    status: 200,
    description: 'Token validation result',
  })
  async verifyResetToken(
    @Query('token') token: string,
  ): Promise<{ valid: boolean; message: string }> {
    return this.passwordResetService.verifyResetToken(token);
  }

  // ============================================================================
  // Email Verification Endpoints (GAP-AUTH-004)
  // ============================================================================

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify email address',
    description: 'Verify user email with token from verification email',
  })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    type: EmailVerificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
  })
  async verifyEmail(
    @Body(ValidationPipe) dto: VerifyEmailDto,
  ): Promise<EmailVerificationResponseDto> {
    return this.emailVerificationService.verifyEmail(dto.token);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 3, ttl: 300000 } })
  @ApiOperation({
    summary: 'Resend verification email',
    description: 'Resend email verification link',
  })
  @ApiBody({ type: ResendVerificationDto })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent (if account exists)',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests',
  })
  async resendVerification(
    @Body(ValidationPipe) dto: ResendVerificationDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.emailVerificationService.resendVerificationEmail(dto.email);
  }
}
