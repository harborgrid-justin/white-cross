/**
 * Medication Prescription E2E Tests
 * Tests medication prescription and administration workflows
 */

import { test, expect } from '@playwright/test';

test.describe('Medication Prescription Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as nurse/doctor
    await page.goto('/login');
    await page.fill('input[name="email"]', 'nurse@school.edu');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should prescribe new medication for student', async ({ page }) => {
    // Navigate to student medications
    await page.goto('/students/student-001/medications');

    // Click prescribe medication
    await page.click('button:has-text("Prescribe Medication")');

    // Verify prescription form modal
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/prescribe medication/i)).toBeVisible();

    // Fill medication details
    await page.fill('input[name="medicationName"]', 'Ibuprofen');
    await page.fill('input[name="dosage"]', '200mg');
    await page.selectOption('select[name="frequency"]', 'twice-daily');
    await page.fill('input[name="startDate"]', '2025-11-07');
    await page.fill('input[name="endDate"]', '2025-11-14');
    await page.fill('textarea[name="instructions"]', 'Take with food');

    // Fill prescriber information
    await page.fill('input[name="prescribedBy"]', 'Dr. Johnson');
    await page.fill('input[name="prescriptionNumber"]', 'RX-12345');

    // Check for interactions
    await page.click('button:has-text("Check Interactions")');

    // Wait for interaction check
    await page.waitForResponse('/api/medications/check-interactions');

    // If no interactions, submit
    await page.click('button:has-text("Prescribe")');

    // Verify success
    await expect(page.getByText(/medication prescribed successfully/i)).toBeVisible();

    // Verify medication appears in list
    await expect(page.getByText('Ibuprofen 200mg')).toBeVisible();
  });

  test('should show interaction warning and handle it', async ({ page }) => {
    await page.goto('/students/student-001/medications');
    await page.click('button:has-text("Prescribe Medication")');

    // Fill medication that has known interaction
    await page.fill('input[name="medicationName"]', 'Aspirin');
    await page.fill('input[name="dosage"]', '100mg');

    // Check interactions
    await page.click('button:has-text("Check Interactions")');

    // Verify interaction warning
    await expect(
      page.getByText(/potential interaction detected/i)
    ).toBeVisible();
    await expect(page.getByText(/moderate severity/i)).toBeVisible();

    // Can proceed with caution
    await page.check('input[name="acknowledgeInteraction"]');
    await page.click('button:has-text("Prescribe Anyway")');

    // Verify requires additional confirmation
    await expect(page.getByText(/interaction acknowledged/i)).toBeVisible();
  });

  test('should administer medication to student', async ({ page }) => {
    await page.goto('/students/student-001/medications');

    // Click administer button on active medication
    await page.click('button[aria-label*="Administer"]').first();

    // Verify administration confirmation modal
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/confirm administration/i)).toBeVisible();

    // Verify medication details
    await expect(page.getByText('Ibuprofen 200mg')).toBeVisible();

    // Add administration notes
    await page.fill('textarea[name="notes"]', 'Administered after lunch');

    // Confirm administration
    await page.click('button:has-text("Confirm Administration")');

    // Verify success
    await expect(page.getByText(/medication administered successfully/i)).toBeVisible();

    // Verify administration recorded in history
    await page.click('button:has-text("History")');
    await expect(page.getByText(/administered/i)).toBeVisible();
    await expect(page.getByText('after lunch')).toBeVisible();
  });

  test('should view medication history', async ({ page }) => {
    await page.goto('/students/student-001/medications');

    // Click on a medication to view details
    await page.click('text=Ibuprofen 200mg');

    // Verify details modal
    await expect(page.getByRole('dialog')).toBeVisible();

    // Switch to history tab
    await page.click('button:has-text("Administration History")');

    // Verify history entries
    await expect(page.getByText(/administered by/i)).toBeVisible();
    await expect(page.getByText(/nurse smith/i)).toBeVisible();

    // Filter history by date
    await page.fill('input[name="fromDate"]', '2025-11-01');
    await page.fill('input[name="toDate"]', '2025-11-07');
    await page.click('button:has-text("Filter")');

    // Verify filtered results
    await expect(page.getByText(/3 administrations/i)).toBeVisible();
  });

  test('should discontinue medication', async ({ page }) => {
    await page.goto('/students/student-001/medications');

    // Click discontinue button
    await page.click('button[aria-label*="Discontinue"]').first();

    // Verify confirmation dialog
    await expect(page.getByText(/discontinue medication/i)).toBeVisible();

    // Fill discontinuation reason
    await page.selectOption('select[name="reason"]', 'completed-course');
    await page.fill('textarea[name="notes"]', 'Completed full course of treatment');

    // Confirm discontinuation
    await page.click('button:has-text("Confirm Discontinuation")');

    // Verify success
    await expect(page.getByText(/medication discontinued/i)).toBeVisible();

    // Verify medication marked as discontinued
    await expect(page.getByText(/discontinued/i)).toBeVisible();
  });

  test('should show medication reminders and alerts', async ({ page }) => {
    await page.goto('/dashboard');

    // Verify medication reminders widget
    await expect(page.getByText(/upcoming medications/i)).toBeVisible();

    // Click to view details
    await page.click('button:has-text("View All Medications")');

    // Verify medications due today
    await expect(page.getByText(/medications due today/i)).toBeVisible();
    await expect(page.getByText(/5 students/i)).toBeVisible();

    // Filter by overdue
    await page.click('button:has-text("Overdue")');

    // Verify overdue medications highlighted
    await expect(page.locator('[data-status="overdue"]')).toHaveCount(2);
  });

  test('should export medication administration report', async ({ page }) => {
    await page.goto('/medications/reports');

    // Select date range
    await page.fill('input[name="startDate"]', '2025-11-01');
    await page.fill('input[name="endDate"]', '2025-11-07');

    // Select report type
    await page.selectOption('select[name="reportType"]', 'administration-log');

    // Generate report
    await page.click('button:has-text("Generate Report")');

    // Wait for report generation
    await page.waitForSelector('[data-status="generated"]');

    // Download report
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download PDF")');

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/medication-report.*\.pdf/);
  });
});
