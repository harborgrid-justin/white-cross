# Security Implementation Guide

## Overview

This document describes the implementation of critical security features for the White Cross healthcare platform backend.

## Features Implemented

### 1. OAuth2 Authentication (GAP-AUTH-001)
- **Endpoints**:
  - `POST /auth/oauth/google` - Google OAuth login
  - `POST /auth/oauth/microsoft` - Microsoft OAuth login
- **Providers**: Google, Microsoft
- **Auto-registration**: Creates new users automatically with OAuth profile
- **Strategy**: Passport.js with Google OAuth 2.0 and Microsoft OAuth

### 2. Multi-Factor Authentication (GAP-AUTH-002)
- **Endpoints**:
  - `POST /auth/mfa/setup` - Generate QR code and backup codes
  - `POST /auth/mfa/verify` - Verify TOTP code or backup code
  - `POST /auth/mfa/disable` - Disable MFA with password verification
  - `GET /auth/mfa/status` - Check MFA status
  - `POST /auth/mfa/regenerate-backup-codes` - Generate new backup codes
- **Implementation**: TOTP (Time-based One-Time Password)
- **Backup Codes**: 10 single-use backup codes for recovery
- **QR Code**: Generated for authenticator app setup

### 3. Password Reset Flow (GAP-AUTH-003)
- **Endpoints**:
  - `POST /auth/forgot-password` - Request password reset email
  - `POST /auth/reset-password` - Reset password with token
  - `GET /auth/verify-reset-token` - Verify token validity
- **Security**:
  - Tokens expire after 1 hour
  - Rate limited (3 attempts per minute)
  - Secure random token generation

### 4. Email Verification (GAP-AUTH-004)
- **Endpoints**:
  - `POST /auth/verify-email` - Verify email with token
  - `POST /auth/resend-verification` - Resend verification email
- **Security**:
  - Tokens expire after 24 hours
  - Rate limited (3 attempts per 5 minutes)

### 5. Token Refresh Path Alias (GAP-AUTH-005)
- **Endpoint**: `POST /auth/refresh-token` (alias for `/auth/refresh`)
- **Purpose**: Frontend compatibility

## Required Dependencies

Install the following npm packages in the backend:

```bash
cd backend
npm install speakeasy qrcode passport-google-oauth20 passport-microsoft @types/speakeasy @types/qrcode @types/passport-google-oauth20 @types/passport-microsoft
```

### Dependency Details:
- **speakeasy**: TOTP generation and verification for MFA
- **qrcode**: QR code generation for MFA setup
- **passport-google-oauth20**: Google OAuth 2.0 strategy
- **passport-microsoft**: Microsoft OAuth strategy

## Environment Variables

Add the following to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-strong-random-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars

# OAuth Configuration (Optional - for OAuth features)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/oauth/google/callback

MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_CALLBACK_URL=http://localhost:3001/api/auth/oauth/microsoft/callback

