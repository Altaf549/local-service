import React, {useRef, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {CustomImage} from '../CustomImage/CustomImage';
import {Banner} from '../../types/home';
import {width as SCREEN_WIDTH, scaleHeight, moderateScale} from '../../utils/scaling';

export interface BannerSectionProps {
  banners: Banner[];
  autoScrollInterval?: number;
}

const BANNER_HEIGHT = scaleHeight(200);
const DEFAULT_AUTO_SCROLL_INTERVAL = 3000; // 3 seconds
const MULTIPLIER = 1000; // Large number for infinite scroll illusion

export const BannerSection: React.FC<BannerSectionProps> = ({
  banners,
  autoScrollInterval = DEFAULT_AUTO_SCROLL_INTERVAL,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(0);
  const scrollEnabledRef = useRef(true);
  const [infiniteData, setInfiniteData] = useState<Banner[]>([]);
  const [initialIndex, setInitialIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) {
      return;
    }

    if (banners.length === 1) {
      setInfiniteData(banners);
      setInitialIndex(0);
      return;
    }

    // Create infinite data array
    const data: Banner[] = [];
    for (let i = 0; i < MULTIPLIER; i++) {
      data.push(...banners);
    }
    setInfiniteData(data);
    
    // Start from middle position
    const startIndex = Math.floor((MULTIPLIER * banners.length) / 2);
    setInitialIndex(startIndex);
    currentIndexRef.current = startIndex;
  }, [banners]);

  useEffect(() => {
    if (banners.length <= 1 || initialIndex === 0) {
      return;
    }

    // Scroll to initial position after data is set
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: initialIndex,
        animated: false,
      });
    }, 100);

    const interval = setInterval(() => {
      if (!scrollEnabledRef.current) {
        return;
      }

      currentIndexRef.current += 1;
      flatListRef.current?.scrollToIndex({
        index: currentIndexRef.current,
        animated: true,
      });
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [banners.length, initialIndex, autoScrollInterval]);

  if (banners.length === 0) {
    return null;
  }

  const renderBanner = ({item, index}: {item: Banner; index: number}) => {
    // Use a unique key based on index to avoid conflicts
    return (
      <View style={styles.bannerContainer}>
        <CustomImage
          source={{uri: item.image}}
          type="fast"
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  const getItemLayout = (_: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  const onMomentumScrollEnd = (event: any) => {
    if (banners.length <= 1) {
      return;
    }

    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    currentIndexRef.current = index;

    // Reset to middle when near edges for infinite scroll
    const middleStart = Math.floor((MULTIPLIER * banners.length) / 2);
    const middleEnd = middleStart + banners.length;

    if (index < middleStart - banners.length || index > middleEnd + banners.length) {
      const resetIndex = middleStart + (index % banners.length);
      currentIndexRef.current = resetIndex;
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: resetIndex,
          animated: false,
        });
      }, 50);
    }
  };

  const onScrollBeginDrag = () => {
    scrollEnabledRef.current = false;
  };

  const onScrollEndDrag = () => {
    scrollEnabledRef.current = true;
  };

  return (
    <FlatList
      ref={flatListRef}
      data={infiniteData}
      renderItem={renderBanner}
      keyExtractor={(_, index) => `banner-${index}`}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.bannerList}
      getItemLayout={getItemLayout}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onScrollBeginDrag={onScrollBeginDrag}
      onScrollEndDrag={onScrollEndDrag}
      onScrollToIndexFailed={(info) => {
        const wait = new Promise<void>((resolve) => setTimeout(resolve, 100));
        wait.then(() => {
          flatListRef.current?.scrollToIndex({
            index: info.index,
            animated: false,
          });
        });
      }}
      initialScrollIndex={initialIndex}
    />
  );
};

const styles = StyleSheet.create({
  bannerList: {
    marginHorizontal: moderateScale(-16),
  },
  bannerContainer: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
});

