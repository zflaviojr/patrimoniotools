import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props 
}) => {
  // Classes base do botão
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variações de cor
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    link: 'text-primary-600 hover:text-primary-700 underline focus:ring-primary-500',
  };

  // Tamanhos
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
    xlarge: 'px-8 py-4 text-lg',
  };

  // Largura total
  const widthClass = fullWidth ? 'w-full' : '';

  // Estados de loading e disabled
  const isDisabled = disabled || loading;

  // Combinar classes
  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${widthClass}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {/* Ícone esquerdo ou spinner de loading */}
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      ) : leftIcon ? (
        <span className="mr-2">
          {leftIcon}
        </span>
      ) : null}

      {/* Texto do botão */}
      <span>
        {loading ? 'Carregando...' : children}
      </span>

      {/* Ícone direito */}
      {!loading && rightIcon && (
        <span className="ml-2">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

// Componente para grupo de botões
export const ButtonGroup = ({ 
  children, 
  className = '',
  orientation = 'horizontal',
  ...props 
}) => {
  const orientationClasses = {
    horizontal: 'flex space-x-2',
    vertical: 'flex flex-col space-y-2',
  };

  return (
    <div 
      className={`${orientationClasses[orientation]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Botão com ícone apenas
export const IconButton = ({ 
  icon, 
  size = 'medium',
  variant = 'ghost',
  className = '',
  ...props 
}) => {
  const iconSizes = {
    small: 'p-1',
    medium: 'p-2',
    large: 'p-3',
  };

  return (
    <Button
      variant={variant}
      className={`${iconSizes[size]} ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
};

// Botão de ação flutuante
export const FloatingActionButton = ({ 
  icon, 
  className = '',
  ...props 
}) => (
  <Button
    variant="primary"
    className={`
      fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg hover:shadow-xl
      transform hover:scale-105 active:scale-95 z-50
      ${className}
    `}
    {...props}
  >
    {icon}
  </Button>
);

// Botão de confirmação com modal
export const ConfirmButton = ({ 
  onConfirm,
  confirmText = 'Tem certeza?',
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  children,
  ...props 
}) => {
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onConfirm();
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <Button onClick={handleClick} {...props}>
        {children}
      </Button>
      
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <p className="text-gray-900 mb-4">{confirmText}</p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={handleCancel}>
                {cancelButtonText}
              </Button>
              <Button variant="danger" onClick={handleConfirm}>
                {confirmButtonText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Button;