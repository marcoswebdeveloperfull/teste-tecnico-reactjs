import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './Login.css';

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [cnpjCpf, setCnpjCpf] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(user, password);
    if (success) {
      navigate('/pedidos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-card">
        <Input
          label="Aplicação"
          placeholder="RETAGUARDA  APP (PROD)"
          value="RETAGUARDA  APP (PROD)"
          readOnly
        />
        <Input
          label="Id Usuário"
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="checkbox-container">
          <input type="checkbox" id="production" defaultChecked />
          <label htmlFor="production">Ambiente de Produção</label>
        </div>
        {error && <p className="error-message">{error}</p>}
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? 'Acessando...' : 'Acessar'}
        </Button>
      </div>
    </div>
  );
};

export default Login;