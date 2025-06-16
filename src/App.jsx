import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import InventoryPage from "./pages/InventoryPage";
import NotFoundPage from "./utils/NotFoundPage";
import BillPage from "./pages/BillPage";

const routes = [
  { path: "/", element: <LoginPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/inventario", element: <InventoryPage /> },
  { path: "/facturacion", element: <BillPage /> },
  { path: "*", element: <NotFoundPage /> }
];

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
