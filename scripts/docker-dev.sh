#!/bin/bash

# =============================================================================
# White Cross Healthcare Platform - Docker Development Startup Script
# Comprehensive setup and debugging for Next.js + Backend containers
# =============================================================================

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}White Cross Healthcare Platform - Docker Development Setup${NC}"
echo -e "${BLUE}==============================================================================${NC}"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker Desktop first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Function to clean up existing containers
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up existing containers...${NC}"
    docker-compose -f docker-compose.nextjs.yml down --remove-orphans || true
    docker system prune -f > /dev/null 2>&1 || true
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Function to build and start services
start_services() {
    echo -e "${YELLOW}🔨 Building and starting services...${NC}"
    
    # Load environment variables
    if [ -f .env.docker ]; then
        set -a
        source .env.docker
        set +a
        echo -e "${GREEN}✅ Loaded environment variables${NC}"
    else
        echo -e "${YELLOW}⚠️  No .env.docker file found, using defaults${NC}"
    fi
    
    # Build and start services in correct order
    docker-compose -f docker-compose.nextjs.yml up --build -d postgres redis
    
    echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
    sleep 10
    
    docker-compose -f docker-compose.nextjs.yml up --build -d backend
    
    echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
    sleep 15
    
    docker-compose -f docker-compose.nextjs.yml up --build -d nextjs
    
    echo -e "${GREEN}✅ All services started${NC}"
}

# Function to show service status
show_status() {
    echo -e "${BLUE}📊 Service Status:${NC}"
    docker-compose -f docker-compose.nextjs.yml ps
    
    echo -e "\n${BLUE}🔗 Service URLs:${NC}"
    echo -e "Frontend (Next.js): ${GREEN}http://localhost:3000${NC}"
    echo -e "Backend API: ${GREEN}http://localhost:3001/api/v1${NC}"
    echo -e "Database: ${GREEN}localhost:5432${NC}"
    echo -e "Redis: ${GREEN}localhost:6379${NC}"
}

# Function to test connectivity
test_connectivity() {
    echo -e "\n${BLUE}🔍 Testing service connectivity...${NC}"
    
    # Test backend health
    echo -e "${YELLOW}Testing backend health endpoint...${NC}"
    if curl -f -s http://localhost:3001/api/v1/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend health check passed${NC}"
    else
        echo -e "${RED}❌ Backend health check failed${NC}"
    fi
    
    # Test Next.js
    echo -e "${YELLOW}Testing Next.js application...${NC}"
    if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Next.js application accessible${NC}"
    else
        echo -e "${RED}❌ Next.js application not accessible${NC}"
    fi
    
    # Test internal container communication
    echo -e "${YELLOW}Testing container-to-container communication...${NC}"
    if docker-compose -f docker-compose.nextjs.yml exec -T nextjs curl -f -s http://backend:3001/api/v1/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Internal container communication working${NC}"
    else
        echo -e "${RED}❌ Internal container communication failed${NC}"
    fi
}

# Function to show logs
show_logs() {
    echo -e "\n${BLUE}📋 Recent logs:${NC}"
    echo -e "${YELLOW}--- Backend Logs ---${NC}"
    docker-compose -f docker-compose.nextjs.yml logs --tail=20 backend
    
    echo -e "\n${YELLOW}--- Next.js Logs ---${NC}"
    docker-compose -f docker-compose.nextjs.yml logs --tail=20 nextjs
}

# Function to enter debug container
enter_debug() {
    echo -e "${BLUE}🐛 Starting debug container...${NC}"
    docker-compose -f docker-compose.nextjs.yml --profile debug up -d debug
    echo -e "${GREEN}Debug container started. Use 'docker exec -it white-cross-debug /bin/bash' to enter.${NC}"
}

# Main execution
main() {
    cd "$ROOT_DIR"
    
    case "${1:-start}" in
        "start")
            check_docker
            cleanup
            start_services
            show_status
            test_connectivity
            ;;
        "stop")
            echo -e "${YELLOW}🛑 Stopping services...${NC}"
            docker-compose -f docker-compose.nextjs.yml down
            ;;
        "restart")
            echo -e "${YELLOW}🔄 Restarting services...${NC}"
            docker-compose -f docker-compose.nextjs.yml restart
            show_status
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs
            ;;
        "test")
            test_connectivity
            ;;
        "debug")
            enter_debug
            ;;
        "clean")
            cleanup
            docker volume prune -f
            docker image prune -f
            ;;
        *)
            echo -e "${BLUE}Usage: $0 [start|stop|restart|status|logs|test|debug|clean]${NC}"
            echo -e "  ${GREEN}start${NC}   - Build and start all services (default)"
            echo -e "  ${GREEN}stop${NC}    - Stop all services"
            echo -e "  ${GREEN}restart${NC} - Restart all services"
            echo -e "  ${GREEN}status${NC}  - Show service status and URLs"
            echo -e "  ${GREEN}logs${NC}    - Show recent logs from all services"
            echo -e "  ${GREEN}test${NC}    - Test connectivity between services"
            echo -e "  ${GREEN}debug${NC}   - Start debug container for network troubleshooting"
            echo -e "  ${GREEN}clean${NC}   - Clean up containers, volumes, and images"
            ;;
    esac
}

# Run main function with all arguments
main "$@"