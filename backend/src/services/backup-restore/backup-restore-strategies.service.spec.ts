/**
 * @fileoverview Backup Restore Strategies Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BackupRestoreStrategiesService } from './backup-restore-strategies.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('BackupRestoreStrategiesService', () => {
  let service: BackupRestoreStrategiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackupRestoreStrategiesService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<BackupRestoreStrategiesService>(BackupRestoreStrategiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
