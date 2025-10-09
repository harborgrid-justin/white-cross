/// <reference types="cypress" />

/**
 * Medication Management: Medication Reminders (10 tests)
 *
 * Tests medication reminder creation and management
 */

describe('Medication Management - Medication Reminders', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
    cy.get('[data-testid=reminders-tab]').click()
  })

  it('should display reminders list', () => {
    cy.get('[data-testid=reminders-list]').should('be.visible')
  })

  it('should display upcoming reminders', () => {
    cy.get('[data-testid=upcoming-reminders]').should('be.visible')
  })

  it('should allow creating new reminder', () => {
    cy.get('[data-testid=add-reminder-button]').click()
    cy.get('[data-testid=reminder-modal]').should('be.visible')
    cy.get('[data-testid=student-select]').select(1)
    cy.get('[data-testid=medication-select]').select(1)
    cy.get('[data-testid=reminder-time]').type('08:00')
    cy.get('[data-testid=reminder-frequency]').select('Daily')
    cy.get('[data-testid=save-reminder-button]').click()

    cy.get('[data-testid=success-message]').should('contain', 'Reminder created successfully')
  })

  it('should display reminder notifications', () => {
    cy.get('[data-testid=reminder-notification]').should('exist')
  })

  it('should allow snoozing reminder', () => {
    cy.get('[data-testid=reminder-item]').first().within(() => {
      cy.get('[data-testid=snooze-button]').click()
    })

    cy.get('[data-testid=snooze-duration]').select('15 minutes')
    cy.get('[data-testid=confirm-snooze-button]').click()
    cy.get('[data-testid=success-message]').should('contain', 'Reminder snoozed')
  })

  it('should allow dismissing reminder', () => {
    cy.get('[data-testid=reminder-item]').first().within(() => {
      cy.get('[data-testid=dismiss-button]').click()
    })

    cy.get('[data-testid=success-message]').should('contain', 'Reminder dismissed')
  })

  it('should display reminder schedule', () => {
    cy.get('[data-testid=reminder-item]').first().within(() => {
      cy.get('[data-testid=reminder-schedule]').should('be.visible')
    })
  })

  it('should allow editing reminder', () => {
    cy.get('[data-testid=reminder-item]').first().within(() => {
      cy.get('[data-testid=edit-reminder-button]').click()
    })

    cy.get('[data-testid=reminder-modal]').should('be.visible')
    cy.get('[data-testid=reminder-time]').clear().type('09:00')
    cy.get('[data-testid=save-reminder-button]').click()

    cy.get('[data-testid=success-message]').should('contain', 'Reminder updated')
  })

  it('should allow deleting reminder', () => {
    cy.get('[data-testid=reminder-item]').first().within(() => {
      cy.get('[data-testid=delete-reminder-button]').click()
    })

    cy.get('[data-testid=confirm-delete-button]').click()
    cy.get('[data-testid=success-message]').should('contain', 'Reminder deleted')
  })

  it('should display reminder history', () => {
    cy.get('[data-testid=reminder-history-tab]').click()
    cy.get('[data-testid=reminder-history-list]').should('be.visible')
  })
})
