/**
 * Appointments Domain - Complete Integration
 * 
 * Integrated page structure with components, store, and routes.
 */

// Page Components
export { default as Appointments } from './Appointments';
export { default as AppointmentDetail } from './AppointmentDetail';
export { default as AppointmentCreate } from './AppointmentCreate';
export { default as AppointmentSchedule } from './AppointmentSchedule';

// Page-specific Components
export * from './components';

// Page-specific Store
export * from './store';

// Page Routes
export { AppointmentRoutes } from './routes';
