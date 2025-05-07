// components/ProductCard.tsx
import { useState } from 'react';
import { Product } from '../../types/ProductTypes';
import { useProducts } from '../../context/ProductContext';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import React from 'react';

const ProductCard = ({ product }: { product: Product }) => {
  const { updateProduct, deleteProduct } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  const handleSave = async () => {
    await updateProduct(product._id, editedProduct);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      await deleteProduct(product._id);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <input
          className="w-full p-2 border rounded"
          value={editedProduct.name}
          onChange={e => setEditedProduct({...editedProduct, name: e.target.value})}
          placeholder="Nombre del producto"
          required
        />
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={editedProduct.price}
          onChange={e => setEditedProduct({...editedProduct, price: Number(e.target.value)})}
          placeholder="Precio"
          required
        />
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={editedProduct.stock}
          onChange={e => setEditedProduct({...editedProduct, stock: Number(e.target.value)})}
          placeholder="Stock"
          required
        />
        <input
          className="w-full p-2 border rounded"
          value={editedProduct.category}
          onChange={e => setEditedProduct({...editedProduct, category: e.target.value})}
          placeholder="Categoría"
          required
        />
        <input
          className="w-full p-2 border rounded"
          value={editedProduct.brand}
          onChange={e => setEditedProduct({...editedProduct, brand: e.target.value})}
          placeholder="Marca"
          required
        />
        <input
          className="w-full p-2 border rounded"
          value={editedProduct.sizeProduct}
          onChange={e => setEditedProduct({...editedProduct, sizeProduct: e.target.value})}
          placeholder="Talla"
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className="p-2 text-green-600 hover:text-green-800"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
      <img
        src={product.imageUrl || "https://i.imgur.com/MCHK0CU.jpg"}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <div className="text-sm text-gray-600">
        <p>Marca: {product.brand}</p>
        <p>Categoría: {product.category}</p>
        <p>Tamaño: {product.sizeProduct}</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">${product.price}</span>
        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-blue-600 hover:text-blue-800"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-red-600 hover:text-red-800"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;