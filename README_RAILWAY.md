# 🚀 PDV System - Guia de Deploy no Railway

## 📋 Pré-requisitos

- ✅ Conta GitHub
- ✅ Código em repositório GitHub
- ✅ Conta no [Railway.app](https://railway.app)

---

## 🎯 Passo 1: Preparar Repositório GitHub

### 1.1 Fazer Push do Código

```bash
# Na pasta do projeto
cd "C:\Users\User\OneDrive\Imagens\Claude Code"

# Criar repositório (se não tiver)
git init
git add .
git commit -m "PDV System pronto para Railway"
git branch -M main

# Adicionar repositório remoto
git remote add origin https://github.com/SEU_USUARIO/pdv-system.git
git push -u origin main
```

### 1.2 Estrutura Esperada

```
pdv-system/
├── backend/
│   ├── index.js
│   ├── database/
│   ├── routes/
│   ├── services/
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── package.json (ROOT)
├── .env.development
├── .env.production
├── railway.json
├── Procfile
└── .gitignore
```

---

## 🚂 Passo 2: Deploy no Railway

### 2.1 Acessar Railway

1. Vá para [Railway.app](https://railway.app)
2. Clique em **"Start a New Project"**
3. Selecione **"Deploy from GitHub"**

### 2.2 Conectar GitHub

1. Clique em **"Connect GitHub Account"**
2. Autorize o Railway a acessar seus repositórios
3. Selecione o repositório **pdv-system**
4. Clique em **Deploy**

### 2.3 Configurar Variáveis de Ambiente

O Railway automaticamente detectará as variáveis necessárias.

Para adicionar/editar:

1. Vá para **Project Settings** → **Variables**
2. Adicione:

```
PORT=5000
NODE_ENV=production
WUZAPI_URL=https://api.wuzapi.com
WUZAPI_TOKEN=seu_token_aqui
WUZAPI_INSTANCE=sua_instancia_aqui
```

### 2.4 Banco de Dados

Railway oferece PostgreSQL grátis!

1. No Project, clique em **"Add Service"** → **PostgreSQL**
2. Railway automaticamente configurará `DATABASE_URL`

---

## 🌍 Passo 3: Acessar Sistema Online

Após o deploy (5-10 minutos):

```
https://seu-projeto.up.railway.app
```

Para verificar logs:

```
https://railway.app → Seu Projeto → Logs
```

---

## 📝 Variáveis de Ambiente do Railway

| Variável | Exemplo | Descrição |
|----------|---------|-----------|
| `PORT` | `5000` | Porta do servidor |
| `NODE_ENV` | `production` | Ambiente |
| `DATABASE_URL` | (auto) | Banco de dados |
| `WUZAPI_URL` | URL API | WhatsApp Wuzapi |
| `WUZAPI_TOKEN` | token... | Token Wuzapi |
| `WUZAPI_INSTANCE` | instance... | Instância Wuzapi |

---

## 🔄 Como Atualizar o Sistema

### Método 1: Via Git Push (Recomendado)

```bash
# Faça mudanças no código
# Commit e push

git add .
git commit -m "Nova funcionalidade PIX"
git push origin main

# Railway detecta mudanças automaticamente
# Deploy em 2-5 minutos
```

### Método 2: Via Railway Dashboard

1. Railway.app → Seu Projeto → Settings
2. Clique em **"Redeploy"**

### Método 3: Via Claude Code

```bash
# Abra terminal no Claude Code
# Faça mudanças, commit e push igual acima
```

---

## 🎨 URLs Importantes

```
🌐 Frontend:    https://seu-projeto.up.railway.app
🔌 API:         https://seu-projeto.up.railway.app/api
📊 Health:      https://seu-projeto.up.railway.app/api/health
⚙️ Dashboard:   https://seu-projeto.up.railway.app
```

---

## 🔒 Segurança

### .env não será enviado

O `.gitignore` já protege os arquivos `.env`:

```
.env
.env.local
.env.production.local
```

Railway usa variáveis de ambiente seguras no dashboard.

---

## 🐛 Troubleshooting

### Erro: "npm not found"

Railway pode precisar de tempo para instalar dependências. Aguarde 2-3 minutos.

### Erro: "DATABASE_URL not set"

1. Railway.app → Projeto → Services
2. Adicione PostgreSQL
3. Redeploy

### Erro: "Cannot find module"

```bash
# Verifique se todas as dependências foram instaladas
npm install
cd frontend && npm install
```

### Build falha

1. Verifique Railway logs
2. Certifique-se que `npm run build` funciona localmente
3. Commit e push de novo

---

## 📊 Monitorar Aplicação

### Logs em Tempo Real

```
Railway.app → Projeto → Logs
```

### Health Check

```bash
curl https://seu-projeto.up.railway.app/api/health
```

Saída esperada:
```json
{
  "status": "Server running",
  "timestamp": "2024-09-24T10:30:00Z"
}
```

---

## 💰 Custos

- **Plano Gratuito**: $5/mês de crédito
  - Frontend: ~$1-2/mês
  - Backend: ~$1-2/mês
  - PostgreSQL: Grátis (até certos limites)

- **Cobrar por uso acima de $5**: Sim, mas pequenas aplicações ficam grátis!

---

## 🚀 Próximos Passos

1. ✅ Push código no GitHub
2. ✅ Deploy no Railway
3. ✅ Configurar variáveis
4. ✅ Testar em produção
5. ✅ Compartilhar URL com clientes

---

## 📞 Suporte

- **Railway**: https://railway.app/support
- **Claude Code**: Use para fazer alterações e fazer push

---

## 🎉 Parabéns!

Seu PDV System está online! 🎊

**URL**: `https://seu-projeto.up.railway.app`

---

**Última atualização**: 2024-09-24  
**Versão**: 1.3 - PIX Ready
