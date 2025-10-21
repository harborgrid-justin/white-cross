/**
 * Smart Appointment Scheduling Routes - Intelligent scheduling with conflict detection
 * Author: System
 * Date: 2024
 * Description: API routes for smart appointment scheduling with AI-powered conflict detection and optimization
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { appointmentSchedulingService } from '../services/appointmentSchedulingService';

// Get available time slots for scheduling
const getAvailableSlotsHandler = async (request: any, h: any) => {
  try {
    const { providerId, date, duration, preferredTimes, appointmentType } = request.query;
    const slots = await appointmentSchedulingService.getAvailableSlots({
      providerId,
      date,
      duration,
      preferredTimes,
      appointmentType
    });
    
    return h.response({
      success: true,
      data: slots
    }).code(200);
  } catch (error) {
    console.error('Get available slots error:', error);
    return h.response({
      success: false,
      error: 'Failed to fetch available slots'
    }).code(500);
  }
};

// Schedule a new appointment with conflict detection
const scheduleAppointmentHandler = async (request: any, h: any) => {
  try {
    const userId = request.auth.credentials?.userId;
    const appointment = await appointmentSchedulingService.scheduleAppointment(request.payload, userId);
    
    return h.response({
      success: true,
      data: appointment
    }).code(201);
  } catch (error) {
    console.error('Schedule appointment error:', error);
    return h.response({
      success: false,
      error: 'Failed to schedule appointment'
    }).code(500);
  }
};

// Check for scheduling conflicts
const checkConflictsHandler = async (request: any, h: any) => {
  try {
    const conflicts = await appointmentSchedulingService.checkConflicts(request.payload);
    
    return h.response({
      success: true,
      data: conflicts
    }).code(200);
  } catch (error) {
    console.error('Check conflicts error:', error);
    return h.response({
      success: false,
      error: 'Failed to check conflicts'
    }).code(500);
  }
};

// Get smart scheduling suggestions
const getSchedulingSuggestionsHandler = async (request: any, h: any) => {
  try {
    const { patientId, appointmentType, urgency, constraints } = request.query;
    const suggestions = await appointmentSchedulingService.getSchedulingSuggestions({
      patientId,
      appointmentType,
      urgency,
      constraints
    });
    
    return h.response({
      success: true,
      data: suggestions
    }).code(200);
  } catch (error) {
    console.error('Get scheduling suggestions error:', error);
    return h.response({
      success: false,
      error: 'Failed to get scheduling suggestions'
    }).code(500);
  }
};

// Reschedule an existing appointment
const rescheduleAppointmentHandler = async (request: any, h: any) => {
  try {
    const { appointmentId } = request.params;
    const userId = request.auth.credentials?.userId;
    const rescheduled = await appointmentSchedulingService.rescheduleAppointment(
      appointmentId,
      request.payload,
      userId
    );
    
    return h.response({
      success: true,
      data: rescheduled
    }).code(200);
  } catch (error) {
    console.error('Reschedule appointment error:', error);
    return h.response({
      success: false,
      error: 'Failed to reschedule appointment'
    }).code(500);
  }
};

// Get appointment conflicts analysis
const getConflictAnalysisHandler = async (request: any, h: any) => {
  try {
    const { timeRange, providerId, department } = request.query;
    const analysis = await appointmentSchedulingService.getConflictAnalysis({
      timeRange,
      providerId,
      department
    });
    
    return h.response({
      success: true,
      data: analysis
    }).code(200);
  } catch (error) {
    console.error('Get conflict analysis error:', error);
    return h.response({
      success: false,
      error: 'Failed to get conflict analysis'
    }).code(500);
  }
};

// Optimize appointment schedule
const optimizeScheduleHandler = async (request: any, h: any) => {
  try {
    const optimized = await appointmentSchedulingService.optimizeSchedule(request.payload);
    
    return h.response({
      success: true,
      data: optimized
    }).code(200);
  } catch (error) {
    console.error('Optimize schedule error:', error);
    return h.response({
      success: false,
      error: 'Failed to optimize schedule'
    }).code(500);
  }
};

// Get provider availability calendar
const getProviderAvailabilityHandler = async (request: any, h: any) => {
  try {
    const { providerId } = request.params;
    const { startDate, endDate, includeBlocked } = request.query;
    const availability = await appointmentSchedulingService.getProviderAvailability({
      providerId,
      startDate,
      endDate,
      includeBlocked
    });
    
    return h.response({
      success: true,
      data: availability
    }).code(200);
  } catch (error) {
    console.error('Get provider availability error:', error);
    return h.response({
      success: false,
      error: 'Failed to get provider availability'
    }).code(500);
  }
};

export const appointmentSchedulingRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/scheduling/slots/available',
    handler: getAvailableSlotsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'scheduling'],
      description: 'Get available appointment time slots',
      notes: 'Returns available time slots for a provider on a specific date with smart filtering.',
      validate: {
        query: Joi.object({
          providerId: Joi.number().required(),
          date: Joi.date().iso().required(),
          duration: Joi.number().min(15).max(240).default(30),
          preferredTimes: Joi.array().items(Joi.string()).optional(),
          appointmentType: Joi.string().optional()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Available slots retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Scheduling service error' }
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/scheduling/appointments',
    handler: scheduleAppointmentHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'scheduling'],
      description: 'Schedule a new appointment with conflict detection',
      notes: 'Creates a new appointment with intelligent conflict detection and validation.',
      validate: {
        payload: Joi.object({
          patientId: Joi.number().required(),
          providerId: Joi.number().required(),
          appointmentType: Joi.string().required(),
          dateTime: Joi.date().iso().required(),
          duration: Joi.number().min(15).max(240).required(),
          notes: Joi.string().max(1000).optional(),
          priority: Joi.string().valid('low', 'normal', 'high', 'urgent').default('normal'),
          department: Joi.string().optional(),
          roomId: Joi.number().optional(),
          reminderPreferences: Joi.object({
            email: Joi.boolean().default(true),
            sms: Joi.boolean().default(false),
            reminderTimes: Joi.array().items(Joi.number()).default([24, 2]) // hours before
          }).optional()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Appointment scheduled successfully' },
            '400': { description: 'Invalid appointment data or conflicts detected' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Scheduling service error' }
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/scheduling/conflicts/check',
    handler: checkConflictsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'scheduling', 'conflicts'],
      description: 'Check for scheduling conflicts',
      notes: 'Analyzes potential conflicts for a proposed appointment time.',
      validate: {
        payload: Joi.object({
          providerId: Joi.number().required(),
          dateTime: Joi.date().iso().required(),
          duration: Joi.number().min(15).max(240).required(),
          excludeAppointmentId: Joi.number().optional(),
          roomId: Joi.number().optional(),
          checkPatientConflicts: Joi.boolean().default(true),
          checkResourceConflicts: Joi.boolean().default(true)
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Conflict check completed successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Conflict check service error' }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/scheduling/suggestions',
    handler: getSchedulingSuggestionsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'scheduling', 'suggestions'],
      description: 'Get smart scheduling suggestions',
      notes: 'Returns AI-powered scheduling suggestions based on patient history and preferences.',
      validate: {
        query: Joi.object({
          patientId: Joi.number().required(),
          appointmentType: Joi.string().required(),
          urgency: Joi.string().valid('low', 'normal', 'high', 'urgent').default('normal'),
          constraints: Joi.object({
            preferredDays: Joi.array().items(Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')).optional(),
            preferredTimes: Joi.array().items(Joi.string()).optional(),
            maxTravelTime: Joi.number().optional(),
            providerPreferences: Joi.array().items(Joi.number()).optional()
          }).optional()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Scheduling suggestions retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Suggestions service error' }
          }
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/scheduling/appointments/{appointmentId}/reschedule',
    handler: rescheduleAppointmentHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'scheduling'],
      description: 'Reschedule an existing appointment',
      notes: 'Reschedules an appointment with conflict detection and notification handling.',
      validate: {
        params: Joi.object({
          appointmentId: Joi.number().required()
        }),
        payload: Joi.object({
          newDateTime: Joi.date().iso().required(),
          newDuration: Joi.number().min(15).max(240).optional(),
          newProviderId: Joi.number().optional(),
          reason: Joi.string().max(500).optional(),
          notifyPatient: Joi.boolean().default(true),
          notifyProvider: Joi.boolean().default(true)
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Appointment rescheduled successfully' },
            '400': { description: 'Invalid reschedule data or conflicts detected' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Appointment not found' },
            '500': { description: 'Reschedule service error' }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/scheduling/conflicts/analysis',
    handler: getConflictAnalysisHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'scheduling', 'analytics'],
      description: 'Get appointment conflicts analysis',
      notes: 'Provides detailed analysis of scheduling conflicts and optimization opportunities.',
      validate: {
        query: Joi.object({
          timeRange: Joi.string().valid('day', 'week', 'month').default('week'),
          providerId: Joi.number().optional(),
          department: Joi.string().optional(),
          includeResolutions: Joi.boolean().default(true)
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Conflict analysis retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Analysis service error' }
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/scheduling/optimize',
    handler: optimizeScheduleHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'scheduling', 'optimization'],
      description: 'Optimize appointment schedule',
      notes: 'Uses AI algorithms to optimize appointment scheduling for efficiency and patient satisfaction.',
      validate: {
        payload: Joi.object({
          providerId: Joi.number().optional(),
          department: Joi.string().optional(),
          dateRange: Joi.object({
            start: Joi.date().iso().required(),
            end: Joi.date().iso().required()
          }).required(),
          optimizationGoals: Joi.array().items(
            Joi.string().valid('minimize_wait_time', 'maximize_utilization', 'reduce_gaps', 'patient_preferences')
          ).default(['minimize_wait_time', 'maximize_utilization']),
          constraints: Joi.object({
            preserveUrgent: Joi.boolean().default(true),
            maxReschedulingHours: Joi.number().default(48),
            allowCrossDay: Joi.boolean().default(false)
          }).optional()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Schedule optimization completed successfully' },
            '400': { description: 'Invalid optimization parameters' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Optimization service error' }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/scheduling/providers/{providerId}/availability',
    handler: getProviderAvailabilityHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'scheduling', 'providers'],
      description: 'Get provider availability calendar',
      notes: 'Returns detailed availability calendar for a specific provider.',
      validate: {
        params: Joi.object({
          providerId: Joi.number().required()
        }),
        query: Joi.object({
          startDate: Joi.date().iso().required(),
          endDate: Joi.date().iso().required(),
          includeBlocked: Joi.boolean().default(false),
          includeBooked: Joi.boolean().default(true),
          granularity: Joi.string().valid('15min', '30min', '1hour').default('30min')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Provider availability retrieved successfully' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Provider not found' },
            '500': { description: 'Availability service error' }
          }
        }
      }
    }
  }
];
