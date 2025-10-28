/**
 * Interface for security statistics
 */
export interface SecurityStatistics {
  incidents: {
    total: number;
    open: number;
    critical: number;
  };
  authentication: {
    recentFailedLogins: number;
    activeSessions: number;
  };
  ipRestrictions: number;
}
