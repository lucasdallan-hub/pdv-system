import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function WhatsAppPanel() {
  const [logs, setLogs] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('logs');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsRes, overdueRes] = await Promise.all([
        axios.get(`${API_URL}/whatsapp/logs`),
        axios.get(`${API_URL}/receives/overdue/list`)
      ]);
      setLogs(logsRes.data);
      setOverdue(overdueRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const handleSendCollection = async (receiveId) => {
    setSending(true);
    try {
      const response = await axios.post(`${API_URL}/whatsapp/send-collection`, {
        receive_id: receiveId
      });
      if (response.data.success) {
        alert('✅ Mensagem enviada com sucesso!');
        fetchData();
      } else {
        alert('❌ Erro ao enviar mensagem: ' + response.data.error?.message || 'Desconhecido');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao enviar mensagem: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleSendBulk = async () => {
    if (!window.confirm('Enviar mensagens de cobrança para todos os vencidos?')) return;

    setSending(true);
    try {
      const response = await axios.post(`${API_URL}/whatsapp/send-bulk-collections`);
      alert(`✅ ${response.data.total} mensagens enfileiradas para envio!`);
      fetchData();
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao enviar mensagens em massa');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="text-white text-center py-8">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">WhatsApp - Integração Wuzapi</h2>
          <p className="text-sm text-slate-400">Gerenciamento de notificações e cobranças</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('overdue')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'overdue'
              ? 'bg-red-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <AlertCircle className="w-4 h-4 inline mr-2" />
          Vencidos ({overdue.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'logs'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Histórico de Mensagens
        </button>
      </div>

      {/* Overdue Tab */}
      {activeTab === 'overdue' && (
        <div className="space-y-4">
          {overdue.length > 0 && (
            <button
              onClick={handleSendBulk}
              disabled={sending}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 text-white py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Enviando...' : `Enviar Cobrança em Massa (${overdue.length})`}
            </button>
          )}

          <div className="space-y-3">
            {overdue.map((receive) => (
              <div
                key={receive.id}
                className="bg-slate-800 rounded-lg p-4 border border-red-500/30 hover:border-red-500/50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{receive.customer_name}</h4>
                    <p className="text-slate-400 text-sm mt-1">
                      📞 {receive.phone || 'Sem telefone'}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-slate-300">
                        💰 R$ {receive.amount.toFixed(2)}
                      </span>
                      <span className="text-red-400 font-semibold">
                        ⏰ {receive.days_overdue} dias de atraso
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendCollection(receive.id)}
                    disabled={sending || !receive.phone}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" />
                    Enviar
                  </button>
                </div>
              </div>
            ))}
            {overdue.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                ✅ Nenhum recebimento vencido
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-3">
          <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <table className="w-full">
              <thead className="bg-slate-700 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Cliente</th>
                  <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Telefone</th>
                  <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Mensagem</th>
                  <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Data</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                    <td className="px-6 py-3 text-white font-medium">{log.name || 'N/A'}</td>
                    <td className="px-6 py-3 text-slate-300 text-sm">{log.phone}</td>
                    <td className="px-6 py-3">
                      <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-semibold capitalize">
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-300 text-sm max-w-xs truncate">
                      {log.message}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          log.status === 'sent'
                            ? 'bg-green-500/20 text-green-300'
                            : log.status === 'failed'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {log.status === 'sent' ? '✓ Enviado' : log.status === 'failed' ? '✗ Falha' : '⏳ Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-300 text-sm">
                      {new Date(log.sent_at).toLocaleDateString('pt-BR')} {new Date(log.sent_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                Nenhuma mensagem enviada ainda
              </div>
            )}
          </div>
        </div>
      )}

      {/* Configuration Note */}
      <div className="bg-slate-800 rounded-lg p-4 border border-yellow-500/30">
        <h4 className="text-yellow-400 font-semibold mb-2">⚙️ Configuração Necessária</h4>
        <p className="text-slate-300 text-sm">
          Para habilitar os envios de WhatsApp, configure as variáveis de ambiente no arquivo <code className="bg-slate-700 px-2 py-1 rounded">.env</code>:
        </p>
        <pre className="bg-slate-700 p-3 rounded mt-2 text-slate-200 text-xs overflow-x-auto">
{`WUZAPI_URL=https://api.nxsplus.xyz
WUZAPI_TOKEN=seu_token_aqui
WUZAPI_INSTANCE=sua_instancia_aqui`}
        </pre>
      </div>
    </div>
  );
}
