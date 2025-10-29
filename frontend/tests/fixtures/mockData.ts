import { faker } from '@faker-js/faker';

/**
 * Mock data factories for testing
 * These generate realistic test data without using real PHI
 */

export const mockUser = (overrides = {}) => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  role: 'nurse',
  permissions: ['read:students', 'write:medications'],
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const mockStudent = (overrides = {}) => ({
  id: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  dateOfBirth: faker.date.past({ years: 15 }).toISOString().split('T')[0],
  grade: faker.helpers.arrayElement(['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
  status: 'active',
  schoolId: faker.string.uuid(),
  gender: faker.helpers.arrayElement(['male', 'female', 'other', 'prefer-not-to-say']),
  studentId: faker.string.alphanumeric(8).toUpperCase(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const mockMedication = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  name: faker.helpers.arrayElement(['Ibuprofen', 'Acetaminophen', 'Albuterol', 'EpiPen', 'Insulin']),
  dosage: faker.helpers.arrayElement(['200mg', '500mg', '10mg', '0.3mg']),
  frequency: faker.helpers.arrayElement(['Daily', 'Twice daily', 'As needed', 'Every 4 hours']),
  route: faker.helpers.arrayElement(['Oral', 'Injection', 'Inhalation', 'Topical']),
  status: 'active',
  prescribedBy: faker.person.fullName(),
  prescribedDate: faker.date.past().toISOString().split('T')[0],
  expirationDate: faker.date.future().toISOString().split('T')[0],
  instructions: faker.lorem.sentence(),
  sideEffects: faker.lorem.words(3),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const mockMedicationAdministration = (overrides = {}) => ({
  id: faker.string.uuid(),
  medicationId: faker.string.uuid(),
  studentId: faker.string.uuid(),
  administeredBy: faker.string.uuid(),
  administeredAt: faker.date.recent().toISOString(),
  dosage: '200mg',
  notes: faker.lorem.sentence(),
  witnessedBy: faker.string.uuid(),
  status: 'completed',
  createdAt: faker.date.past().toISOString(),
  ...overrides,
});

export const mockAppointment = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  type: faker.helpers.arrayElement(['checkup', 'screening', 'vaccination', 'follow-up']),
  scheduledAt: faker.date.future().toISOString(),
  duration: 30,
  status: 'scheduled',
  notes: faker.lorem.sentence(),
  nurseId: faker.string.uuid(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const mockHealthRecord = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  type: faker.helpers.arrayElement(['vaccination', 'screening', 'illness', 'injury', 'chronic-condition']),
  date: faker.date.past().toISOString().split('T')[0],
  description: faker.lorem.sentence(),
  provider: faker.person.fullName(),
  notes: faker.lorem.paragraph(),
  attachments: [],
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const mockVitalSigns = (overrides = {}) => ({
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
  notes: faker.lorem.sentence(),
  measuredBy: faker.string.uuid(),
  createdAt: faker.date.past().toISOString(),
  ...overrides,
});

export const mockIncident = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  type: faker.helpers.arrayElement(['injury', 'illness', 'behavioral', 'accident']),
  severity: faker.helpers.arrayElement(['minor', 'moderate', 'severe']),
  date: faker.date.recent().toISOString(),
  location: faker.helpers.arrayElement(['Playground', 'Classroom', 'Gym', 'Cafeteria', 'Hallway']),
  description: faker.lorem.paragraph(),
  treatmentProvided: faker.lorem.sentence(),
  reportedBy: faker.string.uuid(),
  witnessedBy: [],
  parentNotified: true,
  parentNotifiedAt: faker.date.recent().toISOString(),
  followUpRequired: faker.datatype.boolean(),
  status: 'resolved',
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const mockEmergencyContact = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  name: faker.person.fullName(),
  relationship: faker.helpers.arrayElement(['Mother', 'Father', 'Guardian', 'Grandparent', 'Other']),
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

export const mockAllergy = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  allergen: faker.helpers.arrayElement(['Peanuts', 'Tree nuts', 'Milk', 'Eggs', 'Shellfish', 'Penicillin', 'Bee stings']),
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

export const mockVaccination = (overrides = {}) => ({
  id: faker.string.uuid(),
  studentId: faker.string.uuid(),
  vaccine: faker.helpers.arrayElement(['MMR', 'DTaP', 'Polio', 'Hepatitis B', 'Varicella', 'Influenza', 'COVID-19']),
  dose: faker.helpers.arrayElement(['1', '2', '3', 'Booster']),
  administeredDate: faker.date.past().toISOString().split('T')[0],
  administeredBy: faker.person.fullName(),
  lotNumber: faker.string.alphanumeric(10).toUpperCase(),
  expirationDate: faker.date.future().toISOString().split('T')[0],
  site: faker.helpers.arrayElement(['Left arm', 'Right arm', 'Left thigh', 'Right thigh']),
  notes: faker.lorem.sentence(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const mockInventoryItem = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  category: faker.helpers.arrayElement(['Medication', 'Supplies', 'Equipment', 'PPE']),
  quantity: faker.number.int({ min: 0, max: 500 }),
  unit: faker.helpers.arrayElement(['Each', 'Box', 'Bottle', 'Case']),
  reorderLevel: faker.number.int({ min: 10, max: 50 }),
  reorderQuantity: faker.number.int({ min: 50, max: 200 }),
  location: faker.helpers.arrayElement(['Main Office', 'Nurse Station', 'Storage Room']),
  expirationDate: faker.date.future().toISOString().split('T')[0],
  lotNumber: faker.string.alphanumeric(10).toUpperCase(),
  vendor: faker.company.name(),
  cost: faker.number.float({ min: 5, max: 500, fractionDigits: 2 }),
  notes: faker.lorem.sentence(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const mockSchool = (overrides = {}) => ({
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

export const mockDistrict = (overrides = {}) => ({
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
 * Create multiple instances of a mock
 */
export const createMockArray = <T>(factory: (overrides?: any) => T, count: number, overrides = {}): T[] => {
  return Array.from({ length: count }, () => factory(overrides));
};

/**
 * Mock API response
 */
export const mockApiResponse = <T>(data: T, success = true) => ({
  success,
  data,
  error: success ? undefined : 'An error occurred',
});

/**
 * Mock paginated API response
 */
export const mockPaginatedResponse = <T>(data: T[], page = 1, limit = 10, total?: number) => ({
  success: true,
  data: {
    items: data,
    pagination: {
      page,
      limit,
      total: total || data.length,
      totalPages: Math.ceil((total || data.length) / limit),
    },
  },
});
