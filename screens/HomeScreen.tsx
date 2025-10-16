import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  FlatList,
  Animated,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import Card from '../components/Card';
import { Items } from '../Data/item';
import Select from '../components/Select';
import Dialog from '../components/Dialog';

const bgImages = [
  require('../assets/bg1.jpg'),
  require('../assets/bg2.jpg'),
  require('../assets/bg3.jpg'),
];

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [bgIndex, setBgIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const scrollY = new Animated.Value(0);

  function handleRegister() {
    setDialogVisible(true);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % bgImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const backgroundHeight = scrollY.interpolate({
    inputRange: [0, 400],
    outputRange: [300, 0],
    extrapolate: 'clamp',
  });

  return (
    <View className="h-fit bg-gray-100">
      <Animated.View
        style={{
          height: backgroundHeight,
        }}
      >
        <ImageBackground
          source={bgImages[bgIndex]}
          className="w-full justify-center items-center"
          resizeMode="cover"
        >
          <View className="bg-black/50 w-full h-full justify-center items-center">
            <Text className="text-white text-3xl font-bold mb-2">
              Rentify Services
            </Text>
            <Text className="text-white text-center px-4 mb-4">
              Find the best rental companies around you or register your own!
            </Text>
            <View className="flex-row gap-2 space-x-3">
              <TouchableOpacity
                onPress={() => navigation.navigate('NearbyCompanies')}
                className="bg-blue-600 px-4 py-2 rounded-full"
              >
                <Text className="text-white font-semibold">
                  Explore Companies
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRegister()}
                className="border-2 border-gray-400 px-4 py-2 rounded-full"
              >
                <Text className="text-white font-semibold">
                  Register Company
                </Text>
              </TouchableOpacity>
              <Dialog
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                title="Register your Company"
                message="Want to register a company? Contact us via WhatsApp."
                confirmText="Contact us via whatsapp"
              />
            </View>
          </View>
        </ImageBackground>
      </Animated.View>

      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <View className="p-4">
          <TouchableOpacity
            className="bg-indigo-600 py-3 rounded-xl mb-3"
            onPress={() => navigation.navigate('NearbyCompanies')}
          >
            <Text className="text-white text-center font-semibold">
              Find Nearby Companies
            </Text>
          </TouchableOpacity>

          <View className="flex-row gap-2 space-x-2 items-center">
            <TextInput
              placeholder="Search companies..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-black bg-white px-3 py-3 rounded-xl border border-gray-200"
            />

            <Select
              options={['All', 'Cars', 'Bikes', 'Electronics', 'Apartments']}
              value={selectedCategory || ''}
              onChange={value => setSelectedCategory(value)}
              placeholder="all cities"
            />
          </View>
        </View>

        <FlatList
          data={Items}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <Card company={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
}
