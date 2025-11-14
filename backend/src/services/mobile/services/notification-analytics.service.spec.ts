import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { NotificationAnalyticsService } from './notification-analytics.service';
import { PushNotification } from '@/database/models/push-notification.model';
import { NotificationCategory, NotificationStatus } from '../enums';

describe('NotificationAnalyticsService', () => {
  let service: NotificationAnalyticsService;
  let notificationModel: jest.Mocked<typeof PushNotification>;

  const mockNotificationModel = {
    findOne: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationAnalyticsService,
        {
          provide: getModelToken(PushNotification),
          useValue: mockNotificationModel,
        },
      ],
    }).compile();

    service = module.get<NotificationAnalyticsService>(NotificationAnalyticsService);
    notificationModel = module.get(getModelToken(PushNotification));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('trackInteraction', () => {
    it('should track clicked interaction', async () => {
      const notificationId = 'notif-123';
      const mockNotification = {
        id: notificationId,
        clickedCount: 0,
        dismissedCount: 0,
        save: jest.fn().mockResolvedValue(true),
      };

      mockNotificationModel.findOne.mockResolvedValue(mockNotification as never);

      await service.trackInteraction(notificationId, 'CLICKED');

      expect(mockNotification.clickedCount).toBe(1);
      expect(mockNotification.save).toHaveBeenCalled();
    });

    it('should track dismissed interaction', async () => {
      const notificationId = 'notif-123';
      const mockNotification = {
        id: notificationId,
        clickedCount: 0,
        dismissedCount: 0,
        save: jest.fn().mockResolvedValue(true),
      };

      mockNotificationModel.findOne.mockResolvedValue(mockNotification as never);

      await service.trackInteraction(notificationId, 'DISMISSED');

      expect(mockNotification.dismissedCount).toBe(1);
      expect(mockNotification.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if notification not found', async () => {
      const notificationId = 'non-existent';

      mockNotificationModel.findOne.mockResolvedValue(null);

      await expect(
        service.trackInteraction(notificationId, 'CLICKED'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.trackInteraction(notificationId, 'CLICKED'),
      ).rejects.toThrow('Notification not found');
    });

    it('should increment click count multiple times', async () => {
      const notificationId = 'notif-123';
      const mockNotification = {
        id: notificationId,
        clickedCount: 5,
        dismissedCount: 0,
        save: jest.fn().mockResolvedValue(true),
      };

      mockNotificationModel.findOne.mockResolvedValue(mockNotification as never);

      await service.trackInteraction(notificationId, 'CLICKED');

      expect(mockNotification.clickedCount).toBe(6);
    });

    it('should handle both click and dismiss on same notification', async () => {
      const notificationId = 'notif-123';
      const mockNotification = {
        id: notificationId,
        clickedCount: 1,
        dismissedCount: 0,
        save: jest.fn().mockResolvedValue(true),
      };

      mockNotificationModel.findOne.mockResolvedValue(mockNotification as never);

      await service.trackInteraction(notificationId, 'DISMISSED');

      expect(mockNotification.dismissedCount).toBe(1);
      expect(mockNotification.clickedCount).toBe(1);
    });
  });

  describe('getAnalytics', () => {
    it('should calculate analytics for a period', async () => {
      const period = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-31'),
      };

      const mockNotifications = [
        {
          status: NotificationStatus.DELIVERED,
          clickedCount: 1,
          dismissedCount: 0,
        },
        {
          status: NotificationStatus.DELIVERED,
          clickedCount: 0,
          dismissedCount: 1,
        },
        {
          status: NotificationStatus.FAILED,
          clickedCount: 0,
          dismissedCount: 0,
        },
      ];

      mockNotificationModel.findAll.mockResolvedValue(mockNotifications as never);

      const result = await service.getAnalytics(period);

      expect(result).toEqual({
        period,
        totalSent: 3,
        totalDelivered: 2,
        totalFailed: 1,
        totalClicked: 1,
        totalDismissed: 1,
        deliveryRate: 66.67,
        clickRate: 50.00,
        dismissalRate: 50.00,
      });
    });

    it('should handle period with no notifications', async () => {
      const period = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-31'),
      };

      mockNotificationModel.findAll.mockResolvedValue([]);

      const result = await service.getAnalytics(period);

      expect(result.totalSent).toBe(0);
      expect(result.deliveryRate).toBe(0);
      expect(result.clickRate).toBe(0);
    });

    it('should calculate 100% delivery rate when all delivered', async () => {
      const period = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-31'),
      };

      const mockNotifications = [
        {
          status: NotificationStatus.DELIVERED,
          clickedCount: 1,
          dismissedCount: 0,
        },
        {
          status: NotificationStatus.DELIVERED,
          clickedCount: 1,
          dismissedCount: 0,
        },
      ];

      mockNotificationModel.findAll.mockResolvedValue(mockNotifications as never);

      const result = await service.getAnalytics(period);

      expect(result.deliveryRate).toBe(100.00);
    });

    it('should sum clicked counts correctly', async () => {
      const period = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-31'),
      };

      const mockNotifications = [
        {
          status: NotificationStatus.DELIVERED,
          clickedCount: 3,
          dismissedCount: 0,
        },
        {
          status: NotificationStatus.DELIVERED,
          clickedCount: 2,
          dismissedCount: 0,
        },
      ];

      mockNotificationModel.findAll.mockResolvedValue(mockNotifications as never);

      const result = await service.getAnalytics(period);

      expect(result.totalClicked).toBe(5);
    });
  });

  describe('getNotificationHistory', () => {
    it('should retrieve notification history for a user', async () => {
      const userId = 'user-123';
      const mockHistory = [
        { id: 'notif-1', userIds: ['user-123'], category: NotificationCategory.MEDICATION },
        { id: 'notif-2', userIds: ['user-123'], category: NotificationCategory.APPOINTMENT },
      ];

      mockNotificationModel.findAll.mockResolvedValue(mockHistory as never);

      const result = await service.getNotificationHistory(userId);

      expect(result).toEqual(mockHistory);
      expect(result).toHaveLength(2);
    });

    it('should filter by status', async () => {
      const userId = 'user-123';
      const options = { status: NotificationStatus.DELIVERED };

      mockNotificationModel.findAll.mockResolvedValue([]);

      await service.getNotificationHistory(userId, options);

      expect(mockNotificationModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: NotificationStatus.DELIVERED,
          }),
        }),
      );
    });

    it('should filter by category', async () => {
      const userId = 'user-123';
      const options = { category: NotificationCategory.MEDICATION };

      mockNotificationModel.findAll.mockResolvedValue([]);

      await service.getNotificationHistory(userId, options);

      expect(mockNotificationModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: NotificationCategory.MEDICATION,
          }),
        }),
      );
    });

    it('should apply limit and offset', async () => {
      const userId = 'user-123';
      const options = { limit: 10, offset: 20 };

      mockNotificationModel.findAll.mockResolvedValue([]);

      await service.getNotificationHistory(userId, options);

      expect(mockNotificationModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 20,
        }),
      );
    });

    it('should order by createdAt descending', async () => {
      const userId = 'user-123';

      mockNotificationModel.findAll.mockResolvedValue([]);

      await service.getNotificationHistory(userId);

      expect(mockNotificationModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [['createdAt', 'DESC']],
        }),
      );
    });
  });

  describe('getUserNotificationStats', () => {
    it('should calculate user statistics', async () => {
      const userId = 'user-123';
      const mockNotifications = [
        {
          userIds: ['user-123'],
          status: NotificationStatus.DELIVERED,
          category: NotificationCategory.MEDICATION,
          priority: 'HIGH',
          clickedCount: 1,
          dismissedCount: 0,
        },
        {
          userIds: ['user-123'],
          status: NotificationStatus.DELIVERED,
          category: NotificationCategory.APPOINTMENT,
          priority: 'NORMAL',
          clickedCount: 0,
          dismissedCount: 1,
        },
      ];

      mockNotificationModel.findAll.mockResolvedValue(mockNotifications as never);

      const result = await service.getUserNotificationStats(userId);

      expect(result).toEqual({
        total: 2,
        delivered: 2,
        clicked: 1,
        dismissed: 1,
        byCategory: {
          [NotificationCategory.MEDICATION]: 1,
          [NotificationCategory.APPOINTMENT]: 1,
        },
        byPriority: {
          HIGH: 1,
          NORMAL: 1,
        },
      });
    });

    it('should filter by period when provided', async () => {
      const userId = 'user-123';
      const period = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-31'),
      };

      mockNotificationModel.findAll.mockResolvedValue([]);

      await service.getUserNotificationStats(userId, period);

      expect(mockNotificationModel.findAll).toHaveBeenCalledWith({
        where: expect.objectContaining({
          createdAt: expect.any(Object),
        }),
      });
    });

    it('should handle user with no notifications', async () => {
      const userId = 'user-456';

      mockNotificationModel.findAll.mockResolvedValue([]);

      const result = await service.getUserNotificationStats(userId);

      expect(result.total).toBe(0);
      expect(result.delivered).toBe(0);
      expect(result.byCategory).toEqual({});
    });
  });

  describe('getCategoryAnalytics', () => {
    it('should calculate analytics by category', async () => {
      const period = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-31'),
      };

      const mockNotifications = [
        {
          category: NotificationCategory.MEDICATION,
          status: NotificationStatus.DELIVERED,
          clickedCount: 2,
        },
        {
          category: NotificationCategory.MEDICATION,
          status: NotificationStatus.DELIVERED,
          clickedCount: 1,
        },
        {
          category: NotificationCategory.APPOINTMENT,
          status: NotificationStatus.FAILED,
          clickedCount: 0,
        },
      ];

      mockNotificationModel.findAll.mockResolvedValue(mockNotifications as never);

      const result = await service.getCategoryAnalytics(period);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        category: NotificationCategory.MEDICATION,
        count: 2,
        delivered: 2,
        clicked: 3,
        deliveryRate: 100.00,
        clickRate: 150.00,
      });
    });

    it('should handle period with no notifications', async () => {
      const period = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-31'),
      };

      mockNotificationModel.findAll.mockResolvedValue([]);

      const result = await service.getCategoryAnalytics(period);

      expect(result).toEqual([]);
    });
  });

  describe('getEngagementTrends', () => {
    it('should calculate daily engagement trends', async () => {
      const period = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-03'),
      };

      const mockNotifications = [
        {
          createdAt: new Date('2025-01-01'),
          status: NotificationStatus.DELIVERED,
          clickedCount: 1,
          dismissedCount: 0,
        },
        {
          createdAt: new Date('2025-01-02'),
          status: NotificationStatus.DELIVERED,
          clickedCount: 2,
          dismissedCount: 1,
        },
      ];

      mockNotificationModel.findAll.mockResolvedValue(mockNotifications as never);

      const result = await service.getEngagementTrends(period, 'day');

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('sent');
      expect(result[0]).toHaveProperty('delivered');
    });

    it('should group by week', async () => {
      const period = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-31'),
      };

      mockNotificationModel.findAll.mockResolvedValue([]);

      const result = await service.getEngagementTrends(period, 'week');

      expect(result).toBeInstanceOf(Array);
    });

    it('should group by month', async () => {
      const period = {
        start: new Date('2025-01-01'),
        end: new Date('2025-12-31'),
      };

      mockNotificationModel.findAll.mockResolvedValue([]);

      const result = await service.getEngagementTrends(period, 'month');

      expect(result).toBeInstanceOf(Array);
    });

    it('should sort results by date', async () => {
      const period = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-05'),
      };

      const mockNotifications = [
        {
          createdAt: new Date('2025-01-03'),
          status: NotificationStatus.DELIVERED,
          clickedCount: 0,
          dismissedCount: 0,
        },
        {
          createdAt: new Date('2025-01-01'),
          status: NotificationStatus.DELIVERED,
          clickedCount: 0,
          dismissedCount: 0,
        },
      ];

      mockNotificationModel.findAll.mockResolvedValue(mockNotifications as never);

      const result = await service.getEngagementTrends(period, 'day');

      for (let i = 1; i < result.length; i++) {
        expect(result[i].date >= result[i - 1].date).toBe(true);
      }
    });
  });
});
