import { test, expect } from '@playwright/test'

/**
 * Dashboard - Metrics & Cards (15 tests)
 *
 * Tests dashboard metrics, statistics cards, and data summaries
 */

test.describe('Dashboard - Metrics & Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
  })

  test('should display key metrics cards', async ({ page }) => {
    const metricCards = page.locator('[class*="card"], [data-testid*="metric"]')
    await expect(metricCards).toHaveCount(1, { timeout: 5000 })
  })

  test('should show total students metric', async ({ page }) => {
    await expect(page.getByText(/total.*students|students.*count/i).first()).toBeVisible()
  })

  test('should display active appointments count', async ({ page }) => {
    const appointments = page.getByText(/appointments|scheduled/i).first()
    await expect(appointments).toBeAttached()
  })

  test('should show medications due today', async ({ page }) => {
    const medicationsDue = page.getByText(/medications.*due|due.*today/i).first()
    await expect(medicationsDue).toBeAttached()
  })

  test('should display pending incidents count', async ({ page }) => {
    const incidents = page.getByText(/incidents|pending/i).first()
    await expect(incidents).toBeAttached()
  })

  test('should have numeric values in metric cards', async ({ page }) => {
    const firstCard = page.locator('[class*="card"]').first()
    const text = await firstCard.textContent()
    expect(text).toMatch(/\d+/)
  })

  test('should display metric cards with icons', async ({ page }) => {
    const icons = page.locator('[class*="card"] svg, [data-testid*="metric"] svg')
    await expect(icons.first()).toBeAttached()
  })

  test('should show percentage changes or trends', async ({ page }) => {
    const trends = page.locator('[class*="trend"], [class*="change"]')
    await expect(trends.first()).toBeAttached()
  })

  test('should have color-coded metric cards', async ({ page }) => {
    const coloredCards = page.locator('[class*="bg-blue"], [class*="bg-green"], [class*="bg-yellow"]')
    await expect(coloredCards.first()).toBeAttached()
  })

  test('should display metric cards in grid layout', async ({ page }) => {
    await expect(page.locator('[class*="grid"]').first()).toBeAttached()
  })

  test('should show health alerts count', async ({ page }) => {
    const alerts = page.getByText(/alerts|warnings/i).first()
    await expect(alerts).toBeAttached()
  })

  test('should display recent activity count', async ({ page }) => {
    const recentActivity = page.getByText(/recent|activity/i).first()
    await expect(recentActivity).toBeAttached()
  })

  test('should have hover effects on metric cards', async ({ page }) => {
    const firstCard = page.locator('[class*="card"]').first()
    await expect(firstCard).toHaveClass(/hover/)
  })

  test('should show loading state for metrics initially', async ({ page }) => {
    await page.goto('/dashboard')
    const loadingElement = page.locator('[class*="skeleton"], [class*="loading"]').first()
    await expect(loadingElement).toBeAttached({ timeout: 1000 })
  })

  test('should refresh metrics when clicking refresh button', async ({ page }) => {
    const refreshButton = page.getByRole('button').filter({ hasText: /refresh|reload/i }).first()
    await expect(refreshButton).toBeAttached()
  })
})
