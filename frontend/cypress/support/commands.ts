/// <reference types="cypress" />

/**
 * Custom Cypress Commands for White Cross Healthcare Management System
 * These commands provide reusable functionality for common test operations
 */

/**
 * Login command - Authenticates a user and maintains session
 * @param userType - Type of user to login as (nurse, admin, doctor)
 */
Cypress.Commands.add('login', (userType: string) => {
  cy.fixture('users').then((users: TestUsers) => {
    const user = users[userType as keyof TestUsers]
    if (!user) {
      throw new Error(`User type "${userType}" not found in users fixture`)
    }

    cy.session([userType], () => {
      cy.visit('/login')
      cy.get('[data-cy=email-input]').type(user.email)
      cy.get('[data-cy=password-input]').type(user.password)
      cy.get('[data-cy=login-button]').click()
      cy.url().should('include', '/dashboard')
    })
    cy.visit('/dashboard')
  })
})

/**
 * LoginAs command - Authenticates with custom email and password
 * @param email - User email address
 * @param password - User password
 */
Cypress.Commands.add('loginAs', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(email)
    cy.get('[data-cy=password-input]').type(password)
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')
  })
  cy.visit('/dashboard')
})

/**
 * Create student command - Adds a new student record
 * @param studentData - Student information object
 */
Cypress.Commands.add('createStudent', (studentData: StudentData) => {
  cy.get('[data-cy=add-student-button]').click()
  cy.get('[data-cy=student-modal]').should('be.visible')
  
  cy.get('[data-cy=student-first-name]').type(studentData.firstName)
  cy.get('[data-cy=student-last-name]').type(studentData.lastName)
  cy.get('[data-cy=student-email]').type(studentData.email)
  cy.get('[data-cy=student-phone]').type(studentData.phone)
  cy.get('[data-cy=student-dob]').type(studentData.dateOfBirth)
  
  if (studentData.grade) {
    cy.get('[data-cy=student-grade]').select(studentData.grade)
  }
  
  cy.get('[data-cy=save-student-button]').click()
  cy.get('[data-cy=success-message]').should('be.visible')
  cy.get('[data-cy=student-modal]').should('not.exist')
})

/**
 * Create appointment command - Schedules a new appointment
 * @param appointmentData - Appointment information object
 */
Cypress.Commands.add('createAppointment', (appointmentData: AppointmentData) => {
  cy.get('[data-cy=add-appointment-button]').click()
  cy.get('[data-cy=appointment-modal]').should('be.visible')
  
  cy.get('[data-cy=appointment-student-select]').select(appointmentData.studentName)
  cy.get('[data-cy=appointment-date]').type(appointmentData.date)
  cy.get('[data-cy=appointment-time]').type(appointmentData.time)
  cy.get('[data-cy=appointment-type]').select(appointmentData.type)
  cy.get('[data-cy=appointment-notes]').type(appointmentData.notes)
  
  cy.get('[data-cy=save-appointment-button]').click()
  cy.get('[data-cy=success-message]').should('be.visible')
  cy.get('[data-cy=appointment-modal]').should('not.exist')
})

/**
 * Add medication command - Adds a new medication record
 * @param medicationData - Medication information object
 */
Cypress.Commands.add('addMedication', (medicationData: MedicationData) => {
  cy.get('[data-cy=add-medication-button]').click()
  cy.get('[data-cy=medication-modal]').should('be.visible')
  
  cy.get('[data-cy=medication-name]').type(medicationData.name)
  cy.get('[data-cy=medication-dosage]').type(medicationData.dosage)
  cy.get('[data-cy=medication-frequency]').type(medicationData.frequency)
  cy.get('[data-cy=medication-student-select]').select(medicationData.studentName)
  
  if (medicationData.prescribedBy) {
    cy.get('[data-cy=medication-prescribed-by]').type(medicationData.prescribedBy)
  }
  
  if (medicationData.startDate) {
    cy.get('[data-cy=medication-start-date]').type(medicationData.startDate)
  }
  
  if (medicationData.instructions) {
    cy.get('[data-cy=medication-instructions]').type(medicationData.instructions)
  }
  
  cy.get('[data-cy=save-medication-button]').click()
  cy.get('[data-cy=success-message]').should('be.visible')
  cy.get('[data-cy=medication-modal]').should('not.exist')
})

/**
 * Navigate to page command - Navigates to a specific page in the application
 * @param page - The page identifier to navigate to
 */
Cypress.Commands.add('navigateTo', (page: string) => {
  cy.get(`[data-cy=nav-${page}]`).click()
  cy.url().should('include', `/${page}`)
  cy.get(`[data-cy=${page}-title]`).should('be.visible')
})
