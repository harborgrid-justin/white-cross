/// <reference types="cypress" />

describe('Health Records - Data Validation and Form Testing (Tests 121-130)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.loginAsNurse()
    cy.intercept('GET', '**/api/health-records/**', { fixture: 'healthRecords.json' }).as('getHealthRecords')
    cy.intercept('GET', '**/api/health-records/allergies/**', { fixture: 'allergies.json' }).as('getAllergies')
    cy.intercept('GET', '**/api/health-records/chronic-conditions/**', { fixture: 'chronicConditions.json' }).as('getChronicConditions')
    cy.visit('/health-records')
  })

  describe('Form Field Validation (Tests 121-125)', () => {
    it('Test 121: Should validate required fields in health record form', () => {
      cy.get('[data-testid="new-record-button"]').click()
      cy.get('[data-testid="health-record-modal"]').should('be.visible')
      
      // Try to submit empty form
      cy.get('[data-testid="save-record-button"]').click()
      
      // Verify required field errors
      cy.get('[data-testid="record-type-error"]').should('contain', 'Record type is required')
      cy.get('[data-testid="date-error"]').should('contain', 'Date is required')
      cy.get('[data-testid="provider-error"]').should('contain', 'Healthcare provider is required')
      cy.get('[data-testid="description-error"]').should('contain', 'Description is required')
    })

    it('Test 122: Should validate date format and constraints', () => {
      cy.get('[data-testid="new-record-button"]').click()
      cy.get('[data-testid="health-record-modal"]').should('be.visible')
      
      // Test invalid date formats
      cy.get('[data-testid="date-input"]').type('invalid-date')
      cy.get('[data-testid="save-record-button"]').click()
      cy.get('[data-testid="date-error"]').should('contain', 'Please enter a valid date')
      
      // Test future date
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)
      const futureDateString = futureDate.toISOString().split('T')[0]
      
      cy.get('[data-testid="date-input"]').clear().type(futureDateString)
      cy.get('[data-testid="save-record-button"]').click()
      cy.get('[data-testid="date-error"]').should('contain', 'Date cannot be in the future')
      
      // Test very old date
      cy.get('[data-testid="date-input"]').clear().type('1900-01-01')
      cy.get('[data-testid="save-record-button"]').click()
      cy.get('[data-testid="date-error"]').should('contain', 'Date cannot be more than 100 years ago')
    })

    it('Test 123: Should validate text field lengths and content', () => {
      cy.get('[data-testid="new-record-button"]').click()
      cy.get('[data-testid="health-record-modal"]').should('be.visible')
      
      // Test minimum length for provider name
      cy.get('[data-testid="provider-input"]').type('Dr')
      cy.get('[data-testid="save-record-button"]').click()
      cy.get('[data-testid="provider-error"]').should('contain', 'Provider name must be at least 3 characters')
      
      // Test maximum length for description
      const longDescription = 'A'.repeat(2001) // Assuming 2000 char limit
      cy.get('[data-testid="description-textarea"]').type(longDescription)
      cy.get('[data-testid="description-error"]').should('contain', 'Description cannot exceed 2000 characters')
      
      // Test special characters validation
      cy.get('[data-testid="provider-input"]').clear().type('Dr. <script>alert("test")</script>')
      cy.get('[data-testid="save-record-button"]').click()
      cy.get('[data-testid="provider-error"]').should('contain', 'Provider name contains invalid characters')
    })

    it('Test 124: Should validate email and phone number formats', () => {
      cy.get('[data-testid="tab-records"]').click()
      cy.get('[data-testid="health-record-item"]').first().click()
      cy.get('[data-testid="edit-record-button"]').click()
      cy.get('[data-testid="health-record-form"]').should('be.visible')
      
      // Test invalid email format
      cy.get('[data-testid="provider-email-input"]').clear().type('invalid-email')
      cy.get('[data-testid="save-record-button"]').click()
      cy.get('[data-testid="provider-email-error"]').should('contain', 'Please enter a valid email address')
      
      // Test invalid phone format
      cy.get('[data-testid="provider-phone-input"]').clear().type('123-invalid')
      cy.get('[data-testid="save-record-button"]').click()
      cy.get('[data-testid="provider-phone-error"]').should('contain', 'Please enter a valid phone number')
      
      // Test valid formats
      cy.get('[data-testid="provider-email-input"]').clear().type('provider@clinic.com')
      cy.get('[data-testid="provider-phone-input"]').clear().type('(555) 123-4567')
      cy.get('[data-testid="provider-email-error"]').should('not.exist')
      cy.get('[data-testid="provider-phone-error"]').should('not.exist')
    })

    it('Test 125: Should validate numeric fields and ranges', () => {
      cy.get('[data-testid="tab-growth"]').click()
      cy.get('[data-testid="add-measurement-btn"]').click()
      cy.get('[data-testid="measurement-modal"]').should('be.visible')
      
      // Test invalid height values
      cy.get('[data-testid="height-input"]').type('-10')
      cy.get('[data-testid="save-measurement-btn"]').click()
      cy.get('[data-testid="height-error"]').should('contain', 'Height must be positive')
      
      cy.get('[data-testid="height-input"]').clear().type('200')
      cy.get('[data-testid="save-measurement-btn"]').click()
      cy.get('[data-testid="height-error"]').should('contain', 'Height must be between 10 and 84 inches')
      
      // Test invalid weight values
      cy.get('[data-testid="weight-input"]').type('abc')
      cy.get('[data-testid="save-measurement-btn"]').click()
      cy.get('[data-testid="weight-error"]').should('contain', 'Weight must be a valid number')
      
      cy.get('[data-testid="weight-input"]').clear().type('500')
      cy.get('[data-testid="save-measurement-btn"]').click()
      cy.get('[data-testid="weight-error"]').should('contain', 'Weight must be between 5 and 300 pounds')
    })
  })

  describe('Data Integrity and Business Logic Validation (Tests 126-130)', () => {
    it('Test 126: Should prevent duplicate allergy entries', () => {
      cy.get('[data-testid="tab-allergies"]').click()
      cy.wait('@getAllergies')
      
      cy.get('[data-testid="add-allergy-button"]').click()
      cy.get('[data-testid="add-allergy-modal"]').should('be.visible')
      
      // Try to add an allergy that already exists
      cy.get('[data-testid="allergen-input"]').type('Peanuts') // Assuming this exists in fixture
      cy.get('[data-testid="severity-select"]').select('SEVERE')
      cy.get('[data-testid="reaction-input"]').type('Hives')
      cy.get('[data-testid="save-allergy-button"]').click()
      
      cy.get('[data-testid="allergen-error"]').should('contain', 'This allergy already exists for this student')
      cy.get('[data-testid="add-allergy-modal"]').should('be.visible') // Modal should stay open
    })

    it('Test 127: Should validate medication dosage and frequency', () => {
      cy.intercept('GET', '**/api/medications/**', { fixture: 'medications.json' }).as('getMedications')
      cy.get('[data-testid="tab-medications"]').click()
      cy.wait('@getMedications')
      
      cy.get('[data-testid="add-medication-button"]').click()
      cy.get('[data-testid="medication-modal"]').should('be.visible')
      
      // Test invalid dosage format
      cy.get('[data-testid="medication-select"]').select('Tylenol')
      cy.get('[data-testid="dosage-input"]').type('invalid dosage')
      cy.get('[data-testid="frequency-select"]').select('Twice daily')
      cy.get('[data-testid="save-medication-button"]').click()
      
      cy.get('[data-testid="dosage-error"]').should('contain', 'Please enter a valid dosage (e.g., "10mg", "2 tablets")')
      
      // Test conflicting medications
      cy.get('[data-testid="dosage-input"]').clear().type('500mg')
      cy.get('[data-testid="medication-select"]').select('Aspirin') // Assuming conflict with Tylenol
      cy.get('[data-testid="save-medication-button"]').click()
      
      cy.get('[data-testid="medication-conflict-warning"]').should('be.visible')
      cy.get('[data-testid="conflict-message"]').should('contain', 'Potential drug interaction detected')
    })

    it('Test 128: Should validate vaccination schedule and intervals', () => {
      cy.get('[data-testid="tab-vaccinations"]').click()
      cy.get('[data-testid="record-vaccination-button"]').click()
      cy.get('[data-testid="vaccination-modal"]').should('be.visible')
      
      // Test vaccination too early (before minimum interval)
      cy.get('[data-testid="vaccination-name-select"]').select('MMR')
      cy.get('[data-testid="vaccination-date-input"]').type('2024-01-15')
      cy.get('[data-testid="dose-number-input"]').type('2')
      cy.get('[data-testid="save-vaccination-button"]').click()
      
      cy.get('[data-testid="vaccination-interval-error"]').should('contain', 'Second dose cannot be given less than 28 days after first dose')
      
      // Test invalid lot number format
      cy.get('[data-testid="lot-number-input"]').type('123') // Too short
      cy.get('[data-testid="save-vaccination-button"]').click()
      cy.get('[data-testid="lot-number-error"]').should('contain', 'Lot number must be at least 6 characters')
    })

    it('Test 129: Should validate chronic condition dependencies', () => {
      cy.get('[data-testid="tab-chronic"]').click()
      cy.wait('@getChronicConditions')
      
      cy.get('[data-testid="add-condition-button"]').click()
      cy.get('[data-testid="add-condition-modal"]').should('be.visible')
      
      // Test condition that requires specific allergies
      cy.get('[data-testid="condition-select"]').select('Diabetes Type 1')
      cy.get('[data-testid="diagnosed-date-input"]').type('2024-01-15')
      cy.get('[data-testid="status-select"]').select('ACTIVE')
      cy.get('[data-testid="save-condition-button"]').click()
      
      // Should trigger allergy check
      cy.get('[data-testid="allergy-requirement-modal"]').should('be.visible')
      cy.get('[data-testid="allergy-requirement-message"]').should('contain', 'Students with diabetes should have insulin allergy status documented')
      
      // Test age restrictions for certain conditions
      cy.get('[data-testid="cancel-allergy-check"]').click()
      cy.get('[data-testid="condition-select"]').select('Osteoporosis')
      cy.get('[data-testid="save-condition-button"]').click()
      
      cy.get('[data-testid="age-restriction-error"]').should('contain', 'This condition is unusual for students under 18')
    })

    it('Test 130: Should validate cross-tab data consistency', () => {
      // Test that allergy severity matches with medication restrictions
      cy.get('[data-testid="tab-allergies"]').click()
      cy.get('[data-testid="add-allergy-button"]').click()
      cy.get('[data-testid="add-allergy-modal"]').should('be.visible')
      
      cy.get('[data-testid="allergen-input"]').type('Aspirin')
      cy.get('[data-testid="severity-select"]').select('LIFE_THREATENING')
      cy.get('[data-testid="reaction-input"]').type('Anaphylaxis')
      cy.get('[data-testid="save-allergy-button"]').click()
      
      cy.intercept('POST', '**/api/health-records/allergies', {
        statusCode: 201,
        body: { success: true, data: { allergy: { id: 'new-1', allergen: 'Aspirin' } }}
      }).as('createAllergy')
      
      cy.wait('@createAllergy')
      cy.waitForToast('Allergy added successfully')
      
      // Now try to add aspirin medication - should warn
      cy.get('[data-testid="tab-medications"]').click()
      cy.get('[data-testid="add-medication-button"]').click()
      cy.get('[data-testid="medication-modal"]').should('be.visible')
      
      cy.get('[data-testid="medication-select"]').select('Aspirin')
      cy.get('[data-testid="dosage-input"]').type('325mg')
      cy.get('[data-testid="save-medication-button"]').click()
      
      cy.get('[data-testid="allergy-warning-modal"]').should('be.visible')
      cy.get('[data-testid="allergy-warning-message"]').should('contain', 'CRITICAL: Student has a life-threatening allergy to this medication')
      cy.get('[data-testid="confirm-override-button"]').should('be.visible')
      cy.get('[data-testid="cancel-medication-button"]').should('be.visible')
    })
  })
})

