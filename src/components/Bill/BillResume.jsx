import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit2, Trash2, ShoppingCart, Save, X } from 'lucide-react';

import axios from 'axios';
import BillForm from '../Inventory/BillForm';

const BillResume = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [editForm, setEditForm] = useState({
    description: '',
    supplier: '',
    purchaseDate: '',
    products: []
  });

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    const filtered = bills.filter(bill =>
      bill.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.products?.some(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredBills(filtered);
  }, [bills, searchTerm]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/bills');
      setBills(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteBill = async (id) => {
    if (window.confirm('¿Eliminar esta factura?')) {
      try {
        setLoading(true);
        await axios.delete(`https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/bills/${id}`);
        setBills(bills.filter(bill => bill._id !== id));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const viewBill = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const editBill = (bill) => {
    setEditingBill(bill._id);
    setEditForm({
      description: bill.description,
      supplier: bill.supplier,
      purchaseDate: bill.purchaseDate.split('T')[0], // Formato YYYY-MM-DD para input date
      products: bill.products.map(product => ({ ...product })) // Copia profunda
    });
  };

  const saveEdit = async () => {
    try {
      setLoading(true);
      
      // Calcular el total basado en los productos editados
      const totalAmount = editForm.products.reduce((sum, product) => 
        sum + (product.price * product.quantity), 0
      );

      const updatedBill = {
        ...editForm,
        totalAmount
      };

      await axios.put(`http://localhost:5000/api/bills/${editingBill}`, updatedBill);
      
      // Actualizar el estado local
      setBills(bills.map(bill => 
        bill._id === editingBill 
          ? { ...bill, ...updatedBill, _id: bill._id }
          : bill
      ));
      
      cancelEdit();
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar la factura');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingBill(null);
    setEditForm({
      description: '',
      supplier: '',
      purchaseDate: '',
      products: []
    });
  };

  const updateProduct = (index, field, value) => {
    const updatedProducts = [...editForm.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: field === 'price' || field === 'quantity' ? parseFloat(value) || 0 : value
    };
    setEditForm({ ...editForm, products: updatedProducts });
  };

  const removeProduct = (index) => {
    const updatedProducts = editForm.products.filter((_, i) => i !== index);
    setEditForm({ ...editForm, products: updatedProducts });
  };

  const addProduct = () => {
    setEditForm({
      ...editForm,
      products: [...editForm.products, { name: '', price: 0, quantity: 1 }]
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const calculateTotal = () => {
    return editForm.products.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Resumen de Facturas</h1>

        {/* Buscador */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar facturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Vista Desktop - Tabla */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 min-w-[150px]">Descripción</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 min-w-[120px]">Proveedor</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Productos</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Total</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500 whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {editingBill === bill._id ? (
                          <input
                            type="date"
                            value={editForm.purchaseDate}
                            onChange={(e) => setEditForm({ ...editForm, purchaseDate: e.target.value })}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          formatDate(bill.purchaseDate)
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-[200px]">
                        {editingBill === bill._id ? (
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <span className="truncate block" title={bill.description}>
                            {bill.description}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-[150px]">
                        {editingBill === bill._id ? (
                          <input
                            type="text"
                            value={editForm.supplier}
                            onChange={(e) => setEditForm({ ...editForm, supplier: e.target.value })}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <span className="truncate block" title={bill.supplier}>
                            {bill.supplier}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="w-4 h-4" />
                          {editingBill === bill._id ? editForm.products.length : bill.products.length}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-green-600 whitespace-nowrap">
                        {editingBill === bill._id 
                          ? formatCurrency(calculateTotal())
                          : formatCurrency(bill.totalAmount)
                        }
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-1">
                          {editingBill === bill._id ? (
                            <>
                              <button
                                onClick={saveEdit}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                                title="Guardar"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                title="Cancelar"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => viewBill(bill)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                title="Ver"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => editBill(bill)}
                                className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteBill(bill._id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredBills.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No se encontraron facturas</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vista Mobile - Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No se encontraron facturas</p>
            </div>
          ) : (
            filteredBills.map((bill) => (
              <div key={bill._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{bill.description}</h3>
                    <p className="text-xs text-gray-500">{formatDate(bill.purchaseDate)}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => viewBill(bill)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      title="Ver"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editBill(bill)}
                      className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBill(bill._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proveedor:</span>
                    <span className="text-gray-900 font-medium">{bill.supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Productos:</span>
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{bill.products.length}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-600 font-medium">Total:</span>
                    <span className="text-green-600 font-semibold text-lg">
                      {formatCurrency(bill.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de vista */}
      {showModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Detalles de Factura</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                    <p className="text-gray-900">{formatDate(selectedBill.purchaseDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Proveedor</label>
                    <p className="text-gray-900">{selectedBill.supplier}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <p className="text-gray-900">{selectedBill.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Productos</label>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Producto</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Precio</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cantidad</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedBill.products.map((product, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm">{product.name}</td>
                            <td className="px-4 py-2 text-sm">{formatCurrency(product.price)}</td>
                            <td className="px-4 py-2 text-sm">{product.quantity}</td>
                            <td className="px-4 py-2 text-sm font-medium">
                              {formatCurrency(product.price * product.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Total: </span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(selectedBill.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de productos */}
      {editingBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Editar Productos</h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Producto</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Precio</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cantidad</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subtotal</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {editForm.products.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) => updateProduct(index, 'name', e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                              placeholder="Nombre del producto"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={product.price}
                              onChange={(e) => updateProduct(index, 'price', e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                              placeholder="1"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm font-medium">
                            {formatCurrency(product.price * product.quantity)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => removeProduct(index)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={addProduct}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Agregar Producto
                  </button>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Total: </span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <BillForm />
    </div>
  );
};

export default BillResume;