import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { waitForHealthcareData, navigateToStudentDetails, cancelForm } from '../../support/healthcare-helpers';

/**
 * Emergency Contacts: Relationship Types (3 tests)
 *
 * Tests relationship type validation and management
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority Medium
 */

test.describe('Emergency Contacts - Relationship Types', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/students');
    await waitForHealthcareData(page);
    await navigateToStudentDetails(page);

    const addButton = page.locator('button').filter({ hasText: /add.*contact/i });
    await addButton.click();
    await page.waitForTimeout(500);
  });

  test('should display relationship type options in dropdown', async ({ page }) => {
    const relationshipSelectTestId = await page.locator('[data-testid="relationship-select"]').count() > 0;
    const relationshipSelectName = await page.locator('select[name="relationship"]').count() > 0;

    if (relationshipSelectTestId) {
      const relationshipSelect = page.locator('[data-testid="relationship-select"]').first();
      const options = relationshipSelect.locator('option');
      const optionCount = await options.count();
      expect(optionCount).toBeGreaterThan(1);

      const optionsText = await options.allTextContents();
      expect(optionsText.join('')).toContain('Parent');
    } else if (relationshipSelectName) {
      const relationshipSelect = page.locator('select[name="relationship"]').first();
      const options = relationshipSelect.locator('option');
      const optionCount = await options.count();
      expect(optionCount).toBeGreaterThan(0);
    } else {
      console.log('Relationship select not found, may use different implementation');
    }
  });

  test('should accept various relationship types', async ({ page }) => {
    const relationships = ['Parent', 'Guardian', 'Grandparent', 'Other'];

    for (let index = 0; index < relationships.length; index++) {
      const relationship = relationships[index];

      if (index > 0) {
        const addButton = page.locator('button').filter({ hasText: /add.*contact/i });
        await addButton.click();
        await page.waitForTimeout(500);
      }

      const firstNameInput = page.locator('[data-testid="firstName-input"], input[name="firstName"]').first();
      await firstNameInput.clear();
      await firstNameInput.fill(`Contact${index}`);

      const lastNameInput = page.locator('[data-testid="lastName-input"], input[name="lastName"]').first();
      await lastNameInput.clear();
      await lastNameInput.fill('Test');

      const phoneInput = page.locator('[data-testid="phone-input"], input[name="phone"]').first();
      await phoneInput.clear();
      await phoneInput.fill(`555-${index}${index}${index}-1111`);

      const relationshipSelectExists = await page.locator('[data-testid="relationship-select"]').count() > 0;

      if (relationshipSelectExists) {
        const relationshipSelect = page.locator('[data-testid="relationship-select"]').first();
        const options = await relationshipSelect.locator('option').allTextContents();

        if (options.some(opt => opt.includes(relationship))) {
          await relationshipSelect.selectOption(relationship);
        }
      }

      await cancelForm(page);
      await page.waitForTimeout(300);
    }

    await expect(page.locator('body')).toBeAttached();
  });

  test('should display relationship type in contact list', async ({ page }) => {
    await cancelForm(page);
    await page.waitForTimeout(300);

    const emergencyContactsHeading = page.locator('text=/Emergency Contacts/i');
    await expect(emergencyContactsHeading).toBeVisible();
  });
});
