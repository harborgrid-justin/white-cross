# White Cross CI/CD - Quick Start Guide

## 🚀 Get Started in 15 Minutes

This guide will get your CI/CD pipeline running in 15 minutes.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] GitHub repository access (admin rights)
- [ ] AWS account with appropriate permissions
- [ ] Node.js 18+ installed
- [ ] Docker installed (for local testing)
- [ ] AWS CLI configured
- [ ] Git CLI installed

## Step 1: Install Dependencies (2 minutes)

```bash
# Navigate to project root
cd white-cross

# Install all dependencies
npm install

# Install Husky hooks
npx husky install

# Make scripts executable
chmod +x scripts/*.sh
chmod +x .husky/*
```

## Step 2: Configure GitHub Secrets (5 minutes)

Go to GitHub repository settings → Secrets and variables → Actions → New repository secret

**Required Secrets:**

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# Staging Environment
STAGING_API_URL=https://staging-api.whitecross.example.com
STAGING_S3_BUCKET=white-cross-staging
STAGING_CLOUDFRONT_ID=E1234567890ABC
STAGING_ECS_CLUSTER=white-cross-staging
STAGING_ECS_SERVICE=white-cross-api-staging
STAGING_DB_HOST=staging-db.rds.amazonaws.com
STAGING_DB_NAME=white_cross_staging
STAGING_DB_USER=admin
STAGING_DB_PASSWORD=...
STAGING_BACKUP_S3_BUCKET=white-cross-staging-backups

# Production Environment
PRODUCTION_API_URL=https://api.whitecross.com
PRODUCTION_S3_BUCKET=white-cross-production
PRODUCTION_CLOUDFRONT_ID=E9876543210XYZ
PRODUCTION_ECS_CLUSTER=white-cross-production
PRODUCTION_ECS_SERVICE=white-cross-api-production
PRODUCTION_TG_BLUE_ARN=arn:aws:elasticloadbalancing:...
PRODUCTION_TG_GREEN_ARN=arn:aws:elasticloadbalancing:...
PRODUCTION_ALB_RULE_ARN=arn:aws:elasticloadbalancing:...
PRODUCTION_DB_HOST=production-db.rds.amazonaws.com
PRODUCTION_DB_NAME=white_cross_production
PRODUCTION_DB_USER=admin
PRODUCTION_DB_PASSWORD=...
PRODUCTION_BACKUP_S3_BUCKET=white-cross-production-backups

# Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DEVOPS_EMAIL=devops@whitecross.com
STAKEHOLDER_EMAILS=stakeholders@whitecross.com

# Monitoring
CYPRESS_RECORD_KEY=...
SNYK_TOKEN=...
SENTRY_DSN=...
```

## Step 3: Setup Local Environment (3 minutes)

```bash
# Generate development environment file
./scripts/setup-env.sh development

# Start local environment with Docker
docker-compose -f docker-compose.dev.yml up -d

# Verify everything is running
docker-compose -f docker-compose.dev.yml ps

# Check health
curl http://localhost:3001/health
```

## Step 4: Enable Branch Protection (2 minutes)

GitHub repository → Settings → Branches → Add branch protection rule

**For `master` branch:**
- [x] Require a pull request before merging
- [x] Require approvals: 1
- [x] Require status checks to pass before merging
  - [x] Security Scanning
  - [x] Lint and Type Check
  - [x] Backend Tests
  - [x] Frontend Tests
  - [x] E2E Tests
  - [x] Build Verification
  - [x] HIPAA Compliance Checks
- [x] Require conversation resolution before merging
- [x] Do not allow bypassing the above settings

**For `develop` branch:**
- Same as above, but allow admins to bypass

## Step 5: Test the Pipeline (3 minutes)

```bash
# Create a test branch
git checkout -b test/ci-pipeline

# Make a small change
echo "# CI/CD Test" >> TEST.md

# Commit with proper format
git add TEST.md
git commit -m "test: verify CI pipeline"

# Push to trigger CI
git push origin test/ci-pipeline

# Create pull request on GitHub
# Watch the CI pipeline run

# Verify all checks pass
```

## 🎉 You're Done!

Your CI/CD pipeline is now active!

## What Happens Now?

### On Every Pull Request:
1. ✅ Security scanning runs
2. ✅ Code is linted and type-checked
3. ✅ All tests run (unit, integration, E2E)
4. ✅ Build verification
5. ✅ HIPAA compliance checked
6. ✅ Results posted to PR

### On Merge to `develop`:
1. 🚀 Automatically deploys to staging
2. 📊 Runs smoke tests
3. ⚡ Runs performance tests
4. 🔒 Validates security
5. 📧 Notifies team

### On Release Tag:
1. 🎯 Deploys to production (blue-green)
2. 🐣 Runs canary analysis
3. ✅ Full cutover if successful
4. 🔄 Auto-rollback on failure
5. 📢 Notifies stakeholders

## Quick Reference

### Make a Deployment

**To Staging:**
```bash
git checkout develop
git merge feature-branch
git push origin develop
# Automatic deployment starts
```

**To Production:**
```bash
./scripts/create-release.sh patch
# Production deployment starts automatically
```

### Rollback a Deployment

```bash
# Staging
./scripts/rollback.sh staging previous

