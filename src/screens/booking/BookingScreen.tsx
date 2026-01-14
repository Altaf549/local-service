import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Header, BookingCard } from '../../components';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { fetchUserBookings } from '../../redux/slices/bookingSlice';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../constant/Routes';
import { Booking } from '../../redux/slices/bookingSlice';

type BookingScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Booking'>;

const BookingScreen: React.FC = () => {
  const { theme } = useTheme();
  const { userData } = useAppSelector((state: RootState) => state.user);
  const { bookings, loading, error } = useAppSelector((state: RootState) => state.bookings);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      await dispatch(fetchUserBookings()).unwrap();
    } catch (error: any) {
      const errorMessage = error || 'Failed to fetch bookings';
      Alert.alert('Error', errorMessage);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

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
      case 'rejected':
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

  const handleBookingPress = (bookingId: number) => {
    navigation.navigate('BookingDetails', { bookingId });
  };

  if (!userData) {
    return (
      <SafeAreaView edges={['left', 'right']} style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="My Bookings" />
        <View style={styles.content}>
          <Text style={[styles.message, { color: theme.colors.text }]}>
            Please login to view your bookings
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="My Bookings" />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading bookings...
          </Text>
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons 
            name="event-busy" 
            size={moderateScale(64)} 
            color={theme.colors.textSecondary} 
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No Bookings Found
          </Text>
          <Text style={[styles.emptyMessage, { color: theme.colors.textSecondary }]}>
            You haven't made any bookings yet. Start by booking a service or puja.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={({ item }) => (
            <BookingCard 
              booking={item} 
              onPress={handleBookingPress}
            />
          )}
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
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: moderateScale(16),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(40),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginTop: moderateVerticalScale(16),
    marginBottom: moderateVerticalScale(8),
  },
  emptyMessage: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    lineHeight: moderateVerticalScale(24),
  },
  listContainer: {
    padding: moderateScale(16),
  },
  message: {
    fontSize: moderateScale(18),
    textAlign: 'center',
  },
});

export default BookingScreen;
