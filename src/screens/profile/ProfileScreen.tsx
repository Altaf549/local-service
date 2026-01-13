import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import { Button } from '../../components/Button/Button';
import EditProfileModal from '../../components/EditProfileModal/EditProfileModal';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { updateUserProfile, deleteAccount } from '../../services/api';
import { setUserData } from '../../redux/slices/userSlice';
import { setIsUser } from '../../redux/slices/userSlice';
import { setAuthToken } from '../../network/axiosConfig';
import { CustomImage } from '../../components/CustomImage/CustomImage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, MAIN_TABS } from '../../constant/Routes';

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { userData } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [editMode, setEditMode] = React.useState<'profile' | 'email' | 'phone' | 'password'>('profile');

  // Debug: Log userData to see what we're working with
  console.log('ProfileScreen userData:', userData);

  const handleEditProfile = () => {
    setEditMode('profile');
    setEditModalVisible(true);
  };

  const handleEditEmail = () => {
    setEditMode('email');
    setEditModalVisible(true);
  };

  const handleEditPhone = () => {
    setEditMode('phone');
    setEditModalVisible(true);
  };

  const handleEditPassword = () => {
    setEditMode('password');
    setEditModalVisible(true);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    try {
      const response = await deleteAccount();
      
      if (response.success) {
        // Clear all stored data
        await AsyncStorage.multiRemove(['user_info', 'user_token']);
        
        // Clear Redux state
        dispatch(setUserData(null as any));
        dispatch(setIsUser(false));
        setAuthToken(null);
        
        Alert.alert(
          'Account Deleted',
          'Your account has been successfully deleted.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to home screen
                navigation.reset({
                  index: 0,
                  routes: [{ name: MAIN_TABS }],
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to delete account');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete account';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleSaveProfile = async (data: any) => {
  try {
    const updateData: any = {
      current_password: data.currentPassword,
    };

    if (data.editMode === 'profile') {
      updateData.name = data.name;
      
      if (data.address && data.address.trim()) {
        updateData.address = data.address.trim();
      }

      const currentPhoto = userData?.profile_photo_url || userData?.profile_photo;
      if (data.profilePhoto && data.profilePhoto !== currentPhoto) {
        updateData.profile_photo = {
          uri: data.profilePhoto,
          fileName: data.profilePhoto.split('/').pop() || 'profile_photo.jpg',
          type: 'image/jpeg',
        };
      }
    } else if (data.editMode === 'email') {
      updateData.email = data.email;
    } else if (data.editMode === 'phone') {
      updateData.mobile_number = data.phone;
    } else if (data.editMode === 'password') {
      updateData.new_password = data.newPassword;
    }

    const response = await updateUserProfile(updateData);
    
    if (response.success) {
      const updatedUserData = {
        ...userData,
        ...response.data,
      };
      
      dispatch(setUserData(updatedUserData));
      await AsyncStorage.setItem('user_info', JSON.stringify(updatedUserData));
      
      if (response.data.token) {
        await AsyncStorage.setItem('user_token', response.data.token);
        setAuthToken(response.data.token);
      }
      
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', response.message || 'Failed to update profile');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
    Alert.alert('Error', errorMessage);
    throw error;
  }
};

  const handleCloseModal = () => {
    setEditModalVisible(false);
  };

  if (!userData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header 
          title="Profile" 
        />
        <View style={styles.content}>
          <Text style={[styles.message, { color: theme.colors.text }]}>
            Please login to view your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Profile" 
      />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header with Image and Name */}
        <View style={styles.profileHeader}>
          <View style={styles.imageContainer}>
            {userData?.profile_photo_url || userData?.profile_photo ? (
              <CustomImage
                source={{ uri: userData.profile_photo_url || userData.profile_photo }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
                <MaterialIcons 
                  name="account-circle" 
                  size={moderateScale(60)} 
                  color={theme.colors.background} 
                />
              </View>
            )}
            <View style={styles.editImageOverlay}>
              <TouchableOpacity 
                style={[styles.editImageButton, { backgroundColor: theme.colors.surface }]}
                onPress={handleEditProfile}
              >
                <MaterialIcons 
                  name="edit" 
                  size={moderateScale(16)} 
                  color={theme.colors.primary} 
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.profileName, { color: theme.colors.text }]}>
            {userData?.name || 'N/A'}
          </Text>
          {userData?.address && (
            <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
              {userData.address}
            </Text>
          )}
        </View>

        {/* Email Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Email Address
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {userData?.email || 'N/A'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.editButtonSmall, { backgroundColor: theme.colors.primary }]}
              onPress={handleEditEmail}
            >
              <MaterialIcons 
                name="edit" 
                size={moderateScale(16)} 
                color={theme.colors.background} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Phone Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Phone Number
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {userData?.mobile_number || 'N/A'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.editButtonSmall, { backgroundColor: theme.colors.primary }]}
              onPress={handleEditPhone}
            >
              <MaterialIcons 
                name="edit" 
                size={moderateScale(16)} 
                color={theme.colors.background} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Password
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                ••••••••
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.editButtonSmall, { backgroundColor: theme.colors.primary }]}
              onPress={handleEditPassword}
            >
              <MaterialIcons 
                name="edit" 
                size={moderateScale(16)} 
                color={theme.colors.background} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Delete Account Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.error, borderWidth: 1 }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.error }]}>
                Delete Account
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
                Permanently delete your account and all data
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.editButtonSmall, { backgroundColor: theme.colors.error }]}
              onPress={handleDeleteAccount}
            >
              <MaterialIcons 
                name="delete" 
                size={moderateScale(16)} 
                color={theme.colors.background} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <EditProfileModal
        visible={editModalVisible}
        onClose={handleCloseModal}
        currentName={userData?.name || ''}
        currentProfilePhoto={userData?.profile_photo_url || userData?.profile_photo || null}
        currentAddress={userData?.address || ''}
        currentEmail={userData?.email || ''}
        currentPhone={userData?.mobile_number || ''}
        editMode={editMode}
        onSave={handleSaveProfile}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: moderateScale(20),
  },
  scrollContent: {
    padding: moderateVerticalScale(16),
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: moderateVerticalScale(30),
  },
  imageContainer: {
    position: 'relative',
    marginBottom: moderateVerticalScale(15),
  },
  profileImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
  },
  avatarPlaceholder: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: moderateVerticalScale(0),
    right: moderateScale(0),
  },
  profileName: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginTop: moderateVerticalScale(10),
  },
  addressText: {
    fontSize: moderateScale(16),
    marginTop: moderateVerticalScale(5),
    textAlign: 'center',
  },
  infoCard: {
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    marginBottom: moderateVerticalScale(15),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: moderateScale(14),
    color: '#666',
    marginBottom: moderateVerticalScale(4),
  },
  infoValue: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  editButtonSmall: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: moderateScale(18),
    textAlign: 'center',
    marginTop: moderateVerticalScale(50),
  },
});

export default ProfileScreen;
