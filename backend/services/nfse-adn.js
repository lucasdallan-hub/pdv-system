/**
 * Cliente da API oficial do ADN (Ambiente de Dados Nacional) da NFS-e.
 *
 * Autentica via mTLS com certificado digital e-CNPJ A1 (.pfx) — mesmo
 * certificado que o portal aceita no login "Acesso com Certificado Digital".
 * Não há captcha, rate-limit agressivo nem bloqueio de bot nesse caminho,
 * porque é a interface feita para integração de sistemas.
 *
 * Docs: https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const axios = require('axios');

const AMBIENTES = {
  producao: {
    adn: 'https://adn.nfse.gov.br/contribuintes',
    sefin: 'https://sefin.nfse.gov.br/SefinNacional'
  },
  homologacao: {
    adn: 'https://adn.producaorestrita.nfse.gov.br/contribuintes',
    sefin: 'https://sefin.producaorestrita.nfse.gov.br/SefinNacional'
  }
};

// O ADN devolve no máximo 50 DF-e por chamada de /DFe/{NSU}.
const LOTE_MAX = 50;

let agentCache = null;

/**
 * Monta o https.Agent com o certificado A1. O agent é cacheado porque
 * recriar a cada request força novo handshake TLS a cada nota.
 */
function getAgent() {
  const certPath = process.env.NFSE_CERT_PATH;
  const certPass = process.env.NFSE_CERT_PASSWORD;

  if (!certPath) {
    throw new Error(
      'NFSE_CERT_PATH não configurado. Aponte para o seu arquivo .pfx (e-CNPJ A1) no .env'
    );
  }

  const resolved = path.isAbsolute(certPath)
    ? certPath
    : path.join(__dirname, '..', '..', certPath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`Certificado não encontrado em: ${resolved}`);
  }

  if (agentCache && agentCache.path === resolved) {
    return agentCache.agent;
  }

  const agent = new https.Agent({
    pfx: fs.readFileSync(resolved),
    passphrase: certPass || '',
    keepAlive: true,
    // O ADN usa cadeia ICP-Brasil, que não está no store padrão do Node.
    // Mantemos a verificação do servidor ligada; se a sua máquina não tiver
    // a cadeia, aponte NODE_EXTRA_CA_CERTS para o bundle da ICP-Brasil.
    rejectUnauthorized: process.env.NFSE_TLS_STRICT !== 'false'
  });

  agentCache = { path: resolved, agent };
  return agent;
}

function baseUrls() {
  const amb = (process.env.NFSE_AMBIENTE || 'producao').toLowerCase();
  const urls = AMBIENTES[amb];
  if (!urls) {
    throw new Error(`NFSE_AMBIENTE inválido: "${amb}". Use "producao" ou "homologacao".`);
  }
  return urls;
}

function client(baseURL, responseType = 'json') {
  return axios.create({
    baseURL,
    httpsAgent: getAgent(),
    responseType,
    timeout: Number(process.env.NFSE_TIMEOUT_MS || 60000),
    // Tratamos os erros HTTP nós mesmos para dar mensagem útil em pt-BR.
    validateStatus: () => true,
    headers: { Accept: 'application/json' }
  });
}

/** Traduz os códigos de erro que o ADN costuma devolver. */
function explicaErro(status, corpo) {
  const detalhe =
    corpo && typeof corpo === 'object'
      ? corpo.Mensagem || corpo.mensagem || JSON.stringify(corpo).slice(0, 300)
      : String(corpo || '').slice(0, 300);

  switch (status) {
    case 400:
      return `Requisição inválida (400). ${detalhe}`;
    case 403:
      return (
        'Acesso negado (403). O certificado foi rejeitado no handshake mTLS. ' +
        'Verifique se é um e-CNPJ A1 válido, dentro da validade, e se o CNPJ ' +
        'está credenciado no Sistema Nacional NFS-e.'
      );
    case 404:
      return `Não encontrado (404). ${detalhe}`;
    case 429:
      return 'Limite de consultas excedido (429). Aguarde antes de repetir.';
    default:
      return `Erro HTTP ${status}. ${detalhe}`;
  }
}

/**
 * Descompacta o conteúdo de um DF-e.
 * O ADN devolve o XML da nota em GZip + Base64.
 */
function descompactaXml(base64) {
  const buf = Buffer.from(base64, 'base64');
  try {
    return zlib.gunzipSync(buf).toString('utf8');
  } catch (e) {
    // Alguns documentos vêm sem compressão; cai para o texto puro.
    const texto = buf.toString('utf8');
    if (texto.trimStart().startsWith('<')) return texto;
    throw new Error(`Falha ao descompactar o XML do DF-e: ${e.message}`);
  }
}

/**
 * Busca um lote de DF-e a partir de um NSU.
 * @param {number} nsu último NSU já conhecido (use 0 na primeira vez)
 * @param {string} [cnpj] CNPJ a consultar; precisa ter a mesma raiz do certificado
 * @returns {Promise<{documentos: Array, ultimoNsu: number, maiorNsu: number, vazio: boolean}>}
 */
