import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import Dialog from './Dialog';
import { Company } from '../types/index.js';
import { TANKER_TYPE_KEYS } from '../i18n/i18n.js';
import { useTranslation } from 'react-i18next';
import { handleWhatsappOrder } from '../utils/index.js';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type CardProps = {
  company: Company;
  isTablet: boolean;
};

export default function Card({ company, isTablet }: CardProps) {
  const navigation = useNavigation<NavigationProp>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { t } = useTranslation();

  const BASE_URL = 'https://hawia.sa/admin/assets/img/company-logos/';

  const handleOrder = () => setDialogVisible(true);

const handleConfirm = () => {
  handleWhatsappOrder(phoneNumber, company, 
    () => setDialogVisible(false), 
    () => setPhoneNumber('')
  );
};
  
  const logoUrl = company.company_logo
    ? `${BASE_URL}${company.company_logo}`
    : null;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', { company })}
      style={{
        flex: isTablet ? 0.48 : 1,
        marginBottom: 16,
        marginHorizontal: isTablet ? 4 : 8,
        marginTop: 10,
      }}
      className="bg-white rounded-xl shadow p-4"
    >
      <View className="flex flex-col  justify-between">
        <View>
          {logoUrl ? (
            <Image
              source={{ uri: logoUrl }}
              className="w-full h-48 rounded-lg mb-3"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-48 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
              <Text className="text-gray-500">No Image</Text>
            </View>
          )}

          <Text className="text-lg font-semibold mb-1">
            {company.company_name || 'Unnamed Company'}
          </Text>

          {company.company_city && (
            <Text className="text-gray-600 mb-3">{company.company_city}</Text>
          )}

          <View className="flex-row items-center flex-wrap bg-gray-100 w-full px-3 rounded-lg py-2 mb-3">
            {Array.isArray(company.tankers) && company.tankers.length > 0 ? (
              company.tankers.map((hawia, index) => (
                <View
                  key={`company-${company.id}-tanker-${hawia.id}`}
                  className="w-full rounded-lg mb-2"
                >
                  <View className="flex flex-row justify-between items-center p-2">
                    <Text>
                      {t(
                        TANKER_TYPE_KEYS[hawia.tanker_type] ||
                          hawia.tanker_type,
                      )}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <Text>{hawia.tanker_price}</Text>
                      <Image
                        source={require('../assets/curruncy-removebg-preview.png')}
                        className="w-6 h-6 rounded-lg"
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
        </View>

        <View className="absolute top-52 right-0">
          <TouchableOpacity
            onPress={handleOrder}
            className="border-[1px] rounded-lg border-blue-400 p-2"
          >
            <Text className="text-blue-500 w-full text-center">
              {t('order_now')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Dialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title="Contact us Via WhatsApp"
        confirmText="Contact us"
        onConfirm={handleConfirm}
      >
        <View>
          <TextInput
            placeholder="Enter your phone number..."
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            className="w-full text-black px-4 py-2 rounded-xl border border-gray-200 placeholder:text-gray-400"
          />
        </View>
      </Dialog>
    </TouchableOpacity>
  );
}
