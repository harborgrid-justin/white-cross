import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../database/models/user.model';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    // CRITICAL SECURITY: Fail fast if JWT_SECRET is not configured
    if (!jwtSecret) {
      throw new Error(
        'CRITICAL SECURITY ERROR: JWT_SECRET is not configured in JWT Strategy',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      issuer: 'white-cross-healthcare',
      audience: 'white-cross-api',
    });
  }

  async validate(payload: JwtPayload) {
    const { sub, type } = payload;

    // Ensure this is an access token
    if (type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Find user in database
    const user = await this.userModel.findByPk(sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      throw new UnauthorizedException(
        'Account is temporarily locked. Please try again later.',
      );
    }

    // Check if password was changed after token was issued
    if (payload.iat && user.passwordChangedAfter(payload.iat)) {
      throw new UnauthorizedException(
        'Password was changed. Please login again.',
      );
    }

    // Return user object (will be attached to request.user)
    return user.toSafeObject();
  }
}
