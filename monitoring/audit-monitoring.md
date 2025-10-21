# Audit Log Monitoring - HIPAA Compliance Guide

## Overview

This document outlines the audit log monitoring requirements and procedures for the White Cross healthcare platform to ensure HIPAA compliance and maintain comprehensive audit trails for all Protected Health Information (PHI) access and modifications.

## HIPAA Requirements

### §164.312(b) - Audit Controls

HIPAA Security Rule requires:
- **Audit Controls**: Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.

### §164.308(a)(1)(ii)(D) - Information System Activity Review

- Regular review of information system activity
- Audit logs must be maintained and reviewed
- Security incidents must be tracked and documented

### Retention Requirements

- **Minimum Retention**: 7 years (HIPAA requirement: 6 years)
- **Access Logs**: All PHI access must be logged
- **Modification Logs**: All PHI changes must be tracked
- **Deletion Logs**: All PHI deletions must be audited

## Critical Audit Events

### 1. PHI Access Events

All access to Protected Health Information must be logged:

```typescript
{
  eventType: "PHI_ACCESS",
  resource: "student_health_record",
  resourceId: "[ANONYMIZED]",
  action: "READ",
  userId: "[ANONYMIZED]",
  timestamp: "2025-10-21T10:30:00.000Z",
  ipAddress: "[REDACTED]",
  userAgent: "Mozilla/5.0...",
  result: "SUCCESS",
  metadata: {
    fieldsAccessed: ["allergies", "medications", "vaccinations"],
    accessReason: "routine_checkup"
  }
}
```

**Required Fields:**
- Who accessed (user ID - anonymized)
- What was accessed (resource type and ID)
- When it was accessed (timestamp)
- From where (IP address - hashed)
- Why it was accessed (business justification)
- Result (success/failure)

### 2. PHI Modification Events

All changes to PHI must be audited:

```typescript
{
  eventType: "PHI_MODIFY",
  resource: "student_health_record",
  resourceId: "[ANONYMIZED]",
  action: "UPDATE",
  userId: "[ANONYMIZED]",
  timestamp: "2025-10-21T10:35:00.000Z",
  result: "SUCCESS",
  metadata: {
    fieldsModified: ["allergy_list"],
    previousValue: "[ENCRYPTED_HASH]",
    newValue: "[ENCRYPTED_HASH]",
    changeReason: "new_allergy_discovered"
  }
}
```

### 3. PHI Export/Transmission Events

Data exports require special logging:

```typescript
{
  eventType: "PHI_EXPORT",
  resource: "student_health_records",
  action: "BULK_EXPORT",
  userId: "[ANONYMIZED]",
  timestamp: "2025-10-21T11:00:00.000Z",
  result: "SUCCESS",
  metadata: {
    recordCount: 150,
    exportFormat: "PDF",
    recipient: "[ANONYMIZED]",
    businessJustification: "state_reporting_requirement",
    approvalId: "[REFERENCE_ID]"
  }
}
```

### 4. Authentication Events

```typescript
{
  eventType: "AUTH_EVENT",
  action: "LOGIN",
  userId: "[ANONYMIZED]",
  timestamp: "2025-10-21T09:00:00.000Z",
  result: "SUCCESS",
  metadata: {
    authMethod: "username_password",
    mfaUsed: true,
    ipAddress: "[HASHED]",
    sessionId: "[ANONYMIZED]"
  }
}
```

### 5. Authorization Events

```typescript
{
  eventType: "AUTHORIZATION",
  action: "ACCESS_DENIED",
  userId: "[ANONYMIZED]",
  resource: "student_health_record",
  timestamp: "2025-10-21T10:15:00.000Z",
  result: "DENIED",
  metadata: {
    requiredPermission: "VIEW_PHI",
    userPermissions: ["VIEW_BASIC_INFO"],
    denialReason: "insufficient_permissions"
  }
}
```

## Monitoring Checks

### 1. Completeness Checks

**All PHI Access Logged:**
```sql
-- Check that all API requests to PHI endpoints have corresponding audit logs
SELECT
  COUNT(*) as unlogged_requests
FROM api_requests
WHERE endpoint LIKE '%health%' OR endpoint LIKE '%student%'
  AND request_id NOT IN (SELECT request_id FROM audit_logs)
  AND timestamp > NOW() - INTERVAL '1 hour';
```

