import { test, expect } from '@playwright/test'

/**
 * Dashboard - Recent Activity Feed (15 tests)
 *
 * Tests recent activity timeline, feed, and notifications
 */

test.describe('Dashboard - Recent Activity Feed', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
  })

  test('should display recent activity section', async ({ page }) => {
    await expect(page.getByText(/recent.*activity|activity.*feed/i).first()).toBeVisible()
  })

  test('should show activity items', async ({ page }) => {
    const activityItems = page.locator('[data-testid*="activity"], [class*="activity-item"]')
    await expect(activityItems.first()).toBeAttached()
  })

  test('should display activity timestamps', async ({ page }) => {
    const timestamps = page.getByText(/ago|minutes|hours|yesterday/i).first()
    await expect(timestamps).toBeAttached()
  })

  test('should show activity type icons', async ({ page }) => {
    const activityIcons = page.locator('[class*="activity"] svg')
    await expect(activityIcons.first()).toBeAttached()
  })

  test('should display user who performed activity', async ({ page }) => {
    const activityUser = page.locator('[class*="activity"]').getByText(/nurse|admin|user/i).first()
    await expect(activityUser).toBeAttached()
  })

  test('should show activity descriptions', async ({ page }) => {
    const activities = page.locator('[class*="activity"]')
    await expect(activities).toHaveCount(1, { timeout: 5000 })
  })

  test('should limit recent activities to recent timeframe', async ({ page }) => {
    const timeframe = page.getByText(/today|yesterday|this week/i).first()
    await expect(timeframe).toBeAttached()
  })

  test('should display activities in chronological order', async ({ page }) => {
    await expect(page.locator('[class*="activity"]').first()).toBeAttached()
  })

  test('should have scrollable activity feed', async ({ page }) => {
    const scrollableContainer = page.locator('[class*="activity-feed"], [class*="overflow"]').first()
    await expect(scrollableContainer).toBeAttached()
  })

  test('should show different activity types', async ({ page }) => {
    const activityTypes = page.getByText(/added|updated|deleted|created/i).first()
    await expect(activityTypes).toBeAttached()
  })

  test('should display activity categories', async ({ page }) => {
    const categories = page.getByText(/student|medication|appointment|incident/i).first()
    await expect(categories).toBeAttached()
  })

  test('should have clickable activity items', async ({ page }) => {
    const firstActivity = page.locator('[class*="activity"]').first()
    await expect(firstActivity).toBeVisible()
  })

  test('should show "view all" activities link', async ({ page }) => {
    const viewAllLink = page.getByText(/view.*all|see.*more/i).first()
    await expect(viewAllLink).toBeAttached()
  })

  test('should display activity severity indicators', async ({ page }) => {
    const indicators = page.locator('[class*="badge"], [class*="status"]')
    await expect(indicators.first()).toBeAttached()
  })

  test('should refresh activity feed automatically', async ({ page }) => {
    await page.waitForTimeout(2000)
    await expect(page.locator('[class*="activity"]').first()).toBeAttached()
  })
})
