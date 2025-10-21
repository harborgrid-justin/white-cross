#!/bin/bash

##############################################################################
# White Cross Healthcare Platform - Release Creation Script
#
# Purpose: Automate version bumping, changelog generation, and release creation
# Usage: ./scripts/create-release.sh [major|minor|patch] [pre-release-tag]
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
VERSION_TYPE="${1:-patch}"
PRERELEASE_TAG="${2:-}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

log() {
  echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

log_error() {
  echo -e "${RED}✗${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

##############################################################################
# Validation Functions
##############################################################################

validate_version_type() {
  log "Validating version type: $VERSION_TYPE"

  if [[ ! "$VERSION_TYPE" =~ ^(major|minor|patch)$ ]]; then
    log_error "Invalid version type. Must be 'major', 'minor', or 'patch'"
    echo "Usage: $0 [major|minor|patch] [pre-release-tag]"
    exit 1
  fi

  log_success "Version type is valid"
}

check_git_status() {
  log "Checking git status..."

  if [ -n "$(git status --porcelain)" ]; then
    log_error "Working directory is not clean. Please commit or stash changes first"
    git status --short
    exit 1
  fi

  log_success "Working directory is clean"
}

check_git_branch() {
  log "Checking current branch..."

  local current_branch=$(git rev-parse --abbrev-ref HEAD)

  if [ "$current_branch" != "master" ] && [ "$current_branch" != "main" ]; then
    log_warning "Not on master/main branch (current: $current_branch)"
    echo "Continue anyway? (y/n)"
    read -r response
    if [ "$response" != "y" ]; then
      exit 1
    fi
  else
    log_success "On correct branch: $current_branch"
  fi
}

check_remote_sync() {
  log "Checking if local branch is synced with remote..."

  git fetch origin

  local local_commit=$(git rev-parse HEAD)
  local remote_commit=$(git rev-parse @{u} 2>/dev/null || echo "")

  if [ "$local_commit" != "$remote_commit" ]; then
    log_warning "Local branch is not synced with remote"
    echo "Pull latest changes? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
      git pull
    fi
  else
    log_success "Local branch is synced with remote"
  fi
}

##############################################################################
# Version Management
##############################################################################

get_current_version() {
  # Get version from package.json
  if [ -f "${PROJECT_ROOT}/package.json" ]; then
    jq -r '.version' "${PROJECT_ROOT}/package.json"
  else
    echo "0.0.0"
  fi
}

calculate_next_version() {
  local current_version="$1"
  local version_type="$2"

  # Split version into components
  IFS='.' read -r -a version_parts <<< "$current_version"
  local major="${version_parts[0]}"
  local minor="${version_parts[1]}"
  local patch="${version_parts[2]}"

  case "$version_type" in
    major)
      major=$((major + 1))
      minor=0
      patch=0
      ;;
    minor)
      minor=$((minor + 1))
      patch=0
      ;;
    patch)
      patch=$((patch + 1))
      ;;
  esac

  local new_version="${major}.${minor}.${patch}"

  if [ -n "$PRERELEASE_TAG" ]; then
    new_version="${new_version}-${PRERELEASE_TAG}"
  fi

  echo "$new_version"
}

update_package_versions() {
  local new_version="$1"

  log "Updating package.json files..."

  # Root package.json
  if [ -f "${PROJECT_ROOT}/package.json" ]; then
    jq ".version = \"$new_version\"" "${PROJECT_ROOT}/package.json" > "${PROJECT_ROOT}/package.json.tmp"
    mv "${PROJECT_ROOT}/package.json.tmp" "${PROJECT_ROOT}/package.json"
    log_success "Updated root package.json"
  fi

  # Frontend package.json
  if [ -f "${PROJECT_ROOT}/frontend/package.json" ]; then
    jq ".version = \"$new_version\"" "${PROJECT_ROOT}/frontend/package.json" > "${PROJECT_ROOT}/frontend/package.json.tmp"
    mv "${PROJECT_ROOT}/frontend/package.json.tmp" "${PROJECT_ROOT}/frontend/package.json"
    log_success "Updated frontend/package.json"
  fi

  # Backend package.json
  if [ -f "${PROJECT_ROOT}/backend/package.json" ]; then
    jq ".version = \"$new_version\"" "${PROJECT_ROOT}/backend/package.json" > "${PROJECT_ROOT}/backend/package.json.tmp"
    mv "${PROJECT_ROOT}/backend/package.json.tmp" "${PROJECT_ROOT}/backend/package.json"
    log_success "Updated backend/package.json"
  fi
}

