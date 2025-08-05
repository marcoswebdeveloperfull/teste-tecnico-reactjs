import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { sendPaymentReturn } from "../../api/api";
import "./Payment.css";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [creditCardInfo, setCreditCardInfo] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [pixKey, setPixKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [pixCopiaEColaLink, setPixCopiaEColaLink] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  
  const order = location.state?.order || {
    totalValue: 0,
    orderId: "",
    items: [],
  };
  const { totalValue, orderId, items } = order;

  const generateFictitiousPixLink = (value) => {
    const baseLink = "pix.saurus.com.br/pagar?txid=";
    const randomTxid =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    return `${baseLink}${randomTxid}&valor=${value
      .toFixed(2)
      .replace(".", ",")}`;
  };

  const handlePayment = async () => {
    setLoading(true);
    setPaymentError(null);
    setCopySuccess("");

    let paymentData = {
      paymentMethod,
      totalValue,
      orderId,
    };

    if (paymentMethod === "credito / debito") {
      paymentData = { ...paymentData, ...creditCardInfo };
    } else if (paymentMethod === "pix") {
      paymentData = { ...paymentData, pixKey };
    } else if (paymentMethod === "link") {
      paymentData = { ...paymentData, pixLink: pixCopiaEColaLink };
    }

    try {
      const response = await sendPaymentReturn(paymentData);

      if (response.data.status === "success") {
        navigate("/status-pagamento", {
          state: { paymentMethod, status: "approved", order },
        });
      } else {
        setPaymentError(response.data.message || "Pagamento não aprovado.");
      }
    } catch (error) {
      console.error("Erro ao processar o pagamento:", error);
      setPaymentError(
        "Ocorreu um erro ao processar seu pagamento. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (!paymentMethod) return false;

    if (paymentMethod === "link") {
      return pixCopiaEColaLink.length > 0;
    }

    if (paymentMethod === "credito / debito") {
      const { number, expiry, cvv } = creditCardInfo;
      return (
        number.replace(/\D/g, "").length === 16 &&
        expiry.length === 5 &&
        (cvv.length === 3 || cvv.length === 4)
      );
    }

    if (paymentMethod === "pix") {
      return pixKey.trim().length > 0;
    }

    return false;
  };

  const handleCopyPixLink = () => {
    if (pixCopiaEColaLink) {
      try {
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = pixCopiaEColaLink;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextArea);
        setCopySuccess("Link copiado!");
        setTimeout(() => setCopySuccess(""), 2000);
      } catch (err) {
        console.error("Falha ao copiar o texto:", err);
        setCopySuccess("Erro ao copiar o link.");
      }
    }
  };

  useEffect(() => {
    if (paymentMethod === "link" && totalValue > 0) {
      setPixCopiaEColaLink(generateFictitiousPixLink(totalValue));
    } else {
      setPixCopiaEColaLink("");
    }
    setCopySuccess("");
  }, [paymentMethod, totalValue]);

  return (
    <div className="payment-container">
      <Header title="Pagamento" />
      <div className="payment-content">

        <div className="order-details-summary">
          <h3>Detalhes do Pedido</h3>
          <p>
            <strong>Número do Pedido:</strong> {orderId || "N/A"}
          </p>
          <h4>Itens:</h4>
          <ul className="order-items-list">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <li key={index}>
                  {item.quantity}x {item.name} - R${" "}
                  {(item.price * item.quantity).toFixed(2)}
                </li>
              ))
            ) : (
              <li>Nenhum item no pedido.</li>
            )}
          </ul>
        </div>

        <div className="payment-summary">
          <p>Valor Total:</p>
          <p className="total-value">R$ {totalValue.toFixed(2)}</p>
        </div>

        <div className="payment-methods">
          <h3>Selecione a forma de pagamento:</h3>
          <div className="method-buttons">
            <button
              className={`method-button ${
                paymentMethod === "credito / debito" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("credito / debito")}
            >
              <i className="fas fa-credit-card"></i> Crédito / Débito
            </button>
            <button
              className={`method-button ${
                paymentMethod === "link" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("link")}
            >
              <i className="fas fa-link"></i> Link
            </button>
            <button
              className={`method-button ${
                paymentMethod === "pix" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("pix")}
            >
              <i className="fas fa-qrcode"></i> PIX
            </button>
          </div>
        </div>

        {paymentMethod === "credito / debito" ? (
          <div className="card-info">
            <Input
              label="Número do Cartão"
              placeholder="0000 0000 0000 0000"
              value={creditCardInfo.number}
              onChange={(e) =>
                setCreditCardInfo({ ...creditCardInfo, number: e.target.value })
              }
            />
            <div className="card-row">
              <Input
                label="Validade (MM/AA)"
                placeholder="MM/AA"
                value={creditCardInfo.expiry}
                onChange={(e) =>
                  setCreditCardInfo({
                    ...creditCardInfo,
                    expiry: e.target.value,
                  })
                }
              />
              <Input
                label="CVV"
                type="password"
                placeholder="XXX"
                value={creditCardInfo.cvv}
                onChange={(e) =>
                  setCreditCardInfo({ ...creditCardInfo, cvv: e.target.value })
                }
              />
            </div>
          </div>
        ) : null}

        {paymentMethod === "link" && pixCopiaEColaLink ? (
          <div className="pix-link-info">
            <label>Link PIX Copia e Cola:</label>
            <div className="pix-link-display">
              <textarea
                readOnly
                value={pixCopiaEColaLink}
                onClick={(e) => {
                  e.target.select();
                  setCopySuccess("");
                }}
                style={{
                  width: "95%",
                  resize: "vertical",
                  minHeight: "50px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "0.9rem",
                }}
              />
              <Button
                onClick={handleCopyPixLink}
                fullWidth={false}
                style={{ marginTop: "10px" }}
              >
                Copiar <i className="fas fa-copy"></i>
              </Button>
              {copySuccess && (
                <p
                  style={{
                    color: "green",
                    fontSize: "0.9rem",
                    marginTop: "5px",
                  }}
                >
                  {copySuccess}
                </p>
              )}
            </div>
          </div>
        ) : null}

        {paymentMethod === "pix" ? (
          <div className="pix-info">
            <Input
              label="Chave PIX"
              placeholder="Digite a chave PIX"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
            />
          </div>
        ) : null}

        {paymentError && (
          <p
            className="error-message"
            style={{ color: "red", textAlign: "center", marginTop: "15px" }}
          >
            {paymentError}
          </p>
        )}
      </div>

      <div className="payment-footer">
        <Button onClick={handlePayment} disabled={!isFormValid() || loading}>
          {loading ? "Processando..." : "Pagar"}
        </Button>
      </div>
    </div>
  );
};

export default Payment;