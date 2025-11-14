import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { User, UserRole } from '@/database/models';
import { OAuthProfile } from '../dto/oauth.dto';

describe('OAuthService', () => {
  let service: OAuthService;
  let userModel: {
    findOne: jest.Mock;
    create: jest.Mock;
  };
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.ADMIN,
    isActive: true,
    isAccountLocked: jest.fn(),
    resetFailedLoginAttempts: jest.fn(),
    toSafeObject: jest.fn(),
  };

  beforeEach(async () => {
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        {
          provide: getModelToken(User),
          useValue: userModel,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<OAuthService>(OAuthService);

    configService.get.mockImplementation((key: string) => {
      if (key === 'JWT_SECRET') return 'test-secret';
      if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
      return undefined;
    });

    jest.clearAllMocks();
  });

  describe('handleOAuthLogin', () => {
    const profile: OAuthProfile = {
      id: 'google-123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User',
      provider: 'google',
    };

    it('should create new user for new OAuth login', async () => {
      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(mockUser as never);
      mockUser.isAccountLocked.mockReturnValue(false);
      mockUser.toSafeObject.mockReturnValue({ id: mockUser.id, email: mockUser.email });
      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await service.handleOAuthLogin(profile);

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: profile.email } });
      expect(userModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          role: UserRole.ADMIN,
          isEmailVerified: true,
          oauthProvider: profile.provider,
          oauthProviderId: profile.id,
        })
      );
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: expect.any(Object),
        tokenType: 'Bearer',
        expiresIn: 900,
      });
    });

    it('should login existing user', async () => {
      userModel.findOne.mockResolvedValue(mockUser as never);
      mockUser.isAccountLocked.mockReturnValue(false);
      mockUser.toSafeObject.mockReturnValue({ id: mockUser.id, email: mockUser.email });
      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await service.handleOAuthLogin(profile);

      expect(userModel.findOne).toHaveBeenCalled();
      expect(userModel.create).not.toHaveBeenCalled();
      expect(mockUser.resetFailedLoginAttempts).toHaveBeenCalled();
      expect(result.accessToken).toBe('access-token');
    });

    it('should throw UnauthorizedException for inactive account', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      userModel.findOne.mockResolvedValue(inactiveUser as never);
      mockUser.isAccountLocked.mockReturnValue(false);

      await expect(service.handleOAuthLogin(profile)).rejects.toThrow(UnauthorizedException);
      await expect(service.handleOAuthLogin(profile)).rejects.toThrow('Account is inactive');
    });

    it('should throw UnauthorizedException for locked account', async () => {
      userModel.findOne.mockResolvedValue(mockUser as never);
      mockUser.isAccountLocked.mockReturnValue(true);

      await expect(service.handleOAuthLogin(profile)).rejects.toThrow(UnauthorizedException);
      await expect(service.handleOAuthLogin(profile)).rejects.toThrow(
        'Account is temporarily locked'
      );
    });
  });

  describe('verifyGoogleToken', () => {
    it('should verify Google token successfully', async () => {
      const idToken = 'header.' + Buffer.from(JSON.stringify({
        sub: 'google-123',
        email: 'test@google.com',
        given_name: 'Test',
        family_name: 'User',
        name: 'Test User',
        picture: 'https://example.com/photo.jpg',
      })).toString('base64') + '.signature';

      const result = await service.verifyGoogleToken(idToken);

      expect(result).toEqual({
        id: 'google-123',
        email: 'test@google.com',
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User',
        picture: 'https://example.com/photo.jpg',
        provider: 'google',
      });
    });

    it('should handle invalid Google token', async () => {
      const invalidToken = 'invalid-token';

      await expect(service.verifyGoogleToken(invalidToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.verifyGoogleToken(invalidToken)).rejects.toThrow('Invalid Google authentication');
    });

    it('should handle missing token payload', async () => {
      const tokenWithoutPayload = 'header..signature';

      await expect(service.verifyGoogleToken(tokenWithoutPayload)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyMicrosoftToken', () => {
    it('should verify Microsoft token successfully', async () => {
      const idToken = 'header.' + Buffer.from(JSON.stringify({
        oid: 'microsoft-123',
        email: 'test@microsoft.com',
        given_name: 'Test',
        family_name: 'User',
        name: 'Test User',
      })).toString('base64') + '.signature';

      const result = await service.verifyMicrosoftToken(idToken);

      expect(result).toEqual({
        id: 'microsoft-123',
        email: 'test@microsoft.com',
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User',
        picture: undefined,
        provider: 'microsoft',
      });
    });

    it('should handle preferred_username as email', async () => {
      const idToken = 'header.' + Buffer.from(JSON.stringify({
        oid: 'microsoft-123',
        preferred_username: 'test@outlook.com',
        given_name: 'Test',
        family_name: 'User',
        name: 'Test User',
      })).toString('base64') + '.signature';

      const result = await service.verifyMicrosoftToken(idToken);

      expect(result.email).toBe('test@outlook.com');
    });

    it('should handle invalid Microsoft token', async () => {
      const invalidToken = 'invalid-token';

      await expect(service.verifyMicrosoftToken(invalidToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.verifyMicrosoftToken(invalidToken)).rejects.toThrow('Invalid Microsoft authentication');
    });
  });

  describe('createUserFromOAuthProfile', () => {
    it('should create user with complete profile', async () => {
      const profile: OAuthProfile = {
        id: 'oauth-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User',
        picture: 'https://example.com/pic.jpg',
        provider: 'google',
      };

      userModel.create.mockResolvedValue(mockUser as never);

      await service['createUserFromOAuthProfile'](profile);

      expect(userModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          role: UserRole.ADMIN,
          isEmailVerified: true,
          oauthProvider: profile.provider,
          oauthProviderId: profile.id,
          profilePictureUrl: profile.picture,
        })
      );
    });

    it('should handle missing firstName and lastName', async () => {
      const profile: OAuthProfile = {
        id: 'oauth-123',
        email: 'test@example.com',
        displayName: 'Test User Name',
        provider: 'google',
      };

      userModel.create.mockResolvedValue(mockUser as never);

      await service['createUserFromOAuthProfile'](profile);

      expect(userModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Test',
          lastName: 'User Name',
        })
      );
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await service['generateTokens'](mockUser as never);

      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(jwtService.sign).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          sub: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          type: 'access',
        }),
        expect.objectContaining({
          secret: 'test-secret',
          expiresIn: '15m',
        })
      );
      expect(jwtService.sign).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          sub: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          type: 'refresh',
        }),
        expect.objectContaining({
          secret: 'test-refresh-secret',
          expiresIn: '7d',
        })
      );
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw error if JWT_SECRET not configured', async () => {
      configService.get.mockReturnValue(undefined);

      await expect(service['generateTokens'](mockUser as never)).rejects.toThrow('JWT_SECRET not configured');
    });
  });

  describe('generateRandomPassword', () => {
    it('should generate secure random password', () => {
      const password = service['generateRandomPassword']();

      expect(password.length).toBe(32);
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[a-z]/.test(password)).toBe(true);
      expect(/[0-9]/.test(password)).toBe(true);
      expect(/[@$!%*?&]/.test(password)).toBe(true);
    });

    it('should generate different passwords on multiple calls', () => {
      const password1 = service['generateRandomPassword']();
      const password2 = service['generateRandomPassword']();
      const password3 = service['generateRandomPassword']();

      expect(password1).not.toBe(password2);
      expect(password2).not.toBe(password3);
      expect(password1).not.toBe(password3);
    });
  });
});
