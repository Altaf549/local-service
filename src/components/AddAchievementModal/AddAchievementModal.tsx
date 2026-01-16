import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { TextInputWithLabel } from '../TextInputWithLabel/TextInputWithLabel';
import { Button } from '../Button/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  updateExistingServicemanAchievement,
  addNewServicemanAchievement
} from '../../redux/slices/servicemanAchievementSlice';
import {
  updateExistingBrahmanAchievement,
  addNewBrahmanAchievement
} from '../../redux/slices/brahmanAchievementSlice';

export interface AchievementData {
  id?: number;
  title: string;
  description: string;
  achieved_date: string;
}

interface AddAchievementModalProps {
  visible: boolean;
  onClose: () => void;
  itemType: 'serviceman' | 'brahman';
  onSuccess: () => void;
  editingItem?: AchievementData | null;
}

const AddAchievementModal: React.FC<AddAchievementModalProps> = ({
  visible,
  onClose,
  itemType,
  onSuccess,
  editingItem,
}) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { updateLoading, addLoading, updateError, addError } = useAppSelector(state => ({
    updateLoading: false, // TODO: Implement separate loading states in slices
    addLoading: state.servicemanAchievements.loading,
    updateError: null,
    addError: state.servicemanAchievements.error,
  }));
  const [formData, setFormData] = useState<AchievementData>({
    title: '',
    description: '',
    achieved_date: '',
  });

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    achieved_date?: string;
  }>({});

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({
        title: '',
        description: '',
        achieved_date: '',
      });
    }
    setErrors({
      title: undefined,
      description: undefined,
      achieved_date: undefined,
    });
  }, [editingItem, visible]);

  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      achieved_date?: string;
    } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.achieved_date) {
      newErrors.achieved_date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        if (editingItem) {
          // Update existing achievement
          if (itemType === 'serviceman') {
            const updateData = {
              title: formData.title,
              description: formData.description,
              achieved_date: formData.achieved_date,
            };
            const result = await dispatch(updateExistingServicemanAchievement({ id: editingItem.id!, achievementData: updateData }));
            if (updateExistingServicemanAchievement.fulfilled.match(result)) {
              onSuccess();
            }
          } else {
            const updateData = {
              title: formData.title,
              description: formData.description,
              achieved_date: formData.achieved_date,
            };
            const result = await dispatch(updateExistingBrahmanAchievement({ id: editingItem.id!, achievementData: updateData }));
            if (updateExistingBrahmanAchievement.fulfilled.match(result)) {
              onSuccess();
            }
          }
        } else {
          // Add new achievement
          const newData = {
            title: formData.title,
            description: formData.description,
            achieved_date: formData.achieved_date,
          };

          if (itemType === 'serviceman') {
            const result = await dispatch(addNewServicemanAchievement(newData));
            if (addNewServicemanAchievement.fulfilled.match(result)) {
              onSuccess();
            }
          } else {
            const result = await dispatch(addNewBrahmanAchievement(newData));
            if (addNewBrahmanAchievement.fulfilled.match(result)) {
              onSuccess();
            }
          }
        }
      } catch (error) {
        console.error('Failed to save achievement:', error);
      }
    }
  };

  const updateFormData = (field: keyof AchievementData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getTitle = () => {
    if (editingItem) {
      return `Edit ${itemType === 'serviceman' ? 'Service' : 'Puja'} Achievement`;
    }
    return `Add ${itemType === 'serviceman' ? 'Service' : 'Puja'} Achievement`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date(formData.achieved_date || new Date());
    setShowDatePicker(false);
    if (event.type !== 'dismissed') {
      const formattedDate = currentDate.toISOString().split('T')[0];
      updateFormData('achieved_date', formattedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <TextInputWithLabel
              label="Title"
              value={formData.title}
              onChangeText={(value) => updateFormData('title', value)}
              placeholder="e.g., Employee of the Year"
              error={errors.title}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Achievement Date</Text>
            <TouchableOpacity
              style={[styles.datePickerButton, { borderColor: errors.achieved_date ? theme.colors.error : theme.colors.border, backgroundColor: theme.colors.card}]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dateText, { color: theme.colors.text }]}>
                {formData.achieved_date || 'Select date'}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color={theme.colors.textSecondary} style={styles.dateIcon} />
            </TouchableOpacity>
            {errors.achieved_date && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.achieved_date}
              </Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <TextInputWithLabel
              label="Description"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              placeholder="Describe your achievement and its significance..."
              error={errors.description}
              multiline
              numberOfLines={4}
            />
          </View>
        </ScrollView>

        {/* Date Picker */}
        {showDatePicker && (
          <View style={[styles.datePickerContainer, { shadowColor: theme.colors.primary }]}>
            <DateTimePicker
              value={formData.achieved_date ? new Date(formData.achieved_date) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
            <TouchableOpacity
              style={[styles.datePickerButton, { backgroundColor: theme.colors.card }]}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={[styles.datePickerButtonText, { color: theme.colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Action Buttons */}
        <View style={[styles.bottomActions, { borderTopColor: theme.colors.border }]}>
          <Button
            title="Cancel"
            onPress={onClose}
            variant="outline"
            style={{ flex: 1 }}
          />

          <Button
            title="Save"
            onPress={handleSubmit}
            loading={editingItem ? updateLoading : addLoading}
            style={{ flex: 2 }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateVerticalScale(12)
  },
  dateText: {
    fontSize: moderateScale(16),
    flex: 1,
  },
  dateIcon: {
    marginLeft: moderateScale(8),
  },
  errorText: {
    fontSize: moderateScale(12),
    marginTop: moderateVerticalScale(4),
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
    shadowOffset: {
      width: 0,
      height: moderateScale(-2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 5,
  },
  datePickerButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(12),
    borderTopWidth: 1,
    gap: moderateScale(12),
  },
});

export default AddAchievementModal;