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
import {Paragraph} from '../../components';
import {fetchBrahmanDetails} from '../../redux/slices/brahmanDetailsSlice';
import {RootState} from '../../redux/store';
import {useRoute, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList, PUJA_DETAILS} from '../../constant/Routes';
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

type BrahmanDetailsNavigationProp = StackNavigationProp<AppStackParamList, 'BrahmanDetails'>;

interface RouteParams {
  brahmanId: number;
}

const BrahmanDetailsScreen: React.FC = () => {
  Console.log('BrahmanDetailsScreen', 'rendering');
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<BrahmanDetailsNavigationProp>();
  const route = useRoute();
  
  const routeParams = route.params as any;
  const brahmanId = routeParams?.id;
  
  Console.log('BrahmanDetailsScreen', 'brahmanId extracted:', brahmanId);
  
  const {brahmanDetails, loading, error} = useSelector(
    (state: RootState) => state.brahmanDetails,
  );

  useEffect(() => {
    Console.log('BrahmanDetailsScreen', 'useEffect called, brahmanId:', brahmanId);
    if (brahmanId) {
      Console.log('BrahmanDetailsScreen', 'dispatching fetchBrahmanDetails with id:', brahmanId);
      dispatch(fetchBrahmanDetails(brahmanId) as any);
    }
  }, [dispatch, brahmanId]);

  const handleCallPress = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make a call');
    });
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Error', 'Unable to open email');
    });
  };

  const handleBookingPress = () => {
    Alert.alert('Booking', 'Booking functionality will be implemented');
  };

  const handleDownloadPress = (materialFile: string) => {
    Linking.openURL(materialFile).catch(() => {
      // Fallback to Google Docs viewer
      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(materialFile)}`;
      Linking.openURL(googleDocsUrl).catch(() => {
        Alert.alert('Error', 'Unable to open file');
      });
    });
  };

const renderExperience = (experience: any) => (
    <ExperienceCard
      key={experience.id}
      id={experience.id}
      title={experience.title}
      company={experience.organization}
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
      id={service.puja_id}
      name={service.puja_name}
      avatar={service.image}
      description={service.description}
      price={service.price}
      phone={brahmanDetails?.mobile_number}
      type="brahman"
      onCall={handleCallPress}
      onDownload={handleDownloadPress}
      materialFile={service.material_file}
      onPress={() => {
        navigation.navigate(PUJA_DETAILS, {id: service.puja_id});
      }}
    />
  );

if (!brahmanId) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.container,
          {backgroundColor: theme.colors.background},
        ]}>
        <Header title="Brahman Details" />
        <View style={styles.errorContainer}>
          <Text style={{color: theme.colors.text}}>
            Brahman ID is missing. Please go back and try again.
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
        <Header title="Brahman Details" />
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
        <Header title="Brahman Details" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: theme.colors.error}]}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!brahmanDetails) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.container,
          {backgroundColor: theme.colors.background},
        ]}>
        <Header title="Brahman Details" />
        <View style={styles.errorContainer}>
          <Text style={{color: theme.colors.text}}>Brahman not found</Text>
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
      <Header title={brahmanDetails.name} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <CustomImage
            source={{uri: brahmanDetails.profile_photo}}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.name, {color: theme.colors.text}]}>
              {brahmanDetails.name}
            </Text>
            <Text style={[styles.contactItem, {color: theme.colors.text}]}>
              📍 {brahmanDetails.address}
            </Text>
            <Text style={[styles.availability, {color: 
              brahmanDetails.availability_status === 'available' ? theme.colors.success :
              brahmanDetails.availability_status === 'busy' ? theme.colors.warning :
              theme.colors.error
            }]}>
              Status: {brahmanDetails.availability_status}
            </Text>
          </View>
        </View>

        {brahmanDetails.experiences && brahmanDetails.experiences.length > 0 && (
          <View style={styles.experiencesSection}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Experience
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContainer}
            >
              {brahmanDetails.experiences.map(experience => renderExperience(experience))}
            </ScrollView>
          </View>
        )}

        {brahmanDetails.achievements && brahmanDetails.achievements.length > 0 && (
          <View style={styles.achievementsSection}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Achievements
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContainer}
            >
              {brahmanDetails.achievements.map(achievement => renderAchievement(achievement))}
            </ScrollView>
          </View>
        )}

        {brahmanDetails.services && brahmanDetails.services.length > 0 && (
          <View style={styles.servicesSection}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Services Offered
            </Text>
            <FlatList
              data={brahmanDetails.services}
              renderItem={({ item }) => renderService(item)}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
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
  availability: {
    fontSize: scaleFont(14),
    fontWeight: '600',
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
  achievementsSection: {
    marginVertical: verticalScale(8),
    marginHorizontal: moderateScale(16),
  },
  servicesSection: {
    marginVertical: verticalScale(8),
    marginHorizontal: moderateScale(16),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(16),
  },
  actionSection: {
    marginVertical: verticalScale(8),
    marginHorizontal: moderateScale(16),
  },
  bookButton: {
    marginBottom: verticalScale(20),
  },
  goBackButton: {
    marginTop: verticalScale(20),
  },
});

export default BrahmanDetailsScreen;
