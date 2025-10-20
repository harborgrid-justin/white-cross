/// <reference types="cypress" />

/**
 * Appointment Scheduling: Appointment Cancellation (10 tests)
 *
 * Tests appointment cancellation functionality
 */

describe('Appointment Scheduling - Appointment Cancellation', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should display cancel button in appointment details', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=cancel-appointment-button]').should('be.visible')
  })

  it('should show confirmation modal when cancel is clicked', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=cancel-appointment-button]').click()
    cy.get('[data-testid=confirm-cancel-modal]').should('be.visible')
  })

  it('should require cancellation reason', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=cancel-appointment-button]').click()
    cy.get('[data-testid=confirm-cancel-button]').click()
    cy.get('[data-testid=reason-error]').should('contain', 'Cancellation reason is required')
  })

  it('should successfully cancel appointment with reason', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=cancel-appointment-button]').click()
    cy.get('[data-testid=cancellation-reason]').type('Student illness')
    cy.get('[data-testid=confirm-cancel-button]').click()
    cy.get('[data-testid=success-message]').should('contain', 'Appointment cancelled')
  })

  it('should not cancel when cancel is aborted', () => {
    const initialCount = Cypress.$('[data-testid=appointment-event]').length

    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=cancel-appointment-button]').click()
    cy.get('[data-testid=abort-cancel-button]').click()

    cy.get('[data-testid=appointment-event]').should('have.length', initialCount)
  })

  it('should mark appointment as cancelled instead of deleting', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=cancel-appointment-button]').click()
    cy.get('[data-testid=cancellation-reason]').type('Rescheduled')
    cy.get('[data-testid=confirm-cancel-button]').click()

    cy.get('[data-testid=view-cancelled-button]').click()
    cy.get('[data-testid=cancelled-appointment]').should('exist')
  })

  it('should display cancelled status on appointment', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=cancel-appointment-button]').click()
    cy.get('[data-testid=cancellation-reason]').type('No longer needed')
    cy.get('[data-testid=confirm-cancel-button]').click()

    cy.get('[data-testid=view-cancelled-button]').click()
    cy.get('[data-testid=cancelled-appointment]').first().within(() => {
      cy.get('[data-testid=status-badge]').should('contain', 'Cancelled')
    })
  })

  it('should send cancellation notification to student', () => {
    cy.intercept('POST', '/api/notifications').as('sendNotification')

    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=cancel-appointment-button]').click()
    cy.get('[data-testid=cancellation-reason]').type('Schedule conflict')
    cy.get('[data-testid=confirm-cancel-button]').click()

    cy.wait('@sendNotification')
  })

  it('should allow viewing cancellation history', () => {
    cy.get('[data-testid=view-cancelled-button]').click()
    cy.get('[data-testid=cancelled-appointments-list]').should('be.visible')
  })

  it('should create audit log when appointment is cancelled', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=cancel-appointment-button]').click()
    cy.get('[data-testid=cancellation-reason]').type('Patient request')
    cy.get('[data-testid=confirm-cancel-button]').click()

    cy.wait('@auditLog').its('request.body').should('deep.include', {
      action: 'CANCEL_APPOINTMENT',
      resourceType: 'APPOINTMENT'
    })
  })
})
