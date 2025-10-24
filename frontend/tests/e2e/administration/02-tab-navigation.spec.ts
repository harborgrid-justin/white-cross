import { test, expect } from '@playwright/test'

/**
 * Administration Features: Tab Navigation (25 tests)
 *
 * Tests navigation between different administration tabs
 */

test.describe('Administration Features - Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
  })

  test('should display all 11 administration tabs', async ({ page }) => {
    const tabs = page.locator('nav button')
    await expect(tabs).toHaveCount(11)
  })

  test('should show Overview tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible()
  })

  test('should show Districts tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Districts' })).toBeVisible()
  })

  test('should show Schools tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Schools' })).toBeVisible()
  })

  test('should show Users tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Users' })).toBeVisible()
  })

  test('should show Configuration tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Configuration' })).toBeVisible()
  })

  test('should show Integrations tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Integrations' })).toBeVisible()
  })

  test('should show Backups tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Backups' })).toBeVisible()
  })

  test('should show Monitoring tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Monitoring' })).toBeVisible()
  })

  test('should show Licenses tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Licenses' })).toBeVisible()
  })

  test('should show Training tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Training' })).toBeVisible()
  })

  test('should show Audit Logs tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Audit Logs' })).toBeVisible()
  })

  test('should have Overview tab active by default', async ({ page }) => {
    const overviewTab = page.getByRole('button', { name: 'Overview' })
    await expect(overviewTab).toHaveClass(/border-blue-500/)
    await expect(overviewTab).toHaveClass(/text-blue-600/)
  })

  test('should switch to Districts tab when clicked', async ({ page }) => {
    const districtsTab = page.getByRole('button', { name: 'Districts' })
    await districtsTab.click()
    await expect(districtsTab).toHaveClass(/border-blue-500/)
  })

  test('should switch to Schools tab when clicked', async ({ page }) => {
    const schoolsTab = page.getByRole('button', { name: 'Schools' })
    await schoolsTab.click()
    await expect(schoolsTab).toHaveClass(/border-blue-500/)
  })

  test('should switch to Users tab when clicked', async ({ page }) => {
    const usersTab = page.getByRole('button', { name: 'Users' })
    await usersTab.click()
    await expect(usersTab).toHaveClass(/border-blue-500/)
  })

  test('should switch to Configuration tab when clicked', async ({ page }) => {
    const configTab = page.getByRole('button', { name: 'Configuration' })
    await configTab.click()
    await expect(configTab).toHaveClass(/border-blue-500/)
  })

  test('should switch to Integrations tab when clicked', async ({ page }) => {
    const integrationsTab = page.getByRole('button', { name: 'Integrations' })
    await integrationsTab.click()
    await expect(integrationsTab).toHaveClass(/border-blue-500/)
  })

  test('should switch to Backups tab when clicked', async ({ page }) => {
    const backupsTab = page.getByRole('button', { name: 'Backups' })
    await backupsTab.click()
    await expect(backupsTab).toHaveClass(/border-blue-500/)
  })

  test('should switch to Monitoring tab when clicked', async ({ page }) => {
    const monitoringTab = page.getByRole('button', { name: 'Monitoring' })
    await monitoringTab.click()
    await expect(monitoringTab).toHaveClass(/border-blue-500/)
  })

  test('should switch to Licenses tab when clicked', async ({ page }) => {
    const licensesTab = page.getByRole('button', { name: 'Licenses' })
    await licensesTab.click()
    await expect(licensesTab).toHaveClass(/border-blue-500/)
  })

  test('should switch to Training tab when clicked', async ({ page }) => {
    const trainingTab = page.getByRole('button', { name: 'Training' })
    await trainingTab.click()
    await expect(trainingTab).toHaveClass(/border-blue-500/)
  })

  test('should switch to Audit Logs tab when clicked', async ({ page }) => {
    const auditLogsTab = page.getByRole('button', { name: 'Audit Logs' })
    await auditLogsTab.click()
    await expect(auditLogsTab).toHaveClass(/border-blue-500/)
  })

  test('should display icons for each tab', async ({ page }) => {
    const tabIcons = page.locator('nav button svg')
    await expect(tabIcons).toHaveCount(11, { timeout: 5000 })
  })

  test('should deactivate previous tab when switching', async ({ page }) => {
    const overviewTab = page.getByRole('button', { name: 'Overview' })
    const districtsTab = page.getByRole('button', { name: 'Districts' })

    await expect(overviewTab).toHaveClass(/border-blue-500/)
    await districtsTab.click()
    await expect(overviewTab).not.toHaveClass(/border-blue-500/)
  })
})
