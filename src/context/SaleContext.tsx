// context/SaleContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Sale, SaleContextType } from "../types/SaleTypes";

const SaleContext = createContext<SaleContextType | null>(null);

export const SaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sales");
      const data = await response.json();
      setSales(data);
    } catch (err) {
      setError("Error al cargar las ventas");
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (sale: Omit<Sale, "_id" | "date">) => {
    try {
      // Registrar la venta
      const response = await fetch("https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/sales/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sale),
      });
      const newSale = await response.json();
      setSales((prev) => [...prev, newSale]);

      // Actualizar el stock de los productos
      await fetch("https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/products/update-stock", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: sale.products }),
      });
    } catch (err) {
      setError("Error al registrar la venta");
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <SaleContext.Provider
      value={{ sales, loading, error, addSale, fetchSales }}
    >
      {children}
    </SaleContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SaleContext);
  if (!context) {
    throw new Error("useSales debe ser usado dentro de un SaleProvider");
  }
  return context;
};
