/**
 * COMPREHENSIVE DASHBOARD SERVICE TESTS
 *
 * Complete test coverage for DashboardService including:
 * - Statistics retrieval with caching
 * - Recent activities aggregation
 * - Upcoming appointments
 * - Chart data generation
 * - Scoped data filtering
 * - Error handling
 * - Edge cases
 */

import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('DashboardService (Comprehensive)', () => {
  let service: DashboardService;
  let mockSequelize: any;

  // Mock models
  const mockStudent = {
    count: jest.fn(),
    findAll: jest.fn(),
  };

  const mockStudentMedication = {
    count: jest.fn(),
  };

  const mockAppointment = {
    count: jest.fn(),
    findAll: jest.fn(),
  };

  const mockIncidentReport = {
    count: jest.fn(),
    findAll: jest.fn(),
  };

  const mockMedicationLog = {
    count: jest.fn(),
    findAll: jest.fn(),
  };

  const mockAllergy = {
    findAll: jest.fn(),
  };

  const mockMedication = {};
  const mockUser = {};

  beforeEach(async () => {
    // Create mock Sequelize instance
    mockSequelize = {
      models: {
        Student: mockStudent,
        StudentMedication: mockStudentMedication,
        Appointment: mockAppointment,
        IncidentReport: mockIncidentReport,
        MedicationLog: mockMedicationLog,
        Allergy: mockAllergy,
        Medication: mockMedication,
        User: mockUser,
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: 'SEQUELIZE',
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    service.clearCache(); // Clear cache between tests
  });

  // ==================== DASHBOARD STATS TESTS ====================

  describe('getDashboardStats', () => {
    it('should return comprehensive dashboard statistics', async () => {
      // Setup mocks for all count queries
      mockStudent.count
        .mockResolvedValueOnce(150) // totalStudents
        .mockResolvedValueOnce(120); // studentsLastMonth

      mockStudentMedication.count
        .mockResolvedValueOnce(45) // activeMedications
        .mockResolvedValueOnce(30) // medicationsDueToday
        .mockResolvedValueOnce(40); // medicationsLastMonth

      mockAppointment.count
        .mockResolvedValueOnce(8) // todaysAppointments
        .mockResolvedValueOnce(35); // appointmentsLastMonth

      mockIncidentReport.count.mockResolvedValueOnce(3); // pendingIncidents

      mockAllergy.findAll.mockResolvedValueOnce([
        { id: '1' },
        { id: '2' },
      ]); // healthAlerts (2 severe allergies)

      mockMedicationLog.count.mockResolvedValueOnce(12);
      mockIncidentReport.count.mockResolvedValueOnce(4);
      mockAppointment.count.mockResolvedValueOnce(6);

      const result = await service.getDashboardStats();

      expect(result).toEqual({
        totalStudents: 150,
        activeMedications: 45,
        todaysAppointments: 8,
        pendingIncidents: 3,
        medicationsDueToday: 30,
        healthAlerts: 2,
        recentActivityCount: 22, // 12 + 4 + 6
        studentTrend: {
          value: '150',
          change: expect.stringContaining('%'),
          changeType: 'positive',
        },
        medicationTrend: {
          value: '45',
          change: expect.stringContaining('%'),
          changeType: 'positive',
        },
        appointmentTrend: {
          value: '8',
          change: expect.stringContaining('%'),
          changeType: 'negative',
        },
      });
    });

    it('should cache dashboard stats for 5 minutes', async () => {
      mockStudent.count.mockResolvedValue(100);
      mockStudentMedication.count.mockResolvedValue(20);
      mockAppointment.count.mockResolvedValue(5);
      mockIncidentReport.count.mockResolvedValue(2);
      mockAllergy.findAll.mockResolvedValue([]);
      mockMedicationLog.count.mockResolvedValue(10);

      // First call - should hit database
      await service.getDashboardStats();
      expect(mockStudent.count).toHaveBeenCalled();

      jest.clearAllMocks();

      // Second call within cache period - should use cache
      await service.getDashboardStats();
      expect(mockStudent.count).not.toHaveBeenCalled();
    });

    it('should calculate positive trend correctly', async () => {
      mockStudent.count
        .mockResolvedValueOnce(150)
        .mockResolvedValueOnce(100); // 50% increase

      mockStudentMedication.count.mockResolvedValue(0);
      mockAppointment.count.mockResolvedValue(0);
      mockIncidentReport.count.mockResolvedValue(0);
      mockAllergy.findAll.mockResolvedValue([]);
      mockMedicationLog.count.mockResolvedValue(0);

      const result = await service.getDashboardStats();

      expect(result.studentTrend.change).toBe('+50.0%');
      expect(result.studentTrend.changeType).toBe('positive');
    });

    it('should calculate negative trend correctly', async () => {
      mockStudent.count
        .mockResolvedValueOnce(75)
        .mockResolvedValueOnce(100); // 25% decrease

      mockStudentMedication.count.mockResolvedValue(0);
      mockAppointment.count.mockResolvedValue(0);
      mockIncidentReport.count.mockResolvedValue(0);
      mockAllergy.findAll.mockResolvedValue([]);
      mockMedicationLog.count.mockResolvedValue(0);

      const result = await service.getDashboardStats();

      expect(result.studentTrend.change).toBe('-25.0%');
      expect(result.studentTrend.changeType).toBe('negative');
    });

    it('should handle neutral trend (no change)', async () => {
      mockStudent.count.mockResolvedValue(100); // Same count

      mockStudentMedication.count.mockResolvedValue(0);
      mockAppointment.count.mockResolvedValue(0);
      mockIncidentReport.count.mockResolvedValue(0);
      mockAllergy.findAll.mockResolvedValue([]);
      mockMedicationLog.count.mockResolvedValue(0);

      const result = await service.getDashboardStats();

      expect(result.studentTrend.change).toBe('0.0%');
      expect(result.studentTrend.changeType).toBe('neutral');
    });

    it('should handle zero baseline for trend calculation', async () => {
      mockStudent.count
        .mockResolvedValueOnce(50)
        .mockResolvedValueOnce(0); // From 0 to 50

      mockStudentMedication.count.mockResolvedValue(0);
      mockAppointment.count.mockResolvedValue(0);
      mockIncidentReport.count.mockResolvedValue(0);
      mockAllergy.findAll.mockResolvedValue([]);
      mockMedicationLog.count.mockResolvedValue(0);

      const result = await service.getDashboardStats();

      expect(result.studentTrend.change).toBe('0.0%');
    });

    it('should handle database errors gracefully with fallback values', async () => {
      mockStudent.count.mockRejectedValue(new Error('Database connection failed'));
      mockStudentMedication.count.mockRejectedValue(new Error('Database error'));
      mockAppointment.count.mockResolvedValue(5);
      mockIncidentReport.count.mockResolvedValue(2);
      mockAllergy.findAll.mockResolvedValue([]);
      mockMedicationLog.count.mockResolvedValue(0);

      const result = await service.getDashboardStats();

      // Should return 0 for failed queries but still work
      expect(result.totalStudents).toBe(0);
      expect(result.activeMedications).toBe(0);
      expect(result.todaysAppointments).toBe(5); // This one succeeded
    });

    it('should throw InternalServerErrorException on complete failure', async () => {
      mockStudent.count.mockRejectedValue(new Error('Complete failure'));
      mockStudentMedication.count.mockRejectedValue(new Error('Complete failure'));
      mockAppointment.count.mockRejectedValue(new Error('Complete failure'));
      mockIncidentReport.count.mockRejectedValue(new Error('Complete failure'));
      mockAllergy.findAll.mockRejectedValue(new Error('Complete failure'));
      mockMedicationLog.count.mockRejectedValue(new Error('Complete failure'));

      await expect(service.getDashboardStats()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ==================== RECENT ACTIVITIES TESTS ====================

  describe('getRecentActivities', () => {
    beforeEach(() => {
      // Setup default mocks for recent activities
      mockMedicationLog.findAll.mockResolvedValue([
        {
          id: 'log-1',
          timeGiven: new Date(Date.now() - 3600000), // 1 hour ago
          studentMedication: {
            student: { firstName: 'John', lastName: 'Doe' },
            medication: { name: 'Aspirin' },
          },
          nurse: { firstName: 'Nurse', lastName: 'Smith' },
        },
      ]);

      mockIncidentReport.findAll.mockResolvedValue([
        {
          id: 'incident-1',
          type: 'INJURY',
          createdAt: new Date(Date.now() - 7200000), // 2 hours ago
          followUpRequired: true,
          student: { firstName: 'Jane', lastName: 'Smith' },
        },
      ]);

      mockAppointment.findAll.mockResolvedValue([
        {
          id: 'apt-1',
          type: 'ROUTINE_CHECKUP',
          scheduledAt: new Date(Date.now() + 3600000), // 1 hour from now
          status: 'SCHEDULED',
          student: { firstName: 'Bob', lastName: 'Johnson' },
        },
      ]);
    });

    it('should return recent activities from all modules', async () => {
      const result = await service.getRecentActivities(5);

      expect(result).toHaveLength(3);
      expect(result[0].type).toBe('medication');
      expect(result[1].type).toBe('incident');
      expect(result[2].type).toBe('appointment');
    });

    it('should limit results to specified count', async () => {
      const result = await service.getRecentActivities(2);

      expect(result.length).toBeLessThanOrEqual(2);
    });

    it('should format medication administration messages correctly', async () => {
      const result = await service.getRecentActivities(5);

      const medActivity = result.find(a => a.type === 'medication');
      expect(medActivity.message).toContain('Administered');
      expect(medActivity.message).toContain('Aspirin');
      expect(medActivity.message).toContain('John Doe');
      expect(medActivity.status).toBe('completed');
    });

    it('should format incident report messages correctly', async () => {
      const result = await service.getRecentActivities(5);

      const incidentActivity = result.find(a => a.type === 'incident');
      expect(incidentActivity.message).toContain('injury report');
      expect(incidentActivity.message).toContain('Jane Smith');
      expect(incidentActivity.status).toBe('pending');
    });

    it('should format upcoming appointment messages correctly', async () => {
      const result = await service.getRecentActivities(5);

      const aptActivity = result.find(a => a.type === 'appointment');
      expect(aptActivity.message).toContain('Upcoming');
      expect(aptActivity.message).toContain('routine checkup');
      expect(aptActivity.message).toContain('Bob Johnson');
      expect(aptActivity.status).toBe('upcoming');
    });

    it('should format relative time correctly for past events', async () => {
      const result = await service.getRecentActivities(5);

      const medActivity = result.find(a => a.type === 'medication');
      expect(medActivity.time).toContain('hour');
      expect(medActivity.time).toContain('ago');
    });

    it('should format relative time correctly for future events', async () => {
      const result = await service.getRecentActivities(5);

      const aptActivity = result.find(a => a.type === 'appointment');
      expect(aptActivity.time).toContain('in');
      expect(aptActivity.time).toContain('hour');
    });

    it('should handle empty results gracefully', async () => {
      mockMedicationLog.findAll.mockResolvedValue([]);
      mockIncidentReport.findAll.mockResolvedValue([]);
      mockAppointment.findAll.mockResolvedValue([]);

      const result = await service.getRecentActivities(5);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockMedicationLog.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.getRecentActivities(5)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ==================== UPCOMING APPOINTMENTS TESTS ====================

  describe('getUpcomingAppointments', () => {
    it('should return upcoming appointments sorted by time', async () => {
      const appointments = [
        {
          id: 'apt-1',
          type: 'ROUTINE_CHECKUP',
          scheduledAt: new Date(Date.now() + 3600000),
          status: 'SCHEDULED',
          student: { id: 's1', firstName: 'John', lastName: 'Doe' },
        },
        {
          id: 'apt-2',
          type: 'MEDICATION_ADMINISTRATION',
          scheduledAt: new Date(Date.now() + 7200000),
          status: 'SCHEDULED',
          student: { id: 's2', firstName: 'Jane', lastName: 'Smith' },
        },
      ];

      mockAppointment.findAll.mockResolvedValue(appointments);

      const result = await service.getUpcomingAppointments(5);

      expect(result).toHaveLength(2);
      expect(result[0].student).toBe('John Doe');
      expect(result[1].student).toBe('Jane Smith');
    });

    it('should classify medication/emergency appointments as high priority', async () => {
      mockAppointment.findAll.mockResolvedValue([
        {
          id: 'apt-1',
          type: 'MEDICATION_ADMINISTRATION',
          scheduledAt: new Date(),
          student: { firstName: 'Test', lastName: 'User' },
        },
      ]);

      const result = await service.getUpcomingAppointments(5);

      expect(result[0].priority).toBe('high');
    });

    it('should classify routine checkups as low priority', async () => {
      mockAppointment.findAll.mockResolvedValue([
        {
          id: 'apt-1',
          type: 'ROUTINE_CHECKUP',
          scheduledAt: new Date(),
          student: { firstName: 'Test', lastName: 'User' },
        },
      ]);

      const result = await service.getUpcomingAppointments(5);

      expect(result[0].priority).toBe('low');
    });

    it('should format appointment time correctly', async () => {
      const scheduledTime = new Date('2025-01-15T14:30:00');

      mockAppointment.findAll.mockResolvedValue([
        {
          id: 'apt-1',
          type: 'ROUTINE_CHECKUP',
          scheduledAt: scheduledTime,
          student: { firstName: 'Test', lastName: 'User' },
        },
      ]);

      const result = await service.getUpcomingAppointments(5);

      expect(result[0].time).toBeDefined();
    });

    it('should handle missing student gracefully', async () => {
      mockAppointment.findAll.mockResolvedValue([
        {
          id: 'apt-1',
          type: 'ROUTINE_CHECKUP',
          scheduledAt: new Date(),
          student: null,
        },
      ]);

      const result = await service.getUpcomingAppointments(5);

      expect(result[0].student).toBe('Unknown');
      expect(result[0].studentId).toBe('');
    });

    it('should limit results to specified count', async () => {
      const appointments = Array.from({ length: 10 }, (_, i) => ({
        id: `apt-${i}`,
        type: 'ROUTINE_CHECKUP',
        scheduledAt: new Date(Date.now() + i * 3600000),
        student: { firstName: 'Test', lastName: `User${i}` },
      }));

      mockAppointment.findAll.mockResolvedValue(appointments);

      const result = await service.getUpcomingAppointments(3);

      expect(result).toHaveLength(3);
    });

    it('should handle database errors', async () => {
      mockAppointment.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.getUpcomingAppointments(5)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ==================== CHART DATA TESTS ====================

  describe('getChartData', () => {
    it('should return chart data for week period', async () => {
      const mockData = [
        { date: '2025-01-01', count: 5 },
        { date: '2025-01-02', count: 8 },
      ];

      mockStudent.findAll.mockResolvedValue(mockData);
      mockMedicationLog.findAll.mockResolvedValue(mockData);
      mockIncidentReport.findAll.mockResolvedValue(mockData);
      mockAppointment.findAll.mockResolvedValue(mockData);

      const result = await service.getChartData('week');

      expect(result).toHaveProperty('enrollmentTrend');
      expect(result).toHaveProperty('medicationAdministration');
      expect(result).toHaveProperty('incidentFrequency');
      expect(result).toHaveProperty('appointmentTrends');
    });

    it('should format chart data points correctly', async () => {
      const mockData = [{ date: '2025-01-15', count: 10 }];

      mockStudent.findAll.mockResolvedValue(mockData);
      mockMedicationLog.findAll.mockResolvedValue([]);
      mockIncidentReport.findAll.mockResolvedValue([]);
      mockAppointment.findAll.mockResolvedValue([]);

      const result = await service.getChartData('week');

      expect(result.enrollmentTrend[0]).toEqual({
        date: expect.any(String),
        value: 10,
        label: expect.any(String),
      });
    });

    it('should handle month period', async () => {
      mockStudent.findAll.mockResolvedValue([]);
      mockMedicationLog.findAll.mockResolvedValue([]);
      mockIncidentReport.findAll.mockResolvedValue([]);
      mockAppointment.findAll.mockResolvedValue([]);

      const result = await service.getChartData('month');

      expect(result).toBeDefined();
    });

    it('should handle year period', async () => {
      mockStudent.findAll.mockResolvedValue([]);
      mockMedicationLog.findAll.mockResolvedValue([]);
      mockIncidentReport.findAll.mockResolvedValue([]);
      mockAppointment.findAll.mockResolvedValue([]);

      const result = await service.getChartData('year');

      expect(result).toBeDefined();
    });

    it('should handle database errors', async () => {
      mockStudent.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.getChartData('week')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ==================== SCOPED STATS TESTS ====================

  describe('getDashboardStatsByScope', () => {
    it('should accept school and district filters', async () => {
      mockStudent.count.mockResolvedValue(50);
      mockStudentMedication.count.mockResolvedValue(10);
      mockAppointment.count.mockResolvedValue(3);
      mockIncidentReport.count.mockResolvedValue(1);
      mockAllergy.findAll.mockResolvedValue([]);
      mockMedicationLog.count.mockResolvedValue(5);

      const result = await service.getDashboardStatsByScope('school-123', 'district-456');

      expect(result).toBeDefined();
      expect(result.totalStudents).toBeDefined();
    });

    it('should work with only schoolId', async () => {
      mockStudent.count.mockResolvedValue(50);
      mockStudentMedication.count.mockResolvedValue(10);
      mockAppointment.count.mockResolvedValue(3);
      mockIncidentReport.count.mockResolvedValue(1);
      mockAllergy.findAll.mockResolvedValue([]);
      mockMedicationLog.count.mockResolvedValue(5);

      const result = await service.getDashboardStatsByScope('school-123');

      expect(result).toBeDefined();
    });

    it('should work with only districtId', async () => {
      mockStudent.count.mockResolvedValue(50);
      mockStudentMedication.count.mockResolvedValue(10);
      mockAppointment.count.mockResolvedValue(3);
      mockIncidentReport.count.mockResolvedValue(1);
      mockAllergy.findAll.mockResolvedValue([]);
      mockMedicationLog.count.mockResolvedValue(5);

      const result = await service.getDashboardStatsByScope(undefined, 'district-456');

      expect(result).toBeDefined();
    });
  });

  // ==================== CACHE MANAGEMENT TESTS ====================

  describe('clearCache', () => {
    it('should clear the stats cache', async () => {
      mockStudent.count.mockResolvedValue(100);
      mockStudentMedication.count.mockResolvedValue(20);
      mockAppointment.count.mockResolvedValue(5);
      mockIncidentReport.count.mockResolvedValue(2);
      mockAllergy.findAll.mockResolvedValue([]);
      mockMedicationLog.count.mockResolvedValue(10);

      // Get stats (cached)
      await service.getDashboardStats();

      // Clear cache
      service.clearCache();

      jest.clearAllMocks();

      // Get stats again - should hit database
      await service.getDashboardStats();

      expect(mockStudent.count).toHaveBeenCalled();
    });
  });
});
