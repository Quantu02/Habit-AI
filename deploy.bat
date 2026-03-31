@echo off
REM Habit-AI Deployment Script for Windows
REM Usage: deploy.bat [platform] [environment]

setlocal enabledelayedexpansion

set PLATFORM=%1
if "%PLATFORM%"=="" set PLATFORM=heroku

set ENV=%2
if "%ENV%"=="" set ENV=staging

color 0B
echo.
echo ========================================
echo  Habit-AI Deployment Script
echo  Platform: %PLATFORM%
echo  Environment: %ENV%
echo ========================================
echo.

REM Check prerequisites
echo Checking prerequisites...

if "%PLATFORM%"=="heroku" (
    where heroku >nul 2>nul
    if errorlevel 1 (
        echo [ERROR] Heroku CLI not found. Install with: npm install -g heroku
        exit /b 1
    )
)

if "%PLATFORM%"=="aws" (
    where aws >nul 2>nul
    if errorlevel 1 (
        echo [ERROR] AWS CLI not found. Install from https://aws.amazon.com/cli/
        exit /b 1
    )
    where terraform >nul 2>nul
    if errorlevel 1 (
        echo [ERROR] Terraform not found. Install from https://terraform.io
        exit /b 1
    )
)

where docker >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Docker not found. Install from https://docker.com
    exit /b 1
)

echo [OK] Prerequisites met
echo.

REM Validate configuration
echo Validating configuration...
if not exist "backend\.env" (
    echo Creating backend\.env from template...
    copy backend\.env.example backend\.env
    echo [WARNING] Update backend\.env with your values
)

if not exist "frontend\.env" (
    echo Creating frontend\.env from template...
    copy frontend\.env.example frontend\.env
)

echo [OK] Configuration validated
echo.

REM Deploy based on platform
if "%PLATFORM%"=="heroku" (
    goto deploy_heroku
) else if "%PLATFORM%"=="local" (
    goto deploy_local
) else (
    echo [ERROR] Unknown platform: %PLATFORM%
    echo Available platforms: heroku, local
    exit /b 1
)

:deploy_heroku
echo Building Docker images...
docker-compose -f docker-compose.yml build --no-cache
if errorlevel 1 goto error

echo.
echo Deploying to Heroku...
echo.

set HEROKU_BACKEND_APP=habit-ai-backend
set HEROKU_FRONTEND_APP=habit-ai-frontend

echo Backend app: %HEROKU_BACKEND_APP%
echo Frontend app: %HEROKU_FRONTEND_APP%

REM Check if apps exist and create
heroku apps:info %HEROKU_BACKEND_APP% >nul 2>nul
if errorlevel 1 (
    echo Creating Heroku backend app...
    call heroku create %HEROKU_BACKEND_APP% --stack container
    call heroku addons:create heroku-postgresql:hobby-dev -a %HEROKU_BACKEND_APP%
)

heroku apps:info %HEROKU_FRONTEND_APP% >nul 2>nul
if errorlevel 1 (
    echo Creating Heroku frontend app...
    call heroku create %HEROKU_FRONTEND_APP% --stack container
)

echo.
echo Setting environment variables...
call heroku config:set -a %HEROKU_BACKEND_APP% SECRET_KEY=your-secret-key-min-32-chars
call heroku config:set -a %HEROKU_FRONTEND_APP% REACT_APP_API_URL=https://%HEROKU_BACKEND_APP%.herokuapp.com

echo.
echo Deploying backend...
cd backend
call heroku container:push web -a %HEROKU_BACKEND_APP%
call heroku container:release web -a %HEROKU_BACKEND_APP%
cd ..

echo.
echo Deploying frontend...
cd frontend
call heroku container:push web -a %HEROKU_FRONTEND_APP%
call heroku container:release web -a %HEROKU_FRONTEND_APP%
cd ..

echo.
echo [OK] Heroku deployment complete!
echo Backend: https://%HEROKU_BACKEND_APP%.herokuapp.com
echo Frontend: https://%HEROKU_FRONTEND_APP%.herokuapp.com
goto success

:deploy_local
echo Starting Docker Compose stack...
docker-compose up -d
if errorlevel 1 goto error

echo.
echo [OK] Local deployment complete!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo Docs: http://localhost:8000/docs
goto success

:error
echo.
echo [ERROR] Deployment failed!
exit /b 1

:success
echo.
echo [SUCCESS] Deployment complete!
echo.
endlocal
