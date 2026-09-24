# 👁️ Guia Visual - Onde Estão os Novos Recursos

## 🗑️ Botões DELETE

### Vendas Tab

```
┌─────────────────────────────────────────────────────┐
│ ID  │ Cliente │ Total    │ Método │ Data  │ AÇÕES  │
├─────┼─────────┼──────────┼────────┼───────┼────────┤
│ #1  │ João    │ 500.00   │ Card   │ 15/01 │ 👁️ 🗑️│
│ #2  │ Maria   │ 1500.00  │ Trans  │ 14/01 │ 👁️ 🗑️│
│ #3  │ Pedro   │ 750.00   │ Cash   │ 13/01 │ 👁️ 🗑️│
└─────┴─────────┴──────────┴────────┴───────┴────────┘
                                        ↑
                                   CLIQUE AQUI
                                  (Botão Delete)
```

### Recebimentos Tab

```
┌──────────────────────────────────────────────────────────┐
│ ID │ Cliente │ Descrição │ Valor  │ Vencimento │ AÇÕES  │
├────┼─────────┼───────────┼────────┼────────────┼────────┤
│ #1 │ João    │ Venda #1  │ 500.00 │ 20/01      │✓ 💬 🗑️│
│ #2 │ Maria   │ Venda #2  │ 1500   │ 25/01 (⏰) │✓ 💬 🗑️│
└────┴─────────┴───────────┴────────┴────────────┴────────┘
                                        ↑
                            3 botões: ✓ (receber), 💬 (SMS), 🗑️ (deletar)
```

### Pagamentos Tab

```
┌────────────────────────────────────────────────────────┐
│ Descrição │ Categoria │ Valor  │ Vencimento │ AÇÕES  │
├───────────┼───────────┼────────┼────────────┼────────┤
│ Aluguel   │ Rent      │ 2000   │ 01/02      │ ✓ 🗑️  │
│ Fornec.   │ Supplier  │ 1500   │ 15/01 (⏰) │ ✓ 🗑️  │
└───────────┴───────────┴────────┴────────────┴────────┘
                                        ↑
                            Botão delete à direita
```

### Clientes Tab

```
┌──────────────────────────────────────────────────────┐
│ Nome    │ Telefone    │ Compras │ Total Gasto │ AÇÕES│
├─────────┼─────────────┼─────────┼─────────────┼──────┤
│ João    │ 11999999999 │ 5       │ 2500.00     │ 👁️ 🗑️│
│ Maria   │ 21988888888 │ 3       │ 1800.00     │ 👁️ 🗑️│
│ Pedro   │ 85987654321 │ 2       │ 950.00      │ 👁️ 🗑️│
└─────────┴─────────────┴─────────┴─────────────┴──────┘
                                        ↑
                        Clique no 🗑️ para deletar cliente
```

---

## ⚡ Botão de Lançamento Rápido

### Localização

```
┌─────────────────────────────────────────────────────────┐
│                    TELA DO SISTEMA                      │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                          ┌──────────┐  │
│                                          │    🟢+   │  │
│                                          │  Rápido  │  │
│                                          └──────────┘  │
│                                         Canto inferior  │
│                                           direito      │
└─────────────────────────────────────────────────────────┘
```

### Modal ao clicar no +

```
╔════════════════════════════════════════════╗
║    ⚡ LANÇAMENTO RÁPIDO              [X]   ║
╠════════════════════════════════════════════╣
║                                            ║
║  Tipo: [🛒 Venda Rápida ▼]               ║
║        (3 opções: Venda, Receb., Pagto) ║
║                                            ║
║  Cliente: [Selecione ▼]                   ║
║                                            ║
║  Produto: [___________________]           ║
║                                            ║
║  Valor (R$): [___________]                ║
║                                            ║
║  ┌──────────────────┐ ┌─────────────┐   ║
║  │ ✓ REGISTRAR      │ │ CANCELAR    │   ║
║  └──────────────────┘ └─────────────┘   ║
║                                            ║
╚════════════════════════════════════════════╝
```

---

## 📍 Mapa Completo do Sistema

### Dashboard (Primeira tela)

```
┌─────────────────────────────────────────────────┐
│  Vendas | Receb. | Pagtos | Clientes | WhatsApp│
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────┬──────────────┬─────────────┐  │
│  │ Vendas:     │ Recebimentos │ Pagamentos  │  │
│  │ R$ 5000     │ R$ 8000      │ R$ 3000     │  │
│  └─────────────┴──────────────┴─────────────┘  │
│                                                 │
│  [Gráficos e métricas]                         │
│                                                 │
└─────────────────────────────────────────────────┘
                      ↓
              Botão + AQUI
             (canto inferior)
```

### Todas as telas têm:

```
┌─────────────────────────────────────────────────┐
│         CONTEÚDO DA PÁGINA                      │
│                                                 │
│   [Tabela com registros]                        │
│   Coluna AÇÕES:                                 │
│   - 👁️ (ver detalhe)                            │
│   - 🗑️ (deletar)   ← NOVO!                     │
│   - 💬 (WhatsApp) [só em Recebimentos]         │
│                                                 │
│                      ┌──────┐                  │
│                      │  🟢+ │ ← Botão Rápido  │
│                      │      │   (NOVO!)       │
│                      └──────┘                  │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Fluxo de Uso

### Para DELETAR:

```
Tela qualquer uma
       ↓
Procure o registro
       ↓
Clique no 🗑️
       ↓
Confirme no popup
       ↓
DELETADO! ✓
```

### Para LANÇAR RÁPIDO:

```
Qualquer tela
       ↓
Clique no botão + verde
       ↓
Modal abre
       ↓
Selecione tipo (Venda/Receb./Pagto)
       ↓
Preencha dados
       ↓
Clique "Registrar"
       ↓
CRIADO! ✓
```

---

## 🔍 Dicas de Localização

| O que busca | Onde está |
|-----------|-----------|
| Deletar venda | Vendas tab, coluna AÇÕES, ícone 🗑️ |
| Deletar recebimento | Recebimentos tab, coluna AÇÕES, ícone 🗑️ |
| Deletar pagamento | Pagamentos tab, coluna AÇÕES, ícone 🗑️ |
| Deletar cliente | Clientes tab, coluna AÇÕES, ícone 🗑️ |
| Lançamento rápido | Botão verde + (canto inferior direito) |
| Confirmar recebimento | Recebimentos, coluna AÇÕES, ícone ✓ |
| Enviar WhatsApp | Recebimentos, coluna AÇÕES, ícone 💬 |

---

## 💡 Atalhos Rápidos

### Teclado
```
- Sem atalho de teclado por enquanto
- Apenas clique nos botões
```

### Mouse
```
- Clique no 🗑️ para deletar
- Clique no + verde para lançamento rápido
- Clique no ✓ para confirmar recebimento
- Clique no 💬 para enviar WhatsApp
```

---

## 📱 Responsividade

Os botões aparecem em:
- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x812)

Em telas pequenas, os botões ficam em linha:

```
MOBILE:
┌────────────────────┐
│ Registro           │
│ [🗑️] [✓] [💬]     │
└────────────────────┘
```

---

## ✨ Resumo Visual

| Elemento | Ícone | Cor | Função |
|----------|-------|-----|--------|
| Ver detalhe | 👁️ | Azul | Ver mais info |
| Deletar | 🗑️ | Vermelho | Remover registro |
| Receber | ✓ | Verde | Marcar como recebido |
| WhatsApp | 💬 | Azul | Enviar mensagem |
| Lançamento Rápido | + | Verde | Modal rápido |

---

**Referência Visual Completa v1.1** ✨
