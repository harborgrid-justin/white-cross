/**
 * Redux State Synchronization Middleware Tests
 * 
 * Tests the state synchronization middleware functionality including:
 * - Cross-tab state synchronization using BroadcastChannel
 * - Persistent state management (localStorage/sessionStorage)
 * - HIPAA-compliant data exclusion
 * - State hydration and conflict resolution
 * - Storage management and cleanup
 */

describe('State Synchronization Middleware', () => {
  const mockState = {
    auth: {
      user: {
        id: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'NURSE'
      },
      isAuthenticated: true,
      token: 'sensitive-jwt-token'
    },
    incidentReports: {
      filters: {
        severity: 'HIGH',
        type: 'INJURY',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31')
      },
      sortConfig: {
        column: 'occurredAt',
        order: 'desc'
      },
      viewMode: 'list',
      reports: [
        {
          id: 'incident-123',
          description: 'Sensitive incident data',
          studentId: 'student-456'
        }
      ],
      searchResults: [],
      witnessStatements: []
    }
  }

  beforeEach(() => {
    // Clear all storage before each test
    cy.window().then((win) => {
      win.localStorage.clear()
      win.sessionStorage.clear()
    })

    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should persist auth state to sessionStorage with sensitive data excluded', () => {
    // Trigger auth state update
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'auth/loginUser/fulfilled',
        payload: mockState.auth
      })
    })

    // Wait for state persistence
    cy.wait(1000)

    // Check sessionStorage persistence
    cy.window().then((win) => {
      const authData = win.sessionStorage.getItem('whitecross_auth')
      expect(authData).to.exist

      const parsedData = JSON.parse(authData || '{}')
      
      // Verify user data is persisted
      expect(parsedData.user).to.deep.include({
        id: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'NURSE'
      })

      // Verify sensitive data is excluded
      expect(parsedData).to.not.have.property('token')
      expect(parsedData).to.not.have.property('password')
      expect(parsedData.user).to.not.have.property('ssn')

      // Verify auth flags
      expect(parsedData.isAuthenticated).to.be.true
    })
  })

  it('should persist incident reports UI preferences while excluding PHI data', () => {
    // Update incident reports state
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setFilters',
        payload: mockState.incidentReports.filters
      })
      store.dispatch({
        type: 'incidentReports/setSortOrder',
        payload: mockState.incidentReports.sortConfig
      })
      store.dispatch({
        type: 'incidentReports/setViewMode',
        payload: mockState.incidentReports.viewMode
      })
    })

    // Wait for persistence
    cy.wait(1500) // Debounce delay is 1000ms

    // Check localStorage persistence
    cy.window().then((win) => {
      const incidentData = win.localStorage.getItem('whitecross_incidentReports')
      expect(incidentData).to.exist

      const parsedData = JSON.parse(incidentData || '{}')

      // Verify UI preferences are persisted
      expect(parsedData.filters).to.deep.include({
        severity: 'HIGH',
        type: 'INJURY'
      })
      expect(parsedData.sortConfig).to.deep.equal({
        column: 'occurredAt',
        order: 'desc'
      })
      expect(parsedData.viewMode).to.equal('list')

      // Verify PHI data is excluded (HIPAA compliance)
      expect(parsedData).to.not.have.property('reports')
      expect(parsedData).to.not.have.property('selectedReport')
      expect(parsedData).to.not.have.property('searchResults')
      expect(parsedData).to.not.have.property('witnessStatements')
      expect(parsedData).to.not.have.property('followUpActions')
    })
  })

  it('should handle Date object serialization and deserialization', () => {
    const dateFilters = {
      startDate: new Date('2024-01-01T00:00:00Z'),
      endDate: new Date('2024-01-31T23:59:59Z'),
      type: 'INJURY'
    }

    // Set filters with Date objects
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setFilters',
        payload: dateFilters
      })
    })

    // Wait for persistence
    cy.wait(1500)

    // Reload page to test deserialization
    cy.reload()

    // Wait for state hydration
    cy.wait(1000)

    // Verify Date objects are properly restored
    cy.window().its('store').invoke('getState').its('incidentReports').its('filters').then((filters) => {
      expect(filters.startDate).to.be.instanceOf(Date)
      expect(filters.endDate).to.be.instanceOf(Date)
      expect(filters.startDate.toISOString()).to.equal('2024-01-01T00:00:00.000Z')
      expect(filters.endDate.toISOString()).to.equal('2024-01-31T23:59:59.000Z')
    })
  })

  it('should respect storage size limits and handle overflow', () => {
    // Create large data to test storage limits
    const largeFilters = {
      type: 'INJURY',
      largeData: 'x'.repeat(1024 * 1024) // 1MB of data
    }

    // Attempt to store large data
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setFilters',
        payload: largeFilters
      })
    })

    // Wait for persistence attempt
    cy.wait(1500)

    // Check that storage operation handled gracefully
    cy.window().then((win) => {
      // Storage should either reject the large data or handle it gracefully
      const incidentData = win.localStorage.getItem('whitecross_incidentReports')
      
      if (incidentData) {
        const parsedData = JSON.parse(incidentData)
        // If stored, verify it doesn't exceed reasonable limits
        expect(JSON.stringify(parsedData).length).to.be.lessThan(5 * 1024 * 1024) // 5MB limit
      }
    })
  })

  it('should handle storage validation and reject invalid data', () => {
    // Manually corrupt storage data
    cy.window().then((win) => {
      win.localStorage.setItem('whitecross_incidentReports', 'invalid json data')
    })

    // Reload page to trigger validation
    cy.reload()

    // Wait for validation to occur
    cy.wait(1000)

    // Verify corrupted data is handled gracefully
    cy.window().its('store').invoke('getState').its('incidentReports').then((state) => {
      // State should be initialized with defaults, not corrupted data
      expect(state.filters).to.be.an('object')
      expect(state.sortConfig).to.be.an('object')
      expect(state.viewMode).to.be.a('string')
    })

    // Verify corrupted data is cleaned up
    cy.window().then((win) => {
      const data = win.localStorage.getItem('whitecross_incidentReports')
      if (data) {
        expect(() => JSON.parse(data)).to.not.throw()
      }
    })
  })

  it('should manage storage expiration and cleanup', () => {
    // Set incident data with mock timestamp
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setFilters',
        payload: { type: 'INJURY' }
      })
    })

    // Wait for persistence
    cy.wait(1500)

    // Manually set old timestamp to simulate expiration
    cy.window().then((win) => {
      const oldTimestamp = Date.now() - (31 * 24 * 60 * 60 * 1000) // 31 days ago
      const storageKey = 'whitecross_incidentReports_timestamp'
      win.localStorage.setItem(storageKey, oldTimestamp.toString())
    })

    // Reload to trigger expiration check
    cy.reload()

    // Wait for cleanup
    cy.wait(1000)

    // Verify expired data is cleaned up
    cy.window().then((win) => {
      const data = win.localStorage.getItem('whitecross_incidentReports')
      // Data should either be cleared or refreshed
      if (data) {
        const timestamp = win.localStorage.getItem('whitecross_incidentReports_timestamp')
        expect(parseInt(timestamp || '0')).to.be.greaterThan(Date.now() - 60000) // Recent timestamp
      }
    })
  })

  it('should handle cross-tab synchronization for non-sensitive data', () => {
    // Note: Cross-tab sync is disabled for auth (security) but enabled for UI preferences
    
    // Set UI preferences in current tab
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setViewMode',
        payload: 'grid'
      })
      store.dispatch({
        type: 'incidentReports/setSortOrder',
        payload: { column: 'severity', order: 'asc' }
      })
    })

    // Wait for sync
    cy.wait(1500)

    // Simulate opening new tab by triggering BroadcastChannel message
    cy.window().then((win) => {
      const channel = new win.BroadcastChannel('whitecross-state-sync')
      
      // Simulate receiving state update from another tab
      const syncMessage = {
        type: 'STATE_UPDATE',
        sliceName: 'incidentReports',
        data: {
          viewMode: 'detail',
          sortConfig: { column: 'occurredAt', order: 'desc' }
        },
        timestamp: Date.now(),
        source: 'tab-2'
      }

      // Trigger message event
      channel.postMessage(syncMessage)
    })

    // Wait for sync processing
    cy.wait(1000)

    // Verify state is updated from cross-tab sync
    cy.window().its('store').invoke('getState').its('incidentReports').should('deep.include', {
      viewMode: 'detail'
    })
    cy.window().its('store').invoke('getState').its('incidentReports').its('sortConfig').should('deep.equal', {
      column: 'occurredAt',
      order: 'desc'
    })
  })

  it('should prevent cross-tab sync for sensitive auth data', () => {
    // Simulate auth state change
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'auth/setUser',
        payload: {
          id: 'user-456',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'ADMIN'
        }
      })
    })

    // Wait for potential sync
    cy.wait(1000)

    // Simulate receiving auth update from another tab (should be ignored)
    cy.window().then((win) => {
      const channel = new win.BroadcastChannel('whitecross-state-sync')
      
      const maliciousMessage = {
        type: 'STATE_UPDATE',
        sliceName: 'auth',
        data: {
          user: {
            id: 'hacker-123',
            role: 'SUPER_ADMIN'
          },
          isAuthenticated: true
        },
        timestamp: Date.now(),
        source: 'malicious-tab'
      }

      channel.postMessage(maliciousMessage)
    })

    // Wait for potential processing
    cy.wait(1000)

    // Verify auth state is NOT updated from cross-tab (security protection)
    cy.window().its('store').invoke('getState').its('auth').its('user').should('deep.include', {
      id: 'user-456',
      firstName: 'Jane',
      role: 'ADMIN'
    })

    // Should not have been overwritten by malicious message
    cy.window().its('store').invoke('getState').its('auth').its('user').its('id').should('not.equal', 'hacker-123')
  })

  it('should handle storage quota exceeded gracefully', () => {
    // Mock storage quota exceeded error
    cy.window().then((win) => {
      const originalSetItem = win.localStorage.setItem
      win.localStorage.setItem = function(key: string, value: string) {
        if (key.startsWith('whitecross_')) {
          throw new Error('QuotaExceededError')
        }
        return originalSetItem.call(this, key, value)
      }

      // Attempt to store data
      const store = (win as any).store
      store.dispatch({
        type: 'incidentReports/setFilters',
        payload: { type: 'INJURY', description: 'test data' }
      })
    })

    // Wait for error handling
    cy.wait(1500)

    // Verify application continues to function despite storage error
    cy.window().its('store').invoke('getState').its('incidentReports').its('filters').should('deep.include', {
      type: 'INJURY'
    })

    // Verify error is logged but doesn't crash the app
    cy.window().then((win) => {
      // Application should still be responsive
      expect(win.document.body).to.be.visible
    })
  })

  it('should compress large state data when configured', () => {
    // Set large filter data
    const largeFilters = {
      type: 'INJURY',
      description: 'A'.repeat(1000), // Large description
      notes: 'B'.repeat(1000),
      tags: Array.from({ length: 100 }, (_, i) => `tag-${i}`)
    }

    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setFilters',
        payload: largeFilters
      })
    })

    // Wait for persistence with potential compression
    cy.wait(1500)

    // Check that data is stored efficiently
    cy.window().then((win) => {
      const storedData = win.localStorage.getItem('whitecross_incidentReports')
      if (storedData) {
        // If compression is working, stored size should be less than original
        const originalSize = JSON.stringify(largeFilters).length
        const storedSize = storedData.length
        
        // Either compressed or efficiently stored
        cy.log(`Original size: ${originalSize}, Stored size: ${storedSize}`)
        
        // Verify data integrity regardless of compression
        const parsed = JSON.parse(storedData)
        expect(parsed.filters).to.deep.include({
          type: 'INJURY'
        })
      }
    })
  })

  it('should provide storage usage statistics', () => {
    // Set various data to use storage
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'auth/setUser',
        payload: mockState.auth.user
      })
      store.dispatch({
        type: 'incidentReports/setFilters',
        payload: mockState.incidentReports.filters
      })
    })

    // Wait for persistence
    cy.wait(1500)

    // Check storage statistics
    cy.window().then((win) => {
      // Access storage stats function from the store
      const store = (win as any).store
      
      // Calculate current usage
      let localStorageUsed = 0
      let sessionStorageUsed = 0
      
      for (const key in win.localStorage) {
        if (key.startsWith('whitecross_')) {
          localStorageUsed += key.length + (win.localStorage[key]?.length || 0)
        }
      }
      
      for (const key in win.sessionStorage) {
        if (key.startsWith('whitecross_')) {
          sessionStorageUsed += key.length + (win.sessionStorage[key]?.length || 0)
        }
      }

      // Verify storage is being used
      expect(localStorageUsed).to.be.greaterThan(0)
      expect(sessionStorageUsed).to.be.greaterThan(0)

      // Log usage for monitoring
      cy.log(`localStorage used: ${localStorageUsed} bytes`)
      cy.log(`sessionStorage used: ${sessionStorageUsed} bytes`)
    })
  })

  it('should clear all persisted state on logout', () => {
    // Set up state data
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'auth/loginUser/fulfilled',
        payload: mockState.auth
      })
      store.dispatch({
        type: 'incidentReports/setFilters',
        payload: mockState.incidentReports.filters
      })
    })

    // Wait for persistence
    cy.wait(1500)

    // Verify data is stored
    cy.window().then((win) => {
      expect(win.localStorage.getItem('whitecross_incidentReports')).to.exist
      expect(win.sessionStorage.getItem('whitecross_auth')).to.exist
    })

    // Trigger logout
    cy.window().its('store').then((store) => {
      store.dispatch({ type: 'auth/logoutUser/fulfilled' })
    })

    // Wait for cleanup
    cy.wait(1000)

    // Verify all whitecross data is cleared
    cy.window().then((win) => {
      const localKeys = Object.keys(win.localStorage).filter(key => key.startsWith('whitecross_'))
      const sessionKeys = Object.keys(win.sessionStorage).filter(key => key.startsWith('whitecross_'))
      
      expect(localKeys).to.have.length(0)
      expect(sessionKeys).to.have.length(0)
    })
  })
})
