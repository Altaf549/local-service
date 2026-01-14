import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import { ProfileMenu } from '../../components/ProfileMenu/ProfileMenu';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, BOOKING_DETAILS_SERVICEMAN } from '../../constant/Routes';

interface Booking {
  id: number;
  customer_name: string;
  service_name: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  address: string;
  customer_phone: string;
}

const BookingServicemanScreen: React.FC = () => {
  const { theme } = useTheme();
  const { userData } = useAppSelector((state: RootState) => state.user);
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed'>('all');

  const handleProfilePress = () => {
    setProfileMenuVisible(true);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuVisible(false);
  };

  const fetchBookings = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await getServicemanBookings();
      
      // Mock data for now
      const mockBookings: Booking[] = [
        {
          id: 1,
          customer_name: 'John Doe',
          service_name: 'Plumbing Service',
          booking_date: '2024-01-15',
          booking_time: '10:00 AM',
          status: 'pending',
          total_amount: 150,
          address: '123 Main St, City',
          customer_phone: '+1234567890',
        },
        {
          id: 2,
          customer_name: 'Jane Smith',
          service_name: 'Electrical Repair',
          booking_date: '2024-01-14',
          booking_time: '2:00 PM',
          status: 'confirmed',
          total_amount: 200,
          address: '456 Oak Ave, City',
          customer_phone: '+0987654321',
        },
        {
          id: 3,
          customer_name: 'Bob Johnson',
          service_name: 'AC Maintenance',
          booking_date: '2024-01-13',
          booking_time: '11:00 AM',
          status: 'completed',
          total_amount: 100,
          address: '789 Pine Rd, City',
          customer_phone: '+1122334455',
        },
      ];

      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
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

  const filteredBookings = bookings.filter(booking => {
    if (selectedFilter === 'all') return true;
    return booking.status === selectedFilter;
  });

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={[styles.bookingCard, { backgroundColor: theme.colors.card }]}
      onPress={() => navigation.navigate(BOOKING_DETAILS_SERVICEMAN, { bookingId: item.id })}
    >
      <View style={styles.bookingHeader}>
        <View style={styles.bookingInfo}>
          <Text style={[styles.customerName, { color: theme.colors.text }]}>
            {item.customer_name}
          </Text>
          <Text style={[styles.serviceName, { color: theme.colors.textSecondary }]}>
            {item.service_name}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={[styles.statusText, { color: theme.colors.background }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="calendar-today" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {item.booking_date} at {item.booking_time}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="attach-money" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            ${item.total_amount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: typeof selectedFilter, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: selectedFilter === filter ? theme.colors.primary : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          {
            color: selectedFilter === filter ? theme.colors.background : theme.colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header 
          title="My Bookings" 
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="My Bookings" 
        rightIcon={
          <MaterialIcons 
            name="account-circle" 
            size={40} 
            color={theme.colors.background} 
          />
        }
        onRightIconPress={handleProfilePress}
      />
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFilterButton('all', 'All')}
          {renderFilterButton('pending', 'Pending')}
          {renderFilterButton('confirmed', 'Confirmed')}
          {renderFilterButton('in_progress', 'In Progress')}
          {renderFilterButton('completed', 'Completed')}
        </ScrollView>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons 
              name="event-busy" 
              size={64} 
              color={theme.colors.textSecondary} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No bookings found
            </Text>
          </View>
        }
      />
      
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
  filterContainer: {
    paddingVertical: moderateVerticalScale(8),
    paddingHorizontal: moderateScale(16),
  },
  filterButton: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(8),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(8),
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  listContainer: {
    padding: moderateScale(16),
  },
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
  customerName: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(4),
  },
  serviceName: {
    fontSize: moderateScale(14),
  },
  statusBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateVerticalScale(4),
    borderRadius: moderateScale(12),
  },
  statusText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  bookingDetails: {
    gap: moderateVerticalScale(8),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  detailText: {
    fontSize: moderateScale(14),
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(60),
  },
  emptyText: {
    fontSize: moderateScale(16),
    marginTop: moderateVerticalScale(16),
    textAlign: 'center',
  },
});

export default BookingServicemanScreen;
