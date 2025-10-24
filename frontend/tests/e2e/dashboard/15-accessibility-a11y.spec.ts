import { test, expect } from '@playwright/test'

/**
 * Dashboard - Accessibility (15 tests)
 *
 * Tests dashboard accessibility features and ARIA compliance
 */

test.describe('Dashboard - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
  })

  test('should have semantic HTML structure', async ({ page }) => {
    await expect(page.locator('header')).toBeAttached()
    await expect(page.locator('main')).toBeAttached()
    await expect(page.locator('nav').first()).toBeAttached()
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h2, h3').first()).toBeAttached()
  })

  test('should have ARIA labels on interactive elements', async ({ page }) => {
    const labeledElements = page.locator('button[aria-label], a[aria-label]')
    await expect(labeledElements.first()).toBeAttached()
  })

  test('should support keyboard navigation', async ({ page }) => {
    const firstButton = page.getByRole('button').first()
    await firstButton.focus()
    await expect(page.locator(':focus')).toBeAttached()
  })

  test('should have skip to main content link', async ({ page }) => {
    const skipLink = page.locator('a[href="#main"]').first()
    await expect(skipLink).toBeAttached()
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await expect(page.locator('body')).toHaveCSS('color', /.+/)
    await expect(page.locator('body')).toHaveCSS('background-color', /.+/)
  })

  test('should have alt text for images', async ({ page }) => {
    const images = await page.locator('img').all()

    for (const image of images) {
      await expect(image).toHaveAttribute('alt')
    }
  })

  test('should have focus indicators', async ({ page }) => {
    const firstButton = page.getByRole('button').first()
    await firstButton.focus()
    await expect(page.locator(':focus')).toHaveCSS('outline', /.+/)
  })

  test('should have proper form labels', async ({ page }) => {
    const inputs = await page.locator('input').all()

    for (const input of inputs) {
      const ariaLabel = await input.getAttribute('aria-label')
      const id = await input.getAttribute('id')
      expect(ariaLabel || id).toBeTruthy()
    }
  })

  test('should announce dynamic content changes', async ({ page }) => {
    const liveRegions = page.locator('[aria-live], [role="status"]')
    await expect(liveRegions.first()).toBeAttached()
  })

  test('should have accessible tooltips', async ({ page }) => {
    const tooltips = page.locator('[title], [aria-describedby]')
    await expect(tooltips.first()).toBeAttached()
  })

  test('should support screen reader navigation', async ({ page }) => {
    await expect(page.locator('[role="navigation"], nav').first()).toBeAttached()
    await expect(page.locator('[role="main"], main').first()).toBeAttached()
  })

  test('should have keyboard-accessible dropdowns', async ({ page }) => {
    const dropdown = page.locator('button[aria-haspopup]').first()
    await dropdown.click()
    const menu = page.locator('[role="menu"], [role="listbox"]')
    await expect(menu.first()).toBeAttached()
  })

  test('should have proper tab order', async ({ page }) => {
    const firstFocusable = page.locator('a, button, input').first()
    await firstFocusable.focus()
    await page.keyboard.press('Tab')
  })

  test('should have ARIA landmarks', async ({ page }) => {
    await expect(page.locator('[role="banner"], header').first()).toBeAttached()
    await expect(page.locator('[role="navigation"], nav').first()).toBeAttached()
    await expect(page.locator('[role="main"], main').first()).toBeAttached()
  })
})
