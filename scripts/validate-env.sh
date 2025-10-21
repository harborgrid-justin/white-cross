#!/bin/bash

##############################################################################
# White Cross Healthcare Platform - Environment Validation Script
#
# Purpose: Validate environment configuration before deployment
# Usage: ./scripts/validate-env.sh [development|staging|production]
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
ENVIRONMENT="${1:-development}"
ENV_FILE="${PROJECT_ROOT}/.env.${ENVIRONMENT}"

ERRORS=0
WARNINGS=0

log() {
  echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

log_error() {
  echo -e "${RED}✗${NC} $1"
  ((ERRORS++))
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
  ((WARNINGS++))
}

##############################################################################
# Validation Functions
##############################################################################

check_file_exists() {
  log "Checking if environment file exists..."

  if [ ! -f "$ENV_FILE" ]; then
    log_error "Environment file not found: $ENV_FILE"
    log "Run './scripts/setup-env.sh $ENVIRONMENT' to create it"
    exit 1
  fi

  log_success "Environment file found: $ENV_FILE"
}

validate_required_variables() {
  log "Validating required environment variables..."

  local required_vars=(
    "NODE_ENV"
    "PORT"
    "DB_HOST"
    "DB_PORT"
    "DB_NAME"
    "DB_USER"
    "DB_PASSWORD"
    "REDIS_HOST"
    "REDIS_PORT"
    "JWT_SECRET"
    "JWT_EXPIRATION"
    "SESSION_SECRET"
    "BCRYPT_ROUNDS"
    "CORS_ORIGIN"
    "LOG_LEVEL"
  )

  source "$ENV_FILE"

  for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
      log_error "Required variable $var is not set"
    else
      log_success "$var is set"
    fi
  done
}

validate_database_config() {
  log "Validating database configuration..."

  source "$ENV_FILE"

  # Check DB_SSL for non-development
  if [ "$ENVIRONMENT" != "development" ] && [ "${DB_SSL:-false}" != "true" ]; then
    log_error "DB_SSL must be true for $ENVIRONMENT environment"
  fi

  # Check DB_LOGGING
  if [ "$ENVIRONMENT" = "production" ] && [ "${DB_LOGGING:-false}" = "true" ]; then
    log_warning "DB_LOGGING should be false in production for performance"
  fi

  # Validate pool settings for production
  if [ "$ENVIRONMENT" = "production" ]; then
    if [ -z "${DB_POOL_MAX:-}" ]; then
      log_warning "DB_POOL_MAX not set, using default"
    fi
  fi

  log_success "Database configuration validated"
}

validate_security_config() {
  log "Validating security configuration..."

  source "$ENV_FILE"

  # Check JWT_SECRET strength
  if [ -n "${JWT_SECRET:-}" ]; then
    local secret_length=${#JWT_SECRET}
    if [ $secret_length -lt 32 ]; then
      log_error "JWT_SECRET is too short (${secret_length} chars). Minimum 32 characters required"
    else
      log_success "JWT_SECRET length is sufficient"
    fi

    # Check for weak secrets
    if [[ "$JWT_SECRET" =~ ^(secret|password|test|dev|admin) ]]; then
      log_error "JWT_SECRET appears to be a weak/default value"
    fi
  fi

  # Check SESSION_SECRET
  if [ -n "${SESSION_SECRET:-}" ]; then
    local session_secret_length=${#SESSION_SECRET}
    if [ $session_secret_length -lt 32 ]; then
      log_error "SESSION_SECRET is too short. Minimum 32 characters required"
    else
      log_success "SESSION_SECRET length is sufficient"
    fi
  fi

  # Check BCRYPT_ROUNDS
  if [ -n "${BCRYPT_ROUNDS:-}" ]; then
    if [ "$BCRYPT_ROUNDS" -lt 10 ]; then
      log_warning "BCRYPT_ROUNDS should be at least 10"
    elif [ "$BCRYPT_ROUNDS" -gt 15 ]; then
      log_warning "BCRYPT_ROUNDS > 15 may cause performance issues"
    else
      log_success "BCRYPT_ROUNDS is appropriate"
    fi
  fi

  # Check rate limiting
  if [ "$ENVIRONMENT" != "development" ]; then
    if [ -z "${RATE_LIMIT_MAX_REQUESTS:-}" ]; then
      log_warning "RATE_LIMIT_MAX_REQUESTS not set"
    fi
  fi
}

validate_hipaa_compliance() {
  log "Validating HIPAA compliance requirements..."

  source "$ENV_FILE"

  local hipaa_errors=0

  # Audit logging must be enabled
  if [ "${AUDIT_LOG_ENABLED:-false}" != "true" ]; then
    log_error "AUDIT_LOG_ENABLED must be true for HIPAA compliance"
    ((hipaa_errors++))
  else
    log_success "Audit logging is enabled"
  fi

  # Check audit retention period
  if [ -n "${AUDIT_LOG_RETENTION_DAYS:-}" ]; then
    if [ "$ENVIRONMENT" != "development" ] && [ "$AUDIT_LOG_RETENTION_DAYS" -lt 2555 ]; then
      log_error "AUDIT_LOG_RETENTION_DAYS must be at least 2555 (7 years) for HIPAA"
      ((hipaa_errors++))
    else
      log_success "Audit log retention period is compliant"
    fi
  else
    log_error "AUDIT_LOG_RETENTION_DAYS not set"
    ((hipaa_errors++))
  fi

  # Encryption at rest for non-development
  if [ "$ENVIRONMENT" != "development" ]; then
    if [ "${ENCRYPTION_AT_REST:-false}" != "true" ]; then
      log_error "ENCRYPTION_AT_REST must be true for HIPAA compliance in $ENVIRONMENT"
      ((hipaa_errors++))
    else
      log_success "Encryption at rest is enabled"
    fi
  fi

  # SSL/TLS requirements
  if [ "$ENVIRONMENT" != "development" ]; then
    if [ "${DB_SSL:-false}" != "true" ]; then
      log_error "DB_SSL must be true for secure database connections"
      ((hipaa_errors++))
    fi

    if [ "${REDIS_TLS:-false}" != "true" ]; then
      log_warning "REDIS_TLS should be true for secure Redis connections"
    fi
  fi

  if [ $hipaa_errors -eq 0 ]; then
    log_success "HIPAA compliance validation passed"
  else
    log_error "HIPAA compliance validation failed with $hipaa_errors errors"
  fi
}

validate_cors_config() {
  log "Validating CORS configuration..."

  source "$ENV_FILE"

  if [ -n "${CORS_ORIGIN:-}" ]; then
    # Check for wildcard in production
    if [ "$ENVIRONMENT" = "production" ] && [ "$CORS_ORIGIN" = "*" ]; then
      log_error "CORS_ORIGIN should not be '*' in production"
    else
      log_success "CORS_ORIGIN is properly configured"
    fi

    # Verify CORS_ORIGIN matches FRONTEND_URL
    if [ -n "${FRONTEND_URL:-}" ] && [ "$CORS_ORIGIN" != "$FRONTEND_URL" ]; then
      log_warning "CORS_ORIGIN doesn't match FRONTEND_URL"
    fi
  else
    log_error "CORS_ORIGIN not set"
  fi
}

validate_logging_config() {
  log "Validating logging configuration..."

  source "$ENV_FILE"

  local valid_log_levels=("error" "warn" "info" "debug" "trace")

  if [ -n "${LOG_LEVEL:-}" ]; then
    if [[ ! " ${valid_log_levels[@]} " =~ " ${LOG_LEVEL} " ]]; then
      log_error "Invalid LOG_LEVEL: $LOG_LEVEL"
    else
      log_success "LOG_LEVEL is valid"

      # Environment-specific recommendations
      if [ "$ENVIRONMENT" = "production" ] && [[ "$LOG_LEVEL" =~ ^(debug|trace)$ ]]; then
        log_warning "LOG_LEVEL $LOG_LEVEL is too verbose for production"
      fi

      if [ "$ENVIRONMENT" = "development" ] && [ "$LOG_LEVEL" = "error" ]; then
        log_warning "LOG_LEVEL $LOG_LEVEL may hide useful development information"
      fi
    fi
  else
    log_error "LOG_LEVEL not set"
  fi
}

validate_smtp_config() {
  log "Validating SMTP configuration..."

  source "$ENV_FILE"

  if [ "$ENVIRONMENT" != "development" ]; then
    if [ -z "${SMTP_HOST:-}" ] || [ -z "${SMTP_USER:-}" ]; then
      log_warning "SMTP configuration incomplete - email features may not work"
    else
      log_success "SMTP configuration present"
    fi
  fi
}

validate_aws_config() {
  log "Validating AWS configuration..."

  source "$ENV_FILE"

  if [ "$ENVIRONMENT" != "development" ]; then
    local required_aws_vars=("AWS_REGION" "S3_BUCKET")

    for var in "${required_aws_vars[@]}"; do
      if [ -z "${!var:-}" ]; then
        log_error "AWS variable $var not set"
      else
        log_success "AWS $var is set"
      fi
    done
  fi
}

validate_monitoring_config() {
  log "Validating monitoring configuration..."

  source "$ENV_FILE"

  if [ "$ENVIRONMENT" != "development" ]; then
    if [ -z "${SENTRY_DSN:-}" ]; then
      log_warning "SENTRY_DSN not set - error tracking disabled"
    else
      log_success "Sentry error tracking configured"
    fi

    if [ -z "${DATADOG_API_KEY:-}" ]; then
      log_warning "DATADOG_API_KEY not set - metrics collection disabled"
    else
      log_success "DataDog monitoring configured"
    fi
  fi
}

validate_feature_flags() {
  log "Validating feature flags..."

  source "$ENV_FILE"

  # Debug mode should be off in production
  if [ "$ENVIRONMENT" = "production" ] && [ "${ENABLE_DEBUG_MODE:-false}" = "true" ]; then
    log_error "ENABLE_DEBUG_MODE must be false in production"
  fi

  # Mock data should be off in production
  if [ "$ENVIRONMENT" = "production" ] && [ "${ENABLE_MOCK_DATA:-false}" = "true" ]; then
    log_error "ENABLE_MOCK_DATA must be false in production"
  fi

  # API docs should be off in production
  if [ "$ENVIRONMENT" = "production" ] && [ "${ENABLE_API_DOCS:-false}" = "true" ]; then
    log_warning "ENABLE_API_DOCS should typically be false in production"
  fi

  log_success "Feature flags validated"
}

test_database_connection() {
  log "Testing database connection..."

  source "$ENV_FILE"

  if command -v psql &> /dev/null; then
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" &> /dev/null; then
      log_success "Database connection successful"
    else
      log_error "Database connection failed"
    fi
  else
    log_warning "psql not found, skipping database connection test"
  fi
}

test_redis_connection() {
  log "Testing Redis connection..."

  source "$ENV_FILE"

  if command -v redis-cli &> /dev/null; then
    local redis_cmd="redis-cli -h $REDIS_HOST -p $REDIS_PORT"

    if [ -n "${REDIS_PASSWORD:-}" ]; then
      redis_cmd="$redis_cmd -a $REDIS_PASSWORD"
    fi

    if $redis_cmd PING &> /dev/null; then
      log_success "Redis connection successful"
    else
      log_error "Redis connection failed"
    fi
  else
    log_warning "redis-cli not found, skipping Redis connection test"
  fi
}

##############################################################################
# Main Function
##############################################################################

main() {
  log "=========================================="
  log "White Cross - Environment Validation"
  log "=========================================="
  log "Environment: $ENVIRONMENT"
  log "File: $ENV_FILE"
  log ""

  # File existence check
  check_file_exists

  # Configuration validation
  validate_required_variables
  validate_database_config
  validate_security_config
  validate_hipaa_compliance
  validate_cors_config
  validate_logging_config
  validate_smtp_config
  validate_aws_config
  validate_monitoring_config
  validate_feature_flags

  # Connection tests (optional)
  echo ""
  echo "Run connection tests? (y/n)"
  read -r response
  if [ "$response" = "y" ]; then
    test_database_connection
    test_redis_connection
  fi

  # Summary
  log ""
  log "=========================================="
  log "Validation Summary"
  log "=========================================="

  if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    log_success "All validations passed!"
    exit 0
  elif [ $ERRORS -eq 0 ]; then
    log_warning "Validation completed with $WARNINGS warnings"
    exit 0
  else
    log_error "Validation failed with $ERRORS errors and $WARNINGS warnings"
    log "Please fix the errors before deploying to $ENVIRONMENT"
    exit 1
  fi
}

main "$@"
