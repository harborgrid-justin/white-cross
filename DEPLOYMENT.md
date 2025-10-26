# White Cross Healthcare Platform - Production Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Environment Setup](#environment-setup)
4. [Deployment Methods](#deployment-methods)
5. [Database Migrations](#database-migrations)
6. [Monitoring & Alerts](#monitoring--alerts)
7. [Security Checklist](#security-checklist)
8. [Troubleshooting](#troubleshooting)
9. [Rollback Procedures](#rollback-procedures)
10. [Post-Deployment Verification](#post-deployment-verification)

---

## Prerequisites

### Required Software

- **Docker** >= 24.0.0
- **Docker Compose** >= 2.20.0
- **Node.js** >= 20.0.0
- **npm** >= 8.0.0
- **PostgreSQL** 15+ (if not using Docker)
- **Redis** 7+ (if not using Docker)

### Required Accounts & Access

- GitHub account with repository access
- Container registry access (GitHub Container Registry)
- Server SSH access (production deployment)
- Sentry account for error tracking
- Upstash Redis account for rate limiting
- S3-compatible storage for backups and file uploads

### Required Secrets

Create a `.env.production` file with the following secrets:

```bash
# Database
DB_PASSWORD=<strong-database-password>
REDIS_PASSWORD=<strong-redis-password>

# JWT & Session
JWT_SECRET=<min-32-character-secret>
JWT_REFRESH_SECRET=<min-32-character-secret>
SESSION_SECRET=<min-32-character-secret>
CSRF_SECRET=<min-32-character-secret>

# External Services
NEXT_PUBLIC_SENTRY_DSN=<sentry-dsn>
SENTRY_AUTH_TOKEN=<sentry-auth-token>
UPSTASH_REDIS_REST_URL=<upstash-redis-url>
UPSTASH_REDIS_REST_TOKEN=<upstash-redis-token>

# Email
SMTP_HOST=smtp.yourdomain.com
SMTP_USER=<smtp-username>
SMTP_PASSWORD=<smtp-password>

# Storage
S3_ACCESS_KEY_ID=<s3-access-key>
S3_SECRET_ACCESS_KEY=<s3-secret-key>

# API URLs
NEXT_PUBLIC_API_URL=https://api.whitecross.yourdomain.com
PRODUCTION_URL=https://whitecross.yourdomain.com
```

---

## Architecture Overview

### Production Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        Load Balancer                         │
│                    (nginx/Traefik/AWS ALB)                   │
└──────────────┬──────────────────────────────┬────────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│     Next.js Frontend     │   │     Hapi.js Backend API      │
│      Port 3000           │   │        Port 3001             │
│   (Docker Container)     │   │    (Docker Container)        │
└──────────────┬───────────┘   └──────────┬───────────────────┘
               │                          │
               │                          ▼
               │               ┌──────────────────────┐
               │               │   PostgreSQL 15      │
               │               │   Port 5432          │
               │               │  (Docker Container)   │
               │               └──────────────────────┘
               │
               ▼
      ┌─────────────────┐
      │    Redis 7       │
      │   Port 6379      │
      │(Docker Container)│
      └─────────────────┘
```

### Deployment Flow

```
Developer Push → GitHub Actions CI/CD → Security Scan → Tests →
Build Docker Images → Push to Registry → Deploy to Server →
Health Checks → Monitoring → Alerts
```

---

## Environment Setup

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

### 2. Clone Repository

```bash
# Create application directory
sudo mkdir -p /opt/white-cross
sudo chown $USER:$USER /opt/white-cross

# Clone repository
cd /opt/white-cross
git clone https://github.com/your-org/white-cross.git .

# Checkout production branch
git checkout master
```

### 3. Configure Environment

```bash
# Copy environment template
cp nextjs/.env.production.example nextjs/.env.production

# Edit environment variables
nano nextjs/.env.production

# Set file permissions
chmod 600 nextjs/.env.production
chmod 600 backend/.env.production
```

### 4. Configure SSL/TLS

For production, SSL/TLS is mandatory for HIPAA compliance.

**Option A: Let's Encrypt with Certbot**

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d whitecross.yourdomain.com -d api.whitecross.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

**Option B: AWS Certificate Manager**

If using AWS ALB, configure ACM certificates through AWS Console.

---

## Deployment Methods

### Method 1: Docker Compose (Recommended for Single Server)

```bash
cd /opt/white-cross

# Pull latest changes
git pull origin master

# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check service status
docker-compose -f docker-compose.prod.yml ps
```

### Method 2: GitHub Actions CI/CD (Automated)

1. **Configure GitHub Secrets**

Navigate to Settings → Secrets → Actions and add:

```
DEPLOY_HOST=your-server-ip
DEPLOY_USER=deploy-user
DEPLOY_SSH_KEY=<private-ssh-key>
DEPLOY_PORT=22
PRODUCTION_URL=https://whitecross.yourdomain.com
STAGING_URL=https://staging.whitecross.yourdomain.com
SENTRY_AUTH_TOKEN=<sentry-token>
SENTRY_ORG=your-org
SLACK_WEBHOOK_URL=<slack-webhook>
SMTP_HOST=smtp.yourdomain.com
SMTP_USER=<smtp-user>
SMTP_PASSWORD=<smtp-password>
ALERT_EMAIL=devops@yourdomain.com
```

2. **Trigger Deployment**

```bash
# Automatic deployment on push to master
git push origin master

# Manual deployment via workflow dispatch
# Go to Actions → Production Deployment → Run workflow
```

### Method 3: Manual Deployment

```bash
# 1. Build Docker images locally
cd /opt/white-cross

# Build Next.js
cd nextjs
docker build -t white-cross-nextjs:latest .

# Build Backend
cd ../backend
docker build -t white-cross-backend:latest .

# 2. Tag images
docker tag white-cross-nextjs:latest ghcr.io/your-org/white-cross-nextjs:latest
docker tag white-cross-backend:latest ghcr.io/your-org/white-cross-backend:latest

# 3. Push to registry
docker push ghcr.io/your-org/white-cross-nextjs:latest
docker push ghcr.io/your-org/white-cross-backend:latest

# 4. Pull on production server
ssh user@production-server
cd /opt/white-cross
docker-compose -f docker-compose.prod.yml pull

# 5. Restart services
docker-compose -f docker-compose.prod.yml up -d
```

---

## Database Migrations

### Running Migrations

**Automated (via GitHub Actions)**

Migrations run automatically during deployment.

**Manual Migration**

```bash
cd /opt/white-cross

# Check migration status
./scripts/migrate-database.sh production status

# Run migrations
./scripts/migrate-database.sh production up

# Check for pending migrations
./scripts/migrate-database.sh production pending
```

### Migration Verification

```bash
# Check applied migrations
docker-compose -f docker-compose.prod.yml exec backend npx sequelize-cli db:migrate:status

# Verify database connectivity
docker-compose -f docker-compose.prod.yml exec postgres psql -U white_cross_user -d white_cross -c "SELECT version();"
```

### Backup Before Migration

Backups are created automatically by the migration script.

**Manual Backup**

```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U white_cross_user white_cross > backup_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip backup_*.sql

# Upload to S3
aws s3 cp backup_*.sql.gz s3://your-backup-bucket/database/
```

---

## Monitoring & Alerts

### Health Checks

**Application Health**

```bash
# Next.js health check
curl https://whitecross.yourdomain.com/api/health

# Backend health check
curl https://api.whitecross.yourdomain.com/health

# Expected response: 200 OK
{
  "status": "healthy",
  "timestamp": "2025-10-26T18:00:00Z",
  "uptime": 12345,
  "checks": {
    "server": { "status": "ok", "latency": 1 },
    "backend": { "status": "ok", "latency": 45 },
    "redis": { "status": "ok", "latency": 12 },
    "database": { "status": "ok", "latency": 23 }
  }
}
```

**Docker Health Checks**

```bash
# Check container health
docker ps --filter "name=white-cross" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# View health check logs
docker inspect --format='{{json .State.Health}}' white-cross-nextjs-prod | jq
```

### Sentry Monitoring

Sentry captures errors automatically. Configure alerts in Sentry dashboard:

1. Navigate to Settings → Alerts
2. Create alert rule for critical errors
3. Configure notification channels (Slack, Email)

### Uptime Monitoring

Configure external uptime monitoring:

- **UptimeRobot**: https://uptimerobot.com
- **Pingdom**: https://pingdom.com
- **StatusCake**: https://statuscake.com

**Endpoints to Monitor**

- `https://whitecross.yourdomain.com/api/health` (every 5 minutes)
- `https://api.whitecross.yourdomain.com/health` (every 5 minutes)

### Log Monitoring

**View Logs**

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f nextjs
docker-compose -f docker-compose.prod.yml logs -f backend

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 nextjs
```

**Centralized Logging (Optional)**

Use ELK Stack, Datadog, or CloudWatch for centralized logging.

---

## Security Checklist

### Pre-Deployment Security Audit

- [ ] All secrets stored in environment variables (not in code)
- [ ] SSL/TLS certificates valid and configured
- [ ] Database passwords are strong (min 32 characters)
- [ ] JWT secrets are unique and strong (min 32 characters)
- [ ] Rate limiting enabled (Upstash Redis configured)
- [ ] CORS configured for production domains only
- [ ] Security headers enabled (CSP, HSTS, X-Frame-Options)
- [ ] Firewall rules configured (only ports 80, 443, 22 open)
- [ ] SSH key-based authentication enabled (password auth disabled)
- [ ] Docker containers running as non-root users
- [ ] Database SSL/TLS encryption enabled
- [ ] Audit logging enabled for all PHI access
- [ ] Regular security updates scheduled
- [ ] Backup procedures tested and automated

### HIPAA Compliance Checklist

- [ ] All PHI encrypted at rest
- [ ] All PHI encrypted in transit (TLS 1.2+)
- [ ] Audit logs enabled and immutable
- [ ] Access controls configured (RBAC)
- [ ] Session timeouts configured (max 15 minutes)
- [ ] Failed login attempt monitoring
- [ ] Data retention policies configured
- [ ] Business Associate Agreements (BAA) in place
- [ ] Disaster recovery plan documented
- [ ] Incident response plan documented

---

## Troubleshooting

### Common Issues

**1. Container Fails to Start**

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs nextjs

# Common causes:
# - Missing environment variables
# - Port already in use
# - Insufficient memory

# Solution:
# Fix environment variables, stop conflicting services, or increase resources
```

**2. Database Connection Failed**

```bash
# Check database container
docker-compose -f docker-compose.prod.yml logs postgres

# Test connection
docker-compose -f docker-compose.prod.yml exec postgres psql -U white_cross_user -d white_cross -c "SELECT 1;"

# Common causes:
# - Database not ready (wait longer)
# - Wrong credentials
# - Network issues

# Solution:
# Verify credentials in .env.production
# Check network connectivity
```

**3. Health Check Failing**

```bash
# Check health endpoint manually
curl http://localhost:3000/api/health

# Check backend is accessible
curl http://localhost:3001/health

# Common causes:
# - Backend not running
# - Network misconfiguration
# - Environment variables incorrect

# Solution:
# Ensure all services are running
# Verify NEXT_PUBLIC_API_URL in environment
```

**4. High Memory Usage**

```bash
# Check container resource usage
docker stats

# Limit container memory
# Edit docker-compose.prod.yml:
services:
  nextjs:
    deploy:
      resources:
        limits:
          memory: 1G
```

**5. Slow Performance**

```bash
# Check Redis cache
docker-compose -f docker-compose.prod.yml exec redis redis-cli PING

# Check database connections
docker-compose -f docker-compose.prod.yml exec postgres psql -U white_cross_user -d white_cross -c "SELECT count(*) FROM pg_stat_activity;"

# Optimize:
# - Increase Redis memory limit
# - Add database indexes
# - Enable CDN for static assets
```

---

## Rollback Procedures

### Rollback Database Migration

```bash
cd /opt/white-cross

# Rollback last migration
./scripts/rollback-migration.sh

# Or use direct command
docker-compose -f docker-compose.prod.yml exec backend npx sequelize-cli db:migrate:undo

# Verify rollback
docker-compose -f docker-compose.prod.yml exec backend npx sequelize-cli db:migrate:status
```

### Rollback Application Deployment

**Option 1: Revert to Previous Docker Image**

```bash
# Pull previous version
docker pull ghcr.io/your-org/white-cross-nextjs:v1.2.3

# Update docker-compose.prod.yml to use specific version
# Then restart
docker-compose -f docker-compose.prod.yml up -d nextjs
```

**Option 2: Git Revert and Redeploy**

```bash
# Revert to previous commit
git log --oneline  # Find commit hash
git revert <commit-hash>
git push origin master

# Trigger deployment
# Or manually rebuild
docker-compose -f docker-compose.prod.yml up -d --build
```

**Option 3: Restore from Database Backup**

```bash
# Find backup file
ls -lh /opt/white-cross/backups/database/

# Restore backup
gunzip backup_20251026_180000.sql.gz
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U white_cross_user -d white_cross < backup_20251026_180000.sql

# Or download from S3
aws s3 cp s3://your-backup-bucket/database/backup_20251026_180000.sql.gz .
gunzip backup_20251026_180000.sql.gz
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U white_cross_user -d white_cross < backup_20251026_180000.sql
```

---

## Post-Deployment Verification

### Automated Verification Checklist

```bash
#!/bin/bash

echo "Running post-deployment verification..."

# 1. Health checks
echo "✓ Checking health endpoints..."
curl -f https://whitecross.yourdomain.com/api/health || echo "✗ Next.js health check failed"
curl -f https://api.whitecross.yourdomain.com/health || echo "✗ Backend health check failed"

# 2. SSL certificate
echo "✓ Checking SSL certificate..."
echo | openssl s_client -servername whitecross.yourdomain.com -connect whitecross.yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# 3. Database connectivity
echo "✓ Checking database..."
docker-compose -f docker-compose.prod.yml exec postgres psql -U white_cross_user -d white_cross -c "SELECT 1;" || echo "✗ Database check failed"

# 4. Redis connectivity
echo "✓ Checking Redis..."
docker-compose -f docker-compose.prod.yml exec redis redis-cli PING || echo "✗ Redis check failed"

# 5. Critical endpoints
echo "✓ Testing critical endpoints..."
curl -f https://whitecross.yourdomain.com/ || echo "✗ Homepage failed"
curl -f https://api.whitecross.yourdomain.com/api/v1/health || echo "✗ API failed"

# 6. Error tracking
echo "✓ Verifying Sentry..."
# Check Sentry dashboard for recent events

echo "Verification complete!"
```

### Manual Testing Checklist

- [ ] Homepage loads without errors
- [ ] Login functionality works
- [ ] Student management CRUD operations work
- [ ] Medication administration functions correctly
- [ ] Appointment scheduling works
- [ ] Document upload and retrieval functions
- [ ] Audit logs are being recorded
- [ ] Email notifications are sent
- [ ] Mobile responsive design verified
- [ ] Browser compatibility tested (Chrome, Firefox, Safari, Edge)

---

## Maintenance

### Regular Tasks

**Daily**

- Monitor error rates in Sentry
- Check system resource usage
- Review application logs for anomalies

**Weekly**

- Review database performance
- Check backup integrity
- Update security patches

**Monthly**

- Database optimization (VACUUM, ANALYZE)
- Review and rotate logs
- Security audit
- Disaster recovery drill

### Backup Schedule

**Database Backups**

- **Frequency**: Every 6 hours
- **Retention**: 30 days local, 90 days S3
- **Location**: `/opt/white-cross/backups/database` + S3

**Application Backups**

- **Frequency**: Daily
- **Retention**: 14 days
- **Location**: S3

**Configuration Backups**

- **Frequency**: On every change
- **Retention**: Indefinite
- **Location**: Git repository

---

## Support & Contact

### Emergency Contacts

- **DevOps Team**: devops@whitecross.com
- **Security Team**: security@whitecross.com
- **On-Call**: +1-XXX-XXX-XXXX

### Documentation

- **Technical Docs**: https://docs.whitecross.com
- **API Docs**: https://api.whitecross.com/docs
- **GitHub**: https://github.com/your-org/white-cross

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-26 | Initial production deployment guide |

---

**Last Updated**: 2025-10-26
**Maintained By**: DevOps Team
