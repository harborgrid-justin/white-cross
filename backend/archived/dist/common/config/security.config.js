"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('security', () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development';
    return {
        csrf: {
            enabled: isProduction,
            secret: process.env.CSRF_SECRET || null,
            cookieName: 'XSRF-TOKEN',
            headerName: 'X-CSRF-Token',
            tokenLifetimeMs: 24 * 60 * 60 * 1000,
        },
        encryption: {
            algorithm: process.env.ENCRYPTION_ALGORITHM ||
                'aes-256-gcm',
            keySize: parseInt(process.env.ENCRYPTION_KEY_SIZE || '32', 10),
            ivSize: parseInt(process.env.ENCRYPTION_IV_SIZE || '16', 10),
            configKey: process.env.CONFIG_ENCRYPTION_KEY || null,
        },
        rsa: {
            keySize: parseInt(process.env.RSA_KEY_SIZE || '4096', 10),
        },
        keyRotation: {
            enabled: process.env.KEY_ROTATION_ENABLED !== 'false',
            intervalDays: parseInt(process.env.KEY_ROTATION_INTERVAL_DAYS || '90', 10),
        },
        cors: {
            origin: process.env.CORS_ORIGIN ||
                (isDevelopment ? 'http://localhost:3000' : ''),
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: [
                'Content-Type',
                'Authorization',
                'X-Requested-With',
                'X-CSRF-Token',
                'X-Request-ID',
            ],
            exposedHeaders: ['X-Request-ID', 'X-CSRF-Token'],
            maxAge: 86400,
        },
        rateLimiting: {
            enabled: true,
            windowMs: 15 * 60 * 1000,
            maxRequests: 100,
            skipPaths: ['/api/health', '/api/docs'],
        },
        headers: {
            enableHSTS: isProduction,
            hstsMaxAge: 31536000,
            enableCSP: isProduction,
            cspDirectives: {
                'default-src': ["'self'"],
                'script-src': ["'self'", "'unsafe-inline'"],
                'style-src': ["'self'", "'unsafe-inline'"],
                'img-src': ["'self'", 'data:', 'https:'],
                'font-src': ["'self'", 'data:'],
                'connect-src': ["'self'"],
                'frame-ancestors': ["'none'"],
                'base-uri': ["'self'"],
                'form-action': ["'self'"],
            },
        },
    };
});
//# sourceMappingURL=security.config.js.map