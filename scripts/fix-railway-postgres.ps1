# Wire epicos to Postgres private URL and redeploy both services.
# Run from repo root: pwsh scripts/fix-railway-postgres.ps1
$ErrorActionPreference = "Stop"

Write-Host "Linking epicos service..." -ForegroundColor Cyan
npx @railway/cli service epicos

Write-Host "Setting DATABASE_URL to private Postgres reference..." -ForegroundColor Cyan
npx @railway/cli variables set 'DATABASE_URL=${{Postgres.DATABASE_URL}}'

Write-Host "Redeploying Postgres (template/image updates)..." -ForegroundColor Cyan
npx @railway/cli redeploy --service Postgres --yes

Write-Host "Redeploying epicos (pick up DB reference)..." -ForegroundColor Cyan
npx @railway/cli redeploy --service epicos --yes

Write-Host ""
Write-Host "Done. epicos uses postgres.railway.internal — no egress fees." -ForegroundColor Green
Write-Host "The Postgres TCP-proxy advisory is informational unless you connect via DATABASE_PUBLIC_URL." -ForegroundColor Yellow
Write-Host "To dismiss it: Postgres -> Settings -> Networking -> disable TCP Proxy." -ForegroundColor Yellow