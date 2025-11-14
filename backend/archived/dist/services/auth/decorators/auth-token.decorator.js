"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthToken = void 0;
const common_1 = require("@nestjs/common");
exports.AuthToken = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return null;
    }
    return authHeader.replace(/^Bearer\s+/i, '');
});
//# sourceMappingURL=auth-token.decorator.js.map