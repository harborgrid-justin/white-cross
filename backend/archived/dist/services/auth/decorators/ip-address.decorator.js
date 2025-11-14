"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpAddress = void 0;
const common_1 = require("@nestjs/common");
exports.IpAddress = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.ip ||
        request.connection?.remoteAddress ||
        request.socket?.remoteAddress ||
        'unknown');
});
//# sourceMappingURL=ip-address.decorator.js.map