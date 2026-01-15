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
  updateServicemanExperience,
  addServicemanExperience
} from '../../redux/slices/servicemanExperienceSlice';
import {
  updateBrahmanExperience as updateBrahmanExperienceRedux,
  addBrahmanExperience as addBrahmanExperienceRedux
} from '../../redux/slices/brahmanExperienceSlice';

export interface ExperienceData {
  id?: number;
  title: string;
  company?: string;
  description: string;
  years: number;
  start_date: string;
  end_date: string;
}

interface AddExperienceModalProps {
  visible: boolean;
  onClose: () => void;
  itemType: 'serviceman' | 'brahman';
  onSuccess: () => void;
  editingItem?: ExperienceData | null;
}

const AddExperienceModal: React.FC<AddExperienceModalProps> = ({
  visible,
  onClose,
  itemType,
  onSuccess,
  editingItem,
}) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { updateLoading, addLoading, updateError, addError } = useAppSelector(state => 
    itemType === 'serviceman' 
      ? state.servicemanExperience
      : state.brahmanExperience
  );

  const [formData, setFormData] = useState<ExperienceData>({
    title: '',
    company: '',
    description: '',
    years: 1,
    start_date: '',
    end_date: '',
  });

  const [errors, setErrors] = useState<{
    title?: string;
    company?: string;
    description?: string;
    years?: string;
    start_date?: string;
    end_date?: string;
  }>({});
  
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({
        title: '',
        company: '',
        description: '',
        years: 1,
        start_date: '',
        end_date: '',
      });
    }
    setErrors({
        title: undefined,
        company: undefined,
        description: undefined,
        years: undefined,
        start_date: undefined,
        end_date: undefined,
      });
  }, [editingItem, visible]);

  const validateForm = () => {
    const newErrors: {
      title?: string;
      company?: string;
      description?: string;
      years?: string;
      start_date?: string;
      end_date?: string;
    } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.company?.trim()) {
      newErrors.company = `${itemType === 'serviceman' ? 'Company' : 'Organization'} is required`;
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.years || formData.years < 1) {
      newErrors.years = 'Years must be at least 1';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        if (editingItem) {
          // Update existing experience
          if (itemType === 'serviceman') {
            const updateData = {
              title: formData.title,
              company: formData.company || '',
              description: formData.description,
              years: formData.years,
              start_date: formData.start_date,
              end_date: formData.end_date,
            };
            const result = await dispatch(updateServicemanExperience({ id: editingItem.id!, experienceData: updateData }));
            if (updateServicemanExperience.fulfilled.match(result)) {
              onSuccess();
            }
          } else {
            const updateData = {
              title: formData.title,
              organization: formData.company || '',
              description: formData.description,
              years: formData.years,
              start_date: formData.start_date,
              end_date: formData.end_date,
            };
            const result = await dispatch(updateBrahmanExperienceRedux({ id: editingItem.id!, experienceData: updateData }));
            if (updateBrahmanExperienceRedux.fulfilled.match(result)) {
              onSuccess();
            }
          }
        } else {
          // Add new experience
          const newData = {
            title: formData.title,
            company: formData.company || '',
            description: formData.description,
            years: formData.years,
            start_date: formData.start_date,
            end_date: formData.end_date,
          };
          
          if (itemType === 'serviceman') {
            const result = await dispatch(addServicemanExperience(newData));
            if (addServicemanExperience.fulfilled.match(result)) {
              onSuccess();
            }
          } else {
            const brahmanData = {
              title: formData.title,
              organization: formData.company || '',
              description: formData.description,
              years: formData.years,
              start_date: formData.start_date,
              end_date: formData.end_date,
            };
            const result = await dispatch(addBrahmanExperienceRedux(brahmanData));
            if (addBrahmanExperienceRedux.fulfilled.match(result)) {
              onSuccess();
            }
          }
        }
      } catch (error) {
        console.error('Failed to save experience:', error);
      }
    }
  };

  const updateFormData = (field: keyof ExperienceData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getTitle = () => {
    if (editingItem) {
      return `Edit ${itemType === 'serviceman' ? 'Service' : 'Puja'} Experience`;
    }
    return `Add ${itemType === 'serviceman' ? 'Service' : 'Puja'} Experience`;
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
              placeholder="e.g., Senior Plumbing Technician"
              error={errors.title}
            />
          </View>

          <View style={styles.formGroup}>
            <TextInputWithLabel
              label={itemType === 'serviceman' ? 'Company' : 'Temple/Organization'}
              value={formData.company || ''}
              onChangeText={(value) => updateFormData('company', value)}
              placeholder={itemType === 'serviceman' ? 'e.g., ABC Plumbing Services' : 'e.g., Shiva Temple'}
              error={errors.company}
            />
          </View>

          <View style={styles.formGroup}>
            <TextInputWithLabel
              label="Description"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              placeholder="Describe your role and responsibilities..."
              error={errors.description}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <TextInputWithLabel
              label="Years of Experience"
              value={formData.years.toString()}
              onChangeText={(value) => updateFormData('years', parseInt(value) || 0)}
              placeholder="e.g., 5"
              error={errors.years}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Start Date</Text>
            <TouchableOpacity
              style={[styles.datePickerButton, { borderColor: errors.start_date ? theme.colors.error : theme.colors.border }]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={[styles.dateText, { color: theme.colors.text }]}>
                {formData.start_date || 'Select start date'}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color={theme.colors.textSecondary} style={styles.dateIcon} />
            </TouchableOpacity>
            {errors.start_date && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.start_date}
              </Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>End Date</Text>
            <TouchableOpacity
              style={[styles.datePickerButton, { borderColor: errors.end_date ? theme.colors.error : theme.colors.border }]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={[styles.dateText, { color: theme.colors.text }]}>
                {formData.end_date || 'Select end date'}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color={theme.colors.textSecondary} style={styles.dateIcon} />
            </TouchableOpacity>
            {errors.end_date && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.end_date}
              </Text>
            )}
          </View>
        </ScrollView>
        
        {/* Date Pickers */}
        {showStartDatePicker && (
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={formData.start_date ? new Date(formData.start_date) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  const formattedDate = selectedDate.toISOString().split('T')[0];
                  updateFormData('start_date', formattedDate);
                }
                setShowStartDatePicker(false);
              }}
              maximumDate={formData.end_date ? new Date(formData.end_date) : undefined}
            />
            <TouchableOpacity
              style={[styles.datePickerButton, { backgroundColor: theme.colors.background }]}
              onPress={() => setShowStartDatePicker(false)}
            >
              <Text style={[styles.datePickerButtonText, { color: theme.colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {showEndDatePicker && (
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={formData.end_date ? new Date(formData.end_date) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  const formattedDate = selectedDate.toISOString().split('T')[0];
                  updateFormData('end_date', formattedDate);
                }
                setShowEndDatePicker(false);
              }}
              minimumDate={formData.start_date ? new Date(formData.start_date) : undefined}
            />
            <TouchableOpacity
              style={[styles.datePickerButton, { backgroundColor: theme.colors.background }]}
              onPress={() => setShowEndDatePicker(false)}
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
)};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
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
      paddingVertical: moderateVerticalScale(12),
      backgroundColor: '#ffffff',
  },
  dateInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
  dateIcon: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
});

export default AddExperienceModal;
