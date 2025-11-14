import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalProtocolQueryController } from './clinical-protocol-query.controller';
import { ClinicalProtocolService } from '../services/clinical-protocol.service';
import { ProtocolFiltersDto } from '../dto/protocol/protocol-filters.dto';

describe('ClinicalProtocolQueryController', () => {
  let controller: ClinicalProtocolQueryController;
  let protocolService: jest.Mocked<ClinicalProtocolService>;

  const mockProtocolService = {
    findAll: jest.fn(),
    getActiveProtocols: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalProtocolQueryController],
      providers: [
        {
          provide: ClinicalProtocolService,
          useValue: mockProtocolService,
        },
      ],
    }).compile();

    controller = module.get<ClinicalProtocolQueryController>(
      ClinicalProtocolQueryController,
    );
    protocolService = module.get(ClinicalProtocolService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should retrieve all protocols with filters', async () => {
      const filters: ProtocolFiltersDto = {
        category: 'emergency',
        status: 'active',
        page: 1,
        limit: 20,
      };

      const mockResponse = {
        data: [
          {
            id: 'protocol-1',
            name: 'Emergency Protocol',
            category: 'emergency',
            status: 'active',
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      protocolService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filters);

      expect(result).toEqual(mockResponse);
      expect(protocolService.findAll).toHaveBeenCalledWith(filters);
      expect(protocolService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should retrieve protocols with search filter', async () => {
      const filters: ProtocolFiltersDto = {
        search: 'cardiac',
      };

      const mockResponse = {
        data: [
          {
            id: 'protocol-2',
            name: 'Cardiac Protocol',
            description: 'Cardiac emergency procedures',
          },
        ],
        total: 1,
      };

      protocolService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filters);

      expect(result).toEqual(mockResponse);
      expect(protocolService.findAll).toHaveBeenCalledWith(filters);
    });

    it('should retrieve protocols filtered by creator', async () => {
      const filters: ProtocolFiltersDto = {
        createdBy: 'user-123',
      };

      const mockResponse = {
        data: [
          {
            id: 'protocol-3',
            name: 'Custom Protocol',
            createdBy: 'user-123',
          },
        ],
        total: 1,
      };

      protocolService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filters);

      expect(result).toEqual(mockResponse);
      expect(protocolService.findAll).toHaveBeenCalledWith(filters);
    });

    it('should handle empty filters', async () => {
      const filters: ProtocolFiltersDto = {};

      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
      };

      protocolService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filters);

      expect(result).toEqual(mockResponse);
      expect(protocolService.findAll).toHaveBeenCalledWith(filters);
    });

    it('should handle service errors', async () => {
      const filters: ProtocolFiltersDto = { category: 'invalid' };
      const error = new Error('Database connection failed');

      protocolService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(filters)).rejects.toThrow(
        'Database connection failed',
      );
      expect(protocolService.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('getActive', () => {
    it('should retrieve all active protocols', async () => {
      const mockResponse = {
        data: [
          {
            id: 'protocol-1',
            name: 'Active Protocol 1',
            status: 'active',
          },
          {
            id: 'protocol-2',
            name: 'Active Protocol 2',
            status: 'active',
          },
        ],
        total: 2,
      };

      protocolService.getActiveProtocols.mockResolvedValue(mockResponse);

      const result = await controller.getActive();

      expect(result).toEqual(mockResponse);
      expect(protocolService.getActiveProtocols).toHaveBeenCalledTimes(1);
      expect(protocolService.getActiveProtocols).toHaveBeenCalledWith();
    });

    it('should return empty array when no active protocols', async () => {
      const mockResponse = {
        data: [],
        total: 0,
      };

      protocolService.getActiveProtocols.mockResolvedValue(mockResponse);

      const result = await controller.getActive();

      expect(result).toEqual(mockResponse);
      expect(protocolService.getActiveProtocols).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors when fetching active protocols', async () => {
      const error = new Error('Failed to fetch active protocols');

      protocolService.getActiveProtocols.mockRejectedValue(error);

      await expect(controller.getActive()).rejects.toThrow(
        'Failed to fetch active protocols',
      );
    });
  });

  describe('findOne', () => {
    it('should retrieve a protocol by id', async () => {
      const protocolId = 'protocol-123';
      const mockProtocol = {
        id: protocolId,
        name: 'Test Protocol',
        category: 'general',
        status: 'active',
        description: 'Test description',
        steps: [
          { order: 1, description: 'Step 1' },
          { order: 2, description: 'Step 2' },
        ],
      };

      protocolService.findOne.mockResolvedValue(mockProtocol);

      const result = await controller.findOne(protocolId);

      expect(result).toEqual(mockProtocol);
      expect(protocolService.findOne).toHaveBeenCalledWith(protocolId);
      expect(protocolService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle protocol not found', async () => {
      const protocolId = 'non-existent';
      const error = new Error('Protocol not found');

      protocolService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(protocolId)).rejects.toThrow(
        'Protocol not found',
      );
      expect(protocolService.findOne).toHaveBeenCalledWith(protocolId);
    });

    it('should handle invalid protocol id format', async () => {
      const invalidId = '';
      const error = new Error('Invalid protocol id');

      protocolService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(invalidId)).rejects.toThrow(
        'Invalid protocol id',
      );
    });

    it('should retrieve protocol with all details', async () => {
      const protocolId = 'protocol-456';
      const mockProtocol = {
        id: protocolId,
        name: 'Complex Protocol',
        category: 'emergency',
        status: 'active',
        description: 'Detailed protocol',
        steps: [],
        createdBy: 'user-123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      protocolService.findOne.mockResolvedValue(mockProtocol);

      const result = await controller.findOne(protocolId);

      expect(result).toEqual(mockProtocol);
      expect(result.createdBy).toBe('user-123');
      expect(protocolService.findOne).toHaveBeenCalledWith(protocolId);
    });
  });
});
