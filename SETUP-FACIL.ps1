# PDV System - Setup Fácil para PowerShell
# Clique com direito → Executar com PowerShell

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║           PDV SYSTEM - SETUP FÁCIL (PowerShell)              ║" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "✓ Verificando Node.js..." -ForegroundColor Yellow
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "✗ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "  Baixe em: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "  Pressione Enter"
    exit
}
Write-Host "✓ Node.js OK" -ForegroundColor Green
Write-Host ""

# Backend
Write-Host "✓ Instalando Backend..." -ForegroundColor Yellow
npm install --silent --no-audit --no-fund | Out-Null
Write-Host "✓ Backend OK" -ForegroundColor Green
Write-Host ""

# Frontend
Write-Host "✓ Instalando Frontend..." -ForegroundColor Yellow
Push-Location frontend
npm install --silent --no-audit --no-fund | Out-Null
Pop-Location
Write-Host "✓ Frontend OK" -ForegroundColor Green
Write-Host ""

# Seed Data
Write-Host "✓ Criando dados de teste..." -ForegroundColor Yellow
node backend/scripts/seed-data.js | Out-Null
Write-Host "✓ Dados OK" -ForegroundColor Green
Write-Host ""

# Sucesso!
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                                ║" -ForegroundColor Green
Write-Host "║          ✨ SETUP CONCLUÍDO COM SUCESSO! ✨                  ║" -ForegroundColor Green
Write-Host "║                                                                ║" -ForegroundColor Green
Write-Host "║  🌐 Frontend: http://localhost:3000                          ║" -ForegroundColor Green
Write-Host "║  🔌 Backend:  http://localhost:5000/api                      ║" -ForegroundColor Green
Write-Host "║                                                                ║" -ForegroundColor Green
Write-Host "║  Iniciando servidores...                                     ║" -ForegroundColor Green
Write-Host "║                                                                ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 2

# Abrir navegador
Start-Process "http://localhost:3000"

# Iniciar Backend
Write-Host "🚀 Iniciando Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run server"

Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "🚀 Iniciando Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start"

Write-Host ""
Write-Host "✅ Servidores iniciados!" -ForegroundColor Green
Write-Host ""

Read-Host "Pressione Enter para fechar"
