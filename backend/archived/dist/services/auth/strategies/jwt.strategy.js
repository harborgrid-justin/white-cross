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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../database/models");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    userModel;
    configService;
    constructor(userModel, configService) {
        const jwtSecret = configService.get('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET is not configured in JWT Strategy');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
            issuer: 'white-cross-healthcare',
            audience: 'white-cross-api',
        });
        this.userModel = userModel;
        this.configService = configService;
    }
    async validate(payload) {
        const { sub, type } = payload;
        if (type !== 'access') {
            throw new common_1.UnauthorizedException('Invalid token type');
        }
        const user = await this.userModel.findByPk(sub);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is inactive');
        }
        if (user.isAccountLocked()) {
            throw new common_1.UnauthorizedException('Account is temporarily locked. Please try again later.');
        }
        if (payload.iat && user.passwordChangedAfter(payload.iat)) {
            throw new common_1.UnauthorizedException('Password was changed. Please login again.');
        }
        return user.toSafeObject();
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.User)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map