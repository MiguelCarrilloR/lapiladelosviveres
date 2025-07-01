// components/ProductForm.tsx
import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { Plus, X } from "lucide-react";
import React from "react";

const ProductForm = () => {
  const { addProduct } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    sizeProduct: "",
    imageUrl: "a",
  });
  const [selectedPercentage, setSelectedPercentage] = useState(30);

  const calculateSalePrice = (price: number) => {
    return price + price * (selectedPercentage / 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos requeridos estén llenos
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.stock || 
        !newProduct.category.trim() || !newProduct.brand.trim() || !newProduct.sizeProduct.trim()) {
      return;
    }

    // Crear un nuevo objeto asegurando que todos los campos sean strings válidos
    const productToSave = {
      id: Date.now().toString(), // Agregar un ID único
      name: `${newProduct.name.trim()} ${newProduct.sizeProduct.trim()}`.trim(),
      price: calculateSalePrice(Number(newProduct.price)),
      stock: Number(newProduct.stock),
      category: newProduct.category.trim() || "",
      brand: newProduct.brand.trim() || "",
      sizeProduct: newProduct.sizeProduct.trim() || "",
      imageUrl: newProduct.imageUrl || "a",
    };

    await addProduct(productToSave);
    setNewProduct({
      name: "",
      price: "",
      stock: "",
      category: "",
      brand: "",
      sizeProduct: "",
      imageUrl: "a",
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        <Plus className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
     <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 max-w-md w-full space-y-4"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Agregar Nuevo Producto</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            required
            className="mt-1 w-full p-2 border rounded"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Precio de Costo
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 w-full p-2 border rounded"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Porcentaje de ganancia
            </label>
            <select
              className="w-full p-2 border rounded text-sm"
              value={selectedPercentage}
              onChange={(e) => setSelectedPercentage(Number(e.target.value))}
            >
              <option value={20}>20%</option>
              <option value={30}>30%</option>
              <option value={50}>50%</option>
            </select>
          </div>
          {newProduct.price && Number(newProduct.price) > 0 && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">Precio de venta (+{selectedPercentage}%): </span>
              <span className="font-medium text-green-600">
                ${calculateSalePrice(Number(newProduct.price)).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            required
            min="0"
            className="mt-1 w-full p-2 border rounded"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <input
            type="text"
            required
            className="mt-1 w-full p-2 border rounded"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Marca
          </label>
          <input
            type="text"
            required
            className="mt-1 w-full p-2 border rounded"
            value={newProduct.brand}
            onChange={(e) =>
              setNewProduct({ ...newProduct, brand: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tamaño
          </label>
          <input
            type="text"
            required
            className="mt-1 w-full p-2 border rounded"
            value={newProduct.sizeProduct}
            onChange={(e) =>
              setNewProduct({ ...newProduct, sizeProduct: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;