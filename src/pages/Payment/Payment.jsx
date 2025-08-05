import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { sendPaymentReturn } from '../../api/api'; // Importa a função da API
import './Payment.css';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [creditCardInfo, setCreditCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });
  const [pixKey, setPixKey] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [paymentError, setPaymentError] = useState(null); // Estado para erros de pagamento
  const [pixCopiaEColaLink, setPixCopiaEColaLink] = useState(''); // NOVO: Estado para o link Pix Copia e Cola
  const [copySuccess, setCopySuccess] = useState(''); // NOVO: Estado para mensagem de sucesso ao copiar

  const navigate = useNavigate();
  const location = useLocation();
  const { totalValue } = location.state || { totalValue: 0 };

  // Função para gerar um link PIX fictício
  const generateFictitiousPixLink = (value) => {
    // Exemplo de link PIX fictício. Em uma aplicação real, isso viria do backend.
    const baseLink = "pix.saurus.com.br/pagar?txid=";
    const randomTxid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return `${baseLink}${randomTxid}&valor=${value.toFixed(2).replace('.', ',')}`;
  };

  const handlePayment = async () => {
    setLoading(true);
    setPaymentError(null); // Limpa erros anteriores
    setCopySuccess(''); // Limpa mensagem de sucesso ao copiar

    // Prepara os dados do pagamento para enviar à API
    let paymentData = {
      paymentMethod,
      totalValue,
      // Você pode adicionar um orderId ou uma lista de orderIds aqui, se necessário
      // orderId: 'algum-id-gerado-ou-passado', 
    };

    if (paymentMethod === 'credito / debito') {
      paymentData = { ...paymentData, ...creditCardInfo };
    } else if (paymentMethod === 'pix') {
      paymentData = { ...paymentData, pixKey };
    } else if (paymentMethod === 'link') { // Inclui o link gerado se for o caso
      paymentData = { ...paymentData, pixLink: pixCopiaEColaLink };
    }

    try {
      // Chama a função da API para enviar o retorno do pagamento
      const response = await sendPaymentReturn(paymentData);

      if (response.data.status === 'success') {
        // Navega para a tela de status de pagamento com sucesso
        navigate('/status-pagamento', { state: { paymentMethod: paymentMethod, status: 'approved' } });
      } else {
        // Se a API retornar um status diferente de sucesso
        setPaymentError(response.data.message || 'Pagamento não aprovado.');
      }
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      setPaymentError('Ocorreu um erro ao processar seu pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (!paymentMethod) return false; // Nenhuma forma de pagamento selecionada

    // Link agora exige que o link tenha sido gerado
    if (paymentMethod === 'link') {
      return pixCopiaEColaLink.length > 0;
    }

    if (paymentMethod === 'credito / debito') { 
      const { number, expiry, cvv } = creditCardInfo;
      return (
        number.replace(/\D/g, '').length === 16 && 
        expiry.length === 5 && 
        (cvv.length === 3 || cvv.length === 4)
      );
    }

    // Validação para PIX
    if (paymentMethod === 'pix') {
      return pixKey.trim().length > 0; 
    }

    return false;
  };

  // Função para copiar o link para a área de transferência
  const handleCopyPixLink = () => {
    if (pixCopiaEColaLink) {
      try {
        // Cria um elemento de texto temporário para copiar o conteúdo
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = pixCopiaEColaLink;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        
        setCopySuccess('Link copiado!');
        setTimeout(() => setCopySuccess(''), 2000); // Limpa a mensagem após 2 segundos
      } catch (err) {
        console.error('Falha ao copiar o texto:', err);
        setCopySuccess('Erro ao copiar o link.');
      }
    }
  };

  // Efeito para gerar o link quando o método "link" é selecionado
  useEffect(() => {
    if (paymentMethod === 'link' && totalValue > 0) {
      setPixCopiaEColaLink(generateFictitiousPixLink(totalValue));
    } else {
      setPixCopiaEColaLink('');
    }
    setCopySuccess(''); // Limpa a mensagem de cópia ao mudar o método
  }, [paymentMethod, totalValue]);


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
              className={`method-button ${paymentMethod === 'credito / debito' ? 'selected' : ''}`} 
              onClick={() => setPaymentMethod('credito / debito')} 
            >
              <i className="fas fa-credit-card"></i> Crédito / Débito 
            </button>
            <button
              className={`method-button ${paymentMethod === 'link' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('link')}
            >
              <i className="fas fa-link"></i> Link {/* Ícone Font Awesome */}
            </button>
            <button
              className={`method-button ${paymentMethod === 'pix' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('pix')}
            >
              <i className="fas fa-qrcode"></i> PIX 
            </button>
          </div>
        </div>

        {paymentMethod === 'credito / debito' ? ( 
          <div className="card-info">
            <Input
              
              label="Número do Cartão"
              placeholder="0000 0000 0000 0000"
              value={creditCardInfo.number}
              onChange={(e) => setCreditCardInfo({ ...creditCardInfo, number: e.target.value })}
            />
            <div className="card-row">
              <Input
                
                label="Validade (MM/AA)"
                placeholder="MM/AA"
                value={creditCardInfo.expiry}
                onChange={(e) => setCreditCardInfo({ ...creditCardInfo, expiry: e.target.value })}
              />
              <Input
                label="CVV"
                type="password"
                placeholder="XXX"
                value={creditCardInfo.cvv}
                onChange={(e) => setCreditCardInfo({ ...creditCardInfo, cvv: e.target.value })}
              />
            </div>
          </div>
        ) : null}

        {/* NOVO: Renderiza o link Pix Copia e Cola se 'link' for selecionado */}
        {paymentMethod === 'link' && pixCopiaEColaLink ? (
          <div className="pix-link-info">
            <label>Link PIX Copia e Cola:</label>
            <div className="pix-link-display">
              <textarea
                readOnly
                value={pixCopiaEColaLink}
                onClick={(e) => { // Seleciona o texto ao clicar na área
                  e.target.select();
                  setCopySuccess(''); // Limpa a mensagem de sucesso ao selecionar
                }}
                style={{ width: '95%', resize: 'vertical', minHeight: '50px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '0.9rem' }}
              />
              <Button onClick={handleCopyPixLink} fullWidth={false} style={{ marginTop: '10px' }}>
                Copiar <i className="fas fa-copy"></i>
              </Button>
              {copySuccess && <p style={{ color: 'green', fontSize: '0.9rem', marginTop: '5px' }}>{copySuccess}</p>}
            </div>
          </div>
        ) : null}

        {paymentMethod === 'pix' ? (
          <div className="pix-info">
            <Input
              label="Chave PIX"
              placeholder="Digite a chave PIX"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
            />
          </div>
        ) : null}

        {paymentError && <p className="error-message" style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}>{paymentError}</p>}
      </div>

      <div className="payment-footer">
        <Button onClick={handlePayment} disabled={!isFormValid() || loading}>
          {loading ? 'Processando...' : 'Pagar'}
        </Button>
      </div>
    </div>
  );
};

export default Payment;