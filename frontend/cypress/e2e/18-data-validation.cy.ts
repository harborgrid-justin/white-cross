/// <reference types="cypress" />

/**
 * Data Validation E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates form validation, data integrity,
 * business rules, and input validation across healthcare
 * management workflows.
 */

describe('Data Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  context('Form Field Validation', () => {
    it('should validate required fields in medication forms', () => {
      cy.visit('/medications')
      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=medication-name-error]').should('contain', 'Medication name is required')
      cy.get('[data-cy=dosage-error]').should('contain', 'Dosage is required')
      cy.get('[data-cy=frequency-error]').should('contain', 'Frequency is required')
      cy.get('[data-cy=student-error]').should('contain', 'Student selection is required')
    })

    it('should validate data formats in health records', () => {
      cy.visit('/health-records')
      cy.get('[data-cy=create-record-button]').click()

      // Test height validation
      cy.get('[data-cy=height-input]').type('300') // Unrealistic height
      cy.get('[data-cy=height-error]').should('contain', 'Height must be between 50-250 cm')

      // Test weight validation
      cy.get('[data-cy=weight-input]').type('5') // Unrealistic weight
      cy.get('[data-cy=weight-error]').should('contain', 'Weight must be between 1-300 kg')

      // Test temperature validation
      cy.get('[data-cy=temperature-input]').type('50') // Unrealistic temperature
      cy.get('[data-cy=temperature-error]').should('contain', 'Temperature must be between 35-45°C')
    })

    it('should validate email format in user forms', () => {
      cy.visit('/users')

      cy.get('[data-cy=add-user-button]').click()

      cy.get('[data-cy=email-input]').type('invalid-email')
      cy.get('[data-cy=email-error]').should('contain', 'Please enter a valid email address')

      cy.get('[data-cy=email-input]').clear().type('test@')
      cy.get('[data-cy=email-error]').should('contain', 'Please enter a complete email address')
    })

    it('should validate phone number format', () => {
      cy.visit('/students')

      cy.get('[data-cy=add-student-button]').click()

      cy.get('[data-cy=phone-input]').type('123')
      cy.get('[data-cy=phone-error]').should('contain', 'Please enter a valid phone number')

      cy.get('[data-cy=phone-input]').clear().type('(555) 123-4567')
      cy.get('[data-cy=phone-error]').should('not.exist')
    })

    it('should validate date formats and ranges', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()

      // Test future date validation
      cy.get('[data-cy=record-date]').type('2025-12-31')
      cy.get('[data-cy=date-error]').should('contain', 'Date cannot be in the future')

      // Test invalid date format
      cy.get('[data-cy=record-date]').clear().type('invalid-date')
      cy.get('[data-cy=date-error]').should('contain', 'Please enter a valid date')

      // Test valid date
      cy.get('[data-cy=record-date]').clear().type('2024-10-01')
      cy.get('[data-cy=date-error]').should('not.exist')
    })
  })

  context('Business Rule Validation', () => {
    it('should validate medication administration rules', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      // Test duplicate medication validation
      cy.get('[data-cy=medication-name]').type('Ibuprofen')
      cy.get('[data-cy=student-select]').select('John Doe')
      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=duplicate-medication-error]').should('contain', 'Student already has this medication')
    })

    it('should validate appointment scheduling rules', () => {
      cy.visit('/appointments')

      cy.get('[data-cy=schedule-appointment-button]').click()

      // Test conflicting appointment times
      cy.get('[data-cy=appointment-date]').type('2024-10-15')
      cy.get('[data-cy=appointment-time]').type('10:00')
      cy.get('[data-cy=appointment-student]').select('Jane Smith')
      cy.get('[data-cy=save-appointment]').click()

      cy.get('[data-cy=conflicting-appointment-error]').should('contain', 'Student already has an appointment at this time')
    })

    it('should validate student age restrictions', () => {
      cy.visit('/students')

      cy.get('[data-cy=add-student-button]').click()

      // Test age validation for school enrollment
      cy.get('[data-cy=student-dob]').type('2000-01-01') // Too old for K-12
      cy.get('[data-cy=student-grade]').select('10')
      cy.get('[data-cy=save-student]').click()

      cy.get('[data-cy=age-grade-mismatch-error]').should('contain', 'Age does not match grade level requirements')
    })

    it('should validate medication dosage rules', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      // Test dosage validation based on student age/weight
      cy.get('[data-cy=student-select]').select('Young Student')
      cy.get('[data-cy=medication-name]').type('Adult Medication')
      cy.get('[data-cy=dosage-input]').type('500mg')
      cy.get('[data-cy=save-medication]').click()

      cy.get('[data-cy=dosage-age-warning]').should('contain', 'Dosage may be too high for student age')
    })
  })

  context('Real-time Validation Feedback', () => {
    it('should provide immediate validation feedback', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name]').type('A')
      cy.get('[data-cy=name-validation-feedback]').should('contain', 'Medication name too short')

      cy.get('[data-cy=medication-name]').type('spirin')
      cy.get('[data-cy=name-validation-feedback]').should('contain', 'Medication name may contain typos')
    })

    it('should validate field relationships', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()

      // Test BMI calculation validation
      cy.get('[data-cy=height-input]').type('175')
      cy.get('[data-cy=weight-input]').type('45') // Unrealistic for height
      cy.get('[data-cy=bmi-validation-warning]').should('contain', 'BMI indicates underweight')
    })

    it('should provide contextual validation help', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name]').type('?')
      cy.get('[data-cy=field-help-tooltip]').should('be.visible')
      cy.get('[data-cy=validation-examples]').should('be.visible')
      cy.get('[data-cy=common-formats]').should('be.visible')
    })
  })

  context('Data Integrity Validation', () => {
    it('should validate data consistency across related records', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()

      // Test student-record relationship validation
      cy.get('[data-cy=student-select]').select('Non-existent Student')
      cy.get('[data-cy=save-record]').click()

      cy.get('[data-cy=student-not-found-error]').should('contain', 'Selected student does not exist')
    })

    it('should validate referential integrity', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      // Test medication-student relationship
      cy.get('[data-cy=medication-select]').select('Medication A')
      cy.get('[data-cy=student-select]').select('Student B')
      cy.get('[data-cy=save-medication]').click()

      cy.get('[data-cy=relationship-validation]').should('be.visible')
    })

    it('should validate data completeness', () => {
      cy.visit('/students')

      cy.get('[data-cy=add-student-button]').click()

      // Test required emergency contact validation
      cy.get('[data-cy=student-name]').type('Test Student')
      cy.get('[data-cy=student-grade]').select('10')
      cy.get('[data-cy=save-student]').click()

      cy.get('[data-cy=emergency-contact-required-error]').should('contain', 'Emergency contact information is required')
    })
  })

  context('Healthcare-Specific Validation', () => {
    it('should validate vital signs within normal ranges', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()

      cy.get('[data-cy=record-type]').select('PHYSICAL_EXAM')

      // Test blood pressure validation
      cy.get('[data-cy=blood-pressure-systolic]').type('80') // Too low
      cy.get('[data-cy=blood-pressure-diastolic]').type('50') // Too low
      cy.get('[data-cy=blood-pressure-warning]').should('contain', 'Blood pressure reading is unusually low')

      // Test heart rate validation
      cy.get('[data-cy=heart-rate-input]').type('30') // Too low
      cy.get('[data-cy=heart-rate-warning]').should('contain', 'Heart rate is below normal range')
    })

    it('should validate medication contraindications', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      // Test allergy-medication interaction
      cy.get('[data-cy=student-select]').select('Student with Peanut Allergy')
      cy.get('[data-cy=medication-name]').type('Peanut Oil Medication')
      cy.get('[data-cy=save-medication]').click()

      cy.get('[data-cy=allergy-contraindication-warning]').should('contain', 'Medication may cause allergic reaction')
    })

    it('should validate immunization schedules', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()

      cy.get('[data-cy=record-type]').select('VACCINATION')

      // Test age-appropriate vaccination
      cy.get('[data-cy=student-select]').select('5 Year Old Student')
      cy.get('[data-cy=vaccination-type]').select('Adult Vaccine')
      cy.get('[data-cy=save-record]').click()

      cy.get('[data-cy=age-inappropriate-vaccination-warning]').should('contain', 'Vaccination not appropriate for student age')
    })

    it('should validate growth chart data', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()

      cy.get('[data-cy=record-type]').select('PHYSICAL_EXAM')

      // Test realistic growth measurements
      cy.get('[data-cy=height-input]').type('50') // Too short for age
      cy.get('[data-cy=weight-input]').type('100') // Too heavy for height
      cy.get('[data-cy=save-record]').click()

      cy.get('[data-cy=growth-measurement-warning]').should('contain', 'Measurements outside expected range for age')
    })
  })

  context('Cross-Field Validation', () => {
    it('should validate related field combinations', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      // Test medication frequency and dosage relationship
      cy.get('[data-cy=frequency-select]').select('4 times daily')
      cy.get('[data-cy=dosage-input]').type('1000mg')
      cy.get('[data-cy=save-medication]').click()

      cy.get('[data-cy=dosage-frequency-warning]').should('contain', 'High frequency with high dosage may be unsafe')
    })

    it('should validate conditional field requirements', () => {
      cy.visit('/incidents')

      cy.get('[data-cy=report-incident-button]').click()

      cy.get('[data-cy=incident-type]').select('MEDICAL')
      cy.get('[data-cy=save-incident]').click()

      cy.get('[data-cy=conditional-field-error]').should('contain', 'Medical treatment details required for medical incidents')
    })

    it('should validate field dependencies', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()

      // Test dependent field validation
      cy.get('[data-cy=record-type]').select('PHYSICAL_EXAM')
      cy.get('[data-cy=height-input]').type('175')
      cy.get('[data-cy=weight-input]').type('70')
      cy.get('[data-cy=save-record]').click()

      cy.get('[data-cy=bmi-calculation-validation]').should('be.visible')
      cy.get('[data-cy=bmi-auto-calculated]').should('contain', '22.9')
    })
  })

  context('Input Sanitization and Security', () => {
    it('should sanitize user input to prevent XSS', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      // Attempt XSS injection
      cy.get('[data-cy=medication-name]').type('<script>alert("xss")</script>')
      cy.get('[data-cy=medication-instructions]').type('"><script>alert("xss")</script>')

      cy.get('[data-cy=save-medication]').click()

      // Check that script tags are sanitized
      cy.get('[data-cy=medication-name-display]').should('not.contain', '<script>')
      cy.get('[data-cy=medication-instructions-display]').should('not.contain', '<script>')
    })

    it('should validate input length limits', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      // Test maximum length validation
      const longText = 'a'.repeat(1000)
      cy.get('[data-cy=medication-name]').type(longText)

      cy.get('[data-cy=name-length-error]').should('contain', 'Medication name too long')
      cy.get('[data-cy=character-count]').should('contain', '1000/100')
    })

    it('should prevent SQL injection attempts', () => {
      cy.visit('/students')

      cy.get('[data-cy=student-search]').type("'; DROP TABLE students; --")
      cy.get('[data-cy=search-button]').click()

      cy.get('[data-cy=search-results]').should('be.visible')
      cy.get('[data-cy=sql-injection-blocked]').should('be.visible')
    })
  })

  context('Batch Validation', () => {
    it('should validate bulk data imports', () => {
      cy.visit('/data-management')

      cy.get('[data-cy=import-health-records]').click()

      const fileName = 'bulk-health-data.csv'
      cy.fixture(fileName).then(fileContent => {
        cy.get('[data-cy=file-upload-input]').upload({ fileContent, fileName, mimeType: 'text/csv' })
      })

      cy.get('[data-cy=validate-bulk-data]').click()
      cy.get('[data-cy=bulk-validation-progress]').should('be.visible')

      cy.get('[data-cy=validation-summary]').should('be.visible')
      cy.get('[data-cy=valid-records-count]').should('be.visible')
      cy.get('[data-cy=invalid-records-count]').should('be.visible')
      cy.get('[data-cy=validation-errors-list]').should('be.visible')
    })

    it('should handle partial validation failures in bulk operations', () => {
      cy.visit('/data-management')

      cy.get('[data-cy=bulk-update-students]').click()

      cy.get('[data-cy=bulk-validation-results]').should('be.visible')
      cy.get('[data-cy=partial-validation-failure]').should('contain', 'Some records failed validation')
      cy.get('[data-cy=skip-invalid-option]').should('be.visible')
      cy.get('[data-cy=fix-and-retry-option]').should('be.visible')
    })
  })

  context('Real-time Data Validation', () => {
    it('should validate data as user types', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name]').type('I')
      cy.get('[data-cy=real-time-validation]').should('contain', 'Continue typing...')

      cy.get('[data-cy=medication-name]').type('buprofen')
      cy.get('[data-cy=real-time-validation]').should('contain', 'Valid medication name')
    })

    it('should provide autocomplete suggestions', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name]').type('Ibu')
      cy.get('[data-cy=autocomplete-suggestions]').should('be.visible')
      cy.get('[data-cy=suggestion-item]').should('contain', 'Ibuprofen')
      cy.get('[data-cy=suggestion-item]').should('contain', 'Ibuprofen 800mg')
    })

    it('should validate numeric inputs with range checking', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()

      cy.get('[data-cy=height-input]').type('175')
      cy.get('[data-cy=height-range-indicator]').should('contain', 'Normal range')

      cy.get('[data-cy=height-input]').clear().type('300')
      cy.get('[data-cy=height-range-indicator]').should('contain', 'Above normal range')
    })
  })

  context('Healthcare Compliance Validation', () => {
    it('should validate HIPAA compliance requirements', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()

      // Test PHI data validation
      cy.get('[data-cy=include-phi-data]').check()
      cy.get('[data-cy=hipaa-compliance-warning]').should('be.visible')
      cy.get('[data-cy=phi-encryption-required]').should('be.visible')
      cy.get('[data-cy=access-logging-required]').should('be.visible')
    })

    it('should validate FERPA compliance for student data', () => {
      cy.visit('/students')

      cy.get('[data-cy=add-student-button]').click()

      // Test parental consent validation
      cy.get('[data-cy=include-directory-info]').check()
      cy.get('[data-cy=ferpa-consent-required]').should('be.visible')
      cy.get('[data-cy=parental-consent-checkbox]').should('be.visible')
    })

    it('should validate controlled substance handling', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name]').type('Oxycodone')
      cy.get('[data-cy=controlled-substance-warning]').should('be.visible')
      cy.get('[data-cy=dea-number-required]').should('be.visible')
      cy.get('[data-cy=double-signature-required]').should('be.visible')
    })
  })

  context('Validation Error Recovery', () => {
    it('should provide clear correction guidance', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name]').type('123')
      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=validation-error]').should('be.visible')
      cy.get('[data-cy=correction-guidance]').should('be.visible')
      cy.get('[data-cy=suggested-values]').should('be.visible')
      cy.get('[data-cy=field-examples]').should('be.visible')
    })

    it('should allow users to correct validation errors', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name]').type('Invalid@Name!')
      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=validation-error]').should('be.visible')
      cy.get('[data-cy=fix-suggestion-button]').click()

      cy.get('[data-cy=medication-name]').should('have.value', 'Invalid Name')
      cy.get('[data-cy=validation-error]').should('not.exist')
    })

    it('should provide bulk error correction tools', () => {
      cy.visit('/data-management')

      cy.get('[data-cy=import-with-errors]').click()

      cy.get('[data-cy=bulk-error-correction]').should('be.visible')
      cy.get('[data-cy=apply-corrections-to-all]').should('be.visible')
      cy.get('[data-cy=correction-patterns]').should('be.visible')
    })
  })

  context('Validation Rule Management', () => {
    it('should allow configuration of validation rules', () => {
      cy.visit('/system-config')

      cy.get('[data-cy=validation-rules-tab]').click()
      cy.get('[data-cy=edit-validation-rules]').click()

      cy.get('[data-cy=validation-rules-modal]').should('be.visible')
      cy.get('[data-cy=add-validation-rule]').click()
      cy.get('[data-cy=rule-field-select]').select('medication_name')
      cy.get('[data-cy=rule-type-select]').select('FORMAT')
      cy.get('[data-cy=rule-pattern]').type('^[A-Za-z0-9 ]+$')

      cy.get('[data-cy=save-validation-rule]').click()
      cy.get('[data-cy=rule-saved-message]').should('be.visible')
    })

    it('should test validation rules before applying', () => {
      cy.visit('/system-config')

      cy.get('[data-cy=validation-rules-tab]').click()

      cy.get('[data-cy=test-validation-rule]').click()
      cy.get('[data-cy=rule-testing-modal]').should('be.visible')

      cy.get('[data-cy=test-input-data]').type('Test Input')
      cy.get('[data-cy=run-rule-test]').click()
      cy.get('[data-cy=rule-test-results]').should('be.visible')
    })
  })
})
