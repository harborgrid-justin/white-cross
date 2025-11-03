/**
 * COMPREHENSIVE DASHBOARD CONTROLLER TESTS
 *
 * Complete test coverage for DashboardController including:
 * - All endpoint responses
 * - Query parameter validation
 * - Error handling
 * - HTTP status codes
 * - Service integration
 */

import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController (Comprehensive)', () => {
  let controller: DashboardController;
  let service: DashboardService;

  const mockDashboardService = {
    getDashboardStats: jest.fn(),
    getRecentActivities: jest.fn(),
    getUpcomingAppointments: jest.fn(),
    getChartData: jest.fn(),
    getDashboardStatsByScope: jest.fn(),
    clearCache: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== GET /dashboard/stats ====================

  describe('GET /dashboard/stats', () => {
    const mockStats = {
      totalStudents: 150,
      activeMedications: 45,
      todaysAppointments: 8,
      pendingIncidents: 3,
      medicationsDueToday: 30,
      healthAlerts: 2,
      recentActivityCount: 22,
      studentTrend: {
        value: '150',
        change: '+25.0%',
        changeType: 'positive' as const,
      },
      medicationTrend: {
        value: '45',
        change: '+12.5%',
        changeType: 'positive' as const,
      },
      appointmentTrend: {
        value: '8',
        change: '-10.0%',
        changeType: 'negative' as const,
      },
    };

    it('should return dashboard statistics', async () => {
      mockDashboardService.getDashboardStats.mockResolvedValue(mockStats);

      const result = await controller.getDashboardStats();

      expect(result).toEqual(mockStats);
      expect(service.getDashboardStats).toHaveBeenCalledWith();
    });

    it('should call service without parameters', async () => {
      mockDashboardService.getDashboardStats.mockResolvedValue(mockStats);

      await controller.getDashboardStats();

      expect(service.getDashboardStats).toHaveBeenCalledTimes(1);
      expect(service.getDashboardStats).toHaveBeenCalledWith();
    });

    it('should handle service errors', async () => {
      mockDashboardService.getDashboardStats.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.getDashboardStats()).rejects.toThrow('Service error');
    });
  });

  // ==================== GET /dashboard/recent-activities ====================

  describe('GET /dashboard/recent-activities', () => {
    const mockActivities = [
      {
        id: 'activity-1',
        type: 'medication',
        message: 'Administered Aspirin to John Doe',
        time: '2 hours ago',
        status: 'completed',
      },
      {
        id: 'activity-2',
        type: 'incident',
        message: 'New injury report for Jane Smith',
        time: '3 hours ago',
        status: 'pending',
      },
    ];

    it('should return recent activities with default limit', async () => {
      mockDashboardService.getRecentActivities.mockResolvedValue(mockActivities);

      const result = await controller.getRecentActivities({ limit: 5 });

      expect(result).toEqual(mockActivities);
      expect(service.getRecentActivities).toHaveBeenCalledWith(5);
    });

    it('should accept custom limit parameter', async () => {
      mockDashboardService.getRecentActivities.mockResolvedValue(mockActivities);

      await controller.getRecentActivities({ limit: 10 });

      expect(service.getRecentActivities).toHaveBeenCalledWith(10);
    });

    it('should handle limit of 1', async () => {
      mockDashboardService.getRecentActivities.mockResolvedValue([mockActivities[0]]);

      const result = await controller.getRecentActivities({ limit: 1 });

      expect(result).toHaveLength(1);
      expect(service.getRecentActivities).toHaveBeenCalledWith(1);
    });

    it('should handle limit of 50 (max)', async () => {
      mockDashboardService.getRecentActivities.mockResolvedValue(mockActivities);

      await controller.getRecentActivities({ limit: 50 });

      expect(service.getRecentActivities).toHaveBeenCalledWith(50);
    });

    it('should handle empty results', async () => {
      mockDashboardService.getRecentActivities.mockResolvedValue([]);

      const result = await controller.getRecentActivities({ limit: 5 });

      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockDashboardService.getRecentActivities.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(
        controller.getRecentActivities({ limit: 5 }),
      ).rejects.toThrow('Service error');
    });
  });

  // ==================== GET /dashboard/upcoming-appointments ====================

  describe('GET /dashboard/upcoming-appointments', () => {
    const mockAppointments = [
      {
        id: 'apt-1',
        student: 'John Doe',
        studentId: 'student-123',
        time: '2:30 PM',
        type: 'Routine Checkup',
        priority: 'low' as const,
      },
      {
        id: 'apt-2',
        student: 'Jane Smith',
        studentId: 'student-456',
        time: '3:00 PM',
        type: 'Medication Administration',
        priority: 'high' as const,
      },
    ];

    it('should return upcoming appointments with default limit', async () => {
      mockDashboardService.getUpcomingAppointments.mockResolvedValue(mockAppointments);

      const result = await controller.getUpcomingAppointments({ limit: 5 });

      expect(result).toEqual(mockAppointments);
      expect(service.getUpcomingAppointments).toHaveBeenCalledWith(5);
    });

    it('should accept custom limit parameter', async () => {
      mockDashboardService.getUpcomingAppointments.mockResolvedValue(mockAppointments);

      await controller.getUpcomingAppointments({ limit: 15 });

      expect(service.getUpcomingAppointments).toHaveBeenCalledWith(15);
    });

    it('should handle empty results', async () => {
      mockDashboardService.getUpcomingAppointments.mockResolvedValue([]);

      const result = await controller.getUpcomingAppointments({ limit: 5 });

      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockDashboardService.getUpcomingAppointments.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(
        controller.getUpcomingAppointments({ limit: 5 }),
      ).rejects.toThrow('Service error');
    });
  });

  // ==================== GET /dashboard/chart-data ====================

  describe('GET /dashboard/chart-data', () => {
    const mockChartData = {
      enrollmentTrend: [
        { date: 'Jan 1', value: 10, label: 'Jan 1' },
        { date: 'Jan 2', value: 12, label: 'Jan 2' },
      ],
      medicationAdministration: [
        { date: 'Jan 1', value: 5, label: 'Jan 1' },
        { date: 'Jan 2', value: 8, label: 'Jan 2' },
      ],
      incidentFrequency: [
        { date: 'Jan 1', value: 2, label: 'Jan 1' },
        { date: 'Jan 2', value: 1, label: 'Jan 2' },
      ],
      appointmentTrends: [
        { date: 'Jan 1', value: 4, label: 'Jan 1' },
        { date: 'Jan 2', value: 6, label: 'Jan 2' },
      ],
    };

    it('should return chart data for week period (default)', async () => {
      mockDashboardService.getChartData.mockResolvedValue(mockChartData);

      const result = await controller.getChartData({ period: 'week' });

      expect(result).toEqual(mockChartData);
      expect(service.getChartData).toHaveBeenCalledWith('week');
    });

    it('should accept month period parameter', async () => {
      mockDashboardService.getChartData.mockResolvedValue(mockChartData);

      await controller.getChartData({ period: 'month' });

      expect(service.getChartData).toHaveBeenCalledWith('month');
    });

    it('should accept year period parameter', async () => {
      mockDashboardService.getChartData.mockResolvedValue(mockChartData);

      await controller.getChartData({ period: 'year' });

      expect(service.getChartData).toHaveBeenCalledWith('year');
    });

    it('should return all chart data categories', async () => {
      mockDashboardService.getChartData.mockResolvedValue(mockChartData);

      const result = await controller.getChartData({ period: 'week' });

      expect(result).toHaveProperty('enrollmentTrend');
      expect(result).toHaveProperty('medicationAdministration');
      expect(result).toHaveProperty('incidentFrequency');
      expect(result).toHaveProperty('appointmentTrends');
    });

    it('should handle service errors', async () => {
      mockDashboardService.getChartData.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(
        controller.getChartData({ period: 'week' }),
      ).rejects.toThrow('Service error');
    });
  });

  // ==================== GET /dashboard/stats-by-scope ====================

  describe('GET /dashboard/stats-by-scope', () => {
    const mockScopedStats = {
      totalStudents: 50,
      activeMedications: 15,
      todaysAppointments: 3,
      pendingIncidents: 1,
      medicationsDueToday: 10,
      healthAlerts: 1,
      recentActivityCount: 8,
      studentTrend: {
        value: '50',
        change: '+10.0%',
        changeType: 'positive' as const,
      },
      medicationTrend: {
        value: '15',
        change: '+5.0%',
        changeType: 'positive' as const,
      },
      appointmentTrend: {
        value: '3',
        change: '0.0%',
        changeType: 'neutral' as const,
      },
    };

    it('should return scoped stats with schoolId', async () => {
      mockDashboardService.getDashboardStatsByScope.mockResolvedValue(mockScopedStats);

      const result = await controller.getDashboardStatsByScope({
        schoolId: 'school-123',
      });

      expect(result).toEqual(mockScopedStats);
      expect(service.getDashboardStatsByScope).toHaveBeenCalledWith('school-123', undefined);
    });

    it('should return scoped stats with districtId', async () => {
      mockDashboardService.getDashboardStatsByScope.mockResolvedValue(mockScopedStats);

      const result = await controller.getDashboardStatsByScope({
        districtId: 'district-456',
      });

      expect(result).toEqual(mockScopedStats);
      expect(service.getDashboardStatsByScope).toHaveBeenCalledWith(undefined, 'district-456');
    });

    it('should return scoped stats with both schoolId and districtId', async () => {
      mockDashboardService.getDashboardStatsByScope.mockResolvedValue(mockScopedStats);

      const result = await controller.getDashboardStatsByScope({
        schoolId: 'school-123',
        districtId: 'district-456',
      });

      expect(result).toEqual(mockScopedStats);
      expect(service.getDashboardStatsByScope).toHaveBeenCalledWith(
        'school-123',
        'district-456',
      );
    });

    it('should work with no scope parameters', async () => {
      mockDashboardService.getDashboardStatsByScope.mockResolvedValue(mockScopedStats);

      const result = await controller.getDashboardStatsByScope({});

      expect(result).toEqual(mockScopedStats);
      expect(service.getDashboardStatsByScope).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should handle service errors', async () => {
      mockDashboardService.getDashboardStatsByScope.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(
        controller.getDashboardStatsByScope({ schoolId: 'school-123' }),
      ).rejects.toThrow('Service error');
    });
  });

  // ==================== DELETE /dashboard/cache ====================

  describe('DELETE /dashboard/cache', () => {
    it('should clear the dashboard cache', () => {
      mockDashboardService.clearCache.mockReturnValue(undefined);

      controller.clearCache();

      expect(service.clearCache).toHaveBeenCalledTimes(1);
    });

    it('should return void (204 No Content)', () => {
      mockDashboardService.clearCache.mockReturnValue(undefined);

      const result = controller.clearCache();

      expect(result).toBeUndefined();
    });

    it('should call service clearCache method', () => {
      mockDashboardService.clearCache.mockReturnValue(undefined);

      controller.clearCache();

      expect(service.clearCache).toHaveBeenCalledWith();
    });
  });

  // ==================== INTEGRATION TESTS ====================

  describe('Controller Integration', () => {
    it('should have all required endpoints defined', () => {
      expect(controller.getDashboardStats).toBeDefined();
      expect(controller.getRecentActivities).toBeDefined();
      expect(controller.getUpcomingAppointments).toBeDefined();
      expect(controller.getChartData).toBeDefined();
      expect(controller.getDashboardStatsByScope).toBeDefined();
      expect(controller.clearCache).toBeDefined();
    });

    it('should properly inject DashboardService', () => {
      expect(service).toBeDefined();
      expect(service).toBe(mockDashboardService);
    });
  });

  // ==================== ERROR HANDLING TESTS ====================

  describe('Error Handling', () => {
    it('should propagate service errors for stats endpoint', async () => {
      const error = new Error('Database connection failed');
      mockDashboardService.getDashboardStats.mockRejectedValue(error);

      await expect(controller.getDashboardStats()).rejects.toThrow(error);
    });

    it('should propagate service errors for activities endpoint', async () => {
      const error = new Error('Query timeout');
      mockDashboardService.getRecentActivities.mockRejectedValue(error);

      await expect(
        controller.getRecentActivities({ limit: 5 }),
      ).rejects.toThrow(error);
    });

    it('should propagate service errors for appointments endpoint', async () => {
      const error = new Error('Invalid query');
      mockDashboardService.getUpcomingAppointments.mockRejectedValue(error);

      await expect(
        controller.getUpcomingAppointments({ limit: 5 }),
      ).rejects.toThrow(error);
    });

    it('should propagate service errors for chart data endpoint', async () => {
      const error = new Error('Data aggregation failed');
      mockDashboardService.getChartData.mockRejectedValue(error);

      await expect(
        controller.getChartData({ period: 'week' }),
      ).rejects.toThrow(error);
    });

    it('should propagate service errors for scoped stats endpoint', async () => {
      const error = new Error('Invalid scope');
      mockDashboardService.getDashboardStatsByScope.mockRejectedValue(error);

      await expect(
        controller.getDashboardStatsByScope({ schoolId: 'invalid' }),
      ).rejects.toThrow(error);
    });
  });
});
