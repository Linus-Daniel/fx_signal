
// File: src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Colors {
  // Background colors
  background: string;
  surface: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Brand colors
  primary: string;
  primaryDark: string;
  secondary: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border and divider colors
  border: string;
  divider: string;
  
  // Special colors
  shadow: string;
  overlay: string;
  
  // Chart colors
  chartPrimary: string;
  chartSecondary: string;
  bullish: string;
  bearish: string;
}

export interface Theme {
  colors: Colors;
  isDark: boolean;
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
  };
  typography: {
    h1: { fontSize: number; fontWeight: string; lineHeight: number };
    h2: { fontSize: number; fontWeight: string; lineHeight: number };
    h3: { fontSize: number; fontWeight: string; lineHeight: number };
    h4: { fontSize: number; fontWeight: string; lineHeight: number };
    body: { fontSize: number; fontWeight: string; lineHeight: number };
    caption: { fontSize: number; fontWeight: string; lineHeight: number };
    button: { fontSize: number; fontWeight: string; letterSpacing: number };
  };
  shadows: {
    small: object;
    medium: object;
    large: object;
  };
}

const lightColors: Colors = {
  background: "#FAFBFC",
  surface: "#FFFFFF",
  card: "#FFFFFF",

  text: "#1A1D29",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",

  // 🔶 Orange primary
  primary: "#F97316", // Orange-500
  primaryDark: "#EA580C", // Orange-600
  secondary: "#64748B",

  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#06B6D4",

  border: "#E5E7EB",
  divider: "#F3F4F6",

  shadow: "rgba(0, 0, 0, 0.1)",
  overlay: "rgba(0, 0, 0, 0.5)",

  chartPrimary: "#F97316", // Orange
  chartSecondary: "#FB923C", // Lighter orange
  bullish: "#10B981",
  bearish: "#EF4444",
};


const darkColors: Colors = {
  background: "#0F172A",
  surface: "#1E293B",
  card: "#334155",

  text: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textTertiary: "#94A3B8",

  // 🔶 Orange primary
  primary: "#FB923C", // Orange-400
  primaryDark: "#F97316", // Orange-500
  secondary: "#94A3B8",

  success: "#34D399",
  warning: "#FBBF24",
  error: "#F87171",
  info: "#22D3EE",

  border: "#475569",
  divider: "#334155",

  shadow: "rgba(0, 0, 0, 0.3)",
  overlay: "rgba(0, 0, 0, 0.7)",

  chartPrimary: "#FB923C", // Orange
  chartSecondary: "#FDBA74", // Lighter orange
  bullish: "#34D399",
  bearish: "#F87171",
};


const createTheme = (isDark: boolean): Theme => ({
  colors: isDark ? darkColors : lightColors,
  isDark,
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
  },
  typography: {
    h1: { fontSize: 32, fontWeight: '700', lineHeight: 38 },
    h2: { fontSize: 24, fontWeight: '600', lineHeight: 29 },
    h3: { fontSize: 20, fontWeight: '600', lineHeight: 24 },
    h4: { fontSize: 18, fontWeight: '600', lineHeight: 22 },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    button: { fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  },
  shadows: {
    small: {
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.22 : 0.08,
      shadowRadius: 2.22,
      elevation: 3,
    },
    medium: {
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.25 : 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.30 : 0.15,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
});

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  systemColorScheme?: 'light' | 'dark' | null;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  systemColorScheme 
}) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadThemeMode();
  }, []);

  useEffect(() => {
    const shouldBeDark = themeMode === 'system' 
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';
    
    setIsDark(shouldBeDark);
    
    // Update status bar style
    StatusBar.setBarStyle(shouldBeDark ? 'light-content' : 'dark-content', true);
  }, [themeMode, systemColorScheme]);

  const loadThemeMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('theme_mode');
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setThemeModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme mode:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem('theme_mode', mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const theme = createTheme(isDark);

  return (
    <ThemeContext.Provider value={{
      theme,
      themeMode,
      toggleTheme,
      setThemeMode,
    }}>
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