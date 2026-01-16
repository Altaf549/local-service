import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import { ProfileMenu } from '../../components/ProfileMenu/ProfileMenu';
import ProfileUpdateCard from '../../components/ProfileUpdateCard/ProfileUpdateCard';
import ServicemanProfileUpdateModal from '../../components/ServicemanProfileUpdateModal/ServicemanProfileUpdateModal';
import { CustomImage } from '../../components/CustomImage/CustomImage';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { updateServicemanProfile, updateBrahmanProfile, getServicemanProfileData, getBrahmanProfileData, getServicemanStatus, getBrahmanStatus } from '../../services/api';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { USER_ROLES, SERVICEMAN_SERVICES, SERVICEMAN_EXPERIENCE, SERVICEMAN_ACHIEVEMENT } from '../../constant/Routes';
import { useNavigation } from '@react-navigation/native';
import { fetchServicemanProfileData, getServicemanStatusThunk } from '../../redux/slices/servicemanProfileSlice';
import { fetchBrahmanProfileData, getBrahmanStatusThunk } from '../../redux/slices/brahmanProfileSlice';
import { setUserData } from '../../redux/slices/userSlice';
import { verticalScale, moderateScale, scaleFont } from '../../utils/scaling';

import { useFocusEffect } from '@react-navigation/native';
import Console from '../../utils/Console';

const ServicemanHomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileUpdateModalVisible, setProfileUpdateModalVisible] = useState(false);
  const userData = useAppSelector((state: RootState) => state.user.userData);
  const servicemanProfile = useAppSelector((state: RootState) => state.servicemanProfile);
  const brahmanProfile = useAppSelector((state: RootState) => state.brahmanProfile);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  // Check status when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const checkUserStatus = async () => {
        if (userData?.id && (userData?.role === USER_ROLES.SERVICEMAN || userData?.role === USER_ROLES.BRAHMAN) && userData.status === 'inactive') {
          try {
            let statusData;
            if (userData?.role === USER_ROLES.SERVICEMAN) {
              statusData = await dispatch(getServicemanStatusThunk(userData.id)).unwrap();
            } else if (userData?.role === USER_ROLES.BRAHMAN) {
              statusData = await dispatch(getBrahmanStatusThunk(userData.id)).unwrap();
            }
            
            if (statusData?.is_active) {
              // User is active, update user data in Redux
              if (userData?.role === USER_ROLES.SERVICEMAN && statusData) {
                const updatedUserData = {
                  ...userData,
                  status: statusData.status,
                  availability_status: statusData.availability_status,
                };
                dispatch(setUserData(updatedUserData));
              } else if (userData?.role === USER_ROLES.BRAHMAN && statusData) {
                const updatedUserData = {
                  ...userData,
                  status: statusData.status,
                  availability_status: statusData.availability_status,
                };
                dispatch(setUserData(updatedUserData));
              }
              
              console.log('User status verified: Active');
            } else {
              const updatedUserData = {
                ...userData,
                status: statusData.status,
                availability_status: statusData.availability_status,
              };
              dispatch(setUserData(updatedUserData));
              console.log('User status verified: Inactive');
            }
          } catch (error) {
            console.error('Error checking status:', error);
          }
        }
      };
      
      checkUserStatus();
    }, [userData, dispatch])
  );

  const handleProfilePress = () => {
    setProfileMenuVisible(true);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuVisible(false);
  };

  const handleProfileUpdatePress = async () => {
    try {
      // Fetch existing profile data based on user role
      if (userData?.role === USER_ROLES.SERVICEMAN) {
        await dispatch(fetchServicemanProfileData()).unwrap();
      } else if (userData?.role === USER_ROLES.BRAHMAN) {
        await dispatch(fetchBrahmanProfileData()).unwrap();
      }
      
      setProfileUpdateModalVisible(true);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // If there's an error fetching data, still open the modal with empty state
      setProfileUpdateModalVisible(true);
    }
  };

  const handleProfileUpdateModalClose = () => {
    setProfileUpdateModalVisible(false);
  };

  const handleServicePricePress = () => {
    if (userData?.status === 'active') {
      navigation.navigate(SERVICEMAN_SERVICES as any);
    } else {
      Alert.alert('Account Not Active', 'Your account is not active. Please contact support to activate your account.');
    }
  };

  const handleExperiencePress = () => {
    if (userData?.status === 'active') {
      navigation.navigate(SERVICEMAN_EXPERIENCE as any);
    } else {
      Alert.alert('Account Not Active', 'Your account is not active. Please contact support to activate your account.');
    }
  };

  const handleAchievementPress = () => {
    if (userData?.status === 'active') {
      navigation.navigate(SERVICEMAN_ACHIEVEMENT as any);
    } else {
      Alert.alert('Account Not Active', 'Your account is not active. Please contact support to activate your account.');
    }
  };

  const handleProfileUpdate = async (profileData: any) => {
    try {
      let response;
      
      if (userData?.role === USER_ROLES.SERVICEMAN) {
        response = await updateServicemanProfile(profileData);
      } else if (userData?.role === USER_ROLES.BRAHMAN) {
        response = await updateBrahmanProfile(profileData);
      } else {
        throw new Error('Invalid user role for profile update');
      }

      if (response.success) {
        // Update user data in Redux using response data
        if (response.data) {
          const updatedUserData = {
            ...userData,
            ...response.data
          };
          dispatch(setUserData(updatedUserData));
          Console.log('Updated user data:', updatedUserData);
          // Update AsyncStorage
          await AsyncStorage.setItem('user_info', JSON.stringify(updatedUserData));
        }
        
        Alert.alert('Success', response.message || 'Profile updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}>
      <Header 
        title="Dashboard" 
        rightIcon={
          userData?.profile_photo_url || userData?.profile_photo ? (
            <CustomImage
              source={{ uri: userData.profile_photo_url || userData.profile_photo }}
              style={styles.profileImage}
              type="fast"
            />
          ) : (
            <MaterialIcons 
              name="account-circle" 
              size={40} 
              color={theme.colors.background} 
            />
          )
        }
        onRightIconPress={handleProfilePress}
      />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {userData?.role === USER_ROLES.SERVICEMAN ? "Welcome to Serviceman Dashboard" : "Welcome to Brahman Dashboard"}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {userData?.role === USER_ROLES.SERVICEMAN ? "Manage your profile and services" : "Manage your profile and puja"}
          </Text>
          
          <ProfileUpdateCard
            onPress={handleProfileUpdatePress}
            title="Update Profile"
            subtitle="Complete your profile with government ID and photos"
          />
          
          <ProfileUpdateCard
            onPress={handleServicePricePress}
            title={userData?.role === USER_ROLES.SERVICEMAN ? "Service Price" : "Puja Price"}
            subtitle={userData?.role === USER_ROLES.SERVICEMAN ? "Manage your services and pricing" : "Manage your puja and pricing"}
            icon="attach-money"
          />
          
          <ProfileUpdateCard
            onPress={handleExperiencePress}
            title="Experience"
            subtitle="Showcase your work experience and expertise"
            icon="work-history"
          />
          
          <ProfileUpdateCard
            onPress={handleAchievementPress}
            title="Achievements"
            subtitle="Display your accomplishments and certifications"
            icon="emoji-events"
          />
        </ScrollView>
      </View>
      
      <ServicemanProfileUpdateModal
        visible={profileUpdateModalVisible}
        onClose={handleProfileUpdateModalClose}
        onSave={handleProfileUpdate}
        userType={userData?.role === USER_ROLES.SERVICEMAN ? 'serviceman' : 'brahman'}
        existingData={userData?.role === USER_ROLES.SERVICEMAN ? servicemanProfile.profileData : brahmanProfile.profileData}
      />
      <ProfileMenu
        visible={profileMenuVisible}
        onClose={handleProfileMenuClose}
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
    paddingHorizontal: moderateScale(20),
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: verticalScale(8),
    marginTop: verticalScale(20),
  },
  subtitle: {
    fontSize: scaleFont(16),
    textAlign: 'center',
    lineHeight: verticalScale(22),
    marginBottom: verticalScale(24),
  },
});

export default ServicemanHomeScreen;
