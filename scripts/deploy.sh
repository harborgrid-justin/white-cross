#!/bin/bash

##############################################################################
# White Cross Healthcare Platform - Deployment Script
#
# Purpose: Deploy application to specified environment with validation
# Usage: ./scripts/deploy.sh [staging|production]
##############################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENVIRONMENT="${1:-}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${PROJECT_ROOT}/logs/deploy_${ENVIRONMENT}_${TIMESTAMP}.log"

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
    echo "Usage: $0 [staging|production]"
    exit 1
  fi

  log_success "Environment validation passed"
}

validate_prerequisites() {
  log "Checking prerequisites..."

  # Check required tools
  local required_tools=("node" "npm" "git" "aws" "jq")

  for tool in "${required_tools[@]}"; do
    if ! command -v "$tool" &> /dev/null; then
      log_error "$tool is not installed"
      exit 1
    fi
  done

  # Check Node version
  local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$node_version" -lt 18 ]; then
    log_error "Node.js version must be 18 or higher (current: $(node -v))"
    exit 1
  fi

  log_success "All prerequisites are met"
}

validate_aws_credentials() {
  log "Validating AWS credentials..."

  if ! aws sts get-caller-identity &> /dev/null; then
    log_error "AWS credentials are not configured or invalid"
    exit 1
  fi

  local aws_account=$(aws sts get-caller-identity --query Account --output text)
  log_success "AWS credentials validated (Account: $aws_account)"
}

validate_git_status() {
  log "Checking git status..."

  if [ -n "$(git status --porcelain)" ]; then
    log_warning "Working directory has uncommitted changes"
    echo "Continue anyway? (y/n)"
    read -r response
    if [ "$response" != "y" ]; then
      log_error "Deployment cancelled"
      exit 1
    fi
  fi

  # Verify we're on the correct branch
  local current_branch=$(git rev-parse --abbrev-ref HEAD)

  if [ "$ENVIRONMENT" = "production" ] && [ "$current_branch" != "master" ] && [ "$current_branch" != "main" ]; then
    log_error "Production deployments must be from master/main branch (current: $current_branch)"
    exit 1
  fi

  if [ "$ENVIRONMENT" = "staging" ] && [ "$current_branch" != "develop" ]; then
    log_warning "Staging deployments typically come from develop branch (current: $current_branch)"
  fi

  log_success "Git status validated"
}

##############################################################################
# Build Functions
##############################################################################

build_frontend() {
  log "Building frontend..."

  cd "${PROJECT_ROOT}/frontend"

  # Install dependencies
  log "Installing frontend dependencies..."
  npm ci --production=false

  # Load environment-specific variables
  if [ -f "../.env.${ENVIRONMENT}" ]; then
    set -a
    source "../.env.${ENVIRONMENT}"
    set +a
  fi

  # Build
  log "Running frontend build..."
  npm run build

  # Verify build output
  if [ ! -d "dist" ]; then
    log_error "Frontend build failed - dist directory not found"
    exit 1
  fi

  local build_size=$(du -sh dist | cut -f1)
  log_success "Frontend build completed (size: $build_size)"

  cd "$PROJECT_ROOT"
}

build_backend() {
  log "Building backend..."

  cd "${PROJECT_ROOT}/backend"

  # Install dependencies
  log "Installing backend dependencies..."
  npm ci --production=false

  # Build
  log "Running backend build..."
  npm run build

  # Verify build output
  if [ ! -d "dist" ]; then
    log_error "Backend build failed - dist directory not found"
    exit 1
  fi

  log_success "Backend build completed"

  cd "$PROJECT_ROOT"
}

run_post_build_checks() {
  log "Running post-build validation..."

  # Check frontend bundle size
  cd "${PROJECT_ROOT}/frontend"
  local bundle_size_kb=$(du -sk dist | cut -f1)
  local max_bundle_size_kb=10240  # 10MB

  if [ "$bundle_size_kb" -gt "$max_bundle_size_kb" ]; then
    log_warning "Frontend bundle size (${bundle_size_kb}KB) exceeds recommended size (${max_bundle_size_kb}KB)"
  fi

  # Check for source maps in production
  if [ "$ENVIRONMENT" = "production" ]; then
    if find dist -name "*.map" | grep -q .; then
      log_warning "Source maps found in production build"
    fi
  fi

  cd "$PROJECT_ROOT"

  log_success "Post-build checks completed"
}

##############################################################################
# Deployment Functions
##############################################################################

