import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (usuario, senha) => {
  return api.post('/v2/auth', {
    usuario: usuario, 
    senha: senha,
    applicationId: '061f92f5-f2a2-410a-8e2b-b3a28132c258',
  });
};

export const updateOrder = (orderId, newDescription) => {
  return api.put(`/financeiro/faturas/${orderId}`, { description: newDescription });
};

export const getApplications = () => {
  return api.get('/v2/aplicacoes');
};

export const getOrders = () => {
  return api.get('/financeiro/faturas');
};

export const sendPaymentReturn = (data) => {
  return api.post('/financeiro/retorno', data);
};

export default api;
