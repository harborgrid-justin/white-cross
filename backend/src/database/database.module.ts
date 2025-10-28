/**
 * Database Module
 * Central module providing all database infrastructure services
 *
 * Provides:
 * - Sequelize ORM configuration
 * - Cache management (in-memory and Redis support)
 * - Audit logging (HIPAA-compliant)
 * - Repository pattern with enterprise features
 * - Unit of Work for transaction management
 * - Database types and utilities
 */

import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Services
import { CacheService } from './services/cache.service';
import { AuditService } from './services/audit.service';
import { SequelizeUnitOfWorkService } from './uow/sequelize-unit-of-work.service';

// Models
import { AuditLog } from './models/audit-log.model';

// Sample Repositories (add more as they are migrated)
import { StudentRepository } from './repositories/impl/student.repository';

/**
 * Database Module
 * Global module providing database infrastructure throughout the application
 */
@Global()
@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME', 'whitecross'),
        autoLoadModels: true,
        synchronize: false,
        logging: configService.get('NODE_ENV') === 'development' ? console.log : false,
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([
      // Register Sequelize models here as they are migrated
      AuditLog,
      // Example:
      // Student,
      // HealthRecord,
      // Allergy,
      // Medication,
      // etc.
    ])
  ],
  providers: [
    // Core Services with interface tokens
    {
      provide: 'ICacheManager',
      useClass: CacheService
    },
    {
      provide: 'IAuditLogger',
      useClass: AuditService
    },
    {
      provide: 'IUnitOfWork',
      useClass: SequelizeUnitOfWorkService
    },

    // Repository Implementations
    // Add repositories as they are migrated following this pattern:
    // StudentRepository,
    // HealthRecordRepository,
    // AllergyRepository,
    // MedicationRepository,
    // etc.
  ],
  exports: [
    // Export services for use in other modules
    'ICacheManager',
    'IAuditLogger',
    'IUnitOfWork',

    // Export repositories as they are added
    // StudentRepository,
    // HealthRecordRepository,
    // etc.
  ]
})
export class DatabaseModule {}
