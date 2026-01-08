import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, ActivityIndicator, RefreshControl, View, Text, FlatList, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeContext';
import {Header} from '../../components/Header/Header';
import {BoxItem} from '../../components/index';
import {Spacer} from '../../components/Spacer/Spacer';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {fetchBrahmans} from '../../redux/slices/brahmanSlice';
import {moderateVerticalScale, moderateScale} from '../../utils/scaling';

const {width: screenWidth} = Dimensions.get('window');

const BrahmanScreen: React.FC = () => {
  const {theme} = useTheme();
  const dispatch = useAppDispatch();
  const {brahmans, loading, error} = useAppSelector(state => state.brahman);
  const [refreshing, setRefreshing] = useState(false);
  
  // Calculate item width for 3-column grid with spacing
  const itemWidth = (screenWidth - moderateScale(32) - moderateScale(16)) / 3; // 32 padding, 16 spacing between items

  useEffect(() => {
    dispatch(fetchBrahmans());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // Error handling is done in Redux slice
    }
  }, [error]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchBrahmans()).unwrap();
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
        <Header title="Brahmans" />
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
      <Header title="Brahmans" />
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
        {brahmans.length > 0 ? (
          <View>
            <FlatList
              data={brahmans}
              numColumns={3}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View style={styles.gridItem}>
                  <BoxItem
                    image={item.profile_photo}
                    title={item.name}
                    width={itemWidth}
                    onPress={() => {
                      // TODO: Navigate to brahman details
                    }}
                  />
                </View>
              )}
              columnWrapperStyle={styles.row}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: theme.colors.text}]}>
              No brahmans available
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
  gridItem: {
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

export default BrahmanScreen;