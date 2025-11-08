import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { ConfigService } from '@nestjs/config';
import { OAuthProfile } from '../dto/oauth.dto';
import { MicrosoftPassportProfile, OAuthDoneCallback } from '../types/auth.types';

/**
 * Microsoft OAuth2 Strategy
 * Handles Microsoft OAuth authentication flow (Azure AD, Microsoft 365)
 *
 * Configuration required in .env:
 * - MICROSOFT_CLIENT_ID
 * - MICROSOFT_CLIENT_SECRET
 * - MICROSOFT_CALLBACK_URL
 */
@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  private readonly logger = new Logger(MicrosoftStrategy.name);

  constructor(private readonly configService: ConfigService) {
    const clientID = configService.get<string>('MICROSOFT_CLIENT_ID');
    const clientSecret = configService.get<string>('MICROSOFT_CLIENT_SECRET');
    const callbackURL =
      configService.get<string>('MICROSOFT_CALLBACK_URL') ||
      'http://localhost:3001/api/auth/oauth/microsoft/callback';

    // If Microsoft OAuth is not configured, log warning and use dummy values
    if (!clientID || !clientSecret) {
      console.warn(
        'Microsoft OAuth not configured. Set MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET in .env to enable Microsoft login.',
      );
    }

    super({
      clientID: clientID || 'dummy-client-id',
      clientSecret: clientSecret || 'dummy-client-secret',
      callbackURL,
      scope: ['user.read'],
      tenant: 'common', // Allows both personal and organizational accounts
    });
  }

  /**
   * Validate Microsoft OAuth profile
   * Called by Passport after successful Microsoft authentication
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: MicrosoftPassportProfile,
    done: OAuthDoneCallback,
  ): Promise<void> {
    try {
      const { id, emails, name, photos } = profile;

      const oauthProfile: OAuthProfile = {
        id,
        email: emails?.[0]?.value || profile.userPrincipalName || '',
        firstName: name?.givenName,
        lastName: name?.familyName,
        displayName: profile.displayName,
        picture: photos?.[0]?.value,
        provider: 'microsoft',
      };

      this.logger.log(
        `Microsoft OAuth validation successful for: ${oauthProfile.email}`,
      );

      done(null, oauthProfile);
    } catch (error) {
      this.logger.error(`Microsoft OAuth validation failed: ${(error as Error).message}`);
      done(error as Error, undefined);
    }
  }
}
