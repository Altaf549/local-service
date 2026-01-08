import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, ActivityIndicator, RefreshControl, View, Text, FlatList, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeContext';
import {Header} from '../../components/Header/Header';
import {BoxItem} from '../../components/index';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {fetchPujaTypes} from '../../redux/slices/pujaTypeSlice';
import {moderateVerticalScale, moderateScale} from '../../utils/scaling';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';;
import {AppStackParamList, PUJA_TYPE_DETAILS} from '../../constant/Routes';

type PujaTypeScreenNavigationProp = StackNavigationProp<AppStackParamList, 'PujaType'>;

const {width: screenWidth} = Dimensions.get('window');

const PujaTypeScreen: React.FC = () => {
  const {theme} = useTheme();
  const dispatch = useAppDispatch();
  const {pujaTypes, loading, error} = useAppSelector(state => state.pujaType);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<PujaTypeScreenNavigationProp>();
  
  // Calculate item width for 3-column grid with spacing
  const itemWidth = (screenWidth - moderateScale(32) - moderateScale(16)) / 3; // 32 padding, 16 spacing between items

  useEffect(() => {
    dispatch(fetchPujaTypes());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // Error handling is done in Redux slice
    }
  }, [error]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchPujaTypes()).unwrap();
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
        <Header title="Puja Types" />
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
      <Header title="Puja Types" />
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
        {pujaTypes.length > 0 ? (
          <View>
            <FlatList
              data={pujaTypes}
              numColumns={3}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View style={styles.gridItem}>
                  <BoxItem
                    image={item.image}
                    title={item.type_name}
                    width={itemWidth}
                    onPress={() => {
                      navigation.navigate(PUJA_TYPE_DETAILS, { id: item.id });
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
              No puja types available
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

export default PujaTypeScreen;