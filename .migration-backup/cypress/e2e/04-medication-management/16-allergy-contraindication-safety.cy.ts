/// <reference types="cypress" />

/**
 * Medication Management: Allergy & Contraindication Safety Testing
 *
 * CRITICAL SAFETY TEST SUITE - Tests life-critical allergy checking
 *
 * This test suite validates comprehensive allergy and contraindication checking
 * to prevent adverse reactions and medication errors.
 *
 * Safety Features Tested:
 * - Known drug allergy detection and blocking
 * - Cross-allergy identification (e.g., penicillin class allergies)
 * - Drug-drug interaction checking
 * - Drug-condition contraindication checking
 * - Allergy override workflow (requires physician contact)
 * - Severity-based alert levels
 * - Parent/guardian notification for allergic students
 */

describe('Medication Management - Allergy & Contraindication Safety (CRITICAL)', () => {
  const allergicStudent = {
    id: 'student-allergy-001',
    firstName: 'Emily',
    lastName: 'Johnson',
    studentNumber: 'STU-ALLERGY-001',
    allergies: [
      {
        id: 'allergy-001',
        allergen: 'Penicillin',
        severity: 'SEVERE',
        reaction: 'Anaphylaxis',
        verified: true,
        verifiedDate: '2023-01-15',
        verifiedBy: 'Dr. Robert Chen'
      },
      {
        id: 'allergy-002',
        allergen: 'Aspirin',
        severity: 'MODERATE',
        reaction: 'Hives and swelling',
        verified: true,
        verifiedDate: '2023-03-20',
        verifiedBy: 'Dr. Sarah Williams'
      }
    ],
    emergencyContact: {
      name: 'Linda Johnson',
      relationship: 'Mother',
      phone: '555-0123'
    }
  }

  const penicillinMedication = {
    id: 'med-amoxicillin',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    strength: '500mg',
    form: 'capsule',
    drugClass: 'Penicillin',
    ndc: 'AMOX-500-001',
    allergyWarnings: ['Penicillin', 'Beta-lactam antibiotics']
  }

  const aspirinMedication = {
    id: 'med-aspirin',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    strength: '325mg',
    form: 'tablet',
    drugClass: 'NSAID',
    ndc: 'ASA-325-001',
    allergyWarnings: ['Aspirin', 'NSAIDs', 'Salicylates']
  }

  const safeMedication = {
    id: 'med-albuterol',
    name: 'Albuterol Inhaler',
    genericName: 'Albuterol Sulfate',
    strength: '90 mcg/dose',
    form: 'inhaler',
    drugClass: 'Bronchodilator',
    ndc: 'ALBU-90-001',
    allergyWarnings: []
  }

  beforeEach(() => {
    cy.setupMedicationIntercepts()
    cy.setupAuditLogInterception()

    // Mock student with allergies
    cy.intercept('GET', `**/api/students/${allergicStudent.id}`, {
      statusCode: 200,
      body: {
        success: true,
        data: { student: allergicStudent }
      }
    }).as('getAllergicStudent')

    cy.intercept('GET', `**/api/students/${allergicStudent.id}/allergies`, {
      statusCode: 200,
      body: {
        success: true,
        data: { allergies: allergicStudent.allergies }
      }
    }).as('getStudentAllergies')

    cy.login('nurse')
    cy.visit('/medications')
  })

  describe('Known Drug Allergy Detection', () => {
    it('should block prescription of known allergen', () => {
      // Mock allergy check that returns match
      cy.intercept('POST', '**/api/medications/allergy-check', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            hasAllergy: true,
            matchedAllergies: [
              {
                allergen: 'Penicillin',
                severity: 'SEVERE',
                reaction: 'Anaphylaxis',
                medication: penicillinMedication.name
              }
            ],
            canProceed: false,
            requiresOverride: true
          }
        }
      }).as('allergyCheckBlocked')

      // Attempt to prescribe penicillin
      cy.getByTestId('create-prescription-button').click()
      cy.waitForModal('prescription-modal')

      cy.getByTestId('student-select').select(allergicStudent.id)
      cy.wait('@getStudentAllergies')

      cy.getByTestId('medication-select').select(penicillinMedication.id)
      cy.wait('@allergyCheckBlocked')

      // Should display critical allergy alert
      cy.getByTestId('critical-allergy-alert').should('be.visible')
        .and('have.class', 'alert-danger')
        .and('contain', 'CRITICAL: Known Allergy Detected')

      // Should show allergy details
      cy.getByTestId('allergy-details').should('be.visible')
        .and('contain', 'Penicillin')
        .and('contain', 'SEVERE')
        .and('contain', 'Anaphylaxis')

      // Should show verified status
      cy.getByTestId('allergy-verified-indicator').should('be.visible')
        .and('contain', 'Verified by Dr. Robert Chen')

      // Save button should be disabled
      cy.getByTestId('save-prescription-button').should('be.disabled')

      // Should show override option (requires physician contact)
      cy.getByTestId('allergy-override-button').should('be.visible')
        .and('contain', 'Override (Physician Contact Required)')
    })

    it('should detect cross-allergies within drug class', () => {
      const cephalosporin = {
        id: 'med-cephalexin',
        name: 'Cephalexin',
        drugClass: 'Cephalosporin',
        crossAllergies: ['Penicillin'] // Cross-reactive with penicillin
      }

      cy.intercept('POST', '**/api/medications/allergy-check', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            hasAllergy: true,
            matchedAllergies: [
              {
                allergen: 'Penicillin',
                severity: 'SEVERE',
                reaction: 'Anaphylaxis',
                crossReactionWith: cephalosporin.name,
                crossReactionProbability: '10%'
              }
            ],
            canProceed: false,
            requiresOverride: true
          }
        }
      }).as('crossAllergyDetected')

      cy.getByTestId('create-prescription-button').click()
      cy.waitForModal('prescription-modal')

      cy.getByTestId('student-select').select(allergicStudent.id)
      cy.getByTestId('medication-select').select(cephalosporin.id)
      cy.wait('@crossAllergyDetected')

      // Should show cross-allergy warning
      cy.getByTestId('cross-allergy-warning').should('be.visible')
        .and('contain', 'Cross-Allergy Detected')
        .and('contain', 'Penicillin allergy may cross-react with Cephalosporin')
        .and('contain', '10% probability')

      // Should require physician consultation
      cy.getByTestId('physician-consultation-required').should('be.visible')
        .and('contain', 'Physician consultation required before prescribing')

      cy.getByTestId('save-prescription-button').should('be.disabled')
    })

    it('should display multiple allergy warnings when applicable', () => {
      const multiAllergyMedication = {
        id: 'med-multi-allergy',
        name: 'Aspirin/Penicillin Combination',
        allergyWarnings: ['Aspirin', 'Penicillin']
      }

      cy.intercept('POST', '**/api/medications/allergy-check', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            hasAllergy: true,
            matchedAllergies: allergicStudent.allergies,
            canProceed: false,
            requiresOverride: true
          }
        }
      }).as('multipleAllergiesDetected')

      cy.getByTestId('create-prescription-button').click()
      cy.waitForModal('prescription-modal')

      cy.getByTestId('student-select').select(allergicStudent.id)
      cy.getByTestId('medication-select').select(multiAllergyMedication.id)
      cy.wait('@multipleAllergiesDetected')

      // Should show all matched allergies
      cy.getByTestId('allergy-list').within(() => {
        cy.contains('Penicillin - SEVERE - Anaphylaxis').should('be.visible')
        cy.contains('Aspirin - MODERATE - Hives and swelling').should('be.visible')
      })

      // Most severe allergy should be highlighted
      cy.getByTestId('most-severe-allergy').should('contain', 'Penicillin')
        .and('have.class', 'severity-severe')
    })

    it('should allow prescription of safe medication (no allergies)', () => {
      cy.intercept('POST', '**/api/medications/allergy-check', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            hasAllergy: false,
            matchedAllergies: [],
            canProceed: true,
            requiresOverride: false
          }
        }
      }).as('noAllergyDetected')

      cy.createPrescription({
        studentId: allergicStudent.id,
        medicationId: safeMedication.id,
        dosage: '2 puffs',
        frequency: 'As needed',
        route: 'Inhaled',
        prescribedBy: 'Dr. Sarah Williams',
        startDate: '2024-01-01'
      })

      cy.wait('@noAllergyDetected')

      // Should show safety confirmation
      cy.getByTestId('allergy-check-passed').should('be.visible')
        .and('contain', 'No allergies detected')
        .and('have.class', 'alert-success')

      // Should allow prescription
      cy.getByTestId('save-prescription-button').should('not.be.disabled')
    })
  })

  describe('Allergy Override Workflow', () => {
    it('should require physician contact documentation for override', () => {
      cy.intercept('POST', '**/api/medications/allergy-check', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            hasAllergy: true,
            matchedAllergies: [allergicStudent.allergies[1]], // Moderate severity
            canProceed: false,
            requiresOverride: true
          }
        }
      }).as('allergyDetected')

      cy.getByTestId('create-prescription-button').click()
      cy.waitForModal('prescription-modal')

      cy.getByTestId('student-select').select(allergicStudent.id)
      cy.getByTestId('medication-select').select(aspirinMedication.id)
      cy.wait('@allergyDetected')

      // Initiate override
      cy.getByTestId('allergy-override-button').click()

      // Should open override documentation modal
      cy.waitForModal('allergy-override-modal')

      // Should display override requirements
      cy.getByTestId('override-requirements').should('be.visible')
        .and('contain', 'Physician contact required')
        .and('contain', 'Documented medical necessity')
        .and('contain', 'Parent/guardian notification')

      // Required fields
      cy.getByTestId('physician-name').should('be.visible').and('be.required')
      cy.getByTestId('physician-phone').should('be.visible').and('be.required')
      cy.getByTestId('contact-date-time').should('be.visible').and('be.required')
      cy.getByTestId('medical-justification').should('be.visible').and('be.required')
      cy.getByTestId('alternative-medications-considered').should('be.visible')

      // Fill override documentation
      cy.getByTestId('physician-name').type('Dr. Michael Roberts')
      cy.getByTestId('physician-phone').type('555-9876')
      cy.getByTestId('contact-date-time').type('2024-01-15T10:30')
      cy.getByTestId('medical-justification').type('Patient has severe bacterial infection, aspirin desensitization protocol approved')
      cy.getByTestId('alternative-medications-considered').type('Ibuprofen, Acetaminophen - both contraindicated due to other conditions')

      // Parent notification checkbox
      cy.getByTestId('parent-notified-checkbox').check()
      cy.getByTestId('parent-notification-date').type('2024-01-15T10:00')
      cy.getByTestId('parent-notification-method').select('Phone Call')

      // Submit override
      cy.getByTestId('submit-override-button').click()

      // Should create override record
      cy.wait('@assignMedication').its('request.body').should('deep.include', {
        allergyOverride: true,
        overridePhysician: 'Dr. Michael Roberts',
        overrideJustification: 'Patient has severe bacterial infection, aspirin desensitization protocol approved'
      })

      // Should log override in audit trail
      cy.wait('@auditLog').its('request.body').should('deep.include', {
        action: 'ALLERGY_OVERRIDE',
        resourceType: 'MEDICATION'
      })

      cy.verifySuccess(/prescription created with allergy override/i)
    })

    it('should require supervisor approval for SEVERE allergy override', () => {
      cy.intercept('POST', '**/api/medications/allergy-check', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            hasAllergy: true,
            matchedAllergies: [allergicStudent.allergies[0]], // SEVERE
            canProceed: false,
            requiresOverride: true
          }
        }
      }).as('severeAllergyDetected')

      cy.getByTestId('create-prescription-button').click()
      cy.waitForModal('prescription-modal')

      cy.getByTestId('student-select').select(allergicStudent.id)
      cy.getByTestId('medication-select').select(penicillinMedication.id)
      cy.wait('@severeAllergyDetected')

      cy.getByTestId('allergy-override-button').click()
      cy.waitForModal('allergy-override-modal')

      // Should show supervisor approval requirement
      cy.getByTestId('supervisor-approval-required').should('be.visible')
        .and('contain', 'SEVERE allergy override requires supervisor approval')

      cy.getByTestId('supervisor-username').should('be.visible').and('be.required')
      cy.getByTestId('supervisor-password').should('be.visible').and('be.required')

      // Fill all override fields
      cy.getByTestId('physician-name').type('Dr. Emergency Physician')
      cy.getByTestId('physician-phone').type('555-EMERGENCY')
      cy.getByTestId('contact-date-time').type('2024-01-15T10:30')
      cy.getByTestId('medical-justification').type('Life-threatening infection, no alternative antibiotics available')

      // Supervisor approval
      cy.getByTestId('supervisor-username').type('supervisor@whitecross.com')
      cy.getByTestId('supervisor-password').type('supervisor-password')

      // Mock supervisor verification
      cy.intercept('POST', '**/api/auth/verify-supervisor', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            verified: true,
            supervisor: {
              id: 'supervisor-001',
              name: 'Dr. Jane Thompson',
              role: 'NURSING_SUPERVISOR'
            }
          }
        }
      }).as('supervisorVerified')

      cy.getByTestId('submit-override-button').click()
      cy.wait('@supervisorVerified')

      // Should show supervisor approval confirmation
      cy.getByTestId('supervisor-approved-indicator').should('be.visible')
        .and('contain', 'Approved by Dr. Jane Thompson')
    })

    it('should prevent override without required documentation', () => {
      cy.intercept('POST', '**/api/medications/allergy-check', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            hasAllergy: true,
            matchedAllergies: [allergicStudent.allergies[1]],
            canProceed: false,
            requiresOverride: true
          }
        }
      }).as('allergyDetected')

      cy.getByTestId('create-prescription-button').click()
      cy.waitForModal('prescription-modal')

      cy.getByTestId('student-select').select(allergicStudent.id)
      cy.getByTestId('medication-select').select(aspirinMedication.id)

      cy.getByTestId('allergy-override-button').click()
      cy.waitForModal('allergy-override-modal')

      // Try to submit without required fields
      cy.getByTestId('submit-override-button').click()

      // Should show validation errors
      cy.getByTestId('physician-name-error').should('contain', 'Physician name is required')
      cy.getByTestId('physician-phone-error').should('contain', 'Physician contact is required')
      cy.getByTestId('medical-justification-error').should('contain', 'Medical justification is required')

      // Should not proceed
      cy.get('[data-testid="allergy-override-modal"]').should('be.visible')
    })
  })

  describe('Drug-Drug Interaction Checking', () => {
    it('should detect dangerous drug interactions', () => {
      const warfarin = {
        id: 'med-warfarin',
        name: 'Warfarin',
        drugClass: 'Anticoagulant'
      }

      const nsaid = {
        id: 'med-ibuprofen',
        name: 'Ibuprofen',
        drugClass: 'NSAID'
      }

      // Student already on warfarin
      cy.intercept('GET', `**/api/medications/student/${allergicStudent.id}`, {
        statusCode: 200,
        body: {
          success: true,
          data: {
            prescriptions: [
              {
                id: 'prescription-warfarin',
                medicationId: warfarin.id,
                medication: warfarin,
                isActive: true
              }
            ]
          }
        }
      }).as('getCurrentMedications')

      // Check drug interactions
      cy.intercept('POST', '**/api/medications/interaction-check', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            hasInteraction: true,
            interactions: [
              {
                severity: 'MAJOR',
                medication1: warfarin.name,
                medication2: nsaid.name,
                description: 'Increased risk of bleeding',
                clinicalEffects: 'NSAIDs may increase anticoagulant effect of warfarin',
                recommendation: 'Avoid combination. Consider alternative pain reliever.',
                requiresMonitoring: true
              }
            ],
            canProceed: false
          }
        }
      }).as('interactionDetected')

      cy.getByTestId('create-prescription-button').click()
      cy.waitForModal('prescription-modal')

      cy.getByTestId('student-select').select(allergicStudent.id)
      cy.wait('@getCurrentMedications')

      cy.getByTestId('medication-select').select(nsaid.id)
      cy.wait('@interactionDetected')

      // Should show major interaction warning
      cy.getByTestId('drug-interaction-alert').should('be.visible')
        .and('have.class', 'alert-danger')
        .and('contain', 'MAJOR Drug Interaction Detected')

      cy.getByTestId('interaction-details').should('be.visible')
        .and('contain', warfarin.name)
        .and('contain', nsaid.name)
        .and('contain', 'Increased risk of bleeding')

      cy.getByTestId('clinical-recommendation').should('be.visible')
        .and('contain', 'Avoid combination. Consider alternative pain reliever.')

      cy.getByTestId('save-prescription-button').should('be.disabled')
    })

    it('should allow prescription with monitoring for moderate interactions', () => {
      const moderateInteraction = {
        severity: 'MODERATE',
        medication1: 'Medication A',
        medication2: 'Medication B',
        description: 'May increase blood pressure',
        recommendation: 'Monitor blood pressure regularly',
        requiresMonitoring: true,
        canProceedWithMonitoring: true
      }

      cy.intercept('POST', '**/api/medications/interaction-check', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            hasInteraction: true,
            interactions: [moderateInteraction],
            canProceed: true,
            requiresMonitoring: true
          }
        }
      }).as('moderateInteraction')

      cy.getByTestId('create-prescription-button').click()
      cy.waitForModal('prescription-modal')

      cy.getByTestId('student-select').select(allergicStudent.id)
      cy.getByTestId('medication-select').select('med-test')
      cy.wait('@moderateInteraction')

      // Should show moderate warning with monitoring plan
      cy.getByTestId('drug-interaction-alert').should('be.visible')
        .and('have.class', 'alert-warning')
        .and('contain', 'MODERATE Drug Interaction')

      // Should show monitoring requirements
      cy.getByTestId('monitoring-requirements').should('be.visible')
        .and('contain', 'Monitor blood pressure regularly')

      // Should require acknowledgment
      cy.getByTestId('monitoring-plan-checkbox').should('be.visible')
      cy.getByTestId('monitoring-plan-checkbox').check()

      // Should allow prescription with monitoring plan
      cy.getByTestId('save-prescription-button').should('not.be.disabled')
    })
  })

  describe('Parent/Guardian Notification', () => {
    it('should notify parent when prescribing to student with allergies', () => {
      cy.intercept('POST', '**/api/notifications/parent', {
        statusCode: 200,
        body: { success: true }
      }).as('notifyParent')

      cy.createPrescription({
        studentId: allergicStudent.id,
        medicationId: safeMedication.id,
        dosage: '2 puffs',
        frequency: 'As needed',
        route: 'Inhaled',
        prescribedBy: 'Dr. Sarah Williams',
        startDate: '2024-01-01'
      })

      // Should prompt for parent notification
      cy.getByTestId('parent-notification-prompt').should('be.visible')
        .and('contain', 'Student has known allergies')
        .and('contain', allergicStudent.emergencyContact.name)

      cy.getByTestId('notify-parent-checkbox').check()
      cy.getByTestId('notification-method').select('Phone and Email')

      cy.getByTestId('save-prescription-button').click()

      cy.wait('@notifyParent').its('request.body').should('deep.include', {
        studentId: allergicStudent.id,
        parentId: allergicStudent.emergencyContact.id,
        type: 'MEDICATION_PRESCRIBED',
        method: 'Phone and Email',
        allergyWarning: true
      })
    })

    it('should require immediate parent contact for allergy override', () => {
      cy.intercept('POST', '**/api/medications/allergy-check', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            hasAllergy: true,
            matchedAllergies: [allergicStudent.allergies[0]],
            canProceed: false,
            requiresOverride: true
          }
        }
      }).as('allergyDetected')

      cy.getByTestId('create-prescription-button').click()
      cy.waitForModal('prescription-modal')

      cy.getByTestId('student-select').select(allergicStudent.id)
      cy.getByTestId('medication-select').select(penicillinMedication.id)

      cy.getByTestId('allergy-override-button').click()
      cy.waitForModal('allergy-override-modal')

      // Should require immediate parent contact
      cy.getByTestId('immediate-parent-contact-required').should('be.visible')
        .and('contain', 'Parent contact required BEFORE prescribing')

      cy.getByTestId('parent-contact-confirmed-checkbox').should('be.visible').and('be.required')
      cy.getByTestId('parent-consent-documented').should('be.visible').and('be.required')

      // Cannot proceed without parent contact
      cy.getByTestId('parent-contact-confirmed-checkbox').should('not.be.checked')
      cy.getByTestId('submit-override-button').should('be.disabled')
    })
  })

  describe('Allergy Warning Display', () => {
    it('should display prominent allergy warnings on medication administration', () => {
      const prescriptionWithAllergy = {
        id: 'prescription-001',
        studentId: allergicStudent.id,
        medicationId: safeMedication.id,
        isActive: true,
        studentHasAllergies: true
      }

      cy.intercept('GET', `**/api/medications/student/${allergicStudent.id}`, {
        statusCode: 200,
        body: {
          success: true,
          data: {
            prescriptions: [prescriptionWithAllergy]
          }
        }
      })

      // Navigate to administration
      cy.visit(`/medications/administer/${prescriptionWithAllergy.id}`)
      cy.wait('@getStudentAllergies')

      // Should display allergy banner
      cy.getByTestId('student-allergy-banner').should('be.visible')
        .and('have.class', 'bg-red-100')
        .and('contain', 'ALLERGY ALERT')

      // Should list all allergies
      cy.getByTestId('allergy-list').within(() => {
        cy.contains('Penicillin - SEVERE').should('be.visible')
        cy.contains('Aspirin - MODERATE').should('be.visible')
      })

      // Should require acknowledgment before administration
      cy.getByTestId('allergy-acknowledgment-checkbox').should('be.visible')
      cy.getByTestId('allergy-acknowledgment-checkbox').should('not.be.checked')
      cy.getByTestId('confirm-administration-button').should('be.disabled')

      // After acknowledgment, can proceed
      cy.getByTestId('allergy-acknowledgment-checkbox').check()
      cy.getByTestId('confirm-administration-button').should('not.be.disabled')
    })

    it('should highlight allergies relevant to current medication', () => {
      // Student has both Penicillin and Aspirin allergy
      // Administering safe medication, but should still show allergies

      cy.visit(`/medications/student/${allergicStudent.id}`)
      cy.wait('@getStudentAllergies')

      // Penicillin allergy should be present but not highlighted
      cy.getByTestId('allergy-penicillin').should('be.visible')
        .and('not.have.class', 'highlighted')

      // When selecting penicillin medication
      cy.getByTestId('medication-select').select(penicillinMedication.id)

      // Penicillin allergy should now be highlighted
      cy.getByTestId('allergy-penicillin').should('have.class', 'bg-red-200')
        .and('have.class', 'border-red-600')
        .and('have.attr', 'data-relevant', 'true')
    })
  })

  describe('Audit Trail for Allergy-Related Events', () => {
    it('should log allergy check in audit trail', () => {
      cy.getByTestId('create-prescription-button').click()
      cy.waitForModal('prescription-modal')

      cy.getByTestId('student-select').select(allergicStudent.id)
      cy.wait('@getStudentAllergies')

      cy.getByTestId('medication-select').select(safeMedication.id)

      // Should log allergy check
      cy.wait('@auditLog').its('request.body').should('deep.include', {
        action: 'ALLERGY_CHECK',
        resourceType: 'MEDICATION',
        studentId: allergicStudent.id,
        medicationId: safeMedication.id
      })
    })

    it('should create detailed audit trail for allergy override', () => {
      cy.intercept('POST', '**/api/medications/allergy-check', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            hasAllergy: true,
            matchedAllergies: [allergicStudent.allergies[1]],
            canProceed: false,
            requiresOverride: true
          }
        }
      })

      cy.getByTestId('create-prescription-button').click()
      cy.waitForModal('prescription-modal')

      cy.getByTestId('student-select').select(allergicStudent.id)
      cy.getByTestId('medication-select').select(aspirinMedication.id)

      cy.getByTestId('allergy-override-button').click()
      cy.waitForModal('allergy-override-modal')

      // Complete override documentation
      cy.getByTestId('physician-name').type('Dr. Override Physician')
      cy.getByTestId('physician-phone').type('555-OVERRIDE')
      cy.getByTestId('contact-date-time').type('2024-01-15T10:30')
      cy.getByTestId('medical-justification').type('Medical necessity documented')
      cy.getByTestId('parent-notified-checkbox').check()

      cy.getByTestId('submit-override-button').click()

      // Should log comprehensive override information
      cy.wait('@auditLog').its('request.body').should('include.all.keys', [
        'action',
        'resourceType',
        'studentId',
        'medicationId',
        'allergyOverridden',
        'overridePhysician',
        'overrideJustification',
        'parentNotified',
        'timestamp'
      ])
    })
  })
})
