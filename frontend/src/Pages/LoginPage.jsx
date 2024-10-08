import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [error, setError] = useState('');
  const [needsInitialBalance, setNeedsInitialBalance] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password }, { withCredentials: true });
      localStorage.setItem('token', response.data.token);
      
      if (response.data.needsInitialBalance) {
        setNeedsInitialBalance(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Si è verificato un errore durante il login');
    }
  };

  const handleSetInitialBalance = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/set-initial-balance`, 
        { initialBalance: parseFloat(initialBalance) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Si è verificato un errore durante l\'impostazione del bilancio iniziale');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  if (needsInitialBalance) {
    return (
      <div className="min-h-screen bg-[#001845] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Imposta il bilancio iniziale</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSetInitialBalance} className="space-y-4">
            <div>
              <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700">Bilancio iniziale</label>
              <input
                type="number"
                id="initialBalance"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <button type="submit" className="w-full bg-[#0466C8] text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Imposta bilancio
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001845] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Accedi a Spendix</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          <button type="submit" className="w-full bg-[#0466C8] text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Accedi
          </button>
        </form>
        <button onClick={handleGoogleLogin} className="mt-4 w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
          Accedi con Google
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Non hai un account? <Link to="/register" className="text-blue-500 hover:text-blue-600">Registrati qui</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;