/// <reference types="cypress" />

describe('Administration Panel - Settings', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        data: { id: '1', email: 'admin@school.edu', role: 'ADMIN' }
      }
    }).as('verifyAuth')
    
    cy.intercept('GET', '**/api/administration/districts*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          districts: [
            {
              id: '1',
              name: 'Springfield School District',
              code: 'SSD',
              schoolCount: 5,
              studentCount: 3500
            }
          ],
          total: 1
        }
      }
    }).as('getDistricts')
    
    cy.login()
    cy.visit('/settings')
    cy.wait('@verifyAuth')
  })

  describe('Administration Panel Display', () => {
    it('should display administration panel', () => {
      cy.contains('Administration Panel').should('be.visible')
    })

    it('should show all tabs', () => {
      const tabs = [
        'Overview',
        'Districts',
        'Schools',
        'Users',
        'Configuration',
        'Integrations',
        'Backups',
        'Monitoring',
        'Licenses',
        'Training',
        'Audit Logs'
      ]
      
      tabs.forEach(tab => {
        cy.contains('button', tab).should('be.visible')
      })
    })
  })

  describe('District Management', () => {
    it('should display districts list', () => {
      cy.contains('button', 'Districts').click()
      cy.wait('@getDistricts')
      cy.contains('Springfield School District').should('be.visible')
    })

    it('should add new district', () => {
      cy.intercept('POST', '**/api/administration/districts', {
        statusCode: 201,
        body: {
          success: true,
          data: { id: '2', name: 'Riverside District' }
        }
      }).as('addDistrict')
      
      cy.contains('button', 'Districts').click()
      cy.wait('@getDistricts')
      
      cy.get('[data-testid="add-district-button"]').click()
      
      cy.get('[data-testid="district-name"]').type('Riverside District')
      cy.get('[data-testid="district-code"]').type('RSD')
      cy.get('[data-testid="address"]').type('123 Main St')
      cy.get('[data-testid="superintendent"]').type('Dr. Smith')
      cy.get('[data-testid="save-district"]').click()
      
      cy.wait('@addDistrict')
      cy.contains('District added successfully').should('be.visible')
    })

    it('should update district', () => {
      cy.intercept('PUT', '**/api/administration/districts/1', {
        statusCode: 200,
        body: { success: true }
      }).as('updateDistrict')
      
      cy.contains('button', 'Districts').click()
      cy.wait('@getDistricts')
      
      cy.get('[data-testid="edit-district-1"]').click()
      cy.get('[data-testid="district-name"]').clear().type('Springfield District Updated')
      cy.get('[data-testid="save-district"]').click()
      
      cy.wait('@updateDistrict')
      cy.contains('District updated').should('be.visible')
    })

    it('should delete district', () => {
      cy.intercept('DELETE', '**/api/administration/districts/1', {
        statusCode: 200,
        body: { success: true }
      }).as('deleteDistrict')
      
      cy.contains('button', 'Districts').click()
      cy.wait('@getDistricts')
      
      cy.get('[data-testid="delete-district-1"]').click()
      cy.get('[data-testid="confirm-delete"]').click()
      
      cy.wait('@deleteDistrict')
      cy.contains('District deleted').should('be.visible')
    })
  })

  describe('School Management', () => {
    it('should display schools list', () => {
      cy.intercept('GET', '**/api/administration/schools*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            schools: [
              {
                id: '1',
                name: 'Springfield Elementary',
                districtId: '1',
                studentCount: 450,
                nurseCount: 2
              }
            ]
          }
        }
      }).as('getSchools')
      
      cy.contains('button', 'Schools').click()
      cy.wait('@getSchools')
      
      cy.contains('Springfield Elementary').should('be.visible')
    })

    it('should add new school', () => {
      cy.intercept('POST', '**/api/administration/schools', {
        statusCode: 201,
        body: { success: true }
      }).as('addSchool')
      
      cy.contains('button', 'Schools').click()
      cy.get('[data-testid="add-school-button"]').click()
      
      cy.get('[data-testid="school-name"]').type('Lincoln Middle School')
      cy.get('[data-testid="district-select"]').select('1')
      cy.get('[data-testid="address"]').type('456 Oak Ave')
      cy.get('[data-testid="principal"]').type('Mrs. Johnson')
      cy.get('[data-testid="save-school"]').click()
      
      cy.wait('@addSchool')
      cy.contains('School added').should('be.visible')
    })

    it('should view school details', () => {
      cy.intercept('GET', '**/api/administration/schools/1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: '1',
            name: 'Springfield Elementary',
            studentCount: 450,
            staff: 35
          }
        }
      }).as('getSchool')
      
      cy.contains('button', 'Schools').click()
      cy.get('[data-testid="view-school-1"]').click()
      cy.wait('@getSchool')
      
      cy.get('[data-testid="school-details"]').should('be.visible')
      cy.contains('450').should('be.visible')
    })
  })

  describe('User Management', () => {
    it('should display users list', () => {
      cy.intercept('GET', '**/api/administration/users*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            users: [
              {
                id: '1',
                email: 'nurse@school.edu',
                firstName: 'Test',
                lastName: 'Nurse',
                role: 'NURSE',
                isActive: true
              }
            ]
          }
        }
      }).as('getUsers')
      
      cy.contains('button', 'Users').click()
      cy.wait('@getUsers')
      
      cy.contains('nurse@school.edu').should('be.visible')
    })

    it('should create new user', () => {
      cy.intercept('POST', '**/api/administration/users', {
        statusCode: 201,
        body: { success: true }
      }).as('createUser')
      
      cy.contains('button', 'Users').click()
      cy.get('[data-testid="add-user-button"]').click()
      
      cy.get('[data-testid="email"]').type('newuser@school.edu')
      cy.get('[data-testid="first-name"]').type('John')
      cy.get('[data-testid="last-name"]').type('Doe')
      cy.get('[data-testid="role"]').select('NURSE')
      cy.get('[data-testid="school-select"]').select('1')
      cy.get('[data-testid="save-user"]').click()
      
      cy.wait('@createUser')
      cy.contains('User created').should('be.visible')
    })

    it('should update user role', () => {
      cy.intercept('PUT', '**/api/administration/users/1', {
        statusCode: 200,
        body: { success: true }
      }).as('updateUser')
      
      cy.contains('button', 'Users').click()
      cy.get('[data-testid="edit-user-1"]').click()
      cy.get('[data-testid="role"]').select('ADMIN')
      cy.get('[data-testid="save-user"]').click()
      
      cy.wait('@updateUser')
      cy.contains('User updated').should('be.visible')
    })

    it('should deactivate user', () => {
      cy.intercept('PUT', '**/api/administration/users/1/deactivate', {
        statusCode: 200,
        body: { success: true }
      }).as('deactivateUser')
      
      cy.contains('button', 'Users').click()
      cy.get('[data-testid="deactivate-user-1"]').click()
      cy.get('[data-testid="confirm-deactivate"]').click()
      
      cy.wait('@deactivateUser')
      cy.contains('User deactivated').should('be.visible')
    })
  })

  describe('System Configuration', () => {
    it('should display configuration settings', () => {
      cy.contains('button', 'Configuration').click()
      cy.contains('System Configuration').should('be.visible')
    })

    it('should update general settings', () => {
      cy.intercept('PUT', '**/api/administration/config', {
        statusCode: 200,
        body: { success: true }
      }).as('updateConfig')
      
      cy.contains('button', 'Configuration').click()
      
      cy.get('[data-testid="system-name"]').clear().type('White Cross Healthcare')
      cy.get('[data-testid="timezone"]').select('America/New_York')
      cy.get('[data-testid="language"]').select('en')
      cy.get('[data-testid="save-config"]').click()
      
      cy.wait('@updateConfig')
      cy.contains('Settings updated').should('be.visible')
    })

    it('should configure email settings', () => {
      cy.contains('button', 'Configuration').click()
      cy.get('[data-testid="email-settings"]').click()
      
      cy.get('[data-testid="smtp-host"]').type('smtp.gmail.com')
      cy.get('[data-testid="smtp-port"]').type('587')
      cy.get('[data-testid="smtp-user"]').type('admin@school.edu')
      cy.get('[data-testid="save-email-config"]').click()
      
      cy.contains('Email settings saved').should('be.visible')
    })

    it('should test email configuration', () => {
      cy.intercept('POST', '**/api/administration/config/test-email', {
        statusCode: 200,
        body: { success: true }
      }).as('testEmail')
      
      cy.contains('button', 'Configuration').click()
      cy.get('[data-testid="email-settings"]').click()
      cy.get('[data-testid="test-email"]').click()
      
      cy.wait('@testEmail')
      cy.contains('Test email sent').should('be.visible')
    })
  })

  describe('Integration Management', () => {
    it('should display integrations list', () => {
      cy.intercept('GET', '**/api/administration/integrations*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            integrations: [
              {
                id: '1',
                name: 'Student Information System',
                type: 'SIS',
                status: 'CONNECTED'
              }
            ]
          }
        }
      }).as('getIntegrations')
      
      cy.contains('button', 'Integrations').click()
      cy.wait('@getIntegrations')
      
      cy.contains('Student Information System').should('be.visible')
    })

    it('should add new integration', () => {
      cy.intercept('POST', '**/api/administration/integrations', {
        statusCode: 201,
        body: { success: true }
      }).as('addIntegration')
      
      cy.contains('button', 'Integrations').click()
      cy.get('[data-testid="add-integration-button"]').click()
      
      cy.get('[data-testid="integration-name"]').type('EHR System')
      cy.get('[data-testid="integration-type"]').select('EHR')
      cy.get('[data-testid="api-url"]').type('https://ehr.example.com/api')
      cy.get('[data-testid="api-key"]').type('test-api-key')
      cy.get('[data-testid="save-integration"]').click()
      
      cy.wait('@addIntegration')
      cy.contains('Integration added').should('be.visible')
    })

    it('should test integration connection', () => {
      cy.intercept('POST', '**/api/administration/integrations/1/test', {
        statusCode: 200,
        body: {
          success: true,
          data: { connected: true }
        }
      }).as('testConnection')
      
      cy.contains('button', 'Integrations').click()
      cy.get('[data-testid="test-connection-1"]').click()
      
      cy.wait('@testConnection')
      cy.contains('Connection successful').should('be.visible')
    })
  })

  describe('Backup Management', () => {
    it('should display backup history', () => {
      cy.intercept('GET', '**/api/administration/backups*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            backups: [
              {
                id: '1',
                createdAt: '2024-01-15T02:00:00Z',
                size: '125MB',
                status: 'COMPLETED'
              }
            ]
          }
        }
      }).as('getBackups')
      
      cy.contains('button', 'Backups').click()
      cy.wait('@getBackups')
      
      cy.contains('125MB').should('be.visible')
    })

    it('should create manual backup', () => {
      cy.intercept('POST', '**/api/administration/backups', {
        statusCode: 201,
        body: {
          success: true,
          data: { id: '2', status: 'IN_PROGRESS' }
        }
      }).as('createBackup')
      
      cy.contains('button', 'Backups').click()
      cy.get('[data-testid="create-backup-button"]').click()
      cy.get('[data-testid="confirm-backup"]').click()
      
      cy.wait('@createBackup')
      cy.contains('Backup started').should('be.visible')
    })

    it('should download backup', () => {
      cy.intercept('GET', '**/api/administration/backups/1/download', {
        statusCode: 200
      }).as('downloadBackup')
      
      cy.contains('button', 'Backups').click()
      cy.get('[data-testid="download-backup-1"]').click()
      
      cy.wait('@downloadBackup')
    })

    it('should configure automatic backups', () => {
      cy.intercept('PUT', '**/api/administration/backup-config', {
        statusCode: 200,
        body: { success: true }
      }).as('updateBackupConfig')
      
      cy.contains('button', 'Backups').click()
      cy.get('[data-testid="backup-settings"]').click()
      
      cy.get('[data-testid="auto-backup"]').check()
      cy.get('[data-testid="backup-frequency"]').select('daily')
      cy.get('[data-testid="backup-time"]').type('02:00')
      cy.get('[data-testid="retention-days"]').type('30')
      cy.get('[data-testid="save-backup-config"]').click()
      
      cy.wait('@updateBackupConfig')
      cy.contains('Backup settings saved').should('be.visible')
    })
  })

  describe('System Monitoring', () => {
    it('should display system health', () => {
      cy.intercept('GET', '**/api/administration/system-health', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            status: 'healthy',
            uptime: 99.9,
            cpu: 45,
            memory: 62,
            disk: 78
          }
        }
      }).as('getHealth')
      
      cy.contains('button', 'Monitoring').click()
      cy.wait('@getHealth')
      
      cy.contains('99.9%').should('be.visible')
      cy.contains('healthy').should('be.visible')
    })

    it('should display performance metrics', () => {
      cy.intercept('GET', '**/api/administration/performance', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            avgResponseTime: 125,
            requestsPerSecond: 45,
            errorRate: 0.1
          }
        }
      }).as('getPerformance')
      
      cy.contains('button', 'Monitoring').click()
      cy.get('[data-testid="performance-tab"]').click()
      cy.wait('@getPerformance')
      
      cy.contains('125ms').should('be.visible')
    })
  })

  describe('License Management', () => {
    it('should display license information', () => {
      cy.intercept('GET', '**/api/administration/licenses', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            planName: 'Enterprise',
            expiresAt: '2025-12-31',
            maxUsers: 100,
            currentUsers: 45
          }
        }
      }).as('getLicense')
      
      cy.contains('button', 'Licenses').click()
      cy.wait('@getLicense')
      
      cy.contains('Enterprise').should('be.visible')
      cy.contains('45 / 100').should('be.visible')
    })

    it('should update license key', () => {
      cy.intercept('PUT', '**/api/administration/licenses', {
        statusCode: 200,
        body: { success: true }
      }).as('updateLicense')
      
      cy.contains('button', 'Licenses').click()
      cy.get('[data-testid="update-license"]').click()
      
      cy.get('[data-testid="license-key"]').type('NEW-LICENSE-KEY-12345')
      cy.get('[data-testid="save-license"]').click()
      
      cy.wait('@updateLicense')
      cy.contains('License updated').should('be.visible')
    })
  })

  describe('Audit Logs', () => {
    it('should display audit log entries', () => {
      cy.intercept('GET', '**/api/administration/audit-logs*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            logs: [
              {
                id: '1',
                action: 'USER_LOGIN',
                userId: '1',
                timestamp: '2024-01-15T10:00:00Z',
                details: 'User logged in successfully'
              }
            ]
          }
        }
      }).as('getAuditLogs')
      
      cy.contains('button', 'Audit Logs').click()
      cy.wait('@getAuditLogs')
      
      cy.contains('USER_LOGIN').should('be.visible')
    })

    it('should filter audit logs', () => {
      cy.contains('button', 'Audit Logs').click()
      
      cy.get('[data-testid="action-filter"]').select('USER_LOGIN')
      cy.get('[data-testid="date-from"]').type('2024-01-01')
      cy.get('[data-testid="date-to"]').type('2024-01-31')
      cy.get('[data-testid="apply-filter"]').click()
      
      cy.wait('@getAuditLogs')
    })

    it('should export audit logs', () => {
      cy.intercept('GET', '**/api/administration/audit-logs/export*', {
        statusCode: 200,
        headers: { 'Content-Type': 'text/csv' }
      }).as('exportLogs')
      
      cy.contains('button', 'Audit Logs').click()
      cy.get('[data-testid="export-logs"]').click()
      
      cy.wait('@exportLogs')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors', () => {
      cy.intercept('GET', '**/api/administration/districts*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('error')
      
      cy.contains('button', 'Districts').click()
      cy.wait('@error')
      cy.contains('Failed to load districts').should('be.visible')
    })
  })

  describe('Access Control', () => {
    it('should require admin role', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: { id: '1', email: 'nurse@school.edu', role: 'NURSE' }
        }
      }).as('verifyNurse')
      
      cy.visit('/settings')
      cy.wait('@verifyNurse')
      
      // Should redirect or show access denied
      cy.url().should('include', '/access-denied')
    })
  })

  describe('Responsive Design', () => {
    it('should be mobile responsive', () => {
      cy.viewport('iphone-x')
      cy.contains('Administration').should('be.visible')
    })
  })
})
