# Baixar NFS-e sem bloqueios

O portal `nfse.gov.br/EmissorNacional` é feito para uso humano: sessão, token
antiforgery e login interativo. Automatizar aquela tela quebra a cada
atualização — e é por isso que a Receita publica uma **API oficial** para
integração de sistemas. É essa API que este módulo usa.

Sem captcha, sem robô de navegador, sem proxy. A autenticação é o mesmo
certificado digital que o portal aceita no botão "Acesso com Certificado
Digital", só que apresentado direto no handshake TLS (mTLS).

## O que você precisa

1. **Certificado e-CNPJ A1** em arquivo `.pfx` (ou `.p12`), dentro da validade.
   - A3 (token/cartão) não funciona para automação desatendida — precisa do A1.
2. O **CNPJ credenciado** no Sistema Nacional NFS-e.
3. O município do emitente aderente ao Padrão Nacional (a maioria já é; alguns
   ainda mantêm sistema próprio, e nesse caso as notas não aparecem no ADN).

## Configuração (uma vez)

1. Crie a pasta e coloque o certificado:

```bash
mkdir -p certificados
```

Copie seu `.pfx` para `certificados/ecnpj.pfx`.

2. No arquivo `.env`, preencha:

```
NFSE_CERT_PATH=./certificados/ecnpj.pfx
NFSE_CERT_PASSWORD=sua_senha
NFSE_AMBIENTE=producao
NFSE_CNPJ=12345678000199
```

3. Confirme que o certificado é aceito:

```bash
node backend/scripts/baixar-nfse.js --testar
```

Resposta esperada: `✅ Certificado aceito. Conexão com o ADN estabelecida.`

## Usando pela tela

Aba **Notas Fiscais** no menu:

- **Testar certificado** — valida a conexão com o ambiente nacional.
- **Baixar notas novas** — traz só o que chegou desde a última vez.
- **Exportar ZIP** — todos os XML do filtro atual em um arquivo só (é o que o
  contador pede).
- Por nota: **XML** (valor fiscal) e **PDF** (DANFSE, gerado na hora pelo SEFIN).

Filtros por período, CNPJ e busca livre por nome/número/chave.

## Usando pelo terminal

```bash
node backend/scripts/baixar-nfse.js
```

Para reprocessar tudo desde o início:

```bash
node backend/scripts/baixar-nfse.js --tudo
```

### Agendar no Windows

Agendador de Tarefas → Criar Tarefa Básica → diária → "Iniciar um programa":

- Programa: `node`
- Argumentos: `backend/scripts/baixar-nfse.js`
- Iniciar em: a pasta do projeto

## Como funciona o "baixar só o que é novo"

O ambiente nacional numera cada documento com um **NSU** (Número Sequencial
Único). O sistema guarda o último NSU recebido e pede o próximo bloco a partir
dele — 50 documentos por chamada. Não rebaixa o que já tem, e retomar depois de
uma queda de conexão continua de onde parou.

Rodar a sincronização duas vezes não duplica nota: a chave de acesso é única
no banco.

## Onde ficam os arquivos

- XML: `backend/database/nfse-xml/` (nomeados pela chave de acesso)
- Índice e resumo: tabela `nfse_notas` no `pdv.db`
- Controle de NSU: tabela `nfse_sync`

Nada disso vai para o git — certificado, XML e banco estão no `.gitignore`.

## Endpoints da API

| Método | Rota | Função |
|---|---|---|
| GET | `/api/nfse/status` | Configuração e estado da sincronização |
| GET | `/api/nfse/testar` | Valida o certificado contra o ADN |
| POST | `/api/nfse/sincronizar` | Baixa as notas novas |
| GET | `/api/nfse` | Lista as notas (filtros: `de`, `ate`, `cnpj`, `busca`) |
| GET | `/api/nfse/exportar/zip` | Todos os XML do filtro em um ZIP |
| GET | `/api/nfse/:id/xml` | XML de uma nota |
| GET | `/api/nfse/:chave/danfse` | PDF do DANFSE |
| GET | `/api/nfse/:chave/eventos` | Cancelamentos e substituições |

## Se der erro

**"NFSE_CERT_PATH não configurado"** — falta preencher o `.env`.

**403 / "certificado foi rejeitado"** — o CNPJ do certificado não tem acesso.
Verifique validade, se é e-CNPJ (não e-CPF) e se o CNPJ está credenciado.

**Erro de TLS / cadeia não confiável** — o Node não traz a cadeia ICP-Brasil.
Aponte para o bundle:

```bash
set NODE_EXTRA_CA_CERTS=C:\caminho\icp-brasil.pem
```

**Nenhuma nota vem** — teste primeiro em `NFSE_AMBIENTE=homologacao`. Se em
produção vier vazio, confirme que o município emite pelo Padrão Nacional.

**429** — excesso de consultas; aguarde antes de repetir.

## Referências

- [Portal NFS-e — documentação técnica](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual)
- [Manual das APIs do ADN (PDF)](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual/manual-contribuintes-apis-adn-sistema-nacional-nfse.pdf)
- [Swagger de homologação](https://adn.producaorestrita.nfse.gov.br/contribuintes/docs/index.html)
