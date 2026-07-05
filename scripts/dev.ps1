$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Starting PostgreSQL..."
docker compose -f api/docker-compose.yml up -d postgres

Write-Host "Starting API at http://localhost:5027..."
$api = Start-Process `
  -FilePath "dotnet" `
  -ArgumentList @("watch", "--project", "api/BrewMonitor.Api.csproj", "run", "--launch-profile", "http") `
  -WorkingDirectory $root `
  -NoNewWindow `
  -PassThru

Write-Host "Starting web app at http://localhost:3000..."
$web = Start-Process `
  -FilePath "npm.cmd" `
  -ArgumentList @("--prefix", "web", "run", "dev") `
  -WorkingDirectory $root `
  -NoNewWindow `
  -PassThru

Write-Host ""
Write-Host "Brew Monitor is starting."
Write-Host "API: http://localhost:5027"
Write-Host "Web: http://localhost:3000"
Write-Host "Press Ctrl+C to stop API and web processes."

try {
  while (-not $api.HasExited -and -not $web.HasExited) {
    Start-Sleep -Seconds 1
    $api.Refresh()
    $web.Refresh()
  }
}
finally {
  foreach ($process in @($api, $web)) {
    if ($process -and -not $process.HasExited) {
      Stop-Process -Id $process.Id -Force
    }
  }
}
