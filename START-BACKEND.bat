@echo off
echo ============================================
echo   REELVAULT Backend Server
echo ============================================
echo.
echo Starting Express API server on port 5000...
echo Make sure MongoDB is running and server\.env is configured!
echo.
cd /d "%~dp0server"
npm run dev
pause
