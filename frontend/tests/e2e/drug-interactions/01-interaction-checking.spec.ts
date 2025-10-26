/**
 * Drug Interaction Checker E2E Tests
 * Tests real-time drug interaction detection and clinical decision support
 */

import { test, expect, Page } from '@playwright/test';

// Helper to login as nurse
async function loginAsNurse(page: Page) {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('nurse@whitecross.health');
  await page.getByTestId('password-input').fill('nurse123');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/\/dashboard/);
}

// Helper to navigate to student medication page
async function navigateToStudentMedications(page: Page, studentId: string) {
  await page.goto(`/students/${studentId}/medications`);
  await expect(page.getByRole('heading', { name: /medications/i })).toBeVisible();
}

test.describe('Drug Interaction Checker - Real-Time Detection', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsNurse(page);
  });

  test('should detect critical drug interaction when adding new medication', async ({ page }) => {
    await navigateToStudentMedications(page, 'student-123');

    // Student already has Warfarin
    await expect(page.getByText(/warfarin/i)).toBeVisible();

    // Try to add Aspirin (critical interaction with Warfarin)
    await page.getByRole('button', { name: /add medication/i }).click();

    await page.getByLabel(/medication name/i).fill('Aspirin');
    await page.getByLabel(/dosage/i).fill('325mg');
    await page.getByLabel(/frequency/i).selectOption('twice daily');

    // Trigger interaction check (blur event or button)
    await page.getByTestId('check-interactions-button').click();

    // Wait for interaction check to complete
    await expect(page.getByTestId('interaction-check-loading')).toBeVisible();
    await expect(page.getByTestId('interaction-check-loading')).not.toBeVisible();

    // Critical interaction warning should appear
    await expect(page.getByTestId('interaction-warning')).toBeVisible();
    await expect(page.getByTestId('interaction-severity')).toHaveText('CRITICAL');

    // Should display interaction details
    await expect(
      page.getByText(/aspirin and warfarin significantly increases bleeding risk/i)
    ).toBeVisible();

    // Should show clinical recommendations
    await expect(
      page.getByText(/avoid concurrent use if possible/i)
    ).toBeVisible();
    await expect(
      page.getByText(/closely monitor INR/i)
    ).toBeVisible();

    // Submit button should be disabled or require confirmation
    const submitButton = page.getByRole('button', { name: /add medication/i });
    await expect(submitButton).toBeDisabled();

    // Should have override option for authorized users
    await expect(
      page.getByRole('button', { name: /override with physician approval/i })
    ).toBeVisible();
  });

  test('should allow medication addition when no interactions found', async ({ page }) => {
    await navigateToStudentMedications(page, 'student-456');

    // Student has Methylphenidate (ADHD medication)
    await expect(page.getByText(/methylphenidate/i)).toBeVisible();

    // Add Albuterol inhaler (no significant interaction)
    await page.getByRole('button', { name: /add medication/i }).click();

    await page.getByLabel(/medication name/i).fill('Albuterol');
    await page.getByLabel(/dosage/i).fill('90mcg, 2 puffs');
    await page.getByLabel(/frequency/i).selectOption('as needed');

    // Check interactions
    await page.getByTestId('check-interactions-button').click();
    await expect(page.getByTestId('interaction-check-loading')).not.toBeVisible();

    // No interaction warning
    await expect(page.getByTestId('no-interactions-badge')).toBeVisible();
    await expect(page.getByText(/no significant interactions detected/i)).toBeVisible();

    // Submit button should be enabled
    const submitButton = page.getByRole('button', { name: /add medication/i });
    await expect(submitButton).not.toBeDisabled();

    // Submit successfully
    await submitButton.click();

    await expect(page.getByText(/medication added successfully/i)).toBeVisible();
    await expect(page.getByText(/albuterol/i)).toBeVisible();
  });

  test('should show multiple interaction warnings for multiple conflicts', async ({ page }) => {
    await navigateToStudentMedications(page, 'student-789');

    // Student already has Warfarin
    await expect(page.getByText(/warfarin/i)).toBeVisible();

    // Try to add both Aspirin and Ibuprofen (both interact with Warfarin)
    await page.getByRole('button', { name: /add medication/i }).click();

    await page.getByLabel(/medication name/i).fill('Aspirin');
    await page.getByLabel(/dosage/i).fill('325mg');
    await page.getByLabel(/frequency/i).selectOption('twice daily');
    await page.getByTestId('check-interactions-button').click();

    // Should show interaction count
    await expect(page.getByTestId('interaction-count')).toHaveText('2 interactions found');

    // Should list all interactions
    const interactionList = page.getByTestId('interaction-list');
    await expect(interactionList.getByText(/aspirin \+ warfarin/i)).toBeVisible();
    await expect(interactionList.getByText(/aspirin \+ ibuprofen/i)).toBeVisible();

    // Should show highest severity
    await expect(page.getByTestId('highest-severity')).toHaveText('CRITICAL');

    // Expandable details for each interaction
    await page.getByTestId('interaction-item-0').click();
    await expect(page.getByText(/mechanism of action/i)).toBeVisible();
    await expect(page.getByText(/clinical effects/i)).toBeVisible();
    await expect(page.getByText(/recommendations/i)).toBeVisible();
  });

  test('should provide severity-based visual indicators', async ({ page }) => {
    await navigateToStudentMedications(page, 'student-123');

    await page.getByRole('button', { name: /add medication/i }).click();
    await page.getByLabel(/medication name/i).fill('Aspirin');
    await page.getByTestId('check-interactions-button').click();

    // Critical severity - red warning
    const criticalWarning = page.getByTestId('interaction-warning-critical');
    await expect(criticalWarning).toBeVisible();
    await expect(criticalWarning).toHaveClass(/bg-red-100|bg-danger/);

    // Should have warning icon
    await expect(page.getByTestId('critical-icon')).toBeVisible();

    // Should have bold/prominent text
    const severityText = page.getByTestId('interaction-severity');
    await expect(severityText).toHaveClass(/font-bold|text-red/);
  });

  test('should allow physician override with documentation', async ({ page }) => {
    await navigateToStudentMedications(page, 'student-123');

    await page.getByRole('button', { name: /add medication/i }).click();
    await page.getByLabel(/medication name/i).fill('Aspirin');
    await page.getByLabel(/dosage/i).fill('81mg'); // Low dose
    await page.getByTestId('check-interactions-button').click();

    // Critical interaction warning appears
    await expect(page.getByTestId('interaction-warning')).toBeVisible();

    // Click override button
    await page.getByRole('button', { name: /override with physician approval/i }).click();

    // Override modal should open
    await expect(page.getByRole('dialog', { name: /physician override/i })).toBeVisible();

    // Require physician information
    await page.getByLabel(/physician name/i).fill('Dr. Sarah Johnson');
    await page.getByLabel(/physician npi/i).fill('1234567890');
    await page.getByLabel(/override reason/i).fill(
      'Low-dose aspirin for cardioprotection. Benefits outweigh risks. Will monitor INR closely.'
    );

    // Require contact information
    await page.getByLabel(/physician phone/i).fill('555-123-4567');

    // Submit override
    await page.getByRole('button', { name: /confirm override/i }).click();

    // Medication should be added with override flag
    await expect(page.getByText(/medication added with physician override/i)).toBeVisible();

    // Override should be documented in medication record
    await expect(page.getByTestId('override-badge')).toBeVisible();
    await expect(page.getByTestId('override-badge')).toHaveText(/physician override/i);
  });

  test('should integrate with medication administration workflow', async ({ page }) => {
    await navigateToStudentMedications(page, 'student-123');

    // Navigate to medication administration
    await page.getByTestId('medication-warfarin-123').click();
    await page.getByRole('button', { name: /administer/i }).click();

    // Administration form should show current interactions
    await expect(page.getByTestId('active-interactions-panel')).toBeVisible();
    await expect(
      page.getByText(/this medication has 1 active interaction/i)
    ).toBeVisible();

    // Should require nurse acknowledgment before administration
    await expect(
      page.getByLabel(/i acknowledge awareness of active drug interactions/i)
    ).toBeVisible();

    // Try to submit without acknowledgment
    await page.getByRole('button', { name: /administer medication/i }).click();

    await expect(
      page.getByText(/you must acknowledge drug interaction warnings/i)
    ).toBeVisible();

    // Acknowledge and submit
    await page.getByLabel(/i acknowledge awareness/i).check();
    await page.getByRole('button', { name: /administer medication/i }).click();

    // Should log interaction acknowledgment in audit trail
    await expect(page.getByText(/medication administered/i)).toBeVisible();
  });

  test('should perform automatic interaction check on profile load', async ({ page }) => {
    await navigateToStudentMedications(page, 'student-with-multiple-meds');

    // Loading indicator while checking all interactions
    await expect(page.getByTestId('checking-interactions-loader')).toBeVisible();

    // Wait for check to complete
    await expect(page.getByTestId('checking-interactions-loader')).not.toBeVisible();

    // Should display interaction summary
    await expect(page.getByTestId('interaction-summary-card')).toBeVisible();
    await expect(page.getByText(/3 active medications/i)).toBeVisible();
    await expect(page.getByText(/1 interaction detected/i)).toBeVisible();

    // Should show alert badge on affected medications
    await expect(page.getByTestId('medication-interaction-badge')).toHaveCount(2);
  });

  test('should provide dose-specific interaction warnings', async ({ page }) => {
    await navigateToStudentMedications(page, 'student-123');

    await page.getByRole('button', { name: /add medication/i }).click();
    await page.getByLabel(/medication name/i).fill('Ibuprofen');

    // Low dose - minimal interaction
    await page.getByLabel(/dosage/i).fill('200mg');
    await page.getByLabel(/frequency/i).selectOption('as needed');
    await page.getByTestId('check-interactions-button').click();

    await expect(page.getByTestId('interaction-severity')).toHaveText('LOW');
    await expect(
      page.getByText(/take aspirin at least 2 hours before ibuprofen/i)
    ).toBeVisible();

    // Change to high dose - higher interaction risk
    await page.getByLabel(/dosage/i).fill('800mg');
    await page.getByLabel(/frequency/i).selectOption('three times daily');
    await page.getByTestId('check-interactions-button').click();

    await expect(page.getByTestId('interaction-severity')).toHaveText('HIGH');
    await expect(
      page.getByText(/consider alternative NSAID if long-term use needed/i)
    ).toBeVisible();
  });

  test('should display drug reference information', async ({ page }) => {
    await navigateToStudentMedications(page, 'student-123');

    // Access drug reference
    await page.getByTestId('drug-reference-button').click();

    // Search for medication
    await page.getByLabel(/search drug database/i).fill('Warfarin');
    await page.getByRole('button', { name: /search/i }).click();

    // Should display comprehensive drug information
    await expect(page.getByRole('heading', { name: /warfarin/i })).toBeVisible();

    // Brand names
    await expect(page.getByText(/coumadin/i)).toBeVisible();

    // Dosage forms
    await expect(page.getByText(/tablet/i)).toBeVisible();

    // Common doses
    await expect(page.getByText(/1mg, 2mg, 2.5mg, 5mg, 10mg/i)).toBeVisible();

    // Interactions section
    await page.getByRole('tab', { name: /interactions/i }).click();
    await expect(page.getByText(/aspirin/i)).toBeVisible();
    await expect(page.getByText(/nsaids/i)).toBeVisible();

    // Side effects section
    await page.getByRole('tab', { name: /side effects/i }).click();
    await expect(page.getByText(/bleeding/i)).toBeVisible();

    // Contraindications
    await page.getByRole('tab', { name: /contraindications/i }).click();
    await expect(page.getByText(/pregnancy/i)).toBeVisible();
  });

  test('should audit all interaction checks', async ({ page }) => {
    // Track audit log API calls
    const auditLogs: any[] = [];
    await page.route('**/api/audit-logs', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();
        auditLogs.push(postData);
      }
      await route.continue();
    });

    await navigateToStudentMedications(page, 'student-123');

    await page.getByRole('button', { name: /add medication/i }).click();
    await page.getByLabel(/medication name/i).fill('Aspirin');
    await page.getByTestId('check-interactions-button').click();

    await expect(page.getByTestId('interaction-warning')).toBeVisible();

    // Verify audit logs
    await page.waitForTimeout(1000); // Allow audit logs to be sent

    expect(auditLogs.length).toBeGreaterThan(0);

    const interactionCheckLog = auditLogs.find(
      log => log.action.includes('DRUG_INTERACTION_CHECK')
    );
    expect(interactionCheckLog).toBeDefined();
    expect(interactionCheckLog.metadata).toHaveProperty('studentId');
    expect(interactionCheckLog.metadata).toHaveProperty('medicationsChecked');
    expect(interactionCheckLog.metadata).toHaveProperty('interactionsFound');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Simulate API error
    await page.route('**/api/drug-interactions/check', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: { message: 'Interaction database temporarily unavailable' },
        }),
      });
    });

    await navigateToStudentMedications(page, 'student-123');

    await page.getByRole('button', { name: /add medication/i }).click();
    await page.getByLabel(/medication name/i).fill('Aspirin');
    await page.getByTestId('check-interactions-button').click();

    // Should show error message
    await expect(
      page.getByText(/unable to check drug interactions at this time/i)
    ).toBeVisible();

    // Should disable submission for safety
    await expect(page.getByRole('button', { name: /add medication/i })).toBeDisabled();

    // Should provide retry option
    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();

    // Should suggest manual verification
    await expect(
      page.getByText(/manually verify interactions before administering/i)
    ).toBeVisible();
  });

  test('should work offline with cached interaction data', async ({ page, context }) => {
    await navigateToStudentMedications(page, 'student-123');

    // Load interaction database initially
    await page.getByTestId('drug-reference-button').click();
    await page.waitForLoadState('networkidle');

    // Go offline
    await context.setOffline(true);

    // Try to check interactions
    await page.getByRole('button', { name: /add medication/i }).click();
    await page.getByLabel(/medication name/i).fill('Aspirin');
    await page.getByTestId('check-interactions-button').click();

    // Should use cached data
    await expect(page.getByTestId('offline-check-badge')).toBeVisible();
    await expect(page.getByText(/checked using offline database/i)).toBeVisible();

    // Should still show interaction warnings
    await expect(page.getByTestId('interaction-warning')).toBeVisible();

    // Should note that data may not be current
    await expect(
      page.getByText(/offline mode: database last updated/i)
    ).toBeVisible();
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    await navigateToStudentMedications(page, 'student-123');

    await page.getByRole('button', { name: /add medication/i }).click();
    await page.getByLabel(/medication name/i).fill('Aspirin');

    // Use keyboard to trigger interaction check
    await page.keyboard.press('Tab'); // Move to check button
    await page.keyboard.press('Enter');

    await expect(page.getByTestId('interaction-warning')).toBeVisible();

    // Navigate through interaction details with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // Expand first interaction

    await expect(page.getByText(/mechanism of action/i)).toBeVisible();

    // Close with keyboard
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should support screen readers with ARIA labels', async ({ page }) => {
    await navigateToStudentMedications(page, 'student-123');

    await page.getByRole('button', { name: /add medication/i }).click();
    await page.getByLabel(/medication name/i).fill('Aspirin');
    await page.getByTestId('check-interactions-button').click();

    // Check ARIA attributes for interaction warning
    const warning = page.getByTestId('interaction-warning');
    await expect(warning).toHaveAttribute('role', 'alert');
    await expect(warning).toHaveAttribute('aria-live', 'assertive');

    // Severity should have semantic meaning
    const severity = page.getByTestId('interaction-severity');
    await expect(severity).toHaveAttribute('aria-label', 'Critical severity interaction');

    // Expandable sections should have proper ARIA
    const expandButton = page.getByTestId('expand-interaction-details');
    await expect(expandButton).toHaveAttribute('aria-expanded', 'false');

    await expandButton.click();
    await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('Drug Interaction Checker - Performance', () => {
  test('should check interactions within 2 seconds', async ({ page }) => {
    await loginAsNurse(page);
    await navigateToStudentMedications(page, 'student-with-10-medications');

    const startTime = Date.now();

    // Automatic check on page load
    await expect(page.getByTestId('interaction-summary-card')).toBeVisible();

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(2000); // 2 seconds maximum
  });

  test('should handle large medication lists efficiently', async ({ page }) => {
    await loginAsNurse(page);

    // Student with 25 active medications
    await navigateToStudentMedications(page, 'student-complex-case');

    // Should still complete interaction check
    await expect(page.getByTestId('checking-interactions-loader')).toBeVisible();
    await expect(page.getByTestId('checking-interactions-loader')).not.toBeVisible({
      timeout: 5000,
    });

    // Should display results
    await expect(page.getByTestId('interaction-summary-card')).toBeVisible();

    // Should show interaction count
    const interactionCount = await page.getByTestId('interaction-count').textContent();
    expect(interactionCount).toBeTruthy();
  });
});
