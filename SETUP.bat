@echo off
REM Setup Automático para PDV System - Windows
REM Desenvolvido para funcionar em Windows 10/11

setlocal enabledelayedexpansion

cls
title PDV System - Setup Automático

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║                  PDV SYSTEM - SETUP AUTOMÁTICO                  ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM Verificar se Node.js está instalado
echo [1/5] Verificando Node.js...
where /q node
if errorlevel 1 (
    echo.
    echo ❌ Node.js não encontrado!
    echo.
    echo Baixe em: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado!
echo.

REM Instalar Backend
echo [2/5] Instalando Backend...
call npm install --no-audit --no-fund
if errorlevel 1 (
    echo.
    echo ❌ Erro ao instalar Backend!
    echo.
    pause
    exit /b 1
)
echo ✅ Backend instalado!
echo.

REM Instalar Frontend
echo [3/5] Instalando Frontend...
cd frontend
call npm install --no-audit --no-fund
if errorlevel 1 (
    echo.
    echo ❌ Erro ao instalar Frontend!
    echo.
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Frontend instalado!
echo.

REM Criar dados de teste
echo [4/5] Criando dados de teste...
call node backend/scripts/seed-data.js
echo ✅ Dados criados!
echo.

REM Iniciar servidores
echo [5/5] Iniciando servidores...
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║              ✨ SETUP COMPLETO COM SUCESSO! ✨                 ║
echo ║                                                                  ║
echo ║  Backend:  http://localhost:5000                               ║
echo ║  Frontend: http://localhost:3000                               ║
echo ║                                                                  ║
echo ║  Iniciando aplicação...                                        ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM Aguardar 2 segundos
timeout /t 2 /nobreak

REM Abrir navegador
start http://localhost:3000

REM Iniciar Backend em nova janela
echo Iniciando Backend...
start "PDV - Backend (Feche para parar)" cmd /k "npm run server"

REM Aguardar 3 segundos
timeout /t 3 /nobreak

REM Iniciar Frontend em nova janela
echo Iniciando Frontend...
start "PDV - Frontend (Feche para parar)" cmd /k "cd frontend && npm start"

echo.
echo ✅ Servidores iniciados com sucesso!
echo.
echo 📱 Verifique a janela do navegador que foi aberta.
echo.
echo 💡 Dica: As janelas de comando mostram os logs dos servidores.
echo.
echo 🚀 Acesse: http://localhost:3000
echo.

pause
