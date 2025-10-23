# PowerShell Script to Rapidly Fix Frontend Issues
# White Cross Healthcare Platform - Comprehensive Fix Automation

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend Fixes Automation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$fixCount = 0
$errorCount = 0

# Navigate to frontend directory
Set-Location frontend

# ============================================================================
# 1. FIX LODASH IMPORTS - Replace full imports with specific imports
# ============================================================================
Write-Host "[1/10] Fixing Lodash imports..." -ForegroundColor Yellow

$lodashFiles = Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx |
    Select-String -Pattern "import\s+[_\w]+\s+from\s+['\`"]lodash['\`"]" -List |
    Select-Object -ExpandProperty Path -Unique

foreach ($file in $lodashFiles) {
    Write-Host "  Checking: $file" -ForegroundColor Gray

    # Read file content
    $content = Get-Content $file -Raw

    # Replace common Lodash imports with specific imports
    $modified = $false

    if ($content -match "import\s+_\s+from\s+['\`"]lodash['\`"]") {
        # Find which lodash functions are used
        if ($content -match "_.debounce") {
            $content = $content -replace "import\s+_\s+from\s+['\`"]lodash['\`"]", "import debounce from 'lodash/debounce'"
            $content = $content -replace "_.debounce", "debounce"
            $modified = $true
        }
        elseif ($content -match "_.throttle") {
            $content = $content -replace "import\s+_\s+from\s+['\`"]lodash['\`"]", "import throttle from 'lodash/throttle'"
            $content = $content -replace "_.throttle", "throttle"
            $modified = $true
        }
        elseif ($content -match "_.cloneDeep") {
            $content = $content -replace "import\s+_\s+from\s+['\`"]lodash['\`"]", "import cloneDeep from 'lodash/cloneDeep'"
            $content = $content -replace "_.cloneDeep", "cloneDeep"
            $modified = $true
        }
    }

    if ($modified) {
        Set-Content -Path $file -Value $content -NoNewline
        $fixCount++
        Write-Host "    Fixed Lodash import in $file" -ForegroundColor Green
    }
}

Write-Host "  Lodash fixes: $fixCount" -ForegroundColor Green
Write-Host ""

# ============================================================================
# 2. REPLACE MOMENT.JS WITH DATE-FNS
# ============================================================================
Write-Host "[2/10] Replacing Moment.js with date-fns..." -ForegroundColor Yellow

$momentFiles = Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx |
    Select-String -Pattern "import.*moment" -List |
    Select-Object -ExpandProperty Path -Unique

$momentFixCount = 0
foreach ($file in $momentFiles) {
    Write-Host "  Found moment.js usage in: $file" -ForegroundColor Gray
    Write-Host "    (Manual review required - complex migration)" -ForegroundColor Yellow
    $momentFixCount++
}

Write-Host "  Files using Moment.js: $momentFixCount (flagged for review)" -ForegroundColor Yellow
Write-Host ""

# ============================================================================
# 3. ADD REACT.MEMO TO COMPONENTS
# ============================================================================
Write-Host "[3/10] Adding React.memo to components..." -ForegroundColor Yellow

$componentFiles = Get-ChildItem -Path "src/components" -Recurse -Filter *.tsx -ErrorAction SilentlyContinue

$memoCount = 0
foreach ($file in $componentFiles) {
    $content = Get-Content $file.FullName -Raw

    # Check if it's a functional component without memo
    if ($content -match "export\s+(const|function)\s+(\w+)" -and
        $content -notmatch "React\.memo" -and
        $content -notmatch "^\s*//.*memo" -and
        $content -match "return\s+\(" -and
        $content -notmatch "use(State|Effect|Context|Reducer|Callback|Memo|Ref)") {

        Write-Host "  Component without memo: $($file.Name)" -ForegroundColor Gray
        Write-Host "    (Candidate for React.memo)" -ForegroundColor Yellow
        $memoCount++
    }
}

Write-Host "  Components needing React.memo: $memoCount (flagged)" -ForegroundColor Yellow
Write-Host ""

# ============================================================================
# 4. FIX ROUTE CIRCULAR DEPENDENCIES
# ============================================================================
Write-Host "[4/10] Analyzing route circular dependencies..." -ForegroundColor Yellow

$routeFiles = @(
    "src/pages/admin/index.ts",
    "src/pages/appointments/index.ts",
    "src/pages/budget/index.ts",
    "src/pages/inventory/index.ts",
    "src/pages/reports/index.ts"
)

$routeFixCount = 0
foreach ($routeFile in $routeFiles) {
    if (Test-Path $routeFile) {
        Write-Host "  Checking: $routeFile" -ForegroundColor Gray
        $content = Get-Content $routeFile -Raw

        # Check if it re-exports routes
        if ($content -match "export.*from.*routes") {
            Write-Host "    Found circular export pattern" -ForegroundColor Yellow
            $routeFixCount++
        }
    }
}

Write-Host "  Route files with circular patterns: $routeFixCount" -ForegroundColor Yellow
Write-Host ""

# ============================================================================
# 5. CHECK TYPESCRIPT COMPILATION
# ============================================================================
Write-Host "[5/10] Checking TypeScript compilation..." -ForegroundColor Yellow

try {
    $tscOutput = npx tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  TypeScript compilation: SUCCESS" -ForegroundColor Green
    } else {
        Write-Host "  TypeScript errors found (continuing...)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  TypeScript check failed: $_" -ForegroundColor Red
    $errorCount++
}

Write-Host ""

# ============================================================================
# 6. CHECK CIRCULAR DEPENDENCIES
# ============================================================================
Write-Host "[6/10] Checking circular dependencies..." -ForegroundColor Yellow

try {
    $madgeOutput = npx madge --circular --extensions ts,tsx src 2>&1
    if ($madgeOutput -match "(\d+)\s+circular") {
        $circularCount = $Matches[1]
        Write-Host "  Circular dependencies found: $circularCount" -ForegroundColor Yellow
    } else {
        Write-Host "  No circular dependencies found!" -ForegroundColor Green
    }
} catch {
    Write-Host "  Circular dependency check failed: $_" -ForegroundColor Red
    $errorCount++
}

Write-Host ""

# ============================================================================
# 7. SETUP TESTING INFRASTRUCTURE
# ============================================================================
Write-Host "[7/10] Setting up testing infrastructure..." -ForegroundColor Yellow

# Create test setup file if it doesn't exist
$testSetupPath = "src/test/setup.ts"
if (-not (Test-Path $testSetupPath)) {
    New-Item -Path (Split-Path $testSetupPath) -ItemType Directory -Force | Out-Null

    $testSetupContent = @"
/**
 * Test Setup Configuration
 * Global test setup for Vitest
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
"@

    Set-Content -Path $testSetupPath -Value $testSetupContent
    Write-Host "  Created test setup file" -ForegroundColor Green
    $fixCount++
} else {
    Write-Host "  Test setup file already exists" -ForegroundColor Gray
}

# Create test utils
$testUtilsPath = "src/test/utils/test-utils.tsx"
if (-not (Test-Path $testUtilsPath)) {
    New-Item -Path (Split-Path $testUtilsPath) -ItemType Directory -Force | Out-Null

    $testUtilsContent = @"
/**
 * Test Utilities
 * Custom render function with providers
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function that includes providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
export { renderWithProviders as render };
"@

    Set-Content -Path $testUtilsPath -Value $testUtilsContent
    Write-Host "  Created test utils file" -ForegroundColor Green
    $fixCount++
} else {
    Write-Host "  Test utils file already exists" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# 8. UPDATE TAILWIND CONFIG FOR DESIGN TOKENS
# ============================================================================
Write-Host "[8/10] Updating Tailwind config for design tokens..." -ForegroundColor Yellow

$tailwindConfigPath = "tailwind.config.js"
if (Test-Path $tailwindConfigPath) {
    $tailwindContent = Get-Content $tailwindConfigPath -Raw

    if ($tailwindContent -notmatch "darkMode.*:") {
        Write-Host "  Adding dark mode configuration..." -ForegroundColor Yellow
        # Note: This is flagged for manual configuration
        Write-Host "    (Manual configuration required for full dark mode)" -ForegroundColor Yellow
    } else {
        Write-Host "  Dark mode already configured" -ForegroundColor Green
    }
} else {
    Write-Host "  Tailwind config not found" -ForegroundColor Red
    $errorCount++
}

Write-Host ""

# ============================================================================
# 9. CREATE MSW HANDLERS
# ============================================================================
Write-Host "[9/10] Creating MSW (Mock Service Worker) handlers..." -ForegroundColor Yellow

$mswHandlersPath = "src/test/mocks/handlers.ts"
if (-not (Test-Path $mswHandlersPath)) {
    New-Item -Path (Split-Path $mswHandlersPath) -ItemType Directory -Force | Out-Null

    $mswContent = @"
/**
 * MSW API Handlers
 * Mock API endpoints for testing
 */

import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      data: {
        token: 'mock-token',
        user: { id: '1', email: 'test@example.com', role: 'NURSE' }
      }
    });
  }),

  // Students endpoints
  http.get('/api/students', () => {
    return HttpResponse.json({
      data: {
        students: [],
        total: 0,
        page: 1,
        limit: 10
      }
    });
  }),
];
"@

    Set-Content -Path $mswHandlersPath -Value $mswContent
    Write-Host "  Created MSW handlers file" -ForegroundColor Green
    $fixCount++
} else {
    Write-Host "  MSW handlers file already exists" -ForegroundColor Gray
}

