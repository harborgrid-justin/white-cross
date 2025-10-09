import { ServerRoute } from '@hapi/hapi';
import { DashboardService } from '../services/dashboardService';
import Joi from 'joi';

// Get dashboard statistics
const getDashboardStatsHandler = async (request: any, h: any) => {
  try {
    const userId = request.auth.credentials?.userId;
    const stats = await DashboardService.getDashboardStats(userId);

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

// Get recent activities
const getRecentActivitiesHandler = async (request: any, h: any) => {
  try {
    const limit = parseInt(request.query.limit) || 5;
    const activities = await DashboardService.getRecentActivities(limit);

    return h.response({
      success: true,
      data: { activities }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get upcoming appointments
const getUpcomingAppointmentsHandler = async (request: any, h: any) => {
  try {
    const limit = parseInt(request.query.limit) || 5;
    const appointments = await DashboardService.getUpcomingAppointments(limit);

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

// Get chart data
const getChartDataHandler = async (request: any, h: any) => {
  try {
    const period = request.query.period || 'week';
    const chartData = await DashboardService.getChartData(period);

    return h.response({
      success: true,
      data: chartData
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define dashboard routes for Hapi
export const dashboardRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/dashboard/stats',
    handler: getDashboardStatsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Dashboard'],
      description: 'Get dashboard statistics',
      notes: 'Returns key metrics and statistics for the dashboard including total students, medications, appointments, and incidents.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Dashboard statistics retrieved successfully'
            },
            '401': {
              description: 'Authentication required'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/dashboard/recent-activities',
    handler: getRecentActivitiesHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Dashboard'],
      description: 'Get recent activities',
      notes: 'Returns recent medication administrations, incident reports, and upcoming appointments.',
      validate: {
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(20).default(5).description('Number of activities to return')
        }).unknown(true)
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Recent activities retrieved successfully'
            },
            '401': {
              description: 'Authentication required'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/dashboard/upcoming-appointments',
    handler: getUpcomingAppointmentsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Dashboard'],
      description: 'Get upcoming appointments',
      notes: 'Returns a list of upcoming scheduled appointments.',
      validate: {
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(20).default(5).description('Number of appointments to return')
        }).unknown(true)
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Upcoming appointments retrieved successfully'
            },
            '401': {
              description: 'Authentication required'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/dashboard/chart-data',
    handler: getChartDataHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Dashboard'],
      description: 'Get chart data for visualizations',
      notes: 'Returns data for enrollment trends, medication administration, incident frequency, and appointment trends.',
      validate: {
        query: Joi.object({
          period: Joi.string().valid('week', 'month', 'year').default('week').description('Time period for chart data')
        }).unknown(true)
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Chart data retrieved successfully'
            },
            '401': {
              description: 'Authentication required'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  }
];
