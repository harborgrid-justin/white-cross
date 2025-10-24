/**
 * Screenshot Capture Script for White Cross Healthcare Platform
 * Captures screenshots of all pages in the application
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = '/home/user/white-cross/.screenshots/2025-10-24-01';
const MANIFEST_FILE = path.join(SCREENSHOTS_DIR, 'manifest.json');

// Define all routes to capture
const ROUTES = {
  public: [
    { path: '/login', name: 'login', requiresAuth: false },
  ],
  protected: [
    { path: '/dashboard', name: 'dashboard', requiresAuth: true },
    { path: '/health-records', name: 'health-records', requiresAuth: true },
    { path: '/appointments/schedule', name: 'appointments-schedule', requiresAuth: true },
    { path: '/inventory/items', name: 'inventory-items', requiresAuth: true },
    { path: '/inventory/alerts', name: 'inventory-alerts', requiresAuth: true },
    { path: '/inventory/transactions', name: 'inventory-transactions', requiresAuth: true },
    { path: '/inventory/vendors', name: 'inventory-vendors', requiresAuth: true },
    { path: '/reports/generate', name: 'reports-generate', requiresAuth: true },
    { path: '/reports/scheduled', name: 'reports-scheduled', requiresAuth: true },
    { path: '/admin/users', name: 'admin-users', requiresAuth: true },
    { path: '/admin/roles', name: 'admin-roles', requiresAuth: true },
    { path: '/admin/permissions', name: 'admin-permissions', requiresAuth: true },
    { path: '/budget/overview', name: 'budget-overview', requiresAuth: true },
    { path: '/budget/planning', name: 'budget-planning', requiresAuth: true },
    { path: '/budget/tracking', name: 'budget-tracking', requiresAuth: true },
    { path: '/budget/reports', name: 'budget-reports', requiresAuth: true },
    { path: '/access-denied', name: 'access-denied', requiresAuth: true },
  ],
};

interface CaptureResult {
  path: string;
  name: string;
  screenshot: string;
  success: boolean;
  error?: string;
  timestamp: string;
}

async function login(page: Page): Promise<boolean> {
  try {
    console.log('Attempting to log in...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 10000 });

    // Wait for login form to be visible
    await page.waitForSelector('input[type="email"], input[type="text"]', { timeout: 5000 });

    // Fill in login credentials (using admin credentials)
    await page.fill('input[type="email"], input[type="text"]', 'admin@whitecross.com');
    await page.fill('input[type="password"]', 'Admin123!');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard or any redirect
    await page.waitForURL(/\/dashboard|\//, { timeout: 10000 });

    console.log('Login successful!');
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
}

async function captureScreenshot(page: Page, route: { path: string; name: string; requiresAuth: boolean }): Promise<CaptureResult> {
  const result: CaptureResult = {
    path: route.path,
    name: route.name,
    screenshot: '',
    success: false,
    timestamp: new Date().toISOString(),
  };

  try {
    console.log(`Navigating to ${route.path}...`);

    // Navigate to the route
    await page.goto(`${BASE_URL}${route.path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // Wait a bit for content to load (even if there are errors)
    await page.waitForTimeout(2000);

    // Try to wait for the main content area, but don't fail if it doesn't exist
    try {
      await page.waitForSelector('body', { timeout: 3000 });
    } catch (e) {
      console.log('  Warning: Body selector not found, continuing anyway');
    }

    // Capture screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${route.name}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    result.screenshot = screenshotPath;
    result.success = true;
    console.log(`  ✓ Screenshot saved: ${route.name}.png`);

  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    console.error(`  ✗ Failed to capture ${route.name}:`, result.error);
  }

  return result;
}

async function main() {
  console.log('='.repeat(80));
  console.log('White Cross Healthcare Platform - Screenshot Capture');
  console.log('='.repeat(80));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Screenshots Directory: ${SCREENSHOTS_DIR}`);
  console.log('='.repeat(80));
  console.log('');

  const results: CaptureResult[] = [];
  let browser: Browser | null = null;

  try {
    // Launch browser
    console.log('Launching browser...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();

    // Suppress console errors from the page
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`  [Page Error] ${msg.text()}`);
      }
    });

    // Capture login page (before authentication)
    console.log('\n--- Capturing Public Pages ---\n');
    for (const route of ROUTES.public) {
      const result = await captureScreenshot(page, route);
      results.push(result);
    }

    // Login
    console.log('\n--- Authenticating ---\n');
    const loginSuccess = await login(page);

    if (!loginSuccess) {
      console.error('Login failed. Skipping protected routes.');
    } else {
      // Capture protected pages
      console.log('\n--- Capturing Protected Pages ---\n');
      for (const route of ROUTES.protected) {
        const result = await captureScreenshot(page, route);
        results.push(result);
      }
    }

    // Close browser
    await browser.close();

    // Generate manifest
    console.log('\n--- Generating Manifest ---\n');
    const manifest = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      screenshotsDir: SCREENSHOTS_DIR,
      totalRoutes: results.length,
      successfulCaptures: results.filter(r => r.success).length,
      failedCaptures: results.filter(r => !r.success).length,
      routes: results,
    };

    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
    console.log(`Manifest saved: ${MANIFEST_FILE}`);

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Pages: ${results.length}`);
    console.log(`Successful Captures: ${manifest.successfulCaptures}`);
    console.log(`Failed Captures: ${manifest.failedCaptures}`);
    console.log('='.repeat(80));

    console.log('\n--- Successful Screenshots ---');
    results.filter(r => r.success).forEach(r => {
      console.log(`  ✓ ${r.name}.png - ${r.path}`);
    });

    if (manifest.failedCaptures > 0) {
      console.log('\n--- Failed Screenshots ---');
      results.filter(r => !r.success).forEach(r => {
        console.log(`  ✗ ${r.name} - ${r.path}`);
        console.log(`    Error: ${r.error}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('Screenshot capture completed!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Fatal error:', error);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
