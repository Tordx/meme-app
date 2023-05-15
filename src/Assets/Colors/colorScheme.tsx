import { useColorScheme } from 'react-native';
import { useMemo } from 'react';

export const useAppColorScheme = () => {
    const colorScheme = useColorScheme();
    const isDarkMode = useMemo(() => colorScheme === 'dark', [colorScheme]);
    return isDarkMode ? 'dark' : 'light';
  };