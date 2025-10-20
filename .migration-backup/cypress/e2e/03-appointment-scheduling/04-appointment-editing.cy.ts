/// <reference types="cypress" />

/**
 * Appointment Scheduling: Appointment Editing & Updates (12 tests)
 *
 * Tests appointment editing and update functionality
 */

describe('Appointment Scheduling - Appointment Editing & Updates', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should open edit modal from appointment details', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=edit-appointment-button]').click()
    cy.get('[data-testid=appointment-modal]').should('be.visible')
  })

  it('should populate form with existing appointment data', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=edit-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').should('not.have.value', '')
    cy.get('[data-testid=appointment-date]').should('not.have.value', '')
  })

  it('should successfully update appointment date', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=edit-appointment-button]').click()
    cy.get('[data-testid=appointment-date]').clear().type('2024-12-01')
    cy.get('[data-testid=save-appointment-button]').click()
    cy.get('[data-testid=success-message]').should('contain', 'Appointment updated')
  })

  it('should successfully update appointment time', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=edit-appointment-button]').click()
    cy.get('[data-testid=appointment-time]').clear().type('14:00')
    cy.get('[data-testid=save-appointment-button]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })

  it('should successfully update appointment type', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=edit-appointment-button]').click()
    cy.get('[data-testid=appointment-type]').select('Follow-up')
    cy.get('[data-testid=save-appointment-button]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })

  it('should successfully update appointment notes', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=edit-appointment-button]').click()
    cy.get('[data-testid=appointment-notes]').clear().type('Updated appointment notes')
    cy.get('[data-testid=save-appointment-button]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })

  it('should preserve data when canceling edit', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=appointment-datetime]').invoke('text').as('originalDateTime')
    cy.get('[data-testid=edit-appointment-button]').click()
    cy.get('[data-testid=appointment-date]').clear().type('2025-01-01')
    cy.get('[data-testid=cancel-button]').click()

    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('@originalDateTime').then((originalDateTime) => {
      cy.get('[data-testid=appointment-datetime]').should('contain', originalDateTime)
    })
  })

  it('should validate time slot availability when rescheduling', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=edit-appointment-button]').click()
    cy.get('[data-testid=appointment-date]').clear().type('2024-11-20')
    cy.get('[data-testid=appointment-time]').clear().type('10:00')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=error-message]').should('contain', 'Time slot already booked')
  })

  it('should allow changing appointment duration', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=edit-appointment-button]').click()
    cy.get('[data-testid=appointment-duration]').clear().type('60')
    cy.get('[data-testid=save-appointment-button]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })

  it('should update appointment status', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=edit-appointment-button]').click()
    cy.get('[data-testid=appointment-status-select]').select('Completed')
    cy.get('[data-testid=save-appointment-button]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })

  it('should close modal after successful update', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=edit-appointment-button]').click()
    cy.get('[data-testid=appointment-notes]').clear().type('Updated')
    cy.get('[data-testid=save-appointment-button]').click()
    cy.get('[data-testid=appointment-modal]').should('not.exist')
  })

  it('should create audit log when appointment is updated', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=edit-appointment-button]').click()
    cy.get('[data-testid=appointment-notes]').clear().type('Updated')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.wait('@auditLog').its('request.body').should('deep.include', {
      action: 'UPDATE_APPOINTMENT',
      resourceType: 'APPOINTMENT'
    })
  })
})
