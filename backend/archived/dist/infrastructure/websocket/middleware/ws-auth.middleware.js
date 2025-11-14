"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWsAuthMiddleware = createWsAuthMiddleware;
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('WsAuthMiddleware');
function createWsAuthMiddleware(jwtService, configService) {
    return async (socket, next) => {
        try {
            const token = extractToken(socket);
            if (!token) {
                logger.warn(`Connection rejected: No token provided (socket: ${socket.id})`);
                return next(new Error('Authentication token required'));
            }
            const secret = configService.get('JWT_SECRET');
            if (!secret) {
                logger.error('JWT_SECRET not configured');
                return next(new Error('Server configuration error'));
            }
            const payload = jwtService.verify(token, { secret });
            socket.user = mapToAuthPayload(payload);
            logger.log(`Socket authenticated: ${socket.id} (user: ${socket.user?.userId})`);
            next();
        }
        catch (error) {
            logger.warn(`Authentication failed for socket ${socket.id}: ${error.message}`);
            next(new Error('Invalid authentication token'));
        }
    };
}
function extractToken(socket) {
    const authToken = socket.handshake.auth?.token;
    if (authToken) {
        return authToken;
    }
    const authHeader = socket.handshake.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    const queryToken = socket.handshake.query?.token;
    if (typeof queryToken === 'string') {
        return queryToken;
    }
    return null;
}
function mapToAuthPayload(payload) {
    return {
        userId: payload.sub || payload.userId || payload.id,
        organizationId: payload.organizationId || payload.schoolId || payload.districtId || '',
        role: payload.role || 'user',
        email: payload.email || '',
    };
}
//# sourceMappingURL=ws-auth.middleware.js.map