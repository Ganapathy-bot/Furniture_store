# Configure Stripe test keys in .env
# Get keys from: https://dashboard.stripe.com/test/apikeys

$envFile = Join-Path $PSScriptRoot "..\.env"

if (-not (Test-Path $envFile)) {
    Write-Host ".env not found. Run from project root."
    exit 1
}

Write-Host ""
Write-Host "Stripe Test Keys Setup"
Write-Host "Get keys from: https://dashboard.stripe.com/test/apikeys"
Write-Host ""

$secretKey = Read-Host "Paste STRIPE_SECRET_KEY (sk_test_...)"
$webhookSecret = Read-Host "Paste STRIPE_WEBHOOK_SECRET (whsec_... or leave empty for now)"

$content = Get-Content $envFile -Raw

if ($secretKey) {
    $content = $content -replace 'STRIPE_SECRET_KEY=.*', "STRIPE_SECRET_KEY=$secretKey"
}
if ($webhookSecret) {
    $content = $content -replace 'STRIPE_WEBHOOK_SECRET=.*', "STRIPE_WEBHOOK_SECRET=$webhookSecret"
}

Set-Content $envFile $content.TrimEnd()
Write-Host ""
Write-Host "Stripe keys updated in .env"
Write-Host "Restart dev server: npm run dev"