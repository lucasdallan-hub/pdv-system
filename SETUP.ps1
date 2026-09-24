# Script de Setup Automático para PDV System
# PowerShell Version

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                  ║" -ForegroundColor Cyan
Write-Host "║                  PDV SYSTEM - SETUP AUTOMÁTICO                  ║" -ForegroundColor Cyan
Write-Host "║                                                                  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Passo 1: Verificar Node.js
Write-Host "[1/5] Verificando Node.js..." -ForegroundColor Yellow
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "❌ Node.js não encontrado! Baixe em https://nodejs.org/" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit
}
Write-Host "✅ Node.js encontrado!" -ForegroundColor Green
Write-Host ""

# Passo 2: Backend
Write-Host "[2/5] Instalando dependências do Backend..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar Backend!" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit
}
Write-Host "✅ Backend instalado!" -ForegroundColor Green
Write-Host ""

# Passo 3: Frontend
Write-Host "[3/5] Instalando dependências do Frontend..." -ForegroundColor Yellow
cd frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar Frontend!" -ForegroundColor Red
    cd ..
    Read-Host "Pressione Enter para sair"
    exit
}
cd ..
Write-Host "✅ Frontend instalado!" -ForegroundColor Green
Write-Host ""

# Passo 4: Seed Data
Write-Host "[4/5] Populando banco de dados com dados de teste..." -ForegroundColor Yellow
node backend/scripts/seed-data.js
Write-Host "✅ Dados de teste criados!" -ForegroundColor Green
Write-Host ""

# Passo 5: Iniciar servidores
Write-Host "[5/5] Iniciando servidores..." -ForegroundColor Yellow
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                                  ║" -ForegroundColor Green
Write-Host "║              ✨ SETUP COMPLETO COM SUCESSO! ✨                 ║" -ForegroundColor Green
Write-Host "║                                                                  ║" -ForegroundColor Green
Write-Host "║  Backend:  http://localhost:5000                               ║" -ForegroundColor Green
Write-Host "║  Frontend: http://localhost:3000                               ║" -ForegroundColor Green
Write-Host "║                                                                  ║" -ForegroundColor Green
Write-Host "║  Abrindo navegador em 2 segundos...                            ║" -ForegroundColor Green
Write-Host "║                                                                  ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Aguarda 2 segundos
Start-Sleep -Seconds 2

# Abre o navegador
Start-Process "http://localhost:3000"

# Inicia o Backend
Write-Host "🚀 Iniciando Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run server"

# Aguarda 3 segundos para o backend iniciar
Start-Sleep -Seconds 3

# Inicia o Frontend
Write-Host "🚀 Iniciando Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start"

Write-Host ""
Write-Host "✅ Servidores iniciados!" -ForegroundColor Green
Write-Host "📝 Verificar as janelas de PowerShell que foram abertas." -ForegroundColor Yellow
Write-Host ""
Read-Host "Pressione Enter para fechar esta janela"
