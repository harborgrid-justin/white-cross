"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAPISecurityHeaders = applyAPISecurityHeaders;
exports.applyDownloadSecurityHeaders = applyDownloadSecurityHeaders;
exports.auditSecurityHeaders = auditSecurityHeaders;
const logger_1 = require("../logging/logger");
function applyAPISecurityHeaders(response) {
    response.header('X-Content-Type-Options', 'nosniff');
    response.header('X-Frame-Options', 'DENY');
    response.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.header('Cache-Control', 'no-store');
    response.header('Pragma', 'no-cache');
}
function applyDownloadSecurityHeaders(response, filename, contentType) {
    response.header('X-Content-Type-Options', 'nosniff');
    response.header('X-Frame-Options', 'DENY');
    response.header('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    response.header('Content-Type', contentType);
    response.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.header('Pragma', 'no-cache');
    response.header('Expires', '0');
}
async function auditSecurityHeaders(response, path) {
    const requiredHeaders = [
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'Content-Security-Policy',
        'Referrer-Policy',
    ];
    const missingHeaders = requiredHeaders.filter((header) => !response.headers[header.toLowerCase()]);
    if (missingHeaders.length > 0) {
        logger_1.logger.warn('Missing security headers', {
            path,
            missingHeaders,
            statusCode: response.statusCode,
        });
    }
}
exports.default = {
    applyAPISecurityHeaders,
    applyDownloadSecurityHeaders,
    auditSecurityHeaders,
};
//# sourceMappingURL=headers.js.map