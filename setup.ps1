# ╔══════════════════════════════════════════════════════════════════╗
# ║         CloudWave Events — Phase Setup Helper Script            ║
# ║         Run in PowerShell (NOT as Administrator)                ║
# ╚══════════════════════════════════════════════════════════════════╝

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     CloudWave Events — Setup Helper      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Phase 1: Check Prerequisites ──────────────────────────────────
Write-Host "[ Phase 1 ] Checking prerequisites..." -ForegroundColor Yellow

$nodeVersion = node --version 2>$null
$npmVersion  = npm --version  2>$null
$awsVersion  = aws --version  2>$null
$gitVersion  = git --version  2>$null

if ($nodeVersion) { Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green }
else              { Write-Host "  ❌ Node.js not found. Install from https://nodejs.org" -ForegroundColor Red }

if ($npmVersion) { Write-Host "  ✅ npm: $npmVersion" -ForegroundColor Green }
else             { Write-Host "  ❌ npm not found" -ForegroundColor Red }

if ($awsVersion) { Write-Host "  ✅ AWS CLI: detected" -ForegroundColor Green }
else             { Write-Host "  ❌ AWS CLI not found. Install from https://aws.amazon.com/cli/" -ForegroundColor Red }

if ($gitVersion) { Write-Host "  ✅ Git: $gitVersion" -ForegroundColor Green }
else             { Write-Host "  ❌ Git not found. Install from https://git-scm.com" -ForegroundColor Red }

Write-Host ""

# ── Phase 2: Install Global Tools ─────────────────────────────────
Write-Host "[ Phase 2 ] Installing global tools..." -ForegroundColor Yellow
Write-Host "  Run these commands manually in PowerShell:" -ForegroundColor Gray
Write-Host "  npm install -g serverless" -ForegroundColor White
Write-Host "  npm install -g prisma" -ForegroundColor White
Write-Host ""

# ── Phase 3: Backend Setup ─────────────────────────────────────────
Write-Host "[ Phase 3 ] Backend setup commands:" -ForegroundColor Yellow
Write-Host "  cd cloudwave-events\backend" -ForegroundColor White
Write-Host "  npm install" -ForegroundColor White
Write-Host "  copy .env.example .env" -ForegroundColor White
Write-Host "  (Edit .env with your values)" -ForegroundColor Gray
Write-Host "  npx prisma generate" -ForegroundColor White
Write-Host "  npx prisma migrate dev --name init" -ForegroundColor White
Write-Host "  npx serverless deploy --stage dev" -ForegroundColor White
Write-Host ""

# ── Phase 4: Frontend Setup ────────────────────────────────────────
Write-Host "[ Phase 4 ] Frontend setup commands:" -ForegroundColor Yellow
Write-Host "  cd ..\frontend" -ForegroundColor White
Write-Host "  npm install" -ForegroundColor White
Write-Host "  copy .env.example .env" -ForegroundColor White
Write-Host "  (Edit .env with your Cognito + API values)" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""

Write-Host "════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "  Follow the README.md for full phase guide" -ForegroundColor Gray
Write-Host "════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
