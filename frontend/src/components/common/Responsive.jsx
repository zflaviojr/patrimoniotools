import React from 'react';

// Container responsivo principal
export const ResponsiveContainer = ({ children, className = '', maxWidth = '7xl', ...props }) => {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md', 
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  return (
    <div 
      className={`
        ${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Grid responsivo
export const ResponsiveGrid = ({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = { xs: 4, sm: 6 },
  className = '',
  ...props 
}) => {
  const gridClasses = `
    grid
    grid-cols-${cols.xs || 1}
    ${cols.sm ? `sm:grid-cols-${cols.sm}` : ''}
    ${cols.md ? `md:grid-cols-${cols.md}` : ''}
    ${cols.lg ? `lg:grid-cols-${cols.lg}` : ''}
    ${cols.xl ? `xl:grid-cols-${cols.xl}` : ''}
    gap-${gap.xs || 4}
    ${gap.sm ? `sm:gap-${gap.sm}` : ''}
    ${gap.md ? `md:gap-${gap.md}` : ''}
    ${gap.lg ? `lg:gap-${gap.lg}` : ''}
  `.replace(/\\s+/g, ' ').trim();

  return (
    <div className={`${gridClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Flex responsivo
export const ResponsiveFlex = ({ 
  children,
  direction = { xs: 'col', sm: 'row' },
  justify = 'between',
  align = 'center',
  gap = { xs: 4, sm: 0 },
  className = '',
  ...props 
}) => {
  const flexClasses = `
    flex
    flex-${direction.xs || 'col'}
    ${direction.sm ? `sm:flex-${direction.sm}` : ''}
    ${direction.md ? `md:flex-${direction.md}` : ''}
    ${direction.lg ? `lg:flex-${direction.lg}` : ''}
    justify-${justify}
    items-${align}
    space-y-${gap.xs || 0}
    ${gap.sm ? `sm:space-y-0 sm:space-x-${gap.sm}` : ''}
  `.replace(/\\s+/g, ' ').trim();

  return (
    <div className={`${flexClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Stack responsivo (para formulários)
export const ResponsiveStack = ({ 
  children, 
  spacing = { xs: 4, sm: 6 },
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`
        space-y-${spacing.xs || 4} 
        ${spacing.sm ? `sm:space-y-${spacing.sm}` : ''}
        ${spacing.md ? `md:space-y-${spacing.md}` : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Card responsivo
export const ResponsiveCard = ({ 
  children, 
  padding = { xs: 4, sm: 6 },
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-lg 
        p-${padding.xs || 4} 
        ${padding.sm ? `sm:p-${padding.sm}` : ''}
        ${padding.md ? `md:p-${padding.md}` : ''}
        hover:shadow-xl transition-shadow duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Texto responsivo
export const ResponsiveText = ({ 
  children,
  size = { xs: 'sm', sm: 'base', lg: 'lg' },
  weight = 'normal',
  className = '',
  as: Component = 'p',
  ...props 
}) => {
  const textClasses = `
    text-${size.xs || 'sm'}
    ${size.sm ? `sm:text-${size.sm}` : ''}
    ${size.md ? `md:text-${size.md}` : ''}
    ${size.lg ? `lg:text-${size.lg}` : ''}
    ${size.xl ? `xl:text-${size.xl}` : ''}
    font-${weight}
  `.replace(/\\s+/g, ' ').trim();

  return (
    <Component className={`${textClasses} ${className}`} {...props}>
      {children}
    </Component>
  );
};

// Heading responsivo
export const ResponsiveHeading = ({ 
  children,
  level = 1,
  size = { xs: 'xl', sm: '2xl', lg: '3xl' },
  className = '',
  ...props 
}) => {
  const Component = `h${level}`;
  
  return (
    <ResponsiveText
      as={Component}
      size={size}
      weight=\"bold\"
      className={className}
      {...props}
    >
      {children}
    </ResponsiveText>
  );
};

// Botão responsivo mobile-first
export const ResponsiveButton = ({ 
  children,
  size = { xs: 'full', sm: 'auto' },
  className = '',
  ...props 
}) => {
  const buttonClasses = `
    ${size.xs === 'full' ? 'w-full' : ''}
    ${size.sm === 'auto' ? 'sm:w-auto' : ''}
    ${size.sm === 'full' ? 'sm:w-full' : ''}
    touch-target
  `.replace(/\\s+/g, ' ').trim();

  return (
    <button className={`btn-primary ${buttonClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Layout de página responsivo
export const ResponsivePageLayout = ({ 
  children,
  header,
  footer,
  sidebar,
  className = '',
  ...props 
}) => {
  return (
    <div className=\"min-h-screen bg-gray-50 flex flex-col\">
      {/* Header */}
      {header && (
        <header className=\"flex-shrink-0\">
          {header}
        </header>
      )}
      
      {/* Main content */}
      <main className=\"flex-1 flex flex-col lg:flex-row\">
        {/* Sidebar */}
        {sidebar && (
          <aside className=\"lg:w-64 lg:flex-shrink-0 order-2 lg:order-1\">
            <div className=\"lg:sticky lg:top-4\">
              {sidebar}
            </div>
          </aside>
        )}
        
        {/* Content */}
        <div className={`flex-1 order-1 lg:order-2 ${className}`} {...props}>
          {children}
        </div>
      </main>
      
      {/* Footer */}
      {footer && (
        <footer className=\"flex-shrink-0\">
          {footer}
        </footer>
      )}
    </div>
  );
};

// Hook para detectar tamanho da tela
export const useResponsive = () => {
  const [screenSize, setScreenSize] = React.useState('lg');
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(true);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setScreenSize('xs');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 768) {
        setScreenSize('sm');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 1024) {
        setScreenSize('md');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width < 1280) {
        setScreenSize('lg');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      } else {
        setScreenSize('xl');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints: {
      xs: screenSize === 'xs',
      sm: screenSize === 'sm',
      md: screenSize === 'md',
      lg: screenSize === 'lg',
      xl: screenSize === 'xl'
    }
  };
};