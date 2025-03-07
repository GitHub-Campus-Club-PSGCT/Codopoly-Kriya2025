import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuctionManagement from './pages/AuctionManagement';
import POCDistribution from './pages/POCDistribution';
import Settings from './pages/Settings';
import Leaderboards from './pages/LeaderBoards';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="auction" element={<AuctionManagement />} />
          <Route path="poc-distribution" element={<POCDistribution />} />
          <Route path="settings" element={<Settings />} />
          <Route path="leaderboard" element={<Leaderboards/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;