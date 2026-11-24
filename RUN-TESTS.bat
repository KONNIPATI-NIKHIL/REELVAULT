@echo off
echo ============================================
echo   REELVAULT - Run Backend Tests
echo ============================================
echo.
echo Running Jest test suite (uses in-memory MongoDB)...
echo.
cd /d "%~dp0server"
npm test
echo.
pause
