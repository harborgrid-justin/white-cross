#!/bin/bash

##############################################################################
# White Cross Healthcare Platform - Rollback Script
#
# Purpose: Rollback to a previous stable deployment
# Usage: ./scripts/rollback.sh [staging|production] [version|previous]
##############################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENVIRONMENT="${1:-}"
TARGET_VERSION="${2:-previous}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${PROJECT_ROOT}/logs/rollback_${ENVIRONMENT}_${TIMESTAMP}.log"

# Ensure logs directory exists
mkdir -p "${PROJECT_ROOT}/logs"

##############################################################################
# Logging Functions
##############################################################################

log() {
  echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
  echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✓${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
  echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ✗${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
  echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠${NC} $1" | tee -a "$LOG_FILE"
}

##############################################################################
# Validation Functions
##############################################################################

validate_environment() {
  log "Validating environment: $ENVIRONMENT"

  if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    log_error "Invalid environment. Must be 'staging' or 'production'"
    echo "Usage: $0 [staging|production] [version|previous]"
    exit 1
  fi

  log_success "Environment validation passed"
}

validate_aws_credentials() {
  log "Validating AWS credentials..."

  if ! aws sts get-caller-identity &> /dev/null; then
    log_error "AWS credentials are not configured or invalid"
    exit 1
  fi

  log_success "AWS credentials validated"
}

get_deployment_history() {
  log "Fetching deployment history..."

  case "$ENVIRONMENT" in
    staging)
      ECS_CLUSTER="${STAGING_ECS_CLUSTER}"
      ECS_SERVICE="${STAGING_ECS_SERVICE}"
      ;;
    production)
      ECS_CLUSTER="${PRODUCTION_ECS_CLUSTER}"
      ECS_SERVICE="${PRODUCTION_ECS_SERVICE}"
      ;;
  esac

  # Get service deployments
  local deployments=$(aws ecs describe-services \
    --cluster "$ECS_CLUSTER" \
    --services "$ECS_SERVICE" \
    --query 'services[0].deployments' \
    --output json)

  echo "$deployments" | jq -r '.[] | "\(.taskDefinition) | Status: \(.status) | Created: \(.createdAt)"'
}

##############################################################################
# Rollback Functions
##############################################################################

get_previous_task_definition() {
  log "Retrieving previous task definition..."

  case "$ENVIRONMENT" in
    staging)
      ECS_CLUSTER="${STAGING_ECS_CLUSTER}"
      ECS_SERVICE="${STAGING_ECS_SERVICE}"
      ;;
    production)
      ECS_CLUSTER="${PRODUCTION_ECS_CLUSTER}"
      ECS_SERVICE="${PRODUCTION_ECS_SERVICE}"
      ;;
  esac

  if [ "$TARGET_VERSION" = "previous" ]; then
    # Get the previous stable deployment
    local previous_task=$(aws ecs describe-services \
      --cluster "$ECS_CLUSTER" \
      --services "$ECS_SERVICE" \
      --query 'services[0].deployments[1].taskDefinition' \
      --output text)

    if [ -z "$previous_task" ] || [ "$previous_task" = "None" ]; then
      log_error "No previous deployment found"
      exit 1
    fi

    echo "$previous_task"
  else
    # Use specified version
    echo "$TARGET_VERSION"
  fi
}

create_database_backup() {
  log "Creating database backup before rollback..."

  case "$ENVIRONMENT" in
    staging)
      DB_HOST="${STAGING_DB_HOST}"
      DB_NAME="${STAGING_DB_NAME}"
      DB_USER="${STAGING_DB_USER}"
      DB_PASSWORD="${STAGING_DB_PASSWORD}"
      BACKUP_BUCKET="${STAGING_BACKUP_S3_BUCKET}"
      ;;
    production)
      DB_HOST="${PRODUCTION_DB_HOST}"
      DB_NAME="${PRODUCTION_DB_NAME}"
      DB_USER="${PRODUCTION_DB_USER}"
      DB_PASSWORD="${PRODUCTION_DB_PASSWORD}"
      BACKUP_BUCKET="${PRODUCTION_BACKUP_S3_BUCKET}"
      ;;
  esac

  local backup_file="rollback_backup_${TIMESTAMP}.sql"

  PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -F c -f "/tmp/$backup_file"

  # Upload to S3
  aws s3 cp "/tmp/$backup_file" "s3://${BACKUP_BUCKET}/rollback/$backup_file"

  log_success "Database backup created: $backup_file"
  echo "$backup_file"
}

