#!/bin/bash

##############################################################################
# White Cross Healthcare Platform - Deployment Verification Script
#
# Purpose: Comprehensive deployment verification and health checks
# Usage: ./scripts/verify-deployment.sh [staging|production] [url]
##############################################################################

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENVIRONMENT="${1:-staging}"
BASE_URL="${2:-}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${PROJECT_ROOT}/logs/verify_${ENVIRONMENT}_${TIMESTAMP}.log"

mkdir -p "${PROJECT_ROOT}/logs"

CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

log() {
  echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1" | tee -a "$LOG_FILE"
  ((CHECKS_PASSED++))
}

log_error() {
  echo -e "${RED}✗${NC} $1" | tee -a "$LOG_FILE"
  ((CHECKS_FAILED++))
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} $1" | tee -a "$LOG_FILE"
  ((CHECKS_WARNING++))
}

##############################################################################
# Configuration
##############################################################################

get_base_url() {
  if [ -n "$BASE_URL" ]; then
    echo "$BASE_URL"
    return
  fi

  case "$ENVIRONMENT" in
    staging)
      echo "https://staging.whitecross.example.com"
      ;;
    production)
      echo "https://app.whitecross.com"
      ;;
    *)
      echo "http://localhost:3001"
      ;;
  esac
}

BASE_URL=$(get_base_url)

##############################################################################
# Health Check Functions
##############################################################################

check_basic_health() {
  log "Checking basic health endpoint..."

  local health_url="${BASE_URL}/health"
  local response=$(curl -s -w "\n%{http_code}" "$health_url" 2>&1)
  local http_code=$(echo "$response" | tail -n1)
  local body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "200" ]; then
    log_success "Basic health check passed (HTTP $http_code)"

    # Parse JSON response
    local status=$(echo "$body" | jq -r '.status' 2>/dev/null || echo "unknown")
    if [ "$status" = "ok" ] || [ "$status" = "healthy" ]; then
      log_success "Health status: $status"
    else
      log_warning "Unexpected health status: $status"
    fi
  else
    log_error "Basic health check failed (HTTP $http_code)"
    return 1
  fi
}

check_database_health() {
  log "Checking database connectivity..."

  local health_url="${BASE_URL}/api/v1/health/database"
  local response=$(curl -s -w "\n%{http_code}" "$health_url" 2>&1)
  local http_code=$(echo "$response" | tail -n1)

  if [ "$http_code" = "200" ]; then
    log_success "Database health check passed"
  else
    log_error "Database health check failed (HTTP $http_code)"
    return 1
  fi
}

check_redis_health() {
  log "Checking Redis connectivity..."

  local health_url="${BASE_URL}/api/v1/health/redis"
  local response=$(curl -s -w "\n%{http_code}" "$health_url" 2>&1)
  local http_code=$(echo "$response" | tail -n1)

  if [ "$http_code" = "200" ]; then
    log_success "Redis health check passed"
  else
    log_warning "Redis health check failed (HTTP $http_code) - may be optional"
  fi
}

check_api_version() {
  log "Checking API version..."

  local version_url="${BASE_URL}/api/v1/version"
  local response=$(curl -s "$version_url" 2>&1)

  if [ $? -eq 0 ]; then
    local version=$(echo "$response" | jq -r '.version' 2>/dev/null || echo "unknown")
    log_success "API version: $version"
  else
    log_warning "Unable to retrieve API version"
  fi
}

##############################################################################
# Security Checks
##############################################################################

check_security_headers() {
  log "Checking security headers..."

  local headers=$(curl -I -s "$BASE_URL" 2>&1)

  # Check for required security headers
  local required_headers=(
    "Strict-Transport-Security"
    "X-Content-Type-Options"
    "X-Frame-Options"
    "Content-Security-Policy"
  )

  for header in "${required_headers[@]}"; do
    if echo "$headers" | grep -qi "$header"; then
      log_success "Security header present: $header"
    else
      if [ "$ENVIRONMENT" = "production" ]; then
        log_error "Missing security header: $header"
      else
        log_warning "Missing security header: $header"
      fi
    fi
  done
}

