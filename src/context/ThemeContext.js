import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const LIGHT = 'light';
export const DARK  = 'dark';

export const lightColors = {
  primary:      '#0D5016',
  gold:         '#C9A84C',
  bg:           '#F6F4EE',
  bgCard:       '#FFFFFF',
  textDark:     '#1A1A1A',
  textMid:      '#555555',
  textLight:    '#888888',
  border:       '#E8E4DA',
  arabic:       '#8B6914',
  ayah:         '#1B5E20', ayahLight:   '#E8F5E9',
  hadith:       '#1A237E', hadithLight: '#E8EAF6',
  story:        '#4A148C', storyLight:  '#F3E5F5',
  dua:          '#B71C1C', duaLight:    '#FFEBEE',
  tabBar:       '#FFFFFF',
  tabActive:    '#0D5016',
  tabInactive:  '#999999',
};

export const darkColors = {
  primary:      '#4CAF7D',
  gold:         '#D4A853',
  bg:           '#121612',
  bgCard:       '#1E241E',
  textDark:     '#EDE8DC',
  textMid:      '#A89F8C',
  textLight:    '#6B6560',
  border:       '#2A302A',
  arabic:       '#D4A853',
  ayah:         '#4CAF7D', ayahLight:   '#1A2E1E',
  hadith:       '#7986CB', hadithLight: '#1A1D2E',
  story:        '#CE93D8', storyLight:  '#1E1A2E',
  dua:          '#EF9A9A', duaLight:    '#2E1A1A',
  tabBar:       '#1E241E',
  tabActive:    '#4CAF7D',
  tabInactive:  '#6B6560',
};

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('noor_theme').then((saved) => {
      if (saved === LIGHT || saved === DARK) {
        // User has explicitly chosen — respect their choice
        setMode(saved);
      } else {
        // No saved preference — follow system, fallback to dark
        setMode(systemScheme === LIGHT ? LIGHT : DARK);
      }
    });
  }, []);

  const toggleTheme = async () => {
    const next = mode === LIGHT ? DARK : LIGHT;
    setMode(next);
    await AsyncStorage.setItem('noor_theme', next);
  };

  // Don't render children until mode is resolved — prevents flash
  if (mode === null) return null;

  const colors = mode === DARK ? darkColors : lightColors;
  const isDark  = mode === DARK;

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme, mode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
