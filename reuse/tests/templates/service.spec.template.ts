/**
 * Service Unit Test Template
 * Use this template for testing NestJS services
 */

import { Test, TestingModule } from '@nestjs/testing';
// import { YourService } from './your.service';
// import { YourRepository } from './your.repository';

describe('YourService', () => {
  let service: any; // Replace with YourService
  let repository: any; // Replace with YourRepository

  // Mock data
  const mockEntity = {
    id: '1',
    name: 'Test Entity',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock repository
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        // YourService,
        // {
        //   provide: getRepositoryToken(YourEntity),
        //   useValue: mockRepository,
        // },
      ],
    }).compile();

    // service = module.get<YourService>(YourService);
    // repository = module.get<Repository<YourEntity>>(getRepositoryToken(YourEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of entities', async () => {
      const entities = [mockEntity];
      mockRepository.find.mockResolvedValue(entities);

      // const result = await service.findAll();

      // expect(result).toEqual(entities);
      // expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no entities exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      // const result = await service.findAll();

      // expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return an entity when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockEntity);

      // const result = await service.findById('1');

      // expect(result).toEqual(mockEntity);
      // expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException when entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      // await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new entity', async () => {
      const createDto = {
        name: 'New Entity',
      };

      mockRepository.create.mockReturnValue(mockEntity);
      mockRepository.save.mockResolvedValue(mockEntity);

      // const result = await service.create(createDto);

      // expect(result).toEqual(mockEntity);
      // expect(repository.create).toHaveBeenCalledWith(createDto);
      // expect(repository.save).toHaveBeenCalledWith(mockEntity);
    });

    it('should handle validation errors', async () => {
      const invalidDto = {};

      // await expect(service.create(invalidDto)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update and return the entity', async () => {
      const updateDto = { name: 'Updated' };
      const updatedEntity = { ...mockEntity, ...updateDto };

      mockRepository.findOne.mockResolvedValue(mockEntity);
      mockRepository.save.mockResolvedValue(updatedEntity);

      // const result = await service.update('1', updateDto);

      // expect(result).toEqual(updatedEntity);
    });

    it('should throw NotFoundException when entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      // await expect(service.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an entity', async () => {
      mockRepository.findOne.mockResolvedValue(mockEntity);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      // await service.delete('1');

      // expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      // await expect(service.delete('999')).rejects.toThrow(NotFoundException);
    });
  });
});
