#!/bin/bash
# Quick start script for development

echo "🎸 Starting Lingot Electron Tuner..."
echo ""
echo "Building project..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✓ Build successful!"
  echo ""
  echo "Starting Electron app..."
  npm run dev
else
  echo ""
  echo "✗ Build failed. Check errors above."
  exit 1
fi
