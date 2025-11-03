# ============================================
# White Cross NestJS Backend - Production Dockerfile
# ============================================
# Multi-stage build for optimized production deployment
# Base: Node 20 Alpine for minimal size and security
# Security: Non-root user, minimal dependencies
# Health: Integrated health check endpoint
# ============================================

# ============================================
# Stage 1: Builder
# ============================================
FROM node:20-alpine AS builder

# Install build dependencies (required for native modules)
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# ============================================
# Stage 2: Runtime
# ============================================
FROM node:20-alpine AS runtime

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy necessary runtime files
COPY --from=builder /app/src/infrastructure/email/templates ./src/infrastructure/email/templates

# Create non-root user for security
# The node user already exists in the Node Alpine image
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose application ports
# 3001: Main API server
# 3002: WebSocket server
EXPOSE 3001 3002

# Health check configuration
# Uses the /health/live endpoint which is lightweight and doesn't check dependencies
# Interval: Check every 30 seconds
# Timeout: Wait 10 seconds for response
# Start period: Wait 40 seconds after container start before checking
# Retries: Mark unhealthy after 3 consecutive failures
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health/live', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main"]
