"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
class Logger {
    name;
    constructor(name) {
        this.name = name;
    }
    info(message, meta) {
        console.log(`[${this.name}] INFO: ${message}`, meta || '');
    }
    warn(message, meta) {
        console.warn(`[${this.name}] WARN: ${message}`, meta || '');
    }
    error(message, meta) {
        console.error(`[${this.name}] ERROR: ${message}`, meta || '');
    }
    debug(message, meta) {
        console.debug(`[${this.name}] DEBUG: ${message}`, meta || '');
    }
}
exports.Logger = Logger;
exports.logger = new Logger('App');
//# sourceMappingURL=logger.js.map