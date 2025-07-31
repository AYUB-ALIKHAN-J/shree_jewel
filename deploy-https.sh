#!/bin/bash

echo "🔒 Starting HTTPS Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if SSL certificates exist
if [ ! -f "./ssl/cert.pem" ] || [ ! -f "./ssl/key.pem" ]; then
    print_error "SSL certificates not found!"
    print_status "Generating self-signed certificates..."
    mkdir -p ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem -subj "/C=IN/ST=State/L=City/O=Organization/CN=192.168.29.164"
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down

# Remove old images and containers
print_status "Cleaning up old images and containers..."
docker system prune -f
docker volume prune -f

# Build and start containers
print_status "Building and starting containers with HTTPS..."
docker-compose up --build -d

# Wait for containers to be ready
print_status "Waiting for containers to be ready..."
sleep 15

# Check container status
print_status "Checking container status..."
docker-compose ps

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    print_status "Containers are running successfully!"
else
    print_error "Some containers failed to start. Check logs:"
    docker-compose logs
    exit 1
fi

# Show recent logs
print_status "Recent logs:"
docker-compose logs --tail=10

# Health check
print_status "Performing HTTPS health check..."
sleep 5

# Test HTTPS endpoints
print_status "Testing HTTPS endpoints..."

# Test frontend HTTPS
if curl -k -s https://192.168.29.164:3443 > /dev/null 2>&1; then
    print_status "✅ Frontend HTTPS is accessible!"
else
    print_warning "⚠️ Frontend HTTPS check failed. This might be normal during startup."
fi

# Test API HTTPS
if curl -k -s https://192.168.29.164:5000 > /dev/null 2>&1; then
    print_status "✅ API HTTPS is accessible!"
else
    print_warning "⚠️ API HTTPS check failed. This might be normal if no endpoint exists."
fi

echo ""
print_status "🔒 HTTPS deployment completed!"
echo "🌐 Frontend (HTTP): http://192.168.29.164:3000"
echo "🔒 Frontend (HTTPS): https://192.168.29.164:3443"
echo "🔧 API (HTTPS): https://192.168.29.164:5000"
echo ""
print_warning "Note: Using self-signed certificates. Browsers will show security warnings."
print_warning "For production, replace with valid SSL certificates from Let's Encrypt or your domain provider." 