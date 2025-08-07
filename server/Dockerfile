# Dockerfile for Node.js/Express backend
FROM node:18-alpine

# Set working directory
WORKDIR /server

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# The backend server should NOT handle SSL. Nginx does this.
#The following lines have been removed.
RUN mkdir -p /etc/ssl/certs /etc/ssl/private
COPY fullchain.pem /etc/ssl/certs/
COPY privkey.pem /etc/ssl/private/

# Expose port  
EXPOSE 5000

# Set environment variables (can be overridden in docker-compose)
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
