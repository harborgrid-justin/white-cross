/**
 * TEST HELPERS - Shared Testing Utilities
 *
 * Common test utilities for healthcare downstream composites testing
 * Including date helpers, validation helpers, and mock data generators
 */

/**
 * Generate a future date for testing
 */
export function futureDate(daysFromNow: number = 1): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
}

/**
 * Generate a past date for testing
 */
export function pastDate(daysAgo: number = 1): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}

/**
 * Generate a date for testing at specific time
 */
export function dateAtTime(hour: number, minute: number = 0): Date {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

/**
 * Check if a date is within a range
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

/**
 * Generate random patient ID
 */
export function generatePatientId(): string {
  return `patient-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Generate random medication ID
 */
export function generateMedicationId(): string {
  return `med-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Generate random provider ID
 */
export function generateProviderId(): string {
  return `provider-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Generate random appointment ID
 */
export function generateAppointmentId(): string {
  return `appt-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Generate random barcode
 */
export function generateBarcode(prefix: string = 'BC'): string {
  return `${prefix}-${Math.floor(Math.random() * 1000000000)}`;
}

/**
 * Generate random DEA number
 */
export function generateDEANumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter1 = letters.charAt(Math.floor(Math.random() * letters.length));
  const letter2 = letters.charAt(Math.floor(Math.random() * letters.length));
  const numbers = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${letter1}${letter2}${numbers}`;
}

/**
 * Generate random NPI number
 */
export function generateNPI(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

/**
 * Generate random MRN (Medical Record Number)
 */
export function generateMRN(): string {
  return `MRN-${Math.floor(100000 + Math.random() * 900000)}`;
}

/**
 * Generate random SSN for testing (fake format)
 */
export function generateFakeSSN(): string {
  const area = Math.floor(100 + Math.random() * 899);
  const group = Math.floor(10 + Math.random() * 89);
  const serial = Math.floor(1000 + Math.random() * 8999);
  return `${area}-${group}-${serial}`;
}

/**
 * Validate medication barcode format
 */
export function isValidMedicationBarcode(barcode: string): boolean {
  return /^MED-\d{9}$/.test(barcode);
}

/**
 * Validate patient barcode format
 */
export function isValidPatientBarcode(barcode: string): boolean {
  return /^PAT-\d{9}$/.test(barcode);
}

/**
 * Validate DEA number format
 */
export function isValidDEANumber(dea: string): boolean {
  return /^[A-Z]{2}\d{7}$/.test(dea);
}

/**
 * Validate NPI format
 */
export function isValidNPI(npi: string): boolean {
  return /^\d{10}$/.test(npi);
}

/**
 * Sleep helper for testing async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create mock logger for testing
 */
export function createMockLogger() {
  return {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };
}

/**
 * Extract error message from thrown error
 */
export function extractErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'Unknown error';
}

/**
 * Check if error is of specific type
 */
export function isErrorOfType(error: any, errorType: new (...args: any[]) => Error): boolean {
  return error instanceof errorType;
}

/**
 * Generate HIPAA-compliant test data (de-identified)
 */
export function generateHIPAACompliantTestData() {
  return {
    patientId: generatePatientId(),
    mrn: generateMRN(),
    // No actual PHI - all synthetic
    testDate: new Date(),
    facilityId: 'facility-test-001',
  };
}

/**
 * Validate HIPAA identifiers are removed
 */
export function validateNoHIPAAIdentifiers(data: any): boolean {
  const dataString = JSON.stringify(data).toLowerCase();

  // Check for common PHI patterns
  const ssnPattern = /\d{3}-\d{2}-\d{4}/;
  const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/;
  const phonePattern = /\d{3}-\d{3}-\d{4}/;

  return !(ssnPattern.test(dataString) ||
           emailPattern.test(dataString) ||
           phonePattern.test(dataString));
}

/**
 * Create test context for NestJS testing
 */
export function createTestContext() {
  return {
    user: {
      id: 'test-user-123',
      role: 'clinician',
      permissions: ['read', 'write'],
    },
    facility: {
      id: 'facility-001',
      name: 'Test Medical Center',
    },
    timestamp: new Date(),
  };
}

/**
 * Assert array contains specific items
 */
export function assertArrayContains<T>(array: T[], items: T[]): boolean {
  return items.every(item => array.includes(item));
}

/**
 * Assert object has required properties
 */
export function assertHasProperties(obj: any, properties: string[]): boolean {
  return properties.every(prop => obj.hasOwnProperty(prop));
}

/**
 * Generate random clinical note
 */
export function generateClinicalNote(): string {
  const templates = [
    'Patient presents with symptoms consistent with diagnosis.',
    'Clinical assessment completed. Treatment plan established.',
    'Follow-up appointment scheduled. Patient education provided.',
    'Vitals stable. Continue current treatment regimen.',
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate ICD-10 code (mock)
 */
export function generateICD10Code(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter = letters.charAt(Math.floor(Math.random() * letters.length));
  const numbers = Math.floor(10 + Math.random() * 89);
  return `${letter}${numbers}.${Math.floor(Math.random() * 10)}`;
}

/**
 * Generate CPT code (mock)
 */
export function generateCPTCode(): string {
  return (99200 + Math.floor(Math.random() * 700)).toString();
}

/**
 * Generate NDC code (mock)
 */
export function generateNDCCode(): string {
  const part1 = Math.floor(10000 + Math.random() * 89999);
  const part2 = Math.floor(100 + Math.random() * 899);
  const part3 = Math.floor(10 + Math.random() * 89);
  return `${part1}-${part2}-${part3}`;
}
