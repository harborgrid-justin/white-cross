import { Test, TestingModule } from '@nestjs/testing';
import { BulkMessagingController } from './bulk-messaging.controller';
import { BulkMessagingService } from '../bulk-messaging.service';
import { BulkMessageResponseDto, SendBulkMessageDto } from '../dto';

describe('BulkMessagingController', () => {
  let controller: BulkMessagingController;
  let service: jest.Mocked<BulkMessagingService>;

  const mockBulkMessagingService = {
    sendBulkMessage: jest.fn(),
    getDeliveryStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulkMessagingController],
      providers: [
        {
          provide: BulkMessagingService,
          useValue: mockBulkMessagingService,
        },
      ],
    }).compile();

    controller = module.get<BulkMessagingController>(BulkMessagingController);
    service = module.get(BulkMessagingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendBulkMessage', () => {
    it('should send bulk message via multiple channels', async () => {
      const dto: SendBulkMessageDto = {
        subject: 'Important School Notification',
        body: 'Please review the updated health policy',
        recipients: ['parent-1', 'parent-2', 'parent-3'],
        channels: ['EMAIL', 'SMS'],
      };

      const expectedResult: Partial<BulkMessageResponseDto> = {
        messageId: 'bulk-msg-123',
        totalRecipients: 3,
        queued: 3,
        channels: dto.channels,
      };

      mockBulkMessagingService.sendBulkMessage.mockResolvedValue(expectedResult);

      const result = await controller.sendBulkMessage(dto);

      expect(service.sendBulkMessage).toHaveBeenCalledWith(
        dto.subject,
        dto.body,
        dto.recipients,
        dto.channels,
      );
      expect(result.totalRecipients).toBe(3);
    });

    it('should handle empty recipient list', async () => {
      const dto: SendBulkMessageDto = {
        subject: 'Test Message',
        body: 'Body',
        recipients: [],
        channels: ['EMAIL'],
      };

      mockBulkMessagingService.sendBulkMessage.mockRejectedValue(
        new Error('Recipient list cannot be empty'),
      );

      await expect(controller.sendBulkMessage(dto)).rejects.toThrow(
        'Recipient list cannot be empty',
      );
    });
  });

  describe('trackDelivery', () => {
    it('should retrieve delivery statistics', async () => {
      const messageId = 'bulk-msg-123';
      const expectedStats = {
        messageId,
        totalRecipients: 100,
        delivered: 95,
        failed: 3,
        pending: 2,
        deliveryRate: 95,
      };

      mockBulkMessagingService.getDeliveryStats.mockResolvedValue(expectedStats);

      const result = await controller.trackDelivery(messageId);

      expect(service.getDeliveryStats).toHaveBeenCalledWith(messageId);
      expect(result.deliveryRate).toBe(95);
    });
  });
});
