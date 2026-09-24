# 🎉 Bem-vindo ao PDV System

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║              ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓                 ║
║              ┃  📊 PDV SYSTEM                  ┃                 ║
║              ┃  Sistema de Ponto de Venda      ┃                 ║
║              ┃  v1.0                           ┃                 ║
║              ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛                 ║
║                                                                    ║
║  🚀 Controle Financeiro Completo                                 ║
║  💬 Integração WhatsApp (Wuzapi)                                 ║
║  📈 Dashboard Inteligente                                        ║
║  🎨 Interface Moderna & Atrativa                                 ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

---

## 🎯 O que você tem aqui?

### ✅ Backend Robusto
- **Express.js** - Framework web rápido
- **SQLite** - Banco de dados sem instalação
- **RESTful API** - 6 módulos principais
- **Wuzapi Integration** - WhatsApp nativo

### ✅ Frontend Moderno
- **React 18** - UI library poderosa
- **Tailwind CSS** - Estilo limpo e responsivo
- **Recharts** - Gráficos elegantes
- **Dashboard** - Visão 360° do negócio

### ✅ Features Principais
- 🛒 Gestão de Vendas
- 💰 Controle de Recebimentos
- 📊 Gestão de Pagamentos
- 👥 Cadastro de Clientes
- 📱 Cobrança via WhatsApp
- 📈 Relatórios e Gráficos

---

## ⚡ Começar em 3 passos

### 1️⃣ Instalar
```bash
npm install && cd frontend && npm install && cd ..
```

### 2️⃣ Configurar (opcional)
```bash
cp .env.example .env
# Edite com suas credenciais Wuzapi (opcional)
```

### 3️⃣ Rodar
```bash
npm run dev
```

**Pronto!** Abra → http://localhost:3000

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| 📖 **[README.md](README.md)** | Documentação completa do projeto |
| ⚡ **[QUICK_START.md](QUICK_START.md)** | Guia rápido (5 minutos) |
| 🔌 **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | Referência de endpoints |
| 📱 **[WUZAPI_SETUP.md](WUZAPI_SETUP.md)** | Configurar WhatsApp |
| 🏗️ **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** | Arquitetura do projeto |

---

## 🖼️ Telas Disponíveis

### Dashboard
```
┌─────────────────────────────────────────┐
│ Vendas Hoje │ Recebimentos │ Pagamentos │
├─────────────────────────────────────────┤
│                                         │
│   📊 Gráfico de Vendas (7 dias)        │
│   💹 Fluxo de Caixa                    │
│   📈 Produtos Mais Vendidos            │
│                                         │
└─────────────────────────────────────────┘
```

### Vendas
```
┌─────────────────────────────────────────┐
│ [+ Nova Venda]                          │
├─────────────────────────────────────────┤
│ ID  │ Cliente │ Total  │ Método │ Data  │
├─────┼─────────┼────────┼────────┼───────┤
│ #1  │ João    │ 500.00 │ Card   │ 15/01 │
│ #2  │ Maria   │ 1500   │ Trans  │ 14/01 │
└─────────────────────────────────────────┘
```

### WhatsApp
```
┌──────────────────────────────────────────┐
│ 📱 Recebimentos Vencidos                 │
├──────────────────────────────────────────┤
│ João Silva - R$ 500.00 - 5 dias vencido │
│ [Enviar Cobrança]                       │
│                                          │
│ Maria Santos - R$ 1500 - 3 dias vencido │
│ [Enviar Cobrança]                       │
│                                          │
│ [📬 Enviar em Massa (2)]                 │
└──────────────────────────────────────────┘
```

---

## 🚀 Próximas Ações Recomendadas

1. **📖 Leia a documentação** → [QUICK_START.md](QUICK_START.md)
2. **🔧 Configure o ambiente** → Edite `.env`
3. **▶️ Inicie o servidor** → `npm run dev`
4. **👥 Crie alguns clientes** → http://localhost:3000/customers
5. **🛒 Registre vendas** → http://localhost:3000/sales
6. **📱 Configure WhatsApp** → [WUZAPI_SETUP.md](WUZAPI_SETUP.md)

---

## 💡 Dicas Importantes

### Para Testes
```bash
# Popular BD com dados de teste
node backend/scripts/seed-data.js
```

### Para Desenvolvimento
- Edite componentes em `frontend/src/components/`
- Edite rotas em `backend/routes/`
- Customize mensagens em `backend/services/wuzapi.js`

### Para Produção
- Configure `.env` com variáveis reais
- Use um banco de dados robusto (PostgreSQL)
- Configure HTTPS
- Implemente autenticação

---

## 🆘 Precisa de Ajuda?

### Problemas Comuns

**Porta 5000 em uso?**
```bash
PORT=5001 npm run server
```

**Módulos não encontrados?**
```bash
npm install
cd frontend && npm install
```

**Banco vazio?**
```bash
node backend/scripts/seed-data.js
```

**WhatsApp não funciona?**
- Verifique `.env`
- Leia [WUZAPI_SETUP.md](WUZAPI_SETUP.md)
- Teste a API: `curl http://localhost:5000/api/health`

---

## 📊 Estatísticas do Projeto

| Item | Valor |
|------|-------|
| 📁 Componentes React | 6 |
| 🔌 Endpoints API | 20+ |
| 🗄️ Tabelas DB | 6 |
| 📄 Arquivos Docs | 6 |
| ⏱️ Setup Time | < 5 min |
| 📦 Dependências | 15 |

---

## 🎨 Tecnologias Utilizadas

### Backend
- Node.js + Express.js
- SQLite3
- Axios (HTTP client)

### Frontend
- React 18
- Tailwind CSS
- Recharts
- Lucide Icons

### Integração
- Wuzapi (WhatsApp)
- RESTful API

---

## 🔄 Fluxo Típico de Uso

```
1. Cadastrar Cliente
   ↓
2. Registrar Venda
   ↓
3. Sistema cria Recebimento automaticamente
   ↓
4. Vencimento se aproxima
   ↓
5. Enviar Cobrança via WhatsApp
   ↓
6. Cliente paga
   ↓
7. Marcar como Recebido
   ↓
8. Visualizar no Dashboard
```

---

## 📞 Contato & Suporte

- 📖 Documentação: `/README.md`
- 🔌 API Docs: `/API_DOCUMENTATION.md`
- 📱 WhatsApp Setup: `/WUZAPI_SETUP.md`
- 🏗️ Arquitetura: `/PROJECT_STRUCTURE.md`
- ⚡ Quick Start: `/QUICK_START.md`

---

## 🎉 Tudo Pronto!

```
╔═══════════════════════════════════════════╗
║                                           ║
║  ✨ SEU PDV ESTÁ PRONTO PARA USAR! ✨    ║
║                                           ║
║  👉 npm run dev                          ║
║  👉 http://localhost:3000                ║
║                                           ║
║  📚 Leia: QUICK_START.md                 ║
║                                           ║
╚═══════════════════════════════════════════╝
```

---

## 🚀 Bora começar?

### Comando para iniciar AGORA:
```bash
npm run dev
```

Isso abrirá:
- 🖥️ Frontend → http://localhost:3000
- 🔌 Backend API → http://localhost:5000

---

## 📝 Changelog

**v1.0 - 2024**
- ✅ Dashboard completo
- ✅ 6 módulos principais
- ✅ Integração Wuzapi
- ✅ Design responsivo
- ✅ Documentação completa

---

**Desenvolvido com ❤️ para seu negócio**

*PDV System © 2024 - Todos os direitos reservados*

---

### 👉 Próximo passo: Leia [QUICK_START.md](QUICK_START.md)
