# Performance Optimization Quick Start Guide

**White Cross Data Layer - Performance & Scalability**
**Version:** 1.0
**Last Updated:** 2025-11-10

---

## 🚀 Quick Start (5 Minutes)

### 1. Check System Health

```bash
# Overall health assessment
curl http://localhost:3000/metrics/health | jq '.data.overall'

# Expected: { "healthy": true, "score": 85-100, "status": "excellent" }
```

### 2. View Performance Dashboard

```bash
# Complete dashboard summary
curl http://localhost:3000/metrics/summary | jq '.'

# Current metrics only
curl http://localhost:3000/metrics | jq '.data'
```

### 3. Check Cache Performance

```bash
# Cache hit rate (target: >75%)
curl http://localhost:3000/metrics/cache | jq '.data.metrics.hitRate'

# Top accessed keys
curl http://localhost:3000/metrics/cache/hottest-keys | jq '.data.keys'
```

---

## 📊 Key Metrics to Monitor

### Critical Thresholds

| Metric | Good | Warning | Critical | Action |
|--------|------|---------|----------|--------|
| **Query Latency (p95)** | <500ms | 500-2000ms | >2000ms | Check slow queries |
| **Cache Hit Rate** | >75% | 50-75% | <50% | Review TTL, warmup |
| **Pool Utilization** | <70% | 70-85% | >85% | Increase pool size |
| **Active Connections** | <15 | 15-18 | >18 | Check for leaks |
| **Heap Usage** | <75% | 75-90% | >90% | Memory leak check |
| **Event Loop Lag** | <20ms | 20-50ms | >50ms | CPU bottleneck |

---

## 🔍 Common Tasks

### Check for Performance Issues

```bash
# Find slow queries (>1 second)
curl http://localhost:3000/metrics/slow-queries?threshold=1000

# Get AI-powered index suggestions
curl http://localhost:3000/metrics/index-suggestions

# Check connection pool health
curl http://localhost:3000/metrics/pool

# Detect connection leaks
curl http://localhost:3000/metrics/pool/leaks

# Check lock contention
curl http://localhost:3000/metrics/locks/contention
```

### Cache Management

```bash
# Trigger cache warmup (startup or after deploy)
curl -X POST http://localhost:3000/metrics/cache/warmup \
  -H "Content-Type: application/json" \
  -d '{"strategy": "CRITICAL_ONLY"}'

# Check warmup progress
curl http://localhost:3000/metrics/cache/warmup/status

# Clear cache (if needed)
curl -X POST http://localhost:3000/metrics/cache/clear
```

### Query Analysis

```bash
# Analyze specific query plan
curl -X POST http://localhost:3000/metrics/query-plan \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM threats WHERE severity = '\''CRITICAL'\'' AND status = '\''ACTIVE'\''"
  }'

# Get query statistics
curl http://localhost:3000/metrics/query-stats
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Cache Configuration
CACHE_MAX_SIZE=1000              # L1 cache max entries
CACHE_DEFAULT_TTL=300            # Default TTL in seconds

# Connection Pool
POOL_MIN_CONNECTIONS=5           # Minimum idle connections
POOL_MAX_CONNECTIONS=20          # Maximum total connections

# Batch Processing
BATCH_SIZE_DEFAULT=1000          # Default batch size
BATCH_SIZE_MAX=5000              # Maximum batch size

# Monitoring
SLOW_QUERY_THRESHOLD_MS=1000     # Slow query threshold
ENABLE_QUERY_PLAN_ANALYSIS=true  # Enable EXPLAIN ANALYZE
```

### Redis Configuration (Production)

```env
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-password
```

---

## 🚨 Troubleshooting

### Problem: Low Cache Hit Rate (<50%)

**Symptoms:**
- Cache hit rate below 50%
- High database load

**Diagnosis:**
```bash
curl http://localhost:3000/metrics/cache | jq '.data.metrics.hitRate'
```

**Solutions:**
1. **Increase TTL:**
   - Edit cache configuration
   - Restart with higher TTL values

2. **Review hottest keys:**
   ```bash
   curl http://localhost:3000/metrics/cache/hottest-keys
   ```
   - Identify frequently accessed keys
   - Ensure they have appropriate TTL

