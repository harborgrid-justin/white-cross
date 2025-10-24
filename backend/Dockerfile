# =============================================================================
# White Cross Healthcare Platform - Backend Dockerfile
# Multi-stage build for production optimization and development support
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base Image with Common Dependencies
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base

# Install security updates and system dependencies
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    dumb-init \
    curl \
    postgresql-client \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# -----------------------------------------------------------------------------
# Stage 2: Development Dependencies
# -----------------------------------------------------------------------------
FROM base AS deps

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install && \
    npm cache clean --force

# -----------------------------------------------------------------------------
# Stage 3: Production Dependencies
# -----------------------------------------------------------------------------
FROM base AS prod-deps

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --only=production && \
    npm cache clean --force

# -----------------------------------------------------------------------------
# Stage 4: TypeScript Build
# -----------------------------------------------------------------------------
FROM base AS build

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and configuration
COPY . .

# Build TypeScript
RUN npm run build && \
    rm -rf src tests *.ts tsconfig.json

# -----------------------------------------------------------------------------
# Stage 5: Production Runtime
# -----------------------------------------------------------------------------
FROM base AS production

LABEL maintainer="White Cross DevOps <devops@whitecross.com>"
LABEL description="White Cross Healthcare Platform - Production Backend API"
LABEL version="1.0.0"

# Copy production dependencies
COPY --from=prod-deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./

# Copy database migrations and configuration
COPY --chown=nodejs:nodejs src/database/migrations ./src/database/migrations
COPY --chown=nodejs:nodejs src/database/seeders ./src/database/seeders
COPY --chown=nodejs:nodejs src/database/config ./src/database/config
COPY --chown=nodejs:nodejs .sequelizerc ./.sequelizerc 2>/dev/null || true

# Create logs directory
RUN mkdir -p logs && \
    chown -R nodejs:nodejs logs && \
    chmod 755 logs

# Environment variables
ENV NODE_ENV=production \
    PORT=3001 \
    LOG_LEVEL=info

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/index.js"]

# -----------------------------------------------------------------------------
# Stage 6: Development Runtime with Hot Reload
# -----------------------------------------------------------------------------
FROM base AS development

LABEL maintainer="White Cross DevOps <devops@whitecross.com>"
LABEL description="White Cross Healthcare Platform - Development Backend"

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code (will be mounted as volume in docker-compose)
COPY . .

# Create logs directory
RUN mkdir -p logs && \
    chown -R nodejs:nodejs logs && \
    chmod 755 logs

# Environment variables
ENV NODE_ENV=development \
    PORT=3001 \
    LOG_LEVEL=debug

# Switch to non-root user
USER nodejs

# Expose port and debug port
EXPOSE 3001 9229

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start with nodemon for hot reload
CMD ["npm", "run", "dev"]

# -----------------------------------------------------------------------------
# Stage 7: Test Runtime for CI/CD
# -----------------------------------------------------------------------------
FROM base AS test

LABEL maintainer="White Cross DevOps <devops@whitecross.com>"
LABEL description="White Cross Healthcare Platform - Test Backend"

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Environment variables
ENV NODE_ENV=test \
    PORT=3001 \
    LOG_LEVEL=error

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Run tests
CMD ["npm", "test"]
