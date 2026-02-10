import React, { useState, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react-native';

export const Contact = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

  const WHATSAPP_NUMBER = '0555762617';

  const isValidPhone = (value: string) => {
    return /^[0-9]{9,15}$/.test(value);
  };

  const handleSubmit = () => {
    setError('');

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError(t('contact.errors.required'));
      return;
    }

    if (!isValidPhone(phone)) {
      setError(t('contact.errors.invalid_phone'));
      return;
    }

    const text = t('contact.whatsapp_message', {
      name,
      phone,
      message,
    });

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      text,
    )}`;

    Linking.openURL(url);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const goBack = () => {
    console.log('lkasdfljsa');

    navigation.jumpTo('HomeDrawer');
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

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
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        style={{ paddingHorizontal: 20, marginTop: -10 }}
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
          {error ? (
            <View
              style={{
                backgroundColor: '#FEE2E2',
                borderStartWidth: 4,
                borderStartColor: '#EF4444',
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <Text
                style={{ color: '#991B1B', fontSize: 14, fontWeight: '500' }}
              >
                {error}
              </Text>
            </View>
          ) : null}

          <View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  color: '#374151',
                  fontWeight: '600',
                  marginBottom: 8,
                  fontSize: 14,
                }}
              >
                {t('phone_number')}
              </Text>
              <TextInput
                placeholder={t('please_enter_whatsapp')}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={{
                  backgroundColor: '#F9FAFB',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                }}
              />
            </View>


            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: '#10B981',
                borderRadius: 12,
                paddingVertical: 16,
                marginTop: 8,
              }}
              activeOpacity={0.9}
            >
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                {t('order_now')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#FF8C42',
            borderRadius: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
            padding: 24,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: 12,
                borderRadius: 20,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 28 }}>🏢</Text>
            </View>
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: 13,
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {t('contact.owner_info')}
            </Text>

            <View style={{ width: '100%' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: 8,
                    borderRadius: 8,
                    marginEnd: 12,
                  }}
                >
                  <MapPin color="white" size={18} />
                </View>
                <Text style={{ color: 'white', fontSize: 15 }}>
                  {t('owner_location')}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: 8,
                    borderRadius: 8,
                    marginEnd: 12,
                  }}
                >
                  <Mail color="white" size={18} />
                </View>
                <Text style={{ color: 'white', fontSize: 15 }}>
                  JLaL@mail.com
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <View
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: 8,
                    borderRadius: 8,
                    marginEnd: 12,
                  }}
                >
                  <Phone color="white" size={18} />
                </View>
                <Text style={{ color: 'white', fontSize: 15 }}>0555762617</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};
