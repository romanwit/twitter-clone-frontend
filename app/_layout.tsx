import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [tokenChecked, setTokenChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('access_token');
      setHasToken(!!token);
      setTokenChecked(true);
    })();
  }, []);

  useEffect(() => {
    if (tokenChecked && !hasToken) {
      router.replace('/login');
    }
  }, [tokenChecked, hasToken]);

  /*if (!tokenChecked) {
    return <h1>1</h1>; 
  }*/

  /*if (!loaded) {
    // Async font loading only occurs in development.
    return <h1>2</h1>;
  }*/

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
