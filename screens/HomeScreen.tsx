import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  FlatList,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  useNavigation,
  RouteProp,
  useRoute,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useQuery } from '@tanstack/react-query';
import Card from '../components/Card';
import Dialog from '../components/Dialog';
import { filterCompanies } from '../utils/index.js';
import { isTablet } from '../utils/istablet.ts'; // ← Add this
import {
  HomeStackParamList,
  CityDrawerParamList,
} from '../components/cityDrawerNavigator.tsx';
import fetchList, { openChat } from '../api/index.js';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n.js';

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Home'>,
  DrawerNavigationProp<CityDrawerParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<RouteProp<HomeStackParamList, 'Home'>>();
  const { t } = useTranslation();

  console.log(isTablet());

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const initialCity = route.params?.selectedCity || 'all cities';
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [visibleCompanies, setVisibleCompanies] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_MAX_HEIGHT = 300;
  const HEADER_MIN_HEIGHT = 80;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchList,
  });

  const companies = useMemo(() => {
    if (data?.status === 'success' && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(companies.map(item => item.company_city))];
    return ['all cities', ...uniqueCities.sort()];
  }, [companies]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchText]);

  const filteredCompanies = useMemo(() => {
    return filterCompanies(companies, selectedCity, debouncedSearchText);
  }, [companies, selectedCity, debouncedSearchText]);

  const ITEMS_PER_BATCH = isTablet() ? 12 : 6; 

  useEffect(() => {
    const initialBatch = filteredCompanies.slice(0, ITEMS_PER_BATCH);
    setVisibleCompanies(initialBatch);
    setCurrentIndex(initialBatch.length);
    setCanLoadMore(filteredCompanies.length > initialBatch.length);
  }, [filteredCompanies]);

  useEffect(() => {
    if (route.params?.selectedCity) {
      setSelectedCity(route.params.selectedCity);
    }
  }, [route.params?.selectedCity]);

  const loadMoreItemsSafe = () => {
    if (!canLoadMore || loadingMore || currentIndex >= filteredCompanies.length) return;

    setLoadingMore(true);

    setTimeout(() => {
      const nextIndex = Math.min(currentIndex + ITEMS_PER_BATCH, filteredCompanies.length);
      const newItems = filteredCompanies.slice(currentIndex, nextIndex);

      setVisibleCompanies(prev => [...prev, ...newItems]);
      setCurrentIndex(nextIndex);
      setCanLoadMore(nextIndex < filteredCompanies.length);
      setLoadingMore(false);
    }, 300);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const renderHeader = () => (
    <Animated.View style={{ height: headerHeight }}>
      <ImageBackground
        source={require('../assets/bg3.jpg')}
        className="w-full justify-center items-center"
        resizeMode="cover"
      >
        <View className="bg-black/50 w-full h-full justify-center items-center px-6">
          <Text className="text-white text-3xl max-w-[220px] font-bold mb-2 text-center">
            {t("find_reliable_hawias")}
          </Text>
          <Text className="text-white text-center mb-6 opacity-90 max-w-[300px]">
            {t("choose_nearby")}
          </Text>

          <View className="flex-row gap-3 mb-8">
            <TouchableOpacity
              onPress={() => navigation.navigate('NearbyCompanies')}
              className="bg-blue-600 px-6 py-3 rounded-full"
            >
              <Text className="text-white font-semibold">{t("explore_companies")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDialogVisible(true)}
              className="border-2 border-white px-6 py-3 rounded-full"
            >
              <Text className="text-white font-semibold">{t("register_company")}</Text>
            </TouchableOpacity>
          </View>

          <View className={(`flex-row gap-3 ${isTablet() ? 'w-[70%]' : 'w-full'}`)}>
            <TextInput
              placeholder={t("search_companies")}
              placeholderTextColor="#9CA3AF"
              className="flex-1 bg-white px-4 py-3 rounded-xl text-base"
              value={searchText}
              onChangeText={setSearchText}
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              className="bg-white px-4 py-3 rounded-xl justify-center"
            >
              <Text className="font-medium text-gray-800">
                {selectedCity === 'all cities' ? t('all_cities') : selectedCity}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#6B7280" />
        <Text className="text-gray-500 mt-2">{t('loading_more')}</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View className="flex-1 justify-center items-center py-20 px-6">
      <Text className="text-gray-500 text-lg text-center">
        {t('no_companies_found')}
      </Text>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center bg-gray-100">
          <ActivityIndicator size="large" color="#1F2937" />
          <Text className="mt-4 text-gray-600 text-lg">{t('loading_companies')}</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 justify-center items-center bg-gray-100 px-6">
          <Text className="text-red-600 text-lg text-center">
            {t('error_loading_data')}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={visibleCompanies}
        keyExtractor={(item) => `company-${item.id}`}
        renderItem={({ item }) => <Card company={item} isTablet={isTablet()} />}
        numColumns={isTablet() ? 2 : 1} 
        key={isTablet() ? 'tablet' : 'phone'} 
        columnWrapperStyle={isTablet() ? { justifyContent: 'space-between', paddingHorizontal: 16 } : null}
        onEndReached={loadMoreItemsSafe}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      />
    );
  };

  return (
    <View className="flex-1 bg-gray-100 relative">
      <View className="absolute z-30 bottom-8 left-3">
        <TouchableOpacity
          onPress={toggleLanguage}
          className="bg-blue-600 w-16 h-16 rounded-full justify-center items-center shadow-lg"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <Text className="text-white text-lg font-bold">
            {i18n.language === "ar" ? "EN" : "AR"}
          </Text>
        </TouchableOpacity>
      </View>

      {renderContent()}

      <Dialog
        onConfirm={() => openChat("966555762617", "I want to register my company")}
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title={t("contact_us_whatsapp")}
        confirmText={t("contact_us")}
      />
    </View>
  );
}