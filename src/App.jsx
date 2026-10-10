import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ExploreDestinationsPage from './pages/ExploreDestinationsPage';
import BuildMyTripPage from './pages/BuildMyTripPage';
import ComparePackagesPage from './pages/ComparePackagesPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import MyTripsPage from './pages/MyTripsPage';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content-area">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExploreDestinationsPage />} />
          <Route path="/build-my-trip" element={<BuildMyTripPage />} />
          <Route path="/compare-packages" element={<ComparePackagesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          {/* Fallback to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
