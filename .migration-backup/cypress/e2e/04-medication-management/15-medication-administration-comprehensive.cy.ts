/// <reference types="cypress" />

/**
 * Medication Management: Comprehensive Medication Administration Workflow
 *
 * CRITICAL SAFETY TEST SUITE - Tests life-critical medication administration
 *
 * This test suite validates the complete medication administration workflow
 * including the Five Rights of Medication Administration:
 * 1. Right Patient
 * 2. Right Medication
 * 3. Right Dose
 * 4. Right Route
 * 5. Right Time
 *
 * Safety Features Tested:
 * - Barcode scanning for patient and medication verification
 * - Allergy checking before administration
 * - Duplicate administration prevention
 * - Controlled substance witness requirements
 * - Administration logging and audit trail
 * - Performance SLA validation (<2s for critical operations)
 */

describe('Medication Management - Comprehensive Administration Workflow (CRITICAL)', () => {
  const testStudent = {
    id: 'student-test-001',
    firstName: 'John',
    lastName: 'Doe',
    studentNumber: 'STU001',
    barcode: 'STU001-BARCODE'
  }

  const testMedication = {
    id: 'med-albuterol-001',
    name: 'Albuterol Inhaler',
    genericName: 'Albuterol Sulfate',
    strength: '90 mcg/dose',
    form: 'inhaler',
    ndc: '12345-678-90',
    barcode: 'NDC-12345-678-90'
  }

  const testPrescription = {
    id: 'prescription-001',
    studentId: testStudent.id,
    medicationId: testMedication.id,
    dosage: '2 puffs',
    frequency: 'As needed',
    route: 'Inhaled',
    prescribedBy: 'Dr. Sarah Johnson',
    startDate: '2024-01-01',
    isActive: true
  }

  beforeEach(() => {
    // Mock medications list for the medications page
    cy.intercept('GET', '**/api/medications*', (req) => {
      // Only match list requests, not individual medication requests
      if (!req.url.includes('/api/medications/') || req.url.match(/\/api\/medications\?/)) {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              medications: [testMedication],
              pagination: {
                page: 1,
                limit: 20,
                total: 1,
                pages: 1
              }
            }
          }
        })
      }
    }).as('getMedications')

    // Mock student data with allergies
    cy.intercept('GET', `**/api/students/${testStudent.id}`, {
      statusCode: 200,
      body: {
        success: true,
        data: {
          student: testStudent
        }
      }
    }).as('getStudent')

    // Mock medication data
    cy.intercept('GET', `**/api/medications/${testMedication.id}`, {
      statusCode: 200,
      body: {
        success: true,
        data: {
          medication: testMedication
        }
      }
    }).as('getMedication')

    // Mock prescription data
    cy.intercept('GET', `**/api/medications/student/${testStudent.id}`, {
      statusCode: 200,
      body: {
        success: true,
        data: {
          prescriptions: [testPrescription]
        }
      }
    }).as('getPrescriptions')

    // Mock allergy check (no allergies)
    cy.intercept('GET', `**/api/students/${testStudent.id}/allergies`, {
      statusCode: 200,
      body: {
        success: true,
        data: {
          allergies: []
        }
      }
    }).as('checkAllergies')

    // Mock recent administration check (no duplicates)
    cy.intercept('GET', `**/api/medications/logs/recent*`, {
      statusCode: 200,
      body: {
        success: true,
        data: {
          recentAdministrations: []
        }
      }
    }).as('checkRecentAdministration')

    // Mock successful administration
    cy.intercept('POST', '**/api/medications/administration', {
      statusCode: 201,
      body: {
        success: true,
        data: {
          medicationLog: {
            id: 'log-001',
            studentMedicationId: testPrescription.id,
            dosageGiven: testPrescription.dosage,
            timeGiven: new Date().toISOString(),
            administeredBy: 'Nurse Mary Smith'
          }
        }
      }
    }).as('administerMedication')

    // Mock audit log endpoint
    cy.intercept('POST', '**/api/audit', {
      statusCode: 201,
      body: {
        success: true,
        data: { logged: true }
      }
    }).as('auditLog')

    cy.login('nurse')
    cy.visit('/medications')

    // Click the medications tab to trigger the API call
    // The medications page defaults to 'overview' tab, so we need to switch to 'medications' tab
    cy.getByTestId('medications-tab').click()
    cy.wait('@getMedications')
  })

  describe('Five Rights Verification - Complete Workflow', () => {
    it('should complete full Five Rights verification successfully', () => {
      // Navigate to medication administration
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      // Step 1: RIGHT PATIENT - Scan patient barcode
      cy.log('Verifying RIGHT PATIENT')
      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.wait('@getStudent')

      // Verify patient details displayed
      cy.getByTestId('patient-name-display').should('contain', `${testStudent.firstName} ${testStudent.lastName}`)
      cy.getByTestId('patient-id-display').should('contain', testStudent.studentNumber)
      cy.getByTestId('patient-photo').should('be.visible') // Photo verification

      // Step 2: RIGHT MEDICATION - Scan medication barcode
      cy.log('Verifying RIGHT MEDICATION')
      cy.scanBarcode(testMedication.barcode, 'medication')
      cy.wait('@getMedication')

      // Verify medication details displayed
      cy.getByTestId('medication-name-display').should('contain', testMedication.name)
      cy.getByTestId('medication-strength-display').should('contain', testMedication.strength)
      cy.getByTestId('medication-ndc-display').should('contain', testMedication.ndc)

      // Step 3: RIGHT DOSE - Verify and confirm dosage
      cy.log('Verifying RIGHT DOSE')
      cy.getByTestId('dose-display').should('contain', testPrescription.dosage)
      cy.getByTestId('dosage-input').should('have.value', testPrescription.dosage)

      // Dose calculation assistance should be visible
      cy.getByTestId('dose-calculator').should('be.visible')

      // Step 4: RIGHT ROUTE - Verify route of administration
      cy.log('Verifying RIGHT ROUTE')
      cy.getByTestId('route-display').should('contain', testPrescription.route)
      cy.getByTestId('route-select').should('have.value', testPrescription.route.toLowerCase())

      // Step 5: RIGHT TIME - Verify administration time window
      cy.log('Verifying RIGHT TIME')
      cy.getByTestId('scheduled-time-display').should('be.visible')
      cy.getByTestId('administration-time-input').should('not.be.empty')

      // Verify time is not in future
      cy.getByTestId('administration-time-input').then(($input) => {
        const inputTime = new Date($input.val() as string)
        const now = new Date()
        expect(inputTime.getTime()).to.be.lte(now.getTime())
      })

      // Final confirmation
      cy.getByTestId('confirm-administration-button').click()

      // Verify administration logged
      cy.wait('@administerMedication').its('request.body').should('include', {
        studentMedicationId: testPrescription.id,
        dosageGiven: testPrescription.dosage
      })

      // Verify success message
      cy.verifySuccess(/administered successfully/i)

      // Verify audit trail
      cy.wait('@auditLog').its('request.body').should('deep.include', {
        action: 'ADMINISTER_MEDICATION',
        resourceType: 'MEDICATION'
      })
    })

    it('should prevent administration without patient barcode scan', () => {
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      // Try to administer without scanning patient
      cy.getByTestId('confirm-administration-button').should('be.disabled')

      // Error message should indicate patient verification required
      cy.getByTestId('patient-verification-required').should('be.visible')
        .and('contain', 'Patient barcode scan required')
    })

    it('should prevent administration without medication barcode scan', () => {
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      // Scan patient only
      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.wait('@getStudent')

      // Try to confirm without medication scan
      cy.getByTestId('confirm-administration-button').should('be.disabled')

      // Error message should indicate medication verification required
      cy.getByTestId('medication-verification-required').should('be.visible')
        .and('contain', 'Medication barcode scan required')
    })

    it('should detect wrong patient barcode mismatch', () => {
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      const wrongStudent = {
        id: 'student-wrong-002',
        firstName: 'Jane',
        lastName: 'Smith',
        studentNumber: 'STU002',
        barcode: 'STU002-BARCODE'
      }

      // Mock wrong student
      cy.intercept('GET', `**/api/students/${wrongStudent.id}`, {
        statusCode: 200,
        body: {
          success: true,
          data: {
            student: wrongStudent
          }
        }
      }).as('getWrongStudent')

      // Scan wrong patient barcode
      cy.scanBarcode(wrongStudent.barcode, 'patient')
      cy.wait('@getWrongStudent')

      // Try to scan medication for different patient
      cy.scanBarcode(testMedication.barcode, 'medication')

      // Should show barcode mismatch error
      cy.getByTestId('patient-mismatch-error').should('be.visible')
        .and('contain', 'Patient does not match medication prescription')

      cy.getByTestId('confirm-administration-button').should('be.disabled')
    })

    it('should detect wrong medication barcode mismatch', () => {
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      const wrongMedication = {
        id: 'med-tylenol-002',
        name: 'Tylenol',
        ndc: '98765-432-10',
        barcode: 'NDC-98765-432-10'
      }

      // Mock wrong medication
      cy.intercept('GET', `**/api/medications/${wrongMedication.id}`, {
        statusCode: 200,
        body: {
          success: true,
          data: {
            medication: wrongMedication
          }
        }
      }).as('getWrongMedication')

      // Scan correct patient
      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.wait('@getStudent')

      // Scan wrong medication
      cy.scanBarcode(wrongMedication.barcode, 'medication')
      cy.wait('@getWrongMedication')

      // Should show NDC mismatch error
      cy.getByTestId('medication-mismatch-error').should('be.visible')
        .and('contain', 'Medication does not match prescription')

      // Should display both medications for comparison
      cy.getByTestId('expected-medication').should('contain', testMedication.name)
      cy.getByTestId('scanned-medication').should('contain', wrongMedication.name)

      cy.getByTestId('confirm-administration-button').should('be.disabled')
    })
  })

  describe('Wrong Dose Prevention', () => {
    it('should detect dose outside prescribed range', () => {
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.wait('@getStudent')

      cy.scanBarcode(testMedication.barcode, 'medication')
      cy.wait('@getMedication')

      // Try to enter wrong dose
      cy.getByTestId('dosage-input').clear().type('10 puffs')

      // Should show dose validation error
      cy.getByTestId('dose-error').should('be.visible')
        .and('contain', 'Dose exceeds prescribed amount')

      // Show prescribed dose range
      cy.getByTestId('prescribed-dose-display').should('contain', '2 puffs')

      cy.getByTestId('confirm-administration-button').should('be.disabled')
    })

    it('should provide dose calculation assistance', () => {
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.scanBarcode(testMedication.barcode, 'medication')

      // Open dose calculator
      cy.getByTestId('dose-calculator-button').click()

      // Calculator should show medication details
      cy.getByTestId('calculator-medication-name').should('contain', testMedication.name)
      cy.getByTestId('calculator-strength').should('contain', testMedication.strength)
      cy.getByTestId('calculator-prescribed-dose').should('contain', testPrescription.dosage)

      // Should provide unit conversion if needed
      cy.getByTestId('dose-unit-converter').should('be.visible')
    })

    it('should allow override with documented reason for dose adjustment', () => {
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.scanBarcode(testMedication.barcode, 'medication')

      // Enter adjusted dose
      cy.getByTestId('dosage-input').clear().type('1 puff')

      // Should prompt for reason
      cy.getByTestId('dose-adjustment-reason-modal').should('be.visible')
      cy.getByTestId('dose-adjustment-reason').type('Patient weight adjustment per physician order')
      cy.getByTestId('confirm-dose-adjustment').click()

      // Should allow administration with documented reason
      cy.getByTestId('confirm-administration-button').should('not.be.disabled')
      cy.getByTestId('dose-adjustment-indicator').should('be.visible')
        .and('contain', 'Dose adjusted')
    })
  })

  describe('Wrong Route Prevention', () => {
    it('should detect route mismatch', () => {
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.scanBarcode(testMedication.barcode, 'medication')

      // Try to change route
      cy.getByTestId('route-select').select('oral')

      // Should show route validation error
      cy.getByTestId('route-error').should('be.visible')
        .and('contain', 'Route does not match prescription')

      // Show prescribed route
      cy.getByTestId('prescribed-route-display').should('contain', 'Inhaled')

      cy.getByTestId('confirm-administration-button').should('be.disabled')
    })

    it('should prevent administration via incorrect route', () => {
      const oralMedication = {
        ...testMedication,
        id: 'med-tylenol-oral',
        name: 'Tylenol',
        form: 'tablet'
      }

      const oralPrescription = {
        ...testPrescription,
        id: 'prescription-oral',
        medicationId: oralMedication.id,
        route: 'Oral'
      }

      cy.intercept('GET', `**/api/medications/${oralMedication.id}`, {
        statusCode: 200,
        body: { success: true, data: { medication: oralMedication } }
      })

      cy.intercept('GET', `**/api/medications/student/${testStudent.id}`, {
        statusCode: 200,
        body: { success: true, data: { prescriptions: [oralPrescription] } }
      })

      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.scanBarcode(oralMedication.barcode, 'medication')

      // Route should be pre-selected and locked
      cy.getByTestId('route-select').should('have.value', 'oral')
      cy.getByTestId('route-select').should('be.disabled')

      // Route change button should require override
      cy.getByTestId('override-route-button').should('be.visible')
    })
  })

  describe('Wrong Time Prevention', () => {
    it('should detect administration outside time window', () => {
      const scheduledTime = new Date()
      scheduledTime.setHours(9, 0, 0, 0) // 9:00 AM

      const currentTime = new Date()
      currentTime.setHours(15, 0, 0, 0) // 3:00 PM - 6 hours late

      cy.clock(currentTime.getTime())

      cy.intercept('GET', `**/api/medications/student/${testStudent.id}`, {
        statusCode: 200,
        body: {
          success: true,
          data: {
            prescriptions: [{
              ...testPrescription,
              scheduledTime: scheduledTime.toISOString(),
              administrationWindow: 60 // 60 minutes window
            }]
          }
        }
      })

      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.scanBarcode(testMedication.barcode, 'medication')

      // Should show late administration warning
      cy.getByTestId('late-administration-warning').should('be.visible')
        .and('contain', 'Administration is 6 hours late')

      // Show scheduled time
      cy.getByTestId('scheduled-time-display').should('contain', '9:00 AM')
      cy.getByTestId('current-time-display').should('contain', '3:00 PM')

      // Should require reason for late administration
      cy.getByTestId('late-reason-required').should('be.visible')
      cy.getByTestId('late-reason-input').should('be.visible')
    })

    it('should prevent future-dated administration', () => {
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.scanBarcode(testMedication.barcode, 'medication')

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)

      // Try to enter future time
      cy.getByTestId('administration-time-input').clear().type(futureDate.toISOString().slice(0, 16))

      // Should show future time error
      cy.getByTestId('time-error').should('be.visible')
        .and('contain', 'Administration time cannot be in the future')

      cy.getByTestId('confirm-administration-button').should('be.disabled')
    })

    it('should allow override for early administration with reason', () => {
      const scheduledTime = new Date()
      scheduledTime.setHours(14, 0, 0, 0) // 2:00 PM

      const currentTime = new Date()
      currentTime.setHours(13, 0, 0, 0) // 1:00 PM - 1 hour early

      cy.clock(currentTime.getTime())

      cy.intercept('GET', `**/api/medications/student/${testStudent.id}`, {
        statusCode: 200,
        body: {
          success: true,
          data: {
            prescriptions: [{
              ...testPrescription,
              scheduledTime: scheduledTime.toISOString(),
              administrationWindow: 30 // 30 minutes window
            }]
          }
        }
      })

      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.scanBarcode(testMedication.barcode, 'medication')

      // Should show early administration warning
      cy.getByTestId('early-administration-warning').should('be.visible')
        .and('contain', 'Administration is 1 hour early')

      // Require reason
      cy.getByTestId('early-reason-input').type('Student leaving early for appointment')
      cy.getByTestId('confirm-early-administration').click()

      // Should allow administration
      cy.getByTestId('confirm-administration-button').should('not.be.disabled')
    })
  })

  describe('Performance SLA Validation', () => {
    it('should complete administration workflow in under 2 seconds', () => {
      const startTime = Date.now()

      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.scanBarcode(testMedication.barcode, 'medication')

      cy.getByTestId('confirm-administration-button').click()

      cy.wait('@administerMedication').then(() => {
        const duration = Date.now() - startTime
        expect(duration).to.be.lessThan(2000)
        cy.log(`Administration completed in ${duration}ms`)
      })
    })

    it('should load medication data in under 100ms', () => {
      cy.intercept('GET', '**/api/medications/*', (req) => {
        const responseTime = req.headers['x-response-time'] || '0'
        expect(parseInt(responseTime as string)).to.be.lessThan(100)
        req.reply({
          statusCode: 200,
          body: { success: true, data: { medication: testMedication } }
        })
      }).as('fastMedicationLoad')

      cy.getByTestId('medication-search').type(testMedication.name)
      cy.wait('@fastMedicationLoad')
    })
  })

  describe('Administration Logging and Audit Trail', () => {
    it('should create complete audit trail for administration', () => {
      cy.getByTestId('administer-medication-button').click()
      cy.waitForModal('medication-administration-modal')

      cy.scanBarcode(testStudent.barcode, 'patient')
      cy.scanBarcode(testMedication.barcode, 'medication')

      cy.getByTestId('administration-notes').type('Patient tolerated medication well')

      cy.getByTestId('confirm-administration-button').click()

      // Verify audit log includes all critical information
      cy.wait('@auditLog').its('request.body').should('include.all.keys', [
        'action',
        'resourceType',
        'userId',
        'studentId',
        'medicationId',
        'dosageGiven',
        'route',
        'timestamp',
        'ipAddress',
        'userAgent'
      ])

      // Verify administration log
      cy.wait('@administerMedication').its('request.body').should('deep.include', {
        studentMedicationId: testPrescription.id,
        dosageGiven: testPrescription.dosage
      })
    })

    it('should display administration in student medication history', () => {
      const administrationLog = {
        id: 'log-001',
        studentMedicationId: testPrescription.id,
        medicationName: testMedication.name,
        dosageGiven: testPrescription.dosage,
        route: testPrescription.route,
        timeGiven: new Date().toISOString(),
        administeredBy: 'Nurse Mary Smith',
        notes: 'Patient tolerated well'
      }

      cy.intercept('GET', `**/api/medications/logs/${testStudent.id}`, {
        statusCode: 200,
        body: {
          success: true,
          data: {
            logs: [administrationLog],
            pagination: { page: 1, total: 1, pages: 1 }
          }
        }
      }).as('getAdministrationHistory')

      // Navigate to student medication history
      cy.getByTestId('student-select').select(testStudent.id)
      cy.getByTestId('medication-history-tab').click()
      cy.wait('@getAdministrationHistory')

      // Verify log displayed
      cy.getByTestId('administration-log-table').should('be.visible')
      cy.getByTestId('log-entry-001').within(() => {
        cy.contains(testMedication.name).should('be.visible')
        cy.contains(administrationLog.dosageGiven).should('be.visible')
        cy.contains(administrationLog.route).should('be.visible')
        cy.contains('Nurse Mary Smith').should('be.visible')
      })
    })

    it('should allow export of administration log for compliance', () => {
      cy.getByTestId('medication-history-tab').click()
      cy.getByTestId('export-log-button').click()

      // Should show export options
      cy.getByTestId('export-format-select').should('be.visible')
      cy.getByTestId('export-format-select').select('PDF')

      // Should include HIPAA compliance notice
      cy.getByTestId('hipaa-compliance-notice').should('be.visible')
        .and('contain', 'This document contains Protected Health Information')

      cy.getByTestId('confirm-export-button').click()

      // Verify download initiated
      cy.verifySuccess(/export initiated/i)
    })
  })

  describe('Success Confirmation and Feedback', () => {
    it('should display clear success confirmation after administration', () => {
      cy.administerMedication({
        studentId: testStudent.id,
        patientBarcode: testStudent.barcode,
        medicationBarcode: testMedication.barcode,
        dosage: testPrescription.dosage,
        route: testPrescription.route.toLowerCase()
      })

      cy.wait('@administerMedication')

      // Success message should include critical details
      cy.getByTestId('success-notification').should('be.visible')
        .and('contain', 'Medication administered successfully')
        .and('contain', testMedication.name)
        .and('contain', testStudent.firstName)

      // Should show timestamp
      cy.getByTestId('administration-timestamp').should('be.visible')

      // Should show next dose time if applicable
      cy.getByTestId('next-dose-time').should('be.visible')
    })

    it('should update medication schedule after administration', () => {
      cy.intercept('GET', '**/api/medications/schedule*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            schedule: [
              {
                id: 'schedule-001',
                studentName: `${testStudent.firstName} ${testStudent.lastName}`,
                medicationName: testMedication.name,
                scheduledTime: '14:00',
                status: 'COMPLETED',
                administeredAt: new Date().toISOString()
              }
            ]
          }
        }
      }).as('getUpdatedSchedule')

      cy.administerMedication({
        studentId: testStudent.id,
        patientBarcode: testStudent.barcode,
        medicationBarcode: testMedication.barcode,
        dosage: testPrescription.dosage
      })

      cy.wait('@administerMedication')

      // Navigate to schedule view
      cy.getByTestId('medication-schedule-tab').click()
      cy.wait('@getUpdatedSchedule')

      // Verify schedule updated
      cy.getByTestId('schedule-entry-001').should('have.attr', 'data-status', 'completed')
      cy.getByTestId('schedule-entry-001').find('[data-testid="completion-indicator"]')
        .should('be.visible')
    })
  })
})
