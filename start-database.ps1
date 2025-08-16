# eX Twitter Database Startup Script
Write-Host "Starting eX Twitter Database..." -ForegroundColor Green
Write-Host ""
Write-Host "Make sure Docker Desktop is running first!" -ForegroundColor Yellow
Write-Host ""

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Pulling required images..." -ForegroundColor Cyan
docker pull postgres:15-alpine
docker pull dpage/pgadmin4:latest

Write-Host ""
Write-Host "Starting database containers..." -ForegroundColor Cyan
docker compose up -d

Write-Host ""
Write-Host "Waiting for database to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Checking container status..." -ForegroundColor Cyan
docker compose ps

Write-Host ""
Write-Host "Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Access information:" -ForegroundColor Yellow
Write-Host "- Database: postgresql://ex_user:ex_password123@localhost:5432/ex_twitter_test"
Write-Host "- pgAdmin: http://localhost:8080 (admin@example.com / admin123)"
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "- To stop: docker compose down"
Write-Host "- To reset: docker compose down -v && docker compose up -d"
Write-Host "- To view logs: docker compose logs -f"
Write-Host ""
Read-Host "Press Enter to continue"
