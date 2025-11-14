"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitLenient = exports.RateLimitModerate = exports.RateLimitStrict = exports.RateLimit = exports.RATE_LIMIT_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.RATE_LIMIT_KEY = 'rate-limit';
const RateLimit = (config) => (0, common_1.SetMetadata)(exports.RATE_LIMIT_KEY, config);
exports.RateLimit = RateLimit;
const RateLimitStrict = () => (0, exports.RateLimit)({ limit: 10, windowMs: 60000 });
exports.RateLimitStrict = RateLimitStrict;
const RateLimitModerate = () => (0, exports.RateLimit)({ limit: 50, windowMs: 60000 });
exports.RateLimitModerate = RateLimitModerate;
const RateLimitLenient = () => (0, exports.RateLimit)({ limit: 100, windowMs: 60000 });
exports.RateLimitLenient = RateLimitLenient;
//# sourceMappingURL=rate-limit.decorator.js.map