3. **Trigger warmup:**
   ```bash
   curl -X POST http://localhost:3000/metrics/cache/warmup \
     -d '{"strategy": "HIGH_FREQUENCY"}'
   ```

---

### Problem: High Query Latency (p95 >2000ms)

**Symptoms:**
- Slow API responses
- High p95 latency

**Diagnosis:**
```bash
# Check slow queries
curl http://localhost:3000/metrics/slow-queries

# Get index suggestions
curl http://localhost:3000/metrics/index-suggestions
```

**Solutions:**
1. **Implement suggested indexes:**
   ```sql
   CREATE INDEX idx_threats_severity_status
   ON threats(severity, status);
   ```

2. **Analyze query plans:**
   ```bash
   curl -X POST http://localhost:3000/metrics/query-plan \
     -d '{"query": "YOUR_SLOW_QUERY"}'
   ```

3. **Run ANALYZE on tables:**
   ```sql
   ANALYZE threats;
   ANALYZE indicators;
   ```

---

### Problem: Connection Pool Exhaustion

**Symptoms:**
- "Pool exhausted" errors
- Waiting connections >5

**Diagnosis:**
```bash
# Check pool metrics
curl http://localhost:3000/metrics/pool

# Detect leaks
curl http://localhost:3000/metrics/pool/leaks
```

**Solutions:**
1. **Check for connection leaks:**
   - Review code for unclosed connections
   - Ensure transactions are properly committed/rolled back

2. **Increase pool size (temporary):**
   ```env
   POOL_MAX_CONNECTIONS=30
   ```

3. **Kill long-running queries:**
   ```bash
   curl http://localhost:3000/metrics/pool/long-running
   ```
   - Manually terminate blocking queries in PostgreSQL

---

### Problem: High Memory Usage (>90%)

**Symptoms:**
- High heap usage
- OOM errors
- Slow application

**Diagnosis:**
```bash
curl http://localhost:3000/metrics | jq '.data.application.heapUsedMB'
```

**Solutions:**
1. **Check batch processing:**
   - Review batch sizes
   - Ensure streaming patterns are used
   - Reduce concurrent batches

2. **Clear cache if needed:**
   ```bash
   curl -X POST http://localhost:3000/metrics/cache/clear
   ```

3. **Restart application:**
   - If memory leak suspected
   - Monitor after restart

---

## 📅 Maintenance Schedule

### Daily (Automated)
- ✅ Health checks every minute
- ✅ Slow query detection every 5 minutes
- ✅ Performance stats collection every minute
- ✅ Cache monitoring continuous

### Weekly (Manual)
- Review slow query trends
- Implement high-impact index suggestions
- Check connection leak patterns
- Analyze cache hit rate trends

### Monthly
- Review performance baselines
- Capacity planning based on growth
- Optimize alert thresholds
- Update TTL configurations

---

## 📈 Performance Targets

| Metric | Target | Current Check |
|--------|--------|---------------|
| Query Latency p95 | <500ms | `curl /metrics \| jq '.data.database.queryLatencyP95'` |
| Cache Hit Rate | >75% | `curl /metrics/cache \| jq '.data.metrics.hitRate'` |
| Pool Utilization | <80% | `curl /metrics/pool \| jq '.data.metrics.utilizationRate'` |
| Active Connections | <18 | `curl /metrics/pool \| jq '.data.metrics.active'` |
| Slow Query Count | <10 | `curl /metrics \| jq '.data.database.slowQueryCount'` |

---

## 🔗 Useful Endpoints

### Monitoring
- `/metrics` - Current metrics
- `/metrics/health` - Health assessment
- `/metrics/summary` - Dashboard summary
- `/metrics/history?duration=60` - Last 60 minutes
- `/metrics/alerts` - Active alerts

### Query Analysis
- `/metrics/slow-queries` - Slow query log
- `/metrics/query-stats` - Query statistics
- `/metrics/index-suggestions` - Index recommendations

### Cache
- `/metrics/cache` - Cache statistics
- `/metrics/cache/hottest-keys` - Top keys
- `/metrics/cache/warmup/status` - Warmup progress

