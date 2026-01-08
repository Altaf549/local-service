import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';
import {CustomImage} from '../CustomImage/CustomImage';
import {Title} from '../Typography/Title';
import {scaleWidth, moderateScale, moderateVerticalScale, scaleFont} from '../../utils/scaling';

export interface BoxItemProps {
  image: string;
  title: string;
  onPress?: () => void;
}

const BOX_ITEM_WIDTH = scaleWidth(120);

export const BoxItem: React.FC<BoxItemProps> = ({image, title, onPress}) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
      activeOpacity={0.7}
      onPress={onPress}>
      <View style={styles.imageContainer}>
        <CustomImage
          source={{uri: image}}
          type="fast"
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <Title level={4} style={styles.title} numberOfLines={2}>
        {title}
      </Title>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BOX_ITEM_WIDTH,
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    alignItems: 'center',
    borderWidth: moderateScale(1),
  },
  imageContainer: {
    width: BOX_ITEM_WIDTH - moderateScale(24),
    height: BOX_ITEM_WIDTH - moderateScale(24),
    borderRadius: moderateScale(8),
    overflow: 'hidden',
    marginBottom: moderateVerticalScale(8),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    textAlign: 'center',
    fontSize: scaleFont(12),
  },
});

