# White Cross - Deployment and Operations Scripts

This directory contains all operational scripts for deploying, managing, and maintaining the White Cross Healthcare Platform.

## Script Overview

| Script | Purpose | Usage |
|--------|---------|-------|
| `deploy.sh` | Deploy to staging or production | `./deploy.sh [staging\|production]` |
| `rollback.sh` | Rollback deployment | `./rollback.sh [staging\|production] [version]` |
| `migrate-database.sh` | Run database migrations | `./migrate-database.sh [env] [up\|down\|status]` |
| `setup-env.sh` | Generate environment config | `./setup-env.sh [development\|staging\|production]` |
| `validate-env.sh` | Validate environment config | `./validate-env.sh [environment]` |
| `verify-deployment.sh` | Verify deployment health | `./verify-deployment.sh [environment] [url]` |
| `create-release.sh` | Create new release | `./create-release.sh [major\|minor\|patch]` |

## Detailed Documentation

### deploy.sh

**Purpose**: Full deployment automation for staging and production environments.

**Features**:
- Environment validation
- AWS credentials verification
- Git status checks
- Frontend and backend builds
- Database migrations with automatic backups
- S3 deployment with CloudFront invalidation
- ECS service updates
- Health checks and verification

**Usage**:
```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

**Environment Variables Required**:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `STAGING_*` or `PRODUCTION_*` variables

**Exit Codes**:
- `0`: Deployment successful
- `1`: Deployment failed (with automatic rollback if configured)

### rollback.sh

**Purpose**: Safe rollback to previous deployment version.

**Features**:
- Database backup before rollback
- ECS task definition rollback
- Frontend restoration from S3 backup
- Optional database migration rollback
- Rollback verification
- Stakeholder notifications

**Usage**:
```bash
# Rollback to previous version
./scripts/rollback.sh production previous

# Rollback to specific version
./scripts/rollback.sh production arn:aws:ecs:us-east-1:123456789012:task-definition/white-cross-api:42
```

**Safety Features**:
- Confirmation prompts for production
- Automatic database backup
- Health check verification
- Audit trail logging

### migrate-database.sh

**Purpose**: Automated database migration management with HIPAA compliance.

**Features**:
- Pre-migration backups
- Migration execution with rollback capability
- Database integrity verification
- HIPAA table validation
- Audit trail creation
- Notification on completion

**Usage**:
```bash
# Run pending migrations
./scripts/migrate-database.sh production up

# Rollback last migration
./scripts/migrate-database.sh production down

# Check migration status
./scripts/migrate-database.sh production status

# List pending migrations
./scripts/migrate-database.sh production pending
```

**HIPAA Compliance**:
- Validates audit_logs table exists
- Checks access_logs table
- Verifies encryption settings
- Creates audit trail for all migrations

### setup-env.sh

**Purpose**: Generate environment configuration files for different environments.

**Features**:
- Development, staging, and production templates
- Secret generation utilities
- HIPAA compliance defaults
- Environment file encryption
- .env.example generation

**Usage**:
```bash
# Generate development environment
./scripts/setup-env.sh development

# Generate staging environment
./scripts/setup-env.sh staging

# Generate production environment
./scripts/setup-env.sh production
```

**Generated Files**:
- `.env.development`
- `.env.staging`
- `.env.production`
- `.env.example`

**Security**:
- Production secrets marked as "USE_SECRETS_MANAGER"
- Encryption option for sensitive environments
- No default passwords in non-development

### validate-env.sh

**Purpose**: Comprehensive validation of environment configurations.

**Features**:
- Required variables verification
- Database configuration validation
- Security settings check
- HIPAA compliance validation
- CORS configuration verification
- Optional connection tests

**Usage**:
```bash
# Validate environment configuration
./scripts/validate-env.sh staging

# With connection tests
./scripts/validate-env.sh production
# (Answer 'y' when prompted for connection tests)
```

**Validation Checks**:
- Required environment variables
- Database SSL configuration
- JWT secret strength (min 32 chars)
- BCRYPT rounds (10-15)
- HIPAA audit logging enabled
- Encryption at rest (non-dev)
- Audit retention (2555 days minimum)

**Exit Codes**:
- `0`: All validations passed
- `1`: Critical errors found (must fix before deployment)

### verify-deployment.sh

**Purpose**: Post-deployment verification and health checks.

**Features**:
- Application health checks
- Database and Redis connectivity
- Security headers validation
- SSL certificate verification
- Authentication enforcement
- HIPAA compliance checks
- Performance benchmarking
- API endpoint validation
- Frontend availability

**Usage**:
```bash
# Verify staging deployment
./scripts/verify-deployment.sh staging

# Verify production with custom URL
./scripts/verify-deployment.sh production https://app.whitecross.com
```

**Checks Performed** (30+ checks):
- Basic health endpoint
- Database connectivity
- Redis connectivity
- Security headers (HSTS, CSP, etc.)
- SSL certificate validity and expiration
- Authentication enforcement
- Audit logging status
- Response time performance
- Rate limiting
- Critical API endpoints
- Frontend availability
- Static assets serving

**Output**:
- Detailed check results
- Pass/fail/warning counts
- Actionable recommendations
- Saved to log file

### create-release.sh

**Purpose**: Automated version bumping and release creation.

**Features**:
- Semantic version bumping (major/minor/patch)
- Pre-release tag support
- Changelog generation from commits
- Release notes creation
- Package.json updates across monorepo
- Git tag creation
- GitHub release creation

**Usage**:
```bash
# Create patch release (1.2.3 → 1.2.4)
./scripts/create-release.sh patch

