import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { DecodedToken } from '../types/auth.types';
import { User, UserCreationAttributes, UserRole   } from "../../database/models";
import { JwtService } from '@nestjs/jwt';
import { OAuthProfile } from '../dto/oauth.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { JwtPayload } from '../strategies/jwt.strategy';

import { BaseService } from '@/common/base';
@Injectable()
export class OAuthService extends BaseService {
  private readonly accessTokenExpiry = '15m';
  private readonly refreshTokenExpiry = '7d';

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Handle OAuth login/registration
   * Creates user if doesn't exist, otherwise logs in existing user
   */
  async handleOAuthLogin(profile: OAuthProfile): Promise<AuthResponseDto> {
    // Find or create user
    let user = await this.userModel.findOne({
      where: { email: profile.email },
    });

    if (!user) {
      // Create new user from OAuth profile
      user = await this.createUserFromOAuthProfile(profile);
      this.logInfo(
        `New user created via ${profile.provider} OAuth: ${profile.email}`,
      );
    } else {
      // Update existing user's last login
      await user.resetFailedLoginAttempts();
      this.logInfo(
        `Existing user logged in via ${profile.provider} OAuth: ${profile.email}`,
      );
    }

    // Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      throw new UnauthorizedException(
        'Account is temporarily locked. Please try again later.',
      );
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: user.toSafeObject(),
      tokenType: 'Bearer',
      expiresIn: 900, // 15 minutes
    };
  }

  /**
   * Verify Google OAuth token
   * In production, this would verify the token with Google's token verification endpoint
   */
  async verifyGoogleToken(idToken: string): Promise<OAuthProfile> {
    try {
      // In production, verify with Google:
      // https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={idToken}

      // For now, decode the JWT (in production, use proper Google verification)
      const payload = this.decodeJwt(idToken);

      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
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
    } catch (error) {
      this.logError(`Google token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid Google authentication');
    }
  }

  /**
   * Verify Microsoft OAuth token
   * In production, this would verify the token with Microsoft's token verification endpoint
   */
  async verifyMicrosoftToken(idToken: string): Promise<OAuthProfile> {
    try {
      // In production, verify with Microsoft:
      // https://graph.microsoft.com/v1.0/me

      // For now, decode the JWT (in production, use proper Microsoft verification)
      const payload = this.decodeJwt(idToken);

      if (!payload) {
        throw new UnauthorizedException('Invalid Microsoft token');
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
    } catch (error) {
      this.logError(
        `Microsoft token verification failed: ${error.message}`,
      );
      throw new UnauthorizedException('Invalid Microsoft authentication');
    }
  }

  /**
   * Create user from OAuth profile
   */
  private async createUserFromOAuthProfile(
    profile: OAuthProfile,
  ): Promise<User> {
    // Generate random password for OAuth users
    const randomPassword = this.generateRandomPassword();

    const user = await this.userModel.create({
      email: profile.email,
      password: randomPassword,
      firstName:
        profile.firstName || profile.displayName?.split(' ')[0] || 'User',
      lastName:
        profile.lastName ||
        profile.displayName?.split(' ').slice(1).join(' ') ||
        '',
      role: UserRole.ADMIN, // Default role, can be changed by admin
      isEmailVerified: true, // OAuth emails are pre-verified
      oauthProvider: profile.provider,
      oauthProviderId: profile.id,
      profilePictureUrl: profile.picture,
    } as UserCreationAttributes);

    return user;
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || jwtSecret;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: this.accessTokenExpiry,
    });

    const refreshPayload: JwtPayload = {
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

  /**
   * Decode JWT without verification (for development)
   * In production, always use proper token verification
   */
  private decodeJwt(token: string): DecodedToken | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
      return JSON.parse(payload) as DecodedToken;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate random secure password
   */
  private generateRandomPassword(): string {
    const crypto = require('crypto');
    const length = 32;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
    let password = '';

    // Ensure at least one of each required character type
    password += 'A'; // uppercase
    password += 'a'; // lowercase
    password += '1'; // number
    password += '@'; // special char

    // Fill rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[crypto.randomInt(0, charset.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
}
