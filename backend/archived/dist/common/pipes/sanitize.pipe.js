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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizePipe = void 0;
const common_1 = require("@nestjs/common");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
let SanitizePipe = class SanitizePipe {
    allowHtml;
    allowedTags;
    constructor(options) {
        this.allowHtml = options?.allowHtml ?? false;
        this.allowedTags = options?.allowedTags ?? [
            'p',
            'br',
            'strong',
            'em',
            'u',
            'a',
            'ul',
            'ol',
            'li',
        ];
    }
    transform(value) {
        return this.sanitize(value);
    }
    sanitize(value) {
        if (value === null || value === undefined) {
            return value;
        }
        if (typeof value === 'string') {
            return this.sanitizeString(value);
        }
        if (Array.isArray(value)) {
            return value.map((item) => this.sanitize(item));
        }
        if (typeof value === 'object') {
            const sanitizedObject = {};
            for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    sanitizedObject[key] = this.sanitize(value[key]);
                }
            }
            return sanitizedObject;
        }
        return value;
    }
    sanitizeString(value) {
        if (!value)
            return value;
        if (this.allowHtml) {
            return (0, sanitize_html_1.default)(value, {
                allowedTags: this.allowedTags,
                allowedAttributes: {
                    a: ['href', 'title'],
                },
                allowedSchemes: ['http', 'https', 'mailto'],
            });
        }
        return (0, sanitize_html_1.default)(value, {
            allowedTags: [],
            allowedAttributes: {},
        });
    }
};
exports.SanitizePipe = SanitizePipe;
exports.SanitizePipe = SanitizePipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], SanitizePipe);
//# sourceMappingURL=sanitize.pipe.js.map