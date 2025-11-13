/**
 * Security Incident Types
 * Defines all types of security incidents that can be detected and tracked
 */
export enum SecurityIncidentType {
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  BRUTE_FORCE_ATTACK = 'brute_force_attack',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  DATA_BREACH_ATTEMPT = 'data_breach_attempt',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  SQL_INJECTION_ATTEMPT = 'sql_injection_attempt',
  XSS_ATTEMPT = 'xss_attempt',
  ACCOUNT_TAKEOVER = 'account_takeover',
  MALWARE_DETECTED = 'malware_detected',
  DDOS_ATTEMPT = 'ddos_attempt',
  POLICY_VIOLATION = 'policy_violation',
  OTHER = 'other',
}
