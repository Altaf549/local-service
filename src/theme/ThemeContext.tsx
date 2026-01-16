import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {useColorScheme, ColorSchemeName} from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  whiteBackground: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  disabled: string;
  placeholder: string;
  card: string;
  shadow: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
  };
  typography: {
    h1: {fontSize: number; fontWeight: '700'; lineHeight: number};
    h2: {fontSize: number; fontWeight: '700'; lineHeight: number};
    h3: {fontSize: number; fontWeight: '600'; lineHeight: number};
    h4: {fontSize: number; fontWeight: '600'; lineHeight: number};
    body: {fontSize: number; fontWeight: '400'; lineHeight: number};
    caption: {fontSize: number; fontWeight: '400'; lineHeight: number};
  };
}

const baseTypography: Theme['typography'] = {
  h1: {fontSize: 22, fontWeight: '700', lineHeight: 32},
  h2: {fontSize: 20, fontWeight: '700', lineHeight: 28},
  h3: {fontSize: 18, fontWeight: '600', lineHeight: 24},
  h4: {fontSize: 16, fontWeight: '600', lineHeight: 22},
  body: {fontSize: 14, fontWeight: '400', lineHeight: 20},
  caption: {fontSize: 12, fontWeight: '400', lineHeight: 16},
};

const lightTheme: Theme = {
  colors: {
    primary: '#1cadc9',
    secondary: '#14829a',
    whiteBackground: '#FFFFFF',
    background: '#e0e0e0ff',
    surface: '#fffefeff',
    text: '#000000',
    textSecondary: '#666666',
    border: '#787878ff',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    info: '#007AFF',
    disabled: '#CCCCCC',
    placeholder: '#999999',
    card: '#FFFFFF',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  typography: baseTypography,
};

const darkTheme: Theme = {
  colors: {
    primary: '#1cadc9',
    secondary: '#17b7d4',
    whiteBackground: '#1C1C1E',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#98989D',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
    info: '#0A84FF',
    disabled: '#48484A',
    placeholder: '#636366',
    card: '#1C1C1E',
    shadow: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  typography: baseTypography,
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');

  const getEffectiveTheme = (): ColorSchemeName => {
    if (themeMode === 'auto') {
      return systemColorScheme || 'light';
    }
    return themeMode;
  };

  const isDark = getEffectiveTheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{theme, themeMode, setThemeMode, isDark}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

