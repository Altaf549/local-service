import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../theme/ThemeContext';
import {Header} from '../../components/Header/Header';
import {Button} from '../../components/Button/Button';
import {CustomImage} from '../../components/CustomImage/CustomImage';
import {ProviderCard} from '../../components/ProviderCard/ProviderCard';
import {RootState} from '../../redux/store';
import {useRoute, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList, BRAHMAN_DETAILS} from '../../constant/Routes';
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
import { fetchPujaDetails } from '../../redux/slices/pujaDetailsSlice';

type PujaDetailsNavigationProp = StackNavigationProp<AppStackParamList, 'PujaDetails'>;

interface RouteParams {
  pujaId: number;
}

const PujaDetailsScreen: React.FC = () => {
  Console.log('PujaDetailsScreen', 'rendering');
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<PujaDetailsNavigationProp>();
  const route = useRoute();
  
  const routeParams = route.params as any;
  const pujaId = routeParams?.id;
  
  Console.log('PujaDetailsScreen', 'pujaId extracted:', pujaId);
  
  const {pujaDetails, loading, error} = useSelector(
    (state: RootState) => state.pujaDetails,
  );

  useEffect(() => {
    Console.log('PujaDetailsScreen', 'useEffect called, pujaId:', pujaId);
    if (pujaId) {
      Console.log('PujaDetailsScreen', 'dispatching fetchPujaDetails with id:', pujaId);
      dispatch(fetchPujaDetails(pujaId) as any);
    }
  }, [dispatch, pujaId]);

  const handleCallPress = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make a call');
    });
  };

  const handleDownloadPress = async (fileUrl: string) => {
    try {
      // Check if URL is valid
      if (!fileUrl) {
        Alert.alert('Error', 'No file URL provided');
        return;
      }

      Console.log('Attempting to download file:', fileUrl);
      
      // For PDF files, force open in external browser
      await Linking.openURL(fileUrl);
      
    } catch (error) {
      Console.error('Download error:', error);
      
      // If direct opening fails, try to open in browser
      try {
        await Linking.openURL(fileUrl);
      } catch (browserError) {
        Console.error('Browser error:', browserError);
        Alert.alert('Error', 'Unable to open file. Please try again.');
      }
    }
  };

  const handleBookingPress = () => {
    Alert.alert('Booking', 'Booking functionality will be implemented');
  };

  const renderBrahman = (brahman: any) => (
    <ProviderCard
      key={brahman.id}
      id={brahman.id}
      name={brahman.name}
      avatar={brahman.profile_photo}
      experience={brahman.experience}
      price={brahman.price}
      customPrice={brahman.custom_price}
      phone={brahman.mobile_number}
      description={brahman.specialization}
      charges={brahman.charges}
      availabilityStatus={brahman.availability_status}
      materialFile={brahman.material_file}
      type="brahman"
      onCall={handleCallPress}
      onDownload={handleDownloadPress}
      onPress={(id) => {
        navigation.navigate(BRAHMAN_DETAILS, {id: id});
      }}
    />
  );

  if (!pujaId) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.container,
          {backgroundColor: theme.colors.background},
        ]}>
        <Header title="Puja Details" />
        <View style={styles.errorContainer}>
          <Text style={{color: theme.colors.text}}>
            Puja ID is missing. Please go back and try again.
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
        <Header title="Puja Details" />
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
        <Header title="Puja Details" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: theme.colors.error}]}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!pujaDetails) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.container,
          {backgroundColor: theme.colors.background},
        ]}>
        <Header title="Puja Details" />
        <View style={styles.errorContainer}>
          <Text style={{color: theme.colors.text}}>Puja not found</Text>
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
      <Header title={pujaDetails.puja_name} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.mainContent, {backgroundColor: theme.colors.card}]}>
          <CustomImage
            source={{uri: pujaDetails.image}}
            style={styles.pujaImage}
          />
          <View style={styles.pujaInfo}>
            <View style={styles.actionButtons}>
              {pujaDetails.material_file && (
                <TouchableOpacity
                  style={[styles.downloadButton, {backgroundColor: theme.colors.secondary}]}
                  onPress={() => pujaDetails.material_file && handleDownloadPress(pujaDetails.material_file)}>
                  <Text style={[styles.downloadButtonText, {color: theme.colors.background}]}>
                    Download Materials
                  </Text>
                </TouchableOpacity>
              )}
              
              <Button
                title="Book Puja"
                onPress={handleBookingPress}
                style={styles.bookButton}
              />
            </View>
          </View>
        </View>

        {pujaDetails.brahmans && pujaDetails.brahmans.length > 0 && (
          <View style={styles.brahmansSection}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Available Brahmans
            </Text>
            {pujaDetails.brahmans.map(brahman => renderBrahman(brahman))}
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
  mainContent: {
    flexDirection: 'row',
    margin: moderateScale(16),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  pujaImage: {
    width: width,
  },
  pujaInfo: {
    flex: 1,
    padding: moderateScale(16),
    justifyContent: 'space-between',
  },
  pujaName: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
  },
  pujaType: {
    fontSize: scaleFont(14),
    marginBottom: verticalScale(8),
  },
  duration: {
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
  bookButton: {
    flex: 1,
  },
  brahmansSection: {
    margin: moderateScale(16),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(16),
  },
  goBackButton: {
    marginTop: verticalScale(20),
  },
});

export default PujaDetailsScreen;
