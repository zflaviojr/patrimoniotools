import React, { useState, forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  help,
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'medium',
  variant = 'default',
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  type = 'text',
  placeholder = '',
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  // Classes base do input
  const baseClasses = 'border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variações de tamanho
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-3 py-2 text-sm',
    large: 'px-4 py-3 text-base',
  };

  // Variações de estilo
  const variants = {
    default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500',
    warning: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
  };

  // Determinar variação baseada no erro
  const currentVariant = error ? 'error' : variant;

  // Classes para ícones
  const iconClasses = 'absolute inset-y-0 flex items-center pointer-events-none';
  const leftIconClasses = `${iconClasses} left-0 pl-3`;
  const rightIconClasses = `${iconClasses} right-0 pr-3`;

  // Padding para ícones
  const leftPadding = leftIcon ? 'pl-10' : '';
  const rightPadding = rightIcon || type === 'password' ? 'pr-10' : '';

  // Largura
  const widthClass = fullWidth ? 'w-full' : '';

  // Combinar classes do input
  const inputClasses = `
    ${baseClasses}
    ${variants[currentVariant]}
    ${sizes[size]}
    ${leftPadding}
    ${rightPadding}
    ${widthClass}
    ${className}
  `.trim();

  // Tipo do input (para senha com toggle)
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Container do input */}
      <div className="relative">
        {/* Ícone esquerdo */}
        {leftIcon && (
          <div className={leftIconClasses}>
            <span className="text-gray-400">
              {leftIcon}
            </span>
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />

        {/* Ícone direito ou toggle de senha */}
        {type === 'password' ? (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {showPassword ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              )}
            </svg>
          </button>
        ) : rightIcon ? (
          <div className={rightIconClasses}>
            <span className="text-gray-400">
              {rightIcon}
            </span>
          </div>
        ) : null}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Texto de ajuda */}
      {help && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {help}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Componente para textarea
export const Textarea = forwardRef(({ 
  label,
  error,
  help,
  required = false,
  disabled = false,
  fullWidth = true,
  rows = 3,
  resize = 'vertical',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  // Classes base
  const baseClasses = 'border border-gray-300 rounded-md px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';

  // Classe de resize
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  // Determinar variação baseada no erro
  const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';

  // Largura
  const widthClass = fullWidth ? 'w-full' : '';

  // Combinar classes
  const textareaClasses = `
    ${baseClasses}
    ${resizeClasses[resize]}
    ${errorClasses}
    ${widthClass}
    ${className}
  `.trim();

  return (
    <div className={containerClassName}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        ref={ref}
        rows={rows}
        className={textareaClasses}
        disabled={disabled}
        {...props}
      />

      {/* Mensagem de erro */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Texto de ajuda */}
      {help && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {help}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Componente para select
export const Select = forwardRef(({ 
  label,
  error,
  help,
  required = false,
  disabled = false,
  fullWidth = true,
  children,
  placeholder = 'Selecione uma opção',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  // Classes base
  const baseClasses = 'border border-gray-300 rounded-md px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white';

  // Determinar variação baseada no erro
  const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';

  // Largura
  const widthClass = fullWidth ? 'w-full' : '';

  // Combinar classes
  const selectClasses = `
    ${baseClasses}
    ${errorClasses}
    ${widthClass}
    ${className}
  `.trim();

  return (
    <div className={containerClassName}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select */}
      <select
        ref={ref}
        className={selectClasses}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}
        {children}
      </select>

      {/* Mensagem de erro */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Texto de ajuda */}
      {help && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {help}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// Componente para group de inputs
export const InputGroup = ({ 
  children, 
  className = '',
  orientation = 'vertical',
  spacing = 'default',
  ...props 
}) => {
  const orientationClasses = {
    horizontal: 'flex',
    vertical: 'space-y-4',
  };

  const spacingClasses = {
    tight: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    default: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
    loose: orientation === 'horizontal' ? 'space-x-6' : 'space-y-6',
  };

  return (
    <div 
      className={`
        ${orientationClasses[orientation]}
        ${spacingClasses[spacing]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Input;