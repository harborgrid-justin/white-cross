/**
 * User Module Barrel Export
 * Provides centralized exports for the user management module
 */

// Module
export { UserModule } from './user.module';

// Service
export { UserService } from './user.service';

// Controller
export { UserController } from './user.controller';

// Entity
export { User } from '@/database/models';

// DTOs
export * from './dto';
