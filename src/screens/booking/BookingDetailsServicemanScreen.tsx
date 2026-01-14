import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import { ProfileMenu } from '../../components/ProfileMenu/ProfileMenu';
import { Button } from '../../components/Button/Button';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../constant/Routes';
import { CustomImage } from '../../components/CustomImage/CustomImage';

interface BookingDetails {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_name: string;
  service_description?: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  address: string;
  city?: string;
  state?: string;
  postal_code?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  customer_profile_photo?: string;
}

const BookingDetailsServicemanScreen: React.FC = () => {
  const { theme } = useTheme();
  const { userData } = useAppSelector((state: RootState) => state.user);
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const route = useRoute();
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { bookingId } = route.params as { bookingId: number };

  const handleProfilePress = () => {
    setProfileMenuVisible(true);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuVisible(false);
  };

  const fetchBookingDetails = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await getBookingDetails(bookingId);
      
      // Mock data for now
      const mockBookingDetails: BookingDetails = {
        id: bookingId,
        customer_name: 'John Doe',
        customer_phone: '+1234567890',
        customer_email: 'john.doe@example.com',
        service_name: 'Plumbing Service',
        service_description: 'Fix leaking kitchen sink and check water pressure',
        booking_date: '2024-01-15',
        booking_time: '10:00 AM',
        status: 'pending',
        total_amount: 150,
        address: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        special_instructions: 'Please call before arriving. Building has secure entrance.',
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
        customer_profile_photo: 'https://picsum.photos/seed/customer1/200/200.jpg',
      };

      setBookingDetails(mockBookingDetails);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const updateBookingStatus = async (newStatus: BookingDetails['status']) => {
    if (!bookingDetails) return;

    Alert.alert(
      'Update Status',
      `Are you sure you want to change the status to ${newStatus.replace('_', ' ')}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: async () => {
            setUpdating(true);
            try {
              // TODO: Replace with actual API call
              // await updateBookingStatus(bookingId, newStatus);
              
              setBookingDetails({
                ...bookingDetails,
                status: newStatus,
                updated_at: new Date().toISOString(),
              });
              
              Alert.alert('Success', 'Booking status updated successfully');
            } catch (error) {
              console.error('Error updating booking status:', error);
              Alert.alert('Error', 'Failed to update booking status');
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'confirmed':
        return theme.colors.primary;
      case 'in_progress':
        return theme.colors.info;
      case 'completed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const renderStatusActions = () => {
    if (!bookingDetails) return null;

    switch (bookingDetails.status) {
      case 'pending':
        return (
          <View style={styles.actionButtons}>
            <Button
              title="Confirm Booking"
              onPress={() => updateBookingStatus('confirmed')}
              loading={updating}
              style={styles.actionButton}
            />
            <Button
              title="Cancel Booking"
              onPress={() => updateBookingStatus('cancelled')}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        );
      case 'confirmed':
        return (
          <View style={styles.actionButtons}>
            <Button
              title="Start Service"
              onPress={() => updateBookingStatus('in_progress')}
              loading={updating}
              style={styles.actionButton}
            />
            <Button
              title="Cancel Booking"
              onPress={() => updateBookingStatus('cancelled')}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        );
      case 'in_progress':
        return (
          <View style={styles.actionButtons}>
            <Button
              title="Complete Service"
              onPress={() => updateBookingStatus('completed')}
              loading={updating}
              style={styles.actionButton}
            />
          </View>
        );
      case 'completed':
      case 'cancelled':
        return null;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header 
          title="Booking Details" 
          rightIcon={
            <MaterialIcons 
              name="account-circle" 
              size={40} 
              color={theme.colors.background} 
            />
          }
          onRightIconPress={handleProfilePress}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!bookingDetails) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header 
          title="Booking Details" 
          rightIcon={
            <MaterialIcons 
              name="account-circle" 
              size={40} 
              color={theme.colors.background} 
            />
          }
          onRightIconPress={handleProfilePress}
        />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={64} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Booking not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Booking Details" 
        rightIcon={
          <MaterialIcons 
            name="account-circle" 
            size={40} 
            color={theme.colors.background} 
          />
        }
        onRightIconPress={handleProfilePress}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bookingDetails.status) }]}>
            <Text style={[styles.statusText, { color: theme.colors.background }]}>
              {getStatusText(bookingDetails.status)}
            </Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Customer Information
          </Text>
          <View style={styles.customerInfo}>
            <View style={styles.customerHeader}>
              {bookingDetails.customer_profile_photo ? (
                <CustomImage
                  source={{ uri: bookingDetails.customer_profile_photo }}
                  style={styles.customerPhoto}
                />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
                  <MaterialIcons name="person" size={24} color={theme.colors.background} />
                </View>
              )}
              <View style={styles.customerDetails}>
                <Text style={[styles.customerName, { color: theme.colors.text }]}>
                  {bookingDetails.customer_name}
                </Text>
                <Text style={[styles.customerContact, { color: theme.colors.textSecondary }]}>
                  {bookingDetails.customer_phone}
                </Text>
                {bookingDetails.customer_email && (
                  <Text style={[styles.customerContact, { color: theme.colors.textSecondary }]}>
                    {bookingDetails.customer_email}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Service Information */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Service Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Service
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {bookingDetails.service_name}
            </Text>
          </View>
          {bookingDetails.service_description && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Description
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {bookingDetails.service_description}
              </Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Date & Time
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {bookingDetails.booking_date} at {bookingDetails.booking_time}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Total Amount
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
              ${bookingDetails.total_amount}
            </Text>
          </View>
        </View>

        {/* Location Information */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Service Location
          </Text>
          <View style={styles.locationInfo}>
            <View style={styles.addressRow}>
              <MaterialIcons name="location-on" size={20} color={theme.colors.primary} />
              <Text style={[styles.addressText, { color: theme.colors.text }]}>
                {bookingDetails.address}
                {bookingDetails.city && `, ${bookingDetails.city}`}
                {bookingDetails.state && `, ${bookingDetails.state}`}
                {bookingDetails.postal_code && ` ${bookingDetails.postal_code}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Special Instructions */}
        {bookingDetails.special_instructions && (
          <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Special Instructions
            </Text>
            <Text style={[styles.instructionsText, { color: theme.colors.text }]}>
              {bookingDetails.special_instructions}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        {renderStatusActions()}
      </ScrollView>
      
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: moderateScale(18),
    marginTop: moderateVerticalScale(16),
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: moderateScale(16),
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: moderateVerticalScale(20),
  },
  statusBadge: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(8),
    borderRadius: moderateScale(20),
  },
  statusText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  section: {
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
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
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(12),
  },
  customerInfo: {
    gap: moderateVerticalScale(12),
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerPhoto: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    marginRight: moderateScale(12),
  },
  avatarPlaceholder: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(4),
  },
  customerContact: {
    fontSize: moderateScale(14),
    marginBottom: moderateVerticalScale(2),
  },
  infoRow: {
    marginBottom: moderateVerticalScale(12),
  },
  infoLabel: {
    fontSize: moderateScale(14),
    marginBottom: moderateVerticalScale(4),
  },
  infoValue: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  locationInfo: {
    gap: moderateVerticalScale(8),
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: moderateScale(8),
  },
  addressText: {
    flex: 1,
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
  },
  instructionsText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  },
  actionButtons: {
    gap: moderateVerticalScale(12),
    marginTop: moderateVerticalScale(20),
    marginBottom: moderateVerticalScale(40),
  },
  actionButton: {
    marginBottom: moderateVerticalScale(8),
  },
});

export default BookingDetailsServicemanScreen;
