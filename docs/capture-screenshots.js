const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const FRONTEND_URL = 'http://localhost:5173';
const OUTPUT_DIR = '/home/runner/work/white-cross/white-cross/docs/screenshots';
const CREDENTIALS = {
  email: 'admin@whitecross.health',
  password: 'admin123'
};

// All pages to capture
const PAGES = [
  // Public pages
  { name: '01-login-page', url: '/login', requiresAuth: false },
  { name: '02-backend-error', url: '/login', requiresAuth: false, simulateBackendDown: true },
  
  // Main pages
  { name: '03-dashboard', url: '/dashboard', requiresAuth: true },
  { name: '04-students-list', url: '/students', requiresAuth: true },
  { name: '05-students-new', url: '/students/new', requiresAuth: true },
  { name: '06-medications-list', url: '/medications', requiresAuth: true },
  { name: '07-medications-new', url: '/medications/new', requiresAuth: true },
  { name: '08-medications-inventory', url: '/medications/inventory', requiresAuth: true },
  { name: '09-appointments-list', url: '/appointments', requiresAuth: true },
  { name: '10-appointments-new', url: '/appointments/new', requiresAuth: true },
  { name: '11-appointments-schedule', url: '/appointments/schedule', requiresAuth: true },
  { name: '12-health-records-list', url: '/health-records', requiresAuth: true },
  { name: '13-health-records-new', url: '/health-records/new', requiresAuth: true },
  { name: '14-incident-reports-list', url: '/incident-reports', requiresAuth: true },
  { name: '15-incident-reports-new', url: '/incident-reports/new', requiresAuth: true },
  { name: '16-emergency-contacts-list', url: '/emergency-contacts', requiresAuth: true },
  { name: '17-emergency-contacts-new', url: '/emergency-contacts/new', requiresAuth: true },
  { name: '18-communication', url: '/communication', requiresAuth: true },
  { name: '19-communication-send', url: '/communication/send', requiresAuth: true },
  { name: '20-communication-templates', url: '/communication/templates', requiresAuth: true },
  { name: '21-communication-history', url: '/communication/history', requiresAuth: true },
  { name: '22-documents-list', url: '/documents', requiresAuth: true },
  { name: '23-documents-upload', url: '/documents/upload', requiresAuth: true },
  { name: '24-inventory', url: '/inventory', requiresAuth: true },
  { name: '25-inventory-items', url: '/inventory/items', requiresAuth: true },
  { name: '26-inventory-alerts', url: '/inventory/alerts', requiresAuth: true },
  { name: '27-inventory-transactions', url: '/inventory/transactions', requiresAuth: true },
  { name: '28-inventory-vendors', url: '/inventory/vendors', requiresAuth: true },
  { name: '29-reports', url: '/reports', requiresAuth: true },
  { name: '30-reports-generate', url: '/reports/generate', requiresAuth: true },
  { name: '31-reports-scheduled', url: '/reports/scheduled', requiresAuth: true },
  { name: '32-settings', url: '/settings', requiresAuth: true },
  { name: '33-settings-districts', url: '/settings/districts', requiresAuth: true },
  { name: '34-settings-schools', url: '/settings/schools', requiresAuth: true },
  { name: '35-settings-users', url: '/settings/users', requiresAuth: true },
  { name: '36-settings-configuration', url: '/settings/configuration', requiresAuth: true },
  { name: '37-settings-integrations', url: '/settings/integrations', requiresAuth: true },
  { name: '38-settings-backups', url: '/settings/backups', requiresAuth: true },
  { name: '39-settings-monitoring', url: '/settings/monitoring', requiresAuth: true },
  { name: '40-settings-audit', url: '/settings/audit', requiresAuth: true },
  { name: '41-access-denied', url: '/access-denied', requiresAuth: true },
  { name: '42-not-found', url: '/this-page-does-not-exist', requiresAuth: true },
  
  // Additional views
  { name: '43-dashboard-full-view', url: '/dashboard', requiresAuth: true, fullPage: true },
  { name: '44-students-table-view', url: '/students', requiresAuth: true, fullPage: true },
  { name: '45-medications-table-view', url: '/medications', requiresAuth: true, fullPage: true },
  { name: '46-appointments-calendar-view', url: '/appointments', requiresAuth: true, fullPage: true },
  { name: '47-health-records-table-view', url: '/health-records', requiresAuth: true, fullPage: true },
  { name: '48-incident-reports-table-view', url: '/incident-reports', requiresAuth: true, fullPage: true },
  { name: '49-communication-dashboard-view', url: '/communication', requiresAuth: true, fullPage: true },
  { name: '50-inventory-dashboard-view', url: '/inventory', requiresAuth: true, fullPage: true },
];

async function login(page) {
  console.log('Logging in...');
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle', timeout: 10000 });
  await page.fill('input[type="email"], input[name="email"]', CREDENTIALS.email);
  await page.fill('input[type="password"], input[name="password"]', CREDENTIALS.password);
  await page.click('button[type="submit"], button:has-text("Sign in")');
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  console.log('Logged in successfully');
}

async function captureScreenshot(browser, pageInfo, index) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  
  try {
    console.log(`[${index + 1}/${PAGES.length}] Capturing: ${pageInfo.name}`);
    
    if (pageInfo.requiresAuth) {
      await login(page);
    }
    
    await page.goto(`${FRONTEND_URL}${pageInfo.url}`, { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    // Wait a bit for any dynamic content to load
    await page.waitForTimeout(2000);
    
    const screenshotPath = path.join(OUTPUT_DIR, `${pageInfo.name}.png`);
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: pageInfo.fullPage || false
    });
    
    console.log(`  ✓ Saved: ${pageInfo.name}.png`);
    return { success: true, name: pageInfo.name };
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
    return { success: false, name: pageInfo.name, error: error.message };
  } finally {
    await context.close();
  }
}

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = [];
  
  for (let i = 0; i < PAGES.length; i++) {
    const result = await captureScreenshot(browser, PAGES[i], i);
    results.push(result);
    
    // Small delay between captures
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  await browser.close();
  
  // Summary
  console.log('\n========================================');
  console.log('SCREENSHOT CAPTURE SUMMARY');
  console.log('========================================');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`Total: ${results.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\nFailed screenshots:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }
  
  console.log('\nScreenshots saved to:', OUTPUT_DIR);
}

main().catch(console.error);
