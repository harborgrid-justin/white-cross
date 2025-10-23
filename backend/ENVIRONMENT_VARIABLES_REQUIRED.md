# Required Environment Variables - White Cross Healthcare Platform
**Security Fixes Implementation**

**CRITICAL:** The application will NOT start without these environment variables properly configured.

---

## CRITICAL Environment Variables (Application Fails Without These)

### 1. Encryption Configuration (CRIT-001 Fix)

```bash
# Encryption secret for credential storage (min 32 characters)
ENCRYPTION_SECRET=your-cryptographically-random-secret-here-min-32-chars

# Encryption salt for key derivation (min 16 characters)
ENCRYPTION_SALT=your-cryptographically-random-salt-here-min-16-chars
```

**Why Required:**
- Fixed CRIT-001: Removed hardcoded default encryption secrets
- Application throws error on startup if not set
- All encrypted credentials in database require these secrets
- **IMPORTANT:** After setting these for the first time, you must rotate all encrypted credentials in the database

**How to Generate:**
```bash
# Generate ENCRYPTION_SECRET (32 chars base64)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate ENCRYPTION_SALT (16 chars base64)
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

---

### 2. JWT Authentication Configuration (HIGH-007 Fix)

```bash
# JWT secret for access token signing (min 32 characters)
JWT_SECRET=your-jwt-secret-min-32-chars-different-from-encryption-secret

# JWT refresh token secret (min 32 characters, must be different from JWT_SECRET)
JWT_REFRESH_SECRET=your-jwt-refresh-secret-min-32-chars-unique
```

**Why Required:**
- Fixed HIGH-007: Implemented JWT session timeout and refresh tokens
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Secrets must be different from each other and from encryption secrets

**How to Generate:**
```bash
# Generate JWT_SECRET (32 chars hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET (32 chars hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Optional Environment Variables

### OAuth Configuration (MED-007 Recommendation)

```bash
# Allowed domains for OAuth auto-provisioning (comma-separated)
ALLOWED_OAUTH_DOMAINS=schooldistrict.edu,example.org,trusted-partner.com

# Google OAuth credentials (if using Google SSO)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft OAuth credentials (if using Microsoft SSO)
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# Backend URL for OAuth callbacks
BACKEND_URL=https://api.yourapp.com
```

---

### Virus Scanning Configuration (HIGH-005 Integration)

```bash
# ClamAV configuration (when virus scanning is integrated)
CLAMAV_HOST=localhost
CLAMAV_PORT=3310

# VirusTotal API (alternative to ClamAV)
VIRUSTOTAL_API_KEY=your-virustotal-api-key
```

---

### Redis Configuration (Rate Limiting Production)

```bash
# Redis for distributed rate limiting
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0
```

---

### Application Configuration

```bash
# Node environment (development, staging, production)
NODE_ENV=production

# Server port
PORT=3000

# Database connection
DATABASE_URL=postgresql://user:password@localhost:5432/whitecross

# Log level (error, warn, info, debug)
LOG_LEVEL=info
```

---

## Example .env File

```bash
# ==================================================
# WHITE CROSS HEALTHCARE PLATFORM
# Environment Variables Configuration
# ==================================================

# ------------------------------
# CRITICAL - Application fails without these
# ------------------------------

# Encryption Configuration (CRIT-001 Fix)
ENCRYPTION_SECRET=K8jX9mPqR5sL2nV7wY4tZ1uC6bH3dG0fA5eI9oU2yT7rE8wQ1
ENCRYPTION_SALT=aB3dE6fG9hJ2kL5m

# JWT Authentication (HIGH-007 Fix)
JWT_SECRET=a7f3e9c2b8d4f1a6e5c9b2d8f3a7e1c4b6d9f2a5e8c1b4d7f0a3e6c9b2d5f8a1
JWT_REFRESH_SECRET=8f3a2c9b1e5d7f4a0c6e9b2d5f8a1c4e3b7a9c2e5f1d8b4a7c0e6f9b3d2a5c8

# ------------------------------
# Application Configuration
# ------------------------------

NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://whitecross_user:secure_password@db.example.com:5432/whitecross_prod

# Backend URL
BACKEND_URL=https://api.whitecross.healthcare

# ------------------------------
# OAuth Configuration (Optional)
# ------------------------------

# Domain whitelist for auto-provisioning
ALLOWED_OAUTH_DOMAINS=schooldistrict.edu,example.org

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# ------------------------------
# Security Services (Optional)
# ------------------------------

# ClamAV Virus Scanning
CLAMAV_HOST=localhost
CLAMAV_PORT=3310

# Redis for Rate Limiting
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0
```

