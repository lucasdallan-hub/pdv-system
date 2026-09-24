#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const BACKEND_DIR = ROOT_DIR;

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║                                                                  ║');
console.log('║                  PDV SYSTEM - SETUP AUTOMÁTICO                  ║');
console.log('║                                                                  ║');
console.log('╚══════════════════════════════════════════════════════════════════╝');
console.log('\n');

let step = 1;

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',      // Cyan
    success: '\x1b[32m',   // Green
    error: '\x1b[31m',     // Red
    warning: '\x1b[33m',   // Yellow
    reset: '\x1b[0m'
  };

  console.log(`${colors[type]}[${step}/${type === 'error' ? '?' : '5'}] ${message}${colors.reset}`);
}

function executeCommand(command, cwd = ROOT_DIR) {
  return new Promise((resolve, reject) => {
    const child = exec(command, { cwd, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });

    child.stdout?.on('data', (data) => {
      process.stdout.write(data);
    });

    child.stderr?.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}

async function setup() {
  try {
    // Step 1: Verificar Node.js
    log('Verificando Node.js...');
    try {
      const nodeVersion = await executeCommand('node --version');
      console.log(`   Versão: ${nodeVersion.trim()}`);
      log('Node.js encontrado!', 'success');
      step++;
    } catch (error) {
      log('Node.js não encontrado! Baixe em https://nodejs.org/', 'error');
      process.exit(1);
    }

    console.log('');

    // Step 2: Instalar Backend
    log('Instalando dependências do Backend...');
    try {
      await executeCommand('npm install', BACKEND_DIR);
      log('Backend instalado!', 'success');
      step++;
    } catch (error) {
      log('Erro ao instalar Backend!', 'error');
      process.exit(1);
    }

    console.log('');

    // Step 3: Instalar Frontend
    log('Instalando dependências do Frontend...');
    try {
      await executeCommand('npm install', FRONTEND_DIR);
      log('Frontend instalado!', 'success');
      step++;
    } catch (error) {
      log('Erro ao instalar Frontend!', 'error');
      process.exit(1);
    }

    console.log('');

    // Step 4: Criar dados de teste
    log('Criando dados de teste...');
    try {
      await executeCommand('node backend/scripts/seed-data.js', BACKEND_DIR);
      log('Dados de teste criados!', 'success');
      step++;
    } catch (error) {
      log('Erro ao criar dados (continuando mesmo assim)', 'warning');
      step++;
    }

    console.log('');

    // Step 5: Iniciar servidores
    log('Iniciando servidores...');

    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                  ║');
    console.log('║              ✨ SETUP COMPLETO COM SUCESSO! ✨                 ║');
    console.log('║                                                                  ║');
    console.log('║  Backend:  http://localhost:5000                               ║');
    console.log('║  Frontend: http://localhost:3000                               ║');
    console.log('║                                                                  ║');
    console.log('║  Iniciando servidores...                                        ║');
    console.log('║                                                                  ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log('\n');

    // Iniciar Backend
    console.log('\x1b[36m🚀 Iniciando Backend (porta 5000)...\x1b[0m\n');
    const backend = spawn('npm', ['run', 'server'], {
      cwd: BACKEND_DIR,
      stdio: 'inherit',
      shell: true
    });

    // Aguardar 3 segundos antes de iniciar frontend
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Iniciar Frontend
    console.log('\n\x1b[36m🚀 Iniciando Frontend (porta 3000)...\x1b[0m\n');
    const frontend = spawn('npm', ['start'], {
      cwd: FRONTEND_DIR,
      stdio: 'inherit',
      shell: true
    });

    // Abrir navegador após 5 segundos
    setTimeout(() => {
      const open = require('open');
      open('http://localhost:3000').catch(() => {
        console.log('\n\x1b[36m👉 Abra manualmente: http://localhost:3000\x1b[0m\n');
      });
    }, 5000);

    // Manter processo vivo
    process.stdin.resume();

  } catch (error) {
    log(`Erro inesperado: ${error.message}`, 'error');
    process.exit(1);
  }
}

setup();
