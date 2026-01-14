import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {useAppSelector, useAppDispatch} from '../../redux/hooks';
import {RootState} from '../../redux/store';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList, LOGIN, MAIN_TABS, PROFILE, SETTINGS, BOOKING, SERVICEMAN_PROFILE, BOOKING_SERVICEMAN, USER_ROLES} from '../../constant/Routes';
import {logoutUser} from '../../redux/slices/authSlice';
import {clearUserData} from '../../redux/slices/userSlice';

interface ProfileMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItemProps {
  icon: any;
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({icon, title, onPress, color, disabled}) => {
  const {theme} = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
      disabled={disabled}
    >
      <MaterialIcons 
        name={icon} 
        size={24} 
        color={color || theme.colors.text} 
      />
      <Text style={[styles.menuItemText, {color: theme.colors.text}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const ProfileMenu: React.FC<ProfileMenuProps> = ({visible, onClose}) => {
  const {theme} = useTheme();
  const {userData} = useAppSelector((state: RootState) => state.user);
  const {loading} = useAppSelector((state: RootState) => state.auth);
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const dispatch = useAppDispatch();
  
  const isLoggedIn = !!userData?.token;

  const handleProfile = () => {
    console.log('Profile pressed');
    onClose();
    
    // Check account status for serviceman and brahman
    if (userData?.role === USER_ROLES.SERVICEMAN || userData?.role === USER_ROLES.BRAHMAN) {
      if (userData?.status === 'active') {
        navigation.navigate(SERVICEMAN_PROFILE);
      } else {
        Alert.alert('Account Not Active', 'Your account is not active. Please contact support to activate your account.');
      }
    } else {
      navigation.navigate(PROFILE);
    }
  };

  const handleBooks = () => {
    console.log('Booking pressed');
    onClose();
    
    // Check account status for serviceman and brahman
    if (userData?.role === USER_ROLES.SERVICEMAN || userData?.role === USER_ROLES.BRAHMAN) {
      if (userData?.status === 'active') {
        navigation.navigate(BOOKING_SERVICEMAN);
      } else {
        Alert.alert('Account Not Active', 'Your account is not active. Please contact support to activate your account.');
      }
    } else {
      navigation.navigate(BOOKING);
    }
  };

  const handleSettings = () => {
    console.log('Settings pressed');
    onClose();
    navigation.navigate(SETTINGS);
  };

  const handleLogin = () => {
    console.log('Login pressed');
    onClose();
    navigation.navigate(LOGIN, {});
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearUserData());
      onClose();
      navigation.reset({
        index: 0,
        routes: [{ name: MAIN_TABS }],
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      // You could show an alert here if needed
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        onPress={onClose}
      />
      <View style={[styles.menuContainer, {backgroundColor: theme.colors.card}]}>
        <View style={styles.menuHeader}>
          <Text style={[styles.menuTitle, {color: theme.colors.text}]}>
            {isLoggedIn ? 'Profile' : 'Account'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons 
              name="close" 
              size={24} 
              color={theme.colors.text} 
            />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
          {isLoggedIn ? (
            <>
              <MenuItem
                icon="account-circle"
                title="My Profile"
                onPress={handleProfile}
              />
              <MenuItem
                icon="receipt-long"
                title="My Booking"
                onPress={handleBooks}
              />
              <MenuItem
                icon="settings"
                title="Settings"
                onPress={handleSettings}
              />
              <MenuItem
                icon="logout"
                title={loading ? "Logging out..." : "Logout"}
                onPress={handleLogout}
                color={theme.colors.error}
                disabled={loading}
              />
            </>
          ) : (
            <MenuItem
              icon="login"
              title="Login"
              onPress={handleLogin}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 250,
    maxHeight: 400,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  menuContent: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
  },
});

export default ProfileMenu;