# Application URL (for email links)
APP_URL=http://localhost:3000
```

## Database Migration

Run the migration to add new fields to the users table:

```bash
cd backend
npm run migration:run
```

This adds the following fields:
- `mfaEnabled` - MFA enabled flag
- `mfaSecret` - TOTP secret (encrypted)
- `mfaBackupCodes` - JSON array of backup codes
- `mfaEnabledAt` - MFA enable timestamp
- `oauthProvider` - OAuth provider name
- `oauthProviderId` - OAuth user ID
- `profilePictureUrl` - Profile picture URL
- `isEmailVerified` - Email verification flag
- `emailVerifiedAt` - Email verification timestamp

## Files Created

### DTOs
- `/backend/src/auth/dto/oauth.dto.ts` - OAuth DTOs
- `/backend/src/auth/dto/mfa.dto.ts` - MFA DTOs
- `/backend/src/auth/dto/password-reset.dto.ts` - Password reset DTOs
- `/backend/src/auth/dto/email-verification.dto.ts` - Email verification DTOs

### Services
- `/backend/src/auth/services/mfa.service.ts` - MFA service with TOTP
- `/backend/src/auth/services/oauth.service.ts` - OAuth service
- `/backend/src/auth/services/password-reset.service.ts` - Password reset service
- `/backend/src/auth/services/email-verification.service.ts` - Email verification service

### Strategies
- `/backend/src/auth/strategies/google.strategy.ts` - Google OAuth strategy
- `/backend/src/auth/strategies/microsoft.strategy.ts` - Microsoft OAuth strategy

### Migrations
- `/backend/src/database/migrations/20250104-add-mfa-oauth-fields-to-users.ts` - Database migration

## Files Modified

- `/backend/src/auth/auth.controller.ts` - Added all new endpoints
- `/backend/src/auth/auth.module.ts` - Registered new services and strategies
- `/backend/src/auth/dto/index.ts` - Exported new DTOs
- `/backend/src/database/models/user.model.ts` - Added new fields

## Testing

### Test MFA Flow:
1. Login with user credentials
2. Call `POST /auth/mfa/setup` to get QR code
3. Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
4. Call `POST /auth/mfa/verify` with 6-digit code
5. Call `POST /auth/mfa/disable` to disable (requires password)

### Test OAuth Flow:
1. Configure OAuth credentials in `.env`
2. Call `POST /auth/oauth/google` with Google ID token
3. User is created/logged in automatically

### Test Password Reset:
1. Call `POST /auth/forgot-password` with email
2. Check logs for reset token (in production, check email)
3. Call `POST /auth/reset-password` with token and new password

### Test Email Verification:
1. Register new user
2. Call `POST /auth/resend-verification` to send verification email
3. Check logs for verification token
4. Call `POST /auth/verify-email` with token

## Security Considerations

### Production Checklist:
- [ ] Use strong JWT secrets (minimum 32 characters)
- [ ] Configure OAuth providers with production credentials
- [ ] Integrate real email service (SendGrid, AWS SES, etc.)
- [ ] Store MFA secrets encrypted at rest
- [ ] Use Redis for password reset tokens (instead of in-memory)
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable rate limiting on all endpoints
- [ ] Monitor failed authentication attempts
- [ ] Set up audit logging for security events

### HIPAA Compliance:
- All PHI access is logged via audit interceptors
- MFA enforced for administrative accounts
- Password reset tokens expire quickly
- Session tokens have short lifetimes
- Email verification prevents fake accounts

## API Documentation

All endpoints are documented with Swagger/OpenAPI. Access the documentation at:
```
http://localhost:3001/api/docs
```

## Frontend Integration

The frontend at `/frontend/src/services/modules/authApi.ts` is already configured to use these endpoints. No changes required on the frontend.

### Expected Frontend Calls:
- `authApi.loginWithGoogle()` → `POST /auth/oauth/google`
- `authApi.loginWithMicrosoft()` → `POST /auth/oauth/microsoft`
- `authApi.setupMFA()` → `POST /auth/mfa/setup`
- `authApi.verifyMFA()` → `POST /auth/mfa/verify`
- `authApi.disableMFA()` → `POST /auth/mfa/disable`
- `authApi.getMFAStatus()` → `GET /auth/mfa/status`
- `authApi.forgotPassword()` → `POST /auth/forgot-password`
- `authApi.resetPassword()` → `POST /auth/reset-password`
- `authApi.verifyEmail()` → `POST /auth/verify-email`
- `authApi.resendVerification()` → `POST /auth/resend-verification`
- `authApi.refreshToken()` → `POST /auth/refresh-token` (alias)

## Support

For issues or questions, contact the development team.

## Changelog

### 2025-01-04 - Initial Implementation
- Implemented OAuth2 (Google & Microsoft)
- Implemented MFA with TOTP
- Implemented password reset flow
- Implemented email verification
- Added refresh-token alias for frontend compatibility
- Created database migration for new user fields
- Updated User model with MFA, OAuth, and email verification fields
