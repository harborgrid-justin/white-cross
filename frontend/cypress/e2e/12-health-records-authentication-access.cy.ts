/// <reference types="cypress" />

describe('Health Records - Authentication and Access Control (Tests 101-110)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Mock authentication API calls using actual backend structure
    cy.intercept('POST', 'http://localhost:3001/api/auth/login', (req) => {
      const { email, password } = req.body
      
      // Mock different user types based on email - matching actual backend responses
      if (email === 'nurse@school.edu' && password === 'NursePassword123!') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJudXJzZUBzY2hvb2wuZWR1Iiwicm9sZSI6Ik5VUlNFIiwiaWF0IjoxNjk3MDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.mock',
              user: {
                id: '1',
                email: 'nurse@school.edu',
                firstName: 'Sarah',
                lastName: 'Johnson',
                role: 'NURSE'
              }
            }
          }
        })
      } else if (email === 'admin@school.edu' && password === 'AdminPassword123!') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyIiwiZW1haWwiOiJhZG1pbkBzY2hvb2wuZWR1Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjk3MDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.mock',
              user: {
                id: '2',
                email: 'admin@school.edu',
                firstName: 'John',
                lastName: 'Admin',
                role: 'ADMIN'
              }
            }
          }
        })
      } else if (email === 'readonly@school.edu' && password === 'ReadOnlyPassword123!') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzIiwiZW1haWwiOiJyZWFkb25seUBzY2hvb2wuZWR1Iiwicm9sZSI6IlJFQURfT05MWSIsImlhdCI6MTY5NzAwMDAwMCwiZXhwIjo5OTk5OTk5OTk5fQ.mock',
              user: {
                id: '3',
                email: 'readonly@school.edu',
                firstName: 'View',
                lastName: 'Only',
                role: 'READ_ONLY'
              }
            }
          }
        })
      } else if (email === 'counselor@school.edu' && password === 'CounselorPassword123!') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0IiwiZW1haWwiOiJjb3Vuc2Vsb3JAc2Nob29sLmVkdSIsInJvbGUiOiJDT1VOU0VMT1IiLCJpYXQiOjE2OTcwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.mock',
              user: {
                id: '4',
                email: 'counselor@school.edu',
                firstName: 'Mary',
                lastName: 'Counselor',
                role: 'COUNSELOR'
              }
            }
          }
        })
      } else {
        req.reply({
          statusCode: 401,
          body: {
            success: false,
            error: { message: 'Invalid credentials' }
          }
        })
      }
    }).as('loginRequest')
    
    // Mock token verification
    cy.intercept('GET', '**/api/auth/verify', (req) => {
      const authHeader = req.headers.authorization
      const token = Array.isArray(authHeader) ? authHeader[0]?.replace('Bearer ', '') : authHeader?.replace('Bearer ', '')
      
      if (token === 'mock-nurse-token') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              id: '1',
              email: 'nurse@school.edu',
              firstName: 'Sarah',
              lastName: 'Johnson',
              role: 'NURSE'
            }
          }
        })
      } else if (token === 'mock-admin-token') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              id: '2',
              email: 'admin@school.edu',
              firstName: 'John',
              lastName: 'Admin',
              role: 'ADMIN'
            }
          }
        })
      } else if (token === 'mock-readonly-token') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              id: '3',
              email: 'readonly@school.edu',
              firstName: 'View',
              lastName: 'Only',
              role: 'READ_ONLY'
            }
          }
        })
      } else if (token === 'mock-counselor-token') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              id: '4',
              email: 'counselor@school.edu',
              firstName: 'Mary',
              lastName: 'Counselor',
              role: 'COUNSELOR'
            }
          }
        })
      } else {
        req.reply({
          statusCode: 401,
          body: {
            success: false,
            error: { message: 'Invalid token' }
          }
        })
      }
    }).as('verifyToken')
    
    // Mock health records API endpoints using actual backend structure
    cy.intercept('GET', 'http://localhost:3001/api/health-records/**', { 
      statusCode: 200, 
      body: { success: true, data: {} } 
    }).as('healthRecordsAPI')
    
    // Mock students API endpoints
    cy.intercept('GET', 'http://localhost:3001/api/students/assigned', { 
      fixture: 'assignedStudents.json'
    }).as('getAssignedStudents')
    
    cy.intercept('GET', 'http://localhost:3001/api/students/**', { 
      statusCode: 200, 
      body: { success: true, data: { students: [] } } 
    }).as('studentsAPI')
    
    // Mock bulk delete with proper permission checking
    cy.intercept('POST', 'http://localhost:3001/api/health-records/bulk-delete', (req) => {
      const authHeader = req.headers.authorization
      const token = Array.isArray(authHeader) ? authHeader[0]?.replace('Bearer ', '') : authHeader?.replace('Bearer ', '')
      
      if (token && token.includes('readonly')) {
        req.reply({
          statusCode: 403,
          body: {
            success: false,
            error: 'Insufficient permissions'
          }
        })
      } else {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: { deleted: [] }
          }
        })
      }
    }).as('bulkDelete')
    
    // Mock audit endpoints
    cy.intercept('POST', 'http://localhost:3001/api/audit/access-log', { 
      statusCode: 201, 
      body: { success: true, data: { logged: true } } 
    }).as('auditLog')
    
    cy.intercept('POST', 'http://localhost:3001/api/audit/security-log', { 
      statusCode: 201, 
      body: { success: true, data: { logged: true } } 
    }).as('securityLog')
    
    // Mock admin settings endpoint
    cy.intercept('GET', '/api/health-records/admin/settings', (req) => {
      const authHeader = req.headers.authorization
      const token = Array.isArray(authHeader) ? authHeader[0]?.replace('Bearer ', '') : authHeader?.replace('Bearer ', '')
      
      if (token && (token.includes('admin') || token.includes('ADMIN'))) {
        req.reply({
          statusCode: 200,
          body: { success: true, data: { settings: {} } }
        })
      } else {
        req.reply({
          statusCode: 403,
          body: { success: false, error: 'Insufficient permissions' }
        })
      }
    }).as('adminSettings')
  })

  describe('Authentication Requirements (Tests 101-105)', () => {
    it('Test 101: Should redirect unauthenticated users to login', () => {
      cy.visit('/health-records')
      cy.url().should('include', '/login')
      cy.get('[data-testid="login-form"]').should('be.visible')
      cy.get('[data-testid="error-message"]').should('contain', 'Please log in to access health records')
    })

    it('Test 102: Should deny access with invalid credentials', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('invalid@example.com')
      cy.get('[data-testid="password-input"]').type('wrongpassword')
      cy.get('[data-testid="login-button"]').click()
      
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials')
      cy.url().should('include', '/login')
    })

    it('Test 103: Should allow access with valid nurse credentials', () => {
      cy.loginAsNurse()
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]').should('be.visible')
      cy.get('h1').should('contain.text', 'Health Records Management')
    })

    it('Test 104: Should maintain session across page refreshes', () => {
      cy.loginAsNurse()
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]').should('be.visible')
      
      cy.reload()
      cy.get('[data-testid="health-records-page"]').should('be.visible')
      cy.url().should('not.include', '/login')
    })

    it('Test 105: Should handle session expiration gracefully', () => {
      cy.loginAsNurse()
      cy.visit('/health-records')
      
      // Simulate session expiration by clearing tokens
      cy.window().then((win) => {
        win.localStorage.removeItem('authToken')
        win.localStorage.removeItem('refreshToken')
      })
      
      cy.get('[data-testid="tab-records"]').click()
      cy.get('[data-testid="session-expired-modal"]').should('be.visible')
      cy.get('[data-testid="login-again-button"]').click()
      cy.url().should('include', '/login')
    })
  })

  describe('Role-Based Access Control (Tests 106-110)', () => {
    it('Test 106: Should allow full access for admin role', () => {
      cy.loginAsAdmin()
      cy.visit('/health-records')
      
      cy.get('[data-testid="new-record-button"]').should('be.visible')
      cy.get('[data-testid="import-button"]').should('be.visible')
      cy.get('[data-testid="export-button"]').should('be.visible')
      cy.get('[data-testid="admin-settings-button"]').should('be.visible')
      
      // Should access all tabs
      cy.get('[data-testid="tab-records"]').should('be.visible')
      cy.get('[data-testid="tab-allergies"]').should('be.visible')
      cy.get('[data-testid="tab-chronic"]').should('be.visible')
      cy.get('[data-testid="tab-vaccinations"]').should('be.visible')
    })

    it('Test 107: Should restrict access for read-only users', () => {
      cy.loginAsReadOnly()
      cy.visit('/health-records')
      
      cy.get('[data-testid="new-record-button"]').should('not.exist')
      cy.get('[data-testid="import-button"]').should('not.exist')
      cy.get('[data-testid="admin-settings-button"]').should('not.exist')
      
      // Should have read-only access
      cy.get('[data-testid="tab-records"]').click()
      cy.get('[data-testid="edit-record-button"]').should('not.exist')
      cy.get('[data-testid="delete-record-button"]').should('not.exist')
    })

    it('Test 108: Should allow appropriate access for school administrator', () => {
      cy.loginAsAdmin()
      cy.visit('/health-records')
      
      cy.get('[data-testid="export-button"]').should('be.visible')
      cy.get('[data-testid="reports-button"]').should('be.visible')
      
      // Should not allow direct record editing without specific permissions
      cy.get('[data-testid="tab-records"]').click()
      
      // But should access analytics
      cy.get('[data-testid="tab-analytics"]').should('be.visible')
    })

    it('Test 109: Should prevent unauthorized API access', () => {
      cy.loginAsReadOnly()
      cy.visit('/health-records')
      
      // Attempt to access admin endpoints should fail
      cy.request({
        method: 'POST',
        url: '/api/health-records/bulk-delete',
        failOnStatusCode: false,
        body: { recordIds: ['1', '2', '3'] }
      }).then((response) => {
        expect(response.status).to.eq(403)
        expect(response.body).to.have.property('error', 'Insufficient permissions')
      })
      
      cy.request({
        method: 'GET',
        url: '/api/health-records/admin/settings',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403)
      })
    })

    it('Test 110: Should validate permissions on page actions', () => {
      cy.loginAsReadOnly()
      cy.visit('/health-records')
      
      cy.get('[data-testid="tab-allergies"]').click()
      cy.get('[data-testid="add-allergy-button"]').should('be.disabled')
      
      // Try to click anyway and verify error handling
      cy.get('[data-testid="add-allergy-button"]').click({ force: true })
      cy.waitForToast('You do not have permission to add allergies')
      
      // Verify modal doesn't open
      cy.get('[data-testid="add-allergy-modal"]').should('not.exist')
    })
  })
})

