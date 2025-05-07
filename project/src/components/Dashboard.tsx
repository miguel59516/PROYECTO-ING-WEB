import React, { useState } from 'react';
import { BarChart3, Bell, Search, Package, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight, Home, BarChart, Users, Settings, Menu, X, Grid, List, Filter, Clock, TrendingUp, AlertOctagon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Tooltip } from './Tooltip';
import { ExportButton } from './ExportButton';
import { ProductsTable } from './ProductsTable';
import { useDebounce } from '../hooks/useDebounce';

const mockData = {
  stats: [
    { id: 1, label: 'Total Productos', value: '1,234', change: '+12.5%', icon: Package },
    { id: 2, label: 'Precio Promedio', value: '$89.99', change: '-2.3%', icon: DollarSign },
    { id: 3, label: 'Competidores', value: '25', change: '+5%', icon: AlertTriangle },
  ],
  priceHistory: Array.from({ length: 12 }, (_, i) => ({
    date: `2024-${(i + 1).toString().padStart(2, '0')}-01`,
    price: Math.random() * 100 + 50,
    competitors: Math.floor(Math.random() * 10) + 20,
    lowest: Math.random() * 80 + 40,
    highest: Math.random() * 120 + 60,
  })),
  competitors: [
    { id: 'D', name: 'Competidor D', price: 91.99, change: '+7.00' },
    { id: 'A', name: 'Competidor A', price: 89.99, change: '+5.00' },
    { id: 'B', name: 'Competidor B', price: 88.99, change: '+1.00' },
    { id: 'C', name: 'Competidor C', price: 82.99, change: '-2.00' },
    { id: 'E', name: 'Competidor E', price: 79.99, change: '-5.00' },
  ],
  alerts: [
    { id: 1, product: 'Producto A', change: '+15%', type: 'price-increase', time: '5m', priority: 'high' },
    { id: 2, product: 'Producto B', change: '-10%', type: 'price-decrease', time: '15m', priority: 'medium' },
    { id: 3, product: 'Producto C', stock: '5 unidades', type: 'stock', time: '1h', priority: 'high' },
    { id: 4, product: 'Producto D', competitor: 'Competidor A', type: 'competitor', time: '2h', priority: 'low' },
  ],
  products: Array.from({ length: 50 }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: `Producto ${i + 1}`,
    price: Math.random() * 1000000 + 50000,
    provider: `Proveedor ${Math.floor(Math.random() * 5) + 1}`,
    profitability: Math.random() * 50,
    category: `Categoría ${Math.floor(Math.random() * 3) + 1}`,
    stock: Math.floor(Math.random() * 100),
    lastUpdate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  })),
};

const menuItems = [
  { icon: Home, label: 'Resumen', active: true },
  { icon: BarChart, label: 'Tendencias de Precios' },
  { icon: Users, label: 'Competidores' },
  { icon: Package, label: 'Productos' },
  { icon: Settings, label: 'Configuración' },
];

const timeRanges = [
  { label: 'Últimos 7 días', value: '7d' },
  { label: 'Últimos 30 días', value: '30d' },
  { label: 'Este mes', value: 'this-month' },
  { label: 'Este año', value: 'this-year' },
];

