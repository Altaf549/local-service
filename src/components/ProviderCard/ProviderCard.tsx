import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { CustomImage } from '../CustomImage/CustomImage';
import { Button } from '../Button/Button';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  scaleFont,
  scaleSize,
  scaleHeight,
  scaleWidth,
  width,
} from '../../utils/scaling';

export interface ProviderCardProps {
  id: number;
  name: string;
  avatar: string;
  experience?: number;
  price: string;
  customPrice?: boolean;
  phone?: string;
  description?: string;
  materialFile?: string;
  charges?: string;
  availabilityStatus?: string;
  onCall?: (phone: string) => void;
  onBook?: (id: number) => void;
  onPress?: (id: number) => void;
  showBookButton?: boolean;
  type?: 'serviceman' | 'brahman' | 'provider';
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  id,
  name,
  avatar,
  experience,
  price,
  customPrice,
  phone,
  description,
  materialFile,
  charges,
  availabilityStatus,
  onCall,
  onBook,
  onPress,
  showBookButton = true,
  type = 'provider',
}) => {
  const { theme } = useTheme();

  const handleCardPress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  const handleCallPress = () => {
    if (phone && onCall) {
      onCall(phone);
    }
  };

  const handleBookPress = () => {
    if (onBook) {
      onBook(id);
    }
  };

  const getAvailabilityColor = () => {
    if (!availabilityStatus) return theme.colors.textSecondary;
    switch (availabilityStatus.toLowerCase()) {
      case 'available':
        return theme.colors.success;
      case 'busy':
        return theme.colors.warning;
      case 'unavailable':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <View style={styles.infoSection}>
        <CustomImage
          source={{ uri: avatar }}
          style={styles.avatar}
        />
        <View style={styles.details}>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {name}
          </Text>

          {description && (
            <Text style={[styles.specialization, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {description}
            </Text>
          )}

          <Text style={[styles.price, { color: theme.colors.primary }]}>
            {type === 'brahman' && charges ? `₹${charges}` : `₹${price}`}
          </Text>

          {availabilityStatus && (
            <Text style={[styles.availability, { color: getAvailabilityColor() }]}>
              Status: {availabilityStatus}
            </Text>
          )}

        </View>

        <View style={styles.actions}>
          {phone && (
            <TouchableOpacity
              style={[styles.callButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleCallPress}>
              <MaterialIcons name="call" size={scaleSize(20)} color={theme.colors.background} />
            </TouchableOpacity>
          )}

          {materialFile && (
            <TouchableOpacity
              style={[styles.callButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleCallPress}>
              <MaterialIcons name="download" size={scaleSize(20)} color={theme.colors.background} />
            </TouchableOpacity>
          )}

          {showBookButton && (
            <Button
              title="Book"
              onPress={handleBookPress}
              size="small"
              style={styles.bookButton}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: moderateScale(16),
    marginBottom: verticalScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: scaleWidth(16),
    marginRight: scaleSize(12),
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  specialization: {
    fontSize: scaleFont(14),
    marginBottom: verticalScale(2),
  },
  experience: {
    fontSize: scaleFont(12),
    marginBottom: verticalScale(2),
  },
  languages: {
    fontSize: scaleFont(12),
    marginBottom: verticalScale(2),
  },
  price: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  availability: {
    fontSize: scaleFont(12),
    fontStyle: 'italic',
  },
  actions: {
    gap: scaleSize(8),
  },
  callButton: {
    height: scaleSize(30),
    paddingHorizontal: scaleSize(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(6),
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: scaleFont(12),
    fontWeight: '600',
  },
  bookButton: {
    height: scaleSize(30),
    minWidth: scaleSize(60),
  },
  actionsIconContainer: {
    flexDirection: 'row',
    gap: scaleSize(8),
  },
});

export default ProviderCard;
