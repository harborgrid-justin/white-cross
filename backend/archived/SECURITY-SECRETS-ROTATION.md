# Security Secrets Rotation Guide

## CRITICAL SECURITY NOTICE

**This document provides step-by-step instructions for rotating exposed credentials and secrets in the White Cross Healthcare Platform.**

**IMPORTANT**: The current .env file contains EXPOSED CREDENTIALS that must be rotated IMMEDIATELY before deployment to production.

---

## Table of Contents

1. [Immediate Actions Required](#immediate-actions-required)
2. [Exposed Credentials](#exposed-credentials)
3. [Secret Rotation Process](#secret-rotation-process)
4. [Git History Cleanup](#git-history-cleanup)
5. [Automated Tools](#automated-tools)
6. [Best Practices](#best-practices)
7. [Regular Maintenance](#regular-maintenance)

---

## Immediate Actions Required

### Priority 1: Rotate Exposed Production Credentials

The following credentials are EXPOSED in the repository and must be rotated immediately:

1. **Database Password**: `npg_H94zeipRTwAS` (Neon PostgreSQL)
2. **Redis Password**: `I7NxZuOAnvmO6MHCkfoWvre7QZvsyuo3` (Redis Cloud)
3. **JWT Secrets**: Development-only secrets with weak patterns
4. **CSRF Secret**: Contains weak pattern "development-only"
5. **Config Encryption Key**: Contains weak pattern "development-only"
6. **AWS Secret Key**: Fake development key (if used in production)

### Priority 2: Generate Strong Secrets

All weak/development secrets must be replaced with cryptographically strong random secrets before production deployment.

---

## Exposed Credentials

### Database Credentials (CRITICAL)

**Current Exposed Values**:
```
DB_HOST=ep-fancy-butterfly-adze3wy1-pooler.c-2.us-east-1.aws.neon.tech
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_H94zeipRTwAS
DB_NAME=production
```

**Action Required**:
1. Login to Neon PostgreSQL console: https://console.neon.tech/
2. Navigate to your project settings
3. Reset database password for user `neondb_owner`
4. Update `.env` file with new password
5. Restart application to apply new credentials

### Redis Credentials (CRITICAL)

**Current Exposed Values**:
```
REDIS_HOST=redis-15710.fcrce180.us-east-1-1.ec2.redns.redis-cloud.com
REDIS_PORT=15710
REDIS_PASSWORD=I7NxZuOAnvmO6MHCkfoWvre7QZvsyuo3
REDIS_USERNAME=default
```

**Action Required**:
1. Login to Redis Cloud console: https://app.redislabs.com/
2. Navigate to your database configuration
3. Reset password for the database instance
4. Update `.env` file with new password
5. Restart application and workers to apply new credentials

### JWT Secrets (HIGH PRIORITY)

**Current Exposed Values**:
```
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars-for-development-only
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-chars-for-development-only
```

**Security Issues**:
- Contains weak pattern "development-only"
- NOT cryptographically random
- SAME across all environments
- Insufficient entropy for production

**Action Required**:
1. Generate new secrets using provided script:
   ```bash
   node scripts/generate-secrets.js --key JWT_SECRET
   node scripts/generate-secrets.js --key JWT_REFRESH_SECRET
   ```

2. Ensure secrets are DIFFERENT from each other

3. Update `.env` file

4. **IMPORTANT**: Rotating JWT secrets will invalidate ALL existing user sessions
   - Plan rotation during maintenance window
   - Notify users they will need to re-login
   - Consider implementing token migration strategy for smooth transition

### CSRF Secret (HIGH PRIORITY)

**Current Exposed Value**:
```
CSRF_SECRET=your-csrf-secret-minimum-32-chars-for-development-only
```

**Action Required**:
```bash
node scripts/generate-secrets.js --key CSRF_SECRET
```

### Encryption Keys (HIGH PRIORITY)

**Current Exposed Values**:
```
CONFIG_ENCRYPTION_KEY=your-config-encryption-key-minimum-32-chars-for-development-only
```

**Action Required**:
```bash
node scripts/generate-secrets.js --key CONFIG_ENCRYPTION_KEY
node scripts/generate-secrets.js --key ENCRYPTION_KEY
```

**WARNING**: Rotating encryption keys requires re-encrypting all encrypted data:
1. Backup all encrypted data before rotation
2. Use key migration strategy (support both old and new keys temporarily)
3. Re-encrypt all data with new key
4. Remove old key after migration complete

---

## Secret Rotation Process

### Step-by-Step Rotation

#### 1. Generate New Secrets

```bash
# Generate all secrets at once
cd backend
node scripts/generate-secrets.js --all

# Or generate individually
node scripts/generate-secrets.js --key JWT_SECRET
node scripts/generate-secrets.js --key JWT_REFRESH_SECRET
node scripts/generate-secrets.js --key CSRF_SECRET
node scripts/generate-secrets.js --key CONFIG_ENCRYPTION_KEY
```

#### 2. Update Environment Files

Create a new `.env.production` file (NEVER commit to git):

```bash
# Copy template
cp .env.example .env.production

# Edit with new secrets
nano .env.production
```

Update with newly generated secrets:

```env
# ================================================================================
# DATABASE CONFIGURATION (Rotate immediately)
# ================================================================================
DB_HOST=<your-neon-host>
DB_PORT=5432
DB_USERNAME=<your-db-user>
DB_PASSWORD=<NEW_STRONG_PASSWORD_FROM_NEON>
DB_NAME=production
DB_SSL=true

# ================================================================================
# JWT & AUTHENTICATION (Rotate immediately)
# ================================================================================
JWT_SECRET=<NEW_GENERATED_SECRET_256_BITS>
JWT_REFRESH_SECRET=<NEW_DIFFERENT_GENERATED_SECRET_256_BITS>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ================================================================================
# SECURITY CONFIGURATION (Rotate immediately)
# ================================================================================
CSRF_SECRET=<NEW_GENERATED_SECRET_256_BITS>
CONFIG_ENCRYPTION_KEY=<NEW_GENERATED_KEY_256_BITS>
BCRYPT_SALT_ROUNDS=12

# ================================================================================
# REDIS CONFIGURATION (Rotate immediately)
# ================================================================================
REDIS_HOST=<your-redis-host>
REDIS_PORT=<your-redis-port>
REDIS_PASSWORD=<NEW_PASSWORD_FROM_REDIS_CLOUD>
REDIS_USERNAME=default
```

#### 3. Validate New Configuration

```bash
# Validate environment variables before deployment
node scripts/validate-env.js

# Expected output: "✓ All validations passed!"
```

#### 4. Deploy New Secrets

**For Cloud Platforms (Vercel, Heroku, AWS, etc.)**:
```bash
# Example for Vercel
vercel env add JWT_SECRET production
vercel env add JWT_REFRESH_SECRET production
# ... add all secrets

# Redeploy application
vercel --prod
```

**For Docker/Kubernetes**:
```bash
# Update Kubernetes secrets
kubectl create secret generic app-secrets \
  --from-env-file=.env.production \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart pods to pick up new secrets
kubectl rollout restart deployment/white-cross-backend
```

**For Traditional Servers**:
```bash
# SSH to production server
ssh user@production-server

# Update .env file securely
nano /path/to/app/.env

# Restart application
pm2 restart white-cross-backend
# or
systemctl restart white-cross-backend
```

#### 5. Verify Application Health

```bash
# Test authentication endpoint
curl -X POST https://api.yourapp.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Should return JWT token with new secret
# Verify token is valid and not using old secret

# Test CSRF protection
curl -X POST https://api.yourapp.com/protected-endpoint \
  -H "Authorization: Bearer <token>" \
  -H "X-CSRF-Token: <csrf-token>"
```

#### 6. Monitor for Issues

- Check application logs for authentication errors
- Monitor user login success rate
- Watch for CSRF validation failures
- Track database connection errors
- Monitor Redis connection health

---

## Git History Cleanup

### WARNING: NEVER EXECUTE WITHOUT TEAM COORDINATION

The .env file with exposed secrets is in git history. To remove it:

**DOCUMENTATION ONLY - DO NOT EXECUTE**:

```bash
# DANGER: This rewrites git history
# Coordinate with team before executing
# All developers must re-clone after this

# Use BFG Repo-Cleaner (recommended)
# 1. Install BFG
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# 2. Clone a fresh copy
git clone --mirror https://github.com/your-org/white-cross.git

# 3. Remove .env files from history
cd white-cross.git
bfg --delete-files .env

# 4. Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Force push (DANGEROUS - requires team coordination)
git push --force

# Alternative: Using git filter-repo (more powerful)
# Install: pip install git-filter-repo

git filter-repo --path backend/.env --invert-paths --force

# All team members must then:
git clone <repo-url>  # Fresh clone required
```

**IMPORTANT**:
1. Notify all team members before rewriting history
2. All developers must delete local clones and re-clone
3. Backup repository before proceeding
4. Consider this only if secrets were committed recently
5. If secrets are old, rotation alone may be sufficient

### Alternative: Invalidate Secrets

Instead of rewriting git history (which is disruptive), you can:

1. **Rotate all exposed secrets** (as documented above)
2. **Add .env to .gitignore** (already done)
3. **Monitor for unauthorized access** using rotated credentials
4. **Enable GitHub secret scanning alerts**
5. **Document the incident** for security audit trail

This is the **RECOMMENDED** approach as it's less disruptive and achieves the same security outcome.

---

## Automated Tools

### Validation Script

Validates environment variables before deployment:

```bash
# Run validation
npm run validate:env

# Expected output for production:
# ✓ All validations passed!
# Environment is properly configured.

# Exit codes:
# 0 = All validations passed
# 1 = Critical errors (block deployment)
# 2 = Warnings (deployment allowed but not recommended)
```

### Secret Generation Script

Generates cryptographically strong secrets:

```bash
# Interactive mode
npm run generate:secrets

# Generate all secrets
npm run generate:secrets -- --all

# Generate specific secret
npm run generate:secrets -- --key JWT_SECRET

# Custom byte length
npm run generate:secrets -- --key JWT_SECRET --bytes 64
```

### Add to package.json

```json
{
  "scripts": {
    "validate:env": "node scripts/validate-env.js",
    "generate:secrets": "node scripts/generate-secrets.js",
    "rotate:secrets": "npm run generate:secrets -- --all && npm run validate:env"
  }
}
```

---

## Best Practices

### Secret Management

1. **Never commit secrets to git**
   - Add `.env*` to `.gitignore`
   - Use `.env.example` as template (no real values)
   - Commit `.env.example` to git as documentation

2. **Use environment-specific secrets**
   - Development: `.env.development`
   - Staging: `.env.staging`
   - Production: `.env.production`
   - NEVER share secrets between environments

3. **Use secret management services**
   - AWS Secrets Manager
   - Azure Key Vault
   - HashiCorp Vault
   - Google Cloud Secret Manager
   - 1Password Secrets Automation

4. **Implement least privilege**
   - Database users should have minimum required permissions
   - API keys should be scoped to specific operations
   - Service accounts should have restricted access

5. **Enable audit logging**
   - Track secret access and rotation events
   - Monitor for unauthorized access attempts
   - Alert on suspicious activity

### Secret Rotation Schedule

| Secret Type | Rotation Frequency | Priority |
|-------------|-------------------|----------|
| Database passwords | 90 days | CRITICAL |
| API keys | 90 days | CRITICAL |
| JWT secrets | 90 days | HIGH |
| CSRF secrets | 90 days | HIGH |
| Encryption keys | 180 days | HIGH |
| Session secrets | 60 days | MEDIUM |

### Emergency Rotation

Rotate secrets immediately if:
- Secrets are exposed in git history
- Secrets are leaked in logs or error messages
- Suspicious access detected
- Employee with secret access leaves company
- Security breach or compromise suspected
- Compliance audit requires rotation

---

## Regular Maintenance

### Monthly Security Checklist

- [ ] Review secret rotation schedule
- [ ] Check for exposed secrets in git history
- [ ] Audit secret access logs
- [ ] Update secret documentation
- [ ] Test secret rotation procedures
- [ ] Validate backup and recovery processes

### Quarterly Security Review

- [ ] Rotate all critical secrets (database, API keys)
- [ ] Review and update .gitignore
- [ ] Audit environment configurations
- [ ] Test disaster recovery procedures
- [ ] Update security documentation
- [ ] Train team on secret management

### Annual Security Audit

- [ ] Comprehensive secret inventory
- [ ] Review secret management policies
- [ ] Assess secret storage security
- [ ] Evaluate encryption key management
- [ ] Test emergency rotation procedures
- [ ] Update incident response plan

---

## Emergency Contacts

### Security Incidents

If secrets are compromised:

1. **Immediate**: Rotate compromised secrets
2. **Alert**: Notify security team and stakeholders
3. **Investigate**: Review access logs for unauthorized use
4. **Document**: Record incident details for audit
5. **Review**: Update security procedures to prevent recurrence

### Escalation Path

1. Development Team Lead
2. Security Officer
3. CTO/Engineering Manager
4. Legal/Compliance Team (for HIPAA incidents)

---

## Additional Resources

### Documentation
- [OWASP Secret Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [NIST SP 800-57: Key Management](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)
- [CIS Controls: Secret Management](https://www.cisecurity.org/controls)

### Tools
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-secrets](https://github.com/awslabs/git-secrets)
- [truffleHog](https://github.com/trufflesecurity/trufflehog)
- [GitGuardian](https://www.gitguardian.com/)

---

**Last Updated**: 2025-11-07
**Version**: 1.0
**Owner**: Security Team
