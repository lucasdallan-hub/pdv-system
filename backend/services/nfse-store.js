/**
 * Persistência das NFS-e baixadas do ADN.
 *
 * Guarda o XML integral (é ele que tem valor fiscal) mais os campos que
 * interessam para listar e filtrar na tela. O controle de NSU fica aqui
 * também: é o que permite baixar só o que é novo em cada sincronização.
 */

const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const db = require('../database/db');

const XML_DIR = path.join(__dirname, '..', 'database', 'nfse-xml');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  parseTagValue: false // mantém CNPJ/chave como string, sem virar número
});

async function initialize() {
  await db.run(`
    CREATE TABLE IF NOT EXISTS nfse_notas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chave_acesso TEXT UNIQUE,
      nsu INTEGER,
      numero TEXT,
      serie TEXT,
      data_emissao TEXT,
      cnpj_prestador TEXT,
      nome_prestador TEXT,
      cnpj_tomador TEXT,
      nome_tomador TEXT,
      valor_servico DECIMAL(10, 2),
      valor_iss DECIMAL(10, 2),
      municipio TEXT,
      discriminacao TEXT,
      situacao TEXT DEFAULT 'normal',
      tipo_documento TEXT,
      xml_path TEXT,
      baixado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS nfse_sync (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      ultimo_nsu INTEGER DEFAULT 0,
      ultima_sync DATETIME,
      total_baixado INTEGER DEFAULT 0
    )
  `);

  await db.run(`INSERT OR IGNORE INTO nfse_sync (id, ultimo_nsu) VALUES (1, 0)`);

  await db.run(`CREATE INDEX IF NOT EXISTS idx_nfse_emissao ON nfse_notas(data_emissao)`);
  await db.run(`CREATE INDEX IF NOT EXISTS idx_nfse_nsu ON nfse_notas(nsu)`);

  if (!fs.existsSync(XML_DIR)) {
    fs.mkdirSync(XML_DIR, { recursive: true });
  }

  console.log('✅ Tabelas NFS-e inicializadas');
}

/** Procura uma chave em qualquer profundidade do objeto vindo do XML. */
function busca(obj, ...nomes) {
  if (!obj || typeof obj !== 'object') return undefined;
  for (const nome of nomes) {
    if (obj[nome] !== undefined && obj[nome] !== null) {
      const v = obj[nome];
      if (typeof v !== 'object') return v;
    }
  }
  for (const valor of Object.values(obj)) {
    if (valor && typeof valor === 'object') {
      const achado = busca(valor, ...nomes);
      if (achado !== undefined) return achado;
    }
  }
  return undefined;
}

/**
 * Extrai os campos de resumo do XML da NFS-e.
 * O layout nacional usa <NFSe><infNFSe>, mas municípios conveniados
 * ainda mandam variações ABRASF — por isso a busca é por nome de tag.
 */
function extrairResumo(xml) {
  let raiz;
  try {
    raiz = parser.parse(xml);
  } catch (e) {
    return { erroParse: e.message };
  }

  const num = (v) => {
    if (v === undefined || v === null || v === '') return null;
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  };

  return {
    chaveAcesso: busca(raiz, 'chAcesso', 'ChaveAcesso', 'chaveAcesso', '@Id'),
    numero: busca(raiz, 'nNFSe', 'Numero', 'numero', 'nDPS'),
    serie: busca(raiz, 'serie', 'Serie'),
    dataEmissao: busca(raiz, 'dhEmi', 'DataEmissao', 'dhProc', 'dCompet'),
    cnpjPrestador: busca(raiz, 'CNPJ', 'CnpjPrestador', 'Cnpj'),
    nomePrestador: busca(raiz, 'xNome', 'RazaoSocial', 'NomePrestador'),
    cnpjTomador: busca(raiz, 'CNPJTomador', 'CnpjTomador'),
    nomeTomador: busca(raiz, 'xNomeTomador', 'NomeTomador'),
    valorServico: num(busca(raiz, 'vServ', 'ValorServicos', 'vServPrest', 'vLiq')),
    valorIss: num(busca(raiz, 'vISSQN', 'ValorIss', 'vISS')),
    municipio: busca(raiz, 'cMunPrestacao', 'CodigoMunicipio', 'cLocPrestacao'),
    discriminacao: busca(raiz, 'xDescServ', 'Discriminacao', 'xTribNac')
  };
}

/** Grava o XML em disco. O banco guarda só o caminho. */
function salvarXml(chaveOuNsu, xml) {
  const nomeSeguro = String(chaveOuNsu).replace(/[^A-Za-z0-9_-]/g, '_');
  const arquivo = path.join(XML_DIR, `${nomeSeguro}.xml`);
  fs.writeFileSync(arquivo, xml, 'utf8');
  return path.relative(path.join(__dirname, '..', '..'), arquivo);
}

/**
 * Salva um DF-e. Idempotente: rodar a sincronização duas vezes não duplica
 * nem sobrescreve o que já está gravado.
 * @returns {'inserido'|'existente'|'sem_xml'}
 */
