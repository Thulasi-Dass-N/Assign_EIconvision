import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

export type AppTheme = NavigationTheme & {
  colors: NavigationTheme['colors'] & {
    button: string;
    inputBackground: string;
    grid: string;
  };
};

export const LightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: '#ffffff',
    text: '#000000',
    card: '#f5f5f5',
    border: '#dcdcdc',
    primary: '#2196f3',
    button: '#2196f3',
    inputBackground: '#f0f0f0',
    grid: '#cccccc',
  },
};

export const DarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: '#000000',
    text: '#ffffff',
    card: '#121212',
    border: '#333333',
    primary: '#90caf9',
    button: '#90caf9',
    inputBackground: '#1e1e1e',
    grid: '#444444',
  },
};

export const useAppTheme = (): AppTheme => {
  const colorScheme = useColorScheme();
  return useMemo(
    () => (colorScheme === 'dark' ? DarkTheme : LightTheme),
    [colorScheme],
  );
};
