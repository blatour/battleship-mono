import React from 'react';
import './Headers.css';

const Headers = ({ title, subtitle }) => {
  return (
    <header className="header">
      <h1 className="title">{title}</h1>
      {subtitle && <h2 className="subtitle">{subtitle}</h2>}
    </header>
  );
};

export default Headers;
