const express = require('express');
const router = express.Router();
const archiver = require('archiver');
const adn = require('../services/nfse-adn');
const store = require('../services/nfse-store');

/** Erro do serviço -> resposta HTTP com mensagem legível. */
function falha(res, error, status = 500) {
  console.error('[NFS-e]', error.message);
  res.status(status).json({ success: false, error: error.message });
}

// GET /api/nfse/status — configuração atual + estado da última sincronização
router.get('/status', async (req, res) => {
  try {
    const sync = await store.getStatusSync();
    res.json({
      success: true,
      certificado_configurado: Boolean(process.env.NFSE_CERT_PATH),
      ambiente: (process.env.NFSE_AMBIENTE || 'producao').toLowerCase(),
      cnpj: process.env.NFSE_CNPJ || null,
      ultimo_nsu: sync?.ultimo_nsu ?? 0,
      ultima_sync: sync?.ultima_sync ?? null,
      total_baixado: sync?.total_baixado ?? 0,
      notas_no_banco: sync?.notas_no_banco ?? 0
    });
  } catch (error) {
    falha(res, error);
  }
});

// GET /api/nfse/testar — valida o certificado contra o ADN
router.get('/testar', async (req, res) => {
  try {
    res.json({ success: true, ...(await adn.testarConexao()) });
  } catch (error) {
    falha(res, error, 400);
  }
});

// POST /api/nfse/sincronizar — baixa as notas novas desde o último NSU
// body: { nsuInicial?, maxLotes?, reprocessar? }
router.post('/sincronizar', async (req, res) => {
  try {
    const { nsuInicial, maxLotes = 40, reprocessar = false } = req.body || {};

    const nsuBase = reprocessar
      ? 0
      : nsuInicial !== undefined
        ? Number(nsuInicial)
        : await store.getUltimoNsu();

    let inseridas = 0;
    let existentes = 0;
    let semXml = 0;

    const resultado = await adn.sincronizarDFe({
      nsuInicial: nsuBase,
      maxLotes: Number(maxLotes),
      cnpj: process.env.NFSE_CNPJ || null,
      // Persiste lote a lote: se a conexão cair no meio, o que já veio fica salvo.
      onLote: async (lote) => {
        for (const doc of lote.documentos) {
          const r = await store.salvarDocumento(doc);
          if (r === 'inserido') inseridas++;
          else if (r === 'existente') existentes++;
          else semXml++;
        }
        await store.setUltimoNsu(lote.ultimoNsu, 0);
      }
    });

    await store.setUltimoNsu(resultado.ultimoNsu, inseridas);

    res.json({
      success: true,
      nsu_inicial: nsuBase,
      ultimo_nsu: resultado.ultimoNsu,
      lotes_consultados: resultado.lotes,
      documentos_recebidos: resultado.documentos.length,
      notas_novas: inseridas,
      ja_existentes: existentes,
      sem_xml: semXml
    });
  } catch (error) {
    falha(res, error);
  }
});

// GET /api/nfse — lista as notas já baixadas
// query: de, ate, cnpj, busca, limite, offset
router.get('/', async (req, res) => {
  try {
    const { de, ate, cnpj, busca, limite, offset } = req.query;
    const { notas, totais } = await store.listarNotas({
      de,
      ate,
      cnpj,
      busca,
      limite: limite || 200,
      offset: offset || 0
    });
    res.json({ success: true, notas, totais });
  } catch (error) {
    falha(res, error);
  }
});

// GET /api/nfse/exportar/zip — baixa todos os XML do filtro em um único .zip
router.get('/exportar/zip', async (req, res) => {
  try {
    const { de, ate, cnpj, busca } = req.query;
    const { notas } = await store.listarNotas({ de, ate, cnpj, busca, limite: 10000 });

    if (!notas.length) {
      return res.status(404).json({ success: false, error: 'Nenhuma nota no filtro informado.' });
    }

    const nome = `nfse-${de || 'inicio'}-a-${ate || 'hoje'}.zip`;
    res.attachment(nome);
    res.type('application/zip');

    const zip = archiver('zip', { zlib: { level: 9 } });
    zip.on('error', (err) => {
      console.error('[NFS-e] erro no zip:', err.message);
      res.destroy(err);
    });
    zip.pipe(res);

    for (const nota of notas) {
      const xml = await store.getXml(nota.id);
      if (xml) zip.append(xml.conteudo, { name: xml.nome });
    }

    await zip.finalize();
  } catch (error) {
    if (!res.headersSent) falha(res, error);
  }
});

// GET /api/nfse/:id/xml — XML de uma nota
router.get('/:id/xml', async (req, res) => {
  try {
    const xml = await store.getXml(req.params.id);
    if (!xml) {
      return res.status(404).json({ success: false, error: 'XML não encontrado para essa nota.' });
    }
    res.type('application/xml');
    res.attachment(xml.nome);
    res.send(xml.conteudo);
  } catch (error) {
    falha(res, error);
  }
});

// GET /api/nfse/:chave/danfse — PDF do DANFSE, direto do SEFIN Nacional
router.get('/:chave/danfse', async (req, res) => {
  try {
    const pdf = await adn.baixarDanfse(req.params.chave);
    res.type('application/pdf');
    res.attachment(`DANFSE-${req.params.chave}.pdf`);
    res.send(pdf);
  } catch (error) {
    falha(res, error);
  }
});

// GET /api/nfse/:chave/eventos — cancelamentos/substituições da nota
router.get('/:chave/eventos', async (req, res) => {
  try {
    const eventos = await adn.consultarEventos(req.params.chave);

    // Um evento de cancelamento no ADN é a fonte da verdade sobre a situação.
    const cancelada = eventos.some((e) =>
      String(e.tipoEvento || '').includes('101') ||
      /cancel/i.test(String(e.xml || ''))
    );
    if (cancelada) await store.marcarSituacao(req.params.chave, 'cancelada');

    res.json({ success: true, eventos, cancelada });
  } catch (error) {
    falha(res, error);
  }
});

module.exports = router;
