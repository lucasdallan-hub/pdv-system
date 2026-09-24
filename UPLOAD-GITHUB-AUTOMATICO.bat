@echo off
REM Script para fazer upload automático no GitHub
REM Coloque seu GitHub username e token antes de rodar!

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  UPLOAD AUTOMÁTICO DO PDV SYSTEM NO GITHUB                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Mudar para diretório do projeto
cd /d "%~dp0"
echo 📂 Diretório: %cd%
echo.

REM Verificar se Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não está instalado!
    echo.
    echo 📥 Baixe Git em: https://git-scm.com/download/win
    echo.
    echo Depois de instalar, abra este arquivo novamente.
    pause
    exit /b 1
)

echo ✅ Git encontrado!
echo.

REM Pedir informações do usuário
set /p USERNAME="Digite seu GitHub username: "
set /p EMAIL="Digite seu email: "
set /p REPO_NAME="Digite o nome do repositório (padrão: pdv-system): "

if "%REPO_NAME%"=="" set REPO_NAME=pdv-system

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  CONFIGURANDO GIT...                                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Configurar Git
git config --global user.name "%USERNAME%"
git config --global user.email "%EMAIL%"

echo ✅ Git configurado com:
echo    Usuário: %USERNAME%
echo    Email: %EMAIL%
echo.

REM Verificar se já é repositório
if exist ".git" (
    echo ✅ Repositório Git já existe
    echo.
    echo Atualizando arquivos...
) else (
    echo 📝 Criando novo repositório Git...
    git init
    echo ✅ Repositório criado
    echo.
)

REM Adicionar todos os arquivos
echo 📤 Adicionando arquivos...
git add .
echo ✅ Arquivos adicionados
echo.

REM Criar commit
git commit -m "PDV System com PIX integrado - Pronto para Railway" -m "Versão 1.3 - Funcionalidades completas"
echo ✅ Commit criado
echo.

REM Verificar branch
git branch -M main
echo ✅ Branch principal: main
echo.

REM Pedir URL do repositório ou criar automaticamente
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  PRÓXIMO PASSO: CONECTAR AO GITHUB                            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Você tem 3 opções:
echo.
echo 1) JÁ TEM repositório no GitHub
echo    Cole a URL: https://github.com/seu-usuario/%REPO_NAME%.git
echo.
echo 2) NÃO TEM repositório ainda
echo    Acesse: https://github.com/new
echo    E crie um com o nome: %REPO_NAME%
echo    Depois volte e cole a URL aqui
echo.
echo 3) USA GITHUB DESKTOP (recomendado)
echo    Feche este script e use GitHub Desktop
echo.

set /p REPO_URL="Cole a URL do repositório (ou pressione Enter para depois): "

if not "%REPO_URL%"=="" (
    echo.
    echo 🚀 Fazendo push para GitHub...
    git remote remove origin 2>nul
    git remote add origin %REPO_URL%
    git push -u origin main

    if errorlevel 1 (
        echo.
        echo ⚠️ Erro ao fazer push!
        echo Possíveis causas:
        echo - URL incorreta
        echo - Sem acesso ao repositório
        echo - Token/credenciais incorretas
        echo.
        echo Tente novamente com a URL correta
    ) else (
        echo ✅ Push bem-sucedido!
        echo.
        echo 🎉 Seu código está no GitHub!
        echo URL: %REPO_URL%
    )
) else (
    echo.
    echo ℹ️ Você pode fazer push depois com os comandos:
    echo.
    echo git remote add origin https://github.com/SEU_USUARIO/%REPO_NAME%.git
    echo git push -u origin main
    echo.
)

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo ✅ Processo concluído!
echo.
echo Próximo passo: Deploy no Railway
echo Acesse: https://railway.app
echo.
pause
