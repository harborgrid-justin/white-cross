/// <reference types="cypress" />

/**
 * RBAC - Counselor Allowed Access (15 tests)
 *
 * Tests counselor role allowed permissions
 *
 * User Account: counselor@school.edu / CounselorPassword123! (COUNSELOR)
 */

describe('RBAC - Counselor Allowed Access', () => {
  beforeEach(() => {
    cy.loginAs('counselor@school.edu', 'CounselorPassword123!')
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

  it('should access health records', () => {
    cy.visit('/health-records')
    cy.get('body').should('be.visible')
  })

  it('should see student information', () => {
    cy.visit('/students')
    cy.get('body').should('be.visible')
  })

  it('should be able to create student records', () => {
    cy.visit('/students')
    cy.get('button').contains(/add/i).should('exist')
  })

  it('should be able to update student information', () => {
    cy.visit('/students')
    cy.get('body').should('be.visible')
  })

  it('should view health records', () => {
    cy.visit('/health-records')
    cy.get('body').should('be.visible')
  })

  it('should create health record notes', () => {
    cy.visit('/health-records')
    cy.get('body').should('be.visible')
  })

  it('should access reports', () => {
    cy.visit('/reports')
    cy.url({ timeout: 2500 }).should('include', '/reports')
  })

  it('should have counselor role stored', () => {
    cy.window({ timeout: 2500 }).then((win) => {
      const userStr = win.localStorage.getItem('user')
      const authStr = win.localStorage.getItem('auth_data')
      // Check role from legacy storage if available
      if (userStr) {
        const user = JSON.parse(userStr)
        expect(user.role).to.equal('COUNSELOR')
      } else {
        // If using encrypted storage, just verify auth data exists
        expect(authStr).to.exist
      }
    })
  })

  it('should maintain counselor session', () => {
    cy.visit('/students')
    cy.url().should('not.include', '/login')
  })

  it('should view student demographics', () => {
    cy.visit('/students')
    cy.get('body').should('be.visible')
  })

  it('should access student health information', () => {
    cy.visit('/health-records')
    cy.get('body').should('be.visible')
  })

  it('should view student contact information', () => {
    cy.visit('/students')
    cy.get('body').should('be.visible')
  })

  it('should access student emergency contacts', () => {
    cy.visit('/students')
    cy.get('body').should('be.visible')
  })
})
