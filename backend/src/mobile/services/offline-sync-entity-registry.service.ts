import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SyncEntityType } from '../enums';
import { IEntitySyncService } from './offline-sync-types.interface';

/**
 * Entity Registry Service
 * Manages registration and retrieval of entity services for sync operations
 *
 * @description
 * This service maintains a registry of entity services that implement the
 * IEntitySyncService interface. Each entity type (STUDENT, TEACHER, etc.)
 * needs a corresponding service registered here for sync operations to work.
 *
 * @example
 * ```typescript
 * entityRegistry.registerEntityService(SyncEntityType.STUDENT, studentService);
 * const service = entityRegistry.getEntityService(SyncEntityType.STUDENT);
 * ```
 */
@Injectable()
export class OfflineSyncEntityRegistryService {
  private readonly logger = new Logger(OfflineSyncEntityRegistryService.name);
  private readonly entityServiceRegistry: Map<
    SyncEntityType,
    IEntitySyncService
  > = new Map();

  /**
   * Register an entity service for sync operations
   *
   * @param entityType - The entity type to register
   * @param service - The service implementing IEntitySyncService
   *
   * @example
   * ```typescript
   * entityRegistry.registerEntityService(SyncEntityType.STUDENT, studentService);
   * ```
   */
  registerEntityService(
    entityType: SyncEntityType,
    service: IEntitySyncService,
  ): void {
    this.entityServiceRegistry.set(entityType, service);
    this.logger.log(`Registered entity service for ${entityType}`);
  }

  /**
   * Get the entity service for a given entity type
   *
   * @param entityType - The entity type
   * @returns The entity service
   * @throws NotFoundException if service not registered
   */
  getEntityService(entityType: SyncEntityType): IEntitySyncService {
    const service = this.entityServiceRegistry.get(entityType);
    if (!service) {
      throw new NotFoundException(
        `No entity service registered for ${entityType}. ` +
          `Please register the service using registerEntityService()`,
      );
    }
    return service;
  }

  /**
   * Check if an entity service is registered
   *
   * @param entityType - The entity type to check
   * @returns True if registered, false otherwise
   */
  hasEntityService(entityType: SyncEntityType): boolean {
    return this.entityServiceRegistry.has(entityType);
  }

  /**
   * Get all registered entity types
   *
   * @returns Array of registered entity types
   */
  getRegisteredEntityTypes(): SyncEntityType[] {
    return Array.from(this.entityServiceRegistry.keys());
  }

  /**
   * Clear all registered entity services
   * Mainly for testing purposes
   */
  clearRegistry(): void {
    this.entityServiceRegistry.clear();
    this.logger.log('Entity service registry cleared');
  }
}
