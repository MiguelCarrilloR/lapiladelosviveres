// context/ProductContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductContextType } from '../types/ProductTypes';

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://tienda-391674601129.us-central1.run.app/api/products/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, '_id'>) => {
    try {
      const response = await fetch('https://tienda-391674601129.us-central1.run.app/api/products/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      setError('Error al añadir el producto');
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const response = await fetch(`https://tienda-391674601129.us-central1.run.app/api/products/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const updatedProduct = await response.json();
      setProducts(prev => 
        prev.map(p => p._id === id ? updatedProduct : p)
      );
    } catch (err) {
      setError('Error al actualizar el producto');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`https://tienda-391674601129.us-central1.run.app/api/products/products/${id}`, {
        method: 'DELETE',
      });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError('Error al eliminar el producto');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        loading, 
        error, 
        addProduct, 
        updateProduct, 
        deleteProduct,
        fetchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};