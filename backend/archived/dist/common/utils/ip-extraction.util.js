"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpExtractionUtil = void 0;
const common_1 = require("@nestjs/common");
class IpExtractionUtil {
    static logger = new common_1.Logger(IpExtractionUtil.name);
    static extractIpAddress(request) {
        const forwardedFor = request.headers['x-forwarded-for'];
        if (forwardedFor) {
            const ips = (typeof forwardedFor === 'string' ? forwardedFor : forwardedFor[0])
                .split(',')
                .map((ip) => ip.trim());
            if (ips.length > 0 && this.isValidIp(ips[0])) {
                return ips[0];
            }
        }
        const realIp = request.headers['x-real-ip'];
        if (realIp) {
            const ip = typeof realIp === 'string' ? realIp : realIp[0];
            if (this.isValidIp(ip)) {
                return ip;
            }
        }
        const connectionIp = request.ip ||
            request.socket?.remoteAddress ||
            request.connection?.remoteAddress;
        if (connectionIp && this.isValidIp(connectionIp)) {
            return connectionIp;
        }
        this.logger.warn('Unable to determine client IP address', {
            headers: {
                'x-forwarded-for': forwardedFor,
                'x-real-ip': realIp,
            },
            connectionIp,
        });
        return 'unknown';
    }
    static extractIpAddressWithMetadata(request) {
        const forwardedFor = request.headers['x-forwarded-for'];
        if (forwardedFor) {
            const ips = (typeof forwardedFor === 'string' ? forwardedFor : forwardedFor[0])
                .split(',')
                .map((ip) => ip.trim());
            if (ips.length > 0 && this.isValidIp(ips[0])) {
                return {
                    ip: ips[0],
                    source: 'x-forwarded-for',
                    proxied: true,
                };
            }
        }
        const realIp = request.headers['x-real-ip'];
        if (realIp) {
            const ip = typeof realIp === 'string' ? realIp : realIp[0];
            if (this.isValidIp(ip)) {
                return {
                    ip,
                    source: 'x-real-ip',
                    proxied: true,
                };
            }
        }
        const connectionIp = request.ip ||
            request.socket?.remoteAddress ||
            request.connection?.remoteAddress;
        if (connectionIp && this.isValidIp(connectionIp)) {
            return {
                ip: connectionIp,
                source: 'direct',
                proxied: false,
            };
        }
        return {
            ip: 'unknown',
            source: 'unknown',
            proxied: false,
        };
    }
    static isValidIp(ip) {
        if (!ip || ip === 'unknown') {
            return false;
        }
        const cleanIp = ip.replace(/^::ffff:/, '');
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^::1$|^fe80::/;
        return ipv4Regex.test(cleanIp) || ipv6Regex.test(ip);
    }
    static isPrivateIp(ip) {
        if (!ip || ip === 'unknown') {
            return false;
        }
        const parts = ip.split('.').map(Number);
        if (parts.length !== 4) {
            return false;
        }
        if (parts[0] === 10) {
            return true;
        }
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
            return true;
        }
        if (parts[0] === 192 && parts[1] === 168) {
            return true;
        }
        if (parts[0] === 127) {
            return true;
        }
        return false;
    }
    static anonymizeIp(ip, keepOctets = 2) {
        if (!ip || ip === 'unknown') {
            return 'unknown';
        }
        const parts = ip.split('.');
        if (parts.length !== 4) {
            return ip;
        }
        const anonymized = parts.map((part, index) => index < keepOctets ? part : 'xxx');
        return anonymized.join('.');
    }
}
exports.IpExtractionUtil = IpExtractionUtil;
//# sourceMappingURL=ip-extraction.util.js.map