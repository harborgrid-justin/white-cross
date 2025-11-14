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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicRouteGuard = exports.Public = exports.CrossTenantAccessGuard = exports.TenantIsolationGuard = exports.MedicalStaffGuard = exports.HIPAAComplianceGuard = exports.InternalNetworkGuard = exports.SessionGuard = exports.OpenIDConnectGuard = exports.OAuth2Guard = exports.FlexibleAuthGuard = exports.APIKeyGuard = exports.SMSVerificationGuard = exports.TOTPGuard = exports.MFAGuard = exports.RolesAndPermissionsGuard = exports.PermissionsGuard = exports.RolesGuard = exports.OptionalJWTGuard = exports.JWTRefreshGuard = exports.JWTAuthGuard = exports.API_KEY_REQUIRED = exports.REQUIRE_MFA_KEY = exports.PERMISSIONS_KEY = exports.ROLES_KEY = exports.IS_PUBLIC_KEY = void 0;
exports.CreateJWTGuard = CreateJWTGuard;
exports.OwnerOrAdminGuard = OwnerOrAdminGuard;
exports.CreateAPIKeyGuard = CreateAPIKeyGuard;
exports.SlidingSessionGuard = SlidingSessionGuard;
exports.IPWhitelistGuard = IPWhitelistGuard;
exports.RateLimitGuard = RateLimitGuard;
exports.PerUserRateLimitGuard = PerUserRateLimitGuard;
exports.PatientConsentGuard = PatientConsentGuard;
exports.CombineGuards = CombineGuards;
exports.ConditionalGuard = ConditionalGuard;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt = __importStar(require("jsonwebtoken"));
exports.IS_PUBLIC_KEY = 'isPublic';
exports.ROLES_KEY = 'roles';
exports.PERMISSIONS_KEY = 'permissions';
exports.REQUIRE_MFA_KEY = 'requireMFA';
exports.API_KEY_REQUIRED = 'apiKeyRequired';
let JWTAuthGuard = class JWTAuthGuard {
    jwtSecret;
    constructor(jwtSecret = process.env.JWT_SECRET || 'secret') {
        this.jwtSecret = jwtSecret;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('No authentication token provided');
        }
        try {
            const payload = jwt.verify(token, this.jwtSecret);
            if (payload.exp && Date.now() >= payload.exp * 1000) {
                throw new common_1.UnauthorizedException('Token has expired');
            }
            request.user = {
                id: payload.sub,
                email: payload.email,
                roles: payload.roles || [],
                permissions: payload.permissions || [],
                tenantId: payload.tenantId,
            };
            return true;
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new common_1.UnauthorizedException('Token has expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            throw new common_1.UnauthorizedException('Authentication failed');
        }
    }
    extractTokenFromHeader(request) {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return undefined;
        }
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
};
exports.JWTAuthGuard = JWTAuthGuard;
exports.JWTAuthGuard = JWTAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], JWTAuthGuard);
let JWTRefreshGuard = class JWTRefreshGuard {
    refreshSecret;
    constructor(refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret') {
        this.refreshSecret = refreshSecret;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const refreshToken = request.body?.refreshToken || request.headers['x-refresh-token'];
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('No refresh token provided');
        }
        try {
            const payload = jwt.verify(refreshToken, this.refreshSecret);
            request.user = {
                id: payload.sub,
                email: payload.email,
                roles: payload.roles || [],
            };
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.JWTRefreshGuard = JWTRefreshGuard;
exports.JWTRefreshGuard = JWTRefreshGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], JWTRefreshGuard);
function CreateJWTGuard(secret, options) {
    let CustomJWTGuard = class CustomJWTGuard {
        async canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                throw new common_1.UnauthorizedException('No authentication token provided');
            }
            try {
                const payload = jwt.verify(token, secret, options);
                request.user = payload;
                return true;
            }
            catch (error) {
                throw new common_1.UnauthorizedException('Invalid or expired token');
            }
        }
        extractTokenFromHeader(request) {
            const authHeader = request.headers.authorization;
            if (!authHeader)
                return undefined;
            const [type, token] = authHeader.split(' ');
            return type === 'Bearer' ? token : undefined;
        }
    };
    CustomJWTGuard = __decorate([
        (0, common_1.Injectable)()
    ], CustomJWTGuard);
    return CustomJWTGuard;
}
let OptionalJWTGuard = class OptionalJWTGuard {
    jwtSecret;
    constructor(jwtSecret = process.env.JWT_SECRET || 'secret') {
        this.jwtSecret = jwtSecret;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            return true;
        }
        try {
            const payload = jwt.verify(token, this.jwtSecret);
            request.user = payload;
        }
        catch (error) {
            request.user = null;
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const authHeader = request.headers.authorization;
        if (!authHeader)
            return undefined;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
};
exports.OptionalJWTGuard = OptionalJWTGuard;
exports.OptionalJWTGuard = OptionalJWTGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], OptionalJWTGuard);
let RolesGuard = class RolesGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(exports.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
        if (!hasRole) {
            throw new common_1.ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
let PermissionsGuard = class PermissionsGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(exports.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        const hasPermission = requiredPermissions.every((permission) => user.permissions?.includes(permission));
        if (!hasPermission) {
            throw new common_1.ForbiddenException(`Access denied. Required permissions: ${requiredPermissions.join(', ')}`);
        }
        return true;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermissionsGuard);
let RolesAndPermissionsGuard = class RolesAndPermissionsGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(exports.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const requiredPermissions = this.reflector.getAllAndOverride(exports.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        if (requiredRoles && requiredRoles.length > 0) {
            const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
            if (!hasRole) {
                throw new common_1.ForbiddenException('Insufficient role privileges');
            }
        }
        if (requiredPermissions && requiredPermissions.length > 0) {
            const hasPermission = requiredPermissions.every((permission) => user.permissions?.includes(permission));
            if (!hasPermission) {
                throw new common_1.ForbiddenException('Insufficient permissions');
            }
        }
        return true;
    }
};
exports.RolesAndPermissionsGuard = RolesAndPermissionsGuard;
exports.RolesAndPermissionsGuard = RolesAndPermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesAndPermissionsGuard);
function OwnerOrAdminGuard(ownerIdParam = 'id') {
    let OwnerOrAdminGuardImpl = class OwnerOrAdminGuardImpl {
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            const resourceOwnerId = request.params[ownerIdParam];
            if (!user) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            const isOwner = user.id === resourceOwnerId;
            const isAdmin = user.roles?.includes('admin') || user.roles?.includes('super_admin');
            if (!isOwner && !isAdmin) {
                throw new common_1.ForbiddenException('Access denied. Must be owner or admin.');
            }
            return true;
        }
    };
    OwnerOrAdminGuardImpl = __decorate([
        (0, common_1.Injectable)()
    ], OwnerOrAdminGuardImpl);
    return OwnerOrAdminGuardImpl;
}
let MFAGuard = class MFAGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requireMFA = this.reflector.getAllAndOverride(exports.REQUIRE_MFA_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requireMFA) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        if (user.mfaEnabled && !user.mfaVerified) {
            throw new common_1.ForbiddenException('MFA verification required');
        }
        return true;
    }
};
exports.MFAGuard = MFAGuard;
exports.MFAGuard = MFAGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], MFAGuard);
let TOTPGuard = class TOTPGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const totpCode = request.body?.totpCode || request.headers['x-totp-code'];
        if (!totpCode) {
            throw new common_1.BadRequestException('TOTP code is required');
        }
        if (!/^\d{6}$/.test(totpCode)) {
            throw new common_1.BadRequestException('Invalid TOTP code format');
        }
        request.totpCode = totpCode;
        return true;
    }
};
exports.TOTPGuard = TOTPGuard;
exports.TOTPGuard = TOTPGuard = __decorate([
    (0, common_1.Injectable)()
], TOTPGuard);
let SMSVerificationGuard = class SMSVerificationGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const smsCode = request.body?.smsCode || request.headers['x-sms-code'];
        if (!smsCode) {
            throw new common_1.BadRequestException('SMS verification code is required');
        }
        if (!/^\d{4,8}$/.test(smsCode)) {
            throw new common_1.BadRequestException('Invalid SMS code format');
        }
        request.smsCode = smsCode;
        return true;
    }
};
exports.SMSVerificationGuard = SMSVerificationGuard;
exports.SMSVerificationGuard = SMSVerificationGuard = __decorate([
    (0, common_1.Injectable)()
], SMSVerificationGuard);
let APIKeyGuard = class APIKeyGuard {
    validApiKeys;
    constructor(apiKeys = []) {
        this.validApiKeys = new Set(apiKeys.length > 0 ? apiKeys : [process.env.API_KEY || '']);
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'] || request.query.apiKey;
        if (!apiKey) {
            throw new common_1.UnauthorizedException('API key is required');
        }
        if (!this.validApiKeys.has(apiKey)) {
            throw new common_1.UnauthorizedException('Invalid API key');
        }
        return true;
    }
};
exports.APIKeyGuard = APIKeyGuard;
exports.APIKeyGuard = APIKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Array])
], APIKeyGuard);
let FlexibleAuthGuard = class FlexibleAuthGuard {
    jwtSecret;
    validApiKeys;
    constructor(jwtSecret = process.env.JWT_SECRET || 'secret', validApiKeys = new Set([process.env.API_KEY || ''])) {
        this.jwtSecret = jwtSecret;
        this.validApiKeys = validApiKeys;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        if (apiKey && this.validApiKeys.has(apiKey)) {
            request.authType = 'api-key';
            return true;
        }
        const token = this.extractTokenFromHeader(request);
        if (token) {
            try {
                const payload = jwt.verify(token, this.jwtSecret);
                request.user = payload;
                request.authType = 'jwt';
                return true;
            }
            catch (error) {
                throw new common_1.UnauthorizedException('Invalid authentication credentials');
            }
        }
        throw new common_1.UnauthorizedException('Authentication required (JWT or API key)');
    }
    extractTokenFromHeader(request) {
        const authHeader = request.headers.authorization;
        if (!authHeader)
            return undefined;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
};
exports.FlexibleAuthGuard = FlexibleAuthGuard;
exports.FlexibleAuthGuard = FlexibleAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String, Set])
], FlexibleAuthGuard);
function CreateAPIKeyGuard(validKeys) {
    let CustomAPIKeyGuard = class CustomAPIKeyGuard {
        validApiKeys = new Set(validKeys);
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const apiKey = request.headers['x-api-key'] || request.query.apiKey;
            if (!apiKey || !this.validApiKeys.has(apiKey)) {
                throw new common_1.UnauthorizedException('Invalid or missing API key');
            }
            return true;
        }
    };
    CustomAPIKeyGuard = __decorate([
        (0, common_1.Injectable)()
    ], CustomAPIKeyGuard);
    return CustomAPIKeyGuard;
}
let OAuth2Guard = class OAuth2Guard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('OAuth2 token required');
        }
        try {
            const isValid = await this.validateOAuth2Token(token);
            if (!isValid) {
                throw new common_1.UnauthorizedException('Invalid OAuth2 token');
            }
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('OAuth2 token validation failed');
        }
    }
    extractTokenFromHeader(request) {
        const authHeader = request.headers.authorization;
        if (!authHeader)
            return undefined;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
    async validateOAuth2Token(token) {
        return true;
    }
};
exports.OAuth2Guard = OAuth2Guard;
exports.OAuth2Guard = OAuth2Guard = __decorate([
    (0, common_1.Injectable)()
], OAuth2Guard);
let OpenIDConnectGuard = class OpenIDConnectGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('OpenID Connect token required');
        }
        try {
            const payload = jwt.decode(token);
            if (!payload || !payload.sub) {
                throw new common_1.UnauthorizedException('Invalid OpenID Connect token');
            }
            request.user = {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
            };
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('OpenID Connect validation failed');
        }
    }
    extractTokenFromHeader(request) {
        const authHeader = request.headers.authorization;
        if (!authHeader)
            return undefined;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
};
exports.OpenIDConnectGuard = OpenIDConnectGuard;
exports.OpenIDConnectGuard = OpenIDConnectGuard = __decorate([
    (0, common_1.Injectable)()
], OpenIDConnectGuard);
let SessionGuard = class SessionGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const session = request.session;
        if (!session || !session.userId) {
            throw new common_1.UnauthorizedException('Valid session required');
        }
        if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
            throw new common_1.UnauthorizedException('Session expired');
        }
        return true;
    }
};
exports.SessionGuard = SessionGuard;
exports.SessionGuard = SessionGuard = __decorate([
    (0, common_1.Injectable)()
], SessionGuard);
function SlidingSessionGuard(maxAge) {
    let SlidingSessionGuardImpl = class SlidingSessionGuardImpl {
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const session = request.session;
            if (!session || !session.userId) {
                throw new common_1.UnauthorizedException('Valid session required');
            }
            session.expiresAt = new Date(Date.now() + maxAge);
            return true;
        }
    };
    SlidingSessionGuardImpl = __decorate([
        (0, common_1.Injectable)()
    ], SlidingSessionGuardImpl);
    return SlidingSessionGuardImpl;
}
function IPWhitelistGuard(allowedIPs) {
    let IPWhitelistGuardImpl = class IPWhitelistGuardImpl {
        whitelist = new Set(allowedIPs);
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const clientIP = this.getClientIP(request);
            if (!this.whitelist.has(clientIP)) {
                throw new common_1.ForbiddenException(`Access denied for IP: ${clientIP}`);
            }
            return true;
        }
        getClientIP(request) {
            return (request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                request.headers['x-real-ip'] ||
                request.socket.remoteAddress ||
                'unknown');
        }
    };
    IPWhitelistGuardImpl = __decorate([
        (0, common_1.Injectable)()
    ], IPWhitelistGuardImpl);
    return IPWhitelistGuardImpl;
}
let InternalNetworkGuard = class InternalNetworkGuard {
    internalRanges = [
        /^127\./,
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[01])\./,
        /^192\.168\./,
    ];
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const clientIP = this.getClientIP(request);
        const isInternal = this.internalRanges.some((range) => range.test(clientIP));
        if (!isInternal) {
            throw new common_1.ForbiddenException('Access restricted to internal network');
        }
        return true;
    }
    getClientIP(request) {
        return (request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            request.headers['x-real-ip'] ||
            request.socket.remoteAddress ||
            'unknown');
    }
};
exports.InternalNetworkGuard = InternalNetworkGuard;
exports.InternalNetworkGuard = InternalNetworkGuard = __decorate([
    (0, common_1.Injectable)()
], InternalNetworkGuard);
function RateLimitGuard(maxRequests, windowMs) {
    let RateLimitGuardImpl = class RateLimitGuardImpl {
        requests = new Map();
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const key = this.getKey(request);
            const now = Date.now();
            const requests = this.requests.get(key) || [];
            const validRequests = requests.filter((time) => now - time < windowMs);
            if (validRequests.length >= maxRequests) {
                throw new common_1.ForbiddenException('Rate limit exceeded');
            }
            validRequests.push(now);
            this.requests.set(key, validRequests);
            return true;
        }
        getKey(request) {
            const ip = request.socket.remoteAddress || 'unknown';
            const userId = request.user?.id || 'anonymous';
            return `${ip}:${userId}`;
        }
    };
    RateLimitGuardImpl = __decorate([
        (0, common_1.Injectable)()
    ], RateLimitGuardImpl);
    return RateLimitGuardImpl;
}
function PerUserRateLimitGuard(maxRequests, windowMs) {
    let PerUserRateLimitGuardImpl = class PerUserRateLimitGuardImpl {
        userRequests = new Map();
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            if (!user) {
                throw new common_1.UnauthorizedException('Authentication required for rate limiting');
            }
            const userId = user.id;
            const now = Date.now();
            const requests = this.userRequests.get(userId) || [];
            const validRequests = requests.filter((time) => now - time < windowMs);
            if (validRequests.length >= maxRequests) {
                throw new common_1.ForbiddenException(`Rate limit exceeded. Max ${maxRequests} requests per ${windowMs / 1000} seconds`);
            }
            validRequests.push(now);
            this.userRequests.set(userId, validRequests);
            return true;
        }
    };
    PerUserRateLimitGuardImpl = __decorate([
        (0, common_1.Injectable)()
    ], PerUserRateLimitGuardImpl);
    return PerUserRateLimitGuardImpl;
}
let HIPAAComplianceGuard = class HIPAAComplianceGuard {
    authorizedRoles = ['doctor', 'nurse', 'admin', 'healthcare_provider'];
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('Authentication required for PHI access');
        }
        const hasAuthorizedRole = this.authorizedRoles.some((role) => user.roles?.includes(role));
        if (!hasAuthorizedRole) {
            throw new common_1.ForbiddenException('Insufficient privileges to access Protected Health Information');
        }
        this.logPHIAccess(user, request);
        return true;
    }
    logPHIAccess(user, request) {
        console.log('[HIPAA Audit]', {
            userId: user.id,
            email: user.email,
            action: `${request.method} ${request.url}`,
            timestamp: new Date().toISOString(),
            ip: request.socket.remoteAddress,
        });
    }
};
exports.HIPAAComplianceGuard = HIPAAComplianceGuard;
exports.HIPAAComplianceGuard = HIPAAComplianceGuard = __decorate([
    (0, common_1.Injectable)()
], HIPAAComplianceGuard);
let MedicalStaffGuard = class MedicalStaffGuard {
    medicalRoles = ['doctor', 'nurse', 'physician_assistant', 'nurse_practitioner'];
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('Authentication required');
        }
        const isMedicalStaff = this.medicalRoles.some((role) => user.roles?.includes(role));
        if (!isMedicalStaff) {
            throw new common_1.ForbiddenException('Access restricted to medical staff');
        }
        return true;
    }
};
exports.MedicalStaffGuard = MedicalStaffGuard;
exports.MedicalStaffGuard = MedicalStaffGuard = __decorate([
    (0, common_1.Injectable)()
], MedicalStaffGuard);
function PatientConsentGuard(consentService) {
    let PatientConsentGuardImpl = class PatientConsentGuardImpl {
        async canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            const patientId = request.params.patientId || request.body?.patientId;
            if (!patientId) {
                throw new common_1.BadRequestException('Patient ID required');
            }
            if (user.id === patientId) {
                return true;
            }
            const hasConsent = await consentService.checkConsent(patientId, user.id);
            if (!hasConsent) {
                throw new common_1.ForbiddenException('Patient consent required for access');
            }
            return true;
        }
    };
    PatientConsentGuardImpl = __decorate([
        (0, common_1.Injectable)()
    ], PatientConsentGuardImpl);
    return PatientConsentGuardImpl;
}
let TenantIsolationGuard = class TenantIsolationGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const tenantId = request.headers['x-tenant-id'] || request.query.tenantId;
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID required');
        }
        if (user.tenantId !== tenantId) {
            throw new common_1.ForbiddenException('Access denied to this tenant');
        }
        request.tenantId = tenantId;
        return true;
    }
};
exports.TenantIsolationGuard = TenantIsolationGuard;
exports.TenantIsolationGuard = TenantIsolationGuard = __decorate([
    (0, common_1.Injectable)()
], TenantIsolationGuard);
let CrossTenantAccessGuard = class CrossTenantAccessGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const isSuperAdmin = user.roles?.includes('super_admin');
        if (!isSuperAdmin) {
            throw new common_1.ForbiddenException('Cross-tenant access requires super admin privileges');
        }
        return true;
    }
};
exports.CrossTenantAccessGuard = CrossTenantAccessGuard;
exports.CrossTenantAccessGuard = CrossTenantAccessGuard = __decorate([
    (0, common_1.Injectable)()
], CrossTenantAccessGuard);
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
let PublicRouteGuard = class PublicRouteGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(exports.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        return isPublic !== false;
    }
};
exports.PublicRouteGuard = PublicRouteGuard;
exports.PublicRouteGuard = PublicRouteGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PublicRouteGuard);
function CombineGuards(guards) {
    let CombinedGuard = class CombinedGuard {
        async canActivate(context) {
            for (const GuardClass of guards) {
                const guard = new GuardClass();
                const result = await guard.canActivate(context);
                if (!result) {
                    return false;
                }
            }
            return true;
        }
    };
    CombinedGuard = __decorate([
        (0, common_1.Injectable)()
    ], CombinedGuard);
    return CombinedGuard;
}
function ConditionalGuard(condition, guard) {
    let ConditionalGuardImpl = class ConditionalGuardImpl {
        async canActivate(context) {
            const request = context.switchToHttp().getRequest();
            if (!condition(request)) {
                return true;
            }
            const guardInstance = new guard();
            return guardInstance.canActivate(context);
        }
    };
    ConditionalGuardImpl = __decorate([
        (0, common_1.Injectable)()
    ], ConditionalGuardImpl);
    return ConditionalGuardImpl;
}
//# sourceMappingURL=authentication-guard-composites.service.js.map