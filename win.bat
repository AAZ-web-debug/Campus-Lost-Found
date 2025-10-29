@echo off
REM ============================================
REM Campus Lost & Found - Windows Setup Script
REM ============================================

echo.
echo ========================================
echo Campus Lost ^& Found - Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detected: 
node --version
echo [OK] npm detected: 
npm --version
echo.

REM Create uploads directory if it doesn't exist
if not exist "uploads" mkdir uploads
echo [OK] Created uploads directory
echo.

REM Install backend dependencies
echo ========================================
echo Installing Backend Dependencies...
echo ========================================
cd backend
if exist "package.json" (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Backend installation failed!
        cd ..
        pause
        exit /b 1
    )
    echo [OK] Backend dependencies installed successfully
) else (
    echo ERROR: backend/package.json not found!
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

REM Install frontend dependencies
echo ========================================
echo Installing Frontend Dependencies...
echo This may take several minutes...
echo ========================================
cd frontend
if exist "package.json" (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Frontend installation failed!
        cd ..
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed successfully
) else (
    echo ERROR: frontend/package.json not found!
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

REM Setup complete
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo   1. Run 'run.bat' to start both servers automatically
echo   OR
echo   2. Open two command prompts:
echo      - Window 1: cd backend ^&^& npm start
echo      - Window 2: cd frontend ^&^& npm start
echo.
echo The application will be available at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo ========================================
pause
