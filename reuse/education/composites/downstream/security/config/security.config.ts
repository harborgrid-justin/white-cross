/**
 * Security Configuration
 * Central configuration for all security settings
 */

export const SecurityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'development-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRATION || '1h',
    refreshExpiresIn: '7d',
    issuer: 'white-cross-platform',
    audience: 'white-cross-api',
  },

  // Password Policy
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    saltRounds: 12,
  },

  // Account Lockout
  lockout: {
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 30,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
  },

  // Auth-specific Rate Limits
  authRateLimit: {
    login: {
      windowMs: 60 * 1000, // 1 minute
      max: 5, // 5 login attempts per minute
    },
    register: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 registrations per hour
    },
  },

  // CORS Configuration
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page'],
    maxAge: 3600,
  },

  // Helmet (Security Headers) Configuration
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: true,
  },

  // Encryption
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32, // 256 bits
  },

  // Session Configuration
  session: {
    timeout: 30 * 60 * 1000, // 30 minutes
    extendOnActivity: true,
  },

  // Audit Configuration
  audit: {
    logAllRequests: true,
    logSecurityEvents: true,
    retentionDays: 90,
  },
};

export default SecurityConfig;
