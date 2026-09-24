import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Copy, Check } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function PixManager() {
  const [pixKeys, setPixKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    pix_key_type: 'cpf',
    pix_key: ''
  });

  useEffect(() => {
    fetchPixKeys();
  }, []);

  const fetchPixKeys = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers`);
      const customersWithPix = response.data.filter(c => c.pix_key);
      setPixKeys(customersWithPix);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar chaves PIX:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/customers/${formData.customer_id}`, {
        pix_key: formData.pix_key,
        pix_key_type: formData.pix_key_type
      });
      fetchPixKeys();
      setShowForm(false);
      setFormData({
        customer_id: '',
        pix_key_type: 'cpf',
        pix_key: ''
      });
      alert('Chave PIX salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar chave PIX:', error);
      alert('Erro ao salvar chave PIX');
    }
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Tem certeza que deseja deletar esta chave PIX?')) {
      try {
        await axios.put(`${API_URL}/customers/${customerId}`, {
          pix_key: null,
          pix_key_type: null
        });
        fetchPixKeys();
        alert('Chave PIX deletada com sucesso!');
      } catch (error) {
        alert('Erro ao deletar chave PIX');
      }
    }
  };

  if (loading) return <div className="text-white text-center py-8">Carregando chaves PIX...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">📱 Gerenciar Chaves PIX</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Adicionar PIX
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
                placeholder="ID do cliente"
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm">Tipo de Chave</label>
                <select
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                  value={formData.pix_key_type}
                  onChange={(e) => setFormData({ ...formData, pix_key_type: e.target.value })}
                >
                  <option value="cpf">📋 CPF</option>
                  <option value="cnpj">🏢 CNPJ</option>
                  <option value="email">📧 Email</option>
                  <option value="phone">📱 Telefone</option>
                  <option value="random">🔑 Aleatória</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-sm">Chave PIX</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                  placeholder="Insira a chave PIX"
                  value={formData.pix_key}
                  onChange={(e) => setFormData({ ...formData, pix_key: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
              >
                ✅ Salvar Chave PIX
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

      {/* Stats */}
      <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-lg p-6 text-white border border-slate-700">
        <p className="text-cyan-100 text-sm">Chaves PIX Cadastradas</p>
        <p className="text-3xl font-bold mt-2">{pixKeys.length}</p>
        <p className="text-sm text-cyan-200 mt-2">Clientes com PIX configurado</p>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-700 border-b border-slate-600">
            <tr>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">ID Cliente</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Cliente</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Tipo</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Chave PIX</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pixKeys.length > 0 ? (
              pixKeys.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                  <td className="px-6 py-3 text-white">#{customer.id}</td>
                  <td className="px-6 py-3 text-slate-300">{customer.name || 'N/A'}</td>
                  <td className="px-6 py-3 text-slate-300 text-sm">
                    {customer.pix_key_type === 'cpf' && '📋 CPF'}
                    {customer.pix_key_type === 'cnpj' && '🏢 CNPJ'}
                    {customer.pix_key_type === 'email' && '📧 Email'}
                    {customer.pix_key_type === 'phone' && '📱 Telefone'}
                    {customer.pix_key_type === 'random' && '🔑 Aleatória'}
                  </td>
                  <td className="px-6 py-3 text-white font-mono text-sm">{customer.pix_key}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopyKey(customer.pix_key)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                        title="Copiar chave"
                      >
                        {copied === customer.pix_key ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"
                        title="Deletar chave"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                  Nenhuma chave PIX cadastrada. Clique em "Adicionar PIX" para começar!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-blue-100 text-sm">
        <p className="font-semibold mb-2">💡 Dica PIX:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use CPF ou CNPJ para pessoas físicas e jurídicas</li>
          <li>Email e telefone são chaves aleatórias associadas</li>
          <li>Copie a chave e envie para seus clientes via WhatsApp</li>
          <li>As chaves são enviadas automaticamente em cobranças</li>
        </ul>
      </div>
    </div>
  );
}
