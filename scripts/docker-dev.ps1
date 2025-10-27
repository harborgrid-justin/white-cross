# =============================================================================
# White Cross Healthcare Platform - Docker Development Startup Script (PowerShell)
# Comprehensive setup and debugging for Next.js + Backend containers
# =============================================================================

param(
    [Parameter(Position=0)]
    [string]$Action = "start"
)

# Color functions
function Write-ColorOutput {
    param(
        [string]$ForegroundColor,
        [string]$Message
    )
    $originalColor = $Host.UI.RawUI.ForegroundColor
    $Host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $Host.UI.RawUI.ForegroundColor = $originalColor
}

function Write-Success { param($Message) Write-ColorOutput "Green" "✅ $Message" }
function Write-Warning { param($Message) Write-ColorOutput "Yellow" "⚠️  $Message" }
function Write-Error { param($Message) Write-ColorOutput "Red" "❌ $Message" }
function Write-Info { param($Message) Write-ColorOutput "Cyan" "ℹ️  $Message" }
function Write-Header { param($Message) Write-ColorOutput "Blue" "🔷 $Message" }

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir

Write-Header "=============================================================================="
Write-Header "White Cross Healthcare Platform - Docker Development Setup"
Write-Header "=============================================================================="

# Function to check if Docker is running
function Test-Docker {
    try {
        docker info *>$null
        Write-Success "Docker is running"
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker Desktop first."
        return $false
    }
}

# Function to clean up existing containers
function Invoke-Cleanup {
    Write-Warning "Cleaning up existing containers..."
    try {
        docker-compose -f docker-compose.nextjs.yml down --remove-orphans 2>$null
        docker system prune -f *>$null
        Write-Success "Cleanup completed"
    }
    catch {
        Write-Warning "Cleanup had some issues, continuing..."
    }
}

# Function to build and start services
function Start-Services {
    Write-Warning "Building and starting services..."
    
    # Load environment variables
    $envFile = Join-Path $RootDir ".env.docker"
    if (Test-Path $envFile) {
        Write-Success "Loading environment variables from .env.docker"
    }
    else {
        Write-Warning "No .env.docker file found, using defaults"
    }
    
    try {
        # Start database and cache first
        Write-Info "Starting PostgreSQL and Redis..."
        docker-compose -f docker-compose.nextjs.yml up --build -d postgres redis
        
        Write-Info "Waiting for database to be ready..."
        Start-Sleep -Seconds 10
        
        # Start backend
        Write-Info "Starting backend API..."
        docker-compose -f docker-compose.nextjs.yml up --build -d backend
        
        Write-Info "Waiting for backend to be ready..."
        Start-Sleep -Seconds 15
        
        # Start frontend
        Write-Info "Starting Next.js frontend..."
        docker-compose -f docker-compose.nextjs.yml up --build -d nextjs
        
        Write-Success "All services started successfully"
    }
    catch {
        Write-Error "Failed to start services: $_"
        throw
    }
}

# Function to show service status
function Show-Status {
    Write-Header "Service Status:"
    docker-compose -f docker-compose.nextjs.yml ps
    
    Write-Output ""
    Write-Header "Service URLs:"
    Write-Success "Frontend (Next.js): http://localhost:3000"
    Write-Success "Backend API: http://localhost:3001/api/v1"
    Write-Success "Database: localhost:5432"
    Write-Success "Redis: localhost:6379"
}

# Function to test connectivity
function Test-Connectivity {
    Write-Output ""
    Write-Header "Testing service connectivity..."
    
    # Test backend health
    Write-Info "Testing backend health endpoint..."
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/api/v1/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Success "Backend health check passed"
        }
        else {
            Write-Error "Backend health check failed (Status: $($response.StatusCode))"
        }
    }
    catch {
        Write-Error "Backend health check failed: $($_.Exception.Message)"
    }
    
    # Test Next.js
    Write-Info "Testing Next.js application..."
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Success "Next.js application accessible"
        }
        else {
            Write-Error "Next.js application not accessible (Status: $($response.StatusCode))"
        }
    }
    catch {
        Write-Error "Next.js application not accessible: $($_.Exception.Message)"
    }
    
    # Test internal container communication
    Write-Info "Testing container-to-container communication..."
    try {
        $result = docker-compose -f docker-compose.nextjs.yml exec -T nextjs curl -f -s http://backend:3001/api/v1/health 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Internal container communication working"
        }
        else {
            Write-Error "Internal container communication failed"
        }
    }
    catch {
        Write-Error "Internal container communication test failed: $($_.Exception.Message)"
    }
}

# Function to show logs
function Show-Logs {
    Write-Output ""
    Write-Header "Recent logs:"
    Write-Warning "--- Backend Logs ---"
    docker-compose -f docker-compose.nextjs.yml logs --tail=20 backend
    
    Write-Output ""
    Write-Warning "--- Next.js Logs ---"
    docker-compose -f docker-compose.nextjs.yml logs --tail=20 nextjs
}

# Function to enter debug mode
function Enter-Debug {
    Write-Header "Starting debug container..."
    docker-compose -f docker-compose.nextjs.yml --profile debug up -d debug
    Write-Success "Debug container started. Use 'docker exec -it white-cross-debug /bin/bash' to enter."
}

# Main execution
Set-Location $RootDir

switch ($Action.ToLower()) {
    "start" {
        if (-not (Test-Docker)) { exit 1 }
        Invoke-Cleanup
        Start-Services
        Show-Status
        Test-Connectivity
    }
    "stop" {
        Write-Warning "Stopping services..."
        docker-compose -f docker-compose.nextjs.yml down
    }
    "restart" {
        Write-Warning "Restarting services..."
        docker-compose -f docker-compose.nextjs.yml restart
        Show-Status
    }
    "status" {
        Show-Status
    }
    "logs" {
        Show-Logs
    }
    "test" {
        Test-Connectivity
    }
    "debug" {
        Enter-Debug
    }
    "clean" {
        Invoke-Cleanup
        Write-Info "Cleaning volumes and images..."
        docker volume prune -f *>$null
        docker image prune -f *>$null
        Write-Success "Clean up completed"
    }
    default {
        Write-Header "Usage: .\docker-dev.ps1 [start|stop|restart|status|logs|test|debug|clean]"
        Write-Success "  start   - Build and start all services (default)"
        Write-Success "  stop    - Stop all services"
        Write-Success "  restart - Restart all services"
        Write-Success "  status  - Show service status and URLs"
        Write-Success "  logs    - Show recent logs from all services"
        Write-Success "  test    - Test connectivity between services"
        Write-Success "  debug   - Start debug container for network troubleshooting"
        Write-Success "  clean   - Clean up containers, volumes, and images"
    }
}