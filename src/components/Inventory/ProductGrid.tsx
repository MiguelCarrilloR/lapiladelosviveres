// components/ProductGrid.tsx
import { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductForm from './ProductForm';
import SaleForm from './SaleForm';
import { Search, ChevronLeft, ChevronRight, Package, Tag, Building, Edit, Trash2 } from 'lucide-react';
import React from 'react';
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const PRODUCTS_PER_PAGE = 20;

interface Product {
  _id: string;
  name: string;
  category: string;
  brand: string;
  sizeProduct: string;
  price: number;
  stock: number;
}

const ProductGrid = () => {
  const { products, loading, error, updateProduct, deleteProduct } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;

    const search = searchTerm.toLowerCase();

    return products.filter(product =>
      (product.name?.toLowerCase() || "").includes(search) ||
      (product.category?.toLowerCase() || "").includes(search) ||
      (product.brand?.toLowerCase() || "").includes(search) ||
      (product.sizeProduct?.toLowerCase() || "").includes(search)
    );
  }, [products, searchTerm]);

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

  // Handler para eliminar producto
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(id);

        // Mostrar notificación de éxito
        if (typeof window !== 'undefined' && window.Toastify) {
          window.Toastify({
            text: "¡Producto eliminado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#4CAF50",
          }).showToast();
        } else {
          alert("¡Producto eliminado con éxito!");
        }
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        if (typeof window !== 'undefined' && window.Toastify) {
          window.Toastify({
            text: "¡Ocurrió un problema para eliminar el producto!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#FF0000",
          }).showToast();
        } else {
          alert("¡Ocurrió un problema para eliminar el producto!");
        }
      }
    }
  };

  // Handler para editar producto
  const handleEdit = (id: string) => {
    const productToEdit = products.find((product) => product._id === id);
    if (productToEdit) {
      setEditProduct(productToEdit);
      setEditModalOpen(true);
    }
  };

  // Handler para cambios en el formulario de edición
  const handleEditProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProduct(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Handler para actualizar producto
  const handleUpdateProduct = async () => {
    if (!editProduct) return;

    try {
      await updateProduct(editProduct._id, editProduct);

      setEditModalOpen(false);
      setEditProduct(null);

      if (typeof window !== 'undefined' && window.Toastify) {
        window.Toastify({
          text: "¡Producto actualizado con éxito!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#4CAF50",
        }).showToast();
      } else {
        alert("¡Producto actualizado con éxito!");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Ocurrió un error al intentar actualizar el producto.");
    }
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
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                >
                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between">
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
                          <span className="text-gray-500">Tamaño:</span> {product.sizeProduct}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="flex flex-col items-end gap-1">
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
                      {/* Botones de acción */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                          title="Editar producto"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="hidden lg:inline">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden lg:inline">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    {/* Título y categoría */}
                    <div className="flex items-start gap-3 mb-3">
                      <Package className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-base leading-tight mb-1">
                          {product.name}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>{product.category}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              <span>{product.brand}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Talla:</span> {product.sizeProduct}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Precio, stock y botones en una fila */}
                    <div className="flex items-center justify-between">
                      {/* Precio y stock */}
                      <div className="flex flex-col">
                        <div className="text-lg font-semibold text-gray-900">
                          ${product.price?.toLocaleString() || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            Stock: {product.stock || 0}
                          </span>
                          {product.stock === 0 && (
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                              Agotado
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="flex items-center justify-center w-10 h-10 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                          title="Editar producto"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex items-center justify-center w-10 h-10 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                <div className="flex items-center gap-1">
                  {getVisiblePages().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={page === '...'}
                      className={`px-3 py-2 text-sm rounded-md ${page === currentPage
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
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal para editar producto */}
      {editModalOpen && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Editar Producto</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={editProduct.name}
                  onChange={handleEditProductChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  name="category"
                  value={editProduct.category}
                  onChange={handleEditProductChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  name="brand"
                  value={editProduct.brand}
                  onChange={handleEditProductChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño
                </label>
                <input
                  type="text"
                  name="sizeProduct"
                  value={editProduct.sizeProduct}
                  onChange={handleEditProductChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  name="price"
                  value={editProduct.price}
                  onChange={handleEditProductChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={editProduct.stock}
                  onChange={handleEditProductChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateProduct}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditProduct(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <ProductForm />
      <SaleForm />
    </div>
  );
};

export default ProductGrid;