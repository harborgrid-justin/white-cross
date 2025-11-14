"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_CONFIGS = void 0;
exports.SESSION_CONFIGS = {
    healthcare: {
        sessionTimeout: 30 * 60 * 1000,
        warningTime: 5 * 60 * 1000,
        maxConcurrentSessions: 3,
        requireReauth: true,
        trackActivity: true,
        auditSessions: true,
    },
    admin: {
        sessionTimeout: 15 * 60 * 1000,
        warningTime: 2 * 60 * 1000,
        maxConcurrentSessions: 1,
        requireReauth: true,
        trackActivity: true,
        auditSessions: true,
    },
    emergency: {
        sessionTimeout: 60 * 60 * 1000,
        warningTime: 10 * 60 * 1000,
        maxConcurrentSessions: 1,
        requireReauth: false,
        trackActivity: true,
        auditSessions: true,
    },
    development: {
        sessionTimeout: 8 * 60 * 60 * 1000,
        warningTime: 30 * 60 * 1000,
        maxConcurrentSessions: 10,
        requireReauth: false,
        trackActivity: false,
        auditSessions: false,
    },
};
//# sourceMappingURL=session.types.js.map