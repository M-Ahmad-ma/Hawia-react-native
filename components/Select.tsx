import { useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';

type SelectProps = {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export default function Select({
  options,
  value,
  onChange,
  placeholder,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <View className="w-fit ">
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="border border-gray-400 rounded-xl px-4 w-full py-3 bg-white flex-row justify-between items-center"
      >
        <Text className="text-gray-800">
          {value || placeholder || 'Select'}
        </Text>
      </TouchableOpacity>

      {open && (
        <View
          className="absolute top-12 right-0 !z-50 w-52 border border-gray-300 rounded-xl bg-white shadow-lg max-h-48"
          style={{ zIndex: 100 }}
        >
          <ScrollView nestedScrollEnabled>
            {options.map(opt => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  onChange?.(opt);
                  setOpen(false);
                }}
                className="px-4 py-3 border-b border-gray-200"
              >
                <Text>{opt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
