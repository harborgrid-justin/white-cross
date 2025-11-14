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
var GoogleStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = require("@nestjs/config");
let GoogleStrategy = GoogleStrategy_1 = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    configService;
    logger = new common_1.Logger(GoogleStrategy_1.name);
    constructor(configService) {
        const clientID = configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get('GOOGLE_CLIENT_SECRET');
        const callbackURL = configService.get('GOOGLE_CALLBACK_URL') ||
            'http://localhost:3001/api/auth/oauth/google/callback';
        if (!clientID || !clientSecret) {
            console.warn('Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable Google login.');
        }
        super({
            clientID: clientID || 'dummy-client-id',
            clientSecret: clientSecret || 'dummy-client-secret',
            callbackURL,
            scope: ['email', 'profile'],
        });
        this.configService = configService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        try {
            const { id, emails, name, photos } = profile;
            const oauthProfile = {
                id,
                email: emails?.[0]?.value || '',
                firstName: name?.givenName,
                lastName: name?.familyName,
                displayName: profile.displayName,
                picture: photos?.[0]?.value,
                provider: 'google',
            };
            this.logger.log(`Google OAuth validation successful for: ${oauthProfile.email}`);
            done(null, oauthProfile);
        }
        catch (error) {
            this.logger.error(`Google OAuth validation failed: ${error.message}`);
            done(error, undefined);
        }
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = GoogleStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map