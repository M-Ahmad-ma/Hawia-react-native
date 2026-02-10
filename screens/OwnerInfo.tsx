import React, { useRef } from 'react';
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Mail, Phone, MapPin, Building2 } from 'lucide-react-native';
import i18n from '../i18n/i18n';

export const OwnerInfo = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_MAX_HEIGHT = 200;
  const HEADER_MIN_HEIGHT = 80;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const logoScale = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [1, 0.6],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

  const handleEmail = () => {
    Linking.openURL('mailto:JLaL@mail.com');
  };

  const handlePhone = () => {
    Linking.openURL('tel:0555762617');
  };

  const goBack = () => {
    navigation.jumpTo('HomeDrawer');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5F0' }}>
      <Animated.View
        style={{
          height: headerHeight,
          backgroundColor: '#FF8C42',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 28,
            left: 20,
            right: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 100,
          }}
        >
          <TouchableOpacity
            onPress={goBack}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              padding: 8,
              borderRadius: 20,
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleLanguage}
            style={{
              backgroundColor: 'white',
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{ color: '#FF8C42', fontSize: 12, fontWeight: 'bold' }}
            >
              {i18n.language === 'ar' ? 'EN' : 'AR'}
            </Text>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={{
            alignItems: 'center',
            marginTop: 20,
            transform: [{ scale: logoScale }],
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 12,
              borderRadius: 16,
              marginBottom: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Image
              source={require('../assets/hawiaLogo.png')}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            {t('hawia_logo')}
          </Text>
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              marginTop: 4,
              fontSize: 14,
            }}
          >
            {t('owner_location')}
          </Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#374151',
              marginBottom: 16,
            }}
          >
            {t('contact')}
          </Text>

          <TouchableOpacity
            onPress={handleEmail}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#F9FAFB',
              borderRadius: 12,
              marginBottom: 12,
            }}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#FFE5D9',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginEnd: 16,
              }}
            >
              <Mail size={20} color="#FF8C42" />
            </View>
            <View>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>
                {t('email')}
              </Text>
              <Text
                style={{ fontSize: 16, color: '#111827', fontWeight: '500' }}
              >
                JLaL@mail.com
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePhone}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#F9FAFB',
              borderRadius: 12,
            }}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#D1FAE5',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginEnd: 16,
              }}
            >
              <Phone size={20} color="#10B981" />
            </View>
            <View>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>
                {t('phone_number')}
              </Text>
              <Text
                style={{ fontSize: 16, color: '#111827', fontWeight: '500' }}
              >
                0555762617
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: '#FF8C42',
            borderRadius: 24,
            padding: 24,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: 10,
                borderRadius: 12,
                marginEnd: 12,
              }}
            >
              <Building2 size={24} color="white" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>
              {t('owner_about_title')}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 15,
              color: 'rgba(255, 255, 255, 0.95)',
              lineHeight: 24,
            }}
          >
            {t('owner_about_description')}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <MapPin size={18} color="#FF8C42" />
          <Text style={{ color: '#6B7280', marginStart: 8, fontSize: 14 }}>
            {t('owner_location')}
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};
