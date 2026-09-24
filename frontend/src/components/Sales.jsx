import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    payment_method: 'cash',
    items: [{ product_name: '', quantity: 1, unit_price: 0 }]
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get(`${API_URL}/sales`);
      setSales(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_name: '', quantity: 1, unit_price: 0 }]
    });
  };

  const handleRemoveItem = (idx) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== idx)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/sales`, formData);
      fetchSales();
      setShowForm(false);
      setFormData({
        customer_id: '',
        payment_method: 'cash',
        items: [{ product_name: '', quantity: 1, unit_price: 0 }]
      });
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      alert('Erro ao criar venda: ' + error.message);
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta venda?')) {
      try {
        await axios.delete(`${API_URL}/sales/${id}`);
        fetchSales();
        alert('Venda deletada com sucesso!');
      } catch (error) {
        alert('Erro ao deletar venda: ' + error.message);
      }
    }
  };

  if (loading) return <div className="text-white text-center py-8">Carregando vendas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Vendas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Nova Venda
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm">Cliente (ID)</label>
              <input
                type="number"
                required
                className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              />
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

            {/* Items */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm block">Produtos</label>
              {formData.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <input
                    type="text"
                    placeholder="Produto"
                    className="flex-1 bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
                    value={item.product_name}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[idx].product_name = e.target.value;
                      setFormData({ ...formData, items: newItems });
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Qtd"
                    min="1"
                    className="w-20 bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[idx].quantity = parseFloat(e.target.value);
                      setFormData({ ...formData, items: newItems });
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Preço"
                    step="0.01"
                    className="w-24 bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
                    value={item.unit_price}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[idx].unit_price = parseFloat(e.target.value);
                      setFormData({ ...formData, items: newItems });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              + Adicionar Produto
            </button>

            <div className="bg-slate-700/50 p-4 rounded">
              <div className="flex justify-between text-white font-bold">
                <span>Total:</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
              >
                Registrar Venda
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

      {/* Sales List */}
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-700 border-b border-slate-600">
            <tr>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">ID</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Cliente</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Total</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Método</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Data</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                <td className="px-6 py-3 text-white">#{sale.id}</td>
                <td className="px-6 py-3 text-slate-300">{sale.customer_name || 'Sem cliente'}</td>
                <td className="px-6 py-3 text-white font-semibold">R$ {sale.total_amount.toFixed(2)}</td>
                <td className="px-6 py-3 text-slate-300 text-sm">{sale.payment_method}</td>
                <td className="px-6 py-3 text-slate-300 text-sm">
                  {new Date(sale.sale_date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="text-red-400 hover:text-red-300"
                      title="Deletar venda"
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
