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
var MicrosoftStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_microsoft_1 = require("passport-microsoft");
const config_1 = require("@nestjs/config");
let MicrosoftStrategy = MicrosoftStrategy_1 = class MicrosoftStrategy extends (0, passport_1.PassportStrategy)(passport_microsoft_1.Strategy, 'microsoft') {
    configService;
    logger = new common_1.Logger(MicrosoftStrategy_1.name);
    constructor(configService) {
        const clientID = configService.get('MICROSOFT_CLIENT_ID');
        const clientSecret = configService.get('MICROSOFT_CLIENT_SECRET');
        const callbackURL = configService.get('MICROSOFT_CALLBACK_URL') ||
            'http://localhost:3001/api/auth/oauth/microsoft/callback';
        if (!clientID || !clientSecret) {
            console.warn('Microsoft OAuth not configured. Set MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET in .env to enable Microsoft login.');
        }
        super({
            clientID: clientID || 'dummy-client-id',
            clientSecret: clientSecret || 'dummy-client-secret',
            callbackURL,
            scope: ['user.read'],
            tenant: 'common',
        });
        this.configService = configService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        try {
            const { id, emails, name, photos } = profile;
            const oauthProfile = {
                id,
                email: emails?.[0]?.value || profile.userPrincipalName || '',
                firstName: name?.givenName,
                lastName: name?.familyName,
                displayName: profile.displayName,
                picture: photos?.[0]?.value,
                provider: 'microsoft',
            };
            this.logger.log(`Microsoft OAuth validation successful for: ${oauthProfile.email}`);
            done(null, oauthProfile);
        }
        catch (error) {
            this.logger.error(`Microsoft OAuth validation failed: ${error.message}`);
            done(error, undefined);
        }
    }
};
exports.MicrosoftStrategy = MicrosoftStrategy;
exports.MicrosoftStrategy = MicrosoftStrategy = MicrosoftStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MicrosoftStrategy);
//# sourceMappingURL=microsoft.strategy.js.map