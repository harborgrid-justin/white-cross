import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { MfaService } from './services/mfa.service';
import { OAuthService } from './services/oauth.service';
import { PasswordResetService } from './services/password-reset.service';
import { EmailVerificationService } from './services/email-verification.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@/database/models';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let tokenBlacklistService: jest.Mocked<TokenBlacklistService>;
  let mfaService: jest.Mocked<MfaService>;
  let oauthService: jest.Mocked<OAuthService>;
  let passwordResetService: jest.Mocked<PasswordResetService>;
  let emailVerificationService: jest.Mocked<EmailVerificationService>;

  const mockAuthResponse = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    user: { id: 'user-123', email: 'test@example.com', role: UserRole.ADMIN },
    tokenType: 'Bearer',
    expiresIn: 900,
  };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
      verifyToken: jest.fn(),
      changePassword: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    tokenBlacklistService = {
      blacklistToken: jest.fn(),
    } as unknown as jest.Mocked<TokenBlacklistService>;

    mfaService = {
      setupMfa: jest.fn(),
      enableMfa: jest.fn(),
      verifyMfa: jest.fn(),
      disableMfa: jest.fn(),
      getMfaStatus: jest.fn(),
      regenerateBackupCodes: jest.fn(),
    } as unknown as jest.Mocked<MfaService>;

    oauthService = {
      verifyGoogleToken: jest.fn(),
      verifyMicrosoftToken: jest.fn(),
      handleOAuthLogin: jest.fn(),
    } as unknown as jest.Mocked<OAuthService>;

    passwordResetService = {
      initiatePasswordReset: jest.fn(),
      verifyResetToken: jest.fn(),
      resetPassword: jest.fn(),
    } as unknown as jest.Mocked<PasswordResetService>;

    emailVerificationService = {
      sendVerificationEmail: jest.fn(),
      resendVerificationEmail: jest.fn(),
      verifyEmail: jest.fn(),
    } as unknown as jest.Mocked<EmailVerificationService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: TokenBlacklistService, useValue: tokenBlacklistService },
        { provide: MfaService, useValue: mfaService },
        { provide: OAuthService, useValue: oauthService },
        { provide: PasswordResetService, useValue: passwordResetService },
        { provide: EmailVerificationService, useValue: emailVerificationService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'Test@123',
        firstName: 'Test',
        lastName: 'User',
      };

      authService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'Test@123' };

      authService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('refresh', () => {
    it('should refresh access token', async () => {
      const dto = { refreshToken: 'refresh-token' };

      authService.refreshToken.mockResolvedValue(mockAuthResponse);

      const result = await controller.refresh(dto);

      expect(authService.refreshToken).toHaveBeenCalledWith(dto.refreshToken);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user = { id: 'user-123', email: 'test@example.com' } as Express.User;

      const result = await controller.getProfile(user);

      expect(result).toEqual({
        success: true,
        data: user,
      });
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const dto = { currentPassword: 'OldPass@123', newPassword: 'NewPass@456' };

      authService.changePassword.mockResolvedValue({
        message: 'Password changed successfully',
      });

      const result = await controller.changePassword('user-123', dto);

      expect(authService.changePassword).toHaveBeenCalledWith('user-123', dto);
      expect(result.success).toBe(true);
    });
  });

  describe('logout', () => {
    it('should logout and blacklist token', async () => {
      const token = 'access-token';

      const result = await controller.logout(token);

      expect(tokenBlacklistService.blacklistToken).toHaveBeenCalledWith(token);
      expect(result.success).toBe(true);
      expect(result.message).toContain('Logged out successfully');
    });

    it('should handle logout without token', async () => {
      const result = await controller.logout(null);

      expect(tokenBlacklistService.blacklistToken).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('OAuth endpoints', () => {
    it('should handle Google OAuth login', async () => {
      const dto = { idToken: 'google-id-token' };
      const profile = { id: 'google-123', email: 'test@gmail.com', provider: 'google' };

      oauthService.verifyGoogleToken.mockResolvedValue(profile as never);
      oauthService.handleOAuthLogin.mockResolvedValue(mockAuthResponse);

      const result = await controller.loginWithGoogle(dto);

      expect(oauthService.verifyGoogleToken).toHaveBeenCalledWith('google-id-token');
      expect(oauthService.handleOAuthLogin).toHaveBeenCalledWith(profile);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle Microsoft OAuth login', async () => {
      const dto = { idToken: 'microsoft-id-token' };
      const profile = { id: 'microsoft-123', email: 'test@outlook.com', provider: 'microsoft' };

      oauthService.verifyMicrosoftToken.mockResolvedValue(profile as never);
      oauthService.handleOAuthLogin.mockResolvedValue(mockAuthResponse);

      const result = await controller.loginWithMicrosoft(dto);

      expect(oauthService.verifyMicrosoftToken).toHaveBeenCalledWith('microsoft-id-token');
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('MFA endpoints', () => {
    it('should setup MFA', async () => {
      const setupResponse = {
        secret: 'secret',
        qrCode: 'qr-code',
        backupCodes: ['code1'],
        manualEntryKey: 'manual-key',
      };

      mfaService.setupMfa.mockResolvedValue(setupResponse);

      const result = await controller.setupMfa('user-123');

      expect(mfaService.setupMfa).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(setupResponse);
    });

    it('should verify MFA code', async () => {
      const dto = { code: '123456', isBackupCode: false };

      mfaService.verifyMfa.mockResolvedValue(true);

      const result = await controller.verifyMfa('user-123', dto);

      expect(mfaService.verifyMfa).toHaveBeenCalledWith('user-123', '123456', false);
      expect(result.verified).toBe(true);
    });

    it('should disable MFA', async () => {
      const dto = { password: 'Test@123', code: '123456' };

      mfaService.disableMfa.mockResolvedValue({
        success: true,
        message: 'MFA disabled',
      });

      const result = await controller.disableMfa('user-123', dto);

      expect(mfaService.disableMfa).toHaveBeenCalledWith('user-123', dto.password, dto.code);
      expect(result.success).toBe(true);
    });

    it('should get MFA status', async () => {
      const status = {
        enabled: true,
        hasBackupCodes: true,
        backupCodesRemaining: 5,
        enabledAt: new Date(),
      };

      mfaService.getMfaStatus.mockResolvedValue(status);

      const result = await controller.getMfaStatus('user-123');

      expect(result).toEqual(status);
    });
  });

  describe('Password reset endpoints', () => {
    it('should initiate password reset', async () => {
      const dto = { email: 'test@example.com' };

      passwordResetService.initiatePasswordReset.mockResolvedValue({
        success: true,
        message: 'Reset email sent',
      });

      const result = await controller.forgotPassword(dto);

      expect(passwordResetService.initiatePasswordReset).toHaveBeenCalledWith(dto.email);
      expect(result.success).toBe(true);
    });

    it('should reset password with token', async () => {
      const dto = { token: 'reset-token', password: 'NewPass@123' };

      passwordResetService.resetPassword.mockResolvedValue({
        success: true,
        message: 'Password reset',
      });

      const result = await controller.resetPassword(dto);

      expect(passwordResetService.resetPassword).toHaveBeenCalledWith(dto.token, dto.password);
      expect(result.success).toBe(true);
    });

    it('should verify reset token', async () => {
      passwordResetService.verifyResetToken.mockResolvedValue({
        valid: true,
        message: 'Token is valid',
      });

      const result = await controller.verifyResetToken('reset-token');

      expect(result.valid).toBe(true);
    });
  });

  describe('Email verification endpoints', () => {
    it('should verify email', async () => {
      const dto = { token: 'verification-token' };

      emailVerificationService.verifyEmail.mockResolvedValue({
        success: true,
        message: 'Email verified',
      });

      const result = await controller.verifyEmail(dto);

      expect(emailVerificationService.verifyEmail).toHaveBeenCalledWith(dto.token);
      expect(result.success).toBe(true);
    });

    it('should resend verification email', async () => {
      const dto = { email: 'test@example.com' };

      emailVerificationService.resendVerificationEmail.mockResolvedValue({
        success: true,
        message: 'Email sent',
      });

      const result = await controller.resendVerification(dto);

      expect(emailVerificationService.resendVerificationEmail).toHaveBeenCalledWith(dto.email);
      expect(result.success).toBe(true);
    });
  });
});
