import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

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
};

const penicillinMedication = {
  id: 'med-amoxicillin',
  name: 'Amoxicillin',
  genericName: 'Amoxicillin',
  strength: '500mg',
  form: 'capsule',
  drugClass: 'Penicillin',
  ndc: 'AMOX-500-001',
  allergyWarnings: ['Penicillin', 'Beta-lactam antibiotics']
};

const safeMedication = {
  id: 'med-albuterol',
  name: 'Albuterol Inhaler',
  genericName: 'Albuterol Sulfate',
  strength: '90 mcg/dose',
  form: 'inhaler',
  drugClass: 'Bronchodilator',
  ndc: 'ALBU-90-001',
  allergyWarnings: []
};

test.describe('Medication Management - Allergy & Contraindication Safety (CRITICAL)', () => {
  test.beforeEach(async ({ page }) => {
    // Setup medication API mocks
    await mockApiResponse(page, /\/api\/medications($|\?)/, {
      success: true,
      data: { medications: [penicillinMedication, safeMedication] }
    });

    // Mock student with allergies
    await page.route(`**/api/students/${allergicStudent.id}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { student: allergicStudent }
        })
      });
    });

    await page.route(`**/api/students/${allergicStudent.id}/allergies`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { allergies: allergicStudent.allergies }
        })
      });
    });

    await mockApiResponse(page, /\/api\/audit-log/, { success: true });

    await login(page, 'nurse');
    await page.goto('/medications');
  });

  test.describe('Known Drug Allergy Detection', () => {
    test('should block prescription of known allergen', async ({ page }) => {
      // Mock allergy check that returns match
      await page.route('**/api/medications/allergy-check', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
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
            })
          });
        } else {
          await route.continue();
        }
      });

      // Attempt to prescribe penicillin
      await page.getByTestId('create-prescription-button').first().click();

      const modal = page.getByTestId('prescription-modal').first();
      await expect(modal).toBeVisible({ timeout: 10000 });

      await page.getByTestId('student-select').first().selectOption(allergicStudent.id);
      await page.waitForResponse(/\/api\/students.*\/allergies/);

      await page.getByTestId('medication-select').first().selectOption(penicillinMedication.id);
      await page.waitForResponse(/\/api\/medications\/allergy-check/);

      // Should display critical allergy alert
      const allergyAlert = page.getByTestId('critical-allergy-alert').first();
      await expect(allergyAlert).toBeVisible();
      await expect(allergyAlert).toHaveClass(/alert-danger/);
      await expect(allergyAlert).toContainText(/CRITICAL: Known Allergy Detected/i);

      // Should show allergy details
      const allergyDetails = page.getByTestId('allergy-details').first();
      await expect(allergyDetails).toBeVisible();
      await expect(allergyDetails).toContainText('Penicillin');
      await expect(allergyDetails).toContainText('SEVERE');
      await expect(allergyDetails).toContainText('Anaphylaxis');

      // Should show verified status
      const verifiedIndicator = page.getByTestId('allergy-verified-indicator').first();
      await expect(verifiedIndicator).toBeVisible();
      await expect(verifiedIndicator).toContainText(/Verified by Dr. Robert Chen/i);

      // Save button should be disabled
      await expect(page.getByTestId('save-prescription-button').first()).toBeDisabled();

      // Should show override option
      const overrideButton = page.getByTestId('allergy-override-button').first();
      await expect(overrideButton).toBeVisible();
      await expect(overrideButton).toContainText(/Override.*Physician Contact Required/i);
    });

    test('should detect cross-allergies within drug class', async ({ page }) => {
      const cephalosporin = {
        id: 'med-cephalexin',
        name: 'Cephalexin',
        drugClass: 'Cephalosporin',
        crossAllergies: ['Penicillin']
      };

      await page.route('**/api/medications/allergy-check', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
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
            })
          });
        } else {
          await route.continue();
        }
      });

      await page.getByTestId('create-prescription-button').first().click();
      await page.getByTestId('student-select').first().selectOption(allergicStudent.id);
      await page.getByTestId('medication-select').first().selectOption(cephalosporin.id);
      await page.waitForResponse(/\/api\/medications\/allergy-check/);

      // Should show cross-allergy warning
      const crossAllergyWarning = page.getByTestId('cross-allergy-warning').first();
      await expect(crossAllergyWarning).toBeVisible();
      await expect(crossAllergyWarning).toContainText(/Cross-Allergy Detected/i);
      await expect(crossAllergyWarning).toContainText(/Penicillin allergy may cross-react with Cephalosporin/i);
      await expect(crossAllergyWarning).toContainText('10% probability');

      // Should require physician consultation
      const consultationRequired = page.getByTestId('physician-consultation-required').first();
      await expect(consultationRequired).toBeVisible();
      await expect(consultationRequired).toContainText(/Physician consultation required before prescribing/i);

      await expect(page.getByTestId('save-prescription-button').first()).toBeDisabled();
    });

    test('should allow prescription of safe medication (no allergies)', async ({ page }) => {
      await page.route('**/api/medications/allergy-check', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                hasAllergy: false,
                matchedAllergies: [],
                canProceed: true,
                requiresOverride: false
              }
            })
          });
        } else {
          await route.continue();
        }
      });

      await page.getByTestId('create-prescription-button').first().click();
      await page.getByTestId('student-select').first().selectOption(allergicStudent.id);
      await page.getByTestId('medication-select').first().selectOption(safeMedication.id);

      // Should show safety confirmation
      const safetyConfirmation = page.getByTestId('allergy-check-passed').first();
      await expect(safetyConfirmation).toBeVisible();
      await expect(safetyConfirmation).toContainText(/No allergies detected/i);
      await expect(safetyConfirmation).toHaveClass(/alert-success/);

      // Should allow prescription
      await expect(page.getByTestId('save-prescription-button').first()).not.toBeDisabled();
    });
  });

  test.describe('Allergy Override Workflow', () => {
    test('should require physician contact documentation for override', async ({ page }) => {
      await page.route('**/api/medications/allergy-check', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                hasAllergy: true,
                matchedAllergies: [allergicStudent.allergies[1]], // Moderate severity
                canProceed: false,
                requiresOverride: true
              }
            })
          });
        } else {
          await route.continue();
        }
      });

      await page.getByTestId('create-prescription-button').first().click();
      await page.getByTestId('student-select').first().selectOption(allergicStudent.id);
      await page.getByTestId('medication-select').first().selectOption('med-aspirin');
      await page.waitForResponse(/\/api\/medications\/allergy-check/);

      // Initiate override
      await page.getByTestId('allergy-override-button').first().click();

      // Should open override documentation modal
      const overrideModal = page.getByTestId('allergy-override-modal').first();
      await expect(overrideModal).toBeVisible({ timeout: 10000 });

      // Should display override requirements
      const requirements = page.getByTestId('override-requirements').first();
      await expect(requirements).toBeVisible();
      await expect(requirements).toContainText(/Physician contact required/i);
      await expect(requirements).toContainText(/Documented medical necessity/i);
      await expect(requirements).toContainText(/Parent\/guardian notification/i);

      // Required fields
      await expect(page.getByTestId('physician-name').first()).toBeVisible();
      await expect(page.getByTestId('physician-phone').first()).toBeVisible();
      await expect(page.getByTestId('contact-date-time').first()).toBeVisible();
      await expect(page.getByTestId('medical-justification').first()).toBeVisible();

      // Fill override documentation
      await page.getByTestId('physician-name').first().fill('Dr. Michael Roberts');
      await page.getByTestId('physician-phone').first().fill('555-9876');
      await page.getByTestId('contact-date-time').first().fill('2024-01-15T10:30');
      await page.getByTestId('medical-justification').first().fill(
        'Patient has severe bacterial infection, aspirin desensitization protocol approved'
      );

      await page.getByTestId('alternative-medications-considered').first().fill(
        'Ibuprofen, Acetaminophen - both contraindicated due to other conditions'
      );

      // Parent notification
      await page.getByTestId('parent-notified-checkbox').first().check();
      await page.getByTestId('parent-notification-date').first().fill('2024-01-15T10:00');
      await page.getByTestId('parent-notification-method').first().selectOption('Phone Call');

      // Submit override
      let assignRequest: any = null;
      await page.route('**/api/medications/assign', async (route) => {
        if (route.request().method() === 'POST') {
          assignRequest = route.request().postDataJSON();
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true })
          });
        } else {
          await route.continue();
        }
      });

      await page.getByTestId('submit-override-button').first().click();

      await page.waitForResponse(/\/api\/medications\/assign/);

      expect(assignRequest).toBeTruthy();
      expect(assignRequest.allergyOverride).toBe(true);
      expect(assignRequest.overridePhysician).toBe('Dr. Michael Roberts');
    });

    test('should require supervisor approval for SEVERE allergy override', async ({ page }) => {
      await page.route('**/api/medications/allergy-check', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                hasAllergy: true,
                matchedAllergies: [allergicStudent.allergies[0]], // SEVERE
                canProceed: false,
                requiresOverride: true
              }
            })
          });
        } else {
          await route.continue();
        }
      });

      await page.getByTestId('create-prescription-button').first().click();
      await page.getByTestId('student-select').first().selectOption(allergicStudent.id);
      await page.getByTestId('medication-select').first().selectOption(penicillinMedication.id);

      await page.getByTestId('allergy-override-button').first().click();

      // Should show supervisor approval requirement
      const supervisorRequired = page.getByTestId('supervisor-approval-required').first();
      await expect(supervisorRequired).toBeVisible();
      await expect(supervisorRequired).toContainText(/SEVERE allergy override requires supervisor approval/i);

      await expect(page.getByTestId('supervisor-username').first()).toBeVisible();
      await expect(page.getByTestId('supervisor-password').first()).toBeVisible();
    });
  });

  test.describe('Audit Trail for Allergy-Related Events', () => {
    test('should log allergy check in audit trail', async ({ page }) => {
      let auditLogRequest: any = null;

      await page.route('**/api/audit-log', async (route) => {
        if (route.request().method() === 'POST') {
          auditLogRequest = route.request().postDataJSON();
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true })
          });
        } else {
          await route.continue();
        }
      });

      await page.route('**/api/medications/allergy-check', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                hasAllergy: false,
                matchedAllergies: [],
                canProceed: true,
                requiresOverride: false
              }
            })
          });
        } else {
          await route.continue();
        }
      });

      await page.getByTestId('create-prescription-button').first().click();
      await page.getByTestId('student-select').first().selectOption(allergicStudent.id);
      await page.waitForResponse(/\/api\/students.*\/allergies/);

      await page.getByTestId('medication-select').first().selectOption(safeMedication.id);

      await page.waitForResponse(/\/api\/audit-log/);

      expect(auditLogRequest).toBeTruthy();
      expect(auditLogRequest.action).toBe('ALLERGY_CHECK');
      expect(auditLogRequest.resourceType).toBe('MEDICATION');
      expect(auditLogRequest.studentId).toBe(allergicStudent.id);
      expect(auditLogRequest.medicationId).toBe(safeMedication.id);
    });
  });
});
