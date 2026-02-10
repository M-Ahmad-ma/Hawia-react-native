import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import './global.css';
import { DataProvider } from './context/DataContext.jsx';
import { MainApp } from './components/cityDrawerNavigator.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './i18n/i18n.js';
import { setI18nConfig } from './i18n/i18n.js';

setI18nConfig().catch(console.error);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <DataProvider>
            <NavigationContainer>
              <MainApp />
            </NavigationContainer>
          </DataProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
