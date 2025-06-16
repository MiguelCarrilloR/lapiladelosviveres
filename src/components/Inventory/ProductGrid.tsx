// components/ProductGrid.tsx
import { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductForm from './ProductForm';
import SaleForm from './SaleForm';
import { Search, ChevronLeft, ChevronRight, Package, Tag, Building } from 'lucide-react';
import React from 'react';
import BillForm from './BillForm';

const PRODUCTS_PER_PAGE = 20;

const ProductGrid = () => {
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => 
    products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sizeProduct.toLowerCase().includes(searchTerm.toLowerCase())
    ), [products, searchTerm]
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getVisiblePages = (): (number | string)[] => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg mx-4 mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
      <div className="sticky top-[73px] z-30 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Results Info */}
        {filteredProducts.length > 0 && (
          <div className="mb-4 text-sm text-gray-600 flex justify-between items-center">
            <span>
              {startIndex + 1}-{Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} productos
            </span>
            <span className="text-xs text-gray-500">
              Página {currentPage} de {totalPages}
            </span>
          </div>
        )}
        
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
            <p className="text-sm">Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <>
            {/* Product List */}
            <div className="space-y-1 mb-6">
              {paginatedProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  className={`flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <h3 className="font-medium text-gray-900 truncate">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{product.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        <span>{product.brand}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Talla:</span> {product.sizeProduct}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-4">
                    <div className="text-lg font-semibold text-gray-900">
                      ${product.price?.toLocaleString() || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Stock: {product.stock || 0}
                    </div>
                    {product.stock === 0 && (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                        Agotado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Simple Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                
                <div className="flex items-center gap-1">
                  {getVisiblePages().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={page === '...'}
                      className={`px-3 py-2 text-sm rounded-md ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : page === '...'
                          ? 'text-gray-400 cursor-default'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <ProductForm />
      <SaleForm />
    </div>
  );
};

export default ProductGrid;