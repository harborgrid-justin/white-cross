"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const google_strategy_1 = require("./strategies/google.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const microsoft_strategy_1 = require("./strategies/microsoft.strategy");
const database_1 = require("../../database");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const email_verification_service_1 = require("./services/email-verification.service");
const mfa_service_1 = require("./services/mfa.service");
const oauth_service_1 = require("./services/oauth.service");
const password_reset_service_1 = require("./services/password-reset.service");
const token_blacklist_service_1 = require("./services/token-blacklist.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const jwtSecret = configService.get('JWT_SECRET');
                    if (!jwtSecret) {
                        throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET is not configured. ' +
                            'Application cannot start without proper JWT secret configuration. ' +
                            'Please set JWT_SECRET in your .env file to a strong, random secret.');
                    }
                    if (jwtSecret.length < 32) {
                        throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET must be at least 32 characters long. ' +
                            'Current length: ' +
                            jwtSecret.length);
                    }
                    return {
                        secret: jwtSecret,
                        signOptions: {
                            expiresIn: '15m',
                            issuer: 'white-cross-healthcare',
                            audience: 'white-cross-api',
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            sequelize_1.SequelizeModule.forFeature([database_1.User]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            google_strategy_1.GoogleStrategy,
            microsoft_strategy_1.MicrosoftStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
            token_blacklist_service_1.TokenBlacklistService,
            mfa_service_1.MfaService,
            oauth_service_1.OAuthService,
            password_reset_service_1.PasswordResetService,
            email_verification_service_1.EmailVerificationService,
        ],
        exports: [
            auth_service_1.AuthService,
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
            passport_1.PassportModule,
            jwt_1.JwtModule,
            token_blacklist_service_1.TokenBlacklistService,
            mfa_service_1.MfaService,
            oauth_service_1.OAuthService,
            password_reset_service_1.PasswordResetService,
            email_verification_service_1.EmailVerificationService,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map