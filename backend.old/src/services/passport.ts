/**
 * @fileoverview Passport.js Authentication Strategy Configuration
 * @module services/passport
 * @description Centralized configuration for Passport.js authentication strategies including
 * local (email/password), JWT token-based, Google OAuth, and Microsoft OAuth authentication.
 * Provides secure user authentication with password validation, token verification, and
 * OAuth provider integration for healthcare platform.
 *
 * Key Features:
 * - Local strategy with email/password authentication
 * - JWT strategy for token-based API authentication
 * - Google OAuth 2.0 integration for SSO
 * - Microsoft OAuth integration for enterprise SSO
 * - Automatic user provisioning for OAuth users
 * - Secure password comparison with bcrypt
 * - User serialization/deserialization for sessions
 * - Active user validation on all strategies
 *
 * Configured Strategies:
 * 1. Local Strategy - Email and password authentication with bcrypt validation
 * 2. JWT Strategy - Bearer token authentication for API requests
 * 3. Google OAuth - Single Sign-On with Google accounts
 * 4. Microsoft OAuth - Single Sign-On with Microsoft accounts
 *
 * @security Critical authentication configuration - handles user login flows
 * @compliance HIPAA - Secure authentication and access control
 *
 * @requires passport - Passport.js authentication middleware
 * @requires passport-local - Local authentication strategy
 * @requires passport-jwt - JWT authentication strategy
 * @requires passport-google-oauth20 - Google OAuth strategy
 * @requires passport-microsoft - Microsoft OAuth strategy
 * @requires ../database/models - Database models (User)
 * @requires ../database/types/enums - Type definitions (UserRole)
 * @requires ../constants - Application constants
 * @requires bcryptjs - Password hashing library
 *
 * LOC: 0957A4833F
 * WC-GEN-289 | passport.ts - Passport Authentication Configuration
 *
 * UPSTREAM (imports from):
 *   - index.ts (database/models/index.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - index.ts (constants/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - server.ts (main server initialization)
 *   - routes/auth.ts (authentication routes)
 */

/**
 * WC-GEN-289 | passport.ts - Passport Authentication Configuration
 * Purpose: Configure Passport.js authentication strategies for multi-provider auth
 * Upstream: ../database/models, ../database/types/enums, ../constants | Dependencies: passport, passport-local, passport-jwt
 * Downstream: Auth routes, protected routes | Called by: Application bootstrap
 * Related: jwt.middleware.ts, authentication.service.ts
 * Exports: Configured passport instance | Key Services: Local, JWT, Google OAuth, Microsoft OAuth
 * Last Updated: 2025-10-22 | File Type: .ts
 * Critical Path: Strategy configuration → User authentication → Session management
 * LLM Context: Multi-provider authentication, OAuth integration, session management
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { User } from '../database/models';
import { UserRole } from '../database/types/enums';
import bcrypt from 'bcryptjs';
import { ENVIRONMENT, TOKEN_CONFIG, USER_ROLES } from '../constants';
import { generateSecurePassword } from '../utils/securityUtils';

/**
 * JWT Strategy Configuration Options
 *
 * @constant {Object} jwtOptions
 * @property {Function} jwtFromRequest - JWT extraction method (from Authorization Bearer header)
 * @property {string} secretOrKey - Secret key for JWT signature verification
 *
 * @description Configures how JWT tokens are extracted from requests and verified.
 * Tokens must be provided in Authorization header as "Bearer <token>".
 *
 * @example
 * // Client request header
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ENVIRONMENT.JWT_SECRET || TOKEN_CONFIG.JWT_SECRET,
};

/**
 * Local Strategy - Email/Password Authentication
 *
 * @strategy LocalStrategy
 * @description Authenticates users with email and password. Validates credentials
 * against database, checks user active status, and uses bcrypt for secure password
 * comparison. Returns sanitized user object without sensitive data on success.
 *
 * @param {string} email - User email address (usernameField)
 * @param {string} passwordInput - User password (passwordField)
 * @param {Function} done - Passport done callback
 *
 * @returns {void} Calls done(error, user, info) callback
 * @callback done
 * @param {Error|null} error - Error object if authentication fails
 * @param {Object|false} user - User object if successful, false if failed
 * @param {Object} [info] - Additional info message for failure
 *
 * @security Uses bcrypt password comparison to prevent timing attacks
 * @security Returns user.toSafeObject() to exclude sensitive fields
 *
 * @example
 * // Usage in login route
 * app.post('/login', passport.authenticate('local'), (req, res) => {
 *   res.json({ user: req.user, token: generateToken(req.user) });
 * });
 *
 * @example
 * // Login request
 * POST /api/auth/login
 * {
 *   "email": "nurse@school.edu",
 *   "password": "SecurePassword123!"
 * }
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, passwordInput, done) => {
      try {
        const user = await User.findOne({
          where: { email },
        });

        if (!user || !user.isActive) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isValidPassword = await user.comparePassword(passwordInput);

        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Return user without sensitive data
        return done(null, user.toSafeObject());
      } catch (error) {
        return done(error);
      }
    }
  )
);

/**
 * JWT Strategy - Token-Based Authentication
 *
 * @strategy JwtStrategy
 * @description Authenticates users using JWT tokens from Authorization Bearer header.
 * Validates token signature, extracts user ID from payload, loads user from database,
 * and verifies user is still active. Used for API authentication.
 *
 * @param {Object} payload - Decoded JWT payload
 * @param {string} payload.id - User ID from token
 * @param {string} payload.email - User email from token
 * @param {string} payload.role - User role from token
 * @param {Function} done - Passport done callback
 *
 * @returns {void} Calls done(error, user) callback
 * @callback done
 * @param {Error|null} error - Error object if authentication fails
 * @param {Object|false} user - User object if successful, false if token invalid/expired
 *
 * @security Verifies JWT signature using secret key
 * @security Validates user still exists and is active
 * @security Returns user.toSafeObject() to exclude sensitive fields
 *
 * @throws {JsonWebTokenError} When token signature is invalid
 * @throws {TokenExpiredError} When token has expired
 *
 * @example
 * // Usage in protected route
 * app.get('/api/protected',
 *   passport.authenticate('jwt', { session: false }),
 *   (req, res) => {
 *     res.json({ data: 'Protected resource', user: req.user });
 *   }
 * );
 *
 * @example
 * // API request with JWT token
 * GET /api/students
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * @example
 * // Hapi route with JWT authentication
 * {
 *   method: 'GET',
 *   path: '/api/students',
 *   options: {
 *     auth: 'jwt'
 *   },
 *   handler: async (request, h) => {
 *     return { user: request.auth.credentials };
 *   }
 * }
 */
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id);

      if (user && user.isActive) {
        return done(null, user.toSafeObject());
      }

      return done(null, false);
    } catch (error) {
      return done(error);
    }
  })
);

