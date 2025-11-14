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
exports.EmergencyVerifyContactDto = exports.VerificationMethod = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var VerificationMethod;
(function (VerificationMethod) {
    VerificationMethod["SMS"] = "sms";
    VerificationMethod["EMAIL"] = "email";
    VerificationMethod["VOICE"] = "voice";
})(VerificationMethod || (exports.VerificationMethod = VerificationMethod = {}));
class EmergencyVerifyContactDto {
    verificationMethod;
    static _OPENAPI_METADATA_FACTORY() {
        return { verificationMethod: { required: true, enum: require("./verify-contact.dto").VerificationMethod } };
    }
}
exports.EmergencyVerifyContactDto = EmergencyVerifyContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Verification method to use',
        enum: VerificationMethod,
        example: VerificationMethod.SMS,
    }),
    (0, class_validator_1.IsEnum)(VerificationMethod),
    __metadata("design:type", String)
], EmergencyVerifyContactDto.prototype, "verificationMethod", void 0);
//# sourceMappingURL=verify-contact.dto.js.map