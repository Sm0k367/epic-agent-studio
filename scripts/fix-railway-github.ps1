# Fix Railway "GitHub Repo not found" for private epic-os-platform
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Railway red / GitHub Repo not found — fix checklist" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Cause (if private): Railway's GitHub App needs repo access in GitHub Settings." -ForegroundColor Yellow
Write-Host "Repo is public now — reconnect Source in Railway if UI still shows red." -ForegroundColor Yellow
Write-Host ""
Write-Host "FIX (2 minutes):" -ForegroundColor Green
Write-Host "  1. Open GitHub Railway App settings (browser opening...)"
Write-Host "  2. Click Configure on Railway"
Write-Host "  3. Repository access -> Only select repositories"
Write-Host "  4. Add/check: epic-os-platform"
Write-Host "  5. Save"
Write-Host "  6. Railway -> epicos -> Settings -> Source -> Disconnect -> Connect Repo again"
Write-Host ""
Write-Host "If Railway is on a different GitHub account than Sm0k367, revoke Railway on GitHub" -ForegroundColor Yellow
Write-Host "and reconnect from Railway Account Settings -> GitHub using the Sm0k367 account." -ForegroundColor Yellow
Write-Host ""
Write-Host "Deploy without GitHub (works now):" -ForegroundColor Green
Write-Host "  cd epic-os-platform"
Write-Host "  railway up"
Write-Host ""

Start-Process "https://github.com/settings/installations"