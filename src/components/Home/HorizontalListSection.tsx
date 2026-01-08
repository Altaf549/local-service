import React from 'react';
import {View, FlatList, StyleSheet, ListRenderItem} from 'react-native';
import {SectionHeader} from '../Header/SectionHeader';
import {Spacer} from '../Spacer/Spacer';
import {moderateScale} from '../../utils/scaling';
import {useTheme} from '../../theme/ThemeContext';

export interface HorizontalListSectionProps<T> {
  title: string;
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
  itemSpacing?: number;
}

const ITEM_SPACING = moderateScale(12);

export const HorizontalListSection = <T,>({
  title,
  data,
  renderItem,
  keyExtractor,
  showSeeAll = false,
  onSeeAllPress,
  itemSpacing = ITEM_SPACING,
}: HorizontalListSectionProps<T>) => {
  const {theme} = useTheme();

  if (data.length === 0) {
    return null;
  }

  return (
    <>
      <SectionHeader
        title={title}
        showSeeAll={showSeeAll && data.length > 3}
        onSeeAllPress={onSeeAllPress}
      />
      <Spacer size={theme.spacing.md} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{width: itemSpacing}} />}
      />
      <Spacer size={theme.spacing.lg} />
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingRight: moderateScale(16),
  },
});

