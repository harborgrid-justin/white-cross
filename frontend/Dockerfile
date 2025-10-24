# =============================================================================
# White Cross Healthcare Platform - Frontend Dockerfile
# Multi-stage build for optimized production deployment with Nginx
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build Stage with Node.js and Vite
# -----------------------------------------------------------------------------
FROM node:18-alpine AS build

LABEL maintainer="White Cross DevOps <devops@whitecross.com>"
LABEL description="White Cross Healthcare Platform - Frontend Build Stage"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && \
    npm cache clean --force

# Copy source code
COPY . .

# Build arguments for environment configuration
ARG VITE_API_BASE_URL
ARG VITE_APP_ENVIRONMENT=production
ARG VITE_ENABLE_DEBUG_TOOLS=false
ARG VITE_ENABLE_ANALYTICS=true
ARG VITE_SENTRY_DSN

# Set environment variables for build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL:-http://localhost:3001/api}
ENV VITE_APP_ENVIRONMENT=${VITE_APP_ENVIRONMENT}
ENV VITE_ENABLE_DEBUG_TOOLS=${VITE_ENABLE_DEBUG_TOOLS}
ENV VITE_ENABLE_ANALYTICS=${VITE_ENABLE_ANALYTICS}
ENV VITE_SENTRY_DSN=${VITE_SENTRY_DSN}

# Build the application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production Runtime with Nginx
# -----------------------------------------------------------------------------
FROM nginx:1.25-alpine AS production

LABEL maintainer="White Cross DevOps <devops@whitecross.com>"
LABEL description="White Cross Healthcare Platform - Production Frontend"
LABEL version="1.0.0"

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create non-root user for nginx
RUN addgroup -g 1001 -S nginx-runner && \
    adduser -S nginx-runner -u 1001 -G nginx-runner && \
    chown -R nginx-runner:nginx-runner /usr/share/nginx/html && \
    chown -R nginx-runner:nginx-runner /var/cache/nginx && \
    chown -R nginx-runner:nginx-runner /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx-runner:nginx-runner /var/run/nginx.pid

# Switch to non-root user
USER nginx-runner

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# -----------------------------------------------------------------------------
# Stage 3: Development Runtime with Vite Dev Server
# -----------------------------------------------------------------------------
FROM node:18-alpine AS development

LABEL maintainer="White Cross DevOps <devops@whitecross.com>"
LABEL description="White Cross Healthcare Platform - Development Frontend"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code (will be mounted as volume in docker-compose)
COPY . .

# Environment variables
ENV VITE_APP_ENVIRONMENT=development
ENV VITE_ENABLE_DEBUG_TOOLS=true
ENV VITE_ENABLE_ANALYTICS=false

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
