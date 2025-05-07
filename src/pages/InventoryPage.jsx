import React from "react";
import Header from "../components/Header/Header";
import InventoryTable from "../components/Inventory/InventoryTable";
import Footer from "../components/Footer/Footer";
import { ProductProvider } from "../context/ProductContext";
import ProductGrid from "../components/Inventory/ProductGrid";
import { SaleProvider } from "../context/SaleContext";

const InventoryPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <ProductProvider>
          <SaleProvider>
            <ProductGrid />
          </SaleProvider>
        </ProductProvider>
      </main>

      <Footer />
    </div>
  );
};

export default InventoryPage;
