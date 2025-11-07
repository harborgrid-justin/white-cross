import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { OAuthProfile } from '../dto/oauth.dto';

/**
 * Google OAuth2 Strategy
 * Handles Google OAuth authentication flow
 *
 * Configuration required in .env:
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 * - GOOGLE_CALLBACK_URL
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private readonly configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL =
      configService.get<string>('GOOGLE_CALLBACK_URL') ||
      'http://localhost:3001/api/auth/oauth/google/callback';

    // If Google OAuth is not configured, log warning and use dummy values
    if (!clientID || !clientSecret) {
      console.warn(
        'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable Google login.',
      );
    }

    super({
      clientID: clientID || 'dummy-client-id',
      clientSecret: clientSecret || 'dummy-client-secret',
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  /**
   * Validate Google OAuth profile
   * Called by Passport after successful Google authentication
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, emails, name, photos } = profile;

      const oauthProfile: OAuthProfile = {
        id,
        email: emails[0]?.value,
        firstName: name?.givenName,
        lastName: name?.familyName,
        displayName: profile.displayName,
        picture: photos[0]?.value,
        provider: 'google',
      };

      this.logger.log(
        `Google OAuth validation successful for: ${oauthProfile.email}`,
      );

      done(null, oauthProfile);
    } catch (error) {
      this.logger.error(`Google OAuth validation failed: ${error.message}`);
      done(error, false);
    }
  }
}
