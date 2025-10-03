// Custom commands for White Cross healthcare platform testing

// Authentication commands
Cypress.Commands.add('login', (email?: string, password?: string) => {
  const testEmail = email || Cypress.env('TEST_USER_EMAIL') || 'test.nurse@school.edu'
  const testPassword = password || Cypress.env('TEST_USER_PASSWORD') || 'TestPassword123!'

  cy.session([testEmail, testPassword], () => {
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type(testEmail)
    cy.get('[data-testid="password-input"]').type(testPassword)
    cy.get('[data-testid="login-button"]').click()
    cy.url().should('not.include', '/login')
    cy.get('[data-testid="user-menu"]').should('be.visible')
  })
})

Cypress.Commands.add('loginAsNurse', () => {
  cy.login('nurse@school.edu', 'NursePassword123!')
})

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('admin@school.edu', 'AdminPassword123!')
})

// Student-specific commands
Cypress.Commands.add('waitForStudentTable', () => {
  cy.get('[data-testid="student-table"]').should('be.visible')
  cy.get('[data-testid="loading-spinner"]').should('not.exist')
})

Cypress.Commands.add('interceptStudentAPI', () => {
  // Mock successful responses for all student-related API calls
  cy.intercept('GET', '**/api/students*', { 
    statusCode: 200,
    body: {
      success: true,
      data: {
        students: [
          {
            id: '1',
            studentNumber: 'STU001',
            firstName: 'Emma',
            lastName: 'Wilson',
            dateOfBirth: '2010-03-15',
            grade: '8',
            gender: 'FEMALE',
            isActive: true,
            emergencyContacts: [
              {
                id: '1',
                firstName: 'Jennifer',
                lastName: 'Wilson',
                relationship: 'Mother',
                phoneNumber: '(555) 123-4567',
                isPrimary: true
              }
            ],
            allergies: [
              {
                id: '1',
                allergen: 'Peanuts',
                severity: 'LIFE_THREATENING'
              }
            ],
            medications: [
              { id: '1', name: 'EpiPen', dosage: '0.3mg' }
            ]
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1
        }
      }
    }
  }).as('getStudents')
  
  cy.intercept('POST', '**/api/students', { 
    statusCode: 201,
    body: {
      success: true,
      data: {
        student: {
          id: '2',
          studentNumber: 'ST2025001',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '2010-05-15',
          grade: '5',
          gender: 'MALE',
          isActive: true,
          emergencyContacts: [],
          allergies: [],
          medications: []
        }
      }
    }
  }).as('createStudent')
  
  cy.intercept('PUT', '**/api/students/*', { 
    statusCode: 200,
    body: {
      success: true,
      data: {
        student: {
          id: '1',
          studentNumber: 'STU001',
          firstName: 'Jane',
          lastName: 'Wilson',
          dateOfBirth: '2010-03-15',
          grade: '8',
          gender: 'FEMALE',
          isActive: true
        }
      }
    }
  }).as('updateStudent')
  
  cy.intercept('DELETE', '**/api/students/*', { 
    statusCode: 200,
    body: {
      success: true,
      message: 'Student deactivated successfully'
    }
  }).as('deleteStudent')
  
  cy.intercept('GET', '**/api/students/*/health-records', { fixture: 'healthRecords.json' }).as('getHealthRecords')
  cy.intercept('GET', '**/api/students/*/medications', { fixture: 'medications.json' }).as('getMedications')
})

Cypress.Commands.add('createTestStudent', (student?: Partial<Record<string, any>>) => {
  const defaultStudent = {
    firstName: 'Test',
    lastName: 'Student',
    dateOfBirth: '2010-01-01',
    grade: '8',
    studentId: 'TS001',
    email: 'test.student@school.edu',
    phone: '555-0123'
  }

  const testStudent = { ...defaultStudent, ...student }

  cy.visit('/students')
  cy.get('[data-testid="add-student-button"]').click()
  cy.get('[data-testid="student-form"]').should('be.visible')

  Object.entries(testStudent).forEach(([key, value]) => {
    if (value) {
      cy.get(`[data-testid="${key}-input"]`).clear().type(value.toString())
    }
  })

  cy.get('[data-testid="save-student-button"]').click()
  cy.get('[data-testid="success-message"]').should('be.visible')
})

Cypress.Commands.add('deleteTestStudent', (studentId: string) => {
  cy.visit('/students')
  cy.get(`[data-testid="student-row-${studentId}"]`).should('be.visible')
  cy.get(`[data-testid="student-actions-${studentId}"]`).click()
  cy.get(`[data-testid="delete-student-${studentId}"]`).click()
  cy.get('[data-testid="confirm-delete-button"]').click()
  cy.get('[data-testid="success-message"]').should('be.visible')
})

Cypress.Commands.add('seedStudentData', () => {
  // This would typically make API calls to seed test data
  cy.request('POST', `${Cypress.env('API_URL')}/api/test/seed-students`)
})

Cypress.Commands.add('cleanupTestData', () => {
  // Clean up any test data created during tests
  cy.request('DELETE', `${Cypress.env('API_URL')}/api/test/cleanup-students`)
})

// Utility commands for healthcare-specific interactions
Cypress.Commands.add('selectFromDropdown', (selector: string, value: string) => {
  cy.get(selector).click()
  cy.get(`[data-value="${value}"]`).click()
})

Cypress.Commands.add('uploadFile', (selector: string, fileName: string) => {
  cy.get(selector).selectFile(`cypress/fixtures/${fileName}`)
})

Cypress.Commands.add('waitForToast', (message?: string) => {
  if (message) {
    // Look for toast messages in react-hot-toast (they use different roles)
    cy.get('[role="status"], [role="alert"]').should('contain.text', message)
  } else {
    cy.get('[role="status"], [role="alert"]').should('be.visible')
  }
})

// Medication-specific commands
Cypress.Commands.add('interceptMedicationAPIDelayed', () => {
  // Mock delayed response for testing loading states
  cy.intercept('GET', '**/api/medications*', {
    statusCode: 200,
    delay: 2000, // 2 second delay
    body: {
      success: true,
      data: {
        medications: [
          {
            id: '1',
            name: 'Aspirin',
            genericName: 'acetylsalicylic acid',
            dosageForm: 'Tablet',
            strength: '325mg',
            manufacturer: 'Generic Pharma',
            isControlled: false,
            inventory: [
              { id: '1', quantity: 100, reorderLevel: 20, expirationDate: '2025-12-31' }
            ],
            _count: { studentMedications: 5 }
          }
        ],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 }
      }
    }
  }).as('getMedicationsDelayed')
})

