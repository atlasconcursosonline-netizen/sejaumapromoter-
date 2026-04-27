import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Promoters from './pages/master/Promoters';
import { MasterLayout } from './layouts/MasterLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Master Panel Routes */}
        <Route path="/master" element={<MasterLayout />}>
          <Route index element={<Navigate to="/master/promotores" replace />} />
          <Route path="promotores" element={<Promoters />} />
          <Route path="eventos" element={<div className="p-10 text-center text-slate-500">Módulo de Eventos em desenvolvimento...</div>} />
          <Route path="config" element={<div className="p-10 text-center text-slate-500">Configurações do Painel em desenvolvimento...</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
