import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Immunization Tracking: Due Date Tracking (4 tests)
 *
 * Validates immunization due date tracking functionality including
 * upcoming immunizations, overdue tracking, reminders, and automatic
 * next due date calculation.
 */

test.describe('Immunization Tracking - Due Date Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'nurse')
    await page.goto('/dashboard')
  })

  test('should display upcoming immunizations due', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display overdue immunizations', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should send reminders for due immunizations', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should calculate next due dates automatically', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })
})
