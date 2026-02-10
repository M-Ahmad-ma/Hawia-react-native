import React, { useContext } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import HomeScreen from '../screens/HomeScreen';
import NearbyCompaniesScreen from '../screens/NearByCompaniesScreen';
import DetailsScreen from '../screens/DetailsScreen';
import DataContext from '../context/DataContext';
import { TermsAndCondition } from '../screens/TermsAndCondition';
import { Contact } from '../screens/Contact';
import { OwnerInfo } from '../screens/OwnerInfo.tsx';
import { Phone, FileText, Users, Home } from 'lucide-react-native';

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
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NearbyCompanies"
        component={NearbyCompaniesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(_props: any) {
  const { data: contextData } = useContext(DataContext);

  const companies: any[] =
    contextData?.status === 'success' && Array.isArray(contextData.data)
      ? contextData.data
      : [];

  const citySet = new Set(companies.map(c => c.company_city));
  const cities: string[] = ['all cities', ...Array.from(citySet)];

  return (
    <DrawerContentScrollView {..._props}>
      {cities.map((city: string) => (
        <DrawerItem
          key={city}
          label={city}
          onPress={() => {
            _props.navigation.navigate('HomeStack', {
              screen: 'Home',
              params: { selectedCity: city },
            });
            _props.navigation.closeDrawer();
          }}
        />
      ))}
    </DrawerContentScrollView>
  );
}

export default function CityDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{ drawerPosition: 'right', headerShown: false }}
    >
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

export function MainApp() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FF8C42',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen
        name="HomeDrawer"
        component={CityDrawerNavigator}
        options={{
          title: t('tabs_home'),
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Contact"
        component={Contact}
        options={{
          title: t('tabs_contact'),
          tabBarIcon: ({ color }) => <Phone size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="TermsAndConditions"
        component={TermsAndCondition}
        options={{
          title: t('tabs_terms'),
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="OwnerInfo"
        component={OwnerInfo}
        options={{
          title: t('tabs_about'),
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
