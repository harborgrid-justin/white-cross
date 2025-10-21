#!/bin/bash

##############################################################################
# White Cross Healthcare Platform - Database Migration Script
#
# Purpose: Safely execute database migrations with backup and rollback
# Usage: ./scripts/migrate-database.sh [staging|production] [up|down|status]
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
ACTION="${2:-up}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${PROJECT_ROOT}/logs/migration_${ENVIRONMENT}_${TIMESTAMP}.log"

mkdir -p "${PROJECT_ROOT}/logs"

log() {
  echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
  echo -e "${RED}✗${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} $1" | tee -a "$LOG_FILE"
}

##############################################################################
# Validation Functions
##############################################################################

validate_environment() {
  log "Validating environment: $ENVIRONMENT"

  if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    log_error "Invalid environment. Must be 'development', 'staging', or 'production'"
    echo "Usage: $0 [development|staging|production] [up|down|status]"
    exit 1
  fi

  log_success "Environment validation passed"
}

validate_action() {
  log "Validating action: $ACTION"

  if [[ ! "$ACTION" =~ ^(up|down|status|pending)$ ]]; then
    log_error "Invalid action. Must be 'up', 'down', 'status', or 'pending'"
    echo "Usage: $0 [development|staging|production] [up|down|status|pending]"
    exit 1
  fi

  log_success "Action validation passed"
}

load_environment_config() {
  log "Loading environment configuration..."

  local env_file="${PROJECT_ROOT}/.env.${ENVIRONMENT}"

  if [ ! -f "$env_file" ]; then
    log_error "Environment file not found: $env_file"
    log "Run './scripts/setup-env.sh $ENVIRONMENT' to create it"
    exit 1
  fi

  # Load environment variables
  set -a
  source "$env_file"
  set +a

  log_success "Environment configuration loaded"
}

check_database_connection() {
  log "Testing database connection..."

  if ! PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -p "${DB_PORT:-5432}" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -c "SELECT 1;" &> /dev/null; then
    log_error "Failed to connect to database"
    log "Host: $DB_HOST"
    log "Port: ${DB_PORT:-5432}"
    log "Database: $DB_NAME"
    log "User: $DB_USER"
    exit 1
  fi

  log_success "Database connection successful"
}

##############################################################################
# Backup Functions
##############################################################################

create_database_backup() {
  log "Creating database backup..."

  local backup_dir="${PROJECT_ROOT}/backups/database"
  mkdir -p "$backup_dir"

  local backup_file="${backup_dir}/backup_${ENVIRONMENT}_${TIMESTAMP}.sql"

  PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "${DB_PORT:-5432}" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -F c \
    -f "$backup_file"

  # Compress backup
  gzip "$backup_file"

  local backup_size=$(du -h "${backup_file}.gz" | cut -f1)
  log_success "Database backup created: ${backup_file}.gz (${backup_size})"

  # Upload to S3 if in staging/production
  if [ "$ENVIRONMENT" != "development" ] && command -v aws &> /dev/null; then
    case "$ENVIRONMENT" in
      staging)
        BACKUP_BUCKET="${STAGING_BACKUP_S3_BUCKET:-}"
        ;;
      production)
        BACKUP_BUCKET="${PRODUCTION_BACKUP_S3_BUCKET:-}"
        ;;
    esac

    if [ -n "$BACKUP_BUCKET" ]; then
      aws s3 cp "${backup_file}.gz" "s3://${BACKUP_BUCKET}/database/backup_${TIMESTAMP}.sql.gz"
      log_success "Backup uploaded to S3: s3://${BACKUP_BUCKET}/database/backup_${TIMESTAMP}.sql.gz"
    fi
  fi

  echo "$backup_file.gz"
}

##############################################################################
# Migration Functions
##############################################################################

get_migration_status() {
  log "Getting migration status..."

  cd "${PROJECT_ROOT}/backend"

  NODE_ENV="$ENVIRONMENT" npx sequelize-cli db:migrate:status

  cd "$PROJECT_ROOT"
}

