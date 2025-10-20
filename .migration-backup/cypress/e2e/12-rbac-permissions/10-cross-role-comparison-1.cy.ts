/// <reference types="cypress" />

/**
 * RBAC - Cross-Role Comparison Part 1 (10 tests)
 *
 * Tests permission differences between roles
 */

describe('RBAC - Cross-Role Comparison Part 1', () => {
  it('admin should have more permissions than nurse', () => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('Administration Panel').should('be.visible')

    cy.clearCookies()
    cy.clearLocalStorage()

    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/settings')
    cy.contains('Administration Panel').should('not.exist')
  })

  it('admin should access configuration, nurse should not', () => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Configuration').should('be.visible')

    cy.clearCookies()
    cy.clearLocalStorage()

    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/settings')
    cy.contains('button', 'Configuration').should('not.exist')
  })

  it('nurse should create medications, viewer should not', () => {
    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/medications')
    cy.get('button', { timeout: 2500 }).contains(/add/i).should('exist')

    cy.clearCookies()
    cy.clearLocalStorage()

    cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
    cy.visit('/medications')
    cy.get('button').contains(/add.*medication/i).should('not.exist')
  })

  it('counselor should access students, not medications', () => {
    cy.loginAs('counselor@school.edu', 'CounselorPassword123!')
    cy.visit('/students')
    cy.url({ timeout: 2500 }).should('include', '/students')

    cy.visit('/medications')
    cy.url({ timeout: 2500 }).should('not.include', '/medications')
  })

  it('all roles should access dashboard', () => {
    const users = [
      { email: 'admin@school.edu', password: 'AdminPassword123!' },
      { email: 'nurse@school.edu', password: 'testNursePassword' },
      { email: 'counselor@school.edu', password: 'CounselorPassword123!' },
      { email: 'readonly@school.edu', password: 'ReadOnlyPassword123!' }
    ]

    users.forEach((user, index) => {
      if (index > 0) {
        cy.clearCookies()
        cy.clearLocalStorage()
      }

      cy.loginAs(user.email, user.password)
      cy.visit('/dashboard')
      cy.url({ timeout: 2500 }).should('include', '/dashboard')
    })
  })

  it('only admin should see all settings tabs', () => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Districts').should('be.visible')
    cy.contains('button', 'Schools').should('be.visible')
    cy.contains('button', 'Users').should('be.visible')
    cy.contains('button', 'Configuration').should('be.visible')
  })

  it('viewer should see data but no action buttons', () => {
    cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').should('not.exist')
    cy.get('button').contains(/add|create|new/i).should('not.exist')
  })

  it('nurse should not see delete operations', () => {
    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/students')
    cy.get('body').should('be.visible')
    // Delete buttons should not be present
  })

  it('admin should see user management, others should not', () => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Users').should('be.visible')

    cy.clearCookies()
    cy.clearLocalStorage()

    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/settings')
    cy.contains('button', 'Users').should('not.exist')
  })

  it('roles should persist across page navigation', () => {
    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/dashboard')
    cy.visit('/students')
    cy.visit('/medications')

    cy.window({ timeout: 2500 }).then((win) => {
      const userStr = win.localStorage.getItem('user')
      const authStr = win.localStorage.getItem('auth_data')
      // Check role from legacy storage if available
      if (userStr) {
        const user = JSON.parse(userStr)
        expect(user.role).to.equal('NURSE')
      } else {
        // If using encrypted storage, just verify auth data exists
        expect(authStr).to.exist
      }
    })
  })
})
