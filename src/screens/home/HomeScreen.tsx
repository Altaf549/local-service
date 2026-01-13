import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import {
  BannerSection,
  BoxItem,
  CircleItem,
  HorizontalListSection,
  ProfileMenu,
} from '../../components/index';
import { Spacer } from '../../components/Spacer/Spacer';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import { BottomTabParamList, AppStackParamList, BRAHMAN, PUJA, PUJA_TYPE, SERVICE, SERVICE_CATEGORY, SERVICEMAN, SERVICE_CATEGORY_DETAILS, SERVICE_DETAILS, SERVICEMAN_DETAILS, PUJA_TYPE_DETAILS, PUJA_DETAILS, BRAHMAN_DETAILS } from '../../constant/Routes';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchHomeData } from '../../redux/slices/homeSlice';
import { moderateVerticalScale, moderateScale } from '../../utils/scaling';
import { CustomImage } from '../../components/CustomImage/CustomImage';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Home'>,
  StackNavigationProp<AppStackParamList>
>;

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { banners, service_categories, services, servicemen, puja_types, pujas, brahmans, loading, error } =
    useAppSelector(state => state.home);
  const { userData } = useAppSelector(state => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfilePress = () => {
    setShowProfileMenu(true);
  };

  const handleProfileMenuClose = () => {
    setShowProfileMenu(false);
  };

  const renderProfileImage = () => {
    if (userData?.profile_photo_url || userData?.profile_photo) {
      return (
        <CustomImage
          source={{ uri: userData.profile_photo_url || userData.profile_photo }}
          style={{
            width: moderateScale(40),
            height: moderateScale(40),
            borderRadius: moderateScale(20),
          }}
        />
      );
    }
    return (
      <MaterialIcons
        name="account-circle"
        size={40}
        color={theme.colors.background}
      />
    );
  };

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
          { backgroundColor: theme.colors.background },
        ]}>
        <Header
          title="Home"
          rightIcon={renderProfileImage()}
          onRightIconPress={handleProfilePress}
        />
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
        { backgroundColor: theme.colors.background },
      ]}>
      <Header
        title="Home"
        rightIcon={renderProfileImage()}
        onRightIconPress={handleProfilePress}
      />
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
          renderItem={({ item }) => (
            <BoxItem
              image={item.image}
              title={item.category_name}
              onPress={() => {
                navigation.navigate(SERVICE_CATEGORY_DETAILS, { id: item.id });
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
          renderItem={({ item }) => (
            <CircleItem
              image={item.image}
              title={item.service_name}
              price={item.price}
              onPress={() => {
                navigation.navigate(SERVICE_DETAILS, { id: item.id });
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
          renderItem={({ item }) => (
            <BoxItem
              image={item.profile_photo}
              title={item.name}
              onPress={() => {
                navigation.navigate(SERVICEMAN_DETAILS, { id: item.id });
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
          renderItem={({ item }) => (
            <BoxItem
              image={item.image}
              title={item.type_name}
              onPress={() => {
                navigation.navigate(PUJA_TYPE_DETAILS, { id: item.id });
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
          renderItem={({ item }) => (
            <CircleItem
              image={item.image}
              title={item.puja_name}
              price={item.price}
              onPress={() => {
                navigation.navigate(PUJA_DETAILS, { id: item.id });
              }}
            />
          )}
          keyExtractor={item => item.id.toString()}
          showSeeAll={pujas.length > 3}
          onSeeAllPress={() => {
            navigation.navigate(PUJA);
          }}
        />

        {/* Brahmans Section */}
        {brahmans.length > 0 && (
          <HorizontalListSection
            title="Brahman"
            data={brahmans}
            renderItem={({ item }) => (
              <BoxItem
                image={item.profile_photo}
                title={item.name}
                onPress={() => {
                  navigation.navigate(BRAHMAN_DETAILS, { id: item.id });
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
      <ProfileMenu
        visible={showProfileMenu}
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
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateVerticalScale(20),
  },
});

export default HomeScreen;
