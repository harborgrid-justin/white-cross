/// <reference types="cypress" />

/**
 * Appointment Scheduling: Appointment Creation (15 tests)
 *
 * Tests appointment creation functionality including:
 * - Modal interactions and form validation
 * - Required field validation
 * - Date/time validation and past date prevention
 * - Audit logging for HIPAA compliance
 * - Calendar integration
 */

describe('Appointment Scheduling - Appointment Creation', () => {
  beforeEach(() => {
    // Setup API intercepts for controlled testing
    cy.intercept('GET', '/api/appointments*').as('getAppointments')
    cy.intercept('POST', '/api/appointments').as('createAppointment')
    cy.intercept('GET', '/api/students*').as('getStudents')
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.login('nurse')
    cy.visit('/appointments')

    // Ensure page is loaded
    cy.wait('@getAppointments')
  })

  it('should open appointment creation modal when add button is clicked', () => {
    cy.get('[data-cy=add-appointment-button], [data-testid=add-appointment-button]')
      .should('be.visible')
      .and('be.enabled')
      .click()

    // Verify modal opens with proper attributes
    cy.get('[data-cy=appointment-modal], [data-testid=appointment-modal]')
      .should('be.visible')
      .and('have.attr', 'role', 'dialog')

    // Verify modal title
    cy.get('[data-cy=appointment-modal], [data-testid=appointment-modal]')
      .should('contain', 'New Appointment')
      .or('contain', 'Create Appointment')
  })

  it('should display all required fields in creation form', () => {
    cy.get('[data-cy=add-appointment-button], [data-testid=add-appointment-button]').click()

    // Wait for modal to fully render
    cy.get('[data-cy=appointment-modal], [data-testid=appointment-modal]')
      .should('be.visible')

    // Verify all required fields are present and accessible
    cy.get('[data-cy=appointment-student-select], [data-testid=appointment-student-select]')
      .should('be.visible')
      .and('be.enabled')

    cy.get('[data-cy=appointment-date], [data-testid=appointment-date]')
      .should('be.visible')
      .and('be.enabled')

    cy.get('[data-cy=appointment-time], [data-testid=appointment-time]')
      .should('be.visible')
      .and('be.enabled')

    cy.get('[data-cy=appointment-type], [data-testid=appointment-type]')
      .should('be.visible')
      .and('be.enabled')
  })

  it('should successfully create a new appointment', () => {
    cy.fixture('appointments').then((appointments) => {
      const newAppointment = appointments.testAppointment1

      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(newAppointment.studentName)
      cy.get('[data-testid=appointment-date]').type(newAppointment.date)
      cy.get('[data-testid=appointment-time]').type(newAppointment.time)
      cy.get('[data-testid=appointment-type]').select(newAppointment.type)
      cy.get('[data-testid=appointment-notes]').type(newAppointment.notes)
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=success-message]').should('be.visible')
    })
  })

  it('should display success message after creating appointment', () => {
    cy.fixture('appointments').then((appointments) => {
      const newAppointment = appointments.testAppointment1

      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(newAppointment.studentName)
      cy.get('[data-testid=appointment-date]').type(newAppointment.date)
      cy.get('[data-testid=appointment-time]').type(newAppointment.time)
      cy.get('[data-testid=appointment-type]').select(newAppointment.type)
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=success-message]').should('contain', 'Appointment created successfully')
    })
  })

  it('should close modal after successful creation', () => {
    cy.fixture('appointments').then((appointments) => {
      const newAppointment = appointments.testAppointment1

      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(newAppointment.studentName)
      cy.get('[data-testid=appointment-date]').type(newAppointment.date)
      cy.get('[data-testid=appointment-time]').type(newAppointment.time)
      cy.get('[data-testid=appointment-type]').select(newAppointment.type)
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=appointment-modal]').should('not.exist')
    })
  })

  it('should allow creating appointment with custom duration', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=appointment-date]').type('2024-11-15')
    cy.get('[data-testid=appointment-time]').type('10:00')
    cy.get('[data-testid=appointment-duration]').type('45')
    cy.get('[data-testid=appointment-type]').select('Follow-up')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=success-message]').should('be.visible')
  })

  it('should display appointment type options', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-type]').click()
    cy.get('[data-testid=appointment-type] option').should('contain', 'Check-up')
    cy.get('[data-testid=appointment-type] option').should('contain', 'Follow-up')
    cy.get('[data-testid=appointment-type] option').should('contain', 'Vaccination')
  })

  it('should validate required fields on submission', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=student-error]').should('contain', 'Student is required')
    cy.get('[data-testid=date-error]').should('contain', 'Date is required')
    cy.get('[data-testid=time-error]').should('contain', 'Time is required')
  })

  it('should prevent creating appointments in the past', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=appointment-date]').type('2020-01-01')
    cy.get('[data-testid=appointment-time]').type('10:00')
    cy.get('[data-testid=appointment-type]').select('Check-up')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=date-error]').should('contain', 'Cannot schedule appointments in the past')
  })

  it('should allow adding notes to appointment', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-notes]').should('be.visible')
    cy.get('[data-testid=appointment-notes]').type('Patient needs medication refill discussion')
    cy.get('[data-testid=appointment-notes]').should('have.value', 'Patient needs medication refill discussion')
  })

  it('should close modal when cancel button is clicked', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-modal]').should('be.visible')
    cy.get('[data-testid=cancel-button]').click()
    cy.get('[data-testid=appointment-modal]').should('not.exist')
  })

  it('should clear form when modal is closed and reopened', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-notes]').type('Test notes')
    cy.get('[data-testid=cancel-button]').click()

    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-notes]').should('have.value', '')
  })

  it('should create appointment from calendar date click', () => {
    cy.get('[data-testid=calendar-date-cell]').first().click()
    cy.get('[data-testid=appointment-modal]').should('be.visible')
    cy.get('[data-testid=appointment-date]').should('not.have.value', '')
  })

  it('should show available time slots when creating appointment', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-date]').type('2024-11-15')
    cy.get('[data-testid=available-slots]').should('be.visible')
  })

  it('should create audit log when appointment is created', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.fixture('appointments').then((appointments) => {
      const newAppointment = appointments.testAppointment1

      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(newAppointment.studentName)
      cy.get('[data-testid=appointment-date]').type(newAppointment.date)
      cy.get('[data-testid=appointment-time]').type(newAppointment.time)
      cy.get('[data-testid=appointment-type]').select(newAppointment.type)
      cy.get('[data-testid=save-appointment-button]').click()

      cy.wait('@auditLog').its('request.body').should('deep.include', {
        action: 'CREATE_APPOINTMENT',
        resourceType: 'APPOINTMENT'
      })
    })
  })
})
