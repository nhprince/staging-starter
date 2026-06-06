#!/bin/bash
set -e

echo "🚀 Deploying Saturday to server..."

cd ~/saturday

# Pull latest
git pull origin main

# Install dependencies
pnpm install

# Build frontend
cd frontend && pnpm build && cd ..

# Install backend deps
cd backend && pnpm install && cd ..

# Restart with PM2
mkdir -p logs
pm2 restart saturday 2>/dev/null || pm2 start server-deploy/ecosystem.config.js

echo "✅ Deployed to server"
echo "📊 PM2 status:"
pm2 status saturday
