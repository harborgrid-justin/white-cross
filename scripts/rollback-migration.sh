#!/bin/bash

# =============================================================================
# White Cross Healthcare Platform - Database Rollback Script
# =============================================================================

set -e  # Exit on error

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "→ $1"
}

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    print_error "Backend directory not found: $BACKEND_DIR"
    exit 1
fi

cd "$BACKEND_DIR"

# Check environment
if [ -z "$DB_HOST" ]; then
    print_warning "Database environment variables not set, using .env file"
    if [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
    else
        print_error ".env file not found in backend directory"
        exit 1
    fi
fi

print_info "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Confirm rollback
print_warning "⚠️  WARNING: This will rollback the last migration!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    print_info "Rollback cancelled"
    exit 0
fi

# Create backup before rollback
print_info "Creating database backup before rollback..."
BACKUP_DIR="$PROJECT_ROOT/backups"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/rollback_backup_$(date +%Y%m%d_%H%M%S).sql"

if command -v pg_dump &> /dev/null; then
    if PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"; then
        print_success "Database backup created: $BACKUP_FILE"
    else
        print_error "Database backup failed, aborting rollback"
        exit 1
    fi
else
    print_warning "pg_dump not found, proceeding without backup (not recommended)"
    read -p "Continue without backup? (yes/no): " CONTINUE
    if [ "$CONTINUE" != "yes" ]; then
        print_info "Rollback cancelled"
        exit 0
    fi
fi

# Check migration status
print_info "Current migration status:"
npx sequelize-cli db:migrate:status

# Perform rollback
print_info "Rolling back last migration..."
if npx sequelize-cli db:migrate:undo; then
    print_success "Rollback completed successfully"
else
    print_error "Rollback failed"
    print_warning "Database may be in an inconsistent state"
    print_warning "Restore from backup: $BACKUP_FILE"
    exit 1
fi

# Verify rollback
print_info "Verifying migration status after rollback..."
npx sequelize-cli db:migrate:status

print_success "Rollback completed successfully!"
print_info "Backup saved: $BACKUP_FILE"
