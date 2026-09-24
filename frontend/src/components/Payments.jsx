import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'other',
    due_date: '',
    payment_method: 'cash'
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/payments`);
      setPayments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/payments`, formData);
      fetchPayments();
      setShowForm(false);
      setFormData({
        description: '',
        amount: '',
        category: 'other',
        due_date: '',
        payment_method: 'cash'
      });
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      alert('Erro ao criar pagamento');
    }
  };

  const handlePaymentDone = async (id) => {
    try {
      await axios.put(`${API_URL}/payments/${id}/pay`, {
        payment_method: 'transferred'
      });
      fetchPayments();
    } catch (error) {
      console.error('Erro ao marcar como pago:', error);
      alert('Erro ao marcar como pago');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este pagamento?')) {
      try {
        await axios.delete(`${API_URL}/payments/${id}`);
        fetchPayments();
        alert('Pagamento deletado com sucesso!');
      } catch (error) {
        alert('Erro ao deletar: ' + error.message);
      }
    }
  };

  if (loading) return <div className="text-white text-center py-8">Carregando...</div>;

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Pagamentos a Pagar</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Novo Pagamento
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-6 text-white border border-slate-700">
        <p className="text-orange-100 text-sm">Total a Pagar</p>
        <p className="text-3xl font-bold mt-2">R$ {totalPending.toFixed(2)}</p>
        <p className="text-sm text-orange-200 mt-2">{pendingPayments.length} pagamentos pendentes</p>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm">Descrição</label>
              <input
                type="text"
                required
                className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                placeholder="Ex: Aluguel, Fornecedor..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Categoria</label>
                <select
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="rent">Aluguel</option>
                  <option value="supplier">Fornecedor</option>
                  <option value="utility">Contas</option>
                  <option value="salary">Salário</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-sm">Método de Pagamento</label>
              <select
                className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              >
                <option value="cash">💵 Dinheiro</option>
                <option value="card">💳 Cartão</option>
                <option value="transfer">🏦 Transferência Bancária</option>
                <option value="pix">📱 PIX</option>
                <option value="check">✓ Cheque</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 text-sm">Data de Vencimento</label>
              <input
                type="date"
                required
                className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
              >
                Registrar Pagamento
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-700 border-b border-slate-600">
            <tr>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Descrição</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Categoria</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Valor</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Método</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Vencimento</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                <td className="px-6 py-3 text-white">{payment.description}</td>
                <td className="px-6 py-3 text-slate-300 text-sm capitalize">{payment.category}</td>
                <td className="px-6 py-3 text-white font-semibold">R$ {payment.amount.toFixed(2)}</td>
                <td className="px-6 py-3 text-slate-300 text-sm">
                  {payment.payment_method === 'cash' && '💵 Dinheiro'}
                  {payment.payment_method === 'card' && '💳 Cartão'}
                  {payment.payment_method === 'transfer' && '🏦 Transferência'}
                  {payment.payment_method === 'pix' && '📱 PIX'}
                  {payment.payment_method === 'check' && '✓ Cheque'}
                </td>
                <td className="px-6 py-3 text-slate-300 text-sm">
                  {new Date(payment.due_date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'paid'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}
                  >
                    {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    {payment.status === 'pending' && (
                      <button
                        onClick={() => handlePaymentDone(payment.id)}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition"
                        title="Marcar como pago"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"
                      title="Deletar pagamento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
