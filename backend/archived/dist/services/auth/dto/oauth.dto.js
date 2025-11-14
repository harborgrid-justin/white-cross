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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthCallbackDto = exports.OAuthLoginDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class OAuthLoginDto {
    provider;
    accessToken;
    idToken;
    static _OPENAPI_METADATA_FACTORY() {
        return { provider: { required: true, type: () => Object }, accessToken: { required: true, type: () => String }, idToken: { required: false, type: () => String } };
    }
}
exports.OAuthLoginDto = OAuthLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'OAuth provider (google or microsoft)',
        example: 'google',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OAuthLoginDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'OAuth access token from provider',
        example: 'ya29.a0AfH6SMB...',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OAuthLoginDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'OAuth ID token from provider (contains user info)',
        example: 'eyJhbGciOiJSUzI1NiIs...',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OAuthLoginDto.prototype, "idToken", void 0);
class OAuthCallbackDto {
    code;
    state;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String }, state: { required: false, type: () => String } };
    }
}
exports.OAuthCallbackDto = OAuthCallbackDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Authorization code from OAuth provider',
        example: '4/0AX4XfWh...',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OAuthCallbackDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State parameter for CSRF protection',
        example: 'random-state-string',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OAuthCallbackDto.prototype, "state", void 0);
//# sourceMappingURL=oauth.dto.js.map