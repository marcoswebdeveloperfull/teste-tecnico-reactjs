import React from 'react';
import './Button.css';

const Button = ({ children, onClick, disabled = false, fullWidth = true }) => {
  return (
    <button
      className={`button ${fullWidth ? 'button-full-width' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;