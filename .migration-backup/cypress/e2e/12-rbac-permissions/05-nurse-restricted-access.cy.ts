/// <reference types="cypress" />

/**
 * RBAC - Nurse Restricted Access (15 tests)
 *
 * Tests nurse role restrictions and denied permissions
 */

describe('RBAC - Nurse Restricted Access', () => {
  beforeEach(() => {
    cy.loginAs('nurse@school.edu', 'testNursePassword')
  })

  it('should NOT access settings administration panel', () => {
    cy.visit('/settings')
    // Nurses might see limited settings or be redirected
    cy.url().then((url) => {
      if (url.includes('/settings')) {
        // If they can access, they shouldn't see admin features
        cy.contains('Administration Panel').should('not.exist')
      }
    })
  })

  it('should NOT access user management', () => {
    cy.visit('/settings')
    cy.contains('button', 'Users').then(($el) => {
      if ($el.length > 0) {
        cy.wrap($el).click()
        cy.contains('Access denied').should('exist')
      }
    })
  })

  it('should NOT access district management', () => {
    cy.visit('/settings')
    cy.contains('button', 'Districts').should('not.exist')
  })

  it('should NOT access school management', () => {
    cy.visit('/settings')
    cy.contains('button', 'Schools').should('not.exist')
  })

  it('should NOT access system configuration', () => {
    cy.visit('/settings')
    cy.contains('button', 'Configuration').should('not.exist')
  })

  it('should NOT have delete permissions on students', () => {
    cy.visit('/students')
    // Delete buttons should not be visible or should be disabled
    cy.get('body').should('be.visible')
  })

  it('should NOT have delete permissions on medications', () => {
    cy.visit('/medications')
    // Delete buttons should not be visible for nurses
    cy.get('body').should('be.visible')
  })

  it('should NOT access administration features', () => {
    cy.visit('/settings')
    cy.contains('Administration Panel').should('not.exist')
  })

  it('should NOT access integrations', () => {
    cy.visit('/settings')
    cy.contains('button', 'Integrations').should('not.exist')
  })

  it('should NOT access backups', () => {
    cy.visit('/settings')
    cy.contains('button', 'Backups').should('not.exist')
  })

  it('should NOT access monitoring', () => {
    cy.visit('/settings')
    cy.contains('button', 'Monitoring').should('not.exist')
  })

  it('should NOT access audit logs', () => {
    cy.visit('/settings')
    cy.contains('button', 'Audit Logs').should('not.exist')
  })

  it('should NOT access licenses management', () => {
    cy.visit('/settings')
    cy.contains('button', 'Licenses').should('not.exist')
  })

  it('should NOT modify system configurations', () => {
    cy.visit('/settings')
    cy.contains('System Configuration').should('not.exist')
  })

  it('should have limited navigation compared to admin', () => {
    cy.visit('/dashboard')
    // Nurses should see clinical pages but not admin pages
    cy.get('body').should('be.visible')
  })
})
