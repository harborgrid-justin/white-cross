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
exports.AlertDto = exports.AlertType = void 0;
const openapi = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
var AlertType;
(function (AlertType) {
    AlertType["INFO"] = "INFO";
    AlertType["WARNING"] = "WARNING";
    AlertType["ERROR"] = "ERROR";
    AlertType["CRITICAL"] = "CRITICAL";
    AlertType["MEDICATION"] = "MEDICATION";
    AlertType["APPOINTMENT"] = "APPOINTMENT";
    AlertType["EMERGENCY"] = "EMERGENCY";
})(AlertType || (exports.AlertType = AlertType = {}));
(0, graphql_1.registerEnumType)(AlertType, {
    name: 'AlertType',
    description: 'Type of alert notification',
});
let AlertDto = class AlertDto {
    id;
    type;
    title;
    message;
    studentId;
    recipientId;
    recipientRole;
    actionUrl;
    isRead;
    createdAt;
    expiresAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, type: { required: true, enum: require("./alert.dto").AlertType }, title: { required: true, type: () => String }, message: { required: true, type: () => String }, studentId: { required: false, type: () => String }, recipientId: { required: false, type: () => String }, recipientRole: { required: false, type: () => String }, actionUrl: { required: false, type: () => String }, isRead: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, expiresAt: { required: false, type: () => Date } };
    }
};
exports.AlertDto = AlertDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], AlertDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => AlertType),
    __metadata("design:type", String)
], AlertDto.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AlertDto.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AlertDto.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AlertDto.prototype, "studentId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], AlertDto.prototype, "recipientId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AlertDto.prototype, "recipientRole", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AlertDto.prototype, "actionUrl", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], AlertDto.prototype, "isRead", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], AlertDto.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], AlertDto.prototype, "expiresAt", void 0);
exports.AlertDto = AlertDto = __decorate([
    (0, graphql_1.ObjectType)()
], AlertDto);
//# sourceMappingURL=alert.dto.js.map