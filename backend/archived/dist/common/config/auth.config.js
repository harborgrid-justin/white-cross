"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('auth', () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        jwt: {
            secret: process.env.JWT_SECRET,
            refreshSecret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || '15m',
            refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
            issuer: 'white-cross-healthcare',
            audience: 'white-cross-api',
            algorithm: 'HS256',
        },
        session: {
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: isProduction,
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'strict',
            },
        },
        passwordPolicy: {
            minLength: 12,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            maxAge: 90,
        },
        lockout: {
            enabled: true,
            maxAttempts: 5,
            lockoutDuration: 30,
        },
    };
});
//# sourceMappingURL=auth.config.js.map