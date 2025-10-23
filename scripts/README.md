# White Cross Screenshot Generator

This script automatically generates screenshots of all user-accessible pages in the White Cross Healthcare Platform for different user roles.

## Prerequisites

1. **Database Setup**: Ensure the database is running and seeded with test users
2. **Backend Server**: The backend API must be running on http://localhost:3001
3. **Frontend Server**: The frontend must be running on http://localhost:5173

## Usage

### Step 1: Start the Servers

In one terminal, start both backend and frontend:

```bash
npm run dev
```

Or start them separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### Step 2: Run the Screenshot Generator

In another terminal:

```bash
npm run screenshots
```

The script will:
- Check if servers are running
- Login as different user roles (admin, nurse, counselor, viewer)
- Navigate through all accessible pages for each role
- Take full-page screenshots
- Save screenshots to the `screenshots/` directory

## Output Structure

Screenshots are organized by user role:

```
screenshots/
├── public/
│   └── login-page.png
├── admin/
│   ├── dashboard.png
│   ├── health-records.png
│   ├── admin-users.png
│   ├── budget-overview.png
│   └── ...
├── nurse/
│   ├── dashboard.png
│   ├── health-records.png
│   ├── appointments-schedule.png
│   └── ...
├── counselor/
│   ├── dashboard.png
│   └── ...
└── viewer/
    ├── dashboard.png
    └── ...
```

## User Roles

The script captures screenshots for the following roles:

- **Public**: Login page (no authentication)
- **Admin**: Full access to all pages including user management and budget
- **Nurse**: Access to health records, appointments, inventory, and reports
- **Counselor**: Access to basic features
- **Viewer**: Read-only access

## Configuration

You can customize the script by editing `scripts/generate-screenshots.ts`:

- `CONFIG.baseUrl`: Frontend URL (default: http://localhost:5173)
- `CONFIG.apiUrl`: Backend API URL (default: http://localhost:3001)
- `CONFIG.screenshotDir`: Output directory (default: ./screenshots)
- `CONFIG.timeout`: Navigation timeout (default: 30000ms)

## Troubleshooting

### Servers not running
```
❌ Servers are not running!
```
**Solution**: Start the backend and frontend servers first with `npm run dev`

### Login failures
```
❌ Failed to login
```
**Solution**: Ensure the database is seeded with test users. Run:
```bash
npm run db:migrate
npm run db:seed
```

### Timeout errors
**Solution**: Increase the timeout in the CONFIG object or ensure your servers are responding quickly

## Test Users

The script uses these test accounts (from Cypress fixtures):

- Admin: admin@school.edu / AdminPassword123!
- Nurse: nurse@school.edu / NursePassword123!
- Counselor: counselor@school.edu / CounselorPassword123!
- Viewer: readonly@school.edu / ReadOnlyPassword123!

## Development

To modify which pages are captured, edit the `ROUTES` object in `generate-screenshots.ts`:

```typescript
const ROUTES = {
  public: [...],    // Public pages
  common: [...],    // Pages accessible to all authenticated users
  nurse: [...],     // Nurse-specific pages
  admin: [...],     // Admin-specific pages
};
```
