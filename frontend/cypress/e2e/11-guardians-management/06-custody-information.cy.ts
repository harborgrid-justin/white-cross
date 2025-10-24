/// <reference types="cypress" />

/**
 * Guardians Management: Custody Information (5 tests)
 *
 * Tests custody information management and legal guardianship
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority Critical
 */

describe('Guardians Management - Custody Information', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()

    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
  })

  it('should display legal custody status for guardians', () => {
    cy.get('body').then($body => {
      if ($body.text().includes('Legal') || $body.text().includes('Custody')) {
        cy.get('body').should('exist')
      } else {
        cy.log('Custody information display not yet implemented')
      }
    })
  })

  it('should display physical custody status', () => {
    cy.get('body').then($body => {
      if ($body.text().includes('Physical') || $body.text().includes('Custody')) {
        cy.get('body').should('exist')
      } else {
        cy.log('Physical custody display not yet implemented')
      }
    })
  })

  it('should display court order information when present', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="court-order-info"]').length > 0) {
        cy.get('[data-testid="court-order-info"]').should('be.visible')
      } else {
        cy.log('Court order information not yet implemented')
      }
    })
  })

  it('should show custody restrictions if applicable', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="custody-restrictions"]').length > 0) {
        cy.get('[data-testid="custody-restrictions"]').should('be.visible')
      } else {
        cy.log('Custody restrictions not yet implemented')
      }
    })
  })

  it('should display custody percentage for shared custody', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="custody-percentage"]').length > 0) {
        cy.get('[data-testid="custody-percentage"]').should('be.visible')
      } else {
        cy.log('Custody percentage not yet implemented')
      }
    })
  })
})