### Pool & Locks
- `/metrics/pool` - Pool metrics
- `/metrics/pool/leaks` - Connection leaks
- `/metrics/locks` - Lock statistics

### Admin
- `/metrics/stats/reset` - Reset statistics
- `/metrics/cache/clear` - Clear cache
- `/metrics/ping` - Health check

---

## 🆘 Emergency Procedures

### System Unresponsive

1. **Check health immediately:**
   ```bash
   curl -m 5 http://localhost:3000/metrics/ping
   ```

2. **If timeout, check basics:**
   - Database connectivity: `psql -h localhost -U user -d db -c "SELECT 1"`
   - Redis connectivity: `redis-cli ping`
   - Application logs: `tail -f logs/app.log`

3. **Collect diagnostics:**
   ```bash
   curl http://localhost:3000/metrics/health
   curl http://localhost:3000/metrics/pool
   curl http://localhost:3000/metrics/locks/contention
   ```

4. **Restart if needed:**
   ```bash
   # Graceful restart
   pm2 restart app --update-env

   # Or
   kubectl rollout restart deployment/app
   ```

---

### Database Degradation

1. **Check slow queries:**
   ```bash
   curl http://localhost:3000/metrics/slow-queries?threshold=500
   ```

2. **Get immediate index suggestions:**
   ```bash
   curl http://localhost:3000/metrics/index-suggestions
   ```

3. **Check PostgreSQL:**
   ```sql
   -- Active queries
   SELECT pid, query, state, query_start
   FROM pg_stat_activity
   WHERE state != 'idle'
   ORDER BY query_start;

   -- Blocking queries
   SELECT blocked_locks.pid AS blocked_pid,
          blocking_locks.pid AS blocking_pid
   FROM pg_catalog.pg_locks blocked_locks
   JOIN pg_catalog.pg_locks blocking_locks
   ON blocking_locks.locktype = blocked_locks.locktype;
   ```

4. **Apply quick fixes:**
   - Terminate long queries
   - Implement suggested indexes
   - Clear cache and trigger warmup

---

## 📞 Support

**Performance Issues:**
- Check this guide first
- Review `/metrics/health` for diagnostics
- Collect `/metrics/summary` output
- Contact DevOps with diagnostics

**Emergency Contact:**
- On-call: [Your on-call rotation]
- Slack: #performance-alerts
- PagerDuty: [Your PagerDuty service]

---

## ✅ Quick Health Check Script

```bash
#!/bin/bash
# save as: check-performance.sh

BASE_URL="http://localhost:3000/metrics"

echo "=== Performance Health Check ==="
echo ""

# Overall health
echo "📊 Overall Health:"
curl -s $BASE_URL/health | jq '.data.overall' 2>/dev/null || echo "❌ Health check failed"
echo ""

# Query performance
echo "⚡ Query Performance:"
curl -s $BASE_URL | jq '{
  p95: .data.database.queryLatencyP95,
  slowQueries: .data.database.slowQueryCount
}' 2>/dev/null || echo "❌ Failed"
echo ""

# Cache performance
echo "💾 Cache Performance:"
curl -s $BASE_URL/cache | jq '{
  hitRate: .data.metrics.hitRate,
  evictionRate: .data.metrics.evictionRate
}' 2>/dev/null || echo "❌ Failed"
echo ""

# Connection pool
echo "🔌 Connection Pool:"
curl -s $BASE_URL/pool | jq '{
  active: .data.metrics.active,
  utilization: .data.metrics.utilizationRate,
  waiting: .data.metrics.waiting
}' 2>/dev/null || echo "❌ Failed"
echo ""

# Active alerts
echo "🚨 Active Alerts:"
curl -s $BASE_URL/alerts | jq '.data.total' 2>/dev/null || echo "❌ Failed"
echo ""

echo "=== Check Complete ==="
```

**Usage:**
```bash
chmod +x check-performance.sh
./check-performance.sh
```

---

**Last Updated:** 2025-11-10
**Version:** 1.0
**Maintained by:** Performance Engineering Team
