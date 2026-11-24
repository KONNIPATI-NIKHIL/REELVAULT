@echo off
echo ============================================
echo   REELVAULT Frontend (Vite Dev Server)
echo ============================================
echo.
echo Starting React development server on port 5173...
echo.
cd /d "%~dp0client"
npm run dev
pause