**Alert Condition**: `unlogged_requests > 0`
**Severity**: CRITICAL
**Action**: Immediate investigation required

### 2. Audit Log Integrity

**No Missing Sequence Numbers:**
```typescript
// Verify audit log sequence continuity
const gaps = await db.query(`
  SELECT
    sequence_number,
    LAG(sequence_number) OVER (ORDER BY sequence_number) as prev_seq
  FROM audit_logs
  WHERE timestamp > NOW() - INTERVAL '24 hours'
  HAVING sequence_number != prev_seq + 1
`);

if (gaps.length > 0) {
  alert('CRITICAL: Audit log sequence gap detected');
}
```

**Alert Condition**: `gaps > 0`
**Severity**: CRITICAL
**Action**: Investigate potential data loss or tampering

### 3. Audit Logging Performance

**Success Rate:**
```typescript
const successRate =
  audit_events_logged / (audit_events_logged + audit_events_failed);

if (successRate < 0.999) {
  alert('Audit logging success rate below 99.9%');
}
```

**Alert Condition**: `successRate < 0.999`
**Severity**: CRITICAL
**Action**: Fix audit service immediately

**Queue Depth:**
```typescript
if (audit_queue_depth > 1000) {
  alert('Audit queue backing up - potential data loss risk');
}
```

### 4. Suspicious Activity Detection

**Multiple Failed Access Attempts:**
```sql
SELECT
  user_id,
  COUNT(*) as failed_attempts
FROM audit_logs
WHERE event_type = 'AUTHORIZATION'
  AND result = 'DENIED'
  AND timestamp > NOW() - INTERVAL '5 minutes'
GROUP BY user_id
HAVING COUNT(*) > 5;
```

**Unusual Access Patterns:**
```sql
-- Detect access outside normal hours
SELECT
  user_id,
  COUNT(*) as after_hours_access
FROM audit_logs
WHERE event_type = 'PHI_ACCESS'
  AND EXTRACT(HOUR FROM timestamp) NOT BETWEEN 6 AND 20
  AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY user_id
HAVING COUNT(*) > 10;
```

**Bulk Data Access:**
```sql
-- Detect potential data exfiltration
SELECT
  user_id,
  COUNT(DISTINCT resource_id) as unique_records_accessed
FROM audit_logs
WHERE event_type = 'PHI_ACCESS'
  AND timestamp > NOW() - INTERVAL '1 hour'
GROUP BY user_id
HAVING COUNT(DISTINCT resource_id) > 100;
```

## Daily Monitoring Procedures

### Morning Health Check (9:00 AM)

1. **Review overnight audit metrics:**
   ```bash
   # Check audit logging success rate
   curl https://monitoring.whitecross.com/api/metrics/audit/success_rate?range=12h

   # Check for any audit failures
   curl https://monitoring.whitecross.com/api/metrics/audit/failures?range=12h
   ```

2. **Verify no gaps in audit logs:**
   ```sql
   SELECT MIN(timestamp), MAX(timestamp), COUNT(*)
   FROM audit_logs
   WHERE timestamp > NOW() - INTERVAL '24 hours';
   ```

3. **Review security events:**
   ```bash
   # Check for suspicious activity
   curl https://monitoring.whitecross.com/api/audit/suspicious?range=24h
   ```

### Real-time Monitoring

**Dashboard Widgets to Monitor:**

1. **Audit Logging Success Rate** (Target: >99.9%)
2. **Audit Queue Depth** (Alert if >1000)
3. **Failed Audit Events** (Alert if >0)
4. **PHI Access Rate** (Track baseline)
5. **Authorization Denials** (Monitor for spikes)

### Weekly Reports

**Generate weekly audit report:**
```typescript
const weeklyReport = {
  totalEvents: count(audit_logs),
  phiAccessCount: count(audit_logs WHERE event_type = 'PHI_ACCESS'),
  phiModifications: count(audit_logs WHERE event_type = 'PHI_MODIFY'),
  phiExports: count(audit_logs WHERE event_type = 'PHI_EXPORT'),
  authenticationEvents: count(audit_logs WHERE event_type = 'AUTH_EVENT'),
  failedAccessAttempts: count(audit_logs WHERE result = 'FAILURE' OR result = 'DENIED'),
  uniqueUsers: countDistinct(user_id),
  topAccessedResources: topN(resource, 10),
  suspiciousActivityFlags: count(suspicious_activity_logs)
};
```

