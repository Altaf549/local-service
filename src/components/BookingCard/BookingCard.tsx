import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';

interface Booking {
  id: number;
  booking_type: 'service' | 'puja';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  booking_date: string;
  booking_time: string;
  total_amount: string;
  user: any;
  service?: any;
  puja?: any;
  serviceman?: any;
  brahman?: any;
}

interface BookingCardProps {
  booking: Booking;
  onPress: (bookingId: number) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress }) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning || '#FFA500';
      case 'confirmed':
        return theme.colors.success || '#4CAF50';
      case 'completed':
        return theme.colors.info || '#2196F3';
      case 'cancelled':
        return theme.colors.error || '#F44336';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const serviceName = booking.service?.service_name || booking.puja?.puja_name || 'Unknown Service';
  const providerName = booking.serviceman?.name || booking.brahman?.name || 'Unknown Provider';

  return (
    <TouchableOpacity
      style={[styles.bookingCard, { backgroundColor: theme.colors.card }]}
      onPress={() => onPress(booking.id)}
    >
      <View style={styles.bookingHeader}>
        <View style={styles.bookingInfo}>
          <Text style={[styles.serviceName, { color: theme.colors.text }]}>
            {serviceName}
          </Text>
          <Text style={[styles.providerName, { color: theme.colors.textSecondary }]}>
            {providerName}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={[styles.statusText, { color: theme.colors.background }]}>
            {getStatusText(booking.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons 
            name="calendar-today" 
            size={moderateScale(16)} 
            color={theme.colors.textSecondary} 
          />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {formatDate(booking.booking_date)} at {booking.booking_time}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons 
            name="payments" 
            size={moderateScale(16)} 
            color={theme.colors.textSecondary} 
          />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            ₹{booking.total_amount}
          </Text>
        </View>
      </View>
      
      <View style={styles.bookingFooter}>
        <Text style={[styles.bookingType, { color: theme.colors.textSecondary }]}>
          {booking.booking_type === 'service' ? 'Service Booking' : 'Puja Booking'}
        </Text>
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
  bookingCard: {
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
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: moderateVerticalScale(12),
  },
  bookingInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: moderateVerticalScale(4),
  },
  providerName: {
    fontSize: moderateScale(14),
  },
  statusBadge: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(4),
    borderRadius: moderateScale(12),
  },
  statusText: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  bookingDetails: {
    marginBottom: moderateVerticalScale(12),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(6),
  },
  detailText: {
    fontSize: moderateScale(14),
    marginLeft: moderateScale(8),
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingType: {
    fontSize: moderateScale(12),
    fontStyle: 'italic',
  },
});

export type {BookingCardProps};

export default BookingCard;
