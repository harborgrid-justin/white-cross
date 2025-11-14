import { Test, TestingModule } from '@nestjs/testing';
import { CustomReportsController } from './custom-reports.controller';
import { CustomReportBuilderService } from '../custom-report-builder.service';
import { CreateReportDefinitionDto, ReportDefinitionResponseDto } from '../dto';

describe('CustomReportsController', () => {
  let controller: CustomReportsController;
  let service: jest.Mocked<CustomReportBuilderService>;

  const mockReportBuilderService = {
    createReport: jest.fn(),
    executeReport: jest.fn(),
    exportReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomReportsController],
      providers: [
        {
          provide: CustomReportBuilderService,
          useValue: mockReportBuilderService,
        },
      ],
    }).compile();

    controller = module.get<CustomReportsController>(CustomReportsController);
    service = module.get(CustomReportBuilderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createReportDefinition', () => {
    it('should create report definition', async () => {
      const dto: CreateReportDefinitionDto = {
        name: 'Monthly Health Summary',
        dataSource: 'HEALTH_RECORDS',
        fields: ['studentName', 'visitDate', 'diagnosis'],
        filters: { dateFrom: '2025-01-01', dateTo: '2025-01-31' },
        grouping: ['diagnosis'],
        sorting: ['visitDate DESC'],
        visualization: 'TABLE',
        schedule: 'MONTHLY',
      };

      const expectedResult: Partial<ReportDefinitionResponseDto> = {
        id: 'report-123',
        name: dto.name,
        dataSource: dto.dataSource,
      };

      mockReportBuilderService.createReport.mockResolvedValue(expectedResult);

      const result = await controller.createReportDefinition(dto);

      expect(service.createReport).toHaveBeenCalledWith({
        name: dto.name,
        dataSource: dto.dataSource,
        fields: dto.fields,
        filters: dto.filters,
        grouping: dto.grouping,
        sorting: dto.sorting,
        visualization: dto.visualization,
        schedule: dto.schedule,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('executeReport', () => {
    it('should execute report and return results', async () => {
      const reportId = 'report-123';
      const expectedResult = {
        reportId,
        data: [
          { studentName: 'John Doe', visitDate: '2025-01-15', diagnosis: 'Flu' },
        ],
        rowCount: 1,
      };

      mockReportBuilderService.executeReport.mockResolvedValue(expectedResult);

      const result = await controller.executeReport(reportId);

      expect(service.executeReport).toHaveBeenCalledWith(reportId);
      expect(result.rowCount).toBe(1);
    });
  });

  describe('exportReport', () => {
    it('should export report to PDF', async () => {
      const reportId = 'report-123';
      const format = 'pdf';

      const expectedResult = {
        reportId,
        format,
        data: 'base64-encoded-pdf',
        filename: 'report-123.pdf',
      };

      mockReportBuilderService.exportReport.mockResolvedValue(expectedResult);

      const result = await controller.exportReport(reportId, format);

      expect(service.exportReport).toHaveBeenCalledWith(reportId, format);
      expect(result.format).toBe('pdf');
    });

    it('should export report to Excel', async () => {
      const reportId = 'report-123';
      const format = 'excel';

      mockReportBuilderService.exportReport.mockResolvedValue({
        reportId,
        format,
        data: 'base64-encoded-excel',
        filename: 'report-123.xlsx',
      });

      const result = await controller.exportReport(reportId, format);

      expect(result.format).toBe('excel');
    });

    it('should export report to CSV', async () => {
      const reportId = 'report-123';
      const format = 'csv';

      mockReportBuilderService.exportReport.mockResolvedValue({
        reportId,
        format,
        data: 'csv-data',
        filename: 'report-123.csv',
      });

      const result = await controller.exportReport(reportId, format);

      expect(result.format).toBe('csv');
    });
  });
});
