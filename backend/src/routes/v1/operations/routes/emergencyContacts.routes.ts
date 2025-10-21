/**
 * Emergency Contacts Routes
 * HTTP endpoints for emergency contact management and notifications
 * All routes prefixed with /api/v1/emergency-contacts
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { EmergencyContactsController } from '../controllers/emergencyContacts.controller';
import {
  createEmergencyContactSchema,
  updateEmergencyContactSchema,
  sendEmergencyNotificationSchema,
  verifyContactSchema,
  contactIdParamSchema,
  studentIdParamSchema
} from '../validators/emergencyContacts.validators';

/**
 * EMERGENCY CONTACT CRUD ROUTES
 */

const getStudentContactsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/emergency-contacts/student/{studentId}',
  handler: asyncHandler(EmergencyContactsController.getStudentContacts),
  options: {
    auth: 'jwt',
    tags: ['api', 'EmergencyContacts', 'Operations', 'v1'],
    description: 'Get all emergency contacts for a student',
    notes: '**PHI Protected Endpoint** - Returns all active emergency contacts for a student, ordered by priority (PRIMARY, SECONDARY, EMERGENCY_ONLY). Includes contact details, notification preferences, and pickup authorization status.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Emergency contacts retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
        }
      }
    }
  }
};

const getContactByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/emergency-contacts/{id}',
  handler: asyncHandler(EmergencyContactsController.getById),
  options: {
    auth: 'jwt',
    tags: ['api', 'EmergencyContacts', 'Operations', 'v1'],
    description: 'Get emergency contact by ID',
    notes: '**PHI Protected Endpoint** - Returns detailed information for a specific emergency contact including verification status and notification preferences.',
    validate: {
      params: contactIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Emergency contact retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Contact not found' }
        }
      }
    }
  }
};

const createContactRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/emergency-contacts',
  handler: asyncHandler(EmergencyContactsController.create),
  options: {
    auth: 'jwt',
    tags: ['api', 'EmergencyContacts', 'Operations', 'v1'],
    description: 'Create new emergency contact',
    notes: '**PHI Protected Endpoint** - Adds a new emergency contact for a student. Business rules: Maximum 2 PRIMARY contacts per student. Phone number required (minimum 10 digits). Email required if email notification channel is selected. Validates priority constraints to ensure student always has at least one PRIMARY contact.',
    validate: {
      payload: createEmergencyContactSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Emergency contact created successfully' },
          '400': { description: 'Validation error - Invalid contact data or business rule violation' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' },
          '409': { description: 'Conflict - Maximum PRIMARY contacts reached' }
        }
      }
    }
  }
};

const updateContactRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/emergency-contacts/{id}',
  handler: asyncHandler(EmergencyContactsController.update),
  options: {
    auth: 'jwt',
    tags: ['api', 'EmergencyContacts', 'Operations', 'v1'],
    description: 'Update emergency contact',
    notes: '**PHI Protected Endpoint** - Updates emergency contact information. Business rules: Cannot remove last PRIMARY contact. Cannot deactivate last active PRIMARY contact. Must maintain email address if email notification channel is enabled. All changes are audited for compliance.',
    validate: {
      params: contactIdParamSchema,
      payload: updateEmergencyContactSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Emergency contact updated successfully' },
          '400': { description: 'Validation error - Invalid update data or business rule violation' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Contact not found' },
          '409': { description: 'Conflict - Business rule violation (e.g., removing last PRIMARY)' }
        }
      }
    }
  }
};

const deleteContactRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/emergency-contacts/{id}',
  handler: asyncHandler(EmergencyContactsController.delete),
  options: {
    auth: 'jwt',
    tags: ['api', 'EmergencyContacts', 'Operations', 'v1'],
    description: 'Delete emergency contact (soft delete)',
    notes: '**PHI Protected Endpoint** - Soft-deletes an emergency contact by setting isActive=false. Cannot delete the only active PRIMARY contact - student must have at least one active PRIMARY contact for emergency situations. Historical records are preserved for audit trail.',
    validate: {
      params: contactIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Emergency contact deleted successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Contact not found' },
          '409': { description: 'Conflict - Cannot delete last PRIMARY contact' }
        }
      }
    }
  }
};

