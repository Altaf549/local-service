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
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    if (formData.start_date && formData.end_date) {
      const calculatedYears = calculateYearsOfExperience(formData.start_date, formData.end_date);
      if (calculatedYears < 0.1) {
        newErrors.years = 'Experience duration must be at least 0.1 years';
      }
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

  const calculateYearsOfExperience = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) return 0;
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
    
    return Math.round(diffYears * 10) / 10; // Round to 1 decimal place
  };

  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const calculatedYears = calculateYearsOfExperience(formData.start_date, formData.end_date);
      setFormData(prev => ({ ...prev, years: calculatedYears }));
    }
  }, [formData.start_date, formData.end_date]);

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
            <Text style={[styles.label, { color: theme.colors.text }]}>Start Date</Text>
            <TouchableOpacity
              style={[styles.datePickerButton, { borderColor: errors.start_date ? theme.colors.error : theme.colors.border, backgroundColor: theme.colors.card }]}
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
              style={[styles.datePickerButton, { borderColor: errors.end_date ? theme.colors.error : theme.colors.border, backgroundColor: theme.colors.card }]}
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

          <View style={styles.formGroup}>
            <TextInputWithLabel
              label="Years of Experience"
              value={formData.years.toString()}
              onChangeText={() => {}}
              placeholder="Calculated from dates"
              error={errors.years}
              keyboardType="numeric"
              disabled={true}
            />
          </View>
        </ScrollView>

        {/* Date Pickers */}
        {showStartDatePicker && (
          <View style={[styles.datePickerContainer, { shadowColor: theme.colors.primary }]}>
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
          <View style={[styles.datePickerContainer, { shadowColor: theme.colors.primary }]}>
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
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(12),
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: moderateScale(4),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: moderateScale(16),
  },
  placeholder: {
    width: moderateScale(40),
  },
  content: {
    flex: 1,
    padding: moderateScale(16),
  },
  formGroup: {
    marginBottom: moderateVerticalScale(20),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    marginBottom: moderateVerticalScale(8),
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateVerticalScale(12),
  },
  dateInput: {
    height: moderateVerticalScale(48),
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default AddExperienceModal;