##############################################################################
# Changelog Generation
##############################################################################

generate_changelog() {
  local current_version="$1"
  local new_version="$2"

  log "Generating changelog..."

  local changelog_file="${PROJECT_ROOT}/CHANGELOG.md"
  local temp_file="${PROJECT_ROOT}/CHANGELOG.tmp"

  # Get commits since last tag
  local last_tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

  if [ -z "$last_tag" ]; then
    log_warning "No previous tags found, including all commits"
    last_tag=$(git rev-list --max-parents=0 HEAD)
  fi

  # Get commit messages grouped by type
  local features=$(git log "$last_tag..HEAD" --pretty=format:"- %s" --grep="^feat" || echo "")
  local fixes=$(git log "$last_tag..HEAD" --pretty=format:"- %s" --grep="^fix" || echo "")
  local breaking=$(git log "$last_tag..HEAD" --pretty=format:"- %s" --grep="BREAKING CHANGE" || echo "")
  local other=$(git log "$last_tag..HEAD" --pretty=format:"- %s" --grep="^(build|chore|ci|docs|perf|refactor|style|test)" || echo "")

  # Create changelog entry
  {
    echo "# Changelog"
    echo ""
    echo "## [v${new_version}] - $(date +%Y-%m-%d)"
    echo ""

    if [ -n "$breaking" ]; then
      echo "### BREAKING CHANGES"
      echo ""
      echo "$breaking"
      echo ""
    fi

    if [ -n "$features" ]; then
      echo "### Features"
      echo ""
      echo "$features"
      echo ""
    fi

    if [ -n "$fixes" ]; then
      echo "### Bug Fixes"
      echo ""
      echo "$fixes"
      echo ""
    fi

    if [ -n "$other" ]; then
      echo "### Other Changes"
      echo ""
      echo "$other"
      echo ""
    fi

    # Append previous changelog if exists
    if [ -f "$changelog_file" ]; then
      tail -n +2 "$changelog_file"
    fi
  } > "$temp_file"

  mv "$temp_file" "$changelog_file"

  log_success "Changelog generated"
}

##############################################################################
# Release Notes Generation
##############################################################################

generate_release_notes() {
  local new_version="$1"

  log "Generating release notes..."

  local release_notes_file="${PROJECT_ROOT}/RELEASE_NOTES_${new_version}.md"

  # Get commits since last tag
  local last_tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

  if [ -z "$last_tag" ]; then
    last_tag=$(git rev-list --max-parents=0 HEAD)
  fi

  # Generate release notes
  {
    echo "# White Cross Healthcare Platform - Release v${new_version}"
    echo ""
    echo "Release Date: $(date +%Y-%m-%d)"
    echo ""
    echo "## What's New"
    echo ""

    # Get features
    local features=$(git log "$last_tag..HEAD" --pretty=format:"- %s" --grep="^feat" || echo "")
    if [ -n "$features" ]; then
      echo "### New Features"
      echo ""
      echo "$features"
      echo ""
    fi

    # Get fixes
    local fixes=$(git log "$last_tag..HEAD" --pretty=format:"- %s" --grep="^fix" || echo "")
    if [ -n "$fixes" ]; then
      echo "### Bug Fixes"
      echo ""
      echo "$fixes"
      echo ""
    fi

    # Get breaking changes
    local breaking=$(git log "$last_tag..HEAD" --pretty=format:"- %s" --grep="BREAKING CHANGE" || echo "")
    if [ -n "$breaking" ]; then
      echo "### ⚠️ Breaking Changes"
      echo ""
      echo "$breaking"
      echo ""
    fi

    echo "## Deployment Instructions"
    echo ""
    echo "1. Review the changelog and breaking changes"
    echo "2. Backup your database before upgrading"
    echo "3. Run database migrations: \`npm run migrate\`"
    echo "4. Deploy using: \`./scripts/deploy.sh production\`"
    echo "5. Verify deployment: \`./scripts/verify-deployment.sh production\`"
    echo ""
    echo "## HIPAA Compliance"
    echo ""
    echo "This release maintains full HIPAA compliance with:"
    echo "- Audit logging for all PHI access"
    echo "- Encryption at rest and in transit"
    echo "- Role-based access controls"
    echo "- 7-year audit log retention"
    echo ""
    echo "## Support"
    echo ""
    echo "For issues or questions, please contact:"
    echo "- Email: support@whitecross.com"
    echo "- Documentation: https://docs.whitecross.com"
    echo ""
  } > "$release_notes_file"

  log_success "Release notes generated: $release_notes_file"
  echo "$release_notes_file"
}

