"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStudentCreatedPayload = isStudentCreatedPayload;
exports.isStudentUpdatedPayload = isStudentUpdatedPayload;
exports.isHealthRecordUpdatedPayload = isHealthRecordUpdatedPayload;
function isStudentCreatedPayload(payload) {
    return 'student' in payload && 'sisId' in payload.student;
}
function isStudentUpdatedPayload(payload) {
    return ('student' in payload &&
        'changes' in payload.student);
}
function isHealthRecordUpdatedPayload(payload) {
    return 'healthRecord' in payload;
}
//# sourceMappingURL=webhook.types.js.map