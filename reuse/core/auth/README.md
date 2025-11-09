# Authentication & Authorization

Enterprise-grade authentication and authorization utilities for secure application access control.

## Overview

This module provides comprehensive authentication and authorization functionality including:

- **JWT Token Management** - Generation, validation, and lifecycle management
- **OAuth 2.0 Flows** - Complete OAuth 2.0 implementation with PKCE support
- **Role-Based Access Control (RBAC)** - Permission and role management
- **Session Management** - Secure session creation and validation
- **Multi-Factor Authentication (MFA)** - TOTP, backup codes, and MFA challenges
- **Password Management** - Hashing, validation, and policy enforcement
- **API Key Management** - Secure API key generation and validation

## Quick Start

```typescript
import {
  generateJWTToken,
  validateJWTToken,
  createSession,
  generateTOTPSetup
} from '@reuse/core/auth';

// Generate JWT token
const token = generateJWTToken({
  sub: 'user-123',
  email: 'user@example.com',
  role: 'admin'
}, {
  secret: process.env.JWT_SECRET,
  expiresIn: '15m'
});

// Validate token
const validation = validateJWTToken(token, {
  secret: process.env.JWT_SECRET
});

if (validation.valid) {
  console.log('Authenticated user:', validation.payload.sub);
}
```

## JWT Token Management

### Token Generation

```typescript
import { generateJWTToken } from '@reuse/core/auth/jwt';

const token = generateJWTToken({
  sub: 'user-123',
  email: 'doctor@hospital.com',
  role: 'doctor',
  permissions: ['read:patients', 'write:prescriptions']
}, {
  secret: process.env.JWT_SECRET,
  expiresIn: '15m',
  issuer: 'my-app',
  audience: 'my-app-users'
});
```

### Token Validation

```typescript
import { validateJWTToken } from '@reuse/core/auth/jwt';

const result = validateJWTToken(token, {
  secret: process.env.JWT_SECRET,
  issuer: 'my-app',
  audience: 'my-app-users'
});

if (result.valid) {
  // Token is valid
  const userId = result.payload.sub;
  const userRole = result.payload.role;
} else {
  // Token is invalid
  console.error('Validation error:', result.error);
}
```

### Token Refresh

```typescript
import { rotateRefreshToken } from '@reuse/core/auth';

const tokens = rotateRefreshToken(oldRefreshToken, refreshSecret, {
  secret: accessSecret,
  expiresIn: '15m'
});

if (tokens) {
  // Return new tokens to client
  res.json(tokens);
}
```

## OAuth 2.0 with PKCE

### Authorization Flow

```typescript
import { generateOAuth2AuthUrl } from '@reuse/core/auth/oauth';

const { authorizationUrl, state, codeVerifier } = generateOAuth2AuthUrl({
  clientId: 'client-123',
  redirectUri: 'https://app.example.com/callback',
  authorizationEndpoint: 'https://oauth.provider.com/authorize',
  tokenEndpoint: 'https://oauth.provider.com/token',
  scope: ['openid', 'profile', 'email'],
  usePKCE: true
});

// Store state and codeVerifier in session
// Redirect user to authorizationUrl
```

### Token Exchange

```typescript
import {
  buildOAuth2TokenExchangeBody,
  validateOAuth2State
} from '@reuse/core/auth/oauth';

// Validate state to prevent CSRF
if (!validateOAuth2State(receivedState, storedState)) {
  throw new Error('Invalid OAuth state');
}

// Build token exchange request
const body = buildOAuth2TokenExchangeBody(code, config, codeVerifier);

const response = await fetch(config.tokenEndpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(body)
});

const tokens = await response.json();
```

## Session Management

### Create Session

```typescript
import { createSession } from '@reuse/core/auth/session';

const session = createSession({
  userId: 'user-123',
  email: 'user@example.com',
  role: 'admin',
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  expiresIn: 86400000, // 24 hours
  slidingWindow: 1800000 // 30 minutes
});

// Store session in Redis or database
await sessionStore.set(session.sessionId, session);
```

### Validate Session

```typescript
import { validateSession, updateSessionActivity } from '@reuse/core/auth/session';

const session = await sessionStore.get(sessionId);

const result = validateSession(session, {
  checkExpiration: true,
  maxIdleTime: 1800000, // 30 minutes
  ipAddress: req.ip,
  strictIpCheck: true
});

if (!result.valid) {
  throw new UnauthorizedException(result.reason);
}

// Update session activity
const updated = updateSessionActivity(session, 1800000);
await sessionStore.set(session.sessionId, updated);
```

## Multi-Factor Authentication

### TOTP Setup

```typescript
import { generateTOTPSetup } from '@reuse/core/auth/mfa';

const setup = generateTOTPSetup('user@example.com', 'My App', 6);

// Display setup.qrCodeUrl to user (QR code)
// Store setup.secret in database (encrypted)
// Provide setup.backupCodes to user (one-time display)
```

### TOTP Verification

```typescript
import { verifyTOTPCode } from '@reuse/core/auth/mfa';

if (verifyTOTPCode(userProvidedCode, storedSecret, 1)) {
  // 2FA verification successful
  await completeLogin(user);
} else {
  throw new UnauthorizedException('Invalid 2FA code');
}
```

### Backup Codes

```typescript
import {
  generateBackupCodes,
  hashBackupCode,
  verifyBackupCode
} from '@reuse/core/auth/mfa';

// Generate backup codes
const codes = generateBackupCodes(10, 8);

// Store hashed versions
for (const code of codes) {
  const hash = hashBackupCode(code);
  await db.backupCodes.create({
    userId,
    codeHash: hash,
    used: false
  });
}

// Verify backup code
const storedCode = await db.backupCodes.findOne({ userId, used: false });
if (verifyBackupCode(userCode, storedCode.codeHash)) {
  await db.backupCodes.update({ codeHash: storedCode.codeHash }, { used: true });
  await completeLogin(user);
}
```

