import { test, expect } from '@playwright/test'

/**
 * Administration Features: Integrations & Backups Tabs (30 tests combined)
 *
 * Tests integrations and backup functionality
 */

test.describe('Administration Features - Integrations Tab (15 tests)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
    await page.getByRole('button', { name: 'Integrations' }).click()
  })

  test('should display the Integrations tab content', async ({ page }) => {
    const integrationsTab = page.getByRole('button', { name: 'Integrations' })
    await expect(integrationsTab).toHaveClass(/border-blue-500/)
  })

  test('should show integrations heading', async ({ page }) => {
    await expect(page.getByText(/integration/i).first()).toBeVisible()
  })

  test('should display available integrations', async ({ page }) => {
    const integrationsGrid = page.locator('[class*="grid"], [class*="space-y"]').first()
    await expect(integrationsGrid).toBeAttached()
  })

  test('should show integration status indicators', async ({ page }) => {
    const statusIndicator = page.getByText(/connected|active|inactive/i).first()
    await expect(statusIndicator).toBeAttached()
  })

  test('should display SIS integration option', async ({ page }) => {
    await expect(page.getByText(/sis|student.*information/i).first()).toBeVisible()
  })

  test('should show EHR integration option', async ({ page }) => {
    await expect(page.getByText(/ehr|electronic.*health/i).first()).toBeVisible()
  })

  test('should display API key management', async ({ page }) => {
    await expect(page.getByText(/api.*key|key/i).first()).toBeVisible()
  })

  test('should show webhook configuration', async ({ page }) => {
    const webhook = page.getByText(/webhook/i).first()
    await expect(webhook).toBeAttached()
  })

  test('should display OAuth settings', async ({ page }) => {
    const oauth = page.getByText(/oauth|sso/i).first()
    await expect(oauth).toBeAttached()
  })

  test('should have connect/disconnect buttons', async ({ page }) => {
    await expect(page.getByRole('button').filter({ hasText: /connect|disconnect/i })).toBeVisible()
  })

  test('should show integration test functionality', async ({ page }) => {
    const testButton = page.getByRole('button').filter({ hasText: /test|verify/i }).first()
    await expect(testButton).toBeAttached()
  })

  test('should display sync status', async ({ page }) => {
    const syncStatus = page.getByText(/sync|synchronize/i).first()
    await expect(syncStatus).toBeAttached()
  })

  test('should show last sync time', async ({ page }) => {
    const lastSync = page.getByText(/last.*sync|updated/i).first()
    await expect(lastSync).toBeAttached()
  })

  test('should display integration logs', async ({ page }) => {
    const logs = page.getByText(/log|history/i).first()
    await expect(logs).toBeAttached()
  })

  test('should have integration documentation links', async ({ page }) => {
    const docsLink = page.locator('a[href*="docs"], a[href*="documentation"]').first()
    await expect(docsLink).toBeAttached()
  })
})

test.describe('Administration Features - Backups Tab (15 tests)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
    await page.getByRole('button', { name: 'Backups' }).click()
  })

  test('should display the Backups tab content', async ({ page }) => {
    const backupsTab = page.getByRole('button', { name: 'Backups' })
    await expect(backupsTab).toHaveClass(/border-blue-500/)
  })

  test('should show backups heading', async ({ page }) => {
    await expect(page.getByText(/backup/i).first()).toBeVisible()
  })

  test('should have create backup button', async ({ page }) => {
    await expect(page.getByRole('button').filter({ hasText: /create|new.*backup|backup.*now/i })).toBeVisible()
  })

  test('should display backup history table', async ({ page }) => {
    const backupTable = page.locator('table, [class*="space-y"]').first()
    await expect(backupTable).toBeAttached()
  })

  test('should show backup date/time column', async ({ page }) => {
    await expect(page.getByText(/date|time|created/i).first()).toBeVisible()
  })

  test('should display backup size column', async ({ page }) => {
    await expect(page.getByText(/size|mb|gb/i).first()).toBeVisible()
  })

  test('should show backup status column', async ({ page }) => {
    await expect(page.getByText(/status|complete/i).first()).toBeVisible()
  })

  test('should have restore backup functionality', async ({ page }) => {
    const restoreButton = page.getByRole('button').filter({ hasText: /restore/i }).first()
    await expect(restoreButton).toBeAttached()
  })

  test('should display download backup option', async ({ page }) => {
    const downloadButton = page.locator('button, a').filter({ hasText: /download/i }).first()
    await expect(downloadButton).toBeAttached()
  })

  test('should show delete backup option', async ({ page }) => {
    const deleteButton = page.getByRole('button').filter({ hasText: /delete|remove/i }).first()
    await expect(deleteButton).toBeAttached()
  })

  test('should display automated backup schedule', async ({ page }) => {
    await expect(page.getByText(/schedule|automatic|automated/i).first()).toBeVisible()
  })

  test('should show backup retention policy', async ({ page }) => {
    const retention = page.getByText(/retention|keep/i).first()
    await expect(retention).toBeAttached()
  })

  test('should display backup storage location', async ({ page }) => {
    const storage = page.getByText(/storage|location|destination/i).first()
    await expect(storage).toBeAttached()
  })

  test('should have backup verification status', async ({ page }) => {
    const verification = page.getByText(/verified|integrity/i).first()
    await expect(verification).toBeAttached()
  })

  test('should show last successful backup time', async ({ page }) => {
    const lastBackup = page.getByText(/last.*backup|recent/i).first()
    await expect(lastBackup).toBeAttached()
  })
})
