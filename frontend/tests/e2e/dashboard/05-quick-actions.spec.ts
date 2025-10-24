import { test, expect } from '@playwright/test'

/**
 * Dashboard - Quick Actions (15 tests)
 *
 * Tests quick action buttons and shortcuts on dashboard
 */

test.describe('Dashboard - Quick Actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
  })

  test('should display quick actions section', async ({ page }) => {
    await expect(page.getByText(/quick.*actions|shortcuts/i).first()).toBeVisible()
  })

  test('should have add student button', async ({ page }) => {
    const addStudentBtn = page.getByRole('button').filter({ hasText: /add.*student|new.*student/i }).first()
    await expect(addStudentBtn).toBeAttached()
  })

  test('should have schedule appointment button', async ({ page }) => {
    const scheduleBtn = page.getByRole('button').filter({ hasText: /schedule|new.*appointment/i }).first()
    await expect(scheduleBtn).toBeAttached()
  })

  test('should have add medication button', async ({ page }) => {
    const addMedBtn = page.getByRole('button').filter({ hasText: /add.*medication|new.*medication/i }).first()
    await expect(addMedBtn).toBeAttached()
  })

  test('should have report incident button', async ({ page }) => {
    const reportBtn = page.getByRole('button').filter({ hasText: /report.*incident|new.*incident/i }).first()
    await expect(reportBtn).toBeAttached()
  })

  test('should have view reports button', async ({ page }) => {
    const reportsBtn = page.locator('button, a').filter({ hasText: /view.*reports|reports/i }).first()
    await expect(reportsBtn).toBeAttached()
  })

  test('should navigate to students page when clicking add student', async ({ page }) => {
    const addStudentBtn = page.getByRole('button').filter({ hasText: /add.*student/i }).first()
    await addStudentBtn.click()
    await expect(page).toHaveURL(/\/students/)
  })

  test('should navigate to appointments when clicking schedule', async ({ page }) => {
    const scheduleBtn = page.getByRole('button').filter({ hasText: /schedule|appointment/i }).first()
    await scheduleBtn.click()
    await expect(page).toHaveURL(/\/appointments/)
  })

  test('should navigate to medications when clicking add medication', async ({ page }) => {
    const addMedBtn = page.getByRole('button').filter({ hasText: /add.*medication/i }).first()
    await addMedBtn.click()
    await expect(page).toHaveURL(/\/medications/)
  })

  test('should have quick action icons', async ({ page }) => {
    const icons = page.locator('[class*="quick-action"] svg, button svg')
    await expect(icons.first()).toBeAttached()
  })

  test('should display quick actions in grid or row layout', async ({ page }) => {
    const layout = page.locator('[class*="grid"], [class*="flex"]').first()
    await expect(layout).toBeAttached()
  })

  test('should have hover effects on quick actions', async ({ page }) => {
    const firstButton = page.getByRole('button').first()
    await expect(firstButton).toHaveCSS('cursor', 'pointer')
  })

  test('should show tooltips on quick action buttons', async ({ page }) => {
    const buttonsWithTooltips = page.locator('button[title], button[aria-label]')
    await expect(buttonsWithTooltips.first()).toBeAttached()
  })

  test('should have accessible button labels', async ({ page }) => {
    const buttons = await page.getByRole('button').all()

    for (const button of buttons) {
      const hasAriaLabel = await button.getAttribute('aria-label')
      const text = await button.textContent()
      const hasText = text && text.trim().length > 0

      expect(hasAriaLabel || hasText).toBeTruthy()
    }
  })

  test('should display quick actions prominently', async ({ page }) => {
    const quickActions = page.locator('[class*="quick-action"]').first()
    await expect(quickActions).toBeVisible()
  })
})