describe('Health Records - Error Handling and Edge Cases (Tests 131-140)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.loginAsNurse()
    cy.visit('/health-records')
  })

  describe('API Error Handling (Tests 131-135)', () => {
    it('Test 131: Should handle server errors gracefully', () => {
      cy.intercept('GET', '**/api/health-records/**', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('getHealthRecordsError')
      
      cy.reload()
      cy.wait('@getHealthRecordsError')
      
      cy.get('[data-testid="error-message"]').should('be.visible')
      cy.get('[data-testid="error-message"]').should('contain', 'Unable to load health records')
      cy.get('[data-testid="retry-button"]').should('be.visible')
      
      // Test retry functionality
      cy.intercept('GET', '**/api/health-records/**', { fixture: 'healthRecords.json' }).as('getHealthRecordsRetry')
      cy.get('[data-testid="retry-button"]').click()
      cy.wait('@getHealthRecordsRetry')
      cy.get('[data-testid="health-records-content"]').should('be.visible')
    })

    it('Test 132: Should handle network timeout errors', () => {
      cy.intercept('POST', '**/api/health-records', { delay: 30000 }).as('createRecordTimeout')
      
      cy.get('[data-testid="new-record-button"]').click()
      cy.get('[data-testid="health-record-modal"]').should('be.visible')
      
      // Fill form with valid data
      cy.get('[data-testid="record-type-select"]').select('Physical Exam')
      cy.get('[data-testid="date-input"]').type('2024-01-15')
      cy.get('[data-testid="provider-input"]').type('Dr. Smith')
      cy.get('[data-testid="description-textarea"]').type('Annual physical examination')
      
      cy.get('[data-testid="save-record-button"]').click()
      
      // Should show loading state
      cy.get('[data-testid="save-record-button"]').should('be.disabled')
      cy.get('[data-testid="loading-spinner"]').should('be.visible')
      
      // After timeout, should show error
      cy.get('[data-testid="timeout-error"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-testid="timeout-error"]').should('contain', 'Request timed out')
      cy.get('[data-testid="try-again-button"]').should('be.visible')
    })

    it('Test 133: Should handle validation errors from server', () => {
      cy.intercept('POST', '**/api/health-records', {
        statusCode: 400,
        body: {
          error: 'Validation failed',
          details: {
            'provider': 'Provider must be licensed',
            'date': 'Date conflicts with existing record'
          }
        }
      }).as('createRecordValidationError')
      
      cy.get('[data-testid="new-record-button"]').click()
      cy.get('[data-testid="health-record-modal"]').should('be.visible')
      
      // Fill form
      cy.get('[data-testid="record-type-select"]').select('Physical Exam')
      cy.get('[data-testid="date-input"]').type('2024-01-15')
      cy.get('[data-testid="provider-input"]').type('Unlicensed Provider')
      cy.get('[data-testid="description-textarea"]').type('Test record')
      
      cy.get('[data-testid="save-record-button"]').click()
      cy.wait('@createRecordValidationError')
      
      // Should display server validation errors
      cy.get('[data-testid="provider-error"]').should('contain', 'Provider must be licensed')
      cy.get('[data-testid="date-error"]').should('contain', 'Date conflicts with existing record')
      cy.get('[data-testid="health-record-modal"]').should('be.visible') // Modal stays open
    })

    it('Test 134: Should handle unauthorized access errors', () => {
      // Simulate token expiration during operation
      cy.intercept('POST', '**/api/health-records/allergies', {
        statusCode: 401,
        body: { error: 'Unauthorized' }
      }).as('createAllergyUnauthorized')
      
      cy.get('[data-testid="tab-allergies"]').click()
      cy.get('[data-testid="add-allergy-button"]').click()
      cy.get('[data-testid="add-allergy-modal"]').should('be.visible')
      
      cy.get('[data-testid="allergen-input"]').type('Shellfish')
      cy.get('[data-testid="severity-select"]').select('SEVERE')
      cy.get('[data-testid="reaction-input"]').type('Swelling')
      cy.get('[data-testid="save-allergy-button"]').click()
      
      cy.wait('@createAllergyUnauthorized')
      
      // Should show session expired modal
      cy.get('[data-testid="session-expired-modal"]').should('be.visible')
      cy.get('[data-testid="login-again-button"]').should('be.visible')
      cy.get('[data-testid="session-expired-message"]').should('contain', 'Your session has expired')
    })

    it('Test 135: Should handle rate limiting errors', () => {
      cy.intercept('POST', '**/api/health-records/**', {
        statusCode: 429,
        body: { error: 'Too many requests', retryAfter: 60 }
      }).as('rateLimitError')
      
      cy.get('[data-testid="new-record-button"]').click()
      cy.get('[data-testid="health-record-modal"]').should('be.visible')
      
      // Fill and submit form
      cy.get('[data-testid="record-type-select"]').select('Physical Exam')
      cy.get('[data-testid="date-input"]').type('2024-01-15')
      cy.get('[data-testid="provider-input"]').type('Dr. Smith')
      cy.get('[data-testid="description-textarea"]').type('Test record')
      cy.get('[data-testid="save-record-button"]').click()
      
      cy.wait('@rateLimitError')
      
      cy.get('[data-testid="rate-limit-error"]').should('be.visible')
      cy.get('[data-testid="rate-limit-message"]').should('contain', 'Too many requests')
      cy.get('[data-testid="retry-countdown"]').should('be.visible')
    })
  })

  describe('Data Integrity Edge Cases (Tests 136-140)', () => {
    it('Test 136: Should handle concurrent data modifications', () => {
      // Simulate another user modifying the same record
      cy.intercept('PUT', '**/api/health-records/allergies/1', {
        statusCode: 409,
        body: {
          error: 'Conflict',
          message: 'Record was modified by another user',
          currentVersion: { allergen: 'Modified Peanuts', severity: 'MODERATE' }
        }
      }).as('conflictError')
      
      cy.get('[data-testid="tab-allergies"]').click()
      cy.get('[data-testid="allergy-item"]').first().within(() => {
        cy.get('[data-testid="edit-allergy-button"]').click()
      })
      
      cy.get('[data-testid="edit-allergy-modal"]').should('be.visible')
      cy.get('[data-testid="severity-select"]').select('SEVERE')
      cy.get('[data-testid="save-allergy-button"]').click()
      
      cy.wait('@conflictError')
      
      cy.get('[data-testid="conflict-modal"]').should('be.visible')
      cy.get('[data-testid="conflict-message"]').should('contain', 'Record was modified by another user')
      cy.get('[data-testid="current-version"]').should('contain', 'Modified Peanuts')
      cy.get('[data-testid="merge-changes-button"]').should('be.visible')
      cy.get('[data-testid="overwrite-button"]').should('be.visible')
      cy.get('[data-testid="cancel-edit-button"]').should('be.visible')
    })

    it('Test 137: Should handle orphaned data references', () => {
      // Test when referenced student or provider no longer exists
      cy.intercept('GET', '**/api/health-records/**', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: [{
              id: '1',
              type: 'Physical Exam',
              date: '2024-01-15',
              providerId: 'deleted-provider-123',
              studentId: 'deleted-student-456',
              description: 'Test record'
            }]
          }
        }
      }).as('getOrphanedRecords')
      
      cy.reload()
      cy.get('[data-testid="tab-records"]').click()
      cy.wait('@getOrphanedRecords')
      
      cy.get('[data-testid="health-record-item"]').first().within(() => {
        cy.get('[data-testid="provider-name"]').should('contain', '[Provider Not Found]')
        cy.get('[data-testid="orphaned-record-warning"]').should('be.visible')
        cy.get('[data-testid="cleanup-button"]').should('be.visible')
      })
    })

    it('Test 138: Should handle special characters and unicode', () => {
      cy.get('[data-testid="new-record-button"]').click()
      cy.get('[data-testid="health-record-modal"]').should('be.visible')
      
      // Test unicode characters
      const unicodeText = 'Test with émojis 🏥👩‍⚕️ and special chars: ñáéíóú'
      cy.get('[data-testid="description-textarea"]').type(unicodeText)
      
      // Fill other required fields
      cy.get('[data-testid="record-type-select"]').select('Physical Exam')
      cy.get('[data-testid="date-input"]').type('2024-01-15')
      cy.get('[data-testid="provider-input"]').type('Dr. María Rodríguez')
      
      cy.intercept('POST', '**/api/health-records', {
        statusCode: 201,
        body: { success: true, data: { record: { id: '123', description: unicodeText } }}
      }).as('createUnicodeRecord')
      
      cy.get('[data-testid="save-record-button"]').click()
      cy.wait('@createUnicodeRecord')
      
      // Verify unicode is preserved
      cy.get('@createUnicodeRecord').then((interception) => {
        expect(interception.request.body.description).to.equal(unicodeText)
      })
      
      cy.waitForToast('Health record created successfully')
    })

    it('Test 139: Should handle large data payloads', () => {
      // Test with very large text content
      const largeText = 'A'.repeat(1500) // Large but within limits
      
      cy.get('[data-testid="new-record-button"]').click()
      cy.get('[data-testid="health-record-modal"]').should('be.visible')
      
      cy.get('[data-testid="record-type-select"]').select('Physical Exam')
      cy.get('[data-testid="date-input"]').type('2024-01-15')
      cy.get('[data-testid="provider-input"]').type('Dr. Smith')
      cy.get('[data-testid="description-textarea"]').invoke('val', largeText)
      
      // Verify character count
      cy.get('[data-testid="character-count"]').should('contain', '1500/2000')
      
      cy.intercept('POST', '**/api/health-records', {
        statusCode: 201,
        body: { success: true, data: { record: { id: '123' } }}
      }).as('createLargeRecord')
      
      cy.get('[data-testid="save-record-button"]').click()
      cy.wait('@createLargeRecord')
      cy.waitForToast('Health record created successfully')
    })

    it('Test 140: Should handle browser storage limitations', () => {
      // Test when localStorage is full or unavailable
      cy.window().then((win) => {
        // Fill up localStorage to near capacity
        try {
          for (let i = 0; i < 100; i++) {
            win.localStorage.setItem(`test_key_${i}`, 'x'.repeat(1000))
          }
        } catch (e) {
          // Storage is full
        }
      })
      
      cy.get('[data-testid="new-record-button"]').click()
      cy.get('[data-testid="health-record-modal"]').should('be.visible')
      
      // Fill form with data that would normally be cached
      cy.get('[data-testid="record-type-select"]').select('Physical Exam')
      cy.get('[data-testid="date-input"]').type('2024-01-15')
      cy.get('[data-testid="provider-input"]').type('Dr. Smith')
      cy.get('[data-testid="description-textarea"]').type('Test record')
      
      // Form should still work even if caching fails
      cy.intercept('POST', '**/api/health-records', {
        statusCode: 201,
        body: { success: true, data: { record: { id: '123' } }}
      }).as('createRecordNoCache')
      
      cy.get('[data-testid="save-record-button"]').click()
      cy.wait('@createRecordNoCache')
      cy.waitForToast('Health record created successfully')
      
      // Clean up localStorage
      cy.window().then((win) => {
        for (let i = 0; i < 100; i++) {
          win.localStorage.removeItem(`test_key_${i}`)
        }
      })
    })
  })
})