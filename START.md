# 🚀 Iniciar PDV System - Setup Automático

## ⚡ 3 Formas de Começar

---

## 1️⃣ **Windows - Duplo Clique (MAIS FÁCIL)**

### Opção A - Batch Script (Recomendado)
```
1. Na pasta do projeto, procure por: SETUP.bat
2. Duplo-clique nele
3. Aguarde a instalação (pode levar alguns minutos)
4. Navegador abrirá automaticamente em http://localhost:3000
```

### Opção B - PowerShell Script
```
1. Abra PowerShell como Administrador
2. Navegue até a pasta: cd C:\Users\User\OneDrive\Imagens\Claude Code
3. Execute: .\SETUP.ps1
4. Confirme se pedir permissão
5. Aguarde e pronto!
```

---

## 2️⃣ **Terminal - Comandos Manuais**

Se preferir fazer passo a passo:

### Terminal 1 - Backend:
```bash
npm run server
```

Deve aparecer:
```
✅ Database initialized successfully
🚀 PDV System running on port 5000
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

Deve aparecer:
```
Compiled successfully!
Local: http://localhost:3000
```

---

## 3️⃣ **Já Instalado? Só Rodar**

Se já instalou dependências antes:

```bash
npm run dev
```

Isso abre Backend (5000) e Frontend (3000) de uma vez.

---

## 🎯 O que esperar

### Primeira vez (pode levar 5-10 minutos):
```
[1/5] Verificando Node.js... ✅
[2/5] Instalando Backend... ✅
[3/5] Instalando Frontend... ✅
[4/5] Criando dados de teste... ✅
[5/5] Iniciando servidores... ✅
```

### Depois de instalado (< 10 segundos):
```
🚀 Backend started
🚀 Frontend compiled
📱 http://localhost:3000
```

---

## 📌 URLs Após Iniciar

| Serviço | URL |
|---------|-----|
| **Frontend (Dashboard)** | http://localhost:3000 |
| **Backend (API)** | http://localhost:5000/api |
| **Health Check** | http://localhost:5000/api/health |

---

## ✅ Dados de Teste

O setup **automaticamente** cria:
- ✅ 4 clientes
- ✅ 4 vendas
- ✅ 4 recebimentos (alguns vencidos)
- ✅ 4 pagamentos (alguns vencidos)

Você pode usar **imediatamente** sem mexer em nada!

---

## 🎮 Testar Agora

Após abrir http://localhost:3000:

1. **Dashboard** → Veja as métricas
2. **Clientes** → Veja clientes criados
3. **Vendas** → Veja vendas registradas
4. **Recebimentos** → Veja o que está pendente
5. **WhatsApp** → Veja recebimentos vencidos

---

## 🆘 Se algo der errado

### Erro: "npm: command not found"
→ Node.js não está instalado. Baixe em https://nodejs.org/

### Erro: "Porta 5000/3000 em uso"
→ Outra aplicação está usando. Feche-a ou use `.env` para mudar porta.

### Tela branca no navegador
→ Aguarde 10 segundos e atualize (F5)

### Dados não aparecem
→ Execute: `node backend/scripts/seed-data.js`

---

## 📝 Estrutura de Pastas

```
pdv-system/
├── SETUP.bat          ← Duplo-clique aqui (Windows)
├── SETUP.ps1          ← Ou execute via PowerShell
├── START.md           ← Este arquivo
├── backend/
├── frontend/
└── .env               ← Configurado automaticamente
```

---

## 🎉 Pronto!

### Escolha uma opção:

✅ **Mais fácil:** Duplo-clique em `SETUP.bat`

✅ **Alternativa:** Execute `SETUP.ps1` no PowerShell

✅ **Manual:** Use `npm run server` + `npm start` em 2 terminais

---

## 💡 Dica Final

Após a primeira instalação, pode iniciar apenas com:

```bash
npm run dev
```

Isso abre tudo de uma vez! 🚀

---

**Próximo:** Leia [WELCOME.md](WELCOME.md) após iniciar
