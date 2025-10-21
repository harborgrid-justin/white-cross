# White Cross Healthcare Platform - CI/CD Documentation

## Overview

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the White Cross Healthcare Platform. Our CI/CD infrastructure is designed with HIPAA compliance, security, and zero-downtime deployments as primary concerns.

## Table of Contents

1. [Pipeline Architecture](#pipeline-architecture)
2. [Continuous Integration (CI)](#continuous-integration-ci)
3. [Continuous Deployment (CD)](#continuous-deployment-cd)
4. [Security and Compliance](#security-and-compliance)
5. [Adding New Checks](#adding-new-checks)
6. [Debugging Failed Pipelines](#debugging-failed-pipelines)
7. [Best Practices](#best-practices)

## Pipeline Architecture

### Overview

```
┌─────────────────┐
│  Pull Request   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   CI Pipeline   │
│  - Lint         │
│  - Type Check   │
│  - Tests        │
│  - Security     │
│  - Build        │
└────────┬────────┘
         │
         ▼ (on merge to develop)
┌─────────────────┐
│ CD to Staging   │
│  - Deploy       │
│  - Smoke Tests  │
│  - Verify       │
└────────┬────────┘
         │
         ▼ (on release tag)
┌─────────────────┐
│ CD to Production│
│  - Blue-Green   │
│  - Canary       │
│  - Full Cutover │
└─────────────────┘
```

### Technology Stack

- **CI/CD Platform**: GitHub Actions
- **Container Registry**: AWS ECR
- **Deployment**: AWS ECS (Fargate)
- **Static Assets**: AWS S3 + CloudFront
- **Monitoring**: Prometheus + Grafana
- **Alerting**: AlertManager + Slack/PagerDuty
- **Secret Management**: AWS Secrets Manager

## Continuous Integration (CI)

### Triggers

The CI pipeline runs on:
- All pull requests to `master` or `develop`
- All pushes to `master` or `develop`

### Pipeline Jobs

#### 1. Security Scanning

**Duration**: ~2-3 minutes

```yaml
security-scan:
  - Trivy vulnerability scanning
  - npm audit (production dependencies)
  - Secrets detection (TruffleHog)
  - Snyk security analysis
```

**Key Features**:
- Scans for CVEs in dependencies
- Detects accidentally committed secrets
- Uploads results to GitHub Security tab
- Fails on HIGH or CRITICAL vulnerabilities

**Adding Custom Security Checks**:

```yaml
# .github/workflows/ci.yml
- name: Custom security check
  run: |
    # Your security check script
    ./scripts/custom-security-check.sh
```

#### 2. Lint and Type Check

**Duration**: ~2-3 minutes

```yaml
lint:
  - ESLint (frontend + backend)
  - TypeScript compilation check
  - Check for console.log in production code
  - Verify TODOs include ticket numbers
```

**Key Features**:
- Enforces code quality standards
- Prevents common errors
- Ensures consistent code style

**Customizing Lint Rules**:

Edit `.eslintrc.json` in frontend or backend directories:

```json
{
  "rules": {
    "your-custom-rule": "error"
  }
}
```

#### 3. Backend Tests

**Duration**: ~5-7 minutes

```yaml
test-backend:
  services:
    - postgres:15
    - redis:7
  steps:
    - Database migrations
    - Unit tests with coverage
    - Integration tests
```

**Key Features**:
- Real PostgreSQL and Redis instances
- Code coverage reporting to Codecov
- Minimum 80% coverage requirement
- Parallel test execution

**Adding New Tests**:

```typescript
// backend/src/__tests__/example.test.ts
describe('Example Feature', () => {
  it('should work correctly', async () => {
    // Your test here
  });
});
```

#### 4. Frontend Tests

**Duration**: ~3-5 minutes

```yaml
test-frontend:
  - Unit tests (Vitest)
  - Component tests
  - Coverage reporting
```

**Adding Component Tests**:

```typescript
// frontend/src/components/__tests__/Example.test.tsx
import { render, screen } from '@testing-library/react';
import { Example } from '../Example';

describe('Example Component', () => {
  it('renders correctly', () => {
    render(<Example />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

#### 5. E2E Tests

**Duration**: ~10-15 minutes

```yaml
test-e2e:
  - Start backend server
  - Start frontend server
  - Run Cypress tests
  - Upload screenshots/videos
```

**Adding E2E Tests**:

```typescript
// frontend/cypress/e2e/example.cy.ts
describe('User Login Flow', () => {
  it('should allow user to login', () => {
    cy.visit('/login');
    cy.get('[data-testid="username"]').type('testuser');
    cy.get('[data-testid="password"]').type('password');
    cy.get('[data-testid="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

#### 6. Build Verification

**Duration**: ~3-5 minutes

```yaml
build:
  - Install dependencies
  - Build frontend
  - Build backend
  - Check bundle size
  - Upload artifacts
```

**Bundle Size Checks**:

Modify in `.github/workflows/ci.yml`:

```yaml
- name: Check bundle size
  run: |
    BUNDLE_SIZE=$(du -sk frontend/dist | cut -f1)
    MAX_SIZE=10240  # 10MB in KB
    if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
      echo "Bundle too large: ${BUNDLE_SIZE}KB > ${MAX_SIZE}KB"
      exit 1
    fi
```

#### 7. HIPAA Compliance Checks

**Duration**: ~1-2 minutes

```yaml
hipaa-compliance:
  - Check for PHI in logs
  - Verify encryption config
  - Verify audit logging
  - Check authentication
  - Check RBAC implementation
```

**Adding Compliance Checks**:

```yaml
- name: Custom HIPAA check
  run: |
    # Verify audit logging in new feature
    if ! grep -r "auditLog" backend/src/features/new-feature; then
      echo "Error: New feature missing audit logging"
      exit 1
    fi
```

### Success Criteria

For a PR to be mergeable, all jobs must pass:
- ✅ Security scan: No HIGH/CRITICAL issues
- ✅ Lint: No errors
- ✅ Backend tests: Pass with ≥80% coverage
- ✅ Frontend tests: Pass with ≥80% coverage
- ✅ E2E tests: All scenarios pass
- ✅ Build: Successful with acceptable bundle size
- ✅ HIPAA compliance: All checks pass

## Continuous Deployment (CD)

### Staging Deployment

**Trigger**: Automatic on merge to `develop` branch

**Pipeline**: `.github/workflows/cd-staging.yml`

#### Deployment Steps

1. **Build Phase**
   ```yaml
   - Build frontend (VITE_API_URL=staging)
   - Build backend
   - Create Docker image
   ```

2. **Database Phase**
   ```yaml
   - Create database backup
   - Run migrations
   - Verify migration success
   ```

3. **Deploy Phase**
   ```yaml
   - Upload frontend to S3
   - Invalidate CloudFront
   - Deploy backend to ECS
   - Wait for service stability
   ```

4. **Verification Phase**
   ```yaml
   - Health checks
   - Smoke tests
   - Performance tests
   - Security validation
   ```

#### Automatic Rollback

Staging automatically rolls back if:
- Health checks fail
- Smoke tests fail
- Security validation fails

### Production Deployment

**Trigger**: Manual via release tag (e.g., `v1.2.3`)

**Pipeline**: `.github/workflows/cd-production.yml`

#### Pre-Deployment

```yaml
pre-deployment-checks:
  - Verify version format
  - Check staging deployment
  - Run final security scan
  - Validate HIPAA compliance
```

#### Blue-Green Deployment

1. **Deploy to Green Environment**
   ```yaml
   - Build production artifacts
   - Deploy to green ECS cluster
   - Run health checks on green
   - Execute smoke tests on green
   ```

2. **Canary Analysis** (10% traffic, 5 minutes)
   ```yaml
   - Route 10% traffic to green
   - Monitor error rates
   - Monitor latency (p95)
   - Analyze metrics
   - Auto-rollback if thresholds exceeded
   ```

3. **Full Cutover**
   ```yaml
   - Route 100% traffic to green
   - Monitor for 2 minutes
   - Validate metrics
   - Tag green as new blue
   ```

4. **Cleanup**
   ```yaml
   - Scale down old blue
   - Schedule full cleanup (24h)
   ```

#### Rollback Triggers

Automatic rollback occurs if:
- Error rate > 5%
- p95 latency > 1 second
- Health checks fail
- HIPAA compliance violations detected

### Manual Approval Gates

Production deployment requires manual approval for:
- Full cutover (after successful canary)
- Any deployment outside business hours
- Deployments with database schema changes

## Security and Compliance

### Secret Management

**Never** commit secrets to the repository. Use:

1. **GitHub Secrets** for CI/CD variables
2. **AWS Secrets Manager** for application secrets
3. **Environment variables** for configuration

**Adding a New Secret**:

```bash
# In GitHub repository settings
Settings → Secrets and variables → Actions → New repository secret

# For AWS Secrets Manager
aws secretsmanager create-secret \
  --name white-cross/production/database-password \
  --secret-string "your-secret-value"
```

### HIPAA Compliance in CI/CD

#### Audit Logging

All deployments are logged with:
- Timestamp
- Deployer identity
- Version deployed
- Deployment outcome
- Rollback events (if any)

#### PHI Protection

- No PHI in test data
- Test databases are isolated
- Sanitized data for E2E tests
- Production data never in CI/CD

#### Access Controls

- Branch protection rules enforced
- Required reviews for production releases
- Audit trail for all deployments
- Role-based GitHub team access

### Security Scanning Schedule

| Scan Type | Frequency | Tool |
|-----------|-----------|------|
| Dependency vulnerabilities | Every PR | npm audit, Snyk |
| Container vulnerabilities | Every PR | Trivy |
| Secrets detection | Every PR | TruffleHog |
| SAST | Every PR | ESLint security rules |
| DAST | After staging deployment | OWASP ZAP |

## Adding New Checks

### Adding a New CI Job

1. **Edit `.github/workflows/ci.yml`**:

```yaml
new-check:
  name: My New Check
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Run my check
      run: |
        ./scripts/my-new-check.sh
```

2. **Add to required status checks**:
   - Go to Settings → Branches → Branch protection rules
   - Add "My New Check" to required status checks

### Adding a Pre-Commit Hook

Edit `.husky/pre-commit`:

```bash
# Add your check
echo "Running my custom check..."
./scripts/my-custom-check.sh
```

### Adding a Custom Lint Rule

1. **Create ESLint plugin** or **add rule to .eslintrc.json**:

```json
{
  "rules": {
    "no-patient-data-in-logs": "error"
  }
}
```

2. **Create custom rule** (advanced):

```javascript
// eslint-rules/no-patient-data-in-logs.js
module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.property?.name === 'log') {
          // Check for PHI patterns
        }
      }
    };
  }
};
```

## Debugging Failed Pipelines

### Common Failures and Solutions

#### 1. Test Failures

```bash
# Run tests locally
npm test

# Run specific test file
npm test -- src/__tests__/failing-test.test.ts

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

#### 2. Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm ci
npm run build

# Check for environment issues
npm run build -- --verbose
```

#### 3. Linting Failures

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint:fix

# Check specific file
npx eslint src/path/to/file.ts
```

#### 4. E2E Test Failures

```bash
# Run Cypress locally
cd frontend
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific test
npx cypress run --spec "cypress/e2e/specific-test.cy.ts"
```

### Viewing Logs

#### GitHub Actions Logs

1. Go to Actions tab
2. Click on failed workflow
3. Click on failed job
4. Expand failed step

#### CloudWatch Logs (Deployed Services)

```bash
# Tail backend logs
aws logs tail /ecs/white-cross-api --follow

# Filter for errors
aws logs tail /ecs/white-cross-api --follow --filter-pattern "ERROR"

# Specific time range
aws logs tail /ecs/white-cross-api \
  --start-time 2024-01-01T10:00:00 \
  --end-time 2024-01-01T11:00:00
```

### Debugging Deployment Failures

```bash
# Check ECS service status
aws ecs describe-services \
  --cluster white-cross-production \
  --services white-cross-api

# Check task definition
aws ecs describe-task-definition \
  --task-definition white-cross-api:latest

# Check running tasks
aws ecs list-tasks \
  --cluster white-cross-production \
  --service-name white-cross-api
```

## Best Practices

### Code Quality

1. **Write Tests First**: Follow TDD for new features
2. **Maintain Coverage**: Keep code coverage above 80%
3. **Small PRs**: Keep pull requests focused and reviewable
4. **Meaningful Commits**: Use conventional commit format

### Deployment Best Practices

1. **Deploy During Business Hours**: Unless emergency
2. **Monitor After Deployment**: Watch metrics for 30 minutes
3. **Have Rollback Plan**: Always know how to rollback
4. **Document Changes**: Update changelog for user-facing changes

### Security Best Practices

1. **Rotate Secrets Regularly**: Every 90 days minimum
2. **Review Dependencies**: Check for vulnerabilities weekly
3. **Least Privilege**: Grant minimum required permissions
4. **Audit Logs**: Review deployment logs monthly

### HIPAA Best Practices

1. **Audit All Changes**: Maintain complete audit trail
2. **No PHI in Logs**: Never log patient information
3. **Encrypt Everything**: Data at rest and in transit
4. **Test Security**: Regular penetration testing

## Performance Optimization

### Build Performance

```yaml
# Use cache for dependencies
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Test Performance

```yaml
# Run tests in parallel
- name: Run tests
  run: npm test -- --maxWorkers=4
```

### Deployment Performance

- Use Docker layer caching
- Parallel deployment of frontend and backend
- Pre-warming ECS tasks

## Metrics and Monitoring

### Pipeline Metrics

Track these metrics:
- Build duration
- Test duration
- Deployment frequency
- Deployment success rate
- Mean time to recovery (MTTR)

### Alerts

Configure alerts for:
- Pipeline failures
- Long-running pipelines (> 30 minutes)
- Failed deployments
- Rollback events

## Troubleshooting Guide

### Pipeline Stuck

```bash
# Cancel stuck workflow
gh workflow view
gh run cancel <run-id>
```

### Secrets Not Working

```bash
# Verify secret exists
gh secret list

# Update secret
gh secret set SECRET_NAME
```

### Cache Issues

```yaml
# Clear cache by changing cache key
- uses: actions/cache@v3
  with:
    key: v2-${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

## Support and Resources

### Documentation
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [AWS ECS Docs](https://docs.aws.amazon.com/ecs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Internal Resources
- Runbooks: `https://runbooks.whitecross.com`
- Slack: `#devops` channel
- Email: `devops@whitecross.com`

### Emergency Contacts
- On-call DevOps: PagerDuty
- Security Team: security@whitecross.com
- HIPAA Compliance: compliance@whitecross.com