# Create minor release (1.2.3 → 1.3.0)
./scripts/create-release.sh minor

# Create major release (1.2.3 → 2.0.0)
./scripts/create-release.sh major

# Create pre-release (1.2.3 → 1.2.4-beta)
./scripts/create-release.sh patch beta
```

**What It Does**:
1. Validates git status and branch
2. Calculates next version
3. Updates package.json files
4. Generates changelog from git commits
5. Creates release notes
6. Commits version changes
7. Creates and pushes git tag
8. Creates GitHub release

**Commit Message Format**:
Uses Conventional Commits to generate changelog:
- `feat:` → New Features section
- `fix:` → Bug Fixes section
- `BREAKING CHANGE:` → Breaking Changes section
- Other types → Other Changes section

## Pre-Deployment Checklist

Before running any production deployment:

- [ ] All tests passing in CI
- [ ] Staging deployment successful
- [ ] Database backup verified (< 24 hours old)
- [ ] Change request approved (if required)
- [ ] Rollback plan documented
- [ ] Team notified of deployment window
- [ ] On-call engineer identified
- [ ] HIPAA compliance verified
- [ ] Security scan completed

## Post-Deployment Checklist

After production deployment:

- [ ] Health checks passing
- [ ] Verification script successful
- [ ] Error rates normal (< 1%)
- [ ] Latency within SLA (p95 < 1s)
- [ ] Database migrations successful
- [ ] Audit logging functional
- [ ] Monitoring dashboards reviewed
- [ ] Stakeholders notified
- [ ] Documentation updated

## Emergency Procedures

### Complete System Down

```bash
# 1. Check status
./scripts/verify-deployment.sh production

# 2. Review recent changes
git log --oneline -10

# 3. Immediate rollback
./scripts/rollback.sh production previous

# 4. Notify stakeholders
# Use Slack, PagerDuty, email
```

### Database Issues

```bash
# 1. Check database connectivity
./scripts/validate-env.sh production
# Answer 'y' for connection tests

# 2. Review migration status
./scripts/migrate-database.sh production status

# 3. If needed, rollback migration
./scripts/migrate-database.sh production down
```

### High Error Rate

```bash
# 1. Check CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_Target_5XX_Count

# 2. Review logs
aws logs tail /ecs/white-cross-api --follow --filter-pattern "ERROR"

# 3. If persistent, rollback
./scripts/rollback.sh production previous
```

## Monitoring and Alerts

### Key Metrics

All scripts log to `logs/` directory with format:
- `deploy_[environment]_[timestamp].log`
- `rollback_[environment]_[timestamp].log`
- `migration_[environment]_[timestamp].log`
- `verify_[environment]_[timestamp].log`

### Notifications

Scripts send notifications to:
- Slack (if `SLACK_WEBHOOK_URL` set)
- Email (for production events)
- PagerDuty (for critical issues)

## Troubleshooting

### Script Fails with Permission Denied

```bash
# Make scripts executable
chmod +x scripts/*.sh
```

### AWS Credentials Not Found

```bash
# Configure AWS CLI
aws configure --profile white-cross-production

# Or export credentials
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1
```

### Database Connection Fails

```bash
# Check environment file
cat .env.production | grep DB_

# Test connection manually
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;"
```

### jq Command Not Found

```bash
# Install jq
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# CentOS/RHEL
sudo yum install jq
```

## Best Practices

1. **Always run in order**: setup-env → validate-env → deploy → verify
2. **Test in staging first**: Never deploy untested changes to production
3. **Backup before migrations**: Database backups are automatic but verify
4. **Monitor after deployment**: Watch metrics for 30 minutes
5. **Document changes**: Update changelog and release notes
6. **Notify team**: Use Slack for all deployments
7. **Have rollback ready**: Know how to rollback before deploying

## Security Considerations

1. **Never commit secrets**: All .env files are gitignored
2. **Use AWS Secrets Manager**: For production secrets
3. **Rotate credentials**: Every 90 days minimum
4. **Audit all deployments**: Logs are retained for compliance
5. **Encrypt sensitive files**: Use GPG or AWS KMS
6. **Review permissions**: Follow principle of least privilege

## HIPAA Compliance

All scripts maintain HIPAA compliance by:
- Creating audit trails for all operations
- Never logging PHI data
- Encrypting backups
- Maintaining 7-year retention
- Verifying audit logging before deployment
- Checking encryption configurations
- Validating access controls

## Support

### Getting Help

- **Slack**: #devops channel
- **Email**: devops@whitecross.com
- **Documentation**: https://docs.whitecross.com
- **Emergency**: PagerDuty on-call

### Reporting Issues

```bash
# Create issue with:
# 1. Script name and command run
# 2. Full error message
# 3. Environment (dev/staging/production)
# 4. Log file contents
# 5. Steps to reproduce
```

## Contributing

To add a new script:

1. Create script in `scripts/` directory
2. Add shebang: `#!/bin/bash`
3. Add error handling: `set -euo pipefail`
4. Add logging functions
5. Add to this README
6. Make executable: `chmod +x scripts/your-script.sh`
7. Test in development first
8. Create PR with documentation

---

**Maintained by**: DevOps Team
**Last Updated**: January 2025
**Version**: 1.0.0
