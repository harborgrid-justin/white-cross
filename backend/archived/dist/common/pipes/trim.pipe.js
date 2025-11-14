"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrimPipe = void 0;
const common_1 = require("@nestjs/common");
let TrimPipe = class TrimPipe {
    transform(value) {
        return this.trim(value);
    }
    trim(value) {
        if (value === null || value === undefined) {
            return value;
        }
        if (typeof value === 'string') {
            return value.trim();
        }
        if (Array.isArray(value)) {
            return value.map((item) => this.trim(item));
        }
        if (typeof value === 'object') {
            const trimmedObject = {};
            for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    trimmedObject[key] = this.trim(value[key]);
                }
            }
            return trimmedObject;
        }
        return value;
    }
};
exports.TrimPipe = TrimPipe;
exports.TrimPipe = TrimPipe = __decorate([
    (0, common_1.Injectable)()
], TrimPipe);
//# sourceMappingURL=trim.pipe.js.map