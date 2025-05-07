// components/ProductGrid.tsx
import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import SaleForm from './SaleForm';
import { Search } from 'lucide-react';
import React from 'react';

const ProductGrid = () => {
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sizeProduct.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, categoría, marca o talla..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No se encontraron productos que coincidan con la búsqueda
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      
      <ProductForm />
      <SaleForm />
    </div>
  );
};

export default ProductGrid;