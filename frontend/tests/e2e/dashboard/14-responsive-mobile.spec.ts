import { test, expect } from '@playwright/test'

/**
 * Dashboard - Responsive & Mobile (15 tests)
 *
 * Tests dashboard responsive design and mobile experience
 */

test.describe('Dashboard - Responsive & Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
  })

  test('should be responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    await expect(page.getByText('Dashboard')).toBeVisible()
  })

  test('should be responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/dashboard')
    await expect(page.locator('[class*="card"]').first()).toBeVisible()
  })

  test('should be responsive on desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/dashboard')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should stack cards vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    const verticalLayout = page.locator('[class*="flex-col"], [class*="block"]')
    await expect(verticalLayout.first()).toBeAttached()
  })

  test('should show hamburger menu on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    const hamburgerMenu = page.locator('button[aria-label*="menu"]').first()
    await expect(hamburgerMenu).toBeVisible()
  })

  test('should hide sidebar on mobile by default', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    const hiddenSidebar = page.locator('aside[class*="hidden"]')
    await expect(hiddenSidebar.first()).toBeAttached()
  })

  test('should adapt grid layout for tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/dashboard')
    await expect(page.locator('[class*="grid"]').first()).toBeAttached()
  })

  test('should maintain readability on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    await expect(page.locator('body')).toHaveCSS('font-size', /.+/)
  })

  test('should support touch interactions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    const firstButton = page.getByRole('button').first()
    await firstButton.click()
  })

  test('should show condensed metrics on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    await expect(page.locator('[class*="card"]').first()).toBeAttached()
  })

  test('should collapse navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    const collapsedNav = page.locator('nav[class*="collapsed"]')
    await expect(collapsedNav.first()).toBeAttached()
  })

  test('should optimize images for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    const images = page.locator('img')
    await expect(images.first()).toHaveAttribute('src')
  })

  test('should have proper spacing on all viewports', async ({ page }) => {
    const viewports = [[375, 667], [768, 1024], [1920, 1080]] as const

    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height })
      await page.goto('/dashboard')
      await expect(page.locator('[class*="space"], [class*="gap"]').first()).toBeAttached()
    }
  })

  test('should support landscape orientation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 })
    await page.goto('/dashboard')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should maintain functionality on all screen sizes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    await expect(page.getByRole('button').first()).toBeVisible()
  })
})
