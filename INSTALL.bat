@echo off
echo ============================================
echo   REELVAULT - Dependency Installation
echo ============================================
echo.

echo [1/2] Installing backend dependencies...
cd /d "%~dp0server"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/2] Installing frontend dependencies...
cd /d "%~dp0client"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo ============================================
echo   Installation Complete!
echo ============================================
echo.
echo Next steps:
echo   1. Configure your MongoDB URI in server\.env
echo   2. Run START-BACKEND.bat (in a new terminal)
echo   3. Run START-FRONTEND.bat (in a new terminal)
echo   4. Open http://localhost:5173 in your browser
echo.
echo Optional: Run SEED-DATABASE.bat to add sample movies
echo.
pause
