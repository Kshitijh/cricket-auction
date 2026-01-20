#!/bin/bash

# Cricket Auction Manager - Installation Script
# This script sets up and runs the Cricket Auction application

echo "🏏 Cricket Auction Manager - Installation"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
echo "This may take a few minutes..."
echo ""

# Install dependencies
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "=========================================="
    echo "🎉 Installation Complete!"
    echo "=========================================="
    echo ""
    echo "To start the application, run:"
    echo "  npm start"
    echo ""
    echo "The app will open at http://localhost:3000"
    echo ""
    echo "📚 Quick Start:"
    echo "  1. Click 'Admin Panel' button"
    echo "  2. Go to 'Settings' tab"
    echo "  3. Click 'Load Dummy Data'"
    echo "  4. Start auctioning players!"
    echo ""
    echo "For detailed instructions, see:"
    echo "  - QUICK_START.md"
    echo "  - AUCTION_README.md"
    echo ""
    echo "Happy Auctioning! 🏏"
else
    echo ""
    echo "❌ Installation failed!"
    echo "Please check the error messages above"
    exit 1
fi
