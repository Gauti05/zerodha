import React from 'react';
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  Link
} from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Portfolio from './components/Portfolio';
import OrderHistory from './components/OrderHistory';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppRouter = process.env.NODE_ENV === 'production' ? HashRouter : BrowserRouter;

const NavbarAndHeader = () => {
  const location = useLocation();
  const path = location.pathname;


  if (path === '/' || path === '/login') {
    return (
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <div className="font-bold text-2xl">ZERODHA</div>
        <Link
          to="/register"
          className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          Register
        </Link>
      </header>
    );
  }

  
  return <Navbar />;
};

function App() {
  return (
    <AppRouter>
      <NavbarAndHeader />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <Routes>
        
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AppRouter>
  );
}

export default App;
