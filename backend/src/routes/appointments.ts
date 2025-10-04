import { ServerRoute } from '@hapi/hapi';
import { AppointmentService } from '../services/appointmentService';
import Joi from 'joi';

// Get appointments
const getAppointmentsHandler = async (request: any, h: any) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const filters: any = {};
    if (request.query.nurseId) filters.nurseId = request.query.nurseId;
    if (request.query.studentId) filters.studentId = request.query.studentId;
    if (request.query.status) filters.status = request.query.status;
    if (request.query.type) filters.type = request.query.type;
    if (request.query.dateFrom) filters.dateFrom = new Date(request.query.dateFrom);
    if (request.query.dateTo) filters.dateTo = new Date(request.query.dateTo);

    const result = await AppointmentService.getAppointments(page, limit, filters);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Create new appointment
const createAppointmentHandler = async (request: any, h: any) => {
  try {
    const appointment = await AppointmentService.createAppointment({
      ...request.payload,
      scheduledAt: new Date(request.payload.scheduledAt)
    });

    return h.response({
      success: true,
      data: { appointment }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update appointment
const updateAppointmentHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const updateData = { ...request.payload };

    if (updateData.scheduledAt) {
      updateData.scheduledAt = new Date(updateData.scheduledAt);
    }

    const appointment = await AppointmentService.updateAppointment(id, updateData);

    return h.response({
      success: true,
      data: { appointment }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Cancel appointment
const cancelAppointmentHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { reason } = request.payload;

    const appointment = await AppointmentService.cancelAppointment(id, reason);

    return h.response({
      success: true,
      data: { appointment }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Mark as no-show
const markNoShowHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const appointment = await AppointmentService.markNoShow(id);

    return h.response({
      success: true,
      data: { appointment }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Check availability
const getAvailableSlotsHandler = async (request: any, h: any) => {
  try {
    const { nurseId } = request.params;
    const date = request.query.date ? new Date(request.query.date) : new Date();
    const duration = parseInt(request.query.duration) || 30;

    const slots = await AppointmentService.getAvailableSlots(nurseId, date, duration);

    return h.response({
      success: true,
      data: { slots }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get upcoming appointments for a nurse
const getUpcomingAppointmentsHandler = async (request: any, h: any) => {
  try {
    const { nurseId } = request.params;
    const limit = parseInt(request.query.limit) || 10;

    const appointments = await AppointmentService.getUpcomingAppointments(nurseId, limit);

    return h.response({
      success: true,
      data: { appointments }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get appointment statistics
const getAppointmentStatisticsHandler = async (request: any, h: any) => {
  try {
    const nurseId = request.query.nurseId;
    const dateFrom = request.query.dateFrom ? new Date(request.query.dateFrom) : undefined;
    const dateTo = request.query.dateTo ? new Date(request.query.dateTo) : undefined;

    const stats = await AppointmentService.getAppointmentStatistics(nurseId, dateFrom, dateTo);

    return h.response({
      success: true,
      data: stats
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Create recurring appointments
const createRecurringAppointmentsHandler = async (request: any, h: any) => {
  try {
    const { recurrence, ...appointmentData } = request.payload;

    const appointments = await AppointmentService.createRecurringAppointments(
      {
        ...appointmentData,
        scheduledAt: new Date(appointmentData.scheduledAt)
      },
      {
        ...recurrence,
        endDate: new Date(recurrence.endDate)
      }
    );

    return h.response({
      success: true,
      data: {
        appointments,
        count: appointments.length
      }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Set nurse availability
const setNurseAvailabilityHandler = async (request: any, h: any) => {
  try {
    const availability = await AppointmentService.setNurseAvailability(request.payload);

    return h.response({
      success: true,
      data: { availability }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get nurse availability
const getNurseAvailabilityHandler = async (request: any, h: any) => {
  try {
    const { nurseId } = request.params;
    const date = request.query.date ? new Date(request.query.date) : undefined;

    const availability = await AppointmentService.getNurseAvailability(nurseId, date);

    return h.response({
      success: true,
      data: { availability }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Update nurse availability
const updateNurseAvailabilityHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const availability = await AppointmentService.updateNurseAvailability(id, request.payload);

    return h.response({
      success: true,
      data: { availability }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Delete nurse availability
const deleteNurseAvailabilityHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    await AppointmentService.deleteNurseAvailability(id);

    return h.response({
      success: true,
      message: 'Availability schedule deleted'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Add to waitlist
const addToWaitlistHandler = async (request: any, h: any) => {
  try {
    const data = { ...request.payload };
    if (data.preferredDate) {
      data.preferredDate = new Date(data.preferredDate);
    }

    const entry = await AppointmentService.addToWaitlist(data);

    return h.response({
      success: true,
      data: { entry }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get waitlist
const getWaitlistHandler = async (request: any, h: any) => {
  try {
    const filters: any = {};
    if (request.query.nurseId) filters.nurseId = request.query.nurseId;
    if (request.query.status) filters.status = request.query.status;
    if (request.query.priority) filters.priority = request.query.priority;

    const waitlist = await AppointmentService.getWaitlist(filters);

    return h.response({
      success: true,
      data: { waitlist }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Remove from waitlist
const removeFromWaitlistHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { reason } = request.payload;

    const entry = await AppointmentService.removeFromWaitlist(id, reason);

    return h.response({
      success: true,
      data: { entry }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Process pending reminders
const processPendingRemindersHandler = async (request: any, h: any) => {
  try {
    const result = await AppointmentService.processPendingReminders();

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Generate calendar export
const generateCalendarExportHandler = async (request: any, h: any) => {
  try {
    const { nurseId } = request.params;
    const dateFrom = request.query.dateFrom ? new Date(request.query.dateFrom) : undefined;
    const dateTo = request.query.dateTo ? new Date(request.query.dateTo) : undefined;

    const ical = await AppointmentService.generateCalendarExport(nurseId, dateFrom, dateTo);

    return h.response(ical)
      .type('text/calendar')
      .header('Content-Disposition', `attachment; filename="appointments-${nurseId}.ics"`);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define appointment routes for Hapi
export const appointmentRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/appointments',
    handler: getAppointmentsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          nurseId: Joi.string().optional(),
          studentId: Joi.string().optional(),
          status: Joi.string().optional(),
          type: Joi.string().optional(),
          dateFrom: Joi.date().iso().optional(),
          dateTo: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/appointments',
    handler: createAppointmentHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required(),
          nurseId: Joi.string().required(),
          type: Joi.string().valid('ROUTINE_CHECKUP', 'MEDICATION_ADMINISTRATION', 'INJURY_ASSESSMENT', 'ILLNESS_EVALUATION', 'FOLLOW_UP', 'SCREENING', 'EMERGENCY').required(),
          scheduledAt: Joi.date().iso().required(),
          reason: Joi.string().trim().required(),
          duration: Joi.number().integer().min(15).max(180).optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/appointments/{id}',
    handler: updateAppointmentHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          type: Joi.string().valid('ROUTINE_CHECKUP', 'MEDICATION_ADMINISTRATION', 'INJURY_ASSESSMENT', 'ILLNESS_EVALUATION', 'FOLLOW_UP', 'SCREENING', 'EMERGENCY').optional(),
          scheduledAt: Joi.date().iso().optional(),
          reason: Joi.string().trim().optional(),
          duration: Joi.number().integer().min(15).max(180).optional(),
          status: Joi.string().valid('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW').optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/appointments/{id}/cancel',
    handler: cancelAppointmentHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          reason: Joi.string().trim().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/appointments/{id}/no-show',
    handler: markNoShowHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/appointments/availability/{nurseId}',
    handler: getAvailableSlotsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          date: Joi.date().iso().optional(),
          duration: Joi.number().integer().min(15).default(30)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/appointments/upcoming/{nurseId}',
    handler: getUpcomingAppointmentsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(50).default(10)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/appointments/statistics',
    handler: getAppointmentStatisticsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          nurseId: Joi.string().optional(),
          dateFrom: Joi.date().iso().optional(),
          dateTo: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/appointments/recurring',
    handler: createRecurringAppointmentsHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required(),
          nurseId: Joi.string().required(),
          type: Joi.string().valid('ROUTINE_CHECKUP', 'MEDICATION_ADMINISTRATION', 'INJURY_ASSESSMENT', 'ILLNESS_EVALUATION', 'FOLLOW_UP', 'SCREENING', 'EMERGENCY').required(),
          scheduledAt: Joi.date().iso().required(),
          reason: Joi.string().trim().required(),
          recurrence: Joi.object({
            frequency: Joi.string().valid('daily', 'weekly', 'monthly').required(),
            interval: Joi.number().integer().min(1).required(),
            endDate: Joi.date().iso().required()
          }).required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/appointments/availability',
    handler: setNurseAvailabilityHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          nurseId: Joi.string().required(),
          startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
          endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
          dayOfWeek: Joi.number().integer().min(0).max(6).optional(),
          isRecurring: Joi.boolean().optional(),
          specificDate: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/appointments/availability/nurse/{nurseId}',
    handler: getNurseAvailabilityHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          date: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/appointments/availability/{id}',
    handler: updateNurseAvailabilityHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
          endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
          isAvailable: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/appointments/availability/{id}',
    handler: deleteNurseAvailabilityHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/appointments/waitlist',
    handler: addToWaitlistHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required(),
          type: Joi.string().valid('ROUTINE_CHECKUP', 'MEDICATION_ADMINISTRATION', 'INJURY_ASSESSMENT', 'ILLNESS_EVALUATION', 'FOLLOW_UP', 'SCREENING', 'EMERGENCY').required(),
          reason: Joi.string().trim().required(),
          priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').optional(),
          preferredDate: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/appointments/waitlist',
    handler: getWaitlistHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          nurseId: Joi.string().optional(),
          status: Joi.string().optional(),
          priority: Joi.string().optional()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/appointments/waitlist/{id}',
    handler: removeFromWaitlistHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          reason: Joi.string().trim().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/appointments/reminders/process',
    handler: processPendingRemindersHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/appointments/calendar/{nurseId}',
    handler: generateCalendarExportHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          dateFrom: Joi.date().iso().optional(),
          dateTo: Joi.date().iso().optional()
        })
      }
    }
  }
];
