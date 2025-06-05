import React, { useState, useEffect } from 'react';
import { FiHome, FiEdit, FiSearch, FiBook } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeComponent, setActiveComponent] = useState('welcome');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') {
      setActiveComponent('welcome');
    } else if (path.includes('/dashboard/create')) {
      setActiveComponent('create');
    } else if (path.includes('/dashboard/filter')) {
      setActiveComponent('filter');
    } else if (path.includes('/dashboard/my-questions')) {
      setActiveComponent('my-questions');
    }
  }, [location.pathname]);

  const handleNavClick = (component, path) => {
    setActiveComponent(component);
    navigate(path);
  };

  const renderWelcome = () => (
    <div className="p-8 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Welcome, {user?.username || 'User'} 👋
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Select an option from the navigation bar to begin.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          onClick={() => handleNavClick('create', '/dashboard/create')}
          className="bg-white/30 dark:bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer"
        >
          <FiEdit className="text-4xl text-pink-800 dark:text-pink-300 mb-3" />
          <h2 className="text-2xl font-bold text-pink-900 dark:text-pink-200 mb-2">Create Question</h2>
          <p className="text-pink-800 dark:text-pink-300 text-sm">
            Contribute by creating new test questions.
          </p>
        </div>
        <div
          onClick={() => handleNavClick('filter', '/dashboard/filter')}
          className="bg-white/30 dark:bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer"
        >
          <FiSearch className="text-4xl text-indigo-800 dark:text-indigo-300 mb-3" />
          <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 mb-2">Filter Questions</h2>
          <p className="text-indigo-800 dark:text-indigo-300 text-sm">
            Find and practice questions by category, subject, or topic.
          </p>
        </div>
        <div
          onClick={() => handleNavClick('my-questions', '/dashboard/my-questions')}
          className="bg-white/30 dark:bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer"
        >
          <FiBook className="text-4xl text-teal-800 dark:text-teal-300 mb-3" />
          <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200 mb-2">My Questions</h2>
          <p className="text-teal-800 dark:text-teal-300 text-sm">
            View all questions you’ve created.
          </p>
        </div>
      </div>
    </div>
  );

  const shouldShowWelcome = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  return (
    <div className="relative min-h-screen">
      <header className="relative z-10 bg-blue-900 dark:bg-blue-950 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-extrabold tracking-wide">Synapaxon</h1>
            <div className="flex items-center gap-3">
              <nav className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => handleNavClick('welcome', '/dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-transform transform hover:scale-105 ${activeComponent === 'welcome' ? 'bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-300 font-semibold shadow' : 'bg-blue-700 dark:bg-blue-800 hover:bg-blue-600 dark:hover:bg-blue-700 text-white'}`}
                >
                  <FiHome className="text-lg" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('create', '/dashboard/create')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-transform transform hover:scale-105 ${activeComponent === 'create' ? 'bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-300 font-semibold shadow' : 'bg-blue-700 dark:bg-blue-800 hover:bg-blue-600 dark:hover:bg-blue-700 text-white'}`}
                >
                  <FiEdit className="text-lg" />
                  Create Question
                </button>
                <button
                  onClick={() => handleNavClick('filter', '/dashboard/filter')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-transform transform hover:scale-105 ${activeComponent === 'filter' ? 'bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-300 font-semibold shadow' : 'bg-blue-700 dark:bg-blue-800 hover:bg-blue-600 dark:hover:bg-blue-700 text-white'}`}
                >
                  <FiSearch className="text-lg" />
                  Filter Questions
                </button>
                <button
                  onClick={() => handleNavClick('my-questions', '/dashboard/my-questions')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-transform transform hover:scale-105 ${activeComponent === 'my-questions' ? 'bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-300 font-semibold shadow' : 'bg-blue-700 dark:bg-blue-800 hover:bg-blue-600 dark:hover:bg-blue-700 text-white'}`}
                >
                  <FiBook className="text-lg" />
                  My Questions
                </button>
              </nav>
              <button
                onClick={toggleTheme}
                className={`relative inline-block w-12 h-6 rounded-full transition-all duration-300 bg-gradient-to-r ${theme === 'dark' ? 'from-gray-200 to-gray-800 bg-right' : 'from-gray-200 to-gray-800 bg-left'}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 bg-gradient-to-r ${theme === 'dark' ? 'left-[calc(100%-1.25rem-0.125rem)] from-gray-200 to-gray-800 bg-left' : 'left-0.5 from-gray-200 to-gray-800 bg-right'}`}
                ></span>
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-500 transition shadow"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="bg-white/30 dark:bg-black/30 backdrop-blur-md p-8 rounded-lg">
          {shouldShowWelcome ? renderWelcome() : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;