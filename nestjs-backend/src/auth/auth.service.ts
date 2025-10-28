import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../database/models/user.model';
import { RegisterDto, LoginDto, ChangePasswordDto, AuthResponseDto } from './dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 10;
  private readonly accessTokenExpiry = '15m';
  private readonly refreshTokenExpiry = '7d';

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
      } as any);

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
      this.logger.error(`Failed to register user: ${error.message}`, error.stack);
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
  async verifyToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'default-secret-change-in-production',
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
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') ||
                this.configService.get<string>('JWT_SECRET') ||
                'default-secret-change-in-production',
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
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
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

    this.logger.log(`Password changed successfully for user: ${user.email}`);

    return { message: 'Password changed successfully' };
  }

  /**
   * Reset user password (admin function)
   */
  async resetPassword(userId: string, newPassword: string, adminUserId?: string): Promise<{ message: string }> {
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

    this.logger.log(`Password reset for user: ${user.email} by admin: ${adminUserId || 'system'}`);

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
      } as any);

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
  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'default-secret-change-in-production',
      expiresIn: this.accessTokenExpiry,
    });

    const refreshPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'refresh',
    };

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') ||
              this.configService.get<string>('JWT_SECRET') ||
              'default-secret-change-in-production',
      expiresIn: this.refreshTokenExpiry,
    });

    return { accessToken, refreshToken };
  }
}
