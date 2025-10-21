# White Cross Healthcare Platform - CI/CD Infrastructure Setup

## Overview

This document provides a complete overview of the CI/CD infrastructure created for the White Cross Healthcare Platform. The system is designed with HIPAA compliance, security, and zero-downtime deployments as core requirements.

## What Has Been Created

### 1. GitHub Actions Workflows

#### CI Pipeline (`.github/workflows/ci.yml`)
Comprehensive continuous integration that runs on every pull request:

**Security Scanning**
- Trivy vulnerability scanner for filesystem and dependencies
- npm audit for production dependencies
- TruffleHog for secrets detection
- Snyk security analysis

**Code Quality**
- ESLint for frontend and backend
- TypeScript compilation checks
- Console.log detection in production code
- TODO ticket number verification

**Testing**
- Backend unit/integration tests with PostgreSQL and Redis
- Frontend unit tests with Vitest
- E2E tests with Cypress
- Code coverage tracking (80% minimum threshold)

**Build Verification**
- Frontend and backend builds
- Bundle size checks
- Artifact uploads

**Compliance**
- HIPAA compliance checks
- PHI logging detection
- Encryption configuration verification
- Audit logging verification
- RBAC implementation checks

#### Staging CD Pipeline (`.github/workflows/cd-staging.yml`)
Automatic deployment to staging on merge to `develop`:

**Deployment Steps**
- Build artifacts for staging environment
- Database migrations with backup
- Frontend deployment to S3 + CloudFront invalidation
- Backend deployment to ECS/Fargate
- Health checks and service stabilization

**Validation**
- Smoke tests
- Performance tests (Lighthouse CI, k6 load tests)
- Security validation (OWASP ZAP, SSL checks)
- HIPAA compliance validation

**Automatic Rollback**
- Triggers on deployment failures
- Rollback to previous stable version
- Notifications to team

#### Production CD Pipeline (`.github/workflows/cd-production.yml`)
Triggered by release tags (e.g., `v1.2.3`):

**Pre-Deployment**
- Version validation
- Security scanning
- HIPAA compliance verification

**Blue-Green Deployment**
- Deploy to green environment
- Health checks on green
- Smoke tests on green

**Canary Analysis**
- 10% traffic to green for 5 minutes
- Error rate monitoring (< 5% threshold)
- Latency monitoring (< 1s p95 threshold)
- Automatic rollback on threshold violations

**Full Cutover**
- 100% traffic to green
- Post-cutover monitoring
- Blue environment retained for 24h rollback

**Automatic Rollback**
- Triggers on failures at any stage
- Routes traffic back to blue
- Notifies stakeholders

### 2. Pre-Commit Hooks

#### Husky Configuration

**Pre-Commit Hook** (`.husky/pre-commit`)
- Runs lint-staged for staged files
- Checks for console.log statements
- Validates TODOs have ticket numbers
- Detects debugger statements
- Scans for potential secrets

**Commit Message Hook** (`.husky/commit-msg`)
- Enforces Conventional Commits format
- Validates commit message structure
- Checks for HIPAA-related commits

**Lint-Staged** (`.lintstagedrc.json`)
- Auto-fixes linting issues
- Formats code with Prettier
- Type checks TypeScript files

### 3. Deployment Scripts

#### deploy.sh
Comprehensive deployment automation:
- Environment validation
- AWS credentials verification
- Git status checks
- Frontend and backend builds
- Database migrations with backups
- S3 and CloudFront deployment
- ECS service updates
- Health checks
- Post-deployment verification

#### rollback.sh
Safe rollback procedures:
- Database backup before rollback
- ECS service rollback
- Frontend restoration from S3 backup
- Database migration rollback (optional)
- Rollback verification
- Notification sending

#### migrate-database.sh
Database migration automation:
- Environment configuration loading
- Database connection testing
- Pre-migration backups
- Migration execution
- Verification and integrity checks
- HIPAA table validation
- Cleanup of old backups

### 4. Environment Management

#### setup-env.sh
Generates environment configuration files:
- Development environment setup
- Staging environment template
- Production environment template
- Secret generation utilities
- Environment file encryption
- .env.example generation

#### validate-env.sh
Validates environment configurations:
- Required variables check
- Database configuration validation
- Security configuration validation
- HIPAA compliance validation
- CORS configuration check
- Monitoring configuration check
- Connection tests (optional)

### 5. Deployment Verification

#### verify-deployment.sh
Comprehensive post-deployment checks:
- Basic health endpoints
- Database and Redis connectivity
- API version verification
- Security headers validation
- SSL certificate checks
- Authentication enforcement
- HIPAA compliance verification
- Response time monitoring
- Rate limiting verification
- Critical endpoint checks
- Frontend availability
- Database migration status
- Smoke tests
- Monitoring integration

