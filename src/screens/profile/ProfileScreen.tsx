import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import { Button } from '../../components/Button/Button';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { userData } = useAppSelector((state: RootState) => state.user);

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
  };

  const handleBack = () => {
    // TODO: Navigate back to previous screen
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
            {userData?.profile_photo ? (
              <Image
                source={{ uri: userData.profile_photo }}
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
                style={[styles.editImageButton, { backgroundColor: theme.colors.background }]}
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
              onPress={handleEditProfile}
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
              onPress={handleEditProfile}
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
              onPress={handleEditProfile}
            >
              <MaterialIcons 
                name="edit" 
                size={moderateScale(16)} 
                color={theme.colors.background} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
