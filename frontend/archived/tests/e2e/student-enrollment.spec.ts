/**
 * Student Enrollment E2E Tests
 * Tests the complete student enrollment workflow
 */

import { test, expect } from '@playwright/test';

test.describe('Student Enrollment Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin/nurse
    await page.goto('/login');
    await page.fill('input[name="email"]', 'nurse@school.edu');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should complete full student enrollment workflow', async ({ page }) => {
    // Navigate to student enrollment page
    await page.goto('/students/new');

    // Verify form is displayed
    await expect(page.getByRole('heading', { name: /enroll student/i })).toBeVisible();

    // Fill student basic information
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Smith');
    await page.fill('input[name="dateOfBirth"]', '2010-05-15');
    await page.selectOption('select[name="grade"]', '6th');

    // Fill guardian information
    await page.fill('input[name="guardianName"]', 'Jane Smith');
    await page.fill('input[name="guardianPhone"]', '555-0123');
    await page.fill('input[name="guardianEmail"]', 'jane.smith@email.com');

    // Add emergency contact
    await page.click('button:has-text("Add Emergency Contact")');
    await page.fill('input[name="emergencyContactName"]', 'Bob Smith');
    await page.fill('input[name="emergencyContactPhone"]', '555-0124');
    await page.selectOption('select[name="emergencyContactRelationship"]', 'Father');

    // Fill medical information
    await page.click('button:has-text("Next: Medical Information")');
    await page.check('input[name="hasAllergies"]');
    await page.fill('textarea[name="allergiesDetails"]', 'Peanut allergy');
    await page.check('input[name="hasChronicConditions"]');
    await page.fill('textarea[name="chronicConditionsDetails"]', 'Asthma');

    // Review and submit
    await page.click('button:has-text("Review and Submit")');

    // Verify information on review page
    await expect(page.getByText('John Smith')).toBeVisible();
    await expect(page.getByText('6th')).toBeVisible();
    await expect(page.getByText('Peanut allergy')).toBeVisible();

    // Submit enrollment
    await page.click('button:has-text("Confirm Enrollment")');

    // Verify success message
    await expect(page.getByText(/student enrolled successfully/i)).toBeVisible();

    // Verify redirect to student profile
    await page.waitForURL(/\/students\/[a-z0-9-]+$/);
    await expect(page.getByRole('heading', { name: /john smith/i })).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/students/new');

    // Try to submit without filling required fields
    await page.click('button[type="submit"]');

    // Verify validation errors
    await expect(page.getByText(/first name is required/i)).toBeVisible();
    await expect(page.getByText(/last name is required/i)).toBeVisible();
    await expect(page.getByText(/date of birth is required/i)).toBeVisible();
  });

  test('should save draft and resume later', async ({ page }) => {
    await page.goto('/students/new');

    // Fill partial information
    await page.fill('input[name="firstName"]', 'Alice');
    await page.fill('input[name="lastName"]', 'Johnson');

    // Save draft
    await page.click('button:has-text("Save Draft")');

    // Verify draft saved message
    await expect(page.getByText(/draft saved/i)).toBeVisible();

    // Navigate away
    await page.goto('/students');

    // Return to drafts
    await page.click('button:has-text("Drafts")');

    // Verify draft appears
    await expect(page.getByText('Alice Johnson')).toBeVisible();

    // Resume editing
    await page.click('button:has-text("Resume")');

    // Verify form is pre-filled
    await expect(page.locator('input[name="firstName"]')).toHaveValue('Alice');
    await expect(page.locator('input[name="lastName"]')).toHaveValue('Johnson');
  });

  test('should handle duplicate student detection', async ({ page }) => {
    await page.goto('/students/new');

    // Fill information for existing student
    await page.fill('input[name="firstName"]', 'Existing');
    await page.fill('input[name="lastName"]', 'Student');
    await page.fill('input[name="dateOfBirth"]', '2010-01-01');

    // Trigger duplicate check
    await page.click('button:has-text("Check for Duplicates")');

    // Verify warning message
    await expect(
      page.getByText(/potential duplicate student found/i)
    ).toBeVisible();

    // Verify existing student details shown
    await expect(page.getByText(/existing student/i)).toBeVisible();

    // Proceed anyway option
    await page.click('button:has-text("Enroll Anyway")');

    // Or merge with existing
    // await page.click('button:has-text("Merge with Existing")');
  });

  test('should upload and preview student photo', async ({ page }) => {
    await page.goto('/students/new');

    // Upload photo
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./tests/fixtures/student-photo.jpg');

    // Verify preview displayed
    await expect(page.locator('img[alt*="preview"]')).toBeVisible();

    // Remove photo
    await page.click('button:has-text("Remove Photo")');

    // Verify preview removed
    await expect(page.locator('img[alt*="preview"]')).not.toBeVisible();
  });
});
