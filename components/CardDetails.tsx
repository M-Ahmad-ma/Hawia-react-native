import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { Company } from '../types';
import { useTranslation } from 'react-i18next';
import { TANKER_TYPE_KEYS } from '../i18n/i18n.js';
import Dialog from './Dialog';
import { handleWhatsappOrder } from '../utils/index.js';

export default function CardDetails({ company }: { company: Company }) {
  const [selectedTankers, setSelectedTankers] = useState<number[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { t } = useTranslation();

  const BASE_URL = 'https://hawia.sa/admin/assets/img/company-logos/';
  const logoUrl = company.company_logo
    ? `${BASE_URL}${company.company_logo}`
    : undefined;

  const handleOrder = () => setDialogVisible(true);

  const handleConfirm = () => {
    handleWhatsappOrder(
      phoneNumber,
      company,
      () => setDialogVisible(false),
      () => setPhoneNumber(''),
    );
  };

  return (
    <View className="bg-white p-2">
      <Image
        source={{ uri: logoUrl }}
        className="w-full h-48 rounded-lg mb-3"
      />
      <Text className="text-lg font-semibold mb-1">{company.company_name}</Text>
      <Text className="text-gray-600 mb-3">{company.company_city}</Text>

      <View className="flex-row flex-wrap bg-gray-200 w-full  rounded-lg py-3 px-4 mb-3">
        <Text className="w-full font-semibold text-lg ms-2">
          {t('available_hawias')}
        </Text>

        {Array.isArray(company.tankers) && company.tankers.length > 0 ? (
          company.tankers.map((hawia, index) => (
            <View key={index} className="w-full rounded-lg me-2 mb-2">
              <View className="flex flex-row items-center justify-between p-2">
                <Text className="flex-1">
                  {t(TANKER_TYPE_KEYS[hawia.tanker_type] || hawia.tanker_type)}
                </Text>
                <View className="flex flex-row items-center gap-1">
                  <Text>{hawia.tanker_price}</Text>
                  <Image
                    source={require('../assets/curruncy-removebg-preview.png')}
                    className="w-8 h-8 rounded-lg"
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-gray-400 text-sm italic mb-2">
            {t('no_hawias')}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleOrder}
        className="bg-[#FF8C42] p-4 rounded-xl"
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {t('order_now')}
        </Text>
      </TouchableOpacity>

      <Dialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title={t('order.dialog_title')}
        confirmText={t('order.confirm')}
        onConfirm={handleConfirm}
      >
        <View>
          <TextInput
            placeholder={t('order.phone_placeholder')}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            className="w-full text-black px-4 py-2 rounded-xl border border-gray-200 placeholder:text-gray-400"
          />
        </View>
      </Dialog>
    </View>
  );
}
