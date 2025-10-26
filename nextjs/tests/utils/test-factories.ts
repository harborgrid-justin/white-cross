/**
 * Test Data Factories
 * Create realistic test data for all healthcare domains
 * Uses @faker-js/faker for generating realistic but synthetic data
 */

import { faker } from '@faker-js/faker';

/**
 * Factory function type
 */
type Factory<T> = (overrides?: Partial<T>) => T;

/**
 * Create array of items using a factory
 */
export function createMany<T>(factory: Factory<T>, count: number, overrides?: Partial<T>): T[] {
  return Array.from({ length: count }, () => factory(overrides));
}

/**
 * User factories
 */
export const createUser: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  role: faker.helpers.arrayElement(['nurse', 'admin', 'principal', 'district-admin']),
  status: 'active',
  permissions: ['read:students', 'write:medications'],
  schoolId: faker.string.uuid(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const createNurse: Factory<any> = (overrides = {}) =>
  createUser({ role: 'nurse', permissions: ['read:students', 'write:medications', 'read:health-records'], ...overrides });

export const createAdmin: Factory<any> = (overrides = {}) =>
  createUser({ role: 'admin', permissions: ['*'], ...overrides });

/**
 * Student factories
 */
export const createStudent: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.alphanumeric(8).toUpperCase(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  dateOfBirth: faker.date.birthdate({ min: 5, max: 18, mode: 'age' }).toISOString().split('T')[0],
  grade: faker.helpers.arrayElement(['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
  gender: faker.helpers.arrayElement(['male', 'female', 'other', 'prefer-not-to-say']),
  status: 'active',
  schoolId: faker.string.uuid(),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  zip: faker.location.zipCode(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

/**
 * Medication factories
 */
export const createMedication: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  name: faker.helpers.arrayElement(['Ibuprofen', 'Acetaminophen', 'Albuterol', 'EpiPen', 'Insulin', 'Methylphenidate']),
  genericName: faker.helpers.arrayElement(['Ibuprofen', 'Paracetamol', 'Salbutamol', 'Epinephrine']),
  dosage: faker.helpers.arrayElement(['200mg', '500mg', '10mg', '0.3mg', '5mg']),
  frequency: faker.helpers.arrayElement(['Daily', 'Twice daily', 'Three times daily', 'As needed', 'Every 4 hours']),
  route: faker.helpers.arrayElement(['Oral', 'Injection', 'Inhalation', 'Topical', 'Sublingual']),
  status: 'active',
  prescribedBy: faker.person.fullName(),
  prescribedDate: faker.date.past().toISOString().split('T')[0],
  expirationDate: faker.date.future().toISOString().split('T')[0],
  instructions: faker.lorem.sentence(),
  sideEffects: faker.lorem.words(5),
  contraindications: faker.lorem.words(3),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const createMedicationAdministration: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  medicationId: faker.string.uuid(),
  studentId: faker.string.uuid(),
  administeredBy: faker.string.uuid(),
  administeredAt: faker.date.recent().toISOString(),
  dosage: '200mg',
  notes: faker.lorem.sentence(),
  witnessedBy: faker.string.uuid(),
  status: 'completed',
  vitalSignsChecked: true,
  createdAt: faker.date.past().toISOString(),
  ...overrides,
});

/**
 * Appointment factories
 */
export const createAppointment: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  type: faker.helpers.arrayElement(['checkup', 'screening', 'vaccination', 'follow-up', 'consultation']),
  scheduledAt: faker.date.future().toISOString(),
  duration: faker.helpers.arrayElement([15, 30, 45, 60]),
  status: faker.helpers.arrayElement(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled']),
  notes: faker.lorem.sentence(),
  nurseId: faker.string.uuid(),
  reason: faker.lorem.words(5),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

/**
 * Health record factories
 */
export const createHealthRecord: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  type: faker.helpers.arrayElement(['vaccination', 'screening', 'illness', 'injury', 'chronic-condition', 'assessment']),
  date: faker.date.past().toISOString().split('T')[0],
  description: faker.lorem.sentence(),
  provider: faker.person.fullName(),
  diagnosis: faker.lorem.words(3),
  treatment: faker.lorem.sentence(),
  notes: faker.lorem.paragraph(),
  attachments: [],
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

/**
 * Vital signs factories
 */
export const createVitalSigns: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  measuredAt: faker.date.recent().toISOString(),
  temperature: faker.number.float({ min: 96.5, max: 99.5, fractionDigits: 1 }),
  bloodPressureSystolic: faker.number.int({ min: 90, max: 130 }),
  bloodPressureDiastolic: faker.number.int({ min: 60, max: 90 }),
  heartRate: faker.number.int({ min: 60, max: 100 }),
  respiratoryRate: faker.number.int({ min: 12, max: 20 }),
  oxygenSaturation: faker.number.int({ min: 95, max: 100 }),
  weight: faker.number.float({ min: 50, max: 200, fractionDigits: 1 }),
  height: faker.number.float({ min: 48, max: 72, fractionDigits: 1 }),
  bmi: faker.number.float({ min: 16, max: 30, fractionDigits: 1 }),
  notes: faker.lorem.sentence(),
  measuredBy: faker.string.uuid(),
  createdAt: faker.date.past().toISOString(),
  ...overrides,
});

/**
 * Incident factories
 */
export const createIncident: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  type: faker.helpers.arrayElement(['injury', 'illness', 'behavioral', 'accident', 'medical-emergency']),
  severity: faker.helpers.arrayElement(['minor', 'moderate', 'severe', 'critical']),
  date: faker.date.recent().toISOString(),
  location: faker.helpers.arrayElement(['Playground', 'Classroom', 'Gym', 'Cafeteria', 'Hallway', 'Bathroom']),
  description: faker.lorem.paragraph(),
  treatmentProvided: faker.lorem.sentence(),
  reportedBy: faker.string.uuid(),
  witnessedBy: [],
  parentNotified: true,
  parentNotifiedAt: faker.date.recent().toISOString(),
  followUpRequired: faker.datatype.boolean(),
  followUpNotes: faker.lorem.sentence(),
  status: faker.helpers.arrayElement(['new', 'in-progress', 'resolved', 'closed']),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

/**
 * Emergency contact factories
 */
export const createEmergencyContact: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  name: faker.person.fullName(),
  relationship: faker.helpers.arrayElement(['Mother', 'Father', 'Guardian', 'Grandparent', 'Stepparent', 'Other']),
  phone: faker.phone.number(),
  alternatePhone: faker.phone.number(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  zip: faker.location.zipCode(),
  isPrimary: faker.datatype.boolean(),
  canPickup: true,
  notes: faker.lorem.sentence(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

/**
 * Allergy factories
 */
export const createAllergy: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  allergen: faker.helpers.arrayElement(['Peanuts', 'Tree nuts', 'Milk', 'Eggs', 'Shellfish', 'Soy', 'Wheat', 'Penicillin', 'Bee stings']),
  severity: faker.helpers.arrayElement(['mild', 'moderate', 'severe', 'life-threatening']),
  reaction: faker.lorem.sentence(),
  diagnosedDate: faker.date.past().toISOString().split('T')[0],
  diagnosedBy: faker.person.fullName(),
  treatment: faker.lorem.sentence(),
  notes: faker.lorem.sentence(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

/**
 * Immunization factories
 */
export const createImmunization: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  vaccine: faker.helpers.arrayElement(['MMR', 'DTaP', 'Polio', 'Hepatitis B', 'Varicella', 'Influenza', 'COVID-19', 'HPV']),
  dose: faker.helpers.arrayElement(['1', '2', '3', 'Booster']),
  administeredDate: faker.date.past().toISOString().split('T')[0],
  administeredBy: faker.person.fullName(),
  lotNumber: faker.string.alphanumeric(10).toUpperCase(),
  manufacturer: faker.helpers.arrayElement(['Pfizer', 'Moderna', 'Merck', 'GSK']),
  expirationDate: faker.date.future().toISOString().split('T')[0],
  site: faker.helpers.arrayElement(['Left arm', 'Right arm', 'Left thigh', 'Right thigh']),
  notes: faker.lorem.sentence(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

/**
 * Clinic visit factories
 */
export const createClinicVisit: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  checkInTime: faker.date.recent().toISOString(),
  checkOutTime: null,
  reason: faker.helpers.arrayElement(['Headache', 'Stomach ache', 'Injury', 'Medication', 'Fever', 'Nausea']),
  chiefComplaint: faker.lorem.sentence(),
  symptoms: faker.lorem.words(5),
  status: faker.helpers.arrayElement(['waiting', 'in-progress', 'completed']),
  nurseId: faker.string.uuid(),
  vitalSigns: null,
  assessment: faker.lorem.paragraph(),
  treatment: faker.lorem.sentence(),
  disposition: faker.helpers.arrayElement(['Returned to class', 'Sent home', 'Referred to parent', 'Emergency services called']),
  notes: faker.lorem.paragraph(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

/**
 * School factories
 */
export const createSchool: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: `${faker.location.city()} ${faker.helpers.arrayElement(['Elementary', 'Middle', 'High'])} School`,
  districtId: faker.string.uuid(),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  zip: faker.location.zipCode(),
  phone: faker.phone.number(),
  email: faker.internet.email(),
  principal: faker.person.fullName(),
  studentCount: faker.number.int({ min: 200, max: 1500 }),
  grades: ['K', '1', '2', '3', '4', '5'],
  status: 'active',
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

/**
 * District factories
 */
export const createDistrict: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: `${faker.location.city()} School District`,
  superintendent: faker.person.fullName(),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  zip: faker.location.zipCode(),
  phone: faker.phone.number(),
  email: faker.internet.email(),
  website: faker.internet.url(),
  schoolCount: faker.number.int({ min: 5, max: 50 }),
  status: 'active',
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

/**
 * Audit log factories
 */
export const createAuditLog: Factory<any> = (overrides = {}) => ({
  id: faker.string.uuid(),
  action: faker.helpers.arrayElement(['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']),
  resource: faker.helpers.arrayElement(['student', 'medication', 'health-record', 'appointment', 'user']),
  resourceId: faker.string.uuid(),
  userId: faker.string.uuid(),
  userName: faker.person.fullName(),
  timestamp: faker.date.recent().toISOString(),
  ipAddress: faker.internet.ip(),
  userAgent: faker.internet.userAgent(),
  details: {
    fields: ['firstName', 'lastName'],
    changes: {},
  },
  ...overrides,
});

/**
 * API Response factories
 */
export const createApiResponse = <T>(data: T, success = true) => ({
  success,
  data,
  error: success ? undefined : 'An error occurred',
  timestamp: new Date().toISOString(),
});

export const createPaginatedResponse = <T>(items: T[], page = 1, limit = 10, total?: number) => ({
  success: true,
  data: {
    items,
    pagination: {
      page,
      limit,
      total: total || items.length,
      totalPages: Math.ceil((total || items.length) / limit),
      hasNext: page * limit < (total || items.length),
      hasPrev: page > 1,
    },
  },
});

export const createErrorResponse = (message: string, code?: string) => ({
  success: false,
  error: {
    message,
    code,
    timestamp: new Date().toISOString(),
  },
});
