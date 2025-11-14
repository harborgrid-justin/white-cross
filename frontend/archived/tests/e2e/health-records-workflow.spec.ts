/**
 * Health Records E2E Tests
 * Tests health record creation and management workflows
 */

import { test, expect } from '@playwright/test';

test.describe('Health Records Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'nurse@school.edu');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should create new health record for student', async ({ page }) => {
    // Navigate to a student's profile
    await page.goto('/students');
    await page.click('text=John Doe');

    // Open health records tab
    await page.click('button:has-text("Health Records")');

    // Click add health record
    await page.click('button:has-text("Add Health Record")');

    // Verify modal opened
    await expect(page.getByRole('dialog')).toBeVisible();

    // Select record type
    await page.selectOption('select[name="type"]', 'visit');

    // Fill record details
    await page.fill('input[name="date"]', '2025-11-07');
    await page.fill('textarea[name="description"]', 'Annual health checkup');
    await page.fill('input[name="provider"]', 'Dr. Smith');
    await page.fill('textarea[name="diagnosis"]', 'Healthy, no concerns');

    // Add vital signs
    await page.fill('input[name="temperature"]', '98.6');
    await page.fill('input[name="bloodPressure"]', '120/80');
    await page.fill('input[name="heartRate"]', '72');

    // Submit record
    await page.click('button:has-text("Save Health Record")');

    // Verify success message
    await expect(page.getByText(/health record added successfully/i)).toBeVisible();

    // Verify record appears in list
    await expect(page.getByText('Annual health checkup')).toBeVisible();
    await expect(page.getByText('Dr. Smith')).toBeVisible();
  });

  test('should view health record details', async ({ page }) => {
    await page.goto('/students/student-001/health-records');

    // Click on a health record
    await page.click('text=Annual health checkup');

    // Verify details modal opened
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/visit/i)).toBeVisible();
    await expect(page.getByText('Dr. Smith')).toBeVisible();
    await expect(page.getByText('98.6')).toBeVisible();

    // Close modal
    await page.click('button[aria-label="Close modal"]');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should edit existing health record', async ({ page }) => {
    await page.goto('/students/student-001/health-records');

    // Click edit button on a record
    await page.click('button[aria-label*="Edit"]').first();

    // Verify edit modal opened
    await expect(page.getByRole('dialog')).toBeVisible();

    // Update description
    await page.fill('textarea[name="description"]', 'Updated health checkup notes');

    // Add follow-up note
    await page.check('input[name="followUpRequired"]');
    await page.fill('textarea[name="followUpNotes"]', 'Schedule follow-up in 6 months');

    // Save changes
    await page.click('button:has-text("Save Changes")');

    // Verify success
    await expect(page.getByText(/health record updated/i)).toBeVisible();
    await expect(page.getByText('Updated health checkup notes')).toBeVisible();
  });

  test('should filter health records by type', async ({ page }) => {
    await page.goto('/students/student-001/health-records');

    // Click filter dropdown
    await page.click('button:has-text("Filter")');

    // Select immunization filter
    await page.click('text=Immunizations');

    // Verify only immunization records shown
    await expect(page.getByText(/immunization/i)).toBeVisible();
    await expect(page.getByText(/visit/i)).not.toBeVisible();

    // Clear filter
    await page.click('button:has-text("Clear Filters")');

    // Verify all records shown
    await expect(page.getByText(/visit/i)).toBeVisible();
  });

  test('should export health records', async ({ page }) => {
    await page.goto('/students/student-001/health-records');

    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export")');

    // Verify download started
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/health-records.*\.pdf/);
  });

  test('should handle health record with attachments', async ({ page }) => {
    await page.goto('/students/student-001/health-records');
    await page.click('button:has-text("Add Health Record")');

    // Fill basic info
    await page.selectOption('select[name="type"]', 'screening');
    await page.fill('textarea[name="description"]', 'Vision screening results');

    // Upload attachment
    await page.click('button:has-text("Add Attachment")');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./tests/fixtures/vision-test.pdf');

    // Verify file uploaded
    await expect(page.getByText('vision-test.pdf')).toBeVisible();

    // Submit
    await page.click('button:has-text("Save Health Record")');

    // Verify success
    await expect(page.getByText(/health record added/i)).toBeVisible();

    // Open record details
    await page.click('text=Vision screening results');

    // Verify attachment is listed
    await expect(page.getByText('vision-test.pdf')).toBeVisible();

    // Download attachment
    const downloadPromise = page.waitForEvent('download');
    await page.click('text=vision-test.pdf');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('vision-test.pdf');
  });
});
