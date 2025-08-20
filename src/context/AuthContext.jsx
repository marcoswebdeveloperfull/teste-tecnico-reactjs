import { createContext, useContext, useState } from 'react';
import { login as apiLogin } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
60
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (user, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiLogin(user, password);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciais inválidas. Tente novamente.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};