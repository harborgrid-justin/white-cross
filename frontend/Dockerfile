# =============================================================================
# White Cross Healthcare Platform - Next.js Production Dockerfile
# Multi-stage build optimized for production deployment
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build Dependencies (All dependencies for building)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps-build

# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies) for building
# Use cache mount for npm cache to speed up subsequent builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci && \
    npm cache clean --force

# -----------------------------------------------------------------------------
# Stage 2: Production Dependencies (Only runtime dependencies)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps-prod

# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install only production dependencies for runtime
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production && \
    npm cache clean --force

# -----------------------------------------------------------------------------
# Stage 3: Builder
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy ALL dependencies from deps-build stage (needed for build)
COPY --from=deps-build /app/node_modules ./node_modules

# Copy application source
COPY . .

# Set build-time environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ENVIRONMENT=production
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_ENABLE_ANALYTICS=true

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_ENABLE_ANALYTICS=$NEXT_PUBLIC_ENABLE_ANALYTICS

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 4: Production Runner
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files from builder
# Note: standalone output already includes required production dependencies
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership to nextjs user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start Next.js server
CMD ["node", "server.js"]
