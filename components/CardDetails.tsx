import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Company } from '../types';
import { useTranslation } from "react-i18next";
import { TANKER_TYPE_KEYS } from "../i18n/i18n.js";


export default function CardDetails({ company }: { company: Company }) {
  const [selectedTankers, setSelectedTankers] = useState<number[]>([]);
  const { t } = useTranslation();


  const BASE_URL = 'https://hawia.sa/admin/assets/img/company-logos/';
  const logoUrl = company.company_logo
    ? `${BASE_URL}${company.company_logo}`
    : null;

  return (
    <View className="bg-white p-2">
      <Image
        source={{ uri: logoUrl }}
        className="w-full h-48 rounded-lg mb-3"
      />
      <Text className="text-lg font-semibold mb-1">{company.company_name}</Text>
      <Text className="text-gray-600 mb-3">{company.company_city}</Text>

      <View className="flex-row flex-wrap bg-gray-200 w-full  rounded-lg py-3 px-4 pr-6 mb-3">
        <Text className="w-full font-semibold text-lg ml-2">
          {t("available_hawias")}
        </Text>

        {Array.isArray(company.tankers) && company.tankers.length > 0 ? (
          company.tankers.map((hawia, index) => (
            <View key={index} className="w-full rounded-lg mr-2 mb-2">
              <View className="flex items-center flex-row justify-between relative p-2 ">
                <Text className="w-full">{t(TANKER_TYPE_KEYS[hawia.tanker_type] || hawia.tanker_type)}</Text>
                <View className="flex flex-row-reverse items-center gap-1 absolute right-0">
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
            {t("no_hawias")}
          </Text>
        )}
      </View>
    </View>
  );
}
