@echo off
setlocal enabledelayedexpansion

REM Setup PATH para Node.js
set PATH=C:\Program Files\nodejs;C:\Program Files\nodejs\node_modules\.bin;%PATH%

REM Ir para diretório
cd /d "%~dp0"

REM Ir para frontend
cd /d "frontend"

REM Verificar instalação
echo.
echo ========================================
echo Verificando Node.js e npm...
echo ========================================
node --version
npm --version
echo.

REM Instalar dependências se necessário
if not exist "node_modules" (
    echo.
    echo Instalando dependências...
    call npm install
)

REM Rodar npm start
echo.
echo Iniciando servidor React...
echo.
call npm start
