import { test, expect } from '@playwright/test'
import { login } from '../../support/auth-helpers'

/**
 * Student Management: Data Validation & Error Handling (15 tests)
 *
 * Tests input validation and error handling
 */

test.describe('Student Management - Data Validation & Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'admin')
    await page.goto('/students')
  })

  test('should require student number when creating student', async ({ page }) => {
    await page.getByTestId('add-student-button').click()
    await page.getByTestId('save-student-button').click()
    await expect(page.getByTestId('studentNumber-error')).toContainText('Student number is required')
  })

  test('should require first name when creating student', async ({ page }) => {
    await page.getByTestId('add-student-button').click()
    await page.getByTestId('save-student-button').click()
    await expect(page.getByTestId('firstName-error')).toContainText('First name is required')
  })

  test('should require last name when creating student', async ({ page }) => {
    await page.getByTestId('add-student-button').click()
    await page.getByTestId('save-student-button').click()
    await expect(page.getByTestId('lastName-error')).toContainText('Last name is required')
  })

  test('should validate date of birth is not in the future', async ({ page }) => {
    await page.getByTestId('add-student-button').click()

    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const futureDateString = futureDate.toISOString().split('T')[0]

    await page.getByTestId('dateOfBirth-input').fill(futureDateString)
    await page.getByTestId('save-student-button').click()

    await expect(page.getByTestId('dateOfBirth-error')).toContainText('Date of birth cannot be in the future')
  })

  test('should validate student age is within acceptable range (4-19 years)', async ({ page }) => {
    await page.getByTestId('add-student-button').click()

    const tooYoungDate = new Date()
    tooYoungDate.setFullYear(tooYoungDate.getFullYear() - 2)
    const tooYoungDateString = tooYoungDate.toISOString().split('T')[0]

    await page.getByTestId('studentNumber-input').fill('STU998')
    await page.getByTestId('firstName-input').fill('Too')
    await page.getByTestId('lastName-input').fill('Young')
    await page.getByTestId('dateOfBirth-input').fill(tooYoungDateString)
    await page.getByTestId('save-student-button').click()

    await expect(page.getByTestId('dateOfBirth-error')).toContainText('Student must be between 4 and 19 years old')
  })

  test('should validate phone number format', async ({ page }) => {
    await page.getByTestId('add-student-button').click()
    await page.getByTestId('studentNumber-input').fill('STU999')
    await page.getByTestId('firstName-input').fill('Test')
    await page.getByTestId('lastName-input').fill('Student')
    await page.getByTestId('dateOfBirth-input').fill('2010-01-01')
    await page.getByTestId('emergency-contact-phone').fill('invalid-phone')
    await page.getByTestId('save-student-button').click()

    await expect(page.getByTestId('emergency-contact-phone-error')).toContainText('Invalid phone number format')
  })

  test.skip('should validate email format if provided', async ({ page }) => {
    // Email validation not implemented yet
    await page.getByTestId('add-student-button').click()
    await page.getByTestId('student-email').fill('invalid-email')
    await page.getByTestId('save-student-button').click()

    await expect(page.getByTestId('student-email-error')).toContainText('Invalid email format')
  })

  test.skip('should handle network errors gracefully', async ({ page }) => {
    // App uses mock data, API intercepts not applicable
    await page.route('**/api/students', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 500 })
      } else {
        await route.continue()
      }
    })

    await page.getByTestId('add-student-button').click()
    await page.getByTestId('studentNumber-input').fill('STU-TEST')
    await page.getByTestId('firstName-input').fill('Test')
    await page.getByTestId('lastName-input').fill('Student')
    await page.getByTestId('dateOfBirth-input').fill('2010-01-01')
    await page.getByTestId('save-student-button').click()

    await expect(page.getByTestId('error-message')).toContainText('Failed to create student')
  })

  test('should display validation errors for all invalid fields simultaneously', async ({ page }) => {
    await page.getByTestId('add-student-button').click()
    await page.getByTestId('save-student-button').click()

    await expect(page.getByTestId('studentNumber-error')).toBeVisible()
    await expect(page.getByTestId('firstName-error')).toBeVisible()
    await expect(page.getByTestId('lastName-error')).toBeVisible()
  })

  test('should validate minimum length for first and last names', async ({ page }) => {
    await page.getByTestId('add-student-button').click()
    await page.getByTestId('firstName-input').fill('A')
    await page.getByTestId('lastName-input').fill('B')
    await page.getByTestId('save-student-button').click()

    await expect(page.getByTestId('firstName-error')).toContainText('minimum')
  })

  test('should validate maximum length for text fields', async ({ page }) => {
    await page.getByTestId('add-student-button').click()
    const longString = 'a'.repeat(300)
    await page.getByTestId('firstName-input').fill(longString)
    await page.getByTestId('save-student-button').click()

    await expect(page.getByTestId('firstName-error')).toContainText('maximum')
  })

  test('should prevent XSS attacks in student data', async ({ page }) => {
    await page.getByTestId('add-student-button').click()
    await page.getByTestId('studentNumber-input').fill('STU-XSS')
    await page.getByTestId('firstName-input').fill('<script>alert("xss")</script>')
    await page.getByTestId('lastName-input').fill('Test')
    await page.getByTestId('dateOfBirth-input').fill('2010-01-01')
    await page.getByTestId('save-student-button').click()

    await expect(page.getByTestId('student-table')).not.toContainText('<script>')
  })

  test('should handle duplicate student records appropriately', async ({ page }) => {
    await page.getByTestId('add-student-button').click()
    await page.getByTestId('studentNumber-input').fill('STU100')
    await page.getByTestId('firstName-input').fill('Duplicate')
    await page.getByTestId('lastName-input').fill('Student')
    await page.getByTestId('dateOfBirth-input').fill('2010-01-01')
    await page.getByTestId('save-student-button').click()

    await expect(page.locator('text=/already exists/i')).toBeVisible()
  })

  test.skip('should display appropriate error message when server is unavailable', async ({ page }) => {
    // App uses mock data, API intercepts not applicable
    await page.route('**/api/students*', async (route) => {
      await route.abort('failed')
    })

    await page.goto('/students')
    await expect(page.locator('text=/unable to load/i')).toBeVisible()
  })

  test('should validate enrollment date is not before date of birth', async ({ page }) => {
    await page.getByTestId('add-student-button').click()
    await page.getByTestId('studentNumber-input').fill('STU-DATE')
    await page.getByTestId('firstName-input').fill('Date')
    await page.getByTestId('lastName-input').fill('Test')
    await page.getByTestId('dateOfBirth-input').fill('2015-01-01')
    await page.getByTestId('enrollmentDate-input').fill('2010-01-01')
    await page.getByTestId('save-student-button').click()

    await expect(page.getByTestId('enrollmentDate-error')).toContainText('Enrollment date must be after date of birth')
  })
})