Cypress.Commands.add('interceptMedicationAPI', () => {
  // Mock successful responses for all medication-related API calls
  cy.intercept('GET', '**/api/medications*', { 
    statusCode: 200,
    body: {
      success: true,
      data: {
        medications: [
          {
            id: '1',
            name: 'Aspirin',
            genericName: 'acetylsalicylic acid',
            dosageForm: 'Tablet',
            strength: '325mg',
            manufacturer: 'Generic Pharma',
            isControlled: false,
            inventory: [
              { id: '1', quantity: 100, reorderLevel: 20, expirationDate: '2025-12-31' }
            ],
            _count: { studentMedications: 5 }
          },
          {
            id: '2',
            name: 'Albuterol Inhaler',
            genericName: 'albuterol sulfate',
            dosageForm: 'Inhaler',
            strength: '90mcg',
            manufacturer: 'ProAir',
            isControlled: false,
            inventory: [
              { id: '2', quantity: 15, reorderLevel: 10, expirationDate: '2025-08-15' }
            ],
            _count: { studentMedications: 12 }
          },
          {
            id: '3',
            name: 'Methylphenidate',
            genericName: 'methylphenidate HCl',
            dosageForm: 'Tablet',
            strength: '10mg',
            manufacturer: 'Ritalin',
            isControlled: true,
            inventory: [
              { id: '3', quantity: 5, reorderLevel: 15, expirationDate: '2025-06-30' }
            ],
            _count: { studentMedications: 8 }
          },
          {
            id: '4',
            name: 'Tylenol',
            genericName: 'acetaminophen',
            dosageForm: 'Tablet',
            strength: '500mg',
            manufacturer: 'Johnson & Johnson',
            isControlled: false,
            inventory: [
              { id: '4', quantity: 200, reorderLevel: 25, expirationDate: '2025-11-30' }
            ],
            _count: { studentMedications: 15 }
          },
          {
            id: '5',
            name: 'Band-Aid Adhesive Bandages',
            genericName: 'adhesive bandages',
            dosageForm: 'Bandage',
            strength: 'Standard',
            manufacturer: 'Johnson & Johnson',
            isControlled: false,
            inventory: [
              { id: '5', quantity: 500, reorderLevel: 50, expirationDate: '2026-01-15' }
            ],
            _count: { studentMedications: 0 }
          }
        ],
        pagination: { page: 1, limit: 20, total: 3, pages: 1 }
      }
    }
  }).as('getMedications')
  
  cy.intercept('GET', '**/api/medications/inventory*', {
    statusCode: 200,
    body: {
      success: true,
      data: {
        inventory: [
          {
            id: '1',
            quantity: 100,
            reorderLevel: 20,
            expirationDate: '2025-12-31',
            batchNumber: 'BATCH001',
            supplier: 'MedSupply Co',
            medication: { name: 'Aspirin', strength: '325mg' },
            alerts: null
          },
          {
            id: '2',
            quantity: 5,
            reorderLevel: 15,
            expirationDate: '2025-02-15',
            batchNumber: 'BATCH002',
            supplier: 'PharmaCorp',
            medication: { name: 'Methylphenidate', strength: '10mg' },
            alerts: { lowStock: true, nearExpiry: true }
          }
        ],
        alerts: {
          expired: [],
          nearExpiry: [{ id: '2', medicationName: 'Methylphenidate' }],
          lowStock: [{ id: '2', medicationName: 'Methylphenidate' }]
        }
      }
    }
  }).as('getMedicationInventory')
  
  cy.intercept('GET', '**/api/medications/reminders*', {
    statusCode: 200,
    body: {
      success: true,
      data: {
        reminders: [
          {
            id: '1',
            studentName: 'Emma Wilson',
            medicationName: 'Albuterol Inhaler',
            dosage: '2 puffs',
            scheduledTime: new Date().toISOString(),
            status: 'PENDING'
          },
          {
            id: '2',
            studentName: 'John Smith',
            medicationName: 'Methylphenidate',
            dosage: '10mg',
            scheduledTime: new Date(Date.now() - 3600000).toISOString(),
            status: 'COMPLETED'
          }
        ]
      }
    }
  }).as('getMedicationReminders')
  
  cy.intercept('GET', '**/api/medications/adverse-reactions*', {
    statusCode: 200,
    body: {
      success: true,
      data: {
        reactions: [
          {
            id: '1',
            occurredAt: '2025-01-15',
            severity: 'MEDIUM',
            description: 'Mild nausea after taking medication',
            actionsTaken: 'Administered with food, symptoms resolved',
            student: { firstName: 'Emma', lastName: 'Wilson' },
            reportedBy: { firstName: 'Sarah', lastName: 'Johnson' }
          }
        ]
      }
    }
  }).as('getAdverseReactions')
  
  cy.intercept('POST', '**/api/medications', {
    statusCode: 201,
    body: {
      success: true,
      data: { medication: { id: '4', name: 'Test Medication' } }
    }
  }).as('createMedication')
  
  cy.intercept('POST', '**/api/medications/adverse-reaction', {
    statusCode: 201,
    body: {
      success: true,
      data: { reaction: { id: '2', severity: 'LOW' } }
    }
  }).as('reportAdverseReaction')
})

// Add type declarations to prevent TypeScript errors
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
      loginAsNurse(): Chainable<void>
      loginAsAdmin(): Chainable<void>
      waitForStudentTable(): Chainable<void>
      interceptStudentAPI(): Chainable<void>
      createTestStudent(student?: Partial<Record<string, any>>): Chainable<void>
      deleteTestStudent(studentId: string): Chainable<void>
      seedStudentData(): Chainable<void>
      cleanupTestData(): Chainable<void>
      interceptMedicationAPI(): Chainable<void>
      interceptMedicationAPIDelayed(): Chainable<void>
      selectFromDropdown(selector: string, value: string): Chainable<void>
      uploadFile(selector: string, fileName: string): Chainable<void>
      waitForToast(message?: string): Chainable<void>
    }
  }
}

export {}