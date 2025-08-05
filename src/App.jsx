import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login/Login';
import Orders from './pages/Orders/Orders';
import Payment from './pages/Payment/Payment';
import PaymentStatus from './pages/PaymentStatus/PaymentStatus';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/pedidos"
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />
      <Route
        path="/pagamento/:orderId?"
        element={
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        }
      />
      <Route
        path="/status-pagamento"
        element={
          <PrivateRoute>
            <PaymentStatus />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;