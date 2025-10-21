/**
 * Operations Module Routes
 * Aggregates all operations module routes (students, appointments, inventory, etc.)
 */

import { ServerRoute } from '@hapi/hapi';
import { studentsRoutes } from './routes/students.routes';
import { emergencyContactsRoutes } from './routes/emergencyContacts.routes';
import { appointmentsRoutes } from './routes/appointments.routes';
import { inventoryRoutes } from './routes/inventory.routes';
import { studentManagementRoutes } from './routes/studentManagement.routes';

/**
 * All operations module routes
 *
 * Currently includes:
 * - Students (11 endpoints) - Complete
 * - Emergency Contacts (9 endpoints) - Complete
 * - Appointments (18 endpoints) - Complete
 * - Inventory (19 endpoints) - Complete
 * - Student Management (11 endpoints) - Complete
 *
 * Total: 68 endpoints in Operations module
 *
 * Student Management includes:
 * - Student Photo Management (2 endpoints)
 * - Academic Transcripts (3 endpoints) 
 * - Grade Transitions (2 endpoints)
 * - Barcode Scanning (2 endpoints)
 * - Waitlist Management (2 endpoints)
 *
 * Future additions:
 * - Class/Grade Management
 * - School Calendar Events
 */
export const operationsRoutes: ServerRoute[] = [
  ...studentsRoutes,
  ...emergencyContactsRoutes,
  ...appointmentsRoutes,
  ...inventoryRoutes,
  ...studentManagementRoutes
];
