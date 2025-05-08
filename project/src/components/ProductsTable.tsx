import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Product {
  id: string;
  name: string;
  price: number;
  provider: string;
  profitability: number;
  category: string;
  stock: number;
  lastUpdate: string;
  priceHistory?: Array<{ date: string; price: number }>;
}

interface ProductsTableProps {
  products: Product[];
  viewMode: 'list' | 'grid';
  searchTerm?: string;
}

type SortField = 'name' | 'price' | 'provider' | 'profitability';
type SortOrder = 'asc' | 'desc';

const mockPriceHistory = (days: number) => {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString(),
    price: Math.random() * 100 + 50
  }));
};

export function ProductsTable({ products: initialProducts, viewMode, searchTerm = '' }: ProductsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Add price history to products
  const products = initialProducts.map(product => ({
    ...product,
    priceHistory: mockPriceHistory(30)
  }));

  const itemsPerPage = viewMode === 'grid' ? 12 : 7;

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.provider.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    return typeof aValue === 'string' 
      ? multiplier * aValue.localeCompare(bValue as string)
      : multiplier * ((aValue as number) - (bValue as number));
  });

  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  const getPriceChange = (history: Array<{ price: number }>) => {
    if (history.length < 2) return { value: 0, trend: 'neutral' };
    const first = history[0].price;
    const last = history[history.length - 1].price;
    const change = ((last - first) / first) * 100;
    return {
      value: change,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  if (viewMode === 'grid') {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {currentProducts.map((product) => {
            const priceChange = getPriceChange(product.priceHistory || []);
            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-secondary/10 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-secondary-dark">{product.name}</h3>
                      <p className="text-sm text-secondary">{product.category}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {product.stock} unid.
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Precio</span>
                      <div className="flex items-center gap-2">
                        <TrendIcon trend={priceChange.trend} />
                        <span className="font-medium text-secondary-dark">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    </div>
                    <div className="h-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={product.priceHistory}>
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke={priceChange.trend === 'up' ? '#EF4444' : '#10B981'}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Rentabilidad</span>
                      <span className="font-medium text-green-500">{formatPercentage(product.profitability)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Proveedor</span>
                      <span className="text-secondary-dark">{product.provider}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-background text-xs text-secondary">
                  Última actualización: {new Date(product.lastUpdate).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-secondary/10">
          <div className="text-sm text-secondary">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a{' '}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de{' '}
            {filteredProducts.length} productos
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background">
            <tr>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:bg-secondary/5"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Nombre
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-center">Tendencia</th>
              <th 
                className="px-4 py-3 text-right cursor-pointer hover:bg-secondary/5"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end gap-1">
                  Precio
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-right cursor-pointer hover:bg-secondary/5"
                onClick={() => handleSort('profitability')}
              >
                <div className="flex items-center justify-end gap-1">
                  Rentabilidad
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-right">Última Actualización</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => {
              const priceChange = getPriceChange(product.priceHistory || []);
              return (
                <tr key={product.id} className="border-t border-secondary/10 hover:bg-background/50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-secondary-dark">{product.name}</p>
                      <p className="text-sm text-secondary">{product.provider}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-12 w-32 mx-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={product.priceHistory}>
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke={priceChange.trend === 'up' ? '#EF4444' : '#10B981'}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TrendIcon trend={priceChange.trend} />
                      <span className="font-medium text-secondary-dark">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    <span className={`text-sm ${
                      priceChange.trend === 'up' ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {priceChange.value > 0 ? '+' : ''}{priceChange.value.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-green-500">
                    {formatPercentage(product.profitability)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-1 rounded text-sm ${
                      product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-secondary">
                    {new Date(product.lastUpdate).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-secondary/10">
        <div className="text-sm text-secondary">
          Mostrando {((currentPage - 1) * itemsPerPage) + 1} a{' '}
          {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de{' '}
          {filteredProducts.length} productos
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}