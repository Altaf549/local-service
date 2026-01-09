import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {useAppSelector} from '../../redux/hooks';
import {RootState} from '../../redux/store';

interface ProfileMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItemProps {
  icon: any;
  title: string;
  onPress: () => void;
  color?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({icon, title, onPress, color}) => {
  const {theme} = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
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
  
  const isLoggedIn = !!userData?.token;

  const handleProfile = () => {
    console.log('Profile pressed');
    onClose();
  };

  const handleOrders = () => {
    console.log('Orders pressed');
    onClose();
  };

  const handleSettings = () => {
    console.log('Settings pressed');
    onClose();
  };

  const handleLogin = () => {
    console.log('Login pressed');
    onClose();
  };

  const handleLogout = () => {
    console.log('Logout pressed');
    onClose();
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
                title="My Orders"
                onPress={handleOrders}
              />
              <MenuItem
                icon="settings"
                title="Settings"
                onPress={handleSettings}
              />
              <MenuItem
                icon="logout"
                title="Logout"
                onPress={handleLogout}
                color={theme.colors.error}
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
