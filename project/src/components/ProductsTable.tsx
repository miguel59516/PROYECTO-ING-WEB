import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  provider: string;
  profitability: number;
  category: string;
  stock: number;
  lastUpdate: string;
}

interface ProductsTableProps {
  products: Product[];
  viewMode: 'list' | 'grid';
  searchTerm?: string;
}

type SortField = 'name' | 'price' | 'provider' | 'profitability';
type SortOrder = 'asc' | 'desc';

export function ProductsTable({ products, viewMode, searchTerm = '' }: ProductsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const itemsPerPage = viewMode === 'grid' ? 12 : 10;

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

  // Reset to first page when search term changes
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  if (viewMode === 'grid') {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {currentProducts.map((product) => (
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
                  <span className="px-2 py-1 bg-background rounded text-sm text-secondary">
                    {product.stock} unid.
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Precio</span>
                    <span className="font-medium text-secondary-dark">{formatCurrency(product.price)}</span>
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
          ))}
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
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-right cursor-pointer hover:bg-secondary/5"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end gap-1">
                  Precio
                  <SortIcon field="price" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:bg-secondary/5"
                onClick={() => handleSort('provider')}
              >
                <div className="flex items-center gap-1">
                  Proveedor
                  <SortIcon field="provider" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-right cursor-pointer hover:bg-secondary/5"
                onClick={() => handleSort('profitability')}
              >
                <div className="flex items-center justify-end gap-1">
                  Rentabilidad
                  <SortIcon field="profitability" />
                </div>
              </th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-right">Categoría</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id} className="border-t border-secondary/10 hover:bg-background/50">
                <td className="px-4 py-3 text-left">{product.name}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-4 py-3 text-left">{product.provider}</td>
                <td className="px-4 py-3 text-right font-medium text-green-500">
                  {formatPercentage(product.profitability)}
                </td>
                <td className="px-4 py-3 text-right">{product.stock}</td>
                <td className="px-4 py-3 text-right">{product.category}</td>
              </tr>
            ))}
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