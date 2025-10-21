# White Cross Healthcare Platform - Rollback Procedures

## Critical: HIPAA Compliance During Rollback

**⚠️ WARNING**: All rollback procedures must maintain HIPAA compliance and protect PHI at all times. No patient data may be lost or exposed during rollback operations.

---

## Table of Contents

1. [Rollback Decision Matrix](#rollback-decision-matrix)
2. [Immediate Response Procedures](#immediate-response-procedures)
3. [Application Rollback](#application-rollback)
4. [Database Rollback](#database-rollback)
5. [Infrastructure Rollback](#infrastructure-rollback)
6. [Data Consistency Verification](#data-consistency-verification)
7. [Communication During Rollback](#communication-during-rollback)
8. [Post-Rollback Procedures](#post-rollback-procedures)
9. [Rollback Scenarios](#rollback-scenarios)

---

## Rollback Decision Matrix

### Automatic Rollback Triggers

| Condition | Threshold | Action | Time to Decision |
|-----------|-----------|--------|------------------|
| Error Rate | >5% for 5 minutes | Automatic rollback | Immediate |
| Response Time | >1000ms p95 for 10 minutes | Alert + Manual decision | 15 minutes |
| Failed Health Checks | >50% endpoints failing | Automatic rollback | Immediate |
| Security Breach | Any confirmed breach | Immediate rollback | Immediate |
| Data Corruption | Any detected corruption | Immediate rollback | Immediate |
| Database Connection Failures | >25% connection errors | Automatic rollback | 5 minutes |
| Memory/CPU | >95% for 10 minutes | Manual decision | 15 minutes |

### Manual Rollback Criteria

| Severity | Criteria | Authority Required | Max Decision Time |
|----------|----------|-------------------|-------------------|
| Critical | Patient safety risk, data loss risk | CTO or VP Engineering | 5 minutes |
| High | Major feature broken, >20% users affected | Engineering Manager | 15 minutes |
| Medium | Non-critical features broken, <20% users affected | Tech Lead | 30 minutes |
| Low | Minor issues, cosmetic problems | Team consensus | 1 hour |

---

## Immediate Response Procedures

### Step 1: Incident Declaration (0-5 minutes)

```bash
# 1. Declare incident in PagerDuty
pagerduty-cli incident create --severity=critical --title="Production Deployment Rollback Required"

# 2. Open war room
slack-cli channel create #incident-$(date +%Y%m%d-%H%M) --topic "Deployment Rollback"

# 3. Page on-call team
./scripts/page-oncall.sh --severity=critical --team=platform
```

### Step 2: Initial Assessment (5-10 minutes)

**Checklist:**
- [ ] Identify the failure point
- [ ] Assess user impact
- [ ] Check data integrity
- [ ] Verify patient safety
- [ ] Document initial findings
- [ ] Make go/no-go decision for rollback

**Assessment Commands:**
```bash
# Check error rates
datadog-cli metrics query "avg:app.error_rate{env:prod}" --from=-30m

# Check response times
datadog-cli metrics query "p95:app.response_time{env:prod}" --from=-30m

# Verify database health
psql -h prod-db -c "SELECT pg_stat_activity();"

# Check active users
redis-cli -h prod-cache get active_users_count
```

### Step 3: Rollback Decision (10-15 minutes)

**Decision Tree:**
```
┌─────────────────┐
│ Critical Issue? │
└────────┬────────┘
         │
    ┌────▼────┐
    │   Yes   │──► Immediate Rollback
    └────┬────┘
         │ No
    ┌────▼────────────┐
    │ User Impact >5%? │
    └────────┬─────────┘
             │
        ┌────▼────┐
        │   Yes   │──► Rollback within 30 min
        └────┬────┘
             │ No
        ┌────▼──────────────┐
        │ Can fix forward?  │
        └────────┬──────────┘
                 │
            ┌────▼────┐
            │   Yes   │──► Hot fix
            └────┬────┘
                 │ No
            ┌────▼────┐
            │Rollback │
            └─────────┘
```

---

## Application Rollback

### Frontend Rollback Procedure

#### Blue-Green Deployment Rollback (Preferred)

```bash
#!/bin/bash
# Frontend Blue-Green Rollback Script

# 1. Verify green environment health
curl -f https://green.whitecross.health/health || exit 1

# 2. Switch load balancer to green (previous version)
aws elb modify-listener-rule \
  --rule-arn $FRONTEND_LB_RULE \
  --actions Type=forward,TargetGroupArn=$GREEN_TARGET_GROUP

# 3. Verify traffic switch
for i in {1..10}; do
  VERSION=$(curl -s https://app.whitecross.health/version)
  echo "Current version: $VERSION"
  sleep 3
done

# 4. Invalidate CDN cache
aws cloudfront create-invalidation \
  --distribution-id $CDN_DISTRIBUTION_ID \
  --paths "/*"

# 5. Monitor for 5 minutes
watch -n 5 'curl -s https://app.whitecross.health/health'
```

#### Container Rollback (Kubernetes)

```bash
#!/bin/bash
# Kubernetes Rollback Script

# 1. Check rollout history
kubectl rollout history deployment/frontend -n production

# 2. Rollback to previous version
kubectl rollback undo deployment/frontend -n production

# 3. Watch rollback progress
kubectl rollback status deployment/frontend -n production --watch

# 4. Verify pod health
kubectl get pods -n production -l app=frontend

# 5. Check application logs
kubectl logs -n production -l app=frontend --tail=100
```

### Backend Rollback Procedure

#### API Service Rollback

```bash
#!/bin/bash
# Backend API Rollback Script

# 1. Scale down new version
kubectl scale deployment/api-v2 --replicas=0 -n production

# 2. Scale up previous version
kubectl scale deployment/api-v1 --replicas=10 -n production

# 3. Verify health endpoints
for endpoint in auth health users students medications; do
  curl -f https://api.whitecross.health/v1/$endpoint/health || exit 1
done

# 4. Check database compatibility
psql -h prod-db -f scripts/verify-schema-compatibility.sql

# 5. Restart background workers with old version
kubectl delete pods -n production -l app=workers
```

#### Service Mesh Rollback (Istio)

```yaml
# traffic-rollback.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: api-rollback
spec:
  hosts:
  - api.whitecross.health
  http:
  - route:
    - destination:
        host: api
        subset: v1  # Previous version
      weight: 100   # 100% to old version
    - destination:
        host: api
        subset: v2  # New version
      weight: 0     # 0% to new version
```

```bash
# Apply traffic rollback
kubectl apply -f traffic-rollback.yaml -n production
```

---

## Database Rollback

### ⚠️ Critical: Data Loss Prevention

**NEVER perform database rollback without:**
1. Confirming no data loss will occur
2. Taking a full backup of current state
3. Approval from Database Administrator
4. Notifying Compliance Officer

### Migration Rollback

```bash
#!/bin/bash
# Database Migration Rollback

# 1. Stop application writes
kubectl scale deployment/api --replicas=0 -n production
redis-cli -h prod-cache SET maintenance_mode true

# 2. Backup current database state
pg_dump -h prod-db -d whitecross_prod \
  -f /backups/emergency/rollback_$(date +%Y%m%d_%H%M%S).sql

# 3. Identify migration to rollback
npx sequelize-cli db:migrate:status --env production

# 4. Execute rollback
npx sequelize-cli db:migrate:undo --env production

# 5. Verify schema state
psql -h prod-db -d whitecross_prod -f scripts/verify-schema.sql

# 6. Verify data integrity
psql -h prod-db -d whitecross_prod -f scripts/verify-data-integrity.sql

# 7. Re-enable application
kubectl scale deployment/api --replicas=10 -n production
redis-cli -h prod-cache SET maintenance_mode false
```

### Data Rollback Procedures

#### Point-in-Time Recovery

```bash
#!/bin/bash
# PostgreSQL Point-in-Time Recovery

RECOVERY_TIME="2025-01-21 14:30:00"

# 1. Stop all connections
psql -h prod-db -c "SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = 'whitecross_prod' AND pid <> pg_backend_pid();"

# 2. Initiate PITR
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier prod-db \
  --target-db-instance-identifier prod-db-recovered \
  --restore-time $RECOVERY_TIME

# 3. Wait for recovery
aws rds wait db-instance-available \
  --db-instance-identifier prod-db-recovered

# 4. Validate recovered data
psql -h prod-db-recovered -d whitecross_prod \
  -f scripts/validate-recovery.sql

# 5. Switch application to recovered instance
kubectl set env deployment/api \
  DATABASE_HOST=prod-db-recovered -n production
```

#### Selective Data Restoration

```sql
-- Restore specific tables from backup
BEGIN TRANSACTION;

-- 1. Create temporary schema
CREATE SCHEMA IF NOT EXISTS restore_temp;

-- 2. Restore tables to temp schema
\i /backups/emergency/partial_restore.sql

-- 3. Validate data
SELECT COUNT(*) FROM restore_temp.students;
SELECT COUNT(*) FROM restore_temp.health_records;

-- 4. Merge with production data
INSERT INTO production.students
SELECT * FROM restore_temp.students
ON CONFLICT (id) DO NOTHING;

-- 5. Verify and commit
SELECT COUNT(*) FROM production.students;
COMMIT;

-- 6. Cleanup
DROP SCHEMA restore_temp CASCADE;
```

---

## Infrastructure Rollback

### AWS Infrastructure Rollback

```bash
#!/bin/bash
# Terraform Infrastructure Rollback

# 1. Identify current state
cd infrastructure/terraform
terraform show -json > current_state.json

# 2. Retrieve previous state
aws s3 cp s3://terraform-state/prod/terraform.tfstate.backup ./

# 3. Plan rollback
terraform plan -state=terraform.tfstate.backup -out=rollback.plan

# 4. Apply rollback
terraform apply rollback.plan

# 5. Verify infrastructure
aws ec2 describe-instances --filters "Name=tag:Environment,Values=production"
aws rds describe-db-instances --db-instance-identifier prod-db
aws elasticache describe-cache-clusters
```

### Kubernetes Cluster Rollback

```bash
#!/bin/bash
# Kubernetes Cluster State Rollback

# 1. Export current state
kubectl get all --all-namespaces -o yaml > current_cluster_state.yaml

# 2. Apply previous cluster state
kubectl apply -f /backups/cluster/previous_state.yaml

# 3. Verify deployments
kubectl get deployments --all-namespaces

# 4. Check pod health
kubectl get pods --all-namespaces | grep -v Running

# 5. Validate services
kubectl get services --all-namespaces
```

### CDN and DNS Rollback

```bash
#!/bin/bash
# CDN Configuration Rollback

# 1. Revert CloudFront configuration
aws cloudfront get-distribution-config --id $DISTRIBUTION_ID > current_config.json

aws cloudfront update-distribution \
  --id $DISTRIBUTION_ID \
  --distribution-config file://previous_cdn_config.json \
  --if-match $ETAG

# 2. Clear CDN cache
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

# 3. Revert DNS if needed
aws route53 change-resource-record-sets \
  --hosted-zone-id $ZONE_ID \
  --change-batch file://dns_rollback.json
```

---

## Data Consistency Verification

### Post-Rollback Data Validation

```sql
-- Data Integrity Verification Script
BEGIN;

-- 1. Check for orphaned records
SELECT 'Orphaned health records' as check_type, COUNT(*)
FROM health_records hr
LEFT JOIN students s ON hr.student_id = s.id
WHERE s.id IS NULL;

-- 2. Verify referential integrity
SELECT 'Missing medications' as check_type, COUNT(*)
FROM medication_administrations ma
LEFT JOIN medications m ON ma.medication_id = m.id
WHERE m.id IS NULL;

-- 3. Check audit log continuity
SELECT 'Audit gaps' as check_type,
  MAX(created_at) - MIN(created_at) as time_gap
FROM audit_logs
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY DATE_TRUNC('minute', created_at)
HAVING MAX(created_at) - MIN(created_at) > INTERVAL '5 minutes';

-- 4. Verify encryption status
SELECT 'Unencrypted PHI' as check_type, COUNT(*)
FROM health_records
WHERE encrypted_data IS NULL;

-- 5. Check data timestamps
SELECT 'Future timestamps' as check_type, COUNT(*)
FROM (
  SELECT * FROM students WHERE created_at > NOW()
  UNION ALL
  SELECT * FROM health_records WHERE created_at > NOW()
  UNION ALL
  SELECT * FROM medications WHERE created_at > NOW()
) future_records;

COMMIT;
```

### Application State Verification

```javascript
// State Verification Script
async function verifyApplicationState() {
  const checks = {
    database: false,
    redis: false,
    authentication: false,
    api: false,
    websocket: false
  };

  // 1. Database connectivity
  try {
    const db = await sequelize.authenticate();
    checks.database = true;
  } catch (error) {
    console.error('Database check failed:', error);
  }

  // 2. Redis connectivity
  try {
    await redisClient.ping();
    checks.redis = true;
  } catch (error) {
    console.error('Redis check failed:', error);
  }

  // 3. Authentication service
  try {
    const response = await fetch('/api/auth/health');
    checks.authentication = response.ok;
  } catch (error) {
    console.error('Auth check failed:', error);
  }

  // 4. API endpoints
  const endpoints = ['/users', '/students', '/health-records'];
  const apiChecks = await Promise.all(
    endpoints.map(endpoint =>
      fetch(`/api${endpoint}/health`)
        .then(res => res.ok)
        .catch(() => false)
    )
  );
  checks.api = apiChecks.every(check => check);

  // 5. WebSocket connectivity
  try {
    const ws = new WebSocket('wss://api.whitecross.health/ws');
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
      setTimeout(reject, 5000);
    });
    checks.websocket = true;
    ws.close();
  } catch (error) {
    console.error('WebSocket check failed:', error);
  }

  return checks;
}
```

---

## Communication During Rollback

### Internal Communication Protocol

#### Immediate Notifications (0-5 minutes)

```bash
#!/bin/bash
# Emergency Notification Script

# 1. Slack notification
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "🚨 CRITICAL: Production rollback initiated",
    "attachments": [{
      "color": "danger",
      "fields": [
        {"title": "Environment", "value": "Production", "short": true},
        {"title": "Reason", "value": "'$ROLLBACK_REASON'", "short": true},
        {"title": "Initiated By", "value": "'$USER'", "short": true},
        {"title": "ETA", "value": "30 minutes", "short": true}
      ]
    }]
  }'

# 2. Email notification
sendmail -t <<EOF
To: platform-team@whitecross.health, executives@whitecross.health
Subject: URGENT: Production Rollback in Progress
Priority: Urgent

Production rollback initiated at $(date)
Reason: $ROLLBACK_REASON
Expected completion: $(date -d '+30 minutes')

War room: #incident-$(date +%Y%m%d-%H%M)
Status page: https://status.whitecross.health
EOF

# 3. PagerDuty notification
pagerduty-cli incident update $INCIDENT_ID \
  --status "rollback_initiated" \
  --note "Rollback started at $(date)"
```

#### Status Updates (Every 15 minutes)

**Update Template:**
```
ROLLBACK STATUS UPDATE - [TIME]

Current Status: [In Progress / Completed / Failed]
Phase: [Application / Database / Infrastructure]
Progress: [X]%

Completed:
✓ [Completed step 1]
✓ [Completed step 2]

In Progress:
▶ [Current step]

Next Steps:
- [Next step 1]
- [Next step 2]

Issues:
- [Any issues encountered]

ETA: [Updated ETA]

Questions: Contact [Contact Person] at [Phone/Slack]
```

### External Communication

#### Customer Notification

```html
<!-- Status Page Update -->
<div class="incident-update">
  <h3>Service Interruption - Emergency Maintenance</h3>
  <p class="timestamp">Posted: [TIMESTAMP]</p>

  <div class="status-indicator critical">
    Partial Outage
  </div>

  <p>We are currently performing emergency maintenance to address a critical issue.
     Some features may be temporarily unavailable.</p>

  <h4>Affected Services:</h4>
  <ul>
    <li>Health Records: Read-only mode</li>
    <li>Medication Management: Delayed updates</li>
    <li>Appointment Scheduling: Temporarily unavailable</li>
  </ul>

  <h4>Unaffected Services:</h4>
  <ul>
    <li>Emergency Contacts: Fully operational</li>
    <li>Student Information: Accessible</li>
    <li>Document Viewing: Available</li>
  </ul>

  <p><strong>Expected Resolution:</strong> [TIME]</p>
  <p><strong>Next Update:</strong> In 15 minutes</p>
</div>
```

---

## Post-Rollback Procedures

### Immediate Post-Rollback (First Hour)

```bash
#!/bin/bash
# Post-Rollback Verification Script

echo "=== POST-ROLLBACK VERIFICATION ==="

# 1. System health checks
echo "1. Checking system health..."
for service in api frontend database redis; do
  STATUS=$(curl -s https://monitor.whitecross.health/$service/health | jq -r .status)
  echo "  - $service: $STATUS"
done

# 2. Verify rollback completion
echo "2. Verifying versions..."
API_VERSION=$(curl -s https://api.whitecross.health/version | jq -r .version)
UI_VERSION=$(curl -s https://app.whitecross.health/version | jq -r .version)
echo "  - API Version: $API_VERSION"
echo "  - UI Version: $UI_VERSION"

# 3. Check error rates
echo "3. Checking error rates..."
ERROR_RATE=$(datadog-cli metrics query "avg:app.error_rate{env:prod}" --from=-10m | jq -r .value)
echo "  - Current error rate: $ERROR_RATE%"

# 4. Validate critical features
echo "4. Testing critical features..."
./scripts/smoke-tests.sh --critical-only

# 5. Check data consistency
echo "5. Verifying data consistency..."
psql -h prod-db -f scripts/post-rollback-data-check.sql

echo "=== VERIFICATION COMPLETE ==="
```

### Root Cause Analysis (Within 24 Hours)

**RCA Template:**

```markdown
# Rollback Post-Incident Review

## Incident Summary
- **Date/Time:** [TIMESTAMP]
- **Duration:** [DURATION]
- **Severity:** [Critical/High/Medium/Low]
- **Services Affected:** [List services]
- **Customer Impact:** [Number affected, functionality lost]

## Timeline
- **[TIME]** - Issue first detected
- **[TIME]** - Incident declared
- **[TIME]** - Rollback decision made
- **[TIME]** - Rollback initiated
- **[TIME]** - Rollback completed
- **[TIME]** - Services restored

## Root Cause
[Detailed explanation of what caused the issue]

## Contributing Factors
1. [Factor 1]
2. [Factor 2]
3. [Factor 3]

## Impact Assessment
- **Users Affected:** [Number]
- **Data Loss:** [Yes/No - Details]
- **Financial Impact:** [Estimated]
- **Compliance Impact:** [Any violations]
- **Reputation Impact:** [Assessment]

## What Went Well
- [Positive aspect 1]
- [Positive aspect 2]

## What Needs Improvement
- [Improvement area 1]
- [Improvement area 2]

## Action Items
| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
| | | | |

## Lessons Learned
1. [Lesson 1]
2. [Lesson 2]
```

### Remediation Planning

```yaml
# remediation-plan.yaml
remediationPlan:
  shortTerm: # Within 1 week
    - action: "Fix identified bug"
      owner: "Development Team"
      dueDate: "3 days"
    - action: "Add missing test coverage"
      owner: "QA Team"
      dueDate: "5 days"
    - action: "Update rollback procedures"
      owner: "DevOps Team"
      dueDate: "2 days"

  mediumTerm: # Within 1 month
    - action: "Implement additional monitoring"
      owner: "SRE Team"
      dueDate: "2 weeks"
    - action: "Enhance staging environment"
      owner: "Infrastructure Team"
      dueDate: "3 weeks"
    - action: "Improve deployment automation"
      owner: "DevOps Team"
      dueDate: "4 weeks"

  longTerm: # Within 3 months
    - action: "Architectural improvements"
      owner: "Architecture Team"
      dueDate: "2 months"
    - action: "Disaster recovery enhancements"
      owner: "Infrastructure Team"
      dueDate: "3 months"
```

---

## Rollback Scenarios

### Scenario 1: Critical Security Vulnerability

**Trigger:** Security breach detected during deployment

```bash
#!/bin/bash
# Security Breach Rollback

# 1. IMMEDIATE: Isolate affected systems
iptables -I INPUT -s 0.0.0.0/0 -j DROP
iptables -I OUTPUT -d 0.0.0.0/0 -j DROP
iptables -A INPUT -s 10.0.0.0/8 -j ACCEPT  # Allow internal only

# 2. Preserve evidence
dd if=/dev/vda of=/forensics/system_snapshot.img
tar -czf /forensics/logs_$(date +%Y%m%d_%H%M%S).tar.gz /var/log/

# 3. Rollback application
kubectl rollout undo deployment/api -n production
kubectl rollout undo deployment/frontend -n production

# 4. Reset all credentials
./scripts/rotate-all-secrets.sh --emergency

# 5. Notify security team and legal
./scripts/security-breach-notification.sh
```

### Scenario 2: Database Corruption

**Trigger:** Data integrity checks failing

```sql
-- Database Corruption Recovery
BEGIN;

-- 1. Identify corruption extent
SELECT schemaname, tablename,
       pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
AND NOT EXISTS (
  SELECT 1 FROM pg_class WHERE relname = tablename AND relkind = 'r'
);

-- 2. Attempt repair
REINDEX DATABASE whitecross_prod;
VACUUM FULL ANALYZE;

-- 3. If repair fails, restore from backup
-- This is handled by DBA with point-in-time recovery

COMMIT;
```

### Scenario 3: Performance Degradation

**Trigger:** Response times >1000ms for 10+ minutes

```bash
#!/bin/bash
# Performance Degradation Rollback

# 1. Enable rate limiting
redis-cli -h prod-cache SET rate_limit_enabled true
redis-cli -h prod-cache SET rate_limit_requests_per_minute 100

# 2. Scale horizontally
kubectl scale deployment/api --replicas=20 -n production

# 3. Clear caches
redis-cli -h prod-cache FLUSHDB

# 4. If not resolved, rollback
if [ $(curl -w "%{time_total}" -o /dev/null -s https://api.whitecross.health/health) -gt 1.0 ]; then
  kubectl rollout undo deployment/api -n production
fi

# 5. Optimize database
psql -h prod-db -c "VACUUM ANALYZE;"
```

### Scenario 4: Integration Failure

**Trigger:** Third-party service integration failing

```javascript
// Integration Failure Fallback
class IntegrationFallback {
  async handleFailure(service, error) {
    // 1. Log the failure
    logger.error(`Integration failure: ${service}`, error);

    // 2. Switch to fallback mode
    switch(service) {
      case 'email':
        await this.queueEmails();
        break;
      case 'sms':
        await this.queueSMS();
        break;
      case 'sso':
        await this.enableLocalAuth();
        break;
    }

    // 3. Notify operations
    await this.notifyOps(service, error);

    // 4. If critical, initiate rollback
    if (this.isCritical(service)) {
      await this.initiateRollback();
    }
  }

  async queueEmails() {
    // Queue emails for later delivery
    await redis.lpush('email_queue', JSON.stringify(emailData));
  }

  async enableLocalAuth() {
    // Temporarily enable local authentication
    await redis.set('local_auth_enabled', 'true');
    await redis.expire('local_auth_enabled', 3600); // 1 hour
  }
}
```

---

## Rollback Automation Scripts

### Master Rollback Script

```bash
#!/bin/bash
# master-rollback.sh - Main rollback orchestration script

set -e

# Configuration
ENVIRONMENT=${1:-production}
ROLLBACK_TYPE=${2:-full}  # full, frontend, backend, database
REASON=${3:-"Unspecified"}

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}=== INITIATING ROLLBACK ===${NC}"
echo "Environment: $ENVIRONMENT"
echo "Type: $ROLLBACK_TYPE"
echo "Reason: $REASON"
echo "Time: $(date)"

# Pre-rollback checks
function pre_rollback_checks() {
    echo -e "${YELLOW}Running pre-rollback checks...${NC}"

    # Check if we have valid backups
    if ! aws s3 ls s3://backups/$ENVIRONMENT/latest/ > /dev/null; then
        echo -e "${RED}ERROR: No valid backups found${NC}"
        exit 1
    fi

    # Check team availability
    if ! slack-cli user active @oncall-team > /dev/null; then
        echo -e "${YELLOW}WARNING: On-call team not fully available${NC}"
    fi

    # Verify rollback permissions
    if ! aws sts get-caller-identity | grep -q "RollbackRole"; then
        echo -e "${RED}ERROR: Insufficient permissions for rollback${NC}"
        exit 1
    fi
}

# Main rollback execution
function execute_rollback() {
    case $ROLLBACK_TYPE in
        full)
            rollback_frontend
            rollback_backend
            rollback_database
            ;;
        frontend)
            rollback_frontend
            ;;
        backend)
            rollback_backend
            ;;
        database)
            rollback_database
            ;;
        *)
            echo -e "${RED}Unknown rollback type: $ROLLBACK_TYPE${NC}"
            exit 1
            ;;
    esac
}

# Rollback functions
function rollback_frontend() {
    echo -e "${YELLOW}Rolling back frontend...${NC}"
    ./rollback-scripts/frontend-rollback.sh $ENVIRONMENT
}

function rollback_backend() {
    echo -e "${YELLOW}Rolling back backend...${NC}"
    ./rollback-scripts/backend-rollback.sh $ENVIRONMENT
}

function rollback_database() {
    echo -e "${YELLOW}Rolling back database...${NC}"
    ./rollback-scripts/database-rollback.sh $ENVIRONMENT
}

# Post-rollback validation
function post_rollback_validation() {
    echo -e "${YELLOW}Running post-rollback validation...${NC}"

    # Run smoke tests
    npm run test:smoke

    # Check system health
    for service in api frontend database cache; do
        if curl -f https://$service.whitecross.health/health > /dev/null 2>&1; then
            echo -e "${GREEN}✓ $service is healthy${NC}"
        else
            echo -e "${RED}✗ $service is unhealthy${NC}"
            VALIDATION_FAILED=1
        fi
    done

    if [ "$VALIDATION_FAILED" == "1" ]; then
        echo -e "${RED}Post-rollback validation failed!${NC}"
        exit 1
    fi
}

# Main execution
pre_rollback_checks
execute_rollback
post_rollback_validation

echo -e "${GREEN}=== ROLLBACK COMPLETED SUCCESSFULLY ===${NC}"
echo "Completed at: $(date)"

# Send notifications
./scripts/send-rollback-notification.sh "$ENVIRONMENT" "$ROLLBACK_TYPE" "SUCCESS"
```

---

## Emergency Contact List

| Role | Primary Contact | Phone | Backup Contact | Phone |
|------|-----------------|-------|----------------|-------|
| Deployment Lead | On-Call Lead | +1-xxx-xxx-xxxx | Backup Lead | +1-xxx-xxx-xxxx |
| Database Admin | DBA On-Call | +1-xxx-xxx-xxxx | Senior DBA | +1-xxx-xxx-xxxx |
| Security Lead | Security On-Call | +1-xxx-xxx-xxxx | CISO | +1-xxx-xxx-xxxx |
| Network Admin | Network On-Call | +1-xxx-xxx-xxxx | Sr Network Eng | +1-xxx-xxx-xxxx |
| Compliance Officer | Compliance Lead | +1-xxx-xxx-xxxx | Legal Counsel | +1-xxx-xxx-xxxx |
| CTO | CTO | +1-xxx-xxx-xxxx | VP Engineering | +1-xxx-xxx-xxxx |

**Escalation Hotline:** +1-800-xxx-xxxx (24/7)
**War Room Bridge:** +1-xxx-xxx-xxxx, Code: xxxxxx#

---

**Document Version:** 1.0
**Last Updated:** 2025-01-21
**Review Frequency:** After each rollback incident
**Owner:** Platform Engineering Team

*This document contains sensitive operational procedures. Handle according to company security policies.*