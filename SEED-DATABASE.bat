@echo off
echo ============================================
echo   REELVAULT - Seed Database
echo ============================================
echo.
echo Adding 10 sample movies to MongoDB...
echo Make sure the backend server is configured and MongoDB is running.
echo.
cd /d "%~dp0server"
node seed.js
echo.
pause
