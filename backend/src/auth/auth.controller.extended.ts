import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { MfaService } from './services/mfa.service';
import { OAuthService } from './services/oauth.service';
import { PasswordResetService } from './services/password-reset.service';
import { EmailVerificationService } from './services/email-verification.service';
import {
  MfaSetupResponseDto,
  MfaVerifyDto,
  MfaEnableDto,
  MfaDisableDto,
  MfaStatusDto,
  MfaRegenerateBackupCodesDto,
  OAuthLoginDto,
  OAuthCallbackDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyResetTokenDto,
  ResetPasswordResponseDto,
  VerifyEmailDto,
  ResendVerificationDto,
  EmailVerificationResponseDto,
} from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public, CurrentUser } from './decorators';

/**
 * Extended Authentication Controller
 * Provides OAuth2, MFA, password reset, and email verification endpoints
 *
 * This controller extends the base auth functionality with:
 * - OAuth2 (Google & Microsoft)
 * - Multi-Factor Authentication (TOTP)
 * - Password Reset Flow
 * - Email Verification
 */
@ApiTags('Authentication - Extended')
@Controller('auth')
export class AuthControllerExtended {
  constructor(
    private readonly mfaService: MfaService,
    private readonly oauthService: OAuthService,
    private readonly passwordResetService: PasswordResetService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  // ============================================================================
  // OAuth2 Endpoints
  // ============================================================================

  @Public()
  @Post('oauth/google')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Google OAuth login',
    description: 'Authenticate user with Google OAuth token. Creates new user if doesn\'t exist.',
  })
  @ApiBody({ type: OAuthLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Google OAuth authentication successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Google OAuth token',
  })
  async loginWithGoogle(@Body(ValidationPipe) dto: OAuthLoginDto) {
    const profile = await this.oauthService.verifyGoogleToken(dto.idToken || dto.accessToken);
    return this.oauthService.handleOAuthLogin(profile);
  }

  @Public()
  @Post('oauth/microsoft')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Microsoft OAuth login',
    description: 'Authenticate user with Microsoft OAuth token. Creates new user if doesn\'t exist.',
  })
  @ApiBody({ type: OAuthLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Microsoft OAuth authentication successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Microsoft OAuth token',
  })
  async loginWithMicrosoft(@Body(ValidationPipe) dto: OAuthLoginDto) {
    const profile = await this.oauthService.verifyMicrosoftToken(dto.idToken || dto.accessToken);
    return this.oauthService.handleOAuthLogin(profile);
  }

  // ============================================================================
  // Multi-Factor Authentication (MFA) Endpoints
  // ============================================================================

  @UseGuards(JwtAuthGuard)
  @Post('mfa/setup')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Setup MFA',
    description: 'Initialize MFA setup for the authenticated user. Returns QR code and backup codes.',
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
  async setupMfa(@CurrentUser('id') userId: string): Promise<MfaSetupResponseDto> {
    return this.mfaService.setupMfa(userId);
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
  ) {
    const verified = await this.mfaService.verifyMfa(userId, dto.code, dto.isBackupCode);
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
  ) {
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
    return this.mfaService.regenerateBackupCodes(userId, dto.password, dto.code);
  }

  // ============================================================================
  // Password Reset Endpoints
  // ============================================================================

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 3, ttl: 60000 } }) // 3 attempts per minute
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
  async forgotPassword(@Body(ValidationPipe) dto: ForgotPasswordDto) {
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
  async resetPassword(@Body(ValidationPipe) dto: ResetPasswordDto): Promise<ResetPasswordResponseDto> {
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
  async verifyResetToken(@Body(ValidationPipe) dto: VerifyResetTokenDto) {
    return this.passwordResetService.verifyResetToken(dto.token);
  }

  // ============================================================================
  // Email Verification Endpoints
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
  async verifyEmail(@Body(ValidationPipe) dto: VerifyEmailDto): Promise<EmailVerificationResponseDto> {
    return this.emailVerificationService.verifyEmail(dto.token);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 3, ttl: 300000 } }) // 3 attempts per 5 minutes
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
  async resendVerification(@Body(ValidationPipe) dto: ResendVerificationDto) {
    return this.emailVerificationService.resendVerificationEmail(dto.email);
  }

  // ============================================================================
  // Token Refresh Alias (for frontend compatibility)
  // ============================================================================

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token (alias)',
    description: 'Alias for /auth/refresh endpoint for frontend compatibility',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  async refreshTokenAlias(@Req() req: Request) {
    // This is handled by the main auth controller's /refresh endpoint
    // This alias is just for frontend compatibility
    return {
      message: 'Please use /auth/refresh endpoint',
      note: 'This is an alias for backward compatibility. The actual implementation is in /auth/refresh',
    };
  }
}
