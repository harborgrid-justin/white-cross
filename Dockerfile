# White Cross Healthcare Platform - Multi-stage Production Dockerfile
# Optimized for security, size, and performance

# Stage 1: Base image with common dependencies
FROM node:18-alpine AS base

# Install security updates and required system dependencies
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    dumb-init \
    curl \
    postgresql-client && \
    rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Stage 2: Backend dependencies
FROM base AS backend-deps

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 3: Backend build
FROM base AS backend-build

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY backend/ ./

# Build backend
RUN npm run build && \
    rm -rf src tests

# Stage 4: Frontend dependencies
FROM node:18-alpine AS frontend-deps

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 5: Frontend build
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY frontend/ ./

# Build arguments for environment-specific builds
ARG VITE_API_URL
ARG VITE_ENV=production
ARG VITE_SENTRY_DSN

# Set environment variables for build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_ENV=${VITE_ENV}
ENV VITE_SENTRY_DSN=${VITE_SENTRY_DSN}

# Build frontend
RUN npm run build && \
    rm -rf src node_modules

# Stage 6: Final production image
FROM base AS production

LABEL maintainer="White Cross DevOps <devops@whitecross.com>"
LABEL description="White Cross Healthcare Platform - Production Backend"
LABEL version="1.0.0"

# Set working directory
WORKDIR /app

# Copy production backend dependencies
COPY --from=backend-deps --chown=nodejs:nodejs /app/backend/node_modules ./node_modules

# Copy built backend
COPY --from=backend-build --chown=nodejs:nodejs /app/backend/dist ./dist
COPY --from=backend-build --chown=nodejs:nodejs /app/backend/package*.json ./

# Copy database migrations and seeders
COPY --chown=nodejs:nodejs backend/migrations ./migrations
COPY --chown=nodejs:nodejs backend/seeders ./seeders
COPY --chown=nodejs:nodejs backend/.sequelizerc ./.sequelizerc

# Create logs directory
RUN mkdir -p logs && \
    chown -R nodejs:nodejs logs

# Environment variables (will be overridden at runtime)
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

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/index.js"]

# Development stage for local development with hot reload
FROM base AS development

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install all dependencies including dev dependencies
RUN npm ci

# Copy source code
COPY backend/ ./

# Switch to non-root user
USER nodejs

# Expose port and debug port
EXPOSE 3001 9229

# Start with nodemon for hot reload
CMD ["npm", "run", "dev"]
