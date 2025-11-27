# SSL Certificate Renewal Guide for shreejewelpalace.com

## Overview
Automated SSL certificate renewal using Certbot and Let's Encrypt for your Shree Jewel Palace website.

## Files Included
- `renew-ssl.sh` - Main SSL renewal script
- `setup-ssl-auto-renewal.sh` - Automated setup with cron job

## Prerequisites
- Certbot installed via snap: `sudo snap install --classic certbot`
- Docker and Docker Compose installed
- Root access to VPS
- Domain pointing to your server IP

## Initial Setup

### 1. Update Email in Script
Edit `renew-ssl.sh` and change this line:
```bash
EMAIL="your-email@example.com"  # Change to your actual email
```

### 2. Upload Scripts to VPS
```bash
# From your local machine
scp renew-ssl.sh root@your-vps-ip:/root/sjp-project/
scp setup-ssl-auto-renewal.sh root@your-vps-ip:/root/sjp-project/
```

### 3. Make Scripts Executable
```bash
# On your VPS
ssh root@your-vps-ip
cd /root/sjp-project
chmod +x renew-ssl.sh
chmod +x setup-ssl-auto-renewal.sh
```

## First Time Certificate Obtainment

If you don't have certificates yet, the script will automatically obtain them:

```bash
sudo /root/sjp-project/renew-ssl.sh
```

## Manual Renewal

To manually renew certificates:
```bash
sudo /root/sjp-project/renew-ssl.sh
```

## Automatic Renewal Setup

To set up automatic renewal (runs every Monday at 3 AM):
```bash
sudo /root/sjp-project/setup-ssl-auto-renewal.sh
```

## What the Script Does

1. **Stops Docker Containers** - Frees port 80 for Certbot
2. **Renews Certificate** - Uses Certbot standalone mode
3. **Copies Certificates** - Copies to `/root/sjp-project/ssl/`
4. **Backs Up Old Certificates** - Creates timestamped backups
5. **Sets Permissions** - Ensures proper file permissions
6. **Restarts Containers** - Brings services back up
7. **Reloads Nginx** - Applies new certificates without downtime
8. **Logs Everything** - Saves logs to `/var/log/ssl-renewal-*.log`

## Certificate Locations

### Let's Encrypt Original
- `/etc/letsencrypt/live/shreejewelpalace.com/fullchain.pem`
- `/etc/letsencrypt/live/shreejewelpalace.com/privkey.pem`

### Your Project (Copied to)
- `/root/sjp-project/ssl/fullchain.pem`
- `/root/sjp-project/ssl/privkey.pem`

## Checking Certificate Status

```bash
# View certificate expiration
sudo certbot certificates

# Check certificate details
openssl x509 -text -noout -in /root/sjp-project/ssl/fullchain.pem

# View expiration date only
openssl x509 -enddate -noout -in /root/sjp-project/ssl/fullchain.pem
```

## Viewing Logs

```bash
# View latest renewal log
sudo ls -lt /var/log/ssl-renewal-*.log | head -1 | xargs cat

# View cron job logs
sudo tail -f /var/log/ssl-renewal-cron.log
```

## Cron Job Management

```bash
# View current cron jobs
crontab -l

# Edit cron jobs
crontab -e

# Remove auto-renewal
crontab -e  # Delete the line with renew-ssl.sh
```

## Troubleshooting

### Port 80 Already in Use
The script automatically stops Docker containers to free port 80. If still blocked:
```bash
sudo netstat -tulpn | grep :80
sudo docker compose down
```

### Certificate Not Renewed
Certificates are only renewed if they expire within 30 days. To force renewal:
```bash
sudo certbot renew --force-renewal --standalone
```

### Container Not Starting
Check Docker logs:
```bash
cd /root/sjp-project
docker compose logs -f
```

### Nginx Not Reloading
Manually reload:
```bash
docker exec sjp-project-client-1 nginx -s reload
```

## Certificate Renewal Schedule

Let's Encrypt certificates are valid for 90 days. The script:
- Checks for renewal every Monday at 3 AM
- Renews if certificate expires within 30 days
- Automatically applies new certificates

## Security Notes

1. **Backup Certificates** - Old certificates are automatically backed up with timestamps
2. **Permissions** - `fullchain.pem` (644), `privkey.pem` (600)
3. **Email Alerts** - Certbot sends expiration warnings to your email
4. **Logs** - All operations are logged for audit trail

## Testing the Setup

```bash
# Test renewal without actually renewing
sudo certbot renew --dry-run --standalone

# Test the renewal script
sudo /root/sjp-project/renew-ssl.sh
```

## Support

For issues with:
- **Certbot**: https://certbot.eff.org/docs/
- **Let's Encrypt**: https://letsencrypt.org/docs/
- **Docker**: https://docs.docker.com/

## Important Reminders

✅ Update your email in the script before first run  
✅ Ensure domain DNS points to your server  
✅ Keep port 80 accessible from the internet  
✅ Monitor logs regularly  
✅ Test renewal with `--dry-run` first  

---

**Last Updated:** November 5, 2025  
**Domain:** shreejewelpalace.com, www.shreejewelpalace.com  
**Certificate Authority:** Let's Encrypt
