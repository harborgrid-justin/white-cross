/**
 * Analytics Module Integration Tests
 * Tests dashboard metrics, reports, and data visualization endpoints
 */

import { test, expect } from '../helpers/test-client';
import { getPastDate } from '../helpers/test-data';

test.describe('Analytics Module Integration', () => {
  test.describe('Dashboard Metrics', () => {
    test('should retrieve main dashboard metrics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/dashboard');

      expect(response.ok()).toBeTruthy();
      const metrics = await response.json();

      expect(metrics.totalStudents).toBeDefined();
      expect(metrics.activeStudents).toBeDefined();
      expect(metrics.totalMedications).toBeDefined();
      expect(metrics.todayAppointments).toBeDefined();
      expect(metrics.pendingIncidents).toBeDefined();
      expect(metrics.lowStockItems).toBeDefined();
    });

    test('should retrieve student statistics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/students');

      expect(response.ok()).toBeTruthy();
      const stats = await response.json();

      expect(stats.totalStudents).toBeDefined();
      expect(stats.studentsByGrade).toBeDefined();
      expect(stats.studentsByStatus).toBeDefined();
      expect(stats.studentsWithAllergies).toBeDefined();
      expect(stats.studentsWithMedications).toBeDefined();
    });

    test('should retrieve medication statistics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/medications');

      expect(response.ok()).toBeTruthy();
      const stats = await response.json();

      expect(stats.totalActiveMedications).toBeDefined();
      expect(stats.medicationsByFrequency).toBeDefined();
      expect(stats.medicationsByRoute).toBeDefined();
      expect(stats.administrationComplianceRate).toBeDefined();
    });

    test('should retrieve appointment statistics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/appointments');

      expect(response.ok()).toBeTruthy();
      const stats = await response.json();

      expect(stats.totalAppointments).toBeDefined();
      expect(stats.appointmentsByType).toBeDefined();
      expect(stats.appointmentsByStatus).toBeDefined();
      expect(stats.averageWaitTime).toBeDefined();
    });

    test('should retrieve incident statistics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/incidents');

      expect(response.ok()).toBeTruthy();
      const stats = await response.json();

      expect(stats.totalIncidents).toBeDefined();
      expect(stats.incidentsByType).toBeDefined();
      expect(stats.incidentsBySeverity).toBeDefined();
      expect(stats.averageResponseTime).toBeDefined();
    });

    test('should retrieve inventory statistics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/inventory');

      expect(response.ok()).toBeTruthy();
      const stats = await response.json();

      expect(stats.totalItems).toBeDefined();
      expect(stats.itemsByCategory).toBeDefined();
      expect(stats.lowStockItems).toBeDefined();
      expect(stats.expiringItems).toBeDefined();
      expect(stats.totalValue).toBeDefined();
    });
  });

  test.describe('Trend Analysis', () => {
    test('should retrieve student enrollment trends', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/trends/students', {
        params: {
          period: 'monthly',
          months: 12,
        },
      });

      expect(response.ok()).toBeTruthy();
      const trends = await response.json();

      expect(Array.isArray(trends)).toBeTruthy();
      trends.forEach((trend: any) => {
        expect(trend.period).toBeDefined();
        expect(trend.count).toBeDefined();
      });
    });

    test('should retrieve medication administration trends', async ({
      authenticatedContext,
    }) => {
      const response = await authenticatedContext.get(
        '/api/v1/analytics/trends/medications',
        {
          params: {
            period: 'weekly',
            weeks: 8,
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const trends = await response.json();

      expect(Array.isArray(trends)).toBeTruthy();
      trends.forEach((trend: any) => {
        expect(trend.period).toBeDefined();
        expect(trend.administrations).toBeDefined();
      });
    });

    test('should retrieve incident trends', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/trends/incidents', {
        params: {
          period: 'monthly',
          months: 6,
        },
      });

      expect(response.ok()).toBeTruthy();
      const trends = await response.json();

      expect(Array.isArray(trends)).toBeTruthy();
    });

    test('should retrieve appointment scheduling trends', async ({
      authenticatedContext,
    }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/trends/appointments', {
        params: {
          period: 'daily',
          days: 30,
        },
      });

      expect(response.ok()).toBeTruthy();
      const trends = await response.json();

      expect(Array.isArray(trends)).toBeTruthy();
    });
  });

  test.describe('Health Analytics', () => {
    test('should retrieve common health conditions report', async ({
      authenticatedContext,
    }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/health/conditions');

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.conditions).toBeDefined();
      expect(Array.isArray(report.conditions)).toBeTruthy();
      report.conditions.forEach((condition: any) => {
        expect(condition.name).toBeDefined();
        expect(condition.count).toBeDefined();
        expect(condition.percentage).toBeDefined();
      });
    });

    test('should retrieve allergy statistics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/health/allergies');

      expect(response.ok()).toBeTruthy();
      const stats = await response.json();

      expect(stats.totalStudentsWithAllergies).toBeDefined();
      expect(stats.allergyBreakdown).toBeDefined();
      expect(Array.isArray(stats.allergyBreakdown)).toBeTruthy();
    });

    test('should retrieve immunization coverage report', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/health/immunizations');

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.overallCoverageRate).toBeDefined();
      expect(report.vaccineBreakdown).toBeDefined();
      expect(report.nonCompliantStudents).toBeDefined();
    });

    test('should retrieve vital signs trends', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/health/vital-signs', {
        params: {
          startDate: getPastDate(90),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      const trends = await response.json();

      expect(trends.averageTemperature).toBeDefined();
      expect(trends.averageHeartRate).toBeDefined();
      expect(trends.abnormalReadings).toBeDefined();
    });
  });

  test.describe('Usage Analytics', () => {
    test('should retrieve user activity metrics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/usage/activity', {
        params: {
          startDate: getPastDate(30),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      const metrics = await response.json();

      expect(metrics.totalLogins).toBeDefined();
      expect(metrics.activeUsers).toBeDefined();
      expect(metrics.averageSessionDuration).toBeDefined();
    });

    test('should retrieve feature usage statistics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/usage/features');

      expect(response.ok()).toBeTruthy();
      const stats = await response.json();

      expect(stats.features).toBeDefined();
      expect(Array.isArray(stats.features)).toBeTruthy();
      stats.features.forEach((feature: any) => {
        expect(feature.name).toBeDefined();
        expect(feature.usageCount).toBeDefined();
      });
    });

    test('should retrieve peak usage times', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/usage/peak-times');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.hourlyDistribution).toBeDefined();
      expect(data.dailyDistribution).toBeDefined();
      expect(data.peakHour).toBeDefined();
      expect(data.peakDay).toBeDefined();
    });
  });

  test.describe('Performance Metrics', () => {
    test('should retrieve API response time metrics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/performance/api');

      expect(response.ok()).toBeTruthy();
      const metrics = await response.json();

      expect(metrics.averageResponseTime).toBeDefined();
      expect(metrics.p95ResponseTime).toBeDefined();
      expect(metrics.p99ResponseTime).toBeDefined();
      expect(metrics.slowestEndpoints).toBeDefined();
    });

    test('should retrieve error rate metrics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/performance/errors');

      expect(response.ok()).toBeTruthy();
      const metrics = await response.json();

      expect(metrics.totalRequests).toBeDefined();
      expect(metrics.errorCount).toBeDefined();
      expect(metrics.errorRate).toBeDefined();
      expect(metrics.errorsByType).toBeDefined();
    });

    test('should retrieve system health metrics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/performance/system');

      expect(response.ok()).toBeTruthy();
      const metrics = await response.json();

      expect(metrics.databaseStatus).toBeDefined();
      expect(metrics.cacheHitRate).toBeDefined();
      expect(metrics.queueLength).toBeDefined();
    });
  });

  test.describe('Custom Reports', () => {
    test('should create custom report', async ({ authenticatedContext }) => {
      const reportData = {
        reportName: 'Monthly Health Summary',
        reportType: 'health_summary',
        frequency: 'monthly',
        parameters: {
          includeVitalSigns: true,
          includeMedications: true,
          includeIncidents: true,
        },
      };

      const response = await authenticatedContext.post('/api/v1/analytics/reports', {
        data: reportData,
      });

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.id).toBeDefined();
      expect(report.reportName).toBe('Monthly Health Summary');
    });

    test('should list saved reports', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/reports');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.reports)).toBeTruthy();
    });

    test('should generate report', async ({ authenticatedContext }) => {
      // Create report
      const createResponse = await authenticatedContext.post('/api/v1/analytics/reports', {
        data: {
          reportName: 'Test Report',
          reportType: 'student_summary',
          frequency: 'on_demand',
        },
      });
      const report = await createResponse.json();

      // Generate report
      const response = await authenticatedContext.post(
        `/api/v1/analytics/reports/${report.id}/generate`,
        {
          data: {
            startDate: getPastDate(30),
            endDate: new Date().toISOString(),
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const generated = await response.json();

      expect(generated.reportId).toBe(report.id);
      expect(generated.generatedAt).toBeDefined();
      expect(generated.data).toBeDefined();
    });

    test('should export report to PDF', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.post('/api/v1/analytics/reports/export', {
        data: {
          reportType: 'dashboard_summary',
          format: 'pdf',
          startDate: getPastDate(30),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.headers()['content-type']).toContain('pdf');
    });

    test('should export report to Excel', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.post('/api/v1/analytics/reports/export', {
        data: {
          reportType: 'medication_log',
          format: 'xlsx',
          startDate: getPastDate(30),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.headers()['content-type']).toContain('spreadsheet');
    });
  });

  test.describe('Data Visualization', () => {
    test('should retrieve chart data for student demographics', async ({
      authenticatedContext,
    }) => {
      const response = await authenticatedContext.get('/api/v1/analytics/charts/demographics');

      expect(response.ok()).toBeTruthy();
      const chartData = await response.json();

      expect(chartData.labels).toBeDefined();
      expect(chartData.datasets).toBeDefined();
      expect(Array.isArray(chartData.datasets)).toBeTruthy();
    });

    test('should retrieve chart data for medication usage', async ({
      authenticatedContext,
    }) => {
      const response = await authenticatedContext.get(
        '/api/v1/analytics/charts/medication-usage',
        {
          params: {
            period: 'monthly',
            months: 6,
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const chartData = await response.json();

      expect(chartData.labels).toBeDefined();
      expect(chartData.datasets).toBeDefined();
    });

    test('should retrieve chart data for incident distribution', async ({
      authenticatedContext,
    }) => {
      const response = await authenticatedContext.get(
        '/api/v1/analytics/charts/incident-distribution'
      );

      expect(response.ok()).toBeTruthy();
      const chartData = await response.json();

      expect(chartData.labels).toBeDefined();
      expect(chartData.datasets).toBeDefined();
    });
  });
});
