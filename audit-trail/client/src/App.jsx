import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ShipmentDetail from './pages/ShipmentDetail';
import Shipments from './pages/Shipments';
import NotFound from './pages/NotFound';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/shipment/:id" element={<ShipmentDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
