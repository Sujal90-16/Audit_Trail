import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ShipmentDetail from './pages/ShipmentDetail';
import Shipments from './pages/Shipments';
import TimelinePage from './pages/TimelinePage';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import HelpPage from './pages/HelpPage';
import NotFound from './pages/NotFound';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ErrorBoundary from './components/ErrorBoundary';
import KeyboardShortcuts from './components/KeyboardShortcuts';

function App() {
  return (
    <ErrorBoundary>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <TopBar />
          <KeyboardShortcuts />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/shipment/:id" element={<ShipmentDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
