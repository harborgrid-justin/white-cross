import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OfflineSyncEntityRegistryService } from './offline-sync-entity-registry.service';
import { SyncEntityType } from '../enums';
import { IEntitySyncService } from './offline-sync-types.interface';

describe('OfflineSyncEntityRegistryService', () => {
  let service: OfflineSyncEntityRegistryService;
  let mockEntityService: jest.Mocked<IEntitySyncService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfflineSyncEntityRegistryService],
    }).compile();

    service = module.get<OfflineSyncEntityRegistryService>(OfflineSyncEntityRegistryService);

    mockEntityService = {
      getEntitiesModifiedSince: jest.fn(),
      getEntityByKey: jest.fn(),
      applyChanges: jest.fn(),
    } as jest.Mocked<IEntitySyncService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerEntityService', () => {
    it('should register an entity service', () => {
      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);

      const registered = service.getEntityService(SyncEntityType.STUDENT);
      expect(registered).toBe(mockEntityService);
    });

    it('should register multiple entity services', () => {
      const teacherService = { ...mockEntityService };

      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);
      service.registerEntityService(SyncEntityType.TEACHER, teacherService);

      expect(service.getEntityService(SyncEntityType.STUDENT)).toBe(mockEntityService);
      expect(service.getEntityService(SyncEntityType.TEACHER)).toBe(teacherService);
    });

    it('should overwrite existing registration', () => {
      const newService = { ...mockEntityService };

      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);
      service.registerEntityService(SyncEntityType.STUDENT, newService);

      const registered = service.getEntityService(SyncEntityType.STUDENT);
      expect(registered).toBe(newService);
      expect(registered).not.toBe(mockEntityService);
    });

    it('should register all entity types', () => {
      const entityTypes = [
        SyncEntityType.STUDENT,
        SyncEntityType.TEACHER,
        SyncEntityType.VISIT,
        SyncEntityType.MEDICATION,
      ];

      entityTypes.forEach((type) => {
        service.registerEntityService(type, mockEntityService);
      });

      entityTypes.forEach((type) => {
        expect(service.hasEntityService(type)).toBe(true);
      });
    });
  });

  describe('getEntityService', () => {
    it('should retrieve a registered entity service', () => {
      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);

      const retrieved = service.getEntityService(SyncEntityType.STUDENT);

      expect(retrieved).toBe(mockEntityService);
    });

    it('should throw NotFoundException for unregistered entity type', () => {
      expect(() => service.getEntityService(SyncEntityType.STUDENT)).toThrow(
        NotFoundException,
      );
    });

    it('should include helpful error message', () => {
      expect(() => service.getEntityService(SyncEntityType.TEACHER)).toThrow(
        `No entity service registered for ${SyncEntityType.TEACHER}`,
      );
      expect(() => service.getEntityService(SyncEntityType.TEACHER)).toThrow(
        'Please register the service using registerEntityService()',
      );
    });

    it('should handle case-sensitive entity types', () => {
      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);

      expect(() => service.getEntityService('student' as SyncEntityType)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('hasEntityService', () => {
    it('should return true for registered entity type', () => {
      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);

      const hasService = service.hasEntityService(SyncEntityType.STUDENT);

      expect(hasService).toBe(true);
    });

    it('should return false for unregistered entity type', () => {
      const hasService = service.hasEntityService(SyncEntityType.TEACHER);

      expect(hasService).toBe(false);
    });

    it('should return false after clearing registry', () => {
      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);
      service.clearRegistry();

      const hasService = service.hasEntityService(SyncEntityType.STUDENT);

      expect(hasService).toBe(false);
    });

    it('should handle multiple checks', () => {
      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);

      expect(service.hasEntityService(SyncEntityType.STUDENT)).toBe(true);
      expect(service.hasEntityService(SyncEntityType.TEACHER)).toBe(false);
      expect(service.hasEntityService(SyncEntityType.VISIT)).toBe(false);
    });
  });

  describe('getRegisteredEntityTypes', () => {
    it('should return all registered entity types', () => {
      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);
      service.registerEntityService(SyncEntityType.TEACHER, mockEntityService);

      const registered = service.getRegisteredEntityTypes();

      expect(registered).toContain(SyncEntityType.STUDENT);
      expect(registered).toContain(SyncEntityType.TEACHER);
      expect(registered).toHaveLength(2);
    });

    it('should return empty array when no services registered', () => {
      const registered = service.getRegisteredEntityTypes();

      expect(registered).toEqual([]);
      expect(registered).toHaveLength(0);
    });

    it('should return updated list after registration', () => {
      const initialTypes = service.getRegisteredEntityTypes();
      expect(initialTypes).toHaveLength(0);

      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);

      const updatedTypes = service.getRegisteredEntityTypes();
      expect(updatedTypes).toHaveLength(1);
      expect(updatedTypes).toContain(SyncEntityType.STUDENT);
    });

    it('should not return duplicates', () => {
      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);
      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);

      const registered = service.getRegisteredEntityTypes();

      expect(registered).toHaveLength(1);
      expect(registered.filter((t) => t === SyncEntityType.STUDENT)).toHaveLength(1);
    });

    it('should maintain registration order', () => {
      const types = [
        SyncEntityType.STUDENT,
        SyncEntityType.TEACHER,
        SyncEntityType.VISIT,
      ];

      types.forEach((type) => {
        service.registerEntityService(type, mockEntityService);
      });

      const registered = service.getRegisteredEntityTypes();

      expect(registered).toHaveLength(3);
      types.forEach((type) => {
        expect(registered).toContain(type);
      });
    });
  });

  describe('clearRegistry', () => {
    it('should clear all registered services', () => {
      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);
      service.registerEntityService(SyncEntityType.TEACHER, mockEntityService);

      service.clearRegistry();

      const registered = service.getRegisteredEntityTypes();
      expect(registered).toEqual([]);
    });

    it('should allow re-registration after clearing', () => {
      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);
      service.clearRegistry();
      service.registerEntityService(SyncEntityType.TEACHER, mockEntityService);

      expect(service.hasEntityService(SyncEntityType.STUDENT)).toBe(false);
      expect(service.hasEntityService(SyncEntityType.TEACHER)).toBe(true);
    });

    it('should not throw when clearing empty registry', () => {
      expect(() => service.clearRegistry()).not.toThrow();

      const registered = service.getRegisteredEntityTypes();
      expect(registered).toEqual([]);
    });

    it('should handle multiple clear calls', () => {
      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);
      service.clearRegistry();
      service.clearRegistry();

      expect(service.getRegisteredEntityTypes()).toHaveLength(0);
    });
  });

  describe('integration scenarios', () => {
    it('should support complete registration lifecycle', () => {
      expect(service.hasEntityService(SyncEntityType.STUDENT)).toBe(false);

      service.registerEntityService(SyncEntityType.STUDENT, mockEntityService);
      expect(service.hasEntityService(SyncEntityType.STUDENT)).toBe(true);

      const retrieved = service.getEntityService(SyncEntityType.STUDENT);
      expect(retrieved).toBe(mockEntityService);

      service.clearRegistry();
      expect(service.hasEntityService(SyncEntityType.STUDENT)).toBe(false);
    });

    it('should handle multiple entity types independently', () => {
      const studentService = { ...mockEntityService };
      const teacherService = { ...mockEntityService };

      service.registerEntityService(SyncEntityType.STUDENT, studentService);
      service.registerEntityService(SyncEntityType.TEACHER, teacherService);

      expect(service.getEntityService(SyncEntityType.STUDENT)).toBe(studentService);
      expect(service.getEntityService(SyncEntityType.TEACHER)).toBe(teacherService);
      expect(service.getRegisteredEntityTypes()).toHaveLength(2);
    });

    it('should validate service contract', () => {
      const invalidService = {} as IEntitySyncService;

      service.registerEntityService(SyncEntityType.STUDENT, invalidService);

      const retrieved = service.getEntityService(SyncEntityType.STUDENT);
      expect(retrieved).toBe(invalidService);
    });
  });
});
