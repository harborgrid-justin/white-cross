"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDScalar = exports.EmailAddressScalar = exports.PhoneNumberScalar = exports.DateTimeScalar = void 0;
var datetime_scalar_1 = require("./datetime.scalar");
Object.defineProperty(exports, "DateTimeScalar", { enumerable: true, get: function () { return datetime_scalar_1.DateTimeScalar; } });
var phone_number_scalar_1 = require("./phone-number.scalar");
Object.defineProperty(exports, "PhoneNumberScalar", { enumerable: true, get: function () { return phone_number_scalar_1.PhoneNumberScalar; } });
var email_address_scalar_1 = require("./email-address.scalar");
Object.defineProperty(exports, "EmailAddressScalar", { enumerable: true, get: function () { return email_address_scalar_1.EmailAddressScalar; } });
var uuid_scalar_1 = require("./uuid.scalar");
Object.defineProperty(exports, "UUIDScalar", { enumerable: true, get: function () { return uuid_scalar_1.UUIDScalar; } });
//# sourceMappingURL=index.js.map