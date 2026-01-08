import React from 'react';
import {Image, ImageStyle, ImageSourcePropType, StyleSheet} from 'react-native';
import FastImage, {FastImageProps, Source} from 'react-native-fast-image';
import {useTheme} from '../../theme/ThemeContext';

export type ImageType = 'default' | 'fast';

export interface CustomImageProps {
  source: ImageSourcePropType | Source;
  type?: ImageType;
  style?: ImageStyle;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  testID?: string;
}

export const CustomImage: React.FC<CustomImageProps> = ({
  source,
  type = 'default',
  style,
  resizeMode = 'cover',
  testID,
}) => {
  const {theme} = useTheme();

  if (type === 'fast') {
    return (
      <FastImage
        source={source as Source}
        style={[styles.image, style]}
        resizeMode={
          resizeMode === 'cover'
            ? FastImage.resizeMode.cover
            : resizeMode === 'contain'
            ? FastImage.resizeMode.contain
            : resizeMode === 'stretch'
            ? FastImage.resizeMode.stretch
            : FastImage.resizeMode.center
        }
        testID={testID}
      />
    );
  }

  return (
    <Image
      source={source as ImageSourcePropType}
      style={[styles.image, style]}
      resizeMode={resizeMode}
      testID={testID}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

