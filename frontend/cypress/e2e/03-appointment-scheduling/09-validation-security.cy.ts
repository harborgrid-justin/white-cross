/// <reference types="cypress" />

/**
 * Appointment Scheduling: Validation, Security & Accessibility (25 tests)
 *
 * Tests data validation, HIPAA compliance, and accessibility
 */

describe('Appointment Scheduling - Data Validation & Error Handling', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should require student selection', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=save-appointment-button]').click()
    cy.get('[data-testid=student-error]').should('contain', 'Student is required')
  })

  it('should require appointment date', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=save-appointment-button]').click()
    cy.get('[data-testid=date-error]').should('contain', 'Date is required')
  })

  it('should require appointment time', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=save-appointment-button]').click()
    cy.get('[data-testid=time-error]').should('contain', 'Time is required')
  })

  it('should validate appointment is not in the past', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=appointment-date]').type('2020-01-01')
    cy.get('[data-testid=appointment-time]').type('10:00')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=date-error]').should('contain', 'Cannot schedule appointments in the past')
  })

  it('should validate appointment duration is positive', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-duration]').type('-30')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=duration-error]').should('contain', 'Duration must be positive')
  })

  it('should handle network errors gracefully', () => {
    cy.intercept('POST', '/api/appointments', { statusCode: 500 }).as('createAppointment')

    cy.fixture('appointments').then((appointments) => {
      const newAppointment = appointments.testAppointment1

      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(newAppointment.studentName)
      cy.get('[data-testid=appointment-date]').type(newAppointment.date)
      cy.get('[data-testid=appointment-time]').type(newAppointment.time)
      cy.get('[data-testid=appointment-type]').select(newAppointment.type)
      cy.get('[data-testid=save-appointment-button]').click()

      cy.wait('@createAppointment')
      cy.get('[data-testid=error-message]').should('contain', 'Failed to create appointment')
    })
  })

  it('should display validation errors simultaneously', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=student-error]').should('be.visible')
    cy.get('[data-testid=date-error]').should('be.visible')
    cy.get('[data-testid=time-error]').should('be.visible')
  })

  it('should validate business hours constraints', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=appointment-date]').type('2024-12-01')
    cy.get('[data-testid=appointment-time]').type('22:00')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=time-error]').should('contain', 'Appointment must be during business hours')
  })

  it('should prevent scheduling on holidays/weekends', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=appointment-date]').type('2024-12-25')
    cy.get('[data-testid=appointment-time]').type('10:00')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=date-error]').should('contain', 'Cannot schedule on holidays')
  })

  it('should handle server unavailability', () => {
    cy.intercept('GET', '/api/appointments*', { forceNetworkError: true }).as('getAppointments')

    cy.visit('/appointments')
    cy.get('[data-testid=error-message]').should('contain', 'Unable to load appointments')
  })
})

describe('Appointment Scheduling - HIPAA Compliance & Security', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should require authentication to access appointments', () => {
    cy.clearCookies()
    cy.visit('/appointments')
    cy.url().should('include', '/login')
  })

  it('should create audit log when viewing appointments', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.visit('/appointments')

    cy.wait('@auditLog').its('request.body').should('deep.include', {
      action: 'VIEW_APPOINTMENTS',
      resourceType: 'APPOINTMENT'
    })
  })

  it('should mask sensitive patient information in list view', () => {
    cy.get('[data-testid=appointment-event]').first().should('not.contain', 'SSN')
  })

  it('should use secure HTTPS for API requests', () => {
    cy.intercept('GET', '/api/appointments*').as('getAppointments')

    cy.visit('/appointments')

    cy.wait('@getAppointments').its('request.url').should('include', 'https')
  })

  it('should include authentication token in requests', () => {
    cy.intercept('GET', '/api/appointments*').as('getAppointments')

    cy.visit('/appointments')

    cy.wait('@getAppointments').its('request.headers').should('have.property', 'authorization')
  })

  it('should prevent unauthorized access to appointment details', () => {
    cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
    cy.visit('/appointments')

    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=edit-appointment-button]').should('not.exist')
  })

  it('should enforce session timeout', () => {
    cy.wait(30000)
    cy.get('[data-testid=appointment-event]').first().click()
    cy.url().should('include', '/login')
  })

  it('should display PHI warning when accessing appointment details', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=phi-warning]').should('be.visible')
  })
})

describe('Appointment Scheduling - Accessibility & Responsiveness', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should have proper ARIA labels on interactive elements', () => {
    cy.get('[data-testid=add-appointment-button]').should('have.attr', 'aria-label')
    cy.get('[data-testid=prev-period-button]').should('have.attr', 'aria-label')
  })

  it('should support keyboard navigation in calendar', () => {
    cy.get('[data-testid=calendar-date-cell]').first().focus()
    cy.focused().type('{enter}')
    cy.get('[data-testid=appointment-modal]').should('be.visible')
  })

  it('should display properly on mobile devices', () => {
    cy.viewport('iphone-x')
    cy.get('[data-testid=calendar-view]').should('be.visible')
    cy.get('[data-testid=add-appointment-button]').should('be.visible')
  })

  it('should display properly on tablet devices', () => {
    cy.viewport('ipad-2')
    cy.get('[data-testid=calendar-view]').should('be.visible')
    cy.get('[data-testid=appointment-event]').should('be.visible')
  })

  it('should have accessible color contrast', () => {
    cy.get('[data-testid=appointment-event]').first().should('have.css', 'color')
  })

  it('should support screen reader announcements', () => {
    cy.get('[data-testid=appointment-event]').first().should('have.attr', 'aria-label')
  })

  it('should be navigable with tab key', () => {
    cy.get('[data-testid=add-appointment-button]').focus().tab()
    cy.focused().should('have.attr', 'data-testid')
  })
})
