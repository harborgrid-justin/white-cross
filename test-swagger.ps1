# White Cross Backend - Swagger API Documentation Test Script
# PowerShell script to start the backend server and test Swagger documentation

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "White Cross Backend - Swagger API Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set location to backend directory
Set-Location -Path "F:\temp\white-cross\backend"

Write-Host "[1/5] Checking Node.js installation..." -ForegroundColor Yellow
node --version
npm --version
Write-Host ""

Write-Host "[2/5] Installing dependencies (if needed)..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "Installing npm packages..." -ForegroundColor Green
    npm install
} else {
    Write-Host "Dependencies already installed." -ForegroundColor Green
}
Write-Host ""

Write-Host "[3/5] Checking environment configuration..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Write-Host "WARNING: .env file not found. Creating from .env.example..." -ForegroundColor Red
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Please configure .env file and run this script again." -ForegroundColor Yellow
        exit 1
    } else {
        Write-Host "ERROR: No .env.example found. Please create .env file manually." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host ".env file found." -ForegroundColor Green
}
Write-Host ""

Write-Host "[4/5] Building TypeScript..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build completed with warnings (continuing)..." -ForegroundColor Yellow
}
Write-Host ""

Write-Host "[5/5] Starting development server..." -ForegroundColor Yellow
Write-Host "Server will start on port 3001 (default)" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Swagger Documentation URLs:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Swagger UI:          http://localhost:3001/documentation" -ForegroundColor White
Write-Host "Alternative UI:      http://localhost:3001/docs" -ForegroundColor White
Write-Host "OpenAPI JSON:        http://localhost:3001/documentation/swagger.json" -ForegroundColor White
Write-Host "Health Check:        http://localhost:3001/health" -ForegroundColor White
Write-Host "GraphQL Playground:  http://localhost:3001/graphql" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run dev
