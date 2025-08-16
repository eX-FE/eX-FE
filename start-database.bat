@echo off
echo Starting eX Twitter Database...
echo.
echo Make sure Docker Desktop is running first!
echo.
pause

echo Pulling required images...
docker pull postgres:15-alpine
docker pull dpage/pgadmin4:latest

echo.
echo Starting database containers...
docker compose up -d

echo.
echo Waiting for database to be ready...
timeout /t 10 /nobreak > nul

echo.
echo Checking container status...
docker compose ps

echo.
echo Database is starting up...
echo.
echo Access information:
echo - Database: postgresql://ex_user:ex_password123@localhost:5432/ex_twitter_test
echo - pgAdmin: http://localhost:8080 (admin@example.com / admin123)
echo.
echo To stop: docker compose down
echo To reset: docker compose down -v && docker compose up -d
echo.
pause
