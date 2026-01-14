import React, {useState} from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import { ProfileMenu } from '../../components/ProfileMenu/ProfileMenu';
import ProfileUpdateCard from '../../components/ProfileUpdateCard/ProfileUpdateCard';
import ServicemanProfileUpdateModal from '../../components/ServicemanProfileUpdateModal';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { updateServicemanProfile, updateBrahmanProfile } from '../../services/api';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { USER_ROLES, SERVICEMAN_SERVICES, SERVICEMAN_EXPERIENCE, SERVICEMAN_ACHIEVEMENT } from '../../constant/Routes';
import { useNavigation } from '@react-navigation/native';

const ServicemanHomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileUpdateModalVisible, setProfileUpdateModalVisible] = useState(false);
  const { userData } = useAppSelector((state: RootState) => state.user);
  const navigation = useNavigation();

  const handleProfilePress = () => {
    setProfileMenuVisible(true);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuVisible(false);
  };

  const handleProfileUpdatePress = () => {
    setProfileUpdateModalVisible(true);
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
        title="Serviceman Home" 
        rightIcon={
          <MaterialIcons 
            name="account-circle" 
            size={40} 
            color={theme.colors.background} 
          />
        }
        onRightIconPress={handleProfilePress}
      />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome to Serviceman Home
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Manage your profile and services
          </Text>
          
          <ProfileUpdateCard
            onPress={handleProfileUpdatePress}
            title="Update Profile"
            subtitle="Complete your profile with government ID and photos"
          />
          
          <ProfileUpdateCard
            onPress={handleServicePricePress}
            title="Service Price"
            subtitle="Manage your services and pricing"
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
});

export default ServicemanHomeScreen;