/**
 * Google OAuth Strategy - Single Sign-On with Google
 *
 * @strategy GoogleStrategy
 * @description Authenticates users via Google OAuth 2.0. Automatically provisions new users
 * if they don't exist in database. Useful for enterprise SSO and simplified login.
 * Only configured if Google OAuth credentials are provided in environment variables.
 *
 * @param {string} accessToken - Google OAuth access token
 * @param {string} refreshToken - Google OAuth refresh token
 * @param {GoogleProfile} profile - Google user profile
 * @param {VerifyCallback} done - Passport done callback
 *
 * @returns {void} Calls done(error, user) callback
 *
 * @security Automatic user provisioning with random secure password
 * @security New users default to NURSE role (can be customized)
 * @security Email from Google profile used as unique identifier
 *
 * @example
 * // Initiate Google OAuth flow
 * GET /api/auth/google
 *
 * @example
 * // Google callback route
 * app.get('/api/auth/google/callback',
 *   passport.authenticate('google', { failureRedirect: '/login' }),
 *   (req, res) => {
 *     res.redirect('/dashboard');
 *   }
 * );
 *
 * @example
 * // Configuration requirements
 * GOOGLE_CLIENT_ID=your-client-id
 * GOOGLE_CLIENT_SECRET=your-client-secret
 * BACKEND_URL=https://api.yourapp.com
 */
if (ENVIRONMENT.GOOGLE_CLIENT_ID && ENVIRONMENT.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: ENVIRONMENT.GOOGLE_CLIENT_ID,
        clientSecret: ENVIRONMENT.GOOGLE_CLIENT_SECRET,
        callbackURL: `${ENVIRONMENT.BACKEND_URL}/api/auth/google/callback`,
      },
      async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback) => {
        try {
          let user = await User.findOne({
            where: { email: profile.emails?.[0]?.value || '' },
          });

          if (!user) {
            // Create new user from Google profile
            // SECURITY FIX: Use cryptographically secure password generation
            user = await User.create({
              email: profile.emails?.[0]?.value || '',
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              password: generateSecurePassword(64), // Cryptographically secure random password for OAuth users
              role: UserRole.NURSE, // Default role
              isActive: true,
            });
          }

          return done(null, user.toSafeObject());
        } catch (error) {
          return done(error as Error | null);
        }
      }
    )
  );
}

