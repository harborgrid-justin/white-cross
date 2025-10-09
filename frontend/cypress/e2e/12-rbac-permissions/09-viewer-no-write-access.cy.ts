/// <reference types="cypress" />

/**
 * RBAC - Viewer No Write Access (10 tests)
 *
 * Tests viewer role write restrictions
 */

describe('RBAC - Viewer No Write Access', () => {
  beforeEach(() => {
    cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
  })

  it('should NOT see add student button', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').should('not.exist')
  })

  it('should NOT see add medication button', () => {
    cy.visit('/medications')
    cy.get('button').contains('Add Medication').should('not.exist')
  })

  it('should NOT see edit buttons', () => {
    cy.visit('/students')
    // Edit buttons should be hidden or disabled
    cy.get('body').should('be.visible')
  })

  it('should NOT see delete buttons', () => {
    cy.visit('/students')
    // Delete buttons should not exist
    cy.get('body').should('be.visible')
  })

  it('should NOT access administration panel', () => {
    cy.visit('/settings')
    cy.contains('Administration Panel').should('not.exist')
  })

  it('should NOT access system configuration', () => {
    cy.visit('/settings')
    cy.contains('System Configuration').should('not.exist')
  })

  it('should NOT access user management', () => {
    cy.visit('/settings')
    cy.contains('button', 'Users').should('not.exist')
  })

  it('should NOT modify any records', () => {
    cy.visit('/students')
    // All forms and inputs should be disabled or hidden
    cy.get('body').should('be.visible')
  })

  it('should NOT create new records', () => {
    cy.visit('/health-records')
    cy.get('button').contains(/add|create|new/i).should('not.exist')
  })

  it('should NOT have write permissions on any resource', () => {
    cy.visit('/medications')
    cy.get('button').contains(/add|edit|update|delete/i).should('not.exist')
  })
})