const productFilters = [
  { label: 'Todos los Productos', value: 'all' },
  { label: 'Productos Activos', value: 'active' },
  { label: 'Productos Inactivos', value: 'inactive' },
  { label: 'Alta Rentabilidad', value: 'high-profit' },
  { label: 'Bajo Stock', value: 'low-stock' },
];

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlerts, setShowAlerts] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [productFilter, setProductFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price-increase':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'price-decrease':
        return <ArrowDownRight className="w-4 h-4 text-green-500" />;
      case 'stock':
        return <AlertOctagon className="w-4 h-4 text-yellow-500" />;
      case 'competitor':
        return <Users className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'price-increase':
        return 'bg-red-100';
      case 'price-decrease':
        return 'bg-green-100';
      case 'stock':
        return 'bg-yellow-100';
      case 'competitor':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-secondary/10">
        <div className="p-4 border-b border-secondary/10">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-secondary-dark">ApexBuy</span>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button 
                    className={`flex items-center gap-3 w-full p-3 rounded-lg text-base transition-colors ${
                      item.active 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-secondary-dark hover:bg-background'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-secondary/10">
          <div className="bg-background rounded-lg p-4">
            <h3 className="font-semibold mb-2">Funciones Premium</h3>
            <ul className="text-sm text-secondary space-y-2 mb-3">
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Análisis predictivo
              </li>
              <li className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Reportes avanzados
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Análisis competitivo
              </li>
            </ul>
            <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">
              Actualizar Ahora
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-y-0 left-0 w-[280px] bg-white transform ${
          showMobileMenu ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out z-50 lg:hidden overflow-y-auto flex flex-col`}
      >
        <div className="p-4 border-b border-secondary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-secondary-dark">ApexBuy</span>
            </div>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 hover:bg-background rounded-lg"
            >
              <X className="w-6 h-6 text-secondary-dark" />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button 
                    className={`flex items-center gap-3 w-full p-3 rounded-lg text-base transition-colors ${
                      item.active 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-secondary-dark hover:bg-background'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-secondary/10">
          <div className="bg-background rounded-lg p-4">
            <h3 className="font-semibold mb-2">Funciones Premium</h3>
            <ul className="text-sm text-secondary space-y-2 mb-3">
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Análisis predictivo
              </li>
              <li className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Reportes avanzados
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Análisis competitivo
              </li>
            </ul>
            <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">
              Actualizar Ahora
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-secondary/10 sticky top-0 z-30">
          <div className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2 hover:bg-background rounded-lg"
                >
                  <Menu className="w-6 h-6 text-secondary-dark" />
                </button>

                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="flex-1 sm:flex-none border border-secondary/20 rounded-lg px-3 py-2 text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <button
                    onClick={() => setShowAlerts(!showAlerts)}
                    className="p-2 hover:bg-background rounded-lg relative"
                  >
                    <Bell className="w-5 h-5 text-secondary-dark" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs flex items-center justify-center rounded-full">
                      {mockData.alerts.length}
                    </span>
                  </button>
                  {showAlerts && (
                    <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-lg shadow-lg border border-secondary/10 max-h-[80vh] overflow-y-auto">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">Alertas Recientes</h3>
                          <button className="text-sm text-primary hover:text-primary-dark">
                            Ver todas
                          </button>
                        </div>
                        <div className="space-y-3">
                          {mockData.alerts.map((alert) => (
                            <div
                              key={alert.id}
                              className="flex items-center justify-between p-3 hover:bg-background rounded-lg cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${getAlertBg(alert.type)}`}>
                                  {getAlertIcon(alert.type)}
                                </div>
                                <div>
                                  <p className="font-medium text-secondary-dark">{alert.product}</p>
                                  <div className="flex items-center gap-2 text-sm text-secondary">
                                    <Clock className="w-3 h-3" />
                                    <span>Hace {alert.time}</span>
                                    {alert.change && (
                                      <span className={alert.type === 'price-increase' ? 'text-red-500' : 'text-green-500'}>
                                        {alert.change}
                                      </span>
                                    )}
                                    {alert.stock && (
                                      <span className="text-yellow-500">
                                        {alert.stock}
                                      </span>
                                    )}
                                    {alert.competitor && (
                                      <span className="text-blue-500">
                                        {alert.competitor}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className={`px-2 py-1 rounded text-xs ${
                                alert.priority === 'high' 
                                  ? 'bg-red-100 text-red-700'
                                  : alert.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-blue-100 text-blue-700'
                              }`}>
                                {alert.priority === 'high' ? 'Alta' : alert.priority === 'medium' ? 'Media' : 'Baja'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockData.stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.id} className="bg-white p-4 sm:p-6 rounded-lg border border-secondary/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-background rounded-lg">
                        <Icon className="w-6 h-6 text-secondary-dark" />
                      </div>
                      <Tooltip label={`Cambio: ${stat.change}`}>
                        <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change}
                        </span>
                      </Tooltip>
                    </div>
                    <p className="text-secondary mb-1">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-secondary-dark">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Price History Chart */}
              <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg border border-secondary/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-secondary-dark">Tendencias de Precios</h2>
                    <p className="text-sm text-secondary">Comparación últimos 30 días</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={productFilter}
                      onChange={(e) => setProductFilter(e.target.value)}
                      className="flex-1 sm:flex-none border border-secondary/20 rounded-lg px-3 py-2 text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    >
                      {productFilters.map(filter => (
                        <option key={filter.value} value={filter.value}>
                          {filter.label}
                        </option>
                      ))}
                    </select>
                    <ExportButton data={mockData.priceHistory} filename="price-history" />
                  </div>
                </div>
                <div className="h-[300px] sm:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData.priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => new Date(value).toLocaleDateString('es-CO', { month: 'short' })}
                        stroke="#9CA3AF"
                      />
                      <YAxis stroke="#9CA3AF" />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-secondary/10 rounded shadow-lg">
                                <p className="text-sm text-secondary mb-1">
                                  {new Date(label).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                                </p>
                                <p className="text-sm font-medium text-secondary-dark">
                                  Precio: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(payload[0].value)}
                                </p>
                                <p className="text-sm text-secondary">
                                  Competidores: {payload[1].value}
                                </p>
                                <div className="mt-2 pt-2 border-t border-secondary/10">
                                  <p className="text-xs text-green-500">
                                    Mínimo: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(payload[2].value)}
                                  </p>
                                  <p className="text-xs text-red-500">
                                    Máximo: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(payload[3].value)}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#E12613"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#E12613' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="competitors"
                        stroke="#9CA3AF"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#9CA3AF' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="lowest"
                        stroke="#10B981"
                        strokeWidth={1}
                        strokeDasharray="3 3"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="highest"
                        stroke="#EF4444"
                        strokeWidth={1}
                        strokeDasharray="3 3"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Competitors Analysis */}
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-secondary/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-secondary-dark">Análisis de Competencia</h2>
                    <p className="text-sm text-secondary">Top 5 competidores</p>
                  </div>
                  <ExportButton data={mockData.competitors} filename="competitors" />
                </div>
                <div className="space-y-4">
                  {mockData.competitors.map((competitor) => (
                    <div
                      key={competitor.id}
                      className="flex items-center justify-between p-3 bg-background rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-secondary/10">
                          <span className="text-sm font-medium text-secondary-dark">
                            {competitor.id}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-secondary-dark">{competitor.name}</p>
                          <p className="text-sm text-secondary">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(competitor.price)}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${
                        competitor.change.startsWith('+') ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {competitor.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border border-secondary/10">
              <div className="p-4 sm:p-6 border-b border-secondary/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-secondary-dark">Productos</h2>
                    <p className="text-sm text-secondary">Gestiona tu catálogo de productos</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 border border-secondary/20 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1 rounded ${viewMode === 'grid' ? 'bg-background' : ''}`}
                      >
                        <Grid className="w-5 h-5 text-secondary-dark" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1 rounded ${viewMode === 'list' ? 'bg-background' : ''}`}
                      >
                        <List className="w-5 h-5 text-secondary-dark" />
                      </button>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-secondary/20 rounded-lg hover:bg-background">
                      <Filter className="w-5 h-5 text-secondary-dark" />
                      <span className="text-secondary-dark">Filtros</span>
                    </button>
                  </div>
                </div>
              </div>
              <ProductsTable products={mockData.products} viewMode={viewMode} searchTerm={debouncedSearch} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}