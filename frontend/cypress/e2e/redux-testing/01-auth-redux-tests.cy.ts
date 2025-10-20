/**
 * Redux Authentication State Management Tests
 * 
 * Tests the authentication Redux slice functionality including:
 * - Login/logout state management
 * - User registration state flow
 * - Token refresh handling
 * - Error state management
 * - State persistence and synchronization
 */

describe('Auth Redux State Management', () => {
  beforeEach(() => {
    // Setup API intercepts for auth endpoints
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          id: 'user-123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'NURSE'
        },
        token: 'mock-jwt-token'
      }
    }).as('loginSuccess')

    cy.intercept('POST', '**/api/auth/register', {
      statusCode: 201,
      body: {
        success: true,
        user: {
          id: 'user-456',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          role: 'COUNSELOR'
        },
        token: 'mock-jwt-token-new'
      }
    }).as('registerSuccess')

    cy.intercept('POST', '**/api/auth/logout', {
      statusCode: 200,
      body: { success: true, message: 'Logged out successfully' }
    }).as('logoutSuccess')

    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          id: 'user-123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'NURSE'
        }
      }
    }).as('verifyTokenSuccess')

    cy.visit('/login')
  })

  it('should handle successful login and update Redux state', () => {
    // Verify initial auth state
    cy.window().its('store').invoke('getState').its('auth').should('deep.include', {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })

    // Fill login form
    cy.get('[data-cy="email-input"]').type('john.doe@example.com')
    cy.get('[data-cy="password-input"]').type('password123')
    cy.get('[data-cy="login-button"]').click()

    // Verify loading state is set
    cy.window().its('store').invoke('getState').its('auth').its('isLoading').should('be.true')

    // Wait for login API call
    cy.wait('@loginSuccess')

    // Verify successful auth state
    cy.window().its('store').invoke('getState').its('auth').should('deep.include', {
      isAuthenticated: true,
      isLoading: false,
      error: null
    })

    // Verify user data is stored
    cy.window().its('store').invoke('getState').its('auth').its('user').should('deep.include', {
      id: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'NURSE'
    })

    // Verify success toast is shown
    cy.contains('Welcome back, John!').should('be.visible')

    // Verify redirect to dashboard
    cy.url().should('include', '/dashboard')
  })

  it('should handle login failure and update error state', () => {
    // Mock failed login
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: { success: false, message: 'Invalid credentials' }
    }).as('loginFailure')

    // Fill login form with invalid credentials
    cy.get('[data-cy="email-input"]').type('invalid@example.com')
    cy.get('[data-cy="password-input"]').type('wrongpassword')
    cy.get('[data-cy="login-button"]').click()

    // Wait for failed login
    cy.wait('@loginFailure')

    // Verify error state
    cy.window().its('store').invoke('getState').its('auth').should('deep.include', {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: 'Invalid credentials'
    })

    // Verify error toast is shown
    cy.contains('Invalid credentials').should('be.visible')

    // Verify user stays on login page
    cy.url().should('include', '/login')
  })

  it('should handle user registration and update state', () => {
    // Navigate to registration
    cy.get('[data-cy="register-link"]').click()
    cy.url().should('include', '/register')

    // Fill registration form
    cy.get('[data-cy="first-name-input"]').type('Jane')
    cy.get('[data-cy="last-name-input"]').type('Smith')
    cy.get('[data-cy="email-input"]').type('jane.smith@example.com')
    cy.get('[data-cy="password-input"]').type('securepassword123')
    cy.get('[data-cy="confirm-password-input"]').type('securepassword123')
    cy.get('[data-cy="role-select"]').select('COUNSELOR')
    cy.get('[data-cy="register-button"]').click()

    // Verify loading state
    cy.window().its('store').invoke('getState').its('auth').its('isLoading').should('be.true')

    // Wait for registration
    cy.wait('@registerSuccess')

    // Verify successful registration state
    cy.window().its('store').invoke('getState').its('auth').should('deep.include', {
      isAuthenticated: true,
      isLoading: false,
      error: null
    })

    // Verify new user data
    cy.window().its('store').invoke('getState').its('auth').its('user').should('deep.include', {
      id: 'user-456',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      role: 'COUNSELOR'
    })

    // Verify success message
    cy.contains('Welcome, Jane! Your account has been created.').should('be.visible')
  })

  it('should handle logout and clear auth state', () => {
    // First login
    cy.get('[data-cy="email-input"]').type('john.doe@example.com')
    cy.get('[data-cy="password-input"]').type('password123')
    cy.get('[data-cy="login-button"]').click()
    cy.wait('@loginSuccess')

    // Navigate to dashboard
    cy.visit('/dashboard')

    // Trigger logout
    cy.get('[data-cy="user-menu"]').click()
    cy.get('[data-cy="logout-button"]').click()

    // Wait for logout API call
    cy.wait('@logoutSuccess')

    // Verify auth state is cleared
    cy.window().its('store').invoke('getState').its('auth').should('deep.include', {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })

    // Verify localStorage is cleared
    cy.window().then((win) => {
      expect(win.localStorage.getItem('whitecross_auth')).to.be.null
    })

    // Verify redirect to login
    cy.url().should('include', '/login')

    // Verify success message
    cy.contains('You have been logged out successfully').should('be.visible')
  })

  it('should handle token refresh and maintain auth state', () => {
    // Login first
    cy.get('[data-cy="email-input"]').type('john.doe@example.com')
    cy.get('[data-cy="password-input"]').type('password123')
    cy.get('[data-cy="login-button"]').click()
    cy.wait('@loginSuccess')

    // Trigger token refresh action
    cy.window().its('store').then((store) => {
      store.dispatch({ type: 'auth/refreshUser/pending' })
    })

    // Verify loading state during refresh
    cy.window().its('store').invoke('getState').its('auth').its('isLoading').should('be.true')

    // Wait for token verification
    cy.wait('@verifyTokenSuccess')

    // Verify auth state is maintained
    cy.window().its('store').invoke('getState').its('auth').should('deep.include', {
      isAuthenticated: true,
      isLoading: false,
      error: null
    })

    // Verify user data is refreshed
    cy.window().its('store').invoke('getState').its('auth').its('user').should('deep.include', {
      id: 'user-123',
      firstName: 'John',
      lastName: 'Doe'
    })
  })

  it('should handle failed token refresh and logout user', () => {
    // Mock failed token verification
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 401,
      body: { success: false, message: 'Token expired' }
    }).as('verifyTokenFailure')

    // Start with authenticated state
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'auth/loginUser/fulfilled',
        payload: {
          user: {
            id: 'user-123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'NURSE'
          }
        }
      })
    })

    // Trigger token refresh
    cy.window().its('store').then((store) => {
      store.dispatch({ type: 'auth/refreshUser/pending' })
    })

    // Wait for failed verification
    cy.wait('@verifyTokenFailure')

    // Verify user is logged out
    cy.window().its('store').invoke('getState').its('auth').should('deep.include', {
      user: null,
      isAuthenticated: false,
      error: null
    })
  })

  it('should clear error state when clearError action is dispatched', () => {
    // Set error state
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'auth/loginUser/rejected',
        payload: 'Test error message'
      })
    })

    // Verify error exists
    cy.window().its('store').invoke('getState').its('auth').its('error').should('equal', 'Test error message')

    // Clear error
    cy.window().its('store').then((store) => {
      store.dispatch({ type: 'auth/clearError' })
    })

    // Verify error is cleared
    cy.window().its('store').invoke('getState').its('auth').its('error').should('be.null')
  })

  it('should handle setUser action for manual user updates', () => {
    const testUser = {
      id: 'user-789',
      firstName: 'Manual',
      lastName: 'User',
      email: 'manual.user@example.com',
      role: 'ADMIN'
    }

    // Dispatch setUser action
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'auth/setUser',
        payload: testUser
      })
    })

    // Verify user is set and authenticated
    cy.window().its('store').invoke('getState').its('auth').should('deep.include', {
      user: testUser,
      isAuthenticated: true,
      error: null
    })

    // Test clearing user
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'auth/setUser',
        payload: null
      })
    })

    // Verify user is cleared
    cy.window().its('store').invoke('getState').its('auth').should('deep.include', {
      user: null,
      isAuthenticated: false
    })
  })

  it('should persist auth state in sessionStorage', () => {
    // Login
    cy.get('[data-cy="email-input"]').type('john.doe@example.com')
    cy.get('[data-cy="password-input"]').type('password123')
    cy.get('[data-cy="login-button"]').click()
    cy.wait('@loginSuccess')

    // Check sessionStorage persistence (auth slice uses sessionStorage)
    cy.window().then((win) => {
      const authData = win.sessionStorage.getItem('whitecross_auth')
      expect(authData).to.exist
      
      // Verify sensitive data is excluded
      const parsedData = JSON.parse(authData || '{}')
      expect(parsedData).to.not.have.property('token')
      expect(parsedData).to.not.have.property('password')
    })

    // Reload page and verify auth state is restored
    cy.reload()

    // Verify auth state persists after reload
    cy.window().its('store').invoke('getState').its('auth').its('isAuthenticated').should('be.true')
  })

  it('should handle network errors gracefully', () => {
    // Mock network error
    cy.intercept('POST', '**/api/auth/login', { forceNetworkError: true }).as('networkError')

    // Attempt login
    cy.get('[data-cy="email-input"]').type('john.doe@example.com')
    cy.get('[data-cy="password-input"]').type('password123')
    cy.get('[data-cy="login-button"]').click()

    // Wait for network error
    cy.wait('@networkError')

    // Verify error handling
    cy.window().its('store').invoke('getState').its('auth').should('deep.include', {
      user: null,
      isAuthenticated: false,
      isLoading: false
    })

    // Error should be set
    cy.window().its('store').invoke('getState').its('auth').its('error').should('exist')

    // Error message should be displayed
    cy.get('[data-cy="error-message"]').should('be.visible')
  })
})
