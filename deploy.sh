#!/bin/bash

echo "🏥 Physical Therapy Scheduler - Netlify Deployment"
echo "================================================="

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building for production..."
npm run build

echo "✅ Build completed successfully!"
echo ""
echo "📁 Your app is ready in the 'dist' folder"
echo ""
echo "🚀 Deployment Options:"
echo "1. Drag 'dist' folder to https://app.netlify.com"
echo "2. Or run: npm run preview (to test locally first)"
echo ""
echo "📝 Files ready for deployment:"
ls -la dist/

echo ""
echo "🎉 Ready to deploy to Netlify!"