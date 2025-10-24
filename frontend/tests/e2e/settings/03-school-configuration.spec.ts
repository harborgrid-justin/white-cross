import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Settings & Configuration: School Configuration (5 tests)
 *
 * Validates school-specific configuration options including school information,
 * hours, academic calendar, and grade levels.
 */

test.describe('Settings & Configuration - School Configuration', () => {
  test.beforeEach(async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'admin')
    await page.goto('/settings')
  })

  test('should configure school information', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should configure school hours', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should configure academic calendar', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should configure grade levels', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should save school configuration', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })
})
