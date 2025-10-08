/// <reference types="cypress" />

/**
 * Authentication Flow E2E Tests
 * White Cross Healthcare Management System
 * 
 * This test suite validates the complete authentication workflow including
 * login, logout, session management, and access control.
 */

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Start each test from the root URL to test redirect behavior
    cy.visit('/')
  })

  context('Unauthenticated Access', () => {
    it('should redirect unauthenticated users to login page', () => {
      // Verify redirect to login page
      cy.url().should('include', '/login')
      
      // Verify login form elements are present
      cy.get('[data-cy=login-form]').should('be.visible')
      cy.get('[data-cy=email-input]').should('be.visible')
      cy.get('[data-cy=password-input]').should('be.visible')
      cy.get('[data-cy=login-button]').should('be.visible')
    })

    it('should show validation errors for invalid login attempts', () => {
      // Test invalid email format
      cy.get('[data-cy=email-input]').type('invalid-email')
      cy.get('[data-cy=password-input]').type('short')
      cy.get('[data-cy=login-button]').click()
      
      // Verify validation error is displayed
      cy.get('[data-cy=error-message]').should('contain', 'Invalid email format')
      
      // Verify user remains on login page
      cy.url().should('include', '/login')
    })

    it('should show error for non-existent user credentials', () => {
      // Test with non-existent user
      cy.get('[data-cy=email-input]').type('nonexistent@example.com')
      cy.get('[data-cy=password-input]').type('invalidpassword')
      cy.get('[data-cy=login-button]').click()
      
      // Verify authentication error
      cy.get('[data-cy=error-message]').should('contain', 'Invalid credentials')
      cy.url().should('include', '/login')
    })
  })

  context('Successful Authentication', () => {
    it('should successfully authenticate valid users and redirect to dashboard', () => {
      cy.fixture('users').then((users: TestUsers) => {
        const validUser = users.nurse
        
        // Enter valid credentials
        cy.get('[data-cy=email-input]').type(validUser.email)
        cy.get('[data-cy=password-input]').type(validUser.password)
        cy.get('[data-cy=login-button]').click()
        
        // Verify successful login and redirect
        cy.url().should('include', '/dashboard')
        cy.get('[data-cy=user-menu]').should('contain', validUser.name)
        cy.get('[data-cy=dashboard-title]').should('be.visible')
        
        // Verify healthcare-specific dashboard elements
        cy.get('[data-cy=quick-stats]').should('be.visible')
        cy.get('[data-cy=recent-activities]').should('be.visible')
      })
    })

    it('should authenticate different user roles correctly', () => {
      cy.fixture('users').then((users: TestUsers) => {
        // Test admin login
        cy.get('[data-cy=email-input]').type(users.admin.email)
        cy.get('[data-cy=password-input]').type(users.admin.password)
        cy.get('[data-cy=login-button]').click()
        
        cy.url().should('include', '/dashboard')
        cy.get('[data-cy=user-menu]').should('contain', users.admin.name)
        
        // Verify admin-specific elements are visible
        cy.get('[data-cy=admin-panel-link]').should('be.visible')
      })
    })
  })

  context('Session Management', () => {
    it('should maintain authentication state on page refresh', () => {
      // Login as nurse
      cy.login('nurse')
      cy.url().should('include', '/dashboard')
      
      // Refresh page and verify session persistence
      cy.reload()
      cy.url().should('include', '/dashboard')
      cy.get('[data-cy=user-menu]').should('be.visible')
    })

    it('should handle session timeout gracefully', () => {
      cy.login('nurse')
      
      // Simulate session timeout by clearing session storage
      cy.window().then((win) => {
        win.sessionStorage.clear()
        win.localStorage.clear()
      })
      
      // Navigate to a protected page
      cy.visit('/students')
      
      // Should redirect to login
      cy.url().should('include', '/login')
    })
  })

  context('Logout Functionality', () => {
    it('should allow users to logout and redirect to login page', () => {
      // Login first
      cy.login('nurse')
      
      // Logout
      cy.get('[data-cy=user-menu]').click()
      cy.get('[data-cy=logout-button]').click()
      
      // Verify logout and redirect
      cy.url().should('include', '/login')
      cy.get('[data-cy=login-form]').should('be.visible')
    })

    it('should clear session data on logout', () => {
      cy.login('nurse')
      
      // Logout
      cy.get('[data-cy=user-menu]').click()
      cy.get('[data-cy=logout-button]').click()
      
      // Try to access protected page directly
      cy.visit('/dashboard')
      
      // Should redirect to login
      cy.url().should('include', '/login')
    })
  })

  context('Security and Access Control', () => {
    it('should protect direct access to authenticated routes', () => {
      // Try to access protected routes directly
      const protectedRoutes = ['/dashboard', '/students', '/appointments', '/medications', '/health-records']

      protectedRoutes.forEach((route) => {
        cy.visit(route)
        cy.url().should('include', '/login')
      })
    })

    it('should redirect to intended page after login', () => {
      // Try to access protected page
      cy.visit('/health-records')
      cy.url().should('include', '/login')
      cy.url().should('include', 'redirect=')

      // Login
      cy.fixture('users').then((users: TestUsers) => {
        cy.get('[data-cy=email-input]').type(users.nurse.email)
        cy.get('[data-cy=password-input]').type(users.nurse.password)
        cy.get('[data-cy=login-button]').click()

        // Should redirect to originally requested page
        cy.url().should('include', '/health-records')
      })
    })
  })
})
