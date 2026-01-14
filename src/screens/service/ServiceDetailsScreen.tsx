import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import { Button } from '../../components/Button/Button';
import { CustomImage } from '../../components/CustomImage/CustomImage';
import { ProviderCard } from '../../components/ProviderCard/ProviderCard';
import BookingModal from '../../components/BookingModal/BookingModal';
import { fetchServiceDetails } from '../../redux/slices/serviceDetailsSlice';
import { createServiceBookingThunk } from '../../redux/slices/bookingSlice';
import { RootState } from '../../redux/store';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, SERVICEMAN_DETAILS, LOGIN } from '../../constant/Routes';
import Console from '../../utils/Console';
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
import { Paragraph } from '../../components';

type ServiceDetailsNavigationProp = StackNavigationProp<AppStackParamList, 'ServiceDetails'>;

interface RouteParams {
  serviceId: number;
}

const ServiceDetailsScreen: React.FC = () => {
  Console.log('ServiceDetailsScreen', 'rendering');
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<ServiceDetailsNavigationProp>();
  const route = useRoute();

  // Add debugging and safe parameter access
  Console.log('ServiceDetailsScreen', 'route params:', route.params);
  const routeParams = route.params as any;
  const serviceId = routeParams?.id;

  Console.log('ServiceDetailsScreen', 'serviceId extracted:', serviceId);

  const { serviceDetails, loading, error } = useSelector(
    (state: RootState) => state.serviceDetails,
  );
  const { userData, isUser } = useSelector(
    (state: RootState) => state.user,
  );

  // Booking state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedServiceman, setSelectedServiceman] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    Console.log('ServiceDetailsScreen', 'useEffect called, serviceId:', serviceId);
    if (serviceId) {
      Console.log('ServiceDetailsScreen', 'dispatching fetchServiceDetails with id:', serviceId);
      dispatch(fetchServiceDetails(serviceId) as any);
    } else {
      Console.log('ServiceDetailsScreen', 'serviceId is undefined, not fetching');
    }
  }, [dispatch, serviceId]);

  const handleCallPress = (phoneNumber: string) => {
    if (!isUser || !userData) {
      Alert.alert(
        'Login Required',
        'You need to login to make a call. Would you like to login now?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate(LOGIN, { 
                returnTo: 'ServiceDetails',
                serviceId: serviceId 
              });
            },
          },
        ]
      );
      return;
    }

    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make a call');
    });
  };

  const handleDownloadPress = (fileUrl: string) => {
    if (!isUser || !userData) {
      Alert.alert(
        'Login Required',
        'You need to login to download files. Would you like to login now?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate(LOGIN, { 
                returnTo: 'ServiceDetails',
                serviceId: serviceId 
              });
            },
          },
        ]
      );
      return;
    }

    Linking.openURL(fileUrl).catch(() => {
      Alert.alert('Error', 'Unable to open file');
    });
  };

  const handleBookingPress = () => {
    if (!isUser || !userData) {
      Alert.alert(
        'Login Required',
        'You need to login to make a booking. Would you like to login now?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate(LOGIN, { 
                returnTo: 'ServiceDetails',
                serviceId: serviceId 
              });
            },
          },
        ]
      );
      return;
    }

    // Show booking modal for the service
    setSelectedServiceman(null); // Reset selected serviceman
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (bookingData: any) => {
    try {
      const result = await dispatch(createServiceBookingThunk({
        ...bookingData,
        service_id: serviceId,
        serviceman_id: selectedServiceman?.id || serviceDetails?.servicemen?.[0]?.id,
      }) as any);

      if (createServiceBookingThunk.fulfilled.match(result)) {
        Alert.alert(
          'Booking Successful',
          'Your service booking has been created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                setShowBookingModal(false);
                setSelectedServiceman(null);
              },
            },
          ]
        );
      } else {
        Alert.alert('Booking Failed', result.error?.message || 'Failed to create booking');
      }
    } catch (error: any) {
      Console.error('Booking error:', error);
      Alert.alert('Booking Failed', error.message || 'An error occurred while creating booking');
    }
  };

  const renderServiceman = (serviceman: any) => (
    <ProviderCard
      key={serviceman.id}
      id={serviceman.id}
      name={serviceman.name}
      avatar={serviceman.profile_photo}
      experience={serviceman.experience}
      price={serviceman.price}
      customPrice={serviceman.custom_price}
      phone={serviceman.phone}
      availabilityStatus={serviceman.availability_status}
      type="serviceman"
      onCall={handleCallPress}
      onPress={(id) => {
        navigation.navigate(SERVICEMAN_DETAILS, { id: id });
      }}
      onBook={() => {
        setSelectedServiceman(serviceman);
        setShowBookingModal(true);
      }}
    />
  );

  if (!serviceId) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}>
        <Header title="Service Details" />
        <View style={styles.errorContainer}>
          <Text style={{ color: theme.colors.text }}>
            Service ID is missing. Please go back and try again.
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.goBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}>
        <Header title="Service Details" />
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.colors.text }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}>
        <Header title="Service Details" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!serviceDetails) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}>
        <Header title="Service Details" />
        <View style={styles.errorContainer}>
          <Text style={{ color: theme.colors.text }}>Service not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}>
      <Header title={serviceDetails.service_name} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.mainContent, { backgroundColor: theme.colors.card }]}>
          <CustomImage
            source={{ uri: serviceDetails.image }}
            style={styles.serviceImage}
          />
        </View>
        <View style={styles.serviceInfo}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Description
          </Text>
          {serviceDetails.description ? (
            <Paragraph>{serviceDetails.description}</Paragraph>
          ) : (
            <Text style={[styles.description, { color: theme.colors.text }]}>
              No description available
            </Text>
          )}
        </View>

        {serviceDetails.servicemen && serviceDetails.servicemen.length > 0 && (
          <View style={styles.servicemenSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Available Servicemen
            </Text>
            <FlatList
              data={serviceDetails.servicemen}
              renderItem={({ item }) => renderServiceman(item)}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>

      <BookingModal
        visible={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedServiceman(null);
        }}
        onSubmit={handleBookingSubmit}
        loading={bookingLoading}
        bookingType="service"
        providerId={serviceId}
        providerName={serviceDetails?.service_name || 'Service'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
    paddingHorizontal: moderateScale(20),
  },
  errorText: {
    fontSize: scaleFont(16),
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    margin: moderateScale(16),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  serviceImage: {
    width: width,
    height: verticalScale(200),
  },
  serviceInfo: {
    flex: 1,
    padding: moderateScale(16),
    justifyContent: 'space-between',
  },
  serviceName: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
  },
  categoryName: {
    fontSize: scaleFont(14),
    marginBottom: verticalScale(8),
  },
  price: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    marginBottom: verticalScale(12),
  },
  description: {
    fontSize: scaleFont(14),
    lineHeight: verticalScale(20),
    marginBottom: verticalScale(16),
  },
  actionButtons: {
    flexDirection: 'row',
    gap: scaleSize(12),
    marginBottom: verticalScale(16),
  },
  downloadButton: {
    flex: 1,
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  downloadButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  bookButton: {
    marginTop: verticalScale(8),
  },
  servicemenSection: {
    margin: moderateScale(16),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(16),
  },
  listContainer: {
    paddingBottom: verticalScale(8),
  },
  goBackButton: {
    marginTop: verticalScale(20),
  },
});

export default ServiceDetailsScreen;
