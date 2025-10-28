/**
 * Security Context Interface
 * Contains security-relevant information for request processing
 */
export interface SecurityContext {
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  requestPath: string;
  requestMethod: string;
  timestamp: Date;
  sessionId?: string;
}
