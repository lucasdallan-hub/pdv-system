import React, { useState, useEffect } from 'react';
import { Check, MessageSquare, AlertTriangle, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Receives() {
  const [receives, setReceives] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchReceives();
  }, []);

  const fetchReceives = async () => {
    try {
      const [pendingRes, overdueRes] = await Promise.all([
        axios.get(`${API_URL}/receives`),
        axios.get(`${API_URL}/receives/overdue/list`)
      ]);
      setReceives(pendingRes.data);
      setOverdue(overdueRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar recebimentos:', error);
      setLoading(false);
    }
  };

  const handleConfirmReceive = async (id) => {
    try {
      await axios.put(`${API_URL}/receives/${id}/confirm`, {
        payment_method: 'transferred'
      });
      fetchReceives();
    } catch (error) {
      console.error('Erro ao confirmar recebimento:', error);
      alert('Erro ao confirmar recebimento');
    }
  };

  const handleSendCollection = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/whatsapp/send-collection`, {
        receive_id: id
      });
      if (response.data.success) {
        alert('Mensagem enviada com sucesso!');
      } else {
        alert('Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este recebimento?')) {
      try {
        await axios.delete(`${API_URL}/receives/${id}`);
        fetchReceives();
        alert('Recebimento deletado com sucesso!');
      } catch (error) {
        alert('Erro ao deletar: ' + error.message);
      }
    }
  };

  if (loading) return <div className="text-white text-center py-8">Carregando...</div>;

  const displayData = activeTab === 'pending' ? receives : overdue;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Recebimentos</h2>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'pending'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Pendentes ({receives.length})
        </button>
        <button
          onClick={() => setActiveTab('overdue')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
            activeTab === 'overdue'
              ? 'bg-red-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Vencidos ({overdue.length})
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white border border-slate-700">
          <p className="text-green-100 text-sm">Total Pendente</p>
          <p className="text-3xl font-bold mt-2">
            R$ {receives.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-6 text-white border border-slate-700">
          <p className="text-red-100 text-sm">Total Vencido</p>
          <p className="text-3xl font-bold mt-2">
            R$ {overdue.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-700 border-b border-slate-600">
            <tr>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">ID</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Cliente</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Descrição</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Valor</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Vencimento</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((receive) => (
              <tr key={receive.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                <td className="px-6 py-3 text-white">#{receive.id}</td>
                <td className="px-6 py-3 text-slate-300">{receive.customer_name || 'N/A'}</td>
                <td className="px-6 py-3 text-slate-300 text-sm">{receive.description}</td>
                <td className="px-6 py-3 text-white font-semibold">R$ {receive.amount.toFixed(2)}</td>
                <td className="px-6 py-3 text-slate-300 text-sm">
                  {new Date(receive.due_date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmReceive(receive.id)}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition"
                      title="Marcar como recebido"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSendCollection(receive.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                      title="Enviar cobrança via WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(receive.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"
                      title="Deletar recebimento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayData.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            Nenhum {activeTab === 'pending' ? 'recebimento pendente' : 'vencido'}
          </div>
        )}
      </div>
    </div>
  );
}
