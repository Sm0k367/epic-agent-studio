# Apply Google OAuth to Railway after you create credentials in Google Cloud Console.
# Usage (paste your values — never commit this file):
#   .\scripts\apply-google-oauth.ps1 -ClientId "123....apps.googleusercontent.com" -ClientSecret "GOCSPX-..."

param(
  [Parameter(Mandatory = $true)]
  [string]$ClientId,
  [Parameter(Mandatory = $true)]
  [string]$ClientSecret
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

$envFile = Join-Path $root "bootstrap\secrets\google.env"
@(
  "# Epic OS Google OAuth — DO NOT COMMIT",
  "GOOGLE_CLIENT_ID=$ClientId",
  "GOOGLE_CLIENT_SECRET=$ClientSecret",
  ""
) | Set-Content -Path $envFile -Encoding utf8

Push-Location $root
try {
  npx @railway/cli variables set `
    "GOOGLE_CLIENT_ID=$ClientId" `
    "GOOGLE_CLIENT_SECRET=$ClientSecret" `
    "AUTH_URL=https://epic-os.up.railway.app" `
    "NEXT_PUBLIC_SITE_URL=https://epic-os.up.railway.app" `
    "NEXT_PUBLIC_APP_URL=https://epic-os.up.railway.app"

  npx @railway/cli redeploy --yes
  Write-Host "`nDone. Test: https://epic-os.up.railway.app/login" -ForegroundColor Green
}
finally {
  Pop-Location
}