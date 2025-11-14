/**
 * @fileoverview Waitlist Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { WaitlistController } from './waitlist.controller';
import { AppointmentService } from '../appointment.service';

describe('WaitlistController', () => {
  let controller: WaitlistController;
  let service: jest.Mocked<AppointmentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitlistController],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            addToWaitlist: jest.fn(),
            getWaitlist: jest.fn(),
            updateWaitlistPriority: jest.fn(),
            removeFromWaitlist: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WaitlistController>(WaitlistController);
    service = module.get(AppointmentService);
  });

  it('should add to waitlist', async () => {
    service.addToWaitlist.mockResolvedValue({ entry: { id: 'w1' } });
    const result = await controller.addToWaitlist({ studentId: 's1', type: 'CHECKUP' as const, reason: 'Full' });
    expect(result).toHaveProperty('entry');
  });

  it('should get waitlist', async () => {
    service.getWaitlist.mockResolvedValue({ waitlist: [] });
    const result = await controller.getWaitlist({});
    expect(result).toHaveProperty('waitlist');
  });
});
