import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { sendPaymentReturn } from '../../api/api';
import './PaymentStatus.css';

const PaymentStatus = () => {
  const [status, setStatus] = useState('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePayment = async () => {
      const { paymentMethod } = location.state || {};

      if (!paymentMethod) {
        setStatus('error');
        setErrorMessage('Dados de pagamento não encontrados.');
        return;
      }

      try {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const paymentData = {
          orderId: 'algum-id-de-pedido',
          paymentMethod,
          value: 123.45,
        };

        const response = await sendPaymentReturn(paymentData);

        if (response.data.status === 'success') {
          setStatus('approved');
          const timer = setTimeout(() => {
            navigate('/pedidos');
          }, 2000);
          return () => clearTimeout(timer);
        } else {
          setStatus('error');
          setErrorMessage('O pagamento não foi aprovado.');
        }

      } catch (error) {
        console.error('Erro ao processar o pagamento:', error);
        setStatus('error');
        setErrorMessage('Ocorreu um erro ao processar seu pagamento. Tente novamente.');
      }
    };

    handlePayment();
  }, [navigate, location.state]);

  const renderStatusContent = () => {
    if (status === 'pending') {
      return (
        <div className="status-pending">
          <div className="spinner"></div>
          <p>Aguardando o Pagamento</p>
        </div>
      );
    }

    if (status === 'approved') {
      return (
        <div className="status-approved">
          <div className="checkmark-container">
            <div className="checkmark"></div>
          </div>
          <p>Pagamento Aprovado</p>
        </div>
      );
    }
    
    if (status === 'error') {
      return (
        <div className="status-error">
          <div className="error-icon">❌</div>
          <p>Erro no Pagamento</p>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      );
    }
  };

  return (
    <div className="payment-status-container">
      <Header title="Pagamento" />
      <div className="status-content">
        {renderStatusContent()}
      </div>
    </div>
  );
};

export default PaymentStatus;