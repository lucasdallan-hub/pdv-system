# 📚 Documentação da API - PDV System

## Base URL
```
http://localhost:5000/api
```

## Headers
```
Content-Type: application/json
```

---

## 🏪 Vendas

### Criar Venda
```
POST /sales
```

**Request:**
```json
{
  "customer_id": 1,
  "payment_method": "cash|card|transfer|check",
  "items": [
    {
      "product_name": "Produto X",
      "quantity": 2,
      "unit_price": 50.00
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "sale_id": 1,
  "total": 100.00
}
```

### Listar Vendas
```
GET /sales
```

**Response:**
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "customer_name": "João Silva",
    "total_amount": 100.00,
    "payment_method": "cash",
    "status": "completed",
    "sale_date": "2024-01-15T10:30:00"
  }
]
```

### Detalhe da Venda
```
GET /sales/:id
```

**Response:**
```json
{
  "sale": {
    "id": 1,
    "customer_name": "João Silva",
    "customer_phone": "11999999999",
    "total_amount": 100.00,
    ...
  },
  "items": [
    {
      "product_name": "Produto X",
      "quantity": 2,
      "unit_price": 50.00,
      "subtotal": 100.00
    }
  ]
}
```

---

## 💰 Recebimentos

### Listar Recebimentos Pendentes
```
GET /receives
```

**Response:**
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "customer_name": "João Silva",
    "phone": "11999999999",
    "description": "Venda #1",
    "amount": 100.00,
    "payment_method": "transfer",
    "due_date": "2024-01-20",
    "status": "pending"
  }
]
```

### Criar Recebimento
```
POST /receives
```

**Request:**
```json
{
  "customer_id": 1,
  "description": "Venda para cliente XYZ",
  "amount": 500.00,
  "due_date": "2024-01-25"
}
```

**Response:**
```json
{
  "success": true,
  "receive_id": 5
}
```

### Confirmar Recebimento
```
PUT /receives/:id/confirm
```

**Request:**
```json
{
  "payment_method": "transferred"
}
```

### Listar Recebimentos Vencidos
```
GET /receives/overdue/list
```

**Response:**
```json
[
  {
    "id": 1,
    "customer_name": "João Silva",
    "phone": "11999999999",
    "amount": 100.00,
    "due_date": "2024-01-10",
    "days_overdue": 5,
    "status": "pending"
  }
]
```

---

## 📊 Pagamentos

### Listar Pagamentos
```
GET /payments
```

**Response:**
```json
[
  {
    "id": 1,
    "description": "Aluguel",
    "amount": 2000.00,
    "category": "rent",
    "due_date": "2024-02-01",
    "status": "pending",
    "payment_method": null
  }
]
```

### Criar Pagamento
```
POST /payments
```

**Request:**
```json
{
  "description": "Fornecedor ABC",
  "amount": 1500.00,
  "category": "supplier",
  "due_date": "2024-01-25"
}
```

### Marcar Pagamento como Pago
```
PUT /payments/:id/pay
```

**Request:**
```json
{
  "payment_method": "transfer"
}
```

### Listar Pagamentos Vencidos
```
GET /payments/overdue/list
```

---

## 👥 Clientes

### Listar Clientes
```
GET /customers
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "phone": "11999999999",
    "email": "joao@email.com",
    "cpf_cnpj": "12345678901234",
    "address": "Rua X, 123",
    "city": "São Paulo",
    "state": "SP",
    "total_sales": 5,
    "total_spent": 2500.00,
    "created_at": "2024-01-10"
  }
]
```

### Criar Cliente
```
POST /customers
```

**Request:**
```json
{
  "name": "Maria Santos",
  "phone": "11988888888",
  "email": "maria@email.com",
  "cpf_cnpj": "98765432100000",
  "address": "Av Y, 456",
  "city": "Rio de Janeiro",
  "state": "RJ"
}
```

**Response:**
```json
{
  "success": true,
  "customer_id": 2
}
```

### Detalhe do Cliente
```
GET /customers/:id
```