## Password Management

### Password Hashing

```typescript
import { hashPassword, verifyPassword } from '@reuse/core/auth';

// Hash password during registration
const hash = await hashPassword(userPassword, 12);
await db.users.create({ email, passwordHash: hash });

// Verify password during login
const user = await db.users.findOne({ email });
const isValid = await verifyPassword(providedPassword, user.passwordHash);

if (!isValid) {
  throw new UnauthorizedException('Invalid credentials');
}
```

### Password Policy Validation

```typescript
import { validatePasswordPolicy } from '@reuse/core/auth';

const result = validatePasswordPolicy(password, {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireDigits: true,
  requireSpecialChars: true,
  preventCommonPasswords: true
});

if (!result.valid) {
  return { errors: result.feedback };
}
```

### Secure Password Generation

```typescript
import { generateSecurePassword } from '@reuse/core/auth';

const password = generateSecurePassword(16, {
  requireUppercase: true,
  requireDigits: true,
  requireSpecialChars: true
});

// Send password to user via secure channel
```

## API Key Management

### Generate API Key

```typescript
import { generateApiKey } from '@reuse/core/auth';

const apiKeyData = generateApiKey({
  prefix: 'ak_live_',
  length: 32,
  expiresIn: 31536000000, // 1 year
  permissions: ['read:api', 'write:webhooks'],
  userId: 'user-123'
});

// Return apiKeyData.key to user (one time only)
// Store apiKeyData.hash in database
await db.apiKeys.create({
  userId: apiKeyData.userId,
  keyHash: apiKeyData.hash,
  permissions: apiKeyData.permissions,
  expiresAt: apiKeyData.expiresAt
});
```

### Validate API Key

```typescript
import { validateApiKey } from '@reuse/core/auth';

const result = validateApiKey(providedKey, storedKeyData);

if (!result.valid) {
  throw new UnauthorizedException(result.error);
}
```

## Available Functions

### JWT Functions
- `generateJWTToken()` - Generate JWT token with claims
- `validateJWTToken()` - Validate and verify JWT token
- `extractJWTPayload()` - Extract payload without validation
- `isJWTExpired()` - Check if token is expired
- `getJWTTimeToExpiry()` - Get seconds until expiration
- `isJWTExpiringWithin()` - Check if expires within window
- `getJWTInfo()` - Get comprehensive token information

### Refresh Token Functions
- `generateRefreshToken()` - Generate refresh token
- `validateRefreshToken()` - Validate refresh token
- `rotateRefreshToken()` - Rotate refresh token
- `hashRefreshToken()` - Hash for secure storage
- `verifyRefreshTokenHash()` - Verify token against hash

### Session Functions
- `createSession()` - Create new session
- `validateSession()` - Validate session with checks
- `updateSessionActivity()` - Update last activity
- `generateSessionId()` - Generate secure session ID
- `getSessionTimeRemaining()` - Get time until expiration
- `isSessionExpired()` - Check if session expired

### OAuth Functions
- `generateOAuth2AuthUrl()` - Generate authorization URL
- `validateOAuth2State()` - Validate state parameter
- `buildOAuth2TokenExchangeBody()` - Build token exchange request
- `generatePKCEVerifier()` - Generate PKCE verifier
- `generatePKCEChallenge()` - Generate PKCE challenge
- `validatePKCEVerifier()` - Validate verifier against challenge

### MFA Functions
- `generateTOTPSetup()` - Setup TOTP for user
- `generateTOTPCode()` - Generate current TOTP code
- `verifyTOTPCode()` - Verify user-provided code
- `generateBackupCodes()` - Generate backup recovery codes
- `hashBackupCode()` - Hash backup code
- `verifyBackupCode()` - Verify backup code
- `generateMFAChallenge()` - Generate MFA challenge token

### Password Functions
- `hashPassword()` - Hash password with bcrypt
- `verifyPassword()` - Verify password against hash
- `validatePasswordPolicy()` - Validate against policy
- `generateSecurePassword()` - Generate strong password
- `isPasswordPwned()` - Check against breach database

### API Key Functions
- `generateApiKey()` - Generate secure API key
- `validateApiKey()` - Validate API key
- `hasApiKeyPermission()` - Check key permissions
- `rotateApiKey()` - Rotate API key

### Security Functions
- `createBlacklistEntry()` - Create token blacklist entry
- `isTokenBlacklisted()` - Check if token blacklisted
- `generateSSOToken()` - Generate SSO token

## Type Definitions

```typescript
import type {
  JWTPayload,
  JWTConfig,
  TokenPair,
  TokenValidationResult,
  SessionConfig,
  SessionData,
  OAuth2Config,
  TOTPConfig,
  PasswordPolicy,
  ApiKeyConfig
} from '@reuse/core/auth';
```

## Best Practices

1. **Always use HTTPS** for token transmission
2. **Store secrets securely** (use environment variables)
3. **Implement token rotation** for refresh tokens
4. **Use short-lived access tokens** (15 minutes recommended)
5. **Implement token blacklisting** for logout
6. **Use PKCE** for OAuth 2.0 flows
7. **Enable MFA** for sensitive operations
8. **Validate all tokens** on every request
9. **Log authentication events** for auditing
10. **Use timing-safe comparisons** for security

## Security Considerations

- All JWT tokens include `jti` (JWT ID) for revocation support
- Timing-safe comparison prevents timing attacks
- PKCE implementation prevents authorization code interception
- Session validation includes IP address checking option
- Password hashing uses industry-standard bcrypt/argon2
- API keys are hashed before storage

---

[← Back to Core README](../README.md)
