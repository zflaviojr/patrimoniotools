import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button.jsx';

const Modal = ({ 
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  variant = 'default',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  footer,
  className = '',
  overlayClassName = '',
  ...props 
}) => {
  // Tamanhos do modal
  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // Variações de estilo
  const variants = {
    default: 'bg-white',
    danger: 'bg-white border-t-4 border-red-500',
    warning: 'bg-white border-t-4 border-yellow-500',
    success: 'bg-white border-t-4 border-green-500',
    info: 'bg-white border-t-4 border-blue-500',
  };

  // Fechar modal com ESC
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Não renderizar se modal não estiver aberto
  if (!isOpen) return null;

  // Lidar com clique no overlay
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Classes do modal
  const modalClasses = `
    ${variants[variant]}
    ${sizes[size]}
    w-full rounded-lg shadow-xl transform transition-all
    ${className}
  `.trim();

  // Classes do overlay
  const overlayClasses = `
    fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50
    ${overlayClassName}
  `.trim();

  const modalContent = (
    <div className={overlayClasses} onClick={handleOverlayClick}>
      <div className={modalClasses} {...props}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end space-x-2 p-6 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar no portal
  return createPortal(modalContent, document.body);
};

// Modal de confirmação
export const ConfirmModal = ({ 
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmação',
  message = 'Tem certeza que deseja continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  loading = false,
  ...props 
}) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button 
        variant={variant === 'danger' ? 'danger' : 'primary'} 
        onClick={handleConfirm}
        loading={loading}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      variant={variant}
      footer={footer}
      {...props}
    >
      <p className="text-gray-700">
        {message}
      </p>
    </Modal>
  );
};

// Modal de alerta
export const AlertModal = ({ 
  isOpen,
  onClose,
  title = 'Aviso',
  message,
  buttonText = 'OK',
  variant = 'info',
  ...props 
}) => {
  const footer = (
    <Button onClick={onClose}>
      {buttonText}
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      variant={variant}
      footer={footer}
      {...props}
    >
      <p className="text-gray-700">
        {message}
      </p>
    </Modal>
  );
};

// Modal de formulário
export const FormModal = ({ 
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Salvar',
  cancelText = 'Cancelar',
  loading = false,
  disabled = false,
  size = 'medium',
  submitButtonRef,
  ...props 
}) => {
  const footer = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button 
        ref={submitButtonRef}
        type="button"
        onClick={(e) => {
          // Encontrar o formulário dentro do modal e submetê-lo
          const modalContent = e.target.closest('.modal-content');
          if (modalContent) {
            const form = modalContent.querySelector('form');
            if (form) {
              form.requestSubmit();
            }
          }
          if (onSubmit) {
            onSubmit(e);
          }
        }}
        loading={loading}
        disabled={disabled}
      >
        {submitText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={footer}
      closeOnOverlayClick={!loading}
      closeOnEsc={!loading}
      className="modal-content"
      {...props}
    >
      {children}
    </Modal>
  );
};

// Modal para exibir detalhes
export const DetailModal = ({ 
  isOpen,
  onClose,
  title,
  data,
  children,
  ...props 
}) => {
  const footer = (
    <Button onClick={onClose}>
      Fechar
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      {...props}
    >
      {children || (
        <div className="space-y-3">
          {data && Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
              </span>
              <span className="text-gray-900">
                {value || '-'}
              </span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default Modal;