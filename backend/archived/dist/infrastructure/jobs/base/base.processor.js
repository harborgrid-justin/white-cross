"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseJobProcessor = void 0;
const common_1 = require("@nestjs/common");
class BaseJobProcessor {
    logger;
    constructor(processorName) {
        this.logger = new common_1.Logger(processorName);
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.BaseJobProcessor = BaseJobProcessor;
//# sourceMappingURL=base.processor.js.map