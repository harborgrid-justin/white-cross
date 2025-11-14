"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
exports.createAuthenticationService = createAuthenticationService;
const jsonwebtoken = __importStar(require("jsonwebtoken"));
const logger_1 = require("../logging/logger");
class AuthenticationService extends BaseService {
    config;
    constructor(config) {
        super("AuthenticationService");
        this.config = config;
    }
    extractToken(authHeader) {
        if (!authHeader) {
            return null;
        }
        const match = authHeader.match(/^(?:Bearer\s+)?(.+)$/i);
        return match && match[1] ? match[1].trim() : null;
    }
    async generateToken(user) {
        try {
            const payload = {
                userId: user.userId,
                email: user.email,
                role: user.role,
            };
            const options = {
                expiresIn: this.config.maxAgeSec,
                audience: this.config.jwtAudience,
                issuer: this.config.jwtIssuer,
            };
            return jsonwebtoken.sign(payload, this.config.jwtSecret, options);
        }
        catch (error) {
            logger_1.logger.error('Error generating JWT token:', error);
            throw new Error('Failed to generate authentication token');
        }
    }
    async verifyToken(token) {
        try {
            const options = {
                audience: this.config.jwtAudience,
                issuer: this.config.jwtIssuer,
                clockTolerance: this.config.timeSkewSec || 30,
            };
            const decoded = jsonwebtoken.verify(token, this.config.jwtSecret, options);
            return decoded;
        }
        catch (error) {
            if (error instanceof jsonwebtoken.TokenExpiredError) {
                throw new Error('Authentication token has expired');
            }
            else if (error instanceof jsonwebtoken.JsonWebTokenError) {
                throw new Error('Invalid authentication token');
            }
            else {
                logger_1.logger.error('JWT verification error:', error);
                throw new Error('Token verification failed');
            }
        }
    }
    async validateUser(decoded) {
        try {
            const user = await this.config.userLoader(decoded.userId);
            if (!user) {
                logger_1.logger.warn('JWT validation failed: User not found', {
                    userId: decoded.userId,
                    email: decoded.email,
                });
                throw new Error('User not found');
            }
            if (!user.isActive) {
                logger_1.logger.warn('JWT validation failed: User inactive', {
                    userId: decoded.userId,
                    email: decoded.email,
                });
                throw new Error('User account is inactive');
            }
            if (decoded.email !== user.email || decoded.role !== user.role) {
                logger_1.logger.warn('JWT validation failed: Token claims mismatch', {
                    userId: decoded.userId,
                    tokenEmail: decoded.email,
                    userEmail: user.email,
                    tokenRole: decoded.role,
                    userRole: user.role,
                });
                throw new Error('Token claims do not match user data');
            }
            logger_1.logger.debug('JWT validation successful', {
                userId: user.userId,
                email: user.email,
                role: user.role,
            });
            return user;
        }
        catch (error) {
            logger_1.logger.error('User validation error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId: decoded.userId,
            });
            throw error;
        }
    }
    async authenticate(authHeader) {
        try {
            const token = this.extractToken(authHeader);
            if (!token) {
                return {
                    success: false,
                    error: 'No authentication token provided',
                };
            }
            const decoded = await this.verifyToken(token);
            const user = await this.validateUser(decoded);
            return {
                success: true,
                user,
                token,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Authentication failed',
            };
        }
    }
    async refreshToken(user) {
        try {
            return await this.generateToken(user);
        }
        catch (error) {
            logger_1.logger.error('Error refreshing JWT token:', error);
            return this.handleError('Operation failed', new Error('Failed to refresh authentication token'));
        }
    }
}
exports.AuthenticationService = AuthenticationService;
function createAuthenticationService(config) {
    return new AuthenticationService(config);
}
exports.default = {
    AuthenticationService,
    createAuthenticationService,
};
//# sourceMappingURL=authentication.service.js.map