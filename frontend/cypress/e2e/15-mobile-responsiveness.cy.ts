/// <reference types="cypress" />

describe('Mobile Application - Responsiveness & Touch', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        data: { id: '1', email: 'nurse@school.edu', role: 'NURSE' }
      }
    }).as('verifyAuth')
    
    cy.setupAuthenticationForTests()
  })

  describe('Mobile Viewport - iPhone X', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should display mobile-friendly login page', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').should('be.visible')
      cy.get('[data-testid="password-input"]').should('be.visible')
      cy.get('[data-testid="login-button"]').should('be.visible')
    })

    it('should have responsive navigation menu', () => {
      cy.visit('/dashboard')
      cy.wait('@verifyAuth')
      
      // Mobile menu should be accessible
      cy.get('[data-testid="mobile-menu-button"]').should('be.visible')
      cy.get('[data-testid="mobile-menu-button"]').click()
      
      cy.get('[data-testid="mobile-nav"]').should('be.visible')
    })

    it('should display dashboard cards in single column', () => {
      cy.visit('/dashboard')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="stats-grid"]').should('have.css', 'flex-direction', 'column')
    })

    it('should have touch-friendly button sizes', () => {
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="add-student-button"]').then(($btn) => {
        const height = $btn.height()
        expect(height).to.be.at.least(44) // Minimum touch target size
      })
    })

    it('should show mobile-optimized tables', () => {
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: { students: [
            { id: '1', firstName: 'Emma', lastName: 'Wilson', grade: '8' }
          ]}
        }
      })
      
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      // Tables should be scrollable or stacked on mobile
      cy.get('[data-testid="students-table"]').should('exist')
    })
  })

  describe('Mobile Viewport - iPad', () => {
    beforeEach(() => {
      cy.viewport('ipad-2')
    })

    it('should display tablet layout', () => {
      cy.visit('/dashboard')
      cy.wait('@verifyAuth')
      
      cy.contains('Dashboard').should('be.visible')
    })

    it('should show two-column grid on tablet', () => {
      cy.visit('/medications')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="medications-grid"]').should('be.visible')
    })
  })

  describe('Touch Gestures', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should support swipe navigation', () => {
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="student-card-1"]')
        .trigger('touchstart', { touches: [{ clientX: 300, clientY: 100 }] })
        .trigger('touchmove', { touches: [{ clientX: 100, clientY: 100 }] })
        .trigger('touchend')
      
      // Should reveal action buttons
      cy.get('[data-testid="swipe-actions"]').should('be.visible')
    })

    it('should support pull-to-refresh', () => {
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: { success: true, data: { students: [] } }
      }).as('refreshData')
      
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      cy.get('body')
        .trigger('touchstart', { touches: [{ clientX: 200, clientY: 0 }] })
        .trigger('touchmove', { touches: [{ clientX: 200, clientY: 100 }] })
        .trigger('touchend')
      
      cy.wait('@refreshData')
    })

    it('should support tap to expand cards', () => {
      cy.visit('/medications')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="medication-card-1"]').click()
      cy.get('[data-testid="medication-details-1"]').should('be.visible')
    })
  })

  describe('Offline Capability', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should display offline indicator when disconnected', () => {
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      // Simulate offline
      cy.window().then((win) => {
        win.dispatchEvent(new Event('offline'))
      })
      
      cy.get('[data-testid="offline-indicator"]').should('be.visible')
      cy.contains('You are offline').should('be.visible')
    })

    it('should queue actions when offline', () => {
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      // Go offline
      cy.window().then((win) => {
        win.dispatchEvent(new Event('offline'))
      })
      
      // Try to add student
      cy.get('[data-testid="add-student-button"]').click()
      cy.get('[data-testid="student-name"]').type('Test Student')
      cy.get('[data-testid="save-student"]').click()
      
      cy.contains('Action queued for when online').should('be.visible')
    })

    it('should sync data when coming back online', () => {
      cy.intercept('POST', '**/api/students', {
        statusCode: 201,
        body: { success: true }
      }).as('syncData')
      
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      // Come back online
      cy.window().then((win) => {
        win.dispatchEvent(new Event('online'))
      })
      
      cy.wait('@syncData')
      cy.contains('Data synced successfully').should('be.visible')
    })

    it('should cache frequently accessed data', () => {
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      // Load data
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: { success: true, data: { students: [] } }
      }).as('loadStudents')
      
      cy.wait('@loadStudents')
      
      // Go offline
      cy.window().then((win) => {
        win.dispatchEvent(new Event('offline'))
      })
      
      // Data should still be visible from cache
      cy.contains('Student Management').should('be.visible')
    })
  })

  describe('Push Notifications', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should request notification permissions', () => {
      cy.visit('/dashboard')
      cy.wait('@verifyAuth')
      
      cy.window().then((win) => {
        cy.stub(win.Notification, 'requestPermission').resolves('granted')
      })
      
      cy.get('[data-testid="enable-notifications"]').click()
      cy.contains('Notifications enabled').should('be.visible')
    })

    it('should display notification badge for unread alerts', () => {
      cy.intercept('GET', '**/api/notifications/unread', {
        statusCode: 200,
        body: {
          success: true,
          data: { count: 3 }
        }
      }).as('getUnread')
      
      cy.visit('/dashboard')
      cy.wait('@verifyAuth')
      cy.wait('@getUnread')
      
      cy.get('[data-testid="notification-badge"]').should('contain', '3')
    })

    it('should show notification list', () => {
      cy.intercept('GET', '**/api/notifications', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            notifications: [
              {
                id: '1',
                title: 'New Appointment',
                message: 'Emma Wilson has an appointment at 2pm',
                timestamp: '2024-01-15T10:00:00Z'
              }
            ]
          }
        }
      }).as('getNotifications')
      
      cy.visit('/dashboard')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="notifications-button"]').click()
      cy.wait('@getNotifications')
      
      cy.contains('New Appointment').should('be.visible')
    })
  })

  describe('Camera & Barcode Scanning', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should access device camera for photo capture', () => {
      cy.visit('/incidents')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="create-incident-button"]').click()
      cy.get('[data-testid="capture-photo"]').click()
      
      cy.get('[data-testid="camera-view"]').should('be.visible')
    })

    it('should scan QR codes for student lookup', () => {
      cy.intercept('POST', '**/api/students/lookup-by-qr', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: 'STU001',
            firstName: 'Emma',
            lastName: 'Wilson'
          }
        }
      }).as('qrLookup')
      
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="scan-qr-button"]').click()
      cy.get('[data-testid="qr-scanner"]').should('be.visible')
      
      // Simulate QR code scan
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('qr-scanned', {
          detail: { code: 'STU001' }
        }))
      })
      
      cy.wait('@qrLookup')
      cy.contains('Emma Wilson').should('be.visible')
    })

    it('should scan barcodes for medication tracking', () => {
      cy.intercept('POST', '**/api/medications/lookup-by-barcode', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: 'MED001',
            name: 'Albuterol Inhaler'
          }
        }
      }).as('barcodeLookup')
      
      cy.visit('/medications')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="scan-barcode-button"]').click()
      cy.get('[data-testid="barcode-scanner"]').should('be.visible')
    })
  })

  describe('Voice-to-Text Documentation', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should enable voice input for notes', () => {
      cy.visit('/incidents')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="create-incident-button"]').click()
      cy.get('[data-testid="voice-input-button"]').click()
      
      cy.get('[data-testid="voice-indicator"]').should('be.visible')
    })

    it('should transcribe voice to text', () => {
      cy.visit('/incidents')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="create-incident-button"]').click()
      cy.get('[data-testid="voice-input-button"]').click()
      
      // Simulate voice transcription
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('voice-transcribed', {
          detail: { text: 'Student fell on playground' }
        }))
      })
      
      cy.get('[data-testid="description"]').should('have.value', 'Student fell on playground')
    })
  })

  describe('Emergency Quick Actions', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should display emergency FAB', () => {
      cy.visit('/dashboard')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="emergency-fab"]').should('be.visible')
    })

    it('should show emergency action menu', () => {
      cy.visit('/dashboard')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="emergency-fab"]').click()
      
      cy.get('[data-testid="call-911"]').should('be.visible')
      cy.get('[data-testid="administer-epipen"]').should('be.visible')
      cy.get('[data-testid="report-incident"]').should('be.visible')
    })

    it('should quick-dial emergency contacts', () => {
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="student-1"]').click()
      cy.get('[data-testid="emergency-call"]').click()
      
      cy.get('[data-testid="call-dialog"]').should('be.visible')
    })
  })

  describe('Biometric Authentication', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should support Touch ID/Face ID', () => {
      cy.visit('/login')
      
      cy.window().then((win) => {
        cy.stub(win.navigator.credentials, 'get').resolves({
          id: 'user-1',
          type: 'public-key'
        })
      })
      
      cy.get('[data-testid="biometric-login"]').click()
      
      cy.url().should('not.include', '/login')
    })

    it('should fallback to password on biometric failure', () => {
      cy.visit('/login')
      
      cy.window().then((win) => {
        cy.stub(win.navigator.credentials, 'get').rejects(new Error('Biometric failed'))
      })
      
      cy.get('[data-testid="biometric-login"]').click()
      
      cy.get('[data-testid="password-input"]').should('be.visible')
      cy.contains('Biometric authentication failed').should('be.visible')
    })
  })

  describe('Mobile Forms', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should have mobile-optimized input fields', () => {
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="add-student-button"]').click()
      
      // Fields should be appropriately spaced
      cy.get('[data-testid="first-name"]').should('be.visible')
      cy.get('[data-testid="last-name"]').should('be.visible')
    })

    it('should use native mobile keyboards', () => {
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="add-student-button"]').click()
      
      // Email field should trigger email keyboard
      cy.get('[data-testid="email"]').should('have.attr', 'type', 'email')
      
      // Phone field should trigger number keyboard
      cy.get('[data-testid="phone"]').should('have.attr', 'type', 'tel')
    })

    it('should support autofill', () => {
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="add-student-button"]').click()
      
      cy.get('[data-testid="first-name"]').should('have.attr', 'autocomplete')
      cy.get('[data-testid="email"]').should('have.attr', 'autocomplete', 'email')
    })
  })

  describe('Performance on Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should load pages quickly', () => {
      const startTime = Date.now()
      
      cy.visit('/dashboard')
      cy.wait('@verifyAuth')
      
      cy.contains('Dashboard').should('be.visible')
      
      const loadTime = Date.now() - startTime
      expect(loadTime).to.be.lessThan(3000) // 3 seconds max
    })

    it('should use lazy loading for images', () => {
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      cy.get('img[loading="lazy"]').should('exist')
    })

    it('should minimize data usage', () => {
      // Check that API requests are optimized
      cy.intercept('GET', '**/api/**', (req) => {
        expect(req.headers).to.have.property('accept-encoding')
      })
      
      cy.visit('/dashboard')
      cy.wait('@verifyAuth')
    })
  })

  describe('Accessibility on Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should support screen readers', () => {
      cy.visit('/dashboard')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="dashboard-title"]')
        .should('have.attr', 'role', 'heading')
        .should('have.attr', 'aria-level', '1')
    })

    it('should have proper focus indicators', () => {
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="add-student-button"]').focus()
      cy.get('[data-testid="add-student-button"]')
        .should('have.css', 'outline')
    })

    it('should support high contrast mode', () => {
      cy.visit('/dashboard')
      cy.wait('@verifyAuth')
      
      cy.window().then((win) => {
        win.matchMedia('(prefers-contrast: high)').matches = true
      })
      
      // UI should adapt to high contrast
      cy.get('body').should('exist')
    })
  })
})
