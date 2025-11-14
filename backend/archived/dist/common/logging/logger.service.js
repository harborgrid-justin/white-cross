"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston = __importStar(require("winston"));
const app_config_service_1 = require("../config/app-config.service");
let LoggerService = class LoggerService {
    config;
    winston;
    context;
    constructor(config) {
        this.config = config;
        const logFormat = winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json());
        const consoleFormat = winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.colorize(), winston.format.printf(({ timestamp, level, message, context, stack, ...meta }) => {
            let log = `${timestamp} [${context || 'Application'}] [${level}]: ${message}`;
            if (stack) {
                log += `\n${stack}`;
            }
            if (Object.keys(meta).length > 0) {
                log += `\n${JSON.stringify(meta, null, 2)}`;
            }
            return log;
        }));
        const logLevel = this.config?.get('app.logging.level', 'info') ?? 'info';
        const isProduction = this.config?.isProduction ?? false;
        this.winston = winston.createLogger({
            level: logLevel,
            format: logFormat,
            defaultMeta: { service: 'white-cross-api' },
            transports: [
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                }),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                }),
            ],
        });
        if (!isProduction) {
            this.winston.add(new winston.transports.Console({
                format: consoleFormat,
            }));
        }
    }
    setContext(context) {
        this.context = context;
    }
    log(message, context) {
        const logContext = context || this.context || 'Application';
        this.winston.info(message, { context: logContext });
    }
    info(message, context) {
        this.log(message, context);
    }
    error(message, trace, context) {
        const logContext = context || this.context || 'Application';
        if (trace instanceof Error) {
            this.winston.error(message, {
                context: logContext,
                error: trace.message,
                stack: trace.stack,
            });
        }
        else if (trace && typeof trace === 'object') {
            this.winston.error(message, {
                context: logContext,
                error: JSON.stringify(trace),
            });
        }
        else if (trace) {
            this.winston.error(`${message} ${trace}`, { context: logContext });
        }
        else {
            this.winston.error(message, { context: logContext });
        }
    }
    warn(message, context) {
        const logContext = context || this.context || 'Application';
        this.winston.warn(message, { context: logContext });
    }
    debug(message, context) {
        const logContext = context || this.context || 'Application';
        this.winston.debug(message, { context: logContext });
    }
    verbose(message, context) {
        const logContext = context || this.context || 'Application';
        this.winston.verbose(message, { context: logContext });
    }
    logWithMetadata(level, message, metadata, context) {
        const logContext = context || this.context || 'Application';
        this.winston.log(level, message, { ...metadata, context: logContext });
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.TRANSIENT }),
    __param(0, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [app_config_service_1.AppConfigService])
], LoggerService);
exports.default = LoggerService;
//# sourceMappingURL=logger.service.js.map