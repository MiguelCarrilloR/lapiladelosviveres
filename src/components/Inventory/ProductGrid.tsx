// components/ProductGrid.tsx
import { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import SaleForm from './SaleForm';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

const PRODUCTS_PER_PAGE = 12;

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

  // Reset to first page when search term changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Search Bar */}
      <div className="sticky top-[73px] z-30 bg-white shadow-sm border-b">
        <div className="container mx-auto p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, categoría, marca o talla..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 pl-10 pr-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-4 pt-6">
        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-600">
          {filteredProducts.length > 0 && (
            <p>
              Mostrando {startIndex + 1}-{Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} productos
            </p>
          )}
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <div className="mb-4">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
            <p>Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {paginatedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 bg-white rounded-lg shadow-sm px-4">
                {/* Mobile Pagination Info */}
                <div className="text-sm text-gray-600 order-2 sm:order-1">
                  Página {currentPage} de {totalPages}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="hidden sm:flex">
                    {getVisiblePages().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        disabled={page === '...'}
                        className={`px-3 py-2 text-sm font-medium border-t border-b transition-colors ${
                          page === currentPage
                            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                            : page === '...'
                            ? 'text-gray-400 cursor-default border-gray-300'
                            : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-500'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Mobile Page Input */}
                  <div className="flex sm:hidden items-center gap-2 px-3 py-2 border-t border-b border-gray-300 bg-gray-50">
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          handlePageChange(page);
                        }
                      }}
                      className="w-12 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">de {totalPages}</span>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
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