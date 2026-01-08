import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';
import {CustomImage} from '../CustomImage/CustomImage';
import {Title} from '../Typography/Title';
import {scaleWidth, moderateScale, moderateVerticalScale, scaleFont} from '../../utils/scaling';

export interface CircleItemProps {
  image: string;
  title: string;
  price?: string;
  onPress?: () => void;
}

const CIRCLE_ITEM_WIDTH = scaleWidth(100);

export const CircleItem: React.FC<CircleItemProps> = ({
  image,
  title,
  price,
  onPress,
}) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}>
      <View
        style={[
          styles.imageContainer,
          {borderColor: theme.colors.border},
        ]}>
        <CustomImage
          source={{uri: image}}
          type="fast"
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <Title level={4} style={styles.title} numberOfLines={1}>
        {title}
      </Title>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CIRCLE_ITEM_WIDTH,
    alignItems: 'center',
  },
  imageContainer: {
    width: CIRCLE_ITEM_WIDTH,
    height: CIRCLE_ITEM_WIDTH,
    borderRadius: CIRCLE_ITEM_WIDTH / 2,
    overflow: 'hidden',
    marginBottom: moderateVerticalScale(8),
    borderWidth: moderateScale(2),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    textAlign: 'center',
    fontSize: scaleFont(12),
    marginBottom: moderateVerticalScale(4),
  },
  price: {
    textAlign: 'center',
    fontSize: scaleFont(11),
    fontWeight: '700',
  },
});

