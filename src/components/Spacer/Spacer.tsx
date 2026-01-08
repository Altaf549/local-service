import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';

export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | number;
  horizontal?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  horizontal = false,
  style,
  testID,
}) => {
  const {theme} = useTheme();

  const getSize = (): number => {
    if (typeof size === 'number') {
      return size;
    }
    return theme.spacing[size];
  };

  return (
    <View
      style={[
        horizontal
          ? {width: getSize()}
          : {height: getSize()},
        style,
      ]}
      testID={testID}
    />
  );
};

const styles = StyleSheet.create({});

