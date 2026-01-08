import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, ActivityIndicator, RefreshControl, View, Text, FlatList, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeContext';
import {Header} from '../../components/Header/Header';
import {CircleItem} from '../../components/index';
import {Spacer} from '../../components/Spacer/Spacer';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {fetchServices} from '../../redux/slices/serviceSlice';
import {moderateVerticalScale, moderateScale} from '../../utils/scaling';

const {width: screenWidth} = Dimensions.get('window');

const ServiceScreen: React.FC = () => {
  const {theme} = useTheme();
  const dispatch = useAppDispatch();
  const {services, loading, error} = useAppSelector(state => state.service);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // Error handling is done in Redux slice
    }
  }, [error]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchServices()).unwrap();
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
        <Header title="Services" />
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
      <Header title="Services" />
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
        {services.length > 0 ? (
          <View>
            <FlatList
              data={services}
              numColumns={3}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View style={styles.gridItem}>
                  <CircleItem
                    image={item.image}
                    title={item.service_name}
                    onPress={() => {
                      // TODO: Navigate to service details
                    }}
                  />
                </View>
              )}
              columnWrapperStyle={styles.circleRow}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: theme.colors.text}]}>
              No services available
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
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(16),
  },
  row: {
    justifyContent: 'space-between',
  },
  circleRow: {
    justifyContent: 'space-around',
    paddingHorizontal: moderateScale(8),
  },
  gridItem: {
    marginVertical: moderateVerticalScale(4),
    alignItems: 'center',
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

export default ServiceScreen;
