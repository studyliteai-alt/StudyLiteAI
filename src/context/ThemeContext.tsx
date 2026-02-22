import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
    isLowData: boolean;
    toggleLowData: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLowData, setIsLowData] = useState(() => {
        const saved = localStorage.getItem('lowDataMode');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('lowDataMode', isLowData.toString());
        if (isLowData) {
            document.documentElement.classList.add('low-data');
        } else {
            document.documentElement.classList.remove('low-data');
        }
    }, [isLowData]);

    const toggleLowData = () => setIsLowData(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isLowData, toggleLowData }}>
            {children}
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