# Production
./scripts/rollback.sh production previous
```

### Run Database Migration

```bash
# Staging
./scripts/migrate-database.sh staging up

# Production (be careful!)
./scripts/migrate-database.sh production up
```

### Verify Deployment

```bash
./scripts/verify-deployment.sh staging
./scripts/verify-deployment.sh production
```

## Common Tasks

### Add a New GitHub Secret

```bash
# Using GitHub CLI
gh secret set SECRET_NAME

# Or manually in GitHub UI
# Settings → Secrets → New repository secret
```

### Update Environment Configuration

```bash
# Regenerate environment file
./scripts/setup-env.sh staging

# Validate changes
./scripts/validate-env.sh staging
```

### View Pipeline Logs

```bash
# GitHub Actions logs
# Go to Actions tab → Select workflow run → Click job

# Or use GitHub CLI
gh run list
gh run view <run-id>
```

### Test Locally Before Pushing

```bash
# Run linting
npm run lint

# Run tests
npm test

# Run E2E tests
cd frontend && npm run test:e2e

# Build
npm run build
```

## Troubleshooting

### Pipeline Fails with "AWS Credentials Not Found"

**Solution:**
```bash
# Verify secrets are set
gh secret list

# Add missing secrets
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY
```

### Pre-Commit Hook Not Running

**Solution:**
```bash
# Reinstall Husky
rm -rf .husky
npx husky install
chmod +x .husky/*
```

### Docker Compose Fails

**Solution:**
```bash
# Stop all containers
docker-compose -f docker-compose.dev.yml down

# Remove volumes
docker-compose -f docker-compose.dev.yml down -v

# Restart
docker-compose -f docker-compose.dev.yml up -d
```

### Deployment Fails During Migration

**Solution:**
```bash
# Check migration status
./scripts/migrate-database.sh staging status

# If needed, rollback
./scripts/migrate-database.sh staging down

# Fix migration and retry
./scripts/migrate-database.sh staging up
```

## Important Commands Cheat Sheet

```bash
# Local Development
docker-compose -f docker-compose.dev.yml up -d    # Start local env
docker-compose -f docker-compose.dev.yml down     # Stop local env
docker-compose -f docker-compose.dev.yml logs -f  # View logs

# Environment Management
./scripts/setup-env.sh [env]                      # Create env file
./scripts/validate-env.sh [env]                   # Validate env

# Deployment
./scripts/deploy.sh [staging|production]          # Deploy
./scripts/rollback.sh [env] [version]             # Rollback
./scripts/verify-deployment.sh [env]              # Verify

# Database
./scripts/migrate-database.sh [env] [up|down]     # Migrate
./scripts/migrate-database.sh [env] status        # Status

# Releases
./scripts/create-release.sh [major|minor|patch]   # Create release

# Git
git commit -m "feat: description"                 # Feature commit
git commit -m "fix: description"                  # Bug fix commit
git commit -m "docs: description"                 # Docs commit
```

## Next Steps

1. **Read Full Documentation**
   - `.github/DEPLOYMENT.md` - Deployment procedures
   - `.github/CI_CD.md` - Pipeline details
   - `CI_CD_SETUP.md` - Complete overview

2. **Configure Monitoring**
   - Setup Prometheus dashboards
   - Configure alert destinations
   - Test alert routing

3. **Test Disaster Recovery**
   - Practice rollback procedure
   - Verify database backups
   - Test recovery procedures

4. **Train Your Team**
   - Share documentation
   - Run deployment drill
   - Establish on-call rotation

## Support

**Need Help?**
- 📧 Email: devops@whitecross.com
- 💬 Slack: #devops channel
- 📚 Docs: https://docs.whitecross.com
- 🚨 Emergency: PagerDuty on-call

## Key Documentation

| Document | Purpose |
|----------|---------|
| `QUICK_START_CICD.md` | This guide - get started quickly |
| `.github/DEPLOYMENT.md` | Detailed deployment procedures |
| `.github/CI_CD.md` | CI/CD pipeline documentation |
| `CI_CD_SETUP.md` | Complete infrastructure overview |
| `CI_CD_IMPLEMENTATION_SUMMARY.md` | Executive summary |
| `scripts/README.md` | Script documentation |

---

**Last Updated**: January 2025
**Status**: Production Ready
**Maintained By**: DevOps Team