##############################################################################
# Git Operations
##############################################################################

create_git_tag() {
  local version="$1"
  local tag="v${version}"

  log "Creating git tag: $tag"

  # Create annotated tag
  git tag -a "$tag" -m "Release version $version"

  log_success "Git tag created: $tag"
}

commit_version_changes() {
  local version="$1"

  log "Committing version changes..."

  git add \
    package.json \
    frontend/package.json \
    backend/package.json \
    CHANGELOG.md

  git commit -m "chore: bump version to $version"

  log_success "Version changes committed"
}

push_changes() {
  local tag="$1"

  log "Pushing changes to remote..."

  git push origin HEAD
  git push origin "$tag"

  log_success "Changes pushed to remote"
}

##############################################################################
# GitHub Release Creation
##############################################################################

create_github_release() {
  local version="$1"
  local release_notes_file="$2"

  log "Creating GitHub release..."

  if ! command -v gh &> /dev/null; then
    log_warning "GitHub CLI (gh) not found, skipping GitHub release creation"
    log "You can create the release manually at: https://github.com/your-org/white-cross/releases"
    return
  fi

  # Create release using GitHub CLI
  gh release create "v${version}" \
    --title "White Cross v${version}" \
    --notes-file "$release_notes_file" \
    --latest

  log_success "GitHub release created"
}

##############################################################################
# Main Function
##############################################################################

main() {
  log "=========================================="
  log "White Cross - Release Creation"
  log "=========================================="
  log "Version Type: $VERSION_TYPE"
  if [ -n "$PRERELEASE_TAG" ]; then
    log "Pre-release Tag: $PRERELEASE_TAG"
  fi
  log ""

  # Validation
  validate_version_type
  check_git_status
  check_git_branch
  check_remote_sync

  # Version calculation
  log ""
  log "=========================================="
  log "VERSION CALCULATION"
  log "=========================================="

  local current_version=$(get_current_version)
  local new_version=$(calculate_next_version "$current_version" "$VERSION_TYPE")

  log "Current version: $current_version"
  log "New version: $new_version"

  # Confirmation
  echo ""
  log_warning "This will create a new release: v${new_version}"
  echo "Continue? (yes/no)"
  read -r response

  if [ "$response" != "yes" ]; then
    log "Release creation cancelled"
    exit 1
  fi

  # Update versions
  log ""
  log "=========================================="
  log "UPDATING VERSIONS"
  log "=========================================="
  update_package_versions "$new_version"

  # Generate changelog
  log ""
  log "=========================================="
  log "GENERATING CHANGELOG"
  log "=========================================="
  generate_changelog "$current_version" "$new_version"

  # Generate release notes
  log ""
  log "=========================================="
  log "GENERATING RELEASE NOTES"
  log "=========================================="
  local release_notes_file=$(generate_release_notes "$new_version")

  # Commit changes
  log ""
  log "=========================================="
  log "COMMITTING CHANGES"
  log "=========================================="
  commit_version_changes "$new_version"

  # Create tag
  log ""
  log "=========================================="
  log "CREATING GIT TAG"
  log "=========================================="
  create_git_tag "$new_version"

  # Push to remote
  log ""
  log "=========================================="
  log "PUSHING TO REMOTE"
  log "=========================================="
  push_changes "v${new_version}"

  # Create GitHub release
  log ""
  log "=========================================="
  log "CREATING GITHUB RELEASE"
  log "=========================================="
  create_github_release "$new_version" "$release_notes_file"

  # Success
  log ""
  log "=========================================="
  log_success "RELEASE CREATED SUCCESSFULLY"
  log "=========================================="
  log "Version: v${new_version}"
  log "Tag: v${new_version}"
  log "Release Notes: $release_notes_file"
  log ""
  log "Next steps:"
  log "1. The CD pipeline will automatically deploy to production"
  log "2. Monitor the deployment at: https://github.com/your-org/white-cross/actions"
  log "3. Verify deployment using: ./scripts/verify-deployment.sh production"
  log ""
}

main "$@"
