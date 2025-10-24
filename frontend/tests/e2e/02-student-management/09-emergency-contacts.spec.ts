import { test, expect } from '@playwright/test'
import { login } from '../../support/auth-helpers'

/**
 * Student Management: Emergency Contacts Management (10 tests)
 *
 * Tests emergency contact CRUD operations
 */

test.describe('Student Management - Emergency Contacts Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'admin')
    await page.goto('/students')
  })

  test('should display emergency contact section in student details', async ({ page }) => {
    await page.getByTestId('student-row').first().click()
    await expect(page.getByTestId('emergency-contact-section')).toBeVisible()
  })

  test('should display primary emergency contact information', async ({ page }) => {
    await page.getByTestId('student-row').first().click()
    await expect(page.getByTestId('emergency-contact-name')).toBeVisible()
    await expect(page.getByTestId('emergency-contact-phone')).toBeVisible()
  })

  test.skip('should allow editing emergency contact information', async ({ page }) => {
    // TODO: Implement emergency contact editing modal with proper input fields
    await page.getByTestId('student-row').first().click()
    await page.getByTestId('edit-emergency-contact-button').click()

    await page.getByTestId('emergency-contact-firstName').clear()
    await page.getByTestId('emergency-contact-firstName').fill('NewContact')
    await page.getByTestId('emergency-contact-phone').clear()
    await page.getByTestId('emergency-contact-phone').fill('555-9999')
    await page.getByTestId('save-emergency-contact-button').click()

    await expect(page.getByTestId('emergency-contact-name')).toContainText('NewContact')
  })

  test.skip('should validate emergency contact phone number format', async ({ page }) => {
    // TODO: Implement phone number validation in emergency contact form
    await page.getByTestId('student-row').first().click()
    await page.getByTestId('edit-emergency-contact-button').click()

    await page.getByTestId('emergency-contact-phone').clear()
    await page.getByTestId('emergency-contact-phone').fill('invalid')
    await page.getByTestId('save-emergency-contact-button').click()

    await expect(page.getByTestId('emergency-contact-phone-error')).toContainText('Invalid phone number')
  })

  test('should display relationship to student', async ({ page }) => {
    await page.getByTestId('student-row').first().click()
    await expect(page.getByTestId('emergency-contact-relationship')).toBeVisible()
  })

  test.skip('should allow adding secondary emergency contact', async ({ page }) => {
    // TODO: Implement secondary emergency contact form and add functionality
    await page.getByTestId('student-row').first().click()
    await page.getByTestId('add-secondary-contact-button').click()

    await expect(page.getByTestId('secondary-contact-form')).toBeVisible()
  })

  test.skip('should display multiple emergency contacts', async ({ page }) => {
    // TODO: Implement emergency contact list UI with support for multiple contacts
    await page.getByTestId('student-row').first().click()
    await expect(page.getByTestId('emergency-contact-list')).toBeVisible()
  })

  test.skip('should allow removing secondary emergency contact', async ({ page }) => {
    // TODO: Implement remove contact functionality with confirmation modal
    await page.getByTestId('student-row').first().click()
    const secondaryContact = page.getByTestId('secondary-contact-row').first()
    await secondaryContact.getByTestId('remove-contact-button').click()

    await expect(page.getByTestId('confirm-remove-modal')).toBeVisible()
    await page.getByTestId('confirm-remove-button').click()
  })

  test.skip('should validate at least one emergency contact exists', async ({ page }) => {
    // TODO: Implement validation to ensure at least one emergency contact is required
    await page.getByTestId('student-row').first().click()
    const emergencyContacts = page.locator('[data-testid=emergency-contact-list] [data-testid=emergency-contact-row]')
    expect(await emergencyContacts.count()).toBeGreaterThan(0)
  })

  test.skip('should display contact priority order', async ({ page }) => {
    // TODO: Implement contact priority indicator UI for emergency contacts
    await page.getByTestId('student-row').first().click()
    await expect(page.getByTestId('contact-priority-indicator')).toBeVisible()
  })
})
