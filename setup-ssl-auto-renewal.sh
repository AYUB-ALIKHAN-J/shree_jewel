#!/bin/bash

#############################################
# SSL Auto-Renewal Setup Script
# Sets up automatic SSL renewal via cron
#############################################

# Configuration
SCRIPT_PATH="/root/sjp-project/renew-ssl.sh"
CRON_SCHEDULE="0 3 * * 1"  # Run every Monday at 3 AM

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SSL Auto-Renewal Setup${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if script is run as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}ERROR: This script must be run as root${NC}"
    exit 1
fi

# Copy renewal script to VPS
echo -e "${YELLOW}Copying renewal script to VPS...${NC}"
if [ -f "renew-ssl.sh" ]; then
    cp renew-ssl.sh "$SCRIPT_PATH"
    chmod +x "$SCRIPT_PATH"
    echo -e "${GREEN}✓ Script copied to ${SCRIPT_PATH}${NC}"
else
    echo -e "${RED}ERROR: renew-ssl.sh not found in current directory${NC}"
    exit 1
fi

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "$SCRIPT_PATH"; then
    echo -e "${YELLOW}Cron job already exists. Updating...${NC}"
    # Remove old entry
    crontab -l | grep -v "$SCRIPT_PATH" | crontab -
fi

# Add new cron job
echo -e "${YELLOW}Adding cron job for automatic renewal...${NC}"
(crontab -l 2>/dev/null; echo "$CRON_SCHEDULE $SCRIPT_PATH >> /var/log/ssl-renewal-cron.log 2>&1") | crontab -

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Cron job added successfully!${NC}"
    echo -e "${GREEN}Schedule: Every Monday at 3:00 AM${NC}"
else
    echo -e "${RED}✗ Failed to add cron job${NC}"
    exit 1
fi

# Display current crontab
echo -e "\n${YELLOW}Current crontab:${NC}"
crontab -l | grep "$SCRIPT_PATH"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\nSSL certificates will be automatically renewed every Monday at 3:00 AM"
echo -e "Logs will be saved to: /var/log/ssl-renewal-cron.log"
echo -e "\nTo manually run renewal: sudo $SCRIPT_PATH"
echo -e "To check cron jobs: crontab -l"
echo -e "To remove auto-renewal: crontab -e (then delete the line)"

exit 0
