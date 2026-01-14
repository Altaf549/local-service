import React, {useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import { ProfileMenu } from '../../components/ProfileMenu/ProfileMenu';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const ServicemanHomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  const handleProfilePress = () => {
    setProfileMenuVisible(true);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuVisible(false);
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
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Welcome to Serviceman Home
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          This screen is under construction
        </Text>
      </View>
      
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ServicemanHomeScreen;
