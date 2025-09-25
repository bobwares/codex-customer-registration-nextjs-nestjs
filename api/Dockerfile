# App: Customer Registration
# Package: api
# File: Dockerfile
# Version: 0.1.0
# Turns: 5
# Author: Codex Agent
# Date: 2025-09-25T20:43:14Z
# Exports: (image build)
# Description: Builds a production-ready NestJS image for the API service using npm ci and start:prod entrypoint.
#
# Simple production-ish image; adapt as needed
FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Expose Nest default port
EXPOSE 3000

# Use production start; for dev, prefer volume + start:dev in compose
CMD ["npm", "run", "start:prod"]
