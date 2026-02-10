import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ViewStyle,
  StyleProp,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';

type DialogProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showActions?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export default function Dialog({
  visible,
  onClose,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  showActions = true,
  containerStyle,
  children,
}: DialogProps) {
  const { t } = useTranslation();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center bg-black/50 px-4"
      >
        <View
          className="bg-white w-80 rounded-2xl px-4 py-4 shadow-lg"
          style={containerStyle}
        >
          {title ? (
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              {title}
            </Text>
          ) : null}

          {message ? (
            <Text className="text-gray-600 mb-5">{message}</Text>
          ) : null}

          {children}

          {showActions && (
            <View className="flex-row justify-end gap-2 mt-2">
              <TouchableOpacity
                onPress={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                <Text className="text-gray-700 font-medium">
                  {cancelText || t('cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  onConfirm?.();
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-[#FF8C42]"
              >
                <Text className="text-white font-medium">
                  {confirmText || t('confirm')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
