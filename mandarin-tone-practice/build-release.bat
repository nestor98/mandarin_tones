@echo off
echo ============================
echo Building Mandarin Tone App
echo ============================

REM Step 1: Clean old build
echo Cleaning old build...
rmdir /s /q dist 2>nul

REM Step 2: Build React (Vite)
echo Running npm build...
call npm run build
if errorlevel 1 (
  echo ❌ React build failed.
  exit /b 1
)

REM Step 3: Copy new web assets to Android (Capacitor)
echo Copying web assets to Android project...
call npx cap copy
if errorlevel 1 (
  echo ❌ Capacitor copy failed.
  exit /b 1
)

REM Step 4: Sync dependencies (optional but recommended)
echo Syncing Capacitor Android project...
call npx cap sync android
if errorlevel 1 (
  echo ❌ Capacitor sync failed.
  exit /b 1
)

REM Step 5: Build release APK
echo Building Android release APK...
cd android
call gradlew.bat assembleRelease
if errorlevel 1 (
  echo ❌ Gradle build failed.
  cd ..
  exit /b 1
)

echo ============================
echo ✅ Build completed successfully!
echo Your release APK should be at:
echo android\app\build\outputs\apk\release\app-release.apk
echo ============================
pause