get_pending_migrations() {
  log "Checking for pending migrations..."

  cd "${PROJECT_ROOT}/backend"

  local pending=$(NODE_ENV="$ENVIRONMENT" npx sequelize-cli db:migrate:status 2>&1 | grep "down" | wc -l)

  cd "$PROJECT_ROOT"

  echo "$pending"
}

run_migrations_up() {
  log "Running database migrations (up)..."

  cd "${PROJECT_ROOT}/backend"

  # Get pending migrations count
  local pending=$(get_pending_migrations)

  if [ "$pending" -eq 0 ]; then
    log_success "No pending migrations found"
    cd "$PROJECT_ROOT"
    return 0
  fi

  log "Found $pending pending migration(s)"

  # Create backup before migrations (except for development)
  local backup_file=""
  if [ "$ENVIRONMENT" != "development" ]; then
    backup_file=$(create_database_backup)
  fi

  # Run migrations
  log "Executing migrations..."

  if NODE_ENV="$ENVIRONMENT" npx sequelize-cli db:migrate; then
    log_success "Migrations completed successfully"

    # Verify migrations
    log "Verifying migrations..."
    get_migration_status

    cd "$PROJECT_ROOT"
    return 0
  else
    log_error "Migration failed!"

    # Offer rollback option
    if [ -n "$backup_file" ]; then
      echo ""
      echo "Migration failed. Do you want to restore from backup? (y/n)"
      read -r response

      if [ "$response" = "y" ]; then
        restore_database_from_backup "$backup_file"
      fi
    fi

    cd "$PROJECT_ROOT"
    return 1
  fi
}

run_migrations_down() {
  log "Rolling back last migration..."

  cd "${PROJECT_ROOT}/backend"

  # Confirmation for non-development
  if [ "$ENVIRONMENT" != "development" ]; then
    log_warning "You are about to rollback a migration in $ENVIRONMENT"
    echo "Are you sure? (yes/no)"
    read -r response

    if [ "$response" != "yes" ]; then
      log "Migration rollback cancelled"
      cd "$PROJECT_ROOT"
      return 1
    fi

    # Create backup before rollback
    create_database_backup
  fi

  # Rollback migration
  if NODE_ENV="$ENVIRONMENT" npx sequelize-cli db:migrate:undo; then
    log_success "Migration rolled back successfully"

    # Verify rollback
    log "Verifying rollback..."
    get_migration_status

    cd "$PROJECT_ROOT"
    return 0
  else
    log_error "Migration rollback failed!"
    cd "$PROJECT_ROOT"
    return 1
  fi
}

restore_database_from_backup() {
  local backup_file="$1"

  log "Restoring database from backup: $backup_file"

  # Decompress if needed
  if [[ "$backup_file" == *.gz ]]; then
    gunzip -k "$backup_file"
    backup_file="${backup_file%.gz}"
  fi

  # Restore database
  PGPASSWORD="$DB_PASSWORD" pg_restore \
    -h "$DB_HOST" \
    -p "${DB_PORT:-5432}" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --clean \
    --if-exists \
    "$backup_file"

  log_success "Database restored from backup"
}

##############################################################################
# Verification Functions
##############################################################################

verify_database_integrity() {
  log "Verifying database integrity..."

  cd "${PROJECT_ROOT}/backend"

  # Run a simple query to verify database is accessible
  if PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -p "${DB_PORT:-5432}" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -c "SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';" &> /dev/null; then
    log_success "Database integrity verified"
  else
    log_error "Database integrity check failed"
    return 1
  fi

  cd "$PROJECT_ROOT"
}

verify_hipaa_tables() {
  log "Verifying HIPAA compliance tables..."

  local required_tables=(
    "audit_logs"
    "access_logs"
  )

  for table in "${required_tables[@]}"; do
    if PGPASSWORD="$DB_PASSWORD" psql \
      -h "$DB_HOST" \
      -p "${DB_PORT:-5432}" \
      -U "$DB_USER" \
      -d "$DB_NAME" \
      -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$table');" | grep -q "t"; then
      log_success "HIPAA table exists: $table"
    else
      log_error "HIPAA table missing: $table"
    fi
  done
}

