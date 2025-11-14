/**
 * @fileoverview Waitlist Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { WaitlistService } from './waitlist.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('WaitlistService', () => {
  let service: WaitlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaitlistService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<WaitlistService>(WaitlistService);
  });

  it('should add to waitlist', async () => {
    const data = {
      studentId: 'student-1',
      type: 'CHECKUP' as const,
      reason: 'No slots available',
      priority: 'NORMAL' as const,
    };
    const result = await service.addToWaitlist(data);
    expect(result).toHaveProperty('entry');
  });

  it('should get waitlist', async () => {
    const result = await service.getWaitlist({});
    expect(result).toHaveProperty('waitlist');
    expect(Array.isArray(result.waitlist)).toBe(true);
  });

  it('should update waitlist priority', async () => {
    const result = await service.updateWaitlistPriority('entry-1', 'HIGH');
    expect(result).toHaveProperty('entry');
  });

  it('should remove from waitlist', async () => {
    const result = await service.removeFromWaitlist('entry-1', 'Scheduled');
    expect(result).toHaveProperty('entry');
  });
});
