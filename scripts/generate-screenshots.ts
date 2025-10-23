/**
 * Screenshot Generation Script for White Cross Healthcare Platform
 * 
 * This script automates the process of taking screenshots of all user-accessible pages
 * for different user roles. It uses Playwright to navigate through the application
 * and capture screenshots.
 * 
 * Usage:
 *   npm run screenshots
 *   or
 *   npx ts-node scripts/generate-screenshots.ts
 * 
 * Requirements:
 *   - Backend server must be running (or script will start it)
 *   - Frontend server must be running (or script will start it)
 *   - Database must be seeded with test users
 */

import { chromium, Browser, Page, BrowserContext } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

// Configuration
const CONFIG = {
  baseUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  apiUrl: process.env.API_URL || 'http://localhost:3001',
  screenshotDir: path.join(process.cwd(), 'screenshots'),
  timeout: 30000,
  waitForNetworkIdle: true,
};

// User credentials from Cypress fixtures
const USERS = {
  admin: {
    email: 'admin@school.edu',
    password: 'AdminPassword123!',
    role: 'ADMIN',
    name: 'Admin',
  },
  nurse: {
    email: 'nurse@school.edu',
    password: 'NursePassword123!',
    role: 'NURSE',
    name: 'Nurse',
  },
  counselor: {
    email: 'counselor@school.edu',
    password: 'CounselorPassword123!',
    role: 'SCHOOL_ADMIN',
    name: 'Counselor',
  },
  viewer: {
    email: 'readonly@school.edu',
    password: 'ReadOnlyPassword123!',
    role: 'NURSE',
    name: 'Viewer',
  },
};

// Routes to capture per role
const ROUTES = {
  public: [
    { path: '/login', name: 'login-page', description: 'Login Page' },
  ],
  common: [
    { path: '/dashboard', name: 'dashboard', description: 'Dashboard' },
    { path: '/health-records', name: 'health-records', description: 'Health Records' },
    { path: '/access-denied', name: 'access-denied', description: 'Access Denied' },
  ],
  nurse: [
    { path: '/appointments/schedule', name: 'appointments-schedule', description: 'Appointments Schedule' },
    { path: '/inventory/items', name: 'inventory-items', description: 'Inventory Items' },
    { path: '/inventory/alerts', name: 'inventory-alerts', description: 'Inventory Alerts' },
    { path: '/inventory/transactions', name: 'inventory-transactions', description: 'Inventory Transactions' },
    { path: '/inventory/vendors', name: 'inventory-vendors', description: 'Inventory Vendors' },
    { path: '/reports/generate', name: 'reports-generate', description: 'Generate Reports' },
    { path: '/reports/scheduled', name: 'reports-scheduled', description: 'Scheduled Reports' },
  ],
  admin: [
    { path: '/admin/users', name: 'admin-users', description: 'User Management' },
    { path: '/admin/roles', name: 'admin-roles', description: 'Role Management' },
    { path: '/admin/permissions', name: 'admin-permissions', description: 'Permission Management' },
    { path: '/budget/overview', name: 'budget-overview', description: 'Budget Overview' },
    { path: '/budget/planning', name: 'budget-planning', description: 'Budget Planning' },
    { path: '/budget/tracking', name: 'budget-tracking', description: 'Budget Tracking' },
    { path: '/budget/reports', name: 'budget-reports', description: 'Budget Reports' },
  ],
};

/**
 * Check if servers are running
 */
async function checkServers(): Promise<boolean> {
  try {
    const frontendResponse = await fetch(CONFIG.baseUrl);
    const backendResponse = await fetch(`${CONFIG.apiUrl}/health`);
    return frontendResponse.ok && backendResponse.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Setup screenshot directory
 */
function setupScreenshotDirectory(): void {
  if (!fs.existsSync(CONFIG.screenshotDir)) {
    fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });
  }
  console.log(`📁 Screenshots will be saved to: ${CONFIG.screenshotDir}`);
}

/**
 * Login to the application
 */
async function login(page: Page, userType: keyof typeof USERS): Promise<void> {
  const user = USERS[userType];
  console.log(`  🔐 Logging in as ${user.name} (${user.email})...`);

  await page.goto(`${CONFIG.baseUrl}/login`, { waitUntil: 'networkidle' });
  
  // Wait for login form
  await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: CONFIG.timeout });
  
  // Fill in credentials
  await page.fill('input[type="email"], input[name="email"]', user.email);
  await page.fill('input[type="password"], input[name="password"]', user.password);
  
  // Click login button
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard or home
  await page.waitForURL((url) => {
    return url.pathname.includes('/dashboard') || 
           url.pathname.includes('/home') || 
           !url.pathname.includes('/login');
  }, { timeout: CONFIG.timeout });
  
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  console.log(`  ✅ Successfully logged in as ${user.name}`);
}

