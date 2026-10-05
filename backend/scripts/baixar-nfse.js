#!/usr/bin/env node
/**
 * Baixa as NFS-e pela API oficial do ADN, sem abrir a interface.
 * Serve para rodar no terminal ou agendar no Agendador de Tarefas do Windows.
 *
 *   node backend/scripts/baixar-nfse.js            # baixa só o que é novo
 *   node backend/scripts/baixar-nfse.js --testar   # só valida o certificado
 *   node backend/scripts/baixar-nfse.js --tudo     # reprocessa desde o NSU 0
 */

require('dotenv').config();
const adn = require('../services/nfse-adn');
const store = require('../services/nfse-store');

async function main() {
  const args = process.argv.slice(2);
  const testar = args.includes('--testar');
  const tudo = args.includes('--tudo');

  await store.initialize();

  if (testar) {
    const r = await adn.testarConexao();
    console.log(`\n${r.ok ? '✅' : '❌'} ${r.mensagem}`);
    console.log(`   Ambiente: ${r.ambiente}`);
    console.log(`   Endpoint: ${r.endpoint}`);
    console.log(`   Tempo:    ${r.tempoMs}ms\n`);
    process.exit(r.ok ? 0 : 1);
  }

  const nsuInicial = tudo ? 0 : await store.getUltimoNsu();
  console.log(`\n🔄 Sincronizando NFS-e a partir do NSU ${nsuInicial}...`);

  let inseridas = 0;
  let existentes = 0;

  const resultado = await adn.sincronizarDFe({
    nsuInicial,
    maxLotes: 100,
    cnpj: process.env.NFSE_CNPJ || null,
    onLote: async (lote) => {
      for (const doc of lote.documentos) {
        const r = await store.salvarDocumento(doc);
        if (r === 'inserido') inseridas++;
        else if (r === 'existente') existentes++;
      }
      await store.setUltimoNsu(lote.ultimoNsu, 0);
      console.log(`   lote: ${lote.documentos.length} doc(s) · NSU ${lote.ultimoNsu}`);
    }
  });

  await store.setUltimoNsu(resultado.ultimoNsu, inseridas);

  console.log(`\n✅ Concluído.`);
  console.log(`   Notas novas:    ${inseridas}`);
  console.log(`   Já existentes:  ${existentes}`);
  console.log(`   NSU final:      ${resultado.ultimoNsu}`);
  console.log(`   XML salvos em:  ${store.XML_DIR}\n`);
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}\n`);
  process.exit(1);
});
