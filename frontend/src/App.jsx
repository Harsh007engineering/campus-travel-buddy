import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile'; // 1. WE IMPORTED IT HERE
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#110c2e] via-[#0b0914] to-[#05040a] text-slate-200 font-sans">
        <Toaster position="top-center" reverseOrder={false} toastOptions={{
          style: { background: '#1e1b4b', color: '#fff', border: '1px solid #3730a3' }
        }} /> 
        
        <Navbar /> 
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
                <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4">
                  Share the ride.<br/>Split the cost.
                </h1>
                <p className="text-xl text-purple-200/60 mb-8 max-w-2xl">
                  The exclusive, secure carpooling network for campus students.
                </p>
                <div className="flex gap-4">
                  <a href="/signup" className="px-8 py-3 bg-brand text-white font-medium rounded-full hover:bg-purple-500 transition shadow-lg shadow-brand/20">Get Started</a>
                  <a href="/login" className="px-8 py-3 bg-[#1a1635] text-white font-medium rounded-full border border-purple-900/50 hover:bg-[#251f47] transition">Login</a>
                </div>
              </div>
            } />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            {/* 2. WE ADDED THE ROUTE HERE */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;