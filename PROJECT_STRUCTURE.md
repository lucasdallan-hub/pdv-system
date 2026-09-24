# 📁 Estrutura Completa do Projeto

```
PDV-SYSTEM/
│
├── 📄 README.md                          ← Documentação principal
├── 📄 QUICK_START.md                     ← Guia rápido (5 min)
├── 📄 API_DOCUMENTATION.md               ← Referência da API
├── 📄 WUZAPI_SETUP.md                    ← Setup WhatsApp
├── 📄 PROJECT_STRUCTURE.md               ← Este arquivo
├── 📄 package.json                       ← Dependências root
├── 📄 .env.example                       ← Exemplo de configuração
├── 📄 .gitignore                         ← Git ignore
│
├── 📁 backend/                           ← Servidor Node.js + Express
│   ├── 📄 index.js                       ← Entrada principal
│   │
│   ├── 📁 database/                      ← Banco de dados
│   │   └── 📄 db.js                      ← Conexão SQLite + queries
│   │
│   ├── 📁 services/                      ← Serviços externos
│   │   └── 📄 wuzapi.js                  ← Integração WhatsApp
│   │
│   ├── 📁 routes/                        ← Rotas da API
│   │   ├── 📄 sales.js                   ← Vendas
│   │   ├── 📄 receives.js                ← Recebimentos
│   │   ├── 📄 payments.js                ← Pagamentos
│   │   ├── 📄 customers.js               ← Clientes
│   │   ├── 📄 dashboard.js               ← Dashboard
│   │   └── 📄 whatsapp.js                ← WhatsApp
│   │
│   └── 📁 scripts/                       ← Scripts utilitários
│       └── 📄 seed-data.js               ← Popular DB com testes
│
└── 📁 frontend/                          ← React 18 + Tailwind
    ├── 📄 package.json                   ← Dependências frontend
    │
    ├── 📁 public/                        ← Arquivos estáticos
    │   └── 📄 index.html                 ← HTML raiz
    │
    └── 📁 src/                           ← Código React
        ├── 📄 index.js                   ← Entrada React
        ├── 📄 index.css                  ← Estilos globais
        ├── 📄 App.jsx                    ← Componente principal
        │
        └── 📁 components/                ← Componentes React
            ├── 📄 Dashboard.jsx          ← Dashboard
            ├── 📄 Sales.jsx              ← Tela de vendas
            ├── 📄 Receives.jsx           ← Tela de recebimentos
            ├── 📄 Payments.jsx           ← Tela de pagamentos
            ├── 📄 Customers.jsx          ← Tela de clientes
            └── 📄 WhatsAppPanel.jsx      ← Tela de WhatsApp
```

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────┐
│         Frontend (React 18)             │
│    http://localhost:3000                │
│  ┌─────────────────────────────────┐   │
│  │   Dashboard                     │   │
│  │   - Resumo financeiro           │   │
│  │   - Gráficos                    │   │
│  │   - KPIs                        │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │   Tabs: Vendas, Receb., Pagtos, │   │
│  │   Clientes, WhatsApp            │   │
│  └─────────────────────────────────┘   │
└─────────────┬──────────────────────────┘
              │ HTTP/REST
              ↓
┌─────────────────────────────────────────┐
│   Backend (Express.js + SQLite)         │
│    http://localhost:5000/api            │
│  ┌─────────────────────────────────┐   │
│  │   Routes (6 módulos)            │   │
│  │   - /sales      → Sales         │   │
│  │   - /receives   → Receives      │   │
│  │   - /payments   → Payments      │   │
│  │   - /customers  → Customers     │   │
│  │   - /dashboard  → Dashboard     │   │
│  │   - /whatsapp   → WhatsApp      │   │
│  └──────────┬──────────────────────┘   │
│  ┌──────────▼──────────────────────┐   │
│  │   Services                      │   │
│  │   - Wuzapi (WhatsApp)           │   │
│  └──────────┬──────────────────────┘   │
│  ┌──────────▼──────────────────────┐   │
│  │   Database (SQLite)             │   │
│  │   - Customers                   │   │
│  │   - Sales & Items               │   │
│  │   - Receives                    │   │
│  │   - Payments                    │   │
│  │   - WhatsApp Logs               │   │
│  └─────────────────────────────────┘   │
└─────────────┬──────────────────────────┘
              │ API Calls
              ↓
┌─────────────────────────────────────────┐
│   Wuzapi (WhatsApp Integration)         │
│    https://api.nxsplus.xyz              │
│   - Enviar mensagens                    │
│   - Rastrear status                     │
└─────────────────────────────────────────┘
```

---

## 📊 Fluxo de Dados

### 1. Criar Venda
```
Frontend (Sales.jsx)
    ↓ POST /api/sales
Backend (sales.js)
    ↓ INSERT sales + sale_items
SQLite (tables: sales, sale_items)
    ↓
Frontend (atualiza lista)
```

### 2. Enviar Cobrança WhatsApp
```
Frontend (WhatsAppPanel.jsx)
    ↓ POST /api/whatsapp/send-collection
Backend (whatsapp.js)
    ↓ GET receive data (customers.phone)
    ↓ WuzAPI.sendCollectionNotice()
Wuzapi Service
    ↓ API Call
WhatsApp API
    ↓ INSERT whatsapp_logs
SQLite (whatsapp_logs)
    ↓
Frontend (atualiza histórico)
```

### 3. Dashboard Metrics
```
Frontend (Dashboard.jsx)
    ↓ GET /api/dashboard/summary
Backend (dashboard.js)
    ↓ SELECT * FROM sales WHERE DATE(sale_date) = DATE('now')
    ↓ SELECT COUNT(*) FROM receives WHERE status = 'pending'
    ↓ Agregar dados
SQLite (queries)
    ↓ Retorna JSON
Frontend (renderiza Gráficos)
```

---

## 🗄️ Banco de Dados

### Tabelas
```
CUSTOMERS
├── id (PRIMARY KEY)
├── name
├── phone (para WhatsApp)
├── email
├── cpf_cnpj
├── address
├── city
├── state
└── timestamps

SALES
├── id (PRIMARY KEY)
├── customer_id (FK)
├── total_amount
├── payment_method
├── sale_date
├── status
└── timestamps

SALE_ITEMS
├── id (PRIMARY KEY)
├── sale_id (FK)
├── product_name
├── quantity
├── unit_price
└── subtotal

RECEIVES
├── id (PRIMARY KEY)
├── customer_id (FK)
├── sale_id (FK)
├── description
├── amount
├── due_date
├── status (pending/received)
└── timestamps

PAYMENTS
├── id (PRIMARY KEY)
├── description
├── amount
├── category
├── due_date
├── status (pending/paid)
└── timestamps

WHATSAPP_LOGS
├── id (PRIMARY KEY)
├── customer_id (FK)
├── phone
├── message
├── type (collection/overdue/receipt)
├── status (pending/sent/failed)
└── timestamps
```

---

## 🔗 Dependências Principais

### Backend
```json
{
  "express": "^4.18.2",           // Framework web
  "sqlite3": "^5.1.6",            // Banco de dados
  "axios": "^1.5.0",              // HTTP client (Wuzapi)
  "cors": "^2.8.5",               // CORS middleware
  "dotenv": "^16.3.1"             // Variáveis de ambiente
}
```

### Frontend
```json
{
  "react": "^18.2.0",             // UI framework
  "react-router-dom": "^6.16.0",  // Roteamento
  "axios": "^1.5.0",              // HTTP client
  "recharts": "^2.10.0",          // Gráficos
  "lucide-react": "^0.263.1",     // Ícones
  "tailwindcss": "^3.3.0"         // Styling
}
```

---

## 🚀 Fluxo de Inicialização

```
npm run dev
├── Backend (Port 5000)
│  ├── index.js (import)
│  ├── db.initialize() → cria tabelas
│  ├── cors() → ativa CORS
│  ├── bodyParser() → parseia JSON
│  ├── routes/ → registra rotas
│  └── listen(5000)
│
└── Frontend (Port 3000)
   ├── index.js (React)
   ├── App.jsx (render)
   ├── components/ (load)
   └── Proxy → http://localhost:5000
```

---

## 🔐 Variáveis de Ambiente

```env
# Server
PORT=5000
NODE_ENV=development

# Wuzapi (opcional)
WUZAPI_URL=https://api.nxsplus.xyz
WUZAPI_TOKEN=seu_token
WUZAPI_INSTANCE=sua_instancia

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📋 Checklist de Desenvolvimento

- [x] Backend com Express
- [x] Database com SQLite
- [x] API RESTful (6 módulos)
- [x] Frontend React 18
- [x] Componentes (6 principais)
- [x] Integração Wuzapi
- [x] Gráficos Recharts
- [x] Design Tailwind
- [x] Documentação
- [x] Scripts de seed

---

## 🎯 Próximos Passos para Customização

1. **Adicione autenticação** → JWT
2. **Implemente relatórios** → PDF
3. **Adicione NF-e** → Integração gov.br
4. **Controle de estoque** → Novo módulo
5. **App mobile** → React Native
6. **Múltiplas filiais** → Suporte multi-tenant

---

## 📝 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                    # Backend + Frontend
npm run server                # Apenas Backend
cd frontend && npm start      # Apenas Frontend

# Banco de dados
node backend/scripts/seed-data.js    # Popular com testes

# Produção
npm run build                 # Build frontend
NODE_ENV=production npm start # Rodar produção

# Debug
curl http://localhost:5000/api/health    # Check API
curl http://localhost:5000/api/customers # Test data
```

---

**Documentação da Estrutura do Projeto - PDV System v1.0**
