/**
 * Authentication Module Barrel Export
 * Provides centralized exports for the authentication module
 */

// Module
export { AuthModule } from './auth.module';

// Service
export { AuthService } from './auth.service';
export { TokenBlacklistService } from '@/services/token-blacklist.service';

// Controller
export { AuthController } from './auth.controller';

// Guards
export { JwtAuthGuard } from './guards/jwt-auth.guard';
export { RolesGuard } from './guards/roles.guard';

// Strategies
export { JwtStrategy } from './strategies/jwt.strategy';
export type { JwtPayload } from './strategies/jwt.strategy';

// DTOs
export * from './dto';

// Decorators
export { Public } from './decorators/public.decorator';
export { Roles } from './decorators/roles.decorator';
