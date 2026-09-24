# 🏪 PDV System - Sistema de Ponto de Venda

Um **sistema completo de PDV (Ponto de Venda)** com controle financeiro integrado, gerenciamento de recebimentos e pagamentos, notificações via WhatsApp (Wuzapi) e dashboard atrativo.

## ✨ Funcionalidades

- ✅ **Dashboard Inteligente** - Visão geral de vendas, recebimentos e pagamentos
- 🛒 **Gestão de Vendas** - Registro de vendas com múltiplos itens
- 💰 **Recebimentos** - Controle de recebimentos pendentes e vencidos
- 📊 **Pagamentos** - Gestão de contas a pagar
- 👥 **Clientes** - Cadastro e histórico de clientes
- 📱 **WhatsApp Integrado** - Notificações de cobrança via Wuzapi
- 📈 **Gráficos** - Visualização de dados com Recharts
- 🎨 **Interface Moderna** - Design atrativo com Tailwind CSS

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 14+ 
- npm ou yarn
- SQLite3 (incluído no pacote)

### Instalação

1. **Clone o repositório** (ou descompacte os arquivos)
```bash
cd pdv-system
```

2. **Instale dependências do backend**
```bash
npm install
```

3. **Instale dependências do frontend**
```bash
cd frontend
npm install
cd ..
```

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
PORT=5000
NODE_ENV=development

# Configuração Wuzapi (opcional para teste)
WUZAPI_URL=https://api.nxsplus.xyz
WUZAPI_TOKEN=seu_token_aqui
WUZAPI_INSTANCE=sua_instancia_aqui

REACT_APP_API_URL=http://localhost:5000/api
```

### Iniciar a Aplicação

**Desenvolvimento (Backend e Frontend juntos):**
```bash
npm run dev
```

Isso iniciará:
- 🔌 Backend na porta `5000` (http://localhost:5000)
- 🖥️ Frontend na porta `3000` (http://localhost:3000)

**Ou separadamente:**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

## 📋 Estrutura do Projeto

```
pdv-system/
├── backend/
│   ├── database/
│   │   └── db.js              # Inicialização do SQLite
│   ├── services/
│   │   └── wuzapi.js          # Integração com WhatsApp
│   ├── routes/
│   │   ├── sales.js           # Rotas de vendas
│   │   ├── receives.js        # Rotas de recebimentos
│   │   ├── payments.js        # Rotas de pagamentos
│   │   ├── customers.js       # Rotas de clientes
│   │   ├── dashboard.js       # Rotas de dashboard
│   │   └── whatsapp.js        # Rotas de WhatsApp
│   └── index.js               # Servidor principal
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Sales.jsx
│   │   │   ├── Receives.jsx
│   │   │   ├── Payments.jsx
│   │   │   ├── Customers.jsx
│   │   │   └── WhatsAppPanel.jsx
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── .env.example
├── package.json
└── README.md
```

## 🔌 Integração Wuzapi (WhatsApp)

### Como Configurar

1. **Crie uma conta em** [https://app.nxsplus.xyz](https://app.nxsplus.xyz)

2. **Obtenha suas credenciais:**
   - Token de API
   - ID da Instância

3. **Configure no `.env`:**
```env
WUZAPI_URL=https://api.nxsplus.xyz
WUZAPI_TOKEN=seu_token_aqui
WUZAPI_INSTANCE=sua_instancia_aqui
```

### Endpoints de Cobrança

- `POST /api/whatsapp/send-collection` - Enviar cobrança individual
- `POST /api/whatsapp/send-overdue` - Enviar aviso de vencido
- `POST /api/whatsapp/send-receipt` - Enviar comprovante
- `POST /api/whatsapp/send-bulk-collections` - Enviar cobranças em massa
- `GET /api/whatsapp/logs` - Histórico de mensagens

### Formato de Envio

```bash
curl -X POST http://localhost:5000/api/whatsapp/send-collection \
  -H "Content-Type: application/json" \
  -d '{
    "receive_id": 1
  }'
