import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Header, CancelModal } from '../../components';
import { Button } from '../../components/Button/Button';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { fetchBookingDetails, updateBookingThunk, cancelBookingThunk, acceptBookingThunk, completeBookingThunk } from '../../redux/slices/bookingSlice';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../constant/Routes';
import Console from '../../utils/Console';

interface BookingDetails {
  id: number;
  user_id: number;
  booking_type: 'service' | 'puja';
  service_id?: number;
  puja_id?: number;
  serviceman_id?: number;
  brahman_id?: number;
  booking_date: string;
  booking_time: string;
  address: string;
  mobile_number: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_method: 'cod' | 'online';
  total_amount: string;
  created_at: string;
  updated_at: string;
  user: any;
  service?: any;
  puja?: any;
  serviceman?: any;
  brahman?: any;
}

type BookingDetailsServicemanRouteProp = RouteProp<AppStackParamList, 'BookingDetailsServiceman'>;
type BookingDetailsServicemanNavigationProp = StackNavigationProp<AppStackParamList, 'BookingDetailsServiceman'>;

const BookingDetailsServicemanScreen: React.FC = () => {
  const { theme } = useTheme();
  const { userData } = useAppSelector((state: RootState) => state.user);
  const navigation = useNavigation<BookingDetailsServicemanNavigationProp>();
  const route = useRoute<BookingDetailsServicemanRouteProp>();
  const { bookingId } = route.params;

  const dispatch = useAppDispatch();
  const { currentBooking, loading, cancelLoading, acceptLoading } = useAppSelector((state: RootState) => state.bookings);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (bookingId) {
      Console.log("Fetching booking details for ID:", bookingId);
      dispatch(fetchBookingDetails(bookingId));
    }
  }, [bookingId, dispatch]);

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
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelBooking = async () => {
    if (!currentBooking) return;

    try {
      await dispatch(cancelBookingThunk({ id: currentBooking.id, cancellationReason })).unwrap();
      Alert.alert('Success', 'Booking cancelled successfully');
      setShowCancelModal(false);
      setCancellationReason('');
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to cancel booking');
    }
  };

  const handleAcceptBooking = async () => {
    if (!currentBooking) return;

    try {
      await dispatch(acceptBookingThunk(currentBooking.id)).unwrap();
      Alert.alert('Success', 'Booking accepted successfully');
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to accept booking');
    }
  };

  const handleContactCustomer = () => {
    if (!currentBooking) return;

    const phoneNumber = currentBooking.user?.mobile_number;
    const customerName = currentBooking.user?.name || 'Customer';

    if (phoneNumber) {
      Alert.alert(
        `Contact ${customerName}`,
        `Would you like to call ${customerName} at ${phoneNumber}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Call',
            onPress: () => {
              Linking.openURL(`tel:${phoneNumber}`).catch(() => {
                Alert.alert('Error', 'Unable to make a call');
              });
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Contact number not available');
    }
  };

  const canContact = currentBooking?.status === 'confirmed' || currentBooking?.status === 'completed';

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Booking Details" />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading booking details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentBooking) {
    return (
      <SafeAreaView edges={['left', 'right']} style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Booking Details" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Booking not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const serviceName = currentBooking.service?.service_name || currentBooking.puja?.puja_name || 'Unknown Service';
  const customerName = currentBooking.user?.name || 'Unknown Customer';

  return (
    <SafeAreaView edges={['left', 'right']} style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Booking Details" />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.statusHeader}>
            <Text style={[styles.serviceName, { color: theme.colors.text }]}>
              {serviceName}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentBooking.status) }]}>
              <Text style={[styles.statusText, { color: theme.colors.background }]}>
                {getStatusText(currentBooking.status)}
              </Text>
            </View>
          </View>
          <Text style={[styles.customerName, { color: theme.colors.textSecondary }]}>
            Customer: {customerName}
          </Text>
          <Text style={[styles.bookingType, { color: theme.colors.textSecondary }]}>
            {currentBooking.booking_type === 'service' ? 'Service Booking' : 'Puja Booking'}
          </Text>
        </View>

        {/* Customer Information */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Customer Information
          </Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={moderateScale(20)} color={theme.colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Name:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {customerName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={moderateScale(20)} color={theme.colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Phone:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {currentBooking.mobile_number}
            </Text>
          </View>

          {currentBooking.user?.email && (
            <View style={styles.infoRow}>
              <MaterialIcons name="email" size={moderateScale(20)} color={theme.colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Email:</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {currentBooking.user.email}
              </Text>
            </View>
          )}
        </View>

        {/* Booking Information */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Booking Information
          </Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={moderateScale(20)} color={theme.colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Date:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {formatDate(currentBooking.booking_date)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={moderateScale(20)} color={theme.colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Time:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {currentBooking.booking_time}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={moderateScale(20)} color={theme.colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Address:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text, flex: 1 }]}>
              {currentBooking.address}
            </Text>
          </View>

          {currentBooking.notes && (
            <View style={styles.infoRow}>
              <MaterialIcons name="notes" size={moderateScale(20)} color={theme.colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Notes:</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text, flex: 1 }]}>
                {currentBooking.notes}
              </Text>
            </View>
          )}
        </View>

        {/* Payment Information */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Payment Information
          </Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="payments" size={moderateScale(20)} color={theme.colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Amount:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              ₹{currentBooking.total_amount}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="account-balance-wallet" size={moderateScale(20)} color={theme.colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Method:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {currentBooking.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="credit-card" size={moderateScale(20)} color={theme.colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Status:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {getStatusText(currentBooking.payment_status)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {currentBooking.status === 'pending' && (
            <>
              <Button
                title="Accept Booking"
                onPress={handleAcceptBooking}
                loading={acceptLoading}
                style={styles.actionButton}
              />
              <Button
                title="Cancel Booking"
                onPress={() => setShowCancelModal(true)}
                loading={cancelLoading}
                style={{ ...styles.actionButton, backgroundColor: theme.colors.error }}
              />
            </>
          )}

          {canContact && (
            <Button
              title="Contact Customer"
              onPress={handleContactCustomer}
              style={{ ...styles.actionButton, backgroundColor: theme.colors.success }}
            />
          )}

          {currentBooking.status === 'cancelled' && (
            <View style={[styles.infoMessage, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.infoMessageText, { color: theme.colors.textSecondary }]}>
                This booking has been cancelled.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Cancellation Modal */}
      <CancelModal
        visible={showCancelModal}
        title="Cancel Booking"
        message="Please provide a reason for cancellation (optional):"
        placeholder="Enter cancellation reason..."
        cancelButtonTitle="Back"
        confirmButtonTitle="Cancel Booking"
        cancellationReason={cancellationReason}
        onCancel={() => {
          setShowCancelModal(false);
          setCancellationReason('');
        }}
        onConfirm={handleCancelBooking}
        onReasonChange={setCancellationReason}
        loading={cancelLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: moderateScale(16),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: moderateScale(18),
  },
  scrollContent: {
    flex: 1,
    padding: moderateScale(16),
  },
  statusCard: {
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    marginBottom: moderateVerticalScale(16),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: moderateVerticalScale(8),
  },
  serviceName: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    flex: 1,
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
  customerName: {
    fontSize: moderateScale(16),
    marginBottom: moderateVerticalScale(4),
  },
  bookingType: {
    fontSize: moderateScale(14),
    fontStyle: 'italic',
  },
  infoCard: {
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    marginBottom: moderateVerticalScale(16),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: moderateVerticalScale(16),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: moderateVerticalScale(12),
  },
  infoLabel: {
    fontSize: moderateScale(14),
    width: moderateScale(80),
    marginLeft: moderateScale(8),
  },
  infoValue: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    flex: 1,
  },
  actionButtons: {
    marginTop: moderateVerticalScale(20),
    marginBottom: moderateVerticalScale(40),
  },
  actionButton: {
    marginBottom: moderateVerticalScale(12),
  },
  infoMessage: {
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
    marginTop: moderateVerticalScale(8),
  },
  infoMessageText: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    lineHeight: moderateVerticalScale(20),
  },
});

export default BookingDetailsServicemanScreen;
