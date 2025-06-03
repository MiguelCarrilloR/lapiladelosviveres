// components/ProductCard.tsx
import { useState, useRef, useEffect } from 'react';
import { Product } from '../../types/ProductTypes';
import { useProducts } from '../../context/ProductContext';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import React from 'react';

// Componente optimizado para carga lazy de imágenes
const LazyImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Imagen placeholder mientras carga
  const placeholderSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23d1d5db' font-family='sans-serif' font-size='14'%3ECargando...%3C/text%3E%3C/svg%3E";
  
  // Imagen por defecto en caso de error
  const defaultImage = "https://i.imgur.com/MCHK0CU.jpg";

  useEffect(() => {
    const currentImg = imgRef.current;
    
    if (!currentImg) return;

    // Crear el Intersection Observer para lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !imageSrc) {
            // Precargar la imagen antes de mostrarla
            const img = new Image();
            
            img.onload = () => {
              setImageSrc(src || defaultImage);
              setIsLoading(false);
            };
            
            img.onerror = () => {
              setImageSrc(defaultImage);
              setIsLoading(false);
              setHasError(true);
            };
            
            // Iniciar la carga de la imagen
            img.src = src || defaultImage;
            
            // Dejar de observar una vez que empezamos a cargar
            if (observerRef.current) {
              observerRef.current.unobserve(currentImg);
            }
          }
        });
      },
      {
        threshold: 0.1, // Cargar cuando el 10% de la imagen sea visible
        rootMargin: '50px' // Empezar a cargar 50px antes de que sea visible
      }
    );

    observerRef.current.observe(currentImg);

    return () => {
      if (observerRef.current && currentImg) {
        observerRef.current.unobserve(currentImg);
      }
    };
  }, [src, imageSrc]);

  return (
    <div className="relative">
      <img
        ref={imgRef}
        src={imageSrc || placeholderSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
        loading="lazy" // Lazy loading nativo del navegador como respaldo
      />
      
      {/* Indicador de carga */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Indicador de error */}
      {hasError && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
          Imagen por defecto
        </div>
      )}
    </div>
  );
};

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
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        {/* Header del formulario */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Pencil className="w-5 h-5 mr-2 text-blue-600" />
            Editar Producto
          </h3>
          <p className="text-sm text-gray-500 mt-1">Modifica la información del producto</p>
        </div>

        <div className="space-y-6">
          {/* Nombre del producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del producto
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={editedProduct.name}
              onChange={e => setEditedProduct({ ...editedProduct, name: e.target.value })}
              placeholder="Ingresa el nombre del producto"
              required
            />
          </div>

          {/* Precio y Stock en una fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={editedProduct.price}
                  onChange={e => setEditedProduct({ ...editedProduct, price: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock disponible
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={editedProduct.stock}
                onChange={e => setEditedProduct({ ...editedProduct, stock: Number(e.target.value) })}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          {/* Categoría y Marca en una fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={editedProduct.category}
                onChange={e => setEditedProduct({ ...editedProduct, category: e.target.value })}
                placeholder="Ej: Camisetas, Pantalones"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={editedProduct.brand}
                onChange={e => setEditedProduct({ ...editedProduct, brand: e.target.value })}
                placeholder="Ej: Nike, Adidas"
                required
              />
            </div>
          </div>

          {/* Talla */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Talla
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={editedProduct.sizeProduct}
              onChange={e => setEditedProduct({ ...editedProduct, sizeProduct: e.target.value })}
              placeholder="Ej: S, M, L, XL"
              required
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Check className="w-4 h-4 mr-2" />
            Guardar cambios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
      <LazyImage
        src={product.imageUrl}
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
        <span className="text-xl font-bold">
          ${product.price.toLocaleString("es-CO")}
        </span>
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