/**
 * Authentication Configuration
 * Type-safe JWT and authentication configuration for White Cross platform
 */

import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  jwt: {
    secret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
    issuer: string;
    audience: string;
    algorithm: 'HS256' | 'HS384' | 'HS512';
  };
  session: {
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    cookie: {
      secure: boolean;
      httpOnly: boolean;
      maxAge: number;
      sameSite: 'strict' | 'lax' | 'none';
    };
  };
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number; // days
  };
  lockout: {
    enabled: boolean;
    maxAttempts: number;
    lockoutDuration: number; // minutes
  };
}

export default registerAs('auth', (): AuthConfig => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    jwt: {
      secret: process.env.JWT_SECRET as string,
      refreshSecret: process.env.JWT_REFRESH_SECRET as string,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      issuer: 'white-cross-healthcare',
      audience: 'white-cross-api',
      algorithm: 'HS256',
    },
    session: {
      secret: process.env.JWT_SECRET as string, // Reuse JWT secret for sessions
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict',
      },
    },
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90, // 90 days
    },
    lockout: {
      enabled: true,
      maxAttempts: 5,
      lockoutDuration: 30, // 30 minutes
    },
  };
});