### Atualizar Cliente
```
PUT /customers/:id
```

---

## 📈 Dashboard

### Resumo Financeiro
```
GET /dashboard/summary
```

**Response:**
```json
{
  "salestoday": {
    "count": 5,
    "total": 1000.00
  },
  "receivePending": {
    "count": 3,
    "total": 1500.00
  },
  "paymentsPending": {
    "count": 2,
    "total": 2000.00
  },
  "receivesOverdue": {
    "count": 1,
    "total": 500.00
  },
  "paymentsOverdue": {
    "count": 1,
    "total": 1000.00
  },
  "totalCustomers": {
    "count": 10
  },
  "salesLast7": [
    {
      "date": "2024-01-15",
      "total": 500.00
    }
  ]
}
```

### Fluxo de Caixa
```
GET /dashboard/cashflow
```

**Response:**
```json
{
  "inflow": 5000.00,
  "outflow": 2500.00,
  "balance": 2500.00
}
```

### Produtos Mais Vendidos
```
GET /dashboard/top-products
```

**Response:**
```json
[
  {
    "product_name": "Produto A",
    "total_qty": 50,
    "total_value": 2500.00
  }
]
```

---

## 📱 WhatsApp (Wuzapi)

### Enviar Cobrança Individual
```
POST /whatsapp/send-collection
```

**Request:**
```json
{
  "receive_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Mensagem enviada com sucesso"
  }
}
```

### Enviar Aviso de Vencido
```
POST /whatsapp/send-overdue
```

**Request:**
```json
{
  "receive_id": 1
}
```

### Enviar Comprovante de Recebimento
```
POST /whatsapp/send-receipt
```

**Request:**
```json
{
  "sale_id": 1,
  "customer_id": 1
}
```

### Enviar Cobranças em Massa
```
POST /whatsapp/send-bulk-collections
```

**Response:**
```json
{
  "total": 5,
  "results": [
    {
      "customer": "João Silva",
      "phone": "5511999999999",
      "success": true
    }
  ]
}
```

### Histórico de Mensagens
```
GET /whatsapp/logs
```

**Response:**
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "name": "João Silva",
    "phone": "5511999999999",
    "message": "Cobrança enviada",
    "type": "collection",
    "status": "sent",
    "sent_at": "2024-01-15T10:30:00"
  }
]
```

---

## 🔐 Tratamento de Erros

Todos os erros retornam com status apropriado:

```json
{
  "error": "Descrição do erro"
}
```

### Códigos de Status HTTP
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## 📋 Modelos de Dados

### Customer (Cliente)
```
id: INTEGER PRIMARY KEY
name: TEXT NOT NULL
phone: TEXT
email: TEXT
cpf_cnpj: TEXT UNIQUE
address: TEXT
city: TEXT
state: TEXT
created_at: DATETIME
updated_at: DATETIME
```

### Sale (Venda)
```
id: INTEGER PRIMARY KEY
customer_id: INTEGER
total_amount: DECIMAL(10,2)
payment_method: TEXT
sale_date: DATETIME
status: TEXT (completed, cancelled)
created_at: DATETIME
```

### Receive (Recebimento)
```
id: INTEGER PRIMARY KEY
customer_id: INTEGER
sale_id: INTEGER
description: TEXT
amount: DECIMAL(10,2)
payment_method: TEXT
receive_date: DATETIME
due_date: DATETIME
status: TEXT (pending, received)
created_at: DATETIME
```

### Payment (Pagamento)
```
id: INTEGER PRIMARY KEY
description: TEXT
amount: DECIMAL(10,2)
payment_method: TEXT
category: TEXT
due_date: DATETIME
payment_date: DATETIME
status: TEXT (pending, paid)
created_at: DATETIME
```

---

## 🧪 Teste com cURL

```bash
# Criar cliente
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Cliente",
    "phone": "11999999999",
    "email": "teste@email.com"
  }'

# Listar clientes
curl http://localhost:5000/api/customers

# Verificar saúde da API
curl http://localhost:5000/api/health
```

---

**Última atualização:** 2024-01-15
