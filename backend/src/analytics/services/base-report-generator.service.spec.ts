import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BaseReportGeneratorService } from './base-report-generator.service';
import { AnalyticsReportType, AnalyticsTimePeriod } from '../types/analytics-report.types';

// Concrete implementation for testing abstract class
class TestReportGenerator extends BaseReportGeneratorService {
  constructor(eventEmitter: EventEmitter2, cacheManager: unknown) {
    super(eventEmitter, cacheManager as never, 'TestReportGenerator');
  }
}

describe('BaseReportGeneratorService', () => {
  let service: TestReportGenerator;
  let eventEmitter: EventEmitter2;
  let cacheManager: { get: jest.Mock; set: jest.Mock; del: jest.Mock };

  beforeEach(async () => {
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    eventEmitter = {
      emit: jest.fn(),
    } as unknown as EventEmitter2;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TestReportGenerator,
          useFactory: () => new TestReportGenerator(eventEmitter, cacheManager),
        },
        { provide: EventEmitter2, useValue: eventEmitter },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<TestReportGenerator>(TestReportGenerator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateReportId', () => {
    it('should generate unique report IDs', () => {
      const id1 = service['generateReportId']();
      const id2 = service['generateReportId']();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^report_\d+_[a-z0-9]+$/);
    });
  });

  describe('formatReport', () => {
    it('should format content as JSON', async () => {
      const content = { test: 'data' };
      const result = await service['formatReport'](content, 'JSON');
      expect(result).toBe(JSON.stringify(content, null, 2));
    });

    it('should format content as CSV', async () => {
      const content = { key: 'value', nested: { prop: 123 } };
      const result = await service['formatReport'](content, 'CSV');
      expect(result).toContain('key,value');
    });

    it('should format content as XML', async () => {
      const content = { root: 'value' };
      const result = await service['formatReport'](content, 'XML');
      expect(result).toContain('<root>value</root>');
    });

    it('should default to JSON for unknown formats', async () => {
      const content = { test: 'data' };
      const result = await service['formatReport'](content, 'UNKNOWN');
      expect(result).toBe(JSON.stringify(content, null, 2));
    });
  });

  describe('generateReportMetadata', () => {
    it('should generate correct metadata structure', () => {
      const metadata = service['generateReportMetadata'](
        'test-id',
        'school-123',
        AnalyticsReportType.HEALTH_OVERVIEW,
        AnalyticsTimePeriod.LAST_30_DAYS,
        { format: 'PDF' },
      );

      expect(metadata.id).toBe('test-id');
      expect(metadata.type).toBe(AnalyticsReportType.HEALTH_OVERVIEW);
      expect(metadata.format).toBe('PDF');
      expect(metadata.generatedAt).toBeInstanceOf(Date);
    });
  });

  describe('edge cases', () => {
    it('should handle empty objects in CSV conversion', async () => {
      const result = await service['formatReport']({}, 'CSV');
      expect(result).toBe('');
    });

    it('should handle arrays in XML conversion', async () => {
      const content = { items: [1, 2, 3] };
      const result = await service['formatReport'](content, 'XML');
      expect(result).toContain('<items>');
    });
  });
});
