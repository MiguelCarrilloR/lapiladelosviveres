// components/BillForm.tsx
import { useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import React from "react";
import axios from "axios";

interface ProductItem {
  name: string;
  price: number;
  quantity: number;
}

interface Bill {
  purchaseDate: string;
  description: string;
  supplier: string;
  products: ProductItem[];
  totalAmount: number;
}

const BillForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [newBill, setNewBill] = useState<Bill>({
    purchaseDate: new Date().toISOString().split('T')[0],
    description: "",
    supplier: "",
    products: [],
    totalAmount: 0,
  });

  const [currentProduct, setCurrentProduct] = useState<ProductItem>({
    name: "",
    price: 0,
    quantity: 0,
  });

  const calculateTotalAmount = (products: ProductItem[]) => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const addProductToBill = () => {
    if (currentProduct.name && currentProduct.price > 0 && currentProduct.quantity > 0) {
      const updatedProducts = [...newBill.products, currentProduct];
      const totalAmount = calculateTotalAmount(updatedProducts);

      setNewBill(prev => ({
        ...prev,
        products: updatedProducts,
        totalAmount
      }));

      // Reset current product
      setCurrentProduct({
        name: "",
        price: 0,
        quantity: 0,
      });
    }
  };

  const removeProductFromBill = (index: number) => {
    const updatedProducts = newBill.products.filter((_, i) => i !== index);
    const totalAmount = calculateTotalAmount(updatedProducts);

    setNewBill(prev => ({
      ...prev,
      products: updatedProducts,
      totalAmount
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newBill.products.length === 0) {
      alert("Debe agregar al menos un producto a la factura");
      return;
    }

    try {
      // Enviar la factura a la API con axios
      const response = await axios.post('https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/bills/create', newBill);

      console.log('Factura guardada exitosamente:', response.data);

      // Mostrar mensaje de éxito
      alert('Factura guardada exitosamente');

      // Reset form
      setNewBill({
        purchaseDate: new Date().toISOString().split('T')[0],
        description: "",
        supplier: "",
        products: [],
        totalAmount: 0,
      });
      setCurrentProduct({
        name: "",
        price: 0,
        quantity: 0,
      });
      setIsOpen(false);

    } catch (error) {
      console.error('Error al guardar la factura:', error);
      alert('Error al guardar la factura. Por favor intente nuevamente.');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-4 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700"
      >
        <Plus className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Registrar Factura de Compra</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Información de la factura */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Compra
            </label>
            <input
              type="date"
              required
              className="mt-1 w-full p-2 border rounded"
              value={newBill.purchaseDate}
              onChange={(e) =>
                setNewBill({ ...newBill, purchaseDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Proveedor
            </label>
            <input
              type="text"
              required
              className="mt-1 w-full p-2 border rounded"
              value={newBill.supplier}
              onChange={(e) =>
                setNewBill({ ...newBill, supplier: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <input
              type="text"
              className="mt-1 w-full p-2 border rounded"
              value={newBill.description}
              onChange={(e) =>
                setNewBill({ ...newBill, description: e.target.value })
              }
            />
          </div>
        </div>

        {/* Agregar producto */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Agregar Producto</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Producto
              </label>
              <input
                type="text"
                className="mt-1 w-full p-2 border rounded"
                value={currentProduct.name}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Precio Unitario
              </label>
              <input
                type="number"
                min="0"
                className="mt-1 w-full p-2 border rounded"
                value={currentProduct.price === 0 ? "" : currentProduct.price}
                onChange={(e) => {
                  const val = e.target.value;
                  setCurrentProduct({
                    ...currentProduct,
                    price: val === "" ? 0 : Number(val),
                  });
                }}
              />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cantidad
              </label>
              <input
                type="number"
                min="0"
                className="mt-1 w-full p-2 border rounded"
                value={currentProduct.quantity === 0 ? "" : currentProduct.quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  setCurrentProduct({
                    ...currentProduct,
                    quantity: val === "" ? 0 : Number(val),
                  });
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={addProductToBill}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Agregar Producto
          </button>
        </div>

        {/* Lista de productos agregados */}
        {newBill.products.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Productos en la Factura</h3>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {newBill.products.map((product, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {product.quantity} | Precio: ${product.price.toFixed(2)} c/u
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      Subtotal: ${(product.price * product.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProductFromBill(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total de la Factura:</span>
                <span className="text-xl font-bold text-green-600">
                  ${newBill.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Guardar Factura
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillForm;