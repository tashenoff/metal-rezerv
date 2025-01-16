// components/Form.js
import React from 'react';

const Form = ({ onSubmit, children, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children} {/* Здесь будут размещаться компоненты инпутов */}
    </form>
  );
};

export default Form;
