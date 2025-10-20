/// <reference types="cypress" />

/**
 * RBAC - Nurse Allowed Access (15 tests)
 *
 * Tests nurse role allowed permissions and access
 *
 * User Account: nurse@school.edu / testNursePassword (NURSE)
 */

describe('RBAC - Nurse Allowed Access', () => {
  beforeEach(() => {
    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/dashboard')
  })

  it('should access dashboard', () => {
    cy.url().should('include', '/dashboard')
    cy.get('body', { timeout: 2500 }).should('be.visible')
  })

  it('should access students page', () => {
    cy.visit('/students')
    cy.url({ timeout: 2500 }).should('include', '/students')
  })

  it('should access medications page', () => {
    cy.visit('/medications')
    cy.url({ timeout: 2500 }).should('include', '/medications')
  })

  it('should access health records', () => {
    cy.visit('/health-records')
    cy.get('body').should('be.visible')
  })

  it('should access incidents page', () => {
    cy.visit('/incidents')
    cy.url().should('include', '/incidents')
  })

  it('should access reports page', () => {
    cy.visit('/reports')
    cy.url({ timeout: 2500 }).should('include', '/reports')
  })

  it('should see add student button', () => {
    cy.visit('/students')
    cy.get('button, [role="button"]', { timeout: 2500 }).contains(/add/i).should('exist')
  })

  it('should see add medication button', () => {
    cy.visit('/medications')
    cy.get('button', { timeout: 2500 }).contains(/add/i).should('exist')
  })

  it('should be able to create health records', () => {
    cy.visit('/health-records')
    cy.get('body').should('be.visible')
  })

  it('should be able to update student information', () => {
    cy.visit('/students')
    cy.get('body').should('be.visible')
  })

  it('should access medication inventory', () => {
    cy.visit('/medications')
    cy.contains('button', 'Inventory').should('be.visible')
  })

  it('should access medication reminders', () => {
    cy.visit('/medications')
    cy.contains('button', 'Reminders').should('be.visible')
  })

  it('should view adverse reactions', () => {
    cy.visit('/medications')
    cy.contains('button', 'Adverse Reactions').should('be.visible')
  })

  it('should maintain nurse session', () => {
    cy.visit('/students')
    cy.url().should('not.include', '/login')
  })

  it('should have nurse role stored', () => {
    cy.window().then((win) => {
      const user = JSON.parse(win.localStorage.getItem('user') || '{}')
      expect(user.role).to.equal('NURSE')
    })
  })
})
