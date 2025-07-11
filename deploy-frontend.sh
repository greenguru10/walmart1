#!/bin/bash

# Frontend deployment script

echo "🚀 EcoScore Frontend Deployment Script"
echo "======================================"

# Check if deployment target is provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy-frontend.sh [vercel|netlify|github-pages] [backend-url]"
    echo ""
    echo "Available deployment options:"
    echo "  vercel        - Deploy to Vercel"
    echo "  netlify       - Deploy to Netlify"
    echo "  github-pages  - Deploy to GitHub Pages"
    exit 1
fi

PLATFORM=${1:-vercel}
BACKEND_URL=${2:-""}

# Update environment variables if backend URL is provided
if [ ! -z "$BACKEND_URL" ]; then
    echo "📝 Updating backend URL to: $BACKEND_URL"
    sed -i.bak "s|BACKEND_URL=.*|BACKEND_URL=$BACKEND_URL|" .env.local
    echo "BACKEND_URL=$BACKEND_URL" > .env.production
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

case "$PLATFORM" in
    "vercel")
        echo "▲ Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        # Build the application
        echo "🔨 Building application..."
        npm run build
        
        # Deploy to Vercel
        echo "🚀 Deploying to Vercel..."
        vercel --prod
        
        echo "✅ Vercel deployment complete!"
        echo "🌐 Your app is now live on Vercel"
        ;;
        
    "netlify")
        echo "🌐 Deploying to Netlify..."
        
        # Check if Netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            echo "📦 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        # Build the application
        echo "🔨 Building application..."
        npm run build
        
        # Deploy to Netlify
        echo "🚀 Deploying to Netlify..."
        netlify deploy --prod --dir=out
        
        echo "✅ Netlify deployment complete!"
        echo "🌐 Your app is now live on Netlify"
        ;;
        
    "github-pages")
        echo "🐙 Preparing for GitHub Pages..."
        
        # Add GitHub Pages configuration
        cat > next.config.mjs << EOF
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/walmart-ecoscore-app' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/walmart-ecoscore-app' : '',
}

export default nextConfig
EOF
        
        # Build the project
        npm run build
        
        echo "📁 Static files ready in 'out' directory"
        echo "📋 Next steps for GitHub Pages:"
        echo "1. Push your code to GitHub"
        echo "2. Go to Settings > Pages in your repository"
        echo "3. Select 'Deploy from a branch'"
        echo "4. Choose 'gh-pages' branch"
        echo "5. Your site will be available at: https://yourusername.github.io/walmart-ecoscore-app"
        ;;
        
    *)
        echo "❌ Unknown deployment target: $PLATFORM"
        echo "Available options: vercel, netlify, github-pages"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo "📋 Next steps:"
echo "1. Test your deployed frontend"
echo "2. Verify barcode scanning functionality"
echo "3. Check that backend integration works"

if [ -z "$BACKEND_URL" ]; then
    echo ""
    echo "⚠️  Remember to update BACKEND_URL in your environment variables"
    echo "   with your deployed backend URL for production use"
fi
