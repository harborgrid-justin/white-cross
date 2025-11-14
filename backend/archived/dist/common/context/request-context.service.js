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
exports.RequestContextService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const crypto_1 = require("crypto");
let RequestContextService = class RequestContextService {
    request;
    _requestId;
    _timestamp;
    _userId;
    _userEmail;
    _userRole;
    _userRoles = [];
    _userPermissions = [];
    _ipAddress;
    _userAgent;
    _path;
    _method;
    constructor(request) {
        this.request = request;
        this._requestId = (0, crypto_1.randomUUID)();
        this._timestamp = new Date();
        this._ipAddress = this.extractIpAddress();
        this._userAgent = this.request.get('user-agent');
        this._path = this.request.path;
        this._method = this.request.method;
        this.extractUserContext();
    }
    extractUserContext() {
        const user = this.request.user;
        if (user) {
            this._userId = user.id || user.userId || user.sub;
            this._userEmail = user.email;
            this._userRole = user.role;
            this._userRoles = user.roles || (user.role ? [user.role] : []);
            this._userPermissions = user.permissions || [];
        }
    }
    extractIpAddress() {
        return (this.request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            this.request.headers['x-real-ip'] ||
            this.request.ip ||
            this.request.socket?.remoteAddress);
    }
    get requestId() {
        return this._requestId;
    }
    get timestamp() {
        return this._timestamp;
    }
    get userId() {
        return this._userId;
    }
    get userEmail() {
        return this._userEmail;
    }
    get userRole() {
        return this._userRole;
    }
    get userRoles() {
        return this._userRoles;
    }
    get userPermissions() {
        return this._userPermissions;
    }
    get ipAddress() {
        return this._ipAddress;
    }
    get userAgent() {
        return this._userAgent;
    }
    get path() {
        return this._path;
    }
    get method() {
        return this._method;
    }
    isAuthenticated() {
        return !!this._userId;
    }
    hasRole(role) {
        return this._userRoles.includes(role);
    }
    hasAnyRole(roles) {
        return roles.some((role) => this._userRoles.includes(role));
    }
    hasAllRoles(roles) {
        return roles.every((role) => this._userRoles.includes(role));
    }
    hasPermission(permission) {
        return this._userPermissions.includes(permission);
    }
    hasAnyPermission(permissions) {
        return permissions.some((permission) => this._userPermissions.includes(permission));
    }
    getAuditContext() {
        return {
            requestId: this._requestId,
            timestamp: this._timestamp,
            userId: this._userId,
            userEmail: this._userEmail,
            userRole: this._userRole,
            userRoles: this._userRoles,
            ipAddress: this._ipAddress,
            userAgent: this._userAgent,
            path: this._path,
            method: this._method,
        };
    }
    getLogContext() {
        return {
            requestId: this._requestId,
            userId: this._userId,
            userRole: this._userRole,
            path: this._path,
            method: this._method,
        };
    }
};
exports.RequestContextService = RequestContextService;
exports.RequestContextService = RequestContextService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object])
], RequestContextService);
//# sourceMappingURL=request-context.service.js.map