### 6. Docker Configuration

#### Dockerfile (Multi-stage)
Production-optimized containerization:
- Base image with security updates
- Non-root user for security
- Separate build stages for frontend/backend
- Production and development targets
- Health checks
- Minimal final image size

#### docker-compose.dev.yml
Complete development environment:
- PostgreSQL 15 with health checks
- Redis 7 with persistence
- Backend with hot reload
- Frontend development server
- Adminer for database management
- Redis Commander
- Mailhog for email testing

#### .dockerignore
Optimizes Docker builds:
- Excludes node_modules
- Excludes development files
- Excludes secrets
- Reduces image size

### 7. Feature Flags System

#### featureFlags.ts
Centralized feature management:
- Feature flag definitions
- Environment-specific flags
- Gradual rollout support (percentage-based)
- User/role-based flags
- Dependency management
- Deprecation tracking
- React hooks integration
- HOC for feature gating

**Key Features**
- `enableApiDocs`: API documentation (dev/staging only)
- `enableDebugMode`: Debug tools (dev only)
- `enableAdvancedHealthRecords`: Advanced health features
- `enableTelehealthIntegration`: Telehealth (50% rollout)
- `enableHealthAnalytics`: Analytics dashboard (75% rollout)
- `enableAuditLogging`: HIPAA audit logging (always on)
- `enableAIAssistant`: AI assistant (5% beta)

### 8. Monitoring and Alerting

#### Prometheus Configuration (`monitoring/prometheus.yml`)
Metrics collection:
- Backend API metrics
- Node exporter (system metrics)
- PostgreSQL exporter
- Redis exporter
- CloudWatch integration

#### Alert Rules (`monitoring/alert-rules.yml`)
HIPAA-compliant alerting:

**Critical Alerts**
- Application down
- Database connection failures
- High error rates
- Audit log failures
- PHI access without audit
- Database backup failures

**Warning Alerts**
- High response times
- High CPU/memory usage
- Connection pool exhaustion
- Slow queries
- Unauthorized access attempts

**Security Alerts**
- SSL certificate expiration
- Failed login attempts
- Rate limiting violations

### 9. Release Automation

#### create-release.sh
Automated release process:
- Version bumping (major/minor/patch)
- Pre-release tag support
- Git status validation
- Branch verification
- Changelog generation from commits
- Release notes generation
- Package.json updates
- Git tag creation
- GitHub release creation

### 10. Documentation

#### DEPLOYMENT.md
Complete deployment guide:
- Prerequisites and required tools
- Environment setup procedures
- Staging deployment process
- Production deployment (blue-green)
- Rollback procedures
- Emergency procedures
- Troubleshooting guide
- HIPAA compliance checklist

#### CI_CD.md
CI/CD pipeline documentation:
- Pipeline architecture overview
- CI job descriptions
- CD deployment steps
- Security and compliance
- Adding new checks
- Debugging failed pipelines
- Best practices
- Performance optimization

## Quick Start Guide

### Initial Setup

1. **Install Husky**
   ```bash
   npm install
   npx husky install
   chmod +x .husky/pre-commit
   chmod +x .husky/commit-msg
   ```

2. **Make Scripts Executable**
   ```bash
   chmod +x scripts/*.sh
   ```

3. **Setup Environment**
   ```bash
   ./scripts/setup-env.sh development
   ./scripts/validate-env.sh development
   ```

4. **Configure GitHub Secrets**

   Required secrets for CI/CD:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `STAGING_*` (staging environment variables)
   - `PRODUCTION_*` (production environment variables)
   - `SLACK_WEBHOOK_URL`
   - `CYPRESS_RECORD_KEY`
   - `SNYK_TOKEN`

### Making Your First Deployment

#### To Staging

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push and create PR
git push origin feature/my-feature

# 4. After PR approval, merge to develop
# Staging deployment happens automatically
```

#### To Production

```bash
# 1. Ensure develop is merged to master
git checkout master
git merge develop

# 2. Create release
./scripts/create-release.sh patch

# 3. Monitor deployment
# Watch GitHub Actions for progress

