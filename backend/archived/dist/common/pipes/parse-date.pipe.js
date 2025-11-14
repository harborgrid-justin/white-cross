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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseDatePipe = void 0;
const common_1 = require("@nestjs/common");
let ParseDatePipe = class ParseDatePipe {
    options;
    constructor(options) {
        this.options = options;
    }
    transform(value) {
        if (this.options?.optional &&
            (value === null || value === undefined || value === '')) {
            return new Date();
        }
        if (value === null || value === undefined || value === '') {
            throw new common_1.BadRequestException(this.options?.errorMessage || 'Date is required');
        }
        const date = this.parseDate(value);
        if (!this.isValidDate(date)) {
            throw new common_1.BadRequestException(this.options?.errorMessage || `Invalid date format: ${value}`);
        }
        if (this.options?.min && date < this.options.min) {
            throw new common_1.BadRequestException(`Date must be on or after ${this.options.min.toISOString()}`);
        }
        if (this.options?.max && date > this.options.max) {
            throw new common_1.BadRequestException(`Date must be on or before ${this.options.max.toISOString()}`);
        }
        return date;
    }
    parseDate(value) {
        if (typeof value === 'number') {
            return new Date(value);
        }
        if (value.includes('T') || value.includes('Z')) {
            return new Date(value);
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return new Date(value + 'T00:00:00.000Z');
        }
        return new Date(value);
        throw new common_1.BadRequestException(`Cannot parse date from: ${typeof value}`);
    }
    isValidDate(date) {
        return !isNaN(date.getTime());
    }
};
exports.ParseDatePipe = ParseDatePipe;
exports.ParseDatePipe = ParseDatePipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], ParseDatePipe);
//# sourceMappingURL=parse-date.pipe.js.map