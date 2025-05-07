import React from "react";
import Header from "../components/Header/Header";
import DashboardResume from "../components/Dashboard/DashboardResume";
import Footer from "../components/Footer/Footer";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Contenido principal */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <DashboardResume />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardPage;