#!/bin/bash

echo "🚀 Starting Enhanced Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check system requirements
print_step "Checking system requirements..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed!"
    exit 1
fi

# Check if SSL certificates exist
if [ ! -f "./ssl/cert.pem" ] || [ ! -f "./ssl/key.pem" ]; then
    print_warning "SSL certificates not found. Generating self-signed certificates..."
    mkdir -p ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem -subj "/C=IN/ST=State/L=City/O=Organization/CN=http://139.59.34.72/"
fi

# Stop existing containers
print_step "Stopping existing containers..."
docker-compose down

# Remove old images and containers
print_step "Cleaning up old images and containers..."
docker system prune -f
docker volume prune -f

# Install new dependencies
print_step "Installing new security dependencies..."
docker-compose run --rm server npm install hpp xss-clean

# Build and start containers
print_step "Building and starting containers with enhanced security..."
docker-compose up --build -d

# Wait for containers to be ready
print_step "Waiting for containers to be ready..."
sleep 20

# Check container status
print_step "Checking container status..."
docker-compose ps

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    print_status "Containers are running successfully!"
else
    print_error "Some containers failed to start. Check logs:"
    docker-compose logs
    exit 1
fi

# Enhanced health checks
print_step "Performing enhanced health checks..."

# Test API health endpoint
print_status "Testing API health endpoint..."
HEALTH_RESPONSE=$(curl -k -s https://http://139.59.34.72/:5000/health)
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    print_status "✅ API health check passed!"
    echo "Health details:"
    echo "$HEALTH_RESPONSE" | jq '.' 2>/dev/null || echo "$HEALTH_RESPONSE"
else
    print_warning "⚠️ API health check failed or returned unhealthy status"
    echo "Response: $HEALTH_RESPONSE"
fi

# Test frontend HTTPS
print_status "Testing frontend HTTPS..."
if curl -k -s https://http://139.59.34.72/:3443 > /dev/null 2>&1; then
    print_status "✅ Frontend HTTPS is accessible!"
else
    print_warning "⚠️ Frontend HTTPS check failed"
fi

# Test security headers
print_status "Testing security headers..."
SECURITY_HEADERS=$(curl -k -I https://http://139.59.34.72/:3443 2>/dev/null)
if echo "$SECURITY_HEADERS" | grep -q "Strict-Transport-Security"; then
    print_status "✅ HSTS header present"
else
    print_warning "⚠️ HSTS header missing"
fi

if echo "$SECURITY_HEADERS" | grep -q "X-Frame-Options"; then
    print_status "✅ X-Frame-Options header present"
else
    print_warning "⚠️ X-Frame-Options header missing"
fi

# Test rate limiting
print_status "Testing rate limiting..."
RATE_LIMIT_TEST=$(curl -k -s -w "%{http_code}" https://http://139.59.34.72/:5000/api/auth/login -o /dev/null)
if [ "$RATE_LIMIT_TEST" = "429" ]; then
    print_status "✅ Rate limiting is working (429 response expected)"
else
    print_warning "⚠️ Rate limiting test inconclusive"
fi

# Show recent logs
print_step "Recent logs:"
docker-compose logs --tail=10

# Performance check
print_step "Checking container resource usage..."
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

echo ""
print_status "🔒 Enhanced deployment completed!"
echo "🌐 Frontend (HTTP): http://http://139.59.34.72/:3000"
echo "🔒 Frontend (HTTPS): https://http://139.59.34.72/:3443"
echo "🔧 API (HTTPS): https://http://139.59.34.72/:5000"
echo "🏥 Health Check: https://http://139.59.34.72/:5000/health"
echo ""
print_status "🔒 Security Enhancements Added:"
echo "  ✅ Enhanced rate limiting (auth: 5/min, API: 100/15min)"
echo "  ✅ XSS protection (xss-clean)"
echo "  ✅ HTTP Parameter Pollution protection (hpp)"
echo "  ✅ Enhanced security headers"
echo "  ✅ Environment variable validation"
echo "  ✅ Comprehensive health monitoring"
echo "  ✅ Performance optimizations"
echo ""
print_warning "Remember to:"
echo "1. Update JWT_SECRET and SESSION_SECRET with real values"
echo "2. Replace SSL certificates with valid ones for production"
echo "3. Configure monitoring and alerting"
echo "4. Set up automated backups" 