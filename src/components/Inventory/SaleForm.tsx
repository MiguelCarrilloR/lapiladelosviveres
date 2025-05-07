// components/SaleForm.tsx
import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useSales } from '../../context/SaleContext';
import { Product } from '../../types/ProductTypes';
import { SaleProduct } from '../../types/SaleTypes';
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';
import React from 'react';

const SaleForm = () => {
  const { products } = useProducts();
  const { addSale } = useSales();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<(SaleProduct & { available: number })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProductToSale = (product: Product) => {
    const existingProduct = selectedProducts.find(p => p.id === product._id);
    
    if (existingProduct) {
      if (existingProduct.quantity < existingProduct.available) {
        setSelectedProducts(prev =>
          prev.map(p =>
            p.id === product._id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          )
        );
      }
    } else {
      setSelectedProducts(prev => [
        ...prev,
        {
          id: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          available: product.stock
        }
      ]);
    }
  };

  const removeProductFromSale = (productId: string) => {
    setSelectedProducts(prev =>
      prev.map(p =>
        p.id === productId && p.quantity > 1
          ? { ...p, quantity: p.quantity - 1 }
          : p
      ).filter(p => p.quantity > 0)
    );
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce((total, p) => total + (p.price * p.quantity), 0);
  };

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) return;

    const sale = {
      products: selectedProducts.map(({ id, name, price, quantity }) => ({
        id,
        name,
        price,
        quantity
      })),
      totalPrice: getTotalPrice()
    };

    await addSale(sale);
    setSelectedProducts([]);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700"
      >
        <ShoppingCart className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Registrar Venta</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Lista de productos disponibles */}
          <div>
            <h3 className="font-semibold mb-2">Productos Disponibles</h3>
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full p-2 border rounded mb-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredProducts.map(product => (
                <div
                  key={product._id}
                  className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {product.stock} | Precio: ${product.price}
                    </p>
                  </div>
                  <button
                    onClick={() => addProductToSale(product)}
                    disabled={product.stock === 0}
                    className="p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Productos seleccionados */}
          <div>
            <h3 className="font-semibold mb-2">Productos en la Venta</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedProducts.map(product => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {product.quantity} | Precio: ${product.price}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => removeProductFromSale(product.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => addProductToSale(products.find(p => p._id === product.id)!)}
                      disabled={product.quantity >= product.available}
                      className="p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4">
              <p className="text-xl font-bold">
                Total: ${getTotalPrice().toFixed(2)}
              </p>
              <button
                onClick={handleSubmit}
                disabled={selectedProducts.length === 0}
                className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                Registrar Venta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleForm;