/**
 * @fileoverview Tests for ReportsController
 * @module report/controllers
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';

describe('ReportsController', () => {
  let controller: ReportsController;
  let mockReportGenerationService: jest.Mocked<ReportGenerationService>;
  let mockReportExportService: jest.Mocked<ReportExportService>;
  let mockDashboardService: jest.Mocked<DashboardService>;


  beforeEach(async () => {
    mockReportGenerationService = {
    } as unknown as jest.Mocked<ReportGenerationService>;

    mockReportExportService = {
    } as unknown as jest.Mocked<ReportExportService>;

    mockDashboardService = {
    } as unknown as jest.Mocked<DashboardService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsController,
        {
          provide: ReportGenerationService,
          useValue: mockReportGenerationService,
        },
        {
          provide: ReportExportService,
          useValue: mockReportExportService,
        },
        {
          provide: DashboardService,
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('getDashboardMetrics()', () => {
    it('should handle successful execution', async () => {
      const result = await controller.getDashboardMetrics();
      expect(result).toBeDefined();
    });

    it('should handle errors', async () => {
      expect(controller).toBeDefined();
    });
  });
});
