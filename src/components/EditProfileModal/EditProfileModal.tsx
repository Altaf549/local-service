import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Button } from '../../components/Button/Button';
import { PasswordInput } from '../../components/PasswordInput/PasswordInput';
import { TextInputWithLabel } from '../../components/TextInputWithLabel/TextInputWithLabel';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { pickFromCamera, pickFromGallery } from '../../utils/imagePicker';
import { useFormValidation, commonValidationRules } from '../../hooks/useFormValidation';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  currentProfilePhoto: string | null;
  currentAddress?: string;
  currentEmail?: string;
  currentPhone?: string;
  editMode: 'profile' | 'email' | 'phone' | 'password';
  onSave: (data: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  currentName,
  currentProfilePhoto,
  currentAddress,
  currentEmail,
  currentPhone,
  editMode,
  onSave
}) => {
  const { theme } = useTheme();
  const [name, setName] = useState(currentName);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(currentProfilePhoto);
  const [address, setAddress] = useState(currentAddress || '');
  const [email, setEmail] = useState(currentEmail || '');
  const [phone, setPhone] = useState(currentPhone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Get validation rules based on edit mode
  const getValidationRules = () => {
    const baseRules = {
      currentPassword: commonValidationRules.currentPassword,
    };

    if (editMode === 'profile') {
      return {
        ...baseRules,
        name: commonValidationRules.name,
      };
    } else if (editMode === 'email') {
      return {
        ...baseRules,
        email: commonValidationRules.email,
      };
    } else if (editMode === 'phone') {
      return {
        ...baseRules,
        phone: commonValidationRules.phone,
      };
    } else if (editMode === 'password') {
      return {
        ...baseRules,
        newPassword: commonValidationRules.password,
        confirmPassword: {
          required: true,
          custom: (value: string) => value === newPassword || 'Passwords do not match',
        },
      };
    }
    return baseRules;
  };

  const {errors, validateForm, setFieldError, clearErrors} = useFormValidation(getValidationRules());

  const handleChoosePhoto = async () => {
    try {
      const result = await pickFromGallery();
      if (result) {
        setProfilePhoto(result.uri);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to pick image from gallery');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await pickFromCamera();
      if (result) {
        setProfilePhoto(result.uri);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to take photo');
    }
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: handleTakePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: handleChoosePhoto,
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
    // Reset errors
    clearErrors();

    // Prepare form data based on edit mode
    let formData: any = {
      currentPassword,
    };

    if (editMode === 'profile') {
      formData.name = name;
    } else if (editMode === 'email') {
      formData.email = email;
    } else if (editMode === 'phone') {
      formData.phone = phone;
    } else if (editMode === 'password') {
      formData.newPassword = newPassword;
      formData.confirmPassword = confirmPassword;
    }

    // Validate form
    const isValid = validateForm(formData);

    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      const saveData: any = {
        editMode,
        currentPassword: currentPassword.trim(),
      };

      if (editMode === 'profile') {
        saveData.name = name.trim();
        saveData.address = address.trim();
        saveData.profilePhoto = profilePhoto;
      } else if (editMode === 'email') {
        saveData.email = email.trim();
      } else if (editMode === 'phone') {
        saveData.phone = phone.trim();
      } else if (editMode === 'password') {
        saveData.newPassword = newPassword.trim();
      }

      await onSave(saveData);
      //onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
      // Don't call onClose() on error to keep modal open
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName(currentName);
    setProfilePhoto(currentProfilePhoto);
    setAddress(currentAddress || '');
    setEmail(currentEmail || '');
    setPhone(currentPhone || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  const getModalTitle = () => {
    switch (editMode) {
      case 'email':
        return 'Edit Email';
      case 'phone':
        return 'Edit Phone';
      case 'password':
        return 'Change Password';
      default:
        return 'Edit Profile';
    }
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
            <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text }]}>{getModalTitle()}</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            {/* Profile Photo Section - Only for profile edit mode */}
            {editMode === 'profile' && (
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
                    onPress={showPhotoOptions}
                  >
                    <MaterialIcons name="camera-alt" size={20} color={theme.colors.background} />
                    <Text style={[styles.photoButtonText, { color: theme.colors.background }]}>
                      Change Photo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Name Section - Only for profile edit mode */}
            {editMode === 'profile' && (
              <View style={styles.nameSection}>
                <TextInputWithLabel
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  error={errors.name}
                />
              </View>
            )}

            {/* Email Section - Only for email edit mode */}
            {editMode === 'email' && (
              <View style={styles.nameSection}>
                <TextInputWithLabel
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />
              </View>
            )}

            {/* Phone Section - Only for phone edit mode */}
            {editMode === 'phone' && (
              <View style={styles.nameSection}>
                <TextInputWithLabel
                  label="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  error={errors.phone}
                />
              </View>
            )}

            {/* New Password Section - Only for password edit mode */}
            {editMode === 'password' && (
              <>
                <View style={styles.nameSection}>
                  <PasswordInput
                    label="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter your new password"
                    error={errors.newPassword}
                  />
                </View>

                <View style={styles.nameSection}>
                  <PasswordInput
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your new password"
                    error={errors.confirmPassword}
                  />
                </View>
              </>
            )}

            {/* Address Section - Only for profile edit mode */}
            {editMode === 'profile' && (
              <View style={styles.nameSection}>
                <TextInputWithLabel
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
            )}

            {/* Current Password Section - Always shown */}
            <View style={styles.nameSection}>
              <PasswordInput
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter your current password"
                error={errors.currentPassword}
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
    borderBottomColor: '#e0e0e0',
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
  nameSection: {
    marginBottom: moderateVerticalScale(20),
  },
  footer: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateVerticalScale(20),
  },
});

export default EditProfileModal;