rollback_backend() {
  log "Rolling back backend..."

  case "$ENVIRONMENT" in
    staging)
      ECS_CLUSTER="${STAGING_ECS_CLUSTER}"
      ECS_SERVICE="${STAGING_ECS_SERVICE}"
      ;;
    production)
      ECS_CLUSTER="${PRODUCTION_ECS_CLUSTER}"
      ECS_SERVICE="${PRODUCTION_ECS_SERVICE}"
      ;;
  esac

  local previous_task=$(get_previous_task_definition)

  log "Rolling back to task definition: $previous_task"

  # Update ECS service
  aws ecs update-service \
    --cluster "$ECS_CLUSTER" \
    --service "$ECS_SERVICE" \
    --task-definition "$previous_task" \
    --force-new-deployment

  log_success "Backend rollback initiated"

  # Wait for service to stabilize
  log "Waiting for service to stabilize..."
  aws ecs wait services-stable \
    --cluster "$ECS_CLUSTER" \
    --services "$ECS_SERVICE"

  log_success "Backend service stabilized"
}

rollback_frontend() {
  log "Rolling back frontend..."

  case "$ENVIRONMENT" in
    staging)
      S3_BUCKET="${STAGING_S3_BUCKET}"
      CLOUDFRONT_ID="${STAGING_CLOUDFRONT_ID}"
      BACKUP_BUCKET="${STAGING_BACKUP_S3_BUCKET}"
      ;;
    production)
      S3_BUCKET="${PRODUCTION_S3_BUCKET}"
      CLOUDFRONT_ID="${PRODUCTION_CLOUDFRONT_ID}"
      BACKUP_BUCKET="${PRODUCTION_BACKUP_S3_BUCKET}"
      ;;
  esac

  # Create backup of current version
  log "Backing up current frontend..."
  aws s3 sync "s3://${S3_BUCKET}" "s3://${BACKUP_BUCKET}/frontend/current_${TIMESTAMP}" --delete

  # Get previous version from backup
  if [ "$TARGET_VERSION" = "previous" ]; then
    # List available backups
    log "Retrieving previous frontend version..."
    local previous_backup=$(aws s3 ls "s3://${BACKUP_BUCKET}/frontend/" | \
      grep "PRE" | \
      tail -2 | \
      head -1 | \
      awk '{print $2}' | \
      tr -d '/')

    if [ -z "$previous_backup" ]; then
      log_error "No previous frontend backup found"
      exit 1
    fi

    log "Restoring from backup: $previous_backup"
    aws s3 sync "s3://${BACKUP_BUCKET}/frontend/${previous_backup}" "s3://${S3_BUCKET}" --delete
  else
    log "Restoring from backup: $TARGET_VERSION"
    aws s3 sync "s3://${BACKUP_BUCKET}/frontend/${TARGET_VERSION}" "s3://${S3_BUCKET}" --delete
  fi

  # Invalidate CloudFront cache
  log "Invalidating CloudFront distribution..."
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_ID" \
    --paths "/*"

  log_success "Frontend rollback completed"
}

rollback_database() {
  log_warning "Database rollback requires manual intervention"
  log "Please review migrations and determine if rollback is needed"

  echo "Do you want to rollback the last migration? (y/n)"
  read -r response

  if [ "$response" = "y" ]; then
    cd "${PROJECT_ROOT}/backend"

    case "$ENVIRONMENT" in
      staging)
        DB_HOST="${STAGING_DB_HOST}"
        DB_NAME="${STAGING_DB_NAME}"
        DB_USER="${STAGING_DB_USER}"
        DB_PASSWORD="${STAGING_DB_PASSWORD}"
        ;;
      production)
        DB_HOST="${PRODUCTION_DB_HOST}"
        DB_NAME="${PRODUCTION_DB_NAME}"
        DB_USER="${PRODUCTION_DB_USER}"
        DB_PASSWORD="${PRODUCTION_DB_PASSWORD}"
        ;;
    esac

    # Rollback last migration
    NODE_ENV="$ENVIRONMENT" npx sequelize-cli db:migrate:undo

    log_success "Last database migration rolled back"
    cd "$PROJECT_ROOT"
  else
    log "Database rollback skipped"
  fi
}

verify_rollback() {
  log "Verifying rollback..."

  case "$ENVIRONMENT" in
    staging)
      APP_URL="${STAGING_APP_URL:-https://staging.whitecross.example.com}"
      ;;
    production)
      APP_URL="${PRODUCTION_APP_URL:-https://app.whitecross.com}"
      ;;
  esac

  # Wait for application to be available
  local max_attempts=30
  local attempt=0

  while [ $attempt -lt $max_attempts ]; do
    if curl -f -s "${APP_URL}/health" > /dev/null; then
      log_success "Health check passed"
      break
    fi

    log "Health check attempt $((attempt+1))/$max_attempts failed, retrying in 10s..."
    sleep 10
    attempt=$((attempt+1))
  done

  if [ $attempt -eq $max_attempts ]; then
    log_error "Health check failed after $max_attempts attempts"
    return 1
  fi

  # Check critical endpoints
  log "Verifying critical endpoints..."

  if curl -f -s "${APP_URL}/api/v1/health/database" > /dev/null; then
    log_success "Database connectivity verified"
  else
    log_error "Database health check failed"
    return 1
  fi

  if curl -f -s "${APP_URL}/api/v1/health/redis" > /dev/null; then
    log_success "Redis connectivity verified"
  else
    log_warning "Redis health check failed"
  fi

  log_success "Rollback verification completed"
}

send_notifications() {
  log "Sending rollback notifications..."

  local message="⚠️ Rollback executed on $ENVIRONMENT environment"

  # Slack notification
  if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
    curl -X POST "$SLACK_WEBHOOK_URL" \
      -H 'Content-Type: application/json' \
      -d "{
        \"text\": \"$message\",
        \"blocks\": [
          {
            \"type\": \"section\",
            \"text\": {
              \"type\": \"mrkdwn\",
              \"text\": \"*Rollback Executed*\\nEnvironment: $ENVIRONMENT\\nTimestamp: $TIMESTAMP\\nTarget Version: $TARGET_VERSION\"
            }
          }
        ]
      }"
  fi

  # Email notification for production
  if [ "$ENVIRONMENT" = "production" ] && [ -n "${DEVOPS_EMAIL:-}" ]; then
    echo "Production rollback executed at $TIMESTAMP" | \
      mail -s "[CRITICAL] Production Rollback - White Cross" "$DEVOPS_EMAIL"
  fi

  log_success "Notifications sent"
}

##############################################################################
# Main Rollback Flow
##############################################################################

main() {
  log "=========================================="
  log "White Cross Rollback - $ENVIRONMENT"
  log "=========================================="
  log "Target Version: $TARGET_VERSION"
  log "Timestamp: $TIMESTAMP"
  log "Log file: $LOG_FILE"
  log ""

  # Validation
  validate_environment
  validate_aws_credentials

  # Show deployment history
  log "Current deployment history:"
  get_deployment_history
  log ""

  # Confirm rollback
  log_warning "This will rollback $ENVIRONMENT to $TARGET_VERSION"
  echo "Are you sure you want to proceed? (yes/no)"
  read -r response

  if [ "$response" != "yes" ]; then
    log_error "Rollback cancelled by user"
    exit 1
  fi

  # Create backups
  local db_backup=$(create_database_backup)

  # Execute rollback
  log ""
  log "=========================================="
  log "ROLLBACK EXECUTION"
  log "=========================================="

  rollback_backend
  rollback_frontend

  # Optional database rollback
  rollback_database

  # Verification
  log ""
  log "=========================================="
  log "VERIFICATION"
  log "=========================================="
  verify_rollback

  # Notifications
  send_notifications

  # Success
  log ""
  log "=========================================="
  log_success "ROLLBACK COMPLETED SUCCESSFULLY"
  log "=========================================="
  log "Environment: $ENVIRONMENT"
  log "Rolled back to: $TARGET_VERSION"
  log "Database backup: $db_backup"
  log "Timestamp: $TIMESTAMP"
  log "Log file: $LOG_FILE"
  log ""
  log_warning "Please monitor the application closely"
}

# Error handler
trap 'log_error "Rollback failed at line $LINENO"' ERR

# Run main function
main "$@"
