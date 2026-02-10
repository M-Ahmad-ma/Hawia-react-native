import React, { useState } from 'react';
import {
  RouteProp,
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import CardDetails from '../components/CardDetails';
import Dialog from '../components/Dialog';
import { HomeStackParamList } from '../components/cityDrawerNavigator.tsx';
import { saveWhatsapp, openChat } from '../api/index.js';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n.js';
import { ArrowLeft, Navigation } from 'lucide-react-native';

type DetailsScreenRouteProp = RouteProp<HomeStackParamList, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const { company } = route.params;
  const { t } = useTranslation();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!phoneNumber.trim()) return;

    setLoading(true);

    try {
      const response = await saveWhatsapp(phoneNumber);

      if (response.success) {
        let raw = company.contact_no || '';
        raw = raw.replace(/\D/g, '');
        raw = raw.replace(/^0/, '');

        const fullNumber = `966${raw}`;

        await openChat(fullNumber);
      } else {
        console.warn('Save failed:', response.message);
      }
    } catch (err) {
      console.error('handleConfirm error:', err);
    } finally {
      setLoading(false);
      setDialogVisible(false);
      setPhoneNumber('');
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white relative">
      {/* Back Button */}
      <View className="absolute top-10 left-4 z-30">
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              }),
            );
          }}
          className="flex-row items-center bg-gray-100 px-4 py-2 rounded-xl active:opacity-80"
        >
          <ArrowLeft />
        </TouchableOpacity>
      </View>

      <View className="absolute z-30 bottom-8 left-3">
        <TouchableOpacity
          onPress={toggleLanguage}
          className="bg-[#FF8C42] w-16 h-16 rounded-full justify-center items-center shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <Text className="text-white text-lg font-bold">
            {i18n.language === 'ar' ? 'Eng' : 'AR'}
          </Text>
        </TouchableOpacity>
      </View>

      <CardDetails company={company} />

      <Dialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title={t('order.whatsapp_number_title')}
        confirmText={loading ? t('order.please_wait') : t('confirm')}
        onConfirm={handleConfirm}
        showActions={!loading}
      >
        <TextInput
          placeholder={t('order.whatsapp_placeholder')}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          className="border-[1px] border-gray-300 rounded-lg text-black px-4 py-2  placeholder:text-gray-400"
        />
      </Dialog>
    </View>
  );
}
