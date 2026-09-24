# ⚡ Guia Rápido - PDV System

## 🚀 Iniciar em 5 Minutos

### 1. Instalação Rápida
```bash
# Instalar dependências
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 2. Configurar (opcional para testes)
```bash
# Copiar arquivo de configuração
cp .env.example .env

# Se quer usar WhatsApp, edite .env com suas credenciais Wuzapi
# Senão, o sistema funciona sem WhatsApp
```

### 3. Iniciar
```bash
# Inicia Backend (5000) e Frontend (3000) simultaneamente
npm run dev
```

Pronto! Abra: **http://localhost:3000**

---

## 📱 Telas Principais

### Dashboard
- Visão geral de vendas, recebimentos e pagamentos
- Gráficos e métricas em tempo real
- 📊 Vendas dos últimos 7 dias

### Vendas
- Registrar nova venda
- Ver histórico completo
- 🛒 Suporta múltiplos itens por venda

### Recebimentos
- Listar recebimentos pendentes
- Filtrar vencidos
- 📱 Enviar cobrança via WhatsApp
- ✅ Marcar como recebido

### Pagamentos
- Gerenciar contas a pagar
- Rastrear vencimentos
- ✔️ Marcar como pago

### Clientes
- Cadastrar clientes
- Ver histórico de compras
- 👥 Controle de dados

### WhatsApp
- 📨 Enviar cobranças individuais
- 📬 Cobrança em massa
- 📊 Ver histórico de mensagens

---

## 💾 Dados de Teste

Para popular com dados de teste:

```bash
node backend/scripts/seed-data.js
```

Isso cria:
- 4 clientes com telefones
- 4 vendas
- 4 recebimentos (alguns vencidos)
- 4 pagamentos (alguns vencidos)

---

## 🎯 Casos de Uso

### Usar sem WhatsApp
1. Deixe `.env` vazio (ou remova as linhas Wuzapi)
2. Tudo funciona normalmente
3. Apenas o botão de WhatsApp não enviará

### Usar com WhatsApp
1. Crie conta em https://app.nxsplus.xyz
2. Configure `.env` com suas credenciais
3. Clique em "Enviar Cobrança" na aba WhatsApp

### Rodar Backend e Frontend separadamente
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd frontend && npm start
```

---

## 📊 Testar API

```bash
# Verificar se está rodando
curl http://localhost:5000/api/health

# Listar clientes
curl http://localhost:5000/api/customers

# Listar recebimentos
curl http://localhost:5000/api/receives
```

---

## 🔗 URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Documentação API**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Setup Wuzapi**: [WUZAPI_SETUP.md](WUZAPI_SETUP.md)
- **README Completo**: [README.md](README.md)

---

## 🆘 Problemas Comuns

### Porta já em uso
```bash
# Altere em .env ou use:
PORT=5001 npm run server
```

### Módulos faltando
```bash
npm install
cd frontend && npm install
```

### Banco de dados vazio
```bash
# Popule com dados de teste
node backend/scripts/seed-data.js
```

### WhatsApp não funciona
1. Verifique `.env` está preenchido
2. Teste a conexão com Wuzapi
3. Veja [WUZAPI_SETUP.md](WUZAPI_SETUP.md)

---

## 📝 Operações Básicas

### Criar Cliente
1. Clique em "Novo Cliente"
2. Preencha nome, telefone, email
3. Salve

### Registrar Venda
1. Na aba "Vendas", clique "Nova Venda"
2. Selecione cliente
3. Adicione produtos
4. Escolha método de pagamento
5. Registre

### Enviar Cobrança WhatsApp
1. Vá para aba "WhatsApp"
2. Veja recebimentos vencidos
3. Clique "Enviar" ou "Enviar em Massa"

---

## 💡 Dicas

✅ **Faça backup** do arquivo `backend/database/pdv.db` regularmente

✅ **Teste com dados reais** após criar alguns clientes e vendas

✅ **Customize as mensagens** em `backend/services/wuzapi.js`

✅ **Monitore os logs** em WhatsApp > Histórico

---

## 🎓 Próximos Passos

1. ✅ Instalar e rodar
2. ✅ Criar alguns clientes
3. ✅ Fazer vendas de teste
4. ✅ Testar recebimentos
5. ✅ Configurar WhatsApp (opcional)
6. ✅ Customizar para seu negócio

---

## 📞 Suporte

- 📚 Documentação: [README.md](README.md)
- 🔌 API: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- 📱 WhatsApp: [WUZAPI_SETUP.md](WUZAPI_SETUP.md)

---

**Tudo pronto? Divirta-se! 🎉**
