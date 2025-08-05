import React from 'react';
import './OrderCard.css';

const OrderCard = ({ order, isSelected, onSelect }) => {
  const handleClick = () => {
    onSelect(order);
  };

  return (
    <div
      className={`order-card-container ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="order-card-checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleClick}
        />
      </div>
      <div className="order-card-details">
        <span>{order.description}</span>
        <span className="order-card-value">R$ {order.value.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderCard;