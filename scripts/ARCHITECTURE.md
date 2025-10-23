# Screenshot Generator Architecture

## Overview

The screenshot generator is a standalone TypeScript script that automates browser interactions using Playwright to capture screenshots of all user-accessible pages in the White Cross healthcare platform.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Screenshot Generator                      │
│                 (generate-screenshots.ts)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─ Check Server Health
                     │  └─ GET http://localhost:5173 (Frontend)
                     │  └─ GET http://localhost:3001/health (Backend)
                     │
                     ├─ Launch Browser
                     │  └─ Chromium (headless)
                     │
                     ├─ Create Browser Context
                     │  └─ Viewport: 1920x1080
                     │
                     └─ For Each User Role
                        │
                        ├─ Public Pages
                        │  └─ Navigate & Screenshot
                        │     └─ screenshots/public/
                        │
                        ├─ Admin User
                        │  ├─ Login (admin@school.edu)
                        │  ├─ Navigate to Routes
                        │  │  ├─ Common Pages
                        │  │  ├─ Nurse Pages
                        │  │  └─ Admin Pages
                        │  └─ Save Screenshots
                        │     └─ screenshots/admin/
                        │
                        ├─ Nurse User
                        │  ├─ Login (nurse@school.edu)
                        │  ├─ Navigate to Routes
                        │  │  ├─ Common Pages
                        │  │  └─ Nurse Pages
                        │  └─ Save Screenshots
                        │     └─ screenshots/nurse/
                        │
                        ├─ Counselor User
                        │  ├─ Login (counselor@school.edu)
                        │  ├─ Navigate to Routes
                        │  │  └─ Common Pages
                        │  └─ Save Screenshots
                        │     └─ screenshots/counselor/
                        │
                        └─ Viewer User
                           ├─ Login (readonly@school.edu)
                           ├─ Navigate to Routes
                           │  └─ Common Pages
                           └─ Save Screenshots
                              └─ screenshots/viewer/
```

## Component Details

### 1. Server Health Check

```typescript
async function checkServers(): Promise<boolean> {
  // Verifies both frontend and backend are accessible
  // Returns false if either is unreachable
}
```

**Purpose**: Fail fast if required services aren't running

**Dependencies**:
- Frontend server at `http://localhost:5173`
- Backend API at `http://localhost:3001`

### 2. Browser Automation

```typescript
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 }
});
const page = await context.newPage();
```

**Technology**: Playwright
**Browser**: Chromium
**Mode**: Headless (no UI)

### 3. Authentication Flow

```typescript
async function login(page: Page, userType: UserRole) {
  await page.goto('/login');
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes('/login'));
}
```

**Credentials Source**: Cypress fixtures (`frontend/cypress/fixtures/users.json`)

**Authentication Method**:
1. Navigate to login page
2. Fill email and password fields
3. Submit form
4. Wait for redirect to dashboard

### 4. Screenshot Capture

```typescript
async function takeScreenshot(page: Page, route: Route, userType: string) {
  await page.goto(route.path);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Allow animations
  
  await page.screenshot({
    path: `screenshots/${userType}/${route.name}.png`,
    fullPage: true
  });
}
```

**Features**:
- Full page capture (includes scrollable content)
- Network idle wait (ensures dynamic content loads)
- Animation delay (1 second for UI transitions)

### 5. Route Configuration

```typescript
const ROUTES = {
  public: Array<RouteConfig>,    // Unauthenticated
  common: Array<RouteConfig>,    // All authenticated users
  nurse: Array<RouteConfig>,     // Nurse-specific
  admin: Array<RouteConfig>      // Admin-specific
};
```

**Route Object**:
```typescript
interface RouteConfig {
  path: string;         // URL path (e.g., '/dashboard')
  name: string;         // Screenshot filename (e.g., 'dashboard')
  description: string;  // Human-readable description
}
```

## Data Flow

```
User Executes Script
       ↓
Check Server Health
       ↓
Launch Browser ──────────┐
       ↓                  │
For Each Role:            │
  Create Context ─────────┤
  Create Page             │
       ↓                  │
  Login (if auth)         │
       ↓                  │
  For Each Route:         │
    Navigate to Page      │
    Wait for Load ────────┤ Browser Instance
    Capture Screenshot    │
    Save to Disk ─────────┤
       ↓                  │
  Close Context ──────────┤
       ↓                  │
Close Browser ────────────┘
       ↓
Print Summary
```

## File System Organization

```
white-cross/
├── scripts/
│   ├── generate-screenshots.ts    # Main script
│   ├── README.md                  # User documentation
│   ├── ARCHITECTURE.md            # This file
│   ├── EXAMPLE-OUTPUT.md          # Expected output
│   └── tsconfig.json              # TypeScript config
├── screenshots/                    # Generated screenshots
│   ├── public/
│   ├── admin/
│   ├── nurse/
│   ├── counselor/
│   └── viewer/
└── package.json                   # Script entry: npm run screenshots
```

