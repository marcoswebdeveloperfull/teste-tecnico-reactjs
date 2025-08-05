import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './Payment.css';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [creditCardInfo, setCreditCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });
  const [pixKey, setPixKey] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { totalValue } = location.state || { totalValue: 0 };

  const handlePayment = () => {
    navigate('/status-pagamento', { state: { paymentMethod } });
  };

  const isFormValid = () => {
    if (!paymentMethod) return false;
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      const { number, expiry, cvv } = creditCardInfo;
      return number.length > 0 && expiry.length > 0 && cvv.length > 0;
    }
    if (paymentMethod === 'pix') {
      return pixKey.length > 0;
    }
    return false;
  };

  return (
    <div className="payment-container">
      <Header title="Pagamento" />
      <div className="payment-content">
        <div className="payment-summary">
          <p>Valor Total:</p>
          <p className="total-value">R$ {totalValue.toFixed(2)}</p>
        </div>

        <div className="payment-methods">
          <h3>Selecione a forma de pagamento:</h3>
          <div className="method-buttons">
            <button
              className={`method-button ${paymentMethod === 'credit' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('credit')}
            >
              Crédito
            </button>
            <button
              className={`method-button ${paymentMethod === 'debit' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('debit')}
            >
              Débito
            </button>
            <button
              className={`method-button ${paymentMethod === 'pix' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('pix')}
            >
              PIX
            </button>
          </div>
        </div>

        {paymentMethod === 'credit' || paymentMethod === 'debit' ? (
          <div className="card-info">
            <Input
              label="Número do Cartão"
              value={creditCardInfo.number}
              onChange={(e) => setCreditCardInfo({ ...creditCardInfo, number: e.target.value })}
            />
            <div className="card-row">
              <Input
                label="Validade"
                value={creditCardInfo.expiry}
                onChange={(e) => setCreditCardInfo({ ...creditCardInfo, expiry: e.target.value })}
              />
              <Input
                label="CVV"
                type="password"
                value={creditCardInfo.cvv}
                onChange={(e) => setCreditCardInfo({ ...creditCardInfo, cvv: e.target.value })}
              />
            </div>
          </div>
        ) : null}

        {paymentMethod === 'pix' ? (
          <div className="pix-info">
            <Input
              label="Chave PIX"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
            />
          </div>
        ) : null}
      </div>

      <div className="payment-footer">
        <Button onClick={handlePayment} disabled={!isFormValid()}>
          Pagar
        </Button>
      </div>
    </div>
  );
};

export default Payment;