describe('Health Records - Student Data Privacy and Access (Tests 111-120)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Mock authentication API calls using actual backend structure  
    cy.intercept('POST', 'http://localhost:3001/api/auth/login', (req) => {
      const { email, password } = req.body
      
      if (email === 'nurse@school.edu' && password === 'NursePassword123!') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJudXJzZUBzY2hvb2wuZWR1Iiwicm9sZSI6Ik5VUlNFIiwiaWF0IjoxNjk3MDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.mock',
              user: {
                id: '1',
                email: 'nurse@school.edu',
                firstName: 'Sarah',
                lastName: 'Johnson',
                role: 'NURSE'
              }
            }
          }
        })
      } else if (email === 'admin@school.edu' && password === 'AdminPassword123!') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyIiwiZW1haWwiOiJhZG1pbkBzY2hvb2wuZWR1Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjk3MDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.mock',
              user: {
                id: '2',
                email: 'admin@school.edu',
                firstName: 'John',
                lastName: 'Admin',
                role: 'ADMIN'
              }
            }
          }
        })
      } else if (email === 'readonly@school.edu' && password === 'ReadOnlyPassword123!') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzIiwiZW1haWwiOiJyZWFkb25seUBzY2hvb2wuZWR1Iiwicm9sZSI6IlJFQURfT05MWSIsImlhdCI6MTY5NzAwMDAwMCwiZXhwIjo5OTk5OTk5OTk5fQ.mock',
              user: {
                id: '3',
                email: 'readonly@school.edu',
                firstName: 'View',
                lastName: 'Only',
                role: 'READ_ONLY'
              }
            }
          }
        })
      } else if (email === 'counselor@school.edu' && password === 'CounselorPassword123!') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0IiwiZW1haWwiOiJjb3Vuc2Vsb3JAc2Nob29sLmVkdSIsInJvbGUiOiJDT1VOU0VMT1IiLCJpYXQiOjE2OTcwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.mock',
              user: {
                id: '4',
                email: 'counselor@school.edu',
                firstName: 'Mary',
                lastName: 'Counselor',
                role: 'COUNSELOR'
              }
            }
          }
        })
      } else {
        req.reply({
          statusCode: 401,
          body: {
            success: false,
            error: { message: 'Invalid credentials' }
          }
        })
      }
    }).as('loginRequest')
    
    // Mock token verification using actual backend endpoint
    cy.intercept('GET', 'http://localhost:3001/api/auth/verify', (req) => {
      const authHeader = req.headers.authorization
      const token = Array.isArray(authHeader) ? authHeader[0]?.replace('Bearer ', '') : authHeader?.replace('Bearer ', '')
      
      if (token && token.includes('nurse')) {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              id: '1',
              email: 'nurse@school.edu',
              firstName: 'Sarah',
              lastName: 'Johnson',
              role: 'NURSE',
              isActive: true
            }
          }
        })
      } else if (token && token.includes('admin')) {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              id: '2',
              email: 'admin@school.edu',
              firstName: 'John',
              lastName: 'Admin',
              role: 'ADMIN',
              isActive: true
            }
          }
        })
      } else if (token && token.includes('readonly')) {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              id: '3',
              email: 'readonly@school.edu',
              firstName: 'View',
              lastName: 'Only',
              role: 'READ_ONLY',
              isActive: true
            }
          }
        })
      } else if (token && token.includes('counselor')) {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              id: '4',
              email: 'counselor@school.edu',
              firstName: 'Mary',
              lastName: 'Counselor',
              role: 'COUNSELOR',
              isActive: true
            }
          }
        })
      } else {
        req.reply({
          statusCode: 401,
          body: {
            success: false,
            error: { message: 'Invalid or expired token' }
          }
        })
      }
    }).as('verifyToken')
    
    // Mock health records API endpoints using actual backend structure
    cy.intercept('GET', 'http://localhost:3001/api/health-records/**', { 
      statusCode: 200, 
      body: { success: true, data: {} } 
    }).as('healthRecordsAPI')
    
    // Mock students API endpoints
    cy.intercept('GET', 'http://localhost:3001/api/students/assigned', { 
      fixture: 'assignedStudents.json'
    }).as('getAssignedStudents')
    
    cy.intercept('GET', 'http://localhost:3001/api/students/**', { 
      statusCode: 200, 
      body: { success: true, data: { students: [] } } 
    }).as('studentsAPI')
    
    // Mock audit endpoints
    cy.intercept('POST', '**/audit/access-log', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          success: true,
          data: {
            logged: true,
            action: req.body.action,
            studentId: req.body.studentId,
            resourceType: req.body.resourceType || 'HEALTH_RECORD'
          }
        }
      })
    }).as('logAccess')
    
    cy.intercept('POST', '**/audit/security-log', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          success: true,
          data: {
            logged: true,
            event: req.body.event,
            resourceType: req.body.resourceType,
            securityLevel: req.body.securityLevel || 'MEDIUM'
          }
        }
      })
    }).as('logSecurityEvent')
    
    cy.loginAsNurse()
  })

  describe('Student Record Access Control (Tests 111-115)', () => {
    it('Test 111: Should display only assigned students for regular nurse', () => {
      cy.intercept('GET', '**/api/students/assigned', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              { id: '1', name: 'Emma Wilson' },
              { id: '2', name: 'John Smith' },
              { id: '3', name: 'Sarah Johnson' },
              { id: '4', name: 'Michael Brown' },
              { id: '5', name: 'Lisa Davis' }
            ]
          }
        }
      }).as('getAssignedStudents')
      cy.visit('/health-records')
      
      cy.wait('@getAssignedStudents')
      cy.get('[data-testid="student-selector"]').click()
      cy.get('[data-testid="student-option"]').should('have.length', 5) // Based on fixture
      
      // Verify no unauthorized students appear
      cy.get('[data-testid="student-option"]').each(($option) => {
        cy.wrap($option).should('not.contain', 'Restricted Student')
      })
    })

    it('Test 112: Should prevent access to restricted student records', () => {
      cy.visit('/health-records/student/restricted-123')
      cy.get('[data-testid="access-denied-page"]').should('be.visible')
      cy.get('[data-testid="error-message"]').should('contain', 'You do not have permission to view this student\'s records')
      cy.get('[data-testid="back-button"]').should('be.visible')
    })

    it('Test 113: Should log access attempts to student records', () => {
      const studentId = 'student-123'
      cy.intercept('POST', '**/api/audit/access-log', { statusCode: 201 }).as('logAccess')
      
      cy.visit(`/health-records/student/${studentId}`)
      cy.wait('@logAccess').then((interception) => {
        expect(interception.request.body).to.deep.include({
          action: 'VIEW_STUDENT_RECORD',
          studentId: studentId,
          resourceType: 'HEALTH_RECORD'
        })
      })
    })

    it('Test 114: Should require additional confirmation for sensitive records', () => {
      cy.intercept('GET', '**/api/students/sensitive-456/health-records', { fixture: 'sensitiveHealthRecord.json' }).as('getSensitiveRecord')
      
      cy.visit('/health-records/student/sensitive-456')
      cy.get('[data-testid="sensitive-record-warning"]').should('be.visible')
      cy.get('[data-testid="confirm-access-button"]').should('be.visible')
      cy.get('[data-testid="cancel-access-button"]').should('be.visible')
      
      cy.get('[data-testid="confirm-access-button"]').click()
      cy.wait('@getSensitiveRecord')
      cy.get('[data-testid="health-record-content"]').should('be.visible')
    })

    it('Test 115: Should display data access restrictions notice', () => {
      cy.visit('/health-records')
      cy.get('[data-testid="privacy-notice"]').should('be.visible')
      cy.get('[data-testid="privacy-notice"]').should('contain', 'This system contains protected health information')
      cy.get('[data-testid="hipaa-compliance-badge"]').should('be.visible')
      cy.get('[data-testid="data-use-agreement"]').should('be.visible')
    })
  })

  describe('Data Masking and Redaction (Tests 116-120)', () => {
    it('Test 116: Should mask sensitive data for users without full access', () => {
      cy.login('readonly@school.edu', 'ReadOnlyPassword123!')
      cy.visit('/health-records')
      
      cy.get('[data-testid="tab-records"]').click()
      cy.get('[data-testid="health-record-item"]').first().within(() => {
        cy.get('[data-testid="ssn-field"]').should('contain', '***-**-****')
        cy.get('[data-testid="insurance-id"]').should('contain', '****')
        cy.get('[data-testid="diagnosis-details"]').should('contain', '[RESTRICTED]')
      })
    })

    it('Test 117: Should show full data for authorized users', () => {
      cy.loginAsAdmin()
      cy.visit('/health-records')
      
      cy.get('[data-testid="tab-records"]').click()
      cy.get('[data-testid="health-record-item"]').first().within(() => {
        cy.get('[data-testid="ssn-field"]').should('not.contain', '***')
        cy.get('[data-testid="insurance-id"]').should('not.contain', '****')
        cy.get('[data-testid="diagnosis-details"]').should('not.contain', '[RESTRICTED]')
      })
    })

    it('Test 118: Should redact mental health information appropriately', () => {
      cy.loginAsNurse() // Regular nurse without mental health access
      cy.visit('/health-records')
      
      cy.get('[data-testid="tab-records"]').click()
      cy.get('[data-testid="health-record-item"]').each(($item) => {
        cy.wrap($item).find('[data-testid="record-type"]').then(($type) => {
          if ($type.text().includes('Mental Health')) {
            cy.wrap($item).find('[data-testid="record-content"]').should('contain', '[MENTAL HEALTH - RESTRICTED ACCESS]')
          }
        })
      })
    })

    it('Test 119: Should apply field-level security based on user role', () => {
      cy.login('counselor@school.edu', 'CounselorPassword123!')
      cy.visit('/health-records')
      
      cy.get('[data-testid="tab-allergies"]').click()
      cy.get('[data-testid="allergy-item"]').first().within(() => {
        // Can see allergy info
        cy.get('[data-testid="allergen-name"]').should('be.visible')
        cy.get('[data-testid="severity-badge"]').should('be.visible')
        
        // But not medical details
        cy.get('[data-testid="treatment-details"]').should('contain', '[MEDICAL INFO RESTRICTED]')
        cy.get('[data-testid="provider-name"]').should('not.be.visible')
      })
    })

    it('Test 120: Should log attempts to access restricted data', () => {
      cy.intercept('POST', '**/api/audit/security-log', { statusCode: 201 }).as('logSecurityEvent')
      
      cy.login('readonly@school.edu', 'ReadOnlyPassword123!')
      cy.visit('/health-records')
      
      // Try to access restricted endpoint directly
      cy.window().then((win) => {
        fetch('/api/students/123/mental-health-records', {
          headers: { 'Authorization': `Bearer ${win.localStorage.getItem('authToken')}` }
        }).catch(() => {})
      })
      
      cy.wait('@logSecurityEvent').then((interception) => {
        expect(interception.request.body).to.deep.include({
          event: 'UNAUTHORIZED_ACCESS_ATTEMPT',
          resourceType: 'MENTAL_HEALTH_RECORD',
          securityLevel: 'HIGH'
        })
      })
    })
  })
})