/**
 * Take a screenshot of a specific route
 */
async function takeScreenshot(
  page: Page,
  route: { path: string; name: string; description: string },
  userType: string
): Promise<void> {
  try {
    console.log(`    📸 Capturing: ${route.description} (${route.path})`);
    
    // Navigate to the route
    await page.goto(`${CONFIG.baseUrl}${route.path}`, { 
      waitUntil: 'networkidle',
      timeout: CONFIG.timeout 
    });
    
    // Wait a bit for any animations or dynamic content
    await page.waitForTimeout(1000);
    
    // Create user-specific directory
    const userDir = path.join(CONFIG.screenshotDir, userType);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    // Take screenshot
    const screenshotPath = path.join(userDir, `${route.name}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });
    
    console.log(`    ✅ Saved: ${screenshotPath}`);
  } catch (error) {
    console.error(`    ❌ Failed to capture ${route.name}:`, error instanceof Error ? error.message : error);
  }
}

/**
 * Capture screenshots for a specific user role
 */
async function captureUserScreenshots(
  browser: Browser,
  userType: keyof typeof USERS
): Promise<void> {
  console.log(`\n👤 Processing ${USERS[userType].name} (${userType})...`);
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  
  const page = await context.newPage();
  
  try {
    // Login
    await login(page, userType);
    
    // Capture common routes
    console.log(`  📸 Capturing common pages...`);
    for (const route of ROUTES.common) {
      await takeScreenshot(page, route, userType);
    }
    
    // Capture role-specific routes
    if (userType === 'nurse' || userType === 'admin') {
      console.log(`  📸 Capturing nurse-specific pages...`);
      for (const route of ROUTES.nurse) {
        await takeScreenshot(page, route, userType);
      }
    }
    
    if (userType === 'admin') {
      console.log(`  📸 Capturing admin-specific pages...`);
      for (const route of ROUTES.admin) {
        await takeScreenshot(page, route, userType);
      }
    }
    
    console.log(`  ✅ Completed ${USERS[userType].name}`);
  } catch (error) {
    console.error(`  ❌ Error processing ${userType}:`, error instanceof Error ? error.message : error);
  } finally {
    await context.close();
  }
}

/**
 * Capture public pages (no authentication required)
 */
async function capturePublicScreenshots(browser: Browser): Promise<void> {
  console.log(`\n🌐 Processing public pages...`);
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  
  const page = await context.newPage();
  
  try {
    const publicDir = path.join(CONFIG.screenshotDir, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    for (const route of ROUTES.public) {
      await takeScreenshot(page, route, 'public');
    }
    
    console.log(`  ✅ Completed public pages`);
  } catch (error) {
    console.error(`  ❌ Error processing public pages:`, error instanceof Error ? error.message : error);
  } finally {
    await context.close();
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('🚀 White Cross Screenshot Generator');
  console.log('=====================================\n');
  
  // Check if servers are running
  console.log('🔍 Checking if servers are running...');
  const serversRunning = await checkServers();
  
  if (!serversRunning) {
    console.error('❌ Servers are not running!');
    console.error('Please start the servers first:');
    console.error('  1. Start backend: cd backend && npm run dev');
    console.error('  2. Start frontend: cd frontend && npm run dev');
    console.error('Or run both: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Servers are running\n');
  
  // Setup screenshot directory
  setupScreenshotDirectory();
  
  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await chromium.launch({
    headless: true,
  });
  
  try {
    // Capture public pages
    await capturePublicScreenshots(browser);
    
    // Capture screenshots for each user role
    for (const userType of Object.keys(USERS) as Array<keyof typeof USERS>) {
      await captureUserScreenshots(browser, userType);
    }
    
    console.log('\n✅ Screenshot generation completed!');
    console.log(`📁 Screenshots saved to: ${CONFIG.screenshotDir}`);
    
    // Print summary
    console.log('\n📊 Summary:');
    const files = fs.readdirSync(CONFIG.screenshotDir, { recursive: true });
    const pngFiles = (files as string[]).filter(f => f.endsWith('.png'));
    console.log(`   Total screenshots: ${pngFiles.length}`);
    
    // Count by role
    const roleCount: Record<string, number> = {};
    for (const file of pngFiles) {
      const role = (file as string).split(path.sep)[0];
      roleCount[role] = (roleCount[role] || 0) + 1;
    }
    
    for (const [role, count] of Object.entries(roleCount)) {
      console.log(`   - ${role}: ${count} screenshots`);
    }
    
  } catch (error) {
    console.error('❌ Error during screenshot generation:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