## Compliance Audit Preparation

### Monthly Compliance Check

1. **Verify all PHI access is logged:**
   - Cross-reference API logs with audit logs
   - Ensure 100% coverage

2. **Check retention compliance:**
   - Verify logs older than 7 years are archived
   - Ensure no premature deletion

3. **Test audit log integrity:**
   - Verify cryptographic hashes
   - Check for sequence gaps

4. **Review access patterns:**
   - Identify anomalies
   - Investigate unusual access

### Annual HIPAA Audit

**Prepare documentation:**

1. **Audit Controls Documentation:**
   - System architecture diagrams
   - Audit logging procedures
   - Monitoring dashboards

2. **Access Reports:**
   - Annual PHI access summary
   - User access patterns
   - Authorization denial reports

3. **Incident Reports:**
   - Security incidents
   - Audit failures and resolution
   - Suspicious activity investigations

4. **Compliance Metrics:**
   - Audit logging uptime: >99.9%
   - PHI access coverage: 100%
   - Retention compliance: 100%

## Alert Response Procedures

### CRITICAL: Audit Logging Failure

**Alert:** `audit_events_failed > 0`

**Immediate Actions:**
1. Page on-call engineer
2. Check AuditService status
3. Review error logs
4. Verify database connectivity
5. Check queue capacity

**Recovery Steps:**
1. Restart audit service if needed
2. Verify failed events are retried
3. Confirm all events eventually logged
4. Document incident
5. Update runbook if new issue

### CRITICAL: Missing PHI Access Logs

**Alert:** `phi_access_requests > 0 AND phi_access_logs == 0`

**Immediate Actions:**
1. STOP all PHI operations immediately
2. Page security team and compliance officer
3. Investigate audit service failure
4. Document all PHI access during outage
5. Manual audit log creation may be required

**This is a HIPAA compliance incident and must be reported.**

### WARNING: High Audit Queue Depth

**Alert:** `audit_queue_depth > 1000`

**Actions:**
1. Check audit service performance
2. Review database write capacity
3. Increase flush frequency if safe
4. Monitor for queue growth
5. Scale resources if needed

## Metrics to Track

### Key Performance Indicators (KPIs)

1. **Audit Logging Success Rate**: >99.9%
2. **Average Audit Latency**: <100ms
3. **Queue Depth**: <500 (normal), <1000 (acceptable)
4. **Events Logged per Day**: Track baseline
5. **PHI Access Coverage**: 100%

### Compliance Metrics

1. **Days Since Last Audit Failure**: Maximize
2. **Audit Log Retention Age**: >7 years
3. **Suspicious Activity Detection Rate**: Track
4. **Access Pattern Anomalies**: Track
5. **Compliance Audit Findings**: 0

## Tools and Resources

### Monitoring Dashboards

- **Audit Dashboard**: `https://monitoring.whitecross.com/dashboards/audit`
- **Security Dashboard**: `https://monitoring.whitecross.com/dashboards/security`
- **Compliance Dashboard**: `https://monitoring.whitecross.com/dashboards/compliance`

### Alert Channels

- **Critical Alerts**: PagerDuty + Email + Slack
- **Warning Alerts**: Slack + Email
- **Info Alerts**: Slack only

### Runbooks

- **Audit Service Failure**: `https://docs.whitecross.com/runbooks/audit-failure`
- **Missing Audit Logs**: `https://docs.whitecross.com/runbooks/missing-logs`
- **Suspicious Activity**: `https://docs.whitecross.com/runbooks/suspicious-activity`

## Contact Information

- **Security Team**: security@whitecross.com
- **Compliance Officer**: compliance@whitecross.com
- **On-Call Engineer**: Use PagerDuty
- **HIPAA Hotline**: 1-800-XXX-XXXX

## References

- HIPAA Security Rule §164.312(b)
- HIPAA Security Rule §164.308(a)(1)(ii)(D)
- White Cross Security Policy
- Audit Logging Implementation Guide
- Incident Response Procedures

---

**Last Updated**: 2025-10-21
**Review Frequency**: Quarterly
**Next Review**: 2026-01-21
**Owner**: Security & Compliance Team
