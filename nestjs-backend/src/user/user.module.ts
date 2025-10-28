/**
 * User Module
 * Provides user management functionality
 *
 * Exports:
 * - UserService: For use in other modules (authentication, authorization, etc.)
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    // Register User entity with Sequelize
    SequelizeModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    UserService, // Export for use in other modules (auth, audit, etc.)
    SequelizeModule, // Export Sequelize models for relationships
  ],
})
export class UserModule {}
