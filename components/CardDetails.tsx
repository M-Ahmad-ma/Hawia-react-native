import { Image, Text, View } from 'react-native';
import { Company } from '../Data/item';

type Props = {
  company: Company;
};

function CardDetails({ company }: Props) {
  return (
    <View className="bg-white  p-4 mb-3 ">
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
    </View>
  );
}

export default CardDetails;
