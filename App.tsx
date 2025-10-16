import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import NearbyCompaniesScreen from './screens/NearByCompaniesScreen';
import DetailsScreen from './screens/DetailsScreen';
import './global.css';
import { Company } from './Data/item';

export type RootStackParamList = {
  Home: undefined;
  NearbyCompanies: undefined;
  Details: { company: Company };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NearbyCompanies"
          component={NearbyCompaniesScreen}
          options={{ headerShown: false, title: 'Nearby Companies' }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ headerShown: false, title: 'item details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
