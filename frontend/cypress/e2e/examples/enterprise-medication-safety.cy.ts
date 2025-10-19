/// <reference types="cypress" />

/**
 * Enterprise-Grade Medication Safety Test Suite
 * 
 * This test suite demonstrates best practices for testing critical healthcare workflows:
 * - Comprehensive medication administration testing
 * - Five Rights of Medication Administration validation
 * - HIPAA audit logging verification
 * - Error handling and resilience testing
 * - Accessibility compliance
 * - Performance monitoring
 * 
 * @category MedicationSafety
 * @priority Critical
 * @tags [medication, safety, enterprise, audit, hipaa]
 */

describe('Enterprise Medication Safety - Critical Workflows', () => {
  let testData: {
    student: any
    medication: any
    prescription: any
  }

  before(() => {
    // Load comprehensive test data
    cy.fixture('students').then((students) => {
      testData = {
        student: students.studentWithMedications,
        medication: null,
        prescription: null
      }
    })

    cy.fixture('medications').then((medications) => {
      testData.medication = medications.testMedication1
    })

    // Verify test environment is clean
    cy.task('clearTestData')
  })

  beforeEach(() => {
    // Arrange: Setup enterprise-grade session with audit logging
    cy.login('nurse', {
      validateRole: true,
      timeout: 30000
    })

    // Setup comprehensive API intercepts for medication safety
    cy.setupMedicationIntercepts({
      shouldFail: false,
      networkDelay: 100
    })

    // Navigate to medication management
    cy.visit('/medications')
    cy.waitForHealthcareData()

    // Verify page accessibility compliance
    cy.checkAccessibility('medication-page-container')
  })

  afterEach(() => {
    // Cleanup: Remove test data and verify audit logs
    if (testData?.student?.studentId) {
      cy.cleanupHealthRecords(testData.student.studentId)
    }

    // Verify HIPAA audit trail completion
    cy.verifyMedicationAuditTrail('MEDICATION_ACCESS')
  })

  context('Five Rights of Medication Administration - Critical Safety', () => {
    it('should verify all Five Rights before allowing medication administration', () => {
      // Arrange: Setup medication administration scenario
      const administrationData = {
        patientName: `${testData.student.firstName} ${testData.student.lastName}`,
        patientId: testData.student.studentNumber,
        medicationName: testData.medication.name,
        dose: testData.medication.dosage,
        route: testData.medication.route
      }

      // Act: Navigate to medication administration
      cy.getByTestId('student-search-input')
        .type(testData.student.firstName)
      
      cy.searchStudents(testData.student.firstName)
      
      cy.getByTestId('student-medication-card')
        .contains(testData.student.lastName)
        .click()

      // Navigate to administer medication
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      // Assert: Verify Five Rights are displayed and validated
      cy.verifyFiveRights(administrationData)

      // Act: Complete medication administration with safety checks
      cy.administerMedication({
        studentId: testData.student.studentNumber,
        patientBarcode: testData.medication.barcode,
        medicationBarcode: testData.medication.barcode,
        dosage: testData.medication.dosage,
        route: testData.medication.route,
        notes: 'Administered as prescribed - student tolerating well'
      })

      // Assert: Verify administration success and audit logging
      cy.verifySuccess(/medication.*administered.*successfully/i)
      cy.verifyMedicationAuditTrail('ADMINISTER_MEDICATION')
      
      // Verify medication appears in administration log
      cy.getByTestId('recent-administrations')
        .should('contain', testData.medication.name)
        .and('contain', 'just now')
    })

    it('should prevent duplicate medication administration within safety window', () => {
      // Arrange: Setup recent administration scenario
      cy.verifyDuplicatePrevention(
        `${testData.student.studentId}-${testData.medication.id}`,
        30 // 30-minute safety window
      )

      // Act: Attempt to administer same medication
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      // Select same medication that was recently administered
      cy.getByTestId('medication-select')
        .select(testData.medication.name)

      // Assert: Verify duplicate prevention warning
      cy.verifyError(/medication.*recently.*administered/i)
      
      // Verify administration is blocked
      cy.getByTestId('confirm-administration-button')
        .should('be.disabled')

      cy.verifyMedicationAuditTrail('DUPLICATE_PREVENTION_TRIGGERED')
    })

    it('should validate barcode scanning for medication identification', () => {
      // Arrange: Setup barcode scanning scenario
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      // Act: Scan medication barcode
      cy.scanBarcode(testData.medication.barcode, 'medication')

      // Assert: Verify medication is automatically populated
      cy.getByTestId('medication-name-display')
        .should('contain', testData.medication.name)
      
      cy.getByTestId('medication-strength-display')
        .should('contain', testData.medication.dosage)

      // Act: Scan patient barcode
      cy.scanBarcode(testData.student.studentNumber, 'patient')

      // Assert: Verify patient information is populated
      cy.getByTestId('patient-name-display')
        .should('contain', testData.student.firstName)

      // Verify barcode audit logging
      cy.verifyMedicationAuditTrail('BARCODE_SCAN')
    })
  })

  context('Drug Allergy and Interaction Checking', () => {
    it('should check for drug allergies before medication administration', () => {
      // Arrange: Student with known allergies
      cy.fixture('students').then((students) => {
        const studentWithAllergies = students.studentWithAllergies

        // Act: Attempt to administer medication
        cy.searchStudents(studentWithAllergies.firstName)
        
        cy.getByTestId('student-medication-card')
          .contains(studentWithAllergies.lastName)
          .click()

        // Setup allergy check
        cy.checkDrugAllergies(
          studentWithAllergies.studentNumber,
          testData.medication.id
        )

        cy.getByTestId('administer-medication-button').click()

        // Assert: Verify allergy warning if applicable
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="allergy-warning"]').length > 0) {
            cy.getByTestId('allergy-warning')
              .should('be.visible')
              .and('contain', 'ALLERGY ALERT')
            
            // Verify requires additional confirmation
            cy.getByTestId('acknowledge-allergy-checkbox')
              .should('exist')
              .and('not.be.checked')
          }
        })

        cy.verifyMedicationAuditTrail('ALLERGY_CHECK')
      })
    })

    it('should check for drug interactions with existing medications', () => {
      // Arrange: Setup drug interaction scenario
      cy.fixture('medications').then((medications) => {
        const interactionMedication = medications.medicationWithInteractions

        // Act: Attempt to administer medication with known interactions
        cy.getByTestId('administer-medication-button').click()
        cy.waitForModal('medication-administration-modal')

        cy.getByTestId('medication-select')
          .select(interactionMedication.name)

        // Assert: Verify interaction warning
        if (interactionMedication.drugInteractions?.length > 0) {
          cy.getByTestId('drug-interaction-warning')
            .should('be.visible')
            .and('contain', 'DRUG INTERACTION')

          // Verify interaction details are displayed
          interactionMedication.drugInteractions.forEach((interaction: any) => {
            cy.getByTestId('interaction-details')
              .should('contain', interaction.drug)
              .and('contain', interaction.severity)
          })
        }

        cy.verifyMedicationAuditTrail('INTERACTION_CHECK')
      })
    })
  })

  context('Controlled Substance Management', () => {
    it('should enforce controlled substance protocols', () => {
      // Arrange: Setup controlled substance scenario
      cy.fixture('medications').then((medications) => {
        const controlledMedication = medications.testMedication2 // Methylphenidate (Schedule II)

        // Act: Attempt to administer controlled substance
        cy.getByTestId('administer-medication-button').click()
        cy.waitForModal('medication-administration-modal')

        cy.getByTestId('medication-select')
          .select(controlledMedication.name)

        // Assert: Verify controlled substance protocols
        cy.verifyControlledSubstanceTracking({
          isControlled: true,
          deaNumber: controlledMedication.deaNumber
        })

        // Verify DEA number is required and validated
        cy.getByTestId('dea-number-input')
          .should('be.visible')
          .and('be.required')

        // Verify witness signature is required
        cy.getByTestId('witness-signature-section')
          .should('be.visible')

        cy.getByTestId('witness-name-input')
          .should('be.required')

        // Act: Complete controlled substance administration
        cy.getByTestId('dea-number-input')
          .type(controlledMedication.deaNumber)

        cy.getByTestId('witness-name-input')
          .type('Supervising Nurse Smith')

        cy.getByTestId('witness-signature-input')
          .type('N. Smith, RN')

        // Assert: Verify custody chain logging
        cy.verifyMedicationAuditTrail('CONTROLLED_SUBSTANCE_ADMINISTRATION')
      })
    })
  })

  context('Offline Capability and Data Integrity', () => {
    it('should handle offline medication administration gracefully', () => {
      // Arrange: Setup offline scenario
      cy.simulateOffline()

      // Act: Attempt medication administration while offline
      cy.getByTestId('administer-medication-button').click()

      // Assert: Verify offline mode notification
      cy.getByTestId('offline-mode-notification')
        .should('be.visible')
        .and('contain', 'Working Offline')

      // Act: Complete administration offline
      cy.administerMedication({
        studentId: testData.student.studentId,
        medicationBarcode: testData.medication.barcode,
        dosage: testData.medication.dosage,
        notes: 'Administered offline - will sync when connection restored'
      })

      // Assert: Verify queued for sync
      cy.verifyOfflineQueue()

      // Act: Restore network connection
      cy.simulateOnline()

      // Assert: Verify automatic sync
      cy.getByTestId('sync-status-indicator')
        .should('contain', 'Synced')

      cy.verifyMedicationAuditTrail('OFFLINE_SYNC')
    })
  })

  context('Performance and Load Testing', () => {
    it('should maintain performance under typical load', () => {
      // Arrange: Setup performance monitoring
      cy.setupMedicationIntercepts({
        networkDelay: 50 // Simulate typical network latency
      })

      const startTime = Date.now()

      // Act: Perform typical medication workflow
      cy.searchStudents(testData.student.firstName)
      
      cy.getByTestId('student-medication-card')
        .first()
        .click()

      cy.getByTestId('view-medication-history-button')
        .click()

      // Assert: Verify performance within SLA
      cy.measureApiResponseTime('getMedications', 2000)

      cy.then(() => {
        const endTime = Date.now()
        const totalTime = endTime - startTime
        
        // Verify total workflow completes within 5 seconds
        expect(totalTime).to.be.lessThan(5000)
        
        cy.log(`Medication workflow completed in ${totalTime}ms`)
      })
    })

    it('should handle API failures gracefully with circuit breaker', () => {
      // Arrange: Setup API failure scenario
      cy.verifyCircuitBreaker('**/api/medications', 3)

      // Act: Attempt to load medications during failure
      cy.visit('/medications', { failOnStatusCode: false })

      // Assert: Verify graceful degradation
      cy.getByTestId('error-fallback-message')
        .should('be.visible')
        .and('contain', 'temporarily unavailable')

      // Verify retry mechanism
      cy.getByTestId('retry-button')
        .should('be.visible')
        .click()

      // Verify circuit breaker audit logging
      cy.verifyMedicationAuditTrail('CIRCUIT_BREAKER_TRIGGERED')
    })
  })

  context('Inventory Management and Alerts', () => {
    it('should alert for low medication inventory levels', () => {
      // Arrange: Setup low inventory scenario
      cy.fixture('medications').then((medications) => {
        const lowStockMedication = medications.lowStockMedication

        // Act: Navigate to inventory management
        cy.visit('/medications/inventory')
        cy.waitForHealthcareData()

        // Assert: Verify low stock alerts
        cy.verifyInventoryAlerts()

        // Verify specific low stock medication alert
        cy.getByTestId('low-stock-alert')
          .should('contain', lowStockMedication.name)
          .and('contain', 'Low Stock')

        // Verify reorder notification
        cy.getByTestId('reorder-required-badge')
          .should('be.visible')

        cy.verifyMedicationAuditTrail('INVENTORY_ALERT_VIEWED')
      })
    })

    it('should prevent administration of expired medications', () => {
      // Arrange: Setup expired medication scenario
      cy.fixture('medications').then((medications) => {
        const expiredMedication = medications.expiredMedication

        // Act: Attempt to select expired medication
        cy.getByTestId('administer-medication-button').click()
        cy.waitForModal('medication-administration-modal')

        // Search for expired medication
        cy.getByTestId('medication-search-input')
          .type(expiredMedication.name)

        // Assert: Verify expired medication is not selectable
        cy.getByTestId('expired-medication-warning')
          .should('be.visible')
          .and('contain', 'EXPIRED')

        cy.getByTestId('medication-select')
          .find('option')
          .contains(expiredMedication.name)
          .should('be.disabled')

        cy.verifyMedicationAuditTrail('EXPIRED_MEDICATION_ACCESS_BLOCKED')
      })
    })
  })

  context('Adverse Reaction Reporting', () => {
    it('should facilitate comprehensive adverse reaction reporting', () => {
      // Arrange: Setup adverse reaction scenario
      const reactionData = {
        severity: 'MODERATE' as const,
        description: 'Student experienced mild nausea and dizziness 30 minutes after administration',
        actionTaken: 'Administered water, monitored vitals, contacted parent and physician',
        symptoms: ['Nausea', 'Dizziness', 'Mild headache']
      }

      // Act: Report adverse reaction
      cy.reportAdverseReaction(reactionData)

      // Assert: Verify reaction is documented
      cy.verifySuccess(/adverse.*reaction.*reported/i)

      // Verify reaction appears in student's medical history
      cy.getByTestId('medical-history-tab').click()
      
      cy.getByTestId('adverse-reactions-section')
        .should('contain', reactionData.description)
        .and('contain', reactionData.severity)

      // Verify automatic safety notifications
      cy.getByTestId('safety-alert-notification')
        .should('be.visible')
        .and('contain', 'Adverse Reaction Reported')

      cy.verifyMedicationAuditTrail('ADVERSE_REACTION_REPORTED')
    })
  })

  context('Comprehensive Error Handling', () => {
    it('should provide clear error messages for validation failures', () => {
      // Arrange: Setup validation failure scenario
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      // Act: Attempt submission without required fields
      cy.getByTestId('confirm-administration-button').click()

      // Assert: Verify comprehensive validation errors
      cy.verifyError(/required.*field/i)

      // Verify specific field validation messages
      cy.getByTestId('student-field-error')
        .should('contain', 'Student selection is required')

      cy.getByTestId('medication-field-error')
        .should('contain', 'Medication selection is required')

      cy.getByTestId('dosage-field-error')
        .should('contain', 'Dosage is required')

      // Verify accessibility of error messages
      cy.getByTestId('student-select')
        .should('have.attr', 'aria-describedby')
        .and('match', /error/)
    })

    it('should handle network timeouts gracefully', () => {
      // Arrange: Setup network timeout scenario
      cy.setupMedicationIntercepts({
        shouldFail: true,
        networkDelay: 5000
      })

      // Act: Attempt medication administration with timeout
      cy.getByTestId('administer-medication-button').click()

      // Assert: Verify timeout handling
      cy.getByTestId('network-timeout-message', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'Request timed out')

      // Verify retry option is available
      cy.getByTestId('retry-administration-button')
        .should('be.visible')

      // Verify data preservation during error
      cy.getByTestId('draft-saved-indicator')
        .should('contain', 'Draft saved')
    })
  })

  context('Accessibility and Compliance', () => {
    it('should meet WCAG 2.1 AA accessibility standards', () => {
      // Act: Navigate through medication workflow
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      // Assert: Verify keyboard navigation
      cy.getByTestId('student-select').focus()
      cy.focused().should('have.attr', 'data-testid', 'student-select')

      cy.focused().tab()
      cy.focused().should('have.attr', 'data-testid', 'medication-select')

      // Verify screen reader accessibility
      cy.checkAccessibility('medication-administration-modal')

      // Verify ARIA labels and descriptions
      cy.getByTestId('medication-select')
        .should('have.attr', 'aria-label')
        .and('match', /medication/i)

      // Verify color contrast for critical elements
      cy.getByTestId('confirm-administration-button')
        .should('have.css', 'background-color')
        .and('not.equal', 'transparent')

      // Verify focus indicators
      cy.getByTestId('confirm-administration-button')
        .focus()
        .should('have.css', 'outline-style', 'solid')
    })
  })
})