# 4. Verify deployment
./scripts/verify-deployment.sh production
```

## Architecture Decisions

### Why Blue-Green Deployment?

- **Zero Downtime**: Seamless traffic switching
- **Easy Rollback**: Keep previous version running
- **Testing in Production**: Test green before cutover
- **HIPAA Compliance**: Maintain continuous availability

### Why Canary Analysis?

- **Risk Mitigation**: Catch issues with 10% traffic
- **Automatic Rollback**: AI-free automatic decision
- **Performance Validation**: Real production metrics
- **User Safety**: Minimize blast radius

### Why Feature Flags?

- **Gradual Rollout**: Control feature exposure
- **A/B Testing**: Compare feature variants
- **Kill Switch**: Disable problematic features
- **Compliance**: Controlled PHI feature access

## Security Considerations

### Secrets Management

- **Never commit secrets**: Use .env files (gitignored)
- **Production secrets**: AWS Secrets Manager only
- **CI/CD secrets**: GitHub Secrets
- **Rotation**: 90-day rotation schedule

### HIPAA Compliance

- **Audit Logging**: All PHI access logged
- **Encryption**: TLS 1.2+ in transit, AES-256 at rest
- **Access Control**: RBAC enforced
- **Retention**: 7-year audit log retention
- **Backups**: Automated with 30-day retention minimum

### Vulnerability Management

- **Daily scans**: Automated dependency scanning
- **PR blocking**: HIGH/CRITICAL vulnerabilities block merge
- **Update policy**: Security patches within 7 days
- **Penetration testing**: Quarterly external audits

## Monitoring and Observability

### Key Metrics

**Application**
- Request rate, error rate, duration (RED metrics)
- Apdex score
- Active users

**Infrastructure**
- CPU, memory, disk usage
- Network I/O
- Container health

**Business**
- Student records created/updated
- Medication dispensing events
- Emergency notifications sent

**HIPAA**
- PHI access count
- Audit log write rate
- Authentication failures
- Unauthorized access attempts

### Alert Escalation

1. **Info**: Logged only
2. **Warning**: Slack notification
3. **Critical**: PagerDuty + Slack
4. **HIPAA**: Immediate compliance officer notification

## Disaster Recovery

### RTO/RPO Targets

- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 15 minutes

### Backup Strategy

**Database**
- Automated daily backups
- Continuous WAL archiving (15-min RPO)
- Cross-region replication
- 90-day retention

**Application**
- Docker images retained for 30 days
- ECS task definitions retained indefinitely
- S3 versioning enabled

### Disaster Scenarios

1. **Single AZ Failure**: Auto-failover (< 5 min)
2. **Database Corruption**: Restore from backup (< 30 min)
3. **Complete Region Failure**: DR region activation (< 4 hours)
4. **Application Bug**: Rollback deployment (< 5 min)

## Cost Optimization

### CI/CD Costs

- GitHub Actions: ~$50/month (included in plan)
- AWS ECS: ~$200/month (staging + production)
- AWS RDS: ~$150/month
- AWS S3/CloudFront: ~$50/month
- **Total**: ~$450/month

### Cost Reduction Tips

1. Use spot instances for non-production
2. Auto-scale ECS tasks based on load
3. Implement CloudFront caching
4. Compress and optimize assets
5. Clean up old Docker images

## Troubleshooting

### Common Issues

**1. Deployment Fails with "Task failed to start"**
```bash
# Check ECS task logs
aws logs tail /ecs/white-cross-api --follow

# Check task stopped reason
aws ecs describe-tasks --cluster <cluster> --tasks <task-id>
```

**2. Health Checks Failing**
```bash
# Test health endpoint manually
curl https://app.whitecross.com/health

# Check security group rules
aws ec2 describe-security-groups --group-ids <sg-id>
```

**3. Database Migration Fails**
```bash
# Check migration status
cd backend
npx sequelize-cli db:migrate:status

# Rollback last migration
npx sequelize-cli db:migrate:undo
```

## Future Enhancements

### Planned Improvements

1. **GitOps**: Implement ArgoCD for declarative deployments
2. **Service Mesh**: Add Istio for advanced traffic management
3. **Chaos Engineering**: Implement Chaos Monkey for resilience testing
4. **Cost Tracking**: FinOps dashboard for cost attribution
5. **Performance**: Add distributed tracing with OpenTelemetry

### Roadmap

**Q1 2024**
- Implement automated performance regression testing
- Add infrastructure as code (Terraform/CloudFormation)
- Enhance monitoring with custom dashboards

**Q2 2024**
- Multi-region deployment
- Advanced canary analysis with ML
- Automated security remediation

## Contributing

### Adding New Features to CI/CD

1. Create feature branch
2. Update relevant workflow files
3. Test in staging first
4. Document changes in this file
5. Create PR with detailed description

### Reporting Issues

- **Security issues**: security@whitecross.com
- **CI/CD issues**: devops@whitecross.com
- **General questions**: #devops Slack channel

## Support

### Resources

- **Documentation**: https://docs.whitecross.com
- **Runbooks**: https://runbooks.whitecross.com
- **Slack**: #devops, #releases
- **Email**: devops@whitecross.com

### On-Call

- **DevOps**: Consult PagerDuty schedule
- **Security**: security@whitecross.com
- **HIPAA**: compliance@whitecross.com

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintained By**: DevOps Team
