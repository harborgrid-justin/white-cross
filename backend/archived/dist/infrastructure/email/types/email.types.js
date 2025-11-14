"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplate = exports.EmailPriority = void 0;
var EmailPriority;
(function (EmailPriority) {
    EmailPriority["URGENT"] = "urgent";
    EmailPriority["HIGH"] = "high";
    EmailPriority["NORMAL"] = "normal";
    EmailPriority["LOW"] = "low";
})(EmailPriority || (exports.EmailPriority = EmailPriority = {}));
var EmailTemplate;
(function (EmailTemplate) {
    EmailTemplate["WELCOME"] = "welcome";
    EmailTemplate["PASSWORD_RESET"] = "password-reset";
    EmailTemplate["ALERT"] = "alert";
    EmailTemplate["NOTIFICATION"] = "notification";
    EmailTemplate["REPORT"] = "report";
})(EmailTemplate || (exports.EmailTemplate = EmailTemplate = {}));
//# sourceMappingURL=email.types.js.map