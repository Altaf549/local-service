import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import { Button } from '../../components/Button/Button';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { fetchBookingDetails, updateBookingThunk, cancelBookingThunk } from '../../redux/slices/bookingSlice';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../constant/Routes';

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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
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

type BookingDetailsRouteProp = RouteProp<AppStackParamList, 'BookingDetails'>;
type BookingDetailsNavigationProp = StackNavigationProp<AppStackParamList, 'BookingDetails'>;

const BookingDetailsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { userData } = useAppSelector((state: RootState) => state.user);
  const navigation = useNavigation<BookingDetailsNavigationProp>();
  const route = useRoute<BookingDetailsRouteProp>();
  const { bookingId } = route.params;

  const dispatch = useAppDispatch();
  const { currentBooking, loading, updateLoading, cancelLoading } = useAppSelector((state: RootState) => state.bookings);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    booking_date: '',
    booking_time: '',
    address: '',
    mobile_number: '',
    notes: '',
  });
  useEffect(() => {
    if (currentBooking) {
      setEditForm({
        booking_date: currentBooking.booking_date.split('T')[0],
        booking_time: currentBooking.booking_time,
        address: currentBooking.address,
        mobile_number: currentBooking.mobile_number,
        notes: currentBooking.notes || '',
      });
    }
  }, [currentBooking]);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (bookingId) {
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateBooking = async () => {
    if (!currentBooking) return;

    try {
      await dispatch(updateBookingThunk({ id: currentBooking.id, bookingData: editForm })).unwrap();
      Alert.alert('Success', 'Booking updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update booking');
    }
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

  const handleContactProvider = () => {
    if (!currentBooking) return;

    const phoneNumber = currentBooking.serviceman?.mobile_number || currentBooking.brahman?.mobile_number;
    const providerName = currentBooking.serviceman?.name || currentBooking.brahman?.name || 'Provider';

    if (phoneNumber) {
      Alert.alert(
        `Contact ${providerName}`,
        `Would you like to call ${providerName} at ${phoneNumber}?`,
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

  const canEdit = currentBooking?.status === 'pending';
  const canCancel = currentBooking?.status === 'pending' || currentBooking?.status === 'confirmed';
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
  const providerName = currentBooking.serviceman?.name || currentBooking.brahman?.name || 'Unknown Provider';

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
          <Text style={[styles.providerName, { color: theme.colors.textSecondary }]}>
            {providerName}
          </Text>
          <Text style={[styles.bookingType, { color: theme.colors.textSecondary }]}>
            {currentBooking.booking_type === 'service' ? 'Service Booking' : 'Puja Booking'}
          </Text>
        </View>

        {/* Booking Information */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Booking Information
          </Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={moderateScale(20)} color={theme.colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Date:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.infoInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
                value={editForm.booking_date}
                onChangeText={(text) => setEditForm({ ...editForm, booking_date: text })}
              />
            ) : (
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {formatDate(currentBooking.booking_date)}
              </Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={moderateScale(20)} color={theme.colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Time:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.infoInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
                value={editForm.booking_time}
                onChangeText={(text) => setEditForm({ ...editForm, booking_time: text })}
              />
            ) : (
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {currentBooking.booking_time}
              </Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={moderateScale(20)} color={theme.colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Address:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.infoInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
                value={editForm.address}
                onChangeText={(text) => setEditForm({ ...editForm, address: text })}
                multiline
              />
            ) : (
              <Text style={[styles.infoValue, { color: theme.colors.text, flex: 1 }]}>
                {currentBooking.address}
              </Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={moderateScale(20)} color={theme.colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Mobile:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.infoInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
                value={editForm.mobile_number}
                onChangeText={(text) => setEditForm({ ...editForm, mobile_number: text })}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {currentBooking.mobile_number}
              </Text>
            )}
          </View>

          {currentBooking.notes && (
            <View style={styles.infoRow}>
              <MaterialIcons name="notes" size={moderateScale(20)} color={theme.colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Notes:</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.infoInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={editForm.notes}
                  onChangeText={(text) => setEditForm({ ...editForm, notes: text })}
                  multiline
                />
              ) : (
                <Text style={[styles.infoValue, { color: theme.colors.text, flex: 1 }]}>
                  {currentBooking.notes}
                </Text>
              )}
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
          {canEdit && !isEditing && (
            <Button
              title="Edit Booking"
              onPress={() => setIsEditing(true)}
              style={styles.actionButton}
            />
          )}

          {isEditing && (
            <>
              <Button
                title="Save Changes"
                onPress={handleUpdateBooking}
                loading={updateLoading}
                style={styles.actionButton}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setIsEditing(false);
                  setEditForm({
                    booking_date: currentBooking.booking_date.split('T')[0],
                    booking_time: currentBooking.booking_time,
                    address: currentBooking.address,
                    mobile_number: currentBooking.mobile_number,
                    notes: currentBooking.notes || '',
                  });
                }}
                style={{ ...styles.actionButton, backgroundColor: theme.colors.surface }}
                textStyle={{ color: theme.colors.text }}
              />
            </>
          )}

          {canCancel && !isEditing && (
            <Button
              title="Cancel Booking"
              onPress={() => setShowCancelModal(true)}
              style={{ ...styles.actionButton, backgroundColor: theme.colors.error }}
            />
          )}

          {canContact && !isEditing && (
            <Button
              title="Contact Provider"
              onPress={handleContactProvider}
              style={{ ...styles.actionButton, backgroundColor: theme.colors.success }}
            />
          )}

          {currentBooking.status === 'cancelled' && !isEditing && (
            <View style={[styles.infoMessage, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.infoMessageText, { color: theme.colors.textSecondary }]}>
                This booking has been cancelled. Please make a new booking if needed.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Cancel Booking
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Please provide a reason for cancellation (optional):
            </Text>
            <TextInput
              style={[styles.modalInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
              value={cancellationReason}
              onChangeText={setCancellationReason}
              placeholder="Enter cancellation reason..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => {
                  setShowCancelModal(false);
                  setCancellationReason('');
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>
                  Back
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.error }]}
                onPress={handleCancelBooking}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.background }]}>
                  Cancel Booking
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  providerName: {
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
  infoInput: {
    fontSize: moderateScale(14),
    borderWidth: 1,
    borderRadius: moderateScale(8),
    padding: moderateScale(8),
    flex: 1,
    minHeight: moderateVerticalScale(40),
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: moderateScale(12),
    padding: moderateScale(24),
    margin: moderateScale(20),
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: moderateVerticalScale(16),
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: moderateScale(16),
    marginBottom: moderateVerticalScale(16),
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    fontSize: moderateScale(16),
    minHeight: moderateVerticalScale(80),
    textAlignVertical: 'top',
    marginBottom: moderateVerticalScale(20),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: moderateScale(8),
    paddingVertical: moderateVerticalScale(12),
    paddingHorizontal: moderateScale(24),
    minWidth: moderateScale(120),
  },
  modalButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BookingDetailsScreen;
