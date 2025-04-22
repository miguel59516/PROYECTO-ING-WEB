import React, { useState, useEffect } from 'react';
import { BarChart3, Bell, Settings, Users, Activity, TrendingUp, Search, ChevronDown, Package, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight, SlidersHorizontal, Menu, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Tooltip } from './components/Tooltip';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ExportButton } from './components/ExportButton';
import { useDebounce } from './hooks/useDebounce';

const priceData = [
  { date: '01/03', price: 85 },
  { date: '02/03', price: 87 },
  { date: '03/03', price: 89 },
  { date: '04/03', price: 86 },
  { date: '05/03', price: 88 },
  { date: '06/03', price: 90 },
  { date: '07/03', price: 92 },
];

function StatCard({ title, value, change, icon: Icon, trend, loading }: { title: string; value: string; change: string; icon: any; trend: 'up' | 'down'; loading?: boolean }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow border border-secondary/10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow border border-secondary/10">
      <div className="flex items-center justify-between mb-4">
        <Tooltip label={`Información sobre ${title}`}>
          <div className="p-2 bg-primary/10 rounded-lg cursor-help">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
        </Tooltip>
        <span className={`flex items-center gap-1 text-xs sm:text-sm ${trend === 'up' ? 'text-green-500' : 'text-primary'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" /> : <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />}
          {change}
        </span>
      </div>
      <h3 className="text-secondary-dark text-xs sm:text-sm mb-1">{title}</h3>
      <p className="text-xl sm:text-2xl font-semibold text-secondary-dark">{value}</p>
    </div>
  );
}

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeItem, setActiveItem] = useState('Resumen');
  
  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-64 bg-secondary-dark text-white p-4 transition-transform duration-300 ease-in-out lg:translate-x-0`}>
      <div className="flex items-center justify-between gap-2 mb-8">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold">ApexBuy Análisis</h1>
        </div>
        <button onClick={onClose} className="lg:hidden text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="space-y-2">
        {[
          { icon: Activity, label: 'Resumen' },
          { icon: TrendingUp, label: 'Tendencias de Precios' },
          { icon: Users, label: 'Competidores' },
          { icon: Package, label: 'Productos' },
          { icon: Settings, label: 'Configuración' },
        ].map(({ icon: Icon, label }) => (
          <Tooltip key={label} label={`Ver ${label}`}>
            <button
              onClick={() => {
                setActiveItem(label);
                onClose();
              }}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                activeItem === label ? 'bg-primary text-white' : 'hover:bg-secondary-dark/80 text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          </Tooltip>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-secondary p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Funciones Premium</h3>
          <p className="text-gray-300 text-sm mb-3">Desbloquea análisis e información avanzada</p>
          <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-light transition-colors">
            Actualizar Ahora
          </button>
        </div>
      </div>
    </div>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <header className="h-16 bg-white border-b border-secondary/10 flex items-center justify-between px-4 sm:px-6 fixed top-0 right-0 left-0 lg:left-64 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="lg:hidden">
          <Menu className="w-6 h-6 text-secondary-dark" />
        </button>
        <div className="relative flex-1 max-w-xs sm:max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="pl-10 pr-4 py-2 border border-secondary/20 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-secondary-dark hover:bg-background rounded-lg">
          Últimos 7 días
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <ExportButton 
          data={priceData}
          filename="precio-productos"
        />
        <Tooltip label="Filtros">
          <button className="p-2 hover:bg-background rounded-lg">
            <SlidersHorizontal className="w-5 h-5 text-secondary-dark" />
          </button>
        </Tooltip>
        <Tooltip label="Notificaciones">
          <button className="relative">
            <Bell className="w-6 h-6 text-secondary-dark" />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
          </button>
        </Tooltip>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-medium text-primary">JD</span>
        </div>
      </div>
    </header>
  );
}

function PriceTrendChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-secondary/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-secondary-dark">Tendencias de Precios</h3>
          <p className="text-secondary text-sm">Comparación últimos 30 días</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-secondary-dark hover:bg-background rounded-lg text-sm">
          Todos los Productos
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Line type="monotone" dataKey="price" stroke="#E12613" strokeWidth={2} dot={{ fill: '#E12613' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <p className="text-sm text-secondary">Precio Promedio</p>
            <p className="text-lg font-semibold text-secondary-dark">$89.99</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-secondary">Más Bajo</p>
            <p className="text-lg font-semibold text-green-500">$75.99</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-secondary">Más Alto</p>
            <p className="text-lg font-semibold text-primary">$99.99</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompetitorAnalysis() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const competitors = [
    { name: 'Competidor A', price: '$89.99', difference: '+$5.00' },
    { name: 'Competidor B', price: '$85.99', difference: '+$1.00' },
    { name: 'Competidor C', price: '$82.99', difference: '-$2.00' },
    { name: 'Competidor D', price: '$91.99', difference: '+$7.00' },
    { name: 'Competidor E', price: '$79.99', difference: '-$5.00' },
  ].sort((a, b) => {
    const aValue = parseFloat(a.difference.replace('$', ''));
    const bValue = parseFloat(b.difference.replace('$', ''));
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-secondary/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-secondary-dark">Análisis de Competencia</h3>
          <p className="text-secondary text-sm">Top 5 competidores</p>
        </div>
        <div className="flex gap-2">
          <Tooltip label="Ordenar por diferencia de precio">
            <button 
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 hover:bg-background rounded-lg"
            >
              <SlidersHorizontal className="w-5 h-5 text-secondary-dark" />
            </button>
          </Tooltip>
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-secondary-dark hover:bg-background rounded-lg text-sm">
            Esta Semana
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {competitors.map((competitor, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-background/80 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">{competitor.name[0]}</span>
              </div>
              <div>
                <p className="font-medium text-secondary-dark">{competitor.name}</p>
                <p className="text-sm text-secondary">{competitor.price}</p>
              </div>
            </div>
            <span className={`text-sm ${competitor.difference.startsWith('+') ? 'text-primary' : 'text-green-500'}`}>
              {competitor.difference}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-secondary/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-secondary-dark">Alertas Recientes</h3>
          <p className="text-secondary text-sm">Últimas 24 horas</p>
        </div>
        <button className="text-primary text-sm hover:text-primary-light">Ver Todo</button>
      </div>
      <div className="space-y-3">
        {[
          { type: 'price', message: 'Caída de precio detectada para Producto A', time: 'hace 5m', icon: DollarSign },
          { type: 'competitor', message: 'Nuevo listado de competidor encontrado', time: 'hace 15m', icon: Users },
          { type: 'stock', message: 'Alerta de nivel de stock: Producto B', time: 'hace 1h', icon: AlertTriangle },
          { type: 'price', message: 'Aumento de precio en Producto C', time: 'hace 2h', icon: DollarSign },
        ].map((alert, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-background/80 transition-colors cursor-pointer">
            <div className={`p-2 rounded-lg ${
              alert.type === 'price' ? 'bg-primary/10' :
              alert.type === 'competitor' ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <alert.icon className={`w-4 h-4 ${
                alert.type === 'price' ? 'text-primary' :
                alert.type === 'competitor' ? 'text-green-600' : 'text-yellow-600'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-dark">{alert.message}</p>
              <span className="text-xs text-secondary">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="lg:ml-64 pt-16 bg-background min-h-screen">
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-secondary-dark">Resumen del Panel</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Productos"
              value="1,234"
              change="+12.5%"
              icon={Package}
              trend="up"
              loading={loading}
            />
            <StatCard
              title="Precio Promedio"
              value="$89.99"
              change="-2.5%"
              icon={DollarSign}
              trend="down"
              loading={loading}
            />
            <StatCard
              title="Competidores Activos"
              value="25"
              change="+4"
              icon={Users}
              trend="up"
              loading={loading}
            />
            <StatCard
              title="Alertas de Precio"
              value="12"
              change="+3"
              icon={Bell}
              trend="up"
              loading={loading}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <PriceTrendChart />
          <CompetitorAnalysis />
        </div>
        
        <div className="mt-4 sm:mt-6">
          <AlertsCard />
        </div>
      </div>
    </main>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="flex-1">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;