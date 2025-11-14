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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreatDetectionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../database/models");
const base_1 = require("../../../common/base");
let ThreatDetectionService = class ThreatDetectionService extends base_1.BaseService {
    loginAttemptModel;
    BRUTE_FORCE_THRESHOLD = 5;
    BRUTE_FORCE_WINDOW = 300000;
    constructor(loginAttemptModel) {
        super("ThreatDetectionService");
        this.loginAttemptModel = loginAttemptModel;
    }
    async detectBruteForce(userId, ipAddress) {
        try {
            const windowStart = new Date(Date.now() - this.BRUTE_FORCE_WINDOW);
            const recentFailures = await this.loginAttemptModel.count({
                where: {
                    ipAddress,
                    success: false,
                    createdAt: {
                        [sequelize_2.Op.gt]: windowStart,
                    },
                },
            });
            if (recentFailures >= this.BRUTE_FORCE_THRESHOLD) {
                this.logWarning('Brute force attack detected', {
                    ipAddress,
                    userId,
                    failureCount: recentFailures,
                });
                return {
                    detected: true,
                    failureCount: recentFailures,
                };
            }
            return { detected: false };
        }
        catch (error) {
            this.logError('Error detecting brute force', {
                error,
                userId,
                ipAddress,
            });
            return { detected: false };
        }
    }
    detectSQLInjection(input, context) {
        try {
            const sqlPatterns = [
                { pattern: /(\bunion\b.*\bselect\b)/i, name: 'UNION SELECT' },
                { pattern: /(\bor\b.*=.*)/i, name: 'OR condition' },
                { pattern: /(';|";|--|\/\*|\*\/)/, name: 'SQL comment/terminator' },
                {
                    pattern: /(\bdrop\b|\bdelete\b|\btruncate\b).*\btable\b/i,
                    name: 'DROP/DELETE TABLE',
                },
                { pattern: /(\bexec\b|\bexecute\b).*\(/i, name: 'EXEC statement' },
                {
                    pattern: /(\bselect\b.*\bfrom\b.*\bwhere\b)/i,
                    name: 'SELECT statement',
                },
            ];
            const matchedPatterns = [];
            for (const { pattern, name } of sqlPatterns) {
                if (pattern.test(input)) {
                    matchedPatterns.push(name);
                }
            }
            if (matchedPatterns.length > 0) {
                this.logWarning('SQL injection attempt detected', {
                    ...context,
                    patterns: matchedPatterns,
                    input: input.substring(0, 200),
                });
                return {
                    detected: true,
                    patterns: matchedPatterns,
                };
            }
            return { detected: false };
        }
        catch (error) {
            this.logError('Error detecting SQL injection', { error });
            return { detected: false };
        }
    }
    detectXSS(input, context) {
        try {
            const xssPatterns = [
                { pattern: /<script\b[^>]*>/i, name: 'Script tag' },
                { pattern: /javascript:/i, name: 'JavaScript protocol' },
                { pattern: /on\w+\s*=\s*['"]/i, name: 'Event handler' },
                { pattern: /<iframe\b[^>]*>/i, name: 'Iframe tag' },
                { pattern: /<embed\b[^>]*>/i, name: 'Embed tag' },
                { pattern: /<object\b[^>]*>/i, name: 'Object tag' },
            ];
            const matchedPatterns = [];
            for (const { pattern, name } of xssPatterns) {
                if (pattern.test(input)) {
                    matchedPatterns.push(name);
                }
            }
            if (matchedPatterns.length > 0) {
                this.logWarning('XSS attempt detected', {
                    ...context,
                    patterns: matchedPatterns,
                    input: input.substring(0, 200),
                });
                return {
                    detected: true,
                    patterns: matchedPatterns,
                };
            }
            return { detected: false };
        }
        catch (error) {
            this.logError('Error detecting XSS', { error });
            return { detected: false };
        }
    }
    detectPrivilegeEscalation(userId, attemptedAction, requiredRole, userRoles) {
        try {
            const hasRequiredRole = userRoles.includes(requiredRole);
            if (!hasRequiredRole) {
                this.logWarning('Privilege escalation attempt detected', {
                    userId,
                    attemptedAction,
                    requiredRole,
                    userRoles,
                });
                return {
                    detected: true,
                    reason: `User lacks required role: ${requiredRole}`,
                };
            }
            return { detected: false };
        }
        catch (error) {
            this.logError('Error detecting privilege escalation', {
                error,
                userId,
            });
            return { detected: false };
        }
    }
    detectDataBreachAttempt(userId, dataType, volume, ipAddress) {
        try {
            const thresholds = {
                patient_records: 100,
                user_data: 500,
                financial_data: 50,
                default: 1000,
            };
            const threshold = thresholds[dataType] ?? thresholds.default;
            if (volume > threshold) {
                this.logWarning('Potential data breach attempt detected', {
                    userId,
                    ipAddress,
                    dataType,
                    volume,
                    threshold,
                });
                return {
                    detected: true,
                    threshold,
                };
            }
            return { detected: false };
        }
        catch (error) {
            this.logError('Error detecting data breach attempt', {
                error,
                userId,
            });
            return { detected: false };
        }
    }
    detectPathTraversal(input, context) {
        try {
            const pathTraversalPatterns = [/\.\.\//, /\.\.\\/, /%2e%2e%2f/i, /%2e%2e\\/i];
            const detected = pathTraversalPatterns.some((pattern) => pattern.test(input));
            if (detected) {
                this.logWarning('Path traversal attempt detected', {
                    ...context,
                    input: input.substring(0, 200),
                });
                return { detected: true };
            }
            return { detected: false };
        }
        catch (error) {
            this.logError('Error detecting path traversal', { error });
            return { detected: false };
        }
    }
    detectCommandInjection(input, context) {
        try {
            const commandPatterns = [
                {
                    pattern: /;.*\b(rm|del|format|shutdown)\b/i,
                    name: 'Dangerous command',
                },
                { pattern: /\|.*\b(cat|type|more|less)\b/i, name: 'Command piping' },
                { pattern: /`.*`/, name: 'Command substitution' },
                { pattern: /\$\(.*\)/, name: 'Command substitution' },
                { pattern: /&&|;;\|/, name: 'Command chaining' },
            ];
            const matchedPatterns = [];
            for (const { pattern, name } of commandPatterns) {
                if (pattern.test(input)) {
                    matchedPatterns.push(name);
                }
            }
            if (matchedPatterns.length > 0) {
                this.logWarning('Command injection attempt detected', {
                    ...context,
                    patterns: matchedPatterns,
                    input: input.substring(0, 200),
                });
                return {
                    detected: true,
                    patterns: matchedPatterns,
                };
            }
            return { detected: false };
        }
        catch (error) {
            this.logError('Error detecting command injection', { error });
            return { detected: false };
        }
    }
    scanInput(input, context) {
        const threats = [];
        const sqlResult = this.detectSQLInjection(input, context);
        threats.push({
            type: 'sql_injection',
            detected: sqlResult.detected,
            details: sqlResult.patterns,
        });
        const xssResult = this.detectXSS(input, context);
        threats.push({
            type: 'xss',
            detected: xssResult.detected,
            details: xssResult.patterns,
        });
        const pathResult = this.detectPathTraversal(input, context);
        threats.push({
            type: 'path_traversal',
            detected: pathResult.detected,
        });
        const cmdResult = this.detectCommandInjection(input, context);
        threats.push({
            type: 'command_injection',
            detected: cmdResult.detected,
            details: cmdResult.patterns,
        });
        const safe = !threats.some((t) => t.detected);
        return { threats, safe };
    }
    async recordLoginAttempt(data) {
        try {
            const attempt = await this.loginAttemptModel.create(data);
            return attempt;
        }
        catch (error) {
            this.logError('Error recording login attempt', { error });
            throw error;
        }
    }
    async getRecentFailedAttempts(ipAddress, windowMs = this.BRUTE_FORCE_WINDOW) {
        try {
            const windowStart = new Date(Date.now() - windowMs);
            return await this.loginAttemptModel.findAll({
                where: {
                    ipAddress,
                    success: false,
                    createdAt: {
                        [sequelize_2.Op.gt]: windowStart,
                    },
                },
                order: [['createdAt', 'DESC']],
            });
        }
        catch (error) {
            this.logError('Error fetching failed attempts', { error, ipAddress });
            return [];
        }
    }
};
exports.ThreatDetectionService = ThreatDetectionService;
exports.ThreatDetectionService = ThreatDetectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.LoginAttempt)),
    __metadata("design:paramtypes", [Object])
], ThreatDetectionService);
//# sourceMappingURL=threat-detection.service.js.map