## Dependencies

### Runtime
- **playwright**: Browser automation
- **typescript**: Language
- **tsx**: TypeScript execution

### Development
- **@types/node**: Node.js type definitions

### External Services
- **Frontend**: Vite development server (port 5173)
- **Backend**: Hapi.js API server (port 3001)
- **Database**: PostgreSQL (port 5432)

## Error Handling

### Server Not Running
```
❌ Servers are not running!
Please start the servers first:
  1. Start backend: cd backend && npm run dev
  2. Start frontend: cd frontend && npm run dev
Or run both: npm run dev
```

### Login Failure
```typescript
try {
  await login(page, userType);
} catch (error) {
  console.error(`❌ Failed to login as ${userType}`);
  // Continue with next user
}
```

### Screenshot Failure
```typescript
try {
  await takeScreenshot(page, route, userType);
} catch (error) {
  console.error(`❌ Failed to capture ${route.name}`);
  // Continue with next route
}
```

## Performance Considerations

### Parallelization
- Users processed sequentially (one at a time)
- Routes processed sequentially within each user
- Rationale: Prevent session conflicts and reduce memory usage

### Memory Management
- Browser context closed after each user
- Page instances reused within context
- Headless mode reduces memory footprint

### Optimization Opportunities
1. **Parallel Route Capture**: Process routes in parallel per user
2. **Screenshot Compression**: Add PNG optimization
3. **Incremental Updates**: Only capture changed pages
4. **Caching**: Skip unchanged pages based on last modified

## Security Considerations

### Credentials
- Test credentials only (not production)
- Stored in local configuration files
- Not committed to version control (in real deployments)

### Data Protection
- Screenshots may contain PHI (Patient Health Information)
- Store in secure location
- Do not commit to public repositories
- Clean up after demos/presentations

### Access Control
- Script validates authentication before capturing
- Access denied pages included to demonstrate RBAC
- No attempt to bypass security controls

## Testing Strategy

### Unit Tests (Future)
- Server health check function
- Route configuration validation
- File system operations

### Integration Tests (Future)
- Full screenshot generation with mock servers
- Authentication flow validation
- Error handling scenarios

### Manual Testing (Current)
1. Start servers
2. Run script
3. Verify screenshots exist
4. Check screenshot quality
5. Validate RBAC demonstration

## Extensibility

### Adding New Routes
```typescript
// In generate-screenshots.ts
const ROUTES = {
  // Existing routes...
  
  // Add new route
  admin: [
    // Existing admin routes...
    { 
      path: '/new-feature', 
      name: 'new-feature', 
      description: 'New Feature Page' 
    }
  ]
};
```

### Adding New Roles
```typescript
// In generate-screenshots.ts
const USERS = {
  // Existing users...
  
  // Add new role
  doctor: {
    email: 'doctor@school.edu',
    password: 'DoctorPassword123!',
    role: 'DOCTOR',
    name: 'Doctor'
  }
};

// In main()
await captureUserScreenshots(browser, 'doctor');
```

### Custom Screenshot Options
```typescript
await page.screenshot({
  path: screenshotPath,
  fullPage: true,
  
  // Add custom options
  quality: 80,              // JPEG quality (if type: 'jpeg')
  type: 'png',              // 'png' or 'jpeg'
  clip: {                   // Specific region
    x: 0,
    y: 0,
    width: 1920,
    height: 1080
  }
});
```

## Troubleshooting

### Common Issues

1. **Timeout Errors**
   - Increase `CONFIG.timeout`
   - Check server response times
   - Verify network connectivity

2. **Login Failures**
   - Verify test users exist in database
   - Check credentials in users.json
   - Ensure backend authentication is working

3. **Empty Screenshots**
   - Increase wait time after navigation
   - Check for JavaScript errors in page
   - Verify content is rendering

4. **Missing Pages**
   - Verify route paths are correct
   - Check user has permission to access
   - Look for navigation redirects

## Future Enhancements

1. **CI/CD Integration**: Run as part of build pipeline
2. **Visual Regression**: Compare screenshots across versions
3. **Responsive Screenshots**: Capture multiple viewport sizes
4. **PDF Generation**: Compile screenshots into documentation
5. **Annotation**: Add labels and callouts to screenshots
6. **Diff Highlighting**: Show changes between versions
7. **Interactive Mode**: Allow user to select pages
8. **Scheduled Execution**: Periodic screenshot updates
9. **Cloud Storage**: Upload to S3/Azure Blob
10. **Notification**: Alert on completion/failures
