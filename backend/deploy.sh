#!/bin/bash

# EcoScore Backend Deployment Script
# Usage: ./deploy.sh [platform]
# Platforms: railway, render, heroku, vercel, docker

set -e

PLATFORM=${1:-railway}

echo "🚀 Deploying EcoScore Backend to $PLATFORM..."

case $PLATFORM in
  "railway")
    echo "📡 Deploying to Railway..."
    if ! command -v railway &> /dev/null; then
      echo "Installing Railway CLI..."
      npm install -g @railway/cli
    fi
    railway login
    railway up
    echo "✅ Deployed to Railway!"
    ;;
    
  "render")
    echo "🎨 Deploying to Render..."
    echo "Please push to your Git repository and connect it to Render"
    echo "Render will automatically deploy using render.yaml"
    ;;
    
  "heroku")
    echo "🟣 Deploying to Heroku..."
    if ! command -v heroku &> /dev/null; then
      echo "Please install Heroku CLI first"
      exit 1
    fi
    
    # Create Procfile
    echo "web: python app.py" > Procfile
    
    heroku create ecoscore-backend-$(date +%s)
    heroku buildpacks:set heroku/python
    git add .
    git commit -m "Deploy to Heroku" || true
    git push heroku main
    echo "✅ Deployed to Heroku!"
    ;;
    
  "vercel")
    echo "▲ Deploying to Vercel..."
    if ! command -v vercel &> /dev/null; then
      echo "Installing Vercel CLI..."
      npm install -g vercel
    fi
    vercel --prod
    echo "✅ Deployed to Vercel!"
    ;;
    
  "docker")
    echo "🐳 Building and running with Docker..."
    docker-compose up --build -d
    echo "✅ Running with Docker!"
    echo "Backend available at: http://localhost:5000"
    ;;
    
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Available platforms: railway, render, heroku, vercel, docker"
    exit 1
    ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo "📋 Next steps:"
echo "1. Test your backend endpoint"
echo "2. Update your frontend .env.local with the backend URL"
echo "3. Deploy your frontend"
