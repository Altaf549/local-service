import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';

interface CancelModalProps {
  visible: boolean;
  title: string;
  message: string;
  placeholder: string;
  cancelButtonTitle: string;
  confirmButtonTitle: string;
  cancellationReason: string;
  onCancel: () => void;
  onConfirm: () => void;
  onReasonChange: (reason: string) => void;
  loading?: boolean;
}

const CancelModal: React.FC<CancelModalProps> = ({
  visible,
  title,
  message,
  placeholder,
  cancelButtonTitle,
  confirmButtonTitle,
  cancellationReason,
  onCancel,
  onConfirm,
  onReasonChange,
  loading = false,
}) => {
  const { theme } = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
        <TextInput
          style={[styles.modalInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
          value={cancellationReason}
          onChangeText={onReasonChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          multiline
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: theme.colors.surface }]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>
              {cancelButtonTitle}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: theme.colors.error }]}
            onPress={onConfirm}
            disabled={loading}
          >
            <Text style={[styles.modalButtonText, { color: theme.colors.background }]}>
              {confirmButtonTitle}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: moderateScale(12),
    padding: moderateScale(24),
    margin: moderateScale(20),
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: moderateVerticalScale(16),
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: moderateScale(16),
    marginBottom: moderateVerticalScale(16),
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    fontSize: moderateScale(16),
    minHeight: moderateVerticalScale(80),
    textAlignVertical: 'top',
    marginBottom: moderateVerticalScale(20),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: moderateScale(8),
    paddingVertical: moderateVerticalScale(12),
    paddingHorizontal: moderateScale(24),
    minWidth: moderateScale(120),
  },
  modalButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CancelModal;
