@echo off
REM Cricket Auction Manager - Windows Installation Script

echo.
echo 🏏 Cricket Auction Manager - Installation
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node -v
npm -v
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found!
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
echo This may take a few minutes...
echo.

REM Install dependencies
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Dependencies installed successfully!
    echo.
    echo ==========================================
    echo 🎉 Installation Complete!
    echo ==========================================
    echo.
    echo To start the application, run:
    echo   npm start
    echo.
    echo The app will open at http://localhost:3000
    echo.
    echo 📚 Quick Start:
    echo   1. Click 'Admin Panel' button
    echo   2. Go to 'Settings' tab
    echo   3. Click 'Load Dummy Data'
    echo   4. Start auctioning players!
    echo.
    echo For detailed instructions, see:
    echo   - QUICK_START.md
    echo   - AUCTION_README.md
    echo.
    echo Happy Auctioning! 🏏
    echo.
) else (
    echo.
    echo ❌ Installation failed!
    echo Please check the error messages above
    pause
    exit /b 1
)

pause
