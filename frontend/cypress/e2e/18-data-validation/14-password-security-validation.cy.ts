/// <reference types="cypress" />

/**
 * Data Validation - Password & Security Validation (15 tests)
 *
 * Tests validation of passwords and security-related fields
 */

describe('Data Validation - Password & Security Validation', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('should require minimum password length', () => {
    cy.visit('/register')
    cy.get('input[name="password"]').type('abc')
    cy.get('input[name="password"]').blur()
    cy.contains(/minimum.*8.*characters|too.*short/i).should('be.visible')
  })

  it('should require password complexity', () => {
    cy.visit('/register')
    cy.get('input[name="password"]').type('password')
    cy.get('input[name="password"]').blur()
    cy.contains(/uppercase|lowercase|number|special.*character/i).should('be.visible')
  })

  it('should require uppercase letter in password', () => {
    cy.visit('/register')
    cy.get('input[name="password"]').type('password123!')
    cy.get('input[name="password"]').blur()
    cy.contains(/uppercase.*letter/i).should('be.visible')
  })

  it('should require lowercase letter in password', () => {
    cy.visit('/register')
    cy.get('input[name="password"]').type('PASSWORD123!')
    cy.get('input[name="password"]').blur()
    cy.contains(/lowercase.*letter/i).should('be.visible')
  })

  it('should require number in password', () => {
    cy.visit('/register')
    cy.get('input[name="password"]').type('Password!')
    cy.get('input[name="password"]').blur()
    cy.contains(/number|digit/i).should('be.visible')
  })

  it('should require special character in password', () => {
    cy.visit('/register')
    cy.get('input[name="password"]').type('Password123')
    cy.get('input[name="password"]').blur()
    cy.contains(/special.*character/i).should('be.visible')
  })

  it('should require password confirmation match', () => {
    cy.visit('/register')
    cy.get('input[name="password"]').type('Password123!')
    cy.get('input[name="confirmPassword"]').type('Password456!')
    cy.get('input[name="confirmPassword"]').blur()
    cy.contains(/passwords.*do.*not.*match|must.*match/i).should('be.visible')
  })

  it('should show password strength indicator', () => {
    cy.visit('/register')
    cy.get('input[name="password"]').type('Pass1!')
    cy.get('[class*="strength"], [data-testid="password-strength"]').should('exist')
  })

  it('should prevent common passwords', () => {
    cy.visit('/register')
    cy.get('input[name="password"]').type('Password123!')
    cy.get('input[name="password"]').blur()
    cy.contains(/common.*password|choose.*stronger/i).should('exist')
  })

  it('should validate password does not contain username', () => {
    cy.visit('/register')
    cy.get('input[name="username"]').type('john')
    cy.get('input[name="password"]').type('john123!')
    cy.get('input[name="password"]').blur()
    cy.contains(/cannot.*contain.*username/i).should('be.visible')
  })

  it('should enforce maximum password length', () => {
    cy.visit('/register')
    const longPassword = 'A'.repeat(129) + '1!'
    cy.get('input[name="password"]').type(longPassword)
    cy.get('input[name="password"]').should('have.value', longPassword.substring(0, 128))
  })

  it('should validate current password for password change', () => {
    cy.login('nurse')
    cy.visit('/settings')
    cy.get('input[name="currentPassword"]').type('wrong')
    cy.get('input[name="newPassword"]').type('NewPassword123!')
    cy.get('button[type="submit"]').click()
    cy.contains(/current.*password.*incorrect/i).should('be.visible')
  })

  it('should prevent password reuse', () => {
    cy.login('nurse')
    cy.visit('/settings')
    cy.get('input[name="currentPassword"]').type('admin123')
    cy.get('input[name="newPassword"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.contains(/cannot.*reuse.*password/i).should('be.visible')
  })

  it('should validate security question answers', () => {
    cy.visit('/register')
    cy.get('input[name="securityAnswer"]').type('a')
    cy.get('input[name="securityAnswer"]').blur()
    cy.contains(/too.*short|minimum.*characters/i).should('be.visible')
  })

  it('should validate two-factor authentication code', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('admin@school.edu')
    cy.get('input[name="password"]').type('AdminPassword123!')
    cy.get('button[type="submit"]').click()
    cy.get('input[name="totpCode"]').type('12345')
    cy.get('input[name="totpCode"]').blur()
    cy.contains(/invalid.*code|6.*digits/i).should('be.visible')
  })
})
