$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root "backend"

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-ExecutionPolicy",
  "Bypass",
  "-Command",
  "cd '$backendPath'; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
)

Start-Sleep -Seconds 2

Set-Location $root
cmd /c npm run dev
