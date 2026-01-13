import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, ThemeMode } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { BASE_URL, MAIN_URL } from '../../network/axiosConfig';
import { API_ENDPOINTS } from '../../constant/ApiEndpoints';

const SettingsScreen: React.FC = () => {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  
  const handlePrivacyPolicy = () => {
    Linking.openURL(MAIN_URL + API_ENDPOINTS.PRIVACY_POLICY);
  };

  const handleTermsConditions = () => {
    Linking.openURL(MAIN_URL + API_ENDPOINTS.TERMS_AND_CONDITIONS);
  };

  const handleAboutUs = () => {
    Linking.openURL(MAIN_URL + API_ENDPOINTS.ABOUT_US);
  };

  const handleThemeToggle = () => {
    const newMode: ThemeMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Settings" 
      />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Theme Toggle Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Dark Mode
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {isDark ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        {/* Privacy Policy Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Privacy Policy
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                View our privacy policy
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.editButtonSmall, { backgroundColor: theme.colors.primary }]}
              onPress={handlePrivacyPolicy}
            >
              <MaterialIcons 
                name="open-in-new" 
                size={moderateScale(16)} 
                color={theme.colors.background} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms & Conditions Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Terms & Conditions
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                Read our terms and conditions
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.editButtonSmall, { backgroundColor: theme.colors.primary }]}
              onPress={handleTermsConditions}
            >
              <MaterialIcons 
                name="open-in-new" 
                size={moderateScale(16)} 
                color={theme.colors.background} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* About Us Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                About Us
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                Learn more about our app
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.editButtonSmall, { backgroundColor: theme.colors.primary }]}
              onPress={handleAboutUs}
            >
              <MaterialIcons 
                name="open-in-new" 
                size={moderateScale(16)} 
                color={theme.colors.background} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                App Version
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                1.0.0
              </Text>
            </View>
            <View style={[styles.versionBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.versionText, { color: theme.colors.background }]}>
                Latest
              </Text>
            </View>
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
  scrollContent: {
    padding: moderateVerticalScale(16),
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
  versionBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  versionText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
});

export default SettingsScreen;
