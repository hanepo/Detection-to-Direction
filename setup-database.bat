@echo off
REM Quick Setup Script for Detection to Direction
REM This script helps you set up the database quickly

echo ========================================
echo Detection to Direction - Quick Setup
echo ========================================
echo.

REM Check if MySQL is running
echo [1/4] Checking if MySQL is running...
netstat -an | find "3306" >nul
if errorlevel 1 (
    echo [ERROR] MySQL is not running!
    echo Please start MySQL in XAMPP Control Panel first.
    echo.
    pause
    exit /b 1
) else (
    echo [OK] MySQL is running on port 3306
)
echo.

REM Set MySQL path (adjust if your XAMPP is installed elsewhere)
set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe
set PROJECT_PATH=%~dp0

echo [2/4] Checking MySQL installation...
if not exist "%MYSQL_PATH%" (
    echo [ERROR] MySQL not found at %MYSQL_PATH%
    echo Please update the MYSQL_PATH in this script.
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Found MySQL at %MYSQL_PATH%
)
echo.

echo [3/4] Creating database and importing schema...
echo This will create the database and tables.
echo.
"%MYSQL_PATH%" -u root -p -e "source %PROJECT_PATH%sql\schema.sql"
if errorlevel 1 (
    echo [ERROR] Failed to create database schema!
    pause
    exit /b 1
) else (
    echo [OK] Database schema created successfully
)
echo.

echo [4/4] Importing seed data...
echo.
echo Importing questions...
"%MYSQL_PATH%" -u root -p -e "source %PROJECT_PATH%sql\seed_questions.sql"
if errorlevel 1 (
    echo [WARNING] Failed to import questions
) else (
    echo [OK] Questions imported successfully (70 questions)
)
echo.

echo Importing therapists...
"%MYSQL_PATH%" -u root -p -e "source %PROJECT_PATH%sql\seed_therapists.sql"
if errorlevel 1 (
    echo [WARNING] Failed to import therapists
) else (
    echo [OK] Therapists imported successfully (12 centers)
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm start
echo 2. Open: http://localhost:3000
echo.
echo Refer to SETUP_GUIDE.md for detailed instructions.
echo.
pause
