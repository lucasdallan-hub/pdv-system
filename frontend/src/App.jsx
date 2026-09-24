import React, { useState, useEffect } from 'react';
import { BarChart3, Users, DollarSign, AlertCircle, ShoppingCart, Settings, Smartphone } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Sales from './components/Sales';
import Receives from './components/Receives';
import Payments from './components/Payments';
import Customers from './components/Customers';
import WhatsAppPanel from './components/WhatsAppPanel';
import PixManager from './components/PixManager';
import QuickEntry from './components/QuickEntry';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart },
    { id: 'receives', label: 'Recebimentos', icon: DollarSign },
    { id: 'payments', label: 'Pagamentos', icon: AlertCircle },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'pix', label: 'PIX', icon: Smartphone },
    { id: 'whatsapp', label: 'WhatsApp', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header - Premium Design */}
      <header className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 border-b border-slate-700/50 shadow-2xl backdrop-blur-lg bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 transform hover:scale-105 transition-transform">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">PDV System</h1>
                <p className="text-sm text-slate-400 mt-1">💼 Controle Total de Vendas e Finanças</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-300 font-semibold text-sm">📅 {new Date().toLocaleDateString('pt-BR')}</p>
              <p className="text-slate-500 text-xs mt-1">⏰ {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Modern Style */}
      <nav className="bg-slate-800/50 border-b border-slate-700/30 sticky top-0 z-40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 whitespace-nowrap transition-all duration-300 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-blue-500/10 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content - With Animation */}
      <main className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'sales' && <Sales />}
        {activeTab === 'receives' && <Receives />}
        {activeTab === 'payments' && <Payments />}
        {activeTab === 'customers' && <Customers />}
        {activeTab === 'pix' && <PixManager />}
        {activeTab === 'whatsapp' && <WhatsAppPanel />}
      </main>

      {/* Footer - Modern */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <p className="text-slate-300 font-semibold">PDV System v1.1</p>
              <p className="text-slate-500 text-sm">© 2024 - Desenvolvido com ❤️ para seu negócio</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <span className="text-slate-400 text-sm bg-slate-700/50 px-3 py-1 rounded-full">⚡ Rápido</span>
              <span className="text-slate-400 text-sm bg-slate-700/50 px-3 py-1 rounded-full">🔒 Seguro</span>
              <span className="text-slate-400 text-sm bg-slate-700/50 px-3 py-1 rounded-full">📊 Inteligente</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick Entry Button */}
      <QuickEntry />
    </div>
  );
}
