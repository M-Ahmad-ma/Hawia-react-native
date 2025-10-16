import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Region, LatLng } from 'react-native-maps';
import { RootStackParamList } from '../App';
import { Items } from '../Data/item';
import Icon from 'react-native-vector-icons/Ionicons';

export default function NearByCompaniesScreen() {
  const [region, setRegion] = useState<Region>({
    latitude: 24.7136,
    longitude: 46.6753,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Location permission denied');
        }
      }
    };
    requestLocationPermission();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      <MapView
        provider="google"
        style={{ flex: 1 }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={region}
      >
        {Items.map(comp => {
          const coord: LatLng = {
            latitude: comp.latitude,
            longitude: comp.longitude,
          };
          return (
            <Marker
              key={comp.id}
              coordinate={coord}
              title={comp.title}
              description={comp.location}
              onPress={() => navigation.navigate('Details', { company: comp })}
            />
          );
        })}
      </MapView>

      <View className="absolute top-10 left-4 right-4 flex items-center flex-row bg-black/60 rounded-xl gap-4 p-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-center text-lg font-semibold">
          Nearby Companies
        </Text>
      </View>
    </View>
  );
}
