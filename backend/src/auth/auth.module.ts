import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy, JwtStrategy, MicrosoftStrategy } from '@/auth/strategies';
import { User } from '@/database';
import { JwtAuthGuard, RolesGuard } from '@/auth/guards';
import {
  EmailVerificationService,
  MfaService,
  OAuthService,
  PasswordResetService,
  TokenBlacklistService,
} from '@/auth/services';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        // CRITICAL SECURITY: Fail fast if JWT_SECRET is not configured
        if (!jwtSecret) {
          throw new Error(
            'CRITICAL SECURITY ERROR: JWT_SECRET is not configured. ' +
              'Application cannot start without proper JWT secret configuration. ' +
              'Please set JWT_SECRET in your .env file to a strong, random secret.',
          );
        }

        // Ensure secret is strong enough (minimum 32 characters)
        if (jwtSecret.length < 32) {
          throw new Error(
            'CRITICAL SECURITY ERROR: JWT_SECRET must be at least 32 characters long. ' +
              'Current length: ' +
              jwtSecret.length,
          );
        }

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: '15m',
            issuer: 'white-cross-healthcare',
            audience: 'white-cross-api',
          },
        };
      },
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    MicrosoftStrategy,
    JwtAuthGuard,
    RolesGuard,
    TokenBlacklistService,
    MfaService,
    OAuthService,
    PasswordResetService,
    EmailVerificationService,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    RolesGuard,
    PassportModule,
    JwtModule,
    TokenBlacklistService,
    MfaService,
    OAuthService,
    PasswordResetService,
    EmailVerificationService,
  ],
})
export class AuthModule {}