async function salvarDocumento(doc) {
  if (!doc.xml) return 'sem_xml';

  const resumo = extrairResumo(doc.xml);
  const chave = doc.chaveAcesso || resumo.chaveAcesso || null;

  if (chave) {
    const existente = await db.get(
      'SELECT id FROM nfse_notas WHERE chave_acesso = ?',
      [chave]
    );
    if (existente) return 'existente';
  }

  const xmlPath = salvarXml(chave || `nsu-${doc.nsu}`, doc.xml);

  await db.run(
    `INSERT INTO nfse_notas (
      chave_acesso, nsu, numero, serie, data_emissao,
      cnpj_prestador, nome_prestador, cnpj_tomador, nome_tomador,
      valor_servico, valor_iss, municipio, discriminacao,
      tipo_documento, xml_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      chave,
      doc.nsu,
      resumo.numero || null,
      resumo.serie || null,
      resumo.dataEmissao || doc.dataGeracao || null,
      resumo.cnpjPrestador || null,
      resumo.nomePrestador || null,
      resumo.cnpjTomador || null,
      resumo.nomeTomador || null,
      resumo.valorServico,
      resumo.valorIss,
      resumo.municipio || null,
      resumo.discriminacao ? String(resumo.discriminacao).slice(0, 2000) : null,
      doc.tipoDocumento || null,
      xmlPath
    ]
  );

  return 'inserido';
}

async function getUltimoNsu() {
  const row = await db.get('SELECT ultimo_nsu FROM nfse_sync WHERE id = 1');
  return row ? Number(row.ultimo_nsu) : 0;
}

async function setUltimoNsu(nsu, novasNotas = 0) {
  await db.run(
    `UPDATE nfse_sync
     SET ultimo_nsu = ?, ultima_sync = CURRENT_TIMESTAMP,
         total_baixado = total_baixado + ?
     WHERE id = 1`,
    [nsu, novasNotas]
  );
}

async function getStatusSync() {
  return db.get(
    `SELECT s.ultimo_nsu, s.ultima_sync, s.total_baixado,
            (SELECT COUNT(*) FROM nfse_notas) AS notas_no_banco
     FROM nfse_sync s WHERE s.id = 1`
  );
}

/** Lista as notas com filtros opcionais de período, CNPJ e texto. */
async function listarNotas({ de, ate, cnpj, busca: termo, limite = 200, offset = 0 } = {}) {
  const where = [];
  const params = [];

  if (de) {
    where.push('date(data_emissao) >= date(?)');
    params.push(de);
  }
  if (ate) {
    where.push('date(data_emissao) <= date(?)');
    params.push(ate);
  }
  if (cnpj) {
    const limpo = String(cnpj).replace(/\D/g, '');
    where.push('(cnpj_prestador LIKE ? OR cnpj_tomador LIKE ?)');
    params.push(`%${limpo}%`, `%${limpo}%`);
  }
  if (termo) {
    where.push('(nome_prestador LIKE ? OR nome_tomador LIKE ? OR numero LIKE ? OR chave_acesso LIKE ?)');
    params.push(`%${termo}%`, `%${termo}%`, `%${termo}%`, `%${termo}%`);
  }

  const clausula = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const notas = await db.all(
    `SELECT id, chave_acesso, nsu, numero, serie, data_emissao,
            cnpj_prestador, nome_prestador, cnpj_tomador, nome_tomador,
            valor_servico, valor_iss, municipio, situacao, baixado_em
     FROM nfse_notas
     ${clausula}
     ORDER BY COALESCE(data_emissao, baixado_em) DESC
     LIMIT ? OFFSET ?`,
    [...params, Number(limite), Number(offset)]
  );

  const totais = await db.get(
    `SELECT COUNT(*) AS quantidade,
            COALESCE(SUM(valor_servico), 0) AS valor_total,
            COALESCE(SUM(valor_iss), 0) AS iss_total
     FROM nfse_notas ${clausula}`,
    params
  );

  return { notas, totais };
}

async function getNota(id) {
  return db.get('SELECT * FROM nfse_notas WHERE id = ? OR chave_acesso = ?', [id, id]);
}

/** Devolve o XML salvo de uma nota, lido do disco. */
async function getXml(id) {
  const nota = await getNota(id);
  if (!nota || !nota.xml_path) return null;

  const abs = path.isAbsolute(nota.xml_path)
    ? nota.xml_path
    : path.join(__dirname, '..', '..', nota.xml_path);

  if (!fs.existsSync(abs)) return null;

  return {
    nome: `NFSe-${nota.numero || nota.nsu || nota.id}.xml`,
    conteudo: fs.readFileSync(abs, 'utf8')
  };
}

async function marcarSituacao(chaveAcesso, situacao) {
  await db.run('UPDATE nfse_notas SET situacao = ? WHERE chave_acesso = ?', [
    situacao,
    chaveAcesso
  ]);
}

module.exports = {
  initialize,
  salvarDocumento,
  getUltimoNsu,
  setUltimoNsu,
  getStatusSync,
  listarNotas,
  getNota,
  getXml,
  marcarSituacao,
  extrairResumo,
  XML_DIR
};
