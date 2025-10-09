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

    /**
     * Custom command to verify PHI access audit logs
     * @param action - The audit action type
     * @param resourceType - The resource type accessed
     * @example cy.verifyAuditLog('VIEW_STUDENT', 'STUDENT')
     */
    verifyAuditLog(action: string, resourceType: string): Chainable<void>

    /**
     * Custom command to setup audit log interception
     * @example cy.setupAuditLogInterception()
     */
    setupAuditLogInterception(): Chainable<void>

    /**
     * Custom command to get element by data-testid with better error handling
     * @param selector - The data-testid selector value
     * @param options - Cypress query options
     * @example cy.getByTestId('add-student-button')
     */
    getByTestId(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery>

    /**
     * Custom command to type into field with validation
     * @param selector - The data-testid selector value
     * @param value - The value to type
     * @example cy.typeIntoField('firstName-input', 'John')
     */
    typeIntoField(selector: string, value: string): Chainable<void>

    /**
     * Custom command to select option from dropdown
     * @param selector - The data-testid selector value
     * @param value - The value to select
     * @example cy.selectOption('grade-select', '9')
     */
    selectOption(selector: string, value: string): Chainable<void>

    /**
     * Custom command to click button with validation
     * @param selector - The data-testid selector value
     * @example cy.clickButton('save-student-button')
     */
    clickButton(selector: string): Chainable<void>

    /**
     * Custom command to wait for modal to open
     * @param selector - The modal data-testid selector value
     * @example cy.waitForModal('student-form-modal')
     */
    waitForModal(selector: string): Chainable<void>

    /**
     * Custom command to wait for modal to close
     * @param selector - The modal data-testid selector value
     * @example cy.waitForModalClose('student-form-modal')
     */
    waitForModalClose(selector: string): Chainable<void>

    /**
     * Custom command to verify success message
     * @param messagePattern - Optional regex pattern to match
     * @example cy.verifySuccess(/student.*created/i)
     */
    verifySuccess(messagePattern?: RegExp): Chainable<void>

    /**
     * Custom command to verify error message
     * @param messagePattern - Optional regex pattern to match
     * @example cy.verifyError(/required.*field/i)
     */
    verifyError(messagePattern?: RegExp): Chainable<void>

    /**
     * Custom command to check accessibility of element
     * @param selector - The data-testid selector value
     * @example cy.checkAccessibility('add-student-button')
     */
    checkAccessibility(selector: string): Chainable<void>

    /**
     * Custom command to search students with debounce handling
     * @param searchTerm - The search term
     * @example cy.searchStudents('John')
     */
    searchStudents(searchTerm: string): Chainable<void>

    /**
     * Custom command to navigate to health records tab
     * @param tabName - The name of the tab
     * @example cy.navigateToHealthRecordTab('Allergies')
     */
    navigateToHealthRecordTab(tabName: string): Chainable<void>

    /**
     * Custom command to verify table is loaded
     * @param tableSelector - The table data-testid selector value
     * @param minRows - Minimum number of rows expected
     * @example cy.verifyTableLoaded('student-table', 1)
     */
    verifyTableLoaded(tableSelector: string, minRows?: number): Chainable<void>

    /**
     * Custom command to setup health records API intercepts
     * @example cy.setupHealthRecordsIntercepts()
     */
    setupHealthRecordsIntercepts(): Chainable<void>

    /**
     * Custom command to fill student form
     * @param studentData - Partial student data object
     * @example cy.fillStudentForm({ firstName: 'John', lastName: 'Doe' })
     */
    fillStudentForm(studentData: Partial<StudentFormData>): Chainable<void>

    /**
     * Custom command to verify user role in local storage
     * @param expectedRole - The expected role (ADMIN, NURSE, COUNSELOR, READ_ONLY)
     * @example cy.verifyUserRole('ADMIN')
     */
    verifyUserRole(expectedRole: string): Chainable<void>

    /**
     * Custom command to verify access is denied to a resource
     * @param url - The URL that should be denied
     * @example cy.verifyAccessDenied('/settings')
     */
    verifyAccessDenied(url: string): Chainable<void>

    /**
     * Custom command to navigate to settings tab
     * @param tabName - The name of the tab to navigate to
     * @example cy.navigateToSettingsTab('Users')
     */
    navigateToSettingsTab(tabName: string): Chainable<void>

    /**
     * Custom command to wait for table to load
     * @example cy.waitForTable()
     */
    waitForTable(): Chainable<void>

    /**
     * Custom command to setup admin data intercepts
     * @example cy.waitForAdminData()
     */
    waitForAdminData(): Chainable<void>

    /**
     * Custom command to verify element is not editable
     * @param selector - The data-cy selector value
     * @example cy.verifyNotEditable('add-user-button')
     */
    verifyNotEditable(selector: string): Chainable<void>

    /**
     * Custom command to verify button is not visible
     * @param buttonText - The text content of the button
     * @example cy.verifyButtonNotVisible('Delete')
     */
    verifyButtonNotVisible(buttonText: string): Chainable<void>

    /**
     * Custom command to verify admin has full access
     * @param featureName - The name of the feature
     * @example cy.verifyAdminAccess('User Management')
     */
    verifyAdminAccess(featureName: string): Chainable<void>

    /**
     * Custom command to search in admin tables
     * @param searchTerm - The search term
     * @example cy.searchInAdminTable('John Doe')
     */
    searchInAdminTable(searchTerm: string): Chainable<void>

    /**
     * Custom command to filter admin tables
     * @param filterType - The type of filter (e.g., 'role', 'status')
     * @param filterValue - The value to filter by
     * @example cy.filterAdminTable('role', 'ADMIN')
     */
    filterAdminTable(filterType: string, filterValue: string): Chainable<void>
  }
}

// Additional type definitions
interface StudentFormData {
  studentNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade?: string
  gender?: string
  medicalRecordNum?: string
  enrollmentDate?: string
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
