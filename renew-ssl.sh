#!/bin/bash

#############################################
# SSL Certificate Renewal Script
# For: shreejewelpalace.com
# Uses: Certbot with Let's Encrypt
#############################################

# Configuration
DOMAIN="shreejewelpalace.com"
WWW_DOMAIN="www.shreejewelpalace.com"
EMAIL="your-email@example.com"  # Change this to your email
SSL_DIR="/root/sjp-project/ssl"
DOCKER_COMPOSE_DIR="/root/sjp-project"
CERTBOT_DIR="/etc/letsencrypt/live/${DOMAIN}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Log file
LOG_FILE="/var/log/ssl-renewal-$(date +%Y%m%d-%H%M%S).log"

# Function to log messages
log_message() {
    echo -e "${2}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

# Function to check if script is run as root
check_root() {
    if [ "$EUID" -ne 0 ]; then 
        log_message "ERROR: This script must be run as root" "$RED"
        exit 1
    fi
}

# Function to check if certbot is installed
check_certbot() {
    if ! command -v certbot &> /dev/null; then
        log_message "ERROR: Certbot is not installed" "$RED"
        log_message "Install it with: snap install --classic certbot" "$YELLOW"
        exit 1
    fi
    log_message "Certbot is installed" "$GREEN"
}

# Function to stop Docker containers
stop_containers() {
    log_message "Stopping Docker containers..." "$YELLOW"
    cd "$DOCKER_COMPOSE_DIR" || exit 1
    docker compose down
    sleep 5
    log_message "Containers stopped" "$GREEN"
}

# Function to start Docker containers
start_containers() {
    log_message "Starting Docker containers..." "$YELLOW"
    cd "$DOCKER_COMPOSE_DIR" || exit 1
    docker compose up -d
    sleep 10
    log_message "Containers started" "$GREEN"
}

# Function to renew certificate
renew_certificate() {
    log_message "Starting certificate renewal process..." "$YELLOW"
    
    # Renew certificate (Certbot will only renew if certificate is due for renewal)
    certbot renew --standalone --preferred-challenges http --quiet
    
    if [ $? -eq 0 ]; then
        log_message "Certificate renewal completed successfully" "$GREEN"
        return 0
    else
        log_message "Certificate renewal failed or not needed yet" "$YELLOW"
        return 1
    fi
}

# Function to obtain new certificate (first time setup)
obtain_certificate() {
    log_message "Obtaining new certificate..." "$YELLOW"
    
    certbot certonly --standalone \
        --preferred-challenges http \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "$WWW_DOMAIN"
    
    if [ $? -eq 0 ]; then
        log_message "Certificate obtained successfully" "$GREEN"
        return 0
    else
        log_message "Failed to obtain certificate" "$RED"
        return 1
    fi
}

# Function to copy certificates to ssl directory
copy_certificates() {
    log_message "Copying certificates to SSL directory..." "$YELLOW"
    
    # Check if certificates exist
    if [ ! -f "${CERTBOT_DIR}/fullchain.pem" ] || [ ! -f "${CERTBOT_DIR}/privkey.pem" ]; then
        log_message "ERROR: Certificate files not found in ${CERTBOT_DIR}" "$RED"
        return 1
    fi
    
    # Create SSL directory if it doesn't exist
    mkdir -p "$SSL_DIR"
    
    # Backup existing certificates
    if [ -f "${SSL_DIR}/fullchain.pem" ]; then
        log_message "Backing up existing certificates..." "$YELLOW"
        cp "${SSL_DIR}/fullchain.pem" "${SSL_DIR}/fullchain.pem.backup.$(date +%Y%m%d-%H%M%S)"
        cp "${SSL_DIR}/privkey.pem" "${SSL_DIR}/privkey.pem.backup.$(date +%Y%m%d-%H%M%S)"
    fi
    
    # Copy new certificates
    cp "${CERTBOT_DIR}/fullchain.pem" "${SSL_DIR}/fullchain.pem"
    cp "${CERTBOT_DIR}/privkey.pem" "${SSL_DIR}/privkey.pem"
    
    # Set proper permissions
    chmod 644 "${SSL_DIR}/fullchain.pem"
    chmod 600 "${SSL_DIR}/privkey.pem"
    
    if [ $? -eq 0 ]; then
        log_message "Certificates copied successfully to ${SSL_DIR}" "$GREEN"
        return 0
    else
        log_message "Failed to copy certificates" "$RED"
        return 1
    fi
}

# Function to verify certificates
verify_certificates() {
    log_message "Verifying certificates..." "$YELLOW"
    
    # Check certificate expiration
    EXPIRY_DATE=$(openssl x509 -enddate -noout -in "${SSL_DIR}/fullchain.pem" | cut -d= -f2)
    log_message "Certificate expires on: $EXPIRY_DATE" "$GREEN"
    
    # Check if certificate is valid for domain
    CERT_DOMAIN=$(openssl x509 -noout -subject -in "${SSL_DIR}/fullchain.pem" | grep -oP 'CN\s*=\s*\K[^,]+')
    log_message "Certificate issued for: $CERT_DOMAIN" "$GREEN"
    
    return 0
}

# Function to reload nginx in container
reload_nginx() {
    log_message "Reloading Nginx in container..." "$YELLOW"
    
    # Find the client container
    CLIENT_CONTAINER=$(docker ps --filter "name=client" --format "{{.Names}}" | head -n 1)
    
    if [ -z "$CLIENT_CONTAINER" ]; then
        log_message "WARNING: Client container not found, skipping Nginx reload" "$YELLOW"
        return 1
    fi
    
    # Reload Nginx
    docker exec "$CLIENT_CONTAINER" nginx -s reload
    
    if [ $? -eq 0 ]; then
        log_message "Nginx reloaded successfully" "$GREEN"
        return 0
    else
        log_message "Failed to reload Nginx" "$RED"
        return 1
    fi
}

# Main execution
main() {
    log_message "========================================" "$GREEN"
    log_message "SSL Certificate Renewal Script Started" "$GREEN"
    log_message "========================================" "$GREEN"
    
    # Check prerequisites
    check_root
    check_certbot
    
    # Stop containers to free port 80
    stop_containers
    
    # Renew certificate
    renew_certificate
    RENEWAL_RESULT=$?
    
    # If renewal was successful or certificate exists
    if [ $RENEWAL_RESULT -eq 0 ] || [ -f "${CERTBOT_DIR}/fullchain.pem" ]; then
        # Copy certificates
        copy_certificates
        
        if [ $? -eq 0 ]; then
            # Verify certificates
            verify_certificates
            
            # Start containers
            start_containers
            
            # Reload nginx
            sleep 5
            reload_nginx
            
            log_message "========================================" "$GREEN"
            log_message "SSL renewal completed successfully!" "$GREEN"
            log_message "========================================" "$GREEN"
        else
            log_message "Failed to copy certificates. Please check logs." "$RED"
            start_containers
            exit 1
        fi
    else
        log_message "Certificate renewal not needed or failed" "$YELLOW"
        start_containers
    fi
    
    log_message "Log file saved to: $LOG_FILE" "$GREEN"
}

# Run main function
main

exit 0
