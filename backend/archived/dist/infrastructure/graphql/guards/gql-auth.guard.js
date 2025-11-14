"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GqlAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const graphql_1 = require("@nestjs/graphql");
const core_1 = require("@nestjs/core");
const decorators_1 = require("../../../services/auth/decorators");
const auth_1 = require("../../../services/auth");
let GqlAuthGuard = GqlAuthGuard_1 = class GqlAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    reflector;
    tokenBlacklistService;
    logger = new common_1.Logger(GqlAuthGuard_1.name);
    constructor(reflector, tokenBlacklistService) {
        super();
        this.reflector = reflector;
        this.tokenBlacklistService = tokenBlacklistService;
    }
    getRequest(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(decorators_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            this.logger.debug('Public GraphQL resolver - skipping authentication');
            return true;
        }
        try {
            const result = await super.canActivate(context);
            if (!result) {
                return false;
            }
            const request = this.getRequest(context);
            const token = this.extractTokenFromRequest(request);
            if (token) {
                const isBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(token);
                if (isBlacklisted) {
                    this.logger.warn('Blacklisted token attempted GraphQL access', {
                        query: request.body?.query?.substring(0, 100),
                        variables: Object.keys(request.body?.variables || {}),
                    });
                    throw new common_1.UnauthorizedException('Token has been revoked');
                }
                const user = request.user;
                if (user && user.id) {
                    const tokenPayload = this.decodeToken(token);
                    if (tokenPayload && tokenPayload.iat) {
                        const userTokensBlacklisted = await this.tokenBlacklistService.areUserTokensBlacklisted(user.id, tokenPayload.iat);
                        if (userTokensBlacklisted) {
                            this.logger.warn('User tokens invalidated - GraphQL access denied', {
                                userId: user.id,
                                tokenIssuedAt: new Date(tokenPayload.iat * 1000).toISOString(),
                            });
                            throw new common_1.UnauthorizedException('Session invalidated. Please login again.');
                        }
                    }
                }
                this.logger.debug('GraphQL authentication successful', {
                    userId: user?.id,
                    query: request.body?.query?.substring(0, 100),
                });
            }
            return true;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                this.logger.warn('GraphQL authentication failed', {
                    error: error.message,
                    query: context.getArgs()[3]?.fieldName,
                });
            }
            else {
                this.logger.error('Unexpected error in GraphQL authentication', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    stack: error instanceof Error ? error.stack : undefined,
                });
            }
            throw error;
        }
    }
    handleRequest(err, user, info, context) {
        if (err || !user) {
            const request = this.getRequest(context);
            this.logger.warn('GraphQL authentication handleRequest failed', {
                error: err?.message,
                info: info?.message,
                query: request?.body?.query?.substring(0, 100),
            });
            throw (err || new common_1.UnauthorizedException('Authentication required for GraphQL'));
        }
        return user;
    }
    extractTokenFromRequest(request) {
        const authHeader = request.headers?.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
    decodeToken(token) {
        try {
            const base64Payload = token.split('.')[1];
            const payload = Buffer.from(base64Payload, 'base64').toString();
            return JSON.parse(payload);
        }
        catch (error) {
            this.logger.error('Failed to decode JWT token', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            return null;
        }
    }
};
exports.GqlAuthGuard = GqlAuthGuard;
exports.GqlAuthGuard = GqlAuthGuard = GqlAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        auth_1.TokenBlacklistService])
], GqlAuthGuard);
//# sourceMappingURL=gql-auth.guard.js.map