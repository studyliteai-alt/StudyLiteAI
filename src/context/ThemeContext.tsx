import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  lowDataMode: boolean;
  setLowDataMode: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lowDataMode, setLowDataMode] = useState(() => {
    const saved = localStorage.getItem('low-data-mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('low-data-mode', String(lowDataMode));
    if (lowDataMode) {
      document.documentElement.classList.add('low-data');
    } else {
      document.documentElement.classList.remove('low-data');
    }
  }, [lowDataMode]);

  return (
    <ThemeContext.Provider value={{ lowDataMode, setLowDataMode }}>
      <div className={lowDataMode ? 'low-data' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
