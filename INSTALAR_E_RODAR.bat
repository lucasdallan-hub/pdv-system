@echo off
REM PDV System - Setup Automático Simplificado
REM Windows 10/11

setlocal enabledelayedexpansion

cls
color 0B
title PDV System - Setup Automático

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║           PDV SYSTEM - SETUP AUTOMÁTICO SIMPLIFICADO          ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Este script vai instalar e rodar tudo automaticamente...
echo.

REM Verificar Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ ERRO: Node.js não encontrado!
    echo.
    echo Baixe em: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.

REM Instalar Backend
echo ⏳ Instalando Backend (isso pode levar alguns minutos)...
call npm install --silent --no-audit --no-fund > nul 2>&1
if errorlevel 1 (
    echo ❌ Erro ao instalar Backend
    pause
    exit /b 1
)
echo ✅ Backend instalado
echo.

REM Instalar Frontend
echo ⏳ Instalando Frontend...
cd frontend 2>nul
if errorlevel 1 (
    echo ❌ Erro: Pasta frontend não encontrada
    cd ..
    pause
    exit /b 1
)

call npm install --silent --no-audit --no-fund > nul 2>&1
if errorlevel 1 (
    echo ❌ Erro ao instalar Frontend
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Frontend instalado
echo.

REM Criar dados de teste
echo ⏳ Criando dados de teste...
call node backend/scripts/seed-data.js > nul 2>&1
echo ✅ Dados criados
echo.

REM Exibir sucesso
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║          ✨ SETUP CONCLUÍDO COM SUCESSO! ✨                  ║
echo ║                                                                ║
echo ║  🌐 Frontend: http://localhost:3000                          ║
echo ║  🔌 Backend:  http://localhost:5000/api                      ║
echo ║                                                                ║
echo ║  Iniciando servidores em 3 segundos...                       ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

timeout /t 3 /nobreak

REM Abrir navegador
start http://localhost:3000

REM Iniciar servidores em novas janelas
start "PDV Backend (5000)" cmd /k "npm run server"
timeout /t 2 /nobreak
start "PDV Frontend (3000)" cmd /k "cd frontend && npm start"

echo.
echo ✅ Servidores iniciados!
echo.
echo 📝 Verifique as janelas de comando que foram abertas.
echo 📱 Navegador abrirá automaticamente em http://localhost:3000
echo.

pause
