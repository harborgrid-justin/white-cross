/**
 * SECURITY UPDATE: Enhanced bcrypt Configuration
 *
 * Salt rounds increased from 10 to 12 (configurable via BCRYPT_SALT_ROUNDS)
 * - Meets healthcare security requirements for PHI protection
 * - Configurable via environment variable for flexibility
 * - Includes startup validation to ensure proper configuration
 *
 * Environment Configuration:
 * BCRYPT_SALT_ROUNDS=12 (recommended for healthcare applications)
 */
import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserCreationAttributes, UserRole } from '@/database';
import { AuthChangePasswordDto, AuthResponseDto, LoginDto, RegisterDto } from './dto';
import { JwtPayload } from '@/auth/strategies';
import { TokenBlacklistService } from '@/auth/services';
import { SafeUser } from './types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds: number;
  private readonly accessTokenExpiry = '15m';
  private readonly refreshTokenExpiry = '7d';

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {
    // SECURITY UPDATE: Configurable salt rounds, default increased to 12 for healthcare security
    this.saltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS', '12'),
      10,
    );

    // Validate salt rounds on startup
    if (this.saltRounds < 10 || this.saltRounds > 14) {
      throw new Error(
        'SECURITY WARNING: bcrypt salt rounds must be between 10 and 14. ' +
          `Current value: ${this.saltRounds}. Recommended for healthcare: 12.`,
      );
    }
  }

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate email format
    if (!this.validateEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Validate password strength
    if (!this.validatePasswordStrength(password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
      );
    }

    try {
      // Create user (password will be hashed by beforeCreate hook)
      const user = await this.userModel.create({
        email,
        password,
        firstName,
        lastName,
        role: role || UserRole.NURSE,
      } as UserCreationAttributes);

      this.logger.log(`User registered successfully: ${email}`);

      // Generate tokens
      const tokens = await this.generateTokens(user);

      return {
        ...tokens,
        user: user.toSafeObject(),
        tokenType: 'Bearer',
        expiresIn: 900, // 15 minutes in seconds
      };
    } catch (error) {
      this.logger.error(
        `Failed to register user: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to register user');
    }
  }

  /**
   * Authenticate user with email and password
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      throw new UnauthorizedException(
        'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incrementFailedLoginAttempts();
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Reset failed login attempts and update last login
    await user.resetFailedLoginAttempts();

    this.logger.log(`User logged in successfully: ${email}`);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: user.toSafeObject(),
      tokenType: 'Bearer',
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  /**
   * Verify user by ID (for token verification)
   */
  async verifyUser(userId: string): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Verify JWT access token and return user
   */
  async verifyToken(token: string): Promise<SafeUser> {
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');

      if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
      }

      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: jwtSecret,
      });

      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.verifyUser(payload.sub);

      if (!user.isActive) {
        throw new UnauthorizedException('User account is inactive');
      }

      return user.toSafeObject();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      // Use separate refresh secret or fall back to JWT_SECRET
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        this.configService.get<string>('JWT_SECRET');

      if (!refreshSecret) {
        throw new Error('JWT secrets not configured');
      }

      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: refreshSecret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.verifyUser(payload.sub);

      if (!user.isActive) {
        throw new UnauthorizedException('User account is inactive');
      }

      const tokens = await this.generateTokens(user);

      return {
        ...tokens,
        user: user.toSafeObject(),
        tokenType: 'Bearer',
        expiresIn: 900,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    changePasswordDto: AuthChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Validate new password strength
    if (!this.validatePasswordStrength(newPassword)) {
      throw new BadRequestException(
        'New password must be at least 8 characters and include uppercase, lowercase, number, and special character',
      );
    }

    // Update password (will be hashed by beforeUpdate hook)
    user.password = newPassword;
    await user.save();

    // CRITICAL SECURITY: Invalidate all existing tokens after password change
    await this.tokenBlacklistService.blacklistAllUserTokens(userId);

    this.logger.log(
      `Password changed successfully for user: ${user.email} - All tokens invalidated`,
    );

    return {
      message:
        'Password changed successfully. All existing sessions have been terminated. Please login again.',
    };
  }

  /**
   * Reset user password (admin function)
   */
  async resetPassword(
    userId: string,
    newPassword: string,
    adminUserId?: string,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Validate new password strength
    if (!this.validatePasswordStrength(newPassword)) {
      throw new BadRequestException(
        'New password must be at least 8 characters and include uppercase, lowercase, number, and special character',
      );
    }

    // Update password (will be hashed by beforeUpdate hook)
    user.password = newPassword;
    user.mustChangePassword = true; // Force user to change password on next login
    await user.save();

    this.logger.log(
      `Password reset for user: ${user.email} by admin: ${adminUserId || 'system'}`,
    );

    return { message: 'Password reset successfully' };
  }

  /**
   * Get or create test user for development/testing
   */
  async getOrCreateTestUser(role: UserRole = UserRole.NURSE): Promise<User> {
    const testEmail = `test-${role.toLowerCase()}@whitecross.test`;

    let user = await this.userModel.findOne({ where: { email: testEmail } });

    if (!user) {
      user = await this.userModel.create({
        email: testEmail,
        password: 'test123',
        firstName: 'Test',
        lastName: role.charAt(0) + role.slice(1).toLowerCase(),
        role,
      } as UserCreationAttributes);

      this.logger.log(`Test user created: ${testEmail}`);
    }

    return user;
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): boolean {
    if (password.length < 8) {
      return false;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
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
      issuer: 'white-cross-healthcare',
      audience: 'white-cross-api',
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
      issuer: 'white-cross-healthcare',
      audience: 'white-cross-api',
    });

    return { accessToken, refreshToken };
  }

  /**
   * Hash password with bcrypt
   *
   * Salt rounds: Configurable (default 12 for healthcare)
   * - 10 rounds: Fast, acceptable for general use
   * - 12 rounds: Balanced, recommended for healthcare (PHI protection)
   * - 14 rounds: Very secure, slower (consider for admin accounts)
   *
   * @param password - Plaintext password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compare password with hash
   *
   * @param password - Plaintext password
   * @param hash - Stored hash
   * @returns True if password matches
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
