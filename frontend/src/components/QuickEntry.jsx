import React, { useState, useEffect } from 'react';
import { Plus, X, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function QuickEntry() {
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [entryType, setEntryType] = useState('sale');
  const [formData, setFormData] = useState({
    customer_id: '',
    amount: '',
    description: '',
    due_date: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (entryType === 'sale') {
        await axios.post(`${API_URL}/sales`, {
          customer_id: formData.customer_id,
          payment_method: 'cash',
          items: [{ product_name: formData.description, quantity: 1, unit_price: formData.amount }]
        });
        alert('✅ Venda registrada com sucesso!');
      } else if (entryType === 'receive') {
        await axios.post(`${API_URL}/receives`, {
          customer_id: formData.customer_id,
          description: formData.description,
          amount: formData.amount,
          due_date: formData.due_date
        });
        alert('✅ Recebimento registrado com sucesso!');
      } else if (entryType === 'payment') {
        await axios.post(`${API_URL}/payments`, {
          description: formData.description,
          amount: formData.amount,
          category: 'other',
          due_date: formData.due_date
        });
        alert('✅ Pagamento registrado com sucesso!');
      }

      setFormData({
        customer_id: '',
        amount: '',
        description: '',
        due_date: ''
      });
      setShowModal(false);
    } catch (error) {
      alert('❌ Erro ao registrar: ' + error.message);
    }
  };

  return (
    <>
      {/* Botão Flutuante - Premium */}
      <div className="fixed bottom-8 right-8 z-40 group">
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-full p-5 shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/75 transition-all transform hover:scale-125 animate-bounce"
          title="Lançamento Rápido"
        >
          <Plus className="w-7 h-7" />
        </button>
        <div className="absolute -top-12 right-0 bg-slate-900 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-slate-700">
          ⚡ Lançamento Rápido
        </div>
      </div>

      {/* Modal - Modern Design */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-96 border border-slate-700/50 shadow-2xl shadow-emerald-500/20 animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">⚡ Lançamento Rápido</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-2 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tipo de Lançamento */}
              <div>
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider block mb-2">Tipo de Operação</label>
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value)}
                  className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg px-4 py-3 mt-1 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                >
                  <option value="sale">🛒 Venda Rápida</option>
                  <option value="receive">💰 Recebimento</option>
                  <option value="payment">📊 Pagamento</option>
                </select>
              </div>

              {/* Cliente (apenas para venda e recebimento) */}
              {entryType !== 'payment' && (
                <div>
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider block mb-2">Cliente</label>
                  <select
                    required
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  >
                    <option value="">Selecione um cliente</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Descrição/Produto */}
              <div>
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider block mb-2">
                  {entryType === 'sale' ? '🏷️ Produto' : '📝 Descrição'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={entryType === 'sale' ? 'Nome do produto' : 'Descrição'}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg px-4 py-3 placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                />
              </div>

              {/* Valor */}
              <div>
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider block mb-2">💰 Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg px-4 py-3 placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                />
              </div>

              {/* Data de Vencimento (recebimento e pagamento) */}
              {entryType !== 'sale' && (
                <div>
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider block mb-2">📅 Data de Vencimento</label>
                  <input
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full bg-slate-700/50 text-white border border-slate-600/50 rounded-lg px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  />
                </div>
              )}

              {/* Botões - Modern Style */}
              <div className="flex gap-3 mt-8 pt-4 border-t border-slate-700/50">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/30"
                >
                  <CheckCircle className="w-5 h-5" />
                  Registrar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
