import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/master/Dashboard';
import Promoters from './pages/master/Promoters';
import Events from './pages/master/Events';
import Config from './pages/master/Config';
import { MasterLayout } from './layouts/MasterLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Master Panel Routes */}
        <Route path="/master" element={<MasterLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="promotores" element={<Promoters />} />
          <Route path="eventos" element={<Events />} />
          <Route path="config" element={<Config />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
