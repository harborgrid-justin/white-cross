/**
 * Health Metrics Routes - Real-time health metrics dashboard endpoints
 * Author: System
 * Date: 2024
 * Description: API routes for real-time health metrics tracking and analytics
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { healthMetricsService } from '../services/healthMetricsService';

// Get real-time health metrics overview
const getMetricsOverviewHandler = async (request: any, h: any) => {
  try {
    const { timeRange, department, refresh } = request.query;
    const overview = await healthMetricsService.getMetricsOverview(timeRange, department, refresh);
    
    return h.response({
      success: true,
      data: overview
    }).code(200);
  } catch (error) {
    console.error('Health metrics overview error:', error);
    return h.response({
      success: false,
      error: 'Failed to fetch health metrics overview'
    }).code(500);
  }
};

// Get real-time vital signs for patients
const getLiveVitalsHandler = async (request: any, h: any) => {
  try {
    const { patientIds, department, critical, limit } = request.query;
    const vitals = await healthMetricsService.getLiveVitals(patientIds, department, critical, limit);
    
    return h.response({
      success: true,
      data: vitals
    }).code(200);
  } catch (error) {
    console.error('Live vitals error:', error);
    return h.response({
      success: false,
      error: 'Failed to fetch live vitals'
    }).code(500);
  }
};

// Get patient health trends
const getPatientTrendsHandler = async (request: any, h: any) => {
  try {
    const { patientId } = request.params;
    const { metrics, timeRange, granularity } = request.query;
    const trends = await healthMetricsService.getPatientTrends(patientId, metrics, timeRange, granularity);
    
    return h.response({
      success: true,
      data: trends
    }).code(200);
  } catch (error) {
    console.error('Patient trends error:', error);
    return h.response({
      success: false,
      error: 'Failed to fetch patient trends'
    }).code(500);
  }
};

// Get department performance metrics
const getDepartmentPerformanceHandler = async (request: any, h: any) => {
  try {
    const { timeRange, includeHistorical } = request.query;
    const performance = await healthMetricsService.getDepartmentPerformance(timeRange, includeHistorical);
    
    return h.response({
      success: true,
      data: performance
    }).code(200);
  } catch (error) {
    console.error('Department performance error:', error);
    return h.response({
      success: false,
      error: 'Failed to fetch department performance'
    }).code(500);
  }
};

// Record new vital signs
const recordVitalsHandler = async (request: any, h: any) => {
  try {
    const vitalRecord = await healthMetricsService.recordVitals(request.payload);
    
    return h.response({
      success: true,
      data: vitalRecord
    }).code(201);
  } catch (error) {
    console.error('Record vitals error:', error);
    return h.response({
      success: false,
      error: 'Failed to record vital signs'
    }).code(500);
  }
};

// Get health alerts and notifications
const getHealthAlertsHandler = async (request: any, h: any) => {
  try {
    const { severity, department, status, limit } = request.query;
    const alerts = await healthMetricsService.getHealthAlerts(severity, department, status, limit);
    
    return h.response({
      success: true,
      data: alerts
    }).code(200);
  } catch (error) {
    console.error('Health alerts error:', error);
    return h.response({
      success: false,
      error: 'Failed to fetch health alerts'
    }).code(500);
  }
};

// Update alert status
const updateAlertStatusHandler = async (request: any, h: any) => {
  try {
    const { alertId } = request.params;
    const updatedAlert = await healthMetricsService.updateAlertStatus(alertId, request.payload);
    
    return h.response({
      success: true,
      data: updatedAlert
    }).code(200);
  } catch (error) {
    console.error('Update alert error:', error);
    return h.response({
      success: false,
      error: 'Failed to update alert status'
    }).code(500);
  }
};

export const healthMetricsRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/health-metrics/overview',
    handler: getMetricsOverviewHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'health-metrics'],
      description: 'Get real-time health metrics overview',
      notes: 'Provides comprehensive health metrics dashboard data including patient counts, alerts, and department status.',
      validate: {
        query: Joi.object({
          timeRange: Joi.string().valid('1h', '6h', '24h', '7d', '30d').default('24h'),
          department: Joi.string().optional(),
          refresh: Joi.boolean().default(false)
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Health metrics overview retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Health metrics service error' }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-metrics/vitals/live',
    handler: getLiveVitalsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'health-metrics', 'vitals'],
      description: 'Get live vital signs for monitored patients',
      notes: 'Returns real-time vital signs data for patients currently being monitored.',
      validate: {
        query: Joi.object({
          patientIds: Joi.array().items(Joi.number()).optional(),
          department: Joi.string().optional(),
          critical: Joi.boolean().default(false),
          limit: Joi.number().min(1).max(100).default(20)
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Live vitals retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Vitals service error' }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-metrics/trends/{patientId}',
    handler: getPatientTrendsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'health-metrics', 'trends'],
      description: 'Get health trends for a specific patient',
      notes: 'Returns historical trend data for patient vital signs and health metrics.',
      validate: {
        params: Joi.object({
          patientId: Joi.number().required()
        }),
        query: Joi.object({
          metrics: Joi.array().items(Joi.string().valid(
            'heart_rate', 'blood_pressure', 'temperature', 'oxygen_saturation', 'weight', 'bmi'
          )).default(['heart_rate', 'blood_pressure', 'temperature']),
          timeRange: Joi.string().valid('1d', '3d', '7d', '30d', '90d').default('7d'),
          granularity: Joi.string().valid('hour', 'day', 'week').default('day')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Patient trends retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Trends service error' }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-metrics/departments/performance',
    handler: getDepartmentPerformanceHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'health-metrics', 'departments'],
      description: 'Get performance metrics for all departments',
      notes: 'Returns performance and efficiency metrics for hospital departments.',
      validate: {
        query: Joi.object({
          timeRange: Joi.string().valid('1h', '6h', '24h', '7d').default('24h'),
          includeHistorical: Joi.boolean().default(false)
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Department performance retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Performance metrics service error' }
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-metrics/vitals',
    handler: recordVitalsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'health-metrics', 'vitals'],
      description: 'Record new vital signs for a patient',
      notes: 'Records new vital signs data and automatically checks for critical alerts.',
      validate: {
        payload: Joi.object({
          patientId: Joi.number().required(),
          vitals: Joi.object({
            heartRate: Joi.number().min(30).max(250).optional(),
            bloodPressure: Joi.object({
              systolic: Joi.number().min(60).max(300),
              diastolic: Joi.number().min(30).max(200)
            }).optional(),
            temperature: Joi.number().min(90).max(110).optional(),
            oxygenSaturation: Joi.number().min(70).max(100).optional(),
            respiratoryRate: Joi.number().min(8).max(60).optional(),
            weight: Joi.number().min(1).max(1000).optional(),
            height: Joi.number().min(12).max(96).optional()
          }).min(1),
          deviceId: Joi.string().optional(),
          notes: Joi.string().max(500).optional(),
          recordedBy: Joi.number().required()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Vital signs recorded successfully' },
            '400': { description: 'Invalid vital signs data' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Vitals recording service error' }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-metrics/alerts',
    handler: getHealthAlertsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'health-metrics', 'alerts'],
      description: 'Get health alerts and notifications',
      notes: 'Returns active health alerts based on critical vital signs and patient conditions.',
      validate: {
        query: Joi.object({
          severity: Joi.array().items(Joi.string().valid('low', 'medium', 'high', 'critical')).optional(),
          department: Joi.string().optional(),
          status: Joi.string().valid('active', 'acknowledged', 'resolved').default('active'),
          limit: Joi.number().min(1).max(100).default(50)
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Health alerts retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Alerts service error' }
          }
        }
      }
    }
  },
  {
    method: 'PATCH',
    path: '/api/health-metrics/alerts/{alertId}',
    handler: updateAlertStatusHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'health-metrics', 'alerts'],
      description: 'Update health alert status',
      notes: 'Updates the status of a health alert (acknowledge or resolve).',
      validate: {
        params: Joi.object({
          alertId: Joi.number().required()
        }),
        payload: Joi.object({
          status: Joi.string().valid('acknowledged', 'resolved').required(),
          notes: Joi.string().max(500).optional(),
          acknowledgedBy: Joi.number().required()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Alert status updated successfully' },
            '400': { description: 'Invalid alert update data' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Alert not found' },
            '500': { description: 'Alert update service error' }
          }
        }
      }
    }
  }
];
