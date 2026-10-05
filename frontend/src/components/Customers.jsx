import React, { useState, useEffect } from 'react';
import { Plus, Eye, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cpf_cnpj: '',
    address: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers`);
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/customers`, formData);
      fetchCustomers();
      setShowForm(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        cpf_cnpj: '',
        address: '',
        city: '',
        state: ''
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      alert('Erro ao criar cliente: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza? Isso deletará o cliente, todas as vendas e recebimentos associados!')) {
      try {
        await axios.delete(`${API_URL}/customers/${id}`);
        fetchCustomers();
        alert('Cliente deletado com sucesso!');
      } catch (error) {
        alert('Erro ao deletar: ' + error.message);
      }
    }
  };

  if (loading) return <div className="text-white text-center py-8">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Clientes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white border border-slate-700">
        <p className="text-purple-100 text-sm">Total de Clientes</p>
        <p className="text-3xl font-bold mt-2">{customers.length}</p>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm">Nome *</label>
              <input
                type="text"
                required
                className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm">Telefone</label>
                <input
                  type="tel"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Email</label>
                <input
                  type="email"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm">CPF/CNPJ</label>
                <input
                  type="text"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                  value={formData.cpf_cnpj}
                  onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Cidade</label>
                <input
                  type="text"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-sm">Endereço</label>
              <input
                type="text"
                className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 mt-1"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
              >
                Registrar Cliente
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
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Nome</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Telefone</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Compras</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Total Gasto</th>
              <th className="px-6 py-3 text-left text-slate-300 text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                <td className="px-6 py-3 text-white font-medium">{customer.name}</td>
                <td className="px-6 py-3 text-slate-300 text-sm">{customer.phone || '-'}</td>
                <td className="px-6 py-3 text-slate-300 text-sm">{customer.email || '-'}</td>
                <td className="px-6 py-3 text-slate-300 text-sm">{customer.total_sales || 0}</td>
                <td className="px-6 py-3 text-white font-semibold">
                  R$ {(customer.total_spent || 0).toFixed(2)}
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-400 hover:text-red-300"
                      title="Deletar cliente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            Nenhum cliente cadastrado
          </div>
        )}
      </div>
    </div>
  );
}
