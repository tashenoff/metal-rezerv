// components/Input.js
import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, className = '', required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`input input-bordered w-full ${className}`}
      />
    </div>
  );
};

export default Input;
