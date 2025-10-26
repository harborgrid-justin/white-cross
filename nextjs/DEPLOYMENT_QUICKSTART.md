# Production Deployment - Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js 20+ installed
- [ ] Docker & Docker Compose installed
- [ ] GitHub repository access
- [ ] Production server SSH access
- [ ] Upstash Redis account
- [ ] Sentry account

---

## 1. Install Production Dependencies

```bash
cd nextjs
npm install @upstash/ratelimit @upstash/redis @sentry/nextjs
```

---

## 2. Configure Environment Variables

Copy and configure production environment:

```bash
cp .env.production.example .env.production
nano .env.production
```

**Required Variables:**
```bash
# API
NEXT_PUBLIC_API_URL=http://backend:3001
NEXT_PUBLIC_EXTERNAL_API_URL=https://api.whitecross.yourdomain.com

# Security
SESSION_SECRET=<generate-32-char-secret>
CSRF_SECRET=<generate-32-char-secret>

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
SENTRY_AUTH_TOKEN=<your-sentry-auth-token>

# Rate Limiting
UPSTASH_REDIS_REST_URL=<your-upstash-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>

# CORS
ALLOWED_ORIGINS=https://whitecross.yourdomain.com
```

---

## 3. Configure GitHub Secrets

Add these secrets to GitHub repository (Settings → Secrets → Actions):

```
DEPLOY_HOST=your-server-ip
DEPLOY_USER=deploy-user
DEPLOY_SSH_KEY=<private-ssh-key>
PRODUCTION_URL=https://whitecross.yourdomain.com
STAGING_URL=https://staging.whitecross.yourdomain.com
SENTRY_AUTH_TOKEN=<sentry-token>
SENTRY_ORG=your-org
SLACK_WEBHOOK_URL=<slack-webhook>
NEXT_PUBLIC_API_URL=https://api.whitecross.yourdomain.com
```

---

## 4. Test Docker Build Locally

```bash
# Build production image
docker build -t white-cross-nextjs:test -f nextjs/Dockerfile ./nextjs

# Run container
docker run -p 3000:3000 --env-file nextjs/.env.production white-cross-nextjs:test

# Test health check
curl http://localhost:3000/api/health
```

---

## 5. Deploy to Production

### Method A: GitHub Actions (Recommended)

```bash
# Push to master branch (triggers automatic deployment)
git push origin master

# Or use manual workflow dispatch
# Go to: Actions → Production Deployment → Run workflow
```

### Method B: Docker Compose

```bash
# SSH to production server
ssh user@production-server
cd /opt/white-cross

# Pull latest code
git pull origin master

# Deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Check logs
docker-compose -f docker-compose.prod.yml logs -f nextjs
```

### Method C: Manual Deployment

```bash
# Build and push images
docker build -t ghcr.io/your-org/white-cross-nextjs:latest ./nextjs
docker push ghcr.io/your-org/white-cross-nextjs:latest

# On production server
docker pull ghcr.io/your-org/white-cross-nextjs:latest
docker-compose -f docker-compose.prod.yml up -d nextjs
```

---

## 6. Verify Deployment

```bash
# Health check
curl https://whitecross.yourdomain.com/api/health

# Expected response (200 OK):
{
  "status": "healthy",
  "timestamp": "2025-10-26T18:00:00Z",
  "uptime": 12345,
  "checks": {
    "server": { "status": "ok" },
    "backend": { "status": "ok" },
    "redis": { "status": "ok" },
    "database": { "status": "ok" }
  }
}
```

---

## 7. Monitor Application

### View Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f nextjs
```

### Check Sentry
Visit: https://sentry.io → Your Project → Issues

### Check Uptime
Configure monitoring in UptimeRobot, Pingdom, or StatusCake

---

## 8. Rollback (If Needed)

### Quick Rollback
```bash
# Rollback to previous commit
git revert HEAD
git push origin master

# Or rollback database migration
./scripts/rollback-migration.sh
```

---

## Common Commands

```bash
# View all containers
docker ps --filter "name=white-cross"

# View container health
docker inspect --format='{{json .State.Health}}' white-cross-nextjs-prod | jq

# Restart Next.js service
docker-compose -f docker-compose.prod.yml restart nextjs

# View recent logs
docker-compose -f docker-compose.prod.yml logs --tail=100 nextjs

# Enter container shell
docker-compose -f docker-compose.prod.yml exec nextjs sh

# Remove unused images
docker image prune -f
```

---

## Troubleshooting

### Issue: Health check failing
```bash
# Check backend connectivity
docker-compose -f docker-compose.prod.yml exec nextjs curl http://backend:3001/health

# Check environment variables
docker-compose -f docker-compose.prod.yml exec nextjs env | grep NEXT_PUBLIC
```

### Issue: Rate limiting not working
```bash
# Verify Upstash Redis connectivity
curl -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
  "$UPSTASH_REDIS_REST_URL/ping"

# Check environment variables
echo $UPSTASH_REDIS_REST_URL
echo $UPSTASH_REDIS_REST_TOKEN
```

### Issue: Sentry not capturing errors
```bash
# Verify Sentry DSN
echo $NEXT_PUBLIC_SENTRY_DSN

# Check Sentry configuration
grep -r "SENTRY" nextjs/.env.production

# Test Sentry manually (in application)
# Throw a test error and check Sentry dashboard
```

---

## Performance Tips

1. **Enable CDN**: Use CloudFlare or AWS CloudFront for static assets
2. **Database Indexing**: Ensure proper indexes on frequently queried tables
3. **Redis Memory**: Increase Upstash Redis memory limit for high traffic
4. **Container Resources**: Allocate sufficient memory/CPU in docker-compose.prod.yml
5. **Image Optimization**: Use Next.js Image component with WebP/AVIF

---

## Security Best Practices

- ✅ Use strong secrets (32+ characters)
- ✅ Enable HTTPS (Let's Encrypt or ACM)
- ✅ Configure firewall (ports 80, 443, 22 only)
- ✅ Disable password authentication for SSH
- ✅ Enable automatic security updates
- ✅ Regular backup verification
- ✅ Monitor error logs daily
- ✅ Rotate secrets quarterly

---

## Support

- **Documentation**: F:\temp\white-cross\DEPLOYMENT.md
- **GitHub Issues**: https://github.com/your-org/white-cross/issues
- **Email**: devops@whitecross.com

---

**Last Updated**: 2025-10-26
