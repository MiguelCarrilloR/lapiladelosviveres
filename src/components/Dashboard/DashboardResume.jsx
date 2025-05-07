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
} from "recharts";
import { TrendingUp, Package, DollarSign } from "lucide-react";
import axios from "axios";

function DashboardResume() {
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState(0);
  const [dailyEarnings, setDailyEarnings] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userPassword = localStorage.getItem("userPassword");

    if (!userEmail || !userPassword) {
      navigate("/");
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const productsResponse = await axios.get(
          "https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/products/total"
        );
        setTotalProducts(productsResponse.data.total);

        const salesResponse = await axios.get(
          "https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/sales"
        );
        const salesData = salesResponse.data;

        const earningsByDay = {};
        salesData.forEach(({ totalPrice, date }) => {
          const day = new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          earningsByDay[day] = (earningsByDay[day] || 0) + totalPrice;
        });

        const chartData = Object.entries(earningsByDay).map(
          ([day, earnings]) => ({
            day,
            earnings,
          })
        );
        setDailyEarnings(chartData);

        const totalEarnings = Object.values(earningsByDay).reduce(
          (sum, dailyEarnings) => sum + dailyEarnings,
          0
        );
        setMonthlyEarnings(totalEarnings);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Panel de Control
              </h1>
              <button
                onClick={() => navigate("/inventario")}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow transition-colors duration-150 ease-in-out"
              >
                <Package className="w-4 h-4 mr-2" />
                Ver Inventario
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Card de Productos */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    Productos en Inventario
                  </h3>
                  <Package className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalProducts}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  productos registrados
                </p>
              </div>

              {/* Card de Ganancias Mensuales */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    Ganancias Mensuales
                  </h3>
                  <DollarSign className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${monthlyEarnings.toLocaleString("es-ES")}
                </div>
                <p className="text-xs text-gray-500 mt-1">este mes</p>
              </div>

              {/* Card de Tendencia */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    Tendencia de Ventas
                  </h3>
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {dailyEarnings.length > 0 &&
                    `${(
                      ((dailyEarnings[dailyEarnings.length - 1]?.earnings ||
                        0) /
                        (dailyEarnings[0]?.earnings || 1)) *
                        100 -
                      100
                    ).toFixed(1)}%`}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  comparado con inicio del período
                </p>
              </div>
            </div>

            {/* Gráfico de Ganancias */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ganancias Diarias
              </h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="day"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ fill: "#6366f1" }}
                      name="Ganancias"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardResume;
