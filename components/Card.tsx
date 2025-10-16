import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Company } from '../Data/item';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Dialog from './Dialog';

type Props = {
  company: Company;
};

export default function Card({ company }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [dialogVisible, setDialogVisible] = useState(false);

  function handleOrder() {
    setDialogVisible(true);
  }

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', { company })}
      className="bg-white rounded-xl shadow p-4 mb-3"
    >
      <Image
        source={{ uri: company.image }}
        className="w-full h-48 rounded-lg mb-3"
        resizeMode="cover"
      />

      <Text className="text-lg font-semibold mb-1">{company.title}</Text>
      <Text className="text-gray-600 mb-3">{company.location}</Text>

      <View className="flex-row flex-wrap">
        {company.hawias.map((hawia, index) => (
          <View
            key={index}
            className="bg-gray-100 px-3 py-1 rounded-lg mr-2 mb-2"
          >
            <Text className="text-gray-800 text-sm">
              {hawia.size}: {hawia.price}
            </Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={() => handleOrder()}
        className="border-[1px] rounded-lg border-blue-400 p-2"
      >
        <Text className="text-blue-500 w-full text-center">Order Now</Text>
      </TouchableOpacity>

      <Dialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title="Contact us Via WhatsApp"
        confirmText="Contact us via WhatsApp"
      >
        <View className="mb-4">
          <TextInput
            placeholder="XXXX..."
            className="w-full px-3 py-4 rounded-xl border border-gray-200 placeholder:text-gray-400"
          />
        </View>
      </Dialog>
    </TouchableOpacity>
  );
}
