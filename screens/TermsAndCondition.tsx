import React, { useRef } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, FileText } from 'lucide-react-native';

export const TermsAndCondition = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const content = t('terms.content');

  const sections = content.split('\n\n').filter(line => line.trim() !== '');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const goBack = () => {
    navigation.jumpTo('HomeDrawer');
  };

  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_MAX_HEIGHT = 180;
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
              fontSize: 18,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}
          >
            {t('terms.title')}
          </Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: '#FF8C42',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: 8,
                borderRadius: 10,
                marginEnd: 12,
              }}
            >
              <FileText size={20} color="white" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
              {t('welcome')}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.95)',
              lineHeight: 22,
            }}
          >
            {sections[0]}
          </Text>
        </View>

        {sections.slice(1).map((section, index) => {
          const lines = section.split('\n').filter(line => line.trim() !== '');
          const isHeaderSection = lines[0].endsWith(':');

          if (isHeaderSection) {
            const header = lines[0];
            const items = lines.slice(1);

            return (
              <View
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: 12,
                  }}
                >
                  {header}
                </Text>
                {items.map((item, itemIndex) => (
                  <View
                    key={itemIndex}
                    style={{ flexDirection: 'row', marginBottom: 8 }}
                  >
                    <Text
                      style={{ color: '#FF8C42', marginEnd: 8, fontSize: 14 }}
                    >
                      •
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 14,
                        color: '#6B7280',
                        lineHeight: 22,
                      }}
                    >
                      {item.replace(/^- /, '')}
                    </Text>
                  </View>
                ))}
              </View>
            );
          } else {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text
                  style={{ fontSize: 14, color: '#374151', lineHeight: 22 }}
                >
                  {section}
                </Text>
              </View>
            );
          }
        })}

        <View
          style={{
            backgroundColor: '#F9FAFB',
            borderRadius: 16,
            padding: 16,
            marginTop: 8,
            borderWidth: 1,
            borderColor: '#E5E7EB',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: '#6B7280',
              textAlign: 'center',
              lineHeight: 18,
            }}
          >
            {t('last_updated')} {new Date().toLocaleDateString()}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#9CA3AF',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            {t('all_rights_reserved')}
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};
