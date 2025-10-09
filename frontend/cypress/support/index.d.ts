/// <reference types="cypress" />

// Type definitions for custom Cypress commands
declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to login as a specific user type
     * @param userType - The type of user (nurse, admin, doctor)
     * @example cy.login('nurse')
     */
    login(userType: string): Chainable<void>

    /**
     * Custom command to login with custom email and password
     * @param email - User email address
     * @param password - User password
     * @example cy.loginAs('nurse@school.edu', 'testNursePassword')
     */
    loginAs(email: string, password: string): Chainable<void>

    /**
     * Custom command to create a new student
     * @param studentData - Student information object
     * @example cy.createStudent(studentData)
     */
    createStudent(studentData: StudentData): Chainable<void>

    /**
     * Custom command to create a new appointment
     * @param appointmentData - Appointment information object
     * @example cy.createAppointment(appointmentData)
     */
    createAppointment(appointmentData: AppointmentData): Chainable<void>

    /**
     * Custom command to add a medication
     * @param medicationData - Medication information object
     * @example cy.addMedication(medicationData)
     */
    addMedication(medicationData: MedicationData): Chainable<void>

    /**
     * Custom command to navigate to a specific page
     * @param page - The page to navigate to
     * @example cy.navigateTo('students')
     */
    navigateTo(page: string): Chainable<void>

    /**
     * Custom command to check basic accessibility requirements
     * @example cy.shouldBeAccessible()
     */
    shouldBeAccessible(): Chainable<void>

    /**
     * Custom command to preserve session state
     * @example cy.preserveSession()
     */
    preserveSession(): Chainable<void>

    /**
     * Custom command to wait for healthcare data to load
     * @example cy.waitForHealthcareData()
     */
    waitForHealthcareData(): Chainable<void>

    /**
     * Custom command to mount healthcare components for testing
     * @param componentName - Name of the component to mount
     * @example cy.mountHealthcareComponent('StudentForm')
     */
    mountHealthcareComponent(componentName: string): Chainable<void>

    /**
     * Custom command to verify healthcare UI rendering
     * @example cy.shouldRenderHealthcareUI()
     */
    shouldRenderHealthcareUI(): Chainable<void>
  }
}

// Type definitions for test data
interface UserData {
  email: string
  password: string
  name: string
  role: string
}

interface StudentData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  grade?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

interface AppointmentData {
  studentName: string
  date: string
  time: string
  type: string
  notes: string
  duration?: number
}

interface MedicationData {
  name: string
  genericName?: string
  dosageForm?: string
  strength?: string
  manufacturer?: string
  ndc?: string
  isControlled?: boolean
  dosage: string
  frequency: string
  studentName?: string
  prescribedBy?: string
  startDate?: string
  instructions?: string
}

interface MedicationInventoryData {
  medicationId: string
  batchNumber: string
  expirationDate: string
  quantity: number
  reorderLevel: number
  costPerUnit: number
  supplier: string
}

interface MedicationAdministrationData {
  studentId: string
  medicationId: string
  dosage: string
  administeredBy: string
  administeredAt: string
  notes?: string
}

interface TestUsers {
  nurse: UserData
  admin: UserData
  doctor: UserData
  readonly?: UserData
  counselor?: UserData
}

interface TestStudents {
  [key: string]: StudentData
}

interface TestAppointments {
  [key: string]: AppointmentData
}

interface TestMedications {
  testMedications: {
    [key: string]: MedicationData
  }
  studentMedicationAssignments: {
    [studentId: string]: string[]
  }
  medicationCategories: string[]
  administrationTimes: string[]
  medicationStatuses: string[]
}

interface SeedDataMedication {
  name: string
  genericName: string
  dosageForm: string
  strength: string
  manufacturer: string
  ndc: string
  isControlled: boolean
}

interface SeedDataStudent {
  studentNumber: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  grade: string
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  medicalRecordNum: string
  nurseId: string
  enrollmentDate: Date
}
