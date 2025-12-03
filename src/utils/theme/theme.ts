import { MD3LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#ff8629ff',
    secondary: '#ff8b4dff',
    tertiary: '#CCC5B9',
    background: '#FFFCF2',
    surface: '#FFFCF2',
    onSurface: '#403D39'
  },
  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
