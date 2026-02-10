import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import DataContext from '../context/DataContext.jsx';
import Geolocation from '@react-native-community/geolocation';
import { HomeStackParamList } from '../components/cityDrawerNavigator.tsx';

export default function NearByCompaniesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { data: contextData } = useContext(DataContext);

  const [region, setRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [hasCenteredOnUser, setHasCenteredOnUser] = useState(false);
  const mapRef = useRef<MapView>(null);
  const watchIdRef = useRef<number | null>(null);

  const DEFAULT_REGION: Region = {
    latitude: 24.7136,
    longitude: 46.6753,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };

  const SAUDI_WIDE_REGION: Region = {
    latitude: 24.5,
    longitude: 45.0,
    latitudeDelta: 20,
    longitudeDelta: 20,
  };

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    let isMounted = true;

    const requestPermission = async (): Promise<boolean> => {
      if (Platform.OS !== 'android') return true;
      try {
        const fine = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        const coarse = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        );
        return fine === 'granted' || coarse === 'granted';
      } catch {
        return false;
      }
    };

    const startLocation = async () => {
      const granted = await requestPermission();

      if (!granted) {
        if (isMounted) {
          setPermissionDenied(true);
          setRegion(DEFAULT_REGION);
        }
        return;
      }

      watchIdRef.current = Geolocation.watchPosition(
        pos => {
          if (!isMounted) return;
          const { latitude, longitude, accuracy } = pos.coords;
          if (accuracy && accuracy > 500) return;

          setUserLocation({ latitude, longitude });

          if (!hasCenteredOnUser) {
            const newRegion: Region = {
              latitude,
              longitude,
              latitudeDelta: 0.15,
              longitudeDelta: 0.15,
            };
            setRegion(newRegion);
            mapRef.current?.animateToRegion(newRegion, 1200);
            setHasCenteredOnUser(true);
          }
        },
        err => console.warn(err),
        { enableHighAccuracy: true, distanceFilter: 30, interval: 15000 },
      );

      Geolocation.getCurrentPosition(
        pos => {
          if (!isMounted || hasCenteredOnUser) return;
          const { latitude, longitude } = pos.coords;
          setUserLocation({ latitude, longitude });
          const newRegion: Region = {
            latitude,
            longitude,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          };
          setRegion(newRegion);
          mapRef.current?.animateToRegion(newRegion, 1200);
          setHasCenteredOnUser(true);
        },
        () => {
          if (!isMounted) return;
          setRegion(DEFAULT_REGION);
          setPermissionDenied(true);
        },
        { enableHighAccuracy: true, timeout: 15000 },
      );
    };

    startLocation();

    return () => {
      isMounted = false;
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!userLocation || permissionDenied || !hasCenteredOnUser) return;

    const hasNearby = contextData?.data?.some(comp => {
      const lat = Number(comp.latitude);
      const lng = Number(comp.longitude);
      if (isNaN(lat) || isNaN(lng)) return false;
      return (
        haversineDistance(
          userLocation.latitude,
          userLocation.longitude,
          lat,
          lng,
        ) <= 100
      );
    });

    if (!hasNearby) {
      mapRef.current?.animateToRegion(SAUDI_WIDE_REGION, 1500);
    }
  }, [userLocation, contextData?.data, permissionDenied, hasCenteredOnUser]);

  if (!region) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-6 text-lg text-gray-700 font-medium">
          جاري تحديد موقعك...
        </Text>
      </View>
    );
  }

  const nearbyCompanies = userLocation
    ? (contextData?.data || [])
        .map(comp => {
          const lat = Number(comp.latitude);
          const lng = Number(comp.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;
          const distance = haversineDistance(
            userLocation.latitude,
            userLocation.longitude,
            lat,
            lng,
          );
          if (distance > 100) return null;
          return { comp, lat, lng, distance };
        })
        .filter(Boolean)
    : [];

  const hasNearby = nearbyCompanies.length > 0;

  const companiesToDisplay =
    permissionDenied || !hasNearby
      ? contextData?.data || []
      : nearbyCompanies.map(item => item!.comp);

  return (
    <View className="flex-1 bg-gray-100">
      <MapView
        ref={mapRef}
        provider="google"
        style={{ flex: 1 }}
        region={region}
        showsUserLocation={!permissionDenied}
        showsMyLocationButton={!permissionDenied}
        loadingEnabled
      >
        {companiesToDisplay.map((comp: any) => {
          const lat = Number(comp.latitude);
          const lng = Number(comp.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          const logoUrl = comp.company_logo
            ? `https://hawia.sa/admin/assets/img/company-logos/${comp.company_logo}`
            : 'https://via.placeholder.com/80/cccccc/666666.png';

          console.log(logoUrl);

          return (
            <Marker
              key={comp.id}
              coordinate={{ latitude: lat, longitude: lng }}
              onPress={() => navigation.navigate('Details', { company: comp })}
            >
              <View className="bg-white rounded-full p-1 border-2 border-white shadow-xl">
                <Image
                  source={{ uri: logoUrl }}
                  className="w-10 h-10 rounded-full"
                />
              </View>
            </Marker>
          );
        })}

        {userLocation && !permissionDenied && (
          <Marker coordinate={userLocation}>
            <View className="items-center">
              <View className="w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
              <View className="absolute w-12 h-12 bg-blue-400 rounded-full opacity-30 animate-pulse" />
            </View>
          </Marker>
        )}
      </MapView>

      <View className="absolute top-12 left-4 right-4 bg-black/85 rounded-2xl px-4 py-4 flex-row items-center shadow-2xl">
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              }),
            );
          }}
          className=" px-4 py-1"
        >
          <Icon name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold flex-1 text-center -ml-6">
          {permissionDenied
            ? 'الشركات في الرياض'
            : hasNearby
              ? 'الشركات القريبة منك'
              : 'جميع الشركات في المملكة'}
        </Text>
      </View>

      {!permissionDenied && userLocation && !hasNearby && (
        <View className="absolute bottom-20 left-4 right-4 bg-gradient-to-r from-[#FF8C42] to-orange-500 rounded-2xl p-5 shadow-2xl">
          <Text className="text-white text-center font-bold text-lg">
            لا توجد شركات قريبة (100 كم)
          </Text>
          <Text className="text-white/90 text-center mt-2">
            تم توسيع الخريطة لعرض جميع الشركات
          </Text>
        </View>
      )}

      {hasNearby && (
        <View className="absolute top-28 right-6 bg-emerald-600 rounded-full px-5 py-3 shadow-2xl">
          <Text className="text-white font-bold text-lg">
            {nearbyCompanies.length} قريبة
          </Text>
        </View>
      )}
    </View>
  );
}