```

## 📊 API Endpoints

### Vendas
- `GET /api/sales` - Listar vendas
- `POST /api/sales` - Criar venda
- `GET /api/sales/:id` - Detalhe da venda

### Recebimentos
- `GET /api/receives` - Recebimentos pendentes
- `POST /api/receives` - Criar recebimento
- `PUT /api/receives/:id/confirm` - Confirmar recebimento
- `GET /api/receives/overdue/list` - Recebimentos vencidos

### Pagamentos
- `GET /api/payments` - Pagamentos pendentes
- `POST /api/payments` - Criar pagamento
- `PUT /api/payments/:id/pay` - Marcar como pago
- `GET /api/payments/overdue/list` - Pagamentos vencidos

### Clientes
- `GET /api/customers` - Listar clientes
- `POST /api/customers` - Criar cliente
- `GET /api/customers/:id` - Detalhe do cliente
- `PUT /api/customers/:id` - Atualizar cliente

### Dashboard
- `GET /api/dashboard/summary` - Resumo financeiro
- `GET /api/dashboard/cashflow` - Fluxo de caixa
- `GET /api/dashboard/top-products` - Produtos mais vendidos

## 🎨 Customização

### Alterar Cores
Edite `frontend/src/App.jsx` e `frontend/src/components/*`:
- Cores primárias: `from-blue-500 to-blue-600`
- Cores secundárias: Gradient colors

### Temas
O sistema usa Tailwind CSS. Edite `frontend/tailwind.config.js` para personalizar.

## 🐛 Troubleshooting

### Erro: "Cannot find module 'sqlite3'"
```bash
npm install sqlite3 --save
```

### Porta 5000 já em uso
```bash
# Altere no arquivo .env
PORT=5001
```

### Conexão recusada (API)
Certifique-se que o backend está rodando:
```bash
npm run server
```

## 📈 Performance

- Banco de dados: SQLite (sem instalação necessária)
- Cache de dashboard: Atualiza a cada 30 segundos
- Responsivo: Funciona em desktop e mobile
- Otimizado: Queries com índices para melhor performance

## 🔐 Segurança

- ✅ Validação de entrada
- ✅ Proteção contra SQL Injection (usando prepared statements)
- ✅ CORS habilitado para comunicação frontend-backend
- ⚠️ Para produção, adicione autenticação e HTTPS

## 📝 Exemplo de Uso

### 1. Criar um Cliente
```javascript
POST /api/customers
{
  "name": "João Silva",
  "phone": "11999999999",
  "email": "joao@email.com",
  "cpf_cnpj": "12345678901234",
  "address": "Rua X, 123",
  "city": "São Paulo",
  "state": "SP"
}
```

### 2. Criar uma Venda
```javascript
POST /api/sales
{
  "customer_id": 1,
  "payment_method": "card",
  "items": [
    {
      "product_name": "Produto A",
      "quantity": 2,
      "unit_price": 50.00
    }
  ]
}
```

### 3. Enviar Cobrança via WhatsApp
```javascript
POST /api/whatsapp/send-collection
{
  "receive_id": 1
}
```

## 🤝 Contribuindo

Este é um projeto base. Sinta-se livre para:
- Adicionar novas funcionalidades
- Melhorar a interface
- Otimizar o banco de dados
- Implementar autenticação

## 📄 Licença

Aberto para uso e modificação.

## 💬 Suporte Wuzapi

Para problemas com a integração WhatsApp:
- [Documentação Wuzapi](https://app.nxsplus.xyz/api/)
- [Dashboard Wuzapi](https://app.nxsplus.xyz)

## 🎯 Roadmap Futuro

- 🔐 Autenticação de usuários
- 📧 Notificações por email
- 🎫 Sistema de cupom/desconto
- 📦 Controle de estoque
- 🧮 Nota fiscal integrada
- 📱 App mobile
- 🌐 Suporte a múltiplas filiais

---

**Desenvolvido com ❤️ para seu negócio** 🚀
