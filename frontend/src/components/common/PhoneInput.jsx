import React from 'react';
import Input from './Input';

const PhoneInput = ({ value, onChange, error, ...props }) => {
  const formatPhone = (input) => {
    if (!input) return '';
    
    // Remove tudo que não é número
    const numbers = input.replace(/\D/g, '');
    
    // Aplica máscara baseada no tamanho
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };
  
  const handleChange = (e) => {
    const formatted = formatPhone(e.target.value);
    
    // Limitar o tamanho máximo
    if (formatted.length <= 15) {
      onChange(formatted);
    }
  };
  
  const handleKeyDown = (e) => {
    // Permitir teclas de navegação e controle
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'Ctrl', 'Meta', 'Alt'
    ];
    
    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) {
      return;
    }
    
    // Permitir apenas números e teclas de controle
    if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };
  
  return (
    <Input
      {...props}
      type="tel"
      value={value || ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="(83) 99999-9999"
      maxLength={15}
      error={error}
      autoComplete="tel"
    />
  );
};

export default PhoneInput;