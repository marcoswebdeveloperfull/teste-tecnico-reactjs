import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <button onClick={() => navigate(-1)} className="back-button">
        &lt;
      </button>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;