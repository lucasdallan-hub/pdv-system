# 🚀 Guia Completo - Integração Wuzapi (WhatsApp)

## ❓ O que é Wuzapi?

Wuzapi é uma plataforma que permite enviar e receber mensagens do WhatsApp através de uma API REST. Perfeito para automação de cobranças, confirmações e notificações.

## 📝 Passo a Passo para Configurar

### 1️⃣ Criar Conta Wuzapi

1. Acesse: [https://app.nxsplus.xyz](https://app.nxsplus.xyz)
2. Clique em **"Sign Up"** ou **"Criar Conta"**
3. Preencha seus dados:
   - Email
   - Senha forte
   - Telefone para WhatsApp

### 2️⃣ Conectar WhatsApp

1. Na dashboard do Wuzapi, vá para **"Devices"** ou **"Instâncias"**
2. Clique em **"+"** para adicionar nova instância
3. Selecione **"WhatsApp"**
4. Escaneie o QR Code com seu WhatsApp
   - Vá em: **Configurações > Conectado a Dispositivos > Conectar Dispositivo**
5. Escaneie o código e confirme

### 3️⃣ Obter Credenciais API

Após conectar o WhatsApp:

1. Vá para **"API"** ou **"Developer"**
2. Clique em **"Generate Token"** ou **"Create API Key"**
3. Copie os seguintes dados:

```
API Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Instance ID: seu_numero_de_instancia
API URL: https://api.nxsplus.xyz
```

### 4️⃣ Configurar no PDV System

1. Abra o arquivo `.env` na raiz do projeto:

```bash
# Windows
notepad .env

# Linux/Mac
nano .env
```

2. Procure ou adicione estas linhas:

```env
WUZAPI_URL=https://api.nxsplus.xyz
WUZAPI_TOKEN=seu_token_gerado_aqui
WUZAPI_INSTANCE=seu_instance_id_aqui
```

3. Salve o arquivo

### 5️⃣ Reiniciar o Servidor

```bash
# Parar (Ctrl+C)
# Iniciar novamente
npm run dev
```

---

## ✅ Validar Configuração

### Via Dashboard PDV

1. Acesse http://localhost:3000
2. Vá para aba **"WhatsApp"**
3. Se houver recebimentos vencidos, clique em **"Enviar Cobrança"**
4. Deve aparecer uma mensagem no WhatsApp

### Via API (cURL)

```bash
# Teste básico
curl -X GET http://localhost:5000/api/health

# Listar recebimentos vencidos
curl http://localhost:5000/api/receives/overdue/list

# Enviar cobrança (substitua ID por um válido)
curl -X POST http://localhost:5000/api/whatsapp/send-collection \
  -H "Content-Type: application/json" \
  -d '{"receive_id": 1}'
```

---

## 📱 Mensagens Disponíveis

### 1. Notificação de Cobrança
Quando um recebimento está pendente:
```
🔔 COBRANÇA 🔔

Olá João!

Você tem um pendência de pagamento:
💰 Valor: R$ 500.00
📅 Vencimento: 25/01/2024

Por favor, efetue o pagamento o quanto antes.

Dúvidas? Entre em contato conosco!
```

### 2. Aviso de Vencido
Quando uma cobrança vence:
```
⚠️ AVISO IMPORTANTE ⚠️

Olá João!

Sua fatura está vencida há 5 dias!
💰 Valor em aberto: R$ 500.00

Por favor, regularize sua situação o quanto antes.
Evite juros e multa!

Clique aqui para pagar: [link_pagamento]
```

### 3. Comprovante de Recebimento
Após receber um pagamento:
```
✅ COMPROVANTE DE RECEBIMENTO ✅

Olá João!

Recebimento confirmado com sucesso!
💰 Valor: R$ 500.00
📋 Número do pedido: #5
⏰ Data: 15/01/2024

Obrigado pela preferência!
```

---

## 🔧 Solução de Problemas

### ❌ Erro: "Invalid Token"
**Causa:** Token inválido ou expirado
**Solução:**
1. Regenere o token na dashboard Wuzapi
2. Atualize o `.env`
3. Reinicie o servidor

### ❌ Erro: "Instance not found"
**Causa:** Instance ID incorreto
**Solução:**
1. Verifique o Instance ID em Devices > sua instância
2. Copie exatamente (sem espaços)

### ❌ Mensagem não chega
**Causas possíveis:**
1. WhatsApp não está sincronizado (reconecte)
2. Número de telefone inválido
3. Limite diário excedido (Wuzapi tem limite free)

**Solução:**
```bash
# Verifique os logs
curl http://localhost:5000/api/whatsapp/logs

# Procure por "failed" para mensagens que falharam
```

### ❌ "Cannot connect to API"
**Causa:** Backend não está rodando
**Solução:**
```bash
# Verifique se o backend está ativo
npm run server

# Em outro terminal, teste:
curl http://localhost:5000/api/health
```

---

## 📊 Monitorar Envios

### Dashboard do Wuzapi
1. Acesse: https://app.nxsplus.xyz
2. Vá em **"Messages"** ou **"Histórico"**
3. Veja todas as mensagens enviadas

### Dashboard PDV
1. http://localhost:3000
2. Aba **"WhatsApp"**
3. Clique em **"Histórico de Mensagens"**

---

## 💰 Planos Wuzapi

### Free
- ✅ 20 mensagens/dia
- ✅ 1 instância
- ✅ Suporte básico

### Pro
- ✅ 1000 mensagens/dia
- ✅ 10 instâncias
- ✅ Webhooks
- ✅ Prioridade

### Enterprise
- ✅ Ilimitado
- ✅ Instâncias ilimitadas
- ✅ Suporte 24/7

---

## 🔗 Documentação Oficial

- [Wuzapi API Docs](https://app.nxsplus.xyz/api/)
- [Dashboard](https://app.nxsplus.xyz)
- [Suporte](https://app.nxsplus.xyz/support)

---

## 📌 Dicas Importantes

1. **Teste em DEV primeiro** - Não envie mensagens em massa sem testar
2. **Respeite o limite** - Wuzapi tem limite diário conforme plano
3. **Formate números** - Use formato internacional: 55 + DDD + número
4. **Mensagens amigáveis** - Personalize as mensagens para seu negócio
5. **Horários** - Respeite o horário comercial para envios

---

## 🚀 Próximos Passos

Após configurar:
1. ✅ Cadastre clientes no PDV
2. ✅ Registre vendas
3. ✅ Crie recebimentos
4. ✅ Use a aba WhatsApp para cobranças
5. ✅ Monitore os envios

---

**Pronto! Seu PDV agora tem WhatsApp integrado! 🎉**
