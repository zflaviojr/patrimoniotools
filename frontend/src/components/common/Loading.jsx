import React from 'react';

const Loading = ({ 
  type = 'spinner',
  size = 'medium',
  color = 'primary',
  fullScreen = false,
  overlay = false,
  text = '',
  className = '',
  ...props 
}) => {
  // Tamanhos
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16',
  };

  // Cores
  const colors = {
    primary: 'border-primary-600',
    secondary: 'border-gray-600',
    white: 'border-white',
    gray: 'border-gray-400',
  };

  // Classes base para o container
  const baseClasses = 'flex items-center justify-center';
  
  // Classes para fullscreen
  const fullScreenClasses = fullScreen ? 'min-h-screen' : '';
  
  // Classes para overlay
  const overlayClasses = overlay ? 'fixed inset-0 bg-black bg-opacity-50 z-50' : '';

  // Combinar classes do container
  const containerClasses = `
    ${baseClasses}
    ${fullScreenClasses}
    ${overlayClasses}
    ${className}
  `.trim();

  // Componente Spinner
  const Spinner = () => (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className={`
          animate-spin rounded-full border-2 border-t-transparent
          ${sizes[size]}
          ${colors[color]}
        `}
      />
      {text && (
        <p className={`text-sm ${overlay || fullScreen ? 'text-white' : 'text-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );

  // Componente Dots
  const Dots = () => (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`
              rounded-full animate-pulse
              ${size === 'small' ? 'h-2 w-2' : size === 'large' ? 'h-4 w-4' : 'h-3 w-3'}
              ${color === 'primary' ? 'bg-primary-600' : 
                color === 'white' ? 'bg-white' : 
                color === 'gray' ? 'bg-gray-400' : 'bg-gray-600'}
            `}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
      {text && (
        <p className={`text-sm ${overlay || fullScreen ? 'text-white' : 'text-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );

  // Componente Bars
  const Bars = () => (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex space-x-1 items-end">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`
              animate-pulse
              ${size === 'small' ? 'w-1 h-4' : size === 'large' ? 'w-2 h-8' : 'w-1.5 h-6'}
              ${color === 'primary' ? 'bg-primary-600' : 
                color === 'white' ? 'bg-white' : 
                color === 'gray' ? 'bg-gray-400' : 'bg-gray-600'}
            `}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
      {text && (
        <p className={`text-sm ${overlay || fullScreen ? 'text-white' : 'text-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );

  // Componente Pulse
  const Pulse = () => (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className={`
          animate-ping rounded-full
          ${sizes[size]}
          ${color === 'primary' ? 'bg-primary-600' : 
            color === 'white' ? 'bg-white' : 
            color === 'gray' ? 'bg-gray-400' : 'bg-gray-600'}
        `}
      />
      {text && (
        <p className={`text-sm ${overlay || fullScreen ? 'text-white' : 'text-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );

  // Selecionar tipo de loading
  const renderLoading = () => {
    switch (type) {
      case 'dots':
        return <Dots />;
      case 'bars':
        return <Bars />;
      case 'pulse':
        return <Pulse />;
      default:
        return <Spinner />;
    }
  };

  return (
    <div className={containerClasses} {...props}>
      {renderLoading()}
    </div>
  );
};

// Loading para tabelas
export const TableLoading = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 py-3 border-b border-gray-200">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div 
            key={colIndex} 
            className="flex-1 h-4 bg-gray-200 rounded"
          />
        ))}
      </div>
    ))}
  </div>
);

// Loading para cards
export const CardLoading = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="h-3 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    ))}
  </div>
);

// Loading para formulários
export const FormLoading = () => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index}>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    ))}
    <div className="flex justify-end space-x-2 mt-6">
      <div className="h-10 bg-gray-200 rounded w-20"></div>
      <div className="h-10 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

// Loading para texto
export const TextLoading = ({ lines = 3, className = '' }) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div 
        key={index} 
        className={`h-4 bg-gray-200 rounded ${
          index === lines - 1 ? 'w-2/3' : 'w-full'
        }`}
      />
    ))}
  </div>
);

// Loading para botões
export const ButtonLoading = ({ width = 'w-24', height = 'h-10' }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${width} ${height}`} />
);

// Loading inline
export const InlineLoading = ({ text = 'Carregando...', size = 'small' }) => (
  <div className="flex items-center space-x-2">
    <Loading type="spinner" size={size} />
    <span className="text-sm text-gray-600">{text}</span>
  </div>
);

// Loading para página inteira
export const PageLoading = ({ text = 'Carregando página...' }) => (
  <Loading 
    fullScreen 
    size="large" 
    text={text}
    className="bg-gray-50"
  />
);

// Loading com overlay
export const OverlayLoading = ({ text = 'Carregando...' }) => (
  <Loading 
    overlay 
    size="large" 
    color="white" 
    text={text}
  />
);

export default Loading;