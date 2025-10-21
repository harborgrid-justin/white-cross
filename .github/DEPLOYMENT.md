## White Cross Healthcare Platform - Deployment Guide

This guide provides comprehensive instructions for deploying the White Cross Healthcare Platform to staging and production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Process](#deployment-process)
4. [Rollback Procedures](#rollback-procedures)
5. [Emergency Procedures](#emergency-procedures)
6. [Troubleshooting](#troubleshooting)
7. [HIPAA Compliance Checklist](#hipaa-compliance-checklist)

## Prerequisites

### Required Tools

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: Latest stable version
- **AWS CLI**: v2.x configured with appropriate credentials
- **Docker**: v20.x or higher (for containerized deployments)
- **PostgreSQL Client**: v15 (for database operations)
- **jq**: For JSON processing in scripts

### Required Access

- GitHub repository access (read/write)
- AWS account credentials with appropriate IAM permissions
- Database credentials for target environment
- VPN access to production infrastructure (for production deployments)
- PagerDuty/Slack access for notifications

### AWS IAM Permissions Required

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::white-cross-*",
        "arn:aws:s3:::white-cross-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:RegisterTaskDefinition"
      ],
      "Resource": "*"
    }
  ]
}
```

## Environment Setup

### 1. Generate Environment Configuration

```bash
# Development
./scripts/setup-env.sh development

# Staging
./scripts/setup-env.sh staging

# Production
./scripts/setup-env.sh production
```

### 2. Validate Environment Configuration

```bash
# Validate environment variables
./scripts/validate-env.sh staging

# Test database connectivity
./scripts/validate-env.sh production
```

### 3. Configure AWS Credentials

```bash
# Configure AWS CLI
aws configure --profile white-cross-staging
aws configure --profile white-cross-production

# Test AWS access
aws sts get-caller-identity --profile white-cross-production
```

## Deployment Process

### Staging Deployment

Staging deployments happen automatically when code is merged to the `develop` branch.

#### Manual Staging Deployment

```bash
# 1. Ensure you're on the develop branch
git checkout develop
git pull origin develop

# 2. Run deployment script
./scripts/deploy.sh staging

# 3. Verify deployment
./scripts/verify-deployment.sh staging
```

#### What Happens During Staging Deployment

1. **Build Phase**
   - Frontend and backend builds are created
   - Build artifacts are validated
   - Bundle sizes are checked

2. **Database Phase**
   - Database backup is created
   - Migrations are executed
   - Migration status is verified

3. **Deployment Phase**
   - Frontend deployed to S3
   - CloudFront cache invalidated
   - Backend deployed to ECS
   - Health checks performed

4. **Verification Phase**
   - Smoke tests executed
   - Performance tests run
   - Security validation performed
   - HIPAA compliance verified

### Production Deployment

Production deployments are triggered by creating a release tag.

#### Creating a Production Release

```bash
# 1. Ensure all changes are merged to master
git checkout master
git pull origin master

# 2. Create release (patch/minor/major)
./scripts/create-release.sh patch

# This will:
# - Bump version in package.json files
# - Generate changelog
# - Create git tag
# - Trigger production deployment pipeline
```

#### Manual Production Deployment (Emergency Only)

```bash
# ⚠️ WARNING: Only use in emergencies
# Production deployments should go through the release process

# 1. Create emergency release
./scripts/create-release.sh patch emergency

# 2. Monitor deployment
# Watch GitHub Actions: https://github.com/your-org/white-cross/actions

# 3. Verify deployment
./scripts/verify-deployment.sh production
```

#### Blue-Green Deployment Process

Production uses blue-green deployment for zero-downtime releases:

1. **Green Environment Preparation**
   - New version deployed to green environment
   - Database migrations executed
   - Health checks performed

2. **Canary Analysis** (10% traffic for 5 minutes)
   - 10% of traffic routed to green
   - Error rates monitored
   - Latency analyzed
   - Automatic rollback if thresholds exceeded

3. **Full Cutover**
   - 100% traffic routed to green
   - Blue environment kept for quick rollback
   - Monitoring continues for 24 hours

4. **Cleanup**
   - Blue environment scaled down after 24 hours
   - Retained for emergency rollback

## Rollback Procedures

### Automatic Rollback

The system automatically rolls back if:
- Health checks fail after deployment
- Error rate exceeds 5% during canary
- Latency exceeds 1 second (p95) during canary

### Manual Rollback

#### Immediate Rollback (< 1 hour after deployment)

```bash
# Rollback to previous version
./scripts/rollback.sh production previous

# This will:
# 1. Create database backup
# 2. Switch traffic to blue (previous) environment
# 3. Verify rollback success
# 4. Send notifications
```

#### Rollback to Specific Version

```bash
# Rollback to a specific task definition or version
./scripts/rollback.sh production arn:aws:ecs:us-east-1:123456789012:task-definition/white-cross-api:42

# Or rollback to a specific release tag
git checkout v1.2.3
./scripts/deploy.sh production
```

#### Database Rollback

```bash
# ⚠️ CAUTION: Database rollbacks should be done carefully

# 1. Rollback last migration
cd backend
NODE_ENV=production npx sequelize-cli db:migrate:undo

# 2. Or restore from backup
./scripts/rollback.sh production previous
# Follow prompts to restore database
```

## Emergency Procedures

### Complete System Failure

If the entire system is down:

1. **Immediate Actions**
   ```bash
   # Check system status
   ./scripts/verify-deployment.sh production

   # Review recent deployments
   git log --oneline -10

   # Check AWS ECS service status
   aws ecs describe-services \
     --cluster white-cross-production \
     --services white-cross-api
   ```

2. **Emergency Rollback**
   ```bash
   # Rollback to last known good version
   ./scripts/rollback.sh production previous
   ```

3. **Incident Response**
   - Create incident in PagerDuty
   - Notify stakeholders via Slack
   - Document timeline and actions taken
   - Create postmortem after resolution

### Database Connection Failure

```bash
# 1. Verify database connectivity
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;"

# 2. Check connection pool
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name DatabaseConnections \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z

# 3. Restart backend services
aws ecs update-service \
  --cluster white-cross-production \
  --service white-cross-api \
  --force-new-deployment
```

### High Error Rate

```bash
# 1. Check error logs
aws logs tail /ecs/white-cross-api --follow

# 2. Check CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_Target_5XX_Count

# 3. If related to recent deployment, rollback
./scripts/rollback.sh production previous
```

### Security Breach

1. **Immediate Actions**
   - Isolate affected systems
   - Rotate all credentials
   - Enable enhanced logging
   - Notify security team

2. **HIPAA Breach Protocol**
   - Document all PHI potentially accessed
   - Notify compliance officer immediately
   - Preserve audit logs
   - Follow organizational breach notification procedures

## Troubleshooting

### Deployment Fails During Build

```bash
# Check build logs
npm run build --verbose

# Clear cache and retry
rm -rf node_modules frontend/dist backend/dist
npm ci
npm run build
```

### Database Migration Fails

```bash
# Check migration status
cd backend
NODE_ENV=production npx sequelize-cli db:migrate:status

# Rollback failed migration
NODE_ENV=production npx sequelize-cli db:migrate:undo

# Fix migration file and retry
NODE_ENV=production npx sequelize-cli db:migrate
```

### Health Check Failures

```bash
# Test health endpoints manually
curl https://app.whitecross.com/health
curl https://app.whitecross.com/api/v1/health/database
curl https://app.whitecross.com/api/v1/health/redis

# Check application logs
aws logs tail /ecs/white-cross-api --follow --filter-pattern "ERROR"
```

### CloudFront Cache Issues

```bash
# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*"

# Check invalidation status
aws cloudfront get-invalidation \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --id $INVALIDATION_ID
```

## HIPAA Compliance Checklist

Before every production deployment, verify:

- [ ] Audit logging is enabled and functional
- [ ] All PHI access is being logged
- [ ] Database encryption at rest is enabled
- [ ] TLS 1.2+ is enforced for all connections
- [ ] Authentication is required for all endpoints
- [ ] Role-based access controls are enforced
- [ ] Database backups are functioning (last 24 hours)
- [ ] Audit logs retention is set to 7 years
- [ ] Security headers are configured
- [ ] No PHI in application logs
- [ ] Emergency access procedures are documented
- [ ] Incident response plan is current

### Post-Deployment HIPAA Verification

```bash
# Run compliance verification
./scripts/verify-deployment.sh production

# Check audit logging
curl https://app.whitecross.com/api/v1/health/audit-status

# Verify encryption
curl -I https://app.whitecross.com | grep -i strict-transport-security

# Check authentication
curl https://app.whitecross.com/api/v1/students
# Should return 401 Unauthorized
```

## Monitoring and Alerts

### Key Metrics to Monitor

- **Application Health**: Uptime, response time, error rate
- **Database**: Connection count, query performance, replication lag
- **Security**: Failed login attempts, unauthorized access
- **HIPAA**: Audit log status, PHI access patterns
- **Infrastructure**: CPU, memory, disk usage

### Alert Escalation

1. **Warning**: Sent to DevOps Slack channel
2. **Critical**: PagerDuty notification to on-call engineer
3. **HIPAA-related**: Immediate notification to compliance officer

## Support

### Getting Help

- **DevOps Team**: devops@whitecross.com
- **Security Issues**: security@whitecross.com
- **HIPAA Compliance**: compliance@whitecross.com
- **Emergency Hotline**: 1-800-XXX-XXXX

### Documentation

- API Documentation: https://docs.whitecross.com
- Runbooks: https://runbooks.whitecross.com
- Confluence: https://whitecross.atlassian.net

## Appendix

### Environment URLs

- **Production**: https://app.whitecross.com
- **Staging**: https://staging.whitecross.example.com
- **Development**: http://localhost:5173

### Deployment Timeline

A typical production deployment takes:
- Build: 5-10 minutes
- Database migrations: 1-5 minutes
- Canary deployment: 5 minutes
- Full cutover: 2-3 minutes
- **Total**: 15-25 minutes

### Recovery Time Objectives (RTO)

- **Rollback**: < 5 minutes
- **Database restore**: < 30 minutes
- **Full disaster recovery**: < 4 hours
