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
exports.SearchSuggestionsDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SearchSuggestionsDto {
    partial;
    userId;
    static _OPENAPI_METADATA_FACTORY() {
        return { partial: { required: true, type: () => String, maxLength: 100 }, userId: { required: true, type: () => String } };
    }
}
exports.SearchSuggestionsDto = SearchSuggestionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Partial search query for suggestions',
        example: 'asth',
        maxLength: 100,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], SearchSuggestionsDto.prototype, "partial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID for personalized suggestions',
        example: 'uuid-123',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchSuggestionsDto.prototype, "userId", void 0);
//# sourceMappingURL=search-suggestions.dto.js.map