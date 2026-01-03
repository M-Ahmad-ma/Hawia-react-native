import React, { useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import CardDetails from '../components/CardDetails';
import Dialog from '../components/Dialog';
import { RootStackParamList } from '../App';
import { saveWhatsapp, openChat } from '../api/index.js';
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n.js"

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

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
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  return (
    <View className="flex-1 bg-white relative">

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
            {i18n.language === "ar" ? "Eng" : "AR"}
          </Text>
        </TouchableOpacity>
      </View>

      <CardDetails company={company} />

      <View>
        <TouchableOpacity
          onPress={() => setDialogVisible(true)}
          className="bg-blue-600 w-36 px-1 py-3 ml-2 rounded-lg"
        >
          <Text className="text-center text-white font-semibold">
            {t("order_now")}
          </Text>
        </TouchableOpacity>
      </View>

      <Dialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title="Enter Your WhatsApp Number"
        confirmText={loading ? 'Please wait...' : 'Confirm'}
        onConfirm={handleConfirm}
        showActions={!loading}
      >
        <TextInput
          placeholder="05XXXXXXXX"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          className="border-[1px] border-gray-300 rounded-lg text-black px-4 py-2  placeholder:text-gray-400"
        />
      </Dialog>
    </View>
  );
}
