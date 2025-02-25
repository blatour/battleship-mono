import React from 'react';
import './Ship.css';

const Ship = ({ type, length, placed, orientation }) => {
  const shipClass = `ship ${type} ${orientation} ${placed ? 'placed' : ''}`;

  return (
    <div className={shipClass}>
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="ship-cell"></div>
      ))}
    </div>
  );
};

export default Ship;
