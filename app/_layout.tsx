import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { JournalProvider } from '@/contexts/JournalContext';
import { theme } from '@/constants/theme';
export default function RootLayout() { return <AlertProvider><SafeAreaProvider><JournalProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}><Stack.Screen name="(tabs)" /><Stack.Screen name="settings" options={{ headerShown: true, title: 'الإعدادات', headerTintColor: theme.colors.primary, headerStyle: { backgroundColor: theme.colors.background }, headerShadowVisible: false }} /></Stack></JournalProvider></SafeAreaProvider></AlertProvider>; }
