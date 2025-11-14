"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponse = exports.PaginationInfo = exports.PaginationDto = void 0;
const openapi = require("@nestjs/swagger");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
Object.defineProperty(exports, "PaginationDto", { enumerable: true, get: function () { return pagination_dto_1.PaginationDto; } });
class PaginationInfo {
    page;
    limit;
    total;
    pages;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, total: { required: true, type: () => Number }, pages: { required: true, type: () => Number } };
    }
}
exports.PaginationInfo = PaginationInfo;
class PaginatedResponse {
    records;
    items;
    data;
    pagination;
    static _OPENAPI_METADATA_FACTORY() {
        return { records: { required: false }, items: { required: false }, data: { required: false }, pagination: { required: true, type: () => require("./pagination.dto").PaginationInfo } };
    }
}
exports.PaginatedResponse = PaginatedResponse;
//# sourceMappingURL=pagination.dto.js.map