"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRecordComplianceController = exports.HealthRecordController = void 0;
const openapi = require("@nestjs/swagger");
var health_record_crud_controller_1 = require("./controllers/health-record-crud.controller");
Object.defineProperty(exports, "HealthRecordController", { enumerable: true, get: function () { return health_record_crud_controller_1.HealthRecordCrudController; } });
var health_record_compliance_controller_1 = require("./controllers/health-record-compliance.controller");
Object.defineProperty(exports, "HealthRecordComplianceController", { enumerable: true, get: function () { return health_record_compliance_controller_1.HealthRecordComplianceController; } });
//# sourceMappingURL=health-record.controller.js.map