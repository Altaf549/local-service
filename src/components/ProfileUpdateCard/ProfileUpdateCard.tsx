import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';

interface ProfileUpdateCardProps {
  onPress: () => void;
  title?: string;
  subtitle?: string;
  icon?: string;
}

const ProfileUpdateCard: React.FC<ProfileUpdateCardProps> = ({
  onPress,
  title = "Update Profile",
  subtitle = "Complete your profile with government ID and photos",
  icon = "edit-note"
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <MaterialIcons 
            name="edit-note" 
            size={moderateScale(24)} 
            color={theme.colors.primary} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
        
        <MaterialIcons 
          name="chevron-right" 
          size={moderateScale(20)} 
          color={theme.colors.textSecondary} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateVerticalScale(12),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginRight: moderateScale(16),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(4),
  },
  subtitle: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  },
});

export default ProfileUpdateCard;
