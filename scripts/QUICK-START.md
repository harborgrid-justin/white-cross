# Screenshot Generator - Quick Start Guide

Get screenshots of all user-accessible pages in under 5 minutes!

## Prerequisites ✓

- [x] Node.js 18+ installed
- [x] Docker installed (for database)
- [x] Git repository cloned

## Step-by-Step Setup

### Step 1: Install Dependencies (1 minute)

```bash
# From repository root
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies  
cd frontend && npm install && cd ..
```

### Step 2: Start Database (30 seconds)

```bash
# Start PostgreSQL with Docker
docker compose -f docker-compose.dev.yml up postgres -d

# Verify it's running
docker ps | grep postgres
```

### Step 3: Setup Database & Users (1 minute)

```bash
# Run migrations
npm run db:migrate

# The test users are already configured in the script!
# - admin@school.edu / AdminPassword123!
# - nurse@school.edu / NursePassword123!
# - counselor@school.edu / CounselorPassword123!
# - readonly@school.edu / ReadOnlyPassword123!
```

### Step 4: Start Application (30 seconds)

```bash
# Terminal 1: Start both backend and frontend
npm run dev

# Wait for:
# ✓ Backend: http://localhost:3001
# ✓ Frontend: http://localhost:5173
```

### Step 5: Generate Screenshots! (2-3 minutes)

```bash
# Terminal 2: Run the screenshot generator
npm run screenshots
```

## Expected Output

```
🚀 White Cross Screenshot Generator
=====================================

🔍 Checking if servers are running...
✅ Servers are running

📁 Screenshots will be saved to: ./screenshots

🌐 Launching browser...
🌐 Processing public pages...
  ✅ Completed public pages

👤 Processing Admin...
  ✅ Completed Admin

👤 Processing Nurse...
  ✅ Completed Nurse

👤 Processing Counselor...
  ✅ Completed Counselor

👤 Processing Viewer...
  ✅ Completed Viewer

✅ Screenshot generation completed!
📁 Screenshots saved to: ./screenshots

📊 Summary:
   Total screenshots: 31
   - public: 1 screenshots
   - admin: 17 screenshots
   - nurse: 10 screenshots
   - counselor: 3 screenshots
   - viewer: 3 screenshots
```

## View Your Screenshots

```bash
# Open screenshots directory
cd screenshots

# List all screenshots
find . -name "*.png" -type f

# View with your favorite image viewer
# macOS:
open admin/dashboard.png

# Linux:
xdg-open admin/dashboard.png

# Windows:
start admin/dashboard.png
```

## Common Issues & Solutions

### Issue: "Servers are not running"

**Solution**: Make sure both servers are running
```bash
# Check backend
curl http://localhost:3001/health

# Check frontend
curl http://localhost:5173

# If not running, start them
npm run dev
```

### Issue: "Failed to login"

**Solution**: Verify test users exist in database
```bash
# Check users table
docker exec -it white-cross-postgres psql -U postgres -d white_cross_dev -c "SELECT email, role FROM users;"

# If no users, create them (see README.md)
```

### Issue: "Screenshot is blank"

**Solution**: Page might need more time to load
```typescript
// In generate-screenshots.ts, increase wait time:
await page.waitForTimeout(2000); // Increase from 1000 to 2000
```

### Issue: "Module not found" errors

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## What You Get

### Directory Structure
```
screenshots/
├── public/
│   └── login-page.png
├── admin/
│   ├── dashboard.png
│   ├── health-records.png
│   ├── admin-users.png
│   ├── budget-overview.png
│   └── ... (17 total)
├── nurse/
│   ├── dashboard.png
│   ├── appointments-schedule.png
│   ├── inventory-items.png
│   └── ... (10 total)
├── counselor/
│   └── ... (3 total)
└── viewer/
    └── ... (3 total)
```

### Screenshot Specs
- **Resolution**: 1920x1080 pixels
- **Format**: PNG
- **Type**: Full page (includes scrollable content)
- **Size**: ~200-500KB per screenshot
- **Total Size**: ~5-10MB

## Advanced Usage

### Capture Only Specific Roles

Edit `generate-screenshots.ts`:

```typescript
// Comment out roles you don't need
await capturePublicScreenshots(browser);
await captureUserScreenshots(browser, 'admin');
// await captureUserScreenshots(browser, 'nurse');    // Skip nurse
// await captureUserScreenshots(browser, 'counselor'); // Skip counselor
// await captureUserScreenshots(browser, 'viewer');    // Skip viewer
```

### Add Custom Routes

Edit the `ROUTES` object in `generate-screenshots.ts`:

```typescript
const ROUTES = {
  admin: [
    // Add your custom route
    { 
      path: '/custom-page', 
      name: 'custom-page', 
      description: 'My Custom Page' 
    },
    // ... existing routes
  ]
};
```

### Change Screenshot Quality

In the `takeScreenshot` function:

```typescript
await page.screenshot({
  path: screenshotPath,
  fullPage: true,
  type: 'jpeg',        // Change to JPEG
  quality: 80          // Adjust quality (0-100)
});
```

## Next Steps

1. **Documentation**: Use screenshots in user manuals
2. **Testing**: Set up visual regression testing
3. **Demos**: Add to sales presentations
4. **Training**: Include in onboarding materials
5. **CI/CD**: Automate in build pipeline

## Resources

- **Full Documentation**: [README.md](./README.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Example Output**: [EXAMPLE-OUTPUT.md](./EXAMPLE-OUTPUT.md)
- **Playwright Docs**: https://playwright.dev/

## Need Help?

Check the detailed documentation:
```bash
cat scripts/README.md        # User guide
cat scripts/ARCHITECTURE.md  # Technical details
cat scripts/EXAMPLE-OUTPUT.md # Expected output
```

Or view online documentation for Playwright:
- Installation: https://playwright.dev/docs/intro
- Screenshots: https://playwright.dev/docs/screenshots
- Authentication: https://playwright.dev/docs/auth

## Tips & Tricks

### Tip 1: Run in Headed Mode
See the browser in action by editing the script:
```typescript
const browser = await chromium.launch({
  headless: false  // Change to false
});
```

### Tip 2: Add Delays Between Screenshots
Give yourself time to observe:
```typescript
await page.waitForTimeout(3000); // Wait 3 seconds
```

### Tip 3: Capture Specific Viewport
Test mobile views:
```typescript
const context = await browser.newContext({
  viewport: { width: 375, height: 667 } // iPhone size
});
```

### Tip 4: Save to Different Directory
Change output location:
```typescript
const CONFIG = {
  screenshotDir: path.join(process.cwd(), 'docs/screenshots')
};
```

### Tip 5: Add Timestamp to Filenames
Track when screenshots were taken:
```typescript
const timestamp = new Date().toISOString().split('T')[0];
const screenshotPath = path.join(userDir, `${route.name}-${timestamp}.png`);
```

## Success Checklist

- [ ] Dependencies installed
- [ ] Database running
- [ ] Test users created
- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Script executed successfully
- [ ] Screenshots directory created
- [ ] All expected files present
- [ ] Screenshots viewable and correct

## Congratulations! 🎉

You now have screenshots of every user-accessible page in your application!

Use them for documentation, testing, demos, and more.
