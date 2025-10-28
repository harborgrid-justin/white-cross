/**
 * Analytics Routes
 * HTTP endpoints for health metrics, analytics, and reporting
 * All routes prefixed with /api/v1/analytics
 * HIPAA Compliance: Aggregated health data analysis with PHI protection
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { AnalyticsController } from '../controllers/analytics.controller';
import {
  getHealthMetricsQuerySchema,
  getHealthTrendsQuerySchema,
  getStudentHealthMetricsParamSchema,
  getStudentHealthMetricsQuerySchema,
  getSchoolMetricsParamSchema,
  getSchoolMetricsQuerySchema,
  getIncidentTrendsQuerySchema,
  getIncidentsByLocationQuerySchema,
  getMedicationUsageQuerySchema,
  getMedicationAdherenceQuerySchema,
  getAppointmentTrendsQuerySchema,
  getNoShowRateQuerySchema,
  getNurseDashboardQuerySchema,
  getAdminDashboardQuerySchema,
  getPlatformSummaryQuerySchema,
  generateCustomReportSchema,
  getReportParamSchema,
  getReportQuerySchema
} from '../validators/analytics.validators';

/**
 * BASE METADATA ROUTE
 */

const getAnalyticsMetadataRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics',
  handler: async (request, h) => {
    return h.response({
      success: true,
      data: {
        module: 'Analytics',
        version: '1.0.0',
        description: 'Comprehensive health metrics, analytics, and reporting for school healthcare operations',
        endpoints: 17,
        categories: [
          {
            name: 'Health Metrics & Trends',
            endpoints: 4,
            description: 'Aggregated health data and trend analysis'
          },
          {
            name: 'Incident Analytics',
            endpoints: 2,
            description: 'Safety incident patterns and location-based analysis'
          },
          {
            name: 'Medication Analytics',
            endpoints: 2,
            description: 'Medication usage and adherence tracking'
          },
          {
            name: 'Appointment Analytics',
            endpoints: 2,
            description: 'Appointment trends and no-show rate analysis'
          },
          {
            name: 'Dashboards',
            endpoints: 3,
            description: 'Real-time operational dashboards for nurses and admins'
          },
          {
            name: 'Custom Reports',
            endpoints: 2,
            description: 'Flexible custom report generation and retrieval'
          }
        ],
        capabilities: [
          'Health metrics aggregation',
          'Time-series trend analysis',
          'Incident pattern identification',
          'Medication usage tracking',
          'Adherence monitoring',
          'Appointment analytics',
          'Real-time dashboards',
          'Custom report generation',
          'Compliance reporting',
          'Predictive insights'
        ],
        authentication: 'JWT required for all endpoints',
        compliance: 'HIPAA-compliant with PHI protection'
      }
    }).code(200);
  },
  options: {
    auth: false,
    tags: ['api', 'Analytics', 'Metadata', 'v1'],
    description: 'Get analytics module metadata and available endpoints',
    notes: 'Returns information about the analytics module including available endpoint categories, capabilities, and authentication requirements. No authentication required for metadata access.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Analytics module metadata retrieved successfully'
          }
        }
      }
    }
  }
};

/**
 * HEALTH METRICS & TRENDS ROUTES
 */

const getHealthMetricsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/health-metrics',
  handler: asyncHandler(AnalyticsController.getHealthMetrics),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Health Metrics', 'v1'],
    description: 'Get aggregated health metrics',
    notes: 'Returns comprehensive health metrics for specified time period. Includes visit counts, incident rates, medication administration counts, chronic condition prevalence, immunization compliance, and emergency contact coverage. Supports school/district-level aggregation and period-over-period comparison. Essential for population health management and performance tracking.',
    validate: {
      query: getHealthMetricsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Health metrics retrieved successfully' },
          '400': { description: 'Invalid query parameters' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const getHealthTrendsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/health-trends',
  handler: asyncHandler(AnalyticsController.getHealthTrends),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Health Metrics', 'Trends', 'v1'],
    description: 'Get health trend analysis',
    notes: 'Provides time-series trend analysis for health conditions and medications. Tracks changes over time with daily/weekly/monthly/quarterly/yearly aggregation. Identifies seasonal patterns, emerging health issues, and medication usage trends. Supports optional predictive forecasting for proactive health management. Critical for identifying outbreaks and planning interventions.',
    validate: {
      query: getHealthTrendsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Health trends retrieved successfully' },
          '400': { description: 'Invalid query parameters' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const getStudentHealthMetricsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/health-metrics/student/{studentId}',
  handler: asyncHandler(AnalyticsController.getStudentHealthMetrics),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Health Metrics', 'Students', 'v1'],
    description: 'Get student health trends',
    notes: '**PHI ENDPOINT** - Returns detailed health trend data for individual student. Includes vital signs history, health visit patterns, medication adherence, chronic condition management, and growth metrics. Requires proper authorization and access logging per HIPAA. Used for personalized health tracking and care plan monitoring.',
    validate: {
      params: getStudentHealthMetricsParamSchema,
      query: getStudentHealthMetricsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Student health metrics retrieved successfully' },
          '400': { description: 'Invalid student ID' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Insufficient permissions for student data' },
          '404': { description: 'Student not found' }
        }
      }
    }
  }
};

const getSchoolMetricsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/health-metrics/school/{schoolId}',
  handler: asyncHandler(AnalyticsController.getSchoolMetrics),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Health Metrics', 'Schools', 'v1'],
    description: 'Get school-wide health metrics',
    notes: 'Comprehensive school-level health analytics dashboard. Includes population health summary, immunization compliance by vaccine and grade, incident analysis by type/location/time, chronic condition management, and medication usage patterns. Supports grade-level filtering and district-wide comparisons. Essential for school health program evaluation and resource planning.',
    validate: {
      params: getSchoolMetricsParamSchema,
      query: getSchoolMetricsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'School metrics retrieved successfully' },
          '400': { description: 'Invalid school ID' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Insufficient permissions for school data' },
          '404': { description: 'School not found' }
        }
      }
    }
  }
};

