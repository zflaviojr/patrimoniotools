import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  title, 
  subtitle,
  actions,
  variant = 'default',
  hover = true,
  padding = 'default',
  ...props 
}) => {
  // Classes base do card
  const baseClasses = 'bg-white rounded-lg shadow transition-shadow duration-200';
  
  // Variações de estilo
  const variants = {
    default: 'shadow-md border border-gray-100',
    elevated: 'shadow-lg',
    outlined: 'border-2 border-gray-200 shadow-sm',
    minimal: 'shadow-sm border border-gray-100',
  };
  
  // Efeito hover
  const hoverClasses = hover ? 'hover:shadow-xl' : '';
  
  // Variações de padding
  const paddingClasses = {
    none: '',
    small: 'p-4',
    default: 'p-6',
    large: 'p-8',
  };

  // Combinar classes
  const cardClasses = `
    ${baseClasses} 
    ${variants[variant]} 
    ${hoverClasses} 
    ${paddingClasses[padding]} 
    ${className}
  `.trim();

  return (
    <div className={cardClasses} {...props}>
      {/* Header do card */}
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {/* Conteúdo do card */}
      <div>
        {children}
      </div>
    </div>
  );
};

// Componente para header customizado do card
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

// Componente para body do card
export const CardBody = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

// Componente para footer do card
export const CardFooter = ({ 
  children, 
  className = '', 
  bordered = true,
  ...props 
}) => (
  <div 
    className={`
      mt-4 pt-4 
      ${bordered ? 'border-t border-gray-200' : ''} 
      ${className}
    `} 
    {...props}
  >
    {children}
  </div>
);

// Card para módulos do dashboard
export const ModuleCard = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <Card
      className={`
        cursor-pointer select-none transform transition-all duration-200
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-105 active:scale-95'
        }
        ${className}
        h-full flex flex-col
      `}
      variant="outlined"
      onClick={handleClick}
      {...props}
    >
      <div className="text-center flex flex-col flex-grow">
        {/* Ícone */}
        {icon && (
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 mb-4 flex-shrink-0">
            {typeof icon === 'string' ? (
              <span className="text-2xl">{icon}</span>
            ) : (
              <div className="text-primary-600">
                {icon}
              </div>
            )}
          </div>
        )}
        
        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex-shrink-0">
          {title}
        </h3>
        
        {/* Descrição */}
        {description && (
          <p className="text-sm text-gray-600 flex-grow">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};

// Card para exibir responsáveis
export const ResponsavelCard = ({ 
  responsavel, 
  onEdit, 
  onDelete, 
  onView,
  className = '',
  ...props 
}) => {
  const actions = (
    <div className="flex space-x-1">
      {onView && (
        <button
          onClick={() => onView(responsavel)}
          className="p-1 text-gray-400 hover:text-primary-600 rounded transition-colors"
          title="Visualizar"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      )}
      
      {onEdit && (
        <button
          onClick={() => onEdit(responsavel)}
          className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
          title="Editar"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}
      
      {onDelete && (
        <button
          onClick={() => onDelete(responsavel)}
          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
          title="Excluir"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <Card
      className={className}
      actions={actions}
      variant="outlined"
      {...props}
    >
      <div className="space-y-2">
        <div>
          <h4 className="font-semibold text-gray-900">
            {responsavel.nome}
          </h4>
        </div>
        
        <div className="text-sm text-gray-600">
          <span className="font-medium">Matrícula:</span> {responsavel.matricula}
        </div>
        
        {responsavel.permissao !== null && responsavel.permissao !== undefined && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Permissão:</span> {responsavel.permissao}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;