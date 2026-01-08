#!/bin/bash

echo "======================================"
echo "Video Installation App - Easy Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Node.js is installed (version $(node -v))"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "📹 Next steps:"
    echo "1. Add your 5 video files to src/videos/"
    echo "2. Run: npm start (to test)"
    echo "3. Run: npm run build:mac (to create standalone app)"
    echo ""
    echo "Press any key to test the app now..."
    read -n 1 -s
    npm start
else
    echo ""
    echo "❌ Installation failed!"
    echo "Please check the error messages above."
    exit 1
fi
