# Multi-stage build for Quasar SPA
# Stage 1: Build the application
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install serve and PM2 globally
RUN npm install -g pm2

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

ENV NODE_ENV production

# Expose port
EXPOSE 3000

# Start the application
CMD ["pm2-runtime",'ecosystem.config.mjs']
