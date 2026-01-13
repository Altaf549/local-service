import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Button } from '../../components/Button/Button';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { pickFromCamera, pickFromGallery } from '../../utils/imagePicker';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  currentProfilePhoto: string | null;
  currentAddress?: string;
  onSave: (name: string, profilePhoto: string | null, currentPassword: string, address?: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  currentName,
  currentProfilePhoto,
  currentAddress,
  onSave
}) => {
  const { theme } = useTheme();
  const [name, setName] = useState(currentName);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(currentProfilePhoto);
  const [address, setAddress] = useState(currentAddress || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    setLoading(true);
    try {
      await onSave(name.trim(), profilePhoto, currentPassword.trim(), address.trim());
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName(currentName);
    setProfilePhoto(currentProfilePhoto);
    setAddress(currentAddress || '');
    setCurrentPassword('');
    onClose();
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
            <Text style={[styles.title, { color: theme.colors.text }]}>Edit Profile</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            {/* Profile Photo Section */}
            <View style={styles.photoSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Profile Photo</Text>
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

            {/* Name Section */}
            <View style={styles.nameSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Name</Text>
              <View style={[styles.nameInput, { backgroundColor: theme.colors.card }]}>
                <MaterialIcons name="person" size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.nameText, { color: theme.colors.text }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline={false}
                  maxLength={50}
                />
              </View>
            </View>

            {/* Current Password Section */}
            <View style={styles.nameSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Current Password</Text>
              <View style={[styles.nameInput, { backgroundColor: theme.colors.card }]}>
                <MaterialIcons name="lock" size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.nameText, { color: theme.colors.text }]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter your current password"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={true}
                  multiline={false}
                />
              </View>
            </View>

            {/* Address Section */}
            <View style={styles.nameSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Address</Text>
              <View style={[styles.nameInput, { backgroundColor: theme.colors.card }]}>
                <MaterialIcons name="location-on" size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.nameText, { color: theme.colors.text }]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
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
    flex: 1,
    padding: moderateScale(20),
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: moderateVerticalScale(30),
  },
  sectionTitle: {
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
  nameInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateVerticalScale(12),
    borderRadius: moderateScale(8),
  },
  nameText: {
    fontSize: moderateScale(16),
    marginLeft: moderateScale(10),
    flex: 1,
  },
  footer: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateVerticalScale(20),
  },
});

export default EditProfileModal;
