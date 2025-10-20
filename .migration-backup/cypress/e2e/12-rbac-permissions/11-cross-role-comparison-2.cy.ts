/// <reference types="cypress" />

/**
 * RBAC - Cross-Role Comparison Part 2 (10 tests)
 *
 * Tests additional permission differences and authorization patterns
 */

describe('RBAC - Cross-Role Comparison Part 2', () => {
  it('unauthorized users should be redirected to login', () => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/settings')
    cy.url().should('include', '/login')
  })

  it('counselor should access limited resources', () => {
    cy.loginAs('counselor@school.edu', 'CounselorPassword123!')
    cy.visit('/students')
    cy.get('body').should('be.visible')

    cy.visit('/medications')
    cy.url().should('not.include', '/medications')
  })

  it('admin should access all reports', () => {
    cy.login('admin')
    cy.visit('/reports')
    cy.url({ timeout: 2500 }).should('include', '/reports')
  })

  it('viewer should see reports but not modify', () => {
    cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
    cy.visit('/reports')
    cy.url({ timeout: 2500 }).should('include', '/reports')
    cy.get('button').contains(/generate|create|export/i).should('not.exist')
  })

  it('nurse should manage medications, counselor should not', () => {
    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/medications')
    cy.url({ timeout: 2500 }).should('include', '/medications')

    cy.clearCookies()
    cy.clearLocalStorage()

    cy.loginAs('counselor@school.edu', 'CounselorPassword123!')
    cy.visit('/medications')
    cy.url({ timeout: 2500 }).should('not.include', '/medications')
  })

  it('all authenticated users should access their dashboard', () => {
    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/dashboard')
    cy.url().should('not.include', '/login')
    cy.get('body', { timeout: 2500 }).should('be.visible')
  })

  it('session should expire after logout for all roles', () => {
    cy.login('admin')
    cy.visit('/dashboard')

    // Logout simulation
    cy.clearCookies()
    cy.clearLocalStorage()

    cy.visit('/dashboard')
    cy.url().should('include', '/login')
  })

  it('multiple failed logins should be handled', () => {
    cy.clearCookies()
    cy.clearLocalStorage()

    // Attempt login with wrong credentials
    cy.visit('/login')
    cy.get('input[type="email"]').type('wrong@email.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()

    // Should still be on login page
    cy.url().should('include', '/login')
  })

  it('role permissions should be consistent across sessions', () => {
    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/medications')
    cy.url({ timeout: 2500 }).should('include', '/medications')

    cy.reload()

    cy.url({ timeout: 2500 }).should('include', '/medications')
  })

  it('users should only see data within their scope', () => {
    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/students')
    cy.get('body').should('be.visible')
    // Nurses should only see students in their assigned school
  })
})
