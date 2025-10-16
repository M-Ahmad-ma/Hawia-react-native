import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../App';
import CardDetails from '../components/CardDetails';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const { company } = route.params;

  return (
    <View className="flex-1 bg-white">
      <CardDetails company={company} />
      <View className="p-7">
        <Text className="text-2xl ">Contact</Text>
        <View className="w-20 h-[2px] bg-black mb-2"></View>
        <Text className="text-sm font-medium">Enter your Card Number</Text>
        <TextInput
          placeholder="XXXX..."
          className="border-[1px] mt-2 border-gray-600 rounded-lg text-black placeholder:text-gray-400"
        />
        <View>
          <TouchableOpacity className="bg-green-600 w-full px-1 py-2 rounded-lg mt-4 flex justify-end">
            <Text className="text-center text-white font-normal">
              Order Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
