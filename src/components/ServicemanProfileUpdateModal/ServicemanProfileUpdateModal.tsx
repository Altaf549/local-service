import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Button } from '../Button/Button';
import { TextInputWithLabel } from '../TextInputWithLabel/TextInputWithLabel';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { pickFromCamera, pickFromGallery } from '../../utils/imagePicker';
import { useFormValidation, commonValidationRules } from '../../hooks/useFormValidation';
import { ImagePickerResult } from '../../utils/imagePicker';
import { USER_ROLES } from '../../constant/Routes';

interface ServicemanProfileUpdateModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  currentGovernmentId?: string;
  currentAddress?: string;
  currentProfilePhoto?: string | null;
  currentIdProofImage?: string | null;
  userType: 'serviceman' | 'brahman';
  existingData?: any;
}

const ServicemanProfileUpdateModal: React.FC<ServicemanProfileUpdateModalProps> = ({
  visible,
  onClose,
  onSave,
  currentGovernmentId = '',
  currentAddress = '',
  currentProfilePhoto = null,
  currentIdProofImage = null,
  userType,
  existingData
}) => {
  const { theme } = useTheme();
  const [governmentId, setGovernmentId] = useState(existingData?.government_id || currentGovernmentId);
  const [address, setAddress] = useState(existingData?.address || currentAddress);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(existingData?.profile_photo || currentProfilePhoto);
  const [idProofImage, setIdProofImage] = useState<string | null>(existingData?.id_proof_image || currentIdProofImage);
  const [loading, setLoading] = useState(false);

  // Update form fields when existingData changes
  useEffect(() => {
    if (existingData) {
      setGovernmentId(existingData.government_id || '');
      setAddress(existingData.address || '');
      setProfilePhoto(existingData.profile_photo || null);
      setIdProofImage(existingData.id_proof_image || null);
    } else {
      setGovernmentId(currentGovernmentId);
      setAddress(currentAddress);
      setProfilePhoto(currentProfilePhoto);
      setIdProofImage(currentIdProofImage);
    }
  }, [existingData, currentGovernmentId, currentAddress, currentProfilePhoto, currentIdProofImage]);

  const validationRules = {
    governmentId: {
      required: true,
      minLength: 5,
      custom: (value: string) => {
        if (!value || value.trim().length < 5) {
          return 'Government ID must be at least 5 characters long';
        }
        return true;
      }
    },
    address: {
      required: true,
      minLength: 10,
      custom: (value: string) => {
        if (!value || value.trim().length < 10) {
          return 'Address must be at least 10 characters long';
        }
        return true;
      }
    }
  };

  const {errors, validateForm, setFieldError, clearErrors} = useFormValidation(validationRules);

  const handleChooseProfilePhoto = async () => {
    try {
      const result = await pickFromGallery();
      if (result) {
        setProfilePhoto(result.uri);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to pick image from gallery');
    }
  };

  const handleTakeProfilePhoto = async () => {
    try {
      const result = await pickFromCamera();
      if (result) {
        setProfilePhoto(result.uri);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to take photo');
    }
  };

  const handleChooseIdProof = async () => {
    try {
      const result = await pickFromGallery();
      if (result) {
        setIdProofImage(result.uri);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to pick image from gallery');
    }
  };

  const handleTakeIdProof = async () => {
    try {
      const result = await pickFromCamera();
      if (result) {
        setIdProofImage(result.uri);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to take photo');
    }
  };

  const showProfilePhotoOptions = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: handleTakeProfilePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: handleChooseProfilePhoto,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const showIdProofOptions = () => {
    Alert.alert(
      'ID Proof Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: handleTakeIdProof,
        },
        {
          text: 'Choose from Gallery',
          onPress: handleChooseIdProof,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleSave = async () => {
    clearErrors();

    const formData = {
      governmentId: governmentId.trim(),
      address: address.trim(),
    };

    const isValid = validateForm(formData);

    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      const saveData: any = {
        government_id: formData.governmentId,
        address: formData.address,
      };

      // Add profile photo if changed
      if (profilePhoto && profilePhoto !== currentProfilePhoto) {
        saveData.profile_photo = {
          uri: profilePhoto,
          type: 'image/jpeg',
          fileName: 'profile_photo.jpg',
        } as ImagePickerResult;
      }

      // Add ID proof if changed
      if (idProofImage && idProofImage !== currentIdProofImage) {
        saveData.id_proof_image = {
          uri: idProofImage,
          type: 'image/jpeg',
          fileName: 'id_proof_image.jpg',
        } as ImagePickerResult;
      }

      await onSave(saveData);
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setGovernmentId(currentGovernmentId);
    setAddress(currentAddress);
    setProfilePhoto(currentProfilePhoto);
    setIdProofImage(currentIdProofImage);
    clearErrors();
    onClose();
  };

  const getModalTitle = () => {
    return userType === USER_ROLES.SERVICEMAN ? 'Update Serviceman Profile' : 'Update Brahman Profile';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={[styles.title, { color: theme.colors.text }]}>{getModalTitle()}</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>
              {/* Profile Photo Section */}
              <View style={styles.photoSection}>
                <Text style={[styles.photoSectionTitle, { color: theme.colors.text }]}>Profile Photo</Text>
                <View style={styles.photoContainer}>
                  {profilePhoto ? (
                    <Image source={{ uri: profilePhoto }} style={styles.photo} />
                  ) : (
                    <View style={[styles.photoPlaceholder, { backgroundColor: theme.colors.primary }]}>
                      <MaterialIcons name="account-circle" size={60} color={theme.colors.background} />
                    </View>
                  )}
                  <TouchableOpacity
                    style={[styles.photoButton, { backgroundColor: theme.colors.primary }]}
                    onPress={showProfilePhotoOptions}
                  >
                    <MaterialIcons name="camera-alt" size={20} color={theme.colors.background} />
                    <Text style={[styles.photoButtonText, { color: theme.colors.background }]}>
                      Change Photo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ID Proof Image Section */}
              <View style={styles.photoSection}>
                <Text style={[styles.photoSectionTitle, { color: theme.colors.text }]}>ID Proof Image</Text>
                <View style={styles.photoContainer}>
                  {idProofImage ? (
                    <Image source={{ uri: idProofImage }} style={styles.photo} />
                  ) : (
                    <View style={[styles.photoPlaceholder, { backgroundColor: theme.colors.primary }]}>
                      <MaterialIcons name="badge" size={60} color={theme.colors.background} />
                    </View>
                  )}
                  <TouchableOpacity
                    style={[styles.photoButton, { backgroundColor: theme.colors.primary }]}
                    onPress={showIdProofOptions}
                  >
                    <MaterialIcons name="camera-alt" size={20} color={theme.colors.background} />
                    <Text style={[styles.photoButtonText, { color: theme.colors.background }]}>
                      {idProofImage ? 'Change ID Proof' : 'Add ID Proof'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Government ID Section */}
              <View style={styles.inputSection}>
                <TextInputWithLabel
                  label="Government ID"
                  value={governmentId}
                  onChangeText={setGovernmentId}
                  placeholder="Enter your Government ID (Aadhaar, PAN, etc.)"
                  error={errors.governmentId}
                />
              </View>

              {/* Address Section */}
              <View style={styles.inputSection}>
                <TextInputWithLabel
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your complete address"
                  multiline={true}
                  numberOfLines={3}
                  error={errors.address}
                />
              </View>
            </View>

            <View style={styles.footer}>
              <Button
                title={loading ? "Saving..." : "Save Changes"}
                onPress={handleSave}
                disabled={loading}
                fullWidth={true}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateVerticalScale(15),
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: moderateScale(8),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  placeholder: {
    width: moderateScale(40),
  },
  content: {
    padding: moderateScale(20),
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: moderateVerticalScale(30),
  },
  photoSectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(15),
  },
  photoContainer: {
    alignItems: 'center',
  },
  photo: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    marginBottom: moderateVerticalScale(15),
  },
  photoPlaceholder: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(15),
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateVerticalScale(8),
    borderRadius: moderateScale(20),
  },
  photoButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginLeft: moderateScale(8),
  },
  inputSection: {
    marginBottom: moderateVerticalScale(20),
  },
  footer: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateVerticalScale(20),
  },
});

export default ServicemanProfileUpdateModal;
