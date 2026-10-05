import React, { useState, useEffect } from 'react';
import { TrendingDown, DollarSign, AlertCircle, Users, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:5000/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/summary`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-8">Carregando...</div>;
  }

  const statCards = [
    {
      title: 'Vendas Hoje',
      value: `R$ ${(data?.salestoday?.total || 0).toFixed(2)}`,
      count: `${data?.salestoday?.count || 0} vendas`,
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Recebimentos',
      value: `R$ ${(data?.receivePending?.total || 0).toFixed(2)}`,
      count: `${data?.receivePending?.count || 0} pendentes`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Pagamentos',
      value: `R$ ${(data?.paymentsPending?.total || 0).toFixed(2)}`,
      count: `${data?.paymentsPending?.count || 0} pendentes`,
      icon: TrendingDown,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      title: 'Vencidos',
      value: `R$ ${(data?.receivesOverdue?.total || 0).toFixed(2)}`,
      count: `${data?.receivesOverdue?.count || 0} em atraso`,
      icon: AlertCircle,
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      highlight: true
    },
    {
      title: 'Clientes',
      value: data?.totalCustomers?.count || 0,
      count: 'cadastrados',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards - Modern Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-xl p-6 text-white border transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 cursor-pointer group ${stat.borderColor} ${stat.bgColor}`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>

              {/* Content */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{stat.title}</p>
                  <p className={`text-3xl font-bold mt-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">📊 {stat.count}</p>
                </div>
                <div className={`p-4 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg group-hover:shadow-2xl transition-all transform group-hover:scale-110`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Vendas - Últimos 7 dias</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.salesLast7 || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Overview */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Situação Financeira</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
              <span className="text-slate-300">Recebimentos Pendentes</span>
              <span className="text-lg font-bold text-green-400">
                R$ {(data?.receivePending?.total || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
              <span className="text-slate-300">Pagamentos Pendentes</span>
              <span className="text-lg font-bold text-orange-400">
                R$ {(data?.paymentsPending?.total || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-red-500/30">
              <span className="text-slate-300">Em Atraso</span>
              <span className="text-lg font-bold text-red-400">
                R$ {(data?.receivesOverdue?.total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
