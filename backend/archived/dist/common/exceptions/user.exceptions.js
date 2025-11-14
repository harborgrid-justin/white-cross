"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InactiveAccountException = exports.AccountLockedException = exports.InsufficientPermissionsException = exports.InvalidPasswordException = exports.EmailConflictException = exports.UserNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class UserNotFoundException extends common_1.NotFoundException {
    code = 'USER_NOT_FOUND';
    context;
    constructor(identifier, context) {
        super('User not found');
        this.name = 'UserNotFoundException';
        this.context = context;
    }
}
exports.UserNotFoundException = UserNotFoundException;
class EmailConflictException extends common_1.ConflictException {
    code = 'EMAIL_CONFLICT';
    context;
    constructor(email, context) {
        super('Email address is already in use');
        this.name = 'EmailConflictException';
        this.context = context;
    }
}
exports.EmailConflictException = EmailConflictException;
class InvalidPasswordException extends common_1.UnauthorizedException {
    code = 'INVALID_PASSWORD';
    context;
    constructor(reason, context) {
        super(reason);
        this.name = 'InvalidPasswordException';
        this.context = context;
    }
}
exports.InvalidPasswordException = InvalidPasswordException;
class InsufficientPermissionsException extends common_1.ForbiddenException {
    code = 'INSUFFICIENT_PERMISSIONS';
    context;
    constructor(requiredRole, context) {
        super(`Insufficient permissions. Required role: ${requiredRole}`);
        this.name = 'InsufficientPermissionsException';
        this.context = context;
    }
}
exports.InsufficientPermissionsException = InsufficientPermissionsException;
class AccountLockedException extends common_1.ForbiddenException {
    code = 'ACCOUNT_LOCKED';
    context;
    constructor(reason, context) {
        super(reason);
        this.name = 'AccountLockedException';
        this.context = context;
    }
}
exports.AccountLockedException = AccountLockedException;
class InactiveAccountException extends common_1.ForbiddenException {
    code = 'INACTIVE_ACCOUNT';
    context;
    constructor(context) {
        super('This account is inactive. Please contact an administrator.');
        this.name = 'InactiveAccountException';
        this.context = context;
    }
}
exports.InactiveAccountException = InactiveAccountException;
//# sourceMappingURL=user.exceptions.js.map