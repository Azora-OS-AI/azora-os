import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary' }) => (
  <button className={`azora-btn ${variant}`} onClick={onClick}>
    {children}
  </button>
);

export default Button;
