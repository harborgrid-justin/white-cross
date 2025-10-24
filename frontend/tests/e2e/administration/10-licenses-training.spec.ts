import { test, expect } from '@playwright/test'

/**
 * Administration Features: Licenses & Training Tabs (20 tests combined)
 *
 * Tests licenses and training resources
 */

test.describe('Administration Features - Licenses Tab (10 tests)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
    await page.getByRole('button', { name: 'Licenses' }).click()
  })

  test('should display the Licenses tab content', async ({ page }) => {
    const licensesTab = page.getByRole('button', { name: 'Licenses' })
    await expect(licensesTab).toHaveClass(/border-blue-500/)
  })

  test('should show licenses heading', async ({ page }) => {
    await expect(page.getByText(/license/i).first()).toBeVisible()
  })

  test('should display current license information', async ({ page }) => {
    await expect(page.getByText(/current|active/i).first()).toBeVisible()
  })

  test('should show license expiration date', async ({ page }) => {
    await expect(page.getByText(/expir|valid.*until/i).first()).toBeVisible()
  })

  test('should display number of allowed users', async ({ page }) => {
    await expect(page.getByText(/users|seats/i).first()).toBeVisible()
  })

  test('should show license type/tier', async ({ page }) => {
    await expect(page.getByText(/tier|type|plan/i).first()).toBeVisible()
  })

  test('should display features included', async ({ page }) => {
    await expect(page.getByText(/feature|included/i).first()).toBeVisible()
  })

  test('should have upgrade license button', async ({ page }) => {
    const upgradeButton = page.getByRole('button').filter({ hasText: /upgrade|renew/i }).first()
    await expect(upgradeButton).toBeAttached()
  })

  test('should show license key or number', async ({ page }) => {
    await expect(page.getByText(/key|number|id/i).first()).toBeVisible()
  })

  test('should display support contact information', async ({ page }) => {
    const supportInfo = page.getByText(/support|contact/i).first()
    await expect(supportInfo).toBeAttached()
  })
})

test.describe('Administration Features - Training Tab (10 tests)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
    await page.getByRole('button', { name: 'Training' }).click()
  })

  test('should display the Training tab content', async ({ page }) => {
    const trainingTab = page.getByRole('button', { name: 'Training' })
    await expect(trainingTab).toHaveClass(/border-blue-500/)
  })

  test('should show training heading', async ({ page }) => {
    await expect(page.getByText(/training|resources/i).first()).toBeVisible()
  })

  test('should display training materials list', async ({ page }) => {
    const materialsGrid = page.locator('[class*="grid"], [class*="space-y"]').first()
    await expect(materialsGrid).toBeAttached()
  })

  test('should show video tutorials section', async ({ page }) => {
    await expect(page.getByText(/video|tutorial/i).first()).toBeVisible()
  })

  test('should display documentation links', async ({ page }) => {
    await expect(page.getByText(/documentation|docs|guide/i).first()).toBeVisible()
  })

  test('should show quick start guides', async ({ page }) => {
    const quickStart = page.getByText(/quick.*start|getting.*started/i).first()
    await expect(quickStart).toBeAttached()
  })

  test('should display user manuals', async ({ page }) => {
    const manuals = page.getByText(/manual|handbook/i).first()
    await expect(manuals).toBeAttached()
  })

  test('should have search functionality', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    await expect(searchInput).toBeAttached()
  })

  test('should show categories or topics', async ({ page }) => {
    const categories = page.getByText(/category|topic/i).first()
    await expect(categories).toBeAttached()
  })

  test('should display help center link', async ({ page }) => {
    const helpLink = page.locator('a').filter({ hasText: /help|support/i }).first()
    await expect(helpLink).toBeAttached()
  })
})