check_ssl_certificate() {
  if [[ "$BASE_URL" == https://* ]]; then
    log "Checking SSL certificate..."

    local domain=$(echo "$BASE_URL" | sed -e 's|^https://||' -e 's|/.*||')
    local ssl_info=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)

    if [ $? -eq 0 ]; then
      log_success "SSL certificate is valid"

      local expiry=$(echo "$ssl_info" | grep "notAfter" | cut -d= -f2)
      log "Certificate expires: $expiry"

      # Check if expiring soon (within 30 days)
      local expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$expiry" +%s 2>/dev/null)
      local now_epoch=$(date +%s)
      local days_until_expiry=$(( (expiry_epoch - now_epoch) / 86400 ))

      if [ $days_until_expiry -lt 30 ]; then
        log_warning "SSL certificate expires in $days_until_expiry days"
      else
        log_success "SSL certificate expires in $days_until_expiry days"
      fi
    else
      log_error "SSL certificate validation failed"
    fi
  fi
}

check_authentication() {
  log "Checking authentication enforcement..."

  # Try accessing a protected endpoint without auth
  local protected_url="${BASE_URL}/api/v1/students"
  local response=$(curl -s -w "\n%{http_code}" "$protected_url" 2>&1)
  local http_code=$(echo "$response" | tail -n1)

  if [ "$http_code" = "401" ] || [ "$http_code" = "403" ]; then
    log_success "Authentication is enforced (HTTP $http_code)"
  else
    log_error "Authentication may not be properly enforced (HTTP $http_code)"
  fi
}

##############################################################################
# HIPAA Compliance Checks
##############################################################################

check_audit_logging() {
  log "Checking audit logging..."

  # This would require admin credentials to verify
  # For now, we'll check if the endpoint exists
  local audit_url="${BASE_URL}/api/v1/health/audit-status"
  local response=$(curl -s -w "\n%{http_code}" "$audit_url" 2>&1)
  local http_code=$(echo "$response" | tail -n1)

  if [ "$http_code" = "200" ] || [ "$http_code" = "401" ]; then
    log_success "Audit logging endpoint is accessible"
  else
    log_warning "Unable to verify audit logging (HTTP $http_code)"
  fi
}

check_encryption_in_transit() {
  log "Checking encryption in transit..."

  if [[ "$BASE_URL" == https://* ]]; then
    log_success "HTTPS is enabled"

    # Check TLS version
    if [[ "$BASE_URL" == https://* ]]; then
      local domain=$(echo "$BASE_URL" | sed -e 's|^https://||' -e 's|/.*||')
      local tls_version=$(echo | openssl s_client -connect "$domain:443" 2>&1 | grep "Protocol" | awk '{print $3}')

      if [[ "$tls_version" == "TLSv1.2" ]] || [[ "$tls_version" == "TLSv1.3" ]]; then
        log_success "TLS version is compliant: $tls_version"
      else
        log_error "TLS version may be outdated: $tls_version"
      fi
    fi
  else
    if [ "$ENVIRONMENT" = "production" ]; then
      log_error "HTTPS is not enabled in production!"
    else
      log_warning "HTTPS is not enabled (acceptable for development)"
    fi
  fi
}

##############################################################################
# Performance Checks
##############################################################################

check_response_time() {
  log "Checking response time..."

  local start=$(date +%s%N)
  curl -s -o /dev/null "$BASE_URL/health"
  local end=$(date +%s%N)

  local response_time=$(( (end - start) / 1000000 ))  # Convert to milliseconds

  if [ $response_time -lt 1000 ]; then
    log_success "Response time: ${response_time}ms"
  elif [ $response_time -lt 3000 ]; then
    log_warning "Response time is acceptable: ${response_time}ms"
  else
    log_error "Response time is too high: ${response_time}ms"
  fi
}

check_rate_limiting() {
  log "Checking rate limiting..."

  # Make multiple rapid requests
  local success_count=0
  local rate_limited=false

  for i in {1..20}; do
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/health")
    if [ "$http_code" = "429" ]; then
      rate_limited=true
      break
    elif [ "$http_code" = "200" ]; then
      ((success_count++))
    fi
  done

  if [ "$rate_limited" = true ]; then
    log_success "Rate limiting is active"
  else
    log_warning "Rate limiting may not be configured (sent $success_count requests)"
  fi
}

##############################################################################
# API Endpoint Checks
##############################################################################

check_critical_endpoints() {
  log "Checking critical API endpoints..."

  local endpoints=(
    "/health"
    "/api/v1/auth/login"
    "/api/v1/students"
    "/api/v1/health-records"
    "/api/v1/medications"
  )

  for endpoint in "${endpoints[@]}"; do
    local url="${BASE_URL}${endpoint}"
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    # 200, 401, 403 are acceptable (depends on auth requirements)
    if [[ "$http_code" == "200" ]] || [[ "$http_code" == "401" ]] || [[ "$http_code" == "403" ]]; then
      log_success "Endpoint accessible: $endpoint (HTTP $http_code)"
    else
      log_error "Endpoint may be broken: $endpoint (HTTP $http_code)"
    fi
  done
}

##############################################################################
# Frontend Checks
##############################################################################

check_frontend_availability() {
  log "Checking frontend availability..."

  local http_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")

  if [ "$http_code" = "200" ]; then
    log_success "Frontend is accessible (HTTP $http_code)"
  else
    log_error "Frontend may not be accessible (HTTP $http_code)"
  fi
}

check_static_assets() {
  log "Checking static assets..."

  # Try to load a common static asset
  local asset_url="${BASE_URL}/assets/index.js"
  local http_code=$(curl -s -o /dev/null -w "%{http_code}" "$asset_url" 2>&1)

  if [ "$http_code" = "200" ]; then
    log_success "Static assets are being served"
  else
    log_warning "Unable to verify static assets (HTTP $http_code)"
  fi
}

##############################################################################
# Database Migration Verification
##############################################################################

check_database_migrations() {
  log "Checking database migration status..."

  # This would typically require database access or an admin API endpoint
  local migration_url="${BASE_URL}/api/v1/health/migrations"
  local response=$(curl -s -w "\n%{http_code}" "$migration_url" 2>&1)
  local http_code=$(echo "$response" | tail -n1)

  if [ "$http_code" = "200" ]; then
    log_success "Database migrations are up to date"
  else
    log_warning "Unable to verify database migration status (HTTP $http_code)"
  fi
}

##############################################################################
# Smoke Tests
##############################################################################

run_smoke_tests() {
  log "Running smoke tests..."

  # Login smoke test
  log "Testing authentication flow..."
  local login_response=$(curl -s -X POST \
    "${BASE_URL}/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}' \
    -w "\n%{http_code}")

  local login_http_code=$(echo "$login_response" | tail -n1)

  if [ "$login_http_code" = "200" ] || [ "$login_http_code" = "401" ]; then
    log_success "Authentication endpoint is functional"
  else
    log_error "Authentication endpoint may be broken (HTTP $login_http_code)"
  fi
}

##############################################################################
# Monitoring Integration
##############################################################################

check_monitoring_integration() {
  log "Checking monitoring integration..."

  # Check if error tracking is configured
  local error_tracking_url="${BASE_URL}/api/v1/health/monitoring"
  local response=$(curl -s -w "\n%{http_code}" "$error_tracking_url" 2>&1)
  local http_code=$(echo "$response" | tail -n1)

  if [ "$http_code" = "200" ]; then
    log_success "Monitoring integration is active"
  else
    log_warning "Unable to verify monitoring integration"
  fi
}

##############################################################################
# Report Generation
##############################################################################

generate_report() {
  log ""
  log "=========================================="
  log "DEPLOYMENT VERIFICATION REPORT"
  log "=========================================="
  log "Environment: $ENVIRONMENT"
  log "Base URL: $BASE_URL"
  log "Timestamp: $TIMESTAMP"
  log ""
  log "Results:"
  log "  ✓ Passed: $CHECKS_PASSED"
  log "  ✗ Failed: $CHECKS_FAILED"
  log "  ⚠ Warnings: $CHECKS_WARNING"
  log ""

  if [ $CHECKS_FAILED -eq 0 ]; then
    log_success "ALL CHECKS PASSED"
    log "Deployment is verified and healthy"
    return 0
  else
    log_error "VERIFICATION FAILED"
    log "$CHECKS_FAILED critical checks failed"
    return 1
  fi
}

##############################################################################
# Main Function
##############################################################################

main() {
  log "=========================================="
  log "White Cross - Deployment Verification"
  log "=========================================="
  log "Environment: $ENVIRONMENT"
  log "Base URL: $BASE_URL"
  log "Timestamp: $TIMESTAMP"
  log "Log file: $LOG_FILE"
  log ""

  # Health Checks
  log "=========================================="
  log "HEALTH CHECKS"
  log "=========================================="
  check_basic_health
  check_database_health
  check_redis_health
  check_api_version

  # Security Checks
  log ""
  log "=========================================="
  log "SECURITY CHECKS"
  log "=========================================="
  check_security_headers
  check_ssl_certificate
  check_authentication
  check_encryption_in_transit

  # HIPAA Compliance
  log ""
  log "=========================================="
  log "HIPAA COMPLIANCE CHECKS"
  log "=========================================="
  check_audit_logging

  # Performance
  log ""
  log "=========================================="
  log "PERFORMANCE CHECKS"
  log "=========================================="
  check_response_time
  check_rate_limiting

  # API Endpoints
  log ""
  log "=========================================="
  log "API ENDPOINT CHECKS"
  log "=========================================="
  check_critical_endpoints

  # Frontend
  log ""
  log "=========================================="
  log "FRONTEND CHECKS"
  log "=========================================="
  check_frontend_availability
  check_static_assets

  # Database
  log ""
  log "=========================================="
  log "DATABASE CHECKS"
  log "=========================================="
  check_database_migrations

  # Smoke Tests
  log ""
  log "=========================================="
  log "SMOKE TESTS"
  log "=========================================="
  run_smoke_tests

  # Monitoring
  log ""
  log "=========================================="
  log "MONITORING CHECKS"
  log "=========================================="
  check_monitoring_integration

  # Generate final report
  log ""
  generate_report
}

# Run main function
main "$@"
exit_code=$?

# Send notification
if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
  local status="success"
  local emoji="✅"
  if [ $exit_code -ne 0 ]; then
    status="failure"
    emoji="❌"
  fi

  curl -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-Type: application/json' \
    -d "{
      \"text\": \"$emoji Deployment Verification - $ENVIRONMENT\",
      \"blocks\": [
        {
          \"type\": \"section\",
          \"text\": {
            \"type\": \"mrkdwn\",
            \"text\": \"*Deployment Verification*\\nEnvironment: $ENVIRONMENT\\nStatus: $status\\nPassed: $CHECKS_PASSED\\nFailed: $CHECKS_FAILED\\nWarnings: $CHECKS_WARNING\"
          }
        }
      ]
    }" &> /dev/null
fi

exit $exit_code
