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
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../theme/ThemeContext';
import {Header} from '../../components/Header/Header';
import {Button} from '../../components/Button/Button';
import {CustomImage} from '../../components/CustomImage/CustomImage';
import {ProviderCard} from '../../components/ProviderCard/ProviderCard';
import {AchievementCard} from '../../components/AchievementCard/AchievementCard';
import {ExperienceCard} from '../../components/ExperienceCard/ExperienceCard';
import BookingModal from '../../components/BookingModal/BookingModal';
import {Paragraph} from '../../components';
import {fetchServicemanDetails} from '../../redux/slices/servicemanDetailsSlice';
import {createServiceBookingThunk} from '../../redux/slices/bookingSlice';
import {RootState} from '../../redux/store';
import {useRoute, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList, SERVICE_DETAILS, LOGIN} from '../../constant/Routes';
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

type ServicemanDetailsNavigationProp = StackNavigationProp<AppStackParamList, 'ServicemanDetails'>;

interface RouteParams {
  servicemanId: number;
}

const ServicemanDetailsScreen: React.FC = () => {
  
  Console.log('ServicemanDetailsScreen', 'rendering');
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<ServicemanDetailsNavigationProp>();
  const route = useRoute();
  
  const routeParams = route.params as any;
  const servicemanId = routeParams?.id;
  
  Console.log('ServicemanDetailsScreen', 'servicemanId extracted:', servicemanId);
  
  const {servicemanDetails, loading, error} = useSelector(
    (state: RootState) => state.servicemanDetails,
  );
  const { userData, isUser } = useSelector(
    (state: RootState) => state.user,
  );

  // Booking state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    Console.log('ServicemanDetailsScreen', 'useEffect called, servicemanId:', servicemanId);
    if (servicemanId) {
      Console.log('ServicemanDetailsScreen', 'dispatching fetchServicemanDetails with id:', servicemanId);
      dispatch(fetchServicemanDetails(servicemanId) as any);
    }
  }, [dispatch, servicemanId]);

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
                returnTo: 'ServicemanDetails',
                servicemanId: servicemanId 
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

  const handleBookingSubmit = async (bookingData: any) => {
    try {
      const result = await dispatch(createServiceBookingThunk({
        ...bookingData,
        service_id: servicemanDetails?.services?.[0]?.service_id,
        serviceman_id: servicemanId,
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

  const handleEmailPress = (email: string) => {
    if (!isUser || !userData) {
      Alert.alert(
        'Login Required',
        'You need to login to send an email. Would you like to login now?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate(LOGIN, { 
                returnTo: 'ServicemanDetails',
                servicemanId: servicemanId 
              });
            },
          },
        ]
      );
      return;
    }

    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Error', 'Unable to open email');
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
                returnTo: 'ServicemanDetails',
                servicemanId: servicemanId 
              });
            },
          },
        ]
      );
      return;
    }

    Alert.alert('Booking', 'Booking functionality will be implemented');
  };

  const renderExperience = (experience: any) => (
    <ExperienceCard
      key={experience.id}
      id={experience.id}
      title={experience.title}
      company={experience.company}
      start_date={experience.start_date}
      end_date={experience.end_date}
      is_current={experience.is_current}
      description={experience.description}
      compact={true}
      onPress={(id) => {
        Console.log('Experience pressed:', id);
      }}
    />
  );

  const renderAchievement = (achievement: any) => (
    <AchievementCard
      key={achievement.id}
      id={achievement.id}
      title={achievement.title}
      description={achievement.description}
      achieved_date={achievement.achieved_date}
      compact={true}
      onPress={(id) => {
        Console.log('Achievement pressed:', id);
      }}
    />
  );

  const renderService = (service: any) => (
    <ProviderCard
      key={service.id}
      id={service.service_id}
      name={service.service_name}
      avatar={service.image}
      description={service.description}
      price={service.price}
      phone={servicemanDetails?.mobile_number}
      type="serviceman"
      onCall={handleCallPress}
      onPress={() => {
        navigation.navigate(SERVICE_DETAILS, {id: service.service_id});
      }}
      onBook={() => {
        setShowBookingModal(true);
      }}
    />
  );