/**
 * Microsoft OAuth Strategy - Single Sign-On with Microsoft
 *
 * @strategy MicrosoftStrategy
 * @description Authenticates users via Microsoft OAuth (Azure AD). Automatically provisions
 * new users if they don't exist in database. Ideal for enterprise/school districts using
 * Microsoft 365 or Azure AD. Only configured if Microsoft OAuth credentials are provided.
 *
 * @param {string} accessToken - Microsoft OAuth access token
 * @param {string} refreshToken - Microsoft OAuth refresh token
 * @param {GoogleProfile} profile - Microsoft user profile
 * @param {VerifyCallback} done - Passport done callback
 *
 * @returns {void} Calls done(error, user) callback
 *
 * @security Automatic user provisioning with random secure password
 * @security New users default to NURSE role (can be customized)
 * @security Email from Microsoft profile used as unique identifier
 * @security Requires 'user.read' scope for profile access
 *
 * @example
 * // Initiate Microsoft OAuth flow
 * GET /api/auth/microsoft
 *
 * @example
 * // Microsoft callback route
 * app.get('/api/auth/microsoft/callback',
 *   passport.authenticate('microsoft', { failureRedirect: '/login' }),
 *   (req, res) => {
 *     res.redirect('/dashboard');
 *   }
 * );
 *
 * @example
 * // Configuration requirements
 * MICROSOFT_CLIENT_ID=your-client-id
 * MICROSOFT_CLIENT_SECRET=your-client-secret
 * BACKEND_URL=https://api.yourapp.com
 */
if (ENVIRONMENT.MICROSOFT_CLIENT_ID && ENVIRONMENT.MICROSOFT_CLIENT_SECRET) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: ENVIRONMENT.MICROSOFT_CLIENT_ID,
        clientSecret: ENVIRONMENT.MICROSOFT_CLIENT_SECRET,
        callbackURL: `${ENVIRONMENT.BACKEND_URL}/api/auth/microsoft/callback`,
        scope: ['user.read'],
      },
      async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback) => {
        try {
          let user = await User.findOne({
            where: { email: profile.emails?.[0]?.value || '' },
          });

          if (!user) {
            // Create new user from Microsoft profile
            // SECURITY FIX: Use cryptographically secure password generation
            user = await User.create({
              email: profile.emails?.[0]?.value || '',
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              password: generateSecurePassword(64), // Cryptographically secure random password for OAuth users
              role: UserRole.NURSE, // Default role
              isActive: true,
            });
          }

          return done(null, user.toSafeObject());
        } catch (error) {
          return done(error as Error | null);
        }
      }
    )
  );
}

/**
 * Serialize user for session storage
 *
 * @function serializeUser
 * @description Converts user object to session identifier (user ID only).
 * Called during login to determine what data should be stored in session.
 * Only stores minimal data (user ID) to keep session size small.
 *
 * @param {Object} user - User object from successful authentication
 * @param {string} user.id - User ID to store in session
 * @param {Function} done - Callback function
 *
 * @returns {void} Calls done(error, id) callback
 *
 * @example
 * // Passport internally calls this after successful login
 * // Stores only user.id in session: { passport: { user: '12345' } }
 */
passport.serializeUser((user, done) => {
  done(null, (user as { id: string }).id);
});

/**
 * Deserialize user from session storage
 *
 * @function deserializeUser
 * @async
 * @description Retrieves full user object from user ID stored in session.
 * Called on every authenticated request to populate req.user with user data.
 * Validates user still exists and is active before returning.
 *
 * @param {string} id - User ID from session
 * @param {Function} done - Callback function
 *
 * @returns {void} Calls done(error, user) callback
 * @callback done
 * @param {Error|null} error - Error object if deserialization fails
 * @param {Object|false} user - User object if successful, false if user not found/inactive
 *
 * @security Validates user is still active before allowing access
 * @security Returns user.toSafeObject() to exclude sensitive fields
 *
 * @example
 * // Passport internally calls this on every authenticated request
 * // Populates request.user with full user object from database
 *
 * @example
 * // Usage in route handler
 * app.get('/profile', (req, res) => {
 *   // req.user is populated by deserializeUser
 *   res.json({ user: req.user });
 * });
 */
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);

    if (user && user.isActive) {
      return done(null, user.toSafeObject());
    }

    return done(null, false);
  } catch (error) {
    return done(error);
  }
});

/**
 * Configured Passport instance with all authentication strategies
 *
 * @exports passport
 * @type {PassportStatic}
 *
 * @description Pre-configured Passport.js instance with all authentication strategies:
 * - Local (email/password)
 * - JWT (token-based API auth)
 * - Google OAuth (conditional - requires env vars)
 * - Microsoft OAuth (conditional - requires env vars)
 *
 * @example
 * // Import in Express app
 * import passport from './services/passport';
 * app.use(passport.initialize());
 * app.use(passport.session());
 *
 * @example
 * // Use in route
 * app.post('/login',
 *   passport.authenticate('local'),
 *   (req, res) => {
 *     res.json({ user: req.user });
 *   }
 * );
 *
 * @example
 * // Protect API route with JWT
 * app.get('/api/data',
 *   passport.authenticate('jwt', { session: false }),
 *   (req, res) => {
 *     res.json({ data: 'protected' });
 *   }
 * );
 */
export default passport;