/**
 * NOTIFICATION ROUTES
 */

const sendEmergencyNotificationRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/emergency-contacts/student/{studentId}/notify',
  handler: asyncHandler(EmergencyContactsController.sendEmergencyNotification),
  options: {
    auth: 'jwt',
    tags: ['api', 'EmergencyContacts', 'Notifications', 'Operations', 'v1'],
    description: 'Send emergency notification to all contacts for a student',
    notes: '**CRITICAL PHI ENDPOINT** - Sends emergency notification to all active contacts for a student through specified channels (SMS, email, voice). Contacts are notified in priority order. Returns success/failure status for each contact and channel. Used for medical emergencies, incidents, and urgent health communications. All notifications are logged for audit trail.',
    validate: {
      params: studentIdParamSchema,
      payload: sendEmergencyNotificationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Notifications sent (check individual results for delivery status)' },
          '400': { description: 'Validation error - Invalid notification data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found or no emergency contacts available' }
        }
      }
    }
  }
};

const sendContactNotificationRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/emergency-contacts/{id}/notify',
  handler: asyncHandler(EmergencyContactsController.sendContactNotification),
  options: {
    auth: 'jwt',
    tags: ['api', 'EmergencyContacts', 'Notifications', 'Operations', 'v1'],
    description: 'Send notification to specific contact',
    notes: '**PHI Protected Endpoint** - Sends notification to a specific emergency contact through specified channels. Used for targeted communications (e.g., medication reminders to primary guardian, appointment confirmations). Returns delivery status for each channel attempted. All notifications logged for compliance.',
    validate: {
      params: contactIdParamSchema,
      payload: sendEmergencyNotificationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Notification sent (check result for delivery status)' },
          '400': { description: 'Validation error - Invalid notification data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Contact not found or inactive' }
        }
      }
    }
  }
};

/**
 * VERIFICATION & STATISTICS ROUTES
 */

const verifyContactRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/emergency-contacts/{id}/verify',
  handler: asyncHandler(EmergencyContactsController.verifyContact),
  options: {
    auth: 'jwt',
    tags: ['api', 'EmergencyContacts', 'Operations', 'v1'],
    description: 'Verify emergency contact information',
    notes: '**PHI Protected Endpoint** - Sends verification code to emergency contact via chosen method (SMS, email, or voice). Used to confirm contact information is current and accurate. Critical for ensuring emergency communications reach the right person. Verification status is tracked for compliance and quality assurance.',
    validate: {
      params: contactIdParamSchema,
      payload: verifyContactSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Verification code sent successfully' },
          '400': { description: 'Validation error - Invalid method or contact details unavailable' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Contact not found' }
        }
      }
    }
  }
};

const getStatisticsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/emergency-contacts/statistics',
  handler: asyncHandler(EmergencyContactsController.getStatistics),
  options: {
    auth: 'jwt',
    tags: ['api', 'EmergencyContacts', 'Operations', 'Analytics', 'v1'],
    description: 'Get emergency contact statistics',
    notes: 'Returns aggregate statistics for emergency contacts including total contacts, breakdown by priority level, and count of students without emergency contacts (critical for compliance). Used for dashboard displays and administrative reporting. No PHI exposed in aggregated data.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Statistics retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' }
        }
      }
    }
  }
};

/**
 * EXPORT ROUTES
 */

export const emergencyContactsRoutes: ServerRoute[] = [
  // CRUD operations
  getStudentContactsRoute,
  getContactByIdRoute,
  createContactRoute,
  updateContactRoute,
  deleteContactRoute,

  // Notifications
  sendEmergencyNotificationRoute,
  sendContactNotificationRoute,

  // Verification & statistics
  verifyContactRoute,
  getStatisticsRoute
];