if (!servicemanId) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.container,
          {backgroundColor: theme.colors.background},
        ]}>
        <Header title="Serviceman Details" />
        <View style={styles.errorContainer}>
          <Text style={{color: theme.colors.text}}>
            Serviceman ID is missing. Please go back and try again.
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
          {backgroundColor: theme.colors.background},
        ]}>
        <Header title="Serviceman Details" />
        <View style={styles.loadingContainer}>
          <Text style={{color: theme.colors.text}}>Loading...</Text>
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
          {backgroundColor: theme.colors.background},
        ]}>
        <Header title="Serviceman Details" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: theme.colors.error}]}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!servicemanDetails) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.container,
          {backgroundColor: theme.colors.background},
        ]}>
        <Header title="Serviceman Details" />
        <View style={styles.errorContainer}>
          <Text style={{color: theme.colors.text}}>Serviceman not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}>
      <Header title={servicemanDetails.name} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <CustomImage
            source={{uri: servicemanDetails.profile_photo}}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.name, {color: theme.colors.text}]}>
              {servicemanDetails.name}
            </Text>
            <Text style={[styles.contactItem, {color: theme.colors.text}]}>
              📍 {servicemanDetails.address}
            </Text>
            <Text style={[styles.availability, {color: 
              servicemanDetails.availability_status === 'available' ? theme.colors.success :
              servicemanDetails.availability_status === 'busy' ? theme.colors.warning :
              theme.colors.error
            }]}>
              Status: {servicemanDetails.availability_status}
            </Text>
          </View>
        </View>

        {servicemanDetails.experiences && servicemanDetails.experiences.length > 0 && (
          <View style={styles.experiencesSection}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Experience
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContainer}
            >
              {servicemanDetails.experiences.map(experience => renderExperience(experience))}
            </ScrollView>
          </View>
        )}

        {servicemanDetails.achievements && servicemanDetails.achievements.length > 0 && (
          <View style={styles.achievementsSection}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Achievements
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContainer}
            >
              {servicemanDetails.achievements.map(achievement => renderAchievement(achievement))}
            </ScrollView>
          </View>
        )}

        {servicemanDetails.services && servicemanDetails.services.length > 0 && (
          <View style={styles.servicesSection}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Services Offered
            </Text>
            <FlatList
              data={servicemanDetails.services}
              renderItem={({ item }) => renderService(item)}
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
        }}
        onSubmit={handleBookingSubmit}
        loading={bookingLoading}
        bookingType="service"
        providerId={servicemanId}
        providerName={servicemanDetails?.name || 'Serviceman'}
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: moderateScale(16),
    padding: moderateScale(16),
  },
  profileImage: {
    width: scaleSize(80),
    height: scaleSize(80),
    borderRadius: scaleSize(40),
    marginRight: scaleSize(16),
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
  },
  category: {
    fontSize: scaleFont(14),
    marginBottom: verticalScale(4),
  },
  experience: {
    fontSize: scaleFont(14),
    marginBottom: verticalScale(4),
  },
  availability: {
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  contactSection: {
    margin: moderateScale(16),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(16),
  },
  contactInfo: {
    gap: verticalScale(8),
  },
  contactItem: {
    fontSize: scaleFont(14),
    marginBottom: verticalScale(4),
  },
  experiencesSection: {
    marginVertical: verticalScale(8),
    marginHorizontal: moderateScale(16),
  },
  horizontalListContainer: {
    paddingRight: moderateScale(16),
  },
  listContainer: {
    paddingBottom: verticalScale(8),
  },
  experienceItem: {
    padding: moderateScale(16),
    marginBottom: verticalScale(12),
    borderRadius: moderateScale(8),
  },
  experienceTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  experienceCompany: {
    fontSize: scaleFont(14),
    marginBottom: verticalScale(4),
  },
  experienceDuration: {
    fontSize: scaleFont(12),
    marginBottom: verticalScale(8),
  },
  experienceDescription: {
    fontSize: scaleFont(14),
    lineHeight: verticalScale(20),
  },
  achievementsSection: {
    marginVertical: verticalScale(8),
    marginHorizontal: moderateScale(16),
  },
  achievementItem: {
    padding: moderateScale(16),
    marginBottom: verticalScale(12),
    borderRadius: moderateScale(8),
  },
  achievementTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  achievementDate: {
    fontSize: scaleFont(12),
    marginBottom: verticalScale(8),
  },
  achievementDescription: {
    fontSize: scaleFont(14),
    lineHeight: verticalScale(20),
  },
  servicesSection: {
    marginVertical: verticalScale(8),
    marginHorizontal: moderateScale(16),
  },
  serviceItem: {
    flexDirection: 'row',
    padding: moderateScale(16),
    marginBottom: verticalScale(12),
    borderRadius: moderateScale(8),
  },
  serviceImage: {
    width: scaleSize(60),
    height: scaleSize(60),
    borderRadius: moderateScale(8),
    marginRight: scaleSize(12),
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  serviceCategory: {
    fontSize: scaleFont(12),
    marginBottom: verticalScale(4),
  },
  serviceDescription: {
    fontSize: scaleFont(14),
    marginBottom: verticalScale(8),
  },
  servicePrice: {
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
  actionSection: {
    margin: moderateScale(16),
  },
  bookButton: {
    marginBottom: verticalScale(20),
  },
  goBackButton: {
    marginTop: verticalScale(20),
  },
});

export default ServicemanDetailsScreen;
