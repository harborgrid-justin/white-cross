/**
 * JWT Strategy for Passport
 * Validates JWT tokens and extracts user information
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
  type: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'development-secret-key',
      issuer: 'white-cross-platform',
      audience: 'white-cross-api',
    });
  }

  /**
   * Validates JWT payload and returns user object
   * @param payload JWT payload
   * @returns User object for request
   */
  async validate(payload: JwtPayload) {
    // Verify token type
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    // In production, you would:
    // 1. Query database to verify user still exists and is active
    // 2. Check if token was issued before last password change
    // 3. Verify user permissions haven't been revoked

    // For now, we'll use the payload data
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions,
    };
  }
}

export default JwtStrategy;
