import React, { useState, useEffect } from 'react';
import {
  RefreshCw, Download, FileText, Search, ShieldCheck,
  ShieldAlert, Archive, Calendar, AlertTriangle
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const moeda = (v) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const data = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d) ? String(v).slice(0, 10) : d.toLocaleDateString('pt-BR');
};

export default function NotasFiscais() {
  const [notas, setNotas] = useState([]);
  const [totais, setTotais] = useState({ quantidade: 0, valor_total: 0, iss_total: 0 });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [testando, setTestando] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [filtros, setFiltros] = useState({ de: '', ate: '', cnpj: '', busca: '' });

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carregar deve rodar apenas na montagem
  }, []);

  const carregar = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filtros).filter(([, v]) => v)
      );
      const [listagem, st] = await Promise.all([
        axios.get(`${API_URL}/nfse`, { params }),
        axios.get(`${API_URL}/nfse/status`)
      ]);
      setNotas(listagem.data.notas || []);
      setTotais(listagem.data.totais || { quantidade: 0, valor_total: 0, iss_total: 0 });
      setStatus(st.data);
    } catch (error) {
      setAviso({ tipo: 'erro', texto: error.response?.data?.error || error.message });
    } finally {
      setLoading(false);
    }
  };

  const testarCertificado = async () => {
    setTestando(true);
    setAviso(null);
    try {
      const { data: r } = await axios.get(`${API_URL}/nfse/testar`);
      setAviso({
        tipo: r.ok ? 'ok' : 'erro',
        texto: `${r.mensagem} (${r.ambiente}, ${r.tempoMs}ms)`
      });
    } catch (error) {
      setAviso({ tipo: 'erro', texto: error.response?.data?.error || error.message });
    } finally {
      setTestando(false);
    }
  };

  const sincronizar = async (reprocessar = false) => {
    setSincronizando(true);
    setAviso(null);
    try {
      const { data: r } = await axios.post(`${API_URL}/nfse/sincronizar`, { reprocessar });
      setAviso({
        tipo: 'ok',
        texto: `${r.notas_novas} nota(s) nova(s) baixada(s). ` +
               `${r.ja_existentes} já estavam no sistema. NSU atual: ${r.ultimo_nsu}.`
      });
      await carregar();
    } catch (error) {
      setAviso({ tipo: 'erro', texto: error.response?.data?.error || error.message });
    } finally {
      setSincronizando(false);
    }
  };

  const baixarZip = () => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(filtros).filter(([, v]) => v))
    );
    window.open(`${API_URL}/nfse/exportar/zip?${qs}`, '_blank');
  };

  const certOk = status?.certificado_configurado;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Notas Fiscais de Serviço
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Download direto da API oficial do Sistema Nacional NFS-e
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={testarCertificado}
            disabled={testando}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 rounded-lg transition-colors"
          >
            {certOk ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {testando ? 'Testando...' : 'Testar certificado'}
          </button>
          <button
            onClick={() => sincronizar(false)}
            disabled={sincronizando || !certOk}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${sincronizando ? 'animate-spin' : ''}`} />
            {sincronizando ? 'Baixando...' : 'Baixar notas novas'}
          </button>
          <button
            onClick={baixarZip}
            disabled={!notas.length}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 rounded-lg transition-colors"
          >
            <Archive className="w-4 h-4" />
            Exportar ZIP
          </button>
        </div>
      </div>

      {/* Certificado ausente */}
      {status && !certOk && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-100">
            <p className="font-semibold">Certificado digital não configurado</p>
            <p className="text-amber-200/80 mt-1">
              Coloque seu e-CNPJ A1 (.pfx) na pasta <code className="bg-black/30 px-1 rounded">certificados/</code> e
              preencha <code className="bg-black/30 px-1 rounded">NFSE_CERT_PATH</code> e{' '}
              <code className="bg-black/30 px-1 rounded">NFSE_CERT_PASSWORD</code> no arquivo{' '}
              <code className="bg-black/30 px-1 rounded">.env</code>.
            </p>
          </div>
        </div>
      )}

      {/* Aviso de operação */}
      {aviso && (
        <div
          className={`rounded-xl p-4 text-sm border ${
            aviso.tipo === 'ok'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
              : 'bg-red-500/10 border-red-500/30 text-red-100'
          }`}
        >
          {aviso.texto}
        </div>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { rotulo: 'Notas no sistema', valor: totais.quantidade, cor: 'text-blue-400' },
          { rotulo: 'Valor dos serviços', valor: moeda(totais.valor_total), cor: 'text-emerald-400' },
          { rotulo: 'ISS total', valor: moeda(totais.iss_total), cor: 'text-amber-400' },
          {
            rotulo: 'Última sincronização',
            valor: status?.ultima_sync ? data(status.ultima_sync) : 'Nunca',
            cor: 'text-slate-300'
          }
        ].map((card) => (
          <div
            key={card.rotulo}
            className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 backdrop-blur"
          >
            <p className="text-slate-400 text-xs uppercase tracking-wide">{card.rotulo}</p>
            <p className={`text-2xl font-bold mt-2 ${card.cor}`}>{card.valor}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3" /> De
            </label>
            <input
              type="date"
              value={filtros.de}
              onChange={(e) => setFiltros({ ...filtros, de: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3" /> Até
            </label>
            <input
              type="date"
              value={filtros.ate}
              onChange={(e) => setFiltros({ ...filtros, ate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">CNPJ</label>
            <input
              type="text"
              placeholder="00.000.000/0000-00"
              value={filtros.cnpj}
              onChange={(e) => setFiltros({ ...filtros, cnpj: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Buscar</label>
            <input
              type="text"
              placeholder="Nome, número ou chave"
              value={filtros.busca}
              onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={carregar}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" /> Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Carregando...</div>
        ) : notas.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-semibold">Nenhuma nota baixada ainda</p>
            <p className="text-slate-500 text-sm mt-1">
              Clique em "Baixar notas novas" para buscar no Sistema Nacional NFS-e.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Número</th>
                  <th className="px-4 py-3 text-left">Emissão</th>
                  <th className="px-4 py-3 text-left">Prestador</th>
                  <th className="px-4 py-3 text-left">Tomador</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3 text-right">ISS</th>
                  <th className="px-4 py-3 text-center">Situação</th>
                  <th className="px-4 py-3 text-center">Arquivos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {notas.map((nota) => (
                  <tr key={nota.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-4 py-3 text-slate-200 font-medium">
                      {nota.numero || `NSU ${nota.nsu}`}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{data(nota.data_emissao)}</td>
                    <td className="px-4 py-3 text-slate-300 max-w-[200px] truncate">
                      {nota.nome_prestador || nota.cnpj_prestador || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-[200px] truncate">
                      {nota.nome_tomador || nota.cnpj_tomador || '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-medium">
                      {moeda(nota.valor_servico)}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-400">
                      {moeda(nota.valor_iss)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          nota.situacao === 'cancelada'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {nota.situacao === 'cancelada' ? 'Cancelada' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`${API_URL}/nfse/${nota.id}/xml`}
                          className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
                          title="Baixar XML"
                        >
                          XML
                        </a>
                        {nota.chave_acesso && (
                          <a
                            href={`${API_URL}/nfse/${nota.chave_acesso}/danfse`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs px-2 py-1 bg-blue-600/80 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-1"
                            title="Baixar PDF do DANFSE"
                          >
                            <Download className="w-3 h-3" /> PDF
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {status && (
        <p className="text-slate-500 text-xs text-center">
          Ambiente: {status.ambiente} · NSU atual: {status.ultimo_nsu} · Total já baixado:{' '}
          {status.total_baixado}
        </p>
      )}
    </div>
  );
}
