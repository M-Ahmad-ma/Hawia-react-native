import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import NearbyCompaniesScreen from './screens/NearByCompaniesScreen';
import DetailsScreen from './screens/DetailsScreen';
import './global.css';
import { Company } from './types/index.ts';
import { DataProvider } from './context/DataContext.jsx';
import CityDrawerNavigator from './components/cityDrawerNavigator.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import "./i18n/i18n.js";
import { setI18nConfig } from "./i18n/i18n.js";
export type RootStackParamList = {
  Home: undefined;
  NearbyCompanies: undefined;
  Details: { company: Company };
};

setI18nConfig();


const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DataProvider>
          <NavigationContainer>
            <CityDrawerNavigator />
          </NavigationContainer>
        </DataProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