---

## Deployment Checklist

### Before First Deployment:

1. **Generate Secrets:**
   ```bash
   # Run these commands and save outputs
   echo "ENCRYPTION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"
   echo "ENCRYPTION_SALT=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")"
   echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
   echo "JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
   ```

2. **Set Environment Variables:**
   - In production: Use secure secret management (AWS Secrets Manager, Azure Key Vault, etc.)
   - In development: Use `.env` file (never commit to git!)

3. **Test Startup:**
   ```bash
   # Application should start successfully
   npm start

   # Application should fail if any CRITICAL env var is missing
   unset ENCRYPTION_SECRET && npm start  # Should fail with clear error message
   ```

4. **Verify Security:**
   - Check logs for "ENCRYPTION_SECRET and ENCRYPTION_SALT must be set" - should NOT appear
   - Verify access tokens expire in 15 minutes
   - Test refresh token flow

---

### After Deployment:

1. **Rotate Existing Credentials:**
   - All previously encrypted credentials in database are encrypted with old (compromised) secrets
   - Must re-encrypt with new secrets or rotate credentials

2. **Monitor:**
   - Check application logs for security warnings
   - Monitor rate limiting statistics
   - Review failed login attempts

3. **Security Audit:**
   - Verify no secrets in application logs
   - Confirm JWT tokens expire correctly
   - Test rate limiting functionality

---

## Security Notes

### Secret Storage:

**❌ NEVER:**
- Commit secrets to Git
- Store secrets in code
- Share secrets via email/chat
- Use weak or predictable secrets
- Reuse secrets across environments

**✅ ALWAYS:**
- Use cryptographically random secrets
- Store secrets in secure secret management systems
- Rotate secrets periodically
- Use different secrets per environment
- Document secret rotation procedures

### Secret Rotation:

1. Generate new secrets
2. Deploy application with both old and new secrets
3. Migrate/re-encrypt data
4. Remove old secrets from configuration
5. Update documentation

### Environment-Specific Secrets:

```
Development:   Use unique secrets (not production secrets!)
Staging:       Use unique secrets (not production secrets!)
Production:    Use production-only secrets
Testing:       Use test-only secrets (can be fixed values)
```

---

## Troubleshooting

### Application Won't Start:

**Error:** `"Encryption configuration missing - ENCRYPTION_SECRET and ENCRYPTION_SALT are required"`

**Solution:**
```bash
# Set the required environment variables
export ENCRYPTION_SECRET="your-secret-here"
export ENCRYPTION_SALT="your-salt-here"
```

**Error:** `"JWT_SECRET environment variable not set"`

**Solution:**
```bash
export JWT_SECRET="your-jwt-secret-here"
export JWT_REFRESH_SECRET="your-jwt-refresh-secret-here"
```

### Existing Encrypted Data Won't Decrypt:

**Cause:** Environment variables changed, but existing encrypted data uses old secrets

**Solution:**
1. Restore old secrets temporarily
2. Decrypt all encrypted credentials
3. Set new secrets
4. Re-encrypt all credentials
5. Remove old secrets

---

## Key Management Best Practices

### For Production:

1. **Use Key Management Service:**
   - AWS Secrets Manager / KMS
   - Azure Key Vault
   - HashiCorp Vault
   - Google Secret Manager

2. **Implement Key Rotation:**
   - Rotate secrets every 90 days
   - Automate rotation process
   - Keep audit trail of rotations

3. **Access Control:**
   - Limit who can view secrets
   - Require MFA for secret access
   - Log all secret access

4. **Monitoring:**
   - Alert on secret access
   - Monitor for secret exposure
   - Scan code repositories for leaked secrets

---

## Additional Resources

- Security Review Report: `backend/src/services/BACKEND_SECURITY_REVIEW_REPORT.md`
- Security Fixes Summary: `backend/src/services/SECURITY_FIXES_IMPLEMENTED.md`
- Password Strength Guidelines: NIST SP 800-63B
- Key Management: NIST SP 800-57

---

**Last Updated:** October 23, 2025
**Version:** 1.0 (Security Fixes Implementation)
