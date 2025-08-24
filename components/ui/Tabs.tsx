import React from 'react';

interface TabProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ isActive, onClick, children }) => {
  const activeClasses = 'border-primary text-primary';
  const inactiveClasses = 'border-transparent text-text-light hover:text-text-dark hover:border-text-light';
  
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};

interface TabsProps {
    children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
    return (
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {children}
        </nav>
    )
}