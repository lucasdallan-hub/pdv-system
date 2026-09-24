# 🚀 Rodar Manualmente - Passo a Passo

Se o `SETUP.bat` não funcionou, siga estes passos:

---

## 📝 Passo 1: Abra 2 Terminais (Windows CMD ou PowerShell)

### Terminal 1:
```
Windows key + R
Digite: cmd
Pressione Enter
```

### Terminal 2:
```
Windows key + R
Digite: cmd
Pressione Enter
```

Agora você tem 2 janelas de comando abertas.

---

## 🔧 Passo 2: No Terminal 1 - Backend

**Copie e cole este comando:**

```
cd C:\Users\User\OneDrive\Imagens\Claude Code
npm install
npm run server
```

Você deve ver:

```
✅ Database initialized successfully
🚀 PDV System running on port 5000
```

**NÃO FECHE ESTE TERMINAL!** Deixe rodando.

---

## 🎨 Passo 3: No Terminal 2 - Frontend

**Copie e cole este comando:**

```
cd C:\Users\User\OneDrive\Imagens\Claude Code\frontend
npm install
npm start
```

Você deve ver:

```
Compiled successfully!
Local: http://localhost:3000
```

Um navegador abrirá automaticamente.

---

## ✅ Passo 4: Verificar

Aguarde uns 10 segundos e você verá:

1. ✅ Dashboard com métricas
2. ✅ Tabs: Vendas, Recebimentos, Pagamentos, etc
3. ✅ Tudo funcional e pronto!

---

## 📱 Se não abrir o navegador

Abra manualmente:

```
http://localhost:3000
```

---

## 💾 Criar Dados de Teste (Opcional)

Se quer dados de teste, em outro terminal rode:

```
cd C:\Users\User\OneDrive\Imagens\Claude Code
node backend/scripts/seed-data.js
```

Isso cria 4 clientes, 4 vendas, 4 recebimentos, etc.

---

## 🎯 Resumo Rápido

| Terminal | Comando | Resultado |
|----------|---------|-----------|
| **1** | `npm run server` | Backend rodando (5000) |
| **2** | `cd frontend && npm start` | Frontend rodando (3000) |
| **Browser** | http://localhost:3000 | App aberta! |

---

## 🆘 Erros Comuns

### ❌ "npm: command not found"
→ Node.js não está instalado
→ Baixe em: https://nodejs.org/

### ❌ "EADDRINUSE: address already in use :::5000"
→ Outra app está usando a porta 5000
→ Feche outras aplicações ou mude a porta em `.env`

### ❌ "Cannot find module"
→ Faltam dependências
→ Rode: `npm install` novamente

### ❌ Tela branca no navegador
→ Aguarde mais alguns segundos
→ Pressione F5 para atualizar

---

## 💡 Próximas Vezes

Após a primeira instalação, você só precisa rodar:

**Terminal 1:**
```
npm run server
```

**Terminal 2:**
```
cd frontend && npm start
```

---

## 📌 Manter Tudo Rodando

- ✅ Não feche os 2 terminais enquanto usar a app
- ✅ Para parar: Pressione `Ctrl+C` em cada terminal
- ✅ Para reiniciar: Execute os comandos novamente

---

**Pronto! Seu PDV está funcionando! 🎉**

Qualquer dúvida, revise [WELCOME.md](WELCOME.md)
