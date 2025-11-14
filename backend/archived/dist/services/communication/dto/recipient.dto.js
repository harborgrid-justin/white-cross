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
exports.RecipientDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const recipient_type_enum_1 = require("../enums/recipient-type.enum");
class RecipientDto {
    type;
    id;
    email;
    phoneNumber;
    pushToken;
    preferredLanguage;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("../enums/recipient-type.enum").RecipientType }, id: { required: true, type: () => String }, email: { required: false, type: () => String, format: "email" }, phoneNumber: { required: false, type: () => String, pattern: "/^\\+?[1-9]\\d{1,14}$/" }, pushToken: { required: false, type: () => String }, preferredLanguage: { required: false, type: () => String } };
    }
}
exports.RecipientDto = RecipientDto;
__decorate([
    (0, class_validator_1.IsEnum)(recipient_type_enum_1.RecipientType),
    __metadata("design:type", String)
], RecipientDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\+?[1-9]\d{1,14}$/, {
        message: 'Phone number must be in E.164 format',
    }),
    __metadata("design:type", String)
], RecipientDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "pushToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "preferredLanguage", void 0);
//# sourceMappingURL=recipient.dto.js.map