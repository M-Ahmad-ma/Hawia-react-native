import React, { useContext } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NearbyCompaniesScreen from '../screens/NearByCompaniesScreen';
import DetailsScreen from '../screens/DetailsScreen';
import DataContext from '../context/DataContext';

export type CityDrawerParamList = {
  HomeStack: undefined;
};

export type HomeStackParamList = {
  Home: { selectedCity?: string };
  NearbyCompanies: undefined;
  Details: { company: any }; 
};

const Drawer = createDrawerNavigator<CityDrawerParamList>();
const Stack = createNativeStackNavigator<HomeStackParamList>();

function CustomDrawerContent(props: any) {
  const { data: contextData } = useContext(DataContext);

  const companies =
    contextData?.status === 'success' && Array.isArray(contextData.data)
      ? contextData.data
      : [];

  const cities = ['all cities', ...new Set(companies.map(c => c.company_city))];

  return (
    <DrawerContentScrollView {...props}>
      {cities.map(city => (
        <DrawerItem
          key={city}
          label={city}
          onPress={() => {
            props.navigation.navigate('HomeStack', {
              screen: 'Home',
              params: { selectedCity: city },
            });
            props.navigation.closeDrawer();
          }}
        />
      ))}
    </DrawerContentScrollView>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NearbyCompanies" component={NearbyCompaniesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function CityDrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}