##############################################################################
# Cleanup Functions
##############################################################################

cleanup_old_backups() {
  log "Cleaning up old backups..."

  local backup_dir="${PROJECT_ROOT}/backups/database"

  if [ ! -d "$backup_dir" ]; then
    return 0
  fi

  # Keep last 30 backups for development, 90 for staging, all for production
  local keep_count=30
  case "$ENVIRONMENT" in
    staging)
      keep_count=90
      ;;
    production)
      keep_count=9999
      ;;
  esac

  local backup_count=$(ls -1 "$backup_dir" | wc -l)

  if [ "$backup_count" -gt "$keep_count" ]; then
    log "Removing old backups (keeping last $keep_count)"
    ls -1t "$backup_dir" | tail -n +$((keep_count + 1)) | xargs -I {} rm -f "$backup_dir/{}"
    log_success "Old backups cleaned up"
  else
    log "No cleanup needed ($backup_count backups, limit: $keep_count)"
  fi
}

##############################################################################
# Notification Functions
##############################################################################

send_notification() {
  local status="$1"
  local message="$2"

  # Slack notification
  if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
    local emoji="✅"
    if [ "$status" = "failure" ]; then
      emoji="❌"
    fi

    curl -X POST "$SLACK_WEBHOOK_URL" \
      -H 'Content-Type: application/json' \
      -d "{
        \"text\": \"$emoji Database Migration - $ENVIRONMENT\",
        \"blocks\": [
          {
            \"type\": \"section\",
            \"text\": {
              \"type\": \"mrkdwn\",
              \"text\": \"*Database Migration*\\nEnvironment: $ENVIRONMENT\\nAction: $ACTION\\nStatus: $status\\nMessage: $message\"
            }
          }
        ]
      }" &> /dev/null
  fi

  # Email notification for production
  if [ "$ENVIRONMENT" = "production" ] && [ -n "${DEVOPS_EMAIL:-}" ]; then
    echo "$message" | mail -s "[White Cross] Database Migration - $status" "$DEVOPS_EMAIL"
  fi
}

##############################################################################
# Main Function
##############################################################################

main() {
  log "=========================================="
  log "White Cross - Database Migration"
  log "=========================================="
  log "Environment: $ENVIRONMENT"
  log "Action: $ACTION"
  log "Timestamp: $TIMESTAMP"
  log "Log file: $LOG_FILE"
  log ""

  # Validation
  validate_environment
  validate_action
  load_environment_config
  check_database_connection

  # Execute action
  log ""
  log "=========================================="
  log "MIGRATION EXECUTION"
  log "=========================================="

  case "$ACTION" in
    up)
      if run_migrations_up; then
        verify_database_integrity
        verify_hipaa_tables
        cleanup_old_backups
        send_notification "success" "Migrations completed successfully"
        log_success "MIGRATION SUCCESSFUL"
      else
        send_notification "failure" "Migration failed"
        log_error "MIGRATION FAILED"
        exit 1
      fi
      ;;
    down)
      if run_migrations_down; then
        verify_database_integrity
        send_notification "success" "Migration rollback completed"
        log_success "ROLLBACK SUCCESSFUL"
      else
        send_notification "failure" "Migration rollback failed"
        log_error "ROLLBACK FAILED"
        exit 1
      fi
      ;;
    status)
      get_migration_status
      ;;
    pending)
      local pending=$(get_pending_migrations)
      log "Pending migrations: $pending"
      ;;
  esac

  log ""
  log "=========================================="
  log "MIGRATION COMPLETE"
  log "=========================================="
}

# Error handler
trap 'log_error "Migration script failed at line $LINENO"' ERR

# Run main function
main "$@"
