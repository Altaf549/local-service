import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, ActivityIndicator, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useTheme} from '../../theme/ThemeContext';
import {Header} from '../../components/Header/Header';
import {
  BannerSection,
  BoxItem,
  CircleItem,
  HorizontalListSection,
} from '../../components/index';
import {Spacer} from '../../components/Spacer/Spacer';

import {BottomTabParamList, BRAHMAN, PUJA, PUJA_TYPE, SERVICE, SERVICE_CATEGORY, SERVICEMAN} from '../../constant/Routes';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {fetchHomeData} from '../../redux/slices/homeSlice';
import {moderateVerticalScale, moderateScale} from '../../utils/scaling';

type HomeScreenNavigationProp = BottomTabNavigationProp<BottomTabParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const {banners, service_categories, services, servicemen, puja_types, pujas, brahmans, loading, error} =
    useAppSelector(state => state.home);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // Error handling is done in Redux slice
    }
  }, [error]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchHomeData()).unwrap();
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
        <Header title="Home" />
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
      <Header title="Home" />
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
        {/* Banner Section */}
        {banners.length > 0 && (
          <>
            <BannerSection banners={banners} />
            <Spacer size={theme.spacing.lg} />
          </>
        )}

        {/* Service Categories Section */}
        <HorizontalListSection
          title="Service Category"
          data={service_categories}
          renderItem={({item}) => (
            <BoxItem
              image={item.image}
              title={item.category_name}
              onPress={() => {
                // TODO: Navigate to puja details
              }}
            />
          )}
          keyExtractor={item => item.id.toString()}
          showSeeAll={service_categories.length > 3}
          onSeeAllPress={() => {
            navigation.navigate(SERVICE_CATEGORY);
          }}
        />

        {/* Services Section */}
        <HorizontalListSection
          title="Service"
          data={services}
          renderItem={({item}) => (
            <CircleItem
              image={item.image}
              title={item.service_name}
              price={item.price}
              onPress={() => {
                // TODO: Navigate to service details
              }}
            />
          )}
          keyExtractor={item => item.id.toString()}
          showSeeAll={services.length > 3}
          onSeeAllPress={() => {
            navigation.navigate(SERVICE); 
          }}
        />

        {/* Servicemen Section */}
        <HorizontalListSection
          title="Serviceman"
          data={servicemen}
          renderItem={({item}) => (
            <BoxItem
              image={item.profile_photo}
              title={item.name}
              onPress={() => {
                // TODO: Navigate to serviceman details
              }}
            />
          )}
          keyExtractor={item => item.id.toString()}
          showSeeAll={servicemen.length > 3}
          onSeeAllPress={() => {
            navigation.navigate(SERVICEMAN); 
          }}
        />

        {/* Puja Types Section */}
        <HorizontalListSection
          title="Puja Type"
          data={puja_types}
          renderItem={({item}) => (
            <BoxItem
              image={item.image}
              title={item.type_name}
              onPress={() => {
                // TODO: Navigate to puja details
              }}
            />
          )}
          keyExtractor={item => item.id.toString()}
          showSeeAll={puja_types.length > 3}
          onSeeAllPress={() => {
            navigation.navigate(PUJA_TYPE)
          }}
        />

        {/* Pujas Section */}
        <HorizontalListSection
          title="Puja"
          data={pujas}
          renderItem={({item}) => (
            <CircleItem
              image={item.image}
              title={item.puja_name}
              price={item.price}
              onPress={() => {
                // TODO: Navigate to puja details
              }}
            />
          )}
          keyExtractor={item => item.id.toString()}
          showSeeAll={pujas.length > 3}
          onSeeAllPress={() =>{
            navigation.navigate(PUJA);
          }}
        />

        {/* Brahmans Section */}
        {brahmans.length > 0 && (
          <HorizontalListSection
            title="Brahman"
            data={brahmans}
            renderItem={({item}) => (
              <BoxItem
                image={item.profile_photo}
                title={item.name}
                onPress={() => {
                // TODO: Navigate to puja details
              }}
              />
            )}
            keyExtractor={item => item.id.toString()}
            showSeeAll={brahmans.length > 3}
            onSeeAllPress={() => {
              navigation.navigate(BRAHMAN);
            }}
          />
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
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateVerticalScale(20),
  },
});

export default HomeScreen;
