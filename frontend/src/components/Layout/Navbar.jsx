import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-white text-xl font-bold">
            💪 Workout Logger
          </Link>
          
          <div className="flex items-center space-x-6">
            {token ? (
              <>
                <Link 
                  to="/" 
                  className={`text-white hover:text-blue-200 transition-colors ${
                    isActive('/') ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/workouts" 
                  className={`text-white hover:text-blue-200 transition-colors ${
                    isActive('/workouts') ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Workouts
                </Link>
                <Link 
                  to="/chatbot" 
                  className={`text-white hover:text-blue-200 transition-colors ${
                    isActive('/chatbot') ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Fitness Bot
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-white">Hello, {user.username}!</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;