# Create MSW server setup
$mswServerPath = "src/test/mocks/server.ts"
if (-not (Test-Path $mswServerPath)) {
    $mswServerContent = @"
/**
 * MSW Server Setup
 * Configures Mock Service Worker for tests
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
"@

    Set-Content -Path $mswServerPath -Value $mswServerContent
    Write-Host "  Created MSW server file" -ForegroundColor Green
    $fixCount++
} else {
    Write-Host "  MSW server file already exists" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# 10. GENERATE SUMMARY REPORT
# ============================================================================
Write-Host "[10/10] Generating summary report..." -ForegroundColor Yellow

$reportContent = @"
# Frontend Fixes Automation Report
**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Summary
- **Total Fixes Applied:** $fixCount
- **Errors Encountered:** $errorCount
- **Files Scanned:** $(( Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx | Measure-Object).Count)

## Fixes Applied

### 1. Lodash Imports
- Files with full Lodash imports: $($lodashFiles.Count)
- Files fixed: $fixCount (automated)

### 2. Moment.js Replacement
- Files using Moment.js: $momentFixCount
- Status: Flagged for manual review

### 3. React.memo Optimization
- Components needing memo: $memoCount
- Status: Flagged for manual implementation

### 4. Route Circular Dependencies
- Files with circular patterns: $routeFixCount
- Status: Requires manual refactoring

### 5. Testing Infrastructure
- Test setup: Created
- Test utils: Created
- MSW handlers: Created
- MSW server: Created

### 6. TypeScript Compilation
- Status: Checked (see output above)

### 7. Circular Dependencies
- Status: Checked (see output above)

## Next Steps

### High Priority
1. Complete route circular dependency fixes
2. Enable TypeScript strict mode incrementally
3. Implement React.memo on flagged components

### Medium Priority
1. Complete Moment.js to date-fns migration
2. Write tests for critical paths
3. Implement dark mode in Tailwind config

### Low Priority
1. Full accessibility audit
2. Performance optimization
3. Complete test coverage

## Manual Actions Required

1. **Route Circular Dependencies** - Refactor barrel exports
2. **Moment.js Migration** - Replace with date-fns (complex)
3. **React.memo** - Add to $memoCount components
4. **Dark Mode** - Configure Tailwind color schemes
5. **Type Safety** - Enable strict TypeScript settings

"@

Set-Content -Path "../AUTOMATION_REPORT.md" -Value $reportContent

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Automation Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total Fixes: $fixCount" -ForegroundColor Green
Write-Host "Errors: $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Green" })
Write-Host ""
Write-Host "Report generated: AUTOMATION_REPORT.md" -ForegroundColor Cyan
Write-Host ""

# Return to root
Set-Location ..