deploy_frontend() {
  log "Deploying frontend to $ENVIRONMENT..."

  # Load environment-specific AWS variables
  case "$ENVIRONMENT" in
    staging)
      S3_BUCKET="${STAGING_S3_BUCKET}"
      CLOUDFRONT_ID="${STAGING_CLOUDFRONT_ID}"
      ;;
    production)
      S3_BUCKET="${PRODUCTION_S3_BUCKET}"
      CLOUDFRONT_ID="${PRODUCTION_CLOUDFRONT_ID}"
      ;;
  esac

  # Sync to S3
  log "Uploading to S3 bucket: $S3_BUCKET"
  aws s3 sync "${PROJECT_ROOT}/frontend/dist" "s3://${S3_BUCKET}" \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "index.html" \
    --exclude "*.map"

  # Upload index.html with no-cache
  aws s3 cp "${PROJECT_ROOT}/frontend/dist/index.html" "s3://${S3_BUCKET}/index.html" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --metadata-directive REPLACE

  # Invalidate CloudFront cache
  log "Invalidating CloudFront distribution: $CLOUDFRONT_ID"
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_ID" \
    --paths "/*" \
    --output json | jq -r '.Invalidation.Id' > /tmp/invalidation_id.txt

  local invalidation_id=$(cat /tmp/invalidation_id.txt)
  log_success "Frontend deployed (CloudFront invalidation: $invalidation_id)"
}

deploy_backend() {
  log "Deploying backend to $ENVIRONMENT..."

  # Load environment-specific variables
  case "$ENVIRONMENT" in
    staging)
      ECS_CLUSTER="${STAGING_ECS_CLUSTER}"
      ECS_SERVICE="${STAGING_ECS_SERVICE}"
      ECR_REPOSITORY="${STAGING_ECR_REPOSITORY}"
      ;;
    production)
      ECS_CLUSTER="${PRODUCTION_ECS_CLUSTER}"
      ECS_SERVICE="${PRODUCTION_ECS_SERVICE}"
      ECR_REPOSITORY="${PRODUCTION_ECR_REPOSITORY}"
      ;;
  esac

  # Build Docker image
  log "Building Docker image..."
  local image_tag="${ENVIRONMENT}-${TIMESTAMP}"

  docker build \
    -t "${ECR_REPOSITORY}:${image_tag}" \
    -t "${ECR_REPOSITORY}:${ENVIRONMENT}-latest" \
    -f "${PROJECT_ROOT}/Dockerfile" \
    "${PROJECT_ROOT}"

  # Push to ECR
  log "Pushing to ECR..."
  aws ecr get-login-password --region "${AWS_REGION}" | \
    docker login --username AWS --password-stdin "${ECR_REPOSITORY}"

  docker push "${ECR_REPOSITORY}:${image_tag}"
  docker push "${ECR_REPOSITORY}:${ENVIRONMENT}-latest"

  # Update ECS service
  log "Updating ECS service..."
  aws ecs update-service \
    --cluster "$ECS_CLUSTER" \
    --service "$ECS_SERVICE" \
    --force-new-deployment \
    --output json | jq -r '.service.serviceArn'

  log_success "Backend deployment initiated"
}

run_database_migrations() {
  log "Running database migrations..."

  cd "${PROJECT_ROOT}/backend"

  # Load environment-specific database variables
  if [ -f "../.env.${ENVIRONMENT}" ]; then
    set -a
    source "../.env.${ENVIRONMENT}"
    set +a
  fi

  # Run migrations
  NODE_ENV="$ENVIRONMENT" npx sequelize-cli db:migrate

  log_success "Database migrations completed"

  cd "$PROJECT_ROOT"
}

verify_deployment() {
  log "Verifying deployment..."

  # Get environment URL
  case "$ENVIRONMENT" in
    staging)
      APP_URL="${STAGING_APP_URL:-https://staging.whitecross.example.com}"
      ;;
    production)
      APP_URL="${PRODUCTION_APP_URL:-https://app.whitecross.com}"
      ;;
  esac

  # Wait for deployment to be available
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

  # Run smoke tests
  log "Running smoke tests..."
  if [ -f "${SCRIPT_DIR}/smoke-tests.sh" ]; then
    bash "${SCRIPT_DIR}/smoke-tests.sh" "$ENVIRONMENT" "$APP_URL"
  fi

  log_success "Deployment verification completed"
}

##############################################################################
# Main Deployment Flow
##############################################################################

main() {
  log "=========================================="
  log "White Cross Deployment - $ENVIRONMENT"
  log "=========================================="
  log "Timestamp: $TIMESTAMP"
  log "Log file: $LOG_FILE"
  log ""

  # Validation phase
  validate_environment
  validate_prerequisites
  validate_aws_credentials
  validate_git_status

  # Build phase
  log ""
  log "=========================================="
  log "BUILD PHASE"
  log "=========================================="
  build_frontend
  build_backend
  run_post_build_checks

  # Deployment phase
  log ""
  log "=========================================="
  log "DEPLOYMENT PHASE"
  log "=========================================="

  # Confirm deployment
  log_warning "Ready to deploy to $ENVIRONMENT"
  echo "Continue? (y/n)"
  read -r response
  if [ "$response" != "y" ]; then
    log_error "Deployment cancelled by user"
    exit 1
  fi

  deploy_frontend

  # Database migrations before backend deployment
  run_database_migrations

  deploy_backend

  # Verification phase
  log ""
  log "=========================================="
  log "VERIFICATION PHASE"
  log "=========================================="
  verify_deployment

  # Success
  log ""
  log "=========================================="
  log_success "DEPLOYMENT COMPLETED SUCCESSFULLY"
  log "=========================================="
  log "Environment: $ENVIRONMENT"
  log "Timestamp: $TIMESTAMP"
  log "Log file: $LOG_FILE"
  log ""

  # Send notification
  if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
    curl -X POST "$SLACK_WEBHOOK_URL" \
      -H 'Content-Type: application/json' \
      -d "{\"text\":\"✅ Deployment to $ENVIRONMENT completed successfully\"}"
  fi
}

# Error handler
trap 'log_error "Deployment failed at line $LINENO"' ERR

# Run main function
main "$@"