async function buscarLoteDFe(nsu = 0, cnpj = null) {
  const { adn } = baseUrls();
  const url = `/DFe/${nsu}` + (cnpj ? `?cnpj=${cnpj}` : '');

  const resp = await client(adn).get(url);

  // 204 = não há DF-e novo a partir desse NSU.
  if (resp.status === 204) {
    return { documentos: [], ultimoNsu: nsu, maiorNsu: nsu, vazio: true };
  }

  if (resp.status < 200 || resp.status >= 300) {
    throw new Error(explicaErro(resp.status, resp.data));
  }

  const corpo = resp.data || {};
  const lote = corpo.LoteDFe || corpo.loteDFe || [];

  const documentos = lote.map((item) => {
    const nsuItem = Number(item.NSU ?? item.nsu);
    const base64 = item.ArquivoXml || item.arquivoXml;
    return {
      nsu: nsuItem,
      chaveAcesso: item.ChaveAcesso || item.chaveAcesso || null,
      tipoDocumento: item.TipoDocumento || item.tipoDocumento || null,
      dataGeracao: item.DataHoraGeracao || item.dataHoraGeracao || null,
      xml: base64 ? descompactaXml(base64) : null
    };
  });

  const ultimoNsu = documentos.length
    ? Math.max(...documentos.map((d) => d.nsu))
    : nsu;

  return {
    documentos,
    ultimoNsu,
    maiorNsu: Number(corpo.MaiorNSU ?? corpo.maiorNSU ?? ultimoNsu),
    vazio: documentos.length === 0
  };
}

/**
 * Percorre a paginação por NSU até esgotar os documentos.
 * @param {object} opts
 * @param {number} opts.nsuInicial NSU de onde continuar
 * @param {number} opts.maxLotes teto de chamadas, para não varrer o histórico inteiro sem querer
 * @param {string} opts.cnpj
 * @param {(info:object)=>void} opts.onLote callback por lote, para persistir incrementalmente
 */
async function sincronizarDFe({ nsuInicial = 0, maxLotes = 40, cnpj = null, onLote } = {}) {
  let nsu = nsuInicial;
  let lotes = 0;
  const todos = [];

  while (lotes < maxLotes) {
    const lote = await buscarLoteDFe(nsu, cnpj);
    lotes++;

    if (lote.vazio) break;

    todos.push(...lote.documentos);
    if (onLote) await onLote(lote);

    nsu = lote.ultimoNsu;

    // Lote menor que o máximo significa que chegamos ao fim da fila.
    if (lote.documentos.length < LOTE_MAX) break;
  }

  return { documentos: todos, ultimoNsu: nsu, lotes };
}

/** Consulta o XML de uma NFS-e pela chave de acesso (50 caracteres). */
async function consultarNfsePorChave(chaveAcesso) {
  const { sefin } = baseUrls();
  const resp = await client(sefin).get(`/nfse/${chaveAcesso}`);

  if (resp.status < 200 || resp.status >= 300) {
    throw new Error(explicaErro(resp.status, resp.data));
  }

  const corpo = resp.data || {};
  const base64 = corpo.NfseXmlGZipB64 || corpo.nfseXmlGZipB64 || corpo.ArquivoXml;

  return {
    chaveAcesso,
    xml: base64 ? descompactaXml(base64) : null
  };
}

/** Baixa o PDF do DANFSE de uma nota. Retorna Buffer. */
async function baixarDanfse(chaveAcesso) {
  const { sefin } = baseUrls();
  const resp = await client(sefin, 'arraybuffer').get(`/danfse/${chaveAcesso}`, {
    headers: { Accept: 'application/pdf' }
  });

  if (resp.status < 200 || resp.status >= 300) {
    const corpo = Buffer.isBuffer(resp.data) ? resp.data.toString('utf8') : resp.data;
    throw new Error(explicaErro(resp.status, corpo));
  }

  return Buffer.from(resp.data);
}

/** Lista os eventos (cancelamento, substituição...) vinculados a uma nota. */
async function consultarEventos(chaveAcesso) {
  const { adn } = baseUrls();
  const resp = await client(adn).get(`/NFSe/${chaveAcesso}/Eventos`);

  if (resp.status === 204) return [];
  if (resp.status < 200 || resp.status >= 300) {
    throw new Error(explicaErro(resp.status, resp.data));
  }

  const lote = resp.data?.LoteDFe || resp.data?.loteDFe || [];
  return lote.map((item) => ({
    nsu: Number(item.NSU ?? item.nsu),
    tipoEvento: item.TipoEvento || item.tipoEvento || null,
    xml: (item.ArquivoXml || item.arquivoXml)
      ? descompactaXml(item.ArquivoXml || item.arquivoXml)
      : null
  }));
}

/** Verifica se o certificado está válido e se o ADN aceita a conexão. */
async function testarConexao() {
  const { adn } = baseUrls();
  const inicio = Date.now();

  const resp = await client(adn).get('/DFe/0');
  const ok = resp.status === 200 || resp.status === 204;

  return {
    ok,
    status: resp.status,
    ambiente: (process.env.NFSE_AMBIENTE || 'producao').toLowerCase(),
    endpoint: adn,
    tempoMs: Date.now() - inicio,
    mensagem: ok
      ? 'Certificado aceito. Conexão com o ADN estabelecida.'
      : explicaErro(resp.status, resp.data)
  };
}

module.exports = {
  buscarLoteDFe,
  sincronizarDFe,
  consultarNfsePorChave,
  baixarDanfse,
  consultarEventos,
  testarConexao,
  descompactaXml,
  AMBIENTES,
  LOTE_MAX
};
