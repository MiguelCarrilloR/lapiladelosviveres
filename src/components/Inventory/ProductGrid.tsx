// components/ProductGrid.tsx
import { useState, useMemo, useCallback } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductForm from './ProductForm';
import SaleForm from './SaleForm';
import { Edit, Trash2, Plus, Download, Upload } from 'lucide-react';
import React from 'react';
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef, ICellRendererParams, GridReadyEvent, GridApi, ColumnApi } from 'ag-grid-community';

// Registrar los módulos de AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

interface Product {
  _id: string;
  name: string;
  category: string;
  brand: string;
  sizeProduct: string;
  price: number;
  stock: number;
}

// Componente personalizado para las acciones
const ActionsCellRenderer = ({ data, context }: ICellRendererParams) => {
  const { handleEdit, handleDelete } = context;

  return (
    <div className="flex items-center justify-center gap-2 h-full">
      <button
        onClick={() => handleEdit(data._id)}
        className="flex items-center justify-center w-8 h-8 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
        title="Editar producto"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDelete(data._id)}
        className="flex items-center justify-center w-8 h-8 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
        title="Eliminar producto"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

// Componente personalizado para el precio
const PriceCellRenderer = ({ value }: ICellRendererParams) => {
  return (
    <div className="text-right font-semibold">
      ${value?.toLocaleString() || 'N/A'}
    </div>
  );
};

// Componente personalizado para el stock
const StockCellRenderer = ({ value }: ICellRendererParams) => {
  return (
    <div className="flex items-center justify-center">
      <span className={`px-2 py-1 rounded text-sm ${
        value === 0 
          ? 'bg-red-100 text-red-800' 
          : value < 10 
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800'
      }`}>
        {value || 0}
      </span>
    </div>
  );
};

const ProductGrid = () => {
  const { products, loading, error, updateProduct, deleteProduct } = useProducts();

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);

  // Configuración de columnas para AG-Grid
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Nombre',
      field: 'name',
      flex: 2,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      sortable: true,
      editable: true,
      cellStyle: { fontWeight: 'bold' }
    },
    {
      headerName: 'Categoría',
      field: 'category',
      flex: 1,
      minWidth: 120,
      filter: 'agTextColumnFilter',
      sortable: true,
      editable: true
    },
    {
      headerName: 'Marca',
      field: 'brand',
      flex: 1,
      minWidth: 120,
      filter: 'agTextColumnFilter',
      sortable: true,
      editable: true
    },
    {
      headerName: 'Tamaño',
      field: 'sizeProduct',
      flex: 1,
      minWidth: 100,
      filter: 'agTextColumnFilter',
      sortable: true,
      editable: true,
      headerName: 'Talla'
    },
    {
      headerName: 'Precio',
      field: 'price',
      flex: 1,
      minWidth: 120,
      filter: 'agNumberColumnFilter',
      sortable: true,
      editable: true,
      cellRenderer: PriceCellRenderer,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        step: 100
      }
    },
    {
      headerName: 'Stock',
      field: 'stock',
      flex: 1,
      minWidth: 100,
      filter: 'agNumberColumnFilter',
      sortable: true,
      editable: true,
      cellRenderer: StockCellRenderer,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        step: 1
      }
    },
    {
      headerName: 'Acciones',
      field: 'actions',
      width: 120,
      sortable: false,
      filter: false,
      resizable: false,
      pinned: 'right',
      cellRenderer: ActionsCellRenderer,
      suppressSizeToFit: true
    }
  ], []);

  // Configuración por defecto de la grilla
  const defaultColDef: ColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    suppressMenu: false
  }), []);

  // Handler para eliminar producto
  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(id);

        if (typeof window !== 'undefined' && window.Toastify) {
          window.Toastify({
            text: "¡Producto eliminado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#4CAF50",
          }).showToast();
        }
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        if (typeof window !== 'undefined' && window.Toastify) {
          window.Toastify({
            text: "¡Ocurrió un problema al eliminar el producto!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#FF0000",
          }).showToast();
        }
      }
    }
  }, [deleteProduct]);

  // Handler para editar producto (abre modal)
  const handleEdit = useCallback((id: string) => {
    const productToEdit = products.find((product) => product._id === id);
    if (productToEdit) {
      setEditProduct(productToEdit);
      setEditModalOpen(true);
    }
  }, [products]);

  // Configuración del contexto para pasar funciones a los cell renderers
  const gridContext = useMemo(() => ({
    handleEdit,
    handleDelete
  }), [handleEdit, handleDelete]);

  // Handler cuando la grilla está lista
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    
    // Auto-ajustar columnas
    params.api.sizeColumnsToFit();
  }, []);

  // Handler para cuando se edita una celda
  const onCellValueChanged = useCallback(async (params: any) => {
    const { data, colDef, newValue, oldValue } = params;
    
    if (newValue === oldValue) return;

    try {
      const updatedProduct = { ...data };
      await updateProduct(data._id, updatedProduct);

      if (typeof window !== 'undefined' && window.Toastify) {
        window.Toastify({
          text: `${colDef.headerName} actualizado correctamente`,
          duration: 2000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#4CAF50",
        }).showToast();
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      
      // Revertir el cambio en caso de error
      params.node.setDataValue(colDef.field, oldValue);
      
      if (typeof window !== 'undefined' && window.Toastify) {
        window.Toastify({
          text: "Error al actualizar el producto",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF0000",
        }).showToast();
      }
    }
  }, [updateProduct]);

  // Handler para cambios en el formulario de edición
  const handleEditProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProduct(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Handler para actualizar producto desde el modal
  const handleUpdateProduct = async () => {
    if (!editProduct) return;

    try {
      await updateProduct(editProduct._id, editProduct);
      setEditModalOpen(false);
      setEditProduct(null);

      // Refrescar la grilla
      if (gridApi) {
        gridApi.refreshCells();
      }

      if (typeof window !== 'undefined' && window.Toastify) {
        window.Toastify({
          text: "¡Producto actualizado con éxito!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#4CAF50",
        }).showToast();
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Ocurrió un error al intentar actualizar el producto.");
    }
  };

  // Funciones para exportar/importar datos
  const exportToCSV = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `productos_${new Date().toISOString().split('T')[0]}.csv`,
        columnKeys: ['name', 'category', 'brand', 'sizeProduct', 'price', 'stock']
      });
    }
  };

  const exportToExcel = () => {
    if (gridApi) {
      gridApi.exportDataAsExcel({
        fileName: `productos_${new Date().toISOString().split('T')[0]}.xlsx`,
        columnKeys: ['name', 'category', 'brand', 'sizeProduct', 'price', 'stock']
      });
    }
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
      {/* Toolbar */}
      <div className="sticky top-[73px] z-30 bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Gestión de Productos
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {products.length} productos
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              

              <div className="h-6 w-px bg-gray-300 mx-2" />

              <button
                onClick={() => gridApi?.setFilterModel(null)}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AG-Grid */}
      <div className="h-[calc(100vh-200px)] p-4">
        <div className="ag-theme-alpine h-full w-full">
          <AgGridReact
            rowData={products}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            context={gridContext}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            animateRows={true}
            rowSelection="multiple"
            suppressCellFocus={false}
            enableCellTextSelection={true}
            ensureDomOrder={true}
            stopEditingWhenCellsLoseFocus={true}
            rowHeight={50}
            headerHeight={50}
            floatingFiltersHeight={35}
            suppressRowClickSelection={true}
            suppressRowHoverHighlight={false}
            enableRangeSelection={true}
            enableFillHandle={true}
            undoRedoCellEditing={true}
            undoRedoCellEditingLimit={20}
            suppressScrollOnNewData={true}
            getRowId={(params) => params.data._id}
            localeText={{
              // Traducciones al español
              page: 'Página',
              more: 'Más',
              to: 'a',
              of: 'de',
              next: 'Siguiente',
              last: 'Último',
              first: 'Primero',
              previous: 'Anterior',
              loadingOoo: 'Cargando...',
              selectAll: 'Seleccionar Todo',
              searchOoo: 'Buscar...',
              blanks: 'En Blanco',
              filterOoo: 'Filtrar...',
              applyFilter: 'Aplicar Filtro',
              clearFilter: 'Limpiar Filtro',
              equals: 'Igual',
              notEqual: 'No Igual',
              lessThan: 'Menor que',
              greaterThan: 'Mayor que',
              lessThanOrEqual: 'Menor o igual que',
              greaterThanOrEqual: 'Mayor o igual que',
              inRange: 'En rango',
              contains: 'Contiene',
              notContains: 'No contiene',
              startsWith: 'Empieza con',
              endsWith: 'Termina con'
            }}
          />
        </div>
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