# Configure MongoDB Atlas connection for furniture_shop
# Usage: .\scripts\configure-atlas.ps1

$envFile = Join-Path $PSScriptRoot "..\.env"
$exampleFile = Join-Path $PSScriptRoot "..\.env.example"

if (-not (Test-Path $envFile)) {
    Copy-Item $exampleFile $envFile
    Write-Host "Created .env from .env.example"
}

Write-Host ""
Write-Host "MongoDB Atlas Setup - furniture_shop"
Write-Host "Steps:"
Write-Host "  1. Atlas -> Connect -> Drivers"
Write-Host "  2. Copy connection string"
Write-Host "  3. Replace <password> with your DB user password"
Write-Host ""

$uri = Read-Host "Paste your MongoDB Atlas connection string"

if (-not $uri) {
    Write-Host "No URI provided. Exiting."
    exit 1
}

# Ensure database name is furniture_shop.
if ($uri -match 'mongodb(\+srv)?://[^/]+/([^?]+)') {
    $uri = $uri -replace '/([^/?]+)(\?|$)', '/furniture_shop$2'
} elseif ($uri -notmatch '/furniture_shop') {
    if ($uri -match '\?') {
        $uri = $uri -replace '\?', '/furniture_shop?'
    } else {
        $uri = "$uri/furniture_shop"
    }
}

$content = Get-Content $envFile -Raw
if ($content -match 'MONGODB_URI=.*') {
    $content = $content -replace 'MONGODB_URI=.*', "MONGODB_URI=$uri"
} else {
    $content += "`nMONGODB_URI=$uri"
}

Set-Content $envFile $content.TrimEnd()
Write-Host ""
Write-Host "Updated .env with MONGODB_URI -> furniture_shop"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  npm run db:init -w server"
Write-Host "  npm run dev"
