import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, ActivityIndicator, RefreshControl, View, Text, FlatList, Dimensions, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeContext';
import {Header} from '../../components/Header/Header';
import {BoxItem} from '../../components/index';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {fetchServiceCategoryDetails} from '../../redux/slices/serviceCategoryDetailsSlice';
import {moderateVerticalScale, moderateScale} from '../../utils/scaling';
import {useRoute, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {AppStackParamList, SERVICE_DETAILS} from '../../constant/Routes';

type ServiceCategoryDetailsScreenNavigationProp = StackNavigationProp<AppStackParamList, 'ServiceCategoryDetails'>;
type ServiceCategoryDetailsScreenRouteProp = RouteProp<AppStackParamList, 'ServiceCategoryDetails'>;

const {width: screenWidth} = Dimensions.get('window');

const ServiceCategoryDetailsScreen: React.FC = () => {
  const {theme} = useTheme();
  const dispatch = useAppDispatch();
  const route = useRoute<ServiceCategoryDetailsScreenRouteProp>();
  const navigation = useNavigation<ServiceCategoryDetailsScreenNavigationProp>();
  const {categoryDetails, loading, error} = useAppSelector(state => state.serviceCategoryDetails);
  const [refreshing, setRefreshing] = useState(false);
  
  const {id} = route.params;

  useEffect(() => {
    dispatch(fetchServiceCategoryDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      // Error handling is done in Redux slice
    }
  }, [error]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchServiceCategoryDetails(id)).unwrap();
    } catch (error) {
      // Error handling is done in Redux slice
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.container,
          {backgroundColor: theme.colors.background},
        ]}>
        <Header title="Service Category Details" />
        <SafeAreaView edges={[]} style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </SafeAreaView>
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
      <Header title={categoryDetails?.category_name || 'Service Category Details'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }>
        {categoryDetails ? (
          <View>
            {/* Banner-style image */}
            <View style={styles.bannerContainer}>
              <Image 
                source={{uri: categoryDetails.image}} 
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>

            {/* Services List */}
            <View style={styles.servicesContainer}>
              <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
                All Services
              </Text>
              {categoryDetails.services && categoryDetails.services.length > 0 ? (
                <FlatList
                  data={categoryDetails.services}
                  numColumns={3}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => (
                    <View style={styles.serviceItem}>
                      <BoxItem
                        image={item.image}
                        title={item.service_name}
                        width={(screenWidth - moderateScale(60)) / 3} // 3 columns with spacing
                        onPress={() => {
                          navigation.navigate(SERVICE_DETAILS, { id: item.id });
                        }}
                      />
                    </View>
                  )}
                  columnWrapperStyle={styles.serviceRow}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, {color: theme.colors.text}]}>
                    No services available in this category
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: theme.colors.text}]}>
              Service category details not available
            </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  bannerContainer: {
    height: moderateVerticalScale(200),
    marginHorizontal: moderateScale(16),
    marginVertical: moderateVerticalScale(16),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: moderateVerticalScale(12),
    paddingHorizontal: moderateScale(16),
  },
  bannerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center',
  },
  servicesContainer: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(16),
  },
  serviceRow: {
    justifyContent: 'space-between',
  },
  serviceItem: {
    marginVertical: moderateVerticalScale(4),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(40),
  },
  emptyText: {
    fontSize: moderateScale(16),
    textAlign: 'center',
  },
});

export default ServiceCategoryDetailsScreen;
