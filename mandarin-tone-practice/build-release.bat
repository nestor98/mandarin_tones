@echo off
setlocal enabledelayedexpansion
echo ============================
echo Building Mandarin Tone App
echo ============================

REM Ask for target (default: android)
set TARGET=%1
if "%TARGET%"=="" (
    echo Choose build target:
    echo   1. Android (default)
    echo   2. GitHub Pages
    set /p CHOICE="Enter choice (1 or 2): "
    if "%CHOICE%"=="2" (
        set TARGET=ghpages
    ) else (
        set TARGET=android
    )
)

echo.
echo ===== Target selected: %TARGET% =====
echo.

REM Step 1: Clean old build
echo Cleaning old build...
rmdir /s /q dist 2>nul

REM Step 2: Build React (Vite)
if "%TARGET%"=="ghpages" (
    echo Running Vite build for GitHub Pages...
    call npx vite build --mode ghpages
) else (
    echo Running Vite build for Android...
    call npx vite build
)
if errorlevel 1 (
    echo ❌ React build failed.
    exit /b 1
)

REM Step 3: If Android, copy to Capacitor
if "%TARGET%"=="android" (
    echo Copying web assets to Android project...
    call npx cap copy
    if errorlevel 1 (
        echo ❌ Capacitor copy failed.
        exit /b 1
    )

    echo Syncing Capacitor Android project...
    call npx cap sync android
    if errorlevel 1 (
        echo ❌ Capacitor sync failed.
        exit /b 1
    )

    echo Opening Android Studio...
    call npx cap open android
    if errorlevel 1 (
        echo ❌ Failed to open Android Studio.
        exit /b 1
    )
)

echo ============================
echo ✅ Build completed successfully!
if "%TARGET%"=="android" (
    echo Android Studio has been opened.
) else (
    echo Your GitHub Pages build is ready in: dist\
)
echo ============================
pause
