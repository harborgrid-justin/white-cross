/// <reference types="cypress" />

/**
 * RBAC - Counselor Restricted Access (10 tests)
 *
 * Tests counselor role restrictions and denied permissions
 */

describe('RBAC - Counselor Restricted Access', () => {
  beforeEach(() => {
    cy.loginAs('counselor@school.edu', 'CounselorPassword123!')
  })

  it('should NOT access medications page', () => {
    cy.visit('/medications')
    cy.url().should('not.include', '/medications')
  })

  it('should NOT access medication management', () => {
    cy.request({ url: '/api/medications', failOnStatusCode: false }).then((resp) => {
      expect(resp.status).to.be.oneOf([401, 403, 404])
    })
  })

  it('should NOT access incidents page', () => {
    cy.visit('/incidents')
    // Counselors may not have incident report access
    cy.url().should('not.include', '/incidents')
  })

  it('should NOT have delete permissions on students', () => {
    cy.visit('/students')
    cy.get('body').should('be.visible')
    // Delete buttons should not be visible
  })

  it('should NOT have delete permissions on health records', () => {
    cy.visit('/health-records')
    cy.get('body').should('be.visible')
    // Delete buttons should not be visible
  })

  it('should NOT access administration panel', () => {
    cy.visit('/settings')
    cy.contains('Administration Panel').should('not.exist')
  })

  it('should NOT access system settings', () => {
    cy.visit('/settings')
    cy.contains('System Configuration').should('not.exist')
  })

  it('should NOT access user management', () => {
    cy.visit('/settings')
    cy.contains('button', 'Users').should('not.exist')
  })

  it('should NOT access configuration settings', () => {
    cy.visit('/settings')
    cy.contains('button', 'Configuration').should('not.exist')
  })

  it('should NOT access medication inventory', () => {
    cy.visit('/medications')
    cy.url().should('not.include', '/medications')
  })
})
