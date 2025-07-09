@echo off
REM Desktop Commander CLI Runner for Windows

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Check if node_modules exists
if not exist "%SCRIPT_DIR%\node_modules" (
    echo Installing dependencies...
    cd /d "%SCRIPT_DIR%"
    call npm install
)

REM Run the CLI with all arguments passed to this script
cd /d "%SCRIPT_DIR%"
node cli.js %*