/**
 * INCIDENT ANALYTICS ROUTES
 */

const getIncidentTrendsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/incidents/trends',
  handler: asyncHandler(AnalyticsController.getIncidentTrends),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Incidents', 'Trends', 'v1'],
    description: 'Get incident trends',
    notes: 'Analyzes incident patterns over time with multiple grouping options (type, location, time of day, day of week, severity). Identifies high-risk areas, peak incident times, and seasonal patterns. Tracks incident rate trends (increasing/decreasing/stable). Used for safety planning, staff allocation, and preventive interventions. Supports filtering by incident type and severity.',
    validate: {
      query: getIncidentTrendsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Incident trends retrieved successfully' },
          '400': { description: 'Invalid query parameters' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const getIncidentsByLocationRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/incidents/by-location',
  handler: asyncHandler(AnalyticsController.getIncidentsByLocation),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Incidents', 'Location', 'v1'],
    description: 'Get incidents by location',
    notes: 'Spatial analysis of incident distribution across school facilities. Identifies high-incident areas (playground, gymnasium, cafeteria, etc.) for targeted safety interventions. Optional heat map visualization for facilities planning. Used for facility risk assessment, supervision planning, and safety equipment placement. Supports location-specific filtering.',
    validate: {
      query: getIncidentsByLocationQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Location-based incident data retrieved successfully' },
          '400': { description: 'Invalid query parameters' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

/**
 * MEDICATION ANALYTICS ROUTES
 */

const getMedicationUsageRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/medications/usage',
  handler: asyncHandler(AnalyticsController.getMedicationUsage),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Medications', 'Usage', 'v1'],
    description: 'Get medication usage statistics',
    notes: 'Comprehensive medication administration analytics. Tracks most-administered medications, usage by category (bronchodilators, stimulants, NSAIDs, etc.), administration frequency, and trends. Includes adherence rate calculations and common administration reasons. Essential for inventory management, controlled substance tracking, and identifying medication needs. Supports grouping by medication, category, student, or time.',
    validate: {
      query: getMedicationUsageQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Medication usage statistics retrieved successfully' },
          '400': { description: 'Invalid query parameters' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const getMedicationAdherenceRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/medications/adherence',
  handler: asyncHandler(AnalyticsController.getMedicationAdherence),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Medications', 'Adherence', 'v1'],
    description: 'Get medication adherence rates',
    notes: 'Medication adherence monitoring and compliance tracking. Calculates adherence percentages for chronic medications, identifies students below adherence threshold, tracks missed doses, and analyzes adherence trends. Supports student-specific and medication-specific filtering. Critical for chronic disease management, parent communication about medication compliance, and health outcome optimization.',
    validate: {
      query: getMedicationAdherenceQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Medication adherence data retrieved successfully' },
          '400': { description: 'Invalid query parameters' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

/**
 * APPOINTMENT ANALYTICS ROUTES
 */

const getAppointmentTrendsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/appointments/trends',
  handler: asyncHandler(AnalyticsController.getAppointmentTrends),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Appointments', 'Trends', 'v1'],
    description: 'Get appointment trends',
    notes: 'Appointment scheduling and completion analytics. Tracks appointment volume by type (screening, medication check, follow-up, immunization), completion rates, cancellation rates, and seasonal patterns. Analyzes trends by day/week/month and appointment status (scheduled, completed, cancelled, no-show). Used for capacity planning, appointment scheduling optimization, and identifying access barriers.',
    validate: {
      query: getAppointmentTrendsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Appointment trends retrieved successfully' },
          '400': { description: 'Invalid query parameters' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const getNoShowRateRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/appointments/no-show-rate',
  handler: asyncHandler(AnalyticsController.getNoShowRate),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Appointments', 'No-Show', 'v1'],
    description: 'Get appointment no-show statistics',
    notes: 'Detailed no-show rate analysis and root cause identification. Calculates overall and type-specific no-show rates, tracks reasons for missed appointments (student absent, no consent, scheduling conflict), compares against target rates, and identifies trends. Includes actionable insights for reducing no-shows. Critical for appointment policy optimization and parent communication strategies.',
    validate: {
      query: getNoShowRateQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'No-show statistics retrieved successfully' },
          '400': { description: 'Invalid query parameters' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

/**
 * DASHBOARD & SUMMARY ROUTES
 */

const getNurseDashboardRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/dashboard/nurse',
  handler: asyncHandler(AnalyticsController.getNurseDashboard),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Dashboard', 'Nurse', 'v1'],
    description: 'Get nurse dashboard data',
    notes: 'Real-time operational dashboard for school nurses. Displays today\'s/this week\'s key metrics: total patients, active appointments, critical alerts, bed occupancy, average vital signs, and department status. Includes active health alerts (tachycardia, fever, hypoxemia, etc.) prioritized by severity. Shows upcoming tasks (medication administrations, screenings, follow-ups) with time and priority. Essential daily tool for nursing workflow management.',
    validate: {
      query: getNurseDashboardQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Nurse dashboard data retrieved successfully' },
          '400': { description: 'Invalid query parameters' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const getAdminDashboardRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/dashboard/admin',
  handler: asyncHandler(AnalyticsController.getAdminDashboard),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Dashboard', 'Admin', 'v1'],
    description: 'Get admin dashboard data',
    notes: 'Executive-level healthcare analytics dashboard for administrators. Provides population health summary, compliance metrics (immunization, documentation, training, audit readiness), predictive insights (outbreak risk, stock shortages, capacity warnings), and top health conditions/medications. Supports district and school-level views with month/quarter/year time ranges. Optional financial data integration. Used for strategic planning and compliance oversight.',
    validate: {
      query: getAdminDashboardQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Admin dashboard data retrieved successfully' },
          '400': { description: 'Invalid query parameters' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' }
        }
      }
    }
  }
};

const getPlatformSummaryRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/summary',
  handler: asyncHandler(AnalyticsController.getPlatformSummary),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Summary', 'Platform', 'v1'],
    description: 'Get overall platform summary',
    notes: 'System-wide health platform analytics. Aggregates data across districts and schools: total students, health visits, medication administrations, incidents, immunization compliance. Shows system-wide alerts and operational status. Supports multi-school/district filtering. Used for district-level reporting, board presentations, and system health monitoring. Provides big-picture view of healthcare operations.',
    validate: {
      query: getPlatformSummaryQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Platform summary retrieved successfully' },
          '400': { description: 'Invalid query parameters' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

/**
 * CUSTOM REPORT ROUTES
 */

const generateCustomReportRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/analytics/reports/custom',
  handler: asyncHandler(AnalyticsController.generateCustomReport),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Reports', 'Custom', 'v1'],
    description: 'Generate custom report',
    notes: 'Flexible custom report generation with multiple report types and formats. Supports: Health Metrics, Incident Analysis, Medication Usage, Appointment Summary, Compliance Status, Student Health Summary, and Immunization Reports. Output formats: JSON, PDF, CSV, XLSX. Configurable date ranges, filters (school, district, grade, students), and optional features (charts, trends, comparisons). Can schedule recurring reports and email to recipients. Generated reports are stored and accessible via report ID.',
    validate: {
      payload: generateCustomReportSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Custom report generated successfully' },
          '400': { description: 'Invalid report parameters' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Report generation failed' }
        }
      }
    }
  }
};

const getGeneratedReportRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/analytics/reports/{id}',
  handler: asyncHandler(AnalyticsController.getGeneratedReport),
  options: {
    auth: 'jwt',
    tags: ['api', 'Analytics', 'Reports', 'v1'],
    description: 'Get generated report',
    notes: 'Retrieves previously generated report by ID. Returns full report data including sections, findings, recommendations, charts, and tables. Supports metadata-only mode (includeData=false) for listing reports without downloading large datasets. Can override output format on retrieval. Used for accessing historical reports, compliance documentation, and scheduled report delivery.',
    validate: {
      params: getReportParamSchema,
      query: getReportQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Report retrieved successfully' },
          '400': { description: 'Invalid report ID' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Report not found' }
        }
      }
    }
  }
};

/**
 * EXPORT ALL ROUTES
 */

export const analyticsRoutes: ServerRoute[] = [
  // Base metadata (1 route)
  getAnalyticsMetadataRoute,

  // Health metrics & trends (4 routes)
  getHealthMetricsRoute,
  getHealthTrendsRoute,
  getStudentHealthMetricsRoute,
  getSchoolMetricsRoute,

  // Incident analytics (2 routes)
  getIncidentTrendsRoute,
  getIncidentsByLocationRoute,

  // Medication analytics (2 routes)
  getMedicationUsageRoute,
  getMedicationAdherenceRoute,

  // Appointment analytics (2 routes)
  getAppointmentTrendsRoute,
  getNoShowRateRoute,

  // Dashboard & summaries (3 routes)
  getNurseDashboardRoute,
  getAdminDashboardRoute,
  getPlatformSummaryRoute,

  // Custom reports (2 routes)
  generateCustomReportRoute,
  getGeneratedReportRoute
];
