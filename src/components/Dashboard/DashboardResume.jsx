import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  TrendingDown,
  Calendar,
  Filter,
  Eye,
  BarChart3
} from "lucide-react";
import axios from "axios";

function DashboardResume() {
  const navigate = useNavigate();
  
  // Estados principales
  const [totalProducts, setTotalProducts] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [billsData, setBillsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para filtros
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, today, month, year
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  // Estados para vista
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, balance, pyg
  
  // Estados calculados
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    dailyData: [],
    monthlyData: [],
    expensesByCategory: []
  });

  // Función para filtrar datos por fecha
  const filterDataByDate = (data, dateField) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      
      switch (selectedFilter) {
        case 'today':
          return itemDate >= today;
        case 'month':
          return itemDate >= thisMonth;
        case 'year':
          return itemDate >= thisYear;
        case 'custom':
          if (customDateRange.startDate && customDateRange.endDate) {
            const start = new Date(customDateRange.startDate);
            const end = new Date(customDateRange.endDate);
            return itemDate >= start && itemDate <= end;
          }
          return true;
        default:
          return true;
      }
    });
  };

  // Función para procesar datos financieros
  const processFinancialData = () => {
    const filteredSales = filterDataByDate(salesData, 'date');
    const filteredBills = filterDataByDate(billsData, 'purchaseDate');

    // Calcular totales
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalExpenses = filteredBills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Datos diarios combinados
    const dailyRevenue = {};
    const dailyExpenses = {};

    filteredSales.forEach(sale => {
      const day = new Date(sale.date).toLocaleDateString("es-ES");
      dailyRevenue[day] = (dailyRevenue[day] || 0) + sale.totalPrice;
    });

    filteredBills.forEach(bill => {
      const day = new Date(bill.purchaseDate).toLocaleDateString("es-ES");
      dailyExpenses[day] = (dailyExpenses[day] || 0) + bill.totalAmount;
    });

    // Combinar datos diarios
    const allDates = [...new Set([...Object.keys(dailyRevenue), ...Object.keys(dailyExpenses)])];
    const dailyData = allDates.map(date => ({
      date,
      ingresos: dailyRevenue[date] || 0,
      gastos: dailyExpenses[date] || 0,
      utilidad: (dailyRevenue[date] || 0) - (dailyExpenses[date] || 0)
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Gastos por proveedor
    const expensesBySupplier = {};
    filteredBills.forEach(bill => {
      expensesBySupplier[bill.supplier] = (expensesBySupplier[bill.supplier] || 0) + bill.totalAmount;
    });

    const expensesByCategory = Object.entries(expensesBySupplier).map(([supplier, amount]) => ({
      name: supplier,
      value: amount
    }));

    setFinancialData({
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      dailyData,
      expensesByCategory
    });
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userPassword = localStorage.getItem("userPassword");

    if (!userEmail || !userPassword) {
      navigate("/");
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener productos
        const productsResponse = await axios.get(
          "https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/products/total"
        );
        setTotalProducts(productsResponse.data.total);

        // Obtener ventas
        const salesResponse = await axios.get(
          "https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/sales"
        );
        setSalesData(salesResponse.data);

        // Obtener gastos/facturas
        const billsResponse = await axios.get("https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/bills/");
        setBillsData(billsResponse.data.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Procesar datos cuando cambien los filtros o los datos
  useEffect(() => {
    if (salesData.length > 0 || billsData.length > 0) {
      processFinancialData();
    }
  }, [salesData, billsData, selectedFilter, customDateRange]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Cargando datos financieros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {activeView === 'dashboard' && 'Panel de Control'}
                {activeView === 'balance' && 'Balance General'}
                {activeView === 'pyg' && 'Estado de Pérdidas y Ganancias'}
              </h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'dashboard' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-2 inline" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('balance')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'balance' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="w-4 h-4 mr-2 inline" />
                  Balance
                </button>
                <button
                  onClick={() => setActiveView('pyg')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'pyg' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mr-2 inline" />
                  P&G
                </button>
                <button
                  onClick={() => navigate("/inventario")}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  <Package className="w-4 h-4 mr-2 inline" />
                  Inventario
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todos los períodos</option>
                  <option value="today">Hoy</option>
                  <option value="month">Este mes</option>
                  <option value="year">Este año</option>
                  <option value="custom">Rango personalizado</option>
                </select>
                
                {selectedFilter === 'custom' && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      value={customDateRange.startDate}
                      onChange={(e) => setCustomDateRange({...customDateRange, startDate: e.target.value})}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-gray-500">hasta</span>
                    <input
                      type="date"
                      value={customDateRange.endDate}
                      onChange={(e) => setCustomDateRange({...customDateRange, endDate: e.target.value})}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dashboard View */}
            {activeView === 'dashboard' && (
              <>
                {/* Cards de resumen */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-600">Productos</h3>
                      <Package className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
                    <p className="text-xs text-gray-500 mt-1">en inventario</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-600">Ingresos</h3>
                      <DollarSign className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${financialData.totalRevenue.toLocaleString("es-ES")}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">ventas totales</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-600">Gastos</h3>
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      ${financialData.totalExpenses.toLocaleString("es-ES")}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">gastos totales</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-600">Utilidad Neta</h3>
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className={`text-2xl font-bold ${financialData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${financialData.netProfit.toLocaleString("es-ES")}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {financialData.profitMargin.toFixed(1)}% margen
                    </p>
                  </div>
                </div>

                {/* Gráfico de tendencias */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis Financiero Diario</h3>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={financialData.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} />
                        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} 
                               tickFormatter={(value) => `$${value.toLocaleString()}`} />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                        <Legend />
                        <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos" />
                        <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} name="Gastos" />
                        <Line type="monotone" dataKey="utilidad" stroke="#6366f1" strokeWidth={2} name="Utilidad" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {/* Balance General */}
            {activeView === 'balance' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Activos</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Efectivo (Ingresos)</span>
                      <span className="font-semibold">${financialData.totalRevenue.toLocaleString("es-ES")}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Inventario</span>
                      <span className="font-semibold">{totalProducts} productos</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-lg border-t-2">
                      <span>Total Activos</span>
                      <span>${financialData.totalRevenue.toLocaleString("es-ES")}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pasivos y Patrimonio</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Gastos Operativos</span>
                      <span className="font-semibold text-red-600">${financialData.totalExpenses.toLocaleString("es-ES")}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Patrimonio Neto</span>
                      <span className={`font-semibold ${financialData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${financialData.netProfit.toLocaleString("es-ES")}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-lg border-t-2">
                      <span>Total Pasivos + Patrimonio</span>
                      <span>${financialData.totalRevenue.toLocaleString("es-ES")}</span>
                    </div>
                  </div>
                </div>

                {/* Gráfico de gastos por proveedor */}
                {financialData.expensesByCategory.length > 0 && (
                  <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Proveedor</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={financialData.expensesByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {financialData.expensesByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Estado de Pérdidas y Ganancias */}
            {activeView === 'pyg' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Estado de Resultados</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-lg font-medium text-gray-700">Ingresos por Ventas</span>
                    <span className="text-lg font-bold text-green-600">
                      ${financialData.totalRevenue.toLocaleString("es-ES")}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-lg font-medium text-gray-700">(-) Costos y Gastos Operativos</span>
                    <span className="text-lg font-bold text-red-600">
                      ${financialData.totalExpenses.toLocaleString("es-ES")}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-t-2 border-gray-300">
                    <span className="text-xl font-bold text-gray-900">Utilidad Neta</span>
                    <span className={`text-xl font-bold ${financialData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${financialData.netProfit.toLocaleString("es-ES")}
                    </span>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Indicadores Financieros</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {financialData.profitMargin.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Margen de Utilidad</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {financialData.totalRevenue > 0 ? ((financialData.totalExpenses / financialData.totalRevenue) * 100).toFixed(1) : 0}%
                        </div>
                        <div className="text-sm text-gray-600">Ratio de Gastos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">
                          {salesData.length + billsData.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Transacciones</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gráfico comparativo */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Comparativo Ingresos vs Gastos</h4>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialData.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        <Legend />
                        <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" />
                        